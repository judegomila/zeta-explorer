import cmath
import hashlib
import itertools
import math
import unittest
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "COUNTABLE_ATTAINED_EDGE_ANTIPODAL_NONFLATNESS_THEOREM.md"

DEPENDENCIES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/FINITE_ATTAINED_EDGE_ANTIPODAL_TURAN_OBSTRUCTION.md":
        "a8a51e9b7d115eed1e48a358fba0dab0556782a09e851d149c952fdd091bc5fc",
    "notes/UNIQUE_ATTAINED_EDGE_FIRST_MINOR_OBSTRUCTION.md":
        "04c55777689638dff3fa7416bd4380cda0efbf02ea94d55431f4ff0c0787a28d",
    "notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md":
        "4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be",
    "notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md":
        "ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171",
}


def edge_data(B, gammas, multiplicities=None):
    if multiplicities is None:
        multiplicities = [1] * len(gammas)
    b = [1 / complex(B, gamma) ** 2 for gamma in gammas]
    return b, multiplicities


def signals(b, multiplicities, phases, stop=None):
    if stop is None:
        stop = len(b)
    P = 2 * sum(
        multiplicities[j] * b[j] * phases[j] for j in range(stop)
    ).real
    V = 2 * sum(
        multiplicities[j] * b[j] ** 2 * phases[j] for j in range(stop)
    ).real
    W = 2 * sum(
        multiplicities[j] * b[j] ** 3 * phases[j] for j in range(stop)
    ).real
    return P, V, W, P * W - V * V


def total_bound(b, multiplicities, power, start=0):
    return 2 * sum(
        multiplicities[j] * abs(b[j]) ** power
        for j in range(start, len(b))
    )


class CountableAttainedEdgeAntipodalNonflatnessTests(unittest.TestCase):
    def test_protected_dependency_bytes_are_unchanged(self):
        for relative, expected in DEPENDENCIES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_package_files_have_clean_bytes_and_final_newlines(self):
        for path in (NOTE, Path(__file__)):
            raw = path.read_bytes()
            self.assertTrue(raw.endswith(b"\n"), path)
            self.assertNotIn(b"\r", raw, path)
            self.assertFalse(
                [(i, value) for i, value in enumerate(raw)
                 if value < 32 and value not in (9, 10)],
                path,
            )
            self.assertTrue(
                all(line == line.rstrip(b" \t") for line in raw.splitlines()),
                path,
            )

    def test_note_serialization_and_fail_closed_scope(self):
        text = NOTE.read_text(encoding="utf-8")
        flattened = " ".join(text.split())
        required = (
            "operatorname {int}_K",
            "jointly rationally independent",
            "E_N=",
            "positive semiorbit",
            "finite-head/tail proof",
            "does **not** prove",
            "no arbitrary countably infinite attained-edge obstruction",
            "P0_INVALIDATED",
            "equation (5.2)",
        )
        for phrase in required:
            self.assertIn(phrase, flattened)
        self.assertNotIn("RH is proved", text)
        self.assertNotIn("arbitrary countably infinite attained edge forces", text)

    def test_uniform_signal_tail_bounds(self):
        b, multiplicities = edge_data(
            1.25,
            [1, 2, 4, 7, 11, 16, 23, 31],
            [1, 2, 1, 3, 1, 2, 1, 1],
        )
        phases = [cmath.exp(1j * theta) for theta in
                  (0.1, 0.7, 1.4, 2.2, 2.9, 3.8, 4.4, 5.6)]
        full = signals(b, multiplicities, phases)
        head = signals(b, multiplicities, phases, stop=3)
        for index, power in enumerate((1, 2, 3)):
            tau = total_bound(b, multiplicities, power, start=3)
            self.assertLessEqual(abs(full[index] - head[index]), tau + 1e-15)

    def test_exact_single_orbit_mean_identity(self):
        examples = (
            (Fraction(0), Fraction(-1, 2), 1),
            (Fraction(-3, 25), Fraction(-4, 25), 2),
            (Fraction(-5, 169), Fraction(-12, 169), 3),
        )
        for x, y, multiplicity in examples:
            norm = x * x + y * y
            real_square = x * x - y * y
            lhs = (
                2 * multiplicity**2 * norm * real_square
                - 2 * multiplicity**2 * norm * norm
            )
            rhs = -4 * multiplicity**2 * norm * y * y
            self.assertEqual(lhs, rhs)
            self.assertLess(rhs, 0)

    def test_haar_product_grid_matches_negative_mean(self):
        b, multiplicities = edge_data(1.0, [1.0, 2.0], [1, 3])
        roots = [cmath.exp(2j * math.pi * k / 8) for k in range(8)]
        values = []
        for phases in itertools.product(roots, repeat=2):
            values.append(signals(b, multiplicities, phases)[3])
        grid_mean = sum(values) / len(values)
        formula = -4 * sum(
            multiplicities[j] ** 2
            * abs(b[j]) ** 2
            * b[j].imag ** 2
            for j in range(2)
        )
        self.assertAlmostEqual(grid_mean, formula, places=13)
        self.assertLess(formula, 0)

    def test_antipode_reverses_linear_signals_and_preserves_covariance(self):
        b, multiplicities = edge_data(0.75, [1.0, 2.5, 6.0], [2, 1, 3])
        phases = [cmath.exp(1j * theta) for theta in (0.2, 1.1, 4.0)]
        antipodal = [-phase for phase in phases]
        original = signals(b, multiplicities, phases)
        flipped = signals(b, multiplicities, antipodal)
        for index in range(3):
            self.assertAlmostEqual(flipped[index], -original[index], places=14)
        self.assertAlmostEqual(flipped[3], original[3], places=14)

    def test_unconstrained_coordinate_prevents_cylinder_flatness(self):
        B = 1.0
        gamma = math.sqrt(11)
        coefficient = 3 / complex(B, gamma) ** 2
        aligned = coefficient.conjugate() / abs(coefficient)
        positive_value = 2 * (coefficient * aligned).real
        negative_value = 2 * (coefficient * -aligned).real
        self.assertAlmostEqual(positive_value, 2 * abs(coefficient), places=14)
        self.assertAlmostEqual(negative_value, -2 * abs(coefficient), places=14)
        self.assertGreater(positive_value - negative_value, 0)

    def test_explicit_truncation_error_bound(self):
        b, multiplicities = edge_data(
            1.0,
            [1, 3, 10, 40, 90, 160],
            [1, 2, 1, 3, 2, 1],
        )
        phases = [cmath.exp(1j * theta) for theta in
                  (0.3, 0.8, 1.7, 2.6, 4.1, 5.4)]
        N = 3
        full = signals(b, multiplicities, phases)
        head = signals(b, multiplicities, phases, stop=N)
        S1 = total_bound(b, multiplicities, 1)
        S2 = total_bound(b, multiplicities, 2)
        S3 = total_bound(b, multiplicities, 3)
        tau1 = total_bound(b, multiplicities, 1, start=N)
        tau2 = total_bound(b, multiplicities, 2, start=N)
        tau3 = total_bound(b, multiplicities, 3, start=N)
        error = tau1 * S3 + S1 * tau3 + 2 * S2 * tau2
        self.assertLessEqual(abs(full[3] - head[3]), error + 1e-15)

    def test_finite_margin_can_dominate_an_infinite_tail_bound(self):
        b, multiplicities = edge_data(1.0, [1.0, 1000.0, 2000.0])
        phases = [1j, 1.0, -1j]
        head = signals(b, multiplicities, phases, stop=1)
        self.assertAlmostEqual(head[0], 1.0, places=14)
        self.assertAlmostEqual(head[3], -0.25, places=14)
        S1 = total_bound(b, multiplicities, 1)
        S2 = total_bound(b, multiplicities, 2)
        S3 = total_bound(b, multiplicities, 3)
        tau1 = total_bound(b, multiplicities, 1, start=1)
        tau2 = total_bound(b, multiplicities, 2, start=1)
        tau3 = total_bound(b, multiplicities, 3, start=1)
        error = tau1 * S3 + S1 * tau3 + 2 * S2 * tau2
        self.assertGreater(abs(head[0]), tau1)
        self.assertLess(head[3], -error)
        full = signals(b, multiplicities, phases)
        self.assertNotEqual(full[0], 0.0)
        self.assertLess(full[3], 0.0)

    def test_exact_geometric_bound_for_a_genuinely_countable_tail(self):
        # The head gamma=1 at phase i has P=1 and C=-1/4.  Append the
        # countable tail gamma_k=1000*2^k.  Since
        # |(1+i*gamma_k)^(-2)| <= gamma_k^(-2), the following are exact
        # rational upper bounds for its three coefficient tails.
        tail_bounds = {}
        for power in (1, 2, 3):
            ratio = Fraction(1, 2 ** (2 * power))
            tail_bounds[power] = (
                2 * Fraction(1, 1000 ** (2 * power)) / (1 - ratio)
            )
        total_bounds = {
            power: 2 * Fraction(1, 2) ** power + tail_bounds[power]
            for power in (1, 2, 3)
        }
        error = (
            tail_bounds[1] * total_bounds[3]
            + total_bounds[1] * tail_bounds[3]
            + 2 * total_bounds[2] * tail_bounds[2]
        )
        self.assertGreater(Fraction(1), tail_bounds[1])
        self.assertLess(Fraction(-1, 4), -error)

    def test_strict_grid_transfer_uses_no_frequency_moment(self):
        B = 1.0
        gammas = [float(j * j + 1) for j in range(1, 80)]
        b, multiplicities = edge_data(B, gammas)
        t = 48.0
        target = math.exp(t / 2)
        odd = 2 * round((2 * target - 1) / 2) + 1
        lam = odd / 2
        L = 2 * math.log(lam)
        self.assertLess(abs(L - t), 3 * math.exp(-t / 2))
        phases_t = [cmath.exp(1j * gamma * t) for gamma in gammas]
        phases_L = [cmath.exp(1j * gamma * L) for gamma in gammas]
        value_t = signals(b, multiplicities, phases_t)
        value_L = signals(b, multiplicities, phases_L)
        self.assertLess(abs(value_L[0] - value_t[0]), 1e-7)
        self.assertLess(abs(value_L[1] - value_t[1]), 1e-8)
        self.assertLess(abs(value_L[2] - value_t[2]), 1e-8)

    def test_negative_covariance_and_small_residual_sign_the_first_minor(self):
        P = 2.0
        covariance_ratio = -Fraction(1, 7)
        q = Fraction(1, 100)
        main = q * q * Fraction(P * P) * covariance_ratio
        residual = -main / 10
        normalized_minor = main + residual
        self.assertLess(normalized_minor, 0)
        p0 = Fraction(1, 3)
        p1 = Fraction(-2, 3)
        U = Fraction(3, 2)
        edge = -2 * p0 * p1 * U
        self.assertGreater(edge, 0)


if __name__ == "__main__":
    unittest.main()
