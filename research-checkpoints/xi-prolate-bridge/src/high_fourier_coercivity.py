#!/usr/bin/env python3
"""Explicit high-Fourier isolation bounds for the finite Weil matrix.

The binding matrix formulas are CCM-ZST-v1 (3.13)--(3.16), (4.1)--(4.4),
and Lemma 5.1 (5.2).  This module evaluates only theorem constants.  It does
not use a stored matrix, an eigenvector, a zeta-zero table, or positivity of
the Weil form.

All user-supplied real parameters are decimal strings.  The computations are
arbitrary-precision diagnostics of the exact formulas proved in
``notes/HIGH_FOURIER_COERCIVITY.md``; they are not interval enclosures.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path

import mpmath as mp


LOCKED_SOURCE = "CCM-ZST arXiv:2511.22755v1"
LOCKED_SOURCE_PDF = "vendor/CCM-ZST-2511.22755v1.pdf"
LOCKED_SOURCE_SHA256 = "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b"
LOCKED_CAUCHY_FORM = "Q_nm=(b_n-b_m)/(n-m) for n!=m; Q_nn=a_n"
LOCKED_BLOCK_SIGN = "Q=W_0,2-W_R-W_p"


def source_pdf_sha256() -> str:
    path = Path(__file__).resolve().parents[1] / LOCKED_SOURCE_PDF
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if digest != LOCKED_SOURCE_SHA256:
        raise ValueError("vendored CCM source PDF hash mismatch")
    return digest


def parse_decimal(text: str) -> mp.mpf:
    """Parse exact decimal/rational text without a binary64 intermediate."""
    if not isinstance(text, str):
        raise TypeError("real parameters must be decimal strings")
    try:
        Fraction(text)
    except (ValueError, ZeroDivisionError) as exc:
        raise ValueError("invalid exact decimal parameter") from exc
    return mp.mpf(text)


def _ceil_mpf(value: mp.mpf) -> int:
    """Diagnostic arbitrary-precision ceiling (not an interval operation)."""
    return int(mp.ceil(value))


def coercivity_constants(lambda_text: str, dps: int = 80) -> dict[str, mp.mpf]:
    """Return the explicit constants in the high-mode theorem.

    With ``L=2 log(lambda)`` and ``sigma=log(L/(2 tanh(L/2)))``, the theorem
    proves

      a_n >= log(|n|/2)-1/(2*pi*|n|)-C_a,
      |b_n| <= B_b,

    for every nonzero integer mode.  Consequently the off-diagonal Cauchy
    commutator has norm at most ``coupling=2*pi*B_b`` on every finite
    compression, independently of its outer cutoff.
    """
    if not isinstance(dps, int) or dps < 30:
        raise ValueError("dps must be an integer at least 30")
    mp.mp.dps = dps
    lam = parse_decimal(lambda_text)
    if lam <= 1:
        raise ValueError("require lambda>1")

    L = 2 * mp.log(lam)
    sigma = mp.log(L / (2 * mp.tanh(L / 2)))

    pole_diagonal_loss = 8 * (lam + 1 / lam - 2) / L
    arch_diagonal_loss = lam + 2 * sigma
    prime_diagonal_loss = 4 * L * (lam - 1)
    diagonal_loss = (
        pole_diagonal_loss + arch_diagonal_loss + prime_diagonal_loss
    )
    arch_tail = mp.log(mp.coth(L / 2))
    absolute_diagonal_constant = diagonal_loss + arch_tail + 1 / (2 * mp.pi)

    pole_b_bound = 2 * (lam - 1 / lam) / mp.pi
    arch_b_bound = (
        mp.mpf(1) / 4
        + 1 / (2 * mp.pi**2)
        + (lam - 1 + sigma) / (2 * mp.pi)
    )
    prime_b_bound = 2 * L * (lam - 1) / mp.pi
    b_bound = pole_b_bound + arch_b_bound + prime_b_bound
    coupling_bound = 2 * mp.pi * b_bound

    return {
        "lambda": lam,
        "L": L,
        "sigma": sigma,
        "pole_diagonal_loss": pole_diagonal_loss,
        "arch_diagonal_loss": arch_diagonal_loss,
        "prime_diagonal_loss": prime_diagonal_loss,
        "diagonal_loss": diagonal_loss,
        "arch_tail": arch_tail,
        "absolute_diagonal_constant": absolute_diagonal_constant,
        "pole_b_bound": pole_b_bound,
        "arch_b_bound": arch_b_bound,
        "prime_b_bound": prime_b_bound,
        "b_bound": b_bound,
        "coupling_bound": coupling_bound,
    }


def high_mode_bounds(
    lambda_text: str,
    M: int,
    shift_text: str = "0",
    dps: int = 80,
) -> dict[str, mp.mpf | int]:
    """Evaluate the high compression and low/high coupling bounds.

    The high subspace is spanned by modes ``|n|>=M+1`` inside any finite
    range ``[-N,N]`` with ``N>M``.  The returned bounds are uniform in N.
    ``shift_text`` is the real scalar U in ``Q-U I``.
    """
    if not isinstance(M, int) or M < 0:
        raise ValueError("M must be a nonnegative integer")
    c = coercivity_constants(lambda_text, dps)
    U = parse_decimal(shift_text)
    first = mp.mpf(M + 1)
    diagonal_floor = (
        mp.log(first / 2)
        - 1 / (2 * mp.pi * first)
        - c["diagonal_loss"]
    )
    unshifted_floor = diagonal_floor - c["coupling_bound"]
    shifted_floor = unshifted_floor - U
    return {
        **c,
        "M": M,
        "first_high_mode": M + 1,
        "shift": U,
        "high_diagonal_floor": diagonal_floor,
        "nonzero_diagonal_absolute_bound_formula": (
            "abs(a_n)<=log(abs(n)+2)+absolute_diagonal_constant"
        ),
        "unshifted_high_compression_floor": unshifted_floor,
        "shifted_high_compression_floor": shifted_floor,
        "low_high_coupling_norm_upper": c["coupling_bound"],
    }


def sufficient_cutoff(
    lambda_text: str,
    shift_text: str,
    target_floor_text: str,
    dps: int = 80,
) -> dict[str, mp.mpf | int]:
    """Return the explicit sufficient cutoff M_star from the theorem.

    Mathematically,

      M_star=max(0,ceil(2 exp(C_a+c+U+G+1/(2*pi)))-1).

    Every integer ``M>=M_star`` gives a high compression floor at least G
    for ``Q-U I``.  The computed ceiling is a point arbitrary-precision
    replay; the displayed symbolic definition is the theorem statement.
    """
    c = coercivity_constants(lambda_text, dps)
    U = parse_decimal(shift_text)
    G = parse_decimal(target_floor_text)
    if G < 0:
        raise ValueError("target floor must be nonnegative")
    exponent = (
        c["diagonal_loss"]
        + c["coupling_bound"]
        + U
        + G
        + 1 / (2 * mp.pi)
    )
    raw = 2 * mp.exp(exponent)
    M_star = max(0, _ceil_mpf(raw) - 1)
    result = high_mode_bounds(lambda_text, M_star, shift_text, dps)
    result.update(
        {
            "target_floor": G,
            "cutoff_exponent": exponent,
            "cutoff_raw_before_ceiling": raw,
            "M_star": M_star,
            "symbolic_cutoff": (
                "max(0,ceil(2*exp(C_a+c+U+G+1/(2*pi)))-1)"
            ),
            "point_replay_meets_target": bool(
                result["shifted_high_compression_floor"] >= G
            ),
        }
    )
    return result


def _serialize(value: object, digits: int) -> object:
    if isinstance(value, mp.mpf):
        return mp.nstr(value, digits)
    return value


def report(
    lambda_text: str,
    M: int | None,
    shift_text: str,
    target_floor_text: str | None,
    dps: int,
) -> dict[str, object]:
    pdf_digest = source_pdf_sha256()
    if target_floor_text is None:
        if M is None:
            raise ValueError("provide M or target_floor")
        raw = high_mode_bounds(lambda_text, M, shift_text, dps)
    else:
        if M is not None:
            raise ValueError("M and target_floor are mutually exclusive")
        raw = sufficient_cutoff(
            lambda_text, shift_text, target_floor_text, dps
        )
    return {
        "status": "ANALYTIC_UNIFORM_COMPONENT_BOUND",
        "claim_scope": (
            "high Fourier compression and its low/high coupling only; "
            "no low-sector sign or determinant-limit conclusion"
        ),
        "source": LOCKED_SOURCE,
        "source_pdf": LOCKED_SOURCE_PDF,
        "source_pdf_sha256": pdf_digest,
        "source_cauchy_form": LOCKED_CAUCHY_FORM,
        "source_block_sign": LOCKED_BLOCK_SIGN,
        "precision_decimal_digits": dps,
        "outer_cutoff_uniformity": "all finite N>M",
        "arithmetic_library": f"mpmath {mp.__version__}",
        "interval_enclosure": False,
        "values": {key: _serialize(value, dps) for key, value in raw.items()},
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda", dest="lambda_text", required=True)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--M", type=int)
    group.add_argument("--target-floor")
    parser.add_argument("--shift", default="0")
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    payload = report(
        args.lambda_text,
        args.M,
        args.shift,
        args.target_floor,
        args.dps,
    )
    text = json.dumps(payload, indent=2) + "\n"
    if args.output is not None:
        args.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
