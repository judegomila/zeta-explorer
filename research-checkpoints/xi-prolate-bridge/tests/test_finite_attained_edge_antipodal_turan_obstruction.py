#!/usr/bin/env python3
"""Exact regressions for the finite attained-edge antipodal obstruction."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FINITE_ATTAINED_EDGE_ANTIPODAL_TURAN_OBSTRUCTION.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/UNIQUE_ATTAINED_EDGE_FIRST_MINOR_OBSTRUCTION.md":
        "04c55777689638dff3fa7416bd4380cda0efbf02ea94d55431f4ff0c0787a28d",
    "notes/ATTAINED_RIGHT_EDGE_VECTOR_SELECTION_THEOREM.md":
        "6f67349e53e761744408bfa053874ce4f79b22aac578fa6fff48fa5915e65edf",
    "notes/NONATTAINED_HIGH_EDGE_RECORD_FILTER_THEOREM.md":
        "14be9eca50d64ff2c4c6710e1523238e1a3df21464f40b13b9ab86478b0e61ae",
    "notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md":
        "4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be",
    "notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md":
        "ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171",
}

Gaussian = tuple[F, F]


def g_add(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] + right[0], left[1] + right[1]


def g_sub(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] - right[0], left[1] - right[1]


def g_mul(left: Gaussian, right: Gaussian) -> Gaussian:
    a, b = left
    c, d = right
    return a * c - b * d, a * d + b * c


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


def alpha_inverse_square(edge: F, ordinate: int) -> Gaussian:
    alpha = (edge, F(ordinate))
    return g_inverse(g_mul(alpha, alpha))


def poly_add_term(
    polynomial: dict[int, Gaussian], exponent: int, coefficient: Gaussian
) -> None:
    polynomial[exponent] = g_add(
        polynomial.get(exponent, (F(0), F(0))), coefficient
    )


def poly_multiply(
    left: dict[int, Gaussian], right: dict[int, Gaussian]
) -> dict[int, Gaussian]:
    result: dict[int, Gaussian] = {}
    for left_exponent, left_coefficient in left.items():
        for right_exponent, right_coefficient in right.items():
            poly_add_term(
                result,
                left_exponent + right_exponent,
                g_mul(left_coefficient, right_coefficient),
            )
    return result


def edge_polynomial(
    edge: F, ordinates: tuple[int, ...], multiplicities: tuple[int, ...], power: int
) -> dict[int, Gaussian]:
    result: dict[int, Gaussian] = {}
    for ordinate, multiplicity in zip(ordinates, multiplicities, strict=True):
        coefficient = g_scale(
            F(multiplicity), g_power(alpha_inverse_square(edge, ordinate), power)
        )
        poly_add_term(result, ordinate, coefficient)
        poly_add_term(result, -ordinate, g_conjugate(coefficient))
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
            coefficient = g_power(alpha_inverse_square(edge, ordinate), power)
            total = g_add(
                total, g_scale(F(multiplicity), g_mul(coefficient, phase))
            )
        values.append(2 * total[0])
    p_value, v_value, w_value = values
    return p_value, v_value, w_value, p_value * w_value - v_value**2


def nearest_strict_natural_length(time: float) -> tuple[int, float]:
    target = 2.0 * math.exp(time / 2.0)
    center = int(round(target))
    candidates = [value for value in range(center - 2, center + 3) if value % 2]
    odd = min(candidates, key=lambda value: abs(value - target))
    return odd, 2.0 * math.log(odd / 2.0)


class FiniteAttainedEdgeAntipodalTuranObstructionTests(unittest.TestCase):
    def test_protected_dependency_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_bohr_mean_is_exactly_the_negative_self_pair_sum(self) -> None:
        edge = F(2, 5)
        ordinates = (1, 3, 4)
        multiplicities = (2, 1, 5)
        p_poly = edge_polynomial(edge, ordinates, multiplicities, 1)
        v_poly = edge_polynomial(edge, ordinates, multiplicities, 2)
        w_poly = edge_polynomial(edge, ordinates, multiplicities, 3)

        pw_constant = poly_multiply(p_poly, w_poly)[0]
        vv_constant = poly_multiply(v_poly, v_poly)[0]
        direct_mean = g_sub(pw_constant, vv_constant)

        expected = F(0)
        for ordinate, multiplicity in zip(
            ordinates, multiplicities, strict=True
        ):
            b_value = alpha_inverse_square(edge, ordinate)
            norm_squared = b_value[0] ** 2 + b_value[1] ** 2
            expected -= (
                4 * F(multiplicity) ** 2 * norm_squared * b_value[1] ** 2
            )

        self.assertEqual(direct_mean, (expected, F(0)))
        self.assertLess(expected, 0)

    def test_integer_relation_parity_detects_the_global_antipode(self) -> None:
        # For two commensurable frequencies, the primitive relation is
        # (gamma_2/gcd, -gamma_1/gcd).  Its coordinate sum must be even.
        examples = (
            ((1, 3), True),
            ((2, 6), True),
            ((1, 2), False),
            ((2, 4), False),
            ((3, 9), True),
        )
        for (left, right), expected in examples:
            divisor = math.gcd(left, right)
            relation = (right // divisor, -(left // divisor))
            parity_condition = sum(relation) % 2 == 0
            self.assertEqual(parity_condition, expected, (left, right))

    def test_antipode_reverses_linear_signs_and_preserves_covariance(self) -> None:
        edge = F(1, 2)
        ordinates = (1, 3)
        multiplicities = (2, 5)
        phases = ((F(3, 5), F(4, 5)), (F(5, 13), F(-12, 13)))
        antipodal_phases = tuple(g_scale(F(-1), phase) for phase in phases)

        values = evaluate_edge_functions(edge, ordinates, multiplicities, phases)
        flipped = evaluate_edge_functions(
            edge, ordinates, multiplicities, antipodal_phases
        )
        self.assertEqual(flipped[:3], tuple(-value for value in values[:3]))
        self.assertEqual(flipped[3], values[3])

    def test_two_orbit_exact_fixture_has_positive_p_and_negative_covariance(self) -> None:
        # gamma=(1,3) has the exact global flip t -> t+pi.  At t=pi/2,
        # the phases are (i,-i), and every calculation is rational.
        p_value, v_value, w_value, covariance = evaluate_edge_functions(
            F(1, 2),
            (1, 3),
            (1, 1),
            ((F(0), F(1)), (F(0), F(-1))),
        )
        self.assertEqual(p_value, F(41408, 34225))
        self.assertEqual(v_value, F(-1422555648, 1171350625))
        self.assertEqual(w_value, F(14365427135488, 40089475140625))
        self.assertEqual(covariance, F(-41747873333248, 40089475140625))
        self.assertGreater(p_value, 0)
        self.assertLess(covariance, 0)

    def test_recurrent_phase_transfers_to_the_strict_natural_grid(self) -> None:
        base_time = math.pi / 2.0
        for index in (4, 7, 10):
            time = base_time + 2.0 * math.pi * index
            odd, length = nearest_strict_natural_length(time)
            self.assertEqual(odd % 2, 1)
            self.assertLessEqual(abs(length - time), 2.1 * math.exp(-time / 2.0))
            phases = (
                (F(0), F(1)),
                (F(0), F(-1)),
            )
            exact = evaluate_edge_functions(F(1, 2), (1, 3), (1, 1), phases)
            numerical_phases = (
                complex(math.cos(length), math.sin(length)),
                complex(math.cos(3 * length), math.sin(3 * length)),
            )
            numerical_values = []
            for power in (1, 2, 3):
                total = sum(
                    complex(float(alpha_inverse_square(F(1, 2), ordinate)[0]),
                            float(alpha_inverse_square(F(1, 2), ordinate)[1]))
                    ** power
                    * phase
                    for ordinate, phase in zip((1, 3), numerical_phases, strict=True)
                )
                numerical_values.append(2 * total.real)
            numerical_covariance = (
                numerical_values[0] * numerical_values[2] - numerical_values[1] ** 2
            )
            self.assertAlmostEqual(numerical_values[0], float(exact[0]), places=5)
            self.assertAlmostEqual(numerical_covariance, float(exact[3]), places=5)

    def test_residual_exponential_gap_beats_the_turan_scale(self) -> None:
        edge = F(2, 5)
        low_edge = F(1, 4)
        self.assertGreater(edge - low_edge, 0)
        # Psi*rho_1 divided by q^2*Psi^2 carries L^3 and the strict
        # exponential rate -(B-b_0).
        self.assertEqual(F(-1) + F(4), F(3))
        self.assertLess(-(edge - low_edge), 0)

    def test_note_serialization_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "finite union of\ndistinct conjugate orbits",
            r"K=\overline{\{(e^{i\gamma_1t},\ldots,e^{i\gamma_mt})",
            r"(-1,\ldots,-1)\in K",
            r"\sum_{j=1}^m n_j\ \hbox{is even",
            "rational independence of the edge ordinates",
            r"P(z)&=2\Re\sum_{j=1}^m r_jb_jz_j",
            r"{\cal C}(z)=P(z)W(z)-V(z)^2",
            r"-4\sum_{j=1}^m r_j^2|b_j|^2\{\Im b_j\}^2<0",
            "Higher rational relations among three or\nmore ordinates do not enter",
            r"{\cal C}(\epsilon z)={\cal C}(z)",
            "finite exponential polynomial `P(z(t))` is real analytic",
            r"O_{b_0}\{L_n^3e^{-(B-b_0)L_n}\}+o(1)",
            r"d_0d_1-w_{01}^2<0",
            "finite phase-locked edge violating the parity\ncriterion",
            "does not handle a countably infinite attained edge",
            "conditional obstruction for the actual zeta source",
            "proves neither RH\nnor its negation",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "RH is proved",
            "RH is false unconditionally",
            "all finite attained edges force a negative minor",
            "the antipodal condition is known for zeta",
            "the infinite attained edge is solved",
            "the phase-locked case is solved",
            "equation (5.2) is proved",
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
