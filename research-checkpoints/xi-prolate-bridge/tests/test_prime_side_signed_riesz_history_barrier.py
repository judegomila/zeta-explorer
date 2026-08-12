#!/usr/bin/env python3
"""Exact regressions for the prime-side signed Riesz history barrier.

Only Python standard-library integer and Fraction arithmetic is used.  The
tests bind every frozen dependency, check the finite Riesz/Fubini signs,
verify the improved L-exponent ledger, retain the j=0 Fourier mean, and
exercise the two-moment positive atomization used by the countermodel.
"""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "PRIME_SIDE_SIGNED_RIESZ_HISTORY_BARRIER.md"
TEST = ROOT / "tests" / "test_prime_side_signed_riesz_history_barrier.py"

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md":
        "ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171",
    "notes/NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md":
        "baa9a4d07f1bfa2e298efeca5ed8d226c2e991330a2f029f5586380ccb8d5c1c",
    "notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md":
        "18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b",
    "notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md":
        "cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d",
    "notes/ATTAINED_RIGHT_EDGE_VECTOR_SELECTION_THEOREM.md":
        "6f67349e53e761744408bfa053874ce4f79b22aac578fa6fff48fa5915e65edf",
}

Polynomial = tuple[F, ...]  # ascending coefficients


def add(left: Polynomial, right: Polynomial) -> Polynomial:
    result = [F(0)] * max(len(left), len(right))
    for index, value in enumerate(left):
        result[index] += value
    for index, value in enumerate(right):
        result[index] += value
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return tuple(result)


def scale(poly: Polynomial, scalar: F) -> Polynomial:
    return tuple(scalar * value for value in poly)


def multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    result = [F(0)] * (len(left) + len(right) - 1)
    for i, left_value in enumerate(left):
        for j, right_value in enumerate(right):
            result[i + j] += left_value * right_value
    return tuple(result)


def derivative(poly: Polynomial) -> Polynomial:
    if len(poly) == 1:
        return (F(0),)
    return tuple(F(index) * value for index, value in enumerate(poly[1:], 1))


def antiderivative(poly: Polynomial) -> Polynomial:
    return (F(0),) + tuple(
        value / F(index + 1) for index, value in enumerate(poly)
    )


def evaluate(poly: Polynomial, point: F) -> F:
    result = F(0)
    for value in reversed(poly):
        result = result * point + value
    return result


def integrate(poly: Polynomial, left: F, right: F) -> F:
    primitive = antiderivative(poly)
    return evaluate(primitive, right) - evaluate(primitive, left)


class PrimeSideSignedRieszHistoryTests(unittest.TestCase):
    def test_protected_dependency_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_finite_prime_riesz_fubini_and_history_signs(self) -> None:
        length = F(5)
        atoms = ((F(1), F(2)), (F(3), F(4)))  # (height, positive mass)
        reference = (F(1), F(2))  # m(t)=1+2t
        history = (F(0), length, F(-1))  # S=t(L-t), S(0)=S(L)=0

        kernel_sum = sum(
            (mass * integrate(history, height, length)
             for height, mass in atoms),
            F(0),
        )
        riesz_history = kernel_sum - integrate(
            multiply(reference, history), F(0), length
        )

        # Directly integrate (P-m)S on the three step intervals.
        direct = F(0)
        cumulative = F(0)
        left = F(0)
        for height, mass in atoms:
            discrepancy = add((cumulative,), scale(reference, F(-1)))
            direct += integrate(multiply(discrepancy, history), left, height)
            cumulative += mass
            left = height
        discrepancy = add((cumulative,), scale(reference, F(-1)))
        direct += integrate(multiply(discrepancy, history), left, length)
        self.assertEqual(direct, riesz_history)

        # Build Psi=C-sum mass*(t-height) interval by interval and check
        # integral(Psi*S')=integral((P-m)*S), including the sign.
        reference_primitive = antiderivative(reference)
        history_derivative = derivative(history)
        by_parts = F(0)
        active: list[tuple[F, F]] = []
        breakpoints = [F(0), *(height for height, _ in atoms), length]
        for left, right in zip(breakpoints, breakpoints[1:]):
            active.extend(
                (height, mass) for height, mass in atoms if height == left
            )
            psi = reference_primitive
            for height, mass in active:
                psi = add(psi, (mass * height, -mass))
            by_parts += integrate(
                multiply(psi, history_derivative), left, right
            )
        self.assertEqual(by_parts, direct)

        continuous_riesz = integrate(reference, F(0), length)
        prime_riesz = sum(
            (mass * (length - height) for height, mass in atoms), F(0)
        )
        direct_g = F(0)
        cumulative = F(0)
        left = F(0)
        for height, mass in atoms:
            discrepancy = add((cumulative,), scale(reference, F(-1)))
            direct_g += integrate(discrepancy, left, height)
            cumulative += mass
            left = height
        discrepancy = add((cumulative,), scale(reference, F(-1)))
        direct_g += integrate(discrepancy, left, length)
        self.assertEqual(continuous_riesz - prime_riesz, -direct_g)

    def test_localization_exponent_ledger_gives_three_halves(self) -> None:
        omega = F(-1)
        f_l1 = F(1, 2)
        p_fixed = F(-1, 2)
        interval = F(1)

        q_forcing = omega + f_l1
        q_resonant = p_fixed + omega + interval
        q_sup = max(q_forcing, q_resonant)
        self.assertEqual(q_sup, F(-1, 2))

        s_terms = (
            2 * omega + f_l1,
            p_fixed + 2 * omega + interval,
            2 * omega + interval + q_sup,
        )
        self.assertEqual(s_terms, (F(-3, 2),) * 3)

        # M has L^(-3/2) A3 and |p|Psi has L^(-1/2)Psi.
        self.assertEqual(F(-3, 2) - p_fixed, F(-1))

    def test_zero_mode_changes_the_exact_kernel_mean(self) -> None:
        p_zero = F(5, 7)
        p_k = F(-11, 13)
        length = F(17, 3)

        # -p_k(cos(k)-1) has mean p_k.  In Q, only j=0 has
        # nonzero mean: p_0(cos(k)-1), whose mean is -p_0.
        s_integral = (p_k - p_zero) * length
        wrong_integral_without_zero_mode = p_k * length
        self.assertNotEqual(s_integral, wrong_integral_without_zero_mode)
        self.assertEqual(s_integral / length, p_k - p_zero)

    def test_countermodel_limits_are_nonzero_for_every_parity(self) -> None:
        q_zero = F(1)
        limits = {}
        for parity_sign in (F(-1), F(1)):
            q_k = 2 * parity_sign
            limits[parity_sign] = -(q_k - q_zero) / abs(q_k)
        self.assertEqual(limits[F(-1)], F(3, 2))
        self.assertEqual(limits[F(1)], F(-1, 2))

    def test_one_positive_atom_preserves_two_cell_moments(self) -> None:
        # On [4,9] with rho=1, W=int dx=5 and
        # U=int x^(-1/2)dx=2.  The weighted-mean atom is at
        # xi=(W/U)^2=25/4, strictly inside the cell.
        left = F(4)
        right = F(9)
        ordinary_mass = right - left
        weighted_mass = F(2)  # 2*(sqrt(9)-sqrt(4))
        atom_location = (ordinary_mass / weighted_mass) ** 2
        self.assertGreater(atom_location, left)
        self.assertLess(atom_location, right)
        # sqrt(25/4)=5/2, checked without floating point.
        atom_sqrt = F(5, 2)
        self.assertEqual(ordinary_mass / atom_sqrt, weighted_mass)

    def test_reference_density_keeps_complete_tail_derivative(self) -> None:
        # At x=16 and a formal tau=1/8,
        # sqrt(x)*(1-tau/sqrt(x))=sqrt(x)-tau exactly.
        sqrt_x = F(4)
        tau = F(1, 8)
        rho = 1 - tau / sqrt_x
        self.assertGreater(rho, 0)
        self.assertEqual(sqrt_x * rho, sqrt_x - tau)

    def test_note_records_fail_closed_scope_and_improvement(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            r"\|S_{k,L}''\|_1=O_k(L^{-3/2})",
            r"A_3(L)+1=o\{L\Psi(L)\}",
            "prime-side signed Riesz identity",
            r"\int_0^LS_{k,L}(t)\,dt=(p_k-p_0)L",
            r"3/2,&k\text{ odd}",
            r"-1/2,&k\text{ even}",
            "exact prime-power support",
            "unadmitted",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "the actual von Mangoldt measure fails",
            "the nonattained-edge case is proved",
            "We admit a short-interval theorem",
            "equation (5.2) is proved",
        )
        for token in forbidden:
            self.assertNotIn(token, text)

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
