#!/usr/bin/env python3
"""Regressions for the curved/hard Euler-resolvent alias completion."""

from __future__ import annotations

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
    / "GROWING_TRANSITION_EULER_RESOLVENT_CURVED_HARD_ALIAS_COMPLETION_THEOREM.md"
)
NOTE_HASH = "429488fd14d246a6bcbe0495e4a6290569535536e118ff05ac9ad581845ac0dd"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_ODD_LAPLACE_EULER_RESOLVENT_MIXED_EDGE_ALIAS_REDUCTION_THEOREM.md":
        "289cc268263df97c0b778dc81cc982023a2793675dcb10c1b225ef42e965a467",
    "tests/test_growing_transition_odd_laplace_euler_resolvent_mixed_edge_alias_reduction_theorem.py":
        "395f53fcd03dc26b8951cd8b1b208b811ae1479c90ad4b15d841c825bad93f05",
    "notes/GROWING_TRANSITION_ONE_SIDED_ODD_LAPLACE_ROW_AND_FORWARD_ALIAS_THEOREM.md":
        "0edbe7253f6164399d468517bc9cbb9c8d9317250ac7dcc526eca9a8e15e7d3b",
    "tests/test_growing_transition_one_sided_odd_laplace_row_and_forward_alias_theorem.py":
        "97215866f7cf3a6969a7ec92d81e722a6e376034e95d58ff1e759b3780fcc79f",
    "notes/GROWING_TRANSITION_CURVED_TWO_ENDPOINT_FIO_SHELL_THEOREM.md":
        "ddb1769d6e6f2b3214cb8191d631a161a1312f18c5bfbba4ca2ad11bb9f93341",
    "tests/test_growing_transition_curved_two_endpoint_fio_shell_theorem.py":
        "8d6bf688ffc938691789a558900ac95467a6631203f5fd262a5f4356431422cb",
    "notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md":
        "7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564",
    "tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py":
        "caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c",
    "notes/GROWING_TRANSITION_POLYLOG_BASE_CONTINUOUS_PRIME_SHELL_COROLLARY.md":
        "326d4d19a4c7bf93e920f2af1438fb0aba7dc797091bf0957abf9149bca018e1",
    "tests/test_growing_transition_polylog_base_continuous_prime_shell_corollary.py":
        "de07ecbac9c7404edc2508b54d3aa25a15f2d8f102b86199119af65ef9e6a2a7",
    "notes/GROWING_TRANSITION_ODD_LAPLACE_MIDDLE_BAND_ALIAS_FRAME_OBSTRUCTION_THEOREM.md":
        "6863fd558c13b52255a5bca67c2bb91aae4cd75b82180835a37e178546f70956",
    "tests/test_growing_transition_odd_laplace_middle_band_alias_frame_obstruction_theorem.py":
        "7c0c1a4abaa5768291ca6e7bfc9ca01915e6e8f78ada3f4071ac490a83c59a5a",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "tests/test_growing_transition_sampling.py":
        "ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def right_resolvent(x_value: mp.mpf, z_value: int) -> mp.mpf:
    partial = mp.fsum(
        mp.mpf(index) ** (-z_value)
        for index in range(1, int(mp.floor(x_value)) + 1)
    )
    return (
        x_value**z_value * (mp.zeta(z_value) - partial)
        - x_value / (z_value - 1)
    )


def reduced_resolvent(x_value: mp.mpf, z_value: int) -> mp.mpf:
    return right_resolvent(x_value, z_value) / x_value


def exterior_annulus(x_value: mp.mpf, a_value: mp.mpf, z_value: int) -> mp.mpf:
    lower = max(2, int(mp.ceil(x_value)))
    upper = int(mp.floor(a_value * x_value))
    if upper < lower:
        return mp.mpf("0")
    return x_value ** (z_value - 1) * mp.fsum(
        mp.mpf(index) ** (-z_value)
        for index in range(lower, upper + 1)
    )


class EulerResolventCurvedHardAliasCompletionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_exact_annular_euler_identity_away_from_endpoint_atoms(self) -> None:
        mp.mp.dps = 70
        a_value = mp.mpf(25) / 4
        for z_value in (3, 5, 9):
            for x_value in map(mp.mpf, ("1.13", "1.71", "2.31", "4.07")):
                direct = exterior_annulus(x_value, a_value, z_value)
                euler = (
                    (1 - a_value ** (1 - z_value)) / (z_value - 1)
                    + reduced_resolvent(x_value, z_value)
                    - a_value ** (1 - z_value)
                    * reduced_resolvent(a_value * x_value, z_value)
                )
                self.assertLess(abs(direct - euler), mp.mpf("1e-65"))

    def test_reduced_resolvent_is_monotone_between_exact_jumps(self) -> None:
        mp.mp.dps = 60
        for z_value in (3, 7, 19):
            for interval in (1, 2, 5, 13):
                left = mp.mpf(interval) + mp.mpf("0.17")
                middle = mp.mpf(interval) + mp.mpf("0.51")
                right = mp.mpf(interval) + mp.mpf("0.89")
                values = [reduced_resolvent(x, z_value) for x in (left, middle, right)]
                self.assertLess(values[0], values[1])
                self.assertLess(values[1], values[2])

                n_value = mp.mpf(interval + 1)
                left_limit = reduced_resolvent(n_value - mp.mpf("1e-20"), z_value)
                right_value = reduced_resolvent(n_value, z_value)
                self.assertLess(
                    abs((right_value - left_limit) + 1 / n_value),
                    mp.mpf("2e-18"),
                )

    def test_bernoulli_resolvent_has_the_uniform_pointwise_bound(self) -> None:
        mp.mp.dps = 50
        for z_value in (3, 5, 17, 41):
            for numerator in range(10, 151, 7):
                x_value = mp.mpf(numerator) / 10
                self.assertLessEqual(abs(right_resolvent(x_value, z_value)), 1)
                self.assertLessEqual(
                    abs(reduced_resolvent(x_value, z_value)), 1 / x_value
                )

    def test_weighted_jump_majorants_have_the_claimed_scales(self) -> None:
        for a_value in (100.25, 400.25, 1600.25):
            c_value = 2 * math.pi * a_value
            ordinary = math.fsum(
                1
                / (
                    math.sqrt(c_value)
                    * n_value
                    * math.sqrt(n_value * n_value - 1)
                )
                for n_value in range(2, 20000)
            )
            self.assertLess(ordinary * math.sqrt(c_value), 1)

            hard = math.fsum(
                (
                    math.sqrt(a_value)
                    / (
                        math.sqrt(2 * math.pi)
                        * math.sqrt(n_value * n_value - a_value * a_value)
                    )
                    / n_value
                )
                for n_value in range(math.ceil(a_value), math.ceil(40 * a_value))
            )
            # The omitted tail is O(A^(1/2)/N), so this finite check has
            # the same A^(-1/2) scale as the complete series.
            self.assertLess(hard * math.sqrt(a_value), 3)

    def test_scaled_hard_atoms_are_exactly_retained(self) -> None:
        mp.mp.dps = 60
        a_value = mp.mpf(25) / 4
        for z_value in (3, 5):
            for n_value in (7, 11, 23):
                epsilon = mp.mpf("1e-20")
                left = a_value ** (1 - z_value) * reduced_resolvent(
                    mp.mpf(n_value) - epsilon, z_value
                )
                right = a_value ** (1 - z_value) * reduced_resolvent(
                    mp.mpf(n_value), z_value
                )
                expected = -a_value ** (1 - z_value) / n_value
                self.assertLess(abs((right - left) - expected), mp.mpf("2e-18"))

    def test_schwartz_lattice_model_has_the_invisible_bump_scale(self) -> None:
        for s_value in (0.0, 1.0, 3.0, 7.0):
            delta = math.exp(-s_value) / 2
            lattice = math.fsum(
                (1 + index * delta) ** (-4) for index in range(2, 200000)
            )
            self.assertLess(lattice, 2 * math.exp(s_value))

        for z_value in (3, 5, 11):
            laplace_bound = 1 / (z_value - 1)
            self.assertLessEqual(laplace_bound, 3 / (2 * z_value))

    def test_fixed_linear_and_polylog_conductor_ratios_decay(self) -> None:
        h_value = math.pi / 4
        a1_value = 0.04
        c_gap = 0.12
        epsilon = 0.05
        self.assertLess(
            h_value * c_gap + (5 * h_value + 1.5 * epsilon) * a1_value,
            1,
        )
        self.assertLess(h_value * a1_value, 0.2)

        previous_fixed_log = math.inf
        previous_poly_log = math.inf
        for ell in (100_000.0, 1_000_000.0, 10_000_000.0):
            fixed_log = (h_value * a1_value - 0.5) * ell
            beta_poly = math.log(ell) ** 4
            poly_log = h_value * beta_poly - ell / 2
            self.assertLess(fixed_log, previous_fixed_log)
            self.assertLess(poly_log, previous_poly_log)
            self.assertLess(fixed_log, 0)
            self.assertLess(poly_log, 0)
            previous_fixed_log = fixed_log
            previous_poly_log = poly_log

    def test_alias_algebra_and_explicit_local_constant_persistence(self) -> None:
        target_scale = 32.0
        local_constant = 0.37
        local = (-1.4 * local_constant * target_scale,
                 -local_constant * target_scale)
        alias_norm = 0.03 * local_constant * target_scale
        full_upper = tuple(value + alias_norm for value in local)
        self.assertLessEqual(
            max(full_upper), -0.5 * local_constant * target_scale
        )

        a_one, b_one = 2.0, -3.0
        a_plus, b_plus = 0.4, 0.7
        full = 2 * (a_one + a_plus) * (b_one + b_plus)
        local_cross = 2 * a_one * b_one
        aliases = (
            2 * a_one * b_plus
            + 2 * a_plus * b_one
            + 2 * a_plus * b_plus
        )
        self.assertAlmostEqual(full, local_cross + aliases)

    def test_required_formulas_and_jump_firewalls_are_present(self) -> None:
        for token in (
            "G_{A,z}(x)=x^{z-1}",
            "{1-A^{1-z}\\over z-1}",
            "r_z(X)=C_{n,z}X^{z-1}-{1\\over z-1}",
            "\\Delta R_z(n)=-1",
            "\\Delta r_z(n)=-{1\\over n}",
            "Stieltjes differential in (4.4) includes every atom",
            "A^{1/2-z}",
            "explicit hard-endpoint audit",
            "right-continuous Euler",
            "almost-everywhere identity",
            "ordered unweighted Poisson limit",
            "|\\widehat{\\mathcal A}^{H,+}_{z,{\\rm bump}}|",
            "\\|\\widehat R_{\\rm alias}^{I_L}\\|=o(T_L)",
            "\\preceq-{c'_m\\over2}T_LP_E",
        ):
            self.assertIn(token, self.text)

    def test_band_constant_local_scale_and_all_node_quantifiers_are_locked(self) -> None:
        for token in (
            "K_0>{8m\\over C}",
            "T_L={e^{hCL}\\over L^{2m}}",
            "c'_m>0",
            "\\mathcal G_L=\\{\\alpha_1,\\ldots,\\alpha_m",
            "\\sup_{\\gamma\\in\\mathcal G_L}",
            "\\widehat{\\boldsymbol{\\mathcal A}}^{1}_z",
            "\\widehat{\\boldsymbol{\\mathcal A}}^{+}_z",
            "\\widehat{\\boldsymbol{\\mathcal B}}^{1}_z",
            "\\widehat{\\boldsymbol{\\mathcal B}}^{+}_z",
            "both cross orientations and both same-cluster blocks",
            "high--high and low--low blocks",
            "No coordinate property of `P_E` is used",
            "before any\ncompression",
        ):
            self.assertIn(token, self.text)
        self.assertNotIn("\\tau_L", self.text)
        self.assertNotIn("o(tau_L)", self.text)

    def test_all_node_row_extensions_and_arbitrary_endpoint_are_explicit(self) -> None:
        for token in (
            "Fix an arbitrary `gamma in G_L`",
            "gamma<=gamma_max<=D*L",
            "w_{z,c}(U)",
            "positive and nonincreasing",
            "\\tag{5.4c}",
            "uniform in the\narbitrary endpoint `Y`",
            "both endpoint terms",
            "used only `1<=r<=A`",
            "\\widehat{\\mathcal A}^{1}_{z,\\gamma}",
            "\\widehat{\\mathcal B}^{1}_{z,\\gamma}",
            "\\widehat{\\mathcal B}^{+}_{z,\\gamma}",
            "\\tag{5.10a}",
            "\\tag{5.10b}",
            "every selected `gamma` is positive",
            "with no low-cluster hypothesis",
            "uniformly over\nboth clusters",
        ):
            self.assertIn(token, self.text)

    def test_fail_closed_boundary_is_explicit(self) -> None:
        for token in (
            "only the completed physical odd-Laplace middle band",
            "not control odd rows outside `I_L`",
            "pole or Archimedean completion",
            "ordered prime form",
            "complete central sign",
            "equation (5.2)",
            "determinant convergence",
            "RH",
            "P0_INVALIDATED",
            "makes no estimate uniform in a finite Fejer cutoff",
        ):
            self.assertIn(token, self.text)

    def test_displays_compile_as_tex(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.DOTALL)
        self.assertGreaterEqual(len(displays), 50)
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

    def test_display_balance_unique_tags_ascii_and_no_stale_hash(self) -> None:
        starts = re.findall(r"(?m)^\s*\\\[\s*$", self.text)
        ends = re.findall(r"(?m)^\s*\\\]\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in data))
        self.assertNotIn("TO_BE_FROZEN", self.text)
        self.assertNotIn(",qquad", self.text)
        self.assertNotIn("unambiguously. unambiguously.", self.text)


if __name__ == "__main__":
    unittest.main()
