#!/usr/bin/env python3
"""Produce the signed-quotient and physical-capture reduction certificate.

The certificate contains exact rational regression models and one outward
interval: the matched-bandwidth transition ceiling.  It proves reductions
and failure modes only.  It does not assert either missing signed estimate,
a sector floor, equation (5.2), or a determinant limit.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-signed-quotient-capture-v1"
STATUS = "SIGNED_QUOTIENT_CAPTURE_COMPONENT"
RESULT = "SIGNED_QUOTIENT_CAPTURE_COMPONENT_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md"
LOCK = "SIGNED_QUOTIENT_CAPTURE_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-signed-quotient-capture-source-lock-v1"
EXPECTED_LIBRARY = "mpmath.iv 1.4.1"
LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 16

# Finalized after the note and lock pass independent review.
PINNED_HASHES = {
    NOTE: "9700501a367ea7ae2b843ee61b45bec3970fc35db1715613099b08439be0415c",
    LOCK: "78284b94c9331a4b27f537c572c3c292f7cd411951f84e2e1605b924e2bde600",
}

_SHA256 = re.compile(r"^[0-9a-f]{64}$")

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


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _verified_source_hashes() -> dict[str, str]:
    root = _root()
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None:
            raise ValueError(f"PINNED_HASHES placeholder not finalized: {relative}")
        if _sha256(root / relative) != expected:
            raise ValueError(f"source byte hash mismatch: {relative}")

    lock = json.loads((root / LOCK).read_text(encoding="utf-8"))
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
        raise ValueError("signed-quotient source-lock inventory mismatch")
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
        if lock[key] != expected:
            raise ValueError(f"signed-quotient source-lock {key} mutation")

    result = dict(PINNED_HASHES)
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("signed-quotient source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed signed-quotient dependency")
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
            raise ValueError("invalid signed-quotient dependency fields")
        if _sha256(root / relative) != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _integer(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer")
    if value < minimum:
        raise ValueError(f"{label} must be at least {minimum}")
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


def _transpose(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    return [list(column) for column in zip(*matrix)]


def _matmul(
    left: list[list[Fraction]], right: list[list[Fraction]]
) -> list[list[Fraction]]:
    right_t = _transpose(right)
    return [[sum(a * b for a, b in zip(row, column)) for column in right_t] for row in left]


def _add(
    left: list[list[Fraction]], right: list[list[Fraction]]
) -> list[list[Fraction]]:
    return [[a + b for a, b in zip(row_a, row_b)] for row_a, row_b in zip(left, right)]


def _sub(
    left: list[list[Fraction]], right: list[list[Fraction]]
) -> list[list[Fraction]]:
    return [[a - b for a, b in zip(row_a, row_b)] for row_a, row_b in zip(left, right)]


def _scale(value: Fraction, matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    return [[value * entry for entry in row] for row in matrix]


def _identity(size: int) -> list[list[Fraction]]:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _diag(*entries: Fraction) -> list[list[Fraction]]:
    return [[entry if i == j else Fraction(0) for j in range(len(entries))] for i, entry in enumerate(entries)]


def _outer(vector: list[Fraction]) -> list[list[Fraction]]:
    return [[a * b for b in vector] for a in vector]


def _exact_regressions() -> dict[str, object]:
    # Noninjective source map: ker(A)=span(1,0,-1), while A is onto K=R^2.
    A_q = [
        [Fraction(1), Fraction(0), Fraction(1)],
        [Fraction(0), Fraction(2), Fraction(0)],
    ]
    delta_q = _diag(Fraction(1, 2), Fraction(1, 4))
    p0 = _matmul(_matmul(_transpose(A_q), delta_q), A_q)
    signed_source = _matmul(_matmul(_transpose(A_q), delta_q), A_q)

    # Nonzero cross model.  The scalar shift changes only diagonal blocks.
    A_c = [
        [Fraction(2), Fraction(0)],
        [Fraction(0), Fraction(3)],
        [Fraction(0), Fraction(0)],
    ]
    Q_c = [
        [Fraction(0), Fraction(0), Fraction(5)],
        [Fraction(0), Fraction(0), Fraction(7)],
        [Fraction(5), Fraction(7), Fraction(0)],
    ]
    shift_c = Fraction(11, 13)
    B_c = _sub(Q_c, _scale(shift_c, _identity(3)))
    cross_row = [[B_c[2][0], B_c[2][1]]]
    delta_inverse_half = _diag(Fraction(2), Fraction(3))
    left_cross = _matmul(cross_row, delta_inverse_half)
    right_cross = [[entry for entry in _matmul(B_c, A_c)[2]]]
    cross_norm_squared = sum(entry * entry for entry in left_cross[0])

    # The shift erosion lower bound is attained in the source direction with
    # the largest singular value of A.
    Q_shift = _diag(Fraction(5, 2), Fraction(10, 9), Fraction(0))
    shift = Fraction(1, 3)
    normalized_unshifted = _matmul(_matmul(_transpose(A_c), Q_shift), A_c)
    normalized_shifted = _matmul(
        _matmul(_transpose(A_c), _sub(Q_shift, _scale(shift, _identity(3)))),
        A_c,
    )
    eroded_floor = Fraction(10) - shift * Fraction(9)

    # Rank/capture countermodel.
    u = [Fraction(3, 5), Fraction(0), Fraction(4, 5)]
    residual = _scale(Fraction(3), _outer(u))
    positive = _diag(Fraction(27, 25), Fraction(0), Fraction(0))
    B_capture = _sub(_add(_scale(Fraction(2), _identity(3)), positive), residual)
    s_squared = u[2] * u[2]
    rotated_extreme = _diag(Fraction(2), Fraction(2), Fraction(-1))

    # Exact capture does not suppress a large positive-part cross block.
    pole_residual = _diag(Fraction(3), Fraction(0), Fraction(0))
    v = [Fraction(2), Fraction(0), Fraction(3)]
    positive_cross = _outer(v)
    B_cross = _add(_sub(_scale(Fraction(2), _identity(3)), pole_residual), positive_cross)
    schur = _diag(B_cross[0][0] - B_cross[0][2] ** 2 / B_cross[2][2], B_cross[1][1])
    determinant = (
        B_cross[0][0] * (B_cross[1][1] * B_cross[2][2])
        - B_cross[0][2] * (B_cross[1][1] * B_cross[2][0])
    )

    # Ridge-majorant capture observable for tau=2 and a=1.
    ridge_value = Fraction(3, 2) * Fraction(3, 4)
    ridge_total_trace = ridge_value
    ridge_captured_trace = ridge_value * Fraction(9, 25)
    ridge_leakage = ridge_value * Fraction(16, 25)

    return _encode(
        {
            "noninjective_quotient_saturation": {
                "A": A_q,
                "AA_star": _matmul(A_q, _transpose(A_q)),
                "Delta": delta_q,
                "P0": p0,
                "B": delta_q,
                "P0_A_star_B_A_P0": _matmul(_matmul(p0, signed_source), p0),
                "mu": Fraction(1),
                "kernel_generator": [Fraction(1), Fraction(0), Fraction(-1)],
            },
            "cross_identity_and_shift_cancellation": {
                "A": A_c,
                "Q": Q_c,
                "U0": shift_c,
                "B": B_c,
                "Delta_inverse_half_on_K": delta_inverse_half,
                "P_H_B_P_K_Delta_inverse_half": left_cross,
                "P_H_B_A": right_cross,
                "P_H_Q_A": [[entry for entry in _matmul(Q_c, A_c)[2]]],
                "norm_squared": cross_norm_squared,
            },
            "shift_erosion_saturation": {
                "A": A_c,
                "Q_low": Q_shift,
                "U0": shift,
                "mu0": Fraction(10),
                "A_norm_squared": Fraction(9),
                "normalized_unshifted": normalized_unshifted,
                "normalized_shifted": normalized_shifted,
                "eroded_floor": eroded_floor,
            },
            "rank_conditioning_capture_obstruction": {
                "g": Fraction(2),
                "delta": Fraction(1),
                "tau": Fraction(1),
                "u": u,
                "negative_residual": residual,
                "positive_part": positive,
                "B": B_capture,
                "dangerous_rank": 1,
                "physical_dimension": 2,
                "low_compression": _diag(Fraction(2), Fraction(2)),
                "s_squared": s_squared,
                "rotated_extreme_positive_part": _diag(Fraction(0), Fraction(0), Fraction(0)),
                "rotated_extreme_B": rotated_extreme,
                "rotated_extreme_s_squared": Fraction(1),
            },
            "exact_capture_cross_obstruction": {
                "negative_residual": pole_residual,
                "positive_vector": v,
                "B": B_cross,
                "low_compression": _diag(Fraction(3), Fraction(2)),
                "high_compression": Fraction(11),
                "cross_norm_squared": Fraction(36),
                "low_floor_times_high_floor": Fraction(22),
                "low_schur_complement": schur,
                "determinant": determinant,
            },
            "signed_sampling_obstruction": {
                "J": [[Fraction(0), Fraction(1)], [Fraction(1), Fraction(0)]],
                "S_column": [[Fraction(1)], [Fraction(-1)]],
                "positive_gram": Fraction(2),
                "signed_form": Fraction(-2),
            },
            "strict_cross_reserve_equality_obstruction": {
                "S_row": [[Fraction(1), Fraction(1)]],
                "gram": [[Fraction(1), Fraction(1)], [Fraction(1), Fraction(1)]],
                "mu": Fraction(1),
                "eta": Fraction(1),
                "chi_squared": Fraction(1),
                "strict_reserve_holds": False,
            },
            "ridge_capture_majorant": {
                "u": u,
                "residual_eigenvalue": Fraction(3),
                "tau": Fraction(2),
                "a": Fraction(1),
                "F_at_residual_eigenvalue": ridge_value,
                "s_squared": s_squared,
                "total_trace": ridge_total_trace,
                "captured_trace": ridge_captured_trace,
                "leakage_score": ridge_leakage,
                "capture_bound_holds": s_squared <= ridge_leakage,
            },
        }
    )


def _raw(raw: tuple[int, int, int, int]) -> list[object]:
    return [int(raw[0]), str(int(raw[1])), int(raw[2]), int(raw[3])]


def _precision_bits(dps: int) -> int:
    return (
        dps * LOG2_10_UPPER_NUMERATOR + LOG2_10_UPPER_DENOMINATOR - 1
    ) // LOG2_10_UPPER_DENOMINATOR


def _normalize_signed_dyadic(value: int, exponent: int) -> tuple[int, int, int, int]:
    if value == 0:
        return (0, 0, 0, 0)
    sign = 1 if value < 0 else 0
    mantissa = abs(value)
    while mantissa % 2 == 0:
        mantissa //= 2
        exponent += 1
    return (sign, mantissa, exponent, mantissa.bit_length())


def _shift_raw_by_power_of_two(
    raw: tuple[int, int, int, int], power: int, direction: int
) -> tuple[int, int, int, int]:
    sign, mantissa, exponent, _bit_count = raw
    signed = -mantissa if sign else mantissa
    base = min(exponent, power)
    shifted = (signed << (exponent - base)) + direction * (1 << (power - base))
    return _normalize_signed_dyadic(shifted, base)


def _guarded_raw_endpoints(
    lower: tuple[int, int, int, int],
    upper: tuple[int, int, int, int],
    dps: int,
) -> tuple[tuple[int, int, int, int], tuple[int, int, int, int]]:
    if lower == upper:
        return lower, upper
    scale_exponent = 0
    for _sign, mantissa, exponent, bit_count in (lower, upper):
        if mantissa:
            scale_exponent = max(scale_exponent, exponent + bit_count - 1)
    guard_exponent = scale_exponent - _precision_bits(dps) + SERIALIZATION_GUARD_OFFSET_BITS
    return (
        _shift_raw_by_power_of_two(lower, guard_exponent, -1),
        _shift_raw_by_power_of_two(upper, guard_exponent, 1),
    )


def _capture(value: object) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    bits = max(int(lower[3]), int(upper[3])) + 48
    with mp.workprec(bits):
        return +mp.mpf(tuple(lower)), +mp.mpf(tuple(upper))


def _serialize(value: object, dps: int) -> dict[str, object]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    lo, hi = _guarded_raw_endpoints(
        tuple(int(part) for part in lower),
        tuple(int(part) for part in upper),
        dps,
    )
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lo), dps + 10), mp.nstr(mp.mpf(hi), dps + 10)],
            "dyadic": {"lower": _raw(lo), "upper": _raw(hi)},
        }


def _transition_interval(p: int, dps: int) -> tuple[object, int]:
    if f"mpmath.iv {mp.__version__}" != EXPECTED_LIBRARY:
        raise RuntimeError("pinned mpmath.iv version is not active")
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        two = mp.iv.mpf(2)
        value = (
            two
            * mp.iv.log(mp.iv.mpf(50 * p * p + 25))
            * mp.iv.log(mp.iv.mpf(20))
            / (mp.iv.pi * mp.iv.pi)
        )
        lo, hi = _capture(value)
        q_lo = int(mp.ceil(lo))
        q_hi = int(mp.ceil(hi))
        if q_lo != q_hi:
            raise ArithmeticError("transition ceiling is not separated at requested precision")
        return value, q_lo
    finally:
        mp.iv.dps = old


def produce(lambda_numerator: int, dps: int = 80) -> dict[str, Any]:
    p = _integer(lambda_numerator, "lambda_numerator", 5)
    dps = _integer(dps, "dps", 50)
    if p % 2 == 0:
        raise ValueError("lambda_numerator must be odd")

    transition, q = _transition_interval(p, dps)
    N = (p * p + 3) // 4
    r_plus = N + (q + 2) // 4 - 1
    r_minus = N + q // 4
    exact_schedule = {
        "lambda": _rational(Fraction(p, 2)),
        "N_rule": "ceil(lambda^2)",
        "N": N,
        "projected_anchor_nonzero_hypothesis_required": True,
        "projected_anchor_nonzero_proved": False,
        "ambient_even_complement_dimension_if_anchor_nonzero": N,
        "ambient_odd_dimension": N,
        "q": q,
        "n_star": p * p + 6 + q,
        "r_plus_buffered": r_plus,
        "r_minus_buffered": r_minus,
        "even_target_count_meets_dimension_if_anchor_nonzero": r_plus >= N,
        "odd_target_count_exceeds_dimension": r_minus >= N + 1,
        "coframe_proved": False,
    }
    return {
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "input": {
            "lambda_numerator": p,
            "lambda_denominator": 2,
            "interval_decimal_digits": dps,
        },
        "source_hashes": _verified_source_hashes(),
        "locked_conventions": dict(LOCKED_CONVENTIONS),
        "locked_formulas": dict(LOCKED_FORMULAS),
        "source_admissions": dict(SOURCE_ADMISSIONS),
        "certificate": {
            "exact_schedule": exact_schedule,
            "transition_ceiling_argument": _serialize(transition, dps),
            "exact_regressions": _exact_regressions(),
        },
        "arithmetic": dict(ARITHMETIC),
        "producer_pass_boolean_trusted_by_replay": False,
        "claim_scope": {key: list(value) for key, value in CLAIM_SCOPE.items()},
        "result": RESULT,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-numerator", type=int, required=True)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output")
    args = parser.parse_args()
    encoded = json.dumps(
        produce(args.lambda_numerator, args.dps), indent=2, sort_keys=True
    ) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
