from __future__ import annotations

from fractions import Fraction
import unittest


F = Fraction


class Exact:
    """Polynomial ring Q[pi,sqrt(2)] with sqrt(2)^2 reduced to 2."""

    def __init__(self, terms: dict[tuple[int, int], Fraction] | None = None):
        clean = {}
        for key, value in (terms or {}).items():
            value = F(value)
            if value:
                clean[key] = clean.get(key, F(0)) + value
        self.terms = tuple(sorted((key, value) for key, value in clean.items() if value))

    @staticmethod
    def coerce(value: object) -> "Exact":
        if isinstance(value, Exact):
            return value
        if isinstance(value, (int, Fraction)) and not isinstance(value, bool):
            return Exact({(0, 0): F(value)})
        raise TypeError(f"cannot coerce {value!r}")

    def as_dict(self) -> dict[tuple[int, int], Fraction]:
        return dict(self.terms)

    def __add__(self, other: object) -> "Exact":
        rhs = Exact.coerce(other).as_dict()
        out = self.as_dict()
        for key, value in rhs.items():
            out[key] = out.get(key, F(0)) + value
        return Exact(out)

    __radd__ = __add__

    def __neg__(self) -> "Exact":
        return Exact({key: -value for key, value in self.terms})

    def __sub__(self, other: object) -> "Exact":
        return self + (-Exact.coerce(other))

    def __rsub__(self, other: object) -> "Exact":
        return Exact.coerce(other) - self

    def __mul__(self, other: object) -> "Exact":
        rhs = Exact.coerce(other)
        out: dict[tuple[int, int], Fraction] = {}
        for (pi_left, root_left), left_value in self.terms:
            for (pi_right, root_right), right_value in rhs.terms:
                root_power = root_left + root_right
                factor = F(2) if root_power >= 2 else F(1)
                key = (pi_left + pi_right, root_power % 2)
                out[key] = out.get(key, F(0)) + factor * left_value * right_value
        return Exact(out)

    __rmul__ = __mul__

    def __truediv__(self, other: object) -> "Exact":
        if not isinstance(other, (int, Fraction)) or isinstance(other, bool):
            raise TypeError("division is allowed only by an exact rational")
        divisor = F(other)
        return Exact({key: value / divisor for key, value in self.terms})

    def __eq__(self, other: object) -> bool:
        try:
            return self.terms == Exact.coerce(other).terms
        except TypeError:
            return False

    def __repr__(self) -> str:
        return f"Exact({dict(self.terms)!r})"


ZERO = Exact()
ONE = Exact.coerce(1)
PI = Exact({(1, 0): F(1)})
ROOT2 = Exact({(0, 1): F(1)})

Matrix = tuple[tuple[Exact, ...], ...]
Vector = tuple[Exact, ...]


def matrix(rows: list[list[object]]) -> Matrix:
    return tuple(tuple(Exact.coerce(value) for value in row) for row in rows)


def transpose(value: Matrix) -> Matrix:
    return tuple(tuple(value[i][j] for i in range(len(value))) for j in range(len(value[0])))


def matmul(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(
            sum((left[i][k] * right[k][j] for k in range(len(right))), ZERO)
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


def matvec(value: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum((entry * vector[j] for j, entry in enumerate(row)), ZERO)
        for row in value
    )


def outer(left: Vector, right: Vector) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def add(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] + right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def scale(value: Matrix, scalar: object) -> Matrix:
    factor = Exact.coerce(scalar)
    return tuple(tuple(factor * entry for entry in row) for row in value)


def subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] - right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def shift(value: Matrix, scalar: Exact) -> Matrix:
    return tuple(
        tuple(value[i][j] - (scalar if i == j else ZERO) for j in range(len(value)))
        for i in range(len(value))
    )


def dot(left: Vector, right: Vector) -> Exact:
    return sum((x * y for x, y in zip(left, right)), ZERO)


class TailDiscrepancyTransverseSchurTests(unittest.TestCase):
    def test_exact_stieltjes_endpoint_collapse_and_endpoint_atom(self) -> None:
        # A rational toy Stieltjes calculation checks every sign and both
        # endpoint terms in Theorem 2.1.  Here omega=1 on [0,2], L=1,
        # C(h)=C0*(1-h), dD=a*dh+w*delta_u+w_L*delta_1.
        c0 = F(5)
        a = F(-2, 3)
        weight = F(7, 5)
        endpoint_weight = F(11, 6)
        location = F(1, 3)

        # Original A_tail-T_D form.  The endpoint atom is multiplied by
        # C(1)=0 and must not change the value.
        a_tail = c0 * F(3, 2)
        t_discrepancy = a * c0 * F(1, 2) + weight * c0 * (1 - location)
        original = a_tail - t_discrepancy + endpoint_weight * F(0)

        # H_tail(h)=2-h on [0,1] and
        # F_tail=(a+1)h-2+w*1_[u,1]+w_L*1_{h=1}.
        # Since C'=-C0, the endpoint value again has zero Lebesgue mass.
        integral_f_tail = (a + 1) * F(1, 2) - 2 + weight * (1 - location)
        collapsed = -c0 * integral_f_tail + endpoint_weight * F(0)
        self.assertEqual(collapsed, original)

        # Omitting the killing tail C0*integral_1^2 omega changes the answer.
        self.assertNotEqual(original, c0 * F(1, 2) - t_discrepancy)

    def test_tail_primitive_removes_both_elementary_laplace_terms(self) -> None:
        # With r=exp(-t/2), direct differentiation of the closed primitive
        # reduces to
        # 1/(1-r^2)+1/(1+r^2)-2 = 2*r^4/(1-r^4).
        # Multiplication by dr/dt=-r/2 gives -r^5/(1-r^4)=-omega_tail.
        # The following exact coefficient identity checks that reduction.
        # (1+r^2)+(1-r^2)-2*(1-r^4)=2*r^4.
        coefficients = {
            0: F(1) + F(1) - 2,
            2: F(1) - F(1),
            4: F(2),
        }
        self.assertEqual(coefficients, {0: F(0), 2: F(0), 4: F(2)})

        # After adding 2/(s+1/2), the rational part of the full-boundary
        # transform has numerator 1-2*(s+1/2)+2*s, identically zero.
        constant_coefficient = F(1) - 2 * F(1, 2)
        linear_coefficient = -2 + 2
        self.assertEqual(constant_coefficient, 0)
        self.assertEqual(linear_coefficient, 0)

    def test_single_prime_shift_reconstructs_cauchy_and_parity_blocks(self) -> None:
        modes = (-2, -1, 0, 1, 2)
        sine = {-2: 0, -1: -1, 0: 0, 1: 1, 2: 0}
        cosine = {-2: -1, -1: 0, 0: 1, 1: 0, 2: -1}

        # Q_tilde=pi*(3I-K_{L/4}).  Multiplication by pi removes every
        # reciprocal-pi off-diagonal from the direct translation formula.
        q_rows: list[list[Exact]] = []
        for n in modes:
            row: list[Exact] = []
            for m in modes:
                if n == m:
                    k_times_pi = PI * F(3, 2) * cosine[n]
                    row.append(3 * PI - k_times_pi)
                else:
                    row.append(Exact.coerce(-(sine[m] - sine[n]) / F(n - m)))
            q_rows.append(row)
        q_complex = tuple(tuple(row) for row in q_rows)

        b = {
            n: ZERO if n == 0 else Exact.coerce(n) * q_complex[modes.index(n)][modes.index(0)]
            for n in modes
        }
        self.assertEqual(tuple(b[n] for n in modes), tuple(Exact.coerce(sine[n]) for n in modes))
        for i, n in enumerate(modes):
            for j, m in enumerate(modes):
                if n != m:
                    self.assertEqual(q_complex[i][j], (b[n] - b[m]) / F(n - m))

        inv_root2 = ROOT2 / 2
        even = matrix(
            [
                [0, 0, inv_root2],
                [0, inv_root2, 0],
                [1, 0, 0],
                [0, inv_root2, 0],
                [0, 0, inv_root2],
            ]
        )
        odd = matrix(
            [
                [0, -inv_root2],
                [-inv_root2, 0],
                [0, 0],
                [inv_root2, 0],
                [0, inv_root2],
            ]
        )
        q_plus = matmul(matmul(transpose(even), q_complex), even)
        q_minus = matmul(matmul(transpose(odd), q_complex), odd)

        self.assertEqual(
            q_plus,
            matrix(
                [
                    [3 * PI / 2, ROOT2, 0],
                    [ROOT2, 3 * PI + 1, F(-2, 3)],
                    [0, F(-2, 3), 9 * PI / 2],
                ]
            ),
        )
        self.assertEqual(
            q_minus,
            matrix(
                [
                    [3 * PI - 1, F(-4, 3)],
                    [F(-4, 3), 9 * PI / 2],
                ]
            ),
        )

        derivative = matrix([[0, 1, 0], [0, 0, 2]])
        eta = (ONE, ROOT2, ROOT2)
        beta = (ROOT2, ZERO)
        self.assertEqual(
            subtract(matmul(derivative, q_plus), matmul(q_minus, derivative)),
            outer(beta, eta),
        )

        # Q_tilde=pi*I + pi*(2I-K); this is a positive scalar plus a
        # nonnegative killed-jump Dirichlet form.
        identity = matrix(
            [
                [1 if i == j else 0 for j in range(5)]
                for i in range(5)
            ]
        )
        pi_k = subtract(scale(identity, 3 * PI), q_complex)
        dirichlet_part = subtract(scale(identity, 2 * PI), pi_k)
        self.assertEqual(q_complex, add(scale(identity, PI), dirichlet_part))

    def test_combined_endpoint_vector_and_negative_schur_short_are_exact(self) -> None:
        q_plus = matrix(
            [
                [3 * PI / 2, ROOT2, 0],
                [ROOT2, 3 * PI + 1, F(-2, 3)],
                [0, F(-2, 3), 9 * PI / 2],
            ]
        )
        q_minus = matrix(
            [
                [3 * PI - 1, F(-4, 3)],
                [F(-4, 3), 9 * PI / 2],
            ]
        )
        derivative = matrix([[0, 1, 0], [0, 0, 2]])
        eta = (ONE, ROOT2, ROOT2)
        beta = (ROOT2, ZERO)
        kappa = (ONE, ONE, ONE)  # normalization cancels from q and the identity

        rho = 2 * ROOT2 / 3 - F(1, 9)
        rayleigh = 3 * PI + rho
        self.assertEqual(dot(kappa, matvec(q_plus, kappa)) / 3, rayleigh)

        residual = tuple(value - rayleigh for value in matvec(q_plus, kappa))
        endpoint = dot(eta, kappa)
        x = matvec(derivative, kappa)
        combined = tuple(
            value - endpoint * beta[i]
            for i, value in enumerate(matvec(derivative, residual))
        )
        odd_action = matvec(shift(q_minus, rayleigh), x)
        self.assertEqual(combined, odd_action)
        self.assertEqual(
            combined,
            (
                -F(11, 3) - rho,
                3 * PI - F(4, 3) - 2 * rho,
            ),
        )
        self.assertNotEqual(matvec(derivative, residual), combined)

        transverse = (Exact.coerce(-2), ONE)
        odd_shift = shift(q_minus, rayleigh)
        a = dot(x, matvec(odd_shift, x)) / 5
        b_perp = dot(transverse, matvec(odd_shift, transverse)) / 5
        cross = dot(transverse, matvec(odd_shift, x)) / 5
        self.assertEqual(a, 6 * PI / 5 - 2 * ROOT2 / 3 - F(52, 45))
        self.assertEqual(b_perp, 3 * PI / 10 - 2 * ROOT2 / 3 + F(17, 45))
        self.assertEqual(cross, 3 * (PI + 2) / 5)

        # Exact rational sign proof using 3<pi<22/7 and sqrt(2)<3/2.
        self.assertEqual(F(18, 5) - 1 - F(52, 45), F(13, 9))
        self.assertGreater(F(13, 9), 0)  # a>13/9
        self.assertEqual(F(9, 10) - 1 + F(17, 45), F(5, 18))
        self.assertGreater(F(5, 18), 0)  # b_perp>5/18
        self.assertLess(F(132, 35), 4)  # a<6*(22/7)/5<4
        self.assertLess(F(33, 35) + F(17, 45), F(4, 3))  # b_perp<4/3
        self.assertLess(F(16, 3), 9)  # a*b_perp<c^2, since c>3


if __name__ == "__main__":
    unittest.main()
