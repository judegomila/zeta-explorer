#!/usr/bin/env python3
"""Independent replay for checkpoint 0.64.

This module imports no checkpoint-0.64 producer code.  It reconstructs the
source matrix and prolate anchor through ``independent_replay``, builds the
time-band matrix from closed Si/Ci antiderivatives, and projects the limiting
arithmetic state after exchanging its arithmetic sum with the x-integral.
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

from independent_replay import H, matrix_from_source, prolate_quadrature, projection
from residual_ridged_fixed_window_replay import time_band_analytic_full


ROOT = Path(__file__).resolve().parents[1]
SCHEMA = "xi-prolate-checkpoint064-reciprocal-secant-v1"
REPLAY_SCHEMA = "xi-prolate-checkpoint064-reciprocal-secant-replay-v1"
CHECKPOINT_VERSION = "0.64.0-reciprocal-secant-point"
TERMINAL_STATE = "P0_INVALIDATED"
PROLATE_BASIS_SIZE = 30
ARITHMETIC_SUM_CUTOFF = 32

DEPENDENCIES = (
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "notes/DIRECT_SOFT_TRACE_RECIPROCAL_RESERVE.md",
    "notes/PROLATE_SECANT_RADICAL_BLOCK_REDUCTION.md",
    "notes/TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md",
    "src/checkpoint064_reciprocal_secant.py",
    "src/prolate_state.py",
    "src/weil_matrix.py",
    "verifier/checkpoint064_reciprocal_secant_replay.py",
    "verifier/independent_replay.py",
    "verifier/residual_ridged_fixed_window_replay.py",
)

PINNED_SOURCE_SHA256 = {
    "P0_SOURCE_LOCK.json": "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md": "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "vendor/CCM-ZST-2511.22755v1.pdf": "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
    "vendor/CCM-PROLATE-2310.18423v2.pdf": "8bc197642ee9ca4f2393b6cbfd3db292be6a315ce76ad61bfb845d9fedb47f2e",
}

LOCKED_CONVENTIONS = {
    "source_point": "lambda=2, N=4, T=1 only; 40 or 80 decimal digits",
    "physical_interval": "[-L/2,L/2], L=2*log(lambda), Lebesgue measure and zero extension",
    "fourier_transform": "hat(f)(t)=integral f(x)*exp(-i*t*x) dx",
    "centered_modes": "V_n(x)=(-1)^n*L^(-1/2)*exp(+2*pi*i*n*x/L)",
    "inversion": "reflection J*V_n=V_-n is retained",
    "prime_inventory": "every prime power 1<n<=lambda^2, endpoint inclusive",
    "prime_block_sign": "Q=pole-archimedean-prime; source equation (3.19) minus sign retained",
    "source_normalization": "h_lambda=a4*h4-a0(lambda)*h0 with source-limit a4; unit normalization rejected",
    "limiting_state": "K_infinity(x)=E(h)(exp(x)), h=source-normalized Hermite 0/4 limit",
    "parameter_ingestion": "exact text without binary64",
}

LOCKED_FORMULAS = {
    "secant": "z0=P_N C_lambda K_infinity; t=(I-kappa*kappa^T)z0; beta=||t||; omega=t/beta",
    "complement": "q=<kappa,Q*kappa>; b=P_perp(Q-qI)kappa; r=||b||; B=P_perp(Q-qI)P_perp",
    "secant_energy": "epsilon=<omega,B*omega>; c2=<omega,K_T*omega>; d=<omega,b>",
    "D0_identity": "D0=<z0,(Q-qI)z0>=2*alpha*beta*d+beta^2*epsilon",
    "residual_split": "r^2=d^2+||b_perp||^2",
    "soft_trace": "S=tr(r*(B+rI)^(-1)*K_T)",
    "reciprocal": "H0=tr(B^(-1)*K_T); S<=r*H0",
    "block_lower": "S>=c2*r/(epsilon+r)",
    "crowding_reserve": "R=((epsilon+r)*S)/(c2*r)>=1",
    "tail_profile": "Phi(u)=sum_(beta_j<=u) k_j; H(u)=sum_(beta_j>u) k_j/beta_j; S<=Phi(u)+r*H(u)",
}

PROVENANCE = {
    "cached_matrix_read": False,
    "cached_eigensystem_read": False,
    "zeta_zero_table_read": False,
    "global_weil_positivity_assumed": False,
    "binary64_parameter_used": False,
    "asymptotic_claim_made": False,
    "producer_source_path": "blocks_direct distributional source assembly",
    "producer_prolate_path": "normalized Legendre recurrence",
    "producer_time_band_path": "direct evaluation-vector quadrature",
    "producer_limiting_state_path": "direct x-quadrature of a convergent arithmetic sum",
}

LIMITATIONS = [
    "finite arbitrary-precision point diagnostic, not an interval or ball enclosure",
    "producer and verifier share mpmath transcendental arithmetic and eigsy",
    "the source-normalized prolate state is a fixed 30-mode Galerkin truncation without a tail enclosure; independent assembly checks the same finite subspace, not exact eigenfunction convergence",
    "the Gaussian-tail bound expressions are nondirected mpmath point values, not outward-rounded upper endpoints",
    "no unbounded source schedule and no extrapolated exponent claim",
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
    "source_inventory",
    "source_geometry",
    "normalization",
    "secant_geometry",
    "reciprocal_soft_trace",
    "spectral_profile",
    "section_sha256",
    "limitations",
}
SECTION_NAMES = (
    "source_inventory",
    "source_geometry",
    "normalization",
    "secant_geometry",
    "reciprocal_soft_trace",
    "spectral_profile",
)
FORBIDDEN_CACHED_BOOLEAN_KEYS = {
    "pass",
    "passed",
    "certified",
    "replay_agrees",
    "asymptotic_pass",
}


class ReplayError(ValueError):
    """Strict replay contract or independent reconstruction failure."""


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


def _pairs_no_duplicates(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for key, value in pairs:
        if key in out:
            raise ReplayError(f"duplicate JSON key: {key}")
        out[key] = value
    return out


def _reject_float_token(text: str) -> None:
    raise ReplayError(f"binary64/non-integer JSON number forbidden: {text}")


def strict_json_loads(raw: bytes | str, label: str = "producer artifact") -> dict[str, Any]:
    try:
        if isinstance(raw, bytes):
            text = raw.decode("utf-8")
        elif isinstance(raw, str):
            text = raw
        else:
            raise ReplayError(f"{label} must be bytes or text")
        value = json.loads(
            text,
            object_pairs_hook=_pairs_no_duplicates,
            parse_float=_reject_float_token,
            parse_constant=_reject_float_token,
        )
    except (json.JSONDecodeError, UnicodeDecodeError) as exc:
        raise ReplayError(f"invalid {label}") from exc
    if not isinstance(value, dict):
        raise ReplayError(f"{label} root must be an object")
    _reject_binary64_recursive(value, label)
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
            if key.lower() in FORBIDDEN_CACHED_BOOLEAN_KEYS and isinstance(item, bool):
                raise ReplayError(f"cached producer boolean forbidden at {path}.{key}")
            _reject_binary64_recursive(item, f"{path}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            _reject_binary64_recursive(item, f"{path}[{index}]")


def _raw_hash(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("ascii")
    return _sha256_bytes(raw)


def _exact_positive_text(value: Any, label: str) -> Fraction:
    if not isinstance(value, str):
        raise ReplayError(f"{label} must be exact text; binary64 is forbidden")
    try:
        result = Fraction(value)
    except (ValueError, ZeroDivisionError) as exc:
        raise ReplayError(f"invalid exact {label}") from exc
    if result <= 0:
        raise ReplayError(f"{label} must be positive")
    return result


def _dot(x: mp.matrix, A: mp.matrix, y: mp.matrix) -> mp.mpf:
    return (x.T * A * y)[0]


def _norm(x: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(x[i]) ** 2 for i in range(x.rows)))


def _trace(A: mp.matrix) -> mp.mpf:
    return mp.fsum(A[i, i] for i in range(min(A.rows, A.cols)))


def _max_abs(A: mp.matrix) -> mp.mpf:
    return max(
        (abs(A[i, j]) for i in range(A.rows) for j in range(A.cols)),
        default=mp.mpf("0"),
    )


def _inverse(A: mp.matrix) -> mp.matrix:
    if A.rows != A.cols:
        raise ReplayError("matrix inverse requires a square matrix")
    result = mp.matrix(A.rows)
    for j in range(A.rows):
        e = mp.matrix(A.rows, 1)
        e[j] = 1
        result[:, j] = mp.lu_solve(A, e)
    return result


def _sector_bases(N: int) -> tuple[mp.matrix, mp.matrix]:
    dimension = 2 * N + 1
    even = mp.matrix(dimension, N + 1)
    odd = mp.matrix(dimension, N)
    even[N, 0] = 1
    root2 = mp.sqrt(2)
    for n in range(1, N + 1):
        even[N - n, n] = even[N + n, n] = 1 / root2
        odd[N + n, n - 1] = 1 / root2
        odd[N - n, n - 1] = -1 / root2
    return even, odd


def _inversion(N: int) -> mp.matrix:
    dimension = 2 * N + 1
    result = mp.matrix(dimension)
    for j in range(dimension):
        result[j, dimension - 1 - j] = 1
    return result


def _orthogonal_complement(unit: mp.matrix) -> mp.matrix:
    if unit.cols != 1 or unit.rows < 2:
        raise ReplayError("invalid unit vector for orthogonal complement")
    e0 = mp.matrix(unit.rows, 1)
    e0[0] = 1
    sign = 1 if unit[0] >= 0 else -1
    vector = unit + sign * e0
    denominator = (vector.T * vector)[0]
    if denominator == 0:
        raise ReplayError("Householder complement is singular")
    return (mp.eye(unit.rows) - 2 * vector * vector.T / denominator)[:, 1:]


def _time_band_nodes(N: int, L: mp.mpf, T: mp.mpf) -> list[mp.mpf]:
    nodes = {-T, mp.mpf("0"), T}
    for n in range(-N, N + 1):
        omega = 2 * mp.pi * n / L
        if -T < omega < T:
            nodes.add(omega)
    return sorted(nodes)


def _limiting_segment_integral(
    lower: mp.mpf, upper: mp.mpf, omega: mp.mpf
) -> mp.mpc:
    """Integral of h(y)*y^(-1/2-i*omega) over one transformed segment."""

    def gaussian_power(power: mp.mpc) -> mp.mpc:
        shape = (power + 1) / 2
        return (
            mp.mpf("0.5")
            * mp.power(mp.pi, -shape)
            * mp.gammainc(shape, mp.pi * lower**2, mp.pi * upper**2)
        )

    return (
        mp.pi**2 * gaussian_power(mp.mpf("3.5") - 1j * omega)
        - mp.mpf("1.5")
        * mp.pi
        * gaussian_power(mp.mpf("1.5") - 1j * omega)
    )


def _limiting_projection_transformed(
    N: int, L: mp.mpf, lam: mp.mpf, cutoff: int
) -> tuple[mp.matrix, mp.mpf]:
    coefficients: list[mp.mpf] = []
    imaginary_defect = mp.mpf("0")
    for n in range(N + 1):
        omega = 2 * mp.pi * n / L
        coefficient = mp.power(-1, n) / mp.sqrt(L) * mp.fsum(
            mp.power(m, mp.mpf("-0.5") + 1j * omega)
            * _limiting_segment_integral(mp.mpf(m) / lam, mp.mpf(m) * lam, omega)
            for m in range(1, cutoff + 1)
        )
        imaginary_defect = max(imaginary_defect, abs(mp.im(coefficient)))
        coefficients.append(mp.re(coefficient))
    vector = mp.matrix([coefficients[abs(n)] for n in range(-N, N + 1)])
    return vector, imaginary_defect


def _limiting_tail_bound(lambda_value: mp.mpf, cutoff: int) -> mp.mpf:
    if lambda_value != 2 or cutoff < 8:
        raise ReplayError("limiting-tail bound is locked to lambda=2")

    def envelope_index(x: mp.mpf) -> mp.mpf:
        y = x / 2
        return (
            mp.pi**2 * y**4 + mp.mpf("1.5") * mp.pi * y**2
        ) * mp.exp(-mp.pi * y**2)

    start = mp.mpf(cutoff + 1)
    return mp.sqrt(2) * (
        envelope_index(start) + mp.quad(envelope_index, [start, mp.inf])
    )


def _spectral_profile(
    B: mp.matrix,
    K: mp.matrix,
    r: mp.mpf,
    epsilon: mp.mpf,
    soft_trace: mp.mpf,
) -> dict[str, Any]:
    eigenvalues, eigenvectors = mp.eigsy((B + B.T) / 2)
    spectral_K = eigenvectors.T * K * eigenvectors
    weights = [spectral_K[j, j] for j in range(B.rows)]
    thresholds: list[tuple[str, mp.mpf]] = [
        ("half_minimum_B_eigenvalue", eigenvalues[0] / 2),
        ("ridge_r", r),
        ("secant_energy_epsilon", epsilon),
    ]
    for j in range(B.rows - 1):
        thresholds.append(
            (f"geometric_gap_{j}_{j + 1}", mp.sqrt(eigenvalues[j] * eigenvalues[j + 1]))
        )
    thresholds.append(("twice_maximum_B_eigenvalue", 2 * eigenvalues[-1]))

    records = []
    for label, threshold in thresholds:
        phi = mp.mpf("0")
        reciprocal_tail = mp.mpf("0")
        rank = 0
        for eigenvalue, weight in zip(eigenvalues, weights):
            if eigenvalue <= threshold:
                phi += weight
                rank += 1
            else:
                reciprocal_tail += weight / eigenvalue
        upper = phi + r * reciprocal_tail
        records.append(
            {
                "label": label,
                "u": threshold,
                "low_rank": rank,
                "Phi": phi,
                "H_reciprocal_tail": reciprocal_tail,
                "Phi_plus_rH": upper,
                "upper_minus_soft_trace": upper - soft_trace,
            }
        )
    return {
        "B_eigenvalues": eigenvalues,
        "K_weights_in_B_eigenbasis": mp.matrix(weights),
        "K_weight_sum": mp.fsum(weights),
        "soft_trace_from_spectral_weights": mp.fsum(
            r * weight / (eigenvalue + r)
            for eigenvalue, weight in zip(eigenvalues, weights)
        ),
        "H0_from_spectral_weights": mp.fsum(
            weight / eigenvalue for eigenvalue, weight in zip(eigenvalues, weights)
        ),
        "reciprocal_tail_profile": records,
    }


def _encode(value: Any, digits: int) -> Any:
    if isinstance(value, mp.matrix):
        if value.cols == 1:
            return [mp.nstr(value[i], digits) for i in range(value.rows)]
        return [
            [mp.nstr(value[i, j], digits) for j in range(value.cols)]
            for i in range(value.rows)
        ]
    if isinstance(value, mp.mpf):
        return mp.nstr(value, digits)
    if isinstance(value, dict):
        return {key: _encode(item, digits) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_encode(item, digits) for item in value]
    if isinstance(value, (str, int, bool)) or value is None:
        return value
    raise TypeError(f"cannot serialize {type(value).__name__}")


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

    runtime = payload.get("runtime")
    expected_runtime = {
        "python": sys.version.split()[0],
        "mpmath": mp.__version__,
    }
    if runtime != expected_runtime:
        raise ReplayError("runtime metadata mismatch")

    inputs = payload.get("inputs")
    expected_input_keys = {
        "lambda",
        "N",
        "T",
        "precision_decimal_digits",
        "prolate_even_legendre_basis_size",
        "limiting_arithmetic_sum_cutoff",
        "L",
    }
    if not isinstance(inputs, dict) or set(inputs) != expected_input_keys:
        raise ReplayError("input inventory mismatch")
    if _exact_positive_text(inputs.get("lambda"), "lambda") != 2:
        raise ReplayError("lambda must equal exact 2")
    if _exact_positive_text(inputs.get("T"), "T") != 1:
        raise ReplayError("T must equal exact 1")
    if inputs.get("N") != 4 or isinstance(inputs.get("N"), bool):
        raise ReplayError("N must equal exact integer 4")
    if inputs.get("precision_decimal_digits") not in (40, 80):
        raise ReplayError("precision must be exact integer 40 or 80")
    if inputs.get("prolate_even_legendre_basis_size") != PROLATE_BASIS_SIZE:
        raise ReplayError("wrong prolate basis size")
    if inputs.get("limiting_arithmetic_sum_cutoff") != ARITHMETIC_SUM_CUTOFF:
        raise ReplayError("wrong arithmetic sum cutoff")
    serialized_L = _numeric_string(inputs.get("L"))
    if serialized_L is None or serialized_L <= 0:
        raise ReplayError("L must be finite positive numeric text")

    hashes = payload.get("section_sha256")
    if not isinstance(hashes, dict) or set(hashes) != set(SECTION_NAMES):
        raise ReplayError("section hash inventory mismatch")
    for name in SECTION_NAMES:
        if hashes.get(name) != _raw_hash(payload.get(name)):
            raise ReplayError(f"section hash mismatch: {name}")

    inventory = payload.get("source_inventory")
    if not isinstance(inventory, dict) or set(inventory) != {"modes", "prime_powers"}:
        raise ReplayError("source inventory shape mismatch")
    if inventory.get("modes") != list(range(-4, 5)):
        raise ReplayError("centered-mode inventory mismatch")
    prime_powers = inventory.get("prime_powers")
    if not isinstance(prime_powers, list) or [
        item.get("n") if isinstance(item, dict) else None for item in prime_powers
    ] != [2, 3, 4]:
        raise ReplayError("inclusive prime-power inventory mismatch")
    if any(
        set(item) != {"n", "von_mangoldt"}
        or not isinstance(item["von_mangoldt"], str)
        for item in prime_powers
    ):
        raise ReplayError("prime-power record mismatch")

    normalization = payload.get("normalization")
    if not isinstance(normalization, dict) or normalization.get(
        "unit_normalized_replacement_allowed"
    ) is not False:
        raise ReplayError("source normalization replacement rejected")

    source_geometry = payload.get("source_geometry")
    if not isinstance(source_geometry, dict):
        raise ReplayError("source geometry missing")
    for field in ("even_gap_at_q", "odd_gap_at_q"):
        value = _numeric_string(source_geometry.get(field))
        if value is None or value <= 0:
            raise ReplayError(f"nonpositive complementary gap rejected: {field}")

    secant_geometry = payload.get("secant_geometry")
    if not isinstance(secant_geometry, dict):
        raise ReplayError("secant geometry missing")
    beta = _numeric_string(secant_geometry.get("beta"))
    if beta is None or beta <= 0:
        raise ReplayError("nonpositive secant norm rejected")


def _numeric_string(value: Any) -> mp.mpf | None:
    if not isinstance(value, str):
        return None
    try:
        result = mp.mpf(value)
    except (ValueError, TypeError):
        return None
    return result if mp.isfinite(result) else None


def _compare_recursive(
    actual: Any,
    expected: Any,
    path: str,
    defects: dict[str, mp.mpf],
) -> None:
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


def _reconstruct(payload: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    inputs = payload["inputs"]
    lambda_text = inputs["lambda"]
    T_text = inputs["T"]
    N = inputs["N"]
    dps = inputs["precision_decimal_digits"]
    basis_size = inputs["prolate_even_legendre_basis_size"]
    cutoff = inputs["limiting_arithmetic_sum_cutoff"]
    mp.mp.dps = dps
    lam = mp.mpf(lambda_text)
    T = mp.mpf(T_text)
    L = 2 * mp.log(lam)

    pole, arch, prime, Q, terms = matrix_from_source(lambda_text, N, dps)
    functions = prolate_quadrature(lambda_text, basis_size, dps)
    h_lambda = H(lambda_text, functions[0], functions[1])
    kappa, _coefficients, projection_error, projected_norm, _state_norm, _checks = projection(
        h_lambda, N
    )

    even, odd = _sector_bases(N)
    J = _inversion(N)
    kappa_even = even.T * kappa
    complement = _orthogonal_complement(kappa_even)
    Q_even = even.T * Q * even
    Q_odd = odd.T * Q * odd
    q = _dot(kappa, Q, kappa)
    b = complement.T * (Q_even * kappa_even - q * kappa_even)
    r = _norm(b)
    B = complement.T * Q_even * complement - q * mp.eye(N)
    odd_shifted = Q_odd - q * mp.eye(N)
    B_values, _ = mp.eigsy((B + B.T) / 2)
    odd_values, _ = mp.eigsy((odd_shifted + odd_shifted.T) / 2)

    z0, z0_imaginary_defect = _limiting_projection_transformed(
        N, L, lam, cutoff
    )
    arithmetic_tail = _limiting_tail_bound(lam, cutoff)
    coefficient_tail = mp.sqrt(L) * arithmetic_tail
    alpha = (kappa.T * z0)[0]
    secant = z0 - alpha * kappa
    beta = _norm(secant)
    omega_full = secant / beta
    omega = complement.T * even.T * omega_full
    epsilon = _dot(omega, B, omega)
    d = (omega.T * b)[0]
    b_perp = b - d * omega
    b_perp_norm = _norm(b_perp)
    D0 = _dot(z0, Q - q * mp.eye(2 * N + 1), z0)
    D0_rhs = 2 * alpha * beta * d + beta**2 * epsilon

    K_full = time_band_analytic_full(N, L, T)
    K = complement.T * even.T * K_full * even * complement
    K_values, _ = mp.eigsy((K + K.T) / 2)
    c2 = _dot(omega, K, omega)
    H0 = _trace(_inverse(B) * K)
    soft_trace = _trace(r * _inverse(B + r * mp.eye(N)) * K)
    reciprocal_upper = r * H0
    block_lower = c2 * r / (epsilon + r)
    tilted_remainder = soft_trace - block_lower
    crowding_reserve = (epsilon + r) * soft_trace / (c2 * r)
    profile = _spectral_profile(B, K, r, epsilon, soft_trace)

    combined_integral = h_lambda.a4 * h_lambda.integral(h_lambda.h4) - h_lambda.a0 * h_lambda.integral(h_lambda.h0)
    source_inventory_numeric = {
        "modes": list(range(-N, N + 1)),
        "prime_powers": [
            {"n": n, "von_mangoldt": value} for n, value in terms
        ],
    }
    source_geometry_numeric = {
        "pole": pole,
        "archimedean_unsigned": arch,
        "prime_unsigned": prime,
        "Q_equals_pole_minus_archimedean_minus_prime": Q,
        "hermitian_defect": _max_abs(Q - Q.T),
        "inversion_commutator_defect": _max_abs(Q * J - J * Q),
        "q": q,
        "residual_r": r,
        "residual_vector_even_complement": b,
        "B_even_complement_at_q": B,
        "B_eigenvalues": B_values,
        "even_gap_at_q": B_values[0],
        "odd_gap_at_q": odd_values[0],
        "K_T_even_complement": K,
        "K_T_eigenvalue_min": K_values[0],
        "K_T_eigenvalue_max": K_values[-1],
        "K_T_hermitian_defect": _max_abs(K - K.T),
        "time_band_quadrature_nodes": _time_band_nodes(N, L, T),
    }
    normalization_numeric = {
        "a4": h_lambda.a4,
        "a0_lambda": h_lambda.a0,
        "h_lambda_zero_integral_defect": abs(combined_integral),
        "limiting_h_L2_norm": mp.sqrt(33) / mp.power(2, mp.mpf(17) / 4),
        "source_limiting_Xi_transform_scalar": mp.mpf(1) / 4,
        "unit_normalization_limit_multiplier": mp.power(2, mp.mpf(17) / 4)
        / mp.sqrt(33),
        "unit_normalized_limiting_Xi_transform_scalar": mp.power(
            2, mp.mpf(17) / 4
        )
        / (4 * mp.sqrt(33)),
        "unit_normalization_limiting_scalar_difference": (
            mp.power(2, mp.mpf(17) / 4) / mp.sqrt(33) - 1
        )
        / 4,
        "projected_state_norm": projected_norm,
        "projection_error": projection_error,
        "kappa_modes_minusN_to_N": kappa,
        "kappa_inversion_even_defect": _norm(J * kappa - kappa),
        "limiting_arithmetic_sum_cutoff": cutoff,
        "limiting_arithmetic_pointwise_tail_bound_point_value": arithmetic_tail,
        "limiting_projection_coefficient_tail_bound_point_value": coefficient_tail,
        "unit_normalized_replacement_allowed": False,
    }
    secant_numeric = {
        "z0_limiting_projection_modes_minusN_to_N": z0,
        "z0_inversion_even_defect": _norm(J * z0 - z0),
        "alpha": alpha,
        "secant_t_modes_minusN_to_N": secant,
        "secant_kappa_orthogonality_defect": abs((kappa.T * secant)[0]),
        "beta": beta,
        "lambda_squared_times_beta": lam**2 * beta,
        "omega_even_complement": omega,
        "omega_norm_defect": abs(_norm(omega) - 1),
        "epsilon": epsilon,
        "c2_fixed_window_capture": c2,
        "d_signed_residual_coordinate": d,
        "d_over_r_signed": d / r,
        "captured_residual_fraction_d2_over_r2": d**2 / r**2,
        "b_perp_even_complement": b_perp,
        "b_perp_norm": b_perp_norm,
        "b_perp_fraction_squared": b_perp_norm**2 / r**2,
        "residual_pythagoras_signed_residual": r**2 - d**2 - b_perp_norm**2,
        "D0_direct": D0,
        "D0_secant_rhs": D0_rhs,
        "D0_identity_signed_residual": D0 - D0_rhs,
        "r_over_epsilon": r / epsilon,
        "L_3_over_2_times_r_over_epsilon": L ** mp.mpf("1.5") * r / epsilon,
    }
    reciprocal_numeric = {
        "soft_trace_S": soft_trace,
        "scaled_soft_trace_L_3_over_2": L ** mp.mpf("1.5") * soft_trace,
        "H0_reciprocal_trace": H0,
        "r_times_H0_upper": reciprocal_upper,
        "rH0_minus_soft_trace": reciprocal_upper - soft_trace,
        "one_vector_block_lower": block_lower,
        "soft_trace_minus_block_lower_tilted_remainder": tilted_remainder,
        "reciprocal_crowding_reserve": crowding_reserve,
        "crowding_reserve_minus_one": crowding_reserve - 1,
    }
    sections = {
        "source_inventory": _encode(source_inventory_numeric, dps),
        "source_geometry": _encode(source_geometry_numeric, dps),
        "normalization": _encode(normalization_numeric, dps),
        "secant_geometry": _encode(secant_numeric, dps),
        "reciprocal_soft_trace": _encode(reciprocal_numeric, dps),
        "spectral_profile": _encode(profile, dps),
    }
    live = {
        "L": L,
        "q": q,
        "r": r,
        "B": B,
        "B_values": B_values,
        "odd_values": odd_values,
        "K": K,
        "K_values": K_values,
        "epsilon": epsilon,
        "c2": c2,
        "D0": D0,
        "D0_rhs": D0_rhs,
        "b_perp_norm": b_perp_norm,
        "d": d,
        "soft_trace": soft_trace,
        "H0": H0,
        "reciprocal_upper": reciprocal_upper,
        "block_lower": block_lower,
        "tilted_remainder": tilted_remainder,
        "crowding_reserve": crowding_reserve,
        "profile": profile,
        "source_hermitian_defect": source_geometry_numeric["hermitian_defect"],
        "source_inversion_defect": source_geometry_numeric["inversion_commutator_defect"],
        "kappa_even_defect": normalization_numeric["kappa_inversion_even_defect"],
        "z0_even_defect": secant_numeric["z0_inversion_even_defect"],
        "secant_orthogonality_defect": secant_numeric["secant_kappa_orthogonality_defect"],
        "omega_norm_defect": secant_numeric["omega_norm_defect"],
        "residual_pythagoras": secant_numeric["residual_pythagoras_signed_residual"],
        "z0_imaginary_defect": z0_imaginary_defect,
    }
    return sections, live


def replay_payload(
    payload: dict[str, Any], producer_sha256: str = "in_memory"
) -> dict[str, Any]:
    _validate_contract(payload)
    dps = payload["inputs"]["precision_decimal_digits"]
    mp.mp.dps = dps
    expected_sections, live = _reconstruct(payload)
    defects: dict[str, mp.mpf] = {}
    for name in SECTION_NAMES:
        _compare_recursive(payload[name], expected_sections[name], name, defects)

    supplied_L = mp.mpf(payload["inputs"]["L"])
    defects["inputs.L"] = abs(supplied_L - live["L"]) / max(
        mp.mpf(1), abs(supplied_L), abs(live["L"])
    )
    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))
    profile_slacks = [
        record["upper_minus_soft_trace"]
        for record in live["profile"]["reciprocal_tail_profile"]
    ]
    gates = {
        "L_reconstructed": defects["inputs.L"] <= tolerance,
        "source_hermitian": live["source_hermitian_defect"] <= construction_tolerance,
        "source_inversion": live["source_inversion_defect"] <= construction_tolerance,
        "anchor_inversion_even": live["kappa_even_defect"] <= construction_tolerance,
        "limiting_projection_inversion_even": live["z0_even_defect"] <= construction_tolerance,
        "limiting_projection_transformed_imaginary_small": live["z0_imaginary_defect"] <= construction_tolerance,
        "secant_orthogonalized": live["secant_orthogonality_defect"] <= construction_tolerance,
        "secant_normalized": live["omega_norm_defect"] <= construction_tolerance,
        "positive_even_gap": live["B_values"][0] > 0,
        "positive_odd_gap": live["odd_values"][0] > 0,
        "positive_secant_energy": live["epsilon"] > 0,
        "positive_fixed_window_capture": live["c2"] > 0,
        "K_positive_contraction": live["K_values"][0] >= -tolerance and live["K_values"][-1] <= 1 + tolerance,
        "D0_identity": abs(live["D0"] - live["D0_rhs"]) <= construction_tolerance,
        "residual_pythagoras": abs(live["residual_pythagoras"]) <= construction_tolerance,
        "reciprocal_upper": live["reciprocal_upper"] >= live["soft_trace"] - tolerance,
        "one_vector_block_lower": live["block_lower"] <= live["soft_trace"] + tolerance,
        "nonnegative_tilted_remainder": live["tilted_remainder"] >= -tolerance,
        "crowding_reserve_at_least_one": live["crowding_reserve"] >= 1 - tolerance,
        "spectral_soft_trace_reconstruction": abs(
            live["profile"]["soft_trace_from_spectral_weights"] - live["soft_trace"]
        ) <= tolerance,
        "spectral_reciprocal_reconstruction": abs(
            live["profile"]["H0_from_spectral_weights"] - live["H0"]
        ) <= tolerance,
        "all_reciprocal_tail_bounds": all(value >= -tolerance for value in profile_slacks),
    }
    max_defect = max(defects.values(), default=mp.mpf("0"))
    replay_agrees = max_defect <= tolerance and all(gates.values())
    result = {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "claim_class": "FINITE_POINT_DIAGNOSTIC_REPLAY",
        "analytic_uniform_claim": False,
        "producer_sha256": producer_sha256,
        "replay_agrees": replay_agrees,
        "tolerance": mp.nstr(tolerance, dps),
        "max_scaled_defect": mp.nstr(max_defect, dps),
        "scaled_defects": {
            name: mp.nstr(value, dps) for name, value in sorted(defects.items())
        },
        "independent_gates": gates,
        "independent_paths": {
            "source_matrix": "verifier/independent_replay matrix_from_source",
            "prolate_state": "differential-form quadrature Galerkin path",
            "time_band": "closed Si/Ci antiderivatives; no producer quadrature matrix read",
            "limiting_projection": "sum-integral exchange with incomplete-gamma segment integrals",
        },
        "shared_library_limitation": "producer and verifier both use mpmath transcendental arithmetic and eigsy",
        "producer_values_used_only_for_comparison": True,
    }
    if not replay_agrees:
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
    arguments.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
