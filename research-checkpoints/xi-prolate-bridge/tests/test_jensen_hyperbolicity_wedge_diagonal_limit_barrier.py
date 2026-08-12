#!/usr/bin/env python3
"""Strict regressions for the Jensen wedge diagonal-limit barrier."""

from __future__ import annotations

import ast
import cmath
from fractions import Fraction
import hashlib
import math
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
    / "JENSEN_HYPERBOLICITY_WEDGE_DIAGONAL_LIMIT_BARRIER.md"
)
NOTE_HASH = "7462355feb9b4e41aeebeccd2b41a6e2f4ef39b7a4e85dd39657ee6a30e6e790"

SOURCE_ID = "arXiv:2608.08682v1 [math.NT]"
SOURCE_PDF_SHA256 = (
    "3fc31ba84fb113bc0b3109fb0e569bd1"
    "d7183018485aca1eb1dab565c839b49d"
)
SOURCE_PDF_BYTES = 389974

F = Fraction


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def falling(value: int, order: int) -> int:
    result = 1
    for offset in range(order):
        result *= value - offset
    return result


def derivative(coefficients: list[F], order: int = 1) -> list[F]:
    result = list(coefficients)
    for _ in range(order):
        result = [
            F(index) * result[index]
            for index in range(1, len(result))
        ]
        if not result:
            return [F(0)]
    return result


def integral_zero(coefficients: list[F]) -> list[F]:
    return [F(0)] + [
        coefficient / F(index + 1)
        for index, coefficient in enumerate(coefficients)
    ]


def jensen_coefficients(
    gamma: list[F], degree: int, shift: int
) -> list[F]:
    return [
        F(math.comb(degree, index)) * gamma[shift + index]
        for index in range(degree + 1)
    ]


def evaluate_origin_model(degree: int, shift: int, value: complex) -> complex:
    """Evaluate Q for the exact model gamma(m)=1/m! by recurrence."""
    coefficient = 1.0
    power = 1.0 + 0.0j
    total = 1.0 + 0.0j
    for index in range(degree):
        coefficient *= (
            (degree - index)
            / (degree * (index + 1))
            * (shift + 1)
            / (shift + index + 1)
        )
        power *= value
        total += coefficient * power
    return total


class JensenHyperbolicityWedgeDiagonalLimitTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_external_primary_source_pin_and_self_hash(self) -> None:
        self.assertIn(SOURCE_ID, self.text)
        self.assertIn("Jonathan Holland", self.text)
        self.assertIn("2026-08-09 12:58:52 UTC", self.text)
        self.assertIn("2026-08-03", self.text)
        self.assertIn(
            "https://arxiv.org/abs/2608.08682v1", self.text
        )
        self.assertIn(
            "https://arxiv.org/pdf/2608.08682v1", self.text
        )
        self.assertIn(str(SOURCE_PDF_BYTES), self.text)
        self.assertIn(SOURCE_PDF_SHA256, self.text)
        self.assertIn("PDF pages | `25`", self.text)
        self.assertIn("external and unvendored", self.text)
        self.assertIn("no local source lock is claimed", self.text)
        self.assertIn(
            "does not independently certify the 25-page proof",
            self.normalized,
        )
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_jensen_scaling_and_fixed_shift_coefficients(self) -> None:
        gamma = [F(index * index + 3, index + 2) for index in range(20)]
        degree = 11
        shift = 3
        for index in range(degree + 1):
            direct = (
                F(math.comb(degree, index))
                * gamma[shift + index]
                / F(degree**index)
            )
            expanded = (
                F(falling(degree, index), degree**index)
                * gamma[shift + index]
                / F(math.factorial(index))
            )
            self.assertEqual(direct, expanded)

        for index in range(8):
            weights = [
                F(falling(degree_value, index), degree_value**index)
                for degree_value in (20, 80, 320, 1280)
            ]
            self.assertLess(abs(float(weights[-1]) - 1.0), 0.03)
            self.assertTrue(all(F(0) < weight <= F(1) for weight in weights))

        required = (
            r"E(w):=\xi_{\rm c}(\sqrt w)",
            r"J^{d,n}(w/d)",
            r"\boxed{J^{d,n}(w/d)\longrightarrow E^{(n)}(w).}",
            r"E(-t^2)=\xi_{\rm c}(it)",
            r"{J^{d,0}(-t^2/d)\over\gamma(0)}",
            r"{\Xi(t)\over\Xi(0)}",
            "uses the coefficient prefix beginning at `n=0`",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_wedge_forces_extreme_shift_to_degree_ratio(self) -> None:
        ratios = [
            n ** (-2.0 / 5.0) * math.log(n + 2) ** (2.0 / 5.0)
            for n in (10**4, 10**8, 10**12, 10**16)
        ]
        self.assertTrue(
            all(left > right for left, right in zip(ratios, ratios[1:]))
        )
        self.assertLess(ratios[-1], 0.001)
        for degree in (20, 100, 500):
            shift = degree * degree
            self.assertGreaterEqual(shift**3, degree**5)
            self.assertEqual(F(degree, shift), F(1, degree))

        required = (
            r"{d\over n}",
            r"n^{-2/5}",
            r"\log^{2/5}(n+2)\longrightarrow0",
            "`d=o(n)`",
            "cannot keep `n` fixed",
            "extreme derivative regime",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_quotient_product_and_coefficient_majorant(self) -> None:
        shift = 17
        gamma = [F(1, math.factorial(index)) for index in range(40)]

        def r(index: int) -> F:
            return gamma[shift + index + 1] / gamma[shift + index]

        def q(index: int) -> F:
            return r(index) / r(index + 1)

        self.assertTrue(all(q(index) > 1 for index in range(12)))
        for order in range(2, 12):
            r_order = gamma[shift + order] / gamma[shift]
            r_one = gamma[shift + 1] / gamma[shift]
            direct = r_order / r_one**order
            product = math.prod(
                q(index) ** (-(order - 1 - index))
                for index in range(order - 1)
            )
            self.assertEqual(direct, product)
            self.assertTrue(F(0) < direct <= F(1))

        required = (
            r"q_{k,n}={r_{k,n}\over r_{k+1,n}}",
            r"0<{R_{j,n}\over R_{1,n}^j}\leq1",
            r"\prod_{k=0}^{j-2}q_{k,n}^{-(j-1-k)}",
            "For each fixed `j`",
            "Dominated convergence",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_joint_origin_model_converges_to_exponential(self) -> None:
        points = (
            -2.0 + 0.0j,
            -1.0 + 0.5j,
            0.75 - 0.75j,
            2.0 + 0.0j,
        )
        maximum_errors = []
        for degree in (40, 160, 640):
            shift = degree * degree
            errors = [
                abs(
                    evaluate_origin_model(degree, shift, point)
                    - cmath.exp(point)
                )
                for point in points
            ]
            maximum_errors.append(max(errors))
        self.assertGreater(maximum_errors[0], maximum_errors[1])
        self.assertGreater(maximum_errors[1], maximum_errors[2])
        self.assertLess(maximum_errors[-1], 0.03)

        for degree, shift in ((20, 400), (80, 6400)):
            coefficient = 1.0
            for index in range(degree):
                coefficient *= (
                    (degree - index)
                    / (degree * (index + 1))
                    * (shift + 1)
                    / (shift + index + 1)
                )
                self.assertLessEqual(
                    coefficient,
                    1.0 / math.factorial(index + 1) + 1e-15,
                )

        required = (
            "Theorem 4.1 (origin-diagonal exponential collapse)",
            r"\longrightarrow e^{cw}",
            r"\longrightarrow e^{-t^2}",
            r"c_\nu=d_\nu R_{1,n_\nu}a_\nu",
            "zero-free Gaussian",
            "not `E(w)/gamma(0)`",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_centered_semicircle_dense_zero_contradiction(self) -> None:
        counts = []
        for degree in (100, 400, 1600):
            roots = [
                -2.0 + 4.0 * (index + 0.5) / degree
                for index in range(degree)
            ]
            counts.append(sum(-0.25 < root < 0.25 for root in roots))
        self.assertEqual(counts, [12, 50, 200])

        required = (
            r"\lambda_{j,\nu}",
            r"\sqrt{n_\nu/d_\nu}",
            r"\bigl(\mu_{\rm sc}(I)+o(1)\bigr)d_\nu",
            "Theorem 5.1 (no nonzero centered entire limit)",
            "zeros of a nonzero entire function are discrete",
            "min_D |G|>0",
            "global empirical law",
            "local spacing information",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_exact_derivative_and_reconstruction_identities(self) -> None:
        degree = 7
        shift = 5
        total_degree = degree + shift
        gamma = [F(index**3 + 2 * index + 5, index + 1) for index in range(20)]
        unshifted = jensen_coefficients(gamma, total_degree, 0)
        shifted = jensen_coefficients(gamma, degree, shift)
        differentiated = derivative(unshifted, shift)
        scale = F(math.factorial(total_degree), math.factorial(degree))
        self.assertEqual(
            differentiated,
            [scale * coefficient for coefficient in shifted],
        )

        one_step_left = jensen_coefficients(gamma, degree + 1, shift)
        one_step_integral = integral_zero(
            jensen_coefficients(gamma, degree, shift + 1)
        )
        one_step_right = [gamma[shift]] + [
            F(degree + 1) * coefficient
            for coefficient in one_step_integral[1:]
        ]
        self.assertEqual(one_step_left, one_step_right)

        prefix = [
            F(math.comb(total_degree, index)) * gamma[index]
            for index in range(shift)
        ]
        reconstructed = prefix + [F(0)] * (degree + 1)
        prefactor = F(
            math.factorial(total_degree),
            math.factorial(degree) * math.factorial(shift - 1),
        )
        for index, coefficient in enumerate(shifted):
            beta_integral = F(
                math.factorial(shift - 1) * math.factorial(index),
                math.factorial(shift + index),
            )
            reconstructed[shift + index] += (
                prefactor * coefficient * beta_integral
            )
        self.assertEqual(reconstructed, unshifted)

        required = (
            r"{d^n\over dX^n}J^{D,0}(X)",
            r"{D!\over d!}J^{d,n}(X)",
            r"{D!\over d!(n-1)!}",
            "uncontrolled coefficient prefix of degree `n-1`",
            r"{n\over D}\longrightarrow1",
            "almost-total derivative",
            "must eventually leave the wedge before reaching `n=0`",
            r"0\geq K D^5",
            "A deep interior point can remain inside the wedge",
            "no immediate exit is claimed",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        self.assertNotIn("immediately leaves the proved wedge", self.normalized)

    def test_reverse_integration_counterexamples(self) -> None:
        first = integral_zero([F(1), F(1)])
        first[0] = F(1)
        self.assertEqual(first, [F(1), F(1), F(1, 2)])
        self.assertEqual(first[1] ** 2 - 4 * first[0] * first[2], -1)

        square = [F(1), F(2), F(1)]
        zero_integral = integral_zero(square)
        self.assertEqual(zero_integral, [F(0), F(1), F(1), F(1, 3)])
        nonzero_factor = zero_integral[1:]
        self.assertEqual(
            nonzero_factor[1] ** 2
            - 4 * nonzero_factor[0] * nonzero_factor[2],
            F(-1, 3),
        )

        total_degree = 10
        order = 7
        high_derivative = derivative(
            [F(1), F(0), F(1)] + [F(0)] * 7 + [F(1)],
            order,
        )
        self.assertEqual(
            high_derivative,
            [F(0)] * (total_degree - order)
            + [F(falling(total_degree, order))],
        )

        required = (
            r"\operatorname {disc}=-1",
            r"=-{1\over3}",
            r"P(X)=X^D+X^2+1>0",
            "disprove the proposed general reverse operation",
            "xi-specific interlacing theorem",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_inverse_shift_multiplier_is_exact_but_unproved(self) -> None:
        degree = 8
        shift = 4
        gamma = [F(index * index + 7, index + 3) for index in range(20)]
        shifted = jensen_coefficients(gamma, degree, shift)
        multipliers = [
            gamma[index] / gamma[shift + index]
            for index in range(degree + 1)
        ]
        transformed = [
            multiplier * coefficient
            for multiplier, coefficient in zip(multipliers, shifted)
        ]
        self.assertEqual(
            transformed, jensen_coefficients(gamma, degree, 0)
        )

        symbol = [
            F(math.comb(degree, index)) * multipliers[index]
            for index in range(degree + 1)
        ]
        self.assertEqual(
            symbol,
            [
                multipliers[index] * F(math.comb(degree, index))
                for index in range(degree + 1)
            ],
        )

        required = (
            r"m_j^{(n)}:={\gamma(j)\over\gamma(n+j)}",
            r"\boxed{\mathcal M_{d,n}[J^{d,n}]=J^{d,0}.}",
            r"M_{d,n}(X)=\sum_{j=0}^d{d\choose j}",
            "necessary test",
            "must itself be hyperbolic",
            "locally uniform limit of negative-rooted real polynomials",
            "exactly a new RH-strength bridge",
            "not an automatic use of a standard multiplier sequence",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_exact_claim_boundary_and_fail_closed_contract(self) -> None:
        required = (
            "no unshifted Jensen hyperbolicity",
            "no converse",
            "standard eight are unchanged",
            "P0_INVALIDATED",
            "moving-tail regime",
            "reverse-interlacing or finite inverse-shift multiplier theorem",
            "external v1 preprint",
            "as a vendored or independently audited repository theorem",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "the wedge implies RH",
            "the inverse multiplier is hyperbolicity preserving",
            "the centered polynomials converge to Xi",
            "the semicircle law proves local GUE",
            "the external preprint is independently certified",
        )
        for token in forbidden:
            self.assertNotIn(token, self.normalized)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb,mathrsfs}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "note.tex"
            source.write_text(document, encoding="ascii")
            result = subprocess.run(
                [
                    compiler,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    source.name,
                ],
                cwd=temporary,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_ascii_ast_tex_hash_and_cache_clean(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(
                all(line == line.rstrip(b" ") for line in raw.splitlines())
            )
        self.assertNotRegex(self.text, r"(?<!\\)\$\$")
        self.assertNotIn("\\begin{equation}", self.text)
        self.assertNotIn("\\end{equation}", self.text)
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
        self.assertNotIn("TODO", self.text)
        self.assertNotIn("FIXME", self.text)
        self.assertGreaterEqual(self.text.count(r"\boxed{"), 8)
        cache_entries = [
            path for path in ROOT.rglob("__pycache__") if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
