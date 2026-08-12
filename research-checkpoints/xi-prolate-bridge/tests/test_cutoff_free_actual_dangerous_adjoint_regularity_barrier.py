#!/usr/bin/env python3
"""Strict regressions for the actual-dangerous adjoint regularity barrier.

The algebraic fixtures use exact ``Fraction`` arithmetic where possible.
The test reads no zero table, cached ground, prolate artifact, or network
resource.
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
    "CUTOFF_FREE_ACTUAL_DANGEROUS_ADJOINT_REGULARITY_BARRIER.md"
)
NOTE_HASH = "76bed7bff24f2bdced30c357d3a61b7cbcc16964085901070f723035aeb92337"

FROZEN = {
    "notes/CUTOFF_FREE_MULTIPLIER_DANGEROUS_PROLATE_CROSS_ANGLE_BARRIER.md":
        "bfabbf6b7c4879d027e4ea1be8e1103b22468519b2bd68aa0d121642000120ed",
    "tests/test_cutoff_free_multiplier_dangerous_prolate_cross_angle_barrier.py":
        "dd91d397332f3096f531e0c8742e1752891d53c1c257a9a78d82dcef67dc002a",
    "notes/CUTOFF_FREE_FULL_SOURCE_ADJOINT_PROLATE_CAPTURE_BARRIER.md":
        "157bffc55aeec592c263d5973effe1b9506e02dd97311652ecb2fdee0c3ff0e9",
    "tests/test_cutoff_free_full_source_adjoint_prolate_capture_barrier.py":
        "d7f70dffbd10021ce7d6e8887d10589a482b2dc64c9ebbe8c48cc35568c233ae",
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md":
        "c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81",
    "tests/test_parity_multiplier_schur.py":
        "94ee818e2747e703d521cfa2a980765569cccfdf442b700b1a6b33ac4ceababb",
    "notes/CUTOFF_FREE_BRIDGE_MIXED_ADJOINT_TAIL_PREFACTOR_REDUCTION.md":
        "53dd9fefd8cc05a29cd3e0a043e6f86f8bbdc7545d2c203d29bc59cbbe1a04f8",
    "tests/test_cutoff_free_bridge_mixed_adjoint_tail_prefactor_reduction.py":
        "e532a958742feda3efe00adc37e1ea2879a3676f23b63a47c238e348aaf5b17c",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def actual_support_radius(amplitude: float) -> float:
    if amplitude <= 0:
        return 0.0
    return 0.5 * math.sqrt(math.exp(2.0 * amplitude) - 1.0)


def multiplier_envelope(amplitude: float, frequency: float) -> float:
    return max(0.0, amplitude - 0.5 * math.log1p(4.0 * frequency**2))


def variation_constant(
    lambda_value: float,
    derivative_ratio: float,
) -> float:
    length = 2.0 * math.log(lambda_value)
    count = math.ceil(lambda_value**2) - 1
    harmonic = sum(1.0 / index for index in range(1, count + 1))
    return (
        2.0
        * harmonic
        * (
            math.sqrt(lambda_value - 1.0 / lambda_value)
            * (derivative_ratio + 0.5)
            + math.sqrt(lambda_value)
            * (
                length ** (-0.5)
                + math.sqrt(length / 3.0) * derivative_ratio
            )
        )
        + math.sqrt(
            (lambda_value - 1.0 / lambda_value) * harmonic * count
        )
        / lambda_value
    )


class CutoffFreeActualDangerousAdjointRegularityBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 8)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_actual_multiplier_envelope_has_the_exact_support_radius(self) -> None:
        amplitude = 3.0
        radius = actual_support_radius(amplitude)
        self.assertAlmostEqual(
            0.5 * math.log1p(4.0 * radius**2),
            amplitude,
            places=13,
        )
        self.assertGreater(multiplier_envelope(amplitude, 0.0), 0.0)
        self.assertEqual(multiplier_envelope(amplitude, 1.01 * radius), 0.0)
        self.assertEqual(actual_support_radius(0.0), 0.0)
        self.assertEqual(actual_support_radius(-1.0), 0.0)

        for fraction in (0.0, 0.25, 0.75, 1.0):
            frequency = fraction * radius
            self.assertGreaterEqual(
                multiplier_envelope(amplitude, frequency),
                0.0,
            )
            self.assertLessEqual(
                multiplier_envelope(amplitude, frequency),
                amplitude,
            )

    def test_dangerous_spectral_inverse_gives_the_derivative_bound(self) -> None:
        # A discrete Fourier fixture for the proof of (2.5).  The threshold
        # retains the first two positive multiplier eigenvalues.
        frequencies = (F(-3), F(-1), F(2))
        multiplier = (F(4), F(2), F(1, 2))
        threshold = F(2)
        y_value = (F(3), F(4), F(0))
        inverse_image = tuple(
            value / weight if weight >= threshold else F(0)
            for value, weight in zip(y_value, multiplier)
        )
        y_norm_squared = sum(value**2 for value in y_value)
        x_norm_squared = sum(value**2 for value in inverse_image)
        self.assertLessEqual(x_norm_squared, y_norm_squared / threshold**2)

        derivative_norm_squared = sum(
            frequency**2 * value**2
            for frequency, value in zip(frequencies, y_value)
        )
        amplitude = F(4)
        radius = F(3)
        certified = (amplitude * radius / threshold) ** 2 * y_norm_squared
        self.assertEqual(derivative_norm_squared, F(97))
        self.assertLessEqual(derivative_norm_squared, certified)

    def test_literal_adjoint_breakpoint_and_endpoint_jet_constants(self) -> None:
        # lambda=4 makes sqrt(lambda) rational.  The first jump is the new
        # summand evaluated at x=n/lambda.
        lambda_value = F(4)
        sqrt_lambda = F(2)
        index = F(3)
        endpoint_value = F(5)
        jump = sqrt_lambda * endpoint_value / (2 * index)
        self.assertEqual(jump, F(5, 3))

        order = 2
        endpoint_jet = F(7)
        derivative_jump = (
            sqrt_lambda
            * lambda_value**order
            * endpoint_jet
            / (2 * index ** (order + 1))
        )
        factored_jump = (
            sqrt_lambda
            / (2 * index)
            * (lambda_value / index) ** order
            * endpoint_jet
        )
        self.assertEqual(derivative_jump, F(112, 27))
        self.assertEqual(derivative_jump, factored_jump)

    def test_endpoint_trace_and_bv_constants_are_explicit(self) -> None:
        # Check the exact endpoint trace estimate on an affine function over
        # an interval of length six.
        length = F(6)
        intercept = F(2)
        slope = F(-1, 3)
        function_norm_squared = (
            intercept**2 * length
            + intercept * slope * length**2
            + slope**2 * length**3 / 3
        )
        derivative_norm_squared = slope**2 * length
        right_side = (
            math.sqrt(float(function_norm_squared / length))
            + math.sqrt(float(length * derivative_norm_squared / 3))
        )
        self.assertLessEqual(abs(float(intercept)), right_side + 1e-14)

        # Even after deleting the derivative term, the BV plus coarse row
        # floor certificate is already vacuous on this sample schedule.
        errors = []
        for lambda_value in (4.0, 8.0, 16.0):
            variation = variation_constant(lambda_value, 0.0)
            # Use the favorable M_mu=1 and d_(R+2)=1.
            normalized = math.sqrt(2.0) * lambda_value * variation
            error = normalized**2 / (2.0 * math.pi**2 * lambda_value)
            errors.append(error)
            self.assertGreater(error, 1.0)
        self.assertGreater(errors[1], errors[0])
        self.assertGreater(errors[2], errors[1])

    def test_exact_leakage_to_prefix_reduction_and_bridge_reserve(self) -> None:
        defects = (F(1, 100), F(1, 10), F(1, 2), F(3, 4))
        coefficients = (F(2), F(3), F(4), F(5))
        leakage = sum(
            defect * coefficient**2
            for defect, coefficient in zip(defects, coefficients)
        )
        tail_norm_squared = coefficients[2] ** 2 + coefficients[3] ** 2
        next_defect = defects[2]
        self.assertLessEqual(next_defect * tail_norm_squared, leakage)

        total_norm_squared = sum(value**2 for value in coefficients)
        prefix_norm_squared = sum(value**2 for value in coefficients[:2])
        lower_prefix = total_norm_squared - leakage / next_defect
        self.assertGreaterEqual(prefix_norm_squared, lower_prefix)

        delta_e = F(1, 5)
        certified_error = F(1, 4)
        self.assertLess(certified_error, 1 - delta_e)
        self.assertGreater(1 - certified_error, delta_e)

    def test_safe_piece_can_cancel_jumps_and_prefix_coefficients(self) -> None:
        dangerous_endpoint = F(5)
        safe_endpoint = F(-5)
        self.assertEqual(dangerous_endpoint + safe_endpoint, 0)

        dangerous = (F(3), F(0))
        safe = (F(-2), F(4))
        total = tuple(left + right for left, right in zip(dangerous, safe))
        dangerous_energy = sum(value**2 for value in dangerous)
        safe_energy = sum(value**2 for value in safe)
        signed_cross = 2 * sum(
            left * right for left, right in zip(dangerous, safe)
        )
        total_energy = sum(value**2 for value in total)
        self.assertEqual(total_energy, dangerous_energy + safe_energy + signed_cross)
        self.assertEqual(signed_cross, F(-12))
        self.assertEqual(total_energy, F(17))

    def test_buffered_commutator_constant_is_sharp(self) -> None:
        # Spectral points t+h=4 and t-h=2 with h=1.  For an off-diagonal
        # entry c=3, [T,C] has corner (4-2)c=6, and division by 2h is exact.
        upper_spectrum = F(4)
        lower_spectrum = F(2)
        off_diagonal = F(3)
        gap_half_width = F(1)
        commutator_corner = (
            upper_spectrum - lower_spectrum
        ) * off_diagonal
        bound = abs(commutator_corner) / (2 * gap_half_width)
        self.assertEqual(bound, abs(off_diagonal))

        # A spectral point at the hard threshold belongs to the gray band
        # for every positive buffer and is not part of the separated corner.
        threshold = F(3)
        spectrum = (F(4), F(3), F(2))
        gray = tuple(
            value for value in spectrum
            if threshold - gap_half_width < value < threshold + gap_half_width
        )
        self.assertEqual(gray, (F(3),))

    def test_qualitative_finite_capture_has_no_near_shannon_rate(self) -> None:
        # Two normalized image columns in a four-coordinate complete basis.
        # A finite prefix eventually captures both, but the first two
        # coordinates do not have a uniform floor.
        columns = (
            (F(1), F(0), F(0), F(0)),
            (F(0), F(0), F(3, 5), F(4, 5)),
        )
        prefix_two_energies = tuple(sum(value**2 for value in col[:2]) for col in columns)
        prefix_four_energies = tuple(sum(value**2 for value in col) for col in columns)
        self.assertEqual(prefix_two_energies, (F(1), F(0)))
        self.assertEqual(prefix_four_energies, (F(1), F(1)))

    def test_note_contract_and_claim_boundary(self) -> None:
        required = (
            r"v(t)=[g+U-m_\lambda(t)]_+",
            r"\mathcal A_\lambda",
            r"T_\lambda={1\over2}\sqrt{e^{2\mathcal A_\lambda}-1}",
            r"\operatorname {supp}v\subset[-T_\lambda,T_\lambda]",
            r"\Pi_\vartheta={\bf1}_{[\vartheta,\infty)}(T_v)",
            r"\|\widetilde y^{(k)}\|_{L^2(\mathbb R)}",
            r"{\mathcal A_\lambda T_\lambda^k\over\vartheta}",
            r"\|y\|_2,\qquad s\in\mathbb R",
            r"z(a_n+)-z(a_n-)",
            r"{\sqrt\lambda\over2n}\,y(-L/2)",
            r"{\lambda^{r+1/2}\over2n^{r+1}}\,y^{(r)}(-L/2)",
            r"\operatorname {Var}(A_{\lambda,0}^*y)",
            r"L^{-1/2}\|y\|_2+\sqrt{L/3}\,\|y'\|_2",
            r"\mathcal W_{\lambda,\vartheta}",
            "Let `R` be a nonnegative even integer",
            r"2\pi^2\lambda d_{R+2}(1-\delta_{E_R})",
            r"\mathfrak G_E",
            r"D_E^*S_E+S_E^*D_E",
            r"\Pi_\vartheta C_E\Pi_\vartheta",
            r"P_YC_EP_Y\succeq\gamma_E P_YCP_Y",
            r"\|\Pi_+C_E\Pi_-\|",
            r"{1\over2h}",
            r"\Pi_0={\bf1}_{(t-h,t+h)}(T_v)",
            "actual-versus-synthetic distinction",
            "exp(T_lambda |Im s|)",
            "quantitatively vacuous",
            "standard eight are untouched",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.normalized)

        forbidden = (
            "actual bridge gate is proved",
            "actual cross-angle is proved",
            "proves RH",
            "actual-prime countermodel",
            "actual prime countermodel",
            "TO_BE_FROZEN",
            "DRAFT RESULT",
            "+sqrt{",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        pointwise_displays = [
            display for display in displays if r"\tag{2.6}" in display
        ]
        self.assertEqual(len(pointwise_displays), 1)
        self.assertIn(r"s\in\mathbb R", pointwise_displays[0])

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
