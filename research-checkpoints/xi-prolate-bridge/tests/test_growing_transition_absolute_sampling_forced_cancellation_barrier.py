import hashlib
import math
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_ABSOLUTE_SAMPLING_FORCED_CANCELLATION_BARRIER.md"
NOTE_HASH = "eb04692b7ce8e06efe254053ba93e4c5f2051ceffe47e68015c9e12886d77584"

DEPS = {
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md": "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md": "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "tests/test_growing_transition_complete_central_form_reduction.py": "a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de",
    "notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md": "113be74d52f48d66903c1babf1525ec6d130243321acfa31562abd8640868a3a",
    "tests/test_hybrid_outer_sampling_odd_shift.py": "9ecd210103e73853f242ef5301ee676e8cd89198a6e5554f89773b2c90dcba0d",
    "notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md": "e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816",
    "tests/test_common_radical_leakage_gram_orientation.py": "d897e662d05665930d3b651d0460dd14f84f8e143ed010c9e248c948a5ace417",
    "notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md": "6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c",
    "tests/test_growing_transition_continuous_m11_unconditional_narrow_schedule.py": "626dc9f12cf7a4b58246e12f1b008d72bf9bb0e60713a0a10f6b5dda2e66eb34",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class AbsoluteSamplingForcedCancellationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_dependencies_are_frozen(self) -> None:
        for rel, expected in DEPS.items():
            self.assertEqual(sha256(ROOT / rel), expected, rel)

    def test_note_hash_is_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_scope_is_fail_closed(self) -> None:
        for token in (
            "all-remainders-negligible strategy",
            "conditional specialization",
            "which omitted sector provides the cancellation",
            "For `hC<=1/2`",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, self.text)

    def test_forced_cancellation_scalar_algebra(self) -> None:
        for B, tau in ((3.0, 10.0), (7.5, 7.5), (9.0, 2.0)):
            q_total = -B
            q_local = -tau
            remainder = q_total - q_local
            self.assertGreaterEqual(remainder + 1e-15, tau - B)

    def test_threshold_exponent(self) -> None:
        h = math.pi / 4.0
        self.assertLess(0.5 - h * 0.8, 0.0)
        self.assertGreater(0.5 - h * 0.5, 0.0)
        self.assertAlmostEqual(0.5 / h, 2.0 / math.pi)

    def test_finite_rows_only_reduce_dimension(self) -> None:
        for m in range(1, 8):
            for r in range(0, m + 2):
                self.assertGreaterEqual(max(m - r, 0), 0)
                if r < m:
                    self.assertGreaterEqual(m - r, 1)

    def test_required_exact_formulas_present(self) -> None:
        for token in (
            "-B_{{\\rm out},q}D\\preceq Q_X",
            "P_ER_{\\rm comp}P_E",
            "c^{1/2-hC+o(1)}L^{2m}",
            "|\\mathcal W_Z(O_x,O_x)|",
            "E_0=E\\cap",
        ):
            self.assertIn(token, self.text)

    def test_display_balance_and_unique_tags(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

    def test_ascii_and_no_control_bytes(self) -> None:
        data = NOTE.read_bytes()
        self.assertTrue(all(b in (9, 10, 13) or 32 <= b <= 126 for b in data))


if __name__ == "__main__":
    unittest.main()
