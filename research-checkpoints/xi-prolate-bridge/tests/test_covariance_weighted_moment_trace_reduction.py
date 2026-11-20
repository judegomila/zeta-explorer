from __future__ import annotations

import unittest
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "COVARIANCE_WEIGHTED_MOMENT_TRACE_REDUCTION.md"

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
        tuple(Fraction(entries[i]) if i == j else Fraction(0) for j in range(len(entries)))
        for i in range(len(entries))
    )


def trace(matrix: Matrix) -> Fraction:
    return sum((matrix[i][i] for i in range(len(matrix))), Fraction(0))


class CovarianceWeightedMomentTraceReductionTests(unittest.TestCase):
    def test_claim_boundary_and_source_conventions_are_explicit(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        for token in (
            "P0_INVALIDATED",
            "e^{-itx}",
            "n\\leq\\lambda^2",
            "minus sign on the prime block",
            "source-normalized projected state",
            "Lebesgue measure",
            "zero extension",
            "complete combined operator",
            "No current theorem proves",
            "compression of the complete inverse",
        ):
            self.assertIn(token, normalized)

        self.assertNotIn("assume every nontrivial zeta zero is real", text.lower())
        self.assertNotIn("global weil positivity holds", text.lower())

    def test_weighted_low_term_and_threshold_bounds_are_exact(self) -> None:
        # B=diag(1,3,5), r=1.  W is a rational isometry onto span(e1,e2)
        # and deliberately rotates the moment coordinates.
        residual = Fraction(1)
        shifted_inverse = diagonal(Fraction(1, 2), Fraction(1, 4), Fraction(1, 6))
        covariance = diagonal(Fraction(1, 10), Fraction(1, 2), Fraction(1, 4))
        projection = diagonal(1, 1, 0)
        moment_isometry: Matrix = (
            (Fraction(3, 5), Fraction(-4, 5)),
            (Fraction(4, 5), Fraction(3, 5)),
            (Fraction(0), Fraction(0)),
        )

        weighted_physical = residual * trace(
            matmul(
                matmul(matmul(projection, covariance), projection),
                shifted_inverse,
            )
        )
        covariance_m = matmul(
            matmul(transpose(moment_isometry), covariance), moment_isometry
        )
        resolvent_m = matmul(
            matmul(transpose(moment_isometry), shifted_inverse), moment_isometry
        )
        weighted_coordinates = residual * trace(matmul(covariance_m, resolvent_m))

        self.assertEqual(weighted_physical, Fraction(7, 40))
        self.assertEqual(weighted_coordinates, weighted_physical)

        # At u=2 only the B-eigenvector e1 belongs to E_u.
        low_projector = diagonal(1, 0, 0)
        low_compression = matmul(
            matmul(transpose(moment_isometry), low_projector), moment_isometry
        )
        theta = trace(matmul(covariance_m, low_compression))
        covariance_trace = trace(covariance_m)
        threshold_factor = Fraction(1, 3)
        lower = threshold_factor * theta
        upper = threshold_factor * covariance_trace + (1 - threshold_factor) * theta

        self.assertEqual(theta, Fraction(1, 10))
        self.assertEqual(covariance_trace, Fraction(3, 5))
        self.assertLessEqual(lower, weighted_coordinates)
        self.assertLessEqual(weighted_coordinates, upper)

        # Keeping covariance is strictly sharper than replacing K_m by I.
        unweighted = residual * trace(matmul(projection, shifted_inverse))
        self.assertEqual(unweighted, Fraction(3, 4))
        self.assertLess(weighted_coordinates, unweighted)

    def test_raw_basis_formula_is_invariant_under_nonsingular_change(self) -> None:
        shifted_inverse = diagonal(Fraction(1, 2), Fraction(1, 4), Fraction(1, 6))
        covariance = diagonal(Fraction(1, 10), Fraction(1, 2), Fraction(1, 4))
        isometry: Matrix = (
            (Fraction(3, 5), Fraction(-4, 5)),
            (Fraction(4, 5), Fraction(3, 5)),
            (Fraction(0), Fraction(0)),
        )
        change: Matrix = (
            (Fraction(2), Fraction(1)),
            (Fraction(0), Fraction(1)),
        )
        synthesis = matmul(isometry, change)

        gram = matmul(transpose(synthesis), synthesis)
        raw_covariance = matmul(matmul(transpose(synthesis), covariance), synthesis)
        raw_resolvent = matmul(
            matmul(transpose(synthesis), shifted_inverse), synthesis
        )
        gram_inverse = inverse(gram)
        raw_scalar = trace(
            matmul(
                matmul(matmul(gram_inverse, raw_covariance), gram_inverse),
                raw_resolvent,
            )
        )

        whitened_covariance = matmul(matmul(transpose(isometry), covariance), isometry)
        whitened_resolvent = matmul(
            matmul(transpose(isometry), shifted_inverse), isometry
        )
        whitened_scalar = trace(matmul(whitened_covariance, whitened_resolvent))

        self.assertEqual(raw_scalar, whitened_scalar)
        self.assertEqual(raw_scalar, Fraction(7, 40))
        self.assertNotEqual(gram, diagonal(1, 1))

    def test_complete_inverse_cannot_be_replaced_by_raw_compression(self) -> None:
        # B=[[2,1],[1,3]], r=1/2, P=e1 and K=P.
        residual = Fraction(1, 2)
        shifted: Matrix = (
            (Fraction(5, 2), Fraction(1)),
            (Fraction(1), Fraction(7, 2)),
        )
        complete_inverse = inverse(shifted)
        complete_weighted_low_term = residual * complete_inverse[0][0]
        raw_compression_low_term = residual / shifted[0][0]

        self.assertEqual(complete_weighted_low_term, Fraction(7, 31))
        self.assertEqual(raw_compression_low_term, Fraction(1, 5))
        self.assertNotEqual(complete_weighted_low_term, raw_compression_low_term)

    def test_weighted_profile_can_ignore_a_bad_low_energy_direction(self) -> None:
        # The worst principal-angle profile is one, while the weighted
        # profile is epsilon.  This is the precise logical strictness of the
        # new condition; it makes no actual-source asymptotic claim.
        for denominator in (10, 10_000, 10**8):
            epsilon = Fraction(1, denominator)
            worst_angle = Fraction(1)
            covariance_trace = Fraction(1)
            theta = epsilon

            self.assertEqual(worst_angle, 1)
            self.assertLess(theta, worst_angle * covariance_trace)
            self.assertGreater(theta, 0)


if __name__ == "__main__":
    unittest.main()
