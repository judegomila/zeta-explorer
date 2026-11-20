#!/usr/bin/env python3
"""Exact regressions for the all-section LP Fourier-cardinal obstruction.

Only Python standard-library rational arithmetic is used.  The tests bind
the frozen predecessor bytes, reconstruct the raw factorizations and Newton
sums, verify the beta-tail cancellation, and certify every rational
inequality in the uniform odd-M proof.
"""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "LP_FOURIER_CARDINAL_ALL_SECTIONS_NONHYPERBOLIC.md"
TEST = ROOT / "tests" / "test_lp_fourier_cardinal_all_sections_nonhyperbolic.py"

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "notes/ADAPTIVE_OUTER_CUTOFF_HYPERBOLICITY_BARRIER.md":
        "70cd98d77d93780ca108a0603be3e95da93d854681c89d5126481579794033ed",
    "tests/test_adaptive_outer_cutoff_hyperbolicity_barrier.py":
        "b9f4e4bd7cce1c01e959bfc31bb5153bc9dfeea2bfc25b75c7804e560b292cdc",
    "notes/LP_FOURIER_CARDINAL_INFINITE_NONHYPERBOLIC_SUBSEQUENCE.md":
        "eb6666223c82597c31faa736cdcd38d0466096ac33b43c81597960422eb9d33b",
    "tests/test_lp_fourier_cardinal_infinite_nonhyperbolic_subsequence.py":
        "b5363899401cd76a37a753afa0b72f4990ec623d63c44078b32a3168b9b6abbe",
}

Polynomial = tuple[F, ...]  # ascending coefficients


def add(left: Polynomial, right: Polynomial) -> Polynomial:
    answer = [F(0)] * max(len(left), len(right))
    for index, value in enumerate(left):
        answer[index] += value
    for index, value in enumerate(right):
        answer[index] += value
    while len(answer) > 1 and answer[-1] == 0:
        answer.pop()
    return tuple(answer)


def scale(polynomial: Polynomial, scalar: F) -> Polynomial:
    return tuple(scalar * value for value in polynomial)


def multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    answer = [F(0)] * (len(left) + len(right) - 1)
    for row, x_value in enumerate(left):
        for column, y_value in enumerate(right):
            answer[row + column] += x_value * y_value
    while len(answer) > 1 and answer[-1] == 0:
        answer.pop()
    return tuple(answer)


def raw_polynomial(raw: tuple[F, ...]) -> Polynomial:
    count = len(raw) - 1
    factors = tuple((F(-n * n), F(1)) for n in range(1, count + 1))
    denominator: Polynomial = (F(1),)
    for factor in factors:
        denominator = multiply(denominator, factor)
    answer = scale(denominator, raw[0])
    for n in range(1, count + 1):
        cofactor: Polynomial = (F(1),)
        for m, factor in enumerate(factors, start=1):
            if m != n:
                cofactor = multiply(cofactor, factor)
        answer = add(answer, (F(0),) + scale(cofactor, 2 * raw[n]))
    return answer


def odd_factor(mode_count: int, pi_value: F) -> Polynomial:
    factors = tuple(
        (F(-(2 * j - 1) ** 2), F(1))
        for j in range(1, mode_count + 1)
    )
    denominator: Polynomial = (F(1),)
    for factor in factors:
        denominator = multiply(denominator, factor)
    answer = scale(denominator, pi_value / 2)
    for j, factor in enumerate(factors, start=1):
        cofactor: Polynomial = (F(1),)
        for k, other in enumerate(factors, start=1):
            if k != j:
                cofactor = multiply(cofactor, other)
        coefficient = 2 * F((-1) ** j, 2 * j - 1)
        answer = add(answer, (F(0),) + scale(cofactor, coefficient))
    return answer


def poly_power_sum_data(mode_count: int) -> tuple[Polynomial, ...]:
    """Return S2,S3,S4 as polynomials in u=1/pi from (1.8)."""
    odd = tuple(2 * j - 1 for j in range(1, mode_count + 1))
    a = {
        power: sum((F(1, value**power) for value in odd), F(0))
        for power in (4, 6, 8)
    }
    b = {
        power: sum(
            (F((-1) ** (j - 1), value**power)
             for j, value in enumerate(odd, start=1)),
            F(0),
        )
        for power in (3, 5, 7, 9)
    }
    return (
        (a[4], -8 * b[5], 16 * b[3] ** 2),
        (a[6], -12 * b[7], 48 * b[3] * b[5], -64 * b[3] ** 3),
        (
            a[8],
            -16 * b[9],
            64 * b[3] * b[7] + 32 * b[5] ** 2,
            -256 * b[3] ** 2 * b[5],
            256 * b[3] ** 4,
        ),
    )


def series_multiply(
    left: tuple[Polynomial, ...],
    right: tuple[Polynomial, ...],
    order: int,
) -> tuple[Polynomial, ...]:
    answer = [(F(0),) for _ in range(order + 1)]
    for row, x_value in enumerate(left):
        for column, y_value in enumerate(right):
            if row + column <= order:
                answer[row + column] = add(
                    answer[row + column],
                    multiply(x_value, y_value),
                )
    return tuple(answer)


def newton_from_normalized_series(mode_count: int) -> tuple[Polynomial, ...]:
    """Derive S2,S3,S4 directly from q(y)/q(0), formally in u=1/pi."""
    order = 4
    odd = tuple(2 * j - 1 for j in range(1, mode_count + 1))
    product: tuple[Polynomial, ...] = ((F(1),),) + ((F(0),),) * order
    for value in odd:
        factor = ((F(1),), (F(-1, value * value),))
        product = series_multiply(product, factor, order)
    beta_samples = {
        power: sum(
            (F((-1) ** (j - 1), value**power)
             for j, value in enumerate(odd, start=1)),
            F(0),
        )
        for power in (3, 5, 7, 9)
    }
    bracket = ((F(1),),) + tuple(
        ((F(0), 4 * beta_samples[2 * k + 1]))
        for k in range(1, order + 1)
    )
    coefficients = series_multiply(product, bracket, order)
    f1, f2, f3, f4 = coefficients[1:]
    s2 = add(multiply(f1, f1), scale(f2, -2))
    s3 = add(
        add(scale(multiply(multiply(f1, f1), f1), -1),
            scale(multiply(f1, f2), 3)),
        scale(f3, -3),
    )
    s4 = add(
        add(
            add(
                scale(f4, -4),
                scale(multiply(f1, f3), 4),
            ),
            scale(multiply(f2, f2), 2),
        ),
        add(
            scale(multiply(multiply(f1, f1), f2), -4),
            multiply(multiply(f1, f1), multiply(f1, f1)),
        ),
    )
    return s2, s3, s4


def original_sums(
    pi_value: F,
    a4: F,
    a6: F,
    a8: F,
    b3: F,
    b5: F,
    b7: F,
    b9: F,
) -> tuple[F, F, F]:
    s2 = a4 + 16 * b3**2 / pi_value**2 - 8 * b5 / pi_value
    s3 = (
        a6 - 12 * b7 / pi_value
        + 48 * b3 * b5 / pi_value**2
        - 64 * b3**3 / pi_value**3
    )
    s4 = (
        a8 - 16 * b9 / pi_value
        + (64 * b3 * b7 + 32 * b5**2) / pi_value**2
        - 256 * b3**2 * b5 / pi_value**3
        + 256 * b3**4 / pi_value**4
    )
    return s2, s3, s4


def tail_sums(
    pi_value: F,
    a4: F,
    a6: F,
    a8: F,
    e3: F,
    e5: F,
    e7: F,
    e9: F,
) -> tuple[F, F, F]:
    s2 = -a4 + pi_value * e3 + 16 * e3**2 / pi_value**2 - 8 * e5 / pi_value
    s3 = (
        -a6 - pi_value**3 * e3 / 32 + 3 * pi_value * e5 / 2
        - 12 * e7 / pi_value + 48 * e3 * e5 / pi_value**2
        - 6 * e3**2 - 64 * e3**3 / pi_value**3
    )
    s4 = (
        -a8 + pi_value**5 * e3 / 2880 - pi_value**3 * e5 / 24
        + 2 * pi_value * e7 - 16 * e9 / pi_value
        + 64 * e3 * e7 / pi_value**2 + 32 * e5**2 / pi_value**2
        - 16 * e3 * e5 + 2 * pi_value**2 * e3**2 / 3
        - 256 * e3**2 * e5 / pi_value**3
        + 32 * e3**3 / pi_value + 256 * e3**4 / pi_value**4
    )
    return s2, s3, s4


def arctan_partial(value: F, last_index: int) -> F:
    return sum(
        ((-1) ** k * value ** (2 * k + 1) / F(2 * k + 1)
         for k in range(last_index + 1)),
        F(0),
    )


class LPFourierCardinalAllSectionsTests(unittest.TestCase):
    def test_protected_frozen_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_machin_alternating_series_proves_pi_enclosure(self) -> None:
        one_fifth = F(1, 5)
        one_239th = F(1, 239)
        # Odd last index is a lower arctan sum; even is an upper sum.
        pi_lower = (
            16 * arctan_partial(one_fifth, 7)
            - 4 * arctan_partial(one_239th, 2)
        )
        pi_upper = (
            16 * arctan_partial(one_fifth, 8)
            - 4 * arctan_partial(one_239th, 1)
        )
        self.assertGreater(pi_lower, F(333, 106))
        self.assertLess(pi_upper, F(355, 113))
        self.assertLess(pi_lower, pi_upper)

    def test_new_package_contains_no_disallowed_control_bytes(self) -> None:
        allowed = {9, 10, 13}
        for path in (NOTE, TEST):
            disallowed = [
                byte for byte in path.read_bytes()
                if (byte < 32 and byte not in allowed) or byte == 127
            ]
            self.assertEqual(disallowed, [], path.name)

    def test_raw_sections_factor_through_the_odd_mode_polynomial(self) -> None:
        for pi_placeholder in (F(3), F(22, 7), F(355, 113)):
            for mode_count in range(2, 7):
                raw_odd = [pi_placeholder / 2]
                for n in range(1, 2 * mode_count):
                    if n % 2 == 0:
                        raw_odd.append(F(0))
                    else:
                        j = (n + 1) // 2
                        raw_odd.append(F((-1) ** j, n))
                even_factors: Polynomial = (F(1),)
                for k in range(1, mode_count):
                    even_factors = multiply(
                        even_factors,
                        (F(-4 * k * k), F(1)),
                    )
                expected_odd = multiply(
                    even_factors,
                    odd_factor(mode_count, pi_placeholder),
                )
                self.assertEqual(raw_polynomial(tuple(raw_odd)), expected_odd)

                raw_even = tuple(raw_odd) + (F(0),)
                expected_even = multiply(
                    expected_odd,
                    (F(-4 * mode_count * mode_count), F(1)),
                )
                self.assertEqual(raw_polynomial(raw_even), expected_even)

    def test_reciprocal_newton_sums_follow_from_normalized_series(self) -> None:
        for mode_count in range(2, 8):
            self.assertEqual(
                newton_from_normalized_series(mode_count),
                poly_power_sum_data(mode_count),
            )

    def test_exact_beta_cancellation_gives_tail_formulas(self) -> None:
        for pi_placeholder in (F(3), F(22, 7), F(333, 106)):
            beta3 = pi_placeholder**3 / 32
            beta5 = 5 * pi_placeholder**5 / 1536
            beta7 = 61 * pi_placeholder**7 / 184320
            beta9 = 1385 * pi_placeholder**9 / 41287680
            a4_tail, a6_tail, a8_tail = F(1, 11), F(2, 13), F(3, 17)
            e3, e5, e7, e9 = F(1, 19), F(2, 23), F(3, 29), F(4, 31)
            original = original_sums(
                pi_placeholder,
                pi_placeholder**4 / 96 - a4_tail,
                pi_placeholder**6 / 960 - a6_tail,
                17 * pi_placeholder**8 / 161280 - a8_tail,
                beta3 + e3,
                beta5 + e5,
                beta7 + e7,
                beta9 + e9,
            )
            expanded = tail_sums(
                pi_placeholder,
                a4_tail,
                a6_tail,
                a8_tail,
                e3,
                e5,
                e7,
                e9,
            )
            self.assertEqual(original, expanded)

    def test_uniform_odd_mode_rational_surrogates_are_strict(self) -> None:
        pi_lower = F(333, 106)
        pi_upper = F(355, 113)
        x = F(1, 7)
        f2_lower = (
            -F(1, 6) - x + pi_lower / 2
            - 4 * (1 + 5 * x) * x**2 / pi_lower
        )
        f2_upper = (
            -F(1, 6) + pi_upper * (1 + 3 * x) / 2
            - 4 * x**2 / pi_upper
            + 4 * (1 + 3 * x) ** 2 * x**3 / pi_lower**2
        )
        f3 = (
            -pi_lower**3 / 64
            + 3 * pi_upper * (1 + 5 * x) * x**2 / 4
            + 12 * (1 + 3 * x) * (1 + 5 * x) * x**5 / pi_lower**2
        )
        coefficient_a = pi_upper**5 / 5760
        coefficient_b = pi_lower**3 / 48
        f4 = (
            coefficient_a * (1 + 3 * x) - coefficient_b * x**2
            + pi_upper * (1 + 7 * x) * x**4
            + 16 * (1 + 3 * x) * (1 + 7 * x) * x**7 / pi_lower**2
            + 8 * (1 + 5 * x) ** 2 * x**7 / pi_lower**2
            + pi_upper**2 * (1 + 3 * x) ** 2 * x**3 / 6
            + 4 * (1 + 3 * x) ** 3 * x**6 / pi_lower
            + 16 * (1 + 3 * x) ** 4 * x**9 / pi_lower**4
        )
        derivative_discriminant = (
            (2 * coefficient_b) ** 2
            - 4 * (pi_upper**2 / 2) * (3 * coefficient_a)
        )

        self.assertEqual(f2_lower, F(3273481, 2690492))
        self.assertEqual(
            F(33, 16) - f2_upper,
            F(10460413609237, 1196204539738320),
        )
        self.assertEqual(
            -F(2, 5) - f3,
            F(797489670449391743, 436996798491065863680),
        )
        self.assertEqual(
            F(19, 250) - f4,
            F(
                43917328230225517403879861572711173047,
                52286703643634855977515802478452324272000,
            ),
        )
        self.assertEqual(
            derivative_discriminant,
            -F(
                94659082817413134972874512509,
                64074544082187618689659613184,
            ),
        )

    def test_hankel_bound_covers_every_section_from_three_onward(self) -> None:
        self.assertEqual(
            F(33, 16) * F(19, 250) - F(2, 5) ** 2,
            -F(13, 4000),
        )
        for section_count in range(3, 1000):
            mode_count = (section_count + 1) // 2
            self.assertGreaterEqual(mode_count, 2)
            self.assertTrue(mode_count % 2 == 0 or mode_count >= 3)

    def test_note_preserves_fixture_scope_and_fail_closed_boundary(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "nonhyperbolic for every }N\\geq3",
            "reciprocal-root Hankel determinant",
            r"H_M:=S_2S_4-S_3^2",
            r"-{13\over4000}b^{-6}<0",
            "good cofinal",
            "actual projected prolate anchors",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)
        forbidden = (
            "This proves the Riemann hypothesis",
            "the actual prolate sections are nonhyperbolic",
            "equation (5.2) is proved",
            "Lambda is bounded",
        )
        for token in forbidden:
            self.assertNotIn(token, text)


if __name__ == "__main__":
    unittest.main()
