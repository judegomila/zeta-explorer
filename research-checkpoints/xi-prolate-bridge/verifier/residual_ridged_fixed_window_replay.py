#!/usr/bin/env python3
"""Independent replay of the residual-ridged fixed-window source pilot.

The replay imports no producer code.  It uses the clean formula path already
used by ``independent_replay.py`` for the source matrix and prolate state, and
it reconstructs the time-band matrix from sine/cosine-integral
antiderivatives rather than quadrature evaluation vectors.
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

from independent_replay import (
    H,
    lambda_squared_floor_exact,
    lambda_terms,
    matrix_from_source,
    prolate_quadrature,
    projection,
)


ROOT = Path(__file__).resolve().parents[1]
DEPENDENCIES = (
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "notes/RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md",
    "notes/SOFT_TRACE_PHYSICAL_SPLICE_REDUCTION.md",
    "src/residual_ridged_fixed_window_pilot.py",
    "src/prolate_state.py",
    "src/weil_matrix.py",
    "verifier/residual_ridged_fixed_window_replay.py",
    "verifier/independent_replay.py",
)
FOURIER_CONVENTION = (
    "U_n(x)=L^(-1/2) exp(+2*pi*i*n*x/L); "
    "centered transform integral f(y) exp(-i*t*y) dy"
)
PHYSICAL_MOMENT_DECLARATION = "span(P_kappa_perp centered_constant_mode)"
PHYSICAL_SCHUR_DEFINITION = (
    "C_r=P(B+rI)P-P(B+rI)H[H(B+rI)H]^-1H(B+rI)P"
)
PHYSICAL_SPLICE_INEQUALITY = (
    "sqrt(tr(S_r K_T)) <= sqrt(r tr(C_r^-1)) + sqrt(tr(H K_T H))"
)
LIMITATIONS = [
    "finite arbitrary-precision point diagnostic, not an interval or ball enclosure",
    "producer and verifier share mpmath transcendental arithmetic",
    "no unbounded source schedule",
    "no locally uniform determinant limit",
]
TOP_LEVEL_KEYS = {
    "schema",
    "terminal_state",
    "claim_class",
    "analytic_uniform_claim",
    "inputs",
    "locked_conventions",
    "provenance",
    "dependency_sha256",
    "source_inventory",
    "normalization",
    "matrix_structural_values",
    "source_blocks",
    "raw_values",
    "raw_value_sha256",
    "scalars",
    "residual_vector_even_complement_before_norm",
    "time_band_quadrature_nodes",
    "physical_splice",
    "limitations",
    "runtime",
}
SOURCE_BLOCK_KEYS = {
    "pole",
    "archimedean_unsigned",
    "prime_unsigned",
    "Q_equals_pole_minus_arch_minus_prime",
}
RAW_VALUE_KEYS = {
    "kappa_modes_minusN_to_N",
    "projected_state_coefficients_modes_minusN_to_N",
    "B_even_complement_at_q",
    "Q_odd_minus_qI",
    "K_T_even_complement",
    "S_r",
    "moment_projector",
}
SCALAR_KEYS = {
    "q",
    "r",
    "even_gap_at_q",
    "odd_gap_at_q",
    "ridge_energy",
    "ridge_slack_r_minus_energy",
    "soft_trace",
    "scaled_soft_trace_L_3_over_2",
    "anchor_squared_soft_trace",
    "K_eigenvalue_min",
    "K_eigenvalue_max",
    "K_hermitian_defect",
    "regularized_physical_schur",
    "physical_low_soft_mass",
    "high_time_band_mass",
    "splice_lhs",
    "splice_rhs",
    "splice_slack",
}


class ReplayError(ValueError):
    pass


def _sha256_bytes(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def _sha256_file(path: Path) -> str:
    return _sha256_bytes(path.read_bytes())


def _dependency_hashes() -> dict[str, str]:
    return {name: _sha256_file(ROOT / name) for name in DEPENDENCIES}


def _pairs_no_duplicates(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for key, value in pairs:
        if key in out:
            raise ReplayError(f"duplicate JSON key: {key}")
        out[key] = value
    return out


def _reject_float(text: str) -> None:
    raise ReplayError(f"binary64/non-integer JSON number forbidden: {text}")


def strict_json_loads(raw: bytes | str, label: str = "producer artifact") -> dict[str, Any]:
    if isinstance(raw, bytes):
        text = raw.decode("utf-8")
    elif isinstance(raw, str):
        text = raw
    else:
        raise ReplayError(f"{label} must be bytes or text")
    try:
        value = json.loads(
            text,
            object_pairs_hook=_pairs_no_duplicates,
            parse_float=_reject_float,
            parse_constant=_reject_float,
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
    if isinstance(value, dict):
        for key, item in value.items():
            _reject_binary64_recursive(item, f"{path}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            _reject_binary64_recursive(item, f"{path}[{index}]")


def _exact_positive_text(value: Any, name: str) -> Fraction:
    if not isinstance(value, str):
        raise ReplayError(f"{name} must be exact text; binary64 is forbidden")
    try:
        result = Fraction(value)
    except (ValueError, ZeroDivisionError) as exc:
        raise ReplayError(f"invalid exact text for {name}") from exc
    if result <= 0:
        raise ReplayError(f"{name} must be positive")
    return result


def _mp_text(value: Any, name: str = "numeric value") -> mp.mpf:
    if not isinstance(value, str):
        raise ReplayError(f"{name} must be serialized as text")
    try:
        result = mp.mpf(value)
    except (ValueError, TypeError) as exc:
        raise ReplayError(f"invalid {name}") from exc
    if not mp.isfinite(result):
        raise ReplayError(f"nonfinite {name}")
    return result


def _raw_hash(value: Any) -> str:
    raw = json.dumps(value, separators=(",", ":"), sort_keys=True).encode("ascii")
    return _sha256_bytes(raw)


def _require_exact_keys(value: Any, expected: set[str], label: str) -> dict[str, Any]:
    if not isinstance(value, dict) or set(value) != expected:
        raise ReplayError(f"{label} field inventory mismatch")
    return value


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


def _orthogonal_complement(unit: mp.matrix) -> mp.matrix:
    if unit.rows < 2:
        raise ReplayError("orthogonal complement requires dimension at least two")
    e0 = mp.matrix(unit.rows, 1)
    e0[0] = 1
    sign = 1 if unit[0] >= 0 else -1
    vector = unit + sign * e0
    Hh = mp.eye(unit.rows) - 2 * vector * vector.T / _dot(
        vector, mp.eye(unit.rows), vector
    )
    return Hh[:, 1:unit.rows]


def _sector_bases(N: int) -> tuple[mp.matrix, mp.matrix]:
    dimension = 2 * N + 1
    even = mp.matrix(dimension, N + 1)
    odd = mp.matrix(dimension, N)
    even[N, 0] = 1
    for n in range(1, N + 1):
        even[N - n, n] = even[N + n, n] = 1 / mp.sqrt(2)
        odd[N + n, n - 1] = 1 / mp.sqrt(2)
        odd[N - n, n - 1] = -1 / mp.sqrt(2)
    return even, odd


def _inversion(N: int) -> mp.matrix:
    dimension = 2 * N + 1
    J = mp.matrix(dimension)
    for i in range(dimension):
        J[i, dimension - 1 - i] = 1
    return J


def _inverse(A: mp.matrix) -> mp.matrix:
    out = mp.matrix(A.rows)
    for j in range(A.rows):
        e = mp.matrix(A.rows, 1)
        e[j] = 1
        out[:, j] = mp.lu_solve(A, e)
    return out


def _A_primitive(s: mp.mpf, L: mp.mpf) -> mp.mpf:
    """Even primitive of ``(1-cos(L*s))/s``."""
    if s == 0:
        return -mp.euler - mp.log(L)
    return mp.log(abs(s)) - mp.ci(L * abs(s))


def _D_primitive(s: mp.mpf, L: mp.mpf) -> mp.mpf:
    """Odd primitive of ``sin(L*s/2)^2/s^2``."""
    if s == 0:
        return mp.mpf("0")
    return -(1 - mp.cos(L * s)) / (2 * s) + L * mp.si(L * s) / 2


def time_band_analytic_full(N: int, L: mp.mpf, T: mp.mpf) -> mp.matrix:
    """Closed antiderivative assembly in the centered full Fourier basis.

    For the locked centered mode,

      I_n(t)=2 sin(t L/2)/(sqrt(L)(t-2*pi*n/L)).

    The matrix is the exact integral of ``I_n I_m/(2*pi)`` on ``[-T,T]``.
    Off-diagonal entries use a cosine-integral divided difference; diagonal
    entries use the sine-integral primitive.
    """
    modes = list(range(-N, N + 1))
    frequencies = {n: 2 * mp.pi * n / L for n in modes}

    def first_denominator_integral(n: int) -> mp.mpf:
        c = frequencies[n]
        return (
            _A_primitive(T - c, L) - _A_primitive(T + c, L)
        ) / 2

    first = {n: first_denominator_integral(n) for n in modes}
    K = mp.matrix(len(modes))
    factor = 2 / (mp.pi * L)
    for i, n in enumerate(modes):
        cn = frequencies[n]
        for j, m in enumerate(modes):
            cm = frequencies[m]
            if n == m:
                raw = _D_primitive(T - cn, L) + _D_primitive(T + cn, L)
            else:
                raw = (first[n] - first[m]) / (cn - cm)
            K[i, j] = factor * raw
    return K


def _quadrature_nodes(N: int, L: mp.mpf, T: mp.mpf) -> list[mp.mpf]:
    """Independently reconstruct the producer's integration breakpoints."""
    nodes = [-T, mp.mpf("0"), T]
    for n in range(-N, N + 1):
        frequency = 2 * mp.pi * n / L
        if -T < frequency < T:
            nodes.append(frequency)
    return sorted(set(nodes))


def _independent_metrics(
    Q: mp.matrix,
    kappa: mp.matrix,
    projected_norm: mp.mpf,
    N: int,
    L: mp.mpf,
    T: mp.mpf,
) -> dict[str, Any]:
    even, odd = _sector_bases(N)
    ke = even.T * kappa
    complement = _orthogonal_complement(ke)
    Qe = even.T * Q * even
    Qo = odd.T * Q * odd
    q = _dot(kappa, Q, kappa)
    b = complement.T * (Qe * ke - q * ke)
    residual = _norm(b)
    if not residual > 0:
        raise ReplayError("reconstructed residual is not strictly positive")
    B = complement.T * Qe * complement - q * mp.eye(N)
    odd_shifted = Qo - q * mp.eye(N)
    even_values, _ = mp.eigsy(B)
    odd_values, _ = mp.eigsy(odd_shifted)
    if not even_values[0] > 0:
        raise ReplayError("reconstructed raw-q even-complement gap is nonpositive")
    if not odd_values[0] > 0:
        raise ReplayError("reconstructed raw-q odd-sector gap is nonpositive")

    regularized = B + residual * mp.eye(N)
    regularized_inverse = _inverse(regularized)
    S = residual * regularized_inverse
    K_full = time_band_analytic_full(N, L, T)
    K = complement.T * (even.T * K_full * even) * complement
    soft_trace = _trace(S * K)
    ridge_energy = _dot(b, regularized_inverse, b)

    constant = mp.matrix(N + 1, 1)
    constant[0] = 1
    moment = complement.T * constant
    moment /= _norm(moment)
    high = _orthogonal_complement(moment)
    high_block = high.T * regularized * high
    coupling = high.T * regularized * moment
    schur = _dot(moment, regularized, moment) - _dot(
        coupling, _inverse(high_block), coupling
    )
    if not schur > 0:
        raise ReplayError("reconstructed regularized Schur complement is nonpositive")
    P = moment * moment.T
    Hh = mp.eye(N) - P
    low_soft = residual / schur
    high_time = _trace(Hh * K * Hh)
    lhs = mp.sqrt(soft_trace)
    rhs = mp.sqrt(low_soft) + mp.sqrt(high_time)
    K_values, _ = mp.eigsy((K + K.T) / 2)
    return {
        "q": q,
        "r": residual,
        "b": b,
        "B": B,
        "odd_shifted": odd_shifted,
        "even_gap_at_q": even_values[0],
        "odd_gap_at_q": odd_values[0],
        "S": S,
        "K": K,
        "K_min": K_values[0],
        "K_max": K_values[-1],
        "K_hermitian_defect": _max_abs(K - K.T),
        "ridge_energy": ridge_energy,
        "ridge_slack": residual - ridge_energy,
        "soft_trace": soft_trace,
        "scaled_soft_trace": L ** mp.mpf("1.5") * soft_trace,
        "anchor_squared_soft_trace": projected_norm ** 2 * soft_trace,
        "moment": moment,
        "P": P,
        "schur": schur,
        "low_soft": low_soft,
        "high_time": high_time,
        "splice_lhs": lhs,
        "splice_rhs": rhs,
        "splice_slack": rhs - lhs,
    }


def validate_contract(payload: dict[str, Any]) -> None:
    _reject_binary64_recursive(payload)
    _require_exact_keys(payload, TOP_LEVEL_KEYS, "top-level")
    if payload.get("schema") != "xi-prolate-residual-ridged-fixed-window-pilot-v1":
        raise ReplayError("wrong pilot schema")
    if payload.get("terminal_state") != "P0_INVALIDATED":
        raise ReplayError("claim/state promotion rejected")
    if payload.get("claim_class") != "DIAGNOSTIC" or payload.get("analytic_uniform_claim") is not False:
        raise ReplayError("only a finite diagnostic claim is allowed")
    inputs = _require_exact_keys(
        payload.get("inputs"),
        {
            "lambda",
            "N",
            "T",
            "precision_decimal_digits",
            "prolate_even_legendre_basis_size",
            "L",
        },
        "inputs",
    )
    lam = _exact_positive_text(inputs.get("lambda"), "lambda")
    T = _exact_positive_text(inputs.get("T"), "T")
    if lam <= 1:
        raise ReplayError("lambda must exceed one")
    if T != 1:
        raise ReplayError("the fixed-window contract requires exact T=1")
    _mp_text(inputs.get("L"), "inputs.L")
    for name, lower in (
        ("N", 1),
        ("precision_decimal_digits", 30),
        ("prolate_even_legendre_basis_size", 8),
    ):
        value = inputs.get(name)
        if not isinstance(value, int) or isinstance(value, bool) or value < lower:
            raise ReplayError(f"invalid exact integer input {name}")

    required = {
        "Fourier_sign": FOURIER_CONVENTION,
        "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension",
        "logarithmic_interval_centered": "[-L/2,L/2] with Lebesgue measure",
        "inversion_reflection_included": True,
        "prime_power_cutoff": "n<=lambda^2 inclusive",
        "prime_block_sign": "minus",
        "prolate_normalization": "source_limit_h",
        "locked_transform_limit": "Xi/4",
    }
    conventions = _require_exact_keys(
        payload.get("locked_conventions"), set(required), "locked conventions"
    )
    for key, expected in required.items():
        if conventions.get(key) != expected:
            raise ReplayError(f"locked convention mismatch: {key}")
    required_provenance = {
        "uses_assumed_real_zeta_zeros": False,
        "assumes_global_weil_positivity": False,
        "reads_cached_matrix_or_eigensystem": False,
        "parameter_ingestion": "exact text; no binary64",
        "matrix_assembly": "direct source integral path",
        "state_assembly": "source Legendre recurrence and direct arithmetic projection",
        "time_band_assembly": "arbitrary-precision evaluation-vector quadrature",
    }
    provenance = _require_exact_keys(
        payload.get("provenance"), set(required_provenance), "provenance"
    )
    for key, expected in required_provenance.items():
        if provenance.get(key) != expected:
            raise ReplayError(f"provenance mismatch: {key}")
    normalization = _require_exact_keys(
        payload.get("normalization"),
        {
            "a4",
            "a0_lambda",
            "h_zero_integral_defect",
            "projected_state_norm",
            "projection_error",
            "unit_normalized_replacement_allowed",
        },
        "normalization",
    )
    if normalization.get("unit_normalized_replacement_allowed") is not False:
        raise ReplayError("unit-normalized source replacement rejected")
    for name in (
        "a4",
        "a0_lambda",
        "h_zero_integral_defect",
        "projected_state_norm",
        "projection_error",
    ):
        _mp_text(normalization.get(name), f"normalization.{name}")

    required_splice = {
        "declared_moment_space": PHYSICAL_MOMENT_DECLARATION,
        "schur_definition": PHYSICAL_SCHUR_DEFINITION,
        "inequality": PHYSICAL_SPLICE_INEQUALITY,
    }
    physical_splice = _require_exact_keys(
        payload.get("physical_splice"),
        set(required_splice) | {"moment_direction_even_complement"},
        "physical splice",
    )
    for key, expected in required_splice.items():
        if physical_splice.get(key) != expected:
            raise ReplayError(f"physical-splice declaration mismatch: {key}")
    if payload.get("limitations") != LIMITATIONS:
        raise ReplayError("diagnostic limitation declarations mismatch")
    expected_runtime = {
        "python": sys.version.split()[0],
        "mpmath": mp.__version__,
    }
    runtime = _require_exact_keys(
        payload.get("runtime"), {"python", "mpmath"}, "runtime"
    )
    if runtime != expected_runtime:
        raise ReplayError("arithmetic runtime version mismatch")

    expected_dependencies = _dependency_hashes()
    if payload.get("dependency_sha256") != expected_dependencies:
        raise ReplayError("dependency hash mismatch")
    inventory = _require_exact_keys(
        payload.get("source_inventory"), {"modes", "prime_powers"}, "source inventory"
    )
    expected_modes = list(range(-inputs["N"], inputs["N"] + 1))
    if inventory.get("modes") != expected_modes:
        raise ReplayError("mode inventory mismatch")
    expected_terms = lambda_terms(lambda_squared_floor_exact(inputs["lambda"]))
    supplied_terms = inventory.get("prime_powers")
    if (
        not isinstance(supplied_terms, list)
        or len(supplied_terms) != len(expected_terms)
        or not all(
            isinstance(item, dict) and set(item) == {"n", "von_mangoldt"}
            for item in supplied_terms
        )
        or [item["n"] for item in supplied_terms] != [n for n, _ in expected_terms]
    ):
        raise ReplayError("inclusive prime-power inventory mismatch")
    for item in supplied_terms:
        _mp_text(item["von_mangoldt"], f"prime_power_{item['n']}.von_mangoldt")

    hashes = payload.get("raw_value_sha256")
    if not isinstance(hashes, dict):
        raise ReplayError("missing raw-value hashes")
    expected_hash_values: dict[str, Any] = {}
    for section, expected_keys in (
        ("source_blocks", SOURCE_BLOCK_KEYS),
        ("raw_values", RAW_VALUE_KEYS),
    ):
        values = _require_exact_keys(payload.get(section), expected_keys, section)
        for name, value in values.items():
            expected_hash_values[f"{section}.{name}"] = value
    scalars = _require_exact_keys(payload.get("scalars"), SCALAR_KEYS, "scalars")
    for name, value in scalars.items():
        _mp_text(value, f"scalars.{name}")
        expected_hash_values[f"scalars.{name}"] = value
    structural = _require_exact_keys(
        payload.get("matrix_structural_values"),
        {
            "hermitian_defect",
            "inversion_commutator_defect",
            "inversion_even_state_defect",
        },
        "matrix structural values",
    )
    for name, value in structural.items():
        _mp_text(value, f"matrix_structural_values.{name}")
        expected_hash_values[f"matrix_structural_values.{name}"] = value
    for name in (
        "a4",
        "a0_lambda",
        "h_zero_integral_defect",
        "projected_state_norm",
        "projection_error",
    ):
        expected_hash_values[f"normalization.{name}"] = normalization[name]
    expected_hash_values.update(
        {
            "inputs.L": inputs.get("L"),
            "source_inventory.modes": inventory.get("modes"),
            "source_inventory.prime_powers": inventory.get("prime_powers"),
            "residual_vector_even_complement_before_norm": payload.get(
                "residual_vector_even_complement_before_norm"
            ),
            "time_band_quadrature_nodes": payload.get(
                "time_band_quadrature_nodes"
            ),
            "physical_splice.moment_direction_even_complement": physical_splice.get(
                "moment_direction_even_complement"
            ),
            "runtime.python": runtime["python"],
            "runtime.mpmath": runtime["mpmath"],
        }
    )
    if set(hashes) != set(expected_hash_values):
        raise ReplayError("raw-value hash inventory mismatch")
    for key, value in expected_hash_values.items():
        if hashes[key] != _raw_hash(value):
            raise ReplayError(f"raw-value hash mismatch: {key}")


def _matrix_from_text(raw: Any, name: str) -> mp.matrix:
    if not isinstance(raw, list) or not raw or not all(isinstance(row, list) for row in raw):
        raise ReplayError(f"invalid matrix {name}")
    width = len(raw[0])
    if width == 0 or any(len(row) != width for row in raw):
        raise ReplayError(f"ragged matrix {name}")
    out = mp.matrix(len(raw), width)
    for i, row in enumerate(raw):
        for j, value in enumerate(row):
            out[i, j] = _mp_text(value, f"{name}[{i},{j}]")
    return out


def _vector_from_text(raw: Any, name: str) -> mp.matrix:
    if not isinstance(raw, list) or not raw:
        raise ReplayError(f"invalid vector {name}")
    return mp.matrix([_mp_text(value, f"{name}[{i}]") for i, value in enumerate(raw)])


def _scaled_difference(a: mp.mpf, b: mp.mpf) -> mp.mpf:
    return abs(a - b) / max(mp.mpf("1"), abs(a), abs(b))


def _scaled_matrix_difference(raw: Any, actual: mp.matrix, name: str) -> mp.mpf:
    supplied = _matrix_from_text(raw, name)
    if supplied.rows != actual.rows or supplied.cols != actual.cols:
        return mp.inf
    return max(
        (
            _scaled_difference(supplied[i, j], actual[i, j])
            for i in range(actual.rows)
            for j in range(actual.cols)
        ),
        default=mp.mpf("0"),
    )


def _scaled_vector_difference(raw: Any, actual: mp.matrix, name: str) -> mp.mpf:
    supplied = _vector_from_text(raw, name)
    if supplied.rows != actual.rows:
        return mp.inf
    return max(
        (_scaled_difference(supplied[i], actual[i]) for i in range(actual.rows)),
        default=mp.mpf("0"),
    )


def _scaled_list_difference(raw: Any, actual: list[mp.mpf], name: str) -> mp.mpf:
    if not isinstance(raw, list) or len(raw) != len(actual):
        return mp.inf
    supplied = [_mp_text(value, f"{name}[{index}]") for index, value in enumerate(raw)]
    return max(
        (_scaled_difference(left, right) for left, right in zip(supplied, actual)),
        default=mp.mpf("0"),
    )


def replay_payload(payload: dict[str, Any], producer_sha256: str = "in_memory") -> dict[str, Any]:
    validate_contract(payload)
    inputs = payload["inputs"]
    dps = inputs["precision_decimal_digits"]
    mp.mp.dps = dps
    lambda_text = inputs["lambda"]
    N = inputs["N"]
    basis_size = inputs["prolate_even_legendre_basis_size"]
    T_fraction = Fraction(inputs["T"])
    T = mp.mpf(T_fraction.numerator) / T_fraction.denominator
    lam = mp.mpf(Fraction(lambda_text).numerator) / Fraction(lambda_text).denominator
    L = 2 * mp.log(lam)

    pole, arch, prime, Q, terms = matrix_from_source(lambda_text, N, dps)
    prolate = prolate_quadrature(lambda_text, basis_size, dps)
    h = H(lambda_text, prolate[0], prolate[1])
    kappa, coefficients, projection_error, projected_norm, _, _ = projection(h, N)
    metrics = _independent_metrics(Q, kappa, projected_norm, N, L, T)
    J = _inversion(N)
    h_zero_integral = abs(
        h.a4 * h.integral(h.h4) - h.a0 * h.integral(h.h0)
    )

    source = payload["source_blocks"]
    raw = payload["raw_values"]
    scalars = payload["scalars"]
    defects: dict[str, mp.mpf] = {
        "L": _scaled_difference(_mp_text(inputs["L"], "inputs.L"), L),
        "pole_matrix": _scaled_matrix_difference(source["pole"], pole, "source_blocks.pole"),
        "arch_matrix": _scaled_matrix_difference(
            source["archimedean_unsigned"], arch, "source_blocks.archimedean_unsigned"
        ),
        "prime_matrix": _scaled_matrix_difference(
            source["prime_unsigned"], prime, "source_blocks.prime_unsigned"
        ),
        "Q_matrix": _scaled_matrix_difference(
            source["Q_equals_pole_minus_arch_minus_prime"],
            Q,
            "source_blocks.Q_equals_pole_minus_arch_minus_prime",
        ),
        "kappa": _scaled_vector_difference(raw["kappa_modes_minusN_to_N"], kappa, "raw_values.kappa"),
        "state_coefficients": _scaled_vector_difference(
            raw["projected_state_coefficients_modes_minusN_to_N"],
            coefficients,
            "raw_values.state_coefficients",
        ),
        "B": _scaled_matrix_difference(raw["B_even_complement_at_q"], metrics["B"], "raw_values.B"),
        "odd_shifted": _scaled_matrix_difference(
            raw["Q_odd_minus_qI"], metrics["odd_shifted"], "raw_values.odd_shifted"
        ),
        "K_T": _scaled_matrix_difference(raw["K_T_even_complement"], metrics["K"], "raw_values.K_T"),
        "S_r": _scaled_matrix_difference(raw["S_r"], metrics["S"], "raw_values.S_r"),
        "moment_projector": _scaled_matrix_difference(
            raw["moment_projector"], metrics["P"], "raw_values.moment_projector"
        ),
        "residual_vector": _scaled_vector_difference(
            payload["residual_vector_even_complement_before_norm"],
            metrics["b"],
            "residual_vector",
        ),
        "moment_direction": _scaled_vector_difference(
            payload["physical_splice"]["moment_direction_even_complement"],
            metrics["moment"],
            "moment_direction",
        ),
        "time_band_quadrature_nodes": _scaled_list_difference(
            payload.get("time_band_quadrature_nodes"),
            _quadrature_nodes(N, L, T),
            "time_band_quadrature_nodes",
        ),
    }
    scalar_map = {
        "q": "q",
        "r": "r",
        "even_gap_at_q": "even_gap_at_q",
        "odd_gap_at_q": "odd_gap_at_q",
        "ridge_energy": "ridge_energy",
        "ridge_slack_r_minus_energy": "ridge_slack",
        "soft_trace": "soft_trace",
        "scaled_soft_trace_L_3_over_2": "scaled_soft_trace",
        "anchor_squared_soft_trace": "anchor_squared_soft_trace",
        "K_eigenvalue_min": "K_min",
        "K_eigenvalue_max": "K_max",
        "K_hermitian_defect": "K_hermitian_defect",
        "regularized_physical_schur": "schur",
        "physical_low_soft_mass": "low_soft",
        "high_time_band_mass": "high_time",
        "splice_lhs": "splice_lhs",
        "splice_rhs": "splice_rhs",
        "splice_slack": "splice_slack",
    }
    for supplied_name, actual_name in scalar_map.items():
        defects[supplied_name] = _scaled_difference(
            _mp_text(scalars[supplied_name], f"scalars.{supplied_name}"),
            metrics[actual_name],
        )
    defects["a0_lambda"] = _scaled_difference(
        _mp_text(payload["normalization"]["a0_lambda"], "normalization.a0_lambda"),
        h.a0,
    )
    defects["a4"] = _scaled_difference(
        _mp_text(payload["normalization"]["a4"], "normalization.a4"),
        h.a4,
    )
    defects["h_zero_integral_defect"] = _scaled_difference(
        _mp_text(
            payload["normalization"]["h_zero_integral_defect"],
            "normalization.h_zero_integral_defect",
        ),
        h_zero_integral,
    )
    defects["projected_state_norm"] = _scaled_difference(
        _mp_text(payload["normalization"]["projected_state_norm"], "normalization.projected_state_norm"),
        projected_norm,
    )
    defects["projection_error"] = _scaled_difference(
        _mp_text(payload["normalization"]["projection_error"], "normalization.projection_error"),
        projection_error,
    )
    structural = payload.get("matrix_structural_values", {})
    reconstructed_structural = {
        "hermitian_defect": _max_abs(Q - Q.T),
        "inversion_commutator_defect": _max_abs(Q * J - J * Q),
        "inversion_even_state_defect": _norm(J * kappa - kappa),
    }
    for name, actual in reconstructed_structural.items():
        defects[name] = _scaled_difference(
            _mp_text(structural.get(name), f"matrix_structural_values.{name}"),
            actual,
        )
    supplied_inventory = payload["source_inventory"]["prime_powers"]
    for index, ((n, value), item) in enumerate(zip(terms, supplied_inventory)):
        if item["n"] != n:
            defects[f"prime_power_n_{index}"] = mp.inf
        defects[f"von_mangoldt_{n}"] = _scaled_difference(
            _mp_text(item["von_mangoldt"], f"prime_power_{n}.von_mangoldt"), value
        )

    tolerance = mp.power(10, -max(12, dps // 3))
    independent_gates = {
        "even_complement_at_q_positive": bool(metrics["even_gap_at_q"] > 0),
        "odd_sector_at_q_positive": bool(metrics["odd_gap_at_q"] > 0),
        "K_T_hermitian": bool(metrics["K_hermitian_defect"] <= tolerance),
        "K_T_positive_contraction": bool(
            metrics["K_min"] >= -tolerance and metrics["K_max"] <= 1 + tolerance
        ),
        "ridge_enclosure": bool(metrics["ridge_slack"] >= -tolerance),
        "physical_splice_inequality": bool(metrics["splice_slack"] >= -tolerance),
    }
    agrees = bool(
        all(value <= tolerance for value in defects.values())
        and all(independent_gates.values())
    )
    result = {
        "schema": "xi-prolate-residual-ridged-fixed-window-replay-v1",
        "terminal_state": "P0_INVALIDATED",
        "claim_class": "DIAGNOSTIC",
        "analytic_uniform_claim": False,
        "producer_sha256": producer_sha256,
        "replay_agrees": agrees,
        "tolerance": mp.nstr(tolerance, dps),
        "max_scaled_defect": mp.nstr(max(defects.values()), dps),
        "scaled_defects": {name: mp.nstr(value, dps) for name, value in defects.items()},
        "independently_reconstructed_gates": independent_gates,
        "independent_raw_values": {
            "q": mp.nstr(metrics["q"], dps),
            "r": mp.nstr(metrics["r"], dps),
            "even_gap_at_q": mp.nstr(metrics["even_gap_at_q"], dps),
            "odd_gap_at_q": mp.nstr(metrics["odd_gap_at_q"], dps),
            "soft_trace": mp.nstr(metrics["soft_trace"], dps),
            "scaled_soft_trace_L_3_over_2": mp.nstr(metrics["scaled_soft_trace"], dps),
            "splice_slack": mp.nstr(metrics["splice_slack"], dps),
            "K_eigenvalue_min": mp.nstr(metrics["K_min"], dps),
            "K_eigenvalue_max": mp.nstr(metrics["K_max"], dps),
        },
        "formula_paths": {
            "matrix": "closed-pole plus clean archimedean source quadrature and independent factor inventory",
            "state": "differential-form prolate matrix plus independent arithmetic projection",
            "time_band": "closed Si/Ci antiderivatives; no producer quadrature matrix read",
        },
        "producer_values_used_only_for_comparison": True,
        "shared_arithmetic_library_limitation": (
            "producer and verifier both use mpmath transcendental arithmetic; "
            "their matrix, state, and time-band formula trees are independent"
        ),
        "dependency_sha256": _dependency_hashes(),
        "runtime": {
            "python": sys.version.split()[0],
            "mpmath": mp.__version__,
        },
    }
    if not agrees:
        raise ReplayError("independent replay disagreement or reconstructed gate failure")
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("producer", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    raw = args.producer.read_bytes()
    payload = strict_json_loads(raw)
    result = replay_payload(payload, _sha256_bytes(raw))
    text = json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
