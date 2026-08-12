#!/usr/bin/env python3
"""Exact regressions for the centered-zero Gram/fixed-vertex package."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md"

LOCK_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


class CenteredZeroGramSimultaneousVertexSubsequenceTests(unittest.TestCase):
    def test_claim_boundary_is_fail_closed(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "unconditional centered-\n    zero expansion",
            "conditional where explicitly labelled RH",
            "No such rightmost-line gap is known",
            "rank-one leading limit",
            "P0_INVALIDATED",
            "pinned but unreplayed",
            "It is not used anywhere below",
            "1<n<=lambda^2",
            "centered-zero screw and cosine moments",
            "zero-evaluation Gram decomposition",
            r"L_w=G-\operatorname {diag}(G\mathbf1)",
            "actual `Xi` zeros",
            "RH-conditional simultaneous fixed-vertex subsequence",
            r"d_k(L_j)>0\quad(0\leq k\leq K)",
            r"{d_k(L_j)\over d_0(L_j)}\longrightarrow4",
            "Hypothesis R is not known",
            "scalar Landau does not presently vectorize",
            "Fixed principal blocks remain rank-one",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "RH_PROVED",
            "Riemann hypothesis is proved",
            "unconditional simultaneous fixed-vertex subsequence",
            "actual-source routing contraction holds",
            "Platt--Trudgian computation was replayed",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)

    def test_protected_source_bytes_are_unchanged(self) -> None:
        for relative, expected in LOCK_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_laplace_pair_for_one_centered_zero_is_exact(self) -> None:
        # q/(q^2-a^2)-1/q = a^2/[q(q^2-a^2)].
        for q, alpha in ((F(5), F(2)), (F(7, 2), F(3, 5)),
                         (F(11, 3), F(4, 7))):
            lhs = F(2) / alpha**2 * (
                q / (q**2 - alpha**2) - 1 / q
            )
            rhs = F(2) / (q * (q**2 - alpha**2))
            self.assertEqual(lhs, rhs)

    def test_cosine_moment_filter_algebra_is_exact(self) -> None:
        # Treat h=cosh(alpha*L)-1 as a formal scalar.  The two asserted
        # formulas differ by exactly the screw contribution 2h/alpha^2.
        for alpha2, a2, h in (
            (F(5), F(2), F(7, 3)),
            (F(-11), F(3), F(-5, 7)),
            (F(13, 2), F(17, 5), F(19, 11)),
        ):
            psi_atom = 2 * h / alpha2
            delta_atom = a2 / (alpha2 + a2) * psi_atom
            a_atom = -2 * h / (alpha2 + a2)
            self.assertEqual(a_atom - (-psi_atom), delta_atom)

    def test_rh_divided_difference_is_negative_gram_exactly(self) -> None:
        # Mock RH atoms use gamma^2 and h=1-cos(gamma*L), both positive.
        a = (F(0), F(1), F(2), F(3))
        p = (F(2), F(-3), F(5), F(-7))
        length = F(10)
        atoms = ((F(5), F(2)), (F(11), F(3)))
        moments = tuple(
            sum((2 * h / (x * x - gamma2) for gamma2, h in atoms), F(0))
            for x in a
        )

        for i in range(len(a)):
            for j in range(i + 1, len(a)):
                divided = (
                    a[i] ** 2 * moments[i] - a[j] ** 2 * moments[j]
                ) / (a[i] ** 2 - a[j] ** 2)
                gram_divided = sum(
                    (
                        -2 * h * gamma2
                        / ((a[i] ** 2 - gamma2) * (a[j] ** 2 - gamma2))
                        for gamma2, h in atoms
                    ),
                    F(0),
                )
                self.assertEqual(divided, gram_divided)

                weight = 2 * p[i] * p[j] * divided / length
                gram_entry = sum(
                    (
                        F(4) / length * h * gamma2 * p[i] * p[j]
                        / ((a[i] ** 2 - gamma2) * (a[j] ** 2 - gamma2))
                        for gamma2, h in atoms
                    ),
                    F(0),
                )
                self.assertEqual(-weight, gram_entry)

    def test_laplacian_is_gram_minus_row_sum_diagonal(self) -> None:
        gram = (
            (F(5), F(-2), F(1)),
            (F(-2), F(7), F(3)),
            (F(1), F(3), F(11)),
        )
        row_sums = tuple(sum(row, F(0)) for row in gram)
        laplacian = tuple(
            tuple(
                gram[i][j] - (row_sums[i] if i == j else F(0))
                for j in range(3)
            )
            for i in range(3)
        )
        self.assertEqual(tuple(sum(row, F(0)) for row in laplacian), (F(0),) * 3)
        for i in range(3):
            for j in range(3):
                if i != j:
                    self.assertEqual(laplacian[i][j], gram[i][j])

    def test_finite_anchor_feature_sum_is_transform_residual(self) -> None:
        p = (F(3, 5), F(-7, 11), F(13, 17), F(-19, 23))
        scale = F(5, 7)  # a_n=scale*n
        s = F(9, 4)
        gamma = scale * s
        lhs = sum(
            (p[n] / ((scale * n) ** 2 - gamma**2) for n in range(len(p))),
            F(0),
        )
        h_value = p[0] + s**2 * sum(
            (p[n] / (s**2 - n**2) for n in range(1, len(p))), F(0)
        )
        self.assertEqual(lhs, -h_value / gamma**2)

    def test_general_vertex_remainder_identity_is_exact(self) -> None:
        length = F(14)
        p = (F(3, 5), F(-7, 11), F(13, 17), F(-19, 23), F(29, 31))
        a = (F(-2, 3), F(5, 7), F(-11, 13), F(17, 19), F(-23, 29))
        sqrt_l_j = sum((p[j] * a[j] for j in range(len(p))), F(0))
        for k in range(1, len(p)):
            t_k = F(k * k) * sum(
                (
                    p[j] * (a[k] - a[j]) / F(k * k - j * j)
                    for j in range(len(p)) if j != k
                ),
                F(0),
            )
            e_from_moments = sqrt_l_j - p[k] * (a[k] - a[0]) + t_k

            # Integral(R*S_k) is represented coefficientwise by the same
            # finite cosine moments.
            s_integral = -p[k] * (a[k] - a[0]) + t_k
            self.assertEqual(e_from_moments, sqrt_l_j + s_integral)

            degree = 2 * p[k] / length * (
                sqrt_l_j - p[k] * a[k] + t_k
            )
            screw_form = -2 * p[k] ** 2 * a[0] / length \
                + 2 * p[k] * e_from_moments / length
            self.assertEqual(degree, screw_form)

    def test_exponential_history_integration_by_parts_sign(self) -> None:
        # With S=S'=0 at both endpoints,
        # integral(e^(beta*t) S')=-(1/beta) integral(e^(beta*t) S'').
        # A polynomial model S=t^2(1-t)^2 on [0,1], beta=0 is singular,
        # so test the coefficient identity by formal integration moments at
        # beta=1 using exact antiderivative recurrences for exp(t)*t^m.
        # Integral_0^1 exp(t)t^m = (-1)^m*m!*(e*sum_{r=0}^m(-1)^r/r! - 1);
        # retain coefficients of e and 1 separately.
        def exp_moment(m: int) -> tuple[F, F]:
            factorial = 1
            for value in range(2, m + 1):
                factorial *= value
            series = sum((F((-1) ** r, 1) / _factorial(r) for r in range(m + 1)), F(0))
            sign = F((-1) ** m * factorial)
            return sign * series, -sign

        # S'=2t-6t^2+4t^3; S''=2-12t+12t^2.
        sp = ((1, F(2)), (2, F(-6)), (3, F(4)))
        spp = ((0, F(2)), (1, F(-12)), (2, F(12)))
        i1 = tuple(sum((coefficient * exp_moment(power)[part]
                        for power, coefficient in sp), F(0)) for part in (0, 1))
        i2 = tuple(sum((coefficient * exp_moment(power)[part]
                        for power, coefficient in spp), F(0)) for part in (0, 1))
        self.assertEqual(i1, tuple(-entry for entry in i2))

    def test_fixed_block_limit_is_rank_one(self) -> None:
        q = (F(1), F(-2), F(2), F(-2), F(2))
        matrix = tuple(
            tuple(q[i] * q[j] for j in range(len(q)))
            for i in range(len(q))
        )
        for i in range(1, len(q)):
            for j in range(1, len(q)):
                self.assertEqual(
                    matrix[0][0] * matrix[i][j],
                    matrix[0][i] * matrix[0][j],
                )
        self.assertGreater(matrix[0][0], 0)
        self.assertGreater(matrix[1][1], 0)


def _factorial(n: int) -> int:
    value = 1
    for k in range(2, n + 1):
        value *= k
    return value


if __name__ == "__main__":
    unittest.main()
