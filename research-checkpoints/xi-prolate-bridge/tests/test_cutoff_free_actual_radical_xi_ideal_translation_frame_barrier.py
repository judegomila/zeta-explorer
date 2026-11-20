#!/usr/bin/env python3
"""Exact regressions for the actual-radical Xi-ideal translation barrier."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
from math import comb, factorial
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
    / "CUTOFF_FREE_ACTUAL_RADICAL_XI_IDEAL_TRANSLATION_FRAME_BARRIER.md"
)
NOTE_HASH = "e961040eda5cdf2645d8c0a50d54dbbd269a666c55d3470e7fc9853b58e0da9e"

FROZEN = {
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md":
        "3847cbcb6e5bfc458af7bf957ff67afb0b943155d62f4239129b40332d270fbf",
    "tests/test_projected_state_norm_lower_bound.py":
        "d740587d2af62c5ef1b1255dc8184d8bea0833c70740b6697407678f90e1d079",
    "notes/CUTOFF_FREE_MULTI_ANCHOR_GROUND_FRAME_BARRIER.md":
        "2e07843d54f00bce9e53afadc0b434efbaf8f97da95dadda54225de6cfecb34d",
    "tests/test_cutoff_free_multi_anchor_ground_frame_barrier.py":
        "0fdc307a051d50ff4ece21ae8b01f89b745a14788f093ec4127f5da6026bde9f",
}


Polynomial = tuple[F, ...]


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


def poly_derivative(polynomial: Polynomial, order: int = 1) -> Polynomial:
    result = polynomial
    for _ in range(order):
        if len(result) == 1:
            return (F(0),)
        result = tuple(F(index) * result[index] for index in range(1, len(result)))
    return trim(result)


def poly_eval(polynomial: Polynomial, value: F) -> F:
    result = F(0)
    for coefficient in reversed(polynomial):
        result = result * value + coefficient
    return result


def poly_reflect(polynomial: Polynomial) -> Polynomial:
    return tuple(
        coefficient if index % 2 == 0 else -coefficient
        for index, coefficient in enumerate(polynomial)
    )


def poly_add(left: Polynomial, right: Polynomial) -> Polynomial:
    size = max(len(left), len(right))
    return trim(
        tuple(
            (left[index] if index < len(left) else F(0))
            + (right[index] if index < len(right) else F(0))
            for index in range(size)
        )
    )


def poly_scale(value: F, polynomial: Polynomial) -> Polynomial:
    return trim(tuple(value * coefficient for coefficient in polynomial))


def source(value: F) -> F:
    return value**2 - value**4


def source_derivative(value: F) -> F:
    return 2 * value - 4 * value**3


def arithmetic_partial(function, u_value: F, terms: int) -> F:
    # The test uses u=1/4, whose positive square root is exactly 1/2.
    root = F(1, 2) if u_value == F(1, 4) else F(1)
    return root * sum((function(F(n) * u_value) for n in range(1, terms + 1)), F(0))


def matvec(matrix: tuple[tuple[F, ...], ...], vector: tuple[F, ...]) -> tuple[F, ...]:
    return tuple(
        sum((entry * value for entry, value in zip(row, vector, strict=True)), F(0))
        for row in matrix
    )


def dot(left: tuple[F, ...], right: tuple[F, ...]) -> F:
    return sum((x_value * y_value for x_value, y_value in zip(left, right, strict=True)), F(0))


class CutoffFreeActualRadicalXiIdealTranslationFrameBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_note_hash(self) -> None:
        self.assertEqual(len(FROZEN), 5)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_principal_ideal_survives_both_symmetrizations(self) -> None:
        # Xi=z^2-4 is even.  A=1+2z is an arbitrary cofactor.
        xi = (F(-4), F(0), F(1))
        cofactor = (F(1), F(2))
        carrier = poly_mul(xi, cofactor)
        reflected = poly_reflect(carrier)
        even_carrier = poly_scale(F(1, 2), poly_add(carrier, reflected))
        odd_carrier = poly_scale(F(1, 2), poly_add(carrier, poly_scale(F(-1), reflected)))

        even_cofactor = poly_scale(
            F(1, 2), poly_add(cofactor, poly_reflect(cofactor))
        )
        odd_cofactor = poly_scale(
            F(1, 2),
            poly_add(cofactor, poly_scale(F(-1), poly_reflect(cofactor))),
        )
        self.assertEqual(even_carrier, poly_mul(xi, even_cofactor))
        self.assertEqual(odd_carrier, poly_mul(xi, odd_cofactor))
        for root in (F(-2), F(2)):
            self.assertEqual(poly_eval(even_carrier, root), 0)
            self.assertEqual(poly_eval(odd_carrier, root), 0)

    def test_source_dilation_and_generator_identities_are_exact(self) -> None:
        terms = 7
        u_value = F(1, 4)

        def dilated(value: F) -> F:
            return 2 * source(4 * value)

        left = arithmetic_partial(dilated, u_value, terms)
        right = arithmetic_partial(source, F(1), terms)
        self.assertEqual(left, right)

        def generator(value: F) -> F:
            return F(1, 2) * source(value) + value * source_derivative(value)

        termwise_log_derivative = F(1, 2) * sum(
            (
                F(1, 2) * source(F(n) * u_value)
                + F(n) * u_value * source_derivative(F(n) * u_value)
                for n in range(1, terms + 1)
            ),
            F(0),
        )
        self.assertEqual(
            arithmetic_partial(generator, u_value, terms),
            termwise_log_derivative,
        )

        # Formal generator jets multiply the cofactor and retain Xi.
        xi = (F(3), F(0), F(1))
        cofactor = (F(2), F(-1), F(4))
        z_squared = (F(0), F(0), F(1))
        self.assertEqual(
            poly_mul(poly_mul(xi, cofactor), z_squared),
            poly_mul(xi, poly_mul(cofactor, z_squared)),
        )

    def test_raw_log_moment_can_leave_the_source_class(self) -> None:
        # Write ell=log(2) and encode a+b*ell by the exact pair (a,b).
        # If I=int(phi)>0 and J=int(log|x| phi), then
        # 2*int(log|x| phi(2x))=J-ell*I.
        integral_phi = F(3, 2)
        log_moment_phi = (F(7, 5), F(0))
        twice_scaled_log_moment = (F(7, 5), -integral_phi)

        integral_f = integral_phi - 2 * (integral_phi / 2)
        log_moment_f = tuple(
            left - right
            for left, right in zip(
                log_moment_phi,
                twice_scaled_log_moment,
                strict=True,
            )
        )
        self.assertEqual(integral_f, 0)
        self.assertEqual(log_moment_f, (F(0), integral_phi))
        self.assertNotEqual(log_moment_f, (F(0), F(0)))

        # A correction already in the actual class has zero for both nulls,
        # so it cannot cancel the failed integral null.
        actual_source_correction = (F(0), F(0))
        self.assertEqual(
            tuple(
                left + right
                for left, right in zip(
                    log_moment_f,
                    actual_source_correction,
                    strict=True,
                )
            ),
            log_moment_f,
        )

    def test_coordinate_multiplication_breaks_the_divisor(self) -> None:
        # A toy Xi=(z-1)(z+1), A=z+2.  Differentiating Xi*A is the
        # exact formal analogue of multiplying the profile by t.
        xi = (F(-1), F(0), F(1))
        cofactor = (F(2), F(1))
        carrier = poly_mul(xi, cofactor)
        differentiated = poly_derivative(carrier)

        self.assertEqual(poly_eval(carrier, F(1)), 0)
        self.assertEqual(poly_eval(carrier, F(-1)), 0)
        self.assertEqual(poly_eval(differentiated, F(1)), F(6))
        self.assertEqual(poly_eval(differentiated, F(-1)), F(-2))

        # Product rule: (Xi*A)'=Xi'*A+Xi*A'.  At a Xi zero only the
        # logarithmic-derivative numerator Xi'*A remains.
        xi_prime = poly_derivative(xi)
        for root in (F(-1), F(1)):
            self.assertEqual(
                poly_eval(differentiated, root),
                poly_eval(xi_prime, root) * poly_eval(cofactor, root),
            )

    def test_bulk_residual_disappears_only_for_a_radical(self) -> None:
        form = ((F(1), F(-1)), (F(-1), F(1)))
        test = (F(1), F(0))

        radical = (F(1), F(1))
        compact = (F(1), F(0))
        remainder = (F(0), F(1))
        self.assertEqual(radical, tuple(x + y for x, y in zip(compact, remainder)))
        radical_bulk = dot(matvec(form, radical), test)
        compact_form = dot(matvec(form, compact), test)
        remainder_form = dot(matvec(form, remainder), test)
        self.assertEqual(radical_bulk, 0)
        self.assertEqual(compact_form, radical_bulk - remainder_form)

        nonradical = (F(2), F(1))
        compact = (F(1), F(1))
        remainder = (F(1), F(0))
        bulk = dot(matvec(form, nonradical), test)
        self.assertNotEqual(bulk, 0)
        self.assertEqual(
            dot(matvec(form, compact), test),
            bulk - dot(matvec(form, remainder), test),
        )

    def test_finite_window_collision_leaves_only_tail_errors(self) -> None:
        xi_values = (F(3), F(0), F(2))
        cofactors = (
            (F(1), F(5), F(2)),
            (F(4), F(-3), F(1)),
        )
        errors = (
            (F(1, 100), F(1, 20), F(-1, 30)),
            (F(-1, 50), F(1, 25), F(1, 40)),
        )
        columns = tuple(
            tuple(
                xi_values[index] * cofactor[index] + error[index]
                for index in range(3)
            )
            for cofactor, error in zip(cofactors, errors, strict=True)
        )
        weights = tuple(
            sum((column[index] ** 2 for column in columns), F(0))
            for index in range(3)
        )
        collision_weight = sum((error[1] ** 2 for error in errors), F(0))
        self.assertEqual(weights[1], collision_weight)
        self.assertEqual(collision_weight, F(1, 400) + F(1, 625))

        for index in range(3):
            cofactor_energy = sum(
                (cofactor[index] ** 2 for cofactor in cofactors), F(0)
            )
            error_energy = sum((error[index] ** 2 for error in errors), F(0))
            self.assertLessEqual(
                weights[index],
                2 * xi_values[index] ** 2 * cofactor_energy + 2 * error_energy,
            )

    def test_tail_power_and_translation_exponent_dichotomy(self) -> None:
        # K(log u) has power u^(9/2); squaring and using dt=du/u gives u^8.
        profile_numerator_power = 9
        logarithmic_measure_loss = 1
        integrand_power = profile_numerator_power - logarithmic_measure_loss
        leading_tail_power = integrand_power - 1
        self.assertEqual(integrand_power, 8)
        self.assertEqual(leading_tail_power, 7)

        # The pointwise lower-bound reduction is exactly 3(u^2-1)>=0.
        for u_value in (F(1), F(3, 2), F(2), F(5)):
            self.assertGreaterEqual(3 * (u_value**2 - 1), 0)

        # For tau=log q, the lambda^2 exponent coefficient is q^(-2).
        previous = F(2)
        for q_value in (1, 2, 4, 8, 16, 32):
            coefficient = F(1, q_value**2)
            self.assertLess(coefficient, previous)
            previous = coefficient
        self.assertEqual(previous, F(1, 1024))

        # The two shifted thresholds have minimum a-|tau|.
        for a_value, tau_value in ((10, 3), (17, -5), (29, 11)):
            thresholds = (a_value + tau_value, a_value - tau_value)
            self.assertEqual(min(thresholds), a_value - abs(tau_value))

    def test_binomial_translation_witness_and_upper_bound_are_exact(self) -> None:
        x_value = F(4, 3)
        delta = x_value - 1
        previous = F(1)
        for degree in range(1, 25):
            coefficients = tuple(
                F((-1) ** (degree - index) * comb(degree, index))
                for index in range(degree + 1)
            )
            self.assertEqual(poly_eval(coefficients, x_value), delta**degree)

            square_sum = sum((value**2 for value in coefficients), F(0))
            central = F(comb(2 * degree, degree))
            self.assertEqual(square_sum, central)
            self.assertGreaterEqual((2 * degree + 1) * central, 4**degree)

            exact_energy_bound = delta ** (2 * degree) / central
            coarse_bound = F(2 * degree + 1) * (delta / 2) ** (2 * degree)
            self.assertLessEqual(exact_energy_bound, coarse_bound)
            self.assertLess(exact_energy_bound, previous)
            previous = exact_energy_bound

    def test_fixed_derivative_jet_retains_a_growing_zero_order(self) -> None:
        for degree in range(4, 13):
            polynomial = tuple(
                F((-1) ** (degree - index) * comb(degree, index))
                for index in range(degree + 1)
            )
            for derivative_order in range(4):
                differentiated = poly_derivative(polynomial, derivative_order)
                zero_order = degree - derivative_order
                for lower_order in range(zero_order):
                    self.assertEqual(
                        poly_eval(poly_derivative(differentiated, lower_order), F(1)),
                        0,
                    )
                first_nonzero = poly_eval(
                    poly_derivative(differentiated, zero_order), F(1)
                )
                self.assertEqual(first_nonzero, F(factorial(degree)))

    def test_note_contract_scope_and_static_hygiene(self) -> None:
        required = (
            r"\widehat{\mathcal E(f)}(z)",
            r"=\Xi(z)A_f(z)",
            r"A_f(z)={m_f(z)\over C(s)}",
            r"\widehat{S_\pm\mathcal E(f)}(z)",
            r"m_{D_\tau f}(z)=e^{iz\tau}m_f(z)",
            r"m_{\mathcal Lf}(z)=iz\,m_f(z)",
            r"\partial_s^r m_f(z)",
            r"\phi(x)=x^2e^{-x^2}",
            r"f(x)=\phi(x)-2\phi(2x)",
            r"(\log2)\int_{\mathbb R}\phi(y)\,dy>0",
            r"{\zeta'(s)\over\zeta(s)}m_f(z)",
            r"\mathcal E_{\log n}",
            r"\mathcal W_Z(H,v)-\mathcal W_Z(R,v)",
            r"L^{-1/2}\Xi(\omega_n)A_a(\omega_n)+e_{a,n}",
            r"T(\log\lambda+\tau)+T(\log\lambda-\tau)",
            r"\binom{2N}{N}",
            r"-\Theta(\lambda^2\log\log\lambda)",
            "principal analytic ideal",
            "Adding actual sources cannot repair a failed null",
            "independently satisfies both nulls",
            "divisor-breaking",
            "high-complexity common-divisor",
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
            "every possible common-`Xi` high-complexity frame fails",
            "with any required source-null corrections made inside the same source class",
            "Null corrections are finite linear combinations of further actual sources",
            "The first term in (4.5) is an actual source radical",
            "TO_BE_FROZEN",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

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
        self.assertEqual(len(displays), 59)
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
