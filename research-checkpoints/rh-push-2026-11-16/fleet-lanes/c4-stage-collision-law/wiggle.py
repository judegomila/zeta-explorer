# where do the stationary points of Phi = theta + arg P_X sit relative to the stage levels and to the zeta zeros?
# For each maximal interval with Phi' < 0 on a 64-per-spacing grid: |cos Phi| at the minimum of Phi' (1 = anti-point, 0 = stage zero),
# the drop of Phi across the interval, and (zeta family) the normalised gap of the zeta zeros that contains it and the position inside the gap.
# float64 screen; zeta zeros from acb.zeta_zeros.
import sys, json, math, numpy as np
import stage
from stage import *
def run(key):
    ctx.prec = PREC; Tn = float(key); n0 = int(float(arb(Tn).zeta_nzeros().mid())) + 1
    g0 = acb.zeta_zeros(n0, 1)[0].imag; T0 = math.floor(float(g0.mid())); G['T0'] = float(T0)
    with Pool(NW) as pool: zz = pool.map(w_zeros, [(n0 + i, min(200, 2001 - i)) for i in range(0, 2001, 200)])
    zt = np.array([x for r in zz for x in r]); tA = T0 + zt[0]; LT = math.log(Tn); sp = TWOPI / math.log(tA / TWOPI)
    Xs = [('log2', LT ** 2), ('a0.5', Tn ** 0.5)]; pr = primes_upto(max(x for _, x in Xs)); cnts = [int(np.searchsorted(pr, x, 'right')) for _, x in Xs]
    n64 = int((zt[-1] - zt[0]) / sp * 64); tau = zt[0] + np.arange(n64) * sp / 64
    print('planned memory: %d x %d complex x ~6 arrays in chunks of <= 2e6' % (n64, max(cnts)), flush=True)
    out = {'key': key, 'spacing': sp}
    for fi, f in enumerate([Fam('zeta', T0, pr, cnts), Fam('U', T0, pr, cnts, seed=20261118), Fam('U', T0, pr, cnts, seed=7)]):
        Wv = []; RD = []
        for i in range(0, n64, 4096):
            w, L, D = f.W(tau[i:i + 4096]); Wv.append(w); RD.append(D.real)
        Wv = np.concatenate(Wv); RD = np.concatenate(RD); thp = f.thetap(tau)
        for col, (xn, xv) in enumerate(Xs):
            dphi = thp - RD[:, col]; neg = dphi < 0; ph = np.unwrap(np.angle(Wv[:, col])); rows = []
            edges = np.flatnonzero(np.diff(neg.astype(int))); starts = [e + 1 for e in edges if not neg[e]]; ends = [e for e in edges if neg[e]]
            for s in starts:
                e = next((x for x in ends if x >= s), None)
                if e is None: continue
                j = s + int(np.argmin(dphi[s:e + 1])); t = tau[j]; k = int(np.searchsorted(zt, t))
                row = {'abscos': float(abs(math.cos(ph[j]))), 'drop_over_pi': float((ph[s - 1] - ph[min(e + 1, n64 - 1)]) / math.pi), 'len_sp': float((e - s + 1) / 64), 'depth': float(dphi[j] / thp[j])}
                if 0 < k < len(zt): row['gap_sp'] = float((zt[k] - zt[k - 1]) / sp); row['pos'] = float((t - zt[k - 1]) / (zt[k] - zt[k - 1]))
                rows.append(row)
            gaps = np.diff(zt) / sp
            st = {'n': len(rows)}
            if rows:
                ac = np.array([r['abscos'] for r in rows]); st.update({'abscos_min': float(ac.min()), 'abscos_median': float(np.median(ac)), 'frac_abscos_gt_0.9': float((ac > 0.9).mean()),
                    'drop_over_pi_max': float(max(r['drop_over_pi'] for r in rows)), 'drop_over_pi_median': float(np.median([r['drop_over_pi'] for r in rows]))})
                gg = np.array([r['gap_sp'] for r in rows if 'gap_sp' in r]); pp = np.array([r['pos'] for r in rows if 'pos' in r])
                if len(gg): st.update({'gap_median': float(np.median(gg)), 'gap_max': float(gg.max()), 'pos_min': float(pp.min()), 'pos_max': float(pp.max()), 'all_gaps_median': float(np.median(gaps)),
                    'n_gaps_below_gapmax': int((gaps <= gg.max()).sum()), 'n_distinct_gaps_hit': int(len(set(np.round(gg, 9)))),
                    'smallest_gaps_hit_rank': sorted(int(np.searchsorted(np.sort(gaps), g)) for g in set(np.round(gg, 9)))[-1]})
            out['%s%d_%s' % (f.kind, fi, xn)] = st; print(key, f.kind, xn, json.dumps(st), flush=True)
    json.dump(out, open('wiggle_%s.json' % key, 'w'), indent=1)
if __name__ == '__main__':
    for k in sys.argv[1:]: run(k)
