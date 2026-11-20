"""Check of c4 output against zero tables: zero counts (zeta: scripts/.zeros-cache/zeros6; DH: battery table to 2000) and Littlewood's sum for DH.
Usage: c4_check.py result.json"""
import sys, json, math, numpy as np
r = json.load(open(sys.argv[1]))
zz = np.loadtxt('../../../../scripts/.zeros-cache/zeros6', max_rows=2001052)
dh = json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))
on = np.array([float(x) for x in dh['online']]); off = np.array([[float(x[0]), float(x[1])] for x in dh['offline']])
for f in ('ZETA', 'LCHI', 'DH'):
    print(f)
    for T, I, nz in zip(r[f]['T'], r[f]['I'], r[f]['nz']):
        s = '  T %10.2f I %10.4f  5logT %7.2f  zeros found %d' % (T, I, 5 * math.log(T), nz)
        if f == 'ZETA' and T <= zz[-1]: s += '  table %d' % int((zz < T).sum())
        if f == 'DH' and T <= 2000.01:
            m = off[:, 1] < T
            s += '  table on-line %d, off-line pairs %d, 2 pi sum(beta - 1/2) = %.4f, I - sum = %.4f' % (int((on < T).sum()), int(m.sum()), 2 * math.pi * (off[m, 0] - 0.5).sum(), I - 2 * math.pi * (off[m, 0] - 0.5).sum())
        if T in (50, 100, 200, 500, 1000, 2000) or T >= 2000 and abs(math.log10(T) - round(math.log10(T))) < 1e-9 or T == r[f]['T'][-1]: print(s)
