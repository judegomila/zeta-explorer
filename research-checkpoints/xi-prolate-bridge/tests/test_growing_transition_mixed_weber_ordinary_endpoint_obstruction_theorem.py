#!/usr/bin/env python3
"""Regressions for the mixed-Weber ordinary-endpoint obstruction."""

from __future__ import annotations

import hashlib
import math
import pathlib
import re
import shutil
import subprocess
import tempfile
import unittest

import mpmath as mp


ROOT = pathlib.Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_MIXED_WEBER_ORDINARY_ENDPOINT_OBSTRUCTION_THEOREM.md"


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class MixedWeberOrdinaryEndpointObstructionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_frozen_dependencies(self) -> None:
        expected = {
            "notes/GROWING_TRANSITION_CURVED_TWO_ENDPOINT_FIO_SHELL_THEOREM.md": "ddb1769d6e6f2b3214cb8191d631a161a1312f18c5bfbba4ca2ad11bb9f93341",
            "tests/test_growing_transition_curved_two_endpoint_fio_shell_theorem.py": "8d6bf688ffc938691789a558900ac95467a6631203f5fd262a5f4356431422cb",
            "notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md": "7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564",
            "tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py": "caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c",
            "notes/GROWING_TRANSITION_ORDERED_PRIME_EDGE_UNION_MOVING_DIVISOR_REDUCTION_THEOREM.md": "47dd1decdb3a099cdb15ad929426d293f3f34ccb799b177ae02308c2051fa68c",
            "tests/test_growing_transition_ordered_prime_edge_union_moving_divisor_reduction_theorem.py": "6b37ecbf1534d0d140294bb995d0be1ad1da39a185ae4e5ae32bf7aee49fcdb6",
            "notes/GROWING_TRANSITION_ORDERED_PRIME_MOVING_DIVISOR_DENSITY_DISCREPANCY_VOLTERRA_THEOREM.md": "3c2005552a6c18919f31391d64a33d54be0ce51fc8a9190474fec58b06477f83",
            "tests/test_growing_transition_ordered_prime_moving_divisor_density_discrepancy_volterra_theorem.py": "ba54a785c91db4898a4243c99253a540b8ba855e4243eba41836b950398d658e",
        }
        for relative, digest in expected.items():
            path = ROOT / relative
            self.assertTrue(path.is_file(), relative)
            self.assertEqual(sha256(path), digest, relative)

    def test_exact_quarter_lattice_and_affine_geometry(self) -> None:
        A = 100.25
        c = 2 * math.pi * A
        m = 97
        q = 106
        r = A - m
        s = q - A
        d = r + s
        eta = q / m
        self.assertAlmostEqual(r % 1, 0.25)
        self.assertAlmostEqual(s % 1, 0.75)
        self.assertEqual(d, q - m)

        R = 2 * math.pi * r
        self.assertAlmostEqual(c * (eta - 1) - eta * R, 2 * math.pi * s)
        K = c * (eta * eta - 1)
        for fraction in (0.0, 0.2, 0.7, 1.0):
            U = fraction * R
            V = c * (eta - 1) - eta * U
            P = 2 * U - U * U / c
            Q = 2 * V + V * V / c
            self.assertAlmostEqual(Q, K - eta * eta * P, places=10)

        U0 = c * (eta - 1) / eta
        self.assertAlmostEqual(U0 - R, 2 * math.pi * m * s / q)

    def test_flat_carrier_coefficient_modulus(self) -> None:
        mp.mp.dps = 50
        h0 = mp.pi / 4
        for gamma in (-40, -3, 5, 31):
            a = mp.mpf("0.5") - 1j * gamma / 4
            coefficient = mp.power(2j, -a) / mp.gamma(1 - a)
            expected = (1 + mp.e ** (-2 * h0 * gamma)) / (4 * mp.pi)
            relative = abs(abs(coefficient) ** 2 - expected) / expected
            self.assertLess(relative, mp.mpf("1e-40"))

    def test_incomplete_beta_has_no_oriented_gain(self) -> None:
        mp.mp.dps = 50
        alpha = mp.mpf(100)
        beta = mp.mpf(20)
        x = mp.mpf("0.4")
        a = mp.mpf("0.5") - 1j * alpha / 4
        b = mp.mpf("0.5") + 1j * beta / 4
        partial = mp.betainc(a, b, 0, x)
        complete = mp.beta(a, b)
        leading = (
            4j
            * mp.sqrt(x * (1 - x))
            / (alpha * (1 - x) + beta * x)
            * x ** (-1j * alpha / 4)
            * (1 - x) ** (1j * beta / 4)
        )
        self.assertLess(abs(partial - leading) / abs(partial), mp.mpf("0.03"))
        self.assertGreater(abs(partial / complete), mp.mpf("1e5"))
        complement = mp.betainc(b, a, 0, 1 - x)
        self.assertLess(abs(partial + complement - complete), mp.mpf("1e-45"))

    def test_exact_counterterm_and_scope_tokens(self) -> None:
        required = (
            "T^{\\rm ord}_{mq}",
            "I^c_{mq}+T^{\\rm ord}_{mq}",
            "flat-principal\nobstruction",
            "no such promotion is\nclaimed here",
            "finite flat-principal jet\ncannot replace",
            "does not assert a new upper bound for the raw curved kernel",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)
        self.assertNotRegex(self.text, re.compile(r"\\bproves RH\\b", re.IGNORECASE))

    def test_slow_pair_and_post_loss_mesoscopic_choice(self) -> None:
        required = (
            "The slow `-/-` carrier is the complex conjugate",
            "2\\operatorname {Re}",
            "paired real quantity (4.3a)",
            "M>\\max\\{16,2(K+1)\\}",
            "remaining two flat carrier products",
            "adding all asymptotic matching remainders",
            "L^K/sqrt(d)=o(L^(-1))",
            "No corresponding\nstatement for the exact curved remainder",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_coherent_gamma_and_density_gate_tokens(self) -> None:
        required = (
            "\\mathfrak a_x(L)",
            "\\lambda\\Gamma_{\\rm out}(x)=0",
            "including both `m<=A` and\n`m>A`",
            "pairwise carrier integration",
            "Q_{\\rm mov}=\\mathsf S(\\mathfrak a,",
            "`mu=dr+mu_D`",
            "\\mathsf S(\\mathcal A_0,\\mathcal B_0)",
            "termwise split",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = pathlib.Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_ascii_balanced_displays_unique_tags_and_no_artifacts(self) -> None:
        starts = re.findall(r"(?m)^\\s*\\\[\\s*$", self.text)
        ends = re.findall(r"(?m)^\\s*\\\]\\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in data))
        self.assertNotIn("__pycache__", self.text)
        self.assertNotIn(".pyc", self.text)
        self.assertNotIn("PENDING_STRICT_AUDIT", self.text)


if __name__ == "__main__":
    unittest.main()
