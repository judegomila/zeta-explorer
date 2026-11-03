#!/usr/bin/env python3
"""Verify the curated v18 baseline and the complete CP62 delta."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / "evidence" / "v18-curated"
CP62 = ROOT / "evidence" / "cp62"


def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def fail(message: str) -> None:
    raise AssertionError(message)


def verify_snapshot() -> tuple[int, int, int, int]:
    manifest = json.loads((SNAPSHOT / "MANIFEST.json").read_text())
    if manifest.get("version") != 18:
        fail(f"expected snapshot version 18, got {manifest.get('version')!r}")
    exclusions = json.loads((ROOT / "provenance" / "exclusions.json").read_text())
    excluded = {row["path"] for row in exclusions["excluded"]}
    redactions_doc = json.loads((ROOT / "provenance" / "redactions.json").read_text())
    redactions = {row["path"]: row for row in redactions_doc["redacted"]}
    expected = {row["path"]: row for row in manifest["files"]}
    if not excluded <= expected.keys():
        fail(f"unknown exclusions: {sorted(excluded - expected.keys())}")
    if not redactions.keys() <= expected.keys():
        fail(f"unknown redactions: {sorted(redactions.keys() - expected.keys())}")
    if excluded & redactions.keys():
        fail(f"paths cannot be both excluded and redacted: {sorted(excluded & redactions.keys())}")

    checked = 0
    checked_bytes = 0
    for relative, row in expected.items():
        path = SNAPSHOT / relative
        if relative in excluded:
            if path.exists():
                fail(f"policy-excluded path is present: {relative}")
            continue
        if not path.is_file():
            fail(f"missing v18 file: {relative}")
        if relative in redactions:
            public = redactions[relative]
            if public["source_bytes"] != row["bytes"]:
                fail(f"redaction source byte mismatch: {relative}")
            if public["source_sha256"] != row["sha256"]:
                fail(f"redaction source hash mismatch: {relative}")
            if path.stat().st_size != public["public_bytes"]:
                fail(f"redacted byte mismatch: {relative}")
            if digest(path) != public["public_sha256"]:
                fail(f"redacted hash mismatch: {relative}")
        else:
            if path.stat().st_size != row["bytes"]:
                fail(f"byte mismatch: {relative}")
            if digest(path) != row["sha256"]:
                fail(f"hash mismatch: {relative}")
        checked += 1
        checked_bytes += path.stat().st_size

    actual_payloads = {
        str(path.relative_to(SNAPSHOT))
        for path in SNAPSHOT.rglob("*")
        if path.is_file()
        and str(path.relative_to(SNAPSHOT)) not in {"MANIFEST.json", "MANIFEST.sha256"}
    }
    expected_payloads = set(expected) - excluded
    if actual_payloads != expected_payloads:
        fail(
            "unexpected v18 payload set: "
            f"extra={sorted(actual_payloads - expected_payloads)}, "
            f"missing={sorted(expected_payloads - actual_payloads)}"
        )
    return checked, checked_bytes, len(excluded), len(redactions)


def verify_cp62() -> tuple[int, int]:
    rows: dict[str, str] = {}
    for line in (CP62 / "SHA256SUMS").read_text().splitlines():
        if not line.strip():
            continue
        expected_hash, relative = line.split(None, 1)
        rows[relative.strip()] = expected_hash

    checked = 0
    checked_bytes = 0
    for relative, expected_hash in rows.items():
        path = CP62 / relative
        if not path.is_file():
            fail(f"missing CP62 file: {relative}")
        if digest(path) != expected_hash:
            fail(f"CP62 hash mismatch: {relative}")
        checked += 1
        checked_bytes += path.stat().st_size

    actual = {
        str(path.relative_to(CP62))
        for path in CP62.rglob("*")
        if path.is_file() and path.name != "SHA256SUMS"
    }
    if actual != set(rows):
        fail(
            "unexpected CP62 payload set: "
            f"extra={sorted(actual - set(rows))}, missing={sorted(set(rows) - actual)}"
        )
    return checked, checked_bytes


def main() -> int:
    snapshot_checked, snapshot_bytes, excluded, redacted = verify_snapshot()
    cp62_checked, cp62_bytes = verify_cp62()
    print(
        json.dumps(
            {
                "status": "PASS",
                "v18_files_verified": snapshot_checked,
                "v18_bytes_verified": snapshot_bytes,
                "v18_policy_exclusions": excluded,
                "v18_public_redactions": redacted,
                "cp62_files_verified": cp62_checked,
                "cp62_bytes_verified": cp62_bytes,
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (AssertionError, OSError, ValueError, json.JSONDecodeError) as error:
        print(json.dumps({"status": "FAIL", "error": str(error)}), file=sys.stderr)
        sys.exit(1)

