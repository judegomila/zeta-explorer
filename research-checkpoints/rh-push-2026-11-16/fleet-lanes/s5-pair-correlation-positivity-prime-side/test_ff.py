"""known-answer checks of ff.py: (1) FFT kernel integrals against the direct weighted pair sum; (2) Poisson points: R_lam = 1/lam + 1;
(3) GUE closed forms R_lam = 1/lam + lam/3 (lam <= 1), 1 + 1/(3 lam^2) (lam > 1); (4) 199k zeta zeros against the BK prediction."""
import os, json, math, numpy as np
os.environ['S5_LOCAL'] = '1'
import ff, lists
rng = np.random.default_rng(1)
Bl = 2048.0
x = np.sort(rng.uniform(0, Bl, 2048))
al, I, sw2, n = ff.periodogram(x, 0.0, Bl)
da = 1 / (2 * Bl); res = {}
mx = 0
for k in ff.kernels():
    g = ff.g_alpha(k, al)
    Q = (g[0] * I[0] + 2 * np.sum(g[1:] * I[1:])) * da
    Qd = ff.direct_Q(x, 0.0, Bl, k)
    mx = max(mx, abs(Q - Qd))
res['fft_vs_direct_max_abs_diff'] = mx
print('FFT vs direct pair sum, 2048 points, 24 kernels: max abs diff %.2e' % mx)
for l in ff.LAMS:
    g = ff.gue_value(('tri', l), False); ex = 1 / l + l / 3 if l <= 1 else 1 + 1 / (3 * l * l)
    assert abs(g - ex) < 2e-5, (l, g, ex)
print('GUE closed forms for tri(lam): ok')
for W in ff.WS:
    g = ff.gue_value(('fej', W), True); ex = W * W / 6 if W <= 1 else 2 * (0.5 - 2 / (3 * W) + 1 / (4 * W * W) + (W / 3) * (1 - 1 / W) ** 3)
    assert abs(g - ex) < 2e-5, (W, g, ex)
print('GUE closed forms for fej(W): ok')
# Poisson
xs = np.sort(rng.uniform(0, 40 * 4096.0, 40 * 4096))
r = ff.analyse(dict(name='POISSON', x=xs, t0=0.0, d=xs + 1e6, q=1, kind='sim'), Bl=4096.0, log=lambda s: None)
for e in r['kernels']:
    if e['kind'] == 'tri': print('  Poisson R_%.2f = %.4f +- %.4f  (exact %.4f)' % (e['par'], e['full'], e['full_se'], 1 / e['par'] + 1))
res['poisson'] = [e for e in r['kernels'] if e['kind'] == 'tri']
lst = lists.load('ZS')
p = ff.Pred(1, R=40.0)
r = ff.analyse(lst, Bl=16384.0, pred=p, log=lambda s: None)
print('zeta, zeros 1000 .. 139501 (%d blocks):' % r['nblocks'])
for e in r['kernels']:
    print('  %-5s %.3f  meas %.5f +- %.5f   GUE %.5f   BK %.5f (diag part %.5f)   (meas-BK)/se %.2f' % (e['kind'], e['par'], e['full'], e['full_se'], e['gue_full'], e['gue_full'] + e['arith'], e['arith_diag'], (e['full'] - e['gue_full'] - e['arith']) / e['full_se']))
res['zeta_200k'] = r['kernels']
json.dump(res, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out', 'test_ff.json'), 'w'), indent=1)
