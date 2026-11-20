import json, numpy as np, math, sys
from scipy.interpolate import CubicSpline
V = 0.17999
d = json.load(open('psi_48.json')); k = np.array(d['k']); psi = np.array(d['psi'])
Kmc = CubicSpline(np.concatenate([[0], k]), np.concatenate([[0], 2 * math.pi * psi / k]), bc_type=((1, -(1 + V)), 'not-a-knot'))
for f in sys.argv[1:]:
    D = json.load(open(f)); L = D['L']; rows = D['rows']
    print(f, 'L=%.3f' % L)
    print('  primes: n, k, K_P, K_sine, ratio')
    for r in rows:
        if r['m'] == 1 and r['n'] in (2, 3, 5, 7, 11, 13, 17, 23, 31, 47, 67, 97, 127, 199, 307, 499, 997, 1999, 2999, 3989, 4999, 7499, 9973, 14983, 19997, 29989, 39989):
            print('   %6d %.4f %+.5f %+.5f %.4f' % (r['n'], r['k'], r['KP'], float(Kmc(r['k'])), r['KP'] / float(Kmc(r['k']))))
    print('  prime powers m>=2: n, k, K_P, K_sine, ratio')
    for r in rows:
        if r['m'] >= 2 and r['n'] < 1500: print('   %6d=%d^%d %.4f %+.5f %+.5f %.4f' % (r['n'], r['p'], r['m'], r['k'], r['KP'], float(Kmc(r['k'])), r['KP'] / float(Kmc(r['k']))))
    # partial sums: sum_n c_n K_P(n) vs sum_n c_n K_sine(k_n), cumulative in k
    cP = 0; cS = 0; cPp = 0; cSp = 0
    edges = [0.5, 1.0, 1.5, 2.0, 2.5, math.pi, 3.5, 3.9]; ei = 0
    for r in rows:
        while ei < len(edges) and r['k'] > edges[ei]:
            print('  k<%.3f: sum c_n K_P = %.5f, sum c_n K_sine = %.5f, diff %.5f  (m>=2 part: %.5f vs %.5f)' % (edges[ei], cP, cS, cP - cS, cPp, cSp)); ei += 1
        lam = math.log(r['p']); c = 2 * math.pi / L ** 2 * lam * lam / r['n']
        cP += c * r['KP']; cS += c * float(Kmc(r['k']))
        if r['m'] >= 2: cPp += c * r['KP']; cSp += c * float(Kmc(r['k']))
