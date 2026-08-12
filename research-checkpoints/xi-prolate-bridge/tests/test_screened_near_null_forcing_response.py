#!/usr/bin/env python3
"""Exact regressions for SCREENED_NEAR_NULL_FORCING_RESPONSE.md.

Only the Python standard library is used.  Rational and Q(sqrt(2)) fixture
identities are checked exactly; no binary64 input decides a mathematical
branch.
"""

from __future__ import annotations

from dataclasses import dataclass
from fractions import Fraction as F
from pathlib import Path
import unittest


@dataclass(frozen=True)
class Qsqrt2:
    """An exact element a + b*sqrt(2), with rational a and b."""

    a: F = F(0)
    b: F = F(0)

    @staticmethod
    def coerce(value: object) -> "Qsqrt2":
        if isinstance(value, Qsqrt2):
            return value
        if isinstance(value, (int, F)):
            return Qsqrt2(F(value), F(0))
        return NotImplemented

    def __add__(self, other: object) -> "Qsqrt2":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return Qsqrt2(self.a + rhs.a, self.b + rhs.b)

    __radd__ = __add__

    def __neg__(self) -> "Qsqrt2":
        return Qsqrt2(-self.a, -self.b)

    def __sub__(self, other: object) -> "Qsqrt2":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return self + (-rhs)

    def __rsub__(self, other: object) -> "Qsqrt2":
        lhs = self.coerce(other)
        if lhs is NotImplemented:
            return NotImplemented
        return lhs - self

    def __mul__(self, other: object) -> "Qsqrt2":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return Qsqrt2(
            self.a * rhs.a + 2 * self.b * rhs.b,
            self.a * rhs.b + self.b * rhs.a,
        )

    __rmul__ = __mul__

    def inverse(self) -> "Qsqrt2":
        denominator = self.a * self.a - 2 * self.b * self.b
        if denominator == 0:
            raise ZeroDivisionError("zero element of Q(sqrt(2))")
        return Qsqrt2(self.a / denominator, -self.b / denominator)

    def __truediv__(self, other: object) -> "Qsqrt2":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return self * rhs.inverse()

    def is_positive(self) -> bool:
        """Decide positivity exactly by rational squaring."""
        if self.b == 0:
            return self.a > 0
        if self.a == 0:
            return self.b > 0
        if self.a > 0 and self.b > 0:
            return True
        if self.a < 0 and self.b < 0:
            return False
        comparison = self.a * self.a - 2 * self.b * self.b
        if self.a > 0 and self.b < 0:
            return comparison > 0
        return comparison < 0


@dataclass(frozen=True)
class GaussianRational:
    """An exact Gaussian rational a + b*i."""

    real: F = F(0)
    imag: F = F(0)

    @staticmethod
    def coerce(value: object) -> "GaussianRational":
        if isinstance(value, GaussianRational):
            return value
        if isinstance(value, (int, F)):
            return GaussianRational(F(value), F(0))
        return NotImplemented

    def __add__(self, other: object) -> "GaussianRational":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return GaussianRational(self.real + rhs.real, self.imag + rhs.imag)

    __radd__ = __add__

    def __neg__(self) -> "GaussianRational":
        return GaussianRational(-self.real, -self.imag)

    def __sub__(self, other: object) -> "GaussianRational":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return self + (-rhs)

    def __rsub__(self, other: object) -> "GaussianRational":
        lhs = self.coerce(other)
        if lhs is NotImplemented:
            return NotImplemented
        return lhs - self

    def __mul__(self, other: object) -> "GaussianRational":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return GaussianRational(
            self.real * rhs.real - self.imag * rhs.imag,
            self.real * rhs.imag + self.imag * rhs.real,
        )

    __rmul__ = __mul__

    def conjugate(self) -> "GaussianRational":
        return GaussianRational(self.real, -self.imag)

    def inverse(self) -> "GaussianRational":
        denominator = self.real * self.real + self.imag * self.imag
        if denominator == 0:
            raise ZeroDivisionError("zero Gaussian rational")
        return GaussianRational(
            self.real / denominator, -self.imag / denominator
        )

    def __truediv__(self, other: object) -> "GaussianRational":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return self * rhs.inverse()

    def norm_squared(self) -> F:
        return self.real * self.real + self.imag * self.imag


ZERO = Qsqrt2()
ONE = Qsqrt2(F(1))
ROOT2 = Qsqrt2(F(0), F(1))
GZERO = GaussianRational()
GONE = GaussianRational(F(1))


def dot(left, right):
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix, vector):
    return tuple(dot(row, vector) for row in matrix)


def screened_ratio(c, gamma):
    denominator = 1 - gamma
    if denominator == 0:
        raise ValueError("screened feedback denominator is zero")
    return c / denominator


def gaussian_inner(left, right):
    """The one-dimensional inner product, antilinear in the first slot."""
    return left.conjugate() * right


class ScreenedNearNullForcingTests(unittest.TestCase):
    def test_exact_complex_conjugations_in_transport_feedback_and_determinant(self):
        # This one-dimensional fixture is an exact complex phase rotation of
        # the harmonic algebra.  B=2, R0=1, theta=4, and r=v is unit.
        b_short = F(2)
        r = GaussianRational(F(3, 5), F(4, 5))
        b = GaussianRational(F(1), F(2))
        u = GaussianRational(F(2, 7), F(-1, 7))  # u=Rcal D kappa
        self.assertEqual(r.norm_squared(), 1)

        # I=Rcal D B + u<b,.>.  Since <b,z>=conj(b)z, the scalar
        # Rcal D B is 1-u*conj(b)=1-conj(gamma), not 1-gamma.
        gamma = gaussian_inner(u, b)
        rdb = GONE - u * b.conjugate()
        self.assertEqual(gamma, GaussianRational(F(0), F(5, 7)))
        self.assertEqual(rdb, GONE - gamma.conjugate())
        self.assertNotEqual(rdb, GONE - gamma)
        rd = rdb / b_short

        # y=B^{-1}b and a=<r,y>.  Formula (3.13) requires conjugate(a)
        # inside the complex-linear transport map.
        y = b / b_short
        a = gaussian_inner(r, y)
        transported = b_short * (rd * r + a.conjugate() * u)
        wrong_transport = b_short * (rd * r + a * u)
        self.assertEqual(transported, r)
        self.assertNotEqual(wrong_transport, r)

        # The conjugate-linear source amplitude turns conjugate(a)u back
        # into a*<u,b>, giving (1-gamma)a=c with no conjugate on gamma.
        c = gaussian_inner(rd * r, b)
        self.assertEqual((GONE - gamma) * a, c)
        self.assertNotEqual((GONE - gamma.conjugate()) * a, c)

        # The automatic square-root factor is also phase-correct:
        # <v,f>=sqrt(theta)<r,y>, with sqrt(theta)=B=2.
        self.assertEqual(gaussian_inner(r, b), b_short * a)

    def test_exact_square_root_factor_and_parseval(self):
        # S=diag(2,3), R0=diag(1,9).  The R0-normalized generalized
        # eigenvectors are e1 and e2/3, with theta=(4,1).
        y = (F(5, 7), F(-2, 3))
        f = (2 * y[0], 3 * y[1])
        theta = (F(4), F(1))

        # Right singular vectors are exactly e1,e2.  These are the two
        # coefficients <r_j,y>.
        a = y
        generalized_forcing = (f[0], f[1] / 3)
        expected = (2 * a[0], a[1])
        self.assertEqual(generalized_forcing, expected)

        alignment = sum((value * value for value in a), F(0))
        spectral_alignment = sum(
            (
                generalized_forcing[j] * generalized_forcing[j] / theta[j]
                for j in range(2)
            ),
            F(0),
        )
        self.assertEqual(spectral_alignment, alignment)

        beta0 = f[0] * f[0] + f[1] * f[1] / 9
        weighted_a = sum(
            (theta[j] * a[j] * a[j] for j in range(2)), F(0)
        )
        self.assertEqual(beta0, weighted_a)

        # At tau=2, theta_2 is low and theta_1 is high.  The high-cluster
        # beta0/tau estimate bounds the actual high contribution.
        tau = F(2)
        low = a[1] * a[1]
        high = a[0] * a[0]
        self.assertLessEqual(high, beta0 / tau)
        self.assertLessEqual(alignment, low + beta0 / tau)

    def test_exact_source_cauchy_matrix_and_parity_commutator(self):
        epsilon = F(1)
        a0 = Qsqrt2(F(1, 5))
        a1 = Qsqrt2(F(4, 5), F(-1, 5))
        cauchy_b = {
            -1: Qsqrt2(F(0), F(-1, 5)),
            0: ZERO,
            1: Qsqrt2(F(0), F(1, 5)),
        }
        diagonal = {-1: a1, 0: a0, 1: a1}
        modes = (-1, 0, 1)

        raw = {}
        for n in modes:
            for m in modes:
                if n == m:
                    raw[n, m] = diagonal[n]
                else:
                    raw[n, m] = (cauchy_b[n] - cauchy_b[m]) / F(n - m)

        for n in modes:
            for m in modes:
                self.assertEqual(raw[n, m], raw[m, n])
                self.assertEqual(raw[n, m], raw[-n, -m])

        q_plus = (
            (F(1, 5), F(2, 5)),
            (F(2, 5), F(4, 5)),
        )
        q_odd = Qsqrt2(F(4, 5), F(-2, 5))
        beta = Qsqrt2(F(2, 5))
        self.assertTrue(q_odd.is_positive())
        self.assertNotEqual(beta, ZERO)

        # D Q+ - Q- D = beta * (1,sqrt(2)), with D=(0,1).
        commutator_row = (
            Qsqrt2(q_plus[1][0]),
            Qsqrt2(q_plus[1][1]) - q_odd,
        )
        expected_row = (beta, beta * ROOT2)
        self.assertEqual(commutator_row, expected_row)

        # The displayed parity blocks agree with the raw source-Cauchy data.
        self.assertEqual(raw[0, 0], Qsqrt2(q_plus[0][0]))
        self.assertEqual(ROOT2 * raw[0, 1], Qsqrt2(q_plus[0][1]))
        self.assertEqual(raw[1, 1] + raw[1, -1], Qsqrt2(q_plus[1][1]))
        self.assertEqual(raw[1, 1] - raw[1, -1], q_odd)
        self.assertEqual(epsilon, 1)

    def test_nonzero_beta_countermodel_alignment_and_transport(self):
        q_plus = ((F(1, 5), F(2, 5)), (F(2, 5), F(4, 5)))
        kappa = (F(3, 5), F(4, 5))
        w = (F(-4, 5), F(3, 5))
        ground = (F(-2), F(1))

        self.assertEqual(dot(kappa, w), 0)
        self.assertEqual(matvec(q_plus, ground), (F(0), F(0)))
        self.assertNotEqual(Qsqrt2(F(-2), F(1)), ZERO)  # boundary overlap
        self.assertNotEqual(dot(kappa, ground), 0)  # anchor overlap

        q = dot(kappa, matvec(q_plus, kappa))
        short = dot(w, matvec(q_plus, w))
        forcing = dot(w, matvec(q_plus, kappa))
        self.assertEqual(q, F(121, 125))
        self.assertEqual(short, F(4, 125))
        self.assertEqual(forcing, F(22, 125))
        self.assertEqual(forcing * forcing / (short * short), F(121, 4))
        self.assertEqual(q, forcing * forcing / short)

        d_kappa = F(4, 5)
        d_w = F(3, 5)
        delta_w = Qsqrt2(F(-4, 5), F(3, 5))
        odd = Qsqrt2(F(4, 5), F(-2, 5))
        beta = Qsqrt2(F(2, 5))

        # O D w = f D kappa + S D w - beta delta(w).
        lhs = odd * d_w
        rhs = (
            Qsqrt2(forcing * d_kappa + short * d_w)
            - beta * delta_w
        )
        self.assertEqual(lhs, rhs)

        # Reconstruct Rcal=P_(kappa,Phi) D0^{-1} O^{-1} from its three
        # defining operations.  H0=ker(1,sqrt(2)) is spanned by
        # h=(-sqrt(2),1), and D0 h=e_1^-.
        h0_primitive = (Qsqrt2(F(0), F(-1)), ONE)
        self.assertEqual(h0_primitive[0] + ROOT2 * h0_primitive[1], ZERO)
        d0_h0 = h0_primitive[1]
        self.assertEqual(d0_h0, ONE)

        # Apply O^{-1}, where O=Q_-= (4-2sqrt(2))/5.
        odd_inverse_image = tuple(entry / odd for entry in h0_primitive)

        # Boundary-normalize the ground and apply the oblique projection
        # z -> z-Phi <kappa,z>/<kappa,Phi> onto kappa^perp.
        ground_qsqrt2 = (Qsqrt2(F(-2)), ONE)
        boundary_ground = ground_qsqrt2[0] + ROOT2 * ground_qsqrt2[1]
        self.assertNotEqual(boundary_ground, ZERO)
        phi = tuple(entry / boundary_ground for entry in ground_qsqrt2)
        kappa_qsqrt2 = tuple(Qsqrt2(entry) for entry in kappa)
        kappa_phi = dot(kappa_qsqrt2, phi)
        kappa_preprojection = dot(kappa_qsqrt2, odd_inverse_image)
        self.assertNotEqual(kappa_phi, ZERO)
        rcal_vector = tuple(
            odd_inverse_image[index]
            - phi[index] * (kappa_preprojection / kappa_phi)
            for index in range(2)
        )
        self.assertEqual(dot(kappa_qsqrt2, rcal_vector), ZERO)

        w_qsqrt2 = tuple(Qsqrt2(entry) for entry in w)
        rcal_coefficient_qsqrt2 = dot(w_qsqrt2, rcal_vector)
        self.assertEqual(
            rcal_vector,
            tuple(rcal_coefficient_qsqrt2 * entry for entry in w_qsqrt2),
        )
        self.assertEqual(rcal_coefficient_qsqrt2, Qsqrt2(F(25, 4)))
        self.assertEqual(rcal_coefficient_qsqrt2.b, 0)
        rcal_coefficient = rcal_coefficient_qsqrt2.a

        # Check the full screened transport and its rank-one feedback
        # decomposition with the reconstructed map.
        transported = rcal_coefficient * (
            short * d_w + forcing * d_kappa
        )
        self.assertEqual(transported, 1)

        gamma = forcing * rcal_coefficient * d_kappa
        c = forcing * rcal_coefficient * d_w
        a = forcing / short
        self.assertEqual(gamma, F(22, 25))
        self.assertEqual(c, F(33, 50))
        self.assertEqual((1 - gamma) * a, c)
        self.assertEqual(screened_ratio(c, gamma), F(11, 2))

        rdb = rcal_coefficient * d_w * short
        rank_one = rcal_coefficient * d_kappa * forcing
        self.assertEqual(rdb, F(3, 25))
        self.assertEqual(rank_one, F(22, 25))
        self.assertEqual(rdb + rank_one, 1)
        self.assertEqual(rdb, 1 - gamma)

        # Any positive scalar source metric rho cancels from the normalized
        # one-mode contribution.  rho=49 is an exact representative.
        rho = F(49)
        theta = short * short / rho
        normalized_forcing_squared = forcing * forcing / rho
        self.assertEqual(normalized_forcing_squared / theta, F(121, 4))

    def test_zero_feedback_denominator_fails_closed(self):
        with self.assertRaisesRegex(ValueError, "denominator is zero"):
            screened_ratio(F(0), F(1))

    def test_note_serializes_scope_source_amplitude_and_conjugation(self):
        root = Path(__file__).resolve().parents[1]
        note = (root / "notes" / "SCREENED_NEAR_NULL_FORCING_RESPONSE.md").read_text(
            encoding="utf-8"
        )
        required = (
            "one automatic",
            "conjugation-correct transport",
            "\\overline{a_j}",
            "1-\\overline\\gamma",
            "G_\\lambda(t)=e^t-\\psi_C(e^t)",
            "n<=lambda^2",
            "minus-prime",
            "conditional reorganization, not a proof",
            "logical source-Cauchy/displacement model",
            "pinned arithmetic Weil matrix",
        )
        for phrase in required:
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, note)


if __name__ == "__main__":
    unittest.main()
