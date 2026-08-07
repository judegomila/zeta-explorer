#!/usr/bin/env python3
"""Independent interval replay of the Chebyshev--Hankel moment bounds.

This verifier intentionally does not import ``src/chebyshev_hankel_bound.py``.
It reads a producer artifact, checks the exact Fiori--Kadiri--Swidinsky v3
source contract and vendored PDF hash, reconstructs the three integer upper
incomplete-gamma sums, and compares all seven serialized outward intervals
with independently evaluated ``mpmath.iv`` intervals.

The producer and verifier still share the ``mpmath.iv`` implementation.  The
replay is therefore an independent assembly path, not an independent interval
arithmetic library or a signed Weil lower-bound certificate.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from dataclasses import dataclass
from fractions import Fraction
from pathlib import Path
from typing import Mapping, Sequence

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]

LOCKED_PNT_A = "9.22022"
LOCKED_PNT_ALPHA = "0.8476836"
LOCKED_PNT_FORMULA = (
    "abs(psi(X)-X)/X < A*(log X)^(3/2)*exp(-alpha*sqrt(log X)) for X>2"
)
LOCKED_KERNEL_FORMULA = (
    "delta_star(x)=1-exp(-x)*psi(exp(x))-(1/2)*exp(-x)*log(1-exp(-2*x))"
)
LOCKED_SOURCE_SHA256 = (
    "15eff02042f2c1ab4878d029ce52a0abd6c95d66995b183a2dbc689ce9af49a4"
)
LOCKED_SOURCE_PATH = "vendor/FKS-PNT-2204.02588v3.pdf"
LOCKED_SOURCE_VERSION = "arXiv:2204.02588v3"
LOCKED_SOURCE_RESULT = "Corollary 1.4 in the v3 PDF"

LOCKED_SOURCE_FORMULAS = {
    "source_bound": (
        "abs(psi(X)-X)/X < 9.22022*(log X)^(3/2)*"
        "exp(-0.8476836*sqrt(log X)) for every X>2"
    ),
    "log_coordinate_conversion": (
        "abs(1-exp(-x)*psi(exp(x))) < A*x^(3/2)*exp(-alpha*sqrt(x)) "
        "for x>log(2), with A=9.22022 and alpha=0.8476836"
    ),
    "combined_kernel": LOCKED_KERNEL_FORMULA,
    "moment_conclusion": (
        "integral_0^infinity abs(delta_star(x))^2 dx and "
        "integral_0^infinity x*abs(delta_star(x))^2 dx are finite"
    ),
}

LOCKED_ARTIFACT_FORMULAS = {
    "PNT": LOCKED_PNT_FORMULA,
    "combined_kernel": LOCKED_KERNEL_FORMULA,
    "x0": "log(2)",
    "C_minus1": "integral_0^infinity abs(delta_star(x)) dx",
    "C0_squared": "integral_0^infinity abs(delta_star(x))^2 dx",
    "C1_squared": "integral_0^infinity x*abs(delta_star(x))^2 dx",
}

INTERVAL_KEYS = (
    "x0",
    "near_origin_bracket",
    "C_minus1_upper_expression",
    "C0_squared_upper_expression",
    "C1_squared_upper_expression",
    "C0_upper",
    "C1_upper",
)

UPPER_ENDPOINT_MAP = {
    "C_minus1": "C_minus1_upper_expression",
    "C0": "C0_upper",
    "C1": "C1_upper",
}

_DECIMAL_RE = re.compile(
    r"[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:[eE][+-]?\d+)?\Z"
)


@dataclass(frozen=True)
class ClosedInterval:
    """Stable copies of outward interval endpoints."""

    lower: mp.mpf
    upper: mp.mpf

    def __post_init__(self) -> None:
        if self.lower > self.upper:
            raise ValueError("interval endpoints are reversed")


def require_precision(dps: int) -> int:
    """Require an exact JSON/Python integer precision, never binary64."""
    if isinstance(dps, bool) or not isinstance(dps, int):
        raise TypeError("interval decimal digits must be an exact integer")
    if dps < 30:
        raise ValueError("at least 30 interval decimal digits are required")
    return dps


def parse_exact_decimal(value: object, label: str) -> Fraction:
    """Parse finite decimal text through ``Fraction``; reject JSON numbers."""
    if not isinstance(value, str):
        raise TypeError(f"{label} must be exact decimal text, never binary64")
    if not _DECIMAL_RE.fullmatch(value):
        raise ValueError(f"{label} is not finite exact decimal text")
    try:
        return Fraction(value)
    except (ValueError, ZeroDivisionError) as exc:  # defensive for Fraction
        raise ValueError(f"{label} is not valid exact decimal text") from exc


def _iv_fraction(value: Fraction) -> object:
    return mp.iv.mpf(value.numerator) / mp.iv.mpf(value.denominator)


def _copy_interval(value: object, dps: int) -> ClosedInterval:
    raw_lower, raw_upper = value._mpi_  # type: ignore[attr-defined]
    with mp.workdps(dps + 20):
        result = ClosedInterval(+mp.mpf(raw_lower), +mp.mpf(raw_upper))
    if not mp.isfinite(result.lower) or not mp.isfinite(result.upper):
        raise ArithmeticError("reconstructed interval is not finite")
    return result


def _integer_upper_gamma(n: int, z: object) -> object:
    """Reconstruct Gamma(n,z) from the exact terminating integer sum.

    The reverse Horner assembly differs from the producer's forward term
    recurrence while evaluating the same identity

        Gamma(n,z) = (n-1)! exp(-z) sum_{j=0}^{n-1} z^j/j!.
    """
    if isinstance(n, bool) or not isinstance(n, int) or n < 1:
        raise ValueError("integer upper gamma requires n>=1")
    polynomial = mp.iv.mpf(1) / math.factorial(n - 1)
    for j in range(n - 2, -1, -1):
        polynomial = polynomial * z + mp.iv.mpf(1) / math.factorial(j)
    return math.factorial(n - 1) * mp.iv.exp(-z) * polynomial


def require_locked_source_contract(
    *,
    A: object = LOCKED_PNT_A,
    alpha: object = LOCKED_PNT_ALPHA,
    pnt_formula: object = LOCKED_PNT_FORMULA,
    kernel_formula: object = LOCKED_KERNEL_FORMULA,
) -> None:
    """Reject any decimal or formula mutation before interval evaluation."""
    supplied = {
        "PNT A": (A, LOCKED_PNT_A),
        "PNT alpha": (alpha, LOCKED_PNT_ALPHA),
        "PNT formula": (pnt_formula, LOCKED_PNT_FORMULA),
        "combined kernel": (kernel_formula, LOCKED_KERNEL_FORMULA),
    }
    for label, (actual, expected) in supplied.items():
        if not isinstance(actual, str):
            raise TypeError(f"{label} must be exact source text")
        if actual != expected:
            raise ValueError(f"{label} differs from the pinned v3 contract")


def verify_local_source_lock(root: Path = ROOT) -> dict[str, object]:
    """Check hardcoded v3 metadata against the local lock and PDF bytes."""
    lock_path = root / "P3_SOURCE_LOCK.json"
    lock = json.loads(lock_path.read_text(encoding="utf-8"))
    if not isinstance(lock, Mapping):
        raise TypeError("P3 source lock must be a JSON object")
    if lock.get("lock_version") != 1:
        raise ValueError("P3 source lock version differs from the replay contract")

    formulas = lock.get("locked_formulas")
    if not isinstance(formulas, Mapping):
        raise KeyError("P3 source lock omits locked_formulas")
    for key, expected in LOCKED_SOURCE_FORMULAS.items():
        actual = formulas.get(key)
        if not isinstance(actual, str) or actual != expected:
            raise ValueError(f"P3 source-lock formula differs at {key}")

    sources = lock.get("binding_sources")
    if (
        not isinstance(sources, Sequence)
        or isinstance(sources, (str, bytes))
        or len(sources) != 1
        or not isinstance(sources[0], Mapping)
    ):
        raise ValueError("P3 source lock must contain exactly one binding source")
    source = sources[0]
    expected_source_fields = {
        "id": "FKS-PNT-v3",
        "version": LOCKED_SOURCE_VERSION,
        "vendored_path": LOCKED_SOURCE_PATH,
        "vendored_sha256": LOCKED_SOURCE_SHA256,
        "locked_result": LOCKED_SOURCE_RESULT,
    }
    for key, expected in expected_source_fields.items():
        actual = source.get(key)
        if not isinstance(actual, str) or actual != expected:
            raise ValueError(f"P3 binding-source metadata differs at {key}")

    pdf_path = root / LOCKED_SOURCE_PATH
    digest = hashlib.sha256(pdf_path.read_bytes()).hexdigest()
    if digest != LOCKED_SOURCE_SHA256:
        raise ValueError("vendored FKS v3 PDF hash differs from the source lock")
    return {
        "lock": "P3_SOURCE_LOCK.json",
        "source": LOCKED_SOURCE_PATH,
        "version": LOCKED_SOURCE_VERSION,
        "sha256": digest,
        "locked_result": LOCKED_SOURCE_RESULT,
    }


def reconstruct(dps: int) -> dict[str, ClosedInterval]:
    """Independently reconstruct gamma sums and all seven output intervals."""
    dps = require_precision(dps)
    A_exact = parse_exact_decimal(LOCKED_PNT_A, "locked PNT A")
    alpha_exact = parse_exact_decimal(LOCKED_PNT_ALPHA, "locked PNT alpha")
    old_iv_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        A = _iv_fraction(A_exact)
        alpha = _iv_fraction(alpha_exact)
        x0 = mp.iv.log(mp.iv.mpf(2))
        ell = mp.iv.log(x0)
        near = mp.iv.mpf(5) / 2 - mp.iv.mpf(3) * ell / 2 + ell**2 / 4

        gamma5 = _integer_upper_gamma(5, alpha * mp.iv.sqrt(x0))
        gamma8 = _integer_upper_gamma(8, 2 * alpha * mp.iv.sqrt(x0))
        gamma10 = _integer_upper_gamma(10, 2 * alpha * mp.iv.sqrt(x0))

        C_minus1 = (
            x0 * (mp.iv.mpf(3) / 2 - ell / 2)
            + 2 * A * gamma5 / alpha**5
            + mp.iv.mpf(1) / 36
        )
        C0_squared = (
            x0 * near
            + 4 * A**2 * gamma8 / (2 * alpha) ** 8
            + mp.iv.mpf(1) / 432
        )
        C1_squared = (
            x0**2 * near
            + 4 * A**2 * gamma10 / (2 * alpha) ** 10
            + mp.iv.mpf(8)
            * mp.iv.exp(-6 * x0)
            * (x0 / 6 + mp.iv.mpf(1) / 36)
            / 9
        )
        reconstructed = {
            "gamma_5": _copy_interval(gamma5, dps),
            "gamma_8": _copy_interval(gamma8, dps),
            "gamma_10": _copy_interval(gamma10, dps),
            "x0": _copy_interval(x0, dps),
            "near_origin_bracket": _copy_interval(near, dps),
            "C_minus1_upper_expression": _copy_interval(C_minus1, dps),
            "C0_squared_upper_expression": _copy_interval(C0_squared, dps),
            "C1_squared_upper_expression": _copy_interval(C1_squared, dps),
            "C0_upper": _copy_interval(mp.iv.sqrt(C0_squared), dps),
            "C1_upper": _copy_interval(mp.iv.sqrt(C1_squared), dps),
        }
    finally:
        mp.iv.dps = old_iv_dps

    for key in INTERVAL_KEYS:
        value = reconstructed[key]
        if value.lower <= 0:
            raise ArithmeticError(f"independent interval {key} is not positive")
    return reconstructed


def _parse_text_interval(
    value: object, dps: int, name: str
) -> tuple[ClosedInterval, tuple[Fraction, Fraction]]:
    """Parse and bound a producer interval without accepting JSON floats."""
    if (
        not isinstance(value, Sequence)
        or isinstance(value, (str, bytes))
        or len(value) != 2
    ):
        raise TypeError(f"producer interval {name} must be a two-element array")
    lower_exact = parse_exact_decimal(value[0], f"{name} lower endpoint")
    upper_exact = parse_exact_decimal(value[1], f"{name} upper endpoint")
    if lower_exact > upper_exact:
        raise ValueError(f"producer interval {name} has reversed endpoints")
    if lower_exact <= 0:
        raise ValueError(f"producer interval {name} must be strictly positive")

    # A huge enclosure would overlap almost anything and make replay vacuous.
    # Permit eight guard decimal digits beyond the declared interval error.
    magnitude = max(Fraction(1), abs(lower_exact), abs(upper_exact))
    maximum_width = magnitude * Fraction(1, 10 ** max(1, dps - 8))
    if upper_exact - lower_exact > maximum_width:
        raise ValueError(f"producer interval {name} is vacuously wide")

    old_iv_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        lower_iv = _iv_fraction(lower_exact)
        upper_iv = _iv_fraction(upper_exact)
        lower_raw, _ = lower_iv._mpi_  # type: ignore[attr-defined]
        _, upper_raw = upper_iv._mpi_  # type: ignore[attr-defined]
        with mp.workdps(dps + 20):
            parsed = ClosedInterval(mp.mpf(lower_raw), mp.mpf(upper_raw))
    finally:
        mp.iv.dps = old_iv_dps
    return parsed, (lower_exact, upper_exact)


def intervals_overlap(left: ClosedInterval, right: ClosedInterval) -> bool:
    return max(left.lower, right.lower) <= min(left.upper, right.upper)


def _intersection(
    left: ClosedInterval, right: ClosedInterval
) -> ClosedInterval | None:
    lower = max(left.lower, right.lower)
    upper = min(left.upper, right.upper)
    return ClosedInterval(lower, upper) if lower <= upper else None


def _require_exact_mapping(
    supplied: object, expected: Mapping[str, str], label: str
) -> Mapping[str, object]:
    if not isinstance(supplied, Mapping):
        raise KeyError(f"producer artifact omits {label}")
    for key, expected_value in expected.items():
        actual = supplied.get(key)
        if not isinstance(actual, str):
            raise TypeError(f"producer {label}.{key} must be exact text")
        if actual != expected_value:
            raise ValueError(f"producer {label}.{key} differs from the lock")
    return supplied


def replay_artifact(path: Path, dps: int | None = None) -> dict[str, object]:
    """Read, independently reconstruct, and compare a producer artifact."""
    producer = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(producer, Mapping):
        raise TypeError("producer artifact must contain a JSON object")

    if producer.get("claim_class") != (
        "ANALYTIC_UNIFORM_COMBINED_KERNEL_MOMENT_BOUND"
    ):
        raise ValueError("producer claim class differs from the replay contract")
    if producer.get("terminal_state") != "P0_INVALIDATED":
        raise ValueError("producer terminal state exceeds the allowed claim boundary")
    if producer.get("signed_lower_bound_claim") is not False:
        raise ValueError("producer must not assert a signed lower bound")
    if producer.get("equation_5_2_claim") is not False:
        raise ValueError("producer must not assert equation (5.2)")

    inputs = producer.get("inputs")
    if not isinstance(inputs, Mapping):
        raise KeyError("producer artifact omits inputs")
    artifact_dps = require_precision(inputs.get("interval_decimal_digits"))  # type: ignore[arg-type]
    used_dps = require_precision(dps) if dps is not None else artifact_dps
    if used_dps < artifact_dps:
        raise ValueError("replay precision must not be below producer precision")

    A = inputs.get("A_exact_decimal")
    alpha = inputs.get("alpha_exact_decimal")
    arithmetic_library = inputs.get("arithmetic_library")
    require_locked_source_contract(A=A, alpha=alpha)
    # Force an exact-decimal parse as well as an exact lock-string comparison.
    parse_exact_decimal(A, "producer PNT A")
    parse_exact_decimal(alpha, "producer PNT alpha")
    expected_library = f"mpmath.iv {mp.__version__}"
    if not isinstance(arithmetic_library, str):
        raise TypeError("producer arithmetic library metadata must be text")
    if arithmetic_library != expected_library:
        raise ValueError("producer arithmetic library metadata differs from replay")

    formulas = _require_exact_mapping(
        producer.get("locked_formulas"),
        LOCKED_ARTIFACT_FORMULAS,
        "locked_formulas",
    )
    require_locked_source_contract(
        A=A,
        alpha=alpha,
        pnt_formula=formulas["PNT"],
        kernel_formula=formulas["combined_kernel"],
    )

    expected_source_chain = {
        "lock": "P3_SOURCE_LOCK.json",
        "source": LOCKED_SOURCE_PATH,
        "sha256": LOCKED_SOURCE_SHA256,
    }
    _require_exact_mapping(
        producer.get("source_chain"), expected_source_chain, "source_chain"
    )
    verified_source = verify_local_source_lock(ROOT)

    supplied_values = producer.get("outward_intervals")
    if not isinstance(supplied_values, Mapping):
        raise KeyError("producer artifact omits outward_intervals")
    missing = [key for key in INTERVAL_KEYS if key not in supplied_values]
    if missing:
        raise KeyError(f"producer omits outward intervals: {missing}")

    reconstructed = reconstruct(used_dps)
    supplied: dict[str, ClosedInterval] = {}
    exact_supplied: dict[str, tuple[Fraction, Fraction]] = {}
    overlap: dict[str, bool] = {}
    intersections: dict[str, ClosedInterval | None] = {}
    for key in INTERVAL_KEYS:
        supplied[key], exact_supplied[key] = _parse_text_interval(
            supplied_values[key], artifact_dps, key
        )
        overlap[key] = intervals_overlap(supplied[key], reconstructed[key])
        intersections[key] = _intersection(supplied[key], reconstructed[key])

    certified = producer.get("certified_upper_endpoints")
    if not isinstance(certified, Mapping):
        raise KeyError("producer artifact omits certified_upper_endpoints")
    endpoint_agreement: dict[str, bool] = {}
    for label, interval_key in UPPER_ENDPOINT_MAP.items():
        endpoint = certified.get(label)
        endpoint_exact = parse_exact_decimal(
            endpoint, f"certified upper endpoint {label}"
        )
        serialized_interval = supplied_values[interval_key]
        assert isinstance(serialized_interval, Sequence)
        # The producer emits the certified endpoint from exactly the same mpf
        # as the interval's upper endpoint.  Exact textual equality prevents a
        # rounded-down or unrelated scalar from being advertised as certified.
        endpoint_agreement[label] = (
            endpoint == serialized_interval[1]
            and endpoint_exact == exact_supplied[interval_key][1]
        )

    passed = all(overlap.values()) and all(endpoint_agreement.values())
    digits = used_dps + 10

    def interval_strings(value: ClosedInterval) -> list[str]:
        return [mp.nstr(value.lower, digits), mp.nstr(value.upper, digits)]

    gamma_keys = ("gamma_5", "gamma_8", "gamma_10")
    return {
        "terminal_state": "P0_INVALIDATED",
        "claim_class": "CHEBYSHEV_HANKEL_INTERVAL_INDEPENDENT_REPLAY",
        "signed_lower_bound_claim": False,
        "equation_5_2_claim": False,
        "input_artifact": str(path),
        "inputs": {
            "producer_interval_decimal_digits": artifact_dps,
            "replay_interval_decimal_digits": used_dps,
            "A_exact_decimal": LOCKED_PNT_A,
            "alpha_exact_decimal": LOCKED_PNT_ALPHA,
            "producer_arithmetic_library": arithmetic_library,
            "replay_arithmetic_library": expected_library,
        },
        "locked_formulas": dict(LOCKED_ARTIFACT_FORMULAS),
        "source_chain_verified_from_local_bytes": verified_source,
        "integer_upper_gamma_identity": (
            "Gamma(n,z)=(n-1)!*exp(-z)*sum_(j=0)^(n-1) z^j/j!"
        ),
        "reconstructed_gamma_intervals": {
            key: interval_strings(reconstructed[key]) for key in gamma_keys
        },
        "reconstructed_outward_intervals": {
            key: interval_strings(reconstructed[key]) for key in INTERVAL_KEYS
        },
        "producer_outward_intervals": {
            key: interval_strings(supplied[key]) for key in INTERVAL_KEYS
        },
        "intersection_intervals": {
            key: (
                interval_strings(intersections[key])
                if intersections[key] is not None
                else None
            )
            for key in INTERVAL_KEYS
        },
        "intervals_overlap": overlap,
        "certified_upper_endpoints_match_interval_text": endpoint_agreement,
        "producer_check_booleans_trusted": False,
        "replay_agrees": passed,
        "limitations": [
            "producer and verifier share the mpmath.iv arithmetic library",
            "mpmath.iv is not an independent Arb or MPFI implementation",
            "this replays only finite uniform moments of the combined signed kernel",
            "no prolate boundary-profile estimate, signed sector floor, equation (5.2), determinant convergence, or RH claim",
        ],
    }


def replay(path: Path, dps: int | None = None) -> dict[str, object]:
    """Compatibility alias for command-line and test callers."""
    return replay_artifact(path, dps)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("artifact", type=Path)
    parser.add_argument("--dps", type=int)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = replay_artifact(args.artifact, args.dps)
    text = json.dumps(result, indent=2) + "\n"
    if args.output is not None:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")
    if result["replay_agrees"] is not True:
        raise SystemExit(1)


__all__ = [
    "ClosedInterval",
    "INTERVAL_KEYS",
    "LOCKED_ARTIFACT_FORMULAS",
    "LOCKED_KERNEL_FORMULA",
    "LOCKED_PNT_A",
    "LOCKED_PNT_ALPHA",
    "LOCKED_PNT_FORMULA",
    "LOCKED_SOURCE_SHA256",
    "UPPER_ENDPOINT_MAP",
    "intervals_overlap",
    "parse_exact_decimal",
    "reconstruct",
    "replay",
    "replay_artifact",
    "require_locked_source_contract",
    "require_precision",
    "verify_local_source_lock",
]


if __name__ == "__main__":
    main()
