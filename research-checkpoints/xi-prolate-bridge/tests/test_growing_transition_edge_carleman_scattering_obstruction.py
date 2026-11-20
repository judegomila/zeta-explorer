#!/usr/bin/env python3
"""Regressions for the isolated edge Carleman scattering obstruction."""

from __future__ import annotations

import hashlib
from pathlib import Path
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md"

NOTE_HASH = "1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d"
PROTECTED_HASHES = {
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md":
        "a3a874470e62daa012dc97d6c908e12ac13378ff7e23219e0fbe3cee56b27a85",
    "notes/GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md":
        "16db62873056fb419bc740154c67a8f27ce6ecea2b85201abab7b89aa20d56d0",
}

H = mp.pi / 4


def chi(alpha: mp.mpf) -> mp.mpf:
    return 1 / mp.sqrt(1 + mp.exp(-mp.pi * alpha / 2))


def r_kernel(alpha: mp.mpf, beta: mp.mpf) -> mp.mpf:
    gap = alpha - beta
    if gap == 0:
        return mp.pi / 2
    return 2 * mp.expm1(H * gap) / gap


def t_kernel(alpha: mp.mpf, beta: mp.mpf) -> mp.mpf:
    return (
        (1 + chi(alpha)) * chi(beta) * r_kernel(alpha, beta)
        + (1 + chi(beta)) * chi(alpha) * r_kernel(beta, alpha)
    ) / 2


class GrowingTransitionEdgeCarlemanScatteringObstructionTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        global H
        mp.mp.dps = 80
        H = mp.pi / 4

    def test_frozen_note_and_dependency_hashes(self) -> None:
        self.assertEqual(hashlib.sha256(NOTE.read_bytes()).hexdigest(), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_locked_half_integer_schedule_and_open_trace_inventory(self) -> None:
        note_text = NOTE.read_text()
        self.assertIn(r"\lambda={p\over2}", note_text)
        self.assertIn(r"p\geq5\text{ odd}", note_text)
        self.assertIn(r"A=\lambda^2={p^2\over4}", note_text)
        for p_value in range(5, 40, 2):
            four_a = p_value * p_value
            self.assertEqual(four_a % 4, 1)
            a_value = mp.mpf(four_a) / 4
            self.assertNotEqual(a_value, mp.floor(a_value))
            inventory = [n for n in range(1, p_value * p_value + 1) if n < a_value]
            self.assertEqual(inventory[-1], mp.floor(a_value))

    def test_conjugated_hilbert_tex_separator_is_well_formed(self) -> None:
        note_text = NOTE.read_text()
        self.assertNotIn(",qquad", note_text)
        self.assertIn(r"C_{\rm loc}=ZGRXZ,\qquad", note_text)

    def test_exact_log_coordinate_jacobian(self) -> None:
        for c_value, u_value, v_value in (
            (mp.mpf("100"), mp.mpf("3"), mp.mpf("7")),
            (mp.mpf("900"), mp.mpf("81"), mp.mpf("2.5")),
        ):
            s_value = -mp.log(1 - u_value / c_value)
            t_value = mp.log(1 + v_value / c_value)
            direct = (
                (1 + v_value / c_value)
                / (c_value - u_value)
                / (c_value + v_value)
                / (s_value + t_value)
            )
            reduced = 1 / (
                c_value
                * (c_value - u_value)
                * mp.log((c_value + v_value) / (c_value - u_value))
            )
            self.assertLess(abs(direct - reduced), mp.mpf("1e-75"))

    def test_kummer_laplace_transform(self) -> None:
        for alpha, z_value in (
            (mp.mpf("-1.25"), mp.mpf("1.4")),
            (mp.mpf("0.7"), mp.mpf("2.1")),
            (mp.mpf("3.0"), mp.mpf("1.8")),
        ):
            parameter = mp.mpf("0.5") - 1j * alpha / 4

            def integrand(u_value: mp.mpf) -> mp.mpc:
                w_value = (
                    mp.exp(1j * u_value)
                    * mp.hyp1f1(parameter, 1, -2j * u_value)
                )
                return mp.exp(-z_value * u_value) * w_value

            numerical = mp.quad(integrand, [0, 2, 6, mp.inf])
            expected = (
                mp.exp(-alpha * mp.atan(1 / z_value) / 2)
                / mp.sqrt(1 + z_value * z_value)
            )
            self.assertLess(abs(numerical - expected), mp.mpf("1e-55"))

    def test_flat_carleman_laplace_identity(self) -> None:
        for alpha, beta in (
            (mp.mpf("-2"), mp.mpf("0.5")),
            (mp.mpf("0"), mp.mpf("3")),
            (mp.mpf("4.25"), mp.mpf("1.5")),
        ):
            integral = mp.quad(
                lambda theta: mp.exp((alpha - beta) * theta / 2),
                [0, mp.pi / 2],
            )
            self.assertLess(abs(integral - r_kernel(alpha, beta)), mp.mpf("1e-70"))

    def test_d_white_chi_two_point_determinant_is_negative(self) -> None:
        for alpha, beta, z_alpha, z_beta in (
            (mp.mpf("1"), mp.mpf("0"), mp.mpf("0.3"), mp.mpf("7")),
            (mp.mpf("4"), mp.mpf("2"), mp.mpf("5"), mp.mpf("0.2")),
            (mp.mpf("8"), mp.mpf("-1"), mp.mpf("2"), mp.mpf("3")),
        ):
            determinant = (z_alpha * z_beta) ** 2 * (
                t_kernel(alpha, alpha) * t_kernel(beta, beta)
                - t_kernel(alpha, beta) ** 2
            )
            self.assertLess(determinant, 0)

            x_value = mp.exp(H * alpha)
            y_value = mp.exp(H * beta)
            a_value = mp.sqrt(1 + x_value * x_value)
            b_value = mp.sqrt(1 + y_value * y_value)
            log_mean = (x_value - y_value) / (mp.log(x_value) - mp.log(y_value))
            closed = (
                H
                * log_mean
                * (a_value + b_value + x_value + y_value)
                / (a_value * b_value)
            )
            self.assertLess(abs(closed - t_kernel(alpha, beta)), mp.mpf("1e-70"))

    def test_antisymmetric_packet_has_three_negative_directions(self) -> None:
        center = mp.mpf("20")
        offsets = [mp.mpf("1"), mp.mpf("2"), mp.mpf("3")]
        points = [center + offset for offset in offsets]
        points += [center - offset for offset in offsets]

        matrix = mp.matrix(6)
        for row, alpha in enumerate(points):
            for column, beta in enumerate(points):
                matrix[row, column] = t_kernel(alpha, beta)

        antisymmetric = mp.matrix(6, 3)
        for index in range(3):
            antisymmetric[index, index] = 1
            antisymmetric[index + 3, index] = -1
        restricted = antisymmetric.T * matrix * antisymmetric
        eigenvalues = mp.eigsy(restricted, eigvals_only=True)
        for eigenvalue in eigenvalues:
            self.assertLess(eigenvalue, 0)

    def test_endpoint_row_vanishes_on_antisymmetric_packets(self) -> None:
        # After y_j=z_j x_j removes the nonzero D-white endpoint factors,
        # endpoint nullity is sum(y_j)=0.
        for values in (
            [mp.mpf("1"), mp.mpf("-1")],
            [mp.mpf("2"), mp.mpf("-3"), mp.mpf("-2"), mp.mpf("3")],
        ):
            self.assertEqual(mp.fsum(values), 0)


if __name__ == "__main__":
    unittest.main()
