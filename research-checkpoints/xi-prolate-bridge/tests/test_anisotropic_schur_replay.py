from __future__ import annotations

import json
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "verifier"))

from anisotropic_schur_replay import replay  # noqa: E402


class AnisotropicSchurReplayTests(unittest.TestCase):
    def test_independent_formula_replay_reconstructs_raw_block_result(self) -> None:
        artifact = ROOT / "artifacts/prolate_window_probe/lambda2_N8_dps30.json"
        report = replay(artifact, 50)
        self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
        for sector in ("even", "odd"):
            block = report[sector]
            self.assertGreater(mp.mpf(block["lower_Schur_floor"]), 0)
            self.assertLess(
                mp.mpf(block["producer_lower_matrix_disagreement"]),
                mp.mpf("1e-28"),
            )
            self.assertLess(
                mp.mpf(block["producer_lower_floor_disagreement"]),
                mp.mpf("1e-28"),
            )

        producer = json.loads(artifact.read_text())
        direct_tau = mp.mpf(
            producer["shifted_even_window_decomposition"]
            ["forcing_resolvent_decomposition"]["full_solution_norm"]
        )
        replay_upper = mp.mpf(report["even"]["forced_bound"]["T_AS"])
        self.assertGreaterEqual(replay_upper, direct_tau)
        self.assertLess(
            mp.mpf(report["even"]["forced_bound"]["producer_T_disagreement"]),
            mp.mpf("1e-28"),
        )

    def test_nonpositive_lower_model_is_serialized_fail_closed(self) -> None:
        artifact = (
            ROOT
            / "artifacts/prolate_window_probe/lambda2p25_N12_two_window_dps35.json"
        )
        report = replay(artifact, 60)
        self.assertLess(mp.mpf(report["even"]["lower_Schur_floor"]), 0)
        self.assertIsNone(report["even"]["forced_bound"])
        self.assertEqual(
            report["even"]["forced_bound_unavailable_reason"],
            "reconstructed lower Schur model is nonpositive",
        )
        self.assertLess(mp.mpf(report["odd"]["lower_Schur_floor"]), 0)


if __name__ == "__main__":
    unittest.main()
