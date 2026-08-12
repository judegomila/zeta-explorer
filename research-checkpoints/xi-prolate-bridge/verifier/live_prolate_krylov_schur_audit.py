#!/usr/bin/env python3
"""Independent replay of the small live prolate/Krylov odd-Schur pilots.

This verifier deliberately ignores every cached eigenvalue, eigenvector,
Rayleigh value, residual, gap, and pass boolean in the input JSON.  It reads
only source-block decimal outputs and projected-state coefficient decimals,
checks their locked provenance, and reconstructs the finite linear algebra.

The lambda=2, N=4 Weil matrix is additionally reconstructed from the common
intersection of four independently assembled Arb ball outputs.  This
checkpoint-0.55 replay intentionally consumes the historical 35-digit point
coefficients, not the later checkpoint-0.56 state balls, so every
state-dependent result returned here remains a point diagnostic.
"""
from __future__ import annotations

import argparse
from decimal import Decimal, localcontext
from fractions import Fraction
import hashlib
import json
import mpmath as mp
from pathlib import Path
import re
from typing import Any


ROOT = Path(__file__).resolve().parents[1]

RAW_INPUTS = {
    3: (
        "artifacts/p0_schedule/raw/lambda2_N3_dps35.json",
        "6d4cff4da4d081e8454449add7f5ee9e50fa46399c03c717dab91ef314c77d83",
    ),
    4: (
        "artifacts/p0_schedule/raw/lambda2_N4_dps35.json",
        "1e9a4dae2ef07c13f6eb0800522913ba61c8bbdd43b43e68eebe5d94bc470ee3",
    ),
}

BALL_INPUTS = {
    ("producer", 256): (
        "artifacts/p0_ball_pilots/lambda2_N4/producer_256bits.txt",
        "e47acba7e059ec955fe9f658c168ef3ecc1f1232852fda87cb39fab25ddff8bb",
    ),
    ("producer", 512): (
        "artifacts/p0_ball_pilots/lambda2_N4/producer_512bits.txt",
        "ac9924d834873af7b40be0fee3a10375977a873155cd673df8edb03d72a96e5c",
    ),
    ("verifier", 256): (
        "artifacts/p0_ball_pilots/lambda2_N4/verifier_256bits.txt",
        "69a18f3ea551252f0e0433d6210a66f73d8fa49ab21d8659faebd9ad2182cdbc",
    ),
    ("verifier", 512): (
        "artifacts/p0_ball_pilots/lambda2_N4/verifier_512bits.txt",
        "509b75876b3cb6025e18ec678498df27aa40fa9c31f6b14ebf10e6b20b0fc485",
    ),
}

VENDORED_SOURCE = (
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
)

ENTRY_RE = re.compile(r"^ENTRY (-?\d+) (-?\d+) Q \[([^ ]+) \+/- ([^\]]+)\]$")
PRODUCER_META_RE = re.compile(
    r"^META lambda=([^ ]+) N=(\d+) prec=(\d+) cutoff=(\d+) status=([^ ]+)$"
)
VERIFIER_META_RE = re.compile(
    r"^META lambda=([^ ]+) N=(\d+) prec=(\d+) cutoff=(\d+) path=([^ ]+)$"
)
DECIMAL_RE = re.compile(r"^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$")


class AuditError(ValueError):
    """Fail-closed input or reconstruction error."""


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _checked_path(root: Path, relative: str, expected_hash: str) -> Path:
    path = root / relative
    if not path.is_file():
        raise AuditError(f"missing locked input: {relative}")
    if _sha256(path) != expected_hash:
        raise AuditError(f"locked input hash mismatch: {relative}")
    return path


def _no_duplicate_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise AuditError(f"duplicate JSON key: {key}")
        result[key] = value
    return result


def _load_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=_no_duplicate_object)
    if not isinstance(value, dict):
        raise AuditError("pilot JSON root must be an object")
    return value


def _decimal_string(value: Any, label: str) -> Decimal:
    if not isinstance(value, str) or DECIMAL_RE.fullmatch(value) is None:
        raise AuditError(f"{label} must be a decimal string, never binary64")
    result = Decimal(value)
    if not result.is_finite():
        raise AuditError(f"{label} must be finite")
    return result


def _decimal_matrix(value: Any, size: int, label: str) -> list[list[Decimal]]:
    if not isinstance(value, list) or len(value) != size:
        raise AuditError(f"{label} has the wrong row count")
    result: list[list[Decimal]] = []
    for i, row in enumerate(value):
        if not isinstance(row, list) or len(row) != size:
            raise AuditError(f"{label}[{i}] has the wrong column count")
        result.append(
            [_decimal_string(entry, f"{label}[{i}][{j}]") for j, entry in enumerate(row)]
        )
    return result


def _max_decimal_defect(values: list[Decimal]) -> Decimal:
    return max((abs(value) for value in values), default=Decimal(0))


def _source_block_algebra(
    pole: list[list[Decimal]],
    arch: list[list[Decimal]],
    prime: list[list[Decimal]],
    cached_q: list[list[Decimal]],
    modes: list[int],
    N: int,
) -> tuple[list[list[Decimal]], Decimal, Decimal, Decimal]:
    """Replay the signed block and source-Cauchy formulas at wide precision."""
    size = len(modes)
    with localcontext() as context:
        context.prec = 100
        combined = [
            [pole[i][j] - arch[i][j] - prime[i][j] for j in range(size)]
            for i in range(size)
        ]
        formula_defect = _max_decimal_defect(
            [combined[i][j] - cached_q[i][j] for i in range(size) for j in range(size)]
        )

        symmetry_defects: list[Decimal] = []
        for block in (pole, arch, prime, combined):
            for i, n in enumerate(modes):
                for j, m in enumerate(modes):
                    symmetry_defects.extend(
                        (block[i][j] - block[j][i], block[i][j] - block[N - n][N - m])
                    )
        symmetry_defect = _max_decimal_defect(symmetry_defects)

        position = {mode: index for index, mode in enumerate(modes)}
        b = {
            n: Decimal(0)
            if n == 0
            else Decimal(n) * combined[position[n]][position[0]]
            for n in modes
        }
        cauchy_defects: list[Decimal] = []
        for n in modes:
            for m in modes:
                if n != m:
                    expected = (b[n] - b[m]) / Decimal(n - m)
                    cauchy_defects.append(combined[position[n]][position[m]] - expected)
        cauchy_defect = _max_decimal_defect(cauchy_defects)
    return combined, formula_defect, symmetry_defect, cauchy_defect


def _state_decimal_algebra(
    coefficients: list[Decimal],
    cached_kappa: list[Decimal],
    projected_norm: Decimal,
) -> tuple[list[Decimal], Decimal, Decimal, Decimal]:
    """Normalize coefficient decimals without changing the ambient context."""
    size = len(coefficients)
    with localcontext() as context:
        context.prec = 100
        norm_from_coefficients = sum(value * value for value in coefficients).sqrt()
        kappa = [value / norm_from_coefficients for value in coefficients]
        norm_defect = abs(norm_from_coefficients - projected_norm)
        cache_defect = _max_decimal_defect(
            [left - right for left, right in zip(kappa, cached_kappa)]
        )
        even_defect = _max_decimal_defect(
            [kappa[i] - kappa[size - 1 - i] for i in range(size)]
        )
    return kappa, norm_defect, cache_defect, even_defect


def _validate_source_lock(root: Path) -> None:
    lock = _load_json(root / "P0_SOURCE_LOCK.json")
    sources = lock.get("binding_sources")
    if not isinstance(sources, list):
        raise AuditError("source lock has no binding source inventory")
    match = next((item for item in sources if item.get("id") == "CCM-ZST-v1"), None)
    if not isinstance(match, dict):
        raise AuditError("CCM-ZST-v1 is absent from the source lock")
    expected_path, expected_hash = VENDORED_SOURCE
    required = {
        "version": "arXiv:2511.22755v1",
        "vendored_path": expected_path,
        "vendored_sha256": expected_hash,
    }
    if any(match.get(key) != value for key, value in required.items()):
        raise AuditError("binding source version/path/hash metadata changed")
    _checked_path(root, expected_path, expected_hash)


def _validate_payload(data: dict[str, Any], N: int) -> dict[str, Any]:
    """Validate source conventions and reconstruct point Q and kappa.

    Cached ``residual_gap`` data are intentionally never inspected.
    """
    inputs = data.get("inputs")
    if not isinstance(inputs, dict):
        raise AuditError("missing pilot inputs")
    modes = list(range(-N, N + 1))
    required_inputs = {
        "lambda": "2",
        "N": N,
        "modes": modes,
        "precision_decimal_digits": 35,
        "prolate_even_legendre_basis_size": 30,
    }
    if any(inputs.get(key) != value for key, value in required_inputs.items()):
        raise AuditError(f"lambda=2,N={N} pilot metadata mismatch")

    provenance = data.get("provenance")
    required_provenance = {
        "uses_assumed_real_zeta_zeros": False,
        "assumes_global_weil_positivity": False,
        "inversion_reflection_included": True,
        "lambda_parameter_representation": "decimal_string",
        "prime_block_sign": "minus",
        "determinant_convergence_evidence": "not_attempted",
    }
    if not isinstance(provenance, dict) or any(
        provenance.get(key) != value for key, value in required_provenance.items()
    ):
        raise AuditError("forbidden or changed pilot provenance")

    normalizations = data.get("normalizations")
    required_normalizations = {
        "domain": "[-lambda,lambda] with Lebesgue measure; zero extension",
        "Fourier_mode_sign": "U_n uses exp(+2*pi*i*n*x/L)",
        "arithmetic_transform": "E(h)(u)=u^(1/2) sum_{m>=1}h(mu)",
        "evenization": "k_plus=(k+Jk)/2",
        "prolate_eigenfunctions": "L2 unit norm, sign positive at zero, source Hermite limit",
    }
    if not isinstance(normalizations, dict) or any(
        normalizations.get(key) != value for key, value in required_normalizations.items()
    ):
        raise AuditError("projected-state normalization metadata changed")

    enumeration = data.get("source_enumeration")
    if not isinstance(enumeration, dict) or enumeration.get("prime_power_cutoff") != "lambda^2":
        raise AuditError("prime-power cutoff is not the inclusive lambda^2 cutoff")
    terms = enumeration.get("terms")
    if not isinstance(terms, list) or [term.get("n") for term in terms] != [2, 3, 4]:
        raise AuditError("inclusive prime-power inventory must be exactly 2,3,4")
    with localcontext() as context:
        context.prec = 70
        expected_logs = [Decimal(2).ln(), Decimal(3).ln(), Decimal(2).ln()]
    for index, (term, expected) in enumerate(zip(terms, expected_logs)):
        actual = _decimal_string(term.get("Lambda"), f"Lambda[{index}]")
        with localcontext() as context:
            context.prec = 70
            log_defect = abs(actual - expected)
        if log_defect > Decimal("1e-33"):
            raise AuditError("von Mangoldt value does not match the exact prime power")

    raw = data.get("raw_matrices")
    if not isinstance(raw, dict):
        raise AuditError("raw source blocks are missing")
    size = 2 * N + 1
    pole = _decimal_matrix(raw.get("pole"), size, "pole")
    arch = _decimal_matrix(raw.get("archimedean_unsigned"), size, "archimedean")
    prime = _decimal_matrix(raw.get("prime_unsigned"), size, "prime")
    cached_q = _decimal_matrix(
        raw.get("Q_equals_pole_minus_arch_minus_prime"), size, "cached_Q"
    )
    combined, formula_defect, symmetry_defect, cauchy_defect = _source_block_algebra(
        pole, arch, prime, cached_q, modes, N
    )
    if formula_defect > Decimal("1e-32"):
        raise AuditError("Q is not pole minus archimedean minus prime")
    if symmetry_defect > Decimal("1e-32"):
        raise AuditError("Hermitian or inversion reflection formula failed")
    if cauchy_defect > Decimal("1e-32"):
        raise AuditError("source Cauchy formula failed")

    projection = data.get("projection")
    if not isinstance(projection, dict):
        raise AuditError("projected state is missing")
    coefficients_raw = projection.get("coefficients_modes_minusN_to_N")
    cached_kappa_raw = projection.get("kappa")
    if not isinstance(coefficients_raw, list) or len(coefficients_raw) != size:
        raise AuditError("projected coefficient vector has the wrong size")
    if not isinstance(cached_kappa_raw, list) or len(cached_kappa_raw) != size:
        raise AuditError("cached kappa vector has the wrong size")
    coefficients = [
        _decimal_string(entry, f"coefficient[{i}]") for i, entry in enumerate(coefficients_raw)
    ]
    cached_kappa = [
        _decimal_string(entry, f"kappa[{i}]") for i, entry in enumerate(cached_kappa_raw)
    ]
    projected_norm = _decimal_string(projection.get("projected_norm"), "projected_norm")
    (
        kappa_from_coefficients,
        norm_defect,
        kappa_cache_defect,
        even_defect,
    ) = _state_decimal_algebra(
        coefficients, cached_kappa, projected_norm
    )
    if norm_defect > Decimal("1e-32") or kappa_cache_defect > Decimal("1e-32"):
        raise AuditError("projected state normalization does not replay")
    if even_defect > Decimal("1e-32"):
        raise AuditError("projected state is not inversion-even")
    if projection.get("projection_error_method") != "direct_residual_quadrature":
        raise AuditError("projection error method changed")

    return {
        "modes": modes,
        "combined_decimal": combined,
        "kappa_decimal": kappa_from_coefficients,
        "checks": {
            "block_formula_max_abs_defect": str(formula_defect),
            "symmetry_max_abs_defect": str(symmetry_defect),
            "source_cauchy_max_abs_defect": str(cauchy_defect),
            "coefficient_norm_vs_serialized_projected_norm_defect": str(norm_defect),
            "coefficient_state_vs_cached_kappa_defect": str(kappa_cache_defect),
            "inversion_even_defect": str(even_defect),
        },
    }


def _parse_ball(path: Path, role: str, bits: int) -> dict[tuple[int, int], tuple[Fraction, Fraction]]:
    entries: dict[tuple[int, int], tuple[Fraction, Fraction]] = {}
    metadata_seen = False
    meta_re = PRODUCER_META_RE if role == "producer" else VERIFIER_META_RE
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        meta = meta_re.fullmatch(line)
        if meta is not None:
            metadata_seen = True
            if meta.group(1, 2, 3, 4) != ("2", "4", str(bits), "4"):
                raise AuditError("ball metadata mismatch")
            if role == "producer" and meta.group(5) != "BALL_OUTPUT":
                raise AuditError("producer ball path metadata mismatch")
            if role == "verifier" and meta.group(5) != "direct_distribution_plus_corrected_4_14":
                raise AuditError("verifier ball path metadata mismatch")
            continue
        match = ENTRY_RE.fullmatch(line)
        if match is None:
            continue
        key = int(match.group(1)), int(match.group(2))
        midpoint = Fraction(match.group(3))
        radius = Fraction(match.group(4))
        if key in entries or radius < 0:
            raise AuditError("duplicate ball entry or negative radius")
        entries[key] = midpoint - radius, midpoint + radius
    required = {(n, m) for n in range(-4, 5) for m in range(-4, 5)}
    if not metadata_seen or set(entries) != required:
        raise AuditError("ball output is incomplete")
    return entries


def _overlap(left: tuple[Fraction, Fraction], right: tuple[Fraction, Fraction]) -> bool:
    return max(left[0], right[0]) <= min(left[1], right[1])


def _ball_matrix(root: Path) -> tuple[mp.matrix, dict[str, Any]]:
    paths: dict[tuple[str, int], dict[tuple[int, int], tuple[Fraction, Fraction]]] = {}
    for key, (relative, expected_hash) in BALL_INPUTS.items():
        paths[key] = _parse_ball(_checked_path(root, relative, expected_hash), *key)

    keys = sorted(paths[("producer", 256)])
    for role in ("producer", "verifier"):
        for bits in (256, 512):
            entries = paths[(role, bits)]
            for n, m in keys:
                if not _overlap(entries[n, m], entries[m, n]):
                    raise AuditError("ball Hermitian intervals do not overlap")
                if not _overlap(entries[n, m], entries[-n, -m]):
                    raise AuditError("ball inversion-reflected intervals do not overlap")
    for bits in (256, 512):
        for key in keys:
            if not _overlap(paths[("producer", bits)][key], paths[("verifier", bits)][key]):
                raise AuditError("independent ball assembly paths do not overlap")
    for role in ("producer", "verifier"):
        for key in keys:
            if not _overlap(paths[(role, 256)][key], paths[(role, 512)][key]):
                raise AuditError("doubled-precision ball outputs do not overlap")

    intersection: dict[tuple[int, int], tuple[Fraction, Fraction]] = {}
    for key in keys:
        lower = max(entries[key][0] for entries in paths.values())
        upper = min(entries[key][1] for entries in paths.values())
        if lower > upper:
            raise AuditError("four-way matrix ball intersection is empty")
        intersection[key] = lower, upper

    # Choose one exact rational representative for every Hermitian/inversion
    # orbit.  Intersecting the orbit intervals before taking a midpoint keeps
    # the diagnostic matrix exactly symmetric instead of trusting rounded
    # centers to coincide.
    representatives: dict[tuple[int, int], Fraction] = {}
    maximum_width = Fraction(0)
    for n, m in keys:
        if (n, m) in representatives:
            continue
        orbit = {(n, m), (m, n), (-n, -m), (-m, -n)}
        lower = max(intersection[key][0] for key in orbit)
        upper = min(intersection[key][1] for key in orbit)
        if lower > upper:
            raise AuditError("Hermitian/inversion orbit has empty common ball intersection")
        midpoint = (lower + upper) / 2
        for key in orbit:
            representatives[key] = midpoint
        maximum_width = max(maximum_width, upper - lower)

    matrix = mp.matrix(9)
    for i, n in enumerate(range(-4, 5)):
        for j, m in enumerate(range(-4, 5)):
            midpoint = representatives[n, m]
            matrix[i, j] = mp.mpf(midpoint.numerator) / midpoint.denominator
    return matrix, {
        "four_way_entry_intersection_nonempty": True,
        "producer_verifier_overlap_at_256_and_512_bits": True,
        "doubled_precision_overlap_for_each_path": True,
        "maximum_four_way_intersection_width": _serialize(
            mp.mpf(maximum_width.numerator) / maximum_width.denominator
        ),
        "matrix_point_used_for_diagnostic": "exact midpoint of each four-way interval intersection",
    }


def _mp_decimal(value: Decimal) -> mp.mpf:
    return mp.mpf(str(value))


def _mp_matrix(values: list[list[Decimal]]) -> mp.matrix:
    return mp.matrix([[_mp_decimal(value) for value in row] for row in values])


def _norm(vector: mp.matrix) -> mp.mpf:
    return mp.sqrt((vector.T * vector)[0])


def _orthogonal_complement(unit: mp.matrix) -> mp.matrix:
    dimension = unit.rows
    if dimension < 2:
        raise AuditError("orthogonal complement needs dimension at least two")
    e0 = mp.matrix(dimension, 1)
    e0[0] = 1
    sign = 1 if unit[0] >= 0 else -1
    vector = unit + sign * e0
    householder = mp.eye(dimension) - 2 * vector * vector.T / (vector.T * vector)[0]
    return householder[:, 1:dimension]


def _parity_bases(N: int) -> tuple[mp.matrix, mp.matrix]:
    dimension = 2 * N + 1
    even = mp.matrix(dimension, N + 1)
    odd = mp.matrix(dimension, N)
    even[N, 0] = 1
    for n in range(1, N + 1):
        even[N - n, n] = 1 / mp.sqrt(2)
        even[N + n, n] = 1 / mp.sqrt(2)
        odd[N + n, n - 1] = 1 / mp.sqrt(2)
        odd[N - n, n - 1] = -1 / mp.sqrt(2)
    return even, odd


def _krylov_basis(matrix: mp.matrix, state: mp.matrix) -> tuple[list[mp.matrix], list[mp.mpf]]:
    basis: list[mp.matrix] = []
    pivots: list[mp.mpf] = []
    candidate = mp.matrix(state)
    for _ in range(matrix.rows):
        for vector in basis:
            candidate -= vector * (vector.T * candidate)[0]
        for vector in basis:  # second pass is deterministic reorthogonalization
            candidate -= vector * (vector.T * candidate)[0]
        pivot = _norm(candidate)
        pivots.append(pivot)
        if pivot <= mp.mpf("1e-70"):
            break
        vector = candidate / pivot
        basis.append(vector)
        candidate = matrix * vector
    return basis, pivots


def _columns(vectors: list[mp.matrix], count: int) -> mp.matrix:
    result = mp.matrix(vectors[0].rows, count)
    for j in range(count):
        result[:, j] = vectors[j]
    return result


def _serialize(value: mp.mpf, digits: int = 45) -> str:
    return mp.nstr(value, digits)


def _gate_at_shift(
    Q_even: mp.matrix,
    Q_odd: mp.matrix,
    kappa_even: mp.matrix,
    endpoint: mp.matrix,
    even_complement: mp.matrix,
    even_residual_rhs: mp.matrix,
    transverse_complement: mp.matrix,
    transverse_coupling: mp.matrix,
    krylov_basis: list[mp.matrix],
    dimension: int,
) -> dict[str, Any]:
    compression_basis = _columns(krylov_basis, dimension)
    compression = compression_basis.T * Q_even * compression_basis
    U = mp.eigsy(compression, eigvals_only=True)[0]

    shifted_odd = Q_odd - U * mp.eye(Q_odd.rows)
    transverse = transverse_complement.T * shifted_odd * transverse_complement
    transverse_floor = mp.eigsy(transverse, eigvals_only=True)[0]
    scalar = (endpoint.T * shifted_odd * endpoint)[0]
    weighted_solution = mp.lu_solve(transverse, transverse_coupling)
    inverse_load = (transverse_coupling.T * weighted_solution)[0]
    schur_short = scalar - inverse_load
    odd_solve_residual = _norm(transverse * weighted_solution - transverse_coupling)

    q = (kappa_even.T * Q_even * kappa_even)[0]
    residual = Q_even * kappa_even - q * kappa_even
    complement_matrix = even_complement.T * Q_even * even_complement
    even_shifted = complement_matrix - U * mp.eye(complement_matrix.rows)
    even_solution = mp.lu_solve(even_shifted, even_residual_rhs)
    even_tau = _norm(even_solution)
    even_solve_residual = _norm(even_shifted * even_solution - even_residual_rhs)
    even_floor = mp.eigsy(complement_matrix, eigvals_only=True)[0]
    odd_floor = mp.eigsy(Q_odd, eigvals_only=True)[0]

    determinant_defect = abs(mp.det(shifted_odd) - mp.det(transverse) * schur_short)
    return {
        "krylov_dimension": dimension,
        "label": {1: "q", 2: "u", 3: "U3"}.get(dimension, f"U{dimension}"),
        "upper_shift": _serialize(U),
        "ritz_lowering_q_minus_shift": _serialize(q - U),
        "even_complement_margin": _serialize(even_floor - U),
        "odd_floor_margin": _serialize(odd_floor - U),
        "shifted_transverse_floor": _serialize(transverse_floor),
        "endpoint_scalar": _serialize(scalar),
        "inverse_weighted_cross_load": _serialize(inverse_load),
        "schur_short": _serialize(schur_short),
        "odd_transverse_solve_norm": _serialize(_norm(weighted_solution)),
        "odd_transverse_solve_residual_norm": _serialize(odd_solve_residual),
        "even_weighted_solve_tau": _serialize(even_tau),
        "even_weighted_solve_residual_norm": _serialize(even_solve_residual),
        "schur_determinant_identity_abs_defect": _serialize(determinant_defect),
        "point_gate_pass": bool(
            even_floor - U > 0 and transverse_floor > 0 and schur_short > 0
        ),
    }


def audit_payload(
    data: dict[str, Any],
    N: int,
    matrix_override: mp.matrix | None = None,
) -> dict[str, Any]:
    """Replay one already hash-checked payload.

    This entry point is also used by adversarial tests to demonstrate that
    cached spectral fields do not affect the reconstruction.
    """
    if mp.mp.dps < 100:
        with mp.workdps(100):
            return audit_payload(data, N, matrix_override)
    validated = _validate_payload(data, N)
    source_matrix = _mp_matrix(validated["combined_decimal"])
    Q = matrix_override if matrix_override is not None else source_matrix
    if Q.rows != 2 * N + 1 or Q.cols != 2 * N + 1:
        raise AuditError("matrix override has the wrong size")

    kappa = mp.matrix([_mp_decimal(value) for value in validated["kappa_decimal"]])
    kappa /= _norm(kappa)
    even_basis, odd_basis = _parity_bases(N)
    Q_even = even_basis.T * Q * even_basis
    Q_odd = odd_basis.T * Q * odd_basis
    kappa_even = even_basis.T * kappa
    kappa_even /= _norm(kappa_even)
    q = (kappa_even.T * Q_even * kappa_even)[0]
    residual = Q_even * kappa_even - q * kappa_even

    even_complement = _orthogonal_complement(kappa_even)
    even_residual_rhs = even_complement.T * residual

    mode_operator = mp.matrix(2 * N + 1)
    for index, mode in enumerate(range(-N, N + 1)):
        mode_operator[index, index] = mode
    endpoint_vector = odd_basis.T * mode_operator * kappa
    endpoint_norm = _norm(endpoint_vector)
    if endpoint_norm <= mp.mpf("1e-60"):
        raise AuditError("D kappa vanished")
    endpoint = endpoint_vector / endpoint_norm
    transverse_complement = _orthogonal_complement(endpoint)
    transverse_coupling = transverse_complement.T * Q_odd * endpoint

    krylov, pivots = _krylov_basis(Q_even, kappa_even)
    if len(krylov) < 3:
        raise AuditError("three-vector Krylov space broke down")
    gates = [
        _gate_at_shift(
            Q_even,
            Q_odd,
            kappa_even,
            endpoint,
            even_complement,
            even_residual_rhs,
            transverse_complement,
            transverse_coupling,
            krylov,
            dimension,
        )
        for dimension in (1, 2, 3)
    ]
    minimal = next(
        (gate["krylov_dimension"] for gate in gates if gate["point_gate_pass"]), None
    )
    return {
        "lambda": "2",
        "N": N,
        "claim_scope": "finite point diagnostic only",
        "projected_state_interval_enclosure": False,
        "historical_replay_does_not_consume_checkpoint_0_56_state_balls": True,
        "source_validation": validated["checks"],
        "q": _serialize(q),
        "residual_norm": _serialize(_norm(residual)),
        "endpoint_Dkappa_norm": _serialize(endpoint_norm),
        "full_even_krylov_dimension": len(krylov),
        "krylov_orthogonalization_pivots": [_serialize(value) for value in pivots],
        "three_vector_space_is_proper": bool(len(krylov) > 3 and pivots[3] > mp.mpf("1e-20")),
        "minimal_passing_dimension_among_q_u_U3": minimal,
        "gates": gates,
    }


def audit(root: Path = ROOT) -> dict[str, Any]:
    with mp.workdps(100):
        _validate_source_lock(root)
        payloads: dict[int, dict[str, Any]] = {}
        for N, (relative, expected_hash) in RAW_INPUTS.items():
            payloads[N] = _load_json(_checked_path(root, relative, expected_hash))

        ball_matrix, ball_checks = _ball_matrix(root)
        n3 = audit_payload(payloads[3], 3)
        n4 = audit_payload(payloads[4], 4, matrix_override=ball_matrix)

        raw_n4 = _mp_matrix(_validate_payload(payloads[4], 4)["combined_decimal"])
        raw_ball_difference = max(
            abs(raw_n4[i, j] - ball_matrix[i, j])
            for i in range(raw_n4.rows)
            for j in range(raw_n4.cols)
        )
        if raw_ball_difference > mp.mpf("1e-30"):
            raise AuditError("raw source-block matrix disagrees with the Arb matrix balls")
        n4["matrix_ball_checks"] = ball_checks
        n4["raw_block_matrix_vs_ball_intersection_midpoint_max_abs"] = _serialize(
            raw_ball_difference
        )

        return {
            "formal_state": "P0_INVALIDATED",
            "claim_class": "POINT_DIAGNOSTIC",
            "uses_cached_eigenvalues_or_pass_booleans": False,
            "uses_assumed_real_zeta_zeros": False,
            "assumes_global_weil_positivity": False,
            "matrix_source": (
                "N=3: pole-archimedean-prime decimal block reassembly; "
                "N=4: midpoint of the four-way 256/512-bit producer/verifier Arb-ball intersection"
            ),
            "state_source": (
                "hashed 35-digit projected coefficient decimals, independently renormalized; "
                "this historical replay does not consume the separate checkpoint-0.56 balls"
            ),
            "pilots": [n3, n4],
            "interval_inputs_still_required": [
                "propagation of the checkpoint-0.56 coefficient and norm balls through this Krylov chart",
                "ball-isolated Ritz roots with positive Krylov Gram pivots",
                "ball LDL or Sylvester positivity for each shifted transverse block",
                "verified ball solves for the odd inverse load and the even weighted solve",
            ],
            "limitations": [
                "finite lambda=2 pilots only",
                "state-dependent numbers are point diagnostics because this replay uses the historical point kappa",
                "the point-state producer and this numerical replay both use mpmath",
                "no asymptotic sector floor or residual-gap scaling follows",
                "no locally uniform determinant convergence is tested",
            ],
        }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=ROOT)
    args = parser.parse_args()
    print(json.dumps(audit(args.root), indent=2, sort_keys=True, allow_nan=False))


if __name__ == "__main__":
    main()
