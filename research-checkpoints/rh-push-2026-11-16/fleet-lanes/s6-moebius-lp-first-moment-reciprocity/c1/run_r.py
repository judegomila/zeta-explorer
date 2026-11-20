"""LP-R (sawtooth-blind) for zeta: minimise Main(c) + sum |c_d| (d/X)^k (b_k log(X/d) + 0.1) under phi_c >= r.
usage: run_r.py k X1,X2,... mode   (mode: 'D2.2' -> D = 2.2 sqrt X;  'T0.7' -> D = X^0.7)"""
import sys, json, math, time, numpy as np
from lp import *
from saw import Pscaled, BK
k = int(sys.argv[1]); Xs = [int(float(a)) for a in sys.argv[2].split(',')]; mode = sys.argv[3]
for X in Xs:
    t0 = time.time()
    lam = lambda_arr(X); n = np.arange(X + 1, dtype=np.float64)
    truth = float(np.sum(lam * (1 - n / X) ** k) / FACT[k]); main = X / FACT[k + 1]
    D = int(math.ceil(float(mode[1:]) * math.sqrt(X))) if mode[0] == 'D' else int(round(X ** float(mode[1:])))
    nnz = 2 * (3 * math.sqrt(X) * D + 4 * X)
    print(f"# LP-R k={k} X={X} D={D}: planned LP nnz about {nnz:.3g} ({16*nnz/1e9:.2f} GB)", flush=True)
    sysm = Sys(X, k); d = np.arange(1, D + 1, dtype=np.float64)
    lin = Pscaled(k, X, d); pen = (d / X) ** k * (BK[k] * np.log(X / d) + 0.1)
    r = solve(sysm, D, objv=lin, l1=pen)
    rec = dict(k=k, X=X, D=D, mode=mode, truth=truth, main=main, status=r['status'], time=time.time() - t0)
    if r['status'] == 0:
        c = r['c']; exact = float(np.sum(c * sysm.obj(np.arange(1, D + 1)))); sc = math.sqrt(X)
        rec.update(val=float(r['val']), robust_gap_over_sqrtX=(r['val'] - truth) / sc, excess_over_sqrtX=(r['val'] - main) / sc, true_excess_over_sqrtX=(truth - main) / sc,
                   pen_over_sqrtX=float(np.sum(np.abs(c) * pen)) / sc, exact_gap_over_sqrtX=(exact - truth) / sc, l1=float(np.abs(c).sum()), cmax=float(np.abs(c).max()),
                   rows=r['rows'], it=r['it'], worst=float(r['worst']))
    else: rec.update(msg=str(r.get('msg'))[:100])
    print(json.dumps(rec), flush=True)
