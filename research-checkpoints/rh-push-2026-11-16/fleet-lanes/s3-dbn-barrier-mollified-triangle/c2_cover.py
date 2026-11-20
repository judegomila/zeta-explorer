"""Combination 2. Covering identity with control coefficients.
c_n^F(t) = sum_{d | (n,30)} mu(d) w_F(d) beta_d(t) a_F(n/d) b_t(n/d),  beta_d = prod_{p|d} b_t(p).
variant 'zeta-weights': w_F = 1 (the source multiplier applied to the control's coefficients)
variant 'own-weights' : w_F(d) = a_F(d) for d | 30 (the control's own finite Euler multiplier at 2, 3, 5)
Census for n <= NMAX on the time grid TS: number of n with Re c_n < 0 (real families), number with c_n(t') > c_n(t) for consecutive t' < t (real),
number with |c_n(t')| > |c_n(t)|, first n of each kind.
Usage: c2_cover.py NMAX [sieve]   'sieve' adds LIOU, SGN, EA by direct sieve (NMAX <= 2e7)"""
import sys, math, json, time
from lib import *
NMAX = int(float(sys.argv[1])); SIEVE = len(sys.argv) > 2
TS = (0.0, 0.02, 0.05, 0.10, T0, 0.20, 0.30)
MU = {1: 1, 2: -1, 3: -1, 5: -1, 6: 1, 10: 1, 15: 1, 30: -1}
CH = 1 << 24
out = open('c2_cover_%g%s.json' % (NMAX, '_sieve' if SIEVE else ''), 'w')
PER = {'ZETA': np.ones(1), 'DH': DHPER, 'CHIM3': np.array([0.0, 1, -1]), 'CHIM4': np.array([0.0, 1, 0, -1]), 'LCHI5': CHI5}
def a_of(name, n, tab=None):
    """n: xp int64 array (values >= 1)"""
    if tab is not None: return tab[n]
    if name in PER: return xp.asarray(PER[name])[n % len(PER[name])]
    if name == 'TNR': return 1.0 + CN * math.sqrt(3) * (n % 3 == 0) + 3.0 * (n % 9 == 0)
    if name == 'UA': return xp.exp(-1j * xp.log(n.astype(xp.float64)))
    raise ValueError(name)
def wts(name, variant):
    if variant == 'zeta': return {d: 1.0 for d in MU}
    w = {}
    for d in MU:
        if name in PER: w[d] = complex(PER[name][d % len(PER[name])])
        elif name == 'TNR': w[d] = 1.0
        elif name == 'UA': w[d] = complex(np.exp(-1j * math.log(d)))
        elif name == 'EA': w[d] = float(np.prod([p**AE + p**(-AE) for p in factor(d)])) if d > 1 else 1.0
        elif name == 'LIOU': w[d] = float(MU[d])
        elif name == 'SGN': w[d] = float(np.prod([a_prime('SGN', p) for p in factor(d)])) if d > 1 else 1.0
    return w
def census(name, variant, tab=None):
    W = wts(name, variant); real = all(abs(complex(v).imag) == 0 for v in W.values()) and name not in ('LCHI5', 'UA')
    res = {'F': name, 'variant': variant, 'NMAX': NMAX, 'real': real, 'neg': {str(t): 0 for t in TS}, 'first_neg': {}, 'nonmono': {}, 'first_nonmono': {}, 'modnonmono': {}, 'first_modnonmono': {}, 'zero_at_t0': 0, 'min_c_t0': None}
    announce('per chunk about %d arrays of %d float64/complex128' % (4 * len(TS), CH), 4 * len(TS) * 16 * CH)
    for lo in range(1, NMAX + 1, CH):
        n = xp.arange(lo, min(lo + CH, NMAX + 1), dtype=xp.int64); prev = None
        terms = []
        for d in MU:
            m = (n % d == 0); nd = xp.where(m, n // d, 1)
            terms.append((d, m, a_of(name, nd, tab) * m, xp.log(nd.astype(xp.float64)) ** 2))
        for t in TS:
            c = 0
            for d, m, av, l2 in terms:
                beta = math.exp((t / 4) * sum(math.log(p) ** 2 for p in factor(d))) if d > 1 else 1.0
                c = c + (MU[d] * W[d] * beta) * av * xp.exp((t / 4) * l2)
            c = xp.where(xp.abs(c) < 1e-12 * xp.exp((t / 4) * xp.log(n.astype(xp.float64)) ** 2), 0, c)         # cancellation floor (float64)
            if real:
                cr = c.real if xp.iscomplexobj(c) else c
                neg = cr < 0; k = int(neg.sum()); res['neg'][str(t)] += k
                if k and str(t) not in res['first_neg']: res['first_neg'][str(t)] = int(n[neg][0])
                if t == T0:
                    mn = float(cr.min()); res['min_c_t0'] = mn if res['min_c_t0'] is None else min(mn, res['min_c_t0'])
            if t == T0: res['zero_at_t0'] += int((c == 0).sum())
            if prev is not None:
                key = '%g->%g' % (prev[0], t)
                if real:
                    bad = prev[1].real > c.real * (1 + 1e-12) + 1e-300 if xp.iscomplexobj(c) else prev[1] > c + 1e-12 * xp.abs(c)
                    k = int(bad.sum()); res['nonmono'][key] = res['nonmono'].get(key, 0) + k
                    if k and key not in res['first_nonmono']: res['first_nonmono'][key] = int(n[bad][0])
                bad = xp.abs(prev[1]) > xp.abs(c) * (1 + 1e-12)
                k = int(bad.sum()); res['modnonmono'][key] = res['modnonmono'].get(key, 0) + k
                if k and key not in res['first_modnonmono']: res['first_modnonmono'][key] = int(n[bad][0])
            prev = (t, c)
        del terms, n
    print(json.dumps(res), flush=True); return res
allres = []
t0 = time.time()
names = ['ZETA', 'CHIM3', 'CHIM4', 'LCHI5', 'DH', 'TNR', 'UA']
for nm in names:
    for v in (('zeta',) if nm == 'ZETA' else ('zeta', 'own')):
        if nm in ('TNR',) and v == 'own': continue
        allres.append(census(nm, v)); print('  %.0fs' % (time.time() - t0), flush=True)
if SIEVE:
    for nm in ('LIOU', 'SGN', 'EA'):
        tab = xp.asarray(coefs(nm, NMAX))
        for v in ('zeta', 'own'):
            allres.append(census(nm, v, tab)); print('  %.0fs' % (time.time() - t0), flush=True)
json.dump(allres, out); print('done')
