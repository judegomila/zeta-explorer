#!/usr/bin/env python3
"""Dependency-free tamper tests for the full-interval N=1 replay."""

from __future__ import annotations

import hashlib
from pathlib import Path
import sys
import tempfile


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from verify_modular_n1_full_interval_payment import (  # noqa: E402
    arb_endpoints,
    parse_frozen_manifest_text,
    require_sha256,
    verify_frozen_manifest,
)


def expect_assertion(function, *args) -> None:
    try:
        function(*args)
    except AssertionError:
        return
    raise AssertionError(f"expected AssertionError from {function.__name__}")


def main() -> int:
    digest_a = "a" * 64
    digest_b = "b" * 64
    assert parse_frozen_manifest_text(
        f"{digest_a}  note.md\n{digest_b}  checker.py\n"
    ) == {"note.md": digest_a, "checker.py": digest_b}
    expect_assertion(parse_frozen_manifest_text, "not-a-digest  note.md\n")
    expect_assertion(
        parse_frozen_manifest_text,
        f"{digest_a}  note.md\n{digest_b}  note.md\n",
    )
    expect_assertion(parse_frozen_manifest_text, f"{digest_a}  ../escape\n")
    lower, upper = arb_endpoints("[1.000000000000000000000000000000 +/- 1e-40]")
    assert lower < upper
    expect_assertion(arb_endpoints, "[1 +/- -1e-40]")

    with tempfile.TemporaryDirectory(prefix="modular-n1-provenance-") as directory:
        base = Path(directory)
        candidate = base / "receipt.json"
        candidate.write_bytes(b'{"status":"PASS"}\n')
        expected = hashlib.sha256(candidate.read_bytes()).hexdigest()
        require_sha256(candidate, expected, "test receipt")
        candidate.write_bytes(candidate.read_bytes() + b" ")
        expect_assertion(require_sha256, candidate, expected, "test receipt")

        member = base / "member.json"
        member.write_bytes(b'{"directed":"bound"}\n')
        member_sha = hashlib.sha256(member.read_bytes()).hexdigest()
        manifest = base / "FROZEN_SHA256.txt"
        manifest.write_text(f"{member_sha}  member.json\n", encoding="utf-8")
        manifest_sha = hashlib.sha256(manifest.read_bytes()).hexdigest()
        assert verify_frozen_manifest(
            manifest, manifest_sha, {"member.json"}
        ) == {"member.json": member_sha}
        member.write_bytes(member.read_bytes() + b" ")
        expect_assertion(
            verify_frozen_manifest,
            manifest,
            manifest_sha,
            {"member.json"},
        )

    print("modular N=1 full-interval provenance tamper tests: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
