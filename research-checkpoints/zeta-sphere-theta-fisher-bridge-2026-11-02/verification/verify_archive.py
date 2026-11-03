#!/usr/bin/env python3
"""Verify the curated v18 baseline and every published continuation lane."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path, PurePosixPath
import sys


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / "evidence" / "v18-curated"
CP62 = ROOT / "evidence" / "cp62"
V19 = ROOT / "evidence" / "v19-delta"
CONTINUATION = ROOT / "evidence" / "v20-v26-continuation"

CONTINUATION_ROWS = {20: 45, 21: 25, 22: 25, 23: 35, 24: 26, 25: 7, 26: 11}
CONTINUATION_MANIFEST_SHA256 = {
    20: "761c84dc1ddfbbacd74e813c697c347a1d7d81acb48fed78025349f6c6c40f5c",
    21: "2c664231bd1cde8ce96626b906b4e4f08eec2951f7958649b57a5b6677ea5060",
    22: "18a3a2869b347a5d608fadf13846ddac41c99185e610f3bce671411f16216a83",
    23: "743e4f5d6ca69d11921cb1f35bab9a067a365988f5b66e6a5be9c6ef820abe09",
    24: "5f470db91af734a55aa6c944224c7580adc68e42fe41f3a8aeed3c0d7eaea9b0",
    25: "e112aca0d3dbb9860a52a0f32cf3a914c55e480b24aa24a26354d3a63e1a76b4",
    26: "51e9bec5caa6c711c760f33d2fbcb2dd3b8f245eb58821111860bc4f93cd10b1",
}


def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def fail(message: str) -> None:
    raise AssertionError(message)


def reject_symlinks(root: Path, label: str) -> None:
    for path in root.rglob("*"):
        if path.is_symlink():
            fail(f"symlink is not permitted in {label}: {path.relative_to(root)}")


def validate_relative_path(relative: object, label: str) -> str:
    if not isinstance(relative, str) or not relative:
        fail(f"invalid {label} path: {relative!r}")
    parsed = PurePosixPath(relative)
    if parsed.is_absolute() or ".." in parsed.parts or str(parsed) != relative:
        fail(f"unsafe or noncanonical {label} path: {relative!r}")
    return relative


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


def verify_continuation() -> tuple[int, int, int, int]:
    """Verify the deduplicated V20--V26 authored publication allowlists."""

    reject_symlinks(CONTINUATION, "V20--V26 continuation")

    expected: dict[str, dict[str, object]] = {}
    manifest_rows = 0
    repeated_rows = 0
    manifest_names: set[str] = set()
    for version, expected_count in CONTINUATION_ROWS.items():
        manifest_name = f"PUBLICATION_DELTA_V{version}.json"
        manifest_names.add(manifest_name)
        manifest_path = CONTINUATION / manifest_name
        if not manifest_path.is_file():
            fail(f"missing continuation publication manifest: {manifest_name}")
        if digest(manifest_path) != CONTINUATION_MANIFEST_SHA256[version]:
            fail(f"continuation publication manifest hash mismatch: {manifest_name}")
        publication = json.loads(manifest_path.read_text())
        if publication.get("version") != version:
            fail(f"expected continuation version {version} in {manifest_name}")
        if publication.get("baseline_version") != version - 1:
            fail(f"expected V{version} publication delta over V{version - 1}")
        rows = publication.get("files")
        if not isinstance(rows, list) or len(rows) != expected_count:
            fail(
                f"expected {expected_count} V{version} allowlist rows, got "
                f"{len(rows) if isinstance(rows, list) else rows!r}"
            )
        manifest_rows += len(rows)
        paths_in_manifest: set[str] = set()
        for row in rows:
            if not isinstance(row, dict):
                fail(f"invalid V{version} allowlist row: {row!r}")
            relative = validate_relative_path(row.get("path"), f"V{version} allowlist")
            expected_hash = row.get("sha256")
            if not isinstance(expected_hash, str) or len(expected_hash) != 64:
                fail(f"invalid V{version} SHA-256 for {relative}")
            if relative in paths_in_manifest:
                fail(f"duplicate path inside V{version} allowlist: {relative}")
            paths_in_manifest.add(relative)
            if relative in expected:
                if expected[relative]["sha256"] != expected_hash:
                    fail(f"conflicting continuation allowlist hashes: {relative}")
                repeated_rows += 1
            else:
                expected[relative] = {"sha256": expected_hash, "first_version": version}

    if manifest_rows != 174 or len(expected) != 146 or repeated_rows != 28:
        fail(
            "unexpected continuation allowlist accounting: "
            f"rows={manifest_rows}, unique={len(expected)}, repeats={repeated_rows}"
        )

    redactions_doc = json.loads(
        (ROOT / "provenance" / "v20-v26-redactions.json").read_text()
    )
    redacted_rows = redactions_doc.get("redacted")
    if not isinstance(redacted_rows, list):
        fail("invalid V20--V26 redactions receipt")
    redactions = {
        validate_relative_path(row.get("path"), "continuation redaction"): row
        for row in redacted_rows
        if isinstance(row, dict)
    }
    expected_redactions = {f"V{version}_INDEX.md" for version in CONTINUATION_ROWS}
    if set(redactions) != expected_redactions or len(redacted_rows) != 7:
        fail(
            "unexpected continuation redaction set: "
            f"expected={sorted(expected_redactions)}, actual={sorted(redactions)}"
        )
    if not redactions.keys() <= expected.keys():
        fail(f"unknown continuation redactions: {sorted(redactions.keys() - expected.keys())}")

    checked = 0
    checked_bytes = 0
    forbidden_suffixes = {".zip", ".pdf", ".html", ".tex"}
    for relative, row in expected.items():
        path = CONTINUATION / relative
        if not path.is_file():
            fail(f"missing continuation file: {relative}")
        if path.suffix.lower() in forbidden_suffixes:
            fail(f"forbidden captured-source type in continuation: {relative}")
        if relative in redactions:
            public = redactions[relative]
            if public.get("source_sha256") != row["sha256"]:
                fail(f"continuation redaction source hash mismatch: {relative}")
            if not isinstance(public.get("source_bytes"), int) or public["source_bytes"] <= 0:
                fail(f"invalid continuation redaction source byte count: {relative}")
            if path.stat().st_size != public.get("public_bytes"):
                fail(f"continuation redacted byte mismatch: {relative}")
            if digest(path) != public.get("public_sha256"):
                fail(f"continuation redacted hash mismatch: {relative}")
        elif digest(path) != row["sha256"]:
            fail(f"continuation allowlist hash mismatch: {relative}")
        checked += 1
        checked_bytes += path.stat().st_size

    metadata = manifest_names | {"README.md"}
    actual = {
        str(path.relative_to(CONTINUATION))
        for path in CONTINUATION.rglob("*")
        if path.is_file()
    }
    expected_files = set(expected) | metadata
    if actual != expected_files:
        fail(
            "unexpected continuation public file set: "
            f"extra={sorted(actual - expected_files)}, missing={sorted(expected_files - actual)}"
        )

    receipt = json.loads((ROOT / "provenance" / "v20-v26-publication.json").read_text())
    source = receipt.get("source_artifact", {})
    expected_source = {
        "name": "zeta_sphere_campaign_v26_20261103T0228Z.zip",
        "bytes": 5658383,
        "sha256": "945a1f0b5bc0a3fbb0852bd3af2512e5f9797022aad48ded4afc9bc9dba1d71e",
        "manifest_payloads_verified": 839,
        "v25_payloads_preserved": 825,
        "v19_payloads_preserved": 672,
        "v18_payloads_preserved": 585,
    }
    for key, value in expected_source.items():
        if source.get(key) != value:
            fail(f"unexpected continuation source receipt field {key!r}: {source.get(key)!r}")
    expected_accounting = {
        "new_paths_since_v19": 167,
        "source_allowlist_rows": 174,
        "source_unique_allowlisted_paths": 146,
        "source_repeated_allowlist_rows": 28,
        "source_non_allowlisted_paths": 21,
        "byte_identical_public_allowlist_paths": 139,
        "public_text_redactions": 7,
        "retained_publication_manifests": 7,
        "omitted_duplicate_private_provenance_paths": 14,
    }
    if receipt.get("delta_accounting") != expected_accounting:
        fail("unexpected V20--V26 publication accounting")

    return checked, checked_bytes, len(redactions), repeated_rows


def main() -> int:
    snapshot_checked, snapshot_bytes, excluded, redacted = verify_snapshot()
    cp62_checked, cp62_bytes = verify_cp62()
    v19_checked, v19_bytes, v19_redacted = verify_v19()
    continuation_checked, continuation_bytes, continuation_redacted, continuation_repeats = (
        verify_continuation()
    )
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
                "v20_v26_allowlist_files_verified": continuation_checked,
                "v20_v26_allowlist_bytes_verified": continuation_bytes,
                "v20_v26_public_redactions": continuation_redacted,
                "v20_v26_repeated_manifest_rows": continuation_repeats,
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

