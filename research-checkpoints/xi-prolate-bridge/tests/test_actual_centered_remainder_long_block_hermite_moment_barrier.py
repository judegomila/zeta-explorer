#!/usr/bin/env python3
"""Strict regressions for the long-block Hermite moment barrier.

All mathematical fixtures use integers, ``Fraction``, or exact quadratic
field pairs.  The verifier reads no zero table, prime-orbit sample, cached
matrix, or network resource.
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


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / (
    "ACTUAL_CENTERED_REMAINDER_LONG_BLOCK_HERMITE_MOMENT_BARRIER.md"
)
NOTE_HASH = "1997f8b14c5f90977f744788d069f6e771da078c06562dac2d78c671c01a95c1"

FROZEN = {
    "notes/ACTUAL_PHASE_VOLUME_CENTERED_PNT_REMAINDER_REDUCTION_BARRIER.md":
        "2b2a40a4ec087c77145b45fc54d8a5782a85ecd122b2d599d2c2d8a067b714f1",
    "tests/test_actual_phase_volume_centered_pnt_remainder_reduction_barrier.py":
        "7fbcdf15dde20d3d2a00303f74d5441ee143af74ae269992fe79b1fb0c97456f",
    "notes/ACTUAL_CENTERED_REMAINDER_PRIME_FOURTH_MOMENT_LOWER_BARRIER.md":
        "920b6434cc89c663ae95f6f7803780cd164e99b8e5cdc82c2de1a3655171035a",
    "tests/test_actual_centered_remainder_prime_fourth_moment_lower_barrier.py":
        "de1e282b5106d0dc3ecb95a19773433baff029f1ff7cb5c45229e86374696fe7",
    "notes/ACTUAL_CENTERED_REMAINDER_PRIME_THIRD_MOMENT_HALF_ALPHA_BARRIER.md":
        "0d9a8326abe3752e2cdaf13333c7e768816a1d0d3773df998842b1333d313287",
    "tests/test_actual_centered_remainder_prime_third_moment_half_alpha_barrier.py":
        "acf9f91fd1dd8b76adee84eeaa22ba42dfb05b6c70282aaa04eb88dc509499d9",
}

Quadratic = tuple[F, F]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def positive_part(value: F) -> F:
    return max(F(0), value)


def qadd(left: Quadratic, right: Quadratic) -> Quadratic:
    return left[0] + right[0], left[1] + right[1]


def qneg(value: Quadratic) -> Quadratic:
    return -value[0], -value[1]


def qsub(left: Quadratic, right: Quadratic) -> Quadratic:
    return qadd(left, qneg(right))


def qmul(left: Quadratic, right: Quadratic, radicand: F) -> Quadratic:
    return (
        left[0] * right[0] + radicand * left[1] * right[1],
        left[0] * right[1] + left[1] * right[0],
    )


def qinv(value: Quadratic, radicand: F) -> Quadratic:
    norm = value[0] * value[0] - radicand * value[1] * value[1]
    return value[0] / norm, -value[1] / norm


def qdiv(left: Quadratic, right: Quadratic, radicand: F) -> Quadratic:
    return qmul(left, qinv(right, radicand), radicand)


def qscale(value: Quadratic, scalar: F) -> Quadratic:
    return scalar * value[0], scalar * value[1]


def qpow(value: Quadratic, power: int, radicand: F) -> Quadratic:
    result = (F(1), F(0))
    for _ in range(power):
        result = qmul(result, value, radicand)
    return result


def hermite_values(point: F, degree: int) -> tuple[F, ...]:
    values = [F(1)]
    if degree == 0:
        return tuple(values)
    values.append(point)
    for index in range(1, degree):
        values.append(point * values[-1] - index * values[-2])
    return tuple(values)


class ActualCenteredRemainderLongBlockHermiteMomentBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 6)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_prime_convolution_weighted_energy_bound(self) -> None:
        coefficients = {
            2: F(2, 3),
            3: F(3, 5),
            5: F(5, 7),
            7: F(7, 11),
        }
        prime_weight = sum(
            (F(prime) * value * value for prime, value in coefficients.items()),
            F(0),
        )
        convolution = {1: F(1)}
        for power in range(1, 5):
            next_convolution: dict[int, F] = {}
            for index, value in convolution.items():
                for prime, coefficient in coefficients.items():
                    product = index * prime
                    next_convolution[product] = (
                        next_convolution.get(product, F(0))
                        + value * coefficient
                    )
            convolution = next_convolution
            weighted = sum(
                (
                    F(index) * value * value
                    for index, value in convolution.items()
                ),
                F(0),
            )
            self.assertLessEqual(
                weighted,
                math.factorial(power) * prime_weight**power,
            )

    def test_unique_factorization_diagonal_constants(self) -> None:
        # The real 2r-th moment coefficient is C(2r,r) r! / 2^(2r).
        # Dividing by (S/2)^r gives the Gaussian double factorial.
        expected = {1: 1, 2: 3, 3: 15, 4: 105}
        for r_value, gaussian_moment in expected.items():
            leading = F(
                math.comb(2 * r_value, r_value) * math.factorial(r_value),
                2 ** (2 * r_value),
            )
            normalized = leading / F(1, 2) ** r_value
            self.assertEqual(normalized, gaussian_moment)

        weights = tuple(F(index, index + 3) for index in range(1, 7))
        total = sum(weights, F(0))
        repeated_upper = sum((value * value for value in weights), F(0))
        self.assertLess(repeated_upper, total * total)
        self.assertIn(r"D_{r,x}=r!S_x^r+O_r", self.normalized)

    def test_scaled_mv_exponents_close_through_degree_two_k(self) -> None:
        k_value = 4
        for total_degree in range(1, 2 * k_value + 1):
            x_exponent = F(total_degree, 2) - k_value
            self.assertLessEqual(x_exponent, 0)
            self.assertLess(F(total_degree, 2), total_degree)

        fixed_block_fifth_exponent = F(5, 2) - 2
        self.assertEqual(fixed_block_fifth_exponent, F(1, 2))
        required = (
            r"x^{(a+b)/2-k}L^{(a+b)/2}",
            r"x^{d/2-k}",
            r"O_A(x^{1/2}L^{5/2})",
            r"O_A(x^{1/2})",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_probabilists_hermite_four_root_is_exact(self) -> None:
        # He_4(z)=z^4-6z^2+3.  Work in Q(sqrt(6)).
        radicand = F(6)
        root_squared = (F(3), F(1))
        value = qadd(
            qsub(
                qmul(root_squared, root_squared, radicand),
                qscale(root_squared, F(6)),
            ),
            (F(3), F(0)),
        )
        self.assertEqual(value, (F(0), F(0)))

        # rho_4>7/3 is exactly sqrt(6)>22/9.
        self.assertGreater(F(6), F(22, 9) ** 2)
        self.assertLess(F(7, 12), F(3 + 1, 4))
        self.assertIn(r"\rho_4=\sqrt{3+\sqrt6}", self.normalized)

    def test_quantitative_localizer_interpolation_exponent(self) -> None:
        for k_value in range(2, 9):
            p_value = 2 * k_value - 1
            theta = (
                F(1, p_value) - F(1, 2 * k_value)
            ) / (
                F(1) - F(1, 2 * k_value)
            )
            self.assertEqual(theta, F(1, p_value * p_value))
            exponent_on_l1 = p_value * theta
            exponent_on_top_moment = F(p_value, 2 * k_value) * (1 - theta)
            self.assertEqual(exponent_on_l1, F(1, p_value))
            self.assertEqual(
                exponent_on_top_moment,
                F(2 * k_value - 2, 2 * k_value - 1),
            )

        required = (
            r"(c-Z_n)q_k(Z_n)^2",
            r"u_n^{1/(2k-1)}",
            r"\liminf_{n\to\infty}\mathbb E(Z_n-c)_+>0",
            "u_n>=delta_(k,c)>0",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_k_four_is_exact_global_optimum_for_integer_hierarchy(self) -> None:
        terminal = {
            5: F(1668275, 248832),
            6: F(7909, 64),
            7: F(64809846913, 35831808),
            8: F(172479769, 6561),
            9: F(105568243893, 262144),
            10: F(400539571026805, 60466176),
        }
        for k_value, expected in terminal.items():
            values = hermite_values(F(7 * k_value, 12), k_value)
            self.assertTrue(all(value > 0 for value in values))
            self.assertEqual(values[-1], expected)

        # For k>=11, 2*sqrt(k-1)<7k/12 follows after squaring.
        margin_at_eleven = 49 * 11 * 11 - 576 * (11 - 1)
        self.assertGreater(margin_at_eleven, 0)
        for k_value in range(11, 101):
            margin = 49 * k_value * k_value - 576 * (k_value - 1)
            next_margin = 49 * (k_value + 1) ** 2 - 576 * k_value
            self.assertGreater(margin, 0)
            self.assertGreater(next_margin, margin)

        self.assertLess(F(1, 2), F(7, 12))
        self.assertLess(F(1, 3), F(49, 144))
        self.assertGreater(F(6), F(484, 81))
        self.assertIn(
            r"\sup_{k\geq2}{\rho_k\over k}"
            r" ={\sqrt{3+\sqrt6}\over4}",
            self.normalized,
        )
        self.assertIn(
            "only for the integer translated-block",
            self.text,
        )

    def test_below_half_alpha_threshold_and_long_block_scale(self) -> None:
        beta = F(7, 12)
        alpha = 1 - beta
        self.assertEqual(alpha, F(5, 12))
        self.assertLess(alpha, F(1, 2))
        self.assertGreater(F(6), F(22, 9) ** 2)
        self.assertEqual(4 * beta, F(7, 3))

        ratios = []
        for index in range(4, 10):
            x_value = 4**index
            l_value = index
            block_start = x_value**4
            high_cutoff = F(4 * (2**index), l_value * l_value)
            ratios.append(F(block_start) / high_cutoff)
        self.assertTrue(all(right > left for left, right in zip(ratios, ratios[1:])))
        self.assertIn(r"x^kL", self.normalized)
        self.assertIn(r"\lambda^8L", self.normalized)
        self.assertIn(r"{4\sqrt x\over L^2}=o(Ax^k)", self.normalized)

    def test_positive_part_noise_transfer_is_exact(self) -> None:
        values = tuple(F(index, 3) for index in range(-12, 13))
        for prime_value in values:
            for noise in values:
                for threshold in (F(0), F(2, 3), F(5, 2)):
                    self.assertGreaterEqual(
                        positive_part(prime_value + noise - threshold),
                        positive_part(prime_value - threshold) - abs(noise),
                    )
        self.assertIn(r"=O_{A,k}(T_k)", self.normalized)
        self.assertIn("prime positive excess of order `T_k L`", self.text)

    def test_exact_fourth_moment_sharpens_to_three(self) -> None:
        absolute_fourth_over_s_squared = F(2)
        real_coefficient = F(6, 16)
        real_fourth_over_s_squared = (
            real_coefficient * absolute_fourth_over_s_squared
        )
        variance_over_s = F(1, 2)
        normalized = real_fourth_over_s_squared / variance_over_s**2
        self.assertEqual(real_fourth_over_s_squared, F(3, 4))
        self.assertEqual(normalized, F(3))
        self.assertIn(
            r"{\mathbb E_{x,2}Y_x^4\over\sigma_{x,2}^4}"
            r" \longrightarrow3",
            self.normalized,
        )

    def test_three_atom_gaussian_radau_countermeasure_is_exact(self) -> None:
        c_value = F(3, 2)
        d_value = c_value * c_value - 1
        radicand = c_value**4 - 3 * c_value**2 + 3
        one = (F(1), F(0))
        d_root = (F(0), F(1))
        c_element = (c_value, F(0))

        r_minus = qscale(qsub(qneg(c_element), d_root), 1 / d_value)
        r_plus = qscale(qadd(qneg(c_element), d_root), 1 / d_value)
        w_c = (F(2, 1) / (c_value**4 + 3), F(0))
        c_d = qscale(d_root, c_value)
        w_minus = qdiv(
            qscale(qsub(c_d, one), d_value),
            qscale(qadd((c_value**3, F(0)), d_root), F(2)),
            radicand,
        )
        w_minus = qdiv(w_minus, d_root, radicand)
        w_plus = qdiv(
            qscale(qadd(c_d, one), d_value),
            qscale(qsub((c_value**3, F(0)), d_root), F(2)),
            radicand,
        )
        w_plus = qdiv(w_plus, d_root, radicand)

        nodes = (r_minus, r_plus, c_element)
        weights = (w_minus, w_plus, w_c)
        expected = (F(1), F(0), F(1), F(0), F(3))
        for power, target in enumerate(expected):
            moment = (F(0), F(0))
            for weight, node in zip(weights, nodes):
                moment = qadd(
                    moment,
                    qmul(weight, qpow(node, power, radicand), radicand),
                )
            self.assertEqual(moment, (target, F(0)))

        self.assertEqual(c_value**2 * radicand - 1, d_value**3)
        self.assertEqual(
            c_value**6 - radicand,
            d_value * (c_value**4 + 3),
        )

    def test_endpoint_countermeasure_excess_tends_to_zero(self) -> None:
        excesses = []
        for denominator in (2, 4, 8, 16, 32, 64):
            c_value = 1 + F(1, denominator)
            excess = 2 * (c_value - 1) / (c_value**4 + 3)
            excesses.append(excess)
            self.assertLess(excess, F(1, denominator))
        self.assertTrue(
            all(right < left for left, right in zip(excesses, excesses[1:]))
        )
        self.assertIn(r"\mathbb E(Z_j-1)_+", self.normalized)
        self.assertIn("no Paley--Zygmund variant", self.text)

    def test_note_contract_and_fail_closed_scope(self) -> None:
        required = (
            r"I_{x,k}=[Ax^k,2Ax^k]",
            r"k(1-\alpha)<\rho_k",
            r"\mathfrak R_{\lambda,\alpha}",
            r"\mathfrak R^{\rm hi}_{\lambda,\alpha}",
            r"\gg_{A,\alpha,k}x^kL",
            r"1-{\sqrt{3+\sqrt6}\over4}",
            r"\mathbb E_{x,k}Z_{x,k}^j",
            r"(j-1)!!",
            r"h(t)={1\over2}\log(1+4t^2)=kL+O_A(1)",
            r"\mathbb E_{x,k}|H_x|^2=Q_x+o(1)",
            r"r_\pm={-c\pm D\over d}",
            "three-node Gaussian--Radau formula",
            "weighted shifted almost-prime correlation",
            "does not reach every positive `alpha`",
            "one-way",
            "no dangerous-projector capture",
            "RH proof or converse",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.normalized)

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn("TO_BE_FROZEN", self.text)
        self.assertNotIn("}^{,", self.text)
        self.assertNotIn("proves RH", self.text)
        self.assertNotIn("\r", self.text)
        self.assertNotIn("\t", self.text)
        self.assertIsNone(re.search(r"[ \t]+$", self.text, flags=re.MULTILINE))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

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

    def test_static_ascii_ast_hash_and_cache_clean(self) -> None:
        test_path = Path(__file__)
        tree = ast.parse(test_path.read_text(encoding="ascii"))
        floats = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(floats, [])

        for path in (NOTE, test_path):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

        cache_entries = [
            path
            for path in ROOT.rglob("*")
            if path.name == "__pycache__" or path.suffix in {".pyc", ".pyo"}
        ]
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main()
