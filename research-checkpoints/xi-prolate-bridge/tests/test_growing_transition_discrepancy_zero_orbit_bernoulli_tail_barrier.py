#!/usr/bin/env python3
"""Regressions for the discrepancy zero-orbit/Bernoulli-tail barrier."""

from __future__ import annotations

import cmath
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
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_DISCREPANCY_ZERO_ORBIT_BERNOULLI_TAIL_BARRIER.md"
)


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def s_scalar(u: complex, v: complex) -> float:
    return float(2 * (u.conjugate() * v).real)


class DiscrepancyZeroOrbitBernoulliTailBarrierTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_post_checkpoint_116_dependencies(self) -> None:
        expected = {
            "notes/GROWING_TRANSITION_MIXED_WEBER_ORDINARY_ENDPOINT_OBSTRUCTION_THEOREM.md": "45615e23dcb698c69d757de136a596a59ee12cfa913d1931942ba90e7ee539c9",
            "tests/test_growing_transition_mixed_weber_ordinary_endpoint_obstruction_theorem.py": "fbe130ffb9b44798455cc06be1d265a10a80a7a75002a748e731ef8c235a99dc",
            "notes/GROWING_TRANSITION_ORDERED_PRIME_MOVING_DIVISOR_DENSITY_DISCREPANCY_VOLTERRA_THEOREM.md": "3c2005552a6c18919f31391d64a33d54be0ce51fc8a9190474fec58b06477f83",
            "tests/test_growing_transition_ordered_prime_moving_divisor_density_discrepancy_volterra_theorem.py": "ba54a785c91db4898a4243c99253a540b8ba855e4243eba41836b950398d658e",
            "notes/GROWING_TRANSITION_HADAMARD_PICK_CARRIER_RH_EQUIVALENCE_THEOREM.md": "092d0adefb7bafea8d931a2741299d19feef2a45ccc3d243c3543765fdf5cff7",
            "tests/test_growing_transition_hadamard_pick_carrier_rh_equivalence_theorem.py": "d15fff20bc0aa62ad63903b6c17e64b11ecba3ab965f179c82086e261c398b43",
            "notes/GROWING_TRANSITION_GLOBAL_RADICAL_SECTOR_MIXING_FEATURE_GEOMETRY_BARRIER.md": "976f9299c4d002db3f0b73f0b4da8cc383480c8b55b7ea5ccdc219d9135fbdc4",
            "tests/test_growing_transition_global_radical_sector_mixing_feature_geometry_barrier.py": "61837a5180eac8fe307eca05578315066c39148c9d2dea143c6b1f7628e77b4d",
            "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md": "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
            "P3_SOURCE_LOCK.json": "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
            "tests/test_chebyshev_hankel_bound.py": "ce931fc6a5b6d9af78abf6ed278d733d434e0041f2c84231345ab2e7c0d3d1f1",
        }
        for relative, digest in expected.items():
            path = ROOT / relative
            self.assertTrue(path.is_file(), relative)
            self.assertEqual(sha256(path), digest, relative)

    def test_completion_constants_and_digamma_expansion(self) -> None:
        mp.mp.dps = 60
        b_xi = -1 - mp.euler / 2 + mp.log(4 * mp.pi) / 2
        c_gamma = mp.mpf("0.5") - mp.euler / 2 - mp.log(mp.pi) / 2
        c_star = mp.mpf("1.5") - mp.log(2 * mp.pi)
        self.assertLess(abs(c_gamma - b_xi - c_star), mp.mpf("1e-55"))

        z = mp.mpf("1.7") + mp.mpf("0.31") * 1j
        arch = (
            1 / (1 + z)
            + mp.digamma((1 + z) / 2) / 2
            - mp.log(mp.pi) / 2
        )
        partial = c_gamma + mp.fsum(
            1 / (2 * nu + 2) - 1 / (z + 2 * nu + 1)
            for nu in range(1, 200000)
        )
        self.assertLess(abs(arch - partial), mp.mpf("3e-6"))

        def xi(s: mp.mpc) -> mp.mpc:
            return (
                s
                * (s - 1)
                * mp.power(mp.pi, -s / 2)
                * mp.gamma(s / 2)
                * mp.zeta(s)
                / 2
            )

        f_value = mp.diff(xi, 1 + z) / xi(1 + z)
        completed = -f_value + arch
        euler = -mp.diff(mp.zeta, 1 + z) / mp.zeta(1 + z) - 1 / z
        self.assertLess(abs(completed - euler), mp.mpf("1e-50"))

    def test_finite_slot_laplace_convolution_factor(self) -> None:
        mp.mp.dps = 50
        length = mp.mpf("2.3")
        p = mp.mpf("0.8") + mp.mpf("0.2") * 1j
        q = mp.mpf("1.1") - mp.mpf("0.15") * 1j
        z = mp.mpf("0.7") + mp.mpf("0.4") * 1j
        ca = mp.mpf("1.2") - mp.mpf("0.3") * 1j
        cb = mp.mpf("0.6") + mp.mpf("0.9") * 1j

        a_bar_z = ca * (1 - mp.e ** (-(p + mp.conj(z)) * length)) / (
            p + mp.conj(z)
        )
        b_z = cb / (q + z)
        factored = mp.conj(a_bar_z) * b_z
        direct = mp.quad(
            lambda s: mp.conj(ca * mp.e ** (-p * s))
            * mp.e ** (-z * s),
            [0, length],
        ) * mp.quad(lambda t: cb * mp.e ** (-(q + z) * t), [0, mp.inf])
        self.assertLess(abs(factored - direct), mp.mpf("1e-45"))

    def test_rh_pair_collapses_only_after_reflected_rows(self) -> None:
        epsilon = -1
        s = 1.37
        ell = 0.82
        t = epsilon * cmath.exp(2j * s * ell)
        a_bar = 0.7 - 1.1j
        b_bar = -0.2 + 0.9j
        a_rho = a_bar / t
        b_rho = -a_bar - t * b_bar

        upper_pair = -a_rho.conjugate() * b_bar - a_bar.conjugate() * b_rho
        self.assertAlmostEqual(upper_pair.real, abs(a_bar) ** 2, places=13)
        self.assertAlmostEqual(upper_pair.imag, 0.0, places=13)
        hermitian_pair = -s_scalar(a_rho, b_bar) - s_scalar(a_bar, b_rho)
        self.assertAlmostEqual(hermitian_pair, 2 * abs(a_bar) ** 2, places=13)
        self.assertGreater(abs(b_bar + a_rho), 1e-3)

    def test_both_physical_radical_phases_and_central_parity(self) -> None:
        epsilon = 1
        s = 1.21 + 0.17j
        ell = 0.73
        t = epsilon * cmath.exp(2j * s * ell)
        u = epsilon * cmath.exp(2j * s.conjugate() * ell)

        b_rho = 0.8 - 0.4j
        b_one_minus_rho = -0.2 + 1.1j
        a_one_minus_rho = -b_rho - t * b_one_minus_rho
        a_rho = epsilon * cmath.exp(-2j * s * ell) * a_one_minus_rho

        b_one_minus_bar_rho = 0.3 + 0.6j
        b_bar_rho = -1.2 + 0.2j
        a_bar_rho = -b_one_minus_bar_rho - u * b_bar_rho
        a_one_minus_bar_rho = (
            epsilon * cmath.exp(-2j * s.conjugate() * ell) * a_bar_rho
        )

        x_s = cmath.exp(-1j * s * ell) * a_one_minus_rho
        o_s = (
            cmath.exp(-1j * s * ell) * b_rho
            + epsilon * cmath.exp(1j * s * ell) * b_one_minus_rho
        )
        x_bar_s = cmath.exp(-1j * s.conjugate() * ell) * a_bar_rho
        o_bar_s = (
            cmath.exp(-1j * s.conjugate() * ell) * b_one_minus_bar_rho
            + epsilon * cmath.exp(1j * s.conjugate() * ell) * b_bar_rho
        )
        self.assertLess(abs(x_s + o_s), 1e-13)
        self.assertLess(abs(x_bar_s + o_bar_s), 1e-13)
        self.assertLess(abs(a_rho - a_one_minus_rho / t), 1e-13)
        self.assertLess(abs(a_one_minus_bar_rho - a_bar_rho / u), 1e-13)

    def test_off_line_quartet_exchange_signature(self) -> None:
        u = (1 + 2j, -0.3 + 0.8j, 1.2 - 0.4j, -0.5 - 0.7j)
        v = (0.4 - 0.2j, 1.1 + 0.3j, -0.8 + 0.6j, 0.9 - 1.4j)
        row_cross = -sum(s_scalar(left, right) for left, right in zip(u, v))
        block_cross = sum(
            left.conjugate() * (-right) + right.conjugate() * (-left)
            for left, right in zip(u, v)
        ).real
        self.assertAlmostEqual(row_cross, block_cross, places=13)

        w = (1 - 1j, 2 + 0.5j, -0.2 + 0.7j, 0.9)
        positive = sum(abs(value) ** 2 for value in w) * 2
        q_plus = -sum(
            s_scalar(left, right) for left, right in zip(w, (-x for x in w))
        )
        q_minus = -sum(s_scalar(left, left) for left in w)
        self.assertAlmostEqual(q_plus, positive, places=13)
        self.assertAlmostEqual(q_minus, -positive, places=13)

    def test_exact_mertens_tail_integration_by_parts_model(self) -> None:
        mp.mp.dps = 50
        cutoff = mp.mpf("1.3")

        def delta(r: mp.mpf) -> mp.mpf:
            return mp.e ** (-r) * (1 + mp.sin(r) / 5)

        def delta_prime(r: mp.mpf) -> mp.mpf:
            return mp.e ** (-r) * (-1 - mp.sin(r) / 5 + mp.cos(r) / 5)

        def phi(r: mp.mpf) -> mp.mpf:
            return (1 + r) * mp.e ** (-2 * r)

        def phi_prime(r: mp.mpf) -> mp.mpf:
            return (-1 - 2 * r) * mp.e ** (-2 * r)

        left = mp.quad(lambda r: phi(r) * delta_prime(r), [cutoff, mp.inf])
        right = -delta(cutoff) * phi(cutoff) - mp.quad(
            lambda r: delta(r) * phi_prime(r), [cutoff, mp.inf]
        )
        self.assertLess(abs(left - right), mp.mpf("1e-45"))

    def test_bernoulli_derivative_constants(self) -> None:
        mp.mp.dps = 50
        self.assertLess(
            abs(mp.quad(lambda u: (mp.mpf("0.5") - u) ** 2, [0, 1]) - mp.mpf(1) / 12),
            mp.mpf("1e-45"),
        )
        self.assertLess(
            abs(
                mp.quad(lambda u: abs(mp.mpf("0.5") - u), [0, mp.mpf("0.5"), 1])
                - mp.mpf(1) / 4
            ),
            mp.mpf("1e-45"),
        )

        lam = mp.mpf("2.5")
        area = lam * lam
        kappa = mp.mpf("1.7")
        time = mp.mpf("0.37")
        x = area * mp.e ** time
        frac = x - mp.floor(x)
        p_saw = mp.mpf("0.5") - frac
        b2 = frac * frac - frac + mp.mpf(1) / 6
        exact_lead_derivative = (
            -mp.sqrt(lam) * kappa * p_saw / 2
            - kappa * mp.e ** (-time) * b2 / (4 * lam ** mp.mpf("1.5"))
        )

        def leading_profile(t: mp.mpf) -> mp.mpf:
            xx = area * mp.e ** t
            uu = xx - mp.floor(xx)
            bernoulli = uu * uu - uu + mp.mpf(1) / 6
            return kappa * mp.e ** (-t) * bernoulli / (4 * lam ** mp.mpf("1.5"))

        numerical = mp.diff(leading_profile, time)
        self.assertLess(abs(numerical - exact_lead_derivative), mp.mpf("1e-35"))

    def test_required_scope_factor_and_barrier_tokens(self) -> None:
        required = (
            "\\sigma:=hC",
            "T_L={A^{hC}\\over L^{2m}}={A^\\sigma\\over L^{2m}}",
            "C_*= {3\\over2}-\\log(2\\pi)",
            "C_*\\delta_0",
            "canonical genus-one zero ordering",
            "individual delta coefficients must not be summed",
            "\\mathcal A_{L,1-\\bar\\rho}^*\\mathcal B_{1-\\rho}",
            "Q_X^\\uparrow\n =-2\\sum_\\rho^{\\rm can}",
            "coefficient `-2` in the\nupper form becomes coefficient `-1`",
            "P_E(Q_D+Q_{\\rm cont})P_E",
            "T_{D,L}(z)",
            "`Re alpha,Re beta>0` and `alpha!=beta`",
            "continuous divided-difference limit",
            "\\widehat X(z)=e^{-iz\\ell}",
            "\\widehat O(z)=e^{-iz\\ell}",
            "false single-row relation",
            "\\Sigma_{\\rm row,\\mathfrak o}",
            "\\langle Z_Ox,\\Sigma Z_Oy\\rangle_{\\mathfrak Z}",
            "uniformly bounded,\nsource-compatible intertwiner",
            "form core dense enough",
            "\\mathcal W_L(R)",
            "\\operatorname {Herm}\\mathcal W_L(R_L)",
            "K_{\\rm FKS}",
            "`mathfrak a(L)=0`",
            "J_L(f):=\\mathfrak b_f'(0)",
            "Three integrations by parts",
            "\\mathcal C_{L,R}(x,y)",
            "termwise mixed-Weber",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_no_absolute_zero_sum_or_rh_overclaim(self) -> None:
        forbidden = (
            "absolutely convergent zero-row sum",
            "ordinary absolutely convergent infinite-prime Hilbert feature is asserted",
            "B_(bar rho)=-A_rho` is true",
            "the seven-dimensional spaces `E=E_lambda` are dense",
            "This theorem proves RH",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)
        self.assertNotIn("probe `a(s)=e^(-ps)", self.text)
        self.assertNotIn("Twice integrating its additive Fourier", self.text)
        self.assertIn("inherited source/Abel and canonical zero-orbit\nordering", self.text)
        self.assertIn("no new sign for `Q_X`", self.text)

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
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
        starts = re.findall(r"(?m)^\s*\\\[\s*$", self.text)
        ends = re.findall(r"(?m)^\s*\\\]\s*$", self.text)
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
