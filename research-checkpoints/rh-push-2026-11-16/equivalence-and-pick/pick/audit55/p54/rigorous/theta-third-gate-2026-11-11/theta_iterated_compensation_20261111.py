#!/usr/bin/env python3
"""Exact checks for the all-order Peano-kernel theorem.

The all-order argument is in the accompanying note. These finite checks
verify its factors, signs, and distinct fixed-anchor/joint-anchor claims.
No theta sign claim is inferred from sampling.
"""
import itertools
import json
import sympy as S


def run_checks():
    checks = []

    def check(name, expr):
        if S.simplify(S.expand(expr)) != 0:
            raise AssertionError(name)
        checks.append(name)

    def positive(name, value):
        value = S.factor(value)
        if not value.is_positive:
            raise AssertionError((name, value))
        checks.append(name)

    x, y, z, a, b, r = S.symbols('x y z a b r')
    alpha = S.symbols('alpha', positive=True)

    def wr(fs, var=x):
        return S.det(S.Matrix([[S.diff(f, var, i) for f in fs]
                               for i in range(len(fs))]))

    # Factor the common Gaussian before taking the polynomial determinant.
    # This validates W_m(exp[-alpha (x-s_j)^2]) at arbitrary symbolic knots.
    for m in range(1, 5):
        knots = S.symbols('s0:' + str(m))
        normalized_rows = []
        for derivative in range(m):
            row = []
            for s in knots:
                q = S.exp(-alpha * (x - s) ** 2)
                row.append(S.cancel(S.diff(q, x, derivative) / q))
            normalized_rows.append(row)
        actual = S.det(S.Matrix(normalized_rows))
        expected = (2 * alpha) ** (m * (m - 1) // 2)
        expected *= S.prod(knots[j] - knots[i]
                           for i in range(m) for j in range(i + 1, m))
        check('Gaussian_Wronskian_order_' + str(m), actual - expected)

    # A nonconstant w, with smooth source remainders specified by L h=w exp(jx).
    Y = x*x + x**3
    w = S.diff(Y, x, 2)
    hs = []
    rates = []
    for j in range(1, 4):
        h = S.integrate(S.integrate(w * S.exp(j*x) / j, x), x)
        check('source_annihilator_' + str(j),
              S.diff(h, x, 3) - S.diff(w, x) / w * S.diff(h, x, 2)
              - w * S.exp(j*x))
        hs.append(h)
        rates.append(j)
        expected = w ** (j + 1) * S.exp(sum(rates) * x)
        expected *= S.prod(rates[k] - rates[i]
                           for i in range(j) for k in range(i + 1, j))
        check('source_extended_Wronskian_' + str(j),
              wr([1, x, Y] + hs) - expected)

    # General Sylvester powers G^(m-1), not merely the previously used m=2.
    gs = [1+x, 2+x*x, 1+x**3-x]
    extensions = [x**4+x*x, x**5+x, x**6+x**3, x**7+x*x]
    G = wr(gs)
    for m in range(1, 5):
        ps = [wr(gs+[h]) for h in extensions[:m]]
        check('Sylvester_nonconstant_prefix_order_' + str(m),
              wr(ps) - G**(m-1) * wr(gs+extensions[:m]))

    # Explicit PR53 uniform-density kernel, evaluated by exact rationals.
    def pi(yy, ss):
        if ss <= yy:
            return ss**4 * (1-yy)**8 / 17280
        return yy**3 * (1-ss)**4 * (1-yy)**3 * (4*ss-yy*yy-3*yy) / 17280

    minor_values = {}
    for m in range(1, 7):
        # Strictly interlacing nodes, beyond the previously checked TP2.
        ys = [S.Rational(2*i+1, 2*m+2) for i in range(m)]
        ss = [S.Rational(2*i+2, 2*m+2) for i in range(m)]
        det = S.det(S.Matrix([[pi(yy, s) for s in ss] for yy in ys]))
        positive('uniform_interlacing_minor_order_' + str(m), det)
        minor_values[str(m)] = str(det)
    low_knots = [S.Rational(1, 8), S.Rational(1, 4), S.Rational(3, 8)]
    high_outputs = [S.Rational(1, 2), S.Rational(5, 8), S.Rational(3, 4)]
    check('uniform_rank_one_region_not_strict_TP',
          S.det(S.Matrix([[pi(yy, s) for s in low_knots]
                           for yy in high_outputs])))

    # Signed densities: individual single crossings do not fix wedge orientation.
    s1, s2 = S.symbols('s1 s2')
    density_det = S.det(S.Matrix([[s1-a, s1-b], [s2-a, s2-b]]))
    check('single_crossings_have_order_dependent_wedge',
          density_det - (b-a)*(s2-s1))

    # Next canonical source determinants. Columns are expressed in
    # the basis (TB,TJ,TP,TQ,TH) or (TB,TJ,TP,TQ,TU).
    # W4(q1',q2',q3',q4')=W5(1,q1,q2,q3,q4).
    col_H = S.Matrix([
        [1, -a, 0, 0, 0],
        [0, r, -a*r, 0, 0],
        [0, 0, 1, -a, 0],
        [0, 0, 0, r, 0],
        [0, 0, 0, 0, -a],
    ])
    check('next_H_source_column_factor', col_H.det() + a*r*r)
    col_Q = S.Matrix([
        [1, -a, 0, 0, 0],
        [0, r, -a*r, 0, 0],
        [0, 0, 1, -a, 0],
        [0, 0, 0, r, -a*r],
        [0, 0, 0, 0, 1],
    ])
    check('next_Q_source_column_factor', col_Q.det() - r*r)

    # Exact finite Cauchy--Binet analogue of the two-density integral.
    kernel = S.Matrix([[1, 2, 4], [1, 3, 9]])
    densities = S.Matrix([[-2, -3], [-1, -2], [2, 1]])
    wedge_sum = sum(kernel[:, list(js)].det() * densities[list(js), :].det()
                    for js in itertools.combinations(range(3), 2))
    check('signed_density_Cauchy_Binet', (kernel*densities).det()-wedge_sum)

    # Harmless fixed-anchor row factors need not be harmless for mixed derivatives.
    I0 = y**3 * (1-y)**8 * (y*y+2)
    Ihat = S.exp(-a*y) * I0
    mixed = S.diff(S.diff(Ihat, a)/Ihat, y)
    check('joint_anchor_gauge_counterexample', mixed + 1)

    return {
        'status': 'passed',
        'checks': len(checks),
        'check_names': checks,
        'arithmetic': 'exact symbolic and rational arithmetic',
        'uniform_kernel_minors': minor_values,
        'scope': ('Analytic TN-infinity Peano-kernel theorem; no third '
                  'canonical preservation, P6, or RH assertion.'),
    }


if __name__ == '__main__':
    if not __debug__:
        raise SystemExit('Do not use python -O for verification')
    print(json.dumps(run_checks(), indent=2))
