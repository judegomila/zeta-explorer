from __future__ import annotations

import importlib.util
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


WORKSTREAM_ROOT = Path(__file__).resolve().parents[1]
SOURCE = WORKSTREAM_ROOT / "src" / "certify_m0_boundary_jet.py"
SPEC = importlib.util.spec_from_file_location("certify_m0_boundary_jet", SOURCE)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("could not load boundary-jet certificate module")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class BoundaryJetCertificateTest(unittest.TestCase):
    def test_rigorous_obstruction_and_tail_gates(self) -> None:
        payload = MODULE.build_payload(200)
        self.assertTrue(payload["checks"]["all_checks_passed"])
        self.assertTrue(
            payload["outcome"]["one_scalar_boundary_cancellation_refuted"]
        )
        obstruction = payload["intervals"]["B4_plus_65_over_2_B2"]
        self.assertTrue(MODULE.arb(obstruction["arb"]) > 18)
        tail = payload["tail_majorants"]["q4_radius"]
        self.assertTrue(MODULE.arb(tail["arb"]) < MODULE.arb("2e-152"))

    def test_cli_output_is_deterministic(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            first = Path(directory) / "first.json"
            second = Path(directory) / "second.json"
            for output in (first, second):
                subprocess.run(
                    [
                        sys.executable,
                        str(SOURCE),
                        "--precision",
                        "200",
                        "--output",
                        str(output),
                    ],
                    check=True,
                    capture_output=True,
                    text=True,
                )
            self.assertEqual(first.read_bytes(), second.read_bytes())

    def test_precision_guard(self) -> None:
        with self.assertRaises(ValueError):
            MODULE.build_payload(64)


if __name__ == "__main__":
    unittest.main()
