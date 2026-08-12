from __future__ import annotations

import unittest
from fractions import Fraction

import mpmath as mp


F = Fraction
Q22 = tuple[Fraction, Fraction]


def q22(a: int | Fraction = 0, b: int | Fraction = 0) -> Q22:
    return F(a), F(b)


def q22_add(x: Q22, y: Q22) -> Q22:
    return x[0] + y[0], x[1] + y[1]


def q22_sub(x: Q22, y: Q22) -> Q22:
    return x[0] - y[0], x[1] - y[1]


def q22_mul(x: Q22, y: Q22) -> Q22:
    return x[0] * y[0] + 22 * x[1] * y[1], x[0] * y[1] + x[1] * y[0]


def q22_inv(x: Q22) -> Q22:
    denominator = x[0] * x[0] - 22 * x[1] * x[1]
    if denominator == 0:
        raise ZeroDivisionError("zero quadratic-field element")
    return x[0] / denominator, -x[1] / denominator


def q22_div(x: Q22, y: Q22) -> Q22:
    return q22_mul(x, q22_inv(y))


def q22_sign(x: Q22) -> int:
    """Exact sign of a+b*sqrt(22)."""
    a, b = x
    if b == 0:
        return (a > 0) - (a < 0)
    if a == 0:
        return (b > 0) - (b < 0)
    if a > 0 and b > 0:
        return 1
    if a < 0 and b < 0:
        return -1
    comparison = a * a - 22 * b * b
    if a > 0 and b < 0:
        return (comparison > 0) - (comparison < 0)
    return -((comparison > 0) - (comparison < 0))


def q22_ldl_pivots(matrix: list[list[Q22]]) -> list[Q22]:
    """Exact LDL pivots over Q(sqrt(22)); no floating eigensystem is used."""
    n = len(matrix)
    lower = [[q22() for _ in range(n)] for _ in range(n)]
    pivots: list[Q22] = []
    for i in range(n):
        pivot = matrix[i][i]
        for k in range(i):
            pivot = q22_sub(
                pivot,
                q22_mul(q22_mul(lower[i][k], lower[i][k]), pivots[k]),
            )
        if q22_sign(pivot) == 0:
            raise ZeroDivisionError("zero LDL pivot")
        pivots.append(pivot)
        lower[i][i] = q22(1)
        for j in range(i + 1, n):
            value = matrix[j][i]
            for k in range(i):
                value = q22_sub(
                    value,
                    q22_mul(q22_mul(lower[j][k], lower[i][k]), pivots[k]),
                )
            lower[j][i] = q22_div(value, pivot)
    return pivots


def q22_positive_definite(matrix: list[list[Q22]]) -> bool:
    return all(q22_sign(value) > 0 for value in q22_ldl_pivots(matrix))


def b_parameter(n: int) -> Fraction:
    if n == 0:
        return F(0)
    return F(-9 * n, 5 * n * n - 2)


def source_cauchy_matrix(n_cutoff: int, a2: Fraction) -> tuple[list[int], list[list[Fraction]]]:
    modes = list(range(-n_cutoff, n_cutoff + 1))
    large_diagonal = F(50000 * n_cutoff)

    def diagonal(n: int) -> Fraction:
        if n == 0:
            return F(14)
        if abs(n) == 1:
            return F(13)
        if abs(n) == 2:
            return a2
        return large_diagonal

    matrix: list[list[Fraction]] = []
    for n in modes:
        row: list[Fraction] = []
        for m in modes:
            if n == m:
                row.append(diagonal(n))
            else:
                row.append((b_parameter(n) - b_parameter(m)) / (n - m))
        matrix.append(row)
    return modes, matrix


Vector = dict[int, Fraction]


def coordinate_vector(**entries: int) -> Vector:
    return {int(index): F(value) for index, value in entries.items() if value}


def bilinear(
    modes: list[int], matrix: list[list[Fraction]], left: Vector, right: Vector
) -> Fraction:
    index = {mode: i for i, mode in enumerate(modes)}
    total = F(0)
    for n, x in left.items():
        for m, y in right.items():
            total += x * matrix[index[n]][index[m]] * y
    return total


def gram(left: Vector, right: Vector) -> Fraction:
    return sum((x * right.get(n, F(0)) for n, x in left.items()), F(0))


def even_mode(n: int) -> Vector:
    if n == 0:
        return {0: F(1)}
    return {n: F(1), -n: F(1)}


def odd_mode(n: int) -> Vector:
    return {n: F(1), -n: F(-1)}


def shifted_form(
    modes: list[int], matrix: list[list[Fraction]], basis: list[Vector]
) -> list[list[Q22]]:
    # U=12-sqrt(22), so Q-U*G=(Q-12G)+sqrt(22)*G.
    return [
        [
            q22(
                bilinear(modes, matrix, left, right) - 12 * gram(left, right),
                gram(left, right),
            )
            for right in basis
        ]
        for left in basis
    ]


def fraction_ldl_positive(matrix: list[list[Fraction]]) -> bool:
    wrapped = [[q22(value) for value in row] for row in matrix]
    return q22_positive_definite(wrapped)


def matvec(matrix: list[list[Fraction]], vector: list[Fraction]) -> list[Fraction]:
    return [sum((value * vector[j] for j, value in enumerate(row)), F(0)) for row in matrix]


def dot(left: list[Fraction], right: list[Fraction]) -> Fraction:
    return sum((x * y for x, y in zip(left, right)), F(0))


def omega_complex(n: int, m: int, length: mp.mpf, shift: mp.mpf) -> mp.mpf:
    nu_n = 2 * mp.pi * n / length
    if n == m:
        return 2 * (1 - shift / length) * mp.cos(nu_n * shift)
    nu_m = 2 * mp.pi * m / length
    return (mp.sin(nu_m * shift) - mp.sin(nu_n * shift)) / (mp.pi * (n - m))


def odd_translation_matrix(size: int, length: mp.mpf, shift: mp.mpf) -> mp.matrix:
    matrix = mp.matrix(size)
    for i in range(size):
        n = i + 1
        for j in range(size):
            m = j + 1
            # The repository's centered complex modes differ from the real
            # sine basis used by the quadrature path by the diagonal phase
            # (-1)^n.  Retain that phase instead of silently comparing two
            # different off-diagonal conventions.
            matrix[i, j] = (-1) ** (n + m) * (
                omega_complex(n, m, length, shift)
                - omega_complex(n, -m, length, shift)
            )
    return matrix


def odd_translation_matrix_by_quadrature(
    size: int, length: mp.mpf, shift: mp.mpf
) -> mp.matrix:
    matrix = mp.matrix(size)
    half = length / 2
    normalization = mp.sqrt(2 / length)

    def mode(n: int, x: mp.mpf) -> mp.mpf:
        return normalization * mp.sin(2 * mp.pi * n * x / length)

    for i in range(size):
        n = i + 1
        for j in range(size):
            m = j + 1
            forward = mp.quad(
                lambda x: mode(n, x) * mode(m, x + shift),
                [-half, half - shift],
            )
            backward = mp.quad(
                lambda x: mode(n, x) * mode(m, x - shift),
                [-half + shift, half],
            )
            matrix[i, j] = forward + backward
    return matrix


class UnboundedRelativeOrientationInstabilityTests(unittest.TestCase):
    def test_all_n_source_cauchy_identity_and_exact_krylov_decoupling(self) -> None:
        for n_cutoff in (2, 3, 5, 8):
            observed_moments: list[list[Fraction]] = []
            for a2 in (F(33, 4), F(8)):
                modes, matrix = source_cauchy_matrix(n_cutoff, a2)
                index = {mode: i for i, mode in enumerate(modes)}
                for i, n in enumerate(modes):
                    for j, m in enumerate(modes):
                        self.assertEqual(matrix[i][j], matrix[j][i])
                        self.assertEqual(matrix[i][j], matrix[index[-n]][index[-m]])
                        if n != m:
                            self.assertEqual(
                                (n - m) * matrix[i][j],
                                b_parameter(n) - b_parameter(m),
                            )

                comparison = [
                    F(4) if n == 0 else F(3) if abs(n) == 1 else F(0)
                    for n in modes
                ]
                image = matvec(matrix, comparison)
                for m in modes:
                    if abs(m) >= 2:
                        self.assertEqual(image[index[m]], 0)

                vector = comparison
                moments: list[Fraction] = []
                for _ in range(4):
                    moments.append(dot(comparison, vector) / 34)
                    vector = matvec(matrix, vector)
                self.assertEqual(
                    moments,
                    [F(1), F(130, 17), F(1046, 17), F(9244, 17)],
                )
                observed_moments.append(moments)
            self.assertEqual(observed_moments[0], observed_moments[1])

    def test_complete_pass_fail_signs_are_exact_for_growing_dimensions(self) -> None:
        for n_cutoff in (2, 3, 5, 8):
            pass_modes, pass_matrix = source_cauchy_matrix(n_cutoff, F(33, 4))
            fail_modes, fail_matrix = source_cauchy_matrix(n_cutoff, F(8))
            self.assertEqual(pass_modes, fail_modes)

            complement = [{0: F(-3), 1: F(2), -1: F(2)}]
            complement.extend(even_mode(n) for n in range(2, n_cutoff + 1))
            odd = [odd_mode(n) for n in range(1, n_cutoff + 1)]
            fail_transverse = odd[1:]

            self.assertTrue(
                q22_positive_definite(shifted_form(pass_modes, pass_matrix, complement))
            )
            self.assertTrue(
                q22_positive_definite(shifted_form(fail_modes, fail_matrix, complement))
            )
            self.assertTrue(q22_positive_definite(shifted_form(pass_modes, pass_matrix, odd)))
            self.assertFalse(q22_positive_definite(shifted_form(fail_modes, fail_matrix, odd)))
            self.assertTrue(
                q22_positive_definite(
                    shifted_form(fail_modes, fail_matrix, fail_transverse)
                )
            )

    def test_common_absolute_gram_and_flat_scaling_are_exact(self) -> None:
        for n_cutoff in (2, 4, 7):
            c_value = F(50000 * n_cutoff + 12 * n_cutoff + 20)
            matrices: list[list[list[Fraction]]] = []
            for a2 in (F(33, 4), F(8)):
                _, matrix = source_cauchy_matrix(n_cutoff, a2)
                matrices.append(matrix)
                plus = [
                    [
                        (c_value if i == j else F(0)) + matrix[i][j]
                        for j in range(len(matrix))
                    ]
                    for i in range(len(matrix))
                ]
                minus = [
                    [
                        (c_value if i == j else F(0)) - matrix[i][j]
                        for j in range(len(matrix))
                    ]
                    for i in range(len(matrix))
                ]
                self.assertTrue(fraction_ldl_positive(plus))
                self.assertTrue(fraction_ldl_positive(minus))

                sigma = F(1, (2 ** (n_cutoff * n_cutoff)) * c_value)
                self.assertEqual(sigma * c_value, F(1, 2 ** (n_cutoff * n_cutoff)))

            difference = [
                [matrices[0][i][j] - matrices[1][i][j] for j in range(len(matrices[0]))]
                for i in range(len(matrices[0]))
            ]
            nonzero = [
                (i, j, value)
                for i, row in enumerate(difference)
                for j, value in enumerate(row)
                if value
            ]
            self.assertEqual(len(nonzero), 2)
            self.assertEqual({value for _, _, value in nonzero}, {F(1, 4)})

    def test_relative_contraction_slack_identity_is_exact(self) -> None:
        # C=diag(3,5), E=diag(2,1).  The generalized defect eigenvalues are
        # 2/3 and 1/5, while C-E has generalized floor 1/3.
        generalized_defect = (F(2, 3), F(1, 5))
        generalized_signed = tuple(F(1) - value for value in generalized_defect)
        self.assertEqual(max(generalized_defect), F(2, 3))
        self.assertEqual(min(generalized_signed), F(1, 3))
        self.assertEqual(F(1) - max(generalized_defect), min(generalized_signed))

        # Crossing the first entry through C changes the two decisions on
        # exactly the same relative scale.
        eta = F(1, 7)
        defect_pass = (F(1) - eta, F(1, 5))
        defect_fail = (F(1) + eta, F(1, 5))
        self.assertEqual(F(1) - max(defect_pass), eta)
        self.assertEqual(F(1) - max(defect_fail), -eta)

    def test_zero_extension_step_flip_and_independent_translation_assembly(self) -> None:
        with mp.workdps(120):
            shift = mp.log(2)
            length = 8 * shift
            size = 4
            direct = odd_translation_matrix(size, length, shift)
            quadrature = odd_translation_matrix_by_quadrature(size, length, shift)
            assembly_error = max(
                abs(direct[i, j] - quadrature[i, j])
                for i in range(size)
                for j in range(size)
            )
            self.assertLess(assembly_error, mp.mpf("1e-105"))

            first_mode_value = direct[0, 0]
            expected_first_mode = (
                2 * (1 - shift / length) * mp.cos(2 * mp.pi * shift / length)
                + mp.sin(2 * mp.pi * shift / length) / mp.pi
            )
            self.assertLess(abs(first_mode_value - expected_first_mode), mp.mpf("1e-110"))
            self.assertGreater(first_mode_value, 1)

            eigenvalues = mp.eigsy(direct, eigvals_only=True)
            theta = eigenvalues[size - 1]
            self.assertGreater(theta, 1)
            self.assertLessEqual(theta, 2 + mp.mpf("1e-110"))

            gamma = mp.power(2, -200)
            eta = mp.mpf(1) / 3
            tau_pass = (1 - eta) * gamma / theta
            tau_fail = (1 + eta) * gamma / theta
            identity = mp.eye(size)
            b_pass = gamma * identity - tau_pass * direct
            b_fail = gamma * identity - tau_fail * direct
            pass_values = mp.eigsy(b_pass, eigvals_only=True)
            fail_values = mp.eigsy(b_fail, eigvals_only=True)

            self.assertLess(
                abs(pass_values[0] - eta * gamma) / gamma,
                mp.mpf("1e-105"),
            )
            self.assertLess(
                abs(fail_values[0] + eta * gamma) / gamma,
                mp.mpf("1e-105"),
            )

            discrepancy_difference = tau_fail - tau_pass
            self.assertLessEqual(discrepancy_difference, 2 * eta * gamma)
            operator_difference = max(
                abs(value) for value in mp.eigsy(b_fail - b_pass, eigvals_only=True)
            )
            self.assertLessEqual(operator_difference, 4 * eta * gamma)

            # The right-continuous step contributes
            # tau*(C(L)-C(h))=-tau*T.  The fixed-moment difference has the
            # exact elementary antiderivative recorded in the note.
            for degree in range(6):
                moment = discrepancy_difference * (
                    length ** (degree + 1) - shift ** (degree + 1)
                ) / (degree + 1)
                bound = 2 * eta * gamma * length ** (degree + 1) / (degree + 1)
                self.assertLessEqual(moment, bound)

            c_star = mp.digamma(mp.mpf(1) / 4) - mp.log(mp.pi) + 4
            live_shift = c_star - gamma
            common_scale = 10 + 2 * abs(live_shift)
            absolute_gram = (live_shift + common_scale) * identity
            signed_pass = live_shift * identity + b_pass
            signed_fail = live_shift * identity + b_fail
            for signed in (signed_pass, signed_fail):
                self.assertGreater(mp.eigsy(absolute_gram + signed, eigvals_only=True)[0], 0)
                self.assertGreater(mp.eigsy(absolute_gram - signed, eigvals_only=True)[0], 0)

            contraction_pass = identity - b_pass / common_scale
            contraction_fail = identity - b_fail / common_scale
            rho_pass = mp.eigsy(contraction_pass, eigvals_only=True)[size - 1]
            rho_fail = mp.eigsy(contraction_fail, eigvals_only=True)[size - 1]
            self.assertLess(
                abs(rho_pass - (1 - eta * gamma / common_scale)) / gamma,
                mp.mpf("1e-55"),
            )
            self.assertLess(
                abs(rho_fail - (1 + eta * gamma / common_scale)) / gamma,
                mp.mpf("1e-55"),
            )
            self.assertLess(rho_pass, 1)
            self.assertGreater(rho_fail, 1)


if __name__ == "__main__":
    unittest.main()
