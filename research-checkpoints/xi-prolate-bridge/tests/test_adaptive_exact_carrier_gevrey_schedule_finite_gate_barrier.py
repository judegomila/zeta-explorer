#!/usr/bin/env python3
"""Regressions for the adaptive exact-carrier schedule barrier."""

from __future__ import annotations

import ast
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
    / "ADAPTIVE_EXACT_CARRIER_GEVREY_SCHEDULE_FINITE_GATE_BARRIER.md"
)
NOTE_HASH = "ecfb29e9e95bb031b95abb27e2eac97c1f466b84a795335a4645d0a6c9cb668f"

FROZEN = {
    "notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md":
        "384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c",
    "tests/test_gevrey_prolate_remainder.py":
        "93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058",
    "notes/IDEAL_STOKES_ALTERNATING_CAUCHY_FILTER_REDUCTION.md":
        "fb68a7b26abdbc938536c88c9e9780314c0d8b4fc794f24d69a0d4cd8b5a30d2",
    "tests/test_ideal_stokes_alternating_cauchy_filter_reduction.py":
        "696b74f6743aa7fbd6d1d784381386efc9b588cbd3e9d5eecbe57d822374d6b0",
    "notes/RH_CONDITIONAL_FIXED_ZERO_SELECTOR_CAPTURE_THEOREM.md":
        "07345bdb6278cd2914c7edaaa711351f4b8aa020038dca7a19b8c406e4a0f84c",
    "tests/test_rh_conditional_fixed_zero_selector_capture_theorem.py":
        "9de65e4fd61a71736c4df484a6b3f7ce0dd54a659b681baab0e6dd2bd0c36730",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def schedule_x(length: mp.mpf) -> mp.mpf:
    return mp.exp(length / 2) * length**3


def carrier_map(length: mp.mpf) -> mp.mpf:
    return 2 * mp.pi * (schedule_x(length) + 1) / length


def carrier_map_derivative(length: mp.mpf) -> mp.mpf:
    return 2 * mp.pi * (
        mp.exp(length / 2) * (length**2 / 2 + 2 * length)
        - 1 / length**2
    )


def solve_length(target: mp.mpf) -> mp.mpf:
    lower = mp.mpf(1)
    upper = mp.mpf(2)
    while carrier_map(upper) < target:
        upper *= 2
    for _ in range(800):
        middle = (lower + upper) / 2
        if carrier_map(middle) < target:
            lower = middle
        else:
            upper = middle
    return (lower + upper) / 2


def adaptive_schedule(
    target: mp.mpf,
) -> tuple[mp.mpf, int, mp.mpf, mp.mpf, mp.mpf]:
    continuous_length = solve_length(target)
    continuous_carrier = schedule_x(continuous_length) + 1
    carrier = int(mp.floor(continuous_carrier + mp.mpf("0.5")))
    epsilon = mp.mpf(carrier) - continuous_carrier
    length = 2 * mp.pi * carrier / target
    cutoff = carrier - 1
    return continuous_length, cutoff, length, epsilon, continuous_carrier


class AdaptiveExactCarrierGevreyScheduleFiniteGateBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 200
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

    def test_monotone_inverse_and_exact_rounding_formula(self) -> None:
        for length in (mp.mpf(1), mp.mpf(4), mp.mpf(20), mp.mpf(80)):
            self.assertGreater(carrier_map_derivative(length), 0)

        for target in (mp.mpf("1e6"), mp.mpf("1e12"), mp.mpf("1e30")):
            ell, cutoff, length, epsilon, _ = adaptive_schedule(target)
            carrier = cutoff + 1
            x_value = schedule_x(ell)
            a_value = 2 * mp.pi / target
            exact_error = mp.mpf(cutoff) - schedule_x(length)
            reconstructed = epsilon + x_value * (
                1
                - mp.exp(a_value * epsilon / 2)
                * (1 + a_value * epsilon / ell) ** 3
            )

            self.assertLessEqual(abs(epsilon), mp.mpf("0.5"))
            self.assertLess(
                abs(2 * mp.pi * carrier / length - target),
                target * mp.mpf("1e-90"),
            )
            self.assertLess(
                abs(exact_error - reconstructed),
                max(1, abs(exact_error)) * mp.mpf("1e-55"),
            )
            self.assertLessEqual(abs(length - ell), mp.pi / target)

    def test_schedule_error_expansion_and_explicit_bound(self) -> None:
        scaled_remainders = []
        for ell_seed in (mp.mpf(16), mp.mpf(28), mp.mpf(44)):
            target = carrier_map(ell_seed)
            ell, cutoff, length, epsilon, _ = adaptive_schedule(target)
            error = mp.mpf(cutoff) - schedule_x(length)
            leading = -(ell / 2 + 2) * epsilon
            scale = ell**2 / schedule_x(ell)
            scaled_remainders.append(abs(error - leading) / scale)
            self.assertLess(abs(error), length / 4 + 1 + mp.mpf("0.01"))

        self.assertTrue(all(value < 2 for value in scaled_remainders))

        ratios = []
        for target in (mp.mpf("1e10"), mp.mpf("1e20"), mp.mpf("1e40")):
            _, _, length, _, _ = adaptive_schedule(target)
            ratios.append(length / mp.log(target))
        self.assertTrue(
            all(right > left for left, right in zip(ratios, ratios[1:]))
        )
        self.assertLess(abs(ratios[-1] - 2), mp.mpf("0.4"))

    def test_constant_cutoff_micro_plateau(self) -> None:
        amplitude = mp.mpf(8)
        for ell_seed in (mp.mpf(20), mp.mpf(35), mp.mpf(55)):
            target = carrier_map(ell_seed)
            _, cutoff, length, _, _ = adaptive_schedule(target)
            anchor_error = mp.mpf(cutoff) - schedule_x(length)
            for u_value in (mp.mpf(0), amplitude / 3, amplitude):
                moving_length = length + u_value / target
                moving_edge = 2 * mp.pi * (cutoff + 1) / moving_length
                exact_drift = u_value / (length + u_value / target)
                moving_error = mp.mpf(cutoff) - schedule_x(moving_length)
                first_order_change = u_value * length / (4 * mp.pi)

                self.assertLess(
                    abs((target - moving_edge) - exact_drift),
                    mp.mpf("1e-80") * max(1, target),
                )
                self.assertLessEqual(target - moving_edge, amplitude / length)
                self.assertLess(
                    abs(moving_error - anchor_error + first_order_change),
                    3 * amplitude + 1,
                )
                plateau_bound = (
                    mp.mpf("0.25") + amplitude / (4 * mp.pi)
                ) * length + 3 * amplitude + 2
                self.assertLess(abs(moving_error), plateau_bound)

    def test_uniform_band_and_adjacent_cutoff_formulas(self) -> None:
        perturbation_bound = mp.mpf("0.4")
        for length in (mp.mpf(20), mp.mpf(40), mp.mpf(80)):
            x_value = schedule_x(length)
            main_edge = 2 * mp.pi * mp.exp(length / 2) * length**2
            for theta in (
                -perturbation_bound,
                mp.mpf(0),
                perturbation_bound,
            ):
                cutoff = int(mp.floor(x_value + theta * length + mp.mpf("0.5")))
                actual_theta = (mp.mpf(cutoff) - x_value) / length
                edge = 2 * mp.pi * (cutoff + 1) / length
                reconstructed = (
                    main_edge + 2 * mp.pi * actual_theta + 2 * mp.pi / length
                )
                self.assertLess(abs(edge - reconstructed), mp.mpf("1e-75"))
                self.assertLessEqual(
                    abs(edge - main_edge),
                    2 * mp.pi * (perturbation_bound + mp.mpf("1.5") / length),
                )
                self.assertLess(abs(mp.mpf(cutoff) / x_value - 1), mp.mpf("1e-3"))

                adjacent_edge = 2 * mp.pi * (cutoff + 2) / length
                self.assertLess(
                    abs(adjacent_edge - edge - 2 * mp.pi / length),
                    mp.mpf("1e-75"),
                )
                self.assertEqual(
                    (mp.mpf(cutoff + 1) - x_value)
                    - (mp.mpf(cutoff) - x_value),
                    1,
                )

    def test_nested_projection_is_analytic_not_finite_gate_stability(self) -> None:
        coefficients = [
            complex(math.cos(index), math.sin(2 * index)) / (index + 1) ** 2
            for index in range(30)
        ]
        tail_at_n = sum(abs(value) ** 2 for value in coefficients[8:])
        tail_at_next = sum(abs(value) ** 2 for value in coefficients[9:])
        head_at_n = sum(abs(value) ** 2 for value in coefficients[:8])
        head_at_next = sum(abs(value) ** 2 for value in coefficients[:9])
        self.assertLessEqual(tail_at_next, tail_at_n)
        self.assertGreaterEqual(head_at_next, head_at_n)

        # Positive nested parity blocks can reverse the parity of the ground.
        old_even_floor = 1.0
        old_odd_floor = 2.0
        new_even_floor = min(1.0, 0.75)
        new_odd_floor = min(2.0, 0.5)
        self.assertLess(old_even_floor, old_odd_floor)
        self.assertGreater(new_even_floor, new_odd_floor)
        self.assertGreater(min(new_even_floor, new_odd_floor), 0.0)

        # [[1,1/2],[1/2,1]] has ground (1,-1), killed by (1,1).
        boundary_pairing = 1.0 - 1.0
        ground_value = 1.0 - 0.5
        other_value = 1.0 + 0.5
        self.assertEqual(boundary_pairing, 0.0)
        self.assertGreater(ground_value, 0.0)
        self.assertLess(ground_value, other_value)

    def test_exact_matched_phase_and_microscopic_limit(self) -> None:
        x_value = mp.mpf("0.17")
        phase_values = []
        for target in (mp.mpf("1e16"), mp.mpf("1e40"), mp.mpf("1e100")):
            _, cutoff, length, _, _ = adaptive_schedule(target)
            carrier = cutoff + 1
            offset = 2 * mp.pi * x_value / mp.log(target)
            gamma = target - offset
            direct = mp.sin(gamma * length / 2) ** 2
            reduced = mp.sin(offset * length / 2) ** 2
            self.assertLess(abs(direct - reduced), mp.mpf("1e-50"))
            self.assertLess(
                abs(target * length / 2 - mp.pi * carrier),
                mp.mpf("1e-70") * target,
            )
            phase_values.append(reduced)

        limit = mp.sin(2 * mp.pi * x_value) ** 2
        self.assertLess(abs(phase_values[-1] - limit), mp.mpf("0.08"))
        self.assertGreater(limit, mp.mpf("0.1"))

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
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

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "unbound post-checkpoint-1.44 theorem/barrier note/test pair",
            "changes no standard eight file",
            "exact schedule-error formula",
            "fixed-constant `O(L)` schedule",
            "constant-`N` micro-plateau",
            "Uniform analytic-estimate audit",
            "proof-level generalization",
            "does not alter the literal hypotheses",
            "old common-window constant cannot be copied unchanged",
            "Adjacent-cutoff analytic stability",
            "Finite strict hypotheses are not inherited",
            "structural countermodels, not the actual Weil matrices",
            "cannot choose the favorable cutoff and silently carry",
            "does not turn the target `t` itself into a phase-good row",
            "No such synchronization theorem is proved here",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        lowered = normalized.lower()
        forbidden = (
            "the actual finite strict gate is proved",
            "adjacency preserves the strict shifted sign",
            "the actual endpoint-amplitude transfer is proved",
            "the hardy--cauchy gate is proved",
            "eta_n^pr=o(1) is proved",
            "the riemann hypothesis is proved",
            "actual arithmetic sign is negative",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
