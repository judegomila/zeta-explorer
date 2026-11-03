#!/usr/bin/env python3
"""Check generic analytic-task validation without starting processes."""

from __future__ import annotations

import importlib.util
import json
import sys
import tempfile
from pathlib import Path


CHECKPOINT = Path(__file__).resolve().parents[3]
SUPERVISOR = (
    CHECKPOINT
    / "workstreams"
    / "regional-degree-sweep"
    / "src"
    / "supervisor.py"
)
SPEC = importlib.util.spec_from_file_location("shared_governor", SUPERVISOR)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)

task = {
    "expected_status": "analytic_pattern_experiment",
    "expected_parameters": {"n": 4, "parity": "even", "h": "0", "dps": 276},
}
with tempfile.TemporaryDirectory() as directory:
    output = Path(directory) / "result.json"
    output.write_text(
        json.dumps(
            {
                "status": "analytic_pattern_experiment",
                "parameters": {"n": 4, "parity": "even", "h": "0", "dps": 276},
            }
        ),
        encoding="utf-8",
    )
    assert MODULE.result_is_complete(output, task)
    task["expected_parameters"]["n"] = 6
    assert not MODULE.result_is_complete(output, task)

print("generic analytic-task governor validation: PASS")
