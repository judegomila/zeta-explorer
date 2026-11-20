#!/usr/bin/env python3
"""Strict regressions for the mixed Vandermonde cofactor target."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
import itertools
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
    / "CRITICAL_ODD_GROUND_MIXED_VANDERMONDE_COFACTOR_TARGET.md"
)
NOTE_HASH = "e29cbe760a3fea646220fa738573638ad42075e92cf4a0345e674002f9f91fda"

FROZEN = {
    "notes/CRITICAL_SCALAR_FLOOR_TO_TRUE_GROUND_ROW_DELETION_BARRIER.md":
        "3cf82e60d684f738e331ba5b4378ee7d0528bd47dd71c73bd551777750938ba4",
    "tests/test_critical_scalar_floor_to_true_ground_row_deletion_barrier.py":
        "0f4ca4642d750876a2216df0cec4f60704bc9cd977223d08b6796f89783437ba",
    "notes/RH_ACTUAL_ODD_GROUND_PRIMITIVE_CHRISTOFFEL_PARITY_BARRIER.md":
        "29475ddb8b57f227530b6aa296b088f07c4ac9db0cadd1a2d230b40a780b3157",
    "tests/test_rh_actual_odd_ground_primitive_christoffel_parity_barrier.py":
        "c03b4325d8f04266091dc3cd8ad17f6bf4f91ca97773cf7dfcaedb44f46caeb6",
    "notes/RH_ACTUAL_GROUND_CHRISTOFFEL_COMMUTATOR_RESPONSE_BARRIER.md":
        "aa1186ccef2d81c6428973b6a9757846f00758ad14eb6607854beab5fcded272",
    "tests/test_rh_actual_ground_christoffel_commutator_response_barrier.py":
        "a86e9751e2fd2d3fb4076a72438dda37d3e6cde7e04a8a36075af2ef8f0c2c67",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def determinant(matrix: list[list[F]]) -> F:
    """Return an exact determinant by fraction-preserving elimination."""
    size = len(matrix)
    if size == 0:
        return F(1)
    work = [row[:] for row in matrix]
    value = F(1)
    for column in range(size):
        pivot = next(
            (
                row
                for row in range(column, size)
                if work[row][column] != 0
            ),
            None,
        )
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            value = -value
        pivot_value = work[column][column]
        value *= pivot_value
        for row in range(column + 1, size):
            factor = work[row][column] / pivot_value
            for index in range(column + 1, size):
                work[row][index] -= factor * work[column][index]
    return value


def adjugate(matrix: list[list[F]]) -> list[list[F]]:
    size = len(matrix)
    return [
        [
            (-1) ** (row + column)
            * determinant(
                [
                    [
                        matrix[source_row][source_column]
                        for source_column in range(size)
                        if source_column != row
                    ]
                    for source_row in range(size)
                    if source_row != column
                ]
            )
            for column in range(size)
        ]
        for row in range(size)
    ]


def dot(left: list[F], right: list[F]) -> F:
    return sum((a * b for a, b in zip(left, right)), F(0))


def matrix_vector(matrix: list[list[F]], vector: list[F]) -> list[F]:
    return [dot(row, vector) for row in matrix]


def bilinear(left: list[F], matrix: list[list[F]], right: list[F]) -> F:
    return dot(left, matrix_vector(matrix, right))


def moments(atoms: dict[F, F], largest: int) -> list[F]:
    return [
        sum((weight * node**power for node, weight in atoms.items()), F(0))
        for power in range(largest + 1)
    ]


def hankel(moment_values: list[F], shift: int, size: int) -> list[list[F]]:
    return [
        [moment_values[row + column + shift] for column in range(size)]
        for row in range(size)
    ]


def vandermonde_squared(nodes: tuple[F, ...]) -> F:
    return product(
        (nodes[j] - nodes[i]) ** 2
        for i in range(len(nodes))
        for j in range(i + 1, len(nodes))
    )


def product(values) -> F:
    result = F(1)
    for value in values:
        result *= value
    return result


def elementary_next_to_top(nodes: tuple[F, ...]) -> F:
    if len(nodes) == 1:
        return F(1)
    return sum(
        (
            product(nodes[index] for index in range(len(nodes)) if index != skip)
            for skip in range(len(nodes))
        ),
        F(0),
    )


def unordered_r(atoms: dict[F, F], size: int) -> F:
    return sum(
        (
            vandermonde_squared(nodes)
            * elementary_next_to_top(nodes)
            * product(atoms[node] for node in nodes)
            for nodes in itertools.combinations(atoms, size)
        ),
        F(0),
    )


def unordered_k(atoms: dict[F, F], size: int) -> F:
    if size == 0:
        return F(1)
    return sum(
        (
            vandermonde_squared(nodes)
            * product(node**3 for node in nodes)
            * product(atoms[node] for node in nodes)
            for nodes in itertools.combinations(atoms, size)
        ),
        F(0),
    )


class CriticalOddGroundMixedVandermondeCofactorTargetTests(
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

    def test_bordered_cofactor_orientation_and_primitive_sign(self) -> None:
        # A positive source-Cauchy diagonal model: b_n=0 and the odd
        # ground is the first positive mode at lambda=5.
        shifted_odd = [
            [F(0), F(0), F(0)],
            [F(0), F(2), F(0)],
            [F(0), F(0), F(3)],
        ]
        inverse_modes = [F(1), F(1, 2), F(1, 3)]
        source_d = [F(0), F(0), F(0)]
        central_minus_ground = F(-1)
        residual = [
            central_minus_ground * value - source_value
            for value, source_value in zip(inverse_modes, source_d)
        ]
        adj = adjugate(shifted_odd)
        mixed = bilinear(inverse_modes, adj, residual)
        self.assertEqual(adj, [[F(6), F(0), F(0)], [F(0)] * 3, [F(0)] * 3])
        self.assertEqual(mixed, F(-6))

        bordered = [
            [F(0), *inverse_modes],
            *[
                [residual[row], *shifted_odd[row]]
                for row in range(3)
            ],
        ]
        self.assertEqual(determinant(bordered), -mixed)
        self.assertGreater(determinant(bordered), 0)

        ground = [F(1), F(0), F(0)]
        s_one = dot(inverse_modes, ground)
        b_two = dot(source_d, ground)
        primitive_difference = F(2) * s_one * (
            central_minus_ground * s_one - b_two
        )
        self.assertEqual(primitive_difference, F(-2))
        self.assertLess(primitive_difference, 0)

    def test_carrier_weights_are_exact_fractions(self) -> None:
        # h=1 and N=2 give D(y)=(y-1)(y-4).
        x_one = F(1)
        x_two = F(4)
        d_zero = (F(0) - x_one) * (F(0) - x_two)
        derivative_one = x_one - x_two
        derivative_two = x_two - x_one
        s_zero = F(1) / d_zero**2
        s_one = F(1) / (2 * x_one**2 * derivative_one**2)
        s_two = F(1) / (2 * x_two**2 * derivative_two**2)
        self.assertEqual((s_zero, s_one, s_two), (F(1, 16), F(1, 18), F(1, 288)))

    def test_geronimus_pencil_derivative_and_sign(self) -> None:
        # sigma has positive nodes 1 and 4; rho=3 delta_2 is the rank-one
        # Christoffel difference.  The kernel polynomial is p=y-2.
        sigma_positive = {F(1): F(1), F(4): F(1)}
        rho_over_y = {F(2): F(3, 2)}
        sigma_moments = moments(sigma_positive, 3)
        rho_moments = moments(rho_over_y, 3)
        h_sigma_one = hankel(sigma_moments, 1, 2)
        h_one = hankel(rho_moments, 1, 2)
        p = [F(-2), F(1)]
        self.assertEqual(matrix_vector(h_one, p), [F(0), F(0)])
        self.assertEqual(determinant(h_sigma_one), F(36))
        self.assertEqual(adjugate(h_one), [[F(12), F(-6)], [F(-6), F(3)]])

        # det(H_1+(1-z)H_sigma)=51(1-z)+36(1-z)^2.
        f_z_at_one = -sum(
            (
                adjugate(h_one)[row][column]
                * h_sigma_one[column][row]
                for row in range(2)
                for column in range(2)
            ),
            F(0),
        )
        self.assertEqual(f_z_at_one, F(-51))

        denominator = bilinear(p, h_sigma_one, p)
        self.assertEqual(denominator, F(17))
        for boundary_mass in (F(-1), F(1)):
            h_zero = hankel(rho_moments, 0, 2)
            h_zero[0][0] += boundary_mass
            f_t = sum(
                (
                    adjugate(h_one)[row][column] * h_zero[column][row]
                    for row in range(2)
                    for column in range(2)
                ),
                F(0),
            )
            derivative = -f_t / f_z_at_one
            hellmann_feynman = boundary_mass * p[0] ** 2 / denominator
            self.assertEqual(f_t, 12 * boundary_mass)
            self.assertEqual(derivative, hellmann_feynman)
            self.assertEqual(derivative > 0, boundary_mass > 0)

    def test_constant_one_origin_atom_dominance(self) -> None:
        # At lambda=1, nu_+ equals sigma_+ plus (3/2) delta_2.
        # Their difference omega_+=(3/2)delta_2 has R=0 and K=12.
        sigma_positive = {F(1): F(1), F(4): F(1)}
        nu_positive = {F(1): F(1), F(2): F(3, 2), F(4): F(1)}
        omega_positive = {
            node: nu_positive.get(node, F(0)) - sigma_positive.get(node, F(0))
            for node in set(nu_positive) | set(sigma_positive)
        }
        omega_positive = {
            node: weight for node, weight in omega_positive.items() if weight
        }
        r_value = unordered_r(omega_positive, 2)
        k_value = unordered_k(omega_positive, 1)
        self.assertEqual(r_value, 0)
        self.assertEqual(k_value, F(12))

        lambda_value = F(1)
        s_zero = F(1)
        f_t = r_value - lambda_value * s_zero * k_value
        self.assertEqual(f_t, F(-12))
        self.assertLess(r_value, lambda_value * s_zero * k_value)

    def test_positive_alternating_expansion_with_exact_factors(self) -> None:
        sigma_positive = {F(1): F(1), F(4): F(1)}
        nu_positive = {F(1): F(1), F(2): F(3, 2), F(4): F(1)}

        r_zero = unordered_r(nu_positive, 2)
        r_two = unordered_r(sigma_positive, 2)
        r_one = sum(
            (
                (zero_node - carrier_node) ** 2
                * (zero_node + carrier_node)
                * zero_weight
                * carrier_weight
                for carrier_node, carrier_weight in sigma_positive.items()
                for zero_node, zero_weight in nu_positive.items()
            ),
            F(0),
        )
        self.assertEqual((r_zero, r_one, r_two), (F(171, 2), F(261, 2), F(45)))
        self.assertTrue(all(value >= 0 for value in (r_zero, r_one, r_two)))
        self.assertEqual(r_zero - r_one + r_two, 0)

        k_zero = sum(
            (weight * node**3 for node, weight in nu_positive.items()),
            F(0),
        )
        k_one = sum(
            (weight * node**3 for node, weight in sigma_positive.items()),
            F(0),
        )
        self.assertEqual((k_zero, k_one), (F(77), F(65)))
        self.assertEqual(k_zero - k_one, F(12))

        r_even = r_zero + r_two
        r_odd = r_one
        k_even = k_zero
        k_odd = k_one
        self.assertLess(r_even + k_odd, r_odd + k_even)
        self.assertEqual(
            (r_odd + k_even) - (r_even + k_odd),
            F(12),
        )

    def test_growing_positive_evaluation_family_has_both_signs(self) -> None:
        for size in (2, 3, 4, 6):
            carrier_nodes = [F(index * index) for index in range(1, size + 1)]
            root_nodes = [F(index * index + index) for index in range(1, size)]
            carrier_weights = [F(index + 1) for index in range(size)]
            rho_weights = [F(2 * index + 1) for index in range(1, size)]

            sigma_atoms = dict(zip(carrier_nodes, carrier_weights))
            h_sigma = hankel(moments(sigma_atoms, 2 * size - 1), 1, size)
            self.assertGreater(determinant(h_sigma), 0)

            rho_over_y = {
                node: weight / node
                for node, weight in zip(root_nodes, rho_weights)
            }
            h_one = hankel(moments(rho_over_y, 2 * size - 1), 1, size)
            self.assertEqual(determinant(h_one), 0)

            polynomial = [F(1)]
            for root in root_nodes:
                updated = [F(0)] * (len(polynomial) + 1)
                for index, coefficient in enumerate(polynomial):
                    updated[index] -= root * coefficient
                    updated[index + 1] += coefficient
                polynomial = updated
            self.assertEqual(matrix_vector(h_one, polynomial), [F(0)] * size)
            self.assertNotEqual(polynomial[0], 0)

            adj = adjugate(h_one)
            k_value = adj[0][0]
            self.assertGreater(k_value, 0)
            for boundary_mass in (F(-1, 2), F(1, 2)):
                h_zero = hankel(moments(rho_over_y, 2 * size - 2), 0, size)
                h_zero[0][0] += boundary_mass
                f_t = sum(
                    (
                        adj[row][column] * h_zero[column][row]
                        for row in range(size)
                        for column in range(size)
                    ),
                    F(0),
                )
                self.assertEqual(f_t, boundary_mass * k_value)
                self.assertEqual(f_t > 0, boundary_mass > 0)

    def test_halfgrid_and_minimax_claim_boundaries(self) -> None:
        required = (
            "R<\\lambda s_0K",
            "coefficient in (0.5) is exactly one",
            "dimensionless source primitive",
            "`(L/(2*pi))^2` times (2.7)",
            "wrong minimax direction",
            "one exterior row",
            "strict-parity branch has `lambda>0`",
            "R_{\\rm ev}+\\lambda s_0K_{\\rm odd}",
            "freely adjustable atom",
            "not the zeta divisor",
            "The standard eight files are",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "we prove RH",
            "RH is proved",
            "the actual arithmetic matrix satisfies (6.7)",
            "all finite gates are closed",
            "determinant convergence is proved",
            "the family in Section 8 is the zeta divisor",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

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

    def test_static_ascii_ast_and_cache_clean(self) -> None:
        self.note_bytes.decode("ascii")
        self.assertNotIn(b"\r", self.note_bytes)
        source_bytes = Path(__file__).read_bytes()
        source_text = source_bytes.decode("ascii")
        self.assertNotIn(b"\r", source_bytes)
        ast.parse(source_text)
        self.assertNotRegex(self.text, r"(?<!\\)\$\$")
        self.assertNotIn("\\begin{equation}", self.text)
        self.assertNotIn("\\end{equation}", self.text)
        self.assertNotRegex(
            self.text,
            r"\\begin\{aligned\}.*?\\tag",
        )
        self.assertNotRegex(self.text, r"(?<!\\)\bqquad\b")
        cache_entries = [
            path
            for path in ROOT.rglob("__pycache__")
            if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
