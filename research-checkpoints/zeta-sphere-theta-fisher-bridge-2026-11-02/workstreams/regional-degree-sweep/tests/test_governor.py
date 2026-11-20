#!/usr/bin/env python3
"""Dependency-free tests for the fail-safe sampled governor."""

from __future__ import annotations

import argparse
import json
import os
import signal
import subprocess
import sys
import tempfile
import time
import types
from pathlib import Path
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from supervisor import (  # noqa: E402
    LOCK_TARGET,
    RunDirectoryLock,
    SupervisorTermination,
    UNLOCK_TARGET,
    Supervisor,
    advance_protected_state,
    classify_protected_snapshot,
    command_matches,
    parse_lock_output,
    parse_process_table,
    path_is_within,
    result_is_complete,
    validate_task_manifest,
)


def expect_value_error(callable_object) -> None:
    try:
        callable_object()
    except ValueError:
        return
    raise AssertionError("expected ValueError")


def wait_until(predicate, timeout: float = 10.0) -> bool:
    deadline = time.time() + timeout
    while time.time() < deadline:
        if predicate():
            return True
        time.sleep(0.05)
    return bool(predicate())


def pid_exists(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    return True


def main() -> int:
    assert parse_lock_output(
        '"IOConsoleLocked" = Yes\n"CGSSessionScreenIsLocked"=Yes'
    )[0] == "locked"
    assert parse_lock_output(
        '"IOConsoleLocked" = No\n"CGSSessionScreenIsLocked"=No'
    )[0] == "unlocked"
    assert parse_lock_output(
        '"IOConsoleLocked" = Yes\n"CGSSessionScreenIsLocked"=No'
    )[0] == "unknown"
    assert parse_lock_output('"IOConsoleLocked" = No')[0] == "unknown"

    governor = object.__new__(Supervisor)
    governor.lock = "locked"
    assert governor.target_percent() == LOCK_TARGET == 84.0
    governor.protected_done = False
    assert governor.hard_cap() == 5
    governor.protected_done = True
    assert governor.hard_cap() == 15
    governor.lock = "unlocked"
    assert governor.target_percent() == UNLOCK_TARGET == 42.0
    assert governor.hard_cap() == 5
    governor.lock = "unknown"
    assert governor.target_percent() == UNLOCK_TARGET == 42.0
    assert governor.hard_cap() == 5

    rows = parse_process_table(
        " 80390 /bin/bash scripts/chain19.sh\n"
        " 80401 python3 experiments/rsst-layer3/scripts/contract_guided.py\n"
    )
    assert rows[0] == (80390, "/bin/bash scripts/chain19.sh")
    assert command_matches(rows[0][1], ["scripts/chain19.sh"])
    assert not command_matches(rows[0][1], ["scripts/chain18.sh"])
    assert path_is_within("/protected/root/nested", "/protected/root")
    assert not path_is_within("/protected/root-other", "/protected/root")

    root = "/protected/root"

    def cwd_lookup(cwds: dict[int, list[str] | None]):
        def lookup(pid: int) -> tuple[list[str] | None, str]:
            value = cwds.get(pid)
            return value, "test lookup" if value is not None else "test race"

        return lookup

    active, _ = classify_protected_snapshot(
        rows,
        80390,
        ["scripts/chain19.sh", "contract_guided.py"],
        root,
        cwd_lookup({80390: [root], 80401: [f"{root}/stage"]}),
    )
    assert active is True

    # The configured root PID may turn over; a matching descendant/successor
    # under the protected root must retain protected_active.
    active, _ = classify_protected_snapshot(
        [(80401, "python3 experiments/rsst-layer3/scripts/contract_guided.py")],
        80390,
        ["scripts/chain19.sh", "contract_guided.py"],
        root,
        cwd_lookup({80401: [f"{root}/stage"]}),
    )
    assert active is True

    active, _ = classify_protected_snapshot(
        [(90000, "python3 unrelated.py")],
        80390,
        ["scripts/chain19.sh", "contract_guided.py"],
        root,
        cwd_lookup({}),
    )
    assert active is False

    # PID reuse, a process-table/lsof race, or a matching primary outside the
    # expected root is uncertainty, never evidence of completion.
    active, _ = classify_protected_snapshot(
        [(80390, "python3 unrelated.py")],
        80390,
        ["scripts/chain19.sh"],
        root,
        cwd_lookup({80390: [root]}),
    )
    assert active is None
    active, _ = classify_protected_snapshot(
        [(80401, "python3 contract_guided.py")],
        80390,
        ["contract_guided.py"],
        root,
        cwd_lookup({80401: None}),
    )
    assert active is None
    active, _ = classify_protected_snapshot(
        [(80390, "/bin/bash scripts/chain19.sh")],
        80390,
        ["scripts/chain19.sh"],
        root,
        cwd_lookup({80390: ["/another/root"]}),
    )
    assert active is None

    done, misses, transition = advance_protected_state(False, 0, False, 12)
    assert (done, misses, transition) == (False, 1, "confirming_absence")
    done, misses, transition = advance_protected_state(False, 11, False, 12)
    assert (done, misses, transition) == (True, 12, "finished")
    assert advance_protected_state(False, 11, None, 12) == (
        False,
        0,
        "uncertain",
    )
    assert advance_protected_state(True, 12, True, 12) == (
        False,
        0,
        "reappeared",
    )
    assert advance_protected_state(True, 12, None, 12) == (
        False,
        0,
        "uncertain_after_finish",
    )

    with tempfile.TemporaryDirectory() as temporary:
        temporary_root = Path(temporary)
        valid_task = {
            "id": "analytic-a",
            "output": "results/a.json",
            "accepted_verdicts": ["PASS", "REFUTED", "UNRESOLVED"],
        }
        assert validate_task_manifest(
            {"tasks": [valid_task]}, temporary_root
        ) == [valid_task]
        expect_value_error(
            lambda: validate_task_manifest(
                {
                    "tasks": [
                        valid_task,
                        {"id": "analytic-a", "output": "results/b.json"},
                    ]
                },
                temporary_root,
            )
        )
        expect_value_error(
            lambda: validate_task_manifest(
                {
                    "tasks": [
                        valid_task,
                        {
                            "id": "analytic-b",
                            "output": "results/../results/a.json",
                        },
                    ]
                },
                temporary_root,
            )
        )
        expect_value_error(
            lambda: validate_task_manifest(
                {"tasks": [{"id": "escape", "output": "../escape.json"}]},
                temporary_root,
            )
        )
        expect_value_error(
            lambda: validate_task_manifest(
                {"tasks": [{"id": "../log-escape", "output": "result.json"}]},
                temporary_root,
            )
        )
        expect_value_error(
            lambda: validate_task_manifest(
                {
                    "tasks": [
                        {
                            "id": "bad-verdicts",
                            "output": "results/c.json",
                            "accepted_verdicts": [],
                        }
                    ]
                },
                temporary_root,
            )
        )

        result_path = temporary_root / "result.json"
        result_task = {
            "id": "verdict-check",
            "output": "result.json",
            "expected_status": "rigorous_check",
            "expected_parameters": {"depth": 4},
            "accepted_verdicts": ["PASS", "REFUTED", "UNRESOLVED"],
        }
        result_path.write_text(
            json.dumps(
                {
                    "status": "rigorous_check",
                    "verdict": "INPUT_BINDING_MISMATCH",
                    "parameters": {"depth": 4},
                }
            ),
            encoding="utf-8",
        )
        assert not result_is_complete(result_path, result_task)
        result_path.write_text(
            json.dumps(
                {
                    "status": "rigorous_check",
                    "verdict": "UNRESOLVED",
                    "parameters": {"depth": 4},
                }
            ),
            encoding="utf-8",
        )
        assert result_is_complete(result_path, result_task)

        run_dir = temporary_root / "singleton-run"
        first_lock = RunDirectoryLock(run_dir)
        second_lock = RunDirectoryLock(run_dir)
        first_lock.acquire()
        try:
            try:
                second_lock.acquire()
            except RuntimeError as exc:
                assert "live supervisor" in str(exc)
            else:
                raise AssertionError("second supervisor lock unexpectedly succeeded")
        finally:
            first_lock.release()
        second_lock.acquire()
        second_lock.release()

        failure_root = temporary_root / "failure-root"
        failure_root.mkdir()
        failure_run = temporary_root / "failure-run"
        manifest = temporary_root / "failure-tasks.json"
        launch_task = {
            "id": "launch-failure",
            "output": "results/launch-failure.json",
            "argv": [],
        }
        manifest.write_text(json.dumps({"tasks": [launch_task]}), encoding="utf-8")
        args = argparse.Namespace(
            root=failure_root,
            tasks=manifest,
            worker=Path("worker.py"),
            python=Path(sys.executable),
            run_dir=failure_run,
            protected_pid=12345,
            protected_root=failure_root,
            protected_command_pattern=["protected-command"],
            protected_finish_confirmations=12,
            sample_seconds=5.0,
        )
        failure_governor = Supervisor(args)
        failure_governor.workers["already-owned"] = object()  # type: ignore[assignment]
        shutdown_reasons: list[str] = []

        def fake_shutdown(self: Supervisor, reason: str = "stop_file") -> None:
            shutdown_reasons.append(reason)
            self.shutdown_attempted = True

        def fail_during_launch(self: Supervisor) -> int:
            with patch(
                "supervisor.subprocess.Popen",
                side_effect=OSError("simulated Popen failure"),
            ):
                self.launch(launch_task)
            raise AssertionError("launch unexpectedly returned")

        failure_governor.shutdown = types.MethodType(  # type: ignore[method-assign]
            fake_shutdown, failure_governor
        )
        failure_governor.run_loop = types.MethodType(  # type: ignore[method-assign]
            fail_during_launch, failure_governor
        )
        try:
            failure_governor.run()
        except OSError as exc:
            assert "simulated Popen failure" in str(exc)
        else:
            raise AssertionError("Popen failure did not escape the supervisor")
        assert shutdown_reasons == ["exception_OSError"]
        assert failure_governor.shutdown_attempted
        recovered_lock = RunDirectoryLock(failure_run)
        recovered_lock.acquire()
        recovered_lock.release()

        termination_governor = object.__new__(Supervisor)
        termination_governor.termination_requested = False
        try:
            termination_governor.handle_termination(signal.SIGTERM, None)
        except SupervisorTermination as exc:
            assert exc.signum == signal.SIGTERM
        else:
            raise AssertionError("first TERM did not enter the cleanup path")
        # A repeated TERM during cleanup must not interrupt cleanup again.
        termination_governor.handle_termination(signal.SIGTERM, None)

        guardian_source = ROOT / "src" / "worker_guardian.py"
        ready_file = temporary_root / "guardian-test" / "worker.ready.json"
        guardian_pid_file = temporary_root / "guardian-test" / "guardian.pid"
        stopped_receipt = ready_file.with_name(
            ready_file.stem + ".guardian-stopped.json"
        )
        ready_file.parent.mkdir(parents=True)
        fake_supervisor_source = (
            "import os, pathlib, subprocess, sys, time\n"
            "guardian, ready, pidfile = sys.argv[1:4]\n"
            "proc = subprocess.Popen([sys.executable, guardian, "
            "'--supervisor-pid', str(os.getpid()), '--ready-file', ready, '--', "
            "sys.executable, '-c', 'import time; time.sleep(60)'], "
            "start_new_session=True, stdout=subprocess.DEVNULL, "
            "stderr=subprocess.DEVNULL)\n"
            "pathlib.Path(pidfile).write_text(str(proc.pid), encoding='utf-8')\n"
            "time.sleep(60)\n"
        )
        fake_supervisor = subprocess.Popen(
            [
                sys.executable,
                "-c",
                fake_supervisor_source,
                str(guardian_source),
                str(ready_file),
                str(guardian_pid_file),
            ],
            start_new_session=True,
        )
        guardian_pid = 0
        worker_pid = 0
        try:
            assert wait_until(ready_file.is_file, timeout=8)
            ready = json.loads(ready_file.read_text(encoding="utf-8"))
            guardian_pid = int(ready["guardian_pid"])
            worker_pid = int(ready["worker_pid"])
            assert guardian_pid == int(guardian_pid_file.read_text(encoding="utf-8"))
            assert os.getpgid(worker_pid) == worker_pid
            assert os.getsid(worker_pid) == worker_pid

            # Simulate the hardest ordinary case: the governed worker is
            # paused, then its supervisor dies before it can run cleanup.
            os.killpg(worker_pid, signal.SIGSTOP)
            fake_supervisor.kill()
            fake_supervisor.wait(timeout=5)
            assert wait_until(stopped_receipt.is_file, timeout=15)
            stopped = json.loads(stopped_receipt.read_text(encoding="utf-8"))
            assert stopped["reason"] == "supervisor_parent_disappeared"
            assert "SIGCONT" in stopped["signals_sent"]
            assert "SIGTERM" in stopped["signals_sent"]
            assert wait_until(lambda: not pid_exists(worker_pid), timeout=5)
            assert wait_until(lambda: not pid_exists(guardian_pid), timeout=5)
        finally:
            if fake_supervisor.poll() is None:
                fake_supervisor.kill()
                fake_supervisor.wait(timeout=5)
            for owned_pid in (worker_pid, guardian_pid):
                if owned_pid <= 1:
                    continue
                try:
                    identity_matches = (
                        os.getpgid(owned_pid) == owned_pid
                        and os.getsid(owned_pid) == owned_pid
                    )
                except (ProcessLookupError, PermissionError, OSError):
                    identity_matches = False
                if identity_matches:
                    os.killpg(owned_pid, signal.SIGKILL)

    print("governor fail-safe tests: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
