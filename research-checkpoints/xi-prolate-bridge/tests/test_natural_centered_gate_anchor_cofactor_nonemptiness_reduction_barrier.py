#!/usr/bin/env python3
"""Strict regressions for the natural centered-gate/cofactor barrier."""

from __future__ import annotations

import ast
import hashlib
import itertools
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "NATURAL_CENTERED_GATE_ANCHOR_COFACTOR_NONEMPTYNESS_REDUCTION_BARRIER.md"
)
NOTE_HASH = "88f6ffa991547f5ca88aacce893a585f3047d7675200288cd18a57cbbcfb7699"

FROZEN = {
    "notes/EVEN_SECTOR_CROSS_ROOT_LIMIT_BRIDGE.md":
        "c8656f4c5e574ac30972b0645015a3bb57492908efbf0e57ddef5de9c0c6e9c2",
    "tests/test_even_sector_cross_root_limit_bridge.py":
        "73d7705dc170c7081cf99a7669bd74493ed937cac75dcaa075beacdbf9e3b3b1",
    "notes/NATURAL_ADJUGATE_PLUCKER_INVERSE_CHRISTOFFEL_COVARIANCE_REDUCTION_BARRIER.md":
        "4506f01ad61c6110bd09f05b98be5318a4f47a35172a37b2560c350057a06146",
    "tests/test_natural_adjugate_plucker_inverse_christoffel_covariance_reduction_barrier.py":
        "3fdd3f9f8196eab4d99d73bb31eec3e716dc873b4d6dac6ca6f273e41a24a2ea",
    "notes/NATURAL_OUTER_SHELL_LARGE_SIEVE_INVERSE_SPREAD_BARRIER.md":
        "79be0448f5e144819ee9eb2e249021c3c5ffe44949a58b75002e2a117c1b85da",
    "tests/test_natural_outer_shell_large_sieve_inverse_spread_barrier.py":
        "e65c890a6f97def68b48825ccb8c3148926c744cd77f27754fb7790534dbabf8",
    "notes/NATURAL_GEVREY_QUASIMODE_TEMPLE_ORIENTATION_BARRIER.md":
        "c5cabe812995379a9e93fb32bb4ea648d97cbc52c7494d794ef1146cccc4b5c6",
    "tests/test_natural_gevrey_quasimode_temple_orientation_barrier.py":
        "1ce65c5ebd600120f65665cb650dec029f479fc7e95310b408570688e689c212",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def complement(anchor: np.ndarray) -> np.ndarray:
    """Return an orthonormal column chart of anchor-perp."""
    _, _, right = np.linalg.svd(anchor.reshape(1, -1), full_matrices=True)
    return right[1:, :].T


def adjugate(matrix: np.ndarray) -> np.ndarray:
    """Compute the classical adjugate, including singular matrices."""
    size = matrix.shape[0]
    result = np.empty_like(matrix, dtype=float)
    if size == 1:
        result[0, 0] = 1.0
        return result
    for row in range(size):
        for column in range(size):
            minor = np.delete(np.delete(matrix, column, axis=0), row, axis=1)
            result[row, column] = (-1.0) ** (row + column) * np.linalg.det(minor)
    return result


class NaturalCenteredGateAnchorCofactorTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_minimal_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 8)
        self.assertEqual(
            sum(relative.startswith("notes/") for relative in FROZEN), 4
        )
        self.assertEqual(
            sum(relative.startswith("tests/") for relative in FROZEN), 4
        )
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_axis_root_and_eta_free_normalizations_are_frozen(self) -> None:
        required = (
            "every simple lowest even source-Cauchy eigenvector",
            "including the zero-boundary-pairing case",
            r"s=\langle g,\kappa\rangle",
            r"g={P\kappa\over s}",
            r"\rho=\langle\kappa,P\kappa\rangle=|s|^2",
            r"X={P\kappa\over\rho}",
            r"{\Delta^\kappa\over k\rho^2}=\|P_{\cal L}X\|^2",
            r"\sum_{p\in{\cal G}_P}{\Delta_p^\kappa\over k_p}",
            r"\sum_{p\in{\cal G}_P}\rho_p^2",
            "without using `P*eta`",
        )
        for token in required:
            self.assertIn(token, self.normalized)

        ground = np.array([2.0, -1.0, 2.0]) / 3.0
        anchor = np.array([1.0, 2.0, 2.0]) / 3.0
        projector = np.outer(ground, ground)
        scalar = float(ground @ anchor)
        rho = float(anchor @ projector @ anchor)
        self.assertNotEqual(scalar, 0.0)
        self.assertTrue(np.allclose(projector @ anchor / scalar, ground))
        self.assertAlmostEqual(rho, scalar**2)
        normalized = projector @ anchor / rho
        self.assertAlmostEqual(float(anchor @ normalized), 1.0)

    def test_affine_centered_gate_exact_ritz_and_r_zero_closure(self) -> None:
        anchor = np.array([1.0, 0.0, 0.0])
        chart = complement(anchor)
        matrix = np.array(
            [[2.0, 1.0, 0.0], [1.0, 4.0, 0.0], [0.0, 0.0, 5.0]]
        )
        q_value = float(anchor @ matrix @ anchor)
        residual = (matrix - q_value * np.eye(3)) @ anchor
        r_value = float(np.linalg.norm(residual))
        direction = residual / r_value
        a_value = float(direction @ matrix @ direction)
        ritz = np.array([[q_value, r_value], [r_value, a_value]])
        u_value = float(np.linalg.eigvalsh(ritz)[0])
        d_value = q_value - u_value
        tau = d_value / r_value
        h_q = chart.T @ (matrix - q_value * np.eye(3)) @ chart
        h_u = chart.T @ (matrix - u_value * np.eye(3)) @ chart
        self.assertGreater(float(np.linalg.eigvalsh(h_q)[0]), 0.0)
        self.assertAlmostEqual(d_value * (a_value - u_value), r_value**2)
        self.assertAlmostEqual((a_value - q_value) / r_value, 1.0 / tau - tau)
        self.assertGreater(tau, 0.0)
        self.assertLess(tau, 1.0)
        self.assertTrue(np.allclose(h_u, h_q + d_value * np.eye(2)))
        self.assertGreater(float(np.linalg.eigvalsh(h_u)[0]), d_value)

        other = np.array(
            [[-1.0, 2.0, 0.0], [2.0, 1.0, 0.0], [0.0, 0.0, 3.0]]
        )

        def centered(value: np.ndarray) -> np.ndarray:
            mean = float(anchor @ value @ anchor)
            return chart.T @ (value - mean * np.eye(3)) @ chart

        self.assertTrue(np.allclose(centered(matrix + other), centered(matrix) + centered(other)))

        exact = np.diag([1.0, 3.0, 4.0])
        exact_q = float(anchor @ exact @ anchor)
        exact_residual = (exact - exact_q * np.eye(3)) @ anchor
        exact_h = chart.T @ (exact - exact_q * np.eye(3)) @ chart
        self.assertAlmostEqual(float(np.linalg.norm(exact_residual)), 0.0)
        self.assertGreater(float(np.linalg.eigvalsh(exact_h)[0]), 0.0)
        projector = np.outer(anchor, anchor)
        self.assertAlmostEqual(float(anchor @ projector @ anchor), 1.0)
        transverse = np.array([0.0, 1.0, 0.0])
        self.assertAlmostEqual(float(transverse @ projector @ anchor), 0.0)
        self.assertIn("immediate `r=0` closure branch", self.text)

    def test_anchor_cofactor_and_one_level_count_characterization(self) -> None:
        rng = np.random.default_rng(20260812)
        for size in (2, 3, 5):
            for _ in range(12):
                raw = rng.normal(size=(size, size))
                matrix = (raw + raw.T) / 2.0
                anchor = rng.normal(size=size)
                anchor /= np.linalg.norm(anchor)
                chart = complement(anchor)
                eigenvalues = np.linalg.eigvalsh(matrix)
                for offset in (-0.37, 0.19, 0.71):
                    t_value = float(eigenvalues[0] + offset)
                    h_t = chart.T @ (matrix - t_value * np.eye(size)) @ chart
                    d_value = float(np.linalg.det(h_t))
                    cofactor = float(
                        anchor
                        @ adjugate(matrix - t_value * np.eye(size))
                        @ anchor
                    )
                    self.assertAlmostEqual(d_value, cofactor, places=9)
                    lhs = float(np.linalg.eigvalsh(h_t)[0]) > 1e-9
                    rhs = eigenvalues[1] > t_value and d_value > 0.0
                    self.assertEqual(lhs, rhs)

        matrix = np.diag([-3.0, -2.0, 4.0])
        anchor = np.array([0.0, 0.0, 1.0])
        chart = complement(anchor)
        h_zero = chart.T @ matrix @ chart
        self.assertGreater(float(np.linalg.det(h_zero)), 0.0)
        self.assertLessEqual(float(np.linalg.eigvalsh(matrix)[1]), 0.0)
        self.assertLess(float(np.linalg.eigvalsh(h_zero)[0]), 0.0)
        self.assertIn(r"\mu_2(A)>q\ \hbox{ and }\ D(q)>0", self.text)
        self.assertIn("positive determinant alone", self.text)

    def test_normalized_cubic_moment_is_the_exact_ritz_statistic(self) -> None:
        matrix = np.array(
            [[1.5, 0.7, 0.0], [0.7, 3.0, 0.2], [0.0, 0.2, 5.0]]
        )
        anchor = np.array([1.0, 0.0, 0.0])
        q_value = float(anchor @ matrix @ anchor)
        shifted = matrix - q_value * np.eye(3)
        residual = shifted @ anchor
        r_value = float(np.linalg.norm(residual))
        direction = residual / r_value
        a_value = float(direction @ matrix @ direction)
        u_value = float(
            np.linalg.eigvalsh(
                np.array([[q_value, r_value], [r_value, a_value]])
            )[0]
        )
        tau = (q_value - u_value) / r_value
        m_three = float(anchor @ shifted @ shifted @ shifted @ anchor)
        chi = m_three / r_value**3
        self.assertAlmostEqual(m_three, r_value**2 * (a_value - q_value))
        self.assertAlmostEqual(chi, 1.0 / tau - tau)
        for constant in (0.25, 0.75, 2.0):
            self.assertEqual(
                tau <= constant,
                chi >= 1.0 / constant - constant,
            )
        self.assertIn(r"\chi={m_3\over r^3}", self.text)
        self.assertIn("self-normalized third moment", self.normalized)

    def test_universal_g_n_fold_determinant_is_column_multilinearity(self) -> None:
        samples = [
            np.array([[2.0, 1.0, 0.0], [0.0, -1.0, 3.0], [1.0, 2.0, 1.0]]),
            np.array([[1.0, -2.0, 1.0], [4.0, 0.0, 1.0], [0.0, 3.0, -1.0]]),
            np.array([[-1.0, 1.0, 2.0], [2.0, 2.0, 0.0], [3.0, -1.0, 4.0]]),
        ]
        weights = np.array([0.25, -0.5, 1.25])
        h_value = -sum(weight * sample for weight, sample in zip(weights, samples))
        expanded = 0.0
        for choices in itertools.product(range(len(samples)), repeat=3):
            columns = np.column_stack(
                [samples[choices[column]][:, column] for column in range(3)]
            )
            coefficient = math.prod(weights[index] for index in choices)
            expanded += coefficient * float(np.linalg.det(columns))
        self.assertAlmostEqual(float(np.linalg.det(h_value)), -expanded)
        self.assertIn(r"D_p(q_p)=(-1)^d\int_{[0,L]^d}", self.text)
        self.assertIn(r"\det[\Phi_{ij}(t_j)]_{i,j=1}^d", self.text)
        self.assertIn("growing-order signed correlation", self.text)
        self.assertIn("`d=N_p=(p+3)/2`", self.text)

    def test_prime_threshold_rank_one_and_adaptive_cofactor_contrast(self) -> None:
        anchor = np.array([1.0, 0.0, 0.0])
        chart = complement(anchor)
        eta = np.array([2.0, -1.0, 3.0])
        constant = 0.7
        delta_a = -constant * np.outer(eta, eta)
        delta_q = float(anchor @ delta_a @ anchor)
        eta_chart = chart.T @ eta
        delta_h = chart.T @ delta_a @ chart - delta_q * np.eye(2)
        expected = -constant * (
            np.outer(eta_chart, eta_chart)
            - float(anchor @ eta) ** 2 * np.eye(2)
        )
        self.assertTrue(np.allclose(delta_h, expected))

        h_value = np.diag([2.0, 5.0])
        derivative = float(np.trace(adjugate(h_value) @ delta_h))
        contrast = -constant * (
            float(eta_chart @ adjugate(h_value) @ eta_chart)
            - float(anchor @ eta) ** 2 * float(np.trace(adjugate(h_value)))
        )
        self.assertAlmostEqual(derivative, contrast)

        boundary = np.diag([0.0, 3.0])
        boundary_adj = adjugate(boundary)
        eta_kernel = np.array([0.0, 1.0, 0.0])
        eta_anchor = np.array([1.0, 0.0, 0.0])

        def boundary_jump(vector: np.ndarray) -> float:
            reduced = chart.T @ vector
            return -constant * (
                float(reduced @ boundary_adj @ reduced)
                - float(anchor @ vector) ** 2 * float(np.trace(boundary_adj))
            )

        self.assertLess(boundary_jump(eta_kernel), 0.0)
        self.assertGreater(boundary_jump(eta_anchor), 0.0)
        self.assertIn(r"\Delta\partial_LA(L_0)", self.text)
        self.assertIn("right derivative minus the left derivative", self.text)
        self.assertIn("The contrast has no fixed sign", self.text)

    def test_arbitrary_anchor_rank_one_source_cauchy_empty_good_family(self) -> None:
        size = 4
        modes = np.arange(-size, size + 1, dtype=float)
        eta_raw = np.ones(2 * size + 1)
        epsilon = math.exp(-20.0)
        constant = epsilon / (2 * size + 1)
        b_values = constant * modes
        raw = np.full((2 * size + 1, 2 * size + 1), constant)
        for row in range(raw.shape[0]):
            for column in range(raw.shape[1]):
                if row != column:
                    quotient = (
                        b_values[row] - b_values[column]
                    ) / (modes[row] - modes[column])
                    self.assertAlmostEqual(raw[row, column], quotient)
        self.assertAlmostEqual(float(np.linalg.norm(raw, 2)), epsilon)

        even = np.zeros((2 * size + 1, size + 1))
        even[size, 0] = 1.0
        for index in range(1, size + 1):
            even[size + index, index] = 1.0 / math.sqrt(2.0)
            even[size - index, index] = 1.0 / math.sqrt(2.0)
        matrix = even.T @ raw @ even
        eta_even = even.T @ eta_raw
        self.assertTrue(np.allclose(matrix, constant * np.outer(eta_even, eta_even)))
        anchor = np.array([1.0, -2.0, 1.5, 0.25, -0.75])
        anchor /= np.linalg.norm(anchor)
        q_value = float(anchor @ matrix @ anchor)
        residual = (matrix - q_value * np.eye(size + 1)) @ anchor
        theta = float(anchor @ eta_even) ** 2 / float(eta_even @ eta_even)
        self.assertAlmostEqual(q_value, epsilon * theta)
        self.assertAlmostEqual(
            float(np.linalg.norm(residual)),
            epsilon * math.sqrt(theta * (1.0 - theta)),
        )
        self.assertLessEqual(float(np.linalg.norm(residual)), epsilon / 2.0)

        bottom = np.eye(size + 1) - np.outer(eta_even, eta_even) / float(
            eta_even @ eta_even
        )
        self.assertTrue(np.allclose(bottom @ eta_even, 0.0, atol=1e-14))
        self.assertEqual(
            sum(abs(value) < 1e-14 for value in np.linalg.eigvalsh(matrix)),
            size,
        )
        chart = complement(anchor)
        h_q = chart.T @ (matrix - q_value * np.eye(size + 1)) @ chart
        self.assertLessEqual(float(np.linalg.eigvalsh(h_q)[0]), 1e-15)
        self.assertIn("any prescribed unit inversion-even anchor", self.text)
        self.assertIn("actual natural projected prolate anchor", self.text)
        self.assertIn("every centered, simple, or canonical", self.text)
        self.assertIn("structural synthetic source", self.text)

    def test_strict_centered_gate_can_have_zero_eta_visibility(self) -> None:
        size = 6
        count = size - 1
        constant = 0.03
        eta = np.concatenate(([1.0], np.full(size, math.sqrt(2.0))))
        diagonal = np.diag([0.0, 0.0] + [1.0] * count)
        matrix = constant * np.outer(eta, eta) + diagonal
        x_value = np.zeros(size + 1)
        x_value[0] = math.sqrt(2.0 / 3.0)
        x_value[1] = -1.0 / math.sqrt(3.0)
        h_value = np.zeros(size + 1)
        h_value[0] = 1.0 / math.sqrt(3.0)
        h_value[1] = math.sqrt(2.0 / 3.0)
        t_value = np.zeros(size + 1)
        t_value[2:] = 1.0 / math.sqrt(count)
        block = np.array(
            [
                [3.0 * constant, constant * math.sqrt(6.0 * count)],
                [constant * math.sqrt(6.0 * count), 1.0 + 2.0 * constant * count],
            ]
        )
        values, vectors = np.linalg.eigh(block)
        nu = float(values[0])
        y_value = vectors[0, 0] * h_value + vectors[1, 0] * t_value
        anchor = math.sqrt(2.0 / 3.0) * x_value + y_value / math.sqrt(3.0)
        q_value = float(anchor @ matrix @ anchor)
        residual = (matrix - q_value * np.eye(size + 1)) @ anchor
        r_value = float(np.linalg.norm(residual))
        direction = residual / r_value
        a_value = float(direction @ matrix @ direction)
        u_value = float(
            np.linalg.eigvalsh(
                np.array([[q_value, r_value], [r_value, a_value]])
            )[0]
        )
        self.assertAlmostEqual(q_value, nu / 3.0)
        self.assertAlmostEqual(r_value, math.sqrt(2.0) * nu / 3.0)
        self.assertAlmostEqual(u_value, 0.0, places=12)
        self.assertAlmostEqual((q_value - u_value) / r_value, 1.0 / math.sqrt(2.0))
        chart = complement(anchor)
        h_u = chart.T @ (matrix - u_value * np.eye(size + 1)) @ chart
        h_q = chart.T @ (matrix - q_value * np.eye(size + 1)) @ chart
        self.assertAlmostEqual(float(np.linalg.eigvalsh(h_u)[0]), 2.0 * nu / 3.0)
        self.assertAlmostEqual(float(np.linalg.eigvalsh(h_q)[0]), nu / 3.0)

        projector = np.outer(x_value, x_value)
        self.assertTrue(np.allclose(projector @ eta, 0.0, atol=1e-14))
        self.assertTrue(np.allclose(
            projector @ anchor,
            math.sqrt(2.0 / 3.0) * x_value,
            atol=1e-14,
        ))
        self.assertAlmostEqual(float(anchor @ projector @ anchor), 2.0 / 3.0)
        self.assertIn(r"P\eta_+=0", self.text)
        self.assertIn(r"P\kappa=\sqrt{2\over3}\,x\ne0", self.text)
        self.assertIn(r"\lambda_{\min}(H_q)={\nu\over3}", self.text)
        self.assertIn("does not obstruct the repaired simple branch", self.normalized)

    def test_minimal_actual_theorem_and_fail_closed_scope(self) -> None:
        required = (
            r"\mu_{2,p}>q_p,\qquad D_p(q_p)>0",
            r"{\cal G}_P^{\rm cen}",
            r"1_{\{\mu_{2,p}>q_p\}}1_{\{D_p(q_p)>0\}}>0",
            r"\sum_{\substack{p\in{\cal C}_P\\\mu_{2,p}>q_p}} D_p(q_p)>0",
            "Either assertion on cofinally many blocks",
            "This occurrence is not proved",
            "weighted covariance estimate itself remains a separate unproved input",
            "No standard-eight file is changed",
            "P0_INVALIDATED",
            "No actual gate, cofactor sign",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "the actual centered-good set is unconditionally nonempty",
            "eta visibility is required on the strict simple branch",
            "the cofactor contrast has a favorable fixed sign",
            "determinant convergence is proved",
            "P0_PROVED",
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

    def test_ascii_ast_tex_tags_and_cache_clean(self) -> None:
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
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
        self.assertNotIn("TODO", self.text)
        self.assertNotIn("FIXME", self.text)
        self.assertGreaterEqual(self.text.count(r"\boxed{"), 18)
        cache_entries = [
            path for path in ROOT.rglob("__pycache__") if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
