#!/usr/bin/env python3
"""Strict regressions for the natural weighted-projector average target."""

from __future__ import annotations

import ast
from fractions import Fraction as F
from math import factorial
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "NATURAL_CROSSROOT_WEIGHTED_PROJECTOR_AVERAGE_TARGET.md"
NOTE_HASH = "d477178ac4daed6315bdce4bc27b94b073bf0611c87a1f3192b4b5b7147334cf"

FROZEN = {
    "notes/UNCONDITIONAL_NATURAL_HALFGRID_CROSSROOT_SCHEDULE_THEOREM.md":
        "d1b73fc246fcc70886ba78dc074adac585372a2abfc9fbba678c03c4d47e30a5",
    "tests/test_unconditional_natural_halfgrid_crossroot_schedule_theorem.py":
        "00627aa69143c39a468dd06808fe6859beb16aff197127e66a93ff042377f1b9",
    "notes/CROSSROOT_EVEN_SECTOR_PROJECTIVE_ALIGNMENT_REDUCTION_BARRIER.md":
        "0049b692b8cae38eb46734f6113be822a54ee6af8b17ea71d1687fa6a8666833",
    "tests/test_crossroot_even_sector_projective_alignment_reduction_barrier.py":
        "6cc13d0d1bcfc3d68ea67499f804e1d2fa59cb21b2c81fc314e9ddb289ad7754",
    "notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md":
        "ce6863d26788de9fc0fd9e998094fcb7982845ca298ccf8048d0913f62470450",
    "tests/test_natural_cutoff_signed_ground_alignment.py":
        "3ae99e6bbbc0004aa2560a577eca16d6ef0221d28fb2aefc3aef1d9558fae0bb",
    "notes/CANONICAL_GROUND_MIXED_PROJECTOR_OVERLAP.md":
        "f82357e99c54dffc8f11675e2ff32e65375b9a9fbb6480d318c11d3ff51a7730",
    "tests/test_canonical_ground_mixed_projector_overlap.py":
        "65c4efafa252b413e52d06ac915da09ff6fc26c49e022ba8fca9a048b660723e",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left: list[F], right: list[F]) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def norm_squared(vector: list[F]) -> F:
    return dot(vector, vector)


def determinant(matrix: list[list[F]]) -> F:
    size = len(matrix)
    if size == 0:
        return F(1)
    work = [[F(entry) for entry in row] for row in matrix]
    sign = 1
    value = F(1)
    for column in range(size):
        pivot = next(
            (row for row in range(column, size) if work[row][column]),
            None,
        )
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            sign *= -1
        pivot_value = work[column][column]
        value *= pivot_value
        for row in range(column + 1, size):
            if not work[row][column]:
                continue
            ratio = work[row][column] / pivot_value
            for index in range(column + 1, size):
                work[row][index] -= ratio * work[column][index]
    return value if sign > 0 else -value


def poly_mul(left: list[F], right: list[F]) -> list[F]:
    result = [F(0)] * (len(left) + len(right) - 1)
    for i, left_value in enumerate(left):
        for j, right_value in enumerate(right):
            result[i + j] += left_value * right_value
    return result


def diagonal_characteristic(diagonal: list[F]) -> list[F]:
    result = [F(1)]
    for eigenvalue in diagonal:
        result = poly_mul(result, [-eigenvalue, F(1)])
    return result


def diagonal_adjugate_polynomials(diagonal: list[F]) -> list[list[F]]:
    result = []
    for omitted in range(len(diagonal)):
        polynomial = [F(1)]
        for index, eigenvalue in enumerate(diagonal):
            if index != omitted:
                polynomial = poly_mul(polynomial, [-eigenvalue, F(1)])
        result.append(polynomial)
    return result


def derivative_at_zero(polynomial: list[F], order: int) -> F:
    if order >= len(polynomial):
        return F(0)
    return F(factorial(order)) * polynomial[order]


class NaturalCrossrootWeightedProjectorAverageTargetTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_minimal_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 8)
        self.assertEqual(
            sum(relative.startswith("notes/") for relative in FROZEN), 4
        )
        self.assertEqual(
            sum(relative.startswith("tests/") for relative in FROZEN), 4
        )
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        self.assertNotIn(NOTE_HASH, {"DRAFT", "PENDING"})
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_n_equals_m_plus_one_gram_schur_identity(self) -> None:
        e_vector = [F(1), F(0), F(0), F(0)]
        kappa = [F(3, 5), F(4, 5), F(0), F(0)]
        u_vector = [F(2), F(3), F(5), F(7)]
        self.assertEqual(norm_squared(e_vector), 1)
        self.assertEqual(norm_squared(kappa), 1)

        c_value = dot(e_vector, kappa)
        k_value = 1 - c_value**2
        b_value = dot(e_vector, u_vector)
        a_value = dot(kappa, u_vector)
        s_value = norm_squared(u_vector)
        gram = [
            [F(1), c_value, b_value],
            [c_value, F(1), a_value],
            [b_value, a_value, s_value],
        ]
        delta = determinant(gram)
        transverse_squared = u_vector[2] ** 2 + u_vector[3] ** 2
        self.assertEqual(k_value, F(16, 25))
        self.assertEqual(transverse_squared, 74)
        self.assertEqual(delta, k_value * transverse_squared)
        self.assertEqual(delta / k_value, transverse_squared)
        self.assertEqual(
            delta / (k_value * a_value**2),
            transverse_squared / a_value**2,
        )
        self.assertIn(r"\det G_2", self.normalized)
        self.assertIn(r"\Delta_p\over k_p|a_p|^2", self.normalized)

    def test_weighted_gate_pigeonhole_and_vacuity_guard(self) -> None:
        block = 101
        weights = [F(1), F(4), F(9)]
        alignments = [F(1, block), F(2, block), F(3, block)]
        leakage = [
            weight * alignment
            for weight, alignment in zip(weights, alignments)
        ]
        total_weight = sum(weights, F(0))
        total_leakage = sum(leakage, F(0))
        constant = F(3)
        self.assertLessEqual(total_leakage, constant / block * total_weight)
        self.assertTrue(
            any(alignment <= constant / block for alignment in alignments)
        )

        unrestricted = [F(0), F(7), F(9)]
        gate = [False, True, True]
        gated = [value for value, keep in zip(unrestricted, gate) if keep]
        self.assertEqual(min(unrestricted), 0)
        self.assertEqual(min(gated), 7)
        self.assertEqual(sum([], F(0)), F(0))
        self.assertIn(r"{\cal G}_P\ne\varnothing", self.text)
        self.assertIn(r"\sum_{p\in{\cal G}_P}|a_p|^2>0", self.text)
        self.assertIn("vacuous", self.text)

    def test_fixed_logarithmic_loss_has_exact_bridge_rate(self) -> None:
        zeta = F(49, 100)
        log_power = 7

        def logarithm_of_rate(log_p: float) -> float:
            return (
                (log_power + 1) * math.log(log_p)
                + (2.0 * float(zeta) - 1.0) * log_p
            )

        values = [
            logarithm_of_rate(log_p)
            for log_p in (1000.0, 2000.0, 4000.0)
        ]
        self.assertEqual(values, sorted(values, reverse=True))
        self.assertLess(values[-1], -1)
        self.assertLess(2 * zeta - 1, 0)
        self.assertIn(
            r"(\log P)^{B+1}P^{2\zeta-1}\longrightarrow0",
            self.text,
        )
        self.assertIn("`P^(-1+o(1))` is sufficient", self.text)

    def test_multiplicity_two_derivative_cofactor_weight_is_exact(self) -> None:
        diagonal = [F(0), F(0), F(3), F(5)]
        characteristic = diagonal_characteristic(diagonal)
        adjugate_polynomials = diagonal_adjugate_polynomials(diagonal)
        f_second = derivative_at_zero(characteristic, 2)
        j_diagonal = [
            derivative_at_zero(polynomial, 1)
            for polynomial in adjugate_polynomials
        ]
        ordinary_adjugate = [
            derivative_at_zero(polynomial, 0)
            for polynomial in adjugate_polynomials
        ]
        d_value = F(2) / f_second
        self.assertEqual(f_second, 30)
        self.assertEqual(j_diagonal, [15, 15, 0, 0])
        self.assertEqual(ordinary_adjugate, [0, 0, 0, 0])
        self.assertEqual(
            [d_value * value for value in j_diagonal],
            [1, 1, 0, 0],
        )

        eta = [F(1), F(2), F(3), F(4)]
        kappa = [F(3, 5), F(4, 5), F(0), F(0)]
        transverse = [F(-4, 5), F(3, 5), F(0), F(0)]
        j_eta = [
            j_diagonal[index] * eta[index]
            for index in range(len(eta))
        ]
        u_vector = [d_value * value for value in j_eta]
        transverse_cofactor_squared = dot(transverse, j_eta) ** 2
        anchor_cofactor_squared = dot(kappa, j_eta) ** 2
        self.assertEqual(d_value**2 * transverse_cofactor_squared, F(4, 25))
        self.assertEqual(dot(transverse, u_vector) ** 2, F(4, 25))
        self.assertEqual(d_value**2 * anchor_cofactor_squared, F(121, 25))
        self.assertEqual(dot(kappa, u_vector) ** 2, F(121, 25))
        self.assertIn(r"J_p=C_p^{(m_p-1)}(\mu_p)", self.text)
        self.assertIn(r"\omega_p=|d_p|^2", self.text)
        self.assertIn("moving derivative order", self.text)

    def test_simple_branch_inverse_response_and_floor_bound(self) -> None:
        epsilon = F(5, 7)
        outer_gap = F(2)
        kappa = [F(3, 5), F(4, 5), F(0)]
        transverse = [F(-4, 5), F(3, 5), F(0)]
        boundary = [F(0), F(0), F(1)]
        diagonal = [F(0), epsilon, outer_gap]
        action = [
            diagonal[index] * kappa[index]
            for index in range(3)
        ]
        forcing = dot(transverse, action)
        active_floor = sum(
            (
                diagonal[index] * transverse[index] ** 2
                for index in range(3)
            ),
            F(0),
        )
        correction_coefficient = forcing / active_floor
        correction = [
            correction_coefficient * value
            for value in transverse
        ]
        ground = [
            kappa[index] - correction[index]
            for index in range(3)
        ]
        beta = min(active_floor, outer_gap)
        residual = abs(forcing)
        self.assertEqual(forcing, F(12, 25) * epsilon)
        self.assertEqual(active_floor, F(9, 25) * epsilon)
        self.assertEqual(correction_coefficient, F(4, 3))
        self.assertEqual(ground, [F(5, 3), F(0), F(0)])
        self.assertEqual(dot(kappa, ground), 1)
        self.assertEqual(dot(boundary, ground), 0)
        alignment = dot(transverse, ground) ** 2
        self.assertEqual(alignment, F(16, 9))
        self.assertEqual((residual / beta) ** 2, F(16, 9))
        self.assertIn(r"P_{{\cal L}_p}B_{\mu_p}^{-1}b_p", self.text)
        self.assertIn(r"{r_p^2\over\beta_p^2}", self.text)
        self.assertIn("common complete-source", self.text)

    def test_rank_one_lowering_selects_canonical_multiple_ground(self) -> None:
        epsilon = F(3, 11)
        eta = [F(1), F(2), F(0)]
        u_vector = list(eta)
        orthogonal_ground = [F(-2), F(1), F(0)]

        def lowered_action(vector: list[F]) -> list[F]:
            base = [F(0), F(0), F(3) * vector[2]]
            boundary = dot(eta, vector)
            return [
                base[index] - epsilon * eta[index] * boundary
                for index in range(3)
            ]

        self.assertEqual(
            lowered_action(u_vector),
            [-5 * epsilon * value for value in u_vector],
        )
        self.assertEqual(lowered_action(orthogonal_ground), [F(0)] * 3)
        self.assertEqual(-(-5 * epsilon) / epsilon, norm_squared(u_vector))
        self.assertIn(
            r"-\partial_{\epsilon+}\mu_p(0)=\|u_p\|^2",
            self.text,
        )
        self.assertIn("does not prove the orientation estimate", self.text)

    def test_contour_and_large_sieve_are_explicit_nonimplications(self) -> None:
        required = (
            r"P_p={1\over2\pi i}\oint_{\Gamma_p}(zI-A_p)^{-1}",
            "uniform contour distance",
            "shrinking contour",
            r"A_p=A_p^{\rm pole}-A_p^{\rm arch}",
            r"1<n\leq\lambda_p^2",
            r"{\Lambda(n)\over\sqrt n}",
            r"\dim A_p=N_p+1\asymp P",
            "adaptive bottom root `mu_p`",
            "correlations of growing order",
            "coefficients fixed before the prime sum",
            "same complete source",
            "This is a nonimplication",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_claim_boundary_and_fail_closed_requirements(self) -> None:
        required = (
            "does **not** prove the arithmetic average",
            "is not proved below",
            "changes none of the standard eight files",
            "no numerical artifact or zero list",
            "no RH claim",
            "P0_INVALIDATED",
            "gate-restricted high-high estimate",
            "two nonvacuity statements",
            "ordinary adjugate at a multiple lowest root",
            "strict but qualitative",
            "conditional positive zero Gram",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "the weighted estimate is proved",
            "the finite-good set is nonempty unconditionally",
            "the prime large sieve proves (4.6)",
            "strict positivity gives a uniform gap",
            "the determinant convergence is established",
        )
        for token in forbidden:
            self.assertNotIn(token, self.normalized)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb,mathrsfs}\n"
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

    def test_ascii_ast_tex_hash_and_cache_clean(self) -> None:
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
        self.assertNotRegex(self.text, r"(?<!\\)\$\$")
        self.assertNotIn("\\begin{equation}", self.text)
        self.assertNotIn("\\end{equation}", self.text)
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
        for display in displays:
            if r"\begin{aligned}" in display:
                aligned = re.search(
                    r"\\begin\{aligned\}(.*?)\\end\{aligned\}",
                    display,
                    flags=re.S,
                )
                self.assertIsNotNone(aligned)
                self.assertNotIn(r"\tag", aligned.group(1))
        self.assertNotIn("TODO", self.text)
        self.assertNotIn("FIXME", self.text)
        self.assertGreaterEqual(self.text.count(r"\boxed{"), 10)
        cache_entries = [
            path for path in ROOT.rglob("__pycache__") if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
