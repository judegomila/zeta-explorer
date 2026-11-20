"""Higher-precision recheck (mpmath, 30 digits) of selected float64 values.
  recheck.py c1 OUT.jsonl ROWS.jsonl OBJ T      : D_F(t_max) of the stored row, direct sum
  recheck.py c4 OUT.jsonl ROWS.jsonl OBJ MOLL N : |E f| at the stored minimiser f_at_min"""
import sys, json, math, numpy as np, mpmath as mp
import lp
mp.mp.dps = 30
kind, out, rows = sys.argv[1:4]
R = [json.loads(l) for l in open(rows)]
if kind == 'c1':
    obj, T = sys.argv[4], int(float(sys.argv[5]))
    r = [x for x in R if x['obj'] == obj and x['T'] == T][-1]
    a = lp.coefs(obj, r['Y']); c, chk, im = lp.detector_coefs(a, r['X'], r['Y'])
    t = mp.mpf(r['t_max']); s = mp.mpc(0)
    for n in range(r['X'] + 1, r['Y'] + 1):
        if c[n] != 0: s += mp.mpmathify(complex(c[n])) * mp.power(n, mp.mpc(-0.75, -t))
    res = dict(kind='c1', obj=obj, T=T, t=r['t_max'], float64_abs=r['max'], mp_abs=float(abs(s)), zeros_with_Re_ge_3_4_in_window='0 for ZETA (verified height)')
else:
    import tri, orbit, c4
    obj, moll, N = sys.argv[4], sys.argv[5], int(float(sys.argv[6]))
    r = [x for x in R if x['obj'] == obj and x['moll'] == moll and x['N'] == N][-1]
    t = r['t']; y = r['y']; a = lp.coefs(obj, N); lam, D = c4.mollifier(obj, moll, a, t)
    sigma = mp.mpf(r['sigma']); g = mp.mpf(r['g'])
    x = 4 * mp.pi * (mp.mpf(N) ** 2 - mp.mpf(t) / 16) + 4 * mp.pi * mp.mpf(r['f_at_min']) * (2 * N + 1)
    B = mp.mpc(0); A = mp.mpc(0); tq = mp.mpf(t) / 4
    for n in range(1, N + 1):
        if a[n] == 0: continue
        l = mp.log(n); w = float(a[n]) * mp.exp(tq * l * l - sigma * l); e = mp.expj(-(x / 2) * l)
        B += w * e; A += w * mp.exp(mp.mpf(y) * l) * mp.conj(e)
    E = sum(mp.mpf(v) * mp.power(d, -sigma) * mp.expj(-(x / 2) * mp.log(d)) for d, v in lam.items())
    res = dict(kind='c4', obj=obj, moll=moll, N=N, f=r['f_at_min'], float64_true_min=r['true_min'], mp_value=float(abs(E * (B + g * A))), two=r['two'], tri=r['tri'])
print(json.dumps(res)); open(out, 'a').write(json.dumps(res) + '\n')
