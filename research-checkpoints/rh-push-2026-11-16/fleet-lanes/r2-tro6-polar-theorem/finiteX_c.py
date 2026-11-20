#!/usr/bin/env python3
"""finiteX_c.py -- polar law for chi_c-twisted row sums, c != 1, against the stored estimator rho_str. No fitted parameter.
data:   S_sigma(c) = sum_m psi(m) (1 - N(m)/Q)^j chi_c^k(m) rho_str_sigma(-e0 m)       (k = 1 and controls k = 5, 2, 3, 4)
theory (k = 1 only), finite modulus cutoff of the estimator:
   P_sigma(c) = gamma_1(c) R(sigma, c) N(c)^(-1/2) (N c/(N c + 1)) (Q/vol) sum_f w_psi(f) conj chi_c(f) chi_sigma(f/e0) H_sigma(4 Q N(f)/(3 N(c)))
   H_sigma(kappa) = sum_{n in sigma} wt_sigma(n) N(n)^(-1/2) Phi_j(kappa/N(n));   f = +-2^A lambda^B, A odd, B = 2 mod 3.
(the terms with n = c n' are omitted: their frequencies have N(f) >= 36 N(c)^5.)   usage: finiteX_c.py"""
import sys, math, json, numpy as np
from scipy.special import jv
from lib import *
import alib as A
P = lambda *a: print(*a, flush=True)
d = np.load('../tro6-numerics/rows_full.npz'); cd = np.load('../tro6-numerics/data/conductors.npz'); E = np.load('../tro6-numerics/E.npy', mmap_mode='r')
Nm = d['Nm']; fl = d['flags']; rho_s = d['rho_str']; cN = cd['cN']; cna = cd['cna']; cnb = cd['cnb']
cop6 = (fl[:, 0] == 0) & (fl[:, 1] == 0)
T = A.SFTable(SX + '/data/sf_1e7.npz')
grid = A.geom_grid(1000, T.X, 90); g = grid.astype(float)
shell = np.searchsorted(grid.astype(np.int64), T.N, side='left'); keep = (shell >= 1) & (shell < len(grid))
m4 = T.m4.astype(np.int64); Nf = T.N.astype(float)
cnt = np.bincount((shell * 12 + m4)[keep], minlength=len(grid) * 12).reshape(len(grid), 12).astype(float)
a_s = np.concatenate([[0.0], g[1:] ** (2 / 3) - g[:-1] ** (2 / 3)])
Wt = (a_s[1:, None] ** 2 / np.maximum(cnt[1:], 1)).sum(0)
sh = np.minimum(shell, len(grid) - 1)
wt = np.where(keep, a_s[sh] / (np.maximum(cnt[sh, m4], 1) * Wt[m4]), 0.0)
# fine log-bins of the node norms, per class
NB = 6000; lb = np.linspace(math.log(1000), math.log(T.X) + 1e-9, NB + 1)
bi = np.clip(np.searchsorted(lb, np.log(Nf), 'right') - 1, 0, NB - 1)
wb_ = np.bincount((bi * 12 + m4), weights=wt * Nf ** -0.5, minlength=NB * 12).reshape(NB, 12)
nb_ = np.bincount((bi * 12 + m4), weights=wt * Nf ** 0.5, minlength=NB * 12).reshape(NB, 12)
Nbin = np.where(wb_ > 0, nb_ / np.where(wb_ > 0, wb_, 1), np.exp((lb[:-1] + lb[1:]) / 2)[:, None])     # weighted mean norm per bin
vol = math.sqrt(3) / 2
def Phi(x, j):
    a = 2 * np.pi * np.sqrt(np.maximum(x, 1e-300))
    return np.pi * 2 ** (j + 1) * math.factorial(j) * jv(j + 1, a) / a ** (j + 1)
def H(kappa, j):
    return (wb_ * Phi(kappa / Nbin, j)).sum(0)                  # 12 classes
def freqs(wa, wb, Nmax):
    out = []
    for Aexp in range(-3, 60):
        if (Aexp - 1) % 2 or wa(Aexp) == 0: continue
        for Bexp in range(-3, 60):
            if (Bexp - 5) % 3 or wb(Bexp) == 0: continue
            N = 4.0 ** Aexp * 3.0 ** Bexp
            if N <= Nmax: out.append((Aexp - 1, Bexp - 5, N, wa(Aexp) * wb(Bexp)))
    return out
# conductors
sm = np.flatnonzero(T.N <= 100000)
lut = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(T.na[sm], T.nb[sm]))}
node = sm[[lut[(int(a), int(b))] for a, b in zip(cna, cnb)]]
g1 = T.g1[node]; cm4 = T.m4[node].astype(int); mu = T.mu[node]
e_m1 = T.node_exponents((-1, 0))[node].astype(int); e_2 = T.node_exponents((2, 0))[node].astype(int); e_l = T.node_exponents(Z.LAM)[node].astype(int)
phi_over_N = np.ones(len(cN)); varpi = np.ones(len(cN))
# prime factors of each conductor via the table tree
fac = [[] for _ in range(len(cN))]
for i, nd in enumerate(node):
    x = nd
    while T.depth[x] >= 1:
        fac[i].append(float(T.pq[T.last[x]])); x = T.parent[x]
        if T.depth[x] == 0: break
for i, f in enumerate(fac):
    for q in f: phi_over_N[i] *= (1 - 1 / q); varpi[i] *= q / (q + 1)
LUT = np.concatenate([Z6, [0]])
def predict(ci, Q, j, wa, wb):
    Nc = float(cN[ci]); out = np.zeros(12, complex)
    for (a, b, N, w) in freqs(wa, wb, 80 * T.X * Nc / Q):
        h = H((4 / 3) * Q * N / Nc, j)
        for sign in (0, 1):
            chs = np.array([chi_cls(s, sign + 1, a, b) for s in range(12)])
            ec = (sign * e_m1[ci] + (1 + a) * e_2[ci] + (5 + b) * e_l[ci]) % 6
            out += w * h * chs * np.conj(Z6[ec])
    return out * g1[ci] * Rm[:, cm4[ci]] * Nc ** -0.5 * varpi[ci] * (Q / vol)
np.set_printoptions(precision=2, suppress=True, linewidth=240)
# sanity: c = 1 reproduces finiteX.py
i1 = int(np.flatnonzero(cN == 1)[0])
Q = 3199; j = 2
w = np.clip(1 - Nm / Q, 0, None) ** j
P("c = 1 check (binned H):", predict(i1, Q, j, w_all, w_all)[[0, 1, 2, 3, 8, 11]], " data:", (rho_s * w[:, None]).sum(0)[[0, 1, 2, 3, 8, 11]])
res = []
Cmax = 400
cols = np.flatnonzero((cN > 1) & (cN <= Cmax))
P(f"\nconductors 1 < N(c) <= {Cmax}: {len(cols)} (primes and squarefree composites, prime to 6)")
for name, mask, wa, wb in (('all', np.ones(len(Nm), bool), w_all, w_all), ('prime to 6', cop6, w_odd2, w_odd3)):
    for (Q, j) in ((3199, 2), (1600, 2), (3199, 3)):
        hi = int(np.searchsorted(Nm, Q, 'right'))
        w = (np.clip(1 - Nm[:hi] / Q, 0, None) ** j * mask[:hi])
        X = rho_s[:hi] * w[:, None]                                    # rows x 12
        Ecols = np.asarray(E[:hi][:, cols])
        nullsd = np.sqrt((np.abs(X) ** 2).sum(0))                      # random-phase size of a twisted sum, per class
        tot = {k: [] for k in (1, 2, 3, 4, 5)}
        rows = []
        for t, ci in enumerate(cols):
            e = Ecols[:, t]; ok = e >= 0
            S = {k: (X[ok] * Z6[(k * e[ok]) % 6][:, None]).sum(0) for k in (1, 2, 3, 4, 5)}
            pr = predict(ci, Q, j, wa, wb)
            rows.append((int(cN[ci]), int(cm4[ci]), S[1], pr, {k: float(np.sqrt((np.abs(S[k]) ** 2 / nullsd ** 2).mean())) for k in S}))
        # summary statistics
        D = np.array([r[2] for r in rows]); Pm = np.array([r[3] for r in rows]); Nc = np.array([r[0] for r in rows]); tc = np.array([r[1] for r in rows])
        P(f"\n--- rows {name}, Q = {Q}, weight (1-x)^{j}; null rms of a twisted sum per class = {nullsd.mean():.2f}")
        for lo, hi_ in ((2, 30), (31, 56), (57, 100), (101, 200), (201, 400)):
            b = (Nc >= lo) & (Nc <= hi_)
            if not b.any(): continue
            num = (D[b] * np.conj(Pm[b])).sum(); corr = abs(num) / math.sqrt((np.abs(D[b]) ** 2).sum() * (np.abs(Pm[b]) ** 2).sum())
            amp = (num / (np.abs(Pm[b]) ** 2).sum())
            resid = math.sqrt((np.abs(D[b] - Pm[b]) ** 2).mean()); psz = math.sqrt((np.abs(Pm[b]) ** 2).mean())
            ks = {k: float(np.mean([r[4][k] for r, bb in zip(rows, b) if bb])) for k in (1, 2, 3, 4, 5)}
            P(f"   N(c) in [{lo},{hi_}], #c = {int(b.sum())}: corr(data, pred) = {corr:.4f}; LS amplitude data/pred = {amp.real:.3f}{amp.imag:+.3f}i; rms pred {psz:.2f}, rms (data - pred) {resid:.2f};  rms z by twist k=1..5: " + " ".join(f"{ks[k]:.2f}" for k in (1, 2, 3, 4, 5)))
            res.append({'rows': name, 'Q': Q, 'j': j, 'band': [lo, hi_], 'n': int(b.sum()), 'corr': corr, 'amp': [amp.real, amp.imag], 'rms_pred': psz, 'rms_resid': resid, 'null': float(nullsd.mean()), 'z_by_k': ks})
        # resonant-class table: mean |data| and |pred| by relation of sigma to class(c)
        m1 = Z.mod4_index((-1 % 4, 0))
        mulmap = {}
        for i, r in enumerate(REPS):
            pr_ = Z.mul(r, (-1, 0)); mulmap[i] = Z.mod4_index(pr_)
        b = (Nc <= 100)
        own = np.mean([abs(D[t][tc[t]]) for t in np.flatnonzero(b)]); opp = np.mean([abs(D[t][mulmap[tc[t]]]) for t in np.flatnonzero(b)])
        pown = np.mean([abs(Pm[t][tc[t]]) for t in np.flatnonzero(b)]); popp = np.mean([abs(Pm[t][mulmap[tc[t]]]) for t in np.flatnonzero(b)])
        oth = np.mean([np.mean([abs(D[t][s]) for s in range(12) if s not in (tc[t], mulmap[tc[t]]) and X_M1[s] == X_M1[tc[t]]]) for t in np.flatnonzero(b)])
        poth = np.mean([np.mean([abs(Pm[t][s]) for s in range(12) if s not in (tc[t], mulmap[tc[t]]) and X_M1[s] == X_M1[tc[t]]]) for t in np.flatnonzero(b)])
        wrong = np.mean([np.mean([abs(D[t][s]) for s in range(12) if X_M1[s] != X_M1[tc[t]]]) for t in np.flatnonzero(b)])
        P(f"   N(c) <= 100: mean |S| in cell sigma = class(c): data {own:.2f} pred {pown:.2f};  sigma = class(-c): data {opp:.2f} pred {popp:.2f};  other 4 classes of the block: data {oth:.2f} pred {poth:.2f};  other block (pred 0): data {wrong:.2f}")
        res.append({'rows': name, 'Q': Q, 'j': j, 'cells': {'own': [own, pown], 'minus': [opp, popp], 'other': [oth, poth], 'wrong_block': wrong}})
        if Q == 3199 and j == 2:
            # amplitude exponent in N(c): data vs finite-X prediction vs X = infinity
            bb = (Nc >= 7) & (Nc <= 400)
            cell = np.array([mulmap[t] for t in tc]) if name != 'all' else tc
            ad = np.array([abs(D[t][cell[t]]) for t in range(len(Nc))]); ap = np.array([abs(Pm[t][cell[t]]) for t in range(len(Nc))])
            sd = np.polyfit(np.log(Nc[bb]), np.log(ad[bb]), 1)[0]; sp = np.polyfit(np.log(Nc[bb]), np.log(ap[bb]), 1)[0]
            sinf = np.polyfit(np.log(Nc[bb]), np.log(Nc[bb] ** (-1 / 3) * phi_over_N[cols][bb]), 1)[0]
            P(f"   amplitude exponent in N(c) over 7 <= N(c) <= 400 (resonant cell): data {sd:.3f}; finite-X prediction {sp:.3f}; X = infinity law N(c)^(-1/3) phi(c)/N(c): {sinf:.3f}")
            res.append({'rows': name, 'exponent': {'data': sd, 'pred_finiteX': sp, 'Xinf': sinf}})
            for t in np.flatnonzero(Nc <= 43)[:10]:
                blk = [s for s in range(12) if X_M1[s] == X_M1[tc[t]]]
                P(f"      N(c)={Nc[t]:3d} class {tc[t]:2d}: data {D[t][blk]}\n{'':30s} pred {Pm[t][blk]}")
json.dump(res, open('finiteX_c.json', 'w'), indent=0)
