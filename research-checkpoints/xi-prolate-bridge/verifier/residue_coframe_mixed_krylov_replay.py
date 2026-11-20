#!/usr/bin/env python3
"""Independent replay for the residue/coframe/mixed/Krylov checkpoint."""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


PRODUCER_SCHEMA = "xi-prolate-residue-coframe-mixed-krylov-v1"
REPLAY_SCHEMA = "xi-prolate-residue-coframe-mixed-krylov-replay-v1"
LOCK = "RESIDUE_COFRAME_MIXED_KRYLOV_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-residue-coframe-mixed-krylov-source-lock-v1"
CLAIM_CLASS = "PRESCRIBED_RESIDUE_MIXED_CAPTURE_ODD_KRYLOV_AUDIT"
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
EXPECTED_SOURCE_LOCK_SHA256 = "07820d02ae10c1911d35796a5ad018ffcdae4363f22f2b000074e430c7086375"
EXPECTED_MPMATH_VERSION = "1.4.1"

CANONICAL_LAMBDA_NUMERATORS = {"5", "9"}
CANONICAL_DPS = {"80", "160"}
_POSITIVE_INTEGER_TEXT = re.compile(r"[1-9][0-9]*\Z")
_SHA256 = re.compile(r"[0-9a-f]{64}\Z")
_SECRET_VALUE = re.compile(
    r"(?:\bBearer\s+[A-Za-z0-9._-]+|\bsk-[A-Za-z0-9_-]{8,}|"
    r"\bgh[pousr]_[A-Za-z0-9_]{8,}|\bxox[baprs]-[A-Za-z0-9-]{8,}|"
    r"OPENAI_API_KEY\s*=)",
    re.IGNORECASE,
)

LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15

EXPECTED_DEPENDENCIES = {
    "COVARIANCE_ANNULAR_ODD_SUBSEQUENCE_SOURCE_LOCK.json",
    "DIRECT_RH_ATTACK.md",
    "P0_MATRIX_FORMULAS.md",
    "P0_NORMALIZATION_AUDIT.md",
    "P0_SOURCE_LOCK.json",
    "notes/ANNULAR_GRAY_MASS_OBSTRUCTION.md",
    "notes/COVARIANCE_TANGENT_GRAPH_SPILL.md",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md",
    "notes/GROWING_WINDOW_THEOREM.md",
    "notes/MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT.md",
    "notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md",
    "notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md",
    "notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md",
    "notes/ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md",
    "notes/ODD_POLE_HARMONIC_CHEBYSHEV_OBSTRUCTION.md",
    "notes/PRESCRIBED_RESIDUE_COFRAME_AUDIT.md",
    "notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md",
    "notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md",
    "notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md",
    "notes/SOFT_DEFECT_PROLATE_ANGLE_REDUCTION.md",
    "requirements.txt",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/FKS-PNT-2204.02588v3.pdf",
}

EXPECTED_EXTERNAL_SOURCES = {
    "CCM-ZST-v1": {
        "version": "arXiv:2511.22755v1",
        "vendored_path": "vendor/CCM-ZST-2511.22755v1.pdf",
        "sha256": "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
        "use": "finite Weil convention, source equation (3.19), pole term, archimedean term, and inversion convention",
    },
    "FKS-PNT-v3": {
        "version": "arXiv:2204.02588v3",
        "vendored_path": "vendor/FKS-PNT-2204.02588v3.pdf",
        "sha256": "15eff02042f2c1ab4878d029ce52a0abd6c95d66995b183a2dbc689ce9af49a4",
        "use": "pinned unconditional prime-number-theorem input; no zero ordinate table",
    },
}

EXPECTED_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", "mpmath.iv 1.4.1"],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "nondegenerate intervals receive a precision-scaled dyadic enlargement",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and pinned mpmath.iv 1.4.1",
}

EXPECTED_ANNULAR_PARAMETERS = {
    "delta": Fraction(1, 2),
    "b0": Fraction(1),
    "sigma0": Fraction(1, 20),
}


class ReplayError(ValueError):
    """Raised when an artifact fails an independent replay check."""


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


def _fraction_list(value: Any, length: int, label: str) -> list[Fraction]:
    if not isinstance(value, list) or len(value) != length:
        raise ReplayError(f"malformed vector: {label}")
    return [_fraction(item, f"{label}[{index}]") for index, item in enumerate(value)]


def _fraction_matrix(value: Any, rows: int, columns: int, label: str) -> list[list[Fraction]]:
    if not isinstance(value, list) or len(value) != rows:
        raise ReplayError(f"malformed matrix: {label}")
    return [_fraction_list(row, columns, f"{label}[{index}]") for index, row in enumerate(value)]


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
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"malformed interval: {label}")
    decimal, dyadic = value["decimal"], value["dyadic"]
    if not isinstance(decimal, list) or len(decimal) != 2 or not all(isinstance(item, str) for item in decimal):
        raise ReplayError(f"malformed decimal interval: {label}")
    if not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}:
        raise ReplayError(f"malformed dyadic interval: {label}")
    lo = _raw_fraction(dyadic["lower"], f"{label}.lower")
    hi = _raw_fraction(dyadic["upper"], f"{label}.upper")
    if lo > hi:
        raise ReplayError(f"reversed interval: {label}")
    try:
        dlo, dhi = mp.mpf(decimal[0]), mp.mpf(decimal[1])
    except ValueError as exc:
        raise ReplayError(f"unparseable decimal interval: {label}") from exc
    if not (mp.isfinite(dlo) and mp.isfinite(dhi)) or dlo > dhi:
        raise ReplayError(f"invalid decimal interval: {label}")
    scale = max(
        abs(lo.numerator).bit_length() - lo.denominator.bit_length(),
        abs(hi.numerator).bit_length() - hi.denominator.bit_length(),
        0,
    )
    digits_bits = dps * LOG2_10_UPPER_NUMERATOR // LOG2_10_UPPER_DENOMINATOR
    cap_exponent = scale - digits_bits + 24
    cap = Fraction(2**cap_exponent) if cap_exponent >= 0 else Fraction(1, 2 ** (-cap_exponent))
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


def _contains(serialized: Any, value: object, label: str, dps: int) -> None:
    lo, hi = _interval(serialized, label, dps)
    expected_lo, expected_hi = _iv_bounds(value)
    if lo > expected_lo or hi < expected_hi:
        raise ReplayError(f"interval does not enclose independent reconstruction: {label}")


def _validate_lock() -> tuple[dict[str, Any], dict[str, Any]]:
    path = _root() / LOCK
    actual_lock_hash = _sha256(path)
    if actual_lock_hash != EXPECTED_SOURCE_LOCK_SHA256:
        raise ReplayError("source-lock byte hash mismatch")
    lock = json.loads(path.read_text(encoding="utf-8"))
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary", "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("source-lock inventory mismatch")
    if (
        lock["schema"] != LOCK_SCHEMA
        or lock["claim_class"] != CLAIM_CLASS
        or lock["terminal_state"] != TERMINAL_STATE
        or lock["updated_date"] != UPDATED_DATE
    ):
        raise ReplayError("source-lock fixed metadata mutation")

    dependencies: dict[str, str] = {}
    if not isinstance(lock["dependencies"], list):
        raise ReplayError("source-lock dependency list missing")
    for item in lock["dependencies"]:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        candidate = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str) or not relative or candidate.is_absolute()
            or ".." in candidate.parts or relative in dependencies
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ReplayError("invalid source-lock dependency")
        actual = _sha256(_root() / candidate)
        if actual != expected:
            raise ReplayError(f"dependency byte mismatch: {relative}")
        dependencies[relative] = actual
    if set(dependencies) != EXPECTED_DEPENDENCIES:
        raise ReplayError("source-lock dependency inventory mismatch")

    external_hashes: dict[str, str] = {}
    seen: set[str] = set()
    if not isinstance(lock["external_sources"], list):
        raise ReplayError("external source list missing")
    for item in lock["external_sources"]:
        if not isinstance(item, dict) or set(item) != {"id", "version", "vendored_path", "sha256", "use"}:
            raise ReplayError("malformed external source")
        source_id = item["id"]
        if source_id in seen or source_id not in EXPECTED_EXTERNAL_SOURCES:
            raise ReplayError("external source identifier mismatch")
        expected = EXPECTED_EXTERNAL_SOURCES[source_id]
        if any(item[key] != expected[key] for key in expected):
            raise ReplayError(f"external source metadata mismatch: {source_id}")
        actual = _sha256(_root() / item["vendored_path"])
        if actual != item["sha256"] or dependencies.get(item["vendored_path"]) != actual:
            raise ReplayError(f"external source byte mismatch: {source_id}")
        seen.add(source_id)
        external_hashes[item["vendored_path"]] = actual
    if seen != set(EXPECTED_EXTERNAL_SOURCES):
        raise ReplayError("external source inventory mismatch")

    binding = {
        "path": LOCK,
        "sha256": actual_lock_hash,
        "schema": LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(dependencies.items())),
        "external_source_hashes": dict(sorted(external_hashes.items())),
    }
    return binding, lock


def _factor_integer(value: int) -> list[tuple[int, int]]:
    """Factor one integer directly; no prime-power generation loop is used."""
    remaining = value
    divisor = 2
    factors: list[tuple[int, int]] = []
    while divisor * divisor <= remaining:
        if remaining % divisor:
            divisor = 3 if divisor == 2 else divisor + 2
            continue
        exponent = 0
        while remaining % divisor == 0:
            remaining //= divisor
            exponent += 1
        factors.append((divisor, exponent))
        divisor = 3 if divisor == 2 else divisor + 2
    if remaining > 1:
        factors.append((remaining, 1))
    return factors


def _inventory(p: int) -> list[dict[str, int]]:
    endpoint = (p * p) // 4
    result: list[dict[str, int]] = []
    for value in range(2, endpoint + 1):
        factors = _factor_integer(value)
        if len(factors) == 1:
            base, exponent = factors[0]
            result.append({"n": value, "prime_base": base, "exponent": exponent})
    return result


def _transpose(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    return [list(row) for row in zip(*matrix)]


def _matmul(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    right_t = _transpose(right)
    return [[sum((a * b for a, b in zip(row, column)), Fraction(0)) for column in right_t] for row in left]


def _diag(values: list[Fraction]) -> list[list[Fraction]]:
    return [[value if i == j else Fraction(0) for j, value in enumerate(values)] for i in range(len(values))]


def _matrix_equal(left: list[list[Fraction]], right: list[list[Fraction]], label: str) -> None:
    if left != right:
        raise ReplayError(f"exact matrix mutation: {label}")


def _quadratic(vector: list[Fraction], matrix: list[list[Fraction]]) -> Fraction:
    return sum(
        (vector[i] * matrix[i][j] * vector[j] for i in range(len(vector)) for j in range(len(vector))),
        Fraction(0),
    )


def _three_moment_gate(
    alpha_minus_beta: Fraction,
    nu: Fraction,
    b_norm_squared: Fraction,
) -> bool:
    """Implement both strict hypotheses; the product test alone is unsound."""
    return nu > 0 and alpha_minus_beta * nu > b_norm_squared * b_norm_squared


def _ceil_fraction(value: Fraction) -> int:
    return -((-value.numerator) // value.denominator)


def _ceil_iv(value: object, label: str) -> int:
    lo, hi = _iv_bounds(value)
    lower = _ceil_fraction(lo)
    upper = _ceil_fraction(hi)
    if lower != upper:
        raise ReplayError(f"independent interval ceiling undecidable: {label}")
    return lower


def _independent_transcendentals(
    p: int,
    dps: int,
    inventory: list[dict[str, int]],
    delta: Fraction,
    b0: Fraction,
    sigma0: Fraction,
    q_count: int,
) -> tuple[dict[str, object], list[dict[str, object]], dict[str, Any]]:
    """Reconstruct arithmetic profiles without using producer code or caches."""
    mp.iv.dps = dps
    iv = mp.iv.mpf
    lam = iv(p) / iv(2)
    length = iv(2) * mp.iv.log(lam)
    x_value = mp.iv.log(iv(7) / iv(5))
    y_value = lam * iv(7) / iv(5)
    z_value = lam * iv(5) / iv(7)

    # The inclusion sets are decided by exact rational threshold arithmetic.
    y_exact = Fraction(7 * p, 10)
    z_exact = Fraction(5 * p, 14)
    psi_y = iv(0)
    psi_z = iv(0)
    a_y = iv(0)
    a_z = iv(0)
    y_members: list[int] = []
    z_members: list[int] = []
    for item in inventory:
        n = item["n"]
        log_base = mp.iv.log(iv(item["prime_base"]))
        if Fraction(n) <= y_exact:
            y_members.append(n)
            psi_y += log_base
            a_y += log_base / iv(n)
        if Fraction(n) <= z_exact:
            z_members.append(n)
            psi_z += log_base
            a_z += log_base / iv(n)
    prime_action = (
        mp.iv.sqrt(iv(5) / iv(7)) * (psi_y + a_z)
        - mp.iv.sqrt(iv(7) / iv(5)) * (a_y + psi_z)
    ) / iv(2)
    half_x = x_value / iv(2)
    ell = length / iv(2)
    def iv_sinh(argument: object) -> object:
        return (mp.iv.exp(argument) - mp.iv.exp(-argument)) / iv(2)

    def iv_cosh(argument: object) -> object:
        return (mp.iv.exp(argument) + mp.iv.exp(-argument)) / iv(2)

    p_at_x = iv_sinh(half_x)
    e_y = psi_y - y_value
    e_z = psi_z - z_value
    d_y = a_y - mp.iv.log(y_value)
    d_z = a_z - mp.iv.log(z_value)
    split_prime_action = (
        (lam - ell) * p_at_x
        - x_value * iv_cosh(half_x)
        + (
            mp.iv.sqrt(iv(5) / iv(7)) * e_y
            - mp.iv.sqrt(iv(7) / iv(5)) * e_z
            + mp.iv.sqrt(iv(5) / iv(7)) * d_z
            - mp.iv.sqrt(iv(7) / iv(5)) * d_y
        ) / iv(2)
    )

    thresholds: list[dict[str, object]] = []
    log_lam = mp.iv.log(lam)
    for item in inventory:
        n = item["n"]
        base = item["prime_base"]
        threshold = mp.iv.log(iv(2 * n) / iv(p))
        jump = mp.iv.log(iv(base)) * iv_sinh(log_lam / iv(2)) / mp.iv.sqrt(iv(n))
        thresholds.append(
            {
                "n": n,
                "prime_base": base,
                "exponent": item["exponent"],
                "x_n": threshold,
                "jump": jump,
                "reflected_partner_is_integer": (p * p) % (4 * n) == 0,
            }
        )

    delta_iv = iv(delta.numerator) / iv(delta.denominator)
    b0_iv = iv(b0.numerator) / iv(b0.denominator)
    sigma_iv = iv(sigma0.numerator) / iv(sigma0.denominator)
    annular_trace = (b0_iv - delta_iv) / mp.iv.pi
    annular_rank_bound = annular_trace / sigma_iv

    central_m = _ceil_iv(lam * length, "central M")
    v_star = iv(368) * mp.iv.pi**3 * lam**7 + iv(108) * mp.iv.pi * lam**2
    bv_ratio = length * iv(q_count) * v_star**2 / (
        mp.iv.pi**2 * iv(central_m) * lam**2
    )

    values = {
        "lambda": lam,
        "physical_length_L": length,
        "fixed_x_log_7_over_5": x_value,
        "fixed_y_lambda_exp_x": y_value,
        "fixed_z_lambda_exp_minus_x": z_value,
        "psi_y": psi_y,
        "psi_z": psi_z,
        "A_y": a_y,
        "A_z": a_z,
        "fixed_prime_action_value": prime_action,
        "annular_trace_upper": annular_trace,
        "annular_rank_bound": annular_rank_bound,
        "bv_V_star": v_star,
        "bv_ratio_floor": bv_ratio,
    }
    metadata = {
        "fixed_prime_action": {
            "x_exp_ratio": {"numerator": "7", "denominator": "5"},
            "y_members": y_members,
            "z_members": z_members,
            "translation_value": prime_action,
            "split_chebyshev_value": split_prime_action,
        },
        "annular_trace_rank": {
            "delta": delta,
            "b0": b0,
            "sigma0": sigma0,
        },
        "bv_ratio_floor": {
            "q": q_count,
            "M": central_m,
        },
    }
    return values, thresholds, metadata


def _mixed_fixture() -> dict[str, Any]:
    d = [
        [Fraction(2), Fraction(1), Fraction(0)],
        [Fraction(1), Fraction(2), Fraction(1)],
        [Fraction(0), Fraction(1), Fraction(2)],
    ]
    d_inverse = [
        [Fraction(3, 4), Fraction(-1, 2), Fraction(1, 4)],
        [Fraction(-1, 2), Fraction(1), Fraction(-1, 2)],
        [Fraction(1, 4), Fraction(-1, 2), Fraction(3, 4)],
    ]
    w = [
        [Fraction(1), Fraction(0), Fraction(1)],
        [Fraction(0), Fraction(1), Fraction(0)],
        [Fraction(1, 2), Fraction(1, 4), Fraction(-1, 2)],
    ]
    physical_b = _diag([Fraction(1), Fraction(1), Fraction(-1)])
    signed_pullback = _matmul(_matmul(_transpose(w), physical_b), w)
    frame = _matmul(_matmul(w, d_inverse), _transpose(w))
    change = [
        [Fraction(1), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(1), Fraction(1)],
        [Fraction(0), Fraction(0), Fraction(-1)],
    ]
    d_mixed = _matmul(_matmul(_transpose(change), d), change)
    w_mixed = _matmul(w, change)
    witness = [Fraction(1), Fraction(0), Fraction(-1)]
    return {
        "D_sep": d,
        "D_sep_inverse": d_inverse,
        "W_sep": w,
        "B_physical": physical_b,
        "signed_pullback": signed_pullback,
        "frame_operator": frame,
        "mixed_change": change,
        "D_mixed": d_mixed,
        "W_mixed": w_mixed,
        "coframe_lower_bound": Fraction(1, 16),
        "block_0_relative_floor": Fraction(3, 8),
        "block_2_generalized_polynomial": [Fraction(48), Fraction(-50), Fraction(11)],
        "block_2_relative_floor_squared_form": Fraction(25),
        "block_2_relative_floor_radical": Fraction(97),
        "block_2_relative_floor_denominator": Fraction(48),
        "negative_witness": witness,
        "negative_witness_signed_value": _quadratic(witness, signed_pullback),
        "negative_witness_source_value": _quadratic(witness, d),
    }


def _odd_fixture() -> dict[str, Any]:
    beta = Fraction(1, 4)
    mu = Fraction(3)
    a = Fraction(2)
    sigma = Fraction(1)
    d1 = Fraction(1, 4)
    d2 = Fraction(2)
    b_fail = [
        [a, sigma, Fraction(0)],
        [sigma, d1, Fraction(0)],
        [Fraction(0), Fraction(0), d2],
    ]
    b_pass = [
        [a, Fraction(0), sigma],
        [Fraction(0), d1, Fraction(0)],
        [sigma, Fraction(0), d2],
    ]
    q_fail = [[entry + (beta if i == j else 0) for j, entry in enumerate(row)] for i, row in enumerate(b_fail)]
    q_pass = [[entry + (beta if i == j else 0) for j, entry in enumerate(row)] for i, row in enumerate(b_pass)]
    e = [Fraction(1), Fraction(0), Fraction(0)]

    def moments(matrix: list[list[Fraction]]) -> list[Fraction]:
        q2 = _matmul(matrix, matrix)
        q3 = _matmul(q2, matrix)
        return [Fraction(1), _quadratic(e, matrix), _quadratic(e, q2), _quadratic(e, q3)]

    moments_fail = moments(q_fail)
    moments_pass = moments(q_pass)
    alpha = moments_pass[1]
    if moments_fail[1] != alpha or moments_fail[2] != moments_pass[2]:
        raise ReplayError("orientation twins do not share the locked scalar data")
    combined_residual_norm_squared = moments_pass[2] - alpha**2

    def moment_nu(moment_data: list[Fraction]) -> Fraction:
        alpha = moment_data[1]
        return (
            moment_data[3]
            - (2 * alpha + beta) * moment_data[2]
            + alpha**3
            + beta * alpha**2
        )

    transverse = [d1, d2]
    b_fail_vector = [sigma, Fraction(0)]
    b_pass_vector = [Fraction(0), sigma]

    def inverse_load(vector: list[Fraction]) -> Fraction:
        return sum((entry * entry / eigenvalue for entry, eigenvalue in zip(vector, transverse)), Fraction(0))

    def one_step_residual_squared(vector: list[Fraction], nu: Fraction) -> Fraction:
        scale = sum((entry * entry for entry in vector), Fraction(0)) / nu
        residual = [entry - eigenvalue * scale * entry for entry, eigenvalue in zip(vector, transverse)]
        return sum((entry * entry for entry in residual), Fraction(0))

    nu_fail = moment_nu(moments_fail)
    nu_pass = moment_nu(moments_pass)
    chi_fail = inverse_load(b_fail_vector)
    chi_pass = inverse_load(b_pass_vector)
    schur_gap_fail = a - chi_fail
    schur_gap_pass = a - chi_pass
    retained_load = 2 * mu / (2 * mu + schur_gap_pass)

    return {
        "beta": beta,
        "mu": mu,
        "a": a,
        "sigma": sigma,
        "d1": d1,
        "d2": d2,
        "B_fail": b_fail,
        "B_pass": b_pass,
        "Q_fail": q_fail,
        "Q_pass": q_pass,
        "moments_fail": moments_fail,
        "moments_pass": moments_pass,
        "alpha": alpha,
        "combined_residual_norm_squared": combined_residual_norm_squared,
        "nu_fail": nu_fail,
        "nu_pass": nu_pass,
        "chi_fail": chi_fail,
        "chi_pass": chi_pass,
        "schur_gap_fail": schur_gap_fail,
        "schur_gap_pass": schur_gap_pass,
        "kappa": min(transverse),
        "krylov_residual_norm_squared": one_step_residual_squared(b_pass_vector, nu_pass),
        "retained_excess_load_pass": retained_load,
        "retained_excess_gap_pass": 1 - retained_load,
    }


def _delayed_fixture(p: int) -> dict[str, Any]:
    delay = p
    amplitude = Fraction(1, p * p)
    before = [
        [Fraction(delay - 1), Fraction(0)],
        [Fraction(0), Fraction(0)],
    ]
    after = [
        [Fraction(delay - 1), Fraction(0)],
        [Fraction(0), amplitude * amplitude],
    ]
    return {
        "target_dimension": 2,
        "delay": delay,
        "amplitude": amplitude,
        "before_row_frame": before,
        "after_row_frame": after,
        "before_rank": 1,
        "after_rank": 2,
        "after_coframe_floor": amplitude * amplitude,
    }


def _validate_inputs(value: Any) -> tuple[str, int, str, int]:
    expected_keys = {
        "lambda_numerator", "lambda_denominator", "dps",
        "annular_parameters", "fixed_prime_action_exp_ratio", "bv_schedule",
    }
    if not isinstance(value, dict) or set(value) != expected_keys:
        raise ReplayError("input inventory mismatch")
    p_text = value["lambda_numerator"]
    denominator = value["lambda_denominator"]
    dps_text = value["dps"]
    if (
        not isinstance(p_text, str)
        or _POSITIVE_INTEGER_TEXT.fullmatch(p_text) is None
        or p_text not in CANONICAL_LAMBDA_NUMERATORS
        or denominator != "2"
        or not isinstance(dps_text, str)
        or dps_text not in CANONICAL_DPS
    ):
        raise ReplayError("noncanonical pilot input")
    if _fraction(value["fixed_prime_action_exp_ratio"], "fixed prime action ratio") != Fraction(7, 5):
        raise ReplayError("fixed prime-action point mutation")
    annular = value["annular_parameters"]
    if not isinstance(annular, dict) or set(annular) != set(EXPECTED_ANNULAR_PARAMETERS):
        raise ReplayError("annular parameter inventory mismatch")
    for key, expected in EXPECTED_ANNULAR_PARAMETERS.items():
        if _fraction(annular[key], f"annular parameter {key}") != expected:
            raise ReplayError(f"annular parameter mutation: {key}")
    expected_schedule = {
        "q_definition": "ceil(lambda^2)",
        "M_definition": "ceil(lambda*L)",
        "L_definition": "2*log(lambda)",
    }
    if value["bv_schedule"] != expected_schedule:
        raise ReplayError("BV schedule mutation")
    return p_text, int(p_text), dps_text, int(dps_text)


def _match_exact(value: Any, expected: Any, label: str) -> None:
    if isinstance(expected, Fraction):
        if _fraction(value, label) != expected:
            raise ReplayError(f"exact rational mutation: {label}")
        return
    if type(expected) is bool:
        if type(value) is not bool or value is not expected:
            raise ReplayError(f"Boolean mutation: {label}")
        return
    if type(expected) is int:
        if type(value) is not int or value != expected:
            raise ReplayError(f"integer mutation: {label}")
        return
    if isinstance(expected, str):
        if value != expected:
            raise ReplayError(f"text mutation: {label}")
        return
    if isinstance(expected, list):
        if not isinstance(value, list) or len(value) != len(expected):
            raise ReplayError(f"list inventory mismatch: {label}")
        for index, (actual_item, expected_item) in enumerate(zip(value, expected)):
            _match_exact(actual_item, expected_item, f"{label}[{index}]")
        return
    if isinstance(expected, dict):
        if not isinstance(value, dict) or set(value) != set(expected):
            raise ReplayError(f"object inventory mismatch: {label}")
        for key, expected_item in expected.items():
            _match_exact(value[key], expected_item, f"{label}.{key}")
        return
    if value != expected:
        raise ReplayError(f"value mutation: {label}")


def _check_exact_fixtures(certificate: dict[str, Any], p: int) -> None:
    serialized_odd = certificate["exact_odd_orientation_twins"]
    if not isinstance(serialized_odd, dict):
        raise ReplayError("malformed odd-orientation fixture")
    pass_a = _fraction(serialized_odd.get("a"), "odd pass alpha-minus-beta")
    pass_nu = _fraction(serialized_odd.get("nu_pass"), "odd pass nu")
    pass_b_norm_squared = _fraction(
        serialized_odd.get("combined_residual_norm_squared"),
        "odd combined residual norm squared",
    )
    if not _three_moment_gate(pass_a, pass_nu, pass_b_norm_squared):
        raise ReplayError("three-moment positive-nu gate failed")

    _match_exact(
        certificate["exact_mixed_countermodel"],
        _mixed_fixture(),
        "exact_mixed_countermodel",
    )
    _match_exact(
        certificate["exact_odd_orientation_twins"],
        _odd_fixture(),
        "exact_odd_orientation_twins",
    )
    _match_exact(
        certificate["exact_delayed_basis_coframe_no_go"],
        _delayed_fixture(p),
        "exact_delayed_basis_coframe_no_go",
    )

    mixed = _mixed_fixture()
    if mixed["negative_witness_signed_value"] >= 0 or mixed["negative_witness_source_value"] <= 0:
        raise ReplayError("mixed signed witness was not independently negative")
    odd = _odd_fixture()
    if not _three_moment_gate(odd["a"], odd["nu_pass"], odd["combined_residual_norm_squared"]):
        raise ReplayError("three-moment strict pass conditions failed")
    if _three_moment_gate(odd["a"], odd["nu_fail"], odd["sigma"] ** 2):
        raise ReplayError("fail orientation unexpectedly passes the moment gate")
    # Adversarial regression: the product inequality can hold with both factors
    # negative, but the separately locked nu>0 hypothesis must still reject it.
    if _three_moment_gate(Fraction(-2), Fraction(-1), Fraction(1)):
        raise ReplayError("negative-nu/product-passing adversarial gate accepted")
    if odd["schur_gap_fail"] > 0:
        raise ReplayError("fail orientation unexpectedly has a positive gap")
    if odd["schur_gap_pass"] <= 0 or odd["chi_pass"] >= odd["a"]:
        raise ReplayError("nonpositive pass orientation gap")
    if odd["retained_excess_gap_pass"] <= 0:
        raise ReplayError("nonpositive retained-excess gap")


EXPECTED_LOGICAL_THEOREMS = {
    "finite_analytic_intersection_only_zero": True,
    "principal_angle_decay_needed": True,
    "current_bv_certificate_scale_compatible": False,
    "some_non_effective_mixed_prefix_whole_target_capture": True,
    "mixed_prefix_effective_schedule_proved": False,
    "separate_residue_comparisons_imply_coupled_sign": False,
    "onto_coframe_preserves_inertia": True,
    "krylov_enclosure_is_conditional": True,
    "fixed_positive_inverse_load_gap_required": False,
    "unprojected_pole_exact_eigenvector": False,
    "prime_jumps_transfer_quantitatively_to_finite_compression": False,
}

EXPECTED_CHECKS = {
    "minus_prime_sign_preserved": True,
    "inclusive_prime_endpoint_complete": True,
    "mixed_negative_witness_found": True,
    "fail_orientation_schur_gap_nonpositive": True,
    "pass_orientation_schur_gap_positive": True,
    "pass_krylov_upper_below_surplus": True,
    "three_moment_positive_nu_gate_retained": True,
    "negative_nu_product_shortcut_rejected": True,
    "all_locked_prime_jumps_positive": True,
    "no_reflected_prime_jump_collisions": True,
    "equation_5_2_still_open": True,
    "signed_sector_floors_still_open": True,
    "prescribed_coframes_still_open": True,
    "odd_transverse_floor_still_open": True,
    "no_secret_or_api_key_read": True,
}


def _check_interval_formulas(
    section: Any,
    p: int,
    dps: int,
    inventory: list[dict[str, int]],
) -> tuple[int, int]:
    expected_keys = {
        "values", "prime_thresholds", "fixed_prime_action",
        "annular_trace_rank", "bv_ratio_floor",
    }
    if not isinstance(section, dict) or set(section) != expected_keys:
        raise ReplayError("interval formula inventory mismatch")
    q_count = (p * p + 3) // 4
    reconstructed, thresholds, metadata = _independent_transcendentals(
        p,
        dps,
        inventory,
        EXPECTED_ANNULAR_PARAMETERS["delta"],
        EXPECTED_ANNULAR_PARAMETERS["b0"],
        EXPECTED_ANNULAR_PARAMETERS["sigma0"],
        q_count,
    )

    values = section["values"]
    if not isinstance(values, dict) or set(values) != set(reconstructed):
        raise ReplayError("interval value inventory mismatch")
    for name, expected in reconstructed.items():
        _contains(values[name], expected, f"values.{name}", dps)

    serialized_thresholds = section["prime_thresholds"]
    if not isinstance(serialized_thresholds, list) or len(serialized_thresholds) != len(thresholds):
        raise ReplayError("prime-threshold inventory mismatch")
    for index, (actual, expected) in enumerate(zip(serialized_thresholds, thresholds)):
        keys = {"n", "prime_base", "exponent", "x_n", "jump", "reflected_partner_is_integer"}
        if not isinstance(actual, dict) or set(actual) != keys:
            raise ReplayError(f"prime-threshold record malformed: {index}")
        for key in ("n", "prime_base", "exponent", "reflected_partner_is_integer"):
            if actual[key] != expected[key] or type(actual[key]) is not type(expected[key]):
                raise ReplayError(f"prime-threshold metadata mutation: {index}.{key}")
        _contains(actual["x_n"], expected["x_n"], f"prime_thresholds[{index}].x_n", dps)
        _contains(actual["jump"], expected["jump"], f"prime_thresholds[{index}].jump", dps)
        jump_lo, _jump_hi = _interval(actual["jump"], f"prime_thresholds[{index}].jump", dps)
        if jump_lo <= 0:
            raise ReplayError(f"nonpositive prime jump: {index}")
        if actual["reflected_partner_is_integer"]:
            raise ReplayError(f"reflected prime-jump collision: {index}")

    fixed = section["fixed_prime_action"]
    fixed_expected = metadata["fixed_prime_action"]
    fixed_keys = {
        "x_exp_ratio", "y_members", "z_members",
        "translation_value", "split_chebyshev_value",
    }
    if not isinstance(fixed, dict) or set(fixed) != fixed_keys:
        raise ReplayError("fixed prime-action inventory mismatch")
    if _fraction(fixed["x_exp_ratio"], "fixed prime action ratio") != Fraction(7, 5):
        raise ReplayError("fixed prime-action ratio mutation")
    if fixed["y_members"] != fixed_expected["y_members"] or fixed["z_members"] != fixed_expected["z_members"]:
        raise ReplayError("fixed prime-action threshold membership mutation")
    _contains(fixed["translation_value"], fixed_expected["translation_value"], "fixed translation value", dps)
    _contains(fixed["split_chebyshev_value"], fixed_expected["split_chebyshev_value"], "fixed split-Chebyshev value", dps)
    translation = _interval(fixed["translation_value"], "fixed translation value", dps)
    split = _interval(fixed["split_chebyshev_value"], "fixed split-Chebyshev value", dps)
    if max(translation[0], split[0]) > min(translation[1], split[1]):
        raise ReplayError("independent prime-action formula paths do not overlap")
    if fixed["split_chebyshev_value"] != values["fixed_prime_action_value"]:
        raise ReplayError("redundant split-Chebyshev interval mutation")

    annular = section["annular_trace_rank"]
    annular_keys = {"delta", "b0", "sigma0", "trace_upper", "rank_bound", "maximum_integer_rank"}
    if not isinstance(annular, dict) or set(annular) != annular_keys:
        raise ReplayError("annular trace/rank inventory mismatch")
    for key, expected in EXPECTED_ANNULAR_PARAMETERS.items():
        if _fraction(annular[key], f"annular {key}") != expected:
            raise ReplayError(f"annular parameter mutation: {key}")
    _contains(annular["trace_upper"], reconstructed["annular_trace_upper"], "annular trace upper", dps)
    _contains(annular["rank_bound"], reconstructed["annular_rank_bound"], "annular rank bound", dps)
    rank_lo, rank_hi = _interval(annular["rank_bound"], "annular rank bound", dps)
    if rank_lo.numerator // rank_lo.denominator != 3 or rank_hi.numerator // rank_hi.denominator != 3:
        raise ReplayError("annular maximum integer rank is not rigorous")
    if annular["maximum_integer_rank"] != 3:
        raise ReplayError("annular integer-rank fixture mutation")
    if annular["trace_upper"] != values["annular_trace_upper"] or annular["rank_bound"] != values["annular_rank_bound"]:
        raise ReplayError("redundant annular interval mutation")

    bv = section["bv_ratio_floor"]
    bv_keys = {"q", "M", "V_star", "ratio"}
    if not isinstance(bv, dict) or set(bv) != bv_keys:
        raise ReplayError("BV ratio inventory mismatch")
    expected_bv = metadata["bv_ratio_floor"]
    if bv["q"] != q_count or type(bv["q"]) is not int:
        raise ReplayError("BV q mutation")
    if bv["M"] != expected_bv["M"] or type(bv["M"]) is not int:
        raise ReplayError("BV M mutation")
    _contains(bv["V_star"], reconstructed["bv_V_star"], "BV V_star", dps)
    _contains(bv["ratio"], reconstructed["bv_ratio_floor"], "BV ratio", dps)
    ratio_lo, _ratio_hi = _interval(bv["ratio"], "BV ratio", dps)
    if ratio_lo <= 0:
        raise ReplayError("nonpositive BV ratio")
    if bv["V_star"] != values["bv_V_star"] or bv["ratio"] != values["bv_ratio_floor"]:
        raise ReplayError("redundant BV interval mutation")
    return len(reconstructed), len(thresholds)


def replay(payload: dict[str, Any], producer_bytes: bytes | None = None) -> dict[str, Any]:
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise ReplayError("mpmath runtime mismatch")
    _reject_float_or_secret(payload)
    expected_top = {
        "schema", "source_lock", "inputs", "terminal_state",
        "source_conventions", "claim_boundary", "certificate",
        "arithmetic_libraries",
    }
    if not isinstance(payload, dict) or set(payload) != expected_top:
        raise ReplayError("producer payload inventory mismatch")
    if payload["schema"] != PRODUCER_SCHEMA:
        raise ReplayError("producer schema mutation")
    if payload["terminal_state"] != TERMINAL_STATE:
        raise ReplayError("terminal-status mutation")
    if payload["arithmetic_libraries"] != EXPECTED_LIBRARIES:
        raise ReplayError("arithmetic-library disclosure mutation")

    live_binding, lock = _validate_lock()
    if payload["source_lock"] != live_binding:
        raise ReplayError("source-lock binding mutation")
    if payload["source_conventions"] != lock["locked_conventions"]:
        raise ReplayError("source convention mutation")
    if payload["claim_boundary"] != lock["claim_boundary"]:
        raise ReplayError("claim-boundary mutation")
    p_text, p, dps_text, dps = _validate_inputs(payload["inputs"])

    certificate = payload["certificate"]
    expected_certificate_keys = {
        "exact_mixed_countermodel",
        "exact_odd_orientation_twins",
        "exact_delayed_basis_coframe_no_go",
        "inclusive_prime_powers",
        "interval_formulas",
        "source_admissions",
        "logical_theorems",
        "checks",
    }
    if not isinstance(certificate, dict) or set(certificate) != expected_certificate_keys:
        raise ReplayError("certificate inventory mismatch")
    if certificate["source_admissions"] != lock["source_admissions"]:
        raise ReplayError("source-admission mutation")
    if certificate["logical_theorems"] != EXPECTED_LOGICAL_THEOREMS:
        raise ReplayError("logical-theorem mutation")
    if certificate["checks"] != EXPECTED_CHECKS:
        raise ReplayError("producer Boolean inventory is not independently valid")

    _check_exact_fixtures(certificate, p)
    inventory = _inventory(p)
    if certificate["inclusive_prime_powers"] != inventory:
        raise ReplayError("inclusive prime-power inventory mutation")
    interval_count, threshold_count = _check_interval_formulas(
        certificate["interval_formulas"], p, dps, inventory
    )

    admissions = lock["source_admissions"]
    mandatory_false = {
        "actual_prescribed_plus_coframe_proved",
        "actual_prescribed_minus_coframe_proved",
        "actual_prescribed_annular_capture_proved",
        "actual_odd_transverse_floor_proved",
        "actual_odd_harmonic_short_proved",
        "api_key_read",
        "binary64_parameters_used",
        "cached_matrix_or_eigenvector_read",
        "decimal_zero_list_read",
        "determinant_limit_claimed",
        "environment_secret_read",
        "equation_5_2_claimed",
        "fixed_inverse_load_margin_claimed",
        "fourier_sign_changed",
        "global_weil_positivity_assumed",
        "inversion_reflection_dropped",
        "lambda_squared_mixed_with_lambda",
        "mixed_prefix_effective_schedule_proved",
        "mixed_prefix_signed_floor_proved",
        "nonpositive_schur_gap_reported_as_pass",
        "prime_block_sign_changed",
        "prime_power_endpoint_omitted",
        "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence",
        "riemann_hypothesis_assumed_or_claimed",
        "secret_serialized",
        "unit_source_normalization_substituted",
        "zero_reality_assumed",
    }
    if set(admissions) != mandatory_false or any(admissions[key] is not False for key in mandatory_false):
        raise ReplayError("unsafe source admission")

    canonical = (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")
    if producer_bytes is not None and producer_bytes != canonical:
        raise ReplayError("producer byte stream is not canonical")
    producer_hash = hashlib.sha256(canonical).hexdigest()
    return {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "source_lock": live_binding,
        "producer_binding": {
            "sha256": producer_hash,
            "canonical_bytes": len(canonical),
        },
        "reconstructed": {
            "lambda_numerator": p_text,
            "dps": dps_text,
            "dependency_count": len(EXPECTED_DEPENDENCIES),
            "external_source_count": len(EXPECTED_EXTERNAL_SOURCES),
            "prime_power_count": len(inventory),
            "prime_threshold_count": threshold_count,
            "interval_count": interval_count,
            "mixed_negative_witness_reconstructed": True,
            "odd_orientation_twins_reconstructed": True,
            "positive_pass_schur_gap_reconstructed": True,
            "all_prime_jumps_strictly_positive": True,
            "no_reflected_prime_jump_collisions": True,
            "prime_action_formula_paths_overlap": True,
            "annular_maximum_integer_rank": 3,
            "claim_boundary_retained": True,
        },
        "arithmetic_limitation": EXPECTED_LIBRARIES["independence_limitation"],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    input_path = Path(args.input)
    producer_bytes = input_path.read_bytes()
    payload = json.loads(producer_bytes.decode("utf-8"))
    report = replay(payload, producer_bytes=producer_bytes)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(report, indent=2, sort_keys=True, allow_nan=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
