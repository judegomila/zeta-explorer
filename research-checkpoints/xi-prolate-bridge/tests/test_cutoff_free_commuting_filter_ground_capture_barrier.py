#!/usr/bin/env python3
"""Exact regressions for the cutoff-free commuting-filter barrier."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "CUTOFF_FREE_COMMUTING_FILTER_GROUND_CAPTURE_BARRIER.md"
NOTE_HASH = "07d71f9219d41e9ae5e63e43e6b5ad16b86308fa7ace596b7a3af841170c69ac"

FROZEN = {
    "notes/CUTOFF_FREE_ONE_DIRECTION_WEIGHTED_GROUND_CAPTURE_THEOREM.md":
        "770087b56766e0102a915a31e08aba5389065d78dd59a55135adb5f5b6eea948",
    "tests/test_cutoff_free_one_direction_weighted_ground_capture_theorem.py":
        "a9cd2abbf8c3de284e1b375beffc7f186a7f4bebc3ecd7fba111195f435b86fc",
    "notes/CUTOFF_FREE_CYCLICITY_EFFECTIVE_DIMENSION_CAPTURE_BARRIER.md":
        "e27463c41c6a45fcb6a3a332b8e5ab173178f35a4abb9fd5eff07dfbbc27eccd",
    "tests/test_cutoff_free_cyclicity_effective_dimension_capture_barrier.py":
        "1bc88d49195b54c185be767a217d952145839962bf894e06dfe38ce9bfbed515",
    "notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md":
        "e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816",
    "tests/test_common_radical_leakage_gram_orientation.py":
        "d897e662d05665930d3b651d0460dd14f84f8e143ed010c9e248c948a5ace417",
    "notes/LOCKED_ROTATED_HIGH_GRAPH_SCHUR_REDUCTION.md":
        "ac50057befa429894ba1498869a602324489f34aa5795e2d39cfc62bd549df73",
    "notes/ODD_RADICAL_PARITY_SCHUR_REDUCTION.md":
        "3186182c5c3c6ef235e6a48bbe5a7e049f21db4094a8edbfaeb0160663a43c2e",
    "notes/EVEN_KRYLOV_RITZ_ESCAPE_AUDIT.md":
        "a9b903914caf9b6e05ebdece3b45071082835c8bd72641a62a6e4a04d8aa75a8",
    "tests/test_even_krylov_ritz_escape.py":
        "8425c05383710e0e362b945aa46eb07b08e4c18e2a3eaea0ecea3d52239af319",
}


Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def transpose(matrix: Matrix) -> Matrix:
    return tuple(
        tuple(matrix[row][column] for row in range(len(matrix)))
        for column in range(len(matrix[0]))
    )


def matmul(left: Matrix, right: Matrix) -> Matrix:
    right_t = transpose(right)
    return tuple(
        tuple(
            sum((x * y for x, y in zip(row, column, strict=True)), F(0))
            for column in right_t
        )
        for row in left
    )


def gram(rows: Matrix) -> Matrix:
    return matmul(transpose(rows), rows)


def subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x - y for x, y in zip(lrow, rrow, strict=True))
        for lrow, rrow in zip(left, right, strict=True)
    )


def scalar_matrix(value: F, matrix: Matrix) -> Matrix:
    return tuple(tuple(value * entry for entry in row) for row in matrix)


def quadratic(matrix: Matrix, vector: Vector) -> F:
    return sum(
        (
            vector[row] * matrix[row][column] * vector[column]
            for row in range(len(vector))
            for column in range(len(vector))
        ),
        F(0),
    )


class CutoffFreeCommutingFilterGroundCaptureBarrierTests(unittest.TestCase):
    def test_frozen_dependency_hashes(self) -> None:
        self.assertEqual(len(FROZEN), 10)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)

    def test_note_hash_is_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_filtered_bottom_row_and_atom_inequality(self) -> None:
        # Spectral coordinates for Q, a unit seed, two filter values, and
        # Delta^(-1/2)=diag(1/2,1/3).
        spectrum = (F(-2), F(1), F(4))
        mu = spectrum[0]
        q = F(1, 2)
        kappa = (F(1, 3), F(2, 3), F(2, 3))
        filters = (
            (F(2), F(-1)),
            (F(1), F(3)),
            (F(0), F(2)),
        )
        inverse_sqrt_defect = (F(1, 2), F(1, 3))

        synthesis = tuple(
            tuple(
                kappa[row] * filters[row][column]
                * inverse_sqrt_defect[column]
                for column in range(2)
            )
            for row in range(3)
        )
        bottom = (synthesis[0],)
        centered = tuple(
            tuple((spectrum[row] - q) * entry for entry in synthesis[row])
            for row in range(3)
        )

        capture_gram = gram(bottom)
        residual_gram = gram(centered)
        bottom_atom = scalar_matrix((mu - q) ** 2, capture_gram)
        remainder = subtract(residual_gram, bottom_atom)

        # The remainder is exactly the Gram of the two excited rows.
        self.assertEqual(remainder, gram(centered[1:]))
        for vector in ((F(1), F(0)), (F(0), F(1)), (F(2), F(-3))):
            self.assertGreaterEqual(quadratic(remainder, vector), 0)

        rho = kappa[0] ** 2
        evaluation_row = tuple(
            filters[0][column] * inverse_sqrt_defect[column]
            for column in range(2)
        )
        expected_capture = tuple(
            tuple(rho * x * y for y in evaluation_row)
            for x in evaluation_row
        )
        self.assertEqual(capture_gram, expected_capture)

    def test_uniform_envelope_cannot_improve_seed_bound(self) -> None:
        spectrum = (F(-2), F(1), F(4))
        q = F(1, 2)
        kappa = (F(1, 3), F(2, 3), F(2, 3))
        filters = (
            (F(2), F(-1)),
            (F(1), F(3)),
            (F(0), F(2)),
        )
        inverse_sqrt_defect = (F(1, 2), F(1, 3))

        row_norms_squared = tuple(
            sum(
                (
                    filters[row][column] ** 2
                    * inverse_sqrt_defect[column] ** 2
                    for column in range(2)
                ),
                F(0),
            )
            for row in range(3)
        )
        envelope_squared = max(row_norms_squared)
        evaluation_squared = row_norms_squared[0]
        residual_squared = sum(
            ((spectrum[row] - q) ** 2 * kappa[row] ** 2 for row in range(3)),
            F(0),
        )
        rho = kappa[0] ** 2

        filtered_envelope_ratio_squared = (
            residual_squared * envelope_squared / (rho * evaluation_squared)
        )
        seed_ratio_squared = residual_squared / rho
        self.assertGreaterEqual(envelope_squared, evaluation_squared)
        self.assertGreaterEqual(
            filtered_envelope_ratio_squared,
            seed_ratio_squared,
        )

        # Check the spectral-theorem envelope on representative source
        # combinations without floating point arithmetic.
        for vector in ((F(1), F(0)), (F(0), F(1)), (F(2), F(-3))):
            output_squared = F(0)
            for row in range(3):
                filtered_value = sum(
                    (
                        filters[row][column]
                        * inverse_sqrt_defect[column]
                        * vector[column]
                        for column in range(2)
                    ),
                    F(0),
                )
                output_squared += (
                    (spectrum[row] - q) ** 2
                    * kappa[row] ** 2
                    * filtered_value ** 2
                )
            vector_squared = sum((entry * entry for entry in vector), F(0))
            self.assertLessEqual(
                output_squared,
                residual_squared * envelope_squared * vector_squared,
            )

    def test_zero_capture_is_preserved_by_every_commuting_filter(self) -> None:
        # The seed has no coordinate on the bottom eigenspace.  Multiplying
        # each spectral coordinate by arbitrary values cannot create one.
        kappa = (F(0), F(3, 5), F(4, 5))
        filter_values = (F(10**6), F(-7), F(11))
        filtered = tuple(
            x * value for x, value in zip(kappa, filter_values, strict=True)
        )
        self.assertEqual(filtered[0], 0)

    def test_source_cauchy_two_level_model_saturates_filter_floor(self) -> None:
        # Pythagorean parametrization makes epsilon and sqrt(1-epsilon^2)
        # rational.  The Rayleigh value is exactly zero.
        for parameter in (2, 10, 100):
            with self.subTest(parameter=parameter):
                n = F(parameter)
                epsilon = F(2) * n / (n * n + 1)
                companion = (n * n - 1) / (n * n + 1)
                tau = epsilon * epsilon / (companion * companion)
                q = -epsilon * epsilon + tau * companion * companion
                residual_squared = (
                    epsilon * epsilon
                    + tau * tau * companion * companion
                )
                rho = epsilon * epsilon

                self.assertEqual(epsilon * epsilon + companion * companion, 1)
                self.assertEqual(q, 0)
                self.assertEqual(
                    residual_squared,
                    epsilon * epsilon / (1 - epsilon * epsilon),
                )
                self.assertEqual(
                    residual_squared / rho,
                    1 / (1 - epsilon * epsilon),
                )

                # A bounded spectral filter with values (1,0) isolates the
                # bottom.  Q then acts by -1, so the ratio is exactly one.
                filtered = (epsilon, F(0))
                q_filtered = (-epsilon, F(0))
                filtered_norm_squared = sum((x * x for x in filtered), F(0))
                residual_norm_squared = sum((x * x for x in q_filtered), F(0))
                self.assertEqual(residual_norm_squared, filtered_norm_squared)

        # With b_n=0, every off-diagonal source-Cauchy quotient vanishes.
        b = {index: F(0) for index in range(-3, 4)}
        for n in b:
            for m in b:
                if n != m:
                    self.assertEqual((b[n] - b[m]) / F(n - m), 0)

    def test_low_fourier_family_has_large_unweighted_capture(self) -> None:
        # A normalized bottom vector has squared low-band mass 16/25.  The
        # norm of P E_M is at least its overlap with the normalized low part.
        ground = (F(4, 5), F(0), F(0), F(3, 5))
        low = ground[:3]
        low_mass_squared = sum((entry * entry for entry in low), F(0))
        normalized_low = (F(1), F(0), F(0))
        overlap = sum(
            (x * y for x, y in zip(low, normalized_low, strict=True)),
            F(0),
        )
        self.assertEqual(low_mass_squared, F(16, 25))
        self.assertEqual(overlap * overlap, low_mass_squared)
        self.assertGreaterEqual(low_mass_squared, F(1, 2))

    def test_note_is_fail_closed_and_records_distinctions(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Lambda_\\Phi",
            "M_{\\Phi,\\Delta}",
            "comparison of certified **upper bounds**",
            "assert the false reverse inequality",
            "bounded Borel",
            "every nonconstant polynomial is",
            "higher-graph estimates",
            "Mobius",
            "T_{{\\rm ext},\\sigma}^{(M)}",
            "unweighted largest bottom capture at least `1/2`",
            "low-defect prolate source",
            "not the actual von-Mangoldt Weil operator",
            "standard eight are",
            "P0_INVALIDATED",
        )
        for phrase in required:
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, text)
        self.assertNotIn("RH is proved", text)
        self.assertNotIn("Riemann hypothesis is proved", text)

    def test_displayed_tex_compiles_and_tags_are_unique(self) -> None:
        text = NOTE.read_text(encoding="ascii")
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))
        displays = re.findall(r"\\\[(.*?)\\\]", text, flags=re.S)
        self.assertGreaterEqual(len(displays), 30)

        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
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
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(
            result.returncode,
            0,
            result.stdout[-4000:] + result.stderr[-1000:],
        )

    def test_new_files_are_ascii_and_have_no_trailing_space(self) -> None:
        for path in (NOTE, Path(__file__)):
            raw = path.read_bytes()
            raw.decode("ascii")
            for line in raw.splitlines():
                self.assertEqual(line, line.rstrip())


if __name__ == "__main__":
    unittest.main()
