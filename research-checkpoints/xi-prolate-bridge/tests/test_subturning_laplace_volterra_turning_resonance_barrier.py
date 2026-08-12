#!/usr/bin/env python3
"""Regressions for the subturning Laplace--Volterra resonance barrier."""

from __future__ import annotations

import ast
import cmath
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SUBTURNING_LAPLACE_VOLTERRA_TURNING_RESONANCE_BARRIER.md"
NOTE_HASH = "0c702f4adc6e6487d0511ce6f1dcce308996c943ff52423d100546288b4a3127"

FROZEN = {
    "notes/SUBTURNING_MINIMAL_RICCATI_EULER_CLOSURE_BARRIER.md":
        "faa787a3cc96fe83f41aeeec44b868feaa1e6755b90b925921e2448c3e029ac8",
    "tests/test_subturning_minimal_riccati_euler_closure_barrier.py":
        "6b2e347793020deb48730a3d11ce36c1f8f926e2c63768f376f1c4bbbd54a204",
    "notes/EXACT_PROLATE_MELLIN_RECURRENCE_BIRKHOFF_CONNECTION_BARRIER.md":
        "d1191bdc6f0d2edd0ae900e1a7d73f61cea7f78693e2074b6850df7aec36a041",
    "tests/test_exact_prolate_mellin_recurrence_birkhoff_connection_barrier.py":
        "836949d060b03d697574731aad2ede90241b2f6ccb29e58d123908218ef7955f",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def action(c_value: float, s_value: complex) -> complex:
    scaled = s_value / (2.0 * c_value)
    return c_value * (
        cmath.sqrt(1.0 + scaled * scaled)
        - 1.0
        - scaled * cmath.asinh(scaled)
    )


def polynomial(label: int, s_value: complex) -> complex:
    if label == 0:
        return 1.0 + 0.0j
    if label == 4:
        return 4.0 * s_value * (s_value - 1.0) + 3.0
    raise ValueError(label)


def rational_factor(label: int, s_value: complex) -> complex:
    return (
        (s_value + 2.0)
        / (s_value + 1.0)
        * polynomial(label, s_value + 4.0)
        / polynomial(label, s_value)
    )


def action_factor(label: int, c_value: float, s_value: complex) -> complex:
    return cmath.exp(
        action(c_value, s_value + label + 3.0)
        - action(c_value, s_value + label - 1.0)
    )


def radical(c_value: float, p_value: complex) -> complex:
    return (
        cmath.sqrt(p_value * p_value + 4.0 * c_value * c_value) - p_value
    ) / (2.0 * c_value)


class SubturningLaplaceVolterraTurningResonanceBarrierTests(unittest.TestCase):
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

    def test_exact_action_factorization(self) -> None:
        for label in (0, 4):
            c_value = 317.0
            s_value = 3.75 - 21.0j
            beta = label + 4.0
            z_value = s_value - 3.0
            direct = action_factor(label, c_value, s_value)

            def integrand(v_value: float) -> complex:
                return cmath.log(radical(c_value, z_value + beta + v_value))

            # The path remains in the right half-plane, so midpoint
            # quadrature uses the same analytic logarithm branch.
            count = 20_000
            step = 4.0 / count
            log_value = 0.0j
            for index in range(count):
                v_value = -2.0 + (index + 0.5) * step
                log_value += 0.5 * step * integrand(v_value)
            centered = cmath.exp(log_value)
            self.assertLess(abs(direct - centered), 2e-10)

    def test_label_four_partial_fraction_and_kernel(self) -> None:
        for s_value in (3.0, 4.25 + 2.0j, 11.0 - 7.5j):
            direct = rational_factor(4, s_value)
            partial = (
                1.0
                + 27.0 / (11.0 * (s_value + 1.0))
                + (288.0 * s_value + 1008.0)
                / (11.0 * (4.0 * s_value * s_value - 4.0 * s_value + 3.0))
            )
            self.assertLess(abs(direct - partial), 2e-13)

            z_value = s_value - 3.0
            omega = 1.0 / math.sqrt(2.0)
            kernel_transform = (
                1.0
                + (27.0 / 11.0) / (z_value + 4.0)
                + (72.0 / 11.0)
                * (z_value + 2.5)
                / ((z_value + 2.5) ** 2 + omega**2)
                + (288.0 * math.sqrt(2.0) / 11.0)
                * omega
                / ((z_value + 2.5) ** 2 + omega**2)
            )
            self.assertLess(abs(direct - kernel_transform), 2e-13)

    def test_bessel_laplace_identity(self) -> None:
        mp.mp.dps = 45
        for c_value, beta, z_value in ((1.5, 4.0, 1.25), (3.0, 8.0, 2.5)):
            integral = mp.quad(
                lambda u: mp.e ** (-(z_value + beta) * u)
                * 2
                * mp.besselj(2, 2 * c_value * u)
                / u,
                [0, 1, mp.inf],
            )
            p_value = mp.mpf(z_value + beta)
            expected = (
                (mp.sqrt(p_value**2 + 4 * c_value**2) - p_value)
                / (2 * c_value)
            ) ** 2
            self.assertLess(abs(integral - expected), mp.mpf("1e-35"))

    def test_exact_q_kernel(self) -> None:
        mp.mp.dps = 45
        c_value = mp.mpf("2.75")
        for beta, z_value in ((mp.mpf(4), mp.mpf("1.5")), (mp.mpf(8), mp.mpf(2))):
            def r_mp(p_value: mp.mpf) -> mp.mpf:
                return (
                    mp.sqrt(p_value**2 + 4 * c_value**2) - p_value
                ) / (2 * c_value)

            direct = mp.mpf("0.5") * mp.quad(
                lambda v: mp.log(r_mp(z_value + beta + v))
                - mp.log(r_mp(z_value + beta)),
                [-2, 2],
            )
            transformed = mp.quad(
                lambda u: mp.e ** (-(z_value + beta) * u)
                * mp.besselj(0, 2 * c_value * u)
                * (mp.sinh(2 * u) / u - 2)
                / u,
                [0, 1, mp.inf],
            )
            self.assertLess(abs(direct - transformed), mp.mpf("1e-34"))

    def test_j2_has_a_strict_negative_lobe(self) -> None:
        mp.mp.dps = 40
        first = mp.besseljzero(2, 1)
        second = mp.besseljzero(2, 2)
        midpoint = (first + second) / 2
        self.assertLess(mp.besselj(2, midpoint), 0)
        negative_mass = 2 * mp.quad(
            lambda value: mp.besselj(2, value) / value,
            [first, second],
        )
        self.assertLess(negative_mass, mp.mpf("-0.1"))

    def test_turning_symbol_converges_to_minus_one(self) -> None:
        for label in (0, 4):
            previous = 1.0
            for c_value in (1.0e3, 1.0e4, 1.0e5, 1.0e6):
                s_value = 3.0 + 2.0j * c_value
                alpha = rational_factor(label, s_value) * action_factor(
                    label, c_value, s_value
                )
                error = abs(alpha + 1.0)
                self.assertLess(error, previous)
                self.assertLess(error * math.sqrt(c_value), 8.0 + 2.0 * label)
                previous = error

    def test_turning_packet_rate_optimization(self) -> None:
        previous = math.inf
        for c_value in (1.0e4, 1.0e6, 1.0e8):
            width = c_value ** -0.25
            bound = (
                c_value**-0.5
                + width
                + c_value**-0.5 / width
                + 1.0 / (c_value * width)
            )
            self.assertLess(bound, 2.12 * c_value**-0.25)
            self.assertLess(bound, previous)
            previous = bound

    def test_positive_delay_exact_cells_and_sqrt_loss(self) -> None:
        ratios = []
        for c_value in (400, 1600, 6400, 25_600):
            cutoff = int(math.sqrt(c_value) / 4.0)
            lower = sum(
                math.exp(-(index * index + 5 * index) / c_value)
                for index in range(cutoff + 1)
            )
            self.assertGreater(lower, 0.18 * math.sqrt(c_value))
            ratios.append(lower / math.sqrt(c_value))
        self.assertGreater(min(ratios), 0.18)

        c_value = 101.0
        h_value = 1.0 / c_value
        amplitude = math.exp(-4.0 / c_value)
        x_value = 0.37 * h_value
        cells = [1.0]
        for index in range(1, 8):
            recurrence = -amplitude * math.exp(
                -2.0 * (x_value + (index - 1) * h_value)
            ) * cells[-1]
            exact = (-1.0) ** index * amplitude**index * math.exp(
                -2.0 * index * x_value - h_value * index * (index - 1)
            )
            self.assertAlmostEqual(recurrence, exact, places=14)
            cells.append(recurrence)

    def test_turning_frequency_is_outside_subturning_window(self) -> None:
        previous = 0.0
        for c_value in (1.0e4, 1.0e8, 1.0e12):
            ratio = (2.0 * c_value) / (2.0 * c_value**0.75)
            self.assertAlmostEqual(ratio, c_value**0.25)
            self.assertGreater(ratio, previous)
            previous = ratio

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
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
                [compiler, "-interaction=nonstopmode", "-halt-on-error", source.name],
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
        tags = re.findall(r"\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "does **not** close CL itself",
            "finite signed measure",
            "not positive",
            "not completely monotone",
            "Actual turning-frequency quasimode",
            "positive approximate delay",
            "refutes only an unrestricted translation-invariant Laplace algebra",
            "It does not refute a space which explicitly removes",
            "No such construction is asserted here",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "Closure Lemma CL is false",
            "the conditional factorization is false",
            "the subturning Birkhoff connection estimate follows",
            "the Riemann hypothesis is proved",
            "RH follows",
            "a_(j,c) is a positive measure",
        )
        lowered = normalized.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), lowered)

        cache = ROOT / "tests" / "__pycache__"
        if cache.exists():
            matching = list(cache.glob(f"{test_path.stem}.*.pyc"))
            self.assertEqual(matching, [])


if __name__ == "__main__":
    unittest.main()
