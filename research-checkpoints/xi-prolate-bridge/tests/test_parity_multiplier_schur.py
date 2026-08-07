from __future__ import annotations

import sys
import unittest
from pathlib import Path

import mpmath as mp

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from parity_multiplier_schur import (  # noqa: E402
    absolute_phase_volume_bound,
    complete_multiplier,
    dangerous_dimension_bound,
    dangerous_dimension_bound_rank_one_pole,
    fks_linear_chebyshev_constant,
    multiplier_absolute_lower,
    pole_operator_coefficient,
    pole_representer_norm_squared,
    prime_amplitude_linear_bound,
    prime_amplitude_sum,
    prime_power_bases,
    schur_floor,
    source_mode_transform,
    theta_prime,
)
from parity_multiplier_form_replay import (  # noqa: E402
    diagnostic_weil_entry,
    independent_prime_powers,
    make_diagnostic_tail,
    prime_multiplier_entry_by_fourier_identity,
)
from weil_matrix import blocks_direct  # noqa: E402


class ParityMultiplierSchurTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 80

    def test_inclusive_exact_lambda_squared_prime_power_list(self) -> None:
        self.assertEqual(
            prime_power_bases("2"),
            [(2, 2), (3, 3), (4, 2)],
        )

    def test_decimal_cutoff_does_not_pass_through_binary64(self) -> None:
        below = "2.999999999999999999999999999999999999999"
        self.assertNotIn((9, 3), prime_power_bases(below))
        self.assertIn((9, 3), prime_power_bases("3"))
        with self.assertRaises(TypeError):
            prime_power_bases(2.0)  # type: ignore[arg-type]

    def test_archimedean_derivative_and_complete_symbol_are_even(self) -> None:
        t = mp.mpf("1.234567890123456789")
        self.assertLess(abs(theta_prime(t) - theta_prime(-t)), mp.mpf("1e-75"))
        self.assertLess(
            abs(complete_multiplier("2", t) - complete_multiplier("2", -t)),
            mp.mpf("1e-75"),
        )

    def test_centered_source_mode_transform_includes_translation_phase(self) -> None:
        length = 2 * mp.log(2)
        for mode, t in ((0, mp.mpf("0.7")), (2, mp.mpf("1.1")), (-3, mp.mpf("2.2"))):
            direct = mp.quad(
                lambda x: (
                    (-1) ** mode
                    / mp.sqrt(length)
                    * mp.exp(2 * mp.pi * mp.j * mode * x / length)
                    * mp.exp(-mp.j * t * x)
                ),
                [-length / 2, length / 2],
            )
            self.assertLess(
                abs(source_mode_transform("2", mode, t) - direct),
                mp.mpf("1e-70"),
            )
        frequency = 2 * mp.pi / length
        self.assertEqual(source_mode_transform("2", 1, frequency), -mp.sqrt(length))

    def test_prime_block_keeps_source_minus_sign(self) -> None:
        arch = 2 * theta_prime("0")
        expected_prime = 2 * mp.fsum(
            mp.log(prime) / mp.sqrt(integer)
            for integer, prime in [(2, 2), (3, 3), (4, 2)]
        )
        self.assertLess(
            abs(complete_multiplier("2", "0") - (arch - expected_prime)),
            mp.mpf("1e-75"),
        )
        self.assertLess(complete_multiplier("2", "0"), arch)

    def test_digamma_prime_amplitude_lower_bound_is_pointwise(self) -> None:
        for t in ("0", "0.125", "1.75", "20"):
            self.assertGreaterEqual(
                complete_multiplier("2", t) + mp.mpf("1e-70"),
                multiplier_absolute_lower("2", t),
            )

    def test_closed_phase_volume_envelope_matches_its_integral(self) -> None:
        U = mp.mpf("-5")
        g = mp.mpf("0.75")
        sigma = prime_amplitude_sum("2")
        A = g + U + 2 * sigma - mp.digamma(mp.mpf(1) / 4) + mp.log(mp.pi)
        self.assertGreater(A, 0)
        endpoint = mp.sqrt(mp.expm1(2 * A)) / 2
        integral = 2 * mp.quad(
            lambda t: A - mp.log(1 + 4 * t**2) / 2,
            [0, endpoint],
        )
        self.assertLess(
            abs(absolute_phase_volume_bound("2", U, g) - integral),
            mp.mpf("1e-65"),
        )

    def test_pinned_pnt_linear_bound_dominates_exact_prime_sum(self) -> None:
        self.assertGreater(fks_linear_chebyshev_constant(), 1)
        for lam in ("1.25", "2", "3.5", "8"):
            self.assertLessEqual(
                prime_amplitude_sum(lam),
                prime_amplitude_linear_bound(lam),
            )

    def test_pole_has_opposite_parity_signs_and_exact_norms(self) -> None:
        ell = mp.log(2)
        self.assertEqual(pole_operator_coefficient(1), 2)
        self.assertEqual(pole_operator_coefficient(-1), -2)
        self.assertLess(
            abs(pole_representer_norm_squared("2", 1) - (mp.sinh(ell) + ell)),
            mp.mpf("1e-75"),
        )
        self.assertLess(
            abs(pole_representer_norm_squared("2", -1) - (mp.sinh(ell) - ell)),
            mp.mpf("1e-75"),
        )

    def test_trace_count_adds_only_the_odd_pole_rank(self) -> None:
        plus = dangerous_dimension_bound("2", "10", "3", "1", 1)
        minus = dangerous_dimension_bound("2", "10", "3", "1", -1)
        expected_addition = 2 * (mp.sinh(mp.log(2)) - mp.log(2))
        self.assertLess(
            abs((minus.trace_upper - plus.trace_upper) - expected_addition),
            mp.mpf("1e-75"),
        )
        self.assertGreaterEqual(
            plus.real_dimension_upper,
            plus.integer_dimension_upper_diagnostic,
        )
        self.assertFalse(plus.outward_certified)

    def test_rank_one_odd_pole_adds_one_to_the_upper_bound(self) -> None:
        plus = dangerous_dimension_bound_rank_one_pole("10", "10", "3", "1", 1)
        minus = dangerous_dimension_bound_rank_one_pole("10", "10", "3", "1", -1)
        self.assertEqual(minus.trace_upper, plus.trace_upper)
        self.assertLess(
            abs((minus.real_dimension_upper - plus.real_dimension_upper) - 1),
            mp.mpf("1e-75"),
        )
        old_minus = dangerous_dimension_bound("10", "10", "3", "1", -1)
        self.assertLess(minus.real_dimension_upper, old_minus.real_dimension_upper)
        self.assertFalse(minus.outward_certified)

        # The rank alternative is not uniformly smaller: when the pole norm
        # is small, the original trace surcharge can win.
        rank_alternative = dangerous_dimension_bound_rank_one_pole(
            "2", "10", "10", "1", -1
        )
        trace_alternative = dangerous_dimension_bound("2", "10", "10", "1", -1)
        self.assertGreater(
            rank_alternative.real_dimension_upper,
            trace_alternative.real_dimension_upper,
        )

        # Direct finite-dimensional regression for the underlying rank
        # argument.  The multiplier-dangerous span is e_0, and adjoining the
        # pole p=(0,1,1) leaves w=(0,1,-1) in the complement.  The pole
        # vanishes there and the multiplier Rayleigh value stays below 2.
        multiplier = mp.diag([3, 1, 0])
        pole = mp.matrix([0, 1, 1])
        complement = mp.matrix([0, 1, -1])
        self.assertEqual((pole.T * complement)[0], 0)
        self.assertLess(
            (complement.T * multiplier * complement)[0]
            / (complement.T * complement)[0],
            2,
        )

    def test_rank_one_dimension_bound_fails_closed_on_invalid_floor(self) -> None:
        with self.assertRaises(ValueError):
            dangerous_dimension_bound_rank_one_pole("2", "10", "1", "1", -1)
        with self.assertRaises(TypeError):
            dangerous_dimension_bound_rank_one_pole("2", 10.0, "2", "1", -1)

    def test_dimension_bound_fails_closed_on_invalid_floor(self) -> None:
        with self.assertRaises(ValueError):
            dangerous_dimension_bound("2", "10", "1", "1", 1)
        with self.assertRaises(ValueError):
            dangerous_dimension_bound("2", "10", "1", "0", 1)
        with self.assertRaises(TypeError):
            dangerous_dimension_bound("2", 10.0, "2", "1", 1)

    def test_quantitative_schur_floor(self) -> None:
        self.assertEqual(schur_floor("2", "3", "1"), mp.mpf("0.5"))
        with self.assertRaises(ValueError):
            schur_floor("0", "3", "1")

    def test_independent_prime_fourier_identity_has_minus_sign_and_endpoint(self) -> None:
        modes, terms, _, _, prime, _ = blocks_direct("2", 1, 70)
        self.assertEqual(independent_prime_powers("2"), [(2, 2), (3, 3), (4, 2)])
        self.assertEqual([integer for integer, _ in terms], [2, 3, 4])
        for row, left in enumerate(modes):
            for column, right in enumerate(modes):
                multiplier_entry = prime_multiplier_entry_by_fourier_identity(
                    "2", left, right
                )
                self.assertLess(
                    abs(multiplier_entry + prime[row, column]),
                    mp.mpf("1e-65"),
                )

    def test_full_multiplier_plus_pole_diagnostic_matches_distribution(self) -> None:
        # The continuous replay has a t^-6 asymptotic tail, not a certified
        # interval tail.  This is a high-precision factor/sign regression.
        mp.mp.dps = 30
        modes, _, _, _, _, source_matrix = blocks_direct("2", 1, 30)
        tail = make_diagnostic_tail("2", "60")
        representatives: dict[tuple[int, int], mp.mpc] = {}

        def canonical(left: int, right: int) -> tuple[int, int]:
            return max(
                (left, right),
                (right, left),
                (-left, -right),
                (-right, -left),
            )

        for left, right in ((0, 0), (1, 0), (1, 1), (1, -1)):
            representatives[(left, right)] = diagnostic_weil_entry(
                tail, left, right
            )
        for row, left in enumerate(modes):
            for column, right in enumerate(modes):
                replayed = representatives[canonical(left, right)]
                self.assertLess(
                    abs(replayed - source_matrix[row, column]),
                    mp.mpf("1e-8"),
                )


if __name__ == "__main__":
    unittest.main()
