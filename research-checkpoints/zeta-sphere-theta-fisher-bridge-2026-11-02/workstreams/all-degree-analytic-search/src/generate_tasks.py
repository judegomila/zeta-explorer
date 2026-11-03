#!/usr/bin/env python3
"""Generate the theorem-discovery queue for the all-degree RH workstream."""

from __future__ import annotations

import json
import os
from pathlib import Path


WORKSTREAM = "workstreams/all-degree-analytic-search"


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


def build_tasks() -> list[dict[str, object]]:
    tasks: list[dict[str, object]] = []

    # Exact recurrence substrate.  These jobs seek stable arbitrary-degree
    # identities and hashes, not positivity at a finite cutoff.
    for degree in (16, 32, 64, 96, 128):
        tasks.append(
            task(
                f"structure_j{degree:03d}",
                "structural_generator.py",
                ["--degree", str(degree)],
                "exact_structural_identity",
                {"degree": degree},
            )
        )

    # Reflected Hardy operator mining.  Repeated node counts are deliberate
    # conditioning/falsification checks; ranks that do not survive them are
    # classified as numerical artifacts.
    shifts = ("0", "0.0625", "0.125", "0.25", "0.5")
    for degree in (6, 8, 10, 12, 14, 16):
        for shift in shifts:
            for nodes in (512, 1024):
                shift_tag = shift.replace(".", "p")
                tasks.append(
                    task(
                        f"operator_j{degree:02d}_a{shift_tag}_q{nodes}",
                        "operator_mining.py",
                        [
                            "--degree",
                            str(degree),
                            "--shift",
                            shift,
                            "--nodes",
                            str(nodes),
                        ],
                        "analytic_structure_experiment",
                        {"degree": degree, "shift": shift, "nodes": nodes},
                    )
                )

    # Resolve the parity caveat in the known modular-residue obstruction.
    # Precision grows with N; every fourth N is replayed with extra precision.
    n_values = tuple(range(2, 22, 2)) + (24, 28, 32, 36, 40)
    for n in n_values:
        for parity in ("even", "odd"):
            for h in ("0", "0.25", "0.5"):
                dps = 180 + 24 * n
                h_tag = h.replace(".", "p")
                tasks.append(
                    task(
                        f"residue_n{n:02d}_{parity}_h{h_tag}_p{dps}",
                        "parity_residue.py",
                        [
                            "--n",
                            str(n),
                            "--parity",
                            parity,
                            "--h",
                            h,
                            "--dps",
                            str(dps),
                        ],
                        "analytic_pattern_experiment",
                        {"n": n, "parity": parity, "h": h, "dps": dps},
                    )
                )
                if n % 8 == 0 and h == "0":
                    replay_dps = dps + 160
                    tasks.append(
                        task(
                            f"residue_n{n:02d}_{parity}_h0_replay_p{replay_dps}",
                            "parity_residue.py",
                            [
                                "--n",
                                str(n),
                                "--parity",
                                parity,
                                "--h",
                                "0",
                                "--dps",
                                str(replay_dps),
                            ],
                            "analytic_pattern_experiment",
                            {
                                "n": n,
                                "parity": parity,
                                "h": "0",
                                "dps": replay_dps,
                            },
                        )
                    )
    return tasks


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
    output = Path(__file__).resolve().parents[1] / "tasks.json"
    tasks = build_tasks()
    atomic_write(
        output,
        {
            "schema_version": 1,
            "purpose": (
                "Discover or falsify arbitrary-degree theta factorizations; "
                "finite sections are diagnostics, never RH evidence."
            ),
            "tasks": tasks,
        },
    )
    print(json.dumps({"output": str(output), "tasks": len(tasks)}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
