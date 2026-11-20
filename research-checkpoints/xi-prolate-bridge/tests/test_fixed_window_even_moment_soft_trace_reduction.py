from __future__ import annotations

import math
import unittest
from decimal import Decimal, localcontext
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FIXED_WINDOW_EVEN_MOMENT_SOFT_TRACE_REDUCTION.md"


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


class FixedWindowEvenMomentSoftTraceReductionTests(unittest.TestCase):
    def test_claim_boundary_and_source_locks_are_explicit(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        required = (
            "source-normalized",
            "minus sign on the prime block",
            "n\\leq\\lambda^2",
            "e^{-itx}",
            "zero-extension convention",
            "P0_INVALIDATED",
            "complete Schur complement",
            "even physical moments",
            "finite prolate eigenvectors",
            "No current estimate proves",
        )
        for token in required:
            self.assertIn(token, normalized)

        self.assertNotIn("assume every nontrivial zeta zero is real", text.lower())
        self.assertNotIn("global weil positivity holds", text.lower())

    def test_even_moment_projection_annihilates_taylor_map_exactly(self) -> None:
        # Symmetric samples at x=-2,-1,0,1,2.  The even vector below is
        # orthogonal to both 1 and x^2, so the m=2 cosine Taylor map vanishes.
        xs = tuple(Fraction(x) for x in (-2, -1, 0, 1, 2))
        h = tuple(Fraction(x) for x in (1, -4, 6, -4, 1))

        zeroth_moment = sum(h)
        second_moment = sum(hj * xj**2 for hj, xj in zip(h, xs))
        self.assertEqual(zeroth_moment, 0)
        self.assertEqual(second_moment, 0)

        for t in (Fraction(-3, 2), Fraction(1, 3), Fraction(7, 4)):
            truncated_cosine_action = sum(
                hj * (1 - (t * xj) ** 2 / 2)
                for hj, xj in zip(h, xs)
            )
            self.assertEqual(truncated_cosine_action, 0)

    def test_integrated_factorial_tail_constant_is_exact(self) -> None:
        # Compare the rational coefficient of 1/pi on the two sides of (2.8).
        L = Fraction(6)
        T = Fraction(2)
        m = 2
        factorial = Fraction(math.factorial(2 * m))

        x_integral = L * (L / 2) ** (4 * m) / (4 * m + 1)
        pi_times_t_integral = T ** (4 * m + 1) / (4 * m + 1)
        integrated_remainder = (
            x_integral * pi_times_t_integral / factorial**2
        )

        displayed_bound = (
            L
            * T
            * (L * T / 2) ** (4 * m)
            / ((4 * m + 1) ** 2 * factorial**2)
        )
        self.assertEqual(integrated_remainder, displayed_bound)

    def test_explicit_factorial_rate_uses_no_binary64_inputs(self) -> None:
        with localcontext() as ctx:
            ctx.prec = 100
            e = Decimal(1).exp()
            for L_int, T_int in ((8, 1), (12, 2), (30, 1)):
                L = Decimal(L_int)
                T = Decimal(T_int)
                m = math.ceil(L_int * T_int)
                factorial = Decimal(math.factorial(2 * m))

                exact_ratio = (L * T / 2) ** (2 * m) / factorial
                coarse_ratio = (e / 4) ** (2 * m)
                self.assertLessEqual(exact_ratio, coarse_ratio)

                exact_tail_without_pi = (
                    L
                    * T
                    * exact_ratio**2
                    / Decimal((4 * m + 1) ** 2)
                )
                displayed_without_pi = (
                    L
                    * T
                    * (e / 4) ** (4 * m)
                    / Decimal((4 * m + 1) ** 2)
                )
                self.assertLessEqual(exact_tail_without_pi, displayed_without_pi)

    def test_top_spectral_cutoff_beats_an_arbitrary_rank_one_cutoff(self) -> None:
        # Exact Ky Fan regression for K=diag(9/10,1/2,1/10).
        eigenvalues = (Fraction(9, 10), Fraction(1, 2), Fraction(1, 10))
        top_rank_one_tail = sum(eigenvalues[1:])

        # The arbitrary rank-one vector (e1+e2)/sqrt(2) captures the exact
        # Rayleigh quotient (lambda1+lambda2)/2.
        arbitrary_capture = (eigenvalues[0] + eigenvalues[1]) / 2
        arbitrary_tail = sum(eigenvalues) - arbitrary_capture

        self.assertEqual(top_rank_one_tail, Fraction(3, 5))
        self.assertEqual(arbitrary_tail, Fraction(4, 5))
        self.assertLess(top_rank_one_tail, arbitrary_tail)

    def test_complete_regularized_schur_inverse_is_retained(self) -> None:
        # B=[[2,1],[1,3]], r=1/2, and P is the first coordinate.
        r = Fraction(1, 2)
        shifted = (
            (Fraction(2) + r, Fraction(1)),
            (Fraction(1), Fraction(3) + r),
        )
        shifted_inverse = inverse_2x2(shifted)
        complete_schur = Fraction(2) + r - 1 / (Fraction(3) + r)

        self.assertEqual(complete_schur, Fraction(31, 14))
        self.assertEqual(shifted_inverse[0][0], 1 / complete_schur)

        # Dropping low--high coupling gives the raw compression and is wrong.
        raw_compression = Fraction(2) + r
        self.assertNotEqual(complete_schur, raw_compression)

    def test_small_residual_and_exact_capture_do_not_control_low_solve(self) -> None:
        for denominator in (10, 10_000, 10**8):
            residual = Fraction(1, denominator)
            B = residual
            complete_schur = B + residual
            low_soft_mass = residual / complete_schur

            self.assertGreater(B, 0)
            self.assertEqual(low_soft_mass, Fraction(1, 2))
            # With P=I, the complementary time-band trace is exactly zero.
            high_time_band_tail = Fraction(0)
            self.assertEqual(high_time_band_tail, 0)

    def test_rank_floor_exponent_is_sharp_for_scalar_information(self) -> None:
        scaled_values = []
        for L in (4, 16, 64):
            # rank s=L, C=I, and r=L^-4 gives
            # L^(3/2)*tr(S K)=L^(-3/2), represented without square roots by
            # restricting to square L and using sqrt(L)^3.
            s = L
            residual = Fraction(1, L**4)
            floor = Fraction(1)
            trace = residual * s / floor
            scaled = int(math.isqrt(L)) ** 3 * trace
            scaled_values.append(scaled)

        self.assertGreater(scaled_values[0], scaled_values[1])
        self.assertGreater(scaled_values[1], scaled_values[2])
        self.assertEqual(scaled_values[-1], Fraction(1, 512))


if __name__ == "__main__":
    unittest.main()
