#!/usr/bin/env python3
"""Parity-specific graded-residue interpolation scout.

This is an analytic-obstruction pattern experiment, not a certificate and not
an RH proof.  It keeps the exact Fraction recurrence from GRADED_RESIDUE.md,
then uses high-precision interpolation to ask whether the known full-filtration
residue obstruction appears separately in the even- or odd-grade filtration.

The first ``N`` discrete theta-orbit nodes are imposed as interpolation zeros.
Their contribution to the reported polynomial L2 norm is therefore separated
from (and not silently mixed into) the tail norm.  Root residuals, scaled
conditioning, and cancellation diagnostics are part of every output.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import platform
import sys
import time
from fractions import Fraction
from pathlib import Path
from typing import Iterable, Sequence

import mpmath as mp


SCHEMA_VERSION = 1
SOURCE_PATH = Path(__file__).resolve()
HALF = Fraction(1, 2)
THREE_HALVES = Fraction(3, 2)


Poly = tuple[Fraction, ...]  # coefficients in ascending powers of z


def trim(poly: Sequence[Fraction]) -> Poly:
    values = list(poly)
    while len(values) > 1 and values[-1] == 0:
        values.pop()
    return tuple(values or [Fraction(0)])


def add_poly(left: Sequence[Fraction], right: Sequence[Fraction]) -> Poly:
    size = max(len(left), len(right))
    result = [Fraction(0) for _ in range(size)]
    for index, value in enumerate(left):
        result[index] += value
    for index, value in enumerate(right):
        result[index] += value
    return trim(result)


def scale_poly(poly: Sequence[Fraction], scalar: Fraction) -> Poly:
    return trim([scalar * value for value in poly])


def shift_z(poly: Sequence[Fraction]) -> Poly:
    return trim([Fraction(0), *poly])


def derivative(poly: Sequence[Fraction]) -> Poly:
    if len(poly) <= 1:
        return (Fraction(0),)
    return trim([index * poly[index] for index in range(1, len(poly))])


def eval_fraction(poly: Sequence[Fraction], value: Fraction) -> Fraction:
    total = Fraction(0)
    for coefficient in reversed(poly):
        total = total * value + coefficient
    return total


def divided_by_two_z_minus_three(
    poly: Sequence[Fraction], value_at_three_halves: Fraction
) -> Poly:
    """Return (A(z)-A(3/2))/(2z-3), exactly as a Fraction polynomial."""

    result = [Fraction(0) for _ in range(max(1, len(poly) - 1))]
    for power in range(1, len(poly)):
        coefficient = poly[power] * HALF
        for output_power in range(power):
            result[output_power] += coefficient * THREE_HALVES ** (
                power - 1 - output_power
            )
    quotient = trim(result)

    # This identity catches indexing mistakes in the exact divided difference.
    reconstructed = add_poly(
        scale_poly(shift_z(quotient), Fraction(2)),
        scale_poly(quotient, Fraction(-3)),
    )
    expected = list(poly)
    expected[0] -= value_at_three_halves
    assert trim(reconstructed) == trim(expected)
    return quotient


def rising_three_halves(power: int) -> Fraction:
    result = Fraction(1)
    for index in range(power):
        result *= THREE_HALVES + index
    return result


def ell_exact(poly: Sequence[Fraction]) -> Fraction:
    return sum(
        (
            Fraction(2 * power)
            * coefficient
            * rising_three_halves(power)
            for power, coefficient in enumerate(poly)
            if power
        ),
        Fraction(0),
    )


def graded_basis(max_grade: int) -> list[tuple[Poly, Fraction]]:
    """Generate exact A_j,c_j with A_j+c_j/(2z-3)=P_j/P_0."""

    if max_grade < 0:
        raise ValueError("max_grade must be nonnegative")
    basis: list[tuple[Poly, Fraction]] = []
    current: Poly = (Fraction(1),)
    residue = Fraction(0)
    for grade in range(max_grade + 1):
        # The modular residue is exactly c_j=-ell(A_j).
        assert residue + ell_exact(current) == 0
        assert len(current) - 1 == grade
        assert current[-1] == Fraction((-2) ** grade)
        basis.append((current, residue))
        if grade == max_grade:
            break

        at_three_halves = eval_fraction(current, THREE_HALVES)
        divided = divided_by_two_z_minus_three(current, at_three_halves)
        next_poly = scale_poly(shift_z(derivative(current)), Fraction(2))
        next_poly = add_poly(next_poly, scale_poly(current, Fraction(9, 2)))
        next_poly = add_poly(next_poly, scale_poly(shift_z(current), Fraction(-2)))
        next_poly = add_poly(next_poly, scale_poly(divided, Fraction(6)))
        next_poly = add_poly(next_poly, (Fraction(-residue),))
        next_residue = 6 * at_three_halves - residue * HALF
        current, residue = next_poly, next_residue
    return basis


def fraction_string(value: Fraction) -> str:
    if value.denominator == 1:
        return str(value.numerator)
    return f"{value.numerator}/{value.denominator}"


def mp_string(value: mp.mpf, digits: int) -> str:
    return mp.nstr(value, n=max(20, digits), strip_zeros=False)


def mp_from_fraction(value: Fraction) -> mp.mpf:
    return mp.mpf(value.numerator) / value.denominator


def eval_mp(poly: Sequence[mp.mpf], value: mp.mpf) -> mp.mpf:
    total = mp.mpf("0")
    for coefficient in reversed(poly):
        total = total * value + coefficient
    return total


def exact_poly_to_mp(poly: Sequence[Fraction]) -> list[mp.mpf]:
    return [mp_from_fraction(value) for value in poly]


def combine_monomials(
    selected: Sequence[tuple[Poly, Fraction]], coefficients: Sequence[mp.mpf]
) -> list[mp.mpf]:
    size = max(len(poly) for poly, _ in selected)
    result = [mp.mpf("0") for _ in range(size)]
    for coefficient, (poly, _) in zip(coefficients, selected):
        for power, value in enumerate(poly):
            result[power] += coefficient * mp_from_fraction(value)
    return result


def matrix_inf_norm(matrix: mp.matrix) -> mp.mpf:
    return max(
        sum(abs(matrix[row, column]) for column in range(matrix.cols))
        for row in range(matrix.rows)
    )


def interpolation(
    n: int,
    parity: str,
    h: mp.mpf,
    basis: Sequence[tuple[Poly, Fraction]],
    progress: bool,
) -> dict[str, object]:
    grades = [2 * index + (1 if parity == "odd" else 0) for index in range(n + 1)]
    selected = [basis[grade] for grade in grades]
    orbit_scale = mp.pi * mp.exp(2 * h)
    nodes = [orbit_scale * index * index for index in range(1, n + 1)]

    original = mp.matrix(n + 1, n + 1)
    for row, node in enumerate(nodes):
        for column, (poly, _) in enumerate(selected):
            original[row, column] = eval_mp(exact_poly_to_mp(poly), node)
    for column, (poly, _) in enumerate(selected):
        original[n, column] = mp_from_fraction(poly[0])

    right = mp.matrix([mp.mpf("0") for _ in range(n)] + [mp.mpf("1")])
    column_scales = [
        max(abs(original[row, column]) for row in range(n + 1))
        for column in range(n + 1)
    ]
    if any(scale == 0 for scale in column_scales):
        raise ArithmeticError("zero interpolation column")
    column_scaled = mp.matrix(n + 1, n + 1)
    for row in range(n + 1):
        for column in range(n + 1):
            column_scaled[row, column] = (
                original[row, column] / column_scales[column]
            )
    row_scales = [
        max(abs(column_scaled[row, column]) for column in range(n + 1))
        for row in range(n + 1)
    ]
    if any(scale == 0 for scale in row_scales):
        raise ArithmeticError("zero interpolation row")
    scaled = mp.matrix(n + 1, n + 1)
    scaled_right = mp.matrix(n + 1, 1)
    for row in range(n + 1):
        scaled_right[row] = right[row] / row_scales[row]
        for column in range(n + 1):
            scaled[row, column] = column_scaled[row, column] / row_scales[row]

    if progress:
        print(
            json.dumps({"event": "interpolation_solve", "n": n, "parity": parity}),
            file=sys.stderr,
            flush=True,
        )
    scaled_coefficients = mp.lu_solve(scaled, scaled_right)
    coefficients = [
        scaled_coefficients[index] / column_scales[index]
        for index in range(n + 1)
    ]
    monomials = combine_monomials(selected, coefficients)

    inverse = scaled ** -1
    condition = matrix_inf_norm(scaled) * matrix_inf_norm(inverse)
    root_rows: list[dict[str, mp.mpf]] = []
    for node in nodes:
        value = eval_mp(monomials, node)
        cancellation_scale = mp.fsum(
            abs(coefficient)
            * abs(eval_mp(exact_poly_to_mp(poly), node))
            for coefficient, (poly, _) in zip(coefficients, selected)
        )
        root_rows.append(
            {
                "node": node,
                "value": value,
                "relative": abs(value) / max(mp.mpf("1"), cancellation_scale),
            }
        )

    normalization = eval_mp(monomials, mp.mpf("0"))
    ell_from_monomials = mp.fsum(
        mp.mpf(2 * power)
        * coefficient
        * mp_from_fraction(rising_three_halves(power))
        for power, coefficient in enumerate(monomials)
        if power
    )
    residue_from_basis = mp.fsum(
        coefficient * mp_from_fraction(residue)
        for coefficient, (_, residue) in zip(coefficients, selected)
    )

    return {
        "grades": grades,
        "selected": selected,
        "nodes": nodes,
        "orbit_scale": orbit_scale,
        "coefficients": coefficients,
        "monomials": monomials,
        "ell": ell_from_monomials,
        "residue": residue_from_basis,
        "condition": condition,
        "root_rows": root_rows,
        "normalization": normalization,
        "column_scales": column_scales,
        "row_scales": row_scales,
    }


def raw_orbit_weight(z: mp.mpf) -> mp.mpf:
    # The common positive factor 4 exp(h/2) cancels in the orbit law.
    return z * (2 * z - 3) * mp.exp(-z)


def choose_orbit_cutoff(n: int, degree: int, orbit_scale: mp.mpf, dps: int) -> int:
    # Beyond this point exp(-x n^2) dominates both the degree-2*degree
    # squared-polynomial growth and the requested decimal working precision.
    target = (2 * degree + dps * math.log(10) + 40) / float(orbit_scale)
    asymptotic = math.ceil(math.sqrt(max(1.0, target))) + 8
    return max(n + 20, 18, asymptotic)


def orbit_diagnostics(
    n: int,
    orbit_scale: mp.mpf,
    monomials: Sequence[mp.mpf],
    ell: mp.mpf,
    dps: int,
    progress: bool,
) -> dict[str, object]:
    degree = len(monomials) - 1
    cutoff = choose_orbit_cutoff(n, degree, orbit_scale, dps)
    if progress:
        print(
            json.dumps({"event": "orbit_sum", "cutoff": cutoff, "degree": degree}),
            file=sys.stderr,
            flush=True,
        )

    rows: list[dict[str, mp.mpf | int]] = []
    normalizer = mp.mpf("0")
    for index in range(1, cutoff + 1):
        z = orbit_scale * index * index
        weight = raw_orbit_weight(z)
        normalizer += weight
        value = eval_mp(monomials, z)
        feature = value - ell / (2 * z - 3)
        rows.append(
            {"index": index, "z": z, "weight": weight, "A": value, "U": feature}
        )

    polynomial_first = mp.fsum(
        row["weight"] * abs(row["A"]) ** 2 for row in rows[:n]
    ) / normalizer
    polynomial_tail = mp.fsum(
        row["weight"] * abs(row["A"]) ** 2 for row in rows[n:]
    ) / normalizer
    feature_first = mp.fsum(
        row["weight"] * abs(row["U"]) ** 2 for row in rows[:n]
    ) / normalizer
    feature_tail = mp.fsum(
        row["weight"] * abs(row["U"]) ** 2 for row in rows[n:]
    ) / normalizer

    next_index = cutoff + 1
    next_z = orbit_scale * next_index * next_index
    next_weight = raw_orbit_weight(next_z)
    last_weight = rows[-1]["weight"]
    weight_ratio = next_weight / last_weight
    next_a = eval_mp(monomials, next_z)
    next_u = next_a - ell / (2 * next_z - 3)
    next_polynomial_term = next_weight * abs(next_a) ** 2 / normalizer
    next_feature_term = next_weight * abs(next_u) ** 2 / normalizer

    sample_indices = sorted({1, min(2, n), n, n + 1, n + 2, cutoff})
    samples = [rows[index - 1] for index in sample_indices]
    polynomial_with_residual = polynomial_first + polynomial_tail
    feature_total = feature_first + feature_tail
    return {
        "cutoff": cutoff,
        "normalizer": normalizer,
        "polynomial_first_n_residual": polynomial_first,
        "polynomial_tail_l2_squared": polynomial_tail,
        "polynomial_l2_squared_first_n_exactly_zero": polynomial_tail,
        "polynomial_l2_squared_with_interpolation_residual": polynomial_with_residual,
        "interpolation_residual_over_exact_zero_norm": polynomial_first
        / polynomial_tail
        if polynomial_tail > 0
        else mp.inf,
        "augmented_feature_first_n_l2_squared": feature_first,
        "augmented_feature_tail_l2_squared": feature_tail,
        "augmented_feature_total_l2_squared": feature_total,
        "ell_over_polynomial_l2": abs(ell) / mp.sqrt(polynomial_tail)
        if polynomial_tail > 0
        else mp.inf,
        "augmented_over_polynomial_l2": mp.sqrt(feature_total / polynomial_tail)
        if polynomial_tail > 0
        else mp.inf,
        "next_weight_ratio": weight_ratio,
        "next_polynomial_term": next_polynomial_term,
        "next_augmented_term": next_feature_term,
        "samples": samples,
    }


def max_fraction_bits(selected: Iterable[tuple[Poly, Fraction]]) -> int:
    maximum = 1
    for poly, residue in selected:
        values = [*poly, residue]
        for value in values:
            maximum = max(
                maximum,
                abs(value.numerator).bit_length(),
                value.denominator.bit_length(),
            )
    return maximum


def run_experiment(
    *, n: int, parity: str, h_value: str | float, dps: int, progress: bool = False
) -> dict[str, object]:
    if n < 1:
        raise ValueError("n must be at least 1")
    if parity not in {"even", "odd"}:
        raise ValueError("parity must be 'even' or 'odd'")
    h_text = h_value if isinstance(h_value, str) else format(h_value, ".17g")
    if mp.mpf(h_text) < 0:
        raise ValueError("h must be nonnegative for this positive-half-line model")
    if dps < 50:
        raise ValueError("dps must be at least 50")

    started = time.time()
    max_grade = 2 * n + (1 if parity == "odd" else 0)
    exact_basis = graded_basis(max_grade)
    grades = [2 * index + (1 if parity == "odd" else 0) for index in range(n + 1)]
    selected = [exact_basis[grade] for grade in grades]
    if progress:
        print(
            json.dumps({"event": "exact_basis", "max_grade": max_grade}),
            file=sys.stderr,
            flush=True,
        )

    with mp.workdps(dps):
        h = mp.mpf(h_text)
        solved = interpolation(n, parity, h, exact_basis, progress)
        orbit = orbit_diagnostics(
            n,
            solved["orbit_scale"],
            solved["monomials"],
            solved["ell"],
            dps,
            progress,
        )
        output_digits = max(30, dps - 12)

        def encode(value: object) -> object:
            if isinstance(value, mp.mpf):
                return mp_string(value, output_digits)
            if isinstance(value, dict):
                return {str(key): encode(item) for key, item in value.items()}
            if isinstance(value, (list, tuple)):
                return [encode(item) for item in value]
            return value

        root_max_abs = max(abs(row["value"]) for row in solved["root_rows"])
        root_max_relative = max(row["relative"] for row in solved["root_rows"])
        nonzero_coefficients = [
            abs(value) for value in solved["coefficients"] if value != 0
        ]
        exact_rows = [
            {
                "grade": grade,
                "A_coefficients_low_to_high": [
                    fraction_string(value) for value in poly
                ],
                "c_residue": fraction_string(residue),
                "minus_ell_A": fraction_string(-ell_exact(poly)),
            }
            for grade, (poly, residue) in zip(grades, selected)
        ]

        payload: dict[str, object] = {
            "schema_version": SCHEMA_VERSION,
            "status": "analytic_pattern_experiment",
            "experiment": "parity-graded-residue-interpolation",
            "parameters": {
                "n": n,
                "parity": parity,
                "h": h_text,
                "dps": dps,
            },
            "exact_fraction_basis": exact_rows,
            "interpolant": {
                "normalization": "A(0)=1",
                "zero_nodes": "z_k=pi*exp(2h)*k^2, 1<=k<=n",
                "graded_coefficients": encode(solved["coefficients"]),
                "monomial_coefficients_low_to_high": encode(solved["monomials"]),
                "ell_A": encode(solved["ell"]),
                "c_residue_from_basis": encode(solved["residue"]),
                "residue_identity_error": encode(solved["residue"] + solved["ell"]),
            },
            "diagnostics": {
                "scaled_interpolation_condition_inf": encode(solved["condition"]),
                "estimated_decimal_digits_lost": encode(
                    max(mp.mpf("0"), mp.log10(solved["condition"]))
                ),
                "normalization_residual": encode(solved["normalization"] - 1),
                "max_root_residual_absolute": encode(root_max_abs),
                "max_root_residual_relative_to_cancellation_scale": encode(
                    root_max_relative
                ),
                "root_rows": encode(solved["root_rows"]),
                "max_abs_graded_coefficient": encode(max(nonzero_coefficients)),
                "min_abs_nonzero_graded_coefficient": encode(
                    min(nonzero_coefficients)
                ),
                "max_abs_monomial_coefficient": encode(
                    max(abs(value) for value in solved["monomials"])
                ),
                "max_exact_fraction_integer_bits": max_fraction_bits(selected),
            },
            "orbit_l2": encode(orbit),
            "interpretation": {
                "question": (
                    "Does the full-filtration modular-residue obstruction persist "
                    "inside this parity-grade filtration as n grows?"
                ),
                "signal": (
                    "Growth of |ell(A)|/||A||_L2(p), stable under precision "
                    "increase, supports an obstruction pattern; bounded values do "
                    "not prove a uniform inequality."
                ),
                "first_n_policy": (
                    "The first n polynomial orbit contributions are reported only "
                    "as interpolation residuals; the mathematical interpolant sets "
                    "them to zero.  The augmented residue feature is evaluated there."
                ),
            },
            "scope": (
                "High-precision analytic-obstruction pattern discovery only. "
                "Finite n, numerical interpolation, or apparent asymptotic growth "
                "does not prove an all-degree statement and has no RH implication."
            ),
            "provenance": {
                "source_sha256": hashlib.sha256(SOURCE_PATH.read_bytes()).hexdigest(),
                "python": sys.version,
                "python_executable": sys.executable,
                "mpmath": mp.__version__,
                "platform": platform.platform(),
                "pid": os.getpid(),
            },
            "timing_seconds": time.time() - started,
        }
        return payload


def atomic_write_json(path: Path, payload: dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + f".tmp.{os.getpid()}")
    with temporary.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, sort_keys=True)
        handle.write("\n")
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, path)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--n", type=int, required=True)
    parser.add_argument("--parity", choices=("even", "odd"), required=True)
    parser.add_argument("--h", required=True)
    parser.add_argument("--dps", type=int, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--progress", action="store_true")
    args = parser.parse_args()
    payload = run_experiment(
        n=args.n,
        parity=args.parity,
        h_value=args.h,
        dps=args.dps,
        progress=args.progress,
    )
    atomic_write_json(args.output, payload)
    print(
        json.dumps(
            {
                "status": payload["status"],
                "output": str(args.output),
                "parameters": payload["parameters"],
                "ell_over_polynomial_l2": payload["orbit_l2"][
                    "ell_over_polynomial_l2"
                ],
                "timing_seconds": payload["timing_seconds"],
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
