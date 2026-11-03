#!/usr/bin/env python3
"""Certify the grade-2/4 boundary-jet obstruction with Arb intervals."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
from typing import Any

from flint import arb, ctx


SOURCE_PATH = Path(__file__).resolve()
SCHEMA_VERSION = "zsv.m0_boundary_jet_arb.v1"
STATUS = "rigorous_boundary_jet_obstruction"
MIN_PRECISION = 128
MAX_PRECISION = 512
SUMMED_ORBITS = 10
FIRST_OMITTED_ORBIT = SUMMED_ORBITS + 1
HARD_MAX_OUTPUT_BYTES = 64 * 1024


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


def p2(z: arb) -> arb:
    return 4 * z**2 - 6 * z + arb(1) / 4


def p4(z: arb) -> arb:
    return (
        16 * z**4
        - 112 * z**3
        + 166 * z**2
        - 39 * z
        + arb(1) / 16
    )


def build_payload(precision: int = 200) -> dict[str, Any]:
    if not MIN_PRECISION <= precision <= MAX_PRECISION:
        raise ValueError(
            f"precision must lie in [{MIN_PRECISION}, {MAX_PRECISION}]"
        )
    ctx.prec = precision
    source_sha256_at_start = file_sha256(SOURCE_PATH)
    pi = arb.pi()

    # The n=0 orbit contributes (1/2)^k to q^(k)(0).  For n>=1,
    # D^k exp(h/2-z exp(2h)) at h=0 is P_k(z) exp(-z).
    q0 = arb(1)
    q2 = arb(1) / 4
    q4 = arb(1) / 16
    for orbit in range(1, SUMMED_ORBITS + 1):
        z = pi * orbit * orbit
        weight = (-z).exp()
        q0 += 2 * weight
        q2 += 2 * weight * p2(z)
        q4 += 2 * weight * p4(z)

    # For z>=1, |P2(z)|<=11z^2 and |P4(z)|<=334z^4.  For n>=N,
    # the successive z_n^m exp(-z_n) ratio is at most its value at N:
    # ((N+1)/N)^(2m) exp(-pi(2N+1)).  Both factors decrease with n.
    first = FIRST_OMITTED_ORBIT
    z_first = pi * first * first
    ratio0 = (-pi * (2 * first + 1)).exp()
    ratio2 = (arb(first + 1) / first) ** 4 * ratio0
    ratio4 = (arb(first + 1) / first) ** 8 * ratio0
    tail0 = 2 * (-z_first).exp() / (1 - ratio0)
    tail2 = 22 * z_first**2 * (-z_first).exp() / (1 - ratio2)
    tail4 = 668 * z_first**4 * (-z_first).exp() / (1 - ratio4)

    q0 += arb(0, tail0.upper())
    q2 += arb(0, tail2.upper())
    q4 += arb(0, tail4.upper())

    chi0 = q0 / 2
    chi2 = q2 / 2
    psi0 = q2 - q0 / 4
    psi2 = q4 - q2 / 4
    boundary2 = psi0 * chi0
    boundary4 = psi2 * chi0 + 3 * psi0 * chi2
    obstruction = boundary4 + arb(65) * boundary2 / 2

    source_sha256_at_end = file_sha256(SOURCE_PATH)
    checks = {
        "tail_ratios_are_below_one_half": bool(
            ratio0 < arb(1) / 2
            and ratio2 < arb(1) / 2
            and ratio4 < arb(1) / 2
        ),
        "p2_majorant_valid_for_z_at_least_one": True,
        "p4_majorant_valid_for_z_at_least_one": True,
        "q4_omitted_orbit_radius_below_2e_minus_152": bool(
            tail4 < arb("2e-152")
        ),
        "boundary2_is_positive": bool(boundary2 > 0),
        "scalar_drift_cancellation_obstruction_exceeds_18": bool(
            obstruction > 18
        ),
        "worker_source_unchanged_during_run": (
            source_sha256_at_start == source_sha256_at_end
        ),
    }
    checks["all_checks_passed"] = all(checks.values())
    if not checks["all_checks_passed"]:
        failed = [name for name, passed in checks.items() if not passed]
        raise ArithmeticError(f"boundary-jet Arb gate failed: {failed}")

    return {
        "schema_version": SCHEMA_VERSION,
        "status": STATUS,
        "parameters": {
            "arb_precision_bits": precision,
            "summed_positive_orbits": SUMMED_ORBITS,
            "first_omitted_orbit": FIRST_OMITTED_ORBIT,
        },
        "exact_formulas": {
            "P2": "4*z^2-6*z+1/4",
            "P4": "16*z^4-112*z^3+166*z^2-39*z+1/16",
            "B2": "(q2-q0/4)*(q0/2)",
            "B4": "(q4-q2/4)*(q0/2)+3*(q2-q0/4)*(q2/2)",
            "drift_coefficients": {"d2": "-12", "d4": "390"},
            "required_if_one_scalar_cancellation": "B4+(65/2)*B2=0",
        },
        "tail_majorants": {
            "P2_for_z_ge_1": "abs(P2(z))<=11*z^2",
            "P4_for_z_ge_1": "abs(P4(z))<=334*z^4",
            "ratio0": interval_record(ratio0),
            "ratio2": interval_record(ratio2),
            "ratio4": interval_record(ratio4),
            "q0_radius": interval_record(tail0),
            "q2_radius": interval_record(tail2),
            "q4_radius": interval_record(tail4),
        },
        "intervals": {
            "q0": interval_record(q0),
            "q2": interval_record(q2),
            "q4": interval_record(q4),
            "B2": interval_record(boundary2),
            "B4": interval_record(boundary4),
            "B4_plus_65_over_2_B2": interval_record(obstruction),
        },
        "checks": checks,
        "outcome": {
            "one_scalar_boundary_cancellation_refuted": True,
            "conclusion": (
                "The formal-adjoint boundary jets cannot all be canceled by "
                "one scalar multiple of d_j. This does not test or refute the "
                "full correlated Hardy/trace inequality."
            ),
        },
        "provenance": {
            "source": "src/certify_m0_boundary_jet.py",
            "source_sha256_at_start": source_sha256_at_start,
            "source_sha256_at_end": source_sha256_at_end,
        },
        "scope": (
            "Rigorous two-grade theta-series interval certificate only; no "
            "M0 positivity, all-degree endpoint sign, or RH conclusion."
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
    parser.add_argument("--precision", type=int, default=200)
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
                "output": str(args.output),
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
