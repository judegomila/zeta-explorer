#!/usr/bin/env python3
"""Generate the deterministic progressive refinement queue."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path


DEGREES = [7, 9, 11, 13, 15, 17, 19]
CELL_LEVELS = [
    4_096,
    16_384,
    65_536,
    262_144,
    1_048_576,
    4_194_304,
    16_777_216,
]


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
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--results-dir", default="results")
    args = parser.parse_args()

    tasks = []
    for cells in CELL_LEVELS:
        for degree in DEGREES:
            bits = 224 + 16 * (degree - 7)
            task_id = f"d{degree:02d}_n{cells:08d}_b{bits}_g128"
            tasks.append(
                {
                    "id": task_id,
                    "degree": degree,
                    "cells": cells,
                    "bits": bits,
                    "split_grid": 128,
                    "output": f"{args.results_dir}/{task_id}.json",
                    "classification": "finite_interval_experiment",
                }
            )
    atomic_write(args.output, {"schema_version": 1, "tasks": tasks})
    print(json.dumps({"status": "ok", "tasks": len(tasks), "output": str(args.output)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
