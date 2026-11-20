#!/usr/bin/env python3
"""Produce the bounded odd-nu/transverse-sign replay artifact.

The artifact checks exact finite algebra and finite interval log-tail sums.
It does not certify an arithmetic transverse floor, an unbounded schedule,
equation (5.2), determinant convergence, or the Riemann hypothesis.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-odd-nu-transverse-sign-v1"
CLAIM_CLASS = "ODD_NU_TRANSVERSE_SIGN_AUDIT"
TERMINAL_STATE = "P0_INVALIDATED"
CHECKPOINT_VERSION = "0.43.0-odd-nu-transverse-sign"
UPDATED_DATE = "2026-08-08"
EXPECTED_MPMATH_VERSION = "1.4.1"

CANONICAL_LAMBDA_NUMERATORS = {5, 9}
CANONICAL_DPS = {80, 160}
_POSITIVE_INTEGER_TEXT = re.compile(r"[1-9][0-9]*\Z")

LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 18

EXPECTED_SOURCE_HASHES = {
    "P0_SOURCE_LOCK.json": "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "notes/HIGH_FOURIER_COERCIVITY.md": "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "notes/ODD_JUMP_FINITE_KRYLOV_ATTACK.md": "383ae4291cf5168f389c81d8f9a0fd6386c8adb952cdaa2368cf7e24f8283aa7",
    "notes/ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md": "c5134b4fb80bf2fcb654a1b31a7422aa089973a664cda90707d30ce7e469ddcc",
    "notes/ODD_NU_TRANSVERSE_SIGN_ATTACK.md": "828a53666436f8e6f7a71310cceacee2f79d6faf6803615b205459cb03e574fc",
    "requirements.txt": "458f06e2b5d6e73acc7a4f72af69afe920764c71127578555044815cd785c0fa",
}

CONVENTIONS = {
    "fourier_kernel": "exp(-itx)",
    "plancherel_measure": "dt/(2*pi)",
    "inversion": "x->-x",
    "odd_pole_coefficient": "-2",
    "prime_block_coefficient": "-1",
    "prime_power_endpoint": "inclusive n<=lambda^2",
    "combined_nonpole_operator": "archimedean-minus-prime before any norm",
}

PROVENANCE = {
    "binary64_parameters_used": False,
    "cached_matrix_input_used": False,
    "producer_pass_booleans_used_by_verifier": False,
    "zeta_zero_table_used": False,
    "global_weil_positivity_assumed": False,
    "api_key_or_environment_read": False,
}

ARITHMETIC_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", "mpmath.iv 1.4.1"],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "nondegenerate intervals receive a precision-scaled dyadic enlargement",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and pinned mpmath.iv 1.4.1",
}

CLAIM_BOUNDARY = {
    "finite_third_moment_identity_checked": True,
    "nested_fixed_parameter_transfer_checked": True,
    "jump_tail_forces_positive_nu": False,
    "arithmetic_transverse_floor_proved": False,
    "inverse_load_margin_proved": False,
    "explicit_unbounded_schedule_proved": False,
    "equation_5_2_proved": False,
    "determinant_convergence_proved": False,
}


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _validate_runtime() -> None:
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise RuntimeError("mpmath runtime mismatch")


def _validated_source_hashes() -> dict[str, str]:
    found: dict[str, str] = {}
    for relative, expected in EXPECTED_SOURCE_HASHES.items():
        actual = _sha256(_root() / relative)
        if actual != expected:
            raise ValueError(f"source hash mismatch: {relative}")
        found[relative] = actual
    return dict(sorted(found.items()))


def _choice(value: Any, label: str, allowed: set[int]) -> tuple[str, int]:
    if not isinstance(value, str) or _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise TypeError(f"{label} must be canonical positive integer text")
    if value not in {str(item) for item in allowed}:
        raise ValueError(f"{label} is outside the canonical pilot inventory")
    return value, int(value)


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return {"numerator": str(value.numerator), "denominator": str(value.denominator)}
    if isinstance(value, (list, tuple)):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    return value


def _assert_strict_json(value: Any) -> None:
    if isinstance(value, float):
        raise TypeError("binary floating-point value reached serialization")
    if value is None or type(value) in (bool, int, str):
        return
    if isinstance(value, list):
        for item in value:
            _assert_strict_json(item)
        return
    if isinstance(value, dict):
        if any(not isinstance(key, str) for key in value):
            raise TypeError("non-string JSON key")
        for item in value.values():
            _assert_strict_json(item)
        return
    raise TypeError(f"unsupported JSON value: {type(value).__name__}")


def _zeros(rows: int, columns: int) -> list[list[Fraction]]:
    return [[Fraction(0) for _ in range(columns)] for _ in range(rows)]


def _identity(size: int) -> list[list[Fraction]]:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _transpose(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    return [list(row) for row in zip(*matrix)]


def _matmul(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    return [
        [
            sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction(0))
            for j in range(len(right[0]))
        ]
        for i in range(len(left))
    ]


def _matadd(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    return [[left[i][j] + right[i][j] for j in range(len(left[0]))] for i in range(len(left))]


def _matsub(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    return [[left[i][j] - right[i][j] for j in range(len(left[0]))] for i in range(len(left))]


def _scale(matrix: list[list[Fraction]], scalar: Fraction) -> list[list[Fraction]]:
    return [[scalar * entry for entry in row] for row in matrix]


def _outer(left: list[Fraction], right: list[Fraction]) -> list[list[Fraction]]:
    return [[x * y for y in right] for x in left]


def _matvec(matrix: list[list[Fraction]], vector: list[Fraction]) -> list[Fraction]:
    return [sum((entry * value for entry, value in zip(row, vector)), Fraction(0)) for row in matrix]


def _dot(left: list[Fraction], right: list[Fraction]) -> Fraction:
    return sum((x * y for x, y in zip(left, right)), Fraction(0))


def _diag(entries: list[Fraction]) -> list[list[Fraction]]:
    result = _zeros(len(entries), len(entries))
    for index, entry in enumerate(entries):
        result[index][index] = entry
    return result


def _inverse(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    size = len(matrix)
    work = [row[:] + ident for row, ident in zip(matrix, _identity(size))]
    for column in range(size):
        pivot = next((row for row in range(column, size) if work[row][column]), None)
        if pivot is None:
            raise ArithmeticError("singular rational matrix")
        work[column], work[pivot] = work[pivot], work[column]
        divisor = work[column][column]
        work[column] = [entry / divisor for entry in work[column]]
        for row in range(size):
            if row == column:
                continue
            multiplier = work[row][column]
            work[row] = [
                work[row][j] - multiplier * work[column][j]
                for j in range(2 * size)
            ]
    return [row[size:] for row in work]


def _precision_bits(dps: int) -> int:
    return dps * LOG2_10_UPPER_NUMERATOR // LOG2_10_UPPER_DENOMINATOR + 2


def _raw_fraction(raw: tuple[int, int, int, int]) -> Fraction:
    sign, mantissa, exponent, _bits = raw
    numerator = -mantissa if sign else mantissa
    return Fraction(numerator * 2**exponent) if exponent >= 0 else Fraction(numerator, 2 ** (-exponent))


def _normalize_dyadic(value: int, exponent: int) -> tuple[int, int, int, int]:
    if value == 0:
        return 0, 0, 0, 0
    sign = int(value < 0)
    mantissa = abs(value)
    while mantissa % 2 == 0:
        mantissa //= 2
        exponent += 1
    return sign, mantissa, exponent, mantissa.bit_length()


def _shift_raw(raw: tuple[int, int, int, int], power: int, direction: int) -> tuple[int, int, int, int]:
    sign, mantissa, exponent, _bits = raw
    signed = -mantissa if sign else mantissa
    base = min(exponent, power)
    shifted = (signed << (exponent - base)) + direction * (1 << (power - base))
    return _normalize_dyadic(shifted, base)


def _serialize_interval(value: object, dps: int) -> dict[str, object]:
    lower_raw, upper_raw = value._mpi_  # type: ignore[attr-defined]
    lower = tuple(int(part) for part in lower_raw)
    upper = tuple(int(part) for part in upper_raw)
    if lower != upper:
        scale = max(
            exponent + bits - 1 if mantissa else 0
            for _sign, mantissa, exponent, bits in (lower, upper)
        )
        guard = scale - _precision_bits(dps) + SERIALIZATION_GUARD_OFFSET_BITS
        lower = _shift_raw(lower, guard, -1)
        upper = _shift_raw(upper, guard, 1)
    if _raw_fraction(lower) > _raw_fraction(upper):
        raise ArithmeticError("reversed interval")
    raw = lambda endpoint: [endpoint[0], str(endpoint[1]), endpoint[2], endpoint[3]]
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lower), dps + 10), mp.nstr(mp.mpf(upper), dps + 10)],
            "dyadic": {"lower": raw(lower), "upper": raw(upper)},
        }


def _third_moment_fixture() -> dict[str, Any]:
    q = [
        [Fraction(3, 2), Fraction(1), Fraction(-1, 2), Fraction(1, 3)],
        [Fraction(1), Fraction(5, 2), Fraction(1, 4), Fraction(0)],
        [Fraction(-1, 2), Fraction(1, 4), Fraction(7, 4), Fraction(-1, 5)],
        [Fraction(1, 3), Fraction(0), Fraction(-1, 5), Fraction(3)],
    ]
    prime = [
        [Fraction(1, 5), Fraction(1, 7), Fraction(0), Fraction(0)],
        [Fraction(1, 7), Fraction(1, 6), Fraction(1, 8), Fraction(0)],
        [Fraction(0), Fraction(1, 8), Fraction(1, 9), Fraction(1, 10)],
        [Fraction(0), Fraction(0), Fraction(1, 10), Fraction(1, 11)],
    ]
    pole = [Fraction(2), Fraction(0), Fraction(0), Fraction(0)]
    arch = _matadd(_matadd(q, prime), _scale(_outer(pole, pole), Fraction(2)))
    assembled = _matsub(_matsub(arch, prime), _scale(_outer(pole, pole), Fraction(2)))
    beta = Fraction(1, 4)
    e = [Fraction(1), Fraction(0), Fraction(0), Fraction(0)]
    q2 = _matmul(q, q)
    q3 = _matmul(q2, q)
    alpha = _matmul([e], _matmul(q, _transpose([e])))[0][0]
    m2 = _matmul([e], _matmul(q2, _transpose([e])))[0][0]
    m3 = _matmul([e], _matmul(q3, _transpose([e])))[0][0]
    qe = _matvec(q, e)
    b = [qe[index] - alpha * e[index] for index in range(4)]
    transverse = [row[1:] for row in q[1:]]
    c_beta = _matsub(transverse, _scale(_identity(3), beta))
    b_transverse = b[1:]
    nu_direct = _dot(b_transverse, _matvec(c_beta, b_transverse))
    nu_moment = m3 - (2 * alpha + beta) * m2 + alpha**3 + beta * alpha**2
    return {
        "dimension": 4,
        "beta": beta,
        "pole_vector": pole,
        "odd_pole_coefficient": Fraction(-2),
        "prime_unsigned_block": prime,
        "prime_block_coefficient": Fraction(-1),
        "archimedean_block": arch,
        "assembled_Q": assembled,
        "Q": q,
        "e": e,
        "alpha": alpha,
        "m2": m2,
        "m3": m3,
        "centered_residual_b": b,
        "C_beta": c_beta,
        "nu_direct": nu_direct,
        "nu_moment_polynomial": nu_moment,
    }


def _nested_transverse_fixture() -> dict[str, Any]:
    transverse_diagonal = [Fraction(7), Fraction(5), Fraction(4), Fraction(3), Fraction(2)]
    ambient_dimension = 6
    pole = [Fraction(2)] + [Fraction(0) for _ in range(5)]
    rows: list[dict[str, Any]] = []
    for cutoff in range(1, 6):
        projector = [1 if index <= cutoff else 0 for index in range(ambient_dimension)]
        basis = _zeros(ambient_dimension, cutoff)
        for column in range(cutoff):
            basis[column + 1][column] = Fraction(1)
        compressed = _matmul(_transpose(basis), _matmul(_diag([Fraction(0)] + transverse_diagonal), basis))
        overlap = _matvec(_transpose(basis), pole)
        rows.append({
            "cutoff": cutoff,
            "projector_diagonal": projector,
            "projected_pole": pole,
            "transverse_basis": basis,
            "pole_overlap": overlap,
            "compressed_C_beta": compressed,
            "floor": min(transverse_diagonal[:cutoff]),
        })
    return {
        "ambient_dimension": ambient_dimension,
        "pole_vector": pole,
        "transverse_diagonal": transverse_diagonal,
        "rows": rows,
        "claimed_common_floor": Fraction(2),
    }


def _block_matrix(a: Fraction, b: list[Fraction], c: list[list[Fraction]]) -> list[list[Fraction]]:
    return [[a] + b[:]] + [[b[index]] + row[:] for index, row in enumerate(c)]


def _countermodel_fixture(p: int) -> dict[str, Any]:
    j = Fraction(1, p)
    tail_end = p
    tail_rows = [
        {"k": k, "coefficient": j / k, "high_diagonal": Fraction(k + 1)}
        for k in range(3, tail_end + 1)
    ]
    z = [row["coefficient"] for row in tail_rows]
    d = [row["high_diagonal"] for row in tail_rows]
    b = [Fraction(1), Fraction(0)] + z
    s1 = sum((di * zi * zi for di, zi in zip(d, z)), Fraction(0))
    s_minus1 = sum((zi * zi / di for di, zi in zip(d, z)), Fraction(0))
    mass = s1 + 1

    c_plus = _diag([mass, Fraction(1)] + d)
    c_minus = _diag([-mass, Fraction(1)] + d)
    nu_plus = _dot(b, _matvec(c_plus, b))
    nu_minus = _dot(b, _matvec(c_minus, b))

    c_good = c_plus
    c_bad = _diag([mass, Fraction(-1)] + d)
    moments_good: list[Fraction] = []
    moments_bad: list[Fraction] = []
    vector_good = b[:]
    vector_bad = b[:]
    for _order in range(5):
        moments_good.append(_dot(b, vector_good))
        moments_bad.append(_dot(b, vector_bad))
        vector_good = _matvec(c_good, vector_good)
        vector_bad = _matvec(c_bad, vector_bad)

    c1 = _diag([Fraction(2), Fraction(2)] + d)
    c2 = _diag([Fraction(0), Fraction(0)] + d)
    c2[0][0] = Fraction(2)
    c2[0][1] = Fraction(3, 2)
    c2[1][0] = Fraction(3, 2)
    c2[1][1] = Fraction(2)
    c1_inv = _inverse(c1)
    c2_inv = _inverse(c2)
    common_nu_1 = _dot(b, _matvec(c1, b))
    common_nu_2 = _dot(b, _matvec(c2, b))
    chi1 = _dot(b, _matvec(c1_inv, b))
    chi2 = _dot(b, _matvec(c2_inv, b))
    surplus = Fraction(3, 4) + s_minus1

    beta = Fraction(1, 4)
    mu = Fraction(4)
    pole = [Fraction(2)] + [Fraction(0) for _ in b]
    q_shift_1 = _block_matrix(surplus, b, c1)
    q_shift_2 = _block_matrix(surplus, b, c2)
    identity = _identity(len(q_shift_1))
    q1 = _matadd(q_shift_1, _scale(identity, beta))
    q2 = _matadd(q_shift_2, _scale(identity, beta))
    t1 = _matadd(q1, _scale(_outer(pole, pole), Fraction(2)))
    t2 = _matadd(q2, _scale(_outer(pole, pole), Fraction(2)))

    return {
        "lambda_numerator": p,
        "jump_amplitude_j": j,
        "finite_tail_end": tail_end,
        "tail_rows": tail_rows,
        "b": b,
        "rational_high_energy_S1": s1,
        "rational_inverse_high_energy_S_minus1": s_minus1,
        "sign_model": {
            "M": mass,
            "C_plus": c_plus,
            "C_minus": c_minus,
            "nu_plus": nu_plus,
            "nu_minus": nu_minus,
        },
        "invisible_floor_model": {
            "C_good": c_good,
            "C_bad": c_bad,
            "cyclic_moments_good": moments_good,
            "cyclic_moments_bad": moments_bad,
            "good_floor": Fraction(1),
            "bad_floor": Fraction(-1),
        },
        "inverse_load_model": {
            "C1": c1,
            "C2": c2,
            "nu1": common_nu_1,
            "nu2": common_nu_2,
            "chi1": chi1,
            "chi2": chi2,
            "pole_axis_surplus": surplus,
            "decision1": "pass",
            "decision2": "fail",
            "nu_substituted_for_inverse_load": False,
        },
        "pole_embedding": {
            "beta": beta,
            "mu": mu,
            "pole_vector": pole,
            "odd_pole_coefficient": Fraction(-2),
            "Q_shift_1": q_shift_1,
            "Q_shift_2": q_shift_2,
            "Q1": q1,
            "Q2": q2,
            "T1": t1,
            "T2": t2,
        },
    }


def _log_tail_intervals(p: int, dps: int) -> dict[str, Any]:
    mp.mp.dps = dps
    mp.iv.dps = dps
    iv = mp.iv.mpf
    j = iv(1) / p
    upper = p * p
    weighted = iv(0)
    inverse_weighted = iv(0)
    for k in range(3, upper + 1):
        log_k = mp.iv.log(iv(k))
        weighted += j**2 * (iv(1) + log_k) / (k * k)
        inverse_weighted += j**2 / ((iv(1) + log_k) * (k * k))
    band = iv(0)
    for k in range(upper + 1, 2 * upper + 1):
        band += j**2 * mp.iv.log(iv(k + 2)) / (k * k)
    scaled_band = iv(upper) * band / mp.iv.log(iv(upper))
    return {
        "partial_start": 3,
        "partial_end": upper,
        "dyadic_band_start": upper,
        "dyadic_band_end": 2 * upper,
        "log_weighted_partial": _serialize_interval(weighted, dps),
        "inverse_log_weighted_partial": _serialize_interval(inverse_weighted, dps),
        "dyadic_log_band": _serialize_interval(band, dps),
        "scaled_dyadic_log_band": _serialize_interval(scaled_band, dps),
    }


def produce(lambda_numerator: str, dps: str) -> dict[str, Any]:
    _validate_runtime()
    p_text, p = _choice(lambda_numerator, "lambda numerator", CANONICAL_LAMBDA_NUMERATORS)
    dps_text, precision = _choice(dps, "dps", CANONICAL_DPS)
    payload: dict[str, Any] = {
        "schema": SCHEMA,
        "claim_class": CLAIM_CLASS,
        "terminal_state": TERMINAL_STATE,
        "checkpoint_version": CHECKPOINT_VERSION,
        "updated_date": UPDATED_DATE,
        "inputs": {
            "lambda_numerator": p_text,
            "lambda_denominator": "2",
            "dps": dps_text,
        },
        "source_hashes": _validated_source_hashes(),
        "conventions": CONVENTIONS,
        "provenance": PROVENANCE,
        "arithmetic": ARITHMETIC_LIBRARIES,
        "certificate": {
            "exact_third_moment": _third_moment_fixture(),
            "nested_transverse_spaces": _nested_transverse_fixture(),
            "jump_compatible_countermodels": _countermodel_fixture(p),
            "interval_log_tails": _log_tail_intervals(p, precision),
        },
        "claim_boundary": CLAIM_BOUNDARY,
    }
    encoded = _encode(payload)
    _assert_strict_json(encoded)
    return encoded


def _canonical_bytes(payload: dict[str, Any]) -> bytes:
    return (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-numerator", required=True)
    parser.add_argument("--dps", required=True)
    parser.add_argument("--output")
    args = parser.parse_args()
    payload = produce(args.lambda_numerator, args.dps)
    data = _canonical_bytes(payload)
    if args.output:
        target = Path(args.output)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    else:
        print(data.decode("utf-8"), end="")


if __name__ == "__main__":
    main()
