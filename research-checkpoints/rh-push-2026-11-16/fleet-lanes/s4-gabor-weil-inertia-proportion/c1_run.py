"""Combination 1 (and the prime side of 2, 3): spectrum of the prime-side Gabor-Weil matrix G on one window.
Usage: c1_run.py OUT.jsonl FAMILY T lam n [a=..] [seed=..] [zeros=kind:path[:key]] [margin=4000] [save=1] [win=0|1] [nu0=..]
  L = lam * log(qT/2pi) (own analytic conductor), X = e^L, n nodes from nu0 = T at spacing 2 pi/L.
  Reports: counts N_theta = #{eig > theta}, lowest eigenvalues, moments m_k = (1/n) sum eig^k, trace, Frobenius norm,
  the Montgomery-Taylor-window numbers C = tr(G_w^2) / (w0 tr G_w), smooth zero count of the window,
  and (with zeros=) the same from the zero side built from the listed (on-line) ordinates, plus the inertia of G_prime - G_list.
float64: a screen. Counts are reported with the distance of the nearest eigenvalue to theta (Weyl margin)."""
import sys, math, json, time, os
import numpy as np
import w3, gw
PI = math.pi


def load_list(spec):
    p = spec.split(':'); kind, path = p[0], p[1]
    if kind == 'odl':
        return np.loadtxt(path)
    z = np.load(path)
    if kind in ('blk', 'heat'):
        return float(z['T0']) + z['delta']
    if kind == 'lz':
        return z['t_' + p[2]]
    raise ValueError(kind)


def main():
    out_path, name, T, lam, n = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), int(sys.argv[5])
    kw = dict(x.split('=', 1) for x in sys.argv[6:])
    a = float(kw.get('a', 0)); seed = int(kw.get('seed', 0)); margin = int(kw.get('margin', 4000)); win = int(kw.get('win', 1))
    nu0 = float(kw.get('nu0', T))
    t0 = time.time()
    print('planned allocation: G %d x %d float64 = %.2f GB; peak about 2x during the eigensolve copy and window pass' % (n, n, n * n * 8 / 1e9), flush=True)
    # bandwidth from the family's own density at height T
    probe = gw.family(name, 10.0, seed, a) if name == 'EA' else gw.family(name, 10.0, seed)
    Ld = gw.density_log(probe, T)
    L = lam * Ld; X = math.exp(L)
    fam = gw.family(name, X, seed, a) if name == 'EA' else gw.family(name, X, seed)
    rec = dict(family=name, T=T, nu0=nu0, lam=lam, n=n, a=a, seed=seed, L=L, X=X, logdens=Ld, nterms=int(len(fam['n'])), delta=2 * PI / L, H=n * 2 * PI / L)
    xp = np
    if kw.get('gpu'):
        try:
            import cupy as cp
            cp.get_default_memory_pool().set_limit(size=24 * 1024 ** 3); xp = cp
        except Exception as e:
            print('cupy unavailable, numpy used:', e, flush=True)
    G, parts = gw.build_G(fam, nu0, n, X, xp=xp)
    delta = parts['delta']
    lo = nu0 - delta / 2; hi = nu0 + (n - 0.5) * delta
    rec['N_smooth'] = gw.count_smooth(fam, hi) - gw.count_smooth(fam, lo)
    rec['trace'] = float(np.trace(G)); rec['fro2'] = float(np.einsum('ij,ij->', G, G)); rec['absmax'] = float(max(np.abs(G[i:i + 1024]).max() for i in range(0, n, 1024)))   # blockwise: no n x n temporary
    if win:
        q, Cw, Cs = gw.mt_window(4)
        ws = gw.window_stats(G, q)
        ws['C_meas'] = ws['fro2'] / (ws['w0'] * ws['trace']); ws['C_w'] = Cw; ws['C_star'] = Cs
        rec['mt'] = ws
        rec['box_C_meas'] = rec['fro2'] / rec['trace']
    rec['build_s'] = time.time() - t0
    if 'count' in kw:
        t = load_list(kw['count'])
        rec['list_in_window'] = int(((t >= lo) & (t < hi)).sum()); del t
    Gz = None
    if 'zeros' in kw:
        t = load_list(kw['zeros'])
        m = (t > lo - margin * delta) & (t < hi + margin * delta)
        tz = t[m]
        rec['list_in_window'] = int(((t >= lo) & (t < hi)).sum()); rec['list_used'] = int(len(tz))
        y = (tz - nu0) * L / (2 * PI)
        Gz = gw.zero_side_G(y, n)
        Dm = G - Gz
        rec['diff_absmax'] = float(np.abs(Dm).max()); rec['diff_fro2'] = float(np.einsum('ij,ij->', Dm, Dm)); rec['diff_trace'] = float(np.trace(Dm))
        evd = gw.eigs(Dm); del Dm
        rec['diff'] = dict(lam_min=float(evd[0]), lam_max=float(evd[-1]),
                           n_above={str(th): int((evd > th).sum()) for th in (0.01, 0.03, 0.1, 0.3, 1.0, 3.0)},
                           n_below={str(th): int((evd < -th).sum()) for th in (0.01, 0.03, 0.1, 0.3, 1.0, 3.0)},
                           ev_low=[float(x) for x in evd[:8]], ev_high=[float(x) for x in evd[-8:]])
        if kw.get('save'): np.save(out_path.replace('.jsonl', '') + '_%s_%g_%g_%d_diffev.npy' % (name, T, lam, n), evd)
        evz = gw.eigs(Gz); del Gz
        rec['zero_side'] = gw.spectrum_summary(evz)
    ev = gw.eigs(G); del G
    rec['prime_side'] = gw.spectrum_summary(ev)
    if kw.get('save'): np.save(out_path.replace('.jsonl', '') + '_%s_%g_%g_%d_a%g_s%d_ev.npy' % (name, T, lam, n, a, seed), ev)
    rec['time_s'] = time.time() - t0
    with open(out_path, 'a') as f: f.write(json.dumps(rec) + '\n')
    ps = rec['prime_side']
    print('%s T=%g lam=%g n=%d X=%.4g terms=%d N_smooth=%.1f trace=%.1f | min %.4g max %.4g | N>0: %d N>0.1: %d N>0.5: %d | m=%s | C_mt=%s | %.0fs' % (
        name, T, lam, n, X, rec['nterms'], rec['N_smooth'], rec['trace'], ps['lam_min'], ps['lam_max'], ps['N_theta']['0.0'], ps['N_theta']['0.1'], ps['N_theta']['0.5'],
        np.round(ps['m'], 4).tolist(), ('%.5f' % rec['mt']['C_meas']) if win else '-', rec['time_s']), flush=True)

if __name__ == '__main__':
    main()
