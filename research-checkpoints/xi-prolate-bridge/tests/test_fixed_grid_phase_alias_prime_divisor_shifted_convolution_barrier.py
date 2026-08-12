#!/usr/bin/env python3
"""Regressions for the fixed-grid phase-alias convolution barrier."""

from __future__ import annotations

import ast
import cmath
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
    ROOT / "notes"
    / "FIXED_GRID_PHASE_ALIAS_PRIME_DIVISOR_SHIFTED_CONVOLUTION_BARRIER.md"
)
NOTE_HASH = "226a3fcc9e6703d42ae7fed78b2e0d9a368f42313653cb1d175b28a1db3a8b20"
FROZEN = {
    "notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md":
        "2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87",
    "tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py":
        "d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97",
    "notes/JOINT_HARDY_CAUCHY_PHASE_ENERGY_NONCONCENTRATION_BARRIER.md":
        "69b985d600f1a9cc5f3522ddaa6a4d4a242e9e3f9907a7deed0abe93e06039d7",
    "tests/test_joint_hardy_cauchy_phase_energy_nonconcentration_barrier.py":
        "5b38f27de63a5b972a2daec330cfeb895f66a2d7eb691ed6c8691c6e312c51ab",
    "notes/ADAPTIVE_EXACT_CARRIER_GEVREY_SCHEDULE_FINITE_GATE_BARRIER.md":
        "ecfb29e9e95bb031b95abb27e2eac97c1f466b84a795335a4645d0a6c9cb668f",
    "tests/test_adaptive_exact_carrier_gevrey_schedule_finite_gate_barrier.py":
        "e2ed609e22ec3f81c53c237f9dfd73d972cc0963ad74fd5943222110d192198d",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class FixedGridPhaseAliasPrimeDivisorShiftedConvolutionBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 6)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_phase_profile_has_exact_three_sidebands(self) -> None:
        mp.mp.dps = 40
        for raw_frequency in ("-1.37", "-0.31", "0.22", "0.89", "1.41"):
            frequency = mp.mpf(raw_frequency)
            direct = mp.quad(
                lambda y_value: (
                    mp.exp(-mp.pi * y_value**2)
                    * mp.sin(mp.pi * y_value) ** 2
                    * mp.exp(-2j * mp.pi * y_value * frequency)
                ),
                [-mp.inf, mp.inf],
            )
            vhat = lambda value: mp.exp(-mp.pi * value**2)
            sidebands = (
                mp.mpf("0.5") * vhat(frequency)
                - mp.mpf("0.25") * vhat(frequency - 1)
                - mp.mpf("0.25") * vhat(frequency + 1)
            )
            self.assertLess(abs(direct - sidebands), mp.mpf("1e-34"))

    def test_guinand_weil_admissibility_and_compact_target_boundary(
        self,
    ) -> None:
        normalized = " ".join(self.text.split())
        for phrase in (
            r"\varphi\in C_c^\infty((-\sigma,\sigma))",
            r"\operatorname{supp}\widehat\psi",
            r"\subset[-\sigma-1,\sigma+1]",
            "ordinary finite sum",
            "only `q<=exp((sigma+1)L)` can occur",
            "standard Guinand--Weil test",
            "this justifies the `q,m,n,t` interchanges below",
            "no raw infinite prime series is rearranged",
            "not the compact-window numerator `h*mathcal R_J^ph`",
            "conditional approximation problem",
            "not an exact `PW1` theorem",
            "No exact passage to the compact physical `PW1` profile is claimed",
        ):
            self.assertIn(phrase, normalized)
        self.assertNotIn(
            "a smoothed or symmetrically truncated interpretation",
            normalized,
        )
        self.assertNotIn(
            "unscaled `PW1` numerator in the frozen adjacent-cutoff note is exactly",
            normalized,
        )

        sigma = 0.37
        supports = (
            (-sigma, sigma),
            (1 - sigma, 1 + sigma),
            (-1 - sigma, -1 + sigma),
        )
        self.assertEqual(
            (min(left for left, _ in supports),
             max(right for _, right in supports)),
            (-1 - sigma, 1 + sigma),
        )
        length = 9.2
        self.assertTrue(math.isfinite(math.exp((sigma + 1) * length)))

    def test_poisson_translation_sign_and_normalization(self) -> None:
        spacing = 0.71
        length = 2 * math.pi / spacing
        theta = 0.23
        lhs = spacing * sum(
            math.exp(-(index * spacing + theta) ** 2)
            for index in range(-30, 31)
        )
        rhs = sum(
            cmath.exp(1j * index * length * theta)
            * math.sqrt(math.pi)
            * math.exp(-(index * length) ** 2 / 4)
            for index in range(-10, 11)
        )
        self.assertAlmostEqual(lhs, rhs.real, places=13)
        self.assertAlmostEqual(rhs.imag, 0.0, places=13)
        self.assertAlmostEqual(spacing / (2 * math.pi), 1 / length)

    def test_k_zero_and_first_alias_frequency_map(self) -> None:
        length = 3.7
        ell = 1.19
        frequencies = {
            index: (ell + index * length, index * length - ell)
            for index in (0, 1, -1)
        }
        self.assertEqual(frequencies[0], (ell, -ell))
        self.assertEqual(frequencies[1], (ell + length, length - ell))
        self.assertEqual(frequencies[-1], (ell - length, -length - ell))
        normalized = " ".join(self.text.split())
        self.assertIn("Poisson sign", normalized)
        self.assertIn("h/(2*pi)", normalized)
        self.assertIn("`ell_q-L` and `L-ell_q`", normalized)

    def test_resonant_pair_has_positive_prefactor_but_no_sign(self) -> None:
        spacing = 0.43
        ell_minus_length = 0.37
        vhat = math.exp(-math.pi * (ell_minus_length / 5.1) ** 2)
        transform = -2.3 + 0.8j
        two_terms = spacing / (8 * math.pi) * (
            vhat * transform + vhat * transform.conjugate()
        )
        real_form = spacing / (4 * math.pi) * (
            vhat * transform.real
        )
        self.assertAlmostEqual(two_terms.real, real_form)
        self.assertAlmostEqual(two_terms.imag, 0.0)
        self.assertLess(real_form, 0.0)
        self.assertGreater(spacing / (4 * math.pi), 0.0)

    def test_four_afe_channels_are_exact_log_identities(self) -> None:
        q_value = 37.0
        m_value = 11.0
        n_value = 7.0
        conductor = math.exp(4.2)
        omega = math.log(q_value / conductor)
        self.assertAlmostEqual(
            omega + math.log(m_value / n_value),
            math.log(q_value * m_value / (conductor * n_value)),
        )
        self.assertAlmostEqual(
            omega - math.log(m_value / n_value),
            math.log(q_value * n_value / (conductor * m_value)),
        )
        self.assertAlmostEqual(
            omega + math.log(m_value * n_value),
            math.log(q_value * m_value * n_value / conductor),
        )
        self.assertAlmostEqual(
            omega - math.log(m_value * n_value),
            math.log(q_value / (conductor * m_value * n_value)),
        )
        for channel in (
            r"\mathcal W^{++}",
            r"\mathcal W^{--}",
            r"\mathcal W^{+-}",
            r"\mathcal W^{-+}",
        ):
            self.assertIn(channel, self.text)

    def test_locked_and_critical_prime_interval_scales(self) -> None:
        for length in (40.0, 80.0, 160.0):
            root_q = math.exp(length / 2)
            q_value = root_q**2
            locked_height = 2 * math.pi * root_q * length**2
            locked_width = q_value / locked_height
            self.assertTrue(math.isclose(
                locked_width,
                root_q / (2 * math.pi * length**2),
                rel_tol=2e-15,
            ))
            weighted_main = locked_width / root_q
            rh_weighted_error = math.log(q_value) ** 2
            self.assertTrue(math.isclose(
                rh_weighted_error / weighted_main,
                2 * math.pi * length**4,
                rel_tol=2e-15,
            ))

            d_value = 0.25
            critical_height = 2 * math.pi * d_value * q_value
            critical_width = q_value / critical_height
            self.assertAlmostEqual(
                critical_width, 1 / (2 * math.pi * d_value)
            )
            self.assertGreater(
                rh_weighted_error,
                critical_width / root_q,
            )

    def test_translation_average_and_relative_phase_distinction(self) -> None:
        mp.mp.dps = 35
        spacing = mp.mpf("0.83")
        length = 2 * mp.pi / spacing

        def hardy(value: mp.mpf) -> mp.mpf:
            return mp.exp(-value**2)

        def profile(value: mp.mpf) -> mp.mpf:
            return 1 + mp.mpf("0.2") * mp.cos(value)

        def lattice(theta: mp.mpf, with_profile: bool) -> mp.mpf:
            return spacing * sum(
                hardy(index * spacing + theta)
                * (
                    profile(index * spacing + theta)
                    if with_profile else 1
                )
                for index in range(-25, 26)
            )

        averaged = mp.quad(
            lambda theta: lattice(theta, True),
            [0, spacing],
        ) / spacing
        continuous = mp.quad(
            lambda value: hardy(value) * profile(value),
            [-mp.inf, mp.inf],
        )
        self.assertLess(abs(averaged - continuous), mp.mpf("1e-28"))

        theta = mp.mpf("0.21")
        gamma = mp.mpf("4.17")
        index = 9
        t_value = index * spacing + theta
        relative = mp.sin(mp.pi * (t_value - gamma) / spacing) ** 2
        translated = mp.sin((gamma - theta) * length / 2) ** 2
        physical = mp.sin(gamma * length / 2) ** 2
        self.assertLess(abs(relative - translated), mp.mpf("1e-30"))
        self.assertGreater(abs(relative - physical), mp.mpf("1e-3"))

    def test_constant_cutoff_plateau_scans_one_cell(self) -> None:
        mp.mp.dps = 50
        length = mp.mpf(60)
        cutoff = 10**9
        height = 2 * mp.pi * (cutoff + 1) / length
        for u_value in (mp.mpf(0), mp.mpf("0.7"), mp.pi, 2 * mp.pi):
            moved_length = length + u_value / height
            moved_edge = 2 * mp.pi * (cutoff + 1) / moved_length
            exact_shift = -u_value / (length + u_value / height)
            self.assertLess(
                abs(moved_edge - height - exact_shift), mp.mpf("1e-40")
            )
            self.assertLess(
                abs(
                    mp.exp(moved_length / 2) / mp.exp(length / 2)
                    - mp.exp(u_value / (2 * height))
                ),
                mp.mpf("1e-45"),
            )
            for offset in (-120, -1, 0, 73, 120):
                old = 2 * mp.pi * (cutoff + 1 + offset) / length
                moved = 2 * mp.pi * (
                    cutoff + 1 + offset
                ) / moved_length
                defect = (moved - old) - (moved_edge - height)
                expected = (
                    -u_value / (length + u_value / height)
                    * offset / (cutoff + 1)
                )
                self.assertLess(abs(defect - expected), mp.mpf("1e-40"))
        final_shift = -2 * mp.pi / (
            length + 2 * mp.pi / height
        )
        self.assertLessEqual(
            abs(final_shift + 2 * mp.pi / length),
            4 * mp.pi**2 / (height * length**2),
        )

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "note.tex"
            source.write_text(document, encoding="ascii")
            result = subprocess.run(
                [
                    compiler,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    source.name,
                ],
                cwd=temporary,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_static_hygiene_and_fail_closed_scope(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(
                all(line == line.rstrip(b" ") for line in raw.splitlines())
            )
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
        normalized = " ".join(self.text.split())
        for phrase in (
            "unbound post-checkpoint-1.44 theorem/barrier note/test pair",
            "changes no standard eight file",
            "prime-power/divisor shifted-convolution theorem",
            "both same-branch terms",
            "both approximate-functional-equation cross terms",
            "RH does not guarantee a prime or prime power",
            "method barrier, not an impossibility theorem",
            "continuous statistic is only `mathcal C_0`",
            "Fourier-compact analytic auxiliary class",
            "prime-power sum is an ordinary finite sum",
            "compact physical profile",
            "conditional approximation theorem",
            "phase-translated profile",
            "`mathcal D_h(theta)=0 => mathcal Q_h(theta)=0`",
            "not a local `O(1)` plateau theorem",
            "finite-gate synchronization",
            "P0_INVALIDATED",
        ):
            self.assertIn(phrase, normalized)
        lowered = normalized.lower()
        for phrase in (
            "pw1 is proved",
            "rh proves the shifted convolution",
            "bettin--fazzari computes the first aliases",
            "gonek computes the fixed progression",
            "the translated grid is the fixed physical phase",
            "the finite strict gates are synchronized",
            "the riemann hypothesis is proved",
        ):
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
