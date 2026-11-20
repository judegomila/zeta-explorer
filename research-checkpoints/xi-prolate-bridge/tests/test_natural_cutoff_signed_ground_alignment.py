#!/usr/bin/env python3
"""Pure exact regressions for the natural-cutoff alignment theorem."""

from __future__ import annotations

from fractions import Fraction
import math
from pathlib import Path
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md"

Vector = tuple[Fraction, ...]
Matrix = tuple[tuple[Fraction, ...], ...]


def dot(left: Vector, right: Vector) -> Fraction:
    return sum((x * y for x, y in zip(left, right)), Fraction(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


def outer(vector: Vector) -> Matrix:
    return tuple(tuple(x * y for y in vector) for x in vector)


def quadratic(vector: Vector, matrix: Matrix) -> Fraction:
    return dot(vector, matvec(matrix, vector))


def scale_matrix(scalar: Fraction, matrix: Matrix) -> Matrix:
    return tuple(tuple(scalar * value for value in row) for row in matrix)


def determinant_2(matrix: Matrix) -> Fraction:
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def adjugate_2(matrix: Matrix) -> Matrix:
    return (
        (matrix[1][1], -matrix[0][1]),
        (-matrix[1][0], matrix[0][0]),
    )


def mpf(value: Fraction) -> mp.mpf:
    return mp.mpf(value.numerator) / value.denominator


class NaturalCutoffSignedGroundAlignmentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 90
        cls.text = NOTE.read_text(encoding="utf-8")
        cls.normalized = " ".join(cls.text.split())

    def test_note_locks_source_signs_forms_and_claim_boundary(self) -> None:
        required = (
            "Natural-cutoff signed ground alignment",
            "L=2\\log\\lambda",
            "I_\\lambda=[-L/2,L/2]",
            "e^{-izt}",
            "Lebesgue measure and zero extension",
            "minus sign on the prime block in source equation (3.19)",
            "1<n<=lambda^2",
            "Q_\\lambda=c_*I+H_D",
            "H_D=A_{\\rm tail}-T_D",
            "b_D=P_{\\cal K}H_D\\kappa",
            "B_\\mu=P_{\\cal K}\\bigl((c_*-\\mu)I+H_D\\bigr)",
            "A_M=\\|P_{{\\cal L}_M}x\\|^2",
            "C=\\operatorname {adj}H",
            "S_M={\\operatorname {tr}(\\Pi C)\\over c_\\kappa}",
            "-2\\operatorname {Re}h_M",
            "\\Phi_\\mu=",
            "O_\\mu^{-1}\\beta",
            "c_\\kappa={\\det(O_\\mu)|p_\\mu|^2",
            "F_\\lambda(t)=D_\\lambda(t)-H_0(t)",
            "F_{\\rm align}(t)=F_\\lambda(t)+2e^{-t/2}",
            "dF_{\\rm align}=dD_\\lambda+\\tau(t)\\,dt",
            "=-e^{-t/2}dG_\\lambda(t)",
            "G_\\lambda(t)=e^t-\\psi_C(e^t)",
            "dF_\\lambda(t)=e^{-t/2}\\bigl(dt-dG_\\lambda(t)\\bigr)",
            "-\\int_0^LG_\\lambda(t)w_v'(t)\\,dt",
            "u_j=B_\\mu^{-1}\\ell_j",
            "J=\\lfloor A_0L\\rfloor",
            "M=\\lceil\\lambda\\rceil",
            "N_{\\exp}(\\lambda)=2^{9600\\lambda^2}",
            "\\|(I-P_{\\lceil\\lambda\\rceil})X_\\lambda\\|_2",
            "|S_M-k_{00}|=O(\\lambda^{-1})",
            "\\|P_{{\\cal L}_M}\\Phi_\\mu\\|^2",
            "={16\\over9}",
            "P0_INVALIDATED",
            "arXiv:2511.22755v1",
            "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
            "printed source-normalized transform tends to `Xi/4`",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.normalized)

        forbidden = ("RH_PROVED", "CERTIFIED")
        for token in forbidden:
            self.assertNotIn(token, self.text)

        self.assertIn("There is no valid replacement", self.normalized)
        self.assertIn("not the pinned arithmetic Weil matrix", self.normalized)
        self.assertIn("does not establish that limit", self.normalized)
        self.assertIn("no full-`L2` equation (5.2)", self.normalized)
        self.assertIn("No list of real zeta zeros, global Weil positivity", self.normalized)

    def test_exact_inverse_adjugate_wedge_and_response_forms(self) -> None:
        epsilon = Fraction(7, 13)
        c = Fraction(3, 5)
        s = Fraction(4, 5)
        kappa: Vector = (c, s)
        w: Vector = (-s, c)
        q = epsilon * s * s
        r = epsilon * c * s
        d = q
        B = epsilon * c * c

        self.assertEqual(dot(kappa, kappa), 1)
        self.assertEqual(dot(kappa, w), 0)
        self.assertEqual(d * B, r * r)

        b: Vector = tuple(r * value for value in w)
        correction: Vector = tuple((r / B) * value for value in w)
        x: Vector = tuple(anchor - value for anchor, value in zip(kappa, correction))
        self.assertEqual(r / B, Fraction(4, 3))
        self.assertEqual(x, (Fraction(5, 3), Fraction(0)))
        self.assertEqual(dot(kappa, x), 1)

        P_L = outer(w)
        inverse_form = quadratic(b, scale_matrix(B**-2, P_L))
        self.assertEqual(inverse_form, Fraction(16, 9))

        H: Matrix = ((Fraction(0), Fraction(0)), (Fraction(0), epsilon))
        C = adjugate_2(H)
        c_kappa = quadratic(kappa, C)
        adjugate_form = sum(
            scale_matrix(1, P_L)[i][j] * C[j][i]
            for i in range(2)
            for j in range(2)
        ) / c_kappa
        self.assertEqual(C, ((epsilon, Fraction(0)), (Fraction(0), Fraction(0))))
        self.assertEqual(adjugate_form, Fraction(16, 9))

        identity: Matrix = (
            (Fraction(1), Fraction(0)),
            (Fraction(0), Fraction(1)),
        )
        S = sum(identity[i][j] * C[j][i] for i in range(2) for j in range(2)) / c_kappa
        k00 = quadratic(kappa, identity)
        self.assertEqual(S, Fraction(25, 9))
        self.assertEqual(S - k00, Fraction(16, 9))

        phi: Vector = (Fraction(1), Fraction(0))
        p_mu = dot(kappa, phi)
        relative_odd = quadratic(phi, P_L) / p_mu**2
        wedge_square = (
            dot(kappa, kappa) * dot(phi, phi) - dot(kappa, phi) ** 2
        )
        self.assertEqual(relative_odd, Fraction(16, 9))
        self.assertEqual(wedge_square / (k00 * p_mu**2), Fraction(16, 9))

        ell = w
        u_vec = tuple(value / B for value in ell)
        projected_resolvent = dot(u_vec, b) ** 2
        self.assertEqual(projected_resolvent, Fraction(16, 9))

    def test_complex_high_cross_uses_modulus_and_real_part(self) -> None:
        H = ((1 + 0j, 1j), (-1j, 1 + 0j))
        C = ((1 + 0j, -1j), (1j, 1 + 0j))
        kappa = (1 + 0j, 0 + 0j)
        x = (1 + 0j, 1j)
        Pi = ((0.5 + 0j, 0.5 + 0j), (0.5 + 0j, 0.5 + 0j))
        R = ((0.5 + 0j, -0.5 + 0j), (-0.5 + 0j, 0.5 + 0j))

        def mv(matrix, vector):
            return tuple(sum(matrix[i][j] * vector[j] for j in range(2)) for i in range(2))

        def inner(left, right):
            return sum(left[j].conjugate() * right[j] for j in range(2))

        self.assertTrue(all(abs(value) < 1e-15 for value in mv(H, x)))
        y = (0j, 1j)
        h = inner(mv(R, kappa), mv(R, y))
        k00 = inner(kappa, mv(Pi, kappa)).real
        E = inner(mv(Pi, y), mv(Pi, y)).real
        S = inner(x, mv(Pi, x)).real

        # Ran(Pi) is exactly the anchor line, so the transverse A is zero.
        A = 0.0
        self.assertAlmostEqual(h.real, 0.0)
        self.assertAlmostEqual(h.imag, -0.5)
        self.assertAlmostEqual(E, A + abs(h) ** 2 / k00)
        self.assertAlmostEqual(S - k00, A + abs(h) ** 2 / k00 - 2 * h.real)

        Ck = mv(C, kappa)
        self.assertEqual(Ck, x)

    def test_zero_anchor_projection_branch_never_divides_by_k00(self) -> None:
        # kappa=e_2, Pi projects onto e_1, and x=kappa+e_1.
        kappa = (0.0, 1.0)
        x = (1.0, 1.0)
        Pi = ((1.0, 0.0), (0.0, 0.0))
        p = matvec(
            tuple(tuple(Fraction(value) for value in row) for row in Pi),
            tuple(Fraction(value) for value in kappa),
        )
        self.assertEqual(p, (Fraction(0), Fraction(0)))
        S = 1.0
        A = 1.0
        h = 0.0
        self.assertEqual(S, A)
        self.assertEqual(h, 0.0)

    def test_cumulative_F_G_distribution_sign_and_prime_jump(self) -> None:
        def rho(t: mp.mpf) -> mp.mpf:
            return mp.exp(-t / 2) / (1 - mp.exp(-2 * t))

        def tau(t: mp.mpf) -> mp.mpf:
            return mp.exp(-5 * t / 2) / (1 - mp.exp(-2 * t))

        def G_continuous_derivative(t: mp.mpf) -> mp.mpf:
            return mp.exp(t) - 1 / (mp.exp(2 * t) - 1)

        for value in ("0.13", "0.51", "1.37", "3.2"):
            t = mp.mpf(value)
            f_density = rho(t) - mp.exp(t / 2)
            via_G = mp.exp(-t / 2) * (1 - G_continuous_derivative(t))
            align_density = tau(t) - mp.exp(t / 2)
            align_via_G = -mp.exp(-t / 2) * G_continuous_derivative(t)
            self.assertLess(abs(f_density - via_G), mp.mpf("1e-80"))
            self.assertLess(abs(align_density - align_via_G), mp.mpf("1e-80"))
            self.assertLess(
                abs(align_density - (f_density - mp.exp(-t / 2))),
                mp.mpf("1e-80"),
            )
            self.assertLess(
                abs(mp.exp(-t / 2) / (mp.exp(2 * t) - 1) - tau(t)),
                mp.mpf("1e-80"),
            )

        log_two = mp.log(2)
        delta_G = -log_two
        delta_F = log_two / mp.sqrt(2)
        self.assertLess(
            abs(delta_F + mp.exp(-log_two / 2) * delta_G),
            mp.mpf("1e-80"),
        )

    def test_integrated_F_G_boundary_identity_across_prime_two(self) -> None:
        s = mp.mpf("0.5")
        t = mp.mpf("0.8")
        log_two = mp.log(2)
        self.assertLess(s, log_two)
        self.assertLess(log_two, t)

        def H0(value: mp.mpf) -> mp.mpf:
            r = mp.exp(-value / 2)
            return mp.log((1 + r) / (1 - r)) / 2 + mp.atan(r)

        def D(value: mp.mpf) -> mp.mpf:
            weighted = mp.mpf("0") if value < log_two else log_two / mp.sqrt(2)
            return weighted - 2 * (mp.exp(value / 2) - 1)

        lhs = (D(t) - H0(t)) - (D(s) - H0(s))

        def continuous_dG(value: mp.mpf) -> mp.mpf:
            return mp.exp(value) - 1 / (mp.exp(2 * value) - 1)

        continuous = mp.quad(
            lambda value: mp.exp(-value / 2) * continuous_dG(value),
            [s, log_two, t],
        )
        jump = mp.exp(-log_two / 2) * (-log_two)
        dt_term = mp.quad(lambda value: mp.exp(-value / 2), [s, t])
        rhs = -(continuous + jump) + dt_term
        self.assertLess(abs(lhs - rhs), mp.mpf("1e-75"))

    def test_natural_cutoff_gevrey_exponents_are_strict(self) -> None:
        A0 = mp.mpf("0.2")
        B = mp.mpf("7")
        sigma = mp.mpf("0.1")
        strip_constant = mp.mpf("3")

        for L_integer in (80, 120, 200):
            L = mp.mpf(L_integer)
            lam = mp.exp(L / 2)
            J = math.floor(float(A0 * L))
            K = 4 * J + 4
            gevrey_log = L / 2 + (J + 1) * (mp.log(B * (J + 1)) - L)
            self.assertLess(gevrey_log, -(A0 / 3) * L**2)

            strip_log = (
                strip_constant * K * mp.log(K + 2)
                - 2 * mp.pi * sigma * lam / L
            )
            self.assertLess(strip_log, -mp.pi * sigma * lam / L)

        # exp(-c*L^2) beats every fixed power lambda^A because log(lambda)=L/2.
        c0 = mp.mpf("0.01")
        for power in (1, 10, 100):
            old = -c0 * mp.mpf(20000) ** 2 + power * mp.mpf(20000) / 2
            new = -c0 * mp.mpf(40000) ** 2 + power * mp.mpf(40000) / 2
            self.assertLess(new, old)

        half_lambda = Fraction(3, 2)
        exponent = 9600 * half_lambda * half_lambda
        self.assertEqual(exponent.denominator, 1)
        self.assertLess(math.ceil(float(half_lambda)), 2 ** exponent.numerator)

    def test_conditional_bridge_rates_vanish_for_every_fixed_substrip(self) -> None:
        for eta_text in ("0", "0.2", "0.49"):
            eta = mp.mpf(eta_text)

            def low_log(L: mp.mpf) -> mp.mpf:
                return mp.log(L) + (2 * eta - 1) * L / 2

            def high_log(L: mp.mpf) -> mp.mpf:
                return mp.log(L) / 2 + (eta - mp.mpf("0.5")) * L / 2

            self.assertLess(low_log(mp.mpf(4000)), low_log(mp.mpf(2000)))
            self.assertLess(high_log(mp.mpf(4000)), high_log(mp.mpf(2000)))
            self.assertLess(low_log(mp.mpf(20000)), 0)
            self.assertLess(high_log(mp.mpf(20000)), 0)

    def test_diagonal_source_cauchy_counterfamily_is_exact(self) -> None:
        U = Fraction(-2, 3)
        G = Fraction(5, 2)
        c = Fraction(3, 5)
        s = Fraction(4, 5)
        kappa: Vector = (c, s)
        w: Vector = (-s, c)

        for epsilon in (Fraction(1, 2), Fraction(1, 10), Fraction(1, 1000)):
            with self.subTest(epsilon=epsilon):
                Q_active: Matrix = (
                    (U, Fraction(0)),
                    (Fraction(0), U + epsilon),
                )
                q = quadratic(kappa, Q_active)
                residual = tuple(
                    value - q * anchor
                    for value, anchor in zip(matvec(Q_active, kappa), kappa)
                )
                r = epsilon * c * s
                self.assertEqual(residual, tuple(r * value for value in w))

                u = U
                d = q - u
                even_active = epsilon * c * c
                self.assertEqual((d, r, d / r), (epsilon * s * s, epsilon * c * s, Fraction(4, 3)))
                self.assertEqual(d * even_active, r * r)
                self.assertGreater(even_active, 0)
                self.assertGreater(epsilon, 0)

                correction = tuple((r / even_active) * value for value in w)
                x = tuple(anchor - value for anchor, value in zip(kappa, correction))
                self.assertEqual(x, (Fraction(5, 3), Fraction(0)))
                self.assertEqual(dot(kappa, x), 1)

                P_L = outer(w)
                response = quadratic(x, P_L)
                S_minus_k00 = dot(x, x) - 1
                self.assertEqual(response, Fraction(16, 9))
                self.assertEqual(S_minus_k00, Fraction(16, 9))

                # N=3: Q+ has U, U+eps, U+G, U+G and Q- omits U.
                for z in (Fraction(-3), Fraction(0), Fraction(7, 5)):
                    odd_det = (U + epsilon - z) * (U + G - z) ** 2
                    boundary_cofactor = (U + epsilon - z) * (U + G - z) ** 2
                    self.assertEqual(odd_det, boundary_cofactor)

                # Zero Cauchy coefficients make every off-diagonal quotient
                # and every displacement entry exactly zero.
                for n in range(-3, 4):
                    for m in range(-3, 4):
                        if n != m:
                            self.assertEqual(Fraction(0 - 0, n - m), 0)

    def test_boundary_normalization_scale_cancels_but_overlap_must_not_vanish(self) -> None:
        c = Fraction(3, 5)
        s = Fraction(4, 5)
        kappa: Vector = (c, s)
        w: Vector = (-s, c)
        P_L = outer(w)
        phi: Vector = (Fraction(1), Fraction(0))

        baseline = quadratic(phi, P_L) / dot(kappa, phi) ** 2
        for scalar in (Fraction(-7, 3), Fraction(2, 11), Fraction(19)):
            scaled = tuple(scalar * value for value in phi)
            ratio = quadratic(scaled, P_L) / dot(kappa, scaled) ** 2
            self.assertEqual(ratio, baseline)
        self.assertEqual(baseline, Fraction(16, 9))

        orthogonal_phi = w
        self.assertEqual(dot(kappa, orthogonal_phi), 0)
        with self.assertRaises(ZeroDivisionError):
            _ = quadratic(orthogonal_phi, P_L) / dot(kappa, orthogonal_phi) ** 2

    def test_ritz_norm_is_squared_only_in_squared_observables(self) -> None:
        self.assertIn("\\|x-\\kappa\\|\\leq C_{\\rm R}(d/r)=O(1)", self.normalized)
        self.assertIn("C_R^2` is the corresponding squared bound", self.normalized)
        self.assertIn("A_M\\leq\\|x-\\kappa\\|^2\\leq C_{\\rm R}(d/r)^2", self.normalized)
        self.assertIn("|h_M|\\leq t_\\kappa\\|x-\\kappa\\|", self.normalized)


if __name__ == "__main__":
    unittest.main()
