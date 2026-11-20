#!/usr/bin/env python3
"""Certify the finite actual-theta parent-metric angle on odd rungs.

This is a bounded source-guiding diagnostic.  It reconstructs the monic
physical target polynomials T_n from the archived complete-theta moment
boxes, forms

    q_n = T'_{n+1} - (n+1) T_n,

and evaluates B_n=(T_n,P T_n)/sigma_n, L_n=(q_n,P q_n)/sigma_n, and
X_n=(T_n,P q_n)/sigma_n in the archived positive half-first-moment metric
P.  All input decimals are loaded with outward padding at least as large as
the padding used by the archived endpoint certificate.

The finite signs emitted here are not an all-degree theorem and do not prove
the Riemann hypothesis.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import platform
import sys
from typing import Any

import flint
from flint import arb, arb_mat, ctx


SCHEMA_VERSION = "zsv.actual_theta_parent_angle.v1"
DEFAULT_PRECISION_BITS = 512
MIN_PRECISION_BITS = 256
MAX_PRECISION_BITS = 1024

SOURCE_PATH = Path(__file__).resolve()
WORKSTREAM_ROOT = SOURCE_PATH.parents[1]
CHECKPOINT_ROOT = SOURCE_PATH.parents[3]

TARGET_REL = "evidence/v18-curated/full_split_audit/actual_total_certificate.json"
PARENT_REL = "evidence/v19-delta/fisher_bridge_v3/parent_interval_1000.json"
ENDPOINT_REL = "evidence/v19-delta/fisher_bridge_v3/endpoint_certificate_1000.json"
TARGET_PATH = CHECKPOINT_ROOT / TARGET_REL
PARENT_PATH = CHECKPOINT_ROOT / PARENT_REL
ENDPOINT_PATH = CHECKPOINT_ROOT / ENDPOINT_REL

EXPECTED_TARGET_SHA256 = "06b56542d907b50d397263a88da4a39da75ac94463cd48d54da8a5e43198b536"
EXPECTED_PARENT_SHA256 = "7e62d06a0ba7eec5fd7a80e4e5f63a35cf87875d92d73b04314259ae596ef928"
EXPECTED_ENDPOINT_SHA256 = "6042e7989864e2e64f89989bb82329d2bf3af91fe848bed722496ae364335509"
EXPECTED_TARGET_SCOPE = "Full theta normalized a=0 full moments via reflected identity"
EXPECTED_ENDPOINT_SCOPE = (
    "Original theta existing odd rungs3..19 normalized a0; positive parent G0 "
    "intervalTaylor20; reused target moment intervals; no nonzero-shift interval "
    "certificate"
)

TARGET_PADDING = Fraction(1, 10**90)
PARENT_PADDING = Fraction(1, 10**54)
ODD_DEGREES = tuple(range(1, 20, 2))


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def exact(value: Fraction | int | str) -> arb:
    rational = Fraction(value)
    return arb(rational.numerator) / rational.denominator


def interval(lower: Fraction, upper: Fraction) -> arb:
    if lower > upper:
        raise ValueError("reversed interval")
    if lower == upper:
        return exact(lower)
    midpoint = (lower + upper) / 2
    radius = (upper - lower) / 2
    return arb(exact(midpoint), exact(radius))


def padded_interval(raw: object, padding_scale: Fraction, label: str) -> tuple[arb, Fraction]:
    if not isinstance(raw, list) or len(raw) != 2:
        raise ValueError(f"{label} is not a two-endpoint interval")
    lower, upper = Fraction(raw[0]), Fraction(raw[1])
    if lower > upper:
        raise ValueError(f"{label} has reversed endpoints")
    # This dominates 1e-k*(1+abs(interval)) and remains exact rational input.
    padding = padding_scale * (1 + abs(lower) + abs(upper))
    return interval(lower - padding, upper + padding), padding


def endpoints(value: arb, digits: int = 70) -> dict[str, str]:
    return {
        "lower": value.lower().str(digits),
        "upper": value.upper().str(digits),
        "arb": value.str(min(digits, 45)),
    }


def fraction_text(value: Fraction) -> str:
    return f"{value.numerator}/{value.denominator}"


def target_entry(moments: list[arb], left_degree: int, right_degree: int) -> arb:
    if (left_degree - right_degree) % 2:
        return arb(0)
    index = (left_degree + right_degree) // 2
    sign = -1 if ((left_degree - right_degree) // 2) % 2 else 1
    return sign * moments[index]


def monic_target_polynomial(moments: list[arb], degree: int) -> tuple[dict[int, arb], arb, arb]:
    old_degrees = list(range(degree % 2, degree, 2))
    if not old_degrees:
        polynomial = {degree: arb(1)}
        norm = target_entry(moments, degree, degree)
        return polynomial, norm, norm

    old_entries = [
        [target_entry(moments, left, right) for right in old_degrees]
        for left in old_degrees
    ]
    old = arb_mat(old_entries)
    border_entries = [target_entry(moments, old_degree, degree) for old_degree in old_degrees]
    determinant = old.det()
    # Symmetric diagonal preconditioning is an exact invertible coordinate
    # change.  It is essential at the degree-20 border, where a direct Arb
    # solve of the unscaled moment matrix loses invertibility to dependency
    # widening even though the normalized system remains regular.
    scales: list[arb] = []
    for index, old_degree in enumerate(old_degrees):
        diagonal = old_entries[index][index]
        if not diagonal > 0:
            raise ArithmeticError(f"target diagonal not positive at degree {old_degree}")
        midpoint_text = diagonal.sqrt().mid().str(100)
        scales.append(arb(1) / exact(Fraction(midpoint_text)))
    scaled_old = arb_mat([
        [scales[row] * old_entries[row][column] * scales[column]
         for column in range(len(old_degrees))]
        for row in range(len(old_degrees))
    ])
    scaled_border = arb_mat([
        [scales[row] * border_entries[row]]
        for row in range(len(old_degrees))
    ])
    scaled_solution = scaled_old.solve(-scaled_border)
    solution = [
        scales[index] * scaled_solution[index, 0]
        for index in range(len(old_degrees))
    ]
    polynomial = {
        old_degree: solution[index]
        for index, old_degree in enumerate(old_degrees)
    }
    polynomial[degree] = arb(1)
    if degree < len(moments):
        norm = target_entry(moments, degree, degree) + sum(
            (
                target_entry(moments, old_degree, degree) * polynomial[old_degree]
                for old_degree in old_degrees
            ),
            arb(0),
        )
    else:
        # T_20 needs moments only through index 19 for its coefficients; its
        # unused norm would require the deliberately unavailable moment 20.
        norm = arb(0)
    return polynomial, norm, determinant


def derivative(polynomial: dict[int, arb]) -> dict[int, arb]:
    return {
        degree - 1: degree * coefficient
        for degree, coefficient in polynomial.items()
        if degree
    }


def residual(next_polynomial: dict[int, arb], current: dict[int, arb], degree: int) -> dict[int, arb]:
    result: dict[int, arb] = {}
    differentiated = derivative(next_polynomial)
    for exponent in sorted(set(differentiated) | set(current)):
        # The monic leading terms cancel algebraically.  Encoding that exact
        # cancellation avoids interval dependency widening at exponent n.
        if exponent == degree:
            if differentiated[exponent] != degree + 1 or current[exponent] != 1:
                raise ArithmeticError("monic leading-term cancellation failed")
            continue
        value = differentiated.get(exponent, arb(0)) - (degree + 1) * current.get(exponent, arb(0))
        result[exponent] = value
    return result


def positive_inner(
    left: dict[int, arb], right: dict[int, arb], parent: list[list[arb]]
) -> arb:
    total = arb(0)
    for left_degree, left_coefficient in left.items():
        if left_degree not in ODD_DEGREES:
            if left_coefficient != 0:
                raise ValueError(f"left degree {left_degree} is outside the odd parent basis")
            continue
        left_index = (left_degree - 1) // 2
        for right_degree, right_coefficient in right.items():
            if right_degree not in ODD_DEGREES:
                if right_coefficient != 0:
                    raise ValueError(f"right degree {right_degree} is outside the odd parent basis")
                continue
            right_index = (right_degree - 1) // 2
            total += left_coefficient * parent[left_index][right_index] * right_coefficient
    return total


def read_inputs() -> tuple[
    list[arb],
    list[list[arb]],
    list[arb],
    dict[int, arb],
    list[dict[str, Any]],
    list[dict[str, Any]],
]:
    if digest(TARGET_PATH) != EXPECTED_TARGET_SHA256:
        raise ValueError("target moment archive SHA-256 mismatch")
    if digest(PARENT_PATH) != EXPECTED_PARENT_SHA256:
        raise ValueError("parent Gram archive SHA-256 mismatch")
    if digest(ENDPOINT_PATH) != EXPECTED_ENDPOINT_SHA256:
        raise ValueError("endpoint certificate SHA-256 mismatch")

    target_payload = json.loads(TARGET_PATH.read_text(encoding="utf-8"))
    parent_payload = json.loads(PARENT_PATH.read_text(encoding="utf-8"))
    endpoint_payload = json.loads(ENDPOINT_PATH.read_text(encoding="utf-8"))
    if target_payload.get("scope") != EXPECTED_TARGET_SCOPE:
        raise ValueError("target scope mismatch")
    raw_moments = target_payload.get("moments")
    if not isinstance(raw_moments, list) or len(raw_moments) != 20:
        raise ValueError("target archive must contain 20 moments")
    raw_scales = parent_payload.get("scales")
    raw_parent = parent_payload.get("G0")
    if parent_payload.get("cells") != 1000:
        raise ValueError("parent archive is not the 1000-cell certificate")
    if not isinstance(raw_scales, list) or len(raw_scales) != len(ODD_DEGREES):
        raise ValueError("parent scale vector has the wrong size")
    if (
        not isinstance(raw_parent, list)
        or len(raw_parent) != len(ODD_DEGREES)
        or any(not isinstance(row, list) or len(row) != len(ODD_DEGREES) for row in raw_parent)
    ):
        raise ValueError("parent Gram has the wrong shape")

    moments: list[arb] = []
    moment_rows: list[dict[str, Any]] = []
    for index, raw in enumerate(raw_moments):
        stored, padding = padded_interval(raw, TARGET_PADDING, f"moment[{index}]")
        corrected = stored / (4**index)
        moments.append(corrected)
        moment_rows.append({
            "index": index,
            "stored_interval": raw,
            "serialization_padding": fraction_text(padding),
            "physical_moment": endpoints(corrected),
        })

    # The decimal scales define the archived coordinate change.  They are
    # exact positive rationals here; the G0 boxes get the same (slightly
    # stronger) 1e-54 outward padding as the endpoint certification load.
    scales = [exact(Fraction(value)) for value in raw_scales]
    if any(not scale > 0 for scale in scales):
        raise ValueError("parent scales are not positive")
    parent: list[list[arb]] = []
    parent_rows: list[dict[str, Any]] = []
    for row_index, raw_row in enumerate(raw_parent):
        row: list[arb] = []
        receipt_row: list[dict[str, Any]] = []
        for column_index, raw in enumerate(raw_row):
            scaled, padding = padded_interval(
                raw, PARENT_PADDING, f"G0[{row_index}][{column_index}]"
            )
            row.append(scaled)
            receipt_row.append({
                "serialization_padding": fraction_text(padding),
                "scaled_parent_entry": endpoints(scaled),
            })
        parent.append(row)
        parent_rows.append({"row": row_index, "entries": receipt_row})

    for row in range(len(parent)):
        for column in range(len(parent)):
            if not parent[row][column].overlaps(parent[column][row]):
                raise ArithmeticError("parent Gram lost symmetry overlap")

    if endpoint_payload.get("scope") != EXPECTED_ENDPOINT_SCOPE:
        raise ValueError("endpoint certificate scope mismatch")
    if endpoint_payload.get("source_cells") != 1000:
        raise ValueError("endpoint certificate cell count mismatch")
    endpoint_results = endpoint_payload.get("results")
    if not isinstance(endpoint_results, list):
        raise ValueError("endpoint certificate results are missing")
    sigma_by_degree: dict[int, arb] = {
        1: target_entry(moments, 1, 1),
    }
    for record in endpoint_results:
        degree = record.get("degree") if isinstance(record, dict) else None
        if degree not in ODD_DEGREES[1:]:
            raise ValueError("endpoint certificate has an unexpected degree")
        scaled_sigma, _ = padded_interval(
            record.get("surplus"), Fraction(1, 10**64), f"endpoint surplus[{degree}]"
        )
        scale = scales[(degree - 1) // 2]
        if not scaled_sigma > 0:
            raise ArithmeticError(f"archived target sigma is not positive at degree {degree}")
        sigma_by_degree[degree] = scaled_sigma
    if tuple(sorted(sigma_by_degree)) != ODD_DEGREES:
        raise ValueError("endpoint certificate does not cover the odd ladder")
    # Degree one is not present in the endpoint file.  Put it in the same
    # scaled coordinates as every later rung.
    sigma_by_degree[1] *= scales[0] * scales[0]
    return moments, parent, scales, sigma_by_degree, moment_rows, parent_rows


def classify(value: arb) -> str:
    if value > 0:
        return "positive"
    if value < 0:
        return "negative"
    if value == 0:
        return "zero"
    return "indeterminate"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--precision-bits", type=int, default=DEFAULT_PRECISION_BITS)
    parser.add_argument("--progress", action="store_true")
    args = parser.parse_args()
    if not MIN_PRECISION_BITS <= args.precision_bits <= MAX_PRECISION_BITS:
        raise ValueError("precision is outside the bounded range")
    ctx.prec = args.precision_bits

    moments, parent, scales, sigma_by_degree, moment_rows, parent_rows = read_inputs()
    results: list[dict[str, Any]] = []
    strict_positive_degrees: list[int] = []
    strict_negative_degrees: list[int] = []
    for degree in ODD_DEGREES:
        current, reconstructed_sigma, old_determinant = monic_target_polynomial(moments, degree)
        sigma = sigma_by_degree[degree]
        following, _, following_old_determinant = monic_target_polynomial(moments, degree + 1)
        q = residual(following, current, degree)
        current_scale = scales[(degree - 1) // 2]
        current_scaled = {
            exponent: current_scale * coefficient / scales[(exponent - 1) // 2]
            for exponent, coefficient in current.items()
        }
        q_scaled = {
            exponent: current_scale * coefficient / scales[(exponent - 1) // 2]
            for exponent, coefficient in q.items()
        }
        parent_current = positive_inner(current_scaled, current_scaled, parent)
        parent_residual = positive_inner(q_scaled, q_scaled, parent)
        cross = positive_inner(current_scaled, q_scaled, parent)
        B = parent_current / sigma
        L = parent_residual / sigma
        X = cross / sigma
        if degree == 1:
            if q or L != 0 or X != 0:
                raise ArithmeticError("degree-one exact residual should vanish")
            rho: arb | None = None
        else:
            rho = X / (B * L).sqrt() if B > 0 and L > 0 else None
        sign = classify(X)
        if sign == "positive":
            strict_positive_degrees.append(degree)
        elif sign == "negative":
            strict_negative_degrees.append(degree)
        results.append({
            "degree": degree,
            "target_sigma": endpoints(sigma),
            "direct_reconstructed_scaled_target_sigma": endpoints(
                reconstructed_sigma * current_scale * current_scale
            ),
            "direct_sigma_overlaps_archived_sigma": (
                reconstructed_sigma * current_scale * current_scale
            ).overlaps(sigma),
            "old_target_determinant": endpoints(old_determinant),
            "following_old_target_determinant": endpoints(following_old_determinant),
            "q_coefficients_ascending_odd_powers": [
                {"degree": exponent, "coefficient": endpoints(q[exponent])}
                for exponent in sorted(q)
            ],
            "B": endpoints(B),
            "B_sign": classify(B),
            "L": endpoints(L),
            "L_sign": classify(L),
            "X": endpoints(X),
            "X_sign": sign,
            "rho": None if rho is None else endpoints(rho),
            "rho_interval_strictly_inside_minus_one_one": (
                None if rho is None else bool(rho > -1 and rho < 1)
            ),
        })

    expected_positive = list(range(5, 20, 2))
    unexpected_positive = sorted(set(strict_positive_degrees) - set(expected_positive))
    unexpected_negative = sorted(set(strict_negative_degrees) - {3})
    if unexpected_positive or unexpected_negative:
        raise ArithmeticError(
            "unexpected certified signs: "
            f"positive={unexpected_positive}, negative={unexpected_negative}"
        )
    if 3 not in strict_negative_degrees:
        raise ArithmeticError("degree three X sign was not certified negative")
    unresolved_degrees = [
        record["degree"]
        for record in results
        if record["X_sign"] == "indeterminate"
    ]
    fully_certified = (
        strict_positive_degrees == expected_positive
        and strict_negative_degrees == [3]
        and not unresolved_degrees
    )

    receipt: dict[str, Any] = {
        "schema_version": SCHEMA_VERSION,
        "status": "finite_interval_angle_diagnostic",
        "verdict": "PASS" if fully_certified else "PARTIAL",
        "parameters": {
            "precision_bits": args.precision_bits,
            "degrees": list(ODD_DEGREES),
            "input_mode": "SHA-bound archived interval boxes",
        },
        "scope": "Finite interval certificate for the physical actual-theta parent-metric angle X_n on odd n<=19",
        "runtime": {
            "python": sys.version,
            "python_executable": sys.executable,
            "platform": platform.platform(),
            "python_flint": flint.__version__,
            "arb_precision_bits": args.precision_bits,
            "network_used": False,
            "quadrature_used": False,
            "new_theta_orbits_evaluated": False,
        },
        "provenance": {
            "verifier": str(SOURCE_PATH.relative_to(CHECKPOINT_ROOT)),
            "verifier_sha256": digest(SOURCE_PATH),
            "target_archive": TARGET_REL,
            "target_archive_sha256": digest(TARGET_PATH),
            "parent_archive": PARENT_REL,
            "parent_archive_sha256": digest(PARENT_PATH),
            "endpoint_certificate": ENDPOINT_REL,
            "endpoint_certificate_sha256": digest(ENDPOINT_PATH),
        },
        "normalization": {
            "target": "stored mu_k divided exactly by 4^k; physical D^d Gram sign (-1)^((d-e)/2)",
            "parent": "archived scaled G0 retained in its certified coordinates",
            "polynomial_coordinates": "physical coefficients multiplied by current top scale and divided by each basis scale",
            "target_sigma": "archived certified scaled surplus in the same top-normalized coordinates",
            "target_serialization_padding": "1e-90*(1+abs(lower)+abs(upper))",
            "parent_serialization_padding": "1e-54*(1+abs(lower)+abs(upper)); dominates archived load padding",
            "definitions": {
                "q_n": "T'_{n+1}-(n+1)T_n",
                "B_n": "(T_n,P T_n)/sigma_n",
                "L_n": "(q_n,P q_n)/sigma_n",
                "X_n": "(T_n,P q_n)/sigma_n",
                "rho_n": "X_n/sqrt(B_n L_n)",
            },
        },
        "input_moments": moment_rows,
        "parent_load_audit": parent_rows,
        "results": results,
        "strict_conclusion": {
            "X_1_exactly_zero": True,
            "X_3_strictly_negative": True,
            "X_strictly_positive_degrees": strict_positive_degrees,
            "X_unresolved_degrees": unresolved_degrees,
            "X_n_strictly_positive_for_odd_n_5_through_19": fully_certified,
            "B_and_L_strictly_positive_through_degree_13": all(
                record["B_sign"] == "positive" and record["L_sign"] == "positive"
                for record in results
                if 3 <= record["degree"] <= 13
            ),
            "rho_interval_strictly_between_minus_one_and_one_through_degree_11": all(
                record["rho_interval_strictly_inside_minus_one_one"] is True
                for record in results
                if 3 <= record["degree"] <= 11
            ),
        },
        "interpretation": (
            "The strict finite signs support seeking a theta-specific eventual positive-angle lemma; "
            "the degree-3 sign change rules out a same-sign claim starting at every nontrivial rung. "
            "Indeterminate degrees reflect the width and conditioning of the archived interval boxes, "
            "not a certified zero or negative sign."
        ),
        "nonclaims": [
            "This finite certificate is not an all-degree lower bound for X_n.",
            "It does not show that rho_n has a positive uniform lower bound.",
            "Independent interval propagation can make the displayed rho enclosure wider than [-1,1] at high finite degrees even though exact Cauchy applies.",
            "It does not prove the next pivot, Xi-Laguerre inequalities, or RH.",
            "It reuses archived interval inputs and is not an independent recomputation of theta quadrature.",
        ],
    }
    canonical = json.dumps(receipt, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode()
    receipt["receipt_integrity"] = {
        "definition": "sha256 of compact sorted JSON with receipt_integrity omitted",
        "payload_sha256": hashlib.sha256(canonical).hexdigest(),
    }
    output = args.output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "status": receipt["status"],
        "verdict": receipt["verdict"],
        "output": str(output),
        "positive_degrees": strict_positive_degrees,
        "negative_degrees": strict_negative_degrees,
        "unresolved_degrees": unresolved_degrees,
        "source_sha256": digest(SOURCE_PATH),
        "payload_sha256": receipt["receipt_integrity"]["payload_sha256"],
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
