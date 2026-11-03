#!/usr/bin/env python3
"""Tests for the governed one-task M0 manifest and supervisor receipt audit."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest


WORKSTREAM = Path(__file__).resolve().parents[1]


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


GENERATOR = load_module(
    "generate_m0_task", WORKSTREAM / "src" / "generate_m0_task.py"
)
ANALYZER = load_module(
    "analyze_m0_inertia_for_test", WORKSTREAM / "src" / "analyze_m0_inertia.py"
)
SUPERVISOR = load_module(
    "regional_supervisor_for_m0_test",
    WORKSTREAM.parents[0] / "regional-degree-sweep" / "src" / "supervisor.py",
)


class GenerateM0TaskTest(unittest.TestCase):
    def test_manifest_is_one_sha_bound_parameter_replay_task(self) -> None:
        manifest = GENERATOR.build_manifest()
        self.assertEqual(manifest["schema_version"], GENERATOR.SCHEMA_VERSION)
        self.assertEqual(manifest["resource_contract"]["tasks"], 1)
        self.assertFalse(manifest["replay_contract"]["independent_algorithm"])
        self.assertEqual(len(manifest["tasks"]), 1)
        task = manifest["tasks"][0]
        self.assertEqual(task["id"], GENERATOR.TASK_ID)
        self.assertEqual(task["expected_status"], "finite_floating_m0_inertia_diagnostic")
        self.assertEqual(task["expected_parameters"], {
            "primary": GENERATOR.PARAMETERS["primary"],
            "replay": GENERATOR.PARAMETERS["replay"],
        })
        self.assertIn("--primary-h-cutoff", task["argv"])
        self.assertIn("--replay-h-cutoff", task["argv"])
        self.assertIn("--primary-t-extent", task["argv"])
        self.assertIn("--replay-t-extent", task["argv"])
        self.assertEqual(
            Path(manifest["python_binding"]["path"]).resolve(),
            Path(GENERATOR.REQUIRED_PYTHON).resolve(),
        )
        self.assertEqual(
            manifest["worker_binding"]["sha256"],
            GENERATOR.sha256(GENERATOR.CHECKPOINT_ROOT / GENERATOR.WORKER),
        )
        self.assertEqual(manifest, GENERATOR.build_manifest())
        self.assertEqual(
            manifest,
            json.loads((WORKSTREAM / "tasks-m0-inertia.json").read_text()),
        )

    def test_generic_supervisor_accepts_worker_completion_contract(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            result = Path(directory) / "result.json"
            task = GENERATOR.build_manifest()["tasks"][0]
            result.write_text(
                json.dumps(
                    {
                        "status": task["expected_status"],
                        "parameters": task["expected_parameters"],
                    }
                ),
                encoding="utf-8",
            )
            self.assertTrue(SUPERVISOR.result_is_complete(result, task))

    def test_synthetic_supervisor_receipt_binds_task_worker_and_result(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            result = root / "result.json"
            result.write_text('{"synthetic":true}\n', encoding="ascii")
            manifest = GENERATOR.build_manifest()
            task = manifest["tasks"][0]
            task["output"] = str(result.resolve())
            tasks_path = root / "tasks.json"
            tasks_path.write_text(
                json.dumps(manifest, indent=2, sort_keys=True) + "\n",
                encoding="utf-8",
            )
            run_dir = root / "run"
            run_dir.mkdir()
            result_sha = ANALYZER.file_sha256(result)
            receipt = {
                "task": task["id"],
                "returncode": 0,
                "output": str(result.resolve()),
                "sha256": result_sha,
            }
            (run_dir / "completed.jsonl").write_text(
                json.dumps(receipt, sort_keys=True) + "\n", encoding="utf-8"
            )
            command = [
                sys.executable,
                str(ANALYZER.WORKER_PATH.resolve()),
                *task["argv"],
                "--output",
                str(result.resolve()),
                "--progress",
            ]
            events = [
                {"event": "supervisor_started"},
                {
                    "event": "worker_started",
                    "task": task["id"],
                    "command": command,
                },
                {
                    "event": "worker_completed",
                    "task": task["id"],
                    "returncode": 0,
                    "output": str(result.resolve()),
                    "sha256": result_sha,
                },
                {"event": "queue_complete"},
            ]
            (run_dir / "events.jsonl").write_text(
                "".join(json.dumps(row, sort_keys=True) + "\n" for row in events),
                encoding="utf-8",
            )
            worker = ANALYZER.load_worker()
            audit = ANALYZER.validate_governed_run(
                worker=worker,
                result_path=result,
                tasks_path=tasks_path,
                run_dir=run_dir,
            )
            self.assertEqual(audit["task_id"], task["id"])
            self.assertEqual(audit["result_sha256"], result_sha)
            self.assertEqual(audit["forbidden_events_observed"], [])
            self.assertFalse(audit["failed_receipts_file_present"])
            self.assertIsNone(audit["failed_receipts_sha256"])

            (run_dir / "failed.jsonl").write_text(
                json.dumps({"task": task["id"], "returncode": 1}) + "\n",
                encoding="utf-8",
            )
            with self.assertRaisesRegex(ValueError, "failed receipts"):
                ANALYZER.validate_governed_run(
                    worker=worker,
                    result_path=result,
                    tasks_path=tasks_path,
                    run_dir=run_dir,
                )
            (run_dir / "failed.jsonl").unlink()

            events.insert(2, {"event": "signal", "task": task["id"]})
            (run_dir / "events.jsonl").write_text(
                "".join(json.dumps(row, sort_keys=True) + "\n" for row in events),
                encoding="utf-8",
            )
            with self.assertRaisesRegex(ValueError, "forbidden events"):
                ANALYZER.validate_governed_run(
                    worker=worker,
                    result_path=result,
                    tasks_path=tasks_path,
                    run_dir=run_dir,
                )


if __name__ == "__main__":
    unittest.main()
