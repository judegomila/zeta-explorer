from __future__ import annotations

import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "POSITIVE_CONE_SHIFTED_ODD_RESERVE_TRANSFER.md"


def s4(n: int) -> int:
    return sum(k**4 for k in range(1, n + 1))


def chord_from_tangent(t: float) -> float:
    return math.sqrt(2.0 - 2.0 / math.sqrt(1.0 + t * t))


def transferred_depth(m: float, theta_bar: float) -> float:
    if not 0.0 <= theta_bar < math.asin(m):
        raise ValueError("the strict response-cone cap is required")
    return math.sin(math.asin(m) - theta_bar)


def coefficient_majorant(
    n: int,
    gamma: float,
    h2_anchor: float,
    anchor_chord: float,
    h2_trial: float,
    trial_chord: float,
) -> float:
    root_s4 = math.sqrt(s4(n))
    candidates = (
        math.sqrt(1.0 - gamma * gamma) * root_s4,
        h2_anchor + root_s4 * anchor_chord,
        h2_trial + root_s4 * trial_chord,
    )
    return (
        math.sqrt(2.0)
        * min(candidates)
        / (gamma * math.sqrt(2 * n + 1))
    )


class PositiveConeShiftedOddReserveTransferTests(unittest.TestCase):
    def test_same_anchor_endpoint_bottleneck_is_sharp(self):
        n = 6
        m = 1.0 / math.sqrt(2 * n + 1)
        cap = math.asin(m)
        theta = 0.37 * cap

        # z=e_0 and the unit tangent opposite the nonconstant part of the
        # endpoint normal trace the shortest geodesic to d^perp.
        z = [1.0] + [0.0] * n
        tangent = [0.0] + [-1.0 / math.sqrt(n)] * n
        kappa = [
            math.cos(theta) * zj + math.sin(theta) * uj
            for zj, uj in zip(z, tangent)
        ]
        d_hat = [1.0 / math.sqrt(2 * n + 1)] + [
            math.sqrt(2.0 / (2 * n + 1))
        ] * n
        t_kappa = abs(sum(a * b for a, b in zip(d_hat, kappa)))

        self.assertAlmostEqual(cap - theta, math.asin(t_kappa), places=14)
        threshold = t_kappa / math.sqrt(1.0 - t_kappa * t_kappa)
        self.assertAlmostEqual(threshold, math.tan(cap - theta), places=14)

        t_pass = 0.99 * threshold
        t_fail = 1.01 * threshold
        self.assertLess(theta + math.atan(t_pass), cap)
        self.assertGreater(theta + math.atan(t_fail), cap)

    def test_zero_endpoint_anchor_cannot_pass_same_anchor_gate(self):
        n = 3
        d_hat = [1.0 / math.sqrt(2 * n + 1)] + [
            math.sqrt(2.0 / (2 * n + 1))
        ] * n
        # An explicit unit vector in the endpoint hyperplane.
        raw = [math.sqrt(2.0), -1.0] + [0.0] * (n - 1)
        norm = math.sqrt(sum(value * value for value in raw))
        kappa = [value / norm for value in raw]
        self.assertAlmostEqual(sum(a * b for a, b in zip(d_hat, kappa)), 0.0, places=14)

        z = [1.0] + [0.0] * n
        m = 1.0 / math.sqrt(2 * n + 1)
        theta = math.acos(sum(a * b for a, b in zip(z, kappa)))
        self.assertGreaterEqual(theta, math.asin(m) - 1.0e-14)
        self.assertFalse(theta + math.atan(0.0) < math.asin(m))

    def test_transferred_depth_is_sharp_at_endpoint_hyperplane(self):
        n = 5
        m = 1.0 / math.sqrt(2 * n + 1)  # z=e_0
        theta = 0.4 * math.asin(m)
        gamma = transferred_depth(m, theta)

        # Move from e_0 in the worst endpoint direction.  At alpha=infinity
        # the spherical Cauchy--Schwarz estimate is an equality.
        x0 = math.cos(theta)
        xn = -math.sin(theta) / math.sqrt(n)
        endpoint = (x0 + math.sqrt(2.0) * n * xn) / math.sqrt(2 * n + 1)
        self.assertAlmostEqual(endpoint, gamma, places=14)

        # The finite response ratios remain above the endpoint value.
        for alpha_sq in (0.0, 0.01, 0.2, 1.0, 10.0, 1.0e6):
            weights = [
                math.sqrt(2.0) * alpha_sq / (k * k + alpha_sq)
                for k in range(1, n + 1)
            ]
            response = x0 + xn * sum(weights)
            norm = math.sqrt(1.0 + sum(value * value for value in weights))
            self.assertGreaterEqual(response / norm, gamma - 1.0e-13)

    def test_coefficient_majorants_bound_actual_boundary_normalized_moment(self):
        n = 4
        # Use a normalized vector with positive endpoint responses.  A dense
        # alpha grid supplies only a test fixture; the theorem itself uses
        # the exact cap argument, not this grid.
        x = [0.91, -0.12, 0.19, -0.08, 0.31]
        norm = math.sqrt(sum(value * value for value in x))
        x = [value / norm for value in x]

        ratios = []
        for j in range(20001):
            w = j / 20000.0
            # alpha^2/(n^2+alpha^2) expressed through
            # w=alpha^2/(1+alpha^2).
            alpha_sq = math.inf if w == 1.0 else w / (1.0 - w)
            if math.isinf(alpha_sq):
                b = [1.0] + [math.sqrt(2.0)] * n
            else:
                b = [1.0] + [
                    math.sqrt(2.0) * alpha_sq / (k * k + alpha_sq)
                    for k in range(1, n + 1)
                ]
            ratios.append(
                sum(a * b0 for a, b0 in zip(x, b))
                / math.sqrt(sum(value * value for value in b))
            )
        gamma = min(ratios)
        self.assertGreater(gamma, 0.0)

        c = x[0] + math.sqrt(2.0) * sum(x[1:])
        actual_m2 = (
            math.sqrt(2.0)
            * sum(k * k * abs(x[k]) for k in range(1, n + 1))
            / c
        )
        universal = (
            math.sqrt(2.0 * (1.0 - gamma * gamma) * s4(n))
            / (gamma * math.sqrt(2 * n + 1))
        )
        self.assertLessEqual(actual_m2, universal + 1.0e-12)

        # Taking the reference vector to be x and a zero chord reproduces
        # the exact coefficient expression in this fixture.
        h2_x = sum(k * k * abs(x[k]) for k in range(1, n + 1))
        reference = (
            math.sqrt(2.0) * h2_x
            / (gamma * math.sqrt(2 * n + 1))
        )
        self.assertLessEqual(actual_m2, reference + 1.0e-12)
        combined = coefficient_majorant(
            n,
            gamma,
            h2_x,
            chord_from_tangent(0.0),
            h2_x,
            0.0,
        )
        self.assertLessEqual(actual_m2, combined + 1.0e-12)

    def test_n1_exact_cauchy_family_and_finite_shift_gate(self):
        g = 1.0
        phi = 0.2
        sine = math.sin(phi)
        cosine = math.cos(phi)
        t = g * sine * cosine / math.sqrt(2.0)
        a0 = g * sine * sine
        a1 = g * cosine * cosine - t

        q_plus = (
            (a0, math.sqrt(2.0) * t),
            (math.sqrt(2.0) * t, a1 + t),
        )
        x = (cosine, -sine)
        high = (sine, cosine)

        for row in q_plus:
            self.assertAlmostEqual(row[0] * x[0] + row[1] * x[1], 0.0, places=14)
        high_value = sum(
            high[i] * q_plus[i][j] * high[j]
            for i in range(2)
            for j in range(2)
        )
        self.assertAlmostEqual(high_value, g, places=14)

        c = cosine - math.sqrt(2.0) * sine
        gamma = c / math.sqrt(3.0)
        odd_floor = a1 - t
        self.assertAlmostEqual(odd_floor, g * cosine * c, places=14)
        self.assertGreater(gamma, 0.0)
        self.assertGreater(odd_floor, 0.0)

        # Use kappa=z=x.  Then T=0 and the reference-vector coefficient
        # bound is exact.  A deliberately loose certified upper value U is
        # admitted if its even Schur surplus passes the quantitative gate.
        actual_m2 = math.sqrt(2.0) * sine / c
        radius = 1.0 + actual_m2
        pencil_radius = cosine / c
        k_floor = g * cosine * cosine
        self.assertAlmostEqual(radius, pencil_radius, places=14)
        self.assertAlmostEqual(k_floor / pencil_radius, odd_floor, places=14)
        U = 0.02
        g_plus = g - U
        chi_u = U
        certified_reserve = g_plus * gamma * gamma / radius
        self.assertLess(chi_u, certified_reserve)
        self.assertGreater(odd_floor - U, 0.0)

    def test_qualitative_cone_membership_has_no_uniform_shift_reserve(self):
        g = 3.0
        cap = math.atan(1.0 / math.sqrt(2.0))
        previous_depth = None
        for distance in (0.2, 0.05, 0.01, 0.002):
            phi = cap - distance
            cosine = math.cos(phi)
            sine = math.sin(phi)
            depth = (cosine - math.sqrt(2.0) * sine) / math.sqrt(3.0)
            odd_floor = g * cosine * (cosine - math.sqrt(2.0) * sine)
            self.assertGreater(depth, 0.0)
            self.assertGreater(odd_floor, 0.0)
            if previous_depth is not None:
                self.assertLess(depth, previous_depth)
            previous_depth = depth
        self.assertLess(previous_depth, 0.003)

    def test_invalid_or_saturated_cap_is_rejected(self):
        n = 3
        m = 1.0 / math.sqrt(2 * n + 1)
        with self.assertRaises(ValueError):
            transferred_depth(m, math.asin(m))
        with self.assertRaises(ValueError):
            transferred_depth(m, math.asin(m) + 1.0e-6)

    def test_universal_radius_and_cubic_gate_constants(self):
        for n in range(1, 101):
            for gamma in (1.0e-4, 0.01, 0.2, 0.7, 1.0):
                mbar = (
                    math.sqrt(2.0 * (1.0 - gamma * gamma) * s4(n))
                    / (gamma * math.sqrt(2 * n + 1))
                )
                radius = n * n + mbar
                self.assertLessEqual(mbar, n * n / gamma + 1.0e-10)
                self.assertLessEqual(radius, 2.0 * n * n / gamma + 1.0e-10)

                # If the simple cubic gate is strict, it implies the
                # sharper R_N gate by the preceding radius inequality.
                g_plus = 0.8
                chi = 0.49 * g_plus * gamma**3 / (n * n)
                self.assertLess(chi, g_plus * gamma * gamma / radius)

    def test_note_records_source_scope_and_remaining_equation_52_rate(self):
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "positive-cone shifted odd reserve",
            "m_{\\mathcal C}(x)\\geq\\gamma",
            "same-anchor endpoint bottleneck",
            "T<{t_\\kappa\\over\\sqrt{1-t_\\kappa^2}}",
            "(P_Nk_\\lambda^+)(L/2)",
            "R_N(\\gamma)",
            "\\chi_U<{g_+\\gamma^2\\over R_N(\\gamma)}",
            "2N^2\\chi_U<g_+\\gamma^3",
            "No odd floor is assumed",
            "source equation (3.19)",
            "inclusive endpoint `n<=lambda^2`",
            "equation (5.2)",
            "source-specific quantitative ground-cone theorem",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)


if __name__ == "__main__":
    unittest.main()
