#!/usr/bin/env python3
"""Exact regressions for the mixed-resolvent mixed-measure barrier."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
from itertools import combinations
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
    / "ACTUAL_MIXED_BRIDGE_RESOLVENT_MIXED_MEASURE_BARRIER.md"
)
NOTE_HASH = "e330dd6257420df3590f97c43ef71a4ef332307d303d9d7351ff9c8b37b72d93"

FROZEN = {
    "notes/ACTUAL_MIXED_BRIDGE_POLE_ROW_RESOLVENT_CANCELLATION_REDUCTION.md":
        "610aa2b58734ab191e561bbaa7529f0558e1f979fa67461273e69f6d6253cde2",
    "tests/test_actual_mixed_bridge_pole_row_resolvent_cancellation_reduction.py":
        "678e6da6c989c536ba6131fdfd38fe5927c60d464b29e8d358d94af0a9c0f2a4",
    "notes/ODD_POLE_HARMONIC_CHEBYSHEV_OBSTRUCTION.md":
        "703c19f9cbadd73e6b60672a6f836fc2bd0bf7d43eaa5f60ac5806dd1cdc0d18",
    "notes/ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md":
        "c5134b4fb80bf2fcb654a1b31a7422aa089973a664cda90707d30ce7e469ddcc",
    "notes/CUTOFF_FREE_FULL_SOURCE_ADJOINT_PROLATE_CAPTURE_BARRIER.md":
        "157bffc55aeec592c263d5973effe1b9506e02dd97311652ecb2fdee0c3ff0e9",
    "tests/test_cutoff_free_full_source_adjoint_prolate_capture_barrier.py":
        "d7f70dffbd10021ce7d6e8887d10589a482b2dc64c9ebbe8c48cc35568c233ae",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left, right):
    return sum((x * y for x, y in zip(left, right)), F(0))


def diagonal_action(diagonal, vector):
    return tuple(value * coordinate for value, coordinate in zip(diagonal, vector))


def matvec(matrix, vector):
    return tuple(
        sum((entry * coordinate for entry, coordinate in zip(row, vector)), F(0))
        for row in matrix
    )


def determinant(matrix):
    size = len(matrix)
    if size == 0:
        return F(1)
    work = [list(row) for row in matrix]
    result = F(1)
    for column in range(size):
        pivot = next(
            (row for row in range(column, size) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        pivot_value = work[column][column]
        result *= pivot_value
        for row in range(column + 1, size):
            factor = work[row][column] / pivot_value
            for entry in range(column + 1, size):
                work[row][entry] -= factor * work[column][entry]
    return result


def principal_minor(matrix, indices):
    return determinant(
        tuple(tuple(matrix[i][j] for j in indices) for i in indices)
    )


def diagonal_resolvent(diagonal, vector, shift):
    return sum(
        (coordinate * coordinate / (value - shift)
         for value, coordinate in zip(diagonal, vector)),
        F(0),
    )


class ActualMixedBridgeResolventMixedMeasureTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)

    def test_simple_spectrum_cyclic_same_diagonal_counterpair(self) -> None:
        # Exact prescribed data: p=(1,2,3,4), M=30, beta=2, a=1.
        pole = (F(1), F(2), F(3), F(4))
        mass = dot(pole, pole)
        beta = F(2)
        a_value = beta / 2
        rho = (F(1), F(2), F(4), F(7))
        s_value = dot(tuple(value * value for value in pole), rho)
        self.assertEqual(mass, 30)
        self.assertEqual(s_value, 157)

        resolvent = tuple(value / (2 * s_value) for value in rho)
        h_diagonal = tuple(1 / value for value in resolvent)
        bridge_zero = tuple(
            sign * a_value / value
            for sign, value in zip((1, 1, 1, -1), pole)
        )
        bridge_live = tuple(
            sign * a_value / value
            for sign, value in zip((-1, 1, 1, 1), pole)
        )

        self.assertEqual(dot(pole, bridge_zero), beta)
        self.assertEqual(dot(pole, bridge_live), beta)
        self.assertEqual(dot(bridge_zero, bridge_zero), F(205, 144))
        self.assertEqual(dot(bridge_zero, bridge_zero), dot(bridge_live, bridge_live))
        self.assertEqual(
            tuple(value * value for value in bridge_zero),
            tuple(value * value for value in bridge_live),
        )
        self.assertEqual(len(set(h_diagonal)), 4)

        response = diagonal_action(resolvent, pole)
        m_value = dot(pole, response)
        m_prime = dot(response, response)
        self.assertEqual(m_value, F(1, 2))
        self.assertGreaterEqual(4 * mass * m_prime, 1)
        self.assertLessEqual(4 * mass * m_prime, 7)
        self.assertGreaterEqual(min(h_diagonal), 2 * mass / 7)
        self.assertLessEqual(max(h_diagonal), 14 * mass)

        mixed_zero = dot(bridge_zero, response)
        mixed_live = dot(bridge_live, response)
        self.assertEqual(mixed_zero, 0)
        self.assertEqual(mixed_live, F(6, 157))

        # Both diagonal resolvent functions agree at every tested shift.
        for shift in (F(-1), F(0), F(10), F(40)):
            self.assertEqual(
                diagonal_resolvent(h_diagonal, bridge_zero, shift),
                diagonal_resolvent(h_diagonal, bridge_live, shift),
            )

        # Each atom of the matrix measure saturates Cauchy--Schwarz.
        for p_value, w_value in zip(pole, bridge_zero):
            self.assertEqual((p_value * w_value) ** 2, p_value**2 * w_value**2)

        # Distinct spectrum and nonzero pole coordinates make the pole cyclic.
        krylov = tuple(
            tuple(pole[row] * h_diagonal[row] ** column for column in range(4))
            for row in range(4)
        )
        self.assertNotEqual(determinant(krylov), 0)

    def test_pole_created_ground_and_exact_dictionary(self) -> None:
        pole = (F(1), F(2), F(3), F(4))
        rho = (F(1), F(2), F(4), F(7))
        s_value = F(157)
        resolvent = tuple(value / (2 * s_value) for value in rho)
        h_diagonal = tuple(1 / value for value in resolvent)
        q_matrix = tuple(
            tuple(
                (h_diagonal[i] if i == j else F(0)) - 2 * pole[i] * pole[j]
                for j in range(4)
            )
            for i in range(4)
        )
        response = diagonal_action(resolvent, pole)
        self.assertEqual(matvec(q_matrix, response), (F(0),) * 4)

        # Every proper principal minor is positive; the full determinant is zero.
        for size in range(1, 4):
            for indices in combinations(range(4), size):
                self.assertGreater(principal_minor(q_matrix, indices), 0)
        self.assertEqual(determinant(q_matrix), 0)

        m_prime = dot(response, response)
        bridge_zero = (F(1), F(1, 2), F(1, 3), F(-1, 4))
        bridge_live = (F(-1), F(1, 2), F(1, 3), F(1, 4))
        f_zero = dot(bridge_zero, response)
        f_live = dot(bridge_live, response)
        self.assertEqual(f_zero * f_zero / m_prime, 0)
        self.assertGreater(f_live * f_live / m_prime, 0)

        # Exact load and pole-shear derivatives from the dictionary.
        load_derivative = -1 / (4 * m_prime)
        ground_pole_overlap_squared = F(1, 4) / m_prime
        self.assertEqual(load_derivative, -ground_pole_overlap_squared)
        self.assertEqual(-2 * f_zero / m_prime, 0)
        self.assertNotEqual(-2 * f_live / m_prime, 0)

    def test_positive_coordinate_source_sign_fixture(self) -> None:
        # M=2 and beta=4 make every entry rational.
        mass = F(2)
        pole = (F(1), F(1), F(0))
        bridge = (F(3), F(1), F(1))
        h_matrix = (
            (F(20), F(8), F(0)),
            (F(8), F(4), F(0)),
            (F(0), F(0), F(4)),
        )
        resolvent = (
            (F(1, 4), F(-1, 2), F(0)),
            (F(-1, 2), F(5, 4), F(0)),
            (F(0), F(0), F(1, 4)),
        )
        response = matvec(resolvent, pole)
        self.assertEqual(dot(pole, pole), mass)
        self.assertEqual(dot(pole, bridge), 4)
        self.assertEqual(dot(pole, response), F(1, 2))
        self.assertEqual(dot(bridge, response), 0)
        self.assertEqual(4 * mass * dot(response, response), 5)
        self.assertGreater(h_matrix[0][1], 0)
        self.assertTrue(all(value >= 0 for value in pole + bridge))

        q_matrix = tuple(
            tuple(h_matrix[i][j] - 2 * pole[i] * pole[j] for j in range(3))
            for i in range(3)
        )
        self.assertEqual(matvec(q_matrix, response), (F(0),) * 3)
        self.assertEqual(determinant(q_matrix), 0)

    def test_literal_positive_half_and_generalized_harmonic_rows(self) -> None:
        lam = F(3)
        v_value = F(4, 3)
        count = int(lam * v_value)
        self.assertEqual(count, 4)  # Inclusive n <= lambda*v.

        harmonic = sum((F(1, n) for n in range(1, count + 1)), F(0))
        pole_row = sum(
            (F(1, 2) * (F(1, n) - 1 / v_value)
             for n in range(1, count + 1)),
            F(0),
        )
        self.assertEqual(pole_row, F(1, 2) * (harmonic - count / v_value))

        # For g(log u)=u^(3/2)-u^(-3/2), the same positive-half row is
        # v*sum(1/n^2)-sum(n)/v^2, an exact non-harmonic fixture.
        generalized = sum(
            (v_value / (n * n) - F(n) / (v_value * v_value)
             for n in range(1, count + 1)),
            F(0),
        )
        expected = (
            v_value * sum((F(1, n * n) for n in range(1, count + 1)), F(0))
            - F(count * (count + 1), 2) / (v_value * v_value)
        )
        self.assertEqual(generalized, expected)
        self.assertNotEqual(generalized, pole_row)

    def test_positive_half_row_has_exact_full_even_half_factor(self) -> None:
        # A rational finite-cell analogue of the full even source pairing.
        source_positive = (F(3), F(-4), F(1))
        row_positive = (F(2), F(5), F(-1))
        self.assertEqual(sum(source_positive, F(0)), 0)

        positive_half_pairing = dot(source_positive, row_positive)
        ambient_positive = tuple(value / 2 for value in row_positive)
        full_source = source_positive + source_positive
        full_ambient_adjoint = ambient_positive + ambient_positive
        self.assertEqual(dot(full_source, full_ambient_adjoint), positive_half_pairing)

        # Project the ambient full-even adjoint to the zero-mean subspace.
        constant = sum(row_positive, F(0)) / (2 * len(row_positive))
        projected_positive = tuple(value - constant for value in ambient_positive)
        full_projected_adjoint = projected_positive + projected_positive
        self.assertEqual(sum(full_projected_adjoint, F(0)), 0)
        self.assertEqual(dot(full_source, full_projected_adjoint), positive_half_pairing)

        # Omitting the factor 1/2 doubles the represented functional.
        raw_even_row = row_positive + row_positive
        self.assertEqual(dot(full_source, raw_even_row), 2 * positive_half_pairing)

    def test_scope_and_exact_tokens(self) -> None:
        required = (
            "|F(\\mu)|^2\\over m'(\\mu)",
            "1+\\|B_\\mu^{-1}r\\|^2=4M m'(\\mu)",
            "same complete diagonal spectral",
            "p` is cyclic",
            "F_0(0)={a\\over2S}(1+2+4-7)=0",
            "F_1(0)",
            "r_g(v)",
            "exact positive-half row",
            "{1\\over2}{\\bf1}_{\\{|x|\\geq\\lambda^{-1}\\}}r_g(|x|)",
            "c_g={1\\over2\\lambda}",
            "not the full-even Hilbert",
            "H_N-{N\\over v}",
            "R_\\mu p_\\lambda",
            "upper arithmetic index is inclusive",
            "prime-power threshold",
            "not a modification of the actual source residual",
            "e^{-o(\\lambda^2)}",
            "standard eight are untouched",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "the actual mixed row cancels identically",
            "diagonal spectral measures determine the mixed measure",
            "the prime jumps prove the bridge overlap",
        )
        lowered = self.text.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

    def test_display_tags_ascii_and_import_hygiene(self) -> None:
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
                "itertools",
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
        self.assertGreaterEqual(len(displays), 50)
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
