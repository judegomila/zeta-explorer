# c9 supplementary: where the Simon-Zlatos difference functional separates zeta from U (float64).
# tail ratio R(T;Q) = sum_{Q<p_n<=1e7} |a_{n+1}-a_n|^2 / (2 sum_{Q<p<=1e7} p^-2sig), a_n = u_n p_n^(-sig-iT)
import numpy as np, json
from scipy.special import expi
rng = np.random.default_rng(7)
def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0].astype(np.int64)
PR = primes_upto(10 ** 7); LP = np.log(PR.astype(float))
B = 0.9; Lp = 0.5 * (expi(B * LP) - float(expi(B * np.log(2.0)))); f = np.floor(Lp).astype(np.int64); k = 1 + np.arange(len(PR))
c = k + np.minimum(np.minimum.accumulate(f - k), 0); inS = c > np.concatenate(([0], c[:-1]))
U = {'ZETA': np.ones(len(PR), complex), 'U1': np.exp(2j * np.pi * rng.random(len(PR))), 'THIN': np.where(inS, -1.0, 1.0).astype(complex)}
out = {'tail': [], 'conv': []}
for sig in (0.75, 0.5):
    r = PR.astype(float) ** (-sig)
    print('sigma', sig, ': tail ratio, rows T, columns Q = 1e2, 1e3, 1e4, 1e5, 1e6')
    for name in U:
        print('  ', name)
        for T in (10.0, 1e2, 1e3, 1e4, 1e5):
            vals = []
            for Q in (10 ** 2, 10 ** 3, 10 ** 4, 10 ** 5, 10 ** 6):
                i0 = int(np.searchsorted(PR, Q, side='right')); acc = 0.0
                for t in T * (1 + 0.1 * rng.random(8)):
                    a = U[name][i0:] * r[i0:] * np.exp(-1j * t * LP[i0:]); acc += float((np.abs(a[1:] - a[:-1]) ** 2).sum())
                vals.append(acc / 8 / (2 * float((r[i0:] ** 2).sum())))
                out['tail'].append({'sigma': sig, 'obj': name, 'T': T, 'Q': Q, 'ratio': vals[-1]})
            print('     T=%-7g' % T, ' '.join('%.5f' % v for v in vals), flush=True)
    print('sigma', sig, ': SZ(T=10; P) and l2 = sum p^-2sig, P = 1e2 .. 1e7')
    for name in U:
        row = []
        for P in (10 ** 2, 10 ** 3, 10 ** 4, 10 ** 5, 10 ** 6, 10 ** 7):
            n = int(np.searchsorted(PR, P, side='right')); a = U[name][:n] * r[:n] * np.exp(-10j * LP[:n])
            row.append(float((np.abs(a[1:] - a[:-1]) ** 2).sum())); out['conv'].append({'sigma': sig, 'obj': name, 'P': P, 'SZ': row[-1], 'l2': float((r[:n] ** 2).sum())})
        print('   %-5s' % name, ' '.join('%.4f' % v for v in row))
    print('   l2   ', ' '.join('%.4f' % float((r[:int(np.searchsorted(PR, P, side="right"))] ** 2).sum()) for P in (10 ** 2, 10 ** 3, 10 ** 4, 10 ** 5, 10 ** 6, 10 ** 7)))
out['thin_count_1e7'] = int(inS.sum())
json.dump(out, open(__file__.replace('.py', '.json'), 'w'), indent=1)
