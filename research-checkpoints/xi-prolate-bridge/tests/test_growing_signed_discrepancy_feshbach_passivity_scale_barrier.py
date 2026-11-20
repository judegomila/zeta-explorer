#!/usr/bin/env python3
"""Regressions for the signed-discrepancy Feshbach passivity barrier."""

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

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / (
    "GROWING_SIGNED_DISCREPANCY_FESHBACH_PASSIVITY_SCALE_BARRIER.md"
)
NOTE_HASH = "c9ebf7b69860babc66c8c5a447104e93b2e55aa2410e442e8458728b54a16621"

FROZEN = {
    "notes/GROWING_MIXED_BRIDGE_ACTUAL_MULTIPLIER_DANGEROUS_FESHBACH_REDUCTION.md":
        "cc2a62d6be1c62985ab9d5e2893c74c9ae773280f6bff4015f998364ccbd924e",
    "notes/GROWING_MULTIPLIER_DEFICIT_GEOMETRY_BOUNDARY_ALIAS_BARRIER.md":
        "2e5b38892f73848b4d081de5fef45f10819bd4e7f6a8be5a4edb8f85dae11141",
    "notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md":
        "eda566d5a2867d28f5218a89a48cc95c30fe74491fb11bb74b86c7fb6ed68ac6",
    "notes/TAIL_DISCREPANCY_TRANSVERSE_SCHUR_NORMAL_FORM.md":
        "356bba54acee28d61968973558e5996589c2444843a1bf58650285e29c824fb8",
    "notes/TAIL_DISCREPANCY_SAFE_HERGLOTZ_AND_ACTUAL_SCHUR_OBSTRUCTION.md":
        "5efd87e2ff6bd21b498a1ff3d189fe252f4617c58da28d9650237763e3928341",
    "notes/CYCLIC_MELLIN_GRAPH_PRODUCT_TRANSITION_PACKET_NONCAPTURE_BARRIER.md":
        "b7e29753bb6ff4f4082a114413bf7f80b460f4c8d0a0b5e48ee73e435e2fc488",
    "notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md":
        "78e0b9a7c3512bcd2b5fe34d48594734b6323fc57ca55db5e4090d6d6a277fb3",
    "tests/test_q_shift_sector_weil_core_gate.py":
        "714f9839b0514c779f1fc05d558dd9446654de360dd1f0cc70502cba75fa6bf2",
    "notes/RITZ_SHIFTED_TAIL_DISCREPANCY_SCHUR_GATE.md":
        "29a42b181e361c0e42dff96c636f2c5bb31a7b3814a43fec914dbfaa216bfc1e",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def orbit_real_part(
    sigma: float,
    tau: float,
    beta: float,
    gamma: float,
) -> float:
    return (
        (sigma - beta) / ((sigma - beta) ** 2 + (tau - gamma) ** 2)
        + (sigma + beta) / ((sigma + beta) ** 2 + (tau + gamma) ** 2)
    )


def same_height_pair_real_part(
    eta: float,
    offset: float,
    delta: float,
) -> float:
    return (
        (eta - delta) / ((eta - delta) ** 2 + offset ** 2)
        + (eta + delta) / ((eta + delta) ** 2 + offset ** 2)
    )


class GrowingSignedDiscrepancyFeshbachPassivityScaleBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_scalar_centering(self) -> None:
        c_star = -1.3721834192256654
        inner = 0.73 - 0.19j
        integral_of_derivative = -2.0 * inner
        moved = 0.5 * c_star * integral_of_derivative
        self.assertAlmostEqual(moved.real, (-c_star * inner).real, places=14)
        self.assertAlmostEqual(moved.imag, (-c_star * inner).imag, places=14)

        spectral_shift = 2.4
        upper_shift = 2.4
        centered_scalar = (spectral_shift - upper_shift) * inner
        self.assertEqual(centered_scalar, 0.0j)
        self.assertIn(r"(\sigma-U)\langle u,y\rangle", self.text)
        self.assertIn("at `sigma=U` the scalar vanishes exactly", self.text)

    def test_exact_stieltjes_variation_and_scale_gap(self) -> None:
        lam = 10_000.0
        endpoint_discrepancy = 0.003 * lam
        weighted_sum = 2.0 * (lam - 1.0) + endpoint_discrepancy
        variation = weighted_sum + 2.0 * (lam - 1.0)
        self.assertAlmostEqual(
            variation,
            4.0 * (lam - 1.0) + endpoint_discrepancy,
        )
        self.assertGreater(variation / lam, 3.99)
        target = 1.0 / (math.sqrt(lam) * math.log(lam) ** 3)
        self.assertGreater(variation / target, lam ** 1.4)
        self.assertIn(r"\|dD_\lambda\|_{\rm TV}", self.text)
        self.assertIn(r"\lambda^{3/2}\operatorname {polylog}", self.text)

    def test_pnt_bound_diverges_even_for_fixed_mode(self) -> None:
        alpha = 0.8476836

        def log_fixed_mode_bound(logarithmic_length: float) -> float:
            return (
                logarithmic_length / 2.0
                + 0.5 * math.log(logarithmic_length)
                - alpha * math.sqrt(logarithmic_length)
            )

        self.assertGreater(log_fixed_mode_bound(100.0), 40.0)
        self.assertGreater(
            log_fixed_mode_bound(400.0),
            log_fixed_mode_bound(100.0),
        )

        length = 17.0
        mode = 3
        grid = np.linspace(0.0, length, 200_001)
        phase = 2.0 * math.pi * mode * grid / length
        derivative = (
            -2.0 * np.cos(phase) / length
            - 4.0 * math.pi * mode * (1.0 - grid / length)
            * np.sin(phase) / length
        )
        bound = (2.0 + 4.0 * math.pi * mode) / length
        self.assertLessEqual(float(np.max(np.abs(derivative))), bound + 1e-14)
        self.assertIn(r"C_n\lambda\sqrt L", self.text)
        self.assertIn(r"4\pi N+4N+2", self.text)

    def test_zero_orbit_positive_real_boundary(self) -> None:
        beta = 0.31
        gamma = 9.7
        for tau in (-30.0, -9.7, 0.0, 9.7, 30.0):
            self.assertGreater(orbit_real_part(0.5, tau, beta, gamma), 0.0)

        for sigma in (1e-4, 0.01, 0.2):
            for tau in (-9.7, 0.0, 9.7):
                self.assertGreater(
                    orbit_real_part(sigma, tau, 0.0, gamma),
                    0.0,
                )

        # The complete same-height functional pair still has a negative
        # well when the damping lies to the left of the off-line quartet.
        paired_well = same_height_pair_real_part(0.2, 0.0, beta)
        self.assertAlmostEqual(
            paired_well,
            -2.0 * 0.2 / (beta ** 2 - 0.2 ** 2),
        )
        self.assertLess(paired_well, -7.0)
        self.assertIn("positive-real continuation is exactly RH", self.text)
        self.assertIn("residue", self.text)
        self.assertIn("functional-equation symmetry", self.text)

    def test_causal_damping_similarity_and_half_exponent_loss(self) -> None:
        rng = np.random.default_rng(20260811)
        dimension = 9
        step = 0.4
        eta = 0.5
        kernel = rng.normal(size=dimension)
        undamped = np.zeros((dimension, dimension))
        damped = np.zeros((dimension, dimension))
        for row in range(dimension):
            for column in range(row + 1):
                lag = row - column
                undamped[row, column] = kernel[lag]
                damped[row, column] = math.exp(-eta * lag * step) * kernel[lag]
        positions = np.arange(dimension) * step
        multiplier = np.diag(np.exp(eta * positions))
        inverse = np.diag(np.exp(-eta * positions))
        np.testing.assert_allclose(damped, inverse @ undamped @ multiplier)
        np.testing.assert_allclose(undamped, multiplier @ damped @ inverse)

        lam = 10_000.0
        length = 2.0 * math.log(lam)
        safe_loss = math.exp(-0.5 * length)
        self.assertAlmostEqual(safe_loss, 1.0 / lam, places=16)

        # The comparison is asymptotic.  In logarithmic variables the target
        # exceeds the safe loss once L/4 dominates every fixed A*log(L/2).
        asymptotic_length = 400.0
        log_safe = -asymptotic_length / 2.0
        log_target = (
            -asymptotic_length / 4.0
            - 4.0 * math.log(asymptotic_length / 2.0)
        )
        self.assertLess(log_safe, log_target)
        eta_needed = 0.25 + 2.0 * math.log(length) / length
        self.assertLess(eta_needed, 0.6)
        self.assertIn(r"\eta\leq{1\over4}", self.text)
        self.assertIn("not a common positive congruence", self.text)

    def test_frequency_dependent_result_leaves_off_line_wells(self) -> None:
        log_height = 400.0
        eta = 1.0 / math.sqrt(log_height)
        critical_proportion = 5.0 / 12.0
        critical_lower = 0.28 * critical_proportion / eta
        delta = eta + 0.02
        off_line_at_center = same_height_pair_real_part(eta, 0.0, delta)
        self.assertGreater(critical_lower, 0.0)
        self.assertLess(critical_lower + off_line_at_center, 0.0)

        source_length = 20.0
        allowed_local_count = log_height
        paired_fejer_bound = eta * source_length ** 2
        adverse_scale = paired_fejer_bound * allowed_local_count
        self.assertGreater(
            adverse_scale / critical_lower,
            source_length ** 2,
        )
        self.assertLess(math.exp(eta * 20.0), math.exp(10.0))
        self.assertIn("Grigutis--Turcinskas", self.text)
        self.assertIn("critical-line part", self.text)
        self.assertIn("negative off-line wells", self.text)
        self.assertIn("complete same-height pair", self.text)
        self.assertIn(r"O(\eta L^2)", self.text)
        self.assertIn("loses an unresolved factor `O(L^2)`", self.text)
        self.assertIn("no single variable-damping Volterra conjugation", self.text)
        self.assertIn("zero-density estimates control", self.text)

    def test_restricted_projector_claim_boundary(self) -> None:
        dangerous = np.diag([1.0, 1.2])
        safe = np.diag([3.0, 4.0])
        cross = np.array([[0.2, -0.1], [0.15, 0.25]])
        full = np.block([[dangerous, cross.T], [cross, safe]])
        short = dangerous - cross.T @ np.linalg.inv(safe) @ cross
        self.assertGreater(float(np.linalg.eigvalsh(safe)[0]), 0.0)
        self.assertGreater(float(np.linalg.eigvalsh(short)[0]), 0.0)
        self.assertGreater(float(np.linalg.eigvalsh(full)[0]), 0.0)

        upper_shift = 2.0
        rayleigh_shift = 1.0
        even_at_upper = np.diag([0.5, 0.8])
        odd_at_upper = np.diag([0.3, 0.7])
        even_at_rayleigh = (
            even_at_upper
            + (upper_shift - rayleigh_shift) * np.eye(2)
        )
        odd_at_rayleigh = (
            odd_at_upper
            + (upper_shift - rayleigh_shift) * np.eye(2)
        )
        self.assertGreater(float(np.linalg.eigvalsh(even_at_rayleigh)[0]), 0.0)
        self.assertGreater(float(np.linalg.eigvalsh(odd_at_rayleigh)[0]), 0.0)
        required = (
            "does **not** make the\npaired target",
            "finite, source-dependent family of correlations",
            "not an arbitrary positive compression",
            r"\beta_{\lambda,+}^{\rm mv}>0\Longleftrightarrow",
            "Because `q<=U_Z`",
            "already RH-strength",
            "density of the dangerous spaces is\nnot needed",
            "genuinely lower Ritz shift",
            "only individually weaker sign route",
            r"\mathfrak B^{(u_R)}_{\epsilon,\sigma}",
            "the scalar in (8.7) again vanishes exactly",
            r"B_{u_R}=B_q+t_RI",
            "No frozen schedule estimate puts it at a positive constant",
            "No retained sign",
            "P0_INVALIDATED",
            "standard eight are\nunchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the actual retained short is negative",
            "This proves the Riemann hypothesis",
            "the dangerous restriction is equivalent to RH",
            "restriction is strictly weaker than global",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_display_balance_unique_tags_and_ascii(self) -> None:
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))

    def test_import_hygiene(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__", "ast", "hashlib", "math", "numpy", "pathlib",
                "re", "shutil", "subprocess", "tempfile", "unittest",
            },
        )

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex = Path(directory) / "note.tex"
            tex.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-halt-on-error", "-interaction=nonstopmode", tex.name],
                cwd=directory,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout[-4000:])


if __name__ == "__main__":
    unittest.main()
