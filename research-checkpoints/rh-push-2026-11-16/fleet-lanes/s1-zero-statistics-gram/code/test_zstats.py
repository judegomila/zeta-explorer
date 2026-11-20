"""Known-answer test of zstats on the 3474 zeta zeros below 4000 (battery table) and on a jittered lattice."""
import sys, json, math, numpy as np, zstats as Z
d = json.load(open(sys.argv[1])); key = [k for k in d if isinstance(d[k], list) and len(d[k]) > 1000][0]
t = np.array([float(v) for v in d[key]]); x = Z.theta_zeta(t) / math.pi + 1
print('zeta zeros', len(t), 'x[-1]-(n) =', x[-1] - len(t))
c = Z.chat(t, t, 0.0, 12)
print('c^(n) vs Lambda(n):', {n: round(c[n][0], 5) for n in c}, ' expected log2=%.5f log3=%.5f log5=%.5f log7=%.5f, 0 at 6,10,12' % (math.log(2), math.log(3), math.log(5), math.log(7)))
rng = np.random.default_rng(1)
xl = np.arange(200000) + 0.1 * rng.standard_normal(200000)
print('jittered lattice r1:', [(a['L'], round(a['r1_raw'], 3)) for a in Z.r1stat(xl)][:3], '(exact -1/2);  C(1), C(2):', [round(v[2], 4) for v in Z.s2stat(xl)['table'][:2]], '(exact -1/2, 0)')
g = Z.wigner_sample(2000000, rng); print('wigner sample mean gap', g.mean(), 'runmin exponent', Z.runmin_fit(g)[0], '(expected near -1/3)')
