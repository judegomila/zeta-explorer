#!/usr/bin/env python3
"""Dependency-free checks of stored V20--V26 certificate summaries.

This validates frozen outputs, conservative inequalities, source/audit agreement,
and diagnostic labels. It does not rerun the Arb, SymPy, or floating-point jobs
that produced those outputs.
"""

from __future__ import annotations

from decimal import Decimal, InvalidOperation, getcontext
import hashlib
import json
from pathlib import Path
import re
import sys


getcontext().prec = 100
ROOT = Path(__file__).resolve().parents[1]
CONTINUATION = ROOT / "evidence" / "v20-v26-continuation"

DIAGNOSTIC_JSON = (
    "paid_relaxation_v3/optimize_gauge.json",
    "paid_relaxation_v3/probe_blocks.json",
    "paid_relaxation_v3/probe_blocks_refined.json",
    "paid_relaxation_v3/test_universal_gauge.json",
    "paid_parent_conditioning_v1/check_rate.json",
    "paid_parent_conditioning_v1/probe_compensated.json",
    "paid_parent_conditioning_v1/probe_conditioning.json",
    "paid_parent_conditioning_v1/probe_conditioning_refined.json",
    "paid_parent_conditioning_v1/probe_terminal_zero.json",
    "modular_innovation_payment_v1/probe_normalized.json",
    "modular_innovation_payment_v1/probe_payment.json",
    "closed_dual_design_v1/probe_closed.json",
    "closed_design_feedback_v1/probe_canonical.json",
    "closed_design_feedback_v1/probe_common.json",
)

SYMBOLIC_OUTPUT_PAIRS = (
    (
        "signed_block_transport_v1/check_flux.out",
        "signed_block_transport_audit/check_flux.out",
    ),
    (
        "signed_block_transport_v1/check_generating.out",
        "signed_block_transport_audit/check_generating.out",
    ),
    (
        "signed_block_transport_v1/check_degree.out",
        "signed_block_transport_audit/check_degree.out",
    ),
    (
        "modular_cd_flux_v1/check_reflection.out",
        "modular_cd_flux_audit/check_reflection.out",
    ),
)


def fail(message: str) -> None:
    raise AssertionError(message)


def evidence_path(relative: str) -> Path:
    return CONTINUATION / relative


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_json(relative: str) -> object:
    return json.loads(evidence_path(relative).read_text())


def arb_bounds(value: str) -> tuple[Decimal, Decimal]:
    body = value.strip()
    if not (body.startswith("[") and body.endswith("]")):
        fail(f"unexpected Arb enclosure: {value!r}")
    body = body[1:-1]
    if body.startswith("+/- "):
        radius = Decimal(body[4:])
        return -radius, radius
    try:
        center_text, radius_text = body.split(" +/- ", 1)
    except ValueError as error:
        raise AssertionError(f"unexpected Arb enclosure: {value!r}") from error
    center = Decimal(center_text)
    radius = Decimal(radius_text)
    return center - radius, center + radius


def without_runtime(data: object) -> object:
    if not isinstance(data, dict):
        fail("expected certificate object")
    return {key: value for key, value in data.items() if key != "seconds"}


def verify_degree5_payment() -> dict[str, str | int]:
    source = load_json("paid_relaxation_v3/certificate_degree5.json")
    audit = load_json("paid_relaxation_v3_audit/certificate.json")
    if without_runtime(source) != without_runtime(audit):
        fail("degree-five source/audit certificates differ beyond runtime")
    if not isinstance(source, dict):
        fail("invalid degree-five source certificate")
    rows = source.get("rows")
    if (
        source.get("N") != 1024
        or source.get("L") != 1024
        or source.get("PASS") is not True
        or not isinstance(rows, list)
        or len(rows) != 1024
    ):
        fail("degree-five certificate does not cover the complete 1024 x 1024 job")
    if [row.get("k") for row in rows if isinstance(row, dict)] != list(range(1024)):
        fail("degree-five certificate rows are incomplete or out of order")

    directed_source_path = evidence_path("paid_relaxation_v3/certificate_directed.json")
    directed_audit_path = evidence_path("paid_relaxation_v3_audit/certificate_directed.json")
    if digest(directed_source_path) != digest(directed_audit_path):
        fail("degree-five directed source/audit summaries differ")
    directed = json.loads(directed_source_path.read_text())
    if (
        directed.get("PASS") is not True
        or directed.get("terminal_above_375000") is not True
        or directed.get("budget_below_330000") is not True
    ):
        fail("degree-five directed summary is not marked PASS")
    terminal_lower = arb_bounds(directed["terminal_lower"])[0]
    budget_upper = arb_bounds(directed["budget_upper"])[1]
    paid_lower = arb_bounds(directed["paid_lower"])[0]
    if terminal_lower <= Decimal("375000"):
        fail("degree-five terminal threshold failed")
    if budget_upper >= Decimal("330000"):
        fail("degree-five budget threshold failed")
    if paid_lower <= Decimal("45000"):
        fail("degree-five paid-residual threshold failed")
    return {
        "cells": len(rows),
        "terminal_lower": str(terminal_lower),
        "budget_upper": str(budget_upper),
        "paid_lower": str(paid_lower),
    }


def verify_h5_window() -> dict[str, str | int]:
    data = load_json("schur_window_audit/certificate.json")
    if not isinstance(data, dict) or data.get("PASS") is not True:
        fail("stored H5 window certificate is not marked PASS")
    regions = data.get("regions")
    expected = (
        (["0", "1/10"], -2_000_000_000),
        (["1/10", "1/8"], 0),
        (["3/20", "1/5"], 3_000_000_000),
    )
    if not isinstance(regions, list) or len(regions) != len(expected):
        fail("unexpected H5 window region count")
    for row, (interval, target) in zip(regions, expected):
        if not isinstance(row, dict):
            fail("invalid H5 window region")
        if row.get("region") != interval or row.get("target") != target:
            fail(f"unexpected H5 window specification: {row!r}")
        if not isinstance(row.get("accepted_cells"), int) or row["accepted_cells"] <= 0:
            fail(f"H5 window region has no accepted cells: {interval}")
        if Decimal(row["lower"]) <= Decimal(target):
            fail(f"H5 window lower bound failed on {interval}")
    profile_lower = arb_bounds(data["profile_ratio_squared"])[0]
    if profile_lower <= Decimal(1) / Decimal(4):
        fail("H5 profile-ratio threshold failed")
    dependency = data.get("tail_dependency")
    if not isinstance(dependency, str) or "h5_tail_v1" not in dependency:
        fail("H5 inherited tail dependency is not recorded")
    return {
        "regions": len(regions),
        "accepted_cells": sum(row["accepted_cells"] for row in regions),
        "profile_ratio_squared_lower": str(profile_lower),
    }


def verify_parent_constants() -> dict[str, str | int]:
    source_path = evidence_path("theta_parent_growth_v1/constants.json")
    audit_path = evidence_path("theta_parent_growth_audit/constants.json")
    if digest(source_path) != digest(audit_path):
        fail("positive-parent source/audit constants differ")
    data = json.loads(source_path.read_text())
    if data.get("PASS") is not True or data.get("N") != 6000:
        fail("positive-parent constants are not the complete 6000-cell output")
    a_lower = arb_bounds(data["A_lower"])[0]
    b_upper = arb_bounds(data["B_upper"])[1]
    if a_lower <= Decimal(1) / Decimal(3):
        fail("positive-parent A threshold failed")
    if b_upper >= Decimal(1) / Decimal(6):
        fail("positive-parent B threshold failed")
    return {"cells": data["N"], "A_lower": str(a_lower), "B_upper": str(b_upper)}


def verify_degree9_endpoint() -> dict[str, str | int]:
    source = load_json("signed_block_transport_certificate_v1/certificate_n9.json")
    audit = load_json("signed_block_transport_certificate_audit/certificate.json")
    if without_runtime(source) != without_runtime(audit):
        fail("degree-nine source/audit certificates differ beyond runtime")
    if not isinstance(source, dict):
        fail("invalid degree-nine source certificate")
    rows = source.get("rows")
    if (
        source.get("n") != 9
        or source.get("N") != 3072
        or source.get("PASS") is not True
        or not isinstance(rows, list)
        or [row.get("lam") for row in rows if isinstance(row, dict)] != [0, 1]
    ):
        fail("degree-nine certificate does not cover both 3072-cell endpoints")
    source_script = evidence_path(
        "signed_block_transport_certificate_v1/certify_endpoint.py"
    )
    audit_script = evidence_path("signed_block_transport_certificate_audit/replay.py")
    if digest(source_script) != digest(audit_script):
        fail("degree-nine source/audit replay programs differ")
    reserve_lower = arb_bounds(source["reserve_lower"])[0]
    terminal_lower = arb_bounds(source["terminal1_lower"])[0]
    budget_upper = arb_bounds(source["budget_upper"])[1]
    if reserve_lower <= Decimal("0.003"):
        fail("degree-nine direct regional reserve threshold failed")
    if terminal_lower <= Decimal("0.0043399130896862"):
        fail("degree-nine terminal threshold failed")
    if budget_upper >= Decimal("0.0012102719741945"):
        fail("degree-nine budget threshold failed")
    return {
        "cells": source["N"],
        "reserve_lower": str(reserve_lower),
        "terminal_lower": str(terminal_lower),
        "budget_upper": str(budget_upper),
    }


def verify_exact_outputs() -> dict[str, int]:
    fisher_source = evidence_path("fisher_bridge_v5/identity_checks.json")
    fisher_audit = evidence_path("fisher_bridge_v5_audit/identity_checks.json")
    if digest(fisher_source) != digest(fisher_audit):
        fail("Fisher identity source/audit outputs differ")
    fisher = json.loads(fisher_source.read_text())
    if not isinstance(fisher, list) or [row.get("N") for row in fisher] != list(range(1, 31)):
        fail("Fisher identity output does not cover N=1 through 30")
    for row in fisher:
        if Decimal(row["relative_identity_error"]) >= Decimal("1e-75"):
            fail(f"Fisher identity error threshold failed at N={row['N']}")
        norm_ratio = Decimal(row["sigma_norm_over_bound"])
        if not (Decimal(0) < norm_ratio < Decimal(1)):
            fail(f"Fisher norm bound failed at N={row['N']}")
        if row["N"] >= 4 and Decimal(row["residue_over_lower_bound"]) < Decimal(1):
            fail(f"Fisher residue lower bound failed at N={row['N']}")

    for source_relative, audit_relative in SYMBOLIC_OUTPUT_PAIRS:
        source = evidence_path(source_relative)
        audit = evidence_path(audit_relative)
        if digest(source) != digest(audit):
            fail(f"symbolic source/audit output mismatch: {source_relative}")
        if not source.read_text().strip().startswith("PASS:"):
            fail(f"symbolic output is not marked PASS: {source_relative}")
    return {"fisher_degrees": len(fisher), "source_audit_output_pairs": 5}


def verify_frozen_manifests() -> dict[str, int]:
    manifests = sorted(CONTINUATION.rglob("*SHA256.txt"))
    if len(manifests) != 25:
        fail(f"expected 25 internal checksum manifests, got {len(manifests)}")
    entries = 0
    for manifest in manifests:
        for line_number, line in enumerate(manifest.read_text().splitlines(), 1):
            if not line.strip():
                continue
            try:
                expected_hash, relative = line.split(None, 1)
            except ValueError as error:
                raise AssertionError(
                    f"malformed checksum line {manifest}:{line_number}"
                ) from error
            relative = relative.strip()
            if not re.fullmatch(r"[0-9a-f]{64}", expected_hash):
                fail(f"invalid checksum at {manifest}:{line_number}")
            relative_path = Path(relative)
            if relative_path.is_absolute() or ".." in relative_path.parts:
                fail(f"unsafe checksum target at {manifest}:{line_number}")
            target = manifest.parent / relative_path
            if not target.is_file():
                fail(f"missing checksum target: {target}")
            if digest(target) != expected_hash:
                fail(f"internal checksum mismatch: {target}")
            entries += 1
    if entries != 71:
        fail(f"expected 71 internal checksum entries, got {entries}")
    return {"manifests": len(manifests), "entries": entries}


def verify_diagnostic_labels() -> dict[str, int]:
    expected = set(DIAGNOSTIC_JSON)
    discovered: set[str] = set()
    for path in CONTINUATION.rglob("*.json"):
        data = json.loads(path.read_text())
        if isinstance(data, dict) and "scope" in data:
            discovered.add(str(path.relative_to(CONTINUATION)))
    if discovered != expected:
        fail(
            "unexpected floating-diagnostic JSON set: "
            f"extra={sorted(discovered - expected)}, missing={sorted(expected - discovered)}"
        )
    for relative in sorted(expected):
        data = load_json(relative)
        if not isinstance(data, dict):
            fail(f"invalid floating diagnostic: {relative}")
        scope = data.get("scope")
        if not isinstance(scope, str) or not scope.lower().startswith("floating"):
            fail(f"diagnostic is not explicitly labelled floating: {relative}")
    return {"floating_diagnostics": len(expected)}


def main() -> int:
    result = {
        "status": "PASS",
        "scope": "stored summaries and frozen-output integrity; no Arb/SymPy/floating reruns",
        "degree5_payment": verify_degree5_payment(),
        "h5_window": verify_h5_window(),
        "positive_parent_constants": verify_parent_constants(),
        "degree9_endpoint": verify_degree9_endpoint(),
        "exact_outputs": verify_exact_outputs(),
        "internal_checksums": verify_frozen_manifests(),
        "diagnostic_labels": verify_diagnostic_labels(),
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (
        AssertionError,
        InvalidOperation,
        OSError,
        ValueError,
        KeyError,
        TypeError,
        json.JSONDecodeError,
    ) as error:
        print(json.dumps({"status": "FAIL", "error": str(error)}), file=sys.stderr)
        sys.exit(1)
