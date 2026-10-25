---
name: test-first
description: Implement changes with regression tests, deterministic fixtures, and honest coverage reporting.
---
# Test-first skill

1. Reproduce the issue or define an acceptance test first.
2. Add a failing unit test using synthetic data; never commit real device identities or reports.
3. Implement the smallest deterministic change. Keep hardware/OS/network IO out of pure analysis functions.
4. Test boundaries, missing keys, invalid types, invalid units, permission denial, timeouts and partial output where relevant.
5. Run `python -m unittest discover -s tests -v`; report failures honestly.
6. Review output escaping, error messages, and deterministic ordering.
7. Update docs and known limitations. Do not equate fixture tests with real hardware validation.
