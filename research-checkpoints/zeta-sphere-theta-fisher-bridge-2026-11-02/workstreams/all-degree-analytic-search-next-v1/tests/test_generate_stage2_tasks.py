#!/usr/bin/env python3
"""Tests for the bounded stage-2 endpoint queue."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


WORKSTREAM = Path(__file__).resolve().parents[1]
SCRIPT = WORKSTREAM / "src" / "generate_stage2_tasks.py"
SPEC = importlib.util.spec_from_file_location("generate_stage2_tasks", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class GenerateStage2TasksTest(unittest.TestCase):
    def test_manifest_is_bounded_and_hash_bound(self) -> None:
        manifest = MODULE.build_manifest()
        self.assertEqual(manifest["schema_version"], MODULE.SCHEMA_VERSION)
        self.assertEqual(manifest["resource_contract"]["tasks"], 2)
        self.assertEqual(len(manifest["input_bindings"]), 4)
        self.assertEqual(
            [task["expected_parameters"]["dps"] for task in manifest["tasks"]],
            [120, 180],
        )
        self.assertTrue(
            all(task["worker"] == MODULE.WORKER for task in manifest["tasks"])
        )
        self.assertTrue(
            all("--max-seconds" in task["argv"] for task in manifest["tasks"])
        )
        self.assertTrue(
            all(
                task["expected_status"] == "finite_endpoint_border_diagnostic"
                for task in manifest["tasks"]
            )
        )

    def test_cli_is_deterministic(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            first = Path(directory) / "first.json"
            second = Path(directory) / "second.json"
            for output in (first, second):
                run = subprocess.run(
                    [sys.executable, str(SCRIPT), "--output", str(output)],
                    check=False,
                    capture_output=True,
                    text=True,
                )
                self.assertEqual(run.returncode, 0, run.stderr)
            self.assertEqual(first.read_bytes(), second.read_bytes())
            payload = json.loads(first.read_text())
            self.assertEqual(
                payload["tasks"][1]["id"], "border_endpoint_replay_p180"
            )


if __name__ == "__main__":
    unittest.main()
