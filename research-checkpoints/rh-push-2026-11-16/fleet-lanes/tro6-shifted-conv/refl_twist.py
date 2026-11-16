"""Reflected-form check for RESULT.md section 5 (MEASURED, small scale).
After the cubic reflection the theta-row form is  sum_mu delta(mu) U(mu),  U(mu) = sum_m F(m) (mu/m)_2,
F(m) = rho_sigma(-e0 m) * zeta_m, zeta_m a unimodular product of Gauss-sum phases of m.
Proxy: m primary squarefree prime to 6, N(m) <= 796; zeta_m in {gamma_j(m), conj gamma_j(m)}, j = 1,2,3, and 1;
mu = small primary primes (quadratic twist chi_m(mu)^3) and mu = 1.
Statistic r = |U(mu)| / ||F||_2  (random phases: r ~ 1; full coherence: r = sqrt(#rows)).
"""
import sys, os, math, json
import numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import alib as A, zomega as Z
T = A.SFTable(SX + '/data/sf_1e6.npz')
d = np.load(SX + '/conj_rows_800.npz')
ms = [tuple(int(x) for x in t) for t in d['ms']]; rho = d['rho']; se = d['se']
node = {}
sel = np.flatnonzero(T.N <= 796)
for i in sel: node[(int(T.na[i]), int(T.nb[i]))] = int(i)
rows = [(k, node[m]) for k, m in enumerate(ms) if m in node]
ki = np.array([r[0] for r in rows]); ni = np.array([r[1] for r in rows])
n = len(rows); print('rows (primary sf prime to 6, N<=796):', n)
Nn = T.N[ni].astype(float)
zetas = {'1': np.ones(n, complex)}
for j, g in ((1, T.g1), (2, T.g2), (3, T.g3)):
    zetas[f'g{j}'] = g[ni]; zetas[f'cg{j}'] = np.conj(g[ni])
zetas['g1g2'] = T.g1[ni] * T.g2[ni]
zetas['g1g3'] = T.g1[ni] * T.g3[ni]
zetas['cg1g3'] = np.conj(T.g1[ni]) * T.g3[ni]
zetas['g1cg3'] = T.g1[ni] * np.conj(T.g3[ni])
zetas['g2g3'] = T.g2[ni] * T.g3[ni]
# twists: primes mu with N <= 200 (as nodes of depth 1)
pr = [int(i) for i in np.flatnonzero((T.depth == 1) & (T.N <= 200))]
tw = {'mu=1': np.ones(n)}
for i in pr:
    mu = (int(T.na[i]), int(T.nb[i]))
    e = T.node_exponents(mu)[ni].astype(int)
    tw[f'mu=N{int(T.N[i])}{mu}'] = np.where(e >= 0, (-1.0) ** np.maximum(e, 0), 0.0)
rng = np.random.default_rng(1)
out = {}
allr = []
for zn, z in zetas.items():
    best = 0; rr = []
    for s in range(12):
        F = rho[ki, s] * z
        nf = np.linalg.norm(F)
        for tn, t in tw.items():
            r = abs((F * t).sum()) / nf; rr.append(r)
    rr = np.array(rr); allr.append(rr)
    out[zn] = dict(mean_r2=float((rr ** 2).mean()), max_r=float(rr.max()))
    print(f'{zn:6s} mean r^2 = {(rr**2).mean():6.3f}   max r = {rr.max():6.3f}   (#stats {len(rr)})')
# null: random phases on F
nul = []
for it in range(300):
    ph = np.exp(2j * np.pi * rng.random(n))
    mx = 0
    for s in range(12):
        F = np.abs(rho[ki, s]) * ph; nf = np.linalg.norm(F)
        for t in tw.values():
            mx = max(mx, abs((F * t).sum()) / nf)
    nul.append(mx)
nul = np.array(nul)
print(f'null (random phases), max over 12 classes x {len(tw)} twists: median {np.median(nul):.3f}, 99% {np.quantile(nul,0.99):.3f}')
print(f'full coherence would be sqrt(n) = {math.sqrt(n):.2f}; twists = {len(tw)}')
# signal fraction of rho-hat
sf = 1 - (se[ki] ** 2).sum() / (np.abs(rho[ki]) ** 2).sum()
print(f'signal share of |rho-hat|^2 on these rows (model): {sf:.3f}')
json.dump(dict(n=n, stats=out, null_median=float(np.median(nul)), null_99=float(np.quantile(nul, 0.99)), twists=len(tw)), open('refl_twist.json', 'w'), indent=1)
