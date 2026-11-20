#!/usr/bin/env python3
"""Regressions for the ordered-prime hard-tail PNT--Gram reduction."""

from __future__ import annotations

import hashlib
import math
import re
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes/GROWING_TRANSITION_ORDERED_PRIME_HARD_TAIL_PNT_GRAM_REDUCTION.md"
)
NOTE_HASH = "b8439dcfa6f969fd84dae8fafb5474c3e176ba14d84c7d73140fabeac042a4be"

FROZEN = {
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_RESONANCE_AND_NONRESONANT_FRAME_GATE_THEOREM.md":
        "511abdb8dd5e9bfe765e518812f19ab8df351803438c0a731387f3dd8d413460",
    "tests/test_growing_transition_ordered_prime_resonance_and_nonresonant_frame_gate_theorem.py":
        "634ec6af8e27db305c22d305d12bdd650b834d947c8afa9a3d6dbf27120482b8",
    "notes/GROWING_TRANSITION_ODD_LAPLACE_EULER_RESOLVENT_MIXED_EDGE_ALIAS_REDUCTION_THEOREM.md":
        "289cc268263df97c0b778dc81cc982023a2793675dcb10c1b225ef42e965a467",
    "tests/test_growing_transition_odd_laplace_euler_resolvent_mixed_edge_alias_reduction_theorem.py":
        "395f53fcd03dc26b8951cd8b1b208b811ae1479c90ad4b15d841c825bad93f05",
    "notes/GROWING_TRANSITION_ETA_NULL_RENORMALIZED_SOURCE_KREIN_INTERTWINER_THEOREM.md":
        "0c7c20639645d912d0e896bf064f83e3bd26078d716a183fa703d1586673d0d5",
    "tests/test_growing_transition_eta_null_renormalized_source_krein_intertwiner_theorem.py":
        "fac207d0c4847e7f624848aa174fae013f7099382d9ba785651be634849c5505",
    "notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md":
        "7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564",
    "tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py":
        "caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c",
    "notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md":
        "eda566d5a2867d28f5218a89a48cc95c30fe74491fb11bb74b86c7fb6ed68ac6",
    "tests/test_weighted_pnt_discrepancy_normal_form_source_lock.py":
        "a28319345a0c81628b6d6a767fdc430b2734565d805b7b300f5818c8253212f7",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def von_mangoldt(index: int) -> float:
    if index < 2:
        return 0.0
    for prime in range(2, index + 1):
        if any(prime % divisor == 0
               for divisor in range(2, math.isqrt(prime) + 1)):
            continue
        power = prime
        while power < index:
            power *= prime
        if power == index:
            return math.log(prime)
    return 0.0


def discrepancy(value: float) -> float:
    return math.fsum(
        von_mangoldt(index)
        for index in range(2, math.floor(value) + 1)
    ) - math.floor(value)


def integrate_centered_discrepancy(left: float, right: float) -> float:
    """Integrate D(t)-D(left) exactly between its integer jumps."""
    points = [left]
    points.extend(
        float(index)
        for index in range(math.floor(left) + 1, math.floor(right) + 1)
        if left < index < right
    )
    points.append(right)
    base = discrepancy(left)
    total = 0.0
    for start, end in zip(points, points[1:]):
        midpoint = (start + end) / 2.0
        total += (end - start) * (discrepancy(midpoint) - base)
    return total


class OrderedPrimeHardTailPntGramReductionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
        if NOTE_HASH.startswith("DRAFT_"):
            self.skipTest("draft awaits independent exact audit")
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_hard_tail_really_has_common_interval(self) -> None:
        for odd_p in (5, 9, 21):
            lam = odd_p / 2
            conductor = lam * lam
            self.assertNotEqual(conductor, math.floor(conductor))
            for prime_index in range(math.floor(conductor) + 1,
                                     math.floor(conductor) + 8):
                u_n = max(lam / prime_index, 1 / lam)
                self.assertEqual(u_n, 1 / lam)
                for inward in range(math.floor(conductor) + 1,
                                    math.floor(conductor) + 5):
                    self.assertGreater(inward * u_n, lam)

    def test_l1_pnt_gram_identity_and_resonance_subtraction(self) -> None:
        rows = {
            7: 1.2 - 0.4j,
            8: -0.7 + 1.1j,
            9: 0.3 + 0.8j,
            10: -1.4 - 0.2j,
        }
        direct = 0.0
        for inward, left_row in rows.items():
            for prime_index, right_row in rows.items():
                direct += (
                    0.5
                    * von_mangoldt(prime_index)
                    * (left_row.conjugate() * right_row).real
                )

        sampler = sum(rows.values())
        residual = sum(
            (von_mangoldt(index) - 1.0) * row
            for index, row in rows.items()
        )
        reduced = (
            0.5 * abs(sampler) ** 2
            + 0.5 * (sampler.conjugate() * residual).real
        )
        self.assertAlmostEqual(direct, reduced, places=13)

        resonance = 0.5 * sum(
            von_mangoldt(index) * abs(row) ** 2
            for index, row in rows.items()
        )
        direct_off = 0.0
        for inward, left_row in rows.items():
            for prime_index, right_row in rows.items():
                if inward == prime_index:
                    continue
                direct_off += (
                    0.5
                    * von_mangoldt(prime_index)
                    * (left_row.conjugate() * right_row).real
                )
        self.assertAlmostEqual(direct_off, reduced - resonance, places=13)
        self.assertGreaterEqual(resonance, 0.0)

    def test_centered_stieltjes_endpoint_formula(self) -> None:
        # For T_t=t, T'_t=1.  This checks the exact (X,Y] convention,
        # including nonintegral endpoints and the lower centering.
        for left, right in ((6.25, 14.7), (10.4, 30.25), (25.25, 50.9)):
            left_sum = math.fsum(
                (von_mangoldt(index) - 1.0) * index
                for index in range(math.floor(left) + 1,
                                   math.floor(right) + 1)
                if index <= right
            )
            delta_right = discrepancy(right) - discrepancy(left)
            right_side = (
                delta_right * right
                - integrate_centered_discrepancy(left, right)
            )
            self.assertAlmostEqual(left_sum, right_side, places=11)

    def test_change_of_variables_retains_both_hard_endpoints(self) -> None:
        lam = 4.5
        inward = 37
        ell = 3
        prime_index = 14
        ratio = ell * prime_index / inward

        # H(t)=exp(-t) permits a stable numerical check of u -> v=mu.
        subdivisions = 200_000
        u_left = 1 / lam
        u_right = lam
        du = (u_right - u_left) / subdivisions
        direct = 0.0
        for index in range(subdivisions):
            u_value = u_left + (index + 0.5) * du
            direct += du * math.exp(-inward * u_value) * math.exp(
                -ell * prime_index * u_value
            )

        v_left = inward / lam
        v_right = inward * lam
        dv = (v_right - v_left) / subdivisions
        changed = 0.0
        for index in range(subdivisions):
            v_value = v_left + (index + 0.5) * dv
            changed += (
                dv
                * math.exp(-v_value)
                * math.exp(-ratio * v_value)
                / inward
            )
        self.assertAlmostEqual(direct, changed, places=12)
        self.assertAlmostEqual(ratio * v_left, ell * prime_index / lam)

    def test_higher_sampler_cross_has_no_square_identity(self) -> None:
        inward_rows = (1.2 - 0.5j, -0.2 + 0.8j, 0.7 + 0.1j)
        outward_rows = (-0.9 + 0.3j, 0.4 + 1.1j)
        residual_rows = (0.2 - 0.6j, -0.5 + 0.2j)
        sampler = sum(inward_rows)
        unweighted = sum(outward_rows)
        residual = sum(residual_rows)
        direct = 0.5 * (
            sampler.conjugate() * (unweighted + residual)
        ).real
        reduced = (
            0.5 * (sampler.conjugate() * unweighted).real
            + 0.5 * (sampler.conjugate() * residual).real
        )
        self.assertAlmostEqual(direct, reduced, places=14)
        self.assertNotAlmostEqual(
            0.5 * abs(sampler) ** 2,
            0.5 * (sampler.conjugate() * unweighted).real,
        )

    def test_incomplete_poisson_endpoint_inventory(self) -> None:
        lam = 7.5

        def compact_source(value: float) -> float:
            if abs(value) > lam:
                return 0.0
            return (1.0 - (value / lam) ** 2) * (value / lam) ** 2

        self.assertEqual(compact_source(lam), 0.0)
        for ell in range(1, 9):
            supported = [
                index
                for index in range(1, 3 * ell + 1)
                if compact_source(index * lam / ell) != 0.0
            ]
            self.assertEqual(supported, list(range(1, ell)))

    def test_conductor_scale_and_fail_closed_gate_are_explicit(self) -> None:
        for token in (
            "Q_{1,W}={1\\over2}\\mathcal S_W^*\\mathcal S_W",
            "\\|x\\|_D^2=2\\int_\\lambda^\\infty|H_x(v)|^2\\,dv",
            "+{1\\over4}\\{\\mathcal S_W^*\\mathcal R_W",
            "Q_{{\\rm off},1,W}",
            "-{1\\over2}",
            "\\mathcal R_W",
            "=\\int_{(X,Y]}\\mathcal T_t\\,dD(t)",
            "\\{D(Y)-D(X)\\}\\mathcal T_Y",
            "\\mathcal R_A=-D(A)\\mathcal T_A",
            "(\\mathcal U_{l,A}x)(\\lambda^{-1})",
            "{\\lambda\\over l}\\sum_{r=1}^{l-1}f_x(r\\lambda/l)",
            "genuine\nincomplete-endpoint row",
            "=o(T_L)",
            "No theorem frozen in the repository proves (0.17)",
        ):
            self.assertIn(token, self.text)

    def test_rh_boundary_is_not_overclaimed(self) -> None:
        for token in (
            "No frozen theorem gives it a\nsubpolynomial growing-`lambda` bound",
            "does not by itself close\n(0.17)",
            "equivalent to RH",
            "packet gate (0.17)\nitself is not shown to be RH-equivalent",
            "No reverse implication from (0.17) to (4.5) is\nasserted",
            "large-sieve or source-coupled oscillatory proof",
        ):
            self.assertIn(token, self.text)

    def test_infinite_tail_boundary_is_elementary(self) -> None:
        for token in (
            "\\Lambda(n)\\leq\\log n",
            "|D(B)|\\leq\\psi_C(B)+\\lfloor B\\rfloor",
            "\\leq B\\log B+B",
            "O_(lambda,E)(log(B)/B) to 0",
            "No prime-number theorem is used",
        ):
            self.assertIn(token, self.text)
        boundary_paragraph = self.text[
            self.text.index("For the infinite tail"):
            self.text.index("To display why a pointwise PNT insertion")
        ]
        self.assertNotIn("ordinary PNT", boundary_paragraph)
        self.assertNotIn("D(B)=o(B)", boundary_paragraph)

    def test_no_forbidden_fixed_product_representative(self) -> None:
        lower = self.text.lower()
        self.assertIn("no product `mln`", lower)
        self.assertIn("no product `mln`, outer mask", lower)
        self.assertNotIn("regroup by `mln`", lower)
        self.assertIn("project state remains\n`p0_invalidated`", lower)

    def test_display_math_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is not installed")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 25)
        body = "\n".join(f"\\[{display}\\]" for display in displays)
        source = "\n".join(
            (
                r"\documentclass{article}",
                r"\usepackage{amsmath,amssymb}",
                r"\begin{document}",
                body,
                r"\end{document}",
            )
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(source, encoding="utf-8")
            completed = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                check=False,
            )
        self.assertEqual(completed.returncode, 0, completed.stdout[-4000:])


if __name__ == "__main__":
    unittest.main()
