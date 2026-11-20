"""Test 3b on the battery tables (heights below 2000): recovered log-derivative coefficients c^(n) from on-line zeros only and with
the off-line pairs added (each pair beta + i gamma, 1 - beta + i gamma contributes 2 cosh((beta-1/2) log n) exp(i gamma log n))."""
import sys, json, math, numpy as np, zstats as Z
tab = sys.argv[1]
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
def cdh(nmax):
    a = lambda n: [0, 1, KAPPA, -KAPPA, -1][n % 5] if n % 5 else 0.0
    c = {}
    for n in range(2, nmax + 1):       # a(n) log n = sum_{d|n} c(d) a(n/d)
        s = a(n) * math.log(n)
        for d in range(2, n):
            if n % d == 0: s -= c[d] * a(n // d)
        c[n] = s
    return c
def run(code, truth=None, nmax=30):
    d = json.load(open('%s/zeros_%s.json' % (tab, code)))
    on = np.array([float(v) for v in d['online']]); off = np.array([[float(v[0]), float(v[1])] for v in d['offline']])
    isheat = code.startswith('HEAT')
    if isheat: off[:, 0] += 0.5
    a, b = 0.0, 2000.0
    w = lambda t: np.cos(math.pi * ((t - a) / (b - a) - 0.5)) ** 4
    norm = (3 / 8) * (b - a) / (2 * math.pi)
    rows = []
    for n in range(2, nmax + 1):
        ln = math.log(n)
        s_on = np.sum(w(on) * np.exp(1j * on * ln))
        s_off = np.sum(w(off[:, 1]) * 2 * np.cosh((off[:, 0] - 0.5) * ln) * np.exp(1j * off[:, 1] * ln))
        c_on = -math.sqrt(n) * s_on / norm; c_all = -math.sqrt(n) * (s_on + s_off) / norm
        rows.append(dict(n=n, c_on=[c_on.real, c_on.imag], c_all=[c_all.real, c_all.imag], truth=(truth[n] if truth else None)))
    return dict(code=code, n_on=len(on), n_off_pairs=len(off), rows=rows)
out = {}
out['DH'] = run('DH', cdh(30))
for h in ('HEAT--0.1', 'HEAT--0.5'): out[h] = run(h)
json.dump(out, open(sys.argv[2], 'w'), indent=1)
r = out['DH']['rows']
print('DH (1861 on-line, 84 off-line pairs, t < 2000)   n : truth | on-line only | with off-line pairs')
for x in r:
    if x['n'] in (2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 22):
        print('  %2d : %+.6f | %+.6f | %+.6f' % (x['n'], x['truth'], x['c_on'][0], x['c_all'][0]))
print('DH relations: c(4) log 2 - c(2)^2: truth %.6f, on-line %.6f ; c(6): truth %.6f, on-line %.6f' % (r[2]['truth'] * math.log(2) - r[0]['truth'] ** 2, r[2]['c_on'][0] * math.log(2) - r[0]['c_on'][0] ** 2, r[4]['truth'], r[4]['c_on'][0]))
for h in ('HEAT--0.1', 'HEAT--0.5'):
    r = out[h]['rows']
    print(h, 'on-line %d, pairs %d: ' % (out[h]['n_on'], out[h]['n_off_pairs']) + '  '.join('c(%d)=%+.4f|%+.4f' % (x['n'], x['c_on'][0], x['c_all'][0]) for x in r if x['n'] in (2, 3, 4, 5, 6, 10, 12)))
