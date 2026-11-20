import sys
import unittest
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from prolate_jacobi_tail import (  # noqa: E402
    backward_self_energy_interval,
    forced_solve_size,
    prolate_tail_floor,
    projection_transfer_bound,
    schur_interval_step,
    uniform_tail_width_bound,
)


class ProlateJacobiTailScheduleTests(unittest.TestCase):
    def test_positive_potential_is_not_subtracted_from_tail_floor(self):
        m = 40
        c2 = Fraction(400, 1)
        exact_positive_floor = prolate_tail_floor(m)
        old_gershgorin_floor = exact_positive_floor - 2 * c2
        self.assertEqual(exact_positive_floor, 6480)
        self.assertGreater(exact_positive_floor, old_gershgorin_floor)

    def test_one_step_interval_contains_every_admissible_completion(self):
        lo, hi = schur_interval_step(9, 20, Fraction(1, 2), 2)
        for tail in (Fraction(1, 2), 1, Fraction(3, 2), 2):
            exact = Fraction(9, 1) / (20 - tail)
            self.assertLessEqual(lo, exact)
            self.assertLessEqual(exact, hi)

    def test_backward_interval_contains_independent_finite_tail(self):
        diagonals = [30, 45, 70]
        couplings2 = [4, 9, 16]
        shift = 3
        terminal = Fraction(1, 5)
        lo, hi = backward_self_energy_interval(
            diagonals, couplings2, shift, 0, Fraction(1, 2)
        )
        exact = terminal
        for d, b2 in zip(reversed(diagonals), reversed(couplings2)):
            exact = Fraction(b2, 1) / (d - shift - exact)
        self.assertLessEqual(lo, exact)
        self.assertLessEqual(exact, hi)

    def test_uniform_prolate_recursion_contracts_by_claimed_factor(self):
        c = Fraction(5, 1)
        shift = Fraction(24, 1)
        interface = 10
        terminal = 16
        c4_over_9 = c**4 / 9
        lo = Fraction(0)
        hi = c4_over_9 / (prolate_tail_floor(terminal) - shift)
        widths = [hi - lo]
        for i in range(terminal - 1, interface - 1, -1):
            lo, hi = schur_interval_step(
                c4_over_9,
                prolate_tail_floor(i) - shift,
                lo,
                hi,
            )
            widths.append(hi - lo)
        for before, after in zip(widths, widths[1:]):
            self.assertLessEqual(after * 1764, before)
        self.assertLessEqual(
            widths[-1],
            uniform_tail_width_bound(c, shift, interface, terminal),
        )

    def test_uniform_bound_rejects_mixed_or_unproved_regimes(self):
        with self.assertRaises(ValueError):
            uniform_tail_width_bound(5, 25, 10, 12)
        with self.assertRaises(ValueError):
            uniform_tail_width_bound(5, 24, 9, 12)
        with self.assertRaises(ValueError):
            uniform_tail_width_bound(5, 24, 12, 11)

    def test_binary64_inputs_are_rejected_fail_closed(self):
        calls = (
            lambda: schur_interval_step(9.0, 20, 0, 1),
            lambda: backward_self_energy_interval([30.0], [4], 3, 0, 1),
            lambda: uniform_tail_width_bound(5.0, 24, 10, 12),
            lambda: projection_transfer_bound(0, 5.0, 0),
            lambda: forced_solve_size(1.0, 1),
        )
        for call in calls:
            with self.subTest(call=call):
                with self.assertRaises(TypeError):
                    call()

    def test_state_ball_transfers_to_projection_ball(self):
        self.assertEqual(
            projection_transfer_bound(Fraction(1, 100), 5, Fraction(1, 1000)),
            Fraction(3, 200),
        )

    def test_small_residual_does_not_control_shifted_solve(self):
        values = []
        for n in (10, 100, 1000):
            epsilon = Fraction(1, n)
            values.append(forced_solve_size(epsilon, epsilon * epsilon))
        self.assertEqual(values, [10, 100, 1000])


if __name__ == "__main__":
    unittest.main()
