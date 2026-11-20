#!/usr/bin/env python3
"""Generate exact graded theta structural identities.

This program is an arbitrary-degree algebra substrate.  It does not evaluate
the bridge, certify a finite hierarchy rung, or make an RH claim.  All
polynomial arithmetic uses :class:`fractions.Fraction`.

The generated identities are the frozen graded recurrence

    P_0 = 4 z (2 z - 3),
    P_{j+1} = 2 z P_j' + (1/2 - 2 z) P_j,

and its one-pole decomposition

    P_j / P_0 = A_j + c_j / (2 z - 3).

For every grade, the generator checks exactly that

    c_j + ell(A_j) = 0,
    ell(z^k) = 2 k (3/2)_k.

Output is deterministic, hash-bound JSON installed with an atomic rename.
Runtime guards bound degree, term count, coefficient size, an approximate
exact-arithmetic footprint, output size, and required free disk space.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from fractions import Fraction
import hashlib
import json
import os
from pathlib import Path
import shutil
import sys
import tempfile
from typing import Any, Iterable, Sequence


SCHEMA_VERSION = "zsv.structural_generator.v1"
STATUS = "exact_structural_identity"
HARD_MAX_DEGREE = 4096

Polynomial = list[Fraction]  # Coefficients in ascending powers of z.


class GuardError(RuntimeError):
    """Raised when a configured resource or output guard is exceeded."""


@dataclass(frozen=True)
class Limits:
    degree_guard: int = 512
    max_terms: int = 2_000_000
    max_coefficient_bits: int = 1_048_576
    max_exact_bytes: int = 256 * 1024 * 1024
    max_output_bytes: int = 64 * 1024 * 1024
    min_free_bytes_after_write: int = 64 * 1024 * 1024

    def validate(self) -> None:
        if not 0 <= self.degree_guard <= HARD_MAX_DEGREE:
            raise GuardError(
                f"degree guard must be between 0 and {HARD_MAX_DEGREE}"
            )
        for name in (
            "max_terms",
            "max_coefficient_bits",
            "max_exact_bytes",
            "max_output_bytes",
            "min_free_bytes_after_write",
        ):
            if getattr(self, name) <= 0:
                raise GuardError(f"{name} must be positive")


def _trim(poly: Sequence[Fraction]) -> Polynomial:
    out = list(poly) or [Fraction(0)]
    while len(out) > 1 and out[-1] == 0:
        out.pop()
    return out


def _add(left: Sequence[Fraction], right: Sequence[Fraction]) -> Polynomial:
    size = max(len(left), len(right))
    out = [Fraction(0) for _ in range(size)]
    for index, value in enumerate(left):
        out[index] += value
    for index, value in enumerate(right):
        out[index] += value
    return _trim(out)


def _scale(poly: Sequence[Fraction], scalar: Fraction) -> Polynomial:
    return _trim([scalar * value for value in poly])


def _mul(left: Sequence[Fraction], right: Sequence[Fraction]) -> Polynomial:
    out = [Fraction(0) for _ in range(len(left) + len(right) - 1)]
    for i, a_value in enumerate(left):
        for j, b_value in enumerate(right):
            out[i + j] += a_value * b_value
    return _trim(out)


def _mul_z(poly: Sequence[Fraction]) -> Polynomial:
    return [Fraction(0), *poly]


def _derivative(poly: Sequence[Fraction]) -> Polynomial:
    if len(poly) <= 1:
        return [Fraction(0)]
    return _trim([index * poly[index] for index in range(1, len(poly))])


def _evaluate(poly: Sequence[Fraction], value: Fraction) -> Fraction:
    result = Fraction(0)
    for coefficient in reversed(poly):
        result = result * value + coefficient
    return result


def _divide_by_two_z_minus_three(poly: Sequence[Fraction]) -> Polynomial:
    """Divide an exact polynomial known to vanish at z=3/2 by 2z-3."""

    numerator = _trim(poly)
    if len(numerator) == 1:
        if numerator[0] != 0:
            raise ArithmeticError("nonzero constant is not divisible by 2z-3")
        return [Fraction(0)]

    root = Fraction(3, 2)
    quotient_by_z_minus_root = [Fraction(0) for _ in range(len(numerator) - 1)]
    quotient_by_z_minus_root[-1] = numerator[-1]
    for index in range(len(numerator) - 2, 0, -1):
        quotient_by_z_minus_root[index - 1] = (
            numerator[index] + root * quotient_by_z_minus_root[index]
        )
    remainder = numerator[0] + root * quotient_by_z_minus_root[0]
    if remainder != 0:
        raise ArithmeticError(f"divided difference remainder is {remainder}")
    return _scale(quotient_by_z_minus_root, Fraction(1, 2))


def next_p(poly: Sequence[Fraction]) -> Polynomial:
    """Apply P -> 2 z P' + (1/2 - 2 z) P exactly."""

    derivative_term = _mul_z(_scale(_derivative(poly), Fraction(2)))
    affine_term = _add(
        _scale(poly, Fraction(1, 2)),
        _scale(_mul_z(poly), Fraction(-2)),
    )
    return _add(derivative_term, affine_term)


def next_a_c(poly: Sequence[Fraction], residue: Fraction) -> tuple[Polynomial, Fraction]:
    """Apply the exact one-pole recurrence to (A_j, c_j)."""

    at_root = _evaluate(poly, Fraction(3, 2))
    divided_difference = _divide_by_two_z_minus_three(
        _add(poly, [Fraction(-at_root)])
    )
    next_poly = _add(
        _add(
            _mul_z(_scale(_derivative(poly), Fraction(2))),
            _add(
                _scale(poly, Fraction(9, 2)),
                _scale(_mul_z(poly), Fraction(-2)),
            ),
        ),
        _scale(divided_difference, Fraction(6)),
    )
    next_poly = _add(next_poly, [Fraction(-residue)])
    next_residue = 6 * at_root - residue / 2
    return next_poly, next_residue


def ell(poly: Sequence[Fraction]) -> Fraction:
    """Return ell(A)=sum_k 2 k (3/2)_k [z^k]A exactly."""

    result = Fraction(0)
    rising = Fraction(1)
    for degree in range(1, len(poly)):
        rising *= Fraction(2 * degree + 1, 2)
        result += 2 * degree * rising * poly[degree]
    return result


def _fraction_text(value: Fraction) -> str:
    if value.denominator == 1:
        return str(value.numerator)
    return f"{value.numerator}/{value.denominator}"


def _poly_text(poly: Sequence[Fraction]) -> list[str]:
    return [_fraction_text(value) for value in poly]


def _canonical_bytes(value: Any) -> bytes:
    return json.dumps(
        value,
        ensure_ascii=True,
        allow_nan=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("ascii")


def _sha256(value: Any) -> str:
    return hashlib.sha256(_canonical_bytes(value)).hexdigest()


def _fraction_size(value: Fraction) -> tuple[int, int]:
    numerator_bits = abs(value.numerator).bit_length()
    denominator_bits = value.denominator.bit_length()
    largest_bits = max(numerator_bits, denominator_bits)
    approximate_bytes = 32 + (numerator_bits + denominator_bits + 7) // 8
    return largest_bits, approximate_bytes


def _resource_size(values: Iterable[Fraction]) -> tuple[int, int, int]:
    terms = 0
    largest_bits = 0
    approximate_bytes = 0
    for value in values:
        terms += 1
        coefficient_bits, coefficient_bytes = _fraction_size(value)
        largest_bits = max(largest_bits, coefficient_bits)
        approximate_bytes += coefficient_bytes
    return terms, largest_bits, approximate_bytes


def _ratio_identity_rhs(poly: Sequence[Fraction], residue: Fraction) -> Polynomial:
    p_zero = [Fraction(0), Fraction(-12), Fraction(8)]
    residue_term = [Fraction(0), 4 * residue]
    return _add(_mul(p_zero, poly), residue_term)


def _parity_maps(degree: int) -> dict[str, Any]:
    maps: dict[str, Any] = {
        "grade_to_parity": ["even" if grade % 2 == 0 else "odd" for grade in range(degree + 1)]
    }
    for parity, start in (("even", 0), ("odd", 1)):
        slots = list(range(start, degree + 1, 2))
        maps[parity] = {
            "slot_to_grade": slots,
            "grade_to_slot": {str(grade): slot for slot, grade in enumerate(slots)},
            "fourier_eigenvalue": "+1" if parity == "even" else "-1",
        }
    return maps


def _source_sha256() -> str:
    return hashlib.sha256(Path(__file__).read_bytes()).hexdigest()


def _content_hash(degree: int, grades: Sequence[dict[str, Any]], parity_maps: dict[str, Any]) -> str:
    digest = hashlib.sha256()
    digest.update(f"{SCHEMA_VERSION}\0{STATUS}\0{degree}\0".encode("ascii"))
    for record in grades:
        digest.update(record["hashes"]["structural_sha256"].encode("ascii"))
        digest.update(b"\0")
    digest.update(_canonical_bytes(parity_maps))
    return digest.hexdigest()


def generate_document(degree: int, limits: Limits) -> dict[str, Any]:
    """Generate and validate exact structural records through ``degree``."""

    limits.validate()
    if degree < 0:
        raise GuardError("degree must be nonnegative")
    if degree > limits.degree_guard:
        raise GuardError(
            f"degree {degree} exceeds configured degree guard {limits.degree_guard}"
        )

    p_poly: Polynomial = [Fraction(0), Fraction(-12), Fraction(8)]
    a_poly: Polynomial = [Fraction(1)]
    residue = Fraction(0)
    grades: list[dict[str, Any]] = []
    total_terms = 0
    approximate_exact_bytes = 0
    largest_coefficient_bits = 0

    for grade in range(degree + 1):
        residue_functional = ell(a_poly)
        ratio_identity = p_poly == _ratio_identity_rhs(a_poly, residue)
        residue_identity = residue + residue_functional == 0
        degree_identity = len(a_poly) - 1 == grade and len(p_poly) - 1 == grade + 2
        leading_identity = (
            a_poly[-1] == Fraction((-2) ** grade)
            and p_poly[-1] == Fraction(8 * ((-2) ** grade))
        )
        zero_constant_identity = p_poly[0] == 0
        if not all(
            (
                ratio_identity,
                residue_identity,
                degree_identity,
                leading_identity,
                zero_constant_identity,
            )
        ):
            raise ArithmeticError(f"exact structural check failed at grade {grade}")

        values = [*p_poly, *a_poly, residue, residue_functional]
        term_count, coefficient_bits, exact_bytes = _resource_size(values)
        total_terms += term_count
        approximate_exact_bytes += exact_bytes
        largest_coefficient_bits = max(largest_coefficient_bits, coefficient_bits)
        if total_terms > limits.max_terms:
            raise GuardError(
                f"term guard exceeded at grade {grade}: {total_terms} > {limits.max_terms}"
            )
        if largest_coefficient_bits > limits.max_coefficient_bits:
            raise GuardError(
                "coefficient bit guard exceeded at grade "
                f"{grade}: {largest_coefficient_bits} > {limits.max_coefficient_bits}"
            )
        if approximate_exact_bytes > limits.max_exact_bytes:
            raise GuardError(
                "exact-arithmetic footprint guard exceeded at grade "
                f"{grade}: {approximate_exact_bytes} > {limits.max_exact_bytes}"
            )

        structural_payload = {
            "grade": grade,
            "parity": "even" if grade % 2 == 0 else "odd",
            "p_coefficients_ascending": _poly_text(p_poly),
            "a_coefficients_ascending": _poly_text(a_poly),
            "c": _fraction_text(residue),
            "ell_a": _fraction_text(residue_functional),
        }
        grades.append(
            {
                **structural_payload,
                "checks": {
                    "p_over_p0_one_pole_identity": ratio_identity,
                    "c_plus_ell_a_zero": residue_identity,
                    "degree": degree_identity,
                    "leading_coefficients": leading_identity,
                    "p_divisible_by_z": zero_constant_identity,
                },
                "hashes": {"structural_sha256": _sha256(structural_payload)},
            }
        )

        if grade != degree:
            p_poly = next_p(p_poly)
            a_poly, residue = next_a_c(a_poly, residue)

    parity_maps = _parity_maps(degree)
    content_sha256 = _content_hash(degree, grades, parity_maps)
    return {
        "status": STATUS,
        "parameters": {"degree": degree},
        "schema_version": SCHEMA_VERSION,
        "scope": (
            "Exact arbitrary-degree graded theta algebra only; not a finite bridge "
            "certificate, all-degree positivity theorem, or RH proof."
        ),
        "recurrences": {
            "p": "P_0=4*z*(2*z-3); P_(j+1)=2*z*P_j'+(1/2-2*z)*P_j",
            "one_pole": "P_j/P_0=A_j+c_j/(2*z-3)",
            "a": (
                "A_(j+1)=2*z*A_j'+(9/2-2*z)*A_j+"
                "6*(A_j-A_j(3/2))/(2*z-3)-c_j"
            ),
            "c": "c_(j+1)=6*A_j(3/2)-c_j/2",
            "ell": "ell(z^k)=2*k*(3/2)_k; c_j+ell(A_j)=0",
        },
        "parity_maps": parity_maps,
        "grades": grades,
        "checks": {
            "all_exact_checks_passed": True,
            "grades_checked": degree + 1,
            "identity": "c_j+ell(A_j)=0 for every emitted grade",
        },
        "resources": {
            "terms": total_terms,
            "largest_coefficient_bits": largest_coefficient_bits,
            "approximate_exact_bytes": approximate_exact_bytes,
        },
        "guards": {
            "degree_guard": limits.degree_guard,
            "hard_max_degree": HARD_MAX_DEGREE,
            "max_terms": limits.max_terms,
            "max_coefficient_bits": limits.max_coefficient_bits,
            "max_exact_bytes": limits.max_exact_bytes,
            "max_output_bytes": limits.max_output_bytes,
            "min_free_bytes_after_write": limits.min_free_bytes_after_write,
        },
        "generator": {
            "language": "Python standard library Fraction",
            "python": sys.version.split()[0],
            "source_sha256": _source_sha256(),
        },
        "hashes": {
            "content_sha256": content_sha256,
            "content_hash_scope": (
                "schema_version, status, degree, ordered per-grade structural hashes, "
                "and canonical parity_maps"
            ),
        },
    }


def write_atomic_json(document: dict[str, Any], output: Path, limits: Limits) -> int:
    """Write compact deterministic JSON and atomically replace ``output``."""

    output = output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    free_bytes = shutil.disk_usage(output.parent).free
    required_free = limits.max_output_bytes + limits.min_free_bytes_after_write
    if free_bytes < required_free:
        raise GuardError(
            f"disk guard: {free_bytes} free bytes is below required {required_free}"
        )

    temporary_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="ascii",
            dir=output.parent,
            prefix=f".{output.name}.",
            suffix=".tmp",
            delete=False,
        ) as handle:
            temporary_path = Path(handle.name)
            json.dump(
                document,
                handle,
                ensure_ascii=True,
                allow_nan=False,
                sort_keys=True,
                separators=(",", ":"),
            )
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        output_bytes = temporary_path.stat().st_size
        if output_bytes > limits.max_output_bytes:
            raise GuardError(
                f"output guard exceeded: {output_bytes} > {limits.max_output_bytes} bytes"
            )
        os.replace(temporary_path, output)
        temporary_path = None
        return output_bytes
    finally:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Generate exact graded theta recurrence identities as atomic JSON."
    )
    parser.add_argument("--degree", type=int, required=True)
    parser.add_argument("--output", type=Path, required=True)
    # Accepted for the shared governor interface.  Exact generation emits only
    # a compact terminal summary, so there is no periodic progress stream.
    parser.add_argument("--progress", action="store_true")
    parser.add_argument("--degree-guard", type=int, default=Limits.degree_guard)
    parser.add_argument("--max-terms", type=int, default=Limits.max_terms)
    parser.add_argument(
        "--max-coefficient-bits", type=int, default=Limits.max_coefficient_bits
    )
    parser.add_argument("--max-exact-bytes", type=int, default=Limits.max_exact_bytes)
    parser.add_argument("--max-output-bytes", type=int, default=Limits.max_output_bytes)
    parser.add_argument(
        "--min-free-bytes-after-write",
        type=int,
        default=Limits.min_free_bytes_after_write,
    )
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = _parser().parse_args(argv)
    limits = Limits(
        degree_guard=args.degree_guard,
        max_terms=args.max_terms,
        max_coefficient_bits=args.max_coefficient_bits,
        max_exact_bytes=args.max_exact_bytes,
        max_output_bytes=args.max_output_bytes,
        min_free_bytes_after_write=args.min_free_bytes_after_write,
    )
    try:
        document = generate_document(args.degree, limits)
        output_bytes = write_atomic_json(document, args.output, limits)
    except (ArithmeticError, GuardError, OSError, ValueError) as error:
        print(f"structural_generator: {error}", file=sys.stderr)
        return 2

    summary = {
        "status": STATUS,
        "degree": args.degree,
        "output": str(args.output),
        "bytes": output_bytes,
        "sha256": document["hashes"]["content_sha256"],
    }
    print(json.dumps(summary, sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
