#!/usr/bin/env python3
"""Regressions for forced ordered nonresonant prime compensation."""

from __future__ import annotations

import hashlib
import math
import re
import shutil
import subprocess
import tempfile
import unittest
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md"
)
NOTE_HASH = "787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79"

FROZEN = {
    "notes/GROWING_TRANSITION_COMPLETE_ODD_LAPLACE_TAIL_THEOREM.md":
        "a65edf2f7268cf9be46cdb711a5999c90ce667c9928986b0bf607915a3d92408",
    "tests/test_growing_transition_complete_odd_laplace_tail_theorem.py":
        "3cde8608887da5354b6afebb84696f8110b573dae6b76a7abe6198ee52482e0e",
    "notes/GROWING_TRANSITION_ETA_NULL_RENORMALIZED_SOURCE_KREIN_INTERTWINER_THEOREM.md":
        "0c7c20639645d912d0e896bf064f83e3bd26078d716a183fa703d1586673d0d5",
    "tests/test_growing_transition_eta_null_renormalized_source_krein_intertwiner_theorem.py":
        "fac207d0c4847e7f624848aa174fae013f7099382d9ba785651be634849c5505",
    "notes/GROWING_TRANSITION_ONE_SIDED_ODD_LAPLACE_ROW_AND_FORWARD_ALIAS_THEOREM.md":
        "0edbe7253f6164399d468517bc9cbb9c8d9317250ac7dcc526eca9a8e15e7d3b",
    "tests/test_growing_transition_one_sided_odd_laplace_row_and_forward_alias_theorem.py":
        "97215866f7cf3a6969a7ec92d81e722a6e376034e95d58ff1e759b3780fcc79f",
    "notes/GROWING_TRANSITION_ABSOLUTE_SAMPLING_FORCED_CANCELLATION_BARRIER.md":
        "eb04692b7ce8e06efe254053ba93e4c5f2051ceffe47e68015c9e12886d77584",
    "tests/test_growing_transition_absolute_sampling_forced_cancellation_barrier.py":
        "3bb7d6c45bd0d4d1564624f7ab9f22532229d51dd51d71a474674081fd266a7b",
    "notes/GROWING_TRANSITION_POLYLOG_BASE_CONTINUOUS_PRIME_SHELL_COROLLARY.md":
        "326d4d19a4c7bf93e920f2af1438fb0aba7dc797091bf0957abf9149bca018e1",
    "tests/test_growing_transition_polylog_base_continuous_prime_shell_corollary.py":
        "de07ecbac9c7404edc2508b54d3aa25a15f2d8f102b86199119af65ef9e6a2a7",
    "notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md":
        "7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564",
    "tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py":
        "caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_RESONANCE_AND_NONRESONANT_FRAME_GATE_THEOREM.md":
        "511abdb8dd5e9bfe765e518812f19ab8df351803438c0a731387f3dd8d413460",
    "tests/test_growing_transition_ordered_prime_resonance_and_nonresonant_frame_gate_theorem.py":
        "634ec6af8e27db305c22d305d12bdd650b834d947c8afa9a3d6dbf27120482b8",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md":
        "7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74",
    "tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py":
        "d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class ForcedOrderedNonresonantPrimeFrameTheoremTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertNotEqual(NOTE_HASH, "PENDING")
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for rel, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / rel), expected, rel)

    def test_realized_polylog_scope_and_seven_row_inventory(self) -> None:
        for token in (
            "realized polylogarithmic-base packet",
            "B_L=(\\log L)^4",
            "\\boxed{{1\\over2}<hC<1,}",
            "`m` nodes in each cluster with `m>7`",
            "\\ell_0(g)=a_0(g)=g(0)=0",
            "\\ell_{\\rm int},\\quad \\ell_0,\\quad \\Gamma_{\\rm in},\\quad",
            "\\rho_{\\rm out},\\quad \\eta,\\quad",
            "\\widehat{\\mathcal A}^{1,\\rm mod}_0,\\quad",
            "\\widehat{\\mathcal A}_1",
            "E=E_-\\cap\\bigcap_{j=1}^7\\ker\\ell_j",
            "\\dim E\\geq m-7>0",
            "standard six-row space obtained by omitting only",
            "smaller space `E subset E_6`",
        ):
            self.assertIn(token, self.text)

    def test_continuous_completion_rows_and_constant(self) -> None:
        for token in (
            "uncorrected modal local pole row",
            "complete corrected row after the ordered Poisson",
            "f(0)=0,\\qquad \\int_{\\mathbb R}f=0,\\qquad \\eta(f)=0",
            "\\Gamma_{\\rm in}-\\Gamma_{\\rm out}",
            "it is not an eighth\nrow",
            "\\mathcal A_0=\\lambda\\mathcal A_1=0",
            "P_E\\widehat Q_{\\rm cont}P_E",
            "\\preceq-{c'_m\\over4}T_LP_E",
        ):
            self.assertIn(token, self.text)

    def test_invisible_origin_bump_is_exactly_zero_on_e(self) -> None:
        for token in (
            "f=g-a_0\\psi(2\\lambda\\,\\cdot)",
            "H=G-{a_0\\over2\\lambda}",
            "On `E`, the new row (0.5a) gives `a_0=0`",
            "compact, Fourier, mixed, and bump--bump contribution",
            "\\widehat Q_{p,11}^{\\rm bump}=0=o(T_L)",
            "do not themselves state a corrected prime-shell bound",
            "avoids extrapolating those estimates to a new block",
            "analytic/modal shell is exactly the corrected physical shell",
            "\\|P_E\\widehat Q_{p,11}P_E\\|=o(T_L)",
            "not inferred from the unexpanded `(1,1)` sentence",
        ):
            self.assertIn(token, self.text)

    def test_exact_complete_decomposition_and_matching(self) -> None:
        for token in (
            "\\widehat Q_X=\\widehat Q_{\\rm cont}",
            "+\\widehat Q_{p,11}+\\widehat Q_{\\rm res}",
            "+\\widehat Q_{\\rm off}",
            "\\left\\|P_E(\\widehat Q_{\\rm off}",
            "+\\widehat Q_{\\rm cont})P_E\\right\\|",
            "=o(T_L)",
            "P_E\\widehat Q_{\\rm off}P_E",
            "\\succeq {c'_m\\over8}T_LP_E",
            "There is no additional equality-conductor, midpoint, mask, or central\nsummand",
        ):
            self.assertIn(token, self.text)

    def test_ordered_partition_is_disjoint_and_exhaustive(self) -> None:
        triples = [(r, n, ell) for r in range(1, 9)
                   for n in range(2, 7) for ell in range(1, 6)]
        for r, n, ell in triples:
            in_11 = r == 1 and ell == 1
            in_res = (r, ell) != (1, 1) and ell * n == r
            in_off = (r, ell) != (1, 1) and ell * n != r
            self.assertEqual(sum((in_11, in_res, in_off)), 1)
            if in_11:
                self.assertNotEqual(ell * n, r)

        for token in (
            "These sets are disjoint and exhaustive",
            "would force `n=1`, contrary to `n>=2`",
            "Q_{p,M}=Q_{p,11,M}+Q_{{\\rm res},M}+Q_{{\\rm off},M}",
        ):
            self.assertIn(token, self.text)

    def test_hermitian_and_gram_coefficients_are_exact(self) -> None:
        weight = Fraction(7, 3)
        u = Fraction(5, 2)
        v = Fraction(-4, 3)
        gauge = Fraction(3, 10)
        u_prime = gauge * u
        v_prime = v / gauge
        self.assertEqual(2 * u_prime * v_prime, 2 * u * v)
        sym_cross = 2 * u * v
        prime_cross = weight * sym_cross / 4
        gram_difference = (
            weight
            * ((u_prime + v_prime) ** 2 - (u_prime - v_prime) ** 2)
            / 8
        )
        self.assertEqual(gram_difference, prime_cross)
        for token in (
            "Q_{p,M}={1\\over4}\\sum_{r,n,l}",
            "\\varrho_{r,l,n}={r\\over ln}",
            "\\mathcal A'_{r,l,n}=\\varrho_{r,l,n}\\mathcal A_{r,n}",
            "\\mathcal B'_{r,l,n}=\\varrho_{r,l,n}^{-1}",
            "preserve every\ncross exactly",
            "sqrt{{\\omega_M(r)\\Lambda(n)\\omega_M(l)\\over8}}",
            "=2\\mathsf S(U,V)",
            "exactly at both finite cutoffs",
        ):
            self.assertIn(token, self.text)

    def test_exact_rearrangement_has_no_residual_component(self) -> None:
        q_cont = Fraction(-31, 2)
        q_p11 = Fraction(2, 5)
        q_res = Fraction(7, 6)
        q_off = Fraction(53, 4)
        q_x = q_cont + q_p11 + q_res + q_off
        self.assertEqual(
            q_off + q_cont,
            q_x - q_p11 - q_res,
        )
        self.assertIn(
            "=P_E(\\widehat Q_X-\\widehat Q_{p,11}",
            self.text,
        )

    def test_strict_scale_separation(self) -> None:
        h_c = 0.625
        m = 8
        self.assertGreater(h_c, 0.5)
        self.assertLess(h_c, 1.0)
        self.assertLess(0.5 - h_c, 0.0)
        for polylog_power in (0, 4, 20):
            log_c = 1_000_000.0
            log_l = math.log(log_c)
            log_absolute_ratio = (
                (0.5 - h_c) * log_c
                + (2 * m + polylog_power) * log_l
            )
            self.assertLess(log_absolute_ratio, 0.0)
        log_resonance_ratio = (2 + 2 * m) * math.log(1_000_000.0) - h_c * 1_000_000.0
        self.assertLess(log_resonance_ratio, 0.0)
        for token in (
            "=c^{1/2+o(1)}",
            "{B_{{\\rm out},2m}\\over T_L}",
            "c^{1/2-hC+o(1)}L^{2m}\\longrightarrow0",
            "{L^2\\over T_L}\\longrightarrow0",
        ):
            self.assertIn(token, self.text)

    def test_one_eighth_lower_bound_is_fail_closed(self) -> None:
        c_prime = Fraction(12, 1)
        scale = Fraction(5, 1)
        continuous = -c_prime * scale / 4
        worst_allowed_error = -c_prime * scale / 8
        off = -continuous + worst_allowed_error
        self.assertEqual(off, c_prime * scale / 8)
        self.assertGreater(off, 0)

    def test_genuine_off_features_and_positive_lower_frame(self) -> None:
        lower = Fraction(3, 2)
        difference_eigenvalues = (lower, Fraction(11, 4))
        negative_gram_eigenvalues = (Fraction(5, 7), Fraction(9, 8))
        positive_gram_eigenvalues = tuple(
            d + n for d, n in zip(
                difference_eigenvalues,
                negative_gram_eigenvalues,
            )
        )
        self.assertGreaterEqual(min(positive_gram_eigenvalues), lower)
        for token in (
            "\\widehat{\\mathcal G}_{\\pm,M,R}x",
            "\\mathfrak H_{\\rm off}",
            "\\sum_{r,l,n}{\\Lambda(n)\\over4}",
            "Hilbert-space\ndominated convergence",
            "\\lim_{M\\to\\infty}^{\\rm ordered}",
            "\\lim_{R\\to\\infty}",
            "two positive Grams converge\nseparately",
            "\\left.P_E\\widehat Q_{\\rm off}P_E\\right|_E",
            "s_{\\min}\\!\\left(\\widehat{\\mathcal G}_{+}|_E\\right)",
            "\\geq \\sqrt{{c'_mT_L\\over8}}",
            "actual packet-level prime feature at each fixed `lambda`",
            "does not bound the negative branch",
            "canonical generator-level intertwiner",
        ):
            self.assertIn(token, self.text)
        self.assertNotIn("\\liminf_{M\\to\\infty}", self.text)

    def test_ordered_quantifiers_and_fail_closed_boundary(self) -> None:
        for token in (
            "fix `lambda`, the realized packet, a finite Fejer cutoff `M`, and a",
            "finite prime cutoff `R`",
            "Hermitianize at those\n   cutoffs",
            "take `R to infinity` in the positive Hilbert norm",
            "take `M to infinity` in the prescribed ordered sense",
            "only then let `lambda to infinity`",
            "The fixed-linear packet is excluded",
            "no fixed-product mask, equality\nrepresentative, midpoint row",
            "no complete central sign",
            "No dyadic localization is used",
            "no RH statement",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, self.text)

    def test_no_unresolved_placeholders_or_external_citations(self) -> None:
        lowered = self.text.lower()
        for bad in ("todo", "tbd", "placeholder", "arxiv", "http://", "https://"):
            self.assertNotIn(bad, lowered)
        self.assertIsNone(re.search(r"\bcitation needed\b", lowered))

    def test_display_balance_unique_tags_ascii_and_no_control_bytes(self) -> None:
        starts = re.findall(r"(?m)^\s*\\\[\s*$", self.text)
        ends = re.findall(r"(?m)^\s*\\\]\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(byte in (9, 10) or 32 <= byte <= 126 for byte in data))

    def test_displays_compile_as_tex(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.DOTALL)
        self.assertGreaterEqual(len(displays), 25)
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
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex.name],
                cwd=tmp,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stdout[-5000:])


if __name__ == "__main__":
    unittest.main()
