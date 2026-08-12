#!/usr/bin/env python3
"""Regressions for the complete affine flat-Weber zero-residue theorem."""

from __future__ import annotations

import hashlib
from pathlib import Path
import re
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_COMPLETE_FLAT_WEBER_ZERO_RESIDUE_OBSTRUCTION_THEOREM.md"
)
NOTE_HASH = "9476d9bb9cb56bb8d0eddfd8a5056637c48fd8974bc77c33b5cdeccb5c57fed0"

DEPENDENCIES = {
    "notes/NEAR_SIGNED_HANKEL_REDUCTION.md":
        "fba7078c9695951fa7160e2587ff774dc1d10730bd94dc3efdec4b851ef9408e",
    "tests/test_near_hankel_geometry_replay.py":
        "9eea35b97e06cb942c36c14cbf489544965793bf89a2ca878c089cb00c11930c",
    "notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md":
        "1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d",
    "tests/test_growing_transition_edge_carleman_scattering_obstruction.py":
        "b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md":
        "a3a874470e62daa012dc97d6c908e12ac13378ff7e23219e0fbe3cee56b27a85",
    "tests/test_growing_transition_complete_central_plemelj_cauchy_floor_theorem.py":
        "b9f9cf3d76554b988d7c6d9408130a9ab2b45d37a1862279e139ed7e62edbe61",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/GROWING_TRANSITION_FINITE_FEJER_XI_WRONSKIAN_ASSEMBLY_GATE.md":
        "41dad88fd3e5bcb3277ccadb6baaa4bfa40ab683d15c747bebe8a50ce759ff23",
    "tests/test_growing_transition_finite_fejer_xi_wronskian_assembly_gate.py":
        "dcb9640a5294ae5c44502f983f20f9eadcdf8271dd02099b9d3887f255460aee",
    "notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md":
        "18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b",
    "tests/test_centered_zero_gram_simultaneous_vertex_subsequence.py":
        "39ee34b725a27873143e140a3e4ba71489e8deb406eb73bbefde63ecb68fdc0d",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def weber_transform(energy: mp.mpf, value: mp.mpc) -> mp.mpc:
    action = mp.atan(1 / value)
    return mp.exp(-energy * action / 2) / mp.sqrt(1 + value**2)


def zero_term(
    alpha: mp.mpf, beta: mp.mpf, rho: mp.mpc, conductor: mp.mpf
) -> mp.mpc:
    value = (1 - rho) / conductor
    return (
        -2
        / conductor
        * weber_transform(-alpha, value)
        * weber_transform(beta, value)
    )


def phi(delta: mp.mpf, value: mp.mpc) -> mp.mpc:
    return mp.exp(delta * mp.atan(1 / value) / 2) / (1 + value**2)


class CompleteFlatWeberZeroResidueTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 80
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_hash_pinned(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in DEPENDENCIES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_canonical_pole_inversion_has_the_pinned_sign(self) -> None:
        conductor = mp.mpf("13")
        rho = mp.mpf("0.37") + mp.mpf("4.2") * 1j
        z_value = mp.mpf("0.8") + mp.mpf("0.3") * 1j
        a_value = 1 - rho
        left = -2 / (1 + conductor * z_value - rho)
        right = -2 / conductor / (z_value + a_value / conductor)
        self.assertLess(abs(left - right), mp.mpf("1e-75"))

        laplace = mp.quad(
            lambda radius: (-2 / conductor)
            * mp.exp(-a_value * radius / conductor)
            * mp.exp(-z_value * radius),
            [0, mp.inf],
        )
        self.assertLess(abs(laplace - left), mp.mpf("1e-70"))

    def test_weber_product_equals_exact_full_zero_formula(self) -> None:
        conductor = mp.mpf("10")
        rho = mp.mpf("0.37") + mp.mpf("2.3") * 1j
        alpha = mp.mpf("3.2")
        beta = mp.mpf("-1.4")
        k_value = (alpha - beta) / 2
        a_value = 1 - rho

        direct = zero_term(alpha, beta, rho, conductor)
        ratio_power = mp.exp(
            1j
            * k_value
            / 2
            * mp.log((a_value - 1j * conductor) / (a_value + 1j * conductor))
        )
        closed = -2 * conductor * ratio_power / (a_value**2 + conductor**2)
        self.assertLess(abs(direct - closed), mp.mpf("1e-70"))

    def test_interior_and_exterior_complete_to_the_full_term(self) -> None:
        conductor = mp.mpf("17")
        rho = mp.mpf("0.41") + mp.mpf("5.7") * 1j
        alpha = mp.mpf("4.1")
        beta = mp.mpf("-0.7")
        k_value = (alpha - beta) / 2
        full = zero_term(alpha, beta, rho, conductor)
        interior = full / (1 - mp.exp(-mp.pi * k_value))
        exterior = (
            -mp.exp(-mp.pi * k_value)
            / (1 - mp.exp(-mp.pi * k_value))
            * full
        )
        self.assertLess(abs(interior + exterior - full), mp.mpf("1e-75"))
        self.assertLess(
            abs(exterior / full + mp.exp(-mp.pi * k_value)
                / (1 - mp.exp(-mp.pi * k_value))),
            mp.mpf("1e-75"),
        )

    def test_quartet_formula_and_critical_line_no_double_count(self) -> None:
        conductor = mp.mpf("17")
        alpha = mp.mpf("2.2")
        beta = mp.mpf("-0.9")
        delta = alpha - beta
        rho = mp.mpf("0.31") + mp.mpf("4.7") * 1j
        orbit = [rho, mp.conj(rho), 1 - rho, 1 - mp.conj(rho)]
        direct = mp.fsum(zero_term(alpha, beta, item, conductor) for item in orbit)
        closed = -4 / conductor * mp.re(
            phi(delta, (1 - rho) / conductor)
            + phi(delta, rho / conductor)
        )
        self.assertLess(abs(direct - closed), mp.mpf("1e-70"))

        critical = mp.mpf("0.5") + mp.mpf("4.7") * 1j
        critical_orbit = [critical, mp.conj(critical)]
        critical_direct = mp.fsum(
            zero_term(alpha, beta, item, conductor)
            for item in critical_orbit
        )
        critical_closed = -4 / conductor * mp.re(
            phi(delta, (1 - critical) / conductor)
        )
        self.assertLess(
            abs(critical_direct - critical_closed), mp.mpf("1e-70")
        )
        self.assertGreater(abs(critical_direct - 2 * critical_closed), 1)

    def test_missing_gram_reindex_and_difference_of_grams(self) -> None:
        conductor = mp.mpf("10")
        rho = mp.mpf("0.37") + mp.mpf("2.3") * 1j
        a_value = 1 - rho
        required_a = -mp.conj(a_value)
        required_rho = 1 - required_a
        self.assertLess(abs(required_rho - (2 - mp.conj(rho))), mp.mpf("1e-75"))
        actual_orbit = [rho, mp.conj(rho), 1 - rho, 1 - mp.conj(rho)]
        self.assertGreater(
            min(abs(required_rho - item) for item in actual_orbit),
            mp.mpf("0.1"),
        )

        labels = [mp.mpf("-2"), mp.mpf("0.4"), mp.mpf("2.7")]
        u_vector = [
            weber_transform(-label, a_value / conductor) for label in labels
        ]
        v_vector = [
            mp.conj(weber_transform(label, a_value / conductor))
            for label in labels
        ]
        ordered = [
            [
                -2 / conductor * u_vector[row] * mp.conj(v_vector[column])
                for column in range(len(labels))
            ]
            for row in range(len(labels))
        ]
        hermitian = [
            [
                (ordered[row][column] + mp.conj(ordered[column][row])) / 2
                for column in range(len(labels))
            ]
            for row in range(len(labels))
        ]
        difference = [
            [
                (
                    (u_vector[row] - v_vector[row])
                    * mp.conj(u_vector[column] - v_vector[column])
                    - (u_vector[row] + v_vector[row])
                    * mp.conj(u_vector[column] + v_vector[column])
                )
                / (2 * conductor)
                for column in range(len(labels))
            ]
            for row in range(len(labels))
        ]
        self.assertLess(
            max(
                abs(hermitian[row][column] - difference[row][column])
                for row in range(len(labels))
                for column in range(len(labels))
            ),
            mp.mpf("1e-70"),
        )

        norm_u = mp.fsum(abs(value) ** 2 for value in u_vector)
        norm_v = mp.fsum(abs(value) ** 2 for value in v_vector)
        overlap = mp.fsum(
            mp.conj(u_vector[index]) * v_vector[index]
            for index in range(len(labels))
        )
        eigenvalue_product = (
            abs(overlap) ** 2 - norm_u * norm_v
        ) / conductor**2
        self.assertLess(eigenvalue_product, 0)

    def test_collar_exact_factorization_and_unique_saddle(self) -> None:
        conductor = mp.mpf("1000")
        x_value = mp.mpf("0.4")
        k_value = mp.mpf("12")
        r_value = k_value * x_value / 2
        a_value = x_value - 1j * (conductor - r_value)
        action = mp.log(
            (a_value + 1j * conductor) / (a_value - 1j * conductor)
        ) / (2j)
        real_closed = (
            mp.atan(r_value / x_value)
            + mp.atan((2 * conductor - r_value) / x_value)
        ) / 2
        imaginary_closed = mp.log(
            (x_value**2 + (2 * conductor - r_value) ** 2)
            / (x_value**2 + r_value**2)
        ) / 4
        self.assertLess(abs(mp.re(action) - real_closed), mp.mpf("1e-70"))
        self.assertLess(abs(mp.im(action) - imaginary_closed), mp.mpf("1e-70"))

        denominator = abs(a_value**2 + conductor**2)
        denominator_closed = mp.sqrt(
            (x_value**2 + r_value**2)
            * (x_value**2 + (2 * conductor - r_value) ** 2)
        )
        self.assertLess(abs(denominator - denominator_closed), mp.mpf("1e-65"))
        derivative = (k_value * x_value - 2 * r_value) / (
            r_value**2 + x_value**2
        )
        self.assertEqual(derivative, 0)
        for displacement in (mp.mpf("-0.1"), mp.mpf("0.1")):
            shifted = r_value * (1 + displacement)
            shifted_derivative = (k_value * x_value - 2 * shifted) / (
                shifted**2 + x_value**2
            )
            self.assertEqual(mp.sign(shifted_derivative), -mp.sign(displacement))

    def test_collar_saddle_asymptotic_and_phase(self) -> None:
        conductor = mp.mpf("1e15")
        x_value = mp.mpf("0.4")
        k_value = mp.mpf("30")
        r_value = k_value * x_value / 2
        a_value = x_value - 1j * (conductor - r_value)
        action = mp.log(
            (a_value + 1j * conductor) / (a_value - 1j * conductor)
        ) / (2j)
        term = -2 * conductor / (a_value**2 + conductor**2) * mp.exp(
            k_value * action
        )
        asymptotic = (
            2
            / (mp.e * k_value * x_value)
            * mp.exp(mp.pi * k_value / 2)
        )
        self.assertLess(abs(abs(term) / asymptotic - 1), mp.mpf("0.001"))

        phase = (
            mp.pi
            + mp.atan((2 * conductor - r_value) / x_value)
            - mp.atan(r_value / x_value)
            + k_value
            / 4
            * mp.log(
                (x_value**2 + (2 * conductor - r_value) ** 2)
                / (x_value**2 + r_value**2)
            )
        )
        self.assertLess(
            abs(mp.exp(1j * mp.arg(term)) - mp.exp(1j * phase)),
            mp.mpf("1e-65"),
        )

    def test_gate_has_separate_mate_saddles_and_no_fake_off_rh_density(self) -> None:
        for token in (
            r"\chi\!\left({2r\over kx}\right)K_\rho^{\rm full}(k)",
            r"\chi\!\left({2r\over k(1-x)}\right)",
            r"\mathbf 1_{\{x\ne1/2\}}",
            "no canonical marked",
            "`(x,gamma)` density",
            r"\mathfrak C_{c,k}^{\rm can}(\chi)-\mathfrak M_{c,k}(\chi)",
            r"o\!\left({e^{\pi k/2}\over k}\right)",
            "n=7,8",
            "stationary size is of order `k^(-1/2)`",
            "every finite stationary prime/prime-power",
            "Abel localization",
        ):
            self.assertIn(token, self.text)

    def test_stationary_prime_terms_are_cutoff_conditional(self) -> None:
        q_seven = 2 / mp.log(7)
        q_eight = 2 / mp.log(8)
        self.assertLess(abs(q_seven - mp.mpf("1.02779668")), mp.mpf("5e-9"))
        self.assertLess(abs(q_eight - mp.mpf("0.96179669")), mp.mpf("5e-9"))
        for token in (
            r"q_n={2\over\log n}",
            "selected only if `chi(q_n)!=0`",
            "a cutoff covering those two",
            "need not select them",
        ):
            self.assertIn(token, self.text)
        self.assertNotIn(
            "Multiplying (4.2) by the prefactor and the pole sign gives",
            self.text,
        )

    def test_affine_and_physical_shells_are_kept_distinct(self) -> None:
        flat_text = re.sub(r"\s+", " ", self.text)
        for token in (
            r"U+V=c\log n",
            r"1+{V\over c}=n\left(1-{U\over c}\right)",
            "shellwise curved two-profile composition theorem",
            "does not compute the actual curved",
            "P0_INVALIDATED",
            "No zero table, RH assumption",
        ):
            self.assertIn(token, flat_text)

    def test_equation_labels_and_amsmath_tag_placement(self) -> None:
        labels = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(labels), len(set(labels)))
        self.assertEqual(labels[0], "0.1")
        self.assertEqual(labels[-1], "8.4")
        for block in re.findall(
            r"\\begin\{aligned\}(.*?)\\end\{aligned\}",
            self.text,
            flags=re.DOTALL,
        ):
            self.assertNotIn(r"\tag{", block)


if __name__ == "__main__":
    unittest.main()
