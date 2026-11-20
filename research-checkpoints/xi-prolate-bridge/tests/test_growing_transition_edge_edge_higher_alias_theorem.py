#!/usr/bin/env python3
"""Focused regressions for the deterministic edge--edge higher aliases."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_EDGE_EDGE_HIGHER_ALIAS_THEOREM.md"

NOTE_HASH = "3bd3bf977178be94e91b7c6603db9df7f861f1cfe498bef303c210e9b87b9ec5"
PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md":
        "16db62873056fb419bc740154c67a8f27ce6ecea2b85201abab7b89aa20d56d0",
    "notes/TRANSITION_PROLATE_OUTER_THEOREM.md":
        "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    "P2_SOURCE_LOCK.json":
        "8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a",
}


def simpson(function, left: float, right: float, steps: int = 200_000) -> float:
    if steps % 2:
        steps += 1
    spacing = (right - left) / steps
    total = function(left) + function(right)
    total += 4.0 * sum(function(left + spacing * j) for j in range(1, steps, 2))
    total += 2.0 * sum(function(left + spacing * j) for j in range(2, steps, 2))
    return spacing * total / 3.0


def action_deficit(c_value: float, alpha: float) -> float:
    epsilon = alpha / c_value

    def integrand(x: float) -> float:
        numerator = max(0.0, 1.0 - x * x)
        denominator = 1.0 - (1.0 - epsilon) * x * x
        return math.sqrt(numerator / denominator)

    action = c_value * (1.0 - epsilon) * simpson(integrand, 0.0, 1.0)
    return c_value - action


def action_excess(c_value: float, alpha_size: float) -> float:
    epsilon = alpha_size / c_value

    def integrand(x: float) -> float:
        return math.sqrt(1.0 + epsilon / (1.0 - x * x)) - 1.0

    # Avoid evaluating the integrable square-root singularity at x=1 by
    # substituting x=1-y^2 on the final interval.
    split = math.sqrt(max(0.0, 1.0 - epsilon))
    bulk = simpson(integrand, 0.0, split)

    upper = math.sqrt(1.0 - split)

    def endpoint(y: float) -> float:
        if y == 0.0:
            return math.sqrt(2.0 * epsilon)
        denominator = y * y * (2.0 - y * y)
        return 2.0 * y * (math.sqrt(1.0 + epsilon / denominator) - 1.0)

    edge = simpson(endpoint, 0.0, upper)
    return c_value * (bulk + edge)


class GrowingTransitionEdgeEdgeHigherAliasTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_note_and_dependency_hashes(self) -> None:
        self.assertEqual(hashlib.sha256(NOTE.read_bytes()).hexdigest(), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_exact_paired_dilation_cancels_to_one_quarter(self) -> None:
        for c_value in (17.0, 101.0):
            gamma = 1.0 / (4.0 * math.sqrt(2.0 * math.pi * c_value))
            for h in (2.0, 3.0, 11.0):
                fourier_kernel = 1.0 / math.sqrt(2.0 * math.pi * c_value)
                alias_kernel = (1.0 / (4.0 * math.sqrt(h))) * math.sqrt(h) * fourier_kernel
                self.assertAlmostEqual(alias_kernel, gamma, places=15)

                matrix_prefactor = (1.0 / (4.0 * math.sqrt(h))) * math.sqrt(h)
                self.assertAlmostEqual(matrix_prefactor, 0.25, places=15)
                self.assertAlmostEqual(matrix_prefactor / 2.0, 0.125, places=15)

                # In F_+^* D_h^*, the adjoint contributes h^(-1/2), its
                # support begins at hc, and w=hz contributes the Jacobian h.
                adjoint_after_substitution = (h ** -0.5) * h
                self.assertAlmostEqual(adjoint_after_substitution, math.sqrt(h), places=15)

    def test_affine_sampler_and_far_half_density(self) -> None:
        c_value = 137.0
        for h in (2.0, 3.0, 17.0):
            for u in (0.0, 0.25, 9.0):
                tau = h * u + c_value * (h - 1.0)
                self.assertAlmostEqual(c_value + tau, h * (c_value + u), places=13)
                left = 2.0 * tau + tau * tau / c_value
                s = u / c_value
                right = c_value * (h * h * (1.0 + s) ** 2 - 1.0)
                self.assertAlmostEqual(left, right, delta=1e-11 * max(1.0, right))

    def test_endpoint_normalization_constant(self) -> None:
        # (2 lambda/c)*(2592*pi^2*lambda), c=2*pi*lambda^2.
        for lam in (2.5, 11.5, 103.5):
            c_value = 2.0 * math.pi * lam * lam
            endpoint_square = (2.0 * lam / c_value) * (2592.0 * math.pi**2 * lam)
            self.assertAlmostEqual(endpoint_square, 2592.0 * math.pi, places=11)

    def test_far_action_and_lg_remainder_scale(self) -> None:
        c_value = 1_000_000.0
        band = 23.0
        global_variation_proxy = (1.0 + band) / (3.0 * c_value)
        global_variation_proxy += 1.0 / (18.0 * c_value**2)
        self.assertLess(global_variation_proxy, 1e-4)

        for h in range(3, 100):
            ell = math.log((h + 1.0) / (h - 1.0))
            integral = ell / (2.0 * h)
            self.assertLessEqual(integral, 1.0 / (h * (h - 1.0)))
            self.assertLessEqual(integral, 1.6 / (h * h))

            far_base = c_value * (h * h - 1.0)
            far_variation_proxy = (1.0 + band) / far_base
            far_variation_proxy += 1.0 / (2.0 * far_base**2)
            self.assertLess(far_variation_proxy, global_variation_proxy)

            # The Wiener low-frequency split keeps every shifted carrier
            # outside the singular |N|=1 cone.
            minimum_shifted_frequency = h - h / 4.0
            self.assertGreaterEqual(minimum_shifted_frequency, 2.0)

    def test_h_two_and_higher_column_series_are_summable(self) -> None:
        h_two = 1.0 / (4.0 * math.sqrt(2.0))
        higher = sum(1.0 / (h * h) for h in range(3, 1_000_000))
        tail = 1.0 / 999_999.0
        self.assertLess(h_two + higher + tail, 0.58)

        correction = sum(1.0 / h**3 for h in range(3, 100_000))
        correction += 1.0 / (2.0 * 99_999.0**2)
        self.assertLess(correction, 0.078)

    def test_action_deficit_has_alpha_log_c_over_alpha_scale(self) -> None:
        c_value = 1_000_000.0
        for alpha in (2.0, 10.0, 100.0, 1_000.0):
            deficit = action_deficit(c_value, alpha)
            excess = action_excess(c_value, alpha)
            leading = 0.25 * alpha * math.log(c_value / alpha)
            self.assertGreater(deficit, 0.0)
            self.assertGreater(excess, 0.0)
            self.assertLess(deficit, 3.0 * alpha * (1.0 + math.log(c_value / alpha)))
            self.assertLess(excess, 3.0 * alpha * (1.0 + math.log(c_value / alpha)))
            self.assertLess(abs(deficit - leading), 2.5 * alpha)

    def test_fixed_plus_action_bracket_forces_three_pi_over_two_gap(self) -> None:
        # If A_n is in (pi*n/2, pi*(n+1)/2), then the smallest possible
        # A_{n+4}-A_n is strictly 3*pi/2.
        for n in range(4, 100, 4):
            upper_n = math.pi * (n + 1.0) / 2.0
            lower_next = math.pi * (n + 4.0) / 2.0
            self.assertAlmostEqual(lower_next - upper_n, 1.5 * math.pi, places=12)

    def test_edge_hilbert_schmidt_scale_is_little_o_of_length(self) -> None:
        # Equation (7.3): sqrt(L)*(log L)^14 / L -> 0.  This numerical
        # regression checks a safely asymptotic point; the proof is analytic.
        log_length = 200.0
        length = math.exp(log_length)
        ratio = log_length**14 / math.sqrt(length)
        self.assertLess(ratio, 1e-10)

    def test_finite_fejer_weights_are_uniform_and_symmetric(self) -> None:
        for cutoff in (2, 3, 11, 100):
            weights = {
                h: 1.0 - abs(h) / (cutoff + 1.0)
                for h in range(-cutoff, cutoff + 1)
            }
            self.assertEqual(weights[0], 1.0)
            self.assertTrue(all(0.0 < value <= 1.0 for value in weights.values()))
            for h in range(1, cutoff + 1):
                self.assertEqual(weights[h], weights[-h])

    def test_scope_source_and_arithmetic_boundaries_are_serialized(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "deterministic lattice aliases with `|h|>=2`",
            r"\nu\equiv0\pmod4",
            r"B=(\log L)^4",
            "**unsheared**",
            r"\gamma={1\over4\sqrt{2\pi c}}",
            "Only the symmetric pair `widehat K(h)+widehat K(-h)` is asserted",
            r"\mathcal F_+^*D_h^*=D_h\mathcal F_+^*",
            "This is the factor `1/4` for the symmetric pair",
            "Formula (3.7) is never asserted",
            r"\operatorname {Var}_{[c,\infty)}\log\Omega_\beta",
            r"E(U_0)\leq",
            r"|\bar q_j(0)|^2\leq2592\pi",
            r"\|g_{h,\beta}^{\varepsilon}\|_{H^3(0,\infty)}",
            r"\|P_BS_2 e_\beta\|\leq{1\over4\sqrt2}",
            "arXiv:1405.3676v2",
            "not vendored or source-locked",
            r">{3\pi\over2}",
            r"Q_B:=\dim E_B=O\{L(1+B)\}",
            "finite Fejer means are uniform",
            r"R_D=\int K(X)\,d\{\psi(X)-\lfloor X\rfloor\}",
            "remaining retained supercritical buffer",
            "actual endpoint shear mixes edge columns with the label-`8` bulk row",
            "This is the precise edge--bulk gap",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        forbidden = (
            "the endpoint-sheared edge block is o(L)",
            "the edge--bulk block is o(L)",
            "the raw prime discrepancy is o(L)",
            "the complete reflected operator is o(L)",
            "the complete same-side operator is o(L)",
            "this proves the P_0 floor",
            "this proves RH",
            "arXiv:1405.3676v2` | `",
            r"\langle e_a,\widehat K(h)e_b\rangle",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)

    def test_tex_tags_and_control_bytes_survive_serialization(self) -> None:
        for path in (NOTE, Path(__file__)):
            bad = [value for value in path.read_bytes() if value < 32 and value not in (9, 10)]
            self.assertEqual(bad, [], str(path))

        text = NOTE.read_text(encoding="utf-8")
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))
        self.assertEqual(text.count("\n\\[\n"), text.count("\n\\]\n"))
        for malformed in ("{cal A}", ",qquad", "U_0+chu", "H^1}leq", "\n\\[\n\\[\n"):
            self.assertNotIn(malformed, text)


if __name__ == "__main__":
    unittest.main()
