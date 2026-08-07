#!/usr/bin/env python3
"""Produce a growing transition-family sampling/projection certificate."""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp

from transition_window_bound import transition_window_bound


SCHEMA = "xi-prolate-growing-transition-sampling-v1"
STATUS = "GROWING_TRANSITION_SAMPLING_COMPONENT"
TERMINAL_STATE = "P0_INVALIDATED"
RESULT = "GROWING_TRANSITION_SAMPLING_COMPONENT_PASS"
NOTE = "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md"
SOURCE_LOCK = "GROWING_TRANSITION_SAMPLING_SOURCE_LOCK.json"
PINNED_HASHES = {
    NOTE: "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    SOURCE_LOCK: "585d13e3860106840e0bd550eaa30ff16eee78a182b926ccf4656e69be59bc6b",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")

LOCKED_FORMULAS = {
    "origin_point_bound": "V0=lambda^(-1)+8*pi*lambda and abs(g(0))^2<=q*V0*D(a)",
    "outer_norm_constant": "E_q=q*(sqrt(1062724*lambda)*L_lambda+C2*sqrt(V0)/(24*sqrt(2)))^2",
    "outer_translation_constant": "D_q=q*(sqrt(D_tr)+sqrt(V0*C_b/2))^2",
    "outer_hybrid_series": "B_out_q=256*Z_finite*E_q+sum_j Z_j*delta_j^(-3)*min((512/3)*E_q,(5120/3)*D_q*exp(-phi_j))",
    "modal_variation": "V_star=46*lambda*c^3+108*pi*lambda^2",
    "all_index_floor": "d_LS=6*96^(-5-(320*pi/log(2))*lambda^2)",
    "projection_norm": "X_q=q*L*V_star^2/(2*pi^2*N*d_LS)",
    "projection_ratio": "A_N=3*(1+sqrt(2*N))+3*L/(4*pi*sqrt(2*N)); H_N=max(1,2*pi^2*N*A_N^2/L)",
    "projection_sampling": "B_proj_q=192*sqrt(e)*lambda*(1+log(lambda))^2*X_q*(Z_finite+(C_Z/pi)*((pi+1)*log(H_N+2)+1))",
    "complete_remainder": "C_q=(sqrt(B_out_q)+sqrt(B_proj_q))^2",
    "block_scales": "C_8=O(lambda*polylog(lambda)); C_rest=O(lambda^3*polylog(lambda))",
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "zeta_zero_table_read": False,
    "zeros_assumed_real": False,
    "global_weil_positivity_assumed": False,
    "invisible_origin_correction_retained": True,
    "compact_projection_retained": True,
    "all_sampling_cross_terms_retained": True,
    "full_cross_block_metric_replaced_by_compressions": False,
    "signed_weil_floor_claimed": False,
    "equation_5_2_claimed": False,
    "rh_proved": False,
}

CLAIM_SCOPE = {
    "proved": [
        "complete corrected outer-remainder Loewner bound for each prescribed split plus block",
        "compact projection-remainder Loewner bound with one all-index defect-floor loss",
        "C_8=O(lambda*polylog(lambda)) and C_rest=O(lambda^3*polylog(lambda)) on the exponential schedule",
    ],
    "not_proved": [
        "the blockwise physical synthesis factors",
        "identification with a quotient of a full cross-block source metric",
        "a shifted signed Weil-sector floor",
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
        raise ValueError("growing-sampling source-lock inventory mismatch")
    if lock["schema"] != "xi-prolate-growing-transition-sampling-source-lock-v1":
        raise ValueError("growing-sampling source-lock schema mismatch")
    if lock["terminal_state"] != TERMINAL_STATE or lock["locked_formulas"] != LOCKED_FORMULAS:
        raise ValueError("growing-sampling source-lock mutation")
    result = dict(PINNED_HASHES)
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None or _sha256(root / relative) != expected:
            raise ValueError(f"source byte hash mismatch: {relative}")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("growing-sampling dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed growing-sampling dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        if (
            not isinstance(relative, str) or not relative or Path(relative).is_absolute()
            or ".." in Path(relative).parts or relative in result
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ValueError("invalid growing-sampling dependency fields")
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
    low = int(mp.ceil(lower))
    high = int(mp.ceil(upper))
    if low != high:
        raise ArithmeticError("interval does not determine one buffer ceiling")
    return low


def _intervals(p: int, q: int, dps: int) -> tuple[dict[str, object], int]:
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(p) / 2
        pi = +mp.iv.pi
        log2 = mp.iv.log(2)
        c = 2 * pi * lam**2
        K = 2 * pi * lam**3
        L_lambda = 1 + mp.iv.log(2 + 2 * pi * lam**2)
        beta = 2 / pi**2 * mp.iv.log(200 * lam**2 + 25)
        buffer_ceil = _stable_ceiling(beta * mp.iv.log(20))
        d_tr_near = (
            1_119_744 * pi**2 * lam**5
            + 290_304 * pi**2 * lam**3
            + 320 * c**4 * lam
        )
        d_tr = 6 * (
            82_944 * pi**2 * lam + d_tr_near + 1_000_000_000 * K**2 / lam
        )
        c2 = (
            40 * mp.iv.power(3, -mp.iv.mpf(1) / 4)
            * mp.iv.exp(-(1 + mp.iv.sqrt(3)) / 2)
            / (1 - 1 / mp.iv.sqrt(3))**2
        )
        c_phi3 = 222_816 * mp.iv.sqrt(mp.iv.e)
        c_psi3 = 9 * c_phi3
        c_b = (2 * c2**2 + (c_psi3 + 4 * c2) ** 2) / 36
        v0 = 1 / lam + 8 * pi * lam
        e_q = q * (
            mp.iv.sqrt(1_062_724 * lam) * L_lambda
            + c2 * mp.iv.sqrt(v0) / (24 * mp.iv.sqrt(2))
        ) ** 2
        d_q = q * (mp.iv.sqrt(d_tr) + mp.iv.sqrt(v0 * c_b / 2)) ** 2

        L = 2 * mp.iv.log(lam)
        projection_exponent = 2400 * p * p
        N = mp.iv.power(2, projection_exponent)
        d_ls = 6 * mp.iv.power(
            96, -5 - (320 * pi / log2) * lam**2
        )
        v_star = 46 * lam * c**3 + 108 * pi * lam**2
        x_q = q * L * v_star**2 / (2 * pi**2 * N * d_ls)
        sqrt_2n = mp.iv.sqrt(2 * N)
        a_n = 3 * (1 + sqrt_2n) + 3 * L / (4 * pi * sqrt_2n)
        h_n = 2 * pi**2 * N * a_n**2 / L
        if _capture(h_n)[0] <= 1:
            raise ArithmeticError("projection ratio H_N was not proved above one")

        t0 = mp.iv.mpf(30_610_046_000)
        U = 2 * (t0 + 1)
        main_count = U / (2 * pi) * mp.iv.log(U / (2 * pi * mp.iv.e))
        count_error = (
            mp.iv.mpf("0.103787") * mp.iv.log(U)
            + mp.iv.mpf("0.257297") * mp.iv.log(mp.iv.log(U))
            + mp.iv.mpf("9.367419")
        )
        z_finite = 1 + main_count - mp.iv.mpf(1) / 8 + count_error
        c_z = (
            1 + 1 / pi
            + 2 * (mp.iv.mpf("0.103787") + mp.iv.mpf("0.257297"))
            + 2 * mp.iv.mpf("9.367419")
        )
        b_proj = (
            192 * mp.iv.sqrt(mp.iv.e) * lam * (1 + mp.iv.log(lam)) ** 2
            * x_q
            * (z_finite + (c_z / pi) * ((pi + 1) * mp.iv.log(h_n + 2) + 1))
        )
        exponent_reserve = mp.iv.log(N * d_ls)
        if _capture(exponent_reserve)[0] <= 0:
            raise ArithmeticError("projection schedule exponent reserve is not positive")

        values = {
            "beta": beta,
            "V0": v0,
            "C2": c2,
            "C_b": c_b,
            "L_lambda": L_lambda,
            "D_tr": d_tr,
            "E_q": e_q,
            "D_q": d_q,
            "logarithmic_length_L": L,
            "d_LS": d_ls,
            "V_star": v_star,
            "X_q": x_q,
            "A_N": a_n,
            "H_N": h_n,
            "Z_finite": z_finite,
            "C_Z": c_z,
            "B_proj_q": b_proj,
            "log_N_times_d_LS": exponent_reserve,
        }
        return values, buffer_ceil
    finally:
        mp.iv.dps = old


def produce(lambda_numerator: int, modal_rows: int, dps: int = 80) -> dict[str, Any]:
    p = _integer(lambda_numerator, "lambda_numerator", 5)
    if p % 2 == 0:
        raise ValueError("lambda_numerator must be odd")
    q = _integer(modal_rows, "modal_rows", 1)
    dps = _integer(dps, "dps", 50)
    transition = transition_window_bound(str(Fraction(p, 2)), dps)
    rest_limit = (transition.n_star - 1) // 4
    if q > rest_limit:
        raise ValueError("modal_rows exceeds the prescribed split-plus inventory")
    values, independent_buffer = _intervals(p, q, transition.interval_dps)
    if independent_buffer != transition.buffer_ceil:
        raise ArithmeticError("independent KRD buffer assemblies disagree")

    exact = {
        "lambda": {"numerator": str(p), "denominator": "2"},
        "lambda_squared": {"numerator": str(p * p), "denominator": "4"},
        "modal_rows": q,
        "shannon_index": p * p,
        "buffer_ceil": transition.buffer_ceil,
        "n_star": transition.n_star,
        "projection_exponent_base_2": 2400 * p * p,
        "singleton_modal_rows": 3,
        "rest_modal_row_limit": rest_limit,
        "rest_limit_below_three_halves_lambda_squared": (
            Fraction(rest_limit) <= Fraction(3 * p * p, 8)
        ),
        "outer_constants_exactly_linear_in_q": True,
        "projection_constant_exactly_linear_in_q": True,
    }
    return {
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "input": {
            "lambda_numerator": p,
            "lambda_denominator": 2,
            "modal_rows": q,
            "interval_decimal_digits": transition.interval_dps,
        },
        "source_hashes": _verified_source_hashes(),
        "locked_formulas": dict(LOCKED_FORMULAS),
        "source_admissions": dict(SOURCE_ADMISSIONS),
        "certificate": {
            "exact": exact,
            "outward_intervals": {
                key: _serialize(value, transition.interval_dps)
                for key, value in values.items()
            },
            "finite_outer_bound": "B_out_q is the exact convergent minimum series in locked_formulas",
            "complete_loewner_constant": "C_q=(sqrt(B_out_q)+sqrt(B_proj_q))^2",
        },
        "arithmetic": {
            "precision_mode": "outward arbitrary-precision intervals",
            "library": f"mpmath.iv {mp.__version__}",
            "shared_library_with_verifier": True,
            "raw_interval_or_ball_output_applicable": True,
            "independence_limitation": (
                "producer and verifier independently assemble every formula but both "
                "use mpmath.iv for transcendental interval arithmetic"
            ),
        },
        "producer_pass_boolean_trusted_by_replay": False,
        "claim_scope": {key: list(value) for key, value in CLAIM_SCOPE.items()},
        "result": RESULT,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-numerator", type=int, required=True)
    parser.add_argument("--modal-rows", type=int, required=True)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output")
    args = parser.parse_args()
    encoded = json.dumps(
        produce(args.lambda_numerator, args.modal_rows, args.dps),
        indent=2,
        sort_keys=True,
    ) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
