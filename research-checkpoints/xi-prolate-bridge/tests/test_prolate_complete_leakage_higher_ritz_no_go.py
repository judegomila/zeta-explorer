from __future__ import annotations

from fractions import Fraction as F
import unittest


Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]


def dot(left: Vector, right: Vector) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


def transpose(matrix: Matrix) -> Matrix:
    return tuple(
        tuple(matrix[i][j] for i in range(len(matrix)))
        for j in range(len(matrix[0]))
    )


def determinant(matrix: Matrix) -> F:
    work = [list(row) for row in matrix]
    result = F(1)
    for column in range(len(work)):
        pivot = next(
            (row for row in range(column, len(work)) if work[row][column]),
            None,
        )
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        pivot_value = work[column][column]
        result *= pivot_value
        work[column] = [entry / pivot_value for entry in work[column]]
        for row in range(column + 1, len(work)):
            factor = work[row][column]
            work[row] = [
                entry - factor * pivot_entry
                for entry, pivot_entry in zip(work[row], work[column])
            ]
    return result


def restrict_form(form: Matrix, columns: tuple[Vector, ...]) -> Matrix:
    return tuple(
        tuple(dot(left, matvec(form, right)) for right in columns)
        for left in columns
    )


def shifted(matrix: Matrix, shift: F) -> Matrix:
    return tuple(
        tuple(
            entry - (shift if i == j else F(0))
            for j, entry in enumerate(row)
        )
        for i, row in enumerate(matrix)
    )


def u3_coefficients(a_squared: F, sigma: tuple[F, F, F, F]) -> tuple[F, ...]:
    sigma_0, sigma_1, sigma_2, sigma_3 = sigma
    delta = sigma_0 * sigma_2 - sigma_1 * sigma_1
    d_0 = sigma_1 * sigma_3 - sigma_2 * sigma_2
    d_1 = sigma_0 * sigma_3 - sigma_1 * sigma_2
    gamma = (
        sigma_0 * sigma_0 * sigma_3
        - 2 * sigma_0 * sigma_1 * sigma_2
        + sigma_1**3
    )
    return (
        a_squared * delta,
        a_squared * d_1,
        a_squared * d_0 - sigma_0 * delta,
        -gamma,
    )


def evaluate_cubic(coefficients: tuple[F, ...], value: F) -> F:
    a, b, c, d = coefficients
    return ((a * value + b) * value + c) * value + d


class ProlateCompleteLeakageHigherRitzNoGoTests(unittest.TestCase):
    def setUp(self) -> None:
        self.q_matrix: Matrix = (
            (F(2), F(1), F(-1), F(2)),
            (F(1), F(4), F(1), F(0)),
            (F(-1), F(1), F(3), F(1)),
            (F(2), F(0), F(1), F(5)),
        )
        self.p: Vector = (F(3), F(0), F(0), F(0))
        self.a_squared = dot(self.p, self.p)

    def test_complete_leakage_reconstructs_unnormalized_hankel_pencil(self) -> None:
        q_p = matvec(self.q_matrix, self.p)
        ell_r = tuple(-entry for entry in q_p)

        powers = [self.p]
        for _ in range(5):
            powers.append(matvec(self.q_matrix, powers[-1]))
        moments = tuple(dot(self.p, vector) for vector in powers)
        self.assertEqual(
            moments,
            (F(9), F(18), F(90), F(477), F(2682), F(15705)),
        )

        self.assertEqual(moments[0], self.a_squared)
        ell_power = ell_r
        for j in range(2, 6):
            self.assertEqual(moments[j], dot(ell_r, ell_power))
            ell_power = matvec(self.q_matrix, ell_power)

        krylov = tuple(powers[:3])
        gram = restrict_form(
            tuple(
                tuple(F(int(i == j)) for j in range(4))
                for i in range(4)
            ),
            krylov,
        )
        form = restrict_form(self.q_matrix, krylov)
        self.assertEqual(
            gram,
            tuple(tuple(moments[i + j] for j in range(3)) for i in range(3)),
        )
        self.assertEqual(
            form,
            tuple(
                tuple(moments[i + j + 1] for j in range(3))
                for i in range(3)
            ),
        )

    def test_source_blocks_cancel_before_the_leakage_moment_is_formed(self) -> None:
        large_diagonal: Matrix = tuple(
            tuple(F(100) if i == j else F(0) for j in range(4))
            for i in range(4)
        )
        arch = large_diagonal
        prime = large_diagonal
        pole: Matrix = tuple(
            tuple(
                self.q_matrix[i][j] + 2 * large_diagonal[i][j]
                for j in range(4)
            )
            for i in range(4)
        )

        combined = tuple(
            tuple(
                pole[i][j] - arch[i][j] - prime[i][j]
                for j in range(4)
            )
            for i in range(4)
        )
        self.assertEqual(combined, self.q_matrix)

        ell_pole = tuple(-entry for entry in matvec(pole, self.p))
        ell_arch = tuple(-entry for entry in matvec(arch, self.p))
        ell_prime = tuple(-entry for entry in matvec(prime, self.p))
        ell_combined = tuple(
            left - middle - right
            for left, middle, right in zip(ell_pole, ell_arch, ell_prime)
        )
        self.assertEqual(
            ell_combined,
            tuple(-entry for entry in matvec(combined, self.p)),
        )
        self.assertEqual(dot(ell_combined, ell_combined), F(90))
        self.assertEqual(
            dot(ell_pole, ell_pole)
            + dot(ell_arch, ell_arch)
            + dot(ell_prime, ell_prime),
            F(547290),
        )

    def test_raw_centered_feshbach_block_matches_direct_form_for_fixed_m(self) -> None:
        q = dot(self.p, matvec(self.q_matrix, self.p)) / self.a_squared
        centered = shifted(self.q_matrix, q)
        g = matvec(centered, self.p)
        self.assertEqual(g, (F(0), F(3), F(-3), F(6)))

        complement: Matrix = tuple(
            tuple(centered[i][j] for j in range(1, 4))
            for i in range(1, 4)
        )

        complement_powers: list[Vector] = [g]
        for _ in range(2):
            tail = matvec(complement, complement_powers[-1][1:])
            complement_powers.append((F(0),) + tail)

        sigma: list[F] = []
        tail_power = g[1:]
        for _ in range(6):
            sigma.append(dot(g[1:], tail_power))
            tail_power = matvec(complement, tail_power)

        self.assertEqual(tuple(sigma[:4]), (F(54), F(81), F(270), F(945)))

        for m in (2, 3, 4):
            t = F(5, 7)
            basis = (self.p,) + tuple(complement_powers[: m - 1])
            direct = restrict_form(shifted(self.q_matrix, q - t), basis)
            predicted = tuple(
                tuple(
                    self.a_squared * t
                    if i == 0 and j == 0
                    else sigma[j - 1]
                    if i == 0
                    else sigma[i - 1]
                    if j == 0
                    else sigma[i + j - 1] + t * sigma[i + j - 2]
                    for j in range(m)
                )
                for i in range(m)
            )
            self.assertEqual(direct, predicted)

    def test_u3_cubic_and_projection_subtractions_are_exact(self) -> None:
        q = F(2)
        centered = shifted(self.q_matrix, q)
        centered_powers = [self.p]
        for _ in range(5):
            centered_powers.append(matvec(centered, centered_powers[-1]))
        centered_moments = tuple(dot(self.p, vector) for vector in centered_powers)
        self.assertEqual(
            centered_moments,
            (F(9), F(0), F(54), F(81), F(594), F(1917)),
        )

        sigma = (
            centered_moments[2],
            centered_moments[3],
            centered_moments[4] - centered_moments[2] ** 2 / self.a_squared,
            centered_moments[5]
            - 2
            * centered_moments[2]
            * centered_moments[3]
            / self.a_squared,
        )
        self.assertEqual(sigma, (F(54), F(81), F(270), F(945)))
        self.assertGreater(sigma[0] * sigma[2] - sigma[1] ** 2, 0)

        coefficients = u3_coefficients(self.a_squared, sigma)
        self.assertEqual(
            coefficients,
            (F(72171), F(262440), F(-400221), F(-925101)),
        )

        for t in (F(-1), F(0), F(1), F(2), F(3), F(11, 7)):
            raw_feshbach = (
                (self.a_squared * t, sigma[0], sigma[1]),
                (
                    sigma[0],
                    sigma[1] + t * sigma[0],
                    sigma[2] + t * sigma[1],
                ),
                (
                    sigma[1],
                    sigma[2] + t * sigma[1],
                    sigma[3] + t * sigma[2],
                ),
            )
            self.assertEqual(
                determinant(raw_feshbach),
                evaluate_cubic(coefficients, t),
            )

    def test_flat_counterfamilies_reverse_the_relative_shift_scale(self) -> None:
        # A=diag(1,2,3), g=epsilon*(1,1,1).  The first two complement
        # Krylov vectors are independent because Delta=6*epsilon^4.
        def data(epsilon: F) -> tuple[F, tuple[F, ...]]:
            sigma = tuple(
                epsilon * epsilon * sum(F(k**j) for k in (1, 2, 3))
                for j in range(4)
            )
            return sigma[0], u3_coefficients(F(1), sigma)

        for x in (F(1, 10), F(1, 100)):
            delta = x**3

            # Fast even leakage: t_3 <= r^2 < delta, so a negative odd
            # near-null direction is not cleared by the Ritz shift.
            r2_fast, polynomial_fast = data(x**2)
            lower_fast = r2_fast / (F(3) + r2_fast)
            upper_fast = r2_fast
            self.assertLess(evaluate_cubic(polynomial_fast, lower_fast), 0)
            self.assertGreater(evaluate_cubic(polynomial_fast, upper_fast), 0)
            self.assertLess(upper_fast, delta)

            # Slower even leakage: t_3 >= r^2/(3+r^2) > delta, so the same
            # signed odd scale is cleared.  All comparisons are rational.
            r2_slow, polynomial_slow = data(x)
            lower_slow = r2_slow / (F(3) + r2_slow)
            upper_slow = r2_slow
            self.assertLess(evaluate_cubic(polynomial_slow, lower_slow), 0)
            self.assertGreater(evaluate_cubic(polynomial_slow, upper_slow), 0)
            self.assertGreater(lower_slow, delta)

        x_1 = F(1, 10)
        x_2 = F(1, 100)
        fast_ratio_bound_1 = 3 * x_1
        fast_ratio_bound_2 = 3 * x_2
        slow_ratio_bound_1 = 1 / (x_1 * (1 + x_1 * x_1))
        slow_ratio_bound_2 = 1 / (x_2 * (1 + x_2 * x_2))
        self.assertGreater(fast_ratio_bound_1, fast_ratio_bound_2)
        self.assertLess(slow_ratio_bound_1, slow_ratio_bound_2)


if __name__ == "__main__":
    unittest.main()
