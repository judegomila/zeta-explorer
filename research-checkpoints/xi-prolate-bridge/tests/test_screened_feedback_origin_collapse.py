#!/usr/bin/env python3
"""Exact regressions for SCREENED_FEEDBACK_ORIGIN_COLLAPSE.md.

Only the Python standard library is used.  Every branch-deciding input is a
Fraction, a Gaussian rational, or an element of Q(sqrt(2)); binary64 is not
used.
"""

from __future__ import annotations

from dataclasses import dataclass
from fractions import Fraction as F
from pathlib import Path
import unittest


@dataclass(frozen=True)
class GQ:
    """An exact Gaussian rational real + imag*i."""

    real: F = F(0)
    imag: F = F(0)

    @staticmethod
    def coerce(value: object) -> "GQ":
        if isinstance(value, GQ):
            return value
        if isinstance(value, (int, F)):
            return GQ(F(value), F(0))
        return NotImplemented

    def __add__(self, other: object) -> "GQ":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return GQ(self.real + rhs.real, self.imag + rhs.imag)

    __radd__ = __add__

    def __neg__(self) -> "GQ":
        return GQ(-self.real, -self.imag)

    def __sub__(self, other: object) -> "GQ":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return self + (-rhs)

    def __rsub__(self, other: object) -> "GQ":
        lhs = self.coerce(other)
        if lhs is NotImplemented:
            return NotImplemented
        return lhs - self

    def __mul__(self, other: object) -> "GQ":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return GQ(
            self.real * rhs.real - self.imag * rhs.imag,
            self.real * rhs.imag + self.imag * rhs.real,
        )

    __rmul__ = __mul__

    def conjugate(self) -> "GQ":
        return GQ(self.real, -self.imag)

    def inverse(self) -> "GQ":
        denominator = self.real * self.real + self.imag * self.imag
        if denominator == 0:
            raise ZeroDivisionError("zero Gaussian rational")
        return GQ(self.real / denominator, -self.imag / denominator)

    def __truediv__(self, other: object) -> "GQ":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return self * rhs.inverse()

    def __rtruediv__(self, other: object) -> "GQ":
        lhs = self.coerce(other)
        if lhs is NotImplemented:
            return NotImplemented
        return lhs / self

    def norm_squared(self) -> F:
        return self.real * self.real + self.imag * self.imag


@dataclass(frozen=True)
class QS2:
    """An exact element a + b*sqrt(2)."""

    a: F = F(0)
    b: F = F(0)

    @staticmethod
    def coerce(value: object) -> "QS2":
        if isinstance(value, QS2):
            return value
        if isinstance(value, (int, F)):
            return QS2(F(value), F(0))
        return NotImplemented

    def __add__(self, other: object) -> "QS2":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return QS2(self.a + rhs.a, self.b + rhs.b)

    __radd__ = __add__

    def __neg__(self) -> "QS2":
        return QS2(-self.a, -self.b)

    def __sub__(self, other: object) -> "QS2":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return self + (-rhs)

    def __rsub__(self, other: object) -> "QS2":
        lhs = self.coerce(other)
        if lhs is NotImplemented:
            return NotImplemented
        return lhs - self

    def __mul__(self, other: object) -> "QS2":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return QS2(
            self.a * rhs.a + 2 * self.b * rhs.b,
            self.a * rhs.b + self.b * rhs.a,
        )

    __rmul__ = __mul__

    def inverse(self) -> "QS2":
        denominator = self.a * self.a - 2 * self.b * self.b
        if denominator == 0:
            raise ZeroDivisionError("zero element of Q(sqrt(2))")
        return QS2(self.a / denominator, -self.b / denominator)

    def __truediv__(self, other: object) -> "QS2":
        rhs = self.coerce(other)
        if rhs is NotImplemented:
            return NotImplemented
        return self * rhs.inverse()

    def is_positive(self) -> bool:
        """Decide the sign exactly by rational comparisons."""
        if self.b == 0:
            return self.a > 0
        if self.a >= 0 and self.b >= 0:
            return self != QS2()
        if self.a <= 0 and self.b <= 0:
            return False
        comparison = self.a * self.a - 2 * self.b * self.b
        if self.a > 0:
            return comparison > 0
        return comparison < 0


GZERO = GQ()
GONE = GQ(F(1))
QZERO = QS2()
QONE = QS2(F(1))
ROOT2 = QS2(F(0), F(1))


def gq_vector(*entries: object) -> tuple[GQ, ...]:
    return tuple(GQ.coerce(entry) for entry in entries)


def inner(left, right) -> GQ:
    """Antilinear-first exact inner product."""
    return sum(
        (x.conjugate() * y for x, y in zip(left, right)),
        GZERO,
    )


def scale(scalar: object, vector) -> tuple[GQ, ...]:
    value = GQ.coerce(scalar)
    return tuple(value * entry for entry in vector)


def subtract(left, right) -> tuple[GQ, ...]:
    return tuple(x - y for x, y in zip(left, right))


def matvec(matrix, vector) -> tuple[GQ, ...]:
    return tuple(
        sum((GQ.coerce(entry) * value for entry, value in zip(row, vector)), GZERO)
        for row in matrix
    )


def orthogonal_project(vector, unit_anchor) -> tuple[GQ, ...]:
    return subtract(vector, scale(inner(unit_anchor, vector), unit_anchor))


def oblique_project(vector, anchor, phi, p) -> tuple[GQ, ...]:
    return subtract(vector, scale(inner(anchor, vector) / p, phi))


def origin_feedback(
    kappa0,
    p,
    phi0,
    *,
    simple_ground: bool = True,
    a_hermitian_psd: bool = True,
    odd_invertible: bool = True,
    odd_self_adjoint: bool = True,
    boundary_visible: bool = True,
    commutator_exact: bool = True,
    delta_e0_one: bool = True,
    d_kernel_exact: bool = True,
    unit_anchor: bool = True,
    compression_positive: bool = True,
    d0_invertible: bool = True,
    source_identity: bool = True,
    rate_branch: bool = False,
    odd_positive: bool = True,
):
    """Fail-closed serialization of the finite theorem gates."""
    gates = {
        "simple even ground": simple_ground,
        "Hermitian positive-semidefinite even shift": a_hermitian_psd,
        "invertible odd block": odd_invertible,
        "self-adjoint odd block": odd_self_adjoint,
        "boundary-visible ground": boundary_visible,
        "exact source commutator": commutator_exact,
        "unit central boundary value": delta_e0_one,
        "exact derivative kernel": d_kernel_exact,
        "unit anchor": unit_anchor,
        "positive compression": compression_positive,
        "invertible boundary primitive": d0_invertible,
        "source relative determinant": source_identity,
    }
    for label, passed in gates.items():
        if not passed:
            raise ValueError(f"failed gate: {label}")
    for label, value in (("kappa0", kappa0), ("p", p), ("phi0", phi0)):
        if value == 0:
            raise ValueError(f"failed gate: zero {label}")
    if rate_branch and not odd_positive:
        raise ValueError("failed gate: nonpositive odd complementary gap")
    return kappa0 * p / phi0


def rational_anchor_data(s: F, epsilon: F = F(1)) -> dict[str, F]:
    if s == 0:
        raise ValueError("s=0 makes D restricted to the complement singular")
    k0 = 2 * s / (1 + s * s)
    k1 = (1 - s * s) / (1 + s * s)
    d = k1 - 2 * k0
    e = 2 * k1 + k0
    if d == 0:
        raise ValueError("zero anchor-ground overlap")
    compression = epsilon * d * d / 5
    forcing = -epsilon * d * e / 5
    denominator = -k0 * d / 2
    c = k0 * e / 2
    a = forcing / compression
    return {
        "k0": k0,
        "k1": k1,
        "d": d,
        "e": e,
        "compression": compression,
        "forcing": forcing,
        "denominator": denominator,
        "c": c,
        "a": a,
        "alignment": a * a,
    }


class ScreenedFeedbackOriginCollapseTests(unittest.TestCase):
    def test_nonselfadjoint_odd_block_is_rejected_before_phase_formula(self):
        # All of the purely algebraic commutator and relative-determinant
        # identities below hold, but O=1-i is not self-adjoint.  The
        # unbarred Phi_0 formula would incorrectly return -i for det(B)=1.
        matrix = (
            (GQ(F(1)), GQ(F(1))),
            (GQ(F(1)), GQ(F(1))),
        )
        odd = GQ(F(1), F(-1))
        eta = (GQ(F(1)), GQ(F(0), F(-1)))
        e0 = gq_vector(1, 0)
        ground = gq_vector(1, -1)
        boundary = inner(eta, ground)
        phi = scale(boundary.inverse(), ground)

        self.assertEqual(inner(eta, phi), GONE)
        self.assertEqual(matvec(matrix, phi), gq_vector(0, 0))
        commutator_row = (matrix[1][0], matrix[1][1] - odd)
        self.assertEqual(commutator_row, gq_vector(1, GQ(F(0), F(1))))
        adjugate_e0 = gq_vector(1, -1)
        self.assertEqual(adjugate_e0, scale(odd, phi))

        phi0 = inner(e0, phi)
        p = phi0  # kappa=e0
        invalid_relative = odd * p.norm_squared() / phi0
        self.assertEqual(invalid_relative, GQ(F(0), F(-1)))
        self.assertNotEqual(invalid_relative, GONE)
        with self.assertRaisesRegex(ValueError, "self-adjoint odd block"):
            origin_feedback(
                GONE,
                p,
                phi0,
                odd_self_adjoint=False,
            )

    def test_gaussian_rational_complex_phase_and_source_relative_determinant(self):
        # Rational finite commutator fixture:
        # A=1/5[[1,2],[2,4]], O=2/5, eta=(1,1), beta=2/5.
        matrix = (
            (GQ(F(1, 5)), GQ(F(2, 5))),
            (GQ(F(2, 5)), GQ(F(4, 5))),
        )
        odd = GQ(F(2, 5))
        eta = gq_vector(1, 1)
        phi = gq_vector(2, -1)
        e0 = gq_vector(1, 0)

        self.assertEqual(inner(eta, phi), GONE)
        self.assertEqual(matvec(matrix, phi), gq_vector(0, 0))
        adjugate_e0 = gq_vector(F(4, 5), F(-2, 5))
        self.assertEqual(adjugate_e0, scale(odd, phi))

        # D A-O D=(2/5,2/5)=beta*eta^*.
        commutator_row = (
            matrix[1][0],
            matrix[1][1] - odd,
        )
        self.assertEqual(commutator_row, gq_vector(F(2, 5), F(2, 5)))

        phase = GQ(F(3, 5), F(4, 5))
        base_anchor = (GQ(F(3, 5)), GQ(F(0), F(4, 5)))
        anchor = scale(phase, base_anchor)
        complement = (GQ(F(0), F(4, 5)), GQ(F(3, 5)))

        self.assertEqual(inner(anchor, anchor), GONE)
        self.assertEqual(inner(complement, complement), GONE)
        self.assertEqual(inner(anchor, complement), GZERO)

        p = inner(anchor, phi)
        kappa0 = inner(e0, anchor)
        phi0 = inner(e0, phi)

        def d0_inverse(value: GQ) -> tuple[GQ, ...]:
            # H0=ker(1,1) is spanned by h=(-1,1), with D h=1.
            return scale(value, gq_vector(-1, 1))

        def rcal(value: GQ) -> tuple[GQ, ...]:
            primitive = d0_inverse(value / odd)
            return oblique_project(primitive, anchor, phi, p)

        b = orthogonal_project(matvec(matrix, anchor), anchor)
        u = rcal(anchor[1])
        gamma = inner(u, b)

        compression = inner(complement, matvec(matrix, complement))
        self.assertEqual(compression, GQ(F(52, 125)))

        # G=P D0^{-1} D|K and its one-dimensional determinant.
        g_of_w = oblique_project(
            d0_inverse(complement[1]), anchor, phi, p
        )
        det_g = inner(complement, g_of_w)
        self.assertEqual(det_g, kappa0.conjugate() / p)
        self.assertEqual(det_g, GQ(F(9, 26), F(-3, 13)))

        relative = compression / odd
        transported_det = det_g * relative
        transported_w = rcal(compression * complement[1])
        direct_det = inner(complement, transported_w)

        self.assertEqual(relative, GQ(F(26, 25)))
        self.assertEqual(direct_det, transported_det)
        self.assertEqual(direct_det, GONE - gamma.conjugate())
        self.assertEqual(direct_det, GQ(F(9, 25), F(-6, 25)))
        self.assertEqual(gamma, GQ(F(16, 25), F(-6, 25)))

        denominator = GONE - gamma
        self.assertEqual(
            denominator,
            origin_feedback(kappa0, p, phi0),
        )
        self.assertEqual(denominator, GQ(F(9, 25), F(6, 25)))

        # Exact adversaries for the three common complex-conjugation errors.
        self.assertNotEqual(direct_det, GONE - gamma)
        self.assertNotEqual(det_g, kappa0 / p)
        self.assertNotEqual(
            denominator,
            kappa0 * inner(phi, anchor) / phi0,
        )

        # Adjoint/source-amplitude collapse, written without sqrt(5):
        # xi/xi0=Phi/Phi0 on the same ground line.
        c = inner(rcal(complement[1]), b)
        expected_c = -kappa0 * inner(complement, phi) / phi0
        self.assertEqual(c, expected_c)

    def test_exact_source_cauchy_extension_and_original_checkpoint_value(self):
        a0 = QS2(F(1, 5))
        a1 = QS2(F(4, 5), F(-1, 5))
        cauchy_b = {
            -1: QS2(F(0), F(-1, 5)),
            0: QZERO,
            1: QS2(F(0), F(1, 5)),
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
            (QS2(F(1, 5)), QS2(F(2, 5))),
            (QS2(F(2, 5)), QS2(F(4, 5))),
        )
        odd = QS2(F(4, 5), F(-2, 5))
        beta = QS2(F(2, 5))
        self.assertTrue(odd.is_positive())

        commutator_row = (q_plus[1][0], q_plus[1][1] - odd)
        self.assertEqual(commutator_row, (beta, beta * ROOT2))

        boundary_ground = QS2(F(-2), F(1))
        phi = (QS2(F(-2)) / boundary_ground, QONE / boundary_ground)
        adjugate_e0 = (QS2(F(4, 5)), QS2(F(-2, 5)))
        self.assertEqual(adjugate_e0, tuple(odd * entry for entry in phi))

        checkpoint = rational_anchor_data(F(1, 3))
        self.assertEqual(checkpoint["k0"], F(3, 5))
        self.assertEqual(checkpoint["k1"], F(4, 5))
        self.assertEqual(checkpoint["denominator"], F(3, 25))
        self.assertEqual(checkpoint["c"], F(33, 50))
        self.assertEqual(checkpoint["a"], F(11, 2))
        self.assertEqual(checkpoint["alignment"], F(121, 4))

    def test_parametric_source_class_has_shrinking_feedback_without_cancellation(self):
        data_10 = rational_anchor_data(F(1, 10))
        data_100 = rational_anchor_data(F(1, 100))
        data_1000 = rational_anchor_data(F(1, 1000))

        for data in (data_10, data_100, data_1000):
            self.assertGreater(data["compression"], 0)
            self.assertNotEqual(data["denominator"], 0)
            self.assertEqual(data["denominator"] * data["a"], data["c"])
            self.assertEqual(data["alignment"], data["a"] * data["a"])

        self.assertLess(abs(data_1000["denominator"]), abs(data_100["denominator"]))
        self.assertLess(abs(data_100["denominator"]), abs(data_10["denominator"]))
        self.assertLess(abs(data_1000["c"]), abs(data_100["c"]))
        self.assertGreater(data_1000["alignment"], 4)
        self.assertLess(data_1000["alignment"], data_100["alignment"])
        self.assertLess(data_100["alignment"], data_10["alignment"])

        # 21/89 is an exact rational near the positive root sqrt(5)-2:
        # d=(1-s^2-4s)/(1+s^2)=2/4181.
        near_overlap_zero = rational_anchor_data(F(21, 89))
        self.assertEqual(near_overlap_zero["d"], F(2, 4181))
        self.assertGreater(near_overlap_zero["alignment"], 4_000_000)

    def test_exact_cluster_identity_and_complementary_energy(self):
        kappa0 = F(3, 7)
        xi0 = F(4, 5)
        alpha = F(2, 9)
        ground_coefficients = (F(1, 3), F(-2, 7), F(5, 11))
        theta = (F(1, 4), F(2), F(9))
        denominator = kappa0 * alpha / xi0
        a = tuple(-value / alpha for value in ground_coefficients)
        c = tuple(-kappa0 * value / xi0 for value in ground_coefficients)

        for left, right in zip(c, a):
            self.assertEqual(left, denominator * right)

        tau = F(2)
        low_indices = tuple(index for index, value in enumerate(theta) if value <= tau)
        screened_low = sum((c[index] ** 2 for index in low_indices), F(0)) / (
            denominator * denominator
        )
        projective_low = sum(
            (ground_coefficients[index] ** 2 for index in low_indices), F(0)
        ) / (alpha * alpha)
        self.assertEqual(screened_low, projective_low)

        full_screened = sum((value * value for value in c), F(0)) / (
            denominator * denominator
        )
        full_projective = sum(
            (value * value for value in ground_coefficients), F(0)
        ) / (alpha * alpha)
        self.assertEqual(full_screened, full_projective)

        beta_from_a = sum(
            (theta[index] * a[index] * a[index] for index in range(3)),
            F(0),
        )
        beta_from_ground = sum(
            (
                theta[index]
                * ground_coefficients[index]
                * ground_coefficients[index]
                for index in range(3)
            ),
            F(0),
        ) / (alpha * alpha)
        self.assertEqual(beta_from_a, beta_from_ground)

    def test_anchor_origin_bound_is_exact_and_fail_closed(self):
        # sqrt(L)=7, sqrt(L)|kappa0|=3>=K_lower=2.
        sqrt_l = F(7)
        kappa0 = F(3, 7)
        alpha = F(1, 9)
        xi0 = F(3, 5)
        k_lower = F(2)
        denominator = kappa0 * alpha / xi0
        inverse_feedback = 1 / abs(denominator)
        corollary_bound = sqrt_l / (k_lower * abs(alpha))
        self.assertLessEqual(inverse_feedback, corollary_bound)

        base = dict(kappa0=F(1), p=F(1), phi0=F(1))
        bad_flags = (
            "simple_ground",
            "a_hermitian_psd",
            "odd_invertible",
            "odd_self_adjoint",
            "boundary_visible",
            "commutator_exact",
            "delta_e0_one",
            "d_kernel_exact",
            "unit_anchor",
            "compression_positive",
            "d0_invertible",
            "source_identity",
        )
        for flag in bad_flags:
            kwargs = dict(base)
            kwargs[flag] = False
            with self.subTest(flag=flag):
                with self.assertRaisesRegex(ValueError, "failed gate"):
                    origin_feedback(**kwargs)

        for zero_key in ("kappa0", "p", "phi0"):
            kwargs = dict(base)
            kwargs[zero_key] = F(0)
            with self.subTest(zero_key=zero_key):
                with self.assertRaisesRegex(ValueError, "zero"):
                    origin_feedback(**kwargs)

        with self.assertRaisesRegex(ValueError, "nonpositive odd complementary gap"):
            origin_feedback(**base, rate_branch=True, odd_positive=False)

        # Odd positivity is not silently added to the purely algebraic identity.
        self.assertEqual(
            origin_feedback(**base, rate_branch=False, odd_positive=False),
            1,
        )

    def test_note_serializes_scope_sources_and_all_exact_collapses(self):
        root = Path(__file__).resolve().parents[1]
        note = (root / "notes" / "SCREENED_FEEDBACK_ORIGIN_COLLAPSE.md").read_text(
            encoding="utf-8"
        )
        required = (
            "1-\\overline\\gamma",
            "\\det G={\\overline{\\kappa _0}\\over p}",
            "source relative-determinant identity",
            "1-\\gamma={\\kappa _0\\alpha\\over\\xi _0}",
            "D_K^*\\mathcal R^*b=(1-\\gamma)B^{-1}b",
            "Exact cluster identity",
            "|1-\\gamma|^{-1}=\\lambda^{o(1)}",
            "require the rate-branch gate `O>0`",
            "no admitted actual-source theorem",
            "G_\\lambda(t)=e^t-\\psi_C(e^t)",
            "1<n<=lambda^2",
            "minus-prime",
            "logical source-class countermodel",
            "P0_INVALIDATED",
        )
        for phrase in required:
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, note)

        # Construct the forbidden terminal labels without serializing them in
        # this theorem-only package.
        forbidden = ("RH_" + "PROVED", "CERT" + "IFIED")
        for phrase in forbidden:
            with self.subTest(forbidden=phrase):
                self.assertNotIn(phrase, note)


if __name__ == "__main__":
    unittest.main()
