#!/usr/bin/env python3
"""Exact regressions for the cutoff-free ground-alignment RH dichotomy.

The verifier uses integers and Fraction for every mathematical fixture.  It
does not read a zero table, prolate artifact, finite ground, or cached matrix.
"""

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
    / "CUTOFF_FREE_PROLATE_GROUND_ALIGNMENT_RH_DICHOTOMY.md"
)
NOTE_HASH = "37f381b6ed75017633f4c845f90ff7d2660699bc0ae7a4340ec789b0e8dccea7"

FROZEN = {
    "vendor/CCM-ZST-2511.22755v1.pdf":
        "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
    "notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md":
        "04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83",
    "tests/test_fixed_source_block_shift_asymptotic_theorem.py":
        "433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5",
    "notes/FIXED_ANCHOR_BV_CAUCHY_FAR_ROW_THEOREM.md":
        "59395e5d184c93e3e56c935028c5fba322a0f30476bd9db1c99585c056876c79",
    "tests/test_fixed_anchor_bv_cauchy_far_row_theorem.py":
        "905dae5ca5489665dea4bfa1309d062fbd2769a529674b6c10d380a3f3627e3e",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md":
        "3847cbcb6e5bfc458af7bf957ff67afb0b943155d62f4239129b40332d270fbf",
    "tests/test_projected_state_norm_lower_bound.py":
        "d740587d2af62c5ef1b1255dc8184d8bea0833c70740b6697407678f90e1d079",
    "notes/FULL_EXTERIOR_SAMPLING_FALLBACK.md":
        "7dd2d8b6d32da5e1d98a6c96702a8079b53075eb756d1204219a4581c6296413",
    "tests/test_full_exterior_sampling_fallback.py":
        "62eb6f6bda3ab3cbcd24bfd095585c9dd154f6d08c3729ff0700f6d970b217ef",
    "notes/FIXED_LAMBDA_GALERKIN_ALIGNMENT_NO_GO.md":
        "a809f361f3939c2f309ad7030b8ef5abd5cf321b443d513d7d0c7087a7f38d34",
    "tests/test_fixed_lambda_galerkin_alignment_no_go.py":
        "118afd5b57e9d1b0267d00d230526426cc26833bb74d62f98ccf01f7966198c5",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def harmonic(index: int) -> F:
    return sum((F(1, term) for term in range(1, index + 1)), F(0))


def cauchy_weight_sum(mode: int, cutoff: int) -> F:
    return sum(
        (
            F(1, (1 + abs(other)) * abs(mode - other))
            for other in range(-cutoff, cutoff + 1)
            if other != mode
        ),
        F(0),
    )


def dot(left: tuple[F, ...], right: tuple[F, ...]) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def diagonal_action(
    diagonal: tuple[F, ...], vector: tuple[F, ...]
) -> tuple[F, ...]:
    return tuple(value * coordinate for value, coordinate in zip(diagonal, vector))


def subtract(left: tuple[F, ...], right: tuple[F, ...]) -> tuple[F, ...]:
    return tuple(x - y for x, y in zip(left, right))


def scale(value: F, vector: tuple[F, ...]) -> tuple[F, ...]:
    return tuple(value * coordinate for coordinate in vector)


class CutoffFreeProlateGroundAlignmentRhDichotomyTests(unittest.TestCase):
    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)

    def test_note_hash_is_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_two_sided_cauchy_convolution_has_no_outer_logarithm(self) -> None:
        # The exact finite sums increase to the infinite sum.  A uniform
        # harmonic-over-mode bound verifies the mechanism in (3.1) without
        # using a floating-point logarithm.
        for mode in (2, 3, 4, 8, 16, 32, 64):
            previous = F(0)
            for cutoff in (mode, 2 * mode, 4 * mode, 8 * mode):
                with self.subTest(mode=mode, cutoff=cutoff):
                    value = cauchy_weight_sum(mode, cutoff)
                    self.assertGreaterEqual(value, previous)
                    self.assertLessEqual(
                        value,
                        F(8) * (F(1) + harmonic(mode + 2)) / F(mode + 1),
                    )
                    previous = value

    def test_cauchy_commutator_preserves_one_over_n_tail(self) -> None:
        cutoff = 96
        modes = tuple(range(-cutoff, cutoff + 1))
        coefficients = {
            mode: F(1, 1 + abs(mode))
            for mode in modes
        }
        # This is an exact bounded odd source sequence, |b_n|<1.
        source = {
            mode: F(mode, 1 + abs(mode))
            for mode in modes
        }

        for mode in (8, 16, 32, 64):
            action = sum(
                (
                    (source[mode] - source[other])
                    * coefficients[other]
                    / F(mode - other)
                    for other in modes
                    if other != mode
                ),
                F(0),
            )
            majorant = F(2) * cauchy_weight_sum(mode, cutoff)
            self.assertLessEqual(abs(action), majorant)
            self.assertLessEqual(
                abs(action),
                F(16) * (F(1) + harmonic(mode + 2)) / F(mode + 1),
            )

    def test_exact_bottom_projector_residual_identity(self) -> None:
        diagonal = (F(-2), F(3), F(7))
        kappa = (F(3, 5), F(4, 5), F(0))
        self.assertEqual(dot(kappa, kappa), F(1))

        action = diagonal_action(diagonal, kappa)
        q = dot(kappa, action)
        residual = subtract(action, scale(q, kappa))
        ground_projection = (kappa[0], F(0), F(0))
        projected_residual = (residual[0], F(0), F(0))
        mu = diagonal[0]
        rho = dot(ground_projection, ground_projection)

        self.assertEqual(projected_residual, scale(mu - q, ground_projection))
        self.assertEqual(
            dot(projected_residual, projected_residual),
            (mu - q) ** 2 * rho,
        )
        self.assertLessEqual(
            (mu - q) ** 2 * rho,
            dot(residual, residual),
        )

    def test_fixed_negative_ground_forces_quasimode_overlap_to_zero(self) -> None:
        previous_rho = F(1)
        previous_residual_square = F(1)
        for index in (2, 3, 5, 8, 13, 21, 34):
            # Rational unit circle parametrization.  The first coordinate is
            # the overlap with the fixed ground of diag(-1,0).
            ground_coordinate = F(2 * index, index * index + 1)
            high_coordinate = F(index * index - 1, index * index + 1)
            kappa = (ground_coordinate, high_coordinate)
            self.assertEqual(dot(kappa, kappa), F(1))

            action = diagonal_action((F(-1), F(0)), kappa)
            q = dot(kappa, action)
            residual = subtract(action, scale(q, kappa))
            rho = ground_coordinate * ground_coordinate
            residual_square = dot(residual, residual)

            self.assertEqual(q, -rho)
            self.assertEqual(
                residual[0],
                (F(-1) - q) * ground_coordinate,
            )
            self.assertLess(rho, previous_rho)
            self.assertLessEqual(residual_square, previous_residual_square)
            previous_rho = rho
            previous_residual_square = residual_square

        self.assertLess(previous_rho, F(1, 100))
        self.assertLess(previous_residual_square, F(1, 100))

    def test_positive_overlap_model_tracks_monotone_ground_to_zero(self) -> None:
        previous_mu = F(1)
        for index in (2, 3, 5, 8, 13, 21):
            mu = F(1, index)
            diagonal = (mu, F(2))
            kappa = (F(1), F(0))
            action = diagonal_action(diagonal, kappa)
            q = dot(kappa, action)
            residual = subtract(action, scale(q, kappa))
            self.assertLess(mu, previous_mu)
            self.assertEqual(q, mu)
            self.assertEqual(residual, (F(0), F(0)))
            self.assertEqual(dot(kappa, kappa), F(1))
            previous_mu = mu

    def test_note_contract_and_hygiene(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "E_{\\lambda_p,N_p}=o(d_{4,p}L_p)",
            "|\\mu_\\lambda-q_{\\lambda,\\infty}|\\sqrt{\\rho_\\lambda}",
            "\\limsup_{p\\to\\infty}\\rho_{\\lambda_p}>0",
            "\\rho_{\\lambda_p}\\longrightarrow0",
            "domain exhaustion",
            "translation invariant",
            "full bottom spectral projector",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, text)

        self.assertEqual(text.count("\\["), text.count("\\]"))
        self.assertNotIn("\r", text)
        self.assertNotIn("\t", text)
        arrow_command = "long" + "rightarrow"
        for match in re.finditer(arrow_command, text):
            self.assertGreater(match.start(), 0)
            self.assertEqual(text[match.start() - 1], "\\")
        self.assertIsNone(re.search(r"[ \t]+$", text, flags=re.MULTILINE))
        self.assertNotIn("TO_BE_FROZEN", text)

        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__)):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        text = NOTE.read_text(encoding="ascii")
        displays = re.findall(r"\\\[(.*?)\\\]", text, flags=re.S)
        self.assertGreaterEqual(len(displays), 30)
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
                ["pdflatex", "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_verifier_has_no_binary_float_literals(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="utf-8"))
        floats = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(floats, [])


if __name__ == "__main__":
    unittest.main()
