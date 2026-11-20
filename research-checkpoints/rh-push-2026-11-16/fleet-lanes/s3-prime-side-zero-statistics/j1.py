"""s3 combination 4: discrete moment J_1 = sum |F'(rho)|^2 over on-line zeros, per-window spread, T-NR weights, and the small-gap (Rolle) count.
  j1.py zeta  OUT.json NAME KIND PATH NZ [tmin]   Riemann-Siegel Z on GPU (cupy) at gamma +- h, +- 2h (4-point stencil), |zeta'(rho)| = |Z'(gamma)|
  j1.py lz    OUT.json LZ.npz LS.npz:lo:hi ...     Z_chi, Z_chibar samples of the s1 lane (windowed-sinc interpolation), CHI, CHIBAR, DH
Per-zero main term (HEURISTIC, Gonek / Hughes-Keating-O'Connell leading term, Conrey-Snaith second term): l^3/12 + (2 g_q/3) l^2, l = log(q t/2 pi),
g_1 = gamma_0, g_q = gamma_0 + log q/(q-1) (prime q).  The third and fourth coefficients are fitted."""
import sys, math, json, time, numpy as np
import rsref, rmt
PI = math.pi; G0 = 0.5772156649015329
try:
    import cupy as cp
    import os; cp.get_default_memory_pool().set_limit(size=int(os.environ.get("RH_POOL_GB", "6")) * 1024 ** 3); cp.zeros(4).sum(); GPU = True
except Exception:
    cp = np; GPU = False

def sample_Z(T0, deltas, budget=2e8, log=None):
    import mpmath as mp
    from numpy.polynomial import chebyshev as Ch
    mp.mp.dps = 60
    T0m = mp.mpf(T0); dmax = float(deltas.max())
    Nmax = int(math.floor(math.sqrt((T0 + dmax) / (2 * PI)))) + 1
    th0 = mp.siegeltheta(T0m); twopi = 2 * mp.pi
    c = np.empty(Nmax + 1)
    for n in range(1, Nmax + 1):
        v = th0 - T0m * mp.log(n); c[n] = float(v - twopi * mp.floor(v / twopi))
    C0, C1, C2 = rsref.psi_tables()
    n_all = cp.arange(1, Nmax + 1, dtype=cp.float64); logn = cp.log(n_all); amp = 2.0 / cp.sqrt(n_all); cn = cp.asarray(c[1:])
    out = np.empty(len(deltas)); B = max(16, int(budget // Nmax)); t1 = time.time()
    for s in range(0, len(deltas), B):
        d = deltas[s:s + B]
        tau_ = (T0 + d) / (2 * PI); rt = np.sqrt(tau_); N = np.floor(rt).astype(np.int64); p = rt - N
        dth = rsref.dtheta(T0, d) if T0 > 0 else None
        Nmin = int(N.min()); Nmx = int(N.max())
        ph = cp.outer(cp.asarray(d), logn[:Nmin]); ph *= -1; ph += cn[:Nmin][None, :]; ph += cp.asarray(dth)[:, None]; cp.cos(ph, out=ph)
        z = ph @ amp[:Nmin]; z = cp.asnumpy(z) if GPU else z; del ph
        for n in range(Nmin + 1, Nmx + 1):
            m = N >= n
            z[m] += 2.0 / math.sqrt(n) * np.cos(c[n] + dth[m] - d[m] * math.log(n))
        xx = 2 * p - 1
        R = Ch.chebval(xx, C0) + Ch.chebval(xx, C1) / np.sqrt(tau_) + Ch.chebval(xx, C2) / tau_
        z += np.where(N % 2 == 1, 1.0, -1.0) * tau_ ** -0.25 * R
        out[s:s + B] = z
        if log and (s // B) % 500 == 0: log('  sampled %d/%d %.1fs' % (s + len(d), len(deltas), time.time() - t1))
    return out

def zprime(T0, d, L, log=None):
    h = 0.04 * 2 * PI / L
    pts = np.concatenate([d - 2 * h, d - h, d + h, d + 2 * h])
    o = np.argsort(pts); Z = np.empty(len(pts)); Z[o] = sample_Z(T0, pts[o], log=log)
    n = len(d); zm2, zm1, zp1, zp2 = Z[:n], Z[n:2 * n], Z[2 * n:3 * n], Z[3 * n:]
    return (8 * (zp1 - zm1) - (zp2 - zm2)) / (12 * h)

def summarise(name, q, t, y, x, extra=None, win=2000):
    """t ordinates, y = |F'(rho)|^2, x unfolded positions"""
    l = np.log(q * t / (2 * PI)); gq = G0 + (math.log(q) / (q - 1) if q > 1 else 0.0)
    m1 = l ** 3 / 12; m2 = m1 + (2 * gq / 3) * l ** 2
    nw = len(t) // win
    wm = np.array([y[i * win:(i + 1) * win].mean() / m2[i * win:(i + 1) * win].mean() for i in range(nw)])
    r = dict(name=name, q=q, n=int(len(t)), T_lo=float(t[0]), T_hi=float(t[-1]), l_mean=float(l.mean()),
             ratio_leading=float(y.sum() / m1.sum()), ratio_two_term=float(y.sum() / m2.sum()),
             residual_over_l=float((y.sum() - m2.sum()) / l.sum()),
             se_ratio=float(wm.std(ddof=1) / math.sqrt(max(nw, 1))) if nw > 1 else None,
             window_zeros=win, n_windows=int(nw), window_ratio_sd=float(wm.std(ddof=1)) if nw > 1 else None,
             window_ratio_min=float(wm.min()) if nw else None, window_ratio_max=float(wm.max()) if nw else None,
             frac_windows_outside_0p9_1p1=float(((wm < 0.9) | (wm > 1.1)).mean()) if nw else None)
    for w2 in (200, 20000):
        k = len(t) // w2
        if k > 1:
            v = np.array([y[i * w2:(i + 1) * w2].mean() / m2[i * w2:(i + 1) * w2].mean() for i in range(k)])
            r['window_ratio_sd_%d' % w2] = float(v.std(ddof=1)); r['frac_outside_%d' % w2] = float(((v < 0.9) | (v > 1.1)).mean())
    # Rolle / small gaps: zeros of F' with 1/2 < Re < 1/2 + c/l  <->  normalised gap < (2/pi) sqrt(c)
    g = np.diff(x); gl = g / rsref_mm(g)
    r['rolle'] = {}
    for c in (0.01, 0.05, 0.25):
        s = (2 / PI) * math.sqrt(c)
        cnt = int((gl < s).sum()); pred = len(g) * rmt.gap_cdf(s)
        r['rolle'][str(c)] = dict(s=s, count=cnt, gue=pred, ratio=cnt / pred, se=1 / math.sqrt(max(cnt, 1)))
    if extra: r.update(extra)
    return r

def rsref_mm(g, W=2001):
    c = np.concatenate([[0.0], np.cumsum(g)]); n = len(g); h = W // 2
    lo = np.clip(np.arange(n) - h, 0, n); hi = np.clip(np.arange(n) + h + 1, 0, n)
    return (c[hi] - c[lo]) / (hi - lo)

if __name__ == '__main__':
    mode = sys.argv[1]; out = sys.argv[2]
    log = lambda s: print(s, flush=True)
    if mode == 'zeta':
        name, kind, path, NZ = sys.argv[3], sys.argv[4], sys.argv[5], int(float(sys.argv[6]))
        tmin = float(sys.argv[7]) if len(sys.argv) > 7 else 1e4
        if kind == 'odl':
            t = np.loadtxt(path); t = t[t >= tmin][:NZ]; T0 = float(math.floor(t[0])) - 1.0; d = t - T0
            x = (0.5 * t * np.log(t / (2 * PI)) - 0.5 * t - PI / 8) / PI + 1
        else:
            z = np.load(path); T0 = float(z['T0']); d = z['delta'][:NZ]; x = z['x'][:NZ]; t = T0 + d
        L = math.log((T0 + d[len(d) // 2]) / (2 * PI))
        t0 = time.time()
        if kind == 'odl':
            # height varies: local stencil step from the local L
            Ll = np.log(t / (2 * PI)); h = 0.04 * 2 * PI / Ll
            pts = np.concatenate([d - 2 * h, d - h, d + h, d + 2 * h]); o = np.argsort(pts); Z = np.empty(len(pts)); Z[o] = sample_Z(T0, pts[o], log=log)
            n = len(d); zp = (8 * (Z[2 * n:3 * n] - Z[n:2 * n]) - (Z[3 * n:] - Z[:n])) / (12 * h)
        else:
            zp = zprime(T0, d, L, log)
        y = zp * zp
        w = (2.2 + 2 * np.cos(math.fmod(T0, 2 * PI / math.log(3)) * math.log(3) + d * math.log(3))) ** 2
        c3 = np.cos(math.fmod(T0, 2 * PI / math.log(3)) * math.log(3) + d * math.log(3)); c9 = 2 * c3 * c3 - 1
        extra = dict(tnr_ratio_J1=float((y * w).sum() / y.sum()), tnr_independent_value=6.84,
                     weighted_mean_cos_g_log3=float((y * c3).sum() / y.sum()), weighted_mean_cos_2g_log3=float((y * c9).sum() / y.sum()),
                     plain_mean_cos_g_log3=float(c3.mean()), time_s=time.time() - t0)
        r = summarise(name, 1, t, y, x, extra)
        # T-NR per-window spread
        win = 2000; nw = len(t) // win
        v = np.array([(y * w)[i * win:(i + 1) * win].sum() / y[i * win:(i + 1) * win].sum() for i in range(nw)])
        r['tnr_window_ratio_sd'] = float(v.std(ddof=1)) if nw > 1 else None; r['tnr_window_ratio_min'] = float(v.min()); r['tnr_window_ratio_max'] = float(v.max())
        np.save(out.replace('.json', '_zp.npy'), zp.astype(np.float32))
        print(json.dumps(r), flush=True); json.dump(r, open(out, 'w'), indent=1)
    elif mode == 'lz':
        lz = np.load(sys.argv[3]); res = []
        KAP = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1); c2 = (1 + KAP ** 2) / 4
        acc = {k: [[], [], []] for k in ('CHI', 'CHIBAR', 'DH')}
        for spec in sys.argv[4:]:
            f, lo, hi = spec.split(':'); lo = float(lo); hi = float(hi)
            dd = np.load(f); t0 = float(dd['t0']); h = float(dd['h']); Z1 = dd['Z1']; Z2 = dd['Z2']
            for k in acc:
                S = Z1 if k == 'CHI' else Z2 if k == 'CHIBAR' else (Z1 + Z2)
                t = lz['t_' + k]; x = lz['x_' + k]; m = (t >= max(lo, 1000.0)) & (t < hi); t = t[m]; x = x[m]
                idx = (t - t0) / h; e = 0.15
                zp = (8 * (rsref.interp(S, idx + e) - rsref.interp(S, idx - e)) - (rsref.interp(S, idx + 2 * e) - rsref.interp(S, idx - 2 * e))) / (12 * e * h)
                acc[k][0].append(t); acc[k][1].append(zp * zp * (c2 if k == 'DH' else 1.0)); acc[k][2].append(x)
                log('%s %s %d zeros' % (k, spec, len(t)))
        for k in acc:
            t = np.concatenate(acc[k][0]); y = np.concatenate(acc[k][1]); x = np.concatenate(acc[k][2])
            for (a, b) in ((1e3, 1e4), (1e4, 1e5), (1e5, 3e5), (3e5, 1e6), (1e3, 1e6)):
                m = (t >= a) & (t < b)
                if m.sum() < 100: continue
                r = summarise('%s[%g,%g)' % (k, a, b), 5, t[m], y[m], x[m], dict(dh_norm_c2=c2 if k == 'DH' else None))
                print(json.dumps(r), flush=True); res.append(r)
        json.dump(res, open(out, 'w'), indent=1)
