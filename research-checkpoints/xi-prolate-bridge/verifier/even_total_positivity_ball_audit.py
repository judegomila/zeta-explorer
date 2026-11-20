#!/usr/bin/env python3
"""Exact-decimal audit of the two independent FLINT/Arb matrix outputs.

The script parses only printed midpoint/radius enclosures, treats every
decimal as an exact rational decimal, and reconstructs the natural-even
order-two minors.  It does not trust either assembly path's pass booleans.
"""
from __future__ import annotations

import argparse
from decimal import Decimal, InvalidOperation, localcontext
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any


SCHEMA = "xi-prolate-even-total-positivity-ball-audit-v1"
TERMINAL_STATE = "P0_INVALIDATED"
STATUS = "BALL_ROUTE_OBSTRUCTION_PASS"
_ENTRY = re.compile(
    r"^ENTRY (-?\d+) (-?\d+) Q \[([^ ]+) \+/- ([^\]]+)\]$"
)
_PRODUCER_META = re.compile(
    r"^META lambda=([^ ]+) N=(\d+) prec=(\d+) cutoff=(\d+) status=([^ ]+)$"
)
_VERIFIER_META = re.compile(
    r"^META lambda=([^ ]+) N=(\d+) prec=(\d+) cutoff=(\d+) path=([^ ]+)$"
)


class BallAuditError(ValueError):
    """Raised when the two raw enclosure outputs do not prove the claim."""


Interval = tuple[Decimal, Decimal]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _exact_lambda(text: Any) -> Fraction:
    if not isinstance(text, str):
        raise BallAuditError("lambda must be exact text; binary64 is forbidden")
    try:
        value = Fraction(text)
    except (ValueError, ZeroDivisionError) as exc:
        raise BallAuditError("lambda is not exact decimal text") from exc
    if value <= 1:
        raise BallAuditError("lambda must be greater than one")
    return value


def _exact_int(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise BallAuditError(f"{label} must be an exact integer")
    if value < minimum:
        raise BallAuditError(f"{label} must be at least {minimum}")
    return value


def _decimal(text: str, label: str) -> Decimal:
    try:
        value = Decimal(text)
    except InvalidOperation as exc:
        raise BallAuditError(f"invalid exact decimal in {label}") from exc
    if not value.is_finite():
        raise BallAuditError(f"nonfinite decimal in {label}")
    return value


def _parse_output(
    path: Path,
    *,
    role: str,
    lambda_text: str,
    N: int,
    precision_bits: int,
) -> dict[tuple[int, int], Interval]:
    raw = path.read_text(encoding="utf-8")
    entries: dict[tuple[int, int], Interval] = {}
    meta_seen = False
    for line_number, raw_line in enumerate(raw.splitlines(), 1):
        line = raw_line.strip()
        meta_match = (
            _PRODUCER_META.fullmatch(line)
            if role == "producer"
            else _VERIFIER_META.fullmatch(line)
        )
        if meta_match:
            if meta_seen:
                raise BallAuditError(f"duplicate {role} metadata")
            meta_seen = True
            observed_lambda, observed_N, observed_precision, cutoff = meta_match.group(1, 2, 3, 4)
            if (
                observed_lambda != lambda_text
                or int(observed_N) != N
                or int(observed_precision) != precision_bits
                or int(cutoff) != (_exact_lambda(lambda_text) ** 2).numerator
                // (_exact_lambda(lambda_text) ** 2).denominator
            ):
                raise BallAuditError(f"{role} metadata/input mismatch")
            if role == "producer" and meta_match.group(5) != "BALL_OUTPUT":
                raise BallAuditError("producer did not emit ball output")
            if role == "verifier" and meta_match.group(5) != "direct_distribution_plus_corrected_4_14":
                raise BallAuditError("wrong independent verifier path")
            continue
        match = _ENTRY.fullmatch(line)
        if match is None:
            continue
        n, m = int(match.group(1)), int(match.group(2))
        if not (-N <= n <= N and -N <= m <= N):
            raise BallAuditError(f"out-of-range {role} entry on line {line_number}")
        key = (n, m)
        if key in entries:
            raise BallAuditError(f"duplicate {role} Q entry {key}")
        midpoint = _decimal(match.group(3), f"{role} midpoint {key}")
        radius = _decimal(match.group(4), f"{role} radius {key}")
        if radius < 0:
            raise BallAuditError(f"negative radius in {role} entry {key}")
        entries[key] = (midpoint - radius, midpoint + radius)
    expected_count = (2 * N + 1) ** 2
    if not meta_seen or len(entries) != expected_count:
        raise BallAuditError(
            f"{role} output is incomplete: found {len(entries)} of {expected_count} Q entries"
        )
    return entries


def _add(left: Interval, right: Interval) -> Interval:
    return left[0] + right[0], left[1] + right[1]


def _multiply_positive(left: Interval, right: Interval) -> Interval:
    if left[0] <= 0 or right[0] <= 0:
        raise BallAuditError("positive-interval multiplication received a nonpositive endpoint")
    return left[0] * right[0], left[1] * right[1]


def _subtract(left: Interval, right: Interval) -> Interval:
    return left[0] - right[1], left[1] - right[0]


def _overlap(left: Interval, right: Interval) -> bool:
    return max(left[0], right[0]) <= min(left[1], right[1])


def _require_source_symmetries(
    q: dict[tuple[int, int], Interval], *, role: str, N: int
) -> None:
    for n in range(-N, N + 1):
        for m in range(-N, N + 1):
            if not _overlap(q[(n, m)], q[(m, n)]):
                raise BallAuditError(f"{role} Hermitian entry intervals do not overlap")
            if not _overlap(q[(n, m)], q[(-n, -m)]):
                raise BallAuditError(f"{role} inversion-reflected entry intervals do not overlap")


def _even_minors(q: dict[tuple[int, int], Interval]) -> dict[str, Interval]:
    def qplus(n: int, m: int) -> Interval:
        total = _add(
            _add(q[(n, m)], q[(n, -m)]),
            _add(q[(-n, m)], q[(-n, -m)]),
        )
        return total[0] / 2, total[1] / 2

    row_01 = _add(q[(0, 1)], q[(0, -1)])
    column_10 = _add(q[(1, 0)], q[(-1, 0)])
    off_diagonal_product = _multiply_positive(row_01, column_10)
    off_diagonal_product = (
        off_diagonal_product[0] / 2,
        off_diagonal_product[1] / 2,
    )

    delta = _subtract(
        _multiply_positive(qplus(1, 2), qplus(3, 4)),
        _multiply_positive(qplus(1, 4), qplus(3, 2)),
    )
    principal = _subtract(
        _multiply_positive(q[(0, 0)], qplus(1, 1)),
        off_diagonal_product,
    )
    return {"delta_1324": delta, "principal_01": principal}


def _serialize_interval(value: Interval) -> dict[str, str]:
    return {"lower": str(value[0]), "upper": str(value[1])}


def audit(
    producer_path: Path,
    verifier_path: Path,
    *,
    lambda_text: str = "2",
    N: int = 4,
    precision_bits: int = 512,
) -> dict[str, Any]:
    """Reconstruct the shift-invariant negative minor from both raw paths."""

    _exact_lambda(lambda_text)
    N = _exact_int(N, "N", 4)
    precision_bits = _exact_int(precision_bits, "precision_bits", 64)
    if lambda_text != "2" or N != 4:
        raise BallAuditError("the locked route-obstruction pilot is lambda=2, N=4")
    with localcontext() as context:
        context.prec = max(1200, 4 * precision_bits)
        producer = _parse_output(
            producer_path,
            role="producer",
            lambda_text=lambda_text,
            N=N,
            precision_bits=precision_bits,
        )
        verifier = _parse_output(
            verifier_path,
            role="verifier",
            lambda_text=lambda_text,
            N=N,
            precision_bits=precision_bits,
        )
        keys = sorted(producer)
        if keys != sorted(verifier):
            raise BallAuditError("producer/verifier entry inventories differ")
        if not all(_overlap(producer[key], verifier[key]) for key in keys):
            raise BallAuditError("producer and verifier Q enclosures do not overlap entrywise")
        _require_source_symmetries(producer, role="producer", N=N)
        _require_source_symmetries(verifier, role="verifier", N=N)
        producer_min = min(producer[key][0] for key in keys)
        verifier_min = min(verifier[key][0] for key in keys)
        if producer_min <= 0 or verifier_min <= 0:
            raise BallAuditError("not every raw Q entry has a positive lower endpoint")
        producer_minors = _even_minors(producer)
        verifier_minors = _even_minors(verifier)
        for role, minors in (("producer", producer_minors), ("verifier", verifier_minors)):
            if minors["delta_1324"][1] >= 0:
                raise BallAuditError(f"{role} delta_1324 is not strictly negative")
            if minors["principal_01"][0] <= 0:
                raise BallAuditError(f"{role} principal_01 is not strictly positive")
        return {
            "schema": SCHEMA,
            "status": STATUS,
            "terminal_state": TERMINAL_STATE,
            "claim_scope": {
                "proved": (
                    "the natural even source matrix at lambda=2,N=4 has positive raw entries, "
                    "a strictly negative shift-invariant order-two minor, and a strictly positive "
                    "order-two principal minor"
                ),
                "not_proved": (
                    "no asymptotic matrix property, mixed reserve, determinant limit, or "
                    "Riemann-hypothesis conclusion"
                ),
            },
            "input": {
                "lambda_decimal": lambda_text,
                "N": N,
                "precision_bits": precision_bits,
                "prime_power_cutoff": 4,
                "natural_even_basis": "e0=V0; en=(Vn+V_-n)/sqrt(2)",
            },
            "formula": {
                "delta_1324": "Qplus_12*Qplus_34-Qplus_14*Qplus_32",
                "qplus_nm": (
                    "(Q_nm+Q_n,-m+Q_-n,m+Q_-n,-m)/2 for n,m>=1"
                ),
                "principal_01": (
                    "Qplus_00*Qplus_11-Qplus_01*Qplus_10 from the full reflected compression"
                ),
                "scalar_shift_invariance": (
                    "all four delta_1324 entries are off diagonal, so Qplus-s*I has the same minor"
                ),
            },
            "producer": {
                "path": str(producer_path),
                "sha256": _sha256(producer_path),
                "raw_entry_count": len(producer),
                "minimum_raw_entry_lower": str(producer_min),
                "minor_intervals": {
                    key: _serialize_interval(value) for key, value in producer_minors.items()
                },
            },
            "verifier": {
                "path": str(verifier_path),
                "sha256": _sha256(verifier_path),
                "raw_entry_count": len(verifier),
                "minimum_raw_entry_lower": str(verifier_min),
                "minor_intervals": {
                    key: _serialize_interval(value) for key, value in verifier_minors.items()
                },
            },
            "checks": {
                "producer_booleans_trusted": False,
                "verifier_booleans_trusted": False,
                "entrywise_ball_overlap_recomputed": True,
                "hermitian_interval_overlap_recomputed": True,
                "inversion_interval_overlap_recomputed": True,
                "all_raw_entries_strictly_positive": True,
                "delta_1324_strictly_negative_on_both_paths": True,
                "principal_01_strictly_positive_on_both_paths": True,
                "shared_arithmetic_library_limitation": (
                    "both source-assembly paths use FLINT/Arb; their formula trees and prime "
                    "enumerations are independent"
                ),
            },
        }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--producer", type=Path, required=True)
    parser.add_argument("--verifier", type=Path, required=True)
    parser.add_argument("--lambda", dest="lambda_text", default="2")
    parser.add_argument("--N", type=int, default=4)
    parser.add_argument("--prec", dest="precision_bits", type=int, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = audit(
        args.producer,
        args.verifier,
        lambda_text=args.lambda_text,
        N=args.N,
        precision_bits=args.precision_bits,
    )
    text = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output is not None:
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
