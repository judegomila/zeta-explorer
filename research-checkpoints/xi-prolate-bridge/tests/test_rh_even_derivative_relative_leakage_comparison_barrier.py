#!/usr/bin/env python3
"""Regressions for the RH even derivative relative-leakage barrier."""

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


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "RH_EVEN_DERIVATIVE_RELATIVE_LEAKAGE_COMPARISON_BARRIER.md"
)
NOTE_HASH = "0cf345e6eccd543fa2552848bc79be9b51e0e74217b2947ca9c1ad8cde26479c"

FROZEN = {
    "notes/RH_EVEN_ZERO_GRAM_GEVREY_RELATIVE_RESERVE_BARRIER.md":
        "4527a5cc5ba8a7c66b76ff70c4aa4423aaecd60fe10ba52cee134b9d9c2ef36c",
    "tests/test_rh_even_zero_gram_gevrey_relative_reserve_barrier.py":
        "fe276d7e4e60f1f40ec10fc4dac1cee8084fc3e8df969fa3a9f30ef64cd4ad86",
    "notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md":
        "384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c",
    "tests/test_gevrey_prolate_remainder.py":
        "93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058",
    "notes/DERIVATIVE_RADICAL_ODD_SPLIT.md":
        "abac446060d19ccd8ced9e4fb3aef3aedfa643d14494556b661cfba79bfbad95",
    "tests/test_derivative_radical_odd_split.py":
        "507728a8391d06135e62a48f7cabd9db73874049965c5e37631c563ec8815b44",
    "notes/TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md":
        "e5a0888f54ae4ae97d00462b7cfd00cbc9d98638ff9d36aea0fdb7a1c861e77f",
    "tests/test_transverse_xi_radical_moment_angle_obstruction.py":
        "3cbea43c78355fcece4dec25a76280ee23e5c706b0d509c2951b003d3a531c75",
    "notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md":
        "d5984831496b714400d8b70df739abe66e6571abd1a2f3dbda96d8b38f473edd",
    "tests/test_first_prolate_correction.py":
        "9f424a931f3a9435ec0ce9883b07201afe9b85cf56fcdda81644050e876ef991",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def paired_energy(
    values: tuple[F, ...],
    weights: tuple[F, ...],
) -> F:
    return F(4) * sum(
        (weight * value * value
         for weight, value in zip(weights, values)),
        F(0),
    )


def cosine_sample(
    coefficients: dict[int, F],
    transforms: dict[int, F],
) -> F:
    return sum(
        (coefficient * transforms[index]
         for index, coefficient in coefficients.items()),
        F(0),
    )


def cosine_endpoint(coefficients: dict[int, F]) -> F:
    return sum(
        (coefficient * F((-1) ** index)
         for index, coefficient in coefficients.items()),
        F(0),
    )


def cosine_second_sample(
    coefficients: dict[int, F],
    transforms: dict[int, F],
) -> F:
    return sum(
        (-index * index * coefficient * transforms[index]
         for index, coefficient in coefficients.items()),
        F(0),
    )


class RHEvenDerivativeRelativeLeakageComparisonBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 10)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_actual_centered_endpoint_primitive_and_second_derivative(
        self,
    ) -> None:
        coefficients = {
            -3: F(2, 9),
            -2: F(-3, 11),
            -1: F(4, 13),
            0: F(5, 17),
            1: F(4, 13),
            2: F(-3, 11),
            3: F(2, 9),
        }
        boundary = sum(coefficients.values(), F(0))
        primitive = dict(coefficients)
        primitive[0] -= boundary

        self.assertEqual(sum(primitive.values(), F(0)), 0)
        self.assertEqual(
            sum((index * value for index, value in primitive.items()), F(0)),
            0,
        )

        actual_second = {
            index: -index * index * value
            for index, value in coefficients.items()
        }
        primitive_second = {
            index: -index * index * value
            for index, value in primitive.items()
        }
        self.assertEqual(actual_second, primitive_second)
        self.assertEqual(actual_second[0], 0)

    def test_actual_ratio_has_all_factors(self) -> None:
        ordinates = (F(2), F(3), F(5))
        weights = (F(1), F(2), F(3, 2))
        state = (F(3), F(-2), F(1))
        central = (F(1, 5), F(1, 7), F(-1, 11))
        boundary = F(2)
        primitive = tuple(
            value - boundary * correction
            for value, correction in zip(state, central)
        )
        second = tuple(
            -ordinate * ordinate * value
            for ordinate, value in zip(ordinates, primitive)
        )

        state_energy = paired_energy(state, weights)
        central_energy = paired_energy(central, weights)
        second_energy = paired_energy(second, weights)
        physical_state = F(5)
        physical_second = F(7)
        q_value = state_energy / (2 * physical_state)
        r_value = second_energy / (2 * physical_second)

        eta = float(abs(boundary)) * math.sqrt(
            float(central_energy / state_energy)
        )
        lower = (
            float(min(ordinates) ** 4)
            * float(physical_state / physical_second)
            * max(0.0, 1.0 - eta) ** 2
        )
        self.assertEqual(q_value, state_energy / (2 * physical_state))
        self.assertEqual(r_value, second_energy / (2 * physical_second))
        self.assertGreaterEqual(float(r_value / q_value) + 1e-12, lower)

    def test_exact_rational_endpoint_vs_zero_row_eta(self) -> None:
        coefficients = (F(3, 5), F(-2, 7), F(5, 11), F(1, 13))
        rows = (F(1, 3), F(5, 4), F(7, 3), F(11, 4))
        row_weights = (F(2, 5), F(3, 7), F(5, 9), F(7, 11))

        endpoint_trace = sum(coefficients, F(0))
        anchors = []
        for row in rows:
            anchor = coefficients[0] + sum(
                (
                    coefficients[index]
                    * row * row
                    / (row * row - index * index)
                    for index in range(1, len(coefficients))
                ),
                F(0),
            )
            correction = sum(
                (
                    coefficients[index]
                    * index * index
                    / (row * row - index * index)
                    for index in range(1, len(coefficients))
                ),
                F(0),
            )
            self.assertEqual(anchor - endpoint_trace, correction)
            anchors.append(anchor)

        central_energy = F(16, 7) * sum(row_weights, F(0))
        state_energy = F(16, 7) * sum(
            (
                weight * anchor * anchor
                for weight, anchor in zip(row_weights, anchors)
            ),
            F(0),
        )
        eta_from_norms = (
            endpoint_trace * endpoint_trace
            * central_energy
            / state_energy
        )
        eta_from_rows = (
            endpoint_trace * endpoint_trace
            * sum(row_weights, F(0))
            / sum(
                (
                    weight * anchor * anchor
                    for weight, anchor in zip(row_weights, anchors)
                ),
                F(0),
            )
        )
        self.assertEqual(eta_from_norms, eta_from_rows)

    def test_second_derivative_exponents_and_nonuniform_correction(
        self,
    ) -> None:
        truncation_order = 1
        bernstein_lambda = -(2 * truncation_order + 1) + 2
        bernstein_log = 4
        self.assertEqual((bernstein_lambda, bernstein_log), (-1, 4))

        integrations = F(3)
        projection_lambda = -integrations + F(5, 2)
        projection_log = (
            integrations - F(5, 2)
            + 3 * (-integrations + F(5, 2))
        )
        self.assertEqual(projection_lambda, F(-1, 2))
        self.assertEqual(projection_log, F(-1))

        normalized = []
        for lam in (100.0, 1000.0, 10000.0):
            length = 2.0 * math.log(lam)
            cutoff = 2.0 * math.pi * lam * length**2
            ratio = (
                (2.0 * cutoff**2 - 21.0)
                / (32.0 * math.pi * lam**2)
            )
            normalized.append(ratio / length**4)
            expected = (
                math.pi / 4.0
                - 21.0
                / (32.0 * math.pi * lam**2 * length**4)
            )
            self.assertAlmostEqual(normalized[-1], expected, places=13)
        self.assertTrue(
            all(
                abs(right - math.pi / 4.0)
                < abs(left - math.pi / 4.0)
                for left, right in zip(normalized, normalized[1:])
            )
        )

    def test_exact_saturation_factorization_and_sufficient_gate(
        self,
    ) -> None:
        ground = F(1)
        state_rayleigh = F(2)
        derivative_rayleigh = F(10)
        floor = F(5)
        saturation = derivative_rayleigh / floor
        epsilon_plus = ground / floor

        self.assertEqual(
            epsilon_plus,
            (ground / state_rayleigh)
            * (state_rayleigh / derivative_rayleigh)
            * saturation,
        )
        eta = F(1, 10)
        derivative_lower_factor = F(4) * (1 - eta) ** 2
        self.assertGreaterEqual(
            derivative_rayleigh / state_rayleigh,
            derivative_lower_factor,
        )
        certified_upper = saturation / derivative_lower_factor
        rho = F(1, 3)
        self.assertLess(certified_upper, 1 - rho)
        self.assertLessEqual(epsilon_plus, certified_upper)
        self.assertGreater(1 - epsilon_plus, rho)

    def test_combined_reference_eta_and_primitive(self) -> None:
        size = 3
        coefficients = {
            -3: F(2, 7),
            -2: F(3, 11),
            -1: F(-4, 13),
            0: F(5, 17),
            1: F(-4, 13),
            2: F(3, 11),
            3: F(2, 7),
        }
        central = F(7, 19)
        boundary = sum(coefficients.values(), F(0))
        inverse_squares = sum(
            (
                F(1, index * index)
                for index in range(-size, size + 1)
                if index
            ),
            F(0),
        )
        psi = {
            index: (
                F(1, index * index)
                if index
                else -inverse_squares
            )
            for index in range(-size, size + 1)
        }
        primitive = {
            index: (
                coefficients[index]
                - (boundary if index == 0 else 0)
                - central * psi[index]
            )
            for index in range(-size, size + 1)
        }
        projected_second = {
            index: (
                F(0)
                if index == 0
                else -index * index * coefficients[index] + central
            )
            for index in range(-size, size + 1)
        }
        self.assertEqual(sum(psi.values(), F(0)), 0)
        self.assertEqual(sum(primitive.values(), F(0)), 0)
        self.assertEqual(
            projected_second,
            {
                index: -index * index * primitive[index]
                for index in range(-size, size + 1)
            },
        )

        mismatch = (1.0, 2.0, -1.0)
        endpoint_error = (-1.0, 0.0, 1.0)
        primitive_error = (0.0, -1.0, 0.0)
        combined = tuple(
            left + middle + right
            for left, middle, right in zip(
                mismatch,
                endpoint_error,
                primitive_error,
            )
        )

        def norm(values: tuple[float, ...]) -> float:
            return math.sqrt(sum(value * value for value in values))

        split = (
            norm(mismatch)
            + norm(endpoint_error)
            + norm(primitive_error)
        )
        self.assertLess(norm(combined), split)

        actual = (3.0, -2.0, 1.0)
        reference_primitive = tuple(
            value - error
            for value, error in zip(actual, combined)
        )
        ordinates = (2.0, 3.0, 5.0)
        reference_second = tuple(
            -ordinate**2 * value
            for ordinate, value in zip(
                ordinates,
                reference_primitive,
            )
        )
        actual_norm = norm(actual)
        eta_combined = norm(combined) / actual_norm
        physical_actual = 5.0
        physical_second = 7.0
        q_value = actual_norm**2 / (2.0 * physical_actual)
        r_value = norm(reference_second) ** 2 / (
            2.0 * physical_second
        )
        lower = (
            min(ordinates) ** 4
            * physical_actual
            / physical_second
            * max(0.0, 1.0 - eta_combined) ** 2
        )
        self.assertGreaterEqual(r_value / q_value + 1e-12, lower)

    def test_one_rayleigh_value_does_not_lower_bound_the_floor(self) -> None:
        for denominator in (10, 100, 1000, 10000):
            epsilon = F(1, denominator)
            ground = F(1)
            state_rayleigh = 1 + epsilon / 2
            derivative_rayleigh = F(denominator)
            floor = 1 + epsilon
            reserve = 1 - ground / floor
            self.assertLessEqual(ground, state_rayleigh)
            self.assertLess(floor, derivative_rayleigh)
            self.assertGreater(
                derivative_rayleigh / state_rayleigh,
                denominator / 2,
            )
            self.assertLess(reserve, epsilon)

    def test_exact_rational_phase_countermodels(self) -> None:
        transforms = {0: F(4), 1: F(4, 3), 2: F(-4, 15)}
        p0 = {0: F(-1, 5), 1: F(4, 5), 2: F(1)}
        p1 = {0: F(0), 1: F(4), 2: F(5)}
        u = {0: F(1, 4), 1: F(-3, 4), 2: F(0)}
        v = {0: F(3, 16), 1: F(3, 16), 2: F(0)}

        expected = {
            "p0": (F(0), F(0), F(0)),
            "p1": (F(1), F(4), F(0)),
            "u": (F(1), F(0), F(1)),
            "v": (F(0), F(1), F(-1, 4)),
        }
        for name, coefficients in (
            ("p0", p0),
            ("p1", p1),
            ("u", u),
            ("v", v),
        ):
            self.assertEqual(
                (
                    cosine_endpoint(coefficients),
                    cosine_sample(coefficients, transforms),
                    cosine_second_sample(coefficients, transforms),
                ),
                expected[name],
            )

        small_ratios = []
        large_ratios = []
        for scale in (10, 20, 40, 80):
            epsilon = F(1, scale)
            strictifying_small = epsilon**4
            q_small = (4 * epsilon) ** 2 + strictifying_small
            r_small = strictifying_small
            small_ratios.append(float(r_small / q_small))

            strictifying_large = epsilon**6
            q_large = epsilon**4 + strictifying_large
            r_large = (
                (epsilon - epsilon**2 / 4) ** 2
                + strictifying_large
            )
            large_ratios.append(float(r_large / q_large))

        self.assertTrue(
            all(
                left > right
                for left, right in zip(
                    small_ratios,
                    small_ratios[1:],
                )
            )
        )
        self.assertTrue(
            all(
                left < right
                for left, right in zip(
                    large_ratios,
                    large_ratios[1:],
                )
            )
        )

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(
            compiler,
            "pdflatex is required for TeX regression",
        )
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join(
                "\\[" + display + "\\]"
                for display in displays
            )
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "note.tex"
            source.write_text(document, encoding="ascii")
            result = subprocess.run(
                [
                    compiler,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    source.name,
                ],
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
            self.assertTrue(
                all(
                    line == line.rstrip(b" ")
                    for line in raw.splitlines()
                )
            )

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn(r",qquad", self.text)
        self.assertNotIn(r",quad", self.text)
        self.assertNotIn(r"P_N=\sum_{n=0}^Np_n", self.text)
        self.assertIn(r"d_N=\sum_{n=0}^Np_n", self.text)
        self.assertNotIn(r"estimate for \(P_N\)", self.text)
        self.assertIn(r"estimate for \(d_N\)", self.text)
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "strongest derivative comparison uses the actual projected finite prolate state",
            "exact source-specific relative endpoint formula",
            "first formal correction has the exact transforms",
            "one Rayleigh upper test cannot become an all-vector lower bound",
            "combined sampling vector",
            "finite phase and sampling countermodels only",
            "not the actual source-Cauchy matrix",
            "standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "rh proves the even reserve",
            "r_n^pr lower-bounds lambda_min",
            "the phase model is the zeta divisor",
            "the riemann hypothesis is proved",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
