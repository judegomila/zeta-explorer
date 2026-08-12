#!/usr/bin/env python3
"""Regressions for the fixed label-8/12 plane floor theorem."""

from __future__ import annotations

import ast
from fractions import Fraction
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md"
)
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "notes/FIXED_EVEN_ENDPOINT_NULL_ARCHIMEDEAN_FLOOR_THEOREM.md":
        "c11c53a9bbf33abc1099c68a0a6acd8bc8febd03fe27d15a6dca5deb99b6cb67",
    "tests/test_fixed_even_endpoint_null_archimedean_floor_theorem.py":
        "111f8263a730e1706add25ef1446026d4a53182a11c54145a456870bd5b4e318",
    "notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md":
        "fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c",
    "tests/test_fixed_even_endpoint_null_complete_volterra_caustic_quadrature_theorem.py":
        "b734c0e93d264cca9bfe31a141f06907724e526de08781295b6a7cd3bcc0b47c",
    "notes/FIXED_ENDPOINT_BERNOULLI_MATRIX_QUADRATURE_AND_JET_GROWTH_THEOREM.md":
        "287b0fe3cfad40b6d8b7bd4719a6ddcb8fc4073eb463188f6e1100a2dc6908b0",
    "tests/test_fixed_endpoint_bernoulli_matrix_quadrature_and_jet_growth_theorem.py":
        "36d9ca8f522f10b3bf8fd98bffa7b0a0e26a67eaee94ebaba18ff4912b9d651a",
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md":
        "34bb4e43faf04f34e11126946b1069480375d5ba18baf9c97e9746b246594a0f",
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md":
        "c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md":
        "3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f",
    "notes/HIGH_FOURIER_COERCIVITY.md":
        "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "notes/COMPACT_PROJECTION_WEIL_BOUND.md":
        "61cce2214563cfb1099ea4d22c1d4831c705eba33df48fbddbddbe395ec91d93",
    "notes/OUTER_PROJECTION_RADICAL_REDUCTION.md":
        "3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd",
}


def energy_summands(sample: int) -> tuple[float, float, float]:
    m_value = float(sample)
    asin_term = math.asin(1 / m_value)
    if sample == 1:
        correction = 0.0
    else:
        correction = (
            math.sqrt(m_value * m_value - 1)
            * (m_value * m_value - 2)
            / m_value**4
        )
    e_term = (asin_term - correction) / (2 * math.pi * m_value)
    f_term = (asin_term + correction) / (2 * math.pi * m_value)
    u_term = asin_term / (2 * math.pi * m_value)
    return e_term, f_term, u_term


def sawtooth_covariance(sample: int) -> Fraction:
    """Integrate P(x) P(n*x) exactly on its polynomial cells."""
    n_value = Fraction(sample)
    total = Fraction(0)
    for index in range(sample):
        left = Fraction(index, sample)
        right = Fraction(index + 1, sample)
        # (1/2-x) * (1/2-(n*x-index)) = aa*x^2+bb*x+cc.
        aa = n_value
        bb = -(n_value / 2 + index + Fraction(1, 2))
        cc = Fraction(1, 4) + Fraction(index, 2)
        total += aa * (right**3 - left**3) / 3
        total += bb * (right**2 - left**2) / 2
        total += cc * (right - left)
    return total


class FixedEven812PlaneArchimedeanArithmeticFloorTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        note_text = NOTE.read_text(encoding="utf-8")
        tick = chr(96)
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"{tick}{relative}{tick}", note_text)
            self.assertIn(f"{tick}{expected}{tick}", note_text)

    def test_exact_whitened_endpoint_null_basis(self) -> None:
        for first, second in ((3.0, 4.0), (2.5, -7.25), (1.0, 1.0)):
            radius = math.hypot(first, second)
            endpoint = (first / radius, second / radius)
            null = (second / radius, -first / radius)
            self.assertAlmostEqual(sum(value * value for value in endpoint), 1)
            self.assertAlmostEqual(sum(value * value for value in null), 1)
            self.assertAlmostEqual(
                endpoint[0] * null[0] + endpoint[1] * null[1],
                0,
            )
            self.assertAlmostEqual(first * null[0] + second * null[1], 0)
            self.assertAlmostEqual(
                first * endpoint[0] + second * endpoint[1],
                radius,
            )

    def test_energy_constants_and_exact_linear_relation(self) -> None:
        cutoff = 200_000
        e_value = 0.0
        f_value = 0.0
        u_value = 0.0
        for sample in range(1, cutoff + 1):
            e_term, f_term, u_term = energy_summands(sample)
            e_value += e_term
            f_value += f_term
            u_value += u_term
        expected_e = 0.282628070905254
        expected_f = 0.427511972026948
        expected_u = 0.355070021466101
        for partial, expected in (
            (e_value, expected_e),
            (f_value, expected_f),
            (u_value, expected_u),
        ):
            self.assertLessEqual(partial, expected)
            self.assertLessEqual(expected, partial + 2 / (math.pi * cutoff))
        self.assertAlmostEqual(f_value, 2 * u_value - e_value, places=12)
        self.assertGreater(f_value, e_value)
        for sample in range(2, 100):
            e_term, f_term, _ = energy_summands(sample)
            self.assertGreater(f_term, e_term)

    def test_radial_integrands_match_closed_forms(self) -> None:
        # Simpson integration is only a regression cross-check, not a proof.
        for sample in (1, 2, 3, 8, 12):
            lower = math.sqrt(sample * sample - 1)
            theta = math.atan(lower)
            # Integral of (x^2-1)^2/(1+x^2)^3 after x=tan(theta).
            integral_f = (
                math.pi / 4
                - theta / 2
                - math.sin(4 * theta) / 8
            )
            _, f_term, _ = energy_summands(sample)
            self.assertAlmostEqual(
                integral_f / (math.pi * sample),
                f_term,
                places=14,
            )

    def test_integer_dilation_sawtooth_covariance(self) -> None:
        for sample in range(1, 80):
            self.assertEqual(
                sawtooth_covariance(sample),
                Fraction(1, 12 * sample),
            )

    def test_sawtooth_prime_scale_has_extra_inverse_n(self) -> None:
        for sample in (2, 3, 17, 101):
            covariance = 1 / (12 * sample)
            translated = covariance / math.sqrt(sample)
            prime_weighted = translated * math.log(sample) / math.sqrt(sample)
            self.assertAlmostEqual(
                prime_weighted,
                math.log(sample) / (12 * sample * sample),
            )
        cutoff = 100_000
        majorant = sum(
            math.log(n_value) * (1 + math.log(n_value)) ** 2 / n_value**2
            for n_value in range(2, cutoff + 1)
        )
        tail = (
            (math.log(cutoff) ** 3 + 4 * math.log(cutoff) ** 2
             + 10 * math.log(cutoff) + 10)
            / cutoff
        )
        self.assertTrue(math.isfinite(majorant + tail))
        self.assertLess(majorant + tail, 20)

    def test_equality_branch_integral_majorant(self) -> None:
        for n_value in (2, 5, 17):
            for ell in (1, 2, 10):
                radial = n_value * ell
                lower = math.sqrt(radial * radial - 1)
                self.assertLessEqual(1 / lower, 2 / (math.sqrt(3) * radial))
                term_bound = (
                    1 / (math.pi * ell * math.sqrt(n_value) * lower)
                )
                target = 2 / (
                    math.pi * math.sqrt(3) * n_value**1.5 * ell**2
                )
                self.assertLessEqual(term_bound, target + 1e-15)

    def test_reciprocal_phase_classification_and_curvature_scale(self) -> None:
        for q_value in (0.9, 0.99, 0.999):
            for radial in (2.0, 5.0, 20.0):
                reciprocal = q_value / radial
                left = reciprocal + q_value / reciprocal
                right = radial + q_value / radial
                self.assertAlmostEqual(left, right)
                curvature = abs(
                    reciprocal - q_value / reciprocal**3
                    - radial + q_value / radial**3
                )
                self.assertGreater(curvature, 0.25 * radial**3)

    def test_intermediate_sample_boundary_requires_inverse_m_term(self) -> None:
        c_value = 100.0
        radial = 100_000_000.0
        sample = 10_000.0
        self.assertLess(c_value, sample)
        self.assertLess(sample, radial / c_value)
        boundary_scale = 1 / (c_value * sample * radial**1.5)
        false_scale = radial**-1.5 * (
            1 / ((1 + radial - sample) * (1 + sample / radial))
            + 1 / (c_value * (1 + sample) ** 2)
        )
        corrected_scale = radial**-1.5 / (
            c_value * sample * (1 + sample / radial)
        )
        self.assertGreater(boundary_scale, 50 * false_scale)
        self.assertGreater(corrected_scale, 0.99 * boundary_scale)

    def test_boundary_sensitive_sum_telescopes_to_harmonic_number(self) -> None:
        for radial in (2, 7, 31):
            cutoff = 1000
            partial = sum(
                Fraction(radial, sample * (sample + radial))
                for sample in range(1, cutoff + 1)
            )
            harmonic_radial = sum(
                Fraction(1, sample) for sample in range(1, radial + 1)
            )
            tail = harmonic_radial - partial
            self.assertGreater(tail, 0)
            self.assertLess(tail, Fraction(radial, cutoff))

    def test_real_caustic_rotation_leaves_phase_residual(self) -> None:
        phase_scale = 1e-4
        endpoint_sine = 3 * phase_scale
        endpoint_cosine = 2e-3
        null_sine = phase_scale / 2
        null_cosine = 1.25
        tau = endpoint_cosine / null_cosine
        self.assertIsInstance(tau, float)
        rotated_cosine = endpoint_cosine - tau * null_cosine
        rotated_sine = endpoint_sine - tau * null_sine
        self.assertAlmostEqual(rotated_cosine, 0)
        self.assertNotEqual(rotated_sine, 0)
        self.assertLess(abs(rotated_sine), 4 * phase_scale)

    def test_quartic_amplitude_vanishing_scales(self) -> None:
        for c_value in (1e4, 1e8):
            base = c_value ** -0.25
            null_null = base
            endpoint_null = base**2
            endpoint_endpoint = base**3
            self.assertAlmostEqual(endpoint_null, c_value ** -0.5)
            self.assertAlmostEqual(endpoint_endpoint, c_value ** -0.75)
            self.assertLess(endpoint_endpoint, endpoint_null)
            self.assertLess(endpoint_null, null_null)

    def test_hard_edge_bound_has_required_prime_scale(self) -> None:
        for lambda_value in (2.5, 20.5, 100.5):
            c_value = 2 * math.pi * lambda_value**2
            for n_value, ell in ((2, 1), (7, 3), (31, 5)):
                left = lambda_value / (c_value * ell**2 * n_value**1.5)
                right = 1 / (
                    2 * math.pi * lambda_value * ell**2 * n_value**1.5
                )
                self.assertAlmostEqual(left, right)

    def test_projection_exponent_margin_and_schedule(self) -> None:
        margin = (
            9600 * math.log(2)
            - 320 * math.pi * math.log(96) / math.log(2)
        )
        self.assertAlmostEqual(margin, 34.286592117920468, places=12)
        self.assertGreater(margin, 34)
        for odd_numerator in (5, 9, 21):
            lambda_value = odd_numerator / 2
            log_n = 9600 * math.log(2) * lambda_value**2
            defect_cost = (
                320 * math.pi * math.log(96) / math.log(2)
                * lambda_value**2
            )
            self.assertAlmostEqual(log_n - defect_cost, margin * lambda_value**2)

    def test_exact_schur_floor_criterion(self) -> None:
        for h_ee, h_vv, cross, floor in (
            (9.0, 6.0, 2.0, 4.0),
            (12.0, 8.0, 3.0, 5.0),
            (5.0, 4.0, 0.5, 3.0),
        ):
            schur = h_ee - floor - cross**2 / (h_vv - floor)
            determinant = (
                (h_ee - floor) * (h_vv - floor) - cross**2
            )
            self.assertAlmostEqual(determinant, (h_vv - floor) * schur)
            self.assertEqual(schur >= 0, determinant >= 0)

    def test_note_serializes_complete_proof_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        tick = chr(96)
        required = (
            "supersedes the analytically invalid candidate hashes",
            "466e581dd27cc2214042f193495ee8aa9f080162662cb1e3f666da574a4bdd28",
            "de1b5aa79b4b6a1b4fa5c1f66fc96b9804e1ebe59b6984b676db61698fa03c72",
            "Those hashes must not be integrated",
            "two independent real trigonometric branches",
            r"D_\lambda=F_\lambda^*(I-\mathcal P_\lambda)F_\lambda",
            "actual uncorrected anchor-deflated prolate labels",
            r"not included in \(F_\lambda\) or \(D_\lambda\)",
            "the bump belongs only to the global radical lift",
            "leaves the actual compact projected column unchanged",
            r"a_\lambda=D_\lambda^{-1/2}\eta_\lambda^*",
            r"e_\lambda={a_\lambda\over r_\lambda}",
            r"f_{v,\lambda}(\lambda)=0",
            r"\mathsf H(\lambda)\succeq {E\over2}\log c\,I_2-CI_2",
            "0.282628070905254",
            "0.427511972026948",
            r"\begin{pmatrix}F&0\\0&E\end{pmatrix}",
            r"F=2U-E",
            r"F>E>0",
            r"b_m^e(s)={x_m(s)^2-1",
            r"\cos(2\beta)={x^2-1\over x^2+1}",
            r"B_f(s)",
            r"\kappa_f e^{-s/2}P(Ae^s)+\mathcal R_f(s)",
            r"\widehat {f''}(mu)\over m^2",
            r"The sole conditional \(m^{-1}\) row",
            r"Its constant depends on \(\lambda\)",
            r"{K\over cml(1+|m-l|)}",
            r"{K\over cm^2}",
            r"2\sqrt{c(c-\bar\nu)}",
            r"Q_{\rm ar}^{\rm same}",
            r"\int_0^1P(x)P(nx)\,dx={1\over12n}",
            r"\left|J_n(A)-{1\over12n}\right|",
            r"\widetilde T_{ee}(\log n):=T_{ee}(\log n)",
            "the recombined complete-radial remainder",
            r"m=nl",
            r"x_mx_N=q",
            "can occur only for",
            r"{Kc^{-1/2}\over l^2n^{3/2}}",
            r"{c^{-1}\over m(1+m/N)}",
            r"{1\over cmN^{3/2}}",
            r"\sum_{m\geq1}{1\over m(1+m/N)}",
            r"=\sum_{m\geq1}{N\over m(m+N)}=H_N",
            r"{K(1+\log n)^2\over n^{3/2}}",
            r"J_0(cx)",
            r"{K\lambda\over c\,l^2n^{3/2}}",
            r"z^2e^{-i4cz^4}",
            r"\delta_\lambda={|a_{1,\lambda}-a_{2,\lambda}|\over r_\lambda}",
            r"A_{w,\lambda}(z)\sin\Phi+B_{w,\lambda}(z)\cos\Phi",
            r"|A_{e,\lambda}(0)|\leq Kc^{-1}",
            r"\tau_\lambda={B_{e,\lambda}(0)\over B_{v,\lambda}(0)}",
            r"\in\mathbb R",
            r"e_{0,\lambda}=e_\lambda-\tau_\lambda v_\lambda",
            r"B_{e_0,\lambda}(0)=0",
            r"=O(c^{-1})+\kappa_ez+O(z^2)",
            r"c^{-5/4}(1+\rho)^{-1/2}",
            r"|\tau_\lambda|^2c^{-1/4}(1+\rho)^{-1/2}",
            r"\mathcal M_{ev,A}",
            r"=\mathcal M_{e_0v,A}+\tau_\lambda\mathcal M_{vv,A}",
            r"c^{-3/4}",
            r"c^{-1/2}",
            r"C_{ij}^{\rm hh}",
            r"D(g_i*g_j)=(Dg_i)*g_j\in L^1_{\rm loc}",
            r"C_{ij}\in W^{1,1}_{\rm loc}",
            r"C_{ij}(0)=0",
            r"O(c^{-3/4}\log c)=o(c^{-1/2})",
            r"|\mathcal M_{ee,A}|+|\mathcal M_{ev,A}|",
            r"A_{ee}=O(1)",
            r"A_{ev}=O(1)",
            r"-2\lambda\mathcal M_A",
            r"P_+(O_i,O_j)",
            r"N=2^{2400p^2}=\exp(9600\log2\,\lambda^2)",
            r"\operatorname {TV}_{\rm circ}(X)",
            r"\mathcal A_\lambda={\sqrt L\over2\pi}",
            r"12B_b\mathcal A_\lambda^2H_N",
            r"M_{\rm proj}=9600\log2-{320\pi\log96\over\log2}",
            r"\mathcal W_Z(O_i,P_j)=-q_\lambda(X_i,P_j)",
            r"\|U_\lambda G_\lambda\|=o(\lambda^{-4})=o(1)",
            r"h_{ee}-\mu-{|h_{ev}|^2\over h_{vv}-\mu}",
            "not uniform in a moving label or growing prefix",
            "no growing-rest or singleton-versus-growing-rest Schur floor",
            "no residual action estimate",
            "no equation (5.2)",
            "no RH conclusion",
            f"The formal state remains {tick}P0_INVALIDATED{tick}",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "uniformly in the label",
            "the growing-rest floor follows",
            "the residual action bound follows",
            "equation (5.2) follows",
            "proves rh",
        )
        lowered = normalized.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), lowered)

        self.assertNotIn("actual endpoint amplitude vanishes", lowered)
        self.assertNotIn(r"\ell_\lambda(e_{0,\lambda})=0", normalized)
        self.assertNotIn("exact caustic-null vector", lowered)
        self.assertNotIn(
            r"{Kc^{-1}\over n^{3/2}l^2(1+m)^2}",
            normalized,
        )
        self.assertNotIn(
            "a defect-normalized uniform `K m^(-2)` remainder",
            normalized,
        )

    def test_profile_and_equality_displays_are_not_duplicated(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        self.assertEqual(text.count(r"B_v^0(s)=-\sum_{m\geq1}"), 1)
        self.assertEqual(
            text.count(r"\sum_{l\geq1}{1\over\pi l\sqrt n}"),
            1,
        )
        self.assertNotIn(
            r"\sum_{l\geq1}\sum_{l\geq1}{1\over\pi l\sqrt n}",
            text,
        )
        self.assertNotIn("origin-corrected labels `8` and `12`", text)

    def test_aligned_rows_never_end_in_one_raw_backslash(self) -> None:
        inside_aligned = False
        for line_number, line in enumerate(
            NOTE.read_text(encoding="utf-8").splitlines(), 1
        ):
            stripped = line.rstrip()
            trailing = len(stripped) - len(stripped.rstrip("\\"))
            self.assertNotEqual(trailing, 1, line_number)
            if "\\begin{aligned}" in line:
                self.assertFalse(inside_aligned, line_number)
                inside_aligned = True
                continue
            if "\\end{aligned}" in line:
                self.assertTrue(inside_aligned, line_number)
                inside_aligned = False
        self.assertFalse(inside_aligned)

    def test_python_source_is_stdlib_only_and_files_have_clean_bytes(self) -> None:
        tree = ast.parse(TEST.read_text(encoding="utf-8"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__",
                "ast",
                "fractions",
                "hashlib",
                "math",
                "pathlib",
                "unittest",
            },
        )
        for path in (NOTE, TEST):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            for line_number, line in enumerate(payload.splitlines(), 1):
                self.assertFalse(
                    line.endswith((b" ", b"\t")),
                    f"{path.name}:{line_number}",
                )


if __name__ == "__main__":
    unittest.main()
