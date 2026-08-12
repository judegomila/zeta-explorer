import unittest
from fractions import Fraction
from math import comb


def schur_short(a, b, c):
    return a - c * c / b


class ProlateEndpointSchurSingularAsymptoticsTests(unittest.TestCase):
    def test_first_derivative_correction_is_exactly_transverse(self):
        # A finite exact spectral model for the identity
        # y_1-hat proportional to (z^2-m_4)y_0-hat.  The weights represent
        # |y_0-hat|^2 at three squared frequencies.
        weights = [Fraction(2), Fraction(3), Fraction(5)]
        z2 = [Fraction(1), Fraction(4), Fraction(9)]
        total = sum(weights)
        m4 = sum(w * x for w, x in zip(weights, z2)) / total
        correction = [x - m4 for x in z2]
        self.assertEqual(
            sum(w * c for w, c in zip(weights, correction)),
            0,
        )
        self.assertGreater(
            sum(w * c * c for w, c in zip(weights, correction)),
            0,
        )

    def test_ritz_shift_changes_only_scalar_and_transverse_diagonal(self):
        a = Fraction(3, 7)
        b = Fraction(5, 11)
        c = Fraction(2, 13)
        t = Fraction(1, 17)
        shifted = schur_short(a + t, b + t, c)
        direct = (a + t) - c * c / (b + t)
        self.assertEqual(shifted, direct)
        self.assertGreater(shifted - schur_short(a, b, c), t)

    def test_ritz_characteristic_relation(self):
        # Exact 2 by 2 Ritz data.  Choosing t first and defining r^2 from
        # t(c_R-q+t) avoids any square-root arithmetic.
        q = Fraction(1, 5)
        c_r = Fraction(7, 10)
        t = Fraction(1, 20)
        r2 = t * (c_r - q + t)
        u = q - t
        self.assertEqual((q - u) * (c_r - u), r2)
        self.assertLessEqual(t * t, r2)  # c_R >= q implies t <= r.

    def test_hidden_lower_direction_can_make_ritz_shift_large(self):
        # A tiny residual does not make t tiny when c_R<q.  These exact data
        # satisfy t(c_R-q+t)=r^2 with t=1 and r=1/100.
        q = Fraction(0)
        r = Fraction(1, 100)
        t = Fraction(1)
        c_r = r * r / t - t
        self.assertLess(c_r, q)
        self.assertEqual(t * (c_r - q + t), r * r)
        self.assertGreater(t, r)

    def test_absolute_smallness_does_not_sign_inverse_short(self):
        # Both families have positive a and B and all entries tend to zero.
        # Their inverse-weighted Schur signs are opposite at every t>0.
        t = Fraction(1, 8)
        b = t**4
        a = 2 * t**2
        c_pass = t**3
        c_fail = 2 * t**3
        self.assertGreater(schur_short(a, b, c_pass), 0)
        self.assertLess(schur_short(a, b, c_fail), 0)

    def test_fixed_moments_do_not_fix_a_carrier_transform(self):
        # Discrete integration-by-parts analogue: the (R+1)-st forward
        # difference annihilates polynomial moments through degree R but
        # not a generic geometric/carrier sequence.
        r = 4
        coeff = [
            Fraction((-1) ** (r + 1 - j))
            * Fraction(comb(r + 1, j))
            for j in range(r + 2)
        ]
        nodes = [Fraction(j) for j in range(r + 2)]
        for degree in range(r + 1):
            self.assertEqual(
                sum(c * x**degree for c, x in zip(coeff, nodes)),
                0,
            )
        carrier = [Fraction(2) ** j for j in range(r + 2)]
        self.assertNotEqual(sum(c * v for c, v in zip(coeff, carrier)), 0)


if __name__ == "__main__":
    unittest.main()
