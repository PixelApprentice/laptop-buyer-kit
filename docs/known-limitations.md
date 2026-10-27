# Known limitations and explicit non-goals

As of this starter pack:

- No live hardware collector exists. The current code analyzes supplied synthetic/normalized JSON only.
- The report is not an independent forensic certification; firmware counters can be wrong, stale, reset, or replaced.
- Battery health calculated from reported design/full-charge capacity is an estimate. Low cycles plus degradation is a discrepancy, not proof of battery tampering.
- SMART/NVMe attribute semantics vary by manufacturer and protocol. Initial rules are deliberately conservative and need device-corpus validation.
- The prototype does not yet record per-test execution coverage for each possible hardware feature; only component-analysis flags are reported.
- No bootable image, signed release artifact, auto-updater, online reference synchronizer, or report signing has been built.
- No tests have been run on physical Windows, Linux, Intel Mac or Apple Silicon hardware in this execution environment.
- Live USB availability can be affected by Secure Boot, firmware passwords, RAID/RST, encryption, controller support, architecture, and vendor-specific boot restrictions.
- Windows 8/8.1 and Windows 10 support status needs clear lifecycle warnings. The platform collector compatibility goal is not a promise that all legacy APIs/tools will work.
- The MVP does not verify software licensing/activation or guarantee a device is genuine; serial/model matches are not proof that parts are original.
- Visual/physical checks cannot be fully automated. Battery swelling requires manual detection and safe handling; software cannot certify chassis/liquid damage.
- CPU/GPU tests depend on available sensors and kernel/driver interfaces; a missing temperature sensor is inconclusive, not a cool temperature.
- A completed benchmark does not establish long-term reliability or guarantee no intermittent fault exists.
- The product should not include drive repair, data recovery or secure wipe in the default buyer workflow.

## v2.1.0 additions and their known limitations

### OS/Boot Detection
- `collect_system_extended()` reads `/etc/os-release`, `/proc/mounts`, and `/sys/firmware/efi` (Linux only).
- Boot firmware detection (UEFI vs BIOS/MBR) is based on presence of `/sys/firmware/efi/` directory — may be unavailable in some VM environments.
- Filesystem type is read from `/proc/mounts` for the `/` mountpoint; encrypted or overlayfs roots may report a wrapper type.
- OS install age estimate is based on `/etc/machine-id` mtime, which can be reset on re-install or cloning — treat as estimate only.
- Touchscreen detection reads sysfs device names; some touch controllers enumerate with non-standard names.
- Backlight type ("raw" = possible OLED hint, "firmware" = LCD) is an unreliable indicator; panel type should be confirmed via EDID or service manual.

### Fan Monitoring
- Fan RPM is read from hwmon sysfs (`/sys/class/hwmon/*/fan*_input`); some laptops require vendor kernel modules (e.g., `thinkpad_acpi`, `asus_wmi`) to expose these nodes.
- No PWM fan control write operations are performed — Aegis is read-only. Max-speed and whisper-mode tests are therefore advisory (measuring current RPM only).
- Fan count 0 may mean sensors are hidden behind a locked EC, not that the fan is absent.

### Keyboard Heatmap
- Key bounce detection uses a 30ms threshold, which may trigger false positives on rapid typists and false negatives on mechanically defective switches.
- Heatmap resets on page reload; there is no persistence across sessions.

### USB Autorun (Windows)
- `autorun.inf` is disabled by Windows Group Policy in most managed environments. AutoPlay only works from unlocked removable drives in consumer Windows 10/11.
- The app requires Python 3.10+ on the target device; the batch file will fail if Python is absent.
- UAC elevation (`requireAdministrator`) is requested but not guaranteed; some enterprise policies block it.
- Windows Defender SmartScreen may warn about unsigned scripts — this is expected for open-source unsigned tools. The app contains no obfuscated code.

### Performance on Low-End Hardware
- The 5-second thermal pulse benchmark (`/api/benchmark/cpu-pulse`) uses pure Python math; actual CPU load and thermal rise depends on process priority and existing load.
- The UFO canvas animation rate depends on browser compositor frame rate; headless or power-saving mode may reduce the reported Hz.

## v2.2.0 Portable Zero-Trace Mode Notes
- When run from a read-only USB media (e.g. write-protected drive or ISO9660 filesystem), SQLite and report writing will fail if the directory is non-writable. Aegis requires writable storage on the portable drive to save sessions and reports into `aegis_data/` and `aegis_reports/`.
- Parallelized collector execution (`ThreadPoolExecutor`) runs up to 8 threads concurrently. On single-core vintage CPUs, operations will interleave via Python GIL, falling back gracefully without performance penalties.
