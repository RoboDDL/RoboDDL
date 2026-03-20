#!/usr/bin/env python3
"""
Validate that YAML data files use the JSON-compatible double-quoted string format
required by the project's custom TypeScript YAML parser (loadVenueRecords.ts).

The parser uses JSON.parse() for scalar values, so all string values must be
wrapped in double quotes. Numbers (year: 2025), booleans (true/false), and
null values are also acceptable.

Usage:
    python3 scripts/validate_yaml_format.py
    python3 scripts/validate_yaml_format.py src/data/conference/icra.yaml
"""

import re
import sys
from pathlib import Path

DATA_DIRS = [
    Path("src/data/conference"),
    Path("src/data/journal"),
]

# Valid scalar patterns that JSON.parse() can handle
_INT_OR_FLOAT = re.compile(r"^-?\d+(\.\d+)?$")
_DOUBLE_QUOTED = re.compile(r'^"([^"\\]|\\.)*"$')
_KEYWORDS = {"true", "false", "null", "~", ""}


def is_valid_scalar(value: str) -> bool:
    """Return True if the value can be parsed by JSON.parse()."""
    if value in _KEYWORDS:
        return True
    if _INT_OR_FLOAT.match(value):
        return True
    if _DOUBLE_QUOTED.match(value):
        return True
    return False


def check_file(path: Path) -> list[tuple[int, str, str]]:
    """
    Check one YAML file for format violations.
    Returns a list of (line_number, line_text, error_message) tuples.
    """
    errors: list[tuple[int, str, str]] = []
    lines = path.read_text(encoding="utf-8").splitlines()

    for lineno, raw in enumerate(lines, 1):
        line = raw.rstrip()
        stripped = line.lstrip()

        # Skip blank lines, comments, and YAML document markers
        if not stripped or stripped.startswith("#") or stripped in ("---", "..."):
            continue

        # Find the content to check: strip a leading list-item dash if present
        content = stripped[2:].strip() if stripped.startswith("- ") else stripped

        # Find the first colon that separates a key from its value
        colon = content.find(":")
        if colon == -1:
            # Pure list scalar (no colon): e.g.  - "neurips"
            value = content
            if not is_valid_scalar(value):
                errors.append((lineno, line, f"unquoted or single-quoted string: {value!r}"))
            continue

        # Has a colon: could be  key: value  or  - key: value
        key = content[:colon].strip()
        if key.startswith('"') and key.endswith('"'):
            errors.append((lineno, line, f"quoted keys are not supported by the parser: {key!r}"))

        value = content[colon + 1:].strip()

        if value and not is_valid_scalar(value):
            errors.append((lineno, line, f"unquoted or single-quoted string: {value!r}"))

    return errors


def main() -> int:
    # Allow passing specific files/dirs on the command line
    if len(sys.argv) > 1:
        targets = [Path(arg) for arg in sys.argv[1:]]
    else:
        targets = DATA_DIRS

    yaml_files: list[Path] = []
    for target in targets:
        if target.is_file():
            yaml_files.append(target)
        elif target.is_dir():
            yaml_files.extend(sorted(target.glob("*.yaml")))
        else:
            print(f"warning: {target} does not exist, skipping", file=sys.stderr)

    if not yaml_files:
        print("No YAML files found.", file=sys.stderr)
        return 1

    total_errors = 0
    for path in yaml_files:
        errors = check_file(path)
        for lineno, line, message in errors:
            print(f"{path}:{lineno}: {message}")
            print(f"  {line.strip()}")
            total_errors += 1

    if total_errors:
        print(
            f"\n{total_errors} format error(s) found.\n"
            "All string values in YAML files must use double quotes, e.g.:\n"
            '  slug: "icra"   ✓\n'
            "  slug: icra     ✗\n"
            "  slug: 'icra'   ✗",
            file=sys.stderr,
        )
        return 1

    print(f"All {len(yaml_files)} YAML file(s) passed format validation.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
