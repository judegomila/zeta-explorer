#!/usr/bin/env python3
"""models.py -- exponent models for row order r and dual-length exponent a (HEURISTIC models, exact/numerical inside).

(A) Framework A, model A-V of tmp/cubic-r2-1-frameworkA.py with 3 -> r in the multiplicity and the amplifier.
(B) Framework B, constraint set of tmp/cubic-r2-2-refB.py (runB) with k = r.
(C) Exact identities: effective order, thresholds against B_XS = 17497733/20000000.
"""
from fractions import Fraction as F
import itertools, sys
import numpy as np
from scipy.optimize import minimize

BXS = F(17497733, 20000000)

def a_rule(r):
    """dual-length exponent of the absorbed dual (see RESULT.md section 3)."""
    if r == 6: return 2, 'Patterson cubic theta, GL(2) [theorem, 7/8 paper Prop 5.1]'
    if r % 4 == 0: return 1 + r // 2, '%d-fold Kubota series, index h^%d' % (r, 1 + r // 2)
    if r % 2 == 1: return r + 1, '%d-fold Kubota series, index h^%d' % (2 * r, r + 1)
    return 2, 'order-%d Gauss sums x quadratic twist: no known FE; a = 2 is the floor' % (r // 2)

def theta_A(r, a, c, lam):
    Hs = 2 - lam
    cand = {F(0), Hs}
    lr = [(F(1), F(0)), (F(a), F(-1)), (c * (a + 1), -c)]
    ld = [(F(1), F(0)), (F(0), F(1)), (c, c)]
    for L in (lr, ld, lr + ld):
        for (s1, i1), (s2, i2) in itertools.combinations(L, 2):
            if s1 != s2:
                x = (i2 - i1) / (s1 - s2)
                if 0 <= x <= Hs: cand.add(x)
    def f(x):
        return (Hs - x) / r + 1 + min(max(s * x + i for s, i in lr), max(s * x + i for s, i in ld))
    worst = max(f(x) for x in cand)
    E = max(1 + lam, lam - 1 + worst)
    return max(E - lam / r, 2 - 2 * lam / r) / 2

def best_A(r, a, c):
    return min((theta_A(r, a, c, F(k, 240)), F(k, 240)) for k in range(1, 480))

Z0 = 17 / 50
def runB(a, k, pen_on=True):
    alpha = 1 - 1 / k; cfac = 2 / (k * 0.75)
    Dg, Xg = np.meshgrid(np.linspace(1e-5, min(0.75, alpha - 1e-6), 700), np.linspace(0, 0.5, 101))
    Dx = 3 - (1 + 2 * cfac) * Xg; Px = (1 - Xg) * (2 - 2 * cfac * Xg)
    J = (alpha - Dg) * Dx + Dg * Px; RX = (alpha - Dg) * Dg * Px / (2 * J)
    def pen(M, ell):
        if not pen_on or a == 2: return 0.0
        Td = a * M + (a - 1) * ell - 1
        return max(0.0, Td - M, (2 / 3) * (M + Td) - M) / 2
    def s0(p):
        lx, b, ell = p; h = 1 - lx + ell; M = 2 * lx + b
        return 1 - h / k + b / (2 * k) + max(0.0, (1 + 3 * ell - 2 * M) / 8) + pen(M, ell)
    def cons(p):
        lx, b, ell = p; h = 1 - lx + ell; ly = lx + b; M = 2 * lx + b; sg = s0(p); aa = (1 + Dg) / 2
        Eh = aa - sg - h / k - aa * ly - ell / 2 + Xg * Dg * ell + h * (1 - Dg + RX + Dg / 2)
        E12 = aa - sg + h * (Z0 - 1 / k) - aa * ly - ell / 2 + Xg * Dg * ell + 0.5 * (76 / 75 - 2 * Dg / 3 + Dg / 2 - Z0)
        return np.array([1 - (M + ell), ly - ell - 11 * b / 6, -Eh.max(), ell / h - (2 - cfac) / (2 * (5 - 2 * cfac)),
                         -(h * (Z0 - 1 / k) - ly / 2), -E12.max(), b, ell, lx - ell])
    best = None
    starts = [(17/48, 1/8, 1/6), (0.30, 0.10, 0.18), (0.25, 0.05, 0.2), (0.4, 0.15, 0.15), (0.2, 0.1, 0.25),
              (0.28, 0.06, 0.07), (0.3, 0.02, 0.05), (0.25, 0.12, 0.08), (0.33, 0.0, 0.0), (0.22, 0.2, 0.1),
              (0.15, 0.02, 0.05), (0.12, 0.05, 0.1), (0.1, 0.0, 0.02)]
    for st in starts:
        try:
            res = minimize(s0, np.array(st), constraints=[{'type': 'ineq', 'fun': cons}], method='SLSQP',
                           options={'ftol': 1e-12, 'maxiter': 1000})
        except Exception: continue
        if cons(res.x).min() >= -1e-7:
            v = s0(res.x)
            if best is None or v < best[0]: best = (v, res.x)
    return best

if __name__ == '__main__':
    print('B_XS =', BXS, '=', float(BXS))
    print('\n(C) exact identities')
    for r in range(2, 13):
        # sigma0 = 1 - (1+3 ell)/(2r) on the L1-tight family (a = 2): slot length needed to reach B_XS
        ell_need = (2 * r * (1 - BXS) - 1) / 3
        cap = 1 - F(4, 5 * r)
        print('  r=%-2d  PartI ceiling 1-1/(2r)=%-6s  ell needed for B_XS: %-22s = %+.6f   L1&L2 low cap 1-4/(5r)=%s=%.5f  %s'
              % (r, 1 - F(1, 2 * r), ell_need, float(ell_need), cap, float(cap), 'cap < B_XS' if cap < BXS else 'cap >= B_XS: excluded'))
    print('  effective order r_eff = r/(1+3 ell): sextic at ell=1/6 ->', F(6) / (1 + F(3, 6)),
          '; at ell_XS=2506801/15000000 ->', float(F(6) / (1 + 3 * F(2506801, 15000000))))
    print('\n(A) Framework A (model A-V, order r, dual exponent a, cross exponent c): min over lambda, exact')
    print('  r   a   c=1/2 [theta, lambda]       c=2/3 [theta, lambda]      source of a')
    for r in (3, 4, 5, 6, 7, 8, 9, 10, 12):
        a, src = a_rule(r)
        t1 = best_A(r, a, F(1, 2)); t2 = best_A(r, a, F(2, 3))
        print('  %-3d %-3d %-10s=%.5f @%-6s   %-10s=%.5f @%-6s  %s' % (r, a, t1[0], float(t1[0]), t1[1], t2[0], float(t2[0]), t2[1], src))
    print('  hypothetical a = 2 at every order (c = 1/2):')
    for r in (3, 4, 5, 6, 7, 8, 10, 12):
        t = best_A(r, 2, F(1, 2)); print('    r=%-2d theta_A=%s=%.5f at lambda=%s' % (r, t[0], float(t[0]), t[1]))
    sys.stdout.flush()
    print('\n(B) Framework B model (runB): order r, dual exponent a')
    for r in (3, 4, 5, 6, 7, 8, 10, 12):
        a, src = a_rule(r)
        for aa in sorted({2, a}):
            res = runB(aa, r)
            tag = 'actual a' if aa == a else 'hypothetical a=2'
            if res is None: print('  r=%-2d a=%-2d (%s): infeasible' % (r, aa, tag))
            else:
                v, p = res
                print('  r=%-2d a=%-2d (%-16s): sigma0=%.5f  (lx,b,ell)=(%.4f,%.4f,%.4f)  %s' % (r, aa, tag, v, p[0], p[1], p[2], 'BELOW B_XS' if v < float(BXS) else '>= B_XS'))
        sys.stdout.flush()
