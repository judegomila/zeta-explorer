#!/usr/bin/env python3
"""Combination 2, S = {inf,2,3}: log^2 cusp of the Sonine remainder at S-units rho0 = 2^a 3^b <= 1e4.
Kernel K(t) = 2 sum_{n,m} c2_n c3_m cos(2 pi 2^n 3^m t). At rho = rho0 (1+eps) the exactly resonant pairs give
   G_S(eps)  = 2 rho^{1/2}  sum_j c_j c_{j+(a,b)} si(f_{j+(a,b)} eps),      f_j = 2^n 3^m
   G_in(eps) = 2 rho^{-1/2} sum_j c_j c_{j+(a,b)} si(f_j eps'),             eps' = eps/(1+eps)
(the rest of delta_S, delta_in is checked to be smooth in eps by a full quadruple sum at rho0 = 2, 3, 6, 12).
Tempered factors: G = A log^2(1/eps) + B log(1/eps) + C + bounded; out-fraction of the log^2 cusp = 1 - A_in/A_S.
usage: cusp23.py [OUT]"""
import sys, math, json, os, time
import numpy as np
import sisum, lf
OUT = sys.argv[1] if len(sys.argv) > 1 else 'out'; os.makedirs(OUT, exist_ok=True)
EMAX = float(sys.argv[2]) if len(sys.argv) > 2 else 80.0      # eps down to 10^-EMAX
t0 = time.time()
def lattice(n2name, n3name, logfmax):
    N2 = int(logfmax / math.log(2)) + 2; N3 = int(logfmax / math.log(3)) + 2
    a2min, c2 = lf.laurent(n2name, 2, npos=N2, nneg=0); a3min, c3 = lf.laurent(n3name, 3, npos=N3, nneg=0)
    c2 = c2.real; c3 = c3.real
    return a2min, c2, a3min, c3
def run(n2name, n3name, units, tag):
    logfmax = (EMAX + 18) * math.log(10)
    a2min, c2, a3min, c3 = lattice(n2name, n3name, logfmax)
    n2 = a2min + np.arange(len(c2)); n3 = a3min + np.arange(len(c3))
    LF = n2[:, None] * math.log(2) + n3[None, :] * math.log(3)        # log f_j
    Cc = c2[:, None] * c3[None, :]
    print(f'[{tag}] lattice {Cc.shape} = {Cc.size} points; planned work {Cc.size*8*6/2**20:.1f} MB', flush=True)
    Ls = np.linspace(8 * math.log(10), EMAX * math.log(10), 73)       # log(1/eps)
    rows = []
    for (a, b) in units:
        rho0 = 2.0 ** a * 3.0 ** b
        # product c_j c_{j+(a,b)} on the overlap
        prod = Cc[:len(c2) - a, :len(c3) - b] * Cc[a:, b:]
        lfS = LF[a:, b:]; lfI = LF[:len(c2) - a, :len(c3) - b]
        GS = []; GI = []
        for Lg in Ls:
            mS = lfS - Lg; mI = lfI - Lg
            okS = mS < logfmax - Lg - 1; okI = mI < logfmax - Lg - 1
            GS.append(2 * math.sqrt(rho0) * float(np.sum(prod[okS] * sisum.si(np.exp(mS[okS])))))
            GI.append(2 / math.sqrt(rho0) * float(np.sum(prod[okI] * sisum.si(np.exp(mI[okI])))))
        GS = np.array(GS); GI = np.array(GI)
        qS = np.polyfit(Ls, GS, 2); qI = np.polyfit(Ls, GI, 2)
        f2 = 1 - qI[0] / qS[0]
        # naive ratio of increments at the smallest eps (what a direct extrapolation of the total sees)
        fn = 1 - (GI[-1] - GI[-2]) / (GS[-1] - GS[-2])
        # exact scaling check: G_in(eps) = G_S(eps/rho0)/rho0 up to (1+eps) factors -> shift fit
        rows.append(dict(tag=tag, a=a, b=b, rho=rho0, A_S=float(qS[0]), A_in=float(qI[0]), f_log2=float(f2), law=1 - 1 / rho0, dev=float(f2 - (1 - 1 / rho0)),
                         f_naive=float(fn), dev_naive=float(fn - (1 - 1 / rho0)), ratio_last=float(GI[-1] / GS[-1])))
        print(f'{tag:10s} rho=2^{a}3^{b}={rho0:8.0f} A_S={qS[0]:+.6e} A_in={qI[0]:+.6e} f(log^2 coeff)={f2:.8f} law={1-1/rho0:.8f} dev={f2-(1-1/rho0):+.2e} | naive incr ratio dev={fn-(1-1/rho0):+.2e} | G_in/G_S at eps=1e-{EMAX:.0f}: {GI[-1]/GS[-1]:.6e} (1/rho={1/rho0:.6e})', flush=True)
    return rows
units = [(a, b) for a in range(0, 14) for b in range(0, 9) if (a, b) != (0, 0) and 2.0 ** a * 3.0 ** b <= 1e4]
units.sort(key=lambda ab: 2.0 ** ab[0] * 3.0 ** ab[1])
allrows = []
for n2name, n3name, tag in (('zeta', 'zeta', 'zeta'), ('sign', 'sign', 'chi5'), ('sign', 'zeta', 'chi13/sign2'), ('ntp', 'zeta', 'ntp@2'), ('ea', 'ea', 'E_0.2')):
    allrows += run(n2name, n3name, units, tag)
    print(f'  [{time.time()-t0:.0f}s]', flush=True)
json.dump(allrows, open(f'{OUT}/cusp23.json', 'w'))
# ---- full quadruple-sum check that the non-resonant part is smooth (zeta, rho0 in 2, 3, 6, 12; eps = 2^-j, j = 8..22)
def full(n2name, n3name, a, b, eps, inv=False):
    logfmax = math.log(2.0 ** 46 / eps)
    a2min, c2, a3min, c3 = lattice(n2name, n3name, logfmax)
    n2 = (a2min + np.arange(len(c2)))[:, None] + 0 * np.arange(len(c3))[None, :]; n3 = 0 * n2 + (a3min + np.arange(len(c3)))[None, :]
    Cc = (c2[:, None] * c3[None, :])
    keep = (n2 * math.log(2) + n3 * math.log(3) < logfmax)
    n2 = n2[keep]; n3 = n3[keep]; cc = Cc[keep]; f = 2.0 ** n2 * 3.0 ** n3
    sa, sb, e = (a, b, eps) if not inv else (-a, -b, -eps / (1 + eps))
    r = 2.0 ** sa * 3.0 ** sb * (1 + e)
    tot = 0.0; resn = 0.0
    for i in range(len(f)):
        d2 = n2[i] + sa - n2; d3 = n3[i] + sb - n3
        res_mask = (d2 == 0) & (d3 == 0)
        diff = np.where(res_mask, f * abs(e), np.abs(f * (2.0 ** d2 * 3.0 ** d3 * (1 + e) - 1)))
        term = cc[i] * cc * (sisum.si(r * f[i] + f) + sisum.si(diff))
        tot += float(term.sum()); resn += float((cc[i] * cc * sisum.si(diff))[res_mask].sum())
    pref = math.sqrt(r) if not inv else math.sqrt(r)     # delta_in = rho^{-1/2} br(1/rho) = (1/rho)^{1/2} br(1/rho): same formula with r = 1/rho
    return 2 * pref * tot, 2 * pref * resn, len(f)
chk = []
for (a, b) in ((1, 0), (0, 1), (1, 1), (2, 1)):
    prev = None
    for j in range(8, 23, 2):
        eps = 2.0 ** (-j)
        tS, rS, npt = full('zeta', 'zeta', a, b, eps); tI, rI, _ = full('zeta', 'zeta', a, b, eps, inv=True)
        cur = (tS, rS, tI, rI)
        if prev is not None:
            dnS = (tS - rS) - (prev[0] - prev[1]); dnI = (tI - rI) - (prev[2] - prev[3])
            fo = 1 - (tI - prev[2]) / (tS - prev[0])
            chk.append(dict(a=a, b=b, j=j, lattice=npt, incr_total_S=tS - prev[0], incr_nonres_S=dnS, incr_total_in=tI - prev[2], incr_nonres_in=dnI, f_naive_total=fo))
            print(f'full check rho0=2^{a}3^{b} j={j} lattice={npt}: incr total S {tS-prev[0]:+.5f} (non-resonant part {dnS:+.2e}); incr total in {tI-prev[2]:+.5f} (non-resonant {dnI:+.2e}); naive f_out from totals {fo:.5f} vs law {1-1/(2.0**a*3.0**b):.5f}  [{time.time()-t0:.0f}s]', flush=True)
        prev = cur
json.dump(chk, open(f'{OUT}/cusp23_fullcheck.json', 'w'))
