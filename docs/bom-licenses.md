# Bill of materials and license policy

## Policy

Before a release includes third-party code or binaries, record name, upstream URL, exact version/commit, license, file-level exceptions, checksum, modifications, redistribution conditions and required notices. Produce an SBOM (CycloneDX or SPDX) for release artifacts.

Do not equate “free download” with “open source”. Do not bundle proprietary/free-for-personal-use components in a project advertised as open source. Confirm upstream licenses and notices on the exact version being distributed.

## Candidate integrations (not bundled by this starter)

| Project | Primary use | License/documentation note | Integration posture |
|---|---|---|---|
| smartmontools | SMART data; SATA/SCSI/NVMe via smartctl | Upstream repo documents GPL-2.0 | External executable; check redistribution obligations before bundling |
| nvme-cli | NVMe controller/health/error logs on Linux | Verify current upstream license and transitive dependencies when selecting version | Optional Linux adapter |
| Memtest86+ | Standalone RAM testing | Check current source license and platform notes; Apple Silicon native unsupported according to upstream | Offer as separate test where compatible |
| stress-ng | Controlled CPU/memory stress | Verify upstream license/version and test behavior | Optional; gated by explicit consent |
| LibreHardwareMonitor | Windows sensors | MPL-2.0 with separately licensed components | Optional integration; audit notices and admin requirements |
| HardInfo2 | Linux inventory/benchmark | Multiple license files/third-party components documented upstream | Prefer reference/integration only after audit |
| HWCheck | Close open-source buyer-kit analogue | Upstream repo advertises MIT; audit bundled assets/dependencies too | Evaluate upstreaming/forking before parallel build |
| Hardware Clinic | Feature benchmark | Proprietary; personal non-commercial use only per project page | Do not bundle/reuse proprietary code |

This table is an initial review, not a substitute for legal review or inspection of the selected release files.
