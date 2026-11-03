#!/usr/bin/env python3
"""Tests for the gated next-stage queue generator."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "src" / "generate_tasks.py"
SPEC = importlib.util.spec_from_file_location("next_queue_generator", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class QueueGeneratorTest(unittest.TestCase):
    def test_stage0_is_one_exact_gate(self) -> None:
        tasks = MODULE.build_stage0_tasks()
        self.assertEqual(len(tasks), 1)
        task = tasks[0]
        self.assertEqual(task["id"], "egf_identity_j128")
        self.assertEqual(task["expected_status"], "exact_egf_identity")
        self.assertIn("--max-output-bytes", task["argv"])

    def test_stage1_has_ten_primary_and_four_replays(self) -> None:
        tasks = MODULE.build_stage1_tasks()
        self.assertEqual(len(tasks), 14)
        self.assertEqual(len({task["id"] for task in tasks}), 14)
        replay = [task for task in tasks if "_replay_" in task["id"]]
        self.assertEqual(len(replay), 4)
        self.assertEqual(
            {task["expected_parameters"]["scale_grid"] for task in tasks},
            {MODULE.SCALE_GRID_ID},
        )
        for task in tasks:
            self.assertEqual(task["argv"].count("--scaled-h"), 6)
            self.assertIn("--max-seconds", task["argv"])
            self.assertIn("--max-output-bytes", task["argv"])
            self.assertEqual(task["expected_parameters"]["max_orbit"], 96)

    def test_manifest_gate_rejects_failure_and_accepts_exact_pass(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "egf.json"
            payload = {
                "status": "exact_egf_identity",
                "parameters": {
                    "full_polynomial_degree": 64,
                    "scalar_degree": 128,
                },
                "checks": {"all_exact_checks_passed": False},
            }
            path.write_text(json.dumps(payload), encoding="utf-8")
            with self.assertRaises(ValueError):
                MODULE.validate_egf_manifest(path)
            payload["checks"]["all_exact_checks_passed"] = True
            path.write_text(json.dumps(payload), encoding="utf-8")
            accepted, digest = MODULE.validate_egf_manifest(path)
            self.assertTrue(accepted["checks"]["all_exact_checks_passed"])
            self.assertEqual(len(digest), 64)

            output = Path(directory) / "tasks.json"
            result = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPT),
                    "--stage",
                    "stage1",
                    "--egf-manifest",
                    str(path),
                    "--output",
                    str(output),
                ],
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            queue = json.loads(output.read_text(encoding="utf-8"))
            self.assertEqual(queue["egf_manifest"], str(path))
            self.assertEqual(queue["egf_manifest_sha256"], digest)


if __name__ == "__main__":
    unittest.main()
