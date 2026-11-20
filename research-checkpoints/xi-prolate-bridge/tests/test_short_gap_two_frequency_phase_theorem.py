#!/usr/bin/env python3
"""Exact regressions for the short-gap two-frequency phase theorem."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SHORT_GAP_TWO_FREQUENCY_PHASE_THEOREM.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/FIRST_LAPLACIAN_MINOR_TURAN_BARRIER.md":
        "ae87b9100f8eea9ec9feddeec7f8343197ba5c14b25b2245afb96a2deec45fb1",
    "notes/FINITE_EDGE_PHASE_SYNCHRONIZATION_CRITERIA.md":
        "00db33f1263cbb7eeb1fed4d500d683920cd2444ccef58112b46ee67414904ff",
    "notes/TWO_FREQUENCY_PHASE_TRANSVERSALITY_THEOREM.md":
        "6a704c20640a9c113836904e91c7fafbe12bee0a03d31f623faad988bd306959",
}

Gaussian = tuple[F, F]
Poly = dict[int, Gaussian]
ZERO: Gaussian = (F(0), F(0))
ONE: Gaussian = (F(1), F(0))


def g_add(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] + right[0], left[1] + right[1]


def g_neg(value: Gaussian) -> Gaussian:
    return -value[0], -value[1]


def g_sub(left: Gaussian, right: Gaussian) -> Gaussian:
    return g_add(left, g_neg(right))


def g_mul(left: Gaussian, right: Gaussian) -> Gaussian:
    return (
        left[0] * right[0] - left[1] * right[1],
        left[0] * right[1] + left[1] * right[0],
    )


def g_scale(scale: F, value: Gaussian) -> Gaussian:
    return scale * value[0], scale * value[1]


def g_conjugate(value: Gaussian) -> Gaussian:
    return value[0], -value[1]


def g_inverse(value: Gaussian) -> Gaussian:
    norm = value[0] ** 2 + value[1] ** 2
    if norm == 0:
        raise ZeroDivisionError
    return value[0] / norm, -value[1] / norm


def g_power(value: Gaussian, exponent: int) -> Gaussian:
    result = ONE
    factor = value
    remaining = exponent
    while remaining:
        if remaining % 2:
            result = g_mul(result, factor)
        factor = g_mul(factor, factor)
        remaining //= 2
    return result


def inverse_square(edge: F, frequency: F) -> Gaussian:
    return g_inverse(g_power((edge, frequency), 2))


def p_add_term(poly: Poly, exponent: int, value: Gaussian) -> None:
    poly[exponent] = g_add(poly.get(exponent, ZERO), value)
    if poly[exponent] == ZERO:
        del poly[exponent]


def p_add(left: Poly, right: Poly) -> Poly:
    result = dict(left)
    for exponent, value in right.items():
        p_add_term(result, exponent, value)
    return result


def p_neg(poly: Poly) -> Poly:
    return {exponent: g_neg(value) for exponent, value in poly.items()}


def p_sub(left: Poly, right: Poly) -> Poly:
    return p_add(left, p_neg(right))


def p_scale(value: Gaussian, poly: Poly) -> Poly:
    if value == ZERO:
        return {}
    return {
        exponent: coefficient
        for exponent, coefficient in (
            (exponent, g_mul(value, coefficient))
            for exponent, coefficient in poly.items()
        )
        if coefficient != ZERO
    }


def p_mul(left: Poly, right: Poly) -> Poly:
    result: Poly = {}
    for left_exponent, left_value in left.items():
        for right_exponent, right_value in right.items():
            p_add_term(
                result,
                left_exponent + right_exponent,
                g_mul(left_value, right_value),
            )
    return result


def lifts(
    p: int,
    q: int,
    edge: F,
    omega: F,
    ratio: F,
) -> tuple[Gaussian, Gaussian, Gaussian, Gaussian, Poly, Poly]:
    a = inverse_square(edge, F(p) * omega)
    c = inverse_square(edge, F(q) * omega)
    A = g_conjugate(a)
    C = g_conjugate(c)
    d = q - p
    ratio_g = (ratio, F(0))
    first: Poly = {
        2 * q: g_mul(ratio_g, c),
        p + q: a,
        d: A,
        0: g_mul(ratio_g, C),
    }
    second: Poly = {
        2 * q: g_mul(ratio_g, g_power(c, 2)),
        p + q: g_power(a, 2),
        d: g_power(A, 2),
        0: g_mul(ratio_g, g_power(C, 2)),
    }
    return a, c, A, C, first, second


def exact_h(
    p: int,
    q: int,
    ratio: F,
    a: Gaussian,
    c: Gaussian,
    A: Gaussian,
    C: Gaussian,
) -> Poly:
    d = q - p
    ratio_g = (ratio, F(0))
    ratio_squared = (ratio ** 2, F(0))
    leading = g_mul(
        ratio_g,
        g_mul(c, g_mul(A, g_sub(c, A))),
    )
    middle = g_add(
        g_mul(a, g_mul(A, g_sub(a, A))),
        g_mul(ratio_squared, g_mul(c, g_mul(C, g_sub(c, C)))),
    )
    constant = g_mul(
        ratio_g,
        g_mul(a, g_mul(C, g_sub(a, C))),
    )
    return {2 * d: leading, d: middle, 0: constant}


class ShortGapTwoFrequencyPhaseTests(unittest.TestCase):
    def test_frozen_dependency_hashes(self) -> None:
        for relative_path, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative_path).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative_path)

    def test_inverse_square_sign_and_cross_conjugate_nonvanishing(self) -> None:
        for p, q, edge, omega in (
            (2, 3, F(1), F(1, 5)),
            (3, 5, F(7, 4), F(2, 9)),
            (4, 7, F(11, 3), F(5, 8)),
            (1, 4, F(9, 2), F(3, 7)),
        ):
            a = inverse_square(edge, F(p) * omega)
            c = inverse_square(edge, F(q) * omega)
            A = g_conjugate(a)
            C = g_conjugate(c)
            self.assertLess(a[1], 0)
            self.assertLess(c[1], 0)
            self.assertNotEqual(c, A)
            self.assertNotEqual(a, C)
            denominator = (edge ** 2 + (F(p) * omega) ** 2) ** 2
            self.assertEqual(a[1], -2 * edge * p * omega / denominator)

            left = g_sub(
                g_power((edge, F(q) * omega), 2),
                g_power((edge, -F(p) * omega), 2),
            )
            right = g_mul(
                (F(0), F(p + q) * omega),
                (2 * edge, F(q - p) * omega),
            )
            self.assertEqual(left, right)
            self.assertNotEqual(right, ZERO)

    def test_lifts_are_exactly_self_inversive(self) -> None:
        for p, q in ((2, 3), (3, 5), (4, 7), (2, 5)):
            *_, first, second = lifts(p, q, F(7, 3), F(5, 11), F(13, 6))
            for poly in (first, second):
                degree = 2 * q
                for exponent in range(degree + 1):
                    self.assertEqual(
                        poly.get(exponent, ZERO),
                        g_conjugate(poly.get(degree - exponent, ZERO)),
                    )
                self.assertEqual(set(poly), {0, q - p, p + q, 2 * q})

    def test_denominator_free_bezout_identity(self) -> None:
        fixtures = (
            (2, 3, F(1), F(1, 3), F(7, 5)),
            (3, 5, F(5, 2), F(4, 9), F(11, 7)),
            (4, 7, F(8, 3), F(2, 5), F(17, 4)),
            (2, 5, F(9, 4), F(5, 12), F(3, 2)),
            (1, 2, F(6, 5), F(7, 13), F(19, 8)),
        )
        for p, q, edge, omega, ratio in fixtures:
            a, c, A, C, first, second = lifts(
                p, q, edge, omega, ratio
            )
            d = q - p
            L = p_sub(p_scale(c, first), second)
            multiplier = {
                d: g_scale(ratio, c),
                0: a,
            }
            computed = p_sub(
                p_mul(multiplier, L),
                p_scale(g_mul(a, g_sub(c, a)), first),
            )
            expected = exact_h(p, q, ratio, a, c, A, C)
            self.assertEqual(computed, expected)
            self.assertEqual(set(computed), {0, d, 2 * d})

    def test_all_three_remainder_coefficients_are_nondegenerate(self) -> None:
        for p, q, ratio in (
            (2, 3, F(1, 9)),
            (2, 3, F(37, 2)),
            (3, 5, F(11, 4)),
            (4, 7, F(5, 6)),
            (1, 4, F(8, 3)),
        ):
            a, c, A, C, _, _ = lifts(
                p, q, F(13, 7), F(3, 10), ratio
            )
            d = q - p
            remainder = exact_h(p, q, ratio, a, c, A, C)
            leading = remainder[2 * d]
            middle = remainder[d]
            constant = remainder[0]
            self.assertNotEqual(leading, ZERO)
            self.assertNotEqual(middle, ZERO)
            self.assertNotEqual(constant, ZERO)
            self.assertEqual(constant, g_neg(g_conjugate(leading)))
            self.assertEqual(middle[0], 0)
            self.assertLess(middle[1], 0)

    def test_short_gap_root_budget_is_strict(self) -> None:
        short_gap_pairs = ((2, 3), (3, 4), (3, 5), (4, 5), (4, 7), (8, 15))
        for p, q in short_gap_pairs:
            sign_boundaries = 2 * p
            common_root_budget = 2 * (q - p)
            self.assertLess(p, q)
            self.assertLess(q, 2 * p)
            self.assertGreater(sign_boundaries, common_root_budget)

        for p, q in ((1, 2), (2, 4), (3, 6)):
            self.assertEqual(2 * p, 2 * (q - p))

    def test_sturm_hurwitz_product_is_periodic_and_low_degree(self) -> None:
        # A half-angle factor has formal half-mode exponents -1 and +1.
        # After 2m factors every exponent is even, so division by two gives
        # integer Fourier modes between -m and m.
        for m in range(1, 9):
            support = {0}
            for _ in range(2 * m):
                support = {
                    exponent + step
                    for exponent in support
                    for step in (-1, 1)
                }
            self.assertTrue(all(exponent % 2 == 0 for exponent in support))
            modes = {exponent // 2 for exponent in support}
            self.assertEqual(min(modes), -m)
            self.assertEqual(max(modes), m)
            self.assertTrue(all(abs(mode) <= m for mode in modes))

    def test_triple_sign_changing_root_fixture_is_counted_distinctly(self) -> None:
        # sin(2t)^3=(3 sin(2t)-sin(6t))/4 has first harmonic 2,
        # four distinct sign boundaries, and multiplicity three at each one.
        sin_two: Poly = {
            2: (F(0), F(-1, 2)),
            -2: (F(0), F(1, 2)),
        }
        cube = p_mul(p_mul(sin_two, sin_two), sin_two)
        expected: Poly = {
            2: (F(0), F(-3, 8)),
            -2: (F(0), F(3, 8)),
            6: (F(0), F(1, 8)),
            -6: (F(0), F(-1, 8)),
        }
        self.assertEqual(cube, expected)
        self.assertEqual(min(abs(exponent) for exponent in cube), 2)
        midpoint_signs = (1, -1, 1, -1)
        cyclic_changes = sum(
            midpoint_signs[index] != midpoint_signs[(index + 1) % 4]
            for index in range(4)
        )
        self.assertEqual(cyclic_changes, 4)
        text = NOTE.read_text(encoding="utf-8")
        self.assertIn("triple or quintuple root", text)
        self.assertIn("at least `2p` **distinct**", text)

    def test_nonprimitive_reduction_and_saturated_boundary(self) -> None:
        edge = F(7, 2)
        omega = F(5, 13)
        for p, q in ((2, 4), (4, 6), (6, 10), (9, 15)):
            divisor = math.gcd(p, q)
            p_zero = p // divisor
            q_zero = q // divisor
            Omega = divisor * omega
            self.assertEqual(
                inverse_square(edge, p * omega),
                inverse_square(edge, p_zero * Omega),
            )
            self.assertEqual(
                inverse_square(edge, q * omega),
                inverse_square(edge, q_zero * Omega),
            )
            self.assertEqual(math.gcd(p_zero, q_zero), 1)

        for p in range(1, 10):
            q = 2 * p
            divisor = math.gcd(p, q)
            self.assertEqual((p // divisor, q // divisor), (1, 2))

    def test_two_three_is_primitive_nonantipodal_and_universal(self) -> None:
        p, q = 2, 3
        relation = (q, -p)
        self.assertEqual(math.gcd(p, q), 1)
        self.assertEqual(sum(relation) % 2, 1)
        self.assertLess(q, 2 * p)
        self.assertGreater(2 * p, 2 * (q - p))

        text = NOTE.read_text(encoding="utf-8")
        for token in (
            "primitive pair `(p,q)=(2,3)`",
            "has no global hull antipode",
            "no `2:3` common-zero candidate ratio is a true synchronization failure",
            "every positive weight ratio",
        ):
            self.assertIn(token, text)

    def test_note_serialization_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Short-gap two-frequency phase synchronization",
            "denominator-free Bezout remainder",
            "at most `2(q-p)` common",
            "distinct-sign version of the\nSturm--Hurwitz argument",
            r"\boxed{q\leq 2p}",
            "the candidate set and the failure set are not the same",
            "Call `t_0` a sign-changing zero",
            "No simplicity assumption",
            r"Q(t)=\prod_{j=1}^{2m}\sin {t-t_j\over2}",
            "number `2m` of factors is even",
            "half-integer exponents add to the\ninteger modes",
            "triple or quintuple root",
            r"F(z)&=z^qP_0(t)",
            r"L(z)=cF(z)-G(z)",
            r"H(z)=(Rc z^d+a)L(z)-a(c-a)F(z)",
            r"H(z)={}&RcA(c-A)z^{2d}",
            "exact Bezout/subresultant certificate",
            "It uses no division by\n`c-a`",
            r"h_0=-\overline{h_{2d}}\neq0",
            r"\deg\gcd(F,G)\leq2(q-p)",
            "The proof covers every positive weight ratio",
            "Primitive reduction and the saturated boundary `q=2p`",
            "primitive `p_0:q_0` circle,\ntraversed `g` times",
            "For a primitive pair, the equality case is already `(1,2)`",
            "the at most\n`2` common roots",
            "For `q>2p`",
            "does not\ncontrol three or more phase-locked frequencies",
            "No such actual-zeta geometry is proved here",
            "P0_INVALIDATED",
            "changes no formal project\nstatus",
            "floating searches are neither used nor cited as evidence",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "every two-frequency pair is solved",
            "the common-zero candidate set is empty",
            "actual zeta edge has ratio",
            "actual-zeta geometry is established unconditionally",
            "RH is proved",
            "RH is false unconditionally",
            "equation (5.2) is proved",
            "floating search proves",
        )
        for token in forbidden:
            self.assertNotIn(token, text)

        self.assertEqual(text.count(r"\["), text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))

    def test_package_contains_only_clean_raw_bytes(self) -> None:
        for path in (NOTE, TEST):
            bad = [
                (offset, byte)
                for offset, byte in enumerate(path.read_bytes())
                if (byte < 32 and byte != 10) or byte == 127
            ]
            self.assertEqual(bad, [], path.name)
            path.read_bytes().decode("utf-8")


if __name__ == "__main__":
    unittest.main()
