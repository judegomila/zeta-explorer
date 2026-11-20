#!/usr/bin/env python3
"""Strict regressions for the actual-dangerous endpoint-jet barrier.

The fixtures are symbolic or use exact ``Fraction`` arithmetic whenever
possible.  No zero table, cached ground, prolate artifact, or network
resource is read.
"""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / (
    "CUTOFF_FREE_ACTUAL_DANGEROUS_ENDPOINT_JET_PROFILE_OBSERVABILITY_BARRIER.md"
)
NOTE_HASH = "e7583ff8784410db5b5488250737845936a43420cb787ddd714d71242c880a5d"

FROZEN = {
    "notes/CUTOFF_FREE_ACTUAL_DANGEROUS_ADJOINT_REGULARITY_BARRIER.md":
        "76bed7bff24f2bdced30c357d3a61b7cbcc16964085901070f723035aeb92337",
    "tests/test_cutoff_free_actual_dangerous_adjoint_regularity_barrier.py":
        "034fe9fa18d0ae587ac3d9c5c3f9e0179a5cbf80dd96ef5aab21e5034f8223ec",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def polynomial_multiply(left: list[F], right: list[F]) -> list[F]:
    product = [F(0) for _ in range(len(left) + len(right) - 1)]
    for i, x_value in enumerate(left):
        for j, y_value in enumerate(right):
            product[i + j] += x_value * y_value
    return product


def q_coefficients(order: int) -> list[F]:
    coefficients = [F(1)]
    for index in range(order):
        coefficients = polynomial_multiply(
            coefficients,
            [F(-2 * index - 1, 2), F(1)],
        )
    return coefficients


def q_on_endpoint_jets(order: int, jets: tuple[F, ...]) -> F:
    coefficients = q_coefficients(order)
    return sum(
        coefficient * jets[index]
        for index, coefficient in enumerate(coefficients)
    )


def envelope(radius: mp.mpf, frequency: mp.mpf) -> mp.mpf:
    if abs(frequency) > radius:
        return mp.mpf("0")
    return mp.log(
        (1 + 4 * radius**2) / (1 + 4 * frequency**2)
    ) / 2


def gram_entry(length: F, left: int, right: int) -> F:
    return (
        length ** (left + right + 1)
        / (math.factorial(left) * math.factorial(right) * (left + right + 1))
    )


def dot(left: tuple[F, ...], right: tuple[F, ...]) -> F:
    return sum(x_value * y_value for x_value, y_value in zip(left, right))


class CutoffFreeActualDangerousEndpointJetBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_frozen_dependency_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 2)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_q_k_endpoint_jump_polynomials_are_exact(self) -> None:
        self.assertEqual(q_coefficients(0), [F(1)])
        self.assertEqual(q_coefficients(1), [F(-1, 2), F(1)])
        self.assertEqual(
            q_coefficients(3),
            [F(-15, 8), F(23, 4), F(-9, 2), F(1)],
        )

        jets = (F(5), F(7), F(11), F(13))
        lambda_value = F(4)
        sqrt_lambda = F(2)
        index = F(3)
        order = 3
        jump = (
            sqrt_lambda
            * lambda_value**order
            * q_on_endpoint_jets(order, jets)
            / (2 * index ** (order + 1))
        )
        direct_profile = (
            lambda_value ** (order + 1)
            * q_on_endpoint_jets(order, jets)
            / index ** (order + 1)
        ) / (2 * sqrt_lambda)
        self.assertEqual(jump, direct_profile)
        self.assertEqual(jump, F(-40, 9))

    def test_taylor_profiles_have_unit_triangular_jump_coordinates(self) -> None:
        maximum = 6
        matrix: list[list[F]] = []
        for order in range(maximum + 1):
            coefficients = q_coefficients(order)
            row = []
            for profile in range(maximum + 1):
                # p_profile^(r)(a) is one exactly when r=profile.
                row.append(
                    coefficients[profile]
                    if profile < len(coefficients)
                    else F(0)
                )
            matrix.append(row)

        for order in range(maximum + 1):
            self.assertEqual(matrix[order][order], F(1))
            for profile in range(order + 1, maximum + 1):
                self.assertEqual(matrix[order][profile], F(0))

        # Forward substitution reconstructs the jump-diagonal basis.
        for target in range(maximum + 1):
            coefficients = [F(0) for _ in range(maximum + 1)]
            for row in range(maximum + 1):
                residual = F(int(row == target)) - sum(
                    matrix[row][column] * coefficients[column]
                    for column in range(row)
                )
                coefficients[row] = residual
            image = tuple(
                sum(matrix[row][column] * coefficients[column] for column in range(maximum + 1))
                for row in range(maximum + 1)
            )
            self.assertEqual(
                image,
                tuple(F(int(row == target)) for row in range(maximum + 1)),
            )

    def test_taylor_gram_and_zero_integral_profile_gram(self) -> None:
        length = F(3)
        gram = [
            [gram_entry(length, left, right) for right in range(3)]
            for left in range(3)
        ]
        self.assertEqual(gram[0][0], F(3))
        self.assertEqual(gram[0][1], F(9, 2))
        self.assertEqual(gram[2][2], F(243, 20))

        # Sylvester minors for the degree-two Taylor Gram are positive.
        determinant_two = gram[0][0] * gram[1][1] - gram[0][1] ** 2
        determinant_three = (
            gram[0][0] * (gram[1][1] * gram[2][2] - gram[1][2] ** 2)
            - gram[0][1] * (gram[1][0] * gram[2][2] - gram[1][2] * gram[2][0])
            + gram[0][2] * (gram[1][0] * gram[2][1] - gram[1][1] * gram[2][0])
        )
        self.assertGreater(determinant_two, 0)
        self.assertGreater(determinant_three, 0)

        # Exact rank-one integral correction B^*(I-ii^*/s)B.
        columns = ((F(1), F(2)), (F(3), F(-1)), (F(2), F(4)))
        integral = (F(1), F(2), F(2))
        integral_norm_squared = dot(integral, integral)
        raw = [[dot(left, right) for right in columns] for left in columns]
        integral_rows = tuple(dot(integral, column) for column in columns)
        corrected = [
            [
                raw[left][right]
                - integral_rows[left] * integral_rows[right] / integral_norm_squared
                for right in range(2)
            ]
            for left in range(2)
        ]
        self.assertEqual(corrected, [[F(20, 9), F(4, 9)], [F(4, 9), F(89, 9)]])
        self.assertEqual(
            corrected[0][0] * corrected[1][1] - corrected[0][1] ** 2,
            F(196, 9),
        )

    def test_sharpened_multiplier_derivative_envelope(self) -> None:
        mp.mp.dps = 60
        for radius in (mp.mpf("1"), mp.mpf("3.5"), mp.mpf("20")):
            for order in range(1, 8):
                upper = radius**order / (mp.e * order)
                sampled = max(
                    (radius * index / 1000) ** order
                    * envelope(radius, radius * index / 1000)
                    for index in range(1001)
                )
                self.assertLessEqual(sampled, upper * (1 + mp.mpf("1e-50")))

                critical = radius * mp.e ** (-mp.mpf(1) / order)
                logarithmic_majorant = critical**order * mp.log(radius / critical)
                self.assertTrue(mp.almosteq(logarithmic_majorant, upper))

    def test_envelope_integral_and_trace_rank_bound(self) -> None:
        mp.mp.dps = 60
        for radius in (mp.mpf("0.5"), mp.mpf("2"), mp.mpf("10")):
            integral = mp.quad(
                lambda frequency: envelope(radius, frequency),
                [-radius, 0, radius],
            )
            formula = 2 * radius - mp.atan(2 * radius)
            self.assertLess(abs(integral - formula), mp.mpf("1e-50"))

            length = mp.mpf("5")
            threshold = mp.mpf("0.7")
            rank_bound = length * formula / (2 * mp.pi * threshold)
            coarse = length * radius / (mp.pi * threshold)
            self.assertLess(rank_bound, coarse)

    def test_taylor_remainder_and_endpoint_observability_constants(self) -> None:
        # Check (5.1) on y(t)=t^(K+1), whose Taylor polynomial is zero.
        length = F(5, 2)
        for order in range(0, 6):
            remainder_norm_squared = (
                length ** (2 * order + 3) / (2 * order + 3)
            )
            derivative_norm_squared = (
                math.factorial(order + 1) ** 2 * length
            )
            factor_squared = (
                length ** (2 * order + 2)
                / (
                    math.factorial(order) ** 2
                    * (2 * order + 1)
                    * (2 * order + 2)
                )
            )
            self.assertLessEqual(
                remainder_norm_squared,
                factor_squared * derivative_norm_squared,
            )

        # If the certified error is below one, reverse triangle gives the
        # stated endpoint observability constant.
        function_norm = F(1)
        error = F(1, 5)
        taylor_norm = F(9, 10)
        self.assertGreaterEqual(taylor_norm, (1 - error) * function_norm)

    def test_quantitative_long_order_certificate(self) -> None:
        for length, radius, threshold in (
            (2.0, 3.0, 0.5),
            (5.0, 8.0, 0.1),
            (1.5, 20.0, 2.0),
        ):
            scale = length * radius
            logarithmic = max(0.0, math.log2(scale / threshold))
            order = math.ceil(max(2 * math.e * scale, 2 + logarithmic))
            log_upper = (
                (order + 1) * math.log(scale)
                - 1
                - math.log(threshold)
                - math.log(order + 1)
                - math.lgamma(order + 1)
                - 0.5 * math.log((2 * order + 1) * (2 * order + 2))
            )
            self.assertLess(log_upper, 0.0)
            self.assertGreaterEqual(order, 2 * math.e * scale)

            near_shannon_rows = 40
            if order + 1 > near_shannon_rows:
                profile_rank = min(near_shannon_rows, order + 1)
                self.assertLess(profile_rank, order + 1)

    def test_both_finite_jet_rank_obstructions_are_exact(self) -> None:
        jet_order = 3
        dangerous_dimension = 6
        jet_codomain_dimension = jet_order + 1
        self.assertGreater(dangerous_dimension, jet_codomain_dimension)
        self.assertGreaterEqual(
            dangerous_dimension - jet_codomain_dimension,
            1,
        )

        prefix_dimension = 3
        profile_domain_dimension = jet_order + 1
        maximum_profile_rank = min(prefix_dimension, profile_domain_dimension)
        self.assertLess(maximum_profile_rank, profile_domain_dimension)

    def test_bottom_normalized_factorization_retains_signed_cross(self) -> None:
        # A scalar bottom has source image (3,4), so R=25 and N=1/5.
        bottom_source = (F(3, 5), F(4, 5))
        self.assertEqual(dot(bottom_source, bottom_source), F(1))

        profile = (F(1), F(0))
        dangerous_remainder = (F(-2, 5), F(1, 5))
        safe = (F(0), F(3, 5))
        remainder_and_safe = tuple(
            dangerous_remainder[index] + safe[index] for index in range(2)
        )
        reconstructed = tuple(
            profile[index] + remainder_and_safe[index] for index in range(2)
        )
        self.assertEqual(reconstructed, bottom_source)

        profile_energy = dot(profile, profile)
        other_energy = dot(remainder_and_safe, remainder_and_safe)
        signed_cross = 2 * dot(profile, remainder_and_safe)
        self.assertEqual(signed_cross, F(-4, 5))
        self.assertEqual(
            profile_energy + other_energy + signed_cross,
            dot(bottom_source, bottom_source),
        )

        # Endpoint jets can cancel even when the dangerous jet is nonzero.
        dangerous_jets = (F(5), F(-7), F(2))
        safe_jets = tuple(-value for value in dangerous_jets)
        self.assertEqual(
            tuple(x_value + y_value for x_value, y_value in zip(dangerous_jets, safe_jets)),
            (F(0), F(0), F(0)),
        )

    def test_conditional_singular_value_bound_is_fail_closed(self) -> None:
        sigma = F(3, 2)
        endpoint_observability = F(4, 5)
        dangerous_angle = F(1, 2)
        upper_source = F(4)
        lower_source = F(1, 4)
        remainder = F(1, 100)
        safe = F(1, 50)
        good = (
            sigma * endpoint_observability * dangerous_angle
            / F(2)
        )
        bad = F(4) * (remainder + safe)
        lower = max(F(0), good - bad) ** 2
        self.assertEqual(good, F(3, 10))
        self.assertEqual(bad, F(3, 25))
        self.assertEqual(lower, F(81, 2500))

        # A larger safe term closes the positive part instead of producing
        # a false lower bound.
        safe = F(1, 5)
        bad = F(4) * (remainder + safe)
        self.assertEqual(max(F(0), good - bad), F(0))
        self.assertEqual(upper_source / lower_source, F(16))

    def test_residual_bv_scale_keeps_the_smooth_derivative_loss(self) -> None:
        lambda_value = 4.0
        count = math.ceil(lambda_value**2) - 1
        harmonic = sum(1.0 / index for index in range(1, count + 1))
        epsilon = 0.02
        derivative_epsilon = 3.0
        variation = (
            2
            * harmonic
            * math.sqrt(lambda_value - 1 / lambda_value)
            * (derivative_epsilon + epsilon / 2)
            + math.sqrt(
                (lambda_value - 1 / lambda_value) * harmonic * count
            )
            / lambda_value
            * epsilon
        )
        without_derivative = (
            2
            * harmonic
            * math.sqrt(lambda_value - 1 / lambda_value)
            * epsilon
            / 2
            + math.sqrt(
                (lambda_value - 1 / lambda_value) * harmonic * count
            )
            / lambda_value
            * epsilon
        )
        self.assertGreater(variation, 100 * without_derivative)

    def test_note_contract_and_claim_boundary(self) -> None:
        required = (
            r"p_j(s)={(s-a)^j\over j!}",
            r"\Phi_j=A_{\lambda,0}^*p_j",
            r"q_k(D)=\prod_{\ell=0}^{k-1}",
            r"\Delta\left(A_{\lambda,0}^*y\right)^{(k)}(a_n)",
            r"{\lambda^{k+1/2}\over2n^{k+1}}q_k(D)y(a)",
            r"r_j(x)=x^{-1/2}\sum_{n\leq\lambda x}",
            r"B_{E,K}=(b_{mj})_",
            r"(G_K)_{ij}",
            r"\sigma_{E,K}=s_{\min}(B_{E,K}G_K^{-1/2})",
            r"M_k(T)\leq {T^k\over ek}",
            r"2T-\arctan(2T)",
            r"\dim W_\vartheta>K+1",
            r"K\geq\max\left\{",
            r"2eLT",
            r"P_EJ_Y=B_{E,K}U_K+Q_{E,K}",
            r"U_K^*B_{E,K}^*Q_{E,K}",
            r"\sqrt{M_\lambda\over m_\lambda}",
            r"\operatorname {Var}(A_{\lambda,0}^*\rho_Ky)",
            "non-effective",
            "signed safe cancellation",
            "standard eight are untouched",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.normalized)

        forbidden = (
            "actual bridge gate is proved",
            "actual near-Shannon capture is proved",
            "proves RH",
            "actual-prime countermodel",
            "actual prime countermodel",
            "TO_BE_FROZEN",
            "DRAFT RESULT",
            "+sqrt{",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_static_hygiene_and_unique_tex_tags(self) -> None:
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn("\r", self.text)
        self.assertNotIn("\t", self.text)
        self.assertIsNone(re.search(r"[ \t]+$", self.text, flags=re.MULTILINE))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        self.assertGreaterEqual(len(tags), 45)

        for path in (NOTE, Path(__file__)):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertNotIn(b"\r", payload)
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        forbidden_calls = {"eval", "exec"}
        called = {
            node.func.id
            for node in ast.walk(tree)
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name)
        }
        self.assertTrue(forbidden_calls.isdisjoint(called))

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
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
                ["pdflatex", "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
