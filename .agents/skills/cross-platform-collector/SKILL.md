---
name: cross-platform-collector
description: Design safe, testable platform-specific collectors for Windows, Linux, and macOS hardware data.
---
# Cross-platform collector skill

1. Start with the normalized schema and `docs/platform-matrix.md`.
2. Implement one platform adapter at a time and use native APIs/interfaces where possible.
3. Every command runner must use fixed executable + argument arrays, timeout, bounded stdout/stderr, cancellation, exit-code checks, and no shell interpolation.
4. Capture tool version, OS version, source and collection timestamp. Parse output with tolerant but strict validation.
5. Distinguish not-present, unsupported, permission-denied, timed-out, parse-error and available.
6. Store fixtures for success, partial, failure and legacy outputs; redact personal/device identifiers.
7. Make read-only the default. Never modify BIOS, mount internal volumes read-write, alter RAID mode, or bypass encryption/passwords.
8. Test on actual hardware before changing support status from unknown to verified.
