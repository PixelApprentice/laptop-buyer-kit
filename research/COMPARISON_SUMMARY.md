# Competitive assessment summary

Date checked: 2026-10-25. See `../docs/prior-art.md` for sources and caveats.

| Project | What it already solves well | What this project must not assume | Potential reason to extend rather than duplicate |
|---|---|---|---|
| HWCheck | Buyer-oriented live USB; battery/cycles; SMART and NVMe; RAM/CPU thermals; display/audio/input/peripheral checklist; report/verdict; privacy and shell/parse gotchas documented | Whether every rule has unit tests, physical coverage breadth, reliable model references, and complete per-test provenance requires code audit | Native OS + live-USB dual-view, model-source evidence, per-rule quality corpus if missing, Windows/macOS-native collectors |
| Hardware Clinic | Low-level UEFI diagnostics, memory/storage/thermal/display, some rescue/repair and report-signing workflows | It is not OSI open source; public page states personal-use-only free tier; don't bundle code | Benchmark UX only; keep any separate project buyer-safe/read-only and open source |
| hw-probe | Linux inventory, driver/device operability, hardware logs, offline view, optional online uploads | It is not a complete multi-OS buyer assurance workflow; privacy docs warn redaction can fail | local-only evidence model and cross-platform buyer reports |
| HardInfo2 | Linux system information, benchmarking and reports | Inventory/benchmarks are not the same as a guided, evidence-backed buyer decision | optional Linux inventory integration after license review |
| LibreHardwareMonitor | Windows temperatures/fans/voltages/clocks across PC components | Sensor data alone cannot validate a whole laptop or purchase listing | Optional sensor adapter for Windows thermal tests |
| smartmontools | Mature cross-platform SMART data collection and self-tests | SMART results alone aren't an overall storage health guarantee | Use as a mature underlying collector; focus new work on normalization, rules, provenance and UX |

## Primary hypothesis

The differentiator to test is a **dual-view evidence reconciliation engine**: native Windows/macOS evidence + optional live USB evidence + manufacturer configuration sources + explicit incomplete-data states + reproducible report provenance. This combination isn't established as present in the public docs reviewed, but its absence is not proven. Audit upstream code and physical behavior before committing to a parallel product.
