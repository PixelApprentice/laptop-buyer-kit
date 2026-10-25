# Prior-art review: laptop diagnostics and open-source development aids

**Research snapshot date: 2026-10-25.** This is a public-documentation review, not a full code audit. Features listed below are project-documented; successful operation on a particular device must be validated independently. Project state and licensing can change; recheck before adopting or redistributing.

## Directly relevant diagnostics projects

### 1. HWCheck — closest open-source analogue

Repository: https://github.com/dailybarid/hwcheck  
License advertised by repository: MIT.  
Documented workflow: bootable/live USB for a used laptop buyer, no installed OS required, local report and verdict. Its README lists identity/model/BIOS checks, CPU/thermal checks, RAM, SMART/NVMe health, battery capacity and cycle count, display/native resolution and dead/stuck pixels, audio, keyboard, touchpad, camera, Wi-Fi/Bluetooth/Ethernet, USB, sensors, physical chassis checks and extra devices. It also documents CI checks and known gotchas around thermal throttling, sensor parsing, native resolution, permissions and live-session package handling.

Sources: https://github.com/dailybarid/hwcheck (README sections “What it checks”, “Checks and CI”, “Gotchas”, “What this cannot check”).

**Assessment:** it already does much of the original product definition. The most responsible options are (a) propose upstream contributions, (b) fork/extend it under its license after auditing all bundled dependencies, or (c) keep this repository as a reference/prototype until a concrete non-duplicative reason for a separate implementation is proven. Do not spend months duplicating its checklist by default.

**Questions to audit in code and on hardware:**
- Are battery/drive rules covered by unit fixtures and real devices, including missing/unsupported outputs?
- Does “report generated” imply coverage of all tests, or are per-test states explicit?
- Does every test have timeouts, permission handling, clear consent, and safe stop behavior?
- Do all supported storage protocols, RAID/RST cases, and Apple hardware have trustworthy data access?
- What is test coverage beyond lint/compile/translation/self-test scripts?
- How recent and reproducible are ISO/USB builds; are release images reproducible and signed?
- What are actual device coverage and false-positive rates across models?

The public README itself cautions that software cannot inspect chassis damage, hinges, missing screws, or battery swelling; those need operator inspection. This is an important design principle, not a unique missing feature.

The public README describes CI gates for a repository-clean/privacy check, translation consistency, and an i18n self-test, plus Python compilation, `bash -n`, and an assertion that all listed check sections are wired into the plan. It documents real-world gotchas in thermal-throttling interpretation, `sensors` parsing, native display resolution, root permissions for Wi-Fi scanning, and live-session package installation. The README does not establish a broad physical-device validation corpus or published false-positive rates. That absence from the reviewed documentation is a question for code/release audit, not proof that no such tests exist.

One technical concern to validate: any rule that guesses expected screen resolution from screen size can produce false positives. Prefer EDID/preferred-mode evidence plus exact manufacturer configuration data; if that reference is unavailable, mark the claim comparison inconclusive rather than claiming a likely fraud/replacement.

### 2. Hardware Clinic — strong feature benchmark, not OSI open source

Repository: https://github.com/jmsmediagroup/hardware-clinic/  
Its public page documents a bootable UEFI diagnostic app for 64-bit UEFI PCs and Intel Macs, with quick screening, SMART/self-tests, surface tests, RAM/CPU/VRAM and thermal diagnostics, USB tests, rescue tools and signed reports. It documents a limitation for drives hidden behind Intel RST/RAID and indicates Apple Silicon does not boot its USB image. The page states the license is proprietary and free for personal non-commercial use only.

Source: repository README and LICENSE/COMMERCIAL text at https://github.com/jmsmediagroup/hardware-clinic/ .

**Assessment:** benchmark flows/feature priorities, but do not reuse its proprietary code or bundle it as an open-source dependency. Its inclusion of data-recovery and destructive utilities demonstrates why our buyer-focused MVP should keep repair/wipe operations out of the default diagnostic path.

### 3. hw-probe — Linux hardware inventory and operability

Repository: https://github.com/linuxhw/hw-probe  
Documents Linux/BSD hardware inventory, device operability and driver diagnosis, a live USB workflow, offline viewing, and upload/share functionality. Its privacy documentation warns that personal data redaction can fail in edge cases.

Source: https://github.com/linuxhw/hw-probe (README sections “Offline view”, “Operability”, “Privacy”).

**Assessment:** useful reference for Linux inventory and driver/device-status approaches; not a complete Windows/macOS used-laptop buyer report, and its upload-centric workflows are not suitable as the default for this product.

### 4. HardInfo2 — Linux inventory/reporting/benchmark

Repository: https://github.com/hardinfo2/hardinfo2  
Documents Linux system information, benchmarking, HTML/text reports and optional online benchmark comparisons. The project source includes multiple licenses; check before packaging.

**Assessment:** a Linux inventory/benchmark building block or comparison point, not the entire guided buyer inspection workflow.

### 5. LibreHardwareMonitor — Windows sensors

Repository: https://github.com/LibreHardwareMonitor/LibreHardwareMonitor  
Documents temperature, fan, voltage, load and clock-rate sensors across multiple PC component types. Its repository states MPL-2.0 for the project with some separately licensed components; administrator rights are needed for some sensors.

**Assessment:** strong candidate for optional Windows sensor integration after licensing and privilege review; it is not a cross-platform buyer report engine.

### 6. smartmontools / Memtest86+

- smartmontools: https://github.com/smartmontools/smartmontools — SMART support for ATA/SATA, SCSI/SAS and NVMe devices, with a GPL-2.0 license per upstream README. Good candidate as an external executable with documented redistribution compliance.
- Memtest86+: https://github.com/memtest86plus/memtest86plus — standalone memory test; upstream documents current AArch64 limitations and that Apple Silicon Macs cannot run it natively.

**Assessment:** integrate/recommend proven utilities rather than reimplement low-level protocol logic, but make capability gaps explicit and track license/versions.

## Publicly visible gaps our design should investigate

These are potential product-level differentiators; the review does not prove that no tool anywhere implements them:

1. A single portable normalized evidence schema spanning native Windows/Linux/macOS collectors and a bootable diagnostic environment.
2. Explicit per-test coverage states and evidence provenance; “no alarm found” must never imply a complete test.
3. Cross-signal discrepancy rules for battery capacity/cycles and storage counters, with alternate explanations and no automatic fraud accusation.
4. Reproducible reports with schema/rules/toolchain versions, source timestamps, measurement units, and optional user-controlled signing.
5. Offline-by-default reference data with stale-cache indicators; network reference lookups are opt-in and separate from analysis.
6. A safe buyer mode that excludes repair, file recovery, drive writes and secure wipe, even if other editions eventually add them.
7. A public hardware validation matrix and known false-positive/false-negative cases rather than broad compatibility claims based solely on CI.
8. Vendor- and protocol-aware SMART/NVMe interpretations and unit/semantics tests.
9. Explicit handling of installed-vs-usable RAM, replacement battery identity, controller-hidden drives, RAID/RST, permissions, and platform-specific gaps.
10. A clean privacy/redaction test suite that verifies no host identifiers leak into reports, logs, fixtures or commits.

## Differentiation hypothesis (must be tested, not marketed as established fact)

If a separate application is justified after auditing HWCheck, the best technical thesis is a **dual-view inspection and evidence-consistency engine**:

1. Capture a native-OS snapshot where appropriate (Windows event/device/battery history; native macOS battery/power data).
2. Capture a booted live-environment snapshot for OS-independent inventory and selected tests, when the architecture/firmware allows.
3. Compare observations by component identity, protocol, unit, source and timestamp. Flag discrepancies without treating either collector as universally authoritative.
4. Verify listing claims using exact model/variant references from authoritative manufacturer sources; do not use broad heuristics as proof.
5. Produce a coverage matrix and reproducible evidence bundle, with ruleset/toolchain versions and optional user-controlled signatures.
6. Track false positives/negatives against a sanitized physical-device corpus and publish validated support/limitations.

The public docs reviewed for HWCheck, hw-probe, HardInfo2, and LibreHardwareMonitor do not establish this complete combination of native + live dual-view reconciliation, manufacturer-source provenance, and published buyer-rule validation. This is an **unverified gap hypothesis**, not a claim that no implementation elsewhere has it. Test it and inspect upstream code before deciding to build separately.

## Decision gate before investing in a parallel implementation

Before committing to a new boot image, run a small, documented comparison of HWCheck with this prototype and decide whether upstreaming is more effective. Keep a separate implementation only if we can show one or more of: a materially different license/product goal, a schema/collector architecture that is impractical to upstream, a distinct supported platform requirement, or a concrete correctness/safety gap demonstrated by reproducible tests.

## Sources for current OS lifecycle

- Microsoft Windows support lifecycle: https://www.microsoft.com/en-us/windows/end-of-support
- Linux power supply class semantics and optional properties: https://docs.kernel.org/power/power_supply_class.html
- Antigravity CLI plugins/skills docs: https://www.antigravity.google/docs/plugins?tab=cli and https://antigravity.google/docs/skills?app=cli
