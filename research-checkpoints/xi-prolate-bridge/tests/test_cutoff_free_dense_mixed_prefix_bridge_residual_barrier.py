#!/usr/bin/env python3
"""Exact regressions for the dense mixed-prefix bridge residual barrier."""

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
NOTE = ROOT / "notes" / "CUTOFF_FREE_DENSE_MIXED_PREFIX_BRIDGE_RESIDUAL_BARRIER.md"
NOTE_HASH = "909380b93eb72cffd3841a592f96aa0cd1d72285f799210bf4244cdf82c2ed0f"

FROZEN = {
    "notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md":
        "c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c",
    "tests/test_cutoff_free_weighted_radical_coframe_reduction_barrier.py":
        "d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11",
    "notes/CUTOFF_FREE_UNIFORM_RADICAL_GRAPH_TRANSFER_THEOREM.md":
        "aa69ac86e6b5d5256ba3b243b9fc07d9c5ad49bed7a70e3d570d0c57325bce18",
    "tests/test_cutoff_free_uniform_radical_graph_transfer_theorem.py":
        "b2708c8f72ce8bad831b2aea44c49ef3a8ec5f9c38551c288a1c982d097ee727",
    "notes/EFFECTIVE_MIXED_PREFIX_SCHEDULE_ATTACK.md":
        "a33e7a072057f1444afb9d00911465f599fec508d0a6488e655638947cc515ba",
    "notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md":
        "335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb",
    "tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py":
        "0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc",
    "notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md":
        "43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2",
    "tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py":
        "95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a",
    "notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md":
        "04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83",
    "tests/test_fixed_source_block_shift_asymptotic_theorem.py":
        "433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
}


Matrix = tuple[tuple[F, ...], ...]
Vector = tuple[F, ...]


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
            sum((x * y for x, y in zip(row, column)), F(0))
            for column in right_t
        )
        for row in left
    )


def diagonal(values: tuple[F, ...]) -> Matrix:
    return tuple(
        tuple(value if row == column else F(0) for column in range(len(values)))
        for row, value in enumerate(values)
    )


def rank(matrix: Matrix) -> int:
    work = [list(row) for row in matrix]
    rows = len(work)
    columns = len(work[0]) if rows else 0
    pivot_row = 0
    for column in range(columns):
        pivot = next(
            (row for row in range(pivot_row, rows) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        scale = work[pivot_row][column]
        work[pivot_row] = [entry / scale for entry in work[pivot_row]]
        for row in range(rows):
            if row == pivot_row:
                continue
            multiple = work[row][column]
            if multiple != 0:
                work[row] = [
                    entry - multiple * pivot_entry
                    for entry, pivot_entry in zip(work[row], work[pivot_row])
                ]
        pivot_row += 1
        if pivot_row == rows:
            break
    return pivot_row


def gram(columns: Matrix, weights: tuple[F, ...] | None = None) -> Matrix:
    if weights is None:
        weights = tuple(F(1) for _ in columns)
    return matmul(transpose(columns), matmul(diagonal(weights), columns))


class CutoffFreeDenseMixedPrefixBridgeResidualBarrierTests(unittest.TestCase):
    def test_frozen_dependency_hashes(self) -> None:
        self.assertEqual(len(FROZEN), 12)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)

    def test_note_hash_is_frozen(self) -> None:
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_corrected_all_even_columns_are_exact_zero_integral_hyperplane(self) -> None:
        integrals = (F(7), F(-3), F(5, 2), F(11, 3), F(-13, 4), F(17, 5))
        size = len(integrals) - 1
        columns = tuple(
            tuple(
                (-integrals[column + 1] / integrals[0] if row == 0 else
                 F(1) if row == column + 1 else F(0))
                for column in range(size)
            )
            for row in range(size + 1)
        )
        self.assertEqual(rank(columns), size)
        for column in transpose(columns):
            self.assertEqual(
                sum((value * coefficient for value, coefficient in zip(integrals, column)), F(0)),
                F(0),
            )
        self.assertEqual(rank((integrals,)), 1)
        self.assertEqual(rank(columns) + rank((integrals,)), size + 1)
        self.assertEqual(2 * rank(columns), 2 * size)

    def test_separated_source_and_modal_grams_are_exact(self) -> None:
        u = (F(2, 3), F(-1, 5))
        beta = F(3, 7)
        a = (F(5, 4), F(-2, 9))
        # Raw row order: h4, h8, h0, h2, h6, h10.
        columns = (
            (F(1), F(0), F(0), F(0), F(0)),
            (F(0), F(1), F(0), F(0), F(0)),
            (-u[0], -u[1], -beta, F(0), F(0)),
            (F(0), F(0), F(1), a[0], a[1]),
            (F(0), F(0), F(0), F(-1), F(0)),
            (F(0), F(0), F(0), F(0), F(-1)),
        )
        source = gram(columns)
        expected_source = (
            (F(1) + u[0] ** 2, u[0] * u[1], beta * u[0], F(0), F(0)),
            (u[0] * u[1], F(1) + u[1] ** 2, beta * u[1], F(0), F(0)),
            (beta * u[0], beta * u[1], F(1) + beta ** 2, a[0], a[1]),
            (F(0), F(0), a[0], F(1) + a[0] ** 2, a[0] * a[1]),
            (F(0), F(0), a[1], a[0] * a[1], F(1) + a[1] ** 2),
        )
        self.assertEqual(source, expected_source)

        d4, d8, d0, d2, d6, d10 = (
            F(2, 11), F(3, 13), F(1, 17), F(5, 19), F(7, 23), F(11, 29)
        )
        modal = gram(columns, (d4, d8, d0, d2, d6, d10))
        expected_modal = (
            (d4 + d0 * u[0] ** 2, d0 * u[0] * u[1], d0 * beta * u[0], F(0), F(0)),
            (d0 * u[0] * u[1], d8 + d0 * u[1] ** 2, d0 * beta * u[1], F(0), F(0)),
            (d0 * beta * u[0], d0 * beta * u[1], d2 + d0 * beta ** 2, d2 * a[0], d2 * a[1]),
            (F(0), F(0), d2 * a[0], d6 + d2 * a[0] ** 2, d2 * a[0] * a[1]),
            (F(0), F(0), d2 * a[1], d2 * a[0] * a[1], d10 + d2 * a[1] ** 2),
        )
        self.assertEqual(modal, expected_modal)
        self.assertNotEqual(modal[0][2], F(0))
        self.assertNotEqual(modal[2][3], F(0))

    def test_triangular_residue_bridge_change_preserves_both_grams(self) -> None:
        a1, a2 = F(5, 4), F(-2, 9)
        # Separated order is p1,p2,b,m1,m2.  Ordinary order is b,p1,c6,p2,c10.
        shear = (
            (F(0), F(1), F(0), F(0), F(0)),
            (F(0), F(0), F(0), F(1), F(0)),
            (F(1), F(0), a1, F(0), a2),
            (F(0), F(0), F(-1), F(0), F(0)),
            (F(0), F(0), F(0), F(0), F(-1)),
        )
        self.assertEqual(rank(shear), 5)
        separated_source = (
            (F(3), F(1), F(2), F(0), F(0)),
            (F(1), F(4), F(-1), F(0), F(0)),
            (F(2), F(-1), F(7), a1, a2),
            (F(0), F(0), a1, F(5), F(2)),
            (F(0), F(0), a2, F(2), F(6)),
        )
        separated_modal = (
            (F(11), F(2), F(3), F(0), F(0)),
            (F(2), F(13), F(-2), F(0), F(0)),
            (F(3), F(-2), F(17), F(5), F(-4)),
            (F(0), F(0), F(5), F(19), F(7)),
            (F(0), F(0), F(-4), F(7), F(23)),
        )
        for separated in (separated_source, separated_modal):
            ordinary = matmul(transpose(shear), matmul(separated, shear))
            self.assertEqual(ordinary, transpose(ordinary))
            self.assertEqual(rank(ordinary), rank(separated))

    def test_hard_mixed_inventory_has_two_complete_copies(self) -> None:
        for odd_p in range(5, 40, 2):
            shannon = odd_p * odd_p
            maximal_m = (shannon - 1) // 2
            raw_per_copy = maximal_m + 1
            self.assertEqual(2 * maximal_m, shannon - 1)
            self.assertEqual(2 * raw_per_copy, shannon + 1)
            for mixed_m in range(1, maximal_m + 1):
                self.assertLessEqual(2 * (mixed_m + 1), shannon + 1)

    def test_parity_difference_forces_one_physical_self(self) -> None:
        fixtures = (
            (F(7), F(2)),
            (F(-3), F(-11)),
            (F(5, 7), F(-13, 9)),
            (F(-17, 4), F(-19, 3)),
        )
        for plus, minus in fixtures:
            coherent = plus - minus
            self.assertGreaterEqual(max(abs(plus), abs(minus)), abs(coherent) / 2)

    def test_modal_and_augmented_exponents_are_exact(self) -> None:
        # Store (polynomial power of lambda, exponential power of pi*lambda^2).
        residual = (F(-2), F(0))
        d_two = (F(5), F(-4))
        modal_constant = (
            residual[0] - d_two[0] / 2,
            residual[1] - d_two[1] / 2,
        )
        self.assertEqual(modal_constant, (F(-9, 2), F(2)))

        augmented_defect = F(-1)
        augmented_constant = residual[0] - augmented_defect / 2
        self.assertEqual(augmented_constant, F(-3, 2))
        scalar_ratio_power = 2 * augmented_constant + F(4) + augmented_defect
        self.assertEqual(scalar_ratio_power, F(0))

    def test_two_row_augmented_form_is_block_diagonal_rank_two(self) -> None:
        ell_plus = (F(2), F(-3), F(5), F(0), F(0), F(0))
        ell_minus = (F(0), F(0), F(0), F(7), F(11), F(-13))
        weight = F(7, 11)
        two_row_gram = tuple(
            tuple(
                weight * (ell_plus[row] * ell_plus[column]
                          + ell_minus[row] * ell_minus[column])
                for column in range(6)
            )
            for row in range(6)
        )
        self.assertEqual(rank(two_row_gram), 2)
        self.assertNotEqual(two_row_gram[0][1], F(0))
        self.assertNotEqual(two_row_gram[3][4], F(0))
        for plus_index in range(3):
            for minus_index in range(3, 6):
                self.assertEqual(two_row_gram[plus_index][minus_index], F(0))
                self.assertEqual(two_row_gram[minus_index][plus_index], F(0))

        vector = (F(3), F(2), F(0), F(11), F(-7), F(0))
        evaluation_plus = sum((x * y for x, y in zip(ell_plus, vector)), F(0))
        evaluation_minus = sum((x * y for x, y in zip(ell_minus, vector)), F(0))
        energy = sum(
            (
                vector[row] * two_row_gram[row][column] * vector[column]
                for row in range(6)
                for column in range(6)
            ),
            F(0),
        )
        self.assertEqual(evaluation_plus, F(0))
        self.assertEqual(evaluation_minus, F(0))
        self.assertEqual(
            energy,
            weight * (evaluation_plus * evaluation_plus
                      + evaluation_minus * evaluation_minus),
        )
        diagonal_only = sum(
            (
                vector[index] ** 2 * two_row_gram[index][index]
                for index in range(6)
            ),
            F(0),
        )
        self.assertGreater(diagonal_only, F(0))

    def test_gamma_max_defect_ratio_cannot_vanish(self) -> None:
        for lam in (F(5, 2), F(7, 2), F(11, 2), F(101, 2)):
            c_squared = lam ** F(-3)
            max_defect = lam ** F(-1)
            for gamma in (F(1), F(3, 4), F(1, 9)):
                ratio = F(8) * c_squared * lam ** 4 * max_defect / gamma
                self.assertEqual(ratio, F(8) / gamma)
                self.assertGreaterEqual(ratio, F(8))

    def test_locked_exponent_margin_has_rational_certificate(self) -> None:
        margin = F(30) * F(6931, 10000) ** 2 - F(22, 7) * F(457, 100)
        self.assertEqual(margin, F(3413981, 70000000))
        self.assertGreater(margin, F(0))

    def test_note_contract_and_hygiene(self) -> None:
        text = NOTE.read_text(encoding="ascii")
        required = (
            r"L=2\log\lambda",
            "logarithmic length of\n`[lambda^(-1),lambda]`",
            r"F_M^{\rm mix}=\operatorname {span}(c_2,c_4,\ldots,c_{2M})",
            r"\mathfrak F_M^{\rm mix}=F_M^{\rm mix}\oplus F_M^{\rm mix}",
            r"c_{4j+2}=-m_j+a_jb",
            r"d_0\beta u",
            r"d_2a^*",
            r"q_M^{\rm mix}=2(M+1)\leq S+1",
            r"\sum_{\substack{0\leq n\leq2M\\ n\ \mathrm{even}}}",
            r"A_{\lambda,M}^{\rm mix}",
            r"M_{2400}=4800\log2",
            r"{3413981\over70000000}>0",
            r"c\lambda^{-9/2}e^{2\pi\lambda^2}",
            r"\ell_{0,M}:\mathfrak F_M^{\rm mix}\longrightarrow\mathbb C^2",
            r"\ell_{0,M,+}^*\ell_{0,M,+}",
            r"\oplus\ell_{0,M,-}^*\ell_{0,M,-}",
            "generically\nrank two",
            "There is no\nplus/minus source cross",
            r"((\Delta_M^{\rm aug})^\dagger)^{1/2}",
            r"{c\over\gamma_M}\geq c",
            r"\Lambda_M^{\rm aug}",
            "It is not a polynomial",
            "no statement about the Riemann hypothesis",
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
        self.assertNotIn("P0_VERIFIED", text)
        self.assertNotIn(r"L=4\log(2\lambda)", text)
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))

        for path in (NOTE, Path(__file__)):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertNotIn(b"\r", payload)
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        text = NOTE.read_text(encoding="ascii")
        displays = re.findall(r"\\\[(.*?)\\\]", text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
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
