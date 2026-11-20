#!/usr/bin/env python3
"""Regressions for the global fourth-moment diagonal counterconfiguration.

Only Python standard-library arithmetic is used.  The tests freeze the note,
audit the exact scale partitions and exponent ledgers, and enforce the
synthetic-versus-zeta claim boundary.
"""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GLOBAL_FOURTH_MOMENT_DIAGONAL_COUNTERCONFIGURATION.md"
TEST = ROOT / "tests" / "test_global_fourth_moment_diagonal_counterconfiguration.py"

NOTE_HASH = "50401ea94320efdbb9972cc55af4e6fc35b37bc01d3ea38440b4f0e66f570f1f"
PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


class GlobalFourthMomentDiagonalCounterconfigurationTests(unittest.TestCase):
    def test_frozen_note_and_protected_bytes(self) -> None:
        self.assertEqual(hashlib.sha256(NOTE.read_bytes()).hexdigest(), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_packet_schedule_and_active_window_partition_are_exact(self) -> None:
        # T_(k+m)=4^m*T_k.  On L/T_k in [1/2,2], these are the
        # exact q-windows for k-1,k,k+1,k+2.
        base = (F(1, 2), F(2))
        windows = tuple(
            (base[0] / (4**offset), base[1] / (4**offset))
            for offset in (-1, 0, 1, 2)
        )
        self.assertEqual(
            windows,
            (
                (F(2), F(8)),
                (F(1, 2), F(2)),
                (F(1, 8), F(1, 2)),
                (F(1, 32), F(1, 8)),
            ),
        )
        self.assertTrue(all(F(1, 32) <= lo <= hi <= 8
                            for lo, hi in windows))

        # The next future packet starts below the Poisson window.
        self.assertEqual(base[1] / (4**3), F(1, 32))
        # The second older packet starts at the old-packet threshold.
        self.assertEqual(base[0] * (4**2), F(8))

    def test_poisson_decay_and_delayed_recurrence_constants_are_exact(self) -> None:
        q_min = F(1, 32)
        q_max = F(8)
        h_over_pi = F(1, 16)

        # n*q*h^2/2 = (pi^2/16384)*n at the left endpoint.
        decay_over_pi_squared = q_min * h_over_pi**2 / 2
        self.assertEqual(decay_over_pi_squared, F(1, 16384))

        # Throughout the active interval, 0<q*h<=pi/2.
        self.assertEqual(q_max * h_over_pi, F(1, 2))
        # The first exact lattice recurrence q*h=2*pi is q=32.
        self.assertEqual(F(2) / h_over_pi, F(32))
        self.assertGreater(F(32), q_max)

    def test_real_part_band_is_positive_and_has_nonattained_edge(self) -> None:
        # Use a rational stand-in g satisfying the much stronger smallness
        # needed by the theorem.  The algebraic band endpoints are exact.
        g = F(1, 10**7)
        B = F(1, 4)
        for n in (100, 200, 400, 800):
            upper = B - 2 * g / n
            lower = B - (2 * g + F(1, 2)) / n
            self.assertGreater(lower, 0)
            self.assertLessEqual(lower, upper)
            self.assertLess(upper, B)
        self.assertGreater(B - 2 * g / 800, B - 2 * g / 100)

    def test_old_packet_recurrence_is_swallowed_before_q_32(self) -> None:
        # With n_(k+1)=2n, b_(k+1)-b_k=g/n and
        # log(G_(k+1)^4/G_k^2)=6gn, the exponential ledger is
        # g*(q-6)*n.
        for q in (F(8), F(16), F(32), F(64)):
            coefficient = q - 6
            self.assertGreaterEqual(coefficient, 2)
        self.assertEqual(F(32) - 6, 26)

    def test_future_packet_suppression_starts_at_the_third_packet(self) -> None:
        # Equation (5.7) has coefficient 8-2^(m+1).
        coefficients = {m: 8 - 2 ** (m + 1) for m in range(3, 8)}
        self.assertEqual(coefficients[3], -8)
        self.assertTrue(all(value <= -8 for value in coefficients.values()))
        self.assertTrue(all(
            coefficients[m + 1] < coefficients[m] for m in range(3, 7)
        ))

    def test_second_order_resolvent_expansion_has_the_needed_remainder(self) -> None:
        # (1+u)^(-2)=1-2u+3u^2+O(u^3).  Multiplication by G^-2
        # leaves G^-5, while the fourth moment is at scale G^-4.
        coefficients = tuple(((-1) ** degree) * (degree + 1)
                             for degree in range(3))
        self.assertEqual(coefficients, (1, -2, 3))
        base_power = -2
        remainder_power = base_power - 3
        fourth_moment_power = -4
        self.assertEqual(remainder_power, -5)
        self.assertEqual(remainder_power - fourth_moment_power, -1)

    def test_count_and_summability_scales_are_compatible(self) -> None:
        # Packet population is O(n), log G=gn, and the next carrier squares.
        g = F(1, 10**7)
        for n in (64, 128, 256):
            population = 4 * n + 2
            log_carrier = g * n
            self.assertLessEqual(
                F(population, 1),
                (F(5, 1) / g) * log_carrier,
            )
            self.assertEqual(2 * g * n, g * (2 * n))

        # n*exp(-g*n) is summable on n=2^k*n0: eventually its
        # consecutive ratio is below 1/2.
        n0 = 2_000_000
        terms = [
            (2**k * n0) * math.exp(-float(g) * (2**k * n0))
            for k in range(8)
        ]
        self.assertTrue(all(value > 0 for value in terms))
        self.assertLess(terms[-1] / terms[-2], F(1, 2))

    def test_filler_is_nonnegative_and_laplace_identity_is_exact(self) -> None:
        for eta in (3.0, 11.0, 101.0):
            for length in (0.1, 1.0, 7.5):
                contribution = 2 * (1 - math.cos(eta * length)) / eta**2
                self.assertGreaterEqual(contribution, 0)
                self.assertLessEqual(contribution, 4 / eta**2)

        # Integral of 2*(cosh(alpha*t)-1)/alpha^2 against exp(-s*t).
        for s, alpha_squared in ((F(7), F(3)), (F(11), F(-5))):
            direct = (
                F(2, 1) / alpha_squared
                * (s / (s * s - alpha_squared) - F(1, 1) / s)
            )
            reduced = F(2, 1) / (s * (s * s - alpha_squared))
            self.assertEqual(direct, reduced)

    def test_grid_rounding_exponent_is_strictly_decaying(self) -> None:
        B = F(1, 4)
        grid_spacing_exponent = F(-1, 2)
        derivative_times_spacing = B + grid_spacing_exponent
        self.assertEqual(derivative_times_spacing, F(-1, 4))
        self.assertLess(derivative_times_spacing, 0)

    def test_claim_boundary_and_same_sequence_no_go_are_frozen(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Global fourth-moment diagonal counterconfiguration",
            r"|\Psi(L)|\leq C_b{A_{4,b}(L)\over L^2}",
            r"\limsup_{L\to\infty}e^{-bL}\Psi(L)=+\infty",
            "hold on the **same** multiset",
            r"{A_{4,b}(L)\over L^2\Psi(L)}\geq {1\over C_b}",
            "positive Gaussian weights are realized by small changes of the real parts",
            r"N(H+1)-N(H)=O(\log H)",
            "Riemann--von Mangoldt main term with an ",
            "first recurrence",
            "not** the zeta-zero set",
            "no claim is made about matching a sharp numerical constant",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "the actual zeta zeros satisfy (0.3)",
            "HSW proves the fourth-moment diagonal gate",
            "the nonattained actual-zero case is proved",
            "Riemann hypothesis is proved",
            "equation (5.2) is proved",
            "unconditional graph routing",
        )
        for token in forbidden:
            self.assertNotIn(token, text)

    def test_serialization_tags_and_control_bytes(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        self.assertEqual(text.count(r"\["), text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))

        allowed = {9, 10, 13}
        for path in (NOTE, TEST):
            bad = [
                byte for byte in path.read_bytes()
                if (byte < 32 and byte not in allowed) or byte == 127
            ]
            self.assertEqual(bad, [], path.name)


if __name__ == "__main__":
    unittest.main()
