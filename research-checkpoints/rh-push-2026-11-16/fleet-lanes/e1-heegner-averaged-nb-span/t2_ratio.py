# Test 2: Nyman-Beurling ratio R(span) = e^{a} min E_mu|A_x|^2/|A_x(1)|^2 over degree-0 x in the span of class traces,
# a = log(sqrt(Dmax)/2).  Gram matrix truncated at |t|<=T: G_T <= G, so every number is a LOWER bound for the true ratio.
import numpy as np, flint, math, json, sys
from hlib import *
parts = sys.argv[1:]
zs = [np.load(p) for p in parts]
ts = np.concatenate([z['ts'] if i == 0 else z['ts'][1:] for i, z in enumerate(zs)])
Lv = np.concatenate([z['L'] if i == 0 else z['L'][:, 1:] for i, z in enumerate(zs)], axis=1)
Z1 = np.concatenate([z['Z1'] if i == 0 else z['Z1'][1:] for i, z in enumerate(zs)])
Z2 = np.concatenate([z['Z2'] if i == 0 else z['Z2'][1:] for i, z in enumerate(zs)])
Ds = [int(d) for d in zs[0]['Ds']]
h = ts[1] - ts[0]; assert np.allclose(np.diff(ts), h)
s = 0.5 + 1j * ts
F = np.array([(math.sqrt(-D) / 2) ** s * Lv[k] * Z1 / Z2 for k, D in enumerate(Ds)])   # trace amplitudes, u = 1
F[:, 0] = 0.0
# residue functional p_D = b_D(1), value functional v_D = b_D'(1)/zeta(2)
flint.ctx.prec = 200
p = []; v = []
for D in Ds:
    e = flint.arb(10) ** (-20)
    L1 = chi(D).l(flint.acb(1)); dL = (chi(D).l(flint.acb(1) + e) - chi(D).l(flint.acb(1) - e)) / (2 * e)
    r = math.sqrt(-D) / 2
    p.append(r * float(L1.real)); v.append((r * math.log(r) * float(L1.real) + r * float(dL.real)) / (math.pi ** 2 / 6))
flint.ctx.prec = 53
p = np.array(p); v = np.array(v)

def gram(T):
    n = int(round(T / h)); n -= n % 2
    w = np.ones(n + 1); w[1:-1:2] = 4; w[2:-1:2] = 2; w *= h / 3
    wt = w / (np.pi * (0.25 + ts[:n + 1] ** 2))
    Fn = F[:, :n + 1]
    return (Fn * wt) @ Fn.conj().T

def solve(G, idx, cut=1e-11):
    idx = list(idx); G = G[np.ix_(idx, idx)].real; pp = p[idx]; vv = v[idx]
    a = math.log(math.sqrt(max(-Ds[i] for i in idx)) / 2)
    # null space of p
    U, S, Vt = np.linalg.svd(pp[None, :]); N = Vt[1:].T
    Gn = N.T @ G @ N; vn = N.T @ vv
    ev, V = np.linalg.eigh(Gn)
    keep = ev > cut * ev.max()
    y = V[:, keep] @ ((V[:, keep].T @ vn) / ev[keep])
    q = vn @ y            # = v' G^-1 v
    c = N @ y / q         # minimiser, v.c = 1
    R0 = float(c @ G @ c)
    return dict(n=len(idx), a=a, R0=R0, R=math.exp(a) * R0, c1=float(np.abs(c).sum()), kept=int(keep.sum()), c=c.tolist())

out = {}
Tmax = ts[-1]
for T in [t for t in (50, 100, 200, 300, 400) if t <= Tmax + 1e-9]:
    G = gram(T)
    rows = []
    for X in [8, 11, 15, 20, 24, 40, 60, 80, 100, 130, 160, 200]:
        idx = [i for i, D in enumerate(Ds) if -D <= X]
        for cut in (1e-11, 1e-8):
            r = solve(G, idx, cut); r.update(X=X, cut=cut, T=T); rows.append(r)
        r = rows[-2]
        print(f"T={T:4.0f} X={X:4d} n={r['n']:3d} R0={r['R0']:.6g} R=e^a R0={r['R']:.6g} |c|_1={r['c1']:.3g} kept={r['kept']}   [cut 1e-8: R={rows[-1]['R']:.6g} |c|_1={rows[-1]['c1']:.3g}]", flush=True)
    # windows of discriminants near the top (small mean-type penalty)
    for lo, hi in [(100, 200), (150, 200), (180, 200), (50, 100), (20, 40)]:
        idx = [i for i, D in enumerate(Ds) if lo <= -D <= hi]
        r = solve(G, idx); r.update(window=[lo, hi], T=T); rows.append(r)
        print(f"T={T:4.0f} window {lo}-{hi} n={r['n']} R0={r['R0']:.6g} R={r['R']:.6g} |c|_1={r['c1']:.3g}", flush=True)
    # control: the pair tau_-7 - tau_-8 and all pairs
    i7, i8 = Ds.index(-7), Ds.index(-8)
    r = solve(G, [i7, i8]); r.update(pair=[-7, -8], T=T); rows.append(r)
    print(f"T={T:4.0f} pair (-7,-8): R0={r['R0']:.6g} R={r['R']:.6g}", flush=True)
    best = min(((solve(G, [i, j])['R'], Ds[i], Ds[j]) for i in range(len(Ds)) for j in range(i)), key=lambda z: z[0])
    print(f"T={T:4.0f} best pair: R={best[0]:.6g} D={best[1:]}", flush=True)
    rows.append(dict(best_pair=best, T=T))
    out[str(T)] = rows
    np.save(f'gram_T{int(T)}.npy', G)
json.dump(dict(Ds=Ds, p=p.tolist(), v=v.tolist(), results=out), open('t2_ratio.json', 'w'))
