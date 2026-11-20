#!/usr/bin/env python3
"""Tests for deterministic stage-2 endpoint analysis."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


WORKSTREAM = Path(__file__).resolve().parents[1]
SCRIPT = WORKSTREAM / "src" / "analyze_stage2.py"
SPEC = importlib.util.spec_from_file_location("analyze_stage2", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class AnalyzeStage2Test(unittest.TestCase):
    def test_current_run_passes(self) -> None:
        analysis = MODULE.analyze()
        self.assertTrue(analysis["checks"]["all_checks_passed"])
        self.assertEqual(analysis["run_audit"]["failed_tasks"], 0)
        self.assertLessEqual(
            MODULE.Decimal(analysis["stability"]["max_scaled_difference"]),
            MODULE.STABILITY_TOLERANCE,
        )
        self.assertEqual(analysis["degree19"]["largest_cost_term_old_degree"], 17)
        self.assertGreater(
            MODULE.Decimal(analysis["degree19"]["largest_cost_fraction"]),
            MODULE.Decimal("0.7"),
        )

    def test_cli_output(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "analysis.json"
            run = subprocess.run(
                [sys.executable, str(SCRIPT), "--output", str(output)],
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertEqual(run.returncode, 0, run.stderr)
            payload = json.loads(output.read_text())
            self.assertEqual(payload["status"], "finite_endpoint_border_analysis")
            self.assertTrue(payload["stability"]["passed"])


if __name__ == "__main__":
    unittest.main()
