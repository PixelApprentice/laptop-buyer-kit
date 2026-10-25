---
name: hardware-evidence
description: Design or review laptop hardware diagnostics, health rules, evidence provenance, and uncertainty handling.
---
# Hardware evidence skill

1. Read `docs/design.md`, `docs/architecture.md`, `docs/known-limitations.md`, and the relevant upstream tool documentation.
2. Distinguish raw measurement, normalized value, inference and manual observation. Preserve units, source, timestamp and availability.
3. Investigate field semantics before writing thresholds. Battery cycle counts may be missing/reset; ATA SMART and NVMe fields are not interchangeable; usable RAM differs from installed RAM.
4. For each rule, define normal/boundary/missing/malformed/permission-denied cases and an actionable explanation.
5. Never claim a single metric proves fraud or future failure. Give alternate explanations and repeat-check instructions.
6. Never convert missing readings to zero or pass. Mark incomplete/unsupported explicitly.
7. Add synthetic tests before changes and record physical test evidence separately.
8. Do not run destructive tests or automatically stress a potentially failing component.
