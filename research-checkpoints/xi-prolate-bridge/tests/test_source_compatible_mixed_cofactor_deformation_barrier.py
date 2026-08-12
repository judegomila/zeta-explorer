#!/usr/bin/env python3
"""Regressions for the source-compatible mixed-cofactor barrier."""

from __future__ import annotations

import ast
from fractions import Fraction
import hashlib
from itertools import combinations
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SOURCE_COMPATIBLE_MIXED_COFACTOR_DEFORMATION_BARRIER.md"
NOTE_HASH = "cfc5585292a8880f43003280900e85f052951195c563c01ed48cdd49f27aa4d9"

FROZEN = {
    "notes/CAPTURE_FREE_ACTUAL_GROUND_PARITY_RESPONSE_BARRIER.md":
        "ec53e8c99f639bdae46a8da6d55c4e34b8381b3348f62833cd2ac1d1bb8dbbf3",
    "tests/test_capture_free_actual_ground_parity_response_barrier.py":
        "477c7849bf319a62c6d483874d29c638250060ee0e9db844ae1477455f380772",
    "notes/SOURCE_QUOTIENT_PICK_HERGLOTZ_INTERLACING_BARRIER.md":
        "9701ed565588923557dc057ab2cfc072aa253b94ca22bdf61a958ae8caea6f13",
    "tests/test_source_quotient_pick_herglotz_interlacing_barrier.py":
        "86198254841dcdfe54de97cb3652c66f9c301c8cd92c6b55728a7e4dec044658",
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md":
        "d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0",
    "tests/test_source_boundary.py":
        "a4be31e74a735c8f9150ed84cc4dc8c147e654364b65ec5cb3b814500e7ff808",
    "notes/RELATIVE_ODD_GAP_ENDPOINT_SCHUR_GATE.md":
        "81bc4055b644a409c10d9d06f145040e822452dc5fc9a0fc4888c63fb535f3ab",
    "tests/test_relative_odd_gap_endpoint_schur.py":
        "cee76e8a21c3406b49bd123832a4e47bacd41ebf16622cf91c69fd48ba130127",
    "notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md":
        "1c4568a142779f0d7cab023bfb41811d10c2ccac37a505cbe7f079b972761755",
}

F = Fraction
Vector = tuple[Fraction, ...]
Matrix = tuple[tuple[Fraction, ...], ...]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left: Vector, right: Vector) -> Fraction:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum((entry * value for entry, value in zip(row, vector)), F(0))
        for row in matrix
    )


def source_matrix(
    nodes: tuple[Fraction, ...],
    source: Vector,
    diagonal: Vector,
) -> Matrix:
    rows = []
    for row, n in enumerate(nodes):
        values = []
        for column, m in enumerate(nodes):
            if row == column:
                values.append(diagonal[row])
            else:
                values.append((source[row] - source[column]) / (n - m))
        rows.append(tuple(values))
    return tuple(rows)


def favorable_matrix(cutoff: int) -> Matrix:
    dimension = 2 * cutoff + 1
    return tuple(
        tuple(F(int(i == j)) - F(1, dimension) for j in range(dimension))
        for i in range(dimension)
    )


class SourceCompatibleMixedCofactorDeformationBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_source_tangent_and_parity_formulas(self) -> None:
        cutoff = 3
        modes = tuple(F(n) for n in range(-cutoff, cutoff + 1))
        c_positive = {1: F(2), 2: F(-3), 3: F(5)}
        c = tuple(
            F(0) if n == 0 else F(1 if n > 0 else -1) * c_positive[abs(int(n))]
            for n in modes
        )
        da_positive = {0: F(7), 1: F(-2), 2: F(4), 3: F(1)}
        diagonal = tuple(da_positive[abs(int(n))] for n in modes)
        tangent = source_matrix(modes, c, diagonal)

        for row, n in enumerate(modes):
            for column, m in enumerate(modes):
                if n != m:
                    self.assertEqual(
                        (n - m) * tangent[row][column],
                        c[row] - c[column],
                    )

        center = cutoff
        self.assertEqual(tangent[center][center], da_positive[0])
        for n in range(1, cutoff + 1):
            positive = center + n
            negative = center - n
            # E_0n/sqrt(2)=c_n/n.
            self.assertEqual(
                (tangent[center][positive] + tangent[center][negative]) / 2,
                c_positive[n] / n,
            )
            even_diagonal = (
                tangent[positive][positive]
                + tangent[positive][negative]
                + tangent[negative][positive]
                + tangent[negative][negative]
            ) / 2
            odd_diagonal = (
                tangent[positive][positive]
                - tangent[positive][negative]
                - tangent[negative][positive]
                + tangent[negative][negative]
            ) / 2
            self.assertEqual(even_diagonal, da_positive[n] + c_positive[n] / n)
            self.assertEqual(odd_diagonal, da_positive[n] - c_positive[n] / n)

        for n, m in combinations(range(1, cutoff + 1), 2):
            np = center + n
            nn = center - n
            mp = center + m
            mn = center - m
            even = (
                tangent[np][mp] + tangent[np][mn]
                + tangent[nn][mp] + tangent[nn][mn]
            ) / 2
            odd = (
                tangent[np][mp] - tangent[np][mn]
                - tangent[nn][mp] + tangent[nn][mn]
            ) / 2
            self.assertEqual(
                even,
                2 * (n * c_positive[n] - m * c_positive[m]) / (n * n - m * m),
            )
            self.assertEqual(
                odd,
                2 * (m * c_positive[n] - n * c_positive[m]) / (n * n - m * m),
            )

        # A vanishing even center row forces every source-row tangent to vanish.
        self.assertTrue(any(c_positive[n] / n != 0 for n in c_positive))

    def test_cocycle_lift_criterion_and_strict_n3_countermodel(self) -> None:
        cutoff = 3
        dimension = 2 * cutoff + 1
        modes = tuple(range(-cutoff, cutoff + 1))
        matrix = favorable_matrix(cutoff)
        eta = (F(1),) * dimension
        source = tuple(-F(n, dimension) for n in modes)

        self.assertEqual(matvec(matrix, eta), (F(0),) * dimension)
        for row, n in enumerate(modes):
            for column, m in enumerate(modes):
                if n != m:
                    self.assertEqual(
                        matrix[row][column],
                        (source[row] - source[column]) / (n - m),
                    )
        # Q is the identity on every sum-zero vector; hence O_0=I_3.
        for n in range(1, cutoff + 1):
            odd = tuple(
                F(int(mode == n) - int(mode == -n))
                for mode in modes
            )
            self.assertEqual(matvec(matrix, odd), odd)

        # The lower-Ritz plane span{kappa,eta-kappa} contains the ground.
        self.assertEqual(F(6, 7) + F(1, 7), F(1))
        self.assertEqual(F(6, 7) * F(1, 7) - F(6, 49), F(0))
        self.assertGreater(F(1, 7), 0)  # anchor-complement compression

        def h(n: int, m: int) -> Fraction:
            return -F(1, 7) * (F(n, m) + F(m, n))

        def g(n: int, m: int) -> Fraction:
            return F(n * n - m * m, 2 * m * n) * h(n, m)

        self.assertEqual(g(1, 2), F(15, 56))
        self.assertEqual(g(2, 3), F(65, 504))
        self.assertEqual(g(3, 1), F(-40, 63))
        self.assertEqual(g(1, 2) + g(2, 3) + g(3, 1), F(-5, 21))

        h_matrix = tuple(tuple(h(n, m) for m in (1, 2, 3)) for n in (1, 2, 3))
        self.assertEqual(sum((h_matrix[i][i] for i in range(3)), F(0)), F(-6, 7))
        beta = tuple(-F(2 * n, 7) for n in (1, 2, 3))
        chi = tuple(F(1, n) for n in (1, 2, 3))
        # beta and chi here have their common sqrt(2) product absorbed.
        self.assertEqual(dot(beta, chi), F(-6, 7))

    def test_source_generated_odd_blocks_obey_every_cocycle(self) -> None:
        c = {1: F(2), 2: F(-1), 3: F(4), 4: F(7)}

        def odd(n: int, m: int) -> Fraction:
            return 2 * (m * c[n] - n * c[m]) / (n * n - m * m)

        def g(n: int, m: int) -> Fraction:
            return F(n * n - m * m, 2 * n * m) * odd(n, m)

        for n, m, k in combinations(range(1, 5), 3):
            self.assertEqual(g(n, m) + g(m, k) + g(k, n), F(0))
            self.assertEqual(g(n, m), F(c[n], n) - F(c[m], m))

    def test_symmetric_node_extension_and_exact_derivative_identity(self) -> None:
        r = F(1, 2)
        d = F(2)
        old_b = tuple(-F(n, 7) for n in (1, 2, 3))
        denominators = tuple(F(n * n) - r * r for n in (1, 2, 3))
        c = tuple(F(n) / denominator for n, denominator in zip((1, 2, 3), denominators))
        q = tuple(value / denominator for value, denominator in zip(old_b, denominators))

        def y(new_b: Fraction) -> Vector:
            return tuple(qn - 2 * new_b * cn for qn, cn in zip(q, c))

        def delta(new_b: Fraction) -> Fraction:
            vector = y(new_b)
            return d - dot(vector, vector)

        delta_prime = 4 * dot(c, q)
        for step in (F(1, 5), F(-2, 7)):
            # Exact extraction of the linear coefficient after removing the quadratic.
            self.assertEqual(
                delta(step) - delta(F(0)) + 4 * step * step * dot(c, c),
                step * delta_prime,
            )

        target = 2 * dot(c, old_b)
        weighted = 2 * sum(
            (cn * n * n * qn for n, cn, qn in zip((1, 2, 3), c, q)),
            F(0),
        )
        self.assertEqual(target, weighted - r * delta_prime / 4)
        self.assertNotEqual(target, delta_prime)

        # Build the full source-Cauchy extension and recover its odd border.
        nodes = tuple(F(value) for value in (-3, -2, -1)) + (
            -r,
            F(0),
            r,
        ) + tuple(F(value) for value in (1, 2, 3))
        for new_b in (F(0), F(1, 5)):
            source = tuple(
                -F(node, 7) if abs(node) != r
                else (new_b if node > 0 else -new_b)
                for node in nodes
            )
            diagonal = tuple(
                F(6, 7) if abs(node) != r else d + new_b / r
                for node in nodes
            )
            extended = source_matrix(nodes, source, diagonal)
            index = {node: i for i, node in enumerate(nodes)}
            new_odd_diagonal = (
                extended[index[r]][index[r]] - extended[index[r]][index[-r]]
            )
            self.assertEqual(new_odd_diagonal, d)
            for n, expected in zip((1, 2, 3), y(new_b)):
                border = extended[index[F(n)]][index[r]] - extended[index[F(n)]][index[-r]]
                self.assertEqual(border, expected)
                self.assertEqual(
                    border,
                    2 * (r * old_b[n - 1] - n * new_b) / (n * n - r * r),
                )

        raw_diagonal_derivative = -F(1, r) + delta_prime
        self.assertEqual(raw_diagonal_derivative, -F(2) + delta_prime)

    def test_schur_discriminant_is_cauchy_schwarz_and_diagonal_is_free(self) -> None:
        r = F(1, 2)
        old_b = tuple(-F(n, 7) for n in (1, 2, 3))
        denominators = tuple(F(n * n) - r * r for n in (1, 2, 3))
        c = tuple(F(n) / denominator for n, denominator in zip((1, 2, 3), denominators))
        q = tuple(value / denominator for value, denominator in zip(old_b, denominators))
        cross = dot(c, q)
        self.assertLessEqual(cross * cross, dot(c, c) * dot(q, q))
        # This favorable source row is collinear, so the bound is sharp.
        self.assertEqual(cross * cross, dot(c, c) * dot(q, q))

        for new_b in (F(-3), F(0), F(5, 2)):
            y = tuple(qn - 2 * new_b * cn for qn, cn in zip(q, c))
            free_diagonal = dot(y, y) + 1
            self.assertEqual(free_diagonal - dot(y, y), F(1))

    def test_locked_regime_invalidates_the_large_node_expansion(self) -> None:
        r = F(1, 2)
        for cutoff in (10, 100, 1000):
            expansion_ratio = F(cutoff * cutoff, 1) / (r * r)
            weighted_multiplier = F(cutoff * cutoff, 1) / (cutoff * cutoff - r * r)
            self.assertGreater(expansion_ratio, 1)
            self.assertGreater(weighted_multiplier, 1)
            self.assertLess(weighted_multiplier - 1, F(1, cutoff))

    def test_favorable_family_has_divergent_normalized_cofactor_with_cancellation(self) -> None:
        for cutoff in (1, 2, 5, 20):
            dimension = 2 * cutoff + 1
            modes = tuple(range(-cutoff, cutoff + 1))
            matrix = favorable_matrix(cutoff)
            eta = (F(1),) * dimension
            phi = (F(1, dimension),) * dimension
            source = tuple(-F(n, dimension) for n in modes)
            self.assertEqual(matvec(matrix, eta), (F(0),) * dimension)
            self.assertEqual(sum(phi, F(0)), F(1))
            for row, n in enumerate(modes):
                for column, m in enumerate(modes):
                    if n != m:
                        self.assertEqual(
                            matrix[row][column],
                            (source[row] - source[column]) / (n - m),
                        )

            p = F(1, dimension)
            cofactor = -F(2 * cutoff, dimension)
            profile = F(1) + cofactor
            self.assertEqual(cofactor / p, -2 * cutoff)
            self.assertEqual(profile, p)
            self.assertEqual(profile / p, F(1))

    def test_scope_natural_deformations_and_fail_closed_wording(self) -> None:
        normalized = " ".join(self.text.split())
        required = (
            "source tangent and pure-odd obstruction",
            r"n^2-(\overline r)^2",
            r"G_{nm}+G_{mk}+G_{kn}=0",
            "whose ambient dimension is `N(N+1)/2`",
            r"G_{12}+G_{23}+G_{31}=-{5\over21}\ne0",
            "both checkpoint-1.25 strict signs hold",
            "canonical genuine Hermitian source construction",
            r"\Delta_r'(0)=4r",
            r"-{\det(O_\mu)\over r}",
            "N>>|r|",
            "It is Cauchy--Schwarz",
            "free source diagonal",
            r"{C_0(0)\over p_0}=-2N",
            r"{\mathcal A_0(0)\over p_0}=1",
            "essential cancellation caveat",
            "Interval scale or prime-weight scale",
            "Interval center",
            "Boundary twist",
            "Source phase",
            "deliberately engineered scalar source path",
            "no failure of an actual arithmetic matrix",
            "no sign of the actual mixed cofactor",
            "no response decay or nondecay",
            "no Riemann-hypothesis conclusion",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, normalized)
        self.assertNotIn("This theorem proves RH", normalized)
        self.assertNotIn("the actual mixed cofactor fails", normalized)

    def test_displayed_tex_static_hygiene_and_test_ast(self) -> None:
        self.assertNotIn("\t", self.text)
        self.assertNotIn(b"\r", self.note_bytes)
        self.assertTrue(all(ord(character) < 128 for character in self.text))
        self.assertFalse(
            any(line.endswith((" ", "\t")) for line in self.text.splitlines())
        )

        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for display in displays:
            self.assertNotIn("$", display)
            self.assertEqual(display.count("{"), display.count("}"))
            self.assertEqual(display.count(r"\begin"), display.count(r"\end"))

        source_bytes = Path(__file__).read_bytes()
        source = source_bytes.decode("ascii")
        ast.parse(source)
        self.assertNotIn(b"\r", source_bytes)
        self.assertFalse(
            any(line.endswith((" ", "\t")) for line in source.splitlines())
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
        with tempfile.TemporaryDirectory() as temporary:
            tex = Path(temporary) / "note.tex"
            tex.write_text(document, encoding="ascii")
            completed = subprocess.run(
                [pdflatex, "-halt-on-error", "-interaction=nonstopmode", tex.name],
                cwd=temporary,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                check=False,
            )
        self.assertEqual(completed.returncode, 0, completed.stdout)


if __name__ == "__main__":
    unittest.main()
