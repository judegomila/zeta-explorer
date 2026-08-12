#!/usr/bin/env python3
"""Independent replay for the bounded odd-nu/transverse-sign artifact."""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


PRODUCER_SCHEMA = "xi-prolate-odd-nu-transverse-sign-v1"
REPLAY_SCHEMA = "xi-prolate-odd-nu-transverse-sign-replay-v1"
CLAIM_CLASS = "ODD_NU_TRANSVERSE_SIGN_AUDIT"
TERMINAL_STATE = "P0_INVALIDATED"
CHECKPOINT_VERSION = "0.43.0-odd-nu-transverse-sign"
UPDATED_DATE = "2026-08-08"
EXPECTED_MPMATH_VERSION = "1.4.1"

CANONICAL_LAMBDA_NUMERATORS = {"5", "9"}
CANONICAL_DPS = {"80", "160"}
_POSITIVE_INTEGER_TEXT = re.compile(r"[1-9][0-9]*\Z")
_SECRET_VALUE = re.compile(
    r"(?:\bBearer\s+[A-Za-z0-9._-]+|\bsk-[A-Za-z0-9_-]{8,}|"
    r"\bgh[pousr]_[A-Za-z0-9_]{8,}|\bxox[baprs]-[A-Za-z0-9-]{8,}|"
    r"OPENAI_API_KEY\s*=)",
    re.IGNORECASE,
)

LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15

EXPECTED_SOURCE_HASHES = {
    "P0_SOURCE_LOCK.json": "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "notes/HIGH_FOURIER_COERCIVITY.md": "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "notes/ODD_JUMP_FINITE_KRYLOV_ATTACK.md": "383ae4291cf5168f389c81d8f9a0fd6386c8adb952cdaa2368cf7e24f8283aa7",
    "notes/ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md": "c5134b4fb80bf2fcb654a1b31a7422aa089973a664cda90707d30ce7e469ddcc",
    "notes/ODD_NU_TRANSVERSE_SIGN_ATTACK.md": "828a53666436f8e6f7a71310cceacee2f79d6faf6803615b205459cb03e574fc",
    "requirements.txt": "458f06e2b5d6e73acc7a4f72af69afe920764c71127578555044815cd785c0fa",
}

EXPECTED_CONVENTIONS = {
    "fourier_kernel": "exp(-itx)",
    "plancherel_measure": "dt/(2*pi)",
    "inversion": "x->-x",
    "odd_pole_coefficient": "-2",
    "prime_block_coefficient": "-1",
    "prime_power_endpoint": "inclusive n<=lambda^2",
    "combined_nonpole_operator": "archimedean-minus-prime before any norm",
}

EXPECTED_PROVENANCE = {
    "binary64_parameters_used": False,
    "cached_matrix_input_used": False,
    "producer_pass_booleans_used_by_verifier": False,
    "zeta_zero_table_used": False,
    "global_weil_positivity_assumed": False,
    "api_key_or_environment_read": False,
}

EXPECTED_ARITHMETIC = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", "mpmath.iv 1.4.1"],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "nondegenerate intervals receive a precision-scaled dyadic enlargement",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and pinned mpmath.iv 1.4.1",
}

EXPECTED_CLAIM_BOUNDARY = {
    "finite_third_moment_identity_checked": True,
    "nested_fixed_parameter_transfer_checked": True,
    "jump_tail_forces_positive_nu": False,
    "arithmetic_transverse_floor_proved": False,
    "inverse_load_margin_proved": False,
    "explicit_unbounded_schedule_proved": False,
    "equation_5_2_proved": False,
    "determinant_convergence_proved": False,
}


class ReplayError(ValueError):
    """Raised when an artifact fails independent reconstruction."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _reject_float_or_secret(value: Any, path: str = "root") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path}")
    if isinstance(value, str):
        if _SECRET_VALUE.search(value):
            raise ReplayError(f"secret-like value at {path}")
        return
    if value is None or type(value) in (bool, int):
        return
    if isinstance(value, list):
        for index, item in enumerate(value):
            _reject_float_or_secret(item, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        if any(not isinstance(key, str) for key in value):
            raise ReplayError(f"non-string key at {path}")
        for key, item in value.items():
            _reject_float_or_secret(item, f"{path}.{key}")
        return
    raise ReplayError(f"unsupported value at {path}")


def _require_keys(value: Any, keys: set[str], label: str) -> dict[str, Any]:
    if not isinstance(value, dict) or set(value) != keys:
        raise ReplayError(f"{label} key inventory mismatch")
    return value


def _fraction(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"malformed rational: {label}")
    numerator, denominator = value["numerator"], value["denominator"]
    if not isinstance(numerator, str) or not isinstance(denominator, str):
        raise ReplayError(f"non-text rational: {label}")
    try:
        result = Fraction(int(numerator), int(denominator))
    except (ValueError, ZeroDivisionError) as exc:
        raise ReplayError(f"invalid rational: {label}") from exc
    if str(result.numerator) != numerator or str(result.denominator) != denominator:
        raise ReplayError(f"noncanonical rational: {label}")
    return result


def _vector(value: Any, length: int, label: str) -> list[Fraction]:
    if not isinstance(value, list) or len(value) != length:
        raise ReplayError(f"malformed vector: {label}")
    return [_fraction(item, f"{label}[{index}]") for index, item in enumerate(value)]


def _matrix(value: Any, rows: int, columns: int, label: str) -> list[list[Fraction]]:
    if not isinstance(value, list) or len(value) != rows:
        raise ReplayError(f"malformed matrix: {label}")
    return [_vector(row, columns, f"{label}[{index}]") for index, row in enumerate(value)]


def _check_fraction(value: Any, expected: Fraction, label: str) -> None:
    if _fraction(value, label) != expected:
        raise ReplayError(f"rational mismatch: {label}")


def _check_vector(value: Any, expected: list[Fraction], label: str) -> None:
    if _vector(value, len(expected), label) != expected:
        raise ReplayError(f"vector mismatch: {label}")


def _check_matrix(value: Any, expected: list[list[Fraction]], label: str) -> None:
    if _matrix(value, len(expected), len(expected[0]), label) != expected:
        raise ReplayError(f"matrix mismatch: {label}")


def _raw_fraction(value: Any, label: str) -> Fraction:
    if not isinstance(value, list) or len(value) != 4:
        raise ReplayError(f"malformed raw endpoint: {label}")
    sign, mantissa_text, exponent, bits = value
    if sign not in (0, 1) or not isinstance(mantissa_text, str) or not isinstance(exponent, int) or not isinstance(bits, int):
        raise ReplayError(f"invalid raw endpoint: {label}")
    if not mantissa_text.isdigit() or (mantissa_text.startswith("0") and mantissa_text != "0"):
        raise ReplayError(f"noncanonical mantissa: {label}")
    mantissa = int(mantissa_text)
    if mantissa == 0:
        if (sign, exponent, bits) != (0, 0, 0):
            raise ReplayError(f"noncanonical zero endpoint: {label}")
        return Fraction(0)
    if mantissa % 2 == 0 or bits != mantissa.bit_length():
        raise ReplayError(f"nonnormalized endpoint: {label}")
    numerator = -mantissa if sign else mantissa
    return Fraction(numerator * 2**exponent) if exponent >= 0 else Fraction(numerator, 2 ** (-exponent))


def _interval(value: Any, label: str, dps: int) -> tuple[Fraction, Fraction]:
    fixture = _require_keys(value, {"decimal", "dyadic"}, label)
    decimal = fixture["decimal"]
    dyadic = _require_keys(fixture["dyadic"], {"lower", "upper"}, f"{label}.dyadic")
    if not isinstance(decimal, list) or len(decimal) != 2 or not all(isinstance(item, str) for item in decimal):
        raise ReplayError(f"malformed decimal interval: {label}")
    try:
        decimal_lo, decimal_hi = mp.mpf(decimal[0]), mp.mpf(decimal[1])
    except ValueError as exc:
        raise ReplayError(f"unparseable decimal interval: {label}") from exc
    if not (mp.isfinite(decimal_lo) and mp.isfinite(decimal_hi)) or decimal_lo > decimal_hi:
        raise ReplayError(f"invalid decimal interval: {label}")
    lo = _raw_fraction(dyadic["lower"], f"{label}.lower")
    hi = _raw_fraction(dyadic["upper"], f"{label}.upper")
    if lo > hi:
        raise ReplayError(f"reversed interval: {label}")
    lower_raw = (
        int(dyadic["lower"][0]), int(dyadic["lower"][1]),
        int(dyadic["lower"][2]), int(dyadic["lower"][3]),
    )
    upper_raw = (
        int(dyadic["upper"][0]), int(dyadic["upper"][1]),
        int(dyadic["upper"][2]), int(dyadic["upper"][3]),
    )
    with mp.workdps(dps + 20):
        expected_decimal = [
            mp.nstr(mp.mpf(lower_raw), dps + 10),
            mp.nstr(mp.mpf(upper_raw), dps + 10),
        ]
    if decimal != expected_decimal:
        raise ReplayError(f"decimal/dyadic mismatch: {label}")
    scale = max(
        abs(lo.numerator).bit_length() - lo.denominator.bit_length(),
        abs(hi.numerator).bit_length() - hi.denominator.bit_length(),
        0,
    )
    precision_bits = dps * LOG2_10_UPPER_NUMERATOR // LOG2_10_UPPER_DENOMINATOR
    cap_power = scale - precision_bits + 24
    cap = Fraction(2**cap_power) if cap_power >= 0 else Fraction(1, 2 ** (-cap_power))
    if hi - lo > cap:
        raise ReplayError(f"overwide interval: {label}")
    return lo, hi


def _iv_bounds(value: object) -> tuple[Fraction, Fraction]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]

    def convert(raw: object) -> Fraction:
        sign, mantissa, exponent, _bits = (int(part) for part in raw)  # type: ignore[arg-type]
        numerator = -mantissa if sign else mantissa
        return Fraction(numerator * 2**exponent) if exponent >= 0 else Fraction(numerator, 2 ** (-exponent))

    return convert(lower), convert(upper)


def _contains(serialized: Any, reconstructed: object, label: str, dps: int) -> None:
    lo, hi = _interval(serialized, label, dps)
    expected_lo, expected_hi = _iv_bounds(reconstructed)
    if lo > expected_lo or hi < expected_hi:
        raise ReplayError(f"interval does not contain independent reconstruction: {label}")


def _dot(left: list[Fraction], right: list[Fraction]) -> Fraction:
    total = Fraction(0)
    for index in range(len(left) - 1, -1, -1):
        total += left[index] * right[index]
    return total


def _apply(matrix: list[list[Fraction]], vector: list[Fraction]) -> list[Fraction]:
    result: list[Fraction] = []
    for row in matrix:
        terms = [row[index] * vector[index] for index in range(len(vector))]
        result.append(sum(reversed(terms), Fraction(0)))
    return result


def _expected_q() -> list[list[Fraction]]:
    return [
        [Fraction(3, 2), Fraction(1), Fraction(-1, 2), Fraction(1, 3)],
        [Fraction(1), Fraction(5, 2), Fraction(1, 4), Fraction(0)],
        [Fraction(-1, 2), Fraction(1, 4), Fraction(7, 4), Fraction(-1, 5)],
        [Fraction(1, 3), Fraction(0), Fraction(-1, 5), Fraction(3)],
    ]


def _expected_prime() -> list[list[Fraction]]:
    return [
        [Fraction(1, 5), Fraction(1, 7), Fraction(0), Fraction(0)],
        [Fraction(1, 7), Fraction(1, 6), Fraction(1, 8), Fraction(0)],
        [Fraction(0), Fraction(1, 8), Fraction(1, 9), Fraction(1, 10)],
        [Fraction(0), Fraction(0), Fraction(1, 10), Fraction(1, 11)],
    ]


def _check_third_moment(value: Any) -> Fraction:
    fixture = _require_keys(value, {
        "dimension", "beta", "pole_vector", "odd_pole_coefficient",
        "prime_unsigned_block", "prime_block_coefficient", "archimedean_block",
        "assembled_Q", "Q", "e", "alpha", "m2", "m3", "centered_residual_b",
        "C_beta", "nu_direct", "nu_moment_polynomial",
    }, "exact_third_moment")
    if fixture["dimension"] != 4:
        raise ReplayError("third-moment dimension mutation")
    beta = Fraction(1, 4)
    pole = [Fraction(2), Fraction(0), Fraction(0), Fraction(0)]
    e = [Fraction(1), Fraction(0), Fraction(0), Fraction(0)]
    q = _expected_q()
    prime = _expected_prime()
    arch = [
        [q[i][j] + prime[i][j] + 2 * pole[i] * pole[j] for j in range(4)]
        for i in range(4)
    ]
    assembled = [
        [arch[i][j] - prime[i][j] - 2 * pole[i] * pole[j] for j in range(4)]
        for i in range(4)
    ]
    _check_fraction(fixture["beta"], beta, "exact_third_moment.beta")
    _check_vector(fixture["pole_vector"], pole, "exact_third_moment.pole_vector")
    _check_fraction(fixture["odd_pole_coefficient"], Fraction(-2), "exact_third_moment.odd_pole_coefficient")
    _check_fraction(fixture["prime_block_coefficient"], Fraction(-1), "exact_third_moment.prime_block_coefficient")
    _check_matrix(fixture["prime_unsigned_block"], prime, "exact_third_moment.prime_unsigned_block")
    _check_matrix(fixture["archimedean_block"], arch, "exact_third_moment.archimedean_block")
    _check_matrix(fixture["assembled_Q"], assembled, "exact_third_moment.assembled_Q")
    _check_matrix(fixture["Q"], q, "exact_third_moment.Q")
    _check_vector(fixture["e"], e, "exact_third_moment.e")
    if assembled != q:
        raise ReplayError("minus-prime/pole assembly identity failed")

    qe = [row[0] for row in q]
    alpha = qe[0]
    q_qe = _apply(q, qe)
    m2 = _dot(qe, qe)
    m3 = _dot(qe, q_qe)
    b = [qe[index] - alpha * e[index] for index in range(4)]
    c_beta = [
        [q[i + 1][j + 1] - (beta if i == j else 0) for j in range(3)]
        for i in range(3)
    ]
    nu_direct = _dot(b[1:], _apply(c_beta, b[1:]))
    nu_moment = m3 - (2 * alpha + beta) * m2 + alpha**3 + beta * alpha**2
    _check_fraction(fixture["alpha"], alpha, "exact_third_moment.alpha")
    _check_fraction(fixture["m2"], m2, "exact_third_moment.m2")
    _check_fraction(fixture["m3"], m3, "exact_third_moment.m3")
    _check_vector(fixture["centered_residual_b"], b, "exact_third_moment.centered_residual_b")
    _check_matrix(fixture["C_beta"], c_beta, "exact_third_moment.C_beta")
    _check_fraction(fixture["nu_direct"], nu_direct, "exact_third_moment.nu_direct")
    _check_fraction(fixture["nu_moment_polynomial"], nu_moment, "exact_third_moment.nu_moment_polynomial")
    if nu_direct != nu_moment:
        raise ReplayError("third-moment polynomial identity failed")
    return nu_direct


def _check_nested(value: Any) -> list[Fraction]:
    fixture = _require_keys(value, {
        "ambient_dimension", "pole_vector", "transverse_diagonal", "rows", "claimed_common_floor",
    }, "nested_transverse_spaces")
    ambient = 6
    pole = [Fraction(2)] + [Fraction(0) for _ in range(5)]
    diagonal = [Fraction(7), Fraction(5), Fraction(4), Fraction(3), Fraction(2)]
    if fixture["ambient_dimension"] != ambient:
        raise ReplayError("nested ambient dimension mutation")
    _check_vector(fixture["pole_vector"], pole, "nested_transverse_spaces.pole_vector")
    _check_vector(fixture["transverse_diagonal"], diagonal, "nested_transverse_spaces.transverse_diagonal")
    rows = fixture["rows"]
    if not isinstance(rows, list) or len(rows) != 5:
        raise ReplayError("nested row inventory mismatch")
    floors: list[Fraction] = []
    previous_basis: list[list[Fraction]] | None = None
    for cutoff, raw in enumerate(rows, start=1):
        row = _require_keys(raw, {
            "cutoff", "projector_diagonal", "projected_pole", "transverse_basis",
            "pole_overlap", "compressed_C_beta", "floor",
        }, f"nested_transverse_spaces.rows[{cutoff - 1}]")
        if row["cutoff"] != cutoff:
            raise ReplayError("nested cutoff mutation")
        expected_projector = [1 if index <= cutoff else 0 for index in range(ambient)]
        if row["projector_diagonal"] != expected_projector:
            raise ReplayError("nested projector mutation")
        _check_vector(row["projected_pole"], pole, f"nested.rows[{cutoff - 1}].projected_pole")
        basis = [[Fraction(0) for _ in range(cutoff)] for _ in range(ambient)]
        for column in range(cutoff):
            basis[column + 1][column] = Fraction(1)
        _check_matrix(row["transverse_basis"], basis, f"nested.rows[{cutoff - 1}].transverse_basis")
        _check_vector(row["pole_overlap"], [Fraction(0)] * cutoff, f"nested.rows[{cutoff - 1}].pole_overlap")
        compressed = [[diagonal[i] if i == j else Fraction(0) for j in range(cutoff)] for i in range(cutoff)]
        _check_matrix(row["compressed_C_beta"], compressed, f"nested.rows[{cutoff - 1}].compressed_C_beta")
        floor = min(diagonal[:cutoff])
        _check_fraction(row["floor"], floor, f"nested.rows[{cutoff - 1}].floor")
        if floor <= 0:
            raise ReplayError("nonpositive transverse floor")
        floors.append(floor)
        if previous_basis is not None:
            for i in range(ambient):
                if basis[i][:cutoff - 1] != previous_basis[i]:
                    raise ReplayError("transverse spaces are not nested")
        previous_basis = basis
    if any(floors[index + 1] > floors[index] for index in range(len(floors) - 1)):
        raise ReplayError("transverse floors are not monotone")
    common = _fraction(fixture["claimed_common_floor"], "nested_transverse_spaces.claimed_common_floor")
    if common <= 0 or common != floors[-1]:
        raise ReplayError("nonpositive or incorrect claimed floor")
    return floors


def _diag(entries: list[Fraction]) -> list[list[Fraction]]:
    return [[entries[i] if i == j else Fraction(0) for j in range(len(entries))] for i in range(len(entries))]


def _block(a: Fraction, b: list[Fraction], c: list[list[Fraction]]) -> list[list[Fraction]]:
    result = [[a] + b[:]]
    for index, row in enumerate(c):
        result.append([b[index]] + row[:])
    return result


def _add_identity(matrix: list[list[Fraction]], scalar: Fraction) -> list[list[Fraction]]:
    return [
        [entry + (scalar if i == j else 0) for j, entry in enumerate(row)]
        for i, row in enumerate(matrix)
    ]


def _add_outer(matrix: list[list[Fraction]], vector: list[Fraction], scalar: Fraction) -> list[list[Fraction]]:
    return [
        [matrix[i][j] + scalar * vector[i] * vector[j] for j in range(len(matrix))]
        for i in range(len(matrix))
    ]


def _check_countermodels(value: Any, p: int) -> dict[str, Fraction]:
    fixture = _require_keys(value, {
        "lambda_numerator", "jump_amplitude_j", "finite_tail_end", "tail_rows", "b",
        "rational_high_energy_S1", "rational_inverse_high_energy_S_minus1",
        "sign_model", "invisible_floor_model", "inverse_load_model", "pole_embedding",
    }, "jump_compatible_countermodels")
    if fixture["lambda_numerator"] != p or fixture["finite_tail_end"] != p:
        raise ReplayError("countermodel pilot/tail mutation")
    j = Fraction(1, p)
    _check_fraction(fixture["jump_amplitude_j"], j, "countermodels.jump_amplitude_j")
    tail_rows = fixture["tail_rows"]
    if not isinstance(tail_rows, list) or len(tail_rows) != p - 2:
        raise ReplayError("countermodel tail inventory mismatch")
    z: list[Fraction] = []
    d: list[Fraction] = []
    for index, k in enumerate(range(3, p + 1)):
        row = _require_keys(tail_rows[index], {"k", "coefficient", "high_diagonal"}, f"countermodels.tail_rows[{index}]")
        if row["k"] != k:
            raise ReplayError("countermodel tail label mutation")
        coefficient = j / k
        high = Fraction(k + 1)
        _check_fraction(row["coefficient"], coefficient, f"countermodels.tail_rows[{index}].coefficient")
        _check_fraction(row["high_diagonal"], high, f"countermodels.tail_rows[{index}].high_diagonal")
        z.append(coefficient)
        d.append(high)
    b = [Fraction(1), Fraction(0)] + z
    _check_vector(fixture["b"], b, "countermodels.b")
    s1 = sum((z[index] ** 2 * d[index] for index in range(len(z) - 1, -1, -1)), Fraction(0))
    s_minus1 = sum((z[index] ** 2 / d[index] for index in range(len(z) - 1, -1, -1)), Fraction(0))
    _check_fraction(fixture["rational_high_energy_S1"], s1, "countermodels.S1")
    _check_fraction(fixture["rational_inverse_high_energy_S_minus1"], s_minus1, "countermodels.S_minus1")

    mass = s1 + 1
    c_plus = _diag([mass, Fraction(1)] + d)
    c_minus = _diag([-mass, Fraction(1)] + d)
    sign = _require_keys(fixture["sign_model"], {"M", "C_plus", "C_minus", "nu_plus", "nu_minus"}, "countermodels.sign_model")
    _check_fraction(sign["M"], mass, "countermodels.sign_model.M")
    _check_matrix(sign["C_plus"], c_plus, "countermodels.sign_model.C_plus")
    _check_matrix(sign["C_minus"], c_minus, "countermodels.sign_model.C_minus")
    nu_plus = mass + s1
    nu_minus = -mass + s1
    _check_fraction(sign["nu_plus"], nu_plus, "countermodels.sign_model.nu_plus")
    _check_fraction(sign["nu_minus"], nu_minus, "countermodels.sign_model.nu_minus")
    if not (nu_plus > 0 > nu_minus):
        raise ReplayError("same-jump opposite-nu signs were not reconstructed")

    c_good = c_plus
    c_bad = _diag([mass, Fraction(-1)] + d)
    invisible = _require_keys(fixture["invisible_floor_model"], {
        "C_good", "C_bad", "cyclic_moments_good", "cyclic_moments_bad", "good_floor", "bad_floor",
    }, "countermodels.invisible_floor_model")
    _check_matrix(invisible["C_good"], c_good, "countermodels.invisible.C_good")
    _check_matrix(invisible["C_bad"], c_bad, "countermodels.invisible.C_bad")
    expected_moments = [
        mass**order + sum((z[index] ** 2 * d[index] ** order for index in range(len(z))), Fraction(0))
        for order in range(5)
    ]
    _check_vector(invisible["cyclic_moments_good"], expected_moments, "countermodels.invisible.moments_good")
    _check_vector(invisible["cyclic_moments_bad"], expected_moments, "countermodels.invisible.moments_bad")
    _check_fraction(invisible["good_floor"], Fraction(1), "countermodels.invisible.good_floor")
    _check_fraction(invisible["bad_floor"], Fraction(-1), "countermodels.invisible.bad_floor")

    c1 = _diag([Fraction(2), Fraction(2)] + d)
    c2 = _diag([Fraction(0), Fraction(0)] + d)
    c2[0][0] = Fraction(2)
    c2[0][1] = Fraction(3, 2)
    c2[1][0] = Fraction(3, 2)
    c2[1][1] = Fraction(2)
    common_nu = Fraction(2) + s1
    chi1 = Fraction(1, 2) + s_minus1
    chi2 = Fraction(8, 7) + s_minus1
    surplus = Fraction(3, 4) + s_minus1
    inverse = _require_keys(fixture["inverse_load_model"], {
        "C1", "C2", "nu1", "nu2", "chi1", "chi2", "pole_axis_surplus",
        "decision1", "decision2", "nu_substituted_for_inverse_load",
    }, "countermodels.inverse_load_model")
    _check_matrix(inverse["C1"], c1, "countermodels.inverse.C1")
    _check_matrix(inverse["C2"], c2, "countermodels.inverse.C2")
    for key in ("nu1", "nu2"):
        _check_fraction(inverse[key], common_nu, f"countermodels.inverse.{key}")
    _check_fraction(inverse["chi1"], chi1, "countermodels.inverse.chi1")
    _check_fraction(inverse["chi2"], chi2, "countermodels.inverse.chi2")
    _check_fraction(inverse["pole_axis_surplus"], surplus, "countermodels.inverse.pole_axis_surplus")
    if inverse["nu_substituted_for_inverse_load"] is not False:
        raise ReplayError("nu was substituted for the inverse load")
    if inverse["decision1"] != "pass" or inverse["decision2"] != "fail":
        raise ReplayError("inverse-load decision mutation")
    if not (chi1 < surplus < chi2) or common_nu in (chi1, chi2):
        raise ReplayError("inverse-load separation was not reconstructed")

    embedding = _require_keys(fixture["pole_embedding"], {
        "beta", "mu", "pole_vector", "odd_pole_coefficient", "Q_shift_1", "Q_shift_2",
        "Q1", "Q2", "T1", "T2",
    }, "countermodels.pole_embedding")
    beta = Fraction(1, 4)
    pole = [Fraction(2)] + [Fraction(0) for _ in b]
    q_shift_1 = _block(surplus, b, c1)
    q_shift_2 = _block(surplus, b, c2)
    q1 = _add_identity(q_shift_1, beta)
    q2 = _add_identity(q_shift_2, beta)
    t1 = _add_outer(q1, pole, Fraction(2))
    t2 = _add_outer(q2, pole, Fraction(2))
    _check_fraction(embedding["beta"], beta, "countermodels.embedding.beta")
    _check_fraction(embedding["mu"], Fraction(4), "countermodels.embedding.mu")
    _check_vector(embedding["pole_vector"], pole, "countermodels.embedding.pole_vector")
    _check_fraction(embedding["odd_pole_coefficient"], Fraction(-2), "countermodels.embedding.odd_pole_coefficient")
    for key, expected in (
        ("Q_shift_1", q_shift_1), ("Q_shift_2", q_shift_2),
        ("Q1", q1), ("Q2", q2), ("T1", t1), ("T2", t2),
    ):
        _check_matrix(embedding[key], expected, f"countermodels.embedding.{key}")
    reconstructed_q1 = _add_outer(t1, pole, Fraction(-2))
    reconstructed_q2 = _add_outer(t2, pole, Fraction(-2))
    if reconstructed_q1 != q1 or reconstructed_q2 != q2:
        raise ReplayError("negative odd-pole reconstruction failed")
    return {
        "nu_plus": nu_plus,
        "nu_minus": nu_minus,
        "common_nu": common_nu,
        "chi1": chi1,
        "chi2": chi2,
        "surplus": surplus,
    }


def _balanced_sum(values: list[object]) -> object:
    if not values:
        return mp.iv.mpf(0)
    work = values[:]
    while len(work) > 1:
        next_work: list[object] = []
        for index in range(0, len(work) - 1, 2):
            next_work.append(work[index] + work[index + 1])  # type: ignore[operator]
        if len(work) % 2:
            next_work.append(work[-1])
        work = next_work
    return work[0]


def _check_intervals(value: Any, p: int, dps: int) -> int:
    fixture = _require_keys(value, {
        "partial_start", "partial_end", "dyadic_band_start", "dyadic_band_end",
        "log_weighted_partial", "inverse_log_weighted_partial", "dyadic_log_band",
        "scaled_dyadic_log_band",
    }, "interval_log_tails")
    upper = p * p
    if (
        fixture["partial_start"] != 3
        or fixture["partial_end"] != upper
        or fixture["dyadic_band_start"] != upper
        or fixture["dyadic_band_end"] != 2 * upper
    ):
        raise ReplayError("interval log-tail range mutation")
    mp.mp.dps = dps
    mp.iv.dps = dps
    iv = mp.iv.mpf
    j2 = iv(1) / (p * p)
    rational_part = sum((Fraction(1, k * k) for k in range(3, upper + 1)), Fraction(0))
    log_terms = [mp.iv.log(iv(k)) / (k * k) for k in range(upper, 2, -1)]
    weighted = j2 * (iv(rational_part.numerator) / rational_part.denominator + _balanced_sum(log_terms))
    inverse_terms = [
        j2 / ((iv(1) + mp.iv.log(iv(k))) * (k * k))
        for k in range(upper, 2, -1)
    ]
    inverse_weighted = _balanced_sum(inverse_terms)
    band_terms = [
        j2 * mp.iv.log(iv(k + 2)) / (k * k)
        for k in range(2 * upper, upper, -1)
    ]
    band = _balanced_sum(band_terms)
    scaled = iv(upper) / mp.iv.log(iv(upper)) * band
    expected = {
        "log_weighted_partial": weighted,
        "inverse_log_weighted_partial": inverse_weighted,
        "dyadic_log_band": band,
        "scaled_dyadic_log_band": scaled,
    }
    for key, reconstructed in expected.items():
        _contains(fixture[key], reconstructed, f"interval_log_tails.{key}", dps)
        lo, _hi = _interval(fixture[key], f"interval_log_tails.{key}", dps)
        if lo <= 0:
            raise ReplayError(f"nonpositive log-tail interval: {key}")
    return len(expected)


def _validate_sources(value: Any) -> None:
    if value != EXPECTED_SOURCE_HASHES:
        raise ReplayError("source hash inventory mismatch")
    for relative, expected in EXPECTED_SOURCE_HASHES.items():
        if _sha256(_root() / relative) != expected:
            raise ReplayError(f"live source hash mismatch: {relative}")


def _canonical_bytes(payload: dict[str, Any]) -> bytes:
    return (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")


def replay(payload: dict[str, Any], producer_bytes: bytes | None = None) -> dict[str, Any]:
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise ReplayError("mpmath runtime mismatch")
    _reject_float_or_secret(payload)
    top = _require_keys(payload, {
        "schema", "claim_class", "terminal_state", "checkpoint_version", "updated_date",
        "inputs", "source_hashes", "conventions", "provenance", "arithmetic",
        "certificate", "claim_boundary",
    }, "artifact")
    if (
        top["schema"] != PRODUCER_SCHEMA
        or top["claim_class"] != CLAIM_CLASS
        or top["terminal_state"] != TERMINAL_STATE
        or top["checkpoint_version"] != CHECKPOINT_VERSION
        or top["updated_date"] != UPDATED_DATE
    ):
        raise ReplayError("fixed metadata mutation")
    inputs = _require_keys(top["inputs"], {"lambda_numerator", "lambda_denominator", "dps"}, "inputs")
    p_text, denominator, dps_text = inputs["lambda_numerator"], inputs["lambda_denominator"], inputs["dps"]
    if (
        not isinstance(p_text, str) or _POSITIVE_INTEGER_TEXT.fullmatch(p_text) is None
        or p_text not in CANONICAL_LAMBDA_NUMERATORS
        or denominator != "2"
        or not isinstance(dps_text, str) or _POSITIVE_INTEGER_TEXT.fullmatch(dps_text) is None
        or dps_text not in CANONICAL_DPS
    ):
        raise ReplayError("noncanonical or unsupported input")
    p, dps = int(p_text), int(dps_text)
    _validate_sources(top["source_hashes"])
    if top["conventions"] != EXPECTED_CONVENTIONS:
        raise ReplayError("Fourier/pole/prime/endpoint convention mutation")
    if top["provenance"] != EXPECTED_PROVENANCE:
        raise ReplayError("forbidden input, cached matrix, or producer-boolean provenance mutation")
    if top["arithmetic"] != EXPECTED_ARITHMETIC:
        raise ReplayError("arithmetic library/independence disclosure mutation")
    if top["claim_boundary"] != EXPECTED_CLAIM_BOUNDARY:
        raise ReplayError("claim boundary mutation")
    certificate = _require_keys(top["certificate"], {
        "exact_third_moment", "nested_transverse_spaces", "jump_compatible_countermodels", "interval_log_tails",
    }, "certificate")
    nu = _check_third_moment(certificate["exact_third_moment"])
    floors = _check_nested(certificate["nested_transverse_spaces"])
    countermodels = _check_countermodels(certificate["jump_compatible_countermodels"], p)
    interval_count = _check_intervals(certificate["interval_log_tails"], p, dps)

    canonical = _canonical_bytes(payload)
    if producer_bytes is not None and producer_bytes != canonical:
        raise ReplayError("producer bytes are not canonical or do not bind the parsed payload")
    raw = canonical if producer_bytes is None else producer_bytes
    report: dict[str, Any] = {
        "schema": REPLAY_SCHEMA,
        "claim_class": CLAIM_CLASS,
        "terminal_state": TERMINAL_STATE,
        "checkpoint_version": CHECKPOINT_VERSION,
        "inputs": inputs,
        "producer_binding": {
            "sha256": hashlib.sha256(raw).hexdigest(),
            "canonical_byte_length": len(raw),
        },
        "reconstructed": {
            "source_hash_count": len(EXPECTED_SOURCE_HASHES),
            "exact_third_moment_identity": True,
            "third_moment_nu": {"numerator": str(nu.numerator), "denominator": str(nu.denominator)},
            "nested_transverse_floor_count": len(floors),
            "nested_transverse_floors": [
                {"numerator": str(value.numerator), "denominator": str(value.denominator)} for value in floors
            ],
            "same_jump_opposite_nu_signs": countermodels["nu_plus"] > 0 > countermodels["nu_minus"],
            "cyclic_data_do_not_force_floor": True,
            "same_nu_opposite_inverse_load_decisions": (
                countermodels["chi1"] < countermodels["surplus"] < countermodels["chi2"]
            ),
            "interval_count": interval_count,
            "finite_tail_length": p - 2,
            "shared_mpmath_iv_limitation_recorded": True,
            "uniform_arithmetic_schedule_proved": False,
        },
    }
    _reject_float_or_secret(report)
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True)
    parser.add_argument("--output")
    args = parser.parse_args()
    source = Path(args.input)
    raw = source.read_bytes()
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ReplayError("invalid producer JSON") from exc
    if not isinstance(payload, dict):
        raise ReplayError("producer artifact must be a JSON object")
    report = replay(payload, producer_bytes=raw)
    data = _canonical_bytes(report)
    if args.output:
        target = Path(args.output)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    else:
        print(data.decode("utf-8"), end="")


if __name__ == "__main__":
    main()
