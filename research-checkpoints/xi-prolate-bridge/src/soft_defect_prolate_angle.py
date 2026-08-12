#!/usr/bin/env python3
"""Produce the soft-defect/prolate-angle reduction certificate.

The certificate combines exact rational regression models with outward
``mpmath.iv`` enclosures.  It does not assemble a physical prolate--Weil
matrix, prove a matched coframe estimate, or prove any asymptotic sector
floor.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import itertools
import json
from math import comb, factorial, isqrt
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-soft-defect-prolate-angle-v1"
LOCK = "SOFT_DEFECT_PROLATE_ANGLE_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-soft-defect-prolate-angle-source-lock-v1"
CLAIM_CLASS = "SOFT_DEFECT_PROLATE_ANGLE_REDUCTION"
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
EXPECTED_LIBRARY = "mpmath.iv 1.4.1"

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_POSITIVE_INTEGER_TEXT = re.compile(r"^[1-9][0-9]*$")
LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 18

EXPECTED_DEPENDENCIES = {
    "P0_SOURCE_LOCK.json",
    "P3_SOURCE_LOCK.json",
    "DIRECT_RH_ATTACK.md",
    "notes/PROJECTION_RATE_THEOREM.md",
    "FULL_SOURCE_COFRAME_RANK_SOURCE_LOCK.json",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md",
    "MATCHED_HIGH_MOMENT_COFRAME_SOURCE_LOCK.json",
    "notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md",
    "MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_SOURCE_LOCK.json",
    "notes/MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT.md",
    "PHYSICAL_LEVERAGE_SHORTED_SCHUR_SOURCE_LOCK.json",
    "notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md",
    "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_SOURCE_LOCK.json",
    "notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md",
    "PROJECTED_STATE_NORM_SOURCE_LOCK.json",
    "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md",
    "requirements.txt",
    "notes/SOFT_DEFECT_PROLATE_ANGLE_REDUCTION.md",
}

LOCKED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension; the zero-Lebesgue-integral source normalization and full source Gram C^*C are retained",
    "physical_interval": "I_lambda=[-log(lambda),log(lambda)] with Lebesgue measure in logarithmic coordinates, equivalently du/u on [lambda^(-1),lambda]",
    "fourier_sign": "fhat(t)=integral f(x)*exp(-i*t*x)dx with Plancherel measure dt/(2*pi)",
    "centered_modes": "phi_n(x)=(-1)^n*L^(-1/2)*exp(i*omega_n*x), omega_n=2*pi*n/L, L=2*log(lambda)",
    "inversion": "J is reflection in logarithmic coordinates; Fourier residue classes are not substituted for inversion parity",
    "prime_endpoint": "every prime power n<=lambda^2 is retained; the cutoff is inclusive and is not confused with lambda",
    "prime_sign": "m_lambda=2*theta_prime-2*sum_(n<=lambda^2) Lambda(n)/sqrt(n)*cos(t*log(n))",
    "source_gram": "every source synthesis C uses B=C^*C; B is never replaced by the identity unless that identity is proved for the displayed columns",
    "strictness": "equality at a target floor, rank-one load one, normalized tail one, zero determinant, or nonpositive reserve is rejected",
    "input_text": "lambda numerator and decimal precision are canonical positive integer text; binary64 inputs and JSON numbers are rejected",
    "artifact_scope": "exact finite-dimensional reductions and outward formula intervals, not a physical prolate-Weil matrix, matched coframe, signed floor, or asymptotic theorem",
    "arithmetic": "finite fixtures use exact reduced rationals; logarithms, pi, square roots, exponential, Euler's constant, zeta(3), band energies, and central formulas use outward mpmath.iv intervals; binary64 JSON numbers are forbidden",
}

LOCKED_FORMULAS = {
    "ideal_clip": "for d>=1, r>0, L>0, 0<=mu<nu, and M>nu*L, D_M=(M*I-A)_+ and lambda_min(A)>=M-trace(D_M^r)^(1/r), with no hypothesis A<=M*I",
    "clip_threshold": "under the ideal-clip domains, trace(D_M^r)<=d*(M-nu*L)^r gives a strict floor mu*L when r>log(d)/log((M-mu*L)/(M-nu*L)); equality is rejected",
    "soft_blocks": "for w=m-U, a=(w-g)_+, v=(g-w)_+, B_plus=g*I+T_a-T_v+2*|p_plus><p_plus| and B_minus=g*I+T_a-T_v-2*|p_minus><p_minus|",
    "soft_trace": "for r>=1 on the even high space, trace(D_g(B_plus)^r)<=trace(R_H^r)<=integral v^r*kappa_H*dnu, R_H=P_H*T_v*P_H",
    "leverage_excess": "for tau=(c-nu)*L and E_tau=integral (v-tau)_+*kappa_H*dnu, the even soft block is >mu*L if E_tau<(nu-mu)*L",
    "scalar_excess": "for r>1, tau>0, and x>=0, (x-tau)_+<=((r-1)^(r-1)/(r^r*tau^(r-1)))*x^r; equality occurs at x=r*tau/(r-1)",
    "odd_cap": "for M0=c*L*I-R and 0<=R<=(c-a)*L*I, 2*<p,M0^(-1)p>=2*(a*L*mu0+rho1-chi)/(a*c*L^2), chi=<p,(((c-a)*L*I-R)*R*(c*L*I-R)^(-1))p>",
    "odd_reserve": "if 0<delta<=1, rho1+a*L*mu0<=(1-delta)*a*c*L^2/2, and M>=M0, then M-2*|p><p|>=delta*a*L*I; load one is not strict",
    "odd_one_direction_schur": "with e=p/sqrt(mu0), alpha=<e,Me>, b=P_(e_perp)Me, C=P_(e_perp)MP_(e_perp), positivity is equivalent to C>0 and alpha-2*mu0-<b,C^(-1)b>>0",
    "central_outlier": "for lambda^2>2, 0<delta<pi/2, and U+g>=-C_B*L, epsilon_L=9.22022*L^(3/2)*exp(-0.8476836*sqrt(L)); V_L=[2*cos(delta)*(1-epsilon_L)*lambda-C_B*L-C_theta]_+",
    "central_archimedean": "C_theta=digamma(1/4)-log(pi)+delta^2*zeta(3,1/4)/(4*L^2), with zeta(3,1/4)=pi^3+28*zeta(3)",
    "band_energy": "b_epsilon(delta)=(2*pi)^(-1)*integral_(-delta)^delta |Fhat_epsilon(s)|^2 ds, Fhat_plus=2*sin(s/2)/s and Fhat_minus=4*sqrt(2)*pi*i*sin(s/2)/(s^2-4*pi^2)",
    "principal_tail": "for F=E intersect 1^perp and s=||P_E*1||^2, ||(I-P_F)z||^2<=(2*lambda/s)*||(I-P_E)z||^2 for z perpendicular to 1",
    "angle_floor": "Theta=(2*lambda/s)*||(I-P_E)Z^*||^2<1 implies |D|^2/(det(B)*det(R))=det(Z*P_F*Z^*)>=(1-Theta)^dim(X)",
    "augmented_determinants": "D_plus=I0^(-1)*det([integral; physical rows]) and D_minus=(-1)^N*I2^(-1)*det([integral; physical rows]) after the exact zero-integral column operations",
    "projection_schedule": "N(lambda)=ceil(sqrt(lambda)) and e_projection<=delta_lambda*sqrt(lambda^3-lambda)+R_h+6006*log(lambda)/(1000*pi*(N+1))",
}

CLAIM_SCOPE = {
    "proved": [
        "the sharp clipped-defect floor and strict moment-order conversion, including positive-outlier invariance",
        "the exact source-soft trace reduction, leverage-excess criterion, and sharp scalar excess-to-moment constant",
        "the exact capped odd rank-one identity, sufficient reserve, and load-one equality rejection",
        "the exact source- and target-whitened principal-angle fixture with its mandatory nonidentity source Gram",
        "the exact augmented determinant column-operation identities in the even and odd sign conventions",
        "outward interval evaluations of the square-root projection coefficient and central-outlier formulas, including a fixed formula-scale probe",
    ],
    "not_proved": [
        "the required source-soft moment or leverage-excess estimate on an unbounded physical schedule",
        "a strict capped odd directional reserve for the actual physical multiplier",
        "a normalized tail Theta<1 for the prescribed matched prolate source family",
        "a nonzero actual prolate moment determinant on every matched schedule",
        "a positive complete signed floor in either inversion sector",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

SOURCE_ADMISSIONS = {
    "absolute_prime_values_substituted_for_signed_sum": False,
    "api_key_read": False,
    "binary64_parameters_used": False,
    "cached_physical_matrix_read": False,
    "cached_prolate_eigenvectors_read": False,
    "cached_weil_matrix_read": False,
    "central_probe_promoted_to_schedule_certificate": False,
    "determinant_limit_claimed": False,
    "environment_secret_read": False,
    "equation_5_2_claimed": False,
    "equality_boundary_reported_as_pass": False,
    "finite_angle_fixture_promoted_to_matched_coframe": False,
    "global_weil_positivity_assumed": False,
    "inversion_reflection_dropped": False,
    "lambda_squared_mixed_with_lambda": False,
    "nonpositive_floor_reported_as_pass": False,
    "odd_negative_pole_omitted": False,
    "physical_coframe_claimed": False,
    "prime_block_sign_changed": False,
    "prime_power_endpoint_omitted": False,
    "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence": False,
    "rh_proved": False,
    "secret_serialized": False,
    "signed_sector_floor_claimed": False,
    "source_gram_replaced_by_identity": False,
    "sqrt_schedule_projection_promoted_to_residual_gap_limit": False,
    "unit_source_normalization_substituted": False,
    "zeros_assumed_real": False,
    "zeta_zero_table_read": False,
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


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _validated_source_lock() -> dict[str, Any]:
    path = _root() / LOCK
    lock = json.loads(path.read_text(encoding="utf-8"))
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary", "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ValueError("source-lock inventory mismatch")
    fixed = {
        "schema": LOCK_SCHEMA,
        "claim_class": CLAIM_CLASS,
        "terminal_state": TERMINAL_STATE,
        "updated_date": UPDATED_DATE,
        "external_sources": [],
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_boundary": CLAIM_SCOPE,
        "source_admissions": SOURCE_ADMISSIONS,
    }
    for key, expected in fixed.items():
        if lock[key] != expected:
            raise ValueError(f"source-lock {key} mutation")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("source-lock dependencies missing")
    found: dict[str, str] = {}
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        candidate = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str) or not relative
            or candidate.is_absolute() or ".." in candidate.parts
            or relative in found
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ValueError("invalid source-lock dependency")
        if _sha256(_root() / candidate) != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        found[relative] = expected
    if set(found) != EXPECTED_DEPENDENCIES:
        raise ValueError("source-lock dependency path inventory mismatch")
    return {
        "path": LOCK,
        "sha256": _sha256(path),
        "schema": LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(found.items())),
    }


def _canonical_positive_text(value: Any, label: str, minimum: int) -> tuple[str, int]:
    if not isinstance(value, str) or _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise TypeError(f"{label} must be canonical positive integer text")
    integer = int(value)
    if integer < minimum:
        raise ValueError(f"{label} must be at least {minimum}")
    return value, integer


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


def _shape(matrix: Matrix) -> tuple[int, int]:
    rows = len(matrix)
    columns = len(matrix[0]) if rows else 0
    if any(len(row) != columns for row in matrix):
        raise ValueError("ragged matrix")
    return rows, columns


def _identity(size: int) -> Matrix:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _diag(*values: Fraction) -> Matrix:
    return [[value if i == j else Fraction(0) for j in range(len(values))]
            for i, value in enumerate(values)]


def _transpose(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    return [[matrix[i][j] for i in range(rows)] for j in range(columns)]


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    lr, lc = _shape(left)
    rr, rc = _shape(right)
    if lc != rr:
        raise ValueError("matrix dimension mismatch")
    return [[sum((left[i][k] * right[k][j] for k in range(lc)), Fraction(0))
             for j in range(rc)] for i in range(lr)]


def _add(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ValueError("matrix dimension mismatch")
    return [[a + b for a, b in zip(lrow, rrow)]
            for lrow, rrow in zip(left, right)]


def _sub(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ValueError("matrix dimension mismatch")
    return [[a - b for a, b in zip(lrow, rrow)]
            for lrow, rrow in zip(left, right)]


def _scale(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _outer(column: list[Fraction]) -> Matrix:
    return [[left * right for right in column] for left in column]


def _inverse(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    if rows == 0 or rows != columns:
        raise ValueError("inverse requires a nonempty square matrix")
    work = [row[:] + unit[:] for row, unit in zip(matrix, _identity(rows))]
    for column in range(rows):
        pivot = next((row for row in range(column, rows) if work[row][column]), None)
        if pivot is None:
            raise ValueError("singular matrix")
        work[column], work[pivot] = work[pivot], work[column]
        divisor = work[column][column]
        work[column] = [entry / divisor for entry in work[column]]
        for row in range(rows):
            if row == column:
                continue
            multiplier = work[row][column]
            work[row] = [a - multiplier * b for a, b in zip(work[row], work[column])]
    return [row[rows:] for row in work]


def _determinant(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("determinant requires a square matrix")
    work = [row[:] for row in matrix]
    result = Fraction(1)
    for column in range(rows):
        pivot = next((row for row in range(column, rows) if work[row][column]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        value = work[column][column]
        result *= value
        for row in range(column + 1, rows):
            ratio = work[row][column] / value
            for index in range(column + 1, rows):
                work[row][index] -= ratio * work[column][index]
    return result


def _principal_minors(matrix: Matrix) -> list[Fraction]:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("principal minors require a square matrix")
    return [
        _determinant([[matrix[i][j] for j in indices] for i in indices])
        for size in range(1, rows + 1)
        for indices in itertools.combinations(range(rows), size)
    ]


def _trace(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("trace requires a square matrix")
    return sum((matrix[i][i] for i in range(rows)), Fraction(0))


def _quadratic(column: list[Fraction], matrix: Matrix) -> Fraction:
    vector = [[entry] for entry in column]
    return _matmul(_matmul(_transpose(vector), matrix), vector)[0][0]


def _clipped_diagonal(diagonal: list[Fraction], cap: Fraction) -> list[Fraction]:
    return [max(Fraction(0), cap - value) for value in diagonal]


def _ideal_clipped_defect() -> dict[str, Any]:
    length = Fraction(1)
    cap = Fraction(5)
    mu = Fraction(1)
    nu = Fraction(3)
    dimension = 4
    boundary_order = 2
    strict_order = 3
    boundary_diagonal = [Fraction(1), Fraction(5), Fraction(5), Fraction(5)]
    outlier_diagonal = [Fraction(1), Fraction(500), Fraction(5), Fraction(5)]
    strict_model_diagonal = [Fraction(3), Fraction(5), Fraction(5), Fraction(5)]

    def record(diagonal: list[Fraction], order: int) -> dict[str, Any]:
        defect = _clipped_diagonal(diagonal, cap)
        moment = sum((entry**order for entry in defect), Fraction(0))
        source_cap = dimension * (cap - nu * length) ** order
        target_power = (cap - mu * length) ** order
        return {
            "A": _diag(*diagonal),
            "order_r": order,
            "clipped_defect_diagonal": defect,
            "trace_clipped_defect_power": moment,
            "source_moment_cap": source_cap,
            "source_moment_hypothesis": moment <= source_cap,
            "strict_target_power_test": source_cap < target_power,
            "actual_minimum": min(diagonal),
        }

    boundary = record(boundary_diagonal, boundary_order)
    outlier = record(outlier_diagonal, boundary_order)
    strict_model = record(strict_model_diagonal, strict_order)
    if (
        boundary["trace_clipped_defect_power"] != 16
        or boundary["source_moment_cap"] != 16
        or boundary["actual_minimum"] != mu * length
        or boundary["strict_target_power_test"]
        or outlier["clipped_defect_diagonal"] != boundary["clipped_defect_diagonal"]
        or outlier["trace_clipped_defect_power"] != boundary["trace_clipped_defect_power"]
        or not strict_model["source_moment_hypothesis"]
        or not strict_model["strict_target_power_test"]
        or strict_model["actual_minimum"] <= mu * length
        or dimension * (cap - nu * length) ** strict_order
        >= (cap - mu * length) ** strict_order
    ):
        raise ValueError("ideal clipped-defect regression failed")
    return {
        "dimension_d": dimension,
        "L": length,
        "M": cap,
        "mu": mu,
        "nu": nu,
        "threshold_ratio": Fraction(2),
        "r_star": boundary_order,
        "least_integer_strict_order": strict_order,
        "boundary_equality_rejected": {**boundary, "strict_pass": False},
        "strict_order_model": strict_model,
        "positive_outlier_reference": boundary,
        "positive_outlier_raised_to_500": outlier,
        "clipped_defect_is_positive_outlier_invariant": True,
        "upper_bound_A_le_M_assumed": False,
    }


def _source_soft_and_leverage() -> dict[str, Any]:
    g = Fraction(5)
    positive = [[Fraction(1), Fraction(1)], [Fraction(1), Fraction(1)]]
    negative = _diag(Fraction(4), Fraction(0))
    block = _sub(_add(_scale(g, _identity(2)), positive), negative)
    commutator = _sub(_matmul(positive, negative), _matmul(negative, positive))
    if block != [[Fraction(2), Fraction(1)], [Fraction(1), Fraction(6)]]:
        raise ValueError("noncommuting soft block assembly failed")
    if commutator == [[Fraction(0), Fraction(0)], [Fraction(0), Fraction(0)]]:
        raise ValueError("noncommuting soft block accidentally commutes")

    multiplier = _diag(Fraction(8), Fraction(2), Fraction(1))
    cutoff = Fraction(3)
    floor_g = Fraction(6)
    excess_operator = _diag(Fraction(5), Fraction(0), Fraction(0))
    capture = [Fraction(1), Fraction(0), Fraction(0)]
    rotated = [Fraction(3, 5), Fraction(4, 5), Fraction(0)]
    capture_h = _sub(_identity(3), _outer(capture))
    rotated_h = _sub(_identity(3), _outer(rotated))
    capture_excess = _trace(_matmul(capture_h, excess_operator))
    rotated_excess = _trace(_matmul(rotated_h, excess_operator))
    capture_bound = floor_g - cutoff - capture_excess
    rotated_bound = floor_g - cutoff - rotated_excess
    rotated_compressed = _matmul(_matmul(rotated_h, _sub(_scale(floor_g, _identity(3)), multiplier)), rotated_h)
    rotated_direction = [Fraction(-4, 5), Fraction(3, 5), Fraction(0)]
    rotated_actual = _quadratic(rotated_direction, rotated_compressed)

    order = 3
    tau = Fraction(2)
    scalar = Fraction(3)
    sharp_constant = Fraction(1, 27)
    factorization_coefficients = [Fraction(2), Fraction(-1), Fraction(0), Fraction(1, 27)]
    if (
        capture_excess != 0
        or rotated_excess != Fraction(16, 5)
        or capture_bound != 3
        or rotated_bound != Fraction(-1, 5)
        or rotated_actual != Fraction(4, 25)
        or sharp_constant * scalar**order != scalar - tau
        or sum(
            coefficient * scalar**degree
            for degree, coefficient in enumerate(factorization_coefficients)
        ) != 0
    ):
        raise ValueError("source-soft/leverage regression failed")
    return {
        "noncommuting_soft_block": {
            "g": g,
            "T_a_positive": positive,
            "T_v_negative": negative,
            "B_plus_without_pole": block,
            "commutator_Ta_Tv": commutator,
            "characteristic_polynomial": "x^2-8*x+11",
            "eigenvalue_formula": ["4-sqrt(5)", "4+sqrt(5)"],
            "clipped_square_moment_formula": "(1+sqrt(5))^2=6+2*sqrt(5)",
            "target_defect_power": Fraction(16),
            "strict_floor_one_witness": "sqrt(5)<3 because 5<9",
            "commutation_assumed": False,
        },
        "leverage_excess_orientation": {
            "T_v": multiplier,
            "g": floor_g,
            "tau": cutoff,
            "positive_excess_operator_Tv_minus_tau": excess_operator,
            "captured_K_unit_vector": capture,
            "captured_H_projector": capture_h,
            "captured_excess_trace": capture_excess,
            "captured_scalar_lower_bound": capture_bound,
            "rotated_K_unit_vector": rotated,
            "rotated_H_projector": rotated_h,
            "rotated_excess_trace": rotated_excess,
            "rotated_scalar_lower_bound": rotated_bound,
            "rotated_true_minimum_on_H": rotated_actual,
            "orientation_is_mandatory": True,
        },
        "sharp_scalar_excess_moment": {
            "r": order,
            "tau": tau,
            "sharp_constant": sharp_constant,
            "equality_x": scalar,
            "positive_excess_at_equality": scalar - tau,
            "constant_times_x_power": sharp_constant * scalar**order,
            "global_factorization": "x^3/27-x+2=(x-3)^2*(x+6)/27 for x>=2",
            "factorization_coefficients_low_to_high": factorization_coefficients,
            "equality_is_sharp_not_strict": True,
        },
    }


def _capped_odd_rank_one() -> dict[str, Any]:
    c = Fraction(5)
    a = Fraction(2)
    length = Fraction(1)
    cap_rho = Fraction(3)
    remainder = _diag(Fraction(0), cap_rho)
    base = _sub(_scale(c * length, _identity(2)), remainder)
    p = [Fraction(1, 2), Fraction(1, 2)]
    mu0 = sum((entry * entry for entry in p), Fraction(0))
    rho1 = _quadratic(p, remainder)
    annihilator = _matmul(
        _matmul(_sub(_scale((c - a) * length, _identity(2)), remainder), remainder),
        _inverse(base),
    )
    chi = _quadratic(p, annihilator)
    load_direct = 2 * _quadratic(p, _inverse(base))
    load_identity = 2 * (a * length * mu0 + rho1 - chi) / (a * c * length**2)
    delta = Fraction(1, 2)
    threshold_lhs = rho1 + a * length * mu0
    threshold_rhs = (1 - delta) * a * c * length**2 / 2
    signed = _sub(base, _scale(Fraction(2), _outer(p)))
    reserve = _sub(signed, _scale(delta * a * length, _identity(2)))

    equality_p = [Fraction(0), Fraction(1)]
    equality_load = 2 * _quadratic(equality_p, _inverse(base))
    equality_signed = _sub(base, _scale(Fraction(2), _outer(equality_p)))
    if (
        base != _diag(Fraction(5), Fraction(2))
        or mu0 != Fraction(1, 2)
        or rho1 != Fraction(3, 4)
        or chi != 0
        or load_direct != Fraction(7, 20)
        or load_identity != load_direct
        or threshold_lhs > threshold_rhs
        or min(_principal_minors(reserve)) <= 0
        or equality_load != 1
        or _determinant(equality_signed) != 0
    ):
        raise ValueError("capped odd rank-one regression failed")
    return {
        "strict_reserve_model": {
            "c": c,
            "a": a,
            "L": length,
            "R": remainder,
            "R_squared": _matmul(remainder, remainder),
            "rho_cap_times_R": _scale(cap_rho, remainder),
            "M0": base,
            "p": p,
            "mu0_norm_p_squared": mu0,
            "rho1_p_R_p": rho1,
            "chi_operator": annihilator,
            "chi": chi,
            "load_direct": load_direct,
            "load_from_capped_identity": load_identity,
            "delta": delta,
            "reserve_condition_lhs": threshold_lhs,
            "reserve_condition_rhs": threshold_rhs,
            "reserve_condition_holds": threshold_lhs <= threshold_rhs,
            "M0_minus_2pp": signed,
            "M0_minus_2pp_minus_delta_a_L_I": reserve,
            "reserve_principal_minors": _principal_minors(reserve),
        },
        "load_one_equality_rejection": {
            "M0": base,
            "p": equality_p,
            "load": equality_load,
            "M0_minus_2pp": equality_signed,
            "determinant": _determinant(equality_signed),
            "strict_pass": False,
        },
    }


def _principal_angle_coframe() -> dict[str, Any]:
    one = [Fraction(1), Fraction(1), Fraction(1), Fraction(1)]
    e_projector = _diag(Fraction(1), Fraction(1), Fraction(1), Fraction(0))
    one_e = [entry for row in _matmul(e_projector, [[x] for x in one]) for entry in row]
    s = sum((entry * entry for entry in one_e), Fraction(0))
    lambda_fixture = Fraction(2)
    factor = 2 * lambda_fixture / s
    z = [
        [Fraction(1, 2), Fraction(1, 2), Fraction(-1, 2), Fraction(-1, 2)],
        [Fraction(1, 2), Fraction(-1, 2), Fraction(1, 2), Fraction(-1, 2)],
    ]
    target_scale = _diag(Fraction(2), Fraction(3))
    t = _matmul(target_scale, z)
    r = _matmul(t, _transpose(t))
    c_columns = [
        [Fraction(1), Fraction(1)],
        [Fraction(-1), Fraction(0)],
        [Fraction(0), Fraction(-1)],
        [Fraction(0), Fraction(0)],
    ]
    gram = _matmul(_transpose(c_columns), c_columns)
    p_f = _matmul(_matmul(c_columns, _inverse(gram)), _transpose(c_columns))
    tail_e = _matmul(_matmul(z, _sub(_identity(4), e_projector)), _transpose(z))
    tail_e_determinant = _determinant(tail_e)
    raw_tail_norm = _trace(tail_e)
    theta = factor * raw_tail_norm
    whitened_frame = _matmul(_matmul(z, p_f), _transpose(z))
    volume = _determinant(whitened_frame)
    w = _matmul(t, c_columns)
    raw_det = _determinant(w)
    normalized_volume = raw_det**2 / (_determinant(gram) * _determinant(r))
    lower = (1 - theta) ** 2
    if (
        _matmul(z, _transpose(z)) != _identity(2)
        or s != 3
        or factor != Fraction(4, 3)
        or min(_principal_minors(tail_e)) < 0
        or tail_e_determinant != 0
        or raw_tail_norm != Fraction(1, 2)
        or theta != Fraction(2, 3)
        or gram != [[Fraction(2), Fraction(1)], [Fraction(1), Fraction(2)]]
        or raw_det != -6
        or volume != Fraction(1, 3)
        or normalized_volume != volume
        or lower != Fraction(1, 9)
    ):
        raise ValueError("principal-angle coframe regression failed")
    return {
        "ambient_one_vector": one,
        "E_projector": e_projector,
        "P_E_one": one_e,
        "s_norm_P_E_one_squared": s,
        "lambda_fixture": lambda_fixture,
        "factor_2lambda_over_s": factor,
        "Z_coisometry": z,
        "Z_Z_star": _matmul(z, _transpose(z)),
        "T_equals_diag_2_3_Z": t,
        "R_TT_star": r,
        "source_columns_C": c_columns,
        "source_gram_B": gram,
        "det_source_gram_B": _determinant(gram),
        "F_projector_C_B_inverse_C_star": p_f,
        "raw_E_tail": tail_e,
        "raw_E_tail_determinant": tail_e_determinant,
        "raw_E_tail_is_positive_rank_one": True,
        "raw_E_tail_operator_norm": raw_tail_norm,
        "Theta": theta,
        "Theta_strictly_below_one": True,
        "physical_columns_W_TC": w,
        "raw_physical_determinant_D": raw_det,
        "whitened_frame_Z_PF_Z_star": whitened_frame,
        "whitened_volume_direct": volume,
        "whitened_volume_from_determinants": normalized_volume,
        "angle_lower_bound_one_minus_Theta_power_dimX": lower,
        "boundary_Theta_one_is_rejected": True,
        "matched_prolate_coframe_inferred": False,
    }


def _augmented_determinant() -> dict[str, Any]:
    raw = [
        [Fraction(2), Fraction(3), Fraction(5)],
        [Fraction(1), Fraction(4), Fraction(2)],
        [Fraction(0), Fraction(1), Fraction(3)],
    ]
    i0 = raw[0][0]
    physical_zero = [raw[1][0], raw[2][0]]
    corrected_plus: Matrix = []
    corrected_odd: Matrix = []
    for row in range(2):
        corrected_plus.append([
            raw[row + 1][column] - raw[0][column] / i0 * physical_zero[row]
            for column in (1, 2)
        ])
        corrected_odd.append([-entry for entry in corrected_plus[-1]])
    raw_det = _determinant(raw)
    plus_det = _determinant(corrected_plus)
    odd_det = _determinant(corrected_odd)

    raw_one = [[Fraction(2), Fraction(3)], [Fraction(1), Fraction(4)]]
    corrected_plus_one = raw_one[1][1] - raw_one[0][1] / raw_one[0][0] * raw_one[1][0]
    corrected_odd_one = -corrected_plus_one
    if (
        raw_det != 16
        or plus_det != 8
        or plus_det != raw_det / i0
        or odd_det != 8
        or odd_det != (-1) ** 2 * raw_det / i0
        or _determinant(raw_one) != 5
        or corrected_plus_one != Fraction(5, 2)
        or corrected_odd_one != Fraction(-5, 2)
        or corrected_odd_one != (-1) ** 1 * _determinant(raw_one) / raw_one[0][0]
    ):
        raise ValueError("augmented determinant regression failed")
    return {
        "dimension_N_2": {
            "raw_augmented_matrix_integral_row_first": raw,
            "integrals_I0_I1_I2": raw[0],
            "raw_determinant": raw_det,
            "plus_corrected_physical_matrix": corrected_plus,
            "plus_corrected_determinant": plus_det,
            "plus_det_augmented_over_I0": raw_det / i0,
            "odd_columns_are_negatives_of_plus_corrected": corrected_odd,
            "odd_sign_factor_minus_one_power_N": Fraction((-1) ** 2),
            "odd_corrected_determinant": odd_det,
            "odd_signed_det_augmented_over_I2": Fraction((-1) ** 2) * raw_det / i0,
        },
        "dimension_N_1_sign_regression": {
            "raw_augmented_matrix": raw_one,
            "raw_determinant": _determinant(raw_one),
            "plus_corrected_scalar": corrected_plus_one,
            "odd_sign_factor_minus_one_power_N": Fraction(-1),
            "odd_corrected_scalar": corrected_odd_one,
            "odd_signed_det_augmented_over_I2": Fraction(-1) * _determinant(raw_one) / raw_one[0][0],
        },
        "actual_prolate_determinant_nonzero_claimed": False,
        "locally_uniform_determinant_convergence_claimed": False,
    }


def _precision_bits(dps: int) -> int:
    return (dps * LOG2_10_UPPER_NUMERATOR + LOG2_10_UPPER_DENOMINATOR - 1) // LOG2_10_UPPER_DENOMINATOR


def _raw(raw: tuple[int, int, int, int]) -> list[object]:
    return [int(raw[0]), str(int(raw[1])), int(raw[2]), int(raw[3])]


def _raw_fraction(raw: tuple[int, int, int, int]) -> Fraction:
    sign, mantissa, exponent, _bits = raw
    value = Fraction(mantissa * (1 if sign == 0 else -1))
    return value * (2**exponent if exponent >= 0 else Fraction(1, 2 ** (-exponent)))


def _power_of_two(exponent: int) -> Fraction:
    return Fraction(2**exponent) if exponent >= 0 else Fraction(1, 2 ** (-exponent))


def _normalize_signed_dyadic(value: int, exponent: int) -> tuple[int, int, int, int]:
    if value == 0:
        return (0, 0, 0, 0)
    sign = 1 if value < 0 else 0
    mantissa = abs(value)
    while mantissa % 2 == 0:
        mantissa //= 2
        exponent += 1
    return (sign, mantissa, exponent, mantissa.bit_length())


def _shift_raw(raw: tuple[int, int, int, int], power: int, direction: int) -> tuple[int, int, int, int]:
    sign, mantissa, exponent, _bits = raw
    signed = -mantissa if sign else mantissa
    base = min(exponent, power)
    shifted = (signed << (exponent - base)) + direction * (1 << (power - base))
    return _normalize_signed_dyadic(shifted, base)


def _guarded_endpoints(
    lower: tuple[int, int, int, int], upper: tuple[int, int, int, int], dps: int,
) -> tuple[tuple[int, int, int, int], tuple[int, int, int, int]]:
    if lower == upper:
        return lower, upper
    scale = 0
    for _sign, mantissa, exponent, bits in (lower, upper):
        if mantissa:
            scale = max(scale, exponent + bits - 1)
    guard = scale - _precision_bits(dps) + SERIALIZATION_GUARD_OFFSET_BITS
    return _shift_raw(lower, guard, -1), _shift_raw(upper, guard, 1)


def _capture(value: object) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    bits = max(int(lower[3]), int(upper[3])) + 48
    with mp.workprec(bits):
        return +mp.mpf(tuple(lower)), +mp.mpf(tuple(upper))


def _serialize_interval(value: object, dps: int) -> dict[str, object]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    lo, hi = _guarded_endpoints(
        tuple(int(part) for part in lower), tuple(int(part) for part in upper), dps,
    )
    scale = 0
    for _sign, mantissa, exponent, bits in (lo, hi):
        if mantissa:
            scale = max(scale, exponent + bits - 1)
    width = _raw_fraction(hi) - _raw_fraction(lo)
    cap = _power_of_two(scale - _precision_bits(dps) + 22)
    if width < 0 or width > cap:
        raise ArithmeticError("serialized interval exceeds the precision-scaled width cap")
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lo), dps + 10), mp.nstr(mp.mpf(hi), dps + 10)],
            "dyadic": {"lower": _raw(lo), "upper": _raw(hi)},
        }


def _iv_fraction(value: Fraction) -> object:
    return mp.iv.mpf(value.numerator) / mp.iv.mpf(value.denominator)


def _iv_fraction_hull(lower: Fraction, upper: Fraction) -> object:
    if lower > upper:
        raise ValueError("reversed rational interval")
    lo = _iv_fraction(lower)._mpi_[0]  # type: ignore[attr-defined]
    hi = _iv_fraction(upper)._mpi_[1]  # type: ignore[attr-defined]
    return mp.iv.mpf((lo, hi))


def _alternating_bounds(terms: Any, target_bits: int) -> tuple[Fraction, Fraction]:
    partial = Fraction(0)
    iterator = iter(terms)
    while True:
        term = next(iterator)
        partial += term
        following = next(iterator)
        if abs(following) < Fraction(1, 2**target_bits):
            return min(partial, partial + following), max(partial, partial + following)
        partial += following


def _zeta_three_interval(dps: int) -> object:
    def terms() -> Any:
        n = 1
        while True:
            sign = 1 if n % 2 else -1
            yield Fraction(5 * sign, 2 * n**3 * comb(2 * n, n))
            n += 1

    lower, upper = _alternating_bounds(terms(), _precision_bits(dps) + 80)
    return _iv_fraction_hull(lower, upper)


def _si_one_interval(dps: int) -> object:
    def terms() -> Any:
        k = 0
        while True:
            yield Fraction((-1) ** k, (2 * k + 1) * factorial(2 * k + 1))
            k += 1

    lower, upper = _alternating_bounds(terms(), _precision_bits(dps) + 80)
    return _iv_fraction_hull(lower, upper)


def _cos_one_series_interval(dps: int) -> object:
    def terms() -> Any:
        k = 0
        while True:
            yield Fraction((-1) ** k, factorial(2 * k))
            k += 1

    lower, upper = _alternating_bounds(terms(), _precision_bits(dps) + 80)
    return _iv_fraction_hull(lower, upper)


def _sin_square_moment(j: int, dps: int) -> object:
    def terms() -> Any:
        k = 1
        while True:
            yield Fraction((-1) ** (k + 1), 2 * factorial(2 * k) * (2 * j + 2 * k + 1))
            k += 1

    lower, upper = _alternating_bounds(terms(), _precision_bits(dps) + 100)
    return _iv_fraction_hull(lower, upper)


def _band_energies(dps: int) -> tuple[object, object]:
    plus = mp.iv.mpf(2) / mp.iv.pi * (
        _si_one_interval(dps) + _cos_one_series_interval(dps) - mp.iv.mpf(1)
    )

    q = mp.iv.mpf(1) / (mp.iv.mpf(4) * mp.iv.pi**2)
    q_upper = _raw_fraction(tuple(int(x) for x in q._mpi_[1]))  # type: ignore[attr-defined]
    target = Fraction(1, 2 ** (_precision_bits(dps) + 90))
    count = 1
    while True:
        tail = q_upper**count * ((count + 1) - count * q_upper) / (1 - q_upper) ** 2
        if tail < target:
            break
        count += 1
    series = mp.iv.mpf(0)
    power = mp.iv.mpf(1)
    for j in range(count):
        series += mp.iv.mpf(j + 1) * power * _sin_square_moment(j, dps)
        power *= q
    tail_iv = _iv_fraction_hull(Fraction(0), tail)
    minus = mp.iv.mpf(2) / mp.iv.pi**3 * (series + tail_iv)
    plus_lo, _ = _capture(plus)
    minus_lo, _ = _capture(minus)
    if plus_lo <= 0 or minus_lo <= 0:
        raise ArithmeticError("band-energy interval is not strictly positive")
    return plus, minus


def _positive_part(value: object) -> object:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    lo_fraction = _raw_fraction(tuple(int(x) for x in lower))
    hi_fraction = _raw_fraction(tuple(int(x) for x in upper))
    if hi_fraction <= 0:
        return mp.iv.mpf(0)
    if lo_fraction >= 0:
        return value
    return mp.iv.mpf(((0, 0, 0, 0), upper))


def _c_theta(length: object, zeta3: object) -> object:
    digamma_quarter = -mp.iv.euler - mp.iv.pi / 2 - 3 * mp.iv.log(2)
    hurwitz_three = mp.iv.pi**3 + 28 * zeta3
    return digamma_quarter - mp.iv.log(mp.iv.pi) + hurwitz_three / (4 * length**2)


def _central_formula(length: object, lam: object, zeta3: object) -> dict[str, object]:
    decimal_a = mp.iv.mpf(461011) / mp.iv.mpf(50000)
    decimal_alpha = mp.iv.mpf(2119209) / mp.iv.mpf(2500000)
    epsilon = decimal_a * length**(mp.iv.mpf(3) / 2) * mp.iv.exp(
        -decimal_alpha * mp.iv.sqrt(length)
    )
    ctheta = _c_theta(length, zeta3)
    raw_lower = 2 * mp.iv.cos(1) * (1 - epsilon) * lam - length - ctheta
    return {
        "epsilon_L": epsilon,
        "C_theta": ctheta,
        "uncapped_lower_expression": raw_lower,
        "V_L_positive_part": _positive_part(raw_lower),
    }


def _ceil_sqrt_half_integer(p: int) -> int:
    candidate = isqrt((p + 1) // 2)
    while 2 * candidate * candidate < p:
        candidate += 1
    while candidate > 0 and 2 * (candidate - 1) * (candidate - 1) >= p:
        candidate -= 1
    return candidate


def _interval_data(p: int, dps: int) -> dict[str, Any]:
    if f"mpmath.iv {mp.__version__}" != EXPECTED_LIBRARY:
        raise RuntimeError("pinned mpmath.iv version is not active")
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(p) / 2
        ell = mp.iv.log(lam)
        length = 2 * ell
        sqrt_n = _ceil_sqrt_half_integer(p)
        projection = (
            mp.iv.mpf(6006) / 1000 * ell
            / (mp.iv.pi * mp.iv.mpf(sqrt_n + 1))
        )
        root_five = mp.iv.sqrt(5)
        low_eigen = 4 - root_five
        high_eigen = 4 + root_five
        soft_moment = (1 + root_five) ** 2
        zeta3 = _zeta_three_interval(dps)
        band_plus, band_minus = _band_energies(dps)
        schedule_central = _central_formula(length, lam, zeta3)
        probe_length = mp.iv.mpf(400)
        probe_lambda = mp.iv.exp(200)
        probe_central = _central_formula(probe_length, probe_lambda, zeta3)
        schedule_v = schedule_central["V_L_positive_part"]
        probe_v = probe_central["V_L_positive_part"]
        probe_v_lo, _ = _capture(probe_v)
        _, epsilon_probe_hi = _capture(probe_central["epsilon_L"])
        if probe_v_lo <= 0 or epsilon_probe_hi >= 1:
            raise ArithmeticError("central formula-scale probe failed")
        return {
            "noncommuting_soft_spectrum": {
                "sqrt_5": _serialize_interval(root_five, dps),
                "lambda_min_4_minus_sqrt_5": _serialize_interval(low_eigen, dps),
                "lambda_max_4_plus_sqrt_5": _serialize_interval(high_eigen, dps),
                "clipped_square_moment_6_plus_2sqrt_5": _serialize_interval(soft_moment, dps),
                "clipped_square_moment_at_most_16": True,
                "minimum_strictly_above_1": True,
            },
            "band_energies_delta_1": {
                "delta": Fraction(1),
                "b_plus": _serialize_interval(band_plus, dps),
                "b_minus": _serialize_interval(band_minus, dps),
                "both_strictly_positive": True,
                "fourier_transform_plus": "2*sin(s/2)/s with removable value 1 at s=0",
                "fourier_transform_minus": "4*sqrt(2)*pi*i*sin(s/2)/(s^2-4*pi^2)",
            },
            "sqrt_projection_schedule": {
                "lambda": Fraction(p, 2),
                "ell_log_lambda": _serialize_interval(ell, dps),
                "L_2log_lambda": _serialize_interval(length, dps),
                "N_rule": "ceil(sqrt(lambda))",
                "N": sqrt_n,
                "C_K_safe_input_fraction_text": "6006/1000",
                "C_K_safe_rational": Fraction(6006, 1000),
                "projection_coefficient_CK_loglambda_over_pi_Nplus1": _serialize_interval(projection, dps),
                "signed_residual_or_coframe_transfer_claimed": False,
            },
            "central_outlier_schedule_diagnostic": {
                "lambda": Fraction(p, 2),
                "L": _serialize_interval(length, dps),
                "delta": Fraction(1),
                "C_B": Fraction(1),
                "PNT_A_exact_decimal": "9.22022",
                "PNT_alpha_exact_decimal": "0.8476836",
                "epsilon_L": _serialize_interval(schedule_central["epsilon_L"], dps),
                "C_theta": _serialize_interval(schedule_central["C_theta"], dps),
                "uncapped_lower_expression": _serialize_interval(schedule_central["uncapped_lower_expression"], dps),
                "V_L_positive_part": _serialize_interval(schedule_v, dps),
                "plus_Rayleigh_lower_b_plus_times_V_L": _serialize_interval(band_plus * schedule_v, dps),
                "minus_Rayleigh_lower_b_minus_times_V_L": _serialize_interval(band_minus * schedule_v, dps),
                "finite_diagnostic_only": True,
                "positive_signed_floor_claimed": False,
            },
            "central_formula_scale_probe": {
                "L_probe_exact": Fraction(400),
                "lambda_probe_exp_200": _serialize_interval(probe_lambda, dps),
                "delta": Fraction(1),
                "C_B": Fraction(1),
                "epsilon_L": _serialize_interval(probe_central["epsilon_L"], dps),
                "epsilon_strictly_below_one": True,
                "C_theta": _serialize_interval(probe_central["C_theta"], dps),
                "uncapped_lower_expression": _serialize_interval(probe_central["uncapped_lower_expression"], dps),
                "V_L_positive_part": _serialize_interval(probe_v, dps),
                "V_L_strictly_positive": True,
                "plus_Rayleigh_lower_b_plus_times_V_L": _serialize_interval(band_plus * probe_v, dps),
                "minus_Rayleigh_lower_b_minus_times_V_L": _serialize_interval(band_minus * probe_v, dps),
                "formula_scale_regression_only": True,
                "finite_prolate_or_Weil_certificate": False,
                "schedule_datum": False,
            },
            "special_constants": {
                "zeta_3_via_Apery_series": _serialize_interval(zeta3, dps),
                "hurwitz_identity": "zeta(3,1/4)=pi^3+28*zeta(3)",
                "digamma_identity": "digamma(1/4)=-EulerGamma-pi/2-3*log(2)",
            },
        }
    finally:
        mp.iv.dps = old


def _validate_admissions() -> None:
    if (
        not isinstance(SOURCE_ADMISSIONS, dict)
        or any(type(value) is not bool for value in SOURCE_ADMISSIONS.values())
        or any(SOURCE_ADMISSIONS.values())
    ):
        raise ValueError("source admission violates the claim boundary")


def produce(lambda_numerator_text: str, dps_text: str) -> dict[str, Any]:
    p_text, p = _canonical_positive_text(lambda_numerator_text, "lambda_numerator_text", 5)
    precision_text, precision = _canonical_positive_text(dps_text, "dps_text", 50)
    if p > 999:
        raise ValueError("lambda numerator exceeds the producer work budget")
    if precision > 10000:
        raise ValueError("dps exceeds the producer work budget")
    if p % 2 == 0:
        raise ValueError("lambda numerator must be odd")
    _validate_admissions()
    source_lock = _validated_source_lock()
    clipped = _ideal_clipped_defect()
    soft = _source_soft_and_leverage()
    odd = _capped_odd_rank_one()
    angle = _principal_angle_coframe()
    augmented = _augmented_determinant()
    intervals = _interval_data(p, precision)
    checks = {
        "clipped_boundary_equality_rejected": not clipped["boundary_equality_rejected"]["strict_pass"],
        "positive_outlier_invariance_exact": clipped["clipped_defect_is_positive_outlier_invariant"],
        "noncommuting_soft_model_reconstructed": not soft["noncommuting_soft_block"]["commutation_assumed"],
        "leverage_orientation_loss_reconstructed": soft["leverage_excess_orientation"]["rotated_scalar_lower_bound"] < 0,
        "scalar_excess_constant_sharp": soft["sharp_scalar_excess_moment"]["equality_is_sharp_not_strict"],
        "odd_capped_identity_exact": odd["strict_reserve_model"]["load_direct"] == odd["strict_reserve_model"]["load_from_capped_identity"],
        "odd_reserve_strict": min(odd["strict_reserve_model"]["reserve_principal_minors"]) > 0,
        "odd_load_one_rejected": not odd["load_one_equality_rejection"]["strict_pass"],
        "principal_angle_factor_exact": angle["factor_2lambda_over_s"] == Fraction(4, 3),
        "source_gram_retained": angle["source_gram_B"] != _identity(2),
        "whitened_volume_exact": angle["whitened_volume_direct"] == Fraction(1, 3),
        "augmented_column_operations_exact": augmented["dimension_N_2"]["plus_corrected_determinant"] == Fraction(8),
        "central_probe_not_promoted": intervals["central_formula_scale_probe"]["formula_scale_regression_only"],
        "sqrt_schedule_not_promoted": not intervals["sqrt_projection_schedule"]["signed_residual_or_coframe_transfer_claimed"],
    }
    if not all(checks.values()):
        raise ValueError("soft-defect/prolate-angle audit check failed")

    payload = _encode({
        "schema": SCHEMA,
        "source_lock": source_lock,
        "inputs": {
            "lambda_numerator_text": p_text,
            "lambda_denominator_text": "2",
            "dps_text": precision_text,
        },
        "terminal_state": TERMINAL_STATE,
        "source_conventions": {
            "locked_conventions": LOCKED_CONVENTIONS,
            "locked_formulas": LOCKED_FORMULAS,
        },
        "claim_boundary": {
            "claim_class": CLAIM_CLASS,
            "proved": CLAIM_SCOPE["proved"],
            "not_proved": CLAIM_SCOPE["not_proved"],
            "source_admissions": SOURCE_ADMISSIONS,
        },
        "certificate": {
            "ideal_clipped_defect": clipped,
            "source_soft_and_leverage": soft,
            "capped_odd_rank_one": odd,
            "principal_angle_coframe": angle,
            "augmented_determinant": augmented,
            "transcendental_intervals": intervals,
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
    _assert_strict_json(payload)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
