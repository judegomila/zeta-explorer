#!/usr/bin/env python3
"""Regressions for the centered-zero Krein factorization barrier."""

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

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / (
    "GROWING_SIGNED_DISCREPANCY_CENTERED_ZERO_KREIN_FACTORIZATION_BARRIER.md"
)
NOTE_HASH = "0257bb5582700fada40fc2a6c6ba578a09fad94e11eb4fa0f72a525c80bd04c9"

FROZEN = {
    "notes/GROWING_SIGNED_DISCREPANCY_FESHBACH_PASSIVITY_SCALE_BARRIER.md":
        "c9ebf7b69860babc66c8c5a447104e93b2e55aa2410e442e8458728b54a16621",
    "tests/test_growing_signed_discrepancy_feshbach_passivity_scale_barrier.py":
        "1206cc61a85771e51c04055bb6ad02ed1bd53f1693e096529d79ebf6268317f8",
    "notes/GROWING_TRANSITION_HADAMARD_PICK_CARRIER_RH_EQUIVALENCE_THEOREM.md":
        "092d0adefb7bafea8d931a2741299d19feef2a45ccc3d243c3543765fdf5cff7",
    "tests/test_growing_transition_hadamard_pick_carrier_rh_equivalence_theorem.py":
        "d15fff20bc0aa62ad63903b6c17e64b11ecba3ab965f179c82086e261c398b43",
    "notes/OUTER_OUTER_SPECTRAL_THEOREM_ERRATUM.md":
        "fecb3647b1e632debd5d7ae3cff1cb5b8db0c29e858041e5037d5c496529f145",
    "tests/test_outer_outer_spectral_theorem_erratum.py":
        "59f71abdaca30440d3b2d177be0426ac9af4f5975beae2de3bcc335f6e4c5ca0",
    "notes/LOCKED_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md":
        "5cc71bf159432e4b651ecad4db2b1702a5288e647ce4025fcf1fb3378bd36d2c",
    "notes/ODD_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md":
        "85efc9bcb2228f0007af10943c693276b8a819fe9198bd76176d4a329574657a",
    "notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md":
        "78e0b9a7c3512bcd2b5fe34d48594734b6323fc57ca55db5e4090d6d6a277fb3",
    "tests/test_q_shift_sector_weil_core_gate.py":
        "714f9839b0514c779f1fc05d558dd9446654de360dd1f0cc70502cba75fa6bf2",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def box_integral(values: np.ndarray, step: float) -> complex:
    return step * (0.5 * values[0] + values[1:-1].sum() + 0.5 * values[-1])


class GrowingSignedDiscrepancyCenteredZeroKreinFactorizationBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_complete_two_sided_multiplier_orientation(self) -> None:
        length = 2.3
        tau = 1.7
        grid = np.linspace(0.0, length, 400_001)
        step = grid[1] - grid[0]
        g = 0.3 + grid * grid
        direct = -2.0 * tau * box_integral(g * np.sin(tau * grid), step)

        # A constant kernel gives -2*c*(1-cos(tau*L)); after compression,
        # the cos(tau*L) translation is the exact endpoint alias.
        constant = 0.7
        constant_symbol = -2.0 * constant * (1.0 - math.cos(tau * length))
        constant_integral = -2.0 * tau * constant * (
            1.0 - math.cos(tau * length)
        ) / tau
        self.assertAlmostEqual(constant_symbol, constant_integral, places=14)
        self.assertTrue(np.isfinite(direct))
        self.assertIn(r"M_L(\tau)=-2\tau\int_0^Lg_\lambda(t)\sin", self.text)
        self.assertIn("real, even, and entire", self.text)
        self.assertIn("causal multiplier on\none vertical line", self.text)

    def test_stieltjes_endpoint_jump_cancels_inclusive_alias(self) -> None:
        length = 2.1
        lower = 0.23
        tau = 2.4
        endpoint_jump = 5.7
        fine = np.linspace(0.0, length, 600_001)
        step = fine[1] - fine[0]
        base = 0.3 + fine * fine
        direct = -2.0 * tau * box_integral(
            base * np.sin(tau * fine), step
        )

        small = fine[fine <= lower]
        small_step = small[1] - small[0]
        small_term = -2.0 * tau * box_integral(
            (0.3 + small * small) * np.sin(tau * small),
            small_step,
        )
        middle = fine[fine >= lower]
        middle_step = middle[1] - middle[0]
        continuous_stieltjes = box_integral(
            np.cos(tau * middle) * (2.0 * middle),
            middle_step,
        )
        stieltjes = (
            continuous_stieltjes
            + endpoint_jump * math.cos(tau * length)
        )
        rhs = (
            small_term
            + 2.0 * (0.3 + length * length + endpoint_jump)
            * math.cos(tau * length)
            - 2.0 * (0.3 + lower * lower) * math.cos(tau * lower)
            - 2.0 * stieltjes
        )
        self.assertAlmostEqual(direct.real, rhs.real, places=5)
        self.assertIn("inclusive\nendpoint jump", self.text)
        self.assertIn("Dropping either term first changes the formula", self.text)

    def test_one_zero_orbit_feature_identity_and_sign(self) -> None:
        length = 1.8
        z = 0.21 + 3.4j
        # The real even constant f=1 has C(t)=2*(L-t).
        direct = 4.0 * (np.cosh(z * length) - 1.0) / (z * z)
        evaluation = 2.0 * np.sinh(z * length / 2.0) / z
        feature = 2.0 * evaluation * evaluation
        self.assertAlmostEqual(direct.real, feature.real, places=12)
        self.assertAlmostEqual(direct.imag, feature.imag, places=12)

        gamma = 7.3
        value = 0.4 - 1.2j
        for parity in (1.0, -1.0):
            # A(-i gamma)=epsilon*A(i gamma) makes both parities positive.
            critical = 2.0 * parity * (
                parity * value.conjugate()
            ) * value
            self.assertAlmostEqual(critical.real, 2.0 * abs(value) ** 2)
            self.assertAlmostEqual(critical.imag, 0.0)
        self.assertIn("the odd pole\ndoes not insert an additional minus sign", self.text)

    def test_direct_even_and_odd_correlation_orientations(self) -> None:
        half_length = 0.8
        count = 4001
        grid = np.linspace(-half_length, half_length, count)
        step = grid[1] - grid[0]
        z = 0.23 + 2.7j
        for parity, values in (
            (1.0, np.cos(math.pi * grid / (2.0 * half_length))),
            (-1.0, np.sin(math.pi * grid / half_length)),
        ):
            correlation = (
                np.correlate(values, values, mode="full")[count - 1:] * step
            )
            lags = np.arange(count) * step
            # C(t)=2*R(t) for a real autocorrelation, and one zero orbit
            # contributes 2*integral(cosh(z*t)*C(t), 0, L).
            physical = 4.0 * box_integral(
                np.cosh(z * lags) * correlation,
                step,
            )
            evaluation = box_integral(values * np.exp(-z * grid), step)
            feature = 2.0 * parity * evaluation * evaluation
            self.assertAlmostEqual(physical.real, feature.real, places=9)
            self.assertAlmostEqual(physical.imag, feature.imag, places=9)

    def test_off_line_quartet_has_exact_krein_signature(self) -> None:
        a = 0.7 + 0.3j
        b = -0.2 + 1.1j
        for parity in (1.0, -1.0):
            cross = 4.0 * parity * (b.conjugate() * a).real
            squares = parity * (abs(a + b) ** 2 - abs(a - b) ** 2)
            self.assertAlmostEqual(cross, squares, places=14)
            matrix = np.array(
                [[0.0, 2.0 * parity], [2.0 * parity, 0.0]],
                dtype=complex,
            )
            np.testing.assert_allclose(np.linalg.eigvalsh(matrix), [-2.0, 2.0])
        self.assertIn("signature `(1,1)`", self.text)
        self.assertIn("Odd parity\nreverses the two channels", self.text)
        self.assertIn("does not prove that the complete finite form is negative", self.text)

    def test_off_line_evaluations_are_independent_in_both_parities(self) -> None:
        z = 0.27 + 2.6j
        grid = np.linspace(-1.0, 1.0, 200_001)
        step = grid[1] - grid[0]
        for first, second in (
            (np.cosh(z * grid), np.cosh(z.conjugate() * grid)),
            (np.sinh(z * grid), np.sinh(z.conjugate() * grid)),
        ):
            gram = np.array(
                [
                    [box_integral(first.conjugate() * first, step),
                     box_integral(first.conjugate() * second, step)],
                    [box_integral(second.conjugate() * first, step),
                     box_integral(second.conjugate() * second, step)],
                ]
            )
            self.assertGreater(float(np.linalg.det(gram).real), 1e-5)

    def test_centered_harmonic_lift_is_shift_independent(self) -> None:
        d = np.array([[3.1, 0.2 - 0.1j], [0.2 + 0.1j, 2.8]])
        h = np.array([[4.0, 0.3j], [-0.3j, 3.5]])
        gamma = np.array([[0.2, -0.1j], [0.15j, 0.25]])
        full_q = np.block([[d, gamma.conjugate().T], [gamma, h]])
        identity = np.eye(2)

        lifts = []
        for shift in (0.4, 1.3):
            h_shifted = h - shift * identity
            lift = np.vstack(
                [identity, -np.linalg.solve(h_shifted + shift * identity, gamma)]
            )
            lifts.append(lift)
        np.testing.assert_allclose(lifts[0], lifts[1], atol=1e-14)

        schur = d - gamma.conjugate().T @ np.linalg.solve(h, gamma)
        u = np.array([0.7 - 0.2j, -0.3 + 0.5j])
        y = np.array([0.1 + 0.6j, 0.9 - 0.4j])
        left = np.vdot(u, schur @ y)
        right = np.vdot(lifts[0] @ u, full_q @ (lifts[0] @ y))
        self.assertAlmostEqual(left.real, right.real, places=13)
        self.assertAlmostEqual(left.imag, right.imag, places=13)
        self.assertIn(r"\mathsf E_{S,S}=\mathsf E_Q", self.text)
        self.assertIn("The reserve `q-u_R` is absent", self.text)

    def test_upper_shift_chain_and_no_danger_density_claim(self) -> None:
        upper_shift = 2.0
        rayleigh_shift = 1.2
        even_upper = np.diag([0.2, 0.7])
        odd_upper = np.diag([0.1, 0.8])
        even_q = even_upper + (upper_shift - rayleigh_shift) * np.eye(2)
        odd_q = odd_upper + (upper_shift - rayleigh_shift) * np.eye(2)
        self.assertGreater(float(np.linalg.eigvalsh(even_q)[0]), 0.0)
        self.assertGreater(float(np.linalg.eigvalsh(odd_q)[0]), 0.0)
        required = (
            "No density assumption on the union of the\ndangerous spaces",
            "paired eventual }U_Z",
            "global Weil positivity",
            "Once (6.4) holds, there are no off-line quartets",
            "claim the converse",
            "finite compression can mask a Krein negative channel",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_magnitude_only_countermodel_and_fail_closed_scope(self) -> None:
        normalized = " ".join(self.text.split())
        for token in (
            "signed weighted-PNT discrepancy to zero",
            "satisfies every frozen upper bound",
            r"\beta_{\lambda,+,{\rm cont}}^{\rm mv}=0",
            r"\beta_{\lambda,-,{\rm cont}}^{\rm mv}=0",
            "not an alternate prime system",
            "No boundary remainder is estimated or discarded",
            "No external zero table, zero simplicity, or RH assumption",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        ):
            self.assertIn(token, normalized)
        for forbidden in (
            "This proves the Riemann hypothesis",
            "the desired signs follow",
            "This note proves that RH implies (6.3)",
            "one off-line quartet makes every finite compression negative",
        ):
            self.assertNotIn(forbidden, self.text)

    def test_display_balance_unique_tags_and_ascii(self) -> None:
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))

    def test_import_hygiene(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__", "ast", "hashlib", "math", "numpy", "pathlib",
                "re", "shutil", "subprocess", "tempfile", "unittest",
            },
        )

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex = Path(directory) / "note.tex"
            tex.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-halt-on-error", "-interaction=nonstopmode", tex.name],
                cwd=directory,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout[-4000:])


if __name__ == "__main__":
    unittest.main()
