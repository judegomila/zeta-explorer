#!/usr/bin/env python3
"""Finite PNT-discrepancy normal form for the source Weil compression.

This is a point-arithmetic diagnostic.  It reconstructs the normal form from
the prime-power inventory and compares it with the locked source assembly;
it does not read a cached matrix or a zeta-zero table and makes no asymptotic
positivity or Riemann-hypothesis claim.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp

from weil_matrix import blocks_split


SCHEMA = "xi-prolate-pnt-discrepancy-normal-form-v1"
TERMINAL_STATE = "P0_INVALIDATED"
_DECIMAL = re.compile(r"^(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$")

LOCKED_CONVENTIONS = {
    "physical_interval": "I=[-a,a], a=log(lambda), L=2*a, with Lebesgue measure",
    "zero_extension": "every translated function is zero outside I",
    "fourier_basis": "V_n(x)=(-1)^n*L^(-1/2)*exp(+2*pi*i*n*x/L), -N<=n<=N",
    "inversion": "J*V_n=V_-n; reflection is included before parity compression",
    "prime_power_endpoint": "inclusive 1<n<=lambda^2",
    "prime_block_sign": "minus in Q=pole-archimedean-prime",
    "discrepancy_measure_sign": "dD=sum Lambda(n)/sqrt(n)*delta_log(n)-exp(h/2)*dh",
    "lambda_scale": "a=log(lambda), L=2*log(lambda), exp(L)=lambda^2",
}

LOCKED_FORMULAS = {
    "W": "W(X)=sum_{1<n<=X} Lambda(n)/sqrt(n)",
    "D": "D_lambda(h)=W(exp(h))-2*(exp(h/2)-1), 0<=h<=2*a",
    "dD": "dD=sum_{1<n<=lambda^2} Lambda(n)/sqrt(n)*delta_log(n)-exp(h/2)*dh",
    "c_star": "c_*=psi(1/4)-log(pi)+4",
    "rho_tail": "symmetric density rho(|h|)=exp(-5*|h|/2)/(1-exp(-2*|h|)); paired over h>0",
    "A_tail": "A_tail*f(x)=integral_0^infinity (2*f(x)-f_tilde(x+h)-f_tilde(x-h))*rho(h) dh",
    "T_D": "T_D*f(x)=integral_0^(2*a) (f_tilde(x+h)+f_tilde(x-h)) dD(h)",
    "normal_form": "Q_lambda=c_* I+A_tail-T_D",
    "source_form": "Q_lambda=pole-archimedean-prime",
}

CLAIM_SCOPE = {
    "proved_here": [
        "the exact finite PNT-discrepancy normal-form identity",
        "its restrictions to the inversion-even and inversion-odd finite Fourier sectors",
    ],
    "not_proved_here": [
        "a uniform mixed-reserve estimate",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}


def _exact_lambda(text: str) -> Fraction:
    if not isinstance(text, str):
        raise TypeError("lambda must be an exact decimal string; binary64 is forbidden")
    if _DECIMAL.fullmatch(text) is None:
        raise ValueError("lambda must be a canonical nonnegative decimal string")
    value = Fraction(text)
    if value <= 1:
        raise ValueError("lambda must be greater than one")
    return value


def _exact_integer(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer; binary64 is forbidden")
    if value < minimum:
        raise ValueError(f"{label} must be at least {minimum}")
    return value


def prime_power_inventory(lambda_text: str) -> list[tuple[int, int, int]]:
    """Generate ``(prime power, prime, exponent)`` through lambda squared."""

    lam = _exact_lambda(lambda_text)
    square = lam * lam
    cutoff = square.numerator // square.denominator
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
    out: list[tuple[int, int, int]] = []
    for p in range(2, cutoff + 1):
        if not sieve[p]:
            continue
        power = p
        exponent = 1
        while power <= cutoff:
            out.append((power, p, exponent))
            if power > cutoff // p:
                break
            power *= p
            exponent += 1
    return sorted(out)


def paired_shift_kernel(n: int, m: int, h: mp.mpf, L: mp.mpf) -> mp.mpf:
    """Matrix entry of the paired zero-extended translation convention."""

    if n == m:
        return 2 * (1 - h / L) * mp.cos(2 * mp.pi * n * h / L)
    return (
        mp.sin(2 * mp.pi * m * h / L)
        - mp.sin(2 * mp.pi * n * h / L)
    ) / (mp.pi * (n - m))


def _rho(h: mp.mpf) -> mp.mpf:
    return mp.exp(-mp.mpf(5) * h / 2) / (-mp.expm1(-2 * h))


def _tail_entry(n: int, m: int, L: mp.mpf) -> mp.mpf:
    q0 = mp.mpf(2) if n == m else mp.mpf(0)

    def interior(h: mp.mpf) -> mp.mpf:
        # For every pair of modes, rho(h)*(q(0)-q(h)) tends to 1/L.
        if h == 0:
            return 1 / L
        return _rho(h) * (q0 - paired_shift_kernel(n, m, h, L))

    return mp.quad(interior, [0, L]) + q0 * mp.quad(_rho, [L, mp.inf])


def _matrix(rows: int) -> mp.matrix:
    return mp.matrix(rows, rows)


def _normal_form_blocks(
    lambda_text: str, N: int, dps: int
) -> tuple[list[int], list[tuple[int, int, int]], dict[str, mp.matrix], dict[str, mp.mpf]]:
    lam = mp.mpf(lambda_text)
    a = mp.log(lam)
    L = 2 * a
    modes = list(range(-N, N + 1))
    inventory = prime_power_inventory(lambda_text)
    dim = len(modes)
    c_star = mp.digamma(mp.mpf(1) / 4) - mp.log(mp.pi) + 4
    c_identity = _matrix(dim)
    tail = _matrix(dim)
    atoms = _matrix(dim)
    continuous = _matrix(dim)
    t_discrepancy = _matrix(dim)
    normal_q = _matrix(dim)
    for i, n in enumerate(modes):
        for j, m in enumerate(modes):
            c_identity[i, j] = c_star if n == m else 0
            tail[i, j] = _tail_entry(n, m, L)
            atoms[i, j] = mp.fsum(
                mp.log(p)
                / mp.sqrt(k)
                * paired_shift_kernel(n, m, mp.log(k), L)
                for k, p, _exponent in inventory
            )
            continuous[i, j] = mp.quad(
                lambda h: mp.exp(h / 2) * paired_shift_kernel(n, m, h, L),
                [0, L],
            )
            t_discrepancy[i, j] = atoms[i, j] - continuous[i, j]
            normal_q[i, j] = (
                c_identity[i, j] + tail[i, j] - t_discrepancy[i, j]
            )
    scalars = {
        "a": a,
        "L": L,
        "c_star": c_star,
        "W_lambda_squared": mp.fsum(
            mp.log(p) / mp.sqrt(k) for k, p, _exponent in inventory
        ),
        "D_at_2a": mp.fsum(
            mp.log(p) / mp.sqrt(k) for k, p, _exponent in inventory
        )
        - 2 * (lam - 1),
    }
    return modes, inventory, {
        "normal_form_c_star_identity": c_identity,
        "normal_form_A_tail": tail,
        "normal_form_T_D_atoms": atoms,
        "normal_form_T_D_continuous": continuous,
        "normal_form_T_D_equals_atoms_minus_continuous": t_discrepancy,
        "normal_form_Q_equals_cI_plus_A_tail_minus_T_D": normal_q,
    }, scalars


def _max_abs(matrix: mp.matrix) -> mp.mpf:
    return max(abs(matrix[i, j]) for i in range(matrix.rows) for j in range(matrix.cols))


def _frobenius(matrix: mp.matrix) -> mp.mpf:
    return mp.sqrt(
        mp.fsum(abs(matrix[i, j]) ** 2 for i in range(matrix.rows) for j in range(matrix.cols))
    )


def _inversion(N: int) -> mp.matrix:
    dim = 2 * N + 1
    result = mp.matrix(dim)
    for i in range(dim):
        result[i, dim - 1 - i] = 1
    return result


def _parity_bases(N: int) -> tuple[mp.matrix, mp.matrix]:
    dim = 2 * N + 1
    even = mp.matrix(dim, N + 1)
    odd = mp.matrix(dim, N)
    even[N, 0] = 1
    root2 = mp.sqrt(2)
    for k in range(1, N + 1):
        even[N - k, k] = 1 / root2
        even[N + k, k] = 1 / root2
        odd[N - k, k - 1] = 1 / root2
        odd[N + k, k - 1] = -1 / root2
    return even, odd


def _serialize(value: mp.mpf, digits: int) -> str:
    return mp.nstr(value, digits)


def _serialize_matrix(matrix: mp.matrix, digits: int) -> list[list[str]]:
    return [
        [_serialize(matrix[i, j], digits) for j in range(matrix.cols)]
        for i in range(matrix.rows)
    ]


def produce(lambda_text: str = "2", N: int = 2, dps: int = 50) -> dict[str, Any]:
    """Produce a deterministic arbitrary-precision normal-form comparison."""

    lam_exact = _exact_lambda(lambda_text)
    N = _exact_integer(N, "N", 1)
    dps = _exact_integer(dps, "precision_decimal_digits", 30)
    with mp.workdps(dps):
        modes, inventory, normal, scalars = _normal_form_blocks(lambda_text, N, dps)
        source_modes, source_terms, pole, arch, prime, source_q = blocks_split(
            lambda_text, N, dps
        )
        if (
            source_modes != modes
            or [k for k, _weight in source_terms] != [k for k, _p, _e in inventory]
            or any(
                abs(weight - mp.log(p)) != 0
                for (_k, weight), (_same_k, p, _e) in zip(source_terms, inventory)
            )
        ):
            raise ValueError("independent prime-power inventory disagrees with locked source path")
        matrices = dict(normal)
        matrices.update(
            {
                "source_pole": pole,
                "source_archimedean_block_before_outer_minus": arch,
                "source_prime_block_before_outer_minus": prime,
                "source_Q_equals_pole_minus_arch_minus_prime": source_q,
            }
        )
        normal_q = normal["normal_form_Q_equals_cI_plus_A_tail_minus_T_D"]
        residual = normal_q - source_q
        matrices["combined_residual_before_absolute_values"] = residual
        J = _inversion(N)
        even, odd = _parity_bases(N)
        even_residual = even.T * residual * even
        odd_residual = odd.T * residual * odd
        norms = {
            name: {
                "max_abs": _serialize(_max_abs(matrix), dps),
                "frobenius": _serialize(_frobenius(matrix), dps),
            }
            for name, matrix in matrices.items()
        }
        pre_names = (
            "normal_form_c_star_identity",
            "normal_form_A_tail",
            "normal_form_T_D_atoms",
            "normal_form_T_D_continuous",
            "source_pole",
            "source_archimedean_block_before_outer_minus",
            "source_prime_block_before_outer_minus",
        )
        pre_scale = max(_max_abs(matrices[name]) for name in pre_names)
        residual_scale = _max_abs(residual)
        tol = mp.power(10, -max(15, dps // 2))
        square = lam_exact * lam_exact
        exact_inventory = [
            {
                "n": k,
                "prime": p,
                "exponent": exponent,
                "von_mangoldt": f"log({p})",
            }
            for k, p, exponent in inventory
        ]
        return {
            "schema": SCHEMA,
            "terminal_state": TERMINAL_STATE,
            "claim_scope": CLAIM_SCOPE,
            "input": {
                "lambda_decimal": lambda_text,
                "lambda_rational": {
                    "numerator": str(lam_exact.numerator),
                    "denominator": str(lam_exact.denominator),
                },
                "N": N,
                "precision_decimal_digits": dps,
            },
            "locked_conventions": LOCKED_CONVENTIONS,
            "locked_formulas": LOCKED_FORMULAS,
            "arithmetic": {
                "mode": "arbitrary-precision point arithmetic, not interval or ball arithmetic",
                "library": f"mpmath {mp.__version__}",
                "shared_library_with_verifier": True,
                "independent_formula_trees": True,
                "limitation": "producer and verifier share mpmath transcendental arithmetic",
            },
            "source_admissions": {
                "cached_matrix_read": False,
                "zeta_zero_table_read": False,
                "global_weil_positivity_assumed": False,
                "asymptotic_claim_made": False,
                "binary64_parameter_used": False,
            },
            "exact_prime_power_inventory": {
                "cutoff_rule": "floor(lambda^2), inclusive",
                "lambda_squared": {
                    "numerator": str(square.numerator),
                    "denominator": str(square.denominator),
                },
                "integer_cutoff": square.numerator // square.denominator,
                "endpoint_is_integer": square.denominator == 1,
                "terms": exact_inventory,
            },
            "transcendental_point_outputs": {
                name: _serialize(value, dps) for name, value in scalars.items()
            },
            "discrepancy_measure": {
                "atom_weights": [
                    {
                        "location_log_n": _serialize(mp.log(k), dps),
                        "weight_Lambda_over_sqrt_n": _serialize(mp.log(p) / mp.sqrt(k), dps),
                    }
                    for k, p, _exponent in inventory
                ],
                "continuous_density": "-exp(h/2) dh on [0,2*a]",
            },
            "raw_point_matrices": {
                name: _serialize_matrix(matrix, dps) for name, matrix in matrices.items()
            },
            "pre_cancellation_block_norms": norms,
            "cancellation_diagnostic": {
                "pre_cancellation_max_abs_scale": _serialize(pre_scale, dps),
                "combined_residual_max_abs": _serialize(residual_scale, dps),
                "pre_cancellation_to_residual_ratio": (
                    _serialize(pre_scale / residual_scale, dps)
                    if residual_scale != 0
                    else None
                ),
                "combined_residual_before_absolute_values": _serialize_matrix(residual, dps),
                "inversion_even_residual_before_absolute_values": _serialize_matrix(even_residual, dps),
                "inversion_odd_residual_before_absolute_values": _serialize_matrix(odd_residual, dps),
            },
            "checks": {
                "independent_prime_inventory_matches_locked_source": True,
                "normal_form_matches_locked_source_at_declared_point_precision": residual_scale <= tol,
                "normal_form_hermitian_defect_max_abs": _serialize(
                    _max_abs(normal_q - normal_q.T), dps
                ),
                "source_hermitian_defect_max_abs": _serialize(_max_abs(source_q - source_q.T), dps),
                "normal_form_inversion_commutator_max_abs": _serialize(
                    _max_abs(normal_q * J - J * normal_q), dps
                ),
                "source_inversion_commutator_max_abs": _serialize(
                    _max_abs(source_q * J - J * source_q), dps
                ),
                "even_sector_residual_max_abs": _serialize(_max_abs(even_residual), dps),
                "odd_sector_residual_max_abs": _serialize(_max_abs(odd_residual), dps),
                "finite_point_diagnostic_only": True,
            },
        }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda", dest="lambda_text", default="2")
    parser.add_argument("--N", type=int, default=2)
    parser.add_argument("--dps", type=int, default=50)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    payload = produce(args.lambda_text, args.N, args.dps)
    text = json.dumps(payload, indent=2, sort_keys=True) + "\n"
    if args.output is not None:
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
