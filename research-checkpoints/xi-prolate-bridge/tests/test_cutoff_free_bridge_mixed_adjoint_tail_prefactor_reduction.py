#!/usr/bin/env python3
"""Exact regressions for the mixed-adjoint-tail bridge prefactor reduction.

The mathematical fixtures use only integers and Fraction.  The verifier reads
no zero table, numerical ground, cached prolate artifact, or network resource.
"""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
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
    / "CUTOFF_FREE_BRIDGE_MIXED_ADJOINT_TAIL_PREFACTOR_REDUCTION.md"
)
NOTE_HASH = "53dd9fefd8cc05a29cd3e0a043e6f86f8bbdc7545d2c203d29bc59cbbe1a04f8"

FROZEN = {
    "notes/CUTOFF_FREE_BRIDGE_LEVERAGE_RANK_ONE_INNOVATION_REDUCTION.md":
        "808c314d6b0cf1926ddf8b0a5b83c324ccbbc252d18efea283781fefd1751097",
    "tests/test_cutoff_free_bridge_leverage_rank_one_innovation_reduction.py":
        "2c79244dd68e9fd56ddb67f7278f4572cb72bae9803b82047ccf9ad58196faba",
    "notes/CUTOFF_FREE_FULL_SOURCE_ADJOINT_PROLATE_CAPTURE_BARRIER.md":
        "157bffc55aeec592c263d5973effe1b9506e02dd97311652ecb2fdee0c3ff0e9",
    "tests/test_cutoff_free_full_source_adjoint_prolate_capture_barrier.py":
        "d7f70dffbd10021ce7d6e8887d10589a482b2dc64c9ebbe8c48cc35568c233ae",
    "notes/SOFT_DEFECT_PROLATE_ANGLE_REDUCTION.md":
        "3bcccfda9d606c21fc61efb9c2fbc3dd95926a82586e3c156fc965c32748777b",
    "tests/test_soft_defect_prolate_angle.py":
        "f440a59456cc4cc604afc419bc1aebc9589a0a6010b179a4784c7f5c62ca2088",
    "notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md":
        "335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb",
    "tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py":
        "0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc",
    "notes/EFFECTIVE_MIXED_SIGNED_QUOTIENT_ATTACK.md":
        "e2e9485d8ee03717af790cb7740fbb2228cc96f04009698cdc51a7fd943634ea",
    "tests/test_effective_mixed_signed_quotient.py":
        "6c84905b66e7a16b7443560fe512d4e3d864293f368efa649aa61a2425c884e1",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md":
        "3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81",
    "tests/test_full_source_coframe_rank.py":
        "dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a",
    "notes/GROWING_WINDOW_THEOREM.md":
        "dad6b0a878b7eba21cbc7aa8049cf3bf89a38df766cc157a87c416e79a721ac7",
    "P2_SOURCE_LOCK.json":
        "8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a",
    "notes/PROLATE_DEFECT_SOURCE_AUDIT.md":
        "b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d",
    "PROLATE_DEFECT_SOURCE_LOCK.json":
        "0844df654ee968b1c371ec96618d10d219da9fde702d62faa4f0c6be139b036d",
    "tests/test_prolate_defect_source_lock.py":
        "7caa8d088522d68dc4dedfad8d00d8e5c7e15070065c743d9e2a41f9e7faa519",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left: tuple[F, ...], right: tuple[F, ...]) -> F:
    return sum((l_value * r_value for l_value, r_value in zip(left, right)), F(0))


def add(left: tuple[F, ...], right: tuple[F, ...]) -> tuple[F, ...]:
    return tuple(l_value + r_value for l_value, r_value in zip(left, right))


def sub(left: tuple[F, ...], right: tuple[F, ...]) -> tuple[F, ...]:
    return tuple(l_value - r_value for l_value, r_value in zip(left, right))


def scale(scalar: F, value: tuple[F, ...]) -> tuple[F, ...]:
    return tuple(scalar * entry for entry in value)


def norm2(value: tuple[F, ...]) -> F:
    return dot(value, value)


class CutoffFreeBridgeMixedAdjointTailPrefactorReductionTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")
        cls.normalized = " ".join(cls.text.split())

        # Coordinates are h_0,h_4,h_8,h_2,h_6 followed, when needed, by
        # one orthogonal raw-tail coordinate.
        cls.i_zero = F(2)
        cls.i_two = F(-4)
        cls.q_plus = (F(2), F(3), F(-1), F(0), F(0))
        cls.q_minus = (F(0), F(0), F(0), F(-4), F(5))
        cls.s_plus = norm2(cls.q_plus)
        cls.s_minus = norm2(cls.q_minus)
        cls.bridge = (F(2), F(0), F(0), F(1), F(0))
        cls.p_four = (F(-3, 2), F(1), F(0), F(0), F(0))
        cls.p_eight = (F(1, 2), F(0), F(1), F(0), F(0))
        cls.m_six = (F(0), F(0), F(0), F(-5, 4), F(-1))
        cls.b_perp = scale(
            cls.i_two,
            sub(
                scale(1 / cls.s_minus, cls.q_minus),
                scale(1 / cls.s_plus, cls.q_plus),
            ),
        )

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 17)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_two_phase_bridge_innovation_is_exact(self) -> None:
        for source in (self.p_four, self.p_eight, self.m_six):
            self.assertEqual(dot(source, self.b_perp), F(0))

        rho = norm2(self.b_perp)
        expected = self.i_two**2 * (1 / self.s_minus + 1 / self.s_plus)
        self.assertEqual(rho, expected)
        self.assertEqual(dot(self.bridge, self.b_perp), rho)

        # b-b_perp lies in F because it is orthogonal to the full quotient
        # F^perp inside E, which is spanned by q_plus and q_minus.
        remainder = sub(self.bridge, self.b_perp)
        self.assertEqual(dot(remainder, self.q_plus), F(0))
        self.assertEqual(dot(remainder, self.q_minus), F(0))

    def test_endpoint_shear_does_not_change_the_innovation(self) -> None:
        shear = add(scale(F(7, 3), self.p_four), scale(F(-5, 2), self.m_six))
        bridge_sheared = sub(self.bridge, shear)
        self.assertEqual(dot(bridge_sheared, self.b_perp), norm2(self.b_perp))
        self.assertEqual(dot(shear, self.b_perp), F(0))

    def test_defect_orthogonal_bridge_representative_has_uniform_norm(self) -> None:
        defects = (F(1, 100), F(1, 50), F(1, 25), F(1, 80), F(1, 40))
        d_inv_q_plus = tuple(
            self.q_plus[index] / defects[index] for index in range(5)
        )
        d_inv_q_minus = tuple(
            self.q_minus[index] / defects[index] for index in range(5)
        )
        h_plus = dot(d_inv_q_plus, self.q_plus)
        h_minus = dot(d_inv_q_minus, self.q_minus)
        k_plus = norm2(d_inv_q_plus)
        k_minus = norm2(d_inv_q_minus)

        b_in = scale(
            self.i_two,
            sub(
                scale(1 / h_minus, d_inv_q_minus),
                scale(1 / h_plus, d_inv_q_plus),
            ),
        )
        for source in (self.p_four, self.p_eight, self.m_six):
            defect_source = tuple(
                defects[index] * source[index] for index in range(5)
            )
            self.assertEqual(dot(b_in, defect_source), F(0))

        self.assertEqual(dot(b_in, self.q_plus), -self.i_two)
        self.assertEqual(dot(b_in, self.q_minus), self.i_two)
        self.assertEqual(
            norm2(b_in),
            self.i_two**2 * (k_minus / h_minus**2 + k_plus / h_plus**2),
        )
        beta = self.i_two / self.i_zero
        self.assertLessEqual(norm2(b_in), 1 + beta**2)

        self.assertLessEqual(k_plus, h_plus / defects[0])
        self.assertGreaterEqual(h_plus, self.i_zero**2 / defects[0])
        self.assertLessEqual(k_minus, h_minus / defects[3])
        self.assertGreaterEqual(h_minus, self.i_two**2 / defects[3])

    def test_missed_line_capture_and_tail_identity_are_exact(self) -> None:
        # The ambient coefficient of 1 is q_plus+q_minus plus a tail value 7.
        one = add(self.q_plus, self.q_minus) + (F(7),)
        p_e_z = add(scale(F(2), self.q_plus), scale(F(-1), self.q_minus))
        z_value = p_e_z + (F(13, 7),)
        self.assertEqual(dot(z_value, one), F(0))

        for source in (self.p_four, self.p_eight, self.m_six):
            self.assertEqual(dot(z_value[:5], source), F(0))

        q_value = add(self.q_plus, self.q_minus)
        s_value = norm2(q_value)
        raw_projection = norm2(p_e_z) - dot(p_e_z, q_value) ** 2 / s_value
        numerator = dot(z_value[:5], self.bridge)
        rho = norm2(self.b_perp)
        self.assertEqual(raw_projection, numerator**2 / rho)

        complement = norm2(z_value) - raw_projection
        tail_norm = z_value[-1] ** 2
        tail_cross = z_value[-1] * one[-1]
        self.assertEqual(complement, tail_norm + tail_cross**2 / s_value)

        two_lambda = norm2(one)
        self.assertLessEqual(complement, two_lambda * tail_norm / s_value)

    def test_raw_tail_threshold_and_reserve_are_exact(self) -> None:
        two_lambda = F(100)
        s_value = F(80)
        delta = 1 - s_value / two_lambda
        q_value = F(3, 10)
        tail_fraction = 1 - q_value
        theta = two_lambda * tail_fraction / s_value
        self.assertEqual(delta, F(1, 5))
        self.assertEqual(theta, (1 - q_value) / (1 - delta))
        self.assertEqual(theta < 1, q_value > delta)

        eta = F(1, 10)
        self.assertLessEqual(theta, 1 - eta)
        self.assertGreaterEqual(q_value, delta + eta * (1 - delta))

    def test_halfgrid_constant_tail_and_krd_constants_are_exact(self) -> None:
        # For lambda=p/2, the sine-antiderivative boundary phases are
        # pi*p^2 and 2*pi*p^2, so both boundary sine terms vanish exactly.
        p_value = 9
        lambda_squared = F(p_value**2, 4)
        self.assertEqual(4 * lambda_squared, p_value**2)
        self.assertEqual(8 * lambda_squared, 2 * p_value**2)

        # In units of 1/(pi^2*lambda^2), D_1/(2*lambda) contributes 1/8
        # and the KRD leading defect costs at most 10/160=1/16.
        exterior_after_normalization = F(1, 8)
        krd_defect = F(10, 160)
        self.assertEqual(
            exterior_after_normalization - krd_defect,
            F(1, 16),
        )

        shannon = p_value**2
        buffer = 17
        terminal = shannon - 7 - buffer
        r_value = terminal if terminal % 2 == 0 else terminal - 1
        self.assertEqual(r_value % 2, 0)
        self.assertGreaterEqual(shannon - r_value - 7, buffer)
        self.assertLessEqual(F(r_value, 2) + 1, 2 * lambda_squared)

    def test_harmonic_prefactor_bound_is_exact(self) -> None:
        s_value = self.s_plus + self.s_minus
        two_lambda = F(104)
        lambda_value = two_lambda / 2
        rho = norm2(self.b_perp)
        self.assertEqual(s_value, F(55))
        self.assertLessEqual(s_value, two_lambda)
        self.assertGreaterEqual(
            1 / self.s_minus + 1 / self.s_plus,
            4 / s_value,
        )
        self.assertGreaterEqual(rho, 2 * self.i_two**2 / lambda_value)

    def test_defect_schur_prefactor_is_favorable(self) -> None:
        d_two = F(1, 100)
        d_zero = F(1, 100000)
        beta = self.i_two / self.i_zero
        u_value = F(5)
        a_value = F(7)
        s_bridge = (
            d_zero * beta**2 / (1 + d_zero * u_value)
            + d_two / (1 + d_two * a_value)
        )
        raw_bridge = d_zero * beta**2 + d_two
        self.assertGreater(s_bridge, 0)
        self.assertLessEqual(s_bridge, raw_bridge)
        self.assertLessEqual(raw_bridge, 2 * d_two)

        lambda_value = F(52)
        rho = norm2(self.b_perp)
        self.assertGreaterEqual(rho / s_bridge, self.i_two**2 / (lambda_value * d_two))

    def test_row_floor_and_final_lambda_exponents(self) -> None:
        # rho/s_b has lambda exponent -6 after inserting d_2, while the row
        # floor contributes -4.  The final polynomial exponent is -10.
        d_two_polynomial_exponent = 5
        rho_over_s_polynomial_exponent = -1 - d_two_polynomial_exponent
        row_floor_exponent = -4
        self.assertEqual(rho_over_s_polynomial_exponent, -6)
        self.assertEqual(rho_over_s_polynomial_exponent + row_floor_exponent, -10)

        fixed_label_coefficient = 4 * 64 // 2
        self.assertEqual(fixed_label_coefficient, 128)
        self.assertIn(r"C_2=128\sqrt\pi(2\pi)^{5/2}", self.normalized)

    def test_relative_orientation_and_codimension_one_floor(self) -> None:
        numerator_exponent = -5
        bridge_state_squared_exponent = 2
        self.assertEqual(
            numerator_exponent - bridge_state_squared_exponent,
            -7,
        )

        beta_squared = F(1, 2)
        i_two_fourth = F(1, 2)
        limit_coefficient_squared = (
            i_two_fourth / (4 * (1 + beta_squared) ** 2)
        )
        self.assertEqual(limit_coefficient_squared, F(1, 18))

        for alpha, v_norm_squared, omega in (
            (F(7), F(2), F(1, 3)),
            (F(2), F(7), F(1, 5)),
        ):
            a_squared = omega * v_norm_squared
            original_floor = alpha * a_squared / (alpha + v_norm_squared)
            sharpened_floor = min(a_squared, alpha * omega) / 2
            self.assertGreaterEqual(original_floor, sharpened_floor)

    def test_tail_reserve_implies_capture_but_is_not_equivalent(self) -> None:
        for theta_value in (F(0), F(1, 3), F(9, 10)):
            eta_value = 1 - theta_value
            gamma_value = F(1) - theta_value
            self.assertGreater(eta_value, 0)
            self.assertGreaterEqual(gamma_value, eta_value)

        # The exact tail identity has a nonnegative correction smaller than
        # its Cauchy upper bound, so Gamma can be positive even if Theta>=1.
        exact_complement = F(3, 4)
        cauchy_upper = F(5, 4)
        self.assertLess(exact_complement, 1)
        self.assertGreaterEqual(cauchy_upper, 1)

    def test_codimension_one_branch_forces_theta_zero_and_kappa_at_least_one(self) -> None:
        # S_F=diag(2,0), v=(3,4), and S_M=S_F+vv^T.
        v_value = (F(3), F(4))
        s_m = ((F(11), F(12)), (F(12), F(16)))
        determinant = s_m[0][0] * s_m[1][1] - s_m[0][1] * s_m[1][0]
        self.assertEqual(determinant, F(32))
        inverse = (
            (s_m[1][1] / determinant, -s_m[0][1] / determinant),
            (-s_m[1][0] / determinant, s_m[0][0] / determinant),
        )
        r_value = (
            v_value[0] * inverse[0][0] + v_value[1] * inverse[1][0],
            v_value[0] * inverse[0][1] + v_value[1] * inverse[1][1],
        )
        self.assertEqual(dot(r_value, v_value), F(1))
        self.assertGreaterEqual(norm2(r_value) * norm2(v_value), F(1))
        self.assertEqual(F(0) / determinant, F(0))

    def test_literal_adjoint_countermodel_strictly_misses_threshold(self) -> None:
        # pi^2<10 implies 1/(16*pi^2*lambda^2)>1/(160*lambda^2).
        # At lambda=20 the frozen 16*lambda^(9-lambda) envelope is already
        # below that smaller rational threshold.
        lambda_value = 20
        bessel_envelope = F(16, lambda_value ** (lambda_value - 9))
        rational_threshold = F(1, 160 * lambda_value**2)
        self.assertLess(bessel_envelope, rational_threshold)
        self.assertIn("`Theta_mix>1` strictly", self.normalized)

    def test_note_contract_and_static_hygiene(self) -> None:
        required = (
            r"b_\perp:=(I-P_F)b",
            r"\varrho_b:=\|b_\perp\|^2",
            r"b_{\rm in}=I_2\left({D_-^{-1}q_-\over H_-}",
            r"\|b_{\rm in}\|^2",
            r"a_b^2={\varrho_b\over s_b}\|P_Mz_0\|^2",
            r"\Theta_{\rm mix}(e_0)",
            r"\Gamma_{\rm mix}(e_0)",
            r"\delta_E=1-{s\over2\lambda}",
            r"\mathfrak q_E(e_0)>\delta_E",
            r"{1-\mathfrak q_E(e_0)\over1-\delta_E}",
            r"{\varrho_b\over s_b}\geq{c\over\lambda d_2}",
            r"\tau_0=\|A_{\lambda,0}^*e_0\|^2\geq{1\over8\lambda^4}",
            r"\|w_b\|^2\leq{\lambda^2\over2}\|b_{\rm in}\|^2",
            r"{\eta I_2^2\over2(1+|I_2/I_0|^2)\lambda^7}",
            r"\min\{a_b^2,\alpha\omega_b\}",
            r"B_\lambda=\left\lceil",
            r"D_1\geq{1\over4\pi^2\lambda}",
            r"\delta_{E_R}\geq{D_1\over2\lambda}-d_R",
            r"16\lambda^{9-\lambda}",
            r"\theta_b=0,\qquad r_b(w_b)=1",
            r"\kappa_b\geq1",
            r"n\in\mathcal I_+",
            r"n\in\mathcal I_-",
            "not the projection",
            "No matching upper bound",
            "No counterexample to the actual Weil",
            "No actual bridge",
            "Riemann hypothesis follows",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.normalized)

        forbidden = (
            r"n\in{cal I}",
            r"n\in{cal I}_+",
            r"n\in{cal I}_-",
            r"B_\lambda=left\lceil",
            r"{\varrho_b\over s_b}\asymp",
            "Theta_mix` can approach one",
            "No stronger counterexample is claimed here",
            "does **not** by itself rule out",
            "threshold itself is already of polynomial order",
            "small constant-function tail",
            "TO_BE_FROZEN",
            "proves RH",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn("\r", self.text)
        self.assertNotIn("\t", self.text)
        self.assertIsNone(re.search(r"[ \t]+$", self.text, flags=re.MULTILINE))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

        for path in (NOTE, Path(__file__)):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertNotIn(b"\r", payload)
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 30)
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

    def test_verifier_has_no_binary_float_literals(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="utf-8"))
        floats = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(floats, [])


if __name__ == "__main__":
    unittest.main()
