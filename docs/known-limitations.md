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
