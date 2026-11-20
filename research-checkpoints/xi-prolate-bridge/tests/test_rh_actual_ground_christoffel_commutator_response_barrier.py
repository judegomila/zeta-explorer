#!/usr/bin/env python3
"""Strict regressions for the actual-ground scalar response barrier."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
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
    / "RH_ACTUAL_GROUND_CHRISTOFFEL_COMMUTATOR_RESPONSE_BARRIER.md"
)
NOTE_HASH = "aa1186ccef2d81c6428973b6a9757846f00758ad14eb6607854beab5fcded272"

FROZEN = {
    "notes/RH_ACTUAL_ODD_GROUND_PRIMITIVE_CHRISTOFFEL_PARITY_BARRIER.md":
        "29475ddb8b57f227530b6aa296b088f07c4ac9db0cadd1a2d230b40a780b3157",
    "tests/test_rh_actual_odd_ground_primitive_christoffel_parity_barrier.py":
        "c03b4325d8f04266091dc3cd8ad17f6bf4f91ca97773cf7dfcaedb44f46caeb6",
    "notes/ADAPTIVE_PROLATE_SATURATION_DIVERGENCE_ORIENTATION_BARRIER.md":
        "7882db630232ec094318e52689b0b12bf28b0d74ee2c012259a6e91fe666268b",
    "tests/test_adaptive_prolate_saturation_divergence_orientation_barrier.py":
        "5efe525cd79bc7279fe5198ae9af8ec9da8941e5bd3a4f1baa4479de56336798",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def parity_off_diagonal(
    n_value: int,
    m_value: int,
    b_values: dict[int, F],
) -> tuple[F, F]:
    """Return normalized even and odd source-Cauchy entries."""
    q_same = (
        b_values[n_value] - b_values[m_value]
    ) / (n_value - m_value)
    q_reflected = (
        b_values[n_value] + b_values[m_value]
    ) / (n_value + m_value)
    return q_same + q_reflected, q_same - q_reflected


def matrix_vector(matrix: list[list[F]], vector: list[F]) -> list[F]:
    return [
        sum((entry * value for entry, value in zip(row, vector)), F(0))
        for row in matrix
    ]


class RHActualGroundChristoffelCommutatorResponseBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 4)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_odd_boundary_functional_and_christoffel_derivative(self) -> None:
        # A rank-one shifted moment functional with kernel p(y)=y-2.
        p_zero = F(-2)
        p_one = F(1)
        shifted_moments = {1: F(3), 2: F(6), 3: F(12)}
        for boundary_mass, expected in ((F(4), F(10)), (F(1), F(-2))):
            moments = {0: boundary_mass, **shifted_moments}
            omega_p = p_zero * moments[0] + p_one * moments[1]
            omega_p_squared = (
                p_zero * p_zero * moments[0]
                + 2 * p_zero * p_one * moments[1]
                + p_one * p_one * moments[2]
            )
            self.assertEqual(omega_p_squared, p_zero * omega_p)
            self.assertEqual(omega_p_squared, expected)

            # rho=3 delta_2 represents ell(q)=omega(yq).
            inverse_rho = F(3, 2)
            self.assertEqual(
                omega_p_squared,
                p_zero * p_zero * (boundary_mass - inverse_rho),
            )

        # The shifted Hankel form stays fixed and positive semidefinite while
        # the invisible boundary mass reverses the desired sign.
        h_one = [
            [shifted_moments[1], shifted_moments[2]],
            [shifted_moments[2], shifted_moments[3]],
        ]
        self.assertEqual(h_one[0][0] * h_one[1][1], h_one[0][1] ** 2)
        self.assertGreater(h_one[0][0], 0)

        sigma_y = F(5)
        nu_y = F(15)
        sigma_zero = F(7)
        nu_zero = F(20)
        eigenvalue = nu_y / sigma_y
        omega_zero = nu_zero - eigenvalue * sigma_zero
        delta = nu_y * sigma_zero - nu_zero * sigma_y
        derivative = omega_zero / sigma_y
        self.assertEqual(delta, -sigma_y * omega_zero)
        self.assertEqual(delta, -sigma_y * sigma_y * derivative)
        self.assertGreater(delta, 0)
        self.assertLess(derivative, 0)

    def test_odd_source_commutator_central_residual(self) -> None:
        modes = (1, 2, 3)
        b_values = {1: F(2), 2: F(-1), 3: F(3)}
        odd_ground = [F(1), F(2), F(-1)]
        eigenvalue = F(5)

        odd = [[F(0) for _ in modes] for _ in modes]
        even = [[F(0) for _ in modes] for _ in modes]
        for row, n_value in enumerate(modes):
            for column, m_value in enumerate(modes):
                if n_value == m_value:
                    continue
                even_entry, odd_entry = parity_off_diagonal(
                    n_value, m_value, b_values
                )
                even[row][column] = even_entry
                odd[row][column] = odd_entry

        diagonal_source: dict[int, F] = {}
        for row, n_value in enumerate(modes):
            off_action = sum(
                (
                    odd[row][column] * odd_ground[column]
                    for column in range(len(modes))
                    if column != row
                ),
                F(0),
            )
            odd_diagonal = (
                eigenvalue * odd_ground[row] - off_action
            ) / odd_ground[row]
            diagonal_source[n_value] = (
                odd_diagonal + b_values[n_value] / n_value
            )
            odd[row][row] = odd_diagonal
            even[row][row] = (
                diagonal_source[n_value] + b_values[n_value] / n_value
            )

        self.assertEqual(
            matrix_vector(odd, odd_ground),
            [eigenvalue * value for value in odd_ground],
        )

        s_one = sum(
            (value / n_value for value, n_value in zip(odd_ground, modes)),
            F(0),
        )
        positive_primitive = [
            -value / n_value
            for value, n_value in zip(odd_ground, modes)
        ]
        # The sqrt(2) central coupling times sqrt(2) S_1 is rational.
        positive_residual = []
        for row, n_value in enumerate(modes):
            central_term = 2 * b_values[n_value] * s_one / n_value
            value = (
                central_term
                + matrix_vector(even, positive_primitive)[row]
                - eigenvalue * positive_primitive[row]
            )
            positive_residual.append(value)
        self.assertEqual(positive_residual, [F(0), F(0), F(0)])

        a_zero = F(7)
        b_two = sum(
            (
                b_values[n_value] * value / (n_value * n_value)
                for n_value, value in zip(modes, odd_ground)
            ),
            F(0),
        )
        central_product = 2 * s_one * (
            (a_zero - eigenvalue) * s_one - b_two
        )
        direct_product = 2 * s_one * (
            (a_zero - eigenvalue) * s_one - b_two
        ) + sum(
            (
                value * residual
                for value, residual in zip(
                    positive_primitive, positive_residual
                )
            ),
            F(0),
        )
        self.assertEqual(direct_product, central_product)

    def test_even_squared_commutator_and_exact_opposite_sign_model(self) -> None:
        # Exact N=2 model from Section 7.
        alpha = F(3)
        a_zero = F(10)
        b_values = {1: F(1), 2: F(0)}
        positive_ground = [F(1), F(1)]
        positive_block = [
            [F(11, 3), F(-2, 3)],
            [F(-2, 3), F(11, 3)],
        ]
        self.assertEqual(
            matrix_vector(positive_block, positive_ground),
            [alpha, alpha],
        )
        self.assertEqual(F(11, 3) - F(-2, 3), F(13, 3))

        odd_block = [
            [F(5, 3), F(-4, 3)],
            [F(-4, 3), F(11, 3)],
        ]
        self.assertGreater(odd_block[0][0], 0)
        self.assertEqual(
            odd_block[0][0] * odd_block[1][1]
            - odd_block[0][1] * odd_block[1][0],
            F(13, 3),
        )

        # Sylvester data for the full even block; sqrt(2)^2=2.
        self.assertEqual(F(10) * F(11, 3) - F(2), F(104, 3))
        full_even_determinant = (
            F(10)
            * (F(11, 3) * F(11, 3) - F(4, 9))
            - F(2) * F(11, 3)
        )
        self.assertEqual(full_even_determinant, F(368, 3))

        s_two = F(1) + F(1, 4)
        s_four = F(1) + F(1, 16)
        b_one = F(1)
        b_three = F(1)
        primitive_norm = 2 * s_two * s_two + F(1) + F(1, 16)
        scalar = 2 * (
            (a_zero - alpha) * s_two * s_two
            - s_two * b_three
            - b_one * s_four
        )
        self.assertEqual(primitive_norm, F(67, 16))
        self.assertEqual(scalar, F(69, 4))
        theta = F(1) + scalar / (alpha * primitive_norm)
        self.assertEqual(theta, F(159, 67))
        self.assertGreater(theta, 1)

        # Directly check the positive-mode residual in (5.6).
        positive_primitive = [F(-1), F(-1, 4)]
        b_one_direct = sum(
            (
                b_values[n_value] * value / n_value
                for n_value, value in zip((1, 2), positive_ground)
            ),
            F(0),
        )
        positive_residual = []
        for row, n_value in enumerate((1, 2)):
            central_term = 2 * b_values[n_value] * s_two / n_value
            residual = (
                central_term
                + matrix_vector(positive_block, positive_primitive)[row]
                - alpha * positive_primitive[row]
            )
            positive_residual.append(residual)
        self.assertEqual(
            positive_residual,
            [
                2 * b_one_direct / F(1),
                2 * b_one_direct / F(4),
            ],
        )

    def test_row_deletion_response_and_inverse_moment_threshold(self) -> None:
        # A simple diagonal affine pencil makes all response factors exact.
        alpha_zero = F(2)
        alpha_one = F(5)
        alpha_derivative = F(3)
        low_mass = alpha_derivative / alpha_one
        self.assertEqual(low_mass, F(3, 5))
        self.assertEqual(
            low_mass,
            F(1) - alpha_zero / alpha_one,
        )

        omega = F(10)
        threshold = F(20)
        least = F(2)
        ground_norm = F(100)
        tau = F(1, 2)
        a_four = (omega / threshold) ** 4
        b_four = (omega / least) ** 4
        allowed_mass = (tau * ground_norm - a_four) / (
            b_four - a_four
        )
        chosen_mass = allowed_mass / 2
        bound = (
            a_four + (b_four - a_four) * chosen_mass
        ) / ground_norm
        self.assertGreater(tau * ground_norm, a_four)
        self.assertLess(chosen_mass, allowed_mass)
        self.assertLess(bound, tau)

    def test_claim_boundary_and_separation(self) -> None:
        required = (
            "P0_INVALIDATED",
            "lambda_-'(0)<0",
            "relative stability",
            "row-deletion floor",
            "projected-prolate Stokes vector",
            "integer multiplicities",
            "Theta={159\\over67}>1",
            "structural countermodels only",
            "All unresolved gates remain false",
            "does not orient either statistic",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "we prove RH",
            "RH is proved",
            "finite gate is closed",
            "HSW proves",
            "Theta_K<1 follows",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)
        self.assertNotIn("padded-window", self.text)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 55)
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

    def test_static_ascii_ast_and_cache_clean(self) -> None:
        self.note_bytes.decode("ascii")
        ast.parse(Path(__file__).read_text(encoding="ascii"))
        self.assertNotRegex(self.text, r"(?<!\\)\$\$")
        self.assertNotIn("\\begin{equation}", self.text)
        self.assertNotIn("\\end{equation}", self.text)
        cache_entries = [
            path
            for path in ROOT.rglob("__pycache__")
            if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
