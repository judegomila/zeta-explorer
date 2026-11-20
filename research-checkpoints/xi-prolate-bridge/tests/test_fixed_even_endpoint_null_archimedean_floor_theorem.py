#!/usr/bin/env python3
"""Regressions for the fixed endpoint-null Archimedean direction theorem."""

from __future__ import annotations

import ast
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "FIXED_EVEN_ENDPOINT_NULL_ARCHIMEDEAN_FLOOR_THEOREM.md"
)
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md":
        "fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c",
    "tests/test_fixed_even_endpoint_null_complete_volterra_caustic_quadrature_theorem.py":
        "b734c0e93d264cca9bfe31a141f06907724e526de08781295b6a7cd3bcc0b47c",
    "notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md":
        "c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b",
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md":
        "c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81",
    "notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md":
        "b16d33c89dd1517875180a0a5b03f0c0e2b601b0e0e608090016174a464e1e11",
    "notes/CHEBYSHEV_ERROR_REWRITE.md":
        "164482f280284c49eda27c6d22607f32d5e16db4ab053b965c97f8bbd81db20a",
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
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


def energy_summand(sample: int) -> float:
    if sample == 1:
        return 0.25
    m_value = float(sample)
    bracket = (
        math.asin(1 / m_value)
        - math.sqrt(m_value * m_value - 1)
        * (m_value * m_value - 2)
        / m_value**4
    )
    return bracket / (2 * math.pi * m_value)


class FixedEvenEndpointNullArchimedeanFloorTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        note_text = NOTE.read_text(encoding="utf-8")
        tick = chr(96)
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"{tick}{relative}{tick}", note_text)
            self.assertIn(f"{tick}{expected}{tick}", note_text)

    def test_energy_integral_and_closed_form_agree(self) -> None:
        self.assertAlmostEqual(
            4 / math.pi * (math.pi / 16),
            energy_summand(1),
        )
        for sample in range(2, 20):
            lower = math.sqrt(sample * sample - 1)
            theta = math.atan(lower)
            integral = (
                math.pi / 16
                - theta / 8
                + math.sin(4 * theta) / 32
            )
            integral_term = 4 * integral / (math.pi * sample)
            self.assertAlmostEqual(
                integral_term,
                energy_summand(sample),
                places=14,
            )

    def test_energy_constant_and_rigorous_positive_tail_bound(self) -> None:
        cutoff = 10_000
        partial = sum(energy_summand(m) for m in range(1, cutoff + 1))
        tail_upper = 4 / (3 * math.pi) * (
            cutoff**-4 + 1 / (3 * cutoff**3)
        )
        expected = 0.282628070905254
        self.assertLessEqual(partial, expected + 2e-15)
        self.assertLessEqual(expected, partial + tail_upper + 2e-15)
        self.assertGreater(partial, 0.28)
        self.assertLess(partial + tail_upper, 0.29)

    def test_exact_phase_derivative_minimum(self) -> None:
        for c_value, nu_value in ((100.0, 10.5), (10_000.0, 10.501)):
            x_star = math.sqrt(1 - nu_value / c_value)
            value = c_value * x_star + (c_value - nu_value) / x_star
            exact_minimum = 2 * math.sqrt(c_value * (c_value - nu_value))
            self.assertAlmostEqual(value, exact_minimum)
            self.assertGreater(exact_minimum, 1.5 * c_value)
            self.assertGreater(exact_minimum - c_value / 2, c_value)

    def test_low_frequency_pointwise_bound_has_integrable_band_cost(self) -> None:
        for c_value in (100.0, 10_000.0):
            pointwise_bound = 3 / c_value
            band_length = c_value
            band_energy_bound = (
                band_length * pointwise_bound**2 / (2 * math.pi)
            )
            self.assertAlmostEqual(
                band_energy_bound,
                9 / (2 * math.pi * c_value),
            )

    def test_archimedean_multiplier_inequality_structure(self) -> None:
        a_zero = (
            -0.5772156649015329
            - math.pi / 2
            - 3 * math.log(2)
            - math.log(math.pi)
        )
        self.assertLess(a_zero, 0)
        for c_value in (2.0, 100.0, 10_000.0):
            high_log = 0.5 * math.log(1 + c_value * c_value)
            self.assertGreaterEqual(high_log, math.log(c_value))
        energy = 0.282628070905254
        high_one_tail_mass = energy / 4
        self.assertAlmostEqual(
            2 * high_one_tail_mass,
            energy / 2,
        )

    def test_same_side_prime_majorant_is_summable(self) -> None:
        cutoff = 100_000
        partial = sum(
            math.log(n_value) / n_value**2
            for n_value in range(2, cutoff + 1)
        )
        tail_upper = (
            math.log(cutoff) / cutoff**2
            + (math.log(cutoff) + 1) / cutoff
        )
        self.assertLess(partial, 1.0)
        self.assertLess(partial + tail_upper, 1.0)
        self.assertEqual(-0.5 + -1.5, -2.0)

    def test_reflected_cross_sign_and_scale_are_preserved(self) -> None:
        for odd_numerator in range(5, 40, 2):
            lambda_value = odd_numerator / 2
            c_value = 2 * math.pi * lambda_value**2
            m_bound = c_value ** -0.5
            cross_bound = 2 * lambda_value * m_bound
            self.assertAlmostEqual(cross_bound, math.sqrt(2 / math.pi))
            sample_m = -0.75 * m_bound
            self.assertGreater(-2 * lambda_value * sample_m, 0)

    def test_projection_exponent_margin_is_strictly_positive(self) -> None:
        margin = (
            9600 * math.log(2)
            - 320 * math.pi * math.log(96) / math.log(2)
        )
        self.assertAlmostEqual(margin, 34.286592117920468, places=12)
        self.assertGreater(margin, 34)

    def test_bv_fourier_tail_and_high_low_cauchy_scales(self) -> None:
        for cutoff in (100, 10_000):
            square_tail = sum(
                1 / (index * index)
                for index in range(cutoff + 1, 20 * cutoff + 1)
            )
            square_tail += 1 / (20 * cutoff)
            self.assertLessEqual(square_tail, 1 / cutoff)
            harmonic = sum(1 / index for index in range(1, cutoff + 1))
            self.assertLessEqual(harmonic, 1 + math.log(cutoff))
            weighted_tail_bound = (math.log(3 * cutoff) + 1) / cutoff
            self.assertGreater(weighted_tail_bound, 0)

    def test_raw_quotient_and_full_metric_unit_scalar_match(self) -> None:
        signed_value = 7.25
        compact_column_norm_squared = 3.5
        shift = 0.125
        defect = 11.0
        raw_quotient = (
            signed_value - shift * compact_column_norm_squared
        ) / defect
        scale = defect ** -0.5
        unit_value = (
            scale**2 * signed_value
            - shift * scale**2 * compact_column_norm_squared
        )
        self.assertAlmostEqual(raw_quotient, unit_value)

    def test_note_serializes_exact_decomposition_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        tick = chr(96)
        required = (
            r"\mathcal S_\lambda=",
            r"R_{v,\lambda}=K_{v,\lambda}-W_{v,\lambda}",
            r"-U_\lambda\|W_{v,\lambda}\|_2^2",
            r"\over D_{w,\lambda}",
            "0.282628070905254",
            r"2\|B_\lambda\|_2^2\longrightarrow E",
            r"\int_{|\xi|\geq c/2}|\widehat B_\lambda(\xi)|^2",
            r"\widehat B_\lambda(\xi)=",
            r"{d\xi\over2\pi}",
            r"\|B_\lambda-B_\lambda^0\|_2=o(1)",
            r"2\sqrt{c(c-\bar\nu)}",
            r"\sup_{|\xi|\leq c/2}|\widehat B_\lambda^0(\xi)|",
            r"\operatorname {Re}\psi(a+iy)-\psi(a)",
            r"a(\xi)\geq a_0+{1\over2}\log(1+4\xi^2)",
            r"Q_{\rm ar}^{\rm same}",
            r"\sum_{n\geq2}{\Lambda(n)\over n^2}",
            r"Q_{\rm cross}=-2\lambda\mathcal M_{v,A}",
            "Stieltjes prime-minus-Lebesgue quadrature",
            r"P_+(O_\lambda,O_\lambda)",
            r"N=2^{2400p^2}=\exp(9600\log2\,\lambda^2)",
            "`d_8,d_12<=1/2` eventually",
            "equation (4.11) of `DEFECT_RELATIVE_PROJECTION_THEOREM.md`",
            "equation (2.3) of `OUTER_PROJECTION_RADICAL_REDUCTION.md`",
            "The invisible origin bump contributes exactly zero to `X_lambda`",
            r"\operatorname {TV}(X_\lambda)",
            r"\sum_{|r|>N}\log(2+|r|)|x_r|^2",
            r"M_{\rm proj}=9600\log2-{320\pi\log96\over\log2}",
            r"q_\lambda(P_\lambda,P_\lambda)=o(1)",
            r"\mathcal W_Z(O_\lambda,P_\lambda)",
            r"=-q_\lambda(X_\lambda,P_\lambda)",
            "rather than the normalized `L2` projection estimate by itself",
            r"=o(\lambda^{-4})=o(1)",
            "metric `G=W^*W`, not to the global remainder norm",
            r"\mathcal S_\lambda\geq {E\over2}\log c-C",
            "directional value, not a minimum",
            "not uniform in a moving label or growing prefix",
            "no equation (5.2)",
            "no RH conclusion",
            f"The formal state remains {tick}P0_INVALIDATED{tick}",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "the 8/12 plane has a positive floor",
            "the singleton-shorted floor follows",
            "the growing-rest floor follows",
            "uniformly in the label",
            "equation (5.2) follows",
            "proves RH",
        )
        lowered = normalized.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), lowered)

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
