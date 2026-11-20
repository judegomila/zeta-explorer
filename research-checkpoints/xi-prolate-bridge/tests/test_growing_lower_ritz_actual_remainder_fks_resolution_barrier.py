from __future__ import annotations

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
NOTE = (
    ROOT
    / "notes"
    / "GROWING_LOWER_RITZ_ACTUAL_REMAINDER_FKS_RESOLUTION_BARRIER.md"
)

DEPENDENCIES = {
    "notes/CHEBYSHEV_ERROR_REWRITE.md": "164482f280284c49eda27c6d22607f32d5e16db4ab053b965c97f8bbd81db20a",
    "notes/GROWING_ACTUAL_SYMBOL_BOUNDARY_GAUGE_PHASE_ANGLE_BARRIER.md": "de8a95d46fdaf393208124b7813637333c1e309e457473f893c3fd51b66138b1",
    "notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md": "aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce",
    "P3_SOURCE_LOCK.json": "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "DIRECT_RH_ATTACK.md": "b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2",
}


def mangoldt(n: int) -> mp.mpf:
    for p in range(2, n + 1):
        if any(p % d == 0 for d in range(2, math.isqrt(p) + 1)):
            continue
        power = p
        while power < n:
            power *= p
        if power == n:
            return mp.log(p)
    return mp.mpf(0)


def chebyshev(x: mp.mpf) -> mp.mpf:
    return mp.fsum(mangoldt(n) for n in range(2, int(mp.floor(x)) + 1))


def weighted_chebyshev(x: mp.mpf) -> mp.mpf:
    return mp.fsum(
        mangoldt(n) / mp.sqrt(n) for n in range(2, int(mp.floor(x)) + 1)
    )


class LowerRitzActualRemainderFKSResolutionTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text()

    def test_frozen_hashes(self) -> None:
        for relative, expected in DEPENDENCIES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)
            self.assertIn(expected, self.text)

    def test_origin_constant_collapse(self) -> None:
        mp.mp.dps = 70
        cstar = mp.digamma(mp.mpf("0.25")) - mp.log(mp.pi) + 4
        boundary = mp.mpf("1.5") * mp.log(2) + mp.pi / 4 - 2
        collapsed = cstar - 2 + 2 * boundary
        expected = -2 - mp.euler - mp.log(mp.pi)
        self.assertLess(abs(collapsed - expected), mp.mpf("1e-65"))

    def test_partial_summation_identity_with_actual_prime_inventory(self) -> None:
        mp.mp.dps = 60
        for t in (mp.log(2) / 2, mp.log(3) + mp.mpf("0.1"), mp.log(7)):
            direct = weighted_chebyshev(mp.e**t) - 2 * (mp.e ** (t / 2) - 1)
            points = [mp.mpf(0)]
            points.extend(mp.log(n) for n in range(2, int(mp.floor(mp.e**t)) + 1))
            points.append(t)
            points = sorted(set(x for x in points if 0 <= x <= t))

            def integrand(s: mp.mpf) -> mp.mpf:
                return (chebyshev(mp.e**s) - mp.e**s) * mp.e ** (-s / 2)

            history = mp.fsum(
                mp.quad(integrand, [left, right])
                for left, right in zip(points, points[1:])
            )
            rhs = (
                1
                + mp.e ** (-t / 2) * (chebyshev(mp.e**t) - mp.e**t)
                + history / 2
            )
            self.assertLess(abs(direct - rhs), mp.mpf("1e-50"))

    def test_exact_combined_kernel_form_on_constant_mode(self) -> None:
        mp.mp.dps = 60
        lam = mp.mpf(3)
        length = 2 * mp.log(lam)
        cstar = mp.digamma(mp.mpf("0.25")) - mp.log(mp.pi) + 4

        def correlation(t: mp.mpf) -> mp.mpf:
            return 2 * (1 - t / length)

        derivative = -2 / length

        def discrepancy(t: mp.mpf) -> mp.mpf:
            return weighted_chebyshev(mp.e**t) - 2 * (mp.e ** (t / 2) - 1)

        def tail(t: mp.mpf) -> mp.mpf:
            r = mp.e ** (-t / 2)
            return mp.log((1 + r) / (1 - r)) / 2 + mp.atan(r) - 2 * r

        def delta(t: mp.mpf) -> mp.mpf:
            return (
                1
                - mp.e ** (-t) * chebyshev(mp.e**t)
                - mp.e ** (-t) * mp.log(1 - mp.e ** (-2 * t)) / 2
            )

        breaks = [mp.mpf(0)]
        breaks.extend(mp.log(n) for n in range(2, int(lam**2) + 1))
        breaks.append(length)
        breaks = sorted(set(x for x in breaks if 0 <= x <= length))
        cumulative = cstar + mp.fsum(
            mp.quad(lambda t: (discrepancy(t) - tail(t)) * derivative, [a, b])
            for a, b in zip(breaks, breaks[1:])
        )
        combined = -2 - mp.euler - mp.log(mp.pi) - mp.fsum(
            mp.quad(
                lambda t: delta(t)
                * mp.e ** (t / 2)
                * (derivative - correlation(t) / 2),
                [a, b],
            )
            for a, b in zip(breaks, breaks[1:])
        )
        self.assertLess(abs(cumulative - combined), mp.mpf("1e-50"))

    def test_tail_derivative_cancellation(self) -> None:
        mp.mp.dps = 70

        def B(t: mp.mpf) -> mp.mpf:
            return mp.e ** (-t / 2) * mp.log(1 - mp.e ** (-2 * t)) / 2

        def H(t: mp.mpf) -> mp.mpf:
            r = mp.e ** (-t / 2)
            return mp.log((1 + r) / (1 - r)) / 2 + mp.atan(r) - 2 * r

        for t in (mp.mpf("0.03"), mp.mpf("0.7"), mp.mpf(4)):
            residual = mp.diff(B, t) + mp.diff(H, t) + B(t) / 2
            self.assertLess(abs(residual), mp.mpf("1e-60"))

    def test_fks_boundary_exponent_is_uniform(self) -> None:
        alpha = mp.mpf("0.8476836")
        lower = mp.mpf("0.5") - alpha**2 / 24
        self.assertGreater(lower, mp.mpf("0.25"))
        for t in (mp.mpf("0.01"), mp.log(2), mp.mpf(10), mp.mpf(1000)):
            logarithmic_derivative = (
                mp.mpf("0.5") + 3 / (2 * t) - alpha / (2 * mp.sqrt(t))
            )
            self.assertGreaterEqual(logarithmic_derivative, lower)

    def test_history_split_has_nonreversed_interval(self) -> None:
        for lam in (mp.sqrt(2), mp.mpf(2), mp.mpf(10)):
            length = 2 * mp.log(lam)
            self.assertGreaterEqual(length, mp.log(2))
        self.assertIn("\\lambda\\geq\\sqrt2", self.text)

    def test_fixed_mode_boundary_graph_bound(self) -> None:
        mp.mp.dps = 60
        for length, n in ((mp.mpf(5), 0), (mp.mpf(9), 2), (mp.mpf(20), 7)):
            t0 = mp.log(2)
            frequency = 2 * mp.pi * n / length

            def J(t: mp.mpf) -> mp.mpf:
                c = 2 * (1 - t / length) * mp.cos(frequency * t)
                cp = (
                    -2 * mp.cos(frequency * t) / length
                    - 2 * (1 - t / length) * frequency * mp.sin(frequency * t)
                )
                return cp - c / 2

            actual = mp.quad(
                lambda t: mp.e ** (-(length - t) / 4) * abs(J(t)),
                [t0, length],
            )
            bound = 24 / length + 64 * mp.pi * abs(n) / length**2
            self.assertLessEqual(actual, bound)

    def test_polynomial_shift_cannot_meet_fks_resolution_condition(self) -> None:
        alpha = mp.mpf("0.8476836")
        for exponent in (0, 2, 10):
            ratios = []
            for length in (mp.mpf(100), mp.mpf(400), mp.mpf(1600)):
                lam = mp.e ** (length / 2)
                threshold = lam * mp.sqrt(length) * mp.e ** (-alpha * mp.sqrt(length))
                ratios.append(threshold / length**exponent)
            self.assertGreater(ratios[1], ratios[0])
            self.assertGreater(ratios[2], ratios[1])

    def test_scope_and_required_formulas(self) -> None:
        required = (
            "full boundary-gauged multiplier numerator",
            "\\kappa_0=-2-\\gamma-\\log\\pi",
            "\\mathcal H_L(f)",
            "boundary-layer graph load",
            "does not resolve the pure-edge lower-shift",
            "actual-symbol near-extremizer",
            "No actual lower-Ritz sign",
            "remains `P0_INVALIDATED`",
            "standard eight are",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_displayed_tex_ascii_and_whitespace(self) -> None:
        self.assertNotIn("\t", self.text)
        self.assertTrue(all(ord(ch) < 128 for ch in self.text))
        self.assertFalse(any(line.endswith((" ", "\t")) for line in self.text.splitlines()))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        for display in displays:
            self.assertNotIn("$", display)
            self.assertEqual(display.count("{"), display.count("}"))
            self.assertEqual(display.count("\\begin"), display.count("\\end"))

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
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
