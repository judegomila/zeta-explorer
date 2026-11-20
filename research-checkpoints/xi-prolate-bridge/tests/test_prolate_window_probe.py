import unittest

import mpmath as mp

from prolate_window_probe import (
    additive_concentration_defect,
    canonical_complement,
    codimension_two_correction,
    compressed_fourier_eigenvalue,
    compact_bump_phi,
    compact_zero_integral_psi,
    fourier_sector_projection,
    general_prolate_modes,
    gram_orthonormalize,
    hermite_origin,
    invisible_codimension_two_correction,
    make_prolate_window,
    prolate_concentration_gram,
    prolate_window_mode_coordinates,
    relative_positive_model_audit,
    shifted_window_block,
)


class ProlateWindowNormalizationTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 35

    def test_hermite_origin_sign_distinguishes_fourier_minus_family(self) -> None:
        self.assertGreater(hermite_origin(0), 0)
        self.assertLess(hermite_origin(2), 0)
        self.assertGreater(hermite_origin(4), 0)
        self.assertLess(hermite_origin(6), 0)
        with self.assertRaises(ValueError):
            hermite_origin(3)

    def test_finite_windows_have_exact_zero_integral_and_locked_leading_sign(self) -> None:
        modes = general_prolate_modes("2", [0, 2, 4, 6, 8], 18, 35)
        plus = make_prolate_window(modes, "plus", 8)
        minus = make_prolate_window(modes, "minus", 6)
        self.assertEqual(plus.target_coefficient, 1)
        self.assertEqual(minus.target_coefficient, -1)
        self.assertLess(abs(plus.integral()), mp.mpf("1e-32"))
        self.assertLess(abs(minus.integral()), mp.mpf("1e-32"))
        # Labels 2 and 6 are spatially even but have the negative Hermite
        # origin sign.  This prevents silently substituting spatial oddness.
        self.assertLess(modes[2].value_at_zero(), 0)
        self.assertLess(modes[6].value_at_zero(), 0)

    def test_codimension_two_correction_and_chi_formula_in_two_assemblies(self) -> None:
        corrections = []
        for assembly in ("recurrence", "quadrature"):
            modes = general_prolate_modes("2", [0, 2, 4], 16, 35, assembly=assembly)
            correction = codimension_two_correction(modes)
            corrections.append(correction)
            self.assertLess(abs(correction.h_integral()), mp.mpf("1e-31"))
            self.assertLess(abs(correction.g_integral()), mp.mpf("1e-31"))
            self.assertLess(abs(correction.f_integral()), mp.mpf("1e-31"))
            self.assertLess(abs(correction.f(0)), mp.mpf("1e-31"))
            self.assertLess(
                abs(
                    correction.correction_scalar_c
                    - correction.correction_scalar_chi_formula
                ),
                mp.mpf("1e-31"),
            )
        self.assertLess(
            abs(
                corrections[0].correction_scalar_c
                - corrections[1].correction_scalar_c
            ),
            mp.mpf("1e-30"),
        )

    def test_invisible_bump_corrector_preserves_arithmetic_state(self) -> None:
        modes = general_prolate_modes("2", [0, 2, 4], 20, 35)
        source_h = codimension_two_correction(modes)
        correction = invisible_codimension_two_correction(source_h)
        self.assertEqual(compact_bump_phi(0), 1)
        self.assertEqual(compact_zero_integral_psi(0), 1)
        psi_integral = mp.quad(
            compact_zero_integral_psi,
            [-1, mp.mpf("-0.5"), 0, mp.mpf("0.5"), 1],
        )
        self.assertLess(abs(psi_integral), mp.mpf("1e-32"))
        self.assertLess(abs(correction.f(0)), mp.mpf("1e-32"))
        self.assertLess(abs(source_h.h_integral()), mp.mpf("1e-32"))
        self.assertEqual(correction.scale_a, mp.mpf("0.25"))
        # Every E-sample in the complete source interval misses the support,
        # not merely these replay points.
        for u in [mp.mpf("0.5"), mp.mpf("0.7"), 1, mp.mpf("1.4"), 2]:
            self.assertEqual(correction.bump_arithmetic_transform(u), 0)

    def test_additive_concentration_Gram_is_source_defined_and_positive(self) -> None:
        modes = general_prolate_modes("2", [0, 4, 8, 12], 30, 40)
        windows = [
            make_prolate_window(modes, "plus", 8),
            make_prolate_window(modes, "plus", 12),
        ]
        coordinates = [prolate_window_mode_coordinates(window) for window in windows]
        gram = prolate_concentration_gram(modes, coordinates)
        values, _ = mp.eigsy(gram)
        self.assertGreater(values[0], 0)
        for label in (0, 4, 8, 12):
            chi = compressed_fourier_eigenvalue(modes[label])
            self.assertGreater(chi, 0)
            self.assertLessEqual(chi, 1 + mp.mpf("1e-30"))
            self.assertLess(
                abs(additive_concentration_defect(modes[label]) - (1 - chi * chi)),
                mp.mpf("1e-32"),
            )
        # The two windows have distinct target modes and share only h_0, so
        # their off-diagonal leakage is exactly the shared-base contribution.
        expected_cross = (
            windows[0].base_coefficient
            * windows[1].base_coefficient
            * additive_concentration_defect(modes[0])
        )
        self.assertLess(abs(gram[0, 1] - expected_cross), mp.mpf("1e-32"))

    def test_relative_positive_model_audit_uses_symmetric_congruence(self) -> None:
        model = mp.matrix([[mp.mpf("2"), 0], [0, mp.mpf("8")]])
        # S=D^(1/2) diag(3,5) D^(1/2), hence the relative spectrum is exact.
        effective = mp.matrix([[mp.mpf("6"), 0], [0, mp.mpf("40")]])
        report = relative_positive_model_audit(effective, model)
        self.assertIsNotNone(report)
        assert report is not None
        self.assertLess(abs(report["relative_eigenvalues"][0] - 3), mp.mpf("1e-32"))
        self.assertLess(abs(report["relative_eigenvalues"][1] - 5), mp.mpf("1e-32"))
        self.assertLess(abs(report["center_scalar"] - 4), mp.mpf("1e-32"))
        self.assertLess(
            abs(report["relative_radius_about_center"] - mp.mpf("0.25")),
            mp.mpf("1e-32"),
        )


class ProlateWindowProjectionTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 30
        self.L = mp.mpf("1.7")
        self.breakpoints = [mp.mpf("0"), self.L]

    def test_even_cosine_sector_coordinates_have_correct_norm(self) -> None:
        projection = fourier_sector_projection(
            lambda t: mp.cos(2 * mp.pi * t / self.L),
            self.L,
            2,
            self.breakpoints,
            "plus",
            direct_error=True,
        )
        coordinates = projection["sector_coordinates"]
        self.assertLess(abs(coordinates[0]), mp.mpf("1e-28"))
        self.assertLess(abs(coordinates[1] - mp.sqrt(self.L / 2)), mp.mpf("1e-28"))
        self.assertLess(abs(coordinates[2]), mp.mpf("1e-28"))
        self.assertLess(projection["projection_error_sq_direct"], mp.mpf("1e-28"))

    def test_odd_sine_sector_coordinates_have_correct_global_phase_norm(self) -> None:
        projection = fourier_sector_projection(
            lambda t: mp.sin(2 * mp.pi * t / self.L),
            self.L,
            2,
            self.breakpoints,
            "minus",
            direct_error=True,
        )
        coordinates = projection["sector_coordinates"]
        self.assertLess(abs(coordinates[0] - mp.sqrt(self.L / 2)), mp.mpf("1e-28"))
        self.assertLess(abs(coordinates[1]), mp.mpf("1e-28"))
        self.assertLess(projection["projection_error_sq_direct"], mp.mpf("1e-28"))

    def test_Gram_basis_and_coordinate_complement_need_no_Weil_operator(self) -> None:
        raw = mp.matrix([[1, 1], [0, 1], [1, 0], [0, 1]])
        report = gram_orthonormalize(raw, 30)
        basis = report["basis"]
        self.assertLess(report["orthonormality_defect_max_abs"], mp.mpf("1e-28"))
        complement = canonical_complement(basis, 4, 30)
        self.assertEqual(complement.cols, 2)
        self.assertLess(max(abs(x) for x in basis.T * complement), mp.mpf("1e-28"))
        self.assertLess(
            max(abs(x) for x in complement.T * complement - mp.eye(2)),
            mp.mpf("1e-28"),
        )

    def test_matrix_schur_lower_model_retains_anisotropic_coupling(self) -> None:
        operator = mp.matrix(
            [
                [1, 0, mp.mpf("0.9")],
                [0, 1000, 10],
                [mp.mpf("0.9"), 10, 1],
            ]
        )
        low_basis = mp.matrix([[1, 0], [0, 1], [0, 0]])
        report = shifted_window_block(
            operator,
            low_basis,
            mp.matrix(3, 0),
            30,
            forcing=mp.matrix([mp.mpf("0.01"), mp.mpf("0.2"), mp.mpf("0.03")]),
        )
        self.assertLess(report["schur_scalar_a_minus_c2_over_G"], 0)
        self.assertGreater(report["matrix_schur_lower_floor"], 0)
        self.assertLess(
            max(
                abs(x)
                for x in report["matrix_schur_lower_model"]
                - report["exact_point_schur_complement"]
            ),
            mp.mpf("1e-28"),
        )
        forced = report["forcing_report"]["anisotropic_matrix_Schur_bound"]
        self.assertGreaterEqual(
            forced["T"] + mp.mpf("1e-28"),
            report["forcing_report"]["direct_compressed_complement_solve_norm"],
        )


if __name__ == "__main__":
    unittest.main()
