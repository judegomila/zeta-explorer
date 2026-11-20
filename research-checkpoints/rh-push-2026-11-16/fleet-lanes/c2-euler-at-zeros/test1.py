"""Decisive test 1: law of R_S(W) in P and in window height, Gaussian windows |W(i tau)|^2 = exp(-(tau-T)^2/Delta^2).
R = Num/Den, Den = (1/2pi) int |m(1/2+i tau)|^2 |W|^2, Obar = (1/2pi) int Omega |m|^2 |W|^2 / Den, E = R - Obar,
E_S = (1/2pi) int 2 Re(m'/m) |m|^2 |W|^2 / Den (only for m = zeta_S), E_out = E - E_S.
Functions: zeta; height shift (unimodular twist p^{-i alpha}); E_a (Krein and Hermitian sums); T-NR; Liouville twist;
non-multiplicative multipliers on zeta zeros.  Output test1.json."""
import numpy as np, json, math, sys, time
from lib import *
t0 = time.time()
g = zeta_zeros(); HMAX = g[-1]
h = 0.01; grid = np.arange(0.0, HMAX + 60, h)
print('zeros', len(g), 'max height', HMAX, 'grid points', grid.size, 'planned: ~%d float arrays of %.0f MB' % (40, grid.size * 8 / 1e6), flush=True)
PL = [2, 3, 7, 30, 100, 300, 1000]
Om = Omega(grid)
out = dict(PL=PL, rows=[])
def wins(Delta, lo, hi):
    return np.arange(lo + 6 * Delta, hi - 6 * Delta, 2 * Delta)
def window_stats(m2grid, extra_grids, pts, vals, Ts, Delta, dens=1.0):
    """pts: heights of samples, vals: complex/real sample values WITHOUT window; returns arrays R, Obar, extra/Den."""
    R = np.empty(len(Ts)); Ob = np.empty(len(Ts)); Ex = [np.empty(len(Ts)) for _ in extra_grids]
    o = np.argsort(pts); pts = pts[o]; vals = vals[o]
    for i, T in enumerate(Ts):
        a = int((T - 6 * Delta) / h); b = int((T + 6 * Delta) / h) + 1
        w = np.exp(-((grid[a:b] - T) / Delta) ** 2)
        den = h * np.dot(m2grid[a:b], w) / (2 * math.pi)
        Ob[i] = dens * h * np.dot(m2grid[a:b] * Om[a:b], w) / (2 * math.pi) / den
        for k, eg in enumerate(extra_grids): Ex[k][i] = h * np.dot(eg[a:b], w) / (2 * math.pi) / den
        ia = np.searchsorted(pts, T - 6.5 * Delta); ib = np.searchsorted(pts, T + 6.5 * Delta)
        R[i] = np.sum(vals[ia:ib] * np.exp(-((pts[ia:ib] - T) / Delta) ** 2)) / den
    return R, Ob, Ex
def st(x):
    return dict(min=float(np.min(x)), max=float(np.max(x)), mean=float(np.mean(x)), sd=float(np.std(x)))
def stbands(name, P, Delta, Ts, R, Ob, extra=None):
    row = dict(fn=name, P=P, Delta=Delta, nwin=len(Ts))
    bands = [(60, 300), (300, 1000), (1000, 3000), (3000, 9000), (9000, 2e4)]
    row['all'] = dict(R=st(R), E=st(R - Ob), ratio=st(R / Ob), neg=int(np.sum(R < 0)))
    row['bands'] = []
    for lo, hi in bands:
        m = (Ts >= lo) & (Ts < hi)
        if m.sum() == 0: continue
        d = dict(lo=lo, hi=hi, n=int(m.sum()), Obar=float(np.mean(Ob[m])), R=st(R[m]), E=st((R - Ob)[m]), neg=int(np.sum(R[m] < 0)))
        if extra is not None:
            for k, v in extra.items(): d[k] = st(v[m])
        row['bands'].append(d)
    out['rows'].append(row)
    b = row['bands'][-1]
    print('%-10s P=%-5s D=%-4s nwin=%-5d  E all: min %8.3f mean %8.3f max %8.3f | top band Obar %.3f E mean %.3f | neg R: %d'
          % (name, P, Delta, len(Ts), row['all']['E']['min'], row['all']['E']['mean'], row['all']['E']['max'], b['Obar'], b['E']['mean'], row['all']['neg']), flush=True)
allp = primes_upto(1000)
s_grid = 0.5 + 1j * grid
a_EA = 0.2; alpha = 1.0
qNR = 2.0; cNR = 2.05; dNR = math.acosh(cNR / 2) / math.log(qNR)
tNR = math.pi * (2 * np.arange(0, int(HMAX * math.log(qNR) / (2 * math.pi)) + 1) + 1) / math.log(qNR)
for P in PL:
    ps = allp[allp <= P]
    z, ld = zS(s_grid, ps, deriv=True)
    m2 = np.abs(z) ** 2; dS = 2 * np.real(ld) * m2
    del z, ld
    zg = zS(0.5 + 1j * g, ps)
    zsh = zS(0.5 + 1j * (g + alpha), ps)
    zp = zS(0.5 + a_EA + 1j * g, ps); zm = zS(0.5 - a_EA + 1j * g, ps)
    znp = zS(0.5 + dNR + 1j * tNR, ps); znm = zS(0.5 - dNR + 1j * tNR, ps)
    zq = zS(0.25 + 0.5j * g, ps); zql = zS(0.25 + 0.5j * g, ps, sign=-1.0)
    zl = zS(s_grid, ps, sign=-1.0); m2l = np.abs(zl) ** 2; del zl
    print('P', P, 'L1', L1(ps), 'mean |zeta_S|^2 =', float(np.prod(1 / (1 - 1 / ps.astype(float)))), 'elapsed', round(time.time() - t0), flush=True)
    for Delta in (2.0, 10.0, 50.0):
        Ts = wins(Delta, 0.0, HMAX)
        Ts = Ts[Ts >= 60]
        R, Ob, Ex = window_stats(m2, [dS], g, np.abs(zg) ** 2, Ts, Delta)
        stbands('zeta', P, Delta, Ts, R, Ob, extra=dict(E_S=Ex[0], E_out=R - Ob - Ex[0]))
        if Delta == 2.0:
            np.save('zeta_E_P%d_D2.npy' % P, np.vstack([Ts, R, Ob, Ex[0]]))
        # height shift = unimodular twist p^{-i alpha} of the prime side
        R2, Ob2, _ = window_stats(m2, [], g + alpha, np.abs(zsh) ** 2, Ts, Delta)
        stbands('shift', P, Delta, Ts, R2, Ob2)
        # E_a: Krein sum 2 Re[ zS(1/2+a+ig) conj zS(1/2-a+ig) W(a+ig) conj W(-a+ig) ], and Hermitian sum
        # window factor is applied inside window_stats as exp(-x^2/Delta^2); remaining factor exp(a^2/Delta^2) e^{2 i a x/Delta^2}
        for nm, kre in (('ea_krein', True), ('ea_herm', False)):
            Rk = np.empty(len(Ts))
            for i, T in enumerate(Ts):
                ia = np.searchsorted(g, T - 6.5 * Delta); ib = np.searchsorted(g, T + 6.5 * Delta); x = g[ia:ib] - T
                wr = np.exp(-(x * x - a_EA ** 2) / Delta ** 2)
                if kre: v = 2 * np.real(zp[ia:ib] * np.conj(zm[ia:ib]) * np.exp(2j * a_EA * x / Delta ** 2)) * wr
                else: v = (np.abs(zp[ia:ib]) ** 2 + np.abs(zm[ia:ib]) ** 2) * wr
                Rk[i] = np.sum(v)
            _, ObE, ExE = window_stats(m2, [m2], g, np.zeros(len(g)), Ts, Delta, dens=2.0)
            den = None
            # recompute Den via ratio: window_stats returned R=0; get Den from extra (m2/den =1 -> useless); do it directly
            Den = np.array([h * np.dot(m2[int((T - 6 * Delta) / h):int((T + 6 * Delta) / h) + 1], np.exp(-((grid[int((T - 6 * Delta) / h):int((T + 6 * Delta) / h) + 1] - T) / Delta) ** 2)) / (2 * math.pi) for T in Ts])
            stbands(nm, P, Delta, Ts, Rk / Den, ObE)
        # T-NR: zeta zeros plus lattice pairs at +-dNR + i tNR (Krein terms)
        Rn = np.empty(len(Ts))
        for i, T in enumerate(Ts):
            ia = np.searchsorted(tNR, T - 6.5 * Delta); ib = np.searchsorted(tNR, T + 6.5 * Delta); x = tNR[ia:ib] - T
            Rn[i] = np.sum(2 * np.real(znp[ia:ib] * np.conj(znm[ia:ib]) * np.exp(2j * dNR * x / Delta ** 2)) * np.exp(-(x * x - dNR ** 2) / Delta ** 2))
        stbands('nr_krein', P, Delta, Ts, R + Rn / Den, Ob + math.log(qNR) / math.pi)
        # Liouville twist zeta(2s)/zeta(s): zeros at rho/2 (Re 1/4); Hermitian sum; density Omega(2 t)*2 at height t; multiplier zeta_S and its own Euler product
        Tl = Ts[Ts < HMAX / 2 - 6.5 * Delta]
        for nm, vals, mm in (('tw_zS', np.abs(zq) ** 2, m2), ('tw_own', np.abs(zql) ** 2, m2l)):
            Rl = np.empty(len(Tl)); Ol = np.empty(len(Tl))
            for i, T in enumerate(Tl):
                a = int((T - 6 * Delta) / h); b = int((T + 6 * Delta) / h) + 1; w = np.exp(-((grid[a:b] - T) / Delta) ** 2)
                den = h * np.dot(mm[a:b], w) / (2 * math.pi)
                Ol[i] = h * np.dot(mm[a:b] * 2 * Omega(2 * grid[a:b]), w) / (2 * math.pi) / den
                ia = np.searchsorted(g / 2, T - 6.5 * Delta); ib = np.searchsorted(g / 2, T + 6.5 * Delta)
                Rl[i] = np.sum(vals[ia:ib] * np.exp(-((g[ia:ib] / 2 - T) / Delta) ** 2)) / den
            stbands(nm, P, Delta, Tl, Rl, Ol)
    del m2, dS, m2l
# R1 test: non-multiplicative multipliers on zeta zeros (P = 7 smooth support, n <= 1e4)
ps = allp[allp <= 7]; ns = smooth_numbers(ps, 10 ** 4)
rng = np.random.default_rng(1)
mult = dict(trunc_zS=np.ones(len(ns)) / 1.0, dh_coeff=dh_coeff(ns), rand_sign=rng.choice([-1.0, 1.0], len(ns)))
mult['rand_sign'][0] = 1.0
print('R1 test: smooth numbers', len(ns), 'grid matrix chunk planned %.0f MB' % (20000 * len(ns) * 16 / 1e6), flush=True)
for nm, an in mult.items():
    A = dirpoly(s_grid, ns, an); m2 = np.abs(A) ** 2; del A
    Ag = dirpoly(0.5 + 1j * g, ns, an)
    # Landau-Gonek mean prediction for E: -2 Re sum_{m, k} a_m a_{mk} Lambda(k)/(mk) / sum a_m^2/m
    idx = {int(n): i for i, n in enumerate(ns)}; num = 0.0
    for p in ps:
        pk = int(p)
        while pk <= 10 ** 4:
            for i, n in enumerate(ns):
                j = idx.get(int(n) * pk)
                if j is not None: num += an[i] * an[j] * math.log(p) / (int(n) * pk)
            pk *= int(p)
    pred = -2 * num / float(np.sum(an ** 2 / ns))
    for Delta in (2.0, 10.0, 50.0):
        Ts = wins(Delta, 0.0, HMAX); Ts = Ts[Ts >= 60]
        R, Ob, _ = window_stats(m2, [], g, np.abs(Ag) ** 2, Ts, Delta)
        stbands('R1_' + nm, 7, Delta, Ts, R, Ob)
        out['rows'][-1]['pred_mean_E'] = pred
    print('   predicted mean E', pred, flush=True)
json.dump(out, open('test1.json', 'w'))
print('done', round(time.time() - t0))
