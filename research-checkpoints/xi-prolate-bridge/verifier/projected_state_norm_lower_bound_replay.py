#!/usr/bin/env python3
"""Independent interval replay for the projected-state norm theorem."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-projected-state-norm-lower-bound-v1"
STATUS = "PROJECTED_STATE_NORM_LOWER_BOUND_COMPONENT"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md"
SOURCE_LOCK = "PROJECTED_STATE_NORM_SOURCE_LOCK.json"
MPMATH_VERSION = "1.4.1"
TIGHTNESS_GUARD_DIGITS = 12
_DECIMAL = re.compile(r"^[0-9]+(?:\.[0-9]+)?$")
_INTEGER_TEXT = re.compile(r"^[0-9]+$")
_SHA256 = re.compile(r"^[0-9a-f]{64}$")

PINNED_HASHES = {
    NOTE: "3847cbcb6e5bfc458af7bf957ff67afb0b943155d62f4239129b40332d270fbf",
    SOURCE_LOCK: "6c765b4d70969a7868f01641fdbc592907e8c32ae7d315a3ef39306f9389b213",
}

RUNTIME_HASHES = {
    "requirements.txt": (
        "458f06e2b5d6e73acc7a4f72af69afe920764c71127578555044815cd785c0fa"
    )
}

LOCKED_FORMULAS = {
    "limiting_norm_lower": "K_star=h(1)^2/(2*sqrt(2)*C_star)",
    "comparison_error": (
        "A=delta_upper*sqrt(lambda^3-lambda)+R_h(lambda)"
    ),
    "projection_tail": "F=C_star*log(lambda)/(pi*(N+1))",
    "gamma_majorant": (
        "G_(1/2)(x)=exp(-x)/sqrt(x); "
        "G_(r+1)(x)=r*G_r(x)+x^r*exp(-x)"
    ),
    "limiting_tail": (
        "T_bar=pi^2*S4_bar*sqrt(G_(9/2)(2*pi*lambda^2)/(2*pi)^(9/2))"
    ),
    "finite_lower": "a>=K_star-sqrt((A+F)^2+T_bar^2)",
    "norm_limit": "a_(lambda,N(lambda))->||E(h)(exp(.))||_2>0",
    "normalized_shift": (
        "epsilon_lambda=o(d6) and liminf a_(lambda,N)>0 imply U_Z=o(d6)"
    ),
    "unit_norm_rejection": "wrong multiplier=2^(17/4)/sqrt(33)!=1",
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "fourier_sign_changed": False,
    "lambda_mixed_with_lambda_squared": False,
    "inversion_reflection_dropped": False,
    "both_inversion_reflected_limiting_tails_retained": True,
    "invisible_bump_changes_projected_state": False,
    "unit_norm_substitution_accepted": False,
    "effective_delta_threshold_claimed": False,
    "signed_odd_floor_proved": False,
    "signed_even_floor_proved": False,
    "graph_dual_action_proved": False,
    "equation_5_2_proved": False,
    "rh_proved": False,
}

CLAIM_SCOPE = {
    "proved": [
        "explicit positive lower bound for the locked limiting-state norm",
        "finite projected-norm lower formula conditional on delta_upper",
        "projected-state norm convergence in the fixed source normalization",
        "normalized common Ritz upper shift U_Z=o(d6) on the locked schedule",
        "unit-normalization limiting scalar is different and rejected",
    ],
    "not_proved": [
        "an effective source enclosure for delta_lambda at the supplied input",
        "an odd-sector or even-complement signed floor",
        "a graph-dual residual-action estimate",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

EXPECTED_THEOREM = {
    "note": NOTE,
    "valid_lambda_minimum": "2",
    "qualitative_norm_limit": "||E(h)(exp(.))||_2",
    "qualitative_result": "U_Z=o(d6)",
    "supplied_delta_is_an_effective_source_enclosure": False,
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
    "incomplete_gamma_point_values_used": False,
    "interval_tightness_guard_decimal_digits": TIGHTNESS_GUARD_DIGITS,
    "interval_tightness_rule": (
        "width <= 10^(-(dps-12))*max(1,abs(lower),abs(upper))"
    ),
}

INTERVAL_KEYS = {
    "lambda",
    "delta_upper",
    "pi",
    "C_star",
    "h_one",
    "K_star",
    "h_endpoint",
    "h_tail_integral",
    "R_h_squared",
    "R_h",
    "source_comparison_error",
    "projection_tail",
    "gamma_5_over_2_majorant_at_pi",
    "S4_bar",
    "gamma_9_over_2_argument",
    "gamma_9_over_2_majorant",
    "limiting_state_tail",
    "convergence_error_bound",
    "projected_norm_lower_margin",
    "source_h_norm",
    "unit_norm_rescale_factor",
    "unit_norm_rescale_minus_one",
}


class ReplayError(ValueError):
    pass


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _locked_dependency_hashes(root: Path) -> dict[str, str]:
    try:
        lock = json.loads((root / SOURCE_LOCK).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise ReplayError("cannot parse projected-state source lock") from exc
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
        raise ReplayError("projected-state source-lock inventory mismatch")
    if lock.get("schema") != "xi-prolate-projected-state-norm-source-lock-v1":
        raise ReplayError("projected-state source-lock schema mismatch")
    dependencies = lock.get("dependencies")
    if not isinstance(dependencies, list) or not dependencies:
        raise ReplayError("projected-state source-lock dependencies missing")
    result: dict[str, str] = {}
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("projected-state dependency entry malformed")
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
            raise ReplayError("projected-state dependency fields malformed")
        if relative in result:
            raise ReplayError(f"duplicate projected-state dependency: {relative}")
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
            raise ReplayError(f"conflicting component hash: {relative}")
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


def _same_json_value(left: Any, right: Any) -> bool:
    """Compare decoded JSON recursively without bool/int coercion."""
    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return set(left) == set(right) and all(
            _same_json_value(left[key], right[key]) for key in left
        )
    if isinstance(left, list):
        return len(left) == len(right) and all(
            _same_json_value(a, b) for a, b in zip(left, right)
        )
    return left == right


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
        "dyadic": {"lower": _raw_endpoint(lower), "upper": _raw_endpoint(upper)},
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
        if exact[1] == 0 and exact != (0, 0, 0, 0):
            raise ReplayError("noncanonical exact dyadic endpoint")
        with mp.workprec(max(exact[3] + 32, 64)):
            endpoint = mp.mpf(exact)
        if tuple(int(part) for part in endpoint._mpf_) != exact:
            raise ReplayError("noncanonical exact dyadic endpoint")
        endpoints.append(endpoint)
    if endpoints[0] > endpoints[1]:
        raise ReplayError("interval endpoints reversed")
    if decimal != [
        _canonical_decimal(endpoints[0], digits),
        _canonical_decimal(endpoints[1], digits),
    ]:
        raise ReplayError(f"noncanonical decimal display for {name}")
    return endpoints[0], endpoints[1]


def _tightness(
    lower: mp.mpf, upper: mp.mpf, digits: int, name: str
) -> dict[str, str | bool]:
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


def _gamma_majorant_independent(x: Any, final_order_numerator: int) -> Any:
    """Reconstruct G by summing its explicit recurrence in reverse notation."""
    decay = mp.iv.exp(-x)
    current = decay / mp.iv.sqrt(x)
    numerator = 1
    while numerator < final_order_numerator:
        r = mp.iv.mpf(numerator) / 2
        current = r * current + decay * mp.iv.exp(r * mp.iv.log(x))
        numerator += 2
    return current


def _reconstruct(
    lambda_text: str, N: int, delta_text: str, dps: int
) -> dict[str, tuple[mp.mpf, mp.mpf]]:
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(lambda_text)
        delta = mp.iv.mpf(delta_text)
        if _capture(lam)[0] < 2 or _capture(delta)[0] < 0:
            raise ReplayError("input outside theorem range")
        pi = +mp.iv.pi
        C = mp.iv.mpf("6.006")
        decay_one = mp.iv.exp(-pi)
        H = (pi**2 - 3 * pi / 2) * decay_one
        K_lower = H**2 / (mp.iv.sqrt(8) * C)

        lambda_square = lam * lam
        gaussian = mp.iv.exp(-pi * lambda_square)
        boundary = (pi**2 * lam**4 - 3 * pi * lambda_square / 2) * gaussian
        h_integral = pi * lam**3 * gaussian / 2
        R2 = (
            (lam**2 - 1) * (boundary**2 + h_integral**2) / lam
            + 4 * boundary * h_integral * mp.iv.log(lam)
        )
        R = mp.iv.sqrt(R2)
        source_error = delta * mp.iv.sqrt(lam * (lam - 1) * (lam + 1)) + R
        fourier_error = C * mp.iv.log(lam) / (pi * mp.iv.mpf(N + 1))

        G5 = _gamma_majorant_independent(pi, 5)
        S4 = 1 + mp.iv.exp(pi) * G5 / (2 * mp.iv.exp(mp.iv.mpf(5) * mp.iv.log(pi) / 2))
        tail_argument = 2 * pi * lambda_square
        G9 = _gamma_majorant_independent(tail_argument, 9)
        tail = (
            pi**2
            * S4
            * mp.iv.sqrt(
                G9 / mp.iv.exp(mp.iv.mpf(9) * mp.iv.log(2 * pi) / 2)
            )
        )
        total_error = mp.iv.sqrt((source_error + fourier_error) ** 2 + tail**2)
        margin = K_lower - total_error

        h_norm = mp.iv.sqrt(33) * mp.iv.exp(-mp.iv.mpf(17) * mp.iv.log(2) / 4)
        rescale = 1 / h_norm
        result = {
            "lambda": lam,
            "delta_upper": delta,
            "pi": pi,
            "C_star": C,
            "h_one": H,
            "K_star": K_lower,
            "h_endpoint": boundary,
            "h_tail_integral": h_integral,
            "R_h_squared": R2,
            "R_h": R,
            "source_comparison_error": source_error,
            "projection_tail": fourier_error,
            "gamma_5_over_2_majorant_at_pi": G5,
            "S4_bar": S4,
            "gamma_9_over_2_argument": tail_argument,
            "gamma_9_over_2_majorant": G9,
            "limiting_state_tail": tail,
            "convergence_error_bound": total_error,
            "projected_norm_lower_margin": margin,
            "source_h_norm": h_norm,
            "unit_norm_rescale_factor": rescale,
            "unit_norm_rescale_minus_one": rescale - 1,
        }
        return {name: _capture(value) for name, value in result.items()}
    finally:
        mp.iv.dps = old


def _overlap(
    producer: tuple[mp.mpf, mp.mpf], independent: tuple[mp.mpf, mp.mpf]
) -> bool:
    return max(producer[0], independent[0]) <= min(producer[1], independent[1])


def replay(
    payload: dict[str, Any], *, producer_bytes: bytes | None = None
) -> dict[str, Any]:
    _reject_float(payload)
    if producer_bytes is None:
        producer_bytes = (
            json.dumps(payload, indent=2, sort_keys=True) + "\n"
        ).encode("utf-8")
        producer_byte_source = "canonical producer JSON serialization"
    else:
        if not isinstance(producer_bytes, bytes):
            raise ReplayError("producer bytes must be exact bytes")
        producer_byte_source = "exact artifact file bytes"
        try:
            decoded = json.loads(producer_bytes)
        except (UnicodeError, json.JSONDecodeError) as exc:
            raise ReplayError("producer bytes are not valid JSON") from exc
        _reject_float(decoded, "producer_bytes")
        if not _same_json_value(decoded, payload):
            raise ReplayError("producer bytes do not decode to replay payload")
    producer_sha256 = hashlib.sha256(producer_bytes).hexdigest()

    expected_top = {
        "schema",
        "terminal_state",
        "status",
        "input",
        "theorem",
        "locked_formulas",
        "source_hashes",
        "runtime_hashes",
        "source_admissions",
        "intervals",
        "claim_scope",
        "arithmetic",
        "producer_pass_boolean_trusted_by_replay",
    }
    if not isinstance(payload, dict) or set(payload) != expected_top:
        raise ReplayError("payload inventory mismatch")
    if payload["schema"] != SCHEMA or payload["status"] != STATUS:
        raise ReplayError("schema or component-status mismatch")
    if payload["terminal_state"] != TERMINAL_STATE:
        raise ReplayError("terminal-state promotion rejected")
    if payload["locked_formulas"] != LOCKED_FORMULAS:
        raise ReplayError("locked formula mutation")
    if payload["source_admissions"] != SOURCE_ADMISSIONS:
        raise ReplayError("source admission mutation")
    if payload["claim_scope"] != CLAIM_SCOPE:
        raise ReplayError("claim-scope mutation")
    if payload["arithmetic"] != EXPECTED_ARITHMETIC:
        raise ReplayError("arithmetic declaration mutation")
    if payload["producer_pass_boolean_trusted_by_replay"] is not False:
        raise ReplayError("producer boolean must not be trusted")

    inputs = payload["input"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_decimal",
        "N",
        "delta_upper_decimal",
        "interval_decimal_digits",
    }:
        raise ReplayError("input inventory mismatch")
    lambda_text = inputs["lambda_decimal"]
    delta_text = inputs["delta_upper_decimal"]
    N = inputs["N"]
    dps = inputs["interval_decimal_digits"]
    if (
        not isinstance(lambda_text, str)
        or _DECIMAL.fullmatch(lambda_text) is None
        or not isinstance(delta_text, str)
        or _DECIMAL.fullmatch(delta_text) is None
        or isinstance(N, bool)
        or not isinstance(N, int)
        or N < 0
        or isinstance(dps, bool)
        or not isinstance(dps, int)
        or dps < 50
    ):
        raise ReplayError("typed exact input violation")

    root = _root()
    source_hashes = _verified_source_hashes(root)
    runtime_hashes = _verified_runtime_hashes(root)
    if payload["source_hashes"] != source_hashes:
        raise ReplayError("source hash inventory mismatch")
    if payload["runtime_hashes"] != runtime_hashes:
        raise ReplayError("runtime hash inventory mismatch")

    theorem = payload["theorem"]
    if not isinstance(theorem, dict) or set(theorem) != set(EXPECTED_THEOREM) | {
        "finite_margin_positive"
    }:
        raise ReplayError("theorem inventory mismatch")
    for key, expected in EXPECTED_THEOREM.items():
        if theorem.get(key) != expected:
            raise ReplayError("theorem claim mutation")
    if not isinstance(theorem["finite_margin_positive"], bool):
        raise ReplayError("finite margin sign must be boolean")

    intervals = payload["intervals"]
    if not isinstance(intervals, dict) or set(intervals) != INTERVAL_KEYS:
        raise ReplayError("interval inventory mismatch")
    independent = _reconstruct(lambda_text, N, delta_text, dps)
    checks: dict[str, Any] = {}
    parsed: dict[str, tuple[mp.mpf, mp.mpf]] = {}
    for name in sorted(INTERVAL_KEYS):
        producer_interval = _payload_interval(intervals[name], dps, name)
        parsed[name] = producer_interval
        if not _overlap(producer_interval, independent[name]):
            raise ReplayError(f"independent interval nonoverlap: {name}")
        checks[name] = {
            "overlap": True,
            "producer": _serialize_exact_interval(producer_interval, dps),
            "independent": _serialize_exact_interval(independent[name], dps),
            "tightness": _tightness(*producer_interval, dps, name),
        }

    independently_positive = independent["projected_norm_lower_margin"][0] > 0
    if theorem["finite_margin_positive"] != independently_positive:
        raise ReplayError("producer finite-margin sign disagrees with reconstruction")
    if independent["K_star"][0] <= 0:
        raise ReplayError("limiting norm lower bound is not positive")
    if independent["unit_norm_rescale_minus_one"][0] <= 0:
        raise ReplayError("unit-normalization scalar was not rejected")
    if theorem["supplied_delta_is_an_effective_source_enclosure"] is not False:
        raise ReplayError("diagnostic delta promoted to source enclosure")

    return {
        "schema": "xi-prolate-projected-state-norm-lower-bound-replay-v1",
        "terminal_state": TERMINAL_STATE,
        "producer_binding": {
            "byte_source": producer_byte_source,
            "byte_count": len(producer_bytes),
            "sha256": producer_sha256,
        },
        "producer_input": dict(inputs),
        "source_hashes": source_hashes,
        "runtime_hashes": runtime_hashes,
        "reconstructed_intervals": {
            name: _serialize_exact_interval(independent[name], dps)
            for name in sorted(INTERVAL_KEYS)
        },
        "checks": checks,
        "independently_reconstructed_finite_margin_positive": independently_positive,
        "unit_normalization_rejected": True,
        "shared_arithmetic_library_limitation": EXPECTED_ARITHMETIC[
            "independence_limitation"
        ],
        "result": "PROJECTED_STATE_NORM_LOWER_BOUND_REPLAY_PASS",
        "claim_boundary": {
            "normalized_shift_o_d6": True,
            "signed_sector_floor": False,
            "graph_dual_action": False,
            "equation_5_2": False,
            "rh_proved": False,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact")
    parser.add_argument("--output")
    args = parser.parse_args()
    artifact_path = Path(args.artifact)
    producer_bytes = artifact_path.read_bytes()
    try:
        payload = json.loads(producer_bytes)
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise ReplayError("artifact is not valid JSON") from exc
    if not isinstance(payload, dict):
        raise ReplayError("artifact must be an object")
    result = replay(payload, producer_bytes=producer_bytes)
    result["producer_artifact"] = {
        "path": args.artifact,
        "sha256": result["producer_binding"]["sha256"],
    }
    encoded = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
