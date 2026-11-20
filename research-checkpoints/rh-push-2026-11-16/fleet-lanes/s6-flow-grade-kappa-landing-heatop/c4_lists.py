"""Combination 4 on stored lists of on-line ordinates: zeros lost by backward time tau from the pair criterion
(collision time tau_c(g, B) <= tau, c4lib), against the prediction with the list's own conductor (q) in the two-point function.
The criterion is checked against the direct count of real zeros of H_{-tau} in c4_count.py.
Usage: c4_lists.py OUT.json NAME:FILE:q[:offset][:Tmin] ...     taus fixed: 1e-6 .. 1e-2"""
import sys, math, json, numpy as np
import c4lib
TAUS = [1e-6, 3e-6, 1e-5, 3e-5, 1e-4, 3e-4, 1e-3, 3e-3, 1e-2]
def run(name, fn, q, off=0.0, tmin=0.0, chunk=200000):
    g = np.load(fn, mmap_mode='r'); Bb = c4lib.Bbar(); n = len(g)
    i0 = int(np.searchsorted(g, tmin)) if tmin else 0
    tot = {t: [0, 0, 0.0, 0.0, 0.0] for t in TAUS}; nz = 0; Bs = []; hts = []
    for a in range(i0, n - 100, chunk):
        gg = np.array(g[a: min(n, a + chunk + 100)], dtype=np.float64); T = off + gg
        if len(gg) < 200: break
        Lm = math.log(q * float(np.median(T)) / (2 * math.pi))
        if Lm < 2: continue
        # unfold with the smooth count of the object: x = (T/2pi)(log(qT/2pi) - 1); differences are exact enough from d x = (L/2pi) dT
        Lloc = np.log(q * T / (2 * math.pi)); x = np.concatenate([[0.0], np.cumsum(np.diff(gg) * 0.5 * (Lloc[1:] + Lloc[:-1]) / (2 * math.pi))])
        s = np.diff(x); i = np.nonzero(s < 0.45)[0]; i = i[(i > 45) & (i < len(x) - 47) & (i < chunk + 50)]
        B = c4lib.env_B(x, i, 40); tc = c4lib.tau_c(s[i], B); m = min(chunk, len(gg) - 100); nz += m
        Bs.append(B[s[i] < 0.3]); hts.append(float(np.median(T)))
        for t in TAUS:
            e = tot[t]; e[0] += int(2 * (tc <= t).sum()); e[1] += int(2 * (s[i] ** 2 / 8 <= t).sum())
            e[2] += m * c4lib.pred(t, Lm, q, None, 'gue'); e[3] += m * c4lib.pred(t, Lm, q, None, 'bk'); e[4] += m * c4lib.pred(t, Lm, q, Bb, 'bk')
    Bs = np.concatenate(Bs) if Bs else np.zeros(0)
    rows = [dict(tau=t, D_gap=e[0], D_gap_isolated=e[1], pred_gue=e[2], pred_bk_pair=e[3], pred_bk_pair_triple=e[4],
                 ratio=(e[0] / e[4] if e[4] else None), ratio_pair_only=(e[0] / e[3] if e[3] else None), ratio_gue=(e[0] / e[2] if e[2] else None),
                 rel_stat=(1 / math.sqrt(e[0] / 2) if e[0] else None)) for t, e in tot.items()]
    return dict(name=name, file=fn, q=q, zeros=nz, heights=[hts[0], hts[-1]] if hts else None, B_mean_close=float(Bs.mean()) if len(Bs) else None, Bbar=Bb, rows=rows)
if __name__ == '__main__':
    res = []
    for spec in sys.argv[2:]:
        p = spec.split(':'); r = run(p[0], p[1], int(p[2]), float(p[3]) if len(p) > 3 and p[3] else 0.0, float(p[4]) if len(p) > 4 else 0.0)
        res.append(r)
        print('%s q=%d zeros %d heights %s  mean B of close pairs %.3f (sine kernel %.3f)' % (r['name'], r['q'], r['zeros'], r['heights'], r['B_mean_close'] or 0, r['Bbar']))
        for e in r['rows']:
            if e['D_gap']: print('   tau=%.0e D=%d ratio to BK pair+triple %.4f +- %.4f  (pair only %.4f, GUE %.4f)' % (e['tau'], e['D_gap'], e['ratio'], e['ratio'] * e['rel_stat'], e['ratio_pair_only'], e['ratio_gue']))
        sys.stdout.flush()
    json.dump(res, open(sys.argv[1], 'w'), indent=0)
