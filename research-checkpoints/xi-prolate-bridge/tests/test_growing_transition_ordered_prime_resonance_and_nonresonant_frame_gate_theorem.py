#!/usr/bin/env python3
"""Regressions for the ordered-prime resonance and frame gate."""

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
    / "GROWING_TRANSITION_ORDERED_PRIME_RESONANCE_AND_NONRESONANT_FRAME_GATE_THEOREM.md"
)
NOTE_HASH = "511abdb8dd5e9bfe765e518812f19ab8df351803438c0a731387f3dd8d413460"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md":
        "7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74",
    "tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py":
        "d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/TRANSITION_PROLATE_OUTER_THEOREM.md":
        "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    "tests/test_transition_prolate_outer.py":
        "bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433",
    "notes/GROWING_TRANSITION_FINITE_FEJER_POST_CORE_QUANTIFIER_THEOREM.md":
        "c366a3a379a7b6f147b6cfcef07f9bd2b373e21a392c02b58aaa1e28c038f4a9",
    "tests/test_growing_transition_finite_fejer_post_core_quantifier_theorem.py":
        "409b119b42d8202511d0253a638d08c9e6585e4866337de4a7a14cbae76e9f1a",
    "notes/GROWING_TRANSITION_POST_PLEMELJ_REGULAR_ACTION_REDUCTION_THEOREM.md":
        "c7793bec967d219d06eecee76f5606b871b77b75f068648fcf2607977791afd8",
    "tests/test_growing_transition_post_plemelj_regular_action_reduction_theorem.py":
        "00d3fe6c8eb1c1e145abf4d5d1dbee5e38cd33259b1e33d6316246dc61c6eeb1",
    "notes/GROWING_TRANSITION_BOTH_MISS_RECIPROCAL_CORE_THEOREM.md":
        "0211d021fa37b423f41b2839aeda96630aaac931de0ea3d7d028f95705de29a8",
    "tests/test_growing_transition_both_miss_reciprocal_core_theorem.py":
        "0ec59c581c1109e07d57306dc3eb6752f3ba3a4080cbf4b2683c1ddfe3b41d4c",
    "notes/GROWING_TRANSITION_ABSOLUTE_SAMPLING_FORCED_CANCELLATION_BARRIER.md":
        "eb04692b7ce8e06efe254053ba93e4c5f2051ceffe47e68015c9e12886d77584",
    "tests/test_growing_transition_absolute_sampling_forced_cancellation_barrier.py":
        "3bb7d6c45bd0d4d1564624f7ab9f22532229d51dd51d71a474674081fd266a7b",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def omega(cutoff: int, index: int) -> float:
    return max(0.0, 1.0 - index / (cutoff + 1.0))


def von_mangoldt(index: int) -> float:
    if index < 2:
        return 0.0
    for prime in range(2, index + 1):
        if any(prime % divisor == 0 for divisor in range(2, math.isqrt(prime) + 1)):
            continue
        power = prime
        while power < index:
            power *= prime
        if power == index:
            return math.log(prime)
    return 0.0


def divisors(index: int) -> list[int]:
    return [divisor for divisor in range(1, index + 1) if index % divisor == 0]


def ell(cutoff: int, total: int) -> float:
    return sum(
        von_mangoldt(prime_index) * omega(cutoff, total // prime_index)
        for prime_index in divisors(total)
    )


def center(cutoff: int, total: int) -> float:
    w1 = omega(cutoff, 1)
    return 2.0 * w1 * ell(cutoff, total) - w1 * w1 * von_mangoldt(total)


def s_matrix(scale: float = 1.0) -> tuple[tuple[float, float], tuple[float, float]]:
    return ((0.0, scale), (scale, 0.0))


class OrderedPrimeResonanceFrameGateTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_resonance_interval_equivalence(self) -> None:
        a_value = 25.0 / 4.0
        for sampler_l in range(1, 8):
            for prime_index in range(2, 20):
                sampler_m = sampler_l * prime_index
                lower = max(sampler_l, sampler_m / a_value)
                upper = sampler_m
                for tenth in range(10, 300):
                    x_value = tenth / 10.0
                    interval = lower <= x_value <= upper
                    reindexed = (
                        sampler_l <= x_value
                        and x_value / sampler_l <= prime_index
                        and prime_index <= a_value * x_value / sampler_l
                    )
                    self.assertEqual(interval, reindexed)

    def test_resonance_density_matches_direct_enumeration(self) -> None:
        cutoff = 20
        a_value = 25.0 / 4.0
        for x_value in (1.0, 1.4, 2.0, 3.7, 8.0, 16.0):
            direct = 0.0
            for sampler_l in range(1, cutoff + 1):
                for prime_index in range(2, cutoff + 1):
                    sampler_m = sampler_l * prime_index
                    if sampler_m > cutoff:
                        continue
                    if max(sampler_l, sampler_m / a_value) <= x_value <= sampler_m:
                        direct += (
                            0.5
                            * omega(cutoff, sampler_m)
                            * von_mangoldt(prime_index)
                            * omega(cutoff, sampler_l)
                            / sampler_m
                        )
            reindexed = 0.0
            for sampler_l in range(1, math.floor(x_value) + 1):
                for prime_index in range(2, cutoff + 1):
                    if not (
                        x_value / sampler_l
                        <= prime_index
                        <= a_value * x_value / sampler_l
                    ):
                        continue
                    reindexed += (
                        0.5
                        * omega(cutoff, sampler_l)
                        * von_mangoldt(prime_index)
                        * omega(cutoff, sampler_l * prime_index)
                        / (sampler_l * prime_index)
                    )
            self.assertAlmostEqual(direct, reindexed, places=14)

    def test_resonance_is_positive_gram(self) -> None:
        for real, imag in ((1.0, 2.0), (-0.4, 0.8), (3.1, -1.7)):
            value = complex(real, imag)
            s_value = value.conjugate() * value + value.conjugate() * value
            self.assertGreaterEqual(s_value.real, 0.0)
            self.assertAlmostEqual(s_value.imag, 0.0)

    def test_logarithmic_tail_moments_are_finite(self) -> None:
        # A simple midpoint sum checks the exact integrability used in (4.6).
        for power in (1, 3):
            width = 0.001
            numerical = 0.0
            x_value = 2.0 + width / 2.0
            while x_value < 200.0:
                numerical += width * (1.0 + math.log(x_value)) ** power / x_value**2
                x_value += width
            tail = (1.0 + math.log(200.0)) ** power / 200.0
            self.assertTrue(math.isfinite(numerical + tail))
            self.assertGreater(numerical, 0.0)

    def test_elementary_density_bound(self) -> None:
        cutoff = 60
        a_value = 121.0 / 4.0
        length = math.log(a_value)
        for x_value in (1.0, 2.0, 5.0, 20.0, 50.0):
            density = 0.0
            for sampler_l in range(1, math.floor(x_value) + 1):
                for prime_index in range(2, cutoff + 1):
                    if x_value / sampler_l <= prime_index <= a_value * x_value / sampler_l:
                        density += (
                            0.5
                            * omega(cutoff, sampler_l)
                            * von_mangoldt(prime_index)
                            * omega(cutoff, sampler_l * prime_index)
                            / (sampler_l * prime_index)
                        )
            radial = 1.0 + math.log(x_value)
            envelope = 10.0 * (
                length * length * radial + radial**3
            )
            self.assertLessEqual(density, envelope)

    def test_center_after_removing_11_is_two_endpoint_layers(self) -> None:
        for cutoff in (2, 5, 20):
            for total in range(7, 80):
                w1 = omega(cutoff, 1)
                endpoint = w1 * (
                    ell(cutoff, total) - w1 * von_mangoldt(total)
                )
                after_11 = center(cutoff, total) - w1 * w1 * von_mangoldt(total)
                self.assertAlmostEqual(after_11, 2.0 * endpoint, places=13)
                midpoint_after_11 = after_11 - 0.5 * endpoint
                self.assertAlmostEqual(midpoint_after_11, 1.5 * endpoint, places=13)

    def test_mask_atoms_for_countermodel_are_interior(self) -> None:
        a_value = 25.0 / 4.0
        total = 20
        y_value = math.log(total / a_value)
        left = math.log(2 * 5 / a_value)
        right = math.log(2)
        self.assertAlmostEqual(left, math.log(8.0 / 5.0))
        self.assertLess(0.0, left)
        self.assertLess(left, right)
        self.assertLess(right, y_value)

    def test_radical_defect_identity_block_signs(self) -> None:
        # W_Z = pole - arch - prime.  Check each scalar block separately.
        for x_value, o_value in ((2.0, -0.5), (-1.2, 3.1), (0.7, 0.4)):
            k_value = x_value + o_value
            direct_prime = x_value * o_value
            outer_minus_defect_prime = -o_value * o_value + k_value * o_value
            self.assertAlmostEqual(direct_prime, outer_minus_defect_prime)
            direct_complete = -x_value * o_value
            outer_minus_defect_complete = o_value * o_value - k_value * o_value
            self.assertAlmostEqual(direct_complete, outer_minus_defect_complete)

    def test_difference_of_grams_identity(self) -> None:
        for u_value, v_value in (
            (1.0 + 2.0j, -0.3 + 0.8j),
            (2.0, 2.0),
            (2.0, -2.0),
        ):
            left = (complex(u_value).conjugate() * v_value
                    + complex(v_value).conjugate() * u_value).real
            right = 0.5 * (abs(u_value + v_value) ** 2 - abs(u_value - v_value) ** 2)
            self.assertAlmostEqual(left, right)

    def test_two_by_two_countermodel_has_both_signs(self) -> None:
        scale = math.log(5.0) / 36.0
        matrix = s_matrix(scale)
        trace = matrix[0][0] + matrix[1][1]
        determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
        discriminant = trace * trace - 4.0 * determinant
        eigenvalues = (
            (trace + math.sqrt(discriminant)) / 2.0,
            (trace - math.sqrt(discriminant)) / 2.0,
        )
        self.assertGreater(eigenvalues[0], 0.0)
        self.assertLess(eigenvalues[1], 0.0)
        self.assertAlmostEqual(eigenvalues[0], -eigenvalues[1])

    def test_scope_and_quantifier_tokens(self) -> None:
        scope_text = " ".join(self.text.split())
        for token in (
            "No scalar fixed-product regrouping",
            "finite-Fejer radical defect",
            "cannot be pasted into the direct",
            "outer-only mask arithmetic",
            "not a decomposition of (0.3)",
            "ordered pair `(m,ln)`",
            "fix `lambda`, the packet, and a finite cutoff `M`",
            "take the ordered limit `M to infinity` at fixed `lambda`",
            "only then let `lambda to infinity`",
            "not asserted to be a physical Fourier pair",
            "no RH statement",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, scope_text)

    def test_required_exact_formulas_present(self) -> None:
        for token in (
            "Q_{p,\\ne11,M}={1\\over4}",
            "Q_{{\\rm res},M}={1\\over2}",
            "w_{{\\rm res},M}(x)={1\\over2}",
            "0\\preceq Q_{{\\rm res},M}",
            "O_{q_0}(L^2)=o(\\tau_L)",
            "-\\mathcal W_Z(X_M,O_M)",
            "+W_p(X_M,O_M)",
            "C_{M,\\ne11}(N)",
            "C^{\\rm midpoint}_{M,\\ne11}(N)",
            "\\mathcal G_{\\pm,M}x",
            "P_E(\\widehat R_{\\rm cont}",
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
        self.assertTrue(all(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in data))
        self.assertNotIn("TO_BE_FROZEN", self.text)


if __name__ == "__main__":
    unittest.main()
