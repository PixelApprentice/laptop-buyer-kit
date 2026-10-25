# Implementation checklist

Use this as the source-of-truth task list when working with Antigravity. Mark items complete only after evidence exists; do not mark hardware work complete from mocked tests.

## Phase 0 — repository hygiene and prior art
- [x] Read `docs/prior-art.md`; compare the current HWCheck code and license before choosing reuse/fork vs clean-room modules.
- [x] Record project decision in `docs/decision-log.md` with evidence and license implications.
- [ ] Verify dependency licensing and create an SBOM before bundling external binaries.

## Phase 1 — analysis engine (current starter)
- [x] Create snapshot input example and normalized JSON shape.
- [x] Implement battery degradation and low-cycle/high-degradation flags.
- [x] Implement initial SSD/NVMe health flags.
- [x] Implement advertised-vs-detected RAM comparison.
- [x] Generate JSON/HTML report locally.
- [x] Add tests for normal, anomalous, missing, and implausible input cases.
- [ ] Add JSON Schema validation and schema migration policy.
- [x] Add result coverage records for each individual check.
- [ ] Add property-based/fuzz tests for parsing and units.

## Phase 2 — read-only collectors
- [x] Define `Collector` protocol and `safe_exec` command runner.
- [x] Build Linux battery and device inventory collector with sample-output fixtures.
- [x] Integrate `smartctl -x`/JSON output safely; handle nonzero exit codes and partial results.
- [x] Add NVMe data collection; do not assume every disk supports it.
- [ ] Add Windows CIM/PowerShell collector with version-aware fallback for 8.1/10/11 (v2.0 roadmap).
- [ ] Add macOS `system_profiler`/IOKit collector; distinguish Intel from Apple Silicon (v2.0 roadmap).
- [ ] Add cross-view reconciliation for native OS and live-USB observations (v2.0 roadmap).
- [x] Preserve raw output only when privacy-safe and useful; redact identifiers in shareable reports.

## Phase 3 — testing and UX
- [x] Design guided quick inspection and thorough diagnostics; label estimated durations.
- [x] Add manual keyboard/trackpad/display/ports checklist and recorded operator outcomes.
- [x] Add battery swelling/physical safety stop condition.
- [x] Add test-state model: pass/fail/warn/inconclusive/skipped/manual/not-supported.
- [x] Add dead/stuck pixel screen tester and interactive keyboard matrix tester.
- [x] Ensure offline operation with network disabled and no DNS attempts.
- [x] Add Playwright automated UI tests verifying the complete buyer workflow.

## Phase 4 — risk controls and reference sync
- [x] Introduce explicit read-only / non-destructive capability classifications.
- [x] Add SQLite persistence layer for offline sessions and history.
- [x] Add HTML/JSON report download and print optimization.
- [ ] Add signed reference-manifest cache with age/expiry labels (v2.0 roadmap).
- [ ] Add vendor model reference importer and source provenance (v2.0 roadmap).
- [ ] Add signed report export with a local key the user controls (v2.0 roadmap).

## Phase 5 — package and validate
- [ ] Build live Linux USB image only after collector and safety tests pass.
- [ ] Test UEFI/Secure Boot constraints and do not imply universal boot compatibility.
- [ ] Test at least two laptop families per major OS profile and multiple drive protocols.
- [ ] Publish CI outputs, SBOM, release checksums, third-party notices, and support matrix.
- [x] Decide if the project should fork/extend HWCheck rather than maintain a competing duplicate (ADR-0004 resolved: clean-room independent implementation).
