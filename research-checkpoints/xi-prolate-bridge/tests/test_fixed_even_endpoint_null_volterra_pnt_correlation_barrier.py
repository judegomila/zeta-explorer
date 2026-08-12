#!/usr/bin/env python3
"""Exact regressions for the fixed-even endpoint-null correlation barrier."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md"
)
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/PROLATE_DEFECT_SOURCE_AUDIT.md":
        "b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d",
    "notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md":
        "34bb4e43faf04f34e11126946b1069480375d5ba18baf9c97e9746b246594a0f",
    "notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md":
        "b16d33c89dd1517875180a0a5b03f0c0e2b601b0e0e608090016174a464e1e11",
    "notes/OUTER_OUTER_SPECTRAL_SAMPLING_REDUCTION.md":
        "49568daabe36c6507f7b366c53f784f29f9b7807284c738b80f5b016600f354b",
    "notes/OUTER_NORMALIZATION_CANCELLATION_AUDIT.md":
        "6acc76ec10a802197b873741293b56e9832e777cd41de4660e3d9b1d065a9af3",
    "notes/NEAR_SIGNED_HANKEL_REDUCTION.md":
        "fba7078c9695951fa7160e2587ff774dc1d10730bd94dc3efdec4b851ef9408e",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/FIXED_EVEN_PREFIX_DIAGONAL_COVARIANCE_COLLAPSE_AND_SIGNED_TAIL_DICHOTOMY.md":
        "6d8be3d8bef6002d7fa2f1581e09bf27aa0dc12b2a3805fa7cd5e92863cd70d8",
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
}


def polynomial_product(
    left: tuple[F, ...], right: tuple[F, ...]
) -> tuple[F, ...]:
    out = [F() for _ in range(len(left) + len(right) - 1)]
    for i, left_value in enumerate(left):
        for j, right_value in enumerate(right):
            out[i + j] += left_value * right_value
    return tuple(out)


def integral_zero_one(poly: tuple[F, ...]) -> F:
    return sum(value / (degree + 1) for degree, value in enumerate(poly))


class FixedEvenEndpointNullVolterraPNTBarrierTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        note_text = NOTE.read_text(encoding="utf-8")
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"`{relative}`", note_text)
            self.assertIn(f"`{expected}`", note_text)

    def test_locked_half_integer_square_has_fractional_part_one_quarter(self) -> None:
        for odd_numerator in range(5, 40, 2):
            square = F(odd_numerator * odd_numerator, 4)
            self.assertEqual(square - square.numerator // square.denominator, F(1, 4))
            self.assertEqual(2400 * odd_numerator**2, 9600 * square)

    def test_fixed_defect_hierarchy_and_cross_metric_exponent(self) -> None:
        # d_n ~ A_n lambda^(2n+1) exp(-4*pi*lambda^2).
        exponent = lambda label: 2 * label + 1
        self.assertEqual(exponent(12) - exponent(8), 8)
        self.assertEqual(
            F(16**4 * math.factorial(8), math.factorial(12)),
            F(8192, 1485),
        )
        cross_exponent = exponent(4) - F(exponent(8) + exponent(12), 2)
        self.assertEqual(cross_exponent, -12)

    def test_exact_spheroidal_gap_correction_for_labels_8_and_12(self) -> None:
        correction = lambda label: F(-(2 * label * label + 2 * label + 3), 4)
        self.assertEqual(correction(8), F(-147, 4))
        self.assertEqual(correction(12), F(-315, 4))
        self.assertEqual(correction(12) - correction(8), -42)
        self.assertEqual((2 * 12 + 1) - (2 * 8 + 1), 8)

    def test_exact_periodic_sawtooth_and_bernoulli_second_moments(self) -> None:
        sawtooth = (F(1, 2), F(-1))
        bernoulli_two = (F(1, 6), F(-1), F(1))
        self.assertEqual(
            integral_zero_one(polynomial_product(sawtooth, sawtooth)),
            F(1, 12),
        )
        self.assertEqual(
            integral_zero_one(polynomial_product(bernoulli_two, bernoulli_two)),
            F(1, 180),
        )
        self.assertEqual(
            sum(value * F(1, 4) ** degree
                for degree, value in enumerate(bernoulli_two)),
            F(-1, 48),
        )

    def test_leading_two_tail_gram_is_rank_one_with_pi_over_twelve(self) -> None:
        # Strip the common factor pi.  Every fixed label has the same entry.
        gram = ((F(1, 12), F(1, 12)), (F(1, 12), F(1, 12)))
        self.assertEqual(gram[0][0] * gram[1][1] - gram[0][1] * gram[1][0], 0)
        null = (F(1), F(-1))
        self.assertEqual(
            tuple(sum(row[j] * null[j] for j in range(2)) for row in gram),
            (F(0), F(0)),
        )

    def test_endpoint_null_gap_and_first_bernoulli_coefficient(self) -> None:
        a_8 = F(3, 2)
        a_12 = F(5, 3)
        endpoint_null = (a_12, -a_8)
        self.assertEqual(a_8 * endpoint_null[0] + a_12 * endpoint_null[1], 0)
        # a_8,a_12 ~ sqrt(2*pi*lambda), so a_8*a_12/r ~ sqrt(pi*lambda).
        leading_gap_in_c = F(-8)
        # The powers pi^(3/2) are stripped in the exact rational ledger.
        c_over_pi_lambda_squared = F(2)
        endpoint_denominator = F(2)
        derivative_coefficient = (
            leading_gap_in_c * c_over_pi_lambda_squared / endpoint_denominator
        )
        self.assertEqual(derivative_coefficient, -8)
        self.assertEqual(derivative_coefficient / 4, -2)

    def test_isolated_endpoint_null_two_tail_norm_is_two_pi_cubed_over_135(self) -> None:
        # Strip pi^3: two tails, kappa^2=4*pi^3, decay integral 1/3,
        # and periodic B_2 second moment 1/180.
        self.assertEqual(2 * F(4), 8)
        coefficient = 2 * F(4) * F(1, 3) * F(1, 180)
        self.assertEqual(coefficient, F(2, 135))

    def test_additive_leakage_reverse_triangle_constants_are_nonzero(self) -> None:
        exact_positive_energy = F(1, 2)
        # Strip the surviving inverse power of pi from both model energies.
        self.assertEqual(F(2) * F(1, 2), 1)
        self.assertEqual(F(64) * F(1, 4) * F(1, 6), F(8, 3))
        leading_energy = 1 / math.pi
        endpoint_null_model_energy = 8 / (3 * math.pi)
        self.assertNotEqual(leading_energy, float(exact_positive_energy))
        self.assertNotEqual(endpoint_null_model_energy, float(exact_positive_energy))
        self.assertGreater(
            abs(math.sqrt(float(exact_positive_energy)) - math.sqrt(leading_energy)),
            0,
        )
        self.assertGreater(
            abs(
                math.sqrt(endpoint_null_model_energy)
                - math.sqrt(float(exact_positive_energy))
            ),
            0,
        )
        self.assertEqual(F(1, 4) * exact_positive_energy, F(1, 8))

    def test_exact_correlation_derivative_bound_coefficients(self) -> None:
        endpoint_value = F(-1, 48)
        bernoulli_bound = F(1, 6)
        sawtooth_bound = F(1, 2)
        self.assertEqual(abs(endpoint_value) * bernoulli_bound, F(1, 288))
        self.assertEqual(2 * bernoulli_bound * bernoulli_bound, F(1, 18))
        self.assertEqual(2 * bernoulli_bound * sawtooth_bound, F(1, 6))
        self.assertLess(F(1, 288) + F(1, 18), F(1, 16))

    def test_admitted_pnt_envelope_misses_the_required_scale(self) -> None:
        # M_11 has an admitted lambda^2 envelope and the reflected term an
        # additional lambda prefactor: lambda^3 remains before the PNT decay.
        correlation_power = 2
        reflected_prefactor_power = 1
        self.assertEqual(correlation_power + reflected_prefactor_power, 3)
        alpha = 0.8476836
        for log_lambda in (1, 10, 100, 1000):
            log_post_prefactor_envelope = (
                3 * log_lambda
                + 2 * math.log(log_lambda)
                - alpha * math.sqrt(2 * log_lambda)
            )
            self.assertGreater(log_post_prefactor_envelope, 0)

    def test_absolute_gram_does_not_determine_signed_orientation(self) -> None:
        aligned = (F(3), F(1))
        anti = (F(1), F(3))
        absolute = tuple(a + b for a, b in zip(aligned, anti))
        signed = tuple(a - b for a, b in zip(aligned, anti))
        self.assertEqual(absolute, (F(4), F(4)))
        self.assertEqual(signed, (F(2), F(-2)))

    def test_note_serializes_exact_formulas_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        required = (
            "Fix an integer `m>=3`",
            "`p->infinity` through odd integers",
            "Nothing in this note is uniform in growing `m`",
            "{\\pi\\over12}{\\bf1}{\\bf1}^*+o(1)",
            "Theta_{12,\\lambda}-\\Theta_{8,\\lambda}",
            "=8c-42+O(\\lambda^{-2})",
            "{2\\pi^3\\over135}",
            "{1\\over\\pi}",
            "{8\\over3\\pi}",
            "{A\\over6}+{e^{-y}\\over288}+{ye^{-y}\\over18}",
            "B_2(A)=-{1\\over48}",
            "\\mathcal M_{11,A}",
            "\\{C_{11,A}'(y)-C_{11,A}(y)\\}",
            "B_2(A)g_A(y)-2C_{11,A}(y)",
            "=2\\lambda\\kappa_\\lambda^2",
            "\\lambda^3(\\log\\lambda)^2",
            "complete arithmetic divisor sum",
            "Complete Volterra and near-range terms may cancel",
            "there is no all-finite-`K` conclusion",
            "do **not** prove an actual absolute-tail or signed-tail failure",
            "no admitted lower sampling theorem",
            "no RH conclusion",
            "actual fixed-even absolute and signed tail limits therefore remain open",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)
        forbidden = (
            "therefore the absolute tail fails",
            "therefore the signed tail fails",
            "all finite endpoint remainders are o(sqrt(D))",
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
