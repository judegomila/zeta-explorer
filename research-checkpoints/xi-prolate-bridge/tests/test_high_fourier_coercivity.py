from __future__ import annotations

import copy
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from high_fourier_coercivity import (  # noqa: E402
    coercivity_constants,
    high_mode_bounds,
    report,
    sufficient_cutoff,
)
from high_fourier_coercivity_replay import replay  # noqa: E402
from weil_matrix import blocks_split  # noqa: E402


def operator_norm(A: mp.matrix) -> mp.mpf:
    if A.rows == 0 or A.cols == 0:
        return mp.mpf(0)
    eigenvalues, _ = mp.eigsy(A.H * A)
    return mp.sqrt(max(mp.mpf(0), eigenvalues[eigenvalues.rows - 1]))


class HighFourierCoercivityTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 60

    def test_constants_are_positive_and_exactly_decomposed(self):
        values = coercivity_constants("2", 60)
        self.assertGreater(values["sigma"], 0)
        self.assertEqual(
            values["diagonal_loss"],
            values["pole_diagonal_loss"]
            + values["arch_diagonal_loss"]
            + values["prime_diagonal_loss"],
        )
        self.assertEqual(
            values["b_bound"],
            values["pole_b_bound"]
            + values["arch_b_bound"]
            + values["prime_b_bound"],
        )
        self.assertEqual(values["coupling_bound"], 2 * mp.pi * values["b_bound"])

    def test_binary64_inputs_are_rejected(self):
        with self.assertRaises(TypeError):
            coercivity_constants(2.0, 60)  # type: ignore[arg-type]
        with self.assertRaises(TypeError):
            high_mode_bounds("2", 1, 0.0, 60)  # type: ignore[arg-type]

    def test_explicit_cutoff_meets_requested_floor(self):
        values = sufficient_cutoff("2", "0.125", "3.5", 80)
        self.assertTrue(values["point_replay_meets_target"])
        self.assertGreaterEqual(values["shifted_high_compression_floor"], mp.mpf("3.5"))
        prior = high_mode_bounds("2", values["M_star"], "0.125", 80)
        self.assertEqual(
            prior["shifted_high_compression_floor"],
            values["shifted_high_compression_floor"],
        )

    def test_finite_source_matrix_obeys_bounds(self):
        mp.mp.dps = 45
        modes, _, _, _, _, Q = blocks_split("2", 2, 45)
        bounds = high_mode_bounds("2", 1, "0", 45)
        high = [i for i, n in enumerate(modes) if abs(n) > 1]
        low = [i for i, n in enumerate(modes) if abs(n) <= 1]
        Qhh = mp.matrix([[Q[i, j] for j in high] for i in high])
        Qhl = mp.matrix([[Q[i, j] for j in low] for i in high])
        eigenvalues, _ = mp.eigsy(Qhh)
        self.assertGreaterEqual(
            eigenvalues[0] + mp.mpf("1e-35"),
            bounds["unshifted_high_compression_floor"],
        )
        self.assertLessEqual(
            operator_norm(Qhl),
            bounds["low_high_coupling_norm_upper"] + mp.mpf("1e-35"),
        )
        for i, n in enumerate(modes):
            if n:
                upper = mp.log(abs(n) + 2) + bounds["absolute_diagonal_constant"]
                self.assertLessEqual(abs(Q[i, i]), upper)

    def test_independent_replay_reconstructs_constants(self):
        payload = report("2.25", None, "0.1", "2", 70)
        result = replay(payload)
        self.assertEqual(result["status"], "ANALYTIC_UNIFORM_COMPONENT_REPLAY_PASS")
        self.assertTrue(result["source_reconstructed"])
        self.assertTrue(result["source_sign_reconstructed"])
        self.assertTrue(result["target_checked"])
        self.assertTrue(result["target_holds"])

    def test_replay_rejects_changed_prime_sign(self):
        payload = report("2", 4, "0", None, 60)
        payload["source_block_sign"] = "Q=W_0,2-W_R+W_p"
        with self.assertRaisesRegex(ValueError, "sign mismatch"):
            replay(payload)

    def test_replay_rejects_tampered_source_hash(self):
        payload = report("2", 4, "0", None, 60)
        payload["source_pdf_sha256"] = "0" * 64
        with self.assertRaisesRegex(ValueError, "PDF hash mismatch"):
            replay(payload)

    def test_replay_rejects_tampered_constant(self):
        payload = report("2", 4, "0", None, 60)
        bad = copy.deepcopy(payload)
        bad["values"]["coupling_bound"] = "0"
        with self.assertRaisesRegex(ValueError, "coupling_bound"):
            replay(bad)

    def test_replay_rejects_trusted_target_boolean(self):
        payload = report("2", None, "0", "1", 60)
        payload["values"]["point_replay_meets_target"] = False
        with self.assertRaisesRegex(ValueError, "boolean"):
            replay(payload)


if __name__ == "__main__":
    unittest.main()
