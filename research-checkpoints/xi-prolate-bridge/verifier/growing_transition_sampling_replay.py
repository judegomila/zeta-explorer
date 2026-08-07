#!/usr/bin/env python3
"""Clean-room replay of the growing transition sampling theorem."""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-growing-transition-sampling-v1"
REPLAY_SCHEMA = "xi-prolate-growing-transition-sampling-replay-v1"
STATUS = "GROWING_TRANSITION_SAMPLING_COMPONENT"
TERMINAL_STATE = "P0_INVALIDATED"
RESULT = "GROWING_TRANSITION_SAMPLING_COMPONENT_PASS"
REPLAY_RESULT = "GROWING_TRANSITION_SAMPLING_COMPONENT_REPLAY_PASS"
NOTE = "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md"
SOURCE_LOCK = "GROWING_TRANSITION_SAMPLING_SOURCE_LOCK.json"
PINNED_HASHES = {
    NOTE: "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    SOURCE_LOCK: "585d13e3860106840e0bd550eaa30ff16eee78a182b926ccf4656e69be59bc6b",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_INTEGER = re.compile(r"^(?:0|-[1-9][0-9]*|[1-9][0-9]*)$")
_NONNEGATIVE = re.compile(r"^(?:0|[1-9][0-9]*)$")
_POSITIVE = re.compile(r"^[1-9][0-9]*$")

LOCKED_FORMULAS = {
    "origin_point_bound": "V0=lambda^(-1)+8*pi*lambda and abs(g(0))^2<=q*V0*D(a)",
    "outer_norm_constant": "E_q=q*(sqrt(1062724*lambda)*L_lambda+C2*sqrt(V0)/(24*sqrt(2)))^2",
    "outer_translation_constant": "D_q=q*(sqrt(D_tr)+sqrt(V0*C_b/2))^2",
    "outer_hybrid_series": "B_out_q=256*Z_finite*E_q+sum_j Z_j*delta_j^(-3)*min((512/3)*E_q,(5120/3)*D_q*exp(-phi_j))",
    "modal_variation": "V_star=46*lambda*c^3+108*pi*lambda^2",
    "all_index_floor": "d_LS=6*96^(-5-(320*pi/log(2))*lambda^2)",
    "projection_norm": "X_q=q*L*V_star^2/(2*pi^2*N*d_LS)",
    "projection_ratio": "A_N=3*(1+sqrt(2*N))+3*L/(4*pi*sqrt(2*N)); H_N=max(1,2*pi^2*N*A_N^2/L)",
    "projection_sampling": "B_proj_q=192*sqrt(e)*lambda*(1+log(lambda))^2*X_q*(Z_finite+(C_Z/pi)*((pi+1)*log(H_N+2)+1))",
    "complete_remainder": "C_q=(sqrt(B_out_q)+sqrt(B_proj_q))^2",
    "block_scales": "C_8=O(lambda*polylog(lambda)); C_rest=O(lambda^3*polylog(lambda))",
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "zeta_zero_table_read": False,
    "zeros_assumed_real": False,
    "global_weil_positivity_assumed": False,
    "invisible_origin_correction_retained": True,
    "compact_projection_retained": True,
    "all_sampling_cross_terms_retained": True,
    "full_cross_block_metric_replaced_by_compressions": False,
    "signed_weil_floor_claimed": False,
    "equation_5_2_claimed": False,
    "rh_proved": False,
}

CLAIM_SCOPE = {
    "proved": [
        "complete corrected outer-remainder Loewner bound for each prescribed split plus block",
        "compact projection-remainder Loewner bound with one all-index defect-floor loss",
        "C_8=O(lambda*polylog(lambda)) and C_rest=O(lambda^3*polylog(lambda)) on the exponential schedule",
    ],
    "not_proved": [
        "the blockwise physical synthesis factors",
        "identification with a quotient of a full cross-block source metric",
        "a shifted signed Weil-sector floor",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}


class ReplayError(ValueError):
    pass


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()
    except OSError as exc:
        raise ReplayError(f"cannot read pinned source: {path}") from exc


def _reject_number(token: str) -> None:
    raise ReplayError(f"non-integer JSON number {token!r} is forbidden")


def _unique(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _validate(value: Any, path: str = "payload") -> None:
    if value is None or isinstance(value, (str, bool)):
        return
    if isinstance(value, int):
        return
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path} is forbidden")
    if isinstance(value, list):
        for index, child in enumerate(value):
            _validate(child, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, child in value.items():
            if not isinstance(key, str):
                raise ReplayError(f"non-string key at {path}")
            _validate(child, f"{path}.{key}")
        return
    raise ReplayError(f"non-JSON value at {path}")


def _strict_json_loads(raw: bytes | str, label: str) -> Any:
    try:
        value = json.loads(
            raw, parse_float=_reject_number, parse_constant=_reject_number,
            object_pairs_hook=_unique,
        )
    except ReplayError:
        raise
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise ReplayError(f"{label} is not strict JSON") from exc
    _validate(value, label)
    return value


def _same(left: Any, right: Any) -> bool:
    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return set(left) == set(right) and all(_same(left[k], right[k]) for k in left)
    if isinstance(left, list):
        return len(left) == len(right) and all(_same(a, b) for a, b in zip(left, right))
    return left == right


def _int(value: Any, label: str, minimum: int | None = None) -> int:
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
    numerator, denominator = value["numerator"], value["denominator"]
    if (
        not isinstance(numerator, str) or _INTEGER.fullmatch(numerator) is None
        or not isinstance(denominator, str) or _POSITIVE.fullmatch(denominator) is None
    ):
        raise ReplayError(f"{label} has noncanonical rational text")
    result = Fraction(int(numerator), int(denominator))
    if _rational(result) != value:
        raise ReplayError(f"{label} is not a reduced canonical rational")
    return result


def _endpoint(value: Any, label: str) -> mp.mpf:
    if not isinstance(value, list) or len(value) != 4:
        raise ReplayError(f"{label} must be a four-field endpoint")
    sign = _int(value[0], f"{label}.sign", 0)
    mantissa_text = value[1]
    exponent = _int(value[2], f"{label}.exponent")
    bit_count = _int(value[3], f"{label}.bit_count", 0)
    if sign not in (0, 1) or not isinstance(mantissa_text, str) or _NONNEGATIVE.fullmatch(mantissa_text) is None:
        raise ReplayError(f"{label} has noncanonical fields")
    mantissa = int(mantissa_text)
    raw = (sign, mantissa, exponent, bit_count)
    if mantissa == 0:
        if raw != (0, 0, 0, 0):
            raise ReplayError(f"{label} has noncanonical zero")
    elif mantissa.bit_length() != bit_count:
        raise ReplayError(f"{label} has incorrect bit count")
    with mp.workprec(max(mp.mp.prec, bit_count + 10)):
        result = +mp.mpf(raw)
    if tuple(int(part) for part in result._mpf_) != raw:
        raise ReplayError(f"{label} is not canonical")
    return result


def _interval(value: Any, label: str, dps: int) -> tuple[mp.mpf, mp.mpf]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"{label} interval inventory mismatch")
    decimal, dyadic = value["decimal"], value["dyadic"]
    if (
        not isinstance(decimal, list) or len(decimal) != 2
        or not all(isinstance(part, str) for part in decimal)
        or not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}
    ):
        raise ReplayError(f"{label} interval serialization malformed")
    lower = _endpoint(dyadic["lower"], f"{label}.lower")
    upper = _endpoint(dyadic["upper"], f"{label}.upper")
    if lower > upper:
        raise ReplayError(f"{label} endpoints reversed")
    with mp.workdps(dps + 20):
        display = [mp.nstr(lower, dps + 10), mp.nstr(upper, dps + 10)]
    if decimal != display:
        raise ReplayError(f"{label} display does not match raw endpoints")
    return lower, upper


def _capture(value: object) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    with mp.workdps(mp.iv.dps + 20):
        return +mp.mpf(tuple(lower)), +mp.mpf(tuple(upper))


def _assemble(p: int, q: int, dps: int) -> tuple[dict[str, tuple[mp.mpf, mp.mpf]], dict[str, Any]]:
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        one = mp.iv.mpf(1)
        two = one + one
        lam = mp.iv.mpf(p) / two
        pi = +mp.iv.pi
        lambda_squared = lam * lam
        c = (pi + pi) * lambda_squared
        K = (pi + pi) * lam * lambda_squared
        log_two = mp.iv.log(two)
        beta = two / (pi * pi) * mp.iv.log(200 * lambda_squared + 25)
        buffer = beta * mp.iv.log(20)
        b_lo, b_hi = _capture(buffer)
        if int(mp.ceil(b_lo)) != int(mp.ceil(b_hi)):
            raise ReplayError("KRD buffer interval straddles an integer")
        buffer_ceil = int(mp.ceil(b_lo))
        n_star = p * p + 6 + buffer_ceil
        rest_limit = (n_star - 1) // 4

        log_scale = one + mp.iv.log(two + (pi + pi) * lambda_squared)
        near = (
            1_119_744 * pi * pi * lam**5
            + 290_304 * pi * pi * lam**3
            + 320 * c**4 * lam
        )
        d_tr = 6 * (82_944 * pi * pi * lam + near + 1_000_000_000 * K * K / lam)
        sqrt_three = mp.iv.sqrt(3)
        c2 = (
            40 * mp.iv.power(3, -one / 4)
            * mp.iv.exp(-(one + sqrt_three) / two)
            / mp.iv.power(one - one / sqrt_three, 2)
        )
        c_phi3 = 222_816 * mp.iv.sqrt(mp.iv.e)
        c_b = (two * c2 * c2 + (9 * c_phi3 + 4 * c2) ** 2) / 36
        v0 = one / lam + 8 * pi * lam
        e_q = q * (
            mp.iv.sqrt(1_062_724 * lam) * log_scale
            + c2 * mp.iv.sqrt(v0) / (24 * mp.iv.sqrt(two))
        ) ** 2
        d_q = q * (mp.iv.sqrt(d_tr) + mp.iv.sqrt(v0 * c_b / two)) ** 2

        L = two * mp.iv.log(lam)
        exponent = 2400 * p * p
        N = mp.iv.power(two, exponent)
        d_ls = 6 * mp.iv.power(96, -5 - (320 * pi / log_two) * lambda_squared)
        v_star = 46 * lam * c**3 + 108 * pi * lambda_squared
        x_q = q * L * v_star * v_star / (two * pi * pi * N * d_ls)
        root_2n = mp.iv.sqrt(two * N)
        a_n = 3 * (one + root_2n) + 3 * L / (4 * pi * root_2n)
        h_n = two * pi * pi * N * a_n * a_n / L

        U = two * (mp.iv.mpf(30_610_046_000) + one)
        main_count = U / (two * pi) * mp.iv.log(U / (two * pi * mp.iv.e))
        error = (
            mp.iv.mpf("0.103787") * mp.iv.log(U)
            + mp.iv.mpf("0.257297") * mp.iv.log(mp.iv.log(U))
            + mp.iv.mpf("9.367419")
        )
        z_finite = one + main_count - one / 8 + error
        c_z = (
            one + one / pi
            + two * (mp.iv.mpf("0.103787") + mp.iv.mpf("0.257297"))
            + two * mp.iv.mpf("9.367419")
        )
        b_proj = (
            192 * mp.iv.sqrt(mp.iv.e) * lam * (one + mp.iv.log(lam)) ** 2
            * x_q
            * (z_finite + (c_z / pi) * ((pi + one) * mp.iv.log(h_n + two) + one))
        )
        reserve = mp.iv.log(N) + mp.iv.log(d_ls)
        intervals = {
            "beta": _capture(beta), "V0": _capture(v0), "C2": _capture(c2),
            "C_b": _capture(c_b), "L_lambda": _capture(log_scale),
            "D_tr": _capture(d_tr), "E_q": _capture(e_q), "D_q": _capture(d_q),
            "logarithmic_length_L": _capture(L), "d_LS": _capture(d_ls),
            "V_star": _capture(v_star), "X_q": _capture(x_q),
            "A_N": _capture(a_n), "H_N": _capture(h_n),
            "Z_finite": _capture(z_finite), "C_Z": _capture(c_z),
            "B_proj_q": _capture(b_proj), "log_N_times_d_LS": _capture(reserve),
        }
        exact = {
            "lambda": _rational(Fraction(p, 2)),
            "lambda_squared": _rational(Fraction(p * p, 4)),
            "modal_rows": q,
            "shannon_index": p * p,
            "buffer_ceil": buffer_ceil,
            "n_star": n_star,
            "projection_exponent_base_2": exponent,
            "singleton_modal_rows": 3,
            "rest_modal_row_limit": rest_limit,
            "rest_limit_below_three_halves_lambda_squared": Fraction(rest_limit) <= Fraction(3 * p * p, 8),
            "outer_constants_exactly_linear_in_q": True,
            "projection_constant_exactly_linear_in_q": True,
        }
        return intervals, exact
    finally:
        mp.iv.dps = old


def reconstruct(p: int, q: int, dps: int) -> tuple[dict[str, tuple[mp.mpf, mp.mpf]], dict[str, Any]]:
    p = _int(p, "lambda_numerator", 5)
    q = _int(q, "modal_rows", 1)
    dps = _int(dps, "interval_decimal_digits", 50)
    if p % 2 == 0:
        raise ReplayError("lambda_numerator must be odd")
    intervals, exact = _assemble(p, q, dps)
    if q > exact["rest_modal_row_limit"]:
        raise ReplayError("modal_rows exceeds the prescribed split-plus inventory")
    if intervals["H_N"][0] <= 1 or intervals["log_N_times_d_LS"][0] <= 0:
        raise ReplayError("projection positivity check failed")
    return intervals, exact


def _source_hashes() -> dict[str, str]:
    root = _root()
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None or _sha256(root / relative) != expected:
            raise ReplayError(f"source byte hash mismatch: {relative}")
    lock = _strict_json_loads((root / SOURCE_LOCK).read_bytes(), "source lock")
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "dependencies", "locked_conventions", "locked_formulas", "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("source-lock inventory mismatch")
    fixed = {
        "schema": "xi-prolate-growing-transition-sampling-source-lock-v1",
        "claim_class": "GROWING_TRANSITION_REMAINDER_LOEWNER_BOUND",
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
        relative, expected, role = item["path"], item["sha256"], item["role"]
        if (
            not isinstance(relative, str) or not relative or Path(relative).is_absolute()
            or ".." in Path(relative).parts or relative in result
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ReplayError("invalid source-lock dependency")
        if _sha256(root / relative) != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def replay(payload: dict[str, Any], *, producer_bytes: bytes | None = None) -> dict[str, Any]:
    if producer_bytes is None or not isinstance(producer_bytes, bytes):
        raise ReplayError("exact producer artifact bytes are required")
    decoded = _strict_json_loads(producer_bytes, "producer bytes")
    if not _same(decoded, payload):
        raise ReplayError("producer bytes do not decode exactly to replay payload")
    _validate(payload)
    expected_top = {
        "schema", "status", "terminal_state", "input", "source_hashes",
        "locked_formulas", "source_admissions", "certificate", "arithmetic",
        "producer_pass_boolean_trusted_by_replay", "claim_scope", "result",
    }
    if not isinstance(payload, dict) or set(payload) != expected_top:
        raise ReplayError("artifact inventory mismatch")
    fixed = {
        "schema": SCHEMA, "status": STATUS, "terminal_state": TERMINAL_STATE,
        "locked_formulas": LOCKED_FORMULAS, "source_admissions": SOURCE_ADMISSIONS,
        "producer_pass_boolean_trusted_by_replay": False,
        "claim_scope": CLAIM_SCOPE, "result": RESULT,
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
        "lambda_numerator", "lambda_denominator", "modal_rows", "interval_decimal_digits",
    }:
        raise ReplayError("input inventory mismatch")
    p = _int(inputs["lambda_numerator"], "lambda_numerator", 5)
    if _int(inputs["lambda_denominator"], "lambda_denominator") != 2:
        raise ReplayError("lambda denominator mutation")
    q = _int(inputs["modal_rows"], "modal_rows", 1)
    dps = _int(inputs["interval_decimal_digits"], "interval_decimal_digits", 50)
    intervals, exact = reconstruct(p, q, dps)

    certificate = payload["certificate"]
    if not isinstance(certificate, dict) or set(certificate) != {
        "exact", "outward_intervals", "finite_outer_bound", "complete_loewner_constant",
    }:
        raise ReplayError("certificate inventory mismatch")
    if certificate["finite_outer_bound"] != "B_out_q is the exact convergent minimum series in locked_formulas":
        raise ReplayError("finite outer bound mutation")
    if certificate["complete_loewner_constant"] != "C_q=(sqrt(B_out_q)+sqrt(B_proj_q))^2":
        raise ReplayError("complete Loewner constant mutation")
    supplied_exact = certificate["exact"]
    if not isinstance(supplied_exact, dict) or set(supplied_exact) != set(exact):
        raise ReplayError("exact certificate inventory mismatch")
    for name, expected in exact.items():
        if name in {"lambda", "lambda_squared"}:
            _parse_rational(supplied_exact[name], name)
        if not _same(supplied_exact[name], expected):
            raise ReplayError(f"exact field {name} differs from reconstruction")
    supplied_intervals = certificate["outward_intervals"]
    if not isinstance(supplied_intervals, dict) or set(supplied_intervals) != set(intervals):
        raise ReplayError("interval inventory mismatch")
    overlap: dict[str, bool] = {}
    for name, reconstructed in intervals.items():
        supplied = _interval(supplied_intervals[name], name, dps)
        if supplied[0] > reconstructed[1] or reconstructed[0] > supplied[1]:
            raise ReplayError(f"{name} producer/verifier intervals do not overlap")
        overlap[name] = True
    hashes = _source_hashes()
    if not _same(payload["source_hashes"], hashes):
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
            "origin_correction_retained": True,
            "compact_projection_retained": True,
            "only_one_d_LS_inverse_loss": True,
            "all_sampling_cross_terms_retained": True,
            "full_cross_block_metric_not_substituted": True,
            "projection_exponent_reserve_positive": intervals["log_N_times_d_LS"][0] > 0,
        },
        "interval_overlap": overlap,
        "reconstructed_exact_certificate": exact,
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
