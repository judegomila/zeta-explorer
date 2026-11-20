#!/usr/bin/env python3
"""Regressions for the subturning first-cherry global Wiener barrier."""

from __future__ import annotations

import ast
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
NOTE = ROOT / "notes" / "SUBTURNING_FIRST_CHERRY_GLOBAL_WIENER_CLOSURE_BARRIER.md"
NOTE_HASH = "e842c084080a4d2a2c101bbb6b113031151065c527685c43095ee5a0ab2b04f7"

FROZEN = {
    "notes/SUBTURNING_LAPLACE_VOLTERRA_TURNING_RESONANCE_BARRIER.md":
        "0c702f4adc6e6487d0511ce6f1dcce308996c943ff52423d100546288b4a3127",
    "tests/test_subturning_laplace_volterra_turning_resonance_barrier.py":
        "bd93da5b3d322cb95d878fff85650f070c1b3f1377349881a246938ddd268622",
    "notes/SUBTURNING_MINIMAL_RICCATI_EULER_CLOSURE_BARRIER.md":
        "faa787a3cc96fe83f41aeeec44b868feaa1e6755b90b925921e2448c3e029ac8",
    "tests/test_subturning_minimal_riccati_euler_closure_barrier.py":
        "6b2e347793020deb48730a3d11ce36c1f8f926e2c63768f376f1c4bbbd54a204",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def action(c_value: mp.mpf, s_value: mp.mpc) -> mp.mpc:
    scaled = s_value / (2 * c_value)
    return c_value * (
        mp.sqrt(1 + scaled * scaled)
        - 1
        - scaled * mp.asinh(scaled)
    )


def polynomial(label: int, s_value: mp.mpc) -> mp.mpc:
    if label == 0:
        return mp.mpc(1)
    if label == 4:
        return 4 * s_value * (s_value - 1) + 3
    raise ValueError(label)


def alpha(label: int, c_value: mp.mpf, s_value: mp.mpc) -> mp.mpc:
    return (
        (s_value + 2)
        / (s_value + 1)
        * polynomial(label, s_value + 4)
        / polynomial(label, s_value)
        * mp.exp(
            action(c_value, s_value + label + 3)
            - action(c_value, s_value + label - 1)
        )
    )


def green_at_zero(
    label: int,
    c_value: mp.mpf,
    sigma: mp.mpf = mp.mpf(0),
) -> tuple[mp.mpc, mp.mpf]:
    """Sum K(0) far enough past the c^(1/3) turning scale."""
    one_third = mp.mpf(1) / 3
    scale = int(mp.ceil(c_value**one_third))
    cutoff = 18 * scale + 160
    s_value = 3 + sigma + 2j * c_value
    term = mp.mpc(1)
    total = mp.mpc(1)
    for index in range(cutoff):
        term *= -alpha(label, c_value, s_value + 2 * index)
        total += term
    return total, abs(term)


class SubturningFirstCherryGlobalWienerClosureBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 45
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 4)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_telescoping_of_the_action_product(self) -> None:
        c_value = mp.mpf("317.25")
        s_value = mp.mpc("4.125", "83.5")
        for label in (0, 4):
            for count in (1, 2, 7, 19):
                direct = mp.mpc(1)
                rational_product = mp.mpc(1)
                for index in range(count):
                    direct *= alpha(label, c_value, s_value + 2 * index)
                    rational_product *= (
                        (s_value + 2 * index + 2)
                        / (s_value + 2 * index + 1)
                    )
                rational_product *= (
                    polynomial(label, s_value + 2 * count)
                    * polynomial(label, s_value + 2 * count + 2)
                    / (
                        polynomial(label, s_value)
                        * polynomial(label, s_value + 2)
                    )
                )
                q_value = s_value + label + 1
                telescoped = rational_product * mp.exp(
                    action(c_value, q_value + 2 * count - 2)
                    + action(c_value, q_value + 2 * count)
                    - action(c_value, q_value - 2)
                    - action(c_value, q_value)
                )
                self.assertLess(abs(direct - telescoped), mp.mpf("1e-38"))

    def test_exact_atom_resolvent_identity(self) -> None:
        c_value = mp.mpf("125")
        s_value = mp.mpc("4.5", "19")
        for label in (0, 4):
            for u_value in (mp.mpf("0.15"), mp.mpf("0.75")):
                z_value = mp.exp(-2 * u_value)

                def k_sum(base: mp.mpc) -> mp.mpc:
                    term = mp.mpc(1)
                    total = mp.mpc(1)
                    for index in range(500):
                        term *= -z_value * alpha(
                            label, c_value, base + 2 * index
                        )
                        total += term
                    return total

                residual = (
                    k_sum(s_value)
                    + z_value
                    * alpha(label, c_value, s_value)
                    * k_sum(s_value + 2)
                    - 1
                )
                self.assertLess(abs(residual), mp.mpf("1e-38"))

    def test_local_log_alpha_turning_expansion(self) -> None:
        target = mp.mpc(-2, 2)
        previous = {label: mp.inf for label in (0, 4)}
        for c_text in ("1e4", "1e6", "1e8"):
            c_value = mp.mpf(c_text)
            scale = c_value ** (mp.mpf(1) / 3)
            for label in (0, 4):
                worst = mp.mpf(0)
                for x_value in (mp.mpf("0.25"), mp.mpf(1), mp.mpf(3)):
                    index = int(mp.floor(x_value * scale))
                    delay = mp.mpf(index) + mp.mpf(label + 4) / 2
                    s_value = 3 + 2j * c_value + 2 * index
                    scaled = mp.log(-alpha(label, c_value, s_value)) * mp.sqrt(
                        c_value / delay
                    )
                    worst = max(worst, abs(scaled - target))
                self.assertLess(worst, previous[label])
                previous[label] = worst
        self.assertLess(previous[0], mp.mpf("1.3e-5"))
        self.assertLess(previous[4], mp.mpf("4.8e-5"))

    def test_exact_asymptotic_constant(self) -> None:
        coefficient = mp.mpf(4) / 3 * (1 - 1j)
        exact = (
            mp.mpf(2)
            / 3
            * mp.gamma(mp.mpf(2) / 3)
            * coefficient ** (-mp.mpf(2) / 3)
        )
        reference = mp.mpc(
            "0.512224139295997583307998901301",
            "0.295732744707968569360267335261",
        )
        self.assertLess(abs(exact - reference), mp.mpf("1e-30"))
        self.assertLess(
            abs(abs(exact) ** 2 - mp.mpf("0.349831425170034047466207449850")),
            mp.mpf("1e-30"),
        )

    def test_high_precision_turning_regressions(self) -> None:
        expected = {
            ("1e3", 0): "0.256914836842098812",
            ("1e3", 4): "0.193599553122673604",
            ("1e6", 0): "0.336392206868318410",
            ("1e6", 4): "0.320882142887321916",
            ("1e9", 0): "0.348353066802846177",
            ("1e9", 4): "0.346451402680278462",
        }
        ratios = {label: [] for label in (0, 4)}
        for c_text in ("1e3", "1e6", "1e9"):
            c_value = mp.mpf(c_text)
            for label in (0, 4):
                green, tail = green_at_zero(label, c_value)
                ratio = abs(green * (1 - green)) / (
                    c_value ** (mp.mpf(2) / 3)
                )
                self.assertLess(
                    abs(ratio - mp.mpf(expected[(c_text, label)])),
                    mp.mpf("5e-16"),
                )
                self.assertLess(tail, mp.mpf("2e-44"))
                ratios[label].append(ratio)
        for label in (0, 4):
            self.assertEqual(ratios[label], sorted(ratios[label]))
            self.assertGreater(ratios[label][-1], mp.mpf("0.345"))

    def test_fixed_positive_sigma_has_the_same_limit(self) -> None:
        c_value = mp.mpf("1e9")
        limit = mp.mpf("0.349831425170034047466207449850")
        for label in (0, 4):
            green, tail = green_at_zero(label, c_value, sigma=mp.mpf(1))
            ratio = abs(green * (1 - green)) / (
                c_value ** (mp.mpf(2) / 3)
            )
            self.assertLess(abs(ratio - limit), mp.mpf("0.004"))
            self.assertLess(tail, mp.mpf("2e-44"))

    def test_turning_height_and_measure_bound_geometry(self) -> None:
        previous = 0.0
        for c_value in (1.0e4, 1.0e8, 1.0e12):
            ratio = (2.0 * c_value) / (2.0 * c_value**0.75)
            self.assertAlmostEqual(ratio, c_value**0.25)
            self.assertGreater(ratio, previous)
            previous = ratio
        for sigma in (0.25, 1.0, 3.0):
            for delay in (0.0, 0.5, 7.0):
                self.assertLessEqual(math.exp(-sigma * delay), 1.0)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 25)
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

    def test_static_hygiene_cache_and_fail_closed_scope(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(all(line == line.rstrip(b" ") for line in raw.splitlines()))

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "does **not** close or disprove `CL` itself",
            "low-band atom or bilinear pointwise bounds",
            "Those bounds are context only",
            "first exact class-invariance test",
            "analytic continuation",
            "identity theorem",
            "global positive-support Laplace/Wiener terminal class",
            "alternating mode `e^(i*pi*s/2)`",
            "one `t` derivative",
            "genuinely band-local all-tree Closure Lemma `CL` remains the exact open step",
            "unbound post-checkpoint-1.46 theorem/barrier note/test pair",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "Closure Lemma CL is false",
            "all band-local norms fail",
            "the conditional factorization is false",
            "the Birkhoff connection estimate follows",
            "the Riemann hypothesis is proved",
            "RH follows",
        )
        lowered = normalized.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), lowered)

        cache = ROOT / "tests" / "__pycache__"
        if cache.exists():
            matching = list(cache.glob(f"{test_path.stem}.*.pyc"))
            self.assertEqual(matching, [])


if __name__ == "__main__":
    unittest.main()
