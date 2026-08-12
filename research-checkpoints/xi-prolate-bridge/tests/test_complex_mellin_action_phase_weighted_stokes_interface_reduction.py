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
    / "COMPLEX_MELLIN_ACTION_PHASE_WEIGHTED_STOKES_INTERFACE_REDUCTION.md"
)
NOTE_HASH = "aaebb3565089bde5d2a62b3883762e72c2b7544613c9b7e3436d348b0eb6b2b6"

FROZEN = {
    "notes/IDEAL_STOKES_ALTERNATING_CAUCHY_FILTER_REDUCTION.md":
        "fb68a7b26abdbc938536c88c9e9780314c0d8b4fc794f24d69a0d4cd8b5a30d2",
    "tests/test_ideal_stokes_alternating_cauchy_filter_reduction.py":
        "696b74f6743aa7fbd6d1d784381386efc9b588cbd3e9d5eecbe57d822374d6b0",
    "notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md":
        "ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171",
    "tests/test_all_order_prolate_flatness.py":
        "f6a7925a8dd892183953e75ee24acc8bad9fd64226d7f578600736dda1c3fa03",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def action(c_value: float, sigma: complex) -> complex:
    if c_value <= 0.0 or abs(sigma) >= 2.0 * c_value:
        raise ValueError("action requires c>0 and |sigma|<2c")
    u_value = sigma / (2.0 * c_value)
    return c_value * (
        cmath.sqrt(1.0 + u_value * u_value)
        - 1.0
        - u_value * cmath.asinh(u_value)
    )


def action_derivative(c_value: float, sigma: complex) -> complex:
    if c_value <= 0.0 or abs(sigma) >= 2.0 * c_value:
        raise ValueError("action derivative requires c>0 and |sigma|<2c")
    return -0.5 * cmath.asinh(sigma / (2.0 * c_value))


def saddle_data(c_value: float, sigma: complex) -> tuple[complex, complex, complex]:
    if (
        c_value <= 0.0
        or not 0.0 < abs(sigma) < 2.0 * c_value
        or sigma.imag >= 0.0
    ):
        raise ValueError("saddle requires sigma in the lower punctured disk")
    u_value = sigma / (2.0 * c_value)
    q_value = 1.0 + u_value - cmath.sqrt(1.0 + u_value * u_value)
    rho_value = cmath.sqrt(2.0 * q_value)
    z_value = cmath.sqrt(q_value * (2.0 - q_value))
    return q_value, rho_value, z_value


def imaginary_action(c_value: float, t_value: float) -> float:
    v_value = t_value / (2.0 * c_value)
    if not 0.0 <= v_value < 1.0:
        raise ValueError("pure-imaginary formula requires 0<=t<2c")
    return c_value * (
        math.sqrt(1.0 - v_value * v_value)
        - 1.0
        + v_value * math.asin(v_value)
    )


class ComplexMellinActionPhaseWeightedStokesInterfaceTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 4)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_dimensionless_recurrence_and_physical_mellin_scaling(self) -> None:
        def legendre_two_mellin(s_value: int) -> F:
            return F(3, 2 * (s_value + 2)) - F(1, 2 * s_value)

        for s_value in (4, 5, 9, 14):
            current = legendre_two_mellin(s_value)
            previous = legendre_two_mellin(s_value - 2)
            recurrence = (
                (s_value * (s_value - 1) - 6) * current
                - (s_value - 1) * (s_value - 2) * previous
            )
            self.assertEqual(recurrence, 0)

        lambda_value = 9
        s_value = 3
        dimensionless = F(1, s_value) + F(2, s_value + 2)
        physical_direct = F(1, 3) * (
            F(lambda_value**s_value, s_value)
            + F(2 * lambda_value ** (s_value + 2), lambda_value**2 * (s_value + 2))
        )
        physical_scaled = F(lambda_value**s_value, 3) * dimensionless
        self.assertEqual(physical_direct, physical_scaled)

        a_four = F(7, 11)
        a_zero = F(5, 13)
        m_four = F(17, 19)
        m_zero = F(23, 29)
        dimensionless_mix = a_four * m_four - a_zero * m_zero
        self.assertEqual(
            F(lambda_value**s_value, 3) * dimensionless_mix,
            a_four * F(lambda_value**s_value, 3) * m_four
            - a_zero * F(lambda_value**s_value, 3) * m_zero,
        )

    def test_declared_saddle_domain_branches_and_exact_equations(self) -> None:
        c_value = 64.0
        for sigma in (3.5 - 20.0j, -0.5 - 20.0j, 11.0 - 7.0j):
            q_value, rho_value, z_value = saddle_data(c_value, sigma)
            reconstructed = q_value * (2.0 - q_value) / (1.0 - q_value)
            self.assertAlmostEqual(abs(reconstructed - sigma / c_value), 0.0, delta=2e-15)
            self.assertAlmostEqual(abs(rho_value * rho_value - 2.0 * q_value), 0.0, delta=2e-15)
            self.assertAlmostEqual(
                abs(z_value * z_value - q_value * (2.0 - q_value)),
                0.0,
                delta=2e-15,
            )
            self.assertGreater(cmath.phase(rho_value), -math.pi / 2.0)
            self.assertLess(cmath.phase(rho_value), 0.0)
            self.assertGreater(cmath.phase(z_value), -math.pi / 2.0)
            self.assertLess(cmath.phase(z_value), 0.0)
            u_value = sigma / (2.0 * c_value)
            self.assertAlmostEqual(
                abs(1.0 - q_value - cmath.exp(-cmath.asinh(u_value))),
                0.0,
                delta=2e-15,
            )

        small_sigma = c_value * 1e-6 * cmath.exp(-0.7j)
        _, rho_small, z_small = saddle_data(c_value, small_sigma)
        leading = cmath.sqrt(small_sigma / c_value)
        self.assertAlmostEqual(abs(rho_small / leading - 1.0), 0.0, delta=4e-7)
        self.assertAlmostEqual(abs(z_small / leading - 1.0), 0.0, delta=4e-7)

        with self.assertRaises(ValueError):
            saddle_data(c_value, 0.0j)
        with self.assertRaises(ValueError):
            saddle_data(c_value, 2.0 * c_value - 1.0j)
        with self.assertRaises(ValueError):
            saddle_data(c_value, 1.0 + 1.0j)
        with self.assertRaises(ValueError):
            saddle_data(0.0, 1.0 - 1.0j)
        with self.assertRaises(ValueError):
            action(c_value, 2.0 * c_value + 0.0j)

    def test_action_derivative_and_pure_imaginary_bounds(self) -> None:
        c_value = 100.0
        self.assertEqual(action(c_value, 0.0j), 0.0j)
        self.assertEqual(action_derivative(c_value, 0.0j), 0.0j)
        step = 1e-4
        for sigma in (3.5 - 20.0j, -0.5 - 20.0j, 7.0 - 31.0j):
            numerical = (
                action(c_value, sigma + step)
                - action(c_value, sigma - step)
            ) / (2.0 * step)
            exact = action_derivative(c_value, sigma)
            self.assertAlmostEqual(abs(numerical - exact), 0.0, delta=2e-9)

        for v_value in (0.01, 0.10, 0.25):
            t_value = 2.0 * c_value * v_value
            direct = action(c_value, -1j * t_value)
            stable = imaginary_action(c_value, t_value)
            self.assertAlmostEqual(direct.imag, 0.0, delta=2e-14)
            self.assertAlmostEqual(direct.real, stable, delta=2e-13)
            self.assertGreaterEqual(stable + 2e-13, t_value**2 / (8.0 * c_value))
            self.assertLessEqual(
                stable,
                t_value**2 / (2.0 * c_value * math.sqrt(15.0)) + 2e-13,
            )

    def test_locked_schedule_label_shifts_and_slow_action(self) -> None:
        lambda_value = 10_000.0
        length = 2.0 * math.log(lambda_value)
        cutoff = math.ceil(lambda_value * length**3)
        first_omitted = cutoff + 1
        height = 2.0 * math.pi * first_omitted / length
        c_value = 2.0 * math.pi * lambda_value**2
        schedule_error = height / c_value - length**2 / lambda_value
        self.assertGreaterEqual(schedule_error, 1.0 / (lambda_value**2 * length))
        self.assertLess(schedule_error, 2.0 / (lambda_value**2 * length))

        leading = math.pi * length**4 / 4.0
        locked_action = imaginary_action(c_value, height)
        self.assertAlmostEqual(locked_action / leading, 1.0, delta=1e-3)

        s_value = 0.5 - 1j * height
        sigma_four = s_value + 3.0
        sigma_zero = s_value - 1.0
        self.assertEqual(sigma_four - sigma_zero, 4.0)
        shift_bound = (
            4.0 * (abs(sigma_zero) + 4.0) / (c_value * math.sqrt(15.0))
        )
        self.assertLessEqual(
            abs(action(c_value, sigma_four) - action(c_value, sigma_zero)),
            shift_bound + 2e-14,
        )
        phase_bound = 3.5 * (height + 3.5) / (c_value * math.sqrt(15.0))
        self.assertLessEqual(abs(action(c_value, sigma_four).imag), phase_bound + 2e-14)

        window = math.log(length)
        variation = abs(
            action(c_value, 3.5 - 1j * (height + window))
            - action(c_value, 3.5 - 1j * height)
        )
        variation_bound = (
            window * (height + window + 3.5) / (c_value * math.sqrt(15.0))
        )
        self.assertLessEqual(variation, variation_bound + 2e-14)

        _, _, z_value = saddle_data(c_value, sigma_four)
        self.assertAlmostEqual(
            abs(z_value) * math.sqrt(lambda_value) / length,
            1.0,
            delta=0.01,
        )
        self.assertAlmostEqual(cmath.phase(z_value), -math.pi / 4.0, delta=0.01)

    def test_exact_label_ratios_and_conditional_mixture_identity(self) -> None:
        a_four = math.sqrt(3.0) / 2.0 ** (11.0 / 4.0)
        a_zero = 3.0 / 2.0 ** (17.0 / 4.0)
        t_value = 7.3
        s_value = 0.5 - 1j * t_value
        g_value = 2.0 - 3.0j
        h_value = s_value * (s_value - 1.0) * g_value / 8.0
        a_zero_h_zero = a_zero * 2.0 ** (-3.0 / 4.0) * g_value
        a_four_h_four = (4.0 * s_value * (s_value - 1.0) + 3.0) * g_value / 32.0
        delta = 3.0 / (4.0 * (t_value**2 + 0.25))
        self.assertAlmostEqual(abs(a_zero_h_zero - 3.0 * g_value / 32.0), 0.0, delta=2e-15)
        self.assertAlmostEqual(abs(a_four_h_four / h_value - (1.0 - delta)), 0.0, delta=2e-15)
        self.assertAlmostEqual(abs(a_zero_h_zero / h_value + delta), 0.0, delta=2e-15)

        c_value = 200.0
        epsilon_four = 0.03 - 0.02j
        epsilon_zero = -0.01 + 0.04j
        alpha = 0.02
        d_four = action(c_value, s_value + 3.0)
        d_zero = action(c_value, s_value - 1.0)
        h_four = a_four_h_four / a_four
        h_zero = a_zero_h_zero / a_zero
        physical_four = cmath.exp(d_four) * h_four * (1.0 + epsilon_four)
        physical_zero = cmath.exp(d_zero) * h_zero * (1.0 + epsilon_zero)
        physical_mix = a_four * physical_four - a_zero * (1.0 + alpha) * physical_zero
        direct_ratio = physical_mix / (cmath.exp(d_four) * h_value)
        declared_ratio = (
            (1.0 - delta) * (1.0 + epsilon_four)
            + delta
            * cmath.exp(d_zero - d_four)
            * (1.0 + alpha)
            * (1.0 + epsilon_zero)
        )
        self.assertAlmostEqual(abs(direct_ratio - declared_ratio), 0.0, delta=3e-15)

    def test_exact_endpoint_tail_identity(self) -> None:
        sqrt_length = F(4)
        cutoff = 2
        first_omitted = cutoff + 1
        coefficients = (
            F(7, 10),
            F(-1, 5),
            F(7, 20),
            F(-2, 5),
            F(1, 4),
            F(-1, 10),
            F(1, 20),
        )
        x_hat = [sqrt_length * coefficients[0]]
        x_hat.extend(
            sqrt_length * F((-1) ** n, 2) * coefficients[n]
            for n in range(1, len(coefficients))
        )
        o_hat = [F(0) for _ in coefficients]
        for n in range(first_omitted, len(coefficients)):
            o_hat[n] = F(n - 1, 10 * (n + 1))
        f_hat = [x_value + o_value for x_value, o_value in zip(x_hat, o_hat)]
        endpoint = sum(coefficients, F(0)) / sqrt_length
        d_value = sum(coefficients[: cutoff + 1], F(0))
        endpoint_tail = sum(
            F((-1) ** k) * f_hat[first_omitted + k]
            for k in range(len(coefficients) - first_omitted)
        )
        exterior_tail = sum(
            F((-1) ** k) * o_hat[first_omitted + k]
            for k in range(len(coefficients) - first_omitted)
        )
        q_value = -F(2 * ((-1) ** first_omitted), 1) / sqrt_length
        remainder = sqrt_length * endpoint - q_value * exterior_tail
        self.assertEqual(d_value, q_value * endpoint_tail + remainder)

    def test_phase_weighted_row_identity_and_exact_carrier_limit(self) -> None:
        length = 16.0
        sqrt_length = 4.0
        cutoff = 2
        first_omitted = cutoff + 1
        coefficients = (0.7, -0.2, 0.35, -0.4, 0.25, -0.1, 0.05, 0.02)
        x_hat = [sqrt_length * coefficients[0]]
        x_hat.extend(
            sqrt_length * ((-1.0) ** n) * coefficients[n] / 2.0
            for n in range(1, len(coefficients))
        )
        o_hat = [0.0 for _ in coefficients]
        for n in range(first_omitted, len(coefficients)):
            o_hat[n] = 0.03 * (n - 1.0) / (n + 1.0)
        f_hat = [x_value + o_value for x_value, o_value in zip(x_hat, o_hat)]

        scaled_gamma = 2.4
        gamma = 2.0 * math.pi * scaled_gamma / length
        phase = math.sin(math.pi * scaled_gamma) / gamma
        h_full = coefficients[0] + scaled_gamma**2 * sum(
            coefficients[n] / (scaled_gamma**2 - n**2)
            for n in range(1, len(coefficients))
        )
        h_truncated = coefficients[0] + scaled_gamma**2 * sum(
            coefficients[n] / (scaled_gamma**2 - n**2)
            for n in range(1, cutoff + 1)
        )
        x_hat_gamma = 2.0 * math.sin(math.pi * scaled_gamma) * h_full / (
            sqrt_length * gamma
        )
        o_hat_gamma = -x_hat_gamma
        c_full = sum(
            ((-1.0) ** k)
            * f_hat[first_omitted + k]
            * scaled_gamma**2
            / (scaled_gamma**2 - (first_omitted + k) ** 2)
            for k in range(len(coefficients) - first_omitted)
        )
        c_exterior = sum(
            ((-1.0) ** k)
            * o_hat[first_omitted + k]
            * scaled_gamma**2
            / (scaled_gamma**2 - (first_omitted + k) ** 2)
            for k in range(len(coefficients) - first_omitted)
        )
        q_value = -2.0 * ((-1.0) ** first_omitted) / sqrt_length
        unweighted_rhs = (
            q_value * c_full
            - q_value * c_exterior
            - sqrt_length * gamma * o_hat_gamma
            / (2.0 * math.sin(math.pi * scaled_gamma))
        )
        weighted_rhs = (
            q_value * phase * c_full
            - q_value * phase * c_exterior
            - sqrt_length * o_hat_gamma / 2.0
        )
        self.assertAlmostEqual(h_truncated, unweighted_rhs, places=13)
        self.assertAlmostEqual(phase * h_truncated, weighted_rhs, places=13)

        carrier = 2
        o_hat_carrier = -x_hat[carrier]
        continuous_left = (
            ((-1.0) ** carrier) * length * coefficients[carrier] / 4.0
        )
        carrier_safe_right = -sqrt_length * o_hat_carrier / 2.0
        self.assertAlmostEqual(continuous_left, carrier_safe_right, places=14)
        self.assertTrue(math.isfinite(carrier_safe_right))

    def test_hilbert_transfer_constants_and_operator_relative_interface(self) -> None:
        epsilon_row = F(1, 5)
        epsilon_end = F(3, 10)
        general_factor = ((1 - epsilon_row) / (1 + epsilon_end)) ** 2
        main_energy = F(35)
        endpoint_energy = F(4)
        kappa_log = main_energy / endpoint_energy
        actual_row_energy = (1 - epsilon_row) ** 2 * main_energy
        actual_endpoint_energy = (1 + epsilon_end) ** 2 * endpoint_energy
        self.assertEqual(
            actual_row_energy / actual_endpoint_energy,
            kappa_log * general_factor,
        )
        self.assertEqual(((1 - F(1, 4)) / (1 + F(1, 4))) ** 2, F(9, 25))

        eta = F(1, 5)
        ideal_factor = ((1 - eta) / (1 + eta)) ** 2
        ideal_row_energy = F(63)
        ideal_endpoint_energy = F(7)
        actual_main_row = (1 - eta) ** 2 * ideal_row_energy
        actual_main_endpoint = (1 + eta) ** 2 * ideal_endpoint_energy
        self.assertEqual(
            actual_main_row / actual_main_endpoint,
            ideal_factor * ideal_row_energy / ideal_endpoint_energy,
        )
        self.assertEqual(
            ideal_factor * general_factor,
            (
                (1 - eta)
                * (1 - epsilon_row)
                / ((1 + eta) * (1 + epsilon_end))
            ) ** 2,
        )

    def test_exterior_amplitude_scale_is_only_a_limitation(self) -> None:
        for c_value in (5.0, 20.0, 80.0):
            defect = math.exp(-2.0 * c_value)
            self.assertAlmostEqual(math.sqrt(defect), math.exp(-c_value), places=15)

        lambda_value = 1000.0
        length = 2.0 * math.log(lambda_value)
        cutoff = math.ceil(lambda_value * length**3)
        height = 2.0 * math.pi * (cutoff + 1) / length
        c_value = 2.0 * math.pi * lambda_value**2
        exterior_log_scale = -c_value
        carrier_log_scale = -math.pi * height / 4.0 + imaginary_action(c_value, height)
        self.assertLess(exterior_log_scale, carrier_log_scale)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
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
            self.assertTrue(all(line == line.rstrip(b" ") for line in raw.splitlines()))

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "unbound post-checkpoint-1.43 theorem-only note/test pair",
            "It changes no standard eight file",
            "dimensionless recurrence",
            "physical function and transform",
            r"\mathcal M_{j,\lambda}(s)",
            r"=\lambda^{s-1/2}M_j(s)",
            "lower punctured disk",
            "unique analytic square roots",
            "sigma_4=s+3",
            "sigma_0=s-1",
            "UNPROVED COMPLEX-SECTOR HYPOTHESIS",
            "exact conditional identity",
            "actual critical zero",
            "has no division by the phase",
            "exact carriers are retained rather than deleted",
            "9\\kappa\\over25",
            "phase-weighted operator consequence",
            "unvendored and nonbinding",
            "an `e^(-2c)` amplitude bound does not follow",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        lowered = normalized.lower()
        forbidden = (
            "the finite-lambda stokes transfer is proved",
            "the complex-sector hypothesis is proved",
            "pointwise relative errors suffice",
            "an e^(-2c) amplitude bound follows",
            "eta_n^pr=o(1) is proved",
            "the riemann hypothesis is proved",
            "actual arithmetic sign is negative",
            "dunster proves the required complex-sector estimate",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
