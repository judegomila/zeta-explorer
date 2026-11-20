"""Exact finite algebra tests for the conditional q-shift sector gate."""

from fractions import Fraction
import unittest


def dot(x, y):
    return sum((a * b for a, b in zip(x, y)), Fraction(0))


def matvec(matrix, vector):
    return [dot(row, vector) for row in matrix]


def quadratic(matrix, vector):
    return dot(vector, matvec(matrix, vector))


def poly_mul(left, right):
    """Multiply coefficient lists in increasing order."""
    out = [Fraction(0)] * (len(left) + len(right) - 1)
    for i, a in enumerate(left):
        for j, b in enumerate(right):
            out[i + j] += a * b
    return out


def diagonal_characteristic(values):
    out = [Fraction(1)]
    for value in values:
        out = poly_mul(out, [value, Fraction(1)])
    return out


class QShiftSectorWeilCoreGateTests(unittest.TestCase):
    def test_sum_of_squares_identity_is_exact(self):
        # b=(3,4), r=5 gives a rational unit direction e=(3/5,4/5).
        b = [Fraction(3), Fraction(4)]
        r = Fraction(5)
        e = [entry / r for entry in b]
        for a, v in [
            (Fraction(2), [Fraction(-1), Fraction(3)]),
            (Fraction(-7, 3), [Fraction(5, 2), Fraction(-4)]),
            (Fraction(0), [Fraction(9), Fraction(1, 7)]),
        ]:
            lhs = r * a * a + 2 * a * dot(b, v) + r * dot(v, v)
            ev = dot(e, v)
            rhs = r * (a + ev) ** 2 + r * (dot(v, v) - ev**2)
            self.assertEqual(lhs, rhs)
            self.assertGreaterEqual(rhs, 0)

    def test_full_rational_example_obeys_q_minus_r_floor(self):
        q = Fraction(-2)
        b = [Fraction(3), Fraction(4)]
        r = Fraction(5)
        # B_q=diag(1,2)>0.  The lower even block of Q is qI+B_q.
        q_plus = [
            [q, b[0], b[1]],
            [b[0], q + 1, 0],
            [b[1], 0, q + 2],
        ]
        for vector in [
            [Fraction(1), Fraction(0), Fraction(0)],
            [Fraction(2), Fraction(-3), Fraction(1)],
            [Fraction(-5), Fraction(4), Fraction(7)],
        ]:
            floor_form = quadratic(q_plus, vector) - (q - r) * dot(vector, vector)
            self.assertGreaterEqual(floor_form, 0)

        # C_q=diag(1,3)>0, so the odd block is even farther above q-r.
        q_minus = [[q + 1, 0], [0, q + 3]]
        for vector in [[Fraction(1), Fraction(2)], [Fraction(-4), Fraction(7)]]:
            floor_form = quadratic(q_minus, vector) - (q - r) * dot(vector, vector)
            self.assertGreater(floor_form, 0)

    def test_coefficient_one_is_sharp(self):
        # For [[0,1],[1,epsilon]], a claimed floor -c with c<1 fails when
        # det(M+cI)=c(c+epsilon)-1 is negative.
        for c in [Fraction(1, 2), Fraction(9, 10), Fraction(99, 100)]:
            epsilon = Fraction(1, 1000)
            determinant_at_minus_c = c * (c + epsilon) - 1
            self.assertLess(determinant_at_minus_c, 0)

    def test_simultaneous_positive_cone(self):
        b_values = [Fraction(2), Fraction(3)]
        c_values = [Fraction(1), Fraction(4)]
        coefficients = poly_mul(
            diagonal_characteristic(b_values),
            diagonal_characteristic(c_values),
        )
        self.assertTrue(all(value > 0 for value in coefficients))

    def test_orthogonal_compression_adjugate_identity(self):
        # kappa=(3/5,4/5), v=(-4/5,3/5) is an exact orthonormal pair.
        kappa = [Fraction(3, 5), Fraction(4, 5)]
        complement = [Fraction(-4, 5), Fraction(3, 5)]
        source_shifted = [
            [Fraction(7, 3), Fraction(-5, 7)],
            [Fraction(-5, 7), Fraction(11, 4)],
        ]
        compressed = quadratic(source_shifted, complement)

        # For a 2x2 matrix S+sI, adj(S+sI) swaps the diagonal entries and
        # negates the off diagonal.  The cofactor polynomial must be B+s.
        s00 = source_shifted[0][0]
        s01 = source_shifted[0][1]
        s11 = source_shifted[1][1]
        adj_constant = [
            [s11, -s01],
            [-s01, s00],
        ]
        self.assertEqual(quadratic(adj_constant, kappa), compressed)
        self.assertEqual(dot(kappa, kappa), Fraction(1))

    def test_positive_determinant_does_not_certify_the_cone(self):
        # Two negative eigenvalues leave a positive constant coefficient.
        b_values = [Fraction(2), Fraction(3)]
        c_values = [Fraction(-1), Fraction(-2)]
        coefficients = poly_mul(
            diagonal_characteristic(b_values),
            diagonal_characteristic(c_values),
        )
        self.assertGreater(coefficients[0], 0)
        self.assertTrue(any(value <= 0 for value in coefficients))

    def test_general_shift_requires_control_of_the_shift(self):
        # The finite bound is U-r.  Signs at a very negative U alone cannot
        # approach the zero lower floor needed by the Weil-core passage.
        q = Fraction(0)
        upper_shift = Fraction(-100)
        r = Fraction(1)
        self.assertLess(upper_shift - r, q - r)

    def test_general_shift_finite_floor_is_exactly_available(self):
        q = Fraction(0)
        upper_shift = Fraction(-2)
        b = [Fraction(3), Fraction(4)]
        r = Fraction(5)
        # B_U=diag(1,2)>0, hence A=U*I+B_U.
        q_plus = [
            [q, b[0], b[1]],
            [b[0], upper_shift + 1, 0],
            [b[1], 0, upper_shift + 2],
        ]
        for vector in [
            [Fraction(1), Fraction(-2), Fraction(3)],
            [Fraction(-4), Fraction(1), Fraction(7)],
        ]:
            floor_form = quadratic(q_plus, vector) - (upper_shift - r) * dot(
                vector, vector
            )
            self.assertGreaterEqual(floor_form, 0)


if __name__ == "__main__":
    unittest.main()
