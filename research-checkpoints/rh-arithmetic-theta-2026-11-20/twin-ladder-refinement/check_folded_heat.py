#!/usr/bin/env python3
"""Exact finite checks for FOLDED_HEAT_ROUTE.md.

This checks algebra, transform constants, a negative control, and a tail
antiderivative. It does not prove RH or any all-order positivity claim.
Requires SymPy. The default report is written beside this script.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import sympy as sp


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--report",
        type=Path,
        default=Path(__file__).with_name("folded_heat_check_report.json"),
    )
    args = parser.parse_args()
    checks: list[dict[str, object]] = []

    def exact_zero(name: str, expression: sp.Expr, **details: object) -> None:
        residual = sp.factor(sp.simplify(expression))
        checks.append(
            {
                "name": name,
                "passed": residual == 0,
                "residual": str(residual),
                **details,
            }
        )

    def predicate(name: str, result: object, **details: object) -> None:
        checks.append({"name": name, "passed": bool(result), **details})

    x, y, u, v, t, q, lam, ell = sp.symbols(
        "x y u v t q lam ell", positive=True
    )
    mu, mv = sp.symbols("mu mv", real=True)

    # Treat the two log-derivative values as independent symbols: this
    # verifies the transport identity without assuming a Stieltjes law.
    folded_a = -(mu - mv) / (x**2 - y**2)
    folded_b = (x**2 * mu - y**2 * mv) / (x**2 - y**2)
    pick = 2 * (x * mu + y * mv) / (x + y)
    divided_l = 2 * (x * mu - y * mv) / (x - y)
    exact_zero("two_channel_pick_identity", pick - 2 * (x * y * folded_a + folded_b))
    exact_zero("odd_channel_identity", pick - divided_l - 4 * x * y * folded_a)
    exact_zero("even_channel_identity", pick + divided_l - 4 * folded_b)

    alpha = sp.symbols("alpha", real=True)
    beta = sp.symbols("beta", real=True, nonzero=True)
    du = (u - alpha) ** 2 + beta**2
    dv = (v - alpha) ** 2 + beta**2
    quartet = sp.Matrix(
        [
            [
                2 * ((u - alpha) ** 2 - beta**2) / du**2,
                2 * ((u - alpha) * (v - alpha) - beta**2) / (du * dv),
            ],
            [
                2 * ((u - alpha) * (v - alpha) - beta**2) / (du * dv),
                2 * ((v - alpha) ** 2 - beta**2) / dv**2,
            ],
        ]
    )
    expected_det = -4 * beta**2 * (u - v) ** 2 / (du**2 * dv**2)
    exact_zero("quartet_rank_two_determinant", quartet.det() - expected_det)

    # The erfc transform follows from this differential identity and its
    # value at t=0. Check the signed parameter algebra separately so the
    # positive gamma and negative pole parameters are both covered.
    a = sp.symbols("a", real=True)
    erfc_kernel = sp.exp(a**2 * t) * sp.erfc(a * sp.sqrt(t))
    exact_zero(
        "erfc_kernel_differential_identity",
        sp.diff(erfc_kernel, t) - a**2 * erfc_kernel + a / sp.sqrt(sp.pi * t),
    )
    exact_zero(
        "erfc_laplace_algebra",
        (1 - a / q) / (q**2 - a**2) - 1 / (q * (q + a)),
        qualification="Removable algebraic case q=a is interpreted by continuity.",
    )
    exact_zero(
        "gamma_inverse_transform_constant",
        1 / (2 * lam * q) - 1 / (2 * q * (q + lam))
        - 1 / (2 * lam * (q + lam)),
    )
    exact_zero(
        "pole_inverse_transform_constant",
        (1 / (2 * q * (q + a))).subs(a, -sp.Rational(1, 2))
        - 1 / (2 * q * (q - sp.Rational(1, 2))),
    )
    gaussian_integral = sp.integrate(
        sp.exp(-q**2 * t - ell**2 / (4 * t)) / sp.sqrt(sp.pi * t),
        (t, 0, sp.oo),
    )
    exact_zero(
        "prime_gaussian_laplace_transform",
        gaussian_integral.rewrite(sp.exp) - sp.exp(-ell * q) / q,
        computed_integral=str(gaussian_integral),
    )

    z = sp.symbols("z")
    control_f = (z**2 + 1) ** 2 * (
        (z - sp.Rational(1, 4)) ** 2 + 4
    ) * ((z + sp.Rational(1, 4)) ** 2 + 4)
    control_a = sp.Rational(63, 16)
    control_h = (u + 1) ** 2 * ((u + control_a) ** 2 + 1)
    control_m = 2 / (u + 1) + 2 * (u + control_a) / ((u + control_a) ** 2 + 1)
    exact_zero("countercontrol_fold", control_f - control_h.subs(u, z**2))
    exact_zero("countercontrol_log_derivative", sp.diff(control_h, u) / control_h - control_m)
    expected_roots = [sp.I, -sp.I] + [
        s * sp.Rational(1, 4) + r * 2 * sp.I
        for s in (-1, 1)
        for r in (-1, 1)
    ]
    predicate(
        "countercontrol_stated_zeros",
        all(sp.simplify(control_f.subs(z, root)) == 0 for root in expected_roots),
        off_axis_real_parts=["-1/4", "1/4"],
    )
    exact_zero(
        "countercontrol_double_imaginary_zeros",
        sp.diff(control_f, z).subs(z, sp.I),
    )
    predicate(
        "countercontrol_heat_positive_certificate_parameter",
        control_a > 1,
        a_minus_one=str(control_a - 1),
        certificate="T(t) >= 2*(exp(-t)-exp(-a*t)) > 0 for t>0.",
    )
    control_heat_transform = sp.integrate(
        sp.exp(-u * t)
        * (2 * sp.exp(-t) + 2 * sp.exp(-control_a * t) * sp.cos(t)),
        (t, 0, sp.oo),
    )
    exact_zero(
        "countercontrol_heat_laplace_transform",
        control_heat_transform - control_m,
    )
    alternating_at_zero = sp.simplify(
        2 + 2 * sp.re((control_a - sp.I) ** 7)
    )
    expected_seventh = -sp.Rational(829940726081, 134217728)
    exact_zero(
        "countercontrol_seventh_derivative_value",
        alternating_at_zero - expected_seventh,
        exact_value=str(alternating_at_zero),
    )
    predicate(
        "countercontrol_seventh_derivative_is_negative",
        alternating_at_zero < 0,
        consequence="Continuity forces failure of heat complete monotonicity for small t>0.",
    )

    # Verify the tail integral by differentiation and the endpoint limit.
    b = sp.symbols("b", real=True)
    tail = sp.exp(t / 4) * (
        sp.sqrt(t / sp.pi) * sp.exp(-(b - t) ** 2 / (4 * t))
        + t / 2 * sp.erfc((b - t) / (2 * sp.sqrt(t)))
    )
    tail_integrand = b * sp.exp(b / 2 - b**2 / (4 * t)) / (2 * sp.sqrt(sp.pi * t))
    exact_zero("prime_tail_antiderivative", sp.diff(tail, b) + tail_integrand)
    exact_zero("prime_tail_upper_endpoint", sp.limit(tail, b, sp.oo))

    # The cutoff-Pick contradiction needs exactly this nonzero residue.
    regular_h, regular_r = sp.symbols("regular_h regular_r")
    cutoff_product = (z - sp.Rational(1, 2)) * (
        regular_h - regular_r - 1 / (z - sp.Rational(1, 2))
    )
    exact_zero(
        "cutoff_pick_removed_pole_value",
        sp.limit(cutoff_product, z, sp.Rational(1, 2)) + 1,
        removed_pole_value="-1",
    )

    failures = [item["name"] for item in checks if not item["passed"]]
    report = {
        "artifact": "FOLDED_HEAT_ROUTE.md",
        "checker": Path(__file__).name,
        "sympy_version": sp.__version__,
        "status": "PASS" if not failures else "FAIL",
        "checks_passed": len(checks) - len(failures),
        "checks_total": len(checks),
        "failures": failures,
        "scope": (
            "Exact finite identities and an explicit negative control. The report is not "
            "an RH proof, an all-order positivity certificate, a full analytic proof checker, "
            "or verification of an external formalization."
        ),
        "checks": checks,
    }
    args.report.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": report["status"], "passed": report["checks_passed"],
                      "total": len(checks), "report": str(args.report)}, indent=2))
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
