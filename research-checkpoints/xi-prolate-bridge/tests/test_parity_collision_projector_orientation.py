#!/usr/bin/env python3
"""Exact standard-library regressions for parity-collision orientation.

The fixtures are assembled from raw source-Cauchy parameters.  Arithmetic is
in Q(sqrt(2)); no float, NumPy object, cached eigensystem, or source matrix is
read.
"""

from __future__ import annotations

from fractions import Fraction as F
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "PARITY_COLLISION_PROJECTOR_ORIENTATION.md"


class Q2:
    """The exact real quadratic field Q(sqrt(2))."""

    __slots__ = ("a", "b")

    def __init__(self, a=0, b=0):
        self.a = F(a)
        self.b = F(b)

    @staticmethod
    def coerce(value) -> "Q2":
        return value if isinstance(value, Q2) else Q2(value)

    def __add__(self, other):
        other = self.coerce(other)
        return Q2(self.a + other.a, self.b + other.b)

    __radd__ = __add__

    def __neg__(self):
        return Q2(-self.a, -self.b)

    def __sub__(self, other):
        return self + (-self.coerce(other))

    def __rsub__(self, other):
        return self.coerce(other) - self

    def __mul__(self, other):
        other = self.coerce(other)
        return Q2(
            self.a * other.a + 2 * self.b * other.b,
            self.a * other.b + self.b * other.a,
        )

    __rmul__ = __mul__

    def __pow__(self, exponent):
        if not isinstance(exponent, int) or exponent < 0:
            return NotImplemented
        result = Q2(1)
        base = self
        while exponent:
            if exponent & 1:
                result = result * base
            base = base * base
            exponent >>= 1
        return result

    def __truediv__(self, other):
        other = self.coerce(other)
        denominator = other.a * other.a - 2 * other.b * other.b
        if denominator == 0:
            raise ZeroDivisionError("division by zero in Q(sqrt(2))")
        return Q2(
            (self.a * other.a - 2 * self.b * other.b) / denominator,
            (self.b * other.a - self.a * other.b) / denominator,
        )

    def __rtruediv__(self, other):
        return self.coerce(other) / self

    def __eq__(self, other):
        try:
            other = self.coerce(other)
        except (TypeError, ValueError):
            return NotImplemented
        return self.a == other.a and self.b == other.b

    def __repr__(self):
        return f"Q2({self.a!r}, {self.b!r})"


ZERO = Q2(0)
ONE = Q2(1)
SQRT2 = Q2(0, 1)
INV_SQRT2 = Q2(0, F(1, 2))

Vector = tuple[Q2, ...]
Matrix = tuple[tuple[Q2, ...], ...]


def vector(*entries) -> Vector:
    return tuple(Q2.coerce(entry) for entry in entries)


def dot(left: Vector, right: Vector) -> Q2:
    return sum((x * y for x, y in zip(left, right)), ZERO)


def norm_squared(value: Vector) -> Q2:
    return dot(value, value)


def matvec(matrix: Matrix, value: Vector) -> Vector:
    return tuple(dot(row, value) for row in matrix)


def matmul(left: Matrix, right: Matrix) -> Matrix:
    columns = tuple(tuple(column) for column in zip(*right))
    return tuple(tuple(dot(row, column) for column in columns) for row in left)


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(column) for column in zip(*matrix))


def add(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x + y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x - y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def scale(scalar, matrix: Matrix) -> Matrix:
    scalar = Q2.coerce(scalar)
    return tuple(tuple(scalar * entry for entry in row) for row in matrix)


def outer(left: Vector, right: Vector) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def diagonal(*entries) -> Matrix:
    values = vector(*entries)
    return tuple(
        tuple(values[row] if row == column else ZERO for column in range(len(values)))
        for row in range(len(values))
    )


def identity(size: int) -> Matrix:
    return diagonal(*([ONE] * size))


def trace(matrix: Matrix) -> Q2:
    return sum((matrix[index][index] for index in range(len(matrix))), ZERO)


def source_cauchy_raw(
    count: int,
    shell_diagonal: tuple[F, ...],
    positive_b: tuple[F, ...],
) -> Matrix:
    """Assemble Q_nm=a_n delta_nm+(b_n-b_m)/(n-m)."""

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

    e0 = [ZERO] * size
    e0[center] = ONE
    even.append(tuple(e0))
    for shell in range(1, count + 1):
        plus = [ZERO] * size
        minus = [ZERO] * size
        plus[center - shell] = INV_SQRT2
        plus[center + shell] = INV_SQRT2
        minus[center - shell] = -INV_SQRT2
        minus[center + shell] = INV_SQRT2
        even.append(tuple(plus))
        odd.append(tuple(minus))
    return tuple(even), tuple(odd)


def compress(raw: Matrix, basis: tuple[Vector, ...]) -> Matrix:
    return tuple(
        tuple(dot(left, matvec(raw, right)) for right in basis)
        for left in basis
    )


def source_parity_blocks(
    count: int,
    shell_diagonal: tuple[F, ...],
    positive_b: tuple[F, ...],
) -> tuple[Matrix, Matrix, Matrix]:
    raw = source_cauchy_raw(count, shell_diagonal, positive_b)
    even_basis, odd_basis = parity_bases(count)
    return raw, compress(raw, even_basis), compress(raw, odd_basis)


def mode_derivative(count: int) -> Matrix:
    return tuple(
        tuple(
            Q2(row + 1) if column == row + 1 else ZERO
            for column in range(count + 1)
        )
        for row in range(count)
    )


def mode_derivative_pseudoinverse(count: int) -> Matrix:
    return tuple(
        tuple(
            Q2(F(1, column)) if row == column and column > 0 else ZERO
            for column in range(1, count + 1)
        )
        for row in range(count + 1)
    )


def parity_boundary(count: int) -> Vector:
    return vector(ONE, *([SQRT2] * count))


def parity_beta(positive_b: tuple[F, ...]) -> Vector:
    return tuple(SQRT2 * value for value in positive_b)


def visible_boundary_projection(projector: Matrix, eta: Vector) -> tuple[Vector, Q2]:
    """Fail closed when the canonical boundary ground does not exist."""

    u = matvec(projector, eta)
    t = norm_squared(u)
    if t == ZERO:
        raise ValueError("canonical boundary ground requires t>0")
    return u, t


class ParityCollisionProjectorOrientationTests(unittest.TestCase):
    def test_regular_source_fixture_and_rank_one_collapse(self):
        gap = F(7, 3)
        raw, even, odd = source_parity_blocks(
            2, (F(0), gap, 2 * gap), (F(0), F(0))
        )
        self.assertEqual(even, diagonal(0, gap, 2 * gap))
        self.assertEqual(odd, diagonal(gap, 2 * gap))

        # The raw assembly is diagonal and exactly inversion-reflected.
        modes = tuple(range(-2, 3))
        for row, mode in enumerate(modes):
            for column, other in enumerate(modes):
                self.assertEqual(raw[row][column], ZERO if mode != other else raw[row][row])
                self.assertEqual(raw[row][column], raw[4 - row][4 - column])

        eta = parity_boundary(2)
        beta = parity_beta((F(0), F(0)))
        derivative = mode_derivative(2)
        self.assertEqual(
            subtract(matmul(derivative, even), matmul(odd, derivative)),
            outer(beta, eta),
        )

        ground_projector = diagonal(1, 0, 0)
        ground = vector(1, 0, 0)
        kappa = vector(F(3, 5), F(4, 5), 0)
        transverse = vector(F(-4, 5), F(3, 5), 0)
        low_projector = outer(transverse, transverse)
        self.assertEqual(norm_squared(kappa), ONE)
        self.assertEqual(norm_squared(transverse), ONE)
        self.assertEqual(dot(kappa, transverse), ZERO)

        projected = matvec(ground_projector, kappa)
        y_squared = norm_squared(projected)
        alpha_squared = dot(kappa, ground) * dot(kappa, ground)
        mixed_trace = trace(matmul(low_projector, ground_projector))
        self.assertEqual(alpha_squared, Q2(F(9, 25)))
        self.assertEqual(y_squared, alpha_squared)
        self.assertEqual(mixed_trace, Q2(F(16, 25)))
        self.assertEqual(mixed_trace, ONE - y_squared)

        # Boundary determinant identity at mu=0: det(B)=<eta,adj(A)e0>.
        odd_determinant = Q2(2 * gap * gap)
        adjugate_e0 = vector(2 * gap * gap, 0, 0)
        self.assertEqual(dot(eta, adjugate_e0), odd_determinant)

    def test_regular_exact_angle_and_residual_implications(self):
        gap = F(5, 2)
        kappa = vector(F(3, 5), F(4, 5), 0)
        y_squared = Q2(F(9, 25))
        mixed_trace = Q2(F(16, 25))
        tangent_squared = (ONE - y_squared) / y_squared
        self.assertEqual(tangent_squared, Q2(F(16, 9)))
        self.assertEqual(ONE / y_squared, ONE + tangent_squared)
        self.assertEqual(mixed_trace / y_squared, tangent_squared)
        self.assertEqual(mixed_trace, tangent_squared / (ONE + tangent_squared))

        q = Q2(gap) * kappa[1] * kappa[1]
        residual = vector(-q * kappa[0], (Q2(gap) - q) * kappa[1], 0)
        residual_squared = norm_squared(residual)
        outside_squared = kappa[1] * kappa[1]
        self.assertEqual(q, Q2(F(16, 25) * gap))
        self.assertTrue((Q2(gap) - q).a > 0 and (Q2(gap) - q).b == 0)
        self.assertTrue(
            outside_squared.a
            <= (residual_squared / (Q2(gap) - q) ** 2).a
        )

    def test_collision_moore_penrose_decomposition_zero_forcing(self):
        gap = F(11, 4)
        _, even, odd = source_parity_blocks(
            2, (F(0), F(0), gap), (F(0), F(0))
        )
        self.assertEqual(even, diagonal(0, 0, gap))
        self.assertEqual(odd, diagonal(0, gap))

        eta = parity_boundary(2)
        beta = vector(0, 0)
        ground_projector = diagonal(1, 1, 0)
        collision_projector = diagonal(1, 0)
        reduced_inverse = diagonal(0, F(1, gap))
        derivative = mode_derivative(2)
        derivative_dagger = mode_derivative_pseudoinverse(2)
        u = matvec(ground_projector, eta)
        t = norm_squared(u)
        d = matvec(derivative, eta)
        fd = matvec(collision_projector, d)
        sbeta = matvec(reduced_inverse, beta)

        self.assertEqual(t, Q2(3))
        self.assertEqual(matvec(collision_projector, beta), vector(0, 0))
        self.assertEqual(d, vector(SQRT2, 2 * SQRT2))
        self.assertEqual(fd, vector(SQRT2, 0))
        self.assertEqual(
            matvec(derivative, u),
            tuple(fd[i] - t * sbeta[i] for i in range(2)),
        )

        # D* Ran(F)=span(e_1^+) is contained in E.
        collision_basis = vector(1, 0)
        dstar_collision = matvec(transpose(derivative), collision_basis)
        self.assertEqual(dstar_collision, vector(0, 1, 0))
        self.assertEqual(
            matvec(subtract(identity(3), ground_projector), dstar_collision),
            vector(0, 0, 0),
        )

        lift_fd = matvec(derivative_dagger, fd)
        lift_sbeta = matvec(derivative_dagger, sbeta)
        g = tuple(
            lift_fd[i] - dot(eta, lift_fd) * vector(1, 0, 0)[i]
            for i in range(3)
        )
        h = tuple(
            (ONE + dot(eta, lift_sbeta)) * vector(1, 0, 0)[i]
            - lift_sbeta[i]
            for i in range(3)
        )
        reconstructed = tuple(g[i] + t * h[i] for i in range(3))
        self.assertEqual(g, vector(-2, SQRT2, 0))
        self.assertEqual(h, vector(1, 0, 0))
        self.assertEqual(reconstructed, u)
        self.assertEqual(norm_squared(reconstructed), t)
        self.assertEqual(dot(vector(1, 0, 0), u) ** 2 / t, Q2(F(1, 3)))

        # The scalar fixed-point equation has two roots; only P selects t=3.
        for candidate in (Q2(2), Q2(3)):
            value = tuple(g[i] + candidate * h[i] for i in range(3))
            self.assertEqual(norm_squared(value), candidate)

    def test_zero_visibility_collision_is_rejected_exactly(self):
        # Exact N=1 source-Cauchy adversary: a0=a1=b1=c>0.  Then
        # A=c[[1,sqrt(2)],[sqrt(2),2]], B=0, eta is orthogonal to E,
        # while F beta=beta is nonzero.  The t>0 theorem must not run.
        c = F(7, 5)
        raw, even, odd = source_parity_blocks(1, (c, c), (c,))
        self.assertEqual(
            raw,
            tuple(tuple(Q2(c) for _ in range(3)) for _ in range(3)),
        )
        self.assertEqual(
            even,
            (
                vector(c, c * SQRT2),
                vector(c * SQRT2, 2 * c),
            ),
        )
        self.assertEqual(odd, diagonal(0))

        eta = parity_boundary(1)
        beta = parity_beta((c,))
        kernel = vector(-SQRT2, 1)
        ground_projector = scale(F(1, 3), outer(kernel, kernel))
        collision_projector = identity(1)
        self.assertEqual(matvec(even, kernel), vector(0, 0))
        self.assertEqual(matvec(ground_projector, eta), vector(0, 0))
        self.assertEqual(norm_squared(matvec(ground_projector, eta)), ZERO)
        self.assertEqual(matvec(collision_projector, beta), beta)
        self.assertNotEqual(beta, vector(0))
        with self.assertRaisesRegex(ValueError, "requires t>0"):
            visible_boundary_projection(ground_projector, eta)

    def test_nonzero_beta_source_fixture_checks_sign_and_feedback(self):
        # Raw source parameters: a=(2,1/3,-1/6), b=(1,1).
        # The even bottom is the simple zero line (0,1,-2), while B has a
        # zero collision line (1,-1) orthogonal to beta.
        _, even, odd = source_parity_blocks(
            2,
            (F(2), F(1, 3), F(-1, 6)),
            (F(1), F(1)),
        )
        self.assertEqual(
            even,
            (
                vector(2, SQRT2, SQRT2 / 2),
                vector(SQRT2, F(4, 3), F(2, 3)),
                vector(SQRT2 / 2, F(2, 3), F(1, 3)),
            ),
        )
        self.assertEqual(
            odd,
            (
                vector(F(-2, 3), F(-2, 3)),
                vector(F(-2, 3), F(-2, 3)),
            ),
        )

        eta = parity_boundary(2)
        beta = parity_beta((F(1), F(1)))
        derivative = mode_derivative(2)
        self.assertEqual(
            subtract(matmul(derivative, even), matmul(odd, derivative)),
            outer(beta, eta),
        )

        collision_projector = scale(
            F(1, 2),
            (
                vector(1, -1),
                vector(-1, 1),
            ),
        )
        reduced_inverse = scale(
            F(-3, 8),
            (
                vector(1, 1),
                vector(1, 1),
            ),
        )
        kernel = vector(0, 1, -2)
        ground_projector = scale(F(1, 5), outer(kernel, kernel))
        u = matvec(ground_projector, eta)
        t = norm_squared(u)
        d = matvec(derivative, eta)
        fd = matvec(collision_projector, d)
        sbeta = matvec(reduced_inverse, beta)

        self.assertEqual(matvec(even, kernel), vector(0, 0, 0))
        self.assertEqual(matvec(collision_projector, beta), vector(0, 0))
        self.assertEqual(t, Q2(F(2, 5)))
        self.assertEqual(u, vector(0, -SQRT2 / 5, 2 * SQRT2 / 5))
        self.assertEqual(fd, vector(-SQRT2 / 2, SQRT2 / 2))
        self.assertEqual(sbeta, vector(-3 * SQRT2 / 4, -3 * SQRT2 / 4))
        self.assertEqual(
            matvec(derivative, u),
            tuple(fd[i] - t * sbeta[i] for i in range(2)),
        )

        dstar_collision = matvec(transpose(derivative), vector(1, -1))
        self.assertEqual(dstar_collision, kernel)
        self.assertEqual(matvec(even, dstar_collision), vector(0, 0, 0))

        derivative_dagger = mode_derivative_pseudoinverse(2)
        lift_fd = matvec(derivative_dagger, fd)
        lift_sbeta = matvec(derivative_dagger, sbeta)
        e0 = vector(1, 0, 0)
        g = tuple(lift_fd[i] - dot(eta, lift_fd) * e0[i] for i in range(3))
        h = tuple(
            (ONE + dot(eta, lift_sbeta)) * e0[i] - lift_sbeta[i]
            for i in range(3)
        )
        self.assertEqual(g, vector(F(1, 2), -SQRT2 / 2, SQRT2 / 4))
        self.assertEqual(h, vector(F(-5, 4), 3 * SQRT2 / 4, 3 * SQRT2 / 8))
        self.assertEqual(tuple(g[i] + t * h[i] for i in range(3)), u)
        self.assertEqual(norm_squared(tuple(g[i] + t * h[i] for i in range(3))), t)

    def test_collision_trace_principal_angle_obstruction(self):
        ground_projector = diagonal(1, 1, 0)
        collision_image_projector = diagonal(0, 1, 0)
        kappa = vector(1, 0, 0)
        low_projector = diagonal(0, 1, 0)
        y_squared = norm_squared(matvec(ground_projector, kappa))
        mixed_trace = trace(matmul(low_projector, ground_projector))
        collision_trace = trace(matmul(low_projector, collision_image_projector))
        remainder_trace = trace(
            matmul(low_projector, subtract(ground_projector, collision_image_projector))
        )
        self.assertEqual(y_squared, ONE)
        self.assertEqual(mixed_trace, ONE)
        self.assertEqual(collision_trace, ONE)
        self.assertEqual(remainder_trace, ZERO)
        self.assertGreaterEqual(mixed_trace.a, collision_trace.a)

    def test_collision_orientation_counterfamily_is_exact(self):
        # Collision does not by itself break the overlap identity.  With a
        # visible rank-one even ground it is still the same rank-one fact.
        _, simple_even, simple_odd = source_parity_blocks(
            1, (F(7, 3), F(0)), (F(0),)
        )
        self.assertEqual(simple_even, diagonal(F(7, 3), 0))
        self.assertEqual(simple_odd, diagonal(0))
        simple_ground_projector = diagonal(0, 1)
        simple_kappa = vector(F(3, 5), F(4, 5))
        simple_x = vector(0, 1)
        simple_y_squared = norm_squared(
            matvec(simple_ground_projector, simple_kappa)
        )
        simple_alpha_squared = dot(simple_kappa, simple_x) ** 2
        self.assertEqual(simple_y_squared, simple_alpha_squared)

        # u0/sqrt(3) is the canonical boundary line and v0/sqrt(3) is its
        # orthogonal mate in the exact two-dimensional ground space.
        u0 = vector(1, SQRT2, 0)
        v0 = vector(SQRT2, -1, 0)
        ground_projector = diagonal(1, 1, 0)
        even = diagonal(0, 0, F(7, 3))
        self.assertEqual(norm_squared(u0), Q2(3))
        self.assertEqual(norm_squared(v0), Q2(3))
        self.assertEqual(dot(u0, v0), ZERO)

        previous_overlap = ONE
        for j in range(1, 13):
            parameter = F(2**j)
            coefficient = F(2) * parameter / (1 + parameter**2)
            transverse = (parameter**2 - 1) / (parameter**2 + 1)
            self.assertEqual(coefficient**2 + transverse**2, 1)
            scaled_kappa = tuple(
                Q2(coefficient) * u0[i] + Q2(transverse) * v0[i]
                for i in range(3)
            )
            self.assertEqual(norm_squared(scaled_kappa), Q2(3))
            self.assertEqual(matvec(even, scaled_kappa), vector(0, 0, 0))
            projected = matvec(ground_projector, scaled_kappa)
            y_squared = norm_squared(projected) / norm_squared(scaled_kappa)
            alpha_squared = dot(scaled_kappa, u0) ** 2 / (
                norm_squared(scaled_kappa) * norm_squared(u0)
            )
            self.assertEqual(y_squared, ONE)
            self.assertEqual(alpha_squared, Q2(coefficient**2))
            self.assertTrue(alpha_squared.a < previous_overlap.a)
            previous_overlap = alpha_squared
        self.assertTrue(previous_overlap.a < F(1, 1000))

    def test_note_freezes_claim_boundary_and_exact_formulas(self):
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "|\\alpha|^2=Y^2",
            "T\\leq1-Y^2",
            "F\\beta=0",
            "D^*\\operatorname{Ran}F\\subset E",
            "u=g+th",
            "t=\\|g+th\\|^2",
            "Du=Fd-tS\\beta",
            "\\operatorname{tr}(P_LP_W)",
            "principal angles",
            "in particular \\(t>0\\)",
            "\\tau=O(\\lambda^{-1/2})",
            "visible collision branch with \\(t>0\\)",
            "The branch \\(t=0\\) is a failed branch",
            "diagnostic only",
            "actual-source alignment input",
            "`P0_INVALIDATED`",
        )
        for phrase in required:
            self.assertIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
