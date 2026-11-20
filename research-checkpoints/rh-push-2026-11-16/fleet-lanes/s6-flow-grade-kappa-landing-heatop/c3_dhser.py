"""Combination 3, DH with its own coefficients: -F'/F = sum c(n) n^-s, c = (a log) * a^{-1} (Dirichlet convolution; c is not supported on prime powers).
Partial sums n <= N on Re s = 1.1 and 1.5 against direct evaluation; the same for L(chi_-4) (prime powers only) as comparison.
Usage: c3_dhser.py OUT.json N t1,t2,.."""
import sys, math, json, numpy as np
from flint import acb, arb, ctx, dirichlet_char
import c3
N = int(float(sys.argv[2])); ts = [float(v) for v in sys.argv[3].split(',')]; ctx.prec = 160
print('planned memory: %.2f GB' % (N * 8 * 4 / 1e9), flush=True)
def lam_series(a_per, q):
    a = np.array(a_per, dtype=np.float64)[np.arange(N + 1) % q]
    c = a * np.log(np.maximum(np.arange(N + 1), 1).astype(np.float64)); c[0] = 0
    for d in range(2, N // 2 + 1):
        cd = c[d]
        if cd != 0.0: c[2 * d::d] -= cd * a[2: N // d + 1]
    return c
res = []
logn = np.log(np.arange(1, N + 1).astype(np.float64))
for name, per, q in (('DH', [0, 1, c3.KAPPA, -c3.KAPPA, -1], 5), ('L4', [0, 1, 0, -1], 4)):
    c = lam_series(per, q)[1:]
    grow = [float(np.abs(c[int(10 ** k) // 2: int(10 ** k)]).max()) for k in range(2, int(math.log10(N)) + 1)]
    for sig in (1.1, 1.5):
        for t in ts:
            s = acb(arb(sig), arb(t)); h = arb(2) ** -30
            d = c3.cx((c3.F_direct(name, s + h) - c3.F_direct(name, s - h)) / (2 * h) / c3.F_direct(name, s))
            w = c * np.exp(-sig * logn); ph = np.exp(-1j * t * logn); row = dict(obj=name, sigma=sig, t=t, direct=[d.real, d.imag], max_abs_c_by_decade=grow, partial=[])
            for M in [10 ** k for k in range(3, int(math.log10(N)) + 1)]:
                v = -(w[:M] * ph[:M]).sum(); row['partial'].append(dict(N=M, abs_diff=abs(v - d)))
            res.append(row); print(name, sig, t, ' '.join('N=%.0e: %.2e' % (p['N'], p['abs_diff']) for p in row['partial']), ' max|c| by decade', ['%.1f' % g for g in grow], flush=True)
json.dump(res, open(sys.argv[1], 'w'), indent=0)
