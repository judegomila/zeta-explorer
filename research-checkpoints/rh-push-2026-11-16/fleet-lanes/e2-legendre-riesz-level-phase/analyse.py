import re, glob, math, json, numpy as np
from lrlib import sieve_lambda, FACT
E = {}; R = {}
for f in glob.glob('out/k*_small.log') + glob.glob('out/k*_big.log'):
    for line in open(f):
        m = re.match(r'k=(\d) X=(\S+) th=(\S+) D=(\d+) val=(\S+) truth=(\S+) gap=(\S+)', line)
        if m: E[(int(m[1]), int(float(m[2])), float(m[3]))] = dict(D=int(m[4]), val=float(m[5]), truth=float(m[6]), gap=float(m[7]))
for f in glob.glob('out/robust_*.log'):
    for line in open(f):
        m = re.match(r'R k=(\d) X=(\S+) th=(\S+) D=(\d+) val=(\S+) exc/sqrtX=(\S+) \(lin-main\)/sqrtX=(\S+) pen/sqrtX=(\S+) exact\(c\)-truth/sqrtX=(\S+)', line)
        if m: R[(int(m[1]), int(float(m[2])), float(m[3]))] = dict(D=int(m[4]), val=float(m[5]), exc=float(m[6]), lin=float(m[7]), pen=float(m[8]), ex=float(m[9]))
truth = {}
def tr(k, X):
    if (k, X) not in truth:
        lam = sieve_lambda(X); n = np.arange(X + 1) / X
        truth[(k, X)] = float(np.sum(lam * (1 - n) ** k) / FACT[k])
    return truth[(k, X)]
print("LP-E: gap/sqrt(X) = (LP value - psi_k/X^k)/sqrt X")
Xs = sorted({x for (_, x, _) in E}); ths = sorted({t for (_, _, t) in E})
for k in (0, 1, 2):
    print(f"k={k} | theta: " + " | ".join(f"{t}" for t in ths))
    for X in Xs:
        row = [f"{E[(k, X, t)]['gap'] / math.sqrt(X):.4f}" if (k, X, t) in E else "-" for t in ths]
        if any(r != "-" for r in row): print(f"  X={X:.0e} | " + " | ".join(row) + f" | true excess/sqrtX = {(tr(k, X) - X / FACT[k + 1]) / math.sqrt(X):+.4f}")
    for t in (0.3, 0.4, 0.5):
        pts = [(math.log(X), math.log(E[(k, X, t)]['gap'])) for X in Xs if (k, X, t) in E and X >= 10**4]
        if len(pts) >= 3:
            a = np.polyfit([p[0] for p in pts], [p[1] for p in pts], 1)
            print(f"  fit gap ~ X^alpha, X>=1e4, theta={t}: alpha = {a[0]:.3f}  ({len(pts)} points); proved upper bound under RH 1-theta/2 = {1 - t / 2:.3f}")
print()
print("LP-R: (robust value - X/(k+1)!)/sqrtX ; (robust value - truth)/sqrtX ; penalty/sqrtX")
for k in (0, 1, 2):
    for t in sorted({t for (kk, _, t) in R if kk == k}):
        print(f"k={k} theta={t}")
        pts = []
        for X in sorted({x for (kk, x, tt) in R if kk == k and tt == t}):
            r = R[(k, X, t)]; g = (r['val'] - tr(k, X)) / math.sqrt(X)
            pts.append((math.log(X), math.log(g)))
            print(f"  X={X:.0e} D={r['D']} excess/sqrtX={r['exc']:+.4f} robust_gap/sqrtX={g:.4f} pen/sqrtX={r['pen']:.4f} true_excess/sqrtX={(tr(k, X) - X / FACT[k + 1]) / math.sqrt(X):+.4f}")
        if len(pts) >= 4:
            a = np.polyfit([p[0] for p in pts], [p[1] for p in pts], 1)
            print(f"  fit robust_gap/sqrtX ~ X^s: s = {a[0]:+.3f}  (so robust gap ~ X^{0.5 + a[0]:.3f})")
