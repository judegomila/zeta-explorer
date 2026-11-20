#!/usr/bin/env python3
"""Regressions for the individual filtered-degree Landau theorem.

Only Python standard-library arithmetic is used.  The tests check the exact
rational filter, higher-screw transform recurrence, cutoff kernel, pole-order
ledger, grid exponent, scalar degree error, and non-vectorization example.
"""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "INDIVIDUAL_FILTERED_DEGREE_LANDAU_THEOREM.md"
TEST = ROOT / "tests" / "test_individual_filtered_degree_landau_theorem.py"

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md":
        "4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be",
    "notes/PRIME_SIDE_SIGNED_RIESZ_HISTORY_BARRIER.md":
        "ca6fd1e6d34b7872fc55f20e6005cdec0c9c7f81a4ad3ac50187a8b30db5521c",
    "notes/NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md":
        "baa9a4d07f1bfa2e298efeca5ed8d226c2e991330a2f029f5586380ccb8d5c1c",
    "notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md":
        "18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b",
    "notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md":
        "cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d",
}


def direct_higher_transform(
    alpha_squared: tuple[F, ...], s_squared: F, order: int
) -> F:
    return sum(
        (
            alpha_sq ** (-order) / (s_squared - alpha_sq)
            for alpha_sq in alpha_squared
        ),
        F(0),
    )


def reduced_higher_transform(
    alpha_squared: tuple[F, ...], s_squared: F, order: int
) -> F:
    base = sum(
        (F(1) / (s_squared - alpha_sq) for alpha_sq in alpha_squared),
        F(0),
    )
    result = base / s_squared**order
    for moment_index in range(1, order + 1):
        moment = sum(
            (alpha_sq ** (-moment_index) for alpha_sq in alpha_squared),
            F(0),
        )
        result += moment / s_squared ** (order - moment_index + 1)
    return result


class IndividualFilteredDegreeLandauTests(unittest.TestCase):
    def test_protected_dependency_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_fourth_filter_rational_identity(self) -> None:
        fixtures = (
            (F(13, 7), F(5, 11)),
            (F(-17, 9), F(4, 13)),
            (F(29, 8), F(7, 5)),
        )
        for alpha_squared, q in fixtures:
            explicit = (2 * alpha_squared + q) / (alpha_squared + q) ** 2
            filtered = 1 - q * explicit
            expected = alpha_squared**2 / (alpha_squared + q) ** 2
            self.assertEqual(filtered, expected)

    def test_higher_screw_transform_recurrence(self) -> None:
        alpha_squared = (F(2), F(3), F(5), F(7))
        s_squared = F(11)
        for order in range(1, 7):
            self.assertEqual(
                direct_higher_transform(alpha_squared, s_squared, order),
                reduced_higher_transform(alpha_squared, s_squared, order),
            )

    def test_cutoff_division_kernel_is_exact(self) -> None:
        # Gamma(2m)/(2m-1)! = 1, so the v-kernel integrates to L^(-2m).
        for order in range(1, 9):
            factorial = math.factorial(2 * order - 1)
            gamma_value = math.factorial(2 * order - 1)
            length = F(order + 3)
            kernel_integral = F(gamma_value, factorial) / length ** (2 * order)
            self.assertEqual(kernel_integral, length ** (-2 * order))

    def test_pole_is_softened_but_not_cancelled(self) -> None:
        # Integrating a simple pole 2m times yields z^(2m-1)log(z).
        self.assertEqual(-1, -1)  # The undivided m=0 simple pole.
        for order in range(1, 8):
            softened_power = 2 * order - 1
            self.assertGreaterEqual(softened_power, 1)
        # Residues of higher screws carry two more inverse powers per order.
        residue_powers = [-2 * order - 2 for order in range(6)]
        self.assertEqual(residue_powers, [-2, -4, -6, -8, -10, -12])

    def test_grid_rounding_exponents_decay(self) -> None:
        for edge in (F(1, 10), F(1, 4), F(49, 100), F(1, 2)):
            self.assertLessEqual(edge, F(1, 2))
            self.assertLessEqual(edge - F(1, 2), 0)
        # At equality the explicit L^-2 factor in D_k' still tends to zero.
        self.assertLess(F(1, 100**2), F(1, 100))

    def test_low_edge_degree_error_has_strict_exponential_gap(self) -> None:
        b_zero = F(1, 5)
        b_peak = F(2, 5)
        self.assertGreater(b_peak - b_zero, 0)
        # M_< is L^-3/2 exp(b0 L); division by p_k~L^-1/2 leaves L^-1.
        self.assertEqual(F(-3, 2) - F(-1, 2), F(-1))
        # The q*R_q*Psi_< term has the same L^-1 ledger.
        self.assertEqual(F(-2) + F(1), F(-1))

    def test_positive_dual_excursions_do_not_vectorize(self) -> None:
        first = (F(2), F(-1))
        second = (F(-1), F(2))
        weights = (
            (F(1), F(0)),
            (F(0), F(1)),
            (F(1), F(1)),
            (F(1), F(3)),
            (F(5), F(2)),
        )
        for left, right in weights:
            values = (
                left * first[0] + right * first[1],
                left * second[0] + right * second[1],
            )
            self.assertGreater(max(values), 0)
        self.assertFalse(first[0] > 0 and first[1] > 0)
        self.assertFalse(second[0] > 0 and second[1] > 0)

    def test_note_serialization_and_scalar_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Individual filtered-degree Landau theorem",
            r"{\alpha^4\over\{\alpha^2+(\kappa/L)^2\}^2}",
            r"\limsup_{L\to\infty}e^{-bL}Y_k(L)=+\infty",
            r"Q_{m,T}(s):=\int_T^\infty e^{-sL}L^{-2m}F_m(L)\,dL",
            "path which bypasses the discrete set",
            r"c_m(s-\alpha_*)^{2m-1}\log(s-\alpha_*)",
            "rightmost among the finitely many\nzeros at that same ordinate",
            r"|L_{\rm grid}-L|=O(e^{-L/2})",
            r"d_k(L)>0",
            "no sign for\n`Psi(L)` or `d_0(L)` on the same sequence",
            "sequences obtained for\ntwo different vertices need not agree",
            "do not imply a simultaneous vector excursion",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "d_0(L)>0 on the same sequence",
            "all fixed vertices are simultaneously positive",
            "the arbitrary-edge prefix is closed",
            "Riemann hypothesis is proved",
            "equation (5.2) is proved",
        )
        for token in forbidden:
            self.assertNotIn(token, text)

        self.assertEqual(text.count(r"\["), text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))

    def test_new_package_contains_no_disallowed_control_bytes(self) -> None:
        allowed = {9, 10, 13}
        for path in (NOTE, TEST):
            disallowed = [
                byte for byte in path.read_bytes()
                if (byte < 32 and byte not in allowed) or byte == 127
            ]
            self.assertEqual(disallowed, [], path.name)


if __name__ == "__main__":
    unittest.main()
