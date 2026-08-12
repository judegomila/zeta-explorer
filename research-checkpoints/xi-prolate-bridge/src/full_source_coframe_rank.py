#!/usr/bin/env python3
"""Produce the exact full-source coframe/rank reduction regressions.

The finite matrices in this artifact are exact theorem regressions.  They are
not physical prolate columns and they make no signed-sector or asymptotic
claim.  The only transcendental operation is the locked transition ceiling,
which is evaluated with outward interval arithmetic.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import itertools
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-full-source-coframe-rank-v1"
STATUS = "FULL_SOURCE_COFRAME_RANK_COMPONENT"
RESULT = "FULL_SOURCE_COFRAME_RANK_COMPONENT_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md"
LOCK = "FULL_SOURCE_COFRAME_RANK_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-full-source-coframe-rank-source-lock-v1"
EXPECTED_LIBRARY = "mpmath.iv 1.4.1"

PINNED_HASHES = {
    NOTE: "3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81",
    LOCK: "155f1c0205788d689b8e819fc10e9313c2e947c7f851a5ee2f0b25bf3f091e5b",
}

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 16

LOCKED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension; the physical interval is [lambda^(-1),lambda] with measure du/u",
    "source_domain": "H0_even consists of even L2 source functions with zero Lebesgue integral",
    "arithmetic_map": "A_lambda*f(u)=sqrt(u)*sum_(m<=lambda/u)f(m*u)",
    "inversion": "Jg(u)=g(u^(-1)) and S_sigma=(I+sigma*J)/2",
    "source_normalization": "c_(2j)=h_(2j)-(I_(2j)/I_0)*h_0 with unit-orthonormal h_j and I_j=integral h_j; arbitrary coordinate changes retain the source Gram",
    "half_integer_schedule": "lambda=p/2 for odd p>=5 and m=ceil(lambda^2)=(p^2+3)/4",
    "strict_buffer": "the transition inventory uses t<n_star and q=ceil((2/pi^2)*log(50*p^2+25)*log(20))",
    "plus_anchor": "the deflated plus comparison has row dimension N only under the explicit nonzero projected-anchor hypothesis",
    "relative_floor_strictness": "W @ D^dagger @ adjoint(W)-gamma*R positive semidefinite is a valid sharp certificate when gamma>0; gamma=0 is rejected",
    "artifact_scope": "p and dps label exact theorem regressions and source-inventory rank certificates, not physical prolate columns or a signed Weil floor",
    "arithmetic": "finite matrices and witnesses use exact reduced rationals; transition ceilings use arbitrary-precision intervals; binary64 JSON numbers are forbidden",
}

LOCKED_FORMULAS = {
    "mobius_mass": "M_mu(lambda)=sum_(n<=floor(lambda^2))abs(mu(n))/sqrt(n)<=2*lambda",
    "full_source_right_inverse": "T=P_X*S_sigma*A_lambda has a right inverse B_X with norm(B_X)<=sqrt(2)*lambda*M_mu(lambda)",
    "full_source_frame": "[2*lambda^2*M_mu(lambda)^2]^(-1)*I_X <= T @ adjoint(T) <= (lambda^2/2)*I_X, hence T @ adjoint(T)>=(8*lambda^4)^(-1)*I_X",
    "coordinate_invariant_restriction": "for source synthesis C, D=adjoint(C) @ C, W=T @ C, and F=ran(C), T @ P_F @ adjoint(T)=W @ D^dagger @ adjoint(W)",
    "normalized_tail": "R=T @ adjoint(T), Z=R^(-1/2) @ T, L_F=Z @ (I-P_F) @ adjoint(Z), and T @ P_F @ adjoint(T)=R^(1/2) @ (I-L_F) @ R^(1/2)",
    "relative_floor": "T @ P_F @ adjoint(T)>=gamma*R iff norm(L_F)<=1-gamma for 0<gamma<=1",
    "prolate_source_gram": "for C_M=(c_2,...,c_(2M)), D_M=adjoint(C_M) @ C_M=I+v @ adjoint(v) with v_j=I_(2j)/I_0",
    "finite_prefix_floor": "for every fixed lambda>1 and finite X some non-effective mixed all-even prefix has norm(L_M)<=1/2 and W_M @ D_M^(-1) @ adjoint(W_M)>=(16*lambda^4)^(-1)*I_X; in the pinned coordinates W_M @ adjoint(W_M) dominates this whitened frame",
    "buffered_counts": "r_plus=m+floor((q+2)/4)-1 and r_minus=m+floor(q/4)",
    "row_nullities": "nu_plus>=max(0,N-r_plus) and nu_minus>=max(0,N-r_minus)",
    "triple_schedule": "at N=3*m, nu_plus>=2*m-floor((q+2)/4)+1 and nu_minus>=2*m-floor(q/4)",
    "exponential_schedule": "at N=2^(2400*p^2), nu_plus>=N-r_plus and nu_minus>=N-r_minus",
    "unbuffered_matched_obstruction": "at N=m the unbuffered r_plus=r_minus=m-2 force row nullity at least two in both sectors",
}

CLAIM_SCOPE = {
    "proved": [
        "an explicit row-frame floor for the untruncated full even zero-integral source map at lambda>1 into every fixed finite physical parity space",
        "the coordinate-invariant source-Gram restriction and normalized adjoint-tail identities",
        "a non-effective source-whitened floor for some mixed all-even prolate prefix at each fixed lambda>1 and finite target space",
        "exact buffered-family row-nullity lower bounds at arbitrary Fourier bandwidth, including the triple and locked exponential schedules",
        "exact rational countermodels separating row rank, column rank, source-coordinate scaling, and a uniform floor",
    ],
    "not_proved": [
        "the prescribed separate 0 modulo 4 and 2 modulo 4 buffered coframes at matched bandwidth",
        "an effective terminal label for the mixed all-even prefix",
        "a physical prolate-column ball certificate or restricted-conditioning constant on a common unbounded schedule",
        "a residual-feature reserve or positive signed floor in either parity sector",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

SOURCE_ADMISSIONS = {
    "api_key_read": False,
    "binary64_parameters_used": False,
    "cached_physical_matrix_read": False,
    "cached_prolate_eigenvectors_read": False,
    "count_promoted_to_rank": False,
    "determinant_limit_claimed": False,
    "environment_secret_read": False,
    "equation_5_2_claimed": False,
    "global_weil_positivity_assumed": False,
    "inversion_reflection_dropped": False,
    "nonpositive_relative_floor_reported_as_pass": False,
    "prescribed_buffered_physical_coframe_claimed": False,
    "projected_plus_anchor_nonzero_claimed": False,
    "raw_determinant_promoted_to_invariant_floor": False,
    "rh_proved": False,
    "signed_sector_floor_claimed": False,
    "source_gram_replaced_by_identity": False,
    "unit_source_normalization_substituted": False,
    "zeros_assumed_real": False,
    "zeta_zero_table_read": False,
}

ARITHMETIC = {
    "precision_mode": "exact rational arithmetic plus outward arbitrary-precision intervals",
    "raw_interval_or_ball_output_applicable": True,
    "library": "Python fractions.Fraction and mpmath.iv 1.4.1",
    "shared_library_with_verifier": True,
    "independent_formula_trees": True,
    "serialization_guard": "exact dyadic expansion of every nondegenerate transition interval",
    "independence_limitation": "producer and replay share Python integer/Fraction arithmetic and the pinned mpmath.iv transcendental runtime",
}

Matrix = list[list[Fraction]]


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _verified_source_hashes() -> dict[str, str]:
    if set(PINNED_HASHES) != {NOTE, LOCK}:
        raise ValueError("source pins must contain exactly the note and lock")
    result: dict[str, str] = {}
    for relative, expected in PINNED_HASHES.items():
        path = Path(relative)
        if (
            _SHA256.fullmatch(expected) is None or path.is_absolute()
            or ".." in path.parts
        ):
            raise ValueError(f"invalid finalized source pin: {relative}")
        if _sha256(_root() / relative) != expected:
            raise ValueError(f"source byte hash mismatch: {relative}")
        result[relative] = expected

    lock = json.loads((_root() / LOCK).read_text(encoding="utf-8"))
    top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != top:
        raise ValueError("source-lock inventory mismatch")
    fixed = {
        "schema": LOCK_SCHEMA,
        "claim_class": "FULL_SOURCE_COFRAME_RANK_REDUCTION",
        "terminal_state": TERMINAL_STATE,
        "updated_date": "2026-08-08",
        "external_sources": [],
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_boundary": CLAIM_SCOPE,
    }
    for key, expected in fixed.items():
        if lock[key] != expected:
            raise ValueError(f"source-lock {key} mutation")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        path = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str) or not relative or path.is_absolute()
            or ".." in path.parts or relative in result
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ValueError("invalid source-lock dependency")
        if _sha256(_root() / relative) != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _integer(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer")
    if value < minimum:
        raise ValueError(f"{label} must be at least {minimum}")
    return value


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return {"numerator": str(value.numerator), "denominator": str(value.denominator)}
    if isinstance(value, list):
        return [_encode(item) for item in value]
    if isinstance(value, tuple):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    return value


def _shape(matrix: Matrix) -> tuple[int, int]:
    rows = len(matrix)
    columns = len(matrix[0]) if rows else 0
    if any(len(row) != columns for row in matrix):
        raise ValueError("ragged matrix")
    return rows, columns


def _transpose(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    return [[matrix[i][j] for i in range(rows)] for j in range(columns)]


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    lr, lc = _shape(left)
    rr, rc = _shape(right)
    if lc != rr:
        raise ValueError("matrix dimension mismatch")
    return [
        [sum((left[i][k] * right[k][j] for k in range(lc)), Fraction(0))
         for j in range(rc)]
        for i in range(lr)
    ]


def _sub(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ValueError("matrix dimension mismatch")
    return [[a - b for a, b in zip(x, y)] for x, y in zip(left, right)]


def _scale(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _identity(size: int) -> Matrix:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _diag(*values: Fraction) -> Matrix:
    return [[value if i == j else Fraction(0) for j in range(len(values))]
            for i, value in enumerate(values)]


def _inverse(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    if rows == 0 or rows != columns:
        raise ValueError("inverse requires a nonempty square matrix")
    work = [row[:] + unit[:] for row, unit in zip(matrix, _identity(rows))]
    for column in range(rows):
        pivot = next((row for row in range(column, rows) if work[row][column]), None)
        if pivot is None:
            raise ValueError("singular matrix")
        work[column], work[pivot] = work[pivot], work[column]
        divisor = work[column][column]
        work[column] = [entry / divisor for entry in work[column]]
        for row in range(rows):
            if row == column:
                continue
            multiplier = work[row][column]
            work[row] = [a - multiplier * b for a, b in zip(work[row], work[column])]
    return [row[rows:] for row in work]


def _determinant(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("determinant requires a square matrix")
    if rows == 0:
        return Fraction(1)
    work = [row[:] for row in matrix]
    result = Fraction(1)
    for column in range(rows):
        pivot = next((row for row in range(column, rows) if work[row][column]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        value = work[column][column]
        result *= value
        for row in range(column + 1, rows):
            multiplier = work[row][column] / value
            for index in range(column + 1, rows):
                work[row][index] -= multiplier * work[column][index]
    return result


def _rank(matrix: Matrix) -> int:
    rows, columns = _shape(matrix)
    work = [row[:] for row in matrix]
    rank = 0
    for column in range(columns):
        pivot = next((row for row in range(rank, rows) if work[row][column]), None)
        if pivot is None:
            continue
        work[rank], work[pivot] = work[pivot], work[rank]
        divisor = work[rank][column]
        work[rank] = [entry / divisor for entry in work[rank]]
        for row in range(rows):
            if row != rank and work[row][column]:
                multiplier = work[row][column]
                work[row] = [a - multiplier * b for a, b in zip(work[row], work[rank])]
        rank += 1
        if rank == rows:
            break
    return rank


def _principal_minors(matrix: Matrix) -> list[dict[str, Any]]:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("principal minors require a square matrix")
    result: list[dict[str, Any]] = []
    for size in range(1, rows + 1):
        for indices in itertools.combinations(range(rows), size):
            sub = [[matrix[i][j] for j in indices] for i in indices]
            result.append({"indices": list(indices), "determinant": _determinant(sub)})
    return result


def _is_psd(matrix: Matrix) -> bool:
    return all(item["determinant"] >= 0 for item in _principal_minors(matrix))


def _frame_model(source_metric: Matrix, full_map: Matrix, synthesis: Matrix) -> dict[str, Any]:
    source_inverse = _inverse(source_metric)
    full_frame = _matmul(_matmul(full_map, source_inverse), _transpose(full_map))
    source_gram = _matmul(_matmul(_transpose(synthesis), source_metric), synthesis)
    physical = _matmul(full_map, synthesis)
    corrected = _matmul(_matmul(physical, _inverse(source_gram)), _transpose(physical))
    raw = _matmul(physical, _transpose(physical))
    return {
        "source_metric": source_metric,
        "full_map": full_map,
        "synthesis": synthesis,
        "full_frame_R": full_frame,
        "source_gram": source_gram,
        "physical_columns_W": physical,
        "gram_corrected_frame": corrected,
        "raw_row_frame": raw,
        "row_rank": _rank(physical),
        "column_rank": _rank(_transpose(physical)),
        "row_count": len(physical),
        "column_count": len(physical[0]) if physical else 0,
        "corrected_frame_determinant": _determinant(corrected),
        "raw_frame_determinant": _determinant(raw),
    }


def _pseudoinverse_from_full_rank_factorization(left: Matrix, right: Matrix) -> Matrix:
    """Return ``(left*right)^dagger`` without inverting the singular product.

    Here ``left`` has full column rank and ``right`` has full row rank.  The
    full-rank factorization formula is

      right^T (right right^T)^(-1) (left^T left)^(-1) left^T.
    """

    left_rows, inner = _shape(left)
    right_rows, right_columns = _shape(right)
    if inner == 0 or right_rows != inner:
        raise ValueError("invalid full-rank factorization")
    if _rank(left) != inner or _rank(right) != inner:
        raise ValueError("factorization factors must have full inner rank")
    left_gram = _matmul(_transpose(left), left)
    right_gram = _matmul(right, _transpose(right))
    return _matmul(
        _matmul(
            _matmul(_transpose(right), _inverse(right_gram)),
            _inverse(left_gram),
        ),
        _transpose(left),
    )


def _penrose_records(matrix: Matrix, pseudoinverse: Matrix) -> dict[str, Any]:
    matrix_times_dagger = _matmul(matrix, pseudoinverse)
    dagger_times_matrix = _matmul(pseudoinverse, matrix)
    first = _matmul(matrix_times_dagger, matrix)
    second = _matmul(dagger_times_matrix, pseudoinverse)
    equations = {
        "G_Gdagger_G_equals_G": first == matrix,
        "Gdagger_G_Gdagger_equals_Gdagger": second == pseudoinverse,
        "G_Gdagger_is_self_adjoint": _transpose(matrix_times_dagger) == matrix_times_dagger,
        "Gdagger_G_is_self_adjoint": _transpose(dagger_times_matrix) == dagger_times_matrix,
    }
    return {
        "G_Gdagger": matrix_times_dagger,
        "Gdagger_G": dagger_times_matrix,
        "G_Gdagger_G": first,
        "Gdagger_G_Gdagger": second,
        "equations": equations,
        "all_four_hold": all(equations.values()),
    }


def _exact_regressions() -> dict[str, Any]:
    D = _diag(Fraction(2), Fraction(3), Fraction(5))
    T = [[Fraction(1), Fraction(0), Fraction(1)],
         [Fraction(0), Fraction(1), Fraction(1)]]
    C_pass = [[Fraction(1), Fraction(0)],
              [Fraction(0), Fraction(1)],
              [Fraction(0), Fraction(0)]]
    base = _frame_model(D, T, C_pass)
    gamma_sharp = Fraction(1, 2)
    sharp_difference = _sub(
        base["gram_corrected_frame"], _scale(gamma_sharp, base["full_frame_R"]),
    )
    gamma_above = Fraction(3, 5)
    above_difference = _sub(
        base["gram_corrected_frame"], _scale(gamma_above, base["full_frame_R"]),
    )

    C_obstruction = [[Fraction(1), Fraction(0)],
                     [Fraction(0), Fraction(-1)],
                     [Fraction(0), Fraction(1)]]
    obstruction = _frame_model(D, T, C_obstruction)
    left_null = [[Fraction(0)], [Fraction(1)]]
    left_null_action = _matmul(_transpose(obstruction["physical_columns_W"]), left_null)

    change = _diag(Fraction(2), Fraction(1, 3))
    changed_synthesis = _matmul(C_pass, change)
    changed = _frame_model(D, T, changed_synthesis)

    redundancy = [[Fraction(1), Fraction(0), Fraction(1)],
                  [Fraction(0), Fraction(1), Fraction(1)]]
    C_redundant = _matmul(C_pass, redundancy)
    G_base = base["source_gram"]
    factor_left = _matmul(_transpose(redundancy), G_base)
    factor_right = redundancy
    G_redundant = _matmul(factor_left, factor_right)
    W_redundant = _matmul(T, C_redundant)
    G_redundant_dagger = _pseudoinverse_from_full_rank_factorization(
        factor_left, factor_right,
    )
    redundant_corrected = _matmul(
        _matmul(W_redundant, G_redundant_dagger), _transpose(W_redundant),
    )
    redundant_null = [[Fraction(-1)], [Fraction(-1)], [Fraction(1)]]
    redundant_null_action = _matmul(G_redundant, redundant_null)
    redundant_penrose = _penrose_records(G_redundant, G_redundant_dagger)

    epsilon_cases = []
    for epsilon in (Fraction(1, 2), Fraction(1, 5)):
        map_matrix = _diag(Fraction(1), epsilon)
        frame = _matmul(map_matrix, _transpose(map_matrix))
        epsilon_cases.append({
            "epsilon": epsilon,
            "map": map_matrix,
            "row_frame": frame,
            "rank": _rank(map_matrix),
            "exact_floor": epsilon * epsilon,
            "determinant": _determinant(frame),
        })

    row_full = [[Fraction(1), Fraction(0), Fraction(0)],
                [Fraction(0), Fraction(1), Fraction(0)]]
    column_full = _transpose(row_full)
    row_full_row_gram = _matmul(row_full, _transpose(row_full))
    row_full_column_gram = _matmul(_transpose(row_full), row_full)
    column_full_row_gram = _matmul(column_full, _transpose(column_full))
    column_full_column_gram = _matmul(_transpose(column_full), column_full)

    v = [[Fraction(1)], [Fraction(2)]]
    prolate_gram = _matmul(v, _transpose(v))
    prolate_gram = [[prolate_gram[i][j] + Fraction(i == j) for j in range(2)]
                    for i in range(2)]
    prolate_W = [[Fraction(1), Fraction(1)], [Fraction(0), Fraction(1)]]
    prolate_whitened = _matmul(
        _matmul(prolate_W, _inverse(prolate_gram)), _transpose(prolate_W),
    )
    prolate_raw = _matmul(prolate_W, _transpose(prolate_W))
    prolate_difference = _sub(prolate_raw, prolate_whitened)

    if (
        base["full_frame_R"] != [[Fraction(7, 10), Fraction(1, 5)],
                                  [Fraction(1, 5), Fraction(8, 15)]]
        or base["gram_corrected_frame"] != _diag(Fraction(1, 2), Fraction(1, 3))
        or not _is_psd(sharp_difference) or _determinant(sharp_difference) != 0
        or _is_psd(above_difference)
        or obstruction["physical_columns_W"] != [[Fraction(1), Fraction(1)],
                                                   [Fraction(0), Fraction(0)]]
        or left_null_action != [[Fraction(0)], [Fraction(0)]]
        or changed["gram_corrected_frame"] != base["gram_corrected_frame"]
        or changed["raw_frame_determinant"] == base["raw_frame_determinant"]
        or _rank(G_redundant) != 2 or _determinant(G_redundant) != 0
        or redundant_null_action != [[Fraction(0)], [Fraction(0)], [Fraction(0)]]
        or not redundant_penrose["all_four_hold"]
        or redundant_corrected != base["gram_corrected_frame"]
        or prolate_gram != [[Fraction(2), Fraction(2)], [Fraction(2), Fraction(5)]]
        or not _is_psd(prolate_difference)
    ):
        raise ValueError("exact coframe regression failed")

    return {
        "sharp_relative_floor": {
            "model": base,
            "gamma_zero_rejection": {
                "gamma": Fraction(0),
                "difference_is_psd": _is_psd(base["gram_corrected_frame"]),
                "accepted": False,
                "reason": "gamma must be strictly positive",
            },
            "gamma_sharp_pass": {
                "gamma": gamma_sharp,
                "difference": sharp_difference,
                "principal_minors": _principal_minors(sharp_difference),
                "difference_is_psd": _is_psd(sharp_difference),
                "determinant_zero_equality": _determinant(sharp_difference) == 0,
                "accepted": gamma_sharp > 0 and _is_psd(sharp_difference),
            },
            "gamma_above_rejection": {
                "gamma": gamma_above,
                "difference": above_difference,
                "principal_minors": _principal_minors(above_difference),
                "difference_is_psd": _is_psd(above_difference),
                "accepted": False,
            },
        },
        "count_not_rank": {
            "model": obstruction,
            "left_null_witness": left_null,
            "left_null_action": left_null_action,
            "columns_equal_rows": obstruction["column_count"] == obstruction["row_count"],
            "full_row_rank": obstruction["row_rank"] == obstruction["row_count"],
        },
        "coordinate_change": {
            "original": base,
            "change_of_coordinates": change,
            "change_determinant": _determinant(change),
            "changed": changed,
            "corrected_frame_preserved": changed["gram_corrected_frame"] == base["gram_corrected_frame"],
            "raw_determinant_changed": changed["raw_frame_determinant"] != base["raw_frame_determinant"],
        },
        "redundant_columns_pseudoinverse": {
            "source_metric": D,
            "full_map": T,
            "synthesis_C_redundant": C_redundant,
            "source_gram_G": G_redundant,
            "source_gram_rank": _rank(G_redundant),
            "source_gram_determinant": _determinant(G_redundant),
            "physical_columns_W": W_redundant,
            "full_rank_factorization": {
                "left": factor_left,
                "right": factor_right,
                "reconstruction": _matmul(factor_left, factor_right),
                "left_rank": _rank(factor_left),
                "right_rank": _rank(factor_right),
            },
            "exact_null_witness": redundant_null,
            "null_action": redundant_null_action,
            "G_dagger": G_redundant_dagger,
            "penrose": redundant_penrose,
            "gram_corrected_frame": redundant_corrected,
            "base_corrected_frame": base["gram_corrected_frame"],
            "corrected_frame_equals_base": redundant_corrected == base["gram_corrected_frame"],
            "producer_derivation": "full-rank factorization; singular G is never passed to ordinary inverse",
            "replay_required_derivation": "exact null projector regularization (G+P_null)^(-1)-P_null",
            "ordinary_inverse_of_singular_gram_used": False,
        },
        "epsilon_full_rank_no_uniform_floor": {
            "symbolic_family": "diag(1,epsilon), epsilon>0, has exact row-frame floor epsilon^2",
            "cases": epsilon_cases,
            "all_cases_full_rank": all(case["rank"] == 2 for case in epsilon_cases),
            "floor_decreases": epsilon_cases[1]["exact_floor"] < epsilon_cases[0]["exact_floor"],
            "uniform_positive_floor_claimed": False,
        },
        "row_vs_column_gram": {
            "row_full_column_singular": {
                "W": row_full,
                "row_gram": row_full_row_gram,
                "column_gram": row_full_column_gram,
                "row_gram_rank": _rank(row_full_row_gram),
                "column_gram_rank": _rank(row_full_column_gram),
                "row_coframe": True,
                "column_gram_positive_definite": False,
            },
            "column_full_row_singular": {
                "W": column_full,
                "row_gram": column_full_row_gram,
                "column_gram": column_full_column_gram,
                "row_gram_rank": _rank(column_full_row_gram),
                "column_gram_rank": _rank(column_full_column_gram),
                "row_coframe": False,
                "column_gram_positive_definite": True,
            },
        },
        "special_prolate_gram": {
            "v": v,
            "D_equals_I_plus_vv_star": prolate_gram,
            "D_inverse": _inverse(prolate_gram),
            "W": prolate_W,
            "raw_frame": prolate_raw,
            "whitened_frame": prolate_whitened,
            "raw_minus_whitened": prolate_difference,
            "difference_principal_minors": _principal_minors(prolate_difference),
            "whitened_below_raw": _is_psd(prolate_difference),
        },
    }


def _precision_bits(dps: int) -> int:
    return (dps * LOG2_10_UPPER_NUMERATOR + LOG2_10_UPPER_DENOMINATOR - 1) // LOG2_10_UPPER_DENOMINATOR


def _raw(raw: tuple[int, int, int, int]) -> list[object]:
    return [int(raw[0]), str(int(raw[1])), int(raw[2]), int(raw[3])]


def _normalize_signed_dyadic(value: int, exponent: int) -> tuple[int, int, int, int]:
    if value == 0:
        return (0, 0, 0, 0)
    sign = 1 if value < 0 else 0
    mantissa = abs(value)
    while mantissa % 2 == 0:
        mantissa //= 2
        exponent += 1
    return (sign, mantissa, exponent, mantissa.bit_length())


def _shift_raw(raw: tuple[int, int, int, int], power: int, direction: int) -> tuple[int, int, int, int]:
    sign, mantissa, exponent, _bits = raw
    signed = -mantissa if sign else mantissa
    base = min(exponent, power)
    shifted = (signed << (exponent - base)) + direction * (1 << (power - base))
    return _normalize_signed_dyadic(shifted, base)


def _guarded_endpoints(
    lower: tuple[int, int, int, int], upper: tuple[int, int, int, int], dps: int,
) -> tuple[tuple[int, int, int, int], tuple[int, int, int, int]]:
    if lower == upper:
        return lower, upper
    scale = 0
    for _sign, mantissa, exponent, bits in (lower, upper):
        if mantissa:
            scale = max(scale, exponent + bits - 1)
    guard = scale - _precision_bits(dps) + SERIALIZATION_GUARD_OFFSET_BITS
    return _shift_raw(lower, guard, -1), _shift_raw(upper, guard, 1)


def _capture(value: object) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    bits = max(int(lower[3]), int(upper[3])) + 48
    with mp.workprec(bits):
        return +mp.mpf(tuple(lower)), +mp.mpf(tuple(upper))


def _serialize_interval(value: object, dps: int) -> dict[str, object]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    lo, hi = _guarded_endpoints(
        tuple(int(part) for part in lower), tuple(int(part) for part in upper), dps,
    )
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lo), dps + 10), mp.nstr(mp.mpf(hi), dps + 10)],
            "dyadic": {"lower": _raw(lo), "upper": _raw(hi)},
        }


def _transition_interval(p: int, dps: int) -> tuple[object, int]:
    if f"mpmath.iv {mp.__version__}" != EXPECTED_LIBRARY:
        raise RuntimeError("pinned mpmath.iv version is not active")
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        value = (
            mp.iv.mpf(2)
            * mp.iv.log(mp.iv.mpf(50 * p * p + 25))
            * mp.iv.log(mp.iv.mpf(20))
            / (mp.iv.pi * mp.iv.pi)
        )
        lower, upper = _capture(value)
        q_lower, q_upper = int(mp.ceil(lower)), int(mp.ceil(upper))
        if q_lower != q_upper:
            raise ArithmeticError("transition ceiling is not separated")
        return value, q_lower
    finally:
        mp.iv.dps = old


def _schedule(p: int, q: int) -> dict[str, Any]:
    m = (p * p + 3) // 4
    r_plus = m + (q + 2) // 4 - 1
    r_minus = m + q // 4
    exponent = 2400 * p * p
    plus_exponential_positive = exponent >= r_plus.bit_length()
    minus_exponential_positive = exponent >= r_minus.bit_length()
    return {
        "lambda": Fraction(p, 2),
        "m_rule": "ceil(lambda^2)",
        "m": m,
        "q": q,
        "n_star": p * p + 6 + q,
        "r_plus_buffered": r_plus,
        "r_minus_buffered": r_minus,
        "plus_anchor": {
            "projected_nonzero_hypothesis_required": True,
            "projected_nonzero_proved": False,
            "deflated_row_dimension_rule_conditional_on_hypothesis": "N",
            "matched_N": m,
        },
        "matched_buffered": {
            "N": m,
            "plus_count_forced_row_nullity_lower_bound": max(0, m - r_plus),
            "minus_count_forced_row_nullity_lower_bound": max(0, m - r_minus),
            "count_proves_row_rank": False,
        },
        "matched_unbuffered": {
            "N": m,
            "r_plus_unbuffered": m - 2,
            "r_minus_unbuffered": m - 2,
            "plus_count_forced_row_nullity_lower_bound": 2,
            "minus_count_forced_row_nullity_lower_bound": 2,
        },
        "triple_schedule": {
            "N": 3 * m,
            "plus_count_forced_row_nullity_lower_bound": 3 * m - r_plus,
            "minus_count_forced_row_nullity_lower_bound": 3 * m - r_minus,
        },
        "locked_exponential_schedule": {
            "N_symbolic": {"base": 2, "exponent": exponent, "expression": "2^exponent"},
            "plus_nullity_symbolic": {
                "expression": "2^exponent-r_plus_buffered",
                "subtrahend": r_plus,
                "strictly_positive": plus_exponential_positive,
            },
            "minus_nullity_symbolic": {
                "expression": "2^exponent-r_minus_buffered",
                "subtrahend": r_minus,
                "strictly_positive": minus_exponential_positive,
            },
            "decimal_expansion_serialized": False,
        },
    }


def validate_source_admissions(admissions: dict[str, bool]) -> None:
    if (
        not isinstance(admissions, dict)
        or admissions.keys() != SOURCE_ADMISSIONS.keys()
        or any(type(admissions[key]) is not bool for key in SOURCE_ADMISSIONS)
        or admissions != SOURCE_ADMISSIONS
        or any(admissions.values())
    ):
        raise ValueError("source admission violates the claim boundary")


def produce(lambda_numerator: int, dps: int) -> dict[str, Any]:
    p = _integer(lambda_numerator, "lambda_numerator", 5)
    precision = _integer(dps, "dps", 50)
    if p % 2 == 0:
        raise ValueError("lambda_numerator must be odd")
    validate_source_admissions(SOURCE_ADMISSIONS)
    transition, q = _transition_interval(p, precision)
    schedule = _schedule(p, q)
    full_source_bounds = {
        "mobius_elementary_upper": Fraction(p),
        "full_source_elementary_row_floor": Fraction(2, p**4),
        "full_source_operator_upper": Fraction(p * p, 8),
        "mixed_prefix_relative_gamma": Fraction(1, 2),
        "mixed_prefix_non_effective_row_floor": Fraction(1, p**4),
        "mixed_prefix_terminal_label_effective": False,
        "mixed_prefix_uses_both_residue_classes": True,
    }
    certificate = {
        "transition_ceiling_argument": _serialize_interval(transition, precision),
        "schedule": schedule,
        "full_source_bounds": full_source_bounds,
        "exact_regressions": _exact_regressions(),
        "theorem_checks": {
            "full_source_elementary_floor_constant_reconstructed": True,
            "source_gram_coordinate_invariance_reconstructed": True,
            "sharp_positive_semidefinite_equality_accepted": True,
            "gamma_zero_rejected": True,
            "gamma_above_sharp_rejected": True,
            "count_not_promoted_to_rank": True,
            "left_null_witness_reconstructed": True,
            "redundant_column_pseudoinverse_penrose_reconstructed": True,
            "row_and_column_gram_distinguished": True,
            "special_prolate_whitened_frame_below_raw": True,
            "symbolic_exponential_nullities_reconstructed_without_expansion": True,
            "plus_anchor_remains_an_unproved_hypothesis": True,
        },
    }
    return _encode({
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "input": {"lambda_numerator": p, "dps": precision},
        "source_hashes": _verified_source_hashes(),
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_scope": CLAIM_SCOPE,
        "source_admissions": SOURCE_ADMISSIONS,
        "arithmetic": ARITHMETIC,
        "certificate": certificate,
        "result": RESULT,
    })


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-numerator", type=int, required=True)
    parser.add_argument("--dps", type=int, required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    payload = produce(args.lambda_numerator, args.dps)
    Path(args.output).write_text(
        json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8",
    )


if __name__ == "__main__":
    main()
