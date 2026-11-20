#!/usr/bin/env python3
"""Regression tests for the governed modular N=1 payment queue."""

from __future__ import annotations

import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


WORKSTREAM = Path(__file__).resolve().parents[1]
CHECKPOINT = WORKSTREAM.parents[1]
WORKER = WORKSTREAM / "src" / "certify_modular_n1_payment_interval.py"
MANIFEST = WORKSTREAM / "tasks-modular-n1-payment.json"
SUPERVISOR = (
    CHECKPOINT / "workstreams" / "regional-degree-sweep" / "src" / "supervisor.py"
)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_supervisor():
    spec = importlib.util.spec_from_file_location("modular_queue_supervisor", SUPERVISOR)
    if spec is None or spec.loader is None:
        raise RuntimeError("could not load supervisor module")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def load_worker():
    spec = importlib.util.spec_from_file_location("modular_n1_payment_worker", WORKER)
    if spec is None or spec.loader is None:
        raise RuntimeError("could not load modular payment worker")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    sys.path.insert(0, str(WORKER.parent))
    try:
        spec.loader.exec_module(module)
    finally:
        sys.path.pop(0)
    return module


class ModularN1PaymentQueueTest(unittest.TestCase):
    def setUp(self) -> None:
        self.manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

    def test_manifest_enforces_worker_and_terminal_verdicts(self) -> None:
        worker_digest = sha256(WORKER)
        self.assertEqual(self.manifest["worker_binding"]["sha256"], worker_digest)
        for binding in self.manifest["input_bindings"].values():
            path = CHECKPOINT / binding["path"]
            self.assertEqual(binding["sha256"], sha256(path))
        theorem_digest = self.manifest["input_bindings"]["payment_theorem_note"][
            "sha256"
        ]
        accepted = {
            "PASS_STRONG_PAYMENT_UNIFORM_0_TO_1_OVER_4",
            "STRONG_PAYMENT_REFUTED_ON_INTERVAL_CELL",
            "UNRESOLVED_INTERVAL_OVERLAP",
        }
        for task in self.manifest["tasks"]:
            self.assertEqual(set(task["accepted_verdicts"]), accepted)
            argv = task["argv"]
            index = argv.index("--expected-source-sha256")
            self.assertEqual(argv[index + 1], worker_digest)
            theorem_index = argv.index("--expected-theorem-note-sha256")
            self.assertEqual(argv[theorem_index + 1], theorem_digest)

    def test_exact_dyadic_cells_do_not_leak_outside_proof_domain(self) -> None:
        worker = load_worker()
        first_h = worker.exact_dyadic_cell(0, 4096, 0)
        last_h = worker.exact_dyadic_cell(4095, 4096, 0)
        first_a = worker.exact_dyadic_cell(0, 64, 3)
        last_a = worker.exact_dyadic_cell(63, 64, 3)
        self.assertEqual(first_h.lower(), 0)
        self.assertEqual(last_h.upper(), 2)
        self.assertEqual(first_a.lower(), 0)
        self.assertEqual(last_a.upper(), worker.arb(1) / 4)

    def test_binding_mismatch_is_atomic_nonzero_and_not_restart_complete(self) -> None:
        task = self.manifest["tasks"][0]
        argv = list(task["argv"])
        source_index = argv.index("--expected-source-sha256")
        argv[source_index + 1] = "0" * 64
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "diagnostic.json"
            run = subprocess.run(
                [sys.executable, str(WORKER), *argv, "--output", str(output)],
                cwd=CHECKPOINT,
                text=True,
                capture_output=True,
                check=False,
            )
            self.assertEqual(run.returncode, 2, run.stderr)
            self.assertTrue(output.is_file())
            self.assertEqual(list(output.parent.glob(f".{output.name}.*.tmp")), [])
            payload = json.loads(output.read_text(encoding="utf-8"))
            self.assertEqual(payload["verdict"], "INPUT_BINDING_MISMATCH")
            self.assertIn("source", payload["binding_mismatch"])
            self.assertEqual(payload["source_sha256"], sha256(WORKER))

            supervisor = load_supervisor()
            self.assertFalse(supervisor.result_is_complete(output, task))

            payload["verdict"] = "INTERNAL_INCOMPLETE"
            output.write_text(json.dumps(payload), encoding="utf-8")
            self.assertFalse(supervisor.result_is_complete(output, task))

    def test_hardened_theorem_note_is_runtime_bound(self) -> None:
        task = self.manifest["tasks"][0]
        argv = list(task["argv"])
        theorem_index = argv.index("--expected-theorem-note-sha256")
        argv[theorem_index + 1] = "f" * 64
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "theorem-diagnostic.json"
            run = subprocess.run(
                [sys.executable, str(WORKER), *argv, "--output", str(output)],
                cwd=CHECKPOINT,
                text=True,
                capture_output=True,
                check=False,
            )
            self.assertEqual(run.returncode, 2, run.stderr)
            payload = json.loads(output.read_text(encoding="utf-8"))
            self.assertEqual(payload["verdict"], "INPUT_BINDING_MISMATCH")
            self.assertIn("theorem_note", payload["binding_mismatch"])


if __name__ == "__main__":
    unittest.main()
