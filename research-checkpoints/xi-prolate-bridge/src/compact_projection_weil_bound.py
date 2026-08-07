#!/usr/bin/env python3
"""Defect-relative compact projection--projection Weil-form bound.

This combines the locked BV projection theorem with the explicit infinite
Cauchy-form continuity theorem.  It controls only the P--P correlation for
fixed normalized prolate labels 0 and 4.  It does not control a physical
outer remainder, a sector floor, or a determinant limit.
"""
from __future__ import annotations

import argparse
from dataclasses import dataclass
from fractions import Fraction
import json
from pathlib import Path
from typing import Any

import mpmath as mp

from defect_relative_projection import verify_source_pin
from high_fourier_coercivity import source_pdf_sha256


SCHEMA = "xi-prolate-compact-pp-weil-bound-v1"
TERMINAL_STATE = "P0_INVALIDATED"
SCHEDULE_K = 2400
MIN_J = 2
LOCKED_SCHEDULE = "lambda_j=j+1/2; N_j=2^(2400*(2*j+1)^2)"
LOCKED_LABELS = [0, 4]
LOCKED_BASIS = "L^(-1/2)*exp(+2*pi*i*r*(t+log(lambda))/L)"
LOCKED_Q_SIGN = "Q=W_0,2-W_R-W_p"
LOCKED_CAUCHY = "Q=diag(a)+D_b*H-H*D_b; H_rs=1/(r-s) off diagonal"
LOCKED_BOUND = (
    "abs(QW(P_n,P_m))/sqrt(d_n*d_m)"
    "<=rho_j^2*(log(3*N_j)+1+C_abs(lambda_j)+c(lambda_j))"
)


@dataclass(frozen=True)
class Interval:
    lower_raw: tuple[int, int, int, int]
    upper_raw: tuple[int, int, int, int]

    def lower(self) -> mp.mpf:
        return mp.mpf(self.lower_raw)

    def upper(self) -> mp.mpf:
        return mp.mpf(self.upper_raw)


def _capture(value: Any) -> Interval:
    lower, upper = value._mpi_
    lo = tuple(int(item) for item in lower)
    hi = tuple(int(item) for item in upper)
    if len(lo) != 4 or len(hi) != 4:
        raise ArithmeticError("unexpected interval endpoint representation")
    return Interval(lo, hi)  # type: ignore[arg-type]


def _raw(raw: tuple[int, int, int, int]) -> list[object]:
    sign, mantissa, exponent, bitcount = raw
    return [sign, str(mantissa), exponent, bitcount]


def _serialize(interval: Interval, digits: int) -> dict[str, object]:
    with mp.workdps(digits + 20):
        return {
            "decimal": [
                mp.nstr(interval.lower(), digits),
                mp.nstr(interval.upper(), digits),
            ],
            "dyadic": {
                "lower": _raw(interval.lower_raw),
                "upper": _raw(interval.upper_raw),
            },
        }


def _require_integer(value: object, name: str) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{name} must be an exact integer, never binary64")
    return value


def _interval_values(j: int, dps: int) -> dict[str, Interval]:
    old_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(2 * j + 1) / 2
        log_two = mp.iv.log(2)
        L = 2 * mp.iv.log(lam)
        coth_half_L = (lam**2 + 1) / (lam**2 - 1)
        sigma = mp.iv.log(L * coth_half_L / 2)

        pole_diag = 8 * (lam + 1 / lam - 2) / L
        arch_diag = lam + 2 * sigma
        prime_diag = 4 * L * (lam - 1)
        diagonal_loss = pole_diag + arch_diag + prime_diag
        arch_tail = mp.iv.log(coth_half_L)
        C_abs = diagonal_loss + arch_tail + 1 / (2 * mp.iv.pi)

        pole_b = 2 * (lam - 1 / lam) / mp.iv.pi
        arch_b = (
            mp.iv.mpf(1) / 4
            + 1 / (2 * mp.iv.pi**2)
            + (lam - 1 + sigma) / (2 * mp.iv.pi)
        )
        prime_b = 2 * L * (lam - 1) / mp.iv.pi
        b_bound = pole_b + arch_b + prime_b
        cauchy_norm = 2 * mp.iv.pi * b_bound

        defect_decay = 160 * mp.iv.pi * mp.iv.log(96) / log_two
        schedule_decay = 2 * SCHEDULE_K * log_two
        margin = schedule_decay - defect_decay
        common = mp.iv.sqrt(L) / (mp.iv.pi * mp.iv.sqrt(2))
        bulk = (
            common
            * 4
            * lam
            * (2 * mp.iv.pi * lam**2 + mp.iv.mpf(1) / 2)
            * mp.iv.power(96, mp.iv.mpf(5) / 2)
            / mp.iv.sqrt(6)
            * mp.iv.exp(-margin * lam**2)
        )
        jump = (
            common
            * 32
            * mp.iv.pi
            * lam**2
            * mp.iv.exp(-schedule_decay * lam**2)
        )
        rho = bulk + jump
        schedule_exponent = SCHEDULE_K * (2 * j + 1) ** 2
        log_weight = 1 + mp.iv.log(3) + schedule_exponent * log_two
        multiplier = log_weight + C_abs + cauchy_norm
        relative_pp = rho**2 * multiplier
        a4_squared = mp.iv.mpf(3) / mp.iv.power(2, mp.iv.mpf(11) / 2)
        source_combination = (
            a4_squared
            * (1 + 2 * mp.iv.sqrt(2) * lam) ** 2
            * relative_pp
        )
        return {
            "lambda": _capture(lam),
            "L": _capture(L),
            "sigma": _capture(sigma),
            "diagonal_loss": _capture(diagonal_loss),
            "arch_tail": _capture(arch_tail),
            "C_abs": _capture(C_abs),
            "b_bound": _capture(b_bound),
            "cauchy_norm": _capture(cauchy_norm),
            "defect_decay": _capture(defect_decay),
            "schedule_decay": _capture(schedule_decay),
            "exponent_margin": _capture(margin),
            "bulk_relative": _capture(bulk),
            "jump_relative": _capture(jump),
            "rho": _capture(rho),
            "log_weight": _capture(log_weight),
            "combined_multiplier": _capture(multiplier),
            "relative_pp_upper": _capture(relative_pp),
            "source_combination_relative_upper": _capture(source_combination),
        }
    finally:
        mp.iv.dps = old_dps


def produce(j: int, dps: int = 80) -> dict[str, object]:
    j = _require_integer(j, "schedule index j")
    dps = _require_integer(dps, "interval precision")
    if j < MIN_J:
        raise ValueError("locked theorem requires j>=2")
    if dps < 50:
        raise ValueError("at least 50 interval decimal digits are required")

    relative_pin = verify_source_pin()
    ccm_hash = source_pdf_sha256()
    values = _interval_values(j, dps)
    if values["exponent_margin"].lower() <= 0:
        raise ArithmeticError("locked schedule exponent margin is not positive")
    if values["relative_pp_upper"].lower() < 0:
        raise ArithmeticError("computed relative P-P bound is negative")

    return {
        "schema": SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "claim_class": "ANALYTIC_UNIFORM_COMPACT_PROJECTION_PP_ONLY",
        "claim_scope": {
            "proved": (
                "pure compact projection-projection complete signed Weil-form "
                "term is o(sqrt(d_n*d_m)) for fixed n,m in {0,4}"
            ),
            "not_proved": [
                "either outer-projection orientation",
                "physical outer-outer correlation",
                "a signed sector floor",
                "equation (5.2)",
                "locally uniform determinant convergence",
            ],
        },
        "source_pins": {
            "relative_projection": relative_pin,
            "ccm_pdf": "vendor/CCM-ZST-2511.22755v1.pdf",
            "ccm_pdf_sha256": ccm_hash,
        },
        "locked_formulas": {
            "schedule": LOCKED_SCHEDULE,
            "labels": LOCKED_LABELS,
            "basis": LOCKED_BASIS,
            "weil_sign": LOCKED_Q_SIGN,
            "cauchy_form": LOCKED_CAUCHY,
            "combined_bound": LOCKED_BOUND,
            "infinite_form_closure": (
                "symmetric finite Fourier truncations converge on the "
                "log-weighted form domain"
            ),
        },
        "input": {
            "j": j,
            "lambda_exact": {"numerator": 2 * j + 1, "denominator": 2},
            "schedule_K": SCHEDULE_K,
            "schedule_exponent": SCHEDULE_K * (2 * j + 1) ** 2,
            "interval_decimal_digits": dps,
        },
        "intervals": {key: _serialize(value, dps) for key, value in values.items()},
        "arithmetic": {
            "library": f"mpmath.iv {mp.__version__}",
            "raw_outward_dyadic_endpoints_serialized": True,
            "shared_library_with_replay": True,
        },
        "producer_pass_boolean_trusted_by_replay": False,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--j", type=int, required=True)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    payload = produce(args.j, args.dps)
    text = json.dumps(payload, indent=2) + "\n"
    if args.output is not None:
        args.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
