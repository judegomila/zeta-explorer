import unittest
from fractions import Fraction
from pathlib import Path

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "TIME_BAND_CAUCHY_DETERMINANT_RESPONSE.md"


def cauchy_matrix(indices, diagonal, displacement):
    matrix = []
    for n in indices:
        row = []
        for m in indices:
            if n == m:
                row.append(diagonal[n])
            else:
                row.append((displacement[n] - displacement[m]) / (n - m))
        matrix.append(row)
    return matrix


class TimeBandCauchyDeterminantResponseTests(unittest.TestCase):
    def test_exact_cauchy_displacement_and_homotopy(self):
        indices = list(range(-2, 3))
        q_diag = {
            -2: Fraction(9, 5),
            -1: Fraction(7, 4),
            0: Fraction(2, 3),
            1: Fraction(7, 4),
            2: Fraction(9, 5),
        }
        k_diag = {
            -2: Fraction(5, 6),
            -1: Fraction(4, 7),
            0: Fraction(3, 8),
            1: Fraction(4, 7),
            2: Fraction(5, 6),
        }
        b = {
            -2: Fraction(2, 5),
            -1: Fraction(-1, 7),
            0: Fraction(0),
            1: Fraction(1, 7),
            2: Fraction(-2, 5),
        }
        d = {
            -2: Fraction(-3, 13),
            -1: Fraction(1, 11),
            0: Fraction(0),
            1: Fraction(-1, 11),
            2: Fraction(3, 13),
        }
        Q = cauchy_matrix(indices, q_diag, b)
        K = cauchy_matrix(indices, k_diag, d)
        homotopy_parameter = Fraction(7, 19)

        for i, n in enumerate(indices):
            for j, m in enumerate(indices):
                self.assertEqual(Q[i][j], Q[j][i])
                self.assertEqual(K[i][j], K[j][i])
                self.assertEqual(Q[i][j], Q[indices.index(-n)][indices.index(-m)])
                self.assertEqual(K[i][j], K[indices.index(-n)][indices.index(-m)])
                self.assertEqual(
                    (n - m) * (Q[i][j] + homotopy_parameter * K[i][j]),
                    (b[n] + homotopy_parameter * d[n])
                    - (b[m] + homotopy_parameter * d[m]),
                )

    def test_closed_time_band_formula_matches_direct_quadrature(self):
        mp.mp.dps = 80
        L = 2 * mp.log(2)
        T = mp.mpf(1)

        def transform(n, t):
            center = 2 * mp.pi * n / L
            if t == center:
                return mp.power(-1, n) * mp.sqrt(L)
            return 2 * mp.sin(t * L / 2) / (mp.sqrt(L) * (t - center))

        def primitive(s):
            if s == 0:
                return -mp.euler - mp.log(L)
            return mp.log(abs(s)) - mp.ci(L * abs(s))

        def displacement(n):
            center = 2 * mp.pi * n / L
            first = (primitive(T - center) - primitive(T + center)) / 2
            return first / mp.pi**2

        for n, m in ((1, 0), (1, -1), (2, -1)):
            direct = mp.quad(
                lambda t: transform(n, t) * transform(m, t),
                [-T, mp.mpf(0), T],
            ) / (2 * mp.pi)
            cauchy = (displacement(n) - displacement(m)) / (n - m)
            self.assertLess(abs(direct - cauchy), mp.mpf("1e-70"))

        # Exercise the removable A_L(0) branch at a band-edge resonance:
        # L=2*pi makes c_1=T=1.
        L = 2 * mp.pi
        T = mp.mpf(1)
        direct = mp.quad(
            lambda t: transform(1, t) * transform(0, t),
            [-T, mp.mpf(0), T],
        ) / (2 * mp.pi)
        cauchy = displacement(1) - displacement(0)
        self.assertLess(abs(direct - cauchy), mp.mpf("1e-70"))

    def test_differentiated_parity_anchor_identity_is_exact(self):
        # N=1 diagonal source-Cauchy model.  In the even parity basis,
        # Q_+=diag(0,5), K_+=diag(2,7), while Q_-=(5), K_-=(7).
        # The rational unit anchor is (4/5,3/5).
        q = Fraction(9, 5)
        B = Fraction(7, 5)
        b = Fraction(12, 5)
        K = Fraction(26, 5)
        k = Fraction(12, 5)
        k00 = Fraction(19, 5)
        odd_shift = Fraction(16, 5)
        K_odd = Fraction(7)

        reciprocal = K / B
        odd_response = K_odd / odd_shift
        boundary_response = -Fraction(2) / (-q)  # m'/m
        sigma = -(b * b) / B
        sigma_prime = k00 - 2 * k * b / B + b * b * K / (B * B)
        anchor_response = sigma_prime / sigma

        self.assertEqual(reciprocal, Fraction(26, 7))
        self.assertEqual(odd_response, Fraction(35, 16))
        self.assertEqual(boundary_response, Fraction(10, 9))
        self.assertEqual(anchor_response, Fraction(-2659, 1008))
        self.assertEqual(
            reciprocal,
            odd_response - anchor_response - boundary_response,
        )
        self.assertNotEqual(reciprocal, odd_response - anchor_response)
        self.assertNotEqual(reciprocal, odd_response - boundary_response)

        # The same identity at z=q-r gives the directly regularized
        # response, with r=||b|| in this one-dimensional complement.
        ridge = abs(b)
        B_r = B + ridge
        odd_r = odd_shift + ridge
        raw_even_top_r = ridge - q
        sigma_r = ridge - b * b / B_r
        sigma_prime_r = (
            k00 - 2 * k * b / B_r + b * b * K / (B_r * B_r)
        )
        boundary_response_r = -Fraction(2) / raw_even_top_r
        self.assertGreater(sigma_r, 0)
        self.assertEqual(K / B_r, Fraction(26, 19))
        self.assertEqual(sigma_prime_r / sigma_r, Fraction(733, 228))
        self.assertEqual(
            K / B_r,
            K_odd / odd_r
            - sigma_prime_r / sigma_r
            - boundary_response_r,
        )

        # Check the undifferentiated determinant factorization at one exact
        # nonzero homotopy parameter.
        h = Fraction(1, 10)
        det_odd = odd_shift + h * K_odd
        det_even = (-q + 2 * h) * (odd_shift + h * K_odd)
        boundary_weyl = Fraction(1, 1) / (-q + 2 * h)
        B_h = B + h * K
        b_h = b + h * k
        a_h = h * k00
        schur_h = a_h - b_h * b_h / B_h
        self.assertEqual(det_odd, det_even * boundary_weyl)
        self.assertEqual(det_even, B_h * schur_h)

    def test_hidden_captured_mode_makes_reciprocal_response_unbounded(self):
        # Exact rational member of the diagonal family in Section 4.
        s = Fraction(3, 5)
        c = Fraction(4, 5)
        q_minus_a = s * s
        residual = s * c
        transverse_energy = c * c - s * s
        odd_first_gap = c * c

        self.assertEqual(q_minus_a, Fraction(9, 25))
        self.assertEqual(residual, Fraction(12, 25))
        self.assertEqual(transverse_energy, Fraction(7, 25))
        self.assertGreater(odd_first_gap, 0)

        responses = []
        first_columns = []
        a = Fraction(11, 7)
        indices = list(range(-2, 3))
        for inverse_hidden_gap in (10, 1000):
            hidden_gap = Fraction(1, inverse_hidden_gap)
            diagonal = {
                -2: a + q_minus_a + hidden_gap,
                -1: a + 1,
                0: a,
                1: a + 1,
                2: a + q_minus_a + hidden_gap,
            }
            zero_displacement = {n: Fraction(0) for n in indices}
            Q = cauchy_matrix(indices, diagonal, zero_displacement)
            # K=I is an exact positive-contraction specialization.  The
            # actual K_T version replaces the second numerator by k_22>0.
            reciprocal = Fraction(1, 1) / transverse_energy + Fraction(
                1, 1
            ) / hidden_gap
            soft_hidden = residual / (hidden_gap + residual)
            responses.append(reciprocal)
            zero_index = indices.index(0)
            first_columns.append(tuple(row[zero_index] for row in Q))
            self.assertGreater(hidden_gap, 0)
            self.assertGreater(soft_hidden, Fraction(1, 2))

        self.assertEqual(first_columns[0], first_columns[1])
        self.assertEqual(responses[1] - responses[0], Fraction(990))
        self.assertEqual(responses[0], Fraction(25, 7) + 10)

    def test_note_records_claim_boundary_and_combined_response(self):
        text = NOTE.read_text(encoding="utf-8")
        for required in (
            "(K_T)_{nm}={d_n-d_m\\over n-m}",
            "Q+sK_T",
            "two-scalar determinant response",
            "sigma_s(q)m_s(q)",
            "triangle inequality",
            "counterfamily is structural; it is not the pinned arithmetic",
            "P0_INVALIDATED",
        ):
            self.assertIn(required, text)


if __name__ == "__main__":
    unittest.main()
