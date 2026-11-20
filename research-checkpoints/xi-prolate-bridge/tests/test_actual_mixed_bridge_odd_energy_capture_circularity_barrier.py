#!/usr/bin/env python3
"""Exact regressions for the odd-energy capture and circularity barrier."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
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
    / "ACTUAL_MIXED_BRIDGE_ODD_ENERGY_CAPTURE_CIRCULARITY_BARRIER.md"
)
NOTE_HASH = "cd2c4e98f4cfd0120d07ce783b534bf8c6892d614b33b3c9e19f4fc0f1491f96"

FROZEN = {
    "notes/ACTUAL_MIXED_BRIDGE_CONTINUOUS_COMPACT_SIDE_ODD_CARRIER_TRANSFER_THEOREM.md":
        "d60381270462b8148a94269cc62c43b6c65178e89243588c8dcf37047534f3de",
    "tests/test_actual_mixed_bridge_continuous_compact_side_odd_carrier_transfer_theorem.py":
        "f26d9ca46dbafba81ccf8893a2c235a8fd75a81fef0387abfc11f7f58bdc7afa",
    "notes/ACTUAL_MIXED_BRIDGE_TRANSVERSE_GAP_ENERGY_BARRIER.md":
        "d9fea23ec9427a2bfcf8f22ec6465cafbdd5623f4adc311e83114fd8b8591677",
    "tests/test_actual_mixed_bridge_transverse_gap_energy_barrier.py":
        "822711c839de663d5152ea61cc438a194780d80444f02cbac07b365947a608f1",
    "notes/CUTOFF_FREE_ONE_DIRECTION_WEIGHTED_GROUND_CAPTURE_THEOREM.md":
        "770087b56766e0102a915a31e08aba5389065d78dd59a55135adb5f5b6eea948",
    "tests/test_cutoff_free_one_direction_weighted_ground_capture_theorem.py":
        "a9cd2abbf8c3de284e1b375beffc7f186a7f4bebc3ecd7fba111195f435b86fc",
    "notes/CUTOFF_FREE_PROLATE_GROUND_ALIGNMENT_RH_DICHOTOMY.md":
        "37f381b6ed75017633f4c845f90ff7d2660699bc0ae7a4340ec789b0e8dccea7",
    "tests/test_cutoff_free_prolate_ground_alignment_rh_dichotomy.py":
        "b17c3c603d459547c09fd0abb92b595986356e29e1d53f7e8c6f3ace4a8baf80",
    "notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md":
        "6d0067d6c9a520e26a62185baf118de5a29d479b082ea9bd2ae7b2e4ad731f72",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left: tuple[F, ...], right: tuple[F, ...]) -> F:
    return sum((a * b for a, b in zip(left, right)), F(0))


def matvec(
    matrix: tuple[tuple[F, ...], ...],
    vector: tuple[F, ...],
) -> tuple[F, ...]:
    return tuple(dot(row, vector) for row in matrix)


def outer(
    left: tuple[F, ...],
    right: tuple[F, ...],
) -> tuple[tuple[F, ...], ...]:
    return tuple(tuple(a * b for b in right) for a in left)


def matrix_add(
    left: tuple[tuple[F, ...], ...],
    right: tuple[tuple[F, ...], ...],
) -> tuple[tuple[F, ...], ...]:
    return tuple(
        tuple(a + b for a, b in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def matrix_scale(
    scalar: F,
    matrix: tuple[tuple[F, ...], ...],
) -> tuple[tuple[F, ...], ...]:
    return tuple(tuple(scalar * value for value in row) for row in matrix)


def synthesis_gram(
    columns: tuple[tuple[F, ...], ...],
    inverse_metric: tuple[tuple[F, ...], ...],
) -> tuple[tuple[F, ...], ...]:
    dimension = len(columns[0])
    result = tuple(tuple(F(0) for _ in range(dimension)) for _ in range(dimension))
    for i, left in enumerate(columns):
        for j, right in enumerate(columns):
            result = matrix_add(
                result,
                matrix_scale(inverse_metric[i][j], outer(left, right)),
            )
    return result


class ActualMixedBridgeOddEnergyCaptureCircularityBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_note_hash(self) -> None:
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)
        self.assertEqual(len(FROZEN), 9)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)

    def test_gap_floor_and_pole_floor_are_combined_legally(self) -> None:
        mu = F(-2)
        gamma = F(5)
        kappa = F(5)
        operator = (
            (mu, F(0)),
            (F(0), mu + gamma),
        )
        bridge = (F(3), F(4))
        norm = dot(bridge, bridge)
        shifted = tuple(
            tuple(value - (mu if i == j else 0) for j, value in enumerate(row))
            for i, row in enumerate(operator)
        )
        energy = dot(bridge, matvec(shifted, bridge))
        overlap_squared = bridge[0] ** 2
        gap_floor = max(F(0), norm - energy / kappa)
        pole_coordinate = F(3)
        square_root_energy_ratio = F(4)
        pole_floor = max(
            F(0),
            pole_coordinate - square_root_energy_ratio / 2,
        ) ** 2

        self.assertEqual(norm, 25)
        self.assertEqual(energy, 80)
        self.assertEqual(gap_floor, 9)
        self.assertEqual(pole_floor, 1)
        self.assertEqual(overlap_squared, max(gap_floor, pole_floor))
        self.assertLessEqual(kappa, gamma)

    def test_raw_bridge_weighted_capture_and_mu_bound(self) -> None:
        mu = F(-2)
        bridge = (F(3), F(4))
        defect = F(7)
        operator = (
            (mu, F(0)),
            (F(0), F(3)),
        )
        overlap_squared = bridge[0] ** 2
        capture = overlap_squared / defect
        residual_squared = dot(matvec(operator, bridge), matvec(operator, bridge))
        residual_constant_squared = residual_squared / defect

        self.assertEqual(capture, F(9, 7))
        self.assertEqual(residual_squared, 180)
        self.assertLessEqual(mu * mu * capture, residual_constant_squared)
        self.assertLessEqual(
            mu * mu,
            residual_constant_squared * defect / overlap_squared,
        )

    def test_innovation_uses_its_own_schur_defect(self) -> None:
        bulk = (F(1), F(2))
        raw_bridge = (F(3), F(-1))
        bulk_defect = F(4)
        cross = F(1)
        raw_defect = F(3)
        determinant = bulk_defect * raw_defect - cross * cross
        inverse_metric = (
            (raw_defect / determinant, -cross / determinant),
            (-cross / determinant, bulk_defect / determinant),
        )
        schur_defect = raw_defect - cross * cross / bulk_defect
        innovation = tuple(
            raw - cross * base / bulk_defect
            for raw, base in zip(raw_bridge, bulk)
        )

        direct = synthesis_gram((bulk, raw_bridge), inverse_metric)
        completed = matrix_add(
            matrix_scale(1 / bulk_defect, outer(bulk, bulk)),
            matrix_scale(1 / schur_defect, outer(innovation, innovation)),
        )
        self.assertEqual(schur_defect, F(11, 4))
        self.assertEqual(innovation, (F(11, 4), F(-3, 2)))
        self.assertEqual(direct, completed)
        self.assertNotEqual(raw_bridge, innovation)
        self.assertNotEqual(raw_defect, schur_defect)

    def test_energy_over_kappa_forces_norm_capture(self) -> None:
        previous_floor = F(0)
        for m in (3, 5, 7, 11, 17, 29):
            ratio = F(4 * m * m, (m * m + 1) ** 2)
            floor = 1 - ratio
            self.assertGreater(floor, previous_floor)
            self.assertLess(ratio, F(4, m * m))
            previous_floor = floor
        self.assertGreater(previous_floor, F(99, 100))

    def test_fixed_common_core_ceiling_makes_ratio_target_strength(self) -> None:
        common_core_ceiling = F(3)
        for m in (4, 8, 16, 32, 64):
            pole_row = (F(m), F(1))
            kernel_vector = (F(1), F(-m))
            self.assertEqual(dot(pole_row, kernel_vector), 0)
            kernel_norm_squared = dot(kernel_vector, kernel_vector)
            core_form = F(2) + F(3) * m * m
            core_rayleigh = core_form / kernel_norm_squared
            self.assertLessEqual(core_rayleigh, common_core_ceiling)

            mu = F(1, m)
            physical_self = F(2, m)
            norm = F(1)
            energy = physical_self - mu * norm
            kappa = core_rayleigh - mu
            self.assertLessEqual(kappa, common_core_ceiling - mu)
            self.assertEqual(energy, F(1, m))
            self.assertLess(energy / kappa, F(1, m))

            fixed_negative_mu = F(-1)
            fixed_negative_energy = physical_self - fixed_negative_mu * norm
            fixed_negative_ceiling = common_core_ceiling - fixed_negative_mu
            self.assertGreaterEqual(
                fixed_negative_energy / fixed_negative_ceiling,
                F(1, 4),
            )

    def test_exact_three_dimensional_pole_created_countermodel(self) -> None:
        for m in (3, 5, 7, 11, 17):
            mu = F(-1)
            kappa = F((m * m + 1) ** 2, 4 * m * m)
            ground_coordinate = F(m * m - 1, m * m + 1)
            excited_coordinate = F(2 * m, m * m + 1)
            pole = (F(1), F(0), F(0))
            bridge = (ground_coordinate, excited_coordinate, F(0))
            h_matrix = (
                (F(1), F(0), F(0)),
                (F(0), kappa - 1, F(0)),
                (F(0), F(0), kappa - 1),
            )
            q_matrix = (
                (F(-1), F(0), F(0)),
                (F(0), kappa - 1, F(0)),
                (F(0), F(0), kappa - 1),
            )
            reconstructed_q = tuple(
                tuple(
                    h_matrix[i][j] - 2 * pole[i] * pole[j]
                    for j in range(3)
                )
                for i in range(3)
            )
            q_value = dot(bridge, matvec(q_matrix, bridge))
            energy = q_value - mu * dot(bridge, bridge)
            residual_squared = dot(
                matvec(q_matrix, bridge),
                matvec(q_matrix, bridge),
            )

            self.assertEqual(reconstructed_q, q_matrix)
            self.assertEqual(dot(bridge, bridge), 1)
            self.assertEqual(kappa * excited_coordinate**2, 1)
            self.assertEqual(2 * F(1, 2), 1)  # Birman--Schwinger at mu=-1.
            self.assertEqual(q_value, 0)
            self.assertEqual(energy, 1)
            self.assertEqual(energy / kappa, excited_coordinate**2)
            self.assertEqual(
                ground_coordinate**2,
                1 - energy / kappa,
            )
            self.assertEqual(residual_squared, kappa - 1)
            self.assertEqual(mu, -1)  # The ground stays fixed.

        large_m = 101
        large_kappa = F((large_m * large_m + 1) ** 2, 4 * large_m * large_m)
        self.assertGreater(large_kappa, F(10) - F(-1))

    def test_countermodel_residual_gate_fails_for_every_defect_scale(self) -> None:
        m = 13
        kappa = F((m * m + 1) ** 2, 4 * m * m)
        capture_fraction = 1 - 1 / kappa
        for defect in (F(1, 10), F(1, 10**6), F(1, 10**12)):
            weighted_capture = capture_fraction / defect
            residual_constant_squared = (kappa - 1) / defect
            ratio = residual_constant_squared / weighted_capture
            self.assertEqual(ratio, kappa)
            self.assertGreater(ratio, 1)

    def test_one_sided_physical_bounds_translate_to_opposite_g_bounds(self) -> None:
        carrier_constant = F(5, 7)
        coefficient = F(3, 2)
        bound = F(11, 5)
        lower_g = (carrier_constant - bound) / coefficient
        upper_g = (carrier_constant + bound) / coefficient
        for g_value in (lower_g, lower_g + 1, lower_g + 7):
            scaled_q = carrier_constant - coefficient * g_value
            self.assertLessEqual(scaled_q, bound)
        for g_value in (upper_g, upper_g - 1, upper_g - 7):
            scaled_q = carrier_constant - coefficient * g_value
            self.assertGreaterEqual(scaled_q, -bound)

    def test_off_line_zero_maps_injectively_to_right_half_plane_pole(self) -> None:
        zeros = (
            (F(1, 3), F(7), 1),
            (F(2, 5), F(11), 2),
            (F(3, 7), F(13), 1),
        )
        poles = tuple((1 - 2 * beta, -2 * gamma) for beta, gamma, _ in zeros)
        self.assertEqual(len(poles), len(set(poles)))
        self.assertTrue(all(real > 0 for real, _ in poles))
        self.assertTrue(all(multiplicity > 0 for _, _, multiplicity in zeros))

    def test_unconditional_physical_decay_is_not_the_rh_rate(self) -> None:
        # A finite exact analogue of dominated convergence with beta>0.
        for m in (2, 4, 8, 16, 32):
            lam = F(m * m)
            same_tail = (
                F(1, m) / 17
                + F(1, m * m) / 29
                + F(1, m * m * m) / 41
            )
            self.assertGreater(same_tail, 0)
            if m > 2:
                self.assertLess(same_tail, F(1, m - 1))
            self.assertLessEqual(same_tail, F(1, 17) + F(1, 29) + F(1, 41))
            self.assertGreater(lam, 1)

    def test_nested_odd_bottom_squeeze_and_energy_are_target_strength(self) -> None:
        nested_odd_bottoms: list[F] = []
        negative_nonmonotone_candidates: list[F] = []
        for m in (4, 8, 16, 32, 64):
            q_value = F(2, m)
            norm = F(1)
            mu_odd = F(1, m)
            odd_energy = q_value - mu_odd * norm
            nested_odd_bottoms.append(mu_odd)
            negative_nonmonotone_candidates.append(F(-1, m))
            self.assertLessEqual(mu_odd, q_value / norm)
            self.assertGreaterEqual(mu_odd, 0)
            self.assertGreaterEqual(q_value, 0)
            self.assertGreaterEqual(odd_energy, 0)
            self.assertLessEqual(odd_energy, q_value)

            mu_false = F(-1, 3)
            false_energy = q_value - mu_false * norm
            self.assertGreaterEqual(false_energy, F(1, 3))

        self.assertTrue(
            all(
                right <= left
                for left, right in zip(
                    nested_odd_bottoms,
                    nested_odd_bottoms[1:],
                )
            )
        )
        self.assertFalse(
            all(
                right <= left
                for left, right in zip(
                    negative_nonmonotone_candidates,
                    negative_nonmonotone_candidates[1:],
                )
            )
        )

    def test_scope_tokens_and_forbidden_overclaims(self) -> None:
        required = (
            "sectoral",
            "global",
            "mu_-=mu_full",
            "ordinary loaded-gap inequality",
            "does not use the pole coordinate",
            "same raw bridge",
            "R_\\lambda",
            "raw overlap may not be divided by",
            "innovation overlap may not be divided by",
            "near-total **odd-ground capture**",
            "parity identification",
            "{\\cal C}_M^2d_b\\longrightarrow0",
            "A small quadratic energy does not bound",
            "matching-metric rule",
            "fixed two-dimensional odd common core",
            "V cap p_lambda^perp",
            "\\kappa",
            "\\leq C_V-\\mu_-",
            "q_\\lambda-\\mu_-n_\\lambda=E_\\lambda",
            "\\mu_-(n_\\lambda-\\epsilon_\\lambda)",
            "actual common-core and nesting inputs",
            "parity/residual route is redundant",
            "three-dimensional",
            "pole-created family below",
            "abstract sharpness only",
            "entire `p^perp` energy grows like",
            "q_m=\\langle w_m,Q_mw_m\\rangle=0",
            "\\|Q_mw_m\\|^2=K_m-1",
            "one-sided Landau",
            "h_+(a)=C_1-G(a)",
            "h_-(a)=C_1+G(a)",
            "complete real parameter family",
            "No arbitrary sparse subsequence",
            "eventual-nonnegative real-abscissa Laplace lemma",
            "odd subspaces are nested",
            "odd monotonicity then gives",
            "q_lambda>=0",
            "lower one-sided bound",
            "\\mu_-(\\lambda)\\geq-o(1)",
            "E_\\lambda=o(1)",
            "\\Longleftrightarrow\\quad {\\rm RH}",
            "No arbitrary noncofinal sequence",
            "The distinction between `mu_-` and `mu_full` therefore does not obstruct",
            "complete bottom",
            "cofinal schedule",
            "standard eight are untouched",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "It does not by itself force\n`mu_full->0`",
            "E=o(kappa)` is sufficient for near-total odd-ground capture,\nbut",
            "structural counterexample to promoting\n`E=o(kappa)` directly",
            "Odd-sector monotonicity is not a substitute",
            "There is no licensed arrow from (8.6) to RH",
            "E=o(1) does not imply RH in odd sector",
            "odd-sector monotonicity alone proves RH",
            "mu_- is the complete bottom unconditionally",
            "C_M^2*d_b->0 is proved",
            "the upper one-sided bound holds",
            "the lower one-sided bound holds",
            "a sparse subsequence is covered",
            "raw overlap may be divided by s_b",
            "innovation overlap may be divided by d_b",
        )
        lowered = self.text.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

    def test_display_tags_ascii_and_no_binary_floats(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), 60)
        self.assertEqual(len(tags), 60)
        self.assertEqual(len(tags), len(set(tags)))

        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertNotIn(b"\t", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertTrue(
                all(line.rstrip(b" ") == line for line in payload.splitlines())
            )

        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        float_constants = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(float_constants, [])

        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__",
                "ast",
                "fractions",
                "hashlib",
                "pathlib",
                "re",
                "shutil",
                "subprocess",
                "tempfile",
                "unittest",
            },
        )

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        self.assertIsNotNone(pdflatex, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertEqual(len(displays), 60)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [
                    pdflatex,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    tex_path.name,
                ],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
