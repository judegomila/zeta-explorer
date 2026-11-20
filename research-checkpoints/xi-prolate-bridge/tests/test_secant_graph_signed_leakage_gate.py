from __future__ import annotations

from fractions import Fraction
from pathlib import Path
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SECANT_GRAPH_SIGNED_LEAKAGE_GATE.md"


def dot(left: tuple[Fraction, ...], right: tuple[Fraction, ...]) -> Fraction:
    return sum((x * y for x, y in zip(left, right)), Fraction(0))


def matvec(
    matrix: tuple[tuple[Fraction, ...], ...],
    vector: tuple[Fraction, ...],
) -> tuple[Fraction, ...]:
    return tuple(dot(row, vector) for row in matrix)


def quadratic(
    vector: tuple[Fraction, ...],
    matrix: tuple[tuple[Fraction, ...], ...],
) -> Fraction:
    return dot(vector, matvec(matrix, vector))


def mp_fraction(value: Fraction) -> mp.mpf:
    return mp.mpf(value.numerator) / value.denominator


def ritz_lowering(chi: Fraction, residual: Fraction) -> mp.mpf:
    chi_mp = mp_fraction(chi)
    residual_mp = mp_fraction(residual)
    return 2 * residual_mp**2 / (
        mp.sqrt(chi_mp**2 + 4 * residual_mp**2) + chi_mp
    )


class NoteContractTests(unittest.TestCase):
    def test_claim_boundary_and_exact_gate_are_explicit(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        for token in (
            "P0_INVALIDATED",
            "Lebesgue measure",
            "zero extension",
            "1<n<=lambda^2",
            "minus sign from source equation (3.19)",
            "source normalization",
            "U<=q",
            "B_U",
            "cross vector `g` is shift-invariant",
            "Q-UI+rI",
            "ell=\\beta g",
            "Qz_0=-\\rho_0",
            "Qp=-\\rho_\\lambda",
            "necessary and sufficient",
            "physical Hilbert complement",
            "not a source-coordinate vector",
            "signed spectral pairing",
            "minimum-energy **quotient** interpretation",
            "is neither `||v||^2` nor",
            "introduces no hidden effectiveness assumption",
            "Q_SHIFT_SECTOR_WEIL_CORE_GATE.md",
            "RH-level signed arithmetic information",
            "actual two-vector Ritz shift `U=u`",
            "RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md",
            "A_{\\rm R}",
            "d=q-U",
            "actual ground correction",
            "0.1576707808",
            "not the matrix assembled from the pinned source formulas",
            "equation (5.2)",
            "locally uniform determinant convergence",
            "nor the Riemann hypothesis",
        ):
            self.assertIn(token, normalized)

        self.assertNotIn("assume every nontrivial zeta zero is real", text.lower())
        self.assertNotIn("global weil positivity holds", text.lower())


class ExactSignedLeakageGateTests(unittest.TestCase):
    def setUp(self) -> None:
        # Basis order: (kappa, omega, F).  The complement block is
        # [[epsilon,g],[g,C]]=[[5,2],[2,3]].
        self.q_shifted: tuple[tuple[Fraction, ...], ...] = (
            (Fraction(0), Fraction(1), Fraction(2)),
            (Fraction(1), Fraction(5), Fraction(2)),
            (Fraction(2), Fraction(2), Fraction(3)),
        )
        self.alpha = Fraction(3, 5)
        self.beta = Fraction(2, 7)
        self.anchor_norm = Fraction(7, 4)
        self.ridge = Fraction(1)
        self.lowering = Fraction(2)  # q-U

    def test_graph_load_and_weak_residual_sign_are_exact(self) -> None:
        kappa = (Fraction(1), Fraction(0), Fraction(0))
        omega = (Fraction(0), Fraction(1), Fraction(0))
        z0 = tuple(
            self.alpha * x + self.beta * y for x, y in zip(kappa, omega)
        )
        p = tuple(self.anchor_norm * x for x in kappa)

        b = matvec(self.q_shifted, kappa)
        qz0 = matvec(self.q_shifted, z0)
        U_shifted_z0 = tuple(
            value + self.lowering * coordinate
            for value, coordinate in zip(qz0, z0)
        )
        qp = matvec(self.q_shifted, p)
        graph_load = qz0[2] - self.alpha * b[2]
        U_graph_load = U_shifted_z0[2] - self.alpha * b[2]
        self.assertEqual(graph_load, self.beta * Fraction(2))
        self.assertEqual(U_graph_load, graph_load)

        # Riesz vectors of the weak leakage functionals have the forced
        # sign rho=-Q(finite piece).
        rho0 = tuple(-entry for entry in qz0)
        rho_lambda = tuple(-entry for entry in qp)
        weak_mismatch = -rho0[2] + (
            self.alpha / self.anchor_norm
        ) * rho_lambda[2]
        wrong_sign_mismatch = rho0[2] + (
            self.alpha / self.anchor_norm
        ) * rho_lambda[2]
        self.assertEqual(weak_mismatch, graph_load)
        self.assertNotEqual(wrong_sign_mismatch, graph_load)

    def test_short_ratio_is_exactly_the_inverse_energy_defect(self) -> None:
        epsilon_q = Fraction(5)
        epsilon_U = epsilon_q + self.lowering
        g = Fraction(2)
        C_q = Fraction(3)
        C_U = C_q + self.lowering
        D = C_U + self.ridge
        ell = self.beta * g
        delta = epsilon_U + self.ridge - g * g / D
        ratio = delta / (epsilon_U + self.ridge)
        inverse_energy_fraction = (
            ell * ell
            / D
            / (self.beta * self.beta * (epsilon_U + self.ridge))
        )

        self.assertEqual(delta, Fraction(22, 3))
        self.assertEqual(ratio, Fraction(11, 12))
        self.assertEqual(inverse_energy_fraction, Fraction(1, 12))
        self.assertEqual(ratio, 1 - inverse_energy_fraction)

        # In one dimension the dual supremum is attained by every nonzero
        # scalar multiple of the basis vector.
        trial = Fraction(13, 11)
        dual_quotient = (trial * ell) ** 2 / (trial * trial * D)
        self.assertEqual(dual_quotient, ell * ell / D)
        rho = Fraction(11, 12)
        self.assertEqual(
            dual_quotient,
            (1 - rho) * self.beta**2 * (epsilon_U + self.ridge),
        )

    def test_harmonic_capture_formula_keeps_two_inverse_powers(self) -> None:
        epsilon_U = Fraction(7)
        g = Fraction(2)
        D = Fraction(6)
        ell = self.beta * g
        delta = Fraction(22, 3)
        short_ratio = delta / (epsilon_U + self.ridge)
        # K_T=diag(1/2,1/3) in (omega,F) coordinates.
        K = (
            (Fraction(1, 2), Fraction(0)),
            (Fraction(0), Fraction(1, 3)),
        )
        v = (Fraction(1), -g / D)
        c_squared = K[0][0]
        graph_reserve = quadratic(v, K) / (short_ratio * c_squared)
        correction_squared = ell * ell * K[1][1] / (D * D)

        self.assertEqual(v, (Fraction(1), Fraction(-1, 3)))
        self.assertEqual(correction_squared, self.beta**2 / Fraction(27))
        self.assertEqual(graph_reserve, Fraction(116, 99))
        self.assertNotEqual(
            correction_squared,
            ell * ell * K[1][1] / D,
        )


class GrowingSourceCauchyCounterfamilyTests(unittest.TestCase):
    @staticmethod
    def parameters(j: int) -> tuple[int, Fraction, Fraction, Fraction, Fraction]:
        N = 2 * j * j
        E = Fraction(1, 2 ** (j * j))
        tau = E / (2 * j**4)
        H = E * j**6
        residual = E / j**3
        return N, E, tau, H, residual

    def test_exact_cauchy_displacement_inversion_and_strict_diagonals(self) -> None:
        j = 3
        N, E, tau, H, residual = self.parameters(j)
        indices = range(-N, N + 1)

        def diagonal(n: int) -> Fraction:
            n = abs(n)
            if n == 0:
                return Fraction(0)
            if n == 1:
                return 2 * tau
            if n == 2:
                return E - tau
            return H + tau

        def displacement(n: int) -> Fraction:
            return tau * n

        def entry(n: int, m: int) -> Fraction:
            if n == m:
                return diagonal(n)
            return (displacement(n) - displacement(m)) / (n - m)

        for n in indices:
            for m in indices:
                self.assertEqual(entry(n, m), entry(m, n))
                self.assertEqual(entry(n, m), entry(-n, -m))
                self.assertEqual(
                    (n - m) * entry(n, m),
                    displacement(n) - displacement(m),
                )
                if n != m:
                    self.assertEqual(entry(n, m), tau)

        self.assertNotEqual(displacement(1), 0)
        self.assertGreater(tau, 0)
        self.assertGreater(E - 2 * tau, 0)
        self.assertGreater(H, 0)
        self.assertEqual(residual, 2 * j * tau)

        # The residual direction is the normalized all-ones vector in the
        # even complement.  Evaluate its exact B_q Rayleigh value.
        chi = (
            tau + (E - 2 * tau) + (N - 2) * H
        ) / N + 2 * tau * N
        self.assertGreater(chi, 0)
        with mp.workdps(100):
            t = ritz_lowering(chi, residual)
            residual_mp = mp_fraction(residual)
            chi_mp = mp_fraction(chi)
            self.assertGreater(t, 0)
            self.assertLess(t, residual_mp)
            self.assertLess(
                abs(t * (chi_mp + t) - residual_mp**2) / residual_mp**2,
                mp.mpf("1e-90"),
            )
            # q=0: the lower eigenvalue of [[0,r],[r,chi]] is -t.
            lower_ritz = (chi_mp - mp.sqrt(chi_mp**2 + 4 * residual_mp**2)) / 2
            self.assertLess(abs(lower_ritz + t), mp.mpf("1e-90"))
            self.assertGreater(mp_fraction(tau) + t, 0)
            self.assertGreater(mp_fraction(E - 2 * tau) + t, 0)
            self.assertGreater(mp_fraction(H) + t, 0)

    def test_scalar_tests_pass_while_variational_short_collapses(self) -> None:
        previous_short_bound = None
        for j in (4, 8, 16):
            N, E, tau, H, residual = self.parameters(j)
            epsilon_q = (E + 7 * tau) / 2
            beta = Fraction(1, 2**j)
            d = 2 * tau
            D0 = 2 * beta * d + beta * beta * epsilon_q

            self.assertLessEqual(
                D0 / (beta * epsilon_q), Fraction(4, j**4) + beta
            )

            chi = (
                tau + (E - 2 * tau) + (N - 2) * H
            ) / N + 2 * tau * N
            with mp.workdps(180):
                t = ritz_lowering(chi, residual)
                residual_mp = mp_fraction(residual)
                epsilon_q_mp = mp_fraction(epsilon_q)
                tau_mp = mp_fraction(tau)
                epsilon_U = epsilon_q_mp + t

                self.assertGreater(t, 0)
                self.assertLess(t, residual_mp)
                self.assertLessEqual(
                    residual_mp / epsilon_U,
                    mp.mpf(2) / j**3,
                )

                delta_trial = 2 * (3 * tau_mp + t + residual_mp)
                short_bound = delta_trial / (epsilon_U + residual_mp)
                self.assertLessEqual(
                    short_bound,
                    mp.mpf(8) / j**3 + mp.mpf(6) / j**4,
                )

                # If the genuine time-band capture is at least 1/4, the
                # graph soft term has this exact lower bound.
                graph_soft_lower = residual_mp / (4 * delta_trial)
                stated_lower = mp.mpf(1) / (16 + mp.mpf(12) / j)
                self.assertGreaterEqual(graph_soft_lower, stated_lower)
                self.assertGreaterEqual(graph_soft_lower, mp.mpf(1) / 20)
                if previous_short_bound is not None:
                    self.assertLess(short_bound, previous_short_bound)
                previous_short_bound = short_bound

    def test_high_component_bound_is_beyond_the_fixed_low_plane(self) -> None:
        j = 10
        _N, E, tau, H, residual = self.parameters(j)
        delta_trial = 2 * (3 * tau + 2 * residual)
        high_norm_squared_bound = delta_trial / H
        self.assertLess(high_norm_squared_bound, Fraction(5, j**9))

    def test_actual_ground_nondecay_and_ritz_factor_tends_to_one(self) -> None:
        target_y = (mp.sqrt(17) - 3) / 2
        target_energy = 2 * (1 - target_y) ** 2 / (1 + target_y) ** 2
        previous_y_error = None
        previous_energy_error = None
        for j in (4, 8, 16):
            N, E, tau, H, residual = self.parameters(j)
            with mp.workdps(120):
                def equation(y: mp.mpf) -> mp.mpf:
                    rhs = (
                        1 / (1 + y)
                        + 1 / (2 * j**4 - 2 + y)
                        + (N - 2) / (2 * j**10 + y)
                    )
                    return y / (2 * (1 - y)) - rhs

                y = mp.findroot(equation, (mp.mpf("0.4"), mp.mpf("0.7")))
                z1 = mp.sqrt(2) * (1 - y) / (1 + y)
                energy = z1**2
                y_error = abs(y - target_y)
                energy_error = abs(energy - target_energy)
                if previous_y_error is not None:
                    self.assertLess(y_error, previous_y_error)
                    self.assertLess(energy_error, previous_energy_error)
                previous_y_error = y_error
                previous_energy_error = energy_error

                chi = (
                    mp_fraction(tau)
                    + mp_fraction(E - 2 * tau)
                    + (N - 2) * mp_fraction(H)
                ) / N + 2 * mp_fraction(tau) * N
                lowering = 2 * mp_fraction(residual) ** 2 / (
                    mp.sqrt(chi**2 + 4 * mp_fraction(residual) ** 2) + chi
                )
                delta = lowering / mp_fraction(residual)
                A_R = 1 + delta + delta * (1 + delta) ** 2 / 2
                self.assertLess(delta, 1 / (j**9 - j**7))
                self.assertGreaterEqual(A_R, 1)

        self.assertLess(previous_y_error, mp.mpf("1e-4"))
        self.assertLess(previous_energy_error, mp.mpf("1e-4"))
        self.assertGreater(target_energy, mp.mpf("0.15"))


if __name__ == "__main__":
    unittest.main()
