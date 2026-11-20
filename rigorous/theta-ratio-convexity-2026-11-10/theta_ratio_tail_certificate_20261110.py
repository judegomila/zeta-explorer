"""Exact polynomial/rational certificate for the actual-theta tail signs.

The accompanying note supplies the analytic theta-series remainder bound.
This script audits its finite algebra and all rational comparison constants.
No numerical grid or floating-point arithmetic is used.
"""

import json
from fractions import Fraction as Q

import sympy as s


def run():
    P, t = s.symbols("P t", positive=True)
    X, Y = s.symbols("X Y", nonnegative=True)
    checks = {}

    def require(name, condition):
        if not bool(condition):
            raise AssertionError(name)
        checks[name] = True

    def zero(name, expression):
        require(name, s.cancel(expression) == 0)

    def positive_quadrant(name, expression):
        numerator, denominator = s.fraction(s.cancel(expression))
        for label, part in (("numerator", numerator), ("denominator", denominator)):
            polynomial = s.Poly(s.expand(part.subs({P: X + 128, t: Y + 4})), X, Y)
            coefficients = polynomial.coeffs()
            require(
                name + "." + label,
                all(c.is_Rational and c >= 0 for c in coefficients)
                and polynomial.eval({X: 0, Y: 0}) > 0,
            )

    D = lambda expression: s.diff(expression, t) + P * s.diff(expression, P)
    r = P - s.Rational(9, 4) - 3 / (2 * P - 3)
    f = t * r
    W = 4 * (r**2 - D(r))
    H3 = (
        t / P + (s.Rational(5, 4) * t + 1) / P**2
        + (s.Rational(29, 16) * t + s.Rational(3, 2)) / P**3
    ) / 4
    A = (D(r) + r**2) * D(f) - r * D(D(f))
    B = (r * t + 1) * D(f) - t * D(D(f))
    residual = (354 * P * t + 280 * P + 609 * t + 156) / (256 * P**3 * (2 * P - 3))
    zero("H3_residual_identity", D(H3) - r * H3 + t / 4 - residual)
    positive_quadrant("H3_residual_positive", residual)
    positive_quadrant("H3_positive", H3)
    positive_quadrant("D_h_coefficient_A_positive", A)
    positive_quadrant("W_prime_margin_above_one", D(W) - 1)
    positive_quadrant("D_W_margin_above_one", D(D(W)) * D(f) - D(W) * D(D(f)) - 1)
    positive_quadrant("D_h_lower_margin_above_one", A * H3 - B / 4 - 1)
    positive_quadrant("r_above_half_P", r - P / 2)
    positive_quadrant("r_prime_above_P", D(r) - P)
    derivative = r
    for order in range(4):
        positive_quadrant(f"r_derivative_{order}_upper", 2 * P - derivative)
        positive_quadrant(f"r_derivative_{order}_lower", 2 * P + derivative)
        derivative = D(derivative)

    # The exact algebra after eliminating H' and H'' by H'=rH-t/4.
    rr, r1, r2, hh = s.symbols("r r1 r2 H")
    fp, fpp = rr + t * r1, 2 * r1 + t * r2
    Hp, Hpp = rr * hh - t / 4, (r1 + rr**2) * hh - (rr * t + 1) / 4
    As = (r1 + rr**2) * fp - rr * fpp
    Bs = (rr * t + 1) * fp - t * fpp
    zero("D_h_ODE_elimination", Hpp * fp - Hp * fpp - (As * hh - Bs / 4))

    # Finite constants in the analytic remainder estimates.
    require("P_at_t4_above_128", 3 * Q(8, 3)**4 > 128)
    require("prefactor_derivative_geometric_sum", Q(1520, 81) < 20)
    require("prefactor_derivative_bound", Q(30, 128) < 1)
    require("n_power_ratio_bound", Q(3, 2)**12 < 130)
    require("theta_tail_geometric_ratio", Q(130, 2**640) < Q(1, 2))
    require("theta_relative_derivative_constant", 480 * 8192 < 2**22)
    require("relative_error_at_128", 22 + 4 * 7 - 3 * 128 == -334)
    require("log_derivative_constant", 1 + 4 + 3 + 12 + 6 < 32)
    require("log_error_at_128", 27 + 4 * 7 - 3 * 128 == -329)
    require("W_prime_error_constant", 44 < 2**6)
    require("D_W_error_constant", 84 * 6 + 72 * 2 + 44 * 9 + 40 * 3 < 2**11)
    require("D_h_error_constant", 8 * 6 + 4 * 2 + 1 * 9 + 2 * 3 < 2**7)
    require("common_error_constant_dominates", max(6 + 27, 11 + 27, 7 + 27) < 40)
    require("common_error_at_128", 40 + 8 * 7 - 3 * 128 == -288)
    require("common_error_less_than_half", Q(1, 2**288) < Q(1, 2))
    require("exponential_bound_decreases", Q(8, 128) < 3)

    # Optional endpoint curvature certificate used in the companion note.
    x, y = s.symbols("x y", real=True)
    P2 = x * (32 * x**3 - 224 * x**2 + 330 * x - 75) / 16
    expected = s.Rational(71, 16) + s.Rational(687, 16) * y - s.Rational(21, 8) * y**2 - 10 * y**3 - 2 * y**4
    zero("origin_second_derivative_polynomial", -P2.subs(x, 3 + y) - 40 - expected)
    require("origin_first_term_polynomial_margin", Q(71, 16) - Q(21, 8 * 7**2) - Q(10, 7**3) - Q(2, 7**4) > 0)
    require("origin_tail_ratio", Q(3, 2)**8 / 2**15 < Q(1, 1000))
    require("origin_tail_sum", Q(1000, 999) * 256 * Q(3, 8)**12 < Q(1, 500))
    require("origin_pi_power", Q(22, 7)**4 < 100)
    require("origin_negative_curvature_margin", -Q(40, 81) + Q(2, 5) == -Q(38, 405) < 0)

    return {
        "status": "passed",
        "check_count": len(checks),
        "checks": checks,
        "tail_domain": "t >= 4, P = pi exp(t) >= 128",
        "proved_tail_margins": "W' > 1/2, D_W > 1/2, D_h > 1/2",
        "common_remainder_upper_bound": "2^(-288)",
        "scope": "Finite algebra audit. The note proves the analytic theta-series remainder bound; the interval 0<t<4 must be handled separately.",
    }


if __name__ == "__main__":
    print(json.dumps(run(), indent=2, sort_keys=True))
