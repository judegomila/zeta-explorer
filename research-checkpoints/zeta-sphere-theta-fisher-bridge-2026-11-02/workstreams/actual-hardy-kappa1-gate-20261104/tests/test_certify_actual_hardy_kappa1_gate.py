from __future__ import annotations

from fractions import Fraction
import importlib.util
from pathlib import Path
import sys
import unittest

from flint import arb


HERE = Path(__file__).resolve()
WORKSTREAM = HERE.parents[1]
CHECKPOINT = WORKSTREAM.parents[1]
SOURCE = WORKSTREAM / "src" / "certify_actual_hardy_kappa1_gate.py"
COMPATIBILITY = WORKSTREAM / "src" / "replay_actual_hardy_kappa1_gate.py"


def load_checker():
    spec = importlib.util.spec_from_file_location("actual_hardy_checker_test", SOURCE)
    if spec is None or spec.loader is None:
        raise ImportError(SOURCE)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def load_compatibility():
    spec = importlib.util.spec_from_file_location(
        "actual_hardy_compatibility_test", COMPATIBILITY
    )
    if spec is None or spec.loader is None:
        raise ImportError(COMPATIBILITY)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


class ActualHardyKappa1GateTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.checker = load_checker()
        cls.compatibility = load_compatibility()

    def test_exact_algebra_self_checks(self):
        checks = self.checker.exact_algebra_self_checks()
        self.assertTrue(all(checks.values()))

    def test_dependencies_are_frozen(self):
        with self.compatibility.frozen_checkpoint_overlay(CHECKPOINT) as result:
            root, provenance = result
            observed = self.checker.verify_dependencies(root)
            self.assertEqual(observed, self.checker.EXPECTED_SHA256)
            self.assertIn(
                provenance["mode"],
                {"exact_live_match", "known_pr40_whitespace_reconstruction"},
            )

    def test_existing_head_and_tail_are_strictly_positive(self):
        payload = self.checker.load_json(
            CHECKPOINT / self.checker.EWALD_RECEIPT_REL
        )
        head, tail, remote = self.checker.certified_head_and_tail(payload)
        self.assertGreater(head.lower(), 0)
        self.assertGreater(tail.lower(), 0)
        self.assertTrue(remote.contains(0))

    def test_interval_overlap(self):
        self.assertTrue(
            self.checker.intervals_overlap(arb(1, 1), arb(2, 1))
        )
        self.assertFalse(
            self.checker.intervals_overlap(arb(0), arb(3))
        )

    def test_ewald_cells_are_half_the_direct_source_normalization(self):
        sigma0 = Fraction(7, 3)
        ewald_tail = Fraction(5, 11)
        direct_tail = 2 * ewald_tail / sigma0
        energy = Fraction(13, 7)
        self.assertEqual(
            2 * sigma0 * direct_tail / energy,
            4 * ewald_tail / energy,
        )

    def test_frozen_ewald_total_matches_M1_not_sigma1(self):
        moments = self.checker.load_json(
            CHECKPOINT / self.checker.POSITIVE_MOMENTS_REL
        )
        ewald = self.checker.load_json(CHECKPOINT / self.checker.EWALD_RECEIPT_REL)
        finite = sum(
            (arb(ewald["cells"][str(index)]["full_enclosure"])
             for index in range(1, 7)),
            arb(0),
        )
        remote_radius = arb(
            ewald["index_tail"]["sum_abs_e_n_n_gt_6_upper"]
        ).abs_upper()
        total = finite + arb(0, remote_radius)
        m1 = arb(moments["target_moments"][1]["corrected_M_interval"]["arb"])
        sigma1 = 2 * m1
        self.assertTrue(self.checker.intervals_overlap(total, m1))
        self.assertFalse(self.checker.intervals_overlap(total, sigma1))

    def test_corrected_gate_reconstructs_ewald_head(self):
        energy = Fraction(17, 5)
        root_cost = Fraction(19, 7)
        ewald_tail = Fraction(2, 9)
        pi_symbol = Fraction(22, 7)
        delta = 2 - root_cost / energy
        ratio = 4 * pi_symbol * ewald_tail / energy
        reconstructed = energy * (delta - ratio) / (4 * pi_symbol)
        expected_head = energy * delta / (4 * pi_symbol) - ewald_tail
        self.assertEqual(reconstructed, expected_head)


if __name__ == "__main__":
    unittest.main()
