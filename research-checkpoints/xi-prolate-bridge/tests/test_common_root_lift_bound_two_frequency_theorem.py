#!/usr/bin/env python3
"""Exact regressions for the common-root lift bound theorem."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "COMMON_ROOT_LIFT_BOUND_TWO_FREQUENCY_THEOREM.md"
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
    "notes/FINITE_ATTAINED_EDGE_ANTIPODAL_TURAN_OBSTRUCTION.md":
        "a8a51e9b7d115eed1e48a358fba0dab0556782a09e851d149c952fdd091bc5fc",
    "notes/FINITE_EDGE_PHASE_SYNCHRONIZATION_CRITERIA.md":
        "00db33f1263cbb7eeb1fed4d500d683920cd2444ccef58112b46ee67414904ff",
    "notes/TWO_FREQUENCY_PHASE_TRANSVERSALITY_THEOREM.md":
        "6a704c20640a9c113836904e91c7fafbe12bee0a03d31f623faad988bd306959",
    "notes/SHORT_GAP_TWO_FREQUENCY_PHASE_THEOREM.md":
        "60e1f3fed5218b37a03532cf48db3c26049269a7559bcbede2bf6690e43c3fc7",
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


def g_norm_squared(value: Gaussian) -> F:
    return value[0] ** 2 + value[1] ** 2


def g_inverse(value: Gaussian) -> Gaussian:
    norm = g_norm_squared(value)
    if norm == 0:
        raise ZeroDivisionError
    return value[0] / norm, -value[1] / norm


def g_div(left: Gaussian, right: Gaussian) -> Gaussian:
    return g_mul(left, g_inverse(right))


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
    for exponent, coefficient in right.items():
        p_add_term(result, exponent, coefficient)
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
    return {
        2 * d: g_mul(ratio_g, g_mul(c, g_mul(A, g_sub(c, A)))),
        d: g_add(
            g_mul(a, g_mul(A, g_sub(a, A))),
            g_mul(
                (ratio ** 2, F(0)),
                g_mul(c, g_mul(C, g_sub(c, C))),
            ),
        ),
        0: g_mul(ratio_g, g_mul(a, g_mul(C, g_sub(a, C)))),
    }


def evaluate_signal(
    p: int,
    q: int,
    ratio: F,
    a: Gaussian,
    c: Gaussian,
    z: Gaussian,
    power: int,
) -> Gaussian:
    A = g_conjugate(a)
    C = g_conjugate(c)
    zp = g_power(z, p)
    zq = g_power(z, q)
    return g_add(
        g_add(g_mul(g_power(a, power), zp),
              g_mul(g_power(A, power), g_conjugate(zp))),
        g_scale(
            ratio,
            g_add(g_mul(g_power(c, power), zq),
                  g_mul(g_power(C, power), g_conjugate(zq))),
        ),
    )


class CommonRootLiftBoundTests(unittest.TestCase):
    def test_frozen_dependency_hashes(self) -> None:
        for relative_path, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative_path).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative_path)

    def test_denominator_free_quadratic_remainder_is_exact(self) -> None:
        fixtures = (
            (1, 4, F(1), F(1, 3), F(7, 5)),
            (1, 6, F(5, 4), F(2, 9), F(11, 7)),
            (2, 5, F(7, 3), F(5, 11), F(13, 6)),
            (2, 7, F(9, 4), F(3, 10), F(17, 8)),
            (3, 7, F(11, 5), F(4, 13), F(19, 9)),
        )
        for p, q, edge, omega, ratio in fixtures:
            a, c, A, C, first, second = lifts(
                p, q, edge, omega, ratio
            )
            d = q - p
            L = p_sub(p_scale(c, first), second)
            multiplier = {d: g_scale(ratio, c), 0: a}
            computed = p_sub(
                p_mul(multiplier, L),
                p_scale(g_mul(a, g_sub(c, a)), first),
            )
            expected = exact_h(p, q, ratio, a, c, A, C)
            self.assertEqual(computed, expected)
            self.assertEqual(set(computed), {0, d, 2 * d})
            self.assertNotEqual(expected[0], ZERO)
            self.assertNotEqual(expected[2 * d], ZERO)

    def test_exact_regrouping_uses_z_to_the_two_p(self) -> None:
        for p, q in ((1, 4), (1, 6), (2, 5), (2, 7), (3, 7)):
            ratio = F(13, 7)
            a, c, A, C, first, second = lifts(
                p, q, F(8, 3), F(5, 12), ratio
            )
            d = q - p
            ratio_g = (ratio, F(0))
            regrouped_first: Poly = {
                2 * p + 2 * d: g_mul(ratio_g, c),
                2 * p + d: a,
                d: A,
                0: g_mul(ratio_g, C),
            }
            regrouped_second: Poly = {
                2 * p + 2 * d: g_mul(ratio_g, g_power(c, 2)),
                2 * p + d: g_power(a, 2),
                d: g_power(A, 2),
                0: g_mul(ratio_g, g_power(C, 2)),
            }
            self.assertEqual(first, regrouped_first)
            self.assertEqual(second, regrouped_second)
            self.assertEqual(2 * p + 2 * d, 2 * q)
            self.assertEqual(2 * p + d, p + q)

    def test_degenerate_u_t_branch_is_retained_and_v_fixes_lift(self) -> None:
        for p, q, edge, omega in (
            (1, 4, F(1), F(3, 10)),
            (1, 6, F(7, 5), F(2, 9)),
            (2, 5, F(9, 4), F(5, 12)),
            (2, 7, F(13, 6), F(4, 11)),
        ):
            a = inverse_square(edge, p * omega)
            c = inverse_square(edge, q * omega)
            A = g_conjugate(a)
            C = g_conjugate(c)
            modulus_a = F(1) / (edge ** 2 + (p * omega) ** 2)
            modulus_c = F(1) / (edge ** 2 + (q * omega) ** 2)
            ratio = modulus_a / modulus_c
            ratio_g = (ratio, F(0))
            y = g_neg(g_div(a, g_mul(ratio_g, c)))
            self.assertEqual(g_norm_squared(y), 1)

            U = g_add(
                g_mul(ratio_g, g_mul(c, g_power(y, 2))),
                g_mul(a, y),
            )
            T = g_add(g_mul(A, y), g_mul(ratio_g, C))
            self.assertEqual(U, ZERO)
            self.assertEqual(T, ZERO)

            U_two = g_add(
                g_mul(ratio_g, g_mul(g_power(c, 2), g_power(y, 2))),
                g_mul(g_power(a, 2), y),
            )
            T_two = g_add(
                g_mul(g_power(A, 2), y),
                g_mul(ratio_g, g_power(C, 2)),
            )
            expected_u_two = g_mul(a, g_mul(y, g_sub(a, c)))
            self.assertEqual(U_two, expected_u_two)
            self.assertNotEqual(U_two, ZERO)
            fixed_lift = g_neg(g_div(T_two, U_two))
            # The discarded modulus argument would be false: this branch
            # can give a unit target.  The valid proof uses lift counting.
            self.assertEqual(g_norm_squared(fixed_lift), 1)

    def test_simultaneous_power_lift_count_is_exact(self) -> None:
        for p, q in ((1, 4), (1, 6), (2, 5), (2, 7), (3, 7)):
            d = q - p
            common = math.gcd(d, 2 * p)
            period = math.lcm(d, 2 * p) * 5
            seed = 7 % period
            y_exponent = d * seed % period
            w_exponent = 2 * p * seed % period
            solutions = [
                exponent
                for exponent in range(period)
                if d * exponent % period == y_exponent
                and 2 * p * exponent % period == w_exponent
            ]
            self.assertEqual(len(solutions), common)
            for left in solutions:
                for right in solutions:
                    delta = (left - right) % period
                    self.assertEqual(d * delta % period, 0)
                    self.assertEqual(2 * p * delta % period, 0)

    def test_requested_pair_classification_and_root_budget(self) -> None:
        requested = ((1, 4), (1, 5), (1, 6), (2, 5), (2, 7), (3, 7))
        for p, q in requested:
            self.assertEqual(math.gcd(p, q), 1)
            d = q - p
            bound = 2 * math.gcd(d, 2 * p)
            if (p - q) % 2:
                self.assertEqual(d % 2, 1)
                self.assertEqual(bound, 2)
                if p >= 2:
                    self.assertGreater(2 * p, bound)
            else:
                self.assertEqual(p % 2, 1)
                self.assertEqual(q % 2, 1)

        self.assertEqual(
            {
                pair for pair in requested
                if pair[0] == 1 and pair[1] % 2 == 0
            },
            {(1, 4), (1, 6)},
        )

    def test_same_parity_antipode_flips_signals_and_preserves_covariance(self) -> None:
        z = (F(3, 5), F(4, 5))
        minus_z = g_neg(z)
        self.assertEqual(g_norm_squared(z), 1)
        for p, q in ((1, 5), (3, 7), (5, 9)):
            a = inverse_square(F(7, 3), F(p) * F(5, 11))
            c = inverse_square(F(7, 3), F(q) * F(5, 11))
            values = tuple(
                evaluate_signal(p, q, F(13, 6), a, c, z, exponent)
                for exponent in (1, 2, 3)
            )
            shifted = tuple(
                evaluate_signal(
                    p, q, F(13, 6), a, c, minus_z, exponent
                )
                for exponent in (1, 2, 3)
            )
            self.assertEqual(shifted, tuple(g_neg(value) for value in values))
            self.assertTrue(all(value[1] == 0 for value in values + shifted))
            covariance = values[0][0] * values[2][0] - values[1][0] ** 2
            shifted_covariance = (
                shifted[0][0] * shifted[2][0] - shifted[1][0] ** 2
            )
            self.assertEqual(covariance, shifted_covariance)

    def test_note_serialization_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Common-root lift bound for two-frequency phase synchronization",
            r"\boxed{2\gcd(d,2p).}",
            "The bound includes the degenerate branch",
            "No false modulus exclusion is used",
            "every primitive two-frequency\npair with lower frequency `p>=2`",
            "`1:4` requires its separate elimination argument",
            "even `q>=6` remain open here",
            r"H(z)=(Rc z^d+a)L(z)-a(c-a)F(z)",
            r"H(z)=h_2y^2+h_1y+h_0",
            r"F(z)&=z^{2p}U(y)+T(y)",
            "There are\nthree exhaustive cases",
            "U_2(y)\n      &=y",
            r"\{Rc^2y+a^2\}",
            r"=ay(a-c)\neq0",
            "This is the degenerate branch that must not be discarded",
            "rather than (3.3), fixes `z^(2p)`",
            r"\gcd(d,2p)=1",
            "at least `2p` distinct sign-changing roots",
            "requested large-gap primitive examples `(2,5)` and `(2,7)`",
            "requested `(1,5)` and `(3,7)` pairs",
            "counting argument is therefore\nsaturated",
            "including the requested `1:6`\ncase, open",
            "not premises of this theorem",
            "P0_INVALIDATED",
            "No status, replay, source lock, integration manifest, or\ncheckpoint artifact is changed",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "every primitive two-frequency pair is solved",
            "the right side of (3.5) has modulus less than one",
            "degenerate branch has no common root",
            "1:6 is synchronized",
            "actual zeta edge has two frequencies",
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


if __name__ == "__main__":
    unittest.main()
