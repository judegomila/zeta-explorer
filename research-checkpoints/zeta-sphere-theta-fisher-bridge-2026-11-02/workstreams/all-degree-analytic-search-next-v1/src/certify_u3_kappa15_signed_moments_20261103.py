#!/usr/bin/env python3
"""Tight interval recomputation of the old signed moments for odd kappa=15.

This is a targeted refinement of the reviewed reflected-square moment
certificate.  It computes only mu_0,...,mu_14, the old signed data that
determine the odd monic residual q_7 of degree 15.  It never computes or uses
the new signed moment mu_15.

The cell width is 1/1024 rather than 1/256.  The same complex Cauchy disk of
radius R=1/20 therefore gives q=delta/(2R)=5/512 in the degree-20 Taylor
remainder.  Every theta orbit n>=17 and the full h>=3 tail are retained by the
same analytic majorants used in the reviewed certificate.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from pathlib import Path
import sys
import time

import mpmath as mp
from mpmath import iv


DECIMAL_DIGITS = 110
MOMENT_COUNT = 15
CELL_COUNT = 3072
CELL_WIDTH_DENOMINATOR = 1024
TAYLOR_DEGREE = 20
THETA_ORBIT_CUTOFF = 16
H_CUTOFF = 3


def polynomial_value(coefficients, value):
    result = iv.mpf(0)
    for coefficient in reversed(coefficients):
        result = result * value + coefficient
    return result


def build_derivative_polynomials(count: int):
    polynomials = [[0, -3, 2]]
    for _ in range(count - 1):
        previous = polynomials[-1]
        following = [0] * (len(previous) + 1)
        for degree, coefficient in enumerate(previous):
            following[degree] += (1 + 4 * degree) * coefficient
            following[degree + 1] -= 4 * coefficient
        polynomials.append(following)
    return polynomials


def theta_derivatives(h, polynomials):
    z = iv.pi * iv.exp(2 * h)
    prefactor = 4 * iv.exp(h / 2)
    orbit_arguments = [z * orbit * orbit for orbit in range(1, THETA_ORBIT_CUTOFF + 1)]
    orbit_exponentials = [iv.exp(-argument) for argument in orbit_arguments]
    derivatives = []
    for order, polynomial in enumerate(polynomials):
        finite_orbits = prefactor * sum(
            polynomial_value(polynomial, argument) * exponential
            for argument, exponential in zip(orbit_arguments, orbit_exponentials)
        ) / 2**order
        orbit_tail = (
            8
            * iv.exp(h / 2)
            * sum(abs(coefficient) for coefficient in polynomial)
            * z ** (order + 2)
            * 17 ** (2 * order + 4)
            * iv.exp(-289 * z)
            / 2**order
        )
        derivatives.append(finite_orbits + iv.mpf([-1, 1]) * orbit_tail)
    return derivatives


def endpoints(value):
    return [str(mp.mpf(value.a)), str(mp.mpf(value.b))]


def canonical_sha256(payload):
    canonical = json.dumps(
        payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode()
    return hashlib.sha256(canonical).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--digits", type=int, default=DECIMAL_DIGITS)
    args = parser.parse_args()
    if args.digits < 100:
        raise ValueError("at least 100 decimal digits are required")

    mp.mp.dps = args.digits
    iv.dps = args.digits
    derivative_count = MOMENT_COUNT + TAYLOR_DEGREE
    polynomials = build_derivative_polynomials(derivative_count)
    delta = iv.mpf(1) / CELL_WIDTH_DENOMINATOR
    started = time.time()
    moments = [iv.mpf(0) for _ in range(MOMENT_COUNT)]

    for cell in range(CELL_COUNT):
        h = iv.mpf(2 * cell + 1) / (2 * CELL_WIDTH_DENOMINATOR)
        derivatives = theta_derivatives(h, polynomials)
        squares = {}
        for order in range(MOMENT_COUNT):
            for derivative_order in range(TAYLOR_DEGREE + 1):
                squares[order, derivative_order] = sum(
                    math.comb(derivative_order, index)
                    * derivatives[order + index]
                    * derivatives[order + derivative_order - index]
                    for index in range(derivative_order + 1)
                )
        for order in range(MOMENT_COUNT):
            for derivative_order in range(0, TAYLOR_DEGREE + 1, 2):
                integrand_derivative = 2 * h * h * squares[order, derivative_order]
                if derivative_order:
                    integrand_derivative += (
                        4
                        * derivative_order
                        * h
                        * squares[order, derivative_order - 1]
                    )
                    integrand_derivative += (
                        4
                        * math.comb(derivative_order, 2)
                        * squares[order, derivative_order - 2]
                    )
                if order:
                    integrand_derivative -= order * squares[order - 1, derivative_order]
                moments[order] += (
                    4**order
                    * integrand_derivative
                    * delta ** (derivative_order + 1)
                    / (2**derivative_order * math.factorial(derivative_order + 1))
                )
        if cell % 128 == 127:
            print(
                json.dumps(
                    {
                        "cells_complete": cell + 1,
                        "cells_total": CELL_COUNT,
                        "elapsed_seconds": time.time() - started,
                    },
                    sort_keys=True,
                ),
                flush=True,
            )

    cauchy_q = iv.mpf(5) / 512
    cauchy_radius = iv.mpf(3) / 10
    remainder_rows = []
    for order in range(MOMENT_COUNT):
        derivative_majorant = (
            iv.mpf(10) ** 6
            * 4**order
            * (
                20 * math.factorial(order) ** 2 / cauchy_radius ** (2 * order)
                + (
                    order
                    * math.factorial(order - 1) ** 2
                    / cauchy_radius ** (2 * order - 2)
                    if order
                    else 0
                )
            )
        )
        taylor_remainder = (
            H_CUTOFF
            * derivative_majorant
            * cauchy_q ** (TAYLOR_DEGREE + 1)
            / (1 - cauchy_q)
        )

        polynomial_l1 = sum(abs(coefficient) for coefficient in polynomials[order]) / iv.mpf(2) ** order
        spatial_tail = (
            64
            * 4**order
            * polynomial_l1**2
            * iv.mpf(1200) ** (2 * order + 6)
            * iv.exp(-2400)
        )
        if order:
            previous_l1 = (
                sum(abs(coefficient) for coefficient in polynomials[order - 1])
                / iv.mpf(2) ** (order - 1)
            )
            spatial_tail += (
                32
                * order
                * 4**order
                * previous_l1**2
                * iv.mpf(1200) ** (2 * order + 2)
                * iv.exp(-2400)
            )
        total_remainder = taylor_remainder + spatial_tail
        moments[order] += iv.mpf([-1, 1]) * total_remainder
        remainder_rows.append(
            {
                "index": order,
                "taylor_remainder_upper": str(mp.mpf(taylor_remainder.b)),
                "h_ge_3_tail_upper": str(mp.mpf(spatial_tail.b)),
            }
        )

    script_path = Path(__file__).resolve()
    payload = {
        "schema_version": "zsv.u3_kappa15_signed_moments.20261103.v1",
        "status": "PASS",
        "scope": (
            "Tight reflected-square interval recomputation of old complete-theta "
            "signed moments mu_0,...,mu_14 for the odd degree-15 residual"
        ),
        "runtime": {
            "python": sys.version,
            "python_executable": sys.executable,
            "mpmath": mp.__version__,
            "decimal_digits": args.digits,
            "elapsed_seconds": time.time() - started,
            "pid": os.getpid(),
            "network_used": False,
        },
        "normalization": {
            "stored_moments": "mu_j=4^j*M_j",
            "old_data_only": "indices 0,...,14 determine odd N=7; mu_15 is absent",
        },
        "quadrature": {
            "interval": [0, H_CUTOFF],
            "cell_count": CELL_COUNT,
            "cell_width": f"1/{CELL_WIDTH_DENOMINATOR}",
            "taylor_degree": TAYLOR_DEGREE,
            "complex_h_disk_radius": "1/20",
            "cauchy_q": "5/512",
            "exact_theta_orbits": [1, THETA_ORBIT_CUTOFF],
            "analytic_theta_orbit_tail": "every orbit n>=17",
            "analytic_spatial_tail": "all h>=3",
        },
        "moments": [endpoints(value) for value in moments],
        "remainder_bounds": remainder_rows,
        "provenance": {
            "script": str(script_path),
            "script_sha256": hashlib.sha256(script_path.read_bytes()).hexdigest(),
        },
        "nonclaims": [
            "These old moments do not contain or determine the new signed pivot mu_15.",
            "A finite signed-moment certificate is not an all-degree theorem or an RH proof.",
        ],
    }
    payload["receipt_integrity"] = {
        "definition": "sha256 of canonical compact sorted JSON with receipt_integrity omitted",
        "payload_sha256": canonical_sha256(payload),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix(args.output.suffix + ".tmp")
    temporary.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")
    temporary.replace(args.output)
    print(
        json.dumps(
            {
                "status": "PASS",
                "output": str(args.output),
                "payload_sha256": payload["receipt_integrity"]["payload_sha256"],
                "elapsed_seconds": payload["runtime"]["elapsed_seconds"],
            },
            sort_keys=True,
        ),
        flush=True,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
