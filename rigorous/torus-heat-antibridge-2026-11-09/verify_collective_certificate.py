#!/usr/bin/env python3
"""Exact algebra checks for collective_certificate.md.

These checks validate derived identities and an illustrative polynomial example.
They do not verify any global hypothesis for the Riemann theta family.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import sympy as sp


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    checks: list[str] = []

    def zero(expr: sp.Expr, name: str) -> None:
        residual = sp.cancel(sp.expand(expr))
        if residual != 0:
            residual = sp.simplify(residual)
        if residual != 0:
            raise AssertionError(f"{name}: nonzero residual {residual}")
        checks.append(name)

    z, t, x, y, a, b = sp.symbols("z t x y a b", real=True)
    # Exact backward heat evolution of z^4 + a z^2 + b.
    P = z**4 + (a - 12*t)*z**2 + b - 2*a*t + 12*t**2
    zero(sp.diff(P, t) + sp.diff(P, z, 2), "backward_heat_sign")
    M = sp.expand(P.subs(z, x + sp.I*y) * P.subs(z, x - sp.I*y))
    zero(2*sp.diff(M, t) - sp.diff(M, y, 2) + sp.diff(M, x, 2),
         "amplitude_transport")
    W = sp.diff(M, y)/2
    zero(2*sp.diff(W, t) - sp.diff(W, y, 2) + sp.diff(W, x, 2),
         "shear_transport")
    for n in range(5):
        A = sp.diff(M, y, 2*n).subs(y, 0)
        Anext = sp.diff(M, y, 2*n + 2).subs(y, 0)
        zero(2*sp.diff(A, t) - Anext + sp.diff(A, x, 2),
             f"normalized_rung_recurrence_{n}")

    theta, w = sp.symbols("theta w")
    X = 8*P.subs({t: 4*theta, z: -2*sp.I*w})
    zero(sp.diff(X, theta) - sp.diff(X, w, 2),
         "kernel_time_is_standard_time_divided_by_four")

    F, Fp, R, Rp = sp.symbols("F Fp R Rp")
    zero((Fp + Rp)/(F + R) - Fp/F - (Rp*F - Fp*R)/(F*(F + R)),
         "logarithmic_derivative_error_identity")

    # A nonreal quartet and one real pair, with symbolic positions.
    r = x + sp.I*y
    P6 = ((z - x)**2 + y**2)*((z + x)**2 + y**2)*(z**2 - a**2)
    v = sp.cancel(sp.diff(P6, z, 2).subs(z, r) / sp.diff(P6, z).subs(z, r))
    roots_other = [x - sp.I*y, -x - sp.I*y, -x + sp.I*y, a, -a]
    zero(v - 2*sum(1/(r - q) for q in roots_other),
         "polynomial_zero_velocity_matches_principal_value_formula")
    Uprime = sp.cancel(y*(v - sp.conjugate(v))/sp.I)
    Uprime_split = -2 - 2*y**2/(x**2 + y**2) - 4*y**2*(
        1/((x-a)**2 + y**2) + 1/((x+a)**2 + y**2))
    zero(Uprime - Uprime_split, "quartet_and_collective_force_constants")

    Apos, U, kap, eta = sp.symbols("Apos U kap eta", positive=True)
    landing_quartet = U/4 + Apos*sp.log(1 + 2*U/Apos)/8
    zero(sp.diff(landing_quartet, U) - (Apos + U)/(2*(Apos + 2*U)),
         "integrated_quartet_bound")
    landing_slab = sp.log((1 + 2*kap*U)/(1 + 2*kap*eta**2))/(4*kap)
    zero(sp.diff(landing_slab, U) - 1/(2 + 4*kap*U),
         "integrated_collective_slab_bound")
    zero(sp.limit(landing_slab, kap, 0) - (U - eta**2)/2,
         "collective_bound_recovers_de_bruijn_when_margin_vanishes")

    # Generating-function constants used in both theta tail bounds.
    q, m = sp.symbols("q m")
    series = 1/(1-q)
    for _ in range(4):
        series = m*series + q*sp.diff(series, q)
    Cm = (m**4/(1-q) + 4*m**3*q/(1-q)**2
          + 6*m**2*q*(1+q)/(1-q)**3
          + 4*m*q*(1+4*q+q**2)/(1-q)**4
          + q*(1+11*q+11*q**2+q**3)/(1-q)**5)
    zero(series - Cm, "omitted_theta_indices_generating_function")
    nfour = q/(1-q)
    for _ in range(4):
        nfour = q*sp.diff(nfour, q)
    zero(nfour/q - (1+11*q+11*q**2+q**3)/(1-q)**5,
         "integration_tail_generating_function")

    # Exact rational example: a quartet at 30 +/- 0.3i and its negatives,
    # plus eight nearby/reflecting real roots. No theta conclusion is drawn.
    x0, y0 = sp.Integer(30), sp.Rational(3, 10)
    positives = [sp.Rational(144, 5), sp.Rational(59, 2),
                 sp.Rational(153, 5), sp.Rational(311, 10)]
    real_roots = positives + [-q0 for q0 in positives]
    r0 = x0 + sp.I*y0
    Pexample = ((z-x0)**2+y0**2)*((z+x0)**2+y0**2)
    for root in real_roots:
        Pexample *= z-root
    v0 = sp.cancel(sp.diff(Pexample, z, 2).subs(z, r0)
                   / sp.diff(Pexample, z).subs(z, r0))
    uprime0 = sp.cancel(y0*(v0-sp.conjugate(v0))/sp.I)
    kappa_point = sum(1/((x0-root)**2+y0**2) for root in real_roots)
    mirror = -2*y0**2/(x0**2+y0**2)
    collective = -4*y0**2*kappa_point
    zero(uprime0 - (-2+mirror+collective),
         "exact_rational_cluster_example")

    result = {
        "status": "all_exact_algebra_checks_passed",
        "checks_passed": len(checks),
        "checks": checks,
        "normalization": {"standard_time_per_kernel_time": 4},
        "polynomial_example_at_one_time_only": {
            "x": float(x0), "y": float(y0),
            "positive_real_roots": [float(v) for v in positives],
            "conjugate_contribution_to_y_squared_derivative": -2.0,
            "opposite_reflection_contribution": float(mirror),
            "retained_real_cluster_contribution": float(collective),
            "full_y_squared_derivative": float(uprime0),
            "kappa_at_this_point": float(kappa_point),
            "collective_over_opposite_reflection_magnitude": float(collective/mirror),
        },
        "limitations": [
            "No Riemann theta strip, tail, contour, or global kappa hypothesis was certified.",
            "The polynomial example is a one-time algebra check, not a uniform-time bound.",
            "No new numerical bound on the de Bruijn-Newman constant follows from this script.",
        ],
    }
    rendered = json.dumps(result, indent=2) + "\n"
    if args.output:
        args.output.write_text(rendered)
    print(rendered, end="")


if __name__ == "__main__":
    main()
