#!/usr/bin/env python3
"""Exact regressions for the anchored central screw reduction.

Only standard-library exact arithmetic is used.  No zero table, numerical
prolate state, or cached Weil matrix enters these tests.
"""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md"

LOCK_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "ZERO_SAMPLING_SOURCE_LOCK.json":
        "f4cad4acb30dbfcdc5b30faafe92934e8958ad1cd11cbf6abea932f902e8c101",
}


class AnchoredCentralDegreeScrewBarrierTests(unittest.TestCase):
    def test_claim_boundary_and_conditional_separation(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "complete source discrepancy",
            "explicitly **UNADMITTED**",
            "is context only",
            "P0_INVALIDATED",
            r"1<n<=lambda^2",
            r"\int_0^\infty e^{-qt}F_{\rm align}(t)",
            r"c_\infty={1\over2}\{\psi(1/4)-\log\pi+4\}",
            r"\int_0^\infty e^{-qT}g(T)",
            r"\Re q>{1\over2}",
            r"d_0={2x_0\over\sqrt L}J_L-{2x_0^2\over L}g(L)",
            r"{2P(z^2)\Xi'(z)\over z}",
            r"J_L=O_A(\lambda^{-A})",
            "precise subsequence margin",
            r"-g(L_j)\geq\lambda_j^{-B}",
            "unconditional strict-half-integer screw margin",
            r"c_{\rm screw}={1\over2T_*^2}",
            r"\Psi(L_j)=-g(L_j)>c_{\rm screw}",
            "`xi_R(1/2)>0`",
            r"\sum_{\gamma>0}\gamma^{-2}<\infty",
            r"0<b\leq\sigma_c\leq1/2",
            r"|L_j-t_j|\leq2e^{-t_j/2}",
            r"d_0(\lambda_j)>0",
            "under RH",
            r"d_1={2p_1\over L}\{\sqrt L\,J_L-p_1A_1+T_1\}",
            "conditional reductions",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "RH_PROVED",
            "Riemann hypothesis is proved",
            "actual-source routing contraction holds",
            "g(T)<=0 unconditionally",
            "d_0>0 for all sufficiently large",
            "d_1>0 for all sufficiently large",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)

    def test_protected_source_bytes_are_unchanged(self) -> None:
        for relative, expected in LOCK_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_archimedean_tail_partial_fraction_is_exact(self) -> None:
        for q in (F(2, 3), F(5, 4), F(7, 3)):
            for k in range(8):
                alpha = F(4 * k + 5, 2)
                left = 1 / (alpha * (alpha + q))
                right = (1 / alpha - 1 / (alpha + q)) / q
                self.assertEqual(left, right)

    def test_completed_pole_simplification_is_exact(self) -> None:
        for q in (F(2, 3), F(5, 4), F(7, 3), F(13, 5)):
            self.assertEqual(-2 * q / (q - F(1, 2)) + 2,
                             -1 / (q - F(1, 2)))

    def test_prime_step_fubini_identity_is_exact(self) -> None:
        length = F(7, 2)
        atoms = ((F(2, 5), F(3, 7)),
                 (F(5, 4), F(11, 13)),
                 (F(3), F(17, 19)))
        integrated_steps = sum(weight * (length - location)
                               for location, weight in atoms)
        triangular_inventory = sum(weight * (length - location)
                                   for location, weight in atoms
                                   if location <= length)
        self.assertEqual(integrated_steps, triangular_inventory)

    def test_locked_zero_count_gives_an_exact_positive_lower_bound(self) -> None:
        # The note uses pi<22/7, 2<e<3, log(T*)<35, and
        # log(log(T*))<6.  All remaining comparisons are rational.
        height = 30_610_046_000
        self.assertLess(height, 2**35)
        self.assertLess(35, 2**6)
        self.assertGreater(F(7 * height, 132), 3)
        m_lower = F(7 * height, 44)
        r_upper = F(13, 125) * 35 + F(129, 500) * 6 + F(937, 100)
        self.assertGreater(m_lower - F(1, 8) - r_upper, 0)

    def test_screw_margin_constants_are_exact(self) -> None:
        height = F(30_610_046_000)
        rh_mean_lower = F(2) / height**2
        continuous_hit = F(1) / height**2
        grid_margin = F(1) / (2 * height**2)
        self.assertEqual(continuous_hit, rh_mean_lower / 2)
        self.assertEqual(grid_margin, continuous_hit / 2)
        self.assertGreater(grid_margin, 0)

    def test_landau_branch_is_serialized_fail_closed(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        chain = (
            "If `Psi` were bounded above eventually",
            "The pole at `s_0`",
            r"0<b\leq\sigma_c\leq1/2",
            "continued right side of (3.26) is holomorphic",
            "This contradicts Lemma 3.4",
            r"\limsup_{t\to\infty}\Psi(t)=+\infty",
        )
        positions = [text.index(phrase) for phrase in chain]
        self.assertEqual(positions, sorted(positions))

    def test_nearest_grid_transfer_envelopes_are_exact(self) -> None:
        # For |delta|<=1/2 and y>=1, the two elementary logarithm
        # envelopes used in (3.30) are both at most 2/y.
        for y in (F(1), F(3, 2), F(7), F(101, 3)):
            positive_delta = F(1, 2)
            positive_envelope = 2 * positive_delta / y
            negative_delta = F(-1, 2)
            negative_envelope = 2 * (-negative_delta) / (y + negative_delta)
            self.assertLessEqual(positive_envelope, F(2) / y)
            self.assertLessEqual(negative_envelope, F(2) / y)

        text = NOTE.read_text(encoding="utf-8")
        self.assertIn("strict half-integer `lambda_j`", text)
        self.assertIn("`Psi'=-R` almost", text)
        self.assertIn(r"e^{-a\sqrt {t_j}}=o(1)", text)

    def test_exact_central_degree_decomposition(self) -> None:
        # L=4 makes sqrt(L)=2, so every operation stays rational.
        length = F(4)
        sqrt_length = F(2)
        x = (F(3, 5), F(-2, 7), F(5, 11), F(-7, 13))
        a = (F(-4, 9), F(3, 8), F(-5, 12), F(7, 10))
        b = (F(0),) + tuple(-2 * n * a[n] / length
                            for n in range(1, len(x)))
        raw = -2 * x[0] * sum(b[n] * x[n] / n
                              for n in range(1, len(x)))
        j_value = (x[0] * a[0]
                   + 2 * sum(x[n] * a[n]
                             for n in range(1, len(x)))) / sqrt_length
        reduced = (2 * x[0] / sqrt_length) * j_value \
            - (2 * x[0] ** 2 / length) * a[0]
        self.assertEqual(raw, reduced)

    def test_central_margin_is_strictly_sufficient(self) -> None:
        length = F(9)
        sqrt_length = F(3)
        x0 = F(2, 5)
        screw = F(-7, 4)
        threshold = x0 * (-screw) / sqrt_length
        for j_value in (F(0), threshold / 2, -threshold / 2):
            degree = (2 * x0 / sqrt_length) * j_value \
                - (2 * x0**2 / length) * screw
            self.assertGreater(degree, 0)
        equality_degree = (2 * x0 / sqrt_length) * (-threshold) \
            - (2 * x0**2 / length) * screw
        self.assertEqual(equality_degree, 0)

    def test_leading_convolution_multiplier_factor(self) -> None:
        # If Xi(z)=sum a_k z^(2k), then for Khat=Xi/4 the convolution
        # multiplier is 2*Khat'/z=Xi'/(2z), coefficient by coefficient.
        xi_coefficients = (F(5), F(-7, 3), F(11, 5), F(-13, 7))
        from_k = tuple(F(k) * xi_coefficients[k]
                       for k in range(1, len(xi_coefficients)))
        direct = tuple(F(2 * k) * xi_coefficients[k] / 2
                       for k in range(1, len(xi_coefficients)))
        self.assertEqual(from_k, direct)

    def test_rh_conditional_finite_zero_sum_has_correct_sign(self) -> None:
        # Exact mock values of 1-cos(theta) in {0,1,2}; this checks only
        # the algebraic sign of the finite RH-conditional formula.
        ordinates = (F(3), F(5), F(8), F(13))
        one_minus_cosine = (F(0), F(1), F(2), F(1))
        screw = -2 * sum(value / gamma**2
                         for gamma, value in zip(ordinates,
                                                 one_minus_cosine))
        self.assertLess(screw, 0)

    def test_exact_vertex_one_companion_identity(self) -> None:
        length = F(6)
        p = (F(2, 3), F(-5, 7), F(11, 13), F(-17, 19), F(23, 29))
        a = (F(-3, 5), F(-7, 11), F(13, 17), F(-19, 23), F(29, 31))
        b = (F(0),) + tuple(-2 * n * a[n] / length
                            for n in range(1, len(p)))

        # Convert normalized-even p back to raw x for the checkpoint-0.79
        # formula: p_0=x_0 and p_n=2*x_n for n>=1.
        x0 = p[0]
        x = (x0,) + tuple(entry / 2 for entry in p[1:])
        original = -2 * x[1] * (
            b[1] * x0
            + 2 * sum(x[m] * (b[1] - m * b[m]) / (1 - m * m)
                      for m in range(2, len(x)))
        )

        sqrt_length_j = sum(p[j] * a[j] for j in range(len(p)))
        t1 = sum(p[j] * (a[1] - a[j]) / (1 - j * j)
                 for j in range(len(p)) if j != 1)
        reduced = (2 * p[1] / length) * (
            sqrt_length_j - p[1] * a[1] + t1
        )
        self.assertEqual(original, reduced)

    def test_vertex_one_relative_error_margin(self) -> None:
        length = F(10)
        p1 = F(-3, 4)
        screw = F(-5, 6)
        main = -2 * p1**2 * screw / length
        self.assertGreater(main, 0)
        for error in (F(0), abs(p1 * screw) / 3,
                      -abs(p1 * screw) / 3):
            degree = main + 2 * p1 * error / length
            self.assertGreater(degree, 0)


if __name__ == "__main__":
    unittest.main()
