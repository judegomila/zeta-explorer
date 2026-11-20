#!/usr/bin/env python3
"""Focused regressions for the conditional central Plemelj--Cauchy floor."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path
import re
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md"
)

NOTE_HASH = "a3a874470e62daa012dc97d6c908e12ac13378ff7e23219e0fbe3cee56b27a85"
PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md":
        "1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c",
    "notes/GROWING_TRANSITION_EDGE_EDGE_HIGHER_ALIAS_THEOREM.md":
        "3bd3bf977178be94e91b7c6603db9df7f861f1cfe498bef303c210e9b87b9ec5",
    "notes/NEAR_SIGNED_HANKEL_REDUCTION.md":
        "fba7078c9695951fa7160e2587ff774dc1d10730bd94dc3efdec4b851ef9408e",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md":
        "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
}


def j_value(a_value: mp.mpf) -> mp.mpf:
    return mp.ellipk(1 - a_value)


def f_value(a_value: mp.mpf) -> mp.mpf:
    # Equivalent closed form for the integral in equation (5.1).
    return 2 * (
        1 - mp.ellipe(1 - a_value) + a_value * mp.ellipk(1 - a_value)
    )


class GrowingTransitionCompleteCentralPlemeljCauchyFloorTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 80

    def test_frozen_note_and_dependency_hashes(self) -> None:
        self.assertEqual(hashlib.sha256(NOTE.read_bytes()).hexdigest(), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_inward_trace_is_not_the_midpoint_trace(self) -> None:
        lam = mp.mpf("2.5")
        endpoint_value = mp.mpf("1.7")
        finite_sampler_sum = mp.mpf("-0.375")
        outer = finite_sampler_sum / (2 * mp.sqrt(lam))
        inward = mp.sqrt(lam) * endpoint_value / 2 + outer
        midpoint = mp.sqrt(lam) * endpoint_value / 4 + outer

        self.assertLess(
            abs((inward - outer) - mp.sqrt(lam) * endpoint_value / 2),
            mp.mpf("1e-70"),
        )
        self.assertLess(
            abs((midpoint - outer) - mp.sqrt(lam) * endpoint_value / 4),
            mp.mpf("1e-70"),
        )
        # The existing f(lambda)=0 shear only equalizes these traces.
        sheared_inward = outer
        self.assertEqual(sheared_inward, outer)
        self.assertNotEqual(outer, 0)

    def test_oriented_boundary_row_sign_and_indefinite_hermitian_part(self) -> None:
        # With beta_0=(0,1), beta_L=0 and Gamma=(1,0), the oriented
        # row is +2 Gamma^* beta_0.  Its Hermitian part has signs +/-.
        gamma = mp.matrix([[1, 0]])
        residual = mp.matrix([[0, 1]])
        oriented = 2 * gamma.T * residual
        self.assertEqual(oriented[0, 1], 2)
        self.assertEqual(oriented[1, 0], 0)

        hermitian_part = (oriented + oriented.T) / 2
        eigenvalues = mp.eigsy(hermitian_part, eigvals_only=True)
        self.assertLess(abs(eigenvalues[0] + 1), mp.mpf("1e-70"))
        self.assertLess(abs(eigenvalues[1] - 1), mp.mpf("1e-70"))

    def test_log_singular_boundary_bulk_completion(self) -> None:
        # L(z)=int exp(-zr)log(r)dr.  Boundary plus derivative bulk is
        # -L(q)+p(L(q)-L(p))/(p-q)=log(p/q)/(p-q).
        def laplace_log(z_value: mp.mpf) -> mp.mpf:
            return (-mp.euler - mp.log(z_value)) / z_value

        for p_value, q_value in (
            (mp.mpf("0.7"), mp.mpf("1.9")),
            (mp.mpf("2.3"), mp.mpf("0.4")),
            (mp.mpf("11"), mp.mpf("3.25")),
        ):
            boundary = -laplace_log(q_value)
            derivative_bulk = p_value * (
                laplace_log(q_value) - laplace_log(p_value)
            ) / (p_value - q_value)
            completed = boundary + derivative_bulk
            loewner = mp.log(p_value / q_value) / (p_value - q_value)
            self.assertLess(abs(completed - loewner), mp.mpf("1e-70"))
            self.assertGreater(completed, 0)

        p_value = mp.mpf("2.75")
        diagonal = mp.diff(
            lambda q_value: mp.log(p_value / q_value), p_value
        ) / mp.diff(lambda q_value: p_value - q_value, p_value)
        self.assertLess(abs(diagonal - 1 / p_value), mp.mpf("1e-70"))

    def test_correct_continuous_kernel_expansion(self) -> None:
        radius = mp.mpf("1e-25")
        continuous = mp.exp(-radius) / mp.expm1(2 * radius) - 1
        constant = continuous - 1 / (2 * radius)
        linear = (constant + 2) / radius
        self.assertLess(abs(constant + 2), mp.mpf("1e-23"))
        self.assertLess(abs(linear - mp.mpf(11) / 12), mp.mpf("1e-22"))

    def test_F_derivative_and_normalized_loewner_positivity(self) -> None:
        a_values = [mp.mpf("0.015"), mp.mpf("0.09"), mp.mpf("0.44")]
        for a_value in a_values:
            derivative = mp.diff(f_value, a_value)
            self.assertLess(abs(derivative - j_value(a_value)), mp.mpf("1e-65"))

        loewner = mp.matrix(len(a_values))
        for row, a_row in enumerate(a_values):
            for column, a_column in enumerate(a_values):
                if row == column:
                    loewner[row, column] = 1
                else:
                    loewner[row, column] = (
                        (f_value(a_row) - f_value(a_column))
                        / (a_row - a_column)
                        / mp.sqrt(j_value(a_row) * j_value(a_column))
                    )
        eigenvalues = mp.eigsy(loewner, eigvals_only=True)
        self.assertGreater(eigenvalues[0], -mp.mpf("1e-65"))
        for diagonal in range(len(a_values)):
            self.assertEqual(loewner[diagonal, diagonal], 1)

    def test_exact_loewner_jost_to_cauchy_cancellation(self) -> None:
        c_value = mp.mpf("1000")
        x_value = mp.mpf("0.73")
        for a_row, a_column in (
            (mp.mpf("0.015"), mp.mpf("0.09")),
            (mp.mpf("0.09"), mp.mpf("0.44")),
            (mp.mpf("0.015"), mp.mpf("0.44")),
        ):
            j_row = j_value(a_row)
            j_column = j_value(a_column)
            y_row = mp.sqrt(x_value * x_value + a_row)
            y_column = mp.sqrt(x_value * x_value + a_column)
            u_row = mp.sqrt(y_row)
            u_column = mp.sqrt(y_column)

            normalized_loewner = (
                (f_value(a_row) - f_value(a_column))
                / (a_row - a_column)
                / mp.sqrt(j_row * j_column)
            )
            half_density = (u_row / u_column + u_column / u_row) / 2
            sigma_difference = -c_value * (
                f_value(a_row) - f_value(a_column)
            ) / 2
            left = normalized_loewner * half_density / sigma_difference

            w_row = 1 / (c_value * y_row * j_row)
            w_column = 1 / (c_value * y_column * j_column)
            right = -mp.sqrt(w_row * w_column) / (y_row - y_column)
            self.assertLess(abs(left - right), mp.mpf("1e-65"))

    def test_density_derivative_bounds_are_uniform_in_x(self) -> None:
        c_value = mp.mpf("20000")
        for a_value in (mp.mpf("0.01"), mp.mpf("0.08"), mp.mpf("0.6")):
            j_current = j_value(a_value)
            j_prime = mp.diff(j_value, a_value)
            self.assertLessEqual(-a_value * j_prime, j_current / 2)
            self.assertGreaterEqual(j_current, mp.pi / 2)
            for x_value in (mp.mpf(0), mp.mpf("0.4"), mp.mpf("7")):
                y_value = mp.sqrt(x_value * x_value + a_value)
                derivative_log_rho = 1 / (2 * y_value**2) + j_prime / j_current
                self.assertLessEqual(abs(derivative_log_rho), 1 / a_value)

                alpha = c_value * a_value
                by_action = abs(derivative_log_rho) * 2 / (c_value * j_current)
                self.assertLessEqual(by_action, 4 / (mp.pi * alpha))

    def test_preissmann_constant_thresholds_and_mv_failure(self) -> None:
        positivity_threshold = 10 / mp.log(mp.mpf(9) / 8)
        tenth_threshold = 10 / mp.log(mp.mpf(81) / 80)
        self.assertLess(
            abs(positivity_threshold - mp.mpf("84.901870157037621")),
            mp.mpf("5e-15"),
        )
        self.assertLess(
            abs(tenth_threshold - mp.mpf("804.989647926626534")),
            mp.mpf("5e-15"),
        )

        alpha0 = mp.mpf("1000")
        r_zero = 2 * mp.exp(10 / alpha0) / (3 * mp.pi)
        preissmann_norm = r_zero * 4 * mp.pi / 3
        mv_norm = r_zero * 3 * mp.pi / 2
        self.assertLess(preissmann_norm, mp.mpf("0.9"))
        self.assertGreater(1 - preissmann_norm, mp.mpf("0.1"))
        self.assertEqual(mv_norm, mp.exp(10 / alpha0))
        self.assertGreater(mv_norm, 1)

        fourth_root = tenth_threshold ** mp.mpf("0.25")
        length_threshold = mp.exp(fourth_root)
        self.assertLess(abs(fourth_root - mp.mpf("5.326569204123189")), mp.mpf("1e-14"))
        self.assertLess(abs(length_threshold - mp.mpf("205.73094114223289")), mp.mpf("1e-12"))

    def test_weighted_cauchy_fixture_has_the_claimed_orientation(self) -> None:
        y_values = [mp.mpf(1), mp.mpf("2.4"), mp.mpf("5.1"), mp.mpf(9)]
        deltas = [
            min(abs(value - other) for other in y_values if other != value)
            for value in y_values
        ]
        alpha0 = mp.mpf("1000")
        r_zero = 2 * mp.exp(10 / alpha0) / (3 * mp.pi)
        weights = [r_zero * delta for delta in deltas]

        matrix = mp.matrix(len(y_values))
        for row in range(len(y_values)):
            for column in range(len(y_values)):
                if row == column:
                    matrix[row, column] = 0
                else:
                    matrix[row, column] = -mp.sqrt(
                        weights[row] * weights[column]
                    ) / (y_values[row] - y_values[column])
                    self.assertLessEqual(weights[row], r_zero * deltas[row])
        self.assertLess(mp.norm(matrix + matrix.T), mp.mpf("1e-70"))

        hermitian = 1j * matrix
        eigenvalues = mp.eighe(hermitian, eigvals_only=True)
        external_bound = (mp.mpf(8) / 9) * mp.exp(10 / alpha0)
        self.assertGreaterEqual(eigenvalues[0], -external_bound)
        self.assertGreaterEqual(1 + eigenvalues[0], 1 - external_bound)

    def test_scope_external_dependency_and_gap_are_serialized(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Hypothesis PA (complete physical Plemelj assembly)",
            "External input EH",
            "inward one-sided trace",
            r"\Gamma_{\rm in}(f)",
            r"-2a_j(L)\langle\delta_*(L+\cdot),b_k\rangle",
            r"\Gamma_{\rm in}^*r+r^*\Gamma_{\rm in}",
            r"{\log(p/q)\over p-q}",
            "continuous diagonal value `1/p`",
            "identity in (4.1) with coefficient exactly `+1`",
            r"=-{\sqrt{w_jw_k}\over y_j-y_k}",
            r"e^{10/\alpha_0}",
            r"{8\over9}e^{10/\alpha_0}",
            "84.9018701570376",
            "804.989647926627",
            "arXiv:1303.1085v1",
            "not vendored, not hashed, and not",
            "The `q=1` same-branch calculation alone is not `PA`",
            "supplies no positive floor",
            "not** a lower bound for `Q_X`",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        forbidden = (
            "PA is proved",
            "EH is source-locked",
            "the regular remainder is o(1)",
            "Q_X\\succeq0",
            "this proves RH",
            "midpoint value is the trace",
            "2k_{\\rm cont}(r)={1\\over r}-{5\\over2}",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)

    def test_tex_and_control_bytes_survive_serialization(self) -> None:
        for path in (NOTE, Path(__file__)):
            bad = [value for value in path.read_bytes() if value < 32 and value not in (9, 10)]
            self.assertEqual(bad, [], str(path))

        text = NOTE.read_text(encoding="utf-8")
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))
        self.assertEqual(text.count("\n\\[\n"), text.count("\n\\]\n"))
        for malformed in ("{cal P}", ",qquad", "\\delta_*(L+.)", "\n\\[\n\\[\n"):
            self.assertNotIn(malformed, text)


if __name__ == "__main__":
    unittest.main()
