#!/usr/bin/env python3
"""Strict regressions for the critical two-branch covariance barrier."""

from __future__ import annotations

import ast
import cmath
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
NOTE = (
    ROOT
    / "notes"
    / "CRITICAL_NEAR_NYQUIST_TWO_BRANCH_BLOCK_COVARIANCE_BARRIER.md"
)
NOTE_HASH = "b4d43f3c92e58aa164b78379e2f27761ddc7a9033dfa4aea8a983c29675de052"

FROZEN = {
    "notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md":
        "2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87",
    "tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py":
        "d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97",
    "notes/ADAPTIVE_GONEK_ENDPOINT_FILTER_SELECTION_THEOREM.md":
        "7354d464d4a3d53cb32c83b941a24aac60c5cbbf9b87c5bf56a907193459bd46",
    "tests/test_adaptive_gonek_endpoint_filter_selection_theorem.py":
        "e8e96cab5e5bd817650c0f323f248d00772802e439474b1f9d890083f8ca6396",
    "notes/FIXED_GRID_PHASE_ALIAS_PRIME_DIVISOR_SHIFTED_CONVOLUTION_BARRIER.md":
        "226a3fcc9e6703d42ae7fed78b2e0d9a368f42313653cb1d175b28a1db3a8b20",
    "tests/test_fixed_grid_phase_alias_prime_divisor_shifted_convolution_barrier.py":
        "3fb091af871010e07e77c4f89a77615f4f1bae899b3bfb65dc9e474003d8f416",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def lerch_phi_one(q: complex, x_value: float, tolerance: float = 1e-14) -> complex:
    """Direct absolutely convergent Phi(q,1,x), with a tail bound."""
    total = 0.0j
    power = 1.0 + 0.0j
    modulus = abs(q)
    self_gap = 1.0 - modulus
    if not 0.0 < self_gap < 1.0:
        raise ValueError("q must lie strictly inside the unit disk")
    for index in range(2_000_000):
        total += power / (index + x_value)
        power *= q
        tail_bound = (
            abs(power) / (index + 1 + x_value) / self_gap
        )
        if tail_bound < tolerance:
            return total
    raise RuntimeError("Lerch series did not converge")


def lerch_ratio(
    length: int,
    z_value: complex,
    x_value: float,
) -> complex:
    spacing = 2.0 * math.pi / length
    q_value = cmath.exp(-z_value * spacing)
    return (
        (1.0 - q_value)
        / spacing
        * lerch_phi_one(q_value, x_value)
    )


def gram_v(block_length: int, delta: float) -> list[list[float]]:
    gram = [[0.0, 0.0], [0.0, 0.0]]
    for index in range(block_length):
        cosine = math.cos(index * delta)
        negative_sine = -math.sin(index * delta)
        gram[0][0] += cosine * cosine
        gram[0][1] += cosine * negative_sine
        gram[1][0] += negative_sine * cosine
        gram[1][1] += negative_sine * negative_sine
    return gram


def multiply(left: list[list[float]], right: list[list[float]]) -> list[list[float]]:
    return [
        [
            sum(left[row][inner] * right[inner][column] for inner in range(2))
            for column in range(2)
        ]
        for row in range(2)
    ]


def transpose(matrix: list[list[float]]) -> list[list[float]]:
    return [[matrix[column][row] for column in range(2)] for row in range(2)]


def determinant(matrix: list[list[float]]) -> float:
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def generalized_gain(block_length: int, delta: float, ratio: complex) -> float:
    """Minimum ||V M(r)b||/||Vb|| from the exact two-by-two pencil."""
    gram = gram_v(block_length, delta)
    multiplier = [
        [ratio.real, -ratio.imag],
        [ratio.imag, ratio.real],
    ]
    row_gram = multiply(transpose(multiplier), multiply(gram, multiplier))
    gram_det = determinant(gram)
    if gram_det <= 0.0:
        return 0.0
    trace_pencil = (
        gram[1][1] * row_gram[0][0]
        + gram[0][0] * row_gram[1][1]
        - 2.0 * gram[0][1] * row_gram[0][1]
    ) / gram_det
    determinant_pencil = determinant(row_gram) / gram_det
    discriminant = max(
        0.0,
        trace_pencil * trace_pencil - 4.0 * determinant_pencil,
    )
    root = math.sqrt(discriminant)
    smallest_squared = (
        2.0 * determinant_pencil / (trace_pencil + root)
    )
    return math.sqrt(max(0.0, smallest_squared))


def two_cutoff_exact_smallest(delta: float, ratio: complex) -> float:
    tau = (
        2.0 * abs(ratio) ** 2
        + 4.0 * ratio.imag ** 2 / math.tan(delta) ** 2
    )
    determinant_squared = abs(ratio) ** 4
    discriminant = max(0.0, tau * tau - 4.0 * determinant_squared)
    smallest_squared = 2.0 * determinant_squared / (
        tau + math.sqrt(discriminant)
    )
    return math.sqrt(smallest_squared)


def moving_offset_rms(
    length: int,
    z_value: float,
    x_value: float,
    block_length: int,
) -> tuple[float, float]:
    spacing = 2.0 * math.pi / length
    q_value = math.exp(-z_value * spacing)
    powers: list[float] = []
    power = 1.0
    for index in range(2_000_000):
        powers.append(power)
        power *= q_value
        tail_bound = power / (index + 1 + x_value) / (1.0 - q_value)
        if tail_bound < 1e-13:
            break
    else:
        raise RuntimeError("moving-offset series did not converge")

    values = []
    multiplier = (1.0 - q_value) / spacing
    for offset in range(block_length):
        phi = sum(
            power_value / (index + x_value + offset)
            for index, power_value in enumerate(powers)
        )
        values.append(multiplier * phi)
    rms = math.sqrt(sum(value * value for value in values) / block_length)
    return rms, values[0]


class CriticalNearNyquistTwoBranchBlockCovarianceBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 6)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_critical_schedule_and_lerch_constant(self) -> None:
        for d_value in (0.18, 0.3, 0.49):
            self.assertGreater(d_value, 1.0 / (2.0 * math.pi))
            self.assertLess(d_value, 0.5)
            self.assertAlmostEqual(
                1.0 / (2.0 * math.pi * d_value),
                1.0 / (2.0 * math.pi * d_value),
                places=15,
            )
            beta = 0.5 * math.log(d_value)
            self.assertLess(beta, 0.0)

        z_value = math.pi / 4.0 + 0.61j
        scaled_errors = []
        raw_errors = []
        for length in (160, 320, 640):
            spacing = 2.0 * math.pi / length
            exact = lerch_ratio(length, z_value, 0.5)
            asymptotic = z_value * (
                math.log(1.0 / spacing)
                - cmath.log(z_value)
                + 2.0 * math.log(2.0)
            )
            error = abs(exact - asymptotic)
            raw_errors.append(error)
            scaled_errors.append(error / (spacing * math.log(1.0 / spacing)))
        self.assertGreater(raw_errors[0], raw_errors[-1])
        self.assertLess(max(scaled_errors), 4.0)
        self.assertLess(raw_errors[-1], 0.08)

        # The exact x=1 identity fixes the logarithm normalization.
        length = 400
        spacing = 2.0 * math.pi / length
        q_value = cmath.exp(-z_value * spacing)
        phi_one = -cmath.log(1.0 - q_value) / q_value
        direct_ratio = (1.0 - q_value) / spacing * phi_one
        series_ratio = lerch_ratio(length, z_value, 1.0)
        self.assertLess(abs(direct_ratio - series_ratio), 2e-12)

    def test_exact_two_cutoff_singular_collapse(self) -> None:
        d_value = 0.3
        beta = 0.5 * math.log(d_value)
        z_value = math.pi / 4.0 - 1j * beta
        normalized = []
        for length in (240, 480, 960):
            spacing = 2.0 * math.pi / length
            delta = beta * spacing
            ratio = lerch_ratio(length, z_value, 0.5)
            pencil_gain = generalized_gain(2, delta, ratio)
            exact_gain = two_cutoff_exact_smallest(delta, ratio)
            self.assertAlmostEqual(pencil_gain, exact_gain, places=9)
            scale = 0.5 * abs(z_value) ** 2 * spacing * math.log(length)
            normalized.append(exact_gain / scale)
            self.assertLess(exact_gain / math.log(length), 0.02)
        self.assertLess(abs(normalized[-1] - 1.0), 0.18)
        self.assertLess(abs(normalized[-1] - 1.0), abs(normalized[0] - 1.0))

        # The explicit b=i/r direction kills the first row exactly.
        length = 500
        spacing = 2.0 * math.pi / length
        delta = beta * spacing
        ratio = lerch_ratio(length, z_value, 0.5)
        b_value = 1j / ratio
        c_zero = (ratio * b_value).real
        c_one = (ratio * b_value * cmath.exp(1j * delta)).real
        e_zero = b_value.real
        self.assertAlmostEqual(c_zero, 0.0, places=14)
        self.assertAlmostEqual(c_one, -math.sin(delta), places=13)
        self.assertGreater(abs(e_zero), 1e-3)

    def test_fixed_and_growing_block_scales(self) -> None:
        d_value = 0.3
        beta = 0.5 * math.log(d_value)
        z_value = math.pi / 4.0 - 1j * beta

        fixed_scaled = []
        for length in (300, 600, 1200):
            spacing = 2.0 * math.pi / length
            ratio = lerch_ratio(length, z_value, 0.5)
            gain = generalized_gain(5, beta * spacing, ratio)
            fixed_scaled.append(gain / (5.0 * spacing * math.log(length)))
            self.assertLess(gain / math.log(length), 0.04)
        self.assertLess(max(fixed_scaled) / min(fixed_scaled), 1.35)

        growing_scaled = []
        for length in (400, 900, 1600):
            spacing = 2.0 * math.pi / length
            block_length = int(math.sqrt(length))
            ratio = lerch_ratio(length, z_value, 0.5)
            gain = generalized_gain(block_length, beta * spacing, ratio)
            growing_scaled.append(
                gain / (block_length * spacing * math.log(length))
            )
            self.assertLess(gain / math.log(length), 0.25)
        self.assertLess(max(growing_scaled) / min(growing_scaled), 1.45)

        # R=Theta(L) repairs only the isolated, freshly recentered pair.
        for length in (300, 600, 1200):
            spacing = 2.0 * math.pi / length
            block_length = math.ceil(length / (2.0 * abs(beta)))
            ratio = lerch_ratio(length, z_value, 0.5)
            gain = generalized_gain(block_length, beta * spacing, ratio)
            self.assertGreater(gain / math.log(length), 0.35)

    def test_moving_offset_loses_logarithmic_rms(self) -> None:
        z_value = math.pi / 4.0
        ratios = []
        rms_values = []
        for length in (128, 256, 512):
            block_length = length // 4
            rms, first = moving_offset_rms(
                length,
                z_value,
                0.5,
                block_length,
            )
            rms_values.append(rms)
            ratios.append(rms / first)
            self.assertLess(rms, 2.5)
        self.assertLess(max(rms_values) / min(rms_values), 1.25)
        self.assertGreater(ratios[0], ratios[-1])
        self.assertLess(ratios[-1], 0.7)

    def test_exact_finite_mode_vandermonde_nullspace(self) -> None:
        block_length = 3
        nodes = [F(1), F(2), F(3), F(4)]
        barycentric = []
        for index, node in enumerate(nodes):
            product = F(1)
            for other_index, other in enumerate(nodes):
                if index != other_index:
                    product *= node - other
            barycentric.append(F(1) / product)

        for power in range(block_length):
            self.assertEqual(
                sum(
                    (weight * node ** power for weight, node in zip(barycentric, nodes)),
                    F(0),
                ),
                F(0),
            )
        self.assertEqual(
            sum(
                (
                    weight * node ** block_length
                    for weight, node in zip(barycentric, nodes)
                ),
                F(0),
            ),
            F(1),
        )

        row_symbols = [F(2), F(3), F(5), F(7)]
        ratios = [F(1), F(2), F(4), F(8)]
        amplitudes = [
            weight / symbol
            for weight, symbol in zip(barycentric, row_symbols)
        ]
        endpoint_symbols = [
            symbol / ratio
            for symbol, ratio in zip(row_symbols, ratios)
        ]
        row_samples = []
        endpoint_samples = []
        for power in range(block_length):
            row_samples.append(
                sum(
                    (
                        amplitude * symbol * node ** power
                        for amplitude, symbol, node in zip(
                            amplitudes, row_symbols, nodes
                        )
                    ),
                    F(0),
                )
            )
            endpoint_samples.append(
                sum(
                    (
                        amplitude * symbol * node ** power
                        for amplitude, symbol, node in zip(
                            amplitudes, endpoint_symbols, nodes
                        )
                    ),
                    F(0),
                )
            )
        self.assertEqual(row_samples, [F(0), F(0), F(0)])
        self.assertNotEqual(endpoint_samples, [F(0), F(0), F(0)])

    def test_covariance_eigenvalues_and_alias_survival(self) -> None:
        block_length = 8
        delta = math.pi / 8.0
        weights = [1.0] * block_length
        weighted_gram = [[0.0, 0.0], [0.0, 0.0]]
        for index, weight in enumerate(weights):
            cosine = math.cos(index * delta)
            negative_sine = -math.sin(index * delta)
            weighted_gram[0][0] += weight * weight * cosine * cosine
            weighted_gram[0][1] += weight * weight * cosine * negative_sine
            weighted_gram[1][0] += weight * weight * negative_sine * cosine
            weighted_gram[1][1] += weight * weight * negative_sine * negative_sine
        weight_sum = sum(weight * weight for weight in weights)
        covariance = sum(
            weight * weight * cmath.exp(2j * index * delta)
            for index, weight in enumerate(weights)
        )
        trace = weighted_gram[0][0] + weighted_gram[1][1]
        discriminant = math.sqrt(
            (weighted_gram[0][0] - weighted_gram[1][1]) ** 2
            + 4.0 * weighted_gram[0][1] ** 2
        )
        direct_eigenvalues = ((trace - discriminant) / 2.0, (trace + discriminant) / 2.0)
        formula_eigenvalues = ((weight_sum - abs(covariance)) / 2.0, (weight_sum + abs(covariance)) / 2.0)
        for direct, formula in zip(direct_eigenvalues, formula_eigenvalues):
            self.assertAlmostEqual(direct, formula, places=12)
        self.assertGreater(direct_eigenvalues[0], 3.9)

        carrier_weights = [0.0] * block_length
        self.assertEqual(sum(value * value for value in carrier_weights), 0.0)

        length = 37.0
        spacing = 2.0 * math.pi / length
        omega = 0.413
        coefficients = [2.0, -1.0, 3.0, 0.5, -4.0]
        responses = []
        for alias in (-1, 0, 1):
            responses.append(
                sum(
                    coefficient
                    * cmath.exp(
                        -1j
                        * (omega + alias * length)
                        * index
                        * spacing
                    )
                    for index, coefficient in enumerate(coefficients)
                )
            )
        self.assertLess(abs(responses[0] - responses[1]), 2e-14)
        self.assertLess(abs(responses[2] - responses[1]), 2e-14)

    def test_claim_boundary_and_exact_tokens(self) -> None:
        required = (
            "P0_INVALIDATED",
            "unbound post-checkpoint-1.51 pair",
            "z\\log L+O(1)",
            "Write `m=N+1`, so that `T=mh`",
            "g_R=\\Theta_{\\mathcal D,x}(Rh\\log L)",
            "g_R(r,\\delta)\\geq",
            "\\sum_{k\\geq0}h\\,{e^{-zhk}\\over hk+h(x+j)}",
            "C_R=0",
            "E_R\\ne0",
            "{W\\pm|A|\\over2}",
            "e^{-ikLt_j}=e^{-2\\pi ikj}=1",
            "{qm\\over Qn}",
            "{qmn\\over Q}",
            "prime-power/divisor shifted-convolution",
            "does not assert that the actual Riemann--Siegel",
            "Nothing here claims an actual coefficient failure",
            "project remains fail-closed",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "we prove RH",
            "RH is proved",
            "actual Hardy source fails",
            "actual coefficient vector lies in",
            "fixed-grid theorem is proved",
            "finite strict gate is closed",
            "standard eight are changed",
            "g_R(r,\\delta)geq",
            "\\sum_{k\\geq0}h,{e^{-zhk}\\over hk+h(x+j)}",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 75)
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

    def test_static_ascii_ast_and_cache_clean(self) -> None:
        self.note_bytes.decode("ascii")
        test_text = Path(__file__).read_text(encoding="ascii")
        ast.parse(test_text)
        self.assertNotRegex(self.text, r"(?<!\\)\$\$")
        self.assertNotIn("\\begin{equation}", self.text)
        self.assertNotIn("\\end{equation}", self.text)
        cache_entries = [
            path
            for path in ROOT.rglob("__pycache__")
            if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
