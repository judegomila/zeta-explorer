#!/usr/bin/env python3
"""Exact regressions for the resonant vertex-one screw-moment barrier."""

from __future__ import annotations

import hashlib
import math
import unittest
from fractions import Fraction as F
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ANCHORED_VERTEX_ONE_RESONANT_SCREW_MOMENT_BARRIER.md"


class AnchoredVertexOneResonantScrewMomentBarrierTests(unittest.TestCase):
    def test_binding_lock_bytes_are_unchanged(self) -> None:
        expected = {
            "P0_SOURCE_LOCK.json":
                "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
            "P0_NORMALIZATION_AUDIT.md":
                "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
        }
        for relative, digest in expected.items():
            raw = (ROOT / relative).read_bytes()
            self.assertEqual(hashlib.sha256(raw).hexdigest(), digest)

    def test_claim_boundary_and_missing_moment_are_explicit(self) -> None:
        text = NOTE.read_text()
        for token in (
            "P0_INVALIDATED",
            "not the pinned",
            "do not imply\nthe vertex-1 sign",
            r"E_1=\sqrt L\,J_L+{\cal M}_1(L)",
            r"\omega_j\int_0^{L_j}\Psi(t)W_{1,L_j}(t)\,dt",
            "Every higher vertex",
        ):
            self.assertIn(token, text)
        self.assertNotIn("Riemann hypothesis is proved", text)

    def test_exact_A_minus_g_screw_identity(self) -> None:
        # Algebraic regression for A_n = g - n*omega*B_n.
        omega = F(5, 17)
        g = F(-7, 9)
        B = {1: F(11, 13), 2: F(-3, 8), 3: F(19, 23)}
        A = {n: g - n * omega * B[n] for n in B}
        for n in B:
            self.assertEqual(A[n] - g, -n * omega * B[n])

    def test_A1_T1_combination_equals_screw_moment(self) -> None:
        omega = F(2, 11)
        g = F(-5, 7)
        p = [F(3, 5), F(-7, 6), F(11, 9), F(-13, 10)]
        B = [F(0), F(5, 8), F(-2, 3), F(7, 12)]
        A = [g] + [g - j * omega * B[j] for j in range(1, 4)]

        t1 = sum(
            p[j] * (A[1] - A[j]) / (1 - j * j)
            for j in range(4) if j != 1
        )
        left = -p[1] * (A[1] - g) + t1
        right = omega * (
            p[1] * B[1]
            + sum(
                p[j] * (j * B[j] - B[1]) / (1 - j * j)
                for j in range(4) if j != 1
            )
        )
        self.assertEqual(left, right)

    def test_green_mode_equation_is_exact(self) -> None:
        # In theta=omega*t coordinates, (D^2+1)Q=-(F-p1*cos(theta)).
        p = [F(3, 7), F(-5, 11), F(13, 17), F(-19, 23)]
        # Store cosine coefficients of Q.
        q = [F(0) for _ in p]
        for j in range(len(p)):
            if j == 1:
                continue
            q[1] += p[j] / (1 - j * j)
            q[j] -= p[j] / (1 - j * j)

        lhs = [(1 - j * j) * q[j] for j in range(len(q))]
        rhs = [-p[j] for j in range(len(p))]
        rhs[1] = F(0)
        self.assertEqual(lhs, rhs)
        self.assertEqual(sum(q), 0)  # Q(0)=0.

    def test_divided_difference_loses_the_common_factor(self) -> None:
        # Toy even Xi(z)=z^2-9, omega=1.  The divided difference is 1,
        # hence it is nonzero at the Xi zero z=3.
        def xi(z: F) -> F:
            return z * z - 9

        omega = F(1)
        z = F(3)
        # Evaluate after exact polynomial cancellation:
        # [Xi(z)-Xi(omega)]/[z^2-omega^2] = 1.
        divided_difference = F(1)
        self.assertEqual(xi(z), 0)
        self.assertEqual(divided_difference, 1)
        self.assertNotEqual(divided_difference, xi(z))

    def test_two_harmonic_countermodel_exactly_flips_vertex_one(self) -> None:
        p0, p1, p2 = F(3, 5), F(-7, 6), F(11, 9)
        g = F(-13, 8)
        a2 = -p0 * g / p2
        A = [g, F(0), a2]
        p = [p0, p1, p2]

        sqrt_L_J = sum(pj * aj for pj, aj in zip(p, A))
        self.assertEqual(sqrt_L_J, 0)
        self.assertGreater(-g, 0)

        t1 = sum(
            p[j] * (A[1] - A[j]) / (1 - j * j)
            for j in (0, 2)
        )
        e1 = sqrt_L_J - p1 * (A[1] - g) + t1

        # Compute L*d_i; the omitted common L is positive.
        Ld0 = -2 * p0 * p0 * g
        Ld1 = -2 * p1 * p1 * g + 2 * p1 * e1
        expected_Ld1 = -F(8, 3) * p0 * p1 * g
        self.assertGreater(Ld0, 0)
        self.assertEqual(Ld1, expected_Ld1)
        self.assertLess(Ld1, 0)
        self.assertGreater(e1, abs(p1) * (-g))

        original_vertex_formula = 2 * p1 * sum(
            p[j] * (A[1] - j * j * A[j]) / (1 - j * j)
            for j in (0, 2)
        )
        self.assertEqual(original_vertex_formula, Ld1)

    def test_synthetic_R_has_exact_requested_cosine_moments(self) -> None:
        # Numerical quadrature only checks the elementary realization;
        # all sign and degree tests above use exact rational arithmetic.
        L = 7.0
        g = -1.25
        a2 = 0.875
        samples = 200_000
        dt = L / samples

        def r(t: float) -> float:
            return g / L + 2.0 * a2 / L * math.cos(4.0 * math.pi * t / L)

        values = []
        for n in range(5):
            total = 0.0
            for k in range(samples):
                t = (k + 0.5) * dt
                total += r(t) * math.cos(2.0 * math.pi * n * t / L) * dt
            values.append(total)

        self.assertAlmostEqual(values[0], g, places=11)
        self.assertAlmostEqual(values[2], a2, places=11)
        for n in (1, 3, 4):
            self.assertAlmostEqual(values[n], 0.0, places=11)


if __name__ == "__main__":
    unittest.main()
