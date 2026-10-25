# Requirements and acceptance criteria

## Functional requirements

### FR-1 Session and claims
- Capture a session ID, timestamp, operator consent/notes, platform/boot mode, tool versions, seller-provided claims and which claims have verified sources.
- Store original values, units, sources and normalized values; no silent conversion without recording the original.

### FR-2 Inventory
- Enumerate system/model/firmware, CPU/GPU, installed/usable RAM, storage devices/protocols/capacities, battery data when available, displays and peripherals.
- Each unsupported/permission-denied/unavailable field has a reason; it is never treated as zero or pass.

### FR-3 Battery
- Calculate reported capacity health and degradation when valid design/full-charge values exist.
- Configurable initial triage thresholds: >=20% degradation warning; >=30% high; >=40% optionally severe. Exact operational thresholds must be validated and versioned.
- Flag >=20% degradation with reported cycles <=50 as a discrepancy, not proof of tampering.
- Include cycle count availability/staleness, battery identity when lawful/available, source, timestamp and alternate explanations.

### FR-4 Storage
- Preserve device protocol, raw attributes/log references, model/firmware/capacity, power-on hours and supported SMART/NVMe fields.
- Flag controller critical warning, failed self-test, and suspicious counters separately. Do not map NVMe attributes to ATA semantics.
- Never run destructive writes in buyer mode. All long/extended tests require duration and risk disclosure.

### FR-5 Memory and CPU/GPU
- Compare seller claim to detected model/capacity with explicit units and tolerance.
- Provide optional controlled tests only after thermal/permission preflight and operator consent.
- Clearly distinguish an observed crash/temperature event from an inferred failure cause.

### FR-6 Peripheral/manual inspection
- Guided checks for screen, keyboard, trackpad, camera/mic/audio, USB/USB-C, display output, Wi-Fi/Bluetooth, charger, fans, hinge/chassis and liquid damage.
- Manual findings are labelled as operator-observed, with note/time, not sensor-measured.

### FR-7 Cross-view consistency
- If a native-OS collector and live-environment collector both run, compare compatible observations from the same target component while preserving source/time/unit.
- Do not merge unlike fields or assume one view is authoritative when controllers/drivers expose different semantics.
- Discrepancies become explainable findings; a missing second view remains `not_run`/`not_supported`, never a pass.

### FR-8 Report
- Produce local HTML and JSON in MVP; later add PDF/print and optional signed bundle.
- Show findings, evidence, source, confidence, recommendation, coverage, skipped/inconclusive tests, tool/rule/schema versions, reference data age and limitations.
- Redact identifiers by default in shareable export; allow operator opt-in to include identifiers in a local private report.

### FR-9 Reference mode
- Core diagnosis works without network connectivity.
- Optional sync checks model-specific specs, OS lifecycle, firmware notes and dependency metadata. Cache must record source, retrieval date, version and integrity.
- Network failure cannot stop core inspection.

## Non-functional requirements

- Python analysis core supports Python 3.10+ initially; UI/collectors can have separate constraints.
- Deterministic analysis for the same snapshot and ruleset.
- No external runtime dependencies in the current rules prototype.
- Read-only by default; explicit permission gates for privileges and load-heavy tests.
- Local processing by default; no hidden telemetry or report upload.
- Timeouts and bounded output for external commands.
- Tests include missing data, parse errors, permission-denied, weird values, unit conversions, stale references, multiple devices and platform/version fixtures.
- Open-source dependency licensing and SBOM before distribution.

## Acceptance criteria for MVP

- [x] Deterministic battery/SSD/RAM analysis functions with synthetic fixtures.
- [x] Explainable JSON and HTML output and escaping of untrusted report text.
- [x] Unit tests pass under supported Python.
- [ ] Schema validation and coverage state for every individual diagnostic.
- [ ] Linux collector handles real output fixtures and missing attributes.
- [ ] Native Windows and macOS collectors validated on real systems.
- [ ] Physical-device validation, support matrix and privacy scan completed.
- [ ] Live image boots on declared targets and does not write to internal disks during default inspection.

The last four criteria are not yet met by this starter repository.
