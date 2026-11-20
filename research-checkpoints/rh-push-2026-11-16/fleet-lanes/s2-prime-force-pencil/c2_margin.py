"""Combination 2: Gordan margin rho(N,T) of the signed-force system at near-collision extrema.
Usage: c2_margin.py OBJ MODE NLIST OUT.json [TMAX] [ratio]
 OBJ: zeta | chi | dh | alt | heat<tau> | tnr<q>   (tnr: zeta's zeros, F = zeta(s)(q^(s-1/2) + c + q^(1/2-s)), c = 2.2; phase theta - x log q)
 MODE: cos (real weights) | cossin (complex weights)
Ladder: heights T_j geometric (ratio, default 2^(1/4)); for each N the ladder stops at the first infeasible level, then bisects on the
number of constraints (height order) to locate the onset K_0(N) = least K with rho = 0."""
import sys, os, json, math, numpy as np
import lib
from lib import log

def build(obj, N, mode, tmax=None, cache={}):
    key = (obj, tmax)
    if key not in cache:
        cq = None
        if obj.startswith('tnr'):
            q = float(obj[3:]); g, cond, s0 = lib.load_list('zeta'); c = 2.2; lq = math.log(q)
            extra = lambda x: -2 * lq * np.sin(x * lq) / (c + 2 * np.cos(x * lq))
            cq = q
        else:
            g, cond, s0 = lib.load_list(obj); extra = None
        if tmax: g = g[g <= tmax]
        ncf = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out', 'nc_%s_%d.npz' % (obj, len(g)))
        if os.path.exists(ncf): dd = np.load(ncf); x, s, k = dd['x'], dd['s'], dd['k']
        else:
            x, s, k, tight = lib.near_collisions(g, cond=cond, extra=extra, sign0=s0)
            if len(g) > 5000000: np.savez(ncf, x=x, s=s, k=k)
        note = ''
        if obj == 'zeta' or cq:
            m = x < 1000.0
            cf = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out', 'mpx_%s.npy' % obj)
            if os.path.exists(cf): xm = np.load(cf)
            else: xm = lib.mp_extrema_zeta(x[m], g[k[m]], g[k[m] + 1], extra_q=cq); np.save(cf, xm)
            if len(xm) == m.sum():
                note = 'mp extrema below 1000: %d, max shift/gap %.3e' % (m.sum(), np.abs(xm - x[m] ).max() if m.any() else 0); x[m] = xm
        if obj in ('chi', 'chibar', 'dh', 'alt'):
            for p in (os.path.join(lib.DATA, 'dir_samples.npz'), os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'dir_samples.npz'), os.path.join(lib.DATA, 'dir2e5_samples.npz')):
                if os.path.exists(p): break
            d = np.load(p); h = float(d['h']); dhp = bool(d['dh_plus'])
            Smp = {'chi': d['Z1'], 'chibar': d['Z2'], 'dh': d['Z1'] + d['Z2'] if dhp else d['Z1'] - d['Z2'], 'alt': d['Z1'] - d['Z2'] if dhp else d['Z1'] + d['Z2']}[obj]
            xr, F, ok = lib.refine_from_samples(x, g[k], g[k + 1], Smp, h)
            par = -s[ok] * np.sign(F[ok])       # +1 when parity rule (with sign0=+1) matches the sampled sign
            flip = np.sign(np.sum(par))
            note = 'extrema refined on samples: %d of %d, median shift/gap %.2e; parity sign agrees (after global sign %+d) on %d of %d' % (
                ok.sum(), len(x), np.median(np.abs(xr - x)[ok] / (g[k + 1] - g[k])[ok]), flip, int((par * flip > 0).sum()), int(ok.sum()))
            x = xr; s = s.copy(); s[ok] = -np.sign(F[ok])   # sign F'' = -sign F at the extremum, from the samples
            s[~ok] = s[~ok] * flip
        th = lib.theta_chi5(x) if obj in ('chi', 'chibar', 'dh', 'alt') else lib.theta_zeta(x)
        cache[key] = (x, s, th, g, cond, cq, note)
        if note: log(note)
    x, s, th, g, cond, cq, note = cache[key]
    n = np.arange(1, N + 1, dtype=np.float64); f = np.log(n); a = 1 / np.sqrt(n)
    if cq: f = f - math.log(cq)
    return lib.System(x, s, th, f, a, sin=(mode == 'cossin')), g, cond

if __name__ == '__main__':
    obj, mode = sys.argv[1], sys.argv[2]; NL = [int(v) for v in sys.argv[3].split(',')]; out = sys.argv[4]
    tmax = float(sys.argv[5]) if len(sys.argv) > 5 else None
    ratio = float(sys.argv[6]) if len(sys.argv) > 6 else 2 ** 0.25
    res = dict(obj=obj, mode=mode, rows=[], onset={})
    for N in NL:
        S, g, cond = build(obj, N, mode, tmax)
        log('%s %s N=%d: zeros %d, near-collisions %d, heights %.2f .. %.2f, dim %d' % (obj, mode, N, len(g), S.K, S.x[0], S.x[-1], S.dim))
        x0 = S.x[0]; span = S.x[-1] - x0
        # ladder in the number of constraints K (heights S.x[K-1]); start where K ~ dim/2
        lv = []; K = max(8, S.dim // 4)
        if os.environ.get('C2_KSTART'): K = int(float(os.environ['C2_KSTART'])); ratio = float(os.environ.get('C2_KRATIO', '2')) ** 0.5
        while K < S.K: lv.append(K); K = int(math.ceil(K * ratio ** 2))  # K grows about like T log T: ratio^2 per step keeps steps modest
        lv.append(S.K)
        W = None; lastfeas = None; firstinf = None; lastp = None
        for K in lv:
            r = lib.margin(S, K, W0=W)
            W = r['work']
            row = dict(N=N, K=int(K), T=float(S.x[K - 1]), rho_upper=r['rho_upper'], rho_lower=r['rho_lower'], status=r['status'], passes=r['passes'], support=int(len(r['work'])))
            res['rows'].append(row); log('  N=%d K=%d T=%.2f rho in [%.6f, %.6f] %s passes %d support %d' % (N, K, row['T'], row['rho_lower'], row['rho_upper'], r['status'], r['passes'], len(r['work'])))
            if r['status'] == 'infeasible': firstinf = (K, r); break
            lastfeas = K
            if os.environ.get('RH_GPU_DOTS') == '1' and K == lv[-1]:      # CPU recheck of the final level
                v = S.dots(r['p'], K, cpu=True); nr = float(np.linalg.norm(r['p'])); row['cpu_recheck_rho_lower'] = float(v.min() / nr)
                log('  CPU recheck at K=%d: min g.p/|p| = %.6f (gpu %.6f)' % (K, v.min() / nr, r['rho_lower'])); json.dump(res, open(out, 'w'))
        if firstinf and lastfeas:
            lo, hi = lastfeas, firstinf[0]; cert = firstinf[1]
            while hi - lo > 1:
                mid = (lo + hi) // 2; r = lib.margin(S, mid, W0=W)
                if r['status'] == 'infeasible': hi = mid; cert = r
                else: lo = mid; W = r['work']
            rr = lib.margin(S, lo, W0=W)
            T0 = float(S.x[hi - 1]); AFE = 2 * math.pi * N * N / cond
            res['onset'][str(N)] = dict(K0=int(hi), T0=T0, T0_over_2piN2_over_q=T0 / AFE, rho_before=rr['rho_upper'], rho_before_lower=rr['rho_lower'],
                                        cert_idx=[int(i) for i in cert['work'][cert['lam'] > 0]], cert_lam=[float(v) for v in cert['lam'][cert['lam'] > 0]],
                                        cert_x=[float(v) for v in S.x[cert['work'][cert['lam'] > 0]]], cert_s=[float(v) for v in S.s[cert['work'][cert['lam'] > 0]]])
            log('ONSET %s %s N=%d: K0=%d T0=%.3f  T0/(2 pi N^2/q)=%.4f  rho just before %.3e  certificate support %d' % (obj, mode, N, hi, T0, T0 / AFE, rr['rho_upper'], len(res['onset'][str(N)]['cert_idx'])))
        else:
            res['onset'][str(N)] = None; log('no onset within the list for N=%d (last status %s)' % (N, 'feasible' if lastfeas else 'infeasible at first level'))
        json.dump(res, open(out, 'w'))
