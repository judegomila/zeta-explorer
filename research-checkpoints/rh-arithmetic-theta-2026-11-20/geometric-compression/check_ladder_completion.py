#!/usr/bin/env python3
"""Exact finite checks supporting LADDER_COMPLETION.md; not an RH proof."""

from __future__ import annotations

import json
from fractions import Fraction
from math import isqrt
from pathlib import Path

import sympy as s


RESULTS: list[dict[str, object]] = []


def check(name: str, condition: bool, **details: object) -> None:
    if not condition:
        raise AssertionError(name)
    RESULTS.append({"name": name, "passed": True, **details})


def lattice_quantities(B: s.Matrix, C: s.Matrix, G: s.Matrix, H: s.Matrix) -> dict:
    """B is a saturation basis, A=B*C, G source metric, H ambient metric.

    All supplied examples have explicitly primitive B and integral C.
    exp(2*cost) avoids numerical logarithms and square roots.
    """
    A = B * C
    r = C.rows
    induced = B.T * H * B
    pullback = A.T * H * A
    adjoint_product = G.inv() * pullback
    covolume_ratio_squared = s.cancel(G.det() / induced.det())
    hs_squared = s.trace(adjoint_product)
    index_squared = C.det() ** 2
    determinant_cost_exponential = s.cancel(
        covolume_ratio_squared * adjoint_product.det()
    )
    cost_exponential = s.cancel(
        covolume_ratio_squared * (hs_squared / r) ** r
    )
    slack_exponential = s.cancel(cost_exponential / index_squared)
    amgm_slack_exponential = s.cancel(
        (hs_squared / r) ** r / adjoint_product.det()
    )
    return {
        "index_squared": index_squared,
        "hs_squared": hs_squared,
        "determinant_cost_exponential": determinant_cost_exponential,
        "cost_exponential": cost_exponential,
        "slack_exponential": slack_exponential,
        "amgm_slack_exponential": amgm_slack_exponential,
    }


def check_lattice(name: str, B: s.Matrix, C: s.Matrix, G: s.Matrix, H: s.Matrix) -> dict:
    q = lattice_quantities(B, C, G, H)
    check(
        name,
        q["determinant_cost_exponential"] == q["index_squared"]
        and q["slack_exponential"] == q["amgm_slack_exponential"]
        and q["slack_exponential"] >= 1,
        **{key: str(value) for key, value in q.items()},
    )
    return q


I1, I2 = s.eye(1), s.eye(2)
rank_one = check_lattice("rank_one_attains_index_cost", I1, s.Matrix([[7]]), I1, I1)
check("rank_one_minimum_exact", rank_one["cost_exponential"] == 49)

standard = check_lattice("rank_two_strict_slack", I2, s.diag(2, 1), I2, I2)
check(
    "rank_two_slack_is_25_over_16",
    standard["slack_exponential"] == s.Rational(25, 16),
)
isometric = check_lattice(
    "pullback_metric_attains_equality", I2, s.diag(2, 1), s.diag(4, 1), I2
)
check(
    "anisotropic_metric_changes_hs_cost",
    standard["cost_exponential"] == s.Rational(25, 4)
    and isometric["cost_exponential"] == 4
    and standard["cost_exponential"] != isometric["cost_exponential"],
)

rescaled = check_lattice(
    "uniform_source_and_target_rescaling", I2, s.diag(2, 1), 9 * I2, 25 * I2
)
check(
    "uniform_rescaling_leaves_complete_cost_unchanged",
    standard["cost_exponential"] == rescaled["cost_exponential"],
)
check_lattice("skew_map_strict_slack", I2, s.Matrix([[2, 1], [0, 1]]), I2, I2)
check_lattice(
    "rank_two_saturated_embedding_in_rank_three",
    s.Matrix([[1, 0], [0, 1], [1, 1]]),
    s.diag(3, 2),
    s.Matrix([[2, 1], [1, 3]]),
    s.diag(2, 3, 5),
)


def ceil_sqrt_fraction(x: Fraction) -> int:
    m = isqrt(x.numerator // x.denominator)
    while m * m * x.denominator < x.numerator:
        m += 1
    return m


for x in (Fraction(25, 2), Fraction(32), Fraction(81, 4)):
    m = ceil_sqrt_fraction(x)
    coefficients: dict[int, Fraction] = {}
    exponents: dict[int, int] = {}
    remainders: dict[int, Fraction] = {}
    for prime in s.primerange(2, x.numerator // x.denominator + 1):
        p = int(prime)
        power = p
        total = Fraction(0)
        while power <= x:
            total += x / power - 1
            power *= p
        coefficients[p] = total
        exponents[p] = (m * total).numerator // (m * total).denominator
        remainders[p] = m * total - exponents[p]
    q_integer = 1
    for p, exponent in exponents.items():
        q_integer *= p**exponent
    q = lattice_quantities(I1, s.Matrix([[q_integer]]), I1, I1)
    check(
        f"prime_encoding_exact_rounding_X_{x}",
        (m - 1) ** 2 < x <= m**2
        and all(Fraction(0) <= r < Fraction(1) for r in remainders.values())
        and all(m * coefficients[p] == exponents[p] + remainders[p] for p in coefficients)
        and q["cost_exponential"] == q_integer**2,
        X=str(x),
        m=m,
        prime_exponents=exponents,
        rounding_coefficients={p: str(v) for p, v in remainders.items()},
        Q_bit_length=q_integer.bit_length(),
    )

x = s.symbols("x", positive=True)
tail = 2 * x ** s.Rational(-1, 2) * (s.log(x) ** 2 + 4 * s.log(x) + 8)
check(
    "rh_tail_integral_antiderivative",
    s.simplify(s.diff(tail, x) + x ** s.Rational(-3, 2) * s.log(x) ** 2) == 0,
)
check(
    "rh_tail_integral_vanishes_at_infinity",
    s.limit(tail, x, s.oo) == 0,
)
check(
    "rh_ramp_bound_constant",
    s.simplify(
        x / (8 * s.pi) * tail
        - s.sqrt(x) / (4 * s.pi) * (s.log(x) ** 2 + 4 * s.log(x) + 8)
    ) == 0,
)

u = s.symbols("u", real=True)
phi = (1 - u**2) ** 3
check(
    "window_bump_is_c2_at_endpoints",
    all(s.diff(phi, u, order).subs(u, endpoint) == 0 for order in (0, 1, 2) for endpoint in (-1, 1)),
)
check(
    "window_bump_second_derivative_lower_bound_identity",
    s.expand(s.diff(phi, u, 2) + 6 - 6 * u**2 * (6 - 5 * u**2)) == 0,
)

for j in range(3):
    y = 4096 ** (3**j)
    center = 16 * y**2
    fourth_root = 2 ** (1 + 6 * 3**j)
    check(
        f"window_gap_support_and_convexity_j_{j}",
        y < y**2 < 12 * y**2 < center < 20 * y**2 < y**3
        and fourth_root**4 == center
        and fourth_root >= 128
        and Fraction(4, 5) - Fraction(96, fourth_root) >= Fraction(1, 20)
        and Fraction(24, fourth_root) <= Fraction(3, 16),
        Y=str(y),
        X=str(center),
        peak_to_sqrt_ratio=str(fourth_root),
        derivative_upper=str(Fraction(24, fourth_root)),
        convexity_margin_coefficient=str(Fraction(4, 5) - Fraction(96, fourth_root)),
    )

output = {
    "description": "Exact finite checks supporting completion-cost and window-obstruction proofs; no RH claim.",
    "sympy_version": s.__version__,
    "passed": len(RESULTS),
    "failed": 0,
    "checks": RESULTS,
}
destination = Path(__file__).with_name("ladder_completion_check_results.json")
destination.write_text(json.dumps(output, indent=2) + "\n")
print(json.dumps({"passed": len(RESULTS), "failed": 0, "results_file": str(destination)}, indent=2))
