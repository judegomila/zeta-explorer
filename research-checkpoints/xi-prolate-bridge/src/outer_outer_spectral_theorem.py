#!/usr/bin/env python3
"""Producer for the source-locked outer--outer spectral theorem.

The producer validates the binding zero-sampling and Slepian locks, pins the
accepted weighted-translation component, and reconstructs only explicit
elementary constants and selected terms of the exact positive dyadic series.
It does not read a zero table, truncate the theorem constant, or infer a
signed Weil-sector floor.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp

from prolate_defect_source_lock import load_and_validate as validate_prolate_lock
from zero_sampling_source_lock import load_and_validate as validate_zero_lock


SCHEMA = "xi-prolate-outer-outer-spectral-theorem-v1"
TERMINAL_STATE = "P0_INVALIDATED"
STATUS = "ANALYTIC_UNIFORM_OUTER_OUTER_SPECTRAL_COMPONENT"
THEOREM_NOTE = "notes/OUTER_OUTER_SPECTRAL_THEOREM.md"
DYADIC_INDICES = (0, 34, 64)

COMPONENT_HASHES = {
    "notes/OUTER_OUTER_SPECTRAL_THEOREM.md": (
        "02407eafa8fd5db4c5d8b5bbb2f62d5215f6ef5bf1cb5104fa53caddb52800e4"
    ),
    "ZERO_SAMPLING_SOURCE_LOCK.json": (
        "f4cad4acb30dbfcdc5b30faafe92934e8958ad1cd11cbf6abea932f902e8c101"
    ),
    "PROLATE_DEFECT_SOURCE_LOCK.json": (
        "0844df654ee968b1c371ec96618d10d219da9fde702d62faa4f0c6be139b036d"
    ),
    "notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md": (
        "34bb4e43faf04f34e11126946b1069480375d5ba18baf9c97e9746b246594a0f"
    ),
    "src/outer_outer_weighted_translation.py": (
        "b35a0a716bd73eb2dc54ece1df493eafc76c623bf2a8b28a23b7021d81d9d5f2"
    ),
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md": (
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc"
    ),
    "notes/COMPACT_PROJECTION_WEIL_BOUND.md": (
        "61cce2214563cfb1099ea4d22c1d4831c705eba33df48fbddbddbe395ec91d93"
    ),
    "notes/OUTER_PROJECTION_RADICAL_REDUCTION.md": (
        "3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd"
    ),
}

LOCKED_FORMULAS = {
    "angular_log_fourier": "F(z)=integral_R O(t)*exp(-i*z*t) dt",
    "zero_parameter": "s_rho=gamma+i*(1/2-beta)",
    "radical_bv_bypass": (
        "F_O(s_rho)=-F_X(s_rho) at both evaluations; compact BV X gives "
        "absolute convergence and W_Z(O,O)=q_lambda(X,X) termwise"
    ),
    "reflected_state": (
        "O=(1-C)*(1+J)/2*E(tilde_h); both inversion-reflected tails included"
    ),
    "sawtooth_with_phase": (
        "||Delta[1_(s>=0)*exp(-delta*s)*P(A*exp(s))]||_2^2"
        "<=128*delta^(-1)*A^delta*h^delta"
    ),
    "physical_constant": (
        "D_S=36864*pi^2*a4^2*lambda^3*(32+256*pi*lambda^3+"
        "16384*sqrt(2*pi)*lambda^4)+8*a4^2*lambda*C_b"
    ),
    "degree_seven_majorant": (
        "D_S(lambda)<=C_D*lambda^7; C_D=36864*pi^2*a4^2*(2+128*pi+"
        "16384*sqrt(2*pi))+a4^2*C_b/8 for lambda>=2"
    ),
    "low_block": "C_low=128*Z_finite",
    "gamma_zero": (
        "eta(sigma)>0 and 1-2^(1-sigma)<0 imply zeta(sigma)<0 for 0<sigma<1"
    ),
    "high_series": (
        "S_high=sum_(j>=0) Z(T_j)*(4/3)*delta(T_j)^(-3)*"
        "(2*T_j)^(-3*delta(T_j)/4), T_j=3*2^j"
    ),
    "spectral_constant": "C_spec=128*Z_finite+1280*S_high",
    "spectral_bound": "abs(W_Z(O,O))<=C_spec*D_S(lambda)*d4",
    "slepian_limit": "c=2*pi*lambda^2; c^4*d4/d8->105/256",
    "qualitative_conclusion": "abs(W_Z(O,O))/d8->0",
    "ritz_corollary": "q_lambda(p,p)=o(d8) on the locked exponential schedule",
}

SOURCE_ADMISSIONS = {
    "global_zeros_assumed_real_or_on_critical_line": False,
    "zero_list_read": False,
    "low_height_input": (
        "PT Theorem 1 through exact height 3000175332800; published "
        "computer-assisted result not replayed"
    ),
    "gamma_zero_handled_without_PT_extension": True,
    "hsw_sampling_input": (
        "HSW Theorem 1.1 with R(T)=0.103787*log(T)+0.257297*loglog(T)+"
        "9.367419 for T>=30610046000"
    ),
    "hsw_rounded_corollary_substituted": False,
    "mty_indirect_finite_database_dependency_disclosed": True,
    "both_reflected_tails_retained": True,
    "sawtooth_phase_factor_retained": True,
    "explicit_distribution_extended_to_arbitrary_noncompact_outer": False,
    "compact_bv_radical_bypass_used": True,
    "outer_outer_spectral_bound_proved": True,
    "signed_sector_floor_proved": False,
    "shifted_resolvent_schedule_proved": False,
    "locally_uniform_determinant_convergence_proved": False,
    "status_promoted": False,
}

_DECIMAL = re.compile(r"^[0-9]+(?:\.[0-9]+)?$")


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _require_lambda(value: object) -> str:
    if not isinstance(value, str) or _DECIMAL.fullmatch(value) is None:
        raise TypeError("lambda must be an unsigned decimal string, never binary64")
    return value


def _require_int(value: object, name: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{name} must be an exact integer")
    if value < minimum:
        raise ValueError(f"{name} must be at least {minimum}")
    return value


def verify_component_hashes() -> dict[str, str]:
    root = _root()
    for relative, expected in COMPONENT_HASHES.items():
        if _hash(root / relative) != expected:
            raise ValueError(f"component hash mismatch: {relative}")
    return dict(COMPONENT_HASHES)


def validate_binding_locks() -> None:
    root = _root()
    zero = validate_zero_lock(root / "ZERO_SAMPLING_SOURCE_LOCK.json", root)
    if zero["admission_boundary"][
        "zeros_assumed_real_or_on_critical_line_globally"
    ] is not False:
        raise ValueError("global zero-reality assumption is forbidden")
    if zero["admission_boundary"][
        "hsw_database_corollary_used_for_sampling_overlap"
    ] is not False:
        raise ValueError("rounded/database HSW corollary cannot replace Theorem 1.1")
    validate_prolate_lock(root / "PROLATE_DEFECT_SOURCE_LOCK.json", root)


def _raw_endpoint(raw: tuple[int, int, int, int]) -> list[object]:
    return [int(raw[0]), str(int(raw[1])), int(raw[2]), int(raw[3])]


def _serialize(value: Any, digits: int) -> dict[str, object]:
    lower, upper = value._mpi_
    lo = tuple(int(item) for item in lower)
    hi = tuple(int(item) for item in upper)
    with mp.workdps(digits + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lo), digits), mp.nstr(mp.mpf(hi), digits)],
            "dyadic": {
                "lower": _raw_endpoint(lo),
                "upper": _raw_endpoint(hi),
            },
        }


def _analytic_error(value: Any) -> Any:
    return (
        mp.iv.mpf("0.103787") * mp.iv.log(value)
        + mp.iv.mpf("0.257297") * mp.iv.log(mp.iv.log(value))
        + mp.iv.mpf("9.367419")
    )


def _zero_count_main(value: Any, pi: Any) -> Any:
    return value / (2 * pi) * mp.iv.log(value / (2 * pi * mp.iv.e))


def _finite_overlap(pi: Any) -> Any:
    upper = mp.iv.mpf(61220092002)
    return 1 + _zero_count_main(upper, pi) - mp.iv.mpf(1) / 8 + _analytic_error(upper)


def _overlap_for_index(index: int, pi: Any, finite: Any) -> Any:
    t_integer = 3 * 2**index
    if t_integer < 30610046001:
        return finite
    endpoint = mp.iv.mpf(2 * t_integer + 1)
    return 1 + mp.iv.log(endpoint) / pi + 2 * _analytic_error(endpoint)


def _dyadic_term(index: int, pi: Any, finite: Any) -> Any:
    t = mp.iv.mpf(3 * 2**index)
    log_upper = mp.iv.log(2 * t)
    delta = 1 / (
        mp.iv.mpf("55.241")
        * mp.iv.power(log_upper, mp.iv.mpf(2) / 3)
        * mp.iv.power(mp.iv.log(log_upper), mp.iv.mpf(1) / 3)
    )
    overlap = _overlap_for_index(index, pi, finite)
    return (
        overlap
        * (mp.iv.mpf(4) / 3)
        * delta ** (-3)
        * mp.iv.power(2 * t, -3 * delta / 4)
    )


def _intervals(lambda_text: str, dps: int) -> dict[str, Any]:
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(lambda_text)
        if lam.a < 2:
            raise ValueError("spectral theorem requires lambda>=2")

        pi = mp.iv.pi
        a4 = mp.iv.sqrt(3) / mp.iv.power(2, mp.iv.mpf(11) / 4)
        C2 = (
            40
            * mp.iv.power(3, -mp.iv.mpf(1) / 4)
            * mp.iv.exp(-(1 + mp.iv.sqrt(3)) / 2)
            / mp.iv.power(1 - 1 / mp.iv.sqrt(3), 2)
        )
        C_phi3 = 222816 * mp.iv.sqrt(mp.iv.e)
        C_psi3 = 9 * C_phi3
        C_b = (2 * C2**2 + (C_psi3 + 4 * C2) ** 2) / 36
        D_S = (
            36864
            * pi**2
            * a4**2
            * lam**3
            * (
                32
                + 256 * pi * lam**3
                + 16384 * mp.iv.sqrt(2 * pi) * lam**4
            )
            + 8 * a4**2 * lam * C_b
        )
        C_D = (
            36864
            * pi**2
            * a4**2
            * (2 + 128 * pi + 16384 * mp.iv.sqrt(2 * pi))
            + a4**2 * C_b / 8
        )
        D_S_over_lambda7 = D_S / lam**7
        majorant_slack = C_D - D_S_over_lambda7

        Z_finite = _finite_overlap(pi)
        C_low = 128 * Z_finite
        ratio_limit_lambda = mp.iv.mpf(105) / (4096 * pi**4)

        result = {
            "lambda": lam,
            "a4": a4,
            "C2": C2,
            "C_b": C_b,
            "D_S": D_S,
            "C_D": C_D,
            "D_S_over_lambda7": D_S_over_lambda7,
            "majorant_slack": majorant_slack,
            "Z_finite": Z_finite,
            "C_low": C_low,
            "lambda8_d4_over_d8_limit": ratio_limit_lambda,
        }
        for index in DYADIC_INDICES:
            result[f"high_term_j{index}"] = _dyadic_term(index, pi, Z_finite)
        return result
    finally:
        mp.iv.dps = old


def produce(lambda_text: str, dps: int = 80) -> dict[str, object]:
    lambda_text = _require_lambda(lambda_text)
    dps = _require_int(dps, "interval precision", 50)
    validate_binding_locks()
    hashes = verify_component_hashes()
    intervals = _intervals(lambda_text, dps)
    # Equality holds at lambda=2 in every elementary comparison used for the
    # majorant, so outward subtraction may straddle zero there.  Reject only
    # an interval lying wholly below zero; the symbolic certificate is locked.
    if intervals["majorant_slack"].b < 0:
        raise ValueError("degree-seven majorant failed")

    return {
        "schema": SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "status": STATUS,
        "input": {
            "lambda_decimal": lambda_text,
            "interval_decimal_digits": dps,
            "dyadic_indices": list(DYADIC_INDICES),
        },
        "theorem": {
            "note": THEOREM_NOTE,
            "valid_lambda_minimum": "2",
            "translation_exponent_q": 1,
            "D_S_polynomial_degree": 7,
            "finite_branch_last_index": 33,
            "analytic_branch_first_index": 34,
            "low_block_coefficient": "128*Z_finite",
            "high_block_prefactor": "1280",
            "high_series_evaluated_by_truncation": False,
            "slepian_threshold_effective": False,
        },
        "locked_formulas": dict(LOCKED_FORMULAS),
        "source_hashes": hashes,
        "source_admissions": dict(SOURCE_ADMISSIONS),
        "intervals": {
            key: _serialize(value, dps) for key, value in intervals.items()
        },
        "series": {
            "definition": LOCKED_FORMULAS["high_series"],
            "all_terms_positive": True,
            "exact_infinite_series_used_in_theorem": True,
            "stored_terms_are_cross_checks_only": list(DYADIC_INDICES),
            "numeric_sum_claimed": False,
        },
        "claim_scope": {
            "proved": [
                "absolute source-locked outer--outer spectral bound",
                "qualitative outer--outer ratio to d8 tends to zero",
                "unnormalized locked-schedule Ritz energy is o(d8)",
            ],
            "not_proved": [
                "signed even-sector floor",
                "signed odd-sector floor",
                "shifted-resolvent decay on an unbounded schedule",
                "weighted equation (5.2) of DIRECT_RH_ATTACK.md",
                "locally uniform determinant convergence",
            ],
        },
        "arithmetic": {
            "library": "mpmath.iv",
            "shared_library_with_replay": True,
            "independence_limitation": (
                "producer and verifier use independent formula assemblies but "
                "share mpmath.iv interval arithmetic for the new fields"
            ),
        },
        "producer_pass_boolean_trusted_by_replay": False,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-decimal", required=True)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output")
    args = parser.parse_args()
    payload = produce(args.lambda_decimal, args.dps)
    text = json.dumps(payload, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(text, encoding="utf-8")
    else:
        print(text, end="")


if __name__ == "__main__":
    main()
