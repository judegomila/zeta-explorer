from __future__ import annotations

from fractions import Fraction
import math
from pathlib import Path
import re
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "RITZ_PROJECTIVE_LOW_MODE_DETERMINANT_GATE.md"


def _matmul(
    left: tuple[tuple[Fraction, ...], ...],
    right: tuple[tuple[Fraction, ...], ...],
) -> tuple[tuple[Fraction, ...], ...]:
    return tuple(
        tuple(
            sum(
                (left[i][k] * right[k][j] for k in range(len(right))),
                Fraction(0),
            )
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


def _subtract(
    left: tuple[tuple[Fraction, ...], ...],
    right: tuple[tuple[Fraction, ...], ...],
) -> tuple[tuple[Fraction, ...], ...]:
    return tuple(
        tuple(left[i][j] - right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def _commutator(
    left: tuple[tuple[Fraction, ...], ...],
    right: tuple[tuple[Fraction, ...], ...],
) -> tuple[tuple[Fraction, ...], ...]:
    return _subtract(_matmul(left, right), _matmul(right, left))


def _is_zero(matrix: tuple[tuple[Fraction, ...], ...]) -> bool:
    return all(entry == 0 for row in matrix for entry in row)


def _validate_cutoffs(M: int, N: int) -> None:
    if isinstance(M, bool) or isinstance(N, bool):
        raise TypeError("M and N must be exact integers")
    if not isinstance(M, int) or not isinstance(N, int):
        raise TypeError("M and N must be exact integers")
    if M < 1 or M >= N:
        raise ValueError("the projective cutoff theorem requires 1<=M<N")


def _a_ritz(delta: Fraction) -> Fraction:
    if delta < 0:
        raise ValueError("delta must be nonnegative")
    if delta <= 1:
        return 1 + delta + delta * (1 + delta) ** 2 / 2
    return 1 + delta + 2 * delta**2


def _pythagorean_pair(t: Fraction) -> tuple[Fraction, Fraction]:
    denominator = 1 + t**2
    return 2 * t / denominator, (1 - t**2) / denominator


class RitzProjectiveLowModeDeterminantGateTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 80
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_states_exact_formula_claim_and_failure_boundaries(self) -> None:
        required = (
            "Ritz projective low-mode determinant gate",
            "Q+t\\Pi_M",
            "K_M=W^*\\Pi_MW",
            "\\|\\Pi_Md_{\\rm pr}\\|^2",
            "A_{\\rm R}(d/r)",
            "\\log(1+\\theta)",
            "a_j^2L_j\\lambda_j^{2\\eta}",
            "M_j=\\lceil\\lambda_j\\rceil<N_j",
            "P0_INVALIDATED",
            "equation (5.2)",
            "minus-prime",
            "1<n<=lambda^2",
            "e^{-izx}",
            "No zero table or global Weil positivity",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.text)
        self.assertNotIn("RH_PROVED", self.text)
        self.assertNotIn("CERTIFIED", self.text)

        response = re.search(
            r"\{\\cal F\}_\{\\theta,M_j\}.*?"
            r"\\over\\log\(1\+\\theta\)",
            self.text,
            flags=re.DOTALL,
        )
        self.assertIsNotNone(response)
        self.assertIn("does not assert", self.text)
        self.assertIn("does not prove either premise", self.text)

    def test_finite_scalar_gate_and_logdet_chord_constants(self) -> None:
        # Exact Ritz regression Q=[[1,2],[2,1]] at U=-1 has
        # d=r=B=2, z=1, and A_R(1)=4.  Use the one-dimensional
        # positive cutoff K=1 and theta=1.
        d = Fraction(2)
        residual_r = Fraction(2)
        B = Fraction(2)
        z = Fraction(1)
        delta = d / residual_r
        A_R = _a_ritz(delta)
        H = residual_r / (B + residual_r)
        F = mp.log(1 + mp.mpf(H.numerator) / H.denominator)
        self.assertEqual(delta, 1)
        self.assertEqual(A_R, 4)
        self.assertEqual(H, Fraction(1, 2))
        self.assertLessEqual(F, mp.mpf(H.numerator) / H.denominator)
        self.assertLessEqual(
            mp.mpf(H.numerator) / H.denominator, F / mp.log(2)
        )
        bound = mp.mpf(A_R.numerator) / A_R.denominator * F / mp.log(2)
        self.assertLessEqual(mp.mpf(z**2), bound)

    def test_squared_gate_cannot_be_replaced_by_unsquared_response(self) -> None:
        # Y stands for A_R*F/log(1+theta), while w stands for
        # a*sqrt(L)*lambda^eta.  The vector error is w*sqrt(Y), not w*Y.
        unsquared_values: list[Fraction] = []
        true_error_bounds: list[Fraction] = []
        squared_gate_values: list[Fraction] = []
        for integer in (10, 100, 1000, 10000):
            weight = Fraction(integer)
            response_bound = Fraction(1, integer**2)
            unsquared_values.append(weight * response_bound)
            true_error_bounds.append(weight * Fraction(1, integer))
            squared_gate_values.append(weight**2 * response_bound)
        self.assertLess(unsquared_values[-1], Fraction(1, 1000))
        self.assertEqual(true_error_bounds, [Fraction(1)] * 4)
        self.assertEqual(squared_gate_values, [Fraction(1)] * 4)
        self.assertIn("The square in (2.7) is essential", self.text)

    def test_theta_to_zero_requires_the_log_divisor(self) -> None:
        # The one-dimensional normalized response eigenvalue is x=1/2.
        # F_theta tends to zero, but F_theta/log(1+theta) tends to x.
        x = mp.mpf(1) / 2
        ratios: list[mp.mpf] = []
        raw: list[mp.mpf] = []
        for exponent in (2, 4, 8, 12):
            theta = mp.mpf(10) ** (-exponent)
            increment = mp.log1p(theta * x)
            raw.append(increment)
            ratios.append(increment / mp.log1p(theta))
        self.assertLess(raw[-1], mp.mpf("1e-12"))
        self.assertLess(abs(ratios[-1] - x), mp.mpf("1e-12"))
        self.assertGreater(ratios[-1], mp.mpf("0.49"))
        self.assertIn("If `theta=theta_j` varies", self.text)
        self.assertIn("1/log(1+theta_j)", self.text)

    def test_complement_only_homotopy_loses_mode_commutation(self) -> None:
        # Pi commutes with the diagonal mode operator.  Compressing it by the
        # anchor complement P_K need not.  All entries are exact rationals.
        mode = ((Fraction(0), Fraction(0)), (Fraction(0), Fraction(1)))
        Pi = ((Fraction(1), Fraction(0)), (Fraction(0), Fraction(0)))
        complement = (
            (Fraction(1, 2), Fraction(-1, 2)),
            (Fraction(-1, 2), Fraction(1, 2)),
        )
        complement_only = _matmul(_matmul(complement, Pi), complement)
        self.assertTrue(_is_zero(_commutator(mode, Pi)))
        self.assertFalse(_is_zero(_commutator(mode, complement_only)))
        self.assertIn("The full homotopy in (4.2) is mandatory", self.text)
        for mandatory in ("b_t&=b+tk_M", "a_t&=d+r+tk_{00}"):
            self.assertIn(mandatory, self.text)
        self.assertIn("unjustified shortcut", self.text)

    def test_cutoff_gate_rejects_M_greater_than_or_equal_to_N(self) -> None:
        _validate_cutoffs(1, 2)
        for M, N in ((1, 1), (2, 1), (4, 4), (5, 4), (0, 4)):
            with self.subTest(M=M, N=N), self.assertRaisesRegex(
                ValueError, "1<=M<N"
        ):
                _validate_cutoffs(M, N)
        with self.assertRaises(TypeError):
            _validate_cutoffs(True, 4)
        self.assertIn("`M>=N` is outside this theorem", self.text)

    def test_zero_residual_is_an_exact_separate_branch(self) -> None:
        # Q_+=diag(q,q+2,q+3), b=0.  Under the strict complement and odd
        # signs, kappa is the ground.  No d/r expression is defined or needed.
        q = Fraction(0)
        complement_eigenvalues = (Fraction(2), Fraction(3))
        residual_r = Fraction(0)
        projective_error_squared = Fraction(0)
        denominator_det = math.prod(complement_eigenvalues)
        numerator_det = math.prod(
            value + residual_r for value in complement_eigenvalues
        )
        self.assertEqual(numerator_det, denominator_det)
        self.assertEqual(projective_error_squared, 0)
        self.assertEqual(mp.log(mp.mpf(numerator_det) / denominator_det), 0)
        with self.assertRaises(ZeroDivisionError):
            _ = (q - q) / residual_r

        # Merely shifting below q is insufficient: A-U>0 can hold while a
        # complementary eigenvalue still lies below q.  The note therefore
        # requires the strict signs at q itself in the r=0 branch.
        lower_shift = Fraction(-2)
        q_bad = Fraction(0)
        complement_bad = Fraction(-1)
        self.assertGreater(complement_bad - lower_shift, 0)
        self.assertLess(complement_bad, q_bad)
        self.assertIn("If `r=0`, do not form `d/r`", self.text)
        self.assertIn("exact Rayleigh signs `A-qI>0` and `Q_--qI>0`", self.text)
        self.assertIn("take `gamma=1`, `d_pr=0`", self.text)

    def test_strong_corollary_exponent_algebra_is_exact(self) -> None:
        # Write eta=1/2-epsilon.  The low response exponent from
        # L*lambda^(2eta)*lambda^-1 is -2epsilon; the high and projection
        # exponents are -epsilon.  Logarithms do not defeat fixed powers.
        for epsilon in (
            Fraction(1, 100),
            Fraction(1, 10),
            Fraction(1, 4),
        ):
            eta = Fraction(1, 2) - epsilon
            low_exponent = 2 * eta - 1
            high_exponent = eta - Fraction(1, 2)
            self.assertEqual(low_exponent, -2 * epsilon)
            self.assertEqual(high_exponent, -epsilon)
            self.assertLess(low_exponent, 0)
            self.assertLess(high_exponent, 0)

        eta = mp.mpf("0.49")
        low_values: list[mp.mpf] = []
        high_values: list[mp.mpf] = []
        for exponent in (200, 400, 800):
            lam = mp.mpf(10) ** exponent
            L = 2 * mp.log(lam)
            low_values.append(L * lam ** (2 * eta - 1))
            high_values.append(lam ** (eta - mp.mpf("0.5")) * mp.sqrt(L))
        self.assertGreater(low_values[0], low_values[-1])
        self.assertGreater(high_values[0], high_values[-1])
        self.assertLess(low_values[-1], mp.mpf("1"))
        self.assertLess(high_values[-1], mp.mpf("1"))
        self.assertIn("O(\\log\\lambda_j\\,\\lambda_j^{2\\eta-1})", self.text)
        self.assertIn(
            "O(\\lambda_j^{\\eta-1/2}\\sqrt{\\log\\lambda_j})",
            self.text,
        )

    def test_exact_rational_hidden_low_mode_counterfamily(self) -> None:
        # Rational Pythagorean parametrization gives s^2+c^2=1 exactly.
        # The actual graph z=s/c tends to zero, while an unrelated low mode
        # with B-eigenvalue 2s^2 has normalized determinant response ->1.
        previous_graph_error = Fraction(10)
        previous_hidden_response = Fraction(0)
        final_lower_increment = mp.mpf(0)
        for integer in (10, 100, 1000, 10000):
            s, c = _pythagorean_pair(Fraction(1, integer))
            self.assertEqual(s**2 + c**2, 1)
            d = s**2
            residual_r = s * c
            ritz_moment = c**2
            delta = d / residual_r
            graph_error_squared = delta**2
            hidden_response = residual_r / (2 * s**2 + residual_r)
            self.assertEqual(d * ritz_moment, residual_r**2)
            self.assertLess(graph_error_squared, previous_graph_error)
            self.assertGreater(hidden_response, previous_hidden_response)
            previous_graph_error = graph_error_squared
            previous_hidden_response = hidden_response
            A_R = _a_ritz(delta)
            final_lower_increment = (
                mp.mpf(A_R.numerator)
                / A_R.denominator
                * mp.log1p(
                    mp.mpf(hidden_response.numerator)
                    / hidden_response.denominator
                )
            )
        self.assertLess(previous_graph_error, Fraction(1, 10**7))
        self.assertGreater(previous_hidden_response, Fraction(999, 1000))
        self.assertGreater(final_lower_increment, mp.log(mp.mpf("1.99")))
        self.assertIn("sufficient but not necessary", self.text)
        self.assertIn("low-Fourier-visible near-null", self.text)
        self.assertIn("not the pinned arithmetic Weil", self.text)


if __name__ == "__main__":
    unittest.main()
