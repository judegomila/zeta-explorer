#!/usr/bin/env python3
"""Reconstruct endpoint ``M0`` and its inertia on the archived odd ladder.

This is a SHA-bound, high-precision *floating diagnostic*. It uses only the
already certified odd endpoint ladder through degree 19. Archived interval
files retain their original finite claims; this worker does not make the new
raw pieces, eigenvalues, or inertias rigorous. Finite agreement cannot prove
an all-degree inequality or RH.
"""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import platform
import sys
import tempfile
import time
from types import ModuleType
from typing import Any, Sequence

import mpmath as mp


SCHEMA_VERSION = "zsv.m0_inertia_probe.v1"
STATUS = "finite_floating_m0_inertia_diagnostic"
MODE = "sha_bound_endpoint_primary_replay"
SOURCE_PATH = Path(__file__).resolve()
REQUIRED_PYTHON = Path(
    "/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python"
)
WORKSTREAM_ROOT = SOURCE_PATH.parents[1]
CHECKPOINT_ROOT = SOURCE_PATH.parents[3]

DEFAULT_EGF_SOURCE = WORKSTREAM_ROOT / "src" / "egf_identity.py"
DEFAULT_EGF_MANIFEST = WORKSTREAM_ROOT / "results" / "egf_identity_j128.json"
DEFAULT_PARENT_INTERVAL = (
    CHECKPOINT_ROOT / "evidence" / "v19-delta" / "fisher_bridge_v3"
    / "parent_interval_1000.json"
)
DEFAULT_TARGET_MOMENTS = (
    CHECKPOINT_ROOT / "evidence" / "v18-curated" / "full_split_audit"
    / "actual_total_certificate.json"
)
DEFAULT_ENDPOINT_CERTIFICATE = (
    CHECKPOINT_ROOT / "evidence" / "v19-delta" / "fisher_bridge_v3"
    / "endpoint_certificate_1000.json"
)

EXPECTED_SHA256 = {
    "egf_source": "d7c777d34c5684f133ce536166617c389492db0f678602e65f324c0a8220d9c4",
    "egf_manifest": "354703546a02d24f41699a47739686057a94270103589a62601181043ad9c83c",
    "parent_interval": "7e62d06a0ba7eec5fd7a80e4e5f63a35cf87875d92d73b04314259ae596ef928",
    "target_moments": "06b56542d907b50d397263a88da4a39da75ac94463cd48d54da8a5e43198b536",
    "endpoint_certificate": "6042e7989864e2e64f89989bb82329d2bf3af91fe848bed722496ae364335509",
}
EXPECTED_FORMULA_SHA256 = (
    "7cd5aa8898b39cfc1eed9417bd6bb7d9b8f52dfd33ca25665e4f2c7765cf8843"
)
EXPECTED_TARGET_SCOPE = "Full theta normalized a=0 full moments via reflected identity"
EXPECTED_ENDPOINT_SCOPE = (
    "Original theta existing odd rungs3..19 normalized a0; positive parent G0 "
    "intervalTaylor20; reused target moment intervals; no nonzero-shift interval "
    "certificate"
)
EXPECTED_ENDPOINT_LOAD_PADDING = "1e-54*(1+abs(interval))"
EXPECTED_FORMULAS = {
    "P": "exp(t/2-z*(exp(2*t)-1))*P_0(z*exp(2*t))",
    "C": "3*(exp(2*t)-1)*exp(5*t/2-(3/2)*(exp(2*t)-1))",
    "ell_A": "-C",
}
EXPECTED_INTERFACE = "P=P_0*A+4*z*C and ell(A)=-C"

ODD_DEGREES = tuple(range(1, 20, 2))
CERTIFIED_ENDPOINT_DEGREES = tuple(range(3, 20, 2))
MAX_THETA_DEGREE = 19
MIN_DPS = 90
MAX_DPS = 256
MIN_STEP_DENOMINATOR = 128
MAX_STEP_DENOMINATOR = 512
MIN_ORBITS = 12
MAX_ORBITS = 32
HARD_MAX_SECONDS = 600
HARD_MAX_OUTPUT_BYTES = 4 * 1024 * 1024
TARGET_DERIVATIVE_TOLERANCE = mp.mpf("1e-50")
MIN_STABILITY_MARGIN_RATIO = mp.mpf("1e20")

Polynomial = list[Fraction]
Matrix = list[list[mp.mpf]]
Vector = list[mp.mpf]


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def relative_label(path: Path) -> str:
    return os.path.relpath(path.resolve(), WORKSTREAM_ROOT.resolve())


def read_bound_json(path: Path, name: str) -> tuple[dict[str, Any], str]:
    raw = path.resolve().read_bytes()
    observed = hashlib.sha256(raw).hexdigest()
    expected = EXPECTED_SHA256[name]
    if observed != expected:
        raise ValueError(
            f"SHA-256 mismatch for {name}: expected {expected}, observed {observed}"
        )
    payload = json.loads(raw)
    if not isinstance(payload, dict):
        raise ValueError(f"{name} must contain a JSON object")
    return payload, observed


def load_bound_egf_module(path: Path) -> tuple[ModuleType, str]:
    resolved = path.resolve()
    observed = file_sha256(resolved)
    expected = EXPECTED_SHA256["egf_source"]
    if observed != expected:
        raise ValueError(
            f"SHA-256 mismatch for egf_source: expected {expected}, observed {observed}"
        )
    module_name = "m0_inertia_probe_bound_egf_identity"
    spec = importlib.util.spec_from_file_location(module_name, resolved)
    if spec is None or spec.loader is None:
        raise ImportError(f"could not load bound EGF source at {resolved}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    spec.loader.exec_module(module)
    return module, observed


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


def validate_egf_manifest(payload: dict[str, Any]) -> None:
    if payload.get("schema_version") != "zsv.egf_identity.v1":
        raise ValueError("EGF manifest schema version mismatch")
    if payload.get("status") != "exact_egf_identity":
        raise ValueError("EGF manifest status mismatch")
    checks = payload.get("checks")
    if not isinstance(checks, dict) or not checks:
        raise ValueError("EGF manifest exact checks are missing")
    if checks.get("all_exact_checks_passed") is not True or any(
        value is not True for value in checks.values()
    ):
        raise ValueError("EGF manifest exact-pass gate failed")
    parameters = payload.get("parameters")
    if not isinstance(parameters, dict):
        raise ValueError("EGF manifest parameters are missing")
    if parameters.get("full_polynomial_degree", -1) < MAX_THETA_DEGREE:
        raise ValueError("EGF manifest polynomial degree is below 19")
    if parameters.get("scalar_degree", -1) < MAX_THETA_DEGREE:
        raise ValueError("EGF manifest scalar degree is below 19")
    hashes = payload.get("hashes")
    if not isinstance(hashes, dict):
        raise ValueError("EGF manifest hashes are missing")
    if hashes.get("source_sha256") != EXPECTED_SHA256["egf_source"]:
        raise ValueError("EGF manifest source hash mismatch")
    if hashes.get("formula_sha256") != EXPECTED_FORMULA_SHA256:
        raise ValueError("EGF formula hash mismatch")
    formulas = payload.get("formulas")
    if not isinstance(formulas, dict) or any(
        formulas.get(name) != formula for name, formula in EXPECTED_FORMULAS.items()
    ):
        raise ValueError("EGF formula text mismatch")
    audit = payload.get("normalization_audit")
    if not isinstance(audit, dict) or audit.get("interface") != EXPECTED_INTERFACE:
        raise ValueError("EGF P=P0*A+4*z*C interface mismatch")


def theta_polynomials(max_degree: int) -> list[Polynomial]:
    values: list[Polynomial] = [[Fraction(0), Fraction(-12), Fraction(8)]]
    for _ in range(max_degree):
        old = values[-1]
        new = [Fraction(0) for _ in range(len(old) + 1)]
        for power, coefficient in enumerate(old):
            new[power] += (2 * power + Fraction(1, 2)) * coefficient
            new[power + 1] -= 2 * coefficient
        values.append(new)
    return values


def fraction_text(value: Fraction) -> str:
    return str(value.numerator) if value.denominator == 1 else f"{value.numerator}/{value.denominator}"


def fraction_to_mp(value: Fraction) -> mp.mpf:
    return mp.mpf(value.numerator) / value.denominator


def zero_matrix(size: int) -> Matrix:
    return [[mp.mpf("0") for _ in range(size)] for _ in range(size)]


def transpose(matrix: Matrix) -> Matrix:
    return [list(column) for column in zip(*matrix)]


def matrix_multiply(left: Matrix, right: Matrix) -> Matrix:
    if not left or not right or len(left[0]) != len(right):
        raise ValueError("matrix multiplication dimensions differ")
    right_t = transpose(right)
    return [
        [mp.fsum(x * y for x, y in zip(row, column)) for column in right_t]
        for row in left
    ]


def max_abs_matrix(matrix: Matrix) -> mp.mpf:
    return max(abs(value) for row in matrix for value in row)


def max_abs_difference(left: Matrix, right: Matrix) -> mp.mpf:
    if len(left) != len(right) or any(
        len(left_row) != len(right_row)
        for left_row, right_row in zip(left, right)
    ):
        raise ValueError("matrix difference dimensions differ")
    return max(
        abs(x - y)
        for left_row, right_row in zip(left, right)
        for x, y in zip(left_row, right_row)
    )


def ldlt_factor(matrix: Matrix) -> tuple[Matrix, Vector]:
    size = len(matrix)
    if size == 0 or any(len(row) != size for row in matrix):
        raise ValueError("LDL input must be a nonempty square matrix")
    lower = zero_matrix(size)
    pivots: Vector = []
    for row in range(size):
        lower[row][row] = mp.mpf("1")
        for column in range(row):
            numerator = matrix[row][column] - mp.fsum(
                lower[row][index] * pivots[index] * lower[column][index]
                for index in range(column)
            )
            lower[row][column] = numerator / pivots[column]
        pivot = matrix[row][row] - mp.fsum(
            lower[row][index] ** 2 * pivots[index] for index in range(row)
        )
        if not mp.isfinite(pivot) or pivot <= 0:
            raise ArithmeticError(f"nonpositive LDL pivot {row}: {pivot}")
        pivots.append(pivot)
    return lower, pivots


def inverse_unit_lower(lower: Matrix) -> Matrix:
    size = len(lower)
    inverse = zero_matrix(size)
    for column in range(size):
        for row in range(size):
            right = mp.mpf("1") if row == column else mp.mpf("0")
            inverse[row][column] = right - mp.fsum(
                lower[row][index] * inverse[index][column]
                for index in range(row)
            )
    return inverse


def parent_whitened_congruence(
    parent: Matrix, metric: Matrix
) -> tuple[Matrix, Vector, mp.mpf, mp.mpf]:
    """Return W metric W^T with W parent W^T=I using parent LDL data."""

    lower, pivots = ldlt_factor(parent)
    inverse_lower = inverse_unit_lower(lower)
    whitener = [
        [value / mp.sqrt(pivots[row]) for value in inverse_lower[row]]
        for row in range(len(parent))
    ]
    whitened_parent = matrix_multiply(
        matrix_multiply(whitener, parent), transpose(whitener)
    )
    whitened_metric = matrix_multiply(
        matrix_multiply(whitener, metric), transpose(whitener)
    )
    identity_error = max(
        abs(
            whitened_parent[row][column]
            - (mp.mpf("1") if row == column else mp.mpf("0"))
        )
        for row in range(len(parent))
        for column in range(len(parent))
    )
    reconstructed = [
        [
            mp.fsum(
                lower[row][index] * pivots[index] * lower[column][index]
                for index in range(min(row, column) + 1)
            )
            for column in range(len(parent))
        ]
        for row in range(len(parent))
    ]
    reconstruction_error = max_abs_difference(parent, reconstructed) / max(
        mp.mpf("1"), max_abs_matrix(parent)
    )
    return whitened_metric, pivots, identity_error, reconstruction_error


def solve_positive(matrix: Matrix, vector: Vector) -> Vector:
    answer = mp.lu_solve(mp.matrix(matrix), mp.matrix(vector))
    return [mp.mpf(answer[index]) for index in range(len(vector))]


def dot(left: Sequence[mp.mpf], right: Sequence[mp.mpf]) -> mp.mpf:
    return mp.fsum(x * y for x, y in zip(left, right))


def symmetric_eigenvalues(matrix: Matrix) -> Vector:
    values = mp.eigsy(mp.matrix(matrix), eigvals_only=True)
    return [mp.mpf(values[index]) for index in range(len(matrix))]


def inertia(values: Sequence[mp.mpf], tolerance: mp.mpf) -> dict[str, int]:
    return {
        "negative": sum(value < -tolerance for value in values),
        "zero": sum(abs(value) <= tolerance for value in values),
        "positive": sum(value > tolerance for value in values),
    }


def evaluate_polynomial(coefficients: Sequence[mp.mpf], value: mp.mpf) -> mp.mpf:
    result = mp.mpf("0")
    for coefficient in reversed(coefficients):
        result = result * value + coefficient
    return result


def prepare_inputs(
    *,
    egf_source: Path = DEFAULT_EGF_SOURCE,
    egf_manifest: Path = DEFAULT_EGF_MANIFEST,
    parent_interval: Path = DEFAULT_PARENT_INTERVAL,
    target_moments: Path = DEFAULT_TARGET_MOMENTS,
    endpoint_certificate: Path = DEFAULT_ENDPOINT_CERTIFICATE,
    dps: int = 160,
) -> dict[str, Any]:
    """Load every bound input and reconstruct the exact residue coordinates."""

    mp.mp.dps = dps
    paths = {
        "egf_source": Path(egf_source),
        "egf_manifest": Path(egf_manifest),
        "parent_interval": Path(parent_interval),
        "target_moments": Path(target_moments),
        "endpoint_certificate": Path(endpoint_certificate),
    }
    egf_module, egf_source_hash = load_bound_egf_module(paths["egf_source"])
    documents: dict[str, dict[str, Any]] = {}
    observed_hashes = {"egf_source": egf_source_hash}
    for name in (
        "egf_manifest",
        "parent_interval",
        "target_moments",
        "endpoint_certificate",
    ):
        documents[name], observed_hashes[name] = read_bound_json(paths[name], name)
    validate_egf_manifest(documents["egf_manifest"])

    recurrence_polynomials = theta_polynomials(MAX_THETA_DEGREE)
    closed_polynomials = egf_module.egf_p_coefficients(MAX_THETA_DEGREE)
    if recurrence_polynomials != closed_polynomials:
        raise ArithmeticError("theta recurrence and bound closed EGF disagree")
    c_coefficients: list[Fraction] = egf_module.egf_c_coefficients(
        MAX_THETA_DEGREE
    )
    if len(c_coefficients) != MAX_THETA_DEGREE + 1:
        raise ArithmeticError("bound EGF returned the wrong scalar sequence length")
    e_coefficients = [-value for value in c_coefficients]
    d_coefficients = [Fraction(0)] + [
        degree * e_coefficients[degree - 1]
        for degree in range(1, MAX_THETA_DEGREE + 1)
    ]
    expected_examples = {
        1: (Fraction(-6), Fraction(0)),
        2: (Fraction(-6), Fraction(-12)),
        3: (Fraction(195, 2), Fraction(-18)),
        4: (Fraction(489), Fraction(390)),
    }
    if any(
        (e_coefficients[degree], d_coefficients[degree]) != expected
        for degree, expected in expected_examples.items()
    ):
        raise ArithmeticError("exact residue-coordinate examples disagree")

    parent = documents["parent_interval"]
    if parent.get("cells") != 1000:
        raise ValueError("parent interval is not the certified 1000-cell input")
    scales_raw = parent.get("scales")
    parent_raw = parent.get("G0")
    if not isinstance(scales_raw, list) or len(scales_raw) != len(ODD_DEGREES):
        raise ValueError("parent scale vector has the wrong length")
    if (
        not isinstance(parent_raw, list)
        or len(parent_raw) != len(ODD_DEGREES)
        or any(
            not isinstance(row, list) or len(row) != len(ODD_DEGREES)
            for row in parent_raw
        )
    ):
        raise ValueError("parent G0 has the wrong shape")
    scales = [mp.mpf(value) for value in scales_raw]
    if any(not mp.isfinite(value) or value <= 0 for value in scales):
        raise ValueError("parent scales must be positive and finite")
    parent_midpoint = [
        [
            interval_midpoint(value, f"parent.G0[{row}][{column}]")
            for column, value in enumerate(raw_row)
        ]
        for row, raw_row in enumerate(parent_raw)
    ]
    if any(
        parent_midpoint[row][column] != parent_midpoint[column][row]
        for row in range(len(ODD_DEGREES))
        for column in range(len(ODD_DEGREES))
    ):
        raise ValueError("parent G0 midpoint is not symmetric")

    target = documents["target_moments"]
    if target.get("scope") != EXPECTED_TARGET_SCOPE:
        raise ValueError("actual target moment scope mismatch")
    moments_raw = target.get("moments")
    if not isinstance(moments_raw, list) or len(moments_raw) != 20:
        raise ValueError("actual target certificate must contain 20 moments")
    moments = [
        interval_midpoint(value, f"target.moments[{index}]")
        for index, value in enumerate(moments_raw)
    ]

    endpoint = documents["endpoint_certificate"]
    if endpoint.get("scope") != EXPECTED_ENDPOINT_SCOPE:
        raise ValueError("endpoint certificate scope mismatch")
    if endpoint.get("source_cells") != 1000:
        raise ValueError("endpoint certificate is not bound to 1000 parent cells")
    if endpoint.get("source_decimal_load_padding") != EXPECTED_ENDPOINT_LOAD_PADDING:
        raise ValueError("endpoint decimal-load padding mismatch")
    results = endpoint.get("results")
    if not isinstance(results, list):
        raise ValueError("endpoint certificate results are missing")
    endpoint_degrees = tuple(
        sorted(
            record.get("degree")
            for record in results
            if isinstance(record, dict) and isinstance(record.get("degree"), int)
        )
    )
    if endpoint_degrees != CERTIFIED_ENDPOINT_DEGREES or len(results) != len(
        CERTIFIED_ENDPOINT_DEGREES
    ):
        raise ValueError("endpoint certificate does not contain exactly degrees 3..19")

    return {
        "paths": paths,
        "documents": documents,
        "observed_hashes": observed_hashes,
        "polynomials": recurrence_polynomials,
        "c_coefficients": c_coefficients,
        "e_coefficients": e_coefficients,
        "d_coefficients": d_coefficients,
        "scales": scales,
        "parent_midpoint": parent_midpoint,
        "parent_intervals": parent_raw,
        "moments": moments,
        "exact_checks": {
            "all_input_hashes_match": observed_hashes == EXPECTED_SHA256,
            "egf_manifest_exact_pass": True,
            "egf_formula_hash_and_text_match": True,
            "theta_recurrence_matches_closed_egf_through_19": True,
            "residue_is_minus_C": True,
            "residue_drift_is_j_times_previous_residue": True,
            "residue_examples_match": True,
            "endpoint_degree_set_is_exactly_3_through_19_odd": True,
        },
    }


def target_derivative_matrix(inputs: dict[str, Any]) -> Matrix:
    scales: Vector = inputs["scales"]
    moments: Vector = inputs["moments"]
    result = zero_matrix(len(ODD_DEGREES))
    for row, left_degree in enumerate(ODD_DEGREES):
        for column, right_degree in enumerate(ODD_DEGREES):
            moment_index = (left_degree + right_degree) // 2
            sign = -1 if (1 + moment_index) % 2 else 1
            result[row][column] = (
                sign
                * moments[moment_index]
                * scales[row]
                * scales[column]
                / mp.mpf(4) ** moment_index
            )
    return result


def compute_numeric_run(
    inputs: dict[str, Any],
    *,
    label: str,
    dps: int,
    step_denominator: int,
    theta_orbits: int,
    h_cutoff: mp.mpf | str | int,
    t_extent: mp.mpf | str | int,
    max_seconds: int,
    progress_enabled: bool = False,
) -> dict[str, Any]:
    if not MIN_DPS <= dps <= MAX_DPS:
        raise ValueError(f"dps must lie in [{MIN_DPS}, {MAX_DPS}]")
    if not MIN_STEP_DENOMINATOR <= step_denominator <= MAX_STEP_DENOMINATOR:
        raise ValueError(
            f"step denominator must lie in [{MIN_STEP_DENOMINATOR}, "
            f"{MAX_STEP_DENOMINATOR}]"
        )
    if not MIN_ORBITS <= theta_orbits <= MAX_ORBITS:
        raise ValueError(f"theta orbits must lie in [{MIN_ORBITS}, {MAX_ORBITS}]")
    if not 1 <= max_seconds <= HARD_MAX_SECONDS:
        raise ValueError(f"max_seconds must lie in [1, {HARD_MAX_SECONDS}]")

    mp.mp.dps = dps
    h_cutoff_value = mp.mpf(h_cutoff)
    if not mp.mpf("2") <= h_cutoff_value <= mp.mpf("6"):
        raise ValueError("h_cutoff must lie in [2, 6]")
    t_extent_value = mp.mpf(t_extent)
    if not mp.mpf("3") <= t_extent_value <= mp.mpf("6"):
        raise ValueError("t_extent must lie in [3, 6]")
    started = time.monotonic()
    deadline = started + max_seconds
    size = len(ODD_DEGREES)
    scales: Vector = inputs["scales"]
    polynomials = [
        [fraction_to_mp(value) for value in polynomial]
        for polynomial in inputs["polynomials"]
    ]
    e_all = [fraction_to_mp(value) for value in inputs["e_coefficients"]]
    d_all = [fraction_to_mp(value) for value in inputs["d_coefficients"]]
    e_vector = [
        scales[index] * e_all[degree]
        for index, degree in enumerate(ODD_DEGREES)
    ]
    d_vector = [
        scales[index] * d_all[degree]
        for index, degree in enumerate(ODD_DEGREES)
    ]

    raw_gram = zero_matrix(size)
    raw_derivative = zero_matrix(size)
    corrected_gram = zero_matrix(size)
    corrected_derivative = zero_matrix(size)
    direct_signed_square_m0 = zero_matrix(size)
    u_vector = [mp.mpf("0") for _ in range(size)]
    u_derivative = [mp.mpf("0") for _ in range(size)]
    gamma = mp.mpf("0")
    gamma_derivative = mp.mpf("0")
    step = mp.mpf(1) / step_denominator
    nodes = 0
    last_orbit_max_abs_corrected_feature_term = mp.mpf("0")
    last_orbit_max_abs_raw_feature_term = mp.mpf("0")
    last_orbit_max_abs_raw_drift_term = mp.mpf("0")
    upper_edge_last_node_target_derivative_contribution = mp.mpf("0")
    upper_band_target_derivative_contribution = mp.mpf("0")
    last_processed_h = mp.mpf("0")

    node_radius = int(t_extent_value * step_denominator)
    if mp.mpf(node_radius) != t_extent_value * step_denominator:
        raise ValueError("t_extent*step_denominator must be an integer")
    for node_index in range(-node_radius, node_radius + 1):
        if time.monotonic() > deadline:
            raise TimeoutError(f"{label} cooperative quadrature guard expired")
        t = node_index * step
        transformed = mp.pi / 2 * mp.sinh(t)
        h = h_cutoff_value / 2 * (1 + mp.tanh(transformed))
        weight = (
            step
            * h_cutoff_value
            * mp.pi
            / 4
            * mp.cosh(t)
            / mp.cosh(transformed) ** 2
        )
        if h == 0 or h == h_cutoff_value:
            continue
        derivatives = [mp.mpf("0") for _ in range(MAX_THETA_DEGREE + 1)]
        last_orbit_derivatives = [
            mp.mpf("0") for _ in range(MAX_THETA_DEGREE + 1)
        ]
        chi = mp.mpf("0")
        last_orbit_chi = mp.mpf("0")
        exp_two_h = mp.exp(2 * h)
        for orbit in range(1, theta_orbits + 1):
            if time.monotonic() > deadline:
                raise TimeoutError(f"{label} cooperative orbit guard expired")
            z = mp.pi * orbit * orbit * exp_two_h
            factor = mp.exp(h / 2 - z)
            chi_term = 4 * z * factor
            chi += chi_term
            if orbit == theta_orbits:
                last_orbit_chi = chi_term
            for degree in range(MAX_THETA_DEGREE + 1):
                derivative_term = factor * evaluate_polynomial(
                    polynomials[degree], z
                )
                derivatives[degree] += derivative_term
                if orbit == theta_orbits:
                    last_orbit_derivatives[degree] = derivative_term

        corrected: Vector = []
        corrected_drift: Vector = []
        raw: Vector = []
        raw_drift: Vector = []
        for index, degree in enumerate(ODD_DEGREES):
            scale = scales[index]
            corrected.append(scale * derivatives[degree])
            corrected_drift.append(scale * degree * derivatives[degree - 1])
            raw.append(scale * (derivatives[degree] + e_all[degree] * chi))
            raw_drift.append(
                scale
                * (degree * derivatives[degree - 1] + d_all[degree] * chi)
            )
            last_corrected_term = scale * last_orbit_derivatives[degree]
            last_raw_term = scale * (
                last_orbit_derivatives[degree] + e_all[degree] * last_orbit_chi
            )
            last_raw_drift_term = scale * (
                degree * last_orbit_derivatives[degree - 1]
                + d_all[degree] * last_orbit_chi
            )
            last_orbit_max_abs_corrected_feature_term = max(
                last_orbit_max_abs_corrected_feature_term,
                abs(last_corrected_term),
            )
            last_orbit_max_abs_raw_feature_term = max(
                last_orbit_max_abs_raw_feature_term, abs(last_raw_term)
            )
            last_orbit_max_abs_raw_drift_term = max(
                last_orbit_max_abs_raw_drift_term, abs(last_raw_drift_term)
            )

        # Corrected F=raw Psi-e*chi. Holding e fixed gives raw drift Psi_dot.
        # Thus X0=2hF+Psi_dot and Y0=Psi_dot independently reconstruct M0.
        x0 = [2 * h * corrected[index] + raw_drift[index] for index in range(size)]
        y0 = list(raw_drift)
        measure = weight * h
        node_max_target_derivative_contribution = mp.mpf("0")
        gamma += measure * chi * chi
        gamma_derivative += measure * 2 * h * chi * chi
        for row in range(size):
            u_vector[row] += measure * raw[row] * chi
            u_derivative[row] += measure * (
                2 * h * raw[row] * chi + raw_drift[row] * chi
            )
            for column in range(row + 1):
                raw_gram[row][column] += measure * raw[row] * raw[column]
                raw_derivative[row][column] += measure * (
                    2 * h * raw[row] * raw[column]
                    + raw_drift[row] * raw[column]
                    + raw[row] * raw_drift[column]
                )
                corrected_gram[row][column] += (
                    measure * corrected[row] * corrected[column]
                )
                corrected_derivative[row][column] += measure * (
                    2 * h * corrected[row] * corrected[column]
                    + corrected_drift[row] * corrected[column]
                    + corrected[row] * corrected_drift[column]
                )
                # X0/Y0 are ordinary-L2(dh) vectors. Do not insert the parent
                # measure h a second time here.
                direct_signed_square_m0[row][column] += weight / 2 * (
                    x0[row] * x0[column] - y0[row] * y0[column]
                )
                target_node_contribution = abs(
                    measure
                    * (
                        2 * h * corrected[row] * corrected[column]
                        + corrected_drift[row] * corrected[column]
                        + corrected[row] * corrected_drift[column]
                    )
                )
                node_max_target_derivative_contribution = max(
                    node_max_target_derivative_contribution,
                    target_node_contribution,
                )
        upper_edge_last_node_target_derivative_contribution = (
            node_max_target_derivative_contribution
        )
        if h >= mp.mpf("0.99") * h_cutoff_value:
            upper_band_target_derivative_contribution = max(
                upper_band_target_derivative_contribution,
                node_max_target_derivative_contribution,
            )
        last_processed_h = h
        nodes += 1

    for row in range(size):
        for column in range(row):
            for matrix in (
                raw_gram,
                raw_derivative,
                corrected_gram,
                corrected_derivative,
                direct_signed_square_m0,
            ):
                matrix[column][row] = matrix[row][column]

    m0 = [
        [
            raw_derivative[row][column]
            - u_derivative[row] * e_vector[column]
            - e_vector[row] * u_derivative[column]
            + gamma_derivative * e_vector[row] * e_vector[column]
            for column in range(size)
        ]
        for row in range(size)
    ]
    v_vector = [u_vector[index] - gamma * e_vector[index] for index in range(size)]
    reconstructed_corrected_gram = [
        [
            raw_gram[row][column]
            - u_vector[row] * e_vector[column]
            - e_vector[row] * u_vector[column]
            + gamma * e_vector[row] * e_vector[column]
            for column in range(size)
        ]
        for row in range(size)
    ]
    reconstructed_corrected_derivative = [
        [
            m0[row][column]
            - v_vector[row] * d_vector[column]
            - d_vector[row] * v_vector[column]
            for column in range(size)
        ]
        for row in range(size)
    ]

    target_derivative = target_derivative_matrix(inputs)
    parent_midpoint: Matrix = inputs["parent_midpoint"]
    sign_tolerance = mp.power(10, -(dps // 2))
    algebra_tolerance = mp.power(10, -(dps - 20))
    inertia_rows: list[dict[str, Any]] = []
    for prefix_size, degree in enumerate(ODD_DEGREES, start=1):
        prefix_m0 = [row[:prefix_size] for row in m0[:prefix_size]]
        prefix_parent = [
            row[:prefix_size] for row in parent_midpoint[:prefix_size]
        ]
        prefix_target = [
            row[:prefix_size] for row in target_derivative[:prefix_size]
        ]
        prefix_v = v_vector[:prefix_size]
        prefix_d = d_vector[:prefix_size]

        ordinary_values = symmetric_eigenvalues(prefix_m0)
        (
            whitened_m0,
            parent_pivots,
            whitening_error,
            parent_ldl_error,
        ) = parent_whitened_congruence(prefix_parent, prefix_m0)
        whitened_values = symmetric_eigenvalues(whitened_m0)
        ordinary_inertia = inertia(ordinary_values, sign_tolerance)
        whitened_inertia = inertia(whitened_values, sign_tolerance)

        _, target_pivots = ldlt_factor(prefix_target)
        target_inverse_v = solve_positive(prefix_target, prefix_v)
        target_inverse_d = solve_positive(prefix_target, prefix_d)
        gate_v = dot(prefix_v, target_inverse_v)
        gate_d = dot(prefix_d, target_inverse_d)
        gate_c = dot(prefix_v, target_inverse_d)
        gate_left = mp.sqrt(gate_v * gate_d) - gate_c
        gate_margin = 1 - gate_left
        rank_two_reconstruction = [
            [
                prefix_target[row][column]
                + prefix_v[row] * prefix_d[column]
                + prefix_d[row] * prefix_v[column]
                for column in range(prefix_size)
            ]
            for row in range(prefix_size)
        ]
        gate_identity_error = max_abs_difference(
            prefix_m0, rank_two_reconstruction
        )
        gate_predicts_psd = gate_margin >= -sign_tolerance
        observed_psd = ordinary_inertia["negative"] == 0
        inertia_rows.append(
            {
                "degree": degree,
                "prefix_size": prefix_size,
                "ordinary_eigenvalues": ordinary_values,
                "ordinary_inertia": ordinary_inertia,
                "ordinary_min_abs_eigenvalue": min(
                    abs(value) for value in ordinary_values
                ),
                "parent_whitened_generalized_eigenvalues": whitened_values,
                "parent_whitened_inertia": whitened_inertia,
                "parent_whitened_min_abs_eigenvalue": min(
                    abs(value) for value in whitened_values
                ),
                "parent_ldl_pivots": parent_pivots,
                "parent_whitening_max_abs_error": whitening_error,
                "parent_ldl_relative_reconstruction_error": parent_ldl_error,
                "ordinary_and_whitened_inertia_agree": (
                    ordinary_inertia == whitened_inertia
                ),
                "old_target_gate": {
                    "V": gate_v,
                    "D": gate_d,
                    "C": gate_c,
                    "sqrt_VD_minus_C": gate_left,
                    "margin_1_minus_sqrt_VD_minus_C": gate_margin,
                    "target_ldl_pivots": target_pivots,
                    "m0_equals_target_plus_vd_plus_dv_max_abs_error": (
                        gate_identity_error
                    ),
                    "gate_predicts_psd": gate_predicts_psd,
                    "observed_m0_is_psd": observed_psd,
                    "gate_and_observed_psd_agree": gate_predicts_psd == observed_psd,
                },
            }
        )

    corrected_gram_decomposition_error = max_abs_difference(
        reconstructed_corrected_gram, corrected_gram
    )
    derivative_rank_two_error = max_abs_difference(
        reconstructed_corrected_derivative, corrected_derivative
    )
    signed_square_error = max_abs_difference(m0, direct_signed_square_m0)
    parent_midpoint_error = max_abs_difference(corrected_gram, parent_midpoint)
    target_derivative_error = max_abs_difference(
        corrected_derivative, target_derivative
    )
    parent_interval_overlap = True
    for row in range(size):
        for column in range(size):
            lower, upper = parse_interval(
                inputs["parent_intervals"][row][column],
                f"parent.G0[{row}][{column}]",
            )
            parent_interval_overlap = (
                parent_interval_overlap
                and lower <= corrected_gram[row][column] <= upper
            )
    max_whitening_error = max(
        row["parent_whitening_max_abs_error"] for row in inertia_rows
    )
    max_parent_ldl_error = max(
        row["parent_ldl_relative_reconstruction_error"] for row in inertia_rows
    )
    max_gate_identity_error = max(
        row["old_target_gate"][
            "m0_equals_target_plus_vd_plus_dv_max_abs_error"
        ]
        for row in inertia_rows
    )
    checks = {
        "corrected_gram_raw_residue_decomposition_closes": (
            corrected_gram_decomposition_error <= algebra_tolerance
        ),
        "m0_minus_vd_minus_dv_equals_target_derivative": (
            derivative_rank_two_error <= algebra_tolerance
        ),
        "m0_equals_target_plus_vd_plus_dv_on_every_prefix": (
            max_gate_identity_error <= TARGET_DERIVATIVE_TOLERANCE
        ),
        "direct_signed_square_equals_m0": signed_square_error <= algebra_tolerance,
        "quadrature_corrected_parent_lies_in_archived_intervals": (
            parent_interval_overlap
        ),
        "quadrature_target_derivative_matches_archived_moments": (
            target_derivative_error <= TARGET_DERIVATIVE_TOLERANCE
        ),
        "all_parent_ldl_factorizations_reconstruct": (
            max_parent_ldl_error <= algebra_tolerance
        ),
        "all_parent_whitenings_reconstruct_identity": (
            max_whitening_error <= algebra_tolerance
        ),
        "ordinary_and_parent_whitened_inertias_agree": all(
            row["ordinary_and_whitened_inertia_agree"] for row in inertia_rows
        ),
        "old_target_gate_and_observed_psd_agree": all(
            row["old_target_gate"]["gate_and_observed_psd_agree"]
            for row in inertia_rows
        ),
    }
    checks["all_numeric_reconstruction_checks_passed"] = all(checks.values())
    if not checks["all_numeric_reconstruction_checks_passed"]:
        failed = [name for name, passed in checks.items() if not passed]
        raise ArithmeticError(f"{label} numeric reconstruction gate failed: {failed}")

    if progress_enabled:
        print(
            json.dumps(
                {
                    "event": "m0_numeric_run_complete",
                    "label": label,
                    "dps": dps,
                    "step_denominator": step_denominator,
                    "theta_orbits": theta_orbits,
                    "h_cutoff": mp.nstr(h_cutoff_value, 20),
                    "t_extent": mp.nstr(t_extent_value, 20),
                    "nodes": nodes,
                },
                sort_keys=True,
            ),
            file=sys.stderr,
            flush=True,
        )

    return {
        "label": label,
        "dps": dps,
        "step_denominator": step_denominator,
        "theta_orbits": theta_orbits,
        "h_cutoff": h_cutoff_value,
        "t_extent": t_extent_value,
        "nodes": nodes,
        "sign_tolerance": sign_tolerance,
        "algebra_tolerance": algebra_tolerance,
        "raw_gram_derivative": raw_derivative,
        "u_derivative": u_derivative,
        "gamma_derivative": gamma_derivative,
        "u": u_vector,
        "gamma": gamma,
        "e": e_vector,
        "d": d_vector,
        "v": v_vector,
        "m0": m0,
        "direct_signed_square_m0": direct_signed_square_m0,
        "corrected_derivative": corrected_derivative,
        "target_derivative": target_derivative,
        "metrics": {
            "corrected_gram_decomposition_max_abs_error": (
                corrected_gram_decomposition_error
            ),
            "m0_rank_two_decomposition_max_abs_error": derivative_rank_two_error,
            "direct_signed_square_m0_max_abs_error": signed_square_error,
            "corrected_parent_vs_interval_midpoint_max_abs_error": (
                parent_midpoint_error
            ),
            "target_derivative_max_abs_error": target_derivative_error,
            "max_parent_whitening_abs_error": max_whitening_error,
            "max_parent_ldl_relative_reconstruction_error": max_parent_ldl_error,
            "max_old_target_gate_identity_abs_error": max_gate_identity_error,
            "last_orbit_max_abs_corrected_feature_term": (
                last_orbit_max_abs_corrected_feature_term
            ),
            "last_orbit_max_abs_raw_feature_term": (
                last_orbit_max_abs_raw_feature_term
            ),
            "last_orbit_max_abs_raw_drift_term": (
                last_orbit_max_abs_raw_drift_term
            ),
            "last_processed_h": last_processed_h,
            "h_cutoff_minus_last_processed_h": h_cutoff_value - last_processed_h,
            "last_upper_node_target_derivative_max_abs_contribution": (
                upper_edge_last_node_target_derivative_contribution
            ),
            "top_one_percent_band_target_derivative_max_abs_node_contribution": (
                upper_band_target_derivative_contribution
            ),
        },
        "checks": checks,
        "inertia": inertia_rows,
        "elapsed_seconds": time.monotonic() - started,
    }


def compare_runs(primary: dict[str, Any], replay: dict[str, Any]) -> dict[str, Any]:
    rows: list[dict[str, Any]] = []
    for primary_row, replay_row in zip(primary["inertia"], replay["inertia"]):
        if primary_row["degree"] != replay_row["degree"]:
            raise ArithmeticError("primary/replay degree order differs")
        ordinary_difference = max(
            abs(left - right)
            for left, right in zip(
                primary_row["ordinary_eigenvalues"],
                replay_row["ordinary_eigenvalues"],
            )
        )
        whitened_difference = max(
            abs(left - right)
            for left, right in zip(
                primary_row["parent_whitened_generalized_eigenvalues"],
                replay_row["parent_whitened_generalized_eigenvalues"],
            )
        )
        smallest_eigen_margin = min(
            primary_row["ordinary_min_abs_eigenvalue"],
            replay_row["ordinary_min_abs_eigenvalue"],
            primary_row["parent_whitened_min_abs_eigenvalue"],
            replay_row["parent_whitened_min_abs_eigenvalue"],
        )
        eigen_discrepancy = max(
            ordinary_difference,
            whitened_difference,
            primary["sign_tolerance"],
            replay["sign_tolerance"],
        )
        eigen_margin_ratio = smallest_eigen_margin / eigen_discrepancy

        primary_gate = primary_row["old_target_gate"]
        replay_gate = replay_row["old_target_gate"]
        gate_margin_difference = abs(
            primary_gate["margin_1_minus_sqrt_VD_minus_C"]
            - replay_gate["margin_1_minus_sqrt_VD_minus_C"]
        )
        smallest_gate_margin = min(
            abs(primary_gate["margin_1_minus_sqrt_VD_minus_C"]),
            abs(replay_gate["margin_1_minus_sqrt_VD_minus_C"]),
        )
        gate_discrepancy = max(
            gate_margin_difference,
            primary["sign_tolerance"],
            replay["sign_tolerance"],
        )
        gate_margin_ratio = smallest_gate_margin / gate_discrepancy
        inertia_agreement = (
            primary_row["ordinary_inertia"] == replay_row["ordinary_inertia"]
            and primary_row["parent_whitened_inertia"]
            == replay_row["parent_whitened_inertia"]
            and primary_row["ordinary_inertia"]
            == primary_row["parent_whitened_inertia"]
        )
        gate_sign_agreement = (
            primary_gate["gate_predicts_psd"] == replay_gate["gate_predicts_psd"]
        )
        rows.append(
            {
                "degree": primary_row["degree"],
                "ordinary_eigenvalue_max_abs_difference": ordinary_difference,
                "parent_whitened_eigenvalue_max_abs_difference": whitened_difference,
                "smallest_eigenvalue_abs_margin": smallest_eigen_margin,
                "eigen_margin_over_numeric_discrepancy": eigen_margin_ratio,
                "old_target_gate_margin_abs_difference": gate_margin_difference,
                "smallest_old_target_gate_abs_margin": smallest_gate_margin,
                "gate_margin_over_numeric_discrepancy": gate_margin_ratio,
                "inertias_agree": inertia_agreement,
                "old_target_gate_signs_agree": gate_sign_agreement,
                "eigen_margin_gate_passes": (
                    eigen_margin_ratio >= MIN_STABILITY_MARGIN_RATIO
                ),
                "old_target_gate_margin_gate_passes": (
                    gate_margin_ratio >= MIN_STABILITY_MARGIN_RATIO
                ),
            }
        )
    matrix_difference = max_abs_difference(primary["m0"], replay["m0"])
    matrix_relative_difference = matrix_difference / max(
        mp.mpf("1"), max_abs_matrix(primary["m0"]), max_abs_matrix(replay["m0"])
    )
    return {
        "m0_matrix_max_abs_difference": matrix_difference,
        "m0_matrix_relative_difference": matrix_relative_difference,
        "minimum_eigen_margin_over_numeric_discrepancy": min(
            row["eigen_margin_over_numeric_discrepancy"] for row in rows
        ),
        "minimum_gate_margin_over_numeric_discrepancy": min(
            row["gate_margin_over_numeric_discrepancy"] for row in rows
        ),
        "all_inertias_agree": all(row["inertias_agree"] for row in rows),
        "all_old_target_gate_signs_agree": all(
            row["old_target_gate_signs_agree"] for row in rows
        ),
        "all_eigenvalue_margin_gates_pass": all(
            row["eigen_margin_gate_passes"] for row in rows
        ),
        "all_old_target_gate_margin_gates_pass": all(
            row["old_target_gate_margin_gate_passes"] for row in rows
        ),
        "rows": rows,
    }


def mp_text(value: mp.mpf, dps: int) -> str:
    return mp.nstr(value, n=max(25, dps - 15), strip_zeros=False)


def matrix_text(matrix: Matrix, dps: int) -> list[list[str]]:
    return [[mp_text(value, dps) for value in row] for row in matrix]


def vector_text(vector: Sequence[mp.mpf], dps: int) -> list[str]:
    return [mp_text(value, dps) for value in vector]


def serialize_inertia_row(row: dict[str, Any], dps: int) -> dict[str, Any]:
    gate = row["old_target_gate"]
    return {
        "degree": row["degree"],
        "prefix_size": row["prefix_size"],
        "ordinary_eigenvalues": vector_text(row["ordinary_eigenvalues"], dps),
        "ordinary_inertia": row["ordinary_inertia"],
        "ordinary_min_abs_eigenvalue": mp_text(
            row["ordinary_min_abs_eigenvalue"], dps
        ),
        "parent_whitened_generalized_eigenvalues": vector_text(
            row["parent_whitened_generalized_eigenvalues"], dps
        ),
        "parent_whitened_inertia": row["parent_whitened_inertia"],
        "parent_whitened_min_abs_eigenvalue": mp_text(
            row["parent_whitened_min_abs_eigenvalue"], dps
        ),
        "parent_ldl_pivots": vector_text(row["parent_ldl_pivots"], dps),
        "parent_whitening_max_abs_error": mp_text(
            row["parent_whitening_max_abs_error"], dps
        ),
        "parent_ldl_relative_reconstruction_error": mp_text(
            row["parent_ldl_relative_reconstruction_error"], dps
        ),
        "ordinary_and_whitened_inertia_agree": row[
            "ordinary_and_whitened_inertia_agree"
        ],
        "old_target_gate": {
            "V": mp_text(gate["V"], dps),
            "D": mp_text(gate["D"], dps),
            "C": mp_text(gate["C"], dps),
            "sqrt_VD_minus_C": mp_text(gate["sqrt_VD_minus_C"], dps),
            "margin_1_minus_sqrt_VD_minus_C": mp_text(
                gate["margin_1_minus_sqrt_VD_minus_C"], dps
            ),
            "target_ldl_pivots": vector_text(gate["target_ldl_pivots"], dps),
            "m0_equals_target_plus_vd_plus_dv_max_abs_error": mp_text(
                gate["m0_equals_target_plus_vd_plus_dv_max_abs_error"], dps
            ),
            "gate_predicts_psd": gate["gate_predicts_psd"],
            "observed_m0_is_psd": gate["observed_m0_is_psd"],
            "gate_and_observed_psd_agree": gate["gate_and_observed_psd_agree"],
        },
    }


def serialize_numeric_run(run: dict[str, Any]) -> dict[str, Any]:
    dps = run["dps"]
    return {
        "label": run["label"],
        "parameters": {
            "dps": dps,
            "step_denominator": run["step_denominator"],
            "step": f"1/{run['step_denominator']}",
            "theta_orbits": run["theta_orbits"],
            "double_exponential_t_extent": (
                f"[-{mp_text(run['t_extent'], dps)},"
                f"{mp_text(run['t_extent'], dps)}]"
            ),
            "t_extent": mp_text(run["t_extent"], dps),
            "h_cutoff": mp_text(run["h_cutoff"], dps),
            "spatial_domain": f"0<h<{mp_text(run['h_cutoff'], dps)}",
            "quadrature_nodes_used": run["nodes"],
            "sign_tolerance": mp_text(run["sign_tolerance"], dps),
            "algebra_tolerance": mp_text(run["algebra_tolerance"], dps),
        },
        "raw_components": {
            "H_dot": matrix_text(run["raw_gram_derivative"], dps),
            "u_dot": vector_text(run["u_derivative"], dps),
            "gamma_dot": mp_text(run["gamma_derivative"], dps),
            "u": vector_text(run["u"], dps),
            "gamma": mp_text(run["gamma"], dps),
            "e_normalized": vector_text(run["e"], dps),
            "d_normalized": vector_text(run["d"], dps),
            "v_normalized": vector_text(run["v"], dps),
        },
        "M0": matrix_text(run["m0"], dps),
        "M0_from_direct_signed_square": matrix_text(
            run["direct_signed_square_m0"], dps
        ),
        "corrected_derivative_from_quadrature": matrix_text(
            run["corrected_derivative"], dps
        ),
        "corrected_derivative_from_archived_moments": matrix_text(
            run["target_derivative"], dps
        ),
        "metrics": {
            name: mp_text(value, dps) for name, value in run["metrics"].items()
        },
        "cutoff_diagnostics_are_not_bounds": True,
        "checks": run["checks"],
        "inertia_by_prefix": [
            serialize_inertia_row(row, dps) for row in run["inertia"]
        ],
        "elapsed_seconds": run["elapsed_seconds"],
    }


def serialize_comparison(comparison: dict[str, Any], dps: int) -> dict[str, Any]:
    scalar_names = (
        "m0_matrix_max_abs_difference",
        "m0_matrix_relative_difference",
        "minimum_eigen_margin_over_numeric_discrepancy",
        "minimum_gate_margin_over_numeric_discrepancy",
    )
    return {
        **{name: mp_text(comparison[name], dps) for name in scalar_names},
        "required_minimum_margin_ratio": mp_text(MIN_STABILITY_MARGIN_RATIO, dps),
        "all_inertias_agree": comparison["all_inertias_agree"],
        "all_old_target_gate_signs_agree": comparison[
            "all_old_target_gate_signs_agree"
        ],
        "all_eigenvalue_margin_gates_pass": comparison[
            "all_eigenvalue_margin_gates_pass"
        ],
        "all_old_target_gate_margin_gates_pass": comparison[
            "all_old_target_gate_margin_gates_pass"
        ],
        "rows": [
            {
                "degree": row["degree"],
                **{
                    name: mp_text(row[name], dps)
                    for name in (
                        "ordinary_eigenvalue_max_abs_difference",
                        "parent_whitened_eigenvalue_max_abs_difference",
                        "smallest_eigenvalue_abs_margin",
                        "eigen_margin_over_numeric_discrepancy",
                        "old_target_gate_margin_abs_difference",
                        "smallest_old_target_gate_abs_margin",
                        "gate_margin_over_numeric_discrepancy",
                    )
                },
                "inertias_agree": row["inertias_agree"],
                "old_target_gate_signs_agree": row[
                    "old_target_gate_signs_agree"
                ],
                "eigen_margin_gate_passes": row["eigen_margin_gate_passes"],
                "old_target_gate_margin_gate_passes": row[
                    "old_target_gate_margin_gate_passes"
                ],
            }
            for row in comparison["rows"]
        ],
    }


def run_probe(
    *,
    egf_source: Path = DEFAULT_EGF_SOURCE,
    egf_manifest: Path = DEFAULT_EGF_MANIFEST,
    parent_interval: Path = DEFAULT_PARENT_INTERVAL,
    target_moments: Path = DEFAULT_TARGET_MOMENTS,
    endpoint_certificate: Path = DEFAULT_ENDPOINT_CERTIFICATE,
    primary_dps: int = 100,
    primary_step_denominator: int = 128,
    primary_orbits: int = 12,
    primary_h_cutoff: str = "3",
    primary_t_extent: str = "4",
    replay_dps: int = 160,
    replay_step_denominator: int = 256,
    replay_orbits: int = 16,
    replay_h_cutoff: str = "4",
    replay_t_extent: str = "5",
    max_seconds_per_run: int = 120,
    progress_enabled: bool = False,
) -> dict[str, Any]:
    if replay_dps <= primary_dps:
        raise ValueError("replay dps must exceed primary dps")
    if replay_step_denominator <= primary_step_denominator:
        raise ValueError("replay step denominator must exceed primary step denominator")
    if replay_orbits <= primary_orbits:
        raise ValueError("replay orbit cutoff must exceed primary orbit cutoff")
    if mp.mpf(replay_h_cutoff) <= mp.mpf(primary_h_cutoff):
        raise ValueError("replay h cutoff must exceed primary h cutoff")
    if mp.mpf(replay_t_extent) <= mp.mpf(primary_t_extent):
        raise ValueError("replay t extent must exceed primary t extent")
    if Path(sys.executable).resolve() != REQUIRED_PYTHON.resolve():
        raise RuntimeError(
            "M0 worker must run with the bound Arb virtualenv Python: "
            f"{REQUIRED_PYTHON}"
        )

    worker_sha256_at_start = file_sha256(SOURCE_PATH)

    inputs = prepare_inputs(
        egf_source=egf_source,
        egf_manifest=egf_manifest,
        parent_interval=parent_interval,
        target_moments=target_moments,
        endpoint_certificate=endpoint_certificate,
        dps=replay_dps,
    )
    primary = compute_numeric_run(
        inputs,
        label="primary",
        dps=primary_dps,
        step_denominator=primary_step_denominator,
        theta_orbits=primary_orbits,
        h_cutoff=primary_h_cutoff,
        t_extent=primary_t_extent,
        max_seconds=max_seconds_per_run,
        progress_enabled=progress_enabled,
    )
    replay = compute_numeric_run(
        inputs,
        label="replay",
        dps=replay_dps,
        step_denominator=replay_step_denominator,
        theta_orbits=replay_orbits,
        h_cutoff=replay_h_cutoff,
        t_extent=replay_t_extent,
        max_seconds=max_seconds_per_run,
        progress_enabled=progress_enabled,
    )
    comparison = compare_runs(primary, replay)
    worker_sha256_at_end = file_sha256(SOURCE_PATH)
    aggregate_checks = {
        **inputs["exact_checks"],
        "primary_numeric_reconstruction_passes": primary["checks"][
            "all_numeric_reconstruction_checks_passed"
        ],
        "replay_numeric_reconstruction_passes": replay["checks"][
            "all_numeric_reconstruction_checks_passed"
        ],
        "primary_replay_inertias_agree": comparison["all_inertias_agree"],
        "primary_replay_old_target_gate_signs_agree": comparison[
            "all_old_target_gate_signs_agree"
        ],
        "eigenvalue_margins_dominate_primary_replay_discrepancy": comparison[
            "all_eigenvalue_margin_gates_pass"
        ],
        "old_target_gate_margins_dominate_primary_replay_discrepancy": comparison[
            "all_old_target_gate_margin_gates_pass"
        ],
        "primary_and_replay_use_different_spatial_cutoffs": (
            primary["h_cutoff"] != replay["h_cutoff"]
        ),
        "primary_and_replay_use_different_t_extents": (
            primary["t_extent"] != replay["t_extent"]
        ),
        "worker_source_unchanged_during_run": (
            worker_sha256_at_start == worker_sha256_at_end
        ),
    }
    aggregate_checks["all_checks_passed"] = all(aggregate_checks.values())
    if not aggregate_checks["all_checks_passed"]:
        failed = [name for name, passed in aggregate_checks.items() if not passed]
        raise ArithmeticError(f"M0 primary/replay hard gate failed: {failed}")

    certified_rows = [
        row for row in replay["inertia"] if row["degree"] in CERTIFIED_ENDPOINT_DEGREES
    ]
    max_negative = max(
        row["parent_whitened_inertia"]["negative"] for row in certified_rows
    )
    first_two_negative = next(
        (
            row["degree"]
            for row in certified_rows
            if row["parent_whitened_inertia"]["negative"] >= 2
        ),
        None,
    )
    all_positive = all(
        row["parent_whitened_inertia"]
        == {"negative": 0, "zero": 0, "positive": row["prefix_size"]}
        for row in certified_rows
    )
    if first_two_negative is None:
        conclusion = (
            "No archived-prefix counterexample to n_-(M0)<=1 was found by this "
            "floating cutoff diagnostic. This finite observation does not establish "
            "M0>=0 or any all-degree inertia bound."
        )
    else:
        conclusion = (
            f"The floating reconstruction has at least two negative directions by "
            f"the archived degree-{first_two_negative} prefix, which falsifies the "
            "proposed all-degree n_-(M0)<=1 route if the formulas and non-interval "
            "numerics are independently confirmed."
        )

    paths: dict[str, Path] = inputs["paths"]
    return {
        "schema_version": SCHEMA_VERSION,
        "status": STATUS,
        "mode": MODE,
        "parameters": {
            "primary": {
                "dps": primary_dps,
                "step_denominator": primary_step_denominator,
                "theta_orbits": primary_orbits,
                "h_cutoff": str(primary_h_cutoff),
                "t_extent": str(primary_t_extent),
            },
            "replay": {
                "dps": replay_dps,
                "step_denominator": replay_step_denominator,
                "theta_orbits": replay_orbits,
                "h_cutoff": str(replay_h_cutoff),
                "t_extent": str(replay_t_extent),
            },
        },
        "scope": (
            "SHA-bound high-precision floating cutoff reconstruction of M0 only on "
            "the already archived original-theta odd endpoint ladder through degree "
            "19. Archived intervals retain their original claims; the new raw "
            "pieces, eigenvalues, inertias, cutoff checks, and orbit checks are not "
            "interval certificates. This is not degree escalation, an all-degree "
            "theorem, or an RH proof."
        ),
        "input_bindings": {
            name: {
                "path_relative_to_workstream": relative_label(path),
                "sha256": inputs["observed_hashes"][name],
                "expected_sha256": EXPECTED_SHA256[name],
            }
            for name, path in paths.items()
        },
        "exact_formula_audit": {
            "theta_derivative_egf": EXPECTED_FORMULAS["P"],
            "residue_egf_C": EXPECTED_FORMULAS["C"],
            "raw_corrected_interface": EXPECTED_INTERFACE,
            "naming": (
                "F_j=psi^(j) is corrected; raw Psi_j=F_j+e_j*chi, so "
                "F_j=Psi_j-e_j*chi"
            ),
            "residue_coefficients": "e_j=-c_j from -C(t)",
            "residue_drift_coefficients": "d_j=j*e_(j-1) from -t*C(t)",
            "chi": "sum_(n>=1) 4*z_n*exp(h/2-z_n), z_n=pi*n^2*exp(2h)",
            "raw_feature_drift": "Psi_dot_j=j*psi^(j-1)+d_j*chi",
            "M0_raw": "Hdot-udot*e^T-e*udot^T+gammadot*e*e^T",
            "M0_signed_square": (
                "1/2 integral_dh (X0^T X0-Y0^T Y0), "
                "X0_j=2hF_j+Psi_dot_j, Y0_j=Psi_dot_j"
            ),
            "target_derivative": "M0-v*d^T-d*v^T, v=u-gamma*e",
            "old_target_gate": (
                "M0=A+v*d^T+d*v^T is PSD iff sqrt(V*D)-C<=1, "
                "V=v^T A^-1 v, D=d^T A^-1 d, C=v^T A^-1 d"
            ),
            "exact_odd_e": [
                fraction_text(inputs["e_coefficients"][degree])
                for degree in ODD_DEGREES
            ],
            "exact_odd_d": [
                fraction_text(inputs["d_coefficients"][degree])
                for degree in ODD_DEGREES
            ],
        },
        "normalization_audit": {
            "odd_degrees": list(ODD_DEGREES),
            "archived_certified_endpoint_degrees": list(CERTIFIED_ENDPOINT_DEGREES),
            "scales_verbatim_fixed_decimals": list(
                inputs["documents"]["parent_interval"]["scales"]
            ),
            "ordinary_inertia": "eigenvalues in the archived normalized odd basis",
            "scale_invariant_inertia": (
                "eigenvalues after LDL whitening by the archived positive-parent "
                "midpoint; generalized eigenvalues of (M0,G0)"
            ),
            "old_target_gate_metric": (
                "The gate uses inverses of midpoint actual-target derivative blocks "
                "from the archived target moments, not the positive-parent G0 used "
                "for whitening. Gate values and margins are not interval-certified."
            ),
            "replay_independence": (
                "Primary and replay use the same implementation with materially "
                "different precision, quadrature step, orbit cutoff, spatial cutoff, "
                "and DE t-extent. This is a parameter replay, not an independent "
                "algorithm."
            ),
            "measure_audit": (
                "Hdot, udot, gammadot use h*dh; the X0/Y0 signed-square norms "
                "use ordinary dh, with h already inside X0"
            ),
            "tail_status": (
                "Primary/replay deliberately vary h cutoff, DE t-extent, orbit "
                "cutoff, step, and precision. Last-term diagnostics are stabilization "
                "evidence only; no new spatial-tail or orbit-tail certificate is "
                "claimed."
            ),
        },
        "checks": aggregate_checks,
        "primary": serialize_numeric_run(primary),
        "replay": serialize_numeric_run(replay),
        "primary_replay": serialize_comparison(comparison, replay_dps),
        "outcome": {
            "maximum_negative_directions_on_certified_prefixes": max_negative,
            "first_certified_prefix_with_at_least_two_negative_directions": (
                first_two_negative
            ),
            "all_certified_prefixes_positive_in_this_floating_reconstruction": (
                all_positive
            ),
            "floating_reconstruction_has_at_least_two_negative_directions_on_known_prefix": (
                first_two_negative is not None
            ),
            "conclusion": conclusion,
        },
        "provenance": {
            "source_sha256": worker_sha256_at_end,
            "source_sha256_at_start": worker_sha256_at_start,
            "source_sha256_at_end": worker_sha256_at_end,
            "python_executable": sys.executable,
            "required_python_executable": str(REQUIRED_PYTHON),
            "python": platform.python_version(),
            "mpmath": mp.__version__,
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
    parser.add_argument("--egf-source", type=Path, default=DEFAULT_EGF_SOURCE)
    parser.add_argument("--egf-manifest", type=Path, default=DEFAULT_EGF_MANIFEST)
    parser.add_argument("--parent-interval", type=Path, default=DEFAULT_PARENT_INTERVAL)
    parser.add_argument("--target-moments", type=Path, default=DEFAULT_TARGET_MOMENTS)
    parser.add_argument(
        "--endpoint-certificate", type=Path, default=DEFAULT_ENDPOINT_CERTIFICATE
    )
    parser.add_argument("--primary-dps", type=int, default=100)
    parser.add_argument("--primary-step-denominator", type=int, default=128)
    parser.add_argument("--primary-orbits", type=int, default=12)
    parser.add_argument("--primary-h-cutoff", default="3")
    parser.add_argument("--primary-t-extent", default="4")
    parser.add_argument("--replay-dps", type=int, default=160)
    parser.add_argument("--replay-step-denominator", type=int, default=256)
    parser.add_argument("--replay-orbits", type=int, default=16)
    parser.add_argument("--replay-h-cutoff", default="4")
    parser.add_argument("--replay-t-extent", default="5")
    parser.add_argument("--max-seconds-per-run", type=int, default=120)
    parser.add_argument(
        "--max-output-bytes", type=int, default=HARD_MAX_OUTPUT_BYTES
    )
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--progress", action="store_true")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    payload = run_probe(
        egf_source=args.egf_source,
        egf_manifest=args.egf_manifest,
        parent_interval=args.parent_interval,
        target_moments=args.target_moments,
        endpoint_certificate=args.endpoint_certificate,
        primary_dps=args.primary_dps,
        primary_step_denominator=args.primary_step_denominator,
        primary_orbits=args.primary_orbits,
        primary_h_cutoff=args.primary_h_cutoff,
        primary_t_extent=args.primary_t_extent,
        replay_dps=args.replay_dps,
        replay_step_denominator=args.replay_step_denominator,
        replay_orbits=args.replay_orbits,
        replay_h_cutoff=args.replay_h_cutoff,
        replay_t_extent=args.replay_t_extent,
        max_seconds_per_run=args.max_seconds_per_run,
        progress_enabled=args.progress,
    )
    atomic_write_json(args.output, payload, args.max_output_bytes)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
