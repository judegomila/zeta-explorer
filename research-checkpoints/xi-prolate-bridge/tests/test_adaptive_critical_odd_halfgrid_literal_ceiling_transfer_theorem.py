#!/usr/bin/env python3
"""Regressions for the adaptive critical odd-half-grid ceiling transfer."""

from __future__ import annotations

import ast
from fractions import Fraction
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
    / "ADAPTIVE_CRITICAL_ODD_HALFGRID_LITERAL_CEILING_TRANSFER_THEOREM.md"
)
NOTE_HASH = "8b81d868bffe1057fceba65e144b08a7813d01bd3648b496fbf8b63a430f6af7"

FROZEN = {
    "notes/ADAPTIVE_CRITICAL_EXACT_CARRIER_SHORT_ENDPOINT_COVARIANCE_THEOREM.md":
        "b56bbe941bb9922be5701f17bd404192501c07c8a58e05ec9f58e126df384a1f",
    "tests/test_adaptive_critical_exact_carrier_short_endpoint_covariance_theorem.py":
        "b8724a4e439d3db445a8d92215a6cbee05e6c0d3bba0ce081f707aaace6c0a18",
    "notes/SUPERCRITICAL_FULL_SOURCE_ADAPTIVE_ABEL_TAIL_THEOREM.md":
        "ddd9fe4132e43bbbf859b89192380b3c299f2d9e3acec528bdefe39bb0f2eece",
    "tests/test_supercritical_full_source_adaptive_abel_tail_theorem.py":
        "a3d6169ab083b6fa5ebdce9273c43639680ee2d9db2034d3de842703fb814371",
    "notes/CRITICAL_ARITHMETIC_TO_ACTUAL_SCALAR_TRANSFER_THEOREM.md":
        "8c453f25d75ab351a15faa65a8b7ce5eaaf96ba3b83043b4cdb037f5daa379d8",
    "tests/test_critical_arithmetic_to_actual_scalar_transfer_theorem.py":
        "6e313a0fdeb2db8f11721ce805ff02c60567d370ec4430b63e6a8faae3e00408",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def nearest_odd(value: mp.mpf) -> int:
    lower = int(mp.floor(value))
    if lower % 2 == 0:
        lower -= 1
    upper = lower + 2
    if value - lower <= upper - value:
        return lower
    return upper


def unprimed_data(
    height: mp.mpf, density: mp.mpf
) -> tuple[int, mp.mpf, mp.mpf, mp.mpf]:
    smooth_length = mp.log(height / (2 * mp.pi * density))
    target = height * smooth_length / (2 * mp.pi)
    carrier = int(mp.floor(target + mp.mpf("0.5")))
    length = 2 * mp.pi * carrier / height
    spacing = 2 * mp.pi / length
    lam = mp.exp(length / 2)
    return carrier - 1, length, spacing, lam


def selected_primed_data(
    height: mp.mpf, density: mp.mpf
) -> tuple[int, mp.mpf, mp.mpf, int, mp.mpf, mp.mpf, mp.mpf, mp.mpf]:
    _, length, _, lam = unprimed_data(height, density)
    p_zero = nearest_odd(2 * lam)
    count = int(mp.floor(height ** mp.mpf("0.25")))
    width = height ** (-mp.mpf(1) / 25)
    selected = None
    for index in range(1, count + 1):
        p_value = p_zero + 2 * index
        length_prime = 2 * mp.log(mp.mpf(p_value) / 2)
        phase = height * length_prime / (2 * mp.pi)
        fractional = phase - mp.floor(phase)
        if fractional < width:
            selected = (p_value, length_prime, phase, fractional)
            break
    if selected is None:
        raise AssertionError("finite numerical selector found no odd p")
    p_value, length_prime, phase, fractional = selected
    carrier = int(mp.floor(phase))
    epsilon = mp.mpf(carrier) - phase
    spacing_prime = 2 * mp.pi / length_prime
    height_prime = spacing_prime * carrier
    density_prime = (
        mp.mpf(carrier) - mp.mpf("1.5")
    ) / ((mp.mpf(p_value) / 2) ** 2 * length_prime)
    return (
        p_value,
        length,
        length_prime,
        carrier,
        epsilon,
        spacing_prime,
        height_prime,
        density_prime,
    )


class AdaptiveCriticalOddHalfgridLiteralCeilingTransferTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 100
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_checkpoint_153_pairs_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 6)
        self.assertEqual(len(FROZEN) // 2, 3)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_third_derivative_identity_and_uniform_scale(self) -> None:
        density = mp.mpf("0.3")
        for height_text in ("1e12", "1e20", "1e40"):
            height = mp.mpf(height_text)
            _, _, _, lam = unprimed_data(height, density)
            p_zero = nearest_odd(2 * lam)
            maximum = int(mp.floor(height ** mp.mpf("0.25")))
            for proportion in (mp.mpf("0.1"), mp.mpf("0.5"), mp.mpf("0.9")):
                variable = proportion * maximum

                def phase(real_index: mp.mpf) -> mp.mpf:
                    return height / mp.pi * mp.log(
                        (p_zero + 2 * real_index) / 2
                    )

                numerical = mp.diff(phase, variable, 3)
                exact = 16 * height / (
                    mp.pi * (p_zero + 2 * variable) ** 3
                )
                self.assertLess(abs(numerical - exact), abs(exact) * mp.mpf("1e-50"))
                scaled = exact * mp.sqrt(height)
                self.assertGreater(scaled, mp.mpf("0.01"))
                self.assertLess(scaled, mp.mpf("100"))
        self.assertIn(
            r"f_t'''(n)={16t\over\pi(p_0+2n)^3}",
            self.text,
        )

    def test_erdos_turan_exponent_ledger_has_strict_gap(self) -> None:
        first = Fraction(1, 4) - Fraction(1, 20)
        second = (
            Fraction(1, 4)
            - Fraction(1, 12)
            + Fraction(1, 120)
        )
        third = Fraction(1, 8) + Fraction(1, 12)
        target = Fraction(1, 4) - Fraction(1, 25)
        self.assertEqual(first, Fraction(1, 5))
        self.assertEqual(second, Fraction(7, 40))
        self.assertEqual(third, Fraction(5, 24))
        self.assertEqual(target, Fraction(21, 100))
        self.assertEqual(target - max(first, second, third), Fraction(1, 600))
        normalized = " ".join(self.text.split())
        for phrase in (
            r"M=\lfloor t^{1/4}\rfloor",
            r"R=\lfloor t^{1/20}\rfloor",
            r"\Delta_t=t^{-1/25}",
            r"t^{1/5}",
            r"t^{7/40}",
            r"t^{5/24}",
            r"{1\over600}>0",
            "one-sided interval",
        ):
            self.assertIn(phrase, normalized)

    def test_finite_selector_and_exact_half_unit_ceiling(self) -> None:
        density = mp.mpf("0.3")
        for height_text in ("1e8", "1e10", "1e12"):
            height = mp.mpf(height_text)
            cutoff_old, _, _, lam = unprimed_data(height, density)
            (
                p_value,
                length,
                length_prime,
                carrier,
                epsilon,
                spacing_prime,
                height_prime,
                density_prime,
            ) = selected_primed_data(height, density)
            cutoff = carrier - 1
            lam_prime = mp.mpf(p_value) / 2
            ceiling_argument = density_prime * lam_prime**2 * length_prime

            self.assertEqual(p_value % 2, 1)
            self.assertLessEqual(
                abs(mp.mpf(p_value) - 2 * lam),
                2 * mp.floor(height ** mp.mpf("0.25")) + 1,
            )
            self.assertLessEqual(epsilon, 0)
            self.assertGreater(epsilon, -(height ** (-mp.mpf(1) / 25)))
            self.assertLess(
                abs(ceiling_argument - (mp.mpf(cutoff) - mp.mpf("0.5"))),
                mp.mpf("1e-80") * max(1, abs(ceiling_argument)),
            )
            self.assertEqual(int(mp.ceil(ceiling_argument)), cutoff)
            self.assertLess(
                abs(height_prime - height),
                spacing_prime * height ** (-mp.mpf(1) / 25),
            )
            self.assertLess(abs(length_prime - length) * height ** mp.mpf("0.25"), 20)
            self.assertLess(abs(density_prime - density) * height ** mp.mpf("0.25"), 20)
            self.assertLess(
                abs(mp.mpf(cutoff) - cutoff_old) / height ** mp.mpf("0.75"),
                20,
            )

    def test_half_cell_and_exact_density_height_identity(self) -> None:
        density = mp.mpf("0.3")
        for height_text in ("1e8", "1e10", "1e12"):
            height = mp.mpf(height_text)
            (
                p_value,
                length,
                length_prime,
                carrier,
                epsilon,
                spacing_prime,
                height_prime,
                density_prime,
            ) = selected_primed_data(height, density)
            y_value = mp.mpf("0.75") * height
            delta_y = mp.pi / mp.log(2 * y_value / (2 * mp.pi))
            gamma = height - delta_y
            coordinate = (height_prime - gamma) / spacing_prime
            c_prime = 2 * mp.pi * (mp.mpf(p_value) / 2) ** 2

            self.assertLess(abs(coordinate - mp.mpf("0.5")) * length, 20)
            self.assertLess(
                abs(height_prime - gamma - spacing_prime / 2) * length**2,
                200,
            )
            self.assertLess(
                abs(height_prime - density_prime * c_prime - 3 * mp.pi / length_prime),
                mp.mpf("1e-85") * height,
            )
            self.assertLessEqual(abs(epsilon), height ** (-mp.mpf(1) / 25))

    def test_kernel_bounds_have_the_stated_harmonic_scales(self) -> None:
        height = mp.mpf("1e12")
        density = mp.mpf("0.3")
        cutoff, length, spacing, _ = unprimed_data(height, density)
        del cutoff
        y_value = mp.mpf("0.75") * height
        delta_y = mp.pi / mp.log(2 * y_value / (2 * mp.pi))
        gamma = height - delta_y
        constants_q = []
        constants_dq = []
        for index in (0, 1, 2, 10, 100, 1000):
            value = height + index * spacing
            denominator = gamma**2 - value**2
            kernel = -2 * gamma / denominator
            derivative = -4 * gamma * value / denominator**2
            constants_q.append(abs(kernel) * (index + 1) / length)
            constants_dq.append(
                abs(derivative) * (index + 1) ** 2 / length**2
            )
        self.assertLess(max(constants_q), 1)
        self.assertLess(max(constants_dq), 1)
        self.assertGreater(min(constants_q), 0)
        self.assertGreater(min(constants_dq), 0)

    def test_tangent_stability_rates_tend_to_zero(self) -> None:
        epsilon = mp.mpf("0.005")
        endpoint_rates = []
        row_rates = []
        for logarithm in (100, 200, 400, 800):
            height = mp.exp(logarithm)
            length = mp.mpf(logarithm)
            endpoint_rates.append(
                height ** (-mp.mpf(1) / 25 + epsilon)
                + length * height ** (-mp.mpf(1) / 4 + epsilon)
            )
            row_rates.append(
                length * height ** (-mp.mpf(1) / 25 + epsilon)
                + length * height ** (-mp.mpf(1) / 4 + epsilon)
            )
        self.assertEqual(endpoint_rates, sorted(endpoint_rates, reverse=True))
        self.assertEqual(row_rates, sorted(row_rates, reverse=True))
        self.assertLess(endpoint_rates[-1], mp.mpf("1e-10"))
        self.assertLess(row_rates[-1], mp.mpf("1e-8"))
        self.assertIn("|E'-E|", self.text)
        self.assertIn("|C'-C|", self.text)
        self.assertIn("L t^{-1/25+\\varepsilon}", self.text)

    def test_fresh_interface_and_claim_boundary_are_explicit(self) -> None:
        normalized = " ".join(self.text.split())
        required = (
            "Assume RH",
            "D'=D'_Y",
            "not a fixed-`D` ceiling theorem",
            "not the old Gevrey literal ceiling",
            "strict odd-half-grid",
            "fresh parameter-uniform reapplication",
            "not a continuity argument for finite endpoint data",
            "N'-N=O_{\\mathcal D}(t^{3/4})",
            "finite simple-ground",
            "boundary",
            "shifted-sign",
            "response-reserve",
            "strict-denominator",
            "No second cutoff is appended",
            "no Hilbert two-cutoff transfer is used",
            "changes none of the standard eight files",
            "proves no unconditional zero statement, RH",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)
        self.assertNotIn("literal fixed-density ceiling is proved", normalized)
        self.assertNotIn("finite gates are synchronized", normalized)

    def test_primary_sources_and_no_unprinted_zeta_input(self) -> None:
        normalized = " ".join(self.text.split())
        required = (
            "https://www.renyi.hu/~p_erdos/1949-11.pdf",
            "Lemma 2 of P. Erdos and J. F. Koksma",
            "*On the uniform distribution modulo 1 of sequences*",
            "https://www.degruyterbrill.com/document/doi/"
            "10.2478/s12175-013-0131-4/pdf",
            "Lemma 2 of W. G. Nowak",
            "*On Ramanujan sums over the Gaussian integers*",
            "No zero table, numerical producer, or external theorem about zeta zeros",
            "primary scholarly files, external and unvendored",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 40)
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

    def test_ascii_python_static_tex_and_cache_invariants(self) -> None:
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
        for display in displays:
            if r"\begin{aligned}" in display:
                aligned = re.search(
                    r"\\begin\{aligned\}(.*?)\\end\{aligned\}",
                    display,
                    flags=re.S,
                )
                self.assertIsNotNone(aligned)
                self.assertNotIn(r"\tag", aligned.group(1))
        self.assertNotIn("TODO", self.text)
        self.assertNotIn("FIXME", self.text)
        self.assertGreaterEqual(self.text.count(r"\boxed{"), 6)
        self.assertFalse((test_path.parent / "__pycache__").exists())
        self.assertEqual(list(test_path.parent.glob(test_path.stem + "*.pyc")), [])


if __name__ == "__main__":
    unittest.main()
