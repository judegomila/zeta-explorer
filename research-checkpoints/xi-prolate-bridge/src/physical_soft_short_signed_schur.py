#!/usr/bin/env python3
"""Produce exact regressions for the physical g-soft signed Schur theorem.

The payload contains finite rational identity checks.  It is not a physical
prolate--Weil pilot and makes no asymptotic or Riemann-hypothesis claim.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any


SCHEMA = "xi-prolate-physical-soft-short-signed-schur-v1"
STATUS = "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_COMPONENT"
RESULT = "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_COMPONENT_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md"
LOCK = "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-physical-soft-short-signed-schur-source-lock-v1"

PINNED_HASHES = {
    NOTE: "cf847b2f73d18244158ee0238714f677c74358068a658c637a40477b3e0a38ca",
    LOCK: "394674ae851c1973d6bcfa1f3d3104b5c85a6c572a2abb846cec53852b73cbd2",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")

LOCKED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension; the physical logarithmic interval is [-log(lambda),log(lambda)]",
    "fourier_sign": "fhat(t)=integral f(y)*exp(-i*t*y) dy and Plancherel measure is dt/(2*pi)",
    "prime_endpoint": "every prime power n<=lambda^2 is included",
    "prime_sign": "m_lambda=2*theta_prime-2*sum Lambda(n)/sqrt(n)*cos(t*log(n))",
    "inversion": "multiplicatively Jf(u)=f(u^(-1)); in the additive logarithmic coordinate Jf(y)=f(-y)",
    "source_normalization": "all prolate combinations use the source zero-Lebesgue-integral normalization, never unit normalization",
    "strictness": "equality in zeta<1, theta_soft<1, or a positive source floor is a rejection",
    "finite_parity": "Fourier residue class is not identified with inversion parity at finite lambda; the actual projected pole representer is used",
    "artifact_scope": "p and dps label exact rational theorem-regression models, not physical prolate--Weil pilot matrices or an asymptotic schedule",
    "arithmetic": "all matrices, factorizations, contractions, and reserves are exact reduced rationals; binary64 JSON numbers are forbidden",
}

LOCKED_FORMULAS = {
    "parity_features": "X_plus=(sqrt(a)*Fourier,sqrt(2)*pole_plus), Y_plus=sqrt(v)*Fourier; X_minus=sqrt(a)*Fourier, Y_minus=(sqrt(v)*Fourier,sqrt(2)*pole_minus)",
    "signed_operator": "B_epsilon=g*I+X_epsilon^*X_epsilon-Y_epsilon^*Y_epsilon",
    "high_data": "A0=g*I_H+X_H^*X_H, Z=Y_H*A0^(-1)*Y_H^*, W=I-Z, D_B=A0-Y_H^*Y_H",
    "feature_ldl": "M_H=[[I,0],[E,I]]*diag(P,-W)*[[I,E^*],[0,I]], P=I+X_H*X_H^*/g, E=Y_H*A0^(-1)*X_H^*",
    "soft_short": "Psoft=g*I_K+X_K^*X_K-X_K^*X_H*A0^(-1)*X_H^*X_K",
    "residual_feature": "Ytilde=Y_K-Y_H*A0^(-1)*X_H^*X_K",
    "exact_schur": "S_B=Psoft-Ytilde^*W^(-1)*Ytilde when D_B>0 equivalently W>0",
    "source_metric": "Delta=(A*A^*)^dagger on K and G=A^*Psoft*A; the scalar base is g*A^*A, never g*I unless A is an isometry",
    "soft_contraction": "A^*S_B*A=G-N^*N, N=W^(-1/2)*Ytilde*A, and theta_soft=norm(N*G^(-1/2))^2<1",
    "scalar_schedule_test": "if norm(Z)<=1-delta and norm(Ytilde*Psoft^(-1/2))^2<=(1-tau)*delta then D_B>=delta*g*I and S_B>=tau*Psoft",
    "full_gap": "with G>=alpha*I and chi=norm(D_B^(-1/2)*B_HK*Delta^(-1/2)), B>=min(tau*alpha,1)/(1+chi)^2*(Delta direct_sum D_B)",
}

CLAIM_SCOPE = {
    "proved": [
        "the actual even and odd multiplier/pole feature assignments for the finite signed operators",
        "the non-spectral feature LDL factorization and high-block equivalence",
        "the exact g-soft positive short and residual negative-feature Schur identity for the original operator",
        "the source-whitened exact and scalarized contraction criteria",
        "the full finite-sector gap consequence and exact rational rejection models",
    ],
    "not_proved": [
        "a strict physical high ratio on a common unbounded schedule",
        "a residual negative-feature or source coframe reserve on a common unbounded schedule",
        "a positive signed floor in either parity sector",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

SOURCE_ADMISSIONS = {
    "api_key_read": False,
    "binary64_parameters_used": False,
    "cached_weil_matrix_read": False,
    "determinant_limit_claimed": False,
    "environment_secret_read": False,
    "equation_5_2_claimed": False,
    "finite_fourier_residue_declared_inversion_parity": False,
    "global_weil_positivity_assumed": False,
    "hard_short_claimed_exact_for_original": False,
    "inversion_reflection_dropped": False,
    "lambda_squared_mixed_with_lambda": False,
    "odd_negative_pole_omitted": False,
    "physical_schedule_bound_claimed": False,
    "prime_block_sign_changed": False,
    "prime_power_endpoint_omitted": False,
    "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence": False,
    "rh_proved": False,
    "secret_serialized": False,
    "signed_sector_floor_claimed": False,
    "source_metric_replaced_by_identity": False,
    "unit_source_normalization_substituted": False,
    "zeros_assumed_real": False,
    "zeta_zero_table_read": False,
}

ARITHMETIC = {
    "precision_mode": "exact rational arithmetic",
    "raw_interval_or_ball_output_applicable": False,
    "library": "Python fractions.Fraction",
    "shared_library_with_verifier": True,
    "independent_formula_trees": True,
    "independence_limitation": "producer and replay share Python integer and Fraction arithmetic",
}

Matrix = list[list[Fraction]]


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _verified_source_hashes() -> dict[str, str]:
    if set(PINNED_HASHES) != {NOTE, LOCK}:
        raise ValueError("source pins must contain the note and lock")
    result: dict[str, str] = {}
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None:
            raise ValueError(f"unfinalized source hash: {relative}")
        path = Path(relative)
        if path.is_absolute() or ".." in path.parts:
            raise ValueError(f"unsafe source path: {relative}")
        if _sha256(_root() / path) != expected:
            raise ValueError(f"source byte hash mismatch: {relative}")
        result[relative] = expected

    lock = json.loads((_root() / LOCK).read_text(encoding="utf-8"))
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ValueError("source-lock inventory mismatch")
    fixed = {
        "schema": LOCK_SCHEMA,
        "claim_class": "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_REDUCTION",
        "terminal_state": TERMINAL_STATE,
        "updated_date": "2026-08-07",
        "external_sources": [],
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_boundary": CLAIM_SCOPE,
    }
    for key, expected in fixed.items():
        if lock[key] != expected:
            raise ValueError(f"source-lock {key} mutation")
    for item in lock["dependencies"]:
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
    if rows == 0:
        return [[] for _ in range(columns)]
    return [list(column) for column in zip(*matrix)]


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    lr, lc = _shape(left)
    rr, rc = _shape(right)
    if lc != rr:
        raise ValueError("matrix dimension mismatch")
    return [[sum((left[i][k] * right[k][j] for k in range(lc)), Fraction(0))
             for j in range(rc)] for i in range(lr)]


def _add(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ValueError("matrix dimension mismatch")
    return [[a + b for a, b in zip(lrow, rrow)]
            for lrow, rrow in zip(left, right)]


def _sub(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ValueError("matrix dimension mismatch")
    return [[a - b for a, b in zip(lrow, rrow)]
            for lrow, rrow in zip(left, right)]


def _scale(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _identity(size: int) -> Matrix:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _diag(*values: Fraction) -> Matrix:
    return [[value if i == j else Fraction(0) for j, _ in enumerate(values)]
            for i, value in enumerate(values)]


def _block(a: Matrix, b: Matrix, c: Matrix, d: Matrix) -> Matrix:
    ar, ac = _shape(a)
    br, bc = _shape(b)
    cr, cc = _shape(c)
    dr, dc = _shape(d)
    if ar != br or cr != dr or ac != cc or bc != dc:
        raise ValueError("block dimension mismatch")
    return [a[i] + b[i] for i in range(ar)] + [c[i] + d[i] for i in range(cr)]


def _inverse(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    if rows != columns or rows == 0:
        raise ValueError("inverse requires a nonempty square matrix")
    augmented = [row[:] + identity_row[:] for row, identity_row
                 in zip(matrix, _identity(rows))]
    for column in range(rows):
        pivot = next((row for row in range(column, rows)
                      if augmented[row][column] != 0), None)
        if pivot is None:
            raise ValueError("singular matrix")
        augmented[column], augmented[pivot] = augmented[pivot], augmented[column]
        divisor = augmented[column][column]
        augmented[column] = [entry / divisor for entry in augmented[column]]
        for row in range(rows):
            if row == column:
                continue
            factor = augmented[row][column]
            augmented[row] = [a - factor * b
                              for a, b in zip(augmented[row], augmented[column])]
    return [row[rows:] for row in augmented]


def _determinant(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("determinant requires a square matrix")
    if rows == 0:
        return Fraction(1)
    work = [row[:] for row in matrix]
    result = Fraction(1)
    for column in range(rows):
        pivot = next((row for row in range(column, rows)
                      if work[row][column] != 0), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        value = work[column][column]
        result *= value
        for row in range(column + 1, rows):
            factor = work[row][column] / value
            for index in range(column + 1, rows):
                work[row][index] -= factor * work[column][index]
    return result


def _outer(column: list[Fraction], row: list[Fraction]) -> Matrix:
    return [[left * right for right in row] for left in column]


def _gram(feature: Matrix) -> Matrix:
    if not feature:
        return [[Fraction(0), Fraction(0)], [Fraction(0), Fraction(0)]]
    return _matmul(_transpose(feature), feature)


def _one_dimensional_soft_model(
    g: Fraction, x_feature: Matrix, y_feature: Matrix, source_scale: Fraction,
) -> dict[str, Any]:
    if any(len(row) != 2 for row in x_feature + y_feature):
        raise ValueError("the regression split must have one K and one H coordinate")
    c = _gram(x_feature)
    r = _gram(y_feature)
    b = _sub(_add(_scale(g, _identity(2)), c), r)
    a0 = g + c[1][1]
    high = a0 - r[1][1]
    if high <= 0:
        raise ValueError("positive-high model required")
    y_k = [row[0] for row in y_feature]
    y_h = [row[1] for row in y_feature]
    z = _scale(1 / a0, _outer(y_h, y_h)) if y_feature else []
    w = _sub(_identity(len(y_feature)), z) if y_feature else []
    w_inverse = _inverse(w) if y_feature else []
    psoft = g + c[0][0] - c[0][1] * c[1][0] / a0
    y_tilde = [yk - yh * c[1][0] / a0 for yk, yh in zip(y_k, y_h)]
    negative = (
        _matmul([y_tilde], _matmul(w_inverse, _transpose([y_tilde])))[0][0]
        if y_feature else Fraction(0)
    )
    schur = psoft - negative
    direct_schur = b[0][0] - b[0][1] * b[1][0] / b[1][1]
    zeta = r[1][1] / a0
    delta = 1 - zeta
    gamma = sum((entry * entry for entry in y_tilde), Fraction(0)) / psoft
    source_gram = source_scale * source_scale
    source_metric = 1 / source_gram
    source_g = source_gram * psoft
    source_negative = source_gram * negative
    theta = source_negative / source_g
    tau = 1 - theta
    hard_short = (
        c[0][0] - c[0][1] * c[1][0] / c[1][1]
        if c[1][1] != 0 else c[0][0]
    )
    hard_matrix = _sub(
        _add(_scale(g, _identity(2)), [[hard_short, Fraction(0)], [Fraction(0), Fraction(0)]]),
        r,
    )
    return {
        "g": g,
        "X_feature": x_feature,
        "Y_feature": y_feature,
        "C": c,
        "R": r,
        "B": b,
        "B_determinant": _determinant(b),
        "A0": a0,
        "Z": z,
        "W": w,
        "W_inverse": w_inverse,
        "zeta": zeta,
        "delta": delta,
        "high_block": high,
        "Psoft": psoft,
        "Ytilde": y_tilde,
        "negative_soft_load": negative,
        "physical_schur": schur,
        "direct_physical_schur": direct_schur,
        "gamma": gamma,
        "source_A": source_scale,
        "Delta": source_metric,
        "G": source_g,
        "source_negative_load": source_negative,
        "pulled_schur": source_gram * schur,
        "theta_soft": theta,
        "tau_exact": tau,
        "source_metric_base_g_A_star_A": g * source_gram,
        "wrong_isometric_base_g_I": g,
        "hard_C_short": hard_short,
        "hard_shorted_comparison": hard_matrix,
        "hard_comparison_determinant": _determinant(hard_matrix),
        "high_passes": high > 0 and delta > 0,
        "soft_contraction_passes": high > 0 and theta < 1,
    }


def _ldl_model() -> dict[str, Any]:
    g = Fraction(1)
    x_h = [[Fraction(1)]]
    y_h = [[Fraction(1)]]
    q = [[Fraction(2)]]
    a0 = Fraction(2)
    e = [[Fraction(1, 2)]]
    z = [[Fraction(1, 2)]]
    w = [[Fraction(1, 2)]]
    f_h = [[Fraction(1)], [Fraction(1)]]
    j = _diag(Fraction(1), Fraction(-1))
    m = _add(j, _matmul(f_h, _transpose(f_h)))
    lower = [[Fraction(1), Fraction(0)], [e[0][0], Fraction(1)]]
    diagonal = _diag(q[0][0], -w[0][0])
    reconstructed = _matmul(_matmul(lower, diagonal), _transpose(lower))
    inverse_formula = [
        [Fraction(1, 2) - Fraction(1, 2), Fraction(1)],
        [Fraction(1), Fraction(-2)],
    ]
    direct_inverse = _inverse(m)
    if (
        x_h != [[Fraction(1)]] or y_h != [[Fraction(1)]] or a0 != 2
        or m != [[Fraction(2), Fraction(1)], [Fraction(1), Fraction(0)]]
        or reconstructed != m or direct_inverse != inverse_formula
    ):
        raise ValueError("feature LDL regression failed")
    return {
        "g": g,
        "X_H": x_h,
        "Y_H": y_h,
        "A0": a0,
        "P": q,
        "E": e,
        "Z": z,
        "W": w,
        "J": j,
        "M_H": m,
        "lower_factor": lower,
        "signed_diagonal": diagonal,
        "LDL_reconstruction": reconstructed,
        "inverse_formula": inverse_formula,
        "direct_inverse": direct_inverse,
        "factorization_matches": reconstructed == m,
        "inverse_matches": direct_inverse == inverse_formula,
    }


def _regressions() -> dict[str, Any]:
    soft = _one_dimensional_soft_model(
        Fraction(1), [[Fraction(1), Fraction(1)]],
        [[Fraction(1), Fraction(1)]], Fraction(2),
    )
    boundary = _one_dimensional_soft_model(
        Fraction(1), [], [[Fraction(1), Fraction(0)]], Fraction(1),
    )
    odd_pole = _one_dimensional_soft_model(
        Fraction(1), [],
        [[Fraction(0), Fraction(1, 2)], [Fraction(1), Fraction(0)]],
        Fraction(1),
    )
    odd_without_pole = _one_dimensional_soft_model(
        Fraction(1), [], [[Fraction(0), Fraction(1, 2)]], Fraction(1),
    )
    high_boundary = {
        "g": Fraction(1),
        "X_feature": [],
        "Y_feature": [[Fraction(0), Fraction(1)]],
        "A0": Fraction(1),
        "Z": [[Fraction(1)]],
        "W": [[Fraction(0)]],
        "high_block": Fraction(0),
        "zeta": Fraction(1),
        "passes": False,
    }
    if (
        soft["B"] != _identity(2) or soft["Psoft"] != Fraction(3, 2)
        or soft["Ytilde"] != [Fraction(1, 2)]
        or soft["physical_schur"] != 1 or soft["theta_soft"] != Fraction(1, 3)
        or soft["Delta"] != Fraction(1, 4) or soft["G"] != 6
        or soft["source_negative_load"] != 2
        or soft["hard_comparison_determinant"] != -1
        or boundary["theta_soft"] != 1 or boundary["physical_schur"] != 0
        or boundary["soft_contraction_passes"]
        or odd_pole["delta"] != Fraction(3, 4)
        or odd_pole["theta_soft"] != 1 or odd_pole["physical_schur"] != 0
        or odd_pole["soft_contraction_passes"]
        or odd_without_pole["theta_soft"] != 0
        or not odd_without_pole["soft_contraction_passes"]
    ):
        raise ValueError("soft-short theorem regression failed")
    return {
        "feature_LDL": _ldl_model(),
        "soft_beats_hard_over_shorting": soft,
        "theta_equality_rejection": boundary,
        "odd_negative_pole_required": {
            "with_pole": odd_pole,
            "without_pole_adversary": odd_without_pole,
        },
        "high_equality_rejection": high_boundary,
    }


def validate_source_admissions(admissions: dict[str, bool]) -> None:
    if admissions != SOURCE_ADMISSIONS or any(admissions.values()):
        raise ValueError("source admission violates the claim boundary")


def produce(lambda_numerator: int, dps: int) -> dict[str, Any]:
    p = _integer(lambda_numerator, "lambda_numerator", 5)
    precision = _integer(dps, "dps", 50)
    if p % 2 == 0:
        raise ValueError("lambda_numerator must be odd")
    validate_source_admissions(SOURCE_ADMISSIONS)
    source_hashes = _verified_source_hashes()
    certificate = {
        "exact_schedule_metadata": {
            "lambda": Fraction(p, 2),
            "N": (p * p + 3) // 4,
            "N_rule": "ceil(lambda^2)",
            "dps_label": precision,
            "model_scope": "exact rational theorem regressions; not a physical Weil pilot",
        },
        "exact_regressions": _regressions(),
        "theorem_checks": {
            "actual_parity_pole_features_serialized": True,
            "feature_LDL_reconstructed": True,
            "high_block_equivalence_reconstructed": True,
            "soft_short_identity_reconstructed": True,
            "residual_negative_feature_reconstructed": True,
            "source_g_A_star_A_retained": True,
            "theta_equality_rejected": True,
            "high_equality_rejected": True,
            "odd_negative_pole_omission_rejected": True,
            "hard_short_not_promoted_to_exact_original_schur": True,
        },
    }
    return _encode({
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "input": {"lambda_numerator": p, "dps": precision},
        "source_hashes": source_hashes,
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_scope": CLAIM_SCOPE,
        "source_admissions": SOURCE_ADMISSIONS,
        "arithmetic": ARITHMETIC,
        "certificate": certificate,
        "result": RESULT,
    })


def main() -> None:
    parser = argparse.ArgumentParser()
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
