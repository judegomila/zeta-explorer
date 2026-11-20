#!/usr/bin/env python3
"""Exact replay audit for the fourth real Pick stage, 9 November 2026.

This script checks symbolic identities and rational bounds used in
theta_fourth_pick_schwarzian_20261109.md and
theta_fourth_stage_proof_20261109.md. It uses no floating-point grid.
Published finite-zero verification and the prior three-node theorem are
explicit external inputs; this audit does not rerun or replace them.

Run with Python 3 and SymPy installed. Successful execution emits one
compact, deterministic JSON object; a failed check raises AssertionError.
"""

from fractions import Fraction as Q
import json

import sympy as sp


CHECKS = {}


def require(name, condition):
    """Record a check, without relying on Python's optional assert mode."""
    if name in CHECKS:
        raise AssertionError(f"duplicate check: {name}")
    if not bool(condition):
        raise AssertionError(name)
    CHECKS[name] = True


def zero(name, expression):
    residual = sp.cancel(expression)
    require(name, residual == 0)


def positive_rational_halfline(name, expression, variable, lower=100):
    """Certify positivity on [lower, infinity) by nonnegative coefficients.

    After x=lower+t, both numerator and denominator must have nonnegative
    rational coefficients and strictly positive constant coefficients.
    This is a finite exact certificate valid for every t>=0, not sampling.
    """
    t = sp.Symbol("halfline_offset", nonnegative=True)
    numerator, denominator = sp.fraction(
        sp.cancel(expression.subs(variable, t + sp.Integer(lower)))
    )
    for label, part in (("numerator", numerator), ("denominator", denominator)):
        polynomial = sp.Poly(part, t)
        coefficients = polynomial.all_coeffs()
        require(
            f"{name}.{label}",
            all(c.is_Rational and c >= 0 for c in coefficients)
            and polynomial.eval(0) > 0,
        )


def check_schur_and_divided_differences():
    x, y, a, p = sp.symbols("x y a p", positive=True)
    lx, ly, qx, qy = sp.symbols("lx ly qx qy")
    rx = (x * lx - a * p) / (x * p - a * lx)
    ry = (y * ly - a * p) / (y * p - a * ly)
    complement = (lx + ly) / (x + y) - (
        a * (lx + p) * (ly + p) / (p * (x + a) * (y + a))
    )
    diagonal_product = (
        (x * p - a * lx) * (y * p - a * ly)
        / (p * (x + a) * (y + a))
    )
    zero("schur_congruence", complement - diagonal_product * (rx + ry) / (x + y))

    determinant = qx * qy / (x * y) - (qx + qy) ** 2 / (x + y) ** 2
    factor = (x * qx - y * qy) * (x * qy - y * qx) / (x * y * (x + y) ** 2)
    zero("two_node_determinant", determinant - factor)

    u, v, hu, hv = sp.symbols("u v hu hv", positive=True)
    T = (u * hu - v * hv) / (hv - hu)
    g_difference = (1 / hu - 1 / hv) / (u - v)
    j_difference = (u * hu - v * hv) / (u - v)
    zero("T_reciprocal_g_identity", T - ((1 / hv) / g_difference - v))
    zero("u_over_T_reciprocal_j_identity", u / T - (hv / j_difference - 1))

    Tx = T.subs({u: x**2, v: a**2})
    reduced = rx.subs({lx: x * hu, p: a * hv})
    zero("reduced_response_T_identity", reduced - Tx / (a * x))
    zero("reduced_h_T_identity", reduced / x - Tx / (a * x**2))

    ordinary_difference = (hu - hv) / (x**2 - y**2)
    j_difference_xy = (x**2 * hu - y**2 * hv) / (x**2 - y**2)
    zero(
        "pick_as_two_loewner_kernels",
        (x * hu + y * hv) / (x + y)
        - (j_difference_xy - x * y * ordinary_difference),
    )
    zero("reciprocal_loewner_congruence", g_difference + (hu - hv) / ((u - v) * hu * hv))


def check_reciprocal_schwarzian_lemma():
    u, v = sp.symbols("u v")
    f = sp.Function("f")(u)
    fv = sp.Symbol("fv")
    d = (f - fv) / (u - v)
    first, second = sp.diff(f, u), sp.diff(f, u, 2)
    zero(
        "divided_difference_derivative",
        sp.diff(d, u) - (first - d) / (u - v),
    )
    zero(
        "reciprocal_curvature_numerator",
        d * sp.diff(d, u, 2) - 2 * sp.diff(d, u) ** 2
        - (d * ((u - v) * second + 2 * first) - 2 * first**2) / (u - v) ** 2,
    )
    zero(
        "reciprocal_second_derivative",
        sp.diff(1 / d, u, 2)
        + (d * sp.diff(d, u, 2) - 2 * sp.diff(d, u) ** 2) / d**3,
    )

    t, f1, f2, f3 = sp.symbols("t f1 f2 f3")
    d_series = f1 + f2 * t / 2 + f3 * t**2 / 6
    confluent = sp.diff(1 / d_series, t, 2).subs(t, 0)
    schwarzian = f3 / f1 - sp.Rational(3, 2) * (f2 / f1) ** 2
    zero("confluent_reciprocal_schwarzian", confluent + schwarzian / (3 * f1))

    r = sp.Function("r")(u)
    f_prime = r**-2
    f_second = sp.diff(f_prime, u)
    f_third = sp.diff(f_prime, u, 2)
    Sf = f_third / f_prime - sp.Rational(3, 2) * (f_second / f_prime) ** 2
    zero("inverse_sqrt_derivative_schwarzian", sp.diff(r, u, 2) + r * Sf / 2)

    rr, r1, dd = sp.symbols("r r1 d")
    zero(
        "tangent_integral_endpoint_identity",
        (-1 / r1) * (1 / rr - 1 / (rr - t * r1)) / t
        - 1 / (rr * (rr - t * r1)),
    )
    zero(
        "tangent_integral_constant_slope_limit",
        (1 / (rr * (rr - t * r1))).subs(r1, 0) - 1 / rr**2,
    )
    zero(
        "tangent_curvature_numerator",
        dd * (t * (-2 * r1 / rr**3) + 2 / rr**2) - 2 / rr**4
        - 2 * (dd * rr * (rr - t * r1) - 1) / rr**4,
    )

    def schwarzian_of(expression):
        derivative = sp.diff(expression, u)
        return sp.diff(expression, u, 3) / derivative - sp.Rational(3, 2) * (
            sp.diff(expression, u, 2) / derivative
        ) ** 2

    zero("reciprocal_mobius_schwarzian", schwarzian_of(1 / f) - schwarzian_of(f))


def check_spectral_factors():
    u, lam, mu = sp.symbols("u lambda mu")
    atom_h = 2 / (u + lam)
    atom_j = 2 * u / (u + lam)
    for order, coefficient in ((1, -2), (2, 4), (3, -12)):
        zero(
            f"h_atom_derivative_{order}",
            sp.diff(atom_h, u, order) - coefficient / (u + lam) ** (order + 1),
        )
    for order, coefficient in ((1, 2), (2, -4), (3, 12)):
        zero(
            f"j_atom_derivative_{order}",
            sp.diff(atom_j, u, order) - coefficient * lam / (u + lam) ** (order + 1),
        )

    s2, s3, s4, w2, w3, w4 = sp.symbols("S2 S3 S4 W2 W3 W4")
    zero("spectral_h_factor_48", 2 * (-2 * s2) * (-12 * s4) - 3 * (4 * s3) ** 2 - 48 * (s2 * s4 - s3**2))
    zero("spectral_j_factor_48", 2 * (2 * w2) * (12 * w4) - 3 * (-4 * w3) ** 2 - 48 * (w2 * w4 - w3**2))

    S = {k: (u + lam) ** -k + (u + mu) ** -k for k in (2, 3, 4)}
    W = {k: lam * (u + lam) ** -k + mu * (u + mu) ** -k for k in (2, 3, 4)}
    pair = (lam - mu) ** 2 / ((u + lam) ** 4 * (u + mu) ** 4)
    zero("unweighted_pair_gram_identity", S[2] * S[4] - S[3] ** 2 - pair)
    zero("weighted_pair_gram_identity", W[2] * W[4] - W[3] ** 2 - lam * mu * pair)


def check_coordinate_polynomials():
    x = sp.Symbol("x", positive=True)
    L = sp.Function("L")(x)

    def Du(expression):
        return sp.diff(expression, x) / (2 * x)

    h, j = L / x, x * L
    hp, hpp, hppp = Du(h), Du(Du(h)), Du(Du(Du(h)))
    jp, jpp, jppp = Du(j), Du(Du(j)), Du(Du(Du(j)))
    A, B, C = x * sp.diff(L, x), x**2 * sp.diff(L, x, 2), x**3 * sp.diff(L, x, 3)
    Eh = 3 * L**2 - 2 * L * (C + 3 * B + 3 * A) + 2 * A * C - 3 * B**2 + 6 * A * B + 3 * A**2
    Ej = 3 * L**2 + 2 * L * (C + 3 * B + 3 * A) + 2 * A * C - 3 * B**2 - 6 * A * B - 9 * A**2
    zero("E_h_coordinate_polynomial", 16 * x**10 * (2 * hp * hppp - 3 * hpp**2) - Eh)
    zero("E_j_coordinate_polynomial", 16 * x**6 * (2 * jp * jppp - 3 * jpp**2) - Ej)


def check_theta_conversion():
    theta = sp.Symbol("theta", positive=True)
    m = sp.Function("m")(theta)

    def Du(expression):
        return sp.diff(expression, theta) / (8 * theta)

    def Su(expression):
        first = Du(expression)
        return Du(Du(first)) / first - sp.Rational(3, 2) * (Du(first) / first) ** 2

    def Stheta(expression):
        first = sp.diff(expression, theta)
        return sp.diff(expression, theta, 3) / first - sp.Rational(3, 2) * (
            sp.diff(expression, theta, 2) / first
        ) ** 2

    g = 4 * m
    correction = sp.Rational(3, 128) / theta**4
    zero("theta_first_schwarzian_chain_rule", Su(g) - Stheta(m) / (64 * theta**2) - correction)
    mp, mpp, mppp = sp.diff(m, theta), sp.diff(m, theta, 2), sp.diff(m, theta, 3)
    polynomial = 2 * theta**2 * mp * mppp - 3 * theta**2 * mpp**2 + 3 * mp**2
    zero("theta_moment_inequality_conversion", 128 * theta**4 * mp**2 * Su(g) - polynomial)
    j = theta**2 / m
    zero("theta_second_schwarzian_chain_rule", Su(j) - Stheta(j) / (64 * theta**2) - correction)


def check_compact_rational_bounds():
    H = 3 * 10**12
    require("compact_strip_lower_factor", Q(15, 16) == 1 - Q(1, 16))
    require("compact_strip_upper_factor", Q(17, 16) == 1 + Q(1, 16))
    require("tail_sector_sqrt2_lower_bound", Q(2) > Q(5, 4) ** 2)
    require("tail_sector_angle_margin", Q(2, H) < Q(1, 4))
    require("unweighted_head_third_bound", Q(1, 2**4) == Q(1, 16))
    require("weighted_head_third_bound", Q(1, 2**2) == Q(1, 4))
    require("unweighted_tail_factor", Q(16, 15) ** 3 == Q(4096, 3375) < 2)
    require("weighted_tail_factor", Q(17, 16) * Q(16, 15) ** 3 == Q(4352, 3375) < 2)

    first_square_min, first_square_max = 14**2, 15**2
    second_square_min, second_square_max = 21**2, 22**2
    require("first_pair_separation", second_square_min - first_square_max == 216)
    require("compact_denominator_cap", 10**4 + second_square_max == 10484)
    require("compact_first_denominator_below_cap", 10**4 + first_square_max < 10484)

    s_margin = Q(216**2, 10484**8)
    w_margin = Q(first_square_min * second_square_min * 216**2, 10484**8)
    s_error = Q(1, 4 * H**4) + Q(4, H**8)
    w_error = Q(1, H**2) + Q(4, H**4)
    require("unweighted_square_error_expansion", 2 * Q(1, 16) * Q(2, H**4) + Q(2, H**4) ** 2 == s_error)
    require("weighted_square_error_expansion", 2 * Q(1, 4) * Q(2, H**2) + Q(2, H**2) ** 2 == w_error)
    require("compact_unweighted_margin_lower_bound", s_margin > Q(3, 10**28))
    require("compact_weighted_margin_lower_bound", w_margin > Q(2, 10**23))
    require("compact_unweighted_error_upper_bound", s_error < Q(4, 10**51))
    require("compact_weighted_error_upper_bound", w_error < Q(2, 10**25))
    require("compact_unweighted_positive_gap", s_margin - s_error > 0)
    require("compact_weighted_positive_gap", w_margin - w_error > 0)


def check_large_axis_rational_bounds():
    x = sp.Symbol("x", positive=True)
    one_half = sp.Rational(1, 2)
    y = x / 2 + sp.Rational(5, 4)
    eps = Q(1, 1000)

    # The positive arctanh series gives log(4)>112/81 and log(2)>2/3.
    require("log4_positive_series_partial_sum", 4 * (Q(1, 3) + Q(1, 81)) == Q(112, 81))
    require("gamma_log_argument_margin", Q(205, 4) / Q(22, 7) > 16)
    require("L_lower_bound", Q(112, 81) - Q(11, 1000) > Q(4, 3))

    # x^3*2^(2-x) decreases on x>=100 since 3/x<2/3<log(2).
    # The remaining factor 1+2/(x-3) also decreases there.
    require("prime_bound_monotonicity_margin", Q(3, 100) < Q(2, 3))
    require("prime_bound_at_100", Q(99 * 10**6, 97 * 2**98) < eps)
    require("prime_log_power_majorants", all(Q(k, 2) <= 2 for k in range(4)))

    positive_rational_halfline("pole_square_factor", 2 - (1 - 1 / (2 * x)) ** -2, x)
    positive_rational_halfline("pole_cube_factor", sp.Rational(5, 4) - (1 - 1 / (2 * x)) ** -3, x)
    positive_rational_halfline("pole_fourth_factor", sp.Rational(5, 4) - (1 - 1 / (2 * x)) ** -4, x)
    require("pole_fourth_endpoint", Q(200, 199) ** 4 < Q(5, 4))

    for power in (1, 2, 3):
        positive_rational_halfline(
            f"convex_reciprocal_tangent_{power}",
            (1 + sp.Rational(5, 2) / x) ** -power
            - (1 - sp.Rational(5 * power, 2) / x),
            x,
        )

    positive_rational_halfline(
        "A_gamma_upper_bound",
        one_half + 1 / x - x * (1 / y + 1 / y**2) / 4,
        x,
    )
    A_lower = 1 / (2 * (1 + sp.Rational(5, 2) / x)) - 1 / (x * (1 - 1 / (2 * x)) ** 2)
    positive_rational_halfline("A_simplified_lower_bound", A_lower - (one_half - sp.Rational(13, 4) / x), x)
    require("A_upper_box", Q(1, 2) + Q(1, 100) + eps == Q(511, 1000) < Q(11, 20))
    require("A_lower_box", Q(1, 2) - Q(13, 400) == Q(187, 400) > Q(9, 20))

    positive_rational_halfline(
        "B_gamma_lower_bound",
        x**2 * (-1 / y**2 - 2 / y**3) / 8 + one_half + 2 / x,
        x,
    )
    B_upper = 2 / (x * (1 - 1 / (2 * x)) ** 3) - 1 / (2 * (1 + sp.Rational(5, 2) / x) ** 2)
    positive_rational_halfline("B_simplified_upper_bound", -one_half + 5 / x - B_upper, x)
    require("B_lower_box", -Q(1, 2) - Q(2, 100) - eps == -Q(521, 1000) > -Q(11, 20))
    require("B_upper_box_endpoint", -Q(1, 2) + Q(5, 100) == -Q(9, 20))

    C_lower = (1 + sp.Rational(5, 2) / x) ** -3 - 6 / (x * (1 - 1 / (2 * x)) ** 4)
    positive_rational_halfline("C_simplified_lower_bound", C_lower - (1 - 15 / x), x)
    positive_rational_halfline(
        "C_gamma_upper_bound",
        1 + 6 / x - x**3 * (2 / y**3 + 6 / y**4) / 16,
        x,
    )
    require("C_lower_box_endpoint", 1 - Q(15, 100) == Q(17, 20))
    require("C_upper_box", 1 + Q(6, 100) + eps == Q(1061, 1000) < Q(11, 10))

    Alo, Ahi = Q(9, 20), Q(11, 20)
    Blo, Bhi = -Q(11, 20), -Q(9, 20)
    Clo, Chi = Q(17, 20), Q(11, 10)
    require("linear_coefficient_lower_bound", Clo + 3 * Blo + 3 * Alo == Q(11, 20) > 0)
    require("linear_coefficient_upper_bound", Chi + 3 * Bhi + 3 * Ahi == Q(7, 5))

    eh_constant = 2 * Alo * Clo - 3 * Blo**2 + 6 * Ahi * Blo + 3 * Alo**2
    ej_constant = 2 * Alo * Clo - 3 * Blo**2 - 9 * Ahi**2
    require("E_h_box_constant", eh_constant == -Q(27, 20))
    require("E_j_box_constant", ej_constant == -Q(573, 200))
    Lmin = Q(4, 3)
    require("E_h_polynomial_increasing", 6 * Lmin - Q(14, 5) == Q(26, 5) > 0)
    require("E_h_positive_margin", 3 * Lmin**2 - Q(14, 5) * Lmin + eh_constant == Q(1, 4) > 0)
    require("E_j_positive_margin", 3 * Lmin**2 + ej_constant == Q(1481, 600) > 0)


def run():
    CHECKS.clear()
    check_schur_and_divided_differences()
    check_reciprocal_schwarzian_lemma()
    check_spectral_factors()
    check_coordinate_polynomials()
    check_theta_conversion()
    check_compact_rational_bounds()
    check_large_axis_rational_bounds()
    result = {
        "schema_version": 1,
        "status": "passed",
        "audit": "fourth_real_pick_stage_2026_11_09",
        "check_count": len(CHECKS),
        "checks": CHECKS,
        "arithmetic": ["symbolic_rational_identities", "exact_rational_comparisons"],
        "numerical_grid_used": False,
        "external_inputs_not_recomputed": [
            "published_finite_zero_verification",
            "published_first_zero_enclosures",
            "prior_three_node_theorem_and_inverse_square_zero_bound",
            "classical_zero_strip_and_gamma_series",
        ],
    }
    return result


if __name__ == "__main__":
    print(json.dumps(run(), sort_keys=True, separators=(",", ":")))
