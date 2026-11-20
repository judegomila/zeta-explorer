#!/usr/bin/env python3
"""Interval producer for the hybrid outer-sampling odd-shift theorem."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-hybrid-outer-sampling-odd-shift-v1"
STATUS = "HYBRID_OUTER_SAMPLING_ODD_SHIFT_COMPONENT"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md"
SOURCE_LOCK = "HYBRID_OUTER_SAMPLING_SOURCE_LOCK.json"
M0 = 100000
GEOMETRY_INDICES = (0, 34)
MPMATH_VERSION = "1.4.1"
TIGHTNESS_GUARD_DIGITS = 12
_DECIMAL = re.compile(r"^[0-9]+(?:\.[0-9]+)?$")
_SHA256 = re.compile(r"^[0-9a-f]{64}$")

# The note hash is updated only when its proof text is deliberately changed.
PINNED_HASHES = {
    SOURCE_LOCK: (
        "65df5f6f47aa0718f1768d1dfafa5f5ec659e4c2681419ef130cd15572b6a9f9"
    ),
    NOTE: "113be74d52f48d66903c1babf1525ec6d130243321acfa31562abd8640868a3a",
    "notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md": (
        "b16d33c89dd1517875180a0a5b03f0c0e2b601b0e0e608090016174a464e1e11"
    ),
    "notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md": (
        "34bb4e43faf04f34e11126946b1069480375d5ba18baf9c97e9746b246594a0f"
    ),
    "ZERO_SAMPLING_SOURCE_LOCK.json": (
        "f4cad4acb30dbfcdc5b30faafe92934e8958ad1cd11cbf6abea932f902e8c101"
    ),
    "PROLATE_DEFECT_SOURCE_LOCK.json": (
        "0844df654ee968b1c371ec96618d10d219da9fde702d62faa4f0c6be139b036d"
    ),
}

RUNTIME_HASHES = {
    "requirements.txt": (
        "458f06e2b5d6e73acc7a4f72af69afe920764c71127578555044815cd785c0fa"
    )
}

LOCKED_FORMULAS = {
    "weighted_L2": (
        "||exp(y*t) O_lambda||_2^2 <= "
        "C_L2*lambda^3*L_lambda^2*epsilon(y)^(-1)*d4"
    ),
    "C_L2": "a4^2*(502299+C2^2/192)",
    "hybrid_block": (
        "Z_j*delta_j^(-3)*min((512/3)*E_lambda,"
        "(5120/3)*D_S*exp(-phi_j))*d4"
    ),
    "threshold": (
        "M_lambda=max(100000,ceil((18/a)*log(lambda))); "
        "J_lambda=min{j:x(log(2*T_j))>=M_lambda}"
    ),
    "odd_scale": "epsilon_lambda=||R_lambda||_mathfrakZ^2=o(d6)",
}

SOURCE_ADMISSIONS = {
    "zero_list_read": False,
    "zeros_assumed_real_globally": False,
    "global_Weil_positivity_assumed": False,
    "both_reflected_tails_retained": True,
    "complete_sampled_series_used_before_endpoint_split": True,
    "binary64_parameters_used": False,
    "effective_fixed_index_threshold_claimed": False,
    "signed_odd_floor_proved": False,
    "shifted_odd_schur_proved": False,
    "shifted_resolvent_proved": False,
    "rh_proved": False,
}

CLAIM_SCOPE = {
    "proved": [
        "complete-series degree-three weighted L2 bound",
        "exact convergent hybrid sampling series",
        "complete remainder absolute sampling is o(d6) on locked schedule",
    ],
    "not_proved": [
        "an unshifted or shifted odd-sector Weil floor",
        "positivity of the finite odd Schur complement",
        "an even-complement signed comparison",
        (
            "smallness of the normalized Ritz bound U_Z=epsilon_lambda/a^2 "
            "without separate lower control of a"
        ),
        "graph-dual residual action bound",
        "shifted-resolvent decay or equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform characteristic-function convergence",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _locked_dependency_hashes(root: Path) -> dict[str, str]:
    """Parse the pinned lock and re-hash every dependency it declares."""
    lock = json.loads((root / SOURCE_LOCK).read_text(encoding="utf-8"))
    expected_top = {
        "schema",
        "claim_class",
        "terminal_state",
        "updated_date",
        "dependencies",
        "locked_conventions",
        "locked_formulas",
        "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ValueError("hybrid source-lock inventory mismatch")
    if lock.get("schema") != "xi-prolate-hybrid-outer-sampling-source-lock-v1":
        raise ValueError("hybrid source-lock schema mismatch")
    dependencies = lock.get("dependencies")
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("hybrid source-lock dependency inventory missing")

    result: dict[str, str] = {}
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("hybrid source-lock dependency entry malformed")
        relative = item["path"]
        expected = item["sha256"]
        role = item["role"]
        if (
            not isinstance(relative, str)
            or not relative
            or Path(relative).is_absolute()
            or ".." in Path(relative).parts
            or not isinstance(expected, str)
            or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str)
            or not role
        ):
            raise ValueError("hybrid source-lock dependency fields malformed")
        if relative in result:
            raise ValueError(f"duplicate hybrid source-lock dependency: {relative}")
        if _sha256(root / relative) != expected:
            raise ValueError(f"source-lock dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _verified_source_hashes(root: Path) -> dict[str, str]:
    for relative, expected in PINNED_HASHES.items():
        if _sha256(root / relative) != expected:
            raise ValueError(f"pinned component hash mismatch: {relative}")
    combined = dict(PINNED_HASHES)
    for relative, expected in _locked_dependency_hashes(root).items():
        if relative in combined and combined[relative] != expected:
            raise ValueError(f"conflicting pinned component hash: {relative}")
        combined[relative] = expected
    return dict(sorted(combined.items()))


def _verified_runtime_hashes(root: Path) -> dict[str, str]:
    if mp.__version__ != MPMATH_VERSION:
        raise ValueError(
            f"mpmath runtime mismatch: expected {MPMATH_VERSION}, got {mp.__version__}"
        )
    for relative, expected in RUNTIME_HASHES.items():
        if _sha256(root / relative) != expected:
            raise ValueError(f"runtime dependency hash mismatch: {relative}")
    return dict(RUNTIME_HASHES)


def _decimal_text(value: object) -> str:
    if not isinstance(value, str) or _DECIMAL.fullmatch(value) is None:
        raise TypeError("lambda must be an unsigned decimal string, never binary64")
    return value


def _integer(value: object, name: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{name} must be an exact integer")
    if value < minimum:
        raise ValueError(f"{name} must be at least {minimum}")
    return value


def _capture(value: Any) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_
    lo_raw = tuple(lower)
    hi_raw = tuple(upper)
    bits = max(int(lo_raw[3]), int(hi_raw[3])) + 32
    with mp.workprec(bits):
        return mp.mpf(lo_raw), mp.mpf(hi_raw)


def _stable_ceil(value: Any, floor_value: int, name: str) -> int:
    lo, hi = _capture(value)
    with mp.workprec(max(lo._mpf_[3], hi._mpf_[3]) + 32):
        low_integer = max(floor_value, int(mp.ceil(lo)))
        high_integer = max(floor_value, int(mp.ceil(hi)))
    if low_integer != high_integer:
        raise ValueError(f"interval does not certify stable ceil for {name}")
    return low_integer


def _raw_endpoint(raw: tuple[int, int, int, int]) -> list[object]:
    return [int(raw[0]), str(int(raw[1])), int(raw[2]), int(raw[3])]


def _serialize(value: Any, digits: int) -> dict[str, object]:
    lower, upper = value._mpi_
    lo = tuple(int(item) for item in lower)
    hi = tuple(int(item) for item in upper)
    with mp.workdps(digits + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lo), digits), mp.nstr(mp.mpf(hi), digits)],
            "dyadic": {"lower": _raw_endpoint(lo), "upper": _raw_endpoint(hi)},
        }


def _geometry(index: int) -> dict[str, Any]:
    log_2t = mp.iv.log(6) + index * mp.iv.log(2)
    delta = 1 / (
        mp.iv.mpf("55.241")
        * mp.iv.power(log_2t, mp.iv.mpf(2) / 3)
        * mp.iv.power(mp.iv.log(log_2t), mp.iv.mpf(1) / 3)
    )
    phi = 3 * delta * log_2t / 4
    x = mp.iv.power(log_2t / mp.iv.log(log_2t), mp.iv.mpf(1) / 3)
    return {
        "log_2T": log_2t,
        "delta": delta,
        "phi": phi,
        "x": x,
        "translation_decay": mp.iv.exp(-phi),
    }


def _interval_assembly(lambda_text: str, dps: int) -> tuple[
    dict[str, Any], dict[str, int]
]:
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(lambda_text)
        if lam.a < 2:
            raise ValueError("lambda must be at least 2")
        # Unary plus materializes the lazy interval constant before iv.dps is
        # restored in the finally block.
        pi = +mp.iv.pi
        a4 = mp.iv.sqrt(3) / mp.iv.power(2, mp.iv.mpf(11) / 4)
        c2 = (
            40
            * mp.iv.power(3, -mp.iv.mpf(1) / 4)
            * mp.iv.exp(-(1 + mp.iv.sqrt(3)) / 2)
            / mp.iv.power(1 - 1 / mp.iv.sqrt(3), 2)
        )
        c_l2 = a4**2 * (mp.iv.mpf(502299) + c2**2 / 192)
        log_scale = 1 + mp.iv.log(2 + 2 * pi * lam**2)
        e_lambda = c_l2 * lam**3 * log_scale**2
        a = mp.iv.mpf(3) / (4 * mp.iv.mpf("55.241"))

        raw_m = (18 / a) * mp.iv.log(lam)
        m_lambda = _stable_ceil(raw_m, M0, "M_lambda")
        l_star = 6 * mp.iv.mpf(m_lambda) ** 3 * mp.iv.log(2 * m_lambda)
        raw_j = (l_star - mp.iv.log(6)) / mp.iv.log(2)
        j_upper = 1 + _stable_ceil(raw_j, 0, "J_upper")

        poly_log = (
            mp.iv.log(68688)
            + 11 * mp.iv.log(M0 + 1)
            + 5 * mp.iv.log(mp.iv.log(2 * (M0 + 1)))
        )
        absorption = a * M0 / 2 - poly_log
        derivative = (
            a / 2
            - mp.iv.mpf(11) / (M0 + 1)
            - mp.iv.mpf(5) / ((M0 + 1) * mp.iv.log(2 * (M0 + 1)))
        )
        tail = lam ** (-9) / (1 - mp.iv.exp(-a / 2))

        values: dict[str, Any] = {
            "lambda": lam,
            "pi": pi,
            "a4": a4,
            "C2": c2,
            "C_L2": c_l2,
            "L_lambda": log_scale,
            "E_lambda": e_lambda,
            "decay_a": a,
            "M_raw": raw_m,
            "L_star": l_star,
            "J_raw": raw_j,
            "polynomial_log_at_M0": poly_log,
            "absorption_margin": absorption,
            "derivative_margin": derivative,
            "tail_geometric_without_Z": tail,
        }
        for index in GEOMETRY_INDICES:
            for key, value in _geometry(index).items():
                values[f"{key}_j{index}"] = value
        for key, value in _geometry(j_upper).items():
            values[f"{key}_threshold_upper"] = value

        if _capture(absorption)[0] <= 0 or _capture(derivative)[0] <= 0:
            raise ValueError("explicit polynomial absorption certificate failed")
        if _capture(values["x_threshold_upper"])[0] < m_lambda:
            raise ValueError("summation threshold upper index is too small")
        return values, {"M_lambda": m_lambda, "J_upper": j_upper}
    finally:
        mp.iv.dps = old


def constants(lambda_text: str, dps: int = 80) -> dict[str, Any]:
    """Public interval assembly used by tests; no point-value conversion."""
    _decimal_text(lambda_text)
    _integer(dps, "interval precision", 50)
    values, integers = _interval_assembly(lambda_text, dps)
    return {"intervals": values, "integers": integers}


def produce(lambda_text: str, dps: int = 80) -> dict[str, Any]:
    lambda_text = _decimal_text(lambda_text)
    dps = _integer(dps, "interval precision", 50)
    root = _root()
    source_hashes = _verified_source_hashes(root)
    runtime_hashes = _verified_runtime_hashes(root)
    values, integers = _interval_assembly(lambda_text, dps)
    return {
        "schema": SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "status": STATUS,
        "input": {
            "lambda_decimal": lambda_text,
            "interval_decimal_digits": dps,
            "geometry_indices": list(GEOMETRY_INDICES),
            "M0": M0,
        },
        "theorem": {
            "note": NOTE,
            "valid_lambda_minimum": "2",
            "qualitative_result": "epsilon_lambda=o(d6)",
            "finite_bound_is_exact_infinite_minimum_series": True,
            "effective_fixed_index_threshold_claimed": False,
        },
        "locked_formulas": dict(LOCKED_FORMULAS),
        "source_hashes": source_hashes,
        "runtime_hashes": runtime_hashes,
        "source_admissions": dict(SOURCE_ADMISSIONS),
        "integers": integers,
        "intervals": {key: _serialize(value, dps) for key, value in values.items()},
        "claim_scope": {key: list(value) for key, value in CLAIM_SCOPE.items()},
        "arithmetic": {
            "library": "mpmath.iv",
            "library_version": MPMATH_VERSION,
            "shared_library_with_replay": True,
            "independence_limitation": (
                "producer and verifier use independent formula assemblies but "
                "share mpmath.iv interval arithmetic"
            ),
            "raw_exact_dyadic_endpoints_serialized": True,
            "interval_tightness_guard_decimal_digits": TIGHTNESS_GUARD_DIGITS,
            "interval_tightness_rule": (
                "width <= 10^(-(dps-12))*max(1,abs(lower),abs(upper))"
            ),
        },
        "producer_pass_boolean_trusted_by_replay": False,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-decimal", required=True)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output")
    args = parser.parse_args()
    payload = produce(args.lambda_decimal, args.dps)
    text = json.dumps(payload, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(text, encoding="utf-8")
    else:
        print(text, end="")


if __name__ == "__main__":
    main()
