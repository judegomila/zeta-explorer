#!/usr/bin/env python3
"""Exact regressions for the diagonal-anchor forcing theorem package.

Only the Python standard library is used.  All matrices are over the
rationals or Q(sqrt(2)); no binary64 input, numerical eigensystem, source
artifact, or cached matrix is read.
"""

from __future__ import annotations

from dataclasses import dataclass
from fractions import Fraction as F
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "DIAGONAL_ANCHOR_FORCING_SIGNED_LAPLACIAN_STRIP_GATE.md"


@dataclass(frozen=True)
class Q2:
    """The exact real quadratic field Q(sqrt(2))."""

    a: F = F(0)
    b: F = F(0)

    @staticmethod
    def coerce(value: object) -> "Q2":
        if isinstance(value, Q2):
            return value
        if isinstance(value, (int, F)):
            return Q2(F(value), F(0))
        return NotImplemented

    def __add__(self, other: object) -> "Q2":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return Q2(self.a + rhs.a, self.b + rhs.b)

    __radd__ = __add__

    def __neg__(self) -> "Q2":
        return Q2(-self.a, -self.b)

    def __sub__(self, other: object) -> "Q2":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return self + (-rhs)

    def __rsub__(self, other: object) -> "Q2":
        lhs = self.coerce(other)
        if lhs is NotImplemented:
            return NotImplemented
        return lhs - self

    def __mul__(self, other: object) -> "Q2":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return Q2(
            self.a * rhs.a + 2 * self.b * rhs.b,
            self.a * rhs.b + self.b * rhs.a,
        )

    __rmul__ = __mul__

    def inverse(self) -> "Q2":
        denominator = self.a * self.a - 2 * self.b * self.b
        if denominator == 0:
            raise ZeroDivisionError("zero in Q(sqrt(2))")
        return Q2(self.a / denominator, -self.b / denominator)

    def __truediv__(self, other: object) -> "Q2":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return self * rhs.inverse()

    def __rtruediv__(self, other: object) -> "Q2":
        lhs = self.coerce(other)
        if lhs is NotImplemented:
            return NotImplemented
        return lhs / self


ZERO = Q2()
ONE = Q2(F(1))
ROOT2 = Q2(F(0), F(1))
INV_ROOT2 = Q2(F(0), F(1, 2))

Vector = tuple[Q2, ...]
Matrix = tuple[tuple[Q2, ...], ...]


def vector(*entries: object) -> Vector:
    return tuple(Q2.coerce(entry) for entry in entries)


def dot(left: Vector, right: Vector) -> Q2:
    return sum((x * y for x, y in zip(left, right)), ZERO)


def matvec(matrix: Matrix, value: Vector) -> Vector:
    return tuple(dot(row, value) for row in matrix)


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(column) for column in zip(*matrix))


def matmul(left: Matrix, right: Matrix) -> Matrix:
    columns = transpose(right)
    return tuple(tuple(dot(row, column) for column in columns) for row in left)


def subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x - y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def diagonal(*entries: object) -> Matrix:
    values = vector(*entries)
    return tuple(
        tuple(values[row] if row == column else ZERO for column in range(len(values)))
        for row in range(len(values))
    )


def outer(left: Vector, right: Vector) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def determinant_2(matrix: Matrix) -> Q2:
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def trace_2(matrix: Matrix) -> Q2:
    return matrix[0][0] + matrix[1][1]


def source_cauchy_raw(
    count: int,
    shell_diagonal: tuple[F, ...],
    positive_b: tuple[F, ...],
) -> Matrix:
    modes = tuple(range(-count, count + 1))

    def b(mode: int) -> F:
        if mode == 0:
            return F(0)
        return positive_b[mode - 1] if mode > 0 else -positive_b[-mode - 1]

    return tuple(
        tuple(
            Q2(shell_diagonal[abs(mode)])
            if mode == other
            else Q2((b(mode) - b(other)) / F(mode - other))
            for other in modes
        )
        for mode in modes
    )


def parity_bases(count: int) -> tuple[tuple[Vector, ...], tuple[Vector, ...]]:
    size = 2 * count + 1
    center = count
    even: list[Vector] = []
    odd: list[Vector] = []

    central = [ZERO] * size
    central[center] = ONE
    even.append(tuple(central))
    for shell in range(1, count + 1):
        plus = [ZERO] * size
        minus = [ZERO] * size
        plus[center - shell] = INV_ROOT2
        plus[center + shell] = INV_ROOT2
        minus[center - shell] = -INV_ROOT2
        minus[center + shell] = INV_ROOT2
        even.append(tuple(plus))
        odd.append(tuple(minus))
    return tuple(even), tuple(odd)


def compress(raw: Matrix, basis: tuple[Vector, ...]) -> Matrix:
    return tuple(
        tuple(dot(left, matvec(raw, right)) for right in basis)
        for left in basis
    )


def parity_blocks(
    count: int,
    shell_diagonal: tuple[F, ...],
    positive_b: tuple[F, ...],
) -> tuple[Matrix, Matrix, Matrix]:
    raw = source_cauchy_raw(count, shell_diagonal, positive_b)
    even, odd = parity_bases(count)
    return raw, compress(raw, even), compress(raw, odd)


def derivative(count: int) -> Matrix:
    return tuple(
        tuple(Q2(row + 1) if column == row + 1 else ZERO for column in range(count + 1))
        for row in range(count)
    )


def forced_counterfamily(t: F) -> dict[str, object]:
    """Build the exact N=2 source-Cauchy counterfamily."""

    x0 = t * t / 4
    x1 = -(1 + t * t) / 6
    x2 = (16 + t * t) / 24
    _, even, odd = parity_blocks(2, (F(0), F(0), F(0)), (F(1), F(0)))
    kappa = vector(x0, ROOT2 * x1, ROOT2 * x2)
    action = matvec(even, kappa)
    h = tuple(action[index] / kappa[index] for index in range(3))
    t_plus = subtract(even, diagonal(*h))
    t_minus = subtract(odd, diagonal(h[1], h[2]))

    dmap = (
        (ZERO, ONE, ZERO),
        (ZERO, ZERO, Q2(F(2))),
    )
    eta = vector(ONE, ROOT2, ROOT2)
    c = dot(eta, kappa)
    u = tuple(entry / c for entry in matvec(dmap, kappa))
    d = matvec(dmap, eta)
    dd_star = matmul(dmap, transpose(dmap))
    x_matrix = subtract(dd_star, outer(u, d))
    k_matrix = matmul(dmap, matmul(t_plus, transpose(dmap)))

    return {
        "raw_coefficients": (x0, x1, x2),
        "kappa": kappa,
        "even": even,
        "odd": odd,
        "h": h,
        "t_plus": t_plus,
        "t_minus": t_minus,
        "dmap": dmap,
        "eta": eta,
        "c": c,
        "u": u,
        "d": d,
        "x_matrix": x_matrix,
        "k_matrix": k_matrix,
    }


class DiagonalAnchorForcingTests(unittest.TestCase):
    def test_note_locks_the_claim_boundary_and_physical_scale(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        self.assertIn("theorem-only", text)
        self.assertIn("No finite", text)
        self.assertIn("decimal row or numerical pilot is used", text)
        self.assertIn("P0_INVALIDATED", text)
        self.assertIn(r"\delta={L\over4\pi}", text)
        self.assertIn(r"\widehat\kappa(z)", text)
        self.assertIn("strict signed-Laplacian premise", text)
        self.assertIn("conditional RH route", text)
        self.assertIn("They prove no", text)
        self.assertIn("actual-source signed-Laplacian inequality", text)
        self.assertIn("no Riemann-hypothesis conclusion", text)
        self.assertNotIn("lambda=2.75", text)
        self.assertNotIn("Riemann hypothesis is proved", text)

    def test_forced_diagonal_is_exactly_a_signed_laplacian(self) -> None:
        a = (
            (F(2), F(3), F(-1)),
            (F(3), F(5), F(4)),
            (F(-1), F(4), F(7)),
        )
        kappa = (F(2), F(-3), F(5))
        mu = F(7)
        action = tuple(sum(row[j] * kappa[j] for j in range(3)) for row in a)
        h = tuple(action[i] / kappa[i] - mu for i in range(3))
        shifted = tuple(
            tuple(
                a[i][j] - (h[i] + mu if i == j else 0)
                for j in range(3)
            )
            for i in range(3)
        )
        self.assertEqual(
            tuple(sum(shifted[i][j] * kappa[j] for j in range(3)) for i in range(3)),
            (F(0), F(0), F(0)),
        )

        weights = {
            (i, j): -a[i][j] * kappa[i] * kappa[j]
            for i in range(3)
            for j in range(i + 1, 3)
        }
        laplacian = tuple(
            tuple(
                (
                    sum(weights[(min(i, j), max(i, j))] for j in range(3) if j != i)
                    if i == column
                    else -weights[min(i, column), max(i, column)]
                )
                for column in range(3)
            )
            for i in range(3)
        )
        congruence = tuple(
            tuple(kappa[i] * shifted[i][j] * kappa[j] for j in range(3))
            for i in range(3)
        )
        self.assertEqual(congruence, laplacian)

        f = (F(2), F(-1), F(4))
        z = tuple(kappa[i] * f[i] for i in range(3))
        direct = sum(z[i] * shifted[i][j] * z[j] for i in range(3) for j in range(3))
        graph = sum(weight * (f[i] - f[j]) ** 2 for (i, j), weight in weights.items())
        self.assertEqual(direct, graph)

        # The weights are defined without division.  A zero anchor coordinate
        # isolates its vertex, so the strict one-dimensional kernel gate fails.
        zero_kappa = (F(2), F(0), F(5))
        zero_weights = {
            (i, j): -a[i][j] * zero_kappa[i] * zero_kappa[j]
            for i in range(3)
            for j in range(i + 1, 3)
        }
        self.assertEqual(zero_weights[0, 1], F(0))
        self.assertEqual(zero_weights[1, 2], F(0))

    def test_one_negative_edge_effective_resistance_threshold_is_sharp(self) -> None:
        # The positive path 0--1--2 has effective resistance two from 0 to 2.
        positive_reduced = ((F(1), F(-1)), (F(-1), F(2)))
        inverse = ((F(2), F(1)), (F(1), F(1)))
        self.assertEqual(
            tuple(
                tuple(sum(positive_reduced[i][k] * inverse[k][j] for k in range(2)) for j in range(2))
                for i in range(2)
            ),
            ((F(1), F(0)), (F(0), F(1))),
        )
        effective_resistance = inverse[0][0]
        self.assertEqual(effective_resistance, F(2))

        for magnitude, expected_sign in ((F(1, 3), 1), (F(1, 2), 0), (F(2, 3), -1)):
            resistance_load = magnitude * effective_resistance
            cofactor = 1 - resistance_load
            self.assertEqual((cofactor > 0) - (cofactor < 0), expected_sign)

    def test_multi_negative_edges_count_negative_and_extra_kernel_directions(self) -> None:
        # Two edge-disjoint positive paths 0--1--2 and 0--3--4 have zero
        # transfer resistance.  Each endpoint pair has resistance two.
        positive_branch = ((F(2), F(-1)), (F(-1), F(1)))
        inverse_branch = ((F(1), F(1)), (F(1), F(2)))
        self.assertEqual(
            tuple(
                tuple(
                    sum(positive_branch[i][k] * inverse_branch[k][j] for k in range(2))
                    for j in range(2)
                )
                for i in range(2)
            ),
            ((F(1), F(0)), (F(0), F(1))),
        )
        effective_resistance = inverse_branch[1][1]
        self.assertEqual(effective_resistance, F(2))

        # Negative chords (0,2) and (0,4) have magnitudes 1 and 1/2.
        resistance_spectrum = (F(1) * effective_resistance, F(1, 2) * effective_resistance)
        self.assertEqual(resistance_spectrum, (F(2), F(1)))
        self.assertEqual(sum(rho > 1 for rho in resistance_spectrum), 1)
        self.assertEqual(1 + sum(rho == 1 for rho in resistance_spectrum), 2)

        supercritical_branch = ((F(2), F(-1)), (F(-1), F(0)))
        critical_branch = ((F(2), F(-1)), (F(-1), F(1, 2)))
        self.assertEqual(
            supercritical_branch[0][0] * supercritical_branch[1][1]
            - supercritical_branch[0][1] ** 2,
            F(-1),
        )
        self.assertEqual(
            critical_branch[0][0] * critical_branch[1][1]
            - critical_branch[0][1] ** 2,
            F(0),
        )
        self.assertEqual(
            tuple(
                sum(critical_branch[i][j] * value for j, value in enumerate((F(1), F(2))))
                for i in range(2)
            ),
            (F(0), F(0)),
        )

        def inertia_2_fraction(block: tuple[tuple[F, F], tuple[F, F]]) -> tuple[int, int, int]:
            determinant = block[0][0] * block[1][1] - block[0][1] ** 2
            trace = block[0][0] + block[1][1]
            if determinant < 0:
                return (1, 1, 0)
            if determinant == 0 and trace > 0:
                return (1, 0, 1)
            raise AssertionError("fixture left its declared exact inertia cases")

        branch_inertias = tuple(
            inertia_2_fraction(block) for block in (supercritical_branch, critical_branch)
        )
        reduced_inertia = tuple(sum(inertia[index] for inertia in branch_inertias) for index in range(3))
        # On the quotient: two positive, one negative, one zero.  Restoring
        # constants gives exactly the predicted two-dimensional full kernel.
        self.assertEqual(reduced_inertia, (2, 1, 1))
        self.assertEqual(reduced_inertia[1], sum(rho > 1 for rho in resistance_spectrum))
        self.assertEqual(reduced_inertia[2] + 1, 1 + sum(rho == 1 for rho in resistance_spectrum))

    def test_actual_source_weight_formulas_and_diagonal_cancellation(self) -> None:
        count = 3
        b_values = (F(2), F(-1), F(3))
        x = (F(1), F(-2), F(3), F(-4))
        kappa = vector(x[0], *(ROOT2 * value for value in x[1:]))
        _, even_a, _ = parity_blocks(count, (F(2), F(-3), F(5), F(7)), b_values)
        _, even_b, _ = parity_blocks(count, (F(11), F(13), F(-17), F(19)), b_values)

        for n in range(1, count + 1):
            self.assertEqual(even_a[0][n], ROOT2 * (b_values[n - 1] / n))
            weight = -(even_a[0][n] * kappa[0] * kappa[n])
            expected = Q2(-2 * b_values[n - 1] * x[0] * x[n] / n)
            self.assertEqual(weight, expected)

        for n in range(1, count + 1):
            for m in range(1, n):
                divided = F(n * b_values[n - 1] - m * b_values[m - 1], n * n - m * m)
                self.assertEqual(even_a[n][m], Q2(2 * divided))
                weight = -(even_a[n][m] * kappa[n] * kappa[m])
                self.assertEqual(weight, Q2(-4 * divided * x[n] * x[m]))

        def force(matrix: Matrix) -> Matrix:
            action = matvec(matrix, kappa)
            h = tuple(action[i] / kappa[i] for i in range(count + 1))
            return subtract(matrix, diagonal(*h))

        self.assertEqual(force(even_a), force(even_b))

    def test_source_parity_factorization_and_raw_polynomial_are_exact(self) -> None:
        fixture = forced_counterfamily(F(1))
        t_plus = fixture["t_plus"]
        t_minus = fixture["t_minus"]
        dmap = fixture["dmap"]
        eta = fixture["eta"]
        x_matrix = fixture["x_matrix"]
        k_matrix = fixture["k_matrix"]

        beta = vector(ROOT2, ZERO)
        unforced_commutator = subtract(
            matmul(dmap, fixture["even"]),
            matmul(fixture["odd"], dmap),
        )
        commutator = subtract(matmul(dmap, t_plus), matmul(t_minus, dmap))
        self.assertEqual(commutator, unforced_commutator)
        self.assertEqual(commutator, outer(beta, eta))
        self.assertEqual(matmul(t_minus, x_matrix), k_matrix)
        self.assertEqual(fixture["c"], ONE)
        self.assertEqual(trace_2(x_matrix), ZERO)
        self.assertEqual(determinant_2(x_matrix), ONE)
        self.assertEqual(determinant_2(k_matrix), determinant_2(t_minus))
        pencil_linear = (
            k_matrix[0][0] * t_minus[1][1]
            + k_matrix[1][1] * t_minus[0][0]
            - k_matrix[0][1] * t_minus[1][0]
            - k_matrix[1][0] * t_minus[0][1]
        )
        self.assertEqual(pencil_linear, ZERO)

        x0, x1, x2 = fixture["raw_coefficients"]
        leading = x0 + 2 * x1 + 2 * x2
        linear = -5 * x0 - 8 * x1 - 2 * x2
        constant = 4 * x0
        self.assertEqual((leading, linear, constant), (F(1), F(0), F(1)))

    def test_odd_dimension_general_c_has_the_required_pencil_determinant_sign(self) -> None:
        _, even, odd = parity_blocks(1, (F(0), F(0)), (F(1),))
        x0, x1 = F(3), F(2)
        kappa = vector(x0, ROOT2 * x1)
        action = matvec(even, kappa)
        h = tuple(action[index] / kappa[index] for index in range(2))
        t_plus = subtract(even, diagonal(*h))
        t_minus = subtract(odd, diagonal(h[1]))
        dmap = (vector(ZERO, ONE),)
        eta = vector(ONE, ROOT2)
        c = dot(eta, kappa)
        u = tuple(entry / c for entry in matvec(dmap, kappa))
        d = matvec(dmap, eta)
        x_matrix = subtract(matmul(dmap, transpose(dmap)), outer(u, d))
        k_matrix = matmul(dmap, matmul(t_plus, transpose(dmap)))

        self.assertEqual(c, Q2(F(7)))
        self.assertEqual(x_matrix, (vector(F(3, 7)),))
        self.assertEqual(t_minus, (vector(F(-7, 2)),))
        self.assertEqual(k_matrix, (vector(F(-3, 2)),))
        self.assertEqual(matmul(t_minus, x_matrix), k_matrix)

        # N=1: det(K-yT)=-(det(T)/c) p(y), p(y)=7y-3.
        signed_factor = -t_minus[0][0] / c
        self.assertEqual(k_matrix[0][0], signed_factor * Q2(F(-3)))
        self.assertEqual(-t_minus[0][0], signed_factor * Q2(F(7)))

    def test_shifted_definite_pencil_gate_is_exact_and_weaker_than_full_sign(self) -> None:
        delta_squared = F(1)

        # K is indefinite, but K+5G is positive and both roots are admissible.
        sigma = F(5)
        k_diagonal = (F(-4), F(9))
        g_diagonal = (F(1), F(1))
        c_diagonal = tuple(k + sigma * g for k, g in zip(k_diagonal, g_diagonal))
        self.assertTrue(all(value > 0 for value in c_diagonal))
        r_values = tuple(g / c for g, c in zip(g_diagonal, c_diagonal))
        roots = tuple(1 / r - sigma for r in r_values)
        gate = tuple(
            (1 - sigma * r) * (1 + (delta_squared - sigma) * r)
            for r in r_values
        )
        self.assertEqual(roots, k_diagonal)
        self.assertTrue(all(value >= 0 for value in gate))

        # Moving one root into (-delta^2,0) flips exactly one gate sign.
        sigma = F(1)
        unsafe_k = (F(-1, 4), F(9))
        unsafe_c = tuple(k + sigma for k in unsafe_k)
        unsafe_r = tuple(1 / c for c in unsafe_c)
        unsafe_roots = tuple(1 / r - sigma for r in unsafe_r)
        unsafe_gate = tuple(
            (1 - sigma * r) * (1 + (delta_squared - sigma) * r)
            for r in unsafe_r
        )
        self.assertEqual(unsafe_roots, unsafe_k)
        self.assertLess(unsafe_gate[0], 0)
        self.assertGreater(unsafe_gate[1], 0)

        # The sigma=0 specialization permits an indefinite odd metric.
        k_positive = (F(1), F(1))
        g_indefinite = (F(-1, 4), F(2))
        self.assertTrue(all(k + delta_squared * g >= 0 for k, g in zip(k_positive, g_indefinite)))
        self.assertEqual(tuple(k / g for k, g in zip(k_positive, g_indefinite)), (F(-4), F(1, 2)))

    def test_noncommuting_shifted_pencil_has_the_same_exact_gate_sign(self) -> None:
        # C=K+T is positive, but K and T do not commute.  Choosing C with a
        # rational square root keeps the conjugation exact over Q.
        c_matrix = diagonal(F(1), F(4))
        t_metric = (vector(F(0), F(2)), vector(F(2), F(0)))
        k_matrix = subtract(c_matrix, t_metric)
        half_inverse = diagonal(F(1), F(1, 2))
        r_matrix = matmul(half_inverse, matmul(t_metric, half_inverse))
        self.assertEqual(r_matrix, (vector(F(0), F(1)), vector(F(1), F(0))))
        self.assertNotEqual(matmul(k_matrix, t_metric), matmul(t_metric, k_matrix))

        # sigma=delta^2=1.  The R-eigenvalues +/-1 give roots 0 and -2.
        identity = diagonal(F(1), F(1))
        gate = subtract(identity, r_matrix)
        self.assertEqual(gate, outer(vector(F(1), F(-1)), vector(F(1), F(-1))))
        self.assertEqual(determinant_2(gate), ZERO)
        self.assertEqual(trace_2(gate), Q2(F(2)))

        pencil_linear = (
            k_matrix[0][0] * t_metric[1][1]
            + k_matrix[1][1] * t_metric[0][0]
            - k_matrix[0][1] * t_metric[1][0]
            - k_matrix[1][0] * t_metric[0][1]
        )
        self.assertEqual(determinant_2(k_matrix), ZERO)
        self.assertEqual(pencil_linear, Q2(F(8)))
        self.assertEqual(determinant_2(t_metric), Q2(F(-4)))
        for root in (F(0), F(-2)):
            pencil = tuple(
                tuple(k_matrix[i][j] - root * t_metric[i][j] for j in range(2))
                for i in range(2)
            )
            self.assertEqual(determinant_2(pencil), ZERO)

    def test_n1_strict_graph_gate_does_not_imply_finite_strip_gate(self) -> None:
        q = F(3)
        delta_squared = F(1)
        for tau, expected_gate_sign in ((F(1, 4), -1), (F(2), 1)):
            _, even, odd = parity_blocks(1, (F(0), F(0)), (q,))
            x0 = F(1)
            x1 = -(1 + tau) / (2 * tau)
            kappa = vector(x0, ROOT2 * x1)
            action = matvec(even, kappa)
            h = tuple(action[index] / kappa[index] for index in range(2))
            t_plus = subtract(even, diagonal(*h))
            t_minus = subtract(odd, diagonal(h[1]))
            k_scalar = t_plus[1][1]

            weight = -(even[0][1] * kappa[0] * kappa[1])
            self.assertEqual(weight, Q2(q * (1 + tau) / tau))
            self.assertGreater(weight.a, 0)
            self.assertEqual(weight.b, F(0))

            leading = x0 + 2 * x1
            constant = -x0
            self.assertEqual((leading, constant), (-F(1, 1) / tau, F(-1)))
            self.assertEqual(leading * (-tau) + constant, F(0))
            self.assertEqual(k_scalar, Q2(2 * q * tau / (1 + tau)))
            self.assertEqual(t_minus[0][0], Q2(-2 * q / (1 + tau)))
            strip_gate = k_scalar + delta_squared * t_minus[0][0]
            self.assertEqual(strip_gate, Q2(2 * q * (tau - delta_squared) / (1 + tau)))
            self.assertEqual((strip_gate.a > 0) - (strip_gate.a < 0), expected_gate_sign)

    def test_identical_parity_inertia_can_lie_inside_or_outside_strip(self) -> None:
        delta_squared = F(1)
        results = []
        for t in (F(1), F(4)):
            fixture = forced_counterfamily(t)
            x0, x1, x2 = fixture["raw_coefficients"]
            w01 = -2 * x0 * x1
            w12 = F(4, 3) * x1 * x2
            self.assertGreater(w01, 0)
            self.assertLess(w12, 0)

            # A signed tree has quotient inertia equal to the signs of its edges.
            self.assertLess(w01 * w12, 0)
            self.assertLess(determinant_2(fixture["k_matrix"]).a, 0)
            self.assertEqual(determinant_2(fixture["k_matrix"]).b, 0)
            self.assertLess(determinant_2(fixture["t_minus"]).a, 0)
            self.assertEqual(determinant_2(fixture["t_minus"]).b, 0)

            x_matrix = fixture["x_matrix"]
            self.assertEqual(trace_2(x_matrix), ZERO)
            self.assertEqual(determinant_2(x_matrix), Q2(t * t))

            v_squared = t / 2
            physical_height_squared = v_squared / (4 * delta_squared)
            results.append((v_squared, physical_height_squared))

        self.assertLess(results[0][0], delta_squared)
        self.assertGreater(results[1][0], delta_squared)
        self.assertLess(results[0][1], F(1, 4))
        self.assertGreater(results[1][1], F(1, 4))


if __name__ == "__main__":
    unittest.main()
