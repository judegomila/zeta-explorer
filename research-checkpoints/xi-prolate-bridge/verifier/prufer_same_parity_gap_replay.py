#!/usr/bin/env python3
"""Independent replay of the elementary same-parity prolate gap artifact.

The verifier imports no producer module, reconstructs the exact Legendre
oracles from closed center formulas, and reassembles every transcendental
quantity from exact textual parameters.  It shares ``mpmath.iv`` with the
producer, which is stated in both outputs.  It never runs a Sturm solver or
trusts a cached prolate eigenvalue.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from fractions import Fraction
import hashlib
import json
from math import comb
from pathlib import Path
from typing import Sequence

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
PRODUCER_VERSION = "0.18.1-prufer-same-parity-gap"
REPLAY_VERSION = "0.18.1-prufer-same-parity-gap-replay"

EXPECTED_FORMULAS = {
    "operator": "-d/dx((1-x^2)*dy/dx)+c^2*x^2*y=mu*y",
    "half_line_equation": (
        "u''=sech(t)^2*(c^2*tanh(t)^2-nu)*u; x=tanh(t)"
    ),
    "endpoint_normalization": "u(infinity,nu)=1; u'(infinity,nu)=0",
    "phase": "continuous_lift_arg(u(0,nu)+i*u'(0,nu))",
    "phase_target": "phi(mu_m)=m*pi/2",
    "same_parity_index": "j=n+2*r",
    "K_squared": "max(1,2*c^2+j*(j+1))",
    "gap": "(16*r*pi/(225*K^2))*exp(-2*pi*K)",
    "project_bandwidth": "c=2*pi*lambda^2",
    "differential_eigenvalue_symbol": "mu",
}

EXPECTED_PROOF_CONSTANTS = {
    "volterra_tail_operator_norm_upper": "1/4",
    "u_T_lower": "2/3",
    "u_T_upper": "4/3",
    "absolute_u_prime_T_upper": "2/3",
    "energy_T_lower": "16/45",
    "energy_T_upper": "7/3",
    "center_Cauchy_lower_coefficient": "64/225",
    "numerator_upper_coefficient": "4",
    "phase_derivative_upper_coefficient": "225/16",
    "step_four_gap_prefactor_in_units_of_pi": "32/225",
}

INTERVAL_KEYS = (
    "pi",
    "c",
    "c_squared",
    "K_squared",
    "K",
    "gap_lower_bound",
    "log10_gap_lower_bound",
)


@dataclass(frozen=True)
class ClosedInterval:
    lower: mp.mpf
    upper: mp.mpf

    def __post_init__(self) -> None:
        if self.lower > self.upper:
            raise ValueError("interval endpoints are reversed")


@dataclass(frozen=True)
class ExactDyadicInterval:
    lower: Fraction
    upper: Fraction

    def __post_init__(self) -> None:
        if self.lower > self.upper:
            raise ValueError("exact dyadic interval endpoints are reversed")


def _sha256(relative_path: str) -> str:
    return hashlib.sha256((ROOT / relative_path).read_bytes()).hexdigest()


def _fraction(value: object, label: str) -> Fraction:
    if not isinstance(value, str):
        raise TypeError(f"{label} must be exact rational text; binary64 is forbidden")
    try:
        return Fraction(value)
    except (ValueError, ZeroDivisionError) as exc:
        raise ValueError(f"invalid exact rational for {label}") from exc


def _fraction_text(value: Fraction) -> str:
    if value.denominator == 1:
        return str(value.numerator)
    return f"{value.numerator}/{value.denominator}"


def _exact_integer(value: object, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact JSON integer")
    if value < minimum:
        raise ValueError(f"{label} must be at least {minimum}")
    return value


def _copy_interval(value: object, dps: int) -> ClosedInterval:
    raw_lower, raw_upper = value._mpi_  # type: ignore[attr-defined]
    with mp.workdps(dps + 20):
        return ClosedInterval(mp.mpf(raw_lower), mp.mpf(raw_upper))


def _parse_dyadic(value: object, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {
        "sign",
        "mantissa_decimal_text",
        "binary_exponent",
    }:
        raise TypeError(f"{label} must be an exact dyadic endpoint object")
    sign = value["sign"]
    mantissa_text = value["mantissa_decimal_text"]
    exponent = value["binary_exponent"]
    if isinstance(sign, bool) or not isinstance(sign, int) or sign not in (0, 1):
        raise TypeError(f"{label} sign must be the exact integer 0 or 1")
    if not isinstance(mantissa_text, str) or not mantissa_text.isdigit():
        raise TypeError(f"{label} mantissa must be unsigned decimal text")
    if isinstance(exponent, bool) or not isinstance(exponent, int):
        raise TypeError(f"{label} binary exponent must be an exact integer")
    mantissa = int(mantissa_text)
    value_fraction = Fraction(mantissa)
    if exponent >= 0:
        value_fraction *= 2**exponent
    else:
        value_fraction /= 2 ** (-exponent)
    return -value_fraction if sign else value_fraction


def _parse_interval(value: object, label: str) -> ExactDyadicInterval:
    if not isinstance(value, dict) or set(value) != {
        "endpoint_format",
        "lower_exact_dyadic",
        "upper_exact_dyadic",
        "decimal_display_only",
    }:
        raise TypeError(f"{label} must contain exact dyadic endpoints")
    if value["endpoint_format"] != "signed_mantissa_times_2_power_v1":
        raise ValueError(f"unsupported exact endpoint format for {label}")
    display = value["decimal_display_only"]
    if (
        not isinstance(display, Sequence)
        or isinstance(display, (str, bytes))
        or len(display) != 2
        or not all(isinstance(item, str) for item in display)
    ):
        raise TypeError(f"{label} decimal display must contain two strings")
    return ExactDyadicInterval(
        _parse_dyadic(value["lower_exact_dyadic"], f"{label} lower"),
        _parse_dyadic(value["upper_exact_dyadic"], f"{label} upper"),
    )


def _mpf_as_fraction(value: mp.mpf) -> Fraction:
    sign, mantissa, exponent, _bit_count = value._mpf_
    result = Fraction(mantissa)
    if exponent >= 0:
        result *= 2**exponent
    else:
        result /= 2 ** (-exponent)
    return -result if sign else result


def _contains_exact(
    outer: ExactDyadicInterval, inner: ClosedInterval
) -> bool:
    return (
        outer.lower <= _mpf_as_fraction(inner.lower)
        and _mpf_as_fraction(inner.upper) <= outer.upper
    )


def reconstruct_c0_oracles(maximum_index: int = 4) -> list[dict[str, object]]:
    """Use closed Legendre center formulas, independent of the recurrence."""

    maximum_index = _exact_integer(maximum_index, "maximum index", 0)
    records: list[dict[str, object]] = []
    for m in range(maximum_index + 1):
        if m % 2 == 0:
            k = m // 2
            center = Fraction((-1) ** k * comb(2 * k, k), 4**k)
            center_derivative = Fraction(0)
        else:
            k = (m - 1) // 2
            center = Fraction(0)
            center_derivative = Fraction(
                (-1) ** k * (2 * k + 1) * comb(2 * k, k), 4**k
            )
        half_line_norm = Fraction(1, 2 * m + 1)
        phase_derivative = half_line_norm / (
            center**2 + center_derivative**2
        )
        records.append(
            {
                "m": m,
                "mu_m_at_c0": _fraction_text(Fraction(m * (m + 1))),
                "P_m_at_zero": _fraction_text(center),
                "P_m_prime_at_zero": _fraction_text(center_derivative),
                "half_line_L2_norm_squared": _fraction_text(half_line_norm),
                "phase_derivative_at_mu_m": _fraction_text(phase_derivative),
                "lifted_phase_in_units_of_pi": _fraction_text(Fraction(m, 2)),
            }
        )
    return records


def reconstruct_intervals(
    lambda_exact: Fraction, n: int, r: int, dps: int
) -> dict[str, ClosedInterval]:
    """Reassemble the bound through a deliberately different expression."""

    if lambda_exact < 0:
        raise ValueError("lambda must be nonnegative")
    n = _exact_integer(n, "n", 0)
    r = _exact_integer(r, "r", 1)
    dps = _exact_integer(dps, "dps", 40)
    j = n + 2 * r

    old_iv_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(lambda_exact.numerator) / mp.iv.mpf(
            lambda_exact.denominator
        )
        pi = mp.iv.pi
        # Directly square the project convention, rather than squaring a
        # cached producer c interval.
        c = 2 * pi * lam**2
        c_squared = 4 * pi**2 * lam**4
        K_squared = j * (j + 1) + 2 * c_squared
        K = mp.iv.sqrt(K_squared)
        # Division by exp(+2*pi*K) is algebraically the theorem expression
        # but follows a different interval evaluation tree from the producer.
        gap = (mp.iv.mpf(16 * r) / 225) * (pi / K_squared) / mp.iv.exp(
            (2 * pi) * K
        )
        log10_gap = mp.iv.log(gap) / mp.iv.log(10)
        result = {
            "pi": _copy_interval(pi, dps),
            "c": _copy_interval(c, dps),
            "c_squared": _copy_interval(c_squared, dps),
            "K_squared": _copy_interval(K_squared, dps),
            "K": _copy_interval(K, dps),
            "gap_lower_bound": _copy_interval(gap, dps),
            "log10_gap_lower_bound": _copy_interval(log10_gap, dps),
        }
    finally:
        mp.iv.dps = old_iv_dps

    if result["gap_lower_bound"].lower <= 0:
        raise ArithmeticError("independent interval bound lost strict positivity")
    return result


def _serialize_dyadic(value: mp.mpf) -> dict[str, object]:
    sign, mantissa, exponent, _bit_count = value._mpf_
    return {
        "sign": int(sign),
        "mantissa_decimal_text": str(mantissa),
        "binary_exponent": int(exponent),
    }


def _serialize_interval(interval: ClosedInterval, digits: int) -> dict[str, object]:
    return {
        "endpoint_format": "signed_mantissa_times_2_power_v1",
        "lower_exact_dyadic": _serialize_dyadic(interval.lower),
        "upper_exact_dyadic": _serialize_dyadic(interval.upper),
        "decimal_display_only": [
            mp.nstr(interval.lower, digits),
            mp.nstr(interval.upper, digits),
        ],
    }


def replay_artifact(
    artifact: dict[str, object], replay_dps: int | None = None
) -> dict[str, object]:
    if artifact.get("artifact_version") != PRODUCER_VERSION:
        raise ValueError("unsupported same-parity gap artifact version")
    if artifact.get("terminal_state") != "P0_INVALIDATED":
        raise ValueError("terminal state promotion is forbidden")
    if artifact.get("construction") != "elementary_half_line_prufer_gap_v1":
        raise ValueError("unknown same-parity gap construction")

    declared_dps = _exact_integer(
        artifact.get("precision_decimal_digits"), "declared dps", 40
    )
    if replay_dps is None:
        replay_dps = declared_dps
    requested_replay_dps = _exact_integer(
        replay_dps, "requested replay dps", declared_dps
    )
    # Reconstruct more narrowly than the producer so exact containment, not
    # overlap of independently rounded decimal displays, can be checked.
    replay_dps = max(requested_replay_dps, declared_dps + 40)

    expected_hashes = {
        "notes/PRUFER_SAME_PARITY_GAP_THEOREM.md": _sha256(
            "notes/PRUFER_SAME_PARITY_GAP_THEOREM.md"
        ),
        "src/prufer_same_parity_gap.py": _sha256(
            "src/prufer_same_parity_gap.py"
        ),
        "verifier/prufer_same_parity_gap_replay.py": _sha256(
            "verifier/prufer_same_parity_gap_replay.py"
        ),
    }
    if artifact.get("provenance_sha256") != expected_hashes:
        raise ValueError("same-parity gap provenance hash mismatch")

    if artifact.get("locked_formulas") != EXPECTED_FORMULAS:
        raise ValueError("same-parity gap formula or convention changed")
    if artifact.get("proof_constants_exact") != EXPECTED_PROOF_CONSTANTS:
        raise ValueError("same-parity gap proof constant changed")

    exact_input = artifact.get("exact_input")
    if not isinstance(exact_input, dict):
        raise ValueError("missing exact same-parity gap input")
    if exact_input != {
        "lambda_rational_text": "2",
        "n_integer": 0,
        "r_integer": 2,
        "j_integer": 4,
        "c_exact_formula": "8*pi",
        "K_squared_exact_formula": "128*pi^2+20",
    }:
        raise ValueError("canonical exact same-parity gap input changed")

    lam = _fraction(exact_input["lambda_rational_text"], "lambda")
    n = _exact_integer(exact_input["n_integer"], "n", 0)
    r = _exact_integer(exact_input["r_integer"], "r", 1)
    j = _exact_integer(exact_input["j_integer"], "j", 0)
    if j != n + 2 * r:
        raise ValueError("same-parity index must be j=n+2*r")

    expected_oracles = reconstruct_c0_oracles(4)
    if artifact.get("c0_legendre_oracles") != expected_oracles:
        raise ValueError("exact c=0 Legendre oracle changed")
    expected_gap_oracle = {
        "n_integer": 0,
        "r_integer": 2,
        "j_integer": 4,
        "mu_j_minus_mu_n_exact": "20",
    }
    if artifact.get("c0_same_parity_gap_oracle") != expected_gap_oracle:
        raise ValueError("exact c=0 same-parity gap oracle changed")

    flags = artifact.get("theorem_flags")
    expected_flags = {
        "standard_sturm_qualitative_input_used": True,
        "elementary_quantitative_gap_proved": True,
        "same_parity_only": True,
        "numerical_sturm_solver_used": False,
        "cached_prolate_eigenvalues_read": False,
        "external_gap_theorem_source_used": False,
        "growing_window_conditioning_proved": False,
        "signed_weil_sector_floor_proved": False,
        "equation_5_2_proved": False,
        "local_uniform_determinant_convergence_proved": False,
        "status_promoted": False,
    }
    if flags != expected_flags:
        raise ValueError("same-parity gap theorem flags are inconsistent")

    producer_values = artifact.get("outward_intervals")
    if not isinstance(producer_values, dict) or set(producer_values) != set(
        INTERVAL_KEYS
    ):
        raise ValueError("same-parity gap interval fields are incomplete")
    parsed = {
        key: _parse_interval(producer_values[key], f"producer {key}")
        for key in INTERVAL_KEYS
    }
    if parsed["gap_lower_bound"].lower <= 0:
        raise ValueError("producer gap interval is not strictly positive")

    replay = reconstruct_intervals(lam, n, r, replay_dps)
    for key in INTERVAL_KEYS:
        if not _contains_exact(parsed[key], replay[key]):
            raise ValueError(
                f"producer {key} does not contain independent reconstruction"
            )

    if "actual_prolate_eigenvalue_gap" in artifact:
        raise ValueError("cached numerical prolate eigenvalues are forbidden")

    return {
        "artifact_version": REPLAY_VERSION,
        "terminal_state": "P0_INVALIDATED",
        "producer_canonical_json_sha256": hashlib.sha256(
            (json.dumps(artifact, sort_keys=True, separators=(",", ":")) + "\n").encode()
        ).hexdigest(),
        "producer_precision_decimal_digits": declared_dps,
        "requested_replay_precision_decimal_digits": requested_replay_dps,
        "replay_precision_decimal_digits": replay_dps,
        "independent_assembly": (
            "closed Legendre center formulas and direct c^2=4*pi^2*lambda^4 "
            "interval reconstruction"
        ),
        "reconstructed_outward_intervals": {
            key: _serialize_interval(value, replay_dps + 12)
            for key, value in replay.items()
        },
        "exact_dyadic_endpoint_parse_pass": True,
        "all_interval_containments_pass": True,
        "exact_c0_legendre_oracles_pass": True,
        "locked_phase_target_formula_pass": True,
        "c0_lifted_phase_axis_oracle_pass": True,
        "all_c_sturm_homotopy_computationally_replayed": False,
        "strict_positive_gap_bound_pass": True,
        "numerical_sturm_solver_used": False,
        "cached_prolate_eigenvalues_read": False,
        "growing_window_conditioning_proved": False,
        "signed_weil_sector_floor_proved": False,
        "equation_5_2_proved": False,
        "local_uniform_determinant_convergence_proved": False,
        "shared_library_limitation": (
            "producer and independent replay both use mpmath.iv for "
            "transcendental outward intervals"
        ),
        "claim_scope": (
            "independent formula and c=0 oracle replay of the elementary "
            "non-collision bound; the qualitative all-c Sturm homotopy is "
            "proof-only"
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--artifact", type=Path, required=True)
    parser.add_argument("--dps", type=int)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    artifact = json.loads(args.artifact.read_text())
    report = replay_artifact(artifact, args.dps)
    text = json.dumps(report, indent=2) + "\n"
    if args.output is None:
        print(text, end="")
    else:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text)


if __name__ == "__main__":
    main()
