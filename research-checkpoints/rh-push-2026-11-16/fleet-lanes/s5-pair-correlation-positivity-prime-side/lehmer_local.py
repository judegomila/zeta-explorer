"""Local part of combination 4: (1) known-answer checks of lehmer.py; (2) the control tables below height 2000 restricted to
0.8 x (height of the first off-line zero), against blocks of the same number of zeta zeros."""
import os, json, math, numpy as np
import lehmer, lists
HERE = os.path.dirname(os.path.abspath(__file__)); TAB = os.path.join(HERE, '..', 'c12-control-battery-harness', 'tables')
rng = np.random.default_rng(3)
res = {}
# (1a) G against a brute-force sum on 3000 points (all other points, plus the same tail rule replaced by the exact far sum of a lattice)
x = np.cumsum(rng.gamma(4.0, 0.25, 3000))
D, q = lehmer.lehmer_q(x)
k = 1500; others = np.delete(x, [k, k + 1])
Gb = np.sum((x[k] - others) ** -2 + (x[k + 1] - others) ** -2) + 2 * (1 / (x[k] - x[0] + 0.5) + 1 / (x[-1] - x[k] + 0.5))
res['G_check_rel'] = float(abs(q[k - lehmer.KN] / (D[k - lehmer.KN] ** 2) - Gb) / Gb)
print('G: neighbours + tail against the brute-force sum: relative difference %.2e' % res['G_check_rel'])
# (1b) Hill estimator on samples with P(D < s) ~ s^3 and s^2
for kk in (3.0, 2.0):
    v = rng.uniform(0, 1, 2_000_000) ** (1 / kk)
    h, m = lehmer.hill(v, 0.2); print('Hill on a sample with exponent %.1f: %.3f (m = %d)' % (kk, h, m)); res['hill_check_%g' % kk] = h
# (1c) independent gaps with the GUE Wigner surmise: min-gap block exponent -1/3
s = np.sqrt(rng.gamma(1.5, 4 / math.pi * 2 / 3 * 1.5 / 1.5, 2_000_000))        # density ~ s^2 exp(-c s^2)
me = lehmer.minexp(s / s.mean()); print('min-gap block exponent, independent surmise gaps: %.3f +- %.3f (exact -1/3)' % (me['slope'], me['se'])); res['minexp_check'] = me['slope']
# (2) control tables
zs = lists.load('ZS', tmin=0.0)['x']
def unfold(t): return lists.xzeta(np.asarray(t, dtype=float))
rows = []
for nm in ('DH', 'HEAT--0.1', 'HEAT--0.5'):
    z = json.load(open(os.path.join(TAB, 'zeros_%s.json' % nm)))
    on = np.array([float(v) for v in z['online']]); off = np.array([float(v[1]) for v in z['offline']])
    h1 = off.min(); sel = on[on < 0.8 * h1]
    r = dict(object=nm, first_offline_height=float(h1), n_online_below_0p8=int(len(sel)), n_online_below_2000=int(len(on)), n_offline_pairs=int(len(off)))
    for lab, arr in (('below_0p8', sel), ('all_online_below_2000', on)):
        d = np.diff(arr); d = d / (d.mean()); n = len(d)
        # same number of consecutive zeta gaps, blocks taken along the first 2e5 zeros, each normalised by its own mean
        dz = np.diff(zs); nb = len(dz) // n
        blocks = dz[:nb * n].reshape(nb, n); blocks = blocks / blocks.mean(1, keepdims=True)
        mins = blocks.min(1); lo, med, hi = np.quantile(mins, [0.025, 0.5, 0.975])
        c2 = (blocks < 0.2).sum(1)
        r[lab] = dict(n_gaps=n, min_gap=float(d.min()), zeta_min_gap_quantiles=[float(lo), float(med), float(hi)], rank_in_zeta=float(np.mean(mins < d.min())),
                      n_gaps_below_0p2=int((d < 0.2).sum()), zeta_n_below_0p2_quantiles=[float(v) for v in np.quantile(c2, [0.025, 0.5, 0.975])],
                      var_gap=float(d.var()), zeta_var_gap_quantiles=[float(v) for v in np.quantile(blocks.var(1), [0.025, 0.5, 0.975])])
        if n > 2 * lehmer.KN + 8:
            D, q = lehmer.lehmer_q(arr); r[lab]['q_min'] = float(q.min()); r[lab]['hill_q_0.2'] = lehmer.hill(q, 0.2)[0]
            Dz, qz = lehmer.lehmer_q(zs[:len(arr) * 60]); nbz = len(qz) // len(q)
            mq = qz[:nbz * len(q)].reshape(nbz, len(q)).min(1)
            r[lab]['zeta_q_min_quantiles'] = [float(v) for v in np.quantile(mq, [0.025, 0.5, 0.975])]
    rows.append(r); print(json.dumps(r))
res['tables'] = rows
json.dump(res, open(os.path.join(HERE, 'out', 'lehmer_local.json'), 'w'), indent=1)
