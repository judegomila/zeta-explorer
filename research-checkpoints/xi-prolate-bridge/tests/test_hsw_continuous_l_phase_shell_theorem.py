#!/usr/bin/env python3
"""Regressions for the HSW continuous-L phase-shell theorem."""

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
NOTE = ROOT / "notes" / "HSW_CONTINUOUS_L_PHASE_SHELL_THEOREM.md"
NOTE_HASH = "49a53cb1f8ee6db85040cd39aa6faa4fff0296d8bb8b99b18e830efce63df70e"

FROZEN = {
    "notes/ACTUAL_ENDPOINT_RATIONAL_VARIANCE_FAR_TAIL_BARRIER.md":
        "88965c9926092be319f83014408b689622911b1d27b5e5f266e2d7fb74e92644",
    "tests/test_actual_endpoint_rational_variance_far_tail_barrier.py":
        "bd993af601bcddbd48ad077bd9b9c64f0cfb34ba2354b617de94f66029d0716c",
    "notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md":
        "ceb3e7067ed9ef9f02f443b665a83f778500630ded912e60df128abc8c17514a",
    "tests/test_anti_carrier_log_schedule.py":
        "304175ece40e36ae979dffa44c43009d1b796be2d72a820d7021758a34472a1b",
    "ZERO_SAMPLING_SOURCE_LOCK.json":
        "f4cad4acb30dbfcdc5b30faafe92934e8958ad1cd11cbf6abea932f902e8c101",
    "DIRECT_RH_ATTACK.md":
        "b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main_term(height: float) -> float:
    return height / (2.0 * math.pi) * math.log(
        height / (2.0 * math.pi * math.e)
    )


def remainder(height: float) -> float:
    return (
        0.103787 * math.log(height)
        + 0.257297 * math.log(math.log(height))
        + 9.367419
    )


def z_lower(height: float) -> float:
    return (
        main_term(2.0 * height)
        - main_term(height)
        - remainder(2.0 * height)
        - remainder(height)
    )


def bin_upper(height: float) -> float:
    return (
        math.log(2.0 * height / (2.0 * math.pi))
        / (2.0 * math.pi)
        + 2.0 * remainder(2.0 * height)
    )


def bad_measure_bound(height: float, interval_length: float) -> float:
    z_value = z_lower(height)
    b_value = bin_upper(height)
    return (
        256.0
        * b_value**2
        * height
        * (interval_length + 8.0 * (1.0 + math.log(height)))
        / z_value**2
    )


def omega(length: float) -> float:
    lam = math.exp(length / 2.0)
    cutoff = math.ceil(lam * length**3)
    return 2.0 * math.pi * cutoff / length


class HSWContinuousLPhaseShellTheoremTests(unittest.TestCase):
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

    def test_parity_selection_retains_half_multiplicity(self) -> None:
        counts = (7, 2, 11, 5, 3, 13, 4, 17, 6, 19)
        totals = tuple(
            sum(counts[parity::2])
            for parity in (0, 1)
        )
        selected_parity = max(range(2), key=totals.__getitem__)
        selected = totals[selected_parity]
        total = sum(counts)
        self.assertGreaterEqual(2 * selected, total)

        height = F(100)
        lower_from_selected = F(selected, 4 * height**2)
        lower_from_total = F(total, 8 * height**2)
        self.assertGreaterEqual(lower_from_selected, lower_from_total)

    def test_phase_identity_keeps_algebraic_multiplicity(self) -> None:
        ordinates = (2.5, 3.75, 5.125, 7.25)
        multiplicities = (3, 1, 5, 2)
        length = 1.375
        u_value = sum(
            multiplicity / ordinate**2
            for multiplicity, ordinate in zip(
                multiplicities,
                ordinates,
            )
        )
        c_value = sum(
            multiplicity
            * cmath.exp(1j * ordinate * length)
            / ordinate**2
            for multiplicity, ordinate in zip(
                multiplicities,
                ordinates,
            )
        )
        phase = sum(
            multiplicity
            * math.sin(ordinate * length / 2.0) ** 2
            / ordinate**2
            for multiplicity, ordinate in zip(
                multiplicities,
                ordinates,
            )
        )
        self.assertAlmostEqual(
            phase,
            (u_value - c_value.real) / 2.0,
            places=14,
        )

    def test_cluster_mean_square_obeys_explicit_bound(self) -> None:
        height = 24
        interval_left = 0.37
        interval_length = 0.8
        counts = tuple(1 + (3 * index) % 7 for index in range(height))
        parity_totals = tuple(sum(counts[p::2]) for p in (0, 1))
        parity = max(range(2), key=parity_totals.__getitem__)
        rows = tuple(
            (
                height + index + 0.25,
                counts[index],
            )
            for index in range(parity, height, 2)
        )

        integral = 0j
        for gamma, multiplicity in rows:
            left_weight = multiplicity / gamma**2
            for nu, other_multiplicity in rows:
                right_weight = other_multiplicity / nu**2
                difference = gamma - nu
                if difference == 0:
                    kernel = interval_length
                else:
                    kernel = (
                        cmath.exp(1j * difference * interval_left)
                        * (
                            cmath.exp(
                                1j * difference * interval_length
                            )
                            - 1.0
                        )
                        / (1j * difference)
                    )
                integral += left_weight * right_weight * kernel

        b_value = max(counts)
        explicit_upper = (
            b_value**2
            / height**3
            * (
                interval_length
                + 8.0 * (1.0 + math.log(height))
            )
        )
        self.assertAlmostEqual(integral.imag, 0.0, places=13)
        self.assertGreaterEqual(integral.real, -1e-14)
        self.assertLessEqual(integral.real, explicit_upper)

    def test_hsw_bad_measure_has_log_over_t_order(self) -> None:
        heights = (1e12, 1e14, 1e16, 1e18)
        bounds = tuple(bad_measure_bound(height, 1.0) for height in heights)
        self.assertTrue(all(z_lower(height) > 0 for height in heights))
        self.assertTrue(
            all(left > right for left, right in zip(bounds, bounds[1:]))
        )
        normalized = tuple(
            bound * height / math.log(height)
            for bound, height in zip(bounds, heights)
        )
        self.assertLess(max(normalized) / min(normalized), 2.0)

        phase_constants = tuple(
            z_lower(height) / (32.0 * height * math.log(height))
            for height in heights
        )
        self.assertTrue(
            all(value > 1.0 / (70.0 * math.pi) for value in phase_constants)
        )
        self.assertAlmostEqual(
            phase_constants[-1],
            1.0 / (64.0 * math.pi),
            delta=3e-4,
        )

    def test_common_shell_respects_locked_ceiling_schedule(self) -> None:
        interval_length = 0.75
        for left in (20.0, 24.0, 28.0):
            grid = tuple(
                left + interval_length * index / 200.0
                for index in range(201)
            )
            omega_values = tuple(omega(length) for length in grid)
            omega_min = min(omega_values)
            shell_floor = math.floor(omega_min / 2.0)
            self.assertLessEqual(2.0 * shell_floor, omega_min)
            self.assertGreater(shell_floor, 0)
            self.assertGreater(
                shell_floor / max(omega_values),
                0.25,
            )

    def test_conditional_amplitude_interface_factors(self) -> None:
        endpoint = F(2, 7)
        amplitude = F(5, 3)
        height = F(11)
        z_value = F(13)
        sampling_cap = F(3, 5)
        phase_mass = z_value / (32 * height**2)
        denominator = amplitude**2 * phase_mass
        eta_squared = endpoint**2 * sampling_cap / denominator
        displayed_upper = (
            32
            * sampling_cap
            * endpoint**2
            * height**2
            / (amplitude**2 * z_value)
        )
        self.assertEqual(denominator, amplitude**2 * z_value / (32 * height**2))
        self.assertEqual(eta_squared, displayed_upper)

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
            "\\begin{document}\n"
            + "\n".join(
                "\\[" + display + "\\]"
                for display in displays
            )
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
                all(
                    line == line.rstrip(b" ")
                    for line in raw.splitlines()
                )
            )

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn(r",qquad", self.text)
        self.assertNotIn(r",quad", self.text)
        self.assertNotIn("resulting multiset", self.text)
        self.assertIn(
            "set of distinct selected ordinates, each equipped with its algebraic weight",
            " ".join(self.text.split()),
        )
        self.assertIn(r"\Omega_j^-=\inf_{L\in I_j}\Omega(L)", self.text)
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "set of distinct selected ordinates, each equipped with its algebraic weight",
            "optimal-order phase-shell lower bound",
            "No simplicity assumption or individual zero-gap theorem is used",
            "good set in `I_j` has measure `h-o(1)`",
            "common shell was placed below the minimum carrier edge",
            "conditional interface, not an amplitude theorem",
            "product of the separate phase and amplitude averages",
            "one explicit unbounded diagonal sequence",
            "does not transfer the theorem to half-integers",
            "standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        lowered = normalized.lower()
        forbidden = (
            "eta_n^pr=o(1) is proved",
            "the amplitude lower bound follows from hsw",
            "the riemann hypothesis is proved",
            "all zeta zeros are simple",
            "every prescribed grid is phase-good",
            "actual arithmetic sign is negative",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
