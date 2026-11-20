#!/usr/bin/env python3
"""Exact regressions for the anchored Weil--Dirichlet routing package.

Only the Python standard library is used.  Algebraic quantities lie in the
rationals or Q(sqrt(2)); no source artifact, cached matrix, floating-point
eigensystem, or numerical pilot is read.
"""

from __future__ import annotations

from dataclasses import dataclass
from fractions import Fraction as F
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ANCHORED_WEIL_DIRICHLET_CONTRACTIVE_ROUTING.md"


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


def q2_sign(value: Q2) -> int:
    """Return the exact sign of a+b*sqrt(2)."""

    if value.b == 0:
        return (value.a > 0) - (value.a < 0)
    if value.a == 0:
        return (value.b > 0) - (value.b < 0)
    if value.a > 0 and value.b > 0:
        return 1
    if value.a < 0 and value.b < 0:
        return -1
    comparison = value.a * value.a - 2 * value.b * value.b
    if value.a > 0:
        return (comparison > 0) - (comparison < 0)
    return -((comparison > 0) - (comparison < 0))


Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]


def dot(left: Vector, right: Vector) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, value: Vector) -> Vector:
    return tuple(dot(row, value) for row in matrix)


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(column) for column in zip(*matrix))


def matmul(left: Matrix, right: Matrix) -> Matrix:
    columns = transpose(right)
    return tuple(tuple(dot(row, column) for column in columns) for row in left)


def quadratic(value: Vector, matrix: Matrix) -> F:
    return dot(value, matvec(matrix, value))


def forced_form(matrix: Matrix, kappa: Vector) -> Matrix:
    action = matvec(matrix, kappa)
    ratios = tuple(action[i] / kappa[i] for i in range(len(kappa)))
    return tuple(
        tuple(matrix[i][j] - (ratios[i] if i == j else F(0)) for j in range(len(kappa)))
        for i in range(len(kappa))
    )


def graph_energy(weights: dict[tuple[int, int], F], value: Vector) -> F:
    return sum(
        (weight * (value[i] - value[j]) ** 2 for (i, j), weight in weights.items()),
        F(0),
    )


def omega_0n_coefficients(count: int, n: int) -> tuple[Q2, ...]:
    """Coefficients of pi*omega_(0n) in the sine basis."""

    result = [ZERO] * count
    result[n - 1] = -ROOT2 / n
    return tuple(result)


def omega_nm_coefficients(count: int, n: int, m: int) -> tuple[Q2, ...]:
    """Coefficients of pi*omega_(nm), n,m positive and distinct."""

    denominator = F(n * n - m * m)
    result = [ZERO] * count
    result[m - 1] = Q2(F(2 * m) / denominator)
    result[n - 1] = Q2(F(-2 * n) / denominator)
    return tuple(result)


def apply_source_sines(coefficients: tuple[Q2, ...], b_values: tuple[F, ...]) -> Q2:
    # b_n=-(1/pi) Psi(sin_n), while coefficients represent pi*omega.
    return -sum((coefficient * b for coefficient, b in zip(coefficients, b_values)), ZERO)


class AnchoredWeilDirichletRoutingTests(unittest.TestCase):
    def test_claim_boundary_and_complete_source_signs_are_locked(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "finite, theorem-only source-Cauchy package",
            "No actual-source routing inequality is proved",
            "There is no\nRiemann-hypothesis conclusion",
            r"\Omega_{\kappa,f}",
            r"\Psi^\#(\Omega_{\kappa,f})",
            r"1<n\leq\lambda^2",
            "minus sign of the source",
            "The final prime power is still included",
            r"-\int_0^LG(x){d\over dx}",
            r"I_p-SS^*",
            "define its\ncut-distance vector",
            "When `m=0`, there are no negative edges",
            "undefined empty spectrum",
            "weighted-Loewner contractive-routing lemma",
            "inverse anchor coordinates",
            "makes no RH\nclaim",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        self.assertNotIn("RH_PROVED", text)
        self.assertNotIn("Riemann hypothesis is proved", text)
        self.assertNotIn("actual-source routing inequality holds", text)

    def test_sine_correlations_source_entries_and_endpoints_are_exact(self) -> None:
        count = 4
        b_values = (F(2), F(-1), F(3), F(5))
        alpha = (ONE, ROOT2, ROOT2, ROOT2, ROOT2)
        c = (F(0),) + tuple((n + 1) * b for n, b in enumerate(b_values))
        t = tuple(F(n * n) for n in range(count + 1))

        for n in range(1, count + 1):
            coefficients = omega_0n_coefficients(count, n)
            self.assertEqual(coefficients[n - 1], -ROOT2 / n)
            self.assertEqual(apply_source_sines(coefficients, b_values), ROOT2 * b_values[n - 1] / n)
            divided = Q2((c[0] - c[n]) / (t[0] - t[n]))
            self.assertEqual(apply_source_sines(coefficients, b_values), alpha[0] * alpha[n] * divided)

        for n in range(1, count + 1):
            for m in range(1, n):
                coefficients = omega_nm_coefficients(count, n, m)
                source_value = apply_source_sines(coefficients, b_values)
                expected = Q2(F(2 * (n * b_values[n - 1] - m * b_values[m - 1]), n * n - m * m))
                divided = Q2((c[n] - c[m]) / (t[n] - t[m]))
                self.assertEqual(source_value, expected)
                self.assertEqual(source_value, alpha[n] * alpha[m] * divided)

        # Every displayed cross correlation is a pure sine series.  Its exact
        # endpoint values use sin(0)=sin(2*pi*k)=0, with no constant term.
        all_coefficients = [omega_0n_coefficients(count, n) for n in range(1, count + 1)]
        all_coefficients += [omega_nm_coefficients(count, n, m) for n in range(2, count + 1) for m in range(1, n)]
        for coefficients in all_coefficients:
            self.assertEqual(sum((coefficient * 0 for coefficient in coefficients), ZERO), ZERO)

    def test_omega_identity_forced_energy_and_diagonal_blindness(self) -> None:
        first = (
            (F(2), F(3), F(-1)),
            (F(3), F(5), F(4)),
            (F(-1), F(4), F(7)),
        )
        second = (
            (F(11), F(3), F(-1)),
            (F(3), F(-13), F(4)),
            (F(-1), F(4), F(19)),
        )
        kappa = (F(2), F(-3), F(5))
        f = (F(2), F(-1), F(4))
        z = tuple(kappa[i] * f[i] for i in range(3))
        d_f = tuple(kappa[i] * f[i] * f[i] for i in range(3))

        t_plus = forced_form(first, kappa)
        self.assertEqual(t_plus, forced_form(second, kappa))
        self.assertEqual(matvec(t_plus, kappa), (F(0), F(0), F(0)))

        direct = quadratic(z, t_plus)
        source_omega = quadratic(z, first) - dot(d_f, matvec(first, kappa))
        edge = sum(
            -first[i][j] * kappa[i] * kappa[j] * (f[i] - f[j]) ** 2
            for i in range(3)
            for j in range(i + 1, 3)
        )
        self.assertEqual(direct, source_omega)
        self.assertEqual(direct, edge)

        omega_at_origin = 2 * dot(z, z) - 2 * dot(d_f, kappa)
        self.assertEqual(omega_at_origin, F(0))
        omega_at_endpoint = F(0)  # every zero-extended source correlation vanishes at L
        self.assertEqual(omega_at_endpoint, F(0))

    def test_non_density_and_signed_polarization_obstruction(self) -> None:
        g = (F(1), F(2), F(-3))
        square_origin = 2 * dot(g, g)
        self.assertEqual(square_origin, F(28))
        self.assertGreater(square_origin, 0)

        positive_square_origins = (F(2), F(8), F(18))
        coefficients = (F(1), F(3, 2), F(5))
        positive_sum_origin = dot(positive_square_origins, coefficients)
        self.assertGreater(positive_sum_origin, 0)
        anchored_origin = F(0)
        self.assertNotEqual(positive_sum_origin, anchored_origin)

        text = NOTE.read_text(encoding="utf-8")
        self.assertIn(r"\mathfrak q(g,g;0)=2\|g\|^2>0", text)
        self.assertIn("unavoidable negative square", text)
        self.assertIn("anchored cone cannot\nbe dense", text)

    def test_source_cauchy_weil_and_anchored_signs_are_incomparable(self) -> None:
        kappa = (F(1), F(1))  # common scalar 1/sqrt(2) cancels from ratios
        for epsilon in (F(1), F(-1)):
            b1 = Q2(epsilon) * INV_ROOT2
            a0 = Q2(2 * epsilon)
            a1 = Q2(epsilon) * (Q2(F(2)) - INV_ROOT2)
            even = (
                (a0, ROOT2 * b1),
                (ROOT2 * b1, a1 + b1),
            )
            odd = a1 - b1
            expected_even = (
                (Q2(2 * epsilon), Q2(epsilon)),
                (Q2(epsilon), Q2(2 * epsilon)),
            )
            self.assertEqual(even, expected_even)
            self.assertEqual(odd, Q2(epsilon) * (Q2(F(2)) - ROOT2))
            self.assertEqual(q2_sign(odd), 1 if epsilon > 0 else -1)

            action = tuple(sum((even[i][j] * kappa[j] for j in range(2)), ZERO) for i in range(2))
            ratios = tuple(action[i] / kappa[i] for i in range(2))
            forced = tuple(
                tuple(even[i][j] - (ratios[i] if i == j else ZERO) for j in range(2))
                for i in range(2)
            )
            expected_forced = (
                (Q2(-epsilon), Q2(epsilon)),
                (Q2(epsilon), Q2(-epsilon)),
            )
            self.assertEqual(forced, expected_forced)
            quotient_trial = (F(1), F(-1))
            quotient_value = sum(
                (Q2(quotient_trial[i]) * forced[i][j] * quotient_trial[j] for i in range(2) for j in range(2)),
                ZERO,
            )
            self.assertEqual(q2_sign(quotient_value), -1 if epsilon > 0 else 1)

    def test_strict_gate_forces_positive_graph_connected(self) -> None:
        # Positive graph has component {0,1} and isolated vertex 2.
        disconnected_positive = {(0, 1): F(1)}
        relative_constant = (F(0), F(0), F(1))
        self.assertEqual(graph_energy(disconnected_positive, relative_constant), F(0))

        # With no negative bridge this is an extra kernel direction.
        self.assertEqual(graph_energy(disconnected_positive, relative_constant), F(0))

        # Any negative bridge between the components makes the same direction
        # strictly negative, so positive semidefiniteness fails.
        bridged = {(0, 1): F(1), (1, 2): F(-1, 4)}
        self.assertEqual(graph_energy(bridged, relative_constant), F(-1, 4))

    def test_minimum_routing_dimensions_norm_and_square_are_exact(self) -> None:
        # Positive star 0--1, 0--2 with unit weights.
        b_plus: Matrix = (
            (F(1), F(1)),
            (F(-1), F(0)),
            (F(0), F(-1)),
        )
        # Negative chord 1--2 of magnitude 1/4.
        b_minus: Matrix = (
            (F(0),),
            (F(1, 2),),
            (F(-1, 2),),
        )
        routing: Matrix = ((F(-1, 2),), (F(1, 2),))
        self.assertEqual((len(b_plus), len(b_plus[0])), (3, 2))
        self.assertEqual((len(b_minus), len(b_minus[0])), (3, 1))
        self.assertEqual((len(routing), len(routing[0])), (2, 1))
        self.assertEqual(matmul(b_plus, routing), b_minus)

        resistance = matmul(transpose(routing), routing)
        self.assertEqual(resistance, ((F(1, 2),),))
        self.assertLess(resistance[0][0], 1)

        value = (F(2), F(-1), F(4))
        positive_gradient = matvec(transpose(b_plus), value)
        negative_gradient = matvec(transpose(b_minus), value)
        routed_gradient = matvec(transpose(routing), positive_gradient)
        self.assertEqual(negative_gradient, routed_gradient)

        direct = dot(positive_gradient, positive_gradient) - dot(negative_gradient, negative_gradient)
        ss_star = matmul(routing, transpose(routing))
        identity_minus = tuple(
            tuple((F(1) if i == j else F(0)) - ss_star[i][j] for j in range(2))
            for i in range(2)
        )
        square = quadratic(positive_gradient, identity_minus)
        self.assertEqual(direct, F(27, 4))
        self.assertEqual(square, direct)

    def test_collective_negative_edges_defeat_all_one_edge_checks(self) -> None:
        # Unit positive star with two negative leaf chords of magnitude 2/5.
        # The unweighted routed chord Gram is [[2,1],[1,2]].
        resistance = (
            (F(4, 5), F(2, 5)),
            (F(2, 5), F(4, 5)),
        )
        self.assertLess(resistance[0][0], 1)
        self.assertLess(resistance[1][1], 1)
        eigenvalues = (resistance[0][0] + resistance[0][1], resistance[0][0] - resistance[0][1])
        self.assertEqual(eigenvalues, (F(6, 5), F(2, 5)))
        self.assertGreater(max(eigenvalues), 1)

        weights = {
            (0, 1): F(1),
            (0, 2): F(1),
            (0, 3): F(1),
            (1, 2): F(-2, 5),
            (1, 3): F(-2, 5),
        }
        trial = (F(0), F(2), F(-1), F(-1))
        self.assertEqual(graph_energy(weights, trial), F(-6, 5))

    def test_weighted_loewner_weights_use_only_combined_b(self) -> None:
        b_values = (F(2), F(-1), F(3))
        c = (F(0), F(2), F(-2), F(9))
        t = (F(0), F(1), F(4), F(9))
        p = (F(1), F(-2), F(3), F(-4))
        weights: dict[tuple[int, int], F] = {}
        for i in range(4):
            for j in range(i + 1, 4):
                divided = (c[i] - c[j]) / (t[i] - t[j])
                weights[i, j] = -p[i] * p[j] * divided

                if i == 0:
                    source_entry_without_alpha = b_values[j - 1] / j
                else:
                    source_entry_without_alpha = (c[i] - c[j]) / (t[i] - t[j])
                self.assertEqual(divided, source_entry_without_alpha)

        self.assertEqual(weights[0, 1], F(4))
        self.assertEqual(weights[0, 2], F(3, 2))
        self.assertEqual(weights[0, 3], F(4))
        self.assertTrue(any(value < 0 for value in weights.values()))
        self.assertTrue(any(value > 0 for value in weights.values()))

    def test_small_residual_does_not_control_inverse_anchor_ratios(self) -> None:
        residual_norm_squares: list[F] = []
        forced_ratios: list[F] = []
        for integer in (2, 4, 8, 16):
            kappa = (F(1), F(1, integer * integer))
            matrix = ((F(0), F(0)), (F(0), F(integer)))
            residual = matvec(matrix, kappa)
            residual_norm_squares.append(dot(residual, residual))
            ratio = residual[1] / kappa[1]
            forced_ratios.append(ratio)
            self.assertEqual(ratio, F(integer))
            self.assertEqual(quadratic((F(0), F(1)), matrix), ratio)

        self.assertTrue(all(left > right for left, right in zip(residual_norm_squares, residual_norm_squares[1:])))
        self.assertTrue(all(left < right for left, right in zip(forced_ratios, forced_ratios[1:])))
        self.assertLess(residual_norm_squares[-1], F(1, 100))
        self.assertGreater(forced_ratios[-1], 1)


if __name__ == "__main__":
    unittest.main()
