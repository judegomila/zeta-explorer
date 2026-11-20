#!/usr/bin/env python3
"""Focused tests for the finite paid-twin endpoint border falsifier."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import mpmath as mp


WORKSTREAM = Path(__file__).resolve().parents[1]
SCRIPT = WORKSTREAM / "src" / "paid_twin_border_falsifier.py"
SPEC = importlib.util.spec_from_file_location("paid_twin_border_falsifier", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class PaidTwinBorderFalsifierTest(unittest.TestCase):
    def test_explicit_ldl_forcing_coordinates(self) -> None:
        mp.mp.dps = 100
        lower_expected = [
            [mp.mpf(1), mp.mpf(0), mp.mpf(0)],
            [mp.mpf(2), mp.mpf(1), mp.mpf(0)],
            [mp.mpf(-1), mp.mpf(3), mp.mpf(1)],
        ]
        pivots_expected = [mp.mpf(2), mp.mpf(5), mp.mpf(7)]
        matrix = [
            [
                mp.fsum(
                    lower_expected[row][index]
                    * pivots_expected[index]
                    * lower_expected[column][index]
                    for index in range(3)
                )
                for column in range(3)
            ]
            for row in range(3)
        ]
        vector = [mp.mpf(4), mp.mpf(1), mp.mpf(-2)]
        energy, lower, pivots, eta, terms = MODULE.inverse_energy_from_ldlt(
            matrix, vector
        )
        self.assertEqual(pivots, pivots_expected)
        self.assertEqual(eta, [mp.mpf(4), mp.mpf(-7), mp.mpf(23)])
        self.assertEqual(energy, mp.fsum(terms))
        direct = MODULE.dot(vector, MODULE.lu_solve(matrix, vector))
        self.assertLess(MODULE.relative_error(energy, direct), mp.mpf("1e-90"))
        self.assertLess(
            MODULE.ldl_reconstruction_relative_error(matrix, lower, pivots),
            mp.mpf("1e-90"),
        )

    def test_sha_bound_archived_endpoint_reconstruction(self) -> None:
        payload = MODULE.run_endpoint_reconstruction(dps=120, max_seconds=30)
        self.assertEqual(payload["status"], MODULE.STATUS)
        self.assertEqual(payload["mode"], MODULE.MODE)
        self.assertTrue(payload["checks"]["all_checks_passed"])
        self.assertTrue(payload["checks"]["all_archived_gain_overlap"])
        self.assertTrue(payload["checks"]["all_archived_cost_overlap"])
        self.assertTrue(payload["checks"]["all_archived_surplus_overlap"])
        self.assertIn(
            "v20's raw plus-minus divided by a is 2D",
            payload["normalization_audit"]["factor_of_two_convention"],
        )
        self.assertEqual(
            [row["degree"] for row in payload["rungs"]],
            list(range(3, 20, 2)),
        )
        by_degree = {row["degree"]: row for row in payload["rungs"]}
        self.assertLess(
            abs(
                mp.mpf(by_degree[3]["reconstruction"]["innovation_derivative_gain"])
                - mp.mpf("0.48403338508028953959939563664514437547")
            ),
            mp.mpf("1e-38"),
        )
        self.assertLess(
            abs(
                mp.mpf(by_degree[3]["reconstruction"]["target_inverse_cost_direct"])
                - mp.mpf("0.089741489294260720487383120907217562996")
            ),
            mp.mpf("1e-39"),
        )
        self.assertLess(
            abs(
                mp.mpf(by_degree[19]["target_ldl"]["pivots_s"][-1])
                - mp.mpf("0.0004596904801786960028150590726814593884")
            ),
            mp.mpf("1e-42"),
        )
        self.assertLess(
            abs(
                mp.mpf(by_degree[19]["reconstruction"]["surplus_sigma_direct"])
                - mp.mpf(
                    "0.0001603271592433081306729516189804341087476146946989895665"
                )
            ),
            mp.mpf("1e-58"),
        )
        for row in payload["rungs"]:
            size = row["old_block_size"]
            self.assertEqual(len(row["target_ldl"]["pivots_s"]), size)
            self.assertEqual(
                len(row["target_ldl"]["forcing_innovations_eta"]), size
            )
            self.assertTrue(row["archive_overlap"]["gain"])
            self.assertTrue(row["archive_overlap"]["cost"])
            self.assertTrue(row["archive_overlap"]["surplus"])
            self.assertFalse(
                row["v20_raw_two_D_archive_overlap_expected_false"]["gain"]
            )
            self.assertFalse(
                row["v20_raw_two_D_archive_overlap_expected_false"]["cost"]
            )
            self.assertTrue(all(row["checks"].values()))

        replay = MODULE.run_endpoint_reconstruction(dps=180, max_seconds=30)
        replay_by_degree = {row["degree"]: row for row in replay["rungs"]}
        for degree, primary_row in by_degree.items():
            replay_row = replay_by_degree[degree]
            for field in (
                "innovation_derivative_gain",
                "target_inverse_cost_direct",
                "surplus_sigma_direct",
            ):
                self.assertLess(
                    abs(
                        mp.mpf(primary_row["reconstruction"][field])
                        - mp.mpf(replay_row["reconstruction"][field])
                    ),
                    mp.mpf("1e-100"),
                )
            for primary_eta, replay_eta in zip(
                primary_row["target_ldl"]["forcing_innovations_eta"],
                replay_row["target_ldl"]["forcing_innovations_eta"],
            ):
                self.assertLess(
                    abs(mp.mpf(primary_eta) - mp.mpf(replay_eta)), mp.mpf("1e-100")
                )

    def test_hash_tamper_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            tampered = Path(directory) / "egf.json"
            document = json.loads(MODULE.DEFAULT_EGF_MANIFEST.read_text(encoding="ascii"))
            document["scope"] = "tampered"
            tampered.write_text(json.dumps(document), encoding="ascii")
            with self.assertRaisesRegex(ValueError, "SHA-256 mismatch for egf_manifest"):
                MODULE.run_endpoint_reconstruction(
                    egf_manifest=tampered,
                    dps=100,
                    max_seconds=30,
                )

    def test_cli_uses_script_relative_inputs_and_atomic_output(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            output = root / "endpoint.json"
            result = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPT),
                    "--dps",
                    "100",
                    "--max-seconds",
                    "30",
                    "--max-output-bytes",
                    str(1024 * 1024),
                    "--output",
                    str(output),
                ],
                cwd=root,
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            payload = json.loads(output.read_text(encoding="ascii"))
            self.assertTrue(payload["checks"]["all_checks_passed"])
            self.assertLess(output.stat().st_size, 1024 * 1024)
            self.assertFalse(list(root.glob(f".{output.name}.*.tmp")))


if __name__ == "__main__":
    unittest.main()
