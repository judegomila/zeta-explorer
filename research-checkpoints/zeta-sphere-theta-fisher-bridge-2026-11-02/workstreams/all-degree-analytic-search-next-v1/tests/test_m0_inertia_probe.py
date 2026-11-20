#!/usr/bin/env python3
"""Focused tests for the bounded floating M0 inertia diagnostic."""

from __future__ import annotations

from fractions import Fraction
import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest

import mpmath as mp


WORKSTREAM = Path(__file__).resolve().parents[1]
SCRIPT = WORKSTREAM / "src" / "m0_inertia_probe.py"
SPEC = importlib.util.spec_from_file_location("m0_inertia_probe", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class M0InertiaProbeTest(unittest.TestCase):
    def test_exact_formula_and_residue_source_mapping(self) -> None:
        inputs = MODULE.prepare_inputs(dps=100)
        self.assertTrue(all(inputs["exact_checks"].values()))
        self.assertEqual(inputs["e_coefficients"][1], Fraction(-6))
        self.assertEqual(inputs["d_coefficients"][1], Fraction(0))
        self.assertEqual(inputs["e_coefficients"][3], Fraction(195, 2))
        self.assertEqual(inputs["d_coefficients"][3], Fraction(-18))
        self.assertEqual(
            inputs["polynomials"],
            MODULE.theta_polynomials(MODULE.MAX_THETA_DEGREE),
        )
        self.assertEqual(
            tuple(
                sorted(
                    row["degree"]
                    for row in inputs["documents"]["endpoint_certificate"][
                        "results"
                    ]
                )
            ),
            MODULE.CERTIFIED_ENDPOINT_DEGREES,
        )

    def test_parent_ldl_whitening_preserves_inertia(self) -> None:
        mp.mp.dps = 100
        parent = [[mp.mpf("4"), mp.mpf("1")], [mp.mpf("1"), mp.mpf("3")]]
        metric = [[mp.mpf("2"), mp.mpf("3")], [mp.mpf("3"), mp.mpf("-1")]]
        whitened, pivots, whitening_error, ldl_error = (
            MODULE.parent_whitened_congruence(parent, metric)
        )
        ordinary_values = MODULE.symmetric_eigenvalues(metric)
        whitened_values = MODULE.symmetric_eigenvalues(whitened)
        tolerance = mp.mpf("1e-80")
        self.assertEqual(
            MODULE.inertia(ordinary_values, tolerance),
            MODULE.inertia(whitened_values, tolerance),
        )
        self.assertEqual(len(pivots), 2)
        self.assertLess(whitening_error, mp.mpf("1e-90"))
        self.assertLess(ldl_error, mp.mpf("1e-90"))

    def test_signed_square_has_ordinary_dh_measure(self) -> None:
        mp.mp.dps = 80
        h = mp.mpf("1.7")
        corrected = [mp.mpf("0.3"), mp.mpf("-0.8")]
        raw_drift = [mp.mpf("1.2"), mp.mpf("0.4")]
        x0 = [2 * h * value + drift for value, drift in zip(corrected, raw_drift)]
        y0 = list(raw_drift)
        for row in range(2):
            for column in range(2):
                signed_square = (
                    x0[row] * x0[column] - y0[row] * y0[column]
                ) / 2
                direct = (
                    2 * h * h * corrected[row] * corrected[column]
                    + h * raw_drift[row] * corrected[column]
                    + h * corrected[row] * raw_drift[column]
                )
                self.assertLess(
                    abs(signed_square - direct) / max(mp.mpf("1"), abs(direct)),
                    mp.mpf("1e-75"),
                )

    def test_old_target_gate_matches_rank_two_psd(self) -> None:
        mp.mp.dps = 100
        target = [[mp.mpf("2"), mp.mpf("0")], [mp.mpf("0"), mp.mpf("3")]]
        vector_v = [mp.mpf("0.2"), mp.mpf("-0.1")]
        vector_d = [mp.mpf("0.4"), mp.mpf("0.3")]
        inverse_v = MODULE.solve_positive(target, vector_v)
        inverse_d = MODULE.solve_positive(target, vector_d)
        gate_v = MODULE.dot(vector_v, inverse_v)
        gate_d = MODULE.dot(vector_d, inverse_d)
        gate_c = MODULE.dot(vector_v, inverse_d)
        gate_margin = 1 - (mp.sqrt(gate_v * gate_d) - gate_c)
        m0 = [
            [
                target[row][column]
                + vector_v[row] * vector_d[column]
                + vector_d[row] * vector_v[column]
                for column in range(2)
            ]
            for row in range(2)
        ]
        observed = MODULE.inertia(
            MODULE.symmetric_eigenvalues(m0), mp.mpf("1e-80")
        )["negative"] == 0
        self.assertEqual(gate_margin >= 0, observed)

    def test_input_hash_tamper_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            tampered = Path(directory) / "egf.json"
            document = json.loads(
                MODULE.DEFAULT_EGF_MANIFEST.read_text(encoding="ascii")
            )
            document["scope"] = "tampered"
            tampered.write_text(json.dumps(document), encoding="ascii")
            with self.assertRaisesRegex(ValueError, "SHA-256 mismatch for egf_manifest"):
                MODULE.prepare_inputs(egf_manifest=tampered, dps=100)

    @unittest.skipUnless(
        os.environ.get("M0_RUN_INTEGRATION") == "1",
        "requires explicit post-review authorization to run the bounded diagnostic",
    )
    def test_default_primary_replay_integration(self) -> None:
        payload = MODULE.run_probe(max_seconds_per_run=120)
        self.assertEqual(payload["status"], MODULE.STATUS)
        self.assertTrue(payload["checks"]["all_checks_passed"])
        self.assertTrue(payload["primary_replay"]["all_inertias_agree"])
        self.assertTrue(
            payload["primary_replay"]["all_old_target_gate_signs_agree"]
        )
        self.assertEqual(
            payload["primary"]["parameters"]["h_cutoff"],
            mp.nstr(mp.mpf(3), 85, strip_zeros=False),
        )
        self.assertEqual(
            payload["replay"]["parameters"]["h_cutoff"],
            mp.nstr(mp.mpf(4), 145, strip_zeros=False),
        )
        for run_name in ("primary", "replay"):
            run = payload[run_name]
            self.assertTrue(run["checks"]["direct_signed_square_equals_m0"])
            self.assertTrue(
                run["checks"]["m0_minus_vd_minus_dv_equals_target_derivative"]
            )
            self.assertTrue(run["cutoff_diagnostics_are_not_bounds"])
        replay_rows = payload["replay"]["inertia_by_prefix"]
        self.assertEqual([row["degree"] for row in replay_rows], list(range(1, 20, 2)))
        self.assertTrue(
            all(row["ordinary_inertia"]["negative"] == 0 for row in replay_rows)
        )


if __name__ == "__main__":
    unittest.main()
