# Architecture

## Status and scope

The current repository implements only a pure analysis pipeline and report output. Collectors and live hardware access are planned, not implemented. Architecture is intentionally layered so the analysis engine can be tested without a laptop and so each OS adapter can be developed independently.

## Design goals

1. Offline-first and deterministic by default.
2. Separate raw collection, normalization, analysis, policy, rendering, and optional reference synchronization.
3. Preserve source provenance and missing-data semantics.
4. Use small platform adapters rather than pretending one collector works identically everywhere.
5. Never interpret missing data as a pass.
6. Keep destructive or load-heavy tests behind explicit capability/consent gates.

## Proposed components

- **CLI / local UI:** starts inspection sessions, guides the operator, displays warnings, and exports reports. UI is a client of the analysis API; it must not embed rules.
- **Orchestrator:** runs selected collectors and tests, enforces timeout/privilege policies, records test state and timestamps.
- **Platform adapters:** Windows PowerShell/CIM and supported native interfaces; Linux sysfs, udev, PCI inventory, smartmontools/nvme-cli; macOS system_profiler/IOKit and approved native APIs.
- **Tool adapters:** strict argument lists for `smartctl`, `nvme`, memory tests, sensor probes, and stress tools. Record tool version and exit status. Avoid shell-string execution.
- **Normalization layer:** converts values to canonical units, preserves raw values, identifies unavailable/unsupported/permission-denied/parse-error states, and does not discard controller-specific attributes.
- **Analysis engine:** pure functions over immutable-ish normalized snapshots; versioned thresholds and rule IDs; no IO or web access.
- **Reference cache:** optional, signed/versioned files for manufacturer specs, OS support, and known-device profiles. Not required for core checks.
- **Report generator:** HTML and JSON first; PDF can be browser/print or a later optional library. Reports state coverage, evidence, uncertainty, ruleset version, and limitations.
- **Local store:** SQLite for sessions/history only if needed; JSON session files remain the portability/export format.

## Data flow

```text
operator claims + consent
  -> session orchestrator
  -> OS/tool collectors
  -> raw observations + provenance
  -> normalize and validate
  -> immutable session snapshot (JSON)
  -> pure rule engine
  -> findings + coverage matrix
  -> local HTML/JSON report
  -> optional explicitly requested reference sync/export
```

## Normalized session schema (proposed)

Top-level keys: `schema_version`, `inspection`, `system`, `claims`, `observations`, `battery`, `storage`, `memory`, `tests`, `manual_checks`, `toolchain`, `reference_versions`.

Every observation should carry:

```json
{
  "value": 43200,
  "raw_value": "43200000",
  "unit": "mWh",
  "source": "linux-sysfs:/sys/class/power_supply/BAT0/energy_full",
  "collected_at": "2026-10-25T10:00:00Z",
  "availability": "available",
  "confidence": "medium"
}
```

`availability` enum proposal: `available`, `unsupported`, `permission_denied`, `not_present`, `parse_error`, `timed_out`, `not_run`, `unknown`. `confidence` enum: `low`, `medium`, `high`; this is provenance confidence, not a probability of failure.

The current MVP JSON in `examples/sample_session.json` is a smaller transitional schema. It must be migrated deliberately when the normalized observation contract is implemented.

## Capability model

- `read_only`: inventory, SMART logs, read-only test patterns where safe.
- `non_destructive`: bounded stress / self-test which does not intentionally overwrite user data but can stress aged hardware.
- `destructive`: write tests, repair, secure erase, partition operations. Excluded from the buyer MVP; off by default even if later implemented.

The orchestrator must require clear, separate operator approval for non-destructive stress tests, and must refuse destructive operations in default buyer mode.

## Offline/online boundary

The analyzer receives data only; it has no HTTP client. Reference sync is a separate command or module. Disable sync by default. Bundle a known reference snapshot for optional comparisons, with retrieval date and expiration. The report must indicate stale references and must never claim the offline cache is current.

## Failure handling

Collector failures produce typed collection status and diagnostics, not a default pass. Partial collection results may still be analyzed, but report coverage must show incomplete areas. Commands need timeout, output-size limit, and safe cancellation.
