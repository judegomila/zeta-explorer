#!/usr/bin/env python3
"""Regressions for the odd-Laplace middle-band alias-frame obstruction."""

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
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_ODD_LAPLACE_MIDDLE_BAND_ALIAS_FRAME_OBSTRUCTION_THEOREM.md"
)
NOTE_HASH = "6863fd558c13b52255a5bca67c2bb91aae4cd75b82180835a37e178546f70956"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md":
        "1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d",
    "tests/test_growing_transition_edge_carleman_scattering_obstruction.py":
        "b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb",
    "notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md":
        "6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c",
    "tests/test_growing_transition_continuous_m11_unconditional_narrow_schedule.py":
        "626dc9f12cf7a4b58246e12f1b008d72bf9bb0e60713a0a10f6b5dda2e66eb34",
    "notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md":
        "7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564",
    "tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py":
        "caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c",
    "notes/GROWING_TRANSITION_ODD_LAPLACE_ZETA_HURWITZ_FEATURE_ANGLE_REDUCTION_THEOREM.md":
        "aaa5b189075b308f3d0ea0c0908ad36d4d871f4ce6626ff74ed9c730a09a0723",
    "tests/test_growing_transition_odd_laplace_zeta_hurwitz_feature_angle_reduction_theorem.py":
        "1bf0cec43d31d1d0f48899be0615faab108b99e86ef446894a8cdec807329a74",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def w_row(gamma: float, rho: float) -> float:
    return math.exp(-0.5 * gamma * math.atan(1.0 / rho)) / math.sqrt(
        1.0 + rho * rho
    )


def product_row(delta: float, rho: float) -> float:
    return math.exp(0.5 * delta * math.atan(1.0 / rho)) / (
        1.0 + rho * rho
    )


def normalized_product_row(delta: float, rho: float) -> float:
    return math.exp(
        0.5 * delta * (math.atan(1.0 / rho) - math.pi / 2.0)
    ) / (1.0 + rho * rho)


class OddLaplaceMiddleBandAliasFrameTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_kummer_product_is_exact(self) -> None:
        for alpha, beta, rho in (
            (8.0, 2.0, 0.03),
            (17.5, 6.25, 0.4),
            (3.0, 1.0, 2.5),
        ):
            self.assertAlmostEqual(
                w_row(-alpha, rho) * w_row(beta, rho),
                product_row(alpha - beta, rho),
                places=11,
            )

    def test_exact_cauchy_integral(self) -> None:
        mp.mp.dps = 50
        for delta in (mp.mpf("0.4"), mp.mpf("3.25"), mp.mpf("11.0")):
            integrand = lambda rho: mp.e ** (
                delta * mp.atan(1 / rho) / 2
            ) / (1 + rho * rho)
            numerical = mp.quad(integrand, [0, 1, mp.inf])
            exact = 2 * (mp.e ** (mp.pi * delta / 4) - 1) / delta
            self.assertLess(abs(numerical / exact - 1), mp.mpf("1e-42"))

    def test_odd_mesh_converges_monotonically_to_finite_band_integral(self) -> None:
        delta = 7.0
        left, right = 0.02, 0.3
        mp.mp.dps = 40
        exact = float(
            mp.quad(
                lambda rho: mp.e ** (delta * mp.atan(1 / rho) / 2)
                / (1 + rho * rho),
                [left, right],
            )
        )
        errors = []
        for c_value in (2000, 6000, 18000):
            first = max(1, math.ceil((c_value * left - 1) / 2))
            last = math.floor((c_value * right - 1) / 2)
            value = (2.0 / c_value) * math.fsum(
                product_row(delta, (2 * nu + 1) / c_value)
                for nu in range(first, last + 1)
            )
            errors.append(abs(value - exact))
        self.assertGreater(errors[0], errors[1])
        self.assertGreater(errors[1], errors[2])
        self.assertLess(errors[2], 2e-3)

    def test_middle_band_has_predicted_fixed_fraction(self) -> None:
        c_slope = 0.7
        a_value, b_value = 0.5, 4.0
        predictions = (
            2.0
            / c_slope
            * (
                math.exp(-c_slope * a_value / 2.0)
                - math.exp(-c_slope * b_value / 2.0)
            )
        )
        errors = []
        for length in (40.0, 80.0, 160.0):
            delta = c_slope * length + 0.3
            scaled = length * float(
                mp.quad(
                    lambda rho: normalized_product_row(delta, float(rho)),
                    [a_value / length, b_value / length],
                )
            )
            errors.append(abs(scaled - predictions))
        self.assertGreater(errors[0], errors[1])
        self.assertGreater(errors[1], errors[2])
        self.assertLess(errors[2], 0.03)

    def test_middle_band_odd_row_count(self) -> None:
        c_value = 1_000_003
        length = 73.0
        a_value, b_value = 0.4, 5.2
        first = math.ceil((c_value * a_value / length - 1) / 2)
        last = math.floor((c_value * b_value / length - 1) / 2)
        actual = max(0, last - first + 1)
        asymptotic = c_value * (b_value - a_value) / (2.0 * length)
        self.assertLess(abs(actual - asymptotic), 2.0)

    def test_single_z_one_row_is_below_every_logarithmic_scale(self) -> None:
        slope = 0.8
        ratios = []
        for length in (10.0, 20.0, 40.0):
            conductor = math.exp(length)
            delta = slope * length
            one = (2.0 / conductor) * product_row(delta, 1.0 / conductor)
            full = 2.0 * (math.exp(math.pi * delta / 4.0) - 1.0) / delta
            ratios.append(one / full)
            self.assertLess(one / full, 3.0 * length / conductor)
        self.assertGreater(ratios[0], ratios[1])
        self.assertGreater(ratios[1], ratios[2])

    def test_fixed_offsets_vary_only_at_inverse_length(self) -> None:
        base_slope = 0.35
        gap_slope = 0.9
        y_value = 2.0
        offset_left, offset_right = -1.25, 1.75
        errors = []
        variations = []
        for length in (40.0, 80.0, 160.0):
            conductor = math.exp(length)
            alpha = (base_slope + gap_slope) * length + 4.0
            ratio = w_row(-alpha, y_value / length) / w_row(
                -alpha, 1.0 / conductor
            )
            errors.append(
                abs(
                    ratio
                    - math.exp(
                        -(base_slope + gap_slope) * y_value / 2.0
                    )
                )
            )
            left = w_row(-(alpha + offset_left), y_value / length) / w_row(
                -(alpha + offset_left), 1.0 / conductor
            )
            right = w_row(-(alpha + offset_right), y_value / length) / w_row(
                -(alpha + offset_right), 1.0 / conductor
            )
            variations.append(abs(math.log(left / right)))
        self.assertGreater(errors[0], errors[1])
        self.assertGreater(errors[1], errors[2])
        self.assertAlmostEqual(
            variations[1] / variations[2], 2.0, delta=0.03
        )

    def test_common_cluster_slope_cancels_only_in_product(self) -> None:
        base_slope = 0.35
        gap_slope = 0.9
        y_value = 2.0
        product_errors = []
        inward_errors = []
        for length in (40.0, 80.0, 160.0):
            conductor = math.exp(length)
            alpha = (base_slope + gap_slope) * length + 1.2
            beta = base_slope * length - 0.4
            inward_ratio = w_row(-alpha, y_value / length) / w_row(
                -alpha, 1.0 / conductor
            )
            outward_ratio = w_row(beta, y_value / length) / w_row(
                beta, 1.0 / conductor
            )
            delta = alpha - beta
            product_ratio = product_row(
                delta, y_value / length
            ) / product_row(delta, 1.0 / conductor)
            self.assertAlmostEqual(
                inward_ratio * outward_ratio, product_ratio, places=12
            )
            product_errors.append(
                abs(product_ratio - math.exp(-gap_slope * y_value / 2.0))
            )
            inward_errors.append(
                abs(
                    inward_ratio
                    - math.exp(
                        -(base_slope + gap_slope) * y_value / 2.0
                    )
                )
            )
        self.assertGreater(product_errors[0], product_errors[1])
        self.assertGreater(product_errors[1], product_errors[2])
        self.assertGreater(inward_errors[0], inward_errors[1])
        self.assertGreater(inward_errors[1], inward_errors[2])
        self.assertGreater(
            abs(
                w_row(
                    -((base_slope + gap_slope) * 160.0 + 1.2),
                    y_value / 160.0,
                )
                / w_row(
                    -((base_slope + gap_slope) * 160.0 + 1.2),
                    1.0 / math.exp(160.0),
                )
                - math.exp(-gap_slope * y_value / 2.0)
            ),
            0.08,
        )

    def test_log_band_tail_exponent_beats_smallest_cauchy_power(self) -> None:
        mode_count = 4
        slope = 0.8
        k_value = 50.0
        self.assertGreater(k_value, 8.0 * mode_count / slope)
        tail_power = k_value * slope / 4.0 + 1.0
        smallest_cauchy_power = 2.0 * mode_count - 1.0
        self.assertGreater(tail_power, smallest_cauchy_power)

    def test_cauchy_smallest_singular_value_has_2m_minus_1_power(self) -> None:
        left_offsets = np.array([0.0, 1.4])
        right_offsets = np.array([0.3, 2.1])
        scaled = []
        for x_value in (80.0, 160.0, 320.0):
            matrix = 1.0 / (
                x_value
                + left_offsets[:, None]
                - right_offsets[None, :]
            )
            smallest = np.linalg.svd(matrix, compute_uv=False)[-1]
            scaled.append(smallest * x_value**3)
        self.assertLess(abs(scaled[1] / scaled[2] - 1.0), 0.04)
        self.assertGreater(scaled[2], 0.1)

    def test_fixed_row_dimension_reserve(self) -> None:
        rng = np.random.default_rng(20260811)
        ambient = 12
        negative_dimension = 7
        row_count = 4
        negative_basis, _ = np.linalg.qr(
            rng.normal(size=(ambient, negative_dimension))
        )
        rows = rng.normal(size=(row_count, ambient))
        restricted_rank = np.linalg.matrix_rank(rows @ negative_basis)
        intersection_dimension = negative_dimension - restricted_rank
        self.assertGreaterEqual(
            intersection_dimension, negative_dimension - row_count
        )
        self.assertEqual(intersection_dimension, 3)

    def test_fourier_first_harmonic_and_moment_derivatives(self) -> None:
        mp.mp.dps = 40
        lam = mp.mpf("2.5")

        def source(u: mp.mpf) -> mp.mpf:
            return (1 - (u / lam) ** 2) ** 3

        def transform(y: mp.mpf) -> mp.mpc:
            return mp.quad(
                lambda u: source(u) * mp.e ** (2j * mp.pi * u * y),
                [-lam, 0, lam],
            )

        for order in (0, 1, 2):
            moment = mp.quad(
                lambda u: u**order
                * source(u)
                * mp.e ** (-2j * mp.pi * lam * u),
                [-lam, 0, lam],
            )
            derivative = mp.diff(transform, -lam, order) / (2j * mp.pi) ** order
            self.assertLess(abs(moment - derivative), mp.mpf("1e-32"))

    def test_scope_and_fail_closed_tokens(self) -> None:
        for token in (
            "Theta(c/L)` odd rows",
            "K>8m/C",
            "smallest singular scale",
            "conductor-power gap",
            "coherent same-scale cancellation",
            "physical full-profile sign is **not** decided",
            "physical compact-prolate",
            "periodic Bernoulli",
            "first Fourier harmonics are physically resonant",
            "does not say that the completed full-profile band has the",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, self.text)

    def test_required_exact_formulas_present(self) -> None:
        for token in (
            "F_\\Delta(\\rho):=W_{-\\alpha}(\\rho)W_\\beta(\\rho)",
            "{2\\{e^{h\\Delta}-1\\}\\over\\Delta}",
            "e^{-Ca/2}-e^{-Cb/2}",
            "3\\leq z=2\\nu+1\\leq {cY_L\\over L}",
            "\\|R_{\\rm flat}-R_{\\rm mid}\\|",
            "s_{\\min}(R_{\\rm flat}^{HL})",
            "\\dim\\left(E_-\\cap\\bigcap_{j=1}^r\\ker\\ell_j\\right)",
            "S(X,z)={X^{1-z}\\over1-z}+\\zeta(z)-B_1(X)X^{-z}",
            "H_n(\\lambda)=\\chi_n h_n(\\lambda)",
            "\\mathsf S(t_z+p_z,\\zeta(z)m_z-t_z)",
        ):
            self.assertIn(token, self.text)

    def test_displays_compile_as_tex(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.DOTALL)
        self.assertGreaterEqual(len(displays), 34)
        source = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\usepackage{mathrsfs}\n"
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
        starts = re.findall(r"(?m)^\s*\\\[\s*$", self.text)
        ends = re.findall(r"(?m)^\s*\\\]\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(b in (9, 10, 13) or 32 <= b <= 126 for b in data))
        self.assertNotIn("TO_BE_FROZEN", self.text)


if __name__ == "__main__":
    unittest.main()
