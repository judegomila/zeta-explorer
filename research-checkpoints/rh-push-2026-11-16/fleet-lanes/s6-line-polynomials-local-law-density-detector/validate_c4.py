import sys, math, numpy as np, mpmath as mp
sys.path.insert(0, 'tmp/research-2026-11-16/push/s6-line-polynomials-local-law-density-detector')
import os; os.chdir('tmp/research-2026-11-16/push/s6-line-polynomials-local-law-density-detector')
import lp, tri, orbit, c4
# known answers: (1) Tri reproduces the source floor T(690988) = 7.913667453e-7 (primes <= 11, t0, y0): run on the server; here N = 2000 values of the s3 lane
a = lp.coefs('ZETA', 2000); T = tri.Tri(a, 2310, 2000); lam = orbit.euler_dict(c4.PR11, [1.0]*5, 0.36)
print('T(2000, t=0.36) =', T.value(2000, 0.36, tri.Y0, lam), ' s3/Arb: 0.09258638941981105')
# (2) orbit sums against mpmath at N = 300
N = 300; t = 0.16125; y = 0.1808; fr = np.array([0.0, 0.123456, 0.9])
xN, L, sigma, K, g = tri.consts(N, t, y)
n = np.arange(1, N + 1.0); ln = np.log(n); w = np.exp((t / 4) * ln * ln - sigma * ln)
B, A = orbit.sums(N, t, fr, w[:, None], (w * np.exp(y * ln))[:, None])
mp.mp.dps = 40
for j, f in enumerate(fr):
    x = 4 * mp.pi * (mp.mpf(N) ** 2 - mp.mpf(t) / 16) + 4 * mp.pi * mp.mpf(float(f)) * (2 * N + 1)
    ref = sum(mp.mpf(float(w[m - 1])) * mp.exp(-1j * (x / 2) * mp.log(m)) for m in range(1, N + 1))
    print('  B err', abs(complex(ref) - B[j, 0]))
for spec in ('ZETA', 'CHI4', 'DH:none', 'DH:dh96', 'LIOU', 'TNR3:own', 'EA:own'):
    o = spec.split(':'); r = c4.run(o[0], o[1] if len(o) > 1 else 'euler11', 3000, 2000, 0.36, 0.1808)
    print(spec, {k: (round(v, 5) if isinstance(v, float) else v) for k, v in r.items() if k in ('tri', 'two', 'true_min', 'chan_min', 'lemma_ok', 'ratio_true_two', 'g')})
