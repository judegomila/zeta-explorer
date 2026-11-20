#!/usr/bin/env python3
"""Independent replay of the compact projection--projection Weil bound.

No producer module is imported.  The replay hashes both primary inputs and
reconstructs the locked schedule, BV-relative terms, infinite-Cauchy
continuity constants, and final bound from the exact integer index ``j``.
Both paths use mpmath.iv; this shared-library limitation is explicit.
"""
from __future__ import annotations

import argparse
import gzip
import hashlib
import json
from pathlib import Path
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-compact-pp-weil-bound-v1"
TERMINAL_STATE = "P0_INVALIDATED"
SCHEDULE_K = 2400
LOCKED_SCHEDULE = "lambda_j=j+1/2; N_j=2^(2400*(2*j+1)^2)"
LOCKED_BASIS = "L^(-1/2)*exp(+2*pi*i*r*(t+log(lambda))/L)"
LOCKED_SIGN = "Q=W_0,2-W_R-W_p"
LOCKED_CAUCHY = "Q=diag(a)+D_b*H-H*D_b; H_rs=1/(r-s) off diagonal"
LOCKED_BOUND = (
    "abs(QW(P_n,P_m))/sqrt(d_n*d_m)"
    "<=rho_j^2*(log(3*N_j)+1+C_abs(lambda_j)+c(lambda_j))"
)

RELATIVE_LOCK = "DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json"
RELATIVE_LOCK_SHA256 = "66347adeb8c3e0d497760318370d00949d598a3ba42d5375c27dafc1651b3714"
EGIDI_GZIP = "vendor/EGIDI-SEELMANN-LS-2010.11901v2.tex.gz"
EGIDI_GZIP_SHA256 = "8cad2763fb84f09e44c7309ebecffa295e8b193ba9e506749451b305b50adf5c"
EGIDI_TEX_SHA256 = "b459dd2a485b061edb1dc94e5313830acf6e12b2af07098e3f8642993e676907"
CCM_PDF = "vendor/CCM-ZST-2511.22755v1.pdf"
CCM_SHA256 = "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b"
PINNED_DEPENDENCIES = {
    CCM_PDF: CCM_SHA256,
    "vendor/CCM-PROLATE-2310.18423v2.pdf": (
        "8bc197642ee9ca4f2393b6cbfd3db292be6a315ce76ad61bfb845d9fedb47f2e"
    ),
    "vendor/KRD-PSWF-2006.00427v2.pdf": (
        "7c56255db5bd6454e3fc926952052fe466ffd49c4961ad8206638dcac1dd39a0"
    ),
}

INTERVAL_KEYS = {
    "lambda",
    "L",
    "sigma",
    "diagonal_loss",
    "arch_tail",
    "C_abs",
    "b_bound",
    "cauchy_norm",
    "defect_decay",
    "schedule_decay",
    "exponent_margin",
    "bulk_relative",
    "jump_relative",
    "rho",
    "log_weight",
    "combined_multiplier",
    "relative_pp_upper",
    "source_combination_relative_upper",
}


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def _hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _validate_sources(payload: dict[str, object]) -> dict[str, str]:
    root = _repo_root()
    lock_path = root / RELATIVE_LOCK
    gzip_path = root / EGIDI_GZIP
    ccm_path = root / CCM_PDF
    if _hash(lock_path) != RELATIVE_LOCK_SHA256:
        raise ValueError("relative-projection source lock hash mismatch")
    lock = json.loads(lock_path.read_text())
    external = lock.get("external_source")
    if not isinstance(external, dict) or external.get("version") != "v2":
        raise ValueError("relative-projection source version mismatch")
    if external.get("gzip_sha256") != EGIDI_GZIP_SHA256:
        raise ValueError("source-lock gzip hash mismatch")
    if external.get("uncompressed_tex_sha256") != EGIDI_TEX_SHA256:
        raise ValueError("source-lock TeX hash mismatch")
    gzip_bytes = gzip_path.read_bytes()
    if hashlib.sha256(gzip_bytes).hexdigest() != EGIDI_GZIP_SHA256:
        raise ValueError("vendored Egidi--Seelmann gzip hash mismatch")
    tex_hash = hashlib.sha256(gzip.decompress(gzip_bytes)).hexdigest()
    if tex_hash != EGIDI_TEX_SHA256:
        raise ValueError("vendored Egidi--Seelmann TeX hash mismatch")
    if _hash(ccm_path) != CCM_SHA256:
        raise ValueError("vendored CCM PDF hash mismatch")
    for relative_path, expected_hash in PINNED_DEPENDENCIES.items():
        if _hash(root / relative_path) != expected_hash:
            raise ValueError(f"pinned dependency hash mismatch: {relative_path}")

    pins = payload.get("source_pins")
    if not isinstance(pins, dict):
        raise ValueError("producer source pins missing")
    relative = pins.get("relative_projection")
    expected_relative = {
        "source_lock": RELATIVE_LOCK,
        "source_lock_sha256": RELATIVE_LOCK_SHA256,
        "vendored_source": EGIDI_GZIP,
        "gzip_sha256": EGIDI_GZIP_SHA256,
        "uncompressed_tex_sha256": EGIDI_TEX_SHA256,
        "pinned_dependency_sha256": PINNED_DEPENDENCIES,
    }
    if relative != expected_relative:
        raise ValueError("producer relative-projection source pins mismatch")
    if pins.get("ccm_pdf") != CCM_PDF or pins.get("ccm_pdf_sha256") != CCM_SHA256:
        raise ValueError("producer CCM source pin mismatch")
    return {
        "relative_lock_sha256": RELATIVE_LOCK_SHA256,
        "egidi_gzip_sha256": EGIDI_GZIP_SHA256,
        "egidi_tex_sha256": EGIDI_TEX_SHA256,
        "ccm_pdf_sha256": CCM_SHA256,
    }


def _capture(value: Any) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_
    return mp.mpf(tuple(lower)), mp.mpf(tuple(upper))


def _reconstruct(j: int, dps: int) -> dict[str, tuple[mp.mpf, mp.mpf]]:
    old_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(2 * j + 1) / 2
        log_two = mp.iv.log(2)
        log_lam = mp.iv.log(lam)
        L = 2 * log_lam
        exp_L = mp.iv.exp(L)
        coth_half = (exp_L + 1) / (exp_L - 1)
        sigma = mp.iv.log(log_lam * coth_half)

        # Algebraically distinct L/hyperbolic assembly of the high-mode
        # constants; it does not read producer values.
        pole_diag = 8 * (lam + 1 / lam - 2) / L
        arch_diag = lam + 2 * sigma
        prime_diag = 4 * L * (lam - 1)
        diagonal_loss = pole_diag + arch_diag + prime_diag
        arch_tail = mp.iv.log(coth_half)
        C_abs = diagonal_loss + arch_tail + 1 / (2 * mp.iv.pi)
        pole_b = 2 * (lam - 1 / lam) / mp.iv.pi
        arch_b = (
            mp.iv.mpf(1) / 4
            + 1 / (2 * mp.iv.pi**2)
            + (lam - 1 + sigma) / (2 * mp.iv.pi)
        )
        prime_b = 2 * L * (lam - 1) / mp.iv.pi
        b_bound = pole_b + arch_b + prime_b
        cauchy_norm = 2 * mp.iv.pi * b_bound

        defect_decay = 160 * mp.iv.pi * mp.iv.log(96) / log_two
        schedule_decay = 4800 * log_two
        margin = schedule_decay - defect_decay
        common = mp.iv.sqrt(2 * log_lam) / (mp.iv.pi * mp.iv.sqrt(2))
        bulk = (
            common
            * 4
            * lam
            * (2 * mp.iv.pi * lam**2 + mp.iv.mpf(1) / 2)
            * mp.iv.exp(mp.iv.mpf(5) / 2 * mp.iv.log(96))
            / mp.iv.sqrt(6)
            * mp.iv.exp(-margin * lam**2)
        )
        jump = (
            common
            * 32
            * mp.iv.pi
            * lam**2
            * mp.iv.exp(-schedule_decay * lam**2)
        )
        rho = bulk + jump
        exponent = SCHEDULE_K * (2 * j + 1) ** 2
        log_weight = 1 + mp.iv.log(3) + exponent * log_two
        multiplier = log_weight + C_abs + cauchy_norm
        pp = rho * rho * multiplier
        source = (
            (mp.iv.mpf(3) / mp.iv.exp(mp.iv.mpf(11) / 2 * log_two))
            * (1 + 2 * mp.iv.sqrt(2) * lam) ** 2
            * pp
        )
        values = {
            "lambda": lam,
            "L": L,
            "sigma": sigma,
            "diagonal_loss": diagonal_loss,
            "arch_tail": arch_tail,
            "C_abs": C_abs,
            "b_bound": b_bound,
            "cauchy_norm": cauchy_norm,
            "defect_decay": defect_decay,
            "schedule_decay": schedule_decay,
            "exponent_margin": margin,
            "bulk_relative": bulk,
            "jump_relative": jump,
            "rho": rho,
            "log_weight": log_weight,
            "combined_multiplier": multiplier,
            "relative_pp_upper": pp,
            "source_combination_relative_upper": source,
        }
        return {key: _capture(value) for key, value in values.items()}
    finally:
        mp.iv.dps = old_dps


def _decode_raw(raw: object) -> mp.mpf:
    if not isinstance(raw, list) or len(raw) != 4:
        raise ValueError("invalid dyadic endpoint")
    sign, mantissa, exponent, bitcount = raw
    if (
        isinstance(sign, bool)
        or not isinstance(sign, int)
        or not isinstance(mantissa, str)
        or isinstance(exponent, bool)
        or not isinstance(exponent, int)
        or isinstance(bitcount, bool)
        or not isinstance(bitcount, int)
    ):
        raise ValueError("dyadic endpoint types differ from the contract")
    return mp.mpf((sign, int(mantissa), exponent, bitcount))


def _decode_interval(serialized: object, dps: int) -> tuple[mp.mpf, mp.mpf]:
    if not isinstance(serialized, dict) or set(serialized) != {"decimal", "dyadic"}:
        raise ValueError("interval schema mismatch")
    dyadic = serialized["dyadic"]
    decimal = serialized["decimal"]
    if not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}:
        raise ValueError("dyadic interval schema mismatch")
    if not isinstance(decimal, list) or len(decimal) != 2 or not all(
        isinstance(item, str) for item in decimal
    ):
        raise ValueError("decimal interval schema mismatch")
    lower = _decode_raw(dyadic["lower"])
    upper = _decode_raw(dyadic["upper"])
    if lower > upper:
        raise ValueError("reversed interval endpoints")
    with mp.workdps(dps + 20):
        if decimal != [mp.nstr(lower, dps), mp.nstr(upper, dps)]:
            raise ValueError("decimal display does not match raw dyadic endpoints")
    return lower, upper


def replay(payload: dict[str, object]) -> dict[str, object]:
    if payload.get("schema") != SCHEMA:
        raise ValueError("artifact schema mismatch")
    if payload.get("terminal_state") != TERMINAL_STATE:
        raise ValueError("terminal state mismatch")
    if payload.get("claim_class") != "ANALYTIC_UNIFORM_COMPACT_PROJECTION_PP_ONLY":
        raise ValueError("claim class mismatch")
    expected_scope = {
        "proved": (
            "pure compact projection-projection complete signed Weil-form "
            "term is o(sqrt(d_n*d_m)) for fixed n,m in {0,4}"
        ),
        "not_proved": [
            "either outer-projection orientation",
            "physical outer-outer correlation",
            "a signed sector floor",
            "equation (5.2)",
            "locally uniform determinant convergence",
        ],
    }
    if payload.get("claim_scope") != expected_scope:
        raise ValueError("claim scope mismatch")
    expected_arithmetic = {
        "library": f"mpmath.iv {mp.__version__}",
        "raw_outward_dyadic_endpoints_serialized": True,
        "shared_library_with_replay": True,
    }
    if payload.get("arithmetic") != expected_arithmetic:
        raise ValueError("arithmetic metadata mismatch")
    if payload.get("producer_pass_boolean_trusted_by_replay") is not False:
        raise ValueError("replay must not trust a producer pass boolean")

    formulas = payload.get("locked_formulas")
    expected_formulas = {
        "schedule": LOCKED_SCHEDULE,
        "labels": [0, 4],
        "basis": LOCKED_BASIS,
        "weil_sign": LOCKED_SIGN,
        "cauchy_form": LOCKED_CAUCHY,
        "combined_bound": LOCKED_BOUND,
        "infinite_form_closure": (
            "symmetric finite Fourier truncations converge on the "
            "log-weighted form domain"
        ),
    }
    if formulas != expected_formulas:
        raise ValueError("locked formula or sign mismatch")

    inputs = payload.get("input")
    if not isinstance(inputs, dict):
        raise ValueError("input block missing")
    expected_input_keys = {
        "j",
        "lambda_exact",
        "schedule_K",
        "schedule_exponent",
        "interval_decimal_digits",
    }
    if set(inputs) != expected_input_keys:
        raise ValueError("input inventory mismatch")
    j = inputs.get("j")
    dps = inputs.get("interval_decimal_digits")
    if (
        isinstance(j, bool)
        or not isinstance(j, int)
        or isinstance(dps, bool)
        or not isinstance(dps, int)
    ):
        raise ValueError("j and precision must be exact integers")
    if j < 2 or dps < 50:
        raise ValueError("input outside locked theorem range")
    # Raw libmp dyadics must be reconstructed above the serialized display
    # precision; otherwise the default mp context would round them first.
    mp.mp.dps = max(mp.mp.dps, dps + 30)
    if inputs.get("lambda_exact") != {"numerator": 2 * j + 1, "denominator": 2}:
        raise ValueError("lambda is not the locked half-integer")
    if inputs.get("schedule_K") != SCHEDULE_K:
        raise ValueError("schedule multiplier mismatch")
    if inputs.get("schedule_exponent") != SCHEDULE_K * (2 * j + 1) ** 2:
        raise ValueError("schedule exponent mismatch")

    source_hashes = _validate_sources(payload)
    independent = _reconstruct(j, dps)
    serialized = payload.get("intervals")
    if not isinstance(serialized, dict) or set(serialized) != INTERVAL_KEYS:
        raise ValueError("interval inventory mismatch")

    tolerance = mp.power(10, -max(20, dps // 2))
    comparisons: dict[str, dict[str, str | bool]] = {}
    for key, (ind_lower, ind_upper) in independent.items():
        supplied_lower, supplied_upper = _decode_interval(serialized[key], dps)
        overlap = supplied_lower <= ind_upper and ind_lower <= supplied_upper
        scale = max(abs(ind_lower), abs(ind_upper), mp.mpf("1e-100"))
        endpoint_error = max(
            abs(supplied_lower - ind_lower),
            abs(supplied_upper - ind_upper),
        )
        if not overlap or endpoint_error > tolerance * scale:
            raise ValueError(f"independent interval mismatch for {key}")
        comparisons[key] = {
            "overlap": overlap,
            "maximum_endpoint_difference": mp.nstr(endpoint_error, dps),
        }

    if independent["exponent_margin"][0] <= 0:
        raise ValueError("independently reconstructed margin is nonpositive")
    if independent["relative_pp_upper"][0] < 0:
        raise ValueError("independently reconstructed P-P bound is negative")

    return {
        "schema": "xi-prolate-compact-pp-weil-replay-v1",
        "status": "ANALYTIC_UNIFORM_COMPONENT_REPLAY_PASS",
        "source_hashes_reconstructed": source_hashes,
        "producer_booleans_trusted": False,
        "intervals_reconstructed_from_j": True,
        "interval_comparisons": comparisons,
        "shared_arithmetic_library_limitation": f"mpmath.iv {mp.__version__}",
        "claim_scope": (
            "compact projection-projection term only; no outer correlation, "
            "sector floor, equation (5.2), or determinant limit"
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = replay(json.loads(args.input.read_text()))
    text = json.dumps(result, indent=2) + "\n"
    if args.output is not None:
        args.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
