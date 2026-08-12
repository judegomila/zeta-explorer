#!/usr/bin/env python3
"""Regressions for the local-cross/equality-representative barrier."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_LOCAL_CROSS_VS_EQUALITY_REPRESENTATIVE_CANCELLATION_BARRIER.md"
)
NOTE_HASH = "7b05a48bfab25f7c55f7e2428c9f0681ac972d6670dd84cf294e247fefdeecf3"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_ABSOLUTE_SAMPLING_FORCED_CANCELLATION_BARRIER.md":
        "eb04692b7ce8e06efe254053ba93e4c5f2051ceffe47e68015c9e12886d77584",
    "tests/test_growing_transition_absolute_sampling_forced_cancellation_barrier.py":
        "3bb7d6c45bd0d4d1564624f7ab9f22532229d51dd51d71a474674081fd266a7b",
    "notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md":
        "6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c",
    "tests/test_growing_transition_continuous_m11_unconditional_narrow_schedule.py":
        "626dc9f12cf7a4b58246e12f1b008d72bf9bb0e60713a0a10f6b5dda2e66eb34",
    "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md":
        "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
    "tests/test_growing_transition_equality_conductor_garding_theorem.py":
        "61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md":
        "1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d",
    "tests/test_growing_transition_edge_carleman_scattering_obstruction.py":
        "b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "tests/test_growing_transition_complete_central_form_reduction.py":
        "a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de",
    "notes/GROWING_TRANSITION_CURVED_TWO_ENDPOINT_FIO_SHELL_THEOREM.md":
        "ddb1769d6e6f2b3214cb8191d631a161a1312f18c5bfbba4ca2ad11bb9f93341",
    "tests/test_growing_transition_curved_two_endpoint_fio_shell_theorem.py":
        "8d6bf688ffc938691789a558900ac95467a6631203f5fd262a5f4356431422cb",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class LocalCrossVsEqualityRepresentativeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_exact_no_overlap_scope(self) -> None:
        for token in (
            "No frozen identity identifies",
            "physical summand or compression",
            "categorical impossibility",
            "orientation, not a missing scalar",
            "off-diagonal quadrant is not a compression",
            "not a cancellation theorem",
            "equality sector alone",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, self.text)

    def test_equality_garding_inventory_is_explicit(self) -> None:
        for token in (
            "n\\equiv0\\pmod4",
            "0\\leq n<n_*",
            "n_*=4\\lambda^2+b_\\lambda",
            "strict label-range hypotheses",
        ):
            self.assertIn(token, self.text)

    def test_direct_prefactor_splits_into_fh_and_hh(self) -> None:
        for chi_j in (0.51, 0.75, 0.97, 1.0):
            for chi_k in (0.55, 0.83, 0.995):
                direct = (1.0 + chi_j) * chi_k
                f_h = chi_k
                h_h = chi_j * chi_k
                self.assertAlmostEqual(direct, f_h + h_h, places=15)
                self.assertAlmostEqual(direct / h_h, 1.0 + 1.0 / chi_j)

    def test_defect_white_multiplier_identity(self) -> None:
        for chi_j, chi_k, z_j, z_k in (
            (0.61, 0.72, 1.3, -0.4),
            (0.91, 0.96, -2.0, 3.1),
            (0.999, 0.998, 0.7, 1.1),
        ):
            hat_j = chi_j * z_j
            hat_k = chi_k * z_k
            raw_hh = chi_j * chi_k * z_j * z_k
            direct = (1.0 + chi_j) * chi_k * z_j * z_k
            self.assertAlmostEqual(raw_hh, hat_j * hat_k)
            self.assertAlmostEqual(
                direct,
                hat_j * hat_k * (1.0 + chi_j) / chi_j,
            )

    def test_same_prime_term_has_nonpositive_form_sign(self) -> None:
        # P^= is nonnegative and enters Q_eq as -P^=.
        for p_equal in (0.0, 0.5, 7.0):
            self.assertGreaterEqual(p_equal, 0.0)
            self.assertLessEqual(-p_equal, 0.0)
        self.assertEqual(sum(math.log(m) / m for m in range(1, 2)), 0.0)

    def test_formal_loewner_gap_scalar_algebra(self) -> None:
        for tau, gamma, q_eq in (
            (10.0, 2.0, 2.0),
            (9.0, -1.0, 3.0),
            (0.5, 0.25, 8.0),
        ):
            q_loc = -tau
            self.assertGreaterEqual(q_eq, gamma)
            self.assertGreaterEqual(q_eq - q_loc, tau + gamma)

    def test_only_complete_remainder_is_physically_forced(self) -> None:
        for tau, bound, q_total in (
            (10.0, 3.0, -3.0),
            (10.0, 3.0, 1.0),
            (4.0, 7.0, -6.0),
        ):
            q_loc = -tau
            remainder = q_total - q_loc
            self.assertGreaterEqual(q_total, -bound)
            self.assertGreaterEqual(remainder, tau - bound)

    def test_threshold_and_floor_scales(self) -> None:
        h = math.pi / 4.0
        self.assertLess(0.5 - h * 0.8, 0.0)
        self.assertGreater(0.5 - h * 0.5, 0.0)
        for length in (20.0, 50.0, 100.0):
            gamma = length / 4.0 - math.log(length) / 4.0 - 3.0
            tau = math.exp(0.4 * length) / length**4
            if length == 100.0:
                self.assertGreater(tau, gamma)

    def test_required_exact_formulas_present(self) -> None:
        for token in (
            "Q_X=-\\mathcal W_Z(X,O)",
            "Q_X=\\mathcal W_Z(O,O)",
            "(1+\\chi_j)\\chi_k=\\chi_k+\\chi_j\\chi_k",
            "R(\\alpha,\\beta)",
            "R(\\alpha,\\alpha)={\\pi\\over2}",
            "Q_{\\rm eq}=A_1^{=}+A_{\\geq2}^{=}-P^{=}",
            "P_E(\\widehat Q_{\\rm eq}-\\widehat Q_{\\rm loc})P_E",
            "P_E\\widehat R_{\\rm comp}P_E",
            "c^{hC+o(1)}\\over L^{2m}",
        ):
            self.assertIn(token, self.text)

    def test_display_balance_unique_tags_and_ascii(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(b in (9, 10, 13) or 32 <= b <= 126 for b in data))


if __name__ == "__main__":
    unittest.main()
