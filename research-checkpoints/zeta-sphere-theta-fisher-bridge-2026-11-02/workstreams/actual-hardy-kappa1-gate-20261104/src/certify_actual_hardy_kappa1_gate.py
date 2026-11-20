#!/usr/bin/env python3
"""Certify the actual-theta wave-31 Hardy gate at m=1, J=2.

The Hardy energy is evaluated directly from the complete physical theta
profile.  The known next signed pivot is deliberately not an input.
"""
from __future__ import annotations

import argparse
from dataclasses import dataclass
from fractions import Fraction
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import resource
import sys
import tempfile
import time
from types import ModuleType
from typing import Any

from flint import arb, ctx


SCHEMA_VERSION = "zsv.actual_hardy_kappa1_gate.v1"
WORKSTREAM_REL = "workstreams/actual-hardy-kappa1-gate-20261104"
THETA_ENGINE_REL = (
    "workstreams/all-degree-analytic-search-next-v1/src/"
    "certify_modular_vprime_tilt.py"
)
POSITIVE_MOMENTS_REL = (
    "workstreams/all-degree-analytic-search-next-v1/results/"
    "enlarged_score_projection_actual_rungs.json"
)
EWALD_RECEIPT_REL = (
    "workstreams/all-degree-analytic-search-next-v1/results/"
    "ewald_kappa1_aggregate_certificate.json"
)
EWALD_AUDIT_REL = (
    "workstreams/all-degree-analytic-search-next-v1/"
    "EWALD_KAPPA1_AGGREGATE_INDEPENDENT_AUDIT.md"
)
WAVE31_REL = (
    "workstreams/direct-head-hardy-tail-wave31-20261104/"
    "DIRECT_HEAD_HARDY_TAIL_GATE_20261104.md"
)
HARDY_REL = (
    "workstreams/all-degree-analytic-search-next-v1/"
    "COMPLETE_ORBIT_HARDY_NEXT.md"
)

EXPECTED_SHA256 = {
    THETA_ENGINE_REL: "31cd42b5a31157b9ff885c9fd1a3117522a2f014b7bd829b14c6f6d87063794e",
    POSITIVE_MOMENTS_REL: "f48debd201f0a234900b9217e9a2f7693a8803a5b4ded601df8ec15a82905bf0",
    EWALD_RECEIPT_REL: "57b9f9c63e4c3ac5f2292c25b90c99881d7bf1e3c3f3d5163b5b4ceb4fec4345",
    EWALD_AUDIT_REL: "dc2af8a0aa3e00dee451f6e6ce9f1abd45a7f5f1ddc7232b1a3386454af3d841",
    WAVE31_REL: "6350bf2db5ed71e78e1e6b87885248eadcacb09298b4388e6454ffc9ad734673",
    HARDY_REL: "ccebe64d3a1e5b864dbe3db0d5fd2a322ed462311d6ad3f03c459960fda80589",
}

MIN_SPATIAL_CELLS = 128
MAX_SPATIAL_CELLS = 16_384
MIN_PRECISION_BITS = 128
MAX_PRECISION_BITS = 1_024
MAX_CPU_SECONDS_HARD = 600
MAX_RSS_MIB_HARD = 2_048


class BudgetExceeded(RuntimeError):
    """Raised when a cooperative resource checkpoint exceeds its cap."""


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def canonical_sha256(payload: object) -> str:
    data = json.dumps(
        payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def peak_rss_mib() -> float:
    raw = float(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss)
    divisor = 1024.0 * 1024.0 if sys.platform == "darwin" else 1024.0
    return raw / divisor


@dataclass
class Budget:
    max_cpu_seconds: int
    max_rss_mib: int
    started_cpu: float = 0.0

    def __post_init__(self) -> None:
        self.started_cpu = time.process_time()
        self.check("startup")

    def cpu_seconds(self) -> float:
        return time.process_time() - self.started_cpu

    def check(self, stage: str) -> None:
        cpu = self.cpu_seconds()
        rss = peak_rss_mib()
        if cpu > self.max_cpu_seconds:
            raise BudgetExceeded(
                f"CPU cap exceeded at {stage}: {cpu:.3f}>{self.max_cpu_seconds}"
            )
        if rss > self.max_rss_mib:
            raise BudgetExceeded(
                f"RSS cap exceeded at {stage}: {rss:.3f}>{self.max_rss_mib} MiB"
            )

    def record(self) -> dict[str, object]:
        return {
            "cpu_seconds": self.cpu_seconds(),
            "peak_rss_mib": peak_rss_mib(),
            "max_cpu_seconds": self.max_cpu_seconds,
            "max_rss_mib": self.max_rss_mib,
            "processes": 1,
            "intended_cpu_threads": 1,
        }


def interval_record(value: arb, digits: int = 60) -> dict[str, str]:
    return {
        "arb": value.str(min(digits, 45)),
        "lower": value.lower().str(digits),
        "upper": value.upper().str(digits),
    }


def intervals_overlap(left: arb, right: arb) -> bool:
    return not (left.upper() < right.lower() or right.upper() < left.lower())


def exact_algebra_self_checks() -> dict[str, bool]:
    # With q=t, q_1=1, so H_1=W and B_1=||W||^2.
    assert Fraction(1) ** 2 == Fraction(1)
    # The Ewald scalar cells have half the direct-source normalization:
    # sigma_0*T_dir=2*T_ewald.  Thus sigma_0 still cancels from R.
    sigma0 = Fraction(7, 3)
    tail = Fraction(5, 11)
    energy = Fraction(13, 7)
    direct_tail = 2 * tail / sigma0
    r_over_pi_normalized = 2 * sigma0 * direct_tail / energy
    r_over_pi_ewald = 4 * tail / energy
    assert r_over_pi_normalized == r_over_pi_ewald
    # The coefficient identity behind the corrected head reconstruction.
    e = Fraction(17, 5)
    b = Fraction(19, 7)
    t = Fraction(2, 9)
    pi_symbol = Fraction(22, 7)
    delta = 2 - b / e
    margin = delta - 4 * pi_symbol * t / e
    gate = e * margin / (4 * pi_symbol)
    head = e * delta / (4 * pi_symbol) - t
    assert gate == head
    return {
        "q_equals_t_has_single_root_cost": True,
        "ewald_cells_have_half_direct_source_normalization": True,
        "sigma0_cancels_from_corrected_tail_ratio": True,
        "gate_reconstructs_direct_head": True,
    }


def validate_args(args: argparse.Namespace) -> None:
    if not MIN_SPATIAL_CELLS <= args.spatial_cells <= MAX_SPATIAL_CELLS:
        raise ValueError(
            f"spatial_cells must lie in [{MIN_SPATIAL_CELLS},{MAX_SPATIAL_CELLS}]"
        )
    if args.spatial_cells & (args.spatial_cells - 1):
        raise ValueError("spatial_cells must be a power of two")
    if not MIN_PRECISION_BITS <= args.precision_bits <= MAX_PRECISION_BITS:
        raise ValueError(
            f"precision_bits must lie in [{MIN_PRECISION_BITS},{MAX_PRECISION_BITS}]"
        )
    if not 1 <= args.max_cpu_seconds <= MAX_CPU_SECONDS_HARD:
        raise ValueError(
            f"max_cpu_seconds must lie in [1,{MAX_CPU_SECONDS_HARD}]"
        )
    if not 64 <= args.max_rss_mib <= MAX_RSS_MIB_HARD:
        raise ValueError(f"max_rss_mib must lie in [64,{MAX_RSS_MIB_HARD}]")


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)
    if not isinstance(payload, dict):
        raise TypeError(f"expected JSON object in {path}")
    return payload


def verify_dependencies(root: Path) -> dict[str, str]:
    observed: dict[str, str] = {}
    for relative, expected in EXPECTED_SHA256.items():
        path = root / relative
        actual = sha256(path)
        if actual != expected:
            raise RuntimeError(
                f"dependency hash mismatch for {relative}: {actual} != {expected}"
            )
        observed[relative] = actual
    return observed


def import_theta_engine(path: Path) -> ModuleType:
    spec = importlib.util.spec_from_file_location(
        "actual_hardy_kappa1_theta_engine", path
    )
    if spec is None or spec.loader is None:
        raise ImportError(f"cannot load theta engine from {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def complete_hardy_energy(
    theta_engine: ModuleType, spatial_cells: int, budget: Budget
) -> tuple[arb, arb, arb]:
    """Return E, full-line H1, and its h>=2 enclosure.

    H1 is the full-line integral int h^2 psi'(h)^2 dh.  The imported helper's
    L_sinh_over_a tail is the corresponding full-line tail at a=0.
    """

    values = theta_engine.compact_cells(spatial_cells)
    budget.check("theta-cells-complete")
    width = arb(2) / spatial_cells
    compact = arb(0)
    for index, (h, _weight, _curvature, derivative_square) in enumerate(values):
        compact += width * 2 * h * h * derivative_square
        if index % 256 == 0:
            budget.check(f"energy-sum-{index}")
    tail_bound = theta_engine.analytic_tail_bounds()["L_sinh_over_a"]
    tail_symmetric = arb(0, tail_bound.abs_upper())
    h1 = compact + tail_symmetric
    energy = 2 * arb.pi() * h1
    budget.check("hardy-energy-complete")
    return energy, h1, tail_symmetric


def certified_b1(positive_moments: dict[str, Any]) -> tuple[arb, arb]:
    row = positive_moments["complete_positive_moments"][0]
    n0 = arb(row["complete_halfline_norm_square"]["arb"])
    b1 = 4 * arb.pi() * n0
    return b1, n0


def certified_head_and_tail(
    ewald_receipt: dict[str, Any]
) -> tuple[arb, arb, arb]:
    cells = ewald_receipt["cells"]
    parsed = {int(index): arb(row["full_enclosure"]) for index, row in cells.items()}
    head = parsed[1] + parsed[2]
    finite_tail = sum((parsed[index] for index in range(3, 7)), arb(0))
    remote_bound = arb(
        ewald_receipt["index_tail"]["sum_abs_e_n_n_gt_6_upper"]
    )
    remote = arb(0, remote_bound.abs_upper())
    return head, finite_tail + remote, remote


def build_receipt(args: argparse.Namespace) -> dict[str, Any]:
    validate_args(args)
    ctx.prec = args.precision_bits
    root = args.checkpoint_root.resolve()
    dependencies = verify_dependencies(root)
    source = Path(__file__).resolve()
    budget = Budget(args.max_cpu_seconds, args.max_rss_mib)

    positive_moments = load_json(root / POSITIVE_MOMENTS_REL)
    ewald_receipt = load_json(root / EWALD_RECEIPT_REL)
    theta_engine = import_theta_engine(root / THETA_ENGINE_REL)
    theta_engine.ctx.prec = args.precision_bits

    checks = exact_algebra_self_checks()
    b1, n0 = certified_b1(positive_moments)
    direct_head, tail, remote_tail = certified_head_and_tail(ewald_receipt)
    energy, h1, spatial_tail = complete_hardy_energy(
        theta_engine, args.spatial_cells, budget
    )

    gamma = energy / b1
    inverse_gamma = b1 / energy
    delta = 2 - inverse_gamma
    tail_ratio = 4 * arb.pi() * tail / energy
    margin = delta - tail_ratio
    head_from_gate = energy * margin / (4 * arb.pi())
    cross_difference = head_from_gate - direct_head
    overlap = intervals_overlap(head_from_gate, direct_head)

    strict = {
        "energy_positive": energy.lower() > 0,
        "b1_positive": b1.lower() > 0,
        "gamma_positive": gamma.lower() > 0,
        "direct_head_positive": direct_head.lower() > 0,
        "direct_tail_positive": tail.lower() > 0,
        "hardy_slack_positive": delta.lower() > 0,
        "tail_ratio_positive": tail_ratio.lower() > 0,
        "tail_augmented_gate_positive": margin.lower() > 0,
        "head_crosscheck_overlaps": overlap,
    }
    status = (
        "PASS_CERTIFIED_ACTUAL_KAPPA1_J2"
        if all(strict.values())
        else "UNRESOLVED_ACTUAL_KAPPA1_J2"
    )

    payload: dict[str, Any] = {
        "schema_version": SCHEMA_VERSION,
        "status": status,
        "scope": "actual complete theta; q=t; m=1; n=0; direct left cutoff J=2",
        "grade": "outward Arb intervals with complete theta-orbit and Ewald-index tails",
        "parameters": {
            "spatial_cells": args.spatial_cells,
            "precision_bits": args.precision_bits,
            "spatial_interval": [0, 2],
            "exact_theta_orbits": list(range(1, 9)),
            "first_omitted_theta_orbit": 9,
            "direct_ewald_cutoff_J": 2,
        },
        "normalization": {
            "W": "2*Xi=Fourier(psi)",
            "H1": "integral_R h^2*psi'(h)^2 dh",
            "E": "2*pi*H1=||(tW)'||_2^2",
            "B1": "4*pi*||psi||^2_{h>=0}=||W||_2^2",
            "ewald_tail": "T_q2=sum_{k>2} e_k=(sigma_0/2)*T_dir_0_2",
            "R": "4*pi*T_q2/E=2*pi*sigma_0*T_dir_0_2/E",
            "gate": "Delta-R>0 iff e1+e2>0",
        },
        "quantities": {
            "halfline_psi_norm_square_n0": interval_record(n0),
            "full_line_weighted_derivative_H1": interval_record(h1),
            "hardy_energy_E": interval_record(energy),
            "root_cost_B1": interval_record(b1),
            "gamma1": interval_record(gamma),
            "inverse_gamma1": interval_record(inverse_gamma),
            "hardy_slack_Delta": interval_record(delta),
            "ewald_scalar_head_J2": interval_record(direct_head),
            "ewald_scalar_tail_J2": interval_record(tail),
            "tail_ratio_R": interval_record(tail_ratio),
            "Delta_minus_R": interval_record(margin),
            "head_reconstructed_from_gate": interval_record(head_from_gate),
            "head_crosscheck_difference": interval_record(cross_difference),
        },
        "tail_enclosures": {
            "physical_h_ge_2_for_H1": interval_record(spatial_tail),
            "ewald_index_k_gt_6": interval_record(remote_tail),
        },
        "dependency_field_usage": {
            "positive_moment_receipt": (
                "only complete_positive_moments[0].complete_halfline_norm_square "
                "is read; signed higher fields in that frozen file are unused"
            ),
            "ewald_receipt": (
                "cells 3..6 and the k>6 total-variation bound form the gate "
                "tail; cells 1..2 are used only for an independent crosscheck"
            ),
        },
        "strict_checks": strict,
        "exact_algebra_self_checks": checks,
        "dependencies_sha256": dependencies,
        "source_sha256": sha256(source),
        "runtime": {
            **budget.record(),
            "python": sys.version,
            "python_executable": sys.executable,
            "python_flint": getattr(sys.modules.get("flint"), "__version__", "unknown"),
            "network_used": False,
            "signed_next_pivot_used_to_compute_E": False,
        },
        "nonclaims": [
            "One actual finite rung only; no all-degree inference.",
            "No logarithmic root-variance V1 bound is claimed.",
            "No Riemann-hypothesis conclusion is claimed.",
        ],
    }
    payload["payload_sha256_before_self_hash"] = canonical_sha256(payload)
    return payload


def atomic_write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    encoded = json.dumps(payload, indent=2, sort_keys=True) + "\n"
    with tempfile.NamedTemporaryFile(
        "w",
        encoding="utf-8",
        dir=path.parent,
        prefix=path.name + ".",
        suffix=".partial",
        delete=False,
    ) as handle:
        temporary = Path(handle.name)
        handle.write(encoded)
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--checkpoint-root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--spatial-cells", type=int, default=4096)
    parser.add_argument("--precision-bits", type=int, default=192)
    parser.add_argument("--max-cpu-seconds", type=int, default=120)
    parser.add_argument("--max-rss-mib", type=int, default=512)
    # The shared sampled-load supervisor appends this compatibility flag to
    # every governed worker.  This finite checker writes only its final atomic
    # receipt, so no additional progress file is required.
    parser.add_argument("--progress", action="store_true", help=argparse.SUPPRESS)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        payload = build_receipt(args)
    except BudgetExceeded as error:
        print(f"BUDGET_EXHAUSTED: {error}", file=sys.stderr)
        return 4
    atomic_write_json(args.output, payload)
    print(json.dumps({
        "status": payload["status"],
        "output": str(args.output),
        "payload_sha256": payload["payload_sha256_before_self_hash"],
    }, sort_keys=True))
    return 0 if payload["status"].startswith("PASS_") else 3


if __name__ == "__main__":
    raise SystemExit(main())

