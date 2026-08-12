#!/usr/bin/env python3
"""Strict regressions for the halfgrid Gevrey/coframe exponent mismatch."""

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
NOTE = ROOT / "notes" / "HALFGRID_GEVREY_COFRAME_EXPONENT_MISMATCH_BARRIER.md"
NOTE_HASH = "f213cc99b786ccebf9d9beaa580f0dd07b53083203563679e5ef03457409796a"

FROZEN = {
    "notes/UNCONDITIONAL_NATURAL_HALFGRID_CROSSROOT_SCHEDULE_THEOREM.md":
        "d1b73fc246fcc70886ba78dc074adac585372a2abfc9fbba678c03c4d47e30a5",
    "tests/test_unconditional_natural_halfgrid_crossroot_schedule_theorem.py":
        "00627aa69143c39a468dd06808fe6859beb16aff197127e66a93ff042377f1b9",
    "notes/NATURAL_GEVREY_QUASIMODE_TEMPLE_ORIENTATION_BARRIER.md":
        "c5cabe812995379a9e93fb32bb4ea648d97cbc52c7494d794ef1146cccc4b5c6",
    "tests/test_natural_gevrey_quasimode_temple_orientation_barrier.py":
        "1ce65c5ebd600120f65665cb650dec029f479fc7e95310b408570688e689c212",
    "notes/NATURAL_COMPLETE_SOURCE_KAPPA_DEFLATED_COFRAME_OBSTRUCTION.md":
        "b3a22dc296ada1e1ca9ba2ce49efcac1aa17b2dd6f2c2695ff2221f904508700",
    "tests/test_natural_complete_source_kappa_deflated_coframe_obstruction.py":
        "282252cd2c27992c3a87eff6068ed57c79f6dc32ab769db0e59a0d15b6065dc9",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def lambert_w(value: float) -> float:
    """Principal Lambert W for positive finite test values."""
    if value <= 0.0:
        raise ValueError("positive argument required")
    if value < 3.0:
        estimate = math.log1p(value)
    else:
        first = math.log(value)
        estimate = first - math.log(first)
    for _ in range(30):
        exponential = math.exp(estimate)
        residual = estimate * exponential - value
        derivative = exponential * (estimate + 1.0)
        update = residual / derivative
        estimate -= update
        if abs(update) <= 2e-15 * max(1.0, abs(estimate)):
            break
    return estimate


def coefficient(theta: float, rho: float) -> float:
    return 4.0 * (1.0 - theta) * math.log(theta / rho)


def optimized(rho: float) -> tuple[float, float]:
    w_value = lambert_w(math.e / rho)
    theta = 1.0 / w_value
    exponent = 4.0 * (w_value - 1.0) ** 2 / w_value
    return theta, exponent


def product(values: list[F]) -> F:
    result = F(1)
    for value in values:
        result *= value
    return result


def residue_vector(nodes: list[F], zero_nodes: list[F], u: F, v: F) -> list[F]:
    def polynomial_value(value: F) -> F:
        return product([value - root for root in zero_nodes])

    answer = []
    for index, node in enumerate(nodes):
        derivative = product(
            [node - other for j, other in enumerate(nodes) if j != index]
        )
        answer.append(polynomial_value(node) * (u + v * node) / derivative)
    return answer


class HalfgridGevreyCoframeExponentMismatchTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_minimal_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 6)
        self.assertEqual(
            sum(relative.startswith("notes/") for relative in FROZEN), 3
        )
        self.assertEqual(
            sum(relative.startswith("tests/") for relative in FROZEN), 3
        )
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_roundable_range_forces_rho_at_most_one_half(self) -> None:
        for log_lambda in (40.0, 80.0, 160.0):
            logarithmic_length = 2.0 * log_lambda
            lambda_value = math.exp(log_lambda)
            schedules = (
                lambda_value ** 0.7,
                lambda_value,
                lambda_value * math.sqrt(logarithmic_length),
            )
            for cutoff in schedules:
                rho = lambert_w(cutoff / math.e) / logarithmic_length
                self.assertLess(rho, 0.51)
                self.assertGreater(cutoff / logarithmic_length**2, 10.0)
                self.assertLess(cutoff / (lambda_value * logarithmic_length), 0.2)
        self.assertIn(r"R=o(\lambda L)", self.text)
        self.assertIn(r"\limsup_{R\to\infty}\rho_R\leq{1\over2}", self.text)

    def test_general_gevrey_order_has_R_over_L_exponent(self) -> None:
        delta = 0.005
        for log_lambda in (40.0, 80.0, 120.0):
            logarithmic_length = 2.0 * log_lambda
            lambda_value = math.exp(log_lambda)
            for cutoff in (
                lambda_value ** 0.75,
                lambda_value,
                lambda_value * math.sqrt(logarithmic_length),
            ):
                order = delta * cutoff / logarithmic_length**2
                self.assertGreater(order, 1.0)
                self.assertLess(order, lambda_value / logarithmic_length)
                edge_scale = cutoff / logarithmic_length
                entropy_ratio = order * math.log(order + 2.0) / edge_scale
                self.assertLess(entropy_ratio, 0.01)
                truncation_log = (
                    order * math.log(lambda_value**2 / (order + 1.0))
                    - log_lambda
                )
                self.assertGreater(truncation_log / edge_scale, 0.001)
        required = (
            r"J_R=\left\lfloor{\delta R\over L^2}\right\rfloor",
            r"\sigma\Omega_R=\Theta(R/L)",
            "best exponent *class furnished by these estimates*",
            r"|q_R|+r_R=O\!\left(e^{-c_QR/L}\right)",
            "square root in (4.3)",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        self.assertNotIn(r"c_*(\rho)=4,{", self.normalized)
        self.assertIn(r"c_*(\rho)=4\,{", self.normalized)

    def test_lambert_inverts_the_Riemann_von_mangoldt_main_term(self) -> None:
        for cutoff in (1e3, 1e6, 1e12, 1e24):
            for theta in (0.6, 0.73, 0.9):
                w_value = lambert_w(theta * cutoff / math.e)
                threshold = 2.0 * math.pi * theta * cutoff / w_value
                main_count = threshold / (2.0 * math.pi) * math.log(
                    threshold / (2.0 * math.pi * math.e)
                )
                self.assertAlmostEqual(main_count / cutoff, theta, places=12)
        self.assertIn(
            r"T_{\theta,R}={2\pi\theta R\over",
            self.text,
        )
        self.assertIn(r"{\mathcal W}(\theta R/e)", self.text)

    def test_two_dimensional_residues_deflate_an_arbitrary_anchor(self) -> None:
        nodes = [F(index * index) for index in range(1, 9)]
        zero_nodes = [F(2), F(6), F(12), F(20)]
        constant = residue_vector(nodes, zero_nodes, F(1), F(0))
        linear = residue_vector(nodes, zero_nodes, F(0), F(1))
        anchor = [F(index + 2) for index in range(len(nodes))]
        anchor_constant = sum((a * x for a, x in zip(anchor, constant)), F(0))
        anchor_linear = sum((a * x for a, x in zip(anchor, linear)), F(0))
        deflated = [
            anchor_linear * x - anchor_constant * y
            for x, y in zip(constant, linear)
        ]
        self.assertTrue(any(deflated))
        self.assertEqual(
            sum((a * x for a, x in zip(anchor, deflated)), F(0)), F(0)
        )
        # N=8, m=4, degree one: s=2 vanished moments.
        for power in (0, 1):
            self.assertEqual(
                sum((x * node**power for x, node in zip(deflated, nodes)), F(0)),
                F(0),
            )
        self.assertIn("works for every anchor", self.text)
        self.assertIn("creates no derivative condition", self.text)

    def test_general_optimizer_and_uniform_natural_constant(self) -> None:
        natural_theta, natural_exponent = optimized(0.5)
        self.assertAlmostEqual(natural_theta, 0.7273666087805324, places=14)
        self.assertAlmostEqual(natural_exponent, 0.4087565478566230, places=14)
        for rho in (0.5, 0.4, 0.25, 0.1, 0.01):
            theta, exponent = optimized(rho)
            derivative = -math.log(theta / rho) + (1.0 - theta) / theta
            self.assertAlmostEqual(derivative, 0.0, places=13)
            self.assertAlmostEqual(exponent, coefficient(theta, rho), places=13)
            self.assertGreaterEqual(exponent, natural_exponent - 1e-13)
            self.assertGreaterEqual(
                coefficient(natural_theta, rho), natural_exponent - 1e-13
            )
            nearby = (
                max(rho + 1e-8, theta - 0.03),
                min(1.0 - 1e-8, theta + 0.03),
            )
            for candidate in nearby:
                self.assertLessEqual(coefficient(candidate, rho), exponent + 1e-12)
        required = (
            r"c(\theta,\rho)=4(1-\theta)\log{\theta\over\rho}",
            r"\theta_*(\rho)={1\over {\mathcal W}(e/\rho)}",
            r"c_*(\rho)=4",
            "0.408756547856",
            "Subnatural schedules never weaken the obstruction",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_bridge_projection_ratio_cannot_remove_factor_L(self) -> None:
        for logarithmic_length in (40.0, 80.0, 160.0):
            for alpha in (0.1, 0.5, 0.9, 0.999):
                mismatch = logarithmic_length / alpha
                self.assertGreaterEqual(mismatch, logarithmic_length)
        required = (
            "three indices which must not be conflated",
            "`M_b<R` is a possible lower bridge projection",
            "`m=floor(theta*R)` is the number of distinct zero rows",
            r"\asymp {L\over\alpha}\geq L",
            "adjacent choice `M_b=R-O(1)` is already the least-bad choice",
            "does not alter the full centered compression",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_near_quadratic_balance_violates_rounding(self) -> None:
        for logarithmic_length in (40.0, 80.0, 160.0, 320.0):
            rho = 1.0 - 1.0 / math.sqrt(logarithmic_length)
            w_value = rho * logarithmic_length
            # rho=W(R/e)/L, so R=e*w*exp(w).
            log_cutoff = 1.0 + math.log(w_value) + w_value
            log_rounding_ratio = (
                log_cutoff
                - logarithmic_length / 2.0
                - math.log(logarithmic_length)
            )
            _, exponent = optimized(rho)
            self.assertGreater(log_rounding_ratio, logarithmic_length / 4.0)
            self.assertGreater(exponent * logarithmic_length, 0.5)
            self.assertLess(exponent * logarithmic_length, 2.0)
        required = (
            r"c_*(\rho)=(1-\rho)^2+O((1-\rho)^3)",
            r"1-\rho=O(L^{-1/2})",
            r"\log R=L-O(\sqrt L)",
            r"{R\over\lambda L}\longrightarrow\infty",
            "only a formal exponent-balancing scale",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_one_sided_q_logic_rh_scope_and_claim_boundary(self) -> None:
        required = (
            "Assume RH in Sections 5--8 only",
            "On RH, and only on RH",
            "necessary condition for that gate",
            "It is not a proof that the gate fails",
            "one-sided",
            "signature-`(1,1)` Krein block",
            "not a positive subform in Loewner order",
            "changes none of the standard eight",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "the centered gate fails eventually",
            "the centered gate is proved",
            "critical-line rows are an unconditional positive subform",
            "q_R is asymptotic to",
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
                [compiler, "-interaction=nonstopmode", "-halt-on-error", source.name],
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
            self.assertTrue(all(line == line.rstrip(b" ") for line in raw.splitlines()))
        self.assertNotRegex(self.text, r"(?<!\\)\$\$")
        self.assertNotIn("\\begin{equation}", self.text)
        self.assertNotIn("\\end{equation}", self.text)
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
        self.assertNotIn("TODO", self.text)
        self.assertNotIn("FIXME", self.text)
        cache_entries = [
            path for path in ROOT.rglob("__pycache__") if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
