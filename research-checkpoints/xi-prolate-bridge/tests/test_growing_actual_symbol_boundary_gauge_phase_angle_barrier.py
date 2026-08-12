from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import re
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_ACTUAL_SYMBOL_BOUNDARY_GAUGE_PHASE_ANGLE_BARRIER.md"

DEPENDENCIES = {
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md": "c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81",
    "notes/GROWING_MULTIPLIER_DEFICIT_GEOMETRY_BOUNDARY_ALIAS_BARRIER.md": "2e5b38892f73848b4d081de5fef45f10819bd4e7f6a8be5a4edb8f85dae11141",
    "notes/GROWING_FIXED_CAPTURE_MULTIPLIER_DANGER_NESTED_FESHBACH_BARRIER.md": "0abc50aabff9e630001e1164eafba8de52ef5804e1c2251e70e1367e5b7c9197",
    "notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md": "3efbbf5cd0888d2a645b11c73b625007bf38bf010881d5e0c9d8ecbc964fb1a6",
    "DIRECT_RH_ATTACK.md": "b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2",
}


def dot(x, A, y):
    return sum(
        (x[i] * A[i][j] * y[j] for i in range(len(x)) for j in range(len(y))),
        F(0),
    )


def add(A, B):
    return [[x + y for x, y in zip(ar, br)] for ar, br in zip(A, B)]


def scale(c, A):
    return [[c * x for x in row] for row in A]


def edge_means(lam: mp.mpf, g: mp.mpf, shift: mp.mpf):
    beta = g + shift
    alpha = mp.acos(-beta / (4 * lam))
    vbar = (beta * alpha + 4 * lam * mp.sin(alpha)) / mp.pi
    return vbar, vbar - beta


class ActualSymbolBoundaryGaugeTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text()

    def test_frozen_hashes(self) -> None:
        for relative, expected in DEPENDENCIES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)
            self.assertIn(expected, self.text)

    def test_boundary_translation_has_null_overlap(self) -> None:
        # I=[-L/2,L/2] and I-L meet only at one null endpoint.
        for length in (F(1), F(2), F(7, 3)):
            left = (-length / 2, length / 2)
            shifted = (left[0] - length, left[1] - length)
            overlap = max(F(0), min(left[1], shifted[1]) - max(left[0], shifted[0]))
            self.assertEqual(overlap, 0)

    def test_edge_means_by_independent_period_quadrature(self) -> None:
        mp.mp.dps = 70
        lam, g, shift = mp.mpf(10), mp.mpf(3), mp.mpf(2)
        beta = g + shift
        vbar, abar = edge_means(lam, g, shift)
        alpha = mp.acos(-beta / (4 * lam))
        # Integrate on the two sign intervals rather than reuse the closed form.
        vquad = mp.quad(lambda z: beta + 4 * lam * mp.cos(z), [-alpha, alpha]) / (2 * mp.pi)
        aquad = mp.quad(
            lambda z: -4 * lam * mp.cos(z) - beta,
            [alpha, 2 * mp.pi - alpha],
        ) / (2 * mp.pi)
        self.assertLess(abs(vbar - vquad), mp.mpf("1e-60"))
        self.assertLess(abs(abar - aquad), mp.mpf("1e-60"))
        self.assertLess(abs((g + abar - vbar) + shift), mp.mpf("1e-60"))

    def test_actual_relative_angle_algebra(self) -> None:
        P = [[F(5), F(1)], [F(1), F(4)]]
        N = [[F(2), F(1, 3)], [F(1, 3), F(1)]]
        B = add(P, scale(F(-1), N))
        rho = F(1, 5)
        Gz = [F(2), F(-1)]
        left = dot(Gz, add(scale(1 - rho, P), scale(-1, N)), Gz)
        right = dot(Gz, add(B, scale(-rho, P)), Gz)
        self.assertEqual(left, right)

    def test_metric_subtraction_stays_in_same_congruence(self) -> None:
        P = [[F(7), F(1)], [F(1), F(5)]]
        N = [[F(2), F(0)], [F(0), F(1)]]
        Delta = [[F(3), F(1)], [F(1), F(2)]]
        rho, theta = F(1, 7), F(2, 5)
        Gz = [F(1), F(3)]
        lhs = dot(
            Gz,
            add(scale(1 - rho, P), scale(-1, add(N, scale(theta, Delta)))),
            Gz,
        )
        rhs = dot(
            Gz,
            add(add(P, scale(-1, N)), add(scale(-theta, Delta), scale(-rho, P))),
            Gz,
        )
        self.assertEqual(lhs, rhs)

    def test_all_three_edge_shift_cases_are_sharp(self) -> None:
        vbar = F(20)
        # Positive shift: signed quotient is negative.
        self.assertEqual(F(-2, 1) / (vbar - 2), F(-1, 9))
        # Zero shift: no strict relative angle.
        self.assertEqual(F(0) / vbar, 0)
        # Negative shift: equality occurs at rho=(-S)/(vbar-S).
        shift = F(-2)
        positive = vbar - shift
        rho = (-shift) / positive
        self.assertEqual(rho, F(1, 11))
        self.assertEqual(vbar, (1 - rho) * positive)
        self.assertEqual(rho * positive, -shift)

    def test_nested_pole_orthogonal_short_survives_capture(self) -> None:
        # Plus edge block with S=1 and unit pole p=e0:
        # B=-I+2|p><p|=diag(1,-1,-1).  Capture W=span(e0).
        B = [[F(1), F(0), F(0)], [F(0), F(-1), F(0)], [F(0), F(0), F(-1)]]
        self.assertGreater(B[0][0], 0)  # licensed captured pivot
        self.assertEqual(B[1][0], 0)
        self.assertEqual(B[2][0], 0)
        # The exact Schur return is zero on U=span(e1,e2).
        self.assertEqual(B[1][1] - B[1][0] * B[0][1] / B[0][0], F(-1))
        self.assertEqual(B[2][2] - B[2][0] * B[0][2] / B[0][0], F(-1))

    def test_negative_lower_shift_only_supplies_its_scalar_reserve(self) -> None:
        mp.mp.dps = 70
        g, shift = mp.mpf(4), mp.mpf(-1)
        for lam in (mp.mpf(100), mp.mpf(1000), mp.mpf(10000)):
            vbar, _ = edge_means(lam, g, shift)
            rho = -shift / (vbar - shift)
            scaled = rho * lam / (-shift)
            self.assertLess(abs(scaled - mp.pi / 4), mp.mpf(1) / mp.sqrt(lam))
            self.assertLess(abs(rho * (vbar - shift) + shift), mp.mpf("1e-60"))

    def test_lowering_without_resplitting_is_exact(self) -> None:
        P_U = [[F(5), F(1)], [F(1), F(4)]]
        N_U = [[F(3), F(0)], [F(0), F(2)]]
        U, S = F(7, 3), F(1, 3)
        d = U - S
        I = [[F(1), F(0)], [F(0), F(1)]]
        B_U = add(P_U, scale(-1, N_U))
        lowered_direct = add(B_U, scale(d, I))
        lowered_split = add(add(P_U, scale(d, I)), scale(-1, N_U))
        self.assertEqual(lowered_direct, lowered_split)

    def test_scope_and_required_formulas(self) -> None:
        required = (
            "full actual symbol",
            "r_\\lambda(t)=m_\\lambda(t)+4\\lambda\\cos(Lt)",
            "rho_*(G;S)",
            "-theta*<Gz,Delta Gz>",
            "largest possible angle",
            "not the actual von-Mangoldt multiplier",
            "one-vector rate",
            "No actual sector sign",
            "remains `P0_INVALIDATED`",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_displayed_tex_ascii_and_whitespace(self) -> None:
        self.assertNotIn("\t", self.text)
        self.assertTrue(all(ord(ch) < 128 for ch in self.text))
        self.assertFalse(any(line.endswith((" ", "\t")) for line in self.text.splitlines()))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        for display in displays:
            self.assertNotIn("$", display)
            self.assertEqual(display.count("{"), display.count("}"))
            self.assertEqual(display.count("\\begin"), display.count("\\end"))


if __name__ == "__main__":
    unittest.main()
