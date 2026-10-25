# Hardware validation plan

This document is a lab template, not evidence that the devices have already been tested.

## Per-run record

- Test record ID (non-identifying)
- Date and operator
- Device family/model (avoid serials)
- CPU architecture, system firmware/BIOS version
- OS distribution/build or live USB build ID
- Storage type/controller (SATA/AHCI, NVMe, RAID/RST, USB bridge)
- Memory type/layout (soldered, SODIMM, ECC if applicable)
- Battery type and whether cycle-count data is exposed
- Diagnostic toolchain versions and ruleset commit/hash
- Expected result, observed result, any discrepancy
- Tests completed/skipped/inconclusive and why
- Reproduction steps and redacted report hash

## Scenarios

1. **Healthy baseline:** no hard failures; ensure normal devices don't get false-positive flags.
2. **Battery moderate wear:** degradation over configured warning threshold, cycles moderate/high.
3. **Battery low cycles/high degradation:** flag discrepancy with alternative explanations.
4. **Battery missing cycle count:** health remains calculable; cycle discrepancy rule does not fire.
5. **Replacement battery:** identity/model mismatch (if reliably exposed) should be a clue, not definitive proof.
6. **SSD high remaining endurance plus media errors:** media errors are still reported.
7. **NVMe critical warning:** high severity, stress tests are not automatically run.
8. **SATA SMART counters:** field meanings remain separate from NVMe metrics.
9. **Drive behind RAID/RST:** collector reports inaccessible/unsupported and suggests a safe manual investigation; no BIOS setting change attempted.
10. **16 GiB installed RAM with 16 GiB claim:** no false positive from byte/GiB conversion.
11. **8 GiB detected with 16 GiB claim:** mismatch, with a request to cross-check BIOS/usable vs installed memory.
12. **No administrator rights:** partial snapshot; not a pass.
13. **No network:** all core diagnostic analysis and report generation still work.
14. **Physical/display manual checks:** operator's observations are labelled manual and not mixed with machine-collected measurements.
15. **Legacy Windows versions:** actual API availability and unsupported OS status reported separately.
16. **Apple Silicon:** native collector only; do not label Intel boot tests as supported.

## Release gate

Do not call a platform supported until the required scenarios are reproduced, the test record is stored, and docs reflect the exact tested scope. Automated unit tests alone are insufficient.
