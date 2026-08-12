#!/usr/bin/env python3
"""Strict tests for the actual phase-volume long-block threshold barrier.

The tests use exact ``Fraction`` arithmetic where possible and read no zero
table, numerical orbit, cached matrix, or network resource.
"""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / (
    "ACTUAL_PHASE_VOLUME_LONG_BLOCK_THRESHOLD_NEGATIVE_INDEX_BARRIER.md"
)
NOTE_HASH = "964b58396b1913013b017be6393cef768891d253e553a22979c3189a5c603f56"

FROZEN = {
    "notes/ACTUAL_PHASE_VOLUME_CENTERED_PNT_REMAINDER_REDUCTION_BARRIER.md":
        "2b2a40a4ec087c77145b45fc54d8a5782a85ecd122b2d599d2c2d8a067b714f1",
    "tests/test_actual_phase_volume_centered_pnt_remainder_reduction_barrier.py":
        "7fbcdf15dde20d3d2a00303f74d5441ee143af74ae269992fe79b1fb0c97456f",
    "notes/ACTUAL_CENTERED_REMAINDER_LONG_BLOCK_HERMITE_MOMENT_BARRIER.md":
        "1997f8b14c5f90977f744788d069f6e771da078c06562dac2d78c671c01a95c1",
    "tests/test_actual_centered_remainder_long_block_hermite_moment_barrier.py":
        "cbbc300b9a050ac161d9f8feae996947b522043ae50663799dfc194ed4d3dd2d",
    "notes/ACTUAL_CENTERED_REMAINDER_FRACTIONAL_BLOCK_ODD_MOMENT_UI_BARRIER.md":
        "c5510f3491d2d6ff173581bd6be540edc1b8b5c4bbb0afb56b636bfd68b51f19",
    "tests/test_actual_centered_remainder_fractional_block_odd_moment_ui_barrier.py":
        "71e1480ae0e4265ec4e45c3eb181a2682ee070bc8382eba815c3543a9f626871",
    "notes/ACTUAL_CENTERED_REMAINDER_SHIFTED_CORRELATION_TOP_MOMENT_UI_BARRIER.md":
        "8ab0f30e32fe715a4f839228f5d05dc581292c99c2a04f42804f0ff4d2d878d9",
    "tests/test_actual_centered_remainder_shifted_correlation_top_moment_ui_barrier.py":
        "ecaf4f1eaaab4a3a146c277eb0897e79d5323bfe9b79709bbc5cac5d423bd787",
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md":
        "c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81",
    "tests/test_parity_multiplier_schur.py":
        "94ee818e2747e703d521cfa2a980765569cccfdf442b700b1a6b33ac4ceababb",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def h_value(t_value: float) -> float:
    return 0.5 * math.log1p(4.0 * t_value**2)


def q_value(t_value: float) -> float:
    return 16.0 * t_value**2 / (1.0 + 4.0 * t_value**2)


def digamma_positive_series(t_value: float, terms: int = 20000) -> float:
    a_value = 0.25
    y_value = t_value / 2.0
    return sum(
        y_value**2
        / ((index + a_value) * ((index + a_value) ** 2 + y_value**2))
        for index in range(terms)
    )


class ActualPhaseVolumeLongBlockThresholdNegativeIndexBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 10)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_digamma_integral_test_has_exact_remainder_constant(self) -> None:
        self.assertEqual(q_value(0.0), 0.0)
        for t_value in (0.25, 1.0, 4.0, 20.0):
            with self.subTest(t=t_value):
                partial = digamma_positive_series(t_value)
                lower = h_value(t_value)
                upper = lower + q_value(t_value)
                # The omitted positive tail is O(t^2/N^2), tiny here.
                self.assertGreater(partial + 1e-7, lower)
                self.assertLessEqual(partial, upper + 1e-12)
                self.assertGreaterEqual(q_value(t_value), 0.0)
                self.assertLess(q_value(t_value), 4.0)

    def test_pointwise_phase_sandwich_keeps_full_prime_power_value(self) -> None:
        fixtures = (
            (F(3), F(2), F(0)),
            (F(-1), F(5), F(2)),
            (F(4), F(-3), F(1, 2)),
        )
        for base, twice_real_d, epsilon in fixtures:
            q_bound = F(4)
            exact = max(F(0), base - epsilon + twice_real_d)
            lower = max(F(0), base - q_bound + twice_real_d)
            upper = max(F(0), base + twice_real_d)
            self.assertLessEqual(lower, exact)
            self.assertLessEqual(exact, upper)

    def test_true_normalized_threshold_is_s_minus_kappa(self) -> None:
        s_value = 2.5
        kappa = 0.8
        for length in (100.0, 1000.0, 10000.0):
            sigma = 0.5 * length
            arch = s_value * length + 3.0
            c_value = kappa * length - 2.0
            normalized = (arch - c_value) / (2.0 * sigma)
            self.assertAlmostEqual(
                normalized,
                s_value - kappa + 5.0 / length,
                places=13,
            )
        self.assertNotEqual(s_value - kappa, s_value * (1.0 - 0.6))

    def test_centered_transfer_condition_eliminates_alpha_exactly(self) -> None:
        s_value = F(4)
        rho = F(7, 3)
        kappa_good = F(7, 4)
        kappa_bad = F(3, 2)
        # Existence requires 1-rho/s < alpha < kappa/s.
        lower_alpha = 1 - rho / s_value
        self.assertLess(lower_alpha, kappa_good / s_value)
        self.assertGreaterEqual(lower_alpha, kappa_bad / s_value)
        self.assertEqual(
            s_value - kappa_good < rho,
            lower_alpha < kappa_good / s_value,
        )

    def test_macroscopic_hermite_threshold_fails_for_kappa_at_most_one(self) -> None:
        rho_two = 1.0
        rho_three = math.sqrt(3.0)
        rho_four = math.sqrt(3.0 + math.sqrt(6.0))
        self.assertEqual(rho_two, 2 - 1)
        self.assertLess(rho_three, 3 - 1)
        self.assertLess(rho_four, 4 - 1)
        for r_value in range(5, 30):
            self.assertLess(7.0 * r_value / 12.0, r_value - 1.0)

        # The checkpoint-1.68 optimum is separated from the actual threshold.
        for kappa in (0.0, 0.5, 1.0):
            self.assertGreaterEqual(4.0 - kappa, 3.0)
            self.assertGreater(4.0 - kappa, rho_four)

    def test_odd_shelf_ranges_are_exact_and_only_subtarget(self) -> None:
        r_one_minimum_kappa = F(1, 2)
        r_two_minimum_kappa = 2.5 - math.sqrt(3.0)
        self.assertAlmostEqual(r_two_minimum_kappa, 0.7679491924311228)

        kappa = 0.9
        self.assertGreater(kappa, float(r_one_minimum_kappa))
        self.assertGreater(kappa, r_two_minimum_kappa)
        self.assertLess(1.75, kappa + 1.0)
        self.assertLess(2.6, kappa + math.sqrt(3.0))

        # r>=3 is impossible under kappa<1.
        rho_four = math.sqrt(3.0 + math.sqrt(6.0))
        self.assertLess(rho_four, 2.5)
        for r_value in range(4, 30):
            self.assertLessEqual(
                7.0 * (r_value + 1) / 12.0,
                r_value - 0.5,
            )

        # Every fixed odd-shelf exponent has s-r<1, hence its ratio to x/L
        # tends to zero.  Check a representative sequence after the
        # elementary polynomial factor has passed its finite maximum.
        s_value = 1.8
        r_value = 1
        ratios = []
        for length in (100.0, 200.0, 400.0):
            ratios.append(
                math.exp((s_value - r_value - 1) * length) * length**4
            )
        self.assertGreater(ratios[0], ratios[1])
        self.assertGreater(ratios[1], ratios[2])

    def test_optimized_first_shelf_stays_below_required_scale(self) -> None:
        kappa = 0.8
        epsilon = 0.1
        self.assertLess(epsilon, kappa - 0.5)
        s_value = kappa + 1.0 - epsilon
        self.assertGreaterEqual(s_value, 1.5)
        self.assertLess(s_value, 2.0)
        self.assertLess(s_value - kappa, 1.0)
        self.assertAlmostEqual(s_value - 1.0, kappa - epsilon)
        self.assertLess(kappa - epsilon, 1.0)

    def test_higher_moment_crossing_requires_a_larger_hermite_root(self) -> None:
        # On s=2, the current K=2 root cannot cross 2-kappa.  A hypothetical
        # K=3 package could cross only for kappa>2-sqrt(3).
        s_value = 2.0
        rho_two = 1.0
        rho_three = math.sqrt(3.0)
        self.assertFalse(rho_two > s_value - 0.9)
        threshold_kappa = s_value - rho_three
        self.assertAlmostEqual(threshold_kappa, 0.2679491924311228)
        self.assertTrue(rho_three > s_value - 0.5)

    def test_phase_lower_bound_does_not_reverse_negative_index(self) -> None:
        # The same large deficit V can produce no negative directions after a
        # positive safe correction, or two negative directions without it.
        g_value = F(1)
        deficit = (F(10), F(10))
        safe_large = deficit
        block_safe = tuple(g_value + a - v for a, v in zip(safe_large, deficit))
        block_unsafe = tuple(g_value - v for v in deficit)
        negative_safe = sum(value < 0 for value in block_safe)
        negative_unsafe = sum(value < 0 for value in block_unsafe)
        self.assertEqual(sum(deficit), F(20))
        self.assertEqual(negative_safe, 0)
        self.assertEqual(negative_unsafe, 2)

        # A one-sided upper bound is compatible with both values.
        index_upper = 20
        self.assertLessEqual(negative_safe, index_upper)
        self.assertLessEqual(negative_unsafe, index_upper)

    def test_note_contract_and_claim_boundary(self) -> None:
        required = (
            r"D_\lambda(t)=P_x(t)+H_x(t)",
            r"2\theta'(t)=c_0+h(t)+\varepsilon_\theta(t)",
            r"q(t):={16t^2\over1+4t^2}<4",
            r"[C-h-q+2\operatorname {Re}D_\lambda]_+",
            r"[C-h+2\operatorname {Re}D_\lambda]_+",
            r"(s-\kappa)",
            "It is `s-kappa`",
            r"s-\kappa<\rho_r",
            r"\Phi_\lambda(U,g)\gg_{A,s,\kappa}x^sL",
            r"\rho_r\leq r-1",
            r"s-\kappa<\rho_{r+1}",
            r"x^{s-r}L^{2r+1}=o(x/L)",
            r"\kappa>{5\over2}-\sqrt3",
            r"x^{\kappa-\epsilon}L^3=o(x/L)",
            r"\rho_K>s-\kappa",
            r"O\left({x^{1-s}\over L^2}\right)",
            "For every `c>rho_r`",
            "endpoints decreasing to `rho_r`",
            r"\operatorname {tr}T_v={L\over2\pi}\Phi_\lambda(U,g)",
            r"B_\epsilon=gI+T_a-T_v",
            r"2\epsilon|p_\epsilon\rangle\langle p_\epsilon|",
            "the latter rank-one term is handled separately",
            r"n_-(PH_uP)\leq{L\Phi_\lambda(U_Z,g)",
            "cannot reverse",
            "standard eight are untouched",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.normalized)

        forbidden = (
            "phase-volume upper target is false",
            "negative index lower bound is proved",
            "actual negative index is large",
            "proves RH",
            "actual-prime countermodel",
            "TO_BE_FROZEN",
            "DRAFT RESULT",
            r"\Phi_\lambda(U,g)gg_",
            r")_+gg_",
            r">sqrt{",
            r"\mathbb E_{x,s}{(",
            "For every `c>=rho_r`",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_static_hygiene_and_unique_tex_tags(self) -> None:
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn("\r", self.text)
        self.assertNotIn("\t", self.text)
        self.assertIsNone(re.search(r"[ \t]+$", self.text, flags=re.MULTILINE))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        self.assertGreaterEqual(len(tags), 40)

        for path in (NOTE, Path(__file__)):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertNotIn(b"\r", payload)
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        forbidden_calls = {"eval", "exec"}
        called = {
            node.func.id
            for node in ast.walk(tree)
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name)
        }
        self.assertTrue(forbidden_calls.isdisjoint(called))

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 40)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                ["pdflatex", "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
