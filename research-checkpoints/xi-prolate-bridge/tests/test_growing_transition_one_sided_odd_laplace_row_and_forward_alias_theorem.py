#!/usr/bin/env python3
"""Regressions for the one-sided odd-Laplace row/forward-alias theorem."""

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
    / "GROWING_TRANSITION_ONE_SIDED_ODD_LAPLACE_ROW_AND_FORWARD_ALIAS_THEOREM.md"
)
NOTE_HASH = "0edbe7253f6164399d468517bc9cbb9c8d9317250ac7dcc526eca9a8e15e7d3b"

DEPENDENCIES = {
    "notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md":
        "6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c",
    "tests/test_growing_transition_continuous_m11_unconditional_narrow_schedule.py":
        "626dc9f12cf7a4b58246e12f1b008d72bf9bb0e60713a0a10f6b5dda2e66eb34",
    "notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md":
        "7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564",
    "tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py":
        "caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c",
    "notes/TRANSITION_PROLATE_OUTER_THEOREM.md":
        "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    "tests/test_transition_prolate_outer.py":
        "bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "tests/test_growing_transition_sampling.py":
        "ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac",
    "notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md":
        "7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74",
    "tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py":
        "d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140",
}


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def flat_row(gamma: float, rho: float) -> float:
    return math.exp(-0.5 * gamma * math.atan(1.0 / rho)) / math.sqrt(
        1.0 + rho * rho
    )


class OneSidedOddLaplaceRowForwardAliasTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertEqual(digest(NOTE), NOTE_HASH)
        for relative, expected in DEPENDENCIES.items():
            self.assertEqual(digest(ROOT / relative), expected, relative)

    def test_narrow_schedule_has_both_required_margins(self) -> None:
        h_value = math.pi / 4.0
        samples = (
            (0.05, 0.20, 0.10),
            (0.02, 0.35, 0.08),
            (0.08, 0.08, 0.05),
        )
        for a_one, c_slope, epsilon in samples:
            lhs = h_value * c_slope + (
                5.0 * h_value + 1.5 * epsilon
            ) * a_one
            self.assertLess(lhs, 1.0)
            self.assertLess(h_value * (a_one + c_slope), 1.0)
            self.assertLess(h_value * a_one, 0.2)

    def test_exact_inward_coordinate_jacobian(self) -> None:
        mp.mp.dps = 50
        conductor = mp.mpf("200")
        length = mp.log(conductor / (2 * mp.pi))
        z_value = 7
        upper = conductor - 2 * mp.pi
        p = lambda u: mp.e ** (-mp.mpf("0.17") * u)
        direct = mp.quad(
            lambda s: p(conductor * (1 - mp.e ** (-s)))
            * mp.e ** (-z_value * s),
            [0, length],
        )
        changed = (1 / conductor) * mp.quad(
            lambda u: p(u)
            * (1 - u / conductor) ** (z_value - 1),
            [0, upper],
        )
        self.assertLess(abs(direct - changed), mp.mpf("1e-45"))

    def test_exact_outward_coordinate_jacobian(self) -> None:
        mp.mp.dps = 50
        conductor = mp.mpf("180")
        z_value = 9
        time_end = mp.mpf("2.3")
        q = lambda v: mp.e ** (-mp.mpf("0.23") * v)
        direct = mp.quad(
            lambda t: q(conductor * (mp.e**t - 1))
            * mp.e ** (-(z_value - 1) * t),
            [0, time_end],
        )
        changed = (1 / conductor) * mp.quad(
            lambda v: q(v) * (1 + v / conductor) ** (-z_value),
            [0, conductor * (mp.e**time_end - 1)],
        )
        self.assertLess(abs(direct - changed), mp.mpf("1e-45"))

    def test_kummer_envelopes_have_correct_actions(self) -> None:
        h_value = math.pi / 4.0
        for alpha, beta, rho in (
            (7.0, 2.0, 1e-3),
            (14.0, 5.0, 0.04),
            (3.0, 1.0, 0.8),
        ):
            self.assertLessEqual(flat_row(-alpha, rho), math.exp(h_value * alpha))
            self.assertLessEqual(flat_row(beta, rho), 1.0)

    def test_curved_weight_taylor_bounds(self) -> None:
        conductor = 1_000_000.0
        for z_value in (3, 101, 5000):
            for x_value in (0.2, 3.0, 40.0):
                inward = (1.0 - x_value / conductor) ** (z_value - 1)
                inward_flat = math.exp(-(z_value - 1) * x_value / conductor)
                outward = (1.0 + x_value / conductor) ** (-z_value)
                outward_flat = math.exp(-z_value * x_value / conductor)
                scale = z_value * x_value**2 / conductor**2
                self.assertLess(abs(inward - inward_flat), 2.0 * scale)
                self.assertLess(abs(outward - outward_flat), 2.0 * scale)

    def test_polynomial_split_error_ledger_decays(self) -> None:
        h_value = math.pi / 4.0
        a_one, c_slope = 0.05, 0.20
        k_loss, p_split = 2.0, 8.0
        ledgers = []
        for length in (200.0, 400.0, 800.0):
            alpha = (a_one + c_slope) * length
            log_tail = (k_loss - p_split / 2.0) * math.log(length)
            log_green_relative = (
                h_value * alpha
                - length
                + (k_loss + 1.5 * p_split) * math.log(length)
            )
            log_curvature_relative = (
                -length
                + (k_loss + 2.5 * p_split + 1.0) * math.log(length)
            )
            ledgers.append(max(log_tail, log_green_relative, log_curvature_relative))
        self.assertGreater(ledgers[0], ledgers[1])
        self.assertGreater(ledgers[1], ledgers[2])
        self.assertLess(ledgers[-1], -10.0)

    def test_hard_endpoint_power_is_retained(self) -> None:
        for lam in (2.5, 5.5, 20.5):
            conductor = 2.0 * math.pi * lam * lam
            upper = conductor - 2.0 * math.pi
            self.assertAlmostEqual(1.0 - upper / conductor, 1.0 / (lam * lam))
            for z_value in (3, 5, 11):
                self.assertAlmostEqual(
                    (1.0 - upper / conductor) ** (z_value - 1),
                    (lam * lam) ** (1 - z_value),
                )

    def test_modal_prefactors_match_radial_mass(self) -> None:
        lam = 50.5
        conductor = 2.0 * math.pi * lam * lam
        j_value = 7.3
        chi = 0.997
        z_endpoint = math.sqrt(
            math.pi * conductor / (2.0 * lam * j_value)
        ) / chi
        inward_direct = math.sqrt(lam) * (1 + chi) * z_endpoint / (
            2.0 * conductor
        )
        inward_formula = (1 + chi) / (2 * chi) * math.sqrt(
            math.pi / (2.0 * conductor * j_value)
        )
        outward_direct = math.sqrt(lam) * chi * z_endpoint / (
            2.0 * conductor
        )
        outward_formula = math.sqrt(
            math.pi / (8.0 * conductor * j_value)
        )
        self.assertAlmostEqual(inward_direct, inward_formula, places=14)
        self.assertAlmostEqual(outward_direct, outward_formula, places=14)

    def test_outer_alias_integral_has_exact_logarithmic_bound(self) -> None:
        mp.mp.dps = 50
        for conductor, z_value in ((100.0, 3), (10000.0, 17), (1e6, 101)):
            integral = mp.quad(
                lambda t: mp.e ** (-z_value * t)
                * (1 + mp.log(2 + conductor * mp.e ** (-t))),
                [0, mp.inf],
            )
            upper = (1 + mp.log(conductor + 2)) / z_value
            self.assertLessEqual(integral, upper)

    def test_odd_harmonic_sum_is_logarithmic_not_row_count(self) -> None:
        for cutoff in (1001, 10001, 100001):
            value = math.fsum(1.0 / z for z in range(3, cutoff + 1, 2))
            self.assertLess(value, 0.5 * math.log(cutoff) + 1.0)
            row_count = (cutoff - 1) // 2
            self.assertLess(value, math.sqrt(row_count))

    def test_forward_conductor_ratio_tends_to_zero(self) -> None:
        h_value = math.pi / 4.0
        a_one = 0.05
        poly_power = 12.0
        logs = [
            (h_value * a_one - 0.5) * length
            + poly_power * math.log(length)
            for length in (500.0, 1000.0, 2000.0)
        ]
        self.assertGreater(logs[0], logs[1])
        self.assertGreater(logs[1], logs[2])
        self.assertLess(logs[-1], -500.0)

    def test_schwartz_bump_alias_is_uniformly_summable(self) -> None:
        # exp(-x) is a convenient stronger-than-needed model envelope.
        for time in (0.0, 0.7, 2.0):
            numerical = math.fsum(
                math.exp(-ell * math.exp(time) / 2.0)
                for ell in range(2, 10000)
            )
            ratio = math.exp(-math.exp(time) / 2.0)
            exact = ratio**2 / (1.0 - ratio)
            self.assertAlmostEqual(numerical, exact, places=12)
            self.assertLess(numerical, 4.0 * math.exp(-time))

    def test_required_formulas_and_fail_closed_scope(self) -> None:
        for token in (
            "(1-U/c)^{z-1}",
            "(1+V/c)^{-z}",
            "W_{-\\alpha}\\!\\left({z-1\\over c}\\right)",
            "W_\\beta\\!\\left({z\\over c}\\right)",
            "A^{1-z}\\over\\sqrt c",
            "{14|z_\\beta|\\over\\pi\\sqrt\\lambda}",
            "c^{-1/2+hA_1+o(1)}",
            "B_L=(\\log L)^4",
            "b_*:=\\min_jb_j>0",
            "R_{\\rm raw}:=D_H^{-1}R_{\\rm phys}D_L^{-1}",
            "not promoted to arbitrary inverse powers of `L`",
            "ordered unweighted Poisson limit",
            "No estimate is asserted here for the reverse mixed block",
            "inward higher-Fourier bump tower",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, self.text)

    def test_displays_compile_as_tex(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.DOTALL)
        self.assertGreaterEqual(len(displays), 40)
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
                capture_output=True,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
