#!/usr/bin/env python3
"""Regressions for the critical-density prolate Mellin transport theorem."""

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
NOTE = ROOT / "notes" / "CRITICAL_DENSITY_PROLATE_MELLIN_TRANSPORT_CONNECTION_THEOREM.md"
NOTE_HASH = "4d20e37cb8b6cfe3d92da7e1344da0f1b12ca9d20185fd7b6d8ac406ef7846c6"

FROZEN = {
    "notes/EXACT_PROLATE_MELLIN_RECURRENCE_BIRKHOFF_CONNECTION_BARRIER.md":
        "d1191bdc6f0d2edd0ae900e1a7d73f61cea7f78693e2074b6850df7aec36a041",
    "tests/test_exact_prolate_mellin_recurrence_birkhoff_connection_barrier.py":
        "836949d060b03d697574731aad2ede90241b2f6ccb29e58d123908218ef7955f",
    "notes/SUBTURNING_FINITE_ORDER_NEWTON_CLOSURE_THEOREM.md":
        "b6597337ed033bf889eb31d06da669edb7a97ddc1e32a4c9c90fb5185dad7dc4",
    "tests/test_subturning_finite_order_newton_closure_theorem.py":
        "763d6a7b5d641d013d05ece675a3aaa7496bebbeb4e6111bb12878d33180f526",
    "notes/COMPLEX_MELLIN_ACTION_PHASE_WEIGHTED_STOKES_INTERFACE_REDUCTION.md":
        "aaebb3565089bde5d2a62b3883762e72c2b7544613c9b7e3436d348b0eb6b2b6",
    "tests/test_complex_mellin_action_phase_weighted_stokes_interface_reduction.py":
        "6b81fd05e26837adad8c9c9ccf36b534d6aa9c0c8fb71b0b2e931ba820c8bdc6",
    "notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md":
        "d5984831496b714400d8b70df739abe66e6571abd1a2f3dbda96d8b38f473edd",
    "tests/test_first_prolate_correction.py":
        "9f424a931f3a9435ec0ce9883b07201afe9b85cf56fcdda81644050e876ef991",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def action(c_value: mp.mpf, s_value: mp.mpc) -> mp.mpc:
    scaled = s_value / (2 * c_value)
    return c_value * (
        mp.sqrt(1 + scaled * scaled) - 1 - scaled * mp.asinh(scaled)
    )


def r_value(z_value: mp.mpc) -> mp.mpc:
    return (mp.sqrt(z_value * z_value + 4) - z_value) / 2


def transport(label: int, z_value: mp.mpc) -> mp.mpc:
    r = r_value(z_value)
    return (
        mp.power(2, label + 1)
        * r
        / (mp.power(1 + r, label + mp.mpf("0.5")) * mp.sqrt(1 + r * r))
    )


def polynomial(label: int, s_value: mp.mpc) -> mp.mpc:
    if label == 0:
        return mp.mpc(1)
    if label == 4:
        return 4 * s_value * (s_value - 1) + 3
    raise ValueError(label)


def correction_u(label: int, z_value: mp.mpc) -> mp.mpc:
    r = r_value(z_value)
    denominator = 24 * (1 + r) * mp.power(1 + r * r, 3)
    if label == 0:
        numerator = (
            -7 * r**6 + 11 * r**5 + 50 * r**4 + 62 * r**3
            + 17 * r**2 + 11 * r
        )
        return numerator / denominator - mp.mpf(3) / 8
    if label == 4:
        numerator = (
            137 * r**6 + 299 * r**5 + 434 * r**4 + 542 * r**3
            + 257 * r**2 + 203 * r
        )
        return numerator / denominator - mp.mpf(39) / 8
    raise ValueError(label)


def f2_value(label: int, z_value: mp.mpc) -> mp.mpc:
    r = r_value(z_value)
    denominator = 12 * (1 + r) ** 2 * (1 + r * r) ** 4
    if label == 0:
        numerator = (
            7 * r**8 - 22 * r**7 - 196 * r**6 - 346 * r**5
            - 66 * r**4 + 190 * r**3 + 148 * r**2 + 34 * r + 11
        )
        return r * r * numerator / denominator
    if label == 4:
        numerator = (
            137 * r**8 + 598 * r**7 + 916 * r**6 + 1018 * r**5
            + 114 * r**4 - 574 * r**3 - 868 * r**2 - 514 * r - 203
        )
        return -r * r * numerator / denominator
    raise ValueError(label)


def p_ratio(
    label: int,
    c_value: mp.mpf,
    s_value: mp.mpc,
    corrected: bool = False,
) -> mp.mpc:
    z_value = s_value / c_value
    shifted_z = (s_value + 2) / c_value
    exponent = action(c_value, s_value + label + 1) - action(
        c_value, s_value + label - 1
    )
    if corrected:
        exponent += (
            correction_u(label, shifted_z) - correction_u(label, z_value)
        ) / c_value
    return (
        mp.exp(exponent)
        * polynomial(label, s_value + 2)
        / polynomial(label, s_value)
        * transport(label, shifted_z)
        / transport(label, z_value)
    )


def normalized_defect(
    label: int,
    c_value: mp.mpf,
    s_value: mp.mpc,
    corrected: bool = False,
    second_eigen_coefficient: mp.mpf = mp.mpf(0),
) -> mp.mpc:
    p = p_ratio(label, c_value, s_value, corrected)
    shifted_p = p_ratio(label, c_value, s_value + 2, corrected)
    first = -(2 * label * label + 2 * label + 3) / 4
    eigenvalue = (
        2 * label + 1
        + first / c_value
        + second_eigen_coefficient / (c_value * c_value)
    )
    residual = (
        (s_value + 2) * shifted_p
        + (s_value + 2) * (s_value + 1) / c_value
        - eigenvalue
        - (s_value + 1) / p
    )
    return residual / ((s_value + 1) / p)


def alpha_value(label: int, c_value: mp.mpf, s_value: mp.mpc) -> mp.mpc:
    return (
        (s_value + 2)
        / (s_value + 1)
        * p_ratio(label, c_value, s_value)
        * p_ratio(label, c_value, s_value + 2)
    )


class CriticalDensityProlateMellinTransportConnectionTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 70
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 8)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_branch_sector_transport_and_phase(self) -> None:
        for real_part in (mp.mpf(0), mp.mpf("0.1"), mp.mpf(1), mp.mpf(10)):
            for density in (mp.mpf("0.01"), mp.mpf("0.25"), mp.mpf(1)):
                z_value = real_part - 1j * density
                r = r_value(z_value)
                self.assertLessEqual(abs(r), 1 + mp.mpf("1e-60"))
                self.assertGreaterEqual(mp.arg(r), -mp.mpf("1e-60"))
                self.assertLessEqual(mp.arg(r), mp.pi / 6 + mp.mpf("1e-60"))
                self.assertGreater(abs(1 + r), mp.mpf("0.9"))
                self.assertGreater(abs(1 + r * r), mp.mpf("0.9"))
        for density in (mp.mpf("0.2"), mp.mpf("0.5"), mp.mpf(1)):
            theta = mp.asin(density / 2)
            for label in (0, 4):
                expected = (
                    mp.cos(theta / 2) ** (-label - mp.mpf("0.5"))
                    * mp.cos(theta) ** (-mp.mpf("0.5"))
                    * mp.exp(1j * (mp.mpf("0.25") - label / 2) * theta)
                )
                self.assertLess(
                    abs(transport(label, -1j * density) - expected),
                    mp.mpf("1e-65"),
                )
                self.assertGreater(abs(expected - 1), mp.mpf("1e-4"))

    def test_pole_compatibility_f2_and_analytic_u(self) -> None:
        for label in (0, 4):
            mu = -mp.mpf(2 * label * label + 2 * label + 3) / 4
            pole_numerator = 4 * mu + 2 * label * label + 2 * label + 3
            self.assertEqual(pole_numerator, 0)
        self.assertLess(abs(f2_value(0, 0) + mp.mpf(5) / 16), mp.mpf("1e-65"))
        self.assertLess(abs(f2_value(4, 0) + mp.mpf(13) / 16), mp.mpf("1e-65"))
        for label in (0, 4):
            self.assertLess(abs(correction_u(label, 0)), mp.mpf("1e-65"))
            for z_value in (
                mp.mpc("0.2", "-0.3"),
                mp.mpc("1.1", "-0.8"),
                mp.mpc("0.01", "-0.04"),
            ):
                derivative = mp.diff(lambda value: correction_u(label, value), z_value)
                expected = -f2_value(label, z_value) / (
                    2 * (1 + r_value(z_value) ** 2)
                )
                self.assertLess(abs(derivative - expected), mp.mpf("2e-62"))

    def test_fixed_z_defect_coefficient_and_uniform_transition_bound(self) -> None:
        c_value = mp.mpf("1e7")
        for z_value in (
            mp.mpc("0.3", "-0.4"),
            mp.mpc("1", "-1"),
        ):
            for label in (0, 4):
                scaled = normalized_defect(label, c_value, c_value * z_value) * c_value**2
                self.assertLess(abs(scaled - f2_value(label, z_value)), mp.mpf("3e-5"))

        worst = mp.mpf(0)
        for c_text in ("1e3", "1e4", "1e5", "1e6"):
            c_value = mp.mpf(c_text)
            for amplitude in (mp.mpf(1), mp.mpf(3), mp.mpf(10)):
                s_value = 1 - 1j * amplitude * mp.sqrt(c_value)
                for label in (0, 4):
                    scaled = abs(normalized_defect(label, c_value, s_value)) * c_value**2
                    worst = max(worst, scaled)
        self.assertLess(worst, mp.mpf("2.5"))

    def test_stronger_corrected_residual_is_false_for_label_four(self) -> None:
        for amplitude in (mp.mpf(1), mp.mpf(2), mp.mpf(3)):
            c_value = mp.mpf("1e7")
            s_value = 1 - 1j * amplitude * mp.sqrt(c_value)
            residual = normalized_defect(
                4,
                c_value,
                s_value,
                corrected=True,
                second_eigen_coefficient=-mp.mpf(207) / 16,
            )
            scaled = residual * c_value ** (mp.mpf(5) / 2)
            expected = -3j / amplitude**3
            self.assertLess(abs(scaled - expected), mp.mpf("0.004"))
            self.assertGreater(
                abs(residual) * c_value**3,
                mp.mpf("0.09") * mp.sqrt(c_value),
            )

    def test_absolute_forward_green_has_square_root_scale(self) -> None:
        ratios: dict[int, list[mp.mpf]] = {0: [], 4: []}
        for c_value in (mp.mpf(400), mp.mpf(1600), mp.mpf(6400)):
            for label in (0, 4):
                s_value = 1 - 1j * mp.sqrt(c_value)
                product = mp.mpf(1)
                total = mp.mpf(1)
                cutoff = int(20 * mp.sqrt(c_value))
                for index in range(cutoff):
                    product *= alpha_value(label, c_value, s_value + 2 * index)
                    total += abs(product)
                ratios[label].append(total / mp.sqrt(c_value))
                self.assertLess(abs(product), mp.mpf("1e-100"))
                self.assertLess(total / mp.sqrt(c_value), mp.mpf(30))
        for label in (0, 4):
            self.assertLess(max(ratios[label]) / min(ratios[label]), mp.mpf("1.08"))

    def test_exact_one_step_critical_line_extension(self) -> None:
        for c_value in (mp.mpf("1e3"), mp.mpf("1e5")):
            for density in (mp.mpf("0.2"), mp.mpf("0.5")):
                sigma = mp.mpf("0.5") - 1j * density * c_value
                for label in (0, 4):
                    p = p_ratio(label, c_value, sigma)
                    shifted_p = p_ratio(label, c_value, sigma + 2)
                    forcing = normalized_defect(label, c_value, sigma)
                    alpha = alpha_value(label, c_value, sigma)
                    shifted_x = (1 + 2j) / c_value ** (mp.mpf(3) / 2)
                    lower_g = forcing + alpha * shifted_x
                    self.assertGreater(abs(1 + lower_g), mp.mpf("0.99"))
                    lower_x = -lower_g / (1 + lower_g)
                    self.assertLess(
                        abs(1 + lower_x - 1 / (1 + lower_g)),
                        mp.mpf("1e-65"),
                    )

                    first = -mp.mpf(2 * label * label + 2 * label + 3) / 4
                    eigenvalue = 2 * label + 1 + first / c_value
                    recurrence_coefficient = (
                        (sigma + 2) * (sigma + 1) / c_value - eigenvalue
                    )
                    w_plus = mp.mpc("0.7", "-0.2")
                    w_plus_plus = w_plus * shifted_p * (1 + shifted_x)
                    by_recurrence = (
                        (sigma + 2) * w_plus_plus
                        + recurrence_coefficient * w_plus
                    ) / (sigma + 1)
                    by_ratio = w_plus / (p * (1 + lower_x))
                    self.assertLess(abs(by_recurrence - by_ratio), mp.mpf("2e-62"))

                    base_comparison = mp.mpc("1.001", "-0.0005")
                    lower_comparison = base_comparison / (1 + lower_x)
                    expected = base_comparison * (1 + lower_g)
                    self.assertLess(
                        abs(lower_comparison - expected),
                        mp.mpf("2e-65"),
                    )

    def test_laurent_margin_source_amplitude_and_carrier_scale(self) -> None:
        kappa_one = 1 - mp.sqrt(3) / 2 + mp.pi / 6
        self.assertGreater(mp.pi / 2 - kappa_one, mp.mpf("0.9"))
        for density in (mp.mpf(1) / (2 * mp.pi), mp.mpf("0.25"), mp.mpf("0.5")):
            theta = mp.asin(density / 2)
            phi = mp.sqrt(1 - density * density / 4) - 1 + density * theta / 2
            carrier = mp.pi * density / 4 - phi
            amplitude = mp.cos(theta / 2) ** (-mp.mpf("4.5")) * mp.cos(theta) ** (-mp.mpf("0.5"))
            self.assertGreater(amplitude, 1)
            self.assertGreater(carrier, 0)
            self.assertLess(carrier, 1)
        density = mp.mpf("0.5")
        theta = mp.asin(density / 2)
        phi = mp.sqrt(1 - density * density / 4) - 1 + density * theta / 2
        carrier = mp.pi * density / 4 - phi
        self.assertLess(abs(carrier - mp.mpf("0.361283181361350")), mp.mpf("2e-15"))

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
            self.assertTrue(raw.endswith(b"\n"))

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "The factor `T_j` is essential",
            "forward-minimal normalization",
            "no arbitrary nonconstant two-periodic multiplier",
            "Exact one-step extension to the critical line",
            "not by evaluating the Newton solution outside its domain",
            "`1+g_(j,-)` is nonzero",
            "actual physical quotient",
            "No second eigenvalue correction is used",
            "There is no hidden branch or zero-domain issue",
            "sharp absolute scale",
            "full period, not merely at one point",
            "positive leading multiplier",
            "only an absolute scale comparison",
            "stronger outer-collar lemma",
            "project state remains `P0_INVALIDATED`",
            "unbound post-checkpoint-1.51 theorem pair",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "the Riemann hypothesis follows",
            "P0_VALIDATED",
            "operator-relative exterior theorem is proved",
            "T_j(z)=1",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, normalized)
        self.assertNotIn(",qquad", normalized)


if __name__ == "__main__":
    unittest.main()
