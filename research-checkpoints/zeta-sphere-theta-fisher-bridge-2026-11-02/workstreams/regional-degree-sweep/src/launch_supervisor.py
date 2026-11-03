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
    parser.add_argument(
        "--protected-root",
        "--protected-cwd",
        dest="protected_root",
        type=Path,
        required=True,
    )
    parser.add_argument(
        "--protected-command-pattern",
        action="append",
        required=True,
        help="literal protected-process command substring; repeat as needed",
    )
    parser.add_argument("--protected-finish-confirmations", type=int, default=12)
    args = parser.parse_args()

    patterns = list(
        dict.fromkeys(
            pattern.strip()
            for pattern in args.protected_command_pattern
            if pattern.strip()
        )
    )
    if args.protected_pid <= 1:
        parser.error("--protected-pid must be greater than 1")
    if not patterns:
        parser.error("at least one nonempty --protected-command-pattern is required")
    if args.protected_finish_confirmations < 1:
        parser.error("--protected-finish-confirmations must be positive")

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
        "--protected-root",
        str(args.protected_root),
        "--protected-finish-confirmations",
        str(args.protected_finish_confirmations),
    ]
    for pattern in patterns:
        command.extend(("--protected-command-pattern", pattern))
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
