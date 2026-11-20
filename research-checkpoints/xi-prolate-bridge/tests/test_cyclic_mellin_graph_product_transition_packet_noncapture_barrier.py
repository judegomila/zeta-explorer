#!/usr/bin/env python3
"""Regressions for the cyclic Mellin graph-product noncapture barrier."""

from __future__ import annotations

import hashlib
import math
import pathlib
import re
import shutil
import subprocess
import tempfile
import unittest

import numpy as np


ROOT = pathlib.Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "CYCLIC_MELLIN_GRAPH_PRODUCT_TRANSITION_PACKET_NONCAPTURE_BARRIER.md"
)


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class CyclicMellinGraphProductNoncaptureTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies(self) -> None:
        expected = {
            "notes/VECTOR_SPECIFIC_EQUATION_52_ATTACK.md": "79b9af2baddd0b2ae794e77bccf749c6fa0458afbf4637ca8b84931d8206788f",
            "notes/POLYLOG_SHIFTED_SOLVE_OBSERVABLE_REDUCTION.md": "5b7618305c56e2b1b403cd437c4cffad0ea4214396739ce2fed7a351ebb9fcfa",
            "notes/PROJECTIVE_WEDGE_RESOLVENT_REDUCTION.md": "aae9399deac920452a4dc9a3f865503bf987ac2be7fc3c11c515ae2ad02b9b55",
            "notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md": "78e0b9a7c3512bcd2b5fe34d48594734b6323fc57ca55db5e4090d6d6a277fb3",
            "tests/test_q_shift_sector_weil_core_gate.py": "714f9839b0514c779f1fc05d558dd9446654de360dd1f0cc70502cba75fa6bf2",
            "notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md": "b0254889d35ae41a92ee926dd116b473ee427e2762f8853903f4e80e307860ed",
            "tests/test_weak_residual_duality.py": "0f1f9847497b63b6b2c9e4b9f267dd8157ab71547f80b127d65cbda16af9d659",
            "notes/SIGNED_GRAPH_OBSERVABILITY_REDUCTION.md": "172890ec08c6c0db47fefe275870bfabaa196c43f18b765d94aa51d09c9fad6e",
            "notes/RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md": "96cb3e7302c95ed5357cff66a2c3df261b326e3e489700b1191c56fa3b6e14f3",
            "tests/test_rayleigh_self_regularized_observable.py": "672c8b09e8f836231bd63a6f257d2e931d0140f0acd1464e81ab55c9295d7f1f",
            "notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md": "3efbbf5cd0888d2a645b11c73b625007bf38bf010881d5e0c9d8ecbc964fb1a6",
            "tests/test_ritz_moment_self_regularized_transfer.py": "9ef4ed1d6fc282de372f6c91518b5f02207ea80d9ed98306efff6f8477867d4c",
            "notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md": "113be74d52f48d66903c1babf1525ec6d130243321acfa31562abd8640868a3a",
            "tests/test_hybrid_outer_sampling_odd_shift.py": "9ecd210103e73853f242ef5301ee676e8cd89198a6e5554f89773b2c90dcba0d",
            "notes/PROLATE_DEFECT_SOURCE_AUDIT.md": "b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d",
            "tests/test_prolate_defect_source_lock.py": "7caa8d088522d68dc4dedfad8d00d8e5c7e15070065c743d9e2a41f9e7faa519",
            "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md": "3847cbcb6e5bfc458af7bf957ff67afb0b943155d62f4239129b40332d270fbf",
            "tests/test_projected_state_norm_lower_bound.py": "d740587d2af62c5ef1b1255dc8184d8bea0833c70740b6697407678f90e1d079",
            "notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md": "787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79",
            "tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py": "73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7",
            "notes/GROWING_TRANSITION_ORDERED_PRIME_MOVING_DIVISOR_DENSITY_DISCREPANCY_VOLTERRA_THEOREM.md": "3c2005552a6c18919f31391d64a33d54be0ce51fc8a9190474fec58b06477f83",
            "notes/GROWING_TRANSITION_DISCREPANCY_ZERO_ORBIT_BERNOULLI_TAIL_BARRIER.md": "29270fcd5a38282ca06d0726afa1fc0334ae0fd2cdb64b9cf3ee6ef9b3ba5d48",
            "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md": "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
        }
        for relative, digest in expected.items():
            path = ROOT / relative
            self.assertTrue(path.is_file(), relative)
            self.assertEqual(sha256(path), digest, relative)

    def test_rank_deficient_source_quotient_identity_and_rows(self) -> None:
        bmat = np.array([[2.0, 0.3], [0.3, 1.5]])
        synthesis = np.array([[1.0, 0.0, 1.0], [0.0, 1.0, -1.0]])
        pulled = synthesis.T @ bmat @ synthesis
        quotient_inverse = synthesis @ np.linalg.pinv(pulled) @ synthesis.T
        np.testing.assert_allclose(
            quotient_inverse, np.linalg.inv(bmat), rtol=2e-13, atol=2e-13
        )

        anchor_norm = 1.7
        forcing = np.array([0.4, -0.9])
        mellin = np.array([1.2, 0.5])
        rho = -anchor_norm * synthesis.T @ forcing
        yrow = synthesis.T @ mellin
        pinv = np.linalg.pinv(pulled)
        self.assertAlmostEqual(
            float(rho @ pinv @ rho),
            anchor_norm**2 * float(forcing @ np.linalg.inv(bmat) @ forcing),
            places=12,
        )
        self.assertAlmostEqual(
            float(yrow @ pinv @ yrow),
            float(mellin @ np.linalg.inv(bmat) @ mellin),
            places=12,
        )

        ground_ridge = 0.7
        cmat = bmat + ground_ridge * np.eye(2)
        pulled_c = synthesis.T @ cmat @ synthesis
        mixed_quotient = -float(yrow @ np.linalg.pinv(pulled_c) @ rho)
        mixed_physical = anchor_norm * float(
            mellin @ np.linalg.inv(cmat) @ forcing
        )
        self.assertAlmostEqual(mixed_quotient, mixed_physical, places=12)

        known_shift_majorant = float(rho @ pinv @ rho) * float(yrow @ pinv @ yrow)
        self.assertLessEqual(mixed_quotient**2, known_shift_majorant + 1e-13)

    def test_exact_source_cauchy_model_has_nonzero_lower_ritz_product(self) -> None:
        indices = (-1, 0, 1)
        for epsilon in (0.2, 0.05, 0.01):
            raw_b = {-1: epsilon, 0: 0.0, 1: -epsilon}
            raw_a = {
                -1: 2 * epsilon**2 + epsilon,
                0: 0.0,
                1: 2 * epsilon**2 + epsilon,
            }
            qmat = np.zeros((3, 3))
            for row, n in enumerate(indices):
                for col, m in enumerate(indices):
                    if n == m:
                        qmat[row, col] = raw_a[n]
                    else:
                        qmat[row, col] = (raw_b[n] - raw_b[m]) / (n - m)

            kappa = np.array([0.0, 1.0, 0.0])
            even = np.array([1.0, 0.0, 1.0]) / math.sqrt(2)
            odd = np.array([-1.0, 0.0, 1.0]) / math.sqrt(2)
            qplus = np.array(
                [
                    [kappa @ qmat @ kappa, kappa @ qmat @ even],
                    [even @ qmat @ kappa, even @ qmat @ even],
                ]
            )
            self.assertAlmostEqual(qplus[0, 0], 0.0, places=14)
            self.assertAlmostEqual(qplus[0, 1], -math.sqrt(2) * epsilon, places=14)
            self.assertAlmostEqual(qplus[1, 1], 2 * epsilon**2, places=14)
            self.assertAlmostEqual(odd @ qmat @ odd, 2 * epsilon**2 + 2 * epsilon, places=14)

            bscalar = -math.sqrt(2) * epsilon
            lower_ritz = epsilon**2 - epsilon * math.sqrt(epsilon**2 + 2)
            bshift = 2 * epsilon**2 - lower_ritz
            gscalar = -math.sqrt(math.pi)
            forcing_energy = bscalar**2 / bshift
            mellin_leverage = gscalar**2 / bshift
            odd_shift = 2 * epsilon**2 + 2 * epsilon - lower_ritz
            self.assertGreater(bshift, 0.0)
            self.assertGreater(odd_shift, 0.0)
            self.assertAlmostEqual(
                forcing_energy,
                2 * epsilon / (epsilon + math.sqrt(epsilon**2 + 2)),
                places=13,
            )
            lower_ritz_product = forcing_energy * mellin_leverage
            expected = 2 * math.pi / (
                epsilon + math.sqrt(epsilon**2 + 2)
            ) ** 2
            self.assertAlmostEqual(lower_ritz_product, expected, places=12)
            self.assertGreater(lower_ritz_product, 2.0)

            # The one-dimensional complement has zero Ritz spectral spread.
            dshift = -lower_ritz
            w_b_w = bshift
            self.assertAlmostEqual(dshift * w_b_w, bscalar**2, places=13)
            spread = bscalar**2 * (1 / bshift - 1 / w_b_w)
            self.assertAlmostEqual(spread, 0.0, places=13)

            # The stronger q-shift diagnostic still has the old divergence.
            q_shift = 2 * epsilon**2
            q_product = (bscalar**2 / q_shift) * (gscalar**2 / q_shift)
            self.assertAlmostEqual(q_product, math.pi / (2 * epsilon**2), places=10)

    def test_lower_ritz_spread_leaves_first_inverse_energy_unbounded(self) -> None:
        energies = []
        for epsilon in (0.1, 0.03, 0.01):
            bmat = np.diag([epsilon**4, 2 * epsilon - epsilon**4])
            w = np.array([1.0, 1.0]) / math.sqrt(2)
            r = epsilon
            dshift = epsilon
            forcing = r * w

            self.assertAlmostEqual(float(w @ bmat @ w), epsilon, places=14)
            self.assertAlmostEqual(
                dshift * float(w @ bmat @ w), r**2, places=14
            )
            ritz = np.array([[epsilon, r], [r, float(w @ bmat @ w)]])
            self.assertAlmostEqual(float(np.linalg.eigvalsh(ritz)[0]), 0.0, places=13)
            self.assertLess(epsilon**4 - epsilon, 0.0)  # q-shift sign fails.

            # bb* <= epsilon I and q=U_Z=epsilon retain the frozen numerator.
            residual_rank_one = np.outer(forcing, forcing)
            self.assertGreaterEqual(
                float(np.linalg.eigvalsh(epsilon * np.eye(2) - residual_rank_one)[0]),
                -1e-14,
            )
            energy = float(forcing @ np.linalg.inv(bmat) @ forcing)
            exact = epsilon**2 / 2 * (
                epsilon ** (-4) + 1 / (2 * epsilon - epsilon**4)
            )
            self.assertAlmostEqual(energy, exact, places=10)
            energies.append(energy)
        self.assertGreater(energies[-1], energies[0] * 50)

    def test_transition_noncapture_model_is_exact_lower_ritz_and_diverges(self) -> None:
        epsilon = 1e-6
        delta = epsilon ** (3 / 4)
        dshift = epsilon / delta
        lower_ritz = -dshift
        qvalue = 0.0
        complement_h = lower_ritz + delta

        shifted_ritz = np.array(
            [[qvalue - lower_ritz, math.sqrt(epsilon)], [math.sqrt(epsilon), delta]]
        )
        self.assertAlmostEqual(float(np.linalg.det(shifted_ritz)), 0.0, places=14)
        self.assertGreater(float(np.trace(shifted_ritz)), 0.0)
        self.assertAlmostEqual(
            float(np.linalg.eigvalsh(shifted_ritz)[0]), 0.0, places=13
        )
        self.assertLess(complement_h - qvalue, 0.0)

        forcing_energy = epsilon / delta
        mellin_leverage = 1.0 / delta
        self.assertAlmostEqual(forcing_energy, epsilon ** (1 / 4), places=13)
        self.assertAlmostEqual(mellin_leverage, epsilon ** (-3 / 4), places=7)
        self.assertAlmostEqual(
            forcing_energy * mellin_leverage, epsilon ** (-1 / 2), places=8
        )
        self.assertLessEqual(qvalue, epsilon)  # q <= U_Z, but U=u is used.

        transition_scale = 1e4
        continuous = -transition_scale
        nonresonant = transition_scale + 1.0 - dshift
        complete = continuous + nonresonant
        self.assertAlmostEqual(complete, 1.0 - dshift, places=11)
        self.assertLess(abs(complete) / transition_scale, 2e-4)
        self.assertLess(continuous, -0.9 * transition_scale)
        self.assertGreater(nonresonant, 0.9 * transition_scale)

    def test_mellin_row_norm_and_locked_defect_scale(self) -> None:
        lam = 100.5
        length = 2 * math.log(lam)
        imag = 0.31
        exact = math.sinh(length * imag) / imag
        integrated = (
            math.exp(imag * length) - math.exp(-imag * length)
        ) / (2 * imag)
        self.assertAlmostEqual(exact, integrated, places=13)
        self.assertEqual(length, length)
        self.assertLess(exact, 2 * lam ** (2 * imag) / imag)

        a4_over_a8 = math.factorial(8) / (
            math.factorial(4) * (16 * math.pi) ** 4
        )
        locked_constant = 105 / (4096 * math.pi**4)
        self.assertAlmostEqual(a4_over_a8, locked_constant, places=16)
        self.assertEqual(3 - 8, -5)
        for eta in (0.1, 0.25, 0.49):
            self.assertLess(-5 + 2 * eta, 0)

    def test_required_claim_boundary_and_scale_tokens(self) -> None:
        required = (
            "N_j=2^{2400(2j+1)^2}=2^{9600\\lambda_j^2}",
            "B=A-u I",
            "Q_--u I\\succ0",
            "q\\leq U_Z",
            "A-qI=(A-U_ZI)+(U_Z-q)I\\succ0",
            "already an RH-level gate",
            "\\mathfrak B=W^*BW",
            "W\\mathfrak B^\\dagger W^*=B^{-1}",
            "\\mathfrak C=W^*CW",
            "-y_z^*\\mathfrak C^\\dagger\\rho_R",
            "strictly weaker actual-shift mixed row",
            "|y_z^*\\mathfrak C^\\dagger\\rho_R|\\longrightarrow0",
            "A_{\\rm R}(d/r)\\,r(B+rI)^{-1}",
            "E_u:=\\langle b,B^{-1}b\\rangle=d+\\chi_u",
            "\\rho_R^*\\mathfrak B^\\dagger\\rho_R",
            "y_z^*\\mathfrak B^\\dagger y_z",
            "\\rho_R\\rho_R^*\\preceq",
            "M_\\Omega(L)",
            "\\mathfrak G\\preceq C_R(\\lambda)\\mathfrak B",
            "y_zy_z^*\\preceq",
            "{\\epsilon_\\lambda\\over d_8}",
            "\\lambda^8{d_4\\over d_8}",
            "transition and zero-row theorems do not apply",
            "Exact source-Cauchy strictness model",
            "Finite transition-noncapture countermodel",
            "u_j=-d_j<q\\leq U_{Z,j}=\\epsilon_j",
            "\\epsilon_j^{-1/2}\\longrightarrow\\infty",
            "no frozen capture or reducing relation",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_no_sign_rh_or_ambient_gap_overclaim(self) -> None:
        forbidden = (
            "This note proves both strict shifted signs",
            "This note proves RH",
            "The transition space contains the cyclic forcing",
            "The completed zero rows form an unconditional positive Gram",
            "B\\succeq c d_8 I is proved",
            "Equation (0.5) is proved for the arithmetic source",
            "This note uses U=U_Z throughout",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, self.text)

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = pathlib.Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_ascii_balanced_displays_unique_tags_and_no_artifacts(self) -> None:
        starts = re.findall(r"(?m)^\s*\\\[\s*$", self.text)
        ends = re.findall(r"(?m)^\s*\\\]\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in data))
        self.assertNotIn("__pycache__", self.text)
        self.assertNotIn(".pyc", self.text)
        self.assertNotIn("PENDING_STRICT_AUDIT", self.text)


if __name__ == "__main__":
    unittest.main()
