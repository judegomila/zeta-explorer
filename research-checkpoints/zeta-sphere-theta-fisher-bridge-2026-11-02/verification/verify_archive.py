#!/usr/bin/env python3
"""Verify the curated v18 baseline and every published continuation lane."""

from __future__ import annotations

from collections import Counter
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / "evidence" / "v18-curated"
CP62 = ROOT / "evidence" / "cp62"
V19 = ROOT / "evidence" / "v19-delta"
CONTINUATION = ROOT / "evidence" / "v20-v26-continuation"
V27_V30 = ROOT / "evidence" / "v27-v30-continuation"
V31 = ROOT / "evidence" / "v31-continuation"
V32 = ROOT / "evidence" / "v32-continuation"
V33 = ROOT / "evidence" / "v33-continuation"

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

V27_V30_ROWS = {27: 15, 28: 12, 29: 35, 30: 59}
V27_V30_MANIFEST_SHA256 = {
    27: "71a438daf04dbdde7db345603d3162e43663ef6e5529c85c6b0e8e40a8c607d1",
    28: "b7f68a5ea1ea87dfc448eeaa1a0472c9b8f20b6b92cc71b55096ad776fef99f1",
    29: "a32a7b503b25f107895096a4e5379cfbf79e01ce31f50d3bf07515792b188127",
    30: "e31c63a415971d31bdb76e8ec12bc23082b5e119d05e7e1282d23ed9c762a8a4",
}

V27_V30_REDACTIONS = {
    "V27_INDEX.md",
    "V28_INDEX.md",
    "V29_INDEX.md",
    "V30_INDEX.md",
    "source_0145_audit/EVEN_A4_AUDIT.md",
    "source_0145_audit/REVIEW_SUMMARY.md",
}

V27_V30_PRIVATE_PATHS = {
    "source_0145_audit/PRIVATE_SOURCE_FROZEN_SHA256.txt",
    "source_0145_audit/private/conversation.json",
    "source_0145_audit/private/paper.pdf",
    "source_0145_audit/private/paper.txt",
    "source_0145_audit/private/source.zip",
    "source_0145_audit/private/source/a4_integrated_certificate.json",
    "source_0145_audit/private/source/a4_integrated_certificate.py",
    "source_0145_audit/private/source/bridge_gram_exact_checks.json",
    "source_0145_audit/private/source/bridge_gram_exact_checks.py",
    "source_0145_audit/private/source/energy_matrix_exact_checks.json",
    "source_0145_audit/private/source/energy_matrix_exact_checks.py",
    "source_0145_audit/private/source/factorization_attack_exact_checks.json",
    "source_0145_audit/private/source/factorization_attack_exact_checks.py",
    "source_0145_audit/private/source/h6_integrated_certificate.json",
    "source_0145_audit/private/source/h6_integrated_certificate.py",
    "source_0145_audit/private/source/integrated_pivots_certificate.json",
    "source_0145_audit/private/source/integrated_pivots_certificate.py",
    "source_0145_audit/private/source/recurrence_attack_checks.json",
    "source_0145_audit/private/source/recurrence_attack_checks.py",
    "source_0145_audit/private/source/relative_modular_bridge_README.txt",
    "source_0145_audit/private/source/relative_modular_bridge_all_order.tex",
    "source_0145_audit/private/source/relative_modular_bridge_attacks.tex",
    "source_0145_audit/private/source/relative_modular_bridge_bounds.tex",
    "source_0145_audit/private/source/relative_modular_bridge_continuation.tex",
    "source_0145_audit/private/source/relative_modular_bridge_extensions.tex",
    "source_0145_audit/private/source/relative_modular_bridge_hierarchy.tex",
    "source_0145_audit/private/source/schur_transport_certificate.json",
    "source_0145_audit/private/source/schur_transport_certificate.py",
    "source_0145_audit/private/source/sixth_pointwise_certificate.json",
    "source_0145_audit/private/source/sixth_pointwise_certificate.py",
    "source_0145_audit/private/source/slice_h5_exact_certificate.json",
    "source_0145_audit/private/source/slice_h5_exact_certificate.py",
    "source_0145_audit/private/source_metadata.json",
}

V31_MANIFEST_SHA256 = "bd0dfa4859ac06b1f700cbbc662e95a6708421d440ec189d2d0ae369203ff22b"
V31_REDACTIONS = {"V31_INDEX.md"}
V31_REVIEWED_CLASSIFICATIONS = {
    "independent_audit_or_replay": 63,
    "reviewed_owned": 73,
    "reviewed_scope_index": 1,
}
V31_DIAGNOSTIC_CLASSIFICATIONS = {
    "invalid_polynomial_correction_history": 8,
    "mixed_valid_odd_invalid_even_diagnostic": 4,
    "owned_diagnostic_not_theorem": 12,
    "superseded_owned_source_unused_read_cleanup": 1,
}

V32_MANIFEST_SHA256 = "88b4af6f1ddae8216974e59e902975e3feeb125c28aea966f52d792b8df0e188"
V32_REDACTIONS = {"V32_INDEX.md"}
V32_REVIEWED_CLASSIFICATIONS = {
    "independent_audit_or_replay": 257,
    "reviewed_owned": 128,
    "reviewed_scope_index": 1,
}
V32_DIAGNOSTIC_CLASSIFICATIONS = {"owned_diagnostic_not_theorem": 19}

V33_MANIFEST_SHA256 = "b5cc41779a7ff61652e850be4e59fb3e0ac846d6d01586202965ef05256b1c91"
V33_REVIEWED_CLASSIFICATIONS = {
    "independent_audit_or_replay": 82,
    "reviewed_owned": 115,
    "reviewed_owned_external_theorem_dependency": 7,
    "reviewed_scope_index": 1,
}
V33_DIAGNOSTIC_CLASSIFICATIONS = {"owned_diagnostic_not_theorem": 29}

PACKAGE_MANIFEST = ROOT / "SHA256SUMS"
PACKAGE_BUILD_INTERMEDIATES = {
    "paper/main.aux",
    "paper/main.bbl",
    "paper/main.blg",
    "paper/main.log",
    "paper/main.out",
    "paper/main.toc",
    "paper/main.xdv",
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


def is_runtime_cache_path(relative: str) -> bool:
    """Identify interpreter caches, which never belong to the public package."""

    parsed = PurePosixPath(relative)
    return "__pycache__" in parsed.parts or parsed.suffix.lower() in {".pyc", ".pyo"}


def verify_package_manifest() -> tuple[int, int]:
    """Bind the complete public checkpoint tree, excluding build intermediates."""

    expected: dict[str, str] = {}
    for line in PACKAGE_MANIFEST.read_text().splitlines():
        if not line.strip():
            continue
        parts = line.split(None, 1)
        if len(parts) != 2:
            fail(f"invalid package checksum row: {line!r}")
        expected_hash, relative = parts
        if relative.startswith("./"):
            relative = relative[2:]
        relative = validate_relative_path(relative, "package manifest")
        if (
            relative == "SHA256SUMS"
            or relative in PACKAGE_BUILD_INTERMEDIATES
            or is_runtime_cache_path(relative)
        ):
            fail(f"invalid package manifest target: {relative}")
        if relative in expected:
            fail(f"duplicate package manifest target: {relative}")
        if len(expected_hash) != 64:
            fail(f"invalid package SHA-256 for {relative}")
        expected[relative] = expected_hash

    actual = {
        str(path.relative_to(ROOT))
        for path in ROOT.rglob("*")
        if path.is_file()
        and path != PACKAGE_MANIFEST
        and str(path.relative_to(ROOT)) not in PACKAGE_BUILD_INTERMEDIATES
        and not is_runtime_cache_path(str(path.relative_to(ROOT)))
    }
    if actual != set(expected):
        fail(
            "unexpected package file set: "
            f"extra={sorted(actual - set(expected))}, "
            f"missing={sorted(set(expected) - actual)}"
        )

    checked_bytes = 0
    for relative, expected_hash in expected.items():
        path = ROOT / relative
        if digest(path) != expected_hash:
            fail(f"package checksum mismatch: {relative}")
        checked_bytes += path.stat().st_size
    return len(expected), checked_bytes


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
        "name": "zeta_sphere_campaign_v26_20261103T0229Z.zip",
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


def verify_v27_v30() -> tuple[int, int, int, int]:
    """Verify the deduplicated V27--V30 owned publication allowlists."""

    reject_symlinks(V27_V30, "V27--V30 continuation")

    expected: dict[str, dict[str, object]] = {}
    manifest_rows = 0
    repeated_rows = 0
    manifest_names: set[str] = set()
    for version, expected_count in V27_V30_ROWS.items():
        manifest_name = f"PUBLICATION_DELTA_V{version}.json"
        manifest_names.add(manifest_name)
        manifest_path = V27_V30 / manifest_name
        if not manifest_path.is_file():
            fail(f"missing V27--V30 publication manifest: {manifest_name}")
        if digest(manifest_path) != V27_V30_MANIFEST_SHA256[version]:
            fail(f"V27--V30 publication manifest hash mismatch: {manifest_name}")
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
                    fail(f"conflicting V27--V30 allowlist hashes: {relative}")
                repeated_rows += 1
            else:
                expected[relative] = {"sha256": expected_hash, "first_version": version}

    if manifest_rows != 121 or len(expected) != 84 or repeated_rows != 37:
        fail(
            "unexpected V27--V30 allowlist accounting: "
            f"rows={manifest_rows}, unique={len(expected)}, repeats={repeated_rows}"
        )

    redactions_doc = json.loads(
        (ROOT / "provenance" / "v27-v30-redactions.json").read_text()
    )
    redacted_rows = redactions_doc.get("redacted")
    if not isinstance(redacted_rows, list):
        fail("invalid V27--V30 redactions receipt")
    redactions = {
        validate_relative_path(row.get("path"), "V27--V30 redaction"): row
        for row in redacted_rows
        if isinstance(row, dict)
    }
    if set(redactions) != V27_V30_REDACTIONS or len(redacted_rows) != 6:
        fail(
            "unexpected V27--V30 redaction set: "
            f"expected={sorted(V27_V30_REDACTIONS)}, actual={sorted(redactions)}"
        )
    if not redactions.keys() <= expected.keys():
        fail(f"unknown V27--V30 redactions: {sorted(redactions.keys() - expected.keys())}")

    checked = 0
    checked_bytes = 0
    forbidden_suffixes = {".zip", ".pdf", ".html", ".tex"}
    private_identifier = re.compile(
        rb"libfile_|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
    )
    for relative, row in expected.items():
        path = V27_V30 / relative
        if not path.is_file():
            fail(f"missing V27--V30 file: {relative}")
        if path.suffix.lower() in forbidden_suffixes:
            fail(f"forbidden captured-source type in V27--V30 continuation: {relative}")
        if relative in redactions:
            public = redactions[relative]
            if public.get("source_sha256") != row["sha256"]:
                fail(f"V27--V30 redaction source hash mismatch: {relative}")
            if not isinstance(public.get("source_bytes"), int) or public["source_bytes"] <= 0:
                fail(f"invalid V27--V30 redaction source byte count: {relative}")
            if path.stat().st_size != public.get("public_bytes"):
                fail(f"V27--V30 redacted byte mismatch: {relative}")
            if digest(path) != public.get("public_sha256"):
                fail(f"V27--V30 redacted hash mismatch: {relative}")
        elif digest(path) != row["sha256"]:
            fail(f"V27--V30 allowlist hash mismatch: {relative}")
        if private_identifier.search(path.read_bytes()):
            fail(f"private identifier remains in V27--V30 public file: {relative}")
        checked += 1
        checked_bytes += path.stat().st_size

    metadata = manifest_names | {"README.md"}
    actual = {
        str(path.relative_to(V27_V30))
        for path in V27_V30.rglob("*")
        if path.is_file()
    }
    expected_files = set(expected) | metadata
    if actual != expected_files:
        fail(
            "unexpected V27--V30 public file set: "
            f"extra={sorted(actual - expected_files)}, missing={sorted(expected_files - actual)}"
        )
    if V27_V30_PRIVATE_PATHS & actual:
        fail(f"private V28 paths published: {sorted(V27_V30_PRIVATE_PATHS & actual)}")

    receipt = json.loads((ROOT / "provenance" / "v27-v30-publication.json").read_text())
    source = receipt.get("source_artifact", {})
    expected_source = {
        "name": "zeta_sphere_campaign_v30_20261103T0421Z.zip",
        "bytes": 7056540,
        "sha256": "f17d58c60d7dabaab7018ad38aa57c628748c7dc9ed2081c616332a95ace5cd6",
        "unzip_test": "PASS",
        "manifest_payloads_verified": 968,
        "v29_payloads_preserved": 940,
        "v28_payloads_preserved": 905,
        "v27_payloads_preserved": 857,
        "v26_payloads_preserved": 839,
        "v19_payloads_preserved": 672,
        "v18_payloads_preserved": 585,
    }
    if source != expected_source:
        fail("unexpected V27--V30 source artifact receipt")
    expected_accounting = {
        "new_paths_since_v26": 129,
        "source_allowlist_rows": 121,
        "source_unique_allowlisted_paths": 84,
        "source_repeated_allowlist_rows": 37,
        "source_non_allowlisted_paths": 45,
        "byte_identical_public_allowlist_paths": 78,
        "public_text_redactions": 6,
        "retained_publication_manifests": 4,
        "omitted_duplicate_private_provenance_paths": 8,
        "omitted_private_acquired_paths": 33,
    }
    if receipt.get("delta_accounting") != expected_accounting:
        fail("unexpected V27--V30 publication accounting")
    if set(receipt.get("excluded_private_acquired_paths", [])) != V27_V30_PRIVATE_PATHS:
        fail("unexpected V27--V30 private/acquired exclusion set")

    return checked, checked_bytes, len(redactions), repeated_rows


def verify_v31() -> tuple[int, int, int, int]:
    """Verify the exact V31 reviewed plus correction-history publication lane."""

    reject_symlinks(V31, "V31 continuation")
    manifest_name = "PUBLICATION_DELTA_V31.json"
    manifest_path = V31 / manifest_name
    if not manifest_path.is_file():
        fail("missing V31 publication manifest")
    if manifest_path.stat().st_size != 36672:
        fail("unexpected V31 publication manifest byte count")
    if digest(manifest_path) != V31_MANIFEST_SHA256:
        fail("V31 publication manifest hash mismatch")

    publication = json.loads(manifest_path.read_text())
    if publication.get("version") != 31 or publication.get("baseline_version") != 30:
        fail("expected V31 publication delta over V30")
    reviewed_rows = publication.get("reviewed_owned_files")
    diagnostic_rows = publication.get("diagnostic_or_correction_history")
    if not isinstance(reviewed_rows, list) or len(reviewed_rows) != 137:
        fail("expected 137 V31 reviewed-owned rows")
    if not isinstance(diagnostic_rows, list) or len(diagnostic_rows) != 25:
        fail("expected 25 V31 diagnostic/correction rows")
    if publication.get("historical_working_file_revisions") != []:
        fail("unexpected V31 historical working-file revisions")
    private_policy = str(publication.get("private_provenance_policy", ""))
    if "remain private" not in private_policy or "No acquisition or publication clearance" not in private_policy:
        fail("unexpected V31 private-provenance policy")

    expected: dict[str, dict[str, object]] = {}
    reviewed_paths: set[str] = set()
    diagnostic_paths: set[str] = set()
    for label, rows, destination in (
        ("reviewed", reviewed_rows, reviewed_paths),
        ("diagnostic", diagnostic_rows, diagnostic_paths),
    ):
        for row in rows:
            if not isinstance(row, dict):
                fail(f"invalid V31 {label} row: {row!r}")
            relative = validate_relative_path(row.get("path"), f"V31 {label}")
            expected_hash = row.get("sha256")
            classification = row.get("classification")
            if not isinstance(expected_hash, str) or len(expected_hash) != 64:
                fail(f"invalid V31 SHA-256 for {relative}")
            if not isinstance(classification, str) or not classification:
                fail(f"invalid V31 classification for {relative}")
            if relative in expected:
                fail(f"duplicate V31 publication path: {relative}")
            expected[relative] = row
            destination.add(relative)

    if reviewed_paths & diagnostic_paths:
        fail("V31 reviewed and diagnostic path sets overlap")
    if len(expected) != 162:
        fail(f"expected 162 V31 classified paths, got {len(expected)}")
    reviewed_counts = Counter(row["classification"] for row in reviewed_rows)
    diagnostic_counts = Counter(row["classification"] for row in diagnostic_rows)
    if dict(reviewed_counts) != V31_REVIEWED_CLASSIFICATIONS:
        fail(f"unexpected V31 reviewed classifications: {dict(reviewed_counts)}")
    if dict(diagnostic_counts) != V31_DIAGNOSTIC_CLASSIFICATIONS:
        fail(f"unexpected V31 diagnostic classifications: {dict(diagnostic_counts)}")

    redactions_doc = json.loads((ROOT / "provenance" / "v31-redactions.json").read_text())
    redacted_rows = redactions_doc.get("redacted")
    if not isinstance(redacted_rows, list) or len(redacted_rows) != 1:
        fail("expected one V31 redaction row")
    redactions = {
        validate_relative_path(row.get("path"), "V31 redaction"): row
        for row in redacted_rows
        if isinstance(row, dict)
    }
    if set(redactions) != V31_REDACTIONS:
        fail(f"unexpected V31 redaction set: {sorted(redactions)}")
    if not redactions.keys() <= expected.keys():
        fail("V31 redaction is not in the publication manifest")

    checked = 0
    checked_bytes = 0
    forbidden_suffixes = {".zip", ".pdf", ".html", ".tex"}
    private_identifier = re.compile(
        rb"libfile_|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
    )
    for relative, row in expected.items():
        path = V31 / relative
        if not path.is_file():
            fail(f"missing V31 classified file: {relative}")
        if path.suffix.lower() in forbidden_suffixes:
            fail(f"forbidden captured-source type in V31 continuation: {relative}")
        if "private" in PurePosixPath(relative).parts:
            fail(f"private capture path published in V31 continuation: {relative}")
        if relative in redactions:
            redaction = redactions[relative]
            if redaction.get("source_sha256") != row["sha256"]:
                fail(f"V31 redaction source hash mismatch: {relative}")
            if redaction.get("source_bytes") != 5409:
                fail(f"V31 redaction source byte mismatch: {relative}")
            if path.stat().st_size != redaction.get("public_bytes"):
                fail(f"V31 redacted byte mismatch: {relative}")
            if digest(path) != redaction.get("public_sha256"):
                fail(f"V31 redacted hash mismatch: {relative}")
        elif digest(path) != row["sha256"]:
            fail(f"V31 classified hash mismatch: {relative}")
        if private_identifier.search(path.read_bytes()):
            fail(f"private identifier remains in V31 public file: {relative}")
        checked += 1
        checked_bytes += path.stat().st_size

    metadata = {manifest_name, "README.md"}
    actual = {
        str(path.relative_to(V31))
        for path in V31.rglob("*")
        if path.is_file()
    }
    expected_files = set(expected) | metadata
    if actual != expected_files:
        fail(
            "unexpected V31 public file set: "
            f"extra={sorted(actual - expected_files)}, missing={sorted(expected_files - actual)}"
        )
    if checked_bytes != 573957:
        fail(f"unexpected V31 classified public bytes: {checked_bytes}")

    receipt = json.loads((ROOT / "provenance" / "v31-publication.json").read_text())
    expected_source = {
        "name": "zeta_sphere_campaign_v31_20261103T0543Z.zip",
        "bytes": 7430485,
        "sha256": "841e3ea3e332334fb022b5a1859fcbce0c8b3f3012a3659e2e83e13e2f2391ef",
        "unzip_test": "PASS",
        "manifest_payloads_verified": 1133,
        "manifest_payload_bytes_verified": 17309985,
        "v30_payloads_preserved": 968,
        "v30_sha256": "f17d58c60d7dabaab7018ad38aa57c628748c7dc9ed2081c616332a95ace5cd6",
    }
    if receipt.get("source_artifact") != expected_source:
        fail("unexpected V31 source artifact receipt")
    expected_publication_manifest = {
        "name": manifest_name,
        "bytes": 36672,
        "sha256": V31_MANIFEST_SHA256,
        "reviewed_owned_rows": 137,
        "diagnostic_or_correction_rows": 25,
    }
    if receipt.get("publication_manifest") != expected_publication_manifest:
        fail("unexpected V31 publication-manifest receipt")
    expected_accounting = {
        "new_payload_paths_since_v30": 165,
        "new_payload_bytes_since_v30": 887067,
        "source_classified_owned_paths": 162,
        "source_classified_owned_bytes": 573853,
        "public_classified_owned_paths": 162,
        "public_classified_owned_bytes": 573957,
        "source_unique_content_hashes": 126,
        "source_duplicate_content_groups": 30,
        "source_repeated_path_rows": 36,
        "byte_identical_public_payload_paths": 161,
        "public_text_redactions": 1,
        "retained_publication_manifests": 1,
        "source_backed_public_bytes_before_readme": 610629,
        "omitted_duplicate_v30_provenance_paths": 2,
    }
    if receipt.get("delta_accounting") != expected_accounting:
        fail("unexpected V31 publication accounting")
    if receipt.get("omitted_duplicate_v30_provenance_paths") != [
        "provenance/v30/MANIFEST.json",
        "provenance/v30/MANIFEST.sha256",
    ]:
        fail("unexpected V31 omitted duplicate-provenance paths")
    if receipt.get("existing_public_lane_overlap") != 0:
        fail("V31 publication unexpectedly overlaps earlier public lanes")
    excluded = receipt.get("excluded_material")
    if excluded != [
        "zeta_sphere_campaign_v31_20261103T0543Z.zip",
        "MANIFEST.json",
        "MANIFEST.sha256",
        "all source paths not explicitly classified in PUBLICATION_DELTA_V31.json",
        "all inherited private or acquired-source captures",
    ]:
        fail("unexpected V31 excluded-material receipt")

    return checked, checked_bytes, len(reviewed_rows), len(diagnostic_rows)


def verify_v32() -> tuple[int, int, int, int]:
    """Verify the exact V32 reviewed plus diagnostic publication lane."""

    reject_symlinks(V32, "V32 continuation")
    manifest_name = "PUBLICATION_DELTA_V32.json"
    manifest_path = V32 / manifest_name
    if not manifest_path.is_file():
        fail("missing V32 publication manifest")
    if manifest_path.stat().st_size != 94217:
        fail("unexpected V32 publication manifest byte count")
    if digest(manifest_path) != V32_MANIFEST_SHA256:
        fail("V32 publication manifest hash mismatch")

    publication = json.loads(manifest_path.read_text())
    if publication.get("version") != 32 or publication.get("baseline_version") != 31:
        fail("expected V32 publication delta over V31")
    reviewed_rows = publication.get("reviewed_owned_files")
    diagnostic_rows = publication.get("diagnostic_or_correction_history")
    if not isinstance(reviewed_rows, list) or len(reviewed_rows) != 386:
        fail("expected 386 V32 reviewed-owned rows")
    if not isinstance(diagnostic_rows, list) or len(diagnostic_rows) != 19:
        fail("expected 19 V32 diagnostic/correction rows")
    if publication.get("historical_working_file_revisions") != []:
        fail("unexpected V32 historical working-file revisions")
    private_policy = str(publication.get("private_provenance_policy", ""))
    if "remain private" not in private_policy or "No acquisition or publication clearance" not in private_policy:
        fail("unexpected V32 private-provenance policy")

    expected: dict[str, dict[str, object]] = {}
    reviewed_paths: set[str] = set()
    diagnostic_paths: set[str] = set()
    for label, rows, destination in (
        ("reviewed", reviewed_rows, reviewed_paths),
        ("diagnostic", diagnostic_rows, diagnostic_paths),
    ):
        for row in rows:
            if not isinstance(row, dict):
                fail(f"invalid V32 {label} row: {row!r}")
            relative = validate_relative_path(row.get("path"), f"V32 {label}")
            expected_hash = row.get("sha256")
            classification = row.get("classification")
            if not isinstance(expected_hash, str) or len(expected_hash) != 64:
                fail(f"invalid V32 SHA-256 for {relative}")
            if not isinstance(classification, str) or not classification:
                fail(f"invalid V32 classification for {relative}")
            if relative in expected:
                fail(f"duplicate V32 publication path: {relative}")
            expected[relative] = row
            destination.add(relative)

    if reviewed_paths & diagnostic_paths:
        fail("V32 reviewed and diagnostic path sets overlap")
    if len(expected) != 405:
        fail(f"expected 405 V32 classified paths, got {len(expected)}")
    reviewed_counts = Counter(row["classification"] for row in reviewed_rows)
    diagnostic_counts = Counter(row["classification"] for row in diagnostic_rows)
    if dict(reviewed_counts) != V32_REVIEWED_CLASSIFICATIONS:
        fail(f"unexpected V32 reviewed classifications: {dict(reviewed_counts)}")
    if dict(diagnostic_counts) != V32_DIAGNOSTIC_CLASSIFICATIONS:
        fail(f"unexpected V32 diagnostic classifications: {dict(diagnostic_counts)}")

    redactions_doc = json.loads((ROOT / "provenance" / "v32-redactions.json").read_text())
    redacted_rows = redactions_doc.get("redacted")
    if not isinstance(redacted_rows, list) or len(redacted_rows) != 1:
        fail("expected one V32 redaction row")
    redactions = {
        validate_relative_path(row.get("path"), "V32 redaction"): row
        for row in redacted_rows
        if isinstance(row, dict)
    }
    if set(redactions) != V32_REDACTIONS:
        fail(f"unexpected V32 redaction set: {sorted(redactions)}")
    if not redactions.keys() <= expected.keys():
        fail("V32 redaction is not in the publication manifest")

    checked = 0
    checked_bytes = 0
    forbidden_suffixes = {".zip", ".pdf", ".html", ".tex"}
    private_identifier = re.compile(
        rb"libfile_|file_[0-9a-f]{16,}|"
        rb"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|"
        rb"/(?:Users|home|tmp|var/folders)/[^\s\"']+"
    )
    for relative, row in expected.items():
        path = V32 / relative
        if not path.is_file():
            fail(f"missing V32 classified file: {relative}")
        if path.suffix.lower() in forbidden_suffixes:
            fail(f"forbidden captured-source type in V32 continuation: {relative}")
        if "private" in PurePosixPath(relative).parts:
            fail(f"private capture path published in V32 continuation: {relative}")
        if relative in redactions:
            redaction = redactions[relative]
            if redaction.get("source_sha256") != row["sha256"]:
                fail(f"V32 redaction source hash mismatch: {relative}")
            if redaction.get("source_bytes") != 6632:
                fail(f"V32 redaction source byte mismatch: {relative}")
            if path.stat().st_size != redaction.get("public_bytes"):
                fail(f"V32 redacted byte mismatch: {relative}")
            if digest(path) != redaction.get("public_sha256"):
                fail(f"V32 redacted hash mismatch: {relative}")
        elif digest(path) != row["sha256"]:
            fail(f"V32 classified hash mismatch: {relative}")
        if private_identifier.search(path.read_bytes()):
            fail(f"private identifier or local path remains in V32 public file: {relative}")
        checked += 1
        checked_bytes += path.stat().st_size

    metadata = {manifest_name, "README.md"}
    actual = {
        str(path.relative_to(V32))
        for path in V32.rglob("*")
        if path.is_file()
    }
    expected_files = set(expected) | metadata
    if actual != expected_files:
        fail(
            "unexpected V32 public file set: "
            f"extra={sorted(actual - expected_files)}, missing={sorted(expected_files - actual)}"
        )
    if checked_bytes != 1192893:
        fail(f"unexpected V32 classified public bytes: {checked_bytes}")

    receipt = json.loads((ROOT / "provenance" / "v32-publication.json").read_text())
    expected_source = {
        "name": "zeta_sphere_campaign_v32_20261103T0754Z.zip",
        "bytes": 8156868,
        "sha256": "ba4504126d2ee711ca5b4bf3f8ece7b83ee6023230afcb4d98c415d15f65a5cf",
        "unzip_test": "PASS",
        "manifest_payloads_verified": 1541,
        "manifest_payload_bytes_verified": 18926596,
        "v31_payloads_preserved": 1133,
        "v31_sha256": "841e3ea3e332334fb022b5a1859fcbce0c8b3f3012a3659e2e83e13e2f2391ef",
        "manifest_json_bytes": 285479,
        "manifest_json_sha256": "c2f9531869680381c2917c79a37add488cad7517a209aa954b8cad196d210ce4",
        "manifest_sha256_bytes": 180729,
        "manifest_sha256_sha256": "673362f418bdf90f8c7fb62bb5b372af01c20ca3f613400d1bb589a7067963c6",
    }
    if receipt.get("source_artifact") != expected_source:
        fail("unexpected V32 source artifact receipt")
    expected_publication_manifest = {
        "name": manifest_name,
        "bytes": 94217,
        "sha256": V32_MANIFEST_SHA256,
        "reviewed_owned_rows": 386,
        "diagnostic_or_correction_rows": 19,
    }
    if receipt.get("publication_manifest") != expected_publication_manifest:
        fail("unexpected V32 publication-manifest receipt")
    expected_accounting = {
        "new_payload_paths_since_v31": 408,
        "new_payload_bytes_since_v31": 1616611,
        "source_classified_owned_paths": 405,
        "source_classified_owned_bytes": 1192875,
        "public_classified_owned_paths": 405,
        "public_classified_owned_bytes": 1192893,
        "source_unique_content_hashes": 214,
        "source_duplicate_content_groups": 71,
        "source_repeated_path_rows": 191,
        "byte_identical_public_payload_paths": 404,
        "public_text_redactions": 1,
        "retained_publication_manifests": 1,
        "source_backed_public_bytes_before_readme": 1287110,
        "omitted_duplicate_v31_provenance_paths": 2,
    }
    if receipt.get("delta_accounting") != expected_accounting:
        fail("unexpected V32 publication accounting")
    if receipt.get("omitted_duplicate_v31_provenance_paths") != [
        "provenance/v31/MANIFEST.json",
        "provenance/v31/MANIFEST.sha256",
    ]:
        fail("unexpected V32 omitted duplicate-provenance paths")
    if receipt.get("existing_public_lane_overlap") != 0:
        fail("V32 publication unexpectedly overlaps earlier public lanes")
    if receipt.get("excluded_material") != [
        "zeta_sphere_campaign_v32_20261103T0754Z.zip",
        "MANIFEST.json",
        "MANIFEST.sha256",
        "all source paths not explicitly classified in PUBLICATION_DELTA_V32.json",
        "all inherited private or acquired-source captures",
    ]:
        fail("unexpected V32 excluded-material receipt")

    return checked, checked_bytes, len(reviewed_rows), len(diagnostic_rows)


def verify_v33() -> tuple[int, int, int, int]:
    """Verify the exact, zero-redaction V33 publication lane."""

    reject_symlinks(V33, "V33 continuation")
    manifest_name = "PUBLICATION_DELTA_V33.json"
    manifest_path = V33 / manifest_name
    if not manifest_path.is_file():
        fail("missing V33 publication manifest")
    if manifest_path.stat().st_size != 53937:
        fail("unexpected V33 publication manifest byte count")
    if digest(manifest_path) != V33_MANIFEST_SHA256:
        fail("V33 publication manifest hash mismatch")

    publication = json.loads(manifest_path.read_text())
    if publication.get("version") != 33 or publication.get("baseline_version") != 32:
        fail("expected V33 publication delta over V32")
    reviewed_rows = publication.get("reviewed_owned_files")
    diagnostic_rows = publication.get("diagnostic_or_correction_history")
    if not isinstance(reviewed_rows, list) or len(reviewed_rows) != 205:
        fail("expected 205 V33 reviewed-owned rows")
    if not isinstance(diagnostic_rows, list) or len(diagnostic_rows) != 29:
        fail("expected 29 V33 diagnostic/correction rows")
    if publication.get("historical_working_file_revisions") != []:
        fail("unexpected V33 historical working-file revisions")
    private_policy = str(publication.get("private_provenance_policy", ""))
    if (
        "remain private" not in private_policy
        or "No acquisition or publication clearance" not in private_policy
    ):
        fail("unexpected V33 private-provenance policy")

    expected: dict[str, dict[str, object]] = {}
    for label, rows in (("reviewed", reviewed_rows), ("diagnostic", diagnostic_rows)):
        for row in rows:
            if not isinstance(row, dict):
                fail(f"invalid V33 {label} row: {row!r}")
            relative = validate_relative_path(row.get("path"), f"V33 {label}")
            expected_hash = row.get("sha256")
            classification = row.get("classification")
            if not isinstance(expected_hash, str) or len(expected_hash) != 64:
                fail(f"invalid V33 SHA-256 for {relative}")
            if not isinstance(classification, str) or not classification:
                fail(f"invalid V33 classification for {relative}")
            if relative in expected:
                fail(f"duplicate V33 publication path: {relative}")
            expected[relative] = row

    if len(expected) != 234:
        fail(f"expected 234 V33 classified paths, got {len(expected)}")
    reviewed_counts = Counter(row["classification"] for row in reviewed_rows)
    diagnostic_counts = Counter(row["classification"] for row in diagnostic_rows)
    if dict(reviewed_counts) != V33_REVIEWED_CLASSIFICATIONS:
        fail(f"unexpected V33 reviewed classifications: {dict(reviewed_counts)}")
    if dict(diagnostic_counts) != V33_DIAGNOSTIC_CLASSIFICATIONS:
        fail(f"unexpected V33 diagnostic classifications: {dict(diagnostic_counts)}")

    redactions_doc = json.loads((ROOT / "provenance" / "v33-redactions.json").read_text())
    if redactions_doc.get("redacted") != []:
        fail("V33 is a zero-redaction publication lane")
    redaction_policy = str(redactions_doc.get("policy", ""))
    if "all 234 classified payloads are retained byte-for-byte" not in redaction_policy:
        fail("unexpected V33 zero-redaction policy")

    checked = 0
    checked_bytes = 0
    forbidden_suffixes = {".zip", ".pdf", ".html", ".tex"}
    private_identifier = re.compile(
        rb"libfile_|file_[0-9a-f]{16,}|"
        rb"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|"
        rb"/(?:Users|home|tmp|var/folders)/[^\s\"']+"
    )
    for relative, row in expected.items():
        path = V33 / relative
        if not path.is_file():
            fail(f"missing V33 classified file: {relative}")
        if path.suffix.lower() in forbidden_suffixes:
            fail(f"forbidden captured-source type in V33 continuation: {relative}")
        if "private" in PurePosixPath(relative).parts:
            fail(f"private capture path published in V33 continuation: {relative}")
        if digest(path) != row["sha256"]:
            fail(f"V33 classified hash mismatch: {relative}")
        if private_identifier.search(path.read_bytes()):
            fail(f"private identifier or personal path remains in V33 public file: {relative}")
        checked += 1
        checked_bytes += path.stat().st_size

    metadata = {manifest_name, "README.md"}
    actual = {
        str(path.relative_to(V33))
        for path in V33.rglob("*")
        if path.is_file()
    }
    expected_files = set(expected) | metadata
    if actual != expected_files:
        fail(
            "unexpected V33 public file set: "
            f"extra={sorted(actual - expected_files)}, missing={sorted(expected_files - actual)}"
        )
    if checked_bytes != 647767:
        fail(f"unexpected V33 classified public bytes: {checked_bytes}")

    receipt = json.loads((ROOT / "provenance" / "v33-publication.json").read_text())
    expected_source = {
        "name": "zeta_sphere_campaign_v33_20261103T1331Z.zip",
        "bytes": 8672645,
        "sha256": "7fa9c3f26154506f107cba1ac45e58545ef51b9115496d4965a00b45a8d75007",
        "unzip_test": "PASS",
        "manifest_payloads_verified": 1778,
        "manifest_payload_bytes_verified": 20094508,
        "v32_payloads_preserved": 1541,
        "v32_sha256": "ba4504126d2ee711ca5b4bf3f8ece7b83ee6023230afcb4d98c415d15f65a5cf",
        "manifest_json_bytes": 332889,
        "manifest_json_sha256": "ea4a09031cf1edfd95e732eab720c5631310fa4de6fc530c0ce76014c7e836a3",
        "manifest_sha256_bytes": 212119,
        "manifest_sha256_sha256": "b268a4ff41a7c04f50622358f5f17b7381876b724678127554f4c9763545f6ba",
    }
    if receipt.get("source_artifact") != expected_source:
        fail("unexpected V33 source artifact receipt")
    expected_publication_manifest = {
        "name": manifest_name,
        "bytes": 53937,
        "sha256": V33_MANIFEST_SHA256,
        "reviewed_owned_rows": 205,
        "diagnostic_or_correction_rows": 29,
    }
    if receipt.get("publication_manifest") != expected_publication_manifest:
        fail("unexpected V33 publication-manifest receipt")
    expected_accounting = {
        "new_payload_paths_since_v32": 237,
        "new_payload_bytes_since_v32": 1167912,
        "source_classified_owned_paths": 234,
        "source_classified_owned_bytes": 647767,
        "public_classified_owned_paths": 234,
        "public_classified_owned_bytes": 647767,
        "source_unique_content_hashes": 216,
        "source_duplicate_content_groups": 17,
        "source_repeated_path_rows": 18,
        "byte_identical_public_payload_paths": 234,
        "public_text_redactions": 0,
        "retained_publication_manifests": 1,
        "source_backed_public_bytes_before_readme": 701704,
        "repository_readme_bytes": 3428,
        "public_lane_files": 236,
        "public_lane_bytes": 705132,
        "omitted_duplicate_v32_provenance_paths": 2,
    }
    if receipt.get("delta_accounting") != expected_accounting:
        fail("unexpected V33 publication accounting")
    if receipt.get("omitted_duplicate_v32_provenance_paths") != [
        "provenance/v32/MANIFEST.json",
        "provenance/v32/MANIFEST.sha256",
    ]:
        fail("unexpected V33 omitted duplicate-provenance paths")
    if receipt.get("existing_public_lane_overlap") != 0:
        fail("V33 publication unexpectedly overlaps earlier public lanes")
    if receipt.get("excluded_material") != [
        "zeta_sphere_campaign_v33_20261103T1331Z.zip",
        "MANIFEST.json",
        "MANIFEST.sha256",
        "all source paths not explicitly classified in PUBLICATION_DELTA_V33.json",
        "all inherited private or acquired-source captures",
    ]:
        fail("unexpected V33 excluded-material receipt")

    return checked, checked_bytes, len(reviewed_rows), len(diagnostic_rows)


def main() -> int:
    snapshot_checked, snapshot_bytes, excluded, redacted = verify_snapshot()
    cp62_checked, cp62_bytes = verify_cp62()
    v19_checked, v19_bytes, v19_redacted = verify_v19()
    continuation_checked, continuation_bytes, continuation_redacted, continuation_repeats = (
        verify_continuation()
    )
    v27_v30_checked, v27_v30_bytes, v27_v30_redacted, v27_v30_repeats = (
        verify_v27_v30()
    )
    v31_checked, v31_bytes, v31_reviewed, v31_diagnostic = verify_v31()
    v32_checked, v32_bytes, v32_reviewed, v32_diagnostic = verify_v32()
    v33_checked, v33_bytes, v33_reviewed, v33_diagnostic = verify_v33()
    package_checked, package_bytes = verify_package_manifest()
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
                "v27_v30_allowlist_files_verified": v27_v30_checked,
                "v27_v30_allowlist_bytes_verified": v27_v30_bytes,
                "v27_v30_public_redactions": v27_v30_redacted,
                "v27_v30_repeated_manifest_rows": v27_v30_repeats,
                "v31_classified_files_verified": v31_checked,
                "v31_classified_bytes_verified": v31_bytes,
                "v31_reviewed_files": v31_reviewed,
                "v31_diagnostic_correction_files": v31_diagnostic,
                "v31_public_redactions": len(V31_REDACTIONS),
                "v32_classified_files_verified": v32_checked,
                "v32_classified_bytes_verified": v32_bytes,
                "v32_reviewed_files": v32_reviewed,
                "v32_diagnostic_correction_files": v32_diagnostic,
                "v32_public_redactions": len(V32_REDACTIONS),
                "v33_classified_files_verified": v33_checked,
                "v33_classified_bytes_verified": v33_bytes,
                "v33_reviewed_files": v33_reviewed,
                "v33_diagnostic_correction_files": v33_diagnostic,
                "v33_public_redactions": 0,
                "package_manifest_files_verified": package_checked,
                "package_manifest_bytes_verified": package_bytes,
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

