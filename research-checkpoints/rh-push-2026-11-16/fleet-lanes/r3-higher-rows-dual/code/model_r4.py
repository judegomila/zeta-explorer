#!/usr/bin/env python3
"""model_r4.py -- MODEL: Framework B bookkeeping (runB of ../zf-higher-rows/models.py, unchanged constraint set) with the
completed-row loss replaced by what is actually available for the absorbed class.

Loss exponent L (in the mean square, units of log Z) for rows Z^M, completed length Z, reflected length Z^Td,
Td = a M + (a-1) ell - 1:
  bgl      : reflect, then order-r sieve K + N + (KN)^(2/3)            max(0, Td - M, (2 Td - M)/3)            [models.py]
  bgl+dual : best of {direct sieve, Poisson-dual sieve} x {unreflected, reflected}; NOT valid unconditionally (repeated rows k = t^r, RESULT.md section 4); kept for the record, not quoted
  grh      : Poisson dual + square-root bound for every Moebius sum   min(max(0, 1 - M), max(0, Td - M))
  opt      : zero loss for every M (the 'a = 2' column of the earlier table)
pen = L/2 is added to sigma0 exactly where models.py adds it.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'zf-higher-rows'))
import numpy as np
from scipy.optimize import minimize
import models
BXS = float(models.BXS); Z0 = models.Z0

def loss(mode, a, M, ell):
    Td = a * M + (a - 1) * ell - 1
    if mode == 'opt': return 0.0
    bgl_ref = max(0.0, Td - M, (2 * Td - M) / 3)
    if mode == 'bgl': return bgl_ref
    if mode == 'grh': return min(max(0.0, 1 - M), max(0.0, Td - M))
    bgl_dir = max(0.0, 1 - M, (2 - M) / 3)
    dual_dir = max(0.0, 1 - 2 * M / 3)
    dual_ref = max(0.0, Td - 2 * M / 3)
    return min(bgl_ref, bgl_dir, dual_dir, dual_ref)

def runB(a, k, mode):
    alpha = 1 - 1 / k; cfac = 2 / (k * 0.75)
    Dg, Xg = np.meshgrid(np.linspace(1e-5, min(0.75, alpha - 1e-6), 400), np.linspace(0, 0.5, 61))
    Dx = 3 - (1 + 2 * cfac) * Xg; Px = (1 - Xg) * (2 - 2 * cfac * Xg)
    J = (alpha - Dg) * Dx + Dg * Px; RX = (alpha - Dg) * Dg * Px / (2 * J)
    def s0(p):
        lx, b, ell = p; h = 1 - lx + ell; M = 2 * lx + b
        return 1 - h / k + b / (2 * k) + max(0.0, (1 + 3 * ell - 2 * M) / 8) + loss(mode, a, M, ell) / 2
    def cons(p):
        lx, b, ell = p; h = 1 - lx + ell; ly = lx + b; M = 2 * lx + b; sg = s0(p); aa = (1 + Dg) / 2
        Eh = aa - sg - h / k - aa * ly - ell / 2 + Xg * Dg * ell + h * (1 - Dg + RX + Dg / 2)
        E12 = aa - sg + h * (Z0 - 1 / k) - aa * ly - ell / 2 + Xg * Dg * ell + 0.5 * (76 / 75 - 2 * Dg / 3 + Dg / 2 - Z0)
        return np.array([1 - (M + ell), ly - ell - 11 * b / 6, -Eh.max(), ell / h - (2 - cfac) / (2 * (5 - 2 * cfac)),
                         -(h * (Z0 - 1 / k) - ly / 2), -E12.max(), b, ell, lx - ell])
    best = None
    rng = np.random.default_rng(1)
    starts = [(17/48, 1/8, 1/6), (0.30, 0.10, 0.18), (0.25, 0.05, 0.2), (0.4, 0.15, 0.15), (0.2, 0.1, 0.25), (0.28, 0.06, 0.07),
              (0.3, 0.02, 0.05), (0.25, 0.12, 0.08), (0.33, 0.0, 0.0), (0.22, 0.2, 0.1), (0.15, 0.02, 0.05), (0.12, 0.05, 0.1),
              (0.1, 0.0, 0.02), (0.45, 0.05, 0.02), (0.48, 0.02, 0.0), (0.2, 0.0, 0.1), (0.18, 0.05, 0.05)]
    starts += [tuple(rng.random(3) * np.array([0.5, 0.3, 0.3])) for _ in range(25)]
    for st in starts:
        try:
            res = minimize(s0, np.array(st), constraints=[{'type': 'ineq', 'fun': cons}], method='SLSQP', options={'ftol': 1e-12, 'maxiter': 600})
        except Exception: continue
        if cons(res.x).min() >= -1e-7:
            v = s0(res.x)
            if best is None or v < best[0]: best = (v, res.x)
    return best

print('B_XS = %.8f' % BXS)
print('check: r = 6, a = 2, opt reproduces models.py:', '%.5f' % runB(2, 6, 'opt')[0])
for r, a in ((4, 3), (3, 4), (5, 6)):
    for mode in ('bgl', 'bgl+dual', 'grh', 'opt'):
        res = runB(a, r, mode)
        if res is None: print('r=%d a_FE=%d %-9s infeasible' % (r, a, mode)); continue
        v, p = res; M = 2 * p[0] + p[1]
        print('r=%d a_FE=%d %-9s sigma0 = %.5f  (lx,b,ell)=(%.4f,%.4f,%.4f)  M=%.4f  loss=%.4f  %s'
              % (r, a, mode, v, p[0], p[1], p[2], M, loss(mode, a, M, p[2]), 'BELOW B_XS' if v < BXS else '>= B_XS'))
    sys.stdout.flush()
