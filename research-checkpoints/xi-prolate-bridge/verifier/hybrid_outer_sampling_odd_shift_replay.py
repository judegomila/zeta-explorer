#!/usr/bin/env python3
"""Independent interval replay for the hybrid odd-shift sampling theorem."""
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
_INTEGER_TEXT = re.compile(r"^[0-9]+$")
_SHA256 = re.compile(r"^[0-9a-f]{64}$")

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

EXPECTED_THEOREM = {
    "note": NOTE,
    "valid_lambda_minimum": "2",
    "qualitative_result": "epsilon_lambda=o(d6)",
    "finite_bound_is_exact_infinite_minimum_series": True,
    "effective_fixed_index_threshold_claimed": False,
}

EXPECTED_ARITHMETIC = {
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
}

BASE_INTERVAL_KEYS = {
    "lambda",
    "pi",
    "a4",
    "C2",
    "C_L2",
    "L_lambda",
    "E_lambda",
    "decay_a",
    "M_raw",
    "L_star",
    "J_raw",
    "polynomial_log_at_M0",
    "absorption_margin",
    "derivative_margin",
    "tail_geometric_without_Z",
}
GEOMETRY_KEYS = {
    f"{name}_{suffix}"
    for suffix in ("j0", "j34", "threshold_upper")
    for name in ("log_2T", "delta", "phi", "x", "translation_decay")
}
INTERVAL_KEYS = BASE_INTERVAL_KEYS | GEOMETRY_KEYS


class ReplayError(ValueError):
    pass


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _locked_dependency_hashes(root: Path) -> dict[str, str]:
    """Parse the byte-pinned lock and independently hash its full inventory."""
    try:
        lock = json.loads((root / SOURCE_LOCK).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise ReplayError("cannot parse hybrid source lock") from exc
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
        raise ReplayError("hybrid source-lock inventory mismatch")
    if lock.get("schema") != "xi-prolate-hybrid-outer-sampling-source-lock-v1":
        raise ReplayError("hybrid source-lock schema mismatch")
    dependencies = lock.get("dependencies")
    if not isinstance(dependencies, list) or not dependencies:
        raise ReplayError("hybrid source-lock dependency inventory missing")

    result: dict[str, str] = {}
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("hybrid source-lock dependency entry malformed")
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
            raise ReplayError("hybrid source-lock dependency fields malformed")
        if relative in result:
            raise ReplayError(f"duplicate hybrid source-lock dependency: {relative}")
        if _sha256(root / relative) != expected:
            raise ReplayError(f"source-lock dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _verified_source_hashes(root: Path) -> dict[str, str]:
    for relative, expected in PINNED_HASHES.items():
        if _sha256(root / relative) != expected:
            raise ReplayError(f"source byte hash mismatch: {relative}")
    combined = dict(PINNED_HASHES)
    for relative, expected in _locked_dependency_hashes(root).items():
        if relative in combined and combined[relative] != expected:
            raise ReplayError(f"conflicting pinned component hash: {relative}")
        combined[relative] = expected
    return dict(sorted(combined.items()))


def _verified_runtime_hashes(root: Path) -> dict[str, str]:
    if mp.__version__ != MPMATH_VERSION:
        raise ReplayError(
            f"mpmath runtime mismatch: expected {MPMATH_VERSION}, got {mp.__version__}"
        )
    for relative, expected in RUNTIME_HASHES.items():
        if _sha256(root / relative) != expected:
            raise ReplayError(f"runtime dependency hash mismatch: {relative}")
    return dict(RUNTIME_HASHES)


def _reject_float(value: Any, path: str = "payload") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path} is forbidden")
    if isinstance(value, dict):
        for key, child in value.items():
            _reject_float(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _reject_float(child, f"{path}[{index}]")


def _capture(value: Any) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_
    lo_raw = tuple(lower)
    hi_raw = tuple(upper)
    bits = max(int(lo_raw[3]), int(hi_raw[3])) + 32
    with mp.workprec(bits):
        return mp.mpf(lo_raw), mp.mpf(hi_raw)


def _canonical_decimal(value: mp.mpf, digits: int) -> str:
    with mp.workdps(digits + 20):
        return mp.nstr(value, digits)


def _raw_endpoint(value: mp.mpf) -> list[object]:
    raw = tuple(int(part) for part in value._mpf_)
    return [raw[0], str(raw[1]), raw[2], raw[3]]


def _serialize_exact_interval(
    interval: tuple[mp.mpf, mp.mpf], digits: int
) -> dict[str, object]:
    lower, upper = interval
    return {
        "decimal": [
            _canonical_decimal(lower, digits),
            _canonical_decimal(upper, digits),
        ],
        "dyadic": {
            "lower": _raw_endpoint(lower),
            "upper": _raw_endpoint(upper),
        },
    }


def _payload_interval(
    item: object, digits: int, name: str
) -> tuple[mp.mpf, mp.mpf]:
    if not isinstance(item, dict) or set(item) != {"decimal", "dyadic"}:
        raise ReplayError("invalid interval inventory")
    decimal = item["decimal"]
    if (
        not isinstance(decimal, list)
        or len(decimal) != 2
        or any(not isinstance(value, str) for value in decimal)
    ):
        raise ReplayError("invalid interval decimal enclosure")
    dyadic = item["dyadic"]
    if not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}:
        raise ReplayError("invalid dyadic interval inventory")
    endpoints: list[mp.mpf] = []
    for side in ("lower", "upper"):
        raw = dyadic[side]
        if not isinstance(raw, list) or len(raw) != 4:
            raise ReplayError("invalid exact dyadic endpoint")
        if (
            isinstance(raw[0], bool)
            or not isinstance(raw[0], int)
            or not isinstance(raw[1], str)
            or _INTEGER_TEXT.fullmatch(raw[1]) is None
            or len(raw[1]) > 2 * digits + 100
            or isinstance(raw[2], bool)
            or not isinstance(raw[2], int)
            or isinstance(raw[3], bool)
            or not isinstance(raw[3], int)
            or raw[3] > 4 * digits + 128
        ):
            raise ReplayError("typed dyadic endpoint mutation")
        exact = (raw[0], int(raw[1]), raw[2], raw[3])
        if exact[0] not in (0, 1) or exact[1] < 0 or exact[3] < 0:
            raise ReplayError("invalid normalized dyadic endpoint")
        with mp.workprec(max(exact[3] + 32, 64)):
            endpoint = mp.mpf(exact)
        if tuple(int(part) for part in endpoint._mpf_) != exact:
            raise ReplayError("noncanonical exact dyadic endpoint")
        endpoints.append(endpoint)
    if endpoints[0] > endpoints[1]:
        raise ReplayError("interval endpoints reversed")
    canonical = [
        _canonical_decimal(endpoints[0], digits),
        _canonical_decimal(endpoints[1], digits),
    ]
    if decimal != canonical:
        raise ReplayError(f"noncanonical decimal display for {name}")
    return endpoints[0], endpoints[1]


def _tightness_certificate(
    lower: mp.mpf, upper: mp.mpf, digits: int, name: str
) -> dict[str, str | bool]:
    """Enforce a 12-digit guard around the requested decimal precision.

    The allowance is deliberately much larger than ordinary interval rounding,
    while still separating a dps-digit enclosure from any lower-precision or
    adversarially widened enclosure.
    """
    with mp.workdps(digits + 50):
        width = upper - lower
        scale = max(mp.mpf(1), abs(lower), abs(upper))
        bound = scale * mp.power(10, -(digits - TIGHTNESS_GUARD_DIGITS))
        if width > bound:
            raise ReplayError(f"producer interval too wide for declared dps: {name}")
        return {
            "pass": True,
            "width_decimal": mp.nstr(width, 25),
            "maximum_width_decimal": mp.nstr(bound, 25),
        }


def _stable_ceil(value: Any, floor_value: int, name: str) -> int:
    lo, hi = _capture(value)
    with mp.workprec(max(lo._mpf_[3], hi._mpf_[3]) + 32):
        low_integer = max(floor_value, int(mp.ceil(lo)))
        high_integer = max(floor_value, int(mp.ceil(hi)))
    if low_integer != high_integer:
        raise ReplayError(f"independent interval cannot certify ceil for {name}")
    return low_integer


def _geometry(index: int) -> dict[str, Any]:
    # Independent assembly: powers are exponentials of logarithms.
    L = mp.iv.log(6) + index * mp.iv.log(2)
    delta = mp.iv.exp(
        -mp.iv.log(mp.iv.mpf("55.241"))
        - 2 * mp.iv.log(L) / 3
        - mp.iv.log(mp.iv.log(L)) / 3
    )
    phi = 3 * delta * L / 4
    x = mp.iv.exp((mp.iv.log(L) - mp.iv.log(mp.iv.log(L))) / 3)
    return {
        "log_2T": L,
        "delta": delta,
        "phi": phi,
        "x": x,
        "translation_decay": mp.iv.exp(-phi),
    }


def _reconstruct(lambda_text: str, dps: int) -> tuple[
    dict[str, tuple[mp.mpf, mp.mpf]], dict[str, int]
]:
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(lambda_text)
        if lam.a < 2:
            raise ReplayError("lambda below theorem range")
        log2 = mp.iv.log(2)
        sqrt3 = mp.iv.sqrt(3)
        pi = +mp.iv.pi
        a4 = mp.iv.exp(mp.iv.log(3) / 2 - 11 * log2 / 4)
        c2 = (
            40
            * mp.iv.exp(-mp.iv.log(3) / 4 - (1 + sqrt3) / 2)
            * (sqrt3 / (sqrt3 - 1)) ** 2
        )
        c_l2 = a4**2 * (9 * 55811 + c2**2 / (3 * 64))
        log_scale = 1 + mp.iv.log(2 + 2 * pi * lam**2)
        e_lambda = c_l2 * mp.iv.exp(3 * mp.iv.log(lam)) * log_scale**2
        a = mp.iv.mpf(3) / mp.iv.mpf("220.964")
        raw_m = 18 * mp.iv.log(lam) / a
        m_lambda = _stable_ceil(raw_m, M0, "M_lambda")
        l_star = 6 * mp.iv.mpf(m_lambda) ** 3 * mp.iv.log(2 * m_lambda)
        raw_j = (l_star - mp.iv.log(6)) / log2
        j_upper = 1 + _stable_ceil(raw_j, 0, "J_upper")
        poly_log = (
            mp.iv.log(8 * 8586)
            + 11 * mp.iv.log(M0 + 1)
            + 5 * mp.iv.log(mp.iv.log(2 * (M0 + 1)))
        )
        absorption = a * M0 / 2 - poly_log
        derivative = (
            a / 2
            - mp.iv.mpf(11) / (M0 + 1)
            - mp.iv.mpf(5) / ((M0 + 1) * mp.iv.log(2 * (M0 + 1)))
        )
        tail = mp.iv.exp(-9 * mp.iv.log(lam)) / (1 - mp.iv.exp(-a / 2))
        result: dict[str, Any] = {
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
                result[f"{key}_j{index}"] = value
        for key, value in _geometry(j_upper).items():
            result[f"{key}_threshold_upper"] = value
        return (
            {key: _capture(value) for key, value in result.items()},
            {"M_lambda": m_lambda, "J_upper": j_upper},
        )
    finally:
        mp.iv.dps = old


def replay(
    payload: dict[str, Any], *, producer_bytes: bytes | None = None
) -> dict[str, Any]:
    _reject_float(payload)
    if producer_bytes is None:
        producer_bytes = (
            json.dumps(payload, indent=2, sort_keys=True) + "\n"
        ).encode("utf-8")
        producer_binding = "canonical producer JSON serialization"
    else:
        if not isinstance(producer_bytes, bytes):
            raise ReplayError("producer bytes must be exact bytes")
        producer_binding = "exact artifact file bytes"
        try:
            decoded = json.loads(producer_bytes)
        except (UnicodeError, json.JSONDecodeError) as exc:
            raise ReplayError("producer bytes are not valid JSON") from exc
        _reject_float(decoded, "producer_bytes")
        if decoded != payload:
            raise ReplayError("producer bytes do not decode to replay payload")
    producer_sha256 = hashlib.sha256(producer_bytes).hexdigest()

    required_top = {
        "schema",
        "terminal_state",
        "status",
        "input",
        "theorem",
        "locked_formulas",
        "source_hashes",
        "runtime_hashes",
        "source_admissions",
        "integers",
        "intervals",
        "claim_scope",
        "arithmetic",
        "producer_pass_boolean_trusted_by_replay",
    }
    if set(payload) != required_top:
        raise ReplayError("top-level payload inventory mismatch")
    if payload.get("schema") != SCHEMA or payload.get("status") != STATUS:
        raise ReplayError("schema or status mismatch")
    if payload.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("terminal-state promotion")
    if payload.get("producer_pass_boolean_trusted_by_replay") is not False:
        raise ReplayError("producer boolean cannot be trusted")

    inputs = payload.get("input")
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_decimal",
        "interval_decimal_digits",
        "geometry_indices",
        "M0",
    }:
        raise ReplayError("input inventory mismatch")
    lambda_text = inputs["lambda_decimal"]
    dps = inputs["interval_decimal_digits"]
    if not isinstance(lambda_text, str) or _DECIMAL.fullmatch(lambda_text) is None:
        raise ReplayError("lambda must remain an unsigned decimal string")
    if isinstance(dps, bool) or not isinstance(dps, int) or dps < 50:
        raise ReplayError("precision must be an exact integer >=50")
    if inputs["geometry_indices"] != list(GEOMETRY_INDICES) or inputs["M0"] != M0:
        raise ReplayError("geometry or threshold inventory mutation")

    if payload.get("theorem") != EXPECTED_THEOREM:
        raise ReplayError("theorem inventory mutation")
    if payload.get("locked_formulas") != LOCKED_FORMULAS:
        raise ReplayError("locked formula mutation")
    if payload.get("source_admissions") != SOURCE_ADMISSIONS:
        raise ReplayError("source admission or claim mutation")
    if payload.get("claim_scope") != CLAIM_SCOPE:
        raise ReplayError("claim-scope promotion")
    if payload.get("arithmetic") != EXPECTED_ARITHMETIC:
        raise ReplayError("shared mpmath.iv limitation missing or mutated")
    root = _root()
    expected_source_hashes = _verified_source_hashes(root)
    if payload.get("source_hashes") != expected_source_hashes:
        raise ReplayError("declared source hash inventory mismatch")
    expected_runtime_hashes = _verified_runtime_hashes(root)
    if payload.get("runtime_hashes") != expected_runtime_hashes:
        raise ReplayError("declared runtime hash inventory mismatch")

    integers = payload.get("integers")
    if not isinstance(integers, dict) or set(integers) != {"M_lambda", "J_upper"}:
        raise ReplayError("exact integer inventory mismatch")
    if any(isinstance(value, bool) or not isinstance(value, int) for value in integers.values()):
        raise ReplayError("threshold integers must remain exact integers")

    intervals = payload.get("intervals")
    if not isinstance(intervals, dict) or set(intervals) != INTERVAL_KEYS:
        raise ReplayError("interval inventory mismatch")
    reconstructed, expected_integers = _reconstruct(lambda_text, dps)
    if integers != expected_integers:
        raise ReplayError("ceil-certified threshold integer mismatch")

    comparisons: dict[str, Any] = {}
    producer_intervals: dict[str, tuple[mp.mpf, mp.mpf]] = {}
    for key in sorted(INTERVAL_KEYS):
        producer_lo, producer_hi = _payload_interval(intervals[key], dps, key)
        producer_intervals[key] = (producer_lo, producer_hi)
        tightness = _tightness_certificate(producer_lo, producer_hi, dps, key)
        replay_lo, replay_hi = reconstructed[key]
        with mp.workdps(dps + 50):
            if max(producer_lo, replay_lo) > min(producer_hi, replay_hi):
                raise ReplayError(f"interval nonoverlap for {key}")
        comparisons[key] = {
            "overlap": True,
            "producer_decimal": [mp.nstr(producer_lo, 25), mp.nstr(producer_hi, 25)],
            "replay_decimal": [mp.nstr(replay_lo, 25), mp.nstr(replay_hi, 25)],
            "producer_tightness": tightness,
        }

    if reconstructed["absorption_margin"][0] <= 0:
        raise ReplayError("polynomial absorption margin is not positive")
    if reconstructed["derivative_margin"][0] <= 0:
        raise ReplayError("polynomial absorption monotonicity failed")
    if reconstructed["x_threshold_upper"][0] < integers["M_lambda"]:
        raise ReplayError("summation threshold upper index is too small")

    # The serialized raw intervals independently certify both ceil operations.
    m_lo, m_hi = producer_intervals["M_raw"]
    with mp.workprec(max(m_lo._mpf_[3], m_hi._mpf_[3]) + 32):
        if max(M0, int(mp.ceil(m_lo))) != max(M0, int(mp.ceil(m_hi))):
            raise ReplayError("producer M ceil interval is unstable")
    j_lo, j_hi = producer_intervals["J_raw"]
    with mp.workprec(max(j_lo._mpf_[3], j_hi._mpf_[3]) + 32):
        if int(mp.ceil(j_lo)) != int(mp.ceil(j_hi)):
            raise ReplayError("producer J ceil interval is unstable")

    return {
        "schema": SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "status": "HYBRID_OUTER_SAMPLING_ODD_SHIFT_REPLAY_PASS",
        "input": {
            "lambda_decimal": lambda_text,
            "interval_decimal_digits": dps,
            "geometry_indices": list(GEOMETRY_INDICES),
            "M0": M0,
        },
        "producer_binding": {
            "sha256": producer_sha256,
            "byte_source": producer_binding,
        },
        "replay_precision": {
            "interval_decimal_digits": dps,
            "tightness_guard_decimal_digits": TIGHTNESS_GUARD_DIGITS,
        },
        "source_bytes_rechecked": True,
        "source_dependency_inventory_rehashed": True,
        "constants_independently_reconstructed": True,
        "reflected_tail_source_admission_matched": True,
        "summation_threshold_rechecked": True,
        "ceil_stability_rechecked": True,
        "producer_booleans_trusted": False,
        "zero_list_read": False,
        "source_hashes": expected_source_hashes,
        "runtime_hashes": expected_runtime_hashes,
        "claim_scope": {key: list(value) for key, value in CLAIM_SCOPE.items()},
        "interval_comparisons": comparisons,
        "reconstructed_intervals": {
            key: _serialize_exact_interval(reconstructed[key], dps)
            for key in sorted(INTERVAL_KEYS)
        },
        "arithmetic": dict(EXPECTED_ARITHMETIC),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact")
    parser.add_argument("--output")
    args = parser.parse_args()
    producer_bytes = Path(args.artifact).read_bytes()
    payload = json.loads(producer_bytes)
    if not isinstance(payload, dict):
        raise ReplayError("artifact must be an object")
    text = json.dumps(
        replay(payload, producer_bytes=producer_bytes), indent=2, sort_keys=True
    ) + "\n"
    if args.output:
        Path(args.output).write_text(text, encoding="utf-8")
    else:
        print(text, end="")


if __name__ == "__main__":
    main()
