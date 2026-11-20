"""Combination 4: number variance of the listed ordinates in unfolded boxes, against the GUE (sine-kernel) value, and the
correlation of counts in adjacent boxes.
  node window: half-width Delta = sqrt(T/2pi) in t, mean count Lw = 2 Delta log(qT/2pi)/2pi; r = Var/Sigma2_GUE(Lw) with
  Sigma2_GUE(L) = (log(2 pi L) + gamma + 1)/pi^2 (the node's formula) and with the exact sine-kernel value.
  ladder: box lengths ell; Var N(ell), rho(ell) = Cov(N[u-ell,u), N[u,u+ell)) / Var; GUE: rho = Sigma2(2 ell)/(2 Sigma2(ell)) - 1.
Counts on a sliding grid of step 1/4 in the unfolded variable; errors from 20 contiguous chunks.
Usage: c4_nv.py OUT.json NAME [detrend]"""
import sys, math, json, time, numpy as np
from scipy.special import sici
import lists
PI = math.pi; EG = 0.5772156649015329

def sig2_exact(L):
    L = np.asarray(L, dtype=float); si, ci = sici(2 * PI * L)
    return (np.log(2 * PI * L) + EG + 1 - np.cos(2 * PI * L) - ci) / PI ** 2 + L * (1 - 2 / PI * si)

def sig2_node(L): return (math.log(2 * PI * L) + EG + 1) / PI ** 2

def stream_stats(x, u0, u1, step, ell, nch=20, blk=2_000_000):
    """counts a = N[u-ell,u) - ell, b = N[u,u+ell) - ell on the grid u0 + k step < u1, in blocks (memory about 100 MB);
    returns n, mean a, var a (global mean removed), its chunk error, rho = cov(a,b)/var, its chunk error"""
    n = int((u1 - u0) / step)
    if n < 10 * nch: return None
    edges = np.linspace(0, n, nch + 1).astype(np.int64)
    S = np.zeros((nch, 5))            # sum a, sum b, sum a^2, sum ab, count
    for ci in range(nch):
        for s0 in range(edges[ci], edges[ci + 1], blk):
            s1 = min(edges[ci + 1], s0 + blk)
            u = u0 + step * np.arange(s0, s1)
            i0 = np.searchsorted(x, u - ell); i1 = np.searchsorted(x, u); i2 = np.searchsorted(x, u + ell)
            a = (i1 - i0) - ell; b = (i2 - i1) - ell
            S[ci] += (a.sum(), b.sum(), (a * a).sum(), (a * b).sum(), len(a))
    T = S.sum(0); ma = T[0] / T[4]; mb = T[1] / T[4]
    va = S[:, 2] / S[:, 4] - 2 * ma * S[:, 0] / S[:, 4] + ma * ma
    cab = S[:, 3] / S[:, 4] - ma * S[:, 1] / S[:, 4] - mb * S[:, 0] / S[:, 4] + ma * mb
    rho = cab / va
    return n, float(ma), float(va.mean()), float(va.std(ddof=1) / math.sqrt(nch)), float(cab.mean() / va.mean()), float(rho.std(ddof=1) / math.sqrt(nch))

def main():
    out, name = sys.argv[1], sys.argv[2]
    detrend = len(sys.argv) > 3 and sys.argv[3] == 'detrend'
    d = lists.load(name); x = d['x'].copy(); t = d['t']; q = d['q']
    if detrend:   # replace the unfolded variable by a smooth fit of the rank (on-line lists of controls: density of the listed zeros)
        i = np.arange(len(x), dtype=float)
        c = np.polyfit(x - x[0], i, 3); x = np.polyval(c, x - x[0])
    res = dict(name=name, n=len(x), detrend=detrend, T_lo=float(t[0]), T_hi=float(t[-1]), rows=[], node=[])
    # irrational steps: a grid commensurate with the mean spacing samples S(t) at a fixed phase of the count and biases the variance
    step = 0.2718281828 if len(x) < 5_000_000 else 1.3247179572
    res['step'] = step
    span = x[-1] - x[0]
    for ell in [0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304]:
        if 2 * ell > span / 3: break
        r = stream_stats(x, x[0] + ell + 1, x[-1] - ell - 1, step, ell)
        if r is None: break
        n_, mean, var, verr, rho, rerr = r
        s1 = float(sig2_exact(ell)); s2 = float(sig2_exact(2 * ell))
        res['rows'].append(dict(ell=ell, mean=mean, var=var, var_err=verr, gue=s1, ratio=var / s1, rho=rho, rho_err=rerr,
                                rho_gue=s2 / (2 * s1) - 1, rho_lead=-0.5 + math.log(2) / (2 * math.log(2 * PI * ell))))
    # node windows (half-width sqrt(T/2pi)) at a set of heights inside the list
    heights = [T for T in (1e4, 3e4, 7e4, 1.5e5, 3e5, 5e5, 1e6) if t[0] < T * 0.8 and t[-1] > T * 1.25]
    whole = not heights
    if whole: heights = [float(np.median(t))]
    for T in heights:
        Dl = math.sqrt(T / (2 * PI)); Lw = 2 * Dl * math.log(q * T / (2 * PI)) / (2 * PI)
        lo, hi = (0, len(t)) if whole else (np.searchsorted(t, T * 0.8), np.searchsorted(t, T * 1.25))
        xs0, xs1 = x[lo], x[hi - 1]
        if xs1 - xs0 < 3 * Lw:
            res['node'].append(dict(T=T, Lw=Lw, note='list shorter than 3 windows')); continue
        half = Lw / 2
        r = stream_stats(x, xs0 + half + 1, xs1 - half - 1, step, half)
        # full window count = a + b: var(a + b) = 2 var (1 + rho)
        n_, mean, var, verr, rho, rerr = r
        vfull = 2 * var * (1 + rho); efull = 2 * math.hypot(verr * (1 + rho), var * rerr)
        res['node'].append(dict(T=T, Delta=Dl, Lw=Lw, var=vfull, var_err=efull, sd=math.sqrt(vfull), half_var=var, half_rho=rho, half_rho_err=rerr,
                                gue_node=sig2_node(Lw), gue_exact=float(sig2_exact(Lw)), r=vfull / sig2_node(Lw), r_err=efull / sig2_node(Lw),
                                independent_windows=float((xs1 - xs0) / Lw), samples=n_))
    json.dump(res, open(out, 'w'))
    for r in res['node']: print(name, 'node', json.dumps(r), flush=True)
    for r in res['rows']: print(name, 'ell=%g var=%.4f+-%.4f gue=%.4f ratio=%.3f rho=%.4f+-%.4f rho_gue=%.4f' % (r['ell'], r['var'], r['var_err'], r['gue'], r['ratio'], r['rho'], r['rho_err'], r['rho_gue']), flush=True)

if __name__ == '__main__':
    main()
