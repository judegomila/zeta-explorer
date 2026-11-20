#!/usr/bin/env python3
"""Focused tests for the exact EGF identity worker."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


WORKSTREAM = Path(__file__).resolve().parents[1]
SCRIPT = WORKSTREAM / "src" / "egf_identity.py"
OLD_WORKSTREAM = WORKSTREAM.parent / "all-degree-analytic-search"
STRUCTURAL_SCRIPT = OLD_WORKSTREAM / "src" / "structural_generator.py"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


EGF = load_module("egf_identity", SCRIPT)
STRUCTURAL = load_module("structural_generator_for_egf_test", STRUCTURAL_SCRIPT)


class EgfIdentityTest(unittest.TestCase):
    def make_manifest(self, path: Path, degree: int = 16) -> None:
        document = STRUCTURAL.generate_document(degree, STRUCTURAL.Limits())
        path.write_text(
            json.dumps(document, indent=2, sort_keys=True) + "\n",
            encoding="ascii",
        )

    def test_exact_payload_matches_independent_manifest(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            manifest = Path(directory) / "structure.json"
            self.make_manifest(manifest)
            payload = EGF.build_payload(
                full_polynomial_degree=12,
                scalar_degree=16,
                structural_result=manifest,
                sample_z=[
                    EGF.Fraction(0),
                    EGF.Fraction(1),
                    EGF.Fraction(2),
                    EGF.Fraction(3),
                ],
            )
            self.assertEqual(payload["status"], "exact_egf_identity")
            self.assertEqual(
                payload["parameters"],
                {"full_polynomial_degree": 12, "scalar_degree": 16},
            )
            self.assertTrue(payload["checks"]["all_exact_checks_passed"])
            self.assertTrue(all(payload["checks"].values()))
            self.assertEqual(
                payload["normalization_audit"]["odd_center_common_prefactor"],
                "4/4=1",
            )
            self.assertEqual(
                payload["normalization_audit"]["even_center"],
                "ell(A)=-Psi_A'(0)/q''(0)",
            )

    def test_cli_atomic_bounded_output(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            manifest = root / "structure.json"
            output = root / "egf.json"
            self.make_manifest(manifest)
            result = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPT),
                    "--full-polynomial-degree",
                    "8",
                    "--scalar-degree",
                    "16",
                    "--structural-result",
                    str(manifest),
                    "--sample-z",
                    "0",
                    "--sample-z",
                    "1",
                    "--sample-z",
                    "2",
                    "--sample-z",
                    "3",
                    "--max-output-bytes",
                    "1048576",
                    "--output",
                    str(output),
                ],
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertLess(output.stat().st_size, 1_048_576)
            payload = json.loads(output.read_text(encoding="ascii"))
            self.assertEqual(payload["status"], "exact_egf_identity")
            self.assertTrue(payload["checks"]["all_exact_checks_passed"])
            self.assertFalse(list(root.glob(f".{output.name}.*.tmp")))

    def test_output_guard_preserves_existing_file(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            manifest = root / "structure.json"
            output = root / "egf.json"
            self.make_manifest(manifest)
            sentinel = b'{"sentinel":true}\n'
            output.write_bytes(sentinel)
            payload = EGF.build_payload(
                full_polynomial_degree=8,
                scalar_degree=16,
                structural_result=manifest,
                sample_z=[EGF.Fraction(0)],
            )
            with self.assertRaises(ValueError):
                EGF.atomic_write_json(output, payload, 64)
            self.assertEqual(output.read_bytes(), sentinel)
            self.assertFalse(list(root.glob(f".{output.name}.*.tmp")))


if __name__ == "__main__":
    unittest.main()
