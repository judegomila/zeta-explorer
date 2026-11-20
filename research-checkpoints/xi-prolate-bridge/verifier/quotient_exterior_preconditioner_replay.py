#!/usr/bin/env python3
"""Independent exact replay of the quotient-preconditioner regression.

This verifier imports no producer module and trusts no producer matrices or
pass booleans. It reconstructs the rank-deficient model with Fraction and
uses Decimal only to compare serialized arbitrary-precision point values.
"""

from __future__ import annotations

import argparse
from decimal import Decimal, localcontext
from fractions import Fraction
import hashlib
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
VERSION = "0.16.0-quotient-exterior-preconditioner"


def _sha256(relative_path: str) -> str:
    return hashlib.sha256((ROOT / relative_path).read_bytes()).hexdigest()


def _fraction(text: object, label: str) -> Fraction:
    if not isinstance(text, str):
        raise ValueError(f"{label} must be exact rational text")
    try:
        return Fraction(text)
    except Exception as exc:
        raise ValueError(f"invalid exact rational for {label}") from exc


def _decimal(text: object, label: str) -> Decimal:
    if not isinstance(text, str):
        raise ValueError(f"{label} must be decimal text")
    try:
        return Decimal(text)
    except Exception as exc:
        raise ValueError(f"invalid decimal for {label}") from exc


def _decimal_matrix(value: object, rows: int, columns: int, label: str) -> list[list[Decimal]]:
    if not isinstance(value, list) or len(value) != rows:
        raise ValueError(f"{label} has the wrong row count")
    result: list[list[Decimal]] = []
    for row_index, row in enumerate(value):
        if not isinstance(row, list) or len(row) != columns:
            raise ValueError(f"{label} has the wrong column count")
        result.append(
            [
                _decimal(item, f"{label}[{row_index},{column_index}]")
                for column_index, item in enumerate(row)
            ]
        )
    return result


def _require_close(
    actual: Decimal, expected: Fraction, tolerance: Decimal, label: str
) -> None:
    target = Decimal(expected.numerator) / Decimal(expected.denominator)
    if abs(actual - target) > tolerance:
        raise ValueError(f"{label} is inconsistent with exact reconstruction")


def reconstruct_exact() -> dict[str, Any]:
    D = [Fraction(1), Fraction(4), Fraction(9)]
    W = [
        [Fraction(1), Fraction(0), Fraction(1)],
        [Fraction(0), Fraction(1), Fraction(0)],
    ]
    S = [[Fraction(1), Fraction(1)]]
    kernel = [Fraction(-1), Fraction(0), Fraction(1)]
    if any(sum(W[row][column] * kernel[column] for column in range(3)) for row in range(2)):
        raise ArithmeticError("declared exact source kernel is not a kernel")

    # A A* = W D^-1 W*, reconstructed without square roots.
    AA = [[Fraction(10, 9), Fraction(0)], [Fraction(0), Fraction(1, 4)]]
    Delta = [[Fraction(9, 10), Fraction(0)], [Fraction(0), Fraction(4)]]
    G = [[Fraction(1), Fraction(1)], [Fraction(1), Fraction(1)]]
    C_min = sum(
        S[0][row] * AA[row][column] * S[0][column]
        for row in range(2)
        for column in range(2)
    )
    if C_min != Fraction(49, 36):
        raise ArithmeticError("exact source sampling constant reconstruction failed")

    normalized_synthesis_norm_squared = max(AA[0][0], AA[1][1])
    quotient_floor = min(Delta[0][0], Delta[1][1])
    delta_inverse_forcing = [Fraction(10, 9), Fraction(1, 4)]
    alignment_Gamma = sum(value * value for value in delta_inverse_forcing)
    alignment_bound = C_min * normalized_synthesis_norm_squared

    # Source pullback W*GW is the all-ones matrix. Its normalized rank-one
    # eigenvalue is C_min, so C_min D-W*GW is exactly positive semidefinite.
    normalized_source_vector = [Fraction(1), Fraction(1, 2), Fraction(1, 3)]
    if sum(value * value for value in normalized_source_vector) != C_min:
        raise ArithmeticError("source Loewner saturation was reconstructed incorrectly")

    # C_min Delta-G is rank-one positive semidefinite with zero determinant.
    descent = [
        [C_min * Delta[0][0] - 1, Fraction(-1)],
        [Fraction(-1), C_min * Delta[1][1] - 1],
    ]
    if descent[0][0] < 0 or descent[1][1] < 0:
        raise ArithmeticError("quotient descent has a negative diagonal")
    if descent[0][0] * descent[1][1] - descent[0][1] ** 2 != 0:
        raise ArithmeticError("quotient descent determinant is not saturated")

    block_cross_aware_constant = C_min + Fraction(4, 3)
    block_actual_Gamma = (
        Fraction(10, 9) ** 2 + Fraction(1, 4) ** 2 + Fraction(2, 3) ** 2
    )
    block_Gamma_bound = block_cross_aware_constant * Fraction(10, 9)
    sharp_block_Gamma_bound = (
        C_min * Fraction(10, 9) + Fraction(4, 9)
    )
    if block_actual_Gamma > sharp_block_Gamma_bound:
        raise ArithmeticError("sharp block Gamma inequality failed")

    return {
        "D": D,
        "W": W,
        "S": S,
        "kernel": kernel,
        "AA": AA,
        "Delta": Delta,
        "G": G,
        "C_min": C_min,
        "normalized_synthesis_norm_squared": normalized_synthesis_norm_squared,
        "quotient_floor": quotient_floor,
        "alignment_Gamma": alignment_Gamma,
        "alignment_bound": alignment_bound,
        "forcing_action_squared": alignment_Gamma,
        "block_cross_aware_constant": block_cross_aware_constant,
        "block_actual_Gamma": block_actual_Gamma,
        "block_Gamma_bound": block_Gamma_bound,
        "sharp_block_Gamma_bound": sharp_block_Gamma_bound,
        "incorrect_block_maximum": C_min,
    }


def replay_artifact(artifact: dict[str, object]) -> dict[str, object]:
    if artifact.get("artifact_version") != VERSION:
        raise ValueError("unsupported quotient-preconditioner artifact version")
    if artifact.get("terminal_state") != "P0_INVALIDATED":
        raise ValueError("terminal state promotion is forbidden")
    if artifact.get("construction") != "rank_deficient_exact_quotient_model_v1":
        raise ValueError("unknown quotient regression construction")
    precision = artifact.get("precision_decimal_digits")
    if isinstance(precision, bool) or not isinstance(precision, int) or precision < 40:
        raise ValueError("invalid declared decimal precision")

    expected_hashes = {
        "notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md": _sha256(
            "notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md"
        ),
        "src/quotient_exterior_preconditioner.py": _sha256(
            "src/quotient_exterior_preconditioner.py"
        ),
        "verifier/quotient_exterior_preconditioner_replay.py": _sha256(
            "verifier/quotient_exterior_preconditioner_replay.py"
        ),
    }
    if artifact.get("provenance_sha256") != expected_hashes:
        raise ValueError("quotient-preconditioner provenance hash mismatch")

    exact = reconstruct_exact()
    inputs = artifact.get("exact_inputs")
    if not isinstance(inputs, dict):
        raise ValueError("missing exact quotient inputs")
    expected_inputs = {
        "D_integer_diagonal": ["1", "4", "9"],
        "W_integer_rows": [["1", "0", "1"], ["0", "1", "0"]],
        "S_integer_rows": [["1", "1"]],
        "forcing_integer_column": ["1", "1"],
        "epsilon_integer": "1",
        "shifted_operator_B_rational_diagonal": ["9/10", "4"],
        "source_kernel_integer_vector": ["-1", "0", "1"],
    }
    if inputs != expected_inputs:
        raise ValueError("producer exact inputs do not match independent construction")

    expected_rationals = artifact.get("exact_expected_rationals")
    if not isinstance(expected_rationals, dict):
        raise ValueError("missing exact expected rationals")
    rational_map = {
        "C_min": exact["C_min"],
        "normalized_synthesis_norm_squared": exact[
            "normalized_synthesis_norm_squared"
        ],
        "quotient_floor": exact["quotient_floor"],
        "alignment_Gamma": exact["alignment_Gamma"],
        "alignment_upper_bound": exact["alignment_bound"],
        "forcing_action_squared": exact["forcing_action_squared"],
        "block_cross_aware_constant": exact["block_cross_aware_constant"],
        "block_actual_Gamma": exact["block_actual_Gamma"],
        "block_Gamma_bound": exact["block_Gamma_bound"],
        "sharp_block_Gamma_bound": exact["sharp_block_Gamma_bound"],
    }
    if expected_rationals.get("quotient_diagonal") != ["9/10", "4"]:
        raise ValueError("incorrect exact quotient diagonal")
    for key, expected in rational_map.items():
        if _fraction(expected_rationals.get(key), key) != expected:
            raise ValueError(f"incorrect exact rational field {key}")

    flags = artifact.get("theorem_flags")
    expected_flags = {
        "source_injectivity_required": False,
        "ordinary_inverse_on_source_kernel_used": False,
        "moore_penrose_quotient_used": True,
        "low_high_sampling_cross_terms_retained": True,
        "defect_relative_exterior_sampling_proved": False,
        "shifted_signed_sector_comparison_proved": False,
        "equation_5_2_proved": False,
        "local_uniform_determinant_convergence_proved": False,
        "status_promoted": False,
    }
    if flags != expected_flags:
        raise ValueError("quotient theorem flags are inconsistent")

    point = artifact.get("quotient_point")
    if not isinstance(point, dict):
        raise ValueError("missing quotient point report")
    if point.get("physical_dimension") != 2 or point.get("source_dimension") != 3:
        raise ValueError("quotient point dimensions are inconsistent")
    if point.get("physical_range_dimension") != 2:
        raise ValueError("physical range dimension is inconsistent")
    if point.get("source_kernel_dimension") != 1:
        raise ValueError("source kernel was dropped")
    if point.get("source_map_injective") is not False:
        raise ValueError("rank-deficient source map was promoted to injective")
    if point.get("ordinary_source_inverse_permitted") is not False:
        raise ValueError("ordinary inversion on the source kernel is forbidden")

    tolerance = Decimal(10) ** (-(precision - 12))
    with localcontext() as context:
        context.prec = precision + 20
        quotient_matrix = _decimal_matrix(
            point.get("quotient_matrix_physical"), 2, 2, "quotient matrix"
        )
        expected_delta = exact["Delta"]
        for row in range(2):
            for column in range(2):
                _require_close(
                    quotient_matrix[row][column],
                    expected_delta[row][column],
                    tolerance,
                    f"quotient matrix [{row},{column}]",
                )

        scalar_fields = {
            "source_sampling_constant_C_min": exact["C_min"],
            "normalized_synthesis_norm_squared": exact[
                "normalized_synthesis_norm_squared"
            ],
            "quotient_floor": exact["quotient_floor"],
            "alignment_Gamma": exact["alignment_Gamma"],
            "alignment_upper_bound": exact["alignment_bound"],
            "left_closeness_rho": Fraction(0),
            "domination_mu": Fraction(1),
            "forcing_range_defect": Fraction(0),
            "quotient_floor_identity_defect": Fraction(0),
        }
        for key, expected in scalar_fields.items():
            _require_close(_decimal(point.get(key), key), expected, tolerance, key)

        for key in (
            "source_sampling_slack_floor",
            "quotient_sampling_slack_floor",
            "forcing_slack_floor",
        ):
            if abs(_decimal(point.get(key), key)) > tolerance:
                raise ValueError(f"{key} should be zero in the exact regression")

        action = _decimal(point.get("shifted_action"), "shifted action")
        _require_close(
            action * action,
            exact["forcing_action_squared"],
            tolerance * Decimal(10),
            "shifted action squared",
        )
        left_bound = _decimal(
            point.get("left_close_action_bound"), "left-close action bound"
        )
        dominating_bound = _decimal(
            point.get("dominating_action_bound"), "dominating action bound"
        )
        _require_close(
            left_bound * left_bound,
            exact["alignment_bound"],
            tolerance * Decimal(10),
            "left-close bound squared",
        )
        if abs(left_bound - dominating_bound) > tolerance:
            raise ValueError("mu=1 domination and rho=0 left bounds must agree")
        if action > left_bound:
            raise ArithmeticError("producer action exceeds theorem bound")

        block = artifact.get("block_cross_term_regression")
        if not isinstance(block, dict):
            raise ValueError("missing block cross-term regression")
        block_fields = {
            "high_metric_g": Fraction(3),
            "high_sampling_norm_squared_B_H": Fraction(4),
            "low_source_constant_C_L": exact["C_min"],
            "cross_aware_constant_formula": exact["block_cross_aware_constant"],
            "cross_aware_constant_direct": exact["block_cross_aware_constant"],
            "incorrect_maximum_of_block_constants": exact[
                "incorrect_block_maximum"
            ],
            "block_inverse_norm": Fraction(10, 9),
            "actual_block_Gamma": exact["block_actual_Gamma"],
            "block_Gamma_bound": exact["block_Gamma_bound"],
            "sharp_block_Gamma_bound": exact["sharp_block_Gamma_bound"],
        }
        for key, expected in block_fields.items():
            _require_close(_decimal(block.get(key), key), expected, tolerance, key)
        if exact["block_cross_aware_constant"] <= exact["incorrect_block_maximum"]:
            raise ArithmeticError("cross-block sum regression does not defeat max shortcut")
        if exact["block_actual_Gamma"] > exact["sharp_block_Gamma_bound"]:
            raise ArithmeticError("independent sharp block bound failed")

    return {
        "artifact_version": "0.16.0-quotient-exterior-preconditioner-replay",
        "terminal_state": "P0_INVALIDATED",
        "producer_canonical_json_sha256": hashlib.sha256(
            (json.dumps(artifact, sort_keys=True, separators=(",", ":")) + "\n").encode()
        ).hexdigest(),
        "independent_arithmetic": "fractions.Fraction plus decimal.Decimal",
        "source_kernel_dimension": 1,
        "quotient_identity_pass": True,
        "sampling_descent_pass": True,
        "alignment_bound_pass": True,
        "left_close_action_pass": True,
        "dominating_action_pass": True,
        "block_cross_term_pass": True,
        "defect_relative_exterior_sampling_proved": False,
        "shifted_signed_sector_comparison_proved": False,
        "equation_5_2_proved": False,
        "claim_scope": "independent exact finite-linear-algebra replay",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--artifact", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    artifact = json.loads(args.artifact.read_text())
    result = replay_artifact(artifact)
    text = json.dumps(result, indent=2) + "\n"
    if args.output is None:
        print(text, end="")
    else:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text)


if __name__ == "__main__":
    main()
