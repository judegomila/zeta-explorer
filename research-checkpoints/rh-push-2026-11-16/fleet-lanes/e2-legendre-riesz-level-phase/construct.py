"""Check of the explicit certificate c = mu 1_{d<=D} + eta e_1 (Theorem U): minimal eta making it feasible, its exact value, its robust value."""
import sys, math, json, numpy as np
from lrlib import *
from saw import Pscaled, BK
out = []
for k in (0, 1, 2):
    for X in (10**4, 10**5, 10**6):
        lam = sieve_lambda(X); mu = mobius(X); n = np.arange(X + 1, dtype=np.float64)
        truth = float(np.sum(lam * (1 - n / X) ** k) / FACT[k]); sysm = Sys(X, k)
        rhs = (1 - n / X) ** k / FACT[k]
        Mmax = np.abs(np.cumsum(mu)).max()
        for th in (0.3, 0.5, 0.7, 0.9):
            D = int(round(X ** th)); d = np.arange(1, D + 1)
            c = mu[1:D + 1].astype(float)
            phi = phi_all(sysm, c, D)
            e1 = np.zeros(D); e1[0] = 1.0
            f1 = phi_all(sysm, e1, D)
            defect = rhs - phi; defect[:2] = 0
            ok = f1 > 1e-300; ok[:2] = False
            assert np.all(defect[~ok][2:] <= 1e-12)
            eta = max(0.0, float((defect[ok] / f1[ok]).max()))
            c2 = c.copy(); c2[0] += eta
            V = float(np.sum(c2 * sysm.obj(d)))
            pen = float(np.sum(np.abs(c2) * (d / X) ** k * (BK[k] * np.log(X / d) + 0.1)))
            lin = float(np.sum(c2 * Pscaled(k, X, d.astype(float))))
            rec = dict(k=k, X=X, theta=th, D=D, eta=eta, eta_times_D_half=eta * math.sqrt(D), V_minus_truth=V - truth,
                       ratio_to_XlogX_over_sqrtD=(V - truth) / (X * math.log(X) / math.sqrt(D)), robust_minus_truth=lin + pen - truth, pen=pen, sqrtX=math.sqrt(X))
            out.append(rec); print(json.dumps(rec), flush=True)
json.dump(out, open('out/construct.json', 'w'), indent=0)
