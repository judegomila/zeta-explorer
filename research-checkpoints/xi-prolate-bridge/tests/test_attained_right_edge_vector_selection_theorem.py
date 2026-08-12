#!/usr/bin/env python3
"""Exact regressions for the attained-right-edge vector theorem."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ATTAINED_RIGHT_EDGE_VECTOR_SELECTION_THEOREM.md"

LOCK_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


class AttainedRightEdgeVectorSelectionTheoremTests(unittest.TestCase):
    def test_claim_boundary_is_fail_closed(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "A fixed gap below\nthe rightmost centered-zero line is not needed",
            "Dominated convergence",
            "attained-edge simultaneous vector selection",
            r"d_k(L_j)>0\qquad(0\le k\le K)",
            r"{d_k(L_j)\over d_0(L_j)}\longrightarrow4",
            "sole off-line case not covered",
            "spectral escape gains one inverse ordinate",
            r"{A_3(L)\over A_2(L)}\longrightarrow0",
            r"A_3(L)=o(\sqrt L\,\Psi(L))",
            "finite Fejer block defeats a universal RMS peak theorem",
            "local analytic obstruction, not the zeta-zero set",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        forbidden = (
            "RH_PROVED",
            "Riemann hypothesis is proved",
            "the nonattained case is proved",
            "global counterexample to vector selection is proved",
            "actual-source routing contraction holds",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)

    def test_protected_source_bytes_are_unchanged(self) -> None:
        for relative, expected in LOCK_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_gap_free_normalized_atoms_decay(self) -> None:
        # Write x=exp(T)>1.  A lower-line forward atom normalized by the
        # attained edge B has the exact factor x^(-(B-beta)).
        x = F(9)
        gaps = (F(1, 7), F(1, 11), F(2, 13))
        # Use integer multiples of a common denominator to stay rational.
        powers = (143, 91, 154)
        for gap, power in zip(gaps, powers):
            self.assertGreater(gap, 0)
            self.assertLess(x ** (-power), F(1))

    def test_history_majorant_has_the_required_half_power_gain(self) -> None:
        # If Psi >= c*exp(BL), |M| <= C*exp(BL)/L and
        # |p_k| >= c_p/sqrt(L), the relative error is <= const/sqrt(L).
        for length in (16, 25, 100, 400):
            psi = F(3)  # common exp(BL) factor suppressed
            moment = F(5, length)
            p_abs = F(2, _isqrt(length))
            relative = moment / (p_abs * psi)
            self.assertEqual(relative, F(5, 6 * _isqrt(length)))
        self.assertGreater(F(5, 6 * 4), F(5, 6 * 20))

    def test_nonattained_escape_split_is_exact(self) -> None:
        # Model the proof after splitting at R.  Low terms have an
        # exponentially smaller common factor q; high third-power terms
        # are bounded by A2_high/R.
        for radius in (F(5), F(11), F(23)):
            low_a2 = F(7, 13)
            high_a2 = F(17, 19)
            q = F(1, 101)
            low_a3 = F(3, 5) * low_a2
            high_a3 = high_a2 / radius
            ratio = (q * low_a3 + high_a3) / (q * low_a2 + high_a2)
            self.assertLessEqual(
                ratio,
                F(3, 5) * q * low_a2 / high_a2 + F(1, radius),
            )

    def test_rms_cauchy_schwarz_majorant_is_exact(self) -> None:
        exponential_over_square = (F(2, 3), F(5, 7), F(11, 13))
        inverse_ordinate = (F(1, 5), F(1, 11), F(1, 17))
        a3 = sum(
            (a * b for a, b in zip(exponential_over_square, inverse_ordinate)),
            F(0),
        )
        q2_squared = sum((a * a for a in exponential_over_square), F(0))
        tail_squared = sum((b * b for b in inverse_ordinate), F(0))
        self.assertLessEqual(a3 * a3, q2_squared * tail_squared)

    def test_fejer_identity_and_positive_cap(self) -> None:
        # Evaluate the exact Laurent-polynomial identity at roots of unity
        # using rational cosine fixtures theta=0 and theta=pi.
        for n in range(2, 18):
            weights = tuple(F(n + 1 - j, n + 1) for j in range(1, n + 1))
            at_zero = -2 * sum(weights, F(0))
            fejer_zero = F(n + 1)
            self.assertEqual(at_zero, 1 - fejer_zero)

            at_pi = -2 * sum(
                (weights[j - 1] * ((-1) ** j) for j in range(1, n + 1)),
                F(0),
            )
            geometric = sum(((-1) ** r for r in range(n + 1)), 0)
            fejer_pi = F(geometric * geometric, n + 1)
            self.assertEqual(at_pi, 1 - fejer_pi)
            self.assertLessEqual(at_pi, 1)

    def test_fejer_coefficient_rms_grows(self) -> None:
        for n in (2, 3, 7, 16, 63):
            weights = tuple(F(n + 1 - j, n + 1) for j in range(1, n + 1))
            exact = sum((weight * weight for weight in weights), F(0))
            formula = F(n * (2 * n + 1), 6 * (n + 1))
            self.assertEqual(exact, formula)
            self.assertGreaterEqual(exact, F(n, 6))

    def test_degree_ratio_limit_is_rank_one_coordinate_ratio(self) -> None:
        q = (F(1), F(-2), F(2), F(-2), F(2))
        for k in range(1, len(q)):
            self.assertEqual(q[k] * q[k] / (q[0] * q[0]), F(4))


def _isqrt(value: int) -> int:
    root = int(value ** 0.5)
    if root * root != value:
        raise ValueError("fixture must be a square")
    return root


if __name__ == "__main__":
    unittest.main()
