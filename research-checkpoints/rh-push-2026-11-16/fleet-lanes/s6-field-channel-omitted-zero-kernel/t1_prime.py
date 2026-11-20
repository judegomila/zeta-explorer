"""Combination 1, prime side.  The field of all zeros at a real point x, cut at resolution 1/L (L = log X):
   A_L(x) = sum over all zeros y of k_L(x - y) = arch(x) + sum_{n <= X} w(log n/L) [Im c_n cos(x log n) - Re c_n sin(x log n)],  c_n = Lambda_F(n)/sqrt(n),
k_L(r) = L ktilde(r L) -> 1/r for |r| L >> 1 (fk.ktilde).  For a pair a < b of the table (first N zeros), g = b - a:
   K^L(prime) = (2/g)[A_L(a) - A_L(b)] - (2/g) sum_{y in table} [k_L(a - y) - k_L(b - y)]          (omitted zeros, kernel cut at 1/L)
   K^L(ref)   = the same kernel summed over the omitted zeros of the longer list (reference; from t1_zero.py plus the near-zero correction)
   K^L(dens)  = the same kernel integrated against the smooth density above Tb = x_N + half a mean spacing, plus the mirror part.
Controls evaluated on zeta's table with their own coefficients: T-NR (closed form of the q-terms), zeta(s+a)zeta(s-a), Liouville twist, random sign twist.
Usage: t1_prime.py OUT.json XMAX  name:pairs.npz:kind:table.npy[:Nlist]  ...      kind in zeta | chi4 | chi5 | chi5c | chi5cbar"""
import sys, os, math, json, numpy as np, fk

CUTS = [10 ** 4, 10 ** 6, 10 ** 8, 10 ** 10]
BASE = ['zeta', 'chi4', 'chi5', 'chi5c', 'chi5cbar', 'ea0.02', 'ea0.1', 'liou', 'sgn']
def eps_sign(p): return 1.0 - 2.0 * (((p * 2654435761) >> 13) & 1)

def rows_for(n, p, k, cuts):
    """coefficient rows (sin, cos) for every (variant, cut) with cut in cuts; n = p^k arrays"""
    ln = np.log(n.astype(np.float64)); b = np.log(p.astype(np.float64)) / np.sqrt(n.astype(np.float64))
    c5 = fk.chi5c(p) ** k
    re = dict(zeta=np.ones(len(n)), chi4=fk.chi4(p) ** k, chi5=fk.chi5r(p) ** k, chi5c=c5.real, chi5cbar=c5.real,
              liou=(-1.0) ** k, sgn=eps_sign(p) ** k)
    re['ea0.02'] = np.exp(0.02 * ln) + np.exp(-0.02 * ln); re['ea0.1'] = np.exp(0.1 * ln) + np.exp(-0.1 * ln)
    im = dict(chi5c=c5.imag, chi5cbar=-c5.imag)
    cS = np.empty((len(BASE) * len(cuts), len(n))); cC = np.zeros((len(BASE) * len(cuts), len(n)))
    for ci, X in enumerate(cuts):
        w = fk.wfun(ln / math.log(X)) * b
        for vi, v in enumerate(BASE):
            cS[ci * len(BASE) + vi] = -re[v] * w
            if v in im: cC[ci * len(BASE) + vi] = im[v] * w
    return ln, cS, cC

if __name__ == '__main__':
    out, XMAX = sys.argv[1], int(float(sys.argv[2])); specs = [s.split(':') for s in sys.argv[3:]]
    cuts = [X for X in CUTS if X <= XMAX]
    NPROBE = int(os.environ.get('RH_NTOP', '16'))
    objs = []
    for sp in specs:
        name, pf, kind, tf = sp[:4]; d = np.load(pf); Ns = sorted(int(k[1:-2]) for k in d.files if k.endswith('_l'))
        if len(sp) > 4: Ns = [N for N in Ns if N in [int(float(v)) for v in sp[4].split(',')]]
        for N in Ns:
            l = d['N%d_l' % N]; depth = N - 2 - l; rec = int(l[np.argmin(d['N%d_b' % N] - d['N%d_a' % N])])
            m = (depth < NPROBE) | np.isin(depth, (100, 300, 1000)) | (depth > 2000) | (l == rec)
            objs.append(dict(name=name, kind=kind, table=tf, N=N, l=l[m], a=d['N%d_a' % N][m], b=d['N%d_b' % N][m], Ka=d['N%d_Ka' % N][m], KbT=d['N%d_KbT' % N][m], depth=depth[m]))
    pts = np.unique(np.concatenate([np.concatenate([o['a'], o['b']]) for o in objs]))
    V = len(BASE) * len(cuts)
    fk.log('points', len(pts), 'variants x cuts', V, 'XMAX', XMAX, 'planned memory per segment about %.2f GB' % (2 * V * 1.2e6 * 8e-9))
    acc = np.zeros((len(pts), V))
    # prime powers k >= 2 first, then the primes segment by segment
    n, p, k = fk.higher_powers(XMAX); ln, cS, cC = rows_for(n, p, k, cuts); fk.psum(ln, cS, cC, pts, acc); npp = len(n)
    for si, pr in enumerate(fk.prime_segments(XMAX)):
        if len(pr) == 0: continue
        act = [ci for ci, X in enumerate(cuts) if X >= pr[0]]
        ln, cS, cC = rows_for(pr, pr, np.ones(len(pr), np.int64), [cuts[ci] for ci in act])
        tmp = np.zeros((len(pts), len(BASE) * len(act))); fk.psum(ln, cS, cC, pts, tmp)
        for j, ci in enumerate(act): acc[:, ci * len(BASE):(ci + 1) * len(BASE)] += tmp[:, j * len(BASE):(j + 1) * len(BASE)]
        npp += len(pr)
        if si % 50 == 0: fk.log('segment', si, 'primes up to', int(pr[-1]), 'prime powers so far', npp)
    fk.log('prime powers', npp)
    np.savez(out.replace('.json', '_acc.npz'), pts=pts, acc=acc, cuts=np.array(cuts))
    col = lambda v, ci: acc[:, ci * len(BASE) + BASE.index(v)]
    pidx = lambda x: np.searchsorted(pts, x)
    par_of = dict(zeta=(1.0, 0, True), chi4=(4.0, 1, False), chi5=(5.0, 0, False), chi5c=(5.0, 1, False), chi5cbar=(5.0, 1, False))
    res = dict(XMAX=XMAX, cuts=cuts, n_points=len(pts), n_prime_powers=npp, rows=[])
    tables = {}
    for o in objs:
        Q, par, isz = par_of[o['kind']]
        if o['table'] not in tables: tables[o['table']] = np.array(np.load(o['table'], mmap_mode='r'), dtype=np.float64)
        g = tables[o['table']]; N = o['N']; x = g[:N]; a = o['a']; b = o['b']; gap = b - a
        Rn = fk.RHOMAX / math.log(cuts[0]) + 1.0
        lo = np.searchsorted(x, a - Rn); hi = np.searchsorted(x, b + Rn)
        Sfar, _ = fk.pairsum(x, a, b, lo, hi)                                    # table zeros farther than Rn: exact kernel
        Tb = float(x[-1] + 0.5 / fk.dens(x[-1], Q, par))
        for ci, X in enumerate(cuts):
            L = math.log(X)
            Aa = fk.arch(a, Q, par, isz) + col(o['kind'], ci)[pidx(a)]; Ab = fk.arch(b, Q, par, isz) + col(o['kind'], ci)[pidx(b)]
            near = np.array([(fk.kL(a[i] - x[lo[i]:hi[i]], L) - fk.kL(b[i] - x[lo[i]:hi[i]], L)).sum() for i in range(len(a))])
            Kp = (2 / gap) * (Aa - Ab) - (2 / gap) * near - 2 * Sfar
            # reference: omitted zeros of the long list within Rn of the pair, exact kernel replaced by the cut kernel
            corr = np.zeros(len(a)); dcor = np.zeros(len(a))
            for i in range(len(a)):
                j1 = np.searchsorted(g, b[i] + Rn)
                if j1 > N:
                    y = g[N:j1]; corr[i] = (2 / gap[i]) * ((fk.kL(a[i] - y, L) - fk.kL(b[i] - y, L)) - (1 / (a[i] - y) - 1 / (b[i] - y))).sum()
                if Tb < b[i] + Rn:
                    yy = np.arange(Tb, b[i] + Rn, 0.02 / L) + 0.01 / L
                    dcor[i] = (2 / gap[i]) * 0.02 / L * (fk.dens(yy, Q, par) * ((fk.kL(a[i] - yy, L) - fk.kL(b[i] - yy, L)) - (1 / (a[i] - yy) - 1 / (b[i] - yy)))).sum()
            Kr = o['Ka'] + corr; Kd = o['KbT'] + dcor
            row = dict(name=o['name'], kind=o['kind'], N=N, X=X, L=L, top_height=float(x[-1]), resolution_in_mean_spacings=float(fk.dens(x[-1], Q, par)) * 2 * math.pi / L, bands=[])
            ctl = {}
            if o['kind'] == 'zeta':
                for v in ('ea0.02', 'ea0.1', 'liou', 'sgn'):
                    ctl[v] = (2 / gap) * ((fk.arch(a) + col(v, ci)[pidx(a)]) - (fk.arch(b) + col(v, ci)[pidx(b)])) - (2 / gap) * near - 2 * Sfar
                for q in (3, 1000003):
                    lq = math.log(q); th = math.acosh(1.1); ex = np.zeros(len(a)); j = 1
                    while j * lq <= L:
                        cf = float(fk.wfun(j * lq / L)) * lq * (-1.0) ** (j + 1) * 2 * math.cosh(j * th)
                        ex += (2 / gap) * (-cf) * (np.sin(j * a * lq) - np.sin(j * b * lq)); j += 1
                    ctl['tnr_q%d' % q] = Kp + ex
                    GD = lambda xx: -2 * lq * np.sin(xx * lq) / (2.2 + 2 * np.cos(xx * lq))
                    ctl['tnr_q%d_true_field' % q] = o['Ka'] + (2 / gap) * (GD(a) - GD(b))
            for dlo, dhi in ((0, 1), (1, 4), (4, NPROBE), (100, 1001), (1001, 10 ** 5 + 1), (10 ** 5 + 1, 10 ** 9)):
                m = (o['depth'] >= dlo) & (o['depth'] < dhi)
                if not m.any(): continue
                bd = dict(depth=[dlo, dhi], n=int(m.sum()), K_true_median=float(np.median(o['Ka'][m])), Kref_L_median=float(np.median(Kr[m])),
                          max_abs_prime_minus_ref=float(np.abs(Kp - Kr)[m].max()), rms_prime_minus_ref=float(np.sqrt(((Kp - Kr)[m] ** 2).mean())),
                          max_rel_cut_minus_true=float((np.abs(Kr - o['Ka']) / o['Ka'])[m].max()),
                          r_prime=[float((Kp / Kd)[m].min()), float(np.median((Kp / Kd)[m])), float((Kp / Kd)[m].max())],
                          r_ref=[float((Kr / Kd)[m].min()), float(np.median((Kr / Kd)[m])), float((Kr / Kd)[m].max())],
                          r_true=[float((o['Ka'] / o['KbT'])[m].min()), float(np.median((o['Ka'] / o['KbT'])[m])), float((o['Ka'] / o['KbT'])[m].max())])
                for v, Kv in ctl.items():
                    rv = Kv[m] / (Kd[m] if 'true' not in v else o['KbT'][m])
                    bd['ctl_' + v] = dict(r=[float(rv.min()), float(np.median(rv)), float(rv.max())], rms_minus_zeta=float(np.sqrt(((Kv - (Kp if 'true' not in v else o['Ka']))[m] ** 2).mean())))
                row['bands'].append(bd)
            rp = [(float(o['depth'][i]), float(gap[i]), float(o['Ka'][i]), float(Kr[i]), float(Kp[i]), float(Kd[i])) for i in range(len(a)) if o['depth'][i] < 3 or o['depth'][i] >= 100][:14]
            row['samples_depth_gap_Ktrue_Kref_Kprime_Kdens'] = rp
            res['rows'].append(row)
            fk.log(o['name'], N, 'X', X, [(bd['depth'], 'rms p-ref %.2e' % bd['rms_prime_minus_ref'], 'r_prime', ['%.4g' % v for v in bd['r_prime']], 'r_ref', ['%.4g' % v for v in bd['r_ref']]) for bd in row['bands']])
            if ctl: fk.log('     controls', [(bd['depth'], {v: ['%.3g' % t for t in bd['ctl_' + v]['r']] for v in ctl}) for bd in row['bands'][:1] + row['bands'][-1:]])
    fk.jdump(res, out)
