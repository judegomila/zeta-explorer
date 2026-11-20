#!/usr/bin/env python3
"""Exact regressions for the shifted zero-selector quadrature barrier."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
import itertools
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SHIFTED_ZERO_SELECTOR_GAUSSIAN_QUADRATURE_BARRIER.md"
NOTE_HASH = "1a2c95f9cf352a89b5eda544ac7158124761b1afe49ead464ca881ca08d6acd1"

FROZEN = {
    "notes/RH_CONDITIONAL_FIXED_ZERO_SELECTOR_CAPTURE_THEOREM.md":
        "07345bdb6278cd2914c7edaaa711351f4b8aa020038dca7a19b8c406e4a0f84c",
    "tests/test_rh_conditional_fixed_zero_selector_capture_theorem.py":
        "9de65e4fd61a71736c4df484a6b3f7ce0dd54a659b681baab0e6dd2bd0c36730",
    "notes/ODD_ZERO_GRAM_LOWER_FRAME_AUDIT.md":
        "0a38c332345f3279061db48b29744bbfa5cf976c63a4d9f9c8fb12768e3ab6c3",
    "tests/test_odd_zero_gram_lower_frame_audit.py":
        "b755e1238a81627a38e9ebcc61357cc806ac7ee52cd9a18c0a0f5eae6c8d8467",
    "notes/STRICT_ODD_SELECTOR_SHELL_LOCALIZATION_THEOREM.md":
        "f84eb9ea08d7af397c201c645c7de5eb8957bc03ac6a5a7e55b653bc3d6321dc",
    "tests/test_strict_odd_selector_shell_localization_theorem.py":
        "5d0c8aa4a72177031f045bfd2318fdd66f40eb60ed8f541b3f6823e970d0ed81",
    "notes/Q0_FREE_SELECTOR_SECANT_ROOT_PARITY_THEOREM.md":
        "7d61da7b191fa7f6c00cf83ec139b2cfeac6981b46fa6d2059c5c842aaf9ba22",
    "tests/test_q0_free_selector_secant_root_parity_theorem.py":
        "04b9f67ca9db40a01ae2b89e759a59083d538dcc3c1dc4598105ed1830d8acf6",
    "notes/NORMALIZED_SOURCE_QUOTIENT_RESPONSE_BARRIER.md":
        "a21be420fa1696cceffdaf653e083e848addd9ca13b3ad0b0f930476916271f2",
    "tests/test_normalized_source_quotient_response_barrier.py":
        "8bafeff220c3193e9dcd5b511db011e3df565fe1b773878f88f435be687f7026",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def poly_trim(poly: list[F]) -> list[F]:
    result = poly[:]
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def poly_add(left: list[F], right: list[F]) -> list[F]:
    size = max(len(left), len(right))
    result = [F(0) for _ in range(size)]
    for index, value in enumerate(left):
        result[index] += value
    for index, value in enumerate(right):
        result[index] += value
    return poly_trim(result)


def poly_scale(poly: list[F], scalar: F) -> list[F]:
    return poly_trim([scalar * value for value in poly])


def poly_mul(left: list[F], right: list[F]) -> list[F]:
    result = [F(0) for _ in range(len(left) + len(right) - 1)]
    for i, value in enumerate(left):
        for j, other in enumerate(right):
            result[i + j] += value * other
    return poly_trim(result)


def poly_eval(poly: list[F], value: F) -> F:
    result = F(0)
    for coefficient in reversed(poly):
        result = result * value + coefficient
    return result


def poly_derivative(poly: list[F]) -> list[F]:
    if len(poly) == 1:
        return [F(0)]
    return [F(index) * poly[index] for index in range(1, len(poly))]


def poly_from_roots(roots: list[F]) -> list[F]:
    result = [F(1)]
    for root in roots:
        result = poly_mul(result, [-root, F(1)])
    return result


def permutation_sign(permutation: tuple[int, ...]) -> int:
    inversions = sum(
        permutation[i] > permutation[j]
        for i in range(len(permutation))
        for j in range(i + 1, len(permutation))
    )
    return -1 if inversions % 2 else 1


def determinant(matrix: list[list[F]]) -> F:
    size = len(matrix)
    total = F(0)
    for permutation in itertools.permutations(range(size)):
        term = F(permutation_sign(permutation))
        for row, column in enumerate(permutation):
            term *= matrix[row][column]
        total += term
    return total


def polynomial_determinant(matrix: list[list[list[F]]]) -> list[F]:
    size = len(matrix)
    total = [F(0)]
    for permutation in itertools.permutations(range(size)):
        term = [F(permutation_sign(permutation))]
        for row, column in enumerate(permutation):
            term = poly_mul(term, matrix[row][column])
        total = poly_add(total, term)
    return poly_trim(total)


def matrix_rank(matrix: list[list[F]]) -> int:
    work = [row[:] for row in matrix]
    rows = len(work)
    columns = len(work[0])
    pivot_row = 0
    for column in range(columns):
        pivot = next(
            (row for row in range(pivot_row, rows) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        scale = work[pivot_row][column]
        work[pivot_row] = [value / scale for value in work[pivot_row]]
        for row in range(rows):
            if row == pivot_row or work[row][column] == 0:
                continue
            factor = work[row][column]
            work[row] = [
                value - factor * pivot_value
                for value, pivot_value in zip(work[row], work[pivot_row])
            ]
        pivot_row += 1
        if pivot_row == rows:
            break
    return pivot_row


def pi_data(size: int) -> tuple[list[F], list[F], list[F], list[F]]:
    nodes = [F(index * index) for index in range(1, size + 1)]
    polynomial = poly_from_roots(nodes)
    first = poly_derivative(polynomial)
    second = poly_derivative(first)
    return nodes, polynomial, first, second


def moment_matrices(nodes: list[F], weights: list[F]) -> tuple[list[list[F]], list[list[F]]]:
    size = len(nodes)
    moments = [
        sum((weight * node**degree for node, weight in zip(nodes, weights)), F(0))
        for degree in range(2 * size)
    ]
    gram = [[moments[i + j] for j in range(size)] for i in range(size)]
    shifted = [[moments[i + j + 1] for j in range(size)] for i in range(size)]
    return gram, shifted


def paired_matrix(size: int, roots: list[F], weights: list[F]) -> list[list[F]]:
    labels = list(range(-size, size + 1))
    matrix = [[F(0) for _ in labels] for _ in labels]
    for root, weight in zip(roots, weights):
        for i, left in enumerate(labels):
            for j, right in enumerate(labels):
                matrix[i][j] += weight * (
                    1 / (F(left) - root) / (F(right) - root)
                    + 1 / (F(left) + root) / (F(right) + root)
                )
    return matrix


def source_row(size: int, roots: list[F], weights: list[F]) -> list[F]:
    return [
        sum(
            (
                -2 * F(label) * weight / (F(label * label) - root**2)
                for root, weight in zip(roots, weights)
            ),
            F(0),
        )
        for label in range(-size, size + 1)
    ]


def ground_coefficients(size: int, roots: list[F]) -> list[F]:
    coefficients = []
    for label in range(-size, size + 1):
        p_value = -math.prod(F(label * label) - root**2 for root in roots)
        q_prime = math.prod(
            F(label - other)
            for other in range(-size, size + 1)
            if other != label
        )
        coefficients.append(-p_value / q_prime)
    return coefficients


def response_at_i(size: int, roots: list[F], t: F = F(1)) -> F:
    numerator = math.prod(1 + t**2 / root**2 for root in roots)
    denominator = math.prod(1 + t**2 / F(index * index) for index in range(1, size + 1))
    return numerator / denominator


class ShiftedZeroSelectorGaussianQuadratureBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 10)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_partial_fraction_degree_and_double_pole_coefficient(self) -> None:
        nodes, pi_poly, pi_first, pi_second = pi_data(3)
        polynomial = [F(2), F(-3), F(5), F(7), F(-2), F(4)]
        a_values = []
        b_values = []
        for node in nodes:
            pi_prime = poly_eval(pi_first, node)
            pi_double = poly_eval(pi_second, node)
            value = poly_eval(polynomial, node)
            derivative = poly_eval(poly_derivative(polynomial), node)
            b_values.append(value / pi_prime**2)
            a_values.append(
                derivative / pi_prime**2 - value * pi_double / pi_prime**3
            )

        for point in (F(-2), F(1, 2), F(5, 2), F(13, 2), F(12)):
            left = poly_eval(polynomial, point) / poly_eval(pi_poly, point) ** 2
            right = sum(
                (
                    a_value / (point - node)
                    + b_value / (point - node) ** 2
                    for node, a_value, b_value in zip(nodes, a_values, b_values)
                ),
                F(0),
            )
            self.assertEqual(left, right)

        # Degree 2N is not proper: Pi_N^2/Pi_N^2 has polynomial part one.
        self.assertEqual(len(poly_mul(pi_poly, pi_poly)) - 1, 6)

    def test_shell_constants_and_odd_basis_congruence(self) -> None:
        size = 3
        nodes, pi_poly, pi_first, _ = pi_data(size)
        regular_nodes = [F(1, 4), F(25, 4), F(49, 4), F(81, 4)]
        regular_weights = [F(2), F(3), F(5), F(7)]
        shells = [F(0), F(11), F(0)]
        shift = F(1, 5)

        def e_value(index: int, value: F) -> F:
            node = nodes[index - 1]
            if value == node:
                return -2 * index * poly_eval(pi_first, node)
            return 2 * index * poly_eval(pi_poly, value) / (node - value)

        for left in range(1, size + 1):
            for right in range(1, size + 1):
                functional = sum(
                    (
                        weight
                        * e_value(left, value)
                        * e_value(right, value)
                        / poly_eval(pi_poly, value) ** 2
                        for value, weight in zip(regular_nodes, regular_weights)
                    ),
                    F(0),
                )
                for index, node in enumerate(nodes, start=1):
                    functional += (
                        (shells[index - 1] - shift)
                        * e_value(left, node)
                        * e_value(right, node)
                        / (4 * node * poly_eval(pi_first, node) ** 2)
                    )

                odd_entry = sum(
                    (
                        4
                        * left
                        * right
                        * weight
                        / (nodes[left - 1] - value)
                        / (nodes[right - 1] - value)
                        for value, weight in zip(regular_nodes, regular_weights)
                    ),
                    F(0),
                )
                if left == right:
                    odd_entry += shells[left - 1] - shift
                self.assertEqual(functional, odd_entry)

                localizing = sum(
                    (
                        weight
                        * value
                        * e_value(left, value)
                        * e_value(right, value)
                        / poly_eval(pi_poly, value) ** 2
                        for value, weight in zip(regular_nodes, regular_weights)
                    ),
                    F(0),
                )
                for index, node in enumerate(nodes, start=1):
                    localizing += (
                        (shells[index - 1] - shift)
                        * node
                        * e_value(left, node)
                        * e_value(right, node)
                        / (4 * node * poly_eval(pi_first, node) ** 2)
                    )

                even_entry = sum(
                    (
                        4
                        * weight
                        * value
                        / (nodes[left - 1] - value)
                        / (nodes[right - 1] - value)
                        for value, weight in zip(regular_nodes, regular_weights)
                    ),
                    F(0),
                )
                if left == right:
                    even_entry += shells[left - 1] - shift
                self.assertEqual(localizing, F(left * right) * even_entry)

        # The exact carrier mass zeta/(4*x*Pi'(x)^2) contributes zeta.
        carrier_index = 2
        carrier_node = nodes[carrier_index - 1]
        carrier_value = e_value(carrier_index, carrier_node)
        carrier_mass = shells[carrier_index - 1] / (
            4 * carrier_node * poly_eval(pi_first, carrier_node) ** 2
        )
        self.assertEqual(carrier_mass * carrier_value**2, shells[carrier_index - 1])

    def test_gaussian_pencil_product_parity_and_anchor_are_exact(self) -> None:
        selector_nodes = [F(1, 4), F(5, 2), F(49, 4)]
        weights = [F(2), F(3), F(5)]
        gram, shifted = moment_matrices(selector_nodes, weights)
        gram_det = determinant(gram)
        self.assertGreater(gram_det, 0)

        pencil = [
            [[shifted[i][j], -gram[i][j]] for j in range(3)]
            for i in range(3)
        ]
        pencil_det = polynomial_determinant(pencil)
        expected = poly_scale(
            poly_from_roots(selector_nodes),
            F((-1) ** len(selector_nodes)) * gram_det,
        )
        self.assertEqual(pencil_det, expected)
        self.assertEqual(
            determinant(shifted) / gram_det,
            math.prod(selector_nodes),
        )

        size = len(selector_nodes)
        p_mu = math.prod(selector_nodes) / F(math.factorial(size) ** 2)
        self.assertEqual(
            determinant(shifted) / (F(math.factorial(size) ** 2) * gram_det),
            p_mu,
        )

        ground_poly = poly_from_roots(selector_nodes)
        for index in range(size + 1):
            node = F(index * index)
            direct = (
                F((-1) ** size)
                * poly_eval(ground_poly, node)
                / F(math.factorial(size - index) * math.factorial(size + index))
            )
            pencil_value = poly_eval(pencil_det, node) / (
                gram_det
                * F(math.factorial(size - index) * math.factorial(size + index))
            )
            self.assertEqual(direct, pencil_value)

    def test_positive_mu_zero_measure_becomes_signed_quadrature(self) -> None:
        # N=1: L_0=delta_4 and sigma_1=(1/4)delta_1.
        # At mu=2 the truncated functional is positive but its unique node
        # moves from the singleton support {4} to 7.
        shift = F(2)
        moment_zero = F(1) - shift / 4
        moment_one = F(4) - shift / 4
        self.assertGreater(moment_zero, 0)
        selector_node = moment_one / moment_zero
        self.assertEqual(selector_node, 7)
        self.assertNotEqual(selector_node, 4)

        # Both the odd and even relative reserves are exact in this N=1
        # model: M_0=1, S=1/4, H_0=4, S^(1)=1/4.
        delta_minus = 1 - shift / 4
        delta_plus = 1 - shift / 16
        self.assertEqual(delta_minus, F(1, 2))
        self.assertEqual(delta_plus, F(7, 8))
        selector_weight = moment_zero
        lambda_zero_at_selector = F(1)
        self.assertEqual(selector_weight, delta_minus * lambda_zero_at_selector)

    def test_compensating_roots_give_strict_source_cauchy_family(self) -> None:
        size = 4
        fixed_roots = [F(5, 2), F(7, 2)]
        fixed_product = math.prod(fixed_roots)
        compensating_product = F(math.factorial(size), 1) / fixed_product
        responses = []
        parities = []
        near_scaled_weights = []
        far_scaled_weights = []
        last_known_scaled_moments = []
        first_unknown_moments = []
        lattice_poly = poly_from_roots(
            [F(index * index) for index in range(1, size + 1)]
        )

        for epsilon in (F(1, 10), F(1, 100)):
            roots = fixed_roots + [epsilon, compensating_product / epsilon]
            self.assertGreater(roots[-1], size)
            self.assertEqual(
                math.prod(root**2 for root in roots),
                F(math.factorial(size) ** 2),
            )

            near_square = epsilon**2
            far_square = roots[-1] ** 2
            transformed_near = epsilon**4 / poly_eval(lattice_poly, near_square) ** 2
            transformed_far = F(1) / poly_eval(lattice_poly, far_square) ** 2
            near_scaled_weights.append(transformed_near / epsilon**4)
            far_scaled_weights.append(transformed_far / epsilon ** (4 * size))
            last_known_scaled_moments.append(
                transformed_far * far_square ** (2 * size - 1) / epsilon**2
            )
            first_unknown_moments.append(
                transformed_far * far_square ** (2 * size)
            )

            weights = [F(1), F(1), epsilon**4, F(1)]
            matrix = paired_matrix(size, roots, weights)
            row = source_row(size, roots, weights)
            labels = list(range(-size, size + 1))
            for i, left in enumerate(labels):
                for j, right in enumerate(labels):
                    if left != right:
                        self.assertEqual(
                            matrix[i][j],
                            (row[i] - row[j]) / F(left - right),
                        )

            ground = ground_coefficients(size, roots)
            self.assertEqual(sum(ground, F(0)), 1)
            self.assertEqual(ground[size], 1)
            self.assertTrue(all(ground[i] == ground[-1 - i] for i in range(2 * size + 1)))
            for matrix_row in matrix:
                self.assertEqual(
                    sum((entry * value for entry, value in zip(matrix_row, ground)), F(0)),
                    0,
                )
            self.assertEqual(matrix_rank(matrix), 2 * size)

            parities.append(
                tuple(sum(root < index for root in roots) % 2 for index in range(size + 1))
            )
            responses.append(response_at_i(size, roots))

        self.assertEqual(parities[0], parities[1])
        self.assertGreater(responses[1], 50 * responses[0])
        for scaled in (
            near_scaled_weights,
            far_scaled_weights,
            last_known_scaled_moments,
            first_unknown_moments,
        ):
            self.assertGreater(2 * scaled[1], scaled[0])
            self.assertLess(scaled[1], 2 * scaled[0])

    def test_one_and_three_captured_roots_have_same_parity_and_p_mu(self) -> None:
        size = 6
        epsilon = F(1, 1000)
        one_local = [F(5, 2), F(7, 2), F(13, 2), F(15, 2)]
        three_local = [F(9, 4), F(5, 2), F(11, 4), F(7, 2)]

        full_sets = []
        for fixed in (one_local, three_local):
            compensating_product = F(math.factorial(size), 1) / math.prod(fixed)
            roots = fixed + [epsilon, compensating_product / epsilon]
            self.assertGreater(roots[-1], size)
            self.assertEqual(
                math.prod(root**2 for root in roots),
                F(math.factorial(size) ** 2),
            )
            full_sets.append(roots)

        counts = [sum(F(2) < root < F(3) for root in roots) for roots in full_sets]
        self.assertEqual(counts, [1, 3])
        parities = [
            tuple(sum(root < index for root in roots) % 2 for index in range(size + 1))
            for roots in full_sets
        ]
        self.assertEqual(parities[0], parities[1])

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
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
                [compiler, "-interaction=nonstopmode", "-halt-on-error", source.name],
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
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(all(line == line.rstrip(b" ") for line in raw.splitlines()))

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "degree `2N-1`",
            "odd Gram alone",
            "simple-pole source identities",
            "positive-even localizing Gram",
            "signed finite-lattice, or multi-Uvarov, perturbation",
            "Gaussian-quadrature nodes",
            "localizing determinant",
            "genuine two-vector lower Ritz value",
            "R_{\\rm one}",
            "one or three simple roots",
            "same complete lattice parity pattern",
            "do not satisfy the actual RH zero functional",
            "checkpoint-1.36 standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        self.assertNotIn(r",qquad", self.text)
        self.assertNotIn(r"{mu\over", self.text)
        self.assertIn(r"{\mu\over\lambda_{\min}(A^\circ)}", self.text)

        forbidden = (
            "rh is proved",
            "actual local uniqueness is proved",
            "actual determinant convergence is proved",
            "structural family is the actual source",
            "standard eight are updated",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
