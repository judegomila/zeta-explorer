#!/usr/bin/env python3
"""Regressions for the conditional continuous m=l=1 reduction."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_NEGATIVE_PACKET_THEOREM.md"
)
NOTE_HASH = "0ec602eb10822b3a44d5c1f59b2d252d61fa9d6ba6fcc0d620dbc75f3d2edeb4"

DEPENDENCIES = {
    "notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md":
        "1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md":
        "1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c",
    "notes/GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md":
        "16db62873056fb419bc740154c67a8f27ce6ecea2b85201abab7b89aa20d56d0",
    "notes/GROWING_TRANSITION_COMPLETE_FLAT_WEBER_ZERO_RESIDUE_OBSTRUCTION_THEOREM.md":
        "9476d9bb9cb56bb8d0eddfd8a5056637c48fd8974bc77c33b5cdeccb5c57fed0",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def a_curved(x_value: mp.mpf, conductor: mp.mpf, epsilon: int) -> mp.mpf:
    return 2 * x_value + epsilon * x_value**2 / conductor


def flat_weber(energy: mp.mpf, x_value: mp.mpf) -> mp.mpc:
    parameter = mp.mpf("0.5") - 1j * energy / 4
    return mp.exp(1j * x_value) * mp.hyp1f1(
        parameter, 1, -2j * x_value
    )


def flat_laplace(energy: mp.mpf, z_value: mp.mpf) -> mp.mpf:
    return (
        mp.exp(-energy * mp.atan(1 / z_value) / 2)
        / mp.sqrt(1 + z_value**2)
    )


class ContinuousM11TwoClusterTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 90
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertNotEqual(NOTE_HASH, "PENDING")
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in DEPENDENCIES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_scope_wall_is_explicit(self) -> None:
        required = (
            "no unconditional curved",
            "prime shell, no `m>=2`",
            "no `m>=2` or `l>=2` sampler",
            "central negative packet",
            "uniform lower bound for the actual leakage factors is **not** proved",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_missing_analytic_gates_are_fail_closed(self) -> None:
        required = (
            "Gate **G**",
            "logarithm cannot be omitted",
            "do not by themselves prove (3.13)",
            "Endpoint formulas (5.9)--(5.10) therefore do not prove **T**",
            "Gate **T**$_{\\rm sm}$",
            "does **not** prove",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_liouville_curvature_and_exact_perturbation(self) -> None:
        for epsilon in (-1, 1):
            for conductor in (mp.mpf(101), mp.mpf(1009)):
                for x_value in (mp.mpf("0.3"), mp.mpf(3), mp.mpf(17)):
                    gamma = mp.mpf("7.25")
                    a_value = a_curved(x_value, conductor, epsilon)
                    a_prime = 2 + 2 * epsilon * x_value / conductor
                    a_second = 2 * epsilon / conductor
                    curvature = (
                        a_prime**2 / (4 * a_value**2)
                        - a_second / (2 * a_value)
                    )
                    self.assertLess(
                        abs(curvature - 1 / a_value**2), mp.mpf("1e-80")
                    )

                    direct = (
                        gamma / a_value
                        + 1 / a_value**2
                        - gamma / (2 * x_value)
                        - 1 / (4 * x_value**2)
                    )
                    claimed = (
                        -epsilon
                        * gamma
                        / (4 * conductor * (1 + epsilon * x_value / (2 * conductor)))
                        - epsilon
                        / (4 * conductor * x_value)
                        * (1 + epsilon * x_value / (4 * conductor))
                        / (1 + epsilon * x_value / (2 * conductor)) ** 2
                    )
                    self.assertLess(abs(direct - claimed), mp.mpf("1e-80"))

    def test_kummer_green_pair_has_unit_wronskian(self) -> None:
        for gamma in (mp.mpf("-9.5"), mp.mpf("2.75")):
            parameter = mp.mpf("0.5") - 1j * gamma / 4

            def f_value(x_value: mp.mpf) -> mp.mpc:
                return (
                    mp.sqrt(2 * x_value)
                    * mp.exp(1j * x_value)
                    * mp.hyp1f1(parameter, 1, -2j * x_value)
                )

            def g_value(x_value: mp.mpf) -> mp.mpc:
                return (
                    -mp.gamma(parameter)
                    / 2
                    * mp.sqrt(2 * x_value)
                    * mp.exp(1j * x_value)
                    * mp.hyperu(parameter, 1, -2j * x_value)
                )

            for x_value in (mp.mpf("0.4"), mp.mpf("1.7"), mp.mpf("6.2")):
                wronskian = (
                    f_value(x_value) * mp.diff(g_value, x_value)
                    - mp.diff(f_value, x_value) * g_value(x_value)
                )
                self.assertLess(abs(wronskian - 1), mp.mpf("1e-65"))

    def test_forbidden_action_identity_and_asymptotic(self) -> None:
        for conductor, alpha in (
            (mp.mpf(1000), mp.mpf(7)),
            (mp.mpf(10000), mp.mpf(19)),
        ):
            turning = conductor * (1 - mp.sqrt(1 - alpha / conductor))
            # Split away the integrable square-root endpoints.
            direct = mp.quad(
                lambda u: mp.sqrt(alpha / (2 * u - u**2 / conductor) - 1),
                [0, turning / 2, turning],
            )
            transformed = alpha * mp.quad(
                lambda phi: mp.cos(phi) ** 2
                / mp.sqrt(1 - (alpha / conductor) * mp.sin(phi) ** 2),
                [0, mp.pi / 2],
            )
            self.assertLess(abs(direct - transformed), mp.mpf("1e-40"))
            self.assertLess(
                abs(transformed - mp.pi * alpha / 4),
                mp.mpf("0.2") * alpha**2 / conductor,
            )

    def test_flat_two_turning_point_action(self) -> None:
        for alpha in (mp.mpf("2.5"), mp.mpf(7), mp.mpf(19)):
            discriminant = mp.sqrt(alpha**2 - 4)
            x_minus = (alpha - discriminant) / 4
            x_plus = (alpha + discriminant) / 4
            action = mp.quad(
                lambda x_value: mp.sqrt(
                    -(1 - alpha / (2 * x_value) + 1 / (4 * x_value**2))
                ),
                [x_minus, (x_minus + x_plus) / 2, x_plus],
            )
            exact = mp.pi * alpha / 4 - mp.pi / 2
            self.assertLess(abs(action - exact), mp.mpf("1e-70"))

    def test_exact_physical_kernel_identity_and_series(self) -> None:
        for conductor in (mp.mpf(101), mp.mpf(1009)):
            for u_value, v_value in (
                (mp.mpf("0.2"), mp.mpf("0.7")),
                (mp.mpf(3), mp.mpf(5)),
            ):
                z_value = (u_value + v_value) / (conductor - u_value)
                direct = 1 / (
                    (conductor - u_value)
                    * mp.log((conductor + v_value) / (conductor - u_value))
                )
                factored = (
                    z_value
                    / mp.log(1 + z_value)
                    / (u_value + v_value)
                )
                self.assertLess(abs(direct - factored), mp.mpf("1e-80"))
                first_order = 1 / (u_value + v_value) + 1 / (
                    2 * (conductor - u_value)
                )
                remainder_scale = (u_value + v_value) / (
                    conductor - u_value
                ) ** 2
                self.assertLess(abs(direct - first_order), remainder_scale)

    def test_flat_conormal_closed_form(self) -> None:
        for alpha, beta in (
            (mp.mpf("8.1"), mp.mpf("2.3")),
            (mp.mpf("3.7"), mp.mpf("3.2")),
        ):
            delta = alpha - beta
            integral = mp.quad(
                lambda z: flat_laplace(-alpha, z) * flat_laplace(beta, z),
                [0, 1, mp.inf],
            )
            closed = 2 * (mp.exp(mp.pi * delta / 4) - 1) / delta
            self.assertLess(abs(integral - closed), mp.mpf("1e-65"))

    def test_parameter_margins_are_simultaneously_positive(self) -> None:
        a_one = mp.mpf("0.20")
        epsilon = mp.mpf("0.10")
        eta_zero = 1 - (mp.pi + 2 * epsilon) * a_one
        eta_one = 1 - (mp.pi + 3 * epsilon / 2) * a_one
        self.assertGreater(eta_zero, 0)
        self.assertGreater(eta_one, eta_zero)
        theta = (mp.pi / 2 + epsilon) * a_one
        self.assertLess(theta, mp.mpf("0.5"))

    def test_cauchy_determinant_and_inverse_scale(self) -> None:
        a_nodes = [mp.mpf("-0.8"), mp.mpf("0.35"), mp.mpf("1.7")]
        b_nodes = [mp.mpf("-1.1"), mp.mpf("0.6"), mp.mpf("2.2")]
        dimension = len(a_nodes)

        for scale in (mp.mpf(20), mp.mpf(80), mp.mpf(250)):
            matrix = mp.matrix(
                [
                    [1 / (scale + aa - bb) for bb in b_nodes]
                    for aa in a_nodes
                ]
            )
            determinant = mp.det(matrix)
            numerator = mp.mpf(1)
            for left in range(dimension):
                for right in range(left + 1, dimension):
                    numerator *= a_nodes[right] - a_nodes[left]
                    numerator *= b_nodes[left] - b_nodes[right]
            denominator = mp.fprod(
                scale + aa - bb for aa in a_nodes for bb in b_nodes
            )
            self.assertLess(
                abs(determinant - numerator / denominator), mp.mpf("1e-75")
            )

            inverse_norm = mp.norm(matrix**-1, p=mp.inf)
            scaled_inverse = inverse_norm / scale ** (2 * dimension - 1)
            self.assertLess(scaled_inverse, mp.mpf(100))
            self.assertGreater(scaled_inverse, mp.mpf("1e-8"))

    def test_two_cluster_hermitian_matrix_has_m_negative_eigenvalues(self) -> None:
        h_value = mp.pi / 4
        low = [mp.mpf("-0.9"), mp.mpf("0.4"), mp.mpf("1.8")]
        high_offsets = [mp.mpf("-1.2"), mp.mpf("0.2"), mp.mpf("1.1")]
        scale = mp.mpf(45)
        energies = low + [scale + value for value in high_offsets]

        def hermitian_flat(left: mp.mpf, right: mp.mpf) -> mp.mpf:
            difference = left - right
            if abs(difference) < mp.mpf("1e-70"):
                return 2 * h_value
            return 2 * mp.sinh(h_value * difference) / difference

        matrix = mp.matrix(
            [
                [hermitian_flat(left, right) for right in energies]
                for left in energies
            ]
        )
        eigenvalues, _ = mp.eigsy(matrix)
        negative = [value for value in eigenvalues if value < 0]
        self.assertEqual(len(negative), len(low))

        cross = mp.matrix(
            [
                [
                    hermitian_flat(scale + high_offsets[row], low[column])
                    for column in range(len(low))
                ]
                for row in range(len(low))
            ]
        )
        singular_values = mp.svd(cross, compute_uv=False)
        smallest = min(singular_values)
        self.assertGreater(
            smallest * scale ** (2 * len(low) - 1) / mp.exp(h_value * scale),
            mp.mpf("1e-6"),
        )

    def test_d_white_scalar_has_one_inverse_log_factor(self) -> None:
        conductor = mp.mpf("1e12")
        wavelength = mp.sqrt(conductor / (2 * mp.pi))
        j_alpha = mp.mpf(13)
        j_beta = mp.mpf(11)
        z_alpha = mp.sqrt(mp.pi * conductor / (2 * wavelength * j_alpha))
        z_beta = mp.sqrt(mp.pi * conductor / (2 * wavelength * j_beta))
        physical = wavelength * z_alpha * z_beta / (4 * conductor)
        claimed = mp.pi / (8 * mp.sqrt(j_alpha * j_beta))
        self.assertLess(abs(physical - claimed), mp.mpf("1e-75"))

    def test_smooth_symbol_limits(self) -> None:
        for radius in (mp.mpf("1e-4"), mp.mpf("3e-4")):
            arch_regular = 1 / mp.sinh(radius) - 1 / radius
            self.assertLess(
                abs(arch_regular + radius / 6), mp.mpf(1) * radius**3
            )
        for radius in (mp.mpf(3), mp.mpf(7)):
            arch_regular = 1 / mp.sinh(radius) - 1 / radius
            self.assertLess(abs(arch_regular), 2 / radius)


if __name__ == "__main__":
    unittest.main()
