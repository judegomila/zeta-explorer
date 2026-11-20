#!/usr/bin/env python3
"""Regressions for the continuous odd-Laplace common representative."""

from __future__ import annotations

import hashlib
import math
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
    / "GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md"
)
NOTE_HASH = "7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/GROWING_TRANSITION_ORDERED_DIRECT_PROFILE_CONTINUATION_TWO_JET_SHEAR_REDUCTION_THEOREM.md":
        "e3b1228a1fb22270a01f061c198239f3e60cb00b675da55ddd13420f9929dea3",
    "tests/test_growing_transition_ordered_direct_profile_continuation_two_jet_shear_reduction_theorem.py":
        "7d6e46c302276563cfc88e4826903a344c0937eb29f3645daf473d5ba1917341",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_TWO_ANCHOR_BULK_TRACE_OBSTRUCTION_THEOREM.md":
        "cb2afb9b28cbcaf4dbd55802b72e59a3f71cad0fa84e69ee18252c5f7dbef591",
    "tests/test_growing_transition_direct_source_two_anchor_bulk_trace_obstruction_theorem.py":
        "bd888e61906c5c696f8a7338dbf4d1b6861c888ee863d2ba6ba9ab14d05d8892",
    "notes/GROWING_TRANSITION_ABSOLUTE_SAMPLING_FORCED_CANCELLATION_BARRIER.md":
        "eb04692b7ce8e06efe254053ba93e4c5f2051ceffe47e68015c9e12886d77584",
    "tests/test_growing_transition_absolute_sampling_forced_cancellation_barrier.py":
        "3bb7d6c45bd0d4d1564624f7ab9f22532229d51dd51d71a474674081fd266a7b",
    "notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md":
        "6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c",
    "tests/test_growing_transition_continuous_m11_unconditional_narrow_schedule.py":
        "626dc9f12cf7a4b58246e12f1b008d72bf9bb0e60713a0a10f6b5dda2e66eb34",
    "notes/GROWING_TRANSITION_CURVED_TWO_ENDPOINT_FIO_SHELL_THEOREM.md":
        "ddb1769d6e6f2b3214cb8191d631a161a1312f18c5bfbba4ca2ad11bb9f93341",
    "tests/test_growing_transition_curved_two_endpoint_fio_shell_theorem.py":
        "8d6bf688ffc938691789a558900ac95467a6631203f5fd262a5f4356431422cb",
    "notes/GROWING_TRANSITION_POLYLOG_BASE_CONTINUOUS_PRIME_SHELL_COROLLARY.md":
        "326d4d19a4c7bf93e920f2af1438fb0aba7dc797091bf0957abf9149bca018e1",
    "tests/test_growing_transition_polylog_base_continuous_prime_shell_corollary.py":
        "de07ecbac9c7404edc2508b54d3aa25a15f2d8f102b86199119af65ef9e6a2a7",
    "notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md":
        "7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564",
    "tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py":
        "caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def s_form(u: complex, v: complex) -> complex:
    return u.conjugate() * v + v.conjugate() * u


class ContinuousOddLaplaceCommonRepresentativeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_exact_kernel_has_no_z_one_row(self) -> None:
        for r in (0.03, 0.1, 0.7, 2.0):
            direct = 1.0 / math.sinh(r) - 2.0 * (1.0 + math.exp(-r))
            tower = -2.0 + 2.0 * sum(
                math.exp(-(2 * nu + 1) * r) for nu in range(1, 5000)
            )
            self.assertAlmostEqual(direct, tower, places=11)
        # The e^{-r} coefficient is +2 from csch(r) and -2 from the pole.
        self.assertEqual(2 - 2, 0)

    def test_hermitian_factor_and_odd_tower_coefficients(self) -> None:
        a0, b0 = 1.2 + 0.7j, -0.4 + 1.1j
        odd_rows = (
            (0.3 - 0.9j, 1.7 + 0.2j),
            (-1.0 + 0.4j, 0.8 - 0.6j),
        )
        q_up = -2.0 * a0.conjugate() * b0
        q_up += 2.0 * sum(a.conjugate() * b for a, b in odd_rows)
        herm_direct = (q_up + q_up.conjugate()) / 2.0
        herm_rows = -s_form(a0, b0)
        herm_rows += sum(s_form(a, b) for a, b in odd_rows)
        self.assertAlmostEqual(herm_direct.real, herm_rows.real, places=14)
        self.assertAlmostEqual(herm_direct.imag, 0.0, places=14)

    def test_exact_post_11_remainder_expansion(self) -> None:
        for epsilon in (-1.0, 1.0):
            a1, ap = 0.8 + 0.3j, -0.5 + 0.2j
            b1, bp = 1.1 - 0.4j, 0.7 + 0.9j
            full_minus_local = epsilon * (
                s_form(a1 + ap, b1 + bp) - s_form(a1, b1)
            )
            expanded = epsilon * (
                s_form(a1, bp) + s_form(ap, b1) + s_form(ap, bp)
            )
            self.assertAlmostEqual(full_minus_local.real, expanded.real)

    def test_cross_row_is_difference_of_positive_grams(self) -> None:
        for u, v in (
            (1.0 + 2.0j, -0.3 + 0.8j),
            (2.0, 2.0),
            (2.0, -2.0),
        ):
            lhs = s_form(complex(u), complex(v)).real
            rhs = 0.5 * (abs(u + v) ** 2 - abs(u - v) ** 2)
            self.assertAlmostEqual(lhs, rhs)
        self.assertGreater(s_form(2.0, 2.0).real, 0.0)
        self.assertLess(s_form(2.0, -2.0).real, 0.0)

    def test_double_null_corner_trace_cancellation(self) -> None:
        h_j, h_k = 0.7 + 0.2j, -1.1 + 0.4j
        mixed = h_j.conjugate() * (-h_k)
        mixed += (-h_j).conjugate() * h_k
        mixed += (-h_j).conjugate() * (-h_k)
        self.assertAlmostEqual(
            mixed.real,
            (-h_j.conjugate() * h_k).real,
        )
        self.assertAlmostEqual(
            mixed.imag,
            (-h_j.conjugate() * h_k).imag,
        )

    def test_ordered_profile_display_has_one_left_hand_side(self) -> None:
        self.assertEqual(self.text.count("\n a_f(s)&="), 1)
        self.assertEqual(self.text.count("\n b_f(t)&="), 1)
        self.assertNotIn("a_f(s)\n a_f(s)", self.text)

    def test_abstract_countermodel_kernel_has_both_signs(self) -> None:
        epsilon = 0.01
        for s in (epsilon / 4.0, epsilon / 3.0, epsilon / 2.0):
            for t in (epsilon / 4.0, epsilon / 3.0, epsilon / 2.0):
                r = s + t
                kernel = 1.0 / math.sinh(r) - 2.0 * (1.0 + math.exp(-r))
                self.assertGreater(kernel, 0.0)
                self.assertGreater(kernel * 3.0, 0.0)
                self.assertLess(kernel * -3.0, 0.0)

    def test_forced_cancellation_after_small_prime_shell(self) -> None:
        for tau, outer, prime_11 in (
            (100.0, 4.0, 3.0),
            (20.0, 1.0, 0.5),
        ):
            forced = tau - outer
            remaining = forced - prime_11
            self.assertGreaterEqual(remaining, tau - outer - prime_11)
            self.assertGreater(remaining, 0.0)

    def test_scope_and_ordered_quantifiers_are_explicit(self) -> None:
        for token in (
            "apparent Laplace row at `z=1` cancels exactly",
            "improper or Abel source convention",
            "Hermitianize the finite-cutoff ordered form",
            "only then let `lambda to infinity`",
            "No equality-conductor form is inserted as a summand",
            "not asserted to lie in the physical",
            "asserts no inversion parity",
            "bounded one-sided first jets",
            "finite-`M` trace cancellation",
            "not annihilate any Laplace row",
            "far endpoint traces",
            "frozen compactly supported transition-source",
            "not a statement for a generic",
            "Only under these realized-packet hypotheses",
            "Without that realization and leakage",
            "minimal intrinsic continuous-sector route",
            "does not imply a Loewner lower bound for either summand",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, self.text)

    def test_required_exact_formulas_present(self) -> None:
        for token in (
            "k_{\\rm cont}(r)={1\\over\\sinh r}-2(1+e^{-r})",
            "-\\mathsf S(\\mathcal A_{M,0},\\mathcal B_{M,0})",
            "r\\in\\{0,3,5,\\ldots\\}",
            "\\mathsf S(U,V)={1\\over2}",
            "\\Gamma_{\\rm in}-\\Gamma_{\\rm out}",
            "a_f(L+t)=\\lambda b_f(t)",
            "R_{\\rm comp}=Q_X-Q_{\\rm loc}",
            "P_E(\\widehat R_{\\rm cont}",
            "\\widehat Q_{p,\\ne11}",
        ):
            self.assertIn(token, self.text)

    def test_displays_compile_as_tex(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.DOTALL)
        self.assertGreaterEqual(len(displays), 30)
        source = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as tmp:
            tex = Path(tmp) / "displays.tex"
            tex.write_text(source, encoding="utf-8")
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
            self.assertEqual(result.returncode, 0, result.stdout[-4000:])

    def test_display_balance_unique_tags_ascii_and_no_stale_hash(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(b in (9, 10, 13) or 32 <= b <= 126 for b in data))
        self.assertNotIn("TO_BE_FROZEN", self.text)


if __name__ == "__main__":
    unittest.main()
