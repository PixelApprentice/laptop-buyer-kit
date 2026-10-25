# Platform support matrix (intended, not a current guarantee)

| Target | Intended mode | Information expected | Known constraints / release gate |
|---|---|---|---|
| Windows 11 x64 | Native collector + optional boot USB | WMI/CIM inventory, `powercfg /batteryreport`, storage health where driver/interface allows, Device Manager/event evidence | Admin access may improve data; RAID/RST, drivers and vendor controller limit SMART access. Test each supported build. |
| Windows 10 x64 | Native collector + optional boot USB | Similar to Windows 11 where APIs/commands exist | Mainstream Windows 10 Home/Pro support ended 2025-10-14; report OS security support separately from hardware condition. Some editions/ESU differ. |
| Windows 8.1 | Best-effort native collector, USB fallback | Legacy WMI/PowerShell paths, basic inventory | End of support 2023-01-10; older PowerShell/tool/runtime compatibility and drivers limit checks. |
| Windows 8 | Best-effort; not priority for first release | Basic inventory only if tested | Legacy platform is out of support; do not imply Windows 8 and 8.1 are identical. |
| Ubuntu/Debian-based Linux x86_64 | Native and planned live USB | sysfs, udev, DMI, PCI, smartmontools/nvme-cli, sensors, logs | Device interfaces vary; require root for specific fields; RAID/RST and vendor firmware can hide devices. |
| Other Linux distributions | Adapter where dependencies/kernel interfaces match | Core Linux inventory | Publish tested distribution/kernel matrix; do not advertise all distributions after one test. |
| Intel Mac (x86_64) | Native macOS; optional Linux boot where supported | system_profiler/IOKit/power metrics; possible Linux live USB | T2/Secure Boot/firmware policy may limit boot; test each generation. |
| Apple Silicon Mac (arm64) | Native macOS collector | Native system/hardware/power info, available diagnostics | Do not assume Intel live USB or Memtest86+ works; hardware-specific boot/OS restrictions apply. |
| Older macOS versions | Best-effort native collector | Version-dependent system and battery APIs | Native tool output/API changes; tests needed per major release. |

## Support labels

- **Verified:** exact OS/build/model family tested in CI or physical lab with recorded evidence.
- **Collector tested:** parser tests pass and at least one native system validation exists; not full system QA.
- **Best effort:** basic collection may work; tests missing/partial.
- **Not supported:** known incompatibility or no safe/credible implementation.
- **Unknown:** not tested; never silently upgraded to “supported.”

## Windows lifecycle note

At time of research (2026-10-25), Microsoft's lifecycle page says Windows 10 Home/Pro support ended on 2025-10-14 and Windows 8.1 support ended on 2023-01-10. The UI should retrieve current lifecycle data from a pinned official source when online, and show the reference retrieval date offline. Official source: https://www.microsoft.com/en-us/windows/end-of-support
