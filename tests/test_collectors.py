import tempfile
import unittest
from pathlib import Path

from laptop_inspector.analysis import analyze_snapshot
from laptop_inspector.collectors.base import safe_exec
from laptop_inspector.collectors.linux import LinuxCollector


class SafeExecTests(unittest.TestCase):
    def test_executes_valid_command_cleanly(self):
        res = safe_exec(["echo", "probe-ok"])
        self.assertEqual(res.returncode, 0)
        self.assertIn("probe-ok", res.stdout)
        self.assertFalse(res.timed_out)

    def test_rejects_non_list_argument(self):
        with self.assertRaises(TypeError):
            safe_exec("echo probe-ok")  # type: ignore

    def test_handles_nonexistent_executable_gracefully(self):
        res = safe_exec(["nonexistent-diagnostic-tool-12345"])
        self.assertNotEqual(res.returncode, 0)
        self.assertIsNotNone(res.error_message)

    def test_enforces_timeout(self):
        res = safe_exec(["sleep", "2"], timeout_seconds=0.1)
        self.assertTrue(res.timed_out)
        self.assertNotEqual(res.returncode, 0)


class LinuxCollectorFixtureTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.sysfs = self.root / "sys"
        self.proc = self.root / "proc"

        # Setup mock sysfs power supply BAT0
        bat_dir = self.sysfs / "class" / "power_supply" / "BAT0"
        bat_dir.mkdir(parents=True)
        (bat_dir / "energy_full_design").write_text("54000000\n", encoding="utf-8")  # 54,000 mWh
        (bat_dir / "energy_full").write_text("43200000\n", encoding="utf-8")         # 43,200 mWh
        (bat_dir / "cycle_count").write_text("42\n", encoding="utf-8")
        (bat_dir / "status").write_text("Discharging\n", encoding="utf-8")
        (bat_dir / "technology").write_text("Li-poly\n", encoding="utf-8")

        # Setup mock DMI
        dmi_dir = self.sysfs / "class" / "dmi" / "id"
        dmi_dir.mkdir(parents=True)
        (dmi_dir / "sys_vendor").write_text("Framework\n", encoding="utf-8")
        (dmi_dir / "product_name").write_text("Laptop 13 (AMD Ryzen 7040Series)\n", encoding="utf-8")
        (dmi_dir / "bios_version").write_text("03.05\n", encoding="utf-8")
        (dmi_dir / "bios_date").write_text("03/29/2024\n", encoding="utf-8")

        # Setup mock meminfo
        self.proc.mkdir(parents=True)
        (self.proc / "meminfo").write_text(
            "MemTotal:       16301244 kB\n"
            "MemFree:         4123456 kB\n"
            "MemAvailable:    8912344 kB\n",
            encoding="utf-8",
        )

        self.collector = LinuxCollector(sysfs_root=self.sysfs, proc_root=self.proc)

    def tearDown(self):
        self.tmp.cleanup()

    def test_collect_battery_from_energy_files(self):
        bat = self.collector.collect_battery()
        self.assertIsNotNone(bat)
        self.assertEqual(bat["design_capacity_mwh"], 54000)
        self.assertEqual(bat["full_charge_capacity_mwh"], 43200)
        self.assertEqual(bat["cycle_count"], 42)
        self.assertIn("BAT0", bat["source"])

    def test_collect_battery_charge_conversion(self):
        # Create BAT1 with charge_full (uAh) and voltage_now (uV)
        bat_dir = self.sysfs / "class" / "power_supply" / "BAT1"
        bat_dir.mkdir(parents=True)
        (bat_dir / "charge_full_design").write_text("4000000\n", encoding="utf-8")  # 4,000,000 uAh = 4 Ah
        (bat_dir / "charge_full").write_text("3200000\n", encoding="utf-8")         # 3,200,000 uAh = 3.2 Ah
        (bat_dir / "voltage_now").write_text("11400000\n", encoding="utf-8")        # 11.4 V
        (bat_dir / "cycle_count").write_text("15\n", encoding="utf-8")

        # Point collector to directory with only BAT1
        (self.sysfs / "class" / "power_supply" / "BAT0" / "energy_full").unlink()
        bat = self.collector.collect_battery()
        self.assertIsNotNone(bat)
        # 4 Ah * 11.4 V = 45.6 Wh = 45600 mWh
        self.assertAlmostEqual(bat["design_capacity_mwh"], 45600, delta=10)
        # 3.2 Ah * 11.4 V = 36.48 Wh = 36480 mWh
        self.assertAlmostEqual(bat["full_charge_capacity_mwh"], 36480, delta=10)

    def test_collect_memory(self):
        mem = self.collector.collect_memory()
        self.assertIsNotNone(mem)
        expected_bytes = 16301244 * 1024
        self.assertEqual(mem["total_bytes"], expected_bytes)

    def test_collect_system(self):
        sys_info = self.collector.collect_system()
        self.assertEqual(sys_info["vendor"], "Framework")
        self.assertIn("Laptop 13", sys_info["model"])
        self.assertEqual(sys_info["bios_version"], "03.05")

    def test_collect_snapshot_runs_analysis_cleanly(self):
        snapshot = self.collector.collect_snapshot(claims={"ram_gib": 16, "storage_capacity_gb": 512})
        report = analyze_snapshot(snapshot)
        self.assertIn("coverage", report)
        self.assertEqual(report["coverage"]["battery_capacity"], "warning")  # 43200 / 54000 = 80% (20% degradation)
        self.assertIn(report["coverage"]["memory_capacity_claim"], ("passed", "warning"))


if __name__ == "__main__":
    unittest.main()
