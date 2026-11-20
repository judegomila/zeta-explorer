"""Combination 1. Mollified triangle margin T(N) - E(N) and the smallest certifiable time t*(N), zeta and controls.
Usage: c1_run.py PART [small]   PART in ladder | tstar | controls | dh
Output: c1_<PART>[_small].jsonl"""
import sys, time, math, json
from lib import *
PART = sys.argv[1]; SMALL = len(sys.argv) > 2 and sys.argv[2] == 'small'
TAG = ('_' + sys.argv[3] + '_' + sys.argv[4].replace(',', '-')) if PART == 'dh' and len(sys.argv) > 4 else ''
out = open('c1_%s%s%s.jsonl' % (PART, TAG, '_small' if SMALL else ''), 'w')
def emit(**k):
    out.write(json.dumps(k) + '\n'); out.flush(); print(json.dumps(k), flush=True)
FAMS = {'P3': (2, 3), 'P5': (2, 3, 5), 'P7': (2, 3, 5, 7), 'P11': (2, 3, 5, 7, 11), 'P13': (2, 3, 5, 7, 11, 13), 'P17': (2, 3, 5, 7, 11, 13, 17), 'P19': (2, 3, 5, 7, 11, 13, 17, 19)}
if SMALL: FAMS = {k: FAMS[k] for k in ('P3', 'P5', 'P7', 'P11')}
NMAX = 60000 if SMALL else 3840000
y = Y0

def margin(tr, N, t, lam): return tr.value(N, t, y, lam) - err_budget(N, t, y)

def tstar(fn, lo=0.005, hi=0.6, steps=26):
    """smallest t in [lo, hi] with fn(t) > 0, by bisection (fn increasing in t on the tested grids); None if fn(hi) <= 0"""
    if fn(hi) <= 0: return None
    if fn(lo) > 0: return lo
    for _ in range(steps):
        mid = (lo + hi) / 2
        if fn(mid) > 0: hi = mid
        else: lo = mid
    return hi

if PART == 'ladder':
    Ns = sorted(set([690988, 729000, 819000, 1028000, 3840000] + [int(round(v)) for v in np.exp(np.linspace(math.log(1000), math.log(3840000), 240))]))
    Ns = [N for N in Ns if N <= NMAX]
    announce('per family: about 14 float64[%d] + %d prime masks' % (NMAX, 8), 14 * 8 * NMAX)
    for fam, P in FAMS.items():
        lam, D = euler_moll('ZETA', P, T0); tr = Tri(coefs('ZETA', NMAX), D, NMAX); t0 = time.time()
        for N in Ns:
            T, pr = tr.value(N, T0, y, lam, parts=True)
            emit(part='ladder', fam=fam, N=N, T=T, E=err_budget(N, T0, y), sigma=pr['sigma'], g=pr['g'], S=pr['S'], M=pr['M'])
        print('family %s done %.0fs' % (fam, time.time() - t0), flush=True); del tr

if PART == 'tstar':
    Ns = [1000, 3000, 10000, 30000, 100000, 300000, 690988, 1000000, 2000000, 3840000]
    Ns = [N for N in Ns if N <= NMAX]
    for fam, P in FAMS.items():
        D = 1
        for p in P: D *= p
        tr = Tri(coefs('ZETA', NMAX), D, NMAX)
        for N in Ns:
            ts = tstar(lambda t: margin(tr, N, t, euler_moll('ZETA', P, t)[0]))
            # monotonicity check of the margin in t on a grid above t*
            grid = [ts + 0.01 * k for k in range(0, 8)] if ts else []
            vals = [margin(tr, N, t, euler_moll('ZETA', P, t)[0]) for t in grid]
            emit(part='tstar', fam=fam, N=N, tstar=ts, sig_end=(None if ts is None else (1 + y) / 2 + (ts / 4) * math.log(N)), mono=all(b > a for a, b in zip(vals, vals[1:])), vals=vals[:4])
        del tr

if PART == 'controls':
    # completely multiplicative twists and characters with their own Euler mollifier; T-NR and E_a with their own local factors
    Ns = [1000, 10000, 100000, 690988, 3840000]; Ns = [N for N in Ns if N <= NMAX]
    P = (2, 3, 5, 7) if SMALL else (2, 3, 5, 7, 11)
    for nm in ('ZETA', 'SGN', 'LIOU', 'U', 'UA', 'LCHI5', 'CHIM3', 'CHIM4', 'TNR', 'EA', 'SGN/zeta-mollifier', 'DH/zeta-mollifier', 'DH/chi-mollifier', 'DH/none', 'TNR/zeta-mollifier', 'EA/zeta-mollifier'):
        base = nm.split('/')[0]; mol = nm.split('/')[1] if '/' in nm else 'own'
        PP = P if base != 'EA' or mol != 'own' else (2, 3, 5, 7)
        def mk(t):
            if mol == 'own': return euler_moll(base, PP, t)
            if mol == 'zeta-mollifier': return euler_moll('ZETA', PP, t)
            if mol == 'chi-mollifier':
                l, D = euler_moll('LCHI5', PP, t); return {d: v.real for d, v in l.items() if abs(v.real) > 0}, D     # real part: prod with Re chi is not this; see RESULT
            if mol == 'none': return {1: 1.0}, 1
        D = mk(T0)[1]
        a = coefs(base, NMAX); tr = Tri(a, D, NMAX)
        for N in Ns:
            f = lambda t: margin(tr, N, t, mk(t)[0])
            ts = tstar(f, steps=14)
            emit(part='controls', F=nm, N=N, T_at_t0=tr.value(N, T0, y, mk(T0)[0]), E_at_t0=err_budget(N, T0, y), tstar=ts)
        del tr

if PART == 'dh':
    # best mollifier found by smoothed-L1 minimisation (L-BFGS) on the divisors of DSUP; warm starts down a t grid
    which = sys.argv[3] if len(sys.argv) > 3 else 'DH'
    DSUP = {'DH': 2**3 * 3**2 * 7 * 11 * 13, 'ZETA': 2**3 * 3**2 * 5 * 7 * 11, 'TNR': 2 * 3**5 * 5 * 7 * 11, 'EA': 2**3 * 3**2 * 5**2 * 7 * 11, 'LCHI5r': 2**3 * 3**2 * 7 * 11 * 13}[which]
    Ns = [int(v) for v in sys.argv[4].split(',')] if len(sys.argv) > 4 else [1000, 10000]
    tgrid = [0.50, 0.40, 0.32, 0.26, 0.22, 0.19, T0, 0.14, 0.12, 0.10, 0.08]
    FAST = len(sys.argv) > 5 and sys.argv[5] == 'fast'
    if FAST: tgrid = [0.22, 0.19, T0, 0.14, 0.12, 0.10, 0.08]
    a = coefs('DH' if which == 'DH' else which.replace('LCHI5r', 'LCHI5'), max(Ns))
    if which == 'LCHI5r': a = a.real.copy()                 # (L(chi) + L(chibar))/2: coefficients Re chi, a non-multiplicative positive comparison
    for N in Ns:
        tr = Tri(a, DSUP, N); lam = {d: 0.0 for d in divisors(DSUP)}; lam[1] = 1.0
        if which in ('ZETA', 'TNR'): lam.update(euler_moll('ZETA', [p for p in factor(DSUP)], T0)[0])
        if FAST and len(sys.argv) > 6:
            for l in open(sys.argv[6]):
                r = json.loads(l)
                if r.get('part') == 'dh_tstar' and r.get('lam'): lam.update({int(d): v for d, v in r['lam'].items()})
        def run(t, lam):
            t1 = time.time()
            T, lam2 = optimise(tr, N, t, y, lam, iters=(60 if SMALL else (45 if FAST else 90)), stages=((1e-4, 1e-6) if FAST else (1e-3, 1e-5, 1e-7)))
            E = err_budget(N, t, y); xN, L, sigma, K, g = consts(N, t, y)
            emit(part='dh', F=which, N=N, t=t, T=T, E=E, margin=T - E, M=sum(abs(v) * d ** -sigma for d, v in lam2.items()), nsupp=len(lam2), maxlam=max(abs(v) for v in lam2.values()),
                 top=sorted(((d, round(v, 5)) for d, v in lam2.items() if d > 1), key=lambda q: -abs(q[1]))[:12], sec=round(time.time() - t1, 1), lam=({str(d): v for d, v in lam2.items()} if t == T0 else None))
            return T - E, lam2
        pos = None; neg = None
        for t in tgrid:
            m, lam2 = run(t, lam)
            if m > 0: pos = (t, lam2); lam = lam2
            else:
                neg = t
                if pos is not None: break
        if pos is not None and neg is not None:
            lo, hi = neg, pos[0]; lamw = pos[1]
            for _ in range(3 if FAST else 5):
                mid = (lo + hi) / 2; m, lam2 = run(mid, lamw)
                if m > 0: hi = mid; lamw = lam2
                else: lo = mid
            emit(part='dh_tstar', F=which, N=N, tstar_hi=hi, tstar_lo=lo, lam={str(d): v for d, v in lamw.items()})
        else: emit(part='dh_tstar', F=which, N=N, tstar_hi=None, note='no sign change on the grid', pos=(pos[0] if pos else None), neg=neg)
        del tr
print('done', flush=True)
