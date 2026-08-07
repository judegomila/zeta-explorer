import sys
import unittest
from pathlib import Path
from unittest.mock import patch

import mpmath as mp

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

import prolate_state


class _SyntheticCombination:
    lambda_text = "2"

    @property
    def lam(self):
        return mp.mpf("2")


class ProjectionErrorTests(unittest.TestCase):
    def setUp(self):
        mp.mp.dps = 60
        self.h = _SyntheticCombination()
        self.L = 2 * mp.log(self.h.lam)

    def _project_synthetic(self, function, N):
        def fake_transform(_h, u):
            t = mp.log(u * self.h.lam)
            return function(t)

        with patch.object(prolate_state, "arithmetic_transform_even", side_effect=fake_transform), patch.object(
            prolate_state, "logarithmic_breakpoints", return_value=[mp.mpf("0"), self.L]
        ):
            return prolate_state.projected_even_state(self.h, N)

    def test_breakpoints_include_forward_and_inversion_reflection(self):
        points = prolate_state.logarithmic_breakpoints("2")
        self.assertTrue(any(abs(t - mp.log(3)) < mp.mpf("1e-55") for t in points))
        self.assertTrue(any(abs(t - mp.log(mp.mpf(4) / 3)) < mp.mpf("1e-55") for t in points))
        for t in points:
            self.assertTrue(any(abs((self.L - t) - s) < mp.mpf("1e-55") for s in points))

    def test_direct_residual_matches_known_fourier_tail(self):
        amplitudes = {1: mp.mpf("0.3"), 2: mp.mpf("0.2"), 3: mp.mpf("0.1")}

        def function(t):
            return 1 + mp.fsum(
                amplitude * mp.cos(2 * mp.pi * n * t / self.L)
                for n, amplitude in amplitudes.items()
            )

        result = self._project_synthetic(function, N=1)
        expected_sq = self.L * (amplitudes[2] ** 2 + amplitudes[3] ** 2) / 2
        expected_c0 = mp.sqrt(self.L)
        expected_c1 = amplitudes[1] * mp.sqrt(self.L) / 2

        self.assertEqual(result["projection_error_method"], "direct_residual_quadrature")
        self.assertLess(abs(result["projection_error"] ** 2 - expected_sq), mp.mpf("1e-52"))
        self.assertLess(abs(result["coefficients"][1] - expected_c0), mp.mpf("1e-52"))
        self.assertLess(abs(result["coefficients"][0] - expected_c1), mp.mpf("1e-52"))
        self.assertLess(
            result["projection_error_crosscheck_discrepancy"], mp.mpf("1e-50")
        )

    def test_direct_residual_survives_parseval_cancellation(self):
        # At this precision the norm subtraction has already lost several
        # digits, while pointwise residual formation and integration have not.
        mp.mp.dps = 40
        self.L = 2 * mp.log(self.h.lam)
        epsilon = mp.mpf("1e-20")

        def function(t):
            return 1 + epsilon * mp.cos(2 * mp.pi * t / self.L)

        result = self._project_synthetic(function, N=0)
        expected = epsilon * mp.sqrt(self.L / 2)

        self.assertGreater(result["projection_error"], 0)
        direct_relative_error = abs(result["projection_error"] / expected - 1)
        parseval_relative_error = abs(
            result["projection_error_parseval_crosscheck"] / expected - 1
        )
        self.assertLess(direct_relative_error, mp.mpf("1e-10"))
        self.assertGreater(parseval_relative_error, mp.mpf("1e-2"))


if __name__ == "__main__":
    unittest.main()
