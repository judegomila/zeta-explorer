#!/usr/bin/env python3
"""Uniform Arb certificate for the N=1 opposite-tilt v' inequality.

The checker proves equation (36) of MODULAR_COMMUTATOR_N1_FULL_AUDIT_NEXT.md
for every 0 <= a <= 1/4.  It never divides by the theta profile: the weighted
curvature is evaluated as psi'^2-psi*psi''.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

from flint import arb, ctx


SUMMED_ORBITS = 8
FIRST_OMITTED_ORBIT = SUMMED_ORBITS + 1
TAIL_START_H = 2
SINHC_TERMS = 8


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def theta_polynomials(max_derivative: int) -> list[list[arb]]:
    polynomials = [[arb(0), arb(-12), arb(8)]]
    for _ in range(max_derivative):
        old = polynomials[-1]
        new = [arb(0)] * (len(old) + 1)
        for degree, coefficient in enumerate(old):
            new[degree] += (arb(1) / 2 + 2 * degree) * coefficient
            new[degree + 1] -= 2 * coefficient
        polynomials.append(new)
    return polynomials


THETA_POLYNOMIALS = theta_polynomials(2)


def polynomial(coefficients: list[arb], value: arb) -> arb:
    result = arb(0)
    for coefficient in reversed(coefficients):
        result = result * value + coefficient
    return result


def absolute_polynomial(coefficients: list[arb], value: arb) -> arb:
    result = arb(0)
    for coefficient in reversed(coefficients):
        result = result * value + abs(coefficient)
    return result


def theta_jet(h: arb) -> list[arb]:
    """Return complete outward enclosures for psi, psi', psi'' on h >= 0."""

    z = arb.pi() * (2 * h).exp()
    exponential = (h / 2).exp()
    jets: list[arb] = []
    for coefficients in THETA_POLYNOMIALS:
        total = arb(0)
        for orbit in range(1, SUMMED_ORBITS + 1):
            x = orbit * orbit * z
            total += polynomial(coefficients, x) * (-x).exp()

        degree = len(coefficients) - 1
        first_x = FIRST_OMITTED_ORBIT**2 * z
        first = absolute_polynomial(coefficients, first_x) * (-first_x).exp()
        ratio = (
            (arb(FIRST_OMITTED_ORBIT + 1) / FIRST_OMITTED_ORBIT)
            ** (2 * degree)
            * (-(2 * FIRST_OMITTED_ORBIT + 1) * z).exp()
        )
        if not ratio < arb(1) / 2:
            raise ArithmeticError("theta orbit-tail ratio is not below one half")
        radius = (first / (1 - ratio)).abs_upper()
        total += arb(0, radius)
        jets.append(exponential * total)
    return jets


def sinhc(value: arb) -> arb:
    """Enclose sinh(value)/value for |value| <= 1, including zero."""

    upper = arb(value.abs_upper())
    if not upper < arb(1001) / 1000:
        raise ArithmeticError("sinhc series called outside |x| <= 1")
    result = arb(0)
    square = value * value
    power = arb(1)
    for index in range(SINHC_TERMS):
        result += power / math.factorial(2 * index + 1)
        power *= square
    omitted = SINHC_TERMS
    first = upper ** (2 * omitted) / math.factorial(2 * omitted + 1)
    ratio = upper**2 / ((2 * omitted + 2) * (2 * omitted + 3))
    if not ratio < arb(1) / 100:
        raise ArithmeticError("sinhc remainder ratio unexpectedly large")
    result += arb(0, (first / (1 - ratio)).abs_upper())
    return result


def exponential_tail_moment(power: int, start: arb) -> arb:
    """Exact integer-power integral int_start^infinity z^power exp(-2z) dz."""

    series = arb(0)
    for index in range(power + 1):
        numerator = math.factorial(power) * 2**index
        denominator = math.factorial(index) * 2 ** (power + 1)
        series += arb(numerator) / denominator * start**index
    return (-2 * start).exp() * series


def analytic_tail_bounds() -> dict[str, arb]:
    """Bound all h >= 2 contributions uniformly for 0 <= a <= 1/4."""

    start = arb.pi() * arb(4).exp()
    if not start > 100:
        raise ArithmeticError("tail start is unexpectedly small")

    coefficient_sums = [
        sum((abs(value) for value in coefficients), arb(0))
        for coefficients in THETA_POLYNOMIALS
    ]
    c0, c1, c2 = coefficient_sums
    first_ratio = arb(2) ** 8 * (-3 * start).exp()
    if not first_ratio < arb(1) / 2:
        raise ArithmeticError("full theta tail is not first-orbit dominated")

    # A harmless factor two covers all n >= 1 in each derivative jet.
    curvature_coefficient = c1 * c1 + c0 * c2
    return {
        "I_even": c0 * c0 * exponential_tail_moment(5, start),
        "I_sinh_over_a": c0 * c0 * exponential_tail_moment(6, start),
        "J_even": curvature_coefficient * exponential_tail_moment(7, start),
        "J_sinh_over_a": curvature_coefficient
        * exponential_tail_moment(8, start),
        "P_minus": 2 * c0 * c0 * exponential_tail_moment(4, start),
        "P_even": 2 * c0 * c0 * exponential_tail_moment(4, start),
        "L_sinh_over_a": c1 * c1 * exponential_tail_moment(8, start),
    }


def compact_cells(spatial_cells: int) -> list[tuple[arb, arb, arb, arb]]:
    """Precompute h, psi^2, and psi^2 v' on [0,2]."""

    if spatial_cells < 128:
        raise ValueError("spatial grid is too small for a proof run")
    values: list[tuple[arb, arb, arb, arb]] = []
    for index in range(spatial_cells):
        midpoint = arb(2 * index + 1) / spatial_cells
        radius = arb(1) / spatial_cells
        h = midpoint + arb(0, radius)
        psi, psi_one, psi_two = theta_jet(h)
        weight = psi * psi
        weighted_curvature = psi_one * psi_one - psi * psi_two
        values.append((h, weight, weighted_curvature, psi_one * psi_one))
    return values


def certify(spatial_cells: int, parameter_cells: int) -> dict[str, object]:
    width_h = arb(2) / spatial_cells
    values = compact_cells(spatial_cells)
    psi_zero = theta_jet(arb(0))[0]
    center_square = psi_zero * psi_zero
    tails = analytic_tail_bounds()

    rows: list[dict[str, object]] = []
    worst_upper: arb | None = None
    worst_index = -1
    smallest_prefix_lower: arb | None = None
    smallest_prefix_index = -1
    for index in range(parameter_cells):
        midpoint = arb(2 * index + 1) / (8 * parameter_cells)
        radius = arb(1) / (8 * parameter_cells)
        a = midpoint + arb(0, radius)

        i_even = arb(0)
        i_sinh = arb(0)
        j_even = arb(0)
        j_sinh = arb(0)
        p_minus = arb(0)
        p_even = arb(0)
        l_sinh = arb(0)
        for h, weight, weighted_curvature, derivative_square in values:
            x = 2 * a * h
            cosine = x.cosh()
            sine_over_a = 2 * h * sinhc(x)
            negative_tilt = (-x).exp()
            i_even += width_h * h * weight * cosine
            i_sinh += width_h * h * weight * sine_over_a
            j_even += width_h * h * weighted_curvature * cosine
            j_sinh += width_h * h * weighted_curvature * sine_over_a
            p_minus += width_h * weight * negative_tilt
            p_even += width_h * weight * cosine
            l_sinh += width_h * h * derivative_square * sine_over_a

        i_even += arb(0, tails["I_even"].abs_upper())
        i_sinh += arb(0, tails["I_sinh_over_a"].abs_upper())
        j_even += arb(0, tails["J_even"].abs_upper())
        j_sinh += arb(0, tails["J_sinh_over_a"].abs_upper())
        p_minus += arb(0, tails["P_minus"].abs_upper())
        p_even += arb(0, tails["P_even"].abs_upper())
        l_sinh += arb(0, tails["L_sinh_over_a"].abs_upper())

        # Half of G(a)/a in the notation of the accompanying proof note.
        margin = (
            i_even * j_sinh
            - i_sinh * j_even
            - 2 * i_sinh * (center_square / 4 - a * p_minus)
        )
        if not margin.upper() < 0:
            raise ArithmeticError(
                f"uniform v-prime tilt margin unresolved on a-cell {index}: {margin}"
            )
        if worst_upper is None or margin.upper() > worst_upper:
            worst_upper = margin.upper()
            worst_index = index
        prefix_margin = l_sinh - p_even - a * a * i_sinh
        if not prefix_margin.lower() > 0:
            raise ArithmeticError(
                f"actual s1 prefix unresolved on a-cell {index}: {prefix_margin}"
            )
        if (
            smallest_prefix_lower is None
            or prefix_margin.lower() < smallest_prefix_lower
        ):
            smallest_prefix_lower = prefix_margin.lower()
            smallest_prefix_index = index
        rows.append(
            {
                "index": index,
                "a_interval": str(a),
                "margin": str(margin),
                "margin_upper": str(margin.upper()),
                "s1_over_2a": str(prefix_margin),
                "s1_over_2a_lower": str(prefix_margin.lower()),
            }
        )

    if worst_upper is None or smallest_prefix_lower is None:
        raise AssertionError("empty parameter partition")
    return {
        "status": "PASS_UNIFORM_VPRIME_TILT_AND_PREFIX",
        "claim": (
            "Equation (36) and the actual s1>0 prefix hold for the complete "
            "theta profile for every 0<a<=1/4; the a=0 row records their "
            "continuous divided limits."
        ),
        "spatial_interval": [0, TAIL_START_H],
        "spatial_cells": spatial_cells,
        "parameter_interval": [0, "1/4"],
        "parameter_cells": parameter_cells,
        "precision_bits": ctx.prec,
        "worst_parameter_cell": worst_index,
        "worst_margin_upper": str(worst_upper),
        "smallest_s1_over_2a_cell": smallest_prefix_index,
        "smallest_s1_over_2a_lower": str(smallest_prefix_lower),
        "psi_zero_squared": str(center_square),
        "analytic_tail_bounds": {key: str(value) for key, value in tails.items()},
        "cells": rows,
        "scope": (
            "Uniform analytic interval certificate for the N=1 sufficient "
            "commutator test and the actual s1>0 prefix only; proves no next "
            "pivot, all-degree statement, or RH claim."
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--spatial-cells", type=int, default=4096)
    parser.add_argument("--parameter-cells", type=int, default=64)
    parser.add_argument("--precision-bits", type=int, default=192)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    ctx.prec = args.precision_bits

    result = certify(args.spatial_cells, args.parameter_cells)
    source = Path(__file__).resolve()
    result["source_sha256"] = sha256(source)
    workstream = source.parents[1]
    result["provenance"] = {
        "MODULAR_COMMUTATOR_N1_FULL_AUDIT_NEXT.md": sha256(
            workstream / "MODULAR_COMMUTATOR_N1_FULL_AUDIT_NEXT.md"
        ),
        "MODULAR_COMMUTATOR_N1_INDEPENDENT_AUDIT.md": sha256(
            workstream / "MODULAR_COMMUTATOR_N1_INDEPENDENT_AUDIT.md"
        ),
    }
    payload = json.dumps(result, sort_keys=True, separators=(",", ":")).encode()
    result["payload_sha256"] = hashlib.sha256(payload).hexdigest()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    print(
        json.dumps(
            {
                "status": result["status"],
                "worst_parameter_cell": result["worst_parameter_cell"],
                "worst_margin_upper": result["worst_margin_upper"],
                "smallest_s1_over_2a_lower": result[
                    "smallest_s1_over_2a_lower"
                ],
                "output": str(args.output),
                "source_sha256": result["source_sha256"],
                "payload_sha256": result["payload_sha256"],
            },
            sort_keys=True,
        )
    )


if __name__ == "__main__":
    main()
