#!/usr/bin/env python3
"""Exact regressions for the uniform radical graph-transfer theorem."""

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
NOTE = ROOT / "notes" / "CUTOFF_FREE_UNIFORM_RADICAL_GRAPH_TRANSFER_THEOREM.md"
NOTE_HASH = "aa69ac86e6b5d5256ba3b243b9fc07d9c5ad49bed7a70e3d570d0c57325bce18"

FROZEN = {
    "notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md":
        "c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c",
    "tests/test_cutoff_free_weighted_radical_coframe_reduction_barrier.py":
        "d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "tests/test_growing_transition_sampling.py":
        "ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac",
    "notes/CUTOFF_FREE_PROLATE_GROUND_ALIGNMENT_RH_DICHOTOMY.md":
        "37f381b6ed75017633f4c845f90ff7d2660699bc0ae7a4340ec789b0e8dccea7",
    "tests/test_cutoff_free_prolate_ground_alignment_rh_dichotomy.py":
        "b17c3c603d459547c09fd0abb92b595986356e29e1d53f7e8c6f3ace4a8baf80",
    "notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md":
        "3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f",
    "tests/test_defect_relative_projection.py":
        "21b33670a9d017d363f53776ba05ca93ce3588eb049ba9dcb7e61f202bc01999",
    "notes/FULL_EXTERIOR_SAMPLING_FALLBACK.md":
        "7dd2d8b6d32da5e1d98a6c96702a8079b53075eb756d1204219a4581c6296413",
    "tests/test_full_exterior_sampling_fallback.py":
        "62eb6f6bda3ab3cbcd24bfd095585c9dd154f6d08c3729ff0700f6d970b217ef",
    "notes/HIGH_FOURIER_COERCIVITY.md":
        "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "tests/test_high_fourier_coercivity.py":
        "64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae",
    "notes/GROWING_WINDOW_THEOREM.md":
        "dad6b0a878b7eba21cbc7aa8049cf3bf89a38df766cc157a87c416e79a721ac7",
}


Matrix = tuple[tuple[F, ...], ...]
Vector = tuple[F, ...]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def identity(size: int) -> Matrix:
    return tuple(
        tuple(F(1) if row == column else F(0) for column in range(size))
        for row in range(size)
    )


def diagonal(values: tuple[F, ...]) -> Matrix:
    return tuple(
        tuple(value if row == column else F(0) for column in range(len(values)))
        for row, value in enumerate(values)
    )


def add(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x + y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x - y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(row[column] for row in matrix) for column in range(len(matrix[0])))


def matmul(left: Matrix, right: Matrix) -> Matrix:
    right_t = transpose(right)
    return tuple(
        tuple(sum((x * y for x, y in zip(row, column)), F(0)) for column in right_t)
        for row in left
    )


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(sum((x * y for x, y in zip(row, vector)), F(0)) for row in matrix)


def vector_add(left: Vector, right: Vector) -> Vector:
    return tuple(x + y for x, y in zip(left, right))


def vector_subtract(left: Vector, right: Vector) -> Vector:
    return tuple(x - y for x, y in zip(left, right))


def harmonic(number: int) -> F:
    return sum((F(1, index) for index in range(1, number + 1)), F(0))


def log_atanh_lower(z_value: F, terms: int) -> F:
    return F(2) * sum(
        (z_value ** (2 * index + 1) / F(2 * index + 1) for index in range(terms)),
        F(0),
    )


def log_atanh_upper(z_value: F, terms: int) -> F:
    partial = log_atanh_lower(z_value, terms)
    first_power = 2 * terms + 1
    remainder = (
        F(2)
        * z_value ** first_power
        / (F(first_power) * (F(1) - z_value * z_value))
    )
    return partial + remainder


class CutoffFreeUniformRadicalGraphTransferTheoremTests(unittest.TestCase):
    def test_frozen_dependency_hashes(self) -> None:
        self.assertEqual(len(FROZEN), 13)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)

    def test_note_hash_is_frozen(self) -> None:
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_phase_inventory_bound_is_exact(self) -> None:
        for odd_p in range(5, 32, 2):
            shannon = odd_p * odd_p
            labels = tuple(range(0, shannon, 2))
            plus = tuple(label for label in labels if label % 4 == 0)
            minus = tuple(label for label in labels if label % 4 == 2)
            self.assertEqual(len(plus) + len(minus), (shannon + 1) // 2)
            lam = F(odd_p, 2)
            self.assertEqual(F(len(labels)), F(2) * lam * lam + F(1, 2))

    def test_two_parity_cauchy_bookkeeping_exactly(self) -> None:
        fixtures = ((1, 1, 1, 1), (2, 5, 7, 3), (11, 4, 9, 16), (19, 23, 5, 29))
        for q_plus, q_minus, d_plus, d_minus in fixtures:
            cross = F(q_plus * d_minus + q_minus * d_plus)
            product = F(q_plus * q_minus * d_plus * d_minus)
            self.assertGreaterEqual(cross * cross, F(4) * product)
            total_bound = F(q_plus + q_minus) * F(d_plus + d_minus)
            diagonal_part = F(q_plus * d_plus + q_minus * d_minus)
            self.assertEqual(total_bound - diagonal_part, cross)

    def test_minus_parity_wrap_costs_at_most_two_variations(self) -> None:
        profiles = (
            (F(1), F(3), F(-2), F(4)),
            (F(-5, 3), F(7, 2), F(1, 4), F(-9, 5), F(2)),
        )
        for profile in profiles:
            reflected = tuple(reversed(profile))
            for sign in (F(1), F(-1)):
                projected = tuple((x + sign * y) / 2 for x, y in zip(profile, reflected))
                interval_variation = sum(
                    (abs(profile[index + 1] - profile[index]) for index in range(len(profile) - 1)),
                    F(0),
                )
                circle_variation = sum(
                    (
                        abs(projected[(index + 1) % len(projected)] - projected[index])
                        for index in range(len(projected))
                    ),
                    F(0),
                )
                self.assertLessEqual(circle_variation, F(2) * interval_variation)

    def test_infinite_cauchy_tail_constant_has_exact_finite_audit(self) -> None:
        outer = 256
        for index in range(2, 65):
            finite_sum = sum(
                (
                    F(1, (1 + abs(source)) * abs(index - source))
                    for source in range(-outer, outer + 1)
                    if source != index
                ),
                F(0),
            )
            # For |source|>outer>=2*index, each orientation is at most
            # 2/source^2, and both tails total at most 4/outer.
            rigorous_upper = finite_sum + F(4, outer)
            # H_(index+1) < 1+log(index+1) < 1+log(index+2).
            rational_lower_for_target = F(32, index + 1) * harmonic(index + 1)
            self.assertLessEqual(rigorous_upper, rational_lower_for_target)

    def test_diagonal_plus_cauchy_graph_decomposition_exactly(self) -> None:
        indices = (-2, -1, 0, 1, 2)
        diagonal_part = diagonal((F(5), F(3), F(2), F(3), F(5)))
        b_values = (F(-2), F(-1), F(0), F(1), F(2))
        b_diagonal = diagonal(b_values)
        hilbert = tuple(
            tuple(F(0) if row == column else F(1, row - column) for column in indices)
            for row in indices
        )
        commutator = subtract(matmul(b_diagonal, hilbert), matmul(hilbert, b_diagonal))
        operator = add(diagonal_part, commutator)
        self.assertEqual(operator, transpose(operator))

        projection = diagonal((F(0), F(1), F(1), F(1), F(0)))
        complement = subtract(identity(5), projection)
        self.assertEqual(
            matmul(matmul(projection, diagonal_part), complement),
            tuple(tuple(F(0) for _ in indices) for _ in indices),
        )

        vector = (F(2), F(-3), F(5), F(7), F(-11))
        full_difference = vector_subtract(
            matvec(operator, vector),
            matvec(matmul(matmul(projection, operator), projection), vector),
        )
        high_output = matvec(matmul(complement, operator), vector)
        reverse_cross = matvec(matmul(matmul(projection, operator), complement), vector)
        self.assertEqual(full_difference, vector_add(high_output, reverse_cross))

    def test_locked_exponent_margin_has_rational_certificate(self) -> None:
        terms = 4
        log_two_lower = log_atanh_lower(F(1, 3), terms)
        log_two_upper = log_atanh_upper(F(1, 3), terms)
        log_three_upper = log_atanh_upper(F(1, 2), terms)
        self.assertGreater(log_two_lower, F(6931, 10000))
        self.assertLess(F(5) * log_two_upper + log_three_upper, F(457, 100))

        margin = F(30) * F(6931, 10000) ** 2 - F(22, 7) * F(457, 100)
        self.assertEqual(margin, F(3413981, 70000000))
        self.assertGreater(margin, F(0))

    def test_note_contract_and_hygiene(self) -> None:
        text = NOTE.read_text(encoding="ascii")
        required = (
            r"Q_{\lambda,N}=P_NQ_\lambda P_N",
            r"A_{\lambda,m}={2\over\sqrt{d_{\rm LS}}}",
            r"64B_bA_{\lambda,m}",
            r"P_ND_a(I-P_N)=0",
            r"\varepsilon_{\lambda,m,N}",
            r"{1\over\sqrt{Nd_{\rm LS}}}",
            r"M_{2400}=4800\log2",
            r"{3413981\over70000000}>0",
            r"\mathcal C_{F_m}",
            r"\log{1\over\gamma_m}",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, text)

        for relative, expected in FROZEN.items():
            self.assertIn(relative, text)
            self.assertIn(expected, text)

        self.assertEqual(text.count(r"\["), text.count(r"\]"))
        self.assertNotIn("\r", text)
        self.assertNotIn("\t", text)
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
        self.assertGreaterEqual(len(displays), 35)
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
