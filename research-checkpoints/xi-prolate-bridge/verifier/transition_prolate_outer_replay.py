#!/usr/bin/env python3
"""Clean-room replay of the transition-prolate outer-mode certificate.

This verifier imports neither the producer nor ``transition_window_bound``.
It reconstructs the KRD threshold and every transcendental constant directly
from the exact integer schedule parameter.
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


SCHEMA = "xi-prolate-transition-outer-v1"
REPLAY_SCHEMA = "xi-prolate-transition-outer-replay-v1"
STATUS = "TRANSITION_PROLATE_OUTER_COMPONENT"
TERMINAL_STATE = "P0_INVALIDATED"
RESULT = "TRANSITION_PROLATE_OUTER_COMPONENT_PASS"
REPLAY_RESULT = "TRANSITION_PROLATE_OUTER_COMPONENT_REPLAY_PASS"
NOTE = "notes/TRANSITION_PROLATE_OUTER_THEOREM.md"
SOURCE_LOCK = "TRANSITION_PROLATE_OUTER_SOURCE_LOCK.json"
PINNED_HASHES = {
    NOTE: "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    SOURCE_LOCK: "463511b13e9313178980c57cdd7bfd008f84d447a3d8e20c3774e4b1b498be9d",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_CANONICAL_INTEGER = re.compile(r"^(?:0|-[1-9][0-9]*|[1-9][0-9]*)$")
_CANONICAL_NONNEGATIVE = re.compile(r"^(?:0|[1-9][0-9]*)$")
_CANONICAL_POSITIVE = re.compile(r"^[1-9][0-9]*$")

LOCKED_FORMULAS = {
    "beta": "beta=(2/pi^2)*log(200*lambda^2+25)",
    "buffer": "b=6+ceil(beta*log(20))",
    "transition_index": (
        "n_star=4*lambda^2+b with n_star itself excluded from the low window"
    ),
    "differential_bound": (
        "n<n_star implies mu_n(c)<3*c^2; d_n<1/2 implies n<n_star"
    ),
    "liouville_frequency": (
        "Omega^2=k^2+(c^2-mu_n)/(t^2-lambda^2)+"
        "lambda^2/(t^2-lambda^2)^2"
    ),
    "endpoint_bound": "abs(h_n(lambda))^2<=2592*pi^2*lambda*d_n",
    "far_remainder": (
        "R_n=H_n-(h_n(lambda)/(pi*t))*sin(k*t); "
        "abs(R_n)<=18*A*K/t^2 and abs(R_n')<=24*A*k*K/t^2"
    ),
    "sampled_series": (
        "abs(sum_(m>=2) H_n(m*u))<=28*A*u^(-1)*"
        "(1+log(2+K/u)) for even n"
    ),
    "weighted_norm": (
        "norm(e^(y*.)*O_n)^2<=1062724*lambda*L_lambda^2*"
        "epsilon^(-1)*d_n"
    ),
    "near_constant": (
        "C_near=1119744*pi^2*lambda^5+290304*pi^2*lambda^3+"
        "320*c^4*lambda"
    ),
    "translation_constant": (
        "D_tr=6*(82944*pi^2*lambda+C_near+10^9*K^2/lambda)"
    ),
    "weighted_translation": (
        "norm(tau_h(e^(y*.)*O_n)-e^(y*.)*O_n)^2<="
        "D_tr*epsilon^(-1)*h^epsilon*d_n"
    ),
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "numerical_prolate_eigenvalues_read": False,
    "stored_eigenvectors_read": False,
    "zeta_zero_table_read": False,
    "global_weil_positivity_assumed": False,
    "odd_label_harmonic_bound_claimed": False,
    "growing_family_loewner_bound_claimed": False,
    "signed_weil_floor_claimed": False,
    "equation_5_2_claimed": False,
    "rh_proved": False,
}

CLAIM_SCOPE = {
    "proved": [
        "n<n_star forces mu_n(c)<3*c^2 and d_n<1/2 forces n<n_star on the locked schedule",
        "an explicit defect-relative endpoint and far Volterra bound for each low mode",
        "an explicit complete weighted norm and polynomial translation modulus for each even low mode",
    ],
    "not_proved": [
        "the corrected growing-family source Gram or compact projection remainder",
        "the blockwise quotient action estimate",
        "a shifted signed Weil-sector floor",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}


class ReplayError(ValueError):
    """Raised when the artifact fails a clean-room replay check."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()
    except OSError as exc:
        raise ReplayError(f"cannot read pinned source: {path}") from exc


def _reject_number(token: str) -> None:
    raise ReplayError(f"non-integer JSON number {token!r} is forbidden")


def _unique_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _validate_json(value: Any, path: str = "payload") -> None:
    if value is None or isinstance(value, (str, bool)):
        return
    if isinstance(value, int):
        return
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path} is forbidden")
    if isinstance(value, list):
        for index, child in enumerate(value):
            _validate_json(child, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, child in value.items():
            if not isinstance(key, str):
                raise ReplayError(f"non-string JSON key at {path}")
            _validate_json(child, f"{path}.{key}")
        return
    raise ReplayError(f"non-JSON value at {path}")


def _strict_json_loads(raw: bytes | str, label: str) -> Any:
    try:
        value = json.loads(
            raw,
            parse_float=_reject_number,
            parse_constant=_reject_number,
            object_pairs_hook=_unique_object,
        )
    except ReplayError:
        raise
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise ReplayError(f"{label} is not strict JSON") from exc
    _validate_json(value, label)
    return value


def _same(left: Any, right: Any) -> bool:
    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return set(left) == set(right) and all(_same(left[k], right[k]) for k in left)
    if isinstance(left, list):
        return len(left) == len(right) and all(_same(a, b) for a, b in zip(left, right))
    return left == right


def _require_int(value: Any, label: str, minimum: int | None = None) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ReplayError(f"{label} must be an exact JSON integer")
    if minimum is not None and value < minimum:
        raise ReplayError(f"{label} must be at least {minimum}")
    return value


def _rational(value: Fraction) -> dict[str, str]:
    return {"numerator": str(value.numerator), "denominator": str(value.denominator)}


def _parse_rational(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"{label} must be a rational object")
    num = value["numerator"]
    den = value["denominator"]
    if (
        not isinstance(num, str)
        or _CANONICAL_INTEGER.fullmatch(num) is None
        or not isinstance(den, str)
        or _CANONICAL_POSITIVE.fullmatch(den) is None
    ):
        raise ReplayError(f"{label} has noncanonical rational text")
    result = Fraction(int(num), int(den))
    if _rational(result) != value:
        raise ReplayError(f"{label} is not a reduced canonical rational")
    return result


def _parse_endpoint(value: Any, label: str) -> mp.mpf:
    if not isinstance(value, list) or len(value) != 4:
        raise ReplayError(f"{label} must be a four-field dyadic endpoint")
    sign = _require_int(value[0], f"{label}.sign", 0)
    mantissa_text = value[1]
    exponent = _require_int(value[2], f"{label}.exponent")
    bit_count = _require_int(value[3], f"{label}.bit_count", 0)
    if sign not in (0, 1):
        raise ReplayError(f"{label} has invalid sign")
    if not isinstance(mantissa_text, str) or _CANONICAL_NONNEGATIVE.fullmatch(mantissa_text) is None:
        raise ReplayError(f"{label} has noncanonical mantissa")
    mantissa = int(mantissa_text)
    raw = (sign, mantissa, exponent, bit_count)
    if mantissa == 0:
        if raw != (0, 0, 0, 0):
            raise ReplayError(f"{label} has noncanonical zero")
    elif bit_count != mantissa.bit_length():
        raise ReplayError(f"{label} has incorrect bit count")
    with mp.workprec(max(mp.mp.prec, bit_count + 10)):
        result = +mp.mpf(raw)
    if tuple(int(part) for part in result._mpf_) != raw:
        raise ReplayError(f"{label} is not a canonical mpf endpoint")
    return result


def _parse_interval(value: Any, label: str, dps: int) -> tuple[mp.mpf, mp.mpf]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"{label} interval inventory mismatch")
    decimal = value["decimal"]
    dyadic = value["dyadic"]
    if (
        not isinstance(decimal, list)
        or len(decimal) != 2
        or not all(isinstance(part, str) for part in decimal)
        or not isinstance(dyadic, dict)
        or set(dyadic) != {"lower", "upper"}
    ):
        raise ReplayError(f"{label} interval serialization malformed")
    lower = _parse_endpoint(dyadic["lower"], f"{label}.lower")
    upper = _parse_endpoint(dyadic["upper"], f"{label}.upper")
    if lower > upper:
        raise ReplayError(f"{label} endpoints are reversed")
    with mp.workdps(dps + 20):
        expected_decimal = [mp.nstr(lower, dps + 10), mp.nstr(upper, dps + 10)]
    if decimal != expected_decimal:
        raise ReplayError(f"{label} decimal display does not match dyadic endpoints")
    return lower, upper


def _capture(value: object) -> tuple[mp.mpf, mp.mpf]:
    raw_lower, raw_upper = value._mpi_  # type: ignore[attr-defined]
    with mp.workdps(mp.iv.dps + 20):
        return +mp.mpf(raw_lower), +mp.mpf(raw_upper)


def _reconstruct_intervals(p: int, n_max: int, dps: int) -> dict[str, tuple[mp.mpf, mp.mpf]]:
    old_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(p) / mp.iv.mpf(2)
        pi = mp.iv.pi
        lambda_squared = lam * lam
        k = (pi + pi) * lam
        c = k * lam
        K = k * lambda_squared
        beta = (mp.iv.mpf(2) / (pi * pi)) * mp.iv.log(200 * lambda_squared + 25)
        buffer = beta * mp.iv.log(20)
        L = 1 + mp.iv.log(2 + (pi + pi) * lambda_squared)
        mu_ratio = 1 + mp.iv.mpf(n_max * (n_max + 1)) / (c * c)
        endpoint = 2592 * pi * pi * lam
        weighted_norm = 1_062_724 * lam * L * L
        near = (
            1_119_744 * pi * pi * lam**5
            + 290_304 * pi * pi * lam**3
            + 320 * c**4 * lam
        )
        translation = 6 * (
            82_944 * pi * pi * lam + near + 1_000_000_000 * K * K / lam
        )
        return {
            "beta": _capture(beta),
            "beta_log20": _capture(buffer),
            "mu_upper_over_c_squared": _capture(mu_ratio),
            "margin_below_3c_squared": _capture(3 - mu_ratio),
            "endpoint_square_coefficient": _capture(endpoint),
            "L_lambda": _capture(L),
            "weighted_norm_coefficient": _capture(weighted_norm),
            "C_near": _capture(near),
            "D_tr": _capture(translation),
        }
    finally:
        mp.iv.dps = old_dps


def _source_hashes(root: Path) -> dict[str, str]:
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None or _sha256(root / relative) != expected:
            raise ReplayError(f"source byte hash mismatch: {relative}")
    lock = _strict_json_loads((root / SOURCE_LOCK).read_bytes(), "source lock")
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
        raise ReplayError("source-lock inventory mismatch")
    fixed = {
        "schema": "xi-prolate-transition-outer-source-lock-v1",
        "claim_class": "TRANSITION_PROLATE_MODEWISE_OUTER_BOUND",
        "terminal_state": TERMINAL_STATE,
        "updated_date": "2026-08-07",
        "locked_formulas": LOCKED_FORMULAS,
    }
    for key, expected in fixed.items():
        if not _same(lock[key], expected):
            raise ReplayError(f"source-lock {key} mutation")
    result = dict(PINNED_HASHES)
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ReplayError("source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed source-lock dependency")
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
            or relative in result
        ):
            raise ReplayError("invalid source-lock dependency")
        if _sha256(root / relative) != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def reconstruct(lambda_numerator: int, dps: int) -> dict[str, Any]:
    p = _require_int(lambda_numerator, "lambda_numerator", 5)
    if p % 2 == 0:
        raise ReplayError("lambda_numerator must be odd")
    dps = _require_int(dps, "interval_decimal_digits", 40)
    lam = Fraction(p, 2)
    shannon = p * p

    initial = _reconstruct_intervals(p, shannon, dps)
    buffer_lower, buffer_upper = initial["beta_log20"]
    lower_ceil = int(mp.ceil(buffer_lower))
    upper_ceil = int(mp.ceil(buffer_upper))
    if lower_ceil != upper_ceil:
        raise ReplayError("buffer interval does not determine one ceiling")
    buffer_ceil = lower_ceil
    n_star = shannon + 6 + buffer_ceil
    n_max = n_star - 1
    six_lambda_squared = 6 * lam**2
    if Fraction(n_max) > six_lambda_squared:
        raise ReplayError("exact n<=6*lambda^2 inequality failed")

    return {
        "exact": {
            "lambda": _rational(lam),
            "lambda_squared": _rational(lam**2),
            "shannon_index": shannon,
            "buffer_ceil": buffer_ceil,
            "buffer_with_plus_six": 6 + buffer_ceil,
            "n_star": n_star,
            "max_low_index": n_max,
            "n_star_is_excluded": True,
            "six_lambda_squared": _rational(six_lambda_squared),
            "exact_index_margin": _rational(six_lambda_squared - n_max),
            "endpoint_constant_integer": 2592,
            "far_remainder_constants": {"value": 18, "derivative": 24},
            "sampled_series_constant": 28,
            "weighted_norm_integer": 1_062_724,
            "far_translation_integer": 1_000_000_000,
            "translation_collection_factor": 6,
        },
        "intervals": _reconstruct_intervals(p, n_max, dps),
    }


def replay(
    payload: dict[str, Any], *, producer_bytes: bytes | None = None
) -> dict[str, Any]:
    if producer_bytes is None or not isinstance(producer_bytes, bytes):
        raise ReplayError("exact producer artifact bytes are required")
    decoded = _strict_json_loads(producer_bytes, "producer artifact bytes")
    if not _same(decoded, payload):
        raise ReplayError("producer bytes do not decode exactly to replay payload")
    _validate_json(payload)
    expected_top = {
        "schema",
        "status",
        "terminal_state",
        "input",
        "source_hashes",
        "locked_formulas",
        "source_admissions",
        "arithmetic",
        "certificate",
        "producer_pass_boolean_trusted_by_replay",
        "claim_scope",
        "result",
    }
    if not isinstance(payload, dict) or set(payload) != expected_top:
        raise ReplayError("artifact inventory mismatch")
    fixed = {
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "locked_formulas": LOCKED_FORMULAS,
        "source_admissions": SOURCE_ADMISSIONS,
        "claim_scope": CLAIM_SCOPE,
        "producer_pass_boolean_trusted_by_replay": False,
        "result": RESULT,
    }
    for key, expected in fixed.items():
        if not _same(payload[key], expected):
            raise ReplayError(f"artifact {key} mutation or claim promotion")
    arithmetic = payload["arithmetic"]
    if (
        not isinstance(arithmetic, dict)
        or arithmetic.get("precision_mode") != "outward arbitrary-precision intervals"
        or arithmetic.get("raw_interval_or_ball_output_applicable") is not True
        or arithmetic.get("shared_library_with_verifier") is not True
        or not isinstance(arithmetic.get("library"), str)
        or not arithmetic["library"].startswith("mpmath.iv ")
    ):
        raise ReplayError("arithmetic disclosure mutation")

    inputs = payload["input"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_numerator",
        "lambda_denominator",
        "interval_decimal_digits",
    }:
        raise ReplayError("input inventory mismatch")
    p = _require_int(inputs["lambda_numerator"], "lambda_numerator", 5)
    if _require_int(inputs["lambda_denominator"], "lambda_denominator") != 2:
        raise ReplayError("lambda denominator mutation")
    dps = _require_int(inputs["interval_decimal_digits"], "interval_decimal_digits", 40)
    reconstructed = reconstruct(p, dps)

    certificate = payload["certificate"]
    if not isinstance(certificate, dict) or set(certificate) != set(reconstructed["exact"]) | {"outward_intervals"}:
        raise ReplayError("certificate inventory mismatch")
    for key, expected in reconstructed["exact"].items():
        if key in {"lambda", "lambda_squared", "six_lambda_squared", "exact_index_margin"}:
            _parse_rational(certificate[key], f"certificate.{key}")
        if not _same(certificate[key], expected):
            raise ReplayError(f"certificate {key} differs from independent reconstruction")

    supplied_intervals = certificate["outward_intervals"]
    if not isinstance(supplied_intervals, dict) or set(supplied_intervals) != set(reconstructed["intervals"]):
        raise ReplayError("outward interval inventory mismatch")
    overlap: dict[str, bool] = {}
    for name, verifier_interval in reconstructed["intervals"].items():
        supplied = _parse_interval(supplied_intervals[name], name, dps)
        agrees = supplied[0] <= verifier_interval[1] and verifier_interval[0] <= supplied[1]
        if not agrees:
            raise ReplayError(f"{name} producer/verifier intervals do not overlap")
        overlap[name] = True
    margin = reconstructed["intervals"]["margin_below_3c_squared"]
    if margin[0] <= 0:
        raise ReplayError("mu_n<3*c^2 margin is not positive")

    expected_hashes = _source_hashes(_root())
    if not _same(payload["source_hashes"], expected_hashes):
        raise ReplayError("source hash inventory mismatch")

    return {
        "schema": REPLAY_SCHEMA,
        "status": REPLAY_RESULT,
        "terminal_state": TERMINAL_STATE,
        "producer_binding": {
            "sha256": hashlib.sha256(producer_bytes).hexdigest(),
            "exact_bytes_required": True,
        },
        "checks": {
            "producer_booleans_trusted": False,
            "independent_formula_reconstruction": True,
            "all_interval_pairs_overlap": all(overlap.values()),
            "strict_low_window_endpoint_preserved": reconstructed["exact"]["n_star_is_excluded"],
            "mu_upper_strictly_below_3c_squared": True,
            "even_label_harmonic_domain_preserved": True,
            "both_inversion_reflected_tails_preserved": True,
        },
        "interval_overlap": overlap,
        "reconstructed_exact_certificate": reconstructed["exact"],
        "arithmetic": {
            "library": f"mpmath.iv {mp.__version__}",
            "shared_library_limitation_acknowledged": True,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact")
    parser.add_argument("--output")
    args = parser.parse_args()
    raw = Path(args.artifact).read_bytes()
    payload = _strict_json_loads(raw, "producer artifact")
    report = replay(payload, producer_bytes=raw)
    encoded = json.dumps(report, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
