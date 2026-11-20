#!/usr/bin/env python3
"""Exact regressions for the Q0-free selector secant/parity theorem."""

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

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "Q0_FREE_SELECTOR_SECANT_ROOT_PARITY_THEOREM.md"
NOTE_HASH = "7d61da7b191fa7f6c00cf83ec139b2cfeac6981b46fa6d2059c5c842aaf9ba22"

FROZEN = {
    "notes/ACTUAL_SOURCE_ROW_PAIRED_GRAM_EXCLUSION_SELECTOR_MOMENT_GATE.md":
        "39777f86bfbf067402ccccdf069ff96276e5f931ee3ed4880edd3b135e181329",
    "tests/test_actual_source_row_paired_gram_exclusion_selector_moment_gate.py":
        "4605cc87111476f3defeaa3e7dbf2f78e4f8b4b92ce9f3e9d2a3b2bf855d5ec3",
    "notes/ACTUAL_GLOBAL_TWISTED_CONE_MOVING_GRID_TARGET_INCOMPATIBILITY.md":
        "0fb7b3d1ab5980b9cdc490933c68d9da3536a8d77a677fe96ec921445639121f",
    "tests/test_actual_global_twisted_cone_moving_grid_target_incompatibility.py":
        "91bda99e6b0db886a7551501ae2343705e4a2cb4632a687fe0f0d72287f031d6",
    "notes/STRICT_ODD_SELECTOR_SHELL_LOCALIZATION_THEOREM.md":
        "f84eb9ea08d7af397c201c645c7de5eb8957bc03ac6a5a7e55b653bc3d6321dc",
    "tests/test_strict_odd_selector_shell_localization_theorem.py":
        "5d0c8aa4a72177031f045bfd2318fdd66f40eb60ed8f541b3f6823e970d0ed81",
    "notes/HIGH_FOURIER_COERCIVITY.md":
        "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "tests/test_high_fourier_coercivity.py":
        "64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def product(values) -> F:
    result = F(1)
    for value in values:
        result *= value
    return result


def s_value(atoms: tuple[tuple[F, F], ...], x: F) -> F:
    return sum((weight / (x - root) for root, weight in atoms), F(0))


def derivative_moment(atoms: tuple[tuple[F, F], ...], x: F) -> F:
    return sum((weight / (x - root) ** 2 for root, weight in atoms), F(0))


def atom_secant(n: int, h: int, root: F) -> tuple[F, F]:
    x = F(n * n)
    left = F((n - h) ** 2)
    right = F((n + h) ** 2)
    derivative = F(1, 1) / (x - root) ** 2
    secant = (
        F(1, 1) / (left - root) - F(1, 1) / (right - root)
    ) / (right - left)
    return derivative, secant


def polynomial_value(roots: tuple[F, ...], x: F) -> F:
    return product(x - root for root in roots)


def twisted_weight(count: int, roots: tuple[F, ...], n: int) -> F:
    return F((-1) ** count) * polynomial_value(roots, F(n * n)) / F(
        math.factorial(count - n) * math.factorial(count + n)
    )


def root_count_below(roots: tuple[F, ...], x: F) -> int:
    return sum(root < x for root in roots)


def envelope_constants(lam: int) -> tuple[mp.mpf, mp.mpf, mp.mpf]:
    value = mp.mpf(lam)
    length = 2 * mp.log(value)
    sigma = mp.log(length / (2 * mp.tanh(length / 2)))
    c_a = (
        8 * (value + 1 / value - 2) / length
        + value
        + 2 * sigma
        + 4 * length * (value - 1)
    )
    b_b = (
        2 * (value - 1 / value) / mp.pi
        + mp.mpf(1) / 4
        + 1 / (2 * mp.pi**2)
        + (value - 1 + sigma) / (2 * mp.pi)
        + 2 * length * (value - 1) / mp.pi
    )
    a_zero = (
        4 * (value - 1 / value)
        + abs(mp.euler + mp.log(4 * mp.pi))
        + value
        + mp.log(mp.coth(length / 2))
        + 4 * length * (value - 1)
    )
    return c_a, b_b, a_zero


class Q0FreeSelectorSecantRootParityTheoremTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 8)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_general_h_atom_inequality_and_sharpness(self) -> None:
        n = 7
        h = 2
        left = F((n - h) ** 2)
        right = F((n + h) ** 2)
        for root in (F(1, 3), F(24), F(82), F(200)):
            self.assertTrue(root < left or root > right)
            derivative, secant = atom_secant(n, h, root)
            self.assertGreater(secant, 0)
            self.assertLessEqual(derivative, secant)

        far_root = F(10**8)
        derivative, secant = atom_secant(n, h, far_root)
        ratio = derivative / secant
        self.assertLess(ratio, 1)
        self.assertGreater(ratio, F(999999, 1000000))

    def test_positive_mixture_secant_and_actual_h1_criterion(self) -> None:
        n = 4
        h = 1
        x = F(n * n)
        left = F((n - h) ** 2)
        right = F((n + h) ** 2)
        atoms = ((F(1, 2), F(3)), (F(50), F(5)), (F(80), F(7)))
        self.assertTrue(all(root < left or root > right for root, _ in atoms))
        derivative = derivative_moment(atoms, x)
        endpoint_secant = (s_value(atoms, left) - s_value(atoms, right)) / F(
            4 * n * h
        )
        self.assertLessEqual(derivative, endpoint_secant)

        b_left = -2 * (n - 1) * s_value(atoms, left)
        b_right = -2 * (n + 1) * s_value(atoms, right)
        d_value = 4 * n * n * derivative
        exact_cap = F(n) * (
            -b_left / F(2 * (n - 1)) + b_right / F(2 * (n + 1))
        )
        self.assertEqual(exact_cap, 4 * n * n * endpoint_secant)
        self.assertLessEqual(d_value, exact_cap)

    def test_large_derivative_forces_window_but_not_two_sides(self) -> None:
        n = 2
        roots = (F(95, 24), F(63, 16), F(31, 8))
        weights = (F(1, 288), F(1, 192), F(1, 96))
        atoms = tuple(zip(roots, weights))
        x = F(n * n)
        source = -2 * n * s_value(atoms, x)
        d_value = 4 * n * n * derivative_moment(atoms, x)
        self.assertEqual(source, F(-1))
        self.assertEqual(d_value, F(64))
        self.assertTrue(all(F(1) < root < F(4) for root in roots))

        neighbor_sources = tuple(
            -2 * m * s_value(atoms, F(m * m)) for m in (1, 3)
        )
        self.assertEqual(neighbor_sources[0], F(2017, 153502))
        self.assertEqual(neighbor_sources[1], F(-18083, 803682))
        bound = max(abs(source), *(abs(value) for value in neighbor_sources))
        self.assertGreater(d_value, bound * F(n * n, n * n - 1))
        self.assertFalse(any(root > x for root in roots))

    def test_shells_short_circuit_the_secant_contrapositive(self) -> None:
        n = 4
        window = (F((n - 1) ** 2), F((n + 1) ** 2))
        for shell in (n - 1, n, n + 1):
            square = F(shell * shell)
            self.assertLessEqual(window[0], square)
            self.assertLessEqual(square, window[1])
            self.assertLessEqual(abs(shell - n), 1)
        shell_weight = F(100)
        source_bound = F(1)
        self.assertGreater(shell_weight, source_bound * F(n * n, n * n - 1))

    def test_frozen_lower_bound_activates_only_the_locked_tail(self) -> None:
        mp.mp.dps = 80
        ratios = []
        for lam in (2, 4, 8):
            c_a, b_b, a_zero = envelope_constants(lam)
            exponent = 4800 * lam * lam
            log_n = exponent * mp.log(2)
            inverse_n = mp.power(2, -exponent)
            lower = (
                log_n
                - mp.log(2)
                - inverse_n / (2 * mp.pi)
                - c_a
                - a_zero
                - b_b * inverse_n
            )
            threshold = b_b / (1 - inverse_n**2)
            self.assertGreater(lower, threshold)
            ratios.append(lower / threshold)
        self.assertTrue(all(left < right for left, right in zip(ratios, ratios[1:])))

        cutoff = 100
        start = math.isqrt(cutoff)
        centers = tuple(range(start, cutoff, 3))
        windows = tuple((center - 1, center + 1) for center in centers)
        for first, second in zip(windows, windows[1:]):
            self.assertLess(first[1], second[0])
        expected = 1 + (cutoff - 1 - start) // 3
        self.assertEqual(len(centers), expected)

    def test_monic_ground_weight_sign_and_gap_parity(self) -> None:
        count = 4
        roots = (F(1, 2), F(3, 2), F(10), F(30))
        weights = tuple(twisted_weight(count, roots, n) for n in range(count + 1))
        for n, weight in enumerate(weights):
            value = polynomial_value(roots, F(n * n))
            if n == 0:
                ground_coordinate = F((-1) ** count) * value / F(
                    math.factorial(count) ** 2
                )
            else:
                denominator = F(2 * n * n) * product(
                    F(n * n - m * m)
                    for m in range(1, count + 1)
                    if m != n
                )
                ground_coordinate = value / denominator
            self.assertEqual(F((-1) ** n) * ground_coordinate, weight)
            below = root_count_below(roots, F(n * n))
            self.assertEqual(weight > 0, below % 2 == 0)
            self.assertEqual(weight < 0, below % 2 == 1)

        for n in range(count):
            gap_count = sum(F(n * n) < root < F((n + 1) ** 2) for root in roots)
            same_sign = (weights[n] > 0) == (weights[n + 1] > 0)
            self.assertEqual(same_sign, gap_count % 2 == 0)

        shell_roots = (F(1, 2), F(4), F(10), F(30))
        self.assertEqual(twisted_weight(count, shell_roots, 2), F(0))

    def test_linear_constant_sign_block_gives_only_even_gap_counts(self) -> None:
        block_length = 17
        signs = (1,) * block_length
        even_gap_certificates = sum(
            left == right for left, right in zip(signs, signs[1:])
        )
        self.assertEqual(even_gap_certificates, block_length - 1)
        self.assertIn("even root count, not an empty gap", self.text)
        self.assertIn("not a linear lower bound", self.text)

    def test_two_pole_same_point_nonrigidity_and_qualified_one_side(self) -> None:
        n = 10
        x = F(n * n)
        s = F(1, 2 * n)
        t = F(1)
        below_distance = x / 2
        above_distance = x
        theta_below = below_distance**2 * (above_distance * t + s) / (
            below_distance + above_distance
        )
        theta_above = above_distance**2 * (below_distance * t - s) / (
            below_distance + above_distance
        )
        self.assertGreater(theta_below, 0)
        self.assertGreater(theta_above, 0)
        atoms = (
            (x - below_distance, theta_below),
            (x + above_distance, theta_above),
        )
        self.assertEqual(s_value(atoms, x), s)
        self.assertEqual(derivative_moment(atoms, x), t)
        self.assertEqual(-2 * n * s, F(-1))
        self.assertEqual(4 * n * n * t, F(400))
        self.assertTrue(all(
            root < F((n - 1) ** 2) or root > F((n + 1) ** 2)
            for root, _ in atoms
        ))
        self.assertGreater(below_distance**2 / (x - below_distance), 1)
        self.assertGreater(above_distance**2 / (x + above_distance), 1)

        extras = tuple((F(300 + index), F(1, 10**8)) for index in range(8))
        residual_s = s - s_value(extras, x)
        residual_t = t - derivative_moment(extras, x)
        embedded_below = below_distance**2 * (
            above_distance * residual_t + residual_s
        ) / (below_distance + above_distance)
        embedded_above = above_distance**2 * (
            below_distance * residual_t - residual_s
        ) / (below_distance + above_distance)
        self.assertGreater(embedded_below, 0)
        self.assertGreater(embedded_above, 0)
        embedded = (
            (x - below_distance, embedded_below),
            (x + above_distance, embedded_above),
        ) + extras
        self.assertEqual(len(embedded), n)
        self.assertEqual(len({root for root, _ in embedded}), n)
        self.assertEqual(s_value(embedded, x), s)
        self.assertEqual(derivative_moment(embedded, x), t)

        one_side_root = x - s / t
        one_side_weight = s**2 / t
        self.assertGreater(one_side_root, 0)
        one_side = ((one_side_root, one_side_weight),)
        self.assertEqual(s_value(one_side, x), s)
        self.assertEqual(derivative_moment(one_side, x), t)
        invalid_s = F(2) * x * t
        self.assertLessEqual(x - invalid_s / t, 0)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "note.tex"
            source.write_text(document, encoding="ascii")
            result = subprocess.run(
                [compiler, "-interaction=nonstopmode", "-halt-on-error", source.name],
                cwd=temporary,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_static_hygiene_and_fail_closed_scope(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(all(line == line.rstrip(b" ") for line in raw.splitlines()))

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "constant `1/(4nh)` is sharp",
            "For every positive retained index",
            "some selector radius",
            "checkpoint-1.34 standard eight are unchanged",
            "linearly many even-count gaps",
            "same `(b_n,D_n)`",
            "resulting selector square stays positive",
            "quotient-metric distances `|n^2-r^2|/r`",
            "low `n=O(L)` criterion",
            "diagnostic only",
            "not one root per gap",
            "not subunit clearance",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "actual target convergence is proved",
            "actual strict signs are proved",
            "one root in every gap",
            "the riemann hypothesis is proved",
            "standard eight are updated",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
