#!/usr/bin/env python3
"""Exact regressions for the growing-rest radical-tail Schur reduction."""

from __future__ import annotations

from fractions import Fraction as F
import ast
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md":
        "9700501a367ea7ae2b843ee61b45bec3970fc35db1715613099b08439be0415c",
    "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md":
        "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md":
        "e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816",
    "notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md":
        "eda566d5a2867d28f5218a89a48cc95c30fe74491fb11bb74b86c7fb6ed68ac6",
    "notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md":
        "6281a93e4320e6c25fa09fdf942b94147a9b6aa1706b6c34dd079074d2f0ee98",
    "notes/TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md":
        "e5a0888f54ae4ae97d00462b7cfd00cbc9d98638ff9d36aea0fdb7a1c861e77f",
    "notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md":
        "9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71",
    "notes/TRANSPORTED_SIGNED_KERNEL_LEFT_RESERVE_BARRIER.md":
        "6e45d1ba6667f480223f0e742fd57c14c8708bc8cd8f77c0001edb9c234b23d2",
}

Matrix = tuple[tuple[F, ...], ...]
Vector = tuple[F, ...]


def transpose(matrix: Matrix) -> Matrix:
    return tuple(
        tuple(matrix[i][j] for i in range(len(matrix)))
        for j in range(len(matrix[0]))
    )


def matmul(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(
            sum(left[i][k] * right[k][j] for k in range(len(right)))
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


def matsub(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] - right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def matadd(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] + right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def scale(scalar: F, matrix: Matrix) -> Matrix:
    return tuple(tuple(scalar * entry for entry in row) for row in matrix)


def mat_vec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum(matrix[i][j] * vector[j] for j in range(len(vector)))
        for i in range(len(matrix))
    )


def dot(left: Vector, right: Vector) -> F:
    return sum(x * y for x, y in zip(left, right))


def outer(left: Vector, right: Vector | None = None) -> Matrix:
    if right is None:
        right = left
    return tuple(tuple(x * y for y in right) for x in left)


def diagonal(*entries: F) -> Matrix:
    return tuple(
        tuple(entries[i] if i == j else F(0) for j in range(len(entries)))
        for i in range(len(entries))
    )


def quadratic(matrix: Matrix, vector: Vector) -> F:
    return dot(vector, mat_vec(matrix, vector))


class GrowingRestSignedRadicalTailSchurReductionTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_noninjective_physical_source_floor_equivalence(self) -> None:
        # A=(1,1): R^2 -> R, P0=J/2, Delta=1/2, and B=3/4.
        synthesis: Matrix = ((F(1), F(1)),)
        p0: Matrix = ((F(1, 2), F(1, 2)), (F(1, 2), F(1, 2)))
        physical: Matrix = ((F(3, 4),),)
        delta: Matrix = ((F(1, 2),),)
        mu = F(1)
        pullback = matmul(matmul(transpose(synthesis), physical), synthesis)
        source_gap = matsub(pullback, scale(mu, p0))
        physical_gap = matsub(physical, scale(mu, delta))
        self.assertEqual(pullback, ((F(3, 4), F(3, 4)),) * 2)
        self.assertEqual(source_gap, ((F(1, 4), F(1, 4)),) * 2)
        self.assertEqual(physical_gap, ((F(1, 4),),))
        for vector in ((F(1), F(0)), (F(0), F(1)), (F(2), F(-1))):
            self.assertGreaterEqual(quadratic(source_gap, vector), 0)

    def test_source_projection_is_the_support_of_the_normalized_gram(self) -> None:
        gram: Matrix = ((F(1), F(1)), (F(1), F(1)))
        p0: Matrix = ((F(1, 2), F(1, 2)), (F(1, 2), F(1, 2)))
        self.assertEqual(matmul(p0, p0), p0)
        self.assertEqual(matmul(gram, p0), gram)
        self.assertEqual(matmul(p0, gram), gram)
        kernel = (F(1), F(-1))
        range_vector = (F(1), F(1))
        self.assertEqual(mat_vec(p0, kernel), (F(0), F(0)))
        self.assertEqual(mat_vec(p0, range_vector), range_vector)

    def test_anchor_deflation_and_origin_correction_are_linear(self) -> None:
        # Each c_t=e_t+rho_t e_0 has zero integral; subtracting alpha*c_4
        # and then the invisible zero-integral origin bump preserves it.
        integral_e0 = F(4)
        integral_e8 = F(2)
        integral_e4 = F(3)
        rho8 = -integral_e8 / integral_e0
        rho4 = -integral_e4 / integral_e0
        alpha = F(2, 5)
        integral_c8 = integral_e8 + rho8 * integral_e0
        integral_c4 = integral_e4 + rho4 * integral_e0
        integral_f8 = integral_c8 - alpha * integral_c4
        self.assertEqual((integral_c8, integral_c4, integral_f8), (F(0),) * 3)

        # Store a source profile only by (origin value, integral).
        f8 = (F(7, 3), integral_f8)
        f12 = (F(-5, 2), F(0))
        bump = (F(1), F(0))

        def correct(profile: tuple[F, F]) -> tuple[F, F]:
            return (
                profile[0] - profile[0] * bump[0],
                profile[1] - profile[0] * bump[1],
            )

        x = F(2, 3)
        y = F(-4, 5)
        combined = (x * f8[0] + y * f12[0], x * f8[1] + y * f12[1])
        corrected_combined = correct(combined)
        corrected_separate = (
            x * correct(f8)[0] + y * correct(f12)[0],
            x * correct(f8)[1] + y * correct(f12)[1],
        )
        self.assertEqual(corrected_combined, corrected_separate)
        self.assertEqual(corrected_combined, (F(0), F(0)))

    def test_polarization_recovers_every_exterior_cross_entry(self) -> None:
        signed: Matrix = ((F(3), F(1)), (F(1), F(2)))
        e8 = (F(1), F(0))
        er = (F(0), F(1))
        plus = (F(1), F(1))
        minus = (F(1), F(-1))
        recovered_cross = (quadratic(signed, plus) - quadratic(signed, minus)) / 4
        self.assertEqual(quadratic(signed, e8), 3)
        self.assertEqual(quadratic(signed, er), 2)
        self.assertEqual(recovered_cross, 1)

    def test_raw_congruence_and_singleton_short_agree_exactly(self) -> None:
        d_half: Matrix = diagonal(F(2), F(3))
        normalized: Matrix = ((F(2), F(1)), (F(1), F(3)))
        p0: Matrix = diagonal(F(1), F(1))
        mu = F(1)
        raw_signed = matmul(matmul(d_half, normalized), d_half)
        raw_metric = matmul(matmul(d_half, p0), d_half)
        raw_gap = matsub(raw_signed, scale(mu, raw_metric))
        normalized_gap = matsub(normalized, scale(mu, p0))
        self.assertEqual(raw_signed, ((F(8), F(6)), (F(6), F(27))))
        self.assertEqual(raw_gap, ((F(4), F(6)), (F(6), F(18))))
        self.assertEqual(matmul(matmul(d_half, normalized_gap), d_half), raw_gap)
        raw_short = raw_gap[1][1] - raw_gap[1][0] ** 2 / raw_gap[0][0]
        normalized_short = (
            normalized_gap[1][1]
            - normalized_gap[1][0] ** 2 / normalized_gap[0][0]
        )
        self.assertEqual(raw_short, 9)
        self.assertEqual(normalized_short, 1)

    def test_positive_singleton_branch_is_exact(self) -> None:
        singleton = F(4)
        cross = (F(2), F(-1))
        rest: Matrix = ((F(2), F(0)), (F(0), F(1)))
        short = matsub(rest, scale(1 / singleton, outer(cross)))
        self.assertEqual(short, ((F(1), F(1, 2)), (F(1, 2), F(3, 4))))
        self.assertEqual(short[0][0] * short[1][1] - short[0][1] ** 2, F(1, 2))
        self.assertGreater(short[0][0], 0)
        self.assertGreater(short[1][1], 0)

    def test_zero_singleton_branch_requires_zero_cross(self) -> None:
        rest: Matrix = diagonal(F(2), F(3))
        self.assertEqual(rest[0][0] * rest[1][1], 6)
        # With s=0 and c!=0, a two-coordinate principal minor is -c^2.
        for cross_entry in (F(1), F(-3, 5)):
            principal_determinant = F(0) * rest[0][0] - cross_entry**2
            self.assertLess(principal_determinant, 0)
        # With c=0, the block is exactly 0 direct-sum rest and is PSD.
        for vector in ((F(1), F(2)), (F(-3), F(4))):
            self.assertGreaterEqual(quadratic(rest, vector), 0)

    def test_negative_singleton_branch_is_impossible(self) -> None:
        singleton = F(-1, 7)
        unit_singleton = (F(1), F(0), F(0))
        full: Matrix = (
            (singleton, F(0), F(0)),
            (F(0), F(2), F(0)),
            (F(0), F(0), F(3)),
        )
        self.assertEqual(quadratic(full, unit_singleton), singleton)
        self.assertLess(quadratic(full, unit_singleton), 0)

    def test_singular_rest_pivot_keeps_range_condition(self) -> None:
        rest = diagonal(F(2), F(0))
        rest_dagger = diagonal(F(1, 2), F(0))
        singleton = F(1)
        cross_in_range = (F(1), F(0))
        load = dot(cross_in_range, mat_vec(rest_dagger, cross_in_range))
        self.assertEqual(load, F(1, 2))
        self.assertGreaterEqual(singleton - load, 0)
        cross_out_of_range = (F(0), F(1))
        self.assertEqual(mat_vec(rest, cross_out_of_range), (F(0), F(0)))
        # The apparent dagger load is zero, but the range condition rejects it.
        self.assertEqual(dot(cross_out_of_range, mat_vec(rest_dagger, cross_out_of_range)), 0)
        principal_determinant = F(0) * singleton - F(1) ** 2
        self.assertLess(principal_determinant, 0)

    def test_quotient_relative_cross_load_matches_schur_boundary(self) -> None:
        rest = diagonal(F(2), F(3))
        rest_inverse = diagonal(F(1, 2), F(1, 3))
        cross = (F(1), F(1))
        singleton = F(5, 6)
        load = dot(cross, mat_vec(rest_inverse, cross))
        tau_squared = load / singleton
        self.assertEqual(load, F(5, 6))
        self.assertEqual(tau_squared, 1)
        short = matsub(rest, scale(1 / singleton, outer(cross)))
        self.assertEqual(short[0][0] * short[1][1] - short[0][1] ** 2, 0)

    def test_weighted_pnt_matrix_identity_keeps_signed_cancellation(self) -> None:
        gram: Matrix = ((F(2), F(1)), (F(1), F(3)))
        tail: Matrix = ((F(3), F(-1)), (F(-1), F(4)))
        discrepancy: Matrix = ((F(1), F(2)), (F(2), F(1)))
        scalar = F(5, 2)
        signed_shifted = matsub(matadd(scale(scalar, gram), tail), discrepancy)
        self.assertEqual(
            signed_shifted,
            ((F(7), F(-1, 2)), (F(-1, 2), F(21, 2))),
        )
        vector = (F(2), F(-1))
        combined = quadratic(signed_shifted, vector)
        separated = (
            scalar * quadratic(gram, vector)
            + quadratic(tail, vector)
            - quadratic(discrepancy, vector)
        )
        self.assertEqual(combined, separated)

    def test_whitened_shift_exponent_ledger(self) -> None:
        # Relative to d8^-1: U contributes lambda^-4, MR contributes an
        # additional lambda^-2, and the cross uses the geometric mean.
        u_power = F(-4)
        m8_extra_power = F(0)
        mr_extra_power = F(-2)
        singleton_power = u_power + m8_extra_power
        rest_power = u_power + mr_extra_power
        cross_power = u_power + (m8_extra_power + mr_extra_power) / 2
        self.assertEqual((singleton_power, rest_power, cross_power), (F(-4), F(-6), F(-5)))

    def test_paired_slot_family_has_identical_positive_data_and_collapsing_floor(self) -> None:
        g = F(3)
        absolute = diagonal(g, F(1), F(1))
        previous_floor = None
        for n in (2, 3, 5, 11):
            epsilon = F(1, n)
            signed = diagonal(g, epsilon, epsilon)
            aligned = scale(F(1, 2), matadd(absolute, signed))
            anti = scale(F(1, 2), matsub(absolute, signed))
            defect = matsub(absolute, signed)
            self.assertEqual(defect, scale(F(2), anti))
            self.assertEqual(signed[0][0], g)
            self.assertEqual((signed[1][1], signed[2][2]), (epsilon, epsilon))
            self.assertTrue(all(aligned[i][i] >= 0 for i in range(3)))
            self.assertTrue(all(anti[i][i] >= 0 for i in range(3)))
            if previous_floor is not None:
                self.assertLess(epsilon, previous_floor)
            previous_floor = epsilon

        negative = F(-1, 2)
        signed_negative = diagonal(g, negative, negative)
        aligned_negative = scale(F(1, 2), matadd(absolute, signed_negative))
        anti_negative = scale(F(1, 2), matsub(absolute, signed_negative))
        self.assertTrue(all(aligned_negative[i][i] >= 0 for i in range(3)))
        self.assertTrue(all(anti_negative[i][i] >= 0 for i in range(3)))
        self.assertLess(signed_negative[1][1], 0)

    def test_note_states_minimal_target_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Growing-rest signed radical-tail Schur reduction",
            "without assuming injectivity",
            "P_0=A^\\dagger A=1_{(\\ker A)^\\perp}",
            "P_0=1_{(0,\\infty)}(D^{-1/2}GD^{-1/2})",
            "Linear actual radical lift and polarized exterior matrix",
            "origin-corrected global radical lift",
            "anchor-deflated label-8/rest column",
            "\\Sigma={\\cal W}_Z({\\cal R},{\\cal R})=W^*QW",
            "raw source/radical-tail form",
            "If `s_mu>0`",
            "If `s_mu=0`",
            "If `s_mu<0`",
            "rest-pivot formulation",
            "quotient-relative internal cross load",
            "Minimal actual lower-frame target",
            "signed Stieltjes translation covariance",
            "three **whitened** scalar-shift blocks",
            "make no assertion that the raw blocks",
            "Sharp paired-slot nonimplication family",
            "abstract paired-slot implication countermodel",
            "actual prime locations, prolate transition",
            "does not prove that the actual growing prolate rest floor fails",
            "Only fixed-depth tower statements transfer",
            "actual arithmetic inequality (5.9) remains",
            "No finite pilot value is used as a premise",
            "equation (5.2)",
            "No status, replay, source-lock, artifact, or integration file is",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "the actual growing-rest floor is proved",
            "therefore the actual growing prolate rest floor fails",
            "raw shift blocks obey",
            "equation (5.2) is proved",
            "proves RH",
            "pilot proves",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)

    def test_package_is_stdlib_only_and_has_clean_bytes_and_tex_rows(self) -> None:
        tree = ast.parse(TEST.read_text(encoding="utf-8"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {"__future__", "fractions", "ast", "hashlib", "pathlib", "unittest"},
        )
        for path in (NOTE, TEST):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            for line in payload.splitlines():
                trailing = len(line) - len(line.rstrip(b"\\"))
                self.assertEqual(trailing % 2, 0, (path.name, line))


if __name__ == "__main__":
    unittest.main()
