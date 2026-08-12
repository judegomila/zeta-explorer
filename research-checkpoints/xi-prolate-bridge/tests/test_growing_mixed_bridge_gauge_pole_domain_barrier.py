#!/usr/bin/env python3
"""Regressions for the mixed-bridge gauge and pole-domain barrier."""

from __future__ import annotations

import ast
import hashlib
import math
from fractions import Fraction
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md"
NOTE_HASH = "335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb"

FROZEN = {
    "notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md":
        "23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0",
    "tests/test_growing_low_prefix_outer_floor_assembly_theorem.py":
        "634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311",
    "notes/GROWING_ODD_LOW_PREFIX_OUTER_FLOOR_TRANSFER_THEOREM.md":
        "a4f92b20644d5fbcdec0edd9ba54a9e31ccd777f67c8ed58b8cd66d4dc0b1459",
    "tests/test_growing_odd_low_prefix_outer_floor_transfer_theorem.py":
        "c8a86e338762f00c32c04e9e300fc3398d4cbb084f16a1a530b77a16a1144bad",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md":
        "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
    "tests/test_growing_transition_equality_conductor_garding_theorem.py":
        "61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba",
    "notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md":
        "544ce5d2ba527ba9200a64860d977c7191107c88798963591ed960bfa81e527c",
    "notes/OUTER_NORMALIZATION_CANCELLATION_AUDIT.md":
        "6acc76ec10a802197b873741293b56e9832e777cd41de4660e3d9b1d065a9af3",
    "notes/FIXED_LABEL_SIX_ODD_ARITHMETIC_SYNTHESIS_GAIN.md":
        "d90633671d5448c2586af1cbec11e02ef884e715b3f01ba3872815f6d17de771",
    "tests/test_fixed_label_six_odd_arithmetic_synthesis_gain.py":
        "ad57055b3f4c0190e3021bead942e7b280624dae636ec8fe2339bdbe69e372c6",
    "PROLATE_DEFECT_SOURCE_LOCK.json":
        "0844df654ee968b1c371ec96618d10d219da9fde702d62faa4f0c6be139b036d",
    "tests/test_prolate_defect_source_lock.py":
        "7caa8d088522d68dc4dedfad8d00d8e5c7e15070065c743d9e2a41f9e7faa519",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def defect_coefficient(label: int) -> Fraction:
    return Fraction(4 * 8**label, math.factorial(label))


class GrowingMixedBridgeGaugePoleDomainBarrierTests(unittest.TestCase):
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

    def test_fixed_label_defect_ratios(self) -> None:
        # c=2*pi*lambda^2.  A label gap two contributes (2*pi)^(-2)
        # in repository variables, and a label gap four contributes
        # (2*pi)^(-4).
        d0_over_d2_source = defect_coefficient(0) / defect_coefficient(2)
        d2_over_d6_source = defect_coefficient(2) / defect_coefficient(6)
        self.assertEqual(d0_over_d2_source, Fraction(1, 32))
        self.assertEqual(d0_over_d2_source / 4, Fraction(1, 128))
        self.assertEqual(d2_over_d6_source, Fraction(45, 512))
        self.assertEqual(d2_over_d6_source / 16, Fraction(45, 8192))

    def test_bridge_origin_has_forced_plus(self) -> None:
        for chi0, chi2, v0, v2 in (
            (0.9, 0.8, 2.0, 3.0),
            (0.99, 0.97, 5.0, 7.0),
            (0.999, 0.998, 11.0, 13.0),
        ):
            integral0 = chi0 * v0
            integral2 = -chi2 * v2
            beta = integral2 / integral0
            bridge_at_zero = v2 - beta * v0
            self.assertAlmostEqual(
                bridge_at_zero,
                v2 * (1 + chi2 / chi0),
                places=14,
            )
            self.assertGreater(bridge_at_zero, v2)

    def test_complete_raw_exterior_metric_retains_both_crosses(self) -> None:
        d0, d2, d4, d6 = map(Fraction, (2, 3, 5, 7))
        u, beta, a = map(Fraction, (11, -13, 17))
        x0, xb, xm = map(Fraction, (19, 23, 29))

        # Pure modal coefficients of x0*p + xb*b + xm*m.
        coeff_h0 = -u * x0 - beta * xb
        coeff_h2 = xb + a * xm
        coeff_h4 = x0
        coeff_h6 = -xm
        direct = (
            d0 * coeff_h0**2
            + d2 * coeff_h2**2
            + d4 * coeff_h4**2
            + d6 * coeff_h6**2
        )

        # Quadratic form of (2.3), including d0*beta*u and d2*a.
        matrix_form = (
            (d4 + d0 * u**2) * x0**2
            + (d2 + d0 * beta**2) * xb**2
            + (d6 + d2 * a**2) * xm**2
            + 2 * d0 * beta * u * x0 * xb
            + 2 * d2 * a * xb * xm
        )
        self.assertEqual(direct, matrix_form)

    def test_endpoint_null_bridge_stays_at_d2_scale_but_origin_does_not(self) -> None:
        previous_h0_fraction = float("inf")
        for lam in (4.0, 6.0, 8.0, 10.0):
            # A scale-faithful fixed-label model.  The common exponential
            # cancels in every ratio used by the endpoint shear.
            d2 = math.exp(-lam * lam)
            d0 = d2 * lam**-4
            d6 = d2 * lam**8
            e0, e2, e6 = map(math.sqrt, (d0, d2, d6))
            beta = -1.0
            a6 = 1.0
            eta_b = e2 - beta * e0
            eta_m = -e6 + a6 * e2
            gamma = eta_b / eta_m

            self.assertAlmostEqual(eta_b - gamma * eta_m, 0.0, places=14)
            metric = (
                beta**2 * d0
                + (1 - gamma * a6) ** 2 * d2
                + gamma**2 * d6
            )
            self.assertGreater(metric / d2, 1.0)
            self.assertLess(metric / d2, 5.0)
            self.assertLess(abs(gamma) * lam**4, 3.0)

            h0_fraction = beta**2 * d0 / metric
            self.assertLess(h0_fraction, previous_h0_fraction)
            previous_h0_fraction = h0_fraction

            modeled_origin = 2.0 - gamma * d6
            self.assertGreater(modeled_origin, 1.9)

    def test_beta_is_l2_but_its_pole_evaluation_diverges(self) -> None:
        lam = 3.0
        self.assertAlmostEqual(1 / (4 * lam), 1 / 12, places=15)
        previous = 0.0
        for terminal in (30.0, 300.0, 3000.0, 30000.0):
            truncated_pole = 0.5 * math.log(terminal / lam)
            self.assertGreater(truncated_pole, previous)
            previous = truncated_pole
        self.assertGreater(previous, 4.0)

    def test_scaled_bump_exterior_energy_is_inverse_lambda(self) -> None:
        # Use psi_hat(xi)=exp(-xi^2) as a positive model for the exact
        # change of variables.  Only the scaling law is being checked.
        amplitude = 2.5
        tail_integral = math.sqrt(math.pi / 2) * math.erfc(1 / math.sqrt(2))
        previous_scaled = None
        for lam in (2.0, 5.0, 11.0, 23.0):
            energy = amplitude**2 * tail_integral / (2 * lam)
            scaled = lam * energy
            if previous_scaled is not None:
                self.assertAlmostEqual(scaled, previous_scaled, places=14)
            previous_scaled = scaled

    def test_exact_scope_and_missing_gate_tokens(self) -> None:
        required = (
            "raw bridge and every endpoint-sheared combination",
            "complete spectral pairing are gauge-invariant",
            "is not in the separated physical pole-row",
            "D_{\\rm mod}(b^\\#)=\\Theta(d_2)",
            "b^\\#(0)\\longrightarrow2h_2^{\\rm Herm}(0)",
            "Neither term in (4.6) may",
            "cutoff-uniform, complete-form",
            "o(Ld_2)",
            "after the exact",
            "every cross term included exactly once",
            "not a negative-sign theorem",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "the mixed floor is false",
            "drop the coherent beta row",
            "drop the corrected bump",
            "This proves the Riemann hypothesis",
        )
        lowered = self.text.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

    def test_display_balance_unique_tags_and_ascii(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
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
                "__future__", "ast", "fractions", "hashlib", "math",
                "pathlib", "re", "shutil", "subprocess", "tempfile",
                "unittest",
            },
        )

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
