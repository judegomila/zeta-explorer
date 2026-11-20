import hashlib
import math
from fractions import Fraction
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "POLYLOG_GROUND_TRANSFER_SOURCE_AUDIT.md"


def even_monomial_integral(power):
    """Exact integral of y**power on [-1/2,1/2] for even power."""
    assert power % 2 == 0
    return Fraction(1, (2**power) * (power + 1))


def polynomial_moment(coefficients, extra_power=0):
    return sum(
        (
            coefficient * even_monomial_integral(power + extra_power)
            for power, coefficient in coefficients.items()
        ),
        Fraction(),
    )


class PolylogGroundTransferSourceAuditTests(unittest.TestCase):
    def test_pinned_source_and_protected_normalization_hashes(self):
        expected = {
            "vendor/CCM-ZST-2511.22755v1.pdf":
                "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
            "P0_SOURCE_LOCK.json":
                "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
            "P0_NORMALIZATION_AUDIT.md":
                "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
        }
        for relative, digest in expected.items():
            self.assertEqual(
                hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(),
                digest,
            )

    def test_exact_cauchy_simple_even_model_has_complete_real_lattice(self):
        # Modes are -1,0,1.  Q=diag(1,0,1) has Cauchy coefficients b_n=0,
        # commutes with inversion, and has the simple even ground V_0.
        modes = (-1, 0, 1)
        diagonal = {mode: Fraction(0 if mode == 0 else 1) for mode in modes}
        b = {mode: Fraction() for mode in modes}
        matrix = {}
        for n in modes:
            for m in modes:
                matrix[n, m] = (
                    diagonal[n]
                    if n == m
                    else (b[n] - b[m]) / (n - m)
                )
        for n in modes:
            for m in modes:
                self.assertEqual(matrix[n, m], matrix[m, n])
                self.assertEqual(matrix[n, m], matrix[-n, -m])
                self.assertEqual((n - m) * matrix[n, m], b[n] - b[m])

        # The centered transform of V_0 is proportional to
        # 2 sin(zL/2)/z, whose nonzero zeros are the complete real lattice.
        L = 7.0
        for integer in (-5, -2, -1, 1, 3, 8):
            z = 2 * math.pi * integer / L
            value = 2 * math.sin(z * L / 2) / z
            self.assertAlmostEqual(value, 0.0, places=13)

    def test_second_moment_is_the_zero_height_trace_coefficient(self):
        roots = [Fraction(1, 9), Fraction(2, 5), Fraction(7), Fraction(31)]
        trace = sum((1 / root for root in roots), Fraction())
        polynomial = [Fraction(1)]
        for root in roots:
            updated = [Fraction() for _ in range(len(polynomial) + 1)]
            for index, coefficient in enumerate(polynomial):
                updated[index] += coefficient
                updated[index + 1] += coefficient / root
            polynomial = updated
        self.assertEqual(polynomial[1], trace)
        for b in (Fraction(1, 8), Fraction(1, 4)):
            anchored = sum((1 / (root + b * b) for root in roots), Fraction())
            self.assertLessEqual(anchored, trace)

    def test_zero_free_interval_endpoint_ratio_bounds_complete_trace(self):
        root_squares = [Fraction(1), Fraction(4), Fraction(9), Fraction(9)]
        t0_squared = Fraction(1, 4)
        ratio = math.prod(
            float(1 - t0_squared / root_square)
            for root_square in root_squares
        )
        trace = sum((1 / root_square for root_square in root_squares), Fraction())
        self.assertGreater(ratio, 0.0)
        self.assertLessEqual(ratio, 1.0)
        self.assertLessEqual(float(t0_squared * trace), -math.log(ratio))

    def test_two_endpoint_values_without_zero_free_interval_are_insufficient(self):
        # t0^2=1 and both root squares lie inside the interval.  The two
        # negative factors have a positive product, but the trace inequality
        # fails because the interval is not zero-free.
        root_squares = [Fraction(1, 100), Fraction(200, 201)]
        ratio = math.prod(float(1 - 1 / root) for root in root_squares)
        trace = sum((1 / root for root in root_squares), Fraction())
        self.assertGreater(ratio, 0.0)
        self.assertLess(ratio, 1.0)
        self.assertGreater(float(trace), -math.log(ratio))

    def test_exterior_lattice_ratio_gate_forces_quadratic_dimension_scale(self):
        # The exact lower bound is L^2/[4*pi^2*(N+1)].  It diverges below
        # quadratic scale and stays bounded at quadratic scale.
        subquadratic = []
        quadratic = []
        for L in (100, 400, 1600, 6400):
            n_sub = int(L ** 1.5)
            n_quad = 3 * L * L
            subquadratic.append(L * L / (4 * math.pi**2 * (n_sub + 1)))
            quadratic.append(L * L / (4 * math.pi**2 * (n_quad + 1)))
        self.assertTrue(all(y > x for x, y in zip(subquadratic, subquadratic[1:])))
        self.assertLess(max(quadratic) - min(quadratic), 1e-6)

    def test_centered_high_mode_transform_has_sqrt_L_over_M_tail(self):
        L = 80.0
        t = 0.7
        T = 1.0
        M = math.ceil(T * L / math.pi)
        square_sum = 0.0
        for n in list(range(M + 1, 10001)) + list(range(-10000, -M)):
            coefficient = (
                2
                * abs(math.sin(t * L / 2))
                * math.sqrt(L)
                / abs(2 * math.pi * n - t * L)
            )
            square_sum += coefficient * coefficient
        self.assertLessEqual(square_sum, 8 * L / (math.pi**2 * M))

    def test_projective_gate_allows_moderately_growing_complete_solve(self):
        low_errors = []
        high_errors = []
        complete_norms = []
        for exponent in (8, 12, 16, 20):
            lam = float(2**exponent)
            L = 2 * math.log(lam)
            M = lam
            low_norm = 1 / L
            complete_norm = (M / L) ** 0.25
            low_errors.append(math.sqrt(L) * low_norm)
            high_errors.append(math.sqrt(L / M) * complete_norm)
            complete_norms.append(complete_norm)
        self.assertTrue(all(y < x for x, y in zip(low_errors, low_errors[1:])))
        self.assertTrue(all(y < x for x, y in zip(high_errors, high_errors[1:])))
        self.assertTrue(all(y > x for x, y in zip(complete_norms, complete_norms[1:])))

    def test_real_axis_rate_is_weaker_than_linear_curvature_bound(self):
        # g is exactly orthogonal to both 1 and y^2 on [-1/2,1/2].
        g = {
            4: Fraction(1),
            2: Fraction(-3, 14),
            0: Fraction(3, 560),
        }
        self.assertEqual(polynomial_moment(g, 0), 0)
        self.assertEqual(polynomial_moment(g, 2), 0)

        # Let psi_L(x)=L^(-1/2)g(x/L)/||g|| and d_L=L^(-1)psi_L.
        # Then ||d_L||=L^(-1), so sqrt(L)||d_L|| -> 0 while
        # L^(5/2)||d_L|| diverges.  Its oriented zeroth and second moments
        # nevertheless vanish exactly.
        real_axis_errors = []
        orientation_free_curvature_bounds = []
        for L in (16, 64, 256, 1024):
            norm = L ** -1
            real_axis_errors.append(math.sqrt(L) * norm)
            orientation_free_curvature_bounds.append(L ** 2.5 * norm)
        self.assertTrue(
            all(y < x for x, y in zip(real_axis_errors, real_axis_errors[1:]))
        )
        self.assertTrue(
            all(
                y > x
                for x, y in zip(
                    orientation_free_curvature_bounds,
                    orientation_free_curvature_bounds[1:],
                )
            )
        )

    def test_a_bare_l2_bound_has_the_locked_second_moment_norm(self):
        for L in (2, 5, 11, 23):
            integral_x4 = Fraction(L**5, 80)
            half_second_moment_norm_squared = integral_x4 / 4
            self.assertEqual(
                half_second_moment_norm_squared,
                Fraction(L**5, 320),
            )

    def test_note_keeps_source_and_projective_gates_distinct(self):
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "self-adjoint finite quotient",
            "complete Fourier lattice",
            "sqrt {L_j}",
            "real-axis ground transfer",
            "O(L_j^(-5/2))",
            "o(L_j^(-1/2))",
            "N=Omega(L^2)",
            "zero-free-interval endpoint ratio",
            "Two endpoint values alone",
            "two projective conditions",
            "sqrt(lambda_j/L_j)",
            "factor-four",
            "simple global inversion-even ground line",
            "No current source estimate",
        )
        for phrase in required:
            self.assertIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
