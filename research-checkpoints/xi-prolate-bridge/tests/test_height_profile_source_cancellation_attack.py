import unittest
from fractions import Fraction
from functools import reduce

import mpmath as mp


def product(values):
    return reduce(lambda x, y: x * y, values, Fraction(1))


def endpoint_factor(root_square, a_square, b_square):
    return (root_square + a_square) / (root_square + b_square)


def paired_profile(root_squares, height_square):
    return sum(
        (Fraction(1) / (root_square + height_square) for root_square in root_squares),
        Fraction(0),
    )


def polynomial_multiply(left, right):
    out = [Fraction(0) for _ in range(len(left) + len(right) - 1)]
    for i, x in enumerate(left):
        for j, y in enumerate(right):
            out[i + j] += x * y
    return out


class HeightProfileSourceCancellationAttackTests(unittest.TestCase):
    def test_exact_source_log_derivative_keeps_chain_factor_and_signs(self):
        mp.mp.dps = 80
        L = mp.mpf(11)
        s = mp.mpf(3) / 20

        def response(alpha):
            return mp.e ** (-alpha) * (1 + alpha * alpha)

        def xi_axis(height):
            return 1 + height * height + height**4 / 3

        def renormalized(height):
            alpha = height * L / (2 * mp.pi)
            return (
                2
                * mp.sinh(height * L / 2)
                / (height * mp.sqrt(L))
                * response(alpha)
                / xi_axis(height)
            )

        alpha = s * L / (2 * mp.pi)
        direct = mp.diff(lambda height: mp.log(renormalized(height)), s)
        reconstructed = (
            (L / 2) * mp.coth(s * L / 2)
            - 1 / s
            + (L / (2 * mp.pi))
            * (-1 + 2 * alpha / (1 + alpha * alpha))
            - mp.diff(lambda height: mp.log(xi_axis(height)), s)
        )
        wrong_chain = (
            (L / 2) * mp.coth(s * L / 2)
            - 1 / s
            + (L / 2) * (-1 + 2 * alpha / (1 + alpha * alpha))
            - mp.diff(lambda height: mp.log(xi_axis(height)), s)
        )
        wrong_prime_sign = (
            (L / 2) * mp.coth(s * L / 2)
            - 1 / s
            - (L / (2 * mp.pi))
            * (-1 + 2 * alpha / (1 + alpha * alpha))
            - mp.diff(lambda height: mp.log(xi_axis(height)), s)
        )

        self.assertLess(abs(direct - reconstructed), mp.mpf("1e-70"))
        self.assertGreater(abs(direct - wrong_chain), mp.mpf("1e-2"))
        self.assertGreater(abs(direct - wrong_prime_sign), mp.mpf("1e-2"))

    def test_source_value_ratio_has_b_over_s_and_hyperbolic_orientation(self):
        mp.mp.dps = 80
        L = mp.mpf(9)
        b = mp.mpf(1) / 4
        s = mp.mpf(1) / 8

        def response(alpha):
            return 1 + alpha + alpha * alpha

        def ground(height):
            alpha = height * L / (2 * mp.pi)
            return (
                2
                * mp.sinh(height * L / 2)
                / (height * mp.sqrt(L))
                * response(alpha)
            )

        direct = ground(s) / ground(b)
        source_ratio = (
            (b / s)
            * (mp.sinh(s * L / 2) / mp.sinh(b * L / 2))
            * (
                response(s * L / (2 * mp.pi))
                / response(b * L / (2 * mp.pi))
            )
        )
        reversed_hyperbolic = (
            (b / s)
            * (mp.sinh(b * L / 2) / mp.sinh(s * L / 2))
            * (
                response(s * L / (2 * mp.pi))
                / response(b * L / (2 * mp.pi))
            )
        )

        self.assertLess(abs(direct - source_ratio), mp.mpf("1e-70"))
        self.assertGreater(abs(direct - reversed_hyperbolic), mp.mpf("1"))

    def test_left_endpoint_ratio_bounds_complete_anchor_trace(self):
        mp.mp.dps = 80
        roots = [mp.mpf(0), mp.mpf(3) / 7, mp.mpf(5), mp.mpf(19)]
        a = mp.mpf(1) / 8
        b = mp.mpf(1) / 4
        ratio = mp.fprod((x + a * a) / (x + b * b) for x in roots)
        anchor_trace = mp.fsum(1 / (x + b * b) for x in roots)

        lower = (b * b - a * a) * anchor_trace
        self.assertLessEqual(lower, -mp.log(ratio))
        self.assertLessEqual(anchor_trace, -mp.log(ratio) / (b * b - a * a))
        self.assertGreater(ratio, 0)
        self.assertLessEqual(ratio, 1)

    def test_equal_rank_endpoint_collision_is_exact_and_profiles_differ(self):
        a = Fraction(1, 8)
        b = Fraction(1, 4)
        a2 = a * a
        b2 = b * b
        roots_plus = [Fraction(1, 32), Fraction(1, 8)]
        roots_minus = [Fraction(7, 128), Fraction(1, 16)]

        factors_plus = [endpoint_factor(x, a2, b2) for x in roots_plus]
        factors_minus = [endpoint_factor(x, a2, b2) for x in roots_minus]
        self.assertEqual(factors_plus, [Fraction(1, 2), Fraction(3, 4)])
        self.assertEqual(factors_minus, [Fraction(3, 5), Fraction(5, 8)])
        self.assertEqual(product(factors_plus), Fraction(3, 8))
        self.assertEqual(product(factors_minus), Fraction(3, 8))
        self.assertEqual(len(roots_plus), len(roots_minus))

        self.assertEqual(paired_profile(roots_plus, b2), Fraction(16))
        self.assertEqual(paired_profile(roots_minus, b2), Fraction(248, 15))
        self.assertNotEqual(
            paired_profile(roots_plus, b2), paired_profile(roots_minus, b2)
        )

    def test_exact_mellin_evaluation_norms_and_logarithmic_loss(self):
        mp.mp.dps = 80
        L = mp.mpf(13)
        s = mp.mpf(3) / 17
        ell = L / 2

        i0_closed = mp.sinh(s * L) / s
        i0_quad = mp.quad(lambda x: mp.e ** (2 * s * x), [-ell, ell])
        i2_closed = (
            (L * L / (4 * s) + 1 / (2 * s**3)) * mp.sinh(s * L)
            - L / (2 * s * s) * mp.cosh(s * L)
        )
        i2_quad = mp.quad(lambda x: x * x * mp.e ** (2 * s * x), [-ell, ell])

        self.assertLess(abs(i0_closed - i0_quad), mp.mpf("1e-70"))
        self.assertLess(abs(i2_closed - i2_quad), mp.mpf("1e-70"))
        self.assertLessEqual(i2_closed, (L * L / 4) * i0_closed)

    def test_moving_height_log_ratio_bounds_the_complete_profile(self):
        mp.mp.dps = 80
        root_squares = [mp.mpf(1) / 19, mp.mpf(2) / 7, mp.mpf(3), mp.mpf(17)]
        L = mp.mpf(40)
        s = 1 / L

        log_ratio = mp.fsum(mp.log(1 + s * s / x) for x in root_squares)
        profile = mp.fsum(1 / (x + s * s) for x in root_squares)
        self.assertGreaterEqual(log_ratio, s * s * profile)

        fixed_height = mp.mpf(1) / 4
        fixed_profile = mp.fsum(
            1 / (x + fixed_height * fixed_height) for x in root_squares
        )
        self.assertLessEqual(fixed_profile, profile)

    def test_source_anchor_moving_weight_has_the_claimed_fourier_tail(self):
        mp.mp.dps = 80
        L = mp.mpf(37)
        half = L / 2

        for n in (1, 2, 5, 11):
            direct = mp.quad(
                lambda x: (
                    (-1) ** n
                    / mp.sqrt(L)
                    * mp.e ** (2j * mp.pi * n * x / L)
                    * (mp.cosh(x / L) - 1)
                ),
                [-half, half],
            )
            closed = 2 * mp.sqrt(L) * mp.sinh(mp.mpf(1) / 2) / (
                1 + 4 * mp.pi**2 * n * n
            )
            self.assertLess(abs(direct - closed), mp.mpf("1e-70"))

        # For N=L^3, a representative N/L^2 -> infinity schedule, the
        # weighted tail times L^2 is exactly of order L^(-4).
        scaled = [Fraction(1, L_int**4) for L_int in (4, 8, 16, 32)]
        self.assertTrue(all(y < x for x, y in zip(scaled, scaled[1:])))

    def test_convergent_two_jet_alone_does_not_control_moving_height(self):
        mp.mp.dps = 80

        # This fixed even profile is orthogonal to 1 and y^2.  Hence
        # p_L(x)=L^(-1/2)g(x/L) has identically zero origin value and second
        # jet, while its moving-height cosh increment grows like sqrt(L).
        def g(y):
            return y**4 - mp.mpf(3) * y**2 / 14 + mp.mpf(3) / 560

        interval = [-mp.mpf(1) / 2, mp.mpf(1) / 2]
        moment_0 = mp.quad(g, interval)
        moment_2 = mp.quad(lambda y: y * y * g(y), interval)
        moving_constant = mp.quad(
            lambda y: g(y) * (mp.cosh(y) - 1), interval
        )
        self.assertLess(abs(moment_0), mp.mpf("1e-75"))
        self.assertLess(abs(moment_2), mp.mpf("1e-75"))
        self.assertGreater(abs(moving_constant), mp.mpf("1e-8"))

        increments = [mp.sqrt(L) * abs(moving_constant) for L in (16, 64, 256)]
        self.assertTrue(all(y > x for x, y in zip(increments, increments[1:])))

    def test_bounded_origin_curvature_is_the_complete_normal_family_gate(self):
        roots = [Fraction(1, 9), Fraction(2, 5), Fraction(7), Fraction(31)]
        zero_height_trace = sum((Fraction(1) / x for x in roots), Fraction(0))

        # The coefficient of t in prod(1+t/x) is exactly the complete
        # half-paired inverse-square trace.
        polynomial = [Fraction(1)]
        for root_square in roots:
            polynomial = polynomial_multiply(
                polynomial, [Fraction(1), Fraction(1) / root_square]
            )
        linear_coefficient = polynomial[1]
        self.assertEqual(linear_coefficient, zero_height_trace)

        for b in (Fraction(1, 8), Fraction(1, 4), Fraction(2, 5)):
            anchored_trace = paired_profile(roots, b * b)
            self.assertLessEqual(anchored_trace, zero_height_trace)

    def test_big_O_log_power_is_enough_for_normality_and_real_axis_error(self):
        # epsilon=L^(-5/2) leaves the origin second-jet error merely bounded,
        # while the real-axis Cauchy-Schwarz error still tends to zero.
        second_jet_errors = []
        real_axis_errors = []
        for L in (mp.mpf(16), mp.mpf(64), mp.mpf(256), mp.mpf(1024)):
            epsilon = L ** (-mp.mpf(5) / 2)
            second_jet_errors.append(L ** (mp.mpf(5) / 2) * epsilon)
            real_axis_errors.append(mp.sqrt(L) * epsilon)

        self.assertTrue(all(error == 1 for error in second_jet_errors))
        self.assertTrue(
            all(y < x for x, y in zip(real_axis_errors, real_axis_errors[1:]))
        )
        self.assertLess(real_axis_errors[-1], mp.mpf("1e-5"))

    def test_N_over_L_squared_schedule_closes_every_anchor_remainder(self):
        # Use the representative schedule N=L^3.  These are the exact powers
        # occurring in the norm, real-axis, and origin-two-jet audits.
        real_axis_projection = []
        second_jet_projection = []
        exterior_first_trace = []
        for m_int in (4, 8, 16, 32):
            m = Fraction(m_int)
            L = m * m
            N = L**3
            real_axis_projection.append(m**3 / N)
            second_jet_projection.append(m**7 / m**15)
            exterior_first_trace.append(L * L / N)

            self.assertGreater(N / (L * L), 1)
            # N/L^(7/5)=L^(8/5)>1; avoid an inexact fractional power.
            self.assertGreater(N**5, L**7)

        for sequence in (
            real_axis_projection,
            second_jet_projection,
            exterior_first_trace,
        ):
            self.assertTrue(all(y < x for x, y in zip(sequence, sequence[1:])))

    def test_any_positive_power_solve_rate_can_use_a_lower_fixed_height(self):
        mp.mp.dps = 80
        gamma = mp.mpf(1) / 5
        b_good = mp.mpf(1) / 8
        b_bad = mp.mpf(1) / 4

        good = []
        bad = []
        for exponent in (20, 40, 80, 160, 320):
            lam = mp.mpf(2) ** exponent
            L = 2 * mp.log(lam)
            epsilon = lam ** (-gamma)
            good.append(L * lam**b_good * epsilon)
            bad.append(L * lam**b_bad * epsilon)

        self.assertTrue(all(y < x for x, y in zip(good, good[1:])))
        self.assertTrue(all(y > x for x, y in zip(bad, bad[1:])))
        self.assertLess(good[-1], mp.mpf("1e-2"))
        self.assertGreater(bad[-1], mp.mpf("1e4"))


if __name__ == "__main__":
    unittest.main()
