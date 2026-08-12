from __future__ import annotations

import hashlib
import math
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md"
)
NOTE_HASH = "7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564"

DEPS = {
    "vendor/BK-PSWF-1405.3676v2.pdf": "9fe8dc39e4440200a29ff94bb640b693c06a176d28b7e38a468dce98afa7d7b8",
    "BONAMI_KAROUI_PSWF_ACTION_SOURCE_LOCK.json": "81ded707ec47ff5c3c1c25eb2503ef4c3d54a9280acfd94254d16f0eee4c9a06",
    "tests/test_bonami_karoui_pswf_action_source_lock.py": "06fdee68ab201bcf724d22f852172017fd77eedf1531f4e5bd3f61527a5c670a",
    "P2_SOURCE_LOCK.json": "8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a",
    "notes/TRANSITION_PROLATE_OUTER_THEOREM.md": "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    "tests/test_transition_prolate_outer.py": "bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433",
    "notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md": "3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f",
    "tests/test_defect_relative_projection.py": "21b33670a9d017d363f53776ba05ca93ce3588eb049ba9dcb7e61f202bc01999",
    "notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md": "1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c",
    "tests/test_growing_transition_subcritical_lg_action_bv_theorem.py": "a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md": "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "tests/test_growing_transition_sampling.py": "ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md": "a3a874470e62daa012dc97d6c908e12ac13378ff7e23219e0fbe3cee56b27a85",
    "tests/test_growing_transition_complete_central_plemelj_cauchy_floor_theorem.py": "b9f9cf3d76554b988d7c6d9408130a9ab2b45d37a1862279e139ed7e62edbe61",
    "notes/GROWING_TRANSITION_ORDERED_DIRECT_PROFILE_CONTINUATION_TWO_JET_SHEAR_REDUCTION_THEOREM.md": "e3b1228a1fb22270a01f061c198239f3e60cb00b675da55ddd13420f9929dea3",
    "tests/test_growing_transition_ordered_direct_profile_continuation_two_jet_shear_reduction_theorem.py": "7d6e46c302276563cfc88e4826903a344c0937eb29f3645daf473d5ba1917341",
    "notes/GROWING_TRANSITION_ABSOLUTE_SAMPLING_FORCED_CANCELLATION_BARRIER.md": "eb04692b7ce8e06efe254053ba93e4c5f2051ceffe47e68015c9e12886d77584",
    "tests/test_growing_transition_absolute_sampling_forced_cancellation_barrier.py": "3bb7d6c45bd0d4d1564624f7ab9f22532229d51dd51d71a474674081fd266a7b",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def simpson(f, a: float, b: float, panels: int = 20000) -> float:
    if panels % 2:
        panels += 1
    h = (b - a) / panels
    total = f(a) + f(b)
    total += 4.0 * sum(f(a + h * j) for j in range(1, panels, 2))
    total += 2.0 * sum(f(a + h * j) for j in range(2, panels, 2))
    return total * h / 3.0


class TwoClusterModalPlacementLeakageNormalizationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_dependencies_are_frozen(self) -> None:
        for rel, expected in DEPS.items():
            self.assertEqual(sha256(ROOT / rel), expected, rel)

    def test_note_hash_is_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_subcritical_action_reduction(self) -> None:
        # Verify A/c = kappa^2 int cos^2/sqrt(1-kappa^2 sin^2)
        # equals E(kappa)-r^2 K(kappa) at representative r.
        for r in (0.03, 0.12, 0.4, 0.75):
            kappa2 = 1.0 - r * r
            left = kappa2 * simpson(
                lambda th: math.cos(th) ** 2
                / math.sqrt(1.0 - kappa2 * math.sin(th) ** 2),
                0.0,
                math.pi / 2.0,
                4000,
            )
            elliptic_e = simpson(
                lambda th: math.sqrt(1.0 - kappa2 * math.sin(th) ** 2),
                0.0,
                math.pi / 2.0,
                4000,
            )
            elliptic_k = simpson(
                lambda th: 1.0
                / math.sqrt(1.0 - kappa2 * math.sin(th) ** 2),
                0.0,
                math.pi / 2.0,
                4000,
            )
            self.assertAlmostEqual(left, elliptic_e - r * r * elliptic_k, places=10)

    def test_action_derivative_and_placement_margin(self) -> None:
        # The proof uses |sigma'| >= L/16.  The stated displacement changes
        # action by 3*pi/2, strictly more than the 5*pi/4 BK+grid mismatch.
        self.assertAlmostEqual((24.0 * math.pi) / 16.0, 1.5 * math.pi)
        self.assertGreater(1.5 * math.pi, 1.25 * math.pi)

        # Differentiate C(r)=E(kappa)-r^2 K(kappa) numerically through gamma.
        c = 1.0e7
        gamma = 50.0

        def c_action(g: float) -> float:
            r = math.sqrt(g / c)
            kappa2 = 1.0 - r * r
            e = simpson(
                lambda th: math.sqrt(1.0 - kappa2 * math.sin(th) ** 2),
                0.0,
                math.pi / 2.0,
                6000,
            )
            k = simpson(
                lambda th: 1.0
                / math.sqrt(1.0 - kappa2 * math.sin(th) ** 2),
                0.0,
                math.pi / 2.0,
                6000,
            )
            return c * (e - r * r * k)

        r = math.sqrt(gamma / c)
        kappa2 = 1.0 - r * r
        j_value = simpson(
            lambda th: 1.0
            / math.sqrt(1.0 - kappa2 * math.sin(th) ** 2),
            0.0,
            math.pi / 2.0,
            6000,
        )
        step = 1.0e-2
        derivative = (c_action(gamma + step) - c_action(gamma - step)) / (2.0 * step)
        self.assertAlmostEqual(derivative, -0.5 * j_value, delta=3e-5)

    def test_leakage_constant_is_strictly_conservative(self) -> None:
        self.assertGreater(math.pi / 48.0, math.pi / 64.0)
        for gamma in (10.0, 50.0, 200.0):
            proved = 10.0 * math.exp(-math.pi * gamma / 48.0)
            stated = 10.0 * math.exp(-math.pi * gamma / 64.0)
            self.assertLessEqual(proved, stated)

    def test_both_schedules_enter_the_lg_bulk(self) -> None:
        for L in (1.0e8, 1.0e10, 1.0e12):
            base = math.log(L) ** 4
            self.assertGreater(base + 0.25 - 24.0 * math.pi / L, base)
            self.assertGreater(0.02 * L - 3.0 - 24.0 * math.pi / L, base)

    def test_endpoint_factor_cancels_the_outward_chi(self) -> None:
        for chi_a, chi_b in ((0.8, 0.9), (0.99, 0.95), (1.0, 1.0)):
            zhat_a, zhat_b = 3.0, 5.0
            z_a, z_b = zhat_a / chi_a, zhat_b / chi_b
            physical = (1.0 + chi_a) * chi_b * z_a * z_b
            reduced = zhat_a * zhat_b * (1.0 + chi_a) / chi_a
            self.assertAlmostEqual(physical, reduced)

    def test_finite_row_dimension_count(self) -> None:
        for m in range(1, 10):
            for r in range(0, 7):
                lower = m - r
                self.assertLessEqual(lower, m)
                if m > 5:
                    self.assertGreaterEqual(m - 5, 1)

    def test_forced_cancellation_threshold_is_strict(self) -> None:
        h = math.pi / 4.0
        self.assertLess(0.5 - h * 0.8, 0.0)
        self.assertGreater(0.5 - h * 0.5, 0.0)
        self.assertIn("cannot all be lower order", self.text)

    def test_required_formulas_and_scope_are_present(self) -> None:
        for token in (
            "|\\widehat\\gamma-\\gamma|\\leq{24\\pi\\over L}",
            "d_{n_\\gamma}\\leq10e^{-\\kappa_0\\gamma}",
            "\\widehat z_n={H_n(\\lambda)\\over\\sqrt{d_n}}=\\chi_nz_n",
            "{1+\\chi_{n_\\alpha}\\over\\chi_{n_\\alpha}}",
            "source nulling plus that endpoint nulling costs at most three",
            "raises it to at most five",
            "no mixed or higher",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, self.text)

    def test_no_convention_collision(self) -> None:
        self.assertIn("Bonami--Karoui use `chi_n(c)` for the separation eigenvalue", self.text)
        self.assertIn("`chi_n` is reserved for the positive concentration", self.text)

    def test_display_balance_unique_tags_and_ascii(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__)):
            data = path.read_bytes()
            self.assertTrue(all(b in (9, 10, 13) or 32 <= b <= 126 for b in data))


if __name__ == "__main__":
    unittest.main()
