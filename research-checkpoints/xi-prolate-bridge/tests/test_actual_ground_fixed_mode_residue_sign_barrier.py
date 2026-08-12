#!/usr/bin/env python3
"""Regressions for the actual-ground fixed-mode residue-sign barrier."""

from __future__ import annotations

import cmath
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ACTUAL_GROUND_FIXED_MODE_RESIDUE_SIGN_BARRIER.md"
NOTE_HASH = "3a64146e1f3836b9dd07ae55a1955e7d66cd35ad72f58d4ce116c18b16cddcce"

FROZEN = {
    "notes/SOURCE_QUOTIENT_PICK_HERGLOTZ_INTERLACING_BARRIER.md":
        "9701ed565588923557dc057ab2cfc072aa253b94ca22bdf61a958ae8caea6f13",
    "tests/test_source_quotient_pick_herglotz_interlacing_barrier.py":
        "86198254841dcdfe54de97cb3652c66f9c301c8cd92c6b55728a7e4dec044658",
    "notes/DETERMINANT_LIMIT_AUDIT.md":
        "1a77a7b6e7b9573c0f9f6656481af24962280959d867177fa232e8f2cfa006b0",
    "tests/test_determinant_bridge.py":
        "d2fee5eb81291b8dbd2bb2e229a89c52cf36704f76d0873f4cdf4e505bb2c69d",
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md":
        "d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0",
    "notes/POLYLOG_GROUND_TRANSFER_SOURCE_AUDIT.md":
        "dde2e190005409e28cce0e675982c46898f1c1ecb46f9cbf13b7b7def78ec988",
    "tests/test_polylog_ground_transfer_source_audit.py":
        "fde8fbe174fecd8b5bf3c761ff2bde83983d1e66d5177dae84ae07b294ba4539",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def interval_exponential_integral(integer_frequency: int, length: float) -> complex:
    """Integral of exp(2*pi*i*q*t/L) on [-L/2,L/2]."""
    if integer_frequency == 0:
        return complex(length)
    frequency = 2.0 * math.pi * integer_frequency / length
    endpoint = length / 2.0
    return (
        cmath.exp(1j * frequency * endpoint)
        - cmath.exp(-1j * frequency * endpoint)
    ) / (1j * frequency)


def transform_sample(coefficients: dict[int, float], n: int, length: float) -> complex:
    total = 0j
    for j, coefficient in coefficients.items():
        total += (
            coefficient
            * ((-1) ** j)
            / math.sqrt(length)
            * interval_exponential_integral(j - n, length)
        )
    return total


class ActualGroundFixedModeResidueSignBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_centered_lattice_sampling(self) -> None:
        length = 7.25
        coefficients = {
            -4: 0.125,
            -3: -0.75,
            -2: 1.5,
            -1: -2.25,
            0: 0.625,
            1: 3.0,
            2: -1.125,
            3: 0.875,
            4: -0.5,
        }
        for n, coefficient in coefficients.items():
            expected = ((-1) ** n) * math.sqrt(length) * coefficient
            actual = transform_sample(coefficients, n, length)
            self.assertAlmostEqual(actual.real, expected, places=12)
            self.assertAlmostEqual(actual.imag, 0.0, places=12)

    def test_moving_target_samples_force_alternation(self) -> None:
        # A positive analytic target near zero models the only local fact
        # used about Xi/4.  Here s_lambda=sqrt(L), the literal determinant
        # scale for an eta-normalized ground, so L*xi_n is the sample.
        constant = 0.497120778188 / 4.0

        def target(z: float) -> float:
            return constant * math.exp(-z * z)

        for length in (100.0, 1000.0, 10000.0):
            coefficients = {
                n: ((-1) ** n) * target(2.0 * math.pi * n / length)
                / length
                for n in range(-8, 9)
            }
            for n, coefficient in coefficients.items():
                self.assertEqual(math.copysign(1.0, coefficient), (-1.0) ** n)
                scaled = length * coefficient
                expected = ((-1) ** n) * target(2.0 * math.pi * n / length)
                self.assertAlmostEqual(scaled, expected, places=14)

        for n in range(-8, 9):
            scaled_limit = ((-1) ** n) * target(2.0 * math.pi * n / 100000.0)
            self.assertAlmostEqual(scaled_limit, ((-1) ** n) * constant, places=6)

    def test_symmetric_prefix_negative_square_count(self) -> None:
        for m in range(1, 25):
            weights = {n: (-1) ** n for n in range(-m, m + 1)}
            negative = [n for n, value in weights.items() if value < 0]
            positive = [n for n, value in weights.items() if value > 0]
            self.assertEqual(len(negative), 2 * math.ceil(m / 2))
            self.assertEqual(len(positive), 1 + 2 * math.floor(m / 2))
            self.assertEqual(negative, [n for n in range(-m, m + 1) if abs(n) % 2])

            for global_sign in (-1, 1):
                unoriented = {
                    n: global_sign * ((-1) ** n) for n in range(-m, m + 1)
                }
                negative_pairs = sum(
                    1 for n in range(1, m + 1) if unoriented[n] < 0
                )
                self.assertGreaterEqual(negative_pairs, math.floor(m / 2))

    def test_h_residues_and_stieltjes_atoms_are_distinguished(self) -> None:
        m = 6
        xi = {n: float((-1) ** n) for n in range(-m, m + 1)}
        h_residues = {n: -value for n, value in xi.items()}
        stieltjes_atoms = {n: -2.0 * n * n * xi[n] for n in range(1, m + 1)}

        self.assertLess(xi[1], 0.0)  # Excludes the all-xi_j >= 0 cone.
        self.assertGreater(xi[2], 0.0)  # Excludes all noncentral xi_n <= 0.
        self.assertGreater(h_residues[1], 0.0)
        self.assertLess(h_residues[2], 0.0)
        self.assertGreater(stieltjes_atoms[1], 0.0)
        self.assertLess(stieltjes_atoms[2], 0.0)

    def test_only_global_sign_gauges_preserve_boundary_line(self) -> None:
        modes = tuple(range(-4, 5))
        xi = {n: float((-1) ** n) * (abs(n) + 1.0) for n in modes}
        for mask in range(1 << len(modes)):
            signs = tuple(1 if mask & (1 << j) else -1 for j in range(len(modes)))
            ground_coordinates = {
                n: signs[j] * xi[n] for j, n in enumerate(modes)
            }
            boundary_coordinates = {n: signs[j] for j, n in enumerate(modes)}
            gauged_weights = {
                n: boundary_coordinates[n] * ground_coordinates[n] for n in modes
            }
            self.assertEqual(gauged_weights, xi)

            preserves_boundary_line = all(value == signs[0] for value in signs)
            if preserves_boundary_line:
                self.assertIn(signs, ((1,) * len(modes), (-1,) * len(modes)))

        alternating = tuple((-1) ** n for n in modes)
        self.assertFalse(all(value == alternating[0] for value in alternating))

    def test_fail_closed_claim_boundary(self) -> None:
        required = (
            "projectively scaled actual-ground limit",
            "s_lambda=sqrt(L)",
            "conditional on the very",
            "negative weights in the Pick kernel, not the signs",
            "does **not** rule out a real-rooted quotient",
            "It cannot consistently prove an eventual",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)

        forbidden = (
            "the Riemann hypothesis is proved",
            "actual-ground convergence is proved",
            "both strict signs therefore hold",
            "the mixed coefficient cone fails",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
