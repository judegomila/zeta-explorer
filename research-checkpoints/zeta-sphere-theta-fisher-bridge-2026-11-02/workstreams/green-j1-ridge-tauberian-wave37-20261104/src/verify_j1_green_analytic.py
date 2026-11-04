#!/usr/bin/env python3
from fractions import Fraction
from math import comb, factorial
import hashlib
import json
from pathlib import Path

import sympy as sp


x, y, c, u, v, r = sp.symbols("x y c u v r", positive=True)


def A1(t):
    return -4 * t**2 + 15 * t - sp.Rational(15, 2)


def A2(t):
    return 8 * t**3 - 56 * t**2 + sp.Rational(165, 2) * t - sp.Rational(75, 4)


def B1(t):
    return -2 * t**2 + sp.Rational(13, 2) * t - sp.Rational(5, 2)


def Cx(rr, xx):
    return sp.expand(A1(rr * xx) * B1(xx) - A2(rr * xx) * (xx - 1))


def Cy(rr, xx, yy):
    return sp.expand(-A1(rr * xx) * B1(yy) - A2(rr * xx) * (yy - 1))


def bernstein_coefficients(poly, variables):
    polynomial = sp.Poly(sp.expand(poly), *variables)
    degrees = [polynomial.degree(var) for var in variables]
    result = []
    for indices in __import__("itertools").product(
        *(range(degree + 1) for degree in degrees)
    ):
        value = sp.Rational(0)
        for powers in __import__("itertools").product(
            *(range(index + 1) for index in indices)
        ):
            monomial = sp.prod(var**power for var, power in zip(variables, powers))
            coefficient = polynomial.coeff_monomial(monomial)
            factor = sp.prod(
                sp.Rational(comb(index, power), comb(degree, power))
                for index, power, degree in zip(indices, powers, degrees)
            )
            value += coefficient * factor
        result.append(sp.factor(value))
    return result


checks = {}

# Differentiate one generic shell directly and recover equation (1).
yy = c / x
D = lambda expression: sp.expand(2 * x * sp.diff(expression, x))
shell = r * x ** sp.Rational(5, 4) * (2 * r * x - 3) * sp.exp(-r * x)
b = lambda argument: argument ** sp.Rational(5, 4) * (argument - 1) * sp.exp(-argument)
response = b(x) + b(yy)
shell_wronskian = D(shell) * D(response) - D(D(shell)) * response
shell_target = (
    x ** sp.Rational(5, 4)
    * r
    * sp.exp(-r * x)
    * (
        x ** sp.Rational(5, 4) * sp.exp(-x) * Cx(r, x)
        + yy ** sp.Rational(5, 4) * sp.exp(-yy) * Cy(r, x, yy)
    )
)
checks["generic_shell_expansion"] = sp.simplify(shell_wronskian - shell_target) == 0

checks["direct_first_shell_factor"] = (
    sp.factor(Cx(1, x)) == x * (8 * x**2 - 16 * x + 15)
)

# First-shell modular positivity on x in [3,11], c in [9,10].
first_modular = sp.expand(x**2 * Cy(1, x, c / x))
expected_minima = [
    sp.Integer(1080),
    sp.Rational(10543, 10),
    sp.Rational(2635, 2),
    sp.Rational(35367, 2),
]
observed_minima = []
for lower, upper in [(3, 5), (5, 7), (7, 9), (9, 11)]:
    transformed = first_modular.subs({x: lower + (upper - lower) * u, c: 9 + v})
    coefficients = bernstein_coefficients(transformed, (u, v))
    observed_minima.append(min(coefficients))
checks["first_modular_bernstein_minima"] = observed_minima == expected_minima

# Direct n=2 loss decreases for x>=3.
quartic = 3072 * x**4 - 11072 * x**3 + 18024 * x**2 - 15480 * x + 4755
shifted_quartic = sp.Poly(sp.expand(quartic.subs(x, 3 + u)), u)
checks["direct_n2_derivative_quartic_positive"] = all(
    coefficient > 0 for coefficient in shifted_quartic.all_coeffs()
)
checks["direct_n2_ratio_at_three"] = (
    sp.factor(
        (384 * x**3 - 872 * x**2 + 661 * x - 150)
        / (8 * x**2 - 16 * x + 15)
    ).subs(x, 3)
    == sp.Rational(1451, 13)
)

# Modular n=2 negative part is at most 150 times the reserve on [3,4]x[9,10].
reserve = Cx(1, x)
payment = sp.expand(x**2 * (150 * reserve + Cy(4, x, c / x)))
derivative_shift = sp.Poly(
    sp.expand(sp.diff(payment, c).subs({x: 3 + u, c: 9 + v})), u, v
)
checks["modular_n2_payment_decreases_in_c"] = all(
    coefficient < 0 for coefficient in derivative_shift.coeffs()
)
payment_at_ten = sp.Poly(sp.expand(payment.subs({x: 3 + u, c: 10})), u)
checks["modular_n2_payment_at_c10_positive"] = all(
    coefficient > 0 for coefficient in payment_at_ten.all_coeffs()
)


def exp_lower(argument, order):
    return sum(Fraction(argument**index, factorial(index)) for index in range(order + 1))


checks["exp3_gt_20"] = exp_lower(3, 9) > 20
checks["exp9_gt_8000"] = exp_lower(9, 16) > 8000
checks["exp10_gt_20000"] = exp_lower(10, 14) > 20000

small_direct_n2 = Fraction(5804, 13 * 8000)
small_modular_n2 = Fraction(600, 8000)
small_direct_tail = Fraction(9, 7) * 13122 * 27 / (20**8)
small_modular_tail = Fraction(18, 7) * 13122 * 10 / (20**8)
checks["small_domain_total_below_one"] = (
    small_direct_n2 + small_modular_n2 + small_direct_tail + small_modular_tail < 1
)

large_direct_tail = Fraction(10, 7) * 512 * 64 / (20**4)
large_modular_tail = Fraction(13, 7) * 5120 / 20000
checks["large_domain_total_below_one"] = large_direct_tail + large_modular_tail < 1

status = "PASS_EXACT_SYMBOLIC" if all(checks.values()) else "FAIL"
payload = {
    "status": status,
    "checks": checks,
    "first_modular_bernstein_minima": [str(value) for value in observed_minima],
    "small_domain_tail_fraction": str(
        small_direct_n2 + small_modular_n2 + small_direct_tail + small_modular_tail
    ),
    "large_domain_tail_fraction": str(large_direct_tail + large_modular_tail),
}
encoded = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
payload["canonical_sha256_before_self_hash"] = hashlib.sha256(encoded).hexdigest()
print(json.dumps(payload, indent=2, sort_keys=True))
raise SystemExit(0 if status.startswith("PASS") else 1)
