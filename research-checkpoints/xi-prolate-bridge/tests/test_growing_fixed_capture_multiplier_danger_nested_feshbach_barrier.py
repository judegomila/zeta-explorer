from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_FIXED_CAPTURE_MULTIPLIER_DANGER_NESTED_FESHBACH_BARRIER.md"

DEPENDENCIES = {
    "notes/GROWING_MIXED_BRIDGE_ACTUAL_MULTIPLIER_DANGEROUS_FESHBACH_REDUCTION.md": "cc2a62d6be1c62985ab9d5e2893c74c9ae773280f6bff4015f998364ccbd924e",
    "notes/GROWING_MIXED_BRIDGE_RETAINED_COMPLEMENT_TWO_STAGE_SCHUR_BARRIER.md": "102f69ec567803153d5648316874c8369cd558ee17cfce71f3cca2e9bb259f81",
    "notes/GROWING_SIGNED_DISCREPANCY_CENTERED_ZERO_KREIN_FACTORIZATION_BARRIER.md": "0257bb5582700fada40fc2a6c6ba578a09fad94e11eb4fa0f72a525c80bd04c9",
    "notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md": "04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83",
    "notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md": "3efbbf5cd0888d2a645b11c73b625007bf38bf010881d5e0c9d8ecbc964fb1a6",
    "DIRECT_RH_ATTACK.md": "b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2",
    "src/weil_matrix.py": "9a6f7b4d8ef7a7f5d12445f61cce2cb23ec44625f63981e829d7286c4e856902",
    "src/parity_multiplier_schur.py": "63d1e2aa0616d36c6036ba44de618777f514237c627e43d58175a7ece4d47013",
}


def T(A):
    return [list(row) for row in zip(*A)]


def mm(A, B):
    return [
        [sum((A[i][k] * B[k][j] for k in range(len(B))), F(0)) for j in range(len(B[0]))]
        for i in range(len(A))
    ]


def sub(A, B):
    return [[x - y for x, y in zip(ar, br)] for ar, br in zip(A, B)]


def det2(A):
    return A[0][0] * A[1][1] - A[0][1] * A[1][0]


def det3(A):
    return (
        A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1])
        - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0])
        + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0])
    )


def inv1(A):
    return [[1 / A[0][0]]]


def block_short(D, Gamma, H):
    return sub(D, mm(mm(T(Gamma), inv1(H)), Gamma))


class NestedDangerFeshbachTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text()

    def test_frozen_hashes(self) -> None:
        for relative, expected in DEPENDENCIES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)
            self.assertIn(expected, self.text)

    def test_source_cauchy_off_diagonals(self) -> None:
        modes = (-1, 0, 1)
        b = {n: F(2 * n) for n in modes}
        for n in modes:
            for m in modes:
                if n != m:
                    self.assertEqual((b[n] - b[m]) / (n - m), F(2))

    def _model(self, a: int):
        B = [[F(a), F(2), F(2)], [F(2), F(-1), F(2)], [F(2), F(2), F(1)]]
        Tv = [[F(20), F(0), F(0)], [F(0), F(20), F(0)], [F(0), F(0), F(4, 5)]]
        I = [[F(int(i == j)) for j in range(3)] for i in range(3)]
        Ta = sub([[B[i][j] + Tv[i][j] for j in range(3)] for i in range(3)], I)
        return B, Tv, Ta

    def test_multiplier_models_are_strict_positive_parts(self) -> None:
        expected = {3: (F(22), F(392), F(848, 5)), 6: (F(25), F(446), F(1004, 5))}
        for a in (3, 6):
            B, Tv, Ta = self._model(a)
            minors = (Ta[0][0], det2([row[:2] for row in Ta[:2]]), det3(Ta))
            self.assertEqual(minors, expected[a])
            self.assertTrue(all(value > 0 for value in minors))
            reconstructed = sub(
                [[F(int(i == j)) + Ta[i][j] for j in range(3)] for i in range(3)],
                Tv,
            )
            self.assertEqual(reconstructed, B)

    def test_parity_poles_are_retained(self) -> None:
        for a in (3, 6):
            B, Tv, Ta = self._model(a)
            pole = [[F(2) if i == 0 and j == 0 else F(0) for j in range(3)] for i in range(3)]
            Ta_plus = sub(Ta, pole)
            Ta_minus = [[Ta[i][j] + pole[i][j] for j in range(3)] for i in range(3)]
            self.assertGreater(Ta_plus[0][0], 0)
            self.assertGreater(det2([row[:2] for row in Ta_plus[:2]]), 0)
            self.assertGreater(det3(Ta_plus), 0)
            plus = [[F(int(i == j)) + Ta_plus[i][j] - Tv[i][j] + pole[i][j] for j in range(3)] for i in range(3)]
            minus = [[F(int(i == j)) + Ta_minus[i][j] - Tv[i][j] - pole[i][j] for j in range(3)] for i in range(3)]
            self.assertEqual(plus, B)
            self.assertEqual(minus, B)

    def test_exact_phase_dilation_can_take_M_100(self) -> None:
        for a in (3, 6):
            _B, Tv, Ta = self._model(a)
            R0 = [
                [F(int(i == j)) - (Ta[i][j] + Tv[i][j]) / 100 for j in range(3)]
                for i in range(3)
            ]
            minors = (R0[0][0], det2([row[:2] for row in R0[:2]]), det3(R0))
            self.assertTrue(all(value > 0 for value in minors))

    def test_danger_threshold_and_safe_floor(self) -> None:
        _B, Tv, _Ta = self._model(3)
        threshold = F(9, 10)
        self.assertGreaterEqual(Tv[0][0], threshold)
        self.assertGreaterEqual(Tv[1][1], threshold)
        self.assertLess(Tv[2][2], threshold)
        self.assertGreaterEqual(F(1), F(1, 10))

    def test_physical_capture_does_not_imply_harmonic_capture(self) -> None:
        B, _Tv, _Ta = self._model(3)
        D = [row[:2] for row in B[:2]]
        Gamma = [[B[2][0], B[2][1]]]
        H = [[B[2][2]]]
        Sigma = block_short(D, Gamma, H)
        self.assertEqual(Sigma, [[F(-1), F(-2)], [F(-2), F(-5)]])
        self.assertGreater(B[0][0], 0)
        self.assertLess(Sigma[0][0], 0)

    def test_positive_harmonic_capture_still_leaves_negative_uncaptured_short(self) -> None:
        B, _Tv, _Ta = self._model(6)
        D = [row[:2] for row in B[:2]]
        Gamma = [[B[2][0], B[2][1]]]
        H = [[B[2][2]]]
        Sigma = block_short(D, Gamma, H)
        self.assertEqual(Sigma, [[F(2), F(-2)], [F(-2), F(-5)]])
        nested = Sigma[1][1] - Sigma[1][0] * Sigma[0][1] / Sigma[0][0]
        self.assertEqual(nested, F(-7))

    def test_harmonic_capture_complete_square_identity(self) -> None:
        B, _Tv, _Ta = self._model(6)
        D = [row[:2] for row in B[:2]]
        Gamma = [[B[2][0], B[2][1]]]
        H = [[B[2][2]]]
        Sigma = block_short(D, Gamma, H)
        # Captured vector c=(1,0,0): J=(1,0), f=0, Z=H^-1 Gamma J=2.
        harmonic = Sigma[0][0]
        excess = F(2) * H[0][0] * F(2)
        self.assertEqual(harmonic + excess, B[0][0])

    def test_exact_double_schur_congruence_on_model(self) -> None:
        B, _Tv, _Ta = self._model(6)
        D = [row[:2] for row in B[:2]]
        Gamma = [[B[2][0], B[2][1]]]
        H = [[B[2][2]]]
        Sigma = block_short(D, Gamma, H)
        A = [[Sigma[0][0]]]
        X = [[Sigma[1][0]]]
        R = [[Sigma[1][1]]]
        K = sub(R, mm(mm(X, inv1(A)), T(X)))
        self.assertEqual(K, [[F(-7)]])
        self.assertEqual(det3(B), H[0][0] * A[0][0] * K[0][0])

    def test_lower_ritz_signs_are_strictly_weaker(self) -> None:
        # [[3,2],[2,0]] has exact eigenvalues -1 and 4.
        q, r, c, u = F(3), F(2), F(0), F(-1)
        self.assertEqual((q - u) * (c - u), r * r)
        self.assertGreater(c - u, 0)
        self.assertGreater(F(0) - u, 0)  # independent odd block Q_-=0
        self.assertLess(c - q, 0)
        self.assertLess(F(0) - q, 0)

    def test_scope_and_required_formulas(self) -> None:
        required = (
            "smallest exact operator",
            "harmonic capture floor",
            "relative positive/negative multiplier angle",
            "T_R=\\|(A-u_RI)^{-1}b\\|",
            "not the pinned von-Mangoldt multiplier",
            "No sector sign",
            "remains `P0_INVALIDATED`",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_displayed_tex_and_ascii(self) -> None:
        self.assertNotIn("\t", self.text)
        self.assertTrue(all(ord(ch) < 128 for ch in self.text))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        for display in displays:
            self.assertNotIn("$", display)
            self.assertEqual(display.count("\\begin"), display.count("\\end"))


if __name__ == "__main__":
    unittest.main()
