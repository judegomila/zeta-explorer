#!/usr/bin/env python3
"""Exact regressions for the centered-remainder fourth-moment lower barrier.

The verifier uses only integers and Fraction for mathematical fixtures.  It
reads no zero table, sampled prime orbit, cached matrix, or network resource.
"""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
import json
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
    / "ACTUAL_CENTERED_REMAINDER_PRIME_FOURTH_MOMENT_LOWER_BARRIER.md"
)
NOTE_HASH = "920b6434cc89c663ae95f6f7803780cd164e99b8e5cdc82c2de1a3655171035a"

FROZEN = {
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "vendor/FKS-PNT-2204.02588v3.pdf":
        "15eff02042f2c1ab4878d029ce52a0abd6c95d66995b183a2dbc689ce9af49a4",
    "notes/ACTUAL_PHASE_VOLUME_CENTERED_PNT_REMAINDER_REDUCTION_BARRIER.md":
        "2b2a40a4ec087c77145b45fc54d8a5782a85ecd122b2d599d2c2d8a067b714f1",
    "tests/test_actual_phase_volume_centered_pnt_remainder_reduction_barrier.py":
        "7fbcdf15dde20d3d2a00303f74d5441ee143af74ae269992fe79b1fb0c97456f",
    "notes/NATURAL_OUTER_SHELL_LARGE_SIEVE_INVERSE_SPREAD_BARRIER.md":
        "79be0448f5e144819ee9eb2e249021c3c5ffe44949a58b75002e2a117c1b85da",
    "tests/test_natural_outer_shell_large_sieve_inverse_spread_barrier.py":
        "e65c890a6f97def68b48825ccb8c3148926c744cd77f27754fb7790534dbabf8",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def positive_part(value: F) -> F:
    return max(F(0), value)


class ActualCenteredRemainderPrimeFourthMomentLowerBarrierTests(
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

    def test_p3_lock_is_duplicate_free_and_binds_fks(self) -> None:
        payload = (ROOT / "P3_SOURCE_LOCK.json").read_text(encoding="ascii")

        def reject_duplicates(pairs: list[tuple[str, object]]) -> dict[str, object]:
            result: dict[str, object] = {}
            for key, value in pairs:
                self.assertNotIn(key, result)
                result[key] = value
            return result

        parsed = json.loads(payload, object_pairs_hook=reject_duplicates)
        source = parsed["binding_sources"][0]
        self.assertEqual(source["id"], "FKS-PNT-v3")
        self.assertEqual(
            source["vendored_sha256"],
            FROZEN["vendor/FKS-PNT-2204.02588v3.pdf"],
        )
        bound = parsed["locked_formulas"]["source_bound"]
        self.assertIn("9.22022", bound)
        self.assertIn("0.8476836", bound)

    def test_montgomery_vaughan_spacing_constant_is_exact(self) -> None:
        source_constant = F(3)
        inverse_gap_factor = F(3, 2)
        self.assertEqual(source_constant * inverse_gap_factor, F(9, 2))
        for integer in range(2, 200):
            self.assertLessEqual(integer + 1, F(3 * integer, 2))

        required = (
            "H. L. Montgomery and R. C. Vaughan",
            "https://doi.org/10.1112/jlms/s2-8.1.73",
            "s2-8-1-73.pdf",
            "Corollary 2, equations (1.8)--(1.9)",
            r"{9\pi\over2}\sum_n n|c_n|^2",
            "external and unvendored",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_prime_square_convolution_diagonal_identity(self) -> None:
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

        diagonal = sum((value * value for value in convolution.values()), F(0))
        square_sum = sum((value * value for value in coefficients.values()), F(0))
        fourth_sum = sum((value**4 for value in coefficients.values()), F(0))
        self.assertEqual(diagonal, 2 * square_sum * square_sum - fourth_sum)

    def test_weighted_prime_square_error_identity(self) -> None:
        primes = (2, 3, 5, 7)
        coefficients = {
            2: F(1, 2),
            3: F(2, 3),
            5: F(3, 5),
            7: F(4, 7),
        }
        convolution: dict[int, F] = {}
        for left in primes:
            for right in primes:
                product = left * right
                convolution[product] = (
                    convolution.get(product, F(0))
                    + coefficients[left] * coefficients[right]
                )

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

    def test_holder_constant_and_alpha_threshold_are_exact(self) -> None:
        # Squaring the idealized Holder quotient gives
        # ((S/2)^3)/(2*S^2)=S/16.  Passing to the positive part costs
        # another factor four, and S~L^2/2 gives c_*^2=1/128.
        holder_squared_over_s = F(1, 16)
        positive_squared_over_s = holder_squared_over_s / 4
        c_star_squared = positive_squared_over_s / 2
        self.assertEqual(c_star_squared, F(1, 128))

        beta = F(1, 16)
        self.assertLess(beta * beta, c_star_squared)
        self.assertEqual(1 - beta, F(15, 16))
        self.assertIn(r"c_*={1\over8\sqrt2}", self.normalized)
        self.assertIn(r"1-c_*<\alpha<1", self.normalized)

    def test_proper_prime_power_diagonal_is_uniformly_bounded(self) -> None:
        for prime in (2, 3, 5, 7, 11):
            partial = sum((F(1, prime**power) for power in range(2, 9)), F(0))
            full = F(1, prime * (prime - 1))
            self.assertLess(partial, full)

        self.assertIn(
            r"Q_\infty:=\sum_p{(\log p)^2\over p(p-1)}<\infty",
            self.normalized,
        )

    def test_positive_part_noise_and_threshold_inequality(self) -> None:
        values = tuple(F(index, 4) for index in range(-20, 21))
        for y_value in values:
            for z_value in values:
                for threshold in (F(0), F(1, 3), F(5, 4)):
                    left = positive_part(y_value + z_value - threshold)
                    middle = positive_part(y_value - threshold) - abs(z_value)
                    right = positive_part(y_value) - threshold - abs(z_value)
                    self.assertGreaterEqual(left, middle)
                    self.assertGreaterEqual(middle, right)

    def test_high_time_interval_and_target_scale_separate(self) -> None:
        # Use x=4^n and L=n as an exact algebraic model of the powers.
        ratios = []
        target_ratios = []
        for index in range(4, 11):
            x_value = 4**index
            l_value = index
            interval_start = x_value * x_value
            # x is a perfect square, so avoid any binary approximation.
            high_cutoff = F(4 * (2**index), l_value * l_value)
            ratios.append(F(interval_start, 1) / high_cutoff)
            target_ratios.append(F(x_value * l_value * l_value))

        self.assertTrue(all(right > left for left, right in zip(ratios, ratios[1:])))
        self.assertTrue(
            all(right > left for left, right in zip(target_ratios, target_ratios[1:]))
        )
        self.assertIn(r"{4\sqrt x\over L^2}=o(Ax^2)", self.normalized)
        self.assertIn(r"\lambda^2L^2\longrightarrow\infty", self.normalized)

    def test_second_fourth_moments_do_not_force_all_alpha(self) -> None:
        l_value = F(2)
        s_value = l_value * l_value / 2
        values = (F(-1), F(1))
        mean = sum(values, F(0)) / 2
        second = sum((value * value for value in values), F(0)) / 2
        fourth = sum((value**4 for value in values), F(0)) / 2
        threshold = l_value / 2
        excess = sum(
            (positive_part(value - threshold) for value in values),
            F(0),
        ) / 2

        self.assertEqual(mean, F(0))
        self.assertEqual(second, s_value / 2)
        self.assertLessEqual(fourth, 2 * s_value * s_value)
        self.assertEqual(excess, F(0))

    def test_note_contract_and_fail_closed_scope(self) -> None:
        required = (
            r"x=\lambda^2,\qquad L=\log x",
            r"I_x=[T,2T]",
            r"T=Ax^2",
            r"S_x=\sum_{p\leq x}a_p^2",
            r"\mathbb E_xY_x^2=\left({1\over2}+o(1)\right)S_x",
            r"\mathbb E_xY_x^4\leq\left(2+o(1)\right)S_x^2",
            r"\mathbb E_x(Y_x)_+",
            r"\mathfrak R_{\lambda,\alpha}",
            r"\mathfrak R^{\rm hi}_{\lambda,\alpha}",
            r"{\mathfrak R_{\lambda,\alpha}\over\lambda^4L}",
            "does not give a lower bound for the actual phase volume",
            "proves no failure for",
            "moment-method countermodel",
            "no RH proof or converse",
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
