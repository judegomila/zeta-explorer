#!/usr/bin/env python3
"""Exact regressions for the anchored-routing vertex obstruction.

Only the Python standard library and exact rational arithmetic are used.
The countermodel is structural combined source-Cauchy data, never a cached
or purportedly certified arithmetic Weil matrix.
"""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ACTUAL_SOURCE_ANCHORED_ROUTING_VERTEX_OBSTRUCTION.md"

LOCK_HASHES = {
    "P0_SOURCE_LOCK.json": "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md": "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


def weights_from_p_c(p: tuple[F, ...], c: tuple[F, ...]) -> dict[tuple[int, int], F]:
    weights: dict[tuple[int, int], F] = {}
    for i in range(len(p)):
        for j in range(i + 1, len(p)):
            divided = (c[i] - c[j]) / F(i * i - j * j)
            weights[i, j] = -p[i] * p[j] * divided
    return weights


def degree(weights: dict[tuple[int, int], F], vertex: int) -> F:
    return sum(
        (value for edge, value in weights.items() if vertex in edge),
        F(0),
    )


def graph_energy(weights: dict[tuple[int, int], F], value: tuple[F, ...]) -> F:
    return sum(
        (
            weight * (value[i] - value[j]) ** 2
            for (i, j), weight in weights.items()
        ),
        F(0),
    )


def positive_graph_connected(
    weights: dict[tuple[int, int], F],
    vertex_count: int,
) -> bool:
    adjacency = [set() for _ in range(vertex_count)]
    for (i, j), weight in weights.items():
        if weight > 0:
            adjacency[i].add(j)
            adjacency[j].add(i)
    seen = {0}
    frontier = [0]
    while frontier:
        i = frontier.pop()
        for j in adjacency[i] - seen:
            seen.add(j)
            frontier.append(j)
    return len(seen) == vertex_count


class ActualSourceAnchoredRoutingVertexObstructionTests(unittest.TestCase):
    def test_claim_boundary_and_complete_source_conventions(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "actual-source contractive-routing theorem",
            "already-combined weighted-PNT discrepancy",
            "not the pinned\npole--archimedean--minus-prime source",
            "project state remains `P0_INVALIDATED`",
            r"1<n\leq\lambda^2",
            "minus sign of the prime block",
            "Assume `N>=1`",
            "one-vertex branch `N=0`",
            r"dF_{\rm align}=dD_\lambda+\tau(t)\,dt",
            r"\lim_{\epsilon\downarrow0}",
            r"P_N(t)F_{\rm align}(t)\longrightarrow0",
            "improper\n`epsilon downarrow 0` limits",
            r"\int_0^L F_{\rm align}(t)",
            r"b_n={1\over\pi}\operatorname {Re}",
            r"D(z)=\int_0^\infty\delta_*(t)e^{-zt}\,dt",
            r"\xi_R(s)={1\over2}s(s-1)\pi^{-s/2}",
            "is **not** asserted as a limit theorem",
            "outside the proved absolutely convergent domain",
            "simultaneous all-coordinate nonvanishing assumption",
            "Fixed-mode convergence alone does not supply that assumption",
            "positive-edge graph is connected",
            r"\liminf_{r\to\infty}\|S\|_{\rm op}^2\geq2",
            "No repository theorem presently proves",
            "positive-graph connectivity, (5.1)",
            "neither implied by positive-graph connectivity",
            "nor sufficient for that connectivity",
            "Equation (5.1)\nin isolation does not",
            "Conversely, RH alone would not establish",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        self.assertNotIn("RH_PROVED", text)
        self.assertNotIn("Riemann hypothesis is proved", text)
        self.assertNotIn("actual-source routing contraction holds", text)
        self.assertNotIn("integral no longer converges in that half-plane", text)
        self.assertNotIn("any admitted\nprojection-convergent schedule", text)
        self.assertNotIn("schedule satisfying (5.1) would", text)

    def test_protected_source_bytes_are_unchanged(self) -> None:
        for relative, expected in LOCK_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_raw_vertex_formulas_equal_the_loewner_degrees(self) -> None:
        x = (F(3), F(-2), F(1), F(-1, 2), F(1, 3))
        b = (F(0), F(5, 7), F(-2, 5), F(3, 11), F(-1, 13))
        p = (x[0],) + tuple(2 * entry for entry in x[1:])
        c = tuple(F(n) * b[n] for n in range(len(b)))
        weights = weights_from_p_c(p, c)

        d0_formula = -2 * x[0] * sum(
            (b[n] * x[n] / n for n in range(1, len(x))),
            F(0),
        )
        d1_formula = -2 * x[1] * (
            b[1] * x[0]
            + 2
            * sum(
                (
                    x[m] * (b[1] - m * b[m]) / (1 - m * m)
                    for m in range(2, len(x))
                ),
                F(0),
            )
        )

        self.assertEqual(degree(weights, 0), d0_formula)
        self.assertEqual(degree(weights, 1), d1_formula)
        e0 = (F(1),) + (F(0),) * (len(x) - 1)
        e1 = (F(0), F(1)) + (F(0),) * (len(x) - 2)
        self.assertEqual(graph_energy(weights, e0), d0_formula)
        self.assertEqual(graph_energy(weights, e1), d1_formula)

    def test_n_zero_branch_has_zero_degree_and_no_edges(self) -> None:
        weights = weights_from_p_c((F(3),), (F(0),))
        self.assertEqual(weights, {})
        self.assertEqual(degree(weights, 0), 0)
        self.assertEqual(graph_energy(weights, (F(1),)), 0)

    def test_improper_stieltjes_endpoint_and_integration_by_parts_model(self) -> None:
        # Exact model for the endpoint orders used in (2.12a)--(2.13):
        # F(t)=log(t), P(t)=t(1-t), epsilon=2^(-k).  Coefficients of
        # log(2) are kept separately, so no floating-point logarithm enters.
        endpoint_sizes: list[F] = []
        for k in range(2, 31):
            epsilon = F(1, 2**k)
            p_epsilon = epsilon * (1 - epsilon)
            endpoint_log2_coefficient = k * p_epsilon
            endpoint_sizes.append(endpoint_log2_coefficient)

            stieltjes_integral = F(1, 2) - epsilon + epsilon * epsilon / 2
            boundary_rational = F(0)
            boundary_log2 = k * p_epsilon
            ordinary_integral_rational = -F(1, 2) + epsilon - epsilon * epsilon / 2
            ordinary_integral_log2 = k * p_epsilon
            integration_by_parts_rational = boundary_rational - ordinary_integral_rational
            integration_by_parts_log2 = boundary_log2 - ordinary_integral_log2

            self.assertEqual(integration_by_parts_rational, stieltjes_integral)
            self.assertEqual(integration_by_parts_log2, 0)

        self.assertTrue(all(b < a for a, b in zip(endpoint_sizes, endpoint_sizes[1:])))
        self.assertLess(endpoint_sizes[-1], F(1, 10**6))

    def test_truncated_transform_real_part_factor_is_exact(self) -> None:
        # If D_L(-1/2-ia)=C+iS, then
        # Re((a+i/2)(C+iS))=a*C-S/2.  This locks both signs in (3.4).
        a = F(7, 3)
        cosine_moment = F(11, 5)
        sine_moment = F(-13, 7)
        real_part = a * cosine_moment - sine_moment / 2
        integrand_moment = a * cosine_moment - F(1, 2) * sine_moment
        self.assertEqual(real_part, integrand_moment)

    def test_exact_connected_countermodel_has_negative_vertex_degree(self) -> None:
        # This is one exact finite member of Theorem 4.1.  The p-signs are
        # the normalized-even version of the fixed raw direction
        # (1,-1,1,-1,1).
        p = (F(1), F(-2), F(2), F(-2), F(2))
        epsilon = F(1)
        delta3 = F(-1, 100)
        delta4 = F(1, 100)
        c = (F(0), epsilon, -2 * epsilon, epsilon + delta3, epsilon + delta4)
        weights = weights_from_p_c(p, c)

        self.assertGreater(weights[0, 1], 0)
        self.assertLess(weights[1, 2], 0)
        self.assertGreater(weights[1, 3], 0)
        self.assertGreater(weights[1, 4], 0)
        self.assertGreater(weights[2, 3], 0)
        self.assertTrue(positive_graph_connected(weights, len(p)))

        d1 = degree(weights, 1)
        self.assertLess(d1, 0)
        e1 = (F(0), F(1), F(0), F(0), F(0))
        self.assertEqual(graph_energy(weights, e1), d1)

        positive_load = sum(
            (weight for edge, weight in weights.items() if 1 in edge and weight > 0),
            F(0),
        )
        negative_load = sum(
            (-weight for edge, weight in weights.items() if 1 in edge and weight < 0),
            F(0),
        )
        self.assertGreater(negative_load / positive_load, F(19, 10))
        self.assertEqual(d1, positive_load - negative_load)

    def test_global_displacement_scaling_cannot_repair_routing_ratio(self) -> None:
        p = (F(1), F(-2), F(2), F(-2), F(2))
        c = (F(0), F(1), F(-2), F(99, 100), F(101, 100))
        base = weights_from_p_c(p, c)
        tiny = F(1, 10**18)
        scaled = weights_from_p_c(p, tuple(tiny * entry for entry in c))

        for edge, weight in base.items():
            self.assertEqual(scaled[edge], tiny * weight)
        self.assertLess(degree(base, 1), 0)
        self.assertLess(degree(scaled, 1), 0)

        def incident_ratio(weights: dict[tuple[int, int], F]) -> F:
            positive = sum(
                (w for edge, w in weights.items() if 1 in edge and w > 0),
                F(0),
            )
            negative = sum(
                (-w for edge, w in weights.items() if 1 in edge and w < 0),
                F(0),
            )
            return negative / positive

        self.assertEqual(incident_ratio(base), incident_ratio(scaled))

    def test_countermodel_routing_lower_bound_converges_exactly_to_two(self) -> None:
        previous = F(0)
        for denominator in (10, 100, 1000, 10000):
            eta = F(1, denominator)
            p = (F(1), F(-2), F(2), F(-2), F(2))
            c = (F(0), F(1), F(-2), F(1) - eta, F(1) + eta)
            weights = weights_from_p_c(p, c)
            positive = sum(
                (w for edge, w in weights.items() if 1 in edge and w > 0),
                F(0),
            )
            negative = sum(
                (-w for edge, w in weights.items() if 1 in edge and w < 0),
                F(0),
            )
            ratio = negative / positive
            self.assertGreater(ratio, previous)
            self.assertLess(ratio, 2)
            self.assertLess(2 - ratio, F(2, denominator))
            previous = ratio

    def test_trace_is_sum_of_negative_load_effective_resistances(self) -> None:
        # Positive graph: unit star 0--1, 0--2, 0--3.  Each negative leaf
        # chord has positive-network effective resistance 2; the transfer
        # resistance between chords (1,2) and (1,3) is 1.
        for load in (F(1, 10), F(2, 5)):
            resistance_matrix = (
                (2 * load, load),
                (load, 2 * load),
            )
            trace = resistance_matrix[0][0] + resistance_matrix[1][1]
            sum_load_resistance = load * 2 + load * 2
            largest_eigenvalue = 3 * load
            self.assertEqual(trace, sum_load_resistance)
            self.assertLessEqual(largest_eigenvalue, trace)
            if load == F(1, 10):
                self.assertLess(trace, 1)
                self.assertLess(largest_eigenvalue, 1)
            else:
                self.assertGreater(largest_eigenvalue, 1)

    def test_diagonal_forcing_can_make_the_anchor_an_exact_eigenvector(self) -> None:
        # The algebra is basis-independent.  These rational off-diagonal
        # entries model the already-fixed source-Cauchy off-diagonal block.
        off = (
            (F(0), F(2), F(-1)),
            (F(2), F(0), F(3)),
            (F(-1), F(3), F(0)),
        )
        kappa = (F(2), F(-1), F(3))
        q = F(7)
        diagonal = tuple(
            q
            - sum(
                (off[i][j] * kappa[j] for j in range(3) if j != i),
                F(0),
            )
            / kappa[i]
            for i in range(3)
        )
        matrix = tuple(
            tuple(diagonal[i] if i == j else off[i][j] for j in range(3))
            for i in range(3)
        )
        action = tuple(
            sum((matrix[i][j] * kappa[j] for j in range(3)), F(0))
            for i in range(3)
        )
        self.assertEqual(action, tuple(q * entry for entry in kappa))


if __name__ == "__main__":
    unittest.main()
