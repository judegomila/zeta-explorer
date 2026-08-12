from __future__ import annotations

from fractions import Fraction
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ADAPTIVE_ALL_EVEN_PREFIX_BRIDGE_OBSTRUCTION.md"

DEPENDENCIES = {
    "DIRECT_RH_ATTACK.md":
        "b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2",
    "notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md":
        "39147b7fcd5c71304c6977272b72a3f07a789b7c4fb34d2e2ebf51e3b60589f3",
    "notes/LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR.md":
        "c9f10ffb6b6ceeafe8ea63566d10c3af7eb6265c509c8d63e259bc407cc7f79a",
    "notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md":
        "544ce5d2ba527ba9200a64860d977c7191107c88798963591ed960bfa81e527c",
}

F = Fraction


def transpose(a: list[list[F]]) -> list[list[F]]:
    return [list(row) for row in zip(*a)]


def matmul(a: list[list[F]], b: list[list[F]]) -> list[list[F]]:
    bt = transpose(b)
    return [[sum((x * y for x, y in zip(row, col)), F(0)) for col in bt] for row in a]


def matvec(a: list[list[F]], x: list[F]) -> list[F]:
    return [sum((u * v for u, v in zip(row, x)), F(0)) for row in a]


def dot(x: list[F], y: list[F]) -> F:
    return sum((u * v for u, v in zip(x, y)), F(0))


def add(a: list[list[F]], b: list[list[F]]) -> list[list[F]]:
    return [[x + y for x, y in zip(arow, brow)] for arow, brow in zip(a, b)]


def sub(a: list[list[F]], b: list[list[F]]) -> list[list[F]]:
    return [[x - y for x, y in zip(arow, brow)] for arow, brow in zip(a, b)]


def scale(c: F, a: list[list[F]]) -> list[list[F]]:
    return [[c * x for x in row] for row in a]


def det2(a: list[list[F]]) -> F:
    return a[0][0] * a[1][1] - a[0][1] * a[1][0]


def inv2(a: list[list[F]]) -> list[list[F]]:
    d = det2(a)
    if d == 0:
        raise ValueError("singular matrix")
    return [[a[1][1] / d, -a[0][1] / d], [-a[1][0] / d, a[0][0] / d]]


def rank2_columns(columns: list[list[F]]) -> int:
    if not columns:
        return 0
    if all(all(x == 0 for x in col) for col in columns):
        return 0
    for i, left in enumerate(columns):
        for right in columns[i + 1 :]:
            if left[0] * right[1] - left[1] * right[0] != 0:
                return 2
    return 1


class AdaptiveAllEvenPrefixBridgeObstructionTests(unittest.TestCase):
    def test_dependency_hashes_are_exact(self) -> None:
        for relative, expected in DEPENDENCIES.items():
            with self.subTest(relative=relative):
                payload = (ROOT / relative).read_bytes()
                self.assertEqual(hashlib.sha256(payload).hexdigest(), expected)

    def test_note_distinguishes_inherited_floor_from_new_action_result(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        self.assertIn("The signed-floor part of this conclusion is not new", text)
        self.assertIn("MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md", text)
        self.assertIn("exact source-coordinate identity", text)
        self.assertIn("action term in (5.2) stays", text)
        self.assertIn("neither is asserted to be an actual prolate--Weil matrix", text)
        self.assertIn("P0_INVALIDATED", text)

    def test_maximum_of_two_successful_prefixes_spans_both_sectors(self) -> None:
        zero = [F(0), F(0)]
        e1 = [F(1), F(0)]
        e2 = [F(0), F(1)]
        plus_columns = [e1, zero, e2]
        minus_columns = [e1, e2, zero]

        self.assertEqual(rank2_columns(plus_columns[:2]), 1)
        self.assertEqual(rank2_columns(plus_columns[:3]), 2)
        self.assertEqual(rank2_columns(minus_columns[:2]), 2)
        common_prefix = max(3, 2)
        self.assertEqual(rank2_columns(plus_columns[:common_prefix]), 2)
        self.assertEqual(rank2_columns(minus_columns[:common_prefix]), 2)

    def test_full_span_negative_B_countermodel(self) -> None:
        g = F(1)
        c = F(0)
        r = F(2)
        w = F(1)
        b = g + c - r
        self.assertEqual(w * w, 1)
        self.assertEqual(b, -1)
        self.assertLess(b, 0)

    def test_pullback_and_quotient_metric_identity(self) -> None:
        w = [[F(1), F(1)], [F(0), F(1)]]
        b = [[F(2), F(1)], [F(1), F(2)]]
        pullback = matmul(transpose(w), matmul(b, w))
        self.assertGreater(pullback[0][0], 0)
        self.assertGreater(det2(pullback), 0)

        delta = inv2(matmul(w, transpose(w)))
        for y in ([F(2), F(-1)], [F(3), F(5)]):
            x = matvec(w, list(y))
            self.assertEqual(dot(x, matvec(delta, x)), dot(list(y), list(y)))

    def test_negative_direction_is_preserved_by_full_row_pullback(self) -> None:
        w = [[F(1), F(1)], [F(0), F(1)]]
        b = [[F(-1), F(0)], [F(0), F(1)]]
        x = [F(1), F(0)]
        w_inv = inv2(w)
        y = matvec(w_inv, x)
        physical = dot(x, matvec(b, x))
        pulled = matmul(transpose(w), matmul(b, w))
        self.assertEqual(dot(y, matvec(pulled, y)), physical)
        self.assertEqual(physical, -1)

    def test_source_coordinate_shifted_action_identity(self) -> None:
        w = [[F(1), F(1)], [F(0), F(1)]]
        ell = [[F(2), F(0)], [F(0), F(3)]]
        b = [F(1), F(1)]
        g = matmul(transpose(w), w)
        ell_s = matmul(transpose(w), matmul(ell, w))
        b_s = matvec(transpose(w), b)
        y = matvec(inv2(ell_s), b_s)
        source_value = dot(y, matvec(g, y))

        z = matvec(inv2(ell), b)
        physical_value = dot(z, z)
        self.assertEqual(source_value, physical_value)
        self.assertEqual(physical_value, F(13, 36))
        self.assertEqual(matvec(w, y), z)

    def test_dual_action_supremum_has_the_same_exact_value(self) -> None:
        ell = [[F(2), F(0)], [F(0), F(3)]]
        b = [F(1), F(1)]
        ell_inv = inv2(ell)
        v = matvec(ell_inv, matvec(ell_inv, b))
        numerator = dot(b, v)
        denominator_squared = dot(matvec(ell, v), matvec(ell, v))
        ratio_squared = numerator * numerator / denominator_squared
        self.assertEqual(ratio_squared, F(13, 36))

    def test_constant_T_model_has_both_strict_sector_comparisons(self) -> None:
        q_plus = [[F(1), F(1)], [F(1), F(1)]]
        self.assertEqual(q_plus[0][0] + q_plus[1][1], 2)
        self.assertEqual(det2(q_plus), 0)
        u = F(0)
        certified_u = F(0)
        alpha = q_plus[1][1]
        omega = F(2)
        self.assertGreater(alpha - certified_u, 0)
        self.assertGreater(omega - certified_u, 0)
        residual_b = q_plus[1][0]
        shifted_complement = alpha - certified_u
        t = abs(residual_b / shifted_complement)
        self.assertEqual(u, certified_u)
        self.assertEqual(t, 1)

    def test_constant_T_model_has_an_exact_positive_negative_split(self) -> None:
        identity = [[F(1), F(0)], [F(0), F(1)]]
        p_plus = scale(F(1, 2), [[F(1), F(1)], [F(1), F(1)]])
        p_minus = scale(F(1, 2), [[F(1), F(-1)], [F(-1), F(1)]])
        zero = [[F(0), F(0)], [F(0), F(0)]]
        q_plus = [[F(1), F(1)], [F(1), F(1)]]
        self.assertEqual(matmul(p_plus, p_plus), p_plus)
        self.assertEqual(matmul(p_minus, p_minus), p_minus)
        self.assertEqual(matmul(p_plus, p_minus), zero)
        self.assertEqual(add(identity, sub(p_plus, p_minus)), q_plus)

    def test_chordal_error_and_weighted_bridge_do_not_decay(self) -> None:
        chord = math.sqrt(2.0 - math.sqrt(2.0))
        self.assertGreater(chord, 0.0)
        values = [math.sqrt(math.log(lam)) * chord for lam in (math.e, math.e**4, math.e**9)]
        self.assertLess(values[0], values[1])
        self.assertLess(values[1], values[2])
        self.assertAlmostEqual(values[2] / values[0], 3.0)

    def test_constant_action_cannot_be_big_O_lambda_minus_one_half(self) -> None:
        scaled_squares = [F(lam) * F(1) ** 2 for lam in (1, 4, 16, 64)]
        self.assertEqual(scaled_squares, [F(1), F(4), F(16), F(64)])
        self.assertGreater(scaled_squares[-1], scaled_squares[0])

    def test_scope_is_fail_closed_and_no_integration_change_is_claimed(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "no shifted sector floor",
            "bound required by equation (5.2)",
            "locally uniform",
            "determinant limit",
            "no Lambda bound",
            "changes no status, replay, source lock, manifest",
            "effective last label",
            "mixes the two residue classes modulo four",
        )
        for phrase in required:
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
