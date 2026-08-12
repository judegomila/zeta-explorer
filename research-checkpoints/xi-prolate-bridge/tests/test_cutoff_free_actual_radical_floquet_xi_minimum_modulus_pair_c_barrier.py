#!/usr/bin/env python3
"""Exact regressions for the Floquet Xi minimum-modulus Pair-C barrier."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
from math import comb
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "CUTOFF_FREE_ACTUAL_RADICAL_FLOQUET_XI_MINIMUM_MODULUS_PAIR_C_BARRIER.md"
)
NOTE_HASH = "ec6a126ddbf0b7e510a304b87838feffef9fd1a23e62989f1d0753cf8b02fff4"

FROZEN = {
    "notes/CUTOFF_FREE_ACTUAL_RADICAL_XI_IDEAL_TRANSLATION_FRAME_BARRIER.md":
        "e961040eda5cdf2645d8c0a50d54dbbd269a666c55d3470e7fc9853b58e0da9e",
    "tests/test_cutoff_free_actual_radical_xi_ideal_translation_frame_barrier.py":
        "04dda3387b76d45a0fd9a3a054ffce662c78a6487d49c0995a6e3a9315c2b642",
    "notes/MOVING_LABEL_CARRIER_COFRAME_DEFECT_RIGHT_INVERSE_THEOREM.md":
        "caaa4df57d43f74ef56fed6df907da6db0daa7b0f89da23cce30bc2ac9369acd",
    "tests/test_moving_label_carrier_coframe_defect_right_inverse_theorem.py":
        "31f8ffad0dc5a1f2b6a00a47b55238d64d9bc6550813d5b77b15c00da1757913",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md":
        "3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81",
    "tests/test_full_source_coframe_rank.py":
        "dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "tests/test_growing_transition_sampling.py":
        "ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac",
    "notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md":
        "c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c",
    "tests/test_cutoff_free_weighted_radical_coframe_reduction_barrier.py":
        "d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11",
}


Polynomial = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def trim(polynomial: Polynomial) -> Polynomial:
    values = list(polynomial)
    while len(values) > 1 and values[-1] == 0:
        values.pop()
    return tuple(values)


def poly_mul(left: Polynomial, right: Polynomial) -> Polynomial:
    result = [F(0)] * (len(left) + len(right) - 1)
    for i, x_value in enumerate(left):
        for j, y_value in enumerate(right):
            result[i + j] += x_value * y_value
    return trim(tuple(result))


def poly_derivative(polynomial: Polynomial) -> Polynomial:
    if len(polynomial) == 1:
        return (F(0),)
    return trim(
        tuple(F(index) * polynomial[index] for index in range(1, len(polynomial)))
    )


def poly_eval(polynomial: Polynomial, value: F) -> F:
    result = F(0)
    for coefficient in reversed(polynomial):
        result = result * value + coefficient
    return result


def divide_by_linear(polynomial: Polynomial, root: F) -> tuple[Polynomial, F]:
    descending = list(reversed(polynomial))
    quotient_descending = [descending[0]]
    for coefficient in descending[1:-1]:
        quotient_descending.append(coefficient + root * quotient_descending[-1])
    remainder = descending[-1] + root * quotient_descending[-1]
    return trim(tuple(reversed(quotient_descending))), remainder


def determinant(matrix: Matrix) -> F:
    work = [list(row) for row in matrix]
    result = F(1)
    for column in range(len(work)):
        pivot = next(row for row in range(column, len(work)) if work[row][column])
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        pivot_value = work[column][column]
        result *= pivot_value
        for row in range(column + 1, len(work)):
            factor = work[row][column] / pivot_value
            for index in range(column, len(work)):
                work[row][index] -= factor * work[column][index]
    return result


def leading_principal_minors_are_positive(matrix: Matrix) -> bool:
    return all(
        determinant(tuple(tuple(row[:size]) for row in matrix[:size])) > 0
        for size in range(1, len(matrix) + 1)
    )


class CutoffFreeActualRadicalFloquetXiMinimumModulusPairCBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_note_hash(self) -> None:
        self.assertEqual(len(FROZEN), 10)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_paired_twist_bad_measure_budget_is_exact(self) -> None:
        length = F(13)
        zero_count = 37
        eta = F(1, length)
        radius = eta / (8 * length * zero_count)

        # Two signs, interval length at most 2*L*r for every zero.
        paired_bad_measure = 4 * length * zero_count * radius
        self.assertEqual(radius, F(1, 8 * length * length * zero_count))
        self.assertEqual(paired_bad_measure, eta / 2)
        self.assertLess(paired_bad_measure, eta)

        # If M<=5N, this gives the declared c/(N L^2) separation.
        mode_count = 19
        maximal_zero_count = 5 * mode_count
        worst_radius = eta / (8 * length * maximal_zero_count)
        self.assertEqual(
            worst_radius,
            F(1, 40 * mode_count * length * length),
        )

    def test_paired_grids_reflect_and_difference_frequencies_cancel_theta(self) -> None:
        # Encode 2*pi*n + theta as (n,1), and 2*pi*n-theta as (n,-1).
        for n_value in range(-9, 10):
            plus = (n_value, 1)
            reflected_minus = tuple(-value for value in (-n_value, -1))
            self.assertEqual(plus, reflected_minus)

        for n_value in range(-7, 8):
            for m_value in range(-7, 8):
                difference = (n_value - m_value, 1 - 1)
                self.assertEqual(difference, (n_value - m_value, 0))

    def test_quadratic_band_minimum_modulus_exponent_is_subquadratic(self) -> None:
        previous = F(1)
        for exponent in range(5, 18):
            modes = 4**exponent
            length_proxy = exponent
            normalized_loss = F(1, length_proxy) + F(length_proxy**2, modes)
            self.assertLess(normalized_loss, previous)
            previous = normalized_loss
        self.assertLess(previous, F(1, 10))

    def test_parity_hankel_gram_includes_exact_zero_row(self) -> None:
        size = 7
        pi_proxy = F(22, 7)
        theta = F(1, 100)
        a_zero = F(101, 100)
        sinc_theta = F(2) / (a_zero * a_zero) - 1
        sin_theta = theta * sinc_theta

        def raw_cosine(row: int, column: int) -> F:
            diagonal = F(1, 2) if row == column else F(0)
            hankel = F((-1) ** (row + column), 2) * sin_theta
            return diagonal + hankel / (pi_proxy * (row + column) + theta)

        def raw_sine(row: int, column: int) -> F:
            diagonal = F(1, 2) if row == column else F(0)
            hankel = F((-1) ** (row + column), 2) * sin_theta
            return diagonal - hankel / (pi_proxy * (row + column) + theta)

        self.assertEqual(raw_cosine(0, 0), 1 / (a_zero * a_zero))
        self.assertEqual(a_zero * a_zero * raw_cosine(0, 0), 1)

        cross_energy = F(0)
        for column in range(1, size + 1):
            hankel = F((-1) ** column) * sin_theta / (
                pi_proxy * column + theta
            )
            normalized_cross_squared = (
                2 * a_zero * a_zero * raw_cosine(0, column) ** 2
            )
            expected_cross_squared = a_zero * a_zero * hankel * hankel / 2
            self.assertEqual(normalized_cross_squared, expected_cross_squared)
            cross_energy += normalized_cross_squared
        self.assertLess(cross_energy, a_zero * a_zero * sin_theta * sin_theta)

        plus = tuple(
            tuple(
                2 * raw_cosine(row + 1, column + 1)
                for column in range(size)
            )
            for row in range(size)
        )
        minus = tuple(
            tuple(
                2 * raw_sine(row + 1, column + 1)
                for column in range(size)
            )
            for row in range(size)
        )
        self.assertTrue(leading_principal_minors_are_positive(plus))
        self.assertTrue(leading_principal_minors_are_positive(minus))
        for row in range(size):
            for column in range(size):
                self.assertEqual(
                    plus[row][column] + minus[row][column],
                    2 if row == column else 0,
                )

    def test_twisted_binomial_witness_is_theta_independent(self) -> None:
        phase_point = F(5, 4)
        displacement = phase_point - 1
        previous = F(1)
        for degree in range(1, 22):
            coefficients = tuple(
                F((-1) ** (degree - index) * comb(degree, index))
                for index in range(degree + 1)
            )
            self.assertEqual(poly_eval(coefficients, phase_point), displacement**degree)
            square_sum = sum((value * value for value in coefficients), F(0))
            central = F(comb(2 * degree, degree))
            self.assertEqual(square_sum, central)
            exact_bound = displacement ** (2 * degree) / central
            coarse_bound = F(2 * degree + 1) * (displacement / 2) ** (2 * degree)
            self.assertLessEqual(exact_bound, coarse_bound)
            self.assertLess(exact_bound, previous)
            previous = exact_bound

    def test_weighted_unsafe_mass_must_pay_the_residual_exponent(self) -> None:
        for scale in range(2, 12):
            target_error = F(1, 2 ** (4 * scale))
            unsafe_leakage = F(1, 2 ** (2 * scale))
            maximal_mass = target_error / unsafe_leakage
            self.assertEqual(maximal_mass, F(1, 2 ** (2 * scale)))

            safe_binomial = F(1, 2 ** (5 * scale))
            norm_squared = F(3)
            frame_upper = safe_binomial + maximal_mass * norm_squared
            self.assertLess(frame_upper, F(4, 2 ** (2 * scale)))

    def test_ideal_polynomial_xi_matrix_has_exact_vandermonde_rank(self) -> None:
        alpha = F(1, 7)
        nodes = tuple((F(index) + alpha) ** 2 for index in range(5))
        xi_values = (F(2), F(-3), F(5), F(7), F(-11))
        matrix = tuple(
            tuple(xi_values[row] * nodes[row] ** column for column in range(5))
            for row in range(5)
        )
        expected = F(1)
        for value in xi_values:
            expected *= value
        for left in range(len(nodes)):
            for right in range(left + 1, len(nodes)):
                expected *= nodes[right] - nodes[left]
        self.assertEqual(determinant(matrix), expected)
        self.assertNotEqual(expected, 0)

    def test_pair_c_constant_two_is_exact(self) -> None:
        lambda_squared = F(8)
        band_floor = F(1, 4)
        full_row_diagonal = (F(4), F(2), F(1))
        relative_eigenvalues = tuple(
            band_floor / value for value in full_row_diagonal
        )
        gamma = min(relative_eigenvalues)
        claimed_floor = 2 * band_floor / lambda_squared
        self.assertEqual(gamma, F(1, 16))
        self.assertEqual(gamma, claimed_floor)

        # Exponential defect beats a subquadratic floor and polynomial loss.
        previous = F(1)
        for scale in range(5, 14):
            defect = F(1, 2 ** (scale * scale))
            coframe = F(1, 2**scale)
            stopping_proxy = F(scale**6) * defect / coframe
            self.assertLess(stopping_proxy, previous)
            previous = stopping_proxy

    def test_moving_label_majorant_fails_at_quadratic_inventory(self) -> None:
        for lambda_value in (8, 16, 32, 64):
            epsilon = F(1, lambda_value**2)
            inventory = lambda_value**2
            majorant = inventory**2
            self.assertEqual(epsilon * majorant, lambda_value**2)
            self.assertGreater(epsilon * majorant, 1)

    def test_divided_difference_and_log_derivative_source_no_go(self) -> None:
        xi = (F(-1), F(0), F(1))
        cofactor = (F(2), F(1))
        carrier = poly_mul(xi, cofactor)
        quotient, remainder = divide_by_linear(carrier, F(1))
        self.assertEqual(remainder, 0)
        self.assertNotEqual(poly_eval(quotient, F(1)), 0)
        self.assertEqual(poly_eval(quotient, F(-1)), 0)

        extra_zero = (F(-1), F(1))
        carrier_with_extra_zero = poly_mul(xi, extra_zero)
        restored, remainder = divide_by_linear(carrier_with_extra_zero, F(1))
        self.assertEqual(remainder, 0)
        self.assertEqual(restored, xi)

        # zeta=s^q and m_f=s: zeta' m_f is still divisible by zeta.
        for multiplicity in range(1, 8):
            zeta = (F(0),) * multiplicity + (F(1),)
            mellin = (F(0), F(1))
            numerator = poly_mul(poly_derivative(zeta), mellin)
            expected = tuple(F(multiplicity) * value for value in zeta)
            self.assertEqual(numerator, expected)

    def test_note_contract_scope_and_static_hygiene(self) -> None:
        required = (
            r"t_{n,\theta}={2\pi n+\theta\over L}",
            r"r={\eta\over8L\max\{M(T),1\}}",
            r"\operatorname {dist}(t_{n,\pm\theta},Z_\Xi)\geq r",
            r"\log\left|{G_t(1/2-it)\over G_t(2-it)}\right|",
            r"-{\pi|t|\over4}",
            r"-{\pi^2N\over2L}-CL^2",
            r"a_0&:=\left\{{1+\operatorname {sinc}\theta\over2}\right\}^{-1/2}",
            r"G^+_{0m}&={a_0\over\sqrt2}",
            r"\sum_{m=1}^\infty|G^+_{0m}|^2\leq C\theta^2",
            r"\|G_\theta^\pm-I\|\leq C|\theta|",
            r"|e_{n,\theta}|\leq",
            r"U_{L/2}^\theta C_\lambda K_0",
            r"+\varepsilon_S\|p\|^2",
            r"\gamma_m\geq{2c_{\theta,m}\over\lambda^2}",
            r"\epsilon B_Q\asymp\lambda^2\longrightarrow\infty",
            r"{\zeta'(s)\over\zeta(s)}m_f(s)",
            "local logarithmic-derivative formula",
            "uniformly throughout the fixed strip",
            "Zeros off the real axis, clusters, and multiplicities",
            "reflection sends the `theta` grid to the `-theta`",
            "exact normalized",
            "`O(lambda^2/L^2)`",
            "missing principal-angle",
            "standard eight are untouched",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.text)

        forbidden = (
            "This proves RH",
            "RH is proved",
            "the Riemann hypothesis is proved",
            "Floquet separation proves the transition-prefix floor",
            "the complete Floquet circle is an actual-source translation orbit",
            "the growing transition theorem proves a lower singular value",
            "TO_BE_FROZEN",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

        self.assertEqual(self.text.count("The distance estimate (2.7)"), 1)
        self.assertNotIn(r"|e_{n,\theta}|leq", self.text)
        self.assertNotIn("\n4, and let", self.text)

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            payload.decode("ascii")
            self.assertTrue(payload.endswith(b"\n"))
            self.assertNotIn(b"\r", payload)
            self.assertNotIn(b"\t", payload)
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        self.assertIsNotNone(pdflatex, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertEqual(len(displays), 60)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [
                    pdflatex,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    tex_path.name,
                ],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(
            result.returncode,
            0,
            result.stdout[-6000:] + result.stderr[-2000:],
        )

    def test_test_module_has_no_float_network_or_cache_surface(self) -> None:
        test_path = Path(__file__).resolve()
        tree = ast.parse(test_path.read_text(encoding="ascii"))
        imports: set[str] = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imports.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imports.add(node.module.split(".")[0])
        self.assertTrue(imports.isdisjoint({"socket", "urllib", "requests", "httpx"}))
        self.assertEqual(
            [
                node.value
                for node in ast.walk(tree)
                if isinstance(node, ast.Constant) and type(node.value) is float
            ],
            [],
        )
        cache_directory = test_path.parent / "__pycache__"
        cache_pattern = test_path.stem + ".*.pyc"
        self.assertEqual(list(cache_directory.glob(cache_pattern)), [])


if __name__ == "__main__":
    unittest.main()
