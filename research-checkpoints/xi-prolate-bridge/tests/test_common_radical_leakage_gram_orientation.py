from __future__ import annotations

import unittest
from fractions import Fraction


F = Fraction


def det_fraction(matrix: list[list[Fraction]]) -> Fraction:
    a = [row[:] for row in matrix]
    n = len(a)
    out = F(1)
    for col in range(n):
        pivot = next((row for row in range(col, n) if a[row][col]), None)
        if pivot is None:
            return F(0)
        if pivot != col:
            a[col], a[pivot] = a[pivot], a[col]
            out = -out
        value = a[col][col]
        out *= value
        for row in range(col + 1, n):
            factor = a[row][col] / value
            for j in range(col + 1, n):
                a[row][j] -= factor * a[col][j]
    return out


def leading_minors(matrix: list[list[Fraction]]) -> list[Fraction]:
    return [
        det_fraction([row[:size] for row in matrix[:size]])
        for size in range(1, len(matrix) + 1)
    ]


def add_matrices(
    left: list[list[Fraction]], right: list[list[Fraction]]
) -> list[list[Fraction]]:
    return [
        [left[i][j] + right[i][j] for j in range(len(left))]
        for i in range(len(left))
    ]


def scale_matrix(
    scalar: Fraction, matrix: list[list[Fraction]]
) -> list[list[Fraction]]:
    return [[scalar * value for value in row] for row in matrix]


def block_radical_form(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    n = len(matrix)
    return [
        [
            matrix[i % n][j % n]
            * (F(1) if (i < n) == (j < n) else F(-1))
            for j in range(2 * n)
        ]
        for i in range(2 * n)
    ]


def matvec(
    matrix: list[list[Fraction]], vector: list[Fraction]
) -> list[Fraction]:
    return [sum((row[j] * vector[j] for j in range(len(vector))), F(0)) for row in matrix]


def quadratic_form(matrix: list[list[Fraction]], vector: list[Fraction]) -> Fraction:
    image = matvec(matrix, vector)
    return sum((vector[i] * image[i] for i in range(len(vector))), F(0))


def det_pencil_coefficients_2x2(
    left: list[list[Fraction]], right: list[list[Fraction]]
) -> tuple[Fraction, Fraction, Fraction]:
    """Coefficients c0,c1,c2 of det(left-t*right), exactly."""
    c0 = left[0][0] * left[1][1] - left[0][1] * left[1][0]
    c1 = -(
        left[0][0] * right[1][1]
        + right[0][0] * left[1][1]
        - left[0][1] * right[1][0]
        - right[0][1] * left[1][0]
    )
    c2 = right[0][0] * right[1][1] - right[0][1] * right[1][0]
    return c0, c1, c2


def sign_a_plus_b_sqrt_d(a: Fraction, b: Fraction, d: int) -> int:
    """Return the exact sign of a+b*sqrt(d), for nonsquare positive d."""
    if b == 0:
        return (a > 0) - (a < 0)
    if a == 0:
        return (b > 0) - (b < 0)
    if a > 0 and b > 0:
        return 1
    if a < 0 and b < 0:
        return -1
    comparison = a * a - b * b * d
    if a > 0 and b < 0:
        return (comparison > 0) - (comparison < 0)
    # a < 0 < b
    return -((comparison > 0) - (comparison < 0))


# Exact elements a+b*sqrt(2), used only to reconstruct the declared moments.
S2 = tuple[Fraction, Fraction]


def s2(a: int | Fraction = 0, b: int | Fraction = 0) -> S2:
    return F(a), F(b)


def s2_add(left: S2, right: S2) -> S2:
    return left[0] + right[0], left[1] + right[1]


def s2_mul(left: S2, right: S2) -> S2:
    return (
        left[0] * right[0] + 2 * left[1] * right[1],
        left[0] * right[1] + left[1] * right[0],
    )


def s2_matvec(matrix: list[list[S2]], vector: list[S2]) -> list[S2]:
    result: list[S2] = []
    for row in matrix:
        value = s2()
        for entry, coordinate in zip(row, vector):
            value = s2_add(value, s2_mul(entry, coordinate))
        result.append(value)
    return result


def s2_dot(left: list[S2], right: list[S2]) -> S2:
    value = s2()
    for x, y in zip(left, right):
        value = s2_add(value, s2_mul(x, y))
    return value


def source_matrix(a2: Fraction) -> tuple[tuple[int, ...], list[list[Fraction]]]:
    modes = (-2, -1, 0, 1, 2)
    a = {-2: a2, -1: F(13), 0: F(14), 1: F(13), 2: a2}
    b = {-2: F(1), -1: F(3), 0: F(0), 1: F(-3), 2: F(-1)}
    matrix: list[list[Fraction]] = []
    for n in modes:
        row: list[Fraction] = []
        for m in modes:
            row.append(a[n] if n == m else (b[n] - b[m]) / (n - m))
        matrix.append(row)
    return modes, matrix


def parity_form_matrices(
    a2: Fraction,
) -> tuple[list[list[Fraction]], list[list[Fraction]]]:
    # Unnormalized bases (V0,V1+V-1,V2+V-2) and
    # (V1-V-1,V2-V-2), whose Grams are diag(1,2,2) and 2I.
    plus = [
        [F(14), F(-6), F(-1)],
        [F(-6), F(20), F(4, 3)],
        [F(-1), F(4, 3), 2 * a2 - 1],
    ]
    minus = [
        [F(32), F(20, 3)],
        [F(20, 3), 2 * a2 + 1],
    ]
    return plus, minus


class CommonRadicalLeakageGramOrientationTests(unittest.TestCase):
    parameters = (F(33, 4), F(8))

    def test_exact_orientation_contraction_boundary_and_strict_fixture(self) -> None:
        # E has eigenvalues 3 and 1 on (1,1) and (1,-1).  With C=3I,
        # M=C-E is positive semidefinite and the Ritz null direction (1,1)
        # attains the generalized top quotient exactly at one.
        defect = [[F(2), F(1)], [F(1), F(2)]]
        c_ritz = [[F(3), F(0)], [F(0), F(3)]]
        m_ritz = add_matrices(c_ritz, scale_matrix(F(-1), defect))
        ritz_null = [F(1), F(1)]
        self.assertEqual(leading_minors(defect), [F(2), F(3)])
        self.assertEqual(leading_minors(c_ritz), [F(3), F(9)])
        self.assertEqual(leading_minors(m_ritz), [F(1), F(0)])
        self.assertEqual(matvec(m_ritz, ritz_null), [F(0), F(0)])
        self.assertEqual(
            quadratic_form(defect, ritz_null),
            quadratic_form(c_ritz, ritz_null),
        )
        # det(E-tC)=3-12t+9t^2=3(1-t)(1-3t).
        self.assertEqual(
            det_pencil_coefficients_2x2(defect, c_ritz),
            (F(3), F(-12), F(9)),
        )

        # The nearby strict fixture keeps E and replaces C by 4I.
        # Then M=C-E is positive definite and the generalized roots are
        # exactly 3/4 and 1/4, so the top orientation quotient is <1.
        c_strict = [[F(4), F(0)], [F(0), F(4)]]
        m_strict = add_matrices(c_strict, scale_matrix(F(-1), defect))
        self.assertEqual(leading_minors(c_strict), [F(4), F(16)])
        self.assertEqual(leading_minors(m_strict), [F(2), F(3)])
        # det(E-tC)=3-16t+16t^2=(3-4t)(1-4t).
        self.assertEqual(
            det_pencil_coefficients_2x2(defect, c_strict),
            (F(3), F(-16), F(16)),
        )
        for root in (F(3, 4), F(1, 4)):
            c0, c1, c2 = det_pencil_coefficients_2x2(defect, c_strict)
            self.assertEqual(c0 + c1 * root + c2 * root * root, 0)
        self.assertLess(F(3, 4), F(1))

    def test_source_cauchy_commutator_and_inversion_are_exact(self) -> None:
        b = {-2: F(1), -1: F(3), 0: F(0), 1: F(-3), 2: F(-1)}
        for a2 in self.parameters:
            modes, matrix = source_matrix(a2)
            index = {mode: i for i, mode in enumerate(modes)}
            for i, n in enumerate(modes):
                for j, m in enumerate(modes):
                    self.assertEqual(matrix[i][j], matrix[j][i])
                    self.assertEqual(matrix[i][j], matrix[index[-n]][index[-m]])
                    self.assertEqual(
                        F(n - m) * matrix[i][j], b[n] - b[m]
                    )

    def test_two_vector_moment_pencil_is_identical_but_nu5_differs(self) -> None:
        expected_common = [
            F(1),
            F(130, 17),
            F(1046, 17),
            F(9244, 17),
            F(94293, 17),
        ]
        expected_nu5 = (F(267487, 4), F(2273615, 34))
        initial = [s2(0, 2), s2(3), s2()]
        observed_nu5: list[Fraction] = []
        for a2, nu5 in zip(self.parameters, expected_nu5):
            q_plus = [
                [s2(14), s2(0, -3), s2(0, F(-1, 2))],
                [s2(0, -3), s2(10), s2(F(2, 3))],
                [s2(0, F(-1, 2)), s2(F(2, 3)), s2(a2 - F(1, 2))],
            ]
            q2_initial = s2_matvec(q_plus, s2_matvec(q_plus, initial))
            self.assertEqual(q2_initial, [s2(0, 212), s2(66), s2(-7)])

            vector = initial
            moments: list[Fraction] = []
            for _ in range(6):
                value = s2_dot(initial, vector)
                self.assertEqual(value[1], 0)
                moments.append(value[0] / 17)
                vector = s2_matvec(q_plus, vector)
            self.assertEqual(moments[:5], expected_common)
            self.assertEqual(moments[5], nu5)
            observed_nu5.append(moments[5])

        self.assertEqual(observed_nu5[0] - observed_nu5[1], F(49, 68))

        nu0, nu1, nu2, nu3 = expected_common[:4]
        # det(H-zG)=c0+c1*z+c2*z^2.
        c0 = nu1 * nu3 - nu2 * nu2
        c1 = -(nu1 * nu2 + nu3) + 2 * nu2 * nu1
        c2 = nu2 - nu1 * nu1
        self.assertEqual(c2, F(882, 289))
        self.assertEqual(c1 / c2, F(-24))
        self.assertEqual(c0 / c2, F(122))

    def test_even_complement_passes_but_odd_schur_orientation_flips(self) -> None:
        # U=12-sqrt(22).  Every tuple below is a+b*sqrt(22).
        self.assertEqual(sign_a_plus_b_sqrt_d(F(74, 17), F(1), 22), 1)

        even_pass_det = (F(23, 9), F(7, 68))
        even_fail_det = (F(449, 306), F(-5, 34))
        self.assertEqual(sign_a_plus_b_sqrt_d(*even_pass_det, 22), 1)
        self.assertEqual(sign_a_plus_b_sqrt_d(*even_fail_det, 22), 1)

        # The two transverse entries B_U are positive.
        self.assertEqual(sign_a_plus_b_sqrt_d(F(-13, 4), F(1), 22), 1)
        self.assertEqual(sign_a_plus_b_sqrt_d(F(-7, 2), F(1), 22), 1)

        # B_U times the scalar Schur short has opposite signs.
        odd_pass_det = (F(-19, 9), F(3, 4))
        odd_fail_det = (F(-28, 9), F(1, 2))
        self.assertEqual(sign_a_plus_b_sqrt_d(*odd_pass_det, 22), 1)
        self.assertEqual(sign_a_plus_b_sqrt_d(*odd_fail_det, 22), -1)

    def test_boundary_recurrence_retains_the_combined_endpoint_vector(self) -> None:
        # Work with sqrt(17)*kappa=(2*sqrt(2),3,0).
        kappa = [s2(0, 2), s2(3), s2()]
        delta_kappa = s2(0, 5)  # <(1,sqrt(2),sqrt(2)),kappa>
        beta = [s2(0, -3), s2(0, -1)]
        for a2 in self.parameters:
            q_plus = [
                [s2(14), s2(0, -3), s2(0, F(-1, 2))],
                [s2(0, -3), s2(10), s2(F(2, 3))],
                [s2(0, F(-1, 2)), s2(F(2, 3)), s2(a2 - F(1, 2))],
            ]
            q_minus = [
                [s2(16), s2(F(10, 3))],
                [s2(F(10, 3)), s2(a2 + F(1, 2))],
            ]
            qk = s2_matvec(q_plus, kappa)
            d_qk = [qk[1], s2_mul(s2(2), qk[2])]
            d_kappa = [kappa[1], s2_mul(s2(2), kappa[2])]
            qminus_dk = s2_matvec(q_minus, d_kappa)
            left = [
                s2_add(d_qk[i], s2_mul(s2(-1), qminus_dk[i]))
                for i in range(2)
            ]
            right = [s2_mul(beta[i], delta_kappa) for i in range(2)]
            self.assertEqual(left, right)
            self.assertEqual(left, [s2(-30), s2(-10)])

    def test_same_positive_absolute_gram_and_two_sided_radical_extension(self) -> None:
        gram_diagonals = ([F(1), F(2), F(2)], [F(2), F(2)])
        absolute_forms: list[list[list[Fraction]]] = []
        for a2 in self.parameters:
            for signed, gram_diag in zip(parity_form_matrices(a2), gram_diagonals):
                absolute = [
                    [F(20) * gram_diag[i] if i == j else F(0) for j in range(len(gram_diag))]
                    for i in range(len(gram_diag))
                ]
                aligned = scale_matrix(F(1, 2), add_matrices(absolute, signed))
                anti = scale_matrix(F(1, 2), add_matrices(absolute, scale_matrix(F(-1), signed)))
                self.assertTrue(all(value > 0 for value in leading_minors(aligned)))
                self.assertTrue(all(value > 0 for value in leading_minors(anti)))
                self.assertEqual(add_matrices(aligned, anti), absolute)
                self.assertEqual(
                    add_matrices(aligned, scale_matrix(F(-1), anti)), signed
                )

                # On the finite/exterior double, [[B,-B],[-B,B]] kills
                # every (v,v), so the lift is a two-sided radical.
                global_signed = block_radical_form(signed)
                n = len(signed)
                for basis_index in range(n):
                    radical_vector = [F(0)] * (2 * n)
                    radical_vector[basis_index] = F(1)
                    radical_vector[n + basis_index] = F(1)
                    self.assertEqual(
                        matvec(global_signed, radical_vector), [F(0)] * (2 * n)
                    )
                absolute_forms.append(absolute)

        # Each parity absolute form is the same in the pass and fail member.
        self.assertEqual(absolute_forms[0], absolute_forms[2])
        self.assertEqual(absolute_forms[1], absolute_forms[3])


if __name__ == "__main__":
    unittest.main()
