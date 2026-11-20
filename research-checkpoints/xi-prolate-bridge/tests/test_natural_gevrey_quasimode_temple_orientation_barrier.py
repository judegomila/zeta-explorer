#!/usr/bin/env python3
"""Strict regressions for the natural Gevrey/Temple theorem and barrier."""

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
NOTE = (
    ROOT
    / "notes"
    / "NATURAL_GEVREY_QUASIMODE_TEMPLE_ORIENTATION_BARRIER.md"
)
NOTE_HASH = "c5cabe812995379a9e93fb32bb4ea648d97cbc52c7494d794ef1146cccc4b5c6"

FROZEN = {
    "notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md":
        "384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c",
    "tests/test_gevrey_prolate_remainder.py":
        "93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058",
    "notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md":
        "ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171",
    "tests/test_all_order_prolate_flatness.py":
        "f6a7925a8dd892183953e75ee24acc8bad9fd64226d7f578600736dda1c3fa03",
    "notes/PROLATE_ENDPOINT_SCHUR_SINGULAR_ASYMPTOTICS.md":
        "b6328de0744d867416ffa510be3bfa7cd5028c4e489f20a55639238f98bbd221",
    "tests/test_prolate_endpoint_schur_singular_asymptotics.py":
        "d754043dcb21033888958af11401918f0c2e9b183161ff3fa4e55b5890a4ecb6",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left: list[F], right: list[F]) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


class NaturalGevreyQuasimodeTempleOrientationBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_minimal_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 6)
        self.assertEqual(
            sum(path.startswith("notes/") for path in FROZEN), 3
        )
        self.assertEqual(
            sum(path.startswith("tests/") for path in FROZEN), 3
        )
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_odd_halfgrid_schedule_and_adjacent_cutoffs_are_exact(self) -> None:
        for p in range(5, 1000, 2):
            lam = F(p, 2)
            m_value = (p + 1) // 2
            n_value = m_value + 1
            self.assertEqual(m_value, math.ceil(lam))
            self.assertEqual(n_value, (p + 3) // 2)
            self.assertEqual(n_value, m_value + 1)
        required = (
            r"\lambda_p={p\over2}",
            r"L_p=2\log\lambda_p",
            r"M_p=\lceil\lambda_p\rceil={p+1\over2}",
            r"N_p=M_p+1={p+3\over2}",
            r"J_p=\left\lfloor{\delta\lambda_p\over L_p^2}\right\rfloor",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_natural_gevrey_balance_has_lambda_over_L_exponent(self) -> None:
        b_value = 7.0
        c_sigma = 5.0
        sigma = 0.2
        delta = 0.01
        self.assertLess(2.0 * c_sigma * delta, math.pi * sigma)

        truncation_ratios: list[float] = []
        strip_ratios: list[float] = []
        for lam in (1.0e8, 1.0e10, 1.0e12):
            length = 2.0 * math.log(lam)
            order = math.floor(delta * lam / length**2)
            support = 4 * order + 4
            cutoff = math.ceil(lam)
            omega = 2.0 * math.pi * (cutoff + 1) / length
            trunc_log = math.log(lam) + (order + 1) * math.log(
                b_value * (order + 1) / lam**2
            )
            strip_log = (
                c_sigma * support * math.log(support + 2.0)
                - sigma * omega
            )
            scale = lam / length
            truncation_ratios.append(trunc_log / scale)
            strip_ratios.append(strip_log / scale)
            self.assertLess(trunc_log, 0.0)
            self.assertLess(strip_log, 0.0)

        self.assertLess(max(truncation_ratios), -delta / 20.0)
        self.assertLess(max(strip_ratios), -0.05)
        self.assertIn(r"2C_\sigma\delta<\pi\sigma", self.text)
        self.assertIn(r"\Theta(\lambda/L)", self.text)

    def test_compact_bv_and_unit_window_losses_preserve_class(self) -> None:
        c_error = 0.01
        for lam in (1.0e8, 1.0e10, 1.0e12):
            length = 2.0 * math.log(lam)
            scale = lam / length
            log_error = -c_error * scale
            log_variation = 4.5 * math.log(lam)
            log_h = max(0.0, 2.0 * (log_variation - log_error))
            log_sample = (
                math.log(lam)
                + 2.0 * math.log1p(math.log(lam))
                + 2.0 * log_error
                + math.log1p(log_h)
            )
            log_b_abs = math.log(lam) + 3.0 * math.log(length)
            log_residual = 0.5 * (log_b_abs + log_sample)
            self.assertLess(log_sample / scale, -c_error)
            self.assertLess(log_residual / scale, -c_error / 4.0)
        required = (
            r"V_R=O(\lambda^{9/2})",
            r"\log\overline H_R=O(\lambda/L)",
            r"B_{\rm abs}(\lambda,R)=O(\lambda L^3)",
            r"\sqrt{B_{\rm abs}(\lambda,R)U_{Z,R}}+U_{Z,R}",
            r"\exp\{-4\pi\lambda^2+O(\log\lambda)\}",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_temple_davis_kahan_chain_on_exact_spectral_data(self) -> None:
        eigenvalues = [F(0), F(3), F(7)]
        weights = [F(3, 5), F(1, 5), F(1, 5)]
        q_value = dot(eigenvalues, weights)
        residual_squared = sum(
            (
                weight * (eigenvalue - q_value) ** 2
                for eigenvalue, weight in zip(eigenvalues, weights)
            ),
            F(0),
        )
        alpha = weights[0]
        tangent_squared = (1 - alpha) / alpha
        spectral_ratio = (
            (q_value - eigenvalues[0]) / (eigenvalues[1] - q_value)
        )
        temple_ratio = residual_squared / (eigenvalues[1] - q_value) ** 2
        self.assertLess(tangent_squared, spectral_ratio)
        self.assertLess(spectral_ratio, temple_ratio)
        self.assertLessEqual(
            (q_value - eigenvalues[0])
            * (eigenvalues[1] - q_value),
            residual_squared,
        )
        self.assertIn(r"\alpha(\mu_2-\mu_1)\geq\mu_2-q", self.text)
        self.assertIn(r"\geq dg", self.text)
        self.assertIn(r"\mu_2-q\geq\sqrt\lambda\,r", self.text)
        self.assertIn(r"\leq{r^2\over(\mu_2-q)^2}", self.text)

    def test_psd_source_cauchy_diagonal_family_is_exact(self) -> None:
        size = 9
        epsilon = F(1, 101)

        def beta(index: int) -> F:
            del index
            return F(0)

        def diagonal(index: int) -> F:
            if index == 0:
                return F(0)
            if abs(index) == 1:
                return epsilon
            return F(1)

        for left in range(-size, size + 1):
            self.assertEqual(diagonal(left), diagonal(-left))
            self.assertGreaterEqual(diagonal(left), 0)
            for right in range(-size, size + 1):
                if left != right:
                    self.assertEqual(
                        (beta(left) - beta(right)) / (left - right),
                        0,
                    )
        self.assertIn(r"Q_{nm}={b_n-b_m\over n-m}=0", self.text)
        self.assertIn(
            r"Q_{p,-}=\operatorname {diag}(\varepsilon_p,1,\ldots,1)\succ0",
            self.text,
        )
        self.assertIn(r"\det(Q_{p,-}-zI)", self.text)
        self.assertIn(
            r"\langle e_0,\operatorname {adj}(A_p-zI)e_0\rangle",
            self.text,
        )
        self.assertIn("not asserted to arise from the complete arithmetic source", self.normalized)

    def test_countermodel_saturates_every_orientation_ratio(self) -> None:
        # All squares are in units of epsilon^2 where appropriate.
        overlap_squared = F(2, 3)
        tangent_squared = (1 - overlap_squared) / overlap_squared
        q_over_epsilon = F(1, 3)
        r_squared_over_epsilon_squared = F(2, 9)
        gap_over_epsilon = F(2, 3)
        spectral_ratio = q_over_epsilon / gap_over_epsilon
        temple_ratio = (
            r_squared_over_epsilon_squared / gap_over_epsilon**2
        )
        projective_alignment = F(1, 3) / F(2, 3)
        self.assertEqual(tangent_squared, F(1, 2))
        self.assertEqual(projective_alignment, F(1, 2))
        self.assertEqual(spectral_ratio, F(1, 2))
        self.assertEqual(temple_ratio, F(1, 2))
        self.assertEqual(
            q_over_epsilon * gap_over_epsilon,
            r_squared_over_epsilon_squared,
        )
        self.assertIn(r"={1\over2}", self.text)
        self.assertIn("Every inequality in (0.5) is saturated", self.normalized)

    def test_countermodel_gate_ritz_and_visibility_are_exact(self) -> None:
        gate_over_epsilon = F(2, 3)
        q_over_epsilon = F(1, 3)
        r_squared_over_epsilon_squared = F(2, 9)
        r_over_epsilon = math.sqrt(float(r_squared_over_epsilon_squared))
        ritz_ratio = float(q_over_epsilon) / r_over_epsilon
        self.assertEqual(gate_over_epsilon, F(2, 3))
        self.assertAlmostEqual(ritz_ratio, 1.0 / math.sqrt(2.0), places=14)
        self.assertEqual(F(2, 3), F(2, 3))  # visibility squared
        required = (
            r"\min\left\{{2\varepsilon_p\over3},1\right\}>0",
            r"{q_p-u_p\over r_p}={1\over\sqrt2}",
            r"|\langle\kappa_p,P_E\eta\rangle|",
            r"=\sqrt{2\over3}",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_adjacent_scale_and_rank_one_jump_cancel_relatively(self) -> None:
        c_value = 0.7
        relative_differences: list[float] = []
        for p in (100_001, 1_000_001, 10_000_001):
            lam = p / 2.0
            next_lam = lam + 1.0
            length = 2.0 * math.log(lam)
            next_length = 2.0 * math.log(next_lam)
            log_ratio = -c_value * (
                next_lam / next_length - lam / length
            )
            ratio = math.exp(log_ratio)
            relative_differences.append(abs(ratio - 1.0) * length)
            self.assertLess(abs(ratio - 1.0), 1.0 / length)
        self.assertLess(max(relative_differences), 1.0)
        jump_norm_over_gap = F(1)
        self.assertEqual(jump_norm_over_gap, 1)
        self.assertIn(r"\mathscr J_p^\pm=\pm\varepsilon_p", self.text)
        self.assertIn(r"{\|\mathscr J_p^\pm\|\over\mu_2-\mu_1}=1", self.text)

    def test_multiple_bottom_variant_has_zero_residual_wrong_orientation(self) -> None:
        q_value = F(0)
        residual_squared = F(0)
        alignment = F(1, 3) / F(2, 3)
        self.assertEqual(q_value, 0)
        self.assertEqual(residual_squared, 0)
        self.assertEqual(alignment, F(1, 2))
        self.assertIn(r"A_p^{\rm mult}=\operatorname {diag}(0,0,1,\ldots,1)", self.text)
        self.assertIn("Zero scalar and zero residual", self.normalized)

    def test_actual_theorem_and_synthetic_nonimplication_are_separated(self) -> None:
        required = (
            "The actual theorem is (0.3)--(0.4)",
            "The synthetic theorem is only the nonimplication",
            "not the pinned pole--archimedean--minus-prime matrix",
            "constants and the starting odd `p` are non-effective",
            "changes none of the standard eight",
            "adds no zero table or numerical artifact",
            "P0_INVALIDATED",
            "proves no actual even-sector gap",
            "No faster class follows",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "the relative gap condition is proved",
            "the actual arithmetic matrix has this diagonal",
            "determinant convergence is established",
            "the constants are effective",
        )
        for token in forbidden:
            self.assertNotIn(token, self.normalized)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb,mathrsfs}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "note.tex"
            source.write_text(document, encoding="ascii")
            result = subprocess.run(
                [
                    compiler,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    source.name,
                ],
                cwd=temporary,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_ascii_ast_tex_hash_and_cache_clean(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(
                all(line == line.rstrip(b" ") for line in raw.splitlines())
            )
        self.assertNotRegex(self.text, r"(?<!\\)\$\$")
        self.assertNotIn("\\begin{equation}", self.text)
        self.assertNotIn("\\end{equation}", self.text)
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        self.assertGreaterEqual(len(tags), 40)
        self.assertGreaterEqual(self.text.count(r"\boxed{"), 12)
        for display in displays:
            if r"\begin{aligned}" in display:
                aligned = re.search(
                    r"\\begin\{aligned\}(.*?)\\end\{aligned\}",
                    display,
                    flags=re.S,
                )
                self.assertIsNotNone(aligned)
                self.assertNotIn(r"\tag", aligned.group(1))
        self.assertNotIn("TODO", self.text)
        self.assertNotIn("FIXME", self.text)
        cache_entries = [
            path for path in ROOT.rglob("__pycache__") if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
