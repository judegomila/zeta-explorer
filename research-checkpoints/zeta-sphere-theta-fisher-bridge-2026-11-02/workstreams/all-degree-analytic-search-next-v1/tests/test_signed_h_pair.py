#!/usr/bin/env python3
"""Focused checks for the fixed-center signed h-pair worker."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "src" / "signed_h_pair.py"
SPEC = importlib.util.spec_from_file_location("signed_h_pair", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class SignedHPairTest(unittest.TestCase):
    def manifest(self, directory: str) -> Path:
        path = Path(directory) / "egf.json"
        path.write_text(
            json.dumps(
                {
                    "status": "exact_egf_identity",
                    "parameters": {
                        "full_polynomial_degree": 64,
                        "scalar_degree": 128,
                    },
                    "checks": {"all_exact_checks_passed": True},
                    "hashes": {"content_sha256": "0" * 64},
                }
            ),
            encoding="ascii",
        )
        return path

    def test_odd_pair_and_exact_center_bound(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            payload = MODULE.run_experiment(
                n=2,
                parity="odd",
                dps=120,
                scaled_h=((1, "0.25"), (2, "0.25")),
                egf_manifest=self.manifest(directory),
                max_orbit=96,
                max_seconds=60,
            )
        self.assertEqual(payload["status"], MODULE.STATUS)
        center = payload["center_diagnostics"]
        self.assertLess(float(center["odd_observed_over_bound"]), 1.0000001)
        for row in payload["scaled_h_diagnostics"]:
            self.assertLess(float(row["paired_identity_relative_residual"]), 1e-80)
            self.assertLess(float(row["feature_parity_relative_residual"]), 1e-80)

    def test_even_lhopital_and_cli_atomic_output(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            manifest = self.manifest(directory)
            output = Path(directory) / "out.json"
            command = [
                sys.executable,
                str(SCRIPT),
                "--n", "2",
                "--parity", "even",
                "--dps", "120",
                "--egf-manifest", str(manifest),
                "--max-orbit", "96",
                "--max-seconds", "60",
                "--max-output-bytes", str(2 * 1024 * 1024),
                "--output", str(output),
            ]
            for beta, constant in MODULE.SCALE_GRID:
                command.extend(["--scaled-h", f"{beta}:{constant}"])
            result = subprocess.run(command, check=False, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            payload = json.loads(output.read_text(encoding="utf-8"))
            self.assertEqual(payload["parameters"]["scale_grid"], MODULE.SCALE_GRID_NAME)
            self.assertLess(float(payload["center_diagnostics"]["even_lhopital_relative_residual"]), 1e-80)
            self.assertFalse(list(output.parent.glob(output.name + ".tmp.*")))

    def test_manifest_status_is_required(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            manifest = Path(directory) / "bad.json"
            manifest.write_text('{"status":"wrong"}\n', encoding="ascii")
            with self.assertRaises(ValueError):
                MODULE.run_experiment(
                    n=2,
                    parity="odd",
                    dps=100,
                    scaled_h=((1, "1"),),
                    egf_manifest=manifest,
                    max_orbit=64,
                    max_seconds=30,
                )


if __name__ == "__main__":
    unittest.main()
