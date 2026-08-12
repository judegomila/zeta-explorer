#!/usr/bin/env python3
"""Pure exact regressions for the fixed-lambda Galerkin alignment no-go."""

from __future__ import annotations

from fractions import Fraction
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FIXED_LAMBDA_GALERKIN_ALIGNMENT_NO_GO.md"
F = Fraction

Vector = tuple[Fraction, ...]
Matrix = tuple[tuple[Fraction, ...], ...]
Polynomial = tuple[Fraction, ...]


def harmonic(index: int) -> Fraction:
    return sum((F(1, term) for term in range(1, index + 1)), F(0))


def dot(left: Vector, right: Vector) -> Fraction:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


def diagonal_matrix(diagonal: tuple[Fraction, ...]) -> Matrix:
    return tuple(
        tuple(value if row == column else F(0) for column in range(len(diagonal)))
        for row, value in enumerate(diagonal)
    )


def matrix_subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x - y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def rank_one(left: Vector, right: Vector) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def scale_matrix(scalar: Fraction, matrix: Matrix) -> Matrix:
    return tuple(tuple(scalar * value for value in row) for row in matrix)


def low_anchor_complement_projector(vector: Vector) -> Matrix:
    norm_squared = dot(vector, vector)
    identity = diagonal_matrix(tuple(F(1) for _ in vector))
    return matrix_subtract(
        identity,
        scale_matrix(F(1) / norm_squared, rank_one(vector, vector)),
    )


def polynomial_multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    out = [F(0) for _ in range(len(left) + len(right) - 1)]
    for i, left_value in enumerate(left):
        for j, right_value in enumerate(right):
            out[i + j] += left_value * right_value
    return tuple(out)


def diagonal_characteristic(diagonal: tuple[Fraction, ...]) -> Polynomial:
    """Return product_j (diagonal_j-z), in ascending powers of z."""
    out: Polynomial = (F(1),)
    for value in diagonal:
        out = polynomial_multiply(out, (value, F(-1)))
    return out


def stable_shell_diagonal(
    count: int,
    *,
    shift: Fraction,
    epsilon: Fraction,
    high_gap: Fraction,
) -> tuple[Fraction, ...]:
    return (
        shift,
        shift + epsilon,
        *(shift + high_gap + harmonic(shell) for shell in range(2, count + 1)),
    )


def multiple_shell_diagonal(
    count: int,
    *,
    shift: Fraction,
    high_gap: Fraction,
) -> tuple[Fraction, ...]:
    return (
        shift,
        shift,
        *(shift + high_gap + harmonic(shell) for shell in range(2, count + 1)),
    )


def raw_diagonal_cauchy(shell_diagonal: tuple[Fraction, ...]) -> Matrix:
    count = len(shell_diagonal) - 1
    modes = tuple(range(-count, count + 1))
    return tuple(
        tuple(
            shell_diagonal[abs(mode)] if mode == other else F(0)
            for other in modes
        )
        for mode in modes
    )


def odd_shell_diagonal_from_raw(matrix: Matrix) -> tuple[Fraction, ...]:
    """Extract <e_n^-,Qe_n^-> without using the even shell list."""
    count = (len(matrix) - 1) // 2
    return tuple(
        matrix[count + shell][count + shell]
        - matrix[count + shell][count - shell]
        for shell in range(1, count + 1)
    )


class FixedLambdaGalerkinAlignmentNoGoTests(unittest.TestCase):
    def setUp(self) -> None:
        self.shift = F(-7, 3)
        self.epsilon = F(5, 11)
        self.high_gap = F(9, 7)
        self.c = F(3, 5)
        self.s = F(4, 5)

    def assert_exact_zero_cauchy_and_inversion(
        self,
        shell_diagonal: tuple[Fraction, ...],
    ) -> None:
        matrix = raw_diagonal_cauchy(shell_diagonal)
        count = len(shell_diagonal) - 1
        modes = tuple(range(-count, count + 1))
        for row, mode in enumerate(modes):
            for column, other in enumerate(modes):
                expected_cauchy = (
                    F(0)
                    if mode == other
                    else (F(0) - F(0)) / F(mode - other)
                )
                if mode != other:
                    self.assertEqual(matrix[row][column], expected_cauchy)
                self.assertEqual(matrix[row][column], matrix[column][row])
                self.assertEqual(
                    matrix[row][column],
                    matrix[2 * count - row][2 * count - column],
                )

    def test_exact_finite_sections_and_boundary_determinant(self) -> None:
        for count in (2, 3, 5, 8):
            with self.subTest(count=count):
                even = stable_shell_diagonal(
                    count,
                    shift=self.shift,
                    epsilon=self.epsilon,
                    high_gap=self.high_gap,
                )
                self.assert_exact_zero_cauchy_and_inversion(even)
                raw = raw_diagonal_cauchy(even)
                odd = odd_shell_diagonal_from_raw(raw)

                # For a diagonal even block, adj(Q_+-zI)e_0 has only its
                # central component; the boundary pairing is this product.
                boundary_adjugate = diagonal_characteristic(even[1:])
                odd_determinant = diagonal_characteristic(odd)
                self.assertEqual(boundary_adjugate, odd_determinant)

                self.assertEqual(even[0], self.shift)
                self.assertTrue(all(value > self.shift for value in even[1:]))
                self.assertEqual(sum(value == self.shift for value in even), 1)

    def test_stable_family_has_exact_residual_signs_and_alignment(self) -> None:
        kappa: Vector = (self.c, self.s)
        transverse: Vector = (-self.s, self.c)
        self.assertEqual(dot(kappa, kappa), 1)
        self.assertEqual(dot(transverse, transverse), 1)
        self.assertEqual(dot(kappa, transverse), 0)

        expected_q = self.shift + F(16, 25) * self.epsilon
        expected_r = F(12, 25) * self.epsilon
        expected_d = F(16, 25) * self.epsilon
        expected_active_even = F(9, 25) * self.epsilon

        for count in (2, 4, 7, 11):
            with self.subTest(count=count):
                even_diagonal = stable_shell_diagonal(
                    count,
                    shift=self.shift,
                    epsilon=self.epsilon,
                    high_gap=self.high_gap,
                )
                low_matrix = diagonal_matrix(even_diagonal[:2])
                q = dot(kappa, matvec(low_matrix, kappa))
                residual = tuple(
                    value - q * anchor
                    for value, anchor in zip(matvec(low_matrix, kappa), kappa)
                )

                self.assertEqual(q, expected_q)
                self.assertEqual(
                    residual,
                    tuple(expected_r * value for value in transverse),
                )
                self.assertEqual(expected_d / expected_r, F(4, 3))
                self.assertEqual(q - self.shift, expected_d)
                self.assertEqual(
                    expected_d * expected_active_even,
                    expected_r * expected_r,
                )

                shifted_low = diagonal_matrix((F(0), self.epsilon))
                self.assertEqual(
                    dot(transverse, matvec(shifted_low, transverse)),
                    expected_active_even,
                )
                high_even_values = tuple(
                    value - self.shift for value in even_diagonal[2:]
                )
                odd_values = tuple(
                    value - self.shift for value in even_diagonal[1:]
                )
                self.assertTrue(all(value > 0 for value in high_even_values))
                self.assertEqual(min(odd_values), self.epsilon)

                x: Vector = (F(1) / self.c, F(0))
                self.assertEqual(dot(kappa, x), 1)
                projected_transverse = tuple(
                    ground - anchor for ground, anchor in zip(x, kappa)
                )
                self.assertEqual(
                    dot(projected_transverse, projected_transverse),
                    F(16, 9),
                )

                # The anchor and ground use only shells zero and one, so the
                # same exact A holds for every 1<=M<=N.
                for low_cutoff in range(1, count + 1):
                    with self.subTest(count=count, low_cutoff=low_cutoff):
                        self.assertEqual(
                            dot(projected_transverse, projected_transverse),
                            F(16, 9),
                        )

    def test_harmonic_tail_is_exactly_unbounded_and_logarithmic_scale(self) -> None:
        previous = harmonic(1)
        for index in range(2, 129):
            current = harmonic(index)
            self.assertEqual(current - previous, F(1, index))
            self.assertGreater(current, previous)
            previous = current

        # Exact dyadic block estimates: each block (2^(j-1),2^j] contributes
        # between 1/2 and 1.  Thus H_n is unbounded on logarithmic scale
        # without reading a floating-point logarithm.
        for exponent in range(1, 11):
            value = harmonic(2**exponent)
            self.assertGreaterEqual(value, F(1) + F(exponent, 2))
            self.assertLessEqual(value, F(1) + exponent)

        for count in (4, 8, 16, 32):
            diagonal = stable_shell_diagonal(
                count,
                shift=self.shift,
                epsilon=self.epsilon,
                high_gap=self.high_gap,
            )
            self.assertGreater(diagonal[-1], diagonal[-2])
            self.assertGreaterEqual(
                diagonal[-1] - self.shift - self.high_gap,
                F(1) + F((count.bit_length() - 1), 2),
            )

    def test_multiple_family_has_persistent_two_dimensional_even_bottom(self) -> None:
        for count in (1, 2, 3, 6, 10):
            with self.subTest(count=count):
                even = multiple_shell_diagonal(
                    count,
                    shift=self.shift,
                    high_gap=self.high_gap,
                )
                self.assert_exact_zero_cauchy_and_inversion(even)
                self.assertEqual(even[0], self.shift)
                self.assertEqual(even[1], self.shift)
                self.assertEqual(sum(value == self.shift for value in even), 2)
                self.assertTrue(all(value > self.shift for value in even[2:]))

                # The determinant identity persists with the repeated bottom.
                self.assertEqual(
                    diagonal_characteristic(even[1:]),
                    diagonal_characteristic(
                        odd_shell_diagonal_from_raw(raw_diagonal_cauchy(even))
                    ),
                )

    def test_exact_schur_kernel_and_harmonic_lift(self) -> None:
        # B=I-phi*phi^T/<phi,phi> is positive semidefinite with the
        # simple kernel phi=(1,2,3).  The first two coordinates are low.
        phi: Vector = (F(1), F(2), F(3))
        norm_squared = dot(phi, phi)
        shifted = matrix_subtract(
            diagonal_matrix((F(1), F(1), F(1))),
            scale_matrix(F(1) / norm_squared, rank_one(phi, phi)),
        )
        self.assertEqual(matvec(shifted, phi), (F(0), F(0), F(0)))

        low_block: Matrix = (
            (shifted[0][0], shifted[0][1]),
            (shifted[1][0], shifted[1][1]),
        )
        coupling: Vector = (shifted[0][2], shifted[1][2])
        high = shifted[2][2]
        self.assertGreater(high, 0)
        schur = matrix_subtract(
            low_block,
            scale_matrix(F(1) / high, rank_one(coupling, coupling)),
        )
        self.assertEqual(
            schur,
            ((F(4, 5), F(-2, 5)), (F(-2, 5), F(1, 5))),
        )

        visible_ground: Vector = (F(1), F(2))
        self.assertEqual(matvec(schur, visible_ground), (F(0), F(0)))
        self.assertEqual(dot(visible_ground, matvec(schur, visible_ground)), 0)
        nonaligned: Vector = (F(1), F(1))
        self.assertEqual(dot(nonaligned, matvec(schur, nonaligned)), F(1, 5))

        tail = -dot(coupling, visible_ground) / high
        self.assertEqual(tail, F(3))
        self.assertEqual(
            matvec(shifted, (*visible_ground, tail)),
            (F(0), F(0), F(0)),
        )

        trial: Vector = (F(3), F(-1))
        trial_tail = -dot(coupling, trial) / high
        lift: Vector = (*trial, trial_tail)
        self.assertEqual(
            dot(lift, matvec(shifted, lift)),
            dot(trial, matvec(schur, trial)),
        )

    def test_exact_form_tail_and_ritz_gap_inequalities(self) -> None:
        # The unit ground is phi=(3/5,4/5,0).  Projecting onto coordinates
        # zero and two gives a nontrivial ordinary and shifted-form tail.
        shifted: Matrix = (
            (F(112, 25), F(-84, 25), F(0)),
            (F(-84, 25), F(63, 25), F(0)),
            (F(0), F(0), F(7)),
        )
        phi: Vector = (F(3, 5), F(4, 5), F(0))
        visible: Vector = (F(3, 5), F(0), F(0))
        tail: Vector = (F(0), F(4, 5), F(0))
        normalized_visible: Vector = (F(1), F(0), F(0))
        self.assertEqual(dot(phi, phi), 1)
        self.assertEqual(matvec(shifted, phi), (F(0), F(0), F(0)))

        visible_energy = dot(visible, matvec(shifted, visible))
        tail_energy = dot(tail, matvec(shifted, tail))
        self.assertEqual(visible_energy, tail_energy)

        tail_norm_squared = dot(tail, tail)
        rayleigh_excess = tail_energy / (1 - tail_norm_squared)
        self.assertEqual(rayleigh_excess, F(112, 25))

        infinite_gap = F(7)
        finite_gap = F(7) - rayleigh_excess
        self.assertEqual(finite_gap, F(63, 25))
        sine_squared = 1 - dot(normalized_visible, phi) ** 2
        self.assertEqual(sine_squared, F(16, 25))
        self.assertLessEqual(sine_squared * finite_gap, rayleigh_excess)

    def test_low_anchor_projector_is_exactly_normalization_invariant(self) -> None:
        visible_anchor: Vector = (F(2), F(-3), F(5))
        reference = low_anchor_complement_projector(visible_anchor)
        for scale in (F(3, 7), F(-11, 5), F(19, 13)):
            with self.subTest(scale=scale):
                scaled = tuple(scale * value for value in visible_anchor)
                self.assertEqual(low_anchor_complement_projector(scaled), reference)
                self.assertEqual(matvec(reference, scaled), (F(0), F(0), F(0)))

    def test_note_locks_source_conventions_theorem_and_claim_boundary(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        required = (
            "Fixed-lambda Galerkin alignment no-go",
            "arXiv:2511.22755v1",
            "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
            "L=2\\log\\lambda",
            "I_\\lambda=[-L/2,L/2]",
            "e^{-izt}",
            "Lebesgue measure, zero extension",
            "minus sign on the prime block in source equation (3.19)",
            "1<n<=lambda^2",
            "Q_\\lambda=D_a+B_\\lambda",
            "a_n=\\log|n|+O_\\lambda(1)",
            "has compact resolvent",
            "Theorem 2.1 (fixed-lambda Ritz convergence)",
            "\\mu_{k,N}\\downarrow\\mu_k",
            "A_{M,N}=\\|P_{\\mathcal L_{M,N}}x_N\\|^2",
            "F_M(\\mu)=P(Q_+-\\mu I)P",
            "A_{M,\\infty}=0",
            "Quantitative finite-to-infinite error theorem",
            "shifted-form tail identity",
            "exactly independent of `N`",
            "|A_{M,N}-A_{M,\\infty}|\\leq{3D_N\\over c}",
            "large `N` only removes Galerkin error",
            "={16\\over9}",
            "multiplicity exactly two",
            "not the pinned arithmetic Weil matrix",
            "No zero table and no assumption of global Weil positivity",
            "no locally uniform limit to `Xi`",
            "no equation (5.2)",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, normalized)

        forbidden = ("RH_" + "PROVED", "CERT" + "IFIED")
        for token in forbidden:
            with self.subTest(token=token):
                self.assertNotIn(token, text)


if __name__ == "__main__":
    unittest.main()
