import sys, json, math, time, numpy as np
from lrlib import *
k = int(sys.argv[1]); Xs = [int(float(a)) for a in sys.argv[2].split(',')]
thetas = [float(a) for a in sys.argv[3].split(',')]
half = len(sys.argv) > 4 and sys.argv[4] == 'half'
out = []
for X in Xs:
    lam = sieve_lambda(X)
    n = np.arange(X + 1, dtype=np.float64)
    if half:
        truth = float(np.sum(lam[1:] * n[1:] ** -0.5)); main = 2 * math.sqrt(X)
    else:
        truth = float(np.sum(lam * (1 - n / X) ** k) / FACT[k]); main = X / FACT[k + 1]
    sysm = Sys(X, k, half=half)
    for th in thetas:
        D = int(round(X ** th))
        nnz_est = X * (math.log(D) + 1)
        print(f"# k={k} X={X} theta={th} D={D}: planned memory: cumulative arrays {8*(X+1)*(2*k+6)/1e9:.3f} GB, LP nnz <= {nnz_est:.3g} ({16*nnz_est/1e9:.3f} GB)", flush=True)
        t0 = time.time()
        r = solve(sysm, D)
        if r['status'] != 0: print('FAIL', r); continue
        c = r['c']; d = np.arange(1, D + 1)
        y = r['y']
        npp = (lam == 0)
        rec = dict(k=k, X=X, theta=th, D=D, half=half, val=r['val'], truth=truth, main=main, gap=r['val'] - truth,
                   excess=r['val'] - main, true_excess=truth - main, rows=r['rows'], it=r['it'], worst=float(r['worst']),
                   l1=float(np.abs(c).sum()), l1k=float(np.sum(np.abs(c) * (d / X) ** k)), l1kD=float(np.sum(np.abs(c) * (d / D) ** k)),
                   A=float(np.sum(c / d)), B=float(-np.sum(c * np.log(d) / d)), C0=float(c.sum()), cmax=float(np.abs(c).max()),
                   y_nonpp=float(y[npp].sum()), y_tot=float(y.sum()), psi=float(lam.sum()),
                   y_dev_l1=float(np.abs(y - lam).sum()),
                   y_dev_below=float(np.abs(y - lam)[: int(X / D) + 1].sum()),
                   time=time.time() - t0)
        out.append(rec)
        sc = math.sqrt(X) if not half else 1.0
        print(f"k={k} X={X:.0e} th={th} D={D} val={r['val']:.6f} truth={truth:.6f} gap={rec['gap']:.4e} gap/sqrtX={rec['gap']/sc:.4f} "
              f"exc/sqrtX={rec['excess']/sc:.4f} true_exc/sqrtX={rec['true_excess']/sc:.4f} l1={rec['l1']:.3g} l1kD={rec['l1kD']:.3g} A={rec['A']:.2e} B={rec['B']:.5f} "
              f"C0={rec['C0']:.3f} ynonpp={rec['y_nonpp']:.3g} rows={r['rows']} it={r['it']} t={rec['time']:.1f}s", flush=True)
tag = f"grid_k{k}{'_half' if half else ''}_{Xs[0]}_{Xs[-1]}"
json.dump(out, open(f"out/{tag}.json", 'w'), indent=0)
