import json, math
d = json.load(open('asum_1e3_1e4_1e5_1e6_1e7_1e8.json')); c = json.load(open('cont.json')); iv = json.load(open('iv.json'))
N = {'1e3': 2000, '1e4': 8000, '1e5': 20000, '1e6': 20000, '1e7': 20000, '1e8': 20000}; PS = [10, 100, 1000, 10000, 100000]
def sieve(P):
    s = [True] * (P + 1); s[0] = s[1] = False
    for i in range(2, int(P ** .5) + 1):
        if s[i]:
            for j in range(i * i, P + 1, i): s[j] = False
    return [float(i) for i in range(P + 1) if s[i]]
pr = sieve(100000)
def linfit(X, Y):
    n = len(X); mx_ = sum(X) / n; my = sum(Y) / n; b = sum((a - mx_) * (c_ - my) for a, c_ in zip(X, Y)) / sum((a - mx_) ** 2 for a in X)
    return b, my - b * mx_
def upred(P, L):  # Landau-Gonek prediction for the one-spacing forward-shift mean / (N M_P)
    tot = 0.0
    for p in [q for q in pr if q <= P]:
        lp = math.log(p); k = 1
        while p ** k < 1e12 and k < 40:
            u = 2 * math.pi * k * lp / L; tot += lp / p ** k * math.sin(u) / u; k += 1
    return 1 - 2 * tot / L
print('TABLE 1  zeta, whole block per height (w = 1)')
print('| T0 | zeros | H | L=log(Tmid/2pi) | P | x=(log P - gamma_E)/L | Rref = A0/(N M_P) | 1-2c_P/L (Landau-Gonek) | Rcont = A0/(N <|zeta_S|^2>_t) | <|zeta_S|^2>_t / M_P | U/(N M_P) | sinc prediction for it | RU = A0/U |'); print('|' + '---|' * 13)
pts = []
for key in N:
    for P in PS:
        r = d['%s|zeta|%d|%d' % (key, P, N[key])]; row = r['rows'][0]; L = math.log((row['T0'] + row['T1']) / 2 / (2 * math.pi)); cc = c['%s|%d|%d' % (key, P, N[key])]
        x = (math.log(P) - 0.5772157) / L; pts.append((key, P, L, x, row['Rref'], cc['Rcont']['mean']))
        print('| %s | %d | %.0f | %.3f | %d | %.3f | %.4f | %.4f | %.4f | %.3f | %.4f | %.4f | %.4f |' % (key, N[key], row['T1'] - row['T0'], L, P, x, row['Rref'], row['pred'], cc['Rcont']['mean'], cc['contOverM']['mean'], row['Uref'], upred(P, L), row['RU']))
print('\nTABLE 2  zeta, window statistics (w = 1): mean [min, max] sd over windows')
print('| T0 | P | window | n win | Rref | Rcont | RU (one-spacing shift) | RU Hann |'); print('|' + '---|' * 8)
f = lambda s: '%.4f [%.4f, %.4f] %.4f' % (s['mean'], s['min'], s['max'], s['sd'])
mx = {}
for key in N:
    for P in PS:
        for ws in (500, 2000):
            k = '%s|zeta|%d|%d' % (key, P, ws)
            if k not in d: continue
            r = d[k]; cc = c['%s|%d|%d' % (key, P, ws)]['Rcont']
            print('| %s | %d | %d | %d | %s | %s | %s | %s |' % (key, P, ws, r['RU']['n'], f(r['Rref']), f(cc), f(r['RU']), f(r['RUhann'])))
            for nm, v in (('Rref', r['Rref']['max']), ('Rcont', cc['max']), ('RU', r['RU']['max'])): mx[(nm, ws)] = max(mx.get((nm, ws), 0), v)
print('\nmax over all windows, heights and P:', mx)
print('\nTABLE 3  interval arithmetic (arb, 128 bit), first window per height')
print('| T0 | zeros | P | A0 | Rref | RU | Rhalf | float64 screen Rref, RU (same window) |'); print('|' + '---|' * 8)
for key in N:
    for P in PS:
        v = iv['%s|zeta|%d' % (key, P)]; r = d['%s|zeta|%d|%d' % (key, P, v['ws'])]
        fl = [(w['Rref'], w['RU']) for w in r['rows']][0] if r['rows'] else None
        if fl is None:  # 500-window rows not stored: recompute not available
            fl = ('(min of 4 windows) %.6f' % r['Rref']['min'], '%.6f' % r['RU']['min'])
        print('| %s | %d | %d | %s | %s | %s | %s | %s, %s |' % (key, v['ws'], P, v['A0'], v['Rref'], v['RU'], v['Rhalf'], fl[0], fl[1]))
print('\nTABLE 3b interval arithmetic, Liouville twist at zeta zeros, first window')
for key in N:
    print('| %s | ' % key + ' | '.join('P=%d: Rref %s RU %s' % (P, iv['%s|liou|%d' % (key, P)]['Rref'][:14], iv['%s|liou|%d' % (key, P)]['RU'][:14]) for P in PS) + ' |')
# law
big = [p for p in pts if p[3] > 0.6]
b1, a1 = linfit([math.log(p[3]) for p in big], [math.log(p[4]) for p in big]); res = max(abs(math.log(p[4]) - a1 - b1 * math.log(p[3])) for p in big)
print('\nfit x > 0.6: Rref ~ %.4f x^(%.3f), n=%d, max |log resid| %.3f' % (math.exp(a1), b1, len(big), res))
b2, a2 = linfit([math.log(p[3]) for p in big], [math.log(p[5]) for p in big]); print('fit x > 0.6: Rcont ~ %.4f x^(%.3f)' % (math.exp(a2), b2))
sm = [p for p in pts if p[3] < 0.26]
print('x < 0.26: max |Rref - (1-2c_P/L)| =', max(abs(d['%s|zeta|%d|%d' % (p[0], p[1], N[p[0]])]['rows'][0]['Rref'] - d['%s|zeta|%d|%d' % (p[0], p[1], N[p[0]])]['rows'][0]['pred']) for p in sm), 'n =', len(sm))
print('collapse (x, Rref, Rcont, T0, P):'); print(' '.join('(%.3f, %.4f, %.4f, %s, %d)' % (p[3], p[4], p[5], p[0], p[1]) for p in sorted(pts, key=lambda p: p[3])))
print('\nTABLE 4  twists at zeta zeros, 2000-zero windows (500 at 1e3): Rref mean [min,max] and Landau-Gonek prediction')
for tw in ['liou', 'liou_half'] + ['rnd%d' % i for i in range(8)]:
    for key in N:
        ws = 500 if key == '1e3' else 2000; s = []
        for P in PS:
            r = d['%s|%s|%d|%d' % (key, tw, P, ws)]
            if r['Rref'] is None: s.append('P=%d: Rref NA; RU %.3f [%.3f, %.3f]; G %.3f' % (P, r['RU']['mean'], r['RU']['min'], r['RU']['max'], r['G']['mean']))
            else: s.append('P=%d: %.3f [%.3f, %.3f] pred %.3f; RU [%.3f, %.3f]' % (P, r['Rref']['mean'], r['Rref']['min'], r['Rref']['max'], r['pred']['mean'], r['RU']['min'], r['RU']['max']))
        print('| %s | %s | ' % (tw, key) + ' | '.join(s) + ' |')
