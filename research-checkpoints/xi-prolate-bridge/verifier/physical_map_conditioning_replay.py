#!/usr/bin/env python3
"""Independent integer/rational replay of physical conditioning reductions."""

from __future__ import annotations

import argparse
from decimal import Decimal, localcontext
from fractions import Fraction
import hashlib
import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def _sha256(relative_path: str) -> str:
    return hashlib.sha256((ROOT / relative_path).read_bytes()).hexdigest()


def _parse_fraction(text: object, label: str) -> Fraction:
    if not isinstance(text, str):
        raise ValueError(f"{label} must be exact text")
    try:
        return Fraction(text)
    except (ValueError, ZeroDivisionError) as exc:
        raise ValueError(f"invalid {label}") from exc


def _decimal_text(container: dict[str, object], key: str, label: str) -> Decimal:
    raw = container.get(key)
    if not isinstance(raw, str):
        raise ValueError(f"{label} must be decimal text")
    try:
        return Decimal(raw)
    except Exception as exc:
        raise ValueError(f"invalid {label}") from exc


def _mobius_by_factorization(n: int) -> int:
    if n == 1:
        return 1
    remaining = n
    factors = 0
    p = 2
    while p * p <= remaining:
        if remaining % p:
            p += 1
            continue
        remaining //= p
        factors += 1
        if remaining % p == 0:
            return 0
        while remaining % p == 0:
            remaining //= p
        p += 1
    if remaining > 1:
        factors += 1
    return -1 if factors % 2 else 1


def replay_artifact(artifact: dict[str, object]) -> dict[str, object]:
    if artifact.get("artifact_version") != "0.15.0-physical-conditioning-reduction":
        raise ValueError("unsupported physical-conditioning artifact version")
    if artifact.get("terminal_state") != "P0_INVALIDATED":
        raise ValueError("terminal state promotion is forbidden")
    expected_hashes = {
        "notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md": _sha256(
            "notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md"
        ),
        "src/physical_map_conditioning.py": _sha256("src/physical_map_conditioning.py"),
        "verifier/physical_map_conditioning_replay.py": _sha256(
            "verifier/physical_map_conditioning_replay.py"
        ),
    }
    if artifact.get("provenance_sha256") != expected_hashes:
        raise ValueError("physical-conditioning provenance hash mismatch")
    precision = artifact.get("precision_decimal_digits")
    if not isinstance(precision, int) or precision < 30:
        raise ValueError("invalid precision")
    mobius = artifact.get("mobius")
    breakpoint = artifact.get("half_integer_breakpoint")
    if not isinstance(mobius, dict) or not isinstance(breakpoint, dict):
        raise ValueError("missing conditioning reduction sections")
    lam = _parse_fraction(mobius.get("lambda_exact"), "lambda")
    if lam <= 1 or lam.denominator != 2 or lam.numerator % 2 != 1:
        raise ValueError("artifact lambda is not a strict half-integer")
    square = lam * lam
    cutoff = square.numerator // square.denominator
    expected_mu = [_mobius_by_factorization(n) for n in range(1, cutoff + 1)]
    if mobius.get("lambda_squared_exact") != str(square):
        raise ValueError("lambda square is inconsistent")
    if mobius.get("cutoff_floor_lambda_squared") != cutoff:
        raise ValueError("inclusive arithmetic cutoff is inconsistent")
    if mobius.get("mobius_1_to_cutoff") != expected_mu:
        raise ValueError("Mobius list is inconsistent")

    reflected_index = square / 2
    if breakpoint.get("lambda_exact") != str(lam):
        raise ValueError("breakpoint lambda is inconsistent")
    if breakpoint.get("forward_unmatched_breakpoint_u0") != str(lam / 2):
        raise ValueError("forward breakpoint is inconsistent")
    if breakpoint.get("reflected_argument_at_u0") != str(Fraction(2, 1) / lam):
        raise ValueError("reflected argument is inconsistent")
    if breakpoint.get("would_be_reflected_index_lambda_squared_over_2") != str(reflected_index):
        raise ValueError("reflected arithmetic index is inconsistent")
    if breakpoint.get("odd_square_mod_8") != 1:
        raise ValueError("odd-square congruence is inconsistent")
    if breakpoint.get("reflected_index_is_integer") is not False:
        raise ValueError("matched reflected breakpoint is forbidden on this schedule")
    if breakpoint.get("unmatched_breakpoint_hypothesis_pass") is not True:
        raise ValueError("unmatched-breakpoint conclusion is inconsistent")

    expected_jets = [str(Fraction(1, 2**order * math.factorial(order))) for order in range(8)]
    if artifact.get("first_endpoint_jet_leading_coefficients") != expected_jets:
        raise ValueError("endpoint-jet leading coefficients are inconsistent")
    if artifact.get("uniform_physical_conditioning_proved") is not False:
        raise ValueError("qualitative injectivity was promoted to uniform conditioning")

    with localcontext() as context:
        context.prec = precision + 10
        exact_constant = sum(
            (Decimal(abs(expected_mu[n - 1])) / Decimal(n).sqrt() for n in range(1, cutoff + 1)),
            Decimal(0),
        )
        serialized = _decimal_text(mobius, "S_lambda", "Mobius conditioning constant")
        tolerance = Decimal(10) ** (-(precision - 8))
        if abs(serialized - exact_constant) > tolerance:
            raise ValueError("Mobius conditioning constant is inconsistent")
        two_lambda = Decimal(lam.numerator * 2) / Decimal(lam.denominator)
        serialized_upper = _decimal_text(
            mobius, "elementary_upper_2lambda", "elementary upper bound"
        )
        if serialized_upper != two_lambda:
            raise ValueError("elementary Mobius upper bound is inconsistent")
        expected_defect = two_lambda - exact_constant
        serialized_defect = _decimal_text(
            mobius, "upper_bound_defect", "Mobius upper-bound defect"
        )
        if abs(serialized_defect - expected_defect) > tolerance:
            raise ValueError("Mobius upper-bound defect is inconsistent")
        if exact_constant > two_lambda:
            raise ArithmeticError("elementary Mobius conditioning bound failed")
        if mobius.get("bound_pass") is not True:
            raise ValueError("Mobius bound pass field is inconsistent")

    return {
        "artifact_version": "0.15.0-physical-conditioning-replay",
        "terminal_state": "P0_INVALIDATED",
        "lambda_exact": str(lam),
        "replay_precision_decimal_digits": precision,
        "mobius_inversion_inputs_replayed": True,
        "unmatched_breakpoint_replayed": True,
        "endpoint_jet_coefficients_replayed": True,
        "uniform_physical_conditioning_proved": False,
        "independence": (
            "Mobius values are reconstructed by trial factorization and schedule arithmetic "
            "by fractions.Fraction; no producer module is imported"
        ),
        "claim_scope": "independent_exact_reduction_replay_not_uniform_conditioning",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    artifact = json.loads(args.artifact.read_text())
    report = replay_artifact(artifact)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + "\n")


if __name__ == "__main__":
    main()
