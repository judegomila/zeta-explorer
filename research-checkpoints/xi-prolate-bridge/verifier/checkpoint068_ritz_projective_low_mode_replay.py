#!/usr/bin/env python3
"""Independent replay of checkpoint 0.68 Ritz projective low-mode gate.

The checkpoint-0.68 producer is deliberately not imported.  This verifier
rebuilds the finite source matrix and source-normalized prolate anchor through
the checkpoint-0.64 independent distributional/differential-prolate path,
then reconstructs the Ritz graph, the full ambient Fourier cutoff, both
parity homotopies, and every determinant factor from source parameters.
Producer matrices, eigensystems, booleans, and numeric strings are comparison
data only.
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
SCHEMA = "xi-prolate-checkpoint068-ritz-projective-low-mode-v1"
REPLAY_SCHEMA = "xi-prolate-checkpoint068-ritz-projective-low-mode-replay-v1"
CHECKPOINT_VERSION = "0.68.0-ritz-projective-low-mode-point"
TERMINAL_STATE = "P0_INVALIDATED"
LOCKED_M = 2
LOCKED_THETA_TEXT = "1"
BASE_T_TEXT = "1"

DEPENDENCIES = (
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "DIRECT_RH_ATTACK.md",
    "FALSE_SHORTCUTS.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "notes/RITZ_PROJECTIVE_LOW_MODE_DETERMINANT_GATE.md",
    "notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md",
    "notes/PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md",
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md",
    "notes/DETERMINANT_LIMIT_AUDIT.md",
    "src/checkpoint064_reciprocal_secant.py",
    "src/checkpoint068_ritz_projective_low_mode.py",
    "src/prolate_state.py",
    "src/weil_matrix.py",
    "verifier/checkpoint064_reciprocal_secant_replay.py",
    "verifier/checkpoint068_ritz_projective_low_mode_replay.py",
    "verifier/independent_replay.py",
    "verifier/residual_ridged_fixed_window_replay.py",
    "tests/test_checkpoint064_reciprocal_secant.py",
    "tests/test_checkpoint068_ritz_projective_low_mode.py",
    "tests/test_ritz_projective_low_mode_determinant_gate.py",
)

PINNED_SOURCE_SHA256 = dict(base.PINNED_SOURCE_SHA256)

LOCKED_CONVENTIONS = dict(base.LOCKED_CONVENTIONS)
LOCKED_CONVENTIONS.update(
    {
        "checkpoint068_source_point": "lambda=2, N=4, M=2, theta=1 only; 40 or 80 decimal digits",
        "low_mode_cutoff": "full ambient centered projector onto every raw mode |n|<=M, with both parity sectors retained",
        "compact_diagnostic": "B=1 and eta=1/4; finite compact-error terms only",
        "projective_ground_scale": "s=1/gamma is paired with the source projected norm a; no unit normalization of h_lambda",
    }
)

LOCKED_FORMULAS = {
    "ambient_cutoff": "Pi_M V_n=1_(|n|<=M)V_n on the full raw mode space; K_M=W^T Pi_(M,+) W",
    "ritz_shift": "w=b/r; c_R=q+<w,B_q w>; u=(q+c_R-sqrt((c_R-q)^2+4r^2))/2; U=u; d=q-U",
    "ritz_moment": "B_U=B_q+dI; d<w,B_U w>=r^2 at the exact lower Ritz shift",
    "ground_line": "mu=lambda_min(Q_+); h=U-mu; z=(B_U+hI)^(-1)b; xi=gamma*(kappa-Wz); gamma=(1+||z||^2)^(-1/2)",
    "projective_scalar": "s=1/gamma, so s*xi-kappa=-Wz exactly",
    "A_R": "delta=d/r; A_R=1+delta+delta*(1+delta)^2/2 for delta<=1, else 1+delta+2delta^2",
    "C_R_squared": "alpha=(r/d)^2; C_R^2 is equation (3.2) of RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md",
    "low_observation": "||Pi_M(s*xi-kappa)||^2=<z,K_M z>",
    "positive_response": "H=r*tr((B_U+rI)^(-1)K_M); F=log det(B_U+rI+theta*r*K_M)-log det(B_U+rI)",
    "response_bounds": "F/theta<=H<=F/log(1+theta); <z,K_M z><=A_R*H<=A_R*F/log(1+theta)",
    "source_homotopy": "Q_t=Q+t*Pi_M at zeta=U-r; t in {0,theta*r}; full even, odd, anchor, and cross terms retained",
    "source_factorization": "det(O_t)=det(A_t)*m_t=det(D_t)*sigma_t*m_t",
    "factorized_increment": "F=log(det O_(theta*r)/det O_0)-log((sigma_(theta*r)m_(theta*r))/(sigma_0 m_0))",
    "compact_split": "the three finite terms are exactly equation (3.8) of PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md",
}

PROVENANCE = {
    "cached_matrix_read": False,
    "cached_eigensystem_read": False,
    "cached_artifact_read": False,
    "zeta_zero_table_read": False,
    "global_weil_positivity_assumed": False,
    "binary64_parameter_used": False,
    "asymptotic_claim_made": False,
    "locally_uniform_claim_made": False,
    "equation_5_2_claim_made": False,
    "rh_proof_claim_made": False,
    "producer_source_path": "checkpoint-0.64 live distributional pole--archimedean--minus-prime assembly",
    "producer_prolate_path": "checkpoint-0.64 live source-normalized Legendre recurrence",
    "producer_ritz_path": "fresh natural-parity and anchor-complement reconstruction from the complete source matrix",
    "producer_cutoff_path": "fresh full ambient centered raw-mode projector; no compressed projector is trusted",
    "producer_factorization_path": "fresh even/odd source-Cauchy determinants with anchor cross terms at both homotopy endpoints",
    "shared_arithmetic_limitation": "producer and verifier share mpmath transcendental point arithmetic",
}

LIMITATIONS = [
    "finite arbitrary-precision point diagnostic, not an interval or ball enclosure",
    "producer and verifier share mpmath transcendental arithmetic and linear algebra",
    "the source-normalized prolate state remains a fixed 30-mode Galerkin truncation without a tail enclosure",
    "the finite true-ground eigensystem is freshly reconstructed only as a diagnostic",
    "the full ambient cutoff preserves the finite source Cauchy algebra, but no unbounded source response estimate is proved",
    "the compact bridge values are three finite terms at one point and are not an asymptotic convergence test",
    "no locally uniform determinant conclusion is inferred from finite real-axis or log-determinant agreement",
    "no conclusion about DIRECT_RH_ATTACK equation (5.2), a new Lambda bound, or RH is claimed",
]

SECTION_NAMES = (
    "source_guard",
    "normalization_regression",
    "ritz_ground_geometry",
    "low_mode_observation",
    "full_source_factorization",
    "compact_bridge_diagnostic",
)

TOP_LEVEL_KEYS = {
    "schema",
    "checkpoint_version",
    "terminal_state",
    "claim_class",
    "analytic_uniform_claim",
    "equation_5_2_claim",
    "rh_proof_claim",
    "inputs",
    "locked_conventions",
    "locked_formulas",
    "provenance",
    "dependency_sha256",
    "runtime",
    *SECTION_NAMES,
    "section_sha256",
    "limitations",
}


class ReplayError(ValueError):
    """Strict-contract or independent-reconstruction failure."""


def _sha256_bytes(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def _sha256_file(path: Path) -> str:
    return _sha256_bytes(path.read_bytes())


def _dependency_hashes() -> dict[str, str]:
    actual = {name: _sha256_file(ROOT / name) for name in DEPENDENCIES}
    for name, expected in PINNED_SOURCE_SHA256.items():
        if actual.get(name) != expected:
            raise ReplayError(f"pinned source hash mismatch: {name}")
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
            raise ReplayError(f"nonfinite numeric string at {path}")
        return
    if isinstance(value, dict):
        for key, item in value.items():
            lower = key.lower()
            if lower in {"pass", "passed", "certified", "replay_agrees"} and isinstance(item, bool):
                raise ReplayError(f"cached producer boolean forbidden at {path}.{key}")
            if lower in {
                "cached_matrix_read",
                "cached_eigensystem_read",
                "cached_artifact_read",
                "zeta_zero_table_read",
                "global_weil_positivity_assumed",
                "binary64_parameter_used",
            } and item is not False:
                raise ReplayError(f"forbidden producer premise at {path}.{key}")
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
        exact = Fraction(lambda_text)
    except (TypeError, ValueError, ZeroDivisionError) as exc:
        raise ReplayError("lambda must be exact rational text") from exc
    with mp.workdps(dps):
        lam = mp.mpf(exact.numerator) / exact.denominator
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
        raise ReplayError("only finite point diagnostics are allowed")
    for field in ("analytic_uniform_claim", "equation_5_2_claim", "rh_proof_claim"):
        if payload.get(field) is not False:
            raise ReplayError(f"forbidden claim promotion: {field}")
    if payload.get("locked_conventions") != LOCKED_CONVENTIONS:
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
    expected = {
        "lambda", "N", "M", "theta", "base_checkpoint064_T",
        "precision_decimal_digits", "L", "compact_real_bound_B",
        "compact_strip_eta",
    }
    if not isinstance(inputs, dict) or set(inputs) != expected:
        raise ReplayError("input inventory mismatch")
    try:
        lam = Fraction(inputs["lambda"])
        theta = Fraction(inputs["theta"])
        time = Fraction(inputs["base_checkpoint064_T"])
        compact_B = Fraction(inputs["compact_real_bound_B"])
        compact_eta = Fraction(inputs["compact_strip_eta"])
    except (TypeError, ValueError, ZeroDivisionError) as exc:
        raise ReplayError("all real inputs must be exact rational text") from exc
    if lam != 2 or theta != 1 or time != 1 or compact_B != 1 or compact_eta != Fraction(1, 4):
        raise ReplayError("locked exact input changed")
    if inputs["N"] != 4 or inputs["M"] != LOCKED_M:
        raise ReplayError("locked N/M changed")
    if any(isinstance(inputs[name], bool) for name in ("N", "M", "precision_decimal_digits")):
        raise ReplayError("boolean integer input rejected")
    if not (1 <= inputs["M"] < inputs["N"]):
        raise ReplayError("projective cutoff requires 1<=M<N")
    dps = inputs["precision_decimal_digits"]
    if dps not in (40, 80):
        raise ReplayError("precision must be 40 or 80 digits")
    if inputs["L"] != _canonical_L_text(inputs["lambda"], dps):
        raise ReplayError("noncanonical logarithmic interval length")

    hashes = payload.get("section_sha256")
    if not isinstance(hashes, dict) or set(hashes) != set(SECTION_NAMES):
        raise ReplayError("section hash inventory mismatch")
    for name in SECTION_NAMES:
        if hashes.get(name) != _raw_hash(payload.get(name)):
            raise ReplayError(f"section hash mismatch: {name}")

    guard = payload.get("source_guard")
    if not isinstance(guard, dict):
        raise ReplayError("source guard missing")
    if guard.get("prime_power_inventory") != [2, 3, 4] or guard.get("expected_prime_power_inventory") != [2, 3, 4]:
        raise ReplayError("inclusive prime-power inventory mismatch")
    if guard.get("prime_endpoint_lambda_squared_included") is not True:
        raise ReplayError("prime endpoint lambda^2 omitted")
    if guard.get("source_prime_block_sign") != "minus":
        raise ReplayError("source prime-block sign changed")

    normalization = payload.get("normalization_regression")
    if not isinstance(normalization, dict) or normalization.get("unit_normalized_replacement_allowed") is not False:
        raise ReplayError("unit-normalized replacement not rejected")
    source_scalar = _numeric_string(normalization.get("source_limiting_Xi_transform_scalar"))
    unit_scalar = _numeric_string(normalization.get("unit_normalized_limiting_Xi_transform_scalar"))
    if source_scalar is None or unit_scalar is None or source_scalar == unit_scalar:
        raise ReplayError("normalization regression scalar mismatch")

    low = payload.get("low_mode_observation")
    if not isinstance(low, dict) or low.get("M") != LOCKED_M or _numeric_string(low.get("theta")) != 1:
        raise ReplayError("low-mode observation lock mismatch")
    factor = payload.get("full_source_factorization")
    if not isinstance(factor, dict) or factor.get("full_ambient_homotopy_required") is not True:
        raise ReplayError("full ambient homotopy is mandatory")
    if factor.get("compressed_only_homotopy_allowed") is not False:
        raise ReplayError("compressed-only homotopy rejected")
    compact = payload.get("compact_bridge_diagnostic")
    if not isinstance(compact, dict) or compact.get("finite_diagnostic_only") is not True:
        raise ReplayError("compact finite diagnostic flag missing")
    if compact.get("asymptotic_pass_claim") is not False or compact.get("locally_uniform_claim") is not False:
        raise ReplayError("compact diagnostic claim promotion rejected")


def _dot(x: mp.matrix, A: mp.matrix, y: mp.matrix) -> mp.mpf:
    return (x.T * A * y)[0]


def _norm(x: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(x[i]) ** 2 for i in range(x.rows)))


def _trace(A: mp.matrix) -> mp.mpf:
    return mp.fsum(A[i, i] for i in range(min(A.rows, A.cols)))


def _max_abs(A: mp.matrix) -> mp.mpf:
    return max((abs(A[i, j]) for i in range(A.rows) for j in range(A.cols)), default=mp.mpf(0))


def _symmetrize(A: mp.matrix) -> mp.matrix:
    return (A + A.T) / 2


def _inverse(A: mp.matrix) -> mp.matrix:
    if A.rows != A.cols:
        raise ReplayError("matrix inverse requires a square matrix")
    result = mp.matrix(A.rows)
    for column in range(A.cols):
        unit = mp.matrix(A.rows, 1)
        unit[column] = 1
        result[:, column] = mp.lu_solve(A, unit)
    return result


def _positive_logdet(A: mp.matrix) -> mp.mpf:
    values, _ = mp.eigsy(_symmetrize(A))
    if values[0] <= 0:
        raise ReplayError("positive log determinant requires A>0")
    return mp.fsum(mp.log(values[index]) for index in range(values.rows))


def _symmetric_inverse_sqrt(A: mp.matrix) -> mp.matrix:
    values, vectors = mp.eigsy(_symmetrize(A))
    if values[0] <= 0:
        raise ReplayError("positive inverse square root requires A>0")
    return vectors * mp.diag([1 / mp.sqrt(values[index]) for index in range(values.rows)]) * vectors.T


def _encode(value: Any, digits: int) -> Any:
    if isinstance(value, mp.matrix):
        if value.cols == 1:
            return [mp.nstr(value[index], digits) for index in range(value.rows)]
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


def _ritz_constants(d: mp.mpf, residual_r: mp.mpf) -> dict[str, Any]:
    if d <= 0 or residual_r <= 0:
        raise ReplayError("locked pilot requires d>0 and r>0")
    delta = d / residual_r
    alpha = (residual_r / d) ** 2
    if alpha <= mp.mpf("0.5"):
        C_squared = 1 + 2 / alpha
        C_branch = "alpha_at_most_one_half"
    else:
        root = mp.sqrt(1 + 6 * alpha)
        C_squared = 1 + 4 * (2 * root - 1) / (3 * (root - 1) ** 2)
        C_branch = "alpha_at_least_one_half"
    if delta <= 1:
        A_R = 1 + delta + delta * (1 + delta) ** 2 / 2
        A_branch = "delta_at_most_one"
    else:
        A_R = 1 + delta + 2 * delta**2
        A_branch = "delta_at_least_one"
    return {
        "delta_d_over_r": delta,
        "alpha_r_squared_over_d_squared": alpha,
        "C_R_squared": C_squared,
        "C_R": mp.sqrt(C_squared),
        "C_R_branch": C_branch,
        "A_R": A_R,
        "A_R_branch": A_branch,
        "A_cert": (1 + delta) * (1 + 2 * delta),
    }


def _factor_endpoint(
    label: str,
    t: mp.mpf,
    Q_even: mp.matrix,
    Q_odd: mp.matrix,
    Pi_even: mp.matrix,
    Pi_odd: mp.matrix,
    kappa_even: mp.matrix,
    W: mp.matrix,
    b: mp.matrix,
    B_U: mp.matrix,
    d: mp.mpf,
    residual_r: mp.mpf,
    zeta: mp.mpf,
    K_M: mp.matrix,
    eta_even: mp.matrix,
    e0_even: mp.matrix,
) -> tuple[dict[str, Any], dict[str, mp.mpf]]:
    A_t = _symmetrize(Q_even - zeta * mp.eye(Q_even.rows) + t * Pi_even)
    O_t = _symmetrize(Q_odd - zeta * mp.eye(Q_odd.rows) + t * Pi_odd)
    D_t = _symmetrize(B_U + residual_r * mp.eye(B_U.rows) + t * K_M)
    cutoff_cross = W.T * Pi_even * kappa_even
    b_t = b + t * cutoff_cross
    a_t = d + residual_r + t * _dot(kappa_even, Pi_even, kappa_even)
    sigma_t = a_t - (b_t.T * mp.lu_solve(D_t, b_t))[0]
    m_t = (eta_even.T * mp.lu_solve(A_t, e0_even))[0]
    det_A = mp.det(A_t)
    det_O = mp.det(O_t)
    det_D = mp.det(D_t)
    if min(det_A, det_O, det_D, sigma_t, m_t) <= 0:
        raise ReplayError(f"nonpositive source factor at {label}")
    direct_a = _dot(kappa_even, A_t, kappa_even)
    direct_b = W.T * A_t * kappa_even
    anchor_reconstruction = mp.matrix(A_t.rows)
    anchor_reconstruction[0, 0] = a_t
    anchor_reconstruction[0, 1:] = b_t.T
    anchor_reconstruction[1:, 0] = b_t
    anchor_reconstruction[1:, 1:] = D_t
    basis_change = mp.matrix(A_t.rows)
    basis_change[:, 0] = kappa_even
    basis_change[:, 1:] = W
    direct_anchor = basis_change.T * A_t * basis_change
    anchor_residual = det_A - det_D * sigma_t
    source_residual = det_O - det_A * m_t
    combined_residual = det_O - det_D * sigma_t * m_t
    data = {
        "label": label,
        "t": t,
        "A_t_even": A_t,
        "O_t_odd": O_t,
        "D_t_complement": D_t,
        "b_t_cross": b_t,
        "a_t_anchor": a_t,
        "direct_anchor_scalar": direct_a,
        "direct_cross_vector": direct_b,
        "anchor_scalar_residual": direct_a - a_t,
        "cross_vector_residual_norm": _norm(direct_b - b_t),
        "anchor_complement_reconstruction": anchor_reconstruction,
        "direct_anchor_basis_matrix": direct_anchor,
        "anchor_matrix_reconstruction_defect": _max_abs(direct_anchor - anchor_reconstruction),
        "sigma_t": sigma_t,
        "m_t": m_t,
        "det_A_t": det_A,
        "det_O_t": det_O,
        "det_D_t": det_D,
        "det_A_minus_det_D_sigma": anchor_residual,
        "det_O_minus_det_A_m": source_residual,
        "det_O_minus_det_D_sigma_m": combined_residual,
        "logdet_D_t": mp.log(det_D),
        "logdet_O_t": mp.log(det_O),
        "log_sigma_m": mp.log(sigma_t * m_t),
    }
    live = {
        "a_residual": direct_a - a_t,
        "b_residual": _norm(direct_b - b_t),
        "matrix_residual": _max_abs(direct_anchor - anchor_reconstruction),
        "det_anchor_residual": anchor_residual,
        "det_source_residual": source_residual,
        "combined_residual": combined_residual,
        "det_scale": max(mp.mpf(1), abs(det_A), abs(det_O), abs(det_D)),
        "positive_minimum": min(det_A, det_O, det_D, sigma_t, m_t),
        "logdet_D": mp.log(det_D),
        "logdet_O": mp.log(det_O),
        "log_sigma_m": mp.log(sigma_t * m_t),
    }
    return data, live


def _reconstruct(payload: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    inputs = payload["inputs"]
    dps = inputs["precision_decimal_digits"]
    mp.mp.dps = dps
    lambda_text = inputs["lambda"]
    N = inputs["N"]
    M = inputs["M"]
    theta_fraction = Fraction(inputs["theta"])
    theta = mp.mpf(theta_fraction.numerator) / theta_fraction.denominator
    lam_fraction = Fraction(lambda_text)
    lam = mp.mpf(lam_fraction.numerator) / lam_fraction.denominator
    L = 2 * mp.log(lam)

    # Independent checkpoint-0.64 path: distributional source assembly and
    # differential-prolate quadrature.  No checkpoint-0.68 object is read.
    pole, arch, prime, Q, prime_terms = base.matrix_from_source(lambda_text, N, dps)
    prolate_functions = base.prolate_quadrature(lambda_text, base.PROLATE_BASIS_SIZE, dps)
    h_lambda = base.H(lambda_text, prolate_functions[0], prolate_functions[1])
    kappa, _coefficients, projection_error, projected_norm, _state_norm, _checks = base.projection(h_lambda, N)

    even, odd = base._sector_bases(N)
    J = base._inversion(N)
    mode = mp.diag(list(range(-N, N + 1)))
    Q_even = _symmetrize(even.T * Q * even)
    Q_odd = _symmetrize(odd.T * Q * odd)
    kappa_even = even.T * kappa
    W = base._orthogonal_complement(kappa_even)
    q = _dot(kappa_even, Q_even, kappa_even)
    b = W.T * (Q_even * kappa_even - q * kappa_even)
    residual_r = _norm(b)
    if residual_r <= 0:
        raise ReplayError("locked checkpoint requires positive residual")
    w = b / residual_r
    B_q = _symmetrize(W.T * Q_even * W - q * mp.eye(N))
    complement_energy_q = _dot(w, B_q, w)
    c_R = q + complement_energy_q
    discriminant = mp.sqrt((c_R - q) ** 2 + 4 * residual_r**2)
    u = (q + c_R - discriminant) / 2
    d = q - u
    constants = _ritz_constants(d, residual_r)
    A_R = constants["A_R"]
    C_R_squared = constants["C_R_squared"]
    C_R = constants["C_R"]
    B_U = _symmetrize(B_q + d * mp.eye(N))
    B_values, _ = mp.eigsy(B_U)
    odd_shifted = _symmetrize(Q_odd - u * mp.eye(N))
    odd_values, _ = mp.eigsy(odd_shifted)
    ritz_moment = _dot(w, B_U, w)
    ritz_matrix = mp.matrix([[q, residual_r], [residual_r, c_R]])
    ritz_characteristic_residual = mp.det(ritz_matrix - u * mp.eye(2))
    ritz_moment_residual = residual_r**2 - d * ritz_moment

    even_values, even_vectors = mp.eigsy(Q_even)
    mu = even_values[0]
    h = u - mu
    z = mp.lu_solve(B_U + h * mp.eye(N), b)
    z_norm_squared = (z.T * z)[0]
    gamma = 1 / mp.sqrt(1 + z_norm_squared)
    projective_scalar = 1 / gamma
    coefficient_ground_even = kappa_even - W * z
    unit_ground_even = gamma * coefficient_ground_even
    fresh_ground = even_vectors[:, 0]
    if (fresh_ground.T * unit_ground_even)[0] < 0:
        fresh_ground = -fresh_ground
    ground_residual = Q_even * unit_ground_even - mu * unit_ground_even
    feshbach_residual = (B_U + h * mp.eye(N)) * z - b
    feshbach_scalar_residual = d + h - (b.T * z)[0]
    projective_identity_residual = projective_scalar * unit_ground_even - kappa_even + W * z

    Pi_raw = mp.diag([mp.mpf(1) if abs(n) <= M else mp.mpf(0) for n in range(-N, N + 1)])
    Pi_even = _symmetrize(even.T * Pi_raw * even)
    Pi_odd = _symmetrize(odd.T * Pi_raw * odd)
    K_M = _symmetrize(W.T * Pi_even * W)
    K_values, _ = mp.eigsy(K_M)
    D = _symmetrize(B_U + residual_r * mp.eye(N))
    D_plus = _symmetrize(D + theta * residual_r * K_M)
    H = residual_r * _trace(_inverse(D) * K_M)
    F = _positive_logdet(D_plus) - _positive_logdet(D)
    inverse_sqrt = _symmetric_inverse_sqrt(D)
    X = _symmetrize(residual_r * inverse_sqrt * K_M * inverse_sqrt)
    X_values, _ = mp.eigsy(X)
    low_vector_even = Pi_even * W * z
    high_vector_even = (mp.eye(N + 1) - Pi_even) * W * z
    low_squared = (low_vector_even.T * low_vector_even)[0]
    zKz = _dot(z, K_M, z)
    high_norm = _norm(high_vector_even)
    low_norm = mp.sqrt(max(mp.mpf(0), low_squared))
    pythagoras_residual = low_squared + high_norm**2 - z_norm_squared
    response_lower = F / theta
    response_upper = F / mp.log1p(theta)
    A_R_H = A_R * H
    A_R_F_bound = A_R * response_upper
    loewner = _symmetrize(A_R * residual_r * _inverse(D) - z * z.T)
    loewner_values, _ = mp.eigsy(loewner)

    eta_raw = mp.matrix([mp.mpf(1) for _ in range(2 * N + 1)])
    eta_even = even.T * eta_raw
    source_beta = mp.matrix(2 * N + 1, 1)
    for raw_index, n in enumerate(range(-N, N + 1)):
        source_beta[raw_index] = n * Q[raw_index, N] if n else mp.mpf(0)
    expected_source_commutator = source_beta * eta_raw.T - eta_raw * source_beta.T
    actual_source_commutator = mode * Q - Q * mode
    source_commutator_defect = _max_abs(
        actual_source_commutator - expected_source_commutator
    )
    e0_even = mp.matrix(N + 1, 1)
    e0_even[0] = 1
    zeta = u - residual_r
    endpoint_0, endpoint_0_live = _factor_endpoint(
        "t_zero", mp.mpf(0), Q_even, Q_odd, Pi_even, Pi_odd,
        kappa_even, W, b, B_U, d, residual_r, zeta, K_M, eta_even, e0_even,
    )
    endpoint_r, endpoint_r_live = _factor_endpoint(
        "t_theta_r", theta * residual_r, Q_even, Q_odd, Pi_even, Pi_odd,
        kappa_even, W, b, B_U, d, residual_r, zeta, K_M, eta_even, e0_even,
    )
    factorized_F = (
        endpoint_r_live["logdet_O"] - endpoint_0_live["logdet_O"]
        - endpoint_r_live["log_sigma_m"] + endpoint_0_live["log_sigma_m"]
    )
    factorization_residual = F - factorized_F
    mode_cutoff_commutator = mode * Pi_raw - Pi_raw * mode
    inversion_cutoff_commutator = J * Pi_raw - Pi_raw * J
    source_displacement_change = (
        mode * (Q + theta * residual_r * Pi_raw)
        - (Q + theta * residual_r * Pi_raw) * mode
        - (mode * Q - Q * mode)
    )

    compact_B = mp.mpf(1)
    compact_eta = mp.mpf(1) / 4
    lambda_to_eta = lam**compact_eta
    compact_radius = mp.sqrt(compact_B**2 + compact_eta**2)
    cutoff_frequency = 2 * mp.pi * (M + 1) / L
    projection_term = 4 * mp.sqrt(L) * lambda_to_eta * projection_error
    low_term = 4 * projected_norm * mp.sqrt(L) * lambda_to_eta * low_norm
    high_term = (
        8 * mp.sqrt(2) / mp.pi * projected_norm * lambda_to_eta
        * mp.sqrt(L / M) * high_norm
    )
    low_term_bound = (
        4 * projected_norm * mp.sqrt(L) * lambda_to_eta
        * mp.sqrt(max(mp.mpf(0), A_R_F_bound))
    )
    high_term_bound = (
        8 * mp.sqrt(2) / mp.pi * projected_norm * lambda_to_eta
        * mp.sqrt(L / M) * C_R
    )

    source_guard = {
        "base_schema": base.SCHEMA,
        "base_checkpoint_version": base.CHECKPOINT_VERSION,
        "base_terminal_state": base.TERMINAL_STATE,
        "prime_power_inventory": [item[0] for item in prime_terms],
        "expected_prime_power_inventory": [2, 3, 4],
        "prime_endpoint_lambda_squared_included": True,
        "source_prime_block_sign": "minus",
        "pole_block": pole,
        "archimedean_unsigned_block": arch,
        "prime_unsigned_block": prime,
        "full_Q_pole_minus_archimedean_minus_prime": Q,
        "full_Q_reconstruction_defect": _max_abs(Q - (pole - arch - prime)),
        "inversion_J": J,
        "integer_mode_operator": mode,
        "natural_even_basis": even,
        "natural_odd_basis": odd,
        "natural_even_basis_orthonormality_defect": _max_abs(even.T * even - mp.eye(N + 1)),
        "natural_odd_basis_orthonormality_defect": _max_abs(odd.T * odd - mp.eye(N)),
        "parity_basis_cross_defect": _max_abs(even.T * odd),
        "Q_even": Q_even,
        "Q_odd": Q_odd,
        "kappa_modes_minusN_to_N": kappa,
        "kappa_even_coordinates": kappa_even,
        "anchor_complement_W": W,
        "W_orthonormality_defect": _max_abs(W.T * W - mp.eye(N)),
        "W_anchor_orthogonality_defect": _norm(W.T * kappa_even),
        "source_hermitian_defect": _max_abs(Q - Q.T),
        "source_inversion_commutator_defect": _max_abs(Q * J - J * Q),
        "cached_matrix_read": False,
        "cached_eigensystem_read": False,
        "cached_artifact_read": False,
        "zeta_zero_table_read": False,
        "global_weil_positivity_assumed": False,
        "binary64_parameter_used": False,
    }
    normalization_regression = {
        "a4": h_lambda.a4,
        "a0_lambda": h_lambda.a0,
        "projected_state_norm_a": projected_norm,
        "projection_error_e": projection_error,
        "source_limiting_Xi_transform_scalar": mp.mpf(1) / 4,
        "unit_normalized_limiting_Xi_transform_scalar": mp.power(2, mp.mpf(17) / 4) / (4 * mp.sqrt(33)),
        "unit_normalization_limiting_scalar_difference": (mp.power(2, mp.mpf(17) / 4) / mp.sqrt(33) - 1) / 4,
        "unit_normalized_replacement_allowed": False,
    }
    ritz_ground_geometry = {
        "q": q,
        "residual_vector_b": b,
        "residual_r": residual_r,
        "residual_direction_w": w,
        "residual_direction_norm_defect": abs(_norm(w) - 1),
        "B_q": B_q,
        "residual_direction_energy_at_q": complement_energy_q,
        "c_R_two_vector_lower_right_entry": c_R,
        "two_vector_matrix": ritz_matrix,
        "two_vector_ritz_U_equals_u": u,
        "d_q_minus_U": d,
        "ritz_characteristic_residual": ritz_characteristic_residual,
        "B_U": B_U,
        "B_U_eigenvalues": B_values,
        "odd_shifted_eigenvalues_at_U": odd_values,
        "ritz_moment_w_B_U_w": ritz_moment,
        "d_times_ritz_moment": d * ritz_moment,
        "r_squared": residual_r**2,
        "ritz_moment_residual": ritz_moment_residual,
        **constants,
        "complete_even_eigenvalues": even_values,
        "true_even_ground_mu": mu,
        "u_minus_mu_h": h,
        "r_minus_h": residual_r - h,
        "ground_correction_z": z,
        "z_norm_squared": z_norm_squared,
        "C_R_squared_minus_z_norm_squared": C_R_squared - z_norm_squared,
        "gamma_unit_ground_coefficient": gamma,
        "projective_scalar_s_equals_one_over_gamma": projective_scalar,
        "coefficient_normalized_ground_even": coefficient_ground_even,
        "unit_ground_even": unit_ground_even,
        "fresh_eigsy_unit_ground_even": fresh_ground,
        "fresh_ground_vector_defect": _norm(unit_ground_even - fresh_ground),
        "ground_eigen_residual_norm": _norm(ground_residual),
        "feshbach_vector_residual_norm": _norm(feshbach_residual),
        "feshbach_scalar_residual": feshbach_scalar_residual,
        "projective_identity_s_xi_minus_kappa_plus_Wz_norm": _norm(projective_identity_residual),
    }
    low_mode_observation = {
        "M": M,
        "theta": theta,
        "full_ambient_Pi_M": Pi_raw,
        "Pi_M_even": Pi_even,
        "Pi_M_odd": Pi_odd,
        "Pi_M_projector_defect": _max_abs(Pi_raw * Pi_raw - Pi_raw),
        "K_M_WT_Pi_even_W": K_M,
        "K_M_eigenvalues": K_values,
        "K_M_minimum_eigenvalue": K_values[0],
        "K_M_maximum_eigenvalue": K_values[-1],
        "D_B_U_plus_rI": D,
        "X_r_D_inverse_half_K_D_inverse_half_eigenvalues": X_values,
        "X_minimum_eigenvalue": X_values[0],
        "X_maximum_eigenvalue": X_values[-1],
        "actual_low_vector_Pi_M_Wz": low_vector_even,
        "actual_low_squared_norm": low_squared,
        "actual_zT_K_M_z": zKz,
        "low_squared_identity_residual": low_squared - zKz,
        "actual_high_vector_I_minus_Pi_M_Wz": high_vector_even,
        "actual_high_norm": high_norm,
        "actual_total_z_norm": mp.sqrt(z_norm_squared),
        "low_high_pythagoras_residual": pythagoras_residual,
        "C_R_high_norm_bound": C_R,
        "C_R_minus_actual_high_norm": C_R - high_norm,
        "soft_trace_H": H,
        "log_increment_F": F,
        "determinant_ratio": mp.exp(F),
        "F_over_theta_lower_bound": response_lower,
        "F_over_log1p_theta_upper_bound": response_upper,
        "H_minus_F_over_theta": H - response_lower,
        "F_over_log1p_theta_minus_H": response_upper - H,
        "A_R_times_H": A_R_H,
        "A_R_times_F_over_log1p_theta": A_R_F_bound,
        "A_R_H_minus_actual_low_squared": A_R_H - low_squared,
        "A_R_F_bound_minus_actual_low_squared": A_R_F_bound - low_squared,
        "Ritz_Loewner_matrix": loewner,
        "Ritz_Loewner_eigenvalues": loewner_values,
        "Ritz_Loewner_minimum_eigenvalue": loewner_values[0],
    }
    full_source_factorization = {
        "full_ambient_homotopy_required": True,
        "compressed_only_homotopy_allowed": False,
        "zeta_U_minus_r": zeta,
        "homotopy_endpoints": [mp.mpf(0), theta * residual_r],
        "eta_even_boundary_vector": eta_even,
        "e0_even": e0_even,
        "mode_Pi_commutator": mode_cutoff_commutator,
        "mode_Pi_commutator_defect": _max_abs(mode_cutoff_commutator),
        "J_Pi_minus_Pi_J": inversion_cutoff_commutator,
        "J_Pi_commutator_defect": _max_abs(inversion_cutoff_commutator),
        "source_displacement_change_under_homotopy": source_displacement_change,
        "source_displacement_preservation_defect": _max_abs(source_displacement_change),
        "t_zero": endpoint_0,
        "t_theta_r": endpoint_r,
        "F_direct_complement_logdet_increment": F,
        "F_from_full_source_odd_boundary_anchor_factors": factorized_F,
        "full_source_factorization_residual": factorization_residual,
    }
    compact_bridge_diagnostic = {
        "finite_diagnostic_only": True,
        "asymptotic_pass_claim": False,
        "locally_uniform_claim": False,
        "real_compact_bound_B": compact_B,
        "strip_height_eta": compact_eta,
        "compact_radius_sqrt_B2_plus_eta2": compact_radius,
        "cutoff_frequency_2pi_Mplus1_over_L": cutoff_frequency,
        "required_twice_compact_radius": 2 * compact_radius,
        "cutoff_condition_slack": cutoff_frequency - 2 * compact_radius,
        "lambda_to_eta": lambda_to_eta,
        "projected_state_norm_a": projected_norm,
        "projection_error_e": projection_error,
        "projective_difference_s_xi_minus_kappa": -W * z,
        "term_1_projection_4_sqrtL_lambdaeta_e": projection_term,
        "term_2_low_4a_sqrtL_lambdaeta_low_norm": low_term,
        "term_3_high_8sqrt2_over_pi_a_lambdaeta_sqrtL_over_M_high_norm": high_term,
        "sum_of_three_exact_projective_split_terms": projection_term + low_term + high_term,
        "theorem_term_1_projection": projection_term,
        "theorem_term_2_Ritz_logdet_upper_bound": low_term_bound,
        "theorem_term_3_C_R_upper_bound": high_term_bound,
        "sum_of_three_theorem_terms": projection_term + low_term_bound + high_term_bound,
        "low_mode_rate_scalar_a2_L_lambda2eta_A_R_F_over_log1p_theta": projected_norm**2 * L * lam ** (2 * compact_eta) * A_R * F / mp.log1p(theta),
        "high_mode_rate_scalar_a_lambdaeta_sqrtL_over_M_C_R": projected_norm * lambda_to_eta * mp.sqrt(L / M) * C_R,
    }

    raw_sections = {
        "source_guard": source_guard,
        "normalization_regression": normalization_regression,
        "ritz_ground_geometry": ritz_ground_geometry,
        "low_mode_observation": low_mode_observation,
        "full_source_factorization": full_source_factorization,
        "compact_bridge_diagnostic": compact_bridge_diagnostic,
    }
    sections = {name: _encode(value, dps) for name, value in raw_sections.items()}
    live = {
        "source": source_guard,
        "normalization": normalization_regression,
        "ritz": {
            "u": u, "q": q, "d": d, "r": residual_r,
            "B_min": B_values[0], "odd_min": odd_values[0],
            "ritz_characteristic_residual": ritz_characteristic_residual,
            "ritz_moment_residual": ritz_moment_residual,
            "w_norm_defect": abs(_norm(w) - 1),
            "h": h, "r_minus_h": residual_r - h,
            "C_norm_slack": C_R_squared - z_norm_squared,
            "ground_gap": even_values[1] - even_values[0],
            "ground_defect": _norm(unit_ground_even - fresh_ground),
            "ground_residual": _norm(ground_residual),
            "feshbach_vector_residual": _norm(feshbach_residual),
            "feshbach_scalar_residual": feshbach_scalar_residual,
            "projective_identity_residual": _norm(projective_identity_residual),
        },
        "low": {
            "Pi_defect": _max_abs(Pi_raw * Pi_raw - Pi_raw),
            "K_min": K_values[0], "K_max": K_values[-1],
            "X_min": X_values[0], "X_max": X_values[-1],
            "F": F, "H": H,
            "low_identity_residual": low_squared - zKz,
            "pythagoras_residual": pythagoras_residual,
            "high_bound_slack": C_R - high_norm,
            "response_lower_slack": H - response_lower,
            "response_upper_slack": response_upper - H,
            "trace_transfer_slack": A_R_H - low_squared,
            "determinant_transfer_slack": A_R_F_bound - low_squared,
            "loewner_min": loewner_values[0],
        },
        "factor": {
            "mode_commutator": _max_abs(mode_cutoff_commutator),
            "inversion_commutator": _max_abs(inversion_cutoff_commutator),
            "displacement_preservation": _max_abs(source_displacement_change),
            "source_commutator": source_commutator_defect,
            "Pi_raw_trace_defect": abs(_trace(Pi_raw) - (2 * M + 1)),
            "Pi_even_trace_defect": abs(_trace(Pi_even) - (M + 1)),
            "Pi_odd_trace_defect": abs(_trace(Pi_odd) - M),
            "Pi_odd_projector_defect": _max_abs(Pi_odd * Pi_odd - Pi_odd),
            "endpoints": [endpoint_0_live, endpoint_r_live],
            "F_residual": factorization_residual,
        },
        "compact": {
            "cutoff_slack": cutoff_frequency - 2 * compact_radius,
            "terms": [projection_term, low_term, high_term],
            "upper_terms": [projection_term, low_term_bound, high_term_bound],
        },
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
        defects[path] = abs(actual_number - expected_number) / max(
            mp.mpf(1), abs(actual_number), abs(expected_number)
        )
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
    defects["inputs.L"] = abs(supplied_L - actual_L) / max(mp.mpf(1), abs(supplied_L), abs(actual_L))

    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))
    source = live["source"]
    normalization = live["normalization"]
    ritz = live["ritz"]
    low = live["low"]
    factor = live["factor"]
    compact = live["compact"]
    gates: dict[str, bool] = {
        "L_reconstructed": defects["inputs.L"] <= tolerance,
        "complete_source_block_assembled_before_absolute_values": source["full_Q_reconstruction_defect"] <= construction_tolerance,
        "source_hermitian": source["source_hermitian_defect"] <= construction_tolerance,
        "source_inversion": source["source_inversion_commutator_defect"] <= construction_tolerance,
        "natural_even_basis_orthonormal": source["natural_even_basis_orthonormality_defect"] <= construction_tolerance,
        "natural_odd_basis_orthonormal": source["natural_odd_basis_orthonormality_defect"] <= construction_tolerance,
        "parity_bases_orthogonal": source["parity_basis_cross_defect"] <= construction_tolerance,
        "anchor_complement_orthonormal": source["W_orthonormality_defect"] <= construction_tolerance,
        "anchor_complement_orthogonal": source["W_anchor_orthogonality_defect"] <= construction_tolerance,
        "source_normalization_replacement_rejected": normalization["unit_normalized_replacement_allowed"] is False,
        "normalization_changes_limiting_scalar": normalization["unit_normalization_limiting_scalar_difference"] != 0,
        "positive_Ritz_geometry": ritz["u"] < ritz["q"] and ritz["d"] > 0 and ritz["r"] > 0,
        "positive_Ritz_even_complement": ritz["B_min"] > 0,
        "positive_Ritz_odd_sector": ritz["odd_min"] > 0,
        "Ritz_characteristic_identity": abs(ritz["ritz_characteristic_residual"]) <= construction_tolerance,
        "Ritz_moment_identity": abs(ritz["ritz_moment_residual"]) <= construction_tolerance,
        "residual_direction_normalized": ritz["w_norm_defect"] <= construction_tolerance,
        "automatic_ridge": ritz["h"] >= -tolerance and ritz["r_minus_h"] >= -tolerance,
        "diagnostic_ground_simple": ritz["ground_gap"] > 0,
        "fresh_ground_reconstruction": ritz["ground_defect"] <= construction_tolerance,
        "ground_eigen_equation": ritz["ground_residual"] <= construction_tolerance,
        "Feshbach_vector_identity": ritz["feshbach_vector_residual"] <= construction_tolerance,
        "Feshbach_scalar_identity": abs(ritz["feshbach_scalar_residual"]) <= construction_tolerance,
        "projective_scale_identity": ritz["projective_identity_residual"] <= construction_tolerance,
        "C_R_ground_norm_bound": ritz["C_norm_slack"] >= -tolerance,
        "ambient_Pi_is_projector": low["Pi_defect"] <= construction_tolerance,
        "compressed_K_positive_contraction": low["K_min"] >= -tolerance and low["K_max"] <= 1 + tolerance,
        "normalized_response_positive_contraction": low["X_min"] >= -tolerance and low["X_max"] <= 1 + tolerance,
        "positive_response": low["F"] >= -tolerance and low["H"] >= -tolerance,
        "squared_low_identity": abs(low["low_identity_residual"]) <= construction_tolerance,
        "low_high_Pythagoras": abs(low["pythagoras_residual"]) <= construction_tolerance,
        "high_mode_C_R_bound": low["high_bound_slack"] >= -tolerance,
        "response_chord_lower": low["response_lower_slack"] >= -tolerance,
        "response_chord_upper": low["response_upper_slack"] >= -tolerance,
        "Ritz_trace_transfer": low["trace_transfer_slack"] >= -tolerance,
        "Ritz_determinant_transfer": low["determinant_transfer_slack"] >= -tolerance,
        "Ritz_Loewner_PSD": low["loewner_min"] >= -tolerance,
        "full_mode_cutoff_commutes": factor["mode_commutator"] <= construction_tolerance,
        "full_cutoff_commutes_with_inversion": factor["inversion_commutator"] <= construction_tolerance,
        "full_homotopy_preserves_source_displacement": factor["displacement_preservation"] <= construction_tolerance,
        "source_rank_two_commutator_reconstructed": factor["source_commutator"] <= construction_tolerance,
        "full_cutoff_raw_rank": factor["Pi_raw_trace_defect"] <= construction_tolerance,
        "full_cutoff_even_rank": factor["Pi_even_trace_defect"] <= construction_tolerance,
        "full_cutoff_odd_rank": factor["Pi_odd_trace_defect"] <= construction_tolerance,
        "full_odd_cutoff_is_projector": factor["Pi_odd_projector_defect"] <= construction_tolerance,
        "full_source_increment_factorization": abs(factor["F_residual"]) <= tolerance,
        "compact_cutoff_separation": compact["cutoff_slack"] > 0,
        "compact_exact_terms_nonnegative": all(term >= -tolerance for term in compact["terms"]),
        "compact_upper_terms_nonnegative": all(term >= -tolerance for term in compact["upper_terms"]),
    }
    for index, endpoint in enumerate(factor["endpoints"]):
        gates[f"source_endpoint_{index}_positive"] = endpoint["positive_minimum"] > 0
        gates[f"source_endpoint_{index}_anchor_scalar"] = abs(endpoint["a_residual"]) <= construction_tolerance
        gates[f"source_endpoint_{index}_cross_vector"] = endpoint["b_residual"] <= construction_tolerance
        gates[f"source_endpoint_{index}_anchor_matrix"] = endpoint["matrix_residual"] <= construction_tolerance
        gates[f"source_endpoint_{index}_anchor_determinant"] = abs(endpoint["det_anchor_residual"]) <= construction_tolerance * endpoint["det_scale"]
        gates[f"source_endpoint_{index}_parity_determinant"] = abs(endpoint["det_source_residual"]) <= construction_tolerance * endpoint["det_scale"]
        gates[f"source_endpoint_{index}_combined_determinant"] = abs(endpoint["combined_residual"]) <= construction_tolerance * endpoint["det_scale"]

    max_defect = max(defects.values(), default=mp.mpf(0))
    agrees = max_defect <= tolerance and all(gates.values())
    result = {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "claim_class": "FINITE_POINT_DIAGNOSTIC_REPLAY",
        "analytic_uniform_claim": False,
        "equation_5_2_claim": False,
        "rh_proof_claim": False,
        "producer_sha256": producer_sha256,
        "replay_agrees": agrees,
        "tolerance": mp.nstr(tolerance, dps),
        "max_scaled_defect": mp.nstr(max_defect, dps),
        "scaled_defects": {name: mp.nstr(value, dps) for name, value in sorted(defects.items())},
        "independent_gates": gates,
        "independent_paths": {
            "source_matrix": "checkpoint064_reciprocal_secant_replay distributional source assembly; no producer matrix read",
            "prolate_state": "checkpoint064_reciprocal_secant_replay differential-prolate quadrature; no producer state read",
            "parity_and_Ritz": "fresh natural parity bases, Householder anchor complement, residual direction, and two-vector root",
            "ambient_cutoff": "fresh raw-mode diagonal |n|<=M projector followed by independent parity/complement compression",
            "ground_diagnostic": "fresh complete even eigensystem used only after Ritz constants are reconstructed",
            "low_response": "fresh solves, symmetric eigensystems, and positive log determinants",
            "source_factorization": "fresh full ambient homotopy with both parity blocks, anchor/cross terms, boundary m, and Schur sigma",
            "normalization": "fresh source-normalized prolate reconstruction and symbolic limiting-scalar regression",
        },
        "shared_library_limitation": "producer and verifier both use mpmath transcendental point arithmetic and linear algebra",
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
