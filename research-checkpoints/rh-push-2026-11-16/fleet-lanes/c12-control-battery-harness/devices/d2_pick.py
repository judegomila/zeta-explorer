"""D2: finite real Pick orders on nested nodes (euler/nested.py; records nest_dh_small.txt, nest_z_small.txt).
K_ij = (L(x_i) + L(x_j))/(x_i + x_j), L = (Lambda'/Lambda)(1/2 + x); unit-diagonal normalisation; LDL^T without pivoting, in balls."""
import sys, os, json, time
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', 'battery'))
from flint import acb, arb, ctx
import core
tables = sys.argv[1]; Nmax = int(sys.argv[2]) if len(sys.argv) > 2 else 100
ctx.prec = int((40 + 8 * Nmax) * 3.33) + 400
def vdc(k):
    v, den = 0.0, 1.0
    while k: den *= 2; k, r = divmod(k, 2); v += r / den
    return v
def nodes(N, a, b):
    la, lb = arb(a).log(), arb(b).log()
    return [(la + (lb - la) * arb(vdc(k + 1))).exp() for k in range(N)]
def ldl(xs, Lx):
    N = len(xs)
    K = [[(Lx[i] + Lx[j]) / (xs[i] + xs[j]) for j in range(N)] for i in range(N)]
    d = [K[i][i].sqrt() for i in range(N)]
    A = [[K[i][j] / (d[i] * d[j]) for j in range(N)] for i in range(N)]
    piv = []
    for k in range(N):
        p = A[k][k]; piv.append(p)
        if not (p > 0): return k + 1, piv
        for i in range(k + 1, N):
            m = A[i][k] / p
            for j in range(k + 1, i + 1):
                A[i][j] -= m * A[j][k]; A[j][i] = A[i][j]
    return None, piv
rec = dict(DH={5: 9.14e-18, 10: 4.55e-47, 20: 1.34e-105, 30: 8.82e-159, 40: 7.18e-229, 60: 3.55e-360, 80: 1.02e-490, 100: 9.74e-637},
           ZETA={5: 3.91e-21, 10: 1.24e-53, 20: 7.34e-118, 30: 5.17e-176, 40: 9.88e-251, 60: 8.56e-391, 80: 1.68e-529, 100: 2.54e-683})
recs = dict(DH={5: '9.14e-18', 10: '4.55e-47', 20: '1.34e-105', 30: '8.82e-159', 40: '7.18e-229', 60: '3.55e-360', 80: '1.02e-490', 100: '9.74e-637'},
            ZETA={5: '3.91e-21', 10: '1.24e-53', 20: '7.34e-118', 30: '5.17e-176', 40: '9.88e-251', 60: '8.56e-391', 80: '1.68e-529', 100: '2.54e-683'})
out = dict(prec_bits=ctx.prec, Nmax=Nmax, interval=['0.01', '0.5']); checks = []
xs = nodes(Nmax, '0.01', '0.5')
for code in ('DH', 'ZETA'):
    t0 = time.time(); obj = core.by_code(code)
    Lx = [core.logder(obj, acb(arb(1) / 2 + x)).real for x in xs]
    ff, piv = ldl(xs, Lx)
    samples = {n: piv[n - 1].str(6) for n in recs[code] if n <= len(piv)}
    out[code] = dict(first_indefinite=ff, pivots=samples, all_pivot_balls_positive=(ff is None), seconds=time.time() - t0,
                     min_rel_accuracy_bits_last_pivot=int(piv[-1].rel_accuracy_bits()))
    checks.append(dict(check=code + ' positive definite through order %d (every pivot ball > 0)' % Nmax, ok=(ff is None), got=ff, recorded=None))
    for n, r in recs[code].items():
        if n > len(piv): continue
        ratio = piv[n - 1] / arb(r)
        ok = bool(abs(ratio - 1) < arb('0.006'))
        checks.append(dict(check='%s pivot(%d), rel 6e-3' % (code, n), ok=ok, got=piv[n - 1].str(6), recorded=r))
out['checks'] = checks; out['reproduced'] = all(c['ok'] for c in checks)
out['verdict'] = 'DH passes real-Pick positivity to order %d on the nested nodes (as zeta does)' % Nmax if out['reproduced'] else 'MISMATCH'
json.dump(out, open(os.path.join(tables, 'device_D2.json'), 'w'), indent=1)
for c in checks: print(('ok   ' if c['ok'] else 'FAIL ') + c['check'], '| got', c['got'], '| recorded', c['recorded'])
print('D2 reproduced:', out['reproduced'])
