#!/usr/bin/env python3
"""Exact finite sanity checks for ARITHMETIC_FAMILY.md.

These checks do not prove the universal statements, audit Lean, or verify RH.
The mathematical proofs are in the companion report. Every numerical
comparison here is over integers or Fraction; no floating-point tolerance.
"""

from fractions import Fraction as F
from itertools import product, permutations
from pathlib import Path
import json
import random


def prod(xs):
    out = F(1)
    for x in xs:
        out *= x
    return out


def coordinate_weight(x, s, f):
    # Rational integers embedded diagonally at all f CM-type places.
    return max(F(1), F(abs(x), 1) / s) ** (-3 * f)


def support_tests():
    cases = point_count = zero_points = 0
    values = (-2, -1, 0, 1, 2)
    for r in range(0, 6):
        for j in range(r + 1):
            base = list(product(values, repeat=j))
            for f in (1, 2, 3):
                scales = tuple(F(l + 1, 2) for l in range(1, j + 1))
                # Full products and sparse subsets exercise the projection bound.
                subsets = [base, base[::2], base[::3], []]
                for points in subsets:
                    cases += 1
                    seqs = [(1,) + x + (0, 0) for x in points]
                    assert len(seqs) == len(set(seqs))
                    projection = {seq[1:j+1] for seq in seqs}
                    assert len(projection) == len(seqs)
                    left = F(0)
                    mid = F(0)
                    for x in points:
                        point_count += 1
                        if 0 in x or j == 0:
                            zero_points += 1
                        active = [l for l in range(j) if x[l] != 0]
                        support_weight = prod(coordinate_weight(x[l], scales[l], f) for l in active)
                        all_weight = prod(coordinate_weight(x[l], scales[l], f) for l in range(j))
                        assert support_weight == all_weight
                        sigma = max([F(1)] + [F(abs(x[l]), 1) / scales[l] for l in active])
                        kernel_weight = sigma ** (-3 * r * f)
                        assert kernel_weight <= all_weight
                        left += kernel_weight
                        mid += all_weight
                    if not points:
                        # Product over an empty coordinate set equals 1; empty
                        # label sets still satisfy the desired upper bound.
                        right = F(1) if j == 0 else F(0)
                    else:
                        right = prod(
                            sum((coordinate_weight(t, scales[l], f) for t in {x[l] for x in points}), F(0))
                            for l in range(j)
                        )
                    assert left <= mid <= right
    return {"cases": cases, "points": point_count, "points_with_zero_coordinates": zero_points}


def negative_controls():
    # Finsets of DISTINCT full sequences, with identical first j coordinates.
    # Relaxing either the fixed coordinate zero or the zero tail breaks the
    # projection argument; it would count one projected point twice.
    bad_initial = [(1, 0, 0), (2, 0, 0)]
    bad_tail = [(1, 0, 0), (1, 0, 1)]
    for seqs in (bad_initial, bad_tail):
        assert len(set(seqs)) == 2
        assert len({seq[1:2] for seq in seqs}) == 1
        label_sum = sum((coordinate_weight(seq[1], F(1), 1) for seq in seqs), F(0))
        projected_sum = sum((coordinate_weight(t, F(1), 1) for t in {seq[1] for seq in seqs}), F(0))
        assert label_sum == 2 and projected_sum == 1
        assert not label_sum <= projected_sum
    # An actual multiset duplicate would likewise invalidate the sum bound.
    duplicate_rows = [(1, 0, 0), (1, 0, 0)]
    assert len(duplicate_rows) > len(set(duplicate_rows))
    return {"missing_fixed_initial_counterexample": True,
            "missing_zero_tail_counterexample": True,
            "duplicate_rows_detected": True}


def ga_add(x, y):
    return (x[0] + y[0], x[1] + y[1])


def ga_mul(x, y):
    return (x[0]*y[0] - x[1]*y[1], x[0]*y[1] + x[1]*y[0])


def ga_conj(x):
    return (x[0], -x[1])


def herm(x, y):
    out = (0, 0)
    for a, b in zip(x, y):
        out = ga_add(out, ga_mul(ga_conj(a), b))
    return out


def ga_det(mat):
    out = (0, 0)
    n = len(mat)
    for p in permutations(range(n)):
        inversions = sum(p[a] > p[b] for a in range(n) for b in range(a+1, n))
        term = (-1 if inversions % 2 else 1, 0)
        for i in range(n):
            term = ga_mul(term, mat[i][p[i]])
        out = ga_add(out, term)
    return out


def gaussian_minor_tests():
    rng = random.Random(20261121)
    minors = []
    for _ in range(60):
        left = [[(rng.randrange(-3, 4), rng.randrange(-3, 4)) for _ in range(4)] for _ in range(3)]
        right = [[(rng.randrange(-3, 4), rng.randrange(-3, 4)) for _ in range(4)] for _ in range(3)]
        mat = [[herm(a, b) for b in right] for a in left]
        for l in (1, 2, 3):
            z = ga_det([row[:l] for row in mat[:l]])
            assert all(isinstance(t, int) for t in z)
            if z != (0, 0):
                assert ga_mul(z, ga_conj(z)) == (z[0]**2 + z[1]**2, 0)
                assert z[0]**2 + z[1]**2 >= 1
            minors.append(z)
    differences = 0
    unique = list(set(minors))
    for a, b in zip(unique, unique[1:]):
        z = (a[0]-b[0], a[1]-b[1])
        assert z != (0, 0)
        assert z[0]**2 + z[1]**2 >= 1
        differences += 1
    return {"integral_gaussian_minors": len(minors), "nonzero_label_differences": differences}


def exponent_tests():
    identities = estimates = 0
    for r in range(0, 81):
        for j in range(r + 1):
            es = [sum(r + 1 - a for a in range(1, l+1)) for l in range(1, j+1)]
            assert all(e == F(l*(2*r+1-l), 2) for l, e in enumerate(es, 1))
            assert sum(es) == F(j*(j+1)*(3*r+1-j), 6)
            identities += 1
    for m in range(2, 13):
        for r in range(1, m+1):
            for j in range(r+1):
                for f, cl, ch in product((1, 3), (F(1, 3), F(1), F(5, 2), F(7)), (F(0), F(1, 2), F(-3))):
                    left = 6*f*j + 4/cl*f*j*r*r + 4*f*r*j*(1+abs(ch)*m)
                    right = (4+4/cl+4*abs(ch))*f*m*m*r
                    assert left <= right
                    estimates += 1
    return {"exact_frame_exponent_identities": identities, "rational_cost_coarsenings": estimates}


def dimension_window_tests():
    cases = 0
    for f in range(1, 9):
        for k in range(1, 13):
            if 2*f > 2**k:
                continue
            n = f*k
            for t, c in product((2, 3, 5), (F(0), F(1, 2), F(1))):
                y = F(t, 1)/(1+c/n)
                assert y <= t <= y*(1+F(1, n))
                ratio = F((t**k-1)**f, 1)/(y**n)
                assert F(1, 2) <= ratio <= (1+F(1, n))**n
                cases += 1
    return {"exact_dimension_window_cases": cases,
            "upper_bound_checked": "(1+1/(f*k))^(f*k); the standard <=e inequality is proved in prose"}


def main():
    results = {
        "status": "all_exact_sanity_checks_passed",
        "scope": "Finite rational/integer checks only; not Lean replay, a proof of universal statements, or RH verification.",
        "zero_support_extension": support_tests(),
        "necessary_injectivity_controls": negative_controls(),
        "cm_integral_minor_examples": gaussian_minor_tests(),
        "logarithmic_cost_algebra": exponent_tests(),
        "dimension_window": dimension_window_tests(),
    }
    destination = Path(__file__).with_name("arithmetic_compression_checks.json")
    destination.write_text(json.dumps(results, indent=2) + "\n")
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
