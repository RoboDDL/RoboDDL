#!/bin/sh

set -eu

REPO_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
HOOK_SOURCE="$REPO_ROOT/.githooks/pre-commit"
HOOK_TARGET_DIR="$REPO_ROOT/.git/hooks"
HOOK_TARGET="$HOOK_TARGET_DIR/pre-commit"

if [ ! -d "$HOOK_TARGET_DIR" ]; then
  echo "Git hooks directory not found, skipping hook install."
  exit 0
fi

mkdir -p "$HOOK_TARGET_DIR"
cp "$HOOK_SOURCE" "$HOOK_TARGET"
chmod +x "$HOOK_TARGET"

echo "Installed Git pre-commit hook."
