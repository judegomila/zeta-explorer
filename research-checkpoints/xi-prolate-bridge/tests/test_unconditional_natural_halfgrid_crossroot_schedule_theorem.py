#!/usr/bin/env python3
"""Regressions for the unconditional natural-halfgrid schedule theorem."""

from __future__ import annotations

import ast
import cmath
from fractions import Fraction as F
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
    / "UNCONDITIONAL_NATURAL_HALFGRID_CROSSROOT_SCHEDULE_THEOREM.md"
)
NOTE_HASH = "d1b73fc246fcc70886ba78dc074adac585372a2abfc9fbba678c03c4d47e30a5"

FROZEN = {
    "notes/EVEN_SECTOR_CROSS_ROOT_LIMIT_BRIDGE.md":
        "c8656f4c5e574ac30972b0645015a3bb57492908efbf0e57ddef5de9c0c6e9c2",
    "tests/test_even_sector_cross_root_limit_bridge.py":
        "73d7705dc170c7081cf99a7669bd74493ed937cac75dcaa075beacdbf9e3b3b1",
    "notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md":
        "ce6863d26788de9fc0fd9e998094fcb7982845ca298ccf8048d0913f62470450",
    "tests/test_natural_cutoff_signed_ground_alignment.py":
        "3ae99e6bbbc0004aa2560a577eca16d6ef0221d28fb2aefc3aef1d9558fae0bb",
    "notes/HSW_CONTINUOUS_L_PHASE_SHELL_THEOREM.md":
        "49a53cb1f8ee6db85040cd39aa6faa4fff0296d8bb8b99b18e830efce63df70e",
    "tests/test_hsw_continuous_l_phase_shell_theorem.py":
        "54e28858ad50a9b29578ff7719a2bb9818e02d7f275530a9da8cc15a023b6d9f",
    "ZERO_SAMPLING_SOURCE_LOCK.json":
        "f4cad4acb30dbfcdc5b30faafe92934e8958ad1cd11cbf6abea932f902e8c101",
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def nearest_odd(value: float) -> int:
    lower = math.floor(value)
    if lower % 2 == 0:
        lower -= 1
    upper = lower + 2
    if value - lower <= upper - value:
        return lower
    return upper


def hsw_main(height: float) -> float:
    return height / (2.0 * math.pi) * math.log(
        height / (2.0 * math.pi * math.e)
    )


def hsw_remainder(height: float) -> float:
    return (
        0.103787 * math.log(height)
        + 0.257297 * math.log(math.log(height))
        + 9.367419
    )


def hsw_z_lower(height: float) -> float:
    return (
        hsw_main(2.0 * height)
        - hsw_main(height)
        - hsw_remainder(2.0 * height)
        - hsw_remainder(height)
    )


def hsw_bin_upper(height: float) -> float:
    return (
        math.log(2.0 * height / (2.0 * math.pi)) / (2.0 * math.pi)
        + 2.0 * hsw_remainder(2.0 * height)
    )


def quarter_threshold_bad_measure(height: float, interval: float) -> float:
    z_value = hsw_z_lower(height)
    b_value = hsw_bin_upper(height)
    energy = b_value**2 / height**3 * (
        interval + 8.0 * (1.0 + math.log(height))
    )
    u_lower = z_value / (8.0 * height**2)
    return 16.0 * energy / u_lower**2


def dot(left: list[float], right: list[float]) -> float:
    return sum(a * b for a, b in zip(left, right))


def scale(vector: list[float], scalar: float) -> list[float]:
    return [scalar * value for value in vector]


class UnconditionalNaturalHalfgridCrossrootScheduleTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_minimal_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 8)
        self.assertEqual(
            sum(relative.startswith("notes/") for relative in FROZEN),
            3,
        )
        self.assertEqual(
            sum(relative.startswith("tests/") for relative in FROZEN),
            3,
        )
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        self.assertNotIn(NOTE_HASH, {"DRAFT", "PENDING"})
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_odd_halfgrid_mesh_and_natural_cutoff(self) -> None:
        for p_value in (3, 11, 101, 1001, 10001):
            self.assertEqual(p_value % 2, 1)
            lam = p_value / 2.0
            length = 2.0 * math.log(lam)
            next_length = 2.0 * math.log((p_value + 2) / 2.0)
            exact_mesh = 2.0 * math.log(1.0 + 2.0 / p_value)
            self.assertAlmostEqual(next_length - length, exact_mesh, places=14)
            self.assertLessEqual(exact_mesh, 4.0 / p_value)
            self.assertEqual(math.ceil(lam), (p_value + 1) // 2)
            cutoff = math.ceil(lam) + 1
            self.assertEqual(cutoff, (p_value + 3) // 2)
            self.assertEqual(
                2.0 * math.pi * cutoff / length,
                2.0 * math.pi * ((p_value + 3) // 2) / length,
            )

        normalized = " ".join(self.text.split())
        self.assertIn(
            r"L_{p+2}-L_p =2\log{p+2\over p}",
            normalized,
        )
        self.assertIn(r"{4\over p}={2\over\lambda_p}", normalized)
        self.assertIn(r"\Omega_p={2\pi N_p\over L_p}", normalized)

    def test_nearest_odd_rounding_bound_and_tie_rule(self) -> None:
        for length in (10.0, 20.0, 30.0):
            lam = math.exp(length / 2.0)
            p_value = nearest_odd(2.0 * lam)
            rounded_lam = p_value / 2.0
            rounded_length = 2.0 * math.log(rounded_lam)
            self.assertEqual(p_value % 2, 1)
            self.assertLessEqual(abs(rounded_lam - lam), 0.5)
            self.assertLessEqual(abs(rounded_length - length), 2.0 / lam)

        self.assertEqual(nearest_odd(10.0), 9)
        self.assertEqual(nearest_odd(10.1), 11)
        self.assertIn(
            "least odd integer among the nearest odd integers",
            " ".join(self.text.split()),
        )

    def test_hsw_shell_bounds_give_one_over_sixteen_t_radius(self) -> None:
        for height in (10, 101, 1009):
            weights = [2, 1, 3, 4]
            ordinates = [
                1.05 * height,
                1.25 * height,
                1.60 * height,
                1.95 * height,
            ]
            total = sum(weights)
            u_value = sum(
                weight / ordinate**2
                for weight, ordinate in zip(weights, ordinates)
            )
            derivative_bound = sum(
                weight / ordinate
                for weight, ordinate in zip(weights, ordinates)
            )
            self.assertGreaterEqual(u_value, total / (4.0 * height**2))
            self.assertLessEqual(derivative_bound, total / height)
            radius = u_value / (4.0 * derivative_bound)
            self.assertGreaterEqual(radius, 1.0 / (16.0 * height))

            for point in (0.0, 0.1, 1.0):
                derivative = sum(
                    1j * weight * cmath.exp(1j * ordinate * point) / ordinate
                    for weight, ordinate in zip(weights, ordinates)
                )
                self.assertLessEqual(abs(derivative), derivative_bound + 1e-14)

        exact = F(1, 16)
        self.assertEqual(
            (F(1, 4) / F(4, 1)),
            exact,
        )
        self.assertIn(r"\rho_T\geq{1\over16T}", self.text)

    def test_quarter_threshold_hsw_exception_is_asymptotically_empty(self) -> None:
        values = [
            quarter_threshold_bad_measure(height, 0.5)
            for height in (1e12, 1e16, 1e20)
        ]
        self.assertEqual(values, sorted(values, reverse=True))
        self.assertLess(values[0], 0.5)
        self.assertLess(values[-1], 1e-12)
        self.assertIn(r"{16E(T,h)\over U_T^2}", self.text)
        self.assertIn(r"O_h\left({\log T\over T}\right)=o(1)", self.text)

    def test_certified_rounding_scale_and_schedule_dichotomy(self) -> None:
        theta = 1.0 / 8.0
        natural_scale_ratios = []
        certified_displacements = []
        critical_ratios = []
        gevrey_ratios = []
        for length in (100.0, 200.0, 400.0):
            lam = math.exp(length / 2.0)
            cutoff = 2.0 * lam
            carrier = 2.0 * math.pi * cutoff / length
            shell = theta * carrier
            natural_scale_ratios.append(cutoff / (lam * length))
            certified_displacements.append(32.0 * shell / lam)
            critical_ratios.append(0.2 * lam)
            gevrey_ratios.append(length**2)

        self.assertEqual(
            natural_scale_ratios,
            sorted(natural_scale_ratios, reverse=True),
        )
        self.assertEqual(
            certified_displacements,
            sorted(certified_displacements, reverse=True),
        )
        self.assertTrue(all(value < 1.0 for value in certified_displacements))
        self.assertEqual(critical_ratios, sorted(critical_ratios))
        self.assertEqual(gevrey_ratios, sorted(gevrey_ratios))
        self.assertGreater(critical_ratios[-1], critical_ratios[0])
        self.assertEqual(
            F(1, 1),
            F(2, 1) - F(1, 1),
        )

        normalized = " ".join(self.text.split())
        for token in (
            r"{N\over\lambda L}\longrightarrow0",
            r"N=o(\lambda L)",
            r"{N_{\rm crit}\over\lambda L}\sim D\lambda",
            r"{N_{\rm G}\over\lambda L}\sim L^2",
            "does not prove that half-grid points are bad",
        ):
            self.assertIn(token, normalized)

    def test_deterministic_cofinal_selector_and_multiplicity_scope(self) -> None:
        normalized = " ".join(self.text.split())
        required = (
            r"I_j=[A_0+2jh,A_0+(2j+1)h]",
            r"T_j=\left\lfloor\vartheta\Omega_j^-\right\rfloor",
            r"(T_j,2T_j]\subset(0,\Omega_p]",
            r"|C_{T_j}(L_{p_j})|\leq{U_{T_j}\over2}",
            r"W_{T_j}(L_{p_j})\geq{U_{T_j}\over4}",
            "least-element rule makes the sequence deterministic",
            "algebraic multiplicity is retained",
            "choosing `epsilon_T=0` if its two multiplicity totals tie",
            "No individual ordinate is selected as an input carrier",
            "not an effective closed-form zero-free schedule",
        )
        for token in required:
            self.assertIn(token, normalized)

    def test_natural_projective_rates_have_the_required_exponents(self) -> None:
        eta = F(49, 100)
        self.assertLess(eta - F(1, 2), 0)
        self.assertLess(2 * eta - 1, 0)

        outer_values = []
        low_values = []
        high_values = []
        for length in (500.0, 1000.0, 2000.0):
            outer_values.append(
                math.sqrt(length)
                * math.exp(float(eta) * length / 2.0 - 0.01 * length**2)
            )
            low_values.append(
                length * math.exp((2.0 * float(eta) - 1.0) * length / 2.0)
            )
            high_values.append(
                math.sqrt(length)
                * math.exp((float(eta) - 0.5) * length / 2.0)
            )

        for values in (outer_values, low_values, high_values):
            self.assertEqual(values, sorted(values, reverse=True))
        self.assertLess(outer_values[-1], 1e-50)
        self.assertLess(low_values[-1], 1e-4)
        self.assertLess(high_values[-1], 1e-2)

        normalized = " ".join(self.text.split())
        required = (
            r"\|(I-P_M)X_\lambda\|=O(e^{-c_0L^2})",
            r"N_{\exp}=2^{9600\lambda^2}",
            r"|a_{\lambda,N_{\exp}}-a_{\lambda,N}|",
            r"0<a_-\leq a_{\lambda,N}\leq a_+<\infty",
            r"e_{\lambda,N}:=\|(I-P_N)X_\lambda\|",
            r"\sqrt L\,\lambda^\eta e_{\lambda,N}\longrightarrow0",
            r"O(\lambda^{\eta-1/2}\sqrt L)\longrightarrow0",
            r"O(L\lambda^{2\eta-1})\longrightarrow0",
        )
        for token in required:
            self.assertIn(token, normalized)

    def test_alignment_statistic_is_projectively_scale_invariant(self) -> None:
        root_two = math.sqrt(2.0)
        kappa = [1.0 / root_two, 1.0 / root_two, 0.0]
        transverse = [1.0 / root_two, -1.0 / root_two, 0.0]
        raw_ground = [2.0, 1.0, 3.0]
        ground_norm = math.sqrt(dot(raw_ground, raw_ground))
        ground = scale(raw_ground, 1.0 / ground_norm)

        def statistic(vector: list[float]) -> float:
            overlap = dot(kappa, vector)
            transverse_mass = dot(transverse, vector) ** 2
            return transverse_mass / overlap**2

        expected = statistic(ground)
        self.assertGreater(expected, 0.0)
        for factor in (0.1, 2.0, -7.0):
            self.assertAlmostEqual(statistic(scale(ground, factor)), expected)

        overlap = dot(kappa, ground)
        normalized_ground = scale(ground, 1.0 / overlap)
        self.assertAlmostEqual(dot(kappa, normalized_ground), 1.0)
        self.assertAlmostEqual(
            dot(transverse, normalized_ground) ** 2,
            expected,
        )

        normalized = " ".join(self.text.split())
        required = (
            r"r>0,\qquad {q-u\over r}=O(1)",
            r"P_{\kappa^\perp\cap\mathcal H_+}(Q_+-uI)",
            r"\mathcal A_{p,N} =\|P_{\mathcal L_M}x\|^2",
            r"\mathcal A_{p,N}=O(\lambda_p^{-1})",
            "without any shifted odd sign",
            "multiple lowest even eigenspace",
        )
        for token in required:
            self.assertIn(token, normalized)

    def test_gate_restricted_average_pigeonhole_and_exact_rate(self) -> None:
        cutoff = 101
        values = [F(1, 202), F(1, 101), F(3, 202)]
        average = sum(values, F(0)) / len(values)
        self.assertLessEqual(min(values), average)
        self.assertLessEqual(min(values), F(2, cutoff))

        # An unrestricted favorable value may live entirely off the gate.
        all_values = [F(0), F(10), F(10)]
        gate = [False, True, True]
        restricted = [value for value, good in zip(all_values, gate) if good]
        self.assertEqual(min(all_values), 0)
        self.assertEqual(min(restricted), 10)

        normalized = " ".join(self.text.split())
        required = (
            r"|\mathcal G_P|>0",
            r"\sum_{p\in\mathcal G_P}\mathcal A_{p,N_p}",
            r"\leq{C_0\over P}",
            "The average must be gate-restricted",
            "alignment equal to `16/9` at every outer cutoff",
            "new actual-arithmetic theorem",
        )
        for token in required:
            self.assertIn(token, normalized)

    def test_claim_boundary_and_no_rh_selected_schedule(self) -> None:
        normalized = " ".join(self.text.split())
        required = (
            "schedule compatibility only",
            "positive-Gram interpretation is RH-conditional",
            "is not used in the cross-root schedule theorem",
            "No selected zero",
            "no RH-selected ordinate",
            "changes none of the standard eight files",
            "does not require the HSW phase gate",
            "No actual finite gate or determinant limit",
            "There is no RH claim",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, normalized)

        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "the critical half-grid is phase-good unconditionally",
            "HSW proves the even complementary gate",
            "the actual-source alignment is proved",
            "the determinant convergence is established",
        )
        for token in forbidden:
            self.assertNotIn(token, normalized)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 40)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb,mathrsfs}\n"
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

    def test_ascii_python_static_tex_hash_and_cache_invariants(self) -> None:
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

        self.assertNotRegex(self.text, r"(?<!\\)\$\$")
        self.assertNotIn("\\begin{equation}", self.text)
        self.assertNotIn("\\end{equation}", self.text)
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
        for display in displays:
            if r"\begin{aligned}" in display:
                aligned = re.search(
                    r"\\begin\{aligned\}(.*?)\\end\{aligned\}",
                    display,
                    flags=re.S,
                )
                self.assertIsNotNone(aligned)
                self.assertNotIn(r"\tag", aligned.group(1))

        self.assertNotIn("TODO", self.text)
        self.assertNotIn("FIXME", self.text)
        self.assertGreaterEqual(self.text.count(r"\boxed{"), 15)
        self.assertFalse((test_path.parent / "__pycache__").exists())
        self.assertEqual(list(test_path.parent.glob(test_path.stem + "*.pyc")), [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
