#!/usr/bin/env python3
"""Clean-room replay for localized moment and signed Schur regressions.

This module does not import the producer.  It reconstructs the exact models
from integer inputs, validates source bytes, and binds its report to the raw
producer artifact.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from math import gcd, isqrt
from pathlib import Path
import re
from typing import Any


SCHEMA = "xi-prolate-localized-moment-source-whitened-schur-v1"
STATUS = "LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR_COMPONENT"
PRODUCER_RESULT = "LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR_COMPONENT_PASS"
REPLAY_RESULT = "LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR_COMPONENT_REPLAY_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR.md"
LOCK = "LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-localized-moment-source-whitened-schur-source-lock-v1"

PINNED_HASHES = {
    NOTE: "39695c4823f19f1a03b9e9434a88763564cc0e2e086a12b65412d2551b5f4982",
    LOCK: "fd8b2296e653910fd72ea6d1311e3f1512bfd697f5ea91d3d763f71013f51941",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_INTEGER_TEXT = re.compile(r"0|-?[1-9][0-9]*")

LOCKED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension; the physical logarithmic interval is [-log(lambda),log(lambda)]",
    "fourier_sign": "fhat(t)=integral f(y)*exp(-i*t*y) dy and Plancherel measure is dt/(2*pi)",
    "prime_endpoint": "every prime power n<=lambda^2 is included and translations at magnitude 2*log(lambda) vanish by zero extension",
    "prime_sign": "m_lambda=2*theta_prime-2*sum Lambda(n)/sqrt(n)*cos(t*log(n))",
    "inversion": "multiplicatively Jf(u)=f(u^(-1)); in the additive logarithmic coordinate Jf(y)=f(-y)",
    "source_normalization": "all prolate combinations use the source zero-Lebesgue-integral normalization, never unit normalization",
    "strictness": "equality in a high margin, theta=1, rho=g, or a zero quotient-relative floor is a rejection",
    "finite_parity": "Fourier residue class is not identified with inversion parity at finite lambda; (I+J)/2 and (I-J)/2 remain explicit",
    "artifact_scope": "p and dps label exact rational theorem-regression models, not physical prolate-Weil pilot matrices or an asymptotic schedule",
    "arithmetic": "all component matrices, selector weights, moments, contractions, and reserves are exact reduced rationals; binary64 JSON numbers are forbidden",
}

LOCKED_FORMULAS = {
    "upper_one_dual": "sup_(0<=alpha<=1,int alpha=1) int alpha*x*dmu = inf_a(a+int(x-a)_+*dmu)",
    "localized_prime_energy": "Mtop_H=sup_alpha int alpha*S_lambda^2*dmu_H and abs(ell_H(w)-ell_H(b))<=2*sqrt(Mtop_H)",
    "lower_one_variance": "ell_mu(w)>=m-sigma*sqrt(d-1), m=d^(-1)int w*dmu, sigma^2=d^(-1)int(w-m)^2*dmu",
    "stop_loss_witness": "for d>1 and sigma>0, eta=d*sigma/(2*sqrt(d-1)), g=m+(2-d)*sigma/(2*sqrt(d-1)), and V(g)<=eta",
    "matrix_variance": "lambda_min(A)>=tr(A)/n-sqrt((n-1)/n*tr((A-tr(A)I/n)^2))",
    "trace_square": "tr((P_H*T_w*P_H)^2)=double_integral w(s)w(t)|K_H(s,t)|^2 ds dt/(2*pi)^2",
    "source_metric": "on X0=(ker A)^perp, Delta=(AA*)^dagger on K=ran(A) and <Ax,Delta Ax>=||x||^2",
    "positive_source": "G_plus=g*A* A+(Q_X*X_K*A)*(Q_X*X_K*A), never g*I unless A is an isometry",
    "shorted_contraction": "A*S_sh*A=G_plus-N*N with N=(I-Y_H*Y_H*/g)^(-1/2)*Y_K*A; theta=||N*G_plus^(-1/2)||^2<1",
    "full_signed_feature": "for B=gI+F*J*F and M_H=J+F_H*F_H*/g, S_B=gI+F_K*M_H^(-1)*F_K",
    "full_signed_contraction": "if M_H^(-1)=L_plus-L_minus, G=g*A*A+(sqrt(L_plus)*F_K*A)*(sqrt(L_plus)*F_K*A), N=sqrt(L_minus)*F_K*A, then B>0 iff B_HH>0 and ||N*G^(-1/2)||^2<1",
    "coframe_necessity": "gI-R_KK+C_/K>=mu*Delta implies A*A>=mu/(g+||C_/K||)*I",
}

CLAIM_SCOPE = {
    "proved": [
        "the upper-one stop-gain dual and localized prime-energy sharpening of the trimmed-mean comparison",
        "the sharp lower-one mean--variance floor with explicit strict stop-loss witnesses and edge cases",
        "the Hermitian trace--variance minimum-eigenvalue floor and its projection-kernel trace-square reconstruction",
        "the exact source-whitened positive-shorted contraction criterion with the g*A*A source metric retained",
        "the exact complete signature-feature Schur identity and contraction criterion for the original signed operator",
        "the quantitative physical coframe necessity and exact rational separation models",
    ],
    "not_proved": [
        "a localized prime-energy or covariance margin on a common unbounded schedule",
        "the prescribed separate 0 mod 4 even and 2 mod 4 odd growing prolate coframes",
        "a growing-label physical coframe constant",
        "a source-whitened contraction reserve for the physical prolate--Weil operator",
        "a positive signed floor in either parity sector",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "cached_weil_matrix_read": False,
    "zeta_zero_table_read": False,
    "zeros_assumed_real": False,
    "global_weil_positivity_assumed": False,
    "prime_power_endpoint_omitted": False,
    "lambda_squared_mixed_with_lambda": False,
    "prime_block_sign_changed": False,
    "inversion_reflection_dropped": False,
    "unit_source_normalization_substituted": False,
    "selector_capacity_omitted": False,
    "odd_pole_surcharge_omitted": False,
    "shorted_criterion_claimed_necessary_for_original": False,
    "source_metric_replaced_by_identity": False,
    "finite_fourier_residue_declared_inversion_parity": False,
    "physical_schedule_bound_claimed": False,
    "signed_sector_floor_claimed": False,
    "equation_5_2_claimed": False,
    "determinant_limit_claimed": False,
    "nonpositive_complementary_gap_reported_as_pass": False,
    "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence": False,
    "rh_proved": False,
}

ARITHMETIC = {
    "precision_mode": "exact rational arithmetic",
    "raw_interval_or_ball_output_applicable": False,
    "library": "Python fractions.Fraction",
    "shared_library_with_verifier": True,
    "independent_formula_trees": True,
    "independence_limitation": "producer and replay share Python integer and Fraction arithmetic",
}

Matrix = list[list[Fraction]]


class ReplayError(ValueError):
    """Raised when an artifact or an independently rebuilt identity fails."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _reject_number(token: str) -> None:
    raise ReplayError(f"binary64 or non-integer JSON number rejected: {token}")


def _unique_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _strict_json_loads(raw: bytes | str, label: str) -> Any:
    try:
        text = raw.decode("utf-8") if isinstance(raw, bytes) else raw
    except UnicodeDecodeError as exc:
        raise ReplayError(f"{label} is not UTF-8") from exc
    try:
        value = json.loads(
            text,
            parse_float=_reject_number,
            parse_constant=_reject_number,
            object_pairs_hook=_unique_object,
        )
    except (json.JSONDecodeError, TypeError) as exc:
        raise ReplayError(f"invalid {label}") from exc
    _validate_json(value)
    return value


def _validate_json(value: Any, path: str = "payload") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path}")
    if value is None or isinstance(value, (str, bool, int)):
        return
    if isinstance(value, list):
        for index, item in enumerate(value):
            _validate_json(item, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, item in value.items():
            if not isinstance(key, str):
                raise ReplayError(f"non-string key at {path}")
            _validate_json(item, f"{path}.{key}")
        return
    raise ReplayError(f"unsupported JSON value at {path}")


def _same(left: Any, right: Any) -> bool:
    return type(left) is type(right) and left == right


def _int(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ReplayError(f"{label} must be an exact integer")
    if value < minimum:
        raise ReplayError(f"{label} is below its minimum")
    return value


def _fraction_record(value: Fraction) -> dict[str, str]:
    return {"numerator": str(value.numerator), "denominator": str(value.denominator)}


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return _fraction_record(value)
    if isinstance(value, list):
        return [_encode(item) for item in value]
    if isinstance(value, tuple):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    return value


def _parse_rational(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"{label} is not a rational record")
    numerator = value["numerator"]
    denominator = value["denominator"]
    if (
        not isinstance(numerator, str) or not _INTEGER_TEXT.fullmatch(numerator)
        or not isinstance(denominator, str) or not _INTEGER_TEXT.fullmatch(denominator)
    ):
        raise ReplayError(f"{label} has noncanonical integer text")
    p, q = int(numerator), int(denominator)
    if q <= 0 or gcd(abs(p), q) != 1:
        raise ReplayError(f"{label} is not reduced")
    return Fraction(p, q)


def _walk_rationals(value: Any, path: str = "payload") -> None:
    if isinstance(value, dict):
        if set(value) == {"numerator", "denominator"}:
            _parse_rational(value, path)
            return
        for key, child in value.items():
            _walk_rationals(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _walk_rationals(child, f"{path}[{index}]")


def _dims(matrix: Matrix) -> tuple[int, int]:
    height = len(matrix)
    width = len(matrix[0]) if height else 0
    if any(len(row) != width for row in matrix):
        raise ReplayError("ragged matrix")
    return height, width


def _T(matrix: Matrix) -> Matrix:
    height, width = _dims(matrix)
    if height == 0:
        return [[] for _ in range(width)]
    return [list(column) for column in zip(*matrix)]


def _product(left: Matrix, right: Matrix) -> Matrix:
    lh, lw = _dims(left)
    rh, rw = _dims(right)
    if lw != rh:
        raise ReplayError("matrix product mismatch")
    result: Matrix = []
    right_columns = _T(right)
    for row in left:
        result.append([
            sum((a * b for a, b in zip(row, column)), Fraction(0))
            for column in right_columns
        ])
    if len(result) != lh or (result and len(result[0]) != rw):
        raise ReplayError("matrix product shape failure")
    return result


def _plus(left: Matrix, right: Matrix) -> Matrix:
    if _dims(left) != _dims(right):
        raise ReplayError("matrix sum mismatch")
    return [[a + b for a, b in zip(lrow, rrow)]
            for lrow, rrow in zip(left, right)]


def _minus(left: Matrix, right: Matrix) -> Matrix:
    if _dims(left) != _dims(right):
        raise ReplayError("matrix difference mismatch")
    return [[a - b for a, b in zip(lrow, rrow)]
            for lrow, rrow in zip(left, right)]


def _times(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _eye(size: int) -> Matrix:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _diagonal(values: list[Fraction]) -> Matrix:
    return [[value if i == j else Fraction(0)
             for j, value in enumerate(values)] for i in range(len(values))]


def _det(matrix: Matrix) -> Fraction:
    height, width = _dims(matrix)
    if height != width:
        raise ReplayError("determinant of nonsquare matrix")
    if height == 0:
        return Fraction(1)
    if height == 1:
        return matrix[0][0]
    return sum(
        (
            (-1 if column % 2 else 1)
            * matrix[0][column]
            * _det([
                row[:column] + row[column + 1:]
                for row in matrix[1:]
            ])
            for column in range(width)
        ),
        Fraction(0),
    )


def _inv(matrix: Matrix) -> Matrix:
    height, width = _dims(matrix)
    if height != width:
        raise ReplayError("inverse of nonsquare matrix")
    augmented = [row[:] + basis[:] for row, basis in zip(matrix, _eye(height))]
    for column in range(height):
        pivot = next((row for row in range(column, height)
                      if augmented[row][column]), None)
        if pivot is None:
            raise ReplayError("singular matrix")
        augmented[column], augmented[pivot] = augmented[pivot], augmented[column]
        scale = augmented[column][column]
        augmented[column] = [entry / scale for entry in augmented[column]]
        for row in range(height):
            if row == column:
                continue
            scale = augmented[row][column]
            augmented[row] = [
                entry - scale * pivot_entry
                for entry, pivot_entry in zip(augmented[row], augmented[column])
            ]
    return [row[height:] for row in augmented]


def _trace(matrix: Matrix) -> Fraction:
    height, width = _dims(matrix)
    if height != width:
        raise ReplayError("trace of nonsquare matrix")
    return sum((matrix[i][i] for i in range(height)), Fraction(0))


def _square_root(value: Fraction) -> Fraction:
    if value < 0:
        raise ReplayError("negative square")
    p = isqrt(value.numerator)
    q = isqrt(value.denominator)
    if p * p != value.numerator or q * q != value.denominator:
        raise ReplayError("non-square rational")
    return Fraction(p, q)


def _unit_atom_extreme(values: list[Fraction], maximize: bool) -> tuple[Fraction, list[Fraction]]:
    if not values:
        raise ReplayError("empty atom model")
    target = max(values) if maximize else min(values)
    index = values.index(target)
    allocation = [Fraction(i == index) for i in range(len(values))]
    return target, allocation


def _lower_dual(values: list[Fraction]) -> Fraction:
    candidates = values
    return max(
        (
            g - sum((max(g - value, 0) for value in values), Fraction(0))
            for g in candidates
        )
    )


def _upper_dual(values: list[Fraction]) -> tuple[Fraction, Fraction]:
    candidates = values
    objectives = [
        a + sum((max(value - a, 0) for value in values), Fraction(0))
        for a in candidates
    ]
    optimum = min(objectives)
    return optimum, candidates[objectives.index(optimum)]


def _localized_model() -> dict[str, Any]:
    weights = [Fraction(1), Fraction(1)]
    b = [Fraction(10), Fraction(10)]
    prime = [Fraction(4), Fraction(-4)]
    combined = [arch - 2 * arithmetic for arch, arithmetic in zip(b, prime)]
    energy = [arithmetic ** 2 for arithmetic in prime]
    ell_b, allocation_b = _unit_atom_extreme(b, False)
    ell_w, allocation_w = _unit_atom_extreme(combined, False)
    top, allocation_top = _unit_atom_extreme(energy, True)
    dual_top, threshold = _upper_dual(energy)
    if _lower_dual(combined) != ell_w or dual_top != top:
        raise ReplayError("selector dual reconstruction failed")
    d = sum(weights, Fraction(0))
    mean = sum(combined, Fraction(0)) / d
    pairwise = sum(
        (
            weights[i] * weights[j] * (combined[i] - combined[j]) ** 2
            for i in range(len(combined))
            for j in range(len(combined))
        ),
        Fraction(0),
    )
    variance = pairwise / (2 * d * d)
    sigma = _square_root(variance)
    lower = mean - sigma * _square_root(d - 1)
    eta = d * sigma / (2 * _square_root(d - 1))
    g = lower + eta
    stop_loss = sum((max(g - value, 0) for value in combined), Fraction(0))
    total = sum(energy, Fraction(0))
    localized_floor = ell_b - 2 * _square_root(top)
    c_strict, c_equal = Fraction(1), Fraction(2)
    strict_reserve = g - stop_loss - c_strict
    equality_reserve = g - stop_loss - c_equal
    left = (ell_b - c_strict) ** 2
    right = 4 * total
    if (
        combined != [Fraction(2), Fraction(18)] or ell_b != 10 or ell_w != 2
        or top != 16 or total != 32 or localized_floor != 2
        or mean != 10 or variance != 64 or sigma != 8 or lower != 2
        or eta != 8 or g != 10 or stop_loss != 8
        or strict_reserve != 1 or equality_reserve != 0 or not left < right
    ):
        raise ReplayError("independent localized model failed")
    return {
        "atom_weights": weights,
        "archimedean_values": b,
        "prime_values": prime,
        "combined_values": combined,
        "lower_archimedean_allocation": allocation_b,
        "lower_combined_allocation": allocation_w,
        "upper_energy_allocation": allocation_top,
        "ell_b": ell_b,
        "ell_w": ell_w,
        "localized_prime_energy": top,
        "stop_gain_threshold": threshold,
        "stop_gain_dual_value": dual_top,
        "total_prime_second_moment": total,
        "localized_comparison_floor": localized_floor,
        "mean": mean,
        "variance": variance,
        "sigma": sigma,
        "mean_variance_floor": lower,
        "stop_loss_g": g,
        "stop_loss_eta": eta,
        "stop_loss_V": stop_loss,
        "strict_margin": {
            "c_minus": c_strict,
            "reserve": strict_reserve,
            "passes": strict_reserve > 0,
        },
        "equality_boundary": {
            "c_minus": c_equal,
            "reserve": equality_reserve,
            "passes": equality_reserve > 0,
        },
        "total_moment_separated_test": {
            "left_square": left,
            "right_four_M": right,
            "passes": left > right,
        },
    }


def _matrix_model() -> dict[str, Any]:
    matrix = [
        [Fraction(306, 25), Fraction(-192, 25)],
        [Fraction(-192, 25), Fraction(194, 25)],
    ]
    n = 2
    trace = _trace(matrix)
    mean = trace / n
    matrix_square = _product(matrix, matrix)
    centered_trace_square = _trace(matrix_square) - trace * trace / n
    variance = centered_trace_square / n
    sigma = _square_root(variance)
    floor = mean - sigma
    centered = _minus(matrix, _times(mean, _eye(n)))
    centered_square = _product(centered, centered)
    shifted = _minus(matrix, _times(floor, _eye(n)))
    if (
        centered_trace_square != 128 or _trace(centered_square) != 128
        or _det(matrix) != 36 or _det(shifted) != 0
        or shifted[0][0] < 0 or shifted[1][1] < 0
    ):
        raise ReplayError("independent matrix-variance model failed")
    return {
        "matrix": matrix,
        "dimension": n,
        "trace": trace,
        "mean": mean,
        "centered_matrix": centered,
        "centered_square": centered_square,
        "trace_centered_square": centered_trace_square,
        "variance": variance,
        "sigma": sigma,
        "trace_variance_floor": floor,
        "determinant": _det(matrix),
        "shifted_by_floor": shifted,
        "characteristic_at_floor": _det(shifted),
        "floor_is_exact": True,
    }


def _edge_model() -> dict[str, Any]:
    zero_weights = [Fraction(1), Fraction(2)]
    zero_values = [Fraction(5), Fraction(5)]
    zero_mass = sum(zero_weights, Fraction(0))
    zero_mean = sum((a * b for a, b in zip(zero_weights, zero_values)), Fraction(0)) / zero_mass
    zero_variance = sum((a * b * b for a, b in zip(zero_weights, zero_values)), Fraction(0)) / zero_mass - zero_mean ** 2
    zero_ell = min(zero_values)
    zero_allocation = [Fraction(1), Fraction(0)]
    zero_g = zero_mean
    zero_V = sum((a * max(zero_g - b, 0)
                  for a, b in zip(zero_weights, zero_values)), Fraction(0))

    one_weights = [Fraction(1, 2), Fraction(1, 2)]
    one_values = [Fraction(6), Fraction(14)]
    one_mass = sum(one_weights, Fraction(0))
    one_mean = sum((a * b for a, b in zip(one_weights, one_values)), Fraction(0))
    one_variance = sum((a * (b - one_mean) ** 2
                        for a, b in zip(one_weights, one_values)), Fraction(0))
    one_sigma = _square_root(one_variance)
    one_ell = sum((a * b for a, b in zip(one_weights, one_values)), Fraction(0))
    c = Fraction(8)
    y = Fraction(3)
    g = one_mean + y
    eta = _square_root(y * y + one_variance)
    quadratic = (y + eta) / 2
    V = sum((a * max(g - b, 0)
             for a, b in zip(one_weights, one_values)), Fraction(0))
    reserve = g - V - c
    if (
        zero_variance != 0 or zero_ell != 5 or zero_V != 0
        or one_mass != 1 or one_mean != 10 or one_variance != 16
        or one_sigma != 4 or one_ell != one_mean
        or eta != 5 or quadratic != 4 or V != Fraction(7, 2)
        or reserve != Fraction(3, 2)
    ):
        raise ReplayError("independent mean-variance edge model failed")
    return {
        "sigma_zero": {
            "weights": zero_weights,
            "values": zero_values,
            "mass": zero_mass,
            "mean": zero_mean,
            "variance": zero_variance,
            "ell": zero_ell,
            "allocation": zero_allocation,
            "g": zero_g,
            "V": zero_V,
            "c_minus": Fraction(4),
            "reserve": zero_g - zero_V - 4,
            "passes": zero_g - zero_V - 4 > 0,
        },
        "mass_one_nonconstant": {
            "weights": one_weights,
            "values": one_values,
            "mass": one_mass,
            "mean": one_mean,
            "variance": one_variance,
            "sigma": one_sigma,
            "ell": one_ell,
            "allocation": one_weights,
            "c_minus": c,
            "y": y,
            "g": g,
            "eta": eta,
            "quadratic_stop_loss_bound": quadratic,
            "V": V,
            "reserve": reserve,
            "passes": reserve > 0,
        },
    }


def _shorted_model() -> dict[str, Any]:
    g = Fraction(1)
    A = _eye(2)
    X = [[Fraction(2), Fraction(0), Fraction(0)]]
    Y = [
        [Fraction(1), Fraction(0), Fraction(1, 2)],
        [Fraction(0), Fraction(0), Fraction(1, 2)],
        [Fraction(0), Fraction(0), Fraction(1, 2)],
    ]
    C = _product(_T(X), X)
    R = _product(_T(Y), Y)
    X_K = [[Fraction(2), Fraction(0)]]
    X_H = [[Fraction(0)]]
    projector_complement = [[Fraction(1)]] if _product(X_H, _T(X_H)) == [[0]] else [[0]]
    C_short = _product(_product(_T(X_K), projector_complement), X_K)
    R_KK = [row[:2] for row in R[:2]]
    R_KH = [[R[row][2]] for row in range(2)]
    R_HH = R[2][2]
    direct = _minus(_plus(_eye(2), C_short), R_KK)

    Y_K = [row[:2] for row in Y]
    Y_H = [[row[2]] for row in Y]
    Z = _product(Y_H, _T(Y_H))
    feature_resolvent = _inv(_minus(_eye(3), Z))
    effective = _product(_product(_T(Y_K), feature_resolvent), Y_K)
    G_plus = _plus(_product(_T(A), A), C_short)
    schur = _minus(G_plus, effective)
    physical_round_trip = _plus(
        R_KK,
        _times(1 / (g - R_HH), _product(R_KH, _T(R_KH))),
    )
    theta = max(effective[i][i] / G_plus[i][i] for i in range(2))
    alpha = min(G_plus[i][i] for i in range(2))
    floor = (1 - theta) * alpha
    rho = R_HH
    beta = max(R_KK[i][i] for i in range(2))
    eta = 1 - rho
    mu = min(direct[i][i] for i in range(2))
    left, right = rho * beta, eta * mu
    scaled_A = _diagonal([Fraction(2), Fraction(1)])
    scaled_delta = _inv(_product(scaled_A, _T(scaled_A)))
    scaled_baseline = _product(_T(scaled_A), scaled_A)
    scaled_positive = _product(_product(_T(scaled_A), C_short), scaled_A)
    scaled_G = _plus(scaled_baseline, scaled_positive)
    scaled_negative = _product(_product(_T(scaled_A), effective), scaled_A)
    scaled_pulled_schur = _product(_product(_T(scaled_A), schur), scaled_A)
    scaled_theta = max(scaled_negative[i][i] / scaled_G[i][i] for i in range(2))
    scaled_alpha = min(scaled_G[i][i] for i in range(2))
    scaled_floor = (1 - scaled_theta) * scaled_alpha
    scaled_physical_floor = _times(scaled_floor, scaled_delta)
    if (
        effective != physical_round_trip
        or G_plus != _diagonal([Fraction(5), Fraction(1)])
        or effective != _diagonal([Fraction(2), Fraction(0)])
        or schur != _diagonal([Fraction(3), Fraction(1)])
        or theta != Fraction(2, 5) or floor != Fraction(3, 5)
        or not left > right
        or scaled_baseline != _diagonal([Fraction(4), Fraction(1)])
        or scaled_G != _diagonal([Fraction(20), Fraction(1)])
        or scaled_negative != _diagonal([Fraction(8), Fraction(0)])
        or scaled_pulled_schur != _diagonal([Fraction(12), Fraction(1)])
        or scaled_theta != Fraction(2, 5) or scaled_floor != Fraction(3, 5)
    ):
        raise ReplayError("independent shorted contraction failed")
    return {
        "g": g,
        "A": A,
        "Delta": _eye(2),
        "X_feature": X,
        "Y_feature": Y,
        "C": C,
        "R": R,
        "C_short": C_short,
        "R_KK": R_KK,
        "R_KH": R_KH,
        "R_HH": R_HH,
        "high_block": g - R_HH,
        "direct_low": direct,
        "round_trip_correction": _minus(effective, R_KK),
        "effective_negative_load": effective,
        "G_plus": G_plus,
        "exact_schur": schur,
        "theta": theta,
        "alpha": alpha,
        "certified_quotient_floor": floor,
        "scalar_reserve": {
            "rho": rho,
            "beta": beta,
            "eta": eta,
            "mu": mu,
            "left_rho_beta": left,
            "right_eta_mu": right,
            "passes": left < right,
        },
        "anisotropic_contraction_passes": theta < 1,
        "nonisometric_source_metric": {
            "A": scaled_A,
            "Delta": scaled_delta,
            "g_A_star_A": scaled_baseline,
            "wrong_g_identity": _eye(2),
            "positive_pullback": scaled_positive,
            "G_plus": scaled_G,
            "negative_pullback": scaled_negative,
            "pulled_schur": scaled_pulled_schur,
            "theta": scaled_theta,
            "alpha": scaled_alpha,
            "source_floor": scaled_floor,
            "physical_quotient_floor": scaled_physical_floor,
        },
    }


def _signed_feature_model() -> dict[str, Any]:
    g = Fraction(1)
    signature = _diagonal([Fraction(1), Fraction(-1)])
    feature = [[Fraction(2), Fraction(1)], [Fraction(1), Fraction(0)]]
    signed_gram = _product(_product(_T(feature), signature), feature)
    B = _plus(_eye(2), signed_gram)
    high = B[1][1]
    schur = B[0][0] - B[0][1] * B[1][0] / high
    F_K = [[row[0]] for row in feature]
    F_H = [[row[1]] for row in feature]
    M = _plus(signature, _product(F_H, _T(F_H)))
    M_inverse = _inv(M)
    feature_schur = 1 + _product(_product(_T(F_K), M_inverse), F_K)[0][0]
    A = [[Fraction(2)]]
    gram = _product(_T(A), A)[0][0]
    delta = 1 / gram
    T = _product(F_K, A)
    positive = _diagonal([Fraction(1, 2), Fraction(0)])
    negative = _diagonal([Fraction(0), Fraction(1)])
    positive_pullback = _product(_product(_T(T), positive), T)[0][0]
    negative_pullback = _product(_product(_T(T), negative), T)[0][0]
    G = gram + positive_pullback
    pulled = gram * schur
    theta = negative_pullback / G
    source_floor = (1 - theta) * G
    physical_floor = source_floor * delta
    boundary_F = [[Fraction(0), Fraction(1)], [Fraction(1), Fraction(0)]]
    boundary_B = _plus(_eye(2), _product(_product(_T(boundary_F), signature), boundary_F))
    boundary_F_H = [[row[1]] for row in boundary_F]
    boundary_M = _plus(signature, _product(boundary_F_H, _T(boundary_F_H)))
    boundary_M_inverse = _inv(boundary_M)
    boundary_G = Fraction(1)
    boundary_negative = Fraction(1)
    boundary_theta = boundary_negative / boundary_G
    boundary_schur = boundary_B[0][0]
    if (
        _det(B) != 4 or high != 2 or schur != 2
        or M_inverse != _diagonal([Fraction(1, 2), Fraction(-1)])
        or feature_schur != schur or G - negative_pullback != pulled
        or gram != 4 or theta != Fraction(1, 3)
        or source_floor != 8 or physical_floor != 2
        or boundary_B != _diagonal([Fraction(0), Fraction(2)])
        or boundary_M_inverse != _diagonal([Fraction(1, 2), Fraction(-1)])
        or boundary_theta != 1 or boundary_schur != 0
    ):
        raise ReplayError("independent full signed feature identity failed")
    return {
        "g": g,
        "J": signature,
        "F": feature,
        "B": B,
        "B_determinant": _det(B),
        "high_block": high,
        "physical_schur": schur,
        "F_K": F_K,
        "F_H": F_H,
        "M_H": M,
        "M_H_inverse": M_inverse,
        "feature_schur": feature_schur,
        "A": A,
        "Delta": delta,
        "source_gram_A_star_A": gram,
        "wrong_isometric_baseline": Fraction(1),
        "T": T,
        "L_plus": positive,
        "L_minus": negative,
        "positive_feature_pullback": positive_pullback,
        "negative_feature_pullback": negative_pullback,
        "G": G,
        "pulled_schur": pulled,
        "theta_full": theta,
        "source_floor": source_floor,
        "physical_quotient_floor": physical_floor,
        "complete_contraction_passes": high > 0 and theta < 1,
        "equality_boundary": {
            "F": boundary_F,
            "B": boundary_B,
            "high_block": boundary_B[1][1],
            "M_H": boundary_M,
            "M_H_inverse": boundary_M_inverse,
            "G": boundary_G,
            "negative_feature_pullback": boundary_negative,
            "theta_full": boundary_theta,
            "physical_schur": boundary_schur,
            "passes": boundary_B[1][1] > 0 and boundary_theta < 1,
        },
    }


def _coframe_model() -> dict[str, Any]:
    A = _diagonal([Fraction(1, 3), Fraction(1)])
    gram = _product(_T(A), A)
    delta = _inv(_product(A, _T(A)))
    low = _eye(2)
    mu = Fraction(1, 9)
    bound = mu
    quotient_remainder = _minus(low, _times(mu, delta))
    gram_remainder = _minus(gram, _times(bound, _eye(2)))
    rank = 2 if _det(A) != 0 else 1
    if (
        rank != 2 or gram[0][0] != bound
        or quotient_remainder != gram_remainder
        or quotient_remainder != _diagonal([Fraction(0), Fraction(8, 9)])
    ):
        raise ReplayError("independent coframe necessity failed")
    return {
        "g": Fraction(1),
        "A": A,
        "rank_A": rank,
        "A_star_A": gram,
        "Delta": delta,
        "low_operator": low,
        "mu": mu,
        "necessary_gram_floor": bound,
        "quotient_remainder": quotient_remainder,
        "gram_remainder": gram_remainder,
        "qualitative_rank_determines_uniform_floor": False,
    }


def _regressions() -> dict[str, Any]:
    return {
        "localized_prime_energy_and_variance": _localized_model(),
        "mean_variance_edge_cases": _edge_model(),
        "hermitian_trace_variance": _matrix_model(),
        "positive_shorted_source_contraction": _shorted_model(),
        "complete_signed_feature_contraction": _signed_feature_model(),
        "quantitative_coframe_necessity": _coframe_model(),
    }


def reconstruct(lambda_numerator: int, dps: int) -> dict[str, Any]:
    p = _int(lambda_numerator, "lambda_numerator", 5)
    precision = _int(dps, "dps", 50)
    if p % 2 == 0:
        raise ReplayError("lambda_numerator must be odd")
    return _encode({
        "exact_schedule_metadata": {
            "lambda": Fraction(p, 2),
            "N": (p * p + 3) // 4,
            "N_rule": "ceil(lambda^2)",
            "dps_label": precision,
            "model_scope": "exact rational theorem regressions; not a physical Weil pilot",
        },
        "exact_regressions": _regressions(),
        "theorem_checks": {
            "upper_one_dual_reconstructed": True,
            "localized_energy_strict_and_equality_boundaries_present": True,
            "mean_variance_witness_reconstructed": True,
            "mean_variance_edge_cases_reconstructed": True,
            "matrix_trace_variance_floor_reconstructed": True,
            "g_A_star_A_metric_retained": True,
            "shorted_minorant_not_promoted_to_original_necessity": True,
            "complete_signed_feature_identity_reconstructed": True,
            "quantitative_coframe_necessity_reconstructed": True,
        },
    })


def _source_hashes() -> dict[str, str]:
    if set(PINNED_HASHES) != {NOTE, LOCK}:
        raise ReplayError("source pins must contain the note and lock")
    result: dict[str, str] = {}
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None:
            raise ReplayError(f"unfinalized source hash: {relative}")
        path = Path(relative)
        if path.is_absolute() or ".." in path.parts:
            raise ReplayError(f"unsafe source path: {relative}")
        if _digest(_root() / path) != expected:
            raise ReplayError(f"source byte hash mismatch: {relative}")
        result[relative] = expected
    lock = _strict_json_loads((_root() / LOCK).read_bytes(), "source lock")
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary",
    }
    fixed = {
        "schema": LOCK_SCHEMA,
        "claim_class": "LOCALIZED_MOMENT_SOURCE_WHITENED_SIGNED_SCHUR_REDUCTION",
        "terminal_state": TERMINAL_STATE,
        "updated_date": "2026-08-07",
        "external_sources": [],
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_boundary": CLAIM_SCOPE,
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("source-lock inventory mismatch")
    for key, expected in fixed.items():
        if not _same(lock[key], expected):
            raise ReplayError(f"source-lock {key} mutation")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ReplayError("source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        path = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str) or not relative
            or path.is_absolute() or ".." in path.parts or relative in result
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ReplayError("invalid source-lock dependency")
        if _digest(_root() / relative) != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def replay(payload: Any, producer_bytes: bytes | None = None) -> dict[str, Any]:
    if producer_bytes is None:
        raise ReplayError("exact producer artifact bytes are required")
    decoded = _strict_json_loads(producer_bytes, "producer artifact bytes")
    if not _same(payload, decoded):
        raise ReplayError("payload and exact producer bytes do not decode exactly")
    if not isinstance(payload, dict):
        raise ReplayError("producer artifact must be an object")
    expected_keys = {
        "schema", "status", "terminal_state", "input", "source_hashes",
        "locked_conventions", "locked_formulas", "claim_scope",
        "source_admissions", "arithmetic", "certificate", "result",
    }
    if set(payload) != expected_keys:
        raise ReplayError("producer top-level inventory mismatch")
    _walk_rationals(payload)
    if payload["schema"] != SCHEMA or payload["status"] != STATUS:
        raise ReplayError("producer schema or status mismatch")
    if payload["terminal_state"] != TERMINAL_STATE or payload["result"] != PRODUCER_RESULT:
        raise ReplayError("producer claim boundary mismatch")
    if not isinstance(payload["input"], dict) or set(payload["input"]) != {
        "lambda_numerator", "dps"
    }:
        raise ReplayError("input inventory mismatch")
    p = _int(payload["input"]["lambda_numerator"], "lambda_numerator", 5)
    precision = _int(payload["input"]["dps"], "dps", 50)
    if p % 2 == 0:
        raise ReplayError("lambda_numerator must be odd")
    hashes = _source_hashes()
    fixed = {
        "source_hashes": hashes,
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_scope": CLAIM_SCOPE,
        "source_admissions": SOURCE_ADMISSIONS,
        "arithmetic": ARITHMETIC,
        "certificate": reconstruct(p, precision),
    }
    for key, expected in fixed.items():
        if not _same(payload[key], expected):
            raise ReplayError(f"{key} differs from independent reconstruction")
    if any(payload["source_admissions"].values()):
        raise ReplayError("source admission promotion")
    producer_hash = hashlib.sha256(producer_bytes).hexdigest()
    return {
        "schema": "xi-prolate-localized-moment-source-whitened-schur-replay-v1",
        "result": REPLAY_RESULT,
        "terminal_state": TERMINAL_STATE,
        "input": {"lambda_numerator": p, "dps": precision},
        "producer_binding": {
            "sha256": producer_hash,
            "byte_length": len(producer_bytes),
            "byte_source": "exact artifact file bytes",
        },
        "source_hashes": hashes,
        "checks": {
            "strict_json_and_canonical_rationals": True,
            "upper_one_rebuilt_from_stop_gain_breakpoints": True,
            "variance_rebuilt_from_pairwise_differences": True,
            "matrix_variance_rebuilt_from_trace_invariants": True,
            "shorted_load_rebuilt_from_feature_resolvent": True,
            "full_signed_schur_rebuilt_in_physical_and_feature_spaces": True,
            "source_metric_g_A_star_A_rebuilt": True,
            "coframe_necessity_rebuilt": True,
            "claim_boundary_rechecked": True,
        },
        "shared_arithmetic_limitation": ARITHMETIC["independence_limitation"],
        "producer_pass_boolean_trusted": False,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("artifact")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    raw = Path(args.artifact).read_bytes()
    payload = _strict_json_loads(raw, "producer artifact")
    report = replay(payload, producer_bytes=raw)
    Path(args.output).write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
