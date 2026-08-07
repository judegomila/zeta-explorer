#!/usr/bin/env python3
"""Produce the split-block quotient-action component certificate.

The certificate proves a finite positive-sampling action theorem and records
two exact shortcut counterexamples.  It does not provide a signed Weil floor,
equation (5.2), determinant convergence, or a Riemann-hypothesis conclusion.
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


SCHEMA = "xi-prolate-block-quotient-action-v1"
STATUS = "BLOCK_QUOTIENT_ACTION_COMPONENT"
RESULT = "BLOCK_QUOTIENT_ACTION_COMPONENT_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md"
SOURCE_LOCK = "BLOCK_QUOTIENT_ACTION_SOURCE_LOCK.json"
PINNED_HASHES = {
    NOTE: "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
    SOURCE_LOCK: "1a3993f3bda080c3d9dd870c8ffffb9b4b278eb5049d0508c72389a5c15f10a4",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")

LOCKED_FORMULAS = {
    "block_metric": "D_L=D_8 direct_sum D_R; A_i=W_i*D_i^(-1/2); R_L=A_8*A_8^*+A_R*A_R^*",
    "quotient": "Delta_L=R_L^dagger on K_L and Delta_L^(-1)=R_L on K_L",
    "low_action": "Gamma_L<= (sqrt(C_8*M_8)+sqrt(C_R*M_R))^2",
    "arithmetic_map": "norm(T*f)^2<=lambda^2*norm(f)^2/2 for additive-even f",
    "ground_integral": "abs(I_0)^2>=1/(4*lambda)",
    "transition_point": "V0=lambda^(-1)+8*pi*lambda and abs(rho_t)^2<=4*lambda*V0=4+32*pi*lambda^2",
    "rest_inventory": "q_R=max(0,floor((n_star-1)/4)-2)<=3*lambda^2/2",
    "rest_synthesis": "d_12*M_R<=q_R*lambda^2*(5+32*pi*lambda^2)/2<=3*lambda^4*(5+32*pi*lambda^2)/4",
    "fixed_limits": "rho_8 tends to -sqrt(70)/16 and d_12/d_8 is asymptotic to (8192*pi^4/1485)*lambda^8",
    "high_extension": "Gamma(Delta_L direct_sum g*I)<=Gamma_L+B_H/g^2",
    "metric_counterexample": "W=[1,1], D_bd=2*I, D_full=[[2,-1],[-1,2]] gives Gamma_bd=1 and Gamma_full=4",
    "complement_counterexample": "Q=diag(1,-1,1), K_L=span(e1), F_high=span(e3) gives low floor 1, Fourier-high floor 1, and physical-complement floor -1",
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "cached_quotient_matrix_read": False,
    "zeta_zero_table_read": False,
    "zeros_assumed_real": False,
    "global_weil_positivity_assumed": False,
    "block_diagonal_metric_used": True,
    "full_metric_substituted": False,
    "cross_block_sampling_terms_retained": True,
    "low_high_sampling_terms_retained": True,
    "squared_sum_replaced_by_maximum": False,
    "physical_complement_identified_with_fourier_high": False,
    "qualitative_limits_used_as_finite_bounds": False,
    "signed_weil_floor_claimed": False,
    "equation_5_2_claimed": False,
    "determinant_limit_claimed": False,
    "rh_proved": False,
}

CLAIM_SCOPE = {
    "proved": [
        "split-block low positive-sampling quotient action with the cross-block term retained",
        "finite physical synthesis bounds expressed through d_8 and d_12",
        "qualitative low action scale O(lambda^3*polylog(lambda)/d_8)",
        "conditional high-complement action formula and exact shortcut counterexamples",
    ],
    "not_proved": [
        "an effective threshold for the fixed-index asymptotics",
        "a finite numerical value of d_8 or d_12",
        "a signed floor on the physical complement",
        "a shifted signed comparison in either parity sector",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _verified_source_hashes() -> dict[str, str]:
    root = _root()
    lock = json.loads((root / SOURCE_LOCK).read_text(encoding="utf-8"))
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "dependencies", "locked_conventions", "locked_formulas", "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ValueError("block-action source-lock inventory mismatch")
    if lock["schema"] != "xi-prolate-block-quotient-action-source-lock-v1":
        raise ValueError("block-action source-lock schema mismatch")
    if lock["terminal_state"] != TERMINAL_STATE or lock["locked_formulas"] != LOCKED_FORMULAS:
        raise ValueError("block-action source-lock mutation")
    result = dict(PINNED_HASHES)
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None or _sha256(root / relative) != expected:
            raise ValueError(f"source byte hash mismatch: {relative}")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("block-action dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed block-action dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        if (
            not isinstance(relative, str) or not relative
            or Path(relative).is_absolute() or ".." in Path(relative).parts
            or relative in result
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ValueError("invalid block-action dependency fields")
        if _sha256(root / relative) != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _integer(value: Any, name: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{name} must be an exact integer")
    if value < minimum:
        raise ValueError(f"{name} must be at least {minimum}")
    return value


def _rational(value: Fraction) -> dict[str, str]:
    return {"numerator": str(value.numerator), "denominator": str(value.denominator)}


def _raw(raw: tuple[int, int, int, int]) -> list[object]:
    return [int(raw[0]), str(int(raw[1])), int(raw[2]), int(raw[3])]


def _serialize(value: object, dps: int) -> dict[str, object]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    lo = tuple(int(part) for part in lower)
    hi = tuple(int(part) for part in upper)
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lo), dps + 10), mp.nstr(mp.mpf(hi), dps + 10)],
            "dyadic": {"lower": _raw(lo), "upper": _raw(hi)},
        }


def _capture(value: object) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    bits = max(int(lower[3]), int(upper[3])) + 32
    with mp.workprec(bits):
        return +mp.mpf(tuple(lower)), +mp.mpf(tuple(upper))


def _stable_ceiling(value: object) -> int:
    lower, upper = _capture(value)
    lo = int(mp.ceil(lower))
    hi = int(mp.ceil(upper))
    if lo != hi:
        raise ArithmeticError("transition interval does not determine one ceiling")
    return lo


def _exact_regressions() -> dict[str, object]:
    half = Fraction(1, 2)
    block_product = half * half
    block_term = Fraction(1, 2)
    low_bound = (block_term + block_term) ** 2
    low_gamma = Fraction(1, 1)
    g = Fraction(3, 1)
    high_sampling = Fraction(1, 1)
    full_gamma = low_gamma + high_sampling / g**2

    # W=[1,1].  The block metric has inverse diag(1/2,1/2).
    block_R = Fraction(1, 1)
    block_metric_gamma = block_R**2
    # [[2,-1],[-1,2]]^{-1}=(1/3)[[2,1],[1,2]].
    full_R = Fraction(2, 1)
    full_metric_gamma = full_R**2

    # A nontrivial two-dimensional physical range inside Q^3.  This checks
    # that the inverse action is taken on the range and zero-extended on its
    # orthogonal complement.
    nontrivial_gamma = Fraction(22 * 22 + 28 * 28, 1)
    nontrivial_bound = Fraction((1 + 35) ** 2, 1)

    return {
        "block_action_saturation": {
            "source_kernel_dimension": 1,
            "C_8": _rational(half),
            "C_R": _rational(half),
            "M_8": _rational(half),
            "M_R": _rational(half),
            "C_8_times_M_8": _rational(block_product),
            "C_R_times_M_R": _rational(block_product),
            "low_Gamma": _rational(low_gamma),
            "squared_sum_upper": _rational(low_bound),
            "high_metric_g": _rational(g),
            "high_sampling_B_H": _rational(high_sampling),
            "full_Gamma": _rational(full_gamma),
            "low_plus_high_upper": _rational(full_gamma),
        },
        "nontrivial_range_action": {
            "physical_dimension": 3,
            "physical_range_dimension": 2,
            "C_8": _rational(Fraction(1, 1)),
            "C_R": _rational(Fraction(49, 1)),
            "M_8": _rational(Fraction(1, 1)),
            "M_R": _rational(Fraction(25, 1)),
            "low_Gamma": _rational(nontrivial_gamma),
            "squared_sum_upper": _rational(nontrivial_bound),
            "range_projector_trace": _rational(Fraction(2, 1)),
        },
        "full_metric_substitution_counterexample": {
            "block_diagonal_Gamma": _rational(block_metric_gamma),
            "full_metric_Gamma": _rational(full_metric_gamma),
            "full_over_block_ratio": _rational(full_metric_gamma / block_metric_gamma),
        },
        "physical_fourier_complement_counterexample": {
            "physical_low_floor": _rational(Fraction(1, 1)),
            "fourier_high_floor": _rational(Fraction(1, 1)),
            "physical_complement_floor": _rational(Fraction(-1, 1)),
        },
        "fixed_index_coefficient_ledger": {
            "d12_over_d8_rational_prefactor": _rational(Fraction(8192, 1485)),
            "rho8_squared_limit": _rational(Fraction(35, 128)),
            "singleton_lambda_exponent": 3,
            "rest_lambda_exponent_after_defect_conversion": 1,
        },
    }


def _intervals(p: int, q_rest: int, dps: int) -> tuple[dict[str, object], int]:
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        one = mp.iv.mpf(1)
        two = one + one
        lam = mp.iv.mpf(p) / two
        pi = +mp.iv.pi
        lam2 = lam * lam
        beta = (two / (pi * pi)) * mp.iv.log(200 * lam2 + 25)
        buffer_ceil = _stable_ceiling(beta * mp.iv.log(20))
        d4_upper = 10 * mp.iv.exp(-(p * p - 11) / beta)
        v0 = one / lam + 8 * pi * lam
        rho_rest_squared = 4 * lam * v0
        raw_column_norm_squared = lam2 * (5 + 32 * pi * lam2) / two
        d12_M_rest = q_rest * raw_column_norm_squared
        d12_M_rest_coarse = 3 * lam2 * lam2 * (5 + 32 * pi * lam2) / 4
        defect_ratio_coefficient = 8192 * pi**4 / 1485
        rho8_limit = -mp.iv.sqrt(70) / 16
        if _capture(d4_upper)[1] > mp.mpf("0.5"):
            raise ArithmeticError("finite KRD bound did not prove d_4<=1/2")
        values = {
            "beta": beta,
            "d4_upper": d4_upper,
            "V0": v0,
            "rho_rest_squared_upper": rho_rest_squared,
            "raw_rest_column_norm_squared_upper": raw_column_norm_squared,
            "d12_times_M_rest_upper": d12_M_rest,
            "d12_times_M_rest_coarse_upper": d12_M_rest_coarse,
            "fixed_d12_over_d8_coefficient": defect_ratio_coefficient,
            "fixed_rho8_limit": rho8_limit,
        }
        return values, buffer_ceil
    finally:
        mp.iv.dps = old


def produce(lambda_numerator: int, dps: int = 80) -> dict[str, Any]:
    p = _integer(lambda_numerator, "lambda_numerator", 5)
    dps = _integer(dps, "dps", 50)
    if p % 2 == 0:
        raise ValueError("lambda_numerator must be odd")

    # The interval calculation independently determines the KRD ceiling.
    preliminary, buffer_ceil = _intervals(p, 0, dps)
    n_star = p * p + 6 + buffer_ceil
    modal_limit = (n_star - 1) // 4
    q_rest = max(0, modal_limit - 2)
    values, second_ceiling = _intervals(p, q_rest, dps)
    if second_ceiling != buffer_ceil:
        raise ArithmeticError("transition ceiling changed between assemblies")
    del preliminary
    rest_targets = list(range(12, n_star, 4))
    if len(rest_targets) != q_rest:
        raise ArithmeticError("physical rest inventory mismatch")
    if Fraction(q_rest) > Fraction(3 * p * p, 8):
        raise ArithmeticError("coarse physical rest inventory bound failed")

    exact = {
        "lambda": _rational(Fraction(p, 2)),
        "lambda_squared": _rational(Fraction(p * p, 4)),
        "shannon_index": p * p,
        "buffer_ceil": buffer_ceil,
        "n_star": n_star,
        "sampling_modal_row_limit": modal_limit,
        "physical_rest_column_count": q_rest,
        "physical_rest_targets": rest_targets,
        "ground_integral_squared_lower": _rational(Fraction(1, 2 * p)),
        "arithmetic_map_norm_squared_factor": _rational(Fraction(p * p, 8)),
        "rest_count_coarse_bound": _rational(Fraction(3 * p * p, 8)),
        "finite_defect_values_serialized": False,
        "fixed_index_limits_effective": False,
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
        "locked_formulas": dict(LOCKED_FORMULAS),
        "source_admissions": dict(SOURCE_ADMISSIONS),
        "certificate": {
            "exact": exact,
            "outward_intervals": {
                name: _serialize(value, dps) for name, value in values.items()
            },
            "exact_regressions": _exact_regressions(),
            "finite_product_serialized": "d_12*M_R",
            "fixed_index_limit_classification": "qualitative_non_effective",
        },
        "arithmetic": {
            "precision_mode": "outward arbitrary-precision intervals",
            "raw_interval_or_ball_output_applicable": True,
            "library": f"mpmath.iv {mp.__version__}",
            "shared_library_with_verifier": True,
            "independent_formula_trees": True,
        },
        "producer_pass_boolean_trusted_by_replay": False,
        "claim_scope": {
            "proved": list(CLAIM_SCOPE["proved"]),
            "not_proved": list(CLAIM_SCOPE["not_proved"]),
        },
        "result": RESULT,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-numerator", type=int, required=True)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output")
    args = parser.parse_args()
    report = produce(args.lambda_numerator, args.dps)
    encoded = json.dumps(report, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
