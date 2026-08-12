"""Pure standard-library checks for the finite mixed-projector theorem.

These are exact rational regressions except for one Decimal evaluation of the
square-root form of the resolvent error bound.  No source matrix, eigendata,
zero table, NumPy object, or cached producer boolean is read.
"""

from decimal import Decimal, localcontext
from fractions import Fraction
from math import factorial
import unittest


F = Fraction


def dot(x, y):
    return sum((a * b for a, b in zip(x, y)), F(0))


def norm_squared(x):
    return dot(x, x)


def poly_mul(p, q):
    out = [F(0)] * (len(p) + len(q) - 1)
    for i, a in enumerate(p):
        for j, b in enumerate(q):
            out[i + j] += a * b
    return out


def characteristic_polynomial_of_diagonal(diagonal):
    p = [F(1)]
    for eigenvalue in diagonal:
        p = poly_mul(p, [-eigenvalue, F(1)])
    return p


def diagonal_adjugate_polynomials(diagonal):
    result = []
    for omitted in range(len(diagonal)):
        p = [F(1)]
        for index, eigenvalue in enumerate(diagonal):
            if index != omitted:
                p = poly_mul(p, [-eigenvalue, F(1)])
        result.append(p)
    return result


def derivative_at_zero(poly, order):
    if order >= len(poly):
        return F(0)
    return F(factorial(order)) * poly[order]


def determinant(matrix):
    """Exact Gaussian-elimination determinant over Fraction."""

    n = len(matrix)
    if n == 0:
        return F(1)
    a = [[F(entry) for entry in row] for row in matrix]
    sign = 1
    value = F(1)
    for col in range(n):
        pivot = next((row for row in range(col, n) if a[row][col]), None)
        if pivot is None:
            return F(0)
        if pivot != col:
            a[col], a[pivot] = a[pivot], a[col]
            sign *= -1
        pivot_value = a[col][col]
        value *= pivot_value
        for row in range(col + 1, n):
            if not a[row][col]:
                continue
            scale = a[row][col] / pivot_value
            for k in range(col + 1, n):
                a[row][k] -= scale * a[col][k]
    return value if sign > 0 else -value


def minor(matrix, deleted_row, deleted_col):
    return [
        [entry for col, entry in enumerate(row) if col != deleted_col]
        for row_index, row in enumerate(matrix)
        if row_index != deleted_row
    ]


def adjugate(matrix):
    n = len(matrix)
    return [
        [
            (F(-1) if (row + col) % 2 else F(1))
            * determinant(minor(matrix, col, row))
            for col in range(n)
        ]
        for row in range(n)
    ]


def mat_vec(matrix, vector):
    return [dot(row, vector) for row in matrix]


def fraction_decimal(value):
    return Decimal(value.numerator) / Decimal(value.denominator)


class CanonicalGroundMixedProjectorOverlapTests(unittest.TestCase):
    def test_double_ground_derivative_cofactor_identity_and_mixed_overlap(self):
        diagonal = [F(0), F(0), F(3), F(5)]
        p = characteristic_polynomial_of_diagonal(diagonal)
        cofactors = diagonal_adjugate_polynomials(diagonal)

        p_second = derivative_at_zero(p, 2)
        c_first = [derivative_at_zero(poly, 1) for poly in cofactors]
        self.assertEqual(p_second, 30)
        self.assertEqual(c_first, [15, 15, 0, 0])

        # P = m C^(m-1)(mu) / p^(m)(mu), with m=2.
        reconstructed_projector_diagonal = [F(2) * value / p_second for value in c_first]
        self.assertEqual(reconstructed_projector_diagonal, [1, 1, 0, 0])

        eta = [F(1), F(2), F(3), F(4)]
        kappa = [F(3, 5), F(4, 5), F(0), F(0)]
        self.assertEqual(norm_squared(kappa), 1)
        b_first = sum(
            (eta[i] * eta[i] * c_first[i] for i in range(4)), F(0)
        )
        mixed_first = sum(
            (kappa[i] * eta[i] * c_first[i] for i in range(4)), F(0)
        )
        direct_alpha_squared = F(11, 5) ** 2 / F(5)
        derivative_alpha_squared = F(2) * mixed_first**2 / (p_second * b_first)
        self.assertEqual(b_first, 75)
        self.assertEqual(mixed_first, 33)
        self.assertEqual(direct_alpha_squared, F(121, 125))
        self.assertEqual(derivative_alpha_squared, direct_alpha_squared)
        self.assertGreater(p_second * b_first, 0)

        # The ordinary adjugate at a root of multiplicity two is zero.
        self.assertEqual(
            [derivative_at_zero(poly, 0) for poly in cofactors], [0, 0, 0, 0]
        )

    def test_triple_ground_factorials_and_negative_g_sign(self):
        diagonal = [F(0), F(0), F(0), F(2)]
        p = characteristic_polynomial_of_diagonal(diagonal)
        cofactors = diagonal_adjugate_polynomials(diagonal)
        p_third = derivative_at_zero(p, 3)
        c_second = [derivative_at_zero(poly, 2) for poly in cofactors]

        # Here g(0)=-2.  These values test both exact factorials and sign.
        self.assertEqual(p_third, factorial(3) * -2)
        self.assertEqual(c_second, [factorial(2) * -2] * 3 + [0])
        self.assertEqual(
            [F(3) * value / p_third for value in c_second], [1, 1, 1, 0]
        )

    def test_rank_one_characteristic_sign_from_constructed_matrix(self):
        a = [
            [F(0), F(1), F(0)],
            [F(1), F(2), F(1)],
            [F(0), F(1), F(4)],
        ]
        eta = [F(1), F(2), F(1)]
        epsilon = F(2, 7)
        z = F(3, 2)
        base = [
            [z * (row == col) - a[row][col] for col in range(3)]
            for row in range(3)
        ]
        # A_epsilon=A-epsilon eta eta^T, so zI-A_epsilon has a plus sign.
        perturbed_characteristic_matrix = [
            [base[row][col] + epsilon * eta[row] * eta[col] for col in range(3)]
            for row in range(3)
        ]
        cofactor_matrix = adjugate(base)
        boundary_cofactor = dot(eta, mat_vec(cofactor_matrix, eta))
        self.assertEqual(
            determinant(perturbed_characteristic_matrix),
            determinant(base) + epsilon * boundary_cofactor,
        )

    def test_resolvent_direction_and_finite_delta_error(self):
        # A=diag(0,0,3,5), P=diag(1,1,0,0).
        eta = [F(1), F(2), F(3), F(4)]
        u = [F(1), F(2), F(0), F(0)]
        v = [F(0), F(0), F(3), F(4)]
        delta = F(1, 7)
        gamma = F(3)
        w = [F(0), F(0), F(3) / (F(3) + delta), F(4) / (F(5) + delta)]
        resolvent_eta = [
            F(1) / delta,
            F(2) / delta,
            F(3) / (F(3) + delta),
            F(4) / (F(5) + delta),
        ]
        self.assertEqual(dot(u, w), 0)
        self.assertEqual(
            resolvent_eta, [u[i] / delta + w[i] for i in range(4)]
        )
        self.assertLessEqual(
            norm_squared(w), norm_squared(v) / (gamma + delta) ** 2
        )

        # Evaluate the square-root presentation from exact Fraction inputs.
        with localcontext() as context:
            context.prec = 80
            rd = [fraction_decimal(value) for value in resolvent_eta]
            rd_norm = sum((value * value for value in rd), Decimal(0)).sqrt()
            y = [value / rd_norm for value in rd]
            root_five = Decimal(5).sqrt()
            x = [Decimal(1) / root_five, Decimal(2) / root_five, Decimal(0), Decimal(0)]
            distance = sum(
                ((y[i] - x[i]) ** 2 for i in range(4)), Decimal(0)
            ).sqrt()
            certified_error = (
                fraction_decimal(delta)
                * fraction_decimal(norm_squared(v)).sqrt()
                / (root_five * fraction_decimal(gamma + delta))
            )
            t = (
                fraction_decimal(delta)
                * fraction_decimal(norm_squared(w)).sqrt()
                / root_five
            )
            self.assertLessEqual(distance, t)
            self.assertLessEqual(t, certified_error)

            kappa = [F(3, 5), F(4, 5), F(0), F(0)]
            overlap_y = sum(
                (fraction_decimal(kappa[i]) * y[i] for i in range(4)), Decimal(0)
            )
            alpha = Decimal(11) / (Decimal(5) * root_five)
            self.assertLessEqual(abs(alpha - overlap_y), distance)
            self.assertGreaterEqual(alpha, abs(overlap_y) - certified_error)

    def test_simple_branch_energy_and_residual_gap_bounds(self):
        diagonal = [F(0), F(3), F(5)]
        kappa = [F(12, 13), F(5, 13), F(0)]
        self.assertEqual(norm_squared(kappa), 1)
        mu = F(0)
        gamma = F(3)
        alpha_squared = kappa[0] ** 2
        q = sum((diagonal[i] * kappa[i] ** 2 for i in range(3)), F(0))
        residual_squared = sum(
            ((diagonal[i] - q) ** 2 * kappa[i] ** 2 for i in range(3)), F(0)
        )
        outside_squared = kappa[1] ** 2 + kappa[2] ** 2

        self.assertEqual(1 - alpha_squared, F(25, 169))
        self.assertEqual((q - mu) / gamma, F(25, 169))
        self.assertLess(q, mu + gamma)
        # Squared form of ||(I-P)kappa|| <= r/(mu+gamma-q).
        self.assertLessEqual(
            outside_squared * (mu + gamma - q) ** 2, residual_squared
        )

    def test_finite_boundary_norm_and_auxiliary_operator_norm(self):
        epsilon = F(3, 101)
        previous = F(0)
        for n in range(1, 9):
            eta = [F(1)] * (2 * n + 1)
            eta_norm_squared = norm_squared(eta)
            self.assertEqual(eta_norm_squared, 2 * n + 1)
            self.assertGreater(eta_norm_squared, previous)
            rank_one = [
                [epsilon * eta[row] * eta[col] for col in range(2 * n + 1)]
                for row in range(2 * n + 1)
            ]
            claimed_norm = epsilon * eta_norm_squared
            self.assertEqual(
                mat_vec(rank_one, eta), [claimed_norm * entry for entry in eta]
            )
            # Reconstruct a basis of the kernel rather than trusting rank one.
            for col in range(1, 2 * n + 1):
                kernel_vector = [F(0)] * (2 * n + 1)
                kernel_vector[0] = -1
                kernel_vector[col] = 1
                self.assertEqual(mat_vec(rank_one, kernel_vector), [F(0)] * (2 * n + 1))
            previous = eta_norm_squared

    def test_exact_diagonal_source_cauchy_counterfamily(self):
        n_cutoff = 4
        gap = F(7, 3)
        indices = list(range(-n_cutoff, n_cutoff + 1))
        a = {n: (F(0) if abs(n) <= 1 else gap) for n in indices}
        b = {n: F(0) for n in indices}
        q = []
        for m in indices:
            row = []
            for n in indices:
                if m == n:
                    row.append(a[m])
                else:
                    row.append((b[m] - b[n]) / F(m - n))
            q.append(row)

        for row, m in enumerate(indices):
            for col, n in enumerate(indices):
                self.assertEqual(q[row][col], a[m] if m == n else 0)
                reflected_row = indices.index(-m)
                reflected_col = indices.index(-n)
                self.assertEqual(q[row][col], q[reflected_row][reflected_col])

        # The even spectrum is (0,0,G,...,G), so the complete-ground gap is G.
        even_spectrum = [a[0]] + [a[n] for n in range(1, n_cutoff + 1)]
        self.assertEqual(even_spectrum[:2], [0, 0])
        self.assertTrue(all(value == gap for value in even_spectrum[2:]))
        self.assertEqual(min(even_spectrum[2:]) - min(even_spectrum), gap)

        # In the orthonormal {x,w} coordinates of the exact ground plane,
        # kappa_j=(t_j,s_j).  Every displayed assertion is rational.
        for j in range(1, 13):
            t_parameter = F(2**j)
            t = F(2) * t_parameter / (F(1) + t_parameter**2)
            s = (t_parameter**2 - F(1)) / (t_parameter**2 + F(1))
            alpha_squared = t**2
            boundary_mixed_squared = F(3) * t**2
            boundary_projector_mass = F(3)
            self.assertEqual(t**2 + s**2, 1)
            self.assertEqual(
                boundary_mixed_squared / boundary_projector_mass, alpha_squared
            )
            self.assertEqual(F(1) / t, (F(1) + 4**j) / F(2 ** (j + 1)))
            self.assertGreaterEqual(F(1) / t, F(2 ** (j - 1)))
            # Reconstruct q and the residual in the orthonormal basis
            # (x,w,e_2^+,...), where the even block is diag(0,0,G,...).
            kappa_coordinates = [t, s] + [F(0)] * (n_cutoff - 1)
            rotated_even_diagonal = [F(0), F(0)] + [gap] * (n_cutoff - 1)
            rayleigh = sum(
                (
                    rotated_even_diagonal[i] * kappa_coordinates[i] ** 2
                    for i in range(n_cutoff + 1)
                ),
                F(0),
            )
            residual_squared = sum(
                (
                    (rotated_even_diagonal[i] - rayleigh) ** 2
                    * kappa_coordinates[i] ** 2
                    for i in range(n_cutoff + 1)
                ),
                F(0),
            )
            high_mode_tail_squared = sum(
                (coordinate**2 for coordinate in kappa_coordinates[2:]), F(0)
            )
            self.assertEqual(rayleigh, 0)
            self.assertEqual(residual_squared, 0)
            self.assertEqual(high_mode_tail_squared, 0)

    def test_projector_mass_does_not_control_mixed_orientation(self):
        # Abstract orthonormal coordinates on the two-dimensional ground plane.
        # P kappa is always unit, while its canonical x-coordinate tends to zero.
        masses = []
        overlaps = []
        for j in range(1, 10):
            parameter = F(2**j)
            t = F(2) * parameter / (1 + parameter**2)
            s = (parameter**2 - 1) / (parameter**2 + 1)
            masses.append(t**2 + s**2)
            overlaps.append(t)
        self.assertEqual(masses, [F(1)] * len(masses))
        self.assertTrue(all(overlaps[i + 1] < overlaps[i] for i in range(len(overlaps) - 1)))
        self.assertLess(overlaps[-1], F(1, 100))


if __name__ == "__main__":
    unittest.main()
