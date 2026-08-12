#!/usr/bin/env python3
"""Exact regressions for the verified-height shrinking-collar theorem.

Only the Python standard library is used.  The tests replay the elementary
geometry, multiplicity bound, rate separation, cofinal exhaustion, and
pinned external-theorem metadata.  They do not read a zero list or rerun the
external Arb/Turing computation.
"""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "VERIFIED_HEIGHT_SHRINKING_COLLAR_PARTIAL_THEOREM.md"
LOCK = ROOT / "ZERO_SAMPLING_SOURCE_LOCK.json"


def gaussian_norm_squared(value: tuple[F, F]) -> F:
    return value[0] * value[0] + value[1] * value[1]


class VerifiedHeightShrinkingCollarPartialTheoremTests(unittest.TestCase):
    def test_liminf_subsequence_is_strictly_weaker_than_full_convergence(self) -> None:
        # Odd entries stay at 1/4, while the certified even subsequence tends
        # to zero.  A fixed off-axis height is eventually above the latter.
        fixed_height = F(1, 9)
        schedule = [F(1, 4) if index % 2 else F(1, index)
                    for index in range(2, 42)]
        certified = schedule[0::2]

        self.assertEqual(schedule[-1], F(1, 4))
        self.assertLess(certified[-1], fixed_height)
        self.assertTrue(all(left > right for left, right in zip(
            certified, certified[1:]
        )))

    def test_constant_raw_height_gives_physical_one_over_L_collar(self) -> None:
        # Work after canceling the common transcendental factor 2*pi:
        # a=epsilon*L/(2*pi), so (2*pi)*a=epsilon*L=1.
        for length in (F(5), F(17), F(101)):
            epsilon = F(1, 1) / length
            scaled_raw_height = epsilon * length
            inner_over_delta = 2 * epsilon
            self.assertEqual(scaled_raw_height, 1)
            self.assertLess(inner_over_delta, 1)

    def test_nested_compacts_are_cofinal_for_off_real_points(self) -> None:
        points = [
            (F(0), F(1, 10)),
            (F(37, 2), F(1, 100)),
            (F(-91, 3), F(49, 100)),
        ]
        for real_part, imaginary_part in points:
            witness = None
            for k in range(5, 2000):
                if (
                    abs(real_part) <= k
                    and F(1, k) <= abs(imaginary_part)
                    and abs(imaginary_part) <= F(1, 2) - F(1, k)
                ):
                    witness = k
                    break
            self.assertIsNotNone(witness)

    def test_real_zero_factor_has_vertical_multiplicity_lower_bound(self) -> None:
        z = (F(17, 5), F(1, 23))
        roots_and_multiplicities = [
            (F(3), 2),
            (F(7, 2), 3),
            (F(-4), 1),
        ]
        height_squared = z[1] * z[1]
        product_squared = F(1)
        total_multiplicity = 0
        for root, multiplicity in roots_and_multiplicities:
            distance_squared = gaussian_norm_squared((z[0] - root, z[1]))
            self.assertGreaterEqual(distance_squared, height_squared)
            product_squared *= distance_squared**multiplicity
            total_multiplicity += multiplicity

        self.assertGreaterEqual(
            product_squared,
            height_squared**total_multiplicity,
        )

    def test_exponential_rate_beats_every_fixed_multiplicity_power(self) -> None:
        # e^(-L)<2^(-L), so it is enough to verify the exact dyadic proxy.
        for multiplicity in (1, 2, 7, 31, 100):
            length = 8
            while F(1, 2**length) >= F(1, length**multiplicity):
                length *= 2
            self.assertLess(F(1, 2**length), F(1, length**multiplicity))

    def test_splitting_scale_can_hide_below_one_over_L(self) -> None:
        # p_epsilon-p_0 is quadratic in epsilon on fixed compacts.  An
        # exponentially small split is eventually far below the 1/L collar.
        for length in (16, 32, 64):
            epsilon = F(1, 2**length)
            self.assertLess(epsilon, F(1, length))
            self.assertEqual(epsilon * epsilon, F(1, 2 ** (2 * length)))

    def test_pinned_height_and_unreplayed_dependency_are_exact(self) -> None:
        lock = json.loads(LOCK.read_text(encoding="utf-8"))
        finite = lock["binding_inputs"]["finite_height_line_verification"]
        self.assertEqual(finite["exact_verified_height"], "3000175332800")
        self.assertIn("NOT_REPLAYED", finite["validation_status"])
        self.assertFalse(
            lock["admission_boundary"]["finite_computations_independently_replayed"]
        )

        vendor = ROOT / finite["vendored_path"]
        digest = hashlib.sha256(vendor.read_bytes()).hexdigest()
        self.assertEqual(digest, finite["vendored_sha256"])

    def test_fixed_height_does_not_form_a_cofinal_horizontal_schedule(self) -> None:
        pinned_height = 3_000_175_332_800
        radii = [pinned_height - 3, pinned_height - 2, pinned_height - 1]
        self.assertTrue(all(radius < pinned_height for radius in radii))
        self.assertEqual(max(radii), pinned_height - 1)

    def test_note_records_inputs_rates_and_claim_boundary(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "H_{\\rm PT}=3000175332800",
            "\\liminf_{j\\to\\infty}\\epsilon_{\\lambda_j}=0",
            "a_\\lambda={1\\over2\\pi}",
            "\\mathcal K_k",
            "\\left\\{z:",
            "O_R(\\lambda^{-2})",
            "R<R_*<H_{\\rm PT}",
            "0<|\\gamma|\\le H_{\\rm PT}",
            "\\Xi(i\\tau)>0\\qquad(|\\tau|\\le1/2)",
            "NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md",
            "|\\Xi(x+iy)|\\ge b_R|y|^{m_R}",
            "{1\\over L}\\le|\\Im z|",
            "No simplicity assertion is used",
            "not independently replayed",
            "doubly non-effective",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "the global shrinking-collar equality is proved",
            "an asymptotically unbounded horizontal window is proved",
        )
        for token in forbidden:
            self.assertNotIn(token, text)


if __name__ == "__main__":
    unittest.main()
