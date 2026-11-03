#!/usr/bin/env python3
"""Rigorous interval check of the modular N=1 strong payment on 0<=a<=1/4.

This worker is deliberately narrow.  It checks one scalar inequality that is
still open in MODULAR_N1_S2_PAYMENT_REDUCTION_NEXT.md; it does not sweep
degrees and it does not prove an all-degree statement or RH.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from fractions import Fraction
import hashlib
import json
import os
from pathlib import Path
import resource
import sys
import tempfile
import time
from typing import Any, Sequence

from certify_modular_vprime_tilt import (
    THETA_POLYNOMIALS,
    arb,
    ctx,
    exponential_tail_moment,
    sinhc,
    theta_jet,
)


STATUS = "rigorous_modular_n1_payment_interval_check"
NONTERMINAL_EXIT_CODES = {
    "INPUT_BINDING_MISMATCH": 2,
    "INTERNAL_INCOMPLETE": 3,
    "BUDGET_EXHAUSTED": 4,
}
TAIL_START_H = 2
HARD_MAX_SPATIAL_CELLS = 16_384
HARD_MAX_PARAMETER_CELLS = 512
HARD_MAX_PRECISION_BITS = 2_048
HARD_MAX_CPU_SECONDS = 7_200
HARD_MAX_RSS_MIB = 4_096
HARD_MAX_OUTPUT_BYTES = 16 * 1024 * 1024


class BudgetExceeded(RuntimeError):
    """Raised at a cooperative checkpoint when a resource cap is exceeded."""


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def peak_rss_mib() -> float:
    raw = float(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss)
    # Darwin reports bytes; Linux and the BSD-derived Python API used by the
    # production runner report KiB elsewhere.
    divisor = 1024.0 * 1024.0 if sys.platform == "darwin" else 1024.0
    return raw / divisor


@dataclass
class Budget:
    max_cpu_seconds: int
    max_rss_mib: int
    started_cpu: float = 0.0
    peak_observed_mib: float = 0.0

    def __post_init__(self) -> None:
        self.started_cpu = time.process_time()
        self.check("startup")

    def check(self, stage: str) -> None:
        used = self.cpu_seconds()
        self.peak_observed_mib = max(self.peak_observed_mib, peak_rss_mib())
        if used > self.max_cpu_seconds:
            raise BudgetExceeded(
                f"CPU-time cap exceeded at {stage}: "
                f"{used:.3f}>{self.max_cpu_seconds} seconds"
            )
        if self.peak_observed_mib > self.max_rss_mib:
            raise BudgetExceeded(
                f"cooperative RSS cap exceeded at {stage}: "
                f"{self.peak_observed_mib:.3f}>{self.max_rss_mib} MiB"
            )

    def cpu_seconds(self) -> float:
        return time.process_time() - self.started_cpu

    def record(self) -> dict[str, object]:
        self.peak_observed_mib = max(self.peak_observed_mib, peak_rss_mib())
        return {
            "cpu_seconds": self.cpu_seconds(),
            "peak_rss_mib": self.peak_observed_mib,
            "max_cpu_seconds": self.max_cpu_seconds,
            "max_rss_mib": self.max_rss_mib,
            "time_basis": "process_time; supervisor SIGSTOP pauses this budget",
            "memory_enforcement": "cooperative peak-RSS checks",
        }


def validate_parameters(args: argparse.Namespace) -> None:
    if not 128 <= args.spatial_cells <= HARD_MAX_SPATIAL_CELLS:
        raise ValueError(
            f"spatial_cells must lie in [128,{HARD_MAX_SPATIAL_CELLS}]"
        )
    if not 1 <= args.parameter_cells <= HARD_MAX_PARAMETER_CELLS:
        raise ValueError(
            f"parameter_cells must lie in [1,{HARD_MAX_PARAMETER_CELLS}]"
        )
    if args.spatial_cells & (args.spatial_cells - 1):
        raise ValueError("spatial_cells must be a power of two")
    if args.parameter_cells & (args.parameter_cells - 1):
        raise ValueError("parameter_cells must be a power of two")
    if not 96 <= args.precision_bits <= HARD_MAX_PRECISION_BITS:
        raise ValueError(
            f"precision_bits must lie in [96,{HARD_MAX_PRECISION_BITS}]"
        )
    if not 1 <= args.max_cpu_seconds <= HARD_MAX_CPU_SECONDS:
        raise ValueError(
            f"max_cpu_seconds must lie in [1,{HARD_MAX_CPU_SECONDS}]"
        )
    if not 64 <= args.max_rss_mib <= HARD_MAX_RSS_MIB:
        raise ValueError(f"max_rss_mib must lie in [64,{HARD_MAX_RSS_MIB}]")
    if not 1024 <= args.max_output_bytes <= HARD_MAX_OUTPUT_BYTES:
        raise ValueError(
            f"max_output_bytes must lie in [1024,{HARD_MAX_OUTPUT_BYTES}]"
        )


def exact_algebra_self_check() -> dict[str, int]:
    """Check the raw second-derivative reduction with exact coefficients.

    Starting from
      K + 2 a^2 C + a^4 I + 4 a^2 L + T1 + T2,
    substitute
      C=2P+2a^2 I-L,
      T1=-2P1-4a^2 L,
      T2=-2a^2 P-4a^4 I.
    """

    coefficients = {
        "K": Fraction(1),
        "P1": Fraction(-2),
        "a2L": Fraction(-2) + 4 - 4,
        "a2P": Fraction(4) - 2,
        "a4I": Fraction(4) + 1 - 4,
    }
    expected = {
        "K": Fraction(1),
        "P1": Fraction(-2),
        "a2L": Fraction(-2),
        "a2P": Fraction(2),
        "a4I": Fraction(1),
    }
    if coefficients != expected:
        raise AssertionError(f"u2 reduction mismatch: {coefficients!r}")
    return {key: int(value) for key, value in coefficients.items()}


def analytic_tail_bounds() -> dict[str, arb]:
    """Uniform h>=2 bounds for every integral used by this worker.

    If d=j+2 is the degree of the j-th theta-jet polynomial, first-orbit
    domination gives the conservative patterns

      int psi_j^2 cosh(2ah) dh <= 2 c_j^2 E_{2d},
      int h psi_j^2 sinh(2ah)/a dh <= c_j^2 E_{2d+2},

    where E_k=int_z0^infinity z^k exp(-2z) dz and z0=pi*exp(4).
    These are the same tail estimates used by certify_modular_vprime_tilt.py,
    extended from derivative order one to order two.
    """

    start = arb.pi() * arb(4).exp()
    if not start > 100:
        raise ArithmeticError("tail start is unexpectedly small")
    coefficient_sums = [
        sum((abs(value) for value in coefficients), arb(0))
        for coefficients in THETA_POLYNOMIALS
    ]
    if len(coefficient_sums) != 3:
        raise AssertionError("theta helper must expose jets through order two")
    c0, c1, c2 = coefficient_sums
    first_ratio = arb(2) ** 8 * (-3 * start).exp()
    if not first_ratio < arb(1) / 2:
        raise ArithmeticError("full theta tail is not first-orbit dominated")
    return {
        "I_sinh_over_a": c0 * c0 * exponential_tail_moment(6, start),
        "P_even": 2 * c0 * c0 * exponential_tail_moment(4, start),
        "L_sinh_over_a": c1 * c1 * exponential_tail_moment(8, start),
        "P1_even": 2 * c1 * c1 * exponential_tail_moment(6, start),
        "K2_sinh_over_a": c2 * c2 * exponential_tail_moment(10, start),
    }


def symmetric_error(bound: arb) -> arb:
    """Return a symmetric interval known to contain a [0,bound] tail."""

    return arb(0, bound.abs_upper())


def exact_dyadic_cell(index: int, cells: int, denominator_power: int) -> arb:
    """Return one exact closed cell without radius-rounding domain leakage.

    The cell is

      [(2*index)/(2^denominator_power*cells),
       (2*index+2)/(2^denominator_power*cells)].

    Arb radii have a fixed 30-bit precision, so passing an already-created
    ``arb`` as the radius can enlarge a boundary cell across zero.  The exact
    binary tuple constructor avoids that problem when ``cells`` is a power of
    two, as required by ``validate_parameters``.
    """

    if cells < 1 or cells & (cells - 1):
        raise ValueError("cells must be a positive power of two")
    if not 0 <= index < cells:
        raise ValueError("cell index is outside the partition")
    exponent = -(cells.bit_length() - 1) - denominator_power
    return arb((2 * index + 1, exponent), (1, exponent))


def compact_cells(
    spatial_cells: int, budget: Budget
) -> list[tuple[arb, arb, arb, arb, arb]]:
    """Precompute h, psi, psi', psi^2, and psi''^2 on [0,2]."""

    values: list[tuple[arb, arb, arb, arb, arb]] = []
    for index in range(spatial_cells):
        if index % 32 == 0:
            budget.check(f"theta-cell-{index}")
        h = exact_dyadic_cell(index, spatial_cells, 0)
        psi, psi_one, psi_two = theta_jet(h)
        values.append((h, psi, psi_one, psi_one * psi_one, psi_two * psi_two))
    budget.check("theta-grid-complete")
    return values


def interval_record(value: arb) -> dict[str, str]:
    return {
        "interval": str(value),
        "lower": str(value.lower()),
        "upper": str(value.upper()),
    }


def parameters(args: argparse.Namespace) -> dict[str, int]:
    return {
        "spatial_cells": args.spatial_cells,
        "parameter_cells": args.parameter_cells,
        "precision_bits": args.precision_bits,
        "max_cpu_seconds": args.max_cpu_seconds,
        "max_rss_mib": args.max_rss_mib,
        "max_output_bytes": args.max_output_bytes,
    }


def certify(
    args: argparse.Namespace, budget: Budget, progress_enabled: bool
) -> dict[str, object]:
    tails = analytic_tail_bounds()
    rows: list[dict[str, object]] = []
    negative_cells: list[int] = []
    unresolved_cells: list[int] = []
    prefix_unresolved_cells: list[int] = []
    prefix0_unresolved_cells: list[int] = []
    worst_margin_lower: arb | None = None
    worst_margin_cell: int | None = None
    smallest_prefix0_lower: arb | None = None
    smallest_prefix0_cell: int | None = None
    smallest_prefix_lower: arb | None = None
    smallest_prefix_cell: int | None = None
    budget_error: str | None = None

    try:
        values = compact_cells(args.spatial_cells, budget)
        width_h = arb(2) / args.spatial_cells
        for index in range(args.parameter_cells):
            budget.check(f"parameter-cell-{index}-start")
            a = exact_dyadic_cell(index, args.parameter_cells, 3)
            a2 = a * a
            a4 = a2 * a2

            i_sinh = arb(0)
            p_even = arb(0)
            l_sinh = arb(0)
            p1_even = arb(0)
            k2_sinh = arb(0)
            q_minus = arb(0)
            for spatial_index, (
                h,
                psi,
                psi_one,
                derivative_square,
                second_square,
            ) in enumerate(values):
                if spatial_index % 256 == 0:
                    budget.check(
                        f"parameter-cell-{index}-spatial-cell-{spatial_index}"
                    )
                x = 2 * a * h
                sine_over_a = 2 * h * sinhc(x)
                cosine = x.cosh()
                weight = psi * psi
                i_sinh += width_h * h * weight * sine_over_a
                p_even += width_h * weight * cosine
                l_sinh += width_h * h * derivative_square * sine_over_a
                p1_even += width_h * derivative_square * cosine
                k2_sinh += width_h * h * second_square * sine_over_a
                negative_source = a * psi - psi_one
                q_minus += (
                    width_h
                    * h
                    * (-x).exp()
                    * negative_source
                    * negative_source
                )

            # Each complete tail is enclosed independently.  For Q_-, use
            # (a psi-psi')^2 <= 2a^2 psi^2+2psi'^2 and h>=2 together with
            # h*sinh(2ah)/a >= 2h^2.
            i_sinh += symmetric_error(tails["I_sinh_over_a"])
            p_even += symmetric_error(tails["P_even"])
            l_sinh += symmetric_error(tails["L_sinh_over_a"])
            p1_even += symmetric_error(tails["P1_even"])
            k2_sinh += symmetric_error(tails["K2_sinh_over_a"])
            q_tail = (
                a2 * tails["I_sinh_over_a"] / 2
                + tails["L_sinh_over_a"] / 2
            )
            q_minus += symmetric_error(q_tail)

            # Cancellation-safe divided prefixes u_j=s_j/(2a), continued to
            # a=0.  The u2 identity is checked exactly at process startup.
            u0 = i_sinh
            u1 = l_sinh - p_even - a2 * i_sinh
            raw_h2 = (
                k2_sinh
                - 2 * p1_even
                - 2 * a2 * l_sinh
                + 2 * a2 * p_even
                + a4 * i_sinh
            )
            # The actual N=1 next feature is T2(D)g=(D^2+beta)g with
            # beta=s1/s0.  Hence s2/(2a)=raw_h2-u1^2/u0.  Clear both
            # separately certified positive prefixes before interval
            # evaluation; this is equation (9) of the analytic theorem.
            margin = (
                u0 * u1 * raw_h2
                - u1 * u1 * u1
                - 2 * q_minus * u0 * u1
                - 2 * a2 * u0 * u0 * q_minus
            )

            prefix0_ok = u0.lower() > 0
            prefix1_ok = u1.lower() > 0
            prefix_ok = prefix0_ok and prefix1_ok
            margin_ok = prefix_ok and margin.lower() > 0
            negative = prefix_ok and margin.upper() < 0
            if not prefix0_ok:
                prefix0_unresolved_cells.append(index)
            if not prefix1_ok:
                prefix_unresolved_cells.append(index)
            if negative:
                negative_cells.append(index)
            elif not margin_ok:
                unresolved_cells.append(index)
            if worst_margin_lower is None or margin.lower() < worst_margin_lower:
                worst_margin_lower = margin.lower()
                worst_margin_cell = index
            if smallest_prefix0_lower is None or u0.lower() < smallest_prefix0_lower:
                smallest_prefix0_lower = u0.lower()
                smallest_prefix0_cell = index
            if smallest_prefix_lower is None or u1.lower() < smallest_prefix_lower:
                smallest_prefix_lower = u1.lower()
                smallest_prefix_cell = index

            rows.append(
                {
                    "index": index,
                    "a_interval": str(a),
                    "u0": interval_record(u0),
                    "u1": interval_record(u1),
                    "raw_second_divided_h2": interval_record(raw_h2),
                    "q_minus": interval_record(q_minus),
                    "cleared_actual_payment_margin_G": interval_record(margin),
                    "prefix0_positive": prefix0_ok,
                    "prefix1_positive": prefix1_ok,
                    "payment_certified": margin_ok,
                    "payment_refuted_on_cell": negative,
                }
            )
            if progress_enabled:
                print(
                    json.dumps(
                        {
                            "event": "parameter_cell_complete",
                            "index": index,
                            "cells": args.parameter_cells,
                            "margin_lower": str(margin.lower()),
                            "peak_rss_mib": budget.peak_observed_mib,
                            "cpu_seconds": budget.cpu_seconds(),
                        },
                        sort_keys=True,
                    ),
                    file=sys.stderr,
                    flush=True,
                )
    except BudgetExceeded as error:
        budget_error = str(error)

    if budget_error is not None:
        verdict = "BUDGET_EXHAUSTED"
    elif negative_cells:
        verdict = "STRONG_PAYMENT_REFUTED_ON_INTERVAL_CELL"
    elif unresolved_cells or prefix0_unresolved_cells or prefix_unresolved_cells:
        verdict = "UNRESOLVED_INTERVAL_OVERLAP"
    elif len(rows) == args.parameter_cells:
        verdict = "PASS_STRONG_PAYMENT_UNIFORM_0_TO_1_OVER_4"
    else:
        verdict = "INTERNAL_INCOMPLETE"

    if verdict == "PASS_STRONG_PAYMENT_UNIFORM_0_TO_1_OVER_4":
        claim = (
            "For the complete theta profile, the N=1 strong scalar payment "
            "s2/s1 >= kappa1*mu1_minus is certified for every 0<a<=1/4; "
            "the cell touching a=0 uses the continuous divided formulation."
        )
    elif verdict == "STRONG_PAYMENT_REFUTED_ON_INTERVAL_CELL":
        claim = (
            "The proposed N=1 strong scalar payment is rigorously negative "
            "on at least one listed a-cell; this refutes that sufficient route, "
            "not RH."
        )
    else:
        claim = (
            "No theorem claim: the bounded interval run did not separate every "
            "required sign. Refine only the listed cells or improve the analytic "
            "bound before drawing a conclusion."
        )

    return {
        "schema_version": "zsv.modular_n1_payment_interval.v1",
        "status": STATUS,
        "verdict": verdict,
        "claim": claim,
        "parameters": parameters(args),
        "domain": {"a": [0, "1/4"], "h_head": [0, TAIL_START_H]},
        "completed_parameter_cells": len(rows),
        "negative_cells": negative_cells,
        "unresolved_cells": unresolved_cells,
        "prefix0_unresolved_cells": prefix0_unresolved_cells,
        "prefix_unresolved_cells": prefix_unresolved_cells,
        "worst_margin_cell": worst_margin_cell,
        "worst_margin_lower": (
            None if worst_margin_lower is None else str(worst_margin_lower)
        ),
        "smallest_prefix0_cell": smallest_prefix0_cell,
        "smallest_prefix0_lower": (
            None if smallest_prefix0_lower is None else str(smallest_prefix0_lower)
        ),
        "smallest_prefix_cell": smallest_prefix_cell,
        "smallest_prefix_lower": (
            None if smallest_prefix_lower is None else str(smallest_prefix_lower)
        ),
        "budget_error": budget_error,
        "budget": budget.record(),
        "analytic_tail_bounds": {key: str(value) for key, value in tails.items()},
        "cells": rows,
        "scope": (
            "One rigorous complete-theta N=1 sufficient payment check only. "
            "It is neither an all-degree positivity certificate nor an RH proof."
        ),
    }


def atomic_write_json(path: Path, payload: dict[str, Any], max_bytes: int) -> None:
    rendered = (
        json.dumps(payload, ensure_ascii=True, allow_nan=False, indent=2, sort_keys=True)
        + "\n"
    ).encode("ascii")
    if len(rendered) > max_bytes:
        raise ValueError(
            f"serialized output is {len(rendered)} bytes, above cap {max_bytes}"
        )
    destination = path.resolve()
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary_name: str | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="wb",
            prefix=f".{destination.name}.",
            suffix=".tmp",
            dir=destination.parent,
            delete=False,
        ) as handle:
            temporary_name = handle.name
            handle.write(rendered)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary_name, destination)
        temporary_name = None
    finally:
        if temporary_name is not None:
            try:
                Path(temporary_name).unlink()
            except FileNotFoundError:
                pass


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--spatial-cells", type=int, default=4096)
    parser.add_argument("--parameter-cells", type=int, default=64)
    parser.add_argument("--precision-bits", type=int, default=192)
    parser.add_argument("--max-cpu-seconds", type=int, default=900)
    parser.add_argument("--max-rss-mib", type=int, default=1024)
    parser.add_argument("--max-output-bytes", type=int, default=4 * 1024 * 1024)
    parser.add_argument("--expected-source-sha256", required=True)
    parser.add_argument("--expected-helper-sha256", required=True)
    parser.add_argument("--expected-payment-note-sha256", required=True)
    parser.add_argument("--expected-theorem-note-sha256", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--progress", action="store_true")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    validate_parameters(args)
    ctx.prec = args.precision_bits
    source = Path(__file__).resolve()
    workstream = source.parents[1]
    helper = source.with_name("certify_modular_vprime_tilt.py")
    payment_note = workstream / "MODULAR_N1_S2_PAYMENT_REDUCTION_NEXT.md"
    theorem_note = workstream / "MODULAR_N1_FULL_INTERVAL_PAYMENT_NEXT.md"
    actual_bindings = {
        "source": {"path": str(source), "sha256": sha256(source)},
        "helper": {"path": str(helper), "sha256": sha256(helper)},
        "payment_note": {"path": str(payment_note), "sha256": sha256(payment_note)},
        "theorem_note": {"path": str(theorem_note), "sha256": sha256(theorem_note)},
    }
    expected_bindings = {
        "source": args.expected_source_sha256,
        "helper": args.expected_helper_sha256,
        "payment_note": args.expected_payment_note_sha256,
        "theorem_note": args.expected_theorem_note_sha256,
    }
    mismatch = {
        name: {"expected": expected, "actual": actual_bindings[name]["sha256"]}
        for name, expected in expected_bindings.items()
        if actual_bindings[name]["sha256"] != expected
    }

    algebra = exact_algebra_self_check()
    budget = Budget(args.max_cpu_seconds, args.max_rss_mib)
    if mismatch:
        result: dict[str, object] = {
            "schema_version": "zsv.modular_n1_payment_interval.v1",
            "status": STATUS,
            "verdict": "INPUT_BINDING_MISMATCH",
            "claim": "No computation was attempted because a SHA-bound input drifted.",
            "parameters": parameters(args),
            "binding_mismatch": mismatch,
            "budget": budget.record(),
            "scope": "No mathematical conclusion.",
        }
    else:
        result = certify(args, budget, args.progress)

    # A source or input changed during the run if its postflight digest no
    # longer equals the frozen expected value.  Never attach a theorem claim
    # to such a receipt: replace it with an atomic diagnostic failure instead.
    postflight_bindings = {
        "source": {"path": str(source), "sha256": sha256(source)},
        "helper": {"path": str(helper), "sha256": sha256(helper)},
        "payment_note": {"path": str(payment_note), "sha256": sha256(payment_note)},
        "theorem_note": {"path": str(theorem_note), "sha256": sha256(theorem_note)},
    }
    postflight_mismatch = {
        name: {"expected": expected, "actual": postflight_bindings[name]["sha256"]}
        for name, expected in expected_bindings.items()
        if postflight_bindings[name]["sha256"] != expected
    }
    if postflight_mismatch and result.get("verdict") != "INPUT_BINDING_MISMATCH":
        discarded_verdict = result.get("verdict")
        result = {
            "schema_version": "zsv.modular_n1_payment_interval.v1",
            "status": STATUS,
            "verdict": "INPUT_BINDING_MISMATCH",
            "claim": (
                "No mathematical conclusion: a SHA-bound source or input "
                "changed before the receipt was finalized."
            ),
            "parameters": parameters(args),
            "binding_mismatch": postflight_mismatch,
            "discarded_verdict": discarded_verdict,
            "budget": budget.record(),
            "scope": "No mathematical conclusion.",
        }

    result["exact_raw_h2_coefficient_self_check"] = algebra
    result["source_sha256"] = actual_bindings["source"]["sha256"]
    result["input_bindings"] = actual_bindings
    result["postflight_input_bindings"] = postflight_bindings
    canonical = json.dumps(result, sort_keys=True, separators=(",", ":")).encode()
    result["payload_sha256"] = hashlib.sha256(canonical).hexdigest()
    atomic_write_json(args.output, result, args.max_output_bytes)
    print(
        json.dumps(
            {
                "status": result["status"],
                "verdict": result["verdict"],
                "output": str(args.output),
                "source_sha256": result["source_sha256"],
                "payload_sha256": result["payload_sha256"],
            },
            sort_keys=True,
        )
    )
    return NONTERMINAL_EXIT_CODES.get(str(result["verdict"]), 0)


if __name__ == "__main__":
    raise SystemExit(main())
