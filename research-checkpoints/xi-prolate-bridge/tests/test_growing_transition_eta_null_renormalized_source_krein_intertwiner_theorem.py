#!/usr/bin/env python3
"""Regressions for the endpoint-null renormalized source Krein theorem."""

from __future__ import annotations

import cmath
import hashlib
import math
import re
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes/GROWING_TRANSITION_ETA_NULL_RENORMALIZED_SOURCE_KREIN_INTERTWINER_THEOREM.md"
NOTE_HASH = "0c7c20639645d912d0e896bf064f83e3bd26078d716a183fa703d1586673d0d5"

DEPENDENCIES = {
    "notes/GROWING_TRANSITION_GLOBAL_RADICAL_SECTOR_MIXING_FEATURE_GEOMETRY_BARRIER.md":
        "976f9299c4d002db3f0b73f0b4da8cc383480c8b55b7ea5ccdc219d9135fbdc4",
    "tests/test_growing_transition_global_radical_sector_mixing_feature_geometry_barrier.py":
        "61837a5180eac8fe307eca05578315066c39148c9d2dea143c6b1f7628e77b4d",
    "notes/GROWING_TRANSITION_ODD_LAPLACE_ZETA_HURWITZ_FEATURE_ANGLE_REDUCTION_THEOREM.md":
        "aaa5b189075b308f3d0ea0c0908ad36d4d871f4ce6626ff74ed9c730a09a0723",
    "tests/test_growing_transition_odd_laplace_zeta_hurwitz_feature_angle_reduction_theorem.py":
        "1bf0cec43d31d1d0f48899be0615faab108b99e86ef446894a8cdec807329a74",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_RESONANCE_AND_NONRESONANT_FRAME_GATE_THEOREM.md":
        "511abdb8dd5e9bfe765e518812f19ab8df351803438c0a731387f3dd8d413460",
    "tests/test_growing_transition_ordered_prime_resonance_and_nonresonant_frame_gate_theorem.py":
        "634ec6af8e27db305c22d305d12bdd650b834d947c8afa9a3d6dbf27120482b8",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
}


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def s_form(a: complex, b: complex) -> float:
    return (a.conjugate() * b + b.conjugate() * a).real


def von_mangoldt(n: int) -> float:
    value = n
    prime = 0
    divisor = 2
    while divisor * divisor <= value:
        if value % divisor == 0:
            if prime:
                return 0.0
            prime = divisor
            while value % divisor == 0:
                value //= divisor
        divisor += 1
    if value > 1:
        if prime:
            return 0.0
        prime = value
    return math.log(prime) if prime else 0.0


class EtaNullRenormalizedSourceKreinTheoremTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_hashes(self) -> None:
        self.assertEqual(digest(NOTE), NOTE_HASH)
        for relative, expected in DEPENDENCIES.items():
            self.assertEqual(digest(ROOT / relative), expected, relative)

    def test_cross_gauge_is_exact(self) -> None:
        samples = (
            (1, 1, 2, 1.2 - 0.7j, -0.3 + 2.0j),
            (7, 5, 11, -2.0 + 0.2j, 0.8 - 1.1j),
            (23, 2, 3, 4.0 + 1.0j, -1.0 - 3.0j),
        )
        for m, ell, n, a, b in samples:
            ratio = m / (ell * n)
            self.assertAlmostEqual(
                s_form(ratio * a, b / ratio), s_form(a, b), places=12
            )

    def test_scaled_model_squares_are_summable(self) -> None:
        # The theorem's pointwise envelopes reduce both scaled slots to
        # constant multiples of 1/(m*l*n).
        partials = []
        for cutoff in (10, 30, 100):
            total = 0.0
            for m in range(1, cutoff + 1):
                for ell in range(1, cutoff + 1):
                    for n in range(2, cutoff + 1):
                        total += von_mangoldt(n) / (m * ell * n) ** 2
            partials.append(total)
        self.assertLess(partials[0], partials[1])
        self.assertLess(partials[1], partials[2])
        self.assertLess(partials[2] - partials[1], partials[1] - partials[0])
        self.assertLess(partials[2], 3.0)

    def test_elementary_arithmetic_envelopes(self) -> None:
        for a_value in (25.0 / 4.0, 100.0, 400.0):
            cutoff = int(a_value)
            low_0 = sum(von_mangoldt(n) for n in range(2, cutoff + 1))
            low_1 = sum(n * von_mangoldt(n) for n in range(2, cutoff + 1))
            high = sum(
                von_mangoldt(n) / n**2
                for n in range(cutoff + 1, 20 * cutoff + 1)
            )
            self.assertLessEqual(low_0, a_value * math.log(max(a_value, 2.0)))
            self.assertLessEqual(low_1, a_value**2 * math.log(max(a_value, 2.0)))
            self.assertLess(high, 3.0 * math.log(max(a_value, 2.0)) / a_value)

    def test_packet_pseudoinverse_intertwiner(self) -> None:
        # One coefficient, two source sectors, two cross slots per sector.
        t = (1.0, 2.0, 3.0, 4.0)
        z = (1.0, 14.0)
        source_signed = 2.0 * t[0] * t[1] + 2.0 * t[2] * t[3]
        zero_signed = 2.0 * z[0] * z[1]
        self.assertAlmostEqual(source_signed, zero_signed)

        norm_sq = sum(value * value for value in t)
        u = tuple(tuple(z_i * t_j / norm_sq for t_j in t) for z_i in z)
        ut = tuple(sum(row[j] * t[j] for j in range(4)) for row in u)
        self.assertEqual(ut, z)

        # G=U^*U has a nonzero continuous/prime off-diagonal block.
        g_02 = sum(u_i[0] * u_i[2] for u_i in u)
        self.assertNotEqual(g_02, 0.0)

    def test_hadamard_divided_difference_factorization(self) -> None:
        zeros = (0.5 + 3.0j, 0.5 - 3.0j, 0.5 + 7.0j, 0.5 - 7.0j)
        s = 2.2
        t = 3.7
        h_s = sum(1.0 / (s - rho) for rho in zeros)
        h_t = sum(1.0 / (t - rho) for rho in zeros)
        divided = 2.0 * (h_s - h_t) / (s - t)
        features = -2.0 * sum(
            1.0 / ((s - rho) * (t - rho)) for rho in zeros
        )
        self.assertAlmostEqual(divided.real, features.real, places=12)
        self.assertAlmostEqual(divided.imag, features.imag, places=12)

    def test_boundary_zero_pick_kernel_is_positive(self) -> None:
        gammas = (-7.0, -3.0, 3.0, 7.0)
        points = (0.8 + 0.4j, 1.3 - 0.7j)
        # The finite Pick matrix is a sum of rank-one positive Grams.
        matrix = [[0j for _ in points] for _ in points]
        for i, z in enumerate(points):
            for j, w in enumerate(points):
                matrix[i][j] = sum(
                    1.0 / ((z - 1j * gamma) * (w.conjugate() + 1j * gamma))
                    for gamma in gammas
                )
        self.assertGreater(matrix[0][0].real, 0.0)
        self.assertGreater(matrix[1][1].real, 0.0)
        determinant = matrix[0][0].real * matrix[1][1].real - abs(matrix[0][1]) ** 2
        self.assertGreaterEqual(determinant, -1e-12)

    def test_required_formulas_and_limit_order(self) -> None:
        for token in (
            "r_{m,l,n}={m\\over ln}",
            "T_p x=\\lim_{M\\to\\infty}^{\\rm ordered}",
            "\\lim_{R\\to\\infty}T_{p,M,R}'x",
            "T=T_c\\oplus T_p",
            "U_0=Z_OT^\\dagger",
            "T^*G_0T=Z_O^*Z_O",
            "negative conjugate-slot exchange",
            "K_{M,L}(s,t)=K_M(s,t)+\\Delta_{M,L}(s,t)",
            "whole-half-plane positivity of (6.8) is RH-equivalent",
        ):
            self.assertIn(token, self.text)

    def test_fail_closed_scope_is_explicit(self) -> None:
        scope = " ".join(self.text.split())
        for token in (
            "bounded into `W^(2,1)([-lambda,lambda])`",
            "actual endpoint row `eta=0`",
            "unbounded diagonal change of gauge",
            "equality of signed forms on `ran T`",
            "operator identity",
            "packet-, zero-feature-, and gauge-dependent",
            "No uniform bound in growing `lambda`",
            "no canonical generator-level extension",
            "does not prove the feature-angle inequality",
            "not a generator-level formula",
            "Equation (7.1) is gauge-dependent",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, scope)

    def test_displays_compile_as_tex(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.DOTALL)
        self.assertGreaterEqual(len(displays), 35)
        source = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as tmp:
            tex = Path(tmp) / "displays.tex"
            tex.write_text(source, encoding="ascii")
            result = subprocess.run(
                [
                    pdflatex,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    tex.name,
                ],
                cwd=tmp,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stdout[-5000:])

    def test_ascii_balanced_displays_and_unique_tags(self) -> None:
        data = NOTE.read_bytes()
        self.assertTrue(all(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in data))
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        self.assertNotIn("TO_BE_FROZEN", self.text)


if __name__ == "__main__":
    unittest.main()
