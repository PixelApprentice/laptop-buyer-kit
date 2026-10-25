"""Safe read-only Linux hardware telemetry collector using sysfs, /proc, and smartctl."""
from __future__ import annotations

import json
import os
import platform
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .base import safe_exec


def _read_int(path: Path) -> int | None:
    try:
        raw = path.read_text(encoding="utf-8").strip()
        return int(raw)
    except (OSError, ValueError):
        return None


def _read_str(path: Path) -> str | None:
    try:
        raw = path.read_text(encoding="utf-8").strip()
        return raw or None
    except OSError:
        return None


class LinuxCollector:
    """Read-only hardware collector for Linux systems."""

    def __init__(
        self,
        sysfs_root: str | Path = "/sys",
        proc_root: str | Path = "/proc",
    ) -> None:
        self.sysfs = Path(sysfs_root)
        self.proc = Path(proc_root)

    def collect_battery(self) -> dict[str, Any] | None:
        """Collect battery metrics from Linux sysfs power_supply subsystem."""
        ps_dir = self.sysfs / "class" / "power_supply"
        if not ps_dir.is_dir():
            return None

        # Look for battery devices (commonly BAT0, BAT1, or type=Battery)
        bat_dirs = []
        try:
            for entry in ps_dir.iterdir():
                dev_type = _read_str(entry / "type")
                if entry.name.startswith("BAT") or dev_type == "Battery":
                    bat_dirs.append(entry)
        except OSError:
            return None

        if not bat_dirs:
            return None

        # Check each battery directory for valid readings
        for bat in sorted(bat_dirs, key=lambda p: p.name):
            source = f"linux-sysfs:{bat}"

            # 1. Try energy measurements (uWh) -> convert to mWh
            energy_design_uwh = _read_int(bat / "energy_full_design")
            energy_full_uwh = _read_int(bat / "energy_full")

            design_mwh: float | None = None
            full_mwh: float | None = None

            if energy_design_uwh is not None and energy_full_uwh is not None and energy_design_uwh > 0:
                design_mwh = round(energy_design_uwh / 1000.0, 1)
                full_mwh = round(energy_full_uwh / 1000.0, 1)
            else:
                # 2. Try charge measurements (uAh) + voltage (uV) -> convert to mWh
                charge_design_uah = _read_int(bat / "charge_full_design")
                charge_full_uah = _read_int(bat / "charge_full")
                voltage_uv = _read_int(bat / "voltage_now") or _read_int(bat / "voltage_min_design")

                if (
                    charge_design_uah is not None
                    and charge_full_uah is not None
                    and voltage_uv is not None
                    and charge_design_uah > 0
                    and voltage_uv > 0
                ):
                    # (uAh * uV) / 1,000,000,000 = mWh
                    design_mwh = round((charge_design_uah * voltage_uv) / 1_000_000_000.0, 1)
                    full_mwh = round((charge_full_uah * voltage_uv) / 1_000_000_000.0, 1)

            if design_mwh is not None and full_mwh is not None:
                cycles = _read_int(bat / "cycle_count")
                status = _read_str(bat / "status")
                technology = _read_str(bat / "technology")

                result: dict[str, Any] = {
                    "source": source,
                    "design_capacity_mwh": design_mwh,
                    "full_charge_capacity_mwh": full_mwh,
                }
                if cycles is not None:
                    result["cycle_count"] = cycles
                if status:
                    result["status"] = status
                if technology:
                    result["technology"] = technology

                return result

        return None

    def collect_memory(self) -> dict[str, Any]:
        """Collect memory metrics from /proc/meminfo."""
        meminfo = self.proc / "meminfo"
        total_bytes = None
        available_bytes = None

        try:
            for line in meminfo.read_text(encoding="utf-8").splitlines():
                if line.startswith("MemTotal:"):
                    parts = line.split()
                    if len(parts) >= 2:
                        total_bytes = int(parts[1]) * 1024
                elif line.startswith("MemAvailable:"):
                    parts = line.split()
                    if len(parts) >= 2:
                        available_bytes = int(parts[1]) * 1024
        except (OSError, ValueError):
            pass

        return {
            "source": f"linux-proc:{meminfo}",
            "total_bytes": total_bytes,
            "available_bytes": available_bytes,
        }

    def collect_system(self) -> dict[str, Any]:
        """Collect vendor, model, and BIOS info without collecting serial numbers."""
        dmi_id = self.sysfs / "class" / "dmi" / "id"
        vendor = _read_str(dmi_id / "sys_vendor")
        model = _read_str(dmi_id / "product_name") or _read_str(dmi_id / "product_version")
        bios_version = _read_str(dmi_id / "bios_version")
        bios_date = _read_str(dmi_id / "bios_date")

        return {
            "vendor": vendor or "Unknown",
            "model": model or "Unknown Linux Host",
            "bios_version": bios_version,
            "bios_date": bios_date,
            "os_name": platform.system(),
            "kernel_release": platform.release(),
            "architecture": platform.machine(),
        }

    def collect_storage(self) -> dict[str, Any]:
        """Enumerate internal physical storage devices and read SMART/NVMe telemetry if available."""
        devices: list[dict[str, Any]] = []
        block_dir = self.sysfs / "block"

        if block_dir.is_dir():
            try:
                for entry in sorted(block_dir.iterdir()):
                    name = entry.name
                    # Filter virtual, loop, ram, and zram devices
                    if (
                        name.startswith("loop")
                        or name.startswith("ram")
                        or name.startswith("zram")
                        or name.startswith("dm-")
                    ):
                        continue

                    # Read size in 512-byte sectors
                    sectors = _read_int(entry / "size")
                    if sectors is None or sectors <= 0:
                        continue
                    capacity_bytes = sectors * 512

                    dev_path = f"/dev/{name}"
                    model = _read_str(entry / "device" / "model") or name
                    protocol = "nvme" if name.startswith("nvme") else "ata"

                    dev_entry: dict[str, Any] = {
                        "model": model,
                        "device_node": dev_path,
                        "capacity_bytes": capacity_bytes,
                        "protocol": protocol,
                        "source": f"linux-sysfs:{entry}",
                    }

                    # Safely probe smartctl if executable exists
                    smart_res = safe_exec(["smartctl", "--json=c", "-x", dev_path], timeout_seconds=4.0)
                    if smart_res.returncode in (0, 4) and smart_res.stdout:
                        try:
                            smart_data = json.loads(smart_res.stdout)
                            dev_entry = self._parse_smartctl_json(dev_entry, smart_data)
                        except json.JSONDecodeError:
                            pass

                    devices.append(dev_entry)
            except OSError:
                pass

        return {"devices": devices}

    def _parse_smartctl_json(self, dev: dict[str, Any], data: dict[str, Any]) -> dict[str, Any]:
        """Extract SMART/NVMe telemetry safely from smartctl JSON."""
        # NVMe SMART data
        nvme_health = data.get("nvme_smart_health_information_log")
        if isinstance(nvme_health, dict):
            if "percentage_used" in nvme_health:
                dev["nvme_percentage_used"] = nvme_health["percentage_used"]
            if "critical_warning" in nvme_health:
                dev["nvme_critical_warning"] = nvme_health["critical_warning"]
            if "media_errors" in nvme_health:
                dev["media_errors"] = nvme_health["media_errors"]
            if "power_on_hours" in nvme_health:
                dev["power_on_hours"] = nvme_health["power_on_hours"]

        # Self-test status
        test_status = (data.get("ata_smart_data") or {}).get("self_test", {}).get("status", {})
        if isinstance(test_status, dict) and "string" in test_status:
            dev["self_test_status"] = test_status["string"]

        return dev

    def collect_snapshot(self, claims: dict[str, Any] | None = None) -> dict[str, Any]:
        """Produce a normalized inspection snapshot dictionary ready for analysis."""
        now = datetime.now(timezone.utc).isoformat()
        return {
            "schema_version": "1.0",
            "inspection": {
                "id": f"LINUX-COLLECT-{int(datetime.now(timezone.utc).timestamp())}",
                "collected_at": now,
            },
            "system": self.collect_system(),
            "claims": claims or {},
            "battery": self.collect_battery(),
            "storage": self.collect_storage(),
            "memory": self.collect_memory(),
        }
