#!/usr/bin/env python3
"""Exact regressions for finite-edge phase synchronization criteria."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FINITE_EDGE_PHASE_SYNCHRONIZATION_CRITERIA.md"
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
    "notes/UNIQUE_ATTAINED_EDGE_FIRST_MINOR_OBSTRUCTION.md":
        "04c55777689638dff3fa7416bd4380cda0efbf02ea94d55431f4ff0c0787a28d",
    "notes/FINITE_ATTAINED_EDGE_ANTIPODAL_TURAN_OBSTRUCTION.md":
        "a8a51e9b7d115eed1e48a358fba0dab0556782a09e851d149c952fdd091bc5fc",
    "notes/ATTAINED_RIGHT_EDGE_VECTOR_SELECTION_THEOREM.md":
        "6f67349e53e761744408bfa053874ce4f79b22aac578fa6fff48fa5915e65edf",
}

Gaussian = tuple[F, F]
Polynomial = dict[int, Gaussian]


def g_add(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] + right[0], left[1] + right[1]


def g_sub(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] - right[0], left[1] - right[1]


def g_mul(left: Gaussian, right: Gaussian) -> Gaussian:
    a_value, b_value = left
    c_value, d_value = right
    return (
        a_value * c_value - b_value * d_value,
        a_value * d_value + b_value * c_value,
    )


def g_scale(scale: F, value: Gaussian) -> Gaussian:
    return scale * value[0], scale * value[1]


def g_conjugate(value: Gaussian) -> Gaussian:
    return value[0], -value[1]


def g_inverse(value: Gaussian) -> Gaussian:
    denominator = value[0] ** 2 + value[1] ** 2
    return value[0] / denominator, -value[1] / denominator


def g_power(value: Gaussian, exponent: int) -> Gaussian:
    result = (F(1), F(0))
    for _ in range(exponent):
        result = g_mul(result, value)
    return result


def g_norm_squared(value: Gaussian) -> F:
    return value[0] ** 2 + value[1] ** 2


def inverse_square(edge: F, ordinate: int) -> Gaussian:
    alpha = (edge, F(ordinate))
    return g_inverse(g_mul(alpha, alpha))


def poly_add_term(
    polynomial: Polynomial, exponent: int, coefficient: Gaussian
) -> None:
    polynomial[exponent] = g_add(
        polynomial.get(exponent, (F(0), F(0))), coefficient
    )
    if polynomial[exponent] == (F(0), F(0)):
        del polynomial[exponent]


def poly_subtract(left: Polynomial, right: Polynomial) -> Polynomial:
    result = dict(left)
    for exponent, coefficient in right.items():
        poly_add_term(result, exponent, g_scale(F(-1), coefficient))
    return result


def poly_multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    result: Polynomial = {}
    for left_exponent, left_coefficient in left.items():
        for right_exponent, right_coefficient in right.items():
            poly_add_term(
                result,
                left_exponent + right_exponent,
                g_mul(left_coefficient, right_coefficient),
            )
    return result


def edge_polynomial(
    edge: F,
    ordinates: tuple[int, ...],
    multiplicities: tuple[int, ...],
    power: int,
) -> Polynomial:
    result: Polynomial = {}
    for ordinate, multiplicity in zip(
        ordinates, multiplicities, strict=True
    ):
        coefficient = g_scale(
            F(multiplicity), g_power(inverse_square(edge, ordinate), power)
        )
        poly_add_term(result, ordinate, coefficient)
        poly_add_term(result, -ordinate, g_conjugate(coefficient))
    return result


def apply_d_plus_b_squared(polynomial: Polynomial, edge: F) -> Polynomial:
    result: Polynomial = {}
    for exponent, coefficient in polynomial.items():
        multiplier = g_power((edge, F(exponent)), 2)
        poly_add_term(result, exponent, g_mul(multiplier, coefficient))
    return result


def evaluate_edge_functions(
    edge: F,
    ordinates: tuple[int, ...],
    multiplicities: tuple[int, ...],
    phases: tuple[Gaussian, ...],
) -> tuple[F, F, F, F]:
    values: list[F] = []
    for power in (1, 2, 3):
        total = (F(0), F(0))
        for ordinate, multiplicity, phase in zip(
            ordinates, multiplicities, phases, strict=True
        ):
            term = g_mul(g_power(inverse_square(edge, ordinate), power), phase)
            total = g_add(total, g_scale(F(multiplicity), term))
        values.append(2 * total[0])
    p_value, v_value, w_value = values
    return p_value, v_value, w_value, p_value * w_value - v_value**2


def coefficient_decomposition(
    edge: F,
    ordinates: tuple[int, ...],
    multiplicities: tuple[int, ...],
) -> tuple[Polynomial, F, F]:
    b_values = tuple(inverse_square(edge, ordinate) for ordinate in ordinates)
    self_sum = F(0)
    expected: Polynomial = {}
    for multiplicity, b_value in zip(
        multiplicities, b_values, strict=True
    ):
        self_sum += (
            4
            * F(multiplicity) ** 2
            * g_norm_squared(b_value)
            * b_value[1] ** 2
        )
    poly_add_term(expected, 0, (-self_sum, F(0)))

    l1_cross_bound = F(0)
    for left in range(len(ordinates)):
        for right in range(left + 1, len(ordinates)):
            scale = F(multiplicities[left] * multiplicities[right])
            b_left = b_values[left]
            b_right = b_values[right]
            difference = g_sub(b_left, b_right)
            conjugate_difference = g_sub(b_left, g_conjugate(b_right))
            a_value = g_scale(
                scale,
                g_mul(
                    g_mul(b_left, b_right),
                    g_mul(difference, difference),
                ),
            )
            d_value = g_scale(
                scale,
                g_mul(
                    g_mul(b_left, g_conjugate(b_right)),
                    g_mul(conjugate_difference, conjugate_difference),
                ),
            )
            sum_exponent = ordinates[left] + ordinates[right]
            difference_exponent = ordinates[left] - ordinates[right]
            poly_add_term(expected, sum_exponent, a_value)
            poly_add_term(expected, -sum_exponent, g_conjugate(a_value))
            poly_add_term(expected, difference_exponent, d_value)
            poly_add_term(
                expected, -difference_exponent, g_conjugate(d_value)
            )
            l1_cross_bound += 2 * (
                abs(a_value[0])
                + abs(a_value[1])
                + abs(d_value[0])
                + abs(d_value[1])
            )
    return expected, self_sum, l1_cross_bound


class FiniteEdgePhaseSynchronizationCriteriaTests(unittest.TestCase):
    def test_protected_dependency_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_resolvent_filter_relations_are_exact(self) -> None:
        edge = F(2, 5)
        ordinates = (1, 3, 4)
        multiplicities = (2, 1, 5)
        p_poly = edge_polynomial(edge, ordinates, multiplicities, 1)
        v_poly = edge_polynomial(edge, ordinates, multiplicities, 2)
        w_poly = edge_polynomial(edge, ordinates, multiplicities, 3)
        self.assertEqual(apply_d_plus_b_squared(v_poly, edge), p_poly)
        self.assertEqual(apply_d_plus_b_squared(w_poly, edge), v_poly)

    def test_boundary_transversality_is_an_exact_local_certificate(self) -> None:
        # For B=gamma=1, b=-i/2.  At z=1, P=0 but V=-1/2,
        # so C=-V^2.  The rational unit phase 3/5+4i/5 is on the
        # positive side and retains the same negative one-orbit covariance.
        boundary = evaluate_edge_functions(
            F(1), (1,), (1,), ((F(1), F(0)),)
        )
        favorable = evaluate_edge_functions(
            F(1), (1,), (1,), ((F(3, 5), F(4, 5)),)
        )
        self.assertEqual(boundary, (F(0), F(-1, 2), F(0), F(-1, 4)))
        self.assertEqual(favorable[0], F(4, 5))
        self.assertEqual(favorable[3], F(-1, 4))

    def test_full_cross_coefficient_decomposition_is_exact(self) -> None:
        edge = F(2, 5)
        ordinates = (1, 3, 4)
        multiplicities = (2, 1, 5)
        p_poly = edge_polynomial(edge, ordinates, multiplicities, 1)
        v_poly = edge_polynomial(edge, ordinates, multiplicities, 2)
        w_poly = edge_polynomial(edge, ordinates, multiplicities, 3)
        direct = poly_subtract(
            poly_multiply(p_poly, w_poly), poly_multiply(v_poly, v_poly)
        )
        expected, self_sum, _ = coefficient_decomposition(
            edge, ordinates, multiplicities
        )
        self.assertEqual(direct, expected)
        self.assertGreater(self_sum, 0)
        self.assertEqual(direct[0], (-self_sum, F(0)))

    def test_strict_dominance_has_an_exact_l1_certificate(self) -> None:
        # |z| <= |Re z|+|Im z| makes this stronger than the displayed
        # Euclidean-modulus criterion, while keeping the regression rational.
        edge = F(1)
        ordinates = (1, 2)
        multiplicities = (10, 1)
        _, self_sum, l1_cross_bound = coefficient_decomposition(
            edge, ordinates, multiplicities
        )
        self.assertEqual(self_sum - l1_cross_bound, F(367069, 15625))
        self.assertGreater(self_sum, l1_cross_bound)

        for phases in (
            ((F(1), F(0)), (F(1), F(0))),
            ((F(0), F(1)), (F(-1), F(0))),
            ((F(3, 5), F(4, 5)), (F(5, 13), F(-12, 13))),
        ):
            covariance = evaluate_edge_functions(
                edge, ordinates, multiplicities, phases
            )[3]
            self.assertLess(covariance, 0)

    def test_equal_newton_support_cannot_hide_proportionality(self) -> None:
        edge = F(1)
        b_one = inverse_square(edge, 1)
        b_two = inverse_square(edge, 2)
        support = {-2, -1, 1, 2}
        self.assertEqual(min(support), -2)
        self.assertEqual(max(support), 2)
        preserving_shifts = {
            shift for shift in range(-5, 6)
            if {exponent + shift for exponent in support} == support
        }
        self.assertEqual(preserving_shifts, {0})

        positive_ratios = (b_one, b_two)
        negative_ratios = (g_conjugate(b_one), g_conjugate(b_two))
        self.assertNotEqual(positive_ratios[0], negative_ratios[0])
        self.assertNotEqual(positive_ratios[0], positive_ratios[1])
        self.assertFalse(
            all(value == positive_ratios[0]
                for value in positive_ratios + negative_ratios)
        )

    def test_failure_rigidity_convex_chord_is_exact(self) -> None:
        # y=t(t-1)/2 is the exact model after y=e^(Bt)V:
        # y''=1>0, its zero chord is at the endpoints, and y<0 inside.
        samples = tuple(F(index, 10) for index in range(1, 10))
        y_values = tuple(time * (time - 1) / 2 for time in samples)
        self.assertTrue(all(value < 0 for value in y_values))
        self.assertEqual(F(0) * (F(0) - 1) / 2, 0)
        self.assertEqual(F(1) * (F(1) - 1) / 2, 0)
        self.assertEqual(F(-1, 2), F(0) - F(1, 2))
        self.assertEqual(F(1, 2), F(1) - F(1, 2))

        for v_value in y_values:
            p_value = F(1)
            w_value = v_value**2 / p_value
            self.assertGreater(w_value, 0)
            self.assertEqual(p_value * w_value - v_value**2, 0)

    def test_nonantipodal_fixture_is_exact_and_favorable(self) -> None:
        relation = (2, -1)
        self.assertEqual(relation[0] * 1 + relation[1] * 2, 0)
        self.assertEqual(sum(relation) % 2, 1)

        values = evaluate_edge_functions(
            F(1),
            (1, 2),
            (1, 1),
            ((F(0), F(1)), (F(-1), F(0))),
        )
        self.assertEqual(
            values,
            (
                F(31, 25),
                F(14, 625),
                F(-16561, 62500),
                F(-20567, 62500),
            ),
        )
        self.assertGreater(values[0], 0)
        self.assertLess(values[3], 0)

    def test_note_serialization_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "The antipode condition from the frozen finite-attained-edge theorem is\n"
            "sufficient, but it is not necessary",
            "These criteria do **not** prove that every finite phase-locked edge",
            r"{\cal C}(z_0)=-V(z_0)^2<0",
            r"A_{jk}&=r_jr_kb_jb_k(b_j-b_k)^2",
            r"D_{jk}&=r_jr_kb_j\overline {b_k}",
            r"2\sum_{j<k}\bigl(|A_{jk}|+|D_{jk}|\bigr)<S",
            "regular torus sign boundary",
            "Zariski dense in the complete complex hypersurface",
            r"\operatorname {Newt}(v)",
            r"c=b_j=\overline {b_j}",
            r"(D+B)^2V=P",
            r"p(t)>0\quad\Longrightarrow\quad",
            "every sign-changing endpoint of\n`P` to be shared by `V`",
            "primitive relation `(2,-1)` has odd coordinate sum",
            r"{\cal C}=-{20567\over62500}",
            "floating computations are diagnostic only",
            "not an\nexhaustive search",
            "not an actual-zeta edge claim",
            "universal finite phase-locked question therefore remains open",
            "No\ncheckpoint-0.85 status, replay, source lock, or artifact is changed",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "every finite attained edge is obstructed",
            "the phase-locked case is solved",
            "actual zeta edge satisfies",
            "RH is proved",
            "RH is false unconditionally",
            "equation (5.2) is proved",
            "diagnostics prove",
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
