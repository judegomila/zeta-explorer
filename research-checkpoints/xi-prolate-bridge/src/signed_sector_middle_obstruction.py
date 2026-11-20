"""Exact parity-Cauchy formulas and the unresolved middle-window audit.

This module verifies an analytic obstruction.  It does not assemble the
arithmetic Weil matrix and does not assert a sector floor.  Decimal source
parameters are parsed directly by mpmath rather than through binary64.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict

import mpmath as mp


@dataclass(frozen=True)
class HighFourierConstants:
    lam: mp.mpf
    L: mp.mpf
    sigma_L: mp.mpf
    C_a: mp.mpf
    B_b: mp.mpf
    c_lambda: mp.mpf
    C_abs_a: mp.mpf


def source_constants(lambda_decimal: str, dps: int = 80) -> HighFourierConstants:
    """Reconstruct the displayed constants of HIGH_FOURIER_COERCIVITY."""

    with mp.workdps(dps):
        lam = mp.mpf(lambda_decimal)
        if lam <= 1:
            raise ValueError("lambda must exceed one")
        L = 2 * mp.log(lam)
        sigma_L = mp.log(L / (2 * mp.tanh(L / 2)))
        P_lam = 8 * (lam + 1 / lam - 2) / L
        A_lam = lam + 2 * sigma_L
        R_lam = 4 * L * (lam - 1)
        C_a = P_lam + A_lam + R_lam

        B_0 = 2 * (lam - 1 / lam) / mp.pi
        B_inf = (
            mp.mpf(1) / 4
            + 1 / (2 * mp.pi**2)
            + (lam - 1 + sigma_L) / (2 * mp.pi)
        )
        B_p = 2 * L * (lam - 1) / mp.pi
        B_b = B_0 + B_inf + B_p
        c_lambda = 2 * mp.pi * B_b
        C_abs_a = C_a + mp.log(mp.coth(L / 2)) + 1 / (2 * mp.pi)
        return HighFourierConstants(
            +lam, +L, +sigma_L, +C_a, +B_b, +c_lambda, +C_abs_a
        )


def diagonal_lower(constants: HighFourierConstants, n: int) -> mp.mpf:
    if n < 1:
        raise ValueError("n must be positive")
    return mp.log(mp.mpf(n) / 2) - 1 / (2 * mp.pi * n) - constants.C_a


def diagonal_abs_upper(constants: HighFourierConstants, n: int) -> mp.mpf:
    if n < 1:
        raise ValueError("n must be positive")
    return mp.log(n + 2) + constants.C_abs_a


def parity_entries(
    n: int,
    m: int,
    a_n: mp.mpf,
    a_m: mp.mpf,
    b_n: mp.mpf,
    b_m: mp.mpf,
) -> Dict[str, mp.matrix]:
    """Return the exact 2-by-2 plus/minus blocks for distinct n,m>0."""

    if n <= 0 or m <= 0 or n == m:
        raise ValueError("n and m must be distinct positive integers")
    den = mp.mpf(n * n - m * m)
    plus_off = 2 * (n * b_n - m * b_m) / den
    minus_off = 2 * (m * b_n - n * b_m) / den
    plus = mp.matrix(
        [[a_n + b_n / n, plus_off], [plus_off, a_m + b_m / m]]
    )
    minus = mp.matrix(
        [[a_n - b_n / n, minus_off], [minus_off, a_m - b_m / m]]
    )
    return {"plus": plus, "minus": minus}


def adversarial_shifted_pair(B: mp.mpf, U: mp.mpf, r: int) -> Dict[str, object]:
    """Construct equations (3.3)--(3.5) exactly at arbitrary precision."""

    B = mp.mpf(B)
    U = mp.mpf(U)
    if B <= 0:
        raise ValueError("B must be positive")
    if r < 1:
        raise ValueError("r must be positive")
    blocks = parity_entries(r + 1, r, U, U, B, -B)
    identity = mp.eye(2)
    shifted_plus = blocks["plus"] - U * identity
    shifted_minus = blocks["minus"] - U * identity
    determinant = -4 * B**2 - B**2 / (r * (r + 1))
    return {
        "plus": shifted_plus,
        "minus": shifted_minus,
        "determinant_formula": determinant,
        "plus_determinant": mp.det(shifted_plus),
        "minus_determinant": mp.det(shifted_minus),
    }


def coefficient_bounds_admit_pair(
    constants: HighFourierConstants, U: mp.mpf, r: int
) -> bool:
    """Check the explicit compatibility conditions (4.4)."""

    U = mp.mpf(U)
    return bool(
        diagonal_lower(constants, r) <= U
        and diagonal_lower(constants, r + 1) <= U
        and abs(U) <= diagonal_abs_upper(constants, r)
        and abs(U) <= diagonal_abs_upper(constants, r + 1)
    )


def sufficient_high_cutoff_log10(
    constants: HighFourierConstants, U: mp.mpf = mp.mpf("0"), G: mp.mpf = mp.mpf("0")
) -> mp.mpf:
    """Log10 of the real cutoff before the ceiling in source equation (5.5)."""

    exponent = constants.C_a + constants.c_lambda + U + G + 1 / (2 * mp.pi)
    return mp.log10(2) + exponent / mp.log(10)


__all__ = [
    "HighFourierConstants",
    "adversarial_shifted_pair",
    "coefficient_bounds_admit_pair",
    "diagonal_abs_upper",
    "diagonal_lower",
    "parity_entries",
    "source_constants",
    "sufficient_high_cutoff_log10",
]
