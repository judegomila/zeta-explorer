#!/usr/bin/env python3
"""Regressions for the adaptive Gonek exact-carrier singleton PW1 theorem."""

from __future__ import annotations

import ast
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
NOTE = ROOT / "notes" / "ADAPTIVE_GONEK_EXACT_CARRIER_PW1_THEOREM.md"
NOTE_HASH = "c53d7fb8862813bbb75f10ca9c0ad4d5d385ff9c8d3084d3238afe77220b4a7b"

FROZEN = {
    "notes/ADAPTIVE_EXACT_CARRIER_GEVREY_SCHEDULE_FINITE_GATE_BARRIER.md":
        "ecfb29e9e95bb031b95abb27e2eac97c1f466b84a795335a4645d0a6c9cb668f",
    "tests/test_adaptive_exact_carrier_gevrey_schedule_finite_gate_barrier.py":
        "e2ed609e22ec3f81c53c237f9dfd73d972cc0963ad74fd5943222110d192198d",
    "notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md":
        "2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87",
    "tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py":
        "d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def gonek_length(height: mp.mpf) -> mp.mpf:
    return mp.log(height / (2 * mp.pi)) / (2 * mp.pi)


def form_factor(x_value: mp.mpf) -> mp.mpf:
    if x_value == 0:
        return mp.mpf(0)
    return 1 - (mp.sin(mp.pi * x_value) / (mp.pi * x_value)) ** 2


def schedule_x(length: mp.mpf) -> mp.mpf:
    return mp.exp(length / 2) * length**3


def schedule_psi(length: mp.mpf) -> mp.mpf:
    return 2 * mp.pi * (
        mp.exp(length / 2) * length**2 + 1 / length
    )


def adaptive_carrier(height: mp.mpf) -> tuple[int, mp.mpf, mp.mpf]:
    """Implement the monotone inverse and nearest-integer carrier."""
    low = mp.mpf(1)
    high = mp.mpf(2)
    while schedule_psi(high) < height:
        high *= 2
    for _ in range(320):
        middle = (low + high) / 2
        if schedule_psi(middle) < height:
            low = middle
        else:
            high = middle
    ell = (low + high) / 2
    m_star = height * ell / (2 * mp.pi)
    carrier = int(mp.floor(m_star + mp.mpf("0.5")))
    length = 2 * mp.pi * carrier / height
    return carrier - 1, length, ell


class AdaptiveGonekExactCarrierPW1TheoremTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 100
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

    def test_gonek_normalization_and_quarter_shift_constant(self) -> None:
        x_value = mp.mpf(1) / 4
        expected = 1 - 8 / mp.pi**2
        self.assertLess(abs(form_factor(x_value) - expected), mp.mpf("1e-95"))
        self.assertGreater(expected, mp.mpf("0.189"))
        self.assertLess(expected, mp.mpf("0.190"))
        self.assertIn("W(1/4)=1-{8\\over\\pi^2}", self.text)
        self.assertIn("{U\\over2\\pi}\\log^2U+O(U\\log U)", self.text)

    def test_lower_endpoint_parameter_has_exact_same_shift(self) -> None:
        x_value = mp.mpf(1) / 4
        for exponent in (8, 16, 32, 64):
            height = mp.mpf(10) ** exponent
            lower_length = gonek_length(height)
            upper_length = gonek_length(2 * height)
            lower_parameter = x_value * lower_length / upper_length
            self.assertLess(
                abs(lower_parameter / lower_length - x_value / upper_length),
                mp.mpf("1e-90"),
            )
            self.assertLess(lower_parameter, x_value)

    def test_dyadic_main_term_tends_to_one_copy_of_w(self) -> None:
        x_value = mp.mpf(1) / 4
        target = form_factor(x_value)
        errors = []
        for exponent in (8, 16, 32, 64):
            height = mp.mpf(10) ** exponent
            log_height = mp.log(height)
            lower_parameter = (
                x_value * gonek_length(height) / gonek_length(2 * height)
            )
            normalized = (
                2 * target * mp.log(2 * height) ** 2
                - form_factor(lower_parameter) * log_height**2
            ) / log_height**2
            errors.append(abs(normalized - target))
        self.assertEqual(errors, sorted(errors, reverse=True))
        self.assertLess(errors[-1], mp.mpf("0.006"))

    def test_adaptive_inverse_is_an_exact_integer_carrier(self) -> None:
        for height_text in ("1e8", "1e16", "1e32"):
            height = mp.mpf(height_text)
            cutoff, length, ell = adaptive_carrier(height)
            carrier = cutoff + 1
            spacing = 2 * mp.pi / length
            self.assertGreaterEqual(cutoff, 0)
            self.assertLess(abs(carrier * spacing - height), mp.mpf("1e-80") * height)
            self.assertLess(abs(schedule_psi(ell) - height), mp.mpf("1e-80") * height)
            self.assertLessEqual(abs(cutoff - schedule_x(length)), length / 4 + 2)

    def test_half_cell_coordinate_on_the_adaptive_schedule(self) -> None:
        x_value = mp.mpf(1) / 4
        errors = []
        for exponent in (16, 32, 64, 128):
            height = mp.mpf(10) ** exponent
            gamma = mp.mpf("1.5") * height
            delta = x_value / gonek_length(2 * height)
            target = gamma + delta
            _, length, _ = adaptive_carrier(target)
            y_value = delta * length / (2 * mp.pi)
            errors.append(abs(y_value - mp.mpf("0.5")))
            self.assertGreater(y_value, mp.mpf("0.35"))
            self.assertLess(y_value, mp.mpf("0.6"))
            self.assertGreater(abs(y_value - mp.nint(y_value)), mp.mpf("0.35"))
        self.assertEqual(errors, sorted(errors, reverse=True))
        self.assertLess(errors[-1], mp.mpf("0.03"))

    def test_selected_row_gives_every_fixed_kappa_below_four(self) -> None:
        source_value = mp.mpc("2.75", "-1.125")
        for y_value in (mp.mpf("0.49"), mp.mpf("0.5"), mp.mpf("0.51")):
            row_profile = mp.sin(mp.pi * y_value) ** 2 / y_value**2
            self.assertGreater(row_profile, mp.mpf("3.8"))
            for multiplicity in (1, 2, 7):
                selected_contribution = multiplicity * row_profile
                self.assertGreaterEqual(selected_contribution, row_profile)
                raw_energy = abs(source_value) ** 2 * selected_contribution
                self.assertGreater(
                    raw_energy,
                    mp.mpf("3.8") * abs(source_value) ** 2,
                )
        self.assertIn("{\\sf PW1}(J)", self.text)
        self.assertIn("J=\\{N+1\\}", self.text)

    def test_singleton_profile_has_pair_overlap_at_most_one(self) -> None:
        carrier = 17
        zero = 101
        weights = {(carrier, zero): mp.mpf("0.73")}
        overlaps = []
        for index in range(carrier - 2, carrier + 3):
            overlaps.append(
                weights.get((index, zero), 0)
                + weights.get((index - 1, zero), 0)
            )
        self.assertEqual(max(overlaps), mp.mpf("0.73"))
        self.assertLessEqual(max(overlaps), 1)

    def test_endpoint_recurrence_does_not_imply_the_upper_frame(self) -> None:
        ratio = mp.mpf("1.17")
        energies = []
        for magnitude in (1, 10, 100, 1000):
            first = mp.mpf(magnitude)
            second = (1 - first) / ratio
            self.assertLess(abs(first + ratio * second - 1), mp.mpf("1e-95"))
            energies.append(abs(first) ** 2 + ratio**2 * abs(second) ** 2)
        self.assertEqual(energies, sorted(energies))
        self.assertGreater(energies[-1], mp.mpf("1e6"))

    def test_weighted_endpoint_frame_selects_one_adjacent_ratio(self) -> None:
        envelope = [mp.mpf("1.3"), mp.mpf("0.9")]
        endpoint = [mp.mpf("2.1"), mp.mpf("0.7")]
        row = [mp.mpf("11.5"), mp.mpf("3.2")]
        endpoint_energy = sum(
            envelope[index] ** 2 * endpoint[index] ** 2
            for index in range(2)
        )
        row_energy = sum(
            envelope[index] ** 2 * row[index]
            for index in range(2)
        )
        aggregate_ratio = row_energy / endpoint_energy
        point_ratios = [
            row[index] / endpoint[index] ** 2
            for index in range(2)
        ]
        self.assertGreaterEqual(max(point_ratios), aggregate_ratio)
        for length in (10, 100, 1000):
            self.assertLess(mp.sqrt(length) / length**2, 1 / length)

    def test_claim_boundary_is_fail_closed(self) -> None:
        required = (
            "not a theorem for the literal",
            "not a uniform theorem for a prescribed locked",
            "not an estimate for the global four-channel",
            "proves no endpoint-frame hypothesis `NY`",
            "actual finite-prolate Stokes transfer",
            "finite strict gates",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 30)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb,mathrsfs}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as tmpdir:
            tex_path = Path(tmpdir) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            completed = subprocess.run(
                [compiler, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=tmpdir,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        self.assertEqual(completed.returncode, 0, completed.stdout)

    def test_ascii_python_and_static_invariants(self) -> None:
        self.note_bytes.decode("ascii")
        source = Path(__file__).read_text(encoding="utf-8")
        ast.parse(source)
        self.assertNotIn("TODO", self.text)
        self.assertNotIn("FIXME", self.text)
        self.assertGreaterEqual(self.text.count("\\boxed{"), 4)
        self.assertIn("external, unvendored", self.text)
        self.assertIn("C_E(L)=o(L^2)", self.text)


if __name__ == "__main__":
    unittest.main()
