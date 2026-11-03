#!/usr/bin/env python3
"""Dependency-light checks for the curated V33 continuation.

The checker reruns the exact-rational finite-degree arithmetic in a temporary
directory.  It validates the stored H10 consequence, source/audit mirrors,
internal freeze manifests, and the scope labels on reviewed obstructions.  It
deliberately does not rerun the published Platt--Trudgian computation, the
16 x 4000 x 4000 interval integration, or diagnostic/floating programs.
"""

from __future__ import annotations

from collections import Counter
from decimal import Decimal
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import sys
import tempfile


ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "evidence" / "v33-continuation"
AUTHOR = EVIDENCE / "theta_correlated_local_v1"
AUDIT = EVIDENCE / "theta_correlated_local_audit"
VERIFIED_ZERO = AUDIT / "verified_zero_degree_replay"
H10_AUDIT = AUDIT / "degree11_shift_replay"
NUMBER = re.compile(r"[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?")


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def fail(message: str) -> None:
    raise AssertionError(message)


def require_phrase(text: str, phrase: str, label: str) -> None:
    if " ".join(phrase.lower().split()) not in " ".join(text.lower().split()):
        fail(f"missing scope phrase {phrase!r} in {label}")


def interval_bounds(value: str) -> tuple[Decimal, Decimal]:
    numbers = NUMBER.findall(value)
    if len(numbers) != 2:
        fail(f"unexpected interval: {value!r}")
    first, second = map(Decimal, numbers)
    return (first - second, first + second) if "+/-" in value else (first, second)


def replay_verified_zero_constants() -> dict[str, object]:
    script = VERIFIED_ZERO / "check_constants.py"
    frozen = VERIFIED_ZERO / "constants.txt"
    with tempfile.TemporaryDirectory(prefix="zsv-v33-verified-zero-") as temporary:
        target = Path(temporary)
        shutil.copy2(script, target / script.name)
        completed = subprocess.run(
            [sys.executable, script.name],
            cwd=target,
            text=True,
            capture_output=True,
            check=False,
        )
    if completed.returncode != 0:
        fail(f"V33 exact finite-degree replay failed: {completed.stderr.strip()}")
    if completed.stdout != frozen.read_text():
        fail("V33 exact finite-degree replay differs from frozen output")
    require_phrase(completed.stdout, "degree 30000000000", "finite-degree replay")
    require_phrase(completed.stdout, "-230999999688 PASS", "finite-degree replay")
    require_phrase(
        completed.stdout,
        "6299958915587/3662109375000000 > 43/25000 PASS",
        "finite-degree replay",
    )

    theorem = (EVIDENCE / "sparse_exception_bridge_nov03/VERIFIED_ZERO_FINITE_DEGREE.md").read_text()
    audit = (AUDIT / "VERIFIED_ZERO_FINITE_DEGREE_AUDIT.md").read_text()
    require_phrase(theorem, "30-billion strengthening", "finite-degree theorem")
    require_phrase(audit, "degree <=3*10^10", "finite-degree audit")
    require_phrase(theorem, "not RH", "finite-degree theorem")
    require_phrase(theorem, "not an all-degree", "finite-degree theorem")
    require_phrase(audit, "nor an all-degree/RH theorem", "finite-degree audit")
    require_phrase(audit, "does not rerun its original large calculation", "finite-degree audit")
    require_phrase(audit, "No giant moment matrix was computed", "finite-degree audit")
    require_phrase(audit, "global bridge, not the spatially truncated", "finite-degree audit")

    if digest(frozen) != "8e69ec5ec17b9853f859081870d80b19bbca9c6f401508be741b575b673f2fe8":
        fail("unexpected frozen exact finite-degree output hash")
    if digest(VERIFIED_ZERO / "core_iv.txt") != (
        "382ab34083784b230e0c7a06010514b2109e298445ada0df31e356919c126bc7"
    ):
        fail("unexpected central interval replay output hash")
    return {
        "temporary_copy": True,
        "stdout_match": True,
        "maximum_degree": 30_000_000_000,
        "verified_height_used": 3_000_000_000_000,
        "spectral_cutoff": 2_900_000_000_000,
        "log_tail_upper": -230_999_999_688,
        "published_zero_computation_rerun": False,
    }


def verify_h10_summary() -> dict[str, object]:
    author_slabs = AUTHOR / "degree11_shift_slabs_16_4000_4000.json"
    audit_slabs = H10_AUDIT / author_slabs.name
    if digest(author_slabs) != digest(audit_slabs):
        fail("V33 H10 source/audit slab packets differ")
    if digest(author_slabs) != "a3a3b29860d5a92397c0e75d51105099ebb5b9aaf135f34a9b6afaeb04055a72":
        fail("unexpected V33 H10 slab-packet hash")
    slabs = json.loads(author_slabs.read_text())
    even = slabs.get("even10", {})
    odd = slabs.get("odd11", {})
    if not even.get("all_passed") or even.get("failed_slabs") != []:
        fail("V33 even10 slab packet is not all-pass")
    if odd.get("all_passed") is not False or odd.get("failed_slabs") != list(range(16)):
        fail("V33 odd11 packet is not the recorded all-slab inconclusive result")
    for parity, width in (("even10", 6), ("odd11", 6)):
        rows = slabs[parity].get("slabs")
        if not isinstance(rows, list) or len(rows) != 16:
            fail(f"unexpected V33 {parity} slab count")
        for index, row in enumerate(rows):
            if Decimal(row["a_lo"]) != Decimal(index) / 32 or Decimal(row["a_hi"]) != Decimal(index + 1) / 32:
                fail(f"unexpected V33 {parity} slab endpoints at {index}")
            pivots = row.get("pivot_lowers")
            if not isinstance(pivots, list) or len(pivots) != width:
                fail(f"unexpected V33 {parity} pivot count at slab {index}")
            if parity == "even10" and (not row.get("passed") or any(interval_bounds(v)[0] <= 0 for v in pivots)):
                fail(f"V33 even10 slab {index} did not retain six positive pivots")

    author_consequence = AUTHOR / "degree10_consequence.json"
    audit_consequence = H10_AUDIT / "consequence.json"
    if digest(author_consequence) != digest(audit_consequence):
        fail("V33 H10 source/audit consequences differ")
    if digest(author_consequence) != "37e73e9c41b0626a098d8289aa526a4ffa2cc6bf3e29960c67f73c04b77bdf61":
        fail("unexpected V33 H10 consequence hash")
    consequence = json.loads(author_consequence.read_text())
    pivots = consequence["even10"].get("uniform_LDL_pivot_lowers")
    if not isinstance(pivots, list) or len(pivots) != 6 or any(
        interval_bounds(value)[0] <= 0 for value in pivots
    ):
        fail("V33 H10 consequence does not retain six positive LDL pivots")
    schur_lower = interval_bounds(consequence["even10"]["uniform_monic_schur_lower"])[0]
    if schur_lower <= Decimal("8928867843900347"):
        fail("V33 H10 monic Schur lower bound is too small")
    if consequence.get("odd11", {}).get("status") != "INCONCLUSIVE":
        fail("V33 odd11 consequence is not marked INCONCLUSIVE")
    require_phrase(consequence["scope"], "NoH11 claim", "H10 consequence scope")

    theorem = (AUTHOR / "FULL_SHIFT_DEGREE10.md").read_text()
    h10_audit = (H10_AUDIT / "AUDIT.md").read_text()
    invalid = (AUTHOR / "degree11_initial_dimension_diagnostic/STATUS.md").read_text()
    require_phrase(theorem, "not eigenvalue reserves", "H10 theorem")
    require_phrase(theorem, "There is NO degree11 theorem", "H10 theorem")
    require_phrase(h10_audit, "This is not odd negativity", "H10 audit")
    require_phrase(invalid, "INVALID_DIMENSION", "invalid dimension receipt")
    require_phrase(invalid, "not a certificate", "invalid dimension receipt")
    return {
        "shift_slabs": 16,
        "tail_cells": 4000,
        "cutoff_cells": 4000,
        "even10_all_passed": True,
        "odd11_status": "INCONCLUSIVE",
        "uniform_monic_schur_gt": 8_928_867_843_900_347,
        "large_interval_job_rerun_by_default": False,
    }


def verify_internal_checksum_manifests() -> dict[str, int]:
    manifests = sorted(
        path
        for path in EVIDENCE.rglob("*")
        if path.is_file()
        and ("SHA256" in path.name or path.name == "REVIEWED_INPUT_SHA256.txt")
    )
    if len(manifests) != 52:
        fail(f"expected 52 V33 internal checksum manifests, got {len(manifests)}")
    hashes_to_paths: dict[str, list[Path]] = {}
    for path in EVIDENCE.rglob("*"):
        if path.is_file():
            hashes_to_paths.setdefault(digest(path), []).append(path)

    entries = 0
    portable_entries = 0
    hash_resolved_entries = 0
    for manifest in manifests:
        seen: set[str] = set()
        for line in manifest.read_text().splitlines():
            if not line.strip():
                continue
            parts = line.split(None, 1)
            if len(parts) != 2:
                fail(f"invalid checksum row in {manifest.relative_to(EVIDENCE)}")
            expected_hash, relative = parts
            relative = relative.strip().lstrip("*")
            if relative in seen:
                fail(f"duplicate checksum locator in {manifest.relative_to(EVIDENCE)}: {relative}")
            seen.add(relative)
            parsed = PurePosixPath(relative)
            local_path = manifest.parent / relative
            if (
                not parsed.is_absolute()
                and ".." not in parsed.parts
                and str(parsed) == relative
                and local_path.is_file()
                and digest(local_path) == expected_hash
            ):
                portable_entries += 1
            elif expected_hash in hashes_to_paths:
                # Four frozen review manifests retain generic /workspace/shared
                # source locators.  The public payload is resolved by its exact hash;
                # the frozen text is not rewritten.
                hash_resolved_entries += 1
            else:
                fail(
                    "unresolved V33 checksum dependency: "
                    f"{manifest.relative_to(EVIDENCE)} -> {relative}"
                )
            entries += 1
    if entries != 122 or portable_entries != 118 or hash_resolved_entries != 4:
        fail(
            "unexpected V33 checksum accounting: "
            f"entries={entries}, portable={portable_entries}, hash_resolved={hash_resolved_entries}"
        )
    return {
        "manifests": len(manifests),
        "entries": entries,
        "portable_entries": portable_entries,
        "frozen_locator_entries_resolved_by_hash": hash_resolved_entries,
    }


def verify_reviewed_scope_and_mirrors() -> dict[str, object]:
    frozen_hashes = {
        AUTHOR / "all_degree_sos_flux_check.txt": "801676ca651829e6d06268a3069b65abd929289ea2869e35cfbd12012c1c4300",
        AUTHOR / "nonlinear_theta_module_check.txt": "9b7a3f14ef0bd9bd3f0ae15bccfc53b29d9b90d29c7dba1e7620969ff02bc6b4",
        AUTHOR / "theta_sos_degree_selection_check.txt": "b618f7bcb71cd0184490c329a6daa1785cd4cf352d5b49e20d7d912ebb9500a6",
        AUTHOR / "theta_sos_localization_check.txt": "f94df5d8ec964c05dc35b3d0b6a6568c65a9c7a877cf09072e7ad07eaae8b4ac",
        AUTHOR / "corrected_N1.json": "dc31168bfc02428e1865168b5b4af82b6ffb96064ad7c49dea4163813ab9428f",
        AUTHOR / "selected20_canonical_obstruction.json": "ffadedee5855d90b15d622bb1d1ecfe81c72fbc9a9ba72c460da49798fd1773a",
        AUTHOR / "selected20_scalar_gauge_obstruction.json": "d575f4bf2d9002dabb27dd2318184115ea5112c5109aa076f1cd7e580435ad9e",
        AUTHOR / "selected20_two_point_gauge_obstruction.json": "3b1f0235237b5585ab18fd484b836bad010837593a1e7730129d23a2ae1d4f3a",
    }
    for path, expected_hash in frozen_hashes.items():
        if digest(path) != expected_hash:
            fail(f"unexpected frozen V33 output hash: {path.relative_to(EVIDENCE)}")

    scopes = (
        (
            AUTHOR / "FIXED_SHIFT_SIGNED_TAIL_OBSTRUCTION.md",
            "does NOT assert that actual theta has a negative interval",
        ),
        (
            AUTHOR / "ALL_DEGREE_SOS_FLUX.md",
            "neither proves RH or a negative actual theta pivot",
        ),
        (
            AUTHOR / "SELECTED20_CANONICAL_OBSTRUCTION.md",
            "does not establish a positive or negative integrated degree-20 target pivot",
        ),
        (
            AUTHOR / "SELECTED20_TWO_POINT_GAUGE_OBSTRUCTION.md",
            "the first component is NOT canceled",
        ),
        (
            AUTHOR / "THETA_SOS_DEGREE_SELECTION.md",
            "not a negative theta pivot",
        ),
    )
    for path, phrase in scopes:
        require_phrase(path.read_text(), phrase, path.name)

    publication = json.loads((EVIDENCE / "PUBLICATION_DELTA_V33.json").read_text())
    reviewed = publication["reviewed_owned_files"]
    diagnostic = publication["diagnostic_or_correction_history"]
    reviewed_counts = Counter(row["classification"] for row in reviewed)
    diagnostic_counts = Counter(row["classification"] for row in diagnostic)
    expected_reviewed = {
        "independent_audit_or_replay": 82,
        "reviewed_owned": 115,
        "reviewed_owned_external_theorem_dependency": 7,
        "reviewed_scope_index": 1,
    }
    if dict(reviewed_counts) != expected_reviewed:
        fail(f"unexpected V33 reviewed classification counts: {dict(reviewed_counts)}")
    if dict(diagnostic_counts) != {"owned_diagnostic_not_theorem": 29}:
        fail(f"unexpected V33 diagnostic classification counts: {dict(diagnostic_counts)}")
    return {
        "frozen_outputs_checked": len(frozen_hashes),
        "scope_notes_checked": len(scopes),
        "reviewed_files": len(reviewed),
        "diagnostic_files_not_executed": len(diagnostic),
    }


def main() -> int:
    result = {
        "status": "PASS",
        "verified_zero_exact_arithmetic": replay_verified_zero_constants(),
        "h10_frozen_summary": verify_h10_summary(),
        "internal_checksum_manifests": verify_internal_checksum_manifests(),
        "reviewed_scope_and_mirrors": verify_reviewed_scope_and_mirrors(),
        "not_rerun": [
            "published Platt--Trudgian zero verification through 3 trillion",
            "full 16 x 4000 x 4000 H10 interval integration",
            "SymPy, python-flint, mpmath, candidate-basis, floating, or diagnostic jobs",
            "private or acquired source programs",
        ],
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (AssertionError, OSError, ValueError, json.JSONDecodeError) as error:
        print(json.dumps({"status": "FAIL", "error": str(error)}), file=sys.stderr)
        sys.exit(1)
