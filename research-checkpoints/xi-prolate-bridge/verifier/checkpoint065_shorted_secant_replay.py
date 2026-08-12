#!/usr/bin/env python3
"""Independent replay of the checkpoint-0.65 graph-shorted diagnostic.

No checkpoint-0.65 producer code is imported.  Source, prolate, fixed-window,
and limiting-state data are rebuilt through the independent checkpoint-0.64
replay path before the Schur/Feshbach quantities are recomputed.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import sys
from typing import Any

import mpmath as mp

import checkpoint064_reciprocal_secant_replay as base


ROOT = Path(__file__).resolve().parents[1]
SCHEMA = "xi-prolate-checkpoint065-shorted-secant-v1"
REPLAY_SCHEMA = "xi-prolate-checkpoint065-shorted-secant-replay-v1"
CHECKPOINT_VERSION = "0.65.0-shorted-secant-point"
TERMINAL_STATE = "P0_INVALIDATED"

DEPENDENCIES = (
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "notes/DIRECT_SOFT_TRACE_RECIPROCAL_RESERVE.md",
    "notes/PROLATE_SECANT_RADICAL_BLOCK_REDUCTION.md",
    "notes/TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md",
    "notes/SECANT_SHORTED_RECIPROCAL_FESHBACH.md",
    "notes/TIME_BAND_CAUCHY_DETERMINANT_RESPONSE.md",
    "notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md",
    "src/checkpoint064_reciprocal_secant.py",
    "src/prolate_state.py",
    "src/weil_matrix.py",
    "verifier/checkpoint064_reciprocal_secant_replay.py",
    "verifier/independent_replay.py",
    "verifier/residual_ridged_fixed_window_replay.py",
    "src/checkpoint065_shorted_secant.py",
    "verifier/checkpoint065_shorted_secant_replay.py",
)

PINNED_SOURCE_SHA256 = dict(base.PINNED_SOURCE_SHA256)

LOCKED_FORMULAS = {
    "regularized_block": "B+rI=[[epsilon+r,g*],[g,C+rI]] in span{omega} plus F",
    "shorted_energy": "delta_r=epsilon+r-g*(C+rI)^(-1)g",
    "graph_vector": "v_r=omega-U(C+rI)^(-1)g",
    "inverse_split": "(B+rI)^(-1)=delta_r^(-1)|v_r><v_r|+U(C+rI)^(-1)U*",
    "soft_split": "S=r*<v_r,K_T v_r>/delta_r+r*tr((C+rI)^(-1)K_F)",
    "unregularized_split": "H0=<v_0,K_T v_0>/delta_0+tr(C^(-1)K_F)",
    "shorted_minimum": "delta_0=min_{<omega,x>=1}<x,Bx>=det(B)/det(C)=1/<omega,B^(-1)omega>",
    "graph_load": "a0_F=alpha*b_F+beta*g",
    "reserve_envelope": "a^(-1)(1-sqrt((1-a)x))_+^2+x <= R <= a^(-1)(1+sqrt((1-a)x))^2+x",
}

PROVENANCE = {
    "cached_matrix_read": False,
    "cached_eigensystem_read": False,
    "zeta_zero_table_read": False,
    "global_weil_positivity_assumed": False,
    "binary64_parameter_used": False,
    "asymptotic_claim_made": False,
    "producer_source_path": "checkpoint-0.64 live source assembly, then graph-shorted Feshbach algebra",
    "producer_time_band_path": "checkpoint-0.64 direct evaluation-vector quadrature",
    "producer_limiting_state_path": "checkpoint-0.64 direct x-quadrature arithmetic sum",
}

LIMITATIONS = [
    "finite arbitrary-precision point diagnostic, not an interval or ball enclosure",
    "producer and verifier share mpmath transcendental arithmetic and linear algebra",
    "the source-normalized prolate state remains a fixed 30-mode Galerkin truncation without a tail enclosure",
    "the graph-shorted identities are exact finite-dimensional algebra but no unbounded schedule is proved",
    "no locally uniform determinant convergence is inferred",
]

TOP_LEVEL_KEYS = {
    "schema",
    "checkpoint_version",
    "terminal_state",
    "claim_class",
    "analytic_uniform_claim",
    "inputs",
    "locked_conventions",
    "locked_formulas",
    "provenance",
    "dependency_sha256",
    "runtime",
    "source_guard",
    "normalization_regression",
    "shorted_reciprocal",
    "section_sha256",
    "limitations",
}
SECTION_NAMES = ("source_guard", "normalization_regression", "shorted_reciprocal")


class ReplayError(ValueError):
    """Strict-contract or independent-reconstruction failure."""


def _sha256_bytes(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def _sha256_file(path: Path) -> str:
    return _sha256_bytes(path.read_bytes())


def _validate_pinned_source_hashes(actual: dict[str, str]) -> None:
    for name, expected in PINNED_SOURCE_SHA256.items():
        if actual.get(name) != expected:
            raise ReplayError(f"pinned source hash mismatch: {name}")


def _dependency_hashes() -> dict[str, str]:
    actual = {name: _sha256_file(ROOT / name) for name in DEPENDENCIES}
    _validate_pinned_source_hashes(actual)
    return actual


def _raw_hash(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("ascii")
    return hashlib.sha256(raw).hexdigest()


def _pairs_no_duplicates(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON key: {key}")
        result[key] = value
    return result


def _reject_number(text: str) -> None:
    raise ReplayError(f"binary64/non-integer JSON number forbidden: {text}")


def strict_json_loads(raw: bytes | str) -> dict[str, Any]:
    try:
        text = raw.decode("utf-8") if isinstance(raw, bytes) else raw
        if not isinstance(text, str):
            raise ReplayError("producer artifact must be bytes or text")
        value = json.loads(
            text,
            object_pairs_hook=_pairs_no_duplicates,
            parse_float=_reject_number,
            parse_constant=_reject_number,
        )
    except (json.JSONDecodeError, UnicodeDecodeError) as exc:
        raise ReplayError("invalid producer artifact") from exc
    if not isinstance(value, dict):
        raise ReplayError("producer artifact root must be an object")
    _reject_binary64_recursive(value)
    return value


def _reject_binary64_recursive(value: Any, path: str = "root") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value forbidden at {path}")
    if isinstance(value, str):
        try:
            numeric = mp.mpf(value)
        except (ValueError, TypeError):
            return
        if not mp.isfinite(numeric):
            raise ReplayError(f"nonfinite serialized numeric forbidden at {path}")
        return
    if isinstance(value, dict):
        for key, item in value.items():
            if key.lower() in {"pass", "passed", "certified", "replay_agrees", "asymptotic_pass"} and isinstance(item, bool):
                raise ReplayError(f"cached producer boolean forbidden at {path}.{key}")
            _reject_binary64_recursive(item, f"{path}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            _reject_binary64_recursive(item, f"{path}[{index}]")


def _numeric_string(value: Any) -> mp.mpf | None:
    if not isinstance(value, str):
        return None
    try:
        result = mp.mpf(value)
    except (ValueError, TypeError):
        return None
    return result if mp.isfinite(result) else None


def _canonical_L_text(lambda_text: str, dps: int) -> str:
    try:
        value = Fraction(lambda_text)
    except (TypeError, ValueError, ZeroDivisionError) as exc:
        raise ReplayError("lambda must be exact text") from exc
    with mp.workdps(dps):
        lam = mp.mpf(value.numerator) / value.denominator
        return mp.nstr(2 * mp.log(lam), dps)


def _validate_contract(payload: dict[str, Any]) -> None:
    _reject_binary64_recursive(payload)
    if set(payload) != TOP_LEVEL_KEYS:
        raise ReplayError("top-level field inventory mismatch")
    if payload.get("schema") != SCHEMA or payload.get("checkpoint_version") != CHECKPOINT_VERSION:
        raise ReplayError("wrong checkpoint schema/version")
    if payload.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("claim/state promotion rejected")
    if payload.get("claim_class") != "FINITE_POINT_DIAGNOSTIC":
        raise ReplayError("only the finite point diagnostic claim is allowed")
    if payload.get("analytic_uniform_claim") is not False:
        raise ReplayError("fake analytic/asymptotic claim rejected")
    if payload.get("locked_conventions") != base.LOCKED_CONVENTIONS:
        raise ReplayError("locked convention inventory mismatch")
    if payload.get("locked_formulas") != LOCKED_FORMULAS:
        raise ReplayError("locked formula inventory mismatch")
    if payload.get("provenance") != PROVENANCE:
        raise ReplayError("provenance inventory mismatch")
    if payload.get("limitations") != LIMITATIONS:
        raise ReplayError("limitation inventory mismatch")
    if payload.get("dependency_sha256") != _dependency_hashes():
        raise ReplayError("dependency hash mismatch")
    if payload.get("runtime") != {"python": sys.version.split()[0], "mpmath": mp.__version__}:
        raise ReplayError("runtime metadata mismatch")

    inputs = payload.get("inputs")
    if not isinstance(inputs, dict) or set(inputs) != {"lambda", "N", "T", "precision_decimal_digits", "L"}:
        raise ReplayError("input inventory mismatch")
    try:
        lam = Fraction(inputs["lambda"])
        time = Fraction(inputs["T"])
    except (TypeError, ValueError, ZeroDivisionError) as exc:
        raise ReplayError("lambda and T must be exact text") from exc
    if not isinstance(inputs["lambda"], str) or not isinstance(inputs["T"], str):
        raise ReplayError("lambda and T must be exact text")
    if lam != 2 or time != 1 or inputs["N"] != 4 or isinstance(inputs["N"], bool):
        raise ReplayError("checkpoint point mismatch")
    if inputs["precision_decimal_digits"] not in (40, 80) or isinstance(inputs["precision_decimal_digits"], bool):
        raise ReplayError("precision mismatch")
    L = _numeric_string(inputs["L"])
    canonical_L = _canonical_L_text(inputs["lambda"], inputs["precision_decimal_digits"])
    if L is None or L <= 0 or inputs["L"] != canonical_L:
        raise ReplayError("noncanonical logarithmic length")

    hashes = payload.get("section_sha256")
    if not isinstance(hashes, dict) or set(hashes) != set(SECTION_NAMES):
        raise ReplayError("section hash inventory mismatch")
    for name in SECTION_NAMES:
        if hashes.get(name) != _raw_hash(payload.get(name)):
            raise ReplayError(f"section hash mismatch: {name}")

    guard = payload.get("source_guard")
    if not isinstance(guard, dict) or guard.get("base_checkpoint_version") != base.CHECKPOINT_VERSION:
        raise ReplayError("base checkpoint guard mismatch")
    if guard.get("prime_power_inventory") != [2, 3, 4]:
        raise ReplayError("inclusive prime-power inventory mismatch")
    for field in ("even_gap_at_q", "odd_gap_at_q"):
        value = _numeric_string(guard.get(field))
        if value is None or value <= 0:
            raise ReplayError(f"nonpositive complementary gap rejected: {field}")
    normalization = payload.get("normalization_regression")
    if not isinstance(normalization, dict) or normalization.get("unit_normalized_replacement_allowed") is not False:
        raise ReplayError("source normalization replacement rejected")
    source_scalar = _numeric_string(normalization.get("source_limiting_Xi_transform_scalar"))
    unit_scalar = _numeric_string(normalization.get("unit_normalized_limiting_Xi_transform_scalar"))
    if source_scalar is None or unit_scalar is None or source_scalar == unit_scalar:
        raise ReplayError("normalization regression scalar mismatch")


def _vector(values: list[str]) -> mp.matrix:
    return mp.matrix([mp.mpf(value) for value in values])


def _matrix(values: list[list[str]]) -> mp.matrix:
    return mp.matrix([[mp.mpf(value) for value in row] for row in values])


def _dot(x: mp.matrix, A: mp.matrix, y: mp.matrix) -> mp.mpf:
    return (x.T * A * y)[0]


def _norm(x: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(x[i]) ** 2 for i in range(x.rows)))


def _trace(A: mp.matrix) -> mp.mpf:
    return mp.fsum(A[i, i] for i in range(min(A.rows, A.cols)))


def _solve_columns(A: mp.matrix, right: mp.matrix) -> mp.matrix:
    result = mp.matrix(A.rows, right.cols)
    for j in range(right.cols):
        result[:, j] = mp.lu_solve(A, right[:, j])
    return result


def _base_prerequisite_gates(
    live: dict[str, Any], tolerance: mp.mpf, construction_tolerance: mp.mpf
) -> dict[str, bool]:
    return {
        "base_source_hermitian": live["source_hermitian_defect"] <= construction_tolerance,
        "base_source_inversion": live["source_inversion_defect"] <= construction_tolerance,
        "base_anchor_inversion_even": live["kappa_even_defect"] <= construction_tolerance,
        "base_limiting_projection_inversion_even": live["z0_even_defect"] <= construction_tolerance,
        "base_limiting_projection_imaginary_small": live["z0_imaginary_defect"] <= construction_tolerance,
        "base_secant_orthogonalized": live["secant_orthogonality_defect"] <= construction_tolerance,
        "base_secant_normalized": live["omega_norm_defect"] <= construction_tolerance,
        "base_positive_residual": live["r"] > 0,
        "base_positive_even_gap": live["B_values"][0] > 0,
        "base_positive_odd_gap": live["odd_values"][0] > 0,
        "base_positive_secant_energy": live["epsilon"] > 0,
        "base_positive_fixed_window_capture": live["c2"] > 0,
        "base_K_positive_contraction": live["K_values"][0] >= -tolerance
        and live["K_values"][-1] <= 1 + tolerance,
        "base_D0_identity": abs(live["D0"] - live["D0_rhs"]) <= construction_tolerance,
        "base_residual_pythagoras": abs(live["residual_pythagoras"]) <= construction_tolerance,
    }


def _reserve_envelope_root(a: mp.mpf, x: mp.mpf) -> mp.mpf:
    if not (a > 0 and a <= 1 and x >= 0):
        raise ReplayError("invalid shorted reserve domain")
    return mp.sqrt((1 - a) * x)


def _encode(value: Any, digits: int) -> Any:
    if isinstance(value, mp.matrix):
        if value.cols == 1:
            return [mp.nstr(value[i], digits) for i in range(value.rows)]
        return [[mp.nstr(value[i, j], digits) for j in range(value.cols)] for i in range(value.rows)]
    if isinstance(value, mp.mpf):
        return mp.nstr(value, digits)
    if isinstance(value, dict):
        return {key: _encode(item, digits) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_encode(item, digits) for item in value]
    if isinstance(value, (str, int, bool)) or value is None:
        return value
    raise TypeError(f"cannot serialize {type(value).__name__}")


def _reconstruct(payload: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    inputs = payload["inputs"]
    dps = inputs["precision_decimal_digits"]
    mp.mp.dps = dps
    canonical_L = _canonical_L_text(inputs["lambda"], dps)
    base_inputs = {
        "lambda": inputs["lambda"],
        "N": inputs["N"],
        "T": inputs["T"],
        "precision_decimal_digits": dps,
        "prolate_even_legendre_basis_size": base.PROLATE_BASIS_SIZE,
        "limiting_arithmetic_sum_cutoff": base.ARITHMETIC_SUM_CUTOFF,
        "L": canonical_L,
    }
    base_sections, base_live = base._reconstruct({"inputs": base_inputs})
    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))
    base_gates = _base_prerequisite_gates(
        base_live, tolerance, construction_tolerance
    )
    if not all(base_gates.values()):
        raise ReplayError("base reconstruction prerequisite gate failed")
    source = base_sections["source_geometry"]
    normalization = base_sections["normalization"]
    secant = base_sections["secant_geometry"]

    B = base_live["B"]
    K = base_live["K"]
    rho = base_live["r"]
    epsilon = base_live["epsilon"]
    c2 = base_live["c2"]
    soft_trace = base_live["soft_trace"]
    H0 = base_live["H0"]
    crowding_reserve = base_live["crowding_reserve"]
    b = _vector(source["residual_vector_even_complement"])
    omega = _vector(secant["omega_even_complement"])
    alpha = mp.mpf(secant["alpha"])
    beta = mp.mpf(secant["beta"])

    U = base._orthogonal_complement(omega)
    g = U.T * B * omega
    C = U.T * B * U
    K_F = U.T * K * U
    C_r = C + rho * mp.eye(C.rows)
    y_r = mp.lu_solve(C_r, g)
    v_r = omega - U * y_r
    delta_r = epsilon + rho - (g.T * y_r)[0]
    tilted_capture = _dot(v_r, K, v_r)
    rank_soft = rho * tilted_capture / delta_r
    solved_K_r = _solve_columns(C_r, K_F)
    bulk_trace = _trace(solved_K_r)
    bulk_soft = rho * bulk_trace
    soft_sum = rank_soft + bulk_soft

    a = delta_r / (epsilon + rho)
    x = (epsilon + rho) * bulk_trace / c2
    normalized_rank = (epsilon + rho) * tilted_capture / (c2 * delta_r)
    envelope_root = _reserve_envelope_root(a, x)
    envelope_lower = max(mp.mpf("0"), 1 - envelope_root) ** 2 / a + x
    envelope_upper = (1 + envelope_root) ** 2 / a + x

    y0 = mp.lu_solve(C, g)
    v0 = omega - U * y0
    delta0 = epsilon - (g.T * y0)[0]
    rank_H0 = _dot(v0, K, v0) / delta0
    solved_K_0 = _solve_columns(C, K_F)
    bulk_H0 = _trace(solved_K_0)
    H0_sum = rank_H0 + bulk_H0
    B_inverse_omega = mp.lu_solve(B, omega)
    determinant_ratio = mp.det(B) / mp.det(C)
    inverse_rayleigh = 1 / (omega.T * B_inverse_omega)[0]

    N = inputs["N"]
    even, _odd = base._sector_bases(N)
    kappa = _vector(normalization["kappa_modes_minusN_to_N"])
    complement = base._orthogonal_complement(even.T * kappa)
    Q = _matrix(source["Q_equals_pole_minus_archimedean_minus_prime"])
    q = mp.mpf(source["q"])
    z0 = _vector(secant["z0_limiting_projection_modes_minusN_to_N"])
    direct_load = U.T * complement.T * even.T * (Q - q * mp.eye(2 * N + 1)) * z0
    b_F = U.T * b
    reconstructed_load = alpha * b_F + beta * g
    graph_mismatch = direct_load - reconstructed_load

    source_guard = {
        "base_checkpoint_version": base.CHECKPOINT_VERSION,
        "prime_power_inventory": [item["n"] for item in base_sections["source_inventory"]["prime_powers"]],
        "source_hermitian_defect": base_live["source_hermitian_defect"],
        "source_inversion_commutator_defect": base_live["source_inversion_defect"],
        "even_gap_at_q": base_live["B_values"][0],
        "odd_gap_at_q": base_live["odd_values"][0],
    }
    normalization_regression = {
        "source_limiting_Xi_transform_scalar": mp.mpf(1) / 4,
        "unit_normalized_limiting_Xi_transform_scalar": mp.power(2, mp.mpf(17) / 4) / (4 * mp.sqrt(33)),
        "unit_normalization_limiting_scalar_difference": (mp.power(2, mp.mpf(17) / 4) / mp.sqrt(33) - 1) / 4,
        "unit_normalized_replacement_allowed": False,
    }
    shorted = {
        "regularized": {
            "g_F": g,
            "g_norm": _norm(g),
            "C_F": C,
            "K_F": K_F,
            "delta_r": delta_r,
            "delta_over_epsilon_plus_r": a,
            "schur_fraction": 1 - a,
            "y_r": y_r,
            "v_r": v_r,
            "v_minus_omega_norm": _norm(v_r - omega),
            "v_norm": _norm(v_r),
            "tilted_capture": tilted_capture,
            "rank_one_soft_contribution": rank_soft,
            "deflated_bulk_soft_contribution": bulk_soft,
            "soft_sum": soft_sum,
            "soft_trace_identity_residual": soft_sum - soft_trace,
            "normalized_rank_one_reserve": normalized_rank,
            "normalized_deflated_bulk_reserve": x,
            "reserve_sum": normalized_rank + x,
            "reserve_identity_residual": normalized_rank + x - crowding_reserve,
            "reserve_envelope_lower": envelope_lower,
            "reserve_envelope_upper": envelope_upper,
        },
        "unregularized": {
            "delta_0": delta0,
            "det_B_over_det_C": determinant_ratio,
            "inverse_omega_B_inverse_omega": inverse_rayleigh,
            "determinant_identity_residual": delta0 - determinant_ratio,
            "inverse_rayleigh_identity_residual": delta0 - inverse_rayleigh,
            "v_0": v0,
            "Bv_minus_delta_omega_norm": _norm(B * v0 - delta0 * omega),
            "v0_energy_minus_delta": _dot(v0, B, v0) - delta0,
            "rank_one_H0_contribution": rank_H0,
            "deflated_bulk_H0_contribution": bulk_H0,
            "H0_sum": H0_sum,
            "H0_identity_residual": H0_sum - H0,
            "delta0_over_minimum_B_eigenvalue": delta0 / base_live["B_values"][0],
        },
        "graph_load": {
            "a0_F_direct": direct_load,
            "b_F": b_F,
            "alpha_bF_plus_beta_g": reconstructed_load,
            "identity_residual": graph_mismatch,
            "identity_residual_norm": _norm(graph_mismatch),
        },
    }
    sections = {
        "source_guard": _encode(source_guard, dps),
        "normalization_regression": _encode(normalization_regression, dps),
        "shorted_reciprocal": _encode(shorted, dps),
    }
    live = {
        "base_prerequisite_gates": base_gates,
        "a": a,
        "x": x,
        "delta_r": delta_r,
        "delta0": delta0,
        "soft_identity": soft_sum - soft_trace,
        "reserve_identity": normalized_rank + x - crowding_reserve,
        "H0_identity": H0_sum - H0,
        "graph_identity": _norm(graph_mismatch),
        "det_identity": delta0 - determinant_ratio,
        "inverse_identity": delta0 - inverse_rayleigh,
        "envelope_lower": envelope_lower,
        "envelope_upper": envelope_upper,
        "reserve": normalized_rank + x,
        "bulk_soft": bulk_soft,
        "tilted_capture": tilted_capture,
    }
    return sections, live


def _compare_recursive(actual: Any, expected: Any, path: str, defects: dict[str, mp.mpf]) -> None:
    if isinstance(expected, dict):
        if not isinstance(actual, dict) or set(actual) != set(expected):
            raise ReplayError(f"field inventory mismatch at {path}")
        for key in expected:
            _compare_recursive(actual[key], expected[key], f"{path}.{key}", defects)
        return
    if isinstance(expected, list):
        if not isinstance(actual, list) or len(actual) != len(expected):
            raise ReplayError(f"list inventory mismatch at {path}")
        for index, (left, right) in enumerate(zip(actual, expected)):
            _compare_recursive(left, right, f"{path}[{index}]", defects)
        return
    expected_number = _numeric_string(expected)
    actual_number = _numeric_string(actual)
    if expected_number is not None or actual_number is not None:
        if expected_number is None or actual_number is None:
            raise ReplayError(f"numeric serialization mismatch at {path}")
        defects[path] = abs(actual_number - expected_number) / max(mp.mpf(1), abs(actual_number), abs(expected_number))
        return
    if actual != expected:
        raise ReplayError(f"exact value mismatch at {path}")


def replay_payload(payload: dict[str, Any], producer_sha256: str = "in_memory") -> dict[str, Any]:
    _validate_contract(payload)
    dps = payload["inputs"]["precision_decimal_digits"]
    mp.mp.dps = dps
    expected, live = _reconstruct(payload)
    defects: dict[str, mp.mpf] = {}
    for name in SECTION_NAMES:
        _compare_recursive(payload[name], expected[name], name, defects)
    supplied_L = mp.mpf(payload["inputs"]["L"])
    actual_L = mp.mpf(_canonical_L_text(payload["inputs"]["lambda"], dps))
    defects["inputs.L"] = abs(supplied_L - actual_L) / max(1, abs(supplied_L), abs(actual_L))

    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))
    gates = {
        **live["base_prerequisite_gates"],
        "L_reconstructed": defects["inputs.L"] <= tolerance,
        "shorted_reserve_domain": live["a"] > 0 and live["a"] <= 1 and live["x"] >= 0,
        "positive_regularized_shorted_energy": live["delta_r"] > 0,
        "positive_unregularized_shorted_energy": live["delta0"] > 0,
        "positive_tilted_capture": live["tilted_capture"] > 0,
        "nonnegative_deflated_bulk": live["bulk_soft"] >= -tolerance,
        "regularized_Feshbach_identity": abs(live["soft_identity"]) <= construction_tolerance,
        "reserve_split_identity": abs(live["reserve_identity"]) <= construction_tolerance,
        "unregularized_Feshbach_identity": abs(live["H0_identity"]) <= construction_tolerance,
        "graph_load_identity": live["graph_identity"] <= construction_tolerance,
        "determinant_shorted_identity": abs(live["det_identity"]) <= construction_tolerance,
        "inverse_Rayleigh_shorted_identity": abs(live["inverse_identity"]) <= construction_tolerance,
        "reserve_envelope": live["envelope_lower"] - tolerance <= live["reserve"] <= live["envelope_upper"] + tolerance,
    }
    max_defect = max(defects.values(), default=mp.mpf("0"))
    agrees = max_defect <= tolerance and all(gates.values())
    result = {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "claim_class": "FINITE_POINT_DIAGNOSTIC_REPLAY",
        "analytic_uniform_claim": False,
        "producer_sha256": producer_sha256,
        "replay_agrees": agrees,
        "tolerance": mp.nstr(tolerance, dps),
        "max_scaled_defect": mp.nstr(max_defect, dps),
        "scaled_defects": {name: mp.nstr(value, dps) for name, value in sorted(defects.items())},
        "independent_gates": gates,
        "independent_paths": {
            "source_matrix": "verifier/independent_replay source formulas",
            "prolate_state": "differential-form quadrature Galerkin path",
            "time_band": "closed Si/Ci antiderivatives",
            "limiting_projection": "sum-integral exchange with incomplete-gamma segments",
            "shorted_algebra": "fresh Schur solves; no checkpoint-0.65 producer import",
        },
        "shared_library_limitation": "producer and verifier both use mpmath transcendental arithmetic and linear algebra",
        "producer_values_used_only_for_comparison": True,
    }
    if not agrees:
        raise ReplayError("independent replay disagreement or reconstructed gate failure")
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("producer", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    raw = arguments.producer.read_bytes()
    payload = strict_json_loads(raw)
    result = replay_payload(payload, _sha256_bytes(raw))
    text = json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n"
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(text, encoding="utf-8")
    print(text, end="")


if __name__ == "__main__":
    main()
