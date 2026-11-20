#!/usr/bin/env python3
"""Rigorous Arb certificate for the degree-one second Ewald scalar cell.

This checker encloses the finite spectral integral with acb.integral and
bounds the omitted t-tail by an explicit log-Gamma contour shift.  It is a
certificate for one complete scalar cell, not an RH calculation.
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


DEFAULT_PREC = 160
DEFAULT_T = 40
DEFAULT_MESH_DENOMINATOR = 8
DEFAULT_THETA_NUMERATOR = 49
DEFAULT_THETA_DENOMINATOR = 100


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def poly_add(*polys: list[arb]) -> list[arb]:
    size = max(len(poly) for poly in polys)
    return [
        sum((poly[j] if j < len(poly) else arb(0) for poly in polys), arb(0))
        for j in range(size)
    ]


def poly_scale(poly: list[arb], scalar: arb) -> list[arb]:
    return [scalar * coefficient for coefficient in poly]


class Certificate:
    def __init__(self, precision: int, cutoff: int, mesh_denominator: int) -> None:
        ctx.prec = precision
        ctx.cap = 8
        self.precision = precision
        self.cutoff_integer = cutoff
        self.cutoff = arb(cutoff)
        self.mesh_denominator = mesh_denominator
        self.pi = arb.pi()
        self.i = acb(0, 1)

    def completed_xi_factor(self, t: acb_series) -> acb_series:
        """K(s) zeta(s), with s=1/2-it and positive-real log(pi)."""
        s = acb(arb(1) / 2) - self.i * t
        multiplier = (
            s
            * (s - 1)
            * ((-s / 2) * self.pi.log()).exp()
            * (s / 2).gamma()
        )
        return multiplier * s.zeta()

    def d2(self, s: acb_series) -> acb_series:
        """The complete n=2 Euler remainder, using positive-real logarithms."""
        log_two = arb(2).log()
        two_minus_s = (-s * log_two).exp()
        two_one_minus_s = ((1 - s) * log_two).exp()
        return two_minus_s - (two_one_minus_s - 1) / (1 - s)

    def completed_e2_factor(self, t: acb_series) -> acb_series:
        s = acb(arb(1) / 2) - self.i * t
        multiplier = (
            s
            * (s - 1)
            * ((-s / 2) * self.pi.log()).exp()
            * (s / 2).gamma()
        )
        return multiplier * self.d2(s)

    def xi_and_e2_series(self, center: acb) -> tuple[acb_series, acb_series]:
        t = acb_series([center, 1], 3)
        # These are analytic even completions.  On the real axis they equal
        # Re(K zeta)/2 and Re(K d_2)/2, respectively.
        xi = (self.completed_xi_factor(t) + self.completed_xi_factor(-t)) / 4
        e2 = (self.completed_e2_factor(t) + self.completed_e2_factor(-t)) / 4
        return xi, e2

    def weighted_bilinear_integrand(self, t: acb, analytic: bool) -> acb:
        del analytic
        xi, e2 = self.xi_and_e2_series(t)
        # Series coefficient 2 is the second derivative divided by 2!, so
        # B(Xi,E)=Xi' E' - Xi E[2] - Xi[2] E at the series centre.
        bilinear = xi[1] * e2[1] - xi[0] * e2[2] - xi[2] * e2[0]
        return t * t * bilinear

    def finite_integral(self) -> acb:
        total = acb(0)
        segment_count = self.cutoff_integer * self.mesh_denominator
        tolerance = arb("1e-32")
        for segment in range(segment_count):
            left = arb(segment) / self.mesh_denominator
            right = arb(segment + 1) / self.mesh_denominator
            total += acb.integral(
                self.weighted_bilinear_integrand,
                acb(left),
                acb(right),
                rel_tol=tolerance,
                abs_tol=tolerance,
                deg_limit=16,
                eval_limit=100000,
                depth_limit=80,
                use_heap=True,
            )
        # q(t)=t and the integrand is even.
        return (arb(2) / self.pi) * total

    def xi_moment_bounds(self) -> tuple[arb, arb, arb]:
        """Bounds X_j >= sup_R |Xi^(j)|, j=0,1,2."""
        zero = acb_series([acb(0), 1], 3)
        xi = (self.completed_xi_factor(zero) + self.completed_xi_factor(-zero)) / 4
        x0 = xi[0].real
        x2 = -(2 * xi[2]).real
        if not (x0 > 0 and x2 > 0):
            raise ArithmeticError("failed to certify the positive theta moments")
        x1 = (x0 * x2).sqrt()
        return x0, x1, x2

    def log_gamma_constants(self) -> tuple[arb, arb, arb, arb]:
        """Return beta,C0,C1,C2 for |A^(j)| <= Cj exp(-beta t)."""
        theta = arb(DEFAULT_THETA_NUMERATOR) * self.pi / DEFAULT_THETA_DENOMINATOR
        beta = theta / 2
        a = arb(1) / 4
        c = self.pi * theta.cos()
        if not c > 0:
            raise ArithmeticError("the contour angle must lie strictly below pi/2")
        gamma_a = a.gamma()
        digamma_a = a.digamma()
        trigamma_a = acb(a).polygamma(1).real
        centered_second_moment = gamma_a * (
            (digamma_a - c.log()) ** 2 + trigamma_a
        )
        shifted_second_moment = centered_second_moment + theta**2 * gamma_a
        common = c ** (-a)
        c0 = common * gamma_a
        c1 = common * (gamma_a * shifted_second_moment).sqrt() / 2
        c2 = common * shifted_second_moment / 4
        return beta, c0, c1, c2

    def spectral_tail_bound(self) -> tuple[arb, dict[str, object]]:
        """Bound the absolute contribution from |t| >= cutoff."""
        t0 = self.cutoff
        beta, c0, c1, c2 = self.log_gamma_constants()
        x0, x1, x2 = self.xi_moment_bounds()

        log_two = arb(2).log()
        inv_sqrt_two = arb(2).sqrt() / 2
        sqrt_two = arb(2).sqrt()
        numerator_bound = sqrt_two + 1
        d0 = inv_sqrt_two + numerator_bound / t0
        d1 = (
            log_two * inv_sqrt_two
            + log_two * sqrt_two / t0
            + numerator_bound / t0**2
        )
        d2 = (
            log_two**2 * inv_sqrt_two
            + log_two**2 * sqrt_two / t0
            + 2 * log_two * sqrt_two / t0**2
            + 2 * numerator_bound / t0**3
        )

        p = [arb(1) / 4, arb(0), arb(1)]  # t^2+1/4
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
        # The exact two-sided normalization and |E_2^(r)| <= |H^(r)|/2
        # reduce to 1/pi here.  We retain an additional factor 2 as an
        # explicit normalization safety reserve in the frozen certificate.
        q = poly_scale(
            poly_add(
                poly_scale(h1, x1),
                poly_scale(h2, x0 / 2),
                poly_scale(h0, x2 / 2),
            ),
            2 / self.pi,
        )
        q = [arb(0), arb(0)] + q  # spectral weight q(t)^2=t^2

        integrals: list[arb] = []
        exponential = (-beta * t0).exp()
        for degree in range(len(q)):
            truncated_exponential = sum(
                ((beta * t0) ** j / factorial(j) for j in range(degree + 1)),
                arb(0),
            )
            integrals.append(
                exponential
                * factorial(degree)
                * truncated_exponential
                / beta ** (degree + 1)
            )
        tail = sum((coefficient * integral for coefficient, integral in zip(q, integrals)), arb(0))
        if not tail > 0:
            raise ArithmeticError("failed to certify a positive tail majorant")
        details = {
            "beta": str(beta),
            "A_derivative_constants": [str(c0), str(c1), str(c2)],
            "Xi_derivative_bounds": [str(x0), str(x1), str(x2)],
            "d2_derivative_bounds_at_cutoff": [str(d0), str(d1), str(d2)],
            "tail_polynomial_coefficients_ascending": [str(value) for value in q],
            "tail_integral_majorant": str(tail),
            "two_symmetric_tails": True,
            "normalization_safety_factor": 2,
        }
        return tail, details

    def run(self) -> dict[str, object]:
        finite = self.finite_integral()
        if not finite.imag.contains(0):
            raise ArithmeticError("the finite integral lost the real-axis symmetry")
        tail, details = self.spectral_tail_bound()
        full = finite.real + arb(0, tail.abs_upper())
        if not full < 0:
            raise ArithmeticError("the full e2 enclosure is not strictly negative")
        negative_margin = -full.upper()
        return {
            "status": "PASS_CERTIFIED_NEGATIVE_CELL",
            "scope": "actual residual q(t)=t, complete scalar Ewald cell n=2",
            "normalization": "e2=(1/pi) integral_R t^2 B(Xi,E2) dt",
            "precision_bits": self.precision,
            "finite_cutoff": str(self.cutoff),
            "mesh_denominator": self.mesh_denominator,
            "mesh_segments": self.cutoff_integer * self.mesh_denominator,
            "contour_theta": f"{DEFAULT_THETA_NUMERATOR}*pi/{DEFAULT_THETA_DENOMINATOR}",
            "finite_cell_enclosure": str(finite),
            "absolute_spectral_tail_bound": str(tail),
            "full_cell_enclosure": str(full),
            "full_cell_lower_endpoint": str(full.lower()),
            "full_cell_upper_endpoint": str(full.upper()),
            "certified_negative_margin": str(negative_margin),
            "certified_statement": "e_2(q=t) < 0",
            "tail_details": details,
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

    result = Certificate(args.precision, args.cutoff, args.mesh_denominator).run()
    script = Path(__file__).resolve()
    workstream = script.parent.parent
    provenance_paths = [
        script,
        workstream / "EWALD_BESSEL_CELL_TAIL_NEXT.md",
        workstream / "EWALD_SCALAR_CELL_TAIL_NEXT.md",
        workstream / "ACTUAL_EWALD_REVERSE_ORDER_NEXT.md",
    ]
    result["provenance"] = {
        "python": platform.python_version(),
        "python_flint": flint.__version__,
        "files": {str(path.relative_to(workstream)): sha256(path) for path in provenance_paths},
    }
    rendered = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output is not None:
        args.output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
