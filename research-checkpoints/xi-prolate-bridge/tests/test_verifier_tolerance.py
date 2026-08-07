from __future__ import annotations

import sys
import unittest
from pathlib import Path

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "verifier"))

from independent_replay import replay_acceptance_scale  # noqa: E402


class VerifierToleranceTests(unittest.TestCase):
    def test_small_values_keep_absolute_scale(self):
        self.assertEqual(
            replay_acceptance_scale("0.003997", mp.mpf("0.003998")),
            1,
        )

    def test_large_dimensionless_ratio_uses_explicit_relative_scale(self):
        supplied = "235660.7438470146680202811985850836158495"
        reconstructed = mp.mpf(
            "235660.7438470146680202812215638419336697"
        )
        defect = abs(mp.mpf(supplied) - reconstructed)
        scale = replay_acceptance_scale(supplied, reconstructed)
        self.assertGreater(defect, mp.mpf("1e-20"))
        self.assertLess(defect / scale, mp.mpf("1e-20"))

    def test_relative_scaling_does_not_hide_material_disagreement(self):
        supplied = "235660"
        reconstructed = mp.mpf("235661")
        scaled_defect = abs(mp.mpf(supplied) - reconstructed) / (
            replay_acceptance_scale(supplied, reconstructed)
        )
        self.assertGreater(scaled_defect, mp.mpf("1e-20"))


if __name__ == "__main__":
    unittest.main()
