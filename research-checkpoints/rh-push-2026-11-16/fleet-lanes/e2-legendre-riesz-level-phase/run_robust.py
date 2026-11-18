"""LP-R: sawtooth-blind (robust) certificate LP.
minimise  sum_d c_d (d/X)^k P_k(X/d) + sum_d |c_d| (d/X)^k (b_k log(X/d) + 0.1)   subject to the same constraints as LP-E.
For every c the objective is >= the exact objective, so LP-R >= LP-E >= psi_k(X)/X^k."""
import sys, json, math, time, numpy as np
from lrlib import *
from saw import Pscaled, BK
k = int(sys.argv[1]); Xs = [int(float(a)) for a in sys.argv[2].split(',')]
thetas = [float(a) for a in sys.argv[3].split(',')]
out = []
for X in Xs:
    lam = sieve_lambda(X); n = np.arange(X + 1, dtype=np.float64)
    truth = float(np.sum(lam * (1 - n / X) ** k) / FACT[k]); main = X / FACT[k + 1]
    sysm = Sys(X, k)
    for th in thetas:
        D = int(round(X ** th)); d = np.arange(1, D + 1, dtype=np.float64)
        print(f"# k={k} X={X} theta={th} D={D}: planned memory: LP nnz <= {2*X*(math.log(D)+1):.3g} ({32*X*(math.log(D)+1)/1e9:.3f} GB)", flush=True)
        lin = Pscaled(k, X, d); pen = (d / X) ** k * (BK[k] * np.log(X / d) + 0.1)
        t0 = time.time()
        r = solve(sysm, D, objv=lin, l1=pen)
        if r['status'] != 0: print('FAIL', r); continue
        c = r['c']; y = r['y']
        exact = float(np.sum(c * sysm.obj(np.arange(1, D + 1))))
        rec = dict(k=k, X=X, theta=th, D=D, val=r['val'], truth=truth, main=main, excess=r['val'] - main, exact_of_c=exact,
                   lin=float(np.sum(c * lin)), penalty=float(np.sum(np.abs(c) * pen)), l1=float(np.abs(c).sum()),
                   A=float(np.sum(c / d)), B=float(-np.sum(c * np.log(d) / d)), C0=float(c.sum()), cmax=float(np.abs(c).max()),
                   nnz_c=int(np.sum(np.abs(c) > 1e-9)), y_tot=float(y.sum()), y_nonpp=float(y[lam == 0].sum()), rows=r['rows'], it=r['it'], worst=float(r['worst']), time=time.time() - t0)
        out.append(rec); sc = math.sqrt(X)
        print(f"R k={k} X={X:.0e} th={th} D={D} val={r['val']:.4f} exc/sqrtX={rec['excess']/sc:.4f} (lin-main)/sqrtX={(rec['lin']-main)/sc:.4f} pen/sqrtX={rec['penalty']/sc:.4f} "
              f"exact(c)-truth/sqrtX={(exact-truth)/sc:.4f} l1={rec['l1']:.3g} nnz={rec['nnz_c']} A={rec['A']:.2e} B-1={rec['B']-1:.2e} C0={rec['C0']:.3f} it={r['it']} worst={r['worst']:.1e} t={rec['time']:.1f}s", flush=True)
json.dump(out, open(f"out/robust_k{k}_{Xs[0]}_{Xs[-1]}.json", 'w'), indent=0)
