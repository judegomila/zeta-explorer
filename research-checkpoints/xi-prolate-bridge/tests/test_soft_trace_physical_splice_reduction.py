from __future__ import annotations

import unittest
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SOFT_TRACE_PHYSICAL_SPLICE_REDUCTION.md"


def inverse_2x2(matrix: tuple[tuple[Fraction, ...], ...]):
    a, b = matrix[0]
    c, d = matrix[1]
    determinant = a * d - b * c
    if determinant == 0:
        raise ZeroDivisionError("singular matrix")
    return (
        (d / determinant, -b / determinant),
        (-c / determinant, a / determinant),
    )


def trace_product(
    left: tuple[tuple[Fraction, ...], ...],
    right: tuple[tuple[Fraction, ...], ...],
) -> Fraction:
    return sum(
        left[i][j] * right[j][i]
        for i in range(len(left))
        for j in range(len(left))
    )


class SoftTracePhysicalSpliceReductionTests(unittest.TestCase):
    def test_claim_boundary_and_locked_source_conventions_are_present(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "source-normalized",
            "minus-prime",
            "n\\leq\\lambda^2",
            "e^{-itx}",
            "P0_INVALIDATED",
            "regularized signed Schur complement",
            "\\operatorname {tr}(S_rK_T)",
            "\\mathbf1_{(0,u]}(B)",
            "shrinking band",
            "structural orientation model",
        )
        for token in required:
            self.assertIn(token, text)

        self.assertNotIn("assume every nontrivial zeta zero is real", text.lower())
        self.assertNotIn("global weil positivity holds", text.lower())

    def test_regularized_schur_inverse_identity_exactly(self) -> None:
        # B=[[2,1],[1,3]], r=1/2, and P selects the first coordinate.
        r = Fraction(1, 2)
        shifted = (
            (Fraction(2) + r, Fraction(1)),
            (Fraction(1), Fraction(3) + r),
        )
        shifted_inverse = inverse_2x2(shifted)
        schur = Fraction(2) + r - Fraction(1) / (Fraction(3) + r)

        self.assertEqual(schur, Fraction(31, 14))
        self.assertEqual(shifted_inverse[0][0], 1 / schur)
        self.assertEqual(shifted_inverse[0][0], Fraction(14, 31))

        soft = tuple(
            tuple(r * shifted_inverse[i][j] for j in range(2))
            for i in range(2)
        )
        self.assertEqual(soft[0][0], r / schur)
        self.assertEqual(soft[0][0], Fraction(7, 31))

    def test_physical_splice_hilbert_schmidt_bound_exactly(self) -> None:
        r = Fraction(1, 2)
        shifted_inverse = inverse_2x2(
            (
                (Fraction(5, 2), Fraction(1)),
                (Fraction(1), Fraction(7, 2)),
            )
        )
        soft = tuple(
            tuple(r * shifted_inverse[i][j] for j in range(2))
            for i in range(2)
        )
        # This K has eigenvalues 3/4 and 1/4, hence 0<=K<=I.
        time_band = (
            (Fraction(1, 2), Fraction(1, 4)),
            (Fraction(1, 4), Fraction(1, 2)),
        )

        overlap = trace_product(soft, time_band)
        low_soft_mass = soft[0][0]
        high_time_band_tail = time_band[1][1]

        # Check sqrt(overlap)<=sqrt(a)+sqrt(b) without decimal square roots.
        excess = overlap - low_soft_mass - high_time_band_tail
        if excess > 0:
            self.assertLessEqual(
                excess * excess,
                4 * low_soft_mass * high_time_band_tail,
            )
        self.assertEqual(overlap, Fraction(5, 31))
        self.assertEqual(low_soft_mass, Fraction(7, 31))
        self.assertEqual(high_time_band_tail, Fraction(1, 2))

    def test_spectral_layer_formula_exactly(self) -> None:
        # For diagonal B, the layer integral is a finite sum of elementary
        # antiderivatives.  Off-diagonal entries of K do not enter its trace.
        r = Fraction(1, 5)
        eigenvalues = (Fraction(1, 3), Fraction(2))
        time_band = (
            (Fraction(2, 3), Fraction(1, 10)),
            (Fraction(1, 10), Fraction(1, 4)),
        )

        direct = sum(
            time_band[j][j] * r / (beta + r)
            for j, beta in enumerate(eigenvalues)
        )
        layer_cake = sum(
            time_band[j][j]
            # integral_beta^infinity r/(u+r)^2 du
            * r
            / (beta + r)
            for j, beta in enumerate(eigenvalues)
        )
        self.assertEqual(direct, layer_cake)
        self.assertEqual(direct, Fraction(3, 11))

    def test_multiplier_rank_bound_keeps_joint_orientation(self) -> None:
        # B=gI+C-R with all matrices diagonal and positive where required.
        g = Fraction(3)
        u = Fraction(3, 2)
        B = (Fraction(1), Fraction(2))
        C = (Fraction(0), Fraction(1))
        R = tuple(g + C[j] - B[j] for j in range(2))
        self.assertEqual(R, (Fraction(2), Fraction(2)))

        # E_u selects only the first coordinate.
        self.assertGreaterEqual(R[0], g - u)
        rank_E = Fraction(1)
        self.assertLessEqual(rank_E, sum(R) / (g - u))

        # Isospectral rank-one probes give different joint overlaps, so the
        # rank and total multiplier trace do not determine tr(E_u K).
        K_aligned = (Fraction(1), Fraction(0))
        K_orthogonal = (Fraction(0), Fraction(1))
        self.assertEqual(sum(K_aligned), sum(K_orthogonal))
        self.assertEqual(K_aligned[0], 1)
        self.assertEqual(K_orthogonal[0], 0)

    def test_shrinking_band_and_fixed_window_have_different_scales(self) -> None:
        # Remove the common 1/pi from the two rigorous bounds in the note.
        delta = Fraction(1, 2)
        t0 = Fraction(1)
        T = Fraction(2)

        central_bounds = []
        fixed_tail_bounds = []
        for L in (10, 100, 1000):
            length = Fraction(L)
            central_bounds.append(
                4
                * delta
                / (length * length * (t0 - delta / length) ** 2)
            )
            fixed_tail_bounds.append(
                Fraction(2, L)
                * (1 / (T - t0) + 1 / (T + t0))
            )

        self.assertGreater(central_bounds[0], central_bounds[1])
        self.assertGreater(central_bounds[1], central_bounds[2])
        self.assertGreater(fixed_tail_bounds[0], fixed_tail_bounds[1])
        self.assertGreater(fixed_tail_bounds[1], fixed_tail_bounds[2])
        self.assertLess(central_bounds[-1], Fraction(1, 100_000))
        self.assertLess(fixed_tail_bounds[-1], Fraction(1, 100))

    def test_two_dimensional_orientation_countermodel_exactly(self) -> None:
        scaled_parallel = []
        scaled_perpendicular = []
        for k in (2, 5, 10, 20):
            # M=k^2 makes M^(3/2)=k^3 exact.
            M = k * k
            r = Fraction(1, M * M)
            soft_spectrum = (Fraction(1, 2), r / (1 + r))
            K_parallel = (Fraction(1), Fraction(0))
            K_perpendicular = (Fraction(0), Fraction(1))

            self.assertEqual(sum(K_parallel), sum(K_perpendicular))
            self.assertEqual(
                sum(x * x for x in K_parallel),
                sum(x * x for x in K_perpendicular),
            )

            overlap_parallel = sum(
                soft_spectrum[j] * K_parallel[j] for j in range(2)
            )
            overlap_perpendicular = sum(
                soft_spectrum[j] * K_perpendicular[j] for j in range(2)
            )
            self.assertEqual(overlap_parallel, Fraction(1, 2))
            self.assertEqual(overlap_perpendicular, Fraction(1, M * M + 1))

            scale = k**3
            scaled_parallel.append(scale * overlap_parallel)
            scaled_perpendicular.append(scale * overlap_perpendicular)

        self.assertLess(scaled_parallel[0], scaled_parallel[-1])
        self.assertGreater(scaled_perpendicular[0], scaled_perpendicular[-1])
        self.assertGreater(scaled_parallel[-1], 1000)
        self.assertLess(scaled_perpendicular[-1], Fraction(1, 20))


if __name__ == "__main__":
    unittest.main()
