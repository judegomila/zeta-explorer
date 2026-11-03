#!/usr/bin/env python3
"""Lock-aware, host-load-aware supervisor for the regional atlas queue.

Only process groups created by this supervisor are ever signalled.  An
ambiguous lock state is treated as unlocked.  A failed host-load sample pauses
all owned workers.  This is a sampled governor, not a kernel hard cap.
"""

from __future__ import annotations

import argparse
import fcntl
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
from typing import Callable, Sequence, TextIO


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


class SupervisorTermination(BaseException):
    """Raised in the main thread so TERM/INT follows the cleanup path."""

    def __init__(self, signum: int):
        super().__init__(f"supervisor received signal {signum}")
        self.signum = signum


class RunDirectoryLock:
    """An advisory singleton lock held for the supervisor's whole lifetime.

    ``flock`` is released by the kernel if the supervisor exits unexpectedly,
    so a stale metadata file cannot permanently block a later, verified
    recovery. The file contents are diagnostic only; ownership is determined
    exclusively by the live lock.
    """

    def __init__(self, run_dir: Path):
        self.path = run_dir / "supervisor.lock"
        self.handle: TextIO | None = None

    def acquire(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        handle = self.path.open("a+", encoding="utf-8")
        try:
            fcntl.flock(handle.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as exc:
            handle.seek(0)
            owner = handle.read().strip() or "owner metadata unavailable"
            handle.close()
            raise RuntimeError(
                f"run directory already has a live supervisor: {owner}"
            ) from exc
        try:
            handle.seek(0)
            handle.truncate()
            json.dump(
                {
                    "status": "active",
                    "pid": os.getpid(),
                    "acquired": time.time(),
                },
                handle,
                sort_keys=True,
            )
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        except BaseException:
            fcntl.flock(handle.fileno(), fcntl.LOCK_UN)
            handle.close()
            raise
        self.handle = handle

    def release(self) -> None:
        handle = self.handle
        if handle is None:
            return
        try:
            handle.seek(0)
            handle.truncate()
            json.dump(
                {
                    "status": "released",
                    "pid": os.getpid(),
                    "released": time.time(),
                },
                handle,
                sort_keys=True,
            )
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        finally:
            try:
                fcntl.flock(handle.fileno(), fcntl.LOCK_UN)
            finally:
                handle.close()
                self.handle = None


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


def parse_process_table(text: str) -> list[tuple[int, str]]:
    rows: list[tuple[int, str]] = []
    for line in text.splitlines():
        match = re.match(r"^\s*(\d+)\s+(.+?)\s*$", line)
        if match is not None:
            rows.append((int(match.group(1)), match.group(2)))
    return rows


def command_matches(command: str, patterns: Sequence[str]) -> bool:
    return any(pattern in command for pattern in patterns)


def path_is_within(candidate: str, expected_root: str) -> bool:
    try:
        candidate_path = Path(candidate).resolve(strict=False)
        root_path = Path(expected_root).resolve(strict=False)
        return os.path.commonpath((str(candidate_path), str(root_path))) == str(root_path)
    except (OSError, ValueError):
        return False


def classify_protected_snapshot(
    rows: Sequence[tuple[int, str]],
    primary_pid: int,
    command_patterns: Sequence[str],
    expected_root: str,
    cwd_lookup: Callable[[int], tuple[list[str] | None, str]],
    own_pid: int | None = None,
) -> tuple[bool | None, str]:
    """Classify one successful process-table snapshot conservatively.

    A matching process is protected only when its cwd is inside the configured
    root.  A reused/mismatched primary PID or an unreadable matching cwd is
    uncertainty, never evidence that the protected workload finished.
    """

    if not command_patterns:
        return None, "no protected command patterns configured"

    commands = {pid: command for pid, command in rows}
    primary_command = commands.get(primary_pid)
    primary_mismatch = bool(
        primary_command is not None
        and not command_matches(primary_command, command_patterns)
    )
    matching = [
        (pid, command)
        for pid, command in rows
        if pid != own_pid and command_matches(command, command_patterns)
    ]
    active: list[int] = []
    uncertain: list[str] = []
    for pid, _command in matching:
        cwd_rows, detail = cwd_lookup(pid)
        if cwd_rows is None:
            uncertain.append(f"pid={pid} cwd unavailable ({detail})")
            continue
        if any(path_is_within(cwd, expected_root) for cwd in cwd_rows):
            active.append(pid)
        elif pid == primary_pid:
            uncertain.append(
                f"primary pid={pid} command matched but cwd was outside protected root: "
                f"{cwd_rows}"
            )

    if active:
        return True, f"protected command/cwd matched pids={sorted(active)}"
    if primary_mismatch:
        return None, (
            f"primary pid={primary_pid} exists but command did not match configured "
            "protected patterns"
        )
    if uncertain:
        return None, "; ".join(uncertain)
    if primary_command is None:
        return False, "successful process scan found no protected command/cwd match"
    return None, (
        f"primary pid={primary_pid} exists but could not be validated as protected"
    )


def _cwd_for_pid(pid: int) -> tuple[list[str] | None, str]:
    try:
        run = subprocess.run(
            [LSOF, "-a", "-p", str(pid), "-d", "cwd", "-Fn"],
            text=True,
            capture_output=True,
            timeout=8,
            check=False,
        )
    except Exception as exc:
        return None, f"lsof exception: {exc}"
    if run.returncode != 0:
        return None, f"lsof rc={run.returncode}"
    cwd_rows = [line[1:] for line in run.stdout.splitlines() if line.startswith("n")]
    if not cwd_rows:
        return None, "lsof returned no cwd"
    return cwd_rows, "lsof cwd sample"


def protected_job_active(
    pid: int, command_patterns: Sequence[str], expected_root: str
) -> tuple[bool | None, str]:
    """Discover protected work across PID turnover from a full process scan."""

    try:
        run = subprocess.run(
            [PS, "-axo", "pid=,command="],
            text=True,
            capture_output=True,
            timeout=10,
            check=False,
        )
    except Exception as exc:
        return None, f"ps exception: {exc}"
    if run.returncode != 0:
        return None, f"ps rc={run.returncode}: {run.stderr.strip()}"
    rows = parse_process_table(run.stdout)
    if not rows:
        return None, "ps process-table parse failure"
    return classify_protected_snapshot(
        rows,
        pid,
        command_patterns,
        expected_root,
        _cwd_for_pid,
        own_pid=os.getpid(),
    )


def advance_protected_state(
    done: bool,
    misses: int,
    observation: bool | None,
    finish_confirmations: int,
) -> tuple[bool, int, str]:
    """Advance the fail-safe protected-work state machine.

    The done state means a configured number of confident absence observations
    has completed.  Activity or uncertainty immediately returns to the
    protected state.  This keeps the low-concurrency policy in force across PID
    turnover, process-table races, and a protected job that restarts.
    """

    if finish_confirmations < 1:
        raise ValueError("finish_confirmations must be positive")
    if observation is True:
        return False, 0, "reappeared" if done else "active"
    if observation is None:
        return False, 0, "uncertain_after_finish" if done else "uncertain"

    confirmed_misses = min(finish_confirmations, misses + 1)
    if confirmed_misses >= finish_confirmations:
        return True, confirmed_misses, "finished" if not done else "finished_confirmed"
    return False, confirmed_misses, "confirming_absence"


def validate_task_manifest(payload: object, root: Path) -> list[dict[str, object]]:
    """Validate identities and output ownership before any worker can start."""

    if not isinstance(payload, dict) or not isinstance(payload.get("tasks"), list):
        raise ValueError("task manifest must be an object containing a tasks list")
    tasks = payload["tasks"]
    seen_ids: set[str] = set()
    seen_outputs: set[str] = set()
    validated: list[dict[str, object]] = []
    resolved_root = root.resolve()
    for index, task in enumerate(tasks):
        if not isinstance(task, dict):
            raise ValueError(f"task at index {index} must be an object")
        task_id = task.get("id")
        if not isinstance(task_id, str) or not task_id.strip():
            raise ValueError(f"task at index {index} has no nonempty string id")
        if re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]*", task_id) is None:
            raise ValueError(f"task id is not path-safe: {task_id}")
        if task_id in seen_ids:
            raise ValueError(f"duplicate task id: {task_id}")
        seen_ids.add(task_id)

        output = task.get("output")
        if not isinstance(output, str) or not output.strip():
            raise ValueError(f"task {task_id} has no nonempty string output")
        output_path = Path(output)
        if output_path.is_absolute():
            raise ValueError(f"task {task_id} output must be relative to the root")
        resolved_output = (resolved_root / output_path).resolve(strict=False)
        if resolved_output == resolved_root or not path_is_within(
            str(resolved_output), str(resolved_root)
        ):
            raise ValueError(f"task {task_id} output escapes the root: {output}")
        output_key = str(resolved_output)
        if output_key in seen_outputs:
            raise ValueError(f"duplicate task output: {output}")
        seen_outputs.add(output_key)

        accepted_verdicts = task.get("accepted_verdicts")
        if accepted_verdicts is not None and (
            not isinstance(accepted_verdicts, list)
            or not accepted_verdicts
            or any(
                not isinstance(verdict, str) or not verdict
                for verdict in accepted_verdicts
            )
            or len(set(accepted_verdicts)) != len(accepted_verdicts)
        ):
            raise ValueError(
                f"task {task_id} accepted_verdicts must be a nonempty unique string list"
            )
        validated.append(task)
    return validated


def load_task_manifest(path: Path, root: Path) -> list[dict[str, object]]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"could not read task manifest {path}: {exc}") from exc
    return validate_task_manifest(payload, root)


def wait_for_guardian_ready(
    guardian: subprocess.Popen[str], ready_file: Path, timeout: float = 10.0
) -> tuple[int, int]:
    deadline = time.time() + timeout
    last_error = "ready receipt not present"
    while time.time() < deadline:
        if ready_file.is_file():
            try:
                payload = json.loads(ready_file.read_text(encoding="utf-8"))
                guardian_pid = int(payload["guardian_pid"])
                worker_pid = int(payload["worker_pid"])
                worker_pgid = int(payload["worker_pgid"])
                worker_sid = int(payload["worker_sid"])
                if payload.get("status") != "owned_worker_ready":
                    raise ValueError("unexpected guardian status")
                if guardian_pid != guardian.pid:
                    raise ValueError("guardian PID mismatch")
                if worker_pid <= 1 or worker_pgid != worker_pid or worker_sid != worker_pid:
                    raise ValueError("worker PID/PGID/SID identity mismatch")
                return worker_pid, worker_pgid
            except (KeyError, TypeError, ValueError, OSError, json.JSONDecodeError) as exc:
                last_error = f"invalid ready receipt: {exc}"
        returncode = guardian.poll()
        if returncode is not None:
            raise RuntimeError(
                f"worker guardian exited before a valid handshake: rc={returncode}; "
                f"{last_error}"
            )
        time.sleep(0.05)
    raise TimeoutError(f"worker guardian handshake timed out: {last_error}")


def result_is_complete(path: Path, task: dict[str, object]) -> bool:
    if not path.is_file():
        return False
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return False
    accepted_verdicts = task.get("accepted_verdicts")
    if accepted_verdicts is not None and payload.get("verdict") not in accepted_verdicts:
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
    # ``process`` is the guardian. The separately sessioned worker is the only
    # process group the governor pauses/resumes/terminates.
    process: subprocess.Popen[str]
    worker_pid: int
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
        self.protected_done = False
        self.protected_misses = 0
        self.protected_detail = "not sampled"
        self.resume_credit = 0
        self.started = time.time()
        self.run_lock = RunDirectoryLock(self.run_dir)
        self.shutdown_attempted = False
        self.termination_requested = False
        self.tasks = load_task_manifest(args.tasks, self.root)
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
        if not any(candidate is worker for candidate in self.workers.values()):
            self.event(
                "signal_refused",
                task=worker.task["id"],
                pid=worker.worker_pid,
                guardian_pid=worker.process.pid,
                reason="worker object is not owned by this supervisor",
            )
            return False
        try:
            actual_pgid = os.getpgid(worker.worker_pid)
            actual_sid = os.getsid(worker.worker_pid)
        except (ProcessLookupError, PermissionError, OSError) as exc:
            self.event(
                "signal_refused",
                task=worker.task["id"],
                pid=worker.worker_pid,
                guardian_pid=worker.process.pid,
                reason=f"identity lookup failed: {exc}",
            )
            return False
        if (
            actual_pgid != worker.pgid
            or worker.pgid != worker.worker_pid
            or actual_sid != worker.worker_pid
        ):
            self.event(
                "signal_refused",
                task=worker.task["id"],
                pid=worker.worker_pid,
                guardian_pid=worker.process.pid,
                recorded_pgid=worker.pgid,
                actual_pgid=actual_pgid,
                actual_sid=actual_sid,
                reason="owned process-group identity check failed",
            )
            return False
        try:
            os.killpg(worker.pgid, sig)
        except (ProcessLookupError, PermissionError, OSError) as exc:
            self.event(
                "signal_refused",
                task=worker.task["id"],
                pid=worker.worker_pid,
                guardian_pid=worker.process.pid,
                pgid=worker.pgid,
                reason=f"signal failed: {exc}",
            )
            return False
        self.event(
            "signal",
            task=worker.task["id"],
            pid=worker.worker_pid,
            guardian_pid=worker.process.pid,
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
        guardian_key = hashlib.sha256(task_id.encode("utf-8")).hexdigest()[:20]
        ready_file = self.run_dir / "guardians" / f"{guardian_key}.ready.json"
        ready_file.parent.mkdir(parents=True, exist_ok=True)
        ready_file.unlink(missing_ok=True)
        guardian_command = [
            str(self.args.python),
            str(Path(__file__).with_name("worker_guardian.py")),
            "--supervisor-pid",
            str(os.getpid()),
            "--ready-file",
            str(ready_file),
            "--",
            *command,
        ]
        guardian: subprocess.Popen[str] | None = None
        try:
            guardian = subprocess.Popen(
                guardian_command,
                cwd=self.root,
                env=environment,
                stdout=log_handle,
                stderr=subprocess.STDOUT,
                text=True,
                start_new_session=True,
            )
            worker_pid, worker_pgid = wait_for_guardian_ready(guardian, ready_file)
        except BaseException as exc:
            if guardian is not None and guardian.poll() is None:
                try:
                    guardian.terminate()
                except (ProcessLookupError, PermissionError, OSError):
                    pass
            log_handle.close()
            self.event(
                "worker_launch_failed",
                task=task_id,
                command=guardian_command,
                error=f"{type(exc).__name__}: {exc}",
            )
            raise
        worker = Worker(
            task=task,
            process=guardian,
            worker_pid=worker_pid,
            pgid=worker_pgid,
            log_handle=log_handle,
            log_path=log_path,
            started=time.time(),
        )
        self.workers[task_id] = worker
        self.event(
            "worker_started",
            task=task_id,
            pid=worker_pid,
            guardian_pid=guardian.pid,
            pgid=worker_pgid,
            command=command,
            guardian_command=guardian_command,
        )

    def reap(self) -> None:
        for task_id, worker in list(self.workers.items()):
            returncode = worker.process.poll()
            if returncode is None:
                continue
            if self.worker_session_alive(worker):
                if worker.state != "terminating":
                    # The guardian should outlive its child. If it does not,
                    # keep the worker owned and terminate its recorded session
                    # instead of dropping it from governance.
                    self.safe_signal(worker, signal.SIGCONT)
                    self.safe_signal(worker, signal.SIGTERM)
                    worker.state = "terminating"
                    self.event(
                        "worker_guardian_exited_early",
                        task=task_id,
                        pid=worker.worker_pid,
                        guardian_pid=worker.process.pid,
                        guardian_returncode=returncode,
                    )
                continue
            worker.log_handle.close()
            output = self.root / str(worker.task["output"])
            record = {
                "time": time.time(),
                "task": task_id,
                "pid": worker.worker_pid,
                "guardian_pid": worker.process.pid,
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

    def update_protected(self) -> None:
        was_done = self.protected_done
        active, detail = protected_job_active(
            self.args.protected_pid,
            self.args.protected_command_pattern,
            str(self.args.protected_root),
        )
        self.protected_detail = detail
        self.protected_done, self.protected_misses, transition = advance_protected_state(
            self.protected_done,
            self.protected_misses,
            active,
            self.args.protected_finish_confirmations,
        )
        if transition == "finished" and not was_done:
            self.event(
                "protected_job_finished",
                pid=self.args.protected_pid,
                confirmations=self.protected_misses,
                detail=detail,
            )
        elif transition == "reappeared":
            self.event("protected_job_reappeared", detail=detail)
        elif transition == "uncertain_after_finish":
            self.event("protected_state_uncertain", detail=detail)

    def hard_cap(self) -> int:
        if self.lock != "locked":
            return UNLOCK_HARD_CAP
        return 15 if self.protected_done else 5

    def target_percent(self) -> float:
        return LOCK_TARGET if self.lock == "locked" else UNLOCK_TARGET

    def active_workers(self) -> list[Worker]:
        return [w for w in self.workers.values() if w.state == "active"]

    def paused_workers(self) -> list[Worker]:
        return [w for w in self.workers.values() if w.state == "paused"]

    def worker_session_alive(self, worker: Worker) -> bool:
        try:
            return (
                os.getpgid(worker.worker_pid) == worker.pgid
                and worker.pgid == worker.worker_pid
                and os.getsid(worker.worker_pid) == worker.worker_pid
            )
        except (ProcessLookupError, PermissionError, OSError):
            return False

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
                "schema_version": 2,
                "time": time.time(),
                "supervisor_pid": os.getpid(),
                "uptime_seconds": time.time() - self.started,
                "lock_state": self.lock,
                "lock_detail": self.lock_detail,
                "uncertain_lock_policy": "unlocked policy: 42-percent admission target",
                "host_idle_percent": self.idle,
                "host_busy_percent": None if self.idle is None else 100.0 - self.idle,
                "load_detail": self.load_detail,
                "target_busy_percent": self.target_percent(),
                "user_ceiling_percent": 90 if self.lock == "locked" else 50,
                "hard_worker_cap": self.hard_cap(),
                "governor_type": "sampled admission control",
                "instantaneous_total_cpu_ceiling_guaranteed": False,
                "active_workers": [
                    {
                        "task": w.task["id"],
                        "pid": w.worker_pid,
                        "pgid": w.pgid,
                        "guardian_pid": w.process.pid,
                    }
                    for w in self.active_workers()
                ],
                "paused_workers": [
                    {
                        "task": w.task["id"],
                        "pid": w.worker_pid,
                        "pgid": w.pgid,
                        "guardian_pid": w.process.pid,
                    }
                    for w in self.paused_workers()
                ],
                "pending_tasks": len(self.pending),
                "protected_active": not self.protected_done,
                "protected_done": self.protected_done,
                "protected_misses": self.protected_misses,
                "protected_detail": self.protected_detail,
                "protected_pid": self.args.protected_pid,
                "protected_root": str(self.args.protected_root),
                "protected_command_patterns": self.args.protected_command_pattern,
                "protected_finish_confirmations": self.args.protected_finish_confirmations,
                "signals_are_limited_to_recorded_worker_pgids": True,
                "worker_parent_liveness_guardians": True,
            },
        )

    def best_effort_event(self, event: str, **fields: object) -> None:
        try:
            self.event(event, **fields)
        except BaseException as exc:
            print(
                f"could not record {event}: {type(exc).__name__}: {exc}",
                file=sys.stderr,
                flush=True,
            )

    def handle_termination(self, signum: int, _frame: object) -> None:
        if self.termination_requested:
            return
        self.termination_requested = True
        raise SupervisorTermination(signum)

    def shutdown(self, reason: str = "stop_file") -> None:
        """Best-effort cleanup that keeps trying after logging/signal errors."""

        if self.shutdown_attempted:
            return
        self.shutdown_attempted = True
        cleanup_errors: list[str] = []

        def record_error(stage: str, exc: BaseException) -> None:
            cleanup_errors.append(f"{stage}: {type(exc).__name__}: {exc}")

        try:
            self.event(
                "shutdown_requested",
                stop_file=str(self.stop_file),
                reason=reason,
            )
        except BaseException as exc:
            record_error("shutdown_requested event", exc)
        for worker in self.paused_workers():
            try:
                self.resume(worker)
            except BaseException as exc:
                record_error(f"resume {worker.task['id']}", exc)
        for worker in list(self.workers.values()):
            try:
                self.safe_signal(worker, signal.SIGTERM)
            except BaseException as exc:
                record_error(f"terminate {worker.task['id']}", exc)
        deadline = time.time() + 30
        try:
            while time.time() < deadline and any(
                self.worker_session_alive(worker) for worker in self.workers.values()
            ):
                time.sleep(1)
        except BaseException as exc:
            record_error("termination wait", exc)
        stragglers = [
            {
                "task": worker.task["id"],
                "pid": worker.worker_pid,
                "pgid": worker.pgid,
                "guardian_pid": worker.process.pid,
            }
            for worker in self.workers.values()
            if self.worker_session_alive(worker)
        ]
        for worker in self.workers.values():
            try:
                worker.log_handle.close()
            except BaseException as exc:
                record_error(f"close log {worker.task['id']}", exc)
        try:
            self.event(
                "shutdown_complete",
                reason=reason,
                stragglers=stragglers,
                cleanup_errors=cleanup_errors,
            )
        except BaseException as exc:
            record_error("shutdown_complete event", exc)
        try:
            atomic_json(
                self.run_dir / "stopped.json",
                {
                    "time": time.time(),
                    "reason": reason,
                    "stragglers": stragglers,
                    "cleanup_errors": cleanup_errors,
                },
            )
        except BaseException as exc:
            record_error("stopped receipt", exc)
        if cleanup_errors:
            print(
                "supervisor cleanup warnings: " + "; ".join(cleanup_errors),
                file=sys.stderr,
                flush=True,
            )

    def run_loop(self) -> int:
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
                "protected_pid": self.args.protected_pid,
                "protected_root": str(self.args.protected_root),
                "protected_command_patterns": self.args.protected_command_pattern,
                "protected_finish_confirmations": self.args.protected_finish_confirmations,
                "governor_type": "sampled admission control",
                "instantaneous_total_cpu_ceiling_guaranteed": False,
                "worker_parent_liveness_guardians": True,
            },
        )
        self.event("supervisor_started", pid=os.getpid(), tasks=len(self.pending))
        while True:
            if self.stop_file.exists():
                self.shutdown("stop_file")
                return 0
            self.reap()
            self.update_protected()
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

    def run(self) -> int:
        self.run_lock.acquire()
        previous_handlers: dict[signal.Signals, object] = {}
        try:
            for signum in (signal.SIGTERM, signal.SIGINT):
                previous_handlers[signum] = signal.getsignal(signum)
                signal.signal(signum, self.handle_termination)
            try:
                return self.run_loop()
            except SupervisorTermination as exc:
                self.best_effort_event(
                    "supervisor_termination_requested",
                    signal=exc.signum,
                )
                self.shutdown(f"signal_{exc.signum}")
                return 128 + exc.signum
            except BaseException as exc:
                self.best_effort_event(
                    "supervisor_failed",
                    error=f"{type(exc).__name__}: {exc}",
                )
                self.shutdown(f"exception_{type(exc).__name__}")
                raise
            finally:
                if self.workers and not self.shutdown_attempted:
                    self.shutdown("supervisor_exit_with_owned_workers")
        finally:
            for signum, previous in previous_handlers.items():
                try:
                    signal.signal(signum, previous)
                except BaseException as exc:
                    print(
                        f"could not restore signal {signum}: "
                        f"{type(exc).__name__}: {exc}",
                        file=sys.stderr,
                        flush=True,
                    )
            try:
                self.run_lock.release()
            except BaseException as exc:
                print(
                    f"could not finalize supervisor lock metadata: "
                    f"{type(exc).__name__}: {exc}",
                    file=sys.stderr,
                    flush=True,
                )


def main() -> int:
    parser = argparse.ArgumentParser()
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
    parser.add_argument("--sample-seconds", type=float, default=5.0)
    args = parser.parse_args()
    args.protected_command_pattern = list(
        dict.fromkeys(
            pattern.strip()
            for pattern in args.protected_command_pattern
            if pattern.strip()
        )
    )
    if args.protected_pid <= 1:
        parser.error("--protected-pid must be greater than 1")
    if not args.protected_command_pattern:
        parser.error("at least one nonempty --protected-command-pattern is required")
    if args.protected_finish_confirmations < 1:
        parser.error("--protected-finish-confirmations must be positive")
    if args.sample_seconds <= 0:
        parser.error("--sample-seconds must be positive")
    return Supervisor(args).run()


if __name__ == "__main__":
    raise SystemExit(main())
