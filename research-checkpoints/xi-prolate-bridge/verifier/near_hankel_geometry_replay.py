#!/usr/bin/env python3
"""Standalone point-valued replay of the near Hankel/Toeplitz geometry.

The direct path evaluates the source correlation in the centered logarithmic
coordinate, with the finite-window and outer profiles zero-extended there.
The comparison path independently changes to right-boundary coordinates and
assembles the Hankel and Toeplitz formulas in (2.4), (3.5), and
(3.10)--(3.13) of ``notes/NEAR_SIGNED_HANKEL_REDUCTION.md``.

No producer module, cached matrix, zero table, or positivity assertion is
used.  All integrations are point-valued ``mpmath`` quadratures, so this is a
high-precision identity regression rather than an interval certificate.
"""
from __future__ import annotations

import argparse
import json
from typing import Callable

import mpmath as mp


TERMINAL_STATE = "P0_INVALIDATED"
LOCKED_BOUNDARY_SIGN = -1
L_EXACT = "2"
X_EXACT = "1.25"
SAMPLE_X_EXACT = ("0.125", "0.375", "0.75", "1.125")


ScalarFunction = Callable[[mp.mpf], mp.mpc]


def require_precision(dps: int) -> int:
    """Accept only an exact integer precision large enough for nested replay."""
    if isinstance(dps, bool) or not isinstance(dps, int):
        raise TypeError("precision must be an exact integer, never binary64")
    if dps < 50:
        raise ValueError("at least 50 decimal digits are required")
    return dps


def require_boundary_sign(sign: int) -> int:
    """Fail closed if the endpoint sign in (3.13) is changed."""
    if isinstance(sign, bool) or not isinstance(sign, int):
        raise TypeError("projection boundary sign must be an exact integer")
    if sign != LOCKED_BOUNDARY_SIGN:
        raise ValueError("equation (3.13) requires the negative boundary sign")
    return sign


def _r(numerator: int, denominator: int = 1) -> mp.mpf:
    return mp.mpf(numerator) / denominator


def _z(
    real_numerator: int,
    real_denominator: int,
    imag_numerator: int,
    imag_denominator: int,
) -> mp.mpc:
    return mp.mpc(
        _r(real_numerator, real_denominator),
        _r(imag_numerator, imag_denominator),
    )


def finite_profile(t: mp.mpf, ell: mp.mpf, parity: int) -> mp.mpc:
    """Smooth deterministic finite-window profile before zero extension."""
    u = t / ell
    if parity == 1:
        return (
            _z(1, 1, 2, 7)
            + _z(3, 10, -1, 5) * u**2
            + _z(1, 9, 1, 11) * mp.cos(mp.pi * u)
        )
    if parity == -1:
        return (
            _z(2, 3, -1, 8) * u
            + _z(1, 5, 2, 13) * mp.sin(mp.pi * u / 2)
        )
    raise ValueError("parity must be +1 or -1")


def finite_profile_derivative(
    t: mp.mpf, ell: mp.mpf, parity: int
) -> mp.mpc:
    u = t / ell
    if parity == 1:
        return (
            2 * _z(3, 10, -1, 5) * u / ell
            - _z(1, 9, 1, 11)
            * mp.pi
            * mp.sin(mp.pi * u)
            / ell
        )
    if parity == -1:
        return (
            _z(2, 3, -1, 8) / ell
            + _z(1, 5, 2, 13)
            * mp.pi
            * mp.cos(mp.pi * u / 2)
            / (2 * ell)
        )
    raise ValueError("parity must be +1 or -1")


def outward_right_profile(t: mp.mpf) -> mp.mpc:
    """Smooth exponentially decaying profile at distance t from the right edge."""
    return mp.exp(-_r(7, 10) * t) * (
        _z(4, 5, 1, 6)
        + _z(2, 7, -1, 9) * t
        + _z(1, 8, 1, 10) * mp.cos(_r(3, 5) * t)
    )


def outward_right_profile_derivative(t: mp.mpf) -> mp.mpc:
    bracket = (
        _z(4, 5, 1, 6)
        + _z(2, 7, -1, 9) * t
        + _z(1, 8, 1, 10) * mp.cos(_r(3, 5) * t)
    )
    bracket_derivative = _z(2, 7, -1, 9) - _z(1, 8, 1, 10) * _r(
        3, 5
    ) * mp.sin(_r(3, 5) * t)
    return mp.exp(-_r(7, 10) * t) * (
        bracket_derivative - _r(7, 10) * bracket
    )


def projection_profile(t: mp.mpf, ell: mp.mpf, parity: int = 1) -> mp.mpc:
    """Smooth deterministic profile supported on the centered finite window."""
    u = t / ell
    if parity == 1:
        return (
            _z(7, 10, -1, 4)
            + _z(-2, 9, 1, 7) * u**2
            + _z(1, 6, 1, 12) * mp.cos(mp.pi * u)
        )
    if parity == -1:
        return (
            _z(3, 5, 1, 9) * u
            + _z(-1, 8, 2, 15) * mp.sin(mp.pi * u / 2)
        )
    raise ValueError("parity must be +1 or -1")


def projection_profile_derivative(
    t: mp.mpf, ell: mp.mpf, parity: int = 1
) -> mp.mpc:
    u = t / ell
    if parity == 1:
        return (
            2 * _z(-2, 9, 1, 7) * u / ell
            - _z(1, 6, 1, 12)
            * mp.pi
            * mp.sin(mp.pi * u)
            / ell
        )
    if parity == -1:
        return (
            _z(3, 5, 1, 9) / ell
            + _z(-1, 8, 2, 15)
            * mp.pi
            * mp.cos(mp.pi * u / 2)
            / (2 * ell)
        )
    raise ValueError("parity must be +1 or -1")


def signed_toy_kernel(x: mp.mpf) -> mp.mpf:
    """A smooth sign-changing kernel used only to replay the geometry."""
    return mp.exp(-_r(2, 5) * x) * (
        mp.cos(_r(11, 5) * x) - _r(1, 4)
    )


def _quad(function: Callable[[mp.mpf], mp.mpc], left: mp.mpf, right: mp.mpf):
    if left == right:
        return mp.mpc(0)
    # Every toy integrand is analytic on its stated closed interval.  The
    # Gauss--Legendre rule is therefore both deterministic and substantially
    # faster than repeatedly nesting tanh--sinh rules at high precision.
    return mp.quadgl(function, [left, right])


def _zero_extended_finite(
    t: mp.mpf, ell: mp.mpf, parity: int
) -> mp.mpc:
    if -ell <= t <= ell:
        return finite_profile(t, ell, parity)
    return mp.mpc(0)


def _zero_extended_outer(
    t: mp.mpf, ell: mp.mpf, parity: int
) -> mp.mpc:
    if t >= ell:
        return outward_right_profile(t - ell)
    if t <= -ell:
        return parity * outward_right_profile(-t - ell)
    return mp.mpc(0)


def direct_source_correlation(
    x: mp.mpf, L: mp.mpf, v_parity: int, outer_parity: int
) -> mp.mpc:
    """Evaluate (2.1) directly in t, before any boundary substitution."""
    if x < 0 or x > L:
        raise ValueError("geometry replay requires 0<=x<=L")
    ell = L / 2

    def integrand(t: mp.mpf) -> mp.mpc:
        return (
            mp.conj(_zero_extended_finite(t, ell, v_parity))
            * _zero_extended_outer(t + x, ell, outer_parity)
            + mp.conj(_zero_extended_finite(t + x, ell, v_parity))
            * _zero_extended_outer(t, ell, outer_parity)
        )

    # These are support breakpoints from the direct zero extensions.  The
    # identically-zero middle interval is retained deliberately: this path
    # never calls the boundary convolution used by the comparison assembly.
    points = (-ell - x, -ell, ell - x, ell)
    return mp.fsum(
        _quad(integrand, left, right)
        for left, right in zip(points[:-1], points[1:])
    )


def direct_source_correlation_derivative(
    x: mp.mpf, L: mp.mpf, v_parity: int, outer_parity: int
) -> mp.mpc:
    """Differentiate the two direct support-overlap integrals by Leibniz."""
    if x < 0 or x > L:
        raise ValueError("geometry replay requires 0<=x<=L")
    ell = L / 2
    first_boundary = (
        mp.conj(finite_profile(ell - x, ell, v_parity))
        * outward_right_profile(mp.mpf(0))
    )
    first_bulk = _quad(
        lambda t: mp.conj(finite_profile(t, ell, v_parity))
        * outward_right_profile_derivative(t + x - ell),
        ell - x,
        ell,
    )
    second_boundary = (
        mp.conj(finite_profile(-ell, ell, v_parity))
        * outer_parity
        * outward_right_profile(x)
    )
    second_bulk = _quad(
        lambda t: mp.conj(
            finite_profile_derivative(t + x, ell, v_parity)
        )
        * outer_parity
        * outward_right_profile(-t - ell),
        -ell - x,
        -ell,
    )
    return first_boundary + first_bulk + second_boundary + second_bulk


def boundary_hankel_correlation(
    x: mp.mpf, L: mp.mpf, v_parity: int, outer_parity: int
) -> mp.mpc:
    """Independently assemble the right-boundary convolution in (2.4)."""
    ell = L / 2
    parity_factor = 1 + v_parity * outer_parity
    return parity_factor * _quad(
        lambda s: mp.conj(finite_profile(ell - s, ell, v_parity))
        * outward_right_profile(x - s),
        mp.mpf(0),
        x,
    )


def _a(s: mp.mpf, L: mp.mpf, parity: int) -> mp.mpc:
    ell = L / 2
    return mp.exp(s / 2) * mp.conj(finite_profile(ell - s, ell, parity))


def _a_derivative(s: mp.mpf, L: mp.mpf, parity: int) -> mp.mpc:
    ell = L / 2
    A = finite_profile(ell - s, ell, parity)
    A_derivative = -finite_profile_derivative(ell - s, ell, parity)
    return mp.exp(s / 2) * (mp.conj(A_derivative) + mp.conj(A) / 2)


def _b(t: mp.mpf) -> mp.mpc:
    return mp.exp(t / 2) * outward_right_profile(t)


def direct_outer_signed_integral(
    L: mp.mpf, X: mp.mpf, parity: int
) -> mp.mpc:
    """Direct t-coordinate evaluation of I_X on an equal-parity pair."""
    return _quad(
        lambda x: signed_toy_kernel(x)
        * mp.exp(x / 2)
        * (
            direct_source_correlation_derivative(x, L, parity, parity)
            - direct_source_correlation(x, L, parity, parity) / 2
        ),
        mp.mpf(0),
        X,
    )


def hankel_formula_3_5(L: mp.mpf, X: mp.mpf, parity: int) -> mp.mpc:
    """Independently assemble the boundary term and H_delta bulk in (3.5)."""
    boundary = 2 * _a(mp.mpf(0), L, parity) * _quad(
        lambda t: signed_toy_kernel(t) * _b(t), mp.mpf(0), X
    )

    def hankel_action(s: mp.mpf) -> mp.mpc:
        return _quad(
            lambda t: signed_toy_kernel(s + t) * _b(t),
            mp.mpf(0),
            X - s,
        )

    bulk = 2 * _quad(
        lambda s: (_a_derivative(s, L, parity) - _a(s, L, parity))
        * hankel_action(s),
        mp.mpf(0),
        X,
    )
    return boundary + bulk


def _zero_extended_projection(
    t: mp.mpf, ell: mp.mpf, parity: int
) -> mp.mpc:
    if -ell <= t <= ell:
        return projection_profile(t, ell, parity)
    return mp.mpc(0)


def direct_projection_correlation(
    x: mp.mpf, L: mp.mpf, parity: int
) -> mp.mpc:
    """Evaluate (2.1) directly for two profiles supported inside I."""
    if x < 0 or x > L:
        raise ValueError("geometry replay requires 0<=x<=L")
    ell = L / 2

    def integrand(t: mp.mpf) -> mp.mpc:
        return (
            mp.conj(_zero_extended_finite(t, ell, parity))
            * _zero_extended_projection(t + x, ell, parity)
            + mp.conj(_zero_extended_finite(t + x, ell, parity))
            * _zero_extended_projection(t, ell, parity)
        )

    return _quad(integrand, -ell, ell - x)


def direct_projection_correlation_derivative(
    x: mp.mpf, L: mp.mpf, parity: int
) -> mp.mpc:
    """Leibniz derivative of the direct centered projection correlation."""
    if x < 0 or x > L:
        raise ValueError("geometry replay requires 0<=x<=L")
    ell = L / 2
    upper = ell - x
    boundary = -(
        mp.conj(finite_profile(upper, ell, parity))
        * projection_profile(ell, ell, parity)
        + mp.conj(finite_profile(ell, ell, parity))
        * projection_profile(upper, ell, parity)
    )
    bulk = _quad(
        lambda t: (
            mp.conj(finite_profile(t, ell, parity))
            * projection_profile_derivative(t + x, ell, parity)
            + mp.conj(finite_profile_derivative(t + x, ell, parity))
            * projection_profile(t, ell, parity)
        ),
        -ell,
        upper,
    )
    return boundary + bulk


def projection_formula_3_10(
    x: mp.mpf, L: mp.mpf, parity: int
) -> mp.mpc:
    """Assemble the unweighted right-boundary Toeplitz correlation (3.10)."""
    ell = L / 2
    return 2 * _quad(
        lambda s: mp.conj(finite_profile(ell - s, ell, parity))
        * projection_profile(ell - (s - x), ell, parity),
        x,
        L,
    )


def _c(s: mp.mpf, L: mp.mpf, parity: int) -> mp.mpc:
    ell = L / 2
    return mp.exp(-s / 2) * projection_profile(ell - s, ell, parity)


def projection_formula_3_11(
    x: mp.mpf, L: mp.mpf, parity: int
) -> mp.mpc:
    """Assemble the weighted truncated Toeplitz formula (3.11)."""
    return 2 * _quad(
        lambda y: _a(y + x, L, parity) * _c(y, L, parity),
        mp.mpf(0),
        L - x,
    )


def direct_projection_signed_integral(
    L: mp.mpf, X: mp.mpf, parity: int
) -> mp.mpc:
    """Direct centered-coordinate evaluation of the projection I_X."""
    return _quad(
        lambda x: signed_toy_kernel(x)
        * mp.exp(x / 2)
        * (
            direct_projection_correlation_derivative(x, L, parity)
            - direct_projection_correlation(x, L, parity) / 2
        ),
        mp.mpf(0),
        X,
    )


def projection_formula_3_13(
    L: mp.mpf,
    X: mp.mpf,
    parity: int,
    *,
    boundary_sign: int = LOCKED_BOUNDARY_SIGN,
    enforce_sign: bool = True,
) -> mp.mpc:
    """Assemble (3.13); an internal opt-out supports the sign regression."""
    if enforce_sign:
        require_boundary_sign(boundary_sign)
    elif boundary_sign not in (-1, 1):
        raise ValueError("diagnostic boundary sign must be +1 or -1")

    boundary_integral = _quad(
        lambda x: signed_toy_kernel(x) * _c(L - x, L, parity),
        mp.mpf(0),
        X,
    )
    boundary = 2 * boundary_sign * _a(L, L, parity) * boundary_integral

    def toeplitz_action(s: mp.mpf) -> mp.mpc:
        return _quad(
            lambda x: signed_toy_kernel(x) * _c(s - x, L, parity),
            mp.mpf(0),
            min(X, s),
        )

    # Split at s=X because min(X,s) changes there.  This also prevents a
    # nested quadrature from straddling the only nonsmooth integration limit.
    bulk_integrand = lambda s: (
        (_a_derivative(s, L, parity) - _a(s, L, parity))
        * toeplitz_action(s)
    )
    bulk = 2 * (
        _quad(bulk_integrand, mp.mpf(0), X)
        + _quad(bulk_integrand, X, L)
    )
    return boundary + bulk


def replay(dps: int = 70) -> dict[str, object]:
    """Run every direct/comparison identity and serialize numerical defects."""
    dps = require_precision(dps)
    require_boundary_sign(LOCKED_BOUNDARY_SIGN)
    with mp.workdps(dps):
        L = mp.mpf(L_EXACT)
        X = mp.mpf(X_EXACT)
        sample_x = [mp.mpf(value) for value in SAMPLE_X_EXACT]

        same_parity_defects: dict[str, mp.mpf] = {}
        for parity, name in ((1, "even_even"), (-1, "odd_odd")):
            same_parity_defects[name] = max(
                abs(
                    direct_source_correlation(x, L, parity, parity)
                    - boundary_hankel_correlation(x, L, parity, parity)
                )
                for x in sample_x
            )

        opposite_parity_defects: dict[str, mp.mpf] = {}
        for v_parity, outer_parity, name in (
            (1, -1, "even_odd"),
            (-1, 1, "odd_even"),
        ):
            opposite_parity_defects[name] = max(
                abs(direct_source_correlation(x, L, v_parity, outer_parity))
                for x in sample_x
            )

        direct_outer = direct_outer_signed_integral(L, X, 1)
        formula_outer = hankel_formula_3_5(L, X, 1)
        outer_signed_defect = abs(direct_outer - formula_outer)

        projection_310_defect = max(
            abs(
                direct_projection_correlation(x, L, 1)
                - projection_formula_3_10(x, L, 1)
            )
            for x in sample_x
        )
        projection_311_defect = max(
            abs(
                mp.exp(x / 2) * direct_projection_correlation(x, L, 1)
                - projection_formula_3_11(x, L, 1)
            )
            for x in sample_x
        )
        direct_projection = direct_projection_signed_integral(L, X, 1)
        formula_projection = projection_formula_3_13(L, X, 1)
        projection_signed_defect = abs(direct_projection - formula_projection)

        wrong_plus_formula = projection_formula_3_13(
            L,
            X,
            1,
            boundary_sign=1,
            enforce_sign=False,
        )
        wrong_plus_boundary_defect = abs(direct_projection - wrong_plus_formula)
        boundary_term_magnitude = abs(
            2
            * _a(L, L, 1)
            * _quad(
                lambda x: signed_toy_kernel(x) * _c(L - x, L, 1),
                mp.mpf(0),
                X,
            )
        )

        all_exact_defects = list(same_parity_defects.values()) + list(
            opposite_parity_defects.values()
        ) + [
            outer_signed_defect,
            projection_310_defect,
            projection_311_defect,
            projection_signed_defect,
        ]
        tolerance = mp.power(10, -(dps // 2))
        agrees = (
            max(all_exact_defects) <= tolerance
            and boundary_term_magnitude > 1000 * tolerance
            and wrong_plus_boundary_defect > 1000 * tolerance
        )

        def number(value: mp.mpf | mp.mpc) -> str:
            return mp.nstr(value, dps)

        return {
            "terminal_state": TERMINAL_STATE,
            "claim_class": "EXACT_NEAR_HANKEL_GEOMETRY_POINT_REPLAY",
            "signed_lower_bound_claim": False,
            "equation_5_2_claim": False,
            "inputs": {
                "L_exact_decimal": L_EXACT,
                "X_exact_decimal": X_EXACT,
                "sample_x_exact_decimals": list(SAMPLE_X_EXACT),
                "precision_decimal_digits": dps,
                "arithmetic_library": f"mpmath {mp.__version__}",
                "coordinate": "centered logarithmic t in [-L/2,L/2]",
                "measure": "Lebesgue dt with zero extension",
            },
            "profile_contract": {
                "finite_profiles": "deterministic analytic even and odd profiles on the closed window",
                "outer_profile": "deterministic analytic exponentially decaying right-boundary profile, parity-reflected on the left",
                "projection_profile": "deterministic analytic even profile on the closed window",
                "signed_kernel": "exp(-2*x/5)*(cos(11*x/5)-1/4)",
                "signed_kernel_is_arithmetic_delta_star": False,
            },
            "formulas_replayed": {
                "source_correlation": "integral_R(conj(v(t))*R(t+x)+conj(v(t+x))*R(t))dt",
                "boundary_hankel": "(1+eps_v*eps_R)*integral_0^x conj(A(s))*B(x-s)ds",
                "equation_3_5": "2*a(0)*integral_0^X delta(t)b(t)dt+2*integral_0^X(a'(s)-a(s))*H_delta_X(b)(s)ds",
                "equation_3_10": "2*integral_x^L conj(A(s))*C(s-x)ds",
                "equation_3_11": "2*integral_0^(L-x) a(y+x)c(y)dy",
                "equation_3_13_boundary": "-2*a(L)*integral_0^X delta(x)c(L-x)dx",
                "equation_3_13_bulk": "2*integral_0^L(a'(s)-a(s))*T_delta_X(c)(s)ds",
            },
            "defects": {
                "source_vs_boundary_hankel_same_parity": {
                    key: number(value)
                    for key, value in same_parity_defects.items()
                },
                "opposite_parity_direct_correlation": {
                    key: number(value)
                    for key, value in opposite_parity_defects.items()
                },
                "direct_signed_integral_vs_equation_3_5": number(
                    outer_signed_defect
                ),
                "direct_projection_correlation_vs_equation_3_10": number(
                    projection_310_defect
                ),
                "weighted_projection_correlation_vs_equation_3_11": number(
                    projection_311_defect
                ),
                "direct_projection_signed_integral_vs_equation_3_13": number(
                    projection_signed_defect
                ),
            },
            "projection_boundary_sign_regression": {
                "required_sign": "minus",
                "correct_sign_integer": LOCKED_BOUNDARY_SIGN,
                "correct_formula_defect": number(projection_signed_defect),
                "boundary_term_magnitude": number(boundary_term_magnitude),
                "wrong_plus_sign_defect": number(wrong_plus_boundary_defect),
                "plus_sign_rejected_by_public_contract": True,
            },
            "direct_values": {
                "outer_signed_integral": number(direct_outer),
                "equation_3_5_value": number(formula_outer),
                "projection_signed_integral": number(direct_projection),
                "equation_3_13_value": number(formula_projection),
            },
            "tolerance": number(tolerance),
            "producer_modules_imported": False,
            "replay_agrees": bool(agrees),
            "limitations": [
                "point-valued mpmath quadrature without interval or ball enclosures",
                "both paths share mpmath transcendental arithmetic and deterministic toy-profile evaluators",
                "the smooth signed toy kernel isolates geometry and is not the arithmetic Chebyshev kernel delta_star",
                "finite-window identity regression only; no norm estimate, signed sector floor, equation (5.2), determinant convergence, or RH claim",
            ],
        }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dps", type=int, default=70)
    parser.add_argument("--output", type=str)
    args = parser.parse_args()
    result = replay(args.dps)
    text = json.dumps(result, indent=2) + "\n"
    if args.output:
        from pathlib import Path

        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(text, encoding="utf-8")
    print(text, end="")
    if result["replay_agrees"] is not True:
        raise SystemExit(1)


__all__ = [
    "LOCKED_BOUNDARY_SIGN",
    "L_EXACT",
    "SAMPLE_X_EXACT",
    "TERMINAL_STATE",
    "X_EXACT",
    "boundary_hankel_correlation",
    "direct_outer_signed_integral",
    "direct_projection_correlation",
    "direct_projection_signed_integral",
    "direct_source_correlation",
    "hankel_formula_3_5",
    "projection_formula_3_10",
    "projection_formula_3_11",
    "projection_formula_3_13",
    "replay",
    "require_boundary_sign",
    "require_precision",
]


if __name__ == "__main__":
    main()
