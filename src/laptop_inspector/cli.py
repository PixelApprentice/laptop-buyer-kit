"""Command-line entry point for offline snapshot analysis."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from .analysis import analyze_snapshot
from .report import to_html, to_json


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Analyze a normalized laptop inspection snapshot (no live hardware access).")
    parser.add_argument("snapshot", type=Path, help="Input snapshot JSON")
    parser.add_argument("--format", choices=("json", "html"), default="json", help="Report format (default: json)")
    parser.add_argument("--output", type=Path, help="Output file; defaults to stdout")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        with args.snapshot.open("r", encoding="utf-8") as handle:
            snapshot = json.load(handle)
        if not isinstance(snapshot, dict):
            raise ValueError("Top-level JSON value must be an object")
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"error: unable to read snapshot: {exc}", file=sys.stderr)
        return 2

    try:
        report = analyze_snapshot(snapshot)
    except (TypeError, ValueError, AttributeError) as exc:
        print(f"error: snapshot structure is invalid: {exc}", file=sys.stderr)
        return 2
    output = to_html(report) if args.format == "html" else to_json(report)
    if args.output:
        try:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(output, encoding="utf-8")
        except OSError as exc:
            print(f"error: unable to write report: {exc}", file=sys.stderr)
            return 2
    else:
        sys.stdout.write(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
