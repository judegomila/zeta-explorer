#!/usr/bin/env python3
"""Regressions for the curved two-endpoint FIO shell theorem."""

from __future__ import annotations

import cmath
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_CURVED_TWO_ENDPOINT_FIO_SHELL_THEOREM.md"
)

NOTE_HASH = "ddb1769d6e6f2b3214cb8191d631a161a1312f18c5bfbba4ca2ad11bb9f93341"

DEPENDENCIES = {
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md":
        "1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d",
    "tests/test_growing_transition_edge_carleman_scattering_obstruction.py":
        "b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def a_minus(value: float, conductor: float) -> float:
    return 2.0 * value - value * value / conductor


def a_plus(value: float, conductor: float) -> float:
    return 2.0 * value + value * value / conductor


class CurvedTwoEndpointFIOShellTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertNotEqual(NOTE_HASH, "PENDING")
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in DEPENDENCIES.items():
            self.assertNotIn("PENDING", expected, relative)
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_scope_is_raw_m_equals_l_equals_one_and_fail_closed(self) -> None:
        self.assertIn("raw full-shell integral", self.text)
        self.assertIn("restricted positive clusters", self.text)
        self.assertIn("No signed-box theorem is claimed here", self.text)
        self.assertIn("There is no hidden `n/c` or Fejer weight in `I_n`", self.text)
        self.assertIn("only the local `m=l=1` curved prime shell", self.text)
        self.assertIn("not treat a higher inward or outward sampler", self.text)
        self.assertIn("P0_INVALIDATED", self.text)

    def test_failed_finite_c_subunit_package_is_not_a_dependency(self) -> None:
        self.assertIn("is **not** an\ninput", self.text)
        self.assertIn("loses\none power of the endpoint scale", self.text)
        self.assertIn("No global finite-`c`\nAbel-transform remainder is used", self.text)
        self.assertNotIn(
            "notes/GROWING_TRANSITION_SUBUNIT_WEBER_ABEL_TRANSFORM_THEOREM.md",
            DEPENDENCIES,
        )

    def test_exact_affine_shell_identity(self) -> None:
        for conductor in (17.0, 101.0, 1003.0):
            for sample in (2, 3, 7, 31):
                upper = conductor * (1.0 - 1.0 / sample)
                for fraction in (0.0, 0.17, 0.51, 0.93, 1.0):
                    u_value = fraction * upper
                    v_value = conductor * (sample - 1) - sample * u_value
                    lhs = a_plus(v_value, conductor)
                    rhs = (
                        conductor * (sample * sample - 1)
                        - sample * sample * a_minus(u_value, conductor)
                    )
                    self.assertLess(abs(lhs - rhs), 2.0e-9 * max(1.0, abs(lhs)))

    def test_restricted_two_envelope_margin_is_nonempty(self) -> None:
        h_value = math.pi / 4.0
        a_one = 1.0 / 20.0
        separation = 1.0 / 5.0
        epsilon = 1.0 / 10.0
        r_value = math.pi / 2.0 + epsilon
        self.assertLess(r_value * a_one, 0.5)
        self.assertGreater(r_value / 2.0, h_value)
        self.assertLess(
            h_value * (a_one + separation) + r_value * a_one,
            1.0,
        )
        decisive = (
            h_value * (a_one + separation)
            + (h_value + 1.5 * r_value) * a_one
        )
        equivalent = (
            math.pi * separation / 4.0
            + (5.0 * math.pi / 4.0 + 1.5 * epsilon) * a_one
        )
        self.assertLess(decisive, 1.0)
        self.assertLess(abs(decisive - equivalent), 2.0e-15)
        self.assertIn("two\none-point action envelopes", self.text)
        self.assertIn("e^{2h\\alpha}", self.text)

    def test_crude_green_bound_keeps_origin_log_and_pointwise_derivative(self) -> None:
        self.assertIn("ell(x)=1+log_+(1/x)", self.text)
        self.assertIn("Thus the logarithm in (3.6a) is necessary", self.text)
        self.assertIn("E_\\gamma^2", self.text)
        self.assertIn("pointwise derivative\nneeded to initialize", self.text)
        self.assertIn("unproved action-envelope-ratio estimate", self.text)
        self.assertIn("|\\rho(z)|+|z\\rho'(z)|", self.text)
        self.assertIn("2<=alpha<=16", self.text)
        self.assertIn("lateral limit at `z=-2iX` is uniform", self.text)

    def test_two_endpoint_half_density_normalizations_are_exact(self) -> None:
        for conductor in (23.0, 109.0, 809.0):
            for sample in (2, 5, 19):
                u_end = conductor * (1.0 - 1.0 / sample)
                v_far = conductor * (sample - 1)
                expected = 1.0 / math.sqrt(
                    conductor * (sample * sample - 1)
                )
                inward = 1.0 / (
                    sample * math.sqrt(a_minus(u_end, conductor))
                )
                outward = 1.0 / math.sqrt(a_plus(v_far, conductor))
                self.assertLess(abs(inward - expected), 2.0e-14)
                self.assertLess(abs(outward - expected), 2.0e-14)

    def test_endpoint_freeze_identities_are_exact(self) -> None:
        for conductor in (101.0, 503.0):
            for sample in (2, 7, 31):
                u_end = conductor * (1.0 - 1.0 / sample)
                a_end = a_minus(u_end, conductor)
                v_far = conductor * (sample - 1.0)
                b_far = a_plus(v_far, conductor)
                for endpoint_coordinate in (0.0, 0.3, 3.0, 11.0):
                    right_lhs = a_minus(
                        u_end - endpoint_coordinate / sample,
                        conductor,
                    )
                    right_rhs = (
                        a_end
                        - a_plus(endpoint_coordinate, conductor) / sample**2
                    )
                    self.assertLess(abs(right_lhs - right_rhs), 2.0e-11)
                    left_lhs = a_plus(
                        v_far - sample * endpoint_coordinate,
                        conductor,
                    )
                    left_rhs = (
                        b_far
                        - sample**2 * a_minus(endpoint_coordinate, conductor)
                    )
                    self.assertLess(abs(left_lhs - left_rhs), 2.0e-9)
        self.assertIn("|N|\\leq{3\\over5}", self.text)
        self.assertIn("{N+\\alpha\\over(N^2-1)^{3/2}}", self.text)

    def test_liouville_curvature_terms_cancel_to_inverse_square(self) -> None:
        # -a''/(2a)+(a')^2/(4a^2)=1/a^2 for either sign.
        conductor = 137.0
        for epsilon in (-1.0, 1.0):
            for value in (0.4, 3.0, 29.0):
                a_value = 2.0 * value + epsilon * value * value / conductor
                a_prime = 2.0 + 2.0 * epsilon * value / conductor
                a_second = 2.0 * epsilon / conductor
                curvature = (
                    -a_second / (2.0 * a_value)
                    + a_prime * a_prime / (4.0 * a_value * a_value)
                )
                self.assertLess(abs(curvature - 1.0 / a_value**2), 2.0e-14)

    def test_all_real_turning_roots_are_in_endpoint_layers(self) -> None:
        for alpha in (2.1, 4.0, 17.0, 91.0):
            discriminant = math.sqrt(alpha * alpha - 4.0)
            roots = (
                0.5 * (alpha - discriminant),
                0.5 * (alpha + discriminant),
            )
            self.assertGreater(roots[0], 0.0)
            self.assertLessEqual(max(roots), alpha)
            self.assertLess(abs(roots[0] * roots[1] - 1.0), 2.0e-12)

        for beta in (-2.1, -5.0, -23.0):
            magnitude = -beta
            discriminant = math.sqrt(beta * beta - 4.0)
            roots = (
                0.5 * (magnitude - discriminant),
                0.5 * (magnitude + discriminant),
            )
            self.assertGreater(roots[0], 0.0)
            self.assertLessEqual(max(roots), magnitude)

    def test_allowed_region_has_uniform_four_carrier_gap(self) -> None:
        for alpha, beta in ((3.0, 2.0), (17.0, 11.0), (50.0, 41.0)):
            scale = 128.0 * (1.0 + abs(alpha) + abs(beta))
            omega_minus = math.sqrt(1.0 - alpha / scale + 1.0 / scale**2)
            omega_plus = math.sqrt(1.0 + beta / scale + 1.0 / scale**2)
            for sample in (2, 3, 10, 100):
                difference = sample * omega_plus - omega_minus
                summation = sample * omega_plus + omega_minus
                self.assertGreaterEqual(difference, 0.75 * (sample - 1))
                self.assertGreaterEqual(summation, 0.75 * (sample + 1))

    def test_subunit_and_superunit_denominators_are_distinct(self) -> None:
        h_value = math.pi / 4.0
        for sample in (2, 3, 9, 100):
            alpha = 7.0
            beta = 4.0
            subunit = (
                1.0
                / math.sqrt(sample * sample - 1.0)
                * sample
                * math.exp(-h_value * beta)
                / math.sqrt(sample * sample - 1.0)
            )
            target_subunit = (
                sample
                * math.exp(-h_value * beta)
                / (sample * sample - 1.0)
            )
            superunit = (
                1.0
                / math.sqrt(sample * sample - 1.0)
                / math.sqrt(sample * sample - 1.0)
            )
            self.assertLess(abs(subunit - target_subunit), 2.0e-15)
            self.assertLess(
                abs(superunit - 1.0 / (sample * sample - 1.0)),
                2.0e-15,
            )
            self.assertLessEqual(
                sample / (sample * sample - 1.0),
                (2.0 / math.sqrt(3.0))
                / math.sqrt(sample * sample - 1.0),
            )

    def test_exact_flat_subunit_branch_is_independent_of_failed_remainder(self) -> None:
        epsilon = 1.0e-8
        h_value = math.pi / 4.0
        for frequency in (0.0, 0.2, 0.5):
            for beta in (0.0, 1.5, 8.0):
                for sigma in (-1, 1):
                    z_value = epsilon + 1j * sigma * frequency
                    exponent = 0.5 + 0.25j * beta
                    direct = (z_value - 1j) ** (-exponent) * (
                        z_value + 1j
                    ) ** (exponent - 1.0)
                    ell_value = math.log(
                        (1.0 + frequency) / (1.0 - frequency)
                    )
                    expected = (
                        math.exp(-h_value * beta)
                        / math.sqrt(1.0 - frequency * frequency)
                        * cmath.exp(0.25j * sigma * beta * ell_value)
                    )
                    self.assertLess(
                        abs(direct - expected),
                        2.0e-6 * max(1.0, abs(expected)),
                    )

    def test_flat_superunit_phase_has_unit_modulus(self) -> None:
        for sample in (2, 5, 31):
            ell_value = math.log((sample + 1.0) / (sample - 1.0))
            for alpha in (0.0, 3.5, 20.0):
                for tau in (-1, 1):
                    transform = (
                        -1j
                        * tau
                        / math.sqrt(sample * sample - 1.0)
                        * cmath.exp(-0.25j * tau * alpha * ell_value)
                    )
                    self.assertLess(
                        abs(abs(transform) - 1.0 / math.sqrt(sample**2 - 1.0)),
                        2.0e-15,
                    )

    def test_signed_parameter_caveat_is_explicit(self) -> None:
        self.assertIn("would require the replacements", self.text)
        self.assertIn("sqrt(1+e^(2h alpha))", self.text)
        self.assertIn("not uniform over an\nunsigned `O(L)` box", self.text)
        alpha = -20.0
        beta = 0.0
        h_value = math.pi / 4.0
        literal = math.exp(h_value * (alpha - beta))
        safe = math.exp(h_value * max(alpha, 0.0) - h_value * beta)
        self.assertGreater(safe, 1.0e6 * literal)

    def test_physical_cutoff_and_tail_height_are_exact(self) -> None:
        # Odd p makes A an integer plus 1/4.
        for odd in (5, 7, 11, 25):
            area = odd * odd / 4.0
            self.assertAlmostEqual(area % 1.0, 0.25)
            conductor = 2.0 * math.pi * area
            first_integer = math.floor(area) + 1
            self.assertGreaterEqual(first_integer - area, 0.75)
            v_min = conductor * (first_integer / area - 1.0)
            b_min = a_plus(v_min, conductor)
            expected = conductor * ((first_integer / area) ** 2 - 1.0)
            self.assertLess(abs(b_min - expected), 2.0e-12)

    def test_truncated_tail_geometry_absorbs_two_envelope_error(self) -> None:
        for area in (100.25, 400.25, 1600.25):
            conductor = 2.0 * math.pi * area
            samples = (
                math.floor(area) + 1,
                math.ceil(1.5 * area),
                math.ceil(2.0 * area),
                math.ceil(20.0 * area),
            )
            for sample in samples:
                b_min = conductor * ((sample / area) ** 2 - 1.0)
                normalized = (
                    math.sqrt(1.0 + b_min)
                    / math.sqrt(sample * sample - 1.0)
                    * math.sqrt(conductor)
                )
                self.assertLess(normalized, 7.0)
        self.assertIn("{C\\over\\sqrt c}", self.text)
        self.assertIn("e^{h\\alpha}R^{3/2}\\over c^{3/2}", self.text)
        self.assertIn("N_L=Omega_-(U_L)/n", self.text)
        self.assertIn("e^{-i\\sigma N_LV}", self.text)

    def test_tail_weight_has_the_claimed_elementary_scale(self) -> None:
        # Replace Lambda by its elementary upper bound log(n).
        for area in (100.25, 400.25, 1600.25):
            conductor = 2.0 * math.pi * area
            cutoff = int(20.0 * area)
            total = 0.0
            for sample in range(math.floor(area) + 1, cutoff + 1):
                b_min = conductor * ((sample / area) ** 2 - 1.0)
                total += math.log(sample) / (
                    sample * math.sqrt(1.0 + b_min)
                )
            # The omitted tail is O(sqrt(A) log X / X), harmless here.
            omitted = (
                2.0 * math.sqrt(area) * (math.log(cutoff) + 1.0) / cutoff
            )
            normalized = (total + omitted) * math.sqrt(area) / math.log(area)
            self.assertLess(normalized, 8.0)

    def test_outside_profile_and_prime_factors_cancel_n(self) -> None:
        lam = 5.5
        conductor = 2.0 * math.pi * lam * lam
        endpoint_factor = 1.7
        shell = -0.43
        mangoldt = 2.3
        fejer = 0.73
        for sample in (2, 7, 41):
            convolution = (
                lam
                * fejer**2
                / 4.0
                * endpoint_factor
                * sample
                / conductor
                * shell
            )
            prime_weighted = 2.0 * mangoldt / sample * convolution
            expected = (
                lam
                * fejer**2
                * mangoldt
                / (2.0 * conductor)
                * endpoint_factor
                * shell
            )
            self.assertLess(abs(prime_weighted - expected), 2.0e-16)
        self.assertIn("omega_M(1)^2", self.text)
        self.assertIn("raw prime-shell sum", self.text)
        self.assertIn("absolute physical\nprime contribution", self.text)

    def test_tex_delimiters_are_balanced(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        self.assertNotIn("\\begin{equation}", self.text)


if __name__ == "__main__":
    unittest.main()
