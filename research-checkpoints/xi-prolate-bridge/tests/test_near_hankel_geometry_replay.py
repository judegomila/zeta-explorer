from __future__ import annotations

import unittest

import mpmath as mp

from verifier.near_hankel_geometry_replay import (
    LOCKED_BOUNDARY_SIGN,
    projection_formula_3_13,
    replay,
    require_boundary_sign,
    require_precision,
    signed_toy_kernel,
)


class NearHankelGeometryReplayTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.report = replay(50)
        cls.tolerance = mp.mpf(cls.report["tolerance"])

    def test_same_parity_source_correlation_is_boundary_hankel(self) -> None:
        defects = self.report["defects"][
            "source_vs_boundary_hankel_same_parity"
        ]
        self.assertEqual(set(defects), {"even_even", "odd_odd"})
        for defect in defects.values():
            self.assertLessEqual(mp.mpf(defect), self.tolerance)

    def test_opposite_parities_cancel_in_the_direct_source_path(self) -> None:
        defects = self.report["defects"][
            "opposite_parity_direct_correlation"
        ]
        self.assertEqual(set(defects), {"even_odd", "odd_even"})
        for defect in defects.values():
            self.assertLessEqual(mp.mpf(defect), self.tolerance)

    def test_direct_signed_integral_matches_equation_3_5(self) -> None:
        defect = mp.mpf(
            self.report["defects"][
                "direct_signed_integral_vs_equation_3_5"
            ]
        )
        self.assertLessEqual(defect, self.tolerance)
        # This verifies that the toy kernel genuinely exercises a signed,
        # cancellation-preserving integral rather than a positive kernel.
        with mp.workdps(50):
            self.assertGreater(signed_toy_kernel(mp.mpf("0.1")), 0)
            self.assertLess(signed_toy_kernel(mp.mpf("1.25")), 0)

    def test_direct_projection_matches_both_toeplitz_correlations(self) -> None:
        defects = self.report["defects"]
        for key in (
            "direct_projection_correlation_vs_equation_3_10",
            "weighted_projection_correlation_vs_equation_3_11",
        ):
            with self.subTest(formula=key):
                self.assertLessEqual(mp.mpf(defects[key]), self.tolerance)

    def test_direct_projection_signed_integral_matches_equation_3_13(self) -> None:
        defect = mp.mpf(
            self.report["defects"][
                "direct_projection_signed_integral_vs_equation_3_13"
            ]
        )
        self.assertLessEqual(defect, self.tolerance)

    def test_projection_boundary_minus_sign_is_detected_and_locked(self) -> None:
        regression = self.report["projection_boundary_sign_regression"]
        correct = mp.mpf(regression["correct_formula_defect"])
        boundary = mp.mpf(regression["boundary_term_magnitude"])
        wrong_plus = mp.mpf(regression["wrong_plus_sign_defect"])
        self.assertEqual(regression["required_sign"], "minus")
        self.assertEqual(regression["correct_sign_integer"], -1)
        self.assertLessEqual(correct, self.tolerance)
        self.assertGreater(boundary, mp.mpf("0.1"))
        self.assertGreater(wrong_plus, mp.mpf("1"))
        self.assertGreater(wrong_plus, 1000 * self.tolerance)

        require_boundary_sign(LOCKED_BOUNDARY_SIGN)
        for mutation in (1, 0):
            with self.subTest(mutation=mutation):
                with self.assertRaises(ValueError):
                    require_boundary_sign(mutation)
        with self.assertRaises(TypeError):
            require_boundary_sign(True)
        # The public formula enforces the same contract before quadrature.
        with self.assertRaises(ValueError):
            projection_formula_3_13(
                mp.mpf("2"),
                mp.mpf("1.25"),
                1,
                boundary_sign=1,
            )

    def test_precision_is_exact_and_not_binary64(self) -> None:
        self.assertEqual(require_precision(50), 50)
        for value in (50.0, mp.mpf("50"), True):
            with self.subTest(value=type(value).__name__):
                with self.assertRaises(TypeError):
                    require_precision(value)  # type: ignore[arg-type]
        with self.assertRaises(ValueError):
            require_precision(49)

    def test_serialization_is_fail_closed_about_claims_and_limitations(self) -> None:
        self.assertTrue(self.report["replay_agrees"])
        self.assertEqual(self.report["terminal_state"], "P0_INVALIDATED")
        self.assertFalse(self.report["signed_lower_bound_claim"])
        self.assertFalse(self.report["equation_5_2_claim"])
        self.assertFalse(self.report["producer_modules_imported"])
        self.assertFalse(
            self.report["profile_contract"][
                "signed_kernel_is_arithmetic_delta_star"
            ]
        )
        self.assertTrue(
            any(
                "point-valued" in limitation
                for limitation in self.report["limitations"]
            )
        )


if __name__ == "__main__":
    unittest.main()
