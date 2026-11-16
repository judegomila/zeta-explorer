#!/usr/bin/env python3
"""typeII_measure.py -- MEASURED: operator norm of the Type-II matrix K_ab = R(ab) of RESULT.md section 5.

Data (read only, from the sibling run tmp/research-2026-11-16/push/tro6-numerics): complete theta coefficients
rho_nat_sigma(-e0 m) for N(m) <= 3199 (rows_full.npz), sextic symbols chi_c(m) for all squarefree c prime to 6 with
N(c) <= 1e5 (E.npy), Gauss-sum table tmp/sextic/data/sf_1e7.npz.  The loader lines follow tro6-numerics/reso2.py.

  S(c)  = sum_{N(m) <= Q, m generic} rho_sigma(c)(-e0 m) chi_c(m)          (leave-one-out corrected as in reso2.py)
  Pt(c) = S(c) conj(gamma_1(c)) chi_c(-e0) = P_c chi_c(-e0)                (P_c = sum rho conj gt(m,c); polar part > 0)
  R(c)  = Pt(c) - kappa N(c)^(-b)   (fitted smooth polar part),  z(c) = R(c) / ||rho_sigma(c)||
  K     = (z(ab))_{a in box A, b in box B, (a,b) = 1}.
chi_ab(-e0) = chi_a(-e0) chi_b(-e0) is a separable phase, so ||K||_op is the norm of the bilinear form
sum alpha_a beta_b R(ab) in the normalisation of the Vaughan decomposition (weight Psi multiplicative; variant with the
extra sign R(a,b) is also printed).
Output: singular values against (i) the random-matrix level, (ii) an independent-phase null, (iii) the budget of (BIL).
usage: typeII_measure.py out.json
"""
import sys, math, json, numpy as np
SX = 'tmp/sextic'
ND = 'tmp/research-2026-11-16/push/tro6-numerics'
sys.path.insert(0, SX)
import alib as A, zomega as Z
rng = np.random.default_rng(1116)
def P(*a): print(*a, flush=True)
d = np.load(ND + '/rows_full.npz'); cd = np.load(ND + '/data/conductors.npz'); E = np.load(ND + '/E.npy', mmap_mode='r')
Nm = d['Nm']; rho = d['rho_str'] + d['rho_cor']; six = d['six']; n = len(Nm)
cN = cd['cN']; cna = cd['cna']; cnb = cd['cnb']; C = len(cN)
T = A.SFTable(SX + '/data/sf_1e7.npz')
sm = np.flatnonzero(T.N <= 100000)
lut = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(T.na[sm], T.nb[sm]))}
node = sm[[lut[(int(a), int(b))] for a, b in zip(cna, cnb)]]
g1 = T.g1[node]; m4 = T.m4[node].astype(int)
ne0 = Z.mul((2, 0), Z.power(Z.LAM, 5)); ee0 = T.node_exponents(ne0)[node]
Z6 = np.exp(1j * np.pi * np.arange(6) / 3); LUT = np.concatenate([Z6, [0]])
pred = g1 * np.conj(Z6[ee0])                                      # gamma_1(c) conj chi_c(-e0)
grid = A.geom_grid(1000, T.X, 90); gsh = np.searchsorted(grid.astype(np.int64), T.N, side='left')
cntT = np.bincount(gsh * 12 + T.m4.astype(np.int64), minlength=len(grid) * 12).reshape(len(grid), 12).astype(float)
a_s = np.concatenate([[0.0], grid.astype(float)[1:] ** (2 / 3) - grid.astype(float)[:-1] ** (2 / 3)])
Wt = (a_s[1:, None] ** 2 / np.maximum(cntT[1:], 1)).sum(0)
csh = np.searchsorted(grid.astype(np.int64), cN, side='left')
wt = np.where(csh >= 1, a_s[csh] / (np.maximum(cntT[csh, m4], 1) * Wt[m4]), 0.0)
gen = ~six
cidx = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(cna, cnb))}
out = {}

def spectrum(Q):
    hi = int(np.searchsorted(Nm, Q, 'right'))
    acc = np.zeros((12, C), complex); accn = np.zeros(12); cnt = np.zeros(C)
    for a in range(0, hi, 400):
        b = min(a + 400, hi); mk = gen[a:b]
        Eb = np.asarray(E[a:b])[mk]
        ph = LUT[Eb].astype(np.complex64); X = rho[a:b][mk].astype(np.complex64)
        acc += X.T @ ph; accn += (np.abs(X) ** 2).sum(0); cnt += (Eb >= 0).sum(0)
    S = acc[m4, np.arange(C)] - wt * pred * cnt
    Pt = S * np.conj(pred)
    return Pt, np.sqrt(accn[m4]), int(gen[:hi].sum())

def box(lo, hi):
    return [i for i in range(C) if lo < cN[i] <= hi]

def run(Q, shapes, tag):
    Pt, nr, rows = spectrum(Q)
    # smooth polar fit on all conductors with 30 < N(c) <= 1e5: Re Pt ~ kappa N^-b (log-log least squares on shell means)
    edges = np.geomspace(30, 1e5, 25); mid = []; mean = []
    for lo, hi in zip(edges[:-1], edges[1:]):
        s = (cN > lo) & (cN <= hi)
        if s.sum() > 5 and Pt[s].real.mean() > 0: mid.append(math.sqrt(lo * hi)); mean.append(Pt[s].real.mean())
    bfit, lk = np.polyfit(np.log(mid), np.log(mean), 1); kap = math.exp(lk)
    pol = kap * cN.astype(float) ** bfit
    z_raw = Pt / nr; z = (Pt - pol) / nr
    P(f"\n== Q = {Q}: generic rows {rows}; budget sqrt(rows) = {math.sqrt(rows):.1f}; polar fit Re Pt(c) ~ {kap:.3f} N(c)^({bfit:.3f})"
      f"  [heuristic exponent -1/3];  mean |z|^2 over all c (polar removed) = {np.mean(np.abs(z)**2):.3f},  mean Im-part share = {np.mean(z.imag**2)/np.mean(np.abs(z)**2):.3f}")
    res = {'Q': Q, 'rows': rows, 'polar_fit': [kap, bfit], 'mean_z2': float(np.mean(np.abs(z) ** 2)), 'boxes': []}
    P("   box A x box B (norm ranges)        nA   nB  dens |  s1(raw) | s1    s2    s3   | rms|z| | random-matrix rms(sqrt nA+sqrt nB) | phase-null s1 (mean+-sd) | s1 with R(a,b) | s1/budget")
    for (alo, ahi, blo, bhi) in shapes:
        ia = box(alo, ahi); ib = box(blo, bhi)
        K = np.zeros((len(ia), len(ib)), complex); Kraw = np.zeros_like(K); Rm = np.ones((len(ia), len(ib)))
        fill = 0
        for x, i in enumerate(ia):
            ai = (int(cna[i]), int(cnb[i]))
            for y, j in enumerate(ib):
                bj = (int(cna[j]), int(cnb[j]))
                k = cidx.get(Z.mul(ai, bj))
                if k is None: continue                               # (a, b) != 1, or N(ab) > 1e5
                K[x, y] = z[k]; Kraw[x, y] = z_raw[k]; Rm[x, y] = Z.Rrec(ai, bj); fill += 1
        if fill == 0: continue
        if min(K.shape) < 4: continue
        sv = np.linalg.svd(K, compute_uv=False); svr = np.linalg.svd(Kraw, compute_uv=False); svR = np.linalg.svd(K * Rm, compute_uv=False)
        rms = math.sqrt((np.abs(K) ** 2).sum() / fill)
        nul = []
        for _ in range(40):
            nul.append(np.linalg.svd(K * np.exp(2j * np.pi * rng.random(K.shape)), compute_uv=False)[0])
        rm = rms * (math.sqrt(len(ia)) + math.sqrt(len(ib)))
        P(f"   A ({alo:6.0f},{ahi:6.0f}] B ({blo:6.0f},{bhi:6.0f}]  {len(ia):4d} {len(ib):4d} {fill/K.size:.2f} | {svr[0]:8.2f} | {sv[0]:6.2f} {sv[1]:5.2f} {sv[2]:5.2f} | {rms:5.3f} | {rm:6.2f} | {np.mean(nul):6.2f} +- {np.std(nul):4.2f} | {svR[0]:6.2f} | {sv[0]/math.sqrt(rows):.3f}")
        res['boxes'].append({'A': [alo, ahi], 'B': [blo, bhi], 'nA': len(ia), 'nB': len(ib), 'fill': fill / K.size, 's_raw': svr[:3].tolist(),
                             's': sv[:5].tolist(), 'rms': rms, 'rm_level': rm, 'null_mean': float(np.mean(nul)), 'null_sd': float(np.std(nul)),
                             's1_withR': float(svR[0]), 's1_over_budget': float(sv[0] / math.sqrt(rows))})
    out[tag] = res

# manuscript scale: N(ab) ~ Q^1.4 ; admissible Type-II window Q^0.4 <= A, B <= Q.
for Q in (800, 1600, 3199):
    Cc = min(1e5, 1.3 * Q ** 1.4)
    shapes = []
    for th in (0.5, 0.4, 0.3, 0.2):                                   # A = Cc^th, B = Cc^(1-th)
        Ah = Cc ** th; Bh = Cc / Ah
        shapes.append((Ah / 2, Ah, Bh / 2, Bh))
        shapes.append((Ah / 6, Ah, Bh / 6, Bh))
    shapes.append((1, Cc ** 0.5, 1, Cc ** 0.5))                     # full (non-dyadic) square box
    P(f"\nQ = {Q}: C = {Cc:.0f} (Q^1.4 = {Q**1.4:.0f}), Q^0.4 = {Q**0.4:.1f}, Q^0.5 = {Q**0.5:.1f}")
    run(Q, shapes, f"Q{Q}")
json.dump(out, open(sys.argv[1], 'w'), indent=1)
