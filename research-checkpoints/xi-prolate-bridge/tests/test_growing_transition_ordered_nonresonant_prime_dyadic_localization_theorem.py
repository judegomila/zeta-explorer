#!/usr/bin/env python3
"""Regressions for ordered nonresonant-prime dyadic localization."""

from __future__ import annotations

import cmath
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
    / "GROWING_TRANSITION_ORDERED_NONRESONANT_PRIME_DYADIC_LOCALIZATION_THEOREM.md"
)

# This sentinel is replaced only after all symbolic, tail, dependency, and
# TeX checks pass.  It deliberately prevents an accidental draft freeze.
NOTE_HASH = "21b32b583942d107e1c93b84ca322e76401fe9eca1995dbf5549609c71f4c8e0"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md":
        "787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79",
    "tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py":
        "73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7",
    "notes/GROWING_TRANSITION_ETA_NULL_RENORMALIZED_SOURCE_KREIN_INTERTWINER_THEOREM.md":
        "0c7c20639645d912d0e896bf064f83e3bd26078d716a183fa703d1586673d0d5",
    "tests/test_growing_transition_eta_null_renormalized_source_krein_intertwiner_theorem.py":
        "fac207d0c4847e7f624848aa174fae013f7099382d9ba785651be634849c5505",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_RESONANCE_AND_NONRESONANT_FRAME_GATE_THEOREM.md":
        "511abdb8dd5e9bfe765e518812f19ab8df351803438c0a731387f3dd8d413460",
    "tests/test_growing_transition_ordered_prime_resonance_and_nonresonant_frame_gate_theorem.py":
        "634ec6af8e27db305c22d305d12bdd650b834d947c8afa9a3d6dbf27120482b8",
    "notes/TRANSITION_PROLATE_OUTER_THEOREM.md":
        "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    "tests/test_transition_prolate_outer.py":
        "bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433",
    "notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md":
        "7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564",
    "tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py":
        "caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c",
    "notes/GROWING_TRANSITION_CURVED_TWO_ENDPOINT_FIO_SHELL_THEOREM.md":
        "ddb1769d6e6f2b3214cb8191d631a161a1312f18c5bfbba4ca2ad11bb9f93341",
    "tests/test_growing_transition_curved_two_endpoint_fio_shell_theorem.py":
        "8d6bf688ffc938691789a558900ac95467a6631203f5fd262a5f4356431422cb",
    "notes/GROWING_TRANSITION_EULER_RESOLVENT_CURVED_HARD_ALIAS_COMPLETION_THEOREM.md":
        "429488fd14d246a6bcbe0495e4a6290569535536e118ff05ac9ad581845ac0dd",
    "tests/test_growing_transition_euler_resolvent_curved_hard_alias_completion_theorem.py":
        "6f8b65303cd8611c0d0f54ad8996808d541de91ca03150531e57488758aeeb16",
    "notes/GROWING_TRANSITION_COMPLETE_ODD_LAPLACE_TAIL_THEOREM.md":
        "a65edf2f7268cf9be46cdb711a5999c90ce667c9928986b0bf607915a3d92408",
    "tests/test_growing_transition_complete_odd_laplace_tail_theorem.py":
        "3cde8608887da5354b6afebb84696f8110b573dae6b76a7abe6198ee52482e0e",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def s_form(a_value: complex, b_value: complex) -> float:
    value = a_value.conjugate() * b_value + b_value.conjugate() * a_value
    return value.real


class OrderedNonresonantPrimeDyadicLocalizationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_note_freeze_sentinel_and_dependencies(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
        if NOTE_HASH.startswith("DRAFT_"):
            self.skipTest("draft note intentionally awaits final self-hash")
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_reciprocal_gauge_preserves_each_cross_exactly(self) -> None:
        samples = (
            (1, 2, 3, 1.2 - 0.7j, -0.3 + 2.0j),
            (7, 5, 11, -2.0 + 0.2j, 0.8 - 1.1j),
            (23, 2, 3, 4.0 + 1.0j, -1.0 - 3.0j),
        )
        for inward, outward, prime, a_value, b_value in samples:
            ratio = inward / (outward * prime)
            self.assertAlmostEqual(
                s_form(ratio * a_value, b_value / ratio),
                s_form(a_value, b_value),
                places=12,
            )

    def test_positive_cross_majorant_is_exact(self) -> None:
        for a_value, b_value in (
            (1.0 + 3.0j, -2.0 + 0.5j),
            (-4.0 + 0.2j, 3.0 - 2.0j),
            (0.1 - 0.7j, -1.3 - 0.4j),
        ):
            cross = s_form(a_value, b_value)
            squares = abs(a_value) ** 2 + abs(b_value) ** 2
            self.assertLessEqual(abs(cross), squares + 1e-14)

    def test_first_slot_scalar_sums_have_claimed_scales(self) -> None:
        for lam in (8.0, 20.0, 50.0):
            conductor = int(lam * lam)
            for n_value in (2, conductor // 2, conductor, 3 * conductor):
                u_value = lam / n_value if n_value <= conductor else 1 / lam
                partial = math.fsum(
                    r_value / max(2 * lam, r_value * u_value) ** 3
                    for r_value in range(1, 200_001)
                )
                # The omitted tail is at most u^(-3)/200000.
                complete_upper = partial + u_value ** (-3) / 200_000
                claimed_scale = 1 / (lam * u_value**2)
                self.assertLess(complete_upper, 3.0 * claimed_scale)

                inward_cut = max(2 * conductor, 100)
                tail = math.fsum(
                    r_value / max(2 * lam, r_value * u_value) ** 3
                    for r_value in range(inward_cut + 1, inward_cut + 200_001)
                )
                tail += u_value ** (-3) / (inward_cut + 200_000)
                self.assertLess(tail, 1.1 / (inward_cut * u_value**3))

    def test_second_slot_two_prime_ranges_are_correct(self) -> None:
        for lam in (10.0, 20.0, 40.0):
            conductor = int(lam * lam)
            for n_value in (
                conductor // 2,
                conductor,
                conductor + 1,
                2 * conductor,
                5 * conductor,
            ):
                u_value = lam / n_value if n_value <= conductor else 1 / lam
                partial = math.fsum(
                    ell * n_value
                    / max(2 * lam, ell * n_value * u_value) ** 3
                    for ell in range(1, 200_001)
                )
                # Once ell is large the summand is
                # 1/(ell^2*n^2*u^3); this bounds the omitted tail.
                partial += 1 / (
                    200_000 * n_value**2 * u_value**3
                )
                if n_value <= conductor:
                    scale = n_value / lam**3
                else:
                    scale = lam**3 / n_value**2
                self.assertLess(partial, 2.0 * scale)

    def test_near_second_slot_has_no_compact_band(self) -> None:
        for lam in (7.5, 20.5, 50.5):
            conductor = lam * lam
            for n_value in (2, int(conductor), int(conductor) + 1, int(4 * conductor)):
                u_value = max(lam / n_value, 1 / lam)
                for ell in (1, 2, 7):
                    lower = ell * n_value * u_value
                    self.assertGreaterEqual(lower + 1e-12, lam)
                    if n_value > 2 * conductor or ell > 2:
                        self.assertGreaterEqual(lower + 1e-12, 2 * lam)

    def test_cutoff_exponents_make_every_tail_small(self) -> None:
        delta = 0.07
        for sigma in (0.51, 0.72, 0.95, 0.999):
            n_exponent = 5 - sigma + delta
            m_exponent = 4 - sigma + delta

            # Exponents after division by T=c^sigma/poly(L).
            far_n = 5 - n_exponent - sigma
            far_m = 4 - m_exponent - sigma
            band_n = (1 + 2 * sigma) + 2 - n_exponent - sigma
            band_l = (1 + 2 * sigma) + 1 - m_exponent - sigma
            near_b_m = 2 - m_exponent - sigma

            self.assertAlmostEqual(far_n, -delta)
            self.assertAlmostEqual(far_m, -delta)
            self.assertAlmostEqual(band_n, 2 * sigma - 2 - delta)
            self.assertAlmostEqual(band_l, 2 * sigma - 2 - delta)
            for exponent in (far_n, far_m, band_n, band_l, near_b_m):
                self.assertLess(exponent, 0)

    def test_polylog_factors_are_absorbed_by_cutoff_margin(self) -> None:
        delta = 0.03
        previous = math.inf
        for log_c in (1_000.0, 10_000.0, 100_000.0):
            log_l = math.log(log_c)
            # More than enough for every fixed L^K and (1+log N).
            log_ratio = 100 * log_l - delta * log_c
            self.assertLess(log_ratio, previous)
            previous = log_ratio

    def test_dyadic_box_count_is_cubic_in_L(self) -> None:
        sigma = 0.73
        delta = 0.05
        previous_ratio = 0.0
        for ell_value in (100.0, 1_000.0, 10_000.0):
            log2_c = ell_value / math.log(2)
            n_logs = 1 + math.ceil((5 - sigma + delta) * log2_c)
            m_logs = 1 + math.ceil((4 - sigma + delta) * log2_c)
            box_count = n_logs * m_logs * m_logs
            ratio = box_count / ell_value**3
            self.assertGreater(ratio, previous_ratio * 0.9)
            self.assertLess(ratio, 300.0)
            previous_ratio = ratio

    def test_pigeonhole_gives_only_a_positive_eigenvalue(self) -> None:
        # Two indefinite boxes can sum to a positive-definite operator.
        box_one = (2.0, -100.0)
        box_two = (-1.0, 102.0)
        total = tuple(a + b for a, b in zip(box_one, box_two))
        self.assertGreaterEqual(min(total), 1.0)
        self.assertLess(min(box_one), 0.0)
        self.assertLess(min(box_two), 0.0)

        direction = 0
        values = (box_one[direction], box_two[direction])
        self.assertGreaterEqual(max(values), total[direction] / 2)
        self.assertGreater(max(box_one), 0.0)

    def test_exact_seven_rows_and_forced_scale_are_locked(self) -> None:
        for token in (
            "\\ell_{\\rm int},\\quad \\Gamma_{\\rm in}",
            "\\rho_{\\rm out},\\quad \\eta",
            "\\widehat{\\mathcal A}^{1,{\\rm mod}}_0",
            "\\widehat{\\mathcal A}_1",
            "\\ell_0",
            "ell_0(g)=a_0(g)=g(0)",
            "\\dim E\\geq m-7>0",
            "H_{\\rm bump}\\equiv0",
            "T_L={e^{hCL}\\over L^{2m}}",
            "{1\\over2}<\\sigma:=hC<1",
            "{c'_m\\over8}T_LP_E",
        ):
            self.assertIn(token, self.text)

    def test_transition_constants_and_derivative_blocker_are_explicit(self) -> None:
        for token in (
            "|R_\\gamma(t)|\\leq{18A_\\gamma\\mathcal K\\over t^2}",
            "A_\\gamma^2\\leq2592\\lambda d_\\gamma",
            "18\\mathcal K\\sqrt{2592(2m)\\lambda}",
            "C_{\\infty,L}^2\\leq C_m\\lambda^7",
            "|f_x'(\\lambda-)|+|f_x'(-\\lambda+)|",
            "\\|f_x''\\|_{L^1}",
            "source-dependent `C_H(x)`",
            "earliest localization blocker",
            "common `t^{-1}sin(kt)` term cancels exactly",
        ):
            self.assertIn(token, self.text)

    def test_tail_ledger_and_no_missing_second_slot_band_are_locked(self) -> None:
        for token in (
            "{A^2(1+\\log N)\\over N}+{AL\\over J}",
            "{\\lambda^3(1+\\log N)\\over N}",
            "{\\lambda L\\over M}+{\\lambda L\\over J}",
            "+{A^2L\\over M}",
            "there is no omitted compact-band\nterm in the second slot",
            "\\lambda^3/n^2,&n>A",
            "no prime-number theorem is used",
        ):
            self.assertIn(token, self.text)

    def test_ordered_limits_cutoffs_and_claim_boundary_are_locked(self) -> None:
        for token in (
            "N_L=\\left\\lceil c^{5-\\sigma+\\delta}\\right\\rceil",
            "M_L=J_L=\\left\\lceil c^{4-\\sigma+\\delta}\\right\\rceil",
            "take `R to infinity` at fixed `F`",
            "take `F to infinity` in the prescribed ordered sense",
            "only afterward let `lambda to infinity`",
            "For every fixed finite dyadic box",
            "positive eigenvalue, equivalently one\npositive direction",
            "does **not** assert a Loewner lower",
            "fixed-linear schedule",
            "fixed-product mask",
            "regrouping by\n`rln`",
            "neither localization to one triple",
            "or RH",
        ):
            self.assertIn(token, self.text)

    def test_displays_compile_as_tex(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.DOTALL)
        self.assertGreaterEqual(len(displays), 45)
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
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex.name],
                cwd=tmp,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stdout[-5000:])

    def test_display_balance_unique_tags_ascii_and_no_placeholder(self) -> None:
        starts = re.findall(r"(?m)^\s*\\\[\s*$", self.text)
        ends = re.findall(r"(?m)^\s*\\\]\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in data))
        self.assertNotIn("AWAITING_FINAL_FREEZE", self.text)
        self.assertNotIn("TO_BE_FROZEN", self.text)
        self.assertNotIn(",qquad", self.text)


if __name__ == "__main__":
    unittest.main()
