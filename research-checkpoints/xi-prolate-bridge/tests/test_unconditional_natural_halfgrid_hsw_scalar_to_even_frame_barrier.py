#!/usr/bin/env python3
"""Strict regressions for the natural-halfgrid HSW scalar/frame barrier."""

from __future__ import annotations

import ast
import cmath
from fractions import Fraction as F
import hashlib
import math
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
    / "UNCONDITIONAL_NATURAL_HALFGRID_HSW_SCALAR_TO_EVEN_FRAME_BARRIER.md"
)
NOTE_HASH = "4d6036eb24abed92857cca6a169613827e479834eeb980868d09e57207629613"

FROZEN = {
    "notes/UNCONDITIONAL_NATURAL_HALFGRID_CROSSROOT_SCHEDULE_THEOREM.md":
        "d1b73fc246fcc70886ba78dc074adac585372a2abfc9fbba678c03c4d47e30a5",
    "tests/test_unconditional_natural_halfgrid_crossroot_schedule_theorem.py":
        "00627aa69143c39a468dd06808fe6859beb16aff197127e66a93ff042377f1b9",
    "notes/NATURAL_CROSSROOT_WEIGHTED_PROJECTOR_AVERAGE_TARGET.md":
        "d477178ac4daed6315bdce4bc27b94b073bf0611c87a1f3192b4b5b7147334cf",
    "tests/test_natural_crossroot_weighted_projector_average_target.py":
        "36a70f9de303fe49ac60dfd1285542486615f696dfd66566fe73158eeba9a390",
    "notes/GROWING_SIGNED_DISCREPANCY_CENTERED_ZERO_KREIN_FACTORIZATION_BARRIER.md":
        "0257bb5582700fada40fc2a6c6ba578a09fad94e11eb4fa0f72a525c80bd04c9",
    "tests/test_growing_signed_discrepancy_centered_zero_krein_factorization_barrier.py":
        "b34f647f320e2e19b614ced03959d152895f6d91a864e4717e43accc7546f533",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def outer(vector: list[float]) -> list[list[float]]:
    return [[left * right for right in vector] for left in vector]


def add_matrix(
    left: list[list[float]], right: list[list[float]]
) -> list[list[float]]:
    return [
        [x_value + y_value for x_value, y_value in zip(x_row, y_row)]
        for x_row, y_row in zip(left, right)
    ]


def scale_matrix(
    scalar: float, matrix: list[list[float]]
) -> list[list[float]]:
    return [[scalar * value for value in row] for row in matrix]


def max_matrix_difference(
    left: list[list[float]], right: list[list[float]]
) -> float:
    return max(
        abs(x_value - y_value)
        for x_row, y_row in zip(left, right)
        for x_value, y_value in zip(x_row, y_row)
    )


def dot(left: list[F], right: list[F]) -> F:
    return sum((x_value * y_value for x_value, y_value in zip(left, right)), F(0))


class UnconditionalNaturalHalfgridHSWScalarToEvenFrameBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_minimal_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 6)
        self.assertEqual(
            sum(relative.startswith("notes/") for relative in FROZEN), 3
        )
        self.assertEqual(
            sum(relative.startswith("tests/") for relative in FROZEN), 3
        )
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        self.assertNotIn(NOTE_HASH, {"DRAFT", "PENDING"})
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_even_row_and_scalar_covariance_factor_are_exact(self) -> None:
        length = 2.0 * math.pi
        size = 3
        ordinates = (0.37, 1.41, 2.73)
        multiplicities = (2, 1, 3)
        gram = [[0.0 for _ in range(size + 1)] for _ in range(size + 1)]
        covariance_sum = [
            [0.0 for _ in range(size + 1)] for _ in range(size + 1)
        ]
        w_value = 0.0

        for gamma, multiplicity in zip(ordinates, multiplicities):
            sine = math.sin(gamma * length / 2.0)
            row = [2.0 * sine / (math.sqrt(length) * gamma)]
            r_vector = [1.0]
            for index in range(1, size + 1):
                denominator = gamma * gamma - index * index
                row.append(
                    2.0
                    * math.sqrt(2.0 / length)
                    * gamma
                    * sine
                    / denominator
                )
                r_vector.append(
                    math.sqrt(2.0) * gamma * gamma / denominator
                )
            weight = multiplicity * sine * sine / (gamma * gamma)
            w_value += weight
            gram = add_matrix(
                gram, scale_matrix(2.0 * multiplicity, outer(row))
            )
            covariance_sum = add_matrix(
                covariance_sum, scale_matrix(weight, outer(r_vector))
            )

        covariance = scale_matrix(1.0 / w_value, covariance_sum)
        reconstructed = scale_matrix(8.0 * w_value / length, covariance)
        self.assertLess(max_matrix_difference(gram, reconstructed), 1e-12)
        self.assertAlmostEqual(covariance[0][0], 1.0, places=13)
        self.assertAlmostEqual(gram[0][0], 8.0 * w_value / length, places=13)
        self.assertIn(r"G_T^+={8W_T\over L}\,\mathcal C_T", self.text)
        self.assertIn(r"(\mathcal C_T)_{00}=1", self.text)

    def test_carrier_limit_is_retained_before_normalization(self) -> None:
        length = 2.0 * math.pi
        carrier_index = 2
        carrier = float(carrier_index)
        multiplicity = 3.0

        def combined_diagonal(gamma: float) -> float:
            sine = math.sin(gamma * length / 2.0)
            denominator = gamma * gamma - carrier * carrier
            weight = multiplicity * sine * sine / (gamma * gamma)
            r_coordinate = math.sqrt(2.0) * gamma * gamma / denominator
            return 8.0 / length * weight * r_coordinate * r_coordinate

        values = [
            combined_diagonal(carrier + epsilon)
            for epsilon in (1e-3, 5e-4, 2.5e-4)
        ]
        expected = multiplicity * length
        self.assertLess(abs(values[-1] - expected), 0.02)
        self.assertLess(abs(values[-1] - expected), abs(values[0] - expected))
        row_limit = (-1) ** carrier_index * math.sqrt(length / 2.0)
        self.assertAlmostEqual(2.0 * multiplicity * row_limit**2, expected)
        self.assertIn("whole matrix summand", self.normalized)
        self.assertIn("It would be incorrect to delete it", self.normalized)

    def test_rvm_shell_and_carrier_count_constants(self) -> None:
        def main(height: float) -> float:
            return height / (2.0 * math.pi) * math.log(
                height / (2.0 * math.pi * math.e)
            )

        height = 1.0e8
        direct = main(2.0 * height) - main(height)
        formula = height / (2.0 * math.pi) * (
            math.log(height) + math.log(2.0 / math.pi) - 1.0
        )
        self.assertAlmostEqual(direct / formula, 1.0, places=13)

        theta = 0.49
        self.assertLess(theta / 2.0, 0.25)
        length = 200.0
        carrier_fraction = 0.5 - (math.log(length) + 1.0) / length
        self.assertLess(carrier_fraction, 0.5)
        self.assertGreater(1.0 - carrier_fraction, 0.5)
        self.assertIn("T=floor(theta*Omega^-)", self.normalized)
        self.assertIn(r"T\leq\theta\Omega", self.text)
        self.assertIn(r"T\asymp_{\theta,h}\Omega", self.text)
        self.assertNotIn("T=theta*Omega+O(1)", self.normalized)
        self.assertIn(r"<{N\over4}", self.text)
        self.assertIn(r"\chi_T(K)=0", self.text)
        self.assertIn(r"\mathcal N(\Omega)<N", self.text)

    def test_higher_count_threshold_is_necessary_not_sufficient(self) -> None:
        length = 400.0

        def row_fraction(constant: float) -> float:
            return constant / 2.0 - constant * (
                math.log(length) + 1.0 - math.log(constant)
            ) / length

        self.assertLess(row_fraction(2.0), 1.0)
        self.assertGreater(row_fraction(2.2), 1.0)
        z_value = F(1500)
        b_value = F(30)
        active_bins = z_value / (32 * b_value)
        self.assertEqual(active_bins, F(25, 16))
        self.assertIn(r"J_T\geq {Z(T)\over32B(T)}=\Theta(T)", self.text)
        self.assertIn("Passing it proves neither distinctness", self.normalized)
        self.assertIn(r"\sum_jT_j\leq2\max_jT_j", self.text)
        self.assertIn(r"{T\over\lambda}\not\longrightarrow0", self.text)

    def test_off_line_quartet_can_be_negative_while_phase_is_positive(self) -> None:
        length = 20.0
        beta = 0.4
        theta = 100.0 * math.pi + math.pi / 6.0
        gamma = 2.0 * theta / length
        z_value = complex(beta, gamma)

        def constant_transform(z_argument: complex) -> complex:
            return (
                2.0
                * cmath.sinh(z_argument * length / 2.0)
                / (math.sqrt(length) * z_argument)
            )

        first = constant_transform(z_value)
        second = constant_transform(z_value.conjugate())
        krein = abs(first + second) ** 2 - abs(first - second) ** 2
        phase_weight = math.sin(gamma * length / 2.0) ** 2 / gamma**2
        self.assertGreater(phase_weight, 0.0)
        self.assertLess(krein, 0.0)
        self.assertIn("signature `(1,1)` Krein block", self.normalized)
        self.assertIn(r"Q_+\succeq G_T^+", self.text)
        self.assertIn("no unconditional Loewner comparison", self.normalized)

    def test_exact_schur_gate_and_alignment_bound(self) -> None:
        # Basis: kappa followed by two complement coordinates.
        mu = F(1)
        q_value = F(2)
        b_vector = [F(2), F(0)]
        b_mu = [F(4), F(7)]
        complement = [value + mu for value in b_mu]
        a_value = min(complement)
        g_value = F(4)

        schur = sum(
            (entry * entry / diagonal for entry, diagonal in zip(b_vector, b_mu)),
            F(0),
        )
        correction_squared = sum(
            (
                (entry / diagonal) ** 2
                for entry, diagonal in zip(b_vector, b_mu)
            ),
            F(0),
        )
        exact_ratio = (q_value - mu) / (a_value - mu)
        shell_ratio = q_value / g_value
        self.assertEqual(schur, q_value - mu)
        self.assertEqual(correction_squared, F(1, 4))
        self.assertEqual(exact_ratio, F(1, 4))
        self.assertLessEqual(correction_squared, exact_ratio)
        self.assertLessEqual(exact_ratio, shell_ratio)
        self.assertGreater(g_value, q_value)
        self.assertIn(r"b^*B_\mu^{-1}b=q-\mu", self.text)
        self.assertIn(r"\mathcal A\leq{q\over g_T}", self.text)

    def test_weighted_signed_covariance_target_implies_checkpoint_target(self) -> None:
        visibility = [F(1), F(4), F(9)]
        relative_response = [F(1, 101), F(2, 101), F(3, 101)]
        alignments = [F(1, 202), F(1, 101), F(2, 101)]
        self.assertTrue(
            all(
                alignment <= response
                for alignment, response in zip(alignments, relative_response)
            )
        )
        weighted_alignment = dot(visibility, alignments)
        weighted_response = dot(visibility, relative_response)
        self.assertLessEqual(weighted_alignment, weighted_response)
        self.assertIn(r"a_p^{\rm cmp}>v_p", self.text)
        self.assertIn(r"\mathfrak R_p={q_p-\mu_p", self.text)
        self.assertIn(r"\mathcal A_p\leq\mathfrak R_p", self.text)

    def test_q_has_only_the_frozen_variational_envelope(self) -> None:
        self.assertIn(r"\mu\leq u\leq q", self.text)
        required = (
            "No smallness estimate for `q`",
            "no identification of `q` with the central entry",
            "no bound comparing `q` to `W_T`",
            "Neither statement follows from `W_T>0`",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_claim_boundary_and_fail_closed_scope(self) -> None:
        required = (
            "changes none of the standard eight files",
            "adds no zero table or numerical artifact",
            "P0_INVALIDATED",
            "proves no finite source gate",
            "does not assume RH",
            "They are not proved here",
            "complete pole-minus-archimedean-minus-prime source",
            "without explicitly assuming RH",
            "algebraic multiplicity as independent evaluation rows",
            "unproved smallness envelope",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "HSW proves the even-complement gate",
            "the frozen shell has a positive frame floor",
            "q is superpolynomially small",
            "multiplicity creates derivative jets",
            "the weighted-projector target is proved",
            "determinant convergence is established",
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
        self.assertGreaterEqual(self.text.count(r"\boxed{"), 12)
        cache_entries = [
            path for path in ROOT.rglob("__pycache__") if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
