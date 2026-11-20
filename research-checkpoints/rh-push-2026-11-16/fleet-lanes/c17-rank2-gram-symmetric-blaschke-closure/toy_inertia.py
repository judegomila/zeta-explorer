# Inertia of the exact 3 x 3 form H(a1,a2) of Theorem T (toy_exact.json) on each region, for real pairs and for conjugate pairs a = A +- i g.
import json, sympy as sp
d = json.load(open('toy_exact.json'))
a1, a2 = sp.symbols('a1 a2')
H = sp.Matrix(3, 3, lambda i, j: sp.sympify(d['H'][i][j], locals={'a1': a1, 'a2': a2}))
def inertia(Hn):
    ev = [sp.re(sp.N(e, 30)) for e in Hn.eigenvals(multiple=True)]
    tol = sp.Float(10)**-18*max([abs(e) for e in ev] + [1])
    return (sum(1 for e in ev if e > tol), sum(1 for e in ev if e < -tol), sum(1 for e in ev if abs(e) <= tol))
out = []
R = sp.Rational
cases = [('real, both left', R(1, 4), R(1, 8), 2), ('real, both right', R(3, 4), R(7, 8), 0), ('real, left+right, sum > 1', R(1, 4), R(7, 8), 1),
         ('real, left+right, sum < 1', R(1, 8), R(5, 8), 1), ('real, symmetric', R(1, 5), R(4, 5), 0), ('real, symmetric', R(2, 5), R(3, 5), 0),
         ('real, one at 1/2, other right', R(1, 2), R(3, 4), 0), ('real, one at 1/2, other left', R(1, 2), R(1, 4), 1), ('real double at 1/2', R(1, 2), R(1, 2), 0)]
for (A, g) in [(R(1, 5), 3), (R(2, 5), R(1, 10)), (R(1, 20), 40), (R(9, 20), 1)]:
    cases.append(('conjugate pair, Re a = %s < 1/2, Im a = %s' % (A, g), A + sp.I*g, A - sp.I*g, 2))
for (A, g) in [(R(3, 5), 3), (R(11, 20), R(1, 10)), (R(9, 10), 40), (R(3, 2), 2), (R(5, 2), 1)]:
    cases.append(('conjugate pair, Re a = %s > 1/2, Im a = %s' % (A, g), A + sp.I*g, A - sp.I*g, 0))
for (g,) in [(3,), (R(1, 10),), (40,)]:
    cases.append(('conjugate pair on the line, Im a = %s' % g, R(1, 2) + sp.I*g, R(1, 2) - sp.I*g, 0))
for name, x, y, pred in cases:
    Hn = H.subs({a1: x, a2: y}).applyfunc(lambda e: sp.nsimplify(sp.simplify(sp.expand(e))))
    assert all(sp.im(e) == 0 for e in Hn)
    p, n, z = inertia(Hn)
    print('%-52s positive %d negative %d zero %d   predicted negative %d' % (name, p, n, z, pred)); out.append(dict(case=name, pos=p, neg=n, zero=z, predicted_neg=pred))
# the form in kappa = a1 + a2, m = a1 a2
k, m = sp.symbols('kappa m')
H33 = sp.factor(sp.symmetrize(sp.expand(H[2, 2]), a1, a2, formal=True)[0].subs({sp.Symbol('s1'): k, sp.Symbol('s2'): m}))
print('H_33 in (kappa, m):', H33)
det2 = sp.factor(sp.symmetrize(sp.expand(H.extract([0, 1], [0, 1]).det()), a1, a2, formal=True)[0].subs({sp.Symbol('s1'): k, sp.Symbol('s2'): m}))
print('det of the {1, I2} block in (kappa, m):', det2)
H22 = sp.factor(sp.symmetrize(sp.expand(H[1, 1]), a1, a2, formal=True)[0].subs({sp.Symbol('s1'): k, sp.Symbol('s2'): m}))
print('H_22 in (kappa, m):', H22)
json.dump(dict(cases=out, H33=str(H33), det2=str(det2), H22=str(H22)), open('toy_inertia.json', 'w'), indent=1)
