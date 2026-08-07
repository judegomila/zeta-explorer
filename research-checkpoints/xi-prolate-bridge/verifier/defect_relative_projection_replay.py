#!/usr/bin/env python3
"""Independent replay of the defect-relative Fourier projection artifact.

This file intentionally does not import the producer.  It reconstructs every
formula from the exact schedule index, re-hashes the pinned source bytes, and
compares exact dyadic interval endpoints.  It shares ``mpmath.iv`` with the
producer, and reports that arithmetic-library limitation explicitly.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import gzip
import hashlib
import json
from pathlib import Path
from typing import Any

import mpmath as mp


EXPECTED_SCHEMA = "xi-prolate-defect-relative-projection-artifact-v1"
EXPECTED_CLAIM = "DEFECT_RELATIVE_FOURIER_PROJECTION_ONLY"
EXPECTED_STATE = "P0_INVALIDATED"
EXPECTED_K = 2400
EXPECTED_FORMULAS = {
    "Fourier": "F_plus(f)(xi)=integral_R f(x)*exp(+2*pi*i*x*xi) dx",
    "source_interval": "[-lambda,lambda] with Lebesgue dx and zero extension",
    "c_map": "c=2*pi*lambda^2",
    "concentration": "Lambda_n(c)=chi_n(lambda)^2; d_n=1-chi_n(lambda)^2",
    "log_interval": "[-log(lambda),log(lambda)]; L=2*log(lambda)",
    "evenization": "K_n(t)=(E(h_n)(exp(t))+E(h_n)(exp(-t)))/2",
    "source_combination": (
        "a4=sqrt(3)/2^(11/4); a0_lambda=a4*integral(h4)/integral(h0)"
    ),
    "basis": "L^(-1/2)*exp(+2*pi*i*m*(t+log(lambda))/L)",
    "LS_thickness": "omega=R\\[-lambda,lambda]; gamma=1/2; rho=4*lambda",
    "LS_covering": "kappa=1; l_1=4*lambda; eta=1; tau_1=2",
    "LS_energy": "E=(2*pi*lambda)^2",
    "LS_base": "96",
    "LS_exponent": "5+(320*pi/log(2))*lambda^2",
    "defect_lower": "6*96^(-5-(320*pi/log(2))*lambda^2)",
    "TV_bound": "4*lambda*(2*pi*lambda^2+1/2)+32*pi*lambda^2*sqrt(d_n)",
    "periodic_BV_tail": "sqrt(2*log(lambda))*TV/(pi*sqrt(2*N))",
    "log_weighted_BV_tail": (
        "sum_(abs(m)>N)log(2+abs(m))*abs(c_m)^2"
        "<=(L*TV^2/(2*pi^2*N))*(log(3*N)+1)"
    ),
    "schedule": "lambda_j=j+1/2; N_j=2^(2400*(2*j+1)^2)",
}
EXPECTED_GZIP = "vendor/EGIDI-SEELMANN-LS-2010.11901v2.tex.gz"
EXPECTED_LOCK_SHA = (
    "66347adeb8c3e0d497760318370d00949d598a3ba42d5375c27dafc1651b3714"
)
EXPECTED_GZIP_SHA = (
    "8cad2763fb84f09e44c7309ebecffa295e8b193ba9e506749451b305b50adf5c"
)
EXPECTED_TEX_SHA = (
    "b459dd2a485b061edb1dc94e5313830acf6e12b2af07098e3f8642993e676907"
)
EXPECTED_DEPENDENCY_HASHES = {
    "vendor/CCM-ZST-2511.22755v1.pdf": (
        "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b"
    ),
    "vendor/CCM-PROLATE-2310.18423v2.pdf": (
        "8bc197642ee9ca4f2393b6cbfd3db292be6a315ce76ad61bfb845d9fedb47f2e"
    ),
    "vendor/KRD-PSWF-2006.00427v2.pdf": (
        "7c56255db5bd6454e3fc926952052fe466ffd49c4961ad8206638dcac1dd39a0"
    ),
}

INTERVAL_KEYS = (
    "angular_frequency_energy",
    "LS_theorem_exponent",
    "defect_lower_bound",
    "sqrt_defect_lower_bound",
    "sqrt_defect_decay_A",
    "inverse_sqrt_N_decay",
    "positive_exponent_margin",
    "bulk_projection_over_sqrt_defect",
    "endpoint_jump_projection_over_sqrt_defect",
    "total_projection_over_sqrt_defect",
    "sqrt_log_3N_plus_1_weight_factor",
    "log_weighted_projection_over_sqrt_defect",
    "lambda2_uniform_relative_guard",
    "lambda2_uniform_log_weighted_guard",
    "bulk_log_derivative_guard_at_lambda2",
    "jump_log_derivative_guard_at_lambda2",
)


def _require_int(value: object, label: str) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer, never binary64")
    return value


def _require_string(value: object, label: str) -> str:
    if not isinstance(value, str):
        raise TypeError(f"{label} must be exact text, never binary64")
    return value


def _parse_endpoint(value: object, label: str) -> tuple[int, int, int, int]:
    if not isinstance(value, list) or len(value) != 4:
        raise TypeError(f"{label} must be a four-field dyadic endpoint")
    sign = _require_int(value[0], f"{label} sign")
    mantissa_text = _require_string(value[1], f"{label} mantissa")
    exponent = _require_int(value[2], f"{label} exponent")
    bitcount = _require_int(value[3], f"{label} bitcount")
    if sign not in (0, 1):
        raise ValueError(f"{label} sign is invalid")
    if not mantissa_text.isdigit():
        raise ValueError(f"{label} mantissa is not an unsigned exact integer")
    mantissa = int(mantissa_text)
    if mantissa == 0:
        if bitcount != 0:
            raise ValueError(f"{label} zero endpoint has nonzero bitcount")
    elif bitcount != mantissa.bit_length():
        raise ValueError(f"{label} bitcount does not match its mantissa")
    return sign, mantissa, exponent, bitcount


def _parse_interval(
    value: object, label: str, display_digits: int
) -> tuple[mp.mpf, mp.mpf]:
    if not isinstance(value, dict):
        raise TypeError(f"{label} must be an interval object")
    decimal = value.get("decimal")
    if (
        not isinstance(decimal, list)
        or len(decimal) != 2
        or not all(isinstance(item, str) for item in decimal)
    ):
        raise TypeError(f"{label} decimal endpoints must be text, never binary64")
    dyadic = value.get("dyadic")
    if not isinstance(dyadic, dict):
        raise TypeError(f"{label} lacks exact dyadic endpoints")
    lower_raw = _parse_endpoint(dyadic.get("lower"), f"{label} lower")
    upper_raw = _parse_endpoint(dyadic.get("upper"), f"{label} upper")
    with mp.workdps(display_digits + 20):
        lower = mp.mpf(lower_raw)
        upper = mp.mpf(upper_raw)
        if lower > upper:
            raise ValueError(f"{label} endpoints are reversed")
        expected_display = [
            mp.nstr(lower, display_digits),
            mp.nstr(upper, display_digits),
        ]
    if decimal != expected_display:
        raise ValueError(f"{label} decimal display does not match dyadic endpoints")
    return lower, upper


def _capture(value: Any) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_
    return mp.mpf(lower), mp.mpf(upper)


def _relative_terms(lam: Any) -> tuple[Any, Any, Any, Any, Any]:
    log2 = mp.iv.log(2)
    A = 160 * mp.iv.pi * mp.iv.log(96) / log2
    decay = 4800 * log2
    margin = decay - A
    L = 2 * mp.iv.log(lam)
    c = 2 * mp.iv.pi * lam * lam
    prefactor = mp.iv.sqrt(L) / (mp.iv.pi * mp.iv.sqrt(2))
    bulk = (
        prefactor
        * 4
        * lam
        * (c + mp.iv.mpf(1) / 2)
        * mp.iv.power(96, mp.iv.mpf(5) / 2)
        / mp.iv.sqrt(6)
        * mp.iv.exp(-margin * lam * lam)
    )
    jump = (
        prefactor
        * 32
        * mp.iv.pi
        * lam
        * lam
        * mp.iv.exp(-decay * lam * lam)
    )
    return bulk, jump, bulk + jump, A, decay


def _reconstruct(j: int, dps: int) -> dict[str, tuple[mp.mpf, mp.mpf]]:
    old_iv_dps = mp.iv.dps
    old_mp_dps = mp.mp.dps
    try:
        mp.iv.dps = dps
        mp.mp.dps = dps + 30
        lam = mp.iv.mpf(2 * j + 1) / 2
        log2 = mp.iv.log(2)
        energy = (2 * mp.iv.pi * lam) ** 2
        ls_exponent = 5 + 320 * mp.iv.pi * lam * lam / log2
        defect = 6 * mp.iv.exp(-ls_exponent * mp.iv.log(96))
        sqrt_defect = mp.iv.sqrt(defect)
        bulk, jump, total, A, decay = _relative_terms(lam)
        margin = decay - A
        exponent = EXPECTED_K * (2 * j + 1) ** 2
        log_weight_factor = mp.iv.sqrt(1 + mp.iv.log(3) + exponent * log2)
        log_weighted_total = total * log_weight_factor
        guard_bulk, guard_jump, guard_total, _, _ = _relative_terms(mp.iv.mpf(2))
        del guard_bulk, guard_jump
        guard_exponent = 4 * EXPECTED_K * mp.iv.mpf(2) ** 2
        guard_log_weight_factor = mp.iv.sqrt(
            1 + mp.iv.log(3) + guard_exponent * log2
        )
        guard_log_weighted_total = guard_total * guard_log_weight_factor
        bulk_derivative = mp.iv.mpf(3) / 2 + 1 / (4 * log2) - 4 * margin
        jump_derivative = 1 + 1 / (4 * log2) - 4 * decay
        return {
            "angular_frequency_energy": _capture(energy),
            "LS_theorem_exponent": _capture(ls_exponent),
            "defect_lower_bound": _capture(defect),
            "sqrt_defect_lower_bound": _capture(sqrt_defect),
            "sqrt_defect_decay_A": _capture(A),
            "inverse_sqrt_N_decay": _capture(decay),
            "positive_exponent_margin": _capture(margin),
            "bulk_projection_over_sqrt_defect": _capture(bulk),
            "endpoint_jump_projection_over_sqrt_defect": _capture(jump),
            "total_projection_over_sqrt_defect": _capture(total),
            "sqrt_log_3N_plus_1_weight_factor": _capture(log_weight_factor),
            "log_weighted_projection_over_sqrt_defect": _capture(
                log_weighted_total
            ),
            "lambda2_uniform_relative_guard": _capture(guard_total),
            "lambda2_uniform_log_weighted_guard": _capture(
                guard_log_weighted_total
            ),
            "bulk_log_derivative_guard_at_lambda2": _capture(bulk_derivative),
            "jump_log_derivative_guard_at_lambda2": _capture(jump_derivative),
        }
    finally:
        mp.iv.dps = old_iv_dps
        mp.mp.dps = old_mp_dps


def _hash_source(root: Path, supplied: object) -> dict[str, str]:
    if not isinstance(supplied, dict):
        raise TypeError("source pin must be an object")
    expected_fields = {
        "source_lock": "DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json",
        "source_lock_sha256": EXPECTED_LOCK_SHA,
        "vendored_source": EXPECTED_GZIP,
        "gzip_sha256": EXPECTED_GZIP_SHA,
        "uncompressed_tex_sha256": EXPECTED_TEX_SHA,
        "pinned_dependency_sha256": EXPECTED_DEPENDENCY_HASHES,
    }
    for key, expected in expected_fields.items():
        if supplied.get(key) != expected:
            raise ValueError(f"producer source pin field {key} is not locked")
    source = (root / EXPECTED_GZIP).read_bytes()
    gzip_hash = hashlib.sha256(source).hexdigest()
    tex_hash = hashlib.sha256(gzip.decompress(source)).hexdigest()
    if gzip_hash != EXPECTED_GZIP_SHA or tex_hash != EXPECTED_TEX_SHA:
        raise ValueError("independent source-byte hash replay failed")
    for relative_path, expected_hash in EXPECTED_DEPENDENCY_HASHES.items():
        actual_hash = hashlib.sha256((root / relative_path).read_bytes()).hexdigest()
        if actual_hash != expected_hash:
            raise ValueError(f"independent dependency hash failed: {relative_path}")
    lock_bytes = (root / "DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json").read_bytes()
    if hashlib.sha256(lock_bytes).hexdigest() != EXPECTED_LOCK_SHA:
        raise ValueError("independent source-lock byte hash replay failed")
    lock = json.loads(lock_bytes.decode("utf-8"))
    external = lock.get("external_source", {})
    if (
        external.get("version") != "v2"
        or external.get("gzip_sha256") != gzip_hash
        or external.get("uncompressed_tex_sha256") != tex_hash
    ):
        raise ValueError("source-lock JSON does not match the replayed source bytes")
    if set(lock) != {
        "schema",
        "claim_class",
        "terminal_state",
        "external_source",
        "existing_pinned_dependencies",
        "locked_project_conventions",
        "locked_logvinenko_sereda_insertion",
        "locked_bv_projection_bound",
        "locked_diagonal_schedule",
        "claim_boundary",
    }:
        raise ValueError("source-lock inventory differs from the replay contract")
    if lock.get("locked_project_conventions", {}).get("prolate_parameter") != (
        "c=2*pi*lambda^2"
    ):
        raise ValueError("source-lock c map differs from the replay contract")
    ls = lock.get("locked_logvinenko_sereda_insertion", {})
    if (
        ls.get("thickness") != "gamma=1/2; rho=4*lambda"
        or ls.get("angular_frequency_energy") != "E=(2*pi*lambda)^2"
        or ls.get("theorem_base")
        != "24*d*tau_d*l_1/(gamma*eta*rho)=96"
        or ls.get("theorem_exponent") != "5+320*pi*lambda^2/log(2)"
    ):
        raise ValueError("source-lock LS formulas differ from the replay contract")
    diagonal = lock.get("locked_diagonal_schedule", {})
    if (
        diagonal.get("K") != 2400
        or diagonal.get("unsafe_integer_K_ceiling") != 2387
        or diagonal.get("first_positive_margin_integer_K") != 2388
    ):
        raise ValueError("source-lock schedule fields differ from the replay contract")
    boundary = lock.get("claim_boundary", {})
    if boundary.get("not_proved") != [
        "O-P or P-P signed-distribution correlation bounds",
        "high Fourier block coercivity",
        "a shifted even or odd sector floor",
        "residual-gap scaling for the full Weil form",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ]:
        raise ValueError("source-lock claim boundary differs from replay contract")
    return {"gzip_sha256": gzip_hash, "uncompressed_tex_sha256": tex_hash}


def _intervals_overlap(
    first: tuple[mp.mpf, mp.mpf], second: tuple[mp.mpf, mp.mpf]
) -> bool:
    return max(first[0], second[0]) <= min(first[1], second[1])


def replay_artifact(path: Path, dps: int | None = None) -> dict[str, object]:
    """Replay an artifact without importing or trusting producer booleans."""
    path = Path(path)
    payload = json.loads(path.read_text(encoding="utf-8"))
    if payload.get("schema") != EXPECTED_SCHEMA:
        raise ValueError("artifact schema differs from replay contract")
    if payload.get("claim_class") != EXPECTED_CLAIM:
        raise ValueError("artifact claim class differs from replay contract")
    if payload.get("terminal_state") != EXPECTED_STATE:
        raise ValueError("artifact terminal state differs from replay contract")

    claims = payload.get("claims")
    if not isinstance(claims, dict):
        raise TypeError("artifact claims must be an object")
    expected_claims = {
        "defect_relative_L2_projection_for_modes_0_and_4": True,
        "defect_relative_log_weighted_projection_for_modes_0_and_4": True,
        "signed_O_P_or_P_P_form_control": False,
        "high_block_coercivity": False,
        "shifted_sector_floor": False,
        "full_residual_gap_scaling": False,
        "locally_uniform_determinant_convergence": False,
        "riemann_hypothesis_proof": False,
    }
    if claims != expected_claims:
        raise ValueError("artifact overclaims or changes the locked claim boundary")

    inputs = payload.get("inputs")
    if not isinstance(inputs, dict):
        raise TypeError("artifact inputs must be an object")
    j = _require_int(inputs.get("j"), "schedule index j")
    if j < 2:
        raise ValueError("replay requires j>=2")
    producer_dps = _require_int(
        inputs.get("interval_decimal_digits"), "producer interval precision"
    )
    if producer_dps < 50:
        raise ValueError("producer interval precision is too small")
    used_dps = producer_dps + 20 if dps is None else _require_int(dps, "replay dps")
    if used_dps < producer_dps:
        raise ValueError("replay precision must not be below producer precision")
    if inputs.get("binary64_parameter_path") is not False:
        raise ValueError("binary64 parameter path is forbidden")
    expected_library = f"mpmath.iv {mp.__version__}"
    if inputs.get("producer_arithmetic_library") != expected_library:
        raise ValueError("producer arithmetic-library metadata differs from replay")

    lam = Fraction(2 * j + 1, 2)
    expected_decimal = f"{j}.5"
    if _require_string(inputs.get("lambda_decimal"), "lambda decimal") != expected_decimal:
        raise ValueError("lambda decimal was not reconstructed from j")
    if (
        _require_string(inputs.get("lambda_exact_fraction"), "lambda fraction")
        != str(lam)
    ):
        raise ValueError("lambda exact fraction was not reconstructed from j")

    formulas = payload.get("locked_formulas")
    if formulas != EXPECTED_FORMULAS:
        raise ValueError("one or more locked formulas were changed")

    schedule = payload.get("exact_schedule")
    if not isinstance(schedule, dict):
        raise TypeError("exact schedule must be an object")
    exponent = EXPECTED_K * (2 * j + 1) ** 2
    if _require_int(schedule.get("K"), "schedule K") != EXPECTED_K:
        raise ValueError("schedule K differs from 2400")
    if _require_int(schedule.get("power_of_two_exponent"), "N exponent") != exponent:
        raise ValueError("power-of-two exponent was not reconstructed from j")
    if schedule.get("N") != f"2^{exponent}" or schedule.get("N_is_materialized") is not False:
        raise ValueError("exact power-of-two schedule representation changed")

    root = Path(__file__).resolve().parents[1]
    source_hashes = _hash_source(root, payload.get("source_pin"))
    expected = _reconstruct(j, used_dps)
    supplied_block = payload.get("outward_intervals")
    if not isinstance(supplied_block, dict) or set(supplied_block) != set(INTERVAL_KEYS):
        raise ValueError("artifact interval inventory differs from replay contract")

    overlap: dict[str, bool] = {}
    supplied_intervals: dict[str, tuple[mp.mpf, mp.mpf]] = {}
    for key in INTERVAL_KEYS:
        supplied_interval = _parse_interval(
            supplied_block[key], key, producer_dps + 10
        )
        supplied_intervals[key] = supplied_interval
        overlap[key] = _intervals_overlap(supplied_interval, expected[key])

    with mp.workdps(used_dps + 20):
        margin_positive = expected["positive_exponent_margin"][0] > 0
        relative_below_one = expected["total_projection_over_sqrt_defect"][1] < 1
        uniform_guard_below_one = expected["lambda2_uniform_relative_guard"][1] < 1
        log_weighted_below_one = (
            expected["log_weighted_projection_over_sqrt_defect"][1] < 1
        )
        uniform_log_weighted_below_one = (
            expected["lambda2_uniform_log_weighted_guard"][1] < 1
        )
        bulk_decreasing = expected["bulk_log_derivative_guard_at_lambda2"][1] < 0
        jump_decreasing = expected["jump_log_derivative_guard_at_lambda2"][1] < 0

    passed = bool(
        all(overlap.values())
        and margin_positive
        and relative_below_one
        and uniform_guard_below_one
        and log_weighted_below_one
        and uniform_log_weighted_below_one
        and bulk_decreasing
        and jump_decreasing
    )
    return {
        "schema": "xi-prolate-defect-relative-projection-replay-v1",
        "claim_class": EXPECTED_CLAIM,
        "terminal_state": EXPECTED_STATE,
        "replay_agrees": passed,
        "reconstructed_inputs": {
            "j": j,
            "lambda_exact_fraction": str(lam),
            "K": EXPECTED_K,
            "power_of_two_exponent": exponent,
            "replay_interval_decimal_digits": used_dps,
        },
        "source_hashes": source_hashes,
        "interval_overlap": overlap,
        "independent_checks": {
            "positive_exponent_margin": margin_positive,
            "relative_bound_below_one": relative_below_one,
            "lambda2_uniform_guard_below_one": uniform_guard_below_one,
            "log_weighted_relative_bound_below_one": log_weighted_below_one,
            "lambda2_uniform_log_weighted_guard_below_one": (
                uniform_log_weighted_below_one
            ),
            "bulk_expression_decreasing_for_lambda_at_least_2": bulk_decreasing,
            "jump_expression_decreasing_for_lambda_at_least_2": jump_decreasing,
        },
        "arithmetic_library_limitation": (
            "Producer and verifier are independent code paths but both use "
            f"mpmath.iv {mp.__version__}."
        ),
        "scope": (
            "ordinary and log-weighted Fourier projection tails only; no signed O-P/P-P form, "
            "sector-floor, full residual-gap, or determinant claim"
        ),
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Replay a defect-relative projection artifact"
    )
    parser.add_argument("artifact", type=Path)
    parser.add_argument("--dps", type=int)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    report = replay_artifact(args.artifact, args.dps)
    rendered = json.dumps(report, indent=2, sort_keys=True) + "\n"
    if args.output is None:
        print(rendered, end="")
    else:
        args.output.write_text(rendered, encoding="utf-8")
    return 0 if report["replay_agrees"] is True else 1


if __name__ == "__main__":
    raise SystemExit(main())


__all__ = ["replay_artifact"]
