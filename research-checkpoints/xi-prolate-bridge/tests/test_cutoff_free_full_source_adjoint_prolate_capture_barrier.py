from __future__ import annotations

import ast
import hashlib
from decimal import Decimal, ROUND_FLOOR, localcontext
import re
import shutil
import subprocess
import tempfile
import unittest
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes/CUTOFF_FREE_FULL_SOURCE_ADJOINT_PROLATE_CAPTURE_BARRIER.md"
NOTE_HASH = "157bffc55aeec592c263d5973effe1b9506e02dd97311652ecb2fdee0c3ff0e9"


def dot(x: list[Fraction], y: list[Fraction]) -> Fraction:
    return sum((a * b for a, b in zip(x, y, strict=True)), Fraction(0))


def matvec(matrix: list[list[Fraction]], vector: list[Fraction]) -> list[Fraction]:
    return [dot(row, vector) for row in matrix]


class CutoffFreeFullSourceAdjointProlateCaptureBarrierTests(unittest.TestCase):
    def test_note_hash_is_frozen(self) -> None:
        self.assertEqual(hashlib.sha256(NOTE.read_bytes()).hexdigest(), NOTE_HASH)

    def test_even_zero_mean_adjoint_has_half_factor_and_constant_projection(self) -> None:
        # A finite weighted analogue of the positive-half change of variables.
        arithmetic = [
            [Fraction(1), Fraction(2), Fraction(-1)],
            [Fraction(3), Fraction(-2), Fraction(4)],
        ]
        target_weights = [Fraction(2), Fraction(5)]
        g = [Fraction(7), Fraction(-3)]

        # r=A^*Wg on the positive half; the even-source adjoint is r/2.
        weighted_g = [w * value for w, value in zip(target_weights, g, strict=True)]
        r = [
            sum(
                (arithmetic[row][column] * weighted_g[row] for row in range(2)),
                Fraction(0),
            )
            for column in range(3)
        ]
        ambient_even_adjoint = [value / 2 for value in r]
        constant = sum(ambient_even_adjoint, Fraction(0)) / 3
        zero_mean_adjoint = [value - constant for value in ambient_even_adjoint]

        self.assertEqual(sum(zero_mean_adjoint, Fraction(0)), 0)

        for f in (
            [Fraction(1), Fraction(-1), Fraction(0)],
            [Fraction(2), Fraction(1), Fraction(-3)],
        ):
            self.assertEqual(sum(f, Fraction(0)), 0)
            target_pairing = dot(matvec(arithmetic, f), weighted_g)
            source_pairing = 2 * dot(f, zero_mean_adjoint)
            self.assertEqual(target_pairing, source_pairing)

    def test_integral_zero_prefix_is_raw_energy_minus_rank_one_penalty(self) -> None:
        integral_vector = [Fraction(2), Fraction(-1), Fraction(3)]
        beta = [Fraction(5), Fraction(7), Fraction(-2)]
        s = dot(integral_vector, integral_vector)
        coefficient = dot(integral_vector, beta) / s
        projected = [
            value - coefficient * integral
            for value, integral in zip(beta, integral_vector, strict=True)
        ]
        corrected_energy = dot(beta, beta) - dot(integral_vector, beta) ** 2 / s

        self.assertEqual(dot(projected, integral_vector), 0)
        self.assertEqual(dot(projected, projected), corrected_energy)
        self.assertGreaterEqual(corrected_energy, 0)

        # Raw energy alone can be completely removed by the integral condition.
        aligned = [3 * value for value in integral_vector]
        aligned_corrected = dot(aligned, aligned) - dot(integral_vector, aligned) ** 2 / s
        self.assertEqual(aligned_corrected, 0)

    def test_multiplicity_safe_capture_is_smallest_corrected_coefficient_gram(self) -> None:
        # The integral direction is the first coefficient.  After removing it,
        # the two whitened bottom directions have the displayed exact energies.
        integral_vector = [Fraction(1), Fraction(0), Fraction(0)]
        s = dot(integral_vector, integral_vector)
        columns = [
            [Fraction(7, 25), Fraction(3, 5), Fraction(0)],
            [Fraction(-4, 13), Fraction(0), Fraction(5, 13)],
        ]

        corrected_columns: list[list[Fraction]] = []
        for column in columns:
            coefficient = dot(integral_vector, column) / s
            corrected_columns.append(
                [
                    value - coefficient * integral
                    for value, integral in zip(column, integral_vector, strict=True)
                ]
            )

        gram = [
            [dot(corrected_columns[i], corrected_columns[j]) for j in range(2)]
            for i in range(2)
        ]
        self.assertEqual(gram[0][1], 0)
        self.assertEqual(gram[1][0], 0)
        self.assertEqual(gram[0][0], Fraction(9, 25))
        self.assertEqual(gram[1][1], Fraction(25, 169))
        self.assertEqual(min(gram[0][0], gram[1][1]), Fraction(25, 169))

    def test_ground_equation_gives_residual_adjoint_and_upper_capture(self) -> None:
        mu = Fraction(-2)
        q = [
            [mu, Fraction(0)],
            [Fraction(0), Fraction(3)],
        ]
        radical = [
            [Fraction(1), Fraction(2)],
            [Fraction(4), Fraction(5)],
        ]
        ground = [Fraction(1), Fraction(0)]

        source_adjoint = [radical[0][0], radical[0][1]]
        q_radical = [
            [
                sum((q[i][k] * radical[k][j] for k in range(2)), Fraction(0))
                for j in range(2)
            ]
            for i in range(2)
        ]
        residual_adjoint_on_ground = [q_radical[0][0], q_radical[0][1]]
        self.assertEqual(
            residual_adjoint_on_ground,
            [mu * value for value in source_adjoint],
        )

        # A Frobenius majorant for ||Q K Delta^{-1/2}|| is enough to check
        # the direction of the exact evacuation inequality without floats.
        delta = [Fraction(1, 9), Fraction(1, 4)]
        c_squared_majorant = sum(
            (q_radical[i][j] ** 2 / delta[j] for i in range(2) for j in range(2)),
            Fraction(0),
        )
        d_max = max(delta)
        left = mu**2 * dot(source_adjoint, source_adjoint)
        right = c_squared_majorant * d_max
        self.assertLessEqual(left, right)

    def test_bessel_block_trace_has_no_dimension_beyond_source_rank(self) -> None:
        # Columns are orthogonal with A^*A=5I, so ||A||^2=5 and the exact
        # physical-basis trace is d||A||^2=10.
        arithmetic = [
            [Fraction(1), Fraction(0)],
            [Fraction(0), Fraction(2)],
            [Fraction(2), Fraction(0)],
            [Fraction(0), Fraction(1)],
        ]
        row_energies = [dot(row, row) for row in arithmetic]
        trace = sum(row_energies, Fraction(0))
        source_dimension = 2
        operator_norm_squared = Fraction(5)
        self.assertEqual(trace, source_dimension * operator_norm_squared)
        self.assertLessEqual(min(row_energies), trace / len(row_energies))

    def test_diagonal_well_lies_inside_explicit_remote_coercivity_window(self) -> None:
        with localcontext() as context:
            context.prec = 80
            lam = Decimal(32)
            ell = Decimal(2) * lam.ln()
            # tanh(log(lambda))=(lambda^2-1)/(lambda^2+1).
            tanh_half_ell = (lam**2 - 1) / (lam**2 + 1)
            sigma_l = (ell / (Decimal(2) * tanh_half_ell)).ln()
            p_lam = Decimal(8) * (lam + 1 / lam - 2) / ell
            a_lam = lam + Decimal(2) * sigma_l
            r_lam = Decimal(4) * ell * (lam - 1)
            c_a = p_lam + a_lam + r_lam

            k = max(
                2,
                int((c_a / Decimal(8)).exp().to_integral_value(rounding=ROUND_FLOOR)),
            )
            n = 2 * k - 1
            # Dropping -1/(2*pi*n) makes the tested upper bound larger.
            lower_envelope_majorant = (Decimal(n) / 2).ln() - c_a

            self.assertLessEqual((Decimal(n) / 2).ln(), Decimal(k).ln())
            self.assertLessEqual(Decimal(k).ln(), c_a / 8)
            self.assertLessEqual(lower_envelope_majorant, 0)
            self.assertGreaterEqual(c_a, Decimal(4) * ell * (lam - 1))
            self.assertLessEqual(
                Decimal(16) * lam**8 * (-c_a / 8).exp(),
                Decimal(16) * lam ** (9 - int(lam)),
            )

    def test_dependency_hashes_are_frozen(self) -> None:
        expected = {
            "notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md":
                "c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c",
            "tests/test_cutoff_free_weighted_radical_coframe_reduction_barrier.py":
                "d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11",
            "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md":
                "3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81",
            "tests/test_full_source_coframe_rank.py":
                "dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a",
            "notes/HIGH_FOURIER_COERCIVITY.md":
                "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
            "tests/test_high_fourier_coercivity.py":
                "64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae",
            "notes/SOFT_DEFECT_PROLATE_ANGLE_REDUCTION.md":
                "3bcccfda9d606c21fc61efb9c2fbc3dd95926a82586e3c156fc965c32748777b",
            "tests/test_soft_defect_prolate_angle.py":
                "f440a59456cc4cc604afc419bc1aebc9589a0a6010b179a4784c7f5c62ca2088",
        }
        for relative, digest in expected.items():
            payload = (ROOT / relative).read_bytes()
            self.assertEqual(hashlib.sha256(payload).hexdigest(), digest, relative)

    def test_note_pins_formulas_and_fails_closed(self) -> None:
        source = NOTE.read_text(encoding="utf-8")
        required = (
            "r_g(x)=x^{-1/2}\\sum_{n\\leq\\lambda x}",
            "{1\\over2}{\\bf1}_{\\{|x|\\geq\\lambda^{-1}\\}}",
            "raw coefficient energy minus one rank-one integral penalty",
            "\\mu_\\lambda P_{F_{\\sigma,m}}A_{\\lambda,0}^*g",
            "\\leq{4d\\lambda^6\\over K}",
            "a_n=\\begin{cases}",
            "Q_\\lambda^{(N)}=D_a+D_bH-HD_b",
            "16\\lambda^8e^{-C_a(\\lambda)/8}",
            "actual arithmetic\ncoefficient-Gram inequality",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, source)

        forbidden = (
            "RH_PROVED",
            "P0_VALIDATED",
            "we prove RH",
            "we have proved RH",
            "the Riemann hypothesis follows unconditionally",
            "the countermodel is the actual von-Mangoldt Weil operator",
        )
        for token in forbidden:
            self.assertNotIn(token, source)

    def test_displayed_tex_static_hygiene_and_test_ast(self) -> None:
        source = NOTE.read_text(encoding="ascii")
        self.assertNotIn("\r", source)
        self.assertNotIn("\t", source)
        self.assertIsNone(re.search(r"[ \t]+$", source, flags=re.MULTILINE))
        self.assertNotIn("TO_BE_FROZEN", source)
        tags = re.findall(r"\\tag\{([^}]+)\}", source)
        self.assertEqual(len(tags), len(set(tags)))

        for path in (NOTE, Path(__file__)):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        floats = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(floats, [])

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        source = NOTE.read_text(encoding="ascii")
        displays = re.findall(r"\\\[(.*?)\\\]", source, flags=re.S)
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


if __name__ == "__main__":
    unittest.main()
