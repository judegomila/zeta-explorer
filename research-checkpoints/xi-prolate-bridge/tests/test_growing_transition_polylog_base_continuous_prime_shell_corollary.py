#!/usr/bin/env python3
"""Regressions for the polylog-base continuous and prime-shell corollary."""

from __future__ import annotations

import hashlib
import re
from pathlib import Path
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_POLYLOG_BASE_CONTINUOUS_PRIME_SHELL_COROLLARY.md"
)
NOTE_HASH = "326d4d19a4c7bf93e920f2af1438fb0aba7dc797091bf0957abf9149bca018e1"

DEPENDENCIES = {
    "notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md":
        "6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c",
    "tests/test_growing_transition_continuous_m11_unconditional_narrow_schedule.py":
        "626dc9f12cf7a4b58246e12f1b008d72bf9bb0e60713a0a10f6b5dda2e66eb34",
    "notes/GROWING_TRANSITION_CURVED_TWO_ENDPOINT_FIO_SHELL_THEOREM.md":
        "ddb1769d6e6f2b3214cb8191d631a161a1312f18c5bfbba4ca2ad11bb9f93341",
    "tests/test_growing_transition_curved_two_endpoint_fio_shell_theorem.py":
        "8d6bf688ffc938691789a558900ac95467a6631203f5fd262a5f4356431422cb",
    "notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md":
        "1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c",
    "tests/test_growing_transition_subcritical_lg_action_bv_theorem.py":
        "a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92",
    "notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md":
        "1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d",
    "tests/test_growing_transition_edge_carleman_scattering_obstruction.py":
        "b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class PolylogBaseContinuousPrimeShellTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 80
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_exact_dependencies_are_frozen(self) -> None:
        self.assertNotEqual(NOTE_HASH, "PENDING")
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in DEPENDENCIES.items():
            self.assertNotIn("PENDING", expected, relative)
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_scope_is_narrow_and_fail_closed(self) -> None:
        required = (
            "analytic and fail-closed",
            "does **not**\nprove modal placement",
            "lower bound for actual leakage factors",
            "any\n`m>=2` or `l>=2` sampler",
            "full central matrix",
            "central-floor counterexample",
            "determinant\nconclusion",
            "or RH",
            "P0_INVALIDATED",
            "only the `m=l=1`\nprime shell",
            "The unconditional conclusions are exactly (0.8)--(0.10)",
            "not the conditional statement (0.12)",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_uniformity_audit_is_explicit(self) -> None:
        required = (
            "not obtained by simply inserting `A_1=B_L/L`",
            "D>C+2",
            "\\delta_*={1-2\\theta\\over4}>0",
            "Neither local\n    lemma contains `A_1^-1`",
            "no constant from either frozen proof diverges",
            "The outward profile has positive\n    parameter",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_positive_offset_margin_survives_placement_error(self) -> None:
        base_offset = mp.mpf("0.17")
        placement_constant = mp.mpf(12)
        for log_l in (mp.mpf(8), mp.mpf(15), mp.mpf(30)):
            l_value = mp.e**log_l
            beta_shift = base_offset - placement_constant / l_value
            if l_value > 2 * placement_constant / base_offset:
                self.assertGreaterEqual(beta_shift, base_offset / 2)
        self.assertIn("b_*:=\\min_j b_j>0", self.text)
        self.assertIn("\\beta_j\\geq B_L+{b_*\\over2}\\geq B_L", self.text)

    def test_polylog_cutoff_is_superpolynomial_but_subconductor(self) -> None:
        h_value = mp.pi / 4
        epsilon = mp.mpf("0.13")
        r_value = 2 * h_value + epsilon
        for log_l in (mp.mpf(20), mp.mpf(30), mp.mpf(45)):
            l_value = mp.e**log_l
            base = log_l**4
            log_r = r_value * base
            log_c = l_value + mp.log(2 * mp.pi)
            self.assertGreater(log_r, 100 * log_l)
            self.assertLess(log_r / log_c, mp.mpf("0.01"))

    def test_general_margin_implies_every_same_cluster_power(self) -> None:
        h_value = mp.pi / 4
        for h_c, theta in (
            (mp.mpf("0.15"), mp.mpf("0.2")),
            (mp.mpf("0.61"), mp.mpf("0.19")),
            (mp.mpf("0.91"), mp.mpf("0.04")),
        ):
            c_gap = h_c / h_value
            self.assertGreater(c_gap, 0)
            self.assertLess(h_c, 1)
            self.assertLess(theta, min(mp.mpf("0.5"), 1 - h_c))
            delta_star = (1 - 2 * theta) / 4
            self.assertGreater(delta_star, 0)
            self.assertLessEqual(theta, mp.mpf("0.5") - delta_star)
            self.assertLess(h_c + theta - 1, 0)
            self.assertLess((theta - 1) / 2, 0)
            hh_prime_local = h_c + 3 * theta / 2 - mp.mpf("1.5")
            self.assertLess(hh_prime_local, -h_c / 2)
            self.assertLess(3 * theta / 2 - 1, 0)

    def test_forward_error_ledger_has_the_claimed_coefficients(self) -> None:
        h_value = mp.pi / 4
        epsilon = mp.mpf("0.11")
        r_value = 2 * h_value + epsilon
        local_base_coefficient = 2 * h_value + 3 * r_value / 2
        claimed = 5 * h_value + 3 * epsilon / 2
        self.assertLess(abs(local_base_coefficient - claimed), mp.mpf("1e-70"))
        reciprocal_coefficient = r_value - h_value
        self.assertLess(
            abs(reciprocal_coefficient - (h_value + epsilon)),
            mp.mpf("1e-70"),
        )
        square_root_coefficient = h_value + r_value / 2
        self.assertLess(
            abs(square_root_coefficient - (2 * h_value + epsilon / 2)),
            mp.mpf("1e-70"),
        )
        self.assertIn("5h+{3\\epsilon\\over2}", self.text)
        self.assertIn("2h+{\\epsilon\\over2}", self.text)

    def test_common_polylog_base_cancels_from_cauchy_denominator(self) -> None:
        c_gap = mp.mpf("0.73")
        l_value = mp.mpf("1000")
        base = mp.log(l_value) ** 4
        a_nodes = (mp.mpf("-0.4"), mp.mpf("0.8"), mp.mpf("1.9"))
        b_nodes = (mp.mpf("0.2"), mp.mpf("1.2"), mp.mpf("2.4"))
        for a_value in a_nodes:
            for b_value in b_nodes:
                alpha = c_gap * l_value + base + a_value
                beta = base + b_value
                self.assertLess(
                    abs((alpha - beta) - (c_gap * l_value + a_value - b_value)),
                    mp.mpf("1e-70"),
                )

    def test_flat_two_cluster_matrix_has_m_negative_eigenvalues(self) -> None:
        h_value = mp.pi / 4
        a_nodes = (mp.mpf("-0.7"), mp.mpf("0.5"), mp.mpf("1.8"))
        b_nodes = (mp.mpf("0.1"), mp.mpf("1.1"), mp.mpf("2.6"))
        dimension = len(a_nodes)
        gap = mp.mpf(35)
        cross = mp.matrix(
            [
                [
                    2
                    * mp.sinh(h_value * (gap + a_nodes[i] - b_nodes[j]))
                    / (gap + a_nodes[i] - b_nodes[j])
                    for j in range(dimension)
                ]
                for i in range(dimension)
            ]
        )
        block = mp.matrix(2 * dimension)
        for i in range(dimension):
            for j in range(dimension):
                block[i, dimension + j] = cross[j, i]
                block[dimension + i, j] = cross[i, j]
        eigenvalues = mp.eigsy(block, eigvals_only=True)
        self.assertEqual(sum(value < 0 for value in eigenvalues), dimension)

    def test_elliptic_whitening_is_uniform_at_polylog_low_edge(self) -> None:
        # mpmath.ellipk takes the parameter kappa^2=1-r^2.
        for l_value in (mp.mpf(50), mp.mpf(80), mp.mpf(120)):
            log_l = mp.log(l_value)
            conductor = 2 * mp.pi * mp.e**l_value
            base = log_l**4
            high = mp.mpf("0.7") * l_value + base
            values = []
            for gamma in (base + mp.mpf("0.3"), high):
                r_squared = gamma / conductor
                j_value = mp.ellipk(1 - r_squared)
                values.append(j_value / l_value)
            for ratio in values:
                self.assertGreater(ratio, mp.mpf("0.35"))
                self.assertLess(ratio, mp.mpf("0.65"))
            condition = mp.sqrt(max(values) / min(values))
            self.assertLess(condition, mp.mpf("1.2"))

    def test_prime_shell_covers_all_orientations_and_hard_tail(self) -> None:
        required = (
            "For a high--low entry",
            "reverse low--high entry",
            "high--high entry",
            "low--low entry",
            "completed `n<A` shell",
            "For `n>A`",
            "hC+{3\\theta\\over2}-{3\\over2}",
            "\\|\\mathsf P^{11}_{\\rm white}\\|_",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_exact_physical_normalization_and_scales_are_recorded(self) -> None:
        required = (
            "\\widehat z_\\gamma^{\\rm rad}",
            "=\\chi_\\gamma z_\\gamma",
            "After cancellation of the outside\n`n`",
            "=\\Theta(L^{-1})",
            "{e^{hCL}\\over L^{2m-1}}",
            "{e^{hCL}\\over L^{2m}}",
            "{1+\\chi_\\alpha\\over\\chi_\\alpha}",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_whitening_is_fail_closed_on_the_leakage_gate(self) -> None:
        required = (
            "the analytically normalized Fourier tail",
            "If an actual modal row realizes `gamma`",
            "It is not the\nbare endpoint quotient",
            "The surviving factor `(1+chi_alpha)/chi_alpha`",
            "not bounded above",
            "\\mathsf G_\\chi",
            "Without\n`mathsf G_chi`, neither (7.9)",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_display_delimiters_and_aligned_tags_are_well_formed(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        self.assertEqual(
            self.text.count("\\begin{aligned}"),
            self.text.count("\\end{aligned}"),
        )
        self.assertIsNone(
            re.search(r"\\tag\{[^}]+\}\s*\n\\end\{aligned\}", self.text)
        )
        forbidden = (
            "PENDING",
            "A_1^-2",
            "proves modal placement",
            "full central counterexample",
            "determinant theorem",
            "RH follows",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)


if __name__ == "__main__":
    unittest.main()
