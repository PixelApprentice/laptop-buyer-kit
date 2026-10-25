# Test plan

## 1. Unit tests (current)

Run `python -m unittest discover -s tests -v`. Current tests cover:
- normal battery capacity math;
- high degradation and low-cycle discrepancy;
- missing and implausible battery measurements;
- low NVMe wear with nonzero media errors;
- NVMe critical warning;
- missing storage data;
- RAM unit/tolerance and meaningful shortfall;
- missing RAM data;
- report JSON parseability and HTML escaping;
- synthetic end-to-end analysis.

## 2. Required next tests

### Property and boundary tests
- Degradation exactly 19.9%, 20%, 29.9%, 30%, 39.9%, 40%.
- Cycle count 0, 1, 50, 51, missing, string/corrupt, implausible huge.
- Design capacity 0, negative, NaN/infinity, missing and inconsistent units.
- Full capacity slightly above and far above design.
- NVMe endurance used -1, 0, 79, 80, 99, 100, 255 and missing.
- Critical-warning bits; field missing; malformed SMART/NVMe JSON; nonzero tool exit code with valid partial output.
- Different decimal GB vs binary GiB claims; usable RAM vs installed RAM; shared GPU memory.
- HTML-injected strings, Unicode, RTL text, newline-heavy values and unexpectedly large values.

### Collector parser tests
Each collector must have representative recorded outputs for success, partial fields, unsupported device, permission denied, timeout, malformed output and each supported OS major version. Remove/rewrite serials, MACs, UUIDs, hostnames and user paths in fixtures.

### Integration tests
- End-to-end CLI with sample file, output file, invalid input, missing input and unwritable output.
- Offline run with network disabled; assert there are no connection attempts in analysis mode.
- Run under unprivileged user; compare with privileged mode and document additional fields rather than hiding permission differences.
- Validate reference cache signature, stale expiry and bad/corrupted references.
- Test that the report lists every skipped/inconclusive test and uses the correct rule/schema version.

### Safety tests
- Default CLI never invokes external system commands.
- Future adapter commands use argument arrays, not shell interpolation.
- Tests prove no write/repair/wipe tool is called without consent and mode gate.
- Abort/cancel test at timeout and thermal threshold.

## 3. Physical validation (release requirement)

Use owner-authorized lab machines, not random buyer data. Record exact model, firmware, OS build/kernel, storage protocol/controller, CPU architecture, test/tool versions, expected observations, actual observations and known limitations. Do not publish device serials.

Minimum matrix before announcing a first release:
- Windows 11 x64 and Windows 10 x64 on at least two laptop families;
- Windows 8.1 on one legacy test target if maintained;
- mainstream Linux live USB on Intel/AMD x86_64 with SATA and NVMe;
- one laptop using Intel RST/RAID or another hidden-controller configuration;
- Intel Mac and Apple Silicon Mac native collection where available;
- at least one soldered-RAM model and one replaceable-module model;
- healthy drive, known wear indicator, known SMART/NVMe error fixture or controlled lab drive;
- battery with low wear, moderate degradation and missing cycle count.

Never intentionally create physical battery hazards. Use synthetic fixtures for dangerous/rare cases.

## 4. False-positive study

Maintain a corpus of snapshots with reviewed ground truth. Record each rule's false-positive/false-negative cases, rule version, OS/hardware scope, and confidence. Threshold changes require regression tests and a decision-log entry.
