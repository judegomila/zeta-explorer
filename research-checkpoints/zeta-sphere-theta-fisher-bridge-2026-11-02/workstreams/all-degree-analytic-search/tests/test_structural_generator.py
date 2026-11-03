#!/usr/bin/env python3
"""Smoke tests for the exact graded structural generator."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "src" / "structural_generator.py"
SPEC = importlib.util.spec_from_file_location("structural_generator", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class StructuralGeneratorSmokeTest(unittest.TestCase):
    def test_exact_records_and_parity_maps(self) -> None:
        document = MODULE.generate_document(12, MODULE.Limits())
        self.assertEqual(document["status"], "exact_structural_identity")
        self.assertEqual(document["parameters"], {"degree": 12})
        self.assertTrue(document["checks"]["all_exact_checks_passed"])
        self.assertEqual(document["grades"][1]["a_coefficients_ascending"], ["9/2", "-2"])
        self.assertEqual(document["grades"][1]["c"], "6")
        self.assertEqual(document["grades"][1]["ell_a"], "-6")
        self.assertEqual(
            [record["c"] for record in document["grades"]],
            [
                "0",
                "6",
                "6",
                "-195/2",
                "-489",
                "9543/8",
                "223329/8",
                "3759969/32",
                "-7245537/8",
                "-2110513461/128",
                "-9852077985/128",
                "427131019461/512",
                "4629114791925/256",
            ],
        )
        self.assertEqual(
            document["parity_maps"]["even"]["slot_to_grade"],
            [0, 2, 4, 6, 8, 10, 12],
        )
        self.assertEqual(
            document["parity_maps"]["odd"]["slot_to_grade"], [1, 3, 5, 7, 9, 11]
        )
        self.assertEqual(len(document["hashes"]["content_sha256"]), 64)

    def test_cli_atomic_json_and_small_stdout(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "structural.json"
            result = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPT),
                    "--degree",
                    "8",
                    "--output",
                    str(output),
                ],
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertLess(len(result.stdout), 1024)
            payload = json.loads(output.read_text(encoding="ascii"))
            self.assertEqual(payload["status"], "exact_structural_identity")
            self.assertEqual(payload["parameters"]["degree"], 8)
            self.assertFalse(list(output.parent.glob(f".{output.name}.*.tmp")))

    def test_failed_output_guard_preserves_existing_file(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "structural.json"
            sentinel = '{"sentinel":true}\n'
            output.write_text(sentinel, encoding="ascii")
            result = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPT),
                    "--degree",
                    "8",
                    "--output",
                    str(output),
                    "--max-output-bytes",
                    "64",
                    "--min-free-bytes-after-write",
                    "1",
                ],
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 2)
            self.assertEqual(output.read_text(encoding="ascii"), sentinel)
            self.assertFalse(list(output.parent.glob(f".{output.name}.*.tmp")))


if __name__ == "__main__":
    unittest.main()
