#!/usr/bin/env python3
"""Produce the Mellin/soft-symbol/graph-spill/odd-obstruction certificate.

The payload combines exact rational regression fixtures with outward
``mpmath.iv`` formula probes.  It proves no actual central graph-spill rate,
exterior alignment, odd reserve, signed sector floor, equation-(5.2)
estimate, determinant limit, or Riemann-hypothesis conclusion.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from math import comb
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-mellin-projection-soft-symbol-graph-spill-v1"
LOCK = "MELLIN_PROJECTION_SOFT_SYMBOL_GRAPH_SPILL_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-mellin-projection-soft-symbol-graph-spill-source-lock-v1"
CLAIM_CLASS = (
    "MELLIN_PROJECTION_SOFT_SYMBOL_GRAPH_SPILL_"
    "ODD_HARMONIC_OBSTRUCTION_REDUCTION"
)
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
EXPECTED_MPMATH_VERSION = "1.4.1"
EXPECTED_LIBRARY = f"mpmath.iv {EXPECTED_MPMATH_VERSION}"

CANONICAL_LAMBDA_NUMERATORS = {5, 9}
CANONICAL_DPS = {80, 160}

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_POSITIVE_INTEGER_TEXT = re.compile(r"^[1-9][0-9]*$")
LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 18

EXPECTED_DEPENDENCIES = {
    "DIRECT_RH_ATTACK.md",
    "P0_SOURCE_LOCK.json",
    "P0_MATRIX_FORMULAS.md",
    "P0_NORMALIZATION_AUDIT.md",
    "PROJECTED_STATE_NORM_SOURCE_LOCK.json",
    "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md",
    "notes/PROJECTION_RATE_THEOREM.md",
    "WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_SOURCE_LOCK.json",
    "notes/WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_REDUCTION.md",
    "P3_SOURCE_LOCK.json",
    "ZERO_SAMPLING_SOURCE_LOCK.json",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "vendor/FKS-PNT-2204.02588v3.pdf",
    "vendor/HSW-ZC-2107.06506v1.pdf",
    "notes/MELLIN_PROJECTION_SOFT_SYMBOL_REDUCTION.md",
    "notes/ODD_POLE_HARMONIC_CHEBYSHEV_OBSTRUCTION.md",
    "requirements.txt",
}

EXPECTED_EXTERNAL_SOURCES = {
    "CCM-ZST-v1": {
        "version": "arXiv:2511.22755v1",
        "vendored_path": "vendor/CCM-ZST-2511.22755v1.pdf",
        "sha256": "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
        "use": "source-normalized h, arithmetic transform, finite Weil convention, and printed factor-four erratum",
    },
    "CCM-PROLATE-2023": {
        "version": "arXiv:2310.18423v2",
        "vendored_path": "vendor/CCM-PROLATE-2310.18423v2.pdf",
        "sha256": "8bc197642ee9ca4f2393b6cbfd3db292be6a315ce76ad61bfb845d9fedb47f2e",
        "use": "fixed-index source-normalized prolate comparison",
    },
    "FKS-PNT-v3": {
        "version": "arXiv:2204.02588v3",
        "vendored_path": "vendor/FKS-PNT-2204.02588v3.pdf",
        "sha256": "15eff02042f2c1ab4878d029ce52a0abd6c95d66995b183a2dbc689ce9af49a4",
        "use": "published unconditional Chebyshev-function error bound",
    },
    "HSW-ZC-v1": {
        "version": "arXiv:2107.06506v1",
        "vendored_path": "vendor/HSW-ZC-2107.06506v1.pdf",
        "sha256": "3fc4c89f49249924e61cb0d289d81559faed53fcbb838628ea32dc7ec6f89fbf",
        "use": "global zero-count growth and local nontrivial-zero existence; no decimal zero list is read",
    },
}

SOURCE_ADMISSIONS = {
    "actual_central_graph_spill_rate_claimed": False,
    "actual_exterior_alignment_claimed": False,
    "actual_odd_reserve_claimed": False,
    "api_key_read": False,
    "binary64_parameters_used": False,
    "cached_matrix_or_eigenvector_read": False,
    "combined_block_cancellation_discarded": False,
    "component_geometry_promoted_to_alignment": False,
    "decimal_zero_list_read": False,
    "determinant_limit_claimed": False,
    "effective_delta_constant_claimed": False,
    "environment_secret_read": False,
    "equation_5_2_claimed": False,
    "fixed_moments_promoted_to_exact_sign": False,
    "global_weil_positivity_assumed": False,
    "graph_equation_without_spill_promoted": False,
    "gray_mass_dropped": False,
    "input_cap_bypassed": False,
    "inversion_reflection_dropped": False,
    "lambda_squared_mixed_with_lambda": False,
    "layer_average_promoted_to_soft_transition": False,
    "mellin_projection_promoted_to_signed_floor": False,
    "nonpositive_complementary_gap_reported_as_pass": False,
    "prime_block_sign_changed": False,
    "prime_power_endpoint_omitted": False,
    "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence": False,
    "riemann_hypothesis_assumed_or_claimed": False,
    "secret_serialized": False,
    "smoothed_chebyshev_little_oh_assumed": False,
    "unit_source_normalization_substituted": False,
    "zeros_assumed_on_critical_line": False,
}

ARITHMETIC_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", EXPECTED_LIBRARY],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "every nondegenerate interval is enlarged to a precision-scaled dyadic enclosure",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and the pinned mpmath.iv transcendental runtime",
}

Matrix = list[list[Fraction]]
Vector = list[Fraction]
Polynomial = dict[tuple[int, int], Fraction]


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _canonical_choice_text(value: Any, label: str, allowed: set[int]) -> tuple[str, int]:
    if not isinstance(value, str) or _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise TypeError(f"{label} must be canonical positive integer text")
    if value not in {str(item) for item in allowed}:
        choices = ", ".join(str(item) for item in sorted(allowed))
        raise ValueError(f"{label} must be one of {{{choices}}}")
    return value, int(value)


def _validate_runtime() -> None:
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise RuntimeError(
            "mpmath runtime mismatch: "
            f"expected {EXPECTED_MPMATH_VERSION}, got {getattr(mp, '__version__', None)!r}"
        )


def _validated_source_lock() -> tuple[dict[str, Any], dict[str, Any]]:
    path = _root() / LOCK
    lock = json.loads(path.read_text(encoding="utf-8"))
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary", "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ValueError("source-lock inventory mismatch")
    if (
        lock["schema"] != LOCK_SCHEMA
        or lock["claim_class"] != CLAIM_CLASS
        or lock["terminal_state"] != TERMINAL_STATE
        or lock["updated_date"] != UPDATED_DATE
        or lock["source_admissions"] != SOURCE_ADMISSIONS
    ):
        raise ValueError("source-lock fixed metadata mutation")
    if not isinstance(lock["locked_conventions"], dict) or not lock["locked_conventions"]:
        raise ValueError("locked conventions missing")
    if not isinstance(lock["locked_formulas"], dict) or not lock["locked_formulas"]:
        raise ValueError("locked formulas missing")
    boundary = lock["claim_boundary"]
    if (
        not isinstance(boundary, dict)
        or set(boundary) != {"proved", "not_proved"}
        or not isinstance(boundary["proved"], list)
        or not isinstance(boundary["not_proved"], list)
    ):
        raise ValueError("source-lock claim boundary malformed")

    found: dict[str, str] = {}
    for item in lock["dependencies"]:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        candidate = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str)
            or not relative
            or candidate.is_absolute()
            or ".." in candidate.parts
            or relative in found
            or not isinstance(expected, str)
            or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str)
            or not role
        ):
            raise ValueError("invalid source-lock dependency")
        if _sha256(_root() / candidate) != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        found[relative] = expected
    if set(found) != EXPECTED_DEPENDENCIES or len(found) != 18:
        raise ValueError("source-lock dependency path inventory mismatch")

    external_hashes: dict[str, str] = {}
    seen_ids: set[str] = set()
    for item in lock["external_sources"]:
        if not isinstance(item, dict) or set(item) != {
            "id", "version", "vendored_path", "sha256", "use"
        }:
            raise ValueError("malformed external-source lock")
        source_id = item["id"]
        if source_id in seen_ids or source_id not in EXPECTED_EXTERNAL_SOURCES:
            raise ValueError("external-source identifier mismatch")
        expected_item = EXPECTED_EXTERNAL_SOURCES[source_id]
        if any(item[key] != expected_item[key] for key in expected_item):
            raise ValueError(f"external-source metadata mismatch: {source_id}")
        vendored = _root() / item["vendored_path"]
        actual = _sha256(vendored)
        if actual != item["sha256"] or found.get(item["vendored_path"]) != actual:
            raise ValueError(f"external-source hash mismatch: {source_id}")
        seen_ids.add(source_id)
        external_hashes[item["vendored_path"]] = actual
    if seen_ids != set(EXPECTED_EXTERNAL_SOURCES) or len(seen_ids) != 4:
        raise ValueError("external-source inventory mismatch")

    return {
        "path": LOCK,
        "sha256": _sha256(path),
        "schema": LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(found.items())),
        "external_source_hashes": dict(sorted(external_hashes.items())),
    }, lock


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return {"numerator": str(value.numerator), "denominator": str(value.denominator)}
    if isinstance(value, (list, tuple)):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    return value


def _assert_strict_json(value: Any) -> None:
    if isinstance(value, float):
        raise TypeError("binary floating-point value reached JSON serialization")
    if value is None or type(value) in (bool, int, str):
        return
    if isinstance(value, list):
        for item in value:
            _assert_strict_json(item)
        return
    if isinstance(value, dict):
        if any(not isinstance(key, str) for key in value):
            raise TypeError("JSON object keys must be strings")
        for item in value.values():
            _assert_strict_json(item)
        return
    raise TypeError(f"unsupported JSON value type: {type(value).__name__}")


def _diag(values: Vector) -> Matrix:
    return [[value if i == j else Fraction(0) for j in range(len(values))]
            for i, value in enumerate(values)]


def _eye(size: int) -> Matrix:
    return _diag([Fraction(1) for _ in range(size)])


def _transpose(matrix: Matrix) -> Matrix:
    return [list(column) for column in zip(*matrix)]


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    if not left or not right or len(left[0]) != len(right):
        raise ValueError("matrix dimension mismatch")
    return [[sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction(0))
             for j in range(len(right[0]))] for i in range(len(left))]


def _sub(left: Matrix, right: Matrix) -> Matrix:
    return [[a - b for a, b in zip(lrow, rrow)] for lrow, rrow in zip(left, right)]


def _trace(matrix: Matrix) -> Fraction:
    return sum((matrix[i][i] for i in range(len(matrix))), Fraction(0))


def _hs_squared(matrix: Matrix) -> Fraction:
    return sum((entry * entry for row in matrix for entry in row), Fraction(0))


def _poly_apply_half_plus_D(poly: Polynomial) -> Polynomial:
    result: Polynomial = {}
    for (x_power, pi_power), coefficient in poly.items():
        same = coefficient * (Fraction(1, 2) + x_power)
        result[(x_power, pi_power)] = result.get((x_power, pi_power), Fraction(0)) + same
        raised = -2 * coefficient
        key = (x_power + 2, pi_power + 1)
        result[key] = result.get(key, Fraction(0)) + raised
    return {key: value for key, value in result.items() if value}


def _poly_terms(poly: Polynomial) -> list[dict[str, Any]]:
    return [{"x_power": x, "pi_power": p, "coefficient": poly[(x, p)]}
            for x, p in sorted(poly, reverse=True)]


def _normalization_and_derivative_fixture() -> dict[str, Any]:
    h = {(4, 2): Fraction(1), (2, 1): Fraction(-3, 2)}
    first_expected = {
        (6, 3): Fraction(-2), (4, 2): Fraction(15, 2),
        (2, 1): Fraction(-15, 4),
    }
    second_expected = {
        (8, 4): Fraction(4), (6, 3): Fraction(-28),
        (4, 2): Fraction(165, 4), (2, 1): Fraction(-75, 8),
    }
    first = _poly_apply_half_plus_D(h)
    second = _poly_apply_half_plus_D(first)
    if first != first_expected or second != second_expected:
        raise ValueError("source derivative polynomial regression failed")
    return {
        "source_normalization": "source-fixed h_lambda tends to h; no unit normalization",
        "xi_transform_scalar": Fraction(1, 4),
        "unit_norm_limiting_scalar_rejected": True,
        "h_polynomial": _poly_terms(h),
        "first_log_derivative_polynomial": _poly_terms(first),
        "second_log_derivative_polynomial": _poly_terms(second),
        "derivatives_reconstructed": True,
    }


def _soft_symbol_fixture() -> dict[str, Any]:
    measure_weights = [Fraction(1), Fraction(1)]
    kernel = [[Fraction(1, 2), Fraction(1, 2)],
              [Fraction(1, 2), Fraction(1, 2)]]
    a = [Fraction(1, 4), Fraction(3, 4)]
    d = [Fraction(1), Fraction(3)]
    amplitude = Fraction(4)
    c_scalar = sum((a[i] * kernel[i][i] for i in range(2)), Fraction(0))
    chi = c_scalar - c_scalar * c_scalar
    gray = sum((a[i] * (1 - a[i]) * kernel[i][i] for i in range(2)), Fraction(0))
    difference = Fraction(1, 2) * sum(
        ((a[i] - a[j]) ** 2 * kernel[i][j] ** 2 for i in range(2) for j in range(2)),
        Fraction(0),
    )
    layer_left = Fraction(0)
    endpoints = [Fraction(0), Fraction(1), Fraction(3), Fraction(4)]
    for lo, hi in zip(endpoints, endpoints[1:]):
        midpoint = (lo + hi) / 2
        c_layer = sum((kernel[i][i] for i in range(2) if d[i] > midpoint), Fraction(0))
        layer_left += (hi - lo) * (c_layer - c_layer * c_layer)
    layer_right = Fraction(1, 2) * sum(
        (abs(d[i] - d[j]) * kernel[i][j] ** 2 for i in range(2) for j in range(2)),
        Fraction(0),
    )
    if (c_scalar, chi, gray, difference, layer_left, layer_right) != (
        Fraction(1, 2), Fraction(1, 4), Fraction(3, 16), Fraction(1, 16),
        Fraction(1, 2), Fraction(1, 2),
    ):
        raise ValueError("soft-symbol exact fixture failed")
    return {
        "measure_weights": measure_weights,
        "R_X": kernel,
        "a": a,
        "d": d,
        "A": amplitude,
        "C_X": [[c_scalar]],
        "p_X": c_scalar,
        "chi_X": chi,
        "gray_term": gray,
        "difference_term": difference,
        "soft_identity_rhs": gray + difference,
        "soft_identity_exact": chi == gray + difference,
        "layer_average_left": layer_left,
        "layer_average_right": layer_right,
        "layer_identity_exact": layer_left == layer_right,
    }


def _effective_tail_and_bv_fixture() -> dict[str, Any]:
    eigenvalues = [Fraction(9, 10), Fraction(1, 2), Fraction(1, 10)]
    sigma = Fraction(1, 2)
    p_x = sum(eigenvalues, Fraction(0))
    chi = sum((value * (1 - value) for value in eigenvalues), Fraction(0))
    r_sigma = sum(value > sigma for value in eigenvalues)
    count_bound = p_x + chi / sigma
    k_floor = count_bound.numerator // count_bound.denominator
    low_tail = sum((value for value in eigenvalues if value <= sigma), Fraction(0))
    low_bound = chi / (1 - sigma)
    tail_after_k = sum(eigenvalues[k_floor:], Fraction(0))
    if (
        p_x != Fraction(3, 2) or chi != Fraction(43, 100) or r_sigma != 1
        or count_bound != Fraction(59, 25) or k_floor != 2
        or low_tail != Fraction(3, 5) or low_bound != Fraction(43, 50)
        or tail_after_k != Fraction(1, 10)
    ):
        raise ValueError("effective-tail fixture failed")
    return {
        "eigenvalues": eigenvalues,
        "sigma": sigma,
        "p_X": p_x,
        "chi_X": chi,
        "r_sigma_open": r_sigma,
        "p_plus_chi_over_sigma": count_bound,
        "k_floor": k_floor,
        "low_tail_including_endpoint": low_tail,
        "chi_over_one_minus_sigma": low_bound,
        "tail_after_k": tail_after_k,
        "endpoint_retained_low": eigenvalues[1] == sigma,
        "effective_count_holds": r_sigma <= count_bound,
        "effective_tail_holds": low_tail <= low_bound,
        "bv_piecewise_oracles": {
            "low": {"L": Fraction(2), "M": Fraction(1), "V": Fraction(4),
                    "z": Fraction(1, 2), "factor": Fraction(7, 8)},
            "junction": {"z": Fraction(1), "low_factor": Fraction(3, 2),
                         "high_factor_without_log_1": Fraction(3, 2),
                         "branches_meet": True},
            "high": {"L": Fraction(2), "M": Fraction(4), "V": Fraction(4),
                     "z": Fraction(2), "factor_formula": "3/2+log(2)"},
        },
    }


def _graph_spill_fixture() -> dict[str, Any]:
    u = _eye(2)
    t_band = _diag([Fraction(1, 4), Fraction(1, 16)])
    d_matrix = [row[:] for row in t_band]
    d_sqrt = _diag([Fraction(1, 2), Fraction(1, 4)])
    w = [[Fraction(1)], [Fraction(1)]]
    y = [[Fraction(1), Fraction(0)]]
    p_m = _diag([Fraction(1), Fraction(0)])
    p_n = _eye(2)
    p_h = [[Fraction(1, 2), Fraction(-1, 2)],
           [Fraction(-1, 2), Fraction(1, 2)]]
    wy = _matmul(w, y)
    low_left = _matmul(p_m, wy)
    low_right = _matmul(p_m, u)
    shell = _matmul(_matmul(_sub(p_n, p_m), u), d_sqrt)
    spill = _matmul(_matmul(_sub(p_n, p_m), wy), d_sqrt)
    rho = _trace(_matmul(d_matrix, p_h))
    shell_squared = _hs_squared(shell)
    gamma_squared = _hs_squared(spill)
    triangle_bound_holds = rho <= (
        shell_squared + gamma_squared
        + 2 * Fraction(1, 4) * Fraction(1, 2)
    )
    if (
        low_left != low_right or shell_squared != Fraction(1, 16)
        or gamma_squared != Fraction(1, 4) or rho != Fraction(5, 32)
        or not triangle_bound_holds
    ):
        raise ValueError("graph-spill fixture failed")
    return {
        "U": u,
        "T_B": t_band,
        "D": d_matrix,
        "D_sqrt": d_sqrt,
        "W": w,
        "Y": y,
        "P_M": p_m,
        "P_N": p_n,
        "P_H": p_h,
        "low_graph_left": low_left,
        "low_graph_right": low_right,
        "low_graph_equation_exact": low_left == low_right,
        "weighted_U_shell_squared": shell_squared,
        "Gamma_squared": gamma_squared,
        "rho_B": rho,
        "triangle_bound_holds": triangle_bound_holds,
        "bad_spill_countermodel": {
            "rho_B": rho,
            "graph_without_spill_bound_squared": shell_squared,
            "omission_fails": rho > shell_squared,
        },
    }


def _dot(left: Vector, right: Vector) -> Fraction:
    return sum((a * b for a, b in zip(left, right)), Fraction(0))


def _odd_harmonic_moment_fixture() -> dict[str, Any]:
    h = Fraction(1)
    q = Fraction(3)
    b = q - h

    # Harmonic-short equality in the pole direction e=(3/5,4/5).
    m_matrix = _diag([h, q])
    e = [Fraction(3, 5), Fraction(4, 5)]
    e_perp = [Fraction(-4, 5), Fraction(3, 5)]
    mu = Fraction(3, 4)
    pole_spectral_weights = [mu * value * value for value in e]
    load = 2 * (
        pole_spectral_weights[0] / h + pole_spectral_weights[1] / q
    )
    me = [h * e[0], q * e[1]]
    a_entry = _dot(e, me)
    c_entry = _dot(e_perp, me)
    d_entry = h * e_perp[0] ** 2 + q * e_perp[1] ** 2
    short_direct = a_entry - 2 * mu - c_entry**2 / d_entry
    short_from_load = 2 * mu * (1 / load - 1)
    if (
        load != Fraction(43, 50)
        or short_direct != Fraction(21, 86)
        or short_from_load != short_direct
    ):
        raise ValueError("odd harmonic-short fixture failed")

    # Exact monotone remainder hierarchy on the three-point Y spectrum.
    y_spectrum = [Fraction(0), Fraction(1), Fraction(2)]
    spectral_weights = [Fraction(1, 6), Fraction(1, 3), Fraction(1, 2)]
    moment_mu = sum(spectral_weights, Fraction(0))
    d_1 = _dot(spectral_weights, y_spectrum)
    exact_load = 2 * sum(
        (weight / (h + y) for weight, y in zip(spectral_weights, y_spectrum)),
        Fraction(0),
    )
    k_values = [0, 1, 2, 3]
    upper_bounds: list[Fraction] = []
    remainder_exact: list[Fraction] = []
    remainder_formula: list[Fraction] = []
    for order in k_values:
        correction = Fraction(0)
        for j in range(1, order + 1):
            zeta_j = sum(
                (weight * y * (b - y) ** j
                 for weight, y in zip(spectral_weights, y_spectrum)),
                Fraction(0),
            )
            correction += zeta_j / (h * q ** (j + 1))
        upper = 2 * (moment_mu / h - d_1 / (h * q) - correction)
        formula = Fraction(2, h * q ** (order + 1)) * sum(
            (weight * y * (b - y) ** (order + 1) / (h + y)
             for weight, y in zip(spectral_weights, y_spectrum)),
            Fraction(0),
        )
        upper_bounds.append(upper)
        remainder_exact.append(upper - exact_load)
        remainder_formula.append(formula)
    if (
        exact_load != 1
        or upper_bounds != [Fraction(10, 9), Fraction(28, 27),
                            Fraction(82, 81), Fraction(244, 243)]
        or remainder_exact != [Fraction(1, 9), Fraction(1, 27),
                               Fraction(1, 81), Fraction(1, 243)]
        or remainder_formula != remainder_exact
    ):
        raise ValueError("odd monotone-remainder fixture failed")

    # Edge localization.  The computable upper bound deliberately uses the
    # polynomial majorant, not the smaller exact open-edge mass.
    tau = Fraction(1)
    edge_order = 2
    r_spectrum = [b - y for y in y_spectrum]
    open_edge_mass = sum(
        (weight for weight, y in zip(spectral_weights, y_spectrum) if y < tau),
        Fraction(0),
    )
    power_moment = sum(
        (weight * r**edge_order for weight, r in zip(spectral_weights, r_spectrum)),
        Fraction(0),
    )
    power_bound = power_moment / (b - tau) ** edge_order
    chebyshev_squared = Fraction(0)
    for weight, r_value in zip(spectral_weights, r_spectrum):
        mapped = 2 * r_value / (b - tau) - 1
        t_two = 2 * mapped * mapped - 1
        chebyshev_squared += weight * t_two * t_two
    combined_mass_bound = min(moment_mu, power_bound, chebyshev_squared)
    edge_load_upper = (
        2 * moment_mu / (h + tau)
        + 2 * tau * combined_mass_bound / (h * (h + tau))
    )
    if (
        open_edge_mass != Fraction(1, 6)
        or power_moment != 1 or power_bound != 1
        or chebyshev_squared != 49 or combined_mass_bound != 1
        or edge_load_upper != 2 or exact_load != 1
    ):
        raise ValueError("odd edge-localization fixture failed")

    # The exact k=2 finite-difference countermodel.
    counter_k = 2
    n = counter_k + 1
    epsilon = Fraction(1, 2)
    nodes = [b * j / n for j in range(n + 1)]
    s_n = sum((Fraction(comb(n, j), 1) / (h + nodes[j]) for j in range(n + 1)),
              Fraction(0))
    delta_n = sum((Fraction((-1) ** j * comb(n, j), 1) / (h + nodes[j])
                   for j in range(n + 1)), Fraction(0))
    weights_plus = [
        Fraction(comb(n, j), 1) * (1 + epsilon * (-1) ** j) / (2 * s_n)
        for j in range(n + 1)
    ]
    weights_minus = [
        Fraction(comb(n, j), 1) * (1 - epsilon * (-1) ** j) / (2 * s_n)
        for j in range(n + 1)
    ]
    moments_plus = [
        sum((weight * node**power for weight, node in zip(weights_plus, nodes)),
            Fraction(0))
        for power in range(counter_k + 1)
    ]
    moments_minus = [
        sum((weight * node**power for weight, node in zip(weights_minus, nodes)),
            Fraction(0))
        for power in range(counter_k + 1)
    ]
    load_plus = 2 * sum(
        (weight / (h + node) for weight, node in zip(weights_plus, nodes)),
        Fraction(0),
    )
    load_minus = 2 * sum(
        (weight / (h + node) for weight, node in zip(weights_minus, nodes)),
        Fraction(0),
    )
    if (
        s_n != Fraction(464, 105) or delta_n != Fraction(16, 105)
        or moments_plus != moments_minus
        or load_plus != Fraction(59, 58) or load_minus != Fraction(57, 58)
        or not all(weight > 0 for weight in weights_plus + weights_minus)
    ):
        raise ValueError("fixed-moment opposite-load fixture failed")

    return {
        "harmonic_short": {
            "h": h,
            "q": q,
            "M": m_matrix,
            "e": e,
            "mu": mu,
            "load": load,
            "scalar_short_direct": short_direct,
            "scalar_short_from_load": short_from_load,
            "equivalence_exact": short_direct == short_from_load,
            "strict_pass": load < 1,
        },
        "monotone_remainder": {
            "h": h,
            "q": q,
            "b": b,
            "Y_spectrum": y_spectrum,
            "spectral_weights": spectral_weights,
            "K_values": k_values,
            "exact_load": exact_load,
            "upper_bounds": upper_bounds,
            "remainder_exact": remainder_exact,
            "remainder_formula": remainder_formula,
            "nonincreasing": all(
                upper_bounds[i + 1] <= upper_bounds[i]
                for i in range(len(upper_bounds) - 1)
            ),
        },
        "edge_localization": {
            "tau": tau,
            "open_edge_mass": open_edge_mass,
            "k": edge_order,
            "power_moment": power_moment,
            "power_mass_bound": power_bound,
            "chebyshev_squared_form": chebyshev_squared,
            "chebyshev_mass_bound": chebyshev_squared,
            "combined_mass_bound": combined_mass_bound,
            "load_upper": edge_load_upper,
            "actual_load": exact_load,
        },
        "same_moments_opposite_load": {
            "k": counter_k,
            "n": n,
            "h": h,
            "b": b,
            "epsilon": epsilon,
            "y_spectrum": nodes,
            "weights_plus": weights_plus,
            "weights_minus": weights_minus,
            "moments_plus": moments_plus,
            "moments_minus": moments_minus,
            "S_n": s_n,
            "Delta_n": delta_n,
            "load_plus": load_plus,
            "load_minus": load_minus,
            "moments_equal_through_k": moments_plus == moments_minus,
            "opposite_load_sides": load_plus > 1 > load_minus,
        },
    }


def _precision_bits(dps: int) -> int:
    return dps * LOG2_10_UPPER_NUMERATOR // LOG2_10_UPPER_DENOMINATOR + 2


def _raw(value: tuple[int, int, int, int]) -> list[object]:
    sign, mantissa, exponent, bits = value
    return [sign, str(mantissa), exponent, bits]


def _raw_fraction(value: tuple[int, int, int, int]) -> Fraction:
    sign, mantissa, exponent, _bits = value
    numerator = -mantissa if sign else mantissa
    return (Fraction(numerator * 2**exponent) if exponent >= 0
            else Fraction(numerator, 2 ** (-exponent)))


def _power_of_two(exponent: int) -> Fraction:
    return Fraction(2**exponent) if exponent >= 0 else Fraction(1, 2 ** (-exponent))


def _normalize_signed_dyadic(value: int, exponent: int) -> tuple[int, int, int, int]:
    if value == 0:
        return 0, 0, 0, 0
    sign = int(value < 0)
    mantissa = abs(value)
    while mantissa % 2 == 0:
        mantissa //= 2
        exponent += 1
    return sign, mantissa, exponent, mantissa.bit_length()


def _shift_raw(raw: tuple[int, int, int, int], power: int, direction: int) -> tuple[int, int, int, int]:
    sign, mantissa, exponent, _bits = raw
    signed = -mantissa if sign else mantissa
    base = min(exponent, power)
    shifted = (signed << (exponent - base)) + direction * (1 << (power - base))
    return _normalize_signed_dyadic(shifted, base)


def _guarded_endpoints(
    lower: tuple[int, int, int, int],
    upper: tuple[int, int, int, int],
    dps: int,
) -> tuple[tuple[int, int, int, int], tuple[int, int, int, int]]:
    if lower == upper:
        return lower, upper
    scale = 0
    for _sign, mantissa, exponent, bits in (lower, upper):
        if mantissa:
            scale = max(scale, exponent + bits - 1)
    guard = scale - _precision_bits(dps) + SERIALIZATION_GUARD_OFFSET_BITS
    return _shift_raw(lower, guard, -1), _shift_raw(upper, guard, 1)


def _serialize_raw_pair(
    lower: tuple[int, int, int, int],
    upper: tuple[int, int, int, int],
    dps: int,
) -> dict[str, object]:
    lo, hi = _guarded_endpoints(lower, upper, dps)
    scale = 0
    for _sign, mantissa, exponent, bits in (lo, hi):
        if mantissa:
            scale = max(scale, exponent + bits - 1)
    width = _raw_fraction(hi) - _raw_fraction(lo)
    cap = _power_of_two(scale - _precision_bits(dps) + 22)
    if width < 0 or width > cap:
        raise ArithmeticError("serialized interval exceeds precision-scaled width cap")
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lo), dps + 10), mp.nstr(mp.mpf(hi), dps + 10)],
            "dyadic": {"lower": _raw(lo), "upper": _raw(hi)},
        }


def _serialize_interval(value: object, dps: int) -> dict[str, object]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    return _serialize_raw_pair(
        tuple(int(part) for part in lower), tuple(int(part) for part in upper), dps
    )


def _iv_bounds(value: object) -> tuple[Fraction, Fraction]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    return (_raw_fraction(tuple(int(part) for part in lower)),
            _raw_fraction(tuple(int(part) for part in upper)))


def _raw_from_dyadic_fraction(value: Fraction) -> tuple[int, int, int, int]:
    denominator = value.denominator
    if denominator & (denominator - 1):
        raise ValueError("interval endpoint was not dyadic")
    exponent = -(denominator.bit_length() - 1)
    return _normalize_signed_dyadic(value.numerator, exponent)


def _serialize_intersection(left: object, right: object, dps: int) -> dict[str, object]:
    left_lo, left_hi = _iv_bounds(left)
    right_lo, right_hi = _iv_bounds(right)
    lo, hi = max(left_lo, right_lo), min(left_hi, right_hi)
    if lo > hi:
        raise ArithmeticError("independent pole-prime intervals do not overlap")
    return _serialize_raw_pair(_raw_from_dyadic_fraction(lo), _raw_from_dyadic_fraction(hi), dps)


def _ceil_fraction(value: Fraction) -> int:
    return -((-value.numerator) // value.denominator)


def _mellin_projection_intervals(p: int, dps: int) -> dict[str, Any]:
    mp.iv.dps = dps
    one = mp.iv.mpf(1)
    two = mp.iv.mpf(2)
    four = mp.iv.mpf(4)
    lam = mp.iv.mpf(p) / 2
    length = 2 * mp.iv.log(lam)
    schedule_real = (length**2 + 26 * length) / (2 * mp.iv.pi**2)
    schedule_lo, schedule_hi = _iv_bounds(schedule_real)
    schedule_lo_ceil = _ceil_fraction(schedule_lo)
    schedule_hi_ceil = _ceil_fraction(schedule_hi)
    if schedule_lo_ceil != schedule_hi_ceil or schedule_lo_ceil < 1:
        raise ArithmeticError("Mellin schedule ceiling was not interval-decidable")
    schedule = schedule_lo_ceil
    condition_margin = schedule + 1 - 13 * length / mp.iv.pi**2
    condition_lo, _condition_hi = _iv_bounds(condition_margin)
    if condition_lo <= 0:
        raise ArithmeticError("Mellin schedule condition was not certified")

    c_xi = (
        two ** (one / four)
        * mp.iv.pi ** (-one / four)
        * mp.iv.gamma(one / four)
        * mp.iv.exp(one / four)
        / (mp.iv.sqrt(two) - 1)
    )
    c_sum = mp.iv.exp(2) / (1 - mp.iv.exp(-3 * (4 * mp.iv.pi - 2)))
    b1 = 2 * mp.iv.pi**3 + mp.iv.mpf(15) / 2 * mp.iv.pi**2 + mp.iv.mpf(15) / 4 * mp.iv.pi
    b2 = (4 * mp.iv.pi**4 + 28 * mp.iv.pi**3
          + mp.iv.mpf(165) / 4 * mp.iv.pi**2 + mp.iv.mpf(75) / 8 * mp.iv.pi)
    gamma_denominator = 1 - mp.iv.mpf(13) / (4 * mp.iv.pi * lam**2)
    gamma_den_lo, _gamma_den_hi = _iv_bounds(gamma_denominator)
    if gamma_den_lo <= 0:
        raise ArithmeticError("incomplete-gamma elementary denominator was not positive")
    b_lambda_upper = (
        2 * c_sum * lam ** (mp.iv.mpf(13) / 2) * mp.iv.exp(-mp.iv.pi * lam**2)
        * (b1 + b2 / (2 * mp.iv.pi * gamma_denominator))
    )
    omega = 2 * mp.iv.pi * (schedule + 1) / length
    xi_tail = (
        c_xi**2 / (4 * length)
        * (omega**2 + one / four) ** (mp.iv.mpf(13) / 4)
        * mp.iv.exp(-mp.iv.pi**2 * (schedule + 1) / length)
        / (1 - mp.iv.exp(-mp.iv.pi**2 / (2 * length)))
    )
    xi_schedule_bound = (
        c_xi**2 * mp.iv.exp(-13) / (4 * length * lam)
        * (((length + 26) / mp.iv.pi + 4 * mp.iv.pi / length) ** 2 + one / four)
          ** (mp.iv.mpf(13) / 4)
        * (1 + 2 * length / mp.iv.pi**2)
    )
    derivative_tail_square = (
        b_lambda_upper**2 * length**3 / (12 * mp.iv.pi**4 * schedule**3)
    )
    total_square = xi_tail + derivative_tail_square
    total_upper = mp.iv.sqrt(total_square)

    bv_low = mp.iv.mpf(4) / mp.iv.pi**2 * (mp.iv.mpf(7) / 8)
    bv_high = mp.iv.mpf(4) / mp.iv.pi**2 * (mp.iv.mpf(3) / 2 + mp.iv.log(2))
    c0 = 1 + mp.iv.euler / 2 - mp.iv.log(2 * mp.iv.sqrt(mp.iv.pi))

    values = {
        "lambda": lam,
        "physical_length_L": length,
        "xi_envelope_constant_C_Xi": c_xi,
        "C_sum": c_sum,
        "B1": b1,
        "B2": b2,
        "B_lambda_elementary_upper": b_lambda_upper,
        "omega_N_plus_1": omega,
        "Xi_geometric_tail_X_LN": xi_tail,
        "Xi_schedule_tail_X_bound": xi_schedule_bound,
        "derivative_tail_square_upper": derivative_tail_square,
        "total_E_K_N_square_upper": total_square,
        "total_E_K_N_upper": total_upper,
        "schedule_condition_margin": condition_margin,
        "bv_low_branch_bound": bv_low,
        "bv_high_branch_bound": bv_high,
        "c0": c0,
    }
    return {
        "diagnostic_only": True,
        "schedule_N_star_exact": schedule,
        "schedule_condition_decidable": True,
        "source_delta_finite_value_supplied": False,
        "values": {key: _serialize_interval(value, dps) for key, value in values.items()},
    }


def _is_prime(value: int) -> bool:
    if value < 2:
        return False
    divisor = 2
    while divisor * divisor <= value:
        if value % divisor == 0:
            return False
        divisor += 1
    return True


def _prime_power_inventory(p: int) -> list[dict[str, int]]:
    maximum = p * p // 4
    inventory: list[dict[str, int]] = []
    for n in range(2, maximum + 1):
        for base in range(2, n + 1):
            if not _is_prime(base):
                continue
            power = base
            exponent = 1
            while power < n:
                power *= base
                exponent += 1
            if power == n:
                inventory.append({"n": n, "prime_base": base, "exponent": exponent})
                break
    return inventory


def _pole_prime_fixture(p: int, dps: int) -> tuple[dict[str, Any], bool]:
    mp.iv.dps = dps
    lam = mp.iv.mpf(p) / 2
    x_value = lam**2
    length = 2 * mp.iv.log(lam)
    mu = (lam - 1 / lam - length) / 2
    inventory = _prime_power_inventory(p)

    # Path A: direct autocorrelation evaluation, retaining the combined
    # negative pole and complete minus-prime block until the final sum.
    prime_block = mp.iv.mpf(0)
    for item in inventory:
        n_iv = mp.iv.mpf(item["n"])
        log_n = mp.iv.log(n_iv)
        von_mangoldt = mp.iv.log(item["prime_base"])
        half_gap = (length - log_n) / 2
        half_log_n = log_n / 2
        sinh_gap = (mp.iv.exp(half_gap) - mp.iv.exp(-half_gap)) / 2
        cosh_log_n = (mp.iv.exp(half_log_n) + mp.iv.exp(-half_log_n)) / 2
        correlation = (
            sinh_gap - half_gap * cosh_log_n
        )
        prime_block += -2 * von_mangoldt / mp.iv.sqrt(n_iv) * correlation
    path_a = -2 * mu**2 + prime_block

    # Path B: independently aggregate the four finite source sums in (7.7).
    psi_c = mp.iv.mpf(0)
    a_sum = mp.iv.mpf(0)
    b0_sum = mp.iv.mpf(0)
    b1_sum = mp.iv.mpf(0)
    for item in inventory:
        n_iv = mp.iv.mpf(item["n"])
        von_mangoldt = mp.iv.log(item["prime_base"])
        log_weight = mp.iv.log(x_value / n_iv)
        psi_c += von_mangoldt
        a_sum += von_mangoldt / n_iv
        b0_sum += von_mangoldt * log_weight
        b1_sum += von_mangoldt / n_iv * log_weight
    path_b = -2 * mu**2 - lam * a_sum + psi_c / lam + (b0_sum + b1_sum) / 2
    a_lo, a_hi = _iv_bounds(path_a)
    b_lo, b_hi = _iv_bounds(path_b)
    paths_overlap = max(a_lo, b_lo) <= min(a_hi, b_hi)
    if not paths_overlap:
        raise ArithmeticError("pole-prime assembly paths failed to overlap")

    matched_n = (p * p + 3) // 4
    projected_bound = (
        (lam - 1 / lam) / 2
        - mp.iv.log(lam)
        - mp.iv.log(lam) * (lam + 1 / lam - 2) / (mp.iv.pi**2 * matched_n)
    )
    projected_lo, _projected_hi = _iv_bounds(projected_bound)
    projected_positive = projected_lo > 0
    if not projected_positive:
        raise ArithmeticError("matched projected-pole lower bound was not positive")

    inventory_set = {item["n"] for item in inventory}
    excluded = [n for n in range(2, p * p // 4 + 1) if n not in inventory_set]
    expected_inventory = {
        5: [2, 3, 4, 5],
        9: [2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 17, 19],
    }
    if [item["n"] for item in inventory] != expected_inventory[p]:
        raise ValueError("inclusive prime-power inventory regression failed")

    return {
        "lambda_squared_numerator": str(p * p),
        "lambda_squared_denominator": "4",
        "maximum_integer_n": p * p // 4,
        "endpoint_rule": "include every prime power n with 4*n<=p^2",
        "inventory": inventory,
        "excluded_non_prime_power_composites": excluded,
        "prime_block_sign": "minus",
        "individual_prime_blocks_absolutized": False,
        "pole_prime_evaluation_path_A": _serialize_interval(path_a, dps),
        "pole_prime_evaluation_path_B": _serialize_interval(path_b, dps),
        "path_intersection": _serialize_intersection(path_a, path_b, dps),
        "paths_overlap": paths_overlap,
        "matched_projected_pole_bound": _serialize_interval(projected_bound, dps),
        "zero_series_values": [],
        "decimal_zero_list_read": False,
    }, projected_positive


def _validate_admissions() -> None:
    if any(SOURCE_ADMISSIONS.values()):
        raise ValueError("a forbidden source admission was enabled")


def produce(p_text: str, dps_text: str) -> dict[str, Any]:
    canonical_p_text, p = _canonical_choice_text(
        p_text, "lambda numerator", CANONICAL_LAMBDA_NUMERATORS
    )
    precision_text, precision = _canonical_choice_text(dps_text, "dps", CANONICAL_DPS)
    _validate_admissions()
    _validate_runtime()
    source_binding, source_lock = _validated_source_lock()

    normalization = _normalization_and_derivative_fixture()
    mellin = _mellin_projection_intervals(p, precision)
    soft = _soft_symbol_fixture()
    effective = _effective_tail_and_bv_fixture()
    graph = _graph_spill_fixture()
    odd = _odd_harmonic_moment_fixture()
    prime, matched_positive = _pole_prime_fixture(p, precision)

    checks = {
        "source_lock_and_all_hashes_valid": True,
        "xi_over_four_exact": normalization["xi_transform_scalar"] == Fraction(1, 4),
        "derivatives_exact": normalization["derivatives_reconstructed"],
        "unit_normalization_rejected": normalization["unit_norm_limiting_scalar_rejected"],
        "schedule_condition_certified": mellin["schedule_condition_decidable"],
        "projection_probe_not_promoted": mellin["diagnostic_only"],
        "soft_identity_exact": soft["soft_identity_exact"],
        "gray_mass_retained": soft["gray_term"] > 0,
        "layer_identity_exact": soft["layer_identity_exact"],
        "layer_not_promoted_to_soft": soft["layer_average_left"] != soft["chi_X"],
        "effective_open_threshold_exact": effective["r_sigma_open"] == 1,
        "effective_tail_endpoint_retained": effective["endpoint_retained_low"],
        "bv_branches_retained": set(effective["bv_piecewise_oracles"]) == {"low", "junction", "high"},
        "graph_equation_exact": graph["low_graph_equation_exact"],
        "graph_spill_retained": graph["Gamma_squared"] > 0,
        "bad_spill_countermodel_exact": graph["bad_spill_countermodel"]["omission_fails"],
        "harmonic_short_equivalence_exact": odd["harmonic_short"]["equivalence_exact"],
        "monotone_remainders_exact": (
            odd["monotone_remainder"]["remainder_exact"]
            == odd["monotone_remainder"]["remainder_formula"]
        ),
        "edge_localization_bound_exact": (
            odd["edge_localization"]["actual_load"]
            <= odd["edge_localization"]["load_upper"]
        ),
        "fixed_moments_opposite_load_exact": (
            odd["same_moments_opposite_load"]["moments_equal_through_k"]
            and odd["same_moments_opposite_load"]["opposite_load_sides"]
        ),
        "prime_power_endpoint_inclusive": True,
        "prime_block_minus_sign_retained": prime["prime_block_sign"] == "minus",
        "pole_prime_paths_overlap": prime["paths_overlap"],
        "combined_cancellation_preserved": not prime["individual_prime_blocks_absolutized"],
        "matched_pole_bound_positive": matched_positive,
        "c0_is_center_not_limit": True,
        "no_zero_values_serialized": prime["zero_series_values"] == [],
        "no_forbidden_admission_enabled": not any(SOURCE_ADMISSIONS.values()),
    }
    if not all(checks.values()):
        raise ValueError("Mellin/soft-symbol/graph-spill audit check failed")

    payload = _encode({
        "schema": SCHEMA,
        "source_lock": source_binding,
        "inputs": {
            "lambda_numerator_text": canonical_p_text,
            "lambda_denominator_text": "2",
            "dps_text": precision_text,
            "moment_order_exact": 2,
            "edge_tau_text": "1",
        },
        "terminal_state": TERMINAL_STATE,
        "source_conventions": {
            "locked_conventions": source_lock["locked_conventions"],
            "locked_formulas": source_lock["locked_formulas"],
        },
        "claim_boundary": {
            "claim_class": CLAIM_CLASS,
            "proved": source_lock["claim_boundary"]["proved"],
            "not_proved": source_lock["claim_boundary"]["not_proved"],
            "source_admissions": SOURCE_ADMISSIONS,
        },
        "certificate": {
            "normalization_and_derivative_fixture": normalization,
            "mellin_projection_intervals": mellin,
            "soft_symbol_fixture": soft,
            "effective_tail_and_bv_fixture": effective,
            "graph_spill_fixture": graph,
            "odd_harmonic_moment_fixture": odd,
            "prime_power_and_pole_prime_fixture": prime,
            "checks": checks,
        },
        "arithmetic_libraries": ARITHMETIC_LIBRARIES,
    })
    _assert_strict_json(payload)
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-numerator", required=True)
    parser.add_argument("--dps", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    payload = produce(args.lambda_numerator, args.dps)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
