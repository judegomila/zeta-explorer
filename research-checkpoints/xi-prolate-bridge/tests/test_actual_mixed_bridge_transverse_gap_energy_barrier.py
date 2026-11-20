#!/usr/bin/env python3
"""Exact regressions for the mixed-bridge transverse-gap energy barrier."""

from __future__ import annotations

import ast
from fractions import Fraction
import hashlib
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ACTUAL_MIXED_BRIDGE_TRANSVERSE_GAP_ENERGY_BARRIER.md"
NOTE_HASH = "d9fea23ec9427a2bfcf8f22ec6465cafbdd5623f4adc311e83114fd8b8591677"

FROZEN = {
    "notes/ACTUAL_MIXED_BRIDGE_POLE_ROW_RESOLVENT_CANCELLATION_REDUCTION.md":
        "610aa2b58734ab191e561bbaa7529f0558e1f979fa67461273e69f6d6253cde2",
    "tests/test_actual_mixed_bridge_pole_row_resolvent_cancellation_reduction.py":
        "678e6da6c989c536ba6131fdfd38fe5927c60d464b29e8d358d94af0a9c0f2a4",
    "notes/MIXED_BRIDGE_XI_OVER_S_BOUNDARY_OBSTRUCTION_THEOREM.md":
        "4c4bb0344735a0d605e1052ac06b383144f2cdbb85d2c088bf0b6683e67f06a2",
    "tests/test_mixed_bridge_xi_over_s_boundary_obstruction_theorem.py":
        "1bc81194a9fa2fd4eac92491a08c60bc58f3640ac16e4e5e17864da8a2970c67",
    "notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md":
        "43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2",
    "tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py":
        "95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a",
    "notes/HIGH_FOURIER_COERCIVITY.md":
        "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "tests/test_high_fourier_coercivity.py":
        "64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae",
    "notes/GROWING_MIXED_BRIDGE_ACTUAL_MULTIPLIER_DANGEROUS_FESHBACH_REDUCTION.md":
        "cc2a62d6be1c62985ab9d5e2893c74c9ae773280f6bff4015f998364ccbd924e",
    "tests/test_growing_mixed_bridge_actual_multiplier_dangerous_feshbach_reduction.py":
        "1bbe3d751efedb86ab412921a5f99d243b1ebffef33afe325e2930a5d5670a0c",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left, right):
    return sum((x * y for x, y in zip(left, right)), Fraction(0))


def matvec(matrix, vector):
    return tuple(dot(row, vector) for row in matrix)


def determinant_two(matrix):
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def inverse_two(matrix):
    determinant = determinant_two(matrix)
    return (
        (matrix[1][1] / determinant, -matrix[0][1] / determinant),
        (-matrix[1][0] / determinant, matrix[0][0] / determinant),
    )


class ActualMixedBridgeTransverseGapEnergyBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_note_hash(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)

    def test_exact_rational_saturation_and_bs_normalization(self) -> None:
        mass = Fraction(4)
        epsilon = Fraction(3, 5)
        sine = Fraction(4, 5)
        pole = (Fraction(6, 5), Fraction(8, 5))
        q_matrix = ((Fraction(0), Fraction(0)), (Fraction(0), Fraction(1)))
        h_matrix = tuple(
            tuple(q_matrix[i][j] + 2 * pole[i] * pole[j] for j in range(2))
            for i in range(2)
        )
        self.assertEqual(
            h_matrix,
            ((Fraction(72, 25), Fraction(96, 25)),
             (Fraction(96, 25), Fraction(153, 25))),
        )
        self.assertEqual(determinant_two(h_matrix), Fraction(72, 25))
        self.assertEqual(h_matrix[0][0] + h_matrix[1][1], 1 + 2 * mass)

        response = matvec(inverse_two(h_matrix), pole)
        self.assertEqual(response, (Fraction(5, 12), Fraction(0)))
        self.assertEqual(2 * dot(pole, response), Fraction(1))

        transverse = (-sine, epsilon)
        self.assertEqual(dot((epsilon, sine), transverse), Fraction(0))
        kappa = dot(transverse, matvec(h_matrix, transverse))
        gamma = Fraction(1)
        alpha_squared = epsilon * epsilon
        self.assertEqual(kappa, Fraction(9, 25))
        self.assertEqual(kappa, gamma * alpha_squared)

        coupling = Fraction(12, 25)
        transverse_block = Fraction(9, 25)
        y_value = coupling / transverse_block
        normalization = 1 + y_value * y_value
        f_prime = dot(response, response)
        self.assertEqual(y_value, Fraction(4, 3))
        self.assertEqual(normalization, Fraction(25, 9))
        self.assertEqual(normalization, 4 * mass * f_prime)
        self.assertEqual(normalization, Fraction(1, 1) / alpha_squared)

    def test_gap_chain_and_scalar_nonpole_criterion(self) -> None:
        # H=diag(2,5), p=(1,0), mu=0 gives Q=diag(0,5).
        mass = Fraction(1)
        d_value = Fraction(2)
        kappa = Fraction(5)
        gamma = Fraction(5)
        alpha_squared = Fraction(1)
        self.assertLessEqual(max(d_value, gamma * alpha_squared), kappa)
        self.assertLessEqual(kappa, gamma)
        self.assertEqual(2 * mass / Fraction(2), Fraction(1))

        for delta in (Fraction(1, 3), Fraction(2), Fraction(7, 3)):
            scalar_test = 2 * mass / delta
            self.assertEqual(d_value >= delta, scalar_test >= 1)

    def test_nonzero_spectrum_identity_in_scalar_transverse_block(self) -> None:
        for block in (Fraction(1, 7), Fraction(3, 2), Fraction(11)):
            for y_value in (Fraction(0), Fraction(2, 5), Fraction(7, 3)):
                shifted_q = (
                    (block * y_value * y_value, block * y_value),
                    (block * y_value, block),
                )
                self.assertEqual(determinant_two(shifted_q), Fraction(0))
                nonzero_eigenvalue = shifted_q[0][0] + shifted_q[1][1]
                self.assertEqual(nonzero_eigenvalue, block * (1 + y_value**2))
                self.assertGreaterEqual(nonzero_eigenvalue, block)

    def test_denominator_free_energy_inequality_exactly(self) -> None:
        positive = (Fraction(1, 5), Fraction(2, 3), Fraction(7, 4))
        signed = (Fraction(-3, 2), Fraction(-1, 4), Fraction(0), Fraction(5, 6))
        for x_value in positive:
            for y_value in positive:
                d_squared = 1 + y_value * y_value
                for v_value in signed:
                    h_value = v_value + x_value * y_value
                    t_value = abs(h_value)
                    rhs = x_value - t_value / 2
                    if rhs <= 0:
                        continue
                    numerator = abs(x_value - y_value * v_value)
                    # Both sides are nonnegative, so compare their exact squares.
                    self.assertGreaterEqual(
                        numerator * numerator,
                        rhs * rhs * d_squared,
                    )

    def test_cancellation_energy_constant_four_is_sharp(self) -> None:
        x_value = Fraction(7, 9)
        kappa = Fraction(5, 8)
        for y_value in (Fraction(1, 4), Fraction(1), Fraction(9, 5)):
            v_value = x_value / y_value
            self.assertEqual(x_value - y_value * v_value, Fraction(0))
            h_value = v_value + x_value * y_value
            energy = kappa * h_value * h_value
            threshold = 4 * kappa * x_value * x_value
            self.assertGreaterEqual(energy, threshold)
            if y_value == 1:
                self.assertEqual(energy, threshold)

        # Geometric equality conditions do not suffice for a fixed B.
        block = ((kappa, Fraction(0)), (Fraction(0), 2 * kappa))
        y_vector = (Fraction(0), Fraction(1))
        h_vector = (Fraction(0), 2 * x_value)
        u_squared = dot(y_vector, y_vector)
        self.assertEqual(u_squared, Fraction(1))
        self.assertEqual(
            dot(y_vector, h_vector),
            x_value * (1 + u_squared),
        )
        energy = dot(h_vector, matvec(block, h_vector))
        self.assertEqual(energy, 8 * kappa * x_value * x_value)
        self.assertGreater(energy, 4 * kappa * x_value * x_value)

    def test_exact_low_high_schur_floor(self) -> None:
        schur = Fraction(2)
        high = Fraction(5)
        coupling = Fraction(3)
        low = schur + coupling * coupling / high
        matrix = ((low, coupling), (coupling, high))
        floor = min(schur, high) / (1 + coupling / high) ** 2
        shifted = (
            (matrix[0][0] - floor, matrix[0][1]),
            (matrix[1][0], matrix[1][1] - floor),
        )
        self.assertEqual(floor, Fraction(25, 32))
        self.assertGreater(shifted[0][0], 0)
        self.assertGreater(determinant_two(shifted), 0)
        self.assertEqual(low - coupling * coupling / high, schur)

        pole_high = Fraction(3)
        pole_low = Fraction(4)
        self.assertLessEqual(
            2 * pole_high * pole_low,
            pole_high * pole_high + pole_low * pole_low,
        )

    def test_bridge_energy_audit_and_valid_dichotomy(self) -> None:
        mu = Fraction(-2)
        gamma = Fraction(3)
        higher_gap = Fraction(5)
        bridge = (Fraction(2), Fraction(3), Fraction(1))
        norm_squared = dot(bridge, bridge)
        ground_mass = bridge[0] * bridge[0]
        rho = ground_mass / norm_squared
        energy = gamma * bridge[1] ** 2 + higher_gap * bridge[2] ** 2
        self.assertEqual(norm_squared, Fraction(14))
        self.assertEqual(energy, Fraction(32))
        self.assertGreaterEqual(energy, gamma * (1 - rho) * norm_squared)

        kappa = Fraction(2)
        eta = 1 - rho
        self.assertLessEqual(kappa, gamma)
        self.assertLessEqual(gamma, energy / (eta * norm_squared))
        self.assertGreaterEqual(energy / kappa, eta * norm_squared)

        norm = Fraction(7, 3)
        delta = Fraction(4, 5)
        rayleigh_numerator = Fraction(0)
        energy_at_edge = rayleigh_numerator + delta * norm
        energy_below_edge = rayleigh_numerator + 2 * delta * norm
        self.assertEqual(energy_at_edge, delta * norm)
        self.assertGreater(energy_below_edge, delta * norm)

    def test_log_squared_over_lambda_proxy_is_exactly_small(self) -> None:
        # For lambda=2^n, the omitted factor (log 2)^2 is fixed and positive.
        ratios = [Fraction(n * n, 2**n) for n in range(5, 25)]
        for left, right in zip(ratios, ratios[1:]):
            self.assertGreater(left, right)
        self.assertLess(ratios[-1], Fraction(1, 1000))

    def test_scope_source_distinctions_and_exact_tokens(self) -> None:
        required = (
            "\\max\\{a_1-\\mu,\\gamma\\alpha^2\\}",
            "1+\\|B_\\mu^{-1}r\\|^2",
            "=\\alpha^{-2}=4M F'(\\mu)",
            "\\left[x-{1\\over2}\\sqrt{E\\over\\kappa}\\right]_+",
            "E\\geq4\\kappa x^2",
            "\\langle h,Bh\\rangle=8\\kappa x^2",
            "`kappa` spectral",
            "\\sqrt2\\,\\kappa{\\log^2\\lambda\\over\\lambda}",
            "exact nonzero-spectrum identity",
            "two-parity diagonal",
            "not the individual odd energy `E`",
            "actual Mellin-zero Poincare constant",
            "exp(-o(lambda^2))",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "q_bb is the odd bridge energy",
            "the individual odd Rayleigh estimate is proved",
            "dimension control gives an eigenvalue lower bound",
            "the structural model is an actual-source counterexample",
        )
        lowered = self.text.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

    def test_display_tags_ascii_and_no_binary_floats(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))

        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        float_constants = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(float_constants, [])

        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__",
                "ast",
                "fractions",
                "hashlib",
                "pathlib",
                "re",
                "shutil",
                "subprocess",
                "tempfile",
                "unittest",
            },
        )

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        self.assertIsNotNone(pdflatex, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertEqual(len(displays), 63)
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
                [
                    pdflatex,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    tex_path.name,
                ],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
