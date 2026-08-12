#!/usr/bin/env python3
"""Regressions for the adaptive critical short-endpoint covariance theorem."""

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
NOTE = (
    ROOT
    / "notes"
    / "ADAPTIVE_CRITICAL_EXACT_CARRIER_SHORT_ENDPOINT_COVARIANCE_THEOREM.md"
)
NOTE_HASH = "b56bbe941bb9922be5701f17bd404192501c07c8a58e05ec9f58e126df384a1f"

FROZEN = {
    "notes/CRITICAL_DENSITY_PROLATE_MELLIN_TRANSPORT_CONNECTION_THEOREM.md":
        "4d20e37cb8b6cfe3d92da7e1344da0f1b12ca9d20185fd7b6d8ac406ef7846c6",
    "tests/test_critical_density_prolate_mellin_transport_connection_theorem.py":
        "0a6128433698ecdc83252747971c61fb0859bf12a2afe582cd78808b8c5b8cf3",
    "notes/CRITICAL_NEAR_NYQUIST_TWO_BRANCH_BLOCK_COVARIANCE_BARRIER.md":
        "b4d43f3c92e58aa164b78379e2f27761ddc7a9033dfa4aea8a983c29675de052",
    "tests/test_critical_near_nyquist_two_branch_block_covariance_barrier.py":
        "217df2931005ca8397a8e7bb60701dd41e9d3c596f30d9bdbec021adcecc39ce",
    "notes/ADAPTIVE_GONEK_ENDPOINT_FILTER_SELECTION_THEOREM.md":
        "7354d464d4a3d53cb32c83b941a24aac60c5cbbf9b87c5bf56a907193459bd46",
    "tests/test_adaptive_gonek_endpoint_filter_selection_theorem.py":
        "e8e96cab5e5bd817650c0f323f248d00772802e439474b1f9d890083f8ca6396",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def critical_phi(density: mp.mpf) -> mp.mpf:
    return (
        mp.sqrt(1 - density**2 / 4)
        - 1
        + density / 2 * mp.asin(density / 2)
    )


def critical_decay(density: mp.mpf) -> mp.mpf:
    return mp.pi / 4 - mp.asin(density / 2) / 2


def adaptive_carrier(
    height: mp.mpf, density: mp.mpf
) -> tuple[int, mp.mpf, mp.mpf, mp.mpf]:
    smooth_length = mp.log(height / (2 * mp.pi * density))
    target = height * smooth_length / (2 * mp.pi)
    carrier = int(mp.floor(target + mp.mpf("0.5")))
    length = 2 * mp.pi * carrier / height
    spacing = 2 * mp.pi / length
    return carrier - 1, length, spacing, smooth_length


def lerch_phi_one(
    q_value: complex, x_value: float, tolerance: float = 2e-14
) -> complex:
    total = 0.0j
    power = 1.0 + 0.0j
    gap = 1.0 - abs(q_value)
    if not 0.0 < gap < 1.0:
        raise ValueError("q must be strictly inside the unit disk")
    for index in range(2_000_000):
        total += power / (index + x_value)
        power *= q_value
        tail = abs(power) / (index + 1 + x_value) / gap
        if tail < tolerance:
            return total
    raise RuntimeError("Lerch series did not converge")


class AdaptiveCriticalExactCarrierShortEndpointCovarianceTests(
    unittest.TestCase
):
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

    def test_critical_decay_is_positive_and_has_exact_derivative(self) -> None:
        for density_text in ("0.16", "0.3", "0.49"):
            density = mp.mpf(density_text)
            self.assertGreater(density, 1 / (2 * mp.pi))
            self.assertLess(density, mp.mpf("0.5"))
            derivative = mp.diff(critical_phi, density)
            expected = mp.asin(density / 2) / 2
            self.assertLess(abs(derivative - expected), mp.mpf("1e-90"))
            self.assertGreater(critical_decay(density), mp.mpf("0.65"))
        self.assertIn(
            r"a_D:={\pi\over4}-{1\over2}\arcsin(D/2)",
            self.text,
        )

    def test_nearest_integer_carrier_has_O_L_index_and_O_1_height_defect(self) -> None:
        for density_text in ("0.17", "0.3", "0.49"):
            density = mp.mpf(density_text)
            for height_text in ("1e20", "1e40", "1e80"):
                height = mp.mpf(height_text)
                cutoff, length, spacing, smooth = adaptive_carrier(
                    height, density
                )
                carrier = cutoff + 1
                self.assertLessEqual(abs(length - smooth), mp.pi / height)
                self.assertLess(
                    abs(carrier * spacing - height),
                    mp.mpf("1e-85") * height,
                )
                schedule_defect = abs(cutoff - density * mp.e**length * length)
                self.assertLess(schedule_defect, mp.mpf("0.6") * length)
                c_value = 2 * mp.pi * mp.e**length
                self.assertLess(abs(height - density * c_value), mp.mpf("3.2"))

    def test_gonek_half_shift_is_one_half_at_critical_density(self) -> None:
        density = mp.mpf("0.3")
        errors = []
        for exponent in (16, 32, 64, 128):
            y_value = mp.mpf(10) ** exponent
            gonek_length = mp.log(2 * y_value / (2 * mp.pi)) / (2 * mp.pi)
            delta = mp.mpf("0.5") / gonek_length
            gamma = mp.mpf("1.5") * y_value
            _, length, _, _ = adaptive_carrier(gamma + delta, density)
            coordinate = delta * length / (2 * mp.pi)
            errors.append(abs(coordinate - mp.mpf("0.5")))
            self.assertGreater(coordinate, mp.mpf("0.45"))
            self.assertLess(coordinate, mp.mpf("0.55"))
        self.assertEqual(errors, sorted(errors, reverse=True))
        self.assertIn("Gonek normalized shift parameter is `a=1/2`", self.text)
        self.assertIn("not the `a=1/4`", self.text)

    def test_endpoint_and_lerch_row_have_the_claimed_short_scales(self) -> None:
        density = 0.3
        decay = float(critical_decay(mp.mpf(str(density))))
        endpoint_relative_errors = []
        row_scales = []
        for length in (200, 400, 800):
            spacing = 2.0 * math.pi / length
            z_value = decay + 1j * (-0.5 * math.log(density))
            q_value = cmath.exp(-spacing * z_value)
            endpoint = 1.0 / (1.0 - q_value)
            endpoint_model = length / (2.0 * math.pi * z_value)
            endpoint_relative_errors.append(
                abs(endpoint - endpoint_model) / abs(endpoint_model)
            )
            row = lerch_phi_one(q_value, 0.5) / spacing
            row_scales.append(abs(row) / (length * math.log(length)))
        self.assertEqual(
            endpoint_relative_errors,
            sorted(endpoint_relative_errors, reverse=True),
        )
        self.assertLess(endpoint_relative_errors[-1], 0.01)
        self.assertGreater(min(row_scales), 0.11)
        self.assertLess(max(row_scales), 0.25)
        self.assertLess(max(row_scales) / min(row_scales), 1.35)

    def test_global_tangent_is_positive_and_preserves_exact_recurrences(self) -> None:
        density = 0.3
        length = 200.0
        spacing = 2.0 * math.pi / length
        decay = float(critical_decay(mp.mpf(str(density))))
        ratio = math.exp(-decay * spacing)
        self.assertGreater(ratio, 0.0)
        self.assertLess(ratio, 1.0)

        base = 101.0
        gamma = 100.0
        source = [1.25, -0.75, 2.5, 0.125, -1.0]
        envelope = [ratio**index for index in range(len(source))]
        endpoints = []
        rows = []
        for left in range(len(source)):
            endpoint_raw = sum(
                (-1) ** (index - left) * envelope[index] * source[index]
                for index in range(left, len(source))
            )
            row_raw = sum(
                (-1) ** (index - left)
                * envelope[index]
                * source[index]
                * gamma**2
                / (gamma**2 - (base + index * spacing) ** 2)
                for index in range(left, len(source))
            )
            endpoints.append(endpoint_raw / envelope[left])
            rows.append(-2 * row_raw / (gamma * envelope[left]))

        for index in range(len(source) - 1):
            self.assertAlmostEqual(
                endpoints[index] + ratio * endpoints[index + 1],
                source[index],
                places=13,
            )
            kernel = gamma**2 / (
                gamma**2 - (base + index * spacing) ** 2
            )
            self.assertAlmostEqual(
                rows[index] + ratio * rows[index + 1],
                -2 * kernel * source[index] / gamma,
                places=13,
            )
        normalized = " ".join(self.text.split())
        self.assertIn("global positive tangent extension", normalized)
        self.assertIn("exact adjacent tail algebra", normalized)

    def test_squared_endpoint_coefficients_have_finite_log_energy(self) -> None:
        density = 0.3
        decay = float(critical_decay(mp.mpf(str(density))))
        shift = 0.5 * math.log(density)
        partials = []
        total = 0.0
        checkpoints = {2_000, 20_000, 200_000}
        for index in range(1, 200_001):
            total += 1.0 / (
                index * (decay**2 + (math.log(index) - shift) ** 2)
            )
            if index in checkpoints:
                partials.append(total)
        increments = [partials[1] - partials[0], partials[2] - partials[1]]
        self.assertGreater(partials[0], 0.0)
        self.assertGreater(increments[0], increments[1])
        self.assertLess(partials[-1], 3.0)

        epsilon = 0.1
        scaled_high_energies = []
        for length in (100.0, 200.0, 400.0):
            integral = length**2 * (
                1.0 / (decay + epsilon * length)
                - 1.0 / (decay + 0.5 * length)
            )
            scaled_high_energies.append(integral / length)
        self.assertLess(max(scaled_high_energies), 9.0)
        self.assertGreater(min(scaled_high_energies), 7.0)

    def test_chi_error_and_transition_ranges_have_power_saving(self) -> None:
        eta = 0.1
        ratios = []
        for log_y in (40.0, 80.0, 160.0, 320.0):
            y_value = math.exp(log_y)
            maximum_x = y_value ** (0.5 + eta)
            self.assertLess(maximum_x, y_value / (4 * math.pi))
            self.assertGreater(y_value - 2 * math.pi * maximum_x, y_value / 2)
            cumulative_pnt_error = math.sqrt(maximum_x * y_value) * log_y**2
            self.assertGreater(cumulative_pnt_error, y_value**0.5 * log_y**2)
            weighted_error = (
                y_value ** (0.5 + eta) * log_y**3 * math.log(log_y)
                + y_value**0.8 * log_y**4 * math.log(log_y)
            )
            target = y_value * log_y**3 * math.log(log_y) ** 2
            ratios.append(weighted_error / target)
        self.assertEqual(ratios, sorted(ratios, reverse=True))
        self.assertLess(ratios[-1], 1e-20)

    def test_multiplicity_safe_H1_log_accounting_is_exact(self) -> None:
        local_mass_log = 1
        inverse_radius_log = 1
        i_zero_log = 1
        i_one_log = 3
        first = local_mass_log + inverse_radius_log + i_zero_log
        second = local_mass_log + (i_zero_log + i_one_log) // 2
        self.assertEqual(first, 3)
        self.assertEqual(second, 3)
        self.assertIn("C_{\\rm RvM}L", self.text)
        self.assertIn("I_0", self.text)
        self.assertIn("I_1", self.text)

    def test_strengthened_selection_keeps_ratio_and_absolute_floor(self) -> None:
        length = mp.mpf("1000")
        log_length = mp.log(length)
        y_value = mp.mpf("1e30")
        row_sum = y_value * length**3 * log_length**2
        endpoint_sum = 4 * y_value * length**3
        zero_count = y_value * length
        average_floor = row_sum / zero_count
        ratio_constant = row_sum / (2 * log_length**2 * endpoint_sum)
        self.assertEqual(average_floor, length**2 * log_length**2)
        self.assertGreater(ratio_constant, 0)
        self.assertEqual(
            ratio_constant * log_length**2 * endpoint_sum,
            row_sum / 2,
        )
        normalized = " ".join(self.text.split())
        self.assertIn("one and the same ordinate", normalized)
        self.assertIn("absolute natural-scale row lower bound", normalized)

    def test_sources_cross_variables_and_nonclaims_are_explicit(self) -> None:
        normalized = " ".join(self.text.split())
        required = (
            "https://www.sas.rochester.edu/mth/people/faculty/"
            "gonek-steve/assets/pdf/8-landau-form.pdf",
            "Theorem 1 of S. M. Gonek",
            "*A formula of Landau and mean values of zeta(s)*",
            "https://arxiv.org/abs/2601.18025",
            "Corollary 5.2",
            "does not by itself supply a uniform implied constant",
            "honest RH-PNT loss `O(sqrt(nU)*(log U)^2)`",
            "no unprinted prefix",
            "`X=1`",
            "`X=n`",
            "There is no general ratio `m/n`",
            "there is no product `mn`",
            "globally positive tangent critical ideal",
            "No value of `Phi(v/c)` is used past the subturning domain",
            "Comparing their complete future tails",
            "no supercritical Abel/Stokes transfer",
            "no finite strict gate",
            "no literal ceiling schedule",
            "no proof of RH",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)
        self.assertNotIn("uniform once `kappa>0`", normalized)
        self.assertNotIn("5-mvzdrvs.pdf", normalized)
        self.assertNotIn(
            "*Mean values of the Riemann zeta-function and its derivatives*",
            normalized,
        )
        self.assertIn("(log L)^2", normalized)
        self.assertIn("not a gain of order `L`", normalized)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 65)
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
            completed = subprocess.run(
                [compiler, "-interaction=nonstopmode", "-halt-on-error", source.name],
                cwd=temporary,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        self.assertEqual(completed.returncode, 0, completed.stdout)

    def test_ascii_python_and_static_invariants(self) -> None:
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
        self.assertNotIn("TODO", self.text)
        self.assertNotIn("FIXME", self.text)
        self.assertGreaterEqual(self.text.count(r"\boxed{"), 4)


if __name__ == "__main__":
    unittest.main()
