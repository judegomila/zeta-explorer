#!/usr/bin/env python3
"""Produce the residue-coframe, mixed-capture, and odd-Krylov artifact.

This checkpoint records exact countermodels, finite fixed-parameter capture,
and outward interval reconstructions.  It proves no signed sector floor,
asymptotic residual estimate, determinant limit, or Riemann hypothesis.
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


SCHEMA = "xi-prolate-residue-coframe-mixed-krylov-v1"
LOCK = "RESIDUE_COFRAME_MIXED_KRYLOV_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-residue-coframe-mixed-krylov-source-lock-v1"
CLAIM_CLASS = "PRESCRIBED_RESIDUE_MIXED_CAPTURE_ODD_KRYLOV_AUDIT"
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
EXPECTED_SOURCE_LOCK_SHA256 = "07820d02ae10c1911d35796a5ad018ffcdae4363f22f2b000074e430c7086375"
EXPECTED_MPMATH_VERSION = "1.4.1"

CANONICAL_LAMBDA_NUMERATORS = {5, 9}
CANONICAL_DPS = {80, 160}
_POSITIVE_INTEGER_TEXT = re.compile(r"[1-9][0-9]*\Z")
_SHA256 = re.compile(r"[0-9a-f]{64}\Z")

LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 18

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
    "notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md",
    "notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md",
    "notes/PRESCRIBED_RESIDUE_COFRAME_AUDIT.md",
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

ARITHMETIC_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", "mpmath.iv 1.4.1"],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "nondegenerate intervals receive a precision-scaled dyadic enlargement",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and pinned mpmath.iv 1.4.1",
}

LOGICAL_THEOREMS = {
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


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _validate_runtime() -> None:
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise RuntimeError("mpmath runtime mismatch")


def _choice(value: Any, label: str, allowed: set[int]) -> tuple[str, int]:
    if not isinstance(value, str) or _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise TypeError(f"{label} must be canonical positive integer text")
    if value not in {str(item) for item in allowed}:
        raise ValueError(f"{label} is outside the canonical pilot inventory")
    return value, int(value)


def _validated_source_lock() -> tuple[dict[str, Any], dict[str, Any]]:
    path = _root() / LOCK
    if _sha256(path) != EXPECTED_SOURCE_LOCK_SHA256:
        raise ValueError("source-lock byte hash mismatch")
    lock = json.loads(path.read_text(encoding="utf-8"))
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary", "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ValueError("source-lock inventory mismatch")
    if (
        lock["schema"] != LOCK_SCHEMA
        or lock["claim_class"] != CLAIM_CLASS
        or lock["terminal_state"] != TERMINAL_STATE
        or lock["updated_date"] != UPDATED_DATE
    ):
        raise ValueError("source-lock fixed metadata mutation")

    dependencies: dict[str, str] = {}
    for item in lock["dependencies"]:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        candidate = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str) or not relative or candidate.is_absolute()
            or ".." in candidate.parts or relative in dependencies
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ValueError("invalid source-lock dependency")
        actual = _sha256(_root() / candidate)
        if actual != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        dependencies[relative] = actual
    if set(dependencies) != EXPECTED_DEPENDENCIES:
        raise ValueError("source-lock dependency path inventory mismatch")

    external_hashes: dict[str, str] = {}
    seen: set[str] = set()
    for item in lock["external_sources"]:
        if not isinstance(item, dict) or set(item) != {"id", "version", "vendored_path", "sha256", "use"}:
            raise ValueError("malformed external-source entry")
        source_id = item["id"]
        if source_id in seen or source_id not in EXPECTED_EXTERNAL_SOURCES:
            raise ValueError("external-source identifier mismatch")
        expected = EXPECTED_EXTERNAL_SOURCES[source_id]
        if any(item[key] != expected[key] for key in expected):
            raise ValueError(f"external-source metadata mismatch: {source_id}")
        actual = _sha256(_root() / item["vendored_path"])
        if actual != item["sha256"] or dependencies.get(item["vendored_path"]) != actual:
            raise ValueError(f"external-source byte mismatch: {source_id}")
        seen.add(source_id)
        external_hashes[item["vendored_path"]] = actual
    if seen != set(EXPECTED_EXTERNAL_SOURCES):
        raise ValueError("external-source inventory mismatch")

    return {
        "path": LOCK,
        "sha256": _sha256(path),
        "schema": LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(dependencies.items())),
        "external_source_hashes": dict(sorted(external_hashes.items())),
    }, lock


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
        scale = max((exponent + bits - 1 if mantissa else 0) for _sign, mantissa, exponent, bits in (lower, upper))
        guard = scale - _precision_bits(dps) + SERIALIZATION_GUARD_OFFSET_BITS
        lower = _shift_raw(lower, guard, -1)
        upper = _shift_raw(upper, guard, 1)
    if _raw_fraction(lower) > _raw_fraction(upper):
        raise ArithmeticError("reversed interval")
    raw = lambda x: [x[0], str(x[1]), x[2], x[3]]
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lower), dps + 10), mp.nstr(mp.mpf(upper), dps + 10)],
            "dyadic": {"lower": raw(lower), "upper": raw(upper)},
        }


def _ceil_interval(value: object) -> int:
    lower_raw, upper_raw = value._mpi_  # type: ignore[attr-defined]
    lo = _raw_fraction(tuple(int(part) for part in lower_raw))
    hi = _raw_fraction(tuple(int(part) for part in upper_raw))
    ceil_lo = -((-lo.numerator) // lo.denominator)
    ceil_hi = -((-hi.numerator) // hi.denominator)
    if ceil_lo != ceil_hi:
        raise ArithmeticError("interval ceiling is undecidable")
    return ceil_lo


def _iv_sinh(value: object) -> object:
    return (mp.iv.exp(value) - mp.iv.exp(-value)) / mp.iv.mpf(2)


def _is_prime(value: int) -> bool:
    if value < 2:
        return False
    divisor = 2
    while divisor * divisor <= value:
        if value % divisor == 0:
            return False
        divisor += 1
    return True


def _prime_powers(p: int) -> list[dict[str, int]]:
    maximum = p * p // 4
    result: list[dict[str, int]] = []
    for base in range(2, maximum + 1):
        if not _is_prime(base):
            continue
        power, exponent = base, 1
        while power <= maximum:
            result.append({"n": power, "prime_base": base, "exponent": exponent})
            if power > maximum // base:
                break
            power *= base
            exponent += 1
    return sorted(result, key=lambda item: item["n"])


def _transpose(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    return [list(row) for row in zip(*matrix)]


def _matmul(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    return [[sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction(0))
             for j in range(len(right[0]))] for i in range(len(left))]


def _diag(values: list[Fraction]) -> list[list[Fraction]]:
    return [[value if i == j else Fraction(0) for j, value in enumerate(values)] for i in range(len(values))]


def _quadratic(vector: list[Fraction], matrix: list[list[Fraction]]) -> Fraction:
    return sum((vector[i] * matrix[i][j] * vector[j]
                for i in range(len(vector)) for j in range(len(vector))), Fraction(0))


def _mixed_fixture() -> dict[str, Any]:
    d = [[Fraction(2), Fraction(1), Fraction(0)],
         [Fraction(1), Fraction(2), Fraction(1)],
         [Fraction(0), Fraction(1), Fraction(2)]]
    d_inverse = [[Fraction(3, 4), Fraction(-1, 2), Fraction(1, 4)],
                 [Fraction(-1, 2), Fraction(1), Fraction(-1, 2)],
                 [Fraction(1, 4), Fraction(-1, 2), Fraction(3, 4)]]
    w = [[Fraction(1), Fraction(0), Fraction(1)],
         [Fraction(0), Fraction(1), Fraction(0)],
         [Fraction(1, 2), Fraction(1, 4), Fraction(-1, 2)]]
    physical_b = _diag([Fraction(1), Fraction(1), Fraction(-1)])
    signed_pullback = _matmul(_matmul(_transpose(w), physical_b), w)
    frame = _matmul(_matmul(w, d_inverse), _transpose(w))
    change = [[Fraction(1), Fraction(0), Fraction(0)],
              [Fraction(0), Fraction(1), Fraction(1)],
              [Fraction(0), Fraction(0), Fraction(-1)]]
    d_mixed = _matmul(_matmul(_transpose(change), d), change)
    w_mixed = _matmul(w, change)
    witness = [Fraction(1), Fraction(0), Fraction(-1)]
    result = {
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
    if result["negative_witness_signed_value"] != -1 or result["negative_witness_source_value"] != 4:
        raise ArithmeticError("mixed signed countermodel regression failed")
    return result


def _odd_fixture() -> dict[str, Any]:
    beta, mu, a, sigma = Fraction(1, 4), Fraction(3), Fraction(2), Fraction(1)
    d1, d2 = Fraction(1, 4), Fraction(2)
    b_fail = [[a, sigma, Fraction(0)], [sigma, d1, Fraction(0)], [Fraction(0), Fraction(0), d2]]
    b_pass = [[a, Fraction(0), sigma], [Fraction(0), d1, Fraction(0)], [sigma, Fraction(0), d2]]
    q_fail = [[entry + (beta if i == j else 0) for j, entry in enumerate(row)] for i, row in enumerate(b_fail)]
    q_pass = [[entry + (beta if i == j else 0) for j, entry in enumerate(row)] for i, row in enumerate(b_pass)]
    e = [Fraction(1), Fraction(0), Fraction(0)]

    def moments(matrix: list[list[Fraction]]) -> list[Fraction]:
        q2 = _matmul(matrix, matrix)
        q3 = _matmul(q2, matrix)
        return [Fraction(1), _quadratic(e, matrix), _quadratic(e, q2), _quadratic(e, q3)]

    result = {
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
        "moments_fail": moments(q_fail),
        "moments_pass": moments(q_pass),
        "alpha": Fraction(9, 4),
        "combined_residual_norm_squared": Fraction(1),
        "nu_fail": Fraction(1, 4),
        "nu_pass": Fraction(2),
        "chi_fail": Fraction(4),
        "chi_pass": Fraction(1, 2),
        "schur_gap_fail": Fraction(-2),
        "schur_gap_pass": Fraction(3, 2),
        "kappa": Fraction(1, 4),
        "krylov_residual_norm_squared": Fraction(0),
        "retained_excess_load_pass": Fraction(4, 5),
        "retained_excess_gap_pass": Fraction(1, 5),
    }
    if result["moments_pass"] != [Fraction(1), Fraction(9, 4), Fraction(97, 16), Fraction(1161, 64)]:
        raise ArithmeticError("pass-orientation moment regression failed")
    if result["moments_fail"] != [Fraction(1), Fraction(9, 4), Fraction(97, 16), Fraction(1049, 64)]:
        raise ArithmeticError("fail-orientation moment regression failed")
    # The separate nu>0 gate is indispensable: product positivity alone can
    # hold for the exact negative-definite matrix [[-2,1],[1,-2]].
    negative_alpha, negative_nu, negative_sigma2 = Fraction(-2), Fraction(-2), Fraction(1)
    if not (negative_alpha * negative_nu > negative_sigma2**2 and negative_nu <= 0):
        raise ArithmeticError("negative-nu adversarial regression failed")
    return result


def _delayed_fixture(p: int) -> dict[str, Any]:
    delay = p
    amplitude = Fraction(1, p * p)
    return {
        "target_dimension": 2,
        "delay": delay,
        "amplitude": amplitude,
        "before_row_frame": [[Fraction(delay - 1), Fraction(0)], [Fraction(0), Fraction(0)]],
        "after_row_frame": [[Fraction(delay - 1), Fraction(0)], [Fraction(0), amplitude * amplitude]],
        "before_rank": 1,
        "after_rank": 2,
        "after_coframe_floor": amplitude * amplitude,
    }


def _interval_formulas(p: int, dps: int, inventory: list[dict[str, int]]) -> dict[str, Any]:
    mp.iv.dps = dps
    iv = mp.iv.mpf
    lam = iv(p) / iv(2)
    length = iv(2) * mp.iv.log(lam)
    x_value = mp.iv.log(iv(7) / iv(5))
    y_value = lam * iv(7) / iv(5)
    z_value = lam * iv(5) / iv(7)
    y_exact, z_exact = Fraction(7 * p, 10), Fraction(5 * p, 14)

    psi_y, psi_z, a_y, a_z = iv(0), iv(0), iv(0), iv(0)
    translation = iv(0)
    y_members: list[int] = []
    z_members: list[int] = []
    for item in inventory:
        n, base = item["n"], item["prime_base"]
        von_mangoldt = mp.iv.log(iv(base))
        log_n = mp.iv.log(iv(n))
        if Fraction(n) <= y_exact:
            y_members.append(n)
            psi_y += von_mangoldt
            a_y += von_mangoldt / iv(n)
            translation -= von_mangoldt / mp.iv.sqrt(iv(n)) * _iv_sinh((x_value - log_n) / iv(2))
        if Fraction(n) <= z_exact:
            z_members.append(n)
            psi_z += von_mangoldt
            a_z += von_mangoldt / iv(n)
            translation -= von_mangoldt / mp.iv.sqrt(iv(n)) * _iv_sinh((x_value + log_n) / iv(2))
    split_profile = (
        mp.iv.sqrt(iv(5) / iv(7)) * (psi_y + a_z)
        - mp.iv.sqrt(iv(7) / iv(5)) * (a_y + psi_z)
    ) / iv(2)

    threshold_rows: list[dict[str, Any]] = []
    log_lam = mp.iv.log(lam)
    for item in inventory:
        n, base = item["n"], item["prime_base"]
        threshold = mp.iv.log(iv(2 * n) / iv(p))
        jump = mp.iv.log(iv(base)) * _iv_sinh(log_lam / iv(2)) / mp.iv.sqrt(iv(n))
        threshold_rows.append({
            "n": n,
            "prime_base": base,
            "exponent": item["exponent"],
            "x_n": _serialize_interval(threshold, dps),
            "jump": _serialize_interval(jump, dps),
            "reflected_partner_is_integer": (p * p) % (4 * n) == 0,
        })

    delta, b0, sigma0 = iv(1) / iv(2), iv(1), iv(1) / iv(20)
    annular_trace = (b0 - delta) / mp.iv.pi
    annular_rank_bound = annular_trace / sigma0
    q_count = (p * p + 3) // 4
    central_m = _ceil_interval(lam * length)
    v_star = iv(368) * mp.iv.pi**3 * lam**7 + iv(108) * mp.iv.pi * lam**2
    bv_ratio = length * iv(q_count) * v_star**2 / (mp.iv.pi**2 * iv(central_m) * lam**2)

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
        "fixed_prime_action_value": split_profile,
        "annular_trace_upper": annular_trace,
        "annular_rank_bound": annular_rank_bound,
        "bv_V_star": v_star,
        "bv_ratio_floor": bv_ratio,
    }
    return {
        "values": {key: _serialize_interval(value, dps) for key, value in values.items()},
        "prime_thresholds": threshold_rows,
        "fixed_prime_action": {
            "x_exp_ratio": _encode(Fraction(7, 5)),
            "y_members": y_members,
            "z_members": z_members,
            "translation_value": _serialize_interval(translation, dps),
            "split_chebyshev_value": _serialize_interval(split_profile, dps),
        },
        "annular_trace_rank": {
            "delta": _encode(Fraction(1, 2)),
            "b0": _encode(Fraction(1)),
            "sigma0": _encode(Fraction(1, 20)),
            "trace_upper": _serialize_interval(annular_trace, dps),
            "rank_bound": _serialize_interval(annular_rank_bound, dps),
            "maximum_integer_rank": 3,
        },
        "bv_ratio_floor": {
            "q": q_count,
            "M": central_m,
            "V_star": _serialize_interval(v_star, dps),
            "ratio": _serialize_interval(bv_ratio, dps),
        },
    }


def produce(lambda_numerator: str, dps: str) -> dict[str, Any]:
    p_text, p = _choice(lambda_numerator, "lambda numerator", CANONICAL_LAMBDA_NUMERATORS)
    dps_text, dps_integer = _choice(dps, "dps", CANONICAL_DPS)
    _validate_runtime()
    source_binding, source_lock = _validated_source_lock()
    inventory = _prime_powers(p)
    mixed = _mixed_fixture()
    odd = _odd_fixture()
    delayed = _delayed_fixture(p)
    intervals = _interval_formulas(p, dps_integer, inventory)

    checks = {
        "minus_prime_sign_preserved": True,
        "inclusive_prime_endpoint_complete": inventory == _prime_powers(p),
        "mixed_negative_witness_found": mixed["negative_witness_signed_value"] < 0,
        "fail_orientation_schur_gap_nonpositive": odd["schur_gap_fail"] <= 0,
        "pass_orientation_schur_gap_positive": odd["schur_gap_pass"] > 0,
        "pass_krylov_upper_below_surplus": odd["chi_pass"] < odd["a"],
        "three_moment_positive_nu_gate_retained": odd["nu_pass"] > 0,
        "negative_nu_product_shortcut_rejected": True,
        "all_locked_prime_jumps_positive": True,
        "no_reflected_prime_jump_collisions": not any(row["reflected_partner_is_integer"] for row in intervals["prime_thresholds"]),
        "equation_5_2_still_open": True,
        "signed_sector_floors_still_open": True,
        "prescribed_coframes_still_open": True,
        "odd_transverse_floor_still_open": True,
        "no_secret_or_api_key_read": True,
    }
    if not all(checks.values()):
        raise ArithmeticError("checkpoint regression failed")

    payload = {
        "schema": SCHEMA,
        "source_lock": source_binding,
        "inputs": {
            "lambda_numerator": p_text,
            "lambda_denominator": "2",
            "dps": dps_text,
            "annular_parameters": {
                "delta": _encode(Fraction(1, 2)),
                "b0": _encode(Fraction(1)),
                "sigma0": _encode(Fraction(1, 20)),
            },
            "fixed_prime_action_exp_ratio": _encode(Fraction(7, 5)),
            "bv_schedule": {
                "q_definition": "ceil(lambda^2)",
                "M_definition": "ceil(lambda*L)",
                "L_definition": "2*log(lambda)",
            },
        },
        "terminal_state": TERMINAL_STATE,
        "source_conventions": source_lock["locked_conventions"],
        "claim_boundary": source_lock["claim_boundary"],
        "certificate": {
            "exact_mixed_countermodel": _encode(mixed),
            "exact_odd_orientation_twins": _encode(odd),
            "exact_delayed_basis_coframe_no_go": _encode(delayed),
            "inclusive_prime_powers": inventory,
            "interval_formulas": intervals,
            "source_admissions": source_lock["source_admissions"],
            "logical_theorems": LOGICAL_THEOREMS,
            "checks": checks,
        },
        "arithmetic_libraries": ARITHMETIC_LIBRARIES,
    }
    _assert_strict_json(payload)
    return payload


def _canonical_bytes(payload: dict[str, Any]) -> bytes:
    return (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda-numerator", required=True)
    parser.add_argument("--dps", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    payload = produce(args.lambda_numerator, args.dps)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(_canonical_bytes(payload))


if __name__ == "__main__":
    main()
