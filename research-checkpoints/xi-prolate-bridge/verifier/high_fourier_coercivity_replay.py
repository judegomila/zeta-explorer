#!/usr/bin/env python3
"""Independent replay of the explicit high-Fourier theorem constants.

This path does not import ``src/high_fourier_coercivity.py``.  It reconstructs
the constants from ``L`` using hyperbolic formulas rather than trusting
producer values or booleans.  Producer and replay both use mpmath; that shared
arithmetic-library limitation is reported explicitly.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path

import mpmath as mp


EXPECTED_SOURCE = "CCM-ZST arXiv:2511.22755v1"
EXPECTED_SOURCE_PDF = "vendor/CCM-ZST-2511.22755v1.pdf"
EXPECTED_SOURCE_SHA256 = "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b"
EXPECTED_CAUCHY = "Q_nm=(b_n-b_m)/(n-m) for n!=m; Q_nn=a_n"
EXPECTED_SIGN = "Q=W_0,2-W_R-W_p"


def decimal(text: str) -> mp.mpf:
    if not isinstance(text, str):
        raise TypeError("serialized transcendental values must be strings")
    try:
        Fraction(text)
    except (ValueError, ZeroDivisionError) as exc:
        raise ValueError("invalid exact decimal text") from exc
    return mp.mpf(text)


def reconstruct(lambda_text: str, M: int, shift_text: str) -> dict[str, mp.mpf]:
    lam = decimal(lambda_text)
    U = decimal(shift_text)
    if lam <= 1 or not isinstance(M, int) or M < 0:
        raise ValueError("require lambda>1 and integer M>=0")

    # This is algebraically the same theorem constant but is assembled from
    # L and hyperbolic functions, rather than the producer's lambda formulas.
    L = 2 * mp.log(lam)
    half = L / 2
    sigma = mp.log(L) - mp.log(2) - mp.log(mp.tanh(half))
    pole_diag = 16 * (mp.cosh(half) - 1) / L
    arch_diag = mp.exp(half) + 2 * sigma
    prime_diag = 4 * L * (mp.exp(half) - 1)
    diagonal_loss = pole_diag + arch_diag + prime_diag
    arch_tail = -mp.log(mp.tanh(half))
    absolute_diagonal_constant = diagonal_loss + arch_tail + 1 / (2 * mp.pi)

    pole_b = 4 * mp.sinh(half) / mp.pi
    arch_b = (
        mp.mpf(1) / 4
        + 1 / (2 * mp.pi**2)
        + (mp.exp(half) - 1 + sigma) / (2 * mp.pi)
    )
    prime_b = 2 * L * (mp.exp(half) - 1) / mp.pi
    b_bound = pole_b + arch_b + prime_b
    coupling = 2 * mp.pi * b_bound

    first = mp.mpf(M + 1)
    diagonal_floor = mp.log(first / 2) - 1 / (2 * mp.pi * first) - diagonal_loss
    unshifted = diagonal_floor - coupling
    shifted = unshifted - U
    return {
        "lambda": lam,
        "L": L,
        "sigma": sigma,
        "pole_diagonal_loss": pole_diag,
        "arch_diagonal_loss": arch_diag,
        "prime_diagonal_loss": prime_diag,
        "diagonal_loss": diagonal_loss,
        "arch_tail": arch_tail,
        "absolute_diagonal_constant": absolute_diagonal_constant,
        "pole_b_bound": pole_b,
        "arch_b_bound": arch_b,
        "prime_b_bound": prime_b,
        "b_bound": b_bound,
        "coupling_bound": coupling,
        "shift": U,
        "high_diagonal_floor": diagonal_floor,
        "unshifted_high_compression_floor": unshifted,
        "shifted_high_compression_floor": shifted,
        "low_high_coupling_norm_upper": coupling,
    }


def replay(payload: dict[str, object]) -> dict[str, object]:
    dps = payload.get("precision_decimal_digits")
    if not isinstance(dps, int) or dps < 30:
        raise ValueError("missing or invalid producer precision")
    mp.mp.dps = dps

    if payload.get("source") != EXPECTED_SOURCE:
        raise ValueError("source version mismatch")
    if payload.get("source_pdf") != EXPECTED_SOURCE_PDF:
        raise ValueError("source PDF path mismatch")
    source_path = Path(__file__).resolve().parents[1] / EXPECTED_SOURCE_PDF
    independent_digest = hashlib.sha256(source_path.read_bytes()).hexdigest()
    if independent_digest != EXPECTED_SOURCE_SHA256:
        raise ValueError("vendored source PDF bytes mismatch")
    if payload.get("source_pdf_sha256") != independent_digest:
        raise ValueError("producer source PDF hash mismatch")
    if payload.get("source_cauchy_form") != EXPECTED_CAUCHY:
        raise ValueError("Cauchy convention mismatch")
    if payload.get("source_block_sign") != EXPECTED_SIGN:
        raise ValueError("pole/arch/prime sign mismatch")
    if payload.get("outer_cutoff_uniformity") != "all finite N>M":
        raise ValueError("outer-cutoff scope mismatch")
    if payload.get("interval_enclosure") is not False:
        raise ValueError("point replay must not claim interval enclosure")

    values = payload.get("values")
    if not isinstance(values, dict):
        raise ValueError("missing producer values")
    M = values.get("M")
    if not isinstance(M, int):
        raise ValueError("M must be serialized as an integer")
    lam_text = values.get("lambda")
    shift_text = values.get("shift")
    if not isinstance(lam_text, str) or not isinstance(shift_text, str):
        raise ValueError("lambda and shift must be decimal strings")

    independent = reconstruct(lam_text, M, shift_text)
    tolerance = mp.power(10, -max(12, dps // 2))
    discrepancies: dict[str, str] = {}
    for key, expected in independent.items():
        supplied = values.get(key)
        if not isinstance(supplied, str):
            raise ValueError(f"missing decimal string for {key}")
        discrepancies[key] = mp.nstr(abs(decimal(supplied) - expected), dps)
        if abs(decimal(supplied) - expected) > tolerance * max(1, abs(expected)):
            raise ValueError(f"producer mismatch for {key}")

    target_checked = False
    target_holds = None
    if "target_floor" in values:
        target = values["target_floor"]
        if not isinstance(target, str):
            raise ValueError("target floor must be a decimal string")
        target_value = decimal(target)
        if target_value < 0:
            raise ValueError("negative target floor")
        expected_exponent = (
            independent["diagonal_loss"]
            + independent["coupling_bound"]
            + independent["shift"]
            + target_value
            + 1 / (2 * mp.pi)
        )
        expected_raw = 2 * mp.exp(expected_exponent)
        expected_M = max(0, int(mp.ceil(expected_raw)) - 1)
        if values.get("M_star") != expected_M or M != expected_M:
            raise ValueError("sufficient cutoff integer mismatch")
        for key, expected in (
            ("cutoff_exponent", expected_exponent),
            ("cutoff_raw_before_ceiling", expected_raw),
        ):
            supplied = values.get(key)
            if not isinstance(supplied, str):
                raise ValueError(f"missing decimal string for {key}")
            if abs(decimal(supplied) - expected) > tolerance * max(1, abs(expected)):
                raise ValueError(f"producer mismatch for {key}")
        if values.get("symbolic_cutoff") != (
            "max(0,ceil(2*exp(C_a+c+U+G+1/(2*pi)))-1)"
        ):
            raise ValueError("symbolic cutoff formula mismatch")
        target_holds = bool(independent["shifted_high_compression_floor"] >= target_value)
        if values.get("point_replay_meets_target") is not target_holds:
            raise ValueError("producer target boolean is inconsistent")
        target_checked = True

    return {
        "status": "ANALYTIC_UNIFORM_COMPONENT_REPLAY_PASS",
        "source_reconstructed": True,
        "source_sign_reconstructed": True,
        "producer_booleans_trusted": False,
        "shared_arithmetic_library_limitation": f"mpmath {mp.__version__}",
        "precision_decimal_digits": dps,
        "tolerance": mp.nstr(tolerance, dps),
        "maximum_constant_discrepancy": max(discrepancies.values(), key=decimal),
        "discrepancies": discrepancies,
        "target_checked": target_checked,
        "target_holds": target_holds,
        "claim_scope": (
            "high Fourier compression/coupling only; no low-sector sign or "
            "determinant-limit conclusion"
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    payload = json.loads(args.input.read_text())
    result = replay(payload)
    text = json.dumps(result, indent=2) + "\n"
    if args.output is not None:
        args.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
