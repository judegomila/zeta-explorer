#!/usr/bin/env python3
"""Independent replay of the source-locked outer--outer spectral theorem.

This verifier never imports the producer.  It rechecks source bytes, invokes
the independent zero-source replay with q=1, validates the Slepian lock
directly, and reconstructs every serialized transcendental interval through
algebraically different formulas.  Producer booleans are never accepted as
evidence.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import mpmath as mp

from zero_sampling_source_replay import replay as replay_zero_source


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

EXPECTED_THEOREM = {
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
}

EXPECTED_SERIES = {
    "definition": LOCKED_FORMULAS["high_series"],
    "all_terms_positive": True,
    "exact_infinite_series_used_in_theorem": True,
    "stored_terms_are_cross_checks_only": list(DYADIC_INDICES),
    "numeric_sum_claimed": False,
}

EXPECTED_CLAIM_SCOPE = {
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
}

INTERVAL_KEYS = {
    "lambda",
    "a4",
    "C2",
    "C_b",
    "D_S",
    "C_D",
    "D_S_over_lambda7",
    "majorant_slack",
    "Z_finite",
    "C_low",
    "lambda8_d4_over_d8_limit",
    "high_term_j0",
    "high_term_j34",
    "high_term_j64",
}


class ReplayError(ValueError):
    """The theorem artifact or one of its source locks failed closed."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _reject_float(value: Any, path: str = "payload") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path} is forbidden")
    if isinstance(value, dict):
        for key, child in value.items():
            _reject_float(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _reject_float(child, f"{path}[{index}]")


def _capture(value: Any) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_
    lo_raw = tuple(lower)
    hi_raw = tuple(upper)
    bits = max(int(lo_raw[3]), int(hi_raw[3])) + 32
    with mp.workprec(bits):
        return mp.mpf(lo_raw), mp.mpf(hi_raw)


def _payload_interval(item: object) -> tuple[mp.mpf, mp.mpf]:
    if not isinstance(item, dict) or set(item) != {"decimal", "dyadic"}:
        raise ReplayError("invalid producer interval inventory")
    dyadic = item["dyadic"]
    if not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}:
        raise ReplayError("invalid producer dyadic interval")
    endpoints = []
    for side in ("lower", "upper"):
        raw = dyadic[side]
        if not isinstance(raw, list) or len(raw) != 4:
            raise ReplayError("invalid producer dyadic endpoint")
        if isinstance(raw[0], bool) or isinstance(raw[2], bool) or isinstance(raw[3], bool):
            raise ReplayError("boolean in dyadic endpoint")
        exact = (int(raw[0]), int(raw[1]), int(raw[2]), int(raw[3]))
        # Construct from the exact dyadic tuple at its declared bit count.
        # Using the ambient ``mp.mp.dps`` here silently rounded high-precision
        # artifact endpoints when the verifier was run as a standalone CLI.
        with mp.workprec(max(exact[3] + 32, 64)):
            endpoints.append(mp.mpf(exact))
    if endpoints[0] > endpoints[1]:
        raise ReplayError("producer interval endpoints reversed")
    return endpoints[0], endpoints[1]


def _validate_component_sources(root: Path, dps: int) -> None:
    for relative, expected in COMPONENT_HASHES.items():
        if _hash(root / relative) != expected:
            raise ReplayError(f"component source hash mismatch: {relative}")

    for index in DYADIC_INDICES:
        result = replay_zero_source(
            root / "ZERO_SAMPLING_SOURCE_LOCK.json", dps=dps, index=index, q=1
        )
        if result["zeros_assumed_real"] is not False:
            raise ReplayError("independent zero replay assumed real zeros")
        if result["zero_table_read"] is not False:
            raise ReplayError("independent zero replay read a zero table")

    prolate = json.loads(
        (root / "PROLATE_DEFECT_SOURCE_LOCK.json").read_text(encoding="utf-8")
    )
    _reject_float(prolate, "prolate_lock")
    if prolate.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("Slepian lock terminal-state promotion")
    formulas = prolate.get("locked_formulas")
    if not isinstance(formulas, dict) or formulas.get("ratio_limit") != (
        "c^4*d_4/d_8->105/256"
    ):
        raise ReplayError("Slepian ratio lock mutation")
    boundary = prolate.get("admission_boundary")
    if not isinstance(boundary, dict):
        raise ReplayError("Slepian admission boundary missing")
    if boundary.get("effective_threshold_c") is not None:
        raise ReplayError("Slepian qualitative limit promoted to an effective bound")
    if boundary.get("signed_weil_floor") is not False:
        raise ReplayError("Slepian lock promoted to a signed floor")
    source = prolate.get("binding_source")
    if not isinstance(source, dict):
        raise ReplayError("Slepian binding source missing")
    if source.get("vendored_path") != "vendor/SLEPIAN-PSWF-IV-1964.pdf":
        raise ReplayError("Slepian source path mutation")
    expected_pdf = "86efb6b69f405a046914f19c07161329b3f455a93a58467cc8107cfa4a135351"
    if source.get("vendored_sha256") != expected_pdf:
        raise ReplayError("Slepian declared source hash mutation")
    if _hash(root / source["vendored_path"]) != expected_pdf:
        raise ReplayError("Slepian source byte hash mismatch")


def _reconstruct(lambda_text: str, dps: int) -> dict[str, tuple[mp.mpf, mp.mpf]]:
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        x = mp.iv.mpf(lambda_text)
        if x.a < 2:
            raise ReplayError("lambda is below theorem range")
        pi = mp.iv.pi
        log2 = mp.iv.log(2)

        # Algebraically different from the producer's power expression.
        a4 = mp.iv.exp(mp.iv.log(3) / 2 - 11 * log2 / 4)
        sqrt3 = mp.iv.sqrt(3)
        C2 = (
            40
            * mp.iv.exp(-mp.iv.log(3) / 4 - (1 + sqrt3) / 2)
            * (sqrt3 / (sqrt3 - 1)) ** 2
        )

        half = mp.iv.mpf(1) / 2
        gamma5half = (
            24
            * mp.iv.exp(-half)
            * sum(half**j / mp.iv.mpf(math.factorial(j)) for j in range(5))
        )
        C_phi3 = 5632 * mp.iv.e * gamma5half
        C_psi3 = 9 * C_phi3
        C_xpsi3 = C_psi3 + 3 * C2
        C_b = C2**2 / 18 + (C_xpsi3 + C2) ** 2 / 36

        base = 36864 * pi**2 * a4**2
        D_S = (
            base * 32 * x**3
            + base * 256 * pi * x**6
            + base * 16384 * mp.iv.sqrt(2 * pi) * x**7
            + 8 * a4**2 * C_b * x
        )
        C_D = (
            2 * base
            + 128 * pi * base
            + 16384 * mp.iv.sqrt(2 * pi) * base
            + a4**2 * C_b / 8
        )
        quotient = D_S * mp.iv.exp(-7 * mp.iv.log(x))
        slack = C_D - quotient

        upper = mp.iv.mpf(61220092002)
        main = upper / (2 * pi) * (
            mp.iv.log(upper) - mp.iv.log(2 * pi) - 1
        )

        def error(value: Any) -> Any:
            log_value = mp.iv.log(value)
            return (
                mp.iv.mpf(103787) * log_value / 1000000
                + mp.iv.mpf(257297) * mp.iv.log(log_value) / 1000000
                + mp.iv.mpf(9367419) / 1000000
            )

        finite = 1 + main - mp.iv.mpf(1) / 8 + error(upper)

        result: dict[str, Any] = {
            "lambda": x,
            "a4": a4,
            "C2": C2,
            "C_b": C_b,
            "D_S": D_S,
            "C_D": C_D,
            "D_S_over_lambda7": quotient,
            "majorant_slack": slack,
            "Z_finite": finite,
            "C_low": 2**7 * finite,
            "lambda8_d4_over_d8_limit": mp.iv.mpf(105) * pi ** (-4) / 4096,
        }

        for index in DYADIC_INDICES:
            t_integer = 3 * 2**index
            t = mp.iv.mpf(t_integer)
            L = mp.iv.log(2 * t)
            delta = mp.iv.exp(
                -mp.iv.log(mp.iv.mpf("55.241"))
                - mp.iv.mpf(2) * mp.iv.log(L) / 3
                - mp.iv.log(mp.iv.log(L)) / 3
            )
            if t_integer < 30610046001:
                overlap = finite
            else:
                endpoint = mp.iv.mpf(2 * t_integer + 1)
                overlap = 1 + mp.iv.log(endpoint) / pi + 2 * error(endpoint)
            term = (
                overlap
                * mp.iv.mpf(4)
                / 3
                * mp.iv.exp(-3 * mp.iv.log(delta) - 3 * delta * L / 4)
            )
            result[f"high_term_j{index}"] = term

        return {key: _capture(value) for key, value in result.items()}
    finally:
        mp.iv.dps = old


def replay(payload: dict[str, object]) -> dict[str, object]:
    _reject_float(payload)
    required_top = {
        "schema",
        "terminal_state",
        "status",
        "input",
        "theorem",
        "locked_formulas",
        "source_hashes",
        "source_admissions",
        "intervals",
        "series",
        "claim_scope",
        "arithmetic",
        "producer_pass_boolean_trusted_by_replay",
    }
    if set(payload) != required_top:
        raise ReplayError("top-level artifact inventory mismatch")
    if payload.get("schema") != SCHEMA:
        raise ReplayError("schema mismatch")
    if payload.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("terminal-state promotion")
    if payload.get("status") != STATUS:
        raise ReplayError("component status promotion or mutation")
    if payload.get("producer_pass_boolean_trusted_by_replay") is not False:
        raise ReplayError("replay must not trust a producer pass boolean")

    inputs = payload.get("input")
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_decimal",
        "interval_decimal_digits",
        "dyadic_indices",
    }:
        raise ReplayError("input inventory mismatch")
    lambda_text = inputs["lambda_decimal"]
    dps = inputs["interval_decimal_digits"]
    if not isinstance(lambda_text, str):
        raise ReplayError("lambda must remain a decimal string")
    if isinstance(dps, bool) or not isinstance(dps, int) or dps < 50:
        raise ReplayError("precision must remain an exact integer >=50")
    if inputs["dyadic_indices"] != list(DYADIC_INDICES):
        raise ReplayError("dyadic cross-check inventory mismatch")

    if payload.get("theorem") != EXPECTED_THEOREM:
        raise ReplayError("theorem constants or scope mismatch")
    if payload.get("locked_formulas") != LOCKED_FORMULAS:
        raise ReplayError(
            "locked formula mismatch: zero reality, reflection, phase, or series"
        )
    if payload.get("source_admissions") != SOURCE_ADMISSIONS:
        raise ReplayError(
            "source admission mismatch: assumed-real zeros or HSW substitution"
        )
    if payload.get("series") != EXPECTED_SERIES:
        raise ReplayError("exact high-series definition or claim boundary mismatch")
    if payload.get("claim_scope") != EXPECTED_CLAIM_SCOPE:
        raise ReplayError("claim-scope or status promotion")
    if payload.get("source_hashes") != COMPONENT_HASHES:
        raise ReplayError("declared component source hashes mismatch")

    arithmetic = payload.get("arithmetic")
    if not isinstance(arithmetic, dict) or arithmetic != {
        "library": "mpmath.iv",
        "shared_library_with_replay": True,
        "independence_limitation": (
            "producer and verifier use independent formula assemblies but "
            "share mpmath.iv interval arithmetic for the new fields"
        ),
    }:
        raise ReplayError("shared-arithmetic limitation missing or mutated")

    root = _root()
    _validate_component_sources(root, dps)

    intervals = payload.get("intervals")
    if not isinstance(intervals, dict) or set(intervals) != INTERVAL_KEYS:
        raise ReplayError("interval inventory mismatch")
    reconstructed = _reconstruct(lambda_text, dps)
    comparisons: dict[str, object] = {}
    for key in sorted(INTERVAL_KEYS):
        producer_lo, producer_hi = _payload_interval(intervals[key])
        replay_lo, replay_hi = reconstructed[key]
        if max(producer_lo, replay_lo) > min(producer_hi, replay_hi):
            raise ReplayError(f"interval nonoverlap for {key}")
        if key in {"C_low", "Z_finite", "C_D"} and (
            producer_lo <= 0 or replay_lo <= 0
        ):
            raise ReplayError(f"required positive constant is nonpositive: {key}")
        if key == "majorant_slack" and producer_hi < 0:
            raise ReplayError("degree-seven majorant interval lies below zero")
        comparisons[key] = {
            "overlap": True,
            "producer_decimal": [
                mp.nstr(producer_lo, 25),
                mp.nstr(producer_hi, 25),
            ],
            "replay_decimal": [mp.nstr(replay_lo, 25), mp.nstr(replay_hi, 25)],
        }

    return {
        "schema": SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "status": "ANALYTIC_UNIFORM_OUTER_OUTER_SPECTRAL_REPLAY_PASS",
        "input": dict(inputs),
        "source_bytes_rechecked": True,
        "zero_source_independent_q1_replay": True,
        "transcendentals_reconstructed_from_source_parameters": True,
        "producer_booleans_trusted": False,
        "zero_list_read": False,
        "zeros_assumed_real_globally": False,
        "interval_comparisons": comparisons,
        "arithmetic": dict(arithmetic),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact")
    parser.add_argument("--output")
    args = parser.parse_args()
    payload = json.loads(Path(args.artifact).read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ReplayError("artifact must decode to an object")
    result = replay(payload)
    text = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(text, encoding="utf-8")
    else:
        print(text, end="")


if __name__ == "__main__":
    main()
