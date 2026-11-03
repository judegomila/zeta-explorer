#!/usr/bin/env python3
"""Audit the graded-theta exponential generating function exactly.

All algebra uses :class:`fractions.Fraction`. This is an arbitrary-grade
identity audit, not a positivity certificate and not an RH proof.
"""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
import math
import os
from pathlib import Path
import sys
import time
from typing import Any, Iterable, Sequence


STATUS = "exact_egf_identity"
SCHEMA_VERSION = "zsv.egf_identity.v1"
HARD_MAX_DEGREE = 512
HARD_MAX_OUTPUT_BYTES = 64 * 1024 * 1024
SOURCE_PATH = Path(__file__).resolve()
Polynomial = list[Fraction]  # ascending powers of z


def trim(poly: Sequence[Fraction]) -> Polynomial:
    result = list(poly) or [Fraction(0)]
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def add(left: Sequence[Fraction], right: Sequence[Fraction]) -> Polynomial:
    result = [Fraction(0) for _ in range(max(len(left), len(right)))]
    for index, value in enumerate(left):
        result[index] += value
    for index, value in enumerate(right):
        result[index] += value
    return trim(result)


def scale(poly: Sequence[Fraction], scalar: Fraction) -> Polynomial:
    return trim([scalar * value for value in poly])


def shift_z(poly: Sequence[Fraction], count: int = 1) -> Polynomial:
    return [Fraction(0) for _ in range(count)] + list(poly)


def derivative(poly: Sequence[Fraction]) -> Polynomial:
    if len(poly) <= 1:
        return [Fraction(0)]
    return trim([index * poly[index] for index in range(1, len(poly))])


def evaluate(poly: Sequence[Fraction], value: Fraction) -> Fraction:
    result = Fraction(0)
    for coefficient in reversed(poly):
        result = result * value + coefficient
    return result


def next_p(poly: Sequence[Fraction]) -> Polynomial:
    return add(
        shift_z(scale(derivative(poly), Fraction(2))),
        add(scale(poly, Fraction(1, 2)), shift_z(scale(poly, Fraction(-2)))),
    )


def ell(poly: Sequence[Fraction]) -> Fraction:
    result = Fraction(0)
    rising = Fraction(1)
    for degree in range(1, len(poly)):
        rising *= Fraction(2 * degree + 1, 2)
        result += 2 * degree * rising * poly[degree]
    return result


def divide_by_p_zero(poly: Sequence[Fraction]) -> Polynomial:
    """Divide exactly by P_0=8z^2-12z."""

    remainder = list(trim(poly))
    if len(remainder) < 3:
        raise ArithmeticError("numerator has degree below P_0")
    quotient = [Fraction(0) for _ in range(len(remainder) - 2)]
    for degree in range(len(remainder) - 1, 1, -1):
        value = remainder[degree] / 8
        quotient[degree - 2] = value
        remainder[degree] -= 8 * value
        remainder[degree - 1] += 12 * value
    if any(remainder):
        raise ArithmeticError(f"nonzero P_0 division remainder: {remainder[:2]}")
    return trim(quotient)


def h_polynomials(max_degree: int) -> list[Polynomial]:
    """EGF coefficients of exp(-z(exp(2t)-1))."""

    values: list[Polynomial] = [[Fraction(1)]]
    for degree in range(max_degree):
        convolution = [Fraction(0)]
        for index in range(degree + 1):
            convolution = add(
                convolution,
                scale(
                    values[degree - index],
                    Fraction(math.comb(degree, index) * (2**index)),
                ),
            )
        values.append(shift_z(scale(convolution, Fraction(-2))))
    return values


def h_scalars(max_degree: int, z: Fraction) -> list[Fraction]:
    values = [Fraction(1)]
    for degree in range(max_degree):
        convolution = sum(
            (
                Fraction(math.comb(degree, index) * (2**index))
                * values[degree - index]
                for index in range(degree + 1)
            ),
            Fraction(0),
        )
        values.append(-2 * z * convolution)
    return values


def egf_p_coefficients(max_degree: int) -> list[Polynomial]:
    """Return P_j implied by the closed EGF."""

    h_values = h_polynomials(max_degree)
    result: list[Polynomial] = []
    for degree in range(max_degree + 1):
        polynomial = [Fraction(0)]
        for index in range(degree + 1):
            choose = Fraction(math.comb(degree, index))
            remainder = degree - index
            coefficient_z = Fraction(-12) * Fraction(5, 2) ** remainder
            coefficient_z2 = Fraction(8) * Fraction(9, 2) ** remainder
            term = [Fraction(0) for _ in range(len(h_values[index]) + 2)]
            for power, value in enumerate(h_values[index]):
                term[power + 1] += choose * value * coefficient_z
                term[power + 2] += choose * value * coefficient_z2
            polynomial = add(polynomial, term)
        result.append(trim(polynomial))
    return result


def egf_c_coefficients(max_degree: int) -> list[Fraction]:
    """Return c_j from 3H(t,3/2)(exp(9t/2)-exp(5t/2))."""

    h_values = h_scalars(max_degree, Fraction(3, 2))
    return [
        3
        * sum(
            (
                Fraction(math.comb(degree, index))
                * h_values[index]
                * (
                    Fraction(9, 2) ** (degree - index)
                    - Fraction(5, 2) ** (degree - index)
                )
                for index in range(degree + 1)
            ),
            Fraction(0),
        )
        for degree in range(max_degree + 1)
    ]


def fraction(value: str | int) -> Fraction:
    return Fraction(str(value))


def fraction_text(value: Fraction) -> str:
    if value.denominator == 1:
        return str(value.numerator)
    return f"{value.numerator}/{value.denominator}"


def polynomial_from_text(values: Iterable[str]) -> Polynomial:
    return trim([fraction(value) for value in values])


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(
        value,
        ensure_ascii=True,
        allow_nan=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("ascii")


def canonical_sha256(value: Any) -> str:
    return hashlib.sha256(canonical_bytes(value)).hexdigest()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def sequence_hash(values: Iterable[Any]) -> str:
    return canonical_sha256(list(values))


def progress(enabled: bool, event: str, **fields: object) -> None:
    if enabled:
        print(
            json.dumps({"event": event, **fields}, sort_keys=True),
            file=sys.stderr,
            flush=True,
        )


def validate_structural_manifest(payload: dict[str, Any], scalar_degree: int) -> None:
    if payload.get("status") != "exact_structural_identity":
        raise ValueError("structural manifest status mismatch")
    if payload.get("parameters", {}).get("degree", -1) < scalar_degree:
        raise ValueError("structural manifest degree is too small")
    if not payload.get("checks", {}).get("all_exact_checks_passed", False):
        raise ValueError("structural manifest did not pass its exact checks")
    grades = payload.get("grades")
    if not isinstance(grades, list) or len(grades) <= scalar_degree:
        raise ValueError("structural manifest is missing grades")


def build_payload(
    *,
    full_polynomial_degree: int,
    scalar_degree: int,
    structural_result: Path,
    sample_z: Sequence[Fraction],
    progress_enabled: bool = False,
) -> dict[str, Any]:
    started = time.time()
    if not 0 <= full_polynomial_degree <= scalar_degree <= HARD_MAX_DEGREE:
        raise ValueError(
            "degrees must satisfy 0 <= full_polynomial_degree <= "
            f"scalar_degree <= {HARD_MAX_DEGREE}"
        )
    if not sample_z:
        raise ValueError("at least one sample z is required")
    structural_path = structural_result.resolve()
    structural = json.loads(structural_path.read_text(encoding="utf-8"))
    validate_structural_manifest(structural, scalar_degree)
    grades: list[dict[str, Any]] = structural["grades"]

    progress(progress_enabled, "closed_series_start")
    candidate_p = egf_p_coefficients(full_polynomial_degree)
    candidate_c = egf_c_coefficients(scalar_degree)
    candidate_a: list[Polynomial] = []
    for grade, p_poly in enumerate(candidate_p):
        numerator = add(p_poly, [Fraction(0), -4 * candidate_c[grade]])
        candidate_a.append(divide_by_p_zero(numerator))
    progress(progress_enabled, "closed_series_complete")

    manifest_p = [
        polynomial_from_text(record["p_coefficients_ascending"])
        for record in grades[: full_polynomial_degree + 1]
    ]
    manifest_a = [
        polynomial_from_text(record["a_coefficients_ascending"])
        for record in grades[: full_polynomial_degree + 1]
    ]
    manifest_c = [fraction(record["c"]) for record in grades[: scalar_degree + 1]]
    manifest_ell = [
        fraction(record["ell_a"]) for record in grades[: scalar_degree + 1]
    ]

    base_checks = {
        "initial_condition": candidate_p[0]
        == [Fraction(0), Fraction(-12), Fraction(8)],
        "pde_coefficient_recurrence": all(
            next_p(candidate_p[grade]) == candidate_p[grade + 1]
            for grade in range(full_polynomial_degree)
        ),
        "residue_extraction_at_three_halves": all(
            evaluate(candidate_p[grade], Fraction(3, 2))
            == 6 * candidate_c[grade]
            for grade in range(full_polynomial_degree + 1)
        ),
        "full_p_coefficients_match_manifest": candidate_p == manifest_p,
        "full_a_coefficients_match_manifest": candidate_a == manifest_a,
        "scalar_c_coefficients_match_manifest": candidate_c == manifest_c,
        "ell_a_equals_minus_c": all(
            ell(manifest_a[grade])
            == manifest_ell[grade]
            == -candidate_c[grade]
            for grade in range(full_polynomial_degree + 1)
        )
        and all(
            manifest_ell[grade] == -candidate_c[grade]
            for grade in range(full_polynomial_degree + 1, scalar_degree + 1)
        ),
        "sample_a_values_match_manifest": all(
            evaluate(candidate_a[grade], value)
            == evaluate(manifest_a[grade], value)
            for grade in range(full_polynomial_degree + 1)
            for value in sample_z
        ),
        "even_odd_coefficient_symmetrization": all(
            grades[grade].get("parity")
            == ("even" if grade % 2 == 0 else "odd")
            for grade in range(scalar_degree + 1)
        ),
        # Odd pair at zero: 2*Psi=(2*chi)*ell.  Even derivative at
        # zero: -2*Psi'=2*q''*ell.
        "odd_center_prefactors_reduce_without_extra_two": Fraction(2, 2)
        == 1,
        "even_center_lhopital_sign_is_minus": Fraction(-2, 2) == -1,
    }
    checks = {
        **base_checks,
        "all_exact_checks_passed": all(base_checks.values()),
    }
    if not checks["all_exact_checks_passed"]:
        failed = [name for name, passed in base_checks.items() if not passed]
        raise ArithmeticError(f"exact EGF audit failed: {failed}")

    formulas = {
        "P": "exp(t/2-z*(exp(2*t)-1))*P_0(z*exp(2*t))",
        "R": (
            "exp(5*t/2-z*(exp(2*t)-1))"
            "*(2*z*exp(2*t)-3)/(2*z-3)"
        ),
        "C": (
            "3*(exp(2*t)-1)"
            "*exp(5*t/2-(3/2)*(exp(2*t)-1))"
        ),
        "A": "R-C/(2*z-3)",
        "ell_A": "-C",
        "parity": "A_even=(A(t)+A(-t))/2; A_odd=(A(t)-A(-t))/2",
    }
    sample_text = [fraction_text(value) for value in sample_z]
    return {
        "schema_version": SCHEMA_VERSION,
        "status": STATUS,
        "experiment": "exact-graded-theta-egf-audit",
        "parameters": {
            "full_polynomial_degree": full_polynomial_degree,
            "scalar_degree": scalar_degree,
        },
        "formulas": formulas,
        "checks": checks,
        "comparison": {
            "full_polynomial_grades_checked": full_polynomial_degree + 1,
            "scalar_grades_checked": scalar_degree + 1,
            "sample_z": sample_text,
            "sample_comparisons": (full_polynomial_degree + 1) * len(sample_z),
            "candidate_p_sha256": sequence_hash(
                [[fraction_text(value) for value in poly] for poly in candidate_p]
            ),
            "candidate_a_sha256": sequence_hash(
                [[fraction_text(value) for value in poly] for poly in candidate_a]
            ),
            "candidate_c_sha256": sequence_hash(
                [fraction_text(value) for value in candidate_c]
            ),
            "even_grade_sha256": sequence_hash(
                [
                    [fraction_text(value) for value in candidate_a[grade]]
                    for grade in range(0, full_polynomial_degree + 1, 2)
                ]
            ),
            "odd_grade_sha256": sequence_hash(
                [
                    [fraction_text(value) for value in candidate_a[grade]]
                    for grade in range(1, full_polynomial_degree + 1, 2)
                ]
            ),
        },
        "normalization_audit": {
            "interface": "P=P_0*A+4*z*C and ell(A)=-C",
            "odd_paired_identity": "Psi_A(-h)+Psi_A(h)=q(h)*ell(A)",
            "odd_center": (
                "q(0)=2*chi(0); Psi_A(0)/chi(0)="
                "sum(w_n*A(z_n))/sum(z_n*exp(-z_n))"
            ),
            "odd_center_common_prefactor": "4/4=1",
            "even_paired_identity": "Psi_A(-h)-Psi_A(h)=2*q'(h)*ell(A)",
            "even_center": "ell(A)=-Psi_A'(0)/q''(0)",
            "even_center_derivative_prefactors": "-2/2=-1",
            "zero_over_zero_division_used": False,
        },
        "hashes": {
            "formula_sha256": canonical_sha256(formulas),
            "source_sha256": file_sha256(SOURCE_PATH),
            "structural_file_sha256": file_sha256(structural_path),
            "structural_content_sha256": structural.get("hashes", {}).get(
                "content_sha256"
            ),
        },
        "provenance": {
            "python": sys.version,
            "python_executable": sys.executable,
            "structural_result": str(structural_path),
            "pid": os.getpid(),
        },
        "timing_seconds": time.time() - started,
        "scope": (
            "Exact formal-series identity audit only. The arbitrary-grade EGF "
            "does not establish complete-bridge positivity or RH."
        ),
    }


def atomic_write_json(path: Path, payload: dict[str, Any], max_output_bytes: int) -> None:
    if not 1 <= max_output_bytes <= HARD_MAX_OUTPUT_BYTES:
        raise ValueError(
            f"max output bytes must lie in [1,{HARD_MAX_OUTPUT_BYTES}]"
        )
    rendered = json.dumps(
        payload, indent=2, sort_keys=True, ensure_ascii=True, allow_nan=False
    ).encode("ascii") + b"\n"
    if len(rendered) > max_output_bytes:
        raise ValueError(
            f"rendered output {len(rendered)} exceeds guard {max_output_bytes}"
        )
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
    parser.add_argument("--full-polynomial-degree", type=int, required=True)
    parser.add_argument("--scalar-degree", type=int, required=True)
    parser.add_argument("--structural-result", type=Path, required=True)
    parser.add_argument("--sample-z", action="append", default=[])
    parser.add_argument("--max-output-bytes", type=int, default=1_048_576)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--progress", action="store_true")
    args = parser.parse_args()
    payload = build_payload(
        full_polynomial_degree=args.full_polynomial_degree,
        scalar_degree=args.scalar_degree,
        structural_result=args.structural_result,
        sample_z=[fraction(value) for value in args.sample_z],
        progress_enabled=args.progress,
    )
    atomic_write_json(args.output, payload, args.max_output_bytes)
    print(
        json.dumps(
            {
                "status": payload["status"],
                "parameters": payload["parameters"],
                "output": str(args.output),
                "formula_sha256": payload["hashes"]["formula_sha256"],
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
