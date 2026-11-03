#!/usr/bin/env python3
"""Verify the curated v18 baseline and the CP62/v19 public deltas."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / "evidence" / "v18-curated"
CP62 = ROOT / "evidence" / "cp62"
V19 = ROOT / "evidence" / "v19-delta"


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


def verify_v19() -> tuple[int, int, int]:
    publication = json.loads((V19 / "PUBLICATION_DELTA.json").read_text())
    if publication.get("version") != 19 or publication.get("baseline_version") != 18:
        fail("expected v19 publication delta over v18")

    rows = publication.get("files")
    if not isinstance(rows, list) or len(rows) != 58:
        fail(f"expected 58 v19 allowlist rows, got {len(rows) if isinstance(rows, list) else rows!r}")
    expected = {row["path"]: row for row in rows}
    if len(expected) != len(rows):
        fail("duplicate v19 allowlist paths")

    redactions_doc = json.loads((ROOT / "provenance" / "v19-redactions.json").read_text())
    redactions = {row["path"]: row for row in redactions_doc["redacted"]}
    if not redactions.keys() <= expected.keys():
        fail(f"unknown v19 redactions: {sorted(redactions.keys() - expected.keys())}")

    checked = 0
    checked_bytes = 0
    forbidden_suffixes = {".zip", ".pdf", ".html", ".tex"}
    for relative, row in expected.items():
        path = V19 / relative
        if not path.is_file():
            fail(f"missing v19 file: {relative}")
        if path.suffix.lower() in forbidden_suffixes:
            fail(f"forbidden captured-source type in v19 public delta: {relative}")
        if relative in redactions:
            public = redactions[relative]
            if public["source_sha256"] != row["sha256"]:
                fail(f"v19 redaction source hash mismatch: {relative}")
            if path.stat().st_size != public["public_bytes"]:
                fail(f"v19 redacted byte mismatch: {relative}")
            if digest(path) != public["public_sha256"]:
                fail(f"v19 redacted hash mismatch: {relative}")
        elif digest(path) != row["sha256"]:
            fail(f"v19 allowlist hash mismatch: {relative}")
        checked += 1
        checked_bytes += path.stat().st_size

    metadata = {"PUBLICATION_DELTA.json", "README.md"}
    actual = {
        str(path.relative_to(V19))
        for path in V19.rglob("*")
        if path.is_file() and str(path.relative_to(V19)) not in metadata
    }
    if actual != set(expected):
        fail(
            "unexpected v19 public payload set: "
            f"extra={sorted(actual - set(expected))}, missing={sorted(set(expected) - actual)}"
        )
    for relative in metadata:
        if not (V19 / relative).is_file():
            fail(f"missing v19 metadata file: {relative}")

    publication_receipt = json.loads((ROOT / "provenance" / "v19-publication.json").read_text())
    accounting = publication_receipt["delta_accounting"]
    if accounting != {
        "new_paths_since_v18": 87,
        "source_allowlisted_paths": 58,
        "source_non_allowlisted_paths": 29,
        "byte_identical_public_allowlist_paths": 56,
        "public_text_redactions": 2,
    }:
        fail("unexpected v19 publication accounting")
    return checked, checked_bytes, len(redactions)


def main() -> int:
    snapshot_checked, snapshot_bytes, excluded, redacted = verify_snapshot()
    cp62_checked, cp62_bytes = verify_cp62()
    v19_checked, v19_bytes, v19_redacted = verify_v19()
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
                "v19_allowlist_files_verified": v19_checked,
                "v19_allowlist_bytes_verified": v19_bytes,
                "v19_public_redactions": v19_redacted,
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

