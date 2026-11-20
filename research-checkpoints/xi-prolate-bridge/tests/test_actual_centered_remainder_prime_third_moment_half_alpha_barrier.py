#!/usr/bin/env python3
"""Exact regressions for the prime third-moment half-alpha barrier.

All mathematical fixtures use integers and Fraction.  The verifier reads no
zero table, sampled prime orbit, cached matrix, or network resource.
"""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
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
    / "ACTUAL_CENTERED_REMAINDER_PRIME_THIRD_MOMENT_HALF_ALPHA_BARRIER.md"
)
NOTE_HASH = "0d9a8326abe3752e2cdaf13333c7e768816a1d0d3773df998842b1333d313287"

FROZEN = {
    "notes/ACTUAL_PHASE_VOLUME_CENTERED_PNT_REMAINDER_REDUCTION_BARRIER.md":
        "2b2a40a4ec087c77145b45fc54d8a5782a85ecd122b2d599d2c2d8a067b714f1",
    "tests/test_actual_phase_volume_centered_pnt_remainder_reduction_barrier.py":
        "7fbcdf15dde20d3d2a00303f74d5441ee143af74ae269992fe79b1fb0c97456f",
    "notes/ACTUAL_CENTERED_REMAINDER_PRIME_FOURTH_MOMENT_LOWER_BARRIER.md":
        "920b6434cc89c663ae95f6f7803780cd164e99b8e5cdc82c2de1a3655171035a",
    "tests/test_actual_centered_remainder_prime_fourth_moment_lower_barrier.py":
        "de1e282b5106d0dc3ecb95a19773433baff029f1ff7cb5c45229e86374696fe7",
}

Gaussian = tuple[F, F]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def positive_part(value: F) -> F:
    return max(F(0), value)


def gadd(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] + right[0], left[1] + right[1]


def gsub(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] - right[0], left[1] - right[1]


def gmul(left: Gaussian, right: Gaussian) -> Gaussian:
    return (
        left[0] * right[0] - left[1] * right[1],
        left[0] * right[1] + left[1] * right[0],
    )


def gscale(value: Gaussian, scalar: F) -> Gaussian:
    return scalar * value[0], scalar * value[1]


def gconj(value: Gaussian) -> Gaussian:
    return value[0], -value[1]


def gnorm2(value: Gaussian) -> F:
    return value[0] * value[0] + value[1] * value[1]


class ActualCenteredRemainderPrimeThirdMomentHalfAlphaBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 4)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_prime_semiprime_support_and_weighted_identity(self) -> None:
        primes = (2, 3, 5, 7)
        coefficients = {
            2: F(2, 3),
            3: F(3, 5),
            5: F(5, 7),
            7: F(7, 11),
        }
        convolution: dict[int, F] = {}
        for left in primes:
            for right in primes:
                product = left * right
                convolution[product] = (
                    convolution.get(product, F(0))
                    + coefficients[left] * coefficients[right]
                )

        self.assertTrue(set(primes).isdisjoint(convolution))
        weighted = sum(
            (F(index) * value * value for index, value in convolution.items()),
            F(0),
        )
        prime_weights = {
            prime: F(prime) * coefficients[prime] * coefficients[prime]
            for prime in primes
        }
        first = sum(prime_weights.values(), F(0))
        second = sum((value * value for value in prime_weights.values()), F(0))
        self.assertEqual(weighted, 2 * first * first - second)
        self.assertLessEqual(weighted, 2 * first * first)

    def test_four_phase_complex_polarization_is_exact(self) -> None:
        left = (
            (F(2, 3), F(-3, 5)),
            (F(5, 7), F(7, 11)),
            (F(-11, 13), F(13, 17)),
        )
        right = (
            (F(17, 19), F(19, 23)),
            (F(-23, 29), F(29, 31)),
            (F(31, 37), F(-37, 41)),
        )
        imaginary_unit = (F(0), F(1))
        inner = (F(0), F(0))
        for l_value, r_value in zip(left, right):
            inner = gadd(inner, gmul(l_value, gconj(r_value)))

        plus = sum((gnorm2(gadd(l_value, r_value)) for l_value, r_value in zip(left, right)), F(0))
        minus = sum((gnorm2(gsub(l_value, r_value)) for l_value, r_value in zip(left, right)), F(0))
        plus_i = sum(
            (
                gnorm2(gadd(l_value, gmul(imaginary_unit, r_value)))
                for l_value, r_value in zip(left, right)
            ),
            F(0),
        )
        minus_i = sum(
            (
                gnorm2(gsub(l_value, gmul(imaginary_unit, r_value)))
                for l_value, r_value in zip(left, right)
            ),
            F(0),
        )
        polarized = (plus - minus, plus_i - minus_i)
        self.assertEqual(polarized, gscale(inner, F(4)))

    def test_mv_error_constant_survives_polarization(self) -> None:
        source_constant = F(9, 2)
        combined_weight = F(137, 31)
        errors = (
            source_constant * combined_weight,
            -source_constant * combined_weight,
            source_constant * combined_weight,
            -source_constant * combined_weight,
        )
        triangle_bound = sum((abs(value) for value in errors), F(0)) / 4
        self.assertEqual(triangle_bound, source_constant * combined_weight)
        self.assertIn(
            r"|J_x|\leq{9\pi\over2}(W_1+W_2)",
            self.normalized,
        )

    def test_real_cubic_expansion_is_exact(self) -> None:
        values = (
            (F(2, 3), F(3, 5)),
            (F(-5, 7), F(7, 11)),
            (F(11, 13), F(-13, 17)),
        )
        for value in values:
            conjugate = gconj(value)
            square = gmul(value, value)
            conjugate_square = gmul(conjugate, conjugate)
            cubic_sum = gadd(
                gadd(gmul(square, value), gscale(gmul(square, conjugate), F(3))),
                gadd(
                    gscale(gmul(value, conjugate_square), F(3)),
                    gmul(conjugate_square, conjugate),
                ),
            )
            real_part = value[0]
            self.assertEqual(gscale(cubic_sum, F(1, 8)), (real_part**3, F(0)))

        self.assertEqual(F(2) / F(8), F(1, 4))
        self.assertEqual(F(6) / F(8), F(3, 4))

    def test_normalized_moment_constants_and_uniform_integrability(self) -> None:
        s_over_l_squared = F(1, 2)
        variance_over_s = F(1, 2)
        variance_over_l_squared = s_over_l_squared * variance_over_s
        fourth_over_l_fourth = 2 * s_over_l_squared * s_over_l_squared
        normalized_fourth = fourth_over_l_fourth / (variance_over_l_squared**2)
        self.assertEqual(variance_over_l_squared, F(1, 4))
        self.assertEqual(normalized_fourth, F(8))

        for value in tuple(F(index, 3) for index in range(-30, 31)):
            for cutoff in (F(1), F(2), F(5)):
                if abs(value) > cutoff:
                    for power in (1, 2, 3):
                        self.assertLessEqual(
                            abs(value) ** power,
                            abs(value) ** 4 / cutoff ** (4 - power),
                        )

    def test_support_polynomial_contradiction_is_exact(self) -> None:
        for c_value in (F(1, 5), F(1, 2), F(7, 8)):
            a_value = -1 / c_value
            moment_expansion = c_value * (1 + a_value * a_value) + 2 * a_value
            self.assertEqual(moment_expansion, c_value - 1 / c_value)
            self.assertLess(moment_expansion, 0)

        self.assertIn(r"(c-Z)(Z-a)^2", self.normalized)
        self.assertIn(r"a=-1/c", self.normalized)

    def test_endpoint_two_point_countermodel_is_sharp(self) -> None:
        values = (F(-1), F(1))
        self.assertEqual(sum(values, F(0)) / 2, F(0))
        self.assertEqual(sum((value**2 for value in values), F(0)) / 2, F(1))
        self.assertEqual(sum((value**3 for value in values), F(0)) / 2, F(0))
        self.assertEqual(sum((value**4 for value in values), F(0)) / 2, F(1))
        self.assertEqual(
            sum((positive_part(value - 1) for value in values), F(0)) / 2,
            F(0),
        )

    def test_half_alpha_threshold_factor_is_exact(self) -> None:
        sigma_over_l = F(1, 2)
        for beta in (F(1, 10), F(1, 4), F(49, 100)):
            normalized_threshold = beta / sigma_over_l
            c_value = (normalized_threshold + 1) / 2
            self.assertEqual(normalized_threshold, 2 * beta)
            self.assertLess(normalized_threshold, c_value)
            self.assertLess(c_value, 1)
            self.assertGreater(1 - beta, F(1, 2))

    def test_positive_part_noise_inequality(self) -> None:
        values = tuple(F(index, 4) for index in range(-16, 17))
        for y_value in values:
            for w_value in values:
                for threshold in (F(0), F(1, 3), F(7, 5)):
                    self.assertGreaterEqual(
                        positive_part(y_value + w_value - threshold),
                        positive_part(y_value - threshold) - abs(w_value),
                    )

    def test_high_time_interval_and_target_scale(self) -> None:
        ratios = []
        target_ratios = []
        for index in range(4, 11):
            x_value = 4**index
            l_value = index
            interval_start = x_value * x_value
            high_cutoff = F(4 * (2**index), l_value * l_value)
            ratios.append(F(interval_start) / high_cutoff)
            target_ratios.append(F(x_value * x_value * l_value))

        self.assertTrue(all(right > left for left, right in zip(ratios, ratios[1:])))
        self.assertTrue(
            all(right > left for left, right in zip(target_ratios, target_ratios[1:]))
        )
        self.assertIn(r"x^2L =\lambda^4L", self.normalized)
        self.assertIn(r"{4\sqrt x\over L^2}=o(Ax^2)", self.normalized)

    def test_note_contract_and_fail_closed_scope(self) -> None:
        required = (
            r"x=\lambda^2,\qquad L=\log x",
            r"I_x=[Ax^2,2Ax^2]",
            r"P_x(t)=\sum_{p\leq x}a_pp^{it}",
            r"\mathbb E_x(P_x^2\overline {P_x})=O_A(L^2)",
            r"\mathbb E_xY_x^3=O_A(L^2)=o(L^3)",
            r"\mathbb E_xZ_x^4\leq8+o(1)",
            r"\liminf_{j\to\infty}\mathbb E(Z_j-c)_+>0",
            r"{q_x\over\sigma_x}\longrightarrow2\beta",
            r"\mathfrak R_{\lambda,\alpha}",
            r"\mathfrak R^{\rm hi}_{\lambda,\alpha}",
            "no lower bound for the actual phase volume",
            "Nothing is proved here for `0<alpha<=1/2`",
            "RH proof or converse",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.normalized)

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn("TO_BE_FROZEN", self.text)
        self.assertNotIn("proves RH", self.text)
        self.assertNotIn("\r", self.text)
        self.assertNotIn("\t", self.text)
        self.assertIsNone(re.search(r"[ \t]+$", self.text, flags=re.MULTILINE))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

        for path in (NOTE, Path(__file__)):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
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

    def test_verifier_has_no_binary_float_literals(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="utf-8"))
        floats = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(floats, [])


if __name__ == "__main__":
    unittest.main()
