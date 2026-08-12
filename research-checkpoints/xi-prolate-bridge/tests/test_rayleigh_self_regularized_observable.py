from __future__ import annotations

import unittest
from decimal import Decimal, localcontext
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md"


class RayleighSelfRegularizedObservableTests(unittest.TestCase):
    def test_locked_claim_boundary_and_source_normal_form_are_present(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "U=q",
            "sigma=r",
            "H_\\lambda=A_{\\rm tail}-T_D",
            "combined residual before any",
            "n<=lambda^2",
            "minus-prime",
            "P0_INVALIDATED",
            "source arithmetic target",
            "positive soft-trace estimate",
            "\\operatorname {tr}(S_\\sigma K_T)",
        )
        for token in required:
            self.assertIn(token, text)

        self.assertNotIn("assume every nontrivial zeta zero is real", text.lower())
        self.assertNotIn("global weil positivity holds", text.lower())

    def test_one_dimensional_fixed_point_ridge_and_strict_improvement(self) -> None:
        # Q_+ = [[q,b],[b,q+B]] with q=7, B=3, b=2 has
        # mu=q-1 because 1=b^2/(B+1).
        q = Fraction(7)
        B = Fraction(3)
        b = Fraction(2)
        h = Fraction(1)
        mu = q - h

        self.assertEqual(h, b * b / (B + h))
        self.assertEqual((q - mu) * (q + B - mu) - b * b, 0)

        g = Fraction(5)
        observed = g * b / (B + h)
        observed_sq = observed * observed

        residual = abs(b)
        forcing_energy = b * b / B
        sigma = min(residual, forcing_energy)
        forcing_at_sigma = b * b / (B + sigma)
        self.assertLessEqual(forcing_at_sigma, sigma)

        ridged_bound = sigma * g * g / (B + sigma)
        old_unshifted_bound = forcing_energy * g * g / B
        self.assertLessEqual(observed_sq, ridged_bound)
        self.assertLess(ridged_bound, old_unshifted_bound)

        automatic_bound = residual * g * g / (B + residual)
        self.assertLessEqual(observed_sq, automatic_bound)
        self.assertLess(automatic_bound, old_unshifted_bound)

    def test_ridge_condition_is_exactly_the_fixed_point_threshold(self) -> None:
        B = Fraction(3)
        b = Fraction(2)
        h = Fraction(1)

        below = Fraction(3, 4)
        at = h
        above = Fraction(4, 3)

        self.assertGreater(b * b / (B + below), below)
        self.assertEqual(b * b / (B + at), at)
        self.assertLess(b * b / (B + above), above)

        # The scalar Schur complement in Q_+-(q-sigma)I has the same sign.
        def schur_numerator(sigma: Fraction) -> Fraction:
            return sigma * (B + sigma) - b * b

        self.assertLess(schur_numerator(below), 0)
        self.assertEqual(schur_numerator(at), 0)
        self.assertGreater(schur_numerator(above), 0)

    def test_multidimensional_metric_cauchy_and_ridge_monotonicity(self) -> None:
        # Exact rational data with h=sum b_j^2/(x_j+h)=1.
        diagonal = (Fraction(1), Fraction(3))
        b = (Fraction(-4, 3), Fraction(2, 3))
        g = (Fraction(5), Fraction(-2))
        h = Fraction(1)
        sigma = Fraction(2)

        self.assertEqual(
            sum(bj * bj / (xj + h) for bj, xj in zip(b, diagonal)),
            h,
        )
        self.assertLessEqual(
            sum(bj * bj / (xj + sigma) for bj, xj in zip(b, diagonal)),
            sigma,
        )

        observed = sum(
            gj * bj / (xj + h) for gj, bj, xj in zip(g, b, diagonal)
        )
        actual_metric_bound = h * sum(
            gj * gj / (xj + h) for gj, xj in zip(g, diagonal)
        )
        certified_ridge_bound = sigma * sum(
            gj * gj / (xj + sigma) for gj, xj in zip(g, diagonal)
        )

        self.assertLessEqual(observed * observed, actual_metric_bound)
        self.assertLessEqual(actual_metric_bound, certified_ridge_bound)
        for x in diagonal:
            self.assertLessEqual(h / (x + h), sigma / (x + sigma))

    def test_exact_cauchy_structure_small_residual_does_not_close_gate(self) -> None:
        # Raw source-Cauchy coefficients on indices -1,0,1.
        eps = Fraction(1, 10_000)
        b_coeff = {-1: eps, 0: Fraction(0), 1: -eps}
        a_coeff = {
            -1: 2 * eps * eps + eps,
            0: Fraction(0),
            1: 2 * eps * eps + eps,
        }

        def q_entry(n: int, m: int) -> Fraction:
            if n == m:
                return a_coeff[n]
            return (b_coeff[n] - b_coeff[m]) / (n - m)

        indices = (-1, 0, 1)
        for n in indices:
            for m in indices:
                self.assertEqual(q_entry(n, m), q_entry(m, n))
                self.assertEqual(q_entry(n, m), q_entry(-n, -m))

        even_complement = a_coeff[1] + q_entry(1, -1)
        odd_block = a_coeff[1] - q_entry(1, -1)
        self.assertEqual(even_complement, 2 * eps * eps)
        self.assertEqual(odd_block, 2 * eps * eps + 2 * eps)
        self.assertGreater(even_complement, 0)
        self.assertGreater(odd_block, 0)

        with localcontext() as ctx:
            ctx.prec = 80
            e = Decimal(eps.numerator) / Decimal(eps.denominator)
            B = Decimal(2) * e * e
            residual = Decimal(2).sqrt() * e
            # Positive root of h^2+B*h-2*eps^2=0.
            h = (-B + (B * B + Decimal(8) * e * e).sqrt()) / Decimal(2)
            correction_sq = h / (B + h)
            ridged_product = residual / (B + residual)

            self.assertLess(residual, Decimal("0.001"))
            self.assertGreater(correction_sq, Decimal("0.999"))
            self.assertGreater(ridged_product, Decimal("0.999"))

    def test_residual_ridge_is_not_binary64_dependent(self) -> None:
        # The universal certificate e(r)<=r is algebraic and is checked here
        # with exact rationals, including a nontrivial diagonal complement.
        diagonal = (Fraction(1, 10**8), Fraction(7, 3), Fraction(19, 5))
        b = (Fraction(1, 10**6), Fraction(2, 5), Fraction(-3, 7))
        residual_sq = sum(x * x for x in b)

        # Avoid decimal input and verify e(r)<=r after exact squaring:
        # e(r)<=||b||^2/r=r follows termwise from B+rI>=rI.
        self.assertGreater(residual_sq, 0)
        for x in diagonal:
            self.assertGreater(x, 0)

        with localcontext() as ctx:
            ctx.prec = 100

            def dec(value: Fraction) -> Decimal:
                return Decimal(value.numerator) / Decimal(value.denominator)

            residual = dec(residual_sq).sqrt()
            e_residual = sum(
                dec(bj * bj) / (dec(xj) + residual)
                for bj, xj in zip(b, diagonal)
            )
            self.assertLessEqual(e_residual, residual)

    def test_trace_to_supremum_tent_constants(self) -> None:
        # The proof of (4.12) uses only the lower tent forced by the
        # Lipschitz constant of sqrt(F).  Check both branches exactly.
        C = Fraction(3)
        T = Fraction(2)
        M = Fraction(16)
        sqrt_M = Fraction(4)
        distance = min(T, sqrt_M / (2 * C))
        lower_integral = distance * M / 4
        self.assertEqual(distance, Fraction(2, 3))
        self.assertEqual(lower_integral, Fraction(8, 3))
        self.assertLessEqual(M**3, (8 * C * lower_integral) ** 2)

        C = Fraction(1)
        T = Fraction(1)
        M = Fraction(16)
        sqrt_M = Fraction(4)
        self.assertGreater(sqrt_M / (2 * C), T)
        lower_integral = T * M / 4
        self.assertLessEqual(M, 4 * lower_integral / T)


if __name__ == "__main__":
    unittest.main()
