#!/usr/bin/env python3
"""Finite boundary-discrepancy convolution diagnostic.

This producer evaluates the exact checkpoint-0.52 weak identity for the
deterministic ``lambda=2, N=2`` pilot.  It reads no cached matrix or zeta-zero
table and makes no asymptotic claim.  The independent verifier reconstructs
the source matrix and convolution through a different formula tree.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import json
import math
from pathlib import Path
import re
from typing import Any, Callable

import mpmath as mp

from weil_matrix import blocks_split


SCHEMA = "xi-prolate-boundary-discrepancy-convolution-v1"
CHECKPOINT_VERSION = "0.52.0-boundary-discrepancy-convolution-reduction"
TERMINAL_STATE = "P0_INVALIDATED"
_DECIMAL = re.compile(r"^(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$")

CLAIM_SCOPE = {
    "proved_here": [
        "the exact finite boundary formula for the pole-deleted multiplier on the constant mode",
        "the exact weak compressed-ground boundary identity",
        "the exact one-sided reserve-window equivalence under its stated sign hypotheses",
        "the completed-xi ordinary-Laplace identity in Re(s)>1/2",
    ],
    "not_proved_here": [
        "the required uniform one-sided shrinking-window localization",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "either complementary sector floor",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

LOCKED_CONVENTIONS = {
    "physical_interval": "I=[-a,a], a=log(lambda), L=2*a, with Lebesgue measure",
    "zero_extension": "every translated function is zero outside I",
    "fourier_transform": "hat(f)(t)=integral_I f(x)*exp(-i*t*x) dx",
    "fourier_basis": "V_n(x)=(-1)^n*L^(-1/2)*exp(+2*pi*i*n*x/L), -N<=n<=N",
    "inversion": "J*f(x)=f(-x), equivalently J*V_n=V_-n; no inversion-even ground is assumed before compression",
    "prime_power_endpoint": "inclusive 1<n<=lambda^2",
    "prime_block_sign": "minus in Q=pole-archimedean-prime, as in source equation (3.19)",
    "discrepancy_sign": "F=D-H0 and dD=sum Lambda(n)/sqrt(n)*delta_log(n)-exp(t/2)dt",
    "lambda_scale": "a=log(lambda), L=2*log(lambda), exp(L)=lambda^2",
    "parameter_ingestion": "decimal source parameters are parsed as text and never through binary64",
}

LOCKED_FORMULAS = {
    "weighted_sum": "W(exp(t))=sum_(1<n<=exp(t)) Lambda(n)/sqrt(n)",
    "D": "D(t)=W(exp(t))-2*(exp(t/2)-1)",
    "rho": "rho(t)=exp(-t/2)/(1-exp(-2*t))",
    "H0": "H0(t)=integral_t^infinity rho(u)du=(1/2)log((1+exp(-t/2))/(1-exp(-t/2)))+atan(exp(-t/2))",
    "F": "F(t)=D(t)-H0(t)",
    "A1_source": "A1(y)=H0(a-y)+H0(a+y)+2W(lambda^2)-W(lambda*exp(-y))-W(lambda*exp(y))",
    "A1_boundary": "A1(y)=4*lambda+2D(L)-4*sqrt(lambda)*cosh(y/2)-F(a-y)-F(a+y) a.e.",
    "signed_convolution": "C_lambda(x)=2*X^(-1)*integral_0^L F(t)*x(a-t)dt",
    "weak_identity": "C_lambda(x)+epsilon-c_star=-4*h/(sqrt(lambda)*X)",
    "reserve_window": "h/X<=B iff c_star-epsilon-4B/sqrt(lambda)<=C_lambda(x)<c_star-epsilon, assuming X!=0 and h/X>0",
    "c_star": "c_star=psi(1/4)-log(pi)+4",
    "laplace": "L(F-c_star/2)(s)=s^(-1)*(-xi'/xi(1/2+s)+1/(1/2+s)-2), Re(s)>1/2",
}


def _exact_decimal(text: Any, label: str, *, greater_than_one: bool = False) -> Fraction:
    if not isinstance(text, str):
        raise TypeError(f"{label} must be an exact decimal string; binary64 is forbidden")
    if _DECIMAL.fullmatch(text) is None:
        raise ValueError(f"{label} must be a canonical nonnegative decimal string")
    value = Fraction(text)
    if greater_than_one and value <= 1:
        raise ValueError(f"{label} must be greater than one")
    return value


def _exact_integer(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer; binary64 is forbidden")
    if value < minimum:
        raise ValueError(f"{label} must be at least {minimum}")
    return value


def prime_power_inventory(lambda_text: str) -> list[tuple[int, int, int]]:
    """Return every prime power through the exact inclusive cutoff."""

    lam = _exact_decimal(lambda_text, "lambda", greater_than_one=True)
    square = lam * lam
    cutoff = square.numerator // square.denominator
    sieve = [True] * (cutoff + 1)
    if cutoff >= 0:
        sieve[0] = False
    if cutoff >= 1:
        sieve[1] = False
    for p in range(2, math.isqrt(cutoff) + 1):
        if sieve[p]:
            for composite in range(p * p, cutoff + 1, p):
                sieve[composite] = False
    result: list[tuple[int, int, int]] = []
    for prime in range(2, cutoff + 1):
        if not sieve[prime]:
            continue
        power = prime
        exponent = 1
        while power <= cutoff:
            result.append((power, prime, exponent))
            if power > cutoff // prime:
                break
            power *= prime
            exponent += 1
    return sorted(result)


def _even_basis(N: int) -> mp.matrix:
    dim = 2 * N + 1
    basis = mp.matrix(dim, N + 1)
    basis[N, 0] = 1
    root2 = mp.sqrt(2)
    for n in range(1, N + 1):
        basis[N - n, n] = basis[N + n, n] = 1 / root2
    return basis


def _inversion(N: int) -> mp.matrix:
    dim = 2 * N + 1
    result = mp.matrix(dim)
    for index in range(dim):
        result[index, dim - 1 - index] = 1
    return result


def _max_abs(matrix: mp.matrix) -> mp.mpf:
    return max(abs(matrix[i, j]) for i in range(matrix.rows) for j in range(matrix.cols))


def _vector_max_abs(vector: mp.matrix) -> mp.mpf:
    return max(abs(vector[index]) for index in range(vector.rows))


def _x_at_boundary_distance(
    t: mp.mpf, coefficients: mp.matrix, N: int, L: mp.mpf
) -> mp.mpf:
    return (
        coefficients[N]
        + 2
        * mp.fsum(
            coefficients[N + n] * mp.cos(2 * mp.pi * n * t / L)
            for n in range(1, N + 1)
        )
    ) / mp.sqrt(L)


def _H0(t: mp.mpf) -> mp.mpf:
    delta = mp.expm1(-t / 2)
    r = 1 + delta
    return mp.log((2 + delta) / (-delta)) / 2 + mp.atan(r)


def _rho(t: mp.mpf) -> mp.mpf:
    return mp.exp(-t / 2) / (-mp.expm1(-2 * t))


def _regularized_first_interval(
    integrand: Callable[[mp.mpf], mp.mpf], endpoint: mp.mpf
) -> mp.mpf:
    root = mp.sqrt(endpoint)

    def transformed(u: mp.mpf) -> mp.mpf:
        if not u:
            return mp.mpf(0)
        return 2 * u * integrand(u * u)

    return mp.quad(transformed, [0, root])


def _split_integral(
    intervals: list[mp.mpf], integrand_for_interval: Callable[[mp.mpf, mp.mpf], mp.mpf]
) -> mp.mpf:
    pieces: list[mp.mpf] = []
    for index, (left, right) in enumerate(zip(intervals[:-1], intervals[1:])):
        midpoint = (left + right) / 2
        function = lambda t, midpoint=midpoint: integrand_for_interval(t, midpoint)
        if index == 0 and left == 0:
            pieces.append(_regularized_first_interval(function, right))
        else:
            pieces.append(mp.quad(function, [left, right]))
    return mp.fsum(pieces)


def _completed_xi(z: mp.mpf) -> mp.mpf:
    return (
        mp.mpf(1)
        / 2
        * z
        * (z - 1)
        * mp.power(mp.pi, -z / 2)
        * mp.gamma(z / 2)
        * mp.zeta(z)
    )


def _laplace_check(s: mp.mpf, c_star: mp.mpf) -> dict[str, mp.mpf]:
    if s <= mp.mpf(1) / 2:
        raise ValueError("ordinary-Laplace samples require Re(s)>1/2")
    z = s + mp.mpf(1) / 2
    zeta_log_derivative = mp.diff(mp.zeta, z) / mp.zeta(z)
    laplace_D = -zeta_log_derivative / s - 2 / (s - mp.mpf(1) / 2) + 2 / s
    laplace_H0 = (
        mp.digamma(z / 2) - mp.digamma(mp.mpf(1) / 4)
    ) / (2 * s)
    lhs = laplace_D - laplace_H0 - c_star / (2 * s)
    xi_log_derivative = mp.diff(_completed_xi, z) / _completed_xi(z)
    rhs = (-xi_log_derivative + 1 / z - 2) / s
    return {
        "s": s,
        "z": z,
        "laplace_D": laplace_D,
        "laplace_H0": laplace_H0,
        "lhs": lhs,
        "xi_log_derivative": xi_log_derivative,
        "rhs": rhs,
        "signed_residual": lhs - rhs,
    }


def _serialize(value: mp.mpf, digits: int) -> str:
    return mp.nstr(value, digits)


def _serialize_vector(vector: mp.matrix, digits: int) -> list[str]:
    return [_serialize(vector[index], digits) for index in range(vector.rows)]


def _serialize_matrix(matrix: mp.matrix, digits: int) -> list[list[str]]:
    return [
        [_serialize(matrix[i, j], digits) for j in range(matrix.cols)]
        for i in range(matrix.rows)
    ]


def _serialize_mapping(values: dict[str, mp.mpf], digits: int) -> dict[str, str]:
    return {key: _serialize(value, digits) for key, value in values.items()}


def produce(
    lambda_text: str = "2", N: int = 2, dps: int = 80, B_text: str = "2"
) -> dict[str, Any]:
    """Produce the locked deterministic point-arithmetic pilot."""

    lam_exact = _exact_decimal(lambda_text, "lambda", greater_than_one=True)
    _exact_decimal(B_text, "reserve bound B")
    N = _exact_integer(N, "N", 1)
    dps = _exact_integer(dps, "precision_decimal_digits", 40)
    if lambda_text != "2" or N != 2 or B_text != "2":
        raise ValueError(
            "the checkpoint-0.52 locked pilot requires lambda='2', N=2, and B='2'"
        )

    with mp.workdps(dps):
        lam = mp.mpf(lambda_text)
        B = mp.mpf(B_text)
        a = mp.log(lam)
        L = 2 * a
        inventory = prime_power_inventory(lambda_text)
        modes, source_terms, pole, arch, prime, Q = blocks_split(lambda_text, N, dps)
        if [n for n, _weight in source_terms] != [n for n, _p, _e in inventory]:
            raise ValueError("producer prime inventories disagree")
        for (_n, weight), (_same_n, p, _e) in zip(source_terms, inventory):
            if weight != mp.log(p):
                raise ValueError("producer von Mangoldt weights disagree")

        W = mp.fsum(mp.log(p) / mp.sqrt(n) for n, p, _e in inventory)
        D_L = W - 2 * mp.expm1(L / 2)
        c_star = mp.digamma(mp.mpf(1) / 4) - mp.log(mp.pi) + 4
        m0 = mp.digamma(mp.mpf(1) / 4) - mp.log(mp.pi) - 2 * W
        A = Q - pole - m0 * mp.eye(2 * N + 1)

        even = _even_basis(N)
        Q_even = even.T * Q * even
        eigenvalues, eigenvectors = mp.eigsy(Q_even)
        even_coefficients = eigenvectors[:, 0]
        coefficients = even * even_coefficients
        if coefficients[N] < 0:
            coefficients = -coefficients
            even_coefficients = -even_coefficients
        epsilon = eigenvalues[0]
        eigen_residual = Q * coefficients - epsilon * coefficients
        X = mp.sqrt(L) * coefficients[N]
        if X == 0:
            raise ValueError("the finite pilot has zero ground integral")
        h = mp.fsum(
            coefficients[index]
            * mp.sinh(a / 2)
            / (mp.sqrt(L) * (mp.mpf(1) / 4 + (2 * mp.pi * n / L) ** 2))
            for index, n in enumerate(modes)
        )
        h_over_X = h / X

        breakpoints = [mp.mpf(0)]
        breakpoints.extend(
            mp.log(n) for n, _p, _e in inventory if mp.log(n) < L
        )
        breakpoints.append(L)
        breakpoints = sorted(set(breakpoints))

        def weighted_sum_at(midpoint: mp.mpf) -> mp.mpf:
            return mp.fsum(
                mp.log(p) / mp.sqrt(n)
                for n, p, _e in inventory
                if mp.log(n) <= midpoint
            )

        def x_boundary(t: mp.mpf) -> mp.mpf:
            return _x_at_boundary_distance(t, coefficients, N, L)

        D_integral = _split_integral(
            breakpoints,
            lambda t, midpoint: (
                weighted_sum_at(midpoint) - 2 * mp.expm1(t / 2)
            )
            * x_boundary(t),
        )
        H0_integral = _split_integral(
            breakpoints, lambda t, _midpoint: _H0(t) * x_boundary(t)
        )
        F_integral = _split_integral(
            breakpoints,
            lambda t, midpoint: (
                weighted_sum_at(midpoint)
                - 2 * mp.expm1(t / 2)
                - _H0(t)
            )
            * x_boundary(t),
        )
        decomposition_residual = F_integral - (D_integral - H0_integral)
        C_lambda = 2 * F_integral / X

        one = mp.matrix(2 * N + 1, 1)
        one[N] = mp.sqrt(L)
        weak_matrix = (one.T * A * coefficients)[0] / X
        weak_boundary = (
            4 * lam + 2 * D_L - 4 * mp.sqrt(lam) * h_over_X - C_lambda
        )
        weak_residual = weak_boundary - weak_matrix
        identity_left = C_lambda + epsilon - c_star
        identity_residual = identity_left + 4 * h_over_X / mp.sqrt(lam)

        lower = c_star - epsilon - 4 * B / mp.sqrt(lam)
        upper = c_star - epsilon
        ratio_bound = h_over_X > 0 and h_over_X <= B
        strict_upper = C_lambda < upper
        window = lower <= C_lambda and strict_upper

        h0_samples: list[dict[str, Any]] = []
        for label, t in (
            ("a_over_2", a / 2),
            ("a", a),
            ("L", L),
        ):
            closed = _H0(t)
            direct = mp.quad(_rho, [t, L, mp.inf]) if t < L else mp.quad(_rho, [t, mp.inf])
            h0_samples.append(
                {
                    "label": label,
                    "t": _serialize(t, dps),
                    "closed": _serialize(closed, dps),
                    "direct_tail": _serialize(direct, dps),
                    "signed_residual": _serialize(closed - direct, dps),
                }
            )

        laplace_samples = []
        for s in (mp.mpf("1"), mp.mpf("1.5")):
            sample = _laplace_check(s, c_star)
            laplace_samples.append(_serialize_mapping(sample, dps))

        J = _inversion(N)
        tol = mp.power(10, -max(20, dps // 2))
        square = lam_exact * lam_exact
        return {
            "schema": SCHEMA,
            "terminal_state": TERMINAL_STATE,
            "checkpoint_version": CHECKPOINT_VERSION,
            "claim_scope": CLAIM_SCOPE,
            "input": {
                "lambda_decimal": lambda_text,
                "lambda_rational": {
                    "numerator": str(lam_exact.numerator),
                    "denominator": str(lam_exact.denominator),
                },
                "N": N,
                "precision_decimal_digits": dps,
                "reserve_bound_B_decimal": B_text,
            },
            "locked_conventions": LOCKED_CONVENTIONS,
            "locked_formulas": LOCKED_FORMULAS,
            "arithmetic": {
                "mode": "arbitrary-precision point arithmetic, not interval or ball arithmetic",
                "library": f"mpmath {mp.__version__}",
                "shared_library_with_verifier": True,
                "independent_formula_trees": True,
                "limitation": "producer and verifier share mpmath transcendental arithmetic and eigsy",
            },
            "source_admissions": {
                "cached_matrix_read": False,
                "zeta_zero_table_read": False,
                "global_weil_positivity_assumed": False,
                "asymptotic_claim_made": False,
                "binary64_parameter_used": False,
                "environment_secret_read": False,
            },
            "exact_prime_power_inventory": {
                "cutoff_rule": "floor(lambda^2), inclusive",
                "lambda_squared": {
                    "numerator": str(square.numerator),
                    "denominator": str(square.denominator),
                },
                "integer_cutoff": square.numerator // square.denominator,
                "endpoint_is_integer": square.denominator == 1,
                "terms": [
                    {
                        "n": n,
                        "prime": p,
                        "exponent": exponent,
                        "von_mangoldt": f"log({p})",
                    }
                    for n, p, exponent in inventory
                ],
            },
            "transcendental_point_outputs": _serialize_mapping(
                {
                    "a": a,
                    "L": L,
                    "c_star": c_star,
                    "W_lambda_squared": W,
                    "D_at_L": D_L,
                    "m_lambda_0": m0,
                },
                dps,
            ),
            "raw_point_matrices": {
                "source_pole": _serialize_matrix(pole, dps),
                "source_archimedean_before_outer_minus": _serialize_matrix(arch, dps),
                "source_prime_before_outer_minus": _serialize_matrix(prime, dps),
                "source_Q_equals_pole_minus_arch_minus_prime": _serialize_matrix(Q, dps),
                "pole_deleted_A": _serialize_matrix(A, dps),
                "Q_even": _serialize_matrix(Q_even, dps),
            },
            "even_ground": {
                "epsilon": _serialize(epsilon, dps),
                "full_coefficients": _serialize_vector(coefficients, dps),
                "even_coefficients": _serialize_vector(even_coefficients, dps),
                "eigen_residual_before_absolute_values": _serialize_vector(eigen_residual, dps),
                "X": _serialize(X, dps),
                "h": _serialize(h, dps),
                "h_over_X": _serialize(h_over_X, dps),
            },
            "boundary_decomposition": {
                "atom_tail_integral": _serialize(
                    mp.fsum(
                        mp.log(p)
                        / mp.sqrt(n)
                        * mp.quad(x_boundary, [mp.log(n), L])
                        for n, p, _e in inventory
                        if mp.log(n) < L
                    ),
                    dps,
                ),
                "continuous_main_integral": _serialize(
                    2 * mp.quad(lambda t: mp.expm1(t / 2) * x_boundary(t), [0, L]),
                    dps,
                ),
                "D_integral": _serialize(D_integral, dps),
                "H0_direct_integral": _serialize(H0_integral, dps),
                "F_integral": _serialize(F_integral, dps),
                "decomposed_F_integral": _serialize(D_integral - H0_integral, dps),
                "decomposition_signed_residual": _serialize(decomposition_residual, dps),
                "C_lambda": _serialize(C_lambda, dps),
                "D_at_L": _serialize(D_L, dps),
                "x_at_a": _serialize(x_boundary(mp.mpf(0)), dps),
            },
            "weak_identity": {
                "A1_matrix_pairing_over_X": _serialize(weak_matrix, dps),
                "A1_boundary_pairing_over_X": _serialize(weak_boundary, dps),
                "signed_residual": _serialize(weak_residual, dps),
                "C_plus_epsilon_minus_c_star": _serialize(identity_left, dps),
                "identity_signed_residual": _serialize(identity_residual, dps),
            },
            "reserve_window": {
                "B": B_text,
                "lower": _serialize(lower, dps),
                "C_lambda": _serialize(C_lambda, dps),
                "upper": _serialize(upper, dps),
                "ratio_bound_holds": bool(ratio_bound),
                "strict_upper_holds": bool(strict_upper),
                "equivalence_holds": bool(ratio_bound == window),
            },
            "archimedean_tail_samples": h0_samples,
            "laplace_checks": laplace_samples,
            "checks": {
                "source_hermitian_defect_max_abs": _serialize(_max_abs(Q - Q.T), dps),
                "source_inversion_commutator_max_abs": _serialize(_max_abs(Q * J - J * Q), dps),
                "even_ground_eigen_residual_max_abs": _serialize(_vector_max_abs(eigen_residual), dps),
                "boundary_decomposition_matches": bool(abs(decomposition_residual) <= tol),
                "weak_boundary_identity_matches": bool(abs(weak_residual) <= tol),
                "central_identity_matches": bool(abs(identity_residual) <= tol),
                "h_over_X_positive_for_this_pilot": bool(h_over_X > 0),
                "finite_point_diagnostic_only": True,
            },
        }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda", dest="lambda_text", default="2")
    parser.add_argument("--N", type=int, default=2)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--reserve-bound-B", dest="B_text", default="2")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    payload = produce(args.lambda_text, args.N, args.dps, args.B_text)
    text = json.dumps(payload, indent=2, sort_keys=True) + "\n"
    if args.output is not None:
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
