#!/usr/bin/env python3
"""Generate the gated modular-pair analytic queue.

Stage 0 proves/checks the arbitrary-degree exponential generating-function
identity. Stage 1 is not generated until the stage-0 manifest has passed its
exact checks. The signed-pair jobs are scaling diagnostics, not positivity
certificates and not evidence proving RH.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
from typing import Any


WORKSTREAM = "workstreams/all-degree-analytic-search-next-v1"
EGF_MANIFEST = f"{WORKSTREAM}/results/egf_identity_j128.json"
SCALE_GRID = (
    "1:0.25",
    "1:1",
    "1:4",
    "2:0.25",
    "2:1",
    "2:4",
)
SCALE_GRID_ID = "beta1_beta2_c0p25_1_4"
PRIMARY_N_DPS = ((8, 372), (12, 468), (16, 564), (20, 660), (24, 756))
REPLAY_N_DPS = ((16, 724), (24, 916))

WORKSTREAM_ROOT = Path(__file__).resolve().parents[1]
CHECKPOINT_ROOT = Path(__file__).resolve().parents[3]


def task(
    task_id: str,
    worker: str,
    argv: list[str],
    status: str,
    parameters: dict[str, object],
) -> dict[str, object]:
    return {
        "id": task_id,
        "worker": f"{WORKSTREAM}/src/{worker}",
        "argv": argv,
        "output": f"{WORKSTREAM}/results/{task_id}.json",
        "expected_status": status,
        "expected_parameters": parameters,
    }


def build_stage0_tasks() -> list[dict[str, object]]:
    return [
        task(
            "egf_identity_j128",
            "egf_identity.py",
            [
                "--full-polynomial-degree",
                "64",
                "--scalar-degree",
                "128",
                "--structural-result",
                "workstreams/all-degree-analytic-search/results/structure_j128.json",
                "--sample-z",
                "0",
                "--sample-z",
                "1",
                "--sample-z",
                "2",
                "--sample-z",
                "3",
                "--max-output-bytes",
                "1048576",
            ],
            "exact_egf_identity",
            {"full_polynomial_degree": 64, "scalar_degree": 128},
        )
    ]


def pair_task(
    n: int,
    parity: str,
    dps: int,
    *,
    replay: bool,
    egf_manifest: str = EGF_MANIFEST,
) -> dict[str, object]:
    replay_tag = "_replay" if replay else ""
    task_id = f"pair_n{n:02d}_{parity}{replay_tag}_p{dps}"
    argv = [
        "--n",
        str(n),
        "--parity",
        parity,
        "--anchor-h",
        "0",
        "--dps",
        str(dps),
    ]
    for value in SCALE_GRID:
        argv.extend(("--scaled-h", value))
    argv.extend(
        (
            "--egf-manifest",
            egf_manifest,
            "--max-orbit",
            "96",
            "--max-seconds",
            "600",
            "--max-output-bytes",
            "8388608",
        )
    )
    return task(
        task_id,
        "signed_h_pair.py",
        argv,
        "signed_h_pair_diagnostic",
        {
            "n": n,
            "parity": parity,
            "dps": dps,
            "anchor_h": "0",
            "scale_grid": SCALE_GRID_ID,
            "max_orbit": 96,
        },
    )


def build_stage1_tasks(
    egf_manifest: str = EGF_MANIFEST,
) -> list[dict[str, object]]:
    tasks: list[dict[str, object]] = []
    for n, dps in PRIMARY_N_DPS:
        for parity in ("even", "odd"):
            tasks.append(
                pair_task(
                    n,
                    parity,
                    dps,
                    replay=False,
                    egf_manifest=egf_manifest,
                )
            )
    for n, dps in REPLAY_N_DPS:
        for parity in ("even", "odd"):
            tasks.append(
                pair_task(
                    n,
                    parity,
                    dps,
                    replay=True,
                    egf_manifest=egf_manifest,
                )
            )
    return tasks


def validate_egf_manifest(path: Path) -> tuple[dict[str, Any], str]:
    """Reject stage 1 unless the exact stage-0 manifest passed."""

    try:
        raw = path.read_bytes()
        payload = json.loads(raw)
    except Exception as exc:
        raise ValueError(f"cannot read EGF manifest {path}: {exc}") from exc
    if payload.get("status") != "exact_egf_identity":
        raise ValueError("EGF manifest status is not exact_egf_identity")
    if payload.get("parameters") != {
        "full_polynomial_degree": 64,
        "scalar_degree": 128,
    }:
        raise ValueError("EGF manifest parameters do not match stage 0")
    checks = payload.get("checks")
    if not isinstance(checks, dict) or checks.get("all_exact_checks_passed") is not True:
        raise ValueError("EGF manifest did not pass every exact check")
    return payload, hashlib.sha256(raw).hexdigest()


def atomic_write(path: Path, payload: object) -> None:
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
    parser.add_argument("--stage", choices=("stage0", "stage1"), required=True)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--egf-manifest", default=EGF_MANIFEST)
    args = parser.parse_args()

    manifest_sha256: str | None = None
    manifest_reference = EGF_MANIFEST
    if args.stage == "stage0":
        tasks = build_stage0_tasks()
        output = args.output or WORKSTREAM_ROOT / "tasks-stage0.json"
        purpose = (
            "Exact arbitrary-degree EGF identity gate. A passing manifest is "
            "required before any signed h-pair diagnostic is generated."
        )
    else:
        manifest_reference = args.egf_manifest
        manifest_argument = Path(args.egf_manifest)
        manifest_path = (
            manifest_argument
            if manifest_argument.is_absolute()
            else CHECKPOINT_ROOT / manifest_argument
        )
        try:
            _, manifest_sha256 = validate_egf_manifest(manifest_path)
        except ValueError as exc:
            parser.error(str(exc))
        tasks = build_stage1_tasks(args.egf_manifest)
        output = args.output or WORKSTREAM_ROOT / "tasks-stage1.json"
        purpose = (
            "Signed h/-h endpoint-layer scaling diagnostics bound to a passing "
            "exact EGF manifest. Finite results cannot prove positivity or RH."
        )

    atomic_write(
        output,
        {
            "schema_version": 1,
            "stage": args.stage,
            "purpose": purpose,
            "egf_manifest": manifest_reference,
            "egf_manifest_sha256": manifest_sha256,
            "tasks": tasks,
        },
    )
    print(
        json.dumps(
            {
                "output": str(output),
                "stage": args.stage,
                "tasks": len(tasks),
                "egf_manifest_sha256": manifest_sha256,
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
