#!/usr/bin/env python3
"""Independent exact replay of the weak-residual scalar obstruction.

This verifier imports no producer module.  It reconstructs the canonical
integer form with ``fractions.Fraction`` and uses ``decimal.Decimal`` only for
the two displayed radical values.  Producer pass booleans and cached matrices
are not trusted.
"""

from __future__ import annotations

import argparse
from decimal import Decimal, localcontext
from fractions import Fraction
import hashlib
import json
from pathlib import Path
from typing import Iterable


Matrix = list[list[Fraction]]
Vector = list[Fraction]
ROOT = Path(__file__).resolve().parents[1]


def _sha256(relative_path: str) -> str:
    return hashlib.sha256((ROOT / relative_path).read_bytes()).hexdigest()


def _matrix(rows: Iterable[Iterable[int | Fraction]]) -> Matrix:
    return [[Fraction(value) for value in row] for row in rows]


def _matvec(matrix: Matrix, vector: Vector) -> Vector:
    return [sum((row[j] * vector[j] for j in range(len(vector))), Fraction(0)) for row in matrix]


def _pair(left: Vector, matrix: Matrix, right: Vector) -> Fraction:
    product = _matvec(matrix, right)
    return sum((left[i] * product[i] for i in range(len(left))), Fraction(0))


def _principal(matrix: Matrix, indices: list[int]) -> Matrix:
    return [[matrix[i][j] for j in indices] for i in indices]


def _as_exact_rows(matrix: Matrix) -> list[list[str]]:
    return [[str(value.numerator) if value.denominator == 1 else str(value) for value in row] for row in matrix]


def _decimal_text(container: dict[str, object], key: str, label: str) -> Decimal:
    raw = container.get(key)
    if not isinstance(raw, str):
        raise ValueError(f"{label} must be decimal text")
    try:
        return Decimal(raw)
    except Exception as exc:
        raise ValueError(f"invalid {label}") from exc


def reconstruct_exact() -> dict[str, object]:
    W = _matrix(
        [
            [0, 0, 0, -1, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0],
            [-1, 1, 0, 1, 0],
            [0, 0, 0, 0, 2],
        ]
    )
    p = [Fraction(1), Fraction(0), Fraction(0), Fraction(0), Fraction(0)]
    outer = [Fraction(0), Fraction(1), Fraction(0), Fraction(0), Fraction(0)]
    projection = [Fraction(0), Fraction(0), Fraction(1), Fraction(0), Fraction(0)]
    e = [Fraction(0), Fraction(0), Fraction(0), Fraction(1), Fraction(0)]
    radical = [p[i] + outer[i] + projection[i] for i in range(5)]
    remainder = [outer[i] + projection[i] for i in range(5)]
    Q = _principal(W, [0, 3, 4])
    scalar_pairings = {
        "outer_outer": _pair(outer, W, outer),
        "outer_projection": _pair(outer, W, projection),
        "projection_outer": _pair(projection, W, outer),
        "projection_projection": _pair(projection, W, projection),
        "remainder_remainder": _pair(remainder, W, remainder),
    }
    return {
        "W": W,
        "Q": Q,
        "radical_image": _matvec(W, radical),
        "scalar_pairings": scalar_pairings,
        "cross_pairing_e_remainder": _pair(e, W, remainder),
        "cross_pairing_e_p": _pair(e, W, p),
        "q": Q[0][0],
        "residual_coordinate": Q[1][0],
        "alpha": Q[1][1],
        "omega": Q[2][2],
        "graph_dual_supremum": Fraction(1),
        "weighted_residual_norm": Fraction(1),
        "rho": Fraction(0),
    }


def replay_artifact(artifact: dict[str, object]) -> dict[str, object]:
    if artifact.get("artifact_version") != "0.15.0-weak-residual-duality":
        raise ValueError("unsupported weak-residual artifact version")
    if artifact.get("construction") != "canonical_5d_two_sided_radical_obstruction_v1":
        raise ValueError("unknown obstruction construction")
    if artifact.get("terminal_state") != "P0_INVALIDATED":
        raise ValueError("terminal state promotion is forbidden")
    expected_hashes = {
        "notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md": _sha256(
            "notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md"
        ),
        "src/weak_residual_duality.py": _sha256("src/weak_residual_duality.py"),
        "verifier/weak_residual_duality_replay.py": _sha256(
            "verifier/weak_residual_duality_replay.py"
        ),
    }
    if artifact.get("provenance_sha256") != expected_hashes:
        raise ValueError("weak-residual provenance hash mismatch")
    exact = reconstruct_exact()
    if artifact.get("W_exact_integer_rows") != _as_exact_rows(exact["W"]):
        raise ValueError("producer W does not match independent exact reconstruction")
    if artifact.get("Q_exact_integer_rows") != _as_exact_rows(exact["Q"]):
        raise ValueError("producer Q does not match independent exact compression")
    if artifact.get("global_basis") != ["p", "O", "P", "e", "o"]:
        raise ValueError("producer global basis is inconsistent")
    if artifact.get("finite_basis") != ["p", "e", "o"]:
        raise ValueError("producer finite basis is inconsistent")
    if any(exact["radical_image"]):
        raise ArithmeticError("canonical global vector is not radical")
    if any(value != 0 for value in exact["scalar_pairings"].values()):
        raise ArithmeticError("a scalar P/O pairing is nonzero")
    if exact["cross_pairing_e_remainder"] != 1 or exact["cross_pairing_e_p"] != -1:
        raise ArithmeticError("canonical cross row was reconstructed incorrectly")
    if exact["q"] != 0 or exact["residual_coordinate"] != -1:
        raise ArithmeticError("finite residual reconstruction failed")
    if exact["alpha"] != 1 or exact["omega"] != 2:
        raise ArithmeticError("sector floors were reconstructed incorrectly")

    precision = artifact.get("precision_decimal_digits")
    if not isinstance(precision, int) or precision < 30:
        raise ValueError("invalid declared decimal precision")
    with localcontext() as context:
        context.prec = precision + 10

        exact_point_fields = {
            "radical_left_norm": Fraction(0),
            "radical_right_norm": Fraction(0),
            "cross_pairing_e_remainder": exact["cross_pairing_e_remainder"],
            "cross_pairing_e_p": exact["cross_pairing_e_p"],
            "q": exact["q"],
            "residual_norm": abs(exact["residual_coordinate"]),
            "even_complement_floor_alpha": exact["alpha"],
            "odd_floor_omega": exact["omega"],
        }
        for key, expected in exact_point_fields.items():
            expected_decimal = Decimal(expected.numerator) / Decimal(expected.denominator)
            if _decimal_text(artifact, key, key) != expected_decimal:
                raise ValueError(f"producer {key} is inconsistent")

        producer_pairings = artifact.get("scalar_pairings")
        if not isinstance(producer_pairings, dict):
            raise ValueError("missing producer scalar pairings")
        if set(producer_pairings) != set(exact["scalar_pairings"]):
            raise ValueError("producer scalar pairing schema is inconsistent")
        for key, expected in exact["scalar_pairings"].items():
            expected_decimal = Decimal(expected.numerator) / Decimal(expected.denominator)
            if _decimal_text(producer_pairings, key, f"scalar pairing {key}") != expected_decimal:
                raise ValueError(f"producer scalar pairing {key} is inconsistent")

        if artifact.get("strict_even_comparison") is not True:
            raise ValueError("producer strict even comparison is inconsistent")
        if artifact.get("strict_odd_comparison") is not True:
            raise ValueError("producer strict odd comparison is inconsistent")

        sqrt5 = Decimal(5).sqrt()
        u = (Decimal(1) - sqrt5) / Decimal(2)
        tau = (sqrt5 - Decimal(1)) / Decimal(2)
        tolerance = Decimal(10) ** (-(precision - 8))
        producer_u = _decimal_text(artifact, "two_dimensional_ritz_u", "Ritz value")
        producer_tau = _decimal_text(artifact, "weighted_action_tau", "weighted action")
        if abs(producer_u - u) > tolerance:
            raise ValueError("producer Ritz value is inconsistent")
        if abs(producer_tau - tau) > tolerance:
            raise ValueError("producer weighted action is inconsistent")
        weak = artifact.get("weak_dual")
        if not isinstance(weak, dict):
            raise ValueError("missing weak-dual data")
        if weak.get("dimension") != 1:
            raise ValueError("producer weak-dual dimension is inconsistent")
        exact_weak_fields = {
            "projected_norm_a": Decimal(1),
            "shift_U": Decimal(0),
            "rho": Decimal(0),
            "leakage_identity_defect": Decimal(0),
            "weighted_residual_norm": Decimal(1),
            "graph_dual_supremum": Decimal(1),
            "graph_duality_defect": Decimal(0),
            "shifted_floor_point": Decimal(1),
            "shifted_action_point": Decimal(1),
            "preconditioned_upper_bound_point": Decimal(1),
            "upper_minus_shifted_action": Decimal(0),
        }
        for key, expected in exact_weak_fields.items():
            if _decimal_text(weak, key, f"weak-dual {key}") != expected:
                raise ValueError(f"producer weak-dual {key} is inconsistent")
        if weak.get("preconditioner_hypothesis_pass") is not True:
            raise ValueError("producer preconditioner hypothesis is inconsistent")

        context.prec = precision
        tau_text = str(+tau)

    return {
        "artifact_version": "0.15.0-weak-residual-duality-replay",
        "terminal_state": "P0_INVALIDATED",
        "construction": artifact["construction"],
        "exact_radical_replay_pass": True,
        "exact_scalar_pairings_zero": True,
        "exact_residual_nonzero": True,
        "strict_sector_comparisons": bool(Decimal(1) > u and Decimal(2) > u),
        "replay_precision_decimal_digits": precision,
        "weighted_action_tau": tau_text,
        "independence": (
            "integer/rational algebra uses fractions.Fraction; displayed radicals use "
            "decimal.Decimal; no producer module or cached matrix is imported"
        ),
        "claim_scope": "independent_exact_obstruction_replay_not_asymptotic_proof",
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
