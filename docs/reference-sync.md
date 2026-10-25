# Optional online reference synchronization

## Purpose

Online lookups can validate model-specific specifications, OS lifecycle, official firmware releases and dependency advisories. They are supporting references, not a prerequisite for a normal offline inspection.

## Sources to prefer

1. Manufacturer-maintained product specification/support pages.
2. Official Microsoft/Apple OS lifecycle and compatibility documentation.
3. Official kernel/project docs for Linux interfaces and tool support.
4. Upstream release pages/security advisories and package metadata.
5. Community databases only as secondary clues with source date and confidence.

## Cache record

Each reference record should include `source_id`, canonical URL, publisher, retrieval timestamp (UTC), source version/release/date, content hash, signature metadata where supported, parser version, expiry/max-age and confidence/authority class.

## Integrity and failure

- Sign a manifest with a project release key; verify before import.
- Do not download executable rules or code into the analysis path.
- HTML parsing must be robust to markup changes; preserve source excerpts with license constraints.
- Show stale/unavailable status when offline. Do not silently fall back to invented specs.
- Network errors do not fail the inspection.
- Only request network access after operator enables online reference mode.
- Do not send device serial/model combinations or a full diagnostic report unless a separate explicit consent flow explains the disclosure.

## Model matching

Use manufacturer + product family/model code + regional variant + known configuration. Fuzzy name matching may suggest a candidate but cannot automatically mark a claim verified. Distinguish direct manufacturer evidence, third-party listings, and inferred defaults.
