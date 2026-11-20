#!/usr/bin/env python3
"""Replay the certified finite paid-twin endpoint border with explicit LDL data.

This worker reconstructs the already certified odd endpoint rungs 3 through 19
from SHA-256-bound archived inputs.  It adds the target-metric forcing
coordinates ``eta = L^{-1} w`` and checks their inverse-energy decomposition.

The archived gain/cost/surplus intervals remain the certificate.  The midpoint
reconstruction and the newly emitted eta coordinates are finite diagnostics;
they are not interval certificates, all-degree inequalities, or an RH proof.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import platform
import sys
import tempfile
import time
from typing import Any, Sequence

import mpmath as mp


SCHEMA_VERSION = "zsv.paid_twin_border_falsifier.v1"
STATUS = "finite_endpoint_border_diagnostic"
MODE = "sha_bound_endpoint_midpoint_diagnostic"
SOURCE_PATH = Path(__file__).resolve()
WORKSTREAM_ROOT = SOURCE_PATH.parents[1]
CHECKPOINT_ROOT = SOURCE_PATH.parents[3]

DEFAULT_EGF_MANIFEST = WORKSTREAM_ROOT / "results" / "egf_identity_j128.json"
DEFAULT_PARENT_INTERVAL = (
    CHECKPOINT_ROOT
    / "evidence"
    / "v19-delta"
    / "fisher_bridge_v3"
    / "parent_interval_1000.json"
)
DEFAULT_TARGET_MOMENTS = (
    CHECKPOINT_ROOT
    / "evidence"
    / "v18-curated"
    / "full_split_audit"
    / "actual_total_certificate.json"
)
DEFAULT_ENDPOINT_CERTIFICATE = (
    CHECKPOINT_ROOT
    / "evidence"
    / "v19-delta"
    / "fisher_bridge_v3"
    / "endpoint_certificate_1000.json"
)

EXPECTED_SHA256 = {
    "egf_manifest": "354703546a02d24f41699a47739686057a94270103589a62601181043ad9c83c",
    "parent_interval": "7e62d06a0ba7eec5fd7a80e4e5f63a35cf87875d92d73b04314259ae596ef928",
    "target_moments": "06b56542d907b50d397263a88da4a39da75ac94463cd48d54da8a5e43198b536",
    "endpoint_certificate": "6042e7989864e2e64f89989bb82329d2bf3af91fe848bed722496ae364335509",
}
EXPECTED_EGF_SCHEMA_VERSION = "zsv.egf_identity.v1"
EXPECTED_EGF_FORMULA_SHA256 = (
    "7cd5aa8898b39cfc1eed9417bd6bb7d9b8f52dfd33ca25665e4f2c7765cf8843"
)
EXPECTED_TARGET_SCOPE = "Full theta normalized a=0 full moments via reflected identity"
EXPECTED_ENDPOINT_SCOPE = (
    "Original theta existing odd rungs3..19 normalized a0; positive parent G0 "
    "intervalTaylor20; reused target moment intervals; no nonzero-shift interval "
    "certificate"
)
EXPECTED_ENDPOINT_LOAD_PADDING = "1e-54*(1+abs(interval))"
ODD_DEGREES = tuple(range(1, 20, 2))
CERTIFIED_ENDPOINT_DEGREES = tuple(range(3, 20, 2))
MIN_DPS = 80
MAX_DPS = 512
HARD_MAX_SECONDS = 600
HARD_MAX_OUTPUT_BYTES = 4 * 1024 * 1024


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def relative_label(path: Path) -> str:
    """Represent provenance relative to this workstream, never a live root."""

    return os.path.relpath(path.resolve(), WORKSTREAM_ROOT.resolve())


def read_bound_json(path: Path, name: str) -> tuple[dict[str, Any], str]:
    resolved = path.resolve()
    raw = resolved.read_bytes()
    actual = hashlib.sha256(raw).hexdigest()
    expected = EXPECTED_SHA256[name]
    if actual != expected:
        raise ValueError(
            f"SHA-256 mismatch for {name}: expected {expected}, observed {actual}"
        )
    payload = json.loads(raw)
    if not isinstance(payload, dict):
        raise ValueError(f"{name} must contain a JSON object")
    return payload, actual


def parse_interval(value: object, label: str) -> tuple[mp.mpf, mp.mpf]:
    if not isinstance(value, list) or len(value) != 2:
        raise ValueError(f"{label} must be a two-endpoint interval")
    lower = mp.mpf(value[0])
    upper = mp.mpf(value[1])
    if not (mp.isfinite(lower) and mp.isfinite(upper) and lower <= upper):
        raise ValueError(f"{label} is not a finite ordered interval")
    return lower, upper


def interval_midpoint(value: object, label: str) -> mp.mpf:
    lower, upper = parse_interval(value, label)
    return (lower + upper) / 2


def point_overlaps_interval(value: mp.mpf, interval: object, label: str) -> bool:
    lower, upper = parse_interval(interval, label)
    return lower <= value <= upper


def dot(left: Sequence[mp.mpf], right: Sequence[mp.mpf]) -> mp.mpf:
    if len(left) != len(right):
        raise ValueError("dot-product dimensions differ")
    return mp.fsum(x * y for x, y in zip(left, right))


def matvec(matrix: Sequence[Sequence[mp.mpf]], vector: Sequence[mp.mpf]) -> list[mp.mpf]:
    if any(len(row) != len(vector) for row in matrix):
        raise ValueError("matrix/vector dimensions differ")
    return [dot(row, vector) for row in matrix]


def lu_solve(matrix: Sequence[Sequence[mp.mpf]], vector: Sequence[mp.mpf]) -> list[mp.mpf]:
    if len(matrix) != len(vector) or any(len(row) != len(vector) for row in matrix):
        raise ValueError("linear-system dimensions differ")
    solution = mp.lu_solve(mp.matrix(matrix), mp.matrix(vector))
    return [mp.mpf(solution[index]) for index in range(len(vector))]


def ldlt_factor(
    matrix: Sequence[Sequence[mp.mpf]],
) -> tuple[list[list[mp.mpf]], list[mp.mpf]]:
    """Return the unpivoted factorization ``A = L diag(pivots) L^T``."""

    size = len(matrix)
    if size == 0 or any(len(row) != size for row in matrix):
        raise ValueError("LDL input must be a nonempty square matrix")
    lower = [[mp.mpf("0") for _ in range(size)] for _ in range(size)]
    pivots: list[mp.mpf] = []
    for row in range(size):
        lower[row][row] = mp.mpf("1")
        for column in range(row):
            numerator = matrix[row][column] - mp.fsum(
                lower[row][index]
                * pivots[index]
                * lower[column][index]
                for index in range(column)
            )
            lower[row][column] = numerator / pivots[column]
        pivot = matrix[row][row] - mp.fsum(
            lower[row][index] ** 2 * pivots[index] for index in range(row)
        )
        if not mp.isfinite(pivot) or pivot <= 0:
            raise ArithmeticError(f"nonpositive target LDL pivot {row}: {pivot}")
        pivots.append(pivot)
    return lower, pivots


def forward_substitute_unit_lower(
    lower: Sequence[Sequence[mp.mpf]], vector: Sequence[mp.mpf]
) -> list[mp.mpf]:
    size = len(vector)
    if len(lower) != size or any(len(row) != size for row in lower):
        raise ValueError("forward-substitution dimensions differ")
    result: list[mp.mpf] = []
    for row in range(size):
        result.append(
            vector[row]
            - mp.fsum(lower[row][column] * result[column] for column in range(row))
        )
    return result


def inverse_energy_from_ldlt(
    matrix: Sequence[Sequence[mp.mpf]], vector: Sequence[mp.mpf]
) -> tuple[mp.mpf, list[list[mp.mpf]], list[mp.mpf], list[mp.mpf], list[mp.mpf]]:
    """Return ``sum eta_k^2/s_k`` and the explicit LDL forcing data."""

    lower, pivots = ldlt_factor(matrix)
    eta = forward_substitute_unit_lower(lower, vector)
    terms = [coordinate**2 / pivot for coordinate, pivot in zip(eta, pivots)]
    return mp.fsum(terms), lower, pivots, eta, terms


def ldl_reconstruction_relative_error(
    matrix: Sequence[Sequence[mp.mpf]],
    lower: Sequence[Sequence[mp.mpf]],
    pivots: Sequence[mp.mpf],
) -> mp.mpf:
    size = len(matrix)
    residual = mp.mpf("0")
    scale = mp.mpf("1")
    for row in range(size):
        for column in range(size):
            reconstructed = mp.fsum(
                lower[row][index] * pivots[index] * lower[column][index]
                for index in range(min(row, column) + 1)
            )
            residual = max(residual, abs(matrix[row][column] - reconstructed))
            scale = max(scale, abs(matrix[row][column]))
    return residual / scale


def relative_error(left: mp.mpf, right: mp.mpf) -> mp.mpf:
    return abs(left - right) / max(mp.mpf("1"), abs(left), abs(right))


def mp_text(value: mp.mpf, dps: int) -> str:
    return mp.nstr(value, n=max(25, dps - 15), strip_zeros=False)


def matrix_text(matrix: Sequence[Sequence[mp.mpf]], dps: int) -> list[list[str]]:
    return [[mp_text(value, dps) for value in row] for row in matrix]


def vector_text(vector: Sequence[mp.mpf], dps: int) -> list[str]:
    return [mp_text(value, dps) for value in vector]


def validate_egf_manifest(payload: dict[str, Any]) -> None:
    if payload.get("schema_version") != EXPECTED_EGF_SCHEMA_VERSION:
        raise ValueError("EGF manifest schema version mismatch")
    if payload.get("status") != "exact_egf_identity":
        raise ValueError("EGF manifest status is not exact_egf_identity")
    checks = payload.get("checks")
    if not isinstance(checks, dict) or checks.get("all_exact_checks_passed") is not True:
        raise ValueError("EGF manifest exact-pass gate failed")
    if any(value is not True for value in checks.values()):
        raise ValueError("EGF manifest contains a failed exact check")
    parameters = payload.get("parameters")
    if not isinstance(parameters, dict):
        raise ValueError("EGF manifest parameters are missing")
    if parameters.get("full_polynomial_degree", -1) < 19:
        raise ValueError("EGF manifest polynomial degree is below the endpoint ladder")
    if parameters.get("scalar_degree", -1) < 19:
        raise ValueError("EGF manifest scalar degree is below the endpoint ladder")
    hashes = payload.get("hashes")
    if (
        not isinstance(hashes, dict)
        or hashes.get("formula_sha256") != EXPECTED_EGF_FORMULA_SHA256
    ):
        raise ValueError("EGF manifest formula binding mismatch")


def load_numeric_inputs(
    parent: dict[str, Any], target: dict[str, Any], archived: dict[str, Any]
) -> tuple[list[list[mp.mpf]], list[list[mp.mpf]], dict[int, dict[str, Any]], list[mp.mpf]]:
    if parent.get("cells") != 1000:
        raise ValueError("parent interval is not the certified 1000-cell input")
    scales_raw = parent.get("scales")
    gram_raw = parent.get("G0")
    if not isinstance(scales_raw, list) or len(scales_raw) != len(ODD_DEGREES):
        raise ValueError("parent interval has the wrong scale vector")
    if (
        not isinstance(gram_raw, list)
        or len(gram_raw) != len(ODD_DEGREES)
        or any(not isinstance(row, list) or len(row) != len(ODD_DEGREES) for row in gram_raw)
    ):
        raise ValueError("parent interval has the wrong G0 shape")
    scales = [mp.mpf(value) for value in scales_raw]
    if any(not mp.isfinite(value) or value <= 0 for value in scales):
        raise ValueError("parent scales must be positive and finite")
    parent_midpoint = [
        [
            interval_midpoint(value, f"parent.G0[{row}][{column}]")
            for column, value in enumerate(raw_row)
        ]
        for row, raw_row in enumerate(gram_raw)
    ]
    if any(
        parent_midpoint[row][column] != parent_midpoint[column][row]
        for row in range(len(ODD_DEGREES))
        for column in range(len(ODD_DEGREES))
    ):
        raise ValueError("parent midpoint Gram is not symmetric")

    if target.get("scope") != EXPECTED_TARGET_SCOPE:
        raise ValueError("actual target certificate scope mismatch")
    moments_raw = target.get("moments")
    if not isinstance(moments_raw, list) or len(moments_raw) != 20:
        raise ValueError("actual target certificate must contain exactly 20 moments")
    moments = [
        interval_midpoint(value, f"target.moments[{index}]")
        for index, value in enumerate(moments_raw)
    ]
    target_midpoint: list[list[mp.mpf]] = []
    for row, left_degree in enumerate(ODD_DEGREES):
        target_row: list[mp.mpf] = []
        for column, right_degree in enumerate(ODD_DEGREES):
            moment_index = (left_degree + right_degree) // 2
            sign = -1 if (1 + moment_index) % 2 else 1
            target_row.append(
                sign
                * moments[moment_index]
                * scales[row]
                * scales[column]
                / mp.mpf(4) ** moment_index
            )
        target_midpoint.append(target_row)

    if archived.get("scope") != EXPECTED_ENDPOINT_SCOPE:
        raise ValueError("endpoint certificate scope mismatch")
    if archived.get("source_decimal_load_padding") != EXPECTED_ENDPOINT_LOAD_PADDING:
        raise ValueError("endpoint certificate decimal-load padding mismatch")
    if archived.get("source_cells") != 1000:
        raise ValueError("endpoint certificate is not bound to 1000 parent cells")
    results = archived.get("results")
    if not isinstance(results, list):
        raise ValueError("endpoint certificate results are missing")
    archived_by_degree: dict[int, dict[str, Any]] = {}
    for record in results:
        if not isinstance(record, dict) or not isinstance(record.get("degree"), int):
            raise ValueError("endpoint certificate contains an invalid record")
        degree = record["degree"]
        if degree in archived_by_degree:
            raise ValueError(f"duplicate archived endpoint degree {degree}")
        archived_by_degree[degree] = record
    if tuple(sorted(archived_by_degree)) != CERTIFIED_ENDPOINT_DEGREES:
        raise ValueError("endpoint certificate does not contain exactly degrees 3..19 odd")
    return parent_midpoint, target_midpoint, archived_by_degree, scales


def progress(enabled: bool, event: str, **fields: object) -> None:
    if enabled:
        print(json.dumps({"event": event, **fields}, sort_keys=True), file=sys.stderr, flush=True)


def reconstruct_endpoint_rung(
    *,
    rung_index: int,
    parent_gram: Sequence[Sequence[mp.mpf]],
    target_gram: Sequence[Sequence[mp.mpf]],
    archived: dict[str, Any],
    dps: int,
    numeric_tolerance: mp.mpf,
) -> tuple[dict[str, Any], dict[str, bool]]:
    degree = ODD_DEGREES[rung_index]
    size = rung_index
    parent_old = [list(row[:size]) for row in parent_gram[:size]]
    parent_border = [parent_gram[row][rung_index] for row in range(size)]
    alpha = lu_solve(parent_old, parent_border)

    target_old = [list(row[:size]) for row in target_gram[:size]]
    target_border = [target_gram[row][rung_index] for row in range(size)]
    target_diagonal = target_gram[rung_index][rung_index]
    target_alpha = matvec(target_old, alpha)
    forcing = [value - predicted for value, predicted in zip(target_border, target_alpha)]
    gain = (
        target_diagonal
        - 2 * dot(alpha, target_border)
        + dot(alpha, target_alpha)
    )

    direct_solution = lu_solve(target_old, forcing)
    direct_cost = dot(forcing, direct_solution)
    ldl_cost, lower, pivots, eta, cost_terms = inverse_energy_from_ldlt(
        target_old, forcing
    )
    surplus_direct = gain - direct_cost
    surplus_ldl = gain - ldl_cost
    factorization_error = ldl_reconstruction_relative_error(target_old, lower, pivots)
    cost_error = relative_error(direct_cost, ldl_cost)
    surplus_error = relative_error(surplus_direct, surplus_ldl)

    overlap = {
        field: point_overlaps_interval(
            value,
            archived.get(field),
            f"endpoint[{degree}].{field}",
        )
        for field, value in (
            ("gain", gain),
            ("cost", direct_cost),
            ("surplus", surplus_direct),
        )
    }
    raw_two_d_overlap = {
        "gain": point_overlaps_interval(
            2 * gain, archived.get("gain"), f"endpoint[{degree}].gain"
        ),
        "cost": point_overlaps_interval(
            2 * direct_cost, archived.get("cost"), f"endpoint[{degree}].cost"
        ),
    }
    alpha_archive = archived.get("alpha")
    if not isinstance(alpha_archive, list) or len(alpha_archive) != size:
        raise ValueError(f"archived alpha has wrong size at degree {degree}")
    alpha_overlap = [
        point_overlaps_interval(
            value, interval, f"endpoint[{degree}].alpha[{index}]"
        )
        for index, (value, interval) in enumerate(zip(alpha, alpha_archive))
    ]

    checks = {
        "target_ldl_pivots_positive": all(pivot > 0 for pivot in pivots),
        "target_ldl_reconstructs_old_block": factorization_error <= numeric_tolerance,
        "inverse_cost_equals_eta_sum": cost_error <= numeric_tolerance,
        "surplus_equals_gain_minus_eta_sum": surplus_error <= numeric_tolerance,
        "archived_gain_cost_surplus_overlap": all(overlap.values()),
        "v20_raw_two_D_is_not_used_for_v19_gain": not raw_two_d_overlap["gain"],
        "v20_raw_two_D_is_not_used_for_v19_cost": not raw_two_d_overlap["cost"],
        "archived_alpha_overlap": all(alpha_overlap),
        "reconstructed_gain_positive": gain > 0,
        "reconstructed_cost_positive": direct_cost > 0,
        "reconstructed_surplus_positive": surplus_direct > 0,
    }
    row = {
        "degree": degree,
        "old_block_size": size,
        "parent_regression_alpha": vector_text(alpha, dps),
        "forcing_w_equals_bdot_minus_h_alpha": vector_text(forcing, dps),
        "target_ldl": {
            "unit_lower": matrix_text(lower, dps),
            "pivots_s": vector_text(pivots, dps),
            "forcing_innovations_eta": vector_text(eta, dps),
            "eta_squared_over_pivot_terms": vector_text(cost_terms, dps),
            "sum_eta_squared_over_pivot": mp_text(ldl_cost, dps),
            "factorization_relative_error": mp_text(factorization_error, dps),
        },
        "reconstruction": {
            "innovation_derivative_gain": mp_text(gain, dps),
            "target_inverse_cost_direct": mp_text(direct_cost, dps),
            "target_inverse_cost_ldl": mp_text(ldl_cost, dps),
            "surplus_sigma_direct": mp_text(surplus_direct, dps),
            "surplus_sigma_ldl": mp_text(surplus_ldl, dps),
            "inverse_cost_relative_error": mp_text(cost_error, dps),
            "surplus_relative_error": mp_text(surplus_error, dps),
        },
        "archived_intervals": {
            field: archived[field] for field in ("gain", "cost", "surplus")
        },
        "archive_overlap": overlap,
        "v20_raw_two_D_archive_overlap_expected_false": raw_two_d_overlap,
        "alpha_archive_overlap": alpha_overlap,
        "checks": checks,
    }
    return row, checks


def run_endpoint_reconstruction(
    *,
    egf_manifest: Path = DEFAULT_EGF_MANIFEST,
    parent_interval: Path = DEFAULT_PARENT_INTERVAL,
    target_moments: Path = DEFAULT_TARGET_MOMENTS,
    endpoint_certificate: Path = DEFAULT_ENDPOINT_CERTIFICATE,
    dps: int = 120,
    max_seconds: int = 60,
    progress_enabled: bool = False,
) -> dict[str, Any]:
    """Run the SHA-bound finite endpoint midpoint replay."""

    if not MIN_DPS <= dps <= MAX_DPS:
        raise ValueError(f"dps must lie in [{MIN_DPS}, {MAX_DPS}]")
    if not 1 <= max_seconds <= HARD_MAX_SECONDS:
        raise ValueError(f"max_seconds must lie in [1, {HARD_MAX_SECONDS}]")
    started = time.monotonic()
    deadline = started + max_seconds
    mp.mp.dps = dps

    paths = {
        "egf_manifest": Path(egf_manifest),
        "parent_interval": Path(parent_interval),
        "target_moments": Path(target_moments),
        "endpoint_certificate": Path(endpoint_certificate),
    }
    documents: dict[str, dict[str, Any]] = {}
    observed_hashes: dict[str, str] = {}
    for name, path in paths.items():
        documents[name], observed_hashes[name] = read_bound_json(path, name)
    validate_egf_manifest(documents["egf_manifest"])
    parent_gram, target_gram, archive, scales = load_numeric_inputs(
        documents["parent_interval"],
        documents["target_moments"],
        documents["endpoint_certificate"],
    )
    progress(progress_enabled, "inputs_validated")

    tolerance = mp.power(10, -(dps - 30))
    rows: list[dict[str, Any]] = []
    rung_checks: list[dict[str, bool]] = []
    for rung_index in range(1, len(ODD_DEGREES)):
        if time.monotonic() > deadline:
            raise TimeoutError("cooperative endpoint phase guard expired")
        row, checks = reconstruct_endpoint_rung(
            rung_index=rung_index,
            parent_gram=parent_gram,
            target_gram=target_gram,
            archived=archive[ODD_DEGREES[rung_index]],
            dps=dps,
            numeric_tolerance=tolerance,
        )
        rows.append(row)
        rung_checks.append(checks)
        progress(progress_enabled, "rung_complete", degree=ODD_DEGREES[rung_index])

    diagonal_error = max(
        abs(target_gram[index][index] - 1) for index in range(len(ODD_DEGREES))
    )
    aggregate_checks = {
        "input_hashes_match_expected": observed_hashes == EXPECTED_SHA256,
        "egf_exact_pass": True,
        "all_target_ldl_pivots_positive": all(
            checks["target_ldl_pivots_positive"] for checks in rung_checks
        ),
        "all_ldl_factorizations_reconstruct": all(
            checks["target_ldl_reconstructs_old_block"] for checks in rung_checks
        ),
        "all_inverse_cost_decompositions_pass": all(
            checks["inverse_cost_equals_eta_sum"] for checks in rung_checks
        ),
        "all_surplus_decompositions_pass": all(
            checks["surplus_equals_gain_minus_eta_sum"] for checks in rung_checks
        ),
        # Keep these as three independent gates.  A surplus-only comparison can
        # hide a shared gain/cost normalization error through cancellation.
        "all_archived_gain_overlap": all(
            row["archive_overlap"]["gain"] for row in rows
        ),
        "all_archived_cost_overlap": all(
            row["archive_overlap"]["cost"] for row in rows
        ),
        "all_archived_surplus_overlap": all(
            row["archive_overlap"]["surplus"] for row in rows
        ),
        "all_archived_gain_cost_surplus_overlap": all(
            checks["archived_gain_cost_surplus_overlap"] for checks in rung_checks
        ),
        "all_v20_raw_two_D_gain_values_rejected_by_v19_archive": all(
            checks["v20_raw_two_D_is_not_used_for_v19_gain"]
            for checks in rung_checks
        ),
        "all_v20_raw_two_D_cost_values_rejected_by_v19_archive": all(
            checks["v20_raw_two_D_is_not_used_for_v19_cost"]
            for checks in rung_checks
        ),
        "all_archived_alpha_overlap": all(
            checks["archived_alpha_overlap"] for checks in rung_checks
        ),
        "all_reconstructed_quantities_positive": all(
            checks["reconstructed_gain_positive"]
            and checks["reconstructed_cost_positive"]
            and checks["reconstructed_surplus_positive"]
            for checks in rung_checks
        ),
        # v19's D is the half-difference endpoint G_+'(0).  The v20 raw
        # plus-minus-over-a convention is 2D.  This replay intentionally uses D
        # directly, so neither w nor its LDL energy receives an extra factor 2.
        "v19_half_difference_convention_used_without_extra_two": True,
        "v20_raw_plus_minus_over_a_is_recorded_as_two_D": True,
    }
    aggregate_checks["all_checks_passed"] = all(aggregate_checks.values())
    if not aggregate_checks["all_checks_passed"]:
        failed = [name for name, passed in aggregate_checks.items() if not passed]
        raise ArithmeticError(f"finite endpoint hard gate failed: {failed}")

    elapsed = time.monotonic() - started
    return {
        "schema_version": SCHEMA_VERSION,
        "status": STATUS,
        "mode": MODE,
        "scope": (
            "SHA-bound midpoint replay of the already certified original-theta "
            "odd endpoint rungs 3..19 at a=0. Archived intervals certify only "
            "the finite gain/cost/surplus claims. The emitted LDL pivots and eta "
            "coordinates are high-precision finite diagnostics, not interval "
            "certificates, an all-degree inequality, or an RH proof."
        ),
        "parameters": {
            "dps": dps,
            "degrees": list(CERTIFIED_ENDPOINT_DEGREES),
            "max_seconds": max_seconds,
            "numeric_relative_tolerance": mp_text(tolerance, dps),
            "reconstruction": "midpoints of SHA-bound certified input intervals",
        },
        "input_bindings": {
            name: {
                "path_relative_to_workstream": relative_label(paths[name]),
                "sha256": observed_hashes[name],
                "expected_sha256": EXPECTED_SHA256[name],
            }
            for name in paths
        },
        "normalization_audit": {
            "odd_basis_degrees": list(ODD_DEGREES),
            "scales_verbatim_fixed_decimals": list(
                documents["parent_interval"]["scales"]
            ),
            "target_entry_formula": (
                "H_ij=(-1)^(1+(i+j)/2)*mu_((i+j)/2)*scale_i*scale_j/4^((i+j)/2)"
            ),
            "gain_formula": "delta_dot=d-2*alpha^T*b+alpha^T*H*alpha",
            "forcing_formula": "w=b-H*alpha",
            "cost_formula": "w^T*H^-1*w=sum_k eta_k^2/s_k",
            "surplus_formula": "sigma=delta_dot-sum_k eta_k^2/s_k",
            "factor_of_two_convention": (
                "v19 uses D=G_+'(0), the half-difference endpoint convention. "
                "v20's raw plus-minus divided by a is 2D. This replay uses v19 D: "
                "the quadratic residual derivative has the explicit "
                "-2*alpha^T*b cross term, while w=b-D_old*alpha and its LDL cost "
                "receive no extra factor 2. Gain and cost are checked separately "
                "against the v19 archive so cancellation in surplus cannot mask a "
                "factor-of-two error."
            ),
            "max_abs_normalized_target_diagonal_minus_one": mp_text(
                diagonal_error, dps
            ),
        },
        "checks": aggregate_checks,
        "rungs": rows,
        "provenance": {
            "source_sha256": file_sha256(SOURCE_PATH),
            "python": platform.python_version(),
            "mpmath": mp.__version__,
            "elapsed_seconds": elapsed,
        },
    }


def atomic_write_json(path: Path, payload: dict[str, Any], max_output_bytes: int) -> None:
    if not 1024 <= max_output_bytes <= HARD_MAX_OUTPUT_BYTES:
        raise ValueError(
            f"max_output_bytes must lie in [1024, {HARD_MAX_OUTPUT_BYTES}]"
        )
    encoded = (
        json.dumps(payload, ensure_ascii=True, allow_nan=False, indent=2, sort_keys=True)
        + "\n"
    ).encode("ascii")
    if len(encoded) > max_output_bytes:
        raise ValueError(
            f"serialized output is {len(encoded)} bytes, above cap {max_output_bytes}"
        )
    destination = path.resolve()
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary_name: str | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="wb",
            prefix=f".{destination.name}.",
            suffix=".tmp",
            dir=destination.parent,
            delete=False,
        ) as handle:
            temporary_name = handle.name
            handle.write(encoded)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary_name, destination)
        temporary_name = None
    finally:
        if temporary_name is not None:
            try:
                Path(temporary_name).unlink()
            except FileNotFoundError:
                pass


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=["endpoint-midpoint"], default="endpoint-midpoint")
    parser.add_argument("--egf-manifest", type=Path, default=DEFAULT_EGF_MANIFEST)
    parser.add_argument("--parent-interval", type=Path, default=DEFAULT_PARENT_INTERVAL)
    parser.add_argument("--target-moments", type=Path, default=DEFAULT_TARGET_MOMENTS)
    parser.add_argument(
        "--endpoint-certificate", type=Path, default=DEFAULT_ENDPOINT_CERTIFICATE
    )
    parser.add_argument("--dps", type=int, default=120)
    parser.add_argument("--max-seconds", type=int, default=60)
    parser.add_argument(
        "--max-output-bytes", type=int, default=HARD_MAX_OUTPUT_BYTES
    )
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--progress", action="store_true")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    payload = run_endpoint_reconstruction(
        egf_manifest=args.egf_manifest,
        parent_interval=args.parent_interval,
        target_moments=args.target_moments,
        endpoint_certificate=args.endpoint_certificate,
        dps=args.dps,
        max_seconds=args.max_seconds,
        progress_enabled=args.progress,
    )
    atomic_write_json(args.output, payload, args.max_output_bytes)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
