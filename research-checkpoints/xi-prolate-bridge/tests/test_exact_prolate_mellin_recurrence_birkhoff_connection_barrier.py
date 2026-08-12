import ast
import cmath
import hashlib
import math
import re
import shutil
import subprocess
import tempfile
import unittest
from fractions import Fraction as F
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "EXACT_PROLATE_MELLIN_RECURRENCE_BIRKHOFF_CONNECTION_BARRIER.md"
)
NOTE_HASH = "d1191bdc6f0d2edd0ae900e1a7d73f61cea7f78693e2074b6850df7aec36a041"

FROZEN = {
    "notes/COMPLEX_MELLIN_ACTION_PHASE_WEIGHTED_STOKES_INTERFACE_REDUCTION.md":
        "aaebb3565089bde5d2a62b3883762e72c2b7544613c9b7e3436d348b0eb6b2b6",
    "tests/test_complex_mellin_action_phase_weighted_stokes_interface_reduction.py":
        "6b81fd05e26837adad8c9c9ccf36b534d6aa9c0c8fb71b0b2e931ba820c8bdc6",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def action(c_value: float, sigma: complex) -> complex:
    z_value = sigma / (2.0 * c_value)
    return c_value * (
        cmath.sqrt(1.0 + z_value * z_value)
        - 1.0
        - z_value * cmath.asinh(z_value)
    )


def frozen_roots(
    c_value: float,
    a_value: float,
    s_value: complex,
) -> tuple[complex, complex]:
    tau = a_value / s_value - (s_value - 1.0) / c_value
    discriminant = tau * tau + 4.0 * (s_value - 1.0) / s_value
    root = cmath.sqrt(discriminant)
    return (tau + root) / 2.0, (tau - root) / 2.0


class ExactProlateMellinRecurrenceBirkhoffConnectionBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependency_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 2)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_every_boundary_term_in_mellin_integration(self) -> None:
        lam = F(5)
        epsilon = F(1)
        upper = F(4)
        degree = 6
        s_value = 7

        def integral_power(power: int) -> F:
            return (
                upper ** (power + 1) - epsilon ** (power + 1)
            ) / (power + 1)

        # f=x^degree and p=1-x^2/lambda^2.
        direct = (
            -degree * (degree - 1) * integral_power(degree + s_value - 3)
            + F(degree * (degree + 1), lam * lam)
            * integral_power(degree + s_value - 1)
        )
        moment_s = integral_power(degree + s_value - 1)
        moment_previous = integral_power(degree + s_value - 3)

        def boundary(point: F, is_upper: bool) -> F:
            p_value = 1 - point * point / (lam * lam)
            f_value = point**degree
            derivative = degree * point ** (degree - 1)
            upper_form = p_value * (
                (s_value - 1) * f_value * point ** (s_value - 2)
                - derivative * point ** (s_value - 1)
            )
            return upper_form if is_upper else -upper_form

        reconstructed = (
            F(s_value * (s_value - 1), lam * lam) * moment_s
            - (s_value - 1) * (s_value - 2) * moment_previous
            + boundary(upper, True)
            + boundary(epsilon, False)
        )
        self.assertEqual(direct, reconstructed)

        # At the hard endpoint the upper term vanishes by p(lambda)=0.
        self.assertEqual(
            (1 - lam * lam / (lam * lam))
            * ((s_value - 1) * lam**degree),
            0,
        )

    def test_normalized_recurrence_forward_form_and_derivative(self) -> None:
        c_value = F(17)
        a_value = F(11, 3)
        s_value = F(9, 2)

        def b(value: F) -> F:
            return value**3 - 2 * value + 5

        def b_prime(value: F) -> F:
            return 3 * value**2 - 2

        def forward_residual(value: F) -> F:
            q_value = (value + 2) * (value + 1) / c_value - a_value
            return (
                (value + 2) * b(value + 4)
                - (value + 1) * b(value)
                + q_value * b(value + 2)
            )

        q_value = (s_value + 2) * (s_value + 1) / c_value - a_value
        derivative_reconstruction = (
            (s_value + 2) * b_prime(s_value + 4)
            - (s_value + 1) * b_prime(s_value)
            + q_value * b_prime(s_value + 2)
            + b(s_value + 4)
            - b(s_value)
            + F(2 * s_value + 3, c_value) * b(s_value + 2)
        )
        step = F(1, 100000)
        numerical_polynomial_derivative = (
            forward_residual(s_value + step)
            - forward_residual(s_value - step)
        ) / (2 * step)
        # The centered difference is exact up to the known cubic remainder.
        self.assertLess(
            abs(float(numerical_polynomial_derivative - derivative_reconstruction)),
            1e-8,
        )

        r_next = F(7, 13)
        r_value = (s_value + 1) / (
            (s_value + 2) * r_next
            + (s_value + 2) * (s_value + 1) / c_value
            - a_value
        )
        self.assertEqual(
            (s_value + 2) * r_next
            - (s_value + 1) / r_value
            + (s_value + 2) * (s_value + 1) / c_value
            - a_value,
            0,
        )

    def test_watson_sign_factor_and_minimal_ratio(self) -> None:
        degree = 5
        # For f=x^degree, the local Watson coefficients are exact.
        for q_value in (1000.0, 2000.0, 4000.0):
            exact_normalized = 1.0 / (q_value + degree)
            first_two_normalized = 1.0 / q_value - degree / q_value**2
            scaled_error = (
                exact_normalized - first_two_normalized
            ) * q_value**3
            self.assertAlmostEqual(
                scaled_error,
                degree**2,
                delta=0.2,
            )

        c_value = 37.0
        chi_value = 211.0
        q_value = 1.0e7
        correction = 1.0 - (c_value**2 - chi_value) / q_value**2
        minimal_ratio = c_value / (q_value + 2.0) * correction
        self.assertLess(minimal_ratio, 2.0 * c_value / q_value)
        self.assertGreater(minimal_ratio, 0.5 * c_value / q_value)

    def test_transfer_roots_gap_and_action_branch(self) -> None:
        c_value = 100_000.0
        a_value = 9.0
        b_value = 3.5
        for v_value in (0.02, 0.10, 0.25):
            t_value = 2.0 * c_value * v_value
            s_value = b_value - 1j * t_value
            plus, minus = frozen_roots(c_value, a_value, s_value)
            plus_limit = math.sqrt(1.0 - v_value**2) + 1j * v_value
            minus_limit = -math.sqrt(1.0 - v_value**2) + 1j * v_value
            tolerance = 8.0 / t_value + 8.0 / c_value
            self.assertLess(abs(plus - plus_limit), tolerance)
            self.assertLess(abs(minus - minus_limit), tolerance)
            self.assertLess(abs(plus * minus + (s_value - 1.0) / s_value), 1e-12)
            self.assertGreater(abs(plus - minus), 1.9)

        s_value = 2.0 - 1234.0j
        z_value = s_value / (2.0 * c_value)
        leading_plus = cmath.sqrt(1.0 + z_value * z_value) - z_value
        leading_minus = -cmath.sqrt(1.0 + z_value * z_value) - z_value
        self.assertLess(
            abs(leading_plus - cmath.exp(-cmath.asinh(z_value))),
            1e-15,
        )
        self.assertLess(
            abs(leading_minus + cmath.exp(cmath.asinh(z_value))),
            1e-15,
        )

        derivative = -0.5 * cmath.asinh(z_value)
        self.assertLess(
            abs(cmath.exp(2.0 * derivative) - leading_plus),
            1e-15,
        )

    def test_scalar_five_term_is_exact_operator_elimination(self) -> None:
        c_value = F(23)
        a_zero = F(5, 2)
        a_four = F(19, 2)
        a_sum = a_zero + a_four
        a_product = a_zero * a_four

        def f(value: F) -> F:
            return value**5 - 3 * value**3 + 7 * value - 11

        def q(value: F) -> F:
            return value * (value - 1) / c_value

        def transform(function, value: F) -> F:
            return (
                value * function(value + 2)
                - (value - 1) * function(value - 2)
                + q(value) * function(value)
            )

        for s_value in (F(7, 3), F(11, 2), F(13)):
            composed = (
                transform(lambda z: transform(f, z), s_value)
                - a_sum * transform(f, s_value)
                + a_product * f(s_value)
            )
            expanded = (
                s_value * (s_value + 2) * f(s_value + 4)
                + s_value
                * (2 * (s_value**2 + s_value + 1) / c_value - a_sum)
                * f(s_value + 2)
                + (
                    q(s_value) ** 2
                    - a_sum * q(s_value)
                    + a_product
                    - 2 * (s_value**2 - s_value + 1)
                )
                * f(s_value)
                + (s_value - 1)
                * (
                    a_sum
                    - 2 * (s_value**2 - 3 * s_value + 3) / c_value
                )
                * f(s_value - 2)
                + (s_value - 1) * (s_value - 3) * f(s_value - 4)
            )
            self.assertEqual(composed, expanded)

    def test_wrong_branch_amplification_and_explicit_kappa(self) -> None:
        c_value = 100.0
        t_value = c_value / 2.0
        action_value = action(c_value, -1j * t_value)
        comparison_line_action = action(c_value, 1.0 - 1j * t_value)
        f_star = (
            math.sqrt(15.0) / 4.0
            - 1.0
            + math.asin(0.25) / 4.0
        )
        kappa = math.pi / 8.0 - f_star
        self.assertAlmostEqual(action_value.imag, 0.0, delta=2e-14)
        self.assertAlmostEqual(action_value.real, c_value * f_star, delta=2e-13)
        self.assertLess(
            abs(comparison_line_action.real - action_value.real),
            1.0,
        )
        self.assertAlmostEqual(kappa, 0.36128318136135024, places=15)
        self.assertGreater(kappa, 0.36)

        wrong_physical_log = math.pi * t_value / 4.0 - action_value.real
        right_physical_log = -math.pi * t_value / 4.0 + action_value.real
        self.assertAlmostEqual(wrong_physical_log, kappa * c_value, places=12)
        self.assertAlmostEqual(right_physical_log, -kappa * c_value, places=12)

        target = 100.0
        target_action = action(c_value * 100.0, -1j * target)
        amplification = math.pi * target / 2.0 - 2.0 * target_action.real
        self.assertGreater(amplification, 0.0)

    def test_locked_scale_makes_exponential_selection_sufficient(self) -> None:
        lambda_value = 100_000.0
        length = 2.0 * math.log(lambda_value)
        cutoff = math.ceil(lambda_value * length**3)
        height = 2.0 * math.pi * (cutoff + 1) / length
        c_value = 2.0 * math.pi * lambda_value**2
        kappa_zero = 0.1
        exponent = (
            -kappa_zero * c_value
            + math.pi * height / 2.0
            - 2.0 * action(c_value, -1j * height).real
        )
        self.assertLess(exponent, -0.05 * c_value)
        self.assertAlmostEqual(
            height / c_value,
            length**2 / lambda_value,
            delta=2.0 / (lambda_value**2 * length),
        )

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 40)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
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

    def test_static_hygiene_and_fail_closed_scope(self) -> None:
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

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "unbound post-checkpoint-1.43 theorem/barrier note/test pair",
            "changes no standard eight file",
            "including every boundary term",
            "boundary-free forward identity",
            "critical-line recurrence uses only the convergent transforms",
            "sign and the factor \\(1/2\\)",
            "selects the small root",
            "physical integral supplies more than a formal recessive ratio",
            "exact continued fraction recursion",
            "limiting gap is at least \\(\\sqrt {15}/2\\)",
            "exact diagonal two-component system",
            "scalar five-term recurrence",
            "not a fatal obstruction",
            "UNPROVED SUBTURNING BIRKHOFF CONNECTION THEOREM",
            "coarse polynomial-transport bounds",
            "physical bound (7.1) makes the comparison",
            "nonconstant \\(2\\)-periodic connection factor",
            "periodic alternative also controls the one derivative",
            "uniformly bounded minimal Green function",
            "No such decomposition or nonvanishing theorem is silently assumed",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        lowered = normalized.lower()
        forbidden = (
            "the complex-sector hypothesis is proved",
            "the finite-lambda stokes transfer is proved",
            "the subturning birkhoff theorem is proved",
            "the recurrence proves nonvanishing",
            "eta_n^pr=o(1) is proved",
            "the riemann hypothesis is proved",
            "actual arithmetic sign is negative",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
