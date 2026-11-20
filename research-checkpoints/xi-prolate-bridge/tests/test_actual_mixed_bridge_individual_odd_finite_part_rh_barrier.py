#!/usr/bin/env python3
"""Exact regressions for the individual odd beta-carrier barrier."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "ACTUAL_MIXED_BRIDGE_INDIVIDUAL_ODD_FINITE_PART_RH_BARRIER.md"
)
NOTE_HASH = "e107730d3a51bc727f030ff6bb2711fde01eab3c9a3eafb11dcd2fafd68ecfbc"

FROZEN = {
    "notes/ACTUAL_MIXED_BRIDGE_POLE_ROW_RESOLVENT_CANCELLATION_REDUCTION.md":
        "610aa2b58734ab191e561bbaa7529f0558e1f979fa67461273e69f6d6253cde2",
    "tests/test_actual_mixed_bridge_pole_row_resolvent_cancellation_reduction.py":
        "678e6da6c989c536ba6131fdfd38fe5927c60d464b29e8d358d94af0a9c0f2a4",
    "notes/MIXED_BRIDGE_XI_OVER_S_BOUNDARY_OBSTRUCTION_THEOREM.md":
        "4c4bb0344735a0d605e1052ac06b383144f2cdbb85d2c088bf0b6683e67f06a2",
    "tests/test_mixed_bridge_xi_over_s_boundary_obstruction_theorem.py":
        "1bc81194a9fa2fd4eac92491a08c60bc58f3640ac16e4e5e17864da8a2970c67",
    "notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md":
        "43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2",
    "tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py":
        "95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a",
    "notes/ACTUAL_MIXED_BRIDGE_TRANSVERSE_GAP_ENERGY_BARRIER.md":
        "d9fea23ec9427a2bfcf8f22ec6465cafbdd5623f4adc311e83114fd8b8591677",
    "tests/test_actual_mixed_bridge_transverse_gap_energy_barrier.py":
        "822711c839de663d5152ea61cc438a194780d80444f02cbac07b365947a608f1",
    "notes/UNCONDITIONAL_NATURAL_HALFGRID_CROSSROOT_SCHEDULE_THEOREM.md":
        "d1b73fc246fcc70886ba78dc074adac585372a2abfc9fbba678c03c4d47e30a5",
    "tests/test_unconditional_natural_halfgrid_crossroot_schedule_theorem.py":
        "00627aa69143c39a468dd06808fe6859beb16aff197127e66a93ff042377f1b9",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class ActualMixedBridgeIndividualOddFinitePartRHBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_note_hash(self) -> None:
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)
        self.assertEqual(len(FROZEN), 10)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)

    def test_exact_paired_slot_parity_split(self) -> None:
        amplitude = F(7, 3)
        lam = F(5)
        slots = (F(1, 2), F(2, 3), F(3, 5), F(4, 7))
        vee_slots = tuple(reversed(slots))

        plus_rows = tuple(
            -amplitude * (left + right) / 2
            for left, right in zip(slots, vee_slots)
        )
        minus_rows = tuple(
            amplitude * (left - right) / 2
            for left, right in zip(slots, vee_slots)
        )
        q_plus = sum((value * value for value in plus_rows), F(0))
        q_minus = -sum((value * value for value in minus_rows), F(0))

        s_value = 4 * sum((value * value for value in slots), F(0))
        c_value = 4 * lam * sum(
            (left * right for left, right in zip(slots, vee_slots)),
            F(0),
        )
        common = amplitude * amplitude * c_value / (8 * lam)
        split = amplitude * amplitude * s_value / 8

        self.assertEqual(q_plus, common + split)
        self.assertEqual(q_minus, common - split)
        self.assertEqual(q_plus + q_minus, 2 * common)
        self.assertEqual(q_plus - q_minus, 2 * split)
        self.assertEqual(
            sum((value * value for value in vee_slots), F(0)),
            sum((value * value for value in slots), F(0)),
        )

    def test_odd_reflection_sign_is_forced(self) -> None:
        amplitude = F(5, 2)
        slot = F(3, 7)
        vee = F(2, 9)
        odd_at_w = amplitude * (slot - vee) / 2
        odd_at_minus_w = -odd_at_w
        paired_product = odd_at_w * odd_at_minus_w
        self.assertEqual(paired_product, -(odd_at_w * odd_at_w))
        self.assertNotEqual(paired_product, odd_at_w * odd_at_w)

    def test_landau_laplace_pole_and_multiplicity_are_exact(self) -> None:
        rho = F(1, 3)
        multiplicity = 4
        sigma_zero = 1 - 2 * rho
        residue = F(multiplicity, 1) / (rho * rho)
        reflected = 1 - rho

        self.assertEqual(sigma_zero, F(1, 3))
        self.assertGreater(sigma_zero, 0)
        self.assertEqual(residue, 36)
        self.assertNotEqual(residue, 0)
        self.assertEqual(reflected, F(2, 3))
        self.assertLess(rho, F(1, 2))
        self.assertGreater(reflected, F(1, 2))

        # Distinct rho values give distinct Laplace pole locations.
        other_rho = F(2, 5)
        self.assertNotEqual(1 - 2 * other_rho, sigma_zero)

    def test_physical_energy_keeps_mu_and_is_not_the_carrier(self) -> None:
        amplitude_squared = F(8)
        c_xi = F(3, 11)
        lam = F(13)
        s_value = F(-2, 7)
        mu = F(-5, 17)
        norm_squared = F(9, 4)

        carrier_minus = (
            amplitude_squared * c_xi / (8 * lam)
            - amplitude_squared * s_value / 8
        )
        physical_self = F(7, 13)
        energy = physical_self - mu * norm_squared
        self.assertEqual(energy - physical_self, -mu * norm_squared)
        self.assertGreater(energy, physical_self)
        self.assertNotEqual(physical_self, carrier_minus)
        self.assertNotEqual(energy - carrier_minus, -mu * norm_squared)

        nonnegative_mu = F(1, 19)
        conditional_energy = physical_self - nonnegative_mu * norm_squared
        self.assertLessEqual(conditional_energy, physical_self)

    def test_gauge_identity_holds_only_after_zero_evaluation(self) -> None:
        amplitude = F(7, 3)
        modal_row = F(5, 11)
        bump_row = F(2, 13)
        beta_row = F(3, 17)
        z_modal = F(19, 23)
        z_beta = F(29, 31)
        z_bump = -amplitude * z_beta

        physical_row = modal_row + bump_row
        spectral_representative = modal_row - amplitude * beta_row
        z_physical = z_modal + z_bump
        z_spectral = z_modal - amplitude * z_beta

        self.assertNotEqual(physical_row, spectral_representative)
        self.assertEqual(z_physical, z_spectral)

    def test_all_odd_halfgrid_increment_bound_has_log_squared_scale(self) -> None:
        for exponent in range(4, 13):
            scale = 2**exponent
            h = F(1, scale)

            # A dyadic zero-counting proxy gives h*j per low shell, while
            # sum_(j>J) j/2^j=(J+2)/2^J is the exact high-tail majorant.
            low = h * sum((F(j) for j in range(1, exponent + 1)), F(0))
            high = h * F(exponent + 2)
            scaled_increment = scale * (low + high)
            self.assertEqual(
                scaled_increment,
                F(exponent * (exponent + 1), 2) + exponent + 2,
            )
            self.assertLessEqual(scaled_increment, F((exponent + 2) ** 2))

            p = 2 * scale + 1
            self.assertEqual(F(p + 2, 2) - F(p, 2), 1)
            self.assertEqual(F(2, p), 1 / F(p, 2))

    def test_one_over_lambda_does_not_control_the_kappa_ratio(self) -> None:
        # n models log(lambda), lambda=2^n, and fixed positive constants
        # are omitted from both sides of the scale comparison.
        for n in range(5, 15):
            lam = 2**n
            energy = F(1, lam)
            pole_scale = F(n * n, lam)
            small_kappa = F(1, n**3)
            large_kappa = F(1)
            self.assertGreater(energy, small_kappa * pole_scale)
            self.assertLess(energy, large_kappa * pole_scale)

    def test_continuous_scope_and_fail_closed_tokens(self) -> None:
        required = (
            "{\\cal S}_\\lambda=\\sum_\\rho",
            "\\zeta(s)B_\\infty(s)=-2^{3/4}{\\xi(s)\\over s}",
            "{\\mathfrak b}_{\\lambda,+}+{\\mathfrak b}_{\\lambda,-}",
            "{\\mathfrak b}_{\\lambda,+}-{\\mathfrak b}_{\\lambda,-}",
            "same-tail",
            "continuous family",
            "every sufficiently large odd positive integer",
            "Prime-only sampling is neither needed nor asserted",
            "e^a h\\log^2(2/h)",
            "No converse from an arbitrary sparse subsequence",
            "m(\\rho_0)\\over\\rho_0^2",
            "Functional-equation symmetry",
            "-\\mu\\|w_\\lambda\\|^2",
            "\\kappa\\log^2\\lambda\\gtrsim1",
            "negative prime sign",
            "upper arithmetic index in (5.4) is inclusive",
            "q^{\\rm phys}_{\\lambda,-}-{\\mathfrak b}_{\\lambda,-}",
            "O_{{\\rm corr},{\\rm phys}}",
            "=O_{b,{\\rm modal}}+O_{\\rm bump}",
            "ZO_{\\rm bump}",
            "=-A_\\lambda Z(J\\beta_\\lambda)",
            "Z(O_{b,{\\rm modal}}-A_\\lambda J\\beta_\\lambda)",
            "hold only after applying the nontrivial-zero evaluation map",
            "it is not the physical corrected row",
            "Equation (3.3) is the precise missing identity, not an assertion",
            "These are spectral carrier identities,\nnot physical paritywise",
            "P0_INVALIDATED",
            "standard eight are untouched",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "the individual odd bound holds unconditionally",
            "the coherent diagonal bounds each parity",
            "a sparse subsequence implies RH",
            "E_lambda=O(lambda^(-1)) follows",
            "q^{\\rm phys}_{\\lambda,-}={\\mathfrak b}_{\\lambda,-}",
            "the carrier theorem proves the physical self",
            "O_{\\rm corr}=O_{b,{\\rm modal}}-A_\\lambda O_\\beta",
            "modal-minus-beta is the physical corrected row",
        )
        lowered = self.text.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

    def test_exact_literal_symbol_and_threshold_tokens(self) -> None:
        for token in (
            "m_\\lambda(t)",
            "-2\\sum_{1<n\\leq\\lambda^2}",
            "-2\\beta_{{\\rm pole},\\lambda}^2",
            "2^{-5/4}\\log\\lambda+O(1)",
            "\\sqrt2\\,\\kappa{\\log^2\\lambda\\over\\lambda}",
            "(4-\\delta)\\kappa\\beta_{{\\rm pole},\\lambda}^2",
            "no graph-limit or zero-reality premise",
            "individual physical finite-part identity is not",
        ):
            self.assertIn(token, self.text)

    def test_display_tags_ascii_and_no_binary_floats(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), 48)
        self.assertEqual(len(tags), len(set(tags)))

        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))

        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        float_constants = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(float_constants, [])

        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__",
                "ast",
                "fractions",
                "hashlib",
                "pathlib",
                "re",
                "shutil",
                "subprocess",
                "tempfile",
                "unittest",
            },
        )

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        self.assertIsNotNone(pdflatex, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertEqual(len(displays), 48)
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
                [
                    pdflatex,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    tex_path.name,
                ],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
