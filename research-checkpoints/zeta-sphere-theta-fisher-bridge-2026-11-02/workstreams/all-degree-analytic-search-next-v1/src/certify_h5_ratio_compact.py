#!/usr/bin/env python3
"""Rigorous Arb replay of the compact H5 ratio-monotonicity certificate.

This worker freezes only Sections 2--3 of H5_RATIO_AVERAGE_NEXT.md: positivity
of R_5'' on 0 <= h <= 3/25 and positivity of N=D'C-DC' on the four rational
z covers from 15/4 through 32.  It evaluates the complete theta series with a
rigorous n>=7 tail; no finite theta truncation is treated as exact.
"""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
import math
import os
from pathlib import Path
import platform
from typing import Any

import flint
from flint import arb, ctx


SOURCE_PATH = Path(__file__).resolve()
SCHEMA_VERSION = "zsv.h5_ratio_compact_arb.v1"
STATUS = "rigorous_h5_ratio_compact_certificate"
MIN_PRECISION = 160
MAX_PRECISION = 512
N_TAYLOR_REMAINDER_ORDER = 12
MAX_DERIVATIVE = N_TAYLOR_REMAINDER_ORDER + 10
SUMMED_ORBITS = 6
FIRST_OMITTED_ORBIT = SUMMED_ORBITS + 1
HARD_MAX_OUTPUT_BYTES = 128 * 1024

H_COVER = {
    "variable": "h",
    "lower_numerator": 0,
    "upper_numerator": 600,
    "denominator": 5000,
    "cells": 600,
    "target": "R5_second_derivative",
    "required_lower": "416",
}

Z_COVERS = (
    {
        "lower_numerator": 1500,
        "upper_numerator": 2000,
        "denominator": 400,
        "cells": 500,
        "required_lower": "1e14",
    },
    {
        "lower_numerator": 1000,
        "upper_numerator": 1600,
        "denominator": 200,
        "cells": 600,
        "required_lower": "7e14",
    },
    {
        "lower_numerator": 800,
        "upper_numerator": 1600,
        "denominator": 100,
        "cells": 800,
        "required_lower": "1e16",
    },
    {
        "lower_numerator": 800,
        "upper_numerator": 1600,
        "denominator": 50,
        "cells": 800,
        "required_lower": "1e18",
    },
)


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def interval_record(value: arb) -> dict[str, str]:
    return {
        "arb": str(value),
        "lower_endpoint_enclosure": str(value.lower()),
        "upper_endpoint_enclosure": str(value.upper()),
    }


def rational_cell(lower_numerator: int, denominator: int) -> arb:
    """Return an outward interval containing [i/d,(i+1)/d]."""

    midpoint = arb(2 * lower_numerator + 1) / (2 * denominator)
    radius = arb(1) / (2 * denominator)
    cell = arb(midpoint, radius.upper())
    if not (
        cell.contains(arb(lower_numerator) / denominator)
        and cell.contains(arb(lower_numerator + 1) / denominator)
    ):
        raise ArithmeticError("rational cell construction lost an endpoint")
    return cell


def build_theta_polynomials(max_derivative: int) -> list[list[Fraction]]:
    """Build P_j from P_0=2z^2-3z and P_(j+1)=P_j/2+2z(P_j'-P_j)."""

    polynomials: list[list[Fraction]] = [
        [Fraction(0), Fraction(-3), Fraction(2)]
    ]
    for _ in range(max_derivative):
        old = polynomials[-1]
        new = [Fraction(0) for _ in range(len(old) + 1)]
        for degree, coefficient in enumerate(old):
            new[degree] += Fraction(1 + 4 * degree, 2) * coefficient
            new[degree + 1] -= 2 * coefficient
        while len(new) > 1 and new[-1] == 0:
            new.pop()
        polynomials.append(new)
    return polynomials


THETA_POLYNOMIALS = build_theta_polynomials(MAX_DERIVATIVE)


def fraction_arb(value: Fraction) -> arb:
    return arb(value.numerator) / value.denominator


def evaluate_polynomial(coefficients: list[Fraction], value: arb) -> arb:
    total = arb(0)
    for coefficient in reversed(coefficients):
        total = total * value + fraction_arb(coefficient)
    return total


def evaluate_absolute_polynomial(
    coefficients: list[Fraction], value: arb
) -> arb:
    total = arb(0)
    for coefficient in reversed(coefficients):
        total = total * value + fraction_arb(abs(coefficient))
    return total


def theta_series_jet(z: arb) -> tuple[list[arb], list[arb]]:
    """Enclose S_j=sum_(n>=1) P_j(n^2 z)e^(-n^2 z), j=0..22.

    For n>=7, B_j(x)=sum_k |p_(j,k)|x^k majorizes |P_j(x)|.
    Since x_(n+1)/x_n=((n+1)/n)^2 and deg(P_j)=j+2, successive
    B_j(x_n)e^(-x_n) terms are bounded by a geometric ratio evaluated at n=7.
    """

    if not z > 3:
        raise ArithmeticError("theta tail bound requires z>3")
    jets: list[arb] = []
    tails: list[arb] = []
    first = FIRST_OMITTED_ORBIT
    for coefficients in THETA_POLYNOMIALS:
        total = arb(0)
        for orbit in range(1, SUMMED_ORBITS + 1):
            x = orbit * orbit * z
            total += evaluate_polynomial(coefficients, x) * (-x).exp()

        degree = len(coefficients) - 1
        first_x = first * first * z
        first_majorant = (
            evaluate_absolute_polynomial(coefficients, first_x)
            * (-first_x).exp()
        )
        ratio = (
            (arb(first + 1) / first) ** (2 * degree)
            * (-(2 * first + 1) * z).exp()
        )
        if not ratio < arb(1) / 2:
            raise ArithmeticError("theta tail ratio is not below one half")
        tail = first_majorant / (1 - ratio)
        radius = tail.abs_upper()
        total += arb(0, radius)
        jets.append(total)
        tails.append(arb(radius))
    return jets, tails


def log_derivative_jet(theta_jets: list[arb]) -> list[arb]:
    """Recover ell^(j) from psi^(j)/psi using the complete Bell recurrence."""

    if len(theta_jets) != MAX_DERIVATIVE + 1:
        raise ValueError("wrong theta jet length")
    if not theta_jets[0] > 0:
        raise ArithmeticError("complete theta profile was not enclosed positive")
    normalized = [value / theta_jets[0] for value in theta_jets]
    log_jet = [arb(0) for _ in normalized]
    for order in range(1, len(normalized)):
        correction = arb(0)
        for index in range(1, order):
            correction += (
                math.comb(order - 1, index - 1)
                * log_jet[index]
                * normalized[order - index]
            )
        log_jet[order] = normalized[order] - correction
    return log_jet


def stabilized_log_jet(z: arb) -> tuple[list[arb], list[arb]]:
    """Enclose ell^(k) by midpoint evaluation plus the exact z derivative.

    Since d ell^(k)/dz = ell^(k+1)/(2z), the full-cell jet through the configured
    maximum order supplies a mean-value radius through one order lower.  This
    is the dependency-controlled enclosure used by the audited compact proof.
    """

    full_theta_jets, full_tails = theta_series_jet(z)
    full_log_jet = log_derivative_jet(full_theta_jets)
    midpoint_z = arb(z.mid())
    midpoint_theta_jets, midpoint_tails = theta_series_jet(midpoint_z)
    midpoint_log_jet = log_derivative_jet(midpoint_theta_jets)
    radius_z = arb(z.rad())
    lower_z = arb(z.lower())
    if not lower_z > 0:
        raise ArithmeticError("z cell is not positive")

    stabilized = [arb(0) for _ in midpoint_log_jet]
    for order in range(1, MAX_DERIVATIVE):
        derivative_bound = arb(full_log_jet[order + 1].abs_upper()) / (2 * lower_z)
        mean_value_radius = radius_z * derivative_bound
        stabilized[order] = midpoint_log_jet[order] + arb(
            0, mean_value_radius.abs_upper()
        )
    tails = [
        midpoint if midpoint.upper() > full.upper() else full
        for midpoint, full in zip(midpoint_tails, full_tails)
    ]
    return stabilized, tails


def derivative_jet_add(left: list[arb], right: list[arb]) -> list[arb]:
    return [a + b for a, b in zip(left, right)]


def derivative_jet_scale(values: list[arb], scalar: int) -> list[arb]:
    return [scalar * value for value in values]


def derivative_jet_multiply(left: list[arb], right: list[arb]) -> list[arb]:
    order = len(left) - 1
    if len(right) != order + 1:
        raise ValueError("derivative jet lengths differ")
    return [
        sum(
            (
                math.comb(index, split)
                * left[split]
                * right[index - split]
                for split in range(index + 1)
            ),
            arb(0),
        )
        for index in range(order + 1)
    ]


def derivative_jet_power(values: list[arb], exponent: int) -> list[arb]:
    result = [arb(1)] + [arb(0) for _ in values[1:]]
    for _ in range(exponent):
        result = derivative_jet_multiply(result, values)
    return result


def cd_derivative_jets(
    log_jet: list[arb], jet_order: int
) -> tuple[list[arb], list[arb]]:
    """Return raw h-derivative jets of C and D through jet_order."""

    if len(log_jet) <= 8 + jet_order:
        raise ValueError("log jet is too short for requested C,D derivatives")
    x = [-log_jet[2 + index] for index in range(jet_order + 1)]
    y = [log_jet[4 + index] for index in range(jet_order + 1)]
    zeta = [-log_jet[6 + index] for index in range(jet_order + 1)]
    w = [log_jet[8 + index] for index in range(jet_order + 1)]
    c = derivative_jet_add(
        derivative_jet_add(
            derivative_jet_scale(zeta, 2),
            derivative_jet_scale(derivative_jet_multiply(x, y), 60),
        ),
        derivative_jet_scale(derivative_jet_power(x, 3), 120),
    )
    d = derivative_jet_add(
        derivative_jet_add(
            derivative_jet_add(
                derivative_jet_add(
                    derivative_jet_scale(w, 2),
                    derivative_jet_scale(
                        derivative_jet_multiply(x, zeta), 112
                    ),
                ),
                derivative_jet_scale(derivative_jet_power(y, 2), 140),
            ),
            derivative_jet_scale(
                derivative_jet_multiply(derivative_jet_power(x, 2), y),
                1680,
            ),
        ),
        derivative_jet_scale(derivative_jet_power(x, 4), 1680),
    )
    return c, d


def r5_derivative_jet_from_log(log_jet: list[arb]) -> list[arb]:
    """Return raw h derivatives R_5^(0..3) from the log jet."""

    jet_order = 3
    c, d = cd_derivative_jets(log_jet, jet_order)

    ratio: list[arb] = []
    for index in range(jet_order + 1):
        correction = sum(
            (
                math.comb(index, split)
                * c[split]
                * ratio[index - split]
                for split in range(1, index + 1)
            ),
            arb(0),
        )
        ratio.append((d[index] / 4 - correction) / c[0])
    return ratio


def r5_second_mean_value_enclosure(h_cell: arb, z_cell: arb) -> arb:
    """Enclose R_5'' on one h cell using a full-cell R_5''' bound."""

    midpoint_h = arb(h_cell.mid())
    midpoint_z = arb.pi() * (2 * midpoint_h).exp()
    midpoint_log, _ = stabilized_log_jet(midpoint_z)
    midpoint_second = r5_derivative_jet_from_log(midpoint_log)[2]
    cell_log, _ = stabilized_log_jet(z_cell)
    third_derivative = r5_derivative_jet_from_log(cell_log)[3]
    radius = arb(h_cell.rad()) * arb(third_derivative.abs_upper())
    return midpoint_second + arb(0, radius.abs_upper())


def n_mean_value_enclosure(z_cell: arb) -> arb:
    """Enclose N by the configured h-Taylor model on one rational z cell."""

    h_cell = (z_cell / arb.pi()).log() / 2
    midpoint_h = arb(h_cell.mid())
    radius_h = arb(h_cell.rad())
    midpoint_z = arb.pi() * (2 * midpoint_h).exp()
    midpoint_log, _ = stabilized_log_jet(midpoint_z)
    full_log, _ = stabilized_log_jet(z_cell)
    derivative_order = N_TAYLOR_REMAINDER_ORDER
    midpoint_c, midpoint_d = cd_derivative_jets(
        midpoint_log, derivative_order + 1
    )
    full_c, full_d = cd_derivative_jets(full_log, derivative_order + 1)

    def n_jet(c_values: list[arb], d_values: list[arb]) -> list[arb]:
        values: list[arb] = []
        for order in range(derivative_order + 1):
            first = sum(
                (
                    math.comb(order, split)
                    * d_values[split + 1]
                    * c_values[order - split]
                    for split in range(order + 1)
                ),
                arb(0),
            )
            second = sum(
                (
                    math.comb(order, split)
                    * d_values[split]
                    * c_values[order - split + 1]
                    for split in range(order + 1)
                ),
                arb(0),
            )
            values.append(first - second)
        return values

    midpoint_n = n_jet(midpoint_c, midpoint_d)
    full_n = n_jet(full_c, full_d)
    displacement = arb(0, radius_h.abs_upper())
    enclosure = arb(0)
    for order in reversed(range(derivative_order)):
        enclosure = enclosure * displacement + midpoint_n[order] / math.factorial(
            order
        )
    remainder = (
        arb(full_n[derivative_order].abs_upper())
        * radius_h**derivative_order
        / math.factorial(derivative_order)
    )
    return enclosure + arb(0, remainder.abs_upper())


def c_taylor_enclosure(z_cell: arb) -> arb:
    """Enclose C by the same h-Taylor contract used for N."""

    h_cell = (z_cell / arb.pi()).log() / 2
    midpoint_h = arb(h_cell.mid())
    radius_h = arb(h_cell.rad())
    midpoint_z = arb.pi() * (2 * midpoint_h).exp()
    midpoint_log, _ = stabilized_log_jet(midpoint_z)
    full_log, _ = stabilized_log_jet(z_cell)
    derivative_order = N_TAYLOR_REMAINDER_ORDER
    midpoint_c, _ = cd_derivative_jets(midpoint_log, derivative_order)
    full_c, _ = cd_derivative_jets(full_log, derivative_order)
    displacement = arb(0, radius_h.abs_upper())
    enclosure = arb(0)
    for order in reversed(range(derivative_order)):
        enclosure = enclosure * displacement + midpoint_c[order] / math.factorial(
            order
        )
    remainder = (
        arb(full_c[derivative_order].abs_upper())
        * radius_h**derivative_order
        / math.factorial(derivative_order)
    )
    return enclosure + arb(0, remainder.abs_upper())


def h5_quantities(z: arb) -> tuple[dict[str, arb], list[arb]]:
    ell, tails = stabilized_log_jet(z)

    x = -ell[2]
    y = ell[4]
    zz = -ell[6]
    w = ell[8]
    xp = -ell[3]
    yp = ell[5]
    zp = -ell[7]
    wp = ell[9]
    xpp = -ell[4]
    ypp = ell[6]
    zpp = -ell[8]
    wpp = ell[10]

    c = 2 * zz + 60 * x * y + 120 * x**3
    cp = 2 * zp + 60 * (xp * y + x * yp) + 360 * x**2 * xp
    cpp = (
        2 * zpp
        + 60 * (xpp * y + 2 * xp * yp + x * ypp)
        + 720 * x * xp**2
        + 360 * x**2 * xpp
    )

    d = 2 * w + 112 * x * zz + 140 * y**2 + 1680 * x**2 * y + 1680 * x**4
    dp = (
        2 * wp
        + 112 * (xp * zz + x * zp)
        + 280 * y * yp
        + 3360 * x * xp * y
        + 1680 * x**2 * yp
        + 6720 * x**3 * xp
    )
    dpp = (
        2 * wpp
        + 112 * (xpp * zz + 2 * xp * zp + x * zpp)
        + 280 * (yp**2 + y * ypp)
        + 3360 * (xp**2 * y + x * xpp * y + 2 * x * xp * yp)
        + 1680 * x**2 * ypp
        + 6720 * (3 * x**2 * xp**2 + x**3 * xpp)
    )

    numerator = dp * c - d * cp
    r5_second_numerator = (
        dpp * c**2
        - d * cpp * c
        - 2 * dp * c * cp
        + 2 * d * cp**2
    )
    r5_second = r5_second_numerator / (4 * c**3)
    return {
        "C": c,
        "D": d,
        "C_prime": cp,
        "D_prime": dp,
        "N": numerator,
        "N_prime_h": dpp * c - d * cpp,
        "R5_second_derivative": r5_second,
    }, tails


def update_tail_maxima(maxima: list[arb], tails: list[arb]) -> None:
    for index, tail in enumerate(tails):
        if tail.upper() > maxima[index].upper():
            maxima[index] = tail


def trace_cell(
    trace: Any,
    label: str,
    cell_index: int,
    cell: arb,
    target: arb,
    c_value: arb,
) -> None:
    record = "|".join(
        (label, str(cell_index), str(cell), str(target), str(c_value))
    )
    trace.update(record.encode("ascii"))
    trace.update(b"\n")


def minimum_record(
    current: dict[str, Any] | None,
    value: arb,
    cell_index: int,
    cell: arb,
) -> dict[str, Any]:
    if current is None or value.lower() < current["value"].lower():
        return {"value": value, "cell_index": cell_index, "cell": cell}
    return current


def serialize_minimum(record: dict[str, Any]) -> dict[str, Any]:
    return {
        "cell_index": record["cell_index"],
        "cell": interval_record(record["cell"]),
        "target": interval_record(record["value"]),
    }


def build_payload(precision: int = 256) -> dict[str, Any]:
    if not MIN_PRECISION <= precision <= MAX_PRECISION:
        raise ValueError(
            f"precision must lie in [{MIN_PRECISION}, {MAX_PRECISION}]"
        )
    ctx.prec = precision
    ctx.threads = 1
    source_sha256_at_start = file_sha256(SOURCE_PATH)
    trace = hashlib.sha256()
    tail_maxima = [arb(0) for _ in range(MAX_DERIVATIVE + 1)]

    h_minimum: dict[str, Any] | None = None
    for cell_index in range(H_COVER["cells"]):
        h_cell = rational_cell(cell_index, H_COVER["denominator"])
        z_cell = arb.pi() * (2 * h_cell).exp()
        quantities, tails = h5_quantities(z_cell)
        target = r5_second_mean_value_enclosure(h_cell, z_cell)
        c_value = quantities["C"]
        if not c_value > 0:
            raise ArithmeticError(f"C is not positive on h cell {cell_index}")
        if not target > arb(H_COVER["required_lower"]):
            raise ArithmeticError(
                f"R5 second derivative gate failed on h cell {cell_index}: {target}"
            )
        h_minimum = minimum_record(h_minimum, target, cell_index, h_cell)
        update_tail_maxima(tail_maxima, tails)
        trace_cell(trace, "h", cell_index, h_cell, target, c_value)

    z_results: list[dict[str, Any]] = []
    z_cell_total = 0
    for cover_index, cover in enumerate(Z_COVERS):
        minimum: dict[str, Any] | None = None
        for local_index in range(cover["cells"]):
            numerator = cover["lower_numerator"] + local_index
            z_cell = rational_cell(numerator, cover["denominator"])
            quantities, tails = h5_quantities(z_cell)
            target = n_mean_value_enclosure(z_cell)
            c_value = c_taylor_enclosure(z_cell)
            if not c_value > 0:
                raise ArithmeticError(
                    f"C is not positive on z cover {cover_index}, cell {local_index}"
                )
            if not target > arb(cover["required_lower"]):
                raise ArithmeticError(
                    f"N gate failed on z cover {cover_index}, cell {local_index}: {target}"
                )
            minimum = minimum_record(minimum, target, local_index, z_cell)
            update_tail_maxima(tail_maxima, tails)
            trace_cell(
                trace,
                f"z{cover_index}",
                local_index,
                z_cell,
                target,
                c_value,
            )
            z_cell_total += 1
        if minimum is None:
            raise ArithmeticError("empty z cover")
        z_results.append(
            {
                "cover_index": cover_index,
                "lower": f"{cover['lower_numerator']}/{cover['denominator']}",
                "upper": f"{cover['upper_numerator']}/{cover['denominator']}",
                "width": f"1/{cover['denominator']}",
                "cells": cover["cells"],
                "required_lower": cover["required_lower"],
                "minimum": serialize_minimum(minimum),
            }
        )

    if h_minimum is None:
        raise ArithmeticError("empty h cover")
    source_sha256_at_end = file_sha256(SOURCE_PATH)
    checks = {
        "h_cover_has_600_closed_cells": H_COVER["cells"] == 600,
        "z_covers_have_2700_closed_cells": z_cell_total == 2700,
        "complete_theta_tail_enclosed_from_orbit_7": (
            FIRST_OMITTED_ORBIT == 7
        ),
        "all_C_intervals_positive": True,
        "all_h_cells_R5_second_derivative_above_416": True,
        "all_z_cells_N_above_cover_threshold": True,
        "arb_internal_threads_equal_one": ctx.threads == 1,
        "worker_source_unchanged_during_run": (
            source_sha256_at_start == source_sha256_at_end
        ),
    }
    checks["all_checks_passed"] = all(checks.values())
    if not checks["all_checks_passed"]:
        failed = [name for name, passed in checks.items() if not passed]
        raise ArithmeticError(f"H5 compact Arb gate failed: {failed}")

    return {
        "schema_version": SCHEMA_VERSION,
        "status": STATUS,
        "parameters": {
            "arb_precision_bits": precision,
            "arb_internal_threads": ctx.threads,
            "maximum_theta_derivative": MAX_DERIVATIVE,
            "maximum_stabilized_log_derivative": MAX_DERIVATIVE - 1,
            "summed_theta_orbits": SUMMED_ORBITS,
            "first_omitted_theta_orbit": FIRST_OMITTED_ORBIT,
            "total_cells": H_COVER["cells"] + z_cell_total,
        },
        "exact_formulas": {
            "theta_derivatives": (
                "psi^(j)=4*exp(h/2)*sum_(n>=1) "
                "P_j(n^2*z)*exp(-n^2*z), z=pi*exp(2h)"
            ),
            "theta_recurrence": (
                "P_0=2*z^2-3*z; P_(j+1)=P_j/2+2*z*(P_j'-P_j)"
            ),
            "C": "2*Z+60*X*Y+120*X^3",
            "D": "2*W+112*X*Z+140*Y^2+1680*X^2*Y+1680*X^4",
            "N": "D_prime*C-D*C_prime",
            "R5_second": (
                "(D_second*C^2-D*C_second*C-2*D_prime*C*C_prime"
                "+2*D*C_prime^2)/(4*C^3)"
            ),
        },
        "tail_contract": {
            "majorant": "B_j(x)=sum_k abs(coeff(P_j,k))*x^k",
            "first_omitted_orbit": FIRST_OMITTED_ORBIT,
            "geometric_ratio": (
                "((n+1)/n)^(2*deg(P_j))*exp(-(2*n+1)*z), evaluated at n=7"
            ),
            "all_ratios_below_one_half": True,
            "maximum_tail_radii_by_derivative": {
                str(index): interval_record(value)
                for index, value in enumerate(tail_maxima)
            },
        },
        "compact_certificate": {
            "h_cover": {
                "lower": "0",
                "upper": "3/25",
                "width": "1/5000",
                "cells": H_COVER["cells"],
                "required_lower": H_COVER["required_lower"],
                "minimum": serialize_minimum(h_minimum),
            },
            "z_covers": z_results,
            "all_cell_interval_trace_sha256": trace.hexdigest(),
        },
        "checks": checks,
        "outcome": {
            "compact_h5_ratio_monotonicity_certified": True,
            "conclusion": (
                "R5'' is positive on 0<=h<=3/25 and N is positive on "
                "15/4<=z<=32. Together with R5'(0)=0 this certifies the "
                "compact part of the fixed-H5 ratio theorem only."
            ),
        },
        "provenance": {
            "source": "src/certify_h5_ratio_compact.py",
            "source_sha256_at_start": source_sha256_at_start,
            "source_sha256_at_end": source_sha256_at_end,
            "python_version": platform.python_version(),
            "python_flint_version": flint.__version__,
        },
        "scope": (
            "Rigorous compact interval replay for the fixed complete-theta H5 "
            "ratio only. The analytic outer proof is not replayed here. This "
            "does not certify the signed c5 payment, any higher degree, the "
            "global first Xi Laguerre sign, or RH."
        ),
    }


def atomic_write_json(path: Path, payload: dict[str, Any], max_bytes: int) -> None:
    if not 1 <= max_bytes <= HARD_MAX_OUTPUT_BYTES:
        raise ValueError(f"max bytes must lie in [1, {HARD_MAX_OUTPUT_BYTES}]")
    rendered = json.dumps(
        payload, indent=2, sort_keys=True, ensure_ascii=True, allow_nan=False
    ).encode("ascii") + b"\n"
    if len(rendered) > max_bytes:
        raise ValueError(f"rendered output {len(rendered)} exceeds {max_bytes}")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    try:
        with temporary.open("wb") as handle:
            handle.write(rendered)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--precision", type=int, default=256)
    parser.add_argument("--max-output-bytes", type=int, default=HARD_MAX_OUTPUT_BYTES)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    payload = build_payload(args.precision)
    atomic_write_json(args.output, payload, args.max_output_bytes)
    print(
        json.dumps(
            {
                "status": payload["status"],
                "all_checks_passed": payload["checks"]["all_checks_passed"],
                "cell_trace_sha256": payload["compact_certificate"][
                    "all_cell_interval_trace_sha256"
                ],
                "output": str(args.output),
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
