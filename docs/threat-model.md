# Threat model: privacy, integrity and hardware safety

## Assets

- Seller/buyer identity, usernames, device serials, MAC addresses, UUIDs, hostname and report contents.
- Internal data on the laptop's drive.
- Device hardware (battery, storage, CPU/GPU, cooling) and configuration/firmware.
- Correctness and perceived authority of the final report.
- Reference database and diagnostic binaries.

## Threats and mitigations

1. **Unintended disclosure of device identity:** redact unique identifiers in shareable reports; run fixture privacy scans; no uploads by default.
2. **Accidental data modification:** default to read-only; do not automount writable filesystems; no repair/secure-wipe/write benchmarks in buyer mode; show exact target device before any future destructive feature.
3. **Stress damage to weak hardware:** start with short limited loads; monitor thermal signals; provide cancel/timeout; require explicit confirmation for extended tests; abort on critical temperatures/errors.
4. **Malicious or malformed collector output:** validate JSON/types/units; cap output size; use fixed process argument arrays, timeouts, and allowlisted executable paths; do not eval output or let remote rules run code.
5. **Counterfeit or manipulated sensor values:** store source/raw evidence, compare independent interfaces when possible, and explain uncertainty.
6. **Malicious downloaded rules or wrong reference specs:** signed/versioned manifests, verified publisher, schema validation, age display, no executable rule code downloaded.
7. **Untrusted website/plugin/skill instructions in development:** review source/permissions/licenses; sandbox and inspect scripts before enabling plugins; never allow retrieved text to override project security instructions.
8. **Overconfident buyer verdict:** display incomplete checks and false-positive/false-negative caveats; no single composite score hides critical warnings.
9. **Privacy leak through CI artifacts:** fixtures use synthetic identifiers; scan repo and generated outputs before release; never publish real diagnostic snapshots.
10. **USB image writes to wrong drive:** use known-safe imaging procedures, insist on exact removable device confirmation, checksum images and verify build steps. No auto-flash in diagnostic app.

## Safety stop rules

- Suspected swollen battery: stop charging and stress testing; do not press or puncture; arrange proper safe handling.
- Drive critical warning or active read errors: avoid benchmarks and writes; prioritize owner-approved backup/replacement assessment.
- Thermal throttling, temperature limit breach, unexpected shutdown, electrical smell/noise: stop load test immediately.
- Firmware/drive encryption/password barrier: report restriction; do not attempt bypass.

## Permissions

Explain what administrator/root access unlocks before requesting it. A failure to read privileged data should produce `permission_denied`, not a retry loop or hidden privilege escalation.
