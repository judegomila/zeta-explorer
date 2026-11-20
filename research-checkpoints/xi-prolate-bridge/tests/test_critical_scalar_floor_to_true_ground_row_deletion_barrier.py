#!/usr/bin/env python3
"""Strict regressions for the critical scalar-to-ground deletion barrier."""

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
    / "CRITICAL_SCALAR_FLOOR_TO_TRUE_GROUND_ROW_DELETION_BARRIER.md"
)
NOTE_HASH = "3cf82e60d684f738e331ba5b4378ee7d0528bd47dd71c73bd551777750938ba4"

FROZEN = {
    "notes/CRITICAL_ARITHMETIC_TO_ACTUAL_SCALAR_TRANSFER_THEOREM.md":
        "8c453f25d75ab351a15faa65a8b7ce5eaaf96ba3b83043b4cdb037f5daa379d8",
    "tests/test_critical_arithmetic_to_actual_scalar_transfer_theorem.py":
        "6e313a0fdeb2db8f11721ce805ff02c60567d370ec4430b63e6a8faae3e00408",
    "notes/RH_ACTUAL_ODD_GROUND_PRIMITIVE_CHRISTOFFEL_PARITY_BARRIER.md":
        "29475ddb8b57f227530b6aa296b088f07c4ac9db0cadd1a2d230b40a780b3157",
    "tests/test_rh_actual_odd_ground_primitive_christoffel_parity_barrier.py":
        "c03b4325d8f04266091dc3cd8ad17f6bf4f91ca97773cf7dfcaedb44f46caeb6",
    "notes/RH_ACTUAL_GROUND_CHRISTOFFEL_COMMUTATOR_RESPONSE_BARRIER.md":
        "aa1186ccef2d81c6428973b6a9757846f00758ad14eb6607854beab5fcded272",
    "tests/test_rh_actual_ground_christoffel_commutator_response_barrier.py":
        "a86e9751e2fd2d3fb4076a72438dda37d3e6cde7e04a8a36075af2ef8f0c2c67",
    "notes/ADAPTIVE_PROLATE_SATURATION_DIVERGENCE_ORIENTATION_BARRIER.md":
        "7882db630232ec094318e52689b0b12bf28b0d74ee2c012259a6e91fe666268b",
    "tests/test_adaptive_prolate_saturation_divergence_orientation_barrier.py":
        "5efe525cd79bc7279fe5198ae9af8ec9da8941e5bd3a4f1baa4479de56336798",
}

NODES = ((F(1, 2), F(1)), (F(5, 2), F(39)), (F(9, 2), F(135)))


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def raw_scaled_entry(n_value: int, m_value: int) -> F:
    """Return pi times the paired real-evaluation Gram entry."""
    return sum(
        (
            weight
            * (
                F(1, 1) / ((node - n_value) * (node - m_value))
                + F(1, 1) / ((node + n_value) * (node + m_value))
            )
            for node, weight in NODES
        ),
        F(0),
    )


class CriticalScalarFloorToTrueGroundRowDeletionBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 8)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_evaluation_blocks_source_cauchy_and_odd_ground(self) -> None:
        raw = {
            (n_value, m_value): raw_scaled_entry(n_value, m_value)
            for n_value in range(-2, 3)
            for m_value in range(-2, 3)
        }
        b_values = {
            n_value: F(n_value) * raw[n_value, 0]
            for n_value in range(-2, 3)
        }
        for n_value in range(-2, 3):
            self.assertEqual(b_values[-n_value], -b_values[n_value])
            for m_value in range(-2, 3):
                if n_value != m_value:
                    self.assertEqual(
                        raw[n_value, m_value],
                        (b_values[n_value] - b_values[m_value])
                        / (n_value - m_value),
                    )

        # E stores the rational coefficient of sqrt(2) in its central
        # off-diagonal entries; all other entries are rational.
        even = [
            [
                raw[0, 0],
                raw[0, 1],
                raw[0, 2],
            ],
            [
                raw[0, 1],
                raw[1, 1] + raw[1, -1],
                raw[1, 2] + raw[1, -2],
            ],
            [
                raw[0, 2],
                raw[2, 1] + raw[2, -1],
                raw[2, 2] + raw[2, -2],
            ],
        ]
        self.assertEqual(
            even,
            [
                [F(2536, 75), F(6056, 231), F(9896, 195)],
                [F(6056, 231), F(3557104, 53361), F(1769552, 15015)],
                [F(9896, 195), F(1769552, 15015), F(26702032, 114075)],
            ],
        )
        odd = [
            [
                raw[1, 1] - raw[1, -1],
                raw[1, 2] - raw[1, -2],
            ],
            [
                raw[2, 1] - raw[2, -1],
                raw[2, 2] - raw[2, -2],
            ],
        ]
        self.assertEqual(
            odd,
            [
                [F(759232, 53361), F(163712, 5005)],
                [F(163712, 5005), F(15123712, 114075)],
            ],
        )

        q_value = F(29, 5)
        a, b, c = even[0]
        d_value = even[1][1]
        e_value = even[1][2]
        f_value = even[2][2]
        # The factors 2 below are the exact squares of sqrt(2).
        minors = (
            a - q_value,
            (a - q_value) * (d_value - q_value) - 2 * b * b,
            (a - q_value)
            * ((d_value - q_value) * (f_value - q_value) - e_value**2)
            - 2 * b * b * (f_value - q_value)
            + 4 * b * c * e_value
            - 2 * c * c * (d_value - q_value),
        )
        self.assertEqual(
            minors,
            (
                F(2101, 75),
                F(6609793151, 20010375),
                F(47896442166707, 2282683528125),
            ),
        )
        self.assertTrue(all(value > 0 for value in minors))

        odd_determinant = odd[0][0] * odd[1][1] - odd[0][1] ** 2
        shifted_odd_determinant = (
            (odd[0][0] - q_value) * (odd[1][1] - q_value)
            - odd[0][1] ** 2
        )
        self.assertEqual(odd_determinant, F(709944672256, 869593725))
        self.assertEqual(
            shifted_odd_determinant,
            F(-43224625753, 30435780375),
        )
        self.assertGreater(odd[0][0], 0)
        self.assertGreater(odd_determinant, 0)
        self.assertLess(shifted_odd_determinant, 0)

    def test_low_row_projection_is_exact_and_nonzero(self) -> None:
        # Store coefficients of sqrt(2) in the last two coordinates.
        low_row = [F(2), F(-2, 3), F(-2, 15)]
        eta = [F(1), F(1), F(1)]
        projection = [
            value - F(2, 25) * eta_value
            for value, eta_value in zip(low_row, eta)
        ]
        self.assertEqual(
            projection,
            [F(48, 25), F(-56, 75), F(-16, 75)],
        )

        def weighted_dot(left: list[F], right: list[F]) -> F:
            return left[0] * right[0] + 2 * sum(
                (left[index] * right[index] for index in (1, 2)),
                F(0),
            )

        self.assertEqual(weighted_dot(eta, projection), 0)
        self.assertEqual(
            weighted_dot(low_row, projection),
            F(5504, 1125),
        )
        self.assertEqual(
            weighted_dot(projection, projection),
            F(5504, 1125),
        )

    def test_minimax_direction_and_primitive_nullspace_bound(self) -> None:
        true_odd_floor = F(1)
        constrained_odd_floor = F(3)
        primitive_even_trial = F(2)
        self.assertGreaterEqual(constrained_odd_floor, true_odd_floor)
        self.assertLess(primitive_even_trial, constrained_odd_floor)
        self.assertFalse(primitive_even_trial < true_odd_floor)

        omega = F(10)
        threshold = F(20)
        primitive_factor = F(3, 2)
        ratio_bound = (omega / threshold) ** 2 / primitive_factor
        self.assertEqual(ratio_bound, F(1, 6))
        self.assertLess(ratio_bound, 1)

    def test_sharp_odd_and_even_row_deletion_thresholds(self) -> None:
        omega = F(2)
        threshold = F(4)
        least = F(1)

        a_two = (omega / threshold) ** 2
        b_two = (omega / least) ** 2
        g_minus = F(2)
        allowed_odd_mass = (g_minus - a_two) / (b_two - a_two)
        self.assertEqual(allowed_odd_mass, F(7, 15))
        deleted_odd_ratio = F(3, 5)
        odd_mass = F(1) - deleted_odd_ratio
        odd_primitive_bound = (
            a_two + (b_two - a_two) * odd_mass
        ) / g_minus
        self.assertGreater(
            deleted_odd_ratio,
            F(1) - allowed_odd_mass,
        )
        self.assertLess(odd_primitive_bound, 1)

        a_four = (omega / threshold) ** 4
        b_four = (omega / least) ** 4
        g_plus = F(2)
        target = F(1, 2)
        allowed_even_mass = (
            target * g_plus - a_four
        ) / (b_four - a_four)
        self.assertEqual(allowed_even_mass, F(1, 17))
        deleted_even_ratio = F(33, 34)
        even_mass = F(1) - deleted_even_ratio
        theta_bound = (
            a_four + (b_four - a_four) * even_mass
        ) / g_plus
        self.assertGreater(target * g_plus, a_four)
        self.assertGreater(
            deleted_even_ratio,
            F(1) - allowed_even_mass,
        )
        self.assertLess(theta_bound, target)

    def test_exact_reserve_collapse_source_cauchy_and_scalar_divergence(self) -> None:
        scale = F(35)
        for dimension_parameter in (1, 2, 7, 31):
            dimension = 2 * dimension_parameter + 1
            tau = scale / 5
            epsilon = 4 * scale / 5
            alpha = tau + epsilon / dimension
            reserve = F(1) - tau / alpha
            self.assertEqual(
                reserve,
                F(4, 2 * dimension_parameter + 5),
            )

            b_values = {
                n_value: -epsilon * n_value / dimension
                for n_value in range(-dimension_parameter, dimension_parameter + 1)
            }
            for n_value in b_values:
                self.assertEqual(b_values[-n_value], -b_values[n_value])
                for m_value in b_values:
                    if n_value != m_value:
                        self.assertEqual(
                            (b_values[n_value] - b_values[m_value])
                            / (n_value - m_value),
                            -epsilon / dimension,
                        )

            # The lower two-vector Ritz value is tau; both complementary
            # parity eigenvalues lie epsilon above it.
            second_even = tau + epsilon
            first_odd = tau + epsilon
            sigma = min(second_even - tau, first_odd - tau)
            self.assertEqual(sigma, epsilon)
            self.assertGreater(sigma, 0)

            s_squared = F(1, dimension * dimension)
            scalar_quotient = (
                F(1) - s_squared
            ) / (dimension * s_squared)
            self.assertEqual(
                scalar_quotient,
                F(dimension * dimension - 1, dimension),
            )
            self.assertGreater(scalar_quotient, dimension - 1)

    def test_claim_boundary_and_irreducible_statistics(self) -> None:
        required = (
            "P0_INVALIDATED",
            "wrong minimax direction",
            "(1-\\log D){N\\over L}",
            "nodes are not zeta ordinates",
            "\\Delta_N>0",
            "\\Sigma_N:=\\min",
            "\\Theta_N=",
            "direct exact, logically weaker target",
            "relative row-deleted actual-ground floor",
            "No structural model is identified with the actual zeta Gram",
            "changes none of the standard eight files",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "we prove RH",
            "RH is proved",
            "actual zeta Gram has an odd ground",
            "actual reserve fails",
            "finite gates are closed",
            "literal ceiling is proved",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 50)
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
        self.assertNotRegex(
            self.text,
            r"\\begin\{aligned\}.*?\\tag",
        )
        cache_entries = [
            path
            for path in ROOT.rglob("__pycache__")
            if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
