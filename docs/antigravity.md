# Antigravity CLI development setup and free tools

Research checked: 2026-10-25. Antigravity CLI documentation currently describes workspace skills under `.agents/skills/<folder>/`, custom agents under `.agents/agents/<name>/agent.md`, and plugin installation with `agy plugin`. See the official [CLI plugins page](https://www.antigravity.google/docs/plugins?tab=cli), [agent skills docs](https://antigravity.google/docs/skills?app=cli), and [agents command docs](https://antigravity.google/docs/cli/commands/agents).

## Included in this repository

- Root `AGENTS.md` with durable project rules.
- `.agents/AGENTS.md` workspace-specific instructions.
- `.agents/agents/diagnostics-architect/agent.md` and `hardware-qa/agent.md` custom agents.
- Skills: `hardware-evidence`, `test-first`, `research-prior-art`, and `cross-platform-collector` under `.agents/skills/`.

Open the repository root with `agy`, then use the CLI's skill commands if discovered; run `/agents` to inspect custom agents. Skill discovery follows the current Antigravity CLI paths, but validate against your installed CLI version.

## Recommended free development aids

### 1. Superpowers — optional Antigravity plugin

Repository: https://github.com/obra/superpowers  
Current project docs/releases describe native Antigravity plugin installation and workflows for brainstorming, planning, test-driven development, debugging, and review. The repository LICENSE is MIT as of the research date. Pin/review the exact version and confirm its license and permissions again before installation.

Install from shell:

```bash
agy plugin install https://github.com/obra/superpowers
agy plugin list
```

This is an optional workflow aid, not a runtime dependency. Review its current source/version and plugin permissions before enabling it. The project has frequent updates; don't assume old installation tutorials still apply.

### 2. Microsoft Playwright CLI + skills — only when UI work starts

Repository: https://github.com/microsoft/playwright-cli  
This can help agents validate a browser-based dashboard through repeatable UI interactions. Add only once a web UI exists; it does not improve hardware collectors or raw SMART parsing. Its repository license is Apache-2.0 as of the research date; check the exact version and installation instructions upstream.

### 3. Antigravity official Marketplace

Use `/plugin` inside `agy`, search for GitHub/testing/browser-related plugins, inspect each plugin's bundled skills/MCP tools and permissions, and only install what the project needs. CLI installation examples are documented at https://www.antigravity.google/docs/marketplace . Marketplace names and availability can change; I have not installed plugins in your environment or verified what is available in your account.

### 4. Built-in Python test tools

- `unittest` is included in Python, so no paid service is required.
- `pytest` is a free/open-source optional test runner once the project grows.
- `ruff` is a useful optional linter/formatter; `mypy` or `pyright` can be added if type-checking becomes valuable.
- GitHub Actions can run public repo CI within current free allowances, but don't upload real reports, identifiers, or hardware dumps as CI artifacts.

Keep `unittest` as the no-dependency baseline. Add tools only when a measurable workflow benefit outweighs dependency and offline-package complexity.

## Safe install policy

- Plugin/skill content is executable-influence: it can alter agent workflows. Review repository, license, manifests, hooks and shell commands before install.
- Prefer a pinned tag/commit and record it in docs or a lockfile.
- Avoid broad MCP filesystem/shell privileges unless essential.
- Never paste raw reports containing serials or customer data into online agent prompts/issues.
- Don't install plugins just because they are popular. For this repository, test discipline, debugging and optional browser testing are the relevant capabilities.

## Suggested first prompt for Antigravity

> Read `AGENTS.md`, `.agents/AGENTS.md`, `docs/prior-art.md`, `docs/architecture.md`, `docs/design.md`, `docs/requirements.md`, `docs/test-plan.md`, and `TASKS.md`. Do not write OS collectors yet. First audit the current analysis prototype, run all tests, identify gaps in schema validation/coverage/provenance, and produce a prioritized plan. Research HWCheck's current implementation and license files before deciding whether upstreaming/forking is better than a new project. Make small changes, add tests before behavior changes, report exactly what was tested, and do not claim physical-hardware validation without evidence.
