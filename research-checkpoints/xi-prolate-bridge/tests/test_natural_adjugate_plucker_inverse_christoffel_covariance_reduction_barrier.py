#!/usr/bin/env python3
"""Strict regressions for the natural Plucker/Christoffel reduction."""

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
NOTE = (
    ROOT
    / "notes"
    / "NATURAL_ADJUGATE_PLUCKER_INVERSE_CHRISTOFFEL_COVARIANCE_REDUCTION_BARRIER.md"
)
NOTE_HASH = "4506f01ad61c6110bd09f05b98be5318a4f47a35172a37b2560c350057a06146"

FROZEN = {
    "notes/NATURAL_CROSSROOT_WEIGHTED_PROJECTOR_AVERAGE_TARGET.md":
        "d477178ac4daed6315bdce4bc27b94b073bf0611c87a1f3192b4b5b7147334cf",
    "tests/test_natural_crossroot_weighted_projector_average_target.py":
        "36a70f9de303fe49ac60dfd1285542486615f696dfd66566fe73158eeba9a390",
    "notes/NATURAL_OUTER_SHELL_LARGE_SIEVE_INVERSE_SPREAD_BARRIER.md":
        "79be0448f5e144819ee9eb2e249021c3c5ffe44949a58b75002e2a117c1b85da",
    "tests/test_natural_outer_shell_large_sieve_inverse_spread_barrier.py":
        "e65c890a6f97def68b48825ccb8c3148926c744cd77f27754fb7790534dbabf8",
    "notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md":
        "e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26",
    "tests/test_source_cauchy_selector_cone_projective_tradeoff.py":
        "f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def poly_add(left: list[F], right: list[F]) -> list[F]:
    size = max(len(left), len(right))
    result = [F(0)] * size
    for index in range(size):
        if index < len(left):
            result[index] += left[index]
        if index < len(right):
            result[index] += right[index]
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def poly_scale(value: F, polynomial: list[F]) -> list[F]:
    return [value * coefficient for coefficient in polynomial]


def poly_mul(left: list[F], right: list[F]) -> list[F]:
    result = [F(0)] * (len(left) + len(right) - 1)
    for i, left_value in enumerate(left):
        for j, right_value in enumerate(right):
            result[i + j] += left_value * right_value
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


class NaturalAdjugatePluckerInverseChristoffelTests(unittest.TestCase):
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

    def test_scale_free_null_vector_characteristic_and_projector(self) -> None:
        d_matrix = np.array([[2.0, 1.0], [1.0, 3.0]])
        h_vector = np.array([1.0, 2.0])
        response = np.linalg.solve(d_matrix, h_vector)
        delta = float(np.linalg.det(d_matrix))
        y_vector = delta * response
        alpha = float(h_vector @ response)
        full = np.block(
            [
                [d_matrix, h_vector[:, None]],
                [h_vector[None, :], np.array([[alpha]])],
            ]
        )
        z_vector = np.concatenate([y_vector, np.array([-delta])])
        self.assertTrue(np.allclose(full @ z_vector, 0.0, atol=1e-13))
        self.assertAlmostEqual(delta, 5.0)
        self.assertTrue(np.allclose(response, [0.2, 0.6]))
        self.assertTrue(np.allclose(y_vector, [1.0, 3.0]))

        phi_prime = -delta * (1.0 + float(response @ response))
        self.assertAlmostEqual(phi_prime, -7.0)
        self.assertAlmostEqual(abs(phi_prime), float(z_vector @ z_vector) / delta)

        eta = np.array([1.0, 2.0, math.sqrt(2.0)])
        t_value = float(response @ eta[:-1] - math.sqrt(2.0))
        self.assertAlmostEqual(float(z_vector @ eta), delta * t_value)
        omega = t_value**2 / phi_prime**2
        omega_scale_free = float(z_vector @ eta) ** 2 / float(z_vector @ z_vector) ** 2
        self.assertAlmostEqual(omega, omega_scale_free)

        projector_eta = z_vector * float(z_vector @ eta) / float(z_vector @ z_vector)
        self.assertTrue(
            np.allclose(
                np.outer(projector_eta, projector_eta),
                omega * np.outer(z_vector, z_vector),
                atol=1e-13,
            )
        )
        self.assertIn(r"|\Phi'(\mu)|={\|z\|^2\over\delta}", self.text)
        self.assertIn(r"{|\langle z,\eta\rangle|^2\over\|z\|^4}", self.text)

    def test_anchor_weighted_second_plucker_and_bordered_determinant(self) -> None:
        d_matrix = np.array([[2.0, 1.0], [1.0, 3.0]])
        h_vector = np.array([1.0, 2.0])
        delta = float(np.linalg.det(d_matrix))
        y_vector = delta * np.linalg.solve(d_matrix, h_vector)
        q_vector = np.array([3.0 / 5.0, 4.0 / 5.0])
        c_value = 0.0
        k_value = float(q_vector @ q_vector)
        transverse = np.eye(2) - np.outer(q_vector, q_vector) / k_value
        wedge = q_vector[0] * y_vector[1] - q_vector[1] * y_vector[0]
        self.assertAlmostEqual(k_value * float((transverse @ y_vector) @ (transverse @ y_vector)), wedge**2)

        bordered = np.block(
            [
                [d_matrix, h_vector[:, None]],
                [q_vector[None, :], np.array([[c_value]])],
            ]
        )
        s_numerator = float(q_vector @ y_vector - c_value * delta)
        self.assertAlmostEqual(float(np.linalg.det(bordered)), -s_numerator)
        self.assertAlmostEqual(s_numerator, 3.0)

        z_vector = np.concatenate([y_vector, np.array([-delta])])
        kappa = np.concatenate([q_vector, np.array([c_value])])
        projector = np.outer(z_vector, z_vector) / float(z_vector @ z_vector)
        anchor_projection = projector @ kappa
        rho = float(kappa @ anchor_projection)
        omega_kappa = s_numerator**2 / float(z_vector @ z_vector) ** 2
        projected_anchor = np.concatenate(
            [transverse @ anchor_projection[:-1], np.array([0.0])]
        )
        delta_kappa_over_k = float(projected_anchor @ projected_anchor)
        self.assertGreater(rho, 0.0)
        self.assertAlmostEqual(rho, s_numerator**2 / float(z_vector @ z_vector))
        self.assertTrue(np.allclose(anchor_projection / rho, z_vector / s_numerator))
        self.assertAlmostEqual(delta_kappa_over_k, omega_kappa * wedge**2 / k_value)
        self.assertAlmostEqual(rho**2, omega_kappa * s_numerator**2)
        alignment = float(
            (transverse @ (z_vector[:-1] / s_numerator))
            @ (transverse @ (z_vector[:-1] / s_numerator))
        )
        self.assertAlmostEqual(alignment, wedge**2 / (k_value * s_numerator**2))
        self.assertIn(r"\|q\wedge Y\|^2", self.text)
        self.assertIn(r"\sum_{i<j}|q_iY_j-q_jY_i|^2", self.text)
        self.assertIn(r"\omega_p^\kappa|S_p|^2", self.text)
        self.assertIn(r"X:={P\kappa\over\rho}={z\over S}", self.text)
        self.assertIn(r"\rho^2=\omega^\kappa|S|^2", self.text)

    def test_exact_source_displacement_and_two_generator_identity(self) -> None:
        size = 5
        nodes = np.arange(size, dtype=float) ** 2
        gamma = np.array([0.0, 2.0, -1.0, 3.0, 4.0])
        gamma_outer = 7.0
        d_matrix = np.zeros((size, size))
        for i in range(size):
            d_matrix[i, i] = 100.0 + i
            for j in range(i):
                value = (gamma[i] - gamma[j]) / (nodes[i] - nodes[j])
                d_matrix[i, j] = d_matrix[j, i] = value
        self.assertGreater(float(np.linalg.eigvalsh(d_matrix)[0]), 90.0)
        h_vector = (gamma - gamma_outer) / (nodes - size**2)
        response = np.linalg.solve(d_matrix, h_vector)
        one = np.ones(size)
        x_matrix = np.diag(nodes)
        displacement = x_matrix @ d_matrix - d_matrix @ x_matrix
        expected = np.outer(gamma, one) - np.outer(one, gamma)
        self.assertTrue(np.allclose(displacement, expected, atol=1e-13))
        self.assertTrue(
            np.allclose(
                (x_matrix - size**2 * np.eye(size)) @ h_vector,
                gamma - gamma_outer * one,
                atol=1e-13,
            )
        )

        sigma = float(one @ response)
        tau = float(gamma @ response)
        generator_gamma = np.linalg.solve(d_matrix, gamma)
        generator_one = np.linalg.solve(d_matrix, one)
        right = (
            (1.0 - sigma) * generator_gamma
            + (tau - gamma_outer) * generator_one
        )
        left = (x_matrix - size**2 * np.eye(size)) @ response
        self.assertTrue(np.allclose(left, right, atol=1e-13))

        inverse_node = np.diag(1.0 / (nodes - size**2))
        f_vector = inverse_node @ generator_gamma
        g_vector = inverse_node @ generator_one
        a_value = 1.0 - sigma
        b_value = tau - gamma_outer
        self.assertTrue(
            np.allclose(response, a_value * f_vector + b_value * g_vector)
        )
        scalar_matrix = np.array(
            [
                [1.0 + float(one @ f_vector), float(one @ g_vector)],
                [-float(gamma @ f_vector), 1.0 - float(gamma @ g_vector)],
            ]
        )
        self.assertTrue(
            np.allclose(
                scalar_matrix @ np.array([a_value, b_value]),
                np.array([1.0, -gamma_outer]),
                atol=1e-13,
            )
        )
        self.assertAlmostEqual(
            float(np.linalg.norm(inverse_node, 2)), 1.0 / (2 * size - 1)
        )
        t_value = math.sqrt(2.0) * (sigma - 1.0)
        self.assertAlmostEqual(a_value, -t_value / math.sqrt(2.0))
        self.assertIn(r"{1\over2N-1}", self.text)
        self.assertIn(r"(1-\sigma)\widetilde D^{-1}\gamma", self.text)
        self.assertIn(r"(\tau-\gamma_N)\widetilde D^{-1}1", self.text)

    def test_synthetic_inverse_christoffel_generator_no_go(self) -> None:
        errors = []
        for size in (8, 16, 32, 64, 128):
            diagonal = [F(1), F(1, 2 * size * size)] + [F(1, 2)] * (size - 2)
            generator_one = [1 / value for value in diagonal]
            self.assertEqual(generator_one[1], 2 * size * size)
            nodes = [index * index for index in range(size)]
            response_one = (
                F(-size)
                * F(1, nodes[1] - size * size)
                * generator_one[1]
            )
            exact = F(2 * size**3, size * size - 1)
            self.assertEqual(response_one, exact)
            errors.append(abs(float(exact) / (2.0 * size) - 1.0))
        self.assertEqual(errors, sorted(errors, reverse=True))
        self.assertLess(errors[-1], 1e-4)
        self.assertIn(r"V=\widetilde D^{-1}1=(1,2N^2,2,\ldots,2)^T", self.text)
        self.assertIn(
            "uniform positive even-sector gap above the ground",
            self.normalized,
        )
        self.assertIn("not the actual arithmetic source", self.text)

    def test_hankel_kernel_and_inverse_christoffel_weight_blowup(self) -> None:
        roots = [F(-2), F(1), F(3)]
        weights = [F(2), F(5), F(7)]
        moments = [
            sum((weight * root**power for root, weight in zip(roots, weights)), F(0))
            for power in range(7)
        ]
        hankel = np.array(
            [[float(moments[i + j]) for j in range(4)] for i in range(4)]
        )
        coefficients = np.array([6.0, -5.0, -2.0, 1.0])
        self.assertTrue(np.allclose(hankel @ coefficients, 0.0, atol=1e-10))
        self.assertEqual(np.linalg.matrix_rank(hankel, tol=1e-10), 3)
        for root in roots:
            value = sum(
                (F(int(coefficients[index])) * root**index for index in range(4)),
                F(0),
            )
            self.assertEqual(value, 0)

        tiny = F(1, 10_000)
        tiny_weights = [tiny, F(5), F(7)]
        vandermonde = np.array(
            [[float(root**power) for root in roots] for power in range(3)]
        )
        moment_matrix = vandermonde @ np.diag([float(x) for x in tiny_weights]) @ vandermonde.T
        evaluation = vandermonde[:, 0]
        inverse_christoffel = float(evaluation @ np.linalg.solve(moment_matrix, evaluation))
        self.assertAlmostEqual(inverse_christoffel, 10_000.0, places=5)
        self.assertIn("unique `d`-atomic representation", self.text)
        self.assertIn("arbitrarily small weight", self.text)
        self.assertIn("inverse-Christoffel quantity arbitrarily large", self.text)

    def test_formal_degree_audit_and_adaptive_guard(self) -> None:
        # A two-dimensional affine source already gives a quadratic cofactor
        # orientation and hence a quartic positive self-square.
        one_plus_x = [F(1), F(1)]
        two_plus_x = [F(2), F(1)]
        x_poly = [F(0), F(1)]
        one_plus_x_h = [F(1), F(1)]
        two_minus_x_h = [F(2), F(-1)]
        y_zero = poly_add(
            poly_mul(two_plus_x, one_plus_x_h),
            poly_scale(F(-1), poly_mul(x_poly, two_minus_x_h)),
        )
        y_one = poly_add(
            poly_mul(one_plus_x, two_minus_x_h),
            poly_scale(F(-1), poly_mul(x_poly, one_plus_x_h)),
        )
        wedge = poly_add(y_one, poly_scale(F(-1), y_zero))
        self.assertEqual(len(wedge) - 1, 2)
        self.assertEqual(len(poly_mul(wedge, wedge)) - 1, 4)

        for p in (101, 1001, 10001):
            dimension = (p + 3) // 2
            self.assertEqual(2 * dimension, p + 3)
            self.assertLess(p * p / 4.0, p * p)
        required = (
            "with the spectral parameter and weights frozen",
            "not asserted to be a literal fixed-order prime correlation",
            r"m_1,m_2,n_1,n_2\leq {p^2\over4}",
            r"2d=p+3",
            r"w=\mu_p(\xi)",
            r"\omega_p^\kappa={|S_p(\xi)|^2\over\|z_p(\xi)\|^4}",
            "adaptive algebraic root destroys the fixed-coefficient polynomial model",
            "not an application of the ordinary Montgomery--Vaughan mean value",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_all_pole_pinching_trace_and_ground_domination(self) -> None:
        matrix = np.array(
            [[2.0, 0.5, -0.25], [0.5, 4.0, 0.75], [-0.25, 0.75, 7.0]]
        )
        kappa = np.array([1.0, 2.0, -2.0]) / 3.0
        values, vectors = np.linalg.eigh(matrix)
        self.assertEqual(len(values), 3)
        pinching = np.zeros((3, 3))
        projectors = []
        for column in range(3):
            vector = vectors[:, column]
            projector = np.outer(vector, vector)
            projectors.append(projector)
            pinching += projector @ np.outer(kappa, kappa) @ projector
        ground_term = projectors[0] @ np.outer(kappa, kappa) @ projectors[0]
        self.assertGreaterEqual(float(np.linalg.eigvalsh(pinching - ground_term)[0]), -1e-12)
        self.assertAlmostEqual(float(np.trace(pinching)), float(kappa @ kappa))
        self.assertAlmostEqual(float(kappa @ kappa), 1.0)
        self.assertIn(r"\|\kappa\|^2=1", self.text)
        self.assertIn("sums to only `O(P)`", self.text)
        self.assertIn("loses bottom-line selection", self.text)

    def test_adjacent_odd_cutoff_blocks_are_exactly_contiguous(self) -> None:
        previous_upper = None
        all_integers: list[int] = []
        for p in range(5, 42, 2):
            lower = F((p - 2) ** 2, 4)
            upper = F(p * p, 4)
            self.assertEqual(upper - lower, p - 1)
            if previous_upper is not None:
                self.assertEqual(lower, previous_upper)
            block_integers = [
                value
                for value in range(math.floor(float(lower)) + 1, math.floor(float(upper)) + 1)
                if F(value) > lower and F(value) <= upper
            ]
            self.assertEqual(len(block_integers), p - 1)
            all_integers.extend(block_integers)
            previous_upper = upper
        self.assertEqual(all_integers, list(range(all_integers[0], all_integers[-1] + 1)))
        self.assertIn(r"|I_p|=p-1", self.text)
        self.assertIn(r"\sup I_p=\inf I_{p+2}", self.text)
        self.assertIn("every old translation kernel is rescaled", self.text)
        self.assertIn("pre-projector estimate", self.text)

    def test_minimal_new_theorem_and_fail_closed_scope(self) -> None:
        required = (
            "gate-restricted, anchor-weighted",
            "normalized Plucker",
            "inverse-Christoffel frame",
            r"{\varpi_p^\kappa\over k_p}",
            r"{C(\log P)^B\over P}",
            r"{\cal G}_P\ne\varnothing",
            "nonemptiness already makes the total weight",
            "no separate eta-visibility hypothesis is needed",
            "canonical multiple branch still uses the mixed boundary visibility",
            "is **not proved**",
            "standard eight are unchanged",
            "P0_INVALIDATED",
            "formal degree audit",
            "all-pole trace bound",
            "contiguous new prime blocks",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "Equation (9.2) is proved",
            "Hankel positivity proves (9.2)",
            "the actual target is a fixed-order prime correlation",
            "the finite-good set is nonempty unconditionally",
            "the determinant convergence is established",
            "strict simple branch requires positive eta visibility",
        )
        for token in forbidden:
            self.assertNotIn(token, self.normalized)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 40)
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
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
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
        self.assertGreaterEqual(self.text.count(r"\boxed{"), 12)
        cache_entries = [
            path for path in ROOT.rglob("__pycache__") if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
