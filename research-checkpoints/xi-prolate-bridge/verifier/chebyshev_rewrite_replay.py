#!/usr/bin/env python3
"""Independent replay of the combined Chebyshev-error Weil rewrite.

The matrix is reconstructed through ``verifier/independent_replay.py``, which
imports no producer module.  The comparison integral is then assembled from
the source prime-power parameters rather than from serialized matrix data.
"""
from __future__ import annotations

import argparse
import json
from fractions import Fraction
from pathlib import Path

import mpmath as mp

try:
    from independent_replay import matrix_from_source
except ModuleNotFoundError:  # imported as ``verifier.chebyshev_rewrite_replay``
    from verifier.independent_replay import matrix_from_source


def source_correlation(n: int, m: int, x: mp.mpf, L: mp.mpf) -> mp.mpf:
    """Reconstruct the source correlation without importing matrix qfun."""
    if n == m:
        return 2 * (1 - x / L) * mp.cos(2 * mp.pi * n * x / L)
    return (
        mp.sin(2 * mp.pi * m * x / L)
        - mp.sin(2 * mp.pi * n * x / L)
    ) / (mp.pi * (n - m))


def independent_von_mangoldt_terms(
    lambda_text: str,
) -> list[tuple[int, mp.mpf]]:
    """Generate prime powers by a sieve-and-powers path independent of Q."""
    if not isinstance(lambda_text, str):
        raise TypeError("lambda must be exact decimal text")
    lam = Fraction(lambda_text)
    if lam <= 1:
        raise ValueError("lambda must exceed one")
    cutoff = lam.numerator**2 // lam.denominator**2

    sieve = [True] * (cutoff + 1)
    if cutoff >= 0:
        sieve[0] = False
    if cutoff >= 1:
        sieve[1] = False
    p = 2
    while p * p <= cutoff:
        if sieve[p]:
            for composite in range(p * p, cutoff + 1, p):
                sieve[composite] = False
        p += 1

    terms: dict[int, mp.mpf] = {}
    for prime in range(2, cutoff + 1):
        if not sieve[prime]:
            continue
        power = prime
        while power <= cutoff:
            terms[power] = mp.log(prime)
            if power > cutoff // prime:
                break
            power *= prime
    return sorted(terms.items())


def require_exact_prime_terms(
    terms: list[tuple[int, mp.mpf]], lambda_text: str
) -> list[tuple[int, mp.mpf]]:
    """Fail closed on an omission, insertion, reordering, or prime-sign flip."""
    expected = independent_von_mangoldt_terms(lambda_text)
    supplied_indices = [integer for integer, _ in terms]
    expected_indices = [integer for integer, _ in expected]
    if supplied_indices != expected_indices:
        raise ValueError("prime-power list differs from independent inclusive list")
    tolerance = mp.power(10, -max(20, mp.mp.dps // 2))
    for (integer, value), (_, expected_value) in zip(terms, expected):
        if value <= 0 or abs(value - expected_value) > tolerance:
            raise ValueError(f"von Mangoldt weight/sign mismatch at n={integer}")
    return expected


def inner(left: mp.matrix, right: mp.matrix) -> mp.mpc:
    return mp.fsum(mp.conj(left[i]) * right[i] for i in range(left.rows))


def matrix_inner(left: mp.matrix, matrix: mp.matrix, right: mp.matrix) -> mp.mpc:
    return mp.fsum(
        mp.conj(left[i]) * matrix[i, j] * right[j]
        for i in range(left.rows)
        for j in range(right.rows)
    )


def correlation(
    left: mp.matrix,
    right: mp.matrix,
    modes: list[int],
    x: mp.mpf,
    L: mp.mpf,
) -> mp.mpc:
    return mp.fsum(
        mp.conj(left[i]) * right[j] * source_correlation(n, m, x, L)
        for i, n in enumerate(modes)
        for j, m in enumerate(modes)
    )


def qfun_derivative(n: int, m: int, x: mp.mpf, L: mp.mpf) -> mp.mpf:
    nu_n = 2 * mp.pi * n / L
    nu_m = 2 * mp.pi * m / L
    if n == m:
        return (
            -2 * mp.cos(nu_n * x) / L
            - 2 * (1 - x / L) * nu_n * mp.sin(nu_n * x)
        )
    return (
        nu_m * mp.cos(nu_m * x) - nu_n * mp.cos(nu_n * x)
    ) / (mp.pi * (n - m))


def correlation_derivative(
    left: mp.matrix,
    right: mp.matrix,
    modes: list[int],
    x: mp.mpf,
    L: mp.mpf,
) -> mp.mpc:
    return mp.fsum(
        mp.conj(left[i]) * right[j] * qfun_derivative(n, m, x, L)
        for i, n in enumerate(modes)
        for j, m in enumerate(modes)
    )


def combined_integral(
    omega,
    omega_derivative,
    L: mp.mpf,
    terms: list[tuple[int, mp.mpf]],
    epsilon: mp.mpf,
    endpoint_tolerance: mp.mpf | None = None,
) -> mp.mpc:
    """Evaluate -integral G(x) d[e^(-x/2)omega(x)] piecewise."""
    if endpoint_tolerance is None:
        endpoint_tolerance = mp.power(10, -max(20, mp.mp.dps // 2))
    if endpoint_tolerance <= 0:
        raise ValueError("endpoint tolerance must be positive")
    if abs(omega(mp.mpf(0))) > endpoint_tolerance:
        raise ValueError("combined identity requires omega(0)=0")
    if abs(omega(L)) > endpoint_tolerance:
        raise ValueError("combined identity requires omega(L)=0")
    if any(integer < 2 or value <= 0 for integer, value in terms):
        raise ValueError("prime terms must have positive indices and weights")
    breakpoints = [epsilon]
    breakpoints.extend(
        mp.log(integer)
        for integer, _ in terms
        if epsilon < mp.log(integer) < L
    )
    breakpoints.append(L)
    total = mp.mpc(0)
    for left, right in zip(breakpoints[:-1], breakpoints[1:]):
        midpoint = (left + right) / 2
        psi_value = mp.fsum(
            value for integer, value in terms if mp.log(integer) <= midpoint
        )

        def chebyshev_kernel(x):
            return (
                mp.exp(x)
                - psi_value
                - mp.log(1 - mp.exp(-2 * x)) / 2
            )

        def weighted_derivative(x):
            return mp.exp(-x / 2) * (omega_derivative(x) - omega(x) / 2)

        total -= mp.quad(
            lambda x: chebyshev_kernel(x) * weighted_derivative(x),
            [left, right],
        )
    return total


def replay(lambda_text: str, N: int, dps: int) -> dict[str, object]:
    mp.mp.dps = dps
    _, _, _, Q, matrix_terms = matrix_from_source(lambda_text, N, dps)
    terms = independent_von_mangoldt_terms(lambda_text)
    require_exact_prime_terms(matrix_terms, lambda_text)
    lam = mp.mpf(lambda_text)
    lam_fraction = Fraction(lambda_text)
    lambda_squared_exact = lam_fraction * lam_fraction
    cutoff_floor = (
        lambda_squared_exact.numerator // lambda_squared_exact.denominator
    )
    L = 2 * mp.log(lam)
    modes = list(range(-N, N + 1))
    epsilon = mp.power(10, -(dps // 2 - 5))

    entry_pairs = [(1, 0), (N, -1), (-N, 1)]
    entry_defects = []
    for n, m in entry_pairs:
        i, j = modes.index(n), modes.index(m)
        reconstructed = combined_integral(
            lambda x, n=n, m=m: source_correlation(n, m, x, L),
            lambda x, n=n, m=m: qfun_derivative(n, m, x, L),
            L,
            terms,
            epsilon,
        )
        entry_defects.append(abs(reconstructed - Q[i, j]))

    dimension = 2 * N + 1
    kappa = mp.matrix([1 + abs(n) for n in modes])
    kappa /= mp.sqrt(inner(kappa, kappa))
    left = mp.matrix(
        [mp.mpc(2 + i, mp.mpf((-1) ** i * (i + 1)) / 3) for i in range(dimension)]
    )
    right = mp.matrix(
        [
            mp.mpc((-1) ** i * (i + 2), mp.mpf(dimension - i) / 5)
            for i in range(dimension)
        ]
    )
    q = matrix_inner(kappa, Q, kappa)
    overlap = inner(left, right)

    def shifted_correlation(x):
        return correlation(left, right, modes, x, L) - overlap * correlation(
            kappa, kappa, modes, x, L
        )

    def shifted_correlation_derivative(x):
        return correlation_derivative(left, right, modes, x, L) - overlap * (
            correlation_derivative(kappa, kappa, modes, x, L)
        )

    direct = matrix_inner(left, Q - q * mp.eye(dimension), right)
    reconstructed = combined_integral(
        shifted_correlation, shifted_correlation_derivative, L, terms, epsilon
    )
    shifted_defect = abs(reconstructed - direct)
    origin_defect = abs(shifted_correlation(mp.mpf(0)))
    tolerance = mp.power(10, -(dps // 3))
    agrees = (
        max(entry_defects + [shifted_defect, origin_defect]) <= tolerance
        and abs(mp.im(q)) <= tolerance
    )

    nstr = lambda value: mp.nstr(value, dps)
    return {
        "claim_class": "EXACT_FINITE_COMBINED_FORM_REPLAY",
        "terminal_state": "P0_INVALIDATED",
        "analytic_uniform_claim": False,
        "inputs": {
            "lambda": lambda_text,
            "N": N,
            "precision_decimal_digits": dps,
            "arithmetic_library": f"mpmath {mp.__version__}",
            "origin_cutoff": nstr(epsilon),
            "lambda_squared_exact": str(lambda_squared_exact),
            "prime_power_cutoff_inclusive": str(cutoff_floor),
        },
        "formula": {
            "G": "exp(x)-psi(exp(x))-(1/2)*log(1-exp(-2*x))",
            "shifted_form": "<v,(Q-qI)w>=-integral G*d_dx(exp(-x/2)*omega_q_vw)",
            "omega_q_origin_identity": "omega_q_vw(0)=0",
            "prime_block_sign": "minus",
        },
        "source_enumeration": {
            "matrix_path_prime_powers": [integer for integer, _ in matrix_terms],
            "integral_path_prime_powers": [integer for integer, _ in terms],
            "enumerations_agree_exactly": [integer for integer, _ in matrix_terms]
            == [integer for integer, _ in terms],
            "lambda_squared_is_integer": lambda_squared_exact.denominator == 1,
            "endpoint_prime_power_included": (
                lambda_squared_exact.denominator == 1
                and lambda_squared_exact.numerator
                in [integer for integer, _ in terms]
            ),
        },
        "defects": {
            "offdiagonal_entries": [nstr(value) for value in entry_defects],
            "complex_shifted_form": nstr(shifted_defect),
            "shifted_correlation_origin": nstr(origin_defect),
            "rayleigh_imaginary_part": nstr(abs(mp.im(q))),
        },
        "tolerance": nstr(tolerance),
        "replay_agrees": bool(agrees),
        "limitations": [
            "point-valued mpmath quadrature with an explicit origin cutoff",
            "matrix and integral paths share mpmath transcendental arithmetic",
            "the two correlation formulas and prime-power enumerators are separately implemented but not interval-enclosed",
            "finite identity replay only; no sign or asymptotic estimate",
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda", dest="lambda_text", default="2")
    parser.add_argument("--N", type=int, default=2)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    if args.N < 1 or args.dps < 40:
        raise ValueError("require N>=1 and dps>=40")
    result = replay(args.lambda_text, args.N, args.dps)
    text = json.dumps(result, indent=2) + "\n"
    if args.output:
        args.output.write_text(text)
    print(text, end="")
    if not result["replay_agrees"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
