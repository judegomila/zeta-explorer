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
NOTE = ROOT / "notes" / "IDEAL_STOKES_ALTERNATING_CAUCHY_FILTER_REDUCTION.md"
NOTE_HASH = "fb68a7b26abdbc938536c88c9e9780314c0d8b4fc794f24d69a0d4cd8b5a30d2"

FROZEN = {
    "notes/HSW_CONTINUOUS_L_PHASE_SHELL_THEOREM.md":
        "49a53cb1f8ee6db85040cd39aa6faa4fff0296d8bb8b99b18e830efce63df70e",
    "tests/test_hsw_continuous_l_phase_shell_theorem.py":
        "54e28858ad50a9b29578ff7719a2bb9818e02d7f275530a9da8cc15a023b6d9f",
    "notes/ACTUAL_ENDPOINT_RATIONAL_VARIANCE_FAR_TAIL_BARRIER.md":
        "88965c9926092be319f83014408b689622911b1d27b5e5f266e2d7fb74e92644",
    "tests/test_actual_endpoint_rational_variance_far_tail_barrier.py":
        "bd993af601bcddbd48ad077bd9b9c64f0cfb34ba2354b617de94f66029d0716c",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def multiplier(alpha: float, h_value: float, y_value: float, theta: float) -> complex:
    return 1.0 / (
        1.0 + cmath.exp(-(alpha + y_value) * h_value + 1j * theta)
    )


def geometric_tail(
    alpha: float,
    h_value: float,
    theta: float,
    delta: float,
    power: int,
    terms: int = 800,
) -> complex:
    ratio = -cmath.exp(-alpha * h_value + 1j * theta)
    return sum(
        ratio**index / (delta + index * h_value) ** power
        for index in range(terms)
    )


def endpoint_eta_squared(endpoint: F, source: F, denominator: F) -> F:
    if denominator <= 0:
        raise ValueError("strict quotient requires D_N>0")
    if endpoint == 0:
        return F(0)
    return endpoint**2 * source / denominator


class IdealStokesAlternatingCauchyFilterReductionTests(unittest.TestCase):
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

    def test_exact_alternating_multiplier_and_derivative_bounds(self) -> None:
        alpha = 0.8
        h_value = 0.2
        epsilon = 0.6
        for theta in (
            -math.pi + epsilon,
            -1.1,
            0.0,
            1.4,
            math.pi - epsilon,
        ):
            for y_value in (0.0, 0.7, 3.0):
                ratio = -cmath.exp(
                    -(alpha + y_value) * h_value + 1j * theta
                )
                partial = sum(ratio**index for index in range(800))
                exact = multiplier(alpha, h_value, y_value, theta)
                self.assertAlmostEqual(abs(partial - exact), 0.0, delta=2e-14)

                denominator = abs(
                    1.0
                    + cmath.exp(
                        -(alpha + y_value) * h_value + 1j * theta
                    )
                )
                self.assertGreaterEqual(denominator + 2e-15, math.sin(epsilon))
                derivative = (
                    h_value
                    * math.exp(-(alpha + y_value) * h_value)
                    / denominator**2
                )
                self.assertLessEqual(
                    derivative,
                    h_value / math.sin(epsilon) ** 2 + 2e-15,
                )
            self.assertGreaterEqual(
                abs(multiplier(alpha, h_value, 0.0, theta)),
                0.5 - 2e-15,
            )

    def test_stieltjes_and_h1_uniform_delta_estimates(self) -> None:
        alpha = 0.8
        h_value = 0.2
        epsilon = 0.6
        delta_floor = 0.8
        delta_ceiling = 2.0
        span = delta_ceiling - delta_floor
        integral_four = (
            delta_floor ** -3 - delta_ceiling ** -3
        ) / 3.0
        integral_six = (
            delta_floor ** -5 - delta_ceiling ** -5
        ) / 5.0
        sobolev_constant = (
            8.0 * integral_four / (span * math.sin(epsilon) ** 4)
            + 32.0 * span * integral_six / math.sin(epsilon) ** 4
        )

        for theta in (-2.2, -0.7, 0.0, 1.3, 2.2):
            endpoint = multiplier(alpha, h_value, 0.0, theta)
            maximum_remainder = 0.0
            for index in range(81):
                delta = delta_floor + span * index / 80.0
                stieltjes = geometric_tail(
                    alpha,
                    h_value,
                    theta,
                    delta,
                    1,
                )
                remainder = stieltjes - endpoint / delta
                derivative = (
                    -geometric_tail(
                        alpha,
                        h_value,
                        theta,
                        delta,
                        2,
                    )
                    + endpoint / delta**2
                )
                self.assertLessEqual(
                    abs(remainder),
                    2.0
                    * h_value
                    * abs(endpoint)
                    / (math.sin(epsilon) ** 2 * delta**2)
                    + 2e-13,
                )
                self.assertLessEqual(
                    abs(derivative),
                    4.0
                    * h_value
                    * abs(endpoint)
                    / (math.sin(epsilon) ** 2 * delta**3)
                    + 2e-13,
                )
                maximum_remainder = max(maximum_remainder, abs(remainder))
            self.assertLessEqual(
                maximum_remainder**2,
                sobolev_constant * h_value**2 * abs(endpoint) ** 2,
            )

    def test_exact_near_edge_kernel_correction(self) -> None:
        height = F(101)
        delta = F(3, 2)
        spacing = F(2, 7)
        gamma = height - delta
        amplitudes = (F(5, 3), F(-7, 4), F(11, 9), F(-2, 5))
        direct = F(0)
        stieltjes = F(0)
        correction = F(0)
        for index, amplitude in enumerate(amplitudes):
            offset = F(index) * spacing
            kernel = gamma**2 / (gamma**2 - (height + offset) ** 2)
            factor = (
                2 * gamma**2 / (height * (2 * height + offset - delta))
                - 1
            )
            reconstructed = (
                -height
                / 2
                / (delta + offset)
                * (1 + factor)
            )
            self.assertEqual(kernel, reconstructed)
            direct += amplitude * kernel
            stieltjes += amplitude / (delta + offset)
            correction += amplitude * factor / (delta + offset)
        self.assertEqual(direct, -height * (stieltjes + correction) / 2)

    def test_relative_remainders_imply_conservative_row_bound(self) -> None:
        height = F(100)
        shell_width = F(6)
        epsilon = 1 / (16 * shell_width)
        endpoint = F(1)
        stieltjes = endpoint / shell_width - endpoint / (2 * shell_width)
        correction = -epsilon * endpoint
        cauchy = -height * (stieltjes + correction) / 2
        row_remainder = epsilon * height * endpoint
        endpoint_remainder = epsilon * endpoint
        ratio = abs(cauchy + row_remainder) / abs(
            endpoint + endpoint_remainder
        )
        self.assertGreaterEqual(ratio, height / (16 * shell_width))

    def test_ceiling_enclosure_and_micro_window_jump_count(self) -> None:
        def smooth_x(length: float) -> float:
            return math.exp(length / 2.0) * length**3

        def smooth_height(length: float) -> float:
            return 2.0 * math.pi * math.exp(length / 2.0) * length**2

        def carrier_height(length: float) -> float:
            return (
                2.0
                * math.pi
                * (math.ceil(smooth_x(length)) + 1)
                / length
            )

        for length in (10.0, 14.0, 20.0):
            carrier = carrier_height(length)
            smooth = smooth_height(length)
            self.assertGreaterEqual(
                carrier + 1e-12,
                smooth + 2.0 * math.pi / length,
            )
            self.assertLess(
                carrier,
                smooth + 4.0 * math.pi / length + 1e-12,
            )

        amplitude = 4.0
        for left in (14.0, 18.0, 22.0):
            carrier = carrier_height(left)
            right = left + amplitude / carrier
            jump_count = (
                math.ceil(smooth_x(right)) - math.ceil(smooth_x(left))
            )
            self.assertGreaterEqual(jump_count, 1)
            self.assertLessEqual(jump_count, math.ceil(amplitude * left))
            smooth_sweep = smooth_height(right) - smooth_height(left)
            first_order_sweep = amplitude * (0.5 + 2.0 / left)
            self.assertAlmostEqual(
                smooth_sweep,
                first_order_sweep,
                delta=0.02,
            )

    def test_hsw_margin_and_exact_phase_average_constants(self) -> None:
        hsw_width = 4.0 * math.pi * 0.103787
        self.assertAlmostEqual(hsw_width, 1.304225906952, places=11)
        amplitude = 4.0
        delta = 1.0
        shell_width = 6.0
        margin = shell_width - delta - amplitude / 2.0 - hsw_width
        self.assertGreater(margin, 0.0)
        self.assertAlmostEqual(
            margin / (2.0 * math.pi),
            shell_width / (2.0 * math.pi)
            - delta / (2.0 * math.pi)
            - amplitude / (4.0 * math.pi)
            - 2.0 * 0.103787,
        )

        phase_constant = 0.5 - abs(math.sin(amplitude / 2.0)) / amplitude
        self.assertGreaterEqual(phase_constant, 0.5 - 1.0 / amplitude)
        left = 1.234
        for carrier in (1e4, 1e6, 1e8):
            gamma = carrier - 2.0
            interval_length = amplitude / carrier
            right = left + interval_length
            average = (
                0.5
                - (math.sin(gamma * right) - math.sin(gamma * left))
                / (2.0 * gamma * interval_length)
            )
            exact_lower = (
                0.5
                - abs(math.sin(gamma * interval_length / 2.0))
                / (gamma * interval_length)
            )
            self.assertGreaterEqual(average + 2e-14, exact_lower)
            self.assertGreaterEqual(exact_lower, phase_constant - 2e-4)

        limiting_coefficient = (
            phase_constant * margin / (512.0 * math.pi * shell_width**2)
        )
        self.assertGreater(limiting_coefficient, 0.0)

    def test_exact_q_weighted_joint_identity_and_strict_branches(self) -> None:
        lengths = (F(20), F(21), F(22))
        endpoints = (F(2), F(-3), F(5, 2))
        row_energies = (F(7), F(11, 2), F(13))
        direct_denominator = F(0)
        q_weighted_rows = F(0)
        direct_endpoint = F(0)
        q_weighted_endpoint = F(0)
        for length, endpoint, row_energy in zip(
            lengths,
            endpoints,
            row_energies,
        ):
            q_squared = F(4, 1) / length
            direct_denominator += q_squared * row_energy
            q_weighted_rows += q_squared * row_energy
            direct_endpoint += q_squared * endpoint**2
            q_weighted_endpoint += q_squared * endpoint**2
        self.assertEqual(direct_denominator, q_weighted_rows)
        self.assertEqual(direct_endpoint, q_weighted_endpoint)

        self.assertEqual(endpoint_eta_squared(F(0), F(5), F(7)), 0)
        with self.assertRaises(ValueError):
            endpoint_eta_squared(F(0), F(5), F(0))

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(
            compiler,
            "pdflatex is required for TeX regression",
        )
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 30)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\usepackage{mathrsfs}\n"
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
        self.assertNotIn(r",qquad", self.text)
        self.assertNotIn(r",quad", self.text)
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "exact Fourier multiplier",
            "typical only with respect to endpoint-tail squared energy",
            "Exact near-edge kernel",
            "exact ceiling enclosure",
            "`O_A(L_0)` ceiling jumps",
            "carrier-continuous convention",
            "conditional implication from a uniform relative Stokes theorem",
            "separate averages cannot be inserted",
            "one-vector joint Hardy--Cauchy inequality",
            "turn (6.2) exactly into",
            "standard eight are unchanged",
            "no serialized artifact",
            "P0_INVALIDATED",
            "does not prove that theorem",
            "`D_N=0` is outside the frozen strict quotient",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        lowered = normalized.lower()
        forbidden = (
            "eta_n^pr=o(1) is proved",
            "the finite-lambda stokes transfer is proved",
            "the amplitude lower bound follows from hsw",
            "every micro interval contains a good amplitude point",
            "the riemann hypothesis is proved",
            "actual arithmetic sign is negative",
            "uniform lower frame for arbitrary coefficient vectors",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
