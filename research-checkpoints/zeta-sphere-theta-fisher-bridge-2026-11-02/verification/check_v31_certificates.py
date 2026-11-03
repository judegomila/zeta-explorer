#!/usr/bin/env python3
"""Bounded V31 checks with invalid and private-dependent programs excluded."""

from __future__ import annotations

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
EVIDENCE = ROOT / "evidence" / "v31-continuation"
ARITHMETIC = EVIDENCE / "theta_correlated_local_v1"
AUDIT = EVIDENCE / "theta_correlated_local_audit"

PORTABLE_EXACT_CHECKS = (
    (
        "dyadic-identities",
        "check_dyadic_identities.py",
        "dyadic_identities_check.json",
    ),
)

AUDIT_MIRRORS = (
    (
        ARITHMETIC / "check_theta_curvature_square.py",
        AUDIT / "curvature_square_replay" / "check.py",
    ),
    (
        ARITHMETIC / "theta_curvature_square.json",
        AUDIT / "curvature_square_replay" / "certificate.json",
    ),
    (
        ARITHMETIC / "check_degree7_eighth_partition.py",
        AUDIT / "degree7_eighth_replay" / "check.py",
    ),
    (
        ARITHMETIC / "degree7_eighth_partition_4000.json",
        AUDIT / "degree7_eighth_replay" / "certificate.json",
    ),
    (
        ARITHMETIC / "check_degree7_regional_payment.py",
        AUDIT / "degree7_regional_replay" / "check.py",
    ),
    (
        ARITHMETIC / "degree7_regional_payment_4000.json",
        AUDIT / "degree7_regional_replay" / "certificate.json",
    ),
    (
        ARITHMETIC / "check_integrated_square_payment.py",
        AUDIT / "integrated_square_replay" / "check.py",
    ),
    (
        ARITHMETIC / "integrated_square_payment_64000.json",
        AUDIT / "integrated_square_replay" / "certificate.json",
    ),
    (
        ARITHMETIC / "check_regional_old_block.py",
        AUDIT / "regional_old_replay" / "check.py",
    ),
    (
        ARITHMETIC / "regional_old_block_64000.json",
        AUDIT / "regional_old_replay" / "certificate.json",
    ),
    (
        ARITHMETIC / "certify_midpoint_core.py",
        AUDIT / "even2_corrected_replay" / "check.py",
    ),
    (
        ARITHMETIC / "even2_midpoint_core_6000.json",
        AUDIT / "even2_corrected_replay" / "certificate.json",
    ),
)

CHECKSUM_MANIFESTS = (
    AUDIT / "curvature_square_replay" / "SHA256SUMS.txt",
    AUDIT / "degree7_eighth_replay" / "SHA256SUMS.txt",
    AUDIT / "degree7_regional_replay" / "SHA256SUMS.txt",
    AUDIT / "dyadic_correlations_replay" / "SHA256SUMS.txt",
    AUDIT / "initial_dyadic_replay" / "SHA256SUMS.txt",
    AUDIT / "integrated_square_replay" / "SHA256SUMS.txt",
    AUDIT / "regional_old_replay" / "SHA256SUMS.txt",
)

INVALID_EVEN2_PATHS = {
    "theta_correlated_local_v1/invalid_even2_swapped/INVALID_TARGET_SHA256.txt",
    "theta_correlated_local_v1/invalid_even2_swapped/STATUS.txt",
    "theta_correlated_local_v1/invalid_even2_swapped/certify_grouped_core.py",
    "theta_correlated_local_v1/invalid_even2_swapped/certify_midpoint_core.py",
    "theta_correlated_local_v1/invalid_even2_swapped/certify_next_arithmetic_core.py",
    "theta_correlated_local_v1/invalid_even2_swapped/even2_arithmetic_core_12000.json",
    "theta_correlated_local_v1/invalid_even2_swapped/even2_grouped_core_12000.json",
    "theta_correlated_local_v1/invalid_even2_swapped/even2_midpoint_core_6000.json",
}

MIXED_INVALID_PATHS = {
    "theta_correlated_local_audit/next_core_replay/STATUS.md",
    "theta_correlated_local_audit/next_core_replay/check.py",
    "theta_correlated_local_audit/next_core_replay/even2.json",
    "theta_correlated_local_audit/next_core_replay/odd1.json",
}

DEFAULT_EXCLUDED_EXECUTABLES = (
    "all invalid_even2_swapped programs",
    "mixed next_core_replay checker",
    "superseded initial_source.py",
    "failed/coarse diagnostic programs",
    "private-prefix-dependent arithmetic quadratures",
    "python-flint interval integrations",
)

INTERVAL_PREFIX = re.compile(
    r"^\[?([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)"
)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def fail(message: str) -> None:
    raise AssertionError(message)


def first_decimal(value: object) -> Decimal:
    if not isinstance(value, str):
        fail(f"expected interval string, got {value!r}")
    matched = INTERVAL_PREFIX.match(value)
    if matched is None:
        fail(f"unexpected interval format: {value!r}")
    return Decimal(matched.group(1))


def require_phrase(text: str, phrase: str, label: str) -> None:
    haystack = " ".join(text.lower().split())
    needle = " ".join(phrase.lower().split())
    if needle not in haystack:
        fail(f"missing scope phrase {phrase!r} in {label}")


def run_portable_exact_checks() -> list[dict[str, object]]:
    results: list[dict[str, object]] = []
    with tempfile.TemporaryDirectory(prefix="zsv-v31-portable-") as temporary:
        target = Path(temporary) / "portable"
        target.mkdir()
        for name, script_name, summary_name in PORTABLE_EXACT_CHECKS:
            shutil.copy2(ARITHMETIC / script_name, target / script_name)
            shutil.copy2(ARITHMETIC / summary_name, target / summary_name)
            completed = subprocess.run(
                [sys.executable, script_name],
                cwd=target,
                text=True,
                capture_output=True,
                check=False,
            )
            if completed.returncode != 0:
                fail(f"portable check {name} failed: {completed.stderr.strip()}")
            generated = json.loads(completed.stdout)
            frozen = json.loads((target / summary_name).read_text())
            if generated != frozen:
                fail(f"portable check {name} differs from frozen summary")
            results.append(
                {
                    "name": name,
                    "returncode": completed.returncode,
                    "temporary_copy": True,
                    "frozen_summary_match": True,
                }
            )
    return results


def check_audit_mirrors() -> list[dict[str, object]]:
    results: list[dict[str, object]] = []
    for source, audit in AUDIT_MIRRORS:
        source_hash = digest(source)
        if source_hash != digest(audit):
            fail(
                "source/audit mirror mismatch: "
                f"{source.relative_to(EVIDENCE)} vs {audit.relative_to(EVIDENCE)}"
            )
        results.append(
            {
                "name": f"mirror-{source.name}-{audit.parent.name}",
                "sha256": source_hash,
            }
        )
    return results


def check_checksum_manifests() -> dict[str, object]:
    entries = 0
    for manifest in CHECKSUM_MANIFESTS:
        if not manifest.is_file():
            fail(f"missing V31 checksum manifest: {manifest.relative_to(EVIDENCE)}")
        seen: set[str] = set()
        for line in manifest.read_text().splitlines():
            if not line.strip():
                continue
            parts = line.split(None, 1)
            if len(parts) != 2:
                fail(f"invalid checksum row in {manifest.relative_to(EVIDENCE)}")
            expected_hash, relative = parts
            relative = relative.strip().lstrip("*")
            parsed = PurePosixPath(relative)
            if parsed.is_absolute() or ".." in parsed.parts or str(parsed) != relative:
                fail(f"unsafe checksum path in {manifest.relative_to(EVIDENCE)}: {relative}")
            if relative in seen:
                fail(f"duplicate checksum path in {manifest.relative_to(EVIDENCE)}: {relative}")
            seen.add(relative)
            path = manifest.parent / relative
            if not path.is_file() or digest(path) != expected_hash:
                fail(f"checksum mismatch: {path.relative_to(EVIDENCE)}")
            entries += 1
    if len(CHECKSUM_MANIFESTS) != 7 or entries != 30:
        fail(
            f"unexpected V31 checksum accounting: manifests={len(CHECKSUM_MANIFESTS)}, "
            f"entries={entries}"
        )
    return {"name": "reviewed-checksum-manifests", "manifests": 7, "entries": 30}


def check_curvature_square() -> dict[str, object]:
    data = json.loads((ARITHMETIC / "theta_curvature_square.json").read_text())
    if data.get("N") != 4000 or data.get("bits") != 160:
        fail("unexpected curvature-square replay parameters")
    minimum = first_decimal(data.get("minimum_directed_lower"))
    if minimum <= Decimal("1254"):
        fail("curvature-square lower bound is not above 1254")
    if first_decimal(data.get("tail_log_derivative_error_upper")) >= Decimal("3e-13"):
        fail("curvature-square tail error is too large")
    require_phrase(str(data.get("claim", "")), "4*((log psi) second derivative)^2", "curvature certificate")
    note = (ARITHMETIC / "THETA_CURVATURE_PAYMENT.md").read_text()
    require_phrase(note, "not a new ladder extension or an all-degree argument", "theta curvature note")
    return {
        "name": "stored-theta-curvature-square",
        "minimum_directed_lower": str(minimum),
        "rerun": False,
    }


def check_degree7_payments() -> list[dict[str, object]]:
    eighth = json.loads((ARITHMETIC / "degree7_eighth_partition_4000.json").read_text())
    if eighth.get("N") != 4000 or eighth.get("bits") != 192:
        fail("unexpected degree-seven eighth-partition parameters")
    if eighth.get("split") != "|u|=1/8" or eighth.get("combined_positive") is not True:
        fail("unexpected degree-seven eighth-partition status")
    directed = eighth.get("directed", {})
    s_core_low = first_decimal(directed["s_core"]["lo"])
    s_core_high = first_decimal(directed["s_core"]["hi"])
    variation_low = first_decimal(directed["variation_core"]["lo"])
    tail_low = first_decimal(directed["s_tail"]["lo"])
    combined_low = first_decimal(directed["combined"]["lo"])
    if s_core_high >= 0 or s_core_low >= Decimal("-347755654"):
        fail("degree-seven central target is not rigorously negative")
    if variation_low <= Decimal("520963072"):
        fail("degree-seven central variation gain is too small")
    if s_core_low + variation_low <= Decimal("173207417"):
        fail("degree-seven central variation does not pay the signed core")
    if tail_low <= Decimal("5870098045") or combined_low <= Decimal("6047289376"):
        fail("degree-seven tail or combined reserve is too small")
    require_phrase(str(eighth.get("scope", "")), "No all-shift or all-degree conclusion", "degree-seven eighth certificate")

    regional = json.loads((ARITHMETIC / "degree7_regional_payment_4000.json").read_text())
    if regional.get("N") != 4000 or regional.get("bits") != 192:
        fail("unexpected degree-seven regional parameters")
    if regional.get("split") != "|u|=1/2" or regional.get("combined_positive") is not True:
        fail("unexpected degree-seven regional status")
    regional_directed = regional.get("directed", {})
    if first_decimal(regional_directed["s_core"]["lo"]) <= 0:
        fail("degree-seven half-split core remainder is not positive")
    if first_decimal(regional_directed["s_tail"]["lo"]) <= 0:
        fail("degree-seven half-split tail remainder is not positive")
    require_phrase(str(regional.get("scope", "")), "No all-shift or all-degree conclusion", "degree-seven regional certificate")

    index = (EVIDENCE / "V31_INDEX.md").read_text()
    require_phrase(index, "Degree7 is already contained", "V31 index")
    require_phrase(index, "not a new ladder degree", "V31 index")
    return [
        {
            "name": "stored-degree7-eighth-payment",
            "central_remainder_upper": str(s_core_high),
            "variation_core_lower": str(variation_low),
            "central_plus_variation_lower": str(s_core_low + variation_low),
            "combined_lower": str(combined_low),
            "rerun": False,
        },
        {
            "name": "stored-degree7-half-regional-payment",
            "combined_lower": str(first_decimal(regional_directed["combined"]["lo"])),
            "rerun": False,
        },
    ]


def check_integrated_square_and_old_metric() -> list[dict[str, object]]:
    integrated = json.loads((ARITHMETIC / "integrated_square_payment_64000.json").read_text())
    if integrated.get("N") != 64000 or integrated.get("bits") != 160:
        fail("unexpected integrated-square parameters")
    thresholds = {
        "R3": Decimal("275.31"),
        "R4": Decimal("11644.67"),
        "S3": Decimal("287.59"),
        "S4": Decimal("12983.08"),
        "V3": Decimal("10.54"),
        "V4": Decimal("1001.67"),
    }
    for key, threshold in thresholds.items():
        lower = first_decimal(integrated["directed"][key]["lo"])
        if lower <= threshold:
            fail(f"integrated-square {key} lower bound is too small")
    require_phrase(str(integrated.get("scope", "")), "no target pivot input", "integrated-square certificate")

    regional = json.loads((ARITHMETIC / "regional_old_block_64000.json").read_text())
    if regional.get("N") != 64000 or regional.get("bits") != 160:
        fail("unexpected regional-old parameters")
    local_pivots = regional.get("local_pivots", [])
    if len(local_pivots) != 3 or first_decimal(local_pivots[2]["hi"]) >= 0:
        fail("regional-old local block is not recorded as indefinite")
    for label, block in regional.get("regions", {}).items():
        if block.get("positive") is not True:
            fail(f"regional-old block is not positive: {label}")
        for pivot in block.get("pivots", []):
            if first_decimal(pivot["lo"]) <= 0:
                fail(f"regional-old pivot is not positive: {label}")
    require_phrase(str(regional.get("scope", "")), "No degree7 target moments", "regional-old certificate")
    return [
        {"name": "stored-integrated-square-payment", "cells": 64000, "rerun": False},
        {"name": "stored-regional-old-metric", "cells": 64000, "rerun": False},
    ]


def check_even2_correction_history() -> dict[str, object]:
    publication = json.loads((EVIDENCE / "PUBLICATION_DELTA_V31.json").read_text())
    reviewed = {row["path"]: row for row in publication["reviewed_owned_files"]}
    diagnostic = {
        row["path"]: row for row in publication["diagnostic_or_correction_history"]
    }
    if INVALID_EVEN2_PATHS & reviewed.keys():
        fail("invalid swapped-coordinate paths appear in the reviewed set")
    invalid_classified = {
        path
        for path, row in diagnostic.items()
        if row.get("classification") == "invalid_polynomial_correction_history"
    }
    if invalid_classified != INVALID_EVEN2_PATHS:
        fail("unexpected invalid even2 correction-history path set")
    mixed_classified = {
        path
        for path, row in diagnostic.items()
        if row.get("classification") == "mixed_valid_odd_invalid_even_diagnostic"
    }
    if mixed_classified != MIXED_INVALID_PATHS:
        fail("unexpected mixed odd/even correction-history path set")

    status = (ARITHMETIC / "invalid_even2_swapped" / "STATUS.txt").read_text()
    require_phrase(status, "INVALID TARGET POLYNOMIAL", "invalid even2 status")
    require_phrase(status, "not certificates", "invalid even2 status")
    require_phrase(status, "Do not reuse", "invalid even2 status")
    mixed_status = (AUDIT / "next_core_replay" / "STATUS.md").read_text()
    require_phrase(mixed_status, "INVALID", "mixed next-core status")
    require_phrase(mixed_status, "odd1", "mixed next-core status")

    corrected_source = (ARITHMETIC / "certify_midpoint_core.py").read_text()
    required_assignment = (
        "bb=-lead*(g11*g02-g01*g12)/det;"
        "aa=-lead*(g00*g12-g01*g02)/det"
    )
    required_conversion = (
        "c1=-arb(551)/8+2*aa/33;"
        "c0=arb(6419)/16-47*aa/66+bb"
    )
    require_phrase(corrected_source, required_assignment, "corrected even2 source")
    require_phrase(corrected_source, required_conversion, "corrected even2 source")

    corrected = json.loads((ARITHMETIC / "even2_midpoint_core_6000.json").read_text())
    if corrected.get("N") != 6000 or corrected.get("mode") != "even2":
        fail("unexpected corrected even2 parameters")
    if corrected.get("proved_positive") is not True:
        fail("corrected even2 replay is not positive")
    if first_decimal(corrected.get("paid_lower_endpoint")) <= Decimal("11757.119985"):
        fail("corrected even2 lower bound is too small")
    if first_decimal(corrected.get("arithmetic_tail_upper")) >= Decimal("2.445e-13"):
        fail("corrected even2 tail bound is too large")
    require_phrase(str(corrected.get("scope", "")), "already-known rung", "corrected even2 certificate")
    require_phrase(str(corrected.get("scope", "")), "not a ladder extension", "corrected even2 certificate")

    invalid_output = ARITHMETIC / "invalid_even2_swapped" / "even2_midpoint_core_6000.json"
    if digest(invalid_output) == digest(ARITHMETIC / "even2_midpoint_core_6000.json"):
        fail("invalid and corrected even2 outputs unexpectedly match")
    return {
        "name": "even2-coordinate-order-correction",
        "invalid_paths": len(INVALID_EVEN2_PATHS),
        "mixed_paths": len(MIXED_INVALID_PATHS),
        "corrected_lower": str(first_decimal(corrected["paid_lower_endpoint"])),
        "invalid_programs_executed": False,
    }


def check_scope_labels() -> dict[str, object]:
    index = (EVIDENCE / "V31_INDEX.md").read_text()
    readme = (EVIDENCE / "README.md").read_text()
    require_phrase(index, "not an all-degree theorem", "V31 index")
    require_phrase(
        index,
        "No all-shift or all-degree compensation, uniform partition, "
        "finite-core sign law, or RH proof is established",
        "V31 index",
    )
    require_phrase(readme, "not a new degree or hierarchy order", "V31 README")
    require_phrase(readme, "do not prove", "V31 README")
    require_phrase(readme, "Riemann hypothesis", "V31 README")
    return {
        "name": "v31-scope-labels",
        "known_rung_not_extension": True,
        "rh_unproved": True,
    }


def main() -> int:
    checks: list[dict[str, object]] = []
    checks.extend(run_portable_exact_checks())
    checks.extend(check_audit_mirrors())
    checks.append(check_checksum_manifests())
    checks.append(check_curvature_square())
    checks.extend(check_degree7_payments())
    checks.extend(check_integrated_square_and_old_metric())
    checks.append(check_even2_correction_history())
    checks.append(check_scope_labels())
    print(
        json.dumps(
            {
                "status": "PASS",
                "checks": checks,
                "default_excluded_executables": DEFAULT_EXCLUDED_EXECUTABLES,
                "scope": (
                    "Only the standard-library dyadic identity checker is executed, in a "
                    "temporary copy. Frozen interval summaries, mirrors, and checksum manifests "
                    "are validated without executing python-flint integrations, invalid or "
                    "superseded diagnostics, or private-prefix-dependent arithmetic programs."
                ),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (AssertionError, OSError, ValueError, KeyError, json.JSONDecodeError) as error:
        print(json.dumps({"status": "FAIL", "error": str(error)}), file=sys.stderr)
        sys.exit(1)
