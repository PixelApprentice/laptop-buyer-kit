# Roadmap

## Milestone 0 — decide whether to fork/extend

Deliver: HWCheck comparison notes, code/license/dependency audit, decision record. Exit criteria: explicit decision supported by evidence; do not duplicate all features by default.

## Milestone 1 — trustworthy normalized snapshot

Deliver: JSON Schema, typed observations, per-test coverage states, migration examples, strict validation. Exit criteria: unknown/missing data never silently treated as pass; unit tests cover invalid units and partial snapshots.

## Milestone 2 — Linux read-only adapter

Deliver: inventory and battery/sysfs collector, SMART/NVMe JSON parsers, device/controller detection, bounded command runners. Exit criteria: fixture coverage plus physical verification across at least SATA/NVMe and one restricted-controller case.

## Milestone 3 — Windows collector

Deliver: Windows 11/10 native info and battery report parsing, storage-health access where available, legacy Windows 8/8.1 fallback with capability warnings. Exit criteria: actual test sessions on each claimed OS range.

## Milestone 4 — macOS collector

Deliver: separate Intel and Apple Silicon native collectors, native power/system profiling, version-specific parser fixtures. Exit criteria: physical test evidence and no claim of Linux-USB coverage on Apple Silicon.

## Milestone 5 — guided user workflow and manual tests

Deliver: local UI or TUI; quick/thorough modes; per-check states; physical checklist and operator notes. Exit criteria: usability review by a buyer unfamiliar with internal terms.

## Milestone 6 — reference cache and reproducible report

Deliver: signed/versioned source manifests, stale-cache indication, optional report hashes/signatures. Exit criteria: no network access in offline mode, verifiable provenance, redaction tests.

## Milestone 7 — USB packaging

Deliver: distro base, reproducible build notes, software bill of materials, third-party licenses, checksums/signatures. Exit criteria: verified boot modes for published hardware matrix, safe read-only behavior, recovery media tested.

## Milestone 8 — continuous quality

Deliver: curated hardware fixtures (sanitized), false-positive tracking, release regression and privacy scans. Exit criteria: each supported claim maps to a test and device scope.
