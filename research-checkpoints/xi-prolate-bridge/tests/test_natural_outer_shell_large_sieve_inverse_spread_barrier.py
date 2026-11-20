#!/usr/bin/env python3
"""Strict regressions for the natural outer-shell theorem and barrier."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "NATURAL_OUTER_SHELL_LARGE_SIEVE_INVERSE_SPREAD_BARRIER.md"
)
NOTE_HASH = "79be0448f5e144819ee9eb2e249021c3c5ffe44949a58b75002e2a117c1b85da"

FROZEN = {
    "notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md":
        "ce6863d26788de9fc0fd9e998094fcb7982845ca298ccf8048d0913f62470450",
    "tests/test_natural_cutoff_signed_ground_alignment.py":
        "3ae99e6bbbc0004aa2560a577eca16d6ef0221d28fb2aefc3aef1d9558fae0bb",
    "notes/NATURAL_CROSSROOT_WEIGHTED_PROJECTOR_AVERAGE_TARGET.md":
        "d477178ac4daed6315bdce4bc27b94b073bf0611c87a1f3192b4b5b7147334cf",
    "tests/test_natural_crossroot_weighted_projector_average_target.py":
        "36a70f9de303fe49ac60dfd1285542486615f696dfd66566fe73158eeba9a390",
    "notes/ACTUAL_SOURCE_ROW_PAIRED_GRAM_EXCLUSION_SELECTOR_MOMENT_GATE.md":
        "39777f86bfbf067402ccccdf069ff96276e5f931ee3ed4880edd3b135e181329",
    "tests/test_actual_source_row_paired_gram_exclusion_selector_moment_gate.py":
        "4605cc87111476f3defeaa3e7dbf2f78e4f8b4b92ce9f3e9d2a3b2bf855d5ec3",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def h_square(n: int, size: int) -> F:
    if n == 0:
        return F(2, size * size)
    return F(4 * size * size, (size * size - n * n) ** 2)


def d_value(n: int, size: int) -> F:
    return F(1, size * size) if n == 1 else F(1)


def alpha_exact(size: int) -> F:
    return sum(
        (h_square(n, size) / d_value(n, size) for n in range(size)),
        F(0),
    )


def beta_exact(n: int, size: int) -> F:
    if n == size:
        return F(1)
    if n == -size:
        return F(-1)
    return F(0)


def raw_entry(n: int, m: int, size: int) -> F:
    if n != m:
        return (beta_exact(n, size) - beta_exact(m, size)) / (n - m)
    if n == 0:
        return F(1)
    if abs(n) == 1:
        return F(1, size * size)
    if abs(n) < size:
        return F(1)
    return alpha_exact(size) - F(1, size)


def counter_data(size: int) -> dict[str, object]:
    h = np.array(
        [math.sqrt(2.0) / size]
        + [2.0 * size / (size * size - n * n) for n in range(1, size)],
        dtype=float,
    )
    diagonal = np.array(
        [1.0, size ** -2] + [1.0] * (size - 2),
        dtype=float,
    )
    alpha = float(np.sum(h * h / diagonal))
    response = h / diagonal
    matrix = np.zeros((size + 1, size + 1), dtype=float)
    matrix[:size, :size] = np.diag(diagonal)
    matrix[:size, size] = h
    matrix[size, :size] = h
    matrix[size, size] = alpha
    return {
        "h": h,
        "d": diagonal,
        "alpha": alpha,
        "r": response,
        "matrix": matrix,
    }


def inner(left: np.ndarray, right: np.ndarray) -> complex:
    return complex(np.vdot(left, right))


class NaturalOuterShellLargeSieveInverseSpreadBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_minimal_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 6)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_universal_source_formula_and_endpoint_normalization_tokens(self) -> None:
        required = (
            r"G(t)=e^t-\psi_C(e^t)-{1\over2}\log(1-e^{-2t})",
            r"dF_{\rm align}(t)=-e^{-t/2}\,dG(t)",
            r"\sum_{1<m\leq\lambda_p^2}{\Lambda(m)\over\sqrt m}",
            r"\beta_{p,n}={1\over\pi}\int_0^{L_p}G(t)",
            "upper endpoint in Stieltjes integration by parts vanishes",
            "lower endpoint also vanishes",
            "inclusive endpoint convention is unchanged",
            r"(h_p)_0={\sqrt2\,\beta_{p,N_p}\over N_p}",
            r"N_p\beta_{p,N_p}-n\beta_{p,n}",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_outer_column_follows_exactly_from_source_cauchy(self) -> None:
        size = 11
        beta = {n: F(3 * n + 1, 17) for n in range(size + 1)}
        beta[0] = F(0)

        def b(n: int) -> F:
            return beta[n] if n >= 0 else -beta[-n]

        def q(n: int, m: int) -> F:
            return (b(n) - b(m)) / (n - m)

        raw_zero_sum = q(0, size) + q(0, -size)
        self.assertEqual(raw_zero_sum, F(2) * beta[size] / size)
        for n in range(1, size):
            even_outer = (
                q(n, size) + q(n, -size)
                + q(-n, size) + q(-n, -size)
            ) / 2
            expected = F(2) * (
                size * beta[size] - n * beta[n]
            ) / (size * size - n * n)
            self.assertEqual(even_outer, expected)

    def test_outer_frequency_derivative_and_one_separated_coloring(self) -> None:
        def omega(value: float) -> float:
            return math.pi * (value + 3.0) / (2.0 * math.log(value / 2.0))

        def derivative(value: float) -> float:
            ell = math.log(value / 2.0)
            return math.pi / 2.0 * (ell - 1.0 - 3.0 / value) / ell**2

        for value in (10_001.0, 20_001.0, 100_001.0):
            step = 1e-2
            numerical = (omega(value + step) - omega(value - step)) / (2 * step)
            self.assertAlmostEqual(numerical, derivative(value), places=8)

        lower = 10_000
        upper = 20_000
        points = [p for p in range(lower + 1, upper + 1) if p % 2]
        classes = math.ceil(2.0 * math.log(upper) / math.pi) + 1
        values = [omega(float(p)) for p in points]
        for residue in range(classes):
            selected = values[residue::classes]
            for left, right in zip(selected, selected[1:]):
                self.assertGreaterEqual(right - left, 1.0)
        self.assertLess(values[-1] - values[0], 2.0 * lower / math.log(lower))

    def test_continuous_exponential_integral_has_exact_endpoint_value(self) -> None:
        for p in (101, 1001, 10001):
            lam = p / 2.0
            length = 2.0 * math.log(lam)
            size = (p + 3) // 2
            frequency = 2.0 * math.pi * size / length
            exact = frequency * (1.0 - lam) / (frequency**2 + 0.25)
            primitive_at_length = (
                math.exp(length / 2.0)
                * (
                    0.5 * math.sin(frequency * length)
                    - frequency * math.cos(frequency * length)
                )
                / (frequency**2 + 0.25)
            )
            primitive_at_zero = -frequency / (frequency**2 + 0.25)
            self.assertAlmostEqual(
                primitive_at_length - primitive_at_zero,
                exact,
                places=11,
            )

    def test_binary_maximal_decomposition_and_six_log_bookkeeping(self) -> None:
        # Decompose [0,y) into at most one aligned interval at each scale.
        for y in range(1, 257):
            blocks: list[tuple[int, int]] = []
            start = 0
            for level in range(y.bit_length() - 1, -1, -1):
                width = 1 << level
                if y & width:
                    blocks.append((start, start + width))
                    self.assertEqual(start % width, 0)
                    start += width
            self.assertEqual(start, y)
            self.assertLessEqual(len(blocks), y.bit_length())
            levels = [int(math.log2(right - left)) for left, right in blocks]
            self.assertEqual(len(levels), len(set(levels)))
            covered = [item for left, right in blocks for item in range(left, right)]
            self.assertEqual(covered, list(range(y)))

        self.assertIn("one in (4.5), two from binary maximality", self.normalized)
        self.assertIn("one from the separation partition", self.normalized)
        self.assertIn("two from (5.5)", self.normalized)
        self.assertIn(r"P^2(\log P)^6", self.normalized)

    def test_montgomery_vaughan_input_and_external_disclosure(self) -> None:
        required = (
            "The sole non-elementary external analytic-number-theory theorem",
            "H. L. Montgomery and R. C. Vaughan",
            "Hilbert's Inequality",
            "https://doi.org/10.1112/jlms/s2-8.1.73",
            r"\int_I|D(t)|^2dt\ll(T+X)\sum_{m\leq X}|c_m|^2",
            r"\{\log(2X)\}^3",
            r"\sum_{m\leq X}{\Lambda(m)^2\over m}\ll(\log X)^2",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_prefix_theorem_and_minimal_inverse_spread_upgrade(self) -> None:
        required = (
            r"{ (R+1)(\log P)^6\over P}",
            r"{R^3(\log P)^2\over P^2}",
            r"H_{P,R}=\sum_{p\in{\cal C}_P}\|\Pi_Rh_p\|^2",
            r"W_P=\sum_{p\in{\cal G}_P}\chi_p|s_p|^2",
            r"{\cal I}_{P,R}:=",
            r"{|{\cal C}_P|\over W_PH_{P,R}}",
            r"{\cal I}_{P,R}\ll(\log P)^D",
            r"\mu_p=\lambda_{\min}(A_p)",
            "Assume `k_p>0`",
            "high-to-low inverse spread",
            "multiplicity-safe cofactor form must be retained",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_complex_one_shell_conjugation_and_gram_normalizations(self) -> None:
        response = np.array([1 + 2j, 2 - 1j, -1 + 0.5j], dtype=complex)
        vector = np.concatenate([response, np.array([-1.0 + 0j])])
        kappa = np.array([0.5, 0.5j, 0.5, 0.5], dtype=complex)
        eta = np.array([1 + 1j, 2 - 1j, -0.5 + 0.25j, math.sqrt(2)], dtype=complex)
        outer = np.array([0.0, 0.0, 0.0, 1.0], dtype=complex)

        self.assertAlmostEqual(inner(kappa, kappa).real, 1.0, places=14)
        c_value = inner(outer, kappa)
        low_kappa = kappa[:-1]
        k_value = inner(low_kappa, low_kappa).real
        s_value = inner(kappa, vector)
        self.assertAlmostEqual(
            s_value,
            inner(low_kappa, response) - c_value.conjugate(),
            places=14,
        )
        t_value = inner(vector, eta)
        denominator = inner(vector, vector).real
        projected_eta = vector * t_value / denominator
        a_value = inner(kappa, projected_eta)
        chi = abs(t_value) ** 2 / denominator**2

        projector = np.eye(3, dtype=complex) - np.outer(
            low_kappa, low_kappa.conjugate()
        ) / k_value
        transverse = projector @ response

        gram_vectors = (outer, kappa, projected_eta)
        gram = np.array(
            [[inner(left, right) for right in gram_vectors] for left in gram_vectors],
            dtype=complex,
        )
        delta = np.linalg.det(gram)
        self.assertAlmostEqual(delta.imag, 0.0, places=11)
        self.assertAlmostEqual(
            delta.real / k_value,
            chi * inner(transverse, transverse).real,
            places=11,
        )
        self.assertAlmostEqual(abs(a_value) ** 2, chi * abs(s_value) ** 2, places=11)
        self.assertIn(r"-\overline {c_p}", self.text)
        self.assertIn(r"{\Delta_p\over k_p}", self.text)

    def test_exact_raw_parity_blocks_and_both_schur_complements(self) -> None:
        size = 7
        alpha = alpha_exact(size)
        even_schur = alpha - sum(
            (h_square(n, size) / d_value(n, size) for n in range(size)),
            F(0),
        )
        self.assertEqual(even_schur, 0)

        # The raw zero/outer sum equals sqrt(2) h_0 after normalization.
        self.assertEqual(
            raw_entry(0, size, size) + raw_entry(0, -size, size),
            F(2, size),
        )
        for n in range(1, size):
            even_outer = (
                raw_entry(n, size, size) + raw_entry(n, -size, size)
                + raw_entry(-n, size, size) + raw_entry(-n, -size, size)
            ) / 2
            odd_outer = (
                raw_entry(n, size, size) - raw_entry(n, -size, size)
                - raw_entry(-n, size, size) + raw_entry(-n, -size, size)
            ) / 2
            self.assertEqual(even_outer, F(2 * size, size * size - n * n))
            self.assertEqual(odd_outer, F(2 * n, size * size - n * n))

        raw_outer_cross = raw_entry(size, -size, size)
        self.assertEqual(raw_outer_cross, F(1, size))
        self.assertEqual(
            raw_entry(size, size, size) + raw_outer_cross,
            alpha,
        )
        self.assertEqual(
            raw_entry(size, size, size) - raw_outer_cross,
            alpha - F(2, size),
        )

        odd_schur = (
            F(2, size * size)
            + sum(
                (F(4, (size * size - n * n) * d_value(n, size))
                 for n in range(1, size)),
                F(0),
            )
            - F(2, size)
        )
        odd_direct = alpha - F(2, size) - sum(
            (
                F(4 * n * n, (size * size - n * n) ** 2)
                / d_value(n, size)
                for n in range(1, size)
            ),
            F(0),
        )
        self.assertEqual(odd_schur, odd_direct)
        self.assertGreater(odd_schur, F(4) - F(2, size))

    def test_exact_prefix_bound_and_response_amplification(self) -> None:
        for size in (4, 7, 16, 31):
            for prefix in range(0, size // 2 + 1):
                norm = sum((h_square(n, size) for n in range(prefix + 1)), F(0))
                self.assertLessEqual(
                    norm,
                    F(2, size * size) + F(64 * prefix, 9 * size * size),
                )
                self.assertLessEqual(norm, F(8 * (prefix + 1), size * size))
            r_one = F(2 * size**3, size * size - 1)
            self.assertGreaterEqual(r_one, 2 * size)
            self.assertLess(r_one - 2 * size, F(3, size))

    def test_counterfamily_limits_visibility_and_alignment(self) -> None:
        errors = []
        for size in (32, 64, 128, 256, 512, 1024):
            data = counter_data(size)
            response = data["r"]
            assert isinstance(response, np.ndarray)
            denominator = 1.0 + float(response @ response)
            s_value = (response[0] + response[1]) / math.sqrt(2.0)
            t_value = (
                response[0]
                + math.sqrt(2.0) * float(np.sum(response[1:]))
                - math.sqrt(2.0)
            )
            chi = t_value**2 / denominator**2
            transverse = float(response @ response) - s_value**2
            delta_over_k = chi * transverse
            weight = chi * s_value**2
            alignment = transverse / s_value**2
            errors.append(abs(alignment - 1.0))
            self.assertGreater(delta_over_k, 0.9)
            self.assertGreater(weight, 0.9)
            self.assertGreater(t_value**2 / denominator, 1.9)
        self.assertEqual(errors, sorted(errors, reverse=True))
        self.assertLess(errors[-1], 2e-6)

    def test_finite_gate_constants_lower_ritz_and_odd_psd(self) -> None:
        for size in (4, 16, 101, 256):
            data = counter_data(size)
            h = data["h"]
            diagonal = data["d"]
            response = data["r"]
            matrix = data["matrix"]
            alpha = data["alpha"]
            assert isinstance(h, np.ndarray)
            assert isinstance(diagonal, np.ndarray)
            assert isinstance(response, np.ndarray)
            assert isinstance(matrix, np.ndarray)
            assert isinstance(alpha, float)

            w = h / np.sqrt(diagonal)
            self.assertGreaterEqual(w[1], 2.0)
            self.assertLess(float(w @ w - w[1] ** 2), 9.0)
            nonzero = np.linalg.eigvalsh(matrix)[1:]
            self.assertGreaterEqual(float(nonzero[0]), 1.0 / 17.0 - 1e-12)

            denominator = 1.0 + float(response @ response)
            s_value = (response[0] + response[1]) / math.sqrt(2.0)
            self.assertGreater(s_value**2 / denominator, 1.0 / 3.0)

            q = np.zeros(size + 1)
            q[0] = q[1] = 1.0 / math.sqrt(2.0)
            q_zero = float(q @ matrix @ q)
            self.assertLessEqual(q_zero, 17.0 / 32.0 + 1e-15)
            if size == 4:
                self.assertAlmostEqual(q_zero, 17.0 / 32.0, places=15)
            residual_vector = matrix @ q - q_zero * q
            rho = float(np.linalg.norm(residual_vector))
            z_vector = residual_vector / rho
            lower_ritz = float(
                np.linalg.eigvalsh(
                    np.array(
                        [
                            [q_zero, rho],
                            [rho, float(z_vector @ matrix @ z_vector)],
                        ]
                    )
                )[0]
            )
            self.assertGreaterEqual(lower_ritz, -1e-12)
            self.assertLess(lower_ritz, 196.0 / size**2)
            self.assertLess((q_zero - lower_ritz) / rho, 17.0 / 15.0 + 1e-12)
            if size >= 101:
                self.assertLess(lower_ritz, 1.0 / 51.0)

            odd_h = np.array(
                [2.0 * n / (size * size - n * n) for n in range(1, size)]
            )
            odd_matrix = np.zeros((size, size))
            odd_matrix[:-1, :-1] = np.diag(diagonal[1:])
            odd_matrix[:-1, -1] = odd_h
            odd_matrix[-1, :-1] = odd_h
            odd_matrix[-1, -1] = alpha - 2.0 / size
            self.assertGreater(float(np.linalg.eigvalsh(odd_matrix)[0]), 0.0)

    def test_dyadic_prefix_smallness_does_not_force_weighted_target(self) -> None:
        block = 400
        prefix = 12
        prefix_sum = 0.0
        delta_sum = 0.0
        weight_sum = 0.0
        count = 0
        for p in range(block + 1, 2 * block + 1, 2):
            size = (p + 3) // 2
            data = counter_data(size)
            h = data["h"]
            response = data["r"]
            assert isinstance(h, np.ndarray)
            assert isinstance(response, np.ndarray)
            prefix_sum += float(h[:prefix + 1] @ h[:prefix + 1])
            denominator = 1.0 + float(response @ response)
            s_value = (response[0] + response[1]) / math.sqrt(2.0)
            t_value = (
                response[0]
                + math.sqrt(2.0) * float(np.sum(response[1:]))
                - math.sqrt(2.0)
            )
            chi = t_value**2 / denominator**2
            transverse = float(response @ response) - s_value**2
            delta_sum += chi * transverse
            weight_sum += chi * s_value**2
            count += 1
        self.assertLessEqual(prefix_sum, 16.0 * (prefix + 1) / block)
        self.assertGreater(delta_sum, 0.9 * count)
        self.assertGreater(weight_sum, 0.9 * count)
        self.assertGreater(delta_sum, math.log(block) / block * weight_sum * 20.0)

    def test_scope_fail_closed_state_and_no_rh_claim(self) -> None:
        required = (
            "purely structural",
            "not the actual arithmetic diagonal",
            "a synthetic anchor, not the natural prolate vector",
            "not a counterexample to the actual-arithmetic target",
            "P0_INVALIDATED",
            "standard eight are unchanged",
            "No finite-good actual index",
            "Riemann hypothesis",
            "pre-inverse",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "the actual target is false",
            "Montgomery--Vaughan proves (7.12)",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_display_balance_unique_tags_ascii_and_cache_hygiene(self) -> None:
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
        self.assertFalse((Path(__file__).resolve().parent / "__pycache__").exists())

    def test_import_hygiene(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__", "ast", "fractions", "hashlib", "math", "numpy",
                "pathlib", "re", "shutil", "subprocess", "tempfile", "unittest",
            },
        )

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 50)
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
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
