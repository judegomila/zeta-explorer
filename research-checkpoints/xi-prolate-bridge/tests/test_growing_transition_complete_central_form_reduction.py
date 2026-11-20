#!/usr/bin/env python3
"""Regressions for the complete growing-transition central-form reduction."""

from __future__ import annotations

from collections import Counter
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md"

NOTE_HASH = "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9"
PROTECTED_HASHES = {
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/OUTER_PROJECTION_RADICAL_REDUCTION.md":
        "3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md":
        "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
    "notes/GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md":
        "000be1947a8cc22e7f96a080b8775ce0343fbeb36f886929c7ea5188191e0932",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P0_MATRIX_FORMULAS.md":
        "73aa4d0a746bf1a553372d4c7bdc1c671cd69c9cc36682091d94731e1dac74dd",
}

Matrix = tuple[tuple[F, ...], ...]
Vector = tuple[F, ...]
FormalLog = Counter[int]


def transpose(matrix: Matrix) -> Matrix:
    return tuple(
        tuple(matrix[i][j] for i in range(len(matrix)))
        for j in range(len(matrix[0]))
    )


def matmul(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(
            sum(left[i][k] * right[k][j] for k in range(len(right)))
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


def matadd(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] + right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def matsub(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] - right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def scale(scalar: F, matrix: Matrix) -> Matrix:
    return tuple(tuple(scalar * entry for entry in row) for row in matrix)


def mat_vec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum(matrix[i][j] * vector[j] for j in range(len(vector)))
        for i in range(len(matrix))
    )


def dot(left: Vector, right: Vector) -> F:
    return sum(x * y for x, y in zip(left, right))


def quadratic(matrix: Matrix, vector: Vector) -> F:
    return dot(vector, mat_vec(matrix, vector))


def divisors(number: int) -> tuple[int, ...]:
    return tuple(value for value in range(1, number + 1) if number % value == 0)


def prime_factorization(number: int) -> Counter[int]:
    result: Counter[int] = Counter()
    divisor = 2
    while divisor * divisor <= number:
        while number % divisor == 0:
            result[divisor] += 1
            number //= divisor
        divisor += 1
    if number > 1:
        result[number] += 1
    return result


def von_mangoldt_formal(number: int) -> FormalLog:
    factors = prime_factorization(number)
    if len(factors) != 1:
        return Counter()
    prime = next(iter(factors))
    return Counter({prime: F(1)})


def log_formal(number: int) -> FormalLog:
    return Counter({prime: F(power) for prime, power in prime_factorization(number).items()})


def add_formal(*values: FormalLog) -> FormalLog:
    result: FormalLog = Counter()
    for value in values:
        for prime, coefficient in value.items():
            result[prime] += coefficient
    return Counter({prime: coefficient for prime, coefficient in result.items() if coefficient})


def scale_formal(scalar: F, value: FormalLog) -> FormalLog:
    return Counter(
        {prime: scalar * coefficient for prime, coefficient in value.items() if scalar * coefficient}
    )


def ordered_triples(product: int) -> tuple[tuple[int, int, int], ...]:
    result: list[tuple[int, int, int]] = []
    for m in divisors(product):
        quotient = product // m
        for ell in divisors(quotient):
            result.append((m, ell, quotient // ell))
    return tuple(result)


def formal_weight(triples: list[tuple[int, int, int]]) -> FormalLog:
    return add_formal(*(von_mangoldt_formal(n) for _, _, n in triples))


class GrowingTransitionCompleteCentralFormReductionTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_note_and_dependency_hashes(self) -> None:
        self.assertEqual(hashlib.sha256(NOTE.read_bytes()).hexdigest(), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_exact_radical_expansion_retains_one_pp_copy(self) -> None:
        q_matrix: Matrix = (
            (F(4), F(1), F(-1)),
            (F(1), F(3), F(2)),
            (F(-1), F(2), F(5)),
        )
        p: Matrix = ((F(1), F(0)), (F(2), F(1)), (F(0), F(-1)))
        projection: Matrix = ((F(1), F(-2)), (F(0), F(1)), (F(1), F(1)))
        x = matadd(p, projection)

        q_pp = matmul(matmul(transpose(p), q_matrix), p)
        q_xx = matmul(matmul(transpose(x), q_matrix), x)
        q_xp = matmul(matmul(transpose(x), q_matrix), projection)
        q_px = matmul(matmul(transpose(projection), q_matrix), x)
        q_projection = matmul(matmul(transpose(projection), q_matrix), projection)

        outer_outer = q_xx
        outer_projection = scale(F(-1), q_xp)
        projection_outer = scale(F(-1), q_px)
        all_four = matadd(
            matadd(outer_outer, outer_projection),
            matadd(projection_outer, q_projection),
        )
        self.assertEqual(all_four, q_pp)

        projection_error = matadd(
            outer_projection,
            matadd(projection_outer, q_projection),
        )
        self.assertEqual(projection_error, matsub(q_pp, q_xx))
        self.assertEqual(
            matadd(matadd(outer_outer, outer_projection), projection_outer),
            matsub(q_pp, q_projection),
        )

    def test_cauchy_bound_has_two_crosses_and_one_projection_square(self) -> None:
        # O=diag(2,1), P=diag(1/3,1/4), and D=I.  The first coordinate
        # saturates delta=2*sqrt(B_out*B_proj)+B_proj exactly.
        outer: Matrix = ((F(2), F(0)), (F(0), F(1)))
        projection: Matrix = ((F(1, 3), F(0)), (F(0), F(1, 4)))
        error = matadd(
            matadd(matmul(transpose(outer), projection),
                   matmul(transpose(projection), outer)),
            matmul(transpose(projection), projection),
        )
        b_out = F(4)
        b_projection = F(1, 9)
        delta = 2 * F(2, 3) + b_projection
        self.assertEqual(delta, F(13, 9))
        self.assertEqual(error[0][0], delta)

        identity: Matrix = ((F(1), F(0)), (F(0), F(1)))
        upper_gap = matsub(scale(delta, identity), error)
        lower_gap = matadd(scale(delta, identity), error)
        for vector in (
            (F(1), F(0)),
            (F(0), F(1)),
            (F(2), F(-3)),
            (F(-5), F(7)),
        ):
            self.assertGreaterEqual(quadratic(upper_gap, vector), 0)
            self.assertGreaterEqual(quadratic(lower_gap, vector), 0)

        margin = 4800 * math.log(2) - 160 * math.pi * math.log(96) / math.log(2)
        self.assertGreater(margin, 17.14)
        self.assertLess(margin, 17.15)

    def test_endpoint_shear_is_one_full_metric_congruence(self) -> None:
        endpoint: Matrix = ((F(2), F(3), F(-1)),)
        shear: Matrix = (
            (F(1), F(-3, 2), F(1, 2)),
            (F(0), F(1), F(0)),
            (F(0), F(0), F(1)),
        )
        self.assertEqual(matmul(endpoint, shear), ((F(2), F(0), F(0)),))

        metric: Matrix = (
            (F(5), F(1), F(-1)),
            (F(1), F(4), F(1)),
            (F(-1), F(1), F(3)),
        )
        central: Matrix = (
            (F(7), F(2), F(0)),
            (F(2), F(5), F(-1)),
            (F(0), F(-1), F(4)),
        )
        error = scale(F(1, 3), metric)
        sigma = matadd(central, error)

        sheared_metric = matmul(matmul(transpose(shear), metric), shear)
        sheared_sigma = matmul(matmul(transpose(shear), sigma), shear)
        sheared_central = matmul(matmul(transpose(shear), central), shear)
        self.assertEqual(matsub(sheared_sigma, sheared_central),
                         scale(F(1, 3), sheared_metric))
        self.assertNotEqual(sheared_metric[0][1], 0)
        self.assertNotEqual(sheared_metric[1][2], 0)

    def test_divisor_masks_partition_and_place_b_with_factor_plus_two(self) -> None:
        a_value = F(25, 4)
        cases = {
            12: (F(1), F(3, 2)),
            30: (F(1), F(2), F(4)),
            60: (F(1), F(2), F(5), F(9)),
            72: (F(1), F(3), F(8), F(11)),
        }
        for product, z_values in cases.items():
            triples = ordered_triples(product)
            expected_g = formal_weight(list(triples))
            divisor_count = len(divisors(product))
            expected_closed = scale_formal(F(divisor_count, 2), log_formal(product))
            self.assertEqual(expected_g, expected_closed)

            for z in z_values:
                self.assertLessEqual(z, F(product, 1) / a_value)
                w = F(product, 1) / (a_value * z)
                masks: dict[str, list[tuple[int, int, int]]] = {
                    "R": [], "C_R": [], "C_L": [], "B": []
                }
                for triple in triples:
                    m, ell, n = triple
                    memberships = {
                        "R": n > a_value and m <= z and ell <= w,
                        "C_R": m > z and ell <= w,
                        "C_L": m <= z and ell > w,
                        "B": n < a_value and m > z and ell > w,
                    }
                    self.assertEqual(sum(memberships.values()), 1, (product, z, triple))
                    masks[next(name for name, present in memberships.items() if present)].append(triple)

                r_weight = formal_weight(masks["R"])
                cr_weight = formal_weight(masks["C_R"])
                cl_weight = formal_weight(masks["C_L"])
                b_weight = formal_weight(masks["B"])
                g_weight = add_formal(r_weight, cr_weight, cl_weight, b_weight)
                self.assertEqual(g_weight, expected_g)

                layer_right = add_formal(r_weight, cr_weight)
                layer_formula = add_formal(*(
                    log_formal(k) for k in divisors(product) if k >= a_value * z
                ))
                self.assertEqual(layer_right, layer_formula)

                physical_masks = add_formal(r_weight, cr_weight, cl_weight)
                self.assertEqual(physical_masks, add_formal(expected_g, scale_formal(F(-1), b_weight)))
                self.assertEqual(
                    scale_formal(F(-2), physical_masks),
                    add_formal(scale_formal(F(-2), expected_g), scale_formal(F(2), b_weight)),
                )

    def test_b_reflection_has_both_signs_and_is_not_a_projection(self) -> None:
        reflection: Matrix = ((F(0), F(1)), (F(1), F(0)))
        symmetric = (F(1), F(1))
        antisymmetric = (F(1), F(-1))
        self.assertGreater(quadratic(reflection, symmetric), 0)
        self.assertLess(quadratic(reflection, antisymmetric), 0)

        lam = 2.5
        a = math.log(4.0)
        u = lam * math.exp(-a)

        def h_value(multiple: int) -> float:
            return {1: 0.7, 2: -0.2, 3: 0.5, 4: 0.1, 5: -0.4}.get(multiple, 0.0)

        direct = 0.0
        for m in range(4, 6):
            phi = math.sqrt(lam) / 2 * math.exp((math.log(m) - a) / 2) * h_value(m)
            direct += m ** -0.5 * phi
        full = math.sqrt(u) / 2 * sum(h_value(m) for m in range(1, 6))
        inside = math.sqrt(u) / 2 * sum(h_value(m) for m in range(1, 4))
        self.assertAlmostEqual(direct, full - inside, places=14)

    def test_claim_boundary_and_remaining_inequality_are_serialized(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            r"\Sigma_N-Q_X",
            r"\delta_q=2\sqrt{B_{{\rm out},q}B_{{\rm proj},q}}",
            r"M_{2400}=4800\log2",
            "plus-phase transition synthesis",
            r"\mathcal C_\lambda^*\operatorname {diag}(d_n)",
            r"q_\lambda(X_a,P_b)",
            "There is one, not three, surviving `P--P` term",
            r"-2(G_M-B)=-2G_M+2B",
            r"W_{-,f}(a)",
            "it is not the log-Fourier projection remainder `P`",
            "`B' stays in the `O--O' prime fold",
            r"D_{\rm full}^\#=S_\eta^*D_{\rm full}S_\eta",
            "No estimate on `gamma` is needed",
            r"Q_X-\mathfrak E_{\rm eq}",
            r"\varepsilon_\lambda=o(L)",
            "is not claimed to be necessary",
            r"P_0=1_{(0,\infty)}(D^{-1/2}GD^{-1/2})",
            r"\mathcal R_0=D^{1/2}P_0D^{1/2}",
            r"F_\mu=\Sigma_N-UG-\mu\mathcal R_0",
            r"K_{\mu_0}-{c_{\mu_0}c_{\mu_0}^*\over s_{\mu_0}}\succeq0",
            r"\widehat F_{\mu_0}\succeq\delta_qD_{\rm full}",
            "not the project-minimal",
            "Statement (7.2) is **not proved in this note**",
            "No standalone `B` theorem",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        forbidden = (
            "Q_X is positive",
            "B is exponentially small",
            "B equals the outer--projection term",
            "Statement (7.2) is proved",
            "Statement (7.8) is proved",
            "Statement (7.9) is proved",
            "(7.2) is necessary",
            "the signed floor follows unconditionally",
            "this proves RH",
            "RH_PROVED",
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
        for malformed in ("{cal W}", "{cal E}", ",qquad", "\n\\[\n\\[\n"):
            self.assertNotIn(malformed, text)


if __name__ == "__main__":
    unittest.main()
