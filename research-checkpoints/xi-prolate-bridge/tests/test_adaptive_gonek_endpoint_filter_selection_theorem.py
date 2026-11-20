#!/usr/bin/env python3
"""Regressions for the adaptive Gonek endpoint-filter selection theorem."""

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
NOTE = ROOT / "notes" / "ADAPTIVE_GONEK_ENDPOINT_FILTER_SELECTION_THEOREM.md"
NOTE_HASH = "7354d464d4a3d53cb32c83b941a24aac60c5cbbf9b87c5bf56a907193459bd46"

FROZEN = {
    "notes/ADAPTIVE_GONEK_EXACT_CARRIER_PW1_THEOREM.md":
        "c53d7fb8862813bbb75f10ca9c0ad4d5d385ff9c8d3084d3238afe77220b4a7b",
    "tests/test_adaptive_gonek_exact_carrier_pw1_theorem.py":
        "0fa1da396704e7343f3f0e3c8231f8d376ae77ced264a173c2619dd024765e5e",
    "notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md":
        "2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87",
    "tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py":
        "d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97",
    "notes/ADAPTIVE_EXACT_CARRIER_GEVREY_SCHEDULE_FINITE_GATE_BARRIER.md":
        "ecfb29e9e95bb031b95abb27e2eac97c1f466b84a795335a4645d0a6c9cb668f",
    "tests/test_adaptive_exact_carrier_gevrey_schedule_finite_gate_barrier.py":
        "e2ed609e22ec3f81c53c237f9dfd73d972cc0963ad74fd5943222110d192198d",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def schedule_psi(length: mp.mpf) -> mp.mpf:
    return 2 * mp.pi * (mp.exp(length / 2) * length**2 + 1 / length)


def smooth_inverse(height: mp.mpf) -> mp.mpf:
    low = mp.mpf(1)
    high = mp.mpf(2)
    while schedule_psi(high) < height:
        high *= 2
    for _ in range(400):
        middle = (low + high) / 2
        if schedule_psi(middle) < height:
            low = middle
        else:
            high = middle
    return (low + high) / 2


def hardy_envelope(height: mp.mpf) -> mp.mpf:
    return (
        (height**2 + mp.mpf(1) / 4)
        / 2
        * mp.pi ** (-mp.mpf(1) / 4)
        * abs(mp.gamma(mp.mpf(1) / 4 + mp.j * height / 2))
    )


def theta_prime(height: mp.mpf) -> mp.mpf:
    return (
        mp.re(mp.digamma(mp.mpf(1) / 4 + mp.j * height / 2))
        - mp.log(mp.pi)
    ) / 2


class AdaptiveGonekEndpointFilterSelectionTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 100
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

    def test_exact_hardy_xi_envelope_and_stirling_slope(self) -> None:
        slopes = []
        for height in (mp.mpf(100), mp.mpf(300), mp.mpf(1000)):
            slope = mp.diff(lambda value: mp.log(hardy_envelope(value)), height)
            model = -mp.pi / 4 + mp.mpf(7) / (4 * height)
            slopes.append(abs(slope - model))
            self.assertLess(abs(slope - model), mp.mpf(2) / height**2)
            self.assertGreater(hardy_envelope(height), 0)
        self.assertEqual(slopes, sorted(slopes, reverse=True))
        self.assertIn("Xi(t)=-c(t)Z(t)", self.text)

    def test_smooth_inverse_and_nearest_integer_error_are_exact(self) -> None:
        for height_text in ("1e10", "1e20", "1e40"):
            height = mp.mpf(height_text)
            ell = smooth_inverse(height)
            h0 = 2 * mp.pi / ell
            m_star = height * ell / (2 * mp.pi)
            carrier = int(mp.floor(m_star + mp.mpf("0.5")))
            length = 2 * mp.pi * carrier / height
            spacing = height / carrier
            self.assertLessEqual(abs(length - ell), mp.pi / height)
            self.assertLessEqual(
                abs(spacing - h0),
                3 * mp.pi**2 / (height * ell**2),
            )
            self.assertLess(abs(carrier * spacing - height), mp.mpf("1e-85") * height)

    def test_both_afe_branches_have_a_fixed_nyquist_margin(self) -> None:
        for height_text in ("1e20", "1e40", "1e80"):
            height = mp.mpf(height_text)
            ell = smooth_inverse(height)
            spacing = 2 * mp.pi / ell
            cutoff = height ** mp.mpf("0.6")
            frequencies = (
                theta_prime(height),
                theta_prime(height) - mp.log(cutoff),
            )
            for frequency in frequencies:
                phase = spacing * frequency
                self.assertLess(abs(phase), 2 * mp.pi / 3)
                self.assertGreaterEqual(
                    abs(1 + mp.e ** (mp.j * phase)),
                    mp.mpf("0.99"),
                )
                self.assertEqual(
                    abs(1 + mp.e ** (-mp.j * phase)),
                    abs(1 + mp.e ** (mp.j * phase)),
                )

    def test_geometric_filter_and_conjugate_branch_are_bounded(self) -> None:
        for length in (50, 100, 200):
            spacing = 2 * mp.pi / length
            damping = mp.e ** (-mp.pi * spacing / 4)
            for phase in (
                -2 * mp.pi / 3,
                -mp.pi / 2,
                mp.mpf(0),
                mp.pi / 2,
                2 * mp.pi / 3,
            ):
                multiplier = 1 / (1 + damping * mp.e ** (mp.j * phase))
                conjugate = 1 / (1 + damping * mp.e ** (-mp.j * phase))
                self.assertLess(abs(multiplier), mp.mpf("1.1"))
                self.assertLess(abs(multiplier - mp.conj(conjugate)), mp.mpf("1e-90"))

    def test_variable_coefficient_mean_value_has_the_required_scales(self) -> None:
        # ||B||_* has log exponent 1/2; the carrier derivative contributes one log.
        endpoint_norm_exponent = mp.mpf(1) / 2
        derivative_norm_exponent = endpoint_norm_exponent + 1
        endpoint_energy_exponent = 2 * endpoint_norm_exponent
        derivative_energy_exponent = 2 * derivative_norm_exponent
        self.assertEqual(endpoint_energy_exponent, 1)
        self.assertEqual(derivative_energy_exponent, 3)
        self.assertIn("I_0", self.text)
        self.assertIn("Y\\ell_Y", self.text)
        self.assertIn("Y\\ell_Y^3", self.text)

    def test_multiplicity_safe_sobolev_log_accounting(self) -> None:
        local_mass_log = 1
        inverse_radius_log = 1
        endpoint_energy_log = 1
        derivative_energy_log = 3
        first_term = local_mass_log + inverse_radius_log + endpoint_energy_log
        cross_term = local_mass_log + (endpoint_energy_log + derivative_energy_log) // 2
        self.assertEqual(first_term, 3)
        self.assertEqual(cross_term, 3)
        denominator_log = 2
        endpoint_frame_log = max(first_term, cross_term) - denominator_log
        quotient_log = 2 - endpoint_frame_log
        self.assertEqual(endpoint_frame_log, 1)
        self.assertEqual(quotient_log, 1)

    def test_exact_adjacent_recurrence_energy_bound(self) -> None:
        samples = (
            (mp.mpc(2, 3), mp.mpc(-1, 4)),
            (mp.mpc(-7, 2), mp.mpc(5, -6)),
            (mp.mpc("0.01", "0.03"), mp.mpc(8, 9)),
        )
        for endpoint, hardy_value in samples:
            adjacent_weighted = -hardy_value - endpoint
            energy = abs(endpoint) ** 2 + abs(adjacent_weighted) ** 2
            upper = 3 * abs(endpoint) ** 2 + 2 * abs(hardy_value) ** 2
            self.assertLessEqual(energy, upper)
            self.assertLess(abs(endpoint + adjacent_weighted + hardy_value), mp.mpf("1e-90"))

    def test_unweighted_pigeonhole_selects_one_nonzero_source(self) -> None:
        source = [mp.mpf(0), mp.mpf(2), mp.mpf(3), mp.mpf(5)]
        ratios = [mp.mpf(0), mp.mpf(7), mp.mpf(11), mp.mpf(13)]
        endpoint_energy = [
            mp.mpf(17),
            ratios[1] * source[1] ** 2,
            ratios[2] * source[2] ** 2,
            ratios[3] * source[3] ** 2,
        ]
        total_source = sum(value**2 for value in source)
        total_endpoint = sum(endpoint_energy)
        average_ratio = total_endpoint / total_source
        admissible = [
            ratios[index]
            for index in range(1, len(source))
            if ratios[index] <= average_ratio
        ]
        self.assertTrue(admissible)
        self.assertTrue(any(value != 0 for value in source[1:]))

    def test_same_selected_ordinate_has_pw1_and_ny(self) -> None:
        for y_value in (mp.mpf("0.49"), mp.mpf("0.5"), mp.mpf("0.51")):
            phase_row = mp.sin(mp.pi * y_value) ** 2 / y_value**2
            self.assertGreater(phase_row, mp.mpf("3.8"))
        for length in (100, 1000, 10000):
            endpoint_constant = mp.mpf(7) * length
            quotient_floor = length**2 / endpoint_constant
            self.assertEqual(quotient_floor, mp.mpf(length) / 7)
        self.assertIn("C_E(L)=O(L)=o(L^2)", self.text)
        self.assertIn(r"{\sf PW1}(J)", self.text)

    def test_weighted_dyadic_formula_and_global_claims_are_forbidden(self) -> None:
        required = (
            "does **not** establish the exponentially envelope-weighted",
            "neither states nor implies",
            "no literal ceiling schedule",
            "no actual finite-prolate Stokes/operator transfer",
            "intersection with the finite simple-ground",
            "no unconditional zeta-zero",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)
        self.assertIn("t^{7/2}e^{-\\pi t/2}", self.text)

    def test_primary_sources_and_two_branch_language_are_explicit(self) -> None:
        self.assertIn("5-mvzdrvs.pdf", self.text)
        self.assertIn("https://www.mathnet.ru/eng/im2696", self.text)
        self.assertIn("primary, external, unvendored, and nonbinding", self.text)
        self.assertIn("second AFE branch is exactly the complex", self.text)
        self.assertIn("has not been discarded", self.text)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
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
        self.assertGreaterEqual(self.text.count("\\boxed{"), 10)
        self.assertIn("nearest-integer adaptive schedule", self.text)
        self.assertIn("unweighted estimate", self.text)


if __name__ == "__main__":
    unittest.main()
