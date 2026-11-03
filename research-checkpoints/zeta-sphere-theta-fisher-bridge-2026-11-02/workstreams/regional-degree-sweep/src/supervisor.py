#!/usr/bin/env python3
"""Lock-aware, host-load-aware supervisor for the regional atlas queue.

Only process groups created by this supervisor are ever signalled.  An
ambiguous lock state is treated as unlocked.  A failed host-load sample pauses
all owned workers.  This is a sampled governor, not a kernel hard cap.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import re
import signal
import subprocess
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import TextIO


# These targets deliberately leave at least one logical core of headroom below
# the user's total-host ceilings.  The controller samples rather than enforcing
# a kernel quota, and each worker is an integer-sized CPU consumer, so targeting
# the ceiling itself would permit normal sampling jitter to cross it.
LOCK_TARGET = 84.0
UNLOCK_TARGET = 42.0
UNLOCK_HARD_CAP = 5
CPU_COUNT = os.cpu_count() or 18
WORKER_PERCENT = 100.0 / CPU_COUNT
IOREG = "/usr/sbin/ioreg"
IOSTAT = "/usr/sbin/iostat"
TASKPOLICY = "/usr/sbin/taskpolicy"
NICE = "/usr/bin/nice"
PS = "/bin/ps"
LSOF = "/usr/sbin/lsof"


def atomic_json(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + f".tmp.{os.getpid()}")
    with temporary.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, sort_keys=True)
        handle.write("\n")
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, path)


def append_jsonl(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload, sort_keys=True) + "\n")
        handle.flush()
        os.fsync(handle.fileno())


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def parse_lock_output(text: str) -> tuple[str, str]:
    console = re.findall(r'"IOConsoleLocked"\s*=\s*(Yes|No)', text)
    screen = re.findall(r'"CGSSessionScreenIsLocked"\s*=\s*(Yes|No)', text)
    if len(console) != 1 or len(screen) != 1:
        return "unknown", f"lock-key cardinality console={len(console)} screen={len(screen)}"
    if console[0] != screen[0]:
        return "unknown", f"lock-key disagreement console={console[0]} screen={screen[0]}"
    return ("locked" if console[0] == "Yes" else "unlocked"), "two-key agreement"


def lock_state() -> tuple[str, str]:
    """Return locked/unlocked/unknown, requiring two OS keys to agree."""

    try:
        run = subprocess.run(
            [IOREG, "-r", "-n", "Root", "-d", "1"],
            text=True,
            capture_output=True,
            timeout=8,
            check=False,
        )
    except Exception as exc:
        return "unknown", f"ioreg exception: {exc}"
    if run.returncode != 0:
        return "unknown", f"ioreg rc={run.returncode}"
    return parse_lock_output(run.stdout)


def sample_idle() -> tuple[float | None, str]:
    try:
        run = subprocess.run(
            [IOSTAT, "-w", "1", "-c", "2"],
            text=True,
            capture_output=True,
            timeout=8,
            check=False,
        )
    except Exception as exc:
        return None, f"iostat exception: {exc}"
    if run.returncode != 0:
        return None, f"iostat rc={run.returncode}: {run.stderr.strip()}"
    rows = [line.split() for line in run.stdout.splitlines() if line.strip()]
    for parts in reversed(rows):
        if len(parts) < 6:
            continue
        try:
            idle = float(parts[-4])
        except ValueError:
            continue
        if 0.0 <= idle <= 100.0:
            return idle, "iostat interval sample"
    return None, "iostat parse failure"


def protected_job_active(
    pid: int, command_substring: str, expected_cwd: str
) -> tuple[bool | None, str]:
    try:
        run = subprocess.run(
            [PS, "-p", str(pid), "-o", "command="],
            text=True,
            capture_output=True,
            timeout=5,
            check=False,
        )
    except Exception as exc:
        return None, f"ps exception: {exc}"
    if run.returncode != 0 or not run.stdout.strip():
        return False, "protected pid absent"
    command = run.stdout.strip()
    if command_substring not in command:
        return False, "pid exists but protected command did not match"
    try:
        cwd_run = subprocess.run(
            [LSOF, "-a", "-p", str(pid), "-d", "cwd", "-Fn"],
            text=True,
            capture_output=True,
            timeout=8,
            check=False,
        )
    except Exception as exc:
        return None, f"lsof exception: {exc}"
    if cwd_run.returncode != 0:
        return None, f"lsof rc={cwd_run.returncode}"
    cwd_rows = [line[1:] for line in cwd_run.stdout.splitlines() if line.startswith("n")]
    if cwd_rows == [expected_cwd]:
        return True, "protected command and cwd matched"
    return False, f"protected cwd did not match: {cwd_rows}"


def result_is_complete(path: Path, task: dict[str, object]) -> bool:
    if not path.is_file():
        return False
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return False
    params = payload.get("parameters", {})
    expected_status = task.get("expected_status", "finite_interval_experiment")
    expected_parameters = task.get("expected_parameters")
    if expected_parameters is not None:
        return bool(
            payload.get("status") == expected_status
            and isinstance(params, dict)
            and all(params.get(key) == value for key, value in expected_parameters.items())
        )
    return bool(
        payload.get("status") == expected_status
        and params.get("degree") == task["degree"]
        and params.get("cells") == task["cells"]
        and params.get("bits") == task["bits"]
    )


@dataclass
class Worker:
    task: dict[str, object]
    process: subprocess.Popen[str]
    pgid: int
    log_handle: TextIO
    log_path: Path
    state: str = "active"
    started: float = 0.0


class Supervisor:
    def __init__(self, args: argparse.Namespace):
        self.args = args
        self.root = args.root.resolve()
        self.run_dir = args.run_dir.resolve()
        self.stop_file = self.run_dir / "STOP"
        self.heartbeat = self.run_dir / "heartbeat.json"
        self.events = self.run_dir / "events.jsonl"
        self.completed = self.run_dir / "completed.jsonl"
        self.failed = self.run_dir / "failed.jsonl"
        self.workers: dict[str, Worker] = {}
        self.lock = "unknown"
        self.lock_detail = "not sampled"
        self.idle: float | None = None
        self.load_detail = "not sampled"
        self.fourct_done = False
        self.fourct_misses = 0
        self.fourct_detail = "not sampled"
        self.resume_credit = 0
        self.started = time.time()
        self.tasks = json.loads(args.tasks.read_text(encoding="utf-8"))["tasks"]
        self.pending = [
            task
            for task in self.tasks
            if not result_is_complete(self.root / str(task["output"]), task)
        ]

    def event(self, event: str, **fields: object) -> None:
        append_jsonl(
            self.events,
            {"time": time.time(), "event": event, **fields},
        )

    def safe_signal(self, worker: Worker, sig: signal.Signals) -> bool:
        if worker.process.poll() is not None:
            return False
        try:
            actual_pgid = os.getpgid(worker.process.pid)
        except ProcessLookupError:
            return False
        if actual_pgid != worker.pgid or worker.pgid != worker.process.pid:
            self.event(
                "signal_refused",
                task=worker.task["id"],
                pid=worker.process.pid,
                recorded_pgid=worker.pgid,
                actual_pgid=actual_pgid,
            )
            return False
        os.killpg(worker.pgid, sig)
        self.event(
            "signal",
            task=worker.task["id"],
            pid=worker.process.pid,
            pgid=worker.pgid,
            signal=sig.name,
        )
        return True

    def pause(self, worker: Worker) -> None:
        if worker.state == "active" and self.safe_signal(worker, signal.SIGSTOP):
            worker.state = "paused"

    def resume(self, worker: Worker) -> None:
        if worker.state == "paused" and self.safe_signal(worker, signal.SIGCONT):
            worker.state = "active"

    def launch(self, task: dict[str, object]) -> None:
        task_id = str(task["id"])
        log_path = self.run_dir / "logs" / f"{task_id}.log"
        log_path.parent.mkdir(parents=True, exist_ok=True)
        log_handle = log_path.open("a", encoding="utf-8", buffering=1)
        output = self.root / str(task["output"])
        if "argv" in task:
            worker_path = self.root / str(task.get("worker", self.args.worker))
            command = [
                TASKPOLICY,
                "-b",
                "-c",
                "background",
                NICE,
                "-n",
                "15",
                str(self.args.python),
                str(worker_path),
                *[str(value) for value in task["argv"]],
                "--output",
                str(output),
                "--progress",
            ]
        else:
            command = [
                TASKPOLICY,
                "-b",
                "-c",
                "background",
                NICE,
                "-n",
                "15",
                str(self.args.python),
                str(self.args.worker),
                "--degree",
                str(task["degree"]),
                "--cells",
                str(task["cells"]),
                "--bits",
                str(task["bits"]),
                "--split-grid",
                str(task["split_grid"]),
                "--output",
                str(output),
                "--progress",
            ]
        environment = os.environ.copy()
        environment.update(
            {
                "OMP_NUM_THREADS": "1",
                "OPENBLAS_NUM_THREADS": "1",
                "VECLIB_MAXIMUM_THREADS": "1",
                "MKL_NUM_THREADS": "1",
                "NUMEXPR_NUM_THREADS": "1",
                "RAYON_NUM_THREADS": "1",
            }
        )
        process = subprocess.Popen(
            command,
            cwd=self.root,
            env=environment,
            stdout=log_handle,
            stderr=subprocess.STDOUT,
            text=True,
            start_new_session=True,
        )
        worker = Worker(
            task=task,
            process=process,
            pgid=process.pid,
            log_handle=log_handle,
            log_path=log_path,
            started=time.time(),
        )
        self.workers[task_id] = worker
        self.event(
            "worker_started",
            task=task_id,
            pid=process.pid,
            pgid=process.pid,
            command=command,
        )

    def reap(self) -> None:
        for task_id, worker in list(self.workers.items()):
            returncode = worker.process.poll()
            if returncode is None:
                continue
            worker.log_handle.close()
            output = self.root / str(worker.task["output"])
            record = {
                "time": time.time(),
                "task": task_id,
                "pid": worker.process.pid,
                "returncode": returncode,
                "elapsed_seconds": time.time() - worker.started,
                "output": str(output),
                "log": str(worker.log_path),
            }
            if returncode == 0 and result_is_complete(output, worker.task):
                record["sha256"] = sha256(output)
                append_jsonl(self.completed, record)
                self.event("worker_completed", **record)
            else:
                append_jsonl(self.failed, record)
                self.event("worker_failed", **record)
            del self.workers[task_id]

    def update_fourct(self) -> None:
        if self.fourct_done:
            return
        active, detail = protected_job_active(
            self.args.protected_pid,
            "scripts/chain18.sh",
            str(self.args.protected_cwd),
        )
        self.fourct_detail = detail
        if active is True:
            self.fourct_misses = 0
        elif active is False:
            self.fourct_misses += 1
            if self.fourct_misses >= 3:
                self.fourct_done = True
                self.event("protected_job_finished", pid=self.args.protected_pid)
        else:
            self.fourct_misses = 0

    def hard_cap(self) -> int:
        if self.lock != "locked":
            return UNLOCK_HARD_CAP
        return 15 if self.fourct_done else 5

    def target_percent(self) -> float:
        return LOCK_TARGET if self.lock == "locked" else UNLOCK_TARGET

    def active_workers(self) -> list[Worker]:
        return [w for w in self.workers.values() if w.state == "active"]

    def paused_workers(self) -> list[Worker]:
        return [w for w in self.workers.values() if w.state == "paused"]

    def desired_active(self) -> int:
        if self.idle is None:
            return 0
        active = len(self.active_workers())
        busy = 100.0 - self.idle
        target = self.target_percent()
        baseline = max(0.0, busy - active * WORKER_PERCENT)
        desired = math.floor(max(0.0, target - baseline) / WORKER_PERCENT)
        if busy > target:
            reduction = math.ceil((busy - target) / WORKER_PERCENT) + 1
            desired = min(desired, max(0, active - reduction))
        return max(0, min(self.hard_cap(), desired))

    def govern(self) -> None:
        desired = self.desired_active()
        active = self.active_workers()
        if len(active) > desired:
            for worker in sorted(active, key=lambda w: w.started, reverse=True)[
                : len(active) - desired
            ]:
                self.pause(worker)
            self.resume_credit = 0
            return

        if len(active) < desired:
            self.resume_credit += 1
        else:
            self.resume_credit = 0
        if self.resume_credit < 3:
            return

        need = desired - len(self.active_workers())
        for worker in sorted(self.paused_workers(), key=lambda w: w.started)[:need]:
            self.resume(worker)
        need = desired - len(self.active_workers())
        while need > 0 and self.pending and len(self.workers) < 15:
            task = self.pending.pop(0)
            output = self.root / str(task["output"])
            if result_is_complete(output, task):
                continue
            self.launch(task)
            need -= 1
        self.resume_credit = 0

    def write_heartbeat(self) -> None:
        atomic_json(
            self.heartbeat,
            {
                "schema_version": 1,
                "time": time.time(),
                "supervisor_pid": os.getpid(),
                "uptime_seconds": time.time() - self.started,
                "lock_state": self.lock,
                "lock_detail": self.lock_detail,
                "uncertain_lock_policy": "50-percent ceiling",
                "host_idle_percent": self.idle,
                "host_busy_percent": None if self.idle is None else 100.0 - self.idle,
                "load_detail": self.load_detail,
                "target_busy_percent": self.target_percent(),
                "user_ceiling_percent": 90 if self.lock == "locked" else 50,
                "hard_worker_cap": self.hard_cap(),
                "active_workers": [
                    {"task": w.task["id"], "pid": w.process.pid, "pgid": w.pgid}
                    for w in self.active_workers()
                ],
                "paused_workers": [
                    {"task": w.task["id"], "pid": w.process.pid, "pgid": w.pgid}
                    for w in self.paused_workers()
                ],
                "pending_tasks": len(self.pending),
                "fourct_done": self.fourct_done,
                "fourct_misses": self.fourct_misses,
                "fourct_detail": self.fourct_detail,
                "protected_pid": self.args.protected_pid,
                "protected_cwd": str(self.args.protected_cwd),
                "signals_are_limited_to_recorded_worker_pgids": True,
            },
        )

    def shutdown(self) -> None:
        self.event("shutdown_requested", stop_file=str(self.stop_file))
        for worker in self.paused_workers():
            self.resume(worker)
        for worker in list(self.workers.values()):
            self.safe_signal(worker, signal.SIGTERM)
        deadline = time.time() + 30
        while time.time() < deadline and any(
            worker.process.poll() is None for worker in self.workers.values()
        ):
            time.sleep(1)
        stragglers = [
            {"task": worker.task["id"], "pid": worker.process.pid, "pgid": worker.pgid}
            for worker in self.workers.values()
            if worker.process.poll() is None
        ]
        for worker in self.workers.values():
            worker.log_handle.close()
        self.event("shutdown_complete", stragglers=stragglers)
        atomic_json(
            self.run_dir / "stopped.json",
            {"time": time.time(), "stragglers": stragglers},
        )

    def run(self) -> int:
        self.run_dir.mkdir(parents=True, exist_ok=True)
        if self.stop_file.exists():
            self.stop_file.unlink()
        atomic_json(
            self.run_dir / "supervisor.json",
            {
                "pid": os.getpid(),
                "started": self.started,
                "root": str(self.root),
                "tasks": str(self.args.tasks),
                "worker": str(self.args.worker),
                "python": str(self.args.python),
            },
        )
        self.event("supervisor_started", pid=os.getpid(), tasks=len(self.pending))
        while True:
            if self.stop_file.exists():
                self.shutdown()
                return 0
            self.reap()
            self.update_fourct()
            self.lock, self.lock_detail = lock_state()
            self.idle, self.load_detail = sample_idle()
            if self.idle is None:
                for worker in self.active_workers():
                    self.pause(worker)
                self.resume_credit = 0
                self.event("load_sample_failed", detail=self.load_detail)
            else:
                self.govern()
            self.write_heartbeat()
            if not self.pending and not self.workers:
                self.event("queue_complete")
                return 0
            time.sleep(self.args.sample_seconds)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--tasks", type=Path, required=True)
    parser.add_argument("--worker", type=Path, required=True)
    parser.add_argument("--python", type=Path, required=True)
    parser.add_argument("--run-dir", type=Path, required=True)
    parser.add_argument("--protected-pid", type=int, required=True)
    parser.add_argument("--protected-cwd", type=Path, required=True)
    parser.add_argument("--sample-seconds", type=float, default=5.0)
    args = parser.parse_args()
    return Supervisor(args).run()


if __name__ == "__main__":
    raise SystemExit(main())
