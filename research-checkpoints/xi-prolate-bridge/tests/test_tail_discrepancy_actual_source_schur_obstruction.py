from __future__ import annotations

from fractions import Fraction
import hashlib
from itertools import permutations
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
F = Fraction
Interval = tuple[Fraction, Fraction]

ENTRY = re.compile(r"^ENTRY (-?\d+) (-?\d+) Q \[([^ ]+) \+/- ([^\]]+)\]$")
PRODUCER_META = re.compile(
    r"^META lambda=([^ ]+) N=(\d+) prec=(\d+) cutoff=(\d+) status=([^ ]+)$"
)
VERIFIER_META = re.compile(
    r"^META lambda=([^ ]+) N=(\d+) prec=(\d+) cutoff=(\d+) path=([^ ]+)$"
)

RAW_SHA256 = {
    ("producer", 256): "e47acba7e059ec955fe9f658c168ef3ecc1f1232852fda87cb39fab25ddff8bb",
    ("producer", 512): "ac9924d834873af7b40be0fee3a10375977a873155cd673df8edb03d72a96e5c",
    ("verifier", 256): "69a18f3ea551252f0e0433d6210a66f73d8fa49ab21d8659faebd9ad2182cdbc",
    ("verifier", 512): "509b75876b3cb6025e18ec678498df27aa40fa9c31f6b14ebf10e6b20b0fc485",
}


def add(left: Interval, right: Interval) -> Interval:
    return left[0] + right[0], left[1] + right[1]


def negate(value: Interval) -> Interval:
    return -value[1], -value[0]


def subtract(left: Interval, right: Interval) -> Interval:
    return add(left, negate(right))


def multiply(left: Interval, right: Interval) -> Interval:
    products = tuple(left[i] * right[j] for i in (0, 1) for j in (0, 1))
    return min(products), max(products)


def scale(value: Interval, scalar: Fraction) -> Interval:
    if scalar >= 0:
        return value[0] * scalar, value[1] * scalar
    return value[1] * scalar, value[0] * scalar


def divide_positive(value: Interval, denominator: Interval) -> Interval:
    if denominator[0] <= 0:
        raise ValueError("interval denominator must be strictly positive")
    return multiply(value, (1 / denominator[1], 1 / denominator[0]))


def exact(value: int | Fraction) -> Interval:
    item = F(value)
    return item, item


def dot(left: list[Interval], right: list[Interval]) -> Interval:
    result = exact(0)
    for x, y in zip(left, right):
        result = add(result, multiply(x, y))
    return result


def matvec(matrix: list[list[Interval]], vector: list[Interval]) -> list[Interval]:
    return [dot(row, vector) for row in matrix]


def bilinear(
    matrix: list[list[Interval]], left: tuple[int, ...], right: tuple[int, ...]
) -> Interval:
    left_i = [exact(value) for value in left]
    right_i = [exact(value) for value in right]
    return dot(left_i, matvec(matrix, right_i))


def determinant(matrix: list[list[Interval]]) -> Interval:
    size = len(matrix)
    result = exact(0)
    for permutation in permutations(range(size)):
        inversions = sum(
            permutation[i] > permutation[j]
            for i in range(size)
            for j in range(i + 1, size)
        )
        term = exact(1)
        for row, column in enumerate(permutation):
            term = multiply(term, matrix[row][column])
        result = add(result, scale(term, F(-1 if inversions % 2 else 1)))
    return result


def overlap(left: Interval, right: Interval) -> bool:
    return max(left[0], right[0]) <= min(left[1], right[1])


def parse_raw(role: str, bits: int) -> dict[tuple[int, int], Interval]:
    path = ROOT / "artifacts" / "p0_ball_pilots" / "lambda2_N4" / f"{role}_{bits}bits.txt"
    if hashlib.sha256(path.read_bytes()).hexdigest() != RAW_SHA256[role, bits]:
        raise ValueError("raw source matrix artifact hash mismatch")
    entries: dict[tuple[int, int], Interval] = {}
    metadata_seen = False
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        meta = (PRODUCER_META if role == "producer" else VERIFIER_META).fullmatch(line)
        if meta is not None:
            metadata_seen = True
            if meta.group(1, 2, 3, 4) != ("2", "4", str(bits), "4"):
                raise ValueError("raw source matrix metadata mismatch")
            if role == "producer":
                if meta.group(5) != "BALL_OUTPUT":
                    raise ValueError("producer path metadata mismatch")
            elif meta.group(5) != "direct_distribution_plus_corrected_4_14":
                raise ValueError("verifier path metadata mismatch")
            continue
        match = ENTRY.fullmatch(line)
        if match is None:
            continue
        key = int(match.group(1)), int(match.group(2))
        midpoint, radius = F(match.group(3)), F(match.group(4))
        if key in entries or radius < 0:
            raise ValueError("invalid or duplicate raw ball entry")
        entries[key] = midpoint - radius, midpoint + radius
    if not metadata_seen or len(entries) != 81:
        raise ValueError("raw source matrix output is incomplete")
    return entries


def source_odd_matrix(q_full: dict[tuple[int, int], Interval]) -> list[list[Interval]]:
    result: list[list[Interval]] = []
    for n in range(1, 5):
        row = []
        for m in range(1, 5):
            row.append(
                add(
                    subtract(subtract(q_full[n, m], q_full[n, -m]), q_full[-n, m]),
                    q_full[-n, -m],
                )
            )
        result.append(row)
    return result


def certificate(q_full: dict[tuple[int, int], Interval]) -> dict[str, object]:
    modes = tuple(range(-4, 5))
    positive_coefficients = (702, -484, 139, -4, 0)
    state = tuple(positive_coefficients[abs(mode)] for mode in modes)
    state_norm_squared = 999990
    state_i = [exact(value) for value in state]
    q_matrix = [[q_full[n, m] for m in modes] for n in modes]

    qv = matvec(q_matrix, state_i)
    q2v = matvec(q_matrix, qv)
    q3v = matvec(q_matrix, q2v)
    moment_1 = scale(dot(state_i, qv), F(1, state_norm_squared))
    moment_2 = scale(dot(state_i, q2v), F(1, state_norm_squared))
    moment_3 = scale(dot(state_i, q3v), F(1, state_norm_squared))
    residual_squared = subtract(moment_2, multiply(moment_1, moment_1))
    residual_q_residual = add(
        subtract(moment_3, scale(multiply(moment_1, moment_2), F(2))),
        multiply(multiply(moment_1, moment_1), moment_1),
    )

    odd = source_odd_matrix(q_full)
    shifted_q = [
        [
            subtract(odd[i][j], scale(moment_1, F(2))) if i == j else odd[i][j]
            for j in range(4)
        ]
        for i in range(4)
    ]
    derivative = (-242, 139, -6, 0)
    complement = (
        (3, 0, -121, 0),
        (0, 6, 139, 0),
        (0, 0, 0, 1),
    )
    transverse = [
        [bilinear(shifted_q, complement[i], complement[j]) for j in range(3)]
        for i in range(3)
    ]
    sylvester = (
        transverse[0][0],
        determinant([row[:2] for row in transverse[:2]]),
        determinant(transverse),
    )
    full_determinant = determinant(shifted_q)
    change_of_basis = [
        [exact(value) for value in row]
        for row in zip(derivative, *complement)
    ]
    change_determinant = determinant(change_of_basis)
    if change_determinant[0] != change_determinant[1]:
        raise AssertionError("integer change-of-basis determinant widened")
    schur_numerator = scale(full_determinant, change_determinant[0] ** 2)
    schur_short = divide_positive(schur_numerator, sylvester[2])

    odd_trial = (8847, -4657, 162, 87)
    odd_trial_norm_squared = 2 * sum(value * value for value in odd_trial)
    odd_rayleigh = scale(
        bilinear(odd, odd_trial, odd_trial), F(1, odd_trial_norm_squared)
    )
    ritz_first = subtract(moment_1, odd_rayleigh)
    ritz_second = subtract(
        residual_q_residual, multiply(odd_rayleigh, residual_squared)
    )
    ritz_determinant = subtract(
        multiply(ritz_first, ritz_second),
        multiply(residual_squared, residual_squared),
    )
    return {
        "q": moment_1,
        "direction": bilinear(shifted_q, derivative, derivative),
        "sylvester": sylvester,
        "full_determinant": full_determinant,
        "change_determinant": change_determinant,
        "schur_short": schur_short,
        "odd_rayleigh": odd_rayleigh,
        "residual_squared": residual_squared,
        "ritz_first": ritz_first,
        "ritz_second": ritz_second,
        "ritz_determinant": ritz_determinant,
    }


def strictly_between(value: Interval, lower: str, upper: str) -> bool:
    return F(lower) < value[0] <= value[1] < F(upper)


class TailDiscrepancyActualSourceSchurObstructionTests(unittest.TestCase):
    def test_exact_state_geometry(self) -> None:
        coefficients = (702, -484, 139, -4, 0)
        self.assertEqual(coefficients[0] ** 2 + 2 * sum(x * x for x in coefficients[1:]), 999990)
        self.assertEqual(coefficients[0] + 2 * sum(coefficients[1:]), 4)

        derivative = (-242, 139, -6, 0)
        complement = (
            (3, 0, -121, 0),
            (0, 6, 139, 0),
            (0, 0, 0, 1),
        )
        for vector in complement:
            self.assertEqual(sum(x * y for x, y in zip(derivative, vector)), 0)
        change = [[exact(value) for value in row] for row in zip(derivative, *complement)]
        self.assertEqual(determinant(change), exact(-233763))

    def test_safe_pair_is_positive_only_to_the_right_of_its_zero(self) -> None:
        def real_pair(sigma: F, tau: F, beta: F, gamma: F) -> F:
            return (sigma - beta) / ((sigma - beta) ** 2 + (tau - gamma) ** 2) + (
                sigma + beta
            ) / ((sigma + beta) ** 2 + (tau + gamma) ** 2)

        self.assertGreater(real_pair(F(1, 2), F(7), F(1, 4), F(10)), 0)
        # Crossing to the left of an off-line zero destroys the termwise
        # positive-real sign at its ordinate.
        self.assertLess(real_pair(F(1, 10), F(10), F(1, 4), F(10)), 0)

    def test_both_arb_paths_and_precisions_certify_q_and_ritz_failures(self) -> None:
        for bits in (256, 512):
            producer = parse_raw("producer", bits)
            verifier = parse_raw("verifier", bits)
            self.assertEqual(sorted(producer), sorted(verifier))
            self.assertTrue(all(overlap(producer[key], verifier[key]) for key in producer))

            for raw in (producer, verifier):
                report = certificate(raw)
                self.assertTrue(strictly_between(report["q"], "0.0000047894", "0.0000047895"))
                self.assertTrue(strictly_between(report["direction"], "11.459", "11.460"))

                d1, d2, d3 = report["sylvester"]
                self.assertTrue(strictly_between(d1, "38505", "38506"))
                self.assertTrue(strictly_between(d2, "36150", "36151"))
                self.assertTrue(strictly_between(d3, "2906", "2907"))
                self.assertTrue(
                    strictly_between(report["full_determinant"], "-0.00000003725", "-0.00000003724")
                )
                self.assertEqual(report["change_determinant"], exact(-233763))
                self.assertTrue(strictly_between(report["schur_short"], "-0.701", "-0.700"))

                self.assertTrue(
                    strictly_between(report["odd_rayleigh"], "0.00000030460", "0.00000030461")
                )
                self.assertTrue(
                    strictly_between(report["ritz_first"], "0.0000044848", "0.0000044849")
                )
                self.assertTrue(
                    strictly_between(report["residual_squared"], "0.0000034794", "0.0000034796")
                )
                self.assertTrue(
                    strictly_between(report["ritz_second"], "0.0000029063", "0.0000029065")
                )
                self.assertTrue(
                    strictly_between(
                        report["ritz_determinant"],
                        "0.0000000000009279",
                        "0.0000000000009280",
                    )
                )


if __name__ == "__main__":
    unittest.main()
