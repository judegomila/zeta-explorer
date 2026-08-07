#!/usr/bin/env python3
"""Independent replay of the source-core outer--projection bound.

No producer module or cached matrix is imported.  The verifier hashes the
radical, projection, and finite-form source pins, reconstructs every
transcendental constant from the exact schedule index, and compares outward
intervals.  It shares mpmath.iv with the producer; that limitation is
serialized and enforced.
"""
from __future__ import annotations

import argparse
import gzip
import hashlib
import json
from pathlib import Path
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-outer-projection-weil-bound-v1"
TERMINAL_STATE = "P0_INVALIDATED"
SCHEDULE_K = 2400
LOCKED_SCHEDULE = "lambda_j=j+1/2; N_j=2^(2400*(2*j+1)^2)"
LOCKED_BASIS = "L^(-1/2)*exp(+2*pi*i*r*(t+log(lambda))/L)"
LOCKED_Q_SIGN = "Q=W_0,2-W_R-W_p"
LOCKED_REFLECTION = "K=S*E(tilde_h); S=(1+J)/2; O=(1-C)K includes both tails"
LOCKED_RADICAL_REDUCTION = (
    "W(O,P)=-q(CK,P); W(P,O)=-q(P,CK); CK=P_N*CK+(I-P_N)*CK"
)
LOCKED_HIGH_LOW = (
    "abs(q(P,p))<=(12*B_b*A_K^2*H_N+4*B_b*A_K*M_K)/N"
)
LOCKED_FINAL = (
    "max(abs(W(O,P)),abs(W(P,O)))/d4"
    "<=source_pp_relative+high_low_absolute/d_LS"
)

P1_LOCK = "P1_SOURCE_LOCK.json"
P1_LOCK_SHA256 = "63b83879c52382c6c524b3137b25ea9f1882a24c5518374d487469ecf0e077d2"
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
    "b_bound",
    "cauchy_norm",
    "C_abs",
    "a4",
    "source_scale",
    "mode_variation_upper",
    "source_variation_upper",
    "nonzero_fourier_coefficient_constant",
    "zero_fourier_coefficient_upper",
    "log_N",
    "harmonic_number_upper",
    "inverse_N",
    "defect_d_decay",
    "full_schedule_decay",
    "outer_projection_exponent_margin",
    "defect_lower",
    "high_low_absolute_upper",
    "high_low_relative_upper",
    "projection_exponent_margin",
    "rho",
    "log_weight",
    "pp_multiplier",
    "label_pp_relative_upper",
    "source_pp_relative_upper",
    "outer_projection_relative_upper",
}


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def _hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _validate_sources(payload: dict[str, object]) -> dict[str, str]:
    root = _repo_root()
    p1_path = root / P1_LOCK
    relative_path = root / RELATIVE_LOCK
    gzip_path = root / EGIDI_GZIP

    if _hash(p1_path) != P1_LOCK_SHA256:
        raise ValueError("P1 radical source lock hash mismatch")
    p1 = json.loads(p1_path.read_text())
    if p1.get("claim_status") != "SOURCE_IDENTITY_PINNED_NEW_DOMAIN_EXTENSION_REQUIRED":
        raise ValueError("P1 radical claim status mismatch")
    if p1.get("source_identity_is_conditional_on_rh") is not False:
        raise ValueError("P1 radical conditionality mismatch")
    if p1.get("hard_window_positive_leakage_theorem_found_in_source") is not False:
        raise ValueError("P1 source lock overclaims a positive leakage theorem")
    conventions = p1.get("fourier_conventions")
    if not isinstance(conventions, dict) or conventions.get(
        "binding_additive_transform"
    ) != "F_add(f)(y)=integral_R f(x) exp(+2*pi*i*x*y) dx":
        raise ValueError("P1 additive Fourier convention mismatch")

    if _hash(relative_path) != RELATIVE_LOCK_SHA256:
        raise ValueError("relative-projection source lock hash mismatch")
    relative = json.loads(relative_path.read_text())
    external = relative.get("external_source")
    if not isinstance(external, dict) or external.get("version") != "v2":
        raise ValueError("relative-projection source version mismatch")
    if external.get("gzip_sha256") != EGIDI_GZIP_SHA256:
        raise ValueError("relative source gzip pin mismatch")
    if external.get("uncompressed_tex_sha256") != EGIDI_TEX_SHA256:
        raise ValueError("relative source TeX pin mismatch")
    compressed = gzip_path.read_bytes()
    if hashlib.sha256(compressed).hexdigest() != EGIDI_GZIP_SHA256:
        raise ValueError("vendored Egidi--Seelmann gzip hash mismatch")
    if hashlib.sha256(gzip.decompress(compressed)).hexdigest() != EGIDI_TEX_SHA256:
        raise ValueError("vendored Egidi--Seelmann TeX hash mismatch")
    for relative_name, expected in PINNED_DEPENDENCIES.items():
        if _hash(root / relative_name) != expected:
            raise ValueError(f"pinned dependency hash mismatch: {relative_name}")

    pins = payload.get("source_pins")
    if not isinstance(pins, dict):
        raise ValueError("producer source pins missing")
    expected_radical = {
        "source_lock": P1_LOCK,
        "source_lock_sha256": P1_LOCK_SHA256,
        "two_sided_radical": True,
        "hard_window_positive_leakage_theorem_found_in_source": False,
    }
    if pins.get("global_radical") != expected_radical:
        raise ValueError("producer radical source pins mismatch")
    expected_relative = {
        "source_lock": RELATIVE_LOCK,
        "source_lock_sha256": RELATIVE_LOCK_SHA256,
        "vendored_source": EGIDI_GZIP,
        "gzip_sha256": EGIDI_GZIP_SHA256,
        "uncompressed_tex_sha256": EGIDI_TEX_SHA256,
        "pinned_dependency_sha256": PINNED_DEPENDENCIES,
    }
    if pins.get("relative_projection") != expected_relative:
        raise ValueError("producer relative-projection source pins mismatch")
    if pins.get("ccm_pdf") != CCM_PDF or pins.get("ccm_pdf_sha256") != CCM_SHA256:
        raise ValueError("producer CCM source pin mismatch")
    return {
        "p1_lock_sha256": P1_LOCK_SHA256,
        "relative_lock_sha256": RELATIVE_LOCK_SHA256,
        "egidi_gzip_sha256": EGIDI_GZIP_SHA256,
        "egidi_tex_sha256": EGIDI_TEX_SHA256,
        "ccm_pdf_sha256": CCM_SHA256,
    }


def _capture(value: Any) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_
    lower_raw = tuple(lower)
    upper_raw = tuple(upper)
    precision = max(int(lower_raw[3]), int(upper_raw[3])) + 32
    with mp.workprec(precision):
        return mp.mpf(lower_raw), mp.mpf(upper_raw)


def _reconstruct(j: int, dps: int) -> dict[str, tuple[mp.mpf, mp.mpf]]:
    """Algebraically independent assembly from exact integer parameters."""
    old_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(2 * j + 1) / 2
        ln2 = mp.iv.log(2)
        log_lam = mp.iv.log(lam)
        L = 2 * log_lam
        exp_L = mp.iv.exp(L)
        coth_half = (exp_L + 1) / (exp_L - 1)
        sigma = mp.iv.log(log_lam * coth_half)

        diag_loss = (
            8 * (lam + 1 / lam - 2) / L
            + lam
            + 2 * sigma
            + 4 * L * (lam - 1)
        )
        C_abs = diag_loss + mp.iv.log(coth_half) + 1 / (2 * mp.iv.pi)
        b_bound = (
            2 * (lam - 1 / lam) / mp.iv.pi
            + mp.iv.mpf(1) / 4
            + 1 / (2 * mp.iv.pi**2)
            + (lam - 1 + sigma) / (2 * mp.iv.pi)
            + 2 * L * (lam - 1) / mp.iv.pi
        )
        cauchy_norm = 2 * mp.iv.pi * b_bound

        a4 = mp.iv.sqrt(3) * mp.iv.exp(-mp.iv.mpf(11) * ln2 / 4)
        source_scale = a4 * (1 + 2 * mp.iv.sqrt(2) * lam)
        mode_variation = (
            8 * mp.iv.pi * lam**3 + 2 * lam + 32 * mp.iv.pi * lam**2
        )
        source_variation = source_scale * mode_variation
        A = mp.iv.sqrt(L) * source_variation / (2 * mp.iv.pi)
        M = source_scale * 2 * mp.iv.sqrt(2) * lam / mp.iv.sqrt(L)

        exponent = SCHEDULE_K * (2 * j + 1) ** 2
        log_N = exponent * ln2
        harmonic = 1 + log_N
        inverse_N = mp.iv.power(2, -exponent)
        high_low_abs = (
            12 * b_bound * A * A * harmonic + 4 * b_bound * A * M
        ) * inverse_N

        defect_d_decay = 320 * mp.iv.pi * mp.iv.log(96) / ln2
        full_schedule_decay = 9600 * ln2
        cross_margin = full_schedule_decay - defect_d_decay
        d_lower = 6 * mp.iv.exp(
            (-5 - (320 * mp.iv.pi / ln2) * lam**2) * mp.iv.log(96)
        )
        high_low_rel = high_low_abs / d_lower

        sqrt_defect_decay = defect_d_decay / 2
        sqrt_schedule_decay = full_schedule_decay / 2
        projection_margin = sqrt_schedule_decay - sqrt_defect_decay
        common = mp.iv.sqrt(2 * log_lam) / (mp.iv.pi * mp.iv.sqrt(2))
        bulk = (
            common
            * 4
            * lam
            * (2 * mp.iv.pi * lam**2 + mp.iv.mpf(1) / 2)
            * mp.iv.exp(mp.iv.mpf(5) * mp.iv.log(96) / 2)
            / mp.iv.sqrt(6)
            * mp.iv.exp(-projection_margin * lam**2)
        )
        jump = (
            common
            * 32
            * mp.iv.pi
            * lam**2
            * mp.iv.exp(-sqrt_schedule_decay * lam**2)
        )
        rho = bulk + jump
        log_weight = 1 + mp.iv.log(3) + log_N
        pp_multiplier = log_weight + C_abs + cauchy_norm
        label_pp = rho * rho * pp_multiplier
        source_pp = source_scale * source_scale * label_pp
        total = source_pp + high_low_rel

        values = {
            "lambda": lam,
            "L": L,
            "sigma": sigma,
            "b_bound": b_bound,
            "cauchy_norm": cauchy_norm,
            "C_abs": C_abs,
            "a4": a4,
            "source_scale": source_scale,
            "mode_variation_upper": mode_variation,
            "source_variation_upper": source_variation,
            "nonzero_fourier_coefficient_constant": A,
            "zero_fourier_coefficient_upper": M,
            "log_N": log_N,
            "harmonic_number_upper": harmonic,
            "inverse_N": inverse_N,
            "defect_d_decay": defect_d_decay,
            "full_schedule_decay": full_schedule_decay,
            "outer_projection_exponent_margin": cross_margin,
            "defect_lower": d_lower,
            "high_low_absolute_upper": high_low_abs,
            "high_low_relative_upper": high_low_rel,
            "projection_exponent_margin": projection_margin,
            "rho": rho,
            "log_weight": log_weight,
            "pp_multiplier": pp_multiplier,
            "label_pp_relative_upper": label_pp,
            "source_pp_relative_upper": source_pp,
            "outer_projection_relative_upper": total,
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
    with mp.workprec(bitcount + 32):
        return mp.mpf((sign, int(mantissa), exponent, bitcount))


def _decode_interval(serialized: object, dps: int) -> tuple[mp.mpf, mp.mpf]:
    if not isinstance(serialized, dict) or set(serialized) != {"decimal", "dyadic"}:
        raise ValueError("interval schema mismatch")
    decimal = serialized["decimal"]
    dyadic = serialized["dyadic"]
    if not isinstance(decimal, list) or len(decimal) != 2 or not all(
        isinstance(item, str) for item in decimal
    ):
        raise ValueError("decimal interval schema mismatch")
    if not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}:
        raise ValueError("dyadic interval schema mismatch")
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
    if payload.get("claim_class") != "ANALYTIC_SOURCE_CORE_OUTER_PROJECTION_COMPONENT":
        raise ValueError("claim class mismatch")
    expected_scope = {
        "proved": (
            "both source-core O-P orientations for the actual corrected "
            "source-normalized 0/4 state are o(d4) on the locked schedule"
        ),
        "not_proved": [
            "a modewise global radical for an individual label 0 or 4",
            "an arbitrary L2-outer/log-weighted-compact multiplier theorem",
            "the physical outer-outer term",
            "a signed sector floor",
            "equation (5.2)",
            "locally uniform determinant convergence",
        ],
    }
    if payload.get("claim_scope") != expected_scope:
        raise ValueError("claim scope mismatch")
    expected_formulas = {
        "schedule": LOCKED_SCHEDULE,
        "basis": LOCKED_BASIS,
        "weil_sign": LOCKED_Q_SIGN,
        "reflection": LOCKED_REFLECTION,
        "radical_reduction": LOCKED_RADICAL_REDUCTION,
        "high_low_bound": LOCKED_HIGH_LOW,
        "final_bound": LOCKED_FINAL,
        "source_normalization": (
            "a4=sqrt(3)/2^(11/4); abs(a0/a4)<=2*sqrt(2)*lambda"
        ),
        "hard_endpoint_term": "32*pi*lambda^2*sqrt(d_n)",
        "prime_endpoint": "all prime powers n<=lambda^2; endpoint inclusive",
        "source_core_extension": (
            "symmetric finite Fourier truncations of P; combined form limit"
        ),
    }
    if payload.get("locked_formulas") != expected_formulas:
        raise ValueError("locked formula, sign, reflection, or normalization mismatch")
    expected_arithmetic = {
        "library": f"mpmath.iv {mp.__version__}",
        "raw_outward_dyadic_endpoints_serialized": True,
        "shared_library_with_replay": True,
    }
    if payload.get("arithmetic") != expected_arithmetic:
        raise ValueError("arithmetic metadata mismatch")
    if payload.get("producer_pass_boolean_trusted_by_replay") is not False:
        raise ValueError("replay must not trust a producer pass boolean")

    source_hashes = _validate_sources(payload)

    inputs = payload.get("input")
    expected_input_keys = {
        "j",
        "lambda_exact",
        "schedule_K",
        "schedule_exponent",
        "interval_decimal_digits",
    }
    if not isinstance(inputs, dict) or set(inputs) != expected_input_keys:
        raise ValueError("input inventory mismatch")
    j = inputs["j"]
    dps = inputs["interval_decimal_digits"]
    if isinstance(j, bool) or not isinstance(j, int) or j < 2:
        raise ValueError("schedule index must be an exact integer j>=2")
    if isinstance(dps, bool) or not isinstance(dps, int) or dps < 50:
        raise ValueError("interval precision must be an exact integer at least 50")
    if inputs["lambda_exact"] != {"numerator": 2 * j + 1, "denominator": 2}:
        raise ValueError("exact half-integer lambda mismatch")
    if inputs["schedule_K"] != SCHEDULE_K:
        raise ValueError("schedule K mismatch")
    if inputs["schedule_exponent"] != SCHEDULE_K * (2 * j + 1) ** 2:
        raise ValueError("schedule exponent mismatch")

    serialized = payload.get("intervals")
    if not isinstance(serialized, dict) or set(serialized) != INTERVAL_KEYS:
        raise ValueError("interval inventory mismatch")
    independent = _reconstruct(j, dps + 20)
    comparisons: dict[str, dict[str, object]] = {}
    for key in sorted(INTERVAL_KEYS):
        producer_lo, producer_hi = _decode_interval(serialized[key], dps)
        replay_lo, replay_hi = independent[key]
        overlap = max(producer_lo, replay_lo) <= min(producer_hi, replay_hi)
        endpoint_error = max(
            abs(producer_lo - replay_lo), abs(producer_hi - replay_hi)
        )
        scale = max(
            mp.mpf(1), abs(producer_lo), abs(producer_hi), abs(replay_lo), abs(replay_hi)
        )
        tolerance = mp.power(10, -(dps - 12))
        if not overlap:
            raise ValueError(f"independent interval nonoverlap for {key}")
        if endpoint_error > tolerance * scale:
            raise ValueError(f"independent interval endpoint mismatch for {key}")
        comparisons[key] = {
            "overlap": overlap,
            "maximum_endpoint_difference": mp.nstr(endpoint_error, dps),
        }

    if independent["outer_projection_exponent_margin"][0] <= 0:
        raise ValueError("independently reconstructed cross margin is nonpositive")
    if independent["outer_projection_relative_upper"][0] < 0:
        raise ValueError("independently reconstructed O-P bound is negative")

    return {
        "schema": "xi-prolate-outer-projection-weil-replay-v1",
        "status": "ANALYTIC_UNIFORM_COMPONENT_REPLAY_PASS",
        "source_hashes_reconstructed": source_hashes,
        "producer_booleans_trusted": False,
        "intervals_reconstructed_from_j": True,
        "interval_comparisons": comparisons,
        "shared_arithmetic_library_limitation": f"mpmath.iv {mp.__version__}",
        "claim_scope": (
            "source-core O-P and P-O terms for the corrected source state only; "
            "no O-O term, sector floor, equation (5.2), or determinant limit"
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
