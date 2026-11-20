"""Sign survey of dilation minors det[K(x_i y_j)] of theta-normalised kernels (polar terms kept), orders 2..5.
Scout for PREFILTER.md (lane c13-noncone-kernel-separator-search owns the registered run). MEASURED, random nodes.
Memory: one mp.matrix of at most 5x5 at a time."""
import sys, json, random
import mpmath as mp
OUT = sys.argv[1]
mp.mp.dps = 100
def theta(x): return mp.jtheta(3, 0, mp.exp(-mp.pi*x))
def th_nr(x, q, c): return c*theta(x) + theta(x/q**2)/mp.sqrt(q) + mp.sqrt(q)*theta(x*q**2)
def th_chi(x, q, vals):  # even primitive real character: sum over n in Z of chi(n) exp(-pi n^2 x / q)
    s = mp.mpf(0); n = 1
    while True:
        e = mp.exp(-mp.pi*n*n*x/q)
        if vals[n % q]: s += 2*vals[n % q]*e
        if e < mp.mpf(10)**(-mp.mp.dps-5): break
        n += 1
    return s
k0 = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
def th_dh(x):  # odd: sum a(n) n exp(-pi n^2 x/5), a = (1, k0, -k0, -1, 0)
    a = [0, 1, k0, -k0, -1]; s = mp.mpf(0); n = 1
    while True:
        e = n*mp.exp(-mp.pi*n*n*x/5)
        s += a[n % 5]*e
        if e < mp.mpf(10)**(-mp.mp.dps-5): break
        n += 1
    return s
def xis(s): return mp.power(mp.pi, -s/2)*mp.gamma(s/2)*mp.zeta(s)
_dv = {}
def Estar(y, s):
    if y < 1: y = 1/y
    tot = xis(2*s)*y**s + xis(2*s-1)*y**(1-s); n = 1
    while True:
        if (n, s) not in _dv: _dv[(n, s)] = mp.power(n, s-mp.mpf(1)/2)*sum(mp.power(d, 1-2*s) for d in range(1, n+1) if n % d == 0)
        term = 4*mp.sqrt(y)*_dv[(n, s)]*mp.besselk(s-mp.mpf(1)/2, 2*mp.pi*n*y)
        tot += term; n += 1
        if abs(term) < mp.mpf(10)**(-mp.mp.dps-5): break
    return tot
chi5 = [0, 1, -1, -1, 1]; chi8 = [0, 1, 0, -1, 0, -1, 0, 1]; chi13 = [0]+[1 if pow(n, 6, 13) == 1 else -1 for n in range(1, 13)]
kernels = [
 ('zeta theta', theta, 200), ('theta - 1 (polar term dropped)', lambda x: theta(x) - 1, 200),
 ('TNR q=2 c=2.0506', lambda x: th_nr(x, 2, mp.mpf(29)/10/mp.sqrt(2)), 200),
 ('TNR q=3 c=2.0785', lambda x: th_nr(x, 3, mp.mpf(18)/5/mp.sqrt(3)), 200),
 ('tempered twin q=2 c=1.4142', lambda x: th_nr(x, 2, mp.sqrt(2)), 200),
 ('L(chi_5) even real', lambda x: th_chi(x, 5, chi5), 200), ('L(chi_8) even real', lambda x: th_chi(x, 8, chi8), 200),
 ('L(chi_13) even real', lambda x: th_chi(x, 13, chi13), 200),
 ('DH (odd, conductor 5)', th_dh, 200),
 ('E_a a=0.3', lambda y: Estar(y, mp.mpf('0.8')), 40), ('E_a a=0.2', lambda y: Estar(y, mp.mpf('0.7')), 40),
]
R = {}
for name, Kf, ns in kernels:
    R[name] = {}
    for L in (0.5, 1.0, 1.6, 2.5):
        if name.startswith('E_a') and L not in (1.0, 1.6): continue
        mp.mp.dps = 60 if name.startswith('E_a') else (120 if L < 2 else 700)
        _dv.clear()
        rng = random.Random(1000 + int(L*10))
        cell = {}
        for order in (2, 3, 4, 5):
            pos = neg = 0; minratio = None
            for _ in range(ns):
                xs = sorted(rng.uniform(-L, L) for _ in range(order)); ysn = sorted(rng.uniform(-L, L) for _ in range(order))
                M = mp.matrix(order, order)
                for i in range(order):
                    for j in range(order): M[i, j] = Kf(mp.exp(mp.mpf(xs[i]) + mp.mpf(ysn[j])))
                dv = mp.det(M)
                had = mp.mpf(1)
                for i in range(order): had *= mp.sqrt(sum(M[i, j]**2 for j in range(order)))
                ratio = abs(dv)/had
                if minratio is None or ratio < minratio: minratio = ratio
                if dv > 0: pos += 1
                elif dv < 0: neg += 1
            cell[order] = dict(positive=pos, negative=neg, min_abs_det_over_hadamard=float(mp.log10(minratio)) if minratio else None, dps=mp.mp.dps, zero=ns-pos-neg)
        R[name]['L=%s' % L] = cell
        print(name, L, {o: (c['positive'], c['negative'], (round(c['min_abs_det_over_hadamard'], 1) if c['min_abs_det_over_hadamard'] is not None else None)) for o, c in cell.items()}, flush=True)
json.dump(R, open(OUT, 'w'), indent=1)
print('written', OUT)
