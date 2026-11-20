#!/usr/bin/env python3
"""Strict regressions for the natural complete-source coframe obstruction."""

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

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "NATURAL_COMPLETE_SOURCE_KAPPA_DEFLATED_COFRAME_OBSTRUCTION.md"
NOTE_HASH = "b3a22dc296ada1e1ca9ba2ce49efcac1aa17b2dd6f2c2695ff2221f904508700"

FROZEN = {
    "notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md":
        "ce6863d26788de9fc0fd9e998094fcb7982845ca298ccf8048d0913f62470450",
    "tests/test_natural_cutoff_signed_ground_alignment.py":
        "3ae99e6bbbc0004aa2560a577eca16d6ef0221d28fb2aefc3aef1d9558fae0bb",
    "notes/UNCONDITIONAL_NATURAL_HALFGRID_HSW_SCALAR_TO_EVEN_FRAME_BARRIER.md":
        "4d6036eb24abed92857cca6a169613827e479834eeb980868d09e57207629613",
    "tests/test_unconditional_natural_halfgrid_hsw_scalar_to_even_frame_barrier.py":
        "5545846473c70c25003f23c3cbd9cc317414d39093bbc92a31133261a5d9d237",
    "notes/NATURAL_GEVREY_QUASIMODE_TEMPLE_ORIENTATION_BARRIER.md":
        "c5cabe812995379a9e93fb32bb4ea648d97cbc52c7494d794ef1146cccc4b5c6",
    "tests/test_natural_gevrey_quasimode_temple_orientation_barrier.py":
        "1ce65c5ebd600120f65665cb650dec029f479fc7e95310b408570688e689c212",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def product(values: list[F]) -> F:
    answer = F(1)
    for value in values:
        answer *= value
    return answer


def polynomial_from_roots(roots: list[F]) -> list[F]:
    coefficients = [F(1)]
    for root in roots:
        updated = [F(0)] * (len(coefficients) + 1)
        for index, coefficient in enumerate(coefficients):
            updated[index] -= root * coefficient
            updated[index + 1] += coefficient
        coefficients = updated
    return coefficients


def polynomial_value(coefficients: list[F], value: F) -> F:
    answer = F(0)
    for coefficient in reversed(coefficients):
        answer = answer * value + coefficient
    return answer


def residue_vector(nodes: list[F], zero_nodes: list[F], u: F, v: F) -> list[F]:
    p_coefficients = polynomial_from_roots(zero_nodes)
    answer = []
    for index, node in enumerate(nodes):
        derivative = product(
            [node - other for other_index, other in enumerate(nodes) if other_index != index]
        )
        answer.append(polynomial_value(p_coefficients, node) * (u + v * node) / derivative)
    return answer


class NaturalCompleteSourceKappaDeflatedCoframeTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_minimal_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 6)
        self.assertEqual(sum(path.startswith("notes/") for path in FROZEN), 3)
        self.assertEqual(sum(path.startswith("tests/") for path in FROZEN), 3)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_centered_scalar_cancellation(self) -> None:
        a_tail = np.array(
            [[3.0, 0.2, -0.1], [0.2, 2.5, 0.3], [-0.1, 0.3, 4.0]]
        )
        t_discrepancy = np.array(
            [[0.5, -0.4, 0.2], [-0.4, 1.0, 0.1], [0.2, 0.1, -0.25]]
        )
        h_source = a_tail - t_discrepancy
        c_source = -1.37218
        q_matrix = c_source * np.eye(3) + h_source
        kappa = np.array([1.0, 2.0, -1.0]) / math.sqrt(6.0)
        trial = np.array([2.0, -1.0, 0.0]) / math.sqrt(5.0)
        self.assertAlmostEqual(float(kappa @ trial), 0.0)
        q_value = float(kappa @ q_matrix @ kappa)
        centered = float(trial @ (q_matrix - q_value * np.eye(3)) @ trial)
        relative = float(trial @ h_source @ trial - kappa @ h_source @ kappa)
        self.assertAlmostEqual(centered, relative, places=14)
        self.assertIn(r"\langle v,H_qv\rangle", self.text)
        self.assertIn(r"\mathfrak h_\lambda(v)-\mathfrak h_\lambda(\kappa)", self.text)
        self.assertIn(r"Q_+=c_*I+H_D", self.text)
        self.assertIn(r"c_*=\psi(1/4)-\log\pi+4", self.text)
        self.assertIn("source-independent scalar cancels", self.normalized)

    def test_natural_rank_deficits_at_one_and_two_carrier_edges(self) -> None:
        for logarithmic_length in (40.0, 80.0, 160.0):
            dimension = math.exp(logarithmic_length / 2.0)
            omega = 2.0 * math.pi * dimension / logarithmic_length
            ratios = []
            for multiplier in (1.0, 2.0):
                height = multiplier * omega
                main_count = height / (2.0 * math.pi) * math.log(
                    height / (2.0 * math.pi * math.e)
                )
                ratios.append(main_count / dimension)
            self.assertLess(ratios[0], 0.5)
            self.assertLess(ratios[1], 1.0)
        self.assertIn(r"\mathcal N(2\Omega_N)<N", self.text)
        self.assertIn("necessary occurrence-count threshold", self.text)

    def test_two_dimensional_residue_family_and_kappa_deflation(self) -> None:
        nodes = [F(index * index) for index in range(1, 9)]
        zero_nodes = [F(2), F(6), F(12), F(20)]
        constant = residue_vector(nodes, zero_nodes, F(1), F(0))
        linear = residue_vector(nodes, zero_nodes, F(0), F(1))
        matrix = np.array(
            [[float(value) for value in constant], [float(value) for value in linear]]
        )
        self.assertEqual(np.linalg.matrix_rank(matrix, tol=1e-12), 2)

        test_value = F(7, 2)
        numerator = product([test_value - root for root in zero_nodes]) * (F(3) - test_value)
        denominator = product([test_value - node for node in nodes])
        combined = residue_vector(nodes, zero_nodes, F(3), F(-1))
        partial_fraction = sum(
            (coefficient / (test_value - node) for coefficient, node in zip(combined, nodes)),
            F(0),
        )
        self.assertEqual(partial_fraction, numerator / denominator)
        for zero_node in zero_nodes:
            self.assertEqual(
                sum(
                    (coefficient / (zero_node - node) for coefficient, node in zip(combined, nodes)),
                    F(0),
                ),
                0,
            )

        kappa = [F(index + 1) for index in range(8)]
        anchor_constant = sum((x * y for x, y in zip(kappa, constant)), F(0))
        anchor_linear = sum((x * y for x, y in zip(kappa, linear)), F(0))
        deflated = [
            anchor_linear * x - anchor_constant * y
            for x, y in zip(constant, linear)
        ]
        self.assertTrue(any(deflated))
        self.assertEqual(sum((x * y for x, y in zip(kappa, deflated)), F(0)), 0)
        self.assertIn(r"\mathcal S_N\cap\kappa^\perp", self.text)
        self.assertIn("two-dimensional complex subspace", self.text)

    def test_residue_moments_endpoint_flatness_and_carrier_branch(self) -> None:
        nodes = [F(index * index) for index in range(1, 9)]
        zero_nodes = [F(2), F(6), F(12), F(20)]
        coefficients = residue_vector(nodes, zero_nodes, F(5), F(-2))
        # N=8, M=4, and deg R=1 give s=N-M-2=2 vanished moments.
        for power in (0, 1):
            self.assertEqual(
                sum((coefficient * node**power for coefficient, node in zip(coefficients, nodes)), F(0)),
                0,
            )

        carrier_zero_nodes = [nodes[1], F(6), F(12), F(20)]
        carrier_coefficients = residue_vector(nodes, carrier_zero_nodes, F(1), F(1))
        self.assertEqual(carrier_coefficients[1], 0)
        self.assertIn(r"0\leq j\leq2s-1", self.text)
        self.assertIn("continuous carrier row is supported on coordinate", self.text)

    def test_rvm_threshold_and_tail_power_bookkeeping(self) -> None:
        theta = 0.72
        epsilon = 0.1
        for logarithmic_length in (40.0, 80.0, 160.0):
            dimension = math.exp(logarithmic_length / 2.0)
            threshold = (4.0 * math.pi * theta - epsilon) * dimension / logarithmic_length
            main_count = threshold / (2.0 * math.pi) * math.log(
                threshold / (2.0 * math.pi * math.e)
            )
            self.assertLess(main_count / dimension, theta - epsilon / (8.0 * math.pi))
            omega = 2.0 * math.pi * dimension / logarithmic_length
            self.assertLess(omega / threshold, 1.0)
        self.assertIn(r"\sum_{\gamma>T}m_\gamma\gamma^{-p}", self.text)
        self.assertIn(r"p=4s", self.text)
        self.assertIn("direction is safe under arbitrary multiplicity", self.text)

    def test_optimized_endpoint_flat_exponent(self) -> None:
        lower = 0.5 + 1e-12
        upper = 1.0 - 1e-12
        for _ in range(100):
            middle = (lower + upper) / 2.0
            derivative_sign = 1.0 / middle - 1.0 - math.log(2.0 * middle)
            if derivative_sign > 0.0:
                lower = middle
            else:
                upper = middle
        theta = (lower + upper) / 2.0
        exponent = 4.0 * (1.0 - theta) * math.log(2.0 * theta)
        self.assertAlmostEqual(theta, 0.7273666087805324, places=14)
        self.assertAlmostEqual(exponent, 0.4087565478566230, places=14)
        for dimension in (101, 1001, 10001):
            selected = math.floor(theta * dimension)
            flat_order = dimension - selected - 2
            finite_exponent = 4.0 * flat_order / dimension * math.log(2.0 * theta)
            self.assertLess(finite_exponent, exponent)
            self.assertGreater(finite_exponent, exponent - 0.03)
        self.assertIn("0.4087565479", self.text)
        self.assertIn(r"c_{\rm flat,*}", self.text)

    def test_one_sided_q_caveat_and_minimal_relative_theorem(self) -> None:
        required = (
            "one-sided bound",
            r"|q_p|=O\!\left(\exp[-cN_p/L_p]\right)",
            r"q\geq\exp[-CN/L]",
            "opposite direction",
            "permits `q` to lie below the endpoint-flat scale",
            "relative deflated frame",
            "not an absolute Paley--Wiener or de Branges sampling bound",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        self.assertNotIn("the one-sided bound proves gate failure", self.normalized)
        self.assertNotIn("q is asymptotic to exp(-cN/L)", self.normalized)

    def test_rh_scope_krein_signature_and_fail_closed_boundary(self) -> None:
        required = (
            "Assume RH in Sections 3--7 only",
            "On RH, and only on RH",
            "signature `(1,1)`",
            "not positive subforms of the complete source",
            "does not claim that one finite `kappa`-deflated compression is equivalent to RH",
            "P0_INVALIDATED",
            "changes none of the standard eight",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "Equation (7.4) is proved",
            "The centered gate is proved",
            "critical-line zeros are a Loewner subform off RH",
            "the finite gate is equivalent to RH",
        )
        for token in forbidden:
            self.assertNotIn(token, self.normalized)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
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
