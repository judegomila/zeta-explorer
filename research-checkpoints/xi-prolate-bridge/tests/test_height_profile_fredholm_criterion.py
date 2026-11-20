import math
import unittest
from fractions import Fraction
from functools import reduce

import mpmath as mp


def product(values):
    return reduce(lambda x, y: x * y, values, 1)


def lcm(a, b):
    return abs(a * b) // math.gcd(a, b)


def poly_multiply(p, q):
    out = [Fraction(0) for _ in range(len(p) + len(q) - 1)]
    for i, x in enumerate(p):
        for j, y in enumerate(q):
            out[i + j] += x * y
    return out


def poly_derivative(p):
    return [Fraction(i) * p[i] for i in range(1, len(p))]


def poly_evaluate(p, x):
    out = Fraction(0)
    for coefficient in reversed(p):
        out = out * x + coefficient
    return out


def normalized_determinant_polynomial(root_squares, anchor_square):
    """Coefficients of prod_x (1 - t/(x+anchor_square))."""
    p = [Fraction(1)]
    for x in root_squares:
        p = poly_multiply(
            p, [Fraction(1), -Fraction(1, 1) / (x + anchor_square)]
        )
    return p


def height_profile(root_squares, height_square):
    return sum(
        (Fraction(1, 1) / (x + height_square) for x in root_squares),
        Fraction(0),
    )


def weighted_height_profile(multiplicities, height_square):
    return sum(
        (
            Fraction(count, 1) / (root_square + height_square)
            for root_square, count in multiplicities.items()
        ),
        Fraction(0),
    )


def determinant_signature(multiplicities, anchor_square):
    """Distinct linear Fredholm factors and their exact multiplicities."""
    return {
        Fraction(1, 1) / (root_square + anchor_square): count
        for root_square, count in multiplicities.items()
        if count
    }


def cauchy_residue_countermodel(height_squares, nodes):
    """Exact equal-rank signed residues from note equation (6.2)."""
    residues = []
    for k, x_k in enumerate(nodes):
        numerator = product(-x_k - y for y in height_squares)
        denominator = product(
            x_l - x_k for l, x_l in enumerate(nodes) if l != k
        )
        residues.append(Fraction(numerator, denominator))

    scale = 1
    for residue in residues:
        scale = lcm(scale, residue.denominator)
    signed_multiplicities = [int(scale * residue) for residue in residues]

    plus = {}
    minus = {}
    for x_k, multiplicity in zip(nodes, signed_multiplicities):
        if multiplicity > 0:
            plus[x_k] = multiplicity
        elif multiplicity < 0:
            minus[x_k] = -multiplicity
    return residues, signed_multiplicities, plus, minus


class HeightProfileFredholmCriterionTests(unittest.TestCase):
    def test_origin_pair_and_two_s_weight_have_exact_sign(self):
        # One x=0 entry represents one +/- origin pair, i.e. an order-two zero.
        roots = [Fraction(0), Fraction(1), Fraction(9, 4)]
        b = Fraction(1, 4)
        s = Fraction(1, 8)
        b2 = b * b
        s2 = s * s
        t = b2 - s2

        determinant = normalized_determinant_polynomial(roots, b2)
        derivative = poly_derivative(determinant)
        d_value = poly_evaluate(determinant, t)
        d_prime = poly_evaluate(derivative, t)

        # t(s)=b^2-s^2, hence d_s log D(t(s))=-2s D'(t)/D(t).
        lhs = -2 * s * d_prime / d_value
        rhs = 2 * s * height_profile(roots, s2)
        self.assertEqual(lhs, rhs)

        # The origin-pair factor is s^2/b^2, not s/b or an omitted factor.
        self.assertEqual((Fraction(0) + s2) / (Fraction(0) + b2), Fraction(1, 4))
        self.assertGreater(rhs, 0)

    def test_off_axis_normalization_is_scale_invariant(self):
        roots = [Fraction(0), Fraction(2), Fraction(5)]
        b2 = Fraction(1, 16)
        s2 = Fraction(1, 64)
        ratio = product((x + s2) / (x + b2) for x in roots)
        for scale in (Fraction(7, 3), Fraction(-11, 5)):
            numerator = scale * product(x + s2 for x in roots)
            denominator = scale * product(x + b2 for x in roots)
            self.assertEqual(numerator / denominator, ratio)

    def test_far_pair_profile_and_determinant_errors_vanish_together(self):
        a = mp.mpf(1) / 8
        b = mp.mpf(1) / 4
        t = mp.mpf(3)
        previous_delta = mp.inf
        previous_error = mp.inf
        for radius in (10, 100, 1000, 10000):
            x = mp.mpf(radius) ** 2
            # Integral_a^b 2s/(x+s^2) ds.
            delta = mp.log((x + b * b) / (x + a * a))
            # The extra normalized Fredholm factor is 1-t/(x+b^2).
            determinant_error = abs(t / (x + b * b))
            self.assertLess(delta, previous_delta)
            self.assertLess(determinant_error, previous_error)
            previous_delta = delta
            previous_error = determinant_error
        self.assertLess(previous_delta, mp.mpf("1e-8"))
        self.assertLess(previous_error, mp.mpf("1e-7"))

    def test_mesh_sandwich_bound_uses_monotonicity_only(self):
        target_roots = [Fraction(0), Fraction(3, 2), Fraction(4)]
        trial_roots = [Fraction(0), Fraction(8, 5), Fraction(19, 5)]
        a = Fraction(1, 8)
        b = Fraction(1, 4)
        count = 32
        nodes = [a + (b - a) * Fraction(i, count) for i in range(count + 1)]

        epsilon = max(
            abs(
                height_profile(trial_roots, node * node)
                - height_profile(target_roots, node * node)
            )
            for node in nodes
        )

        # A valid elementary Lipschitz constant for the target profile.
        lipschitz = 2 * b * sum(
            (Fraction(1, 1) / (x + a * a) ** 2 for x in target_roots),
            Fraction(0),
        )
        mesh = (b - a) / count
        certified_bound = epsilon + lipschitz * mesh

        for i in range(1025):
            point = a + (b - a) * Fraction(i, 1024)
            error = abs(
                height_profile(trial_roots, point * point)
                - height_profile(target_roots, point * point)
            )
            self.assertLessEqual(error, certified_bound)

    def test_exact_cauchy_residues_match_any_fixed_rational_height_set(self):
        # The right endpoint 1/4 is included, so the anchor first traces match.
        heights = [Fraction(1, 8), Fraction(1, 5), Fraction(1, 4)]
        height_squares = [height * height for height in heights]
        nodes = [Fraction(1), Fraction(2), Fraction(4), Fraction(7), Fraction(11)]
        residues, signed, plus, minus = cauchy_residue_countermodel(
            height_squares, nodes
        )

        self.assertTrue(all(residue != 0 for residue in residues))
        self.assertEqual(sum(residues, Fraction(0)), 0)
        self.assertEqual(sum(signed), 0)
        self.assertTrue(any(value > 0 for value in signed))
        self.assertTrue(any(value < 0 for value in signed))
        self.assertEqual(sum(plus.values()), sum(minus.values()))

        for y in height_squares:
            self.assertEqual(
                weighted_height_profile(plus, y),
                weighted_height_profile(minus, y),
            )

        anchor_square = heights[-1] ** 2
        self.assertNotEqual(
            determinant_signature(plus, anchor_square),
            determinant_signature(minus, anchor_square),
        )

        # The rational difference is nonzero away from the prescribed nodes.
        unsampled = Fraction(1, 3) ** 2
        self.assertNotEqual(
            weighted_height_profile(plus, unsampled),
            weighted_height_profile(minus, unsampled),
        )

    def test_common_tail_does_not_repair_fixed_height_nonuniqueness(self):
        heights = [Fraction(1, 8), Fraction(1, 4)]
        height_squares = [height * height for height in heights]
        nodes = [Fraction(1), Fraction(3), Fraction(6), Fraction(10)]
        _, _, plus, minus = cauchy_residue_countermodel(height_squares, nodes)
        common_tail = {
            Fraction(0): 1,
            Fraction(13): 1,
            Fraction(29): 1,
            Fraction(47): 1,
        }
        plus_with_tail = dict(plus)
        minus_with_tail = dict(minus)
        for root_square, count in common_tail.items():
            plus_with_tail[root_square] = plus_with_tail.get(root_square, 0) + count
            minus_with_tail[root_square] = minus_with_tail.get(root_square, 0) + count

        for y in height_squares:
            self.assertEqual(
                weighted_height_profile(plus_with_tail, y),
                weighted_height_profile(minus_with_tail, y),
            )

        b2 = heights[-1] ** 2
        self.assertNotEqual(
            determinant_signature(plus_with_tail, b2),
            determinant_signature(minus_with_tail, b2),
        )

    def test_source_response_chain_rule_has_L_over_two_pi(self):
        mp.mp.dps = 80
        L = mp.mpf(7)
        s = mp.mpf(3) / 16
        alpha = s * L / (2 * mp.pi)

        def response(x):
            return 1 + x * x

        def ground_transform(height):
            argument = height * L / (2 * mp.pi)
            return (
                2
                * mp.sinh(height * L / 2)
                / (height * mp.sqrt(L))
                * response(argument)
            )

        direct = mp.diff(lambda height: mp.log(ground_transform(height)), s)
        reconstructed = (
            (L / 2) * mp.coth(s * L / 2)
            - 1 / s
            + (L / (2 * mp.pi)) * (2 * alpha / (1 + alpha * alpha))
        )
        mutated = (
            (L / 2) * mp.coth(s * L / 2)
            - 1 / s
            + (L / 2) * (2 * alpha / (1 + alpha * alpha))
        )
        self.assertLess(abs(direct - reconstructed), mp.mpf("1e-70"))
        self.assertGreater(abs(direct - mutated), mp.mpf("1e-3"))


if __name__ == "__main__":
    unittest.main()
