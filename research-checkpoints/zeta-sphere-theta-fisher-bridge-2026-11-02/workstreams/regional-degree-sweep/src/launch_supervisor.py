#!/usr/bin/env python3
"""Detach the supervisor and print its PID."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--supervisor", type=Path, required=True)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--tasks", type=Path, required=True)
    parser.add_argument("--worker", type=Path, required=True)
    parser.add_argument("--python", type=Path, required=True)
    parser.add_argument("--run-dir", type=Path, required=True)
    parser.add_argument("--protected-pid", type=int, required=True)
    parser.add_argument("--protected-cwd", type=Path, required=True)
    args = parser.parse_args()

    args.run_dir.mkdir(parents=True, exist_ok=True)
    launcher_log = args.run_dir / "supervisor.log"
    handle = launcher_log.open("a", encoding="utf-8", buffering=1)
    command = [
        str(args.python),
        str(args.supervisor),
        "--root",
        str(args.root),
        "--tasks",
        str(args.tasks),
        "--worker",
        str(args.worker),
        "--python",
        str(args.python),
        "--run-dir",
        str(args.run_dir),
        "--protected-pid",
        str(args.protected_pid),
        "--protected-cwd",
        str(args.protected_cwd),
    ]
    process = subprocess.Popen(
        command,
        cwd=args.root,
        stdout=handle,
        stderr=subprocess.STDOUT,
        text=True,
        start_new_session=True,
    )
    handle.close()
    print(
        json.dumps(
            {
                "status": "started",
                "pid": process.pid,
                "log": str(launcher_log),
                "command": command,
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
