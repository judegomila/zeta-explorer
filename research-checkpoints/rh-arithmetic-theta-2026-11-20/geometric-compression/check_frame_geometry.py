#!/usr/bin/env python3
"""Exact algebra controls for FRAME_GEOMETRY.md; no numerical RH claims.

All inputs are integers, rational numbers, or explicitly algebraic numbers.
The checker uses no floating-point tolerance. Its finite examples exercise
identities, constants, degeneracies, and limits of the proposed inference;
the general mathematical proof is in the companion note.
"""

from __future__ import annotations

import json
from pathlib import Path

import sympy as s


CHECKS = []


def eq(a, b=0):
    if isinstance(a, s.MatrixBase) or isinstance(b, s.MatrixBase):
        delta = a - b
        assert all(s.simplify(x) == 0 for x in delta), delta
    else:
        assert s.simplify(a - b) == 0, (a, b)


def nonnegative(a):
    a = s.simplify(a)
    assert a.is_nonnegative is True, (a, a.is_nonnegative)


def positive(a):
    a = s.simplify(a)
    assert a.is_positive is True, (a, a.is_positive)


def hs2(a):
    return s.simplify(s.trace(a.H * a))


def projection(p):
    eq(p.H, p)
    eq(p * p, p)


def record(name, **details):
    CHECKS.append({"name": name, "passed": True, **details})


def check_complex_frame():
    """Three blocks, complex cross terms, and noncommuting projections."""
    eye = s.eye(6)
    e = [eye[:, j] for j in range(6)]
    scale = s.Rational(101, 100)
    maps = [
        scale * s.Matrix.hstack(e[0], e[1]),
        scale * s.Matrix.hstack((3 * s.I * e[1] + 4 * e[2]) / 5, e[3]),
        scale * s.Matrix.hstack(e[4], e[5]),
    ]
    projections = [s.Matrix([[1, -s.I], [s.I, 1]]) / 2, s.eye(2), s.eye(2)]
    ambient_removed = (3 * e[0] + 4 * s.I * e[2]) / 5
    pi = eye - ambient_removed * ambient_removed.H
    for p in projections + [pi]:
        projection(p)
    dimensions = [2, 2, 2]
    total, dstar = s.Integer(6), s.Integer(6)
    defect = (scale**2 - 1) ** 2
    eta, kappa, delta = s.Integer(0), s.Rational(1, 6), s.Rational(1, 6)
    alpha = 1 + eta + (1 + s.sqrt(defect)) ** 2 * dstar / total
    beta = 1 - s.sqrt(defect) - kappa - s.sqrt(kappa * defect) - s.sqrt(delta * alpha)
    positive(beta)

    grams = [[a.H * b for b in maps] for a in maps]
    for u in range(3):
        eq(hs2(grams[u][u] - s.eye(2)), defect * dimensions[u])
        for v in range(3):
            if u != v:
                nonnegative((1 + eta) * dimensions[u] * dimensions[v] / dstar - hs2(grams[u][v]))

    frame = sum((t * t.H for t in maps), s.zeros(6))
    retained = sum((t * p * t.H for t, p in zip(maps, projections)), s.zeros(6))
    compressed = pi * retained * pi
    assert frame * retained != retained * frame
    assert pi * retained != retained * pi
    eq(s.trace(frame * frame), sum(hs2(g) for row in grams for g in row))
    removed_rank = sum((s.eye(2) - p).rank() for p in projections)
    eq(removed_rank, kappa * total)
    eq((eye - pi).rank(), delta * dstar)
    nonnegative((kappa + s.sqrt(kappa * defect)) * total - s.trace(frame - retained))
    nonnegative(s.trace(frame * frame) - s.trace(retained * retained))
    nonnegative(s.sqrt(delta * alpha) * total - s.trace(retained - compressed))
    nonnegative(s.trace(compressed) - beta * total)
    nonnegative(alpha * total**2 / dstar - s.trace(compressed * compressed))

    trace, second = s.trace(compressed), s.trace(compressed * compressed)
    strong_bound = alpha * trace**2 / (beta**2 * dstar)
    source_bound = s.Integer(6) * alpha * trace**2 / (dstar * beta**2 * pi.rank())
    nonnegative(strong_bound - second)
    nonnegative(source_bound - strong_bound)
    nonnegative(trace**2 / second - beta**2 * dstar / alpha)
    eq(source_bound / strong_bound, s.Rational(6, 5))
    mean = trace / pi.rank()
    eq(hs2(compressed / mean - pi), pi.rank() * (pi.rank() * second / trace**2 - 1))
    record(
        "complex_noncommuting_frame_and_source_constants",
        ambient_dimension=6,
        retained_ambient_rank=pi.rank(),
        total_source_dimension=str(total),
        e=str(defect),
        alpha=str(alpha),
        beta=str(s.simplify(beta)),
        trace=str(trace),
        squared_trace_moment=str(second),
        source_bound_inflation="6/5",
    )


def check_diagonal_reduction():
    gamma, c0, dstar, d, x = s.symbols("gamma c0 dstar d x", positive=True)
    ef = 2 * c0 / gamma + 2 * x
    raw_bound = 2 * gamma * d**2 / dstar + 2 * x * d
    eq(ef * d - raw_bound, (2 * gamma * d / dstar) * (c0 * dstar / gamma**2 - d))
    record("eF_reduction_exact_factorization", condition="0 <= d <= C0 Dstar/Gamma^2; Gamma,Dstar > 0")


def check_sharp_source_loss():
    t = s.diag(s.sqrt(s.Rational(3, 2)), 1, 1, 1)
    p = s.diag(0, 1, 1, 1)
    defect, kappa, total = s.Rational(1, 16), s.Rational(1, 4), s.Integer(4)
    eq(hs2(t.H * t - s.eye(4)), defect * total)
    loss = s.trace(t * (s.eye(4) - p) * t.H)
    eq(loss, (kappa + s.sqrt(kappa * defect)) * total)
    record("source_rank_loss_mixed_term_is_sharp", loss=str(loss), e=str(defect), kappa=str(kappa))


def check_sharp_ambient_loss():
    retained = s.diag(2, 2, 0, 0)
    pi = s.diag(0, 0, 1, 1)
    loss = s.trace(retained) - s.trace(pi * retained * pi)
    eq(loss, s.sqrt((s.eye(4) - pi).rank()) * s.sqrt(hs2(retained)))
    record("ambient_Hilbert_Schmidt_loss_is_sharp", loss=str(loss), removed_rank=2)


def check_zero_normalization():
    weights = [s.Integer(0), s.Integer(4), s.Integer(9)]
    raw = [s.Matrix([1, s.I, 0]), s.Matrix([[1, 0], [0, 1], [s.I, 1]]), s.Matrix([1, 1, 1])]
    ps = [s.eye(1), s.diag(1, 0), s.eye(1)]
    ts = [s.zeros(*p.shape) if w == 0 else p / s.sqrt(w) for w, p in zip(weights, raw)]
    for u in range(3):
        for v in range(3):
            factor = 0 if weights[u] * weights[v] == 0 else 1 / s.sqrt(weights[u] * weights[v])
            eq(ts[u].H * ts[v], factor * raw[u].H * raw[v])
    source_q = sum(((0 if w == 0 else 1 / w) * a * p * a.H for w, a, p in zip(weights, raw, ps)), s.zeros(3))
    gram_q = sum((a * p * a.H for a, p in zip(ts, ps)), s.zeros(3))
    eq(source_q, gram_q)
    record("totalized_zero_weight_normalization", weights=[str(w) for w in weights], zero_block_map_is_zero=True)


def check_no_gap():
    q = s.diag(1, 1, 0)
    total, dstar = s.Integer(3), s.Integer(3)
    alpha, beta = s.Integer(2), s.Rational(2, 3)
    eq(s.trace(q), beta * total)
    nonnegative(alpha * total**2 / dstar - s.trace(q * q))
    assert q.det() == 0 and beta > 0
    record("positive_BF_allows_zero_eigenvalue", spectrum=[0, 1, 1], beta=str(beta))


def check_average_control():
    eye = s.eye(3)
    vectors = [eye[:, 0], eye[:, 0], eye[:, 1], eye[:, 2]]
    full = sum(hs2(vectors[u].H * vectors[v]) for u in range(4) for v in range(4) if u != v)
    sub = sum(hs2(vectors[u].H * vectors[v]) for u in range(2) for v in range(2) if u != v)
    eq(full, 2)
    eq(sub, 2)
    nonnegative(s.Rational(16, 3) - full)
    positive(sub - s.Rational(4, 3))
    positive(hs2(vectors[0].H * vectors[1]) - s.Rational(1, 3))
    record("one_family_average_does_not_control_pairs_or_subfamilies", full_sum="2 <= 16/3", subfamily_sum="2 > 4/3", duplicate_pair="1 > 1/3")


def check_indefinite_trace_control():
    n = s.symbols("n", integer=True, positive=True)
    ratio = n**2 / (n - 2) ** 2
    eq(s.limit(ratio, n, s.oo), 1)
    value = ratio.subs(n, 100)
    positive(s.Rational(21, 20) - value)
    # Spectrum is explicit: one -1, and n-1 copies of +1.
    record("near_optimal_trace_ratio_does_not_prove_PSD", dimension=100, negative_eigenvalue=-1, trace=98, second_moment=100, normalized_ratio=str(value), general_ratio_limit=1)


def check_pseudoinverse():
    ce = s.Matrix([[1, 1], [s.I, s.I], [0, 0]])
    co = s.Matrix([[1, 0], [0, 1], [1, s.I]])
    d, b, e = ce.H * ce, ce.H * co, co.H * co
    assert d.rank() == 1 < d.rows
    pinv = d.pinv()
    pi = ce * pinv * ce.H
    projection(pi)
    eq(d * pinv * b, b)
    residual = e - b.H * pinv * b
    eq(residual, co.H * (s.eye(3) - pi) * co)
    y = s.Matrix([2, 1 + s.I])
    xmin = pinv * b * y
    eq((y.H * residual * y)[0], hs2(co * y - ce * xmin))
    eq(ce.H * (co * y - ce * xmin), s.zeros(2, 1))
    record("singular_block_squared_distance_identity", even_rank=d.rank(), even_dimension=d.rows, residual_form=[str(x) for x in residual], selected_squared_distance=str((y.H * residual * y)[0].simplify()))


def check_whole_form_limit():
    eps = s.symbols("eps", positive=True)
    gram = s.diag(1, 0)
    approximation = gram - eps * s.eye(2)
    eq(approximation + eps * s.eye(2), gram)
    eq(approximation.applyfunc(lambda z: s.limit(z, eps, 0, dir="+")), gram)
    # Every eps>0 has a negative eigenvalue, while the limit is a singular Gram.
    eq(approximation[1, 1], -eps)
    record("whole_form_limit_needs_no_positive_gap", error="eps I", limiting_spectrum=[0, 1], approximants_may_be_indefinite=True)


def main():
    check_complex_frame()
    check_diagonal_reduction()
    check_sharp_source_loss()
    check_sharp_ambient_loss()
    check_zero_normalization()
    check_no_gap()
    check_average_control()
    check_indefinite_trace_control()
    check_pseudoinverse()
    check_whole_form_limit()
    report = {
        "schema_version": 1,
        "status": "all_exact_checks_passed",
        "method": "SymPy exact rational, complex, and algebraic arithmetic; no floating-point tolerance",
        "source_ref": "Deicyde/riemann-hypothesis@712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9",
        "scope": "Algebraic validation and counterexamples for FRAME_GEOMETRY.md; not a proof of arithmetic hypotheses, Lean compilation, or RH",
        "sympy_version": s.__version__,
        "check_count": len(CHECKS),
        "checks": CHECKS,
    }
    output = Path(__file__).with_name("FRAME_GEOMETRY_CHECKS.json")
    output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": report["status"], "check_count": len(CHECKS), "report": str(output)}, indent=2))


if __name__ == "__main__":
    main()
