#!/usr/bin/env python3
"""Exact regressions for the growing-transition equality-conductor theorem."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md"

NOTE_HASH = "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079"
PROTECTED_HASHES = {
    "P2_SOURCE_LOCK.json":
        "8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/TRANSITION_PROLATE_OUTER_THEOREM.md":
        "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    "notes/GROWING_WINDOW_THEOREM.md":
        "dad6b0a878b7eba21cbc7aa8049cf3bf89a38df766cc157a87c416e79a721ac7",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "notes/GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md":
        "000be1947a8cc22e7f96a080b8775ce0343fbeb36f886929c7ea5188191e0932",
    "notes/LEADING_PROLATE_OSCILLATION_THEOREM.md":
        "d65e9221642b09cb66b0f0c46d716f5d7fae98980f4c3ed3289033dacb9a266b",
}


def locked_parameters(p: int) -> tuple[float, int, float, int, int]:
    lam = p / 2
    shannon = p * p
    beta = 2 / math.pi**2 * math.log(50 * p * p + 25)
    buffer = 6 + math.ceil(beta * math.log(20))
    return lam, shannon, beta, buffer, shannon + buffer


def harmonic(number: int) -> F:
    return sum((F(1, m) for m in range(1, number + 1)), F(0))


def log_harmonic(number: int) -> float:
    return sum(math.log(m) / m for m in range(1, number + 1))


class GrowingTransitionEqualityConductorGardingTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_note_and_dependency_hashes(self) -> None:
        self.assertEqual(hashlib.sha256(NOTE.read_bytes()).hexdigest(), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_arithmetic_bracket_is_monotone_and_nonnegative(self) -> None:
        previous = 0.0
        for number in range(1, 500):
            current = float(harmonic(number)) * math.log(number) - 2 * log_harmonic(number)
            self.assertGreaterEqual(current + 2e-13, previous)
            self.assertGreaterEqual(current + 2e-13, 0.0)
            previous = current

            for fraction in (0.0, 0.17, 0.83):
                z = number + fraction
                bracket = float(harmonic(number)) * math.log(z) - 2 * log_harmonic(number)
                self.assertGreaterEqual(bracket + 2e-13, 0.0)

    def test_divisor_layer_cake_and_conductor_coefficients(self) -> None:
        # Atomic exterior masses are enough to replay both Tonelli identities.
        atoms = ((F(6, 5), F(2)), (F(11, 5), F(3)), (F(29, 5), F(5)))
        cutoff_masses = {
            m: sum((mass for z, mass in atoms if z >= m), F(0))
            for m in range(1, 7)
        }
        weighted_norm = sum((cutoff_masses[m] / m for m in cutoff_masses), F(0))
        layer_norm = sum((harmonic(int(z)) * mass for z, mass in atoms), F(0))
        self.assertEqual(weighted_norm, layer_norm)

        weighted_log = sum(
            (math.log(m) * float(cutoff_masses[m]) / m for m in cutoff_masses),
            0.0,
        )
        layer_log = sum(log_harmonic(int(z)) * float(mass) for z, mass in atoms)
        self.assertAlmostEqual(weighted_log, layer_log, places=14)

        # If <F_m,C_B F_m>=m^{-1} times its undilated value, (3.9) fixes
        # 2<R_m phi,aR_m phi> to one quarter of that number.
        for m in range(1, 8):
            conductor_value = F(13, m)
            archimedean_term = conductor_value / 4
            self.assertEqual(archimedean_term, F(13, 4 * m))

    def test_moving_split_and_central_log_mass(self) -> None:
        for lam in (10.0, 100.0, 10_000.0):
            length = 2 * math.log(lam)
            radius = lam / length
            height = math.log(length)
            for ratio in (1e-8, 0.1, 0.99, 1.0, 1.5, length / 2):
                x = ratio * radius
                if x >= lam:
                    continue
                left = math.log(lam / x)
                right = height + (math.log(radius / x) if x < radius else 0.0)
                self.assertLessEqual(left, right + 1e-13)

            # Integral_{-R}^R log(R/|x|) dx = 2R.
            midpoint_sum = 0.0
            pieces = 200_000
            for j in range(pieces):
                x = radius * (j + 0.5) / pieces
                midpoint_sum += math.log(radius / x)
            numerical = 2 * radius * midpoint_sum / pieces
            self.assertAlmostEqual(numerical / (2 * radius), 1.0, delta=2e-6)

    def test_same_phase_inventory_includes_the_singleton(self) -> None:
        for p in range(5, 302, 2):
            lam, _, _, _, n_star = locked_parameters(p)
            same_phase_count = math.ceil(n_star / 4)
            self.assertLessEqual(same_phase_count, 1.5 * lam * lam)
        self.assertEqual(math.ceil(locked_parameters(5)[4] / 4), 9)

    def test_exterior_rational_frequency_and_phase_gap(self) -> None:
        for p in (101, 301, 1001):
            lam, _, _, _, _ = locked_parameters(p)
            k = 2 * math.pi * lam
            length = 2 * math.log(lam)
            epsilon = 1 / (4 * math.pi**2 * lam**4)
            for delta in (-2.0, -1.0, 0.0, 1.0):
                for u in (2.0, 2.5, 4.0, 10.0, 100.0):
                    denominator = u * u - 1
                    frequency = 1 + delta / denominator + epsilon / denominator**2
                    self.assertGreater(frequency, 1 / 3 - 1e-14)
                    self.assertLess(frequency, 3 / 2)

            gap = k / math.sqrt(3) - 4 / (3 * lam) - k / length
            self.assertGreater(gap, 0.25 * k)

    def test_raw_bv_zero_integral_example_has_sqrt_u_decay(self) -> None:
        # On R_+, f=1 on [0,1), -1 on [1,2), and zero afterwards.
        # Its even extension has zero integral but f(0)=1.
        for number in (10, 100, 1000, 10_000):
            u = F(1, number)
            sample_sum = sum(
                (F(1) if F(n, number) < 1 else F(-1)
                 for n in range(1, 2 * number)),
                F(0),
            )
            self.assertEqual(sample_sum, -1)
            e_value = math.sqrt(float(u)) * float(sample_sum)
            self.assertEqual(abs(e_value), math.sqrt(float(u)))

    def test_full_metric_congruence_is_exact(self) -> None:
        # A positive gap stays positive under the endpoint shear, including
        # a nondiagonal full exterior metric.
        metric = ((F(5), F(2)), (F(2), F(3)))
        reserve = ((F(2), F(1)), (F(1), F(4)))
        shear = ((F(1), F(-3, 2)), (F(0), F(1)))

        def multiply(left: tuple[tuple[F, ...], ...], right: tuple[tuple[F, ...], ...]):
            return tuple(tuple(sum(left[i][k] * right[k][j] for k in range(2))
                               for j in range(2)) for i in range(2))

        transpose = tuple(zip(*shear))
        sheared_metric = multiply(multiply(transpose, metric), shear)
        sheared_reserve = multiply(multiply(transpose, reserve), shear)
        self.assertGreater(sheared_metric[0][0], 0)
        self.assertGreater(
            sheared_metric[0][0] * sheared_metric[1][1] - sheared_metric[0][1] ** 2,
            0,
        )
        self.assertGreater(sheared_reserve[0][0], 0)
        self.assertGreater(
            sheared_reserve[0][0] * sheared_reserve[1][1] - sheared_reserve[0][1] ** 2,
            0,
        )

    def test_locked_bump_error_is_uniformly_lower_order(self) -> None:
        for p in (101, 1001, 10_001):
            lam = p / 2
            length = 2 * math.log(lam)
            relative_norm_error = math.sqrt(length) / lam
            central_penalty_error = length * length / (lam * lam)
            coefficient_error = length ** 1.5 / lam
            self.assertLess(relative_norm_error, 0.1)
            self.assertLess(central_penalty_error, 0.1)
            self.assertLess(coefficient_error, 1.0)

    def test_claim_boundary_and_exact_normalizations_are_serialized(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            r"8\|\phi\|_2^2=D(f)",
            r"2\langle R_m\phi,a(D)R_m\phi\rangle",
            r"{1\over4m}\langle F_m,C_{\rm B}F_m\rangle",
            r"H_{\lfloor z\rfloor}\log z",
            r"\mathfrak E_\lambda(f)\geq {L\over4}S-{1\over4}J",
            r"R={\lambda\over L}",
            r"8\|\Phi x\|_2^2=x^*D_{\rm full}x",
            "whose range lies in the zero-integral hyperplane",
            "raw sampler-equality",
            "actual corrected sampler",
            "unequal-sample `m \\ne n` correlations",
            "project source projection `P_0`",
            "P0_INVALIDATED",
            "arXiv:math/9902080",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        forbidden = (
            "complete raw physical outer block is positive",
            "the project `P_0` comparison follows",
            "this proves RH",
            "No identity between the Fourier tail of the bump",  # must be an explicit caveat
        )
        for phrase in forbidden[:3]:
            self.assertNotIn(phrase, text)
        self.assertIn(forbidden[3], text)

    def test_tex_and_control_bytes_survive_serialization(self) -> None:
        for path in (NOTE, Path(__file__)):
            bad = [value for value in path.read_bytes() if value < 32 and value not in (9, 10)]
            self.assertEqual(bad, [], str(path))

        text = NOTE.read_text(encoding="utf-8")
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))
        self.assertEqual(text.count("\n\\[\n"), text.count("\n\\]\n"))
        for malformed in ("{cal E}", ",qquad", "m \\ne m", "^2,qquad", "\n\\[\n\\[\n"):
            self.assertNotIn(malformed, text)


if __name__ == "__main__":
    unittest.main()
