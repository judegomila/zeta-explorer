# Pivot test: NB ratio of the Heegner trace span for |D| <= X, X up to 1000, computed in the counting variable.
#   E_mu|A_x|^2 = int_0^inf F_x(y)^2 dy/y^2,  F_x(y) = sum_D c_D N_D(sqrt|D| y/2),  N_D = counting function of the
#   coefficients of zeta(s)L(s,chi_D)/zeta(2s).  Midpoint rule on a log grid y in [y0, Y]; truncation at Y lowers the value.
import numpy as np, math, flint, json, sys
from hlib import *
from hlib import _kron
XM = int(sys.argv[1]); Y = float(sys.argv[2]); M = int(float(sys.argv[3]))
Ds = neg_fund(XM); nD = len(Ds)
N = int(math.sqrt(XM) * Y / 2) + 2
print('n_D', nD, 'N', N, 'alloc MB: F', nD * M * 4 / 1e6, ' sieve', (N + 1) * 5 / 1e6, flush=True)
assert nD * M * 4 < 4e9
y0 = 2 / math.sqrt(XM) * 0.999
edges = np.exp(np.linspace(math.log(y0), math.log(Y), M + 1)); ym = np.sqrt(edges[:-1] * edges[1:])
wq = (1 / edges[:-1] - 1 / edges[1:])                 # exact weight of dy/y^2 on each cell
primes = [p for p in range(2, N + 1) if all(p % q for q in range(2, int(p ** .5) + 1))] if N < 2000 else None
sv = np.ones(N + 1, dtype=bool); sv[:2] = False
for p in range(2, int(N ** .5) + 1):
    if sv[p]: sv[p * p::p] = False
primes = np.nonzero(sv)[0]
F = np.zeros((nD, M), dtype=np.float32)
for k, D in enumerate(Ds):
    a = np.ones(N + 1, dtype=np.int32); a[0] = 0
    for p in primes:
        p = int(p); kr = _kron(D, p)
        if kr == 1: a[p::p] *= 2
        elif kr == -1: a[p::p] = 0
        else: a[p * p::p * p] = 0
    cum = np.cumsum(a)
    F[k] = cum[np.minimum(np.floor(math.sqrt(-D) * ym / 2).astype(np.int64), N)]
    if k % 50 == 0: print('sieve', k, D, flush=True)
G = np.zeros((nD, nD))
for lo in range(0, M, 100000):
    Fc = F[:, lo:lo + 100000].astype(np.float64)
    G += (Fc * wq[lo:lo + 100000]) @ Fc.T
flint.ctx.prec = 200
p = []; v = []
for D in Ds:
    e = flint.arb(10) ** (-20)
    L1 = chi(D).l(flint.acb(1)); dL = (chi(D).l(flint.acb(1) + e) - chi(D).l(flint.acb(1) - e)) / (2 * e)
    r = math.sqrt(-D) / 2
    p.append(r * float(L1.real)); v.append((r * math.log(r) * float(L1.real) + r * float(dL.real)) / (math.pi ** 2 / 6))
p = np.array(p); v = np.array(v)
np.savez(f'ybig_{XM}.npz', G=G, p=p, v=v, Ds=np.array(Ds))
def solve(idx, cut):
    Gs = G[np.ix_(idx, idx)]; pp = p[idx]; vv = v[idx]
    a = math.log(math.sqrt(max(-Ds[i] for i in idx)) / 2)
    U, S, Vt = np.linalg.svd(pp[None, :]); Nn = Vt[1:].T
    Gn = Nn.T @ Gs @ Nn; vn = Nn.T @ vv
    ev, V = np.linalg.eigh(Gn); keep = ev > cut * ev.max()
    yv = V[:, keep] @ ((V[:, keep].T @ vn) / ev[keep]); c = Nn @ yv / (vn @ yv)
    return math.exp(a) * float(c @ Gs @ c), float(np.abs(c).sum()), int(keep.sum()), c
rows = []
for X in [20, 60, 100, 200, 300, 400, 500, 700, 1000]:
    if X > XM: continue
    idx = [i for i, D in enumerate(Ds) if -D <= X]
    r = {}
    for cut in (1e-6, 1e-5, 1e-4, 1e-3):
        R, c1, kept, c = solve(idx, cut); r[cut] = (R, c1, kept)
    print(f"X={X:5d} n={len(idx):4d}  " + '  '.join(f"cut={cut:g}: R={r[cut][0]:.4f} |c|1={r[cut][1]:.3g} kept={r[cut][2]}" for cut in r), flush=True)
    rows.append(dict(X=X, n=len(idx), res={str(k): v_ for k, v_ in r.items()}))
    R, c1, kept, c = solve(idx, 1e-4)
    top = sorted(zip(np.abs(c), [Ds[i] for i in idx], c), reverse=True)[:6]
    print('        largest |c_D| (cut 1e-4): ' + ', '.join(f"D={d}: {cc:+.3f}" for _, d, cc in top), flush=True)
json.dump(rows, open(f't6_ybig_{XM}.json', 'w'))
