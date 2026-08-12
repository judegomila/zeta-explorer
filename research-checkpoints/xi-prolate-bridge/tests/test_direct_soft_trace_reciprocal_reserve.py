from __future__ import annotations

import unittest
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "DIRECT_SOFT_TRACE_RECIPROCAL_RESERVE.md"

Matrix = tuple[tuple[Fraction, ...], ...]


def transpose(matrix: Matrix) -> Matrix:
    return tuple(
        tuple(matrix[i][j] for i in range(len(matrix)))
        for j in range(len(matrix[0]))
    )


def matmul(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(
            sum(
                (left[i][k] * right[k][j] for k in range(len(right))),
                Fraction(0),
            )
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


def inverse(matrix: Matrix) -> Matrix:
    size = len(matrix)
    identity = tuple(
        tuple(Fraction(i == j) for j in range(size)) for i in range(size)
    )
    work = [list(matrix[i] + identity[i]) for i in range(size)]
    for column in range(size):
        pivot = next(
            row for row in range(column, size) if work[row][column] != 0
        )
        work[column], work[pivot] = work[pivot], work[column]
        pivot_value = work[column][column]
        work[column] = [entry / pivot_value for entry in work[column]]
        for row in range(size):
            if row == column:
                continue
            multiplier = work[row][column]
            work[row] = [
                work[row][j] - multiplier * work[column][j]
                for j in range(2 * size)
            ]
    return tuple(tuple(row[size:]) for row in work)


def diagonal(*entries: Fraction | int) -> Matrix:
    return tuple(
        tuple(
            Fraction(entries[i]) if i == j else Fraction(0)
            for j in range(len(entries))
        )
        for i in range(len(entries))
    )


def trace(matrix: Matrix) -> Fraction:
    return sum((matrix[i][i] for i in range(len(matrix))), Fraction(0))


def add(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] + right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def scale(scalar: Fraction, matrix: Matrix) -> Matrix:
    return tuple(tuple(scalar * entry for entry in row) for row in matrix)


def observation_trace(
    observation: Matrix, resolvent: Matrix
) -> Fraction:
    return trace(matmul(matmul(observation, resolvent), transpose(observation)))


class DirectSoftTraceReciprocalReserveTests(unittest.TestCase):
    def test_claim_boundary_and_all_theorem_layers_are_explicit(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        for token in (
            "P0_INVALIDATED",
            "reciprocal crowding reserve",
            "bounded-reserve hypothesis",
            "shorted-inverse block lower bound",
            "raw coordinates",
            "\\mu(\\Omega)",
            "H(u)=\\int_{(u,\\infty)}",
            "\\mathcal S_r\\leq\\Phi(u)+rH(u)",
            "H(0)\\geq{c^2\\over\\varepsilon}",
            "does not prove a bounded actual-source reciprocal reserve",
            "either shifted-sector sign",
            "equation (5.2)",
            "locally uniform determinant convergence",
            "or the Riemann hypothesis",
            "Numerical agreement is not a theorem",
        ):
            self.assertIn(token, normalized)

        self.assertNotIn("assume every nontrivial zeta zero is real", text.lower())
        self.assertNotIn("global weil positivity holds", text.lower())

    def test_reciprocal_reserve_and_rank_one_lower_bound_are_exact(self) -> None:
        # Non-diagonal B, rank-one contraction K=A^*A, and omega=e1.
        b: Matrix = (
            (Fraction(2), Fraction(1)),
            (Fraction(1), Fraction(3)),
        )
        identity = diagonal(1, 1)
        residual = Fraction(1)
        observation: Matrix = ((Fraction(1, 3), Fraction(2, 3)),)
        k = matmul(transpose(observation), observation)
        resolvent = inverse(add(b, scale(residual, identity)))

        soft_trace = residual * trace(matmul(resolvent, k))
        epsilon = b[0][0]
        c_squared = k[0][0]
        rayleigh_lower = c_squared * residual / (epsilon + residual)
        reserve = (epsilon + residual) * trace(matmul(resolvent, k)) / c_squared

        self.assertEqual(soft_trace, Fraction(4, 33))
        self.assertEqual(rayleigh_lower, Fraction(1, 27))
        self.assertGreaterEqual(soft_trace, rayleigh_lower)
        self.assertEqual(reserve, Fraction(36, 11))
        self.assertEqual(soft_trace, rayleigh_lower * reserve)

    def test_short_block_lower_bound_and_raw_basis_invariance(self) -> None:
        b = diagonal(1, 2, 4)
        residual = Fraction(1)
        observation: Matrix = (
            (Fraction(1, 4), Fraction(1, 3), Fraction(1, 5)),
        )
        full_resolvent = diagonal(Fraction(1, 2), Fraction(1, 3), Fraction(1, 5))
        full_soft_trace = residual * observation_trace(observation, full_resolvent)

        # Raw synthesis spans e1,e2 but uses a nonorthonormal basis.
        synthesis: Matrix = (
            (Fraction(2), Fraction(1)),
            (Fraction(0), Fraction(1)),
            (Fraction(0), Fraction(0)),
        )
        gram = matmul(transpose(synthesis), synthesis)
        raw_energy = matmul(matmul(transpose(synthesis), b), synthesis)
        raw_observation = matmul(observation, synthesis)
        raw_denominator = add(raw_energy, scale(residual, gram))
        raw_block = residual * observation_trace(
            raw_observation, inverse(raw_denominator)
        )

        orthonormal_block = Fraction(1, 4) ** 2 / 2 + Fraction(1, 3) ** 2 / 3
        self.assertEqual(raw_block, orthonormal_block)
        self.assertLess(raw_block, full_soft_trace)

        # A second nonsingular raw change leaves the scalar fixed.
        change: Matrix = (
            (Fraction(1), Fraction(2)),
            (Fraction(1), Fraction(3)),
        )
        changed = matmul(synthesis, change)
        changed_gram = matmul(transpose(changed), changed)
        changed_energy = matmul(matmul(transpose(changed), b), changed)
        changed_observation = matmul(observation, changed)
        changed_denominator = add(
            changed_energy, scale(residual, changed_gram)
        )
        changed_block = residual * observation_trace(
            changed_observation, inverse(changed_denominator)
        )
        self.assertEqual(changed_block, raw_block)

    def test_tail_measure_upper_bound_and_transverse_obstruction(self) -> None:
        # B=diag(1,4), A=diag(3/5,4/5), u=1, omega=e2.
        # All square roots appearing in the obstruction are rational.
        residual = Fraction(1, 2)
        weights = (Fraction(9, 25), Fraction(16, 25))
        eigenvalues = (Fraction(1), Fraction(4))
        threshold = Fraction(1)

        soft_trace = sum(
            (
                residual * weight / (eigenvalue + residual)
                for weight, eigenvalue in zip(weights, eigenvalues)
            ),
            Fraction(0),
        )
        phi = sum(
            (
                weight
                for weight, eigenvalue in zip(weights, eigenvalues)
                if eigenvalue <= threshold
            ),
            Fraction(0),
        )
        reciprocal_tail = sum(
            (
                weight / eigenvalue
                for weight, eigenvalue in zip(weights, eigenvalues)
                if eigenvalue > threshold
            ),
            Fraction(0),
        )

        c = Fraction(4, 5)
        sqrt_phi = Fraction(3, 5)
        epsilon = Fraction(4)
        obstruction = (c - sqrt_phi) ** 2 / epsilon

        self.assertEqual(phi, Fraction(9, 25))
        self.assertEqual(reciprocal_tail, Fraction(4, 25))
        self.assertLessEqual(soft_trace, phi + residual * reciprocal_tail)
        self.assertEqual(obstruction, Fraction(1, 100))
        self.assertGreaterEqual(reciprocal_tail, obstruction)

        h_zero = sum(
            (weight / eigenvalue for weight, eigenvalue in zip(weights, eigenvalues)),
            Fraction(0),
        )
        self.assertEqual(h_zero, Fraction(13, 25))
        self.assertGreaterEqual(h_zero, c * c / epsilon)

    def test_polynomial_diagonal_family_has_matched_tail_scale(self) -> None:
        for n in (2, 3, 5, 8, 16, 32):
            residual = Fraction(1, n * n)
            soft_trace = Fraction(1, n * n + 1) + Fraction(n - 1, n**3 + 1)
            expected = residual / (1 + residual) + (n - 1) * residual / (
                n + residual
            )
            self.assertEqual(soft_trace, expected)

            # Exact rational substitute for n^(3/2) S -> 0:
            # n^3 S^2 < 4/n.
            self.assertLess(n**3 * soft_trace**2, Fraction(4, n))

            phi = Fraction(0)
            reciprocal_tail = Fraction(1) + Fraction(n - 1, n)
            self.assertEqual(reciprocal_tail, Fraction(2) - Fraction(1, n))
            self.assertLessEqual(soft_trace, phi + residual * reciprocal_tail)

            # The old n^(-5/2) ratio demand fails: its squared scaled
            # quantity is exactly n.
            ratio = residual  # epsilon=1
            self.assertEqual(n**5 * ratio**2, n)

            reserve = (1 + residual) * soft_trace / residual
            self.assertGreaterEqual(reserve, 1)
            self.assertLess(reserve, 2)

    def test_every_total_trace_threshold_fails_in_polynomial_family(self) -> None:
        for n in (2, 3, 5, 8, 16, 32):
            residual = Fraction(1, n * n)
            infimum = Fraction(n, n * n + 1)

            # The square of n^(3/2) times the infimum diverges at least
            # linearly.  This exact inequality represents all u>0 via the
            # three spectral regions proved in the note.
            scaled_square = n**3 * infimum**2
            self.assertGreaterEqual(scaled_square, Fraction(n, 4))

            threshold = Fraction(1, 2)
            threshold_factor = residual / (threshold + residual)
            bound_at_half = threshold_factor * n
            self.assertEqual(bound_at_half, Fraction(2 * n, n * n + 2))
            self.assertGreater(bound_at_half, infimum)

    def test_dyadic_family_is_exact_and_has_bounded_reserve(self) -> None:
        for n in (2, 3, 5, 8, 16, 32):
            epsilon = Fraction(1, 2**n)
            residual = epsilon / (n * n)
            soft_trace = Fraction(1, n * n + 1) + (n - 1) * residual / (
                1 + residual
            )

            self.assertLess(n**3 * soft_trace**2, Fraction(4, n))
            self.assertEqual(residual / epsilon, Fraction(1, n * n))

            reserve = (epsilon + residual) * soft_trace / residual
            self.assertGreaterEqual(reserve, 1)
            self.assertLess(reserve, 2)

            total_threshold_infimum = Fraction(n, n * n + 1)
            self.assertGreaterEqual(
                n**3 * total_threshold_infimum**2, Fraction(n, 4)
            )

    def test_two_by_two_feshbach_identities_are_exact(self) -> None:
        b: Matrix = (
            (Fraction(2), Fraction(1)),
            (Fraction(1), Fraction(3)),
        )
        observation: Matrix = ((Fraction(1, 3), Fraction(2, 3)),)
        identity = diagonal(1, 1)

        regularized = observation_trace(observation, inverse(add(b, identity)))
        regularized_high = Fraction(1, 9)
        regularized_low = Fraction(1, 99)
        self.assertEqual(regularized, Fraction(4, 33))
        self.assertEqual(regularized, regularized_low + regularized_high)

        unregularized = observation_trace(observation, inverse(b))
        unregularized_high = Fraction(4, 27)
        unregularized_low = Fraction(1, 135)
        self.assertEqual(unregularized, Fraction(7, 45))
        self.assertEqual(unregularized, unregularized_low + unregularized_high)


if __name__ == "__main__":
    unittest.main()
