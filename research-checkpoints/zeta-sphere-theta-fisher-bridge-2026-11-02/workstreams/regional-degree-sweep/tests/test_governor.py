#!/usr/bin/env python3
"""Dependency-free tests for fail-safe lock parsing and queue validation."""

from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from supervisor import parse_lock_output  # noqa: E402


def main() -> int:
    assert parse_lock_output(
        '"IOConsoleLocked" = Yes\n"CGSSessionScreenIsLocked"=Yes'
    )[0] == "locked"
    assert parse_lock_output(
        '"IOConsoleLocked" = No\n"CGSSessionScreenIsLocked"=No'
    )[0] == "unlocked"
    assert parse_lock_output(
        '"IOConsoleLocked" = Yes\n"CGSSessionScreenIsLocked"=No'
    )[0] == "unknown"
    assert parse_lock_output('"IOConsoleLocked" = No')[0] == "unknown"
    print("governor parser tests: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
