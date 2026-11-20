#!/usr/bin/env python3
"""Exact regressions for the canonical boundary-ground cross-root theorem."""

from __future__ import annotations

from fractions import Fraction
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "CANONICAL_BOUNDARY_GROUND_CROSS_ROOT.md"
F = Fraction

Vector = tuple[Fraction, ...]
Matrix = tuple[tuple[Fraction, ...], ...]
Polynomial = tuple[Fraction, ...]  # ascending powers


def dot(left: Vector, right: Vector) -> Fraction:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


def outer(left: Vector, right: Vector) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def matrix_subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x - y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def source_cauchy_matrix(
    count: int,
    diagonal: tuple[Fraction, ...],
    positive_b: tuple[Fraction, ...],
) -> Matrix:
    modes = tuple(range(-count, count + 1))
    b = {
        mode: (
            F(0)
            if mode == 0
            else positive_b[mode - 1]
            if mode > 0
            else -positive_b[-mode - 1]
        )
        for mode in modes
    }
    return tuple(
        tuple(
            diagonal[abs(mode)]
            if mode == other
            else (b[mode] - b[other]) / F(mode - other)
            for other in modes
        )
        for mode in modes
    )


def rank(matrix: Matrix) -> int:
    if not matrix:
        return 0
    work = [list(row) for row in matrix]
    rows = len(work)
    columns = len(work[0])
    pivot_row = 0
    for column in range(columns):
        pivot = next(
            (row for row in range(pivot_row, rows) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        pivot_value = work[pivot_row][column]
        for row in range(rows):
            if row == pivot_row or work[row][column] == 0:
                continue
            multiplier = work[row][column] / pivot_value
            for entry in range(column, columns):
                work[row][entry] -= multiplier * work[pivot_row][entry]
        pivot_row += 1
        if pivot_row == rows:
            break
    return pivot_row


def poly_trim(polynomial: list[Fraction]) -> Polynomial:
    while len(polynomial) > 1 and polynomial[-1] == 0:
        polynomial.pop()
    return tuple(polynomial)


def poly_add(left: Polynomial, right: Polynomial) -> Polynomial:
    out = [F(0) for _ in range(max(len(left), len(right)))]
    for index, value in enumerate(left):
        out[index] += value
    for index, value in enumerate(right):
        out[index] += value
    return poly_trim(out)


def poly_scale(scale: Fraction, polynomial: Polynomial) -> Polynomial:
    return poly_trim([scale * value for value in polynomial])


def poly_multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    out = [F(0) for _ in range(len(left) + len(right) - 1)]
    for i, x in enumerate(left):
        for j, y in enumerate(right):
            out[i + j] += x * y
    return poly_trim(out)


def raw_mode_polynomial(central: Fraction, positive: tuple[Fraction, ...]) -> Polynomial:
    count = len(positive)
    full: Polynomial = (F(1),)
    for mode in range(1, count + 1):
        full = poly_multiply(full, (F(-(mode * mode)), F(1)))
    out = poly_scale(central, full)
    for mode, coefficient in enumerate(positive, start=1):
        omitted: Polynomial = (F(1),)
        for other in range(1, count + 1):
            if other != mode:
                omitted = poly_multiply(
                    omitted,
                    (F(-(other * other)), F(1)),
                )
        out = poly_add(out, poly_scale(2 * coefficient, (F(0),) + omitted))
    return out


class CanonicalBoundaryGroundCrossRootTests(unittest.TestCase):
    def test_eta_rank_one_has_exact_source_cauchy_serialization(self) -> None:
        count = 2
        diagonal = (F(3), F(5), F(11))
        positive_b = (F(2), F(-3))
        epsilon = F(2, 7)
        matrix = source_cauchy_matrix(count, diagonal, positive_b)
        eta = tuple(F(1) for _ in range(2 * count + 1))
        perturbed = matrix_subtract(matrix, tuple(
            tuple(epsilon * value for value in row) for row in outer(eta, eta)
        ))

        perturbed_diagonal = tuple(value - epsilon for value in diagonal)
        perturbed_b = tuple(
            value - epsilon * mode
            for mode, value in enumerate(positive_b, start=1)
        )
        rebuilt = source_cauchy_matrix(count, perturbed_diagonal, perturbed_b)
        self.assertEqual(perturbed, rebuilt)

        modes = tuple(range(-count, count + 1))
        original_beta = tuple(
            F(0)
            if mode == 0
            else positive_b[mode - 1]
            if mode > 0
            else -positive_b[-mode - 1]
            for mode in modes
        )
        expected_beta = tuple(
            value - epsilon * mode
            for mode, value in zip(modes, original_beta)
        )
        rebuilt_beta = tuple(
            F(0)
            if mode == 0
            else perturbed_b[mode - 1]
            if mode > 0
            else -perturbed_b[-mode - 1]
            for mode in modes
        )
        self.assertEqual(rebuilt_beta, expected_beta)

        # The rank-one all-ones perturbation vanishes on every raw odd shell.
        for n in range(1, count + 1):
            for m in range(1, count + 1):
                i_n, i_minus_n = n + count, -n + count
                i_m, i_minus_m = m + count, -m + count
                odd_before = matrix[i_n][i_m] - matrix[i_n][i_minus_m]
                odd_after = perturbed[i_n][i_m] - perturbed[i_n][i_minus_m]
                self.assertEqual(odd_after, odd_before)

        # Entrywise commutator reconstruction uses beta_epsilon exactly.
        for i, n in enumerate(modes):
            for j, m in enumerate(modes):
                self.assertEqual(
                    F(n - m) * perturbed[i][j],
                    rebuilt_beta[i] - rebuilt_beta[j],
                )

    def test_multiplicity_two_diagonal_selects_canonical_boundary_ground(self) -> None:
        epsilon = F(3, 10)
        zero = source_cauchy_matrix(1, (F(0), F(0)), (F(0),))
        eta = (F(1), F(1), F(1))
        perturbed = matrix_subtract(
            zero,
            tuple(tuple(epsilon * value for value in row) for row in outer(eta, eta)),
        )
        self.assertEqual(matvec(perturbed, eta), tuple(-3 * epsilon for _ in eta))

        boundary_zero_even = (F(1), F(-2), F(1))
        self.assertEqual(matvec(perturbed, boundary_zero_even), (F(0),) * 3)
        self.assertEqual(dot(eta, boundary_zero_even), 0)

        polynomial = raw_mode_polynomial(F(1), (F(1),))
        self.assertEqual(polynomial, (F(-1), F(3)))
        self.assertEqual(-polynomial[0] / polynomial[1], F(1, 3))

    def test_exact_rank_one_interlacing_fixture_has_one_lower_even_level(self) -> None:
        # Raw diagonal: the three modes -1,0,1 form the old ground, while
        # +/-2 have energy five.  The eta perturbation reduces to a two-group
        # block plus exact zero and five directions.
        epsilon = F(1, 10)
        matrix = source_cauchy_matrix(
            2,
            (F(0), F(0), F(5)),
            (F(0), F(0)),
        )
        eta = (F(1),) * 5
        perturbed = matrix_subtract(
            matrix,
            tuple(tuple(epsilon * value for value in row) for row in outer(eta, eta)),
        )

        old_ground_boundary_zero = (F(0), F(1), F(-2), F(1), F(0))
        high_odd = (F(1), F(0), F(0), F(0), F(-1))
        self.assertEqual(matvec(perturbed, old_ground_boundary_zero), (F(0),) * 5)
        self.assertEqual(matvec(perturbed, high_odd), tuple(5 * x for x in high_odd))

        # Reconstruct the normalized two-group compression from the assembled
        # matrix.  The raw group indicators have squared norms three and two,
        # so the determinant can be evaluated without irrational square roots.
        ground_group = (F(0), F(1), F(1), F(1), F(0))
        high_group = (F(1), F(0), F(0), F(0), F(1))
        ground_form = dot(ground_group, matvec(perturbed, ground_group))
        high_form = dot(high_group, matvec(perturbed, high_group))
        cross_form = dot(ground_group, matvec(perturbed, high_group))
        reduced_trace = ground_form / 3 + high_form / 2
        reduced_determinant = (
            ground_form * high_form - cross_form * cross_form
        ) / 6
        self.assertEqual(reduced_trace, F(5) - 5 * epsilon)
        self.assertEqual(reduced_determinant, -15 * epsilon)
        self.assertGreater(reduced_trace, 0)
        self.assertLess(reduced_determinant, 0)
        # Opposite signs in this remaining 2x2 block give exactly one level
        # below zero; the old boundary-zero direction stays at zero.

    def test_failure_branch_projection_eta_zero_is_not_split(self) -> None:
        # a_n=1, b_n=n gives the all-ones source-Cauchy matrix.
        matrix = source_cauchy_matrix(
            3,
            (F(1), F(1), F(1), F(1)),
            (F(1), F(2), F(3)),
        )
        eta = (F(1),) * 7
        self.assertEqual(matrix, outer(eta, eta))
        epsilon = F(1, 3)
        perturbed = matrix_subtract(
            matrix,
            tuple(
                tuple(epsilon * value for value in row)
                for row in outer(eta, eta)
            ),
        )
        first = (F(0), F(0), F(1), F(-2), F(1), F(0), F(0))
        bad_positive = (F(1, 24), F(-17, 120), F(41, 360))
        second = (
            bad_positive[2],
            bad_positive[1],
            bad_positive[0],
            F(-1, 36),
            bad_positive[0],
            bad_positive[1],
            bad_positive[2],
        )
        self.assertEqual(sum(first, F(0)), 0)
        self.assertEqual(sum(second, F(0)), 0)
        self.assertEqual(matvec(perturbed, first), (F(0),) * 7)
        self.assertEqual(matvec(perturbed, second), (F(0),) * 7)
        self.assertEqual(rank((first, second)), 2)

        # Not every vector in the unsplit multiple ground is cross-rooted.
        polynomial = raw_mode_polynomial(F(-1, 36), bad_positive)
        self.assertEqual(polynomial, (F(1), F(0), F(1)))

    def test_coordinate_diagonal_fallback_rescues_failure_branch(self) -> None:
        matrix = source_cauchy_matrix(2, (F(1), F(1), F(1)), (F(1), F(2)))
        epsilon = F(1, 7)
        central = (F(0), F(0), F(1), F(0), F(0))
        perturbed = matrix_subtract(
            matrix,
            tuple(
                tuple(epsilon * value for value in row)
                for row in outer(central, central)
            ),
        )
        # Off-diagonal source-Cauchy data are unchanged; only a_0 moves.
        rebuilt = source_cauchy_matrix(
            2,
            (F(1) - epsilon, F(1), F(1)),
            (F(1), F(2)),
        )
        self.assertEqual(perturbed, rebuilt)

        # A noncentral fallback must perturb both raw members of a shell.
        # It remains source-Cauchy, but unlike the eta perturbation it also
        # moves the corresponding odd direction.
        paired_delta = tuple(
            tuple(
                epsilon if row == column and row in (1, 3) else F(0)
                for column in range(5)
            )
            for row in range(5)
        )
        paired = matrix_subtract(matrix, paired_delta)
        paired_rebuilt = source_cauchy_matrix(
            2,
            (F(1), F(1) - epsilon, F(1)),
            (F(1), F(2)),
        )
        self.assertEqual(paired, paired_rebuilt)
        odd_shell = (F(0), F(1), F(0), F(-1), F(0))
        self.assertEqual(
            matvec(paired, odd_shell),
            tuple(-epsilon * value for value in odd_shell),
        )

        # Five times P_(eta^perp)e_0 in raw coordinates.
        selected_limit = (F(-1), F(-1), F(4), F(-1), F(-1))
        self.assertEqual(sum(selected_limit, F(0)), 0)
        self.assertLess(
            dot(selected_limit, matvec(perturbed, selected_limit)),
            0,
        )
        polynomial = raw_mode_polynomial(F(4), (F(-1), F(-1)))
        self.assertEqual(polynomial, (F(16), F(-10)))
        self.assertEqual(-polynomial[0] / polynomial[1], F(8, 5))

    def test_nonzero_canonical_overlap_has_no_uniform_lower_bound(self) -> None:
        # For Q=0 at N=1, E is the full even sector and its canonical
        # boundary vector is eta.  Algebraically allowed projected states
        # can approach the transverse line, so the theorem itself supplies
        # no quantitative kappa overlap.
        eta = (F(1), F(1), F(1))
        transverse = (F(1), F(-2), F(1))
        self.assertEqual(dot(eta, transverse), 0)
        self.assertEqual(dot(eta, eta), 3)
        self.assertEqual(dot(transverse, transverse), 6)

        for scale in (2, 5, 20, 100):
            trial = tuple(y + x / scale for x, y in zip(eta, transverse))
            overlap_squared = dot(trial, eta) ** 2 / (dot(trial, trial) * dot(eta, eta))
            self.assertEqual(overlap_squared, F(1, 2 * scale * scale + 1))
        self.assertLess(F(1, 2 * 100 * 100 + 1), F(1, 10000))

    def test_multiplicity_safe_projective_minimum_identity(self) -> None:
        # Pi keeps the first three coordinates.  The fourth coordinates
        # witness that this is only a low-mode statement, not full-vector
        # alignment.
        kappa = (F(1), F(2), F(3), F(4))
        ground = (F(2), F(-1), F(4), F(5))
        p = kappa[:3]
        low_ground = ground[:3]
        k00 = dot(p, p)
        c_m = dot(low_ground, p)
        low_ground_norm = dot(low_ground, low_ground)
        transverse_norm = low_ground_norm - c_m * c_m / k00
        denominator = k00 * transverse_norm + c_m * c_m
        scalar = k00 * c_m / denominator
        error = tuple(scalar * x - y for x, y in zip(low_ground, p))

        self.assertEqual(k00, 14)
        self.assertEqual(c_m, 12)
        self.assertEqual(transverse_norm, F(75, 7))
        self.assertEqual(scalar, F(4, 7))
        self.assertEqual(
            dot(error, error),
            k00 * k00 * transverse_norm / denominator,
        )
        self.assertEqual(dot(error, error), F(50, 7))

        # If c_M=0 but A>0, the exact minimum is k00 and occurs at s=0.
        # This branch is finite algebra, not a usable zero-preserving scalar.
        orthogonal_p = (F(1), F(0))
        orthogonal_ground = (F(0), F(2))
        orthogonal_k00 = dot(orthogonal_p, orthogonal_p)
        orthogonal_c = dot(orthogonal_ground, orthogonal_p)
        orthogonal_a = dot(orthogonal_ground, orthogonal_ground)
        self.assertEqual(orthogonal_c, 0)
        self.assertEqual(
            orthogonal_k00 * orthogonal_k00 * orthogonal_a
            / (orthogonal_k00 * orthogonal_a + orthogonal_c * orthogonal_c),
            orthogonal_k00,
        )

    def test_polynomial_interpolation_makes_the_limit_nonzero(self) -> None:
        central = F(7, 5)
        positive = (F(-2, 3), F(4, 9), F(5, 11))
        polynomial = raw_mode_polynomial(central, positive)
        count = len(positive)
        self.assertEqual(
            polynomial[0],
            F((-1) ** count) * F(1 * 2 * 3) ** 2 * central,
        )
        for mode, coefficient in enumerate(positive, start=1):
            value = F(0)
            x = F(mode * mode)
            for entry in reversed(polynomial):
                value = value * x + entry
            # Evaluate the factorial identity without floating arithmetic.
            left_factor = 1
            for integer in range(1, count - mode + 1):
                left_factor *= integer
            right_factor = 1
            for integer in range(1, count + mode + 1):
                right_factor *= integer
            expected = F((-1) ** (count - mode) * left_factor * right_factor) * coefficient
            self.assertEqual(value, expected)
        self.assertNotEqual(polynomial, (F(0),))

    def test_note_retains_source_conventions_and_claim_boundary(self) -> None:
        text = " ".join(NOTE.read_text(encoding="utf-8").split())
        required = (
            "0.3)",
            "a_n^{(\\varepsilon)}=a_n-\\varepsilon",
            "b_n^{(\\varepsilon)}=b_n-\\varepsilon n",
            "\\beta_\\varepsilon",
            "(Q_\\varepsilon)_-=Q_-",
            "P_E\\eta",
            "p_{x_\\varepsilon}\\longrightarrow p_x",
            "Z(\\widehat x)\\subset\\mathbb R\\cup i\\mathbb R",
            "F_j(z)=4\\rho_j\\widehat X_j(z)",
            "e^{-izt}",
            "L=2\\log\\lambda",
            "[-lambda,lambda]",
            "Lebesgue measure",
            "zero extension",
            "1<k<=lambda^2",
            "source equation (3.19)",
            "P0_INVALIDATED",
            "no zeta-zero table",
            "no global Weil positivity",
            "no RH proof",
            "no new Lambda bound",
            "equation (5.2)",
            "locally uniformly",
            "does not select the prolate-aligned vector",
            "finite source-Cauchy/displacement-class auxiliary",
            "fixed `N`",
            "simple lowest even eigenvalue",
            "p_x(y)=y^2+1",
            "k_{00}^2A",
            "|\\alpha|^{-1}=\\lambda^{o(1)}",
            "commutator (1.4) and its vector `beta` are unchanged",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, text)


if __name__ == "__main__":
    unittest.main()
