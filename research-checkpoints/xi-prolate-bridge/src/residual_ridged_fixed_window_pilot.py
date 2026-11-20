#!/usr/bin/env python3
"""Small source-assembled residual-ridged fixed-window pilot.

This is a finite arbitrary-precision diagnostic.  It rebuilds the Weil
matrix and the source-normalized projected prolate state from source
parameters, works at the raw Rayleigh shift, and evaluates the positive
soft overlap

    tr(r (B+r I)^(-1) K_T).

The time-band matrix is assembled here by direct quadrature of Fourier
evaluation-vector outer products.  The independent replay uses closed
antiderivatives instead.  No zero table, cached matrix, cached eigensystem,
or global Weil-positivity premise is used.
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

from prolate_state import projected_even_state, source_combination
from weil_matrix import blocks_direct, inversion, max_abs, parse_decimal


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


class PilotInputError(ValueError):
    """Fail-closed input or source-gate error."""


def _sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def dependency_hashes() -> dict[str, str]:
    return {name: _sha256_file(ROOT / name) for name in DEPENDENCIES}


def parse_rational_text(value: str, name: str) -> mp.mpf:
    """Parse an exact decimal/rational text without a binary64 transit."""
    if not isinstance(value, str):
        raise TypeError(f"{name} must be exact text; binary64 is forbidden")
    try:
        rational = Fraction(value)
    except (ValueError, ZeroDivisionError) as exc:
        raise PilotInputError(f"invalid exact {name} text") from exc
    if rational <= 0:
        raise PilotInputError(f"{name} must be positive")
    return mp.mpf(rational.numerator) / rational.denominator


def _dot(x: mp.matrix, A: mp.matrix, y: mp.matrix) -> mp.mpf:
    return (x.T * A * y)[0]


def _norm(x: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(x[i]) ** 2 for i in range(x.rows)))


def _trace(A: mp.matrix) -> mp.mpf:
    return mp.fsum(A[i, i] for i in range(min(A.rows, A.cols)))


def _orthogonal_complement(unit: mp.matrix) -> mp.matrix:
    """Householder columns spanning the orthogonal complement of a unit vector."""
    n = unit.rows
    if n < 2:
        raise PilotInputError("an orthogonal complement requires dimension at least two")
    e0 = mp.matrix(n, 1)
    e0[0] = 1
    sign = 1 if unit[0] >= 0 else -1
    v = unit + sign * e0
    H = mp.eye(n) - 2 * (v * v.T) / _dot(v, mp.eye(n), v)
    return H[:, 1:n]


def sector_bases(N: int) -> tuple[mp.matrix, mp.matrix]:
    d = 2 * N + 1
    even = mp.matrix(d, N + 1)
    odd = mp.matrix(d, N)
    even[N, 0] = 1
    for n in range(1, N + 1):
        even[N - n, n] = 1 / mp.sqrt(2)
        even[N + n, n] = 1 / mp.sqrt(2)
        odd[N + n, n - 1] = 1 / mp.sqrt(2)
        odd[N - n, n - 1] = -1 / mp.sqrt(2)
    return even, odd


def centered_mode_transform(n: int, t: mp.mpf, L: mp.mpf) -> mp.mpf:
    """Transform of the locked centered Fourier mode.

    If ``y=x-L/2``, the source basis is
    ``(-1)^n exp(2*pi*i*n*y/L)/sqrt(L)``.  Its negative-sign Fourier
    transform is the real entire function below.
    """
    t = mp.mpf(t)
    omega = 2 * mp.pi * n / L
    if t == omega:
        return mp.power(-1, n) * mp.sqrt(L)
    return 2 * mp.sin(t * L / 2) / (mp.sqrt(L) * (t - omega))


def _quadrature_nodes(N: int, L: mp.mpf, T: mp.mpf) -> list[mp.mpf]:
    nodes = [-T, mp.mpf("0"), T]
    for n in range(-N, N + 1):
        omega = 2 * mp.pi * n / L
        if -T < omega < T:
            nodes.append(omega)
    nodes.sort()
    unique: list[mp.mpf] = []
    for value in nodes:
        if not unique or value != unique[-1]:
            unique.append(value)
    return unique


def time_band_quadrature(
    N: int,
    L: mp.mpf,
    T: mp.mpf,
    even_complement: mp.matrix,
) -> tuple[mp.matrix, list[mp.mpf]]:
    """Assemble ``K_T`` from evaluation-vector outer-product quadrature."""
    even, _ = sector_bases(N)
    modes = list(range(-N, N + 1))
    nodes = _quadrature_nodes(N, L, T)

    def evaluation(t: mp.mpf) -> mp.matrix:
        full = mp.matrix([centered_mode_transform(n, t, L) for n in modes])
        return even_complement.T * (even.T * full)

    dimension = even_complement.cols
    K = mp.matrix(dimension)
    for i in range(dimension):
        for j in range(i, dimension):
            value = mp.fsum(
                mp.quad(
                    lambda t, i=i, j=j: evaluation(t)[i] * evaluation(t)[j],
                    [left, right],
                )
                for left, right in zip(nodes[:-1], nodes[1:])
            ) / (2 * mp.pi)
            K[i, j] = value
            K[j, i] = value
    return K, nodes


def require_positive_source_gates(B: mp.matrix, odd_shifted: mp.matrix) -> tuple[mp.mpf, mp.mpf]:
    """Reject a raw-q pilot unless both required finite source gates are strict."""
    if B.rows == 0 or odd_shifted.rows == 0:
        raise PilotInputError("both inversion sectors must be nonempty")
    even_values, _ = mp.eigsy(B)
    odd_values, _ = mp.eigsy(odd_shifted)
    even_floor = even_values[0]
    odd_floor = odd_values[0]
    if not even_floor > 0:
        raise PilotInputError("nonpositive raw-q even-complement gap")
    if not odd_floor > 0:
        raise PilotInputError("nonpositive raw-q odd-sector gap")
    return even_floor, odd_floor


def _matrix_inverse(A: mp.matrix) -> mp.matrix:
    columns = []
    for j in range(A.rows):
        e = mp.matrix(A.rows, 1)
        e[j] = 1
        columns.append(mp.lu_solve(A, e))
    out = mp.matrix(A.rows)
    for j, column in enumerate(columns):
        out[:, j] = column
    return out


def residual_ridged_metrics(
    Q: mp.matrix,
    kappa: mp.matrix,
    projected_norm: mp.mpf,
    N: int,
    L: mp.mpf,
    T: mp.mpf,
) -> dict[str, Any]:
    """Compute the raw-q complement, soft trace, and rank-one moment splice."""
    even, odd = sector_bases(N)
    kappa_even = even.T * kappa
    even_complement = _orthogonal_complement(kappa_even)
    Q_even = even.T * Q * even
    Q_odd = odd.T * Q * odd
    q = _dot(kappa, Q, kappa)
    b = even_complement.T * (Q_even * kappa_even - q * kappa_even)
    residual = _norm(b)
    if not residual > 0:
        raise PilotInputError("the residual ridge requires a strictly positive residual")
    B = even_complement.T * Q_even * even_complement - q * mp.eye(N)
    odd_shifted = Q_odd - q * mp.eye(N)
    even_gap, odd_gap = require_positive_source_gates(B, odd_shifted)

    regularized = B + residual * mp.eye(N)
    regularized_inverse = _matrix_inverse(regularized)
    S = residual * regularized_inverse
    K, quadrature_nodes = time_band_quadrature(N, L, T, even_complement)
    soft_trace = _trace(S * K)
    ridge_energy = _dot(b, regularized_inverse, b)

    # The declared physical moment space is the projection of the centered
    # constant Fourier mode into kappa^perp.  The underlying constant target
    # is source-independent; its projection is fixed once kappa is constructed,
    # before B or K_T is diagonalized.
    constant_even = mp.matrix(N + 1, 1)
    constant_even[0] = 1
    moment = even_complement.T * constant_even
    moment_norm = _norm(moment)
    if not moment_norm > 0:
        raise PilotInputError("projected constant moment direction vanished")
    moment /= moment_norm
    moment_high = _orthogonal_complement(moment)
    high_block = moment_high.T * regularized * moment_high
    coupling = moment_high.T * regularized * moment
    schur = _dot(moment, regularized, moment) - _dot(
        coupling, _matrix_inverse(high_block), coupling
    )
    if not schur > 0:
        raise PilotInputError("regularized physical Schur complement is nonpositive")
    physical_low_soft = residual / schur
    P = moment * moment.T
    H = mp.eye(N) - P
    high_time_band = _trace(H * K * H)
    splice_lhs = mp.sqrt(soft_trace)
    splice_rhs = mp.sqrt(physical_low_soft) + mp.sqrt(high_time_band)
    splice_slack = splice_rhs - splice_lhs

    K_values, _ = mp.eigsy((K + K.T) / 2)
    return {
        "q": q,
        "residual_vector_even_complement": b,
        "r": residual,
        "B": B,
        "odd_shifted": odd_shifted,
        "even_gap_at_q": even_gap,
        "odd_gap_at_q": odd_gap,
        "regularized_inverse": regularized_inverse,
        "S": S,
        "K": K,
        "K_eigenvalue_min": K_values[0],
        "K_eigenvalue_max": K_values[-1],
        "K_hermitian_defect": max_abs(K - K.T),
        "quadrature_nodes": quadrature_nodes,
        "ridge_energy": ridge_energy,
        "ridge_slack_r_minus_energy": residual - ridge_energy,
        "soft_trace": soft_trace,
        "scaled_soft_trace_L_3_over_2": L ** mp.mpf("1.5") * soft_trace,
        "anchor_squared_soft_trace": projected_norm ** 2 * soft_trace,
        "moment_direction": moment,
        "moment_projector": P,
        "regularized_physical_schur": schur,
        "physical_low_soft_mass": physical_low_soft,
        "high_time_band_mass": high_time_band,
        "splice_lhs": splice_lhs,
        "splice_rhs": splice_rhs,
        "splice_slack": splice_slack,
    }


def _serialize_real(value: mp.mpf, digits: int) -> str:
    return mp.nstr(mp.mpf(value), digits)


def _serialize_vector(vector: mp.matrix, digits: int) -> list[str]:
    return [_serialize_real(vector[i], digits) for i in range(vector.rows)]


def _serialize_matrix(matrix: mp.matrix, digits: int) -> list[list[str]]:
    return [
        [_serialize_real(matrix[i, j], digits) for j in range(matrix.cols)]
        for i in range(matrix.rows)
    ]


def _raw_hash(value: Any) -> str:
    payload = json.dumps(value, separators=(",", ":"), sort_keys=True).encode("ascii")
    return hashlib.sha256(payload).hexdigest()


def produce_pilot(
    lambda_text: str,
    N: int,
    T_text: str,
    dps: int,
    prolate_basis_size: int,
) -> dict[str, Any]:
    if not isinstance(lambda_text, str):
        raise TypeError("lambda must be exact decimal text; binary64 is forbidden")
    if not isinstance(T_text, str):
        raise TypeError("T must be exact rational text; binary64 is forbidden")
    if not isinstance(N, int) or isinstance(N, bool) or N < 1:
        raise PilotInputError("N must be an integer at least one")
    if not isinstance(dps, int) or isinstance(dps, bool) or dps < 30:
        raise PilotInputError("precision must be an integer of at least 30 decimal digits")
    if not isinstance(prolate_basis_size, int) or isinstance(prolate_basis_size, bool) or prolate_basis_size < 8:
        raise PilotInputError("prolate basis size must be an integer at least eight")

    mp.mp.dps = dps
    lam = parse_decimal(lambda_text)
    if lam <= 1:
        raise PilotInputError("lambda must exceed one")
    T = parse_rational_text(T_text, "T")
    if Fraction(T_text) != 1:
        raise PilotInputError("this fixed-window pilot requires exact T=1")
    L = 2 * mp.log(lam)

    modes, terms, pole, arch, prime, Q = blocks_direct(lambda_text, N, dps)
    J = inversion(N)
    h = source_combination(lambda_text, prolate_basis_size, dps, "recurrence")
    projection = projected_even_state(h, N)
    kappa = projection["kappa"]
    metrics = residual_ridged_metrics(
        Q, kappa, projection["projected_norm"], N, L, T
    )

    source_blocks = {
        "pole": _serialize_matrix(pole, dps),
        "archimedean_unsigned": _serialize_matrix(arch, dps),
        "prime_unsigned": _serialize_matrix(prime, dps),
        "Q_equals_pole_minus_arch_minus_prime": _serialize_matrix(Q, dps),
    }
    raw_values = {
        "kappa_modes_minusN_to_N": _serialize_vector(kappa, dps),
        "projected_state_coefficients_modes_minusN_to_N": _serialize_vector(
            projection["coefficients"], dps
        ),
        "B_even_complement_at_q": _serialize_matrix(metrics["B"], dps),
        "Q_odd_minus_qI": _serialize_matrix(metrics["odd_shifted"], dps),
        "K_T_even_complement": _serialize_matrix(metrics["K"], dps),
        "S_r": _serialize_matrix(metrics["S"], dps),
        "moment_projector": _serialize_matrix(metrics["moment_projector"], dps),
    }
    scalar_values = {
        "q": _serialize_real(metrics["q"], dps),
        "r": _serialize_real(metrics["r"], dps),
        "even_gap_at_q": _serialize_real(metrics["even_gap_at_q"], dps),
        "odd_gap_at_q": _serialize_real(metrics["odd_gap_at_q"], dps),
        "ridge_energy": _serialize_real(metrics["ridge_energy"], dps),
        "ridge_slack_r_minus_energy": _serialize_real(
            metrics["ridge_slack_r_minus_energy"], dps
        ),
        "soft_trace": _serialize_real(metrics["soft_trace"], dps),
        "scaled_soft_trace_L_3_over_2": _serialize_real(
            metrics["scaled_soft_trace_L_3_over_2"], dps
        ),
        "anchor_squared_soft_trace": _serialize_real(
            metrics["anchor_squared_soft_trace"], dps
        ),
        "K_eigenvalue_min": _serialize_real(metrics["K_eigenvalue_min"], dps),
        "K_eigenvalue_max": _serialize_real(metrics["K_eigenvalue_max"], dps),
        "K_hermitian_defect": _serialize_real(metrics["K_hermitian_defect"], dps),
        "regularized_physical_schur": _serialize_real(
            metrics["regularized_physical_schur"], dps
        ),
        "physical_low_soft_mass": _serialize_real(metrics["physical_low_soft_mass"], dps),
        "high_time_band_mass": _serialize_real(metrics["high_time_band_mass"], dps),
        "splice_lhs": _serialize_real(metrics["splice_lhs"], dps),
        "splice_rhs": _serialize_real(metrics["splice_rhs"], dps),
        "splice_slack": _serialize_real(metrics["splice_slack"], dps),
    }
    input_L = _serialize_real(L, dps)
    source_inventory = {
        "modes": modes,
        "prime_powers": [
            {"n": n, "von_mangoldt": _serialize_real(value, dps)}
            for n, value in terms
        ],
    }
    normalization_values = {
        "a4": _serialize_real(h.a4, dps),
        "a0_lambda": _serialize_real(h.a0, dps),
        "h_zero_integral_defect": _serialize_real(abs(h.integral()), dps),
        "projected_state_norm": _serialize_real(projection["projected_norm"], dps),
        "projection_error": _serialize_real(projection["projection_error"], dps),
        "unit_normalized_replacement_allowed": False,
    }
    structural_values = {
        "hermitian_defect": _serialize_real(max_abs(Q - Q.T), dps),
        "inversion_commutator_defect": _serialize_real(max_abs(Q * J - J * Q), dps),
        "inversion_even_state_defect": _serialize_real(_norm(J * kappa - kappa), dps),
    }
    residual_vector = _serialize_vector(
        metrics["residual_vector_even_complement"], dps
    )
    quadrature_nodes = [
        _serialize_real(value, dps) for value in metrics["quadrature_nodes"]
    ]
    moment_direction = _serialize_vector(metrics["moment_direction"], dps)
    runtime_values = {
        "python": sys.version.split()[0],
        "mpmath": mp.__version__,
    }
    hash_values = {f"source_blocks.{name}": _raw_hash(value) for name, value in source_blocks.items()}
    hash_values.update({f"raw_values.{name}": _raw_hash(value) for name, value in raw_values.items()})
    hash_values.update({f"scalars.{name}": _raw_hash(value) for name, value in scalar_values.items()})
    hash_values.update(
        {
            "inputs.L": _raw_hash(input_L),
            "source_inventory.modes": _raw_hash(source_inventory["modes"]),
            "source_inventory.prime_powers": _raw_hash(
                source_inventory["prime_powers"]
            ),
            "residual_vector_even_complement_before_norm": _raw_hash(
                residual_vector
            ),
            "time_band_quadrature_nodes": _raw_hash(quadrature_nodes),
            "physical_splice.moment_direction_even_complement": _raw_hash(
                moment_direction
            ),
            "runtime.python": _raw_hash(runtime_values["python"]),
            "runtime.mpmath": _raw_hash(runtime_values["mpmath"]),
        }
    )
    hash_values.update(
        {
            f"normalization.{name}": _raw_hash(value)
            for name, value in normalization_values.items()
            if name != "unit_normalized_replacement_allowed"
        }
    )
    hash_values.update(
        {
            f"matrix_structural_values.{name}": _raw_hash(value)
            for name, value in structural_values.items()
        }
    )

    tolerance = mp.power(10, -max(12, dps // 3))
    if max_abs(Q - Q.T) > tolerance or max_abs(Q * J - J * Q) > tolerance:
        raise PilotInputError("source matrix failed Hermitian/inversion regression")
    if metrics["K_hermitian_defect"] > tolerance:
        raise PilotInputError("K_T failed Hermitian regression")
    if metrics["K_eigenvalue_min"] < -tolerance or metrics["K_eigenvalue_max"] > 1 + tolerance:
        raise PilotInputError("K_T is not a positive contraction at working precision")
    if metrics["splice_slack"] < -tolerance:
        raise PilotInputError("physical splice inequality failed at working precision")

    return {
        "schema": "xi-prolate-residual-ridged-fixed-window-pilot-v1",
        "terminal_state": "P0_INVALIDATED",
        "claim_class": "DIAGNOSTIC",
        "analytic_uniform_claim": False,
        "inputs": {
            "lambda": lambda_text,
            "N": N,
            "T": T_text,
            "precision_decimal_digits": dps,
            "prolate_even_legendre_basis_size": prolate_basis_size,
            "L": input_L,
        },
        "locked_conventions": {
            "Fourier_sign": FOURIER_CONVENTION,
            "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension",
            "logarithmic_interval_centered": "[-L/2,L/2] with Lebesgue measure",
            "inversion_reflection_included": True,
            "prime_power_cutoff": "n<=lambda^2 inclusive",
            "prime_block_sign": "minus",
            "prolate_normalization": "source_limit_h",
            "locked_transform_limit": "Xi/4",
        },
        "provenance": {
            "uses_assumed_real_zeta_zeros": False,
            "assumes_global_weil_positivity": False,
            "reads_cached_matrix_or_eigensystem": False,
            "parameter_ingestion": "exact text; no binary64",
            "matrix_assembly": "direct source integral path",
            "state_assembly": "source Legendre recurrence and direct arithmetic projection",
            "time_band_assembly": "arbitrary-precision evaluation-vector quadrature",
        },
        "dependency_sha256": dependency_hashes(),
        "source_inventory": source_inventory,
        "normalization": normalization_values,
        "matrix_structural_values": structural_values,
        "source_blocks": source_blocks,
        "raw_values": raw_values,
        "raw_value_sha256": hash_values,
        "scalars": scalar_values,
        "residual_vector_even_complement_before_norm": residual_vector,
        "time_band_quadrature_nodes": quadrature_nodes,
        "physical_splice": {
            "declared_moment_space": PHYSICAL_MOMENT_DECLARATION,
            "moment_direction_even_complement": moment_direction,
            "schur_definition": PHYSICAL_SCHUR_DEFINITION,
            "inequality": PHYSICAL_SPLICE_INEQUALITY,
        },
        "limitations": LIMITATIONS,
        "runtime": runtime_values,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda", dest="lambda_text", required=True)
    parser.add_argument("--N", type=int, required=True)
    parser.add_argument("--T", dest="T_text", required=True)
    parser.add_argument("--dps", type=int, required=True)
    parser.add_argument("--prolate-basis-size", type=int, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    result = produce_pilot(
        args.lambda_text,
        args.N,
        args.T_text,
        args.dps,
        args.prolate_basis_size,
    )
    text = json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
