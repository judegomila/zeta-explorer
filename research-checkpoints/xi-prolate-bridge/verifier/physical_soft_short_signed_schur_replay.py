#!/usr/bin/env python3
"""Clean-room replay for the physical g-soft signed Schur checkpoint.

The verifier does not import the producer.  It rebuilds every rational model
from its feature rows and binds the report to the exact producer bytes.
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
REPLAY_SCHEMA = "xi-prolate-physical-soft-short-signed-schur-replay-v1"
STATUS = "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_COMPONENT"
PRODUCER_RESULT = "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_COMPONENT_PASS"
REPLAY_RESULT = "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_COMPONENT_REPLAY_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md"
LOCK = "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-physical-soft-short-signed-schur-source-lock-v1"

PINNED_HASHES = {
    NOTE: "cf847b2f73d18244158ee0238714f677c74358068a658c637a40477b3e0a38ca",
    LOCK: "394674ae851c1973d6bcfa1f3d3104b5c85a6c572a2abb846cec53852b73cbd2",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_INTEGER_TEXT = re.compile(r"0|-?[1-9][0-9]*")

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


class ReplayError(ValueError):
    """Raised when source bytes or a rebuilt identity fail."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _reject_number(token: str) -> None:
    raise ReplayError(f"binary64 or non-integer JSON number rejected: {token}")


def _unique_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _strict_json_loads(raw: bytes | str, label: str) -> Any:
    try:
        text = raw.decode("utf-8") if isinstance(raw, bytes) else raw
    except UnicodeDecodeError as exc:
        raise ReplayError(f"{label} is not UTF-8") from exc
    try:
        value = json.loads(
            text,
            parse_float=_reject_number,
            parse_constant=_reject_number,
            object_pairs_hook=_unique_object,
        )
    except (json.JSONDecodeError, TypeError) as exc:
        raise ReplayError(f"invalid {label}") from exc
    _validate_json(value)
    return value


def _validate_json(value: Any, path: str = "payload") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path}")
    if value is None or isinstance(value, (str, bool, int)):
        return
    if isinstance(value, list):
        for index, item in enumerate(value):
            _validate_json(item, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, item in value.items():
            if not isinstance(key, str):
                raise ReplayError(f"non-string key at {path}")
            _validate_json(item, f"{path}.{key}")
        return
    raise ReplayError(f"unsupported JSON value at {path}")


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


def _fraction(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"{label} is not a rational record")
    numerator, denominator = value["numerator"], value["denominator"]
    if (
        not isinstance(numerator, str) or _INTEGER_TEXT.fullmatch(numerator) is None
        or not isinstance(denominator, str) or _INTEGER_TEXT.fullmatch(denominator) is None
    ):
        raise ReplayError(f"{label} has noncanonical integer text")
    den = int(denominator)
    if den <= 0:
        raise ReplayError(f"{label} denominator must be positive")
    result = Fraction(int(numerator), den)
    if str(result.numerator) != numerator or str(result.denominator) != denominator:
        raise ReplayError(f"{label} is not reduced canonical rational text")
    return result


def _parse_all_rationals(value: Any, path: str = "payload") -> None:
    if isinstance(value, dict):
        if set(value) == {"numerator", "denominator"}:
            _fraction(value, path)
            return
        for key, item in value.items():
            _parse_all_rationals(item, f"{path}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            _parse_all_rationals(item, f"{path}[{index}]")


def _same(actual: Any, expected: Any, label: str) -> None:
    if type(actual) is not type(expected) or actual != expected:
        raise ReplayError(f"{label} mismatch")


def _source_hashes() -> dict[str, str]:
    if set(PINNED_HASHES) != {NOTE, LOCK}:
        raise ReplayError("source pins must contain the note and lock")
    result: dict[str, str] = {}
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None:
            raise ReplayError(f"unfinalized source hash: {relative}")
        if _digest(_root() / relative) != expected:
            raise ReplayError(f"source byte hash mismatch: {relative}")
        result[relative] = expected
    lock = _strict_json_loads((_root() / LOCK).read_bytes(), "source lock")
    top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != top:
        raise ReplayError("source-lock inventory mismatch")
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
        _same(lock[key], expected, f"source-lock {key}")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ReplayError("source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        path = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str) or not relative or path.is_absolute()
            or ".." in path.parts or relative in result
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ReplayError("invalid source-lock dependency")
        if _digest(_root() / relative) != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _transpose(matrix: Matrix) -> Matrix:
    if not matrix:
        return []
    width = len(matrix[0])
    if any(len(row) != width for row in matrix):
        raise ReplayError("ragged matrix")
    return [[matrix[i][j] for i in range(len(matrix))] for j in range(width)]


def _product(left: Matrix, right: Matrix) -> Matrix:
    if not left or not right:
        raise ReplayError("empty product not admitted")
    if len(left[0]) != len(right):
        raise ReplayError("matrix product dimension mismatch")
    return [[sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction(0))
             for j in range(len(right[0]))] for i in range(len(left))]


def _inverse(matrix: Matrix) -> Matrix:
    size = len(matrix)
    if size == 0 or any(len(row) != size for row in matrix):
        raise ReplayError("invalid inverse shape")
    work = [row[:] + [Fraction(i == j) for j in range(size)]
            for i, row in enumerate(matrix)]
    for col in range(size):
        pivot = next((i for i in range(col, size) if work[i][col]), None)
        if pivot is None:
            raise ReplayError("singular replay matrix")
        work[col], work[pivot] = work[pivot], work[col]
        scale = work[col][col]
        work[col] = [entry / scale for entry in work[col]]
        for i in range(size):
            if i == col:
                continue
            scale = work[i][col]
            work[i] = [entry - scale * base
                       for entry, base in zip(work[i], work[col])]
    return [row[size:] for row in work]


def _det2(matrix: Matrix) -> Fraction:
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def _case(g: Fraction, x_rows: Matrix, y_rows: Matrix, scale: Fraction) -> dict[str, Any]:
    def gram_entry(rows: Matrix, i: int, j: int) -> Fraction:
        return sum((row[i] * row[j] for row in rows), Fraction(0))

    c00, c01, c11 = gram_entry(x_rows, 0, 0), gram_entry(x_rows, 0, 1), gram_entry(x_rows, 1, 1)
    r00, r01, r11 = gram_entry(y_rows, 0, 0), gram_entry(y_rows, 0, 1), gram_entry(y_rows, 1, 1)
    c = [[c00, c01], [c01, c11]]
    r = [[r00, r01], [r01, r11]]
    b = [[g + c00 - r00, c01 - r01], [c01 - r01, g + c11 - r11]]
    a0 = g + c11
    high = b[1][1]
    if high <= 0:
        raise ReplayError("replay case high block is not positive")
    yh = [row[1] for row in y_rows]
    yk = [row[0] for row in y_rows]
    z = [[yh[i] * yh[j] / a0 for j in range(len(yh))] for i in range(len(yh))]
    w = [[Fraction(i == j) - z[i][j] for j in range(len(yh))]
         for i in range(len(yh))]
    winv = _inverse(w) if w else []
    psoft = g + c00 - c01 * c01 / a0
    yt = [yk[i] - yh[i] * c01 / a0 for i in range(len(yh))]
    load = (
        sum((yt[i] * winv[i][j] * yt[j]
             for i in range(len(yt)) for j in range(len(yt))), Fraction(0))
        if yt else Fraction(0)
    )
    schur = psoft - load
    direct = b[0][0] - b[0][1] * b[1][0] / b[1][1]
    zeta = r11 / a0
    delta = 1 - zeta
    gamma = sum((entry * entry for entry in yt), Fraction(0)) / psoft
    source_gram = scale * scale
    g_source = source_gram * psoft
    n_source = source_gram * load
    theta = n_source / g_source
    hard = c00 - c01 * c01 / c11 if c11 else c00
    hard_matrix = [[g + hard - r00, -r01], [-r01, g - r11]]
    return {
        "g": g,
        "X_feature": x_rows,
        "Y_feature": y_rows,
        "C": c,
        "R": r,
        "B": b,
        "B_determinant": _det2(b),
        "A0": a0,
        "Z": z,
        "W": w,
        "W_inverse": winv,
        "zeta": zeta,
        "delta": delta,
        "high_block": high,
        "Psoft": psoft,
        "Ytilde": yt,
        "negative_soft_load": load,
        "physical_schur": schur,
        "direct_physical_schur": direct,
        "gamma": gamma,
        "source_A": scale,
        "Delta": 1 / source_gram,
        "G": g_source,
        "source_negative_load": n_source,
        "pulled_schur": source_gram * schur,
        "theta_soft": theta,
        "tau_exact": 1 - theta,
        "source_metric_base_g_A_star_A": g * source_gram,
        "wrong_isometric_base_g_I": g,
        "hard_C_short": hard,
        "hard_shorted_comparison": hard_matrix,
        "hard_comparison_determinant": _det2(hard_matrix),
        "high_passes": high > 0 and delta > 0,
        "soft_contraction_passes": high > 0 and theta < 1,
    }


def _models() -> dict[str, Any]:
    soft = _case(Fraction(1), [[Fraction(1), Fraction(1)]],
                 [[Fraction(1), Fraction(1)]], Fraction(2))
    boundary = _case(Fraction(1), [], [[Fraction(1), Fraction(0)]], Fraction(1))
    with_pole = _case(
        Fraction(1), [],
        [[Fraction(0), Fraction(1, 2)], [Fraction(1), Fraction(0)]],
        Fraction(1),
    )
    without_pole = _case(
        Fraction(1), [], [[Fraction(0), Fraction(1, 2)]], Fraction(1),
    )
    q = [[Fraction(2)]]
    e = [[Fraction(1, 2)]]
    w = [[Fraction(1, 2)]]
    lower = [[Fraction(1), Fraction(0)], [Fraction(1, 2), Fraction(1)]]
    signed = [[Fraction(2), Fraction(0)], [Fraction(0), Fraction(-1, 2)]]
    reconstructed = _product(_product(lower, signed), _transpose(lower))
    m = [[Fraction(2), Fraction(1)], [Fraction(1), Fraction(0)]]
    inverse = _inverse(m)
    ldl = {
        "g": Fraction(1),
        "X_H": [[Fraction(1)]],
        "Y_H": [[Fraction(1)]],
        "A0": Fraction(2),
        "P": q,
        "E": e,
        "Z": [[Fraction(1, 2)]],
        "W": w,
        "J": [[Fraction(1), Fraction(0)], [Fraction(0), Fraction(-1)]],
        "M_H": m,
        "lower_factor": lower,
        "signed_diagonal": signed,
        "LDL_reconstruction": reconstructed,
        "inverse_formula": [[Fraction(0), Fraction(1)], [Fraction(1), Fraction(-2)]],
        "direct_inverse": inverse,
        "factorization_matches": reconstructed == m,
        "inverse_matches": inverse == [[Fraction(0), Fraction(1)], [Fraction(1), Fraction(-2)]],
    }
    return {
        "feature_LDL": ldl,
        "soft_beats_hard_over_shorting": soft,
        "theta_equality_rejection": boundary,
        "odd_negative_pole_required": {
            "with_pole": with_pole,
            "without_pole_adversary": without_pole,
        },
        "high_equality_rejection": {
            "g": Fraction(1),
            "X_feature": [],
            "Y_feature": [[Fraction(0), Fraction(1)]],
            "A0": Fraction(1),
            "Z": [[Fraction(1)]],
            "W": [[Fraction(0)]],
            "high_block": Fraction(0),
            "zeta": Fraction(1),
            "passes": False,
        },
    }


def replay(payload: dict[str, Any], *, producer_bytes: bytes | None = None) -> dict[str, Any]:
    if producer_bytes is None:
        raise ReplayError("exact producer artifact bytes are required")
    parsed = _strict_json_loads(producer_bytes, "producer artifact")
    _same(payload, parsed, "payload versus producer bytes")
    if not isinstance(payload, dict):
        raise ReplayError("producer payload must be an object")
    expected_top = {
        "schema", "status", "terminal_state", "input", "source_hashes",
        "locked_conventions", "locked_formulas", "claim_scope",
        "source_admissions", "arithmetic", "certificate", "result",
    }
    if set(payload) != expected_top:
        raise ReplayError("producer top-level inventory mismatch")
    _parse_all_rationals(payload)
    _same(payload["schema"], SCHEMA, "schema")
    _same(payload["status"], STATUS, "status")
    _same(payload["terminal_state"], TERMINAL_STATE, "terminal state")
    _same(payload["result"], PRODUCER_RESULT, "producer result")
    _same(payload["locked_conventions"], LOCKED_CONVENTIONS, "locked conventions")
    _same(payload["locked_formulas"], LOCKED_FORMULAS, "locked formulas")
    _same(payload["claim_scope"], CLAIM_SCOPE, "claim scope")
    _same(payload["source_admissions"], SOURCE_ADMISSIONS, "source admissions")
    if any(payload["source_admissions"].values()):
        raise ReplayError("source admission violates claim boundary")
    _same(payload["arithmetic"], ARITHMETIC, "arithmetic declaration")
    hashes = _source_hashes()
    _same(payload["source_hashes"], hashes, "source hashes")

    inputs = payload["input"]
    if not isinstance(inputs, dict) or set(inputs) != {"lambda_numerator", "dps"}:
        raise ReplayError("input inventory mismatch")
    p, dps = inputs["lambda_numerator"], inputs["dps"]
    if isinstance(p, bool) or not isinstance(p, int) or p < 5 or p % 2 == 0:
        raise ReplayError("invalid exact lambda numerator")
    if isinstance(dps, bool) or not isinstance(dps, int) or dps < 50:
        raise ReplayError("invalid dps label")

    certificate = payload["certificate"]
    if not isinstance(certificate, dict) or set(certificate) != {
        "exact_schedule_metadata", "exact_regressions", "theorem_checks",
    }:
        raise ReplayError("certificate inventory mismatch")
    expected_schedule = _encode({
        "lambda": Fraction(p, 2),
        "N": (p * p + 3) // 4,
        "N_rule": "ceil(lambda^2)",
        "dps_label": dps,
        "model_scope": "exact rational theorem regressions; not a physical Weil pilot",
    })
    _same(certificate["exact_schedule_metadata"], expected_schedule, "schedule metadata")
    rebuilt = _encode(_models())
    _same(certificate["exact_regressions"], rebuilt, "independently rebuilt regressions")
    expected_checks = {
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
    }
    _same(certificate["theorem_checks"], expected_checks, "theorem checks")

    models = _models()
    soft = models["soft_beats_hard_over_shorting"]
    boundary = models["theta_equality_rejection"]
    pole = models["odd_negative_pole_required"]
    if (
        soft["physical_schur"] != soft["direct_physical_schur"]
        or not soft["soft_contraction_passes"]
        or soft["hard_comparison_determinant"] >= 0
        or soft["source_metric_base_g_A_star_A"] == soft["wrong_isometric_base_g_I"]
        or boundary["theta_soft"] != 1 or boundary["soft_contraction_passes"]
        or pole["with_pole"]["soft_contraction_passes"]
        or not pole["without_pole_adversary"]["soft_contraction_passes"]
        or models["high_equality_rejection"]["passes"]
    ):
        raise ReplayError("strict theorem boundary regression failed")

    return {
        "schema": REPLAY_SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "input": inputs,
        "source_hashes": hashes,
        "producer_binding": {
            "sha256": hashlib.sha256(producer_bytes).hexdigest(),
            "bytes": len(producer_bytes),
        },
        "checks": {
            "feature_LDL_rebuilt_by_direct_multiplication": True,
            "soft_schur_rebuilt_from_physical_blocks": True,
            "soft_schur_rebuilt_from_residual_feature": True,
            "source_metric_rebuilt_with_nonisometric_A": True,
            "theta_equality_rejected": True,
            "high_equality_rejected": True,
            "odd_negative_pole_omission_rejected": True,
            "hard_over_shorting_separation_rebuilt": True,
        },
        "producer_pass_boolean_trusted": False,
        "arithmetic": ARITHMETIC,
        "result": REPLAY_RESULT,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--artifact", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    raw = Path(args.artifact).read_bytes()
    payload = _strict_json_loads(raw, "producer artifact")
    report = replay(payload, producer_bytes=raw)
    Path(args.output).write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8",
    )


if __name__ == "__main__":
    main()
