#!/usr/bin/env python3
"""strata_class.py -- on the round-1 data (N(m) <= 3199): for each fine stratum (v_lambda(m), v_2(m)) of generic rows, the
response z2[class(c), sigma] of S_sigma(c) = sum_m rho_sigma(-e0 m) chi_c(m) projected on pred = gamma_1(c) conj chi_c(-e0),
for conductors N(c) <= 1000 (no estimator self-term). Finds the resonant class sigma*(c) = class(c) * tau(stratum)."""
import sys, math, numpy as np
SX = 'tmp/sextic'
R1 = 'tmp/research-2026-11-16/push/tro6-numerics/'
sys.path.insert(0, SX)
import alib as A, zomega as Z
d = np.load(R1 + 'rows_full.npz'); cd = np.load(R1 + 'data/conductors.npz'); E = np.load(R1 + 'E.npy', mmap_mode='r')
rho = d['rho_str'] + d['rho_cor']; fl = d['flags']; six = d['six']; Nm = d['Nm']
cN = cd['cN']; cna = cd['cna']; cnb = cd['cnb']
T = A.SFTable(SX + '/data/sf_1e7.npz')
sm = np.flatnonzero(T.N <= 100000)
lut = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(T.na[sm], T.nb[sm]))}
sel = np.flatnonzero((cN > 1) & (cN <= 1000))
node = sm[[lut[(int(cna[i]), int(cnb[i]))] for i in sel]]
g1 = T.g1[node]; m4 = T.m4[node].astype(int)
ne0 = Z.mul((2, 0), Z.power(Z.LAM, 5)); ee0 = T.node_exponents(ne0)[node]
Z6 = Z.ZETA6; LUT = np.concatenate([Z6, [0]])
pred = g1 * np.conj(Z6[ee0])
reps = Z.MOD4_REPS
mul = np.array([[Z.mod4_index(Z.mul(a, b)) for b in reps] for a in reps])
print("mod-4 reps:", reps)
Esel = np.asarray(E[:, sel])
ph = LUT[Esel]
gen = ~six
for (a, b) in [(0, 0), (1, 0), (2, 0), (3, 0), (0, 1), (0, 2), (0, 3), (1, 1), (1, 2), (2, 1), ('a>=1', 'b>=1'), ('not', 'cop')]:
    if a == 'a>=1': mk = gen & (fl[:, 0] >= 1) & (fl[:, 1] >= 1)
    elif a == 'not': mk = gen & ~((fl[:, 0] == 0) & (fl[:, 1] == 0))
    else: mk = gen & (fl[:, 0] == a) & (fl[:, 1] == b)
    nr = int(mk.sum())
    if nr < 30: continue
    S = rho[mk].T @ ph[mk]                       # [sigma, c]
    nrm = (np.abs(rho[mk]) ** 2).sum(0)
    proj = (S * np.conj(pred)[None, :]).real / np.sqrt(nrm)[:, None]     # signed coherent amplitude
    # for each tau: mean over c of proj at sigma = class(c)*tau
    res = []
    for t in range(12):
        v = proj[mul[m4, t], np.arange(len(sel))]
        res.append((v.mean(), v.std() / math.sqrt(len(v))))
    best = int(np.argmax([abs(r[0]) for r in res]))
    print(f"stratum v_lam={a} v_2={b}: rows {nr}; tau index: mean signed z (se) " + " ".join(f"{t}:{res[t][0]:+.2f}" for t in range(12)) + f"  | best tau={best} rep={reps[best]} z={res[best][0]:+.2f} (se {res[best][1]:.2f})")
print("\nper tau, bands [2,30],[31,100],[101,300],[301,1000]: mean z2 / alignment |sum S conj pred|/sum|S| / mean phase of S conj pred")
cNs = cN[sel]
for name, mk in [('prime to 6', gen & (fl[:, 0] == 0) & (fl[:, 1] == 0)), ('not prime to 6', gen & ~((fl[:, 0] == 0) & (fl[:, 1] == 0)))]:
    S = rho[mk].T @ ph[mk]; nrm = (np.abs(rho[mk]) ** 2).sum(0)
    print(name, int(mk.sum()))
    for t in range(12):
        s = S[mul[m4, t], np.arange(len(sel))]; z2 = np.abs(s) ** 2 / nrm[mul[m4, t]]
        out = []
        for lo, hi in [(2, 30), (31, 100), (101, 300), (301, 1000)]:
            b = (cNs >= lo) & (cNs <= hi)
            tt = (s[b] * np.conj(pred[b]))
            out.append(f"{z2[b].mean():7.2f}/{abs(tt.sum())/np.abs(tt).sum():.2f}/{np.angle(tt.sum()):+.2f}")
        print(f"  tau={t:2d} {str(reps[t]):8s} " + "  ".join(out))
