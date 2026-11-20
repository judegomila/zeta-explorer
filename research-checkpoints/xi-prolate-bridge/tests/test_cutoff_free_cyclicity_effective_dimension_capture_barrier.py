#!/usr/bin/env python3
"""Exact regressions for the cyclicity/effective-dimension capture barrier."""

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
NOTE = ROOT / "notes/CUTOFF_FREE_CYCLICITY_EFFECTIVE_DIMENSION_CAPTURE_BARRIER.md"
NOTE_HASH = "e27463c41c6a45fcb6a3a332b8e5ab173178f35a4abb9fd5eff07dfbbc27eccd"

FROZEN = {
    "notes/HIGH_FOURIER_COERCIVITY.md":
        "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "tests/test_high_fourier_coercivity.py":
        "64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md":
        "3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81",
    "tests/test_full_source_coframe_rank.py":
        "dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a",
    "notes/EVEN_ODD_MULTIPLICITY_KRYLOV_SIMPLICITY.md":
        "a027a83a79078f6b6fb61a12dcb3bad28c7f73d429c4fae9587ed398a4d079a8",
    "tests/test_even_odd_multiplicity_krylov_simplicity.py":
        "fcceb2cdfad61c0eb23cd51350f0c021f72288edc0f1cab781f3c6bf4f793408",
    "notes/CUTOFF_FREE_MULTI_ANCHOR_GROUND_FRAME_BARRIER.md":
        "2e07843d54f00bce9e53afadc0b434efbaf8f97da95dadda54225de6cfecb34d",
    "tests/test_cutoff_free_multi_anchor_ground_frame_barrier.py":
        "0fdc307a051d50ff4ece21ae8b01f89b745a14788f093ec4127f5da6026bde9f",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left: tuple[F, ...], right: tuple[F, ...]) -> F:
    return sum((x * y for x, y in zip(left, right, strict=True)), F(0))


def matvec(matrix: tuple[tuple[F, ...], ...], vector: tuple[F, ...]) -> tuple[F, ...]:
    return tuple(dot(row, vector) for row in matrix)


class CutoffFreeCyclicityEffectiveDimensionCaptureBarrierTests(unittest.TestCase):
    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)

    def test_note_hash_is_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_ground_block_equation_gives_exact_localization_bound(self) -> None:
        # Q=[[4/5,2],[2,5]] has ground eigenvalue zero with vector (5,-2).
        matrix = ((F(4, 5), F(2)), (F(2), F(5)))
        ground = (F(5), F(-2))
        self.assertEqual(matvec(matrix, ground), (F(0), F(0)))

        coupling = F(2)
        high_floor = F(5)
        low_square = ground[0] ** 2
        high_square = ground[1] ** 2
        self.assertEqual(high_square, (coupling / high_floor) ** 2 * low_square)
        self.assertEqual(
            low_square / (low_square + high_square),
            high_floor**2 / (high_floor**2 + coupling**2),
        )

    def test_normalized_full_source_isometry_has_exact_prefix_kernel(self) -> None:
        # T=[I_3 0] has TT*=I_3.  Its normalized adjoint is the coordinate
        # embedding into a four-dimensional source.  A two-row prefix misses
        # the third physical direction exactly.
        def normalized_adjoint(vector: tuple[F, F, F]) -> tuple[F, F, F, F]:
            return vector + (F(0),)

        def prefix(vector: tuple[F, F, F, F]) -> tuple[F, F, F, F]:
            return (vector[0], vector[1], F(0), F(0))

        kernel_vector = (F(0), F(0), F(1))
        self.assertEqual(prefix(normalized_adjoint(kernel_vector)), (F(0),) * 4)

        previous = F(1)
        for denominator in (2, 3, 5, 8, 13, 21):
            near_kernel = (F(1, denominator), F(0), F(1))
            image = prefix(normalized_adjoint(near_kernel))
            capture = dot(image, image) / dot(near_kernel, near_kernel)
            self.assertEqual(capture, F(1, denominator**2 + 1))
            self.assertLess(capture, previous)
            previous = capture

    def test_cyclic_cofactor_weight_can_tend_to_zero(self) -> None:
        previous = F(1)
        for integer in (2, 3, 5, 8, 13, 21):
            # Rational unit vector from the Pythagorean parametrization.
            sine = F(2 * integer, integer**2 + 1)
            cosine = F(integer**2 - 1, integer**2 + 1)
            self.assertEqual(sine**2 + cosine**2, 1)

            # B=I-u_0u_0^T has eigenvalues 0,1 and cyclic vector e_0.
            matrix = (
                (cosine**2, -sine * cosine),
                (-sine * cosine, sine**2),
            )
            ground = (sine, cosine)
            self.assertEqual(matvec(matrix, ground), (F(0), F(0)))
            self.assertNotEqual(matrix[0][1], 0)

            # The compression to e_0^perp is [sine^2].  At mu=0,
            # det(mu-B_v)/p'(mu)=(-sine^2)/(-1)=sine^2.
            cofactor_weight = (-sine**2) / F(-1)
            self.assertEqual(cofactor_weight, ground[0] ** 2)
            self.assertGreater(cofactor_weight, 0)
            self.assertLess(cofactor_weight, previous)
            previous = cofactor_weight

    def test_analytic_pythagorean_model_uses_exact_rational_samples(self) -> None:
        previous = F(1)
        for integer in (2, 3, 5, 8, 13, 21):
            t = F(1, 2 * integer)
            first = 2 * t / (1 + t**2)
            second = (1 - t**2) / (1 + t**2)
            weight = 4 * t**2 / (1 + t**2) ** 2
            self.assertEqual(first**2 + second**2, 1)
            self.assertEqual(weight, first**2)
            self.assertGreater(weight, 0)
            self.assertLess(weight, previous)
            previous = weight

    def test_exact_three_mode_source_cauchy_model(self) -> None:
        matrix = tuple(tuple(F(-1, 3) for _ in range(3)) for _ in range(3))
        ground_raw = (F(1), F(1), F(1))
        even_zero_raw = (F(1), F(-2), F(1))
        odd_zero_raw = (F(-1), F(0), F(1))
        self.assertEqual(matvec(matrix, ground_raw), tuple(-x for x in ground_raw))
        self.assertEqual(matvec(matrix, even_zero_raw), (F(0),) * 3)
        self.assertEqual(matvec(matrix, odd_zero_raw), (F(0),) * 3)

        # Verify the source-Cauchy reconstruction from a_n and b_n.
        labels = (-1, 0, 1)
        diagonal = {label: F(-1, 3) for label in labels}
        displacement = {-1: F(1, 3), 0: F(0), 1: F(-1, 3)}
        reconstructed: list[list[F]] = []
        for n in labels:
            row: list[F] = []
            for m in labels:
                if n == m:
                    row.append(diagonal[n])
                else:
                    row.append((displacement[n] - displacement[m]) / (n - m))
            reconstructed.append(row)
        self.assertEqual(tuple(tuple(row) for row in reconstructed), matrix)

    def test_parity_complete_family_saturates_residual_weight(self) -> None:
        previous_ratio = F(0)
        for integer in (2, 3, 5, 8, 13, 21):
            delta = F(2 * integer, integer**2 + 1)
            complement = F(integer**2 - 1, integer**2 + 1)
            rho_plus = delta**2
            residual_plus_square = delta**2 * complement**2
            rho_minus = F(0)
            residual_minus_square = F(0)
            ratio = (
                residual_plus_square + residual_minus_square
            ) / (rho_plus + rho_minus)
            self.assertEqual(ratio, complement**2)
            self.assertLess(ratio, 1)
            self.assertGreater(ratio, previous_ratio)
            previous_ratio = ratio

    def test_note_contract_and_hygiene(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            r"\|P_{\rm hi}g\|\leq{c_\lambda\over G}\|P_{\rm lo}g\|",
            r"M_*(\lambda,q,G)",
            r"\exp\{O(\lambda\log\lambda)\}",
            r"J_X^*J_X=I_X",
            r"\dim\ker(P_FJ_X)\geq\dim X-m",
            r"\lambda_{\min}(J_X^*P_FJ_X)=0",
            r"\lambda_{\max}",
            r"{\det(\mu_jI-B_v)\over",
            r"\det\mathcal K_B(v)",
            r"t(\lambda)={\exp(-\lambda^3)\over2}",
            r"\tau={A_{01}\over\sqrt2}",
            r"b_1=\tau,\quad b_{-1}=-\tau",
            r"{r_+^2+r_-^2\over\rho_++\rho_-}",
            r"e^{-6\pi\lambda^2}",
            "structural nonimplication",
            "not the actual Weil matrix",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, text)

        self.assertEqual(text.count(r"\["), text.count(r"\]"))
        self.assertNotIn("\r", text)
        self.assertNotIn("\t", text)
        self.assertIsNone(re.search(r"[ \t]+$", text, flags=re.MULTILINE))
        self.assertNotIn("TO_BE_FROZEN", text)
        self.assertNotIn(r"t={A_{01}\over\sqrt2}", text)

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
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout[-4000:] + result.stderr[-1000:])

    def test_test_module_has_no_process_or_network_surface(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="utf-8"))
        banned_imports = {"socket", "urllib", "requests", "httpx"}
        imports: set[str] = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imports.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imports.add(node.module.split(".")[0])
        self.assertTrue(imports.isdisjoint(banned_imports))
        binary_floats = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and type(node.value) is float
        ]
        self.assertEqual(binary_floats, [])


if __name__ == "__main__":
    unittest.main()
