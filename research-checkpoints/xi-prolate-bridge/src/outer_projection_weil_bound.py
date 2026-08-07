#!/usr/bin/env python3
"""Source-core outer--projection Weil bound on the locked diagonal.

The actual corrected, source-normalized 0/4 state is kept combined.  The
two-sided global radical reduces each O--P orientation to a compact
semilocal pairing.  A direct BV Fourier-coefficient sum supplies the extra
1/N high--low factor which generic form continuity would lose.

This module evaluates the explicit theorem constants with outward mpmath
intervals.  It does not use a zeta-zero table, a stored matrix, Weil
positivity, or a binary64 parameter.
"""
from __future__ import annotations

import argparse
from dataclasses import dataclass
import hashlib
import json
from pathlib import Path
from typing import Any

import mpmath as mp

from defect_relative_projection import verify_source_pin
from high_fourier_coercivity import source_pdf_sha256


SCHEMA = "xi-prolate-outer-projection-weil-bound-v1"
TERMINAL_STATE = "P0_INVALIDATED"
SCHEDULE_K = 2400
MIN_J = 2
LOCKED_SCHEDULE = "lambda_j=j+1/2; N_j=2^(2400*(2*j+1)^2)"
LOCKED_BASIS = "L^(-1/2)*exp(+2*pi*i*r*(t+log(lambda))/L)"
LOCKED_Q_SIGN = "Q=W_0,2-W_R-W_p"
LOCKED_REFLECTION = "K=S*E(tilde_h); S=(1+J)/2; O=(1-C)K includes both tails"
LOCKED_RADICAL_REDUCTION = (
    "W(O,P)=-q(CK,P); W(P,O)=-q(P,CK); CK=P_N*CK+(I-P_N)*CK"
)
LOCKED_HIGH_LOW = (
    "abs(q(P,p))<=(12*B_b*A_K^2*H_N+4*B_b*A_K*M_K)/N"
)
LOCKED_FINAL = (
    "max(abs(W(O,P)),abs(W(P,O)))/d4"
    "<=source_pp_relative+high_low_absolute/d_LS"
)

P1_LOCK = "P1_SOURCE_LOCK.json"
P1_LOCK_SHA256 = "63b83879c52382c6c524b3137b25ea9f1882a24c5518374d487469ecf0e077d2"


@dataclass(frozen=True)
class Interval:
    lower_raw: tuple[int, int, int, int]
    upper_raw: tuple[int, int, int, int]

    def lower(self) -> mp.mpf:
        return mp.mpf(self.lower_raw)

    def upper(self) -> mp.mpf:
        return mp.mpf(self.upper_raw)


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify_radical_source_lock() -> dict[str, object]:
    """Hash and semantically check the pinned two-sided radical source lock."""
    path = _repo_root() / P1_LOCK
    digest = _sha256(path)
    if digest != P1_LOCK_SHA256:
        raise ValueError("P1 radical source lock hash mismatch")
    lock = json.loads(path.read_text())
    if lock.get("purpose") != (
        "Exact global E-radical identity and the finite-window leakage reduction"
    ):
        raise ValueError("P1 radical source-lock purpose mismatch")
    conventions = lock.get("fourier_conventions")
    if not isinstance(conventions, dict) or conventions.get(
        "binding_additive_transform"
    ) != "F_add(f)(y)=integral_R f(x) exp(+2*pi*i*x*y) dx":
        raise ValueError("P1 additive Fourier convention mismatch")
    conclusions = lock.get("audited_conclusions")
    required = (
        "Ran(E) is a two-sided algebraic radical of the global spectral Weil "
        "pairing on the stated codimension-two source class; this does not "
        "assume RH."
    )
    if not isinstance(conclusions, list) or required not in conclusions:
        raise ValueError("P1 two-sided radical conclusion missing")
    return {
        "source_lock": P1_LOCK,
        "source_lock_sha256": digest,
        "two_sided_radical": True,
        "hard_window_positive_leakage_theorem_found_in_source": False,
    }


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

        # Source Cauchy coefficient bound, reconstructed from the pinned
        # pole--archimedean--minus-prime formulas.
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

        # Source-normalized BV and mean coefficient bounds.  The 32*pi term
        # is the hard-endpoint arithmetic-jump contribution before sqrt(d)<=1.
        a4 = mp.iv.sqrt(3) / mp.iv.power(2, mp.iv.mpf(11) / 4)
        source_scale = a4 * (1 + 2 * mp.iv.sqrt(2) * lam)
        mode_variation = (
            4 * lam * (2 * mp.iv.pi * lam**2 + mp.iv.mpf(1) / 2)
            + 32 * mp.iv.pi * lam**2
        )
        source_variation = source_scale * mode_variation
        nonzero_coefficient = mp.iv.sqrt(L) * source_variation / (2 * mp.iv.pi)
        zero_coefficient = (
            2 * mp.iv.sqrt(2) * lam * source_scale / mp.iv.sqrt(L)
        )

        schedule_exponent = SCHEDULE_K * (2 * j + 1) ** 2
        log_N = schedule_exponent * log_two
        harmonic_upper = 1 + log_N
        inverse_N = mp.iv.exp(-log_N)
        high_low_absolute = (
            12 * b_bound * nonzero_coefficient**2 * harmonic_upper
            + 4 * b_bound * nonzero_coefficient * zero_coefficient
        ) * inverse_N

        defect_d_decay = 320 * mp.iv.pi * mp.iv.log(96) / log_two
        full_schedule_decay = 4 * SCHEDULE_K * log_two
        cross_margin = full_schedule_decay - defect_d_decay
        d_LS = 6 * mp.iv.power(
            96,
            -5 - (320 * mp.iv.pi / log_two) * lam**2,
        )
        high_low_relative = high_low_absolute / d_LS

        # Reconstruct the already-proved compact P--P bound rather than read
        # a producer artifact or cached matrix.
        sqrt_defect_decay = 160 * mp.iv.pi * mp.iv.log(96) / log_two
        sqrt_schedule_decay = 2 * SCHEDULE_K * log_two
        projection_margin = sqrt_schedule_decay - sqrt_defect_decay
        common = mp.iv.sqrt(L) / (mp.iv.pi * mp.iv.sqrt(2))
        bulk = (
            common
            * 4
            * lam
            * (2 * mp.iv.pi * lam**2 + mp.iv.mpf(1) / 2)
            * mp.iv.power(96, mp.iv.mpf(5) / 2)
            / mp.iv.sqrt(6)
            * mp.iv.exp(-projection_margin * lam**2)
        )
        jump = (
            common
            * 32
            * mp.iv.pi
            * lam**2
            * mp.iv.exp(-sqrt_schedule_decay * lam**2)
        )
        rho = bulk + jump
        log_weight = 1 + mp.iv.log(3) + log_N
        pp_multiplier = log_weight + C_abs + cauchy_norm
        label_pp_relative = rho**2 * pp_multiplier
        source_pp_relative = source_scale**2 * label_pp_relative
        total_outer_projection_relative = (
            source_pp_relative + high_low_relative
        )

        return {
            "lambda": _capture(lam),
            "L": _capture(L),
            "sigma": _capture(sigma),
            "b_bound": _capture(b_bound),
            "cauchy_norm": _capture(cauchy_norm),
            "C_abs": _capture(C_abs),
            "a4": _capture(a4),
            "source_scale": _capture(source_scale),
            "mode_variation_upper": _capture(mode_variation),
            "source_variation_upper": _capture(source_variation),
            "nonzero_fourier_coefficient_constant": _capture(
                nonzero_coefficient
            ),
            "zero_fourier_coefficient_upper": _capture(zero_coefficient),
            "log_N": _capture(log_N),
            "harmonic_number_upper": _capture(harmonic_upper),
            "inverse_N": _capture(inverse_N),
            "defect_d_decay": _capture(defect_d_decay),
            "full_schedule_decay": _capture(full_schedule_decay),
            "outer_projection_exponent_margin": _capture(cross_margin),
            "defect_lower": _capture(d_LS),
            "high_low_absolute_upper": _capture(high_low_absolute),
            "high_low_relative_upper": _capture(high_low_relative),
            "projection_exponent_margin": _capture(projection_margin),
            "rho": _capture(rho),
            "log_weight": _capture(log_weight),
            "pp_multiplier": _capture(pp_multiplier),
            "label_pp_relative_upper": _capture(label_pp_relative),
            "source_pp_relative_upper": _capture(source_pp_relative),
            "outer_projection_relative_upper": _capture(
                total_outer_projection_relative
            ),
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

    radical_pin = verify_radical_source_lock()
    relative_pin = verify_source_pin()
    ccm_hash = source_pdf_sha256()
    values = _interval_values(j, dps)
    if values["outer_projection_exponent_margin"].lower() <= 0:
        raise ArithmeticError("outer-projection exponent margin is not positive")
    if values["outer_projection_relative_upper"].lower() < 0:
        raise ArithmeticError("computed outer-projection bound is negative")

    return {
        "schema": SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "claim_class": "ANALYTIC_SOURCE_CORE_OUTER_PROJECTION_COMPONENT",
        "claim_scope": {
            "proved": (
                "both source-core O-P orientations for the actual corrected "
                "source-normalized 0/4 state are o(d4) on the locked schedule"
            ),
            "not_proved": [
                "a modewise global radical for an individual label 0 or 4",
                "an arbitrary L2-outer/log-weighted-compact multiplier theorem",
                "the physical outer-outer term",
                "a signed sector floor",
                "equation (5.2)",
                "locally uniform determinant convergence",
            ],
        },
        "source_pins": {
            "global_radical": radical_pin,
            "relative_projection": relative_pin,
            "ccm_pdf": "vendor/CCM-ZST-2511.22755v1.pdf",
            "ccm_pdf_sha256": ccm_hash,
        },
        "locked_formulas": {
            "schedule": LOCKED_SCHEDULE,
            "basis": LOCKED_BASIS,
            "weil_sign": LOCKED_Q_SIGN,
            "reflection": LOCKED_REFLECTION,
            "radical_reduction": LOCKED_RADICAL_REDUCTION,
            "high_low_bound": LOCKED_HIGH_LOW,
            "final_bound": LOCKED_FINAL,
            "source_normalization": (
                "a4=sqrt(3)/2^(11/4); abs(a0/a4)<=2*sqrt(2)*lambda"
            ),
            "hard_endpoint_term": "32*pi*lambda^2*sqrt(d_n)",
            "prime_endpoint": "all prime powers n<=lambda^2; endpoint inclusive",
            "source_core_extension": (
                "symmetric finite Fourier truncations of P; combined form limit"
            ),
        },
        "input": {
            "j": j,
            "lambda_exact": {"numerator": 2 * j + 1, "denominator": 2},
            "schedule_K": SCHEDULE_K,
            "schedule_exponent": SCHEDULE_K * (2 * j + 1) ** 2,
            "interval_decimal_digits": dps,
        },
        "intervals": {
            key: _serialize(value, dps) for key, value in values.items()
        },
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
