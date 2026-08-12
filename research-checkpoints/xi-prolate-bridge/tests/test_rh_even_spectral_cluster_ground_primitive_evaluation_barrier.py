#!/usr/bin/env python3
"""Exact regressions for the spectral-cluster and ground-primitive barrier."""

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
    / "RH_EVEN_SPECTRAL_CLUSTER_GROUND_PRIMITIVE_EVALUATION_BARRIER.md"
)
NOTE_HASH = "75e5b1b9b916f0ea1732c95bcd9940be4ff0308f561897e64cc0a7141a0c4c4a"

FROZEN = {
    "notes/RH_EVEN_QUOTIENT_ENDPOINT_FLAT_FLOOR_OBSTRUCTION.md":
        "b0a561a048df0b0eede249be8cc014ce29b8aa8fa29efb61de5d9bf773822d8c",
    "tests/test_rh_even_quotient_endpoint_flat_floor_obstruction.py":
        "1f9caeec9487afd7a632b8572e1e401dbca22a2acb2b37b5359d5b5bf6ce1742",
    "notes/RH_EVEN_ENDPOINT_FLAT_GROUND_SHIFT_RATIO_BARRIER.md":
        "3aefae1160a823e7cd2ea4b5d35dc3c2048ea98faf855297a7b3e3212fae7d1e",
    "tests/test_rh_even_endpoint_flat_ground_shift_ratio_barrier.py":
        "cd3edcc91392261de65e84cac3f4d94a9effe358d87a3e2d4108761d23cb61ee",
    "notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md":
        "e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26",
    "tests/test_source_cauchy_selector_cone_projective_tradeoff.py":
        "f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee",
}

Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]
Polynomial = tuple[F, ...]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left: Vector, right: Vector) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


def outer(vector: Vector) -> Matrix:
    return tuple(tuple(x * y for y in vector) for x in vector)


def rank(matrix: tuple[tuple[F, ...], ...]) -> int:
    if not matrix:
        return 0
    work = [list(row) for row in matrix]
    row_count = len(work)
    column_count = len(work[0])
    pivot_row = 0
    for column in range(column_count):
        pivot = next(
            (
                row
                for row in range(pivot_row, row_count)
                if work[row][column]
            ),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        pivot_value = work[pivot_row][column]
        for row in range(row_count):
            if row == pivot_row or not work[row][column]:
                continue
            multiplier = work[row][column] / pivot_value
            for index in range(column, column_count):
                work[row][index] -= multiplier * work[pivot_row][index]
        pivot_row += 1
        if pivot_row == row_count:
            break
    return pivot_row


def symmetric_coordinates(matrix: Matrix) -> Vector:
    return tuple(
        matrix[row][column]
        for row in range(len(matrix))
        for column in range(row, len(matrix))
    )


def poly_multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    values = [F(0) for _ in range(len(left) + len(right) - 1)]
    for i, x in enumerate(left):
        for j, y in enumerate(right):
            values[i + j] += x * y
    return tuple(values)


def poly_from_roots(roots: tuple[F, ...]) -> Polynomial:
    result: Polynomial = (F(1),)
    for root in roots:
        result = poly_multiply(result, (-root, F(1)))
    return result


def poly_evaluate(polynomial: Polynomial, point: F) -> F:
    result = F(0)
    for coefficient in reversed(polynomial):
        result = result * point + coefficient
    return result


def quotient_residues(
    carrier_squares: tuple[F, ...],
    selected_squares: tuple[F, ...],
    multiplier: Polynomial,
) -> Vector:
    numerator = poly_multiply(poly_from_roots(selected_squares), multiplier)
    residues = []
    for index, node in enumerate(carrier_squares):
        derivative = math.prod(
            node - other
            for other_index, other in enumerate(carrier_squares)
            if other_index != index
        )
        residues.append(poly_evaluate(numerator, node) / derivative)
    return tuple(residues)


def source_matrix(
    modes: tuple[int, ...],
    diagonal: Vector,
    source_row: Vector,
) -> Matrix:
    return tuple(
        tuple(
            diagonal[i]
            if i == j
            else (source_row[i] - source_row[j]) / F(left - right)
            for j, right in enumerate(modes)
        )
        for i, left in enumerate(modes)
    )


def q_vector(modes: tuple[int, ...], parameter: F) -> Vector:
    return tuple(
        math.prod(parameter - other for other in modes if other != mode)
        for mode in modes
    )


def shifted_hyperplane(
    count: int, tau: F, epsilon: F
) -> tuple[tuple[int, ...], Matrix]:
    modes = tuple(range(-count, count + 1))
    dimension = len(modes)
    matrix = tuple(
        tuple(
            tau + epsilon * F(dimension - 1, dimension)
            if i == j
            else -epsilon / dimension
            for j in range(dimension)
        )
        for i in range(dimension)
    )
    return modes, matrix


class RHEvenSpectralClusterGroundPrimitiveEvaluationBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 6)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_k_plane_partial_fractions_and_carrier_branches(self) -> None:
        # N=8, M=3, k=2 gives s=3.  The selected squares include an
        # in-band carrier 2^2, a noncarrier 7, and out-of-band carrier 10^2.
        count = 8
        selected = (F(4), F(7), F(100))
        carrier_squares = tuple(F(n * n) for n in range(1, count + 1))
        multipliers = ((F(1),), (F(0), F(1)))
        vectors = tuple(
            quotient_residues(carrier_squares, selected, multiplier)
            for multiplier in multipliers
        )

        self.assertEqual(rank(vectors), 2)
        for vector in vectors:
            # In-band carrier collision: the continuous row is one
            # coordinate and that residue is exactly zero.
            self.assertEqual(vector[1], 0)

            # Noncarrier selected row vanishes by the quotient numerator.
            noncarrier_value = sum(
                (
                    coefficient / (selected[1] - node)
                    for coefficient, node in zip(vector, carrier_squares)
                ),
                F(0),
            )
            self.assertEqual(noncarrier_value, 0)

            # The quotient also vanishes at the out-of-band selected
            # carrier square; independently, the Fourier sine factor is
            # zero there and no retained denominator has a pole.
            out_of_band_value = sum(
                (
                    coefficient / (selected[2] - node)
                    for coefficient, node in zip(vector, carrier_squares)
                ),
                F(0),
            )
            self.assertEqual(out_of_band_value, 0)

            # Uniform endpoint moments r=0,1,2 vanish because s=3.
            for moment in range(3):
                self.assertEqual(
                    sum(
                        (
                            coefficient * node**moment
                            for coefficient, node in zip(
                                vector, carrier_squares
                            )
                        ),
                        F(0),
                    ),
                    0,
                )

        # Check the complete partial-fraction identity away from poles.
        numerator_base = poly_from_roots(selected)
        denominator = poly_from_roots(carrier_squares)
        for multiplier, vector in zip(multipliers, vectors):
            numerator = poly_multiply(numerator_base, multiplier)
            for point in (F(3, 2), F(17, 3), F(71, 2)):
                left = poly_evaluate(numerator, point) / poly_evaluate(
                    denominator, point
                )
                right = sum(
                    (
                        coefficient / (point - node)
                        for coefficient, node in zip(
                            vector, carrier_squares
                        )
                    ),
                    F(0),
                )
                self.assertEqual(left, right)

    def test_optimized_cluster_exponent(self) -> None:
        constants = []
        for delta in (0.0, 0.1, 0.25, 0.49):
            target = 1.0 + math.log(2.0 * (1.0 - delta))
            w = 1.4
            for _ in range(20):
                value = w + math.log(w) - target
                w -= value / (1.0 + 1.0 / w)
            theta = (1.0 - delta) / w
            exponent = 4.0 * (1.0 - delta) * (w - 1.0) ** 2 / w
            direct = 4.0 * (1.0 - delta - theta) * math.log(
                2.0 * theta
            )

            self.assertAlmostEqual(w * math.exp(w), 2 * math.e * (1 - delta))
            self.assertGreater(theta, 0.5)
            self.assertLess(theta, 1.0 - delta)
            self.assertGreater(exponent, 0)
            self.assertAlmostEqual(exponent, direct)
            constants.append(exponent)

        self.assertAlmostEqual(constants[0], 0.4087565478, places=9)
        self.assertTrue(
            all(
                left > right
                for left, right in zip(constants, constants[1:])
            )
        )

    def test_arbitrary_ground_clamped_primitive_and_exact_ratio(self) -> None:
        # This unit vector has no endpoint-flat cancellation: 3/5+4/5 != 0.
        h = (F(3, 5), F(4, 5), F(0), F(0))
        frequencies = (F(1), F(2), F(3), F(4))
        self.assertEqual(dot(h, h), 1)
        self.assertNotEqual(sum(h, F(0)), 0)

        positive = tuple(
            -coefficient / frequency**2
            for coefficient, frequency in zip(h, frequencies)
        )
        central_over_sqrt2 = sum(
            (
                coefficient / frequency**2
                for coefficient, frequency in zip(h, frequencies)
            ),
            F(0),
        )
        self.assertEqual(
            central_over_sqrt2 + sum(positive, F(0)), 0
        )
        recovered = tuple(
            -(frequency**2) * coefficient
            for coefficient, frequency in zip(positive, frequencies)
        )
        self.assertEqual(recovered, h)

        primitive_norm = (
            dot(positive, positive) + 2 * central_over_sqrt2**2
        )
        omega = max(frequencies)
        self.assertGreaterEqual(primitive_norm, omega ** (-4))

        heights = (F(3), F(7), F(11))
        multiplicities = (F(2), F(1), F(3))
        samples = (F(2, 3), F(-3, 5), F(5, 7))
        energy = sum(
            (
                multiplicity * sample**2
                for multiplicity, sample in zip(multiplicities, samples)
            ),
            F(0),
        )
        negative_fourth_energy = sum(
            (
                multiplicity * sample**2 / height**4
                for height, multiplicity, sample in zip(
                    heights, multiplicities, samples
                )
            ),
            F(0),
        )
        sampling_mean = negative_fourth_energy / energy
        alpha = 2 * energy
        primitive_rayleigh = 2 * negative_fourth_energy / primitive_norm
        self.assertEqual(
            primitive_rayleigh / alpha,
            sampling_mean / primitive_norm,
        )

        # Exact low-row split at T=7.
        low_energy = sum(
            (
                multiplicity * sample**2
                for multiplicity, sample in zip(
                    multiplicities[:2], samples[:2]
                )
            ),
            F(0),
        )
        rho = low_energy / energy
        threshold = heights[1]
        upper = threshold ** (-4) + (
            heights[0] ** (-4) - threshold ** (-4)
        ) * rho
        self.assertLessEqual(sampling_mean, upper)

    def test_projective_evaluation_atoms_span_full_source_hankel_space(
        self,
    ) -> None:
        count = 2
        modes = tuple(range(-count, count + 1))
        dimension = len(modes)
        source_dimension = 2 * dimension - 1
        parameters = tuple(F(2 * index + 1, 2) for index in range(9))

        atom_coordinates = []
        for parameter in parameters:
            vector = q_vector(modes, parameter)
            atom = outer(vector)
            atom_coordinates.append(symmetric_coordinates(atom))

            delta = math.prod(parameter - mode for mode in modes)
            source_row = tuple(
                delta * value for value in vector
            )
            assembled = source_matrix(
                modes,
                tuple(atom[i][i] for i in range(dimension)),
                source_row,
            )
            self.assertEqual(assembled, atom)

        self.assertEqual(rank(tuple(atom_coordinates)), source_dimension)

        # Independently recover d diagonal plus d-1 source-row directions.
        source_basis = []
        for index in range(dimension):
            diagonal = tuple(
                F(1) if entry == index else F(0)
                for entry in range(dimension)
            )
            source_basis.append(
                symmetric_coordinates(
                    source_matrix(
                        modes, diagonal, (F(0),) * dimension
                    )
                )
            )
        for index in range(1, dimension):
            source_row = tuple(
                F(1) if entry == index else F(0)
                for entry in range(dimension)
            )
            source_basis.append(
                symmetric_coordinates(
                    source_matrix(
                        modes, (F(0),) * dimension, source_row
                    )
                )
            )
        self.assertEqual(rank(tuple(source_basis)), source_dimension)

    def test_shifted_hyperplane_source_and_deleted_even_ratio(self) -> None:
        count = 4
        tau = F(1, 5)
        epsilon = F(4, 5)
        modes, matrix = shifted_hyperplane(count, tau, epsilon)
        dimension = len(modes)
        eta = (F(1),) * dimension

        source_row = tuple(-epsilon * mode / dimension for mode in modes)
        assembled = source_matrix(
            modes,
            tuple(matrix[i][i] for i in range(dimension)),
            source_row,
        )
        self.assertEqual(assembled, matrix)
        self.assertEqual(matvec(matrix, eta), tuple(tau for _ in eta))

        transverse = (
            F(1),
            F(-1),
            F(0),
            F(0),
            F(0),
            F(0),
            F(0),
            F(0),
            F(0),
        )
        self.assertEqual(sum(transverse, F(0)), 0)
        self.assertEqual(
            matvec(matrix, transverse),
            tuple((tau + epsilon) * value for value in transverse),
        )

        deleted_even = tuple(
            tuple(
                tau + epsilon - 2 * epsilon / dimension
                if row == column
                else -2 * epsilon / dimension
                for column in range(count)
            )
            for row in range(count)
        )
        ones = (F(1),) * count
        alpha = tau + epsilon / dimension
        self.assertEqual(
            matvec(deleted_even, ones),
            tuple(alpha for _ in ones),
        )
        self.assertEqual(tau / alpha, F(1, 1) / (1 + F(4, dimension)))

        ratios = []
        for size in (4, 20, 100):
            d = 2 * size + 1
            ratios.append(tau / (tau + epsilon / d))
        self.assertTrue(
            all(left < right for left, right in zip(ratios, ratios[1:]))
        )
        self.assertGreater(ratios[-1], F(49, 50))

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 65)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
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

    def test_static_hygiene_and_fail_closed_scope(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            raw.decode("ascii")

        required = (
            "dimension exactly \\(k\\)",
            "\\lambda_k(A^\\circ)",
            "out-of-band carrier",
            "creates no derivative jet",
            "c_\\delta={4(1-\\delta)(w_\\delta-1)^2\\over w_\\delta}",
            "growing bottom cluster",
            "\\mathcal R_Nh",
            "negative-Sobolev/low-row conditioning ratio",
            "\\rho_{\\alpha,M}",
            "sum of two squares",
            "positive real Fourier-evaluation Gram",
            "arbitrarily close integer-weight finite Grams",
            "unconditional HSW-compatible divisor/prefix claim",
            "not the actual zeta zero Gram",
            "standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "the actual reserve follows",
            "the actual zeta zero Gram fails",
            "HSW-compatible padding theorem",
            "\\kappa_N=1",
            "q_N=r_N^{\\rm pr}",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)


if __name__ == "__main__":
    unittest.main()
