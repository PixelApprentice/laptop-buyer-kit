# Security policy

This is an early-stage project. Do not use it as a certified diagnostic tool or for safety-critical decisions.

## Reporting a vulnerability

Until a dedicated security contact exists, do not attach real laptop reports, serial numbers, disk dumps, or personal data to public issues. Open a private security advisory through the hosting platform if available, or contact the maintainers through the repository's configured security channel.

## Security design commitments

- Offline-first; no hidden telemetry.
- External reference retrieval is optional and separate from the analysis path.
- Reports redact identifiers by default in shareable mode.
- No arbitrary shell execution from report data or downloaded rules.
- Destructive tests are disabled by default and need explicit authorization.
- The tool never tries to bypass disk encryption, firmware passwords, OS permissions, activation, or access controls.
- Hardware commands use fixed argument arrays, timeouts, bounded output, and allowlisted executables; never interpolate untrusted input into a shell command.
