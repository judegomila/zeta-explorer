#!/usr/bin/env python3
"""Interval atlas for complete-theta regional regression payments.

This generalizes the frozen v31 degree-7 checker to an odd-degree ladder and
many spatial splits.  It is a finite experiment.  A successful run is not an
all-degree statement and has no RH implication.

The implementation deliberately makes two integration passes.  Forward
prefixes and backward suffixes are accumulated independently, avoiding the
dependency inflation that would result from forming a tail as total-prefix.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import platform
import sys
import time
from fractions import Fraction
from pathlib import Path

from flint import arb, arb_series, ctx


SCHEMA_VERSION = 1
SOURCE_PATH = Path(__file__).resolve()


def interval(x: arb) -> dict[str, str]:
    return {"lo": str(x.lower()), "hi": str(x.upper())}


def copy_ball(x: arb) -> arb:
    return x + arb(0)


def parse_fraction(text: str) -> Fraction:
    value = Fraction(text)
    if not (0 < value < 2):
        raise argparse.ArgumentTypeError("splits must lie strictly between 0 and 2")
    return value


def split_list(args: argparse.Namespace) -> list[Fraction]:
    values: set[Fraction] = set()
    if args.splits:
        values.update(parse_fraction(x.strip()) for x in args.splits.split(",") if x.strip())
    if args.split_grid:
        values.update(Fraction(k, args.split_grid) for k in range(1, args.split_grid + 1))
    if not values:
        values = {Fraction(1, 8), Fraction(1, 2)}
    return sorted(values)


def ldlt_solve(moments: list[arb], q: int) -> dict[str, object]:
    """Solve the q-dimensional old block using interval LDL^T."""

    matrix = [[moments[i + j + 1] for j in range(q)] for i in range(q)]
    target = [moments[q + i + 1] for i in range(q)]
    target_mass = moments[2 * q + 1]

    lower = [[arb(0) for _ in range(q)] for _ in range(q)]
    pivots: list[arb] = []
    for i in range(q):
        lower[i][i] = arb(1)
        pivot = matrix[i][i]
        for k in range(i):
            pivot -= lower[i][k] * lower[i][k] * pivots[k]
        pivots.append(pivot)
        if pivot.lower() <= 0:
            return {
                "ok": False,
                "failed_pivot": i,
                "pivots": [interval(x) for x in pivots],
            }
        for j in range(i + 1, q):
            value = matrix[j][i]
            for k in range(i):
                value -= lower[j][k] * lower[i][k] * pivots[k]
            lower[j][i] = value / pivot

    # L y = b; D w = y; L^T x = w.
    y: list[arb] = []
    for i in range(q):
        value = target[i]
        for k in range(i):
            value -= lower[i][k] * y[k]
        y.append(value)
    w = [y[i] / pivots[i] for i in range(q)]
    x = [arb(0) for _ in range(q)]
    for i in range(q - 1, -1, -1):
        value = w[i]
        for j in range(i + 1, q):
            value -= lower[j][i] * x[j]
        x[i] = value

    cost = sum((y[i] * y[i] / pivots[i] for i in range(q)), arb(0))
    remainder = target_mass - cost
    return {
        "ok": True,
        "lower": lower,
        "pivots_raw": pivots,
        "pivots": [interval(v) for v in pivots],
        "coefficients_raw": [-v for v in x],
        "coefficients": [interval(-v) for v in x],
        "cost": cost,
        "remainder": remainder,
    }


def quadratic(solved: dict[str, object], vector: list[arb]) -> arb:
    lower = solved["lower"]
    pivots = solved["pivots_raw"]
    q = len(vector)
    total = arb(0)
    for k in range(q):
        coordinate = arb(0)
        for i in range(k, q):
            coordinate += lower[i][k] * vector[i]
        total += pivots[k] * coordinate * coordinate
    return total


class ThetaMoments:
    def __init__(self, degree: int, bits: int):
        if degree < 3 or degree % 2 != 1:
            raise ValueError("degree must be an odd integer >= 3")
        self.degree = degree
        self.max_derivative = 2 * degree + 2
        self.cap = self.max_derivative + 1
        ctx.prec = bits
        ctx.cap = self.cap
        self.pi = arb.pi()
        self.h = arb_series([0, 1], self.cap)
        self.n_power = 2 * self.max_derivative + 4

        geometric = (arb(1) / 2) * (1 - arb(3) / (2 * self.pi)) ** (-self.cap)
        power = 0
        while geometric >= 2**power:
            power += 1
        # One extra power of two safely covers the rational A_n derivative.
        self.a_constant = 2 ** (power + 1)
        assert geometric < self.a_constant
        assert 3 * self.a_constant / self.pi < 2 * self.a_constant
        self.derivative_constant = (
            2
            * self.a_constant
            * math.factorial(self.max_derivative)
            * 4**self.max_derivative
        )
        assert (
            (arb(10) / 9) ** self.n_power * (-19 * self.pi).exp()
            < arb(1) / 2
        )
        self.fac = [
            (-1) ** j * math.factorial(2 * j) / arb(4) ** j
            for j in range(degree + 1)
        ]

    def calculate(self, u: arb, second_derivative: bool) -> list[arb]:
        degree = self.degree
        z = self.pi * (2 * u).exp()
        shifted_z = z * (2 * self.h).exp()
        remainder = arb_series([0], self.cap)
        for n in range(2, 9):
            remainder += (
                n
                * n
                * (2 * n * n * shifted_z - 3)
                / (2 * shifted_z - 3)
                * (-(n * n - 1) * shifted_z).exp()
            )
        eps = (
            2
            * self.derivative_constant
            * 9**self.n_power
            * z**self.max_derivative
            * (-80 * z).exp()
        )
        remainder = arb_series(
            [
                remainder[j]
                + arb(0, (eps / math.factorial(j)).upper())
                for j in range(self.cap)
            ],
            self.cap,
        )
        ell = (
            self.h / 2
            + (2 * shifted_z - 3).log()
            + shifted_z.log()
            - shifted_z
            + (1 + remainder).log()
        )
        series_length = 2 * degree + 1
        q0 = arb_series(
            [
                2 * ell[j] if j > 0 and j % 2 == 0 else arb(0)
                for j in range(series_length)
            ],
            series_length,
        )
        exponential = q0.exp()
        moments = [self.fac[j] * exponential[2 * j] for j in range(degree + 1)]
        psi = (
            4
            * (u / 2).exp()
            * (2 * z * z - 3 * z)
            * (-z).exp()
            * (1 + remainder[0])
        )
        psi2 = psi * psi
        weight = 2 * u * u * psi2
        if not second_derivative:
            return [weight * value for value in moments]

        q1 = arb_series(
            [
                2 * (j + 1) * ell[j + 1]
                if j > 0 and j % 2 == 0
                else arb(0)
                for j in range(series_length)
            ],
            series_length,
        )
        q2 = arb_series(
            [
                2 * (j + 1) * (j + 2) * ell[j + 2]
                if j > 0 and j % 2 == 0
                else arb(0)
                for j in range(series_length)
            ],
            series_length,
        )
        first_exp = exponential * q1
        second_exp = exponential * (q2 + q1 * q1)
        first_log = ell[1]
        second_log = 2 * ell[2]
        weight_first = (4 * u + 4 * u * u * first_log) * psi2
        weight_second = (
            4
            + 16 * u * first_log
            + 4 * u * u * (second_log + 2 * first_log * first_log)
        ) * psi2
        return [
            weight_second * moments[j]
            + 2 * weight_first * self.fac[j] * first_exp[2 * j]
            + weight * self.fac[j] * second_exp[2 * j]
            for j in range(degree + 1)
        ]

    def spatial_tails(self) -> list[arb]:
        m = self.max_derivative
        # The spatial tail begins at pi*exp(4) > 171.  The frozen degree-7
        # checker used the weaker floor z=100; z=170 is still a rigorous lower
        # floor and materially strengthens the high-derivative composition
        # estimate.  With the current bound degree 17 passes and degree 19 does
        # not.  Keep the assertion: that failure is an analytic blocker, not a
        # license to run an uncertified quadrature.
        start = self.pi * arb(4).exp()
        z = arb(170)
        assert z < start
        ratio = arb(3) / (2 * z)
        assert (arb(1) / 2) * (1 - ratio) ** (-(m + 1)) < 1
        eps = (
            8
            * math.factorial(m)
            * 4**m
            * 2**self.n_power
            * z**m
            * (-3 * z).exp()
        )
        assert eps < arb("1e-10")
        assert math.factorial(m) * eps * (1 + eps) ** (m - 1) < 1
        for j in range(2, m + 1):
            assert (
                2**j * z
                + 2**j * math.factorial(j - 1) * ratio / (1 - ratio) ** j
                + 1
                < 2 ** (j + 2) * math.factorial(j) * z
            )

        return [
            256
            / self.pi.sqrt()
            * math.factorial(2 * j)
            * 9**j
            * start ** (arb(9) / 2 + j)
            * (-2 * start).exp()
            for j in range(1, self.degree + 1)
        ]


def cell_contribution(
    calculator: ThetaMoments, index: int, cells: int, width: arb
) -> list[arb]:
    midpoint = arb(2 * index + 1) / cells
    interval_u = midpoint + arb(0, arb(1) / cells)
    values = calculator.calculate(midpoint, False)
    second = calculator.calculate(interval_u, True)
    result = [arb(0) for _ in range(calculator.degree + 1)]
    for j in range(1, calculator.degree + 1):
        error = (abs(second[j]).upper() * width**3 / 24).upper()
        result[j] = width * values[j] + arb(0, error)
    return result


def add_in_place(total: list[arb], values: list[arb]) -> None:
    for j in range(1, len(total)):
        total[j] += values[j]


def run(args: argparse.Namespace) -> dict[str, object]:
    started = time.time()
    degree = args.degree
    q = (degree - 1) // 2
    splits = split_list(args)
    boundary_by_index: dict[int, Fraction] = {}
    for split in splits:
        index_fraction = split * args.cells / 2
        if index_fraction.denominator != 1:
            raise ValueError(
                f"split {split} is not a cell boundary for N={args.cells}"
            )
        index = int(index_fraction)
        if not (0 < index < args.cells):
            raise ValueError(f"split {split} maps outside the interior grid")
        boundary_by_index[index] = split

    calculator = ThetaMoments(degree, args.bits)
    # Preflight the analytic envelope before the potentially long two-pass
    # quadrature.  Unsupported degrees therefore fail immediately and leave no
    # output that could be mistaken for a certificate.
    tails = calculator.spatial_tails()
    width = arb(2) / args.cells
    prefix = [arb(0) for _ in range(degree + 1)]
    prefixes: dict[int, list[arb]] = {}
    progress_every = max(1, args.cells // 20)
    for index in range(args.cells):
        add_in_place(prefix, cell_contribution(calculator, index, args.cells, width))
        boundary = index + 1
        if boundary in boundary_by_index:
            prefixes[boundary] = [copy_ball(x) for x in prefix]
        if args.progress and boundary % progress_every == 0:
            print(
                json.dumps(
                    {
                        "event": "progress",
                        "pass": "forward",
                        "completed": boundary,
                        "cells": args.cells,
                    }
                ),
                file=sys.stderr,
                flush=True,
            )

    suffix = [arb(0) for _ in range(degree + 1)]
    suffixes: dict[int, list[arb]] = {}
    for index in range(args.cells - 1, -1, -1):
        add_in_place(suffix, cell_contribution(calculator, index, args.cells, width))
        if index in boundary_by_index:
            suffixes[index] = [copy_ball(x) for x in suffix]
        completed = args.cells - index
        if args.progress and completed % progress_every == 0:
            print(
                json.dumps(
                    {
                        "event": "progress",
                        "pass": "backward",
                        "completed": completed,
                        "cells": args.cells,
                    }
                ),
                file=sys.stderr,
                flush=True,
            )

    full = [copy_ball(x) for x in prefix]
    for j, tail in enumerate(tails, start=1):
        full[j] += arb(0, tail.upper())
    global_solve = ldlt_solve(full, q)

    records: list[dict[str, object]] = []
    for boundary, split in sorted(boundary_by_index.items()):
        core = prefixes[boundary]
        tail = suffixes[boundary]
        for j, tail_bound in enumerate(tails, start=1):
            tail[j] += arb(0, tail_bound.upper())
        core_solve = ldlt_solve(core, q)
        tail_solve = ldlt_solve(tail, q)
        record: dict[str, object] = {
            "split": str(split),
            "split_float": float(split),
            "boundary_cell": boundary,
            "core": {
                "old_metric_pd": bool(core_solve["ok"]),
                "pivots": core_solve["pivots"],
            },
            "tail": {
                "old_metric_pd": bool(tail_solve["ok"]),
                "pivots": tail_solve["pivots"],
            },
            "global_old_metric_pd": bool(global_solve["ok"]),
        }
        if core_solve["ok"]:
            record["core"]["coefficients"] = core_solve["coefficients"]
            record["core"]["regional_remainder"] = interval(core_solve["remainder"])
        if tail_solve["ok"]:
            record["tail"]["coefficients"] = tail_solve["coefficients"]
            record["tail"]["regional_remainder"] = interval(tail_solve["remainder"])

        if core_solve["ok"] and tail_solve["ok"] and global_solve["ok"]:
            global_coefficients = global_solve["coefficients_raw"]
            core_delta = [
                a - b
                for a, b in zip(
                    core_solve["coefficients_raw"], global_coefficients
                )
            ]
            tail_delta = [
                a - b
                for a, b in zip(
                    tail_solve["coefficients_raw"], global_coefficients
                )
            ]
            core_variation = quadratic(core_solve, core_delta)
            tail_variation = quadratic(tail_solve, tail_delta)
            core_remainder = core_solve["remainder"]
            tail_remainder = tail_solve["remainder"]
            core_actual = core_remainder + core_variation
            tail_actual = tail_remainder + tail_variation
            combined = core_actual + tail_actual
            global_remainder = global_solve["remainder"]
            overlap = not (
                combined.upper() < global_remainder.lower()
                or global_remainder.upper() < combined.lower()
            )
            signed_payment = bool(
                core_remainder.upper() < 0 and core_actual.lower() > 0
            )
            record["payment"] = {
                "core_variation": interval(core_variation),
                "tail_variation": interval(tail_variation),
                "core_actual": interval(core_actual),
                "tail_actual": interval(tail_actual),
                "combined": interval(combined),
                "direct_global": interval(global_remainder),
                "regional_global_overlap": overlap,
                "core_negative_certified": bool(core_remainder.upper() < 0),
                "core_paid_certified": bool(core_actual.lower() > 0),
                "signed_payment_certified": signed_payment,
                "combined_positive_certified": bool(combined.lower() > 0),
            }
            if core_remainder.upper() < 0:
                record["payment"]["core_coverage_ratio"] = interval(
                    core_variation / (-core_remainder)
                )
        records.append(record)

    source_hash = hashlib.sha256(SOURCE_PATH.read_bytes()).hexdigest()
    return {
        "schema_version": SCHEMA_VERSION,
        "experiment": "complete-theta-regional-atlas",
        "status": "finite_interval_experiment",
        "parameters": {
            "degree": degree,
            "old_dimension": q,
            "cells": args.cells,
            "bits": args.bits,
            "spatial_domain": ["0", "2"],
            "even_factor_in_weight": 2,
            "splits": [str(x) for x in splits],
            "passes": 2,
        },
        "analytic_envelope": {
            "included_orbits": [1, 8],
            "max_log_derivative": calculator.max_derivative,
            "n_power": calculator.n_power,
            "a_derivative_constant": calculator.a_constant,
            "spatial_tail_auxiliary_floor": "170",
            "omitted_spatial_tail_bounds": [str(x.upper()) for x in tails],
        },
        "global": {
            "old_metric_pd": bool(global_solve["ok"]),
            "pivots": global_solve["pivots"],
            "direct_remainder": interval(global_solve["remainder"])
            if global_solve["ok"]
            else None,
        },
        "records": records,
        "provenance": {
            "source_sha256": source_hash,
            "python": sys.version,
            "python_executable": sys.executable,
            "python_flint": getattr(sys.modules.get("flint"), "__version__", "unknown"),
            "platform": platform.platform(),
            "pid": os.getpid(),
        },
        "timing_seconds": time.time() - started,
        "scope": (
            "Finite normalized-endpoint complete-theta interval experiment. "
            "No all-shift, all-degree, hierarchy-extension, or RH conclusion."
        ),
    }


def atomic_write_json(path: Path, payload: dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + f".tmp.{os.getpid()}")
    with temporary.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, sort_keys=True)
        handle.write("\n")
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, path)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--degree", type=int, required=True)
    parser.add_argument("--cells", type=int, required=True)
    parser.add_argument("--bits", type=int, default=192)
    parser.add_argument("--splits", help="comma-separated rational splits")
    parser.add_argument("--split-grid", type=int, default=0)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--progress", action="store_true")
    args = parser.parse_args()
    payload = run(args)
    atomic_write_json(args.output, payload)
    print(
        json.dumps(
            {
                "status": "ok",
                "output": str(args.output),
                "degree": args.degree,
                "cells": args.cells,
                "records": len(payload["records"]),
                "timing_seconds": payload["timing_seconds"],
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
