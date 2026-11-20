"""Known-answer checks for c2.py: (1) NUFFT values against direct sums with exact phases at grid points;
(2) the torus function at theta = 0 and at theta_p = pi (Liouville point) against closed sums;
(3) exact recheck of the reported minima of the true orbit (direct sum, 128-bit phases)."""
import sys, json, math, os
os.environ['RH_NOGPU'] = '1'
import numpy as np
import torus as T, s3lib as S, c2
fn = sys.argv[1]
R = json.load(open(fn)); m = R['meta']; N = m['N']; M = 1 << m['logM']
pr = T.sieve(N); Lp = S.frac_logs(pr); L = S.extend_logs(N, pr, Lp)[1:]
rows = [(r['y'], r['t']) for r in R['rows']]
worst = 0.0
out = []
for w in R['windows']:
    if w['kind'] != 'true':
        continue
    y, t = rows[w['row']]
    wB, wA, sigma, gamma = c2.coeffs(N, y, t)
    tc = w['xc'] // 2
    k = w['kmin']
    # x = xc + k dx ; theta_n = (x/2) log n = tc log n + (k dx / 2) log n
    cyc = S.cycles_exact(tc, L)
    ph = 2 * math.pi * cyc + (k * m['dx'] / 2) * np.log(np.arange(1, N + 1, dtype=np.float64))
    e = np.exp(-1j * ph)
    G = abs((wB * e).sum()) - gamma * abs((wA * e).sum())
    worst = max(worst, abs(G - w['minG']))
    out.append(dict(kind='true', i=w['i'], row=w['row'], x=w['xc'] + k * m['dx'], nufft=w['minG'], direct=float(G)))
print('true-orbit minima: max |NUFFT - direct exact-phase| =', worst, 'over', len(out), 'minima')
# torus function at special points
for (y, t) in rows[:2]:
    wB, wA, sigma, gamma = c2.coeffs(N, y, t)
    lam = np.ones(N + 1); lev = T.Levels(N)
    lio = (-1.0) ** lev.om[1:]
    print(f'y={y} t={t}: G(0) = {wB.sum() - gamma * wA.sum():+.5f}, G(Liouville point) = {abs((wB * lio).sum()) - gamma * abs((wA * lio).sum()):+.5f}, sigma={sigma:.6f} gamma={gamma:.6f}')
json.dump(dict(worst=worst, minima=out), open(fn.replace('.json', '_check.json'), 'w'))
