#!/usr/bin/env python3
"""Fail-closed regressions for the non-mutating outer--outer erratum."""

from __future__ import annotations

import cmath
import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "OUTER_OUTER_SPECTRAL_THEOREM_ERRATUM.md"

NOTE_HASH = "fecb3647b1e632debd5d7ae3cff1cb5b8db0c29e858041e5037d5c496529f145"
HISTORICAL_HASHES = {
    "notes/OUTER_OUTER_SPECTRAL_THEOREM.md":
        "02407eafa8fd5db4c5d8b5bbb2f62d5215f6ef5bf1cb5104fa53caddb52800e4",
    "tests/test_outer_outer_spectral_theorem.py":
        "23f212a876183f3c0bef0f4acdf7b20db23436451d72e8abc5a4cf59c782bb1f",
    "src/outer_outer_spectral_theorem.py":
        "fb665df6207257916643619cd09bd291888a4f18e752f4bb38d497371559aba5",
    "verifier/outer_outer_spectral_theorem_replay.py":
        "de9862d8f5b90d5dbadef8044c1dd939daa51536fbf81cae0cbb237e8312b5d1",
    "artifacts/outer_outer_spectral_theorem/README.md":
        "be3bd6d6024acfe547d1592ef736a43fe700bb7c088393a7816cfa29e8dc85c1",
    "HYBRID_OUTER_SAMPLING_SOURCE_LOCK.json":
        "65df5f6f47aa0718f1768d1dfafa5f5ec659e4c2681419ef130cd15572b6a9f9",
    "TRANSITION_PROLATE_OUTER_SOURCE_LOCK.json":
        "463511b13e9313178980c57cdd7bfd008f84d447a3d8e20c3774e4b1b498be9d",
    "COMPACT_ABSOLUTE_SAMPLING_SOURCE_LOCK.json":
        "48c1bb3a206b4b7d4b448775a7ed6041a248b345a09fe42ab925c5cd233f0cf4",
}


class OuterOuterSpectralTheoremErratumTests(unittest.TestCase):
    def test_frozen_erratum_and_historical_bytes(self) -> None:
        self.assertEqual(hashlib.sha256(NOTE.read_bytes()).hexdigest(), NOTE_HASH)
        for relative, expected in HISTORICAL_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_real_even_conjugation_makes_the_correct_pair_a_square(self) -> None:
        # The symmetric two-point measure at +/-1 has real-even transform
        # F(z)=2*cos(z).
        for z in (0.3 + 0.7j, 1.1 - 0.4j, math.pi / 2 + 0.8j):
            value = 2 * cmath.cos(z)
            reflected = 2 * cmath.cos(z.conjugate())
            self.assertAlmostEqual(reflected.real, value.conjugate().real)
            self.assertAlmostEqual(reflected.imag, value.conjugate().imag)
            correct = value * reflected.conjugate()
            self.assertAlmostEqual(correct.real, (value * value).real)
            self.assertAlmostEqual(correct.imag, (value * value).imag)

    def test_off_line_real_even_summand_is_indefinite(self) -> None:
        y = 0.8
        negative_value = 2 * cmath.cos(math.pi / 2 + 1j * y)
        negative_pair = negative_value * negative_value
        self.assertAlmostEqual(negative_pair.imag, 0.0, places=14)
        self.assertLess(negative_pair.real, 0.0)

        positive_value = 2 * cmath.cos(1j * y)
        positive_pair = positive_value * positive_value
        self.assertAlmostEqual(positive_pair.imag, 0.0, places=14)
        self.assertGreater(positive_pair.real, 0.0)

    def test_wrong_unconjugated_display_is_an_absolute_square(self) -> None:
        z = math.pi / 2 + 0.8j
        value = 2 * cmath.cos(z)
        reflected = 2 * cmath.cos(z.conjugate())
        wrong = value * reflected
        self.assertAlmostEqual(wrong.imag, 0.0, places=14)
        self.assertAlmostEqual(wrong.real, abs(value) ** 2, places=14)
        self.assertGreater(wrong.real, 0.0)
        self.assertLess((value * reflected.conjugate()).real, 0.0)

    def test_absolute_sampling_inequality_and_constants_are_unchanged(self) -> None:
        for a, b in (
            (1 + 2j, -3 + 4j),
            (0.5 - 0.25j, 2.5 + 0.75j),
            (-7j, 3 - 2j),
        ):
            corrected = a * b.conjugate()
            self.assertAlmostEqual(abs(corrected), abs(a) * abs(b))
            self.assertLessEqual(2 * abs(corrected), abs(a) ** 2 + abs(b) ** 2)

        text = NOTE.read_text(encoding="utf-8")
        for constant in ("128 Z_finite", "1280", "C_{\\rm spec}", "C_D"):
            self.assertIn(constant, text)

    def test_claim_boundary_is_serialized(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            r"F_f(s_\rho)\,\overline{F_f(\overline{s_\rho})}",
            r"=F_f(s_\rho)^2",
            "need not be nonnegative",
            "changes no absolute-value bound",
            "same two absolute sampling sums",
            "No source-lock JSON is rewritten",
            r"-\delta_qD_{\rm full}\preceq\Sigma_N-Q_X",
            "does not assign a sign to `Q_X`",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        forbidden = (
            "the signed Weil form is positive",
            "Q_X is positive",
            "the central floor is proved",
            "equation (5.2) is proved",
            "RH_PROVED",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)

    def test_tex_tags_and_control_bytes_survive_serialization(self) -> None:
        for path in (NOTE, Path(__file__)):
            bad = [value for value in path.read_bytes() if value < 32 and value not in (9, 10)]
            self.assertEqual(bad, [], str(path))

        text = NOTE.read_text(encoding="utf-8")
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))
        self.assertEqual(text.count("\n\\[\n"), text.count("\n\\]\n"))
        for malformed in ("{cal W}", "{cal E}", ",qquad", "\n\\[\n\\[\n"):
            self.assertNotIn(malformed, text)


if __name__ == "__main__":
    unittest.main()
