# Laptop Buyer Kit (working name)

**An offline-first, evidence-based laptop inspection toolkit for used/refurbished buyers.** This repository is a starter project and validated analysis-engine prototype, not a finished hardware diagnostic product. It contains the docs, Antigravity CLI instructions/skills, sample input, battery/SSD/RAM anomaly rules, a JSON/HTML report generator, and unit tests.

## Why this project exists

Existing projects cover a surprising amount of this space. In particular, [HWCheck](https://github.com/dailybarid/hwcheck) is a very close open-source match for a bootable second-hand-laptop inspection kit. Before writing native collectors or a boot image, evaluate it and the other projects in [`docs/prior-art.md`](docs/prior-art.md). Do not claim features or gaps are unique without reproducing them on supported hardware.

Our target differentiation is not “more tests” alone. It is:

- evidence provenance and uncertainty for each result;
- explicit test coverage (pass/fail/inconclusive/skipped/manual);
- battery and storage anomaly correlation without unsupported fraud accusations;
- clean offline mode with explicit, opt-in reference sync;
- cross-platform adapters for Windows 11/10/8.1, mainstream Linux, Intel Mac and native macOS/Apple Silicon where possible;
- reproducible reports with rule versions, timestamps, raw-value references and optional signatures;
- safety gates for tests that write to storage or put hardware under load;
- a tested support matrix instead of assuming every sensor/device reports everything.

## Current implementation status

Implemented and tested in this repository:

- JSON snapshot input contract (illustrated in `examples/sample_session.json`);
- battery capacity degradation and low-cycle/high-degradation discrepancy rules;
- NVMe/SSD wear, critical-warning, media-error and self-test-result flags;
- advertised-vs-detected RAM comparison with a tolerance that avoids byte/GiB rounding false positives;
- explainable findings and local JSON/HTML report output;
- unit tests using synthetic fixture data.

Not yet implemented: live hardware collection; Windows/Linux/macOS collectors; a bootable image; stress tests; UI/manual test harness; reference database; report signature; hardware certification. **A passing unit test is not proof of physical-hardware compatibility.** See [`docs/known-limitations.md`](docs/known-limitations.md).

## Quick start

Requires Python 3.10+; the analysis prototype uses only the Python standard library.

```bash
python -m venv .venv
# Linux/macOS:
. .venv/bin/activate
# Windows PowerShell:
# .venv\Scripts\Activate.ps1
python -m pip install -e .
python -m unittest discover -s tests -v

# Analyze the synthetic example and write HTML:
laptop-inspector examples/sample_session.json --format html --output report.html

# Or use the module entry point:
python -m laptop_inspector examples/sample_session.json --format json --output report.json
```

Expected result: the example emits review findings for 28% battery degradation with a low reported cycle count and nonzero SSD media errors. The 8% NVMe endurance-used value does not erase the significance of the error counter. Values are synthetic and only demonstrate the rules.

## Development with Antigravity CLI

1. Open this directory as your workspace and run `agy`.
2. Read `AGENTS.md`, then `docs/antigravity.md`.
3. The repo includes native workspace skills under `.agents/skills/` and custom agents under `.agents/agents/`.
4. First task: complete the acceptance checklist in `TASKS.md` item by item. Do not implement every platform collector before the schema and fixtures are robust.
5. Use the optional free Superpowers Antigravity plugin only if useful; installation and security notes are in `docs/antigravity.md`.

## Safety promise

Default behavior must be read-only. Never silently mount an internal filesystem read-write, run destructive drive tests, alter firmware settings, bypass passwords/encryption, or upload machine data. A human operator must explicitly authorize any additional-risk test. The battery-swelling physical check is manual; suspected swelling means stop charging/testing and safely withdraw the unit from service.

## Main documents

- [`AGENTS.md`](AGENTS.md) — coding-agent ground rules.
- [`docs/architecture.md`](docs/architecture.md) — components, schemas, and data flow.
- [`docs/design.md`](docs/design.md) — UX, rules, findings, output contracts.
- [`docs/prior-art.md`](docs/prior-art.md) — existing projects and defensible differentiators.
- [`docs/requirements.md`](docs/requirements.md) — functional/non-functional requirements.
- [`docs/platform-matrix.md`](docs/platform-matrix.md) — intended OS coverage and limits.
- [`docs/threat-model.md`](docs/threat-model.md) — privacy and safety.
- [`docs/test-plan.md`](docs/test-plan.md) — unit/integration/physical-device testing.
- [`docs/hardware-validation-plan.md`](docs/hardware-validation-plan.md) — device lab matrix.
- [`docs/antigravity.md`](docs/antigravity.md) — CLI setup and optional development tools.
- [`TASKS.md`](TASKS.md) — implementation checklist and first prompt.

## Sources

The research snapshot and source links are recorded in `docs/prior-art.md`. Key references include Antigravity's official [CLI plugins/skills docs](https://www.antigravity.google/docs/plugins?tab=cli), [HWCheck](https://github.com/dailybarid/hwcheck), [smartmontools](https://github.com/smartmontools/smartmontools), and the [Linux power supply class](https://docs.kernel.org/power/power_supply_class.html).
