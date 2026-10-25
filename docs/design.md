# Product and technical design

## User

A buyer, refurbisher, or repair technician inspecting a used laptop with limited time and mixed trust in the installed operating system. Typical workflows range from a quick 5–10 minute screening to a more thorough inspection.

## Product principles

- **Evidence before verdict:** make each flag traceable to one or more measurements.
- **No false precision:** do not convert uncertain observations into a universal 0–100 laptop score.
- **No accusation engine:** a discrepancy is a reason to investigate, not proof of fraud.
- **Honest coverage:** skipped, inaccessible, untested, and unsupported are visibly different from pass.
- **Protect the seller's data:** default to read-only behavior, local reports, and no upload.
- **Portable:** USB-oriented live environment plus native collectors for details only visible from the installed OS.
- **Dual-view consistency:** where safely possible, compare a native-OS snapshot with a booted live-environment snapshot, preserving which source saw each value and the collection time.
- **Human-in-the-loop:** physical condition, swelling, display pixels, ports and sound require manual confirmation or dedicated fixtures.

## Flow

1. **Start session:** choose Quick or Thorough, state owner/operator permission, enter listing claims (model, RAM, disk, display, CPU/GPU, warranty if provided).
2. **Preflight:** identify architecture/firmware boot mode; show Secure Boot, RAID/RST, BitLocker/FileVault/LUKS, permission limitations; ensure the kit will not write to internal storage.
3. **Collect inventory:** model/firmware, CPU/GPU, RAM, storage, battery, OS, ports/devices.
4. **Guided tests:** quick read-only checks first. Longer self-tests or controlled stress tests require explicit consent and a time estimate.
5. **Manual inspection:** chassis/hinges, charger, keyboard, trackpad, webcam/mic/audio, screen, ports, Wi-Fi/Bluetooth, charging, fan/noise. Record `pass`, `fail`, `not_tested`, or `not_applicable` with optional notes.
6. **Analyze:** run deterministic, versioned rules locally.
7. **Review findings:** show severity, evidence, confidence, alternate explanations, and next action.
9. **Export:** local HTML/JSON; redact serials/MAC/UUID/host/user data from shareable reports by default.

## Findings model

Every finding includes:

- stable rule `code` and ruleset version;
- component and severity (`info`, `warning`, `high`, `critical`, `inconclusive`);
- human explanation grounded in the actual measurements;
- evidence map with units and source;
- confidence/source-quality level;
- recommended next action and what is not known.

Test execution state is separate: `passed`, `failed`, `warning`, `inconclusive`, `skipped`, `not_supported`, `not_run`, `manual`. Do not conflate a finding severity with test completion status.

## Battery design rules

- Capacity health = reported full-charge capacity / reported design capacity × 100.
- Degradation = 100 − capacity health.
- Start with configurable review at >=20%, high at >=30%, with a separately configured severe threshold such as >=40%.
- If degradation >=20% and cycle count <=50, flag `LOW_CYCLES_HIGH_DEGRADATION` as a discrepancy.
- Above-design values require data-quality/identity review, not a negative degradation score.
- Every result must cite the reading's source and date. If cycles are missing, do not set them to zero.
- Thresholds are initial triage defaults and need validation against actual laptop/battery samples; they are not universal manufacturer rejection limits.

## Storage design rules

- Preserve raw SMART/NVMe attributes and tool outputs in a privacy-safe diagnostic bundle when operator allows it.
- Keep ATA/SATA SMART interpretation distinct from NVMe logs.
- Nonzero media errors and uncorrectable/pending/reallocated counters prompt review; severity depends on field, protocol, current state, and changes over time.
- NVMe `percentage_used` represents controller-reported endurance used, not a universal physical-failure probability.
- `power_on_hours` and `unsafe_shutdowns` are context, not automatic defects.
- Record RAID/RST/USB bridges and controller access failures as coverage limitations.

## RAM design rules

- Compare claimed and detected values with explicit units, not integer labels alone.
- Model `installed`, `usable`, and `available` separately where platform exposes them.
- Do not interpret shared GPU memory or hardware-reserved memory as a missing module.
- A stress-test pass only means that test completed cleanly under the given conditions; it is not a lifetime guarantee.

## Verdict policy

Do not issue a verdict if critical tests were not performed but are needed for a requested confidence level. Suggested narrative states: `No major issue detected in completed checks`, `Review before buying`, `High risk; verify or renegotiate`, `Stop: safety/critical fault`, `Insufficient evidence`. Always list incomplete tests; no single aggregate score should hide a failing category.

## Accessibility and language

Use plain language, high contrast, keyboard-operable UI, meaningful print/PDF output, and strings stored separately from rules. Plan English first; future localization should not translate machine identifiers or numeric unit names unsafely. HWCheck already advertises English, French and Arabic support; localization alone is not a differentiator.
