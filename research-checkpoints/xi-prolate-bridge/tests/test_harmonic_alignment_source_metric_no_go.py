#!/usr/bin/env python3
"""Pure exact regressions for the harmonic source-metric no-go theorem."""

from __future__ import annotations

from fractions import Fraction as F
from itertools import combinations
from pathlib import Path
import unittest


Matrix = list[list[F]]
Vector = list[F]
ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "HARMONIC_ALIGNMENT_SOURCE_METRIC_NO_GO.md"


def eye(n: int) -> Matrix:
    return [[F(i == j) for j in range(n)] for i in range(n)]


def transpose(a: Matrix) -> Matrix:
    return [list(row) for row in zip(*a)]


def matmul(a: Matrix, b: Matrix) -> Matrix:
    return [
        [sum((a[i][k] * b[k][j] for k in range(len(b))), F(0))
         for j in range(len(b[0]))]
        for i in range(len(a))
    ]


def matvec(a: Matrix, x: Vector) -> Vector:
    return [sum((aij * xj for aij, xj in zip(row, x)), F(0)) for row in a]


def add(a: Matrix, b: Matrix) -> Matrix:
    return [[x + y for x, y in zip(rx, ry)] for rx, ry in zip(a, b)]


def sub(a: Matrix, b: Matrix) -> Matrix:
    return [[x - y for x, y in zip(rx, ry)] for rx, ry in zip(a, b)]


def scale(c: F, a: Matrix) -> Matrix:
    return [[c * x for x in row] for row in a]


def outer(x: Vector, y: Vector) -> Matrix:
    return [[xi * yj for yj in y] for xi in x]


def dot(x: Vector, y: Vector) -> F:
    return sum((xi * yi for xi, yi in zip(x, y)), F(0))


def determinant(a: Matrix) -> F:
    n = len(a)
    if n == 0:
        return F(1)
    work = [row[:] for row in a]
    result = F(1)
    for col in range(n):
        pivot = next((row for row in range(col, n) if work[row][col]), None)
        if pivot is None:
            return F(0)
        if pivot != col:
            work[col], work[pivot] = work[pivot], work[col]
            result = -result
        value = work[col][col]
        result *= value
        for row in range(col + 1, n):
            factor = work[row][col] / value
            for j in range(col + 1, n):
                work[row][j] -= factor * work[col][j]
    return result


def inverse(a: Matrix) -> Matrix:
    n = len(a)
    work = [a[i][:] + eye(n)[i] for i in range(n)]
    for col in range(n):
        pivot = next((row for row in range(col, n) if work[row][col]), None)
        if pivot is None:
            raise ValueError("singular exact matrix")
        if pivot != col:
            work[col], work[pivot] = work[pivot], work[col]
        value = work[col][col]
        work[col] = [x / value for x in work[col]]
        for row in range(n):
            if row == col:
                continue
            factor = work[row][col]
            work[row] = [x - factor * y for x, y in zip(work[row], work[col])]
    return [row[n:] for row in work]


def minor(a: Matrix, row: int, col: int) -> Matrix:
    return [
        [a[i][j] for j in range(len(a)) if j != col]
        for i in range(len(a)) if i != row
    ]


def adjugate(a: Matrix) -> Matrix:
    n = len(a)
    cofactors = [
        [((-1) ** (i + j)) * determinant(minor(a, i, j)) for j in range(n)]
        for i in range(n)
    ]
    return transpose(cofactors)


def principal(a: Matrix, indices: tuple[int, ...]) -> Matrix:
    return [[a[i][j] for j in indices] for i in indices]


def is_psd(a: Matrix) -> bool:
    if a != transpose(a):
        return False
    n = len(a)
    return all(
        determinant(principal(a, indices)) >= 0
        for size in range(1, n + 1)
        for indices in combinations(range(n), size)
    )


def block(a: Matrix, b: Matrix, c: Matrix, d: Matrix) -> Matrix:
    return [ra + rb for ra, rb in zip(a, b)] + [rc + rd for rc, rd in zip(c, d)]


def diag(*values: F) -> Matrix:
    return [[value if i == j else F(0) for j, _ in enumerate(values)]
            for i, value in enumerate(values)]


class HarmonicAlignmentSourceMetricNoGoTests(unittest.TestCase):
    def test_lossless_harmonic_graph_identities(self) -> None:
        s = [[F(2), F(1)], [F(1), F(3)]]
        d = diag(F(2), F(3))
        c = [[F(1), F(1)], [F(0), F(1)]]
        d_inv = inverse(d)
        a = add(s, matmul(matmul(transpose(c), d_inv), c))
        b_op = block(a, transpose(c), c, d)

        graph = eye(2) + scale(F(-1), matmul(d_inv, c))
        inclusion_s = s + [[F(0), F(0)], [F(0), F(0)]]
        self.assertEqual(matmul(b_op, graph), inclusion_s)
        self.assertEqual(
            matmul(matmul(transpose(graph), matmul(b_op, b_op)), graph),
            matmul(s, s),
        )

        b_high = [F(2), F(-3)]
        f = [F(1), F(4)]
        correction = matvec(matmul(transpose(c), d_inv), b_high)
        b_low = [fi + ci for fi, ci in zip(f, correction)]
        b = b_low + b_high
        self.assertEqual(matvec(transpose(graph), b), f)

        solve = matvec(inverse(b_op), b)
        low_solve = solve[:2]
        self.assertEqual(low_solve, matvec(inverse(s), f))
        alignment = dot(low_solve, low_solve)
        self.assertEqual(alignment, dot(f, matvec(inverse(matmul(s, s)), f)))

    def test_rank_one_block_adjugate_and_strict_failure(self) -> None:
        s = [[F(2), F(1)], [F(1), F(3)]]
        f = [F(1), F(4)]
        s2 = matmul(s, s)
        alignment = dot(f, matvec(inverse(s2), f))

        rank_one_difference = sub(scale(alignment, s2), outer(f, f))
        self.assertTrue(is_psd(rank_one_difference))

        bordered = block(s2, [[f[0]], [f[1]]], [[f[0], f[1]]], [[alignment]])
        self.assertTrue(is_psd(bordered))
        self.assertEqual(determinant(bordered), 0)

        adj_f = matvec(adjugate(s), f)
        adjugate_scalar = alignment * determinant(s) ** 2 - dot(adj_f, adj_f)
        self.assertEqual(adjugate_scalar, 0)

        below = alignment - F(1, 100)
        failed = block(s2, [[f[0]], [f[1]]], [[f[0], f[1]]], [[below]])
        self.assertLess(determinant(failed), 0)
        self.assertFalse(is_psd(failed))

    def test_source_whitening_is_exact_congruence(self) -> None:
        s = [[F(2), F(1)], [F(1), F(3)]]
        f = [F(1), F(4)]
        r0_inverse_half = diag(F(1, 2), F(1, 3))
        h = matmul(matmul(r0_inverse_half, matmul(s, s)), r0_inverse_half)
        g = matvec(r0_inverse_half, f)

        exact = dot(f, matvec(inverse(matmul(s, s)), f))
        whitened = dot(g, matvec(inverse(h), g))
        self.assertEqual(whitened, exact)

        c = exact
        original = block(matmul(s, s), [[f[0]], [f[1]]], [[f[0], f[1]]], [[c]])
        whitened_block = block(h, [[g[0]], [g[1]]], [[g[0], g[1]]], [[c]])
        congruence = diag(F(1, 2), F(1, 3), F(1))
        self.assertEqual(
            matmul(matmul(congruence, original), congruence),
            whitened_block,
        )
        self.assertTrue(is_psd(original))
        self.assertTrue(is_psd(whitened_block))

    def test_generalized_spectral_weights_and_clusters(self) -> None:
        r0 = diag(F(4), F(9), F(16))
        r0_inverse_half = diag(F(1, 2), F(1, 3), F(1, 4))
        s = diag(F(1), F(6), F(12))
        f = [F(2), F(3), F(8)]
        h = matmul(matmul(r0_inverse_half, matmul(s, s)), r0_inverse_half)
        self.assertEqual(h, diag(F(1, 4), F(4), F(9)))

        g = matvec(r0_inverse_half, f)
        self.assertEqual(g, [F(1), F(1), F(2)])
        spectral = F(1) / F(1, 4) + F(1) / F(4) + F(4) / F(9)
        direct = dot(f, matvec(inverse(matmul(s, s)), f))
        self.assertEqual(spectral, direct)

        beta = dot(g, g)
        alpha = F(1, 4)
        self.assertEqual(beta / alpha, F(24))
        self.assertLess(direct, beta / alpha)

        # Cluster {1/4,4} and singleton {9}.
        lower = F(2) / F(4) + F(4) / F(9)
        upper = F(2) / F(1, 4) + F(4) / F(9)
        self.assertLessEqual(lower, direct)
        self.assertLessEqual(direct, upper)

        # R0 is used: the generalized eigenvectors are R0-orthonormal.
        generalized = [
            [F(1, 2), F(0), F(0)],
            [F(0), F(1, 3), F(0)],
            [F(0), F(0), F(1, 4)],
        ]
        self.assertEqual(
            matmul(matmul(transpose(generalized), r0), generalized),
            eye(3),
        )
        weights = [dot([generalized[i][j] for i in range(3)], f) ** 2
                   for j in range(3)]
        self.assertEqual(weights, [F(1), F(1), F(4)])

    def test_rational_scalar_loss_and_ambient_cofactor(self) -> None:
        for n in (2, 3, 7, 101):
            n_f = F(n)
            s = diag(F(1, n), F(1))
            f = [F(1, n), F(1)]
            q = [
                [F(1) + F(1, n), F(1, n), F(1)],
                [F(1, n), F(1, n), F(0)],
                [F(1), F(0), F(1)],
            ]
            self.assertTrue(is_psd(q))
            self.assertEqual(determinant(q), 0)
            self.assertEqual(matvec(q, [F(1), F(-1), F(-1)]), [F(0)] * 3)
            self.assertEqual([row[1:] for row in q[1:]], s)
            self.assertEqual([q[1][0], q[2][0]], f)

            alignment = dot(f, matvec(inverse(matmul(s, s)), f))
            beta = dot(f, f)
            alpha = F(1, n * n)
            self.assertEqual(alignment, F(2))
            self.assertEqual(beta / alpha, n_f * n_f + 1)

            cof = adjugate(q)
            c_kappa = cof[0][0]
            low_trace = cof[1][1] + cof[2][2]
            self.assertGreater(c_kappa, 0)
            self.assertEqual(low_trace / c_kappa, alignment)
            lam = F(5)
            constant_squared = F(10)
            self.assertEqual(lam * low_trace, constant_squared * c_kappa)

    def test_diagonal_source_cauchy_obstruction_is_exactly_sixteen_ninths(self) -> None:
        for n in (2, 4, 9):
            u0 = F(-2)
            epsilon = F(1, 7)
            gap = F(5)
            q_plus = diag(u0, u0 + epsilon, *([u0 + gap] * (n - 1)))
            q_minus = diag(u0 + epsilon, *([u0 + gap] * (n - 1)))
            kappa = [F(3, 5), F(4, 5)] + [F(0)] * (n - 1)
            w = [F(-4, 5), F(3, 5)] + [F(0)] * (n - 1)
            self.assertEqual(dot(kappa, kappa), 1)
            self.assertEqual(dot(w, w), 1)
            self.assertEqual(dot(kappa, w), 0)

            q_value = dot(kappa, matvec(q_plus, kappa))
            residual = [x - q_value * y
                        for x, y in zip(matvec(q_plus, kappa), kappa)]
            r = F(12, 25) * epsilon
            self.assertEqual(residual, [r * wi for wi in w])
            self.assertEqual(q_value - u0, F(16, 25) * epsilon)
            self.assertEqual((q_value - u0) / r, F(4, 3))

            shifted_w = dot(w, [x - u0 * y
                                for x, y in zip(matvec(q_plus, w), w)])
            self.assertEqual(shifted_w, F(9, 25) * epsilon)
            self.assertGreater(shifted_w, 0)
            self.assertTrue(all(q_minus[i][i] - u0 > 0 for i in range(n)))

            schur = shifted_w
            forcing = dot(w, residual)
            alignment = forcing * forcing / (schur * schur)
            self.assertEqual(alignment, F(16, 9))

            # The source-Cauchy off-diagonal formula is zero for b_n^C=0.
            raw_modes = list(range(-n, n + 1))
            cauchy_b = {mode: F(0) for mode in raw_modes}
            for i, mode_i in enumerate(raw_modes):
                for mode_j in raw_modes[i + 1:]:
                    self.assertEqual(
                        (cauchy_b[mode_i] - cauchy_b[mode_j]) / (mode_i - mode_j),
                        0,
                    )

            for z in (F(-3), F(0), F(2, 3)):
                odd_det = (u0 + epsilon - z) * (u0 + gap - z) ** (n - 1)
                even_central_cofactor = determinant(
                    [[q_plus[i][j] - (z if i == j else 0)
                      for j in range(1, n + 1)]
                     for i in range(1, n + 1)]
                )
                self.assertEqual(odd_det, even_central_cofactor)

    def test_note_locks_complete_source_conventions_and_claim_boundary(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "[-\\lambda,\\lambda]",
            "zero-Lebesgue-integral",
            "e^{-itx}",
            "m_\\lambda(t)=2\\theta'(t)-2S_\\lambda(t)",
            "1<n\\leq\\lambda^2",
            "P_XS_+A_\\lambda",
            "1\\leq m\\leq\\lfloor\\lambda^2\\rfloor",
            "G_\\lambda(t)=e^t-\\psi_C(e^t)",
            "q_{U\\ell}",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, text)
        self.assertNotIn("RH_PROVED", text)
        self.assertNotIn("CERTIFIED", text)


if __name__ == "__main__":
    unittest.main()
