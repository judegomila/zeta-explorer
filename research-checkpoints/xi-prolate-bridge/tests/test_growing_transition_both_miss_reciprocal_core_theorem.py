#!/usr/bin/env python3
"""Exact regressions for the both-miss reciprocal-core theorem."""

from __future__ import annotations

from collections import Counter
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_BOTH_MISS_RECIPROCAL_CORE_THEOREM.md"

# Patched after the note bytes are frozen.
NOTE_HASH = "0211d021fa37b423f41b2839aeda96630aaac931de0ea3d7d028f95705de29a8"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "tests/test_growing_transition_complete_central_form_reduction.py":
        "a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de",
    "notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md":
        "1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c",
    "tests/test_growing_transition_subcritical_lg_action_bv_theorem.py":
        "a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92",
    "notes/GROWING_TRANSITION_EDGE_EDGE_HIGHER_ALIAS_THEOREM.md":
        "3bd3bf977178be94e91b7c6603db9df7f861f1cfe498bef303c210e9b87b9ec5",
    "tests/test_growing_transition_edge_edge_higher_alias_theorem.py":
        "c7f6920d5253d31d3acc73c00412567294791c51d62c18291f8407a0ea53be2f",
    "P2_SOURCE_LOCK.json":
        "8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a",
}


def divisors(number: int) -> list[int]:
    return [candidate for candidate in range(1, number + 1) if number % candidate == 0]


def factorization(number: int) -> Counter[int]:
    factors: Counter[int] = Counter()
    divisor = 2
    while divisor * divisor <= number:
        while number % divisor == 0:
            factors[divisor] += 1
            number //= divisor
        divisor += 1
    if number > 1:
        factors[number] += 1
    return factors


def von_mangoldt_basis(number: int) -> Counter[int]:
    """Represent Lambda(n) exactly as a formal linear combination of log p."""
    if number <= 1:
        return Counter()
    factors = factorization(number)
    if len(factors) == 1:
        prime = next(iter(factors))
        return Counter({prime: 1})
    return Counter()


def log_basis(number: int) -> Counter[int]:
    """Represent log(number) exactly in the independent symbols log p."""
    return factorization(number)


def add_scaled(target: Counter[int], source: Counter[int], scale: int) -> None:
    for prime, coefficient in source.items():
        target[prime] += scale * coefficient
        if target[prime] == 0:
            del target[prime]


def unrestricted_coefficient(number: int) -> Counter[int]:
    total: Counter[int] = Counter()
    for n_value in divisors(number):
        quotient = number // n_value
        add_scaled(total, von_mangoldt_basis(n_value), len(divisors(quotient)))
    return total


def center_both_miss_coefficient(number: int) -> Counter[int]:
    total: Counter[int] = Counter()
    for n_value in divisors(number):
        quotient = number // n_value
        count = sum(
            1
            for m_value in divisors(quotient)
            if m_value >= 2 and quotient // m_value >= 2
        )
        add_scaled(total, von_mangoldt_basis(n_value), count)
    return total


def simpson(function, left: float, right: float, steps: int = 200_000) -> float:
    if steps % 2:
        steps += 1
    spacing = (right - left) / steps
    total = function(left) + function(right)
    total += 4.0 * sum(function(left + spacing * index) for index in range(1, steps, 2))
    total += 2.0 * sum(function(left + spacing * index) for index in range(2, steps, 2))
    return spacing * total / 3.0


def action_t(r_value: float, x_value: float) -> float:
    return simpson(
        lambda variable: math.sqrt(
            (variable * variable + r_value * r_value) / (1.0 + variable * variable)
        ),
        0.0,
        x_value,
        steps=40_000,
    )


def elliptic_c(r_value: float) -> float:
    return simpson(
        lambda theta: (1.0 - r_value * r_value)
        * math.cos(theta) ** 2
        / math.sqrt(math.cos(theta) ** 2 + r_value * r_value * math.sin(theta) ** 2),
        0.0,
        math.pi / 2.0,
        steps=40_000,
    )


class GrowingTransitionBothMissReciprocalCoreTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_note_and_dependency_hashes(self) -> None:
        self.assertEqual(hashlib.sha256(NOTE.read_bytes()).hexdigest(), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_center_mask_identity_is_exact_in_formal_log_prime_basis(self) -> None:
        for number in range(2, 301):
            unrestricted = unrestricted_coefficient(number)
            both_miss = center_both_miss_coefficient(number)

            expected = unrestricted.copy()
            add_scaled(expected, log_basis(number), -2)
            add_scaled(expected, von_mangoldt_basis(number), 1)
            self.assertEqual(both_miss, expected, number)

            retained = unrestricted.copy()
            add_scaled(retained, both_miss, -1)
            retained_expected: Counter[int] = Counter()
            add_scaled(retained_expected, log_basis(number), 2)
            add_scaled(retained_expected, von_mangoldt_basis(number), -1)
            self.assertEqual(retained, retained_expected, number)

    def test_center_geometric_conditions_are_equivalent_to_m_l_at_least_two(self) -> None:
        for odd_p in (5, 7, 11):
            area = odd_p * odd_p / 4.0
            for number in range(math.floor(area) + 1, math.ceil(4.0 * area)):
                y_value = math.log(number / area)
                # Choose several rho values which really lie in the center region.
                for fraction in (0.25, 0.5, 0.75):
                    rho = fraction * y_value
                    z_value = math.exp(rho)
                    w_value = math.exp(y_value - rho)
                    if z_value >= 2.0 or w_value >= 2.0:
                        continue
                    for n_value in divisors(number):
                        quotient = number // n_value
                        for m_value in divisors(quotient):
                            l_value = quotient // m_value
                            direct = n_value < area and m_value > z_value and l_value > w_value
                            reduced = m_value >= 2 and l_value >= 2
                            self.assertEqual(direct, reduced)

    def test_quartic_point_is_uniformly_inside_the_center_mask(self) -> None:
        for r_value in (1e-8, 1e-4, 0.1, 0.5, 1.0):
            product_ratio = 1.0 + r_value
            sample = math.sqrt(product_ratio)
            self.assertLessEqual(product_ratio, 2.0)
            self.assertLess(sample, 2.0)
            self.assertGreater(2.0 - sample, 2.0 - math.sqrt(2.0) - 1e-15)

    def test_landen_identity_and_symmetric_specialization(self) -> None:
        for r_value in (0.03, 0.2, 0.7, 1.0):
            c_value = elliptic_c(r_value)
            for x_value in (math.sqrt(r_value), 0.4, 1.3, 4.0):
                reciprocal = r_value / x_value
                z_product = math.sqrt(1.0 + x_value * x_value) * math.sqrt(
                    1.0 + reciprocal * reciprocal
                )
                left = action_t(r_value, x_value) + action_t(r_value, reciprocal)
                self.assertAlmostEqual(left - z_product, -c_value, delta=2e-9)

            symmetric = action_t(r_value, math.sqrt(r_value))
            self.assertAlmostEqual(
                2.0 * symmetric,
                1.0 + r_value - c_value,
                delta=2e-9,
            )

    def test_phase_and_maslov_reduce_to_negative_cosine_of_action(self) -> None:
        for sigma in (0.0, 0.1, -0.2, math.pi / 5.0):
            c_times_c = sigma + math.pi / 4.0
            stationary_phase = -c_times_c - math.pi / 2.0
            after_maslov = stationary_phase - math.pi / 4.0
            self.assertAlmostEqual(after_maslov, -sigma - math.pi, places=15)
            self.assertAlmostEqual(math.cos(after_maslov), -math.cos(sigma), places=15)

        for epsilon in (-math.pi / 4.0 + 1e-6, 0.0, math.pi / 4.0 - 1e-6):
            self.assertLess(-math.cos(epsilon), 0.0)

    def test_completed_phase_requires_the_connection_coefficient(self) -> None:
        for c_times_c in (0.3, 2.0, 11.0):
            for c_times_t in (0.5, 3.0):
                actual = complex(
                    math.cos(c_times_t - math.pi / 4.0),
                    math.sin(c_times_t - math.pi / 4.0),
                )
                coefficient = complex(math.cos(-c_times_c), math.sin(-c_times_c))
                completed = complex(
                    math.cos(c_times_t + c_times_c - math.pi / 4.0),
                    math.sin(c_times_t + c_times_c - math.pi / 4.0),
                )
                self.assertAlmostEqual((coefficient * completed).real, actual.real, places=14)
                self.assertAlmostEqual((coefficient * completed).imag, actual.imag, places=14)

    def test_hessian_and_transition_curvature_square(self) -> None:
        for r_value in (0.01, 0.2, 0.8, 1.0):
            z_symmetric = math.sqrt(1.0 + r_value)
            hessian = (
                (-(1.0 + r_value), -(1.0 + r_value)),
                (-(1.0 + r_value), -(1.0 + r_value)),
            )
            trace = hessian[0][0] + hessian[1][1]
            determinant = hessian[0][0] * hessian[1][1] - hessian[0][1] * hessian[1][0]
            self.assertAlmostEqual(trace, -2.0 * (1.0 + r_value), places=15)
            self.assertAlmostEqual(determinant, 0.0, places=15)
            self.assertLess(z_symmetric, 2.0)

            # First true mask transition: z_1=2, x_1=sqrt(3).
            x_value = math.sqrt(3.0)
            reciprocal = r_value / x_value
            z_product = 2.0 * math.sqrt(1.0 + reciprocal * reciprocal)
            curvature = -(
                (x_value**4 - r_value**2) ** 2
                / (z_product * x_value**4 * r_value**2)
            )
            self.assertLess(curvature, 0.0)
            self.assertNotEqual(curvature, 0.0)

    def test_k_normalization_and_physical_fold_factor(self) -> None:
        for lam in (2.5, 7.5, 31.5):
            area = lam * lam
            c_value = 2.0 * math.pi * area
            for number in (math.ceil(1.2 * area), math.ceil(2.3 * area)):
                # Outside K times the two T normalizations; the dv/v Jacobian
                # has already been included.
                k_h_prefactor = (
                    math.sqrt(2.0 * math.pi * c_value * number)
                    / (4.0 * math.sqrt(number))
                    * (2.0 * lam / c_value)
                )
                self.assertAlmostEqual(k_h_prefactor, 0.5, places=14)

                phi_to_h_product = math.sqrt(number) / 4.0
                k_to_phi = k_h_prefactor / phi_to_h_product
                self.assertAlmostEqual(k_to_phi, 2.0 / math.sqrt(number), places=14)

    def test_exact_paired_alias_factor_and_positive_constant_component(self) -> None:
        for chi_value in (0.01, 0.5, 0.999):
            for length in (3.0, 19.0):
                paired_alias = -chi_value / 4.0
                unilateral_hermitian = paired_alias / 2.0
                physical_constant = (-2.0 * length) * paired_alias
                self.assertAlmostEqual(unilateral_hermitian, -chi_value / 8.0, places=15)
                self.assertAlmostEqual(physical_constant, length * chi_value / 2.0, places=15)
                self.assertGreater(physical_constant, 0.0)

    def test_isolated_and_combined_quartic_cutoff_scales(self) -> None:
        for length in (100.0, 10_000.0):
            project_alpha = math.log(length) ** 4
            isolated = length / project_alpha ** 0.25
            combined = 1.0 / project_alpha ** 0.25
            safe_isolated = length / (length**8) ** 0.25
            self.assertAlmostEqual(isolated, length / math.log(length), places=12)
            self.assertAlmostEqual(combined, 1.0 / math.log(length), places=12)
            self.assertAlmostEqual(safe_isolated, 1.0 / length, places=15)
            self.assertGreater(isolated, 1.0)
            self.assertLess(combined, 1.0)

    def test_scope_and_fail_closed_boundaries_are_serialized(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "both-miss reciprocal-core theorem",
            r"B_N(\rho)=G_N-2\log N+\Lambda(N)",
            r"G_N-B_N(\rho)=2\log N-\Lambda(N)>0",
            r"N_*=A(1+r)",
            r"T_r(x_1)+T_r(x_2)-z_1z_2=-C(r)",
            r"\cos\{-\sigma(r)-\pi\}=-\cos\sigma(r)",
            r"S_1:=\widehat K(1)+\widehat K(-1)",
            r"=-{1\over4}\mathsf X",
            "part of one unilateral coefficient is `-mathsf X/8`",
            r"(-2L)S_1={L\over2}\mathsf X\succeq0",
            r"-{(x^4-r^2)^2\over Zx^4r^2}",
            "There is no additional factor two in (3.8)",
            "carrier coefficient",
            "must not be norm-bounded separately",
            r"{CL\over\alpha_0^{1/4}}",
            "`alpha_0=L^8` gives `O(L^{-1})`",
            "masked\nPoisson--Morse--Bott/Garding lemma",
            "does **not** prove the complete physical Plemelj assembly `PA`",
            "may not be added again",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        forbidden = (
            "the complete physical Plemelj assembly is proved",
            "the full central floor follows",
            "the mask-transition operator is positive semidefinite",
            "the raw prime discrepancy is o(1)",
            "this proves equation (5.2)",
            "this proves RH",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
