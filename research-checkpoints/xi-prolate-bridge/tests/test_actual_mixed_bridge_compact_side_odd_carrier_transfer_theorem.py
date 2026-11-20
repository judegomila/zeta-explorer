#!/usr/bin/env python3
"""Exact regressions for the compact-side odd carrier transfer theorem."""

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
    / "ACTUAL_MIXED_BRIDGE_COMPACT_SIDE_ODD_CARRIER_TRANSFER_THEOREM.md"
)
NOTE_HASH = "3320efd69a729f9709419bc539e765f94c73af20d2136f14068ee4da069c37c1"

FROZEN = {
    "notes/ACTUAL_MIXED_BRIDGE_INDIVIDUAL_ODD_FINITE_PART_RH_BARRIER.md":
        "e107730d3a51bc727f030ff6bb2711fde01eab3c9a3eafb11dcd2fafd68ecfbc",
    "tests/test_actual_mixed_bridge_individual_odd_finite_part_rh_barrier.py":
        "2c5a14ccb10ffff51d53955aa679a87dbc006196e5db92e9afb0ea35f19c2770",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/OUTER_OUTER_SPECTRAL_THEOREM.md":
        "02407eafa8fd5db4c5d8b5bbb2f62d5215f6ef5bf1cb5104fa53caddb52800e4",
    "tests/test_outer_outer_spectral_theorem.py":
        "23f212a876183f3c0bef0f4acdf7b20db23436451d72e8abc5a4cf59c782bb1f",
    "notes/OUTER_OUTER_SPECTRAL_THEOREM_ERRATUM.md":
        "fecb3647b1e632debd5d7ae3cff1cb5b8db0c29e858041e5037d5c496529f145",
    "tests/test_outer_outer_spectral_theorem_erratum.py":
        "59f71abdaca30440d3b2d177be0426ac9af4f5975beae2de3bcc335f6e4c5ca0",
    "notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md":
        "e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816",
    "tests/test_common_radical_leakage_gram_orientation.py":
        "d897e662d05665930d3b651d0460dd14f84f8e143ed010c9e248c948a5ace417",
    "notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md":
        "335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb",
    "tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py":
        "0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc",
    "notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md":
        "43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2",
    "tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py":
        "95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def paired(left: tuple[F, ...], right: tuple[F, ...]) -> F:
    return sum((a * b for a, b in zip(left, right)), F(0))


def norm_squared(slots: tuple[F, ...]) -> F:
    return sum((value * value for value in slots), F(0))


def signed_slot_pairing(left: tuple[F, ...], right: tuple[F, ...]) -> F:
    """Orbit-realified slot exchange, with the repository factor one-half."""
    return paired(left, tuple(reversed(right))) / 2


class ActualMixedBridgeCompactSideOddCarrierTransferTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_note_hash(self) -> None:
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)
        self.assertEqual(len(FROZEN), 13)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)

    def test_slot_exchange_and_odd_projection_use_positive_norm(self) -> None:
        first = (F(1), F(2), F(-3), F(5))
        second = (F(4), F(-1), F(2), F(3))
        reflected_first = tuple(reversed(first))
        reflected_second = tuple(reversed(second))
        odd_first = tuple(
            (value - reflected) / 2
            for value, reflected in zip(first, reflected_first)
        )
        odd_second = tuple(
            (value - reflected) / 2
            for value, reflected in zip(second, reflected_second)
        )

        self.assertEqual(tuple(reversed(odd_first)), tuple(-x for x in odd_first))
        self.assertEqual(tuple(reversed(odd_second)), tuple(-x for x in odd_second))
        self.assertLessEqual(norm_squared(odd_first), norm_squared(first))
        self.assertLessEqual(norm_squared(odd_second), norm_squared(second))

        repository_first = norm_squared(odd_first)
        repository_second = norm_squared(odd_second)
        gram_first = repository_first / 2
        gram_second = repository_second / 2
        cross = signed_slot_pairing(odd_first, odd_second)
        self.assertEqual(repository_first, 2 * gram_first)
        self.assertEqual(repository_second, 2 * gram_second)
        self.assertLessEqual(
            cross * cross,
            gram_first * gram_second,
        )

    def test_fejer_multipliers_preserve_oddness_and_converge_in_log_proxy(self) -> None:
        maximum = 96
        coefficients = {
            n: F(1 if n > 0 else -1, n * n)
            for n in range(-maximum, maximum + 1)
            if n != 0
        }

        errors: list[F] = []
        for cutoff in (8, 16, 32, 64, 128):
            error = F(0)
            for n, coefficient in coefficients.items():
                weight = (abs(n) + 1).bit_length()
                multiplier = (
                    F(cutoff + 1 - abs(n), cutoff + 1)
                    if abs(n) <= cutoff
                    else F(0)
                )
                approximant = multiplier * coefficient
                self.assertEqual(
                    approximant,
                    -(
                        multiplier
                        * coefficients[-n]
                    ),
                )
                error += weight * (coefficient - approximant) ** 2
            errors.append(error)

        self.assertTrue(all(right < left for left, right in zip(errors, errors[1:])))
        self.assertLess(errors[-1], errors[0])

    def test_radical_polarization_moves_only_the_zero_pairing(self) -> None:
        compact_left = (F(2, 3), F(-5, 7), F(11, 13))
        compact_right = tuple(reversed(compact_left))
        outer_left = tuple(-value for value in compact_left)
        outer_right = tuple(-value for value in compact_right)

        compact_form = paired(compact_left, compact_right) / 2
        outer_form = paired(outer_left, outer_right) / 2
        self.assertEqual(outer_form, compact_form)
        self.assertEqual(
            tuple(a + b for a, b in zip(compact_left, outer_left)),
            (F(0), F(0), F(0)),
        )

    def test_physical_and_spectral_gauges_agree_only_after_z(self) -> None:
        amplitude = F(7, 3)
        modal_row = F(5, 11)
        bump_row = F(2, 13)
        beta_row = F(3, 17)
        z_modal = F(19, 23)
        z_beta = F(29, 31)
        z_bump = -amplitude * z_beta

        physical_row = modal_row + bump_row
        spectral_row = modal_row - amplitude * beta_row
        z_physical = z_modal + z_bump
        z_spectral = z_modal - amplitude * z_beta

        self.assertNotEqual(physical_row, spectral_row)
        self.assertEqual(z_physical, z_spectral)

    def test_carrier_plus_modal_cross_expansion_is_exact(self) -> None:
        modal = (F(1, 17), F(-2, 19), F(2, 19), F(-1, 17))
        beta = (F(5, 7), F(-7, 11), F(7, 11), F(-5, 7))
        total = tuple(a + b for a, b in zip(modal, beta))

        self.assertEqual(tuple(reversed(modal)), tuple(-x for x in modal))
        self.assertEqual(tuple(reversed(beta)), tuple(-x for x in beta))
        physical = signed_slot_pairing(total, total)
        carrier = signed_slot_pairing(beta, beta)
        remainder = (
            signed_slot_pairing(modal, modal)
            + signed_slot_pairing(modal, beta)
            + signed_slot_pairing(beta, modal)
        )
        self.assertEqual(physical, carrier + remainder)

        cross = signed_slot_pairing(modal, beta)
        self.assertLessEqual(
            cross * cross,
            (norm_squared(modal) / 2) * (norm_squared(beta) / 2),
        )

    def test_beta_absolute_norm_has_a_uniform_exact_majorant(self) -> None:
        # Lambda=k^15 makes every rational strip exponent below exact.
        zeros = (F(1, 3), F(2, 5), F(3, 5), F(2, 3))
        direct_majorant = sum((1 / (4 * rho * rho) for rho in zeros), F(0))
        vee_majorant = sum(
            (1 / (4 * (1 - rho) * (1 - rho)) for rho in zeros),
            F(0),
        )
        for k in range(2, 11):
            slots = tuple(
                F(1, 2 * rho * k ** int(15 * rho))
                for rho in zeros
            )
            vee = tuple(
                F(1, 2 * (1 - rho) * k ** int(15 * (1 - rho)))
                for rho in zeros
            )
            self.assertLessEqual(norm_squared(slots), direct_majorant)
            self.assertLessEqual(norm_squared(vee), vee_majorant)

    def test_polynomial_sampling_loss_is_beaten_by_fixed_label_defect(self) -> None:
        for p in range(33, 65, 2):
            lam = F(p, 2)
            defect_exponent = p * p + 1
            defect = F(1, 2**defect_exponent)
            square_root_defect = F(1, 2 ** (defect_exponent // 2))
            polynomial = p**3
            remainder = polynomial**2 * defect + polynomial * square_root_defect
            self.assertLess(remainder, 1 / lam)

    def test_endpoint_shear_stays_on_the_same_defect_scale(self) -> None:
        for p in range(7, 27, 2):
            lam = F(p, 2)
            defect_two = 1 / lam**20
            defect_six = lam**8 * defect_two
            gamma = 1 / lam**4
            shear_defect = gamma * gamma * defect_six
            origin_change = gamma * defect_six

            self.assertEqual(shear_defect, defect_two)
            self.assertEqual(origin_change, 1 / lam**16)
            self.assertLess(origin_change, 1 / lam)

    def test_halfgrid_physical_and_carrier_bounds_are_equivalent(self) -> None:
        constant = F(7, 5)
        for p in range(11, 51, 2):
            lam = F(p, 2)
            carrier = F((-1) ** p * 3, 2) / lam
            remainder = 1 / (lam * lam)
            physical = carrier + remainder

            self.assertLessEqual(
                abs(physical),
                abs(carrier) + 1 / lam,
            )
            self.assertLessEqual(
                abs(carrier),
                abs(physical) + 1 / lam,
            )
            self.assertLessEqual(abs(carrier), constant / lam + 1 / lam)

    def test_energy_shift_and_kappa_reserve_remain_separate(self) -> None:
        physical = F(1, 97)
        mu = F(-5, 17)
        norm_squared_value = F(9, 4)
        energy = physical - mu * norm_squared_value
        self.assertEqual(energy - physical, -mu * norm_squared_value)
        self.assertGreater(energy, physical)

        for n in range(5, 13):
            lam = 2**n
            one_over_lambda = F(1, lam)
            pole_scale = F(n * n, lam)
            small_kappa = F(1, n**3)
            self.assertGreater(one_over_lambda, small_kappa * pole_scale)

    def test_scope_tokens_and_forbidden_overclaims(self) -> None:
        required = (
            "compact-side transfer",
            "q^{\\rm phys}_{\\lambda,-}",
            "= {\\mathfrak b}_{\\lambda_p,-}+r_p",
            "r_p=o(\\lambda_p^{-1})",
            "continuous **carrier-only** equivalence",
            "continuous physical-self transfer is not proved",
            "positive real Gram",
            "\\|Zf\\|_{{\\mathfrak Z},{\\rm repo}}^2",
            "=2{\\mathfrak A}(f,f)",
            "{1\\over2}\\|Zf\\|_{{\\mathfrak Z},{\\rm repo}}",
            "symmetric Abel explicit formula",
            "symmetric normalized Fejer mean",
            "in the logarithmic form norm",
            "ZR_\\lambda=0",
            "Z(S_-O_{{\\rm corr},{\\rm phys}})=-Zw_\\lambda",
            "=O_{b,{\\rm modal}}+O_{\\rm bump}",
            "only after applying `Z`",
            "\\ne O_{b,{\\rm modal}}-A_\\lambda J\\beta_\\lambda",
            "ordinary sequence-space Cauchy--Schwarz",
            "{\\cal W}_Z(m_\\lambda,v_\\lambda)",
            "b_(lambda_p)=b_(lambda_p)^#+gamma_(lambda_p)m_1",
            "Equation (7.3) is a triangle estimate",
            "No cancellation between",
            "every sufficiently large odd positive integer",
            "Prime-only sampling and arbitrary sparse subsequences",
            "literal noncompact",
            "\\widehat\\beta_\\lambda(i/2)",
            "-\\mu\\|w_\\lambda\\|^2",
            "\\kappa\\log^2\\lambda\\gtrsim1",
            "standard eight are untouched",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "the physical odd bound holds unconditionally",
            "q^{\\rm phys}_{\\lambda,-}=O(\\lambda^{-1})\n \\text{ for every sufficiently large real }\\lambda",
            "the literal noncompact ordered physical finite part is proved",
            "the spectral representative is the physical corrected row",
            "O_{{\\rm corr},{\\rm phys}}=O_{b,{\\rm modal}}-A_\\lambda J\\beta_\\lambda",
            "E_\\lambda=O(\\lambda^{-1}) follows",
            "the coherent diagonal bounds each parity",
            "a sparse subsequence implies RH",
        )
        lowered = self.text.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

    def test_display_tags_ascii_and_no_binary_floats(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), 60)
        self.assertEqual(len(tags), len(set(tags)))

        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertNotIn(b"\t", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertTrue(
                all(line.rstrip(b" ") == line for line in payload.splitlines())
            )

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
        self.assertEqual(len(displays), 60)
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
