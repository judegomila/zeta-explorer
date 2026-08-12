from __future__ import annotations

from fractions import Fraction
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "CONSTRAINED_TRIAL_LABELLED_LOAD_RESERVE.md"


def dot(left, right):
    return sum((x * y for x, y in zip(left, right)), Fraction(0))


def matvec(matrix, vector):
    return tuple(dot(row, vector) for row in matrix)


def quadratic(vector, matrix):
    return dot(vector, matvec(matrix, vector))


def det2(matrix):
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def inverse2(matrix):
    determinant = det2(matrix)
    return (
        (matrix[1][1] / determinant, -matrix[0][1] / determinant),
        (-matrix[1][0] / determinant, matrix[0][0] / determinant),
    )


def rank_one_subtract(matrix, vector, coefficient):
    return tuple(
        tuple(
            matrix[i][j] - coefficient * vector[i] * vector[j]
            for j in range(len(vector))
        )
        for i in range(len(vector))
    )


class ConstrainedTrialLabelledLoadReserveTests(unittest.TestCase):
    def test_sharp_scalar_parity_model(self) -> None:
        a_plus = Fraction(3)
        a_minus = Fraction(15)
        p_plus = Fraction(2)
        p_minus = Fraction(1)
        constrained = (Fraction(1), Fraction(-2))

        self.assertEqual(
            p_plus * constrained[0] + p_minus * constrained[1],
            0,
        )
        norm_squared = dot(constrained, constrained)
        trial_energy = (
            a_plus * constrained[0] ** 2
            + a_minus * constrained[1] ** 2
        ) / norm_squared
        self.assertEqual(trial_energy, Fraction(63, 5))

        odd_unit_floor = a_minus - 2 * p_minus**2 - trial_energy
        self.assertEqual(odd_unit_floor, Fraction(2, 5))
        chi = p_minus**2 / odd_unit_floor
        reserve_endpoint = 1 + Fraction(1, 2) / chi
        self.assertEqual(chi, Fraction(5, 2))
        self.assertEqual(reserve_endpoint, Fraction(6, 5))

        crossing = (a_minus - a_plus) / (
            2 * (p_plus**2 + p_minus**2)
        )
        self.assertEqual(crossing, reserve_endpoint)

    def test_trial_holds_labelled_order_until_rank_one_threshold(self) -> None:
        a_plus = Fraction(3)
        a_minus = Fraction(15)
        p_plus_squared = Fraction(4)
        p_minus_squared = Fraction(1)
        trial_energy = Fraction(63, 5)

        for load in (
            Fraction(1),
            Fraction(21, 20),
            Fraction(11, 10),
            Fraction(119, 100),
        ):
            even_ground = a_plus + 2 * load * p_plus_squared
            odd_ground = a_minus - 2 * load * p_minus_squared
            self.assertLessEqual(even_ground, trial_energy)
            self.assertGreater(odd_ground, trial_energy)

        endpoint = Fraction(6, 5)
        self.assertEqual(
            a_plus + 2 * endpoint * p_plus_squared,
            trial_energy,
        )
        self.assertEqual(
            a_minus - 2 * endpoint * p_minus_squared,
            trial_energy,
        )

    def test_matrix_rank_one_threshold_is_exact(self) -> None:
        base = (
            (Fraction(2), Fraction(1)),
            (Fraction(1), Fraction(3)),
        )
        pole = (Fraction(1), Fraction(2))
        inverse = inverse2(base)
        chi = quadratic(pole, inverse)
        threshold = Fraction(1, 2) / chi
        self.assertEqual(chi, Fraction(7, 5))
        self.assertEqual(threshold, Fraction(5, 14))

        below = rank_one_subtract(base, pole, 2 * Fraction(1, 3))
        at = rank_one_subtract(base, pole, 2 * threshold)
        above = rank_one_subtract(base, pole, 2 * Fraction(2, 5))

        self.assertGreater(below[0][0], 0)
        self.assertGreater(det2(below), 0)
        self.assertEqual(det2(at), 0)
        self.assertLess(det2(above), 0)

    def test_floor_only_reserve_is_sharp_for_scalar_floor(self) -> None:
        delta = Fraction(2)
        pole = (Fraction(1), Fraction(2))
        pole_norm_squared = dot(pole, pole)
        base = ((delta, Fraction(0)), (Fraction(0), delta))
        chi = quadratic(pole, inverse2(base))

        exact_reserve = Fraction(1, 2) / chi
        floor_reserve = delta / (2 * pole_norm_squared)
        self.assertEqual(exact_reserve, Fraction(1, 5))
        self.assertEqual(exact_reserve, floor_reserve)

    def test_pole_balanced_trial_formula(self) -> None:
        a_plus = ((Fraction(5), Fraction(1)), (Fraction(1), Fraction(4)))
        a_minus = ((Fraction(7), Fraction(-1)), (Fraction(-1), Fraction(6)))
        p_plus = (Fraction(2), Fraction(1))
        p_minus = (Fraction(1), Fraction(3))
        x = dot(p_plus, p_plus)
        y = dot(p_minus, p_minus)

        full_w = p_plus + p_minus
        balanced = tuple(y * value for value in p_plus) + tuple(
            -x * value for value in p_minus
        )
        self.assertEqual(dot(full_w, balanced), 0)

        direct_numerator = (
            y**2 * quadratic(p_plus, a_plus)
            + x**2 * quadratic(p_minus, a_minus)
        )
        direct_denominator = dot(balanced, balanced)
        formula_denominator = x * y * (x + y)
        self.assertEqual(direct_denominator, formula_denominator)
        self.assertEqual(
            direct_numerator / direct_denominator,
            (
                y**2 * quadratic(p_plus, a_plus)
                + x**2 * quadratic(p_minus, a_minus)
            )
            / (x * y * (x + y)),
        )

    def test_general_two_sector_constraint_is_exact(self) -> None:
        p_plus = (Fraction(2), Fraction(1))
        p_minus = (Fraction(1), Fraction(3))
        u_plus = (Fraction(1), Fraction(2))
        u_minus = (Fraction(2), Fraction(-1))
        alpha_plus = dot(p_plus, u_plus)
        alpha_minus = dot(p_minus, u_minus)

        constrained = tuple(alpha_minus * x for x in u_plus) + tuple(
            -alpha_plus * x for x in u_minus
        )
        w = p_plus + p_minus
        self.assertNotEqual(constrained, (0, 0, 0, 0))
        self.assertEqual(dot(w, constrained), 0)

    def test_nonstrict_source_load_equality_is_rejected(self) -> None:
        a_plus = Fraction(0)
        a_minus = Fraction(4)
        p_plus = Fraction(1)
        p_minus = Fraction(1)
        constrained_energy = Fraction(2)
        odd_unit_margin = a_minus - 2 * p_minus**2 - constrained_energy
        crossing = (a_minus - a_plus) / (
            2 * (p_plus**2 + p_minus**2)
        )

        self.assertEqual(odd_unit_margin, 0)
        self.assertEqual(crossing, 1)
        self.assertFalse(odd_unit_margin > 0)

    def test_overlap_weighted_loaded_trial_pass_and_fail(self) -> None:
        alpha = Fraction(2)
        beta = Fraction(1)
        even_trial = Fraction(11)
        odd_trial = Fraction(13)
        odd_floor = Fraction(13)

        constrained_energy = (
            beta**2 * even_trial + alpha**2 * odd_trial
        ) / (alpha**2 + beta**2)
        imbalance = beta**2 * (odd_floor - even_trial) - alpha**2 * (
            odd_trial - odd_floor
        )
        delta = imbalance / (alpha**2 + beta**2)

        self.assertEqual(constrained_energy, Fraction(63, 5))
        self.assertEqual(imbalance, 2)
        self.assertEqual(delta, Fraction(2, 5))
        self.assertEqual(odd_floor - constrained_energy, delta)
        self.assertEqual(
            delta,
            beta**2 * (odd_trial - even_trial) / (alpha**2 + beta**2),
        )
        self.assertGreater(imbalance, 0)

        inaccurate_odd_trial = Fraction(15)
        failed_imbalance = beta**2 * (
            odd_floor - even_trial
        ) - alpha**2 * (inaccurate_odd_trial - odd_floor)
        failed_energy = (
            beta**2 * even_trial + alpha**2 * inaccurate_odd_trial
        ) / (alpha**2 + beta**2)
        self.assertLess(failed_imbalance, 0)
        self.assertGreater(failed_energy, odd_floor)

    def test_loaded_trial_rejects_two_zero_pole_overlaps(self) -> None:
        alpha = Fraction(0)
        beta = Fraction(0)
        denominator = alpha**2 + beta**2
        self.assertEqual(denominator, 0)

        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        self.assertIn("\\alpha^2+\\beta^2>0", normalized)
        self.assertIn("case must be rejected", normalized)

    def test_later_pole_bare_weyl_sign_is_rejected(self) -> None:
        # A_+=diag(0,10), A_-=[1], p_+=(1,0), p_-=1.
        # At source load one, the loaded even branch value z=2 lies after
        # the odd nonpole pole.  Its paired Weyl sign is negative again.
        zeta = Fraction(1, 2)
        loaded_even_branch = Fraction(2)
        paired_weyl = Fraction(1, -loaded_even_branch) + Fraction(
            1, 1 - loaded_even_branch
        )
        odd_nonpole_location = 1 - loaded_even_branch
        labelled_trial_margin = 1 - 2 - zeta

        self.assertLess(paired_weyl, 0)
        self.assertLess(odd_nonpole_location, 0)
        self.assertLess(labelled_trial_margin, 0)
        self.assertFalse(labelled_trial_margin > 0)

    def test_note_locks_source_and_claim_boundaries(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        required = (
            "P0_INVALIDATED",
            "Every prime power `n<=lambda^2`",
            "endpoint is inclusive",
            "minus sign on the prime block",
            "w=p_++p_-",
            "H_-(1)-UI\\succ0",
            "first labelled even/odd ground collision",
            "first constrained-ground collision",
            "four first-gap hypotheses",
            "odd Ritz value without a lower enclosure",
            "would be circular",
            "cannot be fooled",
            "bare paired-Weyl sign",
            "direct interval `LDL^*`",
            "nonnegative floor as a pass",
            "not the missing source estimate",
            "No zeta-zero table",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)


if __name__ == "__main__":
    unittest.main()
