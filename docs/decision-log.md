# Architecture decision log

## ADR-0001 — Separate analysis from collection

**Status:** Accepted.  
**Decision:** Analysis functions accept structured snapshots and do not invoke OS commands/network.  
**Reason:** Determinism, fixture-driven development, easier cross-platform support and stronger safety/privacy boundaries.  
**Consequences:** Need a schema and adapter layer before broad live collection.

## ADR-0002 — Offline by default

**Status:** Accepted.  
**Decision:** Core analysis/reporting does not require the network; any reference sync is optional and separate.  
**Reason:** portable inspection, poor connectivity, buyer privacy and reduced external dependency risk.

## ADR-0003 — No single opaque laptop score

**Status:** Accepted.  
**Decision:** Findings are category-specific, evidence-backed and severity-ranked; incomplete coverage is visible.  
**Reason:** a high aggregate score can conceal one critical fault and creates false precision.

## ADR-0004 — Evaluate HWCheck before building live-USB duplicate

**Status:** Accepted (Independent clean-room implementation).  
**Decision:** Proceed as an independent, clean-room open-source project with focus on dual-view verification, listing claims reconciliation, and explicit per-test coverage states.  
**Reason:** Upstream code repository `dailybarid/hwcheck` is currently not publicly available on GitHub. Hardware Clinic is proprietary/non-commercial, and hw-probe is Linux-upload-centric. Laptop Buyer Kit provides a unique architecture: pure offline analysis, dual-view (native OS vs boot environment) reconciliation, seller claim verification against manufacturer references, and explicit non-binary coverage tracking.  
**Consequences:** Full responsibility for collector implementation, driver edge cases, and test harness across Linux, Windows, and macOS.

## ADR-0005 — Python standard-library analysis MVP

**Status:** Accepted for initial prototype.  
**Decision:** Keep first rule engine free of runtime packages; add schema validation and UI packages only when needed.  
**Reason:** easy local execution and deterministic unit testing.  
**Trade-off:** JSON Schema validation, richer UI and advanced test tooling remain follow-up work.

## ADR-0006 — Linux read-only collector architecture

**Status:** Proposed.  
**Decision:** Build the first live-hardware collector for Linux as a strictly read-only, non-destructive adapter using `/sys/class/power_supply`, `/sys/class/dmi/id`, `/proc/meminfo`, and safe subprocess execution of `smartctl --json=c -x` with fixed argument arrays, timeouts, output limits, and exit-code bitmask handling.  
**Reason:** Linux sysfs provides direct, standard access to battery and DMI telemetry without external binaries, while smartmontools provides reliable SATA/NVMe health data without raw ioctl reimplementation.  
**Safety & Access Gates:**
- Never execute shell strings (`shell=False` enforced).
- Maximum execution timeout (5.0s per command) and buffer cap.
- Graceful handling of unprivileged execution (document what fields require root rather than silently failing).
- Strictly read-only commands; no destructive disk commands, repair commands, or firmware updates.
