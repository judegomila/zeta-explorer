#!/usr/bin/env python3
"""Regressions for the odd-Laplace zeta--Hurwitz feature-angle reduction."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_ODD_LAPLACE_ZETA_HURWITZ_FEATURE_ANGLE_REDUCTION_THEOREM.md"
)
NOTE_HASH = "aaa5b189075b308f3d0ea0c0908ad36d4d871f4ce6626ff74ed9c730a09a0723"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md":
        "7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74",
    "tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py":
        "d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140",
    "notes/GROWING_TRANSITION_ORDERED_DIRECT_PROFILE_CONTINUATION_TWO_JET_SHEAR_REDUCTION_THEOREM.md":
        "e3b1228a1fb22270a01f061c198239f3e60cb00b675da55ddd13420f9929dea3",
    "tests/test_growing_transition_ordered_direct_profile_continuation_two_jet_shear_reduction_theorem.py":
        "7d6e46c302276563cfc88e4826903a344c0937eb29f3645daf473d5ba1917341",
    "notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md":
        "7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564",
    "tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py":
        "caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c",
    "notes/GROWING_TRANSITION_POLYLOG_BASE_CONTINUOUS_PRIME_SHELL_COROLLARY.md":
        "326d4d19a4c7bf93e920f2af1438fb0aba7dc797091bf0957abf9149bca018e1",
    "tests/test_growing_transition_polylog_base_continuous_prime_shell_corollary.py":
        "de07ecbac9c7404edc2508b54d3aa25a15f2d8f102b86199119af65ef9e6a2a7",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def s_form(u: complex, v: complex) -> float:
    return (u.conjugate() * v + v.conjugate() * u).real


def dot(values: list[complex]) -> float:
    return sum(abs(value) ** 2 for value in values)


class OddLaplaceZetaHurwitzFeatureAngleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_ordered_profile_reflection_and_centered_evenness(self) -> None:
        lam = 2.5
        L = 2.0 * math.log(lam)

        def f(x: float) -> float:
            if abs(x) > lam:
                return 0.0
            u = x / lam
            return (1.0 - u * u) ** 2 * (0.3 + u * u)

        def a(s: float) -> float:
            first = 0.0
            second = 0.0
            for m in range(1, 200):
                x = m * lam * math.exp(-s)
                y = m * math.exp(s) / lam
                first += f(x)
                second += f(y)
            return math.sqrt(lam) * first / 2.0 + (
                math.exp(s) * second / (2.0 * math.sqrt(lam))
            )

        for s in (0.1, 0.4, 0.9 * L):
            self.assertAlmostEqual(
                a(L - s),
                lam * math.exp(-s) * a(s),
                places=12,
            )
            theta_left = math.exp(-(L / 2.0 - s) / 2.0) * a(L / 2.0 - s)
            theta_right = math.exp(-(L / 2.0 + s) / 2.0) * a(L / 2.0 + s)
            self.assertAlmostEqual(theta_left, theta_right, places=12)

    def test_odd_cross_prefactors_cancel_exactly(self) -> None:
        lam = 3.5
        for z in (3, 5, 9):
            t = 0.8 - 0.3j
            p = -0.2 + 0.7j
            m = 1.1 + 0.4j
            zeta = 1.0 + 2.0 ** (-z) + 3.0 ** (-z)
            a = lam ** (0.5 - z) * (t + p) / 2.0
            b = lam ** (z - 0.5) * (zeta * m - t) / 2.0
            self.assertAlmostEqual(
                s_form(a, b),
                0.25 * s_form(t + p, zeta * m - t),
                places=13,
            )

    def test_low_rows_and_finite_part_rewrite(self) -> None:
        lam = 4.5
        t0 = 0.7 + 0.2j
        t1 = -0.4 + 0.6j
        m0 = 1.2 - 0.5j
        m1p = -0.3 + 0.9j
        a1 = (t1 + t0) / (2.0 * math.sqrt(lam))
        a0 = lam * a1
        b1 = math.sqrt(lam) * (m1p - t1) / 2.0
        b0 = (-m0 / 2.0 - t0) / (2.0 * math.sqrt(lam))
        phi = -m0 / 4.0 + m1p / 2.0

        self.assertAlmostEqual(
            b0.real,
            (phi / math.sqrt(lam) - a1 - b1 / lam).real,
            places=13,
        )
        self.assertAlmostEqual(
            b0.imag,
            (phi / math.sqrt(lam) - a1 - b1 / lam).imag,
            places=13,
        )

        original = -s_form(a0, b0)
        harmonic = 0.25 * s_form(t0 + t1, m0 / 2.0 + t0)
        rewritten = (
            2.0 * lam * abs(a1) ** 2
            - math.sqrt(lam) * s_form(a1, phi)
            + s_form(a1, b1)
        )
        self.assertAlmostEqual(original, harmonic, places=13)
        self.assertAlmostEqual(original, rewritten, places=13)

    def test_difference_of_feature_grams_is_the_cross(self) -> None:
        a = [0.8 + 0.3j, -0.4 + 0.9j, 1.1 - 0.2j]
        b = [-0.5 + 0.7j, 0.6 - 0.1j, -0.2 - 0.8j]
        cross = sum(s_form(x, y) for x, y in zip(a, b))
        difference = 0.5 * (
            dot([x + y for x, y in zip(a, b)])
            - dot([x - y for x, y in zip(a, b)])
        )
        self.assertAlmostEqual(cross, difference, places=13)
        self.assertLess(s_form(1.0, -1.0), 0.0)
        self.assertGreater(s_form(1.0, 1.0), 0.0)

    def test_complete_monotone_kernel_does_not_fix_cross_sign(self) -> None:
        for r in (0.03, 0.2, 1.0):
            exact = math.exp(r / 2.0) / math.sinh(r)
            series = 2.0 * sum(
                math.exp(-(2 * nu + 0.5) * r) for nu in range(5000)
            )
            self.assertAlmostEqual(exact, series, places=11)

    def test_prolate_moment_recurrence_and_source_null_example(self) -> None:
        lam = 3.5
        c = 2.0 * math.pi * lam * lam
        k = 2.0 * math.pi * lam
        gammas = [2.3, 5.1, 8.7]
        m1 = [0.8, -1.1, 0.6]
        x = [1.0, 1.0, 0.5]
        # Adjust the last coefficient so sum m1_j x_j is exactly zero.
        x[-1] = -(m1[0] * x[0] + m1[1] * x[1]) / m1[2]
        self.assertAlmostEqual(sum(a * b for a, b in zip(m1, x)), 0.0)
        mus = [c * c - c * gamma for gamma in gammas]
        m3 = [mu * value / (k * k) for mu, value in zip(mus, m1)]
        lhs = sum(value * coeff for value, coeff in zip(m3, x))
        rhs = -(1.0 / (2.0 * math.pi)) * sum(
            gamma * value * coeff
            for gamma, value, coeff in zip(gammas, m1, x)
        )
        self.assertAlmostEqual(lhs, rhs, places=10)

    def test_high_odd_tail_constant_and_anti_alignment(self) -> None:
        full = sum((2 * nu + 1) ** -4 for nu in range(1, 200000))
        self.assertAlmostEqual(full, math.pi**4 / 96.0 - 1.0, places=12)
        for N in (10, 50, 200):
            c_n = sum((2 * nu + 1) ** -4 for nu in range(N, 500000))
            q = 2 * N + 1
            asymptotic = 1.0 / (6.0 * q**3) + 1.0 / (2.0 * q**4)
            self.assertLess(abs(c_n / asymptotic - 1.0), 1.0 / N**2)
        j = 1.2 - 0.4j
        a_prime = -j
        self.assertAlmostEqual(s_form(a_prime, j), -2.0 * abs(j) ** 2)

    def test_scope_and_fail_closed_tokens(self) -> None:
        for token in (
            "finite-dimensional feature-angle",
            "not proved here",
            "no uniform-in-",
            "neither a disproof",
            "ordinary convergent row",
            "inherited ordinary or Abel row",
            "positive **block** Gram",
            "Hermitian cross",
            "applies only to uncorrected prolate modes",
            "corrected source as a whole",
            "does not close the floor rows",
            "lattice derivative row",
            "not a fixed finite endpoint row",
            "must not be evaluated by setting",
            "No frozen theorem proves (9.2)",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, self.text)

    def test_required_exact_formulas_present(self) -> None:
        for token in (
            "a_f(L-s)=\\lambda e^{-s}a_f(s)",
            "\\Theta_f(-u)=\\Theta_f(u)",
            "\\widehat\\Theta_f(\\xi)",
            "\\zeta(z,N(u)+1)",
            "\\mathcal A_0&={\\sqrt\\lambda\\over2}(t_0+t_1)",
            "\\mathcal B_0&={1\\over2\\sqrt\\lambda}",
            "\\varphi_0(f)=-{1\\over4}m_0(f)",
            "k^2m_{z+2}(n)",
            "J_L(f):=b_f'(0)",
            "O_\\lambda(N^{-4})",
            "(\\widehat{\\mathscr A}-\\widehat{\\mathscr B})",
        ):
            self.assertIn(token, self.text)

    def test_displays_compile_as_tex(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.DOTALL)
        self.assertGreaterEqual(len(displays), 45)
        source = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\usepackage{mathrsfs}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as tmp:
            tex = Path(tmp) / "displays.tex"
            tex.write_text(source, encoding="utf-8")
            result = subprocess.run(
                [
                    pdflatex,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    tex.name,
                ],
                cwd=tmp,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stdout[-4000:])

    def test_display_balance_unique_tags_ascii_and_no_stale_hash(self) -> None:
        starts = re.findall(r"(?m)^\s*\\\[\s*$", self.text)
        ends = re.findall(r"(?m)^\s*\\\]\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(b in (9, 10, 13) or 32 <= b <= 126 for b in data))
        self.assertNotIn("TO_BE_FROZEN", self.text)


if __name__ == "__main__":
    unittest.main()
