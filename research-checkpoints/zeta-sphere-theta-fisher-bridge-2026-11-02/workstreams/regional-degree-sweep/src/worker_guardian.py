#!/usr/bin/env python3
"""Keep one owned worker from outliving its supervisor.

The guardian is intentionally outside the worker's process group, so it keeps
checking parent liveness while the governor pauses the worker group. It never
discovers or signals arbitrary processes: the only signal target is the fresh
session leader that this process created and whose PID/PGID/SID identity still
matches.
"""

from __future__ import annotations

import argparse
import json
import os
import signal
import subprocess
import time
from pathlib import Path


def atomic_json(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + f".tmp.{os.getpid()}")
    with temporary.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, sort_keys=True)
        handle.write("\n")
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, path)


def owned_session_matches(pid: int) -> bool:
    try:
        return os.getpgid(pid) == pid and os.getsid(pid) == pid
    except (ProcessLookupError, PermissionError, OSError):
        return False


def signal_owned_session(pid: int, sig: signal.Signals) -> bool:
    if not owned_session_matches(pid):
        return False
    try:
        os.killpg(pid, sig)
    except (ProcessLookupError, PermissionError, OSError):
        return False
    return True


def stop_owned_worker(
    child: subprocess.Popen[bytes], receipt: Path, reason: str
) -> int:
    """Stop the owned session, escalating only after its supervisor is gone."""

    worker_pid = child.pid
    signals_sent: list[str] = []
    if child.poll() is None and signal_owned_session(worker_pid, signal.SIGCONT):
        signals_sent.append("SIGCONT")
    if child.poll() is None and signal_owned_session(worker_pid, signal.SIGTERM):
        signals_sent.append("SIGTERM")
    deadline = time.time() + 10
    while child.poll() is None and time.time() < deadline:
        time.sleep(0.1)
    if child.poll() is None and signal_owned_session(worker_pid, signal.SIGKILL):
        signals_sent.append("SIGKILL")
    try:
        returncode = child.wait(timeout=5)
    except subprocess.TimeoutExpired:
        returncode = 126
    atomic_json(
        receipt,
        {
            "status": "owned_worker_stopped_after_guardian_trigger",
            "time": time.time(),
            "reason": reason,
            "guardian_pid": os.getpid(),
            "worker_pid": worker_pid,
            "signals_sent": signals_sent,
            "returncode": returncode,
        },
    )
    return returncode


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--supervisor-pid", type=int, required=True)
    parser.add_argument("--ready-file", type=Path, required=True)
    parser.add_argument("command", nargs=argparse.REMAINDER)
    args = parser.parse_args()
    command = list(args.command)
    if command and command[0] == "--":
        command.pop(0)
    if args.supervisor_pid <= 1 or not command:
        parser.error("a live supervisor PID and worker command are required")

    stop_signal = 0

    def request_stop(signum: int, _frame: object) -> None:
        nonlocal stop_signal
        stop_signal = signum

    # Install forwarding before worker spawn. This closes the interval where a
    # supervisor cleanup signal could otherwise kill the guardian but leave a
    # just-spawned worker behind.
    for signum in (signal.SIGTERM, signal.SIGINT, signal.SIGHUP):
        signal.signal(signum, request_stop)

    if os.getppid() != args.supervisor_pid:
        return 125

    child = subprocess.Popen(command, start_new_session=True)
    worker_pid = child.pid
    if not owned_session_matches(worker_pid):
        child.terminate()
        child.wait(timeout=5)
        return 125

    stopped_receipt = args.ready_file.with_name(
        args.ready_file.stem + ".guardian-stopped.json"
    )
    if stop_signal:
        return stop_owned_worker(
            child,
            stopped_receipt,
            f"guardian_signal_{stop_signal}_during_launch",
        )
    if os.getppid() != args.supervisor_pid:
        return stop_owned_worker(
            child,
            stopped_receipt,
            "supervisor_parent_disappeared_during_launch",
        )
    atomic_json(
        args.ready_file,
        {
            "status": "owned_worker_ready",
            "time": time.time(),
            "supervisor_pid": args.supervisor_pid,
            "guardian_pid": os.getpid(),
            "worker_pid": worker_pid,
            "worker_pgid": os.getpgid(worker_pid),
            "worker_sid": os.getsid(worker_pid),
        },
    )

    while True:
        returncode = child.poll()
        if returncode is not None:
            return returncode
        if stop_signal:
            return stop_owned_worker(
                child,
                stopped_receipt,
                f"guardian_signal_{stop_signal}",
            )
        if os.getppid() != args.supervisor_pid:
            return stop_owned_worker(
                child,
                stopped_receipt,
                "supervisor_parent_disappeared",
            )
        time.sleep(0.2)


if __name__ == "__main__":
    raise SystemExit(main())
