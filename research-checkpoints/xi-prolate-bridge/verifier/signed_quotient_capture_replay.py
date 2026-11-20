#!/usr/bin/env python3
"""Clean-room replay of the signed-quotient/capture reduction certificate.

This module imports neither the producer nor project arithmetic helpers.  It
reconstructs the rational regression models and evaluates the transition
ceiling through a different interval formula tree.  Both paths share the
pinned ``mpmath.iv`` transcendental runtime, which is an explicit limitation.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
import math
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-signed-quotient-capture-v1"
REPLAY_SCHEMA = "xi-prolate-signed-quotient-capture-replay-v1"
STATUS = "SIGNED_QUOTIENT_CAPTURE_COMPONENT"
RESULT = "SIGNED_QUOTIENT_CAPTURE_COMPONENT_PASS"
REPLAY_RESULT = "SIGNED_QUOTIENT_CAPTURE_COMPONENT_REPLAY_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md"
LOCK = "SIGNED_QUOTIENT_CAPTURE_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-signed-quotient-capture-source-lock-v1"
EXPECTED_LIBRARY = "mpmath.iv 1.4.1"
LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15

PINNED_HASHES = {
    NOTE: "9700501a367ea7ae2b843ee61b45bec3970fc35db1715613099b08439be0415c",
    LOCK: "78284b94c9331a4b27f537c572c3c292f7cd411951f84e2e1605b924e2bde600",
}

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_INTEGER_TEXT = re.compile(r"^(?:0|-[1-9][0-9]*|[1-9][0-9]*)$")
_POSITIVE_TEXT = re.compile(r"^[1-9][0-9]*$")
_DECIMAL_TEXT = re.compile(
    r"^[+-]?(?:(?:[0-9]+(?:\.[0-9]*)?)|(?:\.[0-9]+))(?:[eE][+-]?[0-9]+)?$"
)

LOCKED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension",
    "physical_interval": "I_lambda=[-log(lambda),log(lambda)] with Lebesgue measure in logarithmic coordinates, equivalently du/u on [lambda^(-1),lambda]",
    "fourier_sign": "fhat(t)=integral f(y)*exp(-i*t*y) dy",
    "prime_endpoint": "every prime power n<=lambda^2 is included",
    "prime_sign": "m_lambda=2*theta_prime-2*sum Lambda(n)/sqrt(n)*cos(t*log(n))",
    "inversion": "multiplicatively Jf(u)=f(u^(-1)); in the additive logarithmic coordinate Jf(x)=f(-x), and reflection is retained before forming the inversion-even state",
    "matched_schedule": "lambda=p/2 for odd p>=5 and N=ceil(lambda^2)=(p^2+3)/4",
    "matched_even_count_scope": "the even ambient-complement dimension and count comparison require the unproved finite hypothesis P_(E_N^+)p_4!=0 at N=ceil(lambda^2)",
    "strict_capture_projector": "Pi_>=1_(g-delta,infinity)(mathscr_R), distinct from the inclusive rank projector",
    "interval_serialization": "nondegenerate intervals are expanded by exact dyadic 2^(s-ceil(dps*3321928094887363/10^15)+16), s=max(0,floor(log2(max endpoint magnitude))), and replay requires enclosure of its independent interval",
    "shared_library": "producer and replay use the exact pinned mpmath.iv version and disclose that common dependency",
}

LOCKED_FORMULAS = {
    "quotient_metric": "A=W*D^(-1/2), mathcal_R=A*A^*, Delta=mathcal_R^dagger on K=ran(A), and <Ax,Delta Ax>=||x||^2 on (ker A)^perp",
    "signed_low_equivalence": "P_K*B*P_K>=mu*Delta iff P_0*A^*B*A*P_0>=mu*P_0",
    "cross_identity": "||P_H*B*P_K*Delta^(-1/2)||=||P_H*B*A||",
    "shift_cancellation": "for B=Q-U_0*I, P_H*B*A=P_H*Q*W*D^(-1/2)",
    "shift_erosion": "mu>=mu_0-(U_0)_+*||A||^2",
    "capture_score": "C_F=tr(P_H*F(mathscr_R)*P_H)=tr(F(mathscr_R))-tr(G^dagger*W_0^*F(mathscr_R)W_0)",
    "capture_floor": "P_H*B*P_H>=[delta-[r-(g-delta)]_+*min(1,C_F)]*P_H",
    "ridge_majorant": "F_(a,tau)(t)=((tau+a)/tau)*t/(t+a)",
    "moment_floor": "P_H*B*P_H>=[g-L_k^(1/k)]*P_H where L_k=tr(P_H*mathscr_R^k*P_H)",
    "transition_ceiling": "q=ceil((2/pi^2)*log(50*p^2+25)*log(20))",
    "transition_index": "n_star=p^2+6+q",
    "buffered_counts": "r_plus=N+floor((q+2)/4)-1 and r_minus=N+floor(q/4)",
}

CLAIM_SCOPE = {
    "proved": [
        "exact source-coordinate signed-low equivalence and quotient-relative cross identity",
        "exact scalar-shift erosion and cancellation formulas",
        "phase-sensitive trace-majorant capture and moment reductions",
        "exact matched-bandwidth target counts and a conditional no-dimension-obstruction statement under the explicit projected-anchor nonvanishing hypothesis",
        "exact countermodels excluding rank-only, conditioning-only, positive-sampling-only, and diagonal-block-only shortcuts",
    ],
    "not_proved": [
        "the signed source-coordinate lower bound",
        "a strict quotient-relative cross reserve",
        "a physical co-frame inequality",
        "a positive physical high floor on a common schedule",
        "a signed floor in either parity sector",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "cached_weil_matrix_read": False,
    "cached_dangerous_eigenvectors_read": False,
    "zeta_zero_table_read": False,
    "zeros_assumed_real": False,
    "global_weil_positivity_assumed": False,
    "inclusive_prime_power_endpoint_used": True,
    "lambda_squared_cutoff_used": True,
    "fourier_minus_sign_preserved": True,
    "inversion_reflection_retained": True,
    "strict_capture_projector_used": True,
    "nonpositive_complementary_gap_reported_as_pass": False,
    "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence": False,
    "projected_anchor_nonzero_at_matched_bandwidth_claimed": False,
    "signed_low_comparison_claimed": False,
    "strict_cross_reserve_claimed": False,
    "physical_coframe_claimed": False,
    "signed_sector_floor_claimed": False,
    "equation_5_2_claimed": False,
    "determinant_limit_claimed": False,
    "rh_proved": False,
}

ARITHMETIC = {
    "precision_mode": "exact rational arithmetic plus outward arbitrary-precision intervals",
    "raw_interval_or_ball_output_applicable": True,
    "library": EXPECTED_LIBRARY,
    "shared_library_with_verifier": True,
    "independent_formula_trees": True,
    "serialization_guard": "exact dyadic rule locked in source conventions; nondegenerate intervals only",
    "independence_limitation": "producer and replay share the exact pinned mpmath.iv transcendental runtime",
}


class ReplayError(ValueError):
    """Raised when source bytes, exact arithmetic, or claim scope fail replay."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()
    except OSError as exc:
        raise ReplayError(f"cannot read pinned source: {path}") from exc


def _reject_number(token: str) -> None:
    raise ReplayError(f"non-integer JSON number {token!r} is forbidden")


def _unique_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _validate_json(value: Any, path: str = "payload") -> None:
    if value is None or isinstance(value, (str, bool)):
        return
    if isinstance(value, int):
        return
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path} is forbidden")
    if isinstance(value, list):
        for index, child in enumerate(value):
            _validate_json(child, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, child in value.items():
            if not isinstance(key, str):
                raise ReplayError(f"non-string JSON key at {path}")
            _validate_json(child, f"{path}.{key}")
        return
    raise ReplayError(f"non-JSON value at {path}")


def _strict_json_loads(raw: bytes | str, label: str) -> Any:
    try:
        value = json.loads(
            raw,
            parse_float=_reject_number,
            parse_constant=_reject_number,
            object_pairs_hook=_unique_object,
        )
    except ReplayError:
        raise
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise ReplayError(f"{label} is not strict JSON") from exc
    _validate_json(value, label)
    return value


def _same(left: Any, right: Any) -> bool:
    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return set(left) == set(right) and all(_same(left[key], right[key]) for key in left)
    if isinstance(left, list):
        return len(left) == len(right) and all(_same(a, b) for a, b in zip(left, right))
    return left == right


def _int(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ReplayError(f"{label} must be an exact JSON integer")
    if value < minimum:
        raise ReplayError(f"{label} must be at least {minimum}")
    return value


def _rational(value: Fraction) -> dict[str, str]:
    return {"numerator": str(value.numerator), "denominator": str(value.denominator)}


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return _rational(value)
    if isinstance(value, list):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    return value


def _parse_rational(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"{label} must be an exact rational object")
    numerator = value["numerator"]
    denominator = value["denominator"]
    if (
        not isinstance(numerator, str)
        or _INTEGER_TEXT.fullmatch(numerator) is None
        or not isinstance(denominator, str)
        or _POSITIVE_TEXT.fullmatch(denominator) is None
    ):
        raise ReplayError(f"{label} has noncanonical integer text")
    result = Fraction(int(numerator), int(denominator))
    if (str(result.numerator), str(result.denominator)) != (numerator, denominator):
        raise ReplayError(f"{label} is not reduced canonically")
    return result


def _source_hashes() -> dict[str, str]:
    root = _root()
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None:
            raise ReplayError(f"PINNED_HASHES placeholder not finalized: {relative}")
        if _sha256(root / relative) != expected:
            raise ReplayError(f"source byte hash mismatch: {relative}")

    lock = _strict_json_loads((root / LOCK).read_bytes(), "source lock")
    expected_top = {
        "schema",
        "claim_class",
        "terminal_state",
        "updated_date",
        "external_sources",
        "dependencies",
        "locked_conventions",
        "locked_formulas",
        "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("signed-quotient source-lock inventory mismatch")
    fixed = {
        "schema": LOCK_SCHEMA,
        "claim_class": "SIGNED_QUOTIENT_AND_PHYSICAL_CAPTURE_REDUCTION",
        "terminal_state": TERMINAL_STATE,
        "updated_date": "2026-08-08",
        "external_sources": [],
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_boundary": CLAIM_SCOPE,
    }
    for key, expected in fixed.items():
        if not _same(lock[key], expected):
            raise ReplayError(f"signed-quotient source-lock {key} mutation")

    result = dict(PINNED_HASHES)
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ReplayError("signed-quotient source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed signed-quotient dependency")
        relative = item["path"]
        expected = item["sha256"]
        role = item["role"]
        if (
            not isinstance(relative, str)
            or not relative
            or Path(relative).is_absolute()
            or ".." in Path(relative).parts
            or relative in result
            or not isinstance(expected, str)
            or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str)
            or not role
        ):
            raise ReplayError("invalid signed-quotient dependency fields")
        if _sha256(root / relative) != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _matrix_product(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    if not left or not right or len(left[0]) != len(right):
        raise ReplayError("internal exact matrix shape error")
    rows = len(left)
    columns = len(right[0])
    shared = len(right)
    return [
        [sum(left[i][k] * right[k][j] for k in range(shared)) for j in range(columns)]
        for i in range(rows)
    ]


def _adjoint(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    return [[matrix[i][j] for i in range(len(matrix))] for j in range(len(matrix[0]))]


def _identity_matrix(size: int) -> list[list[Fraction]]:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _matrix_subtract(
    left: list[list[Fraction]], right: list[list[Fraction]]
) -> list[list[Fraction]]:
    return [
        [left[i][j] - right[i][j] for j in range(len(left[0]))]
        for i in range(len(left))
    ]


def _matrix_scale(value: Fraction, matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    return [[value * entry for entry in row] for row in matrix]


def _outer_product(vector: list[Fraction]) -> list[list[Fraction]]:
    return [[left * right for right in vector] for left in vector]


def _inverse_2x2(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    if determinant == 0:
        raise ReplayError("internal singular 2x2 exact matrix")
    return [
        [matrix[1][1] / determinant, -matrix[0][1] / determinant],
        [-matrix[1][0] / determinant, matrix[0][0] / determinant],
    ]


def _sqrt_fraction(value: Fraction) -> Fraction:
    numerator = math.isqrt(value.numerator)
    denominator = math.isqrt(value.denominator)
    if numerator * numerator != value.numerator or denominator * denominator != value.denominator:
        raise ReplayError("internal rational square root is not exact")
    return Fraction(numerator, denominator)


def _expected_regressions() -> dict[str, object]:
    zero = Fraction(0)
    one = Fraction(1)

    A0 = [[one, zero, one], [zero, Fraction(2), zero]]
    gram0 = _matrix_product(A0, _adjoint(A0))
    Delta0 = _inverse_2x2(gram0)
    kernel = [one, zero, -one]
    kernel_column = [[entry] for entry in kernel]
    if _matrix_product(A0, kernel_column) != [[zero], [zero]]:
        raise ReplayError("internal quotient kernel reconstruction failed")
    kernel_norm_squared = sum(entry * entry for entry in kernel)
    P0 = _matrix_subtract(
        _identity_matrix(3),
        _matrix_scale(one / kernel_norm_squared, _outer_product(kernel)),
    )
    source0 = _matrix_product(_matrix_product(_adjoint(A0), Delta0), A0)
    if source0 != P0:
        raise ReplayError("internal quotient projector reconstruction failed")
    P0_source = _matrix_product(_matrix_product(P0, source0), P0)

    A1 = [[Fraction(2), zero], [zero, Fraction(3)], [zero, zero]]
    gram1 = _matrix_product(A1, _adjoint(A1))
    delta1 = [
        [one / gram1[0][0], zero, zero],
        [zero, one / gram1[1][1], zero],
        [zero, zero, zero],
    ]
    delta_inverse_half = [
        [_sqrt_fraction(gram1[0][0]), zero],
        [zero, _sqrt_fraction(gram1[1][1])],
    ]
    Q1 = [[zero, zero, Fraction(5)], [zero, zero, Fraction(7)], [Fraction(5), Fraction(7), zero]]
    u1 = Fraction(11, 13)
    B1 = _matrix_subtract(Q1, _matrix_scale(u1, _identity_matrix(3)))
    left_cross = _matrix_product([[B1[2][0], B1[2][1]]], delta_inverse_half)
    BA = _matrix_product(B1, A1)
    QA = _matrix_product(Q1, A1)
    right_cross = [BA[2]]
    q_cross = [QA[2]]
    cross_square = sum(x * x for x in left_cross[0])

    Q2 = _matrix_scale(Fraction(10), delta1)
    shifted2 = _matrix_subtract(Q2, _matrix_scale(Fraction(1, 3), _identity_matrix(3)))
    source2 = _matrix_product(_matrix_product(_adjoint(A1), Q2), A1)
    shifted_source2 = _matrix_product(_matrix_product(_adjoint(A1), shifted2), A1)
    A1_norm_squared = max(gram1[index][index] for index in range(3))

    u = [Fraction(3, 5), zero, Fraction(4, 5)]
    R = _matrix_scale(Fraction(3), _outer_product(u))
    Aplus = _matrix_scale(Fraction(27, 25), _outer_product([one, zero, zero]))
    B3 = [
        [2 * Fraction(i == j) + Aplus[i][j] - R[i][j] for j in range(3)]
        for i in range(3)
    ]
    low3 = [[B3[i][j] for j in range(2)] for i in range(2)]
    extreme_residual = _matrix_scale(Fraction(3), _outer_product([zero, zero, one]))
    extreme_positive = _matrix_scale(zero, _identity_matrix(3))
    extreme_B = _matrix_subtract(
        _matrix_scale(Fraction(2), _identity_matrix(3)), extreme_residual
    )

    R4 = _matrix_scale(Fraction(3), _outer_product([one, zero, zero]))
    v = [Fraction(2), zero, Fraction(3)]
    V = _outer_product(v)
    B4 = [[2 * Fraction(i == j) - R4[i][j] + V[i][j] for j in range(3)] for i in range(3)]
    low4 = [[B4[i][j] for j in range(2)] for i in range(2)]
    high4 = B4[2][2]
    cross4_squared = sum(B4[i][2] ** 2 for i in range(2))
    low4_floor = min(low4[index][index] for index in range(2))
    schur4 = [[B4[0][0] - B4[0][2] * B4[2][0] / B4[2][2], zero], [zero, B4[1][1]]]
    det4 = B4[1][1] * (B4[0][0] * B4[2][2] - B4[0][2] * B4[2][0])

    J = [[zero, one], [one, zero]]
    S_column = [[one], [-one]]
    positive_gram = _matrix_product(_adjoint(S_column), S_column)[0][0]
    signed_form = _matrix_product(
        _matrix_product(_adjoint(S_column), J), S_column
    )[0][0]

    S_row = [[one, one]]
    reserve_gram = _matrix_product(_adjoint(S_row), S_row)
    reserve_mu = reserve_gram[0][0]
    reserve_eta = reserve_gram[1][1]
    reserve_chi_squared = reserve_gram[0][1] ** 2 / reserve_eta

    ridge = (Fraction(2) + Fraction(1)) / Fraction(2) * Fraction(3) / (Fraction(3) + Fraction(1))
    ridge_matrix = _matrix_scale(ridge, _outer_product(u))
    ridge_total = sum(ridge_matrix[index][index] for index in range(3))
    ridge_captured = sum(ridge_matrix[index][index] for index in range(2))
    ridge_leakage = ridge_matrix[2][2]

    return _encode(
        {
            "noninjective_quotient_saturation": {
                "A": A0,
                "AA_star": gram0,
                "Delta": Delta0,
                "P0": P0,
                "B": Delta0,
                "P0_A_star_B_A_P0": P0_source,
                "mu": one,
                "kernel_generator": kernel,
            },
            "cross_identity_and_shift_cancellation": {
                "A": A1,
                "Q": Q1,
                "U0": u1,
                "B": B1,
                "Delta_inverse_half_on_K": delta_inverse_half,
                "P_H_B_P_K_Delta_inverse_half": left_cross,
                "P_H_B_A": right_cross,
                "P_H_Q_A": q_cross,
                "norm_squared": cross_square,
            },
            "shift_erosion_saturation": {
                "A": A1,
                "Q_low": Q2,
                "U0": Fraction(1, 3),
                "mu0": Fraction(10),
                "A_norm_squared": A1_norm_squared,
                "normalized_unshifted": source2,
                "normalized_shifted": shifted_source2,
                "eroded_floor": Fraction(10) - Fraction(1, 3) * A1_norm_squared,
            },
            "rank_conditioning_capture_obstruction": {
                "g": Fraction(2),
                "delta": one,
                "tau": one,
                "u": u,
                "negative_residual": R,
                "positive_part": Aplus,
                "B": B3,
                "dangerous_rank": 1,
                "physical_dimension": 2,
                "low_compression": low3,
                "s_squared": u[2] ** 2,
                "rotated_extreme_positive_part": extreme_positive,
                "rotated_extreme_B": extreme_B,
                "rotated_extreme_s_squared": one,
            },
            "exact_capture_cross_obstruction": {
                "negative_residual": R4,
                "positive_vector": v,
                "B": B4,
                "low_compression": low4,
                "high_compression": high4,
                "cross_norm_squared": cross4_squared,
                "low_floor_times_high_floor": low4_floor * high4,
                "low_schur_complement": schur4,
                "determinant": det4,
            },
            "signed_sampling_obstruction": {
                "J": J,
                "S_column": S_column,
                "positive_gram": positive_gram,
                "signed_form": signed_form,
            },
            "strict_cross_reserve_equality_obstruction": {
                "S_row": S_row,
                "gram": reserve_gram,
                "mu": reserve_mu,
                "eta": reserve_eta,
                "chi_squared": reserve_chi_squared,
                "strict_reserve_holds": reserve_chi_squared < reserve_mu,
            },
            "ridge_capture_majorant": {
                "u": u,
                "residual_eigenvalue": Fraction(3),
                "tau": Fraction(2),
                "a": one,
                "F_at_residual_eigenvalue": ridge,
                "s_squared": Fraction(16, 25),
                "total_trace": ridge_total,
                "captured_trace": ridge_captured,
                "leakage_score": ridge_leakage,
                "capture_bound_holds": Fraction(16, 25) <= ridge_leakage,
            },
        }
    )


def _transition_interval(p: int, dps: int) -> tuple[tuple[mp.mpf, mp.mpf], int]:
    if f"mpmath.iv {mp.__version__}" != EXPECTED_LIBRARY:
        raise ReplayError("pinned mpmath.iv version is not active")
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        two = mp.iv.mpf(2)
        # Independent formula tree: log(50p^2+25)=log(25)+log(2p^2+1)
        # and log(20)=2log(2)+log(5).
        first_log = mp.iv.log(mp.iv.mpf(25)) + mp.iv.log(mp.iv.mpf(2 * p * p + 1))
        second_log = two * mp.iv.log(two) + mp.iv.log(mp.iv.mpf(5))
        value = two * first_log * second_log / (mp.iv.pi**2)
        lower_raw, upper_raw = value._mpi_  # type: ignore[attr-defined]
        bits = max(int(lower_raw[3]), int(upper_raw[3])) + 48
        with mp.workprec(bits):
            lower = +mp.mpf(tuple(lower_raw))
            upper = +mp.mpf(tuple(upper_raw))
        q_lower = int(mp.ceil(lower))
        q_upper = int(mp.ceil(upper))
        if q_lower != q_upper:
            raise ReplayError("independent transition ceiling is not separated")
        return (lower, upper), q_lower
    finally:
        mp.iv.dps = old


def _precision_bits(dps: int) -> int:
    return (
        dps * LOG2_10_UPPER_NUMERATOR + LOG2_10_UPPER_DENOMINATOR - 1
    ) // LOG2_10_UPPER_DENOMINATOR


def _raw_endpoint(value: Any, label: str, dps: int) -> mp.mpf:
    if not isinstance(value, list) or len(value) != 4:
        raise ReplayError(f"{label} must be a four-part raw dyadic endpoint")
    sign, mantissa_text, exponent, bit_count = value
    if sign not in (0, 1) or isinstance(sign, bool):
        raise ReplayError(f"{label} sign is invalid")
    if not isinstance(mantissa_text, str) or re.fullmatch(r"(?:0|[1-9][0-9]*)", mantissa_text) is None:
        raise ReplayError(f"{label} mantissa is noncanonical")
    if isinstance(exponent, bool) or not isinstance(exponent, int):
        raise ReplayError(f"{label} exponent is invalid")
    if isinstance(bit_count, bool) or not isinstance(bit_count, int) or bit_count < 0:
        raise ReplayError(f"{label} bit count is invalid")
    mantissa = int(mantissa_text)
    if mantissa == 0:
        if (sign, exponent, bit_count) != (0, 0, 0):
            raise ReplayError(f"{label} zero endpoint is noncanonical")
    else:
        if mantissa % 2 == 0 or mantissa.bit_length() != bit_count:
            raise ReplayError(f"{label} endpoint is not normalized or has wrong bit count")
        if bit_count > _precision_bits(dps) + 128:
            raise ReplayError(f"{label} exceeds the precision bit budget")
    if abs(exponent) > 16 * _precision_bits(dps) + 1024:
        raise ReplayError(f"{label} exceeds the exponent budget")
    try:
        with mp.workprec(max(64, bit_count + 16)):
            return +mp.mpf((sign, mantissa, exponent, bit_count))
    except (TypeError, ValueError, OverflowError) as exc:
        raise ReplayError(f"{label} is not a finite raw dyadic") from exc


def _submitted_interval(value: Any, label: str, dps: int) -> tuple[mp.mpf, mp.mpf]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"{label} interval inventory mismatch")
    dyadic = value["dyadic"]
    decimal = value["decimal"]
    if not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}:
        raise ReplayError(f"{label} dyadic inventory mismatch")
    if not isinstance(decimal, list) or len(decimal) != 2:
        raise ReplayError(f"{label} decimal inventory mismatch")
    if any(not isinstance(item, str) or _DECIMAL_TEXT.fullmatch(item) is None for item in decimal):
        raise ReplayError(f"{label} decimal endpoint is noncanonical")
    lower = _raw_endpoint(dyadic["lower"], f"{label}.lower", dps)
    upper = _raw_endpoint(dyadic["upper"], f"{label}.upper", dps)
    if lower > upper:
        raise ReplayError(f"{label} interval is reversed")
    with mp.workdps(dps + 20):
        canonical = [mp.nstr(lower, dps + 10), mp.nstr(upper, dps + 10)]
    if decimal != canonical:
        raise ReplayError(f"{label} decimal text does not match raw dyadics")
    return lower, upper


def _schedule(p: int, q: int) -> dict[str, object]:
    N = (p * p + 3) // 4
    plus = N + (q + 2) // 4 - 1
    minus = N + q // 4
    return {
        "lambda": _rational(Fraction(p, 2)),
        "N_rule": "ceil(lambda^2)",
        "N": N,
        "projected_anchor_nonzero_hypothesis_required": True,
        "projected_anchor_nonzero_proved": False,
        "ambient_even_complement_dimension_if_anchor_nonzero": N,
        "ambient_odd_dimension": N,
        "q": q,
        "n_star": p * p + 6 + q,
        "r_plus_buffered": plus,
        "r_minus_buffered": minus,
        "even_target_count_meets_dimension_if_anchor_nonzero": plus >= N,
        "odd_target_count_exceeds_dimension": minus >= N + 1,
        "coframe_proved": False,
    }


def reconstruct(lambda_numerator: int, dps: int) -> tuple[dict[str, object], tuple[mp.mpf, mp.mpf], dict[str, object]]:
    p = _int(lambda_numerator, "lambda_numerator", 5)
    digits = _int(dps, "dps", 50)
    if p % 2 == 0:
        raise ReplayError("lambda_numerator must be odd")
    interval, q = _transition_interval(p, digits)
    return _schedule(p, q), interval, _expected_regressions()


def replay(payload: Any, producer_bytes: bytes | None = None) -> dict[str, Any]:
    if producer_bytes is None:
        raise ReplayError("exact producer artifact bytes are required")
    decoded = _strict_json_loads(producer_bytes, "producer artifact bytes")
    if not _same(decoded, payload):
        raise ReplayError("payload and exact producer bytes do not decode exactly")
    if not isinstance(payload, dict):
        raise ReplayError("producer artifact must be an object")
    expected_top = {
        "schema",
        "status",
        "terminal_state",
        "input",
        "source_hashes",
        "locked_conventions",
        "locked_formulas",
        "source_admissions",
        "certificate",
        "arithmetic",
        "producer_pass_boolean_trusted_by_replay",
        "claim_scope",
        "result",
    }
    if set(payload) != expected_top:
        raise ReplayError("producer top-level inventory mismatch")
    fixed = {
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "source_admissions": SOURCE_ADMISSIONS,
        "arithmetic": ARITHMETIC,
        "producer_pass_boolean_trusted_by_replay": False,
        "claim_scope": CLAIM_SCOPE,
        "result": RESULT,
    }
    for key, expected in fixed.items():
        if not _same(payload[key], expected):
            raise ReplayError(f"producer {key} mutation")

    source_hashes = _source_hashes()
    if not _same(payload["source_hashes"], source_hashes):
        raise ReplayError("source-hash inventory mismatch")

    inputs = payload["input"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_numerator",
        "lambda_denominator",
        "interval_decimal_digits",
    }:
        raise ReplayError("input inventory mismatch")
    p = _int(inputs["lambda_numerator"], "lambda_numerator", 5)
    denominator = _int(inputs["lambda_denominator"], "lambda_denominator", 1)
    dps = _int(inputs["interval_decimal_digits"], "interval_decimal_digits", 50)
    if denominator != 2 or p % 2 == 0:
        raise ReplayError("half-integer matched schedule violation")

    expected_schedule, expected_interval, expected_regressions = reconstruct(p, dps)
    certificate = payload["certificate"]
    if not isinstance(certificate, dict) or set(certificate) != {
        "exact_schedule",
        "transition_ceiling_argument",
        "exact_regressions",
    }:
        raise ReplayError("certificate inventory mismatch")
    if not _same(certificate["exact_schedule"], expected_schedule):
        raise ReplayError("matched-bandwidth schedule reconstruction mismatch")
    if not _same(certificate["exact_regressions"], expected_regressions):
        raise ReplayError("exact regression reconstruction mismatch")

    submitted_lower, submitted_upper = _submitted_interval(
        certificate["transition_ceiling_argument"], "transition ceiling", dps
    )
    expected_lower, expected_upper = expected_interval
    if submitted_lower > expected_lower or submitted_upper < expected_upper:
        raise ReplayError("submitted interval does not enclose independent reconstruction")
    with mp.workdps(dps + 30):
        scale = max(mp.mpf(1), abs(expected_lower), abs(expected_upper))
        allowed_width = scale * mp.power(2, -_precision_bits(dps) + 20)
        if submitted_upper - submitted_lower > allowed_width:
            raise ReplayError("submitted interval is not precision-tight")
    q = expected_schedule["q"]
    if not isinstance(q, int) or int(mp.ceil(submitted_lower)) != q or int(mp.ceil(submitted_upper)) != q:
        raise ReplayError("submitted interval does not certify the transition ceiling")

    producer_digest = hashlib.sha256(producer_bytes).hexdigest()
    return {
        "schema": REPLAY_SCHEMA,
        "status": REPLAY_RESULT,
        "terminal_state": TERMINAL_STATE,
        "producer_binding": {
            "byte_source": "exact artifact file bytes",
            "byte_count": len(producer_bytes),
            "sha256": producer_digest,
        },
        "input": {
            "lambda_numerator": p,
            "lambda_denominator": denominator,
            "interval_decimal_digits": dps,
        },
        "source_hashes": source_hashes,
        "reconstructed_exact_schedule": expected_schedule,
        "checks": {
            "source_note_lock_and_dependencies_rehashed": True,
            "producer_bytes_bound_exactly": True,
            "independent_transition_formula_tree_pass": True,
            "transition_ceiling_separated": True,
            "submitted_interval_encloses_reconstruction": True,
            "submitted_interval_precision_tight": True,
            "rational_regressions_reconstructed": True,
            "noninjective_quotient_equivalence_pass": True,
            "cross_identity_and_shift_cancellation_pass": True,
            "shift_erosion_saturation_pass": True,
            "capture_and_cross_obstructions_pass": True,
            "ridge_capture_trace_identity_pass": True,
            "fourier_minus_sign_locked": True,
            "inversion_reflection_locked": True,
            "producer_booleans_trusted": False,
            "cached_matrices_read": False,
            "binary64_parameters_used": False,
        },
        "arithmetic": dict(ARITHMETIC),
        "claim_boundary": {
            "matched_bandwidth_projected_anchor_nonzero": False,
            "positive_physical_high_floor": False,
            "signed_low_comparison": False,
            "strict_cross_reserve": False,
            "physical_coframe": False,
            "signed_sector_floor": False,
            "equation_5_2": False,
            "locally_uniform_determinant_convergence": False,
            "rh_proved": False,
        },
        "result": REPLAY_RESULT,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact")
    parser.add_argument("--output")
    args = parser.parse_args()
    raw = Path(args.artifact).read_bytes()
    payload = _strict_json_loads(raw, "producer artifact")
    report = replay(payload, producer_bytes=raw)
    encoded = json.dumps(report, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
