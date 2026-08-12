#!/usr/bin/env python3
"""Regressions for the Euler-resolvent mixed-edge alias reduction."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import mpmath as mp
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_ODD_LAPLACE_EULER_RESOLVENT_MIXED_EDGE_ALIAS_REDUCTION_THEOREM.md"
)
NOTE_HASH = "289cc268263df97c0b778dc81cc982023a2793675dcb10c1b225ef42e965a467"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_ODD_LAPLACE_MIDDLE_BAND_ALIAS_FRAME_OBSTRUCTION_THEOREM.md":
        "6863fd558c13b52255a5bca67c2bb91aae4cd75b82180835a37e178546f70956",
    "tests/test_growing_transition_odd_laplace_middle_band_alias_frame_obstruction_theorem.py":
        "7c0c1a4abaa5768291ca6e7bfc9ca01915e6e8f78ada3f4071ac490a83c59a5a",
    "notes/GROWING_TRANSITION_ODD_LAPLACE_ZETA_HURWITZ_FEATURE_ANGLE_REDUCTION_THEOREM.md":
        "aaa5b189075b308f3d0ea0c0908ad36d4d871f4ce6626ff74ed9c730a09a0723",
    "tests/test_growing_transition_odd_laplace_zeta_hurwitz_feature_angle_reduction_theorem.py":
        "1bf0cec43d31d1d0f48899be0615faab108b99e86ef446894a8cdec807329a74",
    "notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md":
        "7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74",
    "tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py":
        "d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140",
    "notes/GROWING_TRANSITION_HIGHER_SAMPLER_AFFINE_CARLEMAN_SCALAR_GATE_THEOREM.md":
        "fd28ae155cb49e2d2700fec368e3bf4525452bdbf0ad80f4a37d2b09c593c249",
    "tests/test_growing_transition_higher_sampler_affine_carleman_scalar_gate_theorem.py":
        "993be1bf3eefad69c0f1991bbf38fc406abc6427cc61235e1b186ddd4e9dcb0e",
    "notes/GROWING_TRANSITION_ETA_NULL_RENORMALIZED_SOURCE_KREIN_INTERTWINER_THEOREM.md":
        "0c7c20639645d912d0e896bf064f83e3bd26078d716a183fa703d1586673d0d5",
    "tests/test_growing_transition_eta_null_renormalized_source_krein_intertwiner_theorem.py":
        "fac207d0c4847e7f624848aa174fae013f7099382d9ba785651be634849c5505",
    "notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md":
        "7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564",
    "tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py":
        "caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c",
    "notes/TRANSITION_PROLATE_OUTER_THEOREM.md":
        "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    "tests/test_transition_prolate_outer.py":
        "bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433",
    "notes/GROWING_TRANSITION_ONE_SIDED_ODD_LAPLACE_ROW_AND_FORWARD_ALIAS_THEOREM.md":
        "0edbe7253f6164399d468517bc9cbb9c8d9317250ac7dcc526eca9a8e15e7d3b",
    "tests/test_growing_transition_one_sided_odd_laplace_row_and_forward_alias_theorem.py":
        "97215866f7cf3a6969a7ec92d81e722a6e376034e95d58ff1e759b3780fcc79f",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def b1_right(x_value: float) -> float:
    return x_value - math.floor(x_value) - 0.5


def negative_power_segment(left: float, right: float, z_value: int) -> float:
    """Integral of B1(t)*t^(-z-1) inside one unit interval."""
    interval = math.floor(left)
    first = (
        right ** (1 - z_value) - left ** (1 - z_value)
    ) / (1 - z_value)
    second = (interval + 0.5) * (
        right ** (-z_value) - left ** (-z_value)
    ) / z_value
    return first + second


def positive_power_segment(
    left: float, right: float, exponent: int
) -> float:
    """Integral of B1(t)*t^exponent inside one unit interval."""
    interval = math.floor(left)
    return (
        (right ** (exponent + 2) - left ** (exponent + 2))
        / (exponent + 2)
        - (interval + 0.5)
        * (right ** (exponent + 1) - left ** (exponent + 1))
        / (exponent + 1)
    )


def right_resolvent(x_value: float, z_value: int, cutoff: int = 20000) -> float:
    pieces = []
    left = x_value
    while left < cutoff:
        right = min(float(math.floor(left) + 1), float(cutoff))
        pieces.append(negative_power_segment(left, right, z_value))
        left = right
    integral = math.fsum(pieces)
    return b1_right(x_value) - z_value * x_value**z_value * integral


def left_resolvent(x_value: float, z_value: int) -> float:
    pieces = []
    left = 0.0
    while left < x_value:
        right = min(float(math.floor(left) + 1), x_value)
        pieces.append(positive_power_segment(left, right, z_value - 2))
        left = right
    integral = math.fsum(pieces)
    return b1_right(x_value) - (
        (z_value - 1) * x_value ** (1 - z_value) * integral
    )


def symmetrized_cross(left: np.ndarray, right: np.ndarray) -> np.ndarray:
    return left.conj().T @ right + right.conj().T @ left


def ell_minus(x_value: mp.mpf, z_value: int, harmonic: int) -> mp.mpc:
    phase = 2j * mp.pi * harmonic
    return x_value ** (1 - z_value) * mp.quad(
        lambda t: mp.e ** (phase * t) * t ** (z_value - 1),
        [0, x_value],
    )


def ell_plus(x_value: mp.mpf, z_value: int, harmonic: int) -> mp.mpc:
    phase = 2j * mp.pi * harmonic
    integral = mp.quadosc(
        lambda t: mp.e ** (phase * t) * t ** (-z_value),
        [x_value, mp.inf],
        omega=2 * mp.pi * abs(harmonic),
    )
    return x_value**z_value * integral


class OddLaplaceEulerResolventMixedEdgeAliasTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_checkpoint_dependencies_are_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_strict_pass_standalone_row_pair_is_pinned(self) -> None:
        note = (
            "notes/"
            "GROWING_TRANSITION_ONE_SIDED_ODD_LAPLACE_ROW_AND_FORWARD_ALIAS_THEOREM.md"
        )
        test = (
            "tests/"
            "test_growing_transition_one_sided_odd_laplace_row_and_forward_alias_theorem.py"
        )
        self.assertEqual(
            PROTECTED_HASHES[note],
            "0edbe7253f6164399d468517bc9cbb9c8d9317250ac7dcc526eca9a8e15e7d3b",
        )
        self.assertEqual(
            PROTECTED_HASHES[test],
            "97215866f7cf3a6969a7ec92d81e722a6e376034e95d58ff1e759b3780fcc79f",
        )

    def test_right_euler_identity_including_empty_and_integer_ranges(self) -> None:
        for z_value in (3, 5):
            for x_value in (0.35, 0.9, 1.0, 1.6, 3.75):
                direct = math.fsum(
                    m ** (-z_value)
                    for m in range(1, math.floor(x_value) + 1)
                )
                euler = (
                    float(mp.zeta(z_value))
                    - x_value ** (1 - z_value) / (z_value - 1)
                    - x_value ** (-z_value)
                    * right_resolvent(x_value, z_value)
                )
                self.assertAlmostEqual(direct, euler, delta=3e-11)

    def test_left_euler_identity_including_empty_and_integer_ranges(self) -> None:
        for z_value in (3, 5, 7):
            for x_value in (0.2, 0.8, 1.0, 2.4, 4.0):
                direct = math.fsum(
                    float(m ** (z_value - 1))
                    for m in range(1, math.floor(x_value) + 1)
                )
                euler = (
                    x_value**z_value / z_value
                    - x_value ** (z_value - 1)
                    * left_resolvent(x_value, z_value)
                )
                self.assertAlmostEqual(direct, euler, delta=2e-10)

    def test_empty_range_boundary_formulas(self) -> None:
        for z_value in (3, 5):
            for x_value in (0.1, 0.4, 0.95):
                self.assertAlmostEqual(
                    right_resolvent(x_value, z_value),
                    float(mp.zeta(z_value)) * x_value**z_value
                    - x_value / (z_value - 1),
                    delta=3e-11,
                )
                self.assertAlmostEqual(
                    left_resolvent(x_value, z_value),
                    x_value / z_value,
                    delta=2e-13,
                )

    def test_completed_rows_reduce_exactly_to_two_resolvents(self) -> None:
        rng = np.random.default_rng(20260811)
        lam = 2.5
        for z_value in (3, 5, 9):
            moment = rng.normal(size=(1, 5)) + 1j * rng.normal(size=(1, 5))
            i_right = rng.normal(size=(1, 5)) + 1j * rng.normal(size=(1, 5))
            i_left = rng.normal(size=(1, 5)) + 1j * rng.normal(size=(1, 5))
            zeta = float(mp.zeta(z_value))
            t_row = zeta * moment - lam ** (-z_value) * i_right
            p_row = -(lam ** (z_value - 1)) * i_left
            a_direct = lam ** (0.5 - z_value) * (t_row + p_row) / 2
            b_direct = (
                lam ** (z_value - 0.5)
                * (zeta * moment - t_row)
                / 2
            )
            c_row = lam ** (0.5 - z_value) * zeta * moment / 2
            l_row = i_left / (2 * math.sqrt(lam))
            r_row = i_right / (2 * math.sqrt(lam))
            a_reduced = c_row - l_row - lam ** (1 - 2 * z_value) * r_row
            np.testing.assert_allclose(a_direct, a_reduced, rtol=2e-13, atol=2e-13)
            np.testing.assert_allclose(b_direct, r_row, rtol=2e-13, atol=2e-13)
            direct_cross = symmetrized_cross(a_direct, b_direct)
            reduced_cross = (
                symmetrized_cross(c_row, r_row)
                - symmetrized_cross(l_row, r_row)
                - 2 * lam ** (1 - 2 * z_value) * (r_row.conj().T @ r_row)
            )
            np.testing.assert_allclose(
                direct_cross, reduced_cross, rtol=3e-13, atol=3e-13
            )

    def test_individual_fourier_harmonics_are_dilation_resolvents(self) -> None:
        mp.mp.dps = 40
        x_value = mp.mpf("1.3")
        z_value = 5
        harmonic = 2
        phase = 2j * mp.pi * harmonic
        minus = ell_minus(x_value, z_value, harmonic)
        minus_parts = (
            mp.e ** (phase * x_value) / phase
            - (z_value - 1)
            * x_value ** (1 - z_value)
            / phase
            * mp.quad(
                lambda t: mp.e ** (phase * t) * t ** (z_value - 2),
                [0, x_value],
            )
        )
        plus = ell_plus(x_value, z_value, harmonic)
        plus_parts = (
            -mp.e ** (phase * x_value) / phase
            + z_value
            * x_value**z_value
            / phase
            * mp.quadosc(
                lambda t: mp.e ** (phase * t) * t ** (-z_value - 1),
                [x_value, mp.inf],
                omega=2 * mp.pi * harmonic,
            )
        )
        self.assertLess(abs(minus - minus_parts), mp.mpf("1e-38"))
        self.assertLess(abs(plus - plus_parts), mp.mpf("1e-38"))

        derivative_minus = mp.diff(
            lambda x: ell_minus(x, z_value, harmonic), x_value
        )
        derivative_plus = mp.diff(
            lambda x: ell_plus(x, z_value, harmonic), x_value
        )
        forcing = x_value * mp.e ** (phase * x_value)
        self.assertLess(
            abs(x_value * derivative_minus + (z_value - 1) * minus - forcing),
            mp.mpf("1e-35"),
        )
        self.assertLess(
            abs(-x_value * derivative_plus + z_value * plus - forcing),
            mp.mpf("1e-34"),
        )

    def test_zero_null_poisson_pairing_for_direct_slots(self) -> None:
        mp.mp.dps = 50
        lam = mp.mpf("2.5")
        spacing = mp.mpf("0.73")
        q_value = 3 * lam**2 / 13
        coefficients: dict[int, mp.mpf] = {}
        for j_value in range(5):
            coefficient = mp.mpf((-1) ** j_value * math.comb(4, j_value)) / (
                lam ** (2 * j_value)
            )
            coefficients[4 + 2 * j_value] = (
                coefficients.get(4 + 2 * j_value, mp.mpf("0")) + coefficient
            )
            coefficients[2 + 2 * j_value] = (
                coefficients.get(2 + 2 * j_value, mp.mpf("0"))
                - q_value * coefficient
            )

        def source(u_value: mp.mpf) -> mp.mpf:
            if abs(u_value) > lam:
                return mp.mpf("0")
            return mp.fsum(
                coefficient * u_value**degree
                for degree, coefficient in coefficients.items()
            )

        def monomial_transform(degree: int, frequency: mp.mpf) -> mp.mpc:
            angular = 2 * mp.pi * frequency
            if angular == 0:
                return 2 * lam ** (degree + 1) / (degree + 1)
            value = 2 * mp.sin(angular * lam) / angular
            for current in range(1, degree + 1):
                boundary = (
                    lam**current * mp.e ** (-1j * angular * lam)
                    - (-lam) ** current * mp.e ** (1j * angular * lam)
                ) / (-1j * angular)
                value = boundary + current * value / (1j * angular)
            return value

        def transform(frequency: mp.mpf) -> mp.mpc:
            return mp.fsum(
                coefficient * monomial_transform(degree, frequency)
                for degree, coefficient in coefficients.items()
            )

        self.assertEqual(source(mp.mpf("0")), 0)
        self.assertLess(abs(transform(mp.mpf("0"))), mp.mpf("1e-45"))
        compact_sum = mp.fsum(
            source(spacing * index)
            for index in range(1, int(mp.floor(lam / spacing)) + 1)
        )
        fourier_sum = mp.fsum(
            transform(mp.mpf(index) / spacing) for index in range(1, 101)
        ) / spacing
        self.assertLess(abs(compact_sum - fourier_sum), mp.mpf("5e-12"))

    def test_exact_middle_band_alias_decomposition(self) -> None:
        rng = np.random.default_rng(814205)
        full = np.zeros((4, 4), dtype=np.complex128)
        local = np.zeros_like(full)
        alias = np.zeros_like(full)
        for _z_value in (3, 5, 7, 9):
            a_one = rng.normal(size=(2, 4)) + 1j * rng.normal(size=(2, 4))
            b_one = rng.normal(size=(2, 4)) + 1j * rng.normal(size=(2, 4))
            a_plus = rng.normal(size=(2, 4)) + 1j * rng.normal(size=(2, 4))
            b_plus = rng.normal(size=(2, 4)) + 1j * rng.normal(size=(2, 4))
            full += symmetrized_cross(a_one + a_plus, b_one + b_plus)
            local += symmetrized_cross(a_one, b_one)
            alias += (
                symmetrized_cross(a_one, b_plus)
                + symmetrized_cross(a_plus, b_one)
                + symmetrized_cross(a_plus, b_plus)
            )
        np.testing.assert_allclose(full, local + alias, rtol=2e-14, atol=2e-14)
        np.testing.assert_allclose(alias, alias.conj().T, rtol=0, atol=2e-14)

    def test_tau_scale_separates_cancellation_and_persistence_gates(self) -> None:
        tau = 8.0
        local = np.diag([-1.4 * tau, -tau])
        cancellation_alias = -local - 0.01 * tau * np.eye(2)
        cancelled_full = local + cancellation_alias
        self.assertGreaterEqual(np.linalg.eigvalsh(cancelled_full)[0], -0.011 * tau)

        small_alias = np.array([[1e-5, 2e-5], [2e-5, -1e-5]]) * tau
        self.assertLess(np.linalg.norm(small_alias, 2), 4e-5 * tau)
        persistent_full = local + small_alias
        self.assertLess(np.linalg.eigvalsh(persistent_full)[-1], -0.999 * tau)

    def test_abstract_alias_twins_have_equal_norms_and_opposite_outcomes(self) -> None:
        tau = 6.0
        a_value = math.sqrt(tau / 2)
        local = 2 * a_value * (-a_value)
        self.assertAlmostEqual(local, -tau)
        twin_rows = ((-a_value, a_value), (a_value, -a_value))
        outcomes = []
        for a_plus, b_plus in twin_rows:
            outcomes.append(
                2 * (a_value + a_plus) * (-a_value + b_plus)
            )
        self.assertEqual(abs(twin_rows[0][0]), abs(twin_rows[1][0]))
        self.assertEqual(abs(twin_rows[0][1]), abs(twin_rows[1][1]))
        self.assertAlmostEqual(outcomes[0], 0.0)
        self.assertAlmostEqual(outcomes[1], -4 * tau)

    def test_ordered_limit_and_representative_firewalls_are_explicit(self) -> None:
        for token in (
            "After, and only after, the ordered unweighted Poisson limit",
            "Apply (5.2) only after taking `M to infinity` at fixed `lambda`",
            "is not asserted before the ordered",
            "limit, and no odd-row sum",
            "deterministic outer alias `S_h`",
            "different representative with a different",
            "excludes `m=1`, `l=1`, and the curved/hard completion",
        ):
            self.assertIn(token, self.text)

    def test_required_exact_formulas_and_gate_are_present(self) -> None:
        for token in (
            "R_z(X)&=B_1(X)-zX^z\\int_X^\\infty",
            "L_z(X)&=B_1(X)-(z-1)X^{1-z}\\int_0^X",
            "-X^{-z}R_z(X)",
            "-X^{z-1}L_z(X)",
            "\\mathcal B_z=\\mathcal R_z",
            "\\mathcal A_z=C_z-\\mathcal L_z-\\lambda^{1-2z}\\mathcal R_z",
            "\\operatorname {Abel}\\sum_{r\\ne0}\\ell^-_{z,r}",
            "(-X\\partial_X+z)\\ell^+_{z,r}(X)",
            "\\mathcal A_z^1&=\\mathcal A_z^{f,1}+\\mathcal A_z^{H,1}",
            "\\widehat R_{\\rm alias}^{I_L}",
            "\\tau_L={c^{hC+o(1)}\\over L^{2m}}",
            "\\widehat{\\mathcal A}_z^{1,{\\rm high}}",
            "\\widehat{\\mathcal A}_z^{+,{\\rm high}}",
            "\\widehat{\\mathcal B}_z^{1,{\\rm low}}",
            "strict-PASS standalone one-sided",
            "h*C+(5h+3epsilon/2)A_1<1",
            "B_L=(log L)^4",
            "\\leq {C L^{K_1}e^{h\\alpha_i}\\over\\sqrt{cJ_{\\alpha_i}}}",
            "\\leq {L^{K_2}e^{h\\alpha_{\\max}}\\over\\sqrt c}",
            "explicitly makes no claim for that reverse block",
            "abstract finite-dimensional countermodel only",
        ):
            self.assertIn(token, self.text)

    def test_fail_closed_scope_does_not_overclaim_a_sign(self) -> None:
        for token in (
            "completed alias sign therefore remains open",
            "neither cancellation nor reinforcement",
            "finite-dimensional physical packet question",
            "not itself a global",
            "Pick statement or an RH-equivalent assertion",
            "not a physical counterpacket",
            "Only the last is proved here",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, self.text)

    def test_displays_compile_as_tex(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.DOTALL)
        self.assertGreaterEqual(len(displays), 38)
        source = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as tmp:
            tex = Path(tmp) / "displays.tex"
            tex.write_text(source, encoding="utf-8")
            result = subprocess.run(
                [
                    pdflatex,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    tex.name,
                ],
                cwd=tmp,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stdout[-4000:])

    def test_display_balance_unique_tags_ascii_and_no_stale_hash(self) -> None:
        starts = re.findall(r"(?m)^\s*\\\[\s*$", self.text)
        ends = re.findall(r"(?m)^\s*\\\]\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(b in (9, 10, 13) or 32 <= b <= 126 for b in data))
        self.assertNotIn("TO_BE_FROZEN", self.text)


if __name__ == "__main__":
    unittest.main()
