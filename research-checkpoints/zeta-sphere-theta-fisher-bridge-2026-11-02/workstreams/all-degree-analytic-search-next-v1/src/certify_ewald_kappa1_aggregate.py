#!/usr/bin/env python3
"""Certify the actual kappa=1 Ewald seed, derivative, and aggregate order.

The finite head uses complete Arb spectral integrals for e_1,...,e_6.  The
uncomputed Ewald-index tail is bounded before any sign split by the shifted
contour majorant from EWALD_SCALAR_CELL_TAIL_NEXT.md.  The final inequalities
are uniform for 1/2 <= z <= 1 and do not assume a one-sign remote tail.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import platform
from math import factorial
from pathlib import Path

import flint
from flint import acb, acb_series, arb, ctx

from certify_ewald_kappa1_e2 import (
    Certificate as BaseCertificate,
    poly_add,
    poly_scale,
)


DEFAULT_PREC = 160
DEFAULT_T = 50
DEFAULT_MESH_DENOMINATOR = 8
DEFAULT_HEAD_CUTOFF = 6
INDEX_TAIL_SHIFT = 20
INDEX_TAIL_THETA_NUMERATOR = 1
INDEX_TAIL_THETA_DENOMINATOR = 5


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def poly_mul(left: list[arb], right: list[arb]) -> list[arb]:
    result = [arb(0)] * (len(left) + len(right) - 1)
    for i, a in enumerate(left):
        for j, b in enumerate(right):
            result[i + j] += a * b
    return result


class AggregateCertificate(BaseCertificate):
    def completed_cell_factor(self, t: acb_series, n: int) -> acb_series:
        """Return K(s)d_n(s) in a form analytic at the removable s=1 pole."""
        s = acb(arb(1) / 2) - self.i * t
        a_factor = ((-s / 2) * self.pi.log()).exp() * (s / 2).gamma()
        if n == 1:
            # d_1=1-(1-s)^(-1) and s(s-1)d_1=s^2.
            return s * s * a_factor
        log_n = arb(n).log()
        log_previous = arb(n - 1).log()
        n_minus_s = (-s * log_n).exp()
        n_one_minus_s = ((1 - s) * log_n).exp()
        previous_one_minus_s = ((1 - s) * log_previous).exp()
        return a_factor * (
            s * (s - 1) * n_minus_s
            + s * (n_one_minus_s - previous_one_minus_s)
        )

    def xi_and_cell_series(
        self, center: acb, n: int
    ) -> tuple[acb_series, acb_series]:
        t = acb_series([center, 1], 3)
        xi = (self.completed_xi_factor(t) + self.completed_xi_factor(-t)) / 4
        cell = (
            self.completed_cell_factor(t, n)
            + self.completed_cell_factor(-t, n)
        ) / 4
        return xi, cell

    def weighted_cell_integrand(self, t: acb, analytic: bool, n: int) -> acb:
        del analytic
        xi, cell = self.xi_and_cell_series(t, n)
        bilinear = xi[1] * cell[1] - xi[0] * cell[2] - xi[2] * cell[0]
        return t * t * bilinear

    def finite_cell_integral(self, n: int) -> acb:
        total = acb(0)
        tolerance = arb("1e-32")
        for segment in range(self.cutoff_integer * self.mesh_denominator):
            left = arb(segment) / self.mesh_denominator
            right = arb(segment + 1) / self.mesh_denominator
            total += acb.integral(
                lambda t, analytic: self.weighted_cell_integrand(t, analytic, n),
                acb(left),
                acb(right),
                rel_tol=tolerance,
                abs_tol=tolerance,
                deg_limit=16,
                eval_limit=100000,
                depth_limit=80,
                use_heap=True,
            )
        return (arb(2) / self.pi) * total

    def d_derivative_bounds(self, n: int) -> tuple[arb, arb, arb]:
        """Bound |d_n^(j)(1/2-it)| for j=0,1,2 and t>=cutoff."""
        t0 = self.cutoff
        if n == 1:
            return 1 + 1 / t0, 1 / t0**2, 2 / t0**3
        n_arb = arb(n)
        previous = arb(n - 1)
        log_n = n_arb.log()
        log_previous = previous.log()
        root_n = n_arb.sqrt()
        root_previous = previous.sqrt()
        u0 = 1 / root_n
        u1 = log_n / root_n
        u2 = log_n**2 / root_n
        v0 = root_n + root_previous
        v1 = log_n * root_n + log_previous * root_previous
        v2 = log_n**2 * root_n + log_previous**2 * root_previous
        d0 = u0 + v0 / t0
        d1 = u1 + v1 / t0 + v0 / t0**2
        d2 = u2 + v2 / t0 + 2 * v1 / t0**2 + 2 * v0 / t0**3
        return d0, d1, d2

    def cell_spectral_tail_bound(self, n: int) -> tuple[arb, dict[str, object]]:
        """Bound the two omitted real spectral tails for one complete cell."""
        t0 = self.cutoff
        beta, c0, c1, c2 = self.log_gamma_constants()
        x0, x1, x2 = self.xi_moment_bounds()
        d0, d1, d2 = self.d_derivative_bounds(n)

        p = [arb(1) / 4, arb(0), arb(1)]
        k0 = poly_scale(p, c0)
        k1 = poly_add([arb(0), 2 * c0], poly_scale(p, c1))
        k2 = poly_add([2 * c0, 4 * c1], poly_scale(p, c2))
        h0 = poly_scale(k0, d0)
        h1 = poly_add(poly_scale(k1, d0), poly_scale(k0, d1))
        h2 = poly_add(
            poly_scale(k2, d0),
            poly_scale(k1, 2 * d1),
            poly_scale(k0, d2),
        )
        # This is the exact two-tail normalization with the same extra
        # factor-two reserve as the independently audited e_2 certificate.
        q = poly_scale(
            poly_add(
                poly_scale(h1, x1),
                poly_scale(h2, x0 / 2),
                poly_scale(h0, x2 / 2),
            ),
            2 / self.pi,
        )
        q = [arb(0), arb(0)] + q
        exponential = (-beta * t0).exp()
        integrals: list[arb] = []
        for degree in range(len(q)):
            truncated = sum(
                ((beta * t0) ** j / factorial(j) for j in range(degree + 1)),
                arb(0),
            )
            integrals.append(
                exponential
                * factorial(degree)
                * truncated
                / beta ** (degree + 1)
            )
        tail = sum(
            (coefficient * integral for coefficient, integral in zip(q, integrals)),
            arb(0),
        )
        return tail, {
            "d_derivative_bounds_at_cutoff": [str(d0), str(d1), str(d2)],
            "tail_polynomial_coefficients_ascending": [str(value) for value in q],
            "tail_integral_majorant": str(tail),
            "normalization_safety_factor": 2,
        }

    def complete_cell(self, n: int) -> tuple[arb, dict[str, object]]:
        finite = self.finite_cell_integral(n)
        if not finite.imag.contains(0):
            raise ArithmeticError(f"cell {n} lost real-axis symmetry")
        tail, tail_details = self.cell_spectral_tail_bound(n)
        full = finite.real + arb(0, tail.abs_upper())
        return full, {
            "finite_enclosure": str(finite),
            "spectral_tail_bound": str(tail),
            "full_enclosure": str(full),
            "lower": str(full.lower()),
            "upper": str(full.upper()),
            "tail_details": tail_details,
        }

    def shifted_zeta_constants(self, sigma: arb) -> tuple[arb, arb, arb]:
        s = acb_series([acb(sigma), 1], 3)
        zeta = s.zeta()
        z0 = zeta[0].real
        z1 = -zeta[1].real
        z2 = (2 * zeta[2]).real
        if not (z0 > 0 and z1 > 0 and z2 > 0):
            raise ArithmeticError("failed to certify positive zeta moments")
        return z0, z1, z2

    def index_tail_constant(self) -> tuple[arb, dict[str, object]]:
        """Globally majorize C_(q,Y) from scalar-tail equation (24)."""
        y = arb(INDEX_TAIL_SHIFT)
        sigma = y + arb(1) / 2
        theta = (
            arb(INDEX_TAIL_THETA_NUMERATOR)
            * self.pi
            / INDEX_TAIL_THETA_DENOMINATOR
        )
        a = sigma / 2
        c = self.pi * theta.cos()
        gamma_a = a.gamma()
        second_log_moment = (
            (a.digamma() - c.log()) ** 2 + acb(a).polygamma(1).real
        )
        g0 = c ** (-a) * gamma_a
        g1 = g0 * (second_log_moment + theta**2).sqrt() / 2
        g2 = g0 * (second_log_moment + theta**2) / 4
        z0, z1, z2 = self.shifted_zeta_constants(sigma)

        r = [sigma, arb(1)]  # |s| <= x+sigma on x>=0.
        p = poly_mul(r, r)   # |s(s-1)| <= (x+sigma)^2.
        p_prime = [2 * sigma - 1, arb(2)]
        k0 = poly_scale(p, g0)
        k1 = poly_add(poly_scale(p_prime, g0), poly_scale(p, g1))
        k2 = poly_add(
            [2 * g0],
            poly_scale(p_prime, 2 * g1),
            poly_scale(p, g2),
        )
        xi0 = poly_scale(k0, z0 / 2)
        xi1 = poly_scale(poly_add(poly_scale(k1, z0), poly_scale(k0, z1)), arb(1) / 2)
        xi2 = poly_scale(
            poly_add(
                poly_scale(k2, z0),
                poly_scale(k1, 2 * z1),
                poly_scale(k0, z2),
            ),
            arb(1) / 2,
        )
        u0 = poly_mul(k0, r)
        u1 = poly_add(poly_mul(k1, r), poly_mul(k0, poly_add([arb(1)], r)))
        u2 = poly_add(
            poly_mul(k2, r),
            poly_scale(poly_mul(k1, poly_add([arb(1)], r)), 2),
            poly_mul(k0, poly_add([arb(2)], r)),
        )
        integrand_poly = poly_mul(
            [y**2, arb(0), arb(1)],
            poly_add(
                poly_mul(xi1, u1),
                poly_scale(poly_mul(xi0, u2), arb(1) / 2),
                poly_scale(poly_mul(xi2, u0), arb(1) / 2),
            ),
        )
        # Each Xi/K product contributes exp(-theta*x/2)^2.  The factor
        # 1/(2*pi) includes both symmetric x half-lines from equation (24).
        integral = sum(
            (
                coefficient
                * factorial(degree)
                / theta ** (degree + 1)
                for degree, coefficient in enumerate(integrand_poly)
            ),
            arb(0),
        )
        constant = integral / (2 * self.pi)
        if not constant > 0:
            raise ArithmeticError("failed to certify the index-tail constant")
        return constant, {
            "Y": INDEX_TAIL_SHIFT,
            "sigma": str(sigma),
            "theta": f"pi/{INDEX_TAIL_THETA_DENOMINATOR}",
            "gamma_derivative_constants": [str(g0), str(g1), str(g2)],
            "zeta_derivative_constants": [str(z0), str(z1), str(z2)],
            "positive_integrand_polynomial": [str(value) for value in integrand_poly],
            "C_qY_upper": str(constant),
        }

    def index_tail_moment_bound(self, r: int, constant: arb) -> arb:
        """Apply equations (28)--(29) after head cutoff N."""
        n = arb(DEFAULT_HEAD_CUTOFF)
        p = arb(INDEX_TAIL_SHIFT) + arb(3) / 2 - r
        a_n = 1 + (2 * n).log()
        if not p * a_n >= 2:
            raise ArithmeticError("the elementary tail summand is not decreasing")
        first = a_n**2 / n**p
        integral = n ** (1 - p) * (
            a_n**2 / (p - 1)
            + 2 * a_n / (p - 1) ** 2
            + 2 / (p - 1) ** 3
        )
        return arb(2) ** r * constant * (first + integral)

    def run_aggregate(self) -> dict[str, object]:
        if DEFAULT_HEAD_CUTOFF != 6:
            raise ArithmeticError("the proof algebra is frozen for head cutoff six")
        cells: dict[int, arb] = {}
        cell_receipts: dict[str, object] = {}
        for n in range(1, DEFAULT_HEAD_CUTOFF + 1):
            value, details = self.complete_cell(n)
            cells[n] = value
            cell_receipts[str(n)] = details
        if not (cells[1] > 0 and cells[2] < 0):
            raise ArithmeticError("the first two certified cell signs are wrong")
        if not all(cells[n] > 0 for n in range(3, DEFAULT_HEAD_CUTOFF + 1)):
            raise ArithmeticError("a positive head cell was not certified")

        tail_constant, tail_details = self.index_tail_constant()
        t0 = self.index_tail_moment_bound(0, tail_constant)
        t1 = self.index_tail_moment_bound(1, tail_constant)

        a1 = cells[1]
        b2 = -cells[2]
        a3 = cells[3]
        positive_mass = sum((cells[n] for n in [1, 3, 4, 5, 6]), arb(0))
        positive_derivative_mass = sum(
            (n * cells[n] for n in [1, 3, 4, 5, 6]), arb(0)
        )

        seed_head = sum(
            (cells[n] / arb(2) ** n for n in range(1, 7)), arb(0)
        )
        seed_margin = seed_head - t0 / arb(2) ** 7

        # Drop the certified positive n=4,5,6 contributions.  The quadratic
        # a1-2*b2*z+3*a3*z^2 has global minimum a1-b2^2/(3*a3).
        derivative_margin = a1 - b2**2 / (3 * a3) - t1

        placement_gap = a1 - sum(
            ((n - 2) * cells[n] for n in [3, 4, 5, 6]), arb(0)
        )
        head_d_margin = b2 * placement_gap / 4
        perturbation = (
            (positive_derivative_mass + 2 * b2) * t0
            + (positive_mass + b2) * t1
            + t0 * t1
        )
        aggregate_d_margin = head_d_margin - perturbation

        if not seed_margin > 0:
            raise ArithmeticError("the half-seed margin is not positive")
        if not derivative_margin > 0:
            raise ArithmeticError("the uniform derivative margin is not positive")
        if not placement_gap > 0 or not aggregate_d_margin > 0:
            raise ArithmeticError("the uniform aggregate D margin is not positive")

        tail_details.update(
            {
                "head_cutoff": DEFAULT_HEAD_CUTOFF,
                "sum_abs_e_n_n_gt_6_upper": str(t0),
                "sum_n_abs_e_n_n_gt_6_upper": str(t1),
                "series_bound": "first term plus the explicit integral in scalar-tail equations (28)-(29)",
            }
        )
        return {
            "status": "PASS_CERTIFIED_KAPPA1_AGGREGATE",
            "scope": "actual residual q(t)=t; complete Ewald cells; uniform 1/2<=z<=1",
            "nonclaim": "One actual rung only; no all-degree or RH conclusion.",
            "precision_bits": self.precision,
            "finite_spectral_cutoff": self.cutoff_integer,
            "mesh_denominator": self.mesh_denominator,
            "cells": cell_receipts,
            "index_tail": tail_details,
            "certified_margins": {
                "half_seed_lower": str(seed_margin.lower()),
                "S_prime_uniform_lower": str(derivative_margin.lower()),
                "placement_gap_lower": str(placement_gap.lower()),
                "minus_D_uniform_lower": str(aggregate_d_margin.lower()),
            },
            "certified_statement": (
                "S(1/2)>0, S'(z)>0, and D(z)<0 for every 1/2<=z<=1"
            ),
        }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--precision", type=int, default=DEFAULT_PREC)
    parser.add_argument("--cutoff", type=int, default=DEFAULT_T)
    parser.add_argument("--mesh-denominator", type=int, default=DEFAULT_MESH_DENOMINATOR)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    if args.cutoff <= 0 or args.mesh_denominator <= 0:
        parser.error("cutoff and mesh denominator must be positive")
    if args.cutoff < 50:
        parser.error("the frozen small-cell signs require cutoff at least 50")

    result = AggregateCertificate(
        args.precision, args.cutoff, args.mesh_denominator
    ).run_aggregate()
    script = Path(__file__).resolve()
    workstream = script.parent.parent
    provenance_paths = [
        script,
        script.parent / "certify_ewald_kappa1_e2.py",
        workstream / "ACTUAL_EWALD_REVERSE_ORDER_NEXT.md",
        workstream / "EWALD_SCALAR_CELL_TAIL_NEXT.md",
        workstream / "EWALD_BESSEL_CELL_TAIL_NEXT.md",
        workstream / "EWALD_KAPPA1_E2_CERTIFICATE_NEXT.md",
    ]
    result["provenance"] = {
        "python": platform.python_version(),
        "python_flint": flint.__version__,
        "files": {
            str(path.relative_to(workstream)): sha256(path)
            for path in provenance_paths
        },
    }
    rendered = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output is not None:
        args.output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
