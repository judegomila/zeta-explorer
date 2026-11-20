#!/usr/bin/env python3
"""Stdlib regressions for reciprocal chi_4 von Mangoldt cancellation."""

from __future__ import annotations

import ast
import cmath
from fractions import Fraction
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "RECIPROCAL_CHI4_VON_MANGOLDT_DYADIC_CANCELLATION_THEOREM.md"
)
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}

PRIMARY_SOURCE = (
    "https://personal.science.psu.edu/rcv4/571s25/"
    "montgomery-vaughanII.pdf"
)


def chi4(value: int) -> int:
    if value % 2 == 0:
        return 0
    return 1 if value % 4 == 1 else -1


def von_mangoldt(value: int) -> float:
    """Return Lambda(value), using only exact integer trial division."""
    if value < 2:
        return 0.0
    remainder = value
    prime = None
    divisor = 2
    while divisor * divisor <= remainder:
        if remainder % divisor == 0:
            if prime is not None and prime != divisor:
                return 0.0
            prime = divisor
            while remainder % divisor == 0:
                remainder //= divisor
        divisor += 1
    if remainder > 1:
        if prime is not None and prime != remainder:
            return 0.0
        prime = remainder
    return 0.0 if prime is None else math.log(prime)


def reciprocal_sum(start: int, stop: int, phase: float) -> complex:
    return sum(
        von_mangoldt(value)
        * chi4(value)
        * cmath.exp(-1j * phase / value)
        for value in range(start + 1, stop + 1)
    )


def choose_parameters(poly_exponent: float) -> tuple[Fraction, int]:
    """One fixed legal delta,r pair; neither depends on N."""
    delta = Fraction(1, 32)
    r_order = 3
    while (
        r_order * delta <= poly_exponent + 2
        or r_order * (1 - 2 * delta) <= poly_exponent + 2
    ):
        r_order += 1
    return delta, r_order


class ReciprocalChi4VonMangoldtDyadicCancellationTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_repository_boundary(self) -> None:
        note = NOTE.read_text(encoding="utf-8")
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"`{relative}`", note)
            self.assertIn(f"`{expected}`", note)

    def test_primary_source_is_explicit_but_not_fake_hash_locked(self) -> None:
        note = NOTE.read_text(encoding="utf-8")
        self.assertIn(PRIMARY_SOURCE, note)
        self.assertIn("Theorem 16.12", note)
        self.assertIn("section 17.1", note)
        self.assertIn("Corollary 11.18", note)
        self.assertIn("not vendored", note)
        self.assertIn("No hash is invented", note)

    def test_chi4_fourier_identity_and_complete_multiplicativity(self) -> None:
        for value in range(-100, 101):
            fourier = (
                cmath.exp(2j * math.pi * value / 4)
                - cmath.exp(-2j * math.pi * value / 4)
            ) / (2j)
            self.assertAlmostEqual(fourier.real, chi4(value), places=13)
            self.assertAlmostEqual(fourier.imag, 0.0, places=13)
        for first in range(1, 40):
            for second in range(1, 40):
                self.assertEqual(
                    chi4(first * second),
                    chi4(first) * chi4(second),
                )

    def test_even_prime_powers_vanish_exactly(self) -> None:
        for exponent in range(1, 40):
            value = 2**exponent
            self.assertEqual(chi4(value), 0)
            self.assertGreater(von_mangoldt(value), 0)
            self.assertEqual(von_mangoldt(value) * chi4(value), 0)

    def test_von_mangoldt_reference_values(self) -> None:
        for value in (2, 3, 5, 7, 11, 13, 17, 19):
            self.assertAlmostEqual(von_mangoldt(value), math.log(value))
        for value, prime in ((4, 2), (8, 2), (9, 3), (25, 5), (49, 7)):
            self.assertAlmostEqual(von_mangoldt(value), math.log(prime))
        for value in (1, 6, 10, 12, 15, 18, 20, 45):
            self.assertEqual(von_mangoldt(value), 0)

    def test_reciprocal_phase_conjugates_for_negative_a(self) -> None:
        for start, stop, phase in (
            (8, 16, 0.25),
            (31, 57, 17.0),
            (100, 173, 1000.0),
        ):
            positive = reciprocal_sum(start, stop, phase)
            negative = reciprocal_sum(start, stop, -phase)
            self.assertAlmostEqual(positive.real, negative.real, places=12)
            self.assertAlmostEqual(positive.imag, -negative.imag, places=12)

    def test_partial_endpoint_is_a_sharp_interval(self) -> None:
        start, stop, phase = 64, 127, 91.0
        running = 0j
        for endpoint in range(start, stop + 1):
            if endpoint > start:
                running += (
                    von_mangoldt(endpoint)
                    * chi4(endpoint)
                    * cmath.exp(-1j * phase / endpoint)
                )
            self.assertAlmostEqual(
                running.real,
                reciprocal_sum(start, endpoint, phase).real,
                places=13,
            )
            self.assertAlmostEqual(
                running.imag,
                reciprocal_sum(start, endpoint, phase).imag,
                places=13,
            )

    def test_fixed_A_parameter_order_is_feasible(self) -> None:
        for poly_exponent in (1, 2, 5, 20, 100):
            delta, r_order = choose_parameters(poly_exponent)
            self.assertGreater(r_order * delta, poly_exponent + 2)
            self.assertGreater(
                r_order * (1 - 2 * delta),
                poly_exponent + 2,
            )
            self.assertLess(delta, Fraction(1, 16))
            self.assertGreaterEqual(r_order, 3)

    def test_type_I_derivative_scales_to_F(self) -> None:
        # If m*L=N, M_r=z/(m*L^(r+1)); hence L^r*M_r=z/N=F.
        fixtures = (
            (2, 3, 5, 7),
            (7, 11, 13, 4),
            (19, 23, 29, 9),
        )
        for m_value, length, phase, r_order in fixtures:
            size = m_value * length
            derivative_scale = Fraction(
                phase,
                m_value * length ** (r_order + 1),
            )
            self.assertEqual(
                length**r_order * derivative_scale,
                Fraction(phase, size),
            )

    def test_type_II_difference_scale(self) -> None:
        # With N=M*L and h=|l1-l2|, M^r |g^(r)| is comparable
        # to (z/N)*(h/L)=F*h/L on a dyadic box.
        for size_m, size_l, phase, gap in (
            (8, 32, 500, 1),
            (17, 41, 10000, 7),
            (101, 211, 10**6, 19),
        ):
            size_n = size_m * size_l
            scale_f = Fraction(phase, size_n)
            expected_g = scale_f * Fraction(gap, size_l)
            derivative_without_factorial = Fraction(
                phase * gap,
                size_m ** 1 * size_l**2,
            )
            self.assertEqual(expected_g, derivative_without_factorial)

    def test_growing_threshold_closes_all_three_type_II_ranges(self) -> None:
        for log_n in (100.0, 400.0, 1600.0):
            eta = 0.01
            threshold = math.exp(eta * math.sqrt(log_n))
            phase_scale = 2 * threshold
            diagonal_or_tiny = phase_scale**-0.5
            intermediate = (threshold**0.5 / phase_scale) ** 0.5
            self.assertLessEqual(diagonal_or_tiny, threshold**-0.5)
            self.assertLessEqual(intermediate, threshold**-0.25)
            self.assertGreater(threshold, 1)

    def test_epsilon_split_uses_one_fixed_A(self) -> None:
        for epsilon in (Fraction(1, 2), Fraction(1, 5), Fraction(1, 20)):
            fixed_a = max(Fraction(1), 1 / epsilon)
            for base in (10, 100, 1000):
                c_value = base**20
                n_value = math.ceil(c_value ** float(epsilon))
                self.assertLessEqual(c_value, n_value ** float(fixed_a))
            self.assertEqual(fixed_a, 1 / epsilon)

    def test_note_freezes_quantifiers_and_fail_closed_boundary(self) -> None:
        note = NOTE.read_text(encoding="utf-8")
        required = (
            "For every fixed real `A>=1`",
            "`A=A(N)`",
            "First take `c` to infinity",
            "then let `epsilon` decrease",
            "equality branch",
            "Archimedean symbol",
            "exact-to-model FIO reduction",
            "amplitude variation",
            "`P_0`",
            "signed growing-rest floor",
            "equation (5.2)",
            "RH or Lambda conclusion",
            "P0_INVALIDATED",
        )
        for marker in required:
            self.assertIn(marker, note)

    def test_test_module_is_stdlib_and_syntax_clean(self) -> None:
        source = TEST.read_text(encoding="utf-8")
        tree = ast.parse(source)
        imported_roots: set[str] = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported_roots.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported_roots.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported_roots,
            {
                "__future__",
                "ast",
                "cmath",
                "fractions",
                "hashlib",
                "math",
                "pathlib",
                "unittest",
            },
        )

    def test_package_has_clean_bytes(self) -> None:
        for path in (NOTE, TEST):
            raw = path.read_bytes()
            self.assertNotIn(b"\x00", raw, path.name)
            self.assertNotIn(b"\r", raw, path.name)
            self.assertNotIn(b"\t", raw, path.name)
            for line_number, line in enumerate(raw.splitlines(), 1):
                self.assertEqual(
                    line,
                    line.rstrip(b" "),
                    f"trailing whitespace: {path.name}:{line_number}",
                )


if __name__ == "__main__":
    unittest.main()
