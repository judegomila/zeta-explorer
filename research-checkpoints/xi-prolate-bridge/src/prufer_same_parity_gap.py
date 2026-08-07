#!/usr/bin/env python3
"""Outward-interval evaluation of the elementary prolate gap theorem.

This module evaluates the explicit theorem proved in
``notes/PRUFER_SAME_PARITY_GAP_THEOREM.md``.  It never solves a Sturm
eigenvalue problem and never reads cached prolate eigenvalues.  The result is
an exponentially weak non-collision bound, not a conditioning theorem, a
signed Weil-sector floor, equation (5.2), determinant convergence, or RH.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from fractions import Fraction
import hashlib
import json
from pathlib import Path

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
VERSION = "0.18.1-prufer-same-parity-gap"
TERMINAL_STATE = "P0_INVALIDATED"

LOCKED_OPERATOR = "-d/dx((1-x^2)*dy/dx)+c^2*x^2*y=mu*y"
LOCKED_HALF_LINE_EQUATION = (
    "u''=sech(t)^2*(c^2*tanh(t)^2-nu)*u; x=tanh(t)"
)
LOCKED_ENDPOINT_NORMALIZATION = "u(infinity,nu)=1; u'(infinity,nu)=0"
LOCKED_PHASE = "continuous_lift_arg(u(0,nu)+i*u'(0,nu))"
LOCKED_PHASE_TARGET = "phi(mu_m)=m*pi/2"
LOCKED_INDEX = "j=n+2*r"
LOCKED_K_SQUARED = "max(1,2*c^2+j*(j+1))"
LOCKED_GAP = "(16*r*pi/(225*K^2))*exp(-2*pi*K)"
LOCKED_PROJECT_BANDWIDTH = "c=2*pi*lambda^2"
LOCKED_DIFFERENTIAL_SYMBOL = "mu"


@dataclass(frozen=True)
class RealInterval:
    lower: mp.mpf
    upper: mp.mpf

    def __post_init__(self) -> None:
        if self.lower > self.upper:
            raise ValueError("interval endpoints are reversed")


def _sha256(relative_path: str) -> str:
    return hashlib.sha256((ROOT / relative_path).read_bytes()).hexdigest()


def _copy_interval(value: object, dps: int) -> RealInterval:
    raw_lower, raw_upper = value._mpi_  # type: ignore[attr-defined]
    with mp.workdps(dps + 20):
        return RealInterval(mp.mpf(raw_lower), mp.mpf(raw_upper))


def _parse_exact_nonnegative(text: str, label: str) -> Fraction:
    if not isinstance(text, str):
        raise TypeError(f"{label} must be exact rational text; binary64 is forbidden")
    try:
        value = Fraction(text)
    except (ValueError, ZeroDivisionError) as exc:
        raise ValueError(f"invalid exact {label}") from exc
    if value < 0:
        raise ValueError(f"{label} must be nonnegative")
    return value


def _require_index(value: int, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer")
    if value < minimum:
        raise ValueError(f"{label} must be at least {minimum}")
    return value


def _require_dps(dps: int) -> int:
    if isinstance(dps, bool) or not isinstance(dps, int):
        raise TypeError("dps must be an integer")
    if dps < 40:
        raise ValueError("at least 40 interval decimal digits are required")
    return dps


def require_locked_formulas(
    *,
    operator: str = LOCKED_OPERATOR,
    half_line_equation: str = LOCKED_HALF_LINE_EQUATION,
    endpoint_normalization: str = LOCKED_ENDPOINT_NORMALIZATION,
    phase: str = LOCKED_PHASE,
    phase_target: str = LOCKED_PHASE_TARGET,
    index: str = LOCKED_INDEX,
    K_squared: str = LOCKED_K_SQUARED,
    gap: str = LOCKED_GAP,
    project_bandwidth: str = LOCKED_PROJECT_BANDWIDTH,
    differential_symbol: str = LOCKED_DIFFERENTIAL_SYMBOL,
) -> None:
    """Reject every sign, index, normalization, or constant mutation."""

    supplied = {
        "operator": operator,
        "half-line equation": half_line_equation,
        "endpoint normalization": endpoint_normalization,
        "lifted phase": phase,
        "phase target": phase_target,
        "same-parity index": index,
        "safe K squared": K_squared,
        "gap": gap,
        "project bandwidth": project_bandwidth,
        "differential eigenvalue symbol": differential_symbol,
    }
    expected = {
        "operator": LOCKED_OPERATOR,
        "half-line equation": LOCKED_HALF_LINE_EQUATION,
        "endpoint normalization": LOCKED_ENDPOINT_NORMALIZATION,
        "lifted phase": LOCKED_PHASE,
        "phase target": LOCKED_PHASE_TARGET,
        "same-parity index": LOCKED_INDEX,
        "safe K squared": LOCKED_K_SQUARED,
        "gap": LOCKED_GAP,
        "project bandwidth": LOCKED_PROJECT_BANDWIDTH,
        "differential eigenvalue symbol": LOCKED_DIFFERENTIAL_SYMBOL,
    }
    for label, value in supplied.items():
        if value != expected[label]:
            raise ValueError(f"{label} differs from the proved theorem")


def _legendre_coefficients(maximum_index: int) -> list[list[Fraction]]:
    """Build P_0,...,P_m by the exact three-term recurrence."""

    maximum_index = _require_index(maximum_index, "maximum index", 0)
    polynomials: list[list[Fraction]] = [[Fraction(1)]]
    if maximum_index == 0:
        return polynomials
    polynomials.append([Fraction(0), Fraction(1)])
    for degree in range(1, maximum_index):
        previous = polynomials[degree - 1]
        current = polynomials[degree]
        following = [Fraction(0) for _ in range(degree + 2)]
        for power, coefficient in enumerate(current):
            following[power + 1] += Fraction(2 * degree + 1, degree + 1) * coefficient
        for power, coefficient in enumerate(previous):
            following[power] -= Fraction(degree, degree + 1) * coefficient
        polynomials.append(following)
    return polynomials


def exact_c0_oracles(maximum_index: int = 4) -> list[dict[str, object]]:
    """Return exact Legendre phase data; no floating arithmetic is used."""

    polynomials = _legendre_coefficients(maximum_index)
    records: list[dict[str, object]] = []
    for index, coefficients in enumerate(polynomials):
        center = coefficients[0]
        center_derivative = coefficients[1] if len(coefficients) > 1 else Fraction(0)
        half_line_norm = Fraction(1, 2 * index + 1)
        denominator = center**2 + center_derivative**2
        if denominator <= 0:
            raise ArithmeticError("Legendre center Cauchy datum vanished")
        phase_derivative = half_line_norm / denominator
        records.append(
            {
                "m": index,
                "mu_m_at_c0": Fraction(index * (index + 1)),
                "P_m_at_zero": center,
                "P_m_prime_at_zero": center_derivative,
                "half_line_L2_norm_squared": half_line_norm,
                "phase_derivative_at_mu_m": phase_derivative,
                "lifted_phase_in_units_of_pi": Fraction(index, 2),
            }
        )
    return records


def evaluate_gap_bound(
    lambda_text: str,
    n: int,
    r: int,
    dps: int = 80,
    **locked_overrides: str,
) -> dict[str, object]:
    """Evaluate the theorem at ``c=2*pi*lambda^2`` with outward intervals."""

    require_locked_formulas(**locked_overrides)
    lam = _parse_exact_nonnegative(lambda_text, "lambda")
    n = _require_index(n, "n", 0)
    r = _require_index(r, "r", 1)
    dps = _require_dps(dps)
    j = n + 2 * r

    old_iv_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam_iv = mp.iv.mpf(lam.numerator) / mp.iv.mpf(lam.denominator)
        pi_iv = mp.iv.pi
        c_iv = 2 * pi_iv * lam_iv**2
        c_squared_iv = c_iv**2
        K_squared_candidate = 2 * c_squared_iv + j * (j + 1)
        candidate = _copy_interval(K_squared_candidate, dps)
        if candidate.lower <= 1:
            raise ArithmeticError("unexpected max branch for j=n+2r with r>=1")
        K_squared_iv = K_squared_candidate
        K_iv = mp.iv.sqrt(K_squared_iv)
        gap_iv = (
            16
            * r
            * pi_iv
            / (225 * K_squared_iv)
            * mp.iv.exp(-2 * pi_iv * K_iv)
        )
        log10_gap_iv = mp.iv.log(gap_iv) / mp.iv.log(10)
        intervals = {
            "pi": _copy_interval(pi_iv, dps),
            "c": _copy_interval(c_iv, dps),
            "c_squared": _copy_interval(c_squared_iv, dps),
            "K_squared": _copy_interval(K_squared_iv, dps),
            "K": _copy_interval(K_iv, dps),
            "gap_lower_bound": _copy_interval(gap_iv, dps),
            "log10_gap_lower_bound": _copy_interval(log10_gap_iv, dps),
        }
    finally:
        mp.iv.dps = old_iv_dps

    gap = intervals["gap_lower_bound"]
    assert isinstance(gap, RealInterval)
    if gap.lower <= 0:
        raise ArithmeticError("the outward theorem bound must remain strictly positive")

    return {
        "lambda_text": lambda_text,
        "lambda_exact": lam,
        "n": n,
        "r": r,
        "j": j,
        "dps": dps,
        "intervals": intervals,
    }


def _fraction_text(value: Fraction) -> str:
    if value.denominator == 1:
        return str(value.numerator)
    return f"{value.numerator}/{value.denominator}"


def _serialize_dyadic(value: mp.mpf) -> dict[str, object]:
    """Serialize one finite ``mpf`` exactly, without decimal rounding."""

    sign, mantissa, exponent, _bit_count = value._mpf_
    if mantissa < 0 or sign not in (0, 1):
        raise ArithmeticError("invalid internal dyadic endpoint")
    return {
        "sign": int(sign),
        "mantissa_decimal_text": str(mantissa),
        "binary_exponent": int(exponent),
    }


def _serialize_interval(interval: RealInterval, digits: int) -> dict[str, object]:
    """Keep exact dyadic endpoints; decimals are display-only."""

    return {
        "endpoint_format": "signed_mantissa_times_2_power_v1",
        "lower_exact_dyadic": _serialize_dyadic(interval.lower),
        "upper_exact_dyadic": _serialize_dyadic(interval.upper),
        "decimal_display_only": [
            mp.nstr(interval.lower, digits),
            mp.nstr(interval.upper, digits),
        ],
    }


def canonical_report(dps: int = 80) -> dict[str, object]:
    """Build the canonical lambda=2, n=0, r=2 theorem artifact."""

    evaluation = evaluate_gap_bound("2", 0, 2, dps)
    digits = dps + 12
    intervals = evaluation["intervals"]
    assert isinstance(intervals, dict)
    oracle = exact_c0_oracles(4)
    serialized_oracle: list[dict[str, object]] = []
    for row in oracle:
        serialized_oracle.append(
            {
                key: _fraction_text(value) if isinstance(value, Fraction) else value
                for key, value in row.items()
            }
        )

    return {
        "artifact_version": VERSION,
        "terminal_state": TERMINAL_STATE,
        "construction": "elementary_half_line_prufer_gap_v1",
        "precision_decimal_digits": dps,
        "provenance_sha256": {
            "notes/PRUFER_SAME_PARITY_GAP_THEOREM.md": _sha256(
                "notes/PRUFER_SAME_PARITY_GAP_THEOREM.md"
            ),
            "src/prufer_same_parity_gap.py": _sha256(
                "src/prufer_same_parity_gap.py"
            ),
            "verifier/prufer_same_parity_gap_replay.py": _sha256(
                "verifier/prufer_same_parity_gap_replay.py"
            ),
        },
        "locked_formulas": {
            "operator": LOCKED_OPERATOR,
            "half_line_equation": LOCKED_HALF_LINE_EQUATION,
            "endpoint_normalization": LOCKED_ENDPOINT_NORMALIZATION,
            "phase": LOCKED_PHASE,
            "phase_target": LOCKED_PHASE_TARGET,
            "same_parity_index": LOCKED_INDEX,
            "K_squared": LOCKED_K_SQUARED,
            "gap": LOCKED_GAP,
            "project_bandwidth": LOCKED_PROJECT_BANDWIDTH,
            "differential_eigenvalue_symbol": LOCKED_DIFFERENTIAL_SYMBOL,
        },
        "exact_input": {
            "lambda_rational_text": "2",
            "n_integer": 0,
            "r_integer": 2,
            "j_integer": 4,
            "c_exact_formula": "8*pi",
            "K_squared_exact_formula": "128*pi^2+20",
        },
        "proof_constants_exact": {
            "volterra_tail_operator_norm_upper": "1/4",
            "u_T_lower": "2/3",
            "u_T_upper": "4/3",
            "absolute_u_prime_T_upper": "2/3",
            "energy_T_lower": "16/45",
            "energy_T_upper": "7/3",
            "center_Cauchy_lower_coefficient": "64/225",
            "numerator_upper_coefficient": "4",
            "phase_derivative_upper_coefficient": "225/16",
            "step_four_gap_prefactor_in_units_of_pi": "32/225",
        },
        "outward_intervals": {
            key: _serialize_interval(value, digits)
            for key, value in intervals.items()
        },
        "c0_legendre_oracles": serialized_oracle,
        "c0_same_parity_gap_oracle": {
            "n_integer": 0,
            "r_integer": 2,
            "j_integer": 4,
            "mu_j_minus_mu_n_exact": "20",
        },
        "theorem_flags": {
            "standard_sturm_qualitative_input_used": True,
            "elementary_quantitative_gap_proved": True,
            "same_parity_only": True,
            "numerical_sturm_solver_used": False,
            "cached_prolate_eigenvalues_read": False,
            "external_gap_theorem_source_used": False,
            "growing_window_conditioning_proved": False,
            "signed_weil_sector_floor_proved": False,
            "equation_5_2_proved": False,
            "local_uniform_determinant_convergence_proved": False,
            "status_promoted": False,
        },
        "shared_library_limitation": (
            "producer and independent replay both use mpmath.iv for "
            "transcendental outward intervals"
        ),
        "claim_scope": (
            "standard qualitative Sturm input plus an elementary quantitative "
            "non-collision bound and exact c=0 Legendre oracles; no numerical "
            "eigensolve"
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    report = canonical_report(args.dps)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + "\n")


if __name__ == "__main__":
    main()
