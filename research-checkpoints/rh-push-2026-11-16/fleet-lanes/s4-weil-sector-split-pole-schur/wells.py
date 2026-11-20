"""Combination 4: concentration of |ghat|^2 in the negativity set (wells) of the symbol, g in L^2(-a,a) orthogonal to the pole block.
For an object with symbol (pole-free form = (1/2pi) int w |ghat|^2)
  w(t) = 2 log Q + sum_j (Re psi(z_j + it/2) - log pi) - 2 sum_{log n < 2a} c(n) n^{-1/2} cos(t log n),
wells = {0 <= t <= TCUT : w(t) < 0} (and mirror). Statistics per parity sector on the pole-free subspace P0:
  mu      = sup  (1/2pi) int_wells |ghat|^2 / |g|^2                      (prolate concentration)
  N_max   = sup  (1/2pi) int_wells |w| |ghat|^2 / |g|^2                  (depth-weighted maximum)
  P_min   = inf  [W(g) + (1/2pi) int_wells |w| |ghat|^2] / |g|^2         (positive mass; includes the signed part beyond TCUT)
  crude   = P_min - N_max                                                (sufficient condition; ignores that the two extremals differ)
  R       = sup  N(g)/P(g),  margin = 1 - R                              (same g in both; margin > 0 iff W > 0 on P0)
float64; Legendre basis; the form W from the ball-arithmetic assembly of slib.py converted to float.
usage: python wells.py N TCUT outfile [validate]
"""
import sys, json, math, time
import numpy as np
from scipy.special import spherical_jn, digamma
from scipy.linalg import eigh

_argv = sys.argv
sys.argv = ['x', _argv[1], '256', '1', '/dev/null', 'all', '60']
import sectors
from slib import *
sys.argv = _argv
N = int(sys.argv[1]); TCUT = float(sys.argv[2]); OUT = sys.argv[3]
setprec(256)
SUP = ['0.5', '0.6', '0.7', '0.8', '0.9', '1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '2.0', '2.1', '2.2']
OBJ = ['ZETA', 'CHI-3', 'CHI5', 'DH', 'TNR-q2-c2.2', 'TNR-q3-c2.2', 'TNR-q5-c2.2', 'TNR-q2-c1.0', 'EA-1/8', 'EA-1/4',
       'LIOUVILLE', 'FLIP2', 'FLIP3', 'SGN-00', 'U-00(Re)', 'WT(Re)', 'DHcoef-ZETAarch']
FIXED = [(0.0, 3.306), (6.945, 10.532)]           # wells of sigma_2 (symbol with the p = 2 rung only), node ri-confined-well


def symbol(t, zs, shift, coef, twoa):
    w = np.full_like(t, shift)
    for z in zs: w = w + np.real(digamma(float(z) + 0.5j * t)) - math.log(math.pi)
    for n in range(2, len(coef)):
        if coef[n] != 0 and math.log(n) < twoa: w = w - 2 * coef[n] / math.sqrt(n) * np.cos(t * math.log(n))
    return w


def find_wells(f, T, dt=0.002):
    t = np.arange(0, T + dt, dt); w = f(t)
    out = []; neg = w < 0; i = 0; n = len(t)
    edges = np.flatnonzero(np.diff(neg.astype(int)))
    pts = [0.0] if neg[0] else []
    for e in edges:
        # linear interpolation of the sign change
        t0, t1, w0, w1 = t[e], t[e + 1], w[e], w[e + 1]
        pts.append(t0 - w0 * (t1 - t0) / (w1 - w0))
    if len(pts) % 2 == 1: pts.append(T)
    return [(pts[i], pts[i + 1]) for i in range(0, len(pts), 2)]


GLX, GLW = np.polynomial.legendre.leggauss(16)
def quad_nodes(intervals, a):
    ts = []; ws = []
    for lo, hi in intervals:
        npan = max(1, int(math.ceil((hi - lo) * max(a, 0.5) / 1.5)))
        ed = np.linspace(lo, hi, npan + 1)
        for k in range(npan):
            c = (ed[k] + ed[k + 1]) / 2; hw = (ed[k + 1] - ed[k]) / 2
            ts.append(c + hw * GLX); ws.append(hw * GLW)
    return (np.concatenate(ts), np.concatenate(ws)) if ts else (np.zeros(0), np.zeros(0))


def ftmat(t, idx, a):
    """F[k, i] = sqrt(2a(2i+1)) (-1)^{floor(i/2)} j_i(a t_k):  phihat_i(t) up to the common phase of the parity sector"""
    F = np.empty((len(t), len(idx)))
    for c, i in enumerate(idx):
        F[:, c] = math.sqrt(2 * a * (2 * i + 1)) * (-1) ** (i // 2) * spherical_jn(i, a * t)
    return F


def freq_form(t, wt, dens, idx, a):
    F = ftmat(t, idx, a)
    return (F.T * (wt * dens)) @ F / math.pi


def assemble(s):
    """float pole-less blocks (arch - primes) per object and parity, pole vectors, at support s"""
    a = arb(s) / 2; af = float(s) / 2
    Q = N + extra_nodes(af, 40)
    Alog, T = stage1_nodes(N, Q, list(range(Q)), [s], sectors.ZK_ALL)
    K = int(math.exp(float(s))) + 1
    O = sectors.objects(K)
    d = [len(par_idx(N, 0)), len(par_idx(N, 1))]
    MM = {}
    for nm in OBJ:
        fam, shift, coef = O[nm]; zs, poles = sectors.FAM[fam]
        MM[nm] = [arch_block(d[par], a, zs, Alog[par], [T[(s, z)][par] for z in zs], shift) for par in (0, 1)]
    for n in range(2, K + 1):
        if not (arb(n).log() < 2 * a): continue
        Sb = None
        for nm in OBJ:
            coef = O[nm][2]
            if float(abs(coef[n].mid())) != 0:
                if Sb is None: Sb = sblocks(arb(n).log() / a, N)
                for par in (0, 1): MM[nm][par] = MM[nm][par] - Sb[par] * (coef[n] / arb(n).sqrt())
    polev = {p: pole_vectors(N, a, p) for p in ['0.5', '0.625', '0.375', '0.75', '0.25']}
    return O, MM, polev


def stats(nm, s, O, MM, polev, wells_override=None):
    af = float(s) / 2
    fam, shift, coef = O[nm]; zs, poles = sectors.FAM[fam]
    cf = [float(c.mid()) for c in coef]
    f = lambda t: symbol(t, zs, float(shift.mid()), cf, float(s))
    wl = find_wells(f, TCUT) if wells_override is None else wells_override
    t, wt = quad_nodes(wl, af)
    wv = f(t) if len(t) else np.zeros(0)
    rec = {'obj': nm, 'twoa': float(s), 'wells': [[round(x, 4), round(y, 4)] for x, y in wl[:6]], 'n_wells': len(wl),
           'wells_length': float(sum(y - x for x, y in wl)), 'depth': float(-wv.min()) if len(wv) else 0.0}
    for par, pn in ((0, 'even'), (1, 'odd')):
        idx = par_idx(N, par)
        Mf = tofloat(MM[nm][par]); Mf = (Mf + Mf.T) / 2
        cols = [np.array([float(x.mid()) for x in polev[p][par]]) for p in poles]
        if cols:
            Qm, _ = np.linalg.qr(np.stack(cols, axis=1), mode='complete'); Z = Qm[:, len(cols):]
        else:
            Z = np.eye(len(idx))
        Wm = Z.T @ Mf @ Z
        B = Z.T @ freq_form(t, wt, np.ones_like(t), idx, af) @ Z
        Nm = Z.T @ freq_form(t, wt, np.abs(wv) * (wv < 0), idx, af) @ Z
        P = Wm + Nm; P = (P + P.T) / 2
        r = {'mu': float(np.linalg.eigvalsh(B)[-1]), 'N_max': float(np.linalg.eigvalsh(Nm)[-1]), 'W_min': float(np.linalg.eigvalsh(Wm)[0])}
        pe = np.linalg.eigvalsh(P)
        r['P_min'] = float(pe[0]); r['crude'] = r['P_min'] - r['N_max']
        if pe[0] > 1e-9:
            r['R'] = float(eigh(Nm, P, eigvals_only=True)[-1]); r['margin'] = 1 - r['R']
        else:
            r['R'] = None; r['margin'] = None
        rec[pn] = r
    return rec


if __name__ == '__main__':
    t0 = time.time()
    if len(sys.argv) > 4 and sys.argv[4] == 'validate':
        s = '0.8'; af = 0.4
        O, MM, polev = assemble(s)
        out = {}
        # wells of the p=2 symbol and the depth of sigma_2 = (t^2 + 1/4)^2 w_1
        fam, shift, coef = O['ZETA']; cf = [float(c.mid()) for c in coef]
        f = lambda t: symbol(t, ['0.25'], 0.0, cf, 0.8)
        out['wells_w1'] = find_wells(f, 60.0)
        tt = np.arange(0, 20, 0.001); s2 = (tt * tt + 0.25) ** 2 * f(tt); k = int(np.argmin(s2))
        out['sigma2_min'] = [float(s2[k]), float(tt[k])]
        # Parseval and symbol identity on the even pole-free block, low modes, T = 3000 plus the 1/t^2 tail of the arch part
        idx = par_idx(N, 0)[:6]
        T = 3000.0
        t, wt = quad_nodes([(0.0, T)], af)
        Fq = freq_form(t, wt, np.ones_like(t), idx, af)
        out['parseval_diag_T3000'] = [float(x) for x in np.diag(Fq)]
        out['parseval_tail_estimate'] = [float((2 * i + 1) / (math.pi * af * T)) for i in idx]
        Sy = freq_form(t, wt, f(t), idx, af)
        Mf = tofloat(MM['ZETA'][0])
        c = np.array([float(x.mid()) for x in polev['0.5'][0]])[:6]
        # pole-free combination of modes 0 and 2 (indices 0, 1 of the even block)
        v = np.zeros(6); v[0] = c[1]; v[1] = -c[0]; v /= np.linalg.norm(v)
        tail = sum(v[k] ** 2 * (2 * idx[k] + 1) for k in range(6)) / (math.pi * af) * (math.log(T / 2) - math.log(math.pi) + 1) / T
        vv = np.zeros(Mf.shape[0]); vv[:6] = v
        out['symbol_identity'] = {'time_domain_form': float(vv @ Mf @ vv), 'frequency_integral_to_T': float(v @ Sy @ v), 'tail_estimate': float(tail),
                                  'sum': float(v @ Sy @ v + tail)}
        print(json.dumps(out, indent=1)); json.dump(out, open(OUT, 'w'), indent=1); sys.exit()
    rows = []
    print('N = %d (Legendre), TCUT = %g; largest dense float64 matrix %d x %d; quadrature nodes at most %d' % (N, TCUT, N // 2, N // 2, int(TCUT * 16)), flush=True)
    for s in SUP:
        O, MM, polev = assemble(s)
        for nm in OBJ:
            rec = stats(nm, s, O, MM, polev)
            rows.append(rec)
            if nm == 'ZETA':
                rf = stats(nm, s, O, MM, polev, wells_override=FIXED); rf['obj'] = 'ZETA(fixed sigma_2 wells)'; rows.append(rf)
        print(s, 'done %.0fs' % (time.time() - t0), json.dumps({k: rows[-len(OBJ) - 1][k] for k in ('obj', 'n_wells', 'depth', 'even', 'odd')})[:400], flush=True)
        json.dump(rows, open(OUT, 'w'))
    print('written', OUT)
