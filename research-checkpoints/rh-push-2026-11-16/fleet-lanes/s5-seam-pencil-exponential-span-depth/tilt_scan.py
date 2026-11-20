"""TILT-DET majorant from on-line nodes only: first depth at which it is below 1, and its value at d = 30, as a function of N and c."""
import json, math, numpy as np, pen
ND = json.load(open('nodes.json')); out = []
for obj in ('ZETA', 'LCHI4', 'DH'):
    g = np.array(ND[obj]['online'])
    for c in (0.5, 0.25, 2.0, 20.0):
        for N in (1, 2, 5, 10, 25, 100, 400):
            if obj != 'ZETA' and (N not in (5, 100, 400) or c != 0.5): continue
            nu = np.concatenate([c - 1j * g[:N], c + 1j * g[:N]])
            f = lambda d: pen.tilt_det_log(nu, d)[0]
            lo, hi = 0.0, 1.0
            while f(hi) >= 0: hi *= 2
            for _ in range(30):
                m = (lo + hi) / 2
                if f(m) < 0: hi = m
                else: lo = m
            # sum of group delays at s = 0: sum_{i,j} Re 2/(nu_i + conj nu_j) -> the first-order condition  d > (1/2) sum_{ij} Re 2/(nu_i+conj nu_j)
            S = nu[:, None] + np.conj(nu[None, :]); dcrit = float((1 / S).real.sum())
            r = dict(obj=obj, c=c, N=N, K=2 * N, first_d_below_1=hi, d_crit_formula=dcrit, log_tilt_at_30=f(30.0), floor_at_30=-2 * c * 30)
            out.append(r); print(r, flush=True)
json.dump(out, open('tilt_scan.json', 'w'), indent=1)
