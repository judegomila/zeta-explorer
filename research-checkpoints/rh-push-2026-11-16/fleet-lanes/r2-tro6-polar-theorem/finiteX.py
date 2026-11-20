#!/usr/bin/env python3
"""finiteX.py -- finite-modulus-cutoff form of the polar law, against the stored estimator rho_str (tro6-numerics).
The stored coefficient is the WLS estimator  rho_hat_sigma(m) = sum_{n in sigma, sf, N(n) in (1e3,1e7]} wt_sigma(n) g~(-e0 m, n).
Poisson in m (RESULT.md section 2) gives, for the resonant frequencies f = +-2^A lambda^B k^6,
   sum_m psi(m) W(N(m)/Q) chi_c(m) g~(-e0 m, n) = N(nc)^(-1/2) gamma_1(c) R(n,c) (Q/vol) sum_f w_psi(f) conj chi_c(f) chi_n(f/e0) Phi(4 Q N(f)/(3 N(nc)))
   + (non-resonant frequencies, which cancel in the n-sum).
No parameter is fitted. usage: finiteX.py"""
import sys, math, json, numpy as np
from scipy.special import jv
from lib import *
import alib as A
P = lambda *a: print(*a, flush=True)
d = np.load('../tro6-numerics/rows_full.npz'); cd = np.load('../tro6-numerics/data/conductors.npz'); E = np.load('../tro6-numerics/E.npy', mmap_mode='r')
Nm = d['Nm']; fl = d['flags']; rho_s = d['rho_str']; rho_n = d['rho_str'] + d['rho_cor']; cN = cd['cN']; cna = cd['cna']; cnb = cd['cnb']
cop6 = (fl[:, 0] == 0) & (fl[:, 1] == 0)
T = A.SFTable(SX + '/data/sf_1e7.npz')
grid = A.geom_grid(1000, T.X, 90); g = grid.astype(float)
shell = np.searchsorted(grid.astype(np.int64), T.N, side='left'); keep = (shell >= 1) & (shell < len(grid))
m4 = T.m4.astype(np.int64); Nf = T.N.astype(float)
cnt = np.bincount((shell * 12 + m4)[keep], minlength=len(grid) * 12).reshape(len(grid), 12).astype(float)
a_s = np.concatenate([[0.0], g[1:] ** (2 / 3) - g[:-1] ** (2 / 3)])
Wt = (a_s[1:, None] ** 2 / np.maximum(cnt[1:], 1)).sum(0)
wt = np.where(keep, a_s[np.minimum(shell, len(grid) - 1)] / (np.maximum(cnt[np.minimum(shell, len(grid) - 1), m4], 1) * Wt[m4]), 0.0)   # wt_sigma(n)
vol = math.sqrt(3) / 2
def Phi(x, j):
    a = 2 * np.pi * np.sqrt(np.maximum(x, 1e-300))
    return np.pi * 2 ** (j + 1) * math.factorial(j) * jv(j + 1, a) / a ** (j + 1)
def freqs(wa, wb, Nmax):
    out = []
    for Aexp in range(-3, 60):
        if (Aexp - 1) % 2 or wa(Aexp) == 0: continue
        for Bexp in range(-3, 60):
            if (Bexp - 5) % 3 or wb(Bexp) == 0: continue
            N = 4.0 ** Aexp * 3.0 ** Bexp
            if N <= Nmax: out.append((Aexp - 1, Bexp - 5, N, wa(Aexp) * wb(Bexp)))
    return out
def predict_hat(Q, j, wa, wb, cnode=None, e_c=None):
    """finite-cutoff prediction for sum_m psi W chi_c rho_hat_sigma(-e0 m) for all 12 sigma; c = 1 if cnode is None.
    e_c(sign, a, b) = exponent of chi_c(f) for f = (-1)^sign 2^(1+a) lambda^(5+b)."""
    out = np.zeros(12, complex)
    Nc = 1.0 if cnode is None else float(T.N[cnode])
    if cnode is None: cop = np.ones(T.n, bool)
    else:
        # n coprime to the prime c: exclude nodes divisible by c (prime c only): node n has c as a factor iff walking parents hits it
        cop = np.ones(T.n, bool); bad = np.zeros(T.n, bool); bad[cnode] = True
        pc = T.last[cnode]
        for lev in T.levels: bad[lev] = bad[T.parent[lev]] | (T.last[lev] == pc)
        cop = ~bad
    base = wt * Nf ** -0.5 * cop
    for (a, b, N, w) in freqs(wa, wb, 60 * T.X * Nc / Q):
        ph = Phi((4 / 3) * Q * N / (Nf * Nc), j) * base
        cls = np.bincount(m4, weights=ph, minlength=12)
        for sign in (0, 1):
            # f = (-1)^sign 2^(1+a) lam^(5+b) = e0 * eps, eps = (-1)^(sign+1) 2^a lam^b
            chs = np.array([chi_cls(s, sign + 1, a, b) for s in range(12)])
            cc = 1.0 if e_c is None else np.conj(Z6[e_c(sign, a, b)])
            out += w * cls * chs * cc
    return out * (Q / vol) * Nc ** -0.5
def predict_inf_str(Q, j, Amat_):
    """X = infinity, stripped coefficient (squarefree moduli prime to 6 m): K0_str * W^(5/6) Q^(5/6) A[:, tau]"""
    zf6 = zF2 * (1 - 1 / 16) * (1 - 1 / 9)
    # k-sum Euler product for stripped: prod_{p not | 6} (1 + (Np/(Np+1)) Np^(-6z)/(1-Np^(-6z))) has residue at 6z = 1:
    #   (1/6) rF * (3/4)(2/3) * prod_{p not| 6} (1 - 1/Np) (1 + Np/((Np+1)(Np-1))) ;  evaluated numerically below
    return None
mel = lambda j: math.gamma(5 / 6) * math.factorial(j) / math.gamma(5 / 6 + j + 1)
np.set_printoptions(precision=2, suppress=True, linewidth=240)
A_all = Amat(w_all, w_all); A_6 = Amat(w_odd2, w_odd3)
tau1 = Z.mod4_index((1, 0)); res = {}
P("classes: index -> representative mod 4:", {i: r for i, r in enumerate(REPS)})
P(f"K0 = {K0:.6f} (complete coefficient, X = infinity)")
P("\n=== c = 1: first moments  sum_m psi(m) (1 - N(m)/Q)^j rho_sigma(-e0 m);  rows = all 12 classes sigma (6 vanish by the sign symmetry)")
blk = [i for i in range(12) if X_M1[i] == 0]
P("classes with chi_sigma(-1) = +1:", blk)
for name, mask, wa, wb, Ainf in (('all rows', np.ones(len(Nm), bool), w_all, w_all, A_all), ('rows prime to 6', cop6, w_odd2, w_odd3, A_6)):
    for j in (2, 3):
        for Q in (800, 1600, 3199):
            w = np.clip(1 - Nm / Q, 0, None) ** j * mask
            Ss = (rho_s * w[:, None]).sum(0); Sn = (rho_n * w[:, None]).sum(0)
            ph = predict_hat(Q, j, wa, wb)
            pinf = K0 * mel(j) * Q ** (5 / 6) * Ainf[:, tau1]
            P(f"{name}, j={j}, Q={Q}")
            P("   data rho_str      ", Ss[blk]); P("   finite-X predicted", ph[blk]); P("   data rho_nat      ", Sn[blk]); P("   X=inf (complete)  ", pinf[blk])
            res[f"c1|{name}|{j}|{Q}"] = {'data_str': [complex(x).__repr__() for x in Ss[blk]], 'pred_hat': [complex(x).__repr__() for x in ph[blk]]}
            rel = np.abs(Ss[blk] - ph[blk]).sum() / np.abs(ph[blk]).sum()
            P(f"   sum|data_str - pred| / sum|pred| = {rel:.3f}")
json.dump(res, open('finiteX_c1.json', 'w'), indent=0)
