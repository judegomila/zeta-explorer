# Commutator / eigen-defect of translation Hecke operators V_p under the Gaussian (Heisenberg) shear
# G_tau = multiplication by exp(tau u^2/16).  mpmath seeds (dps 30), float64 least squares.
# Planned memory: < 50 MB (vectors of 101 grid points, at most ~2e3 seed vectors cached per kernel).
import mpmath as mp, numpy as np, json, math, random, sys
mp.mp.dps = 30
ULO, UHI, NG = -11.0, 5.0, 161
ugrid = [mp.mpf(ULO) + mp.mpf(UHI-ULO)*i/(NG-1) for i in range(NG)]
unp = np.array([float(u) for u in ugrid])
PR = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47]
TAUS = [0.0, 0.3, 0.1, 0.03, 0.01]

def seed_zeta(u):
    x = mp.e**u
    return (2*mp.pi**2*x**mp.mpf('2.25') - 3*mp.pi*x**mp.mpf('1.25'))*mp.e**(-mp.pi*x)
def seed_dh(u):
    x = mp.e**u
    return x**mp.mpf('0.75')*mp.e**(-mp.pi*x/5)
SQ20 = mp.sqrt(20)
def seed_ep(u):
    y = mp.e**(u/2)
    return mp.sqrt(y)*mp.e**(-2*mp.pi*y/SQ20)
W = mp.mpf('0.3')
def seed_bes(u):
    y = mp.e**(u/2)
    a = 2*mp.pi*y
    return mp.sqrt(y)*mp.besselk(W, a) if a < 45 else mp.mpf(0)
# visibility cut-offs (largest frequency value with a non-negligible term on the window)
VMAX = {'zeta': 880.0, 'dh': 1960.0, 'ep': 7000.0, 'bes': 1570.0}
UCUT = {k: 2*math.log(v) + 5.0 for k, v in VMAX.items()}
SEEDS = {'zeta': seed_zeta, 'dh': seed_dh, 'ep': seed_ep, 'bes': seed_bes}

def svec(seedname, v, cache):
    key = round(v, 12)
    if key not in cache:
        g = SEEDS[seedname]; l2 = 2*mp.log(v); pref = 1/mp.sqrt(v)
        # terms with u + 2 log v > UCUT are below 1e-17 relative and are set to 0
        cache[key] = np.array([complex(pref*g(u + l2)) if u + l2 < UCUT[seedname] else 0j for u in ugrid])
    return cache[key]

def vp(n, p):
    k = 0
    while n % p == 0: n //= p; k += 1
    return k

def run(name, seedname, coef, val=lambda m: float(m), trans=None, tau0=0.0, part=None):
    """kernel = sum_m coef(m) val(m)^(-1/2) g(u + 2 log val(m)); V_p shifts by 2 log trans(p);
    p-divisible part defined by divisibility of the label m by part(p)."""
    trans = trans or (lambda p: val(p)); part = part or (lambda p: p)
    vmax = VMAX[seedname]; cache = {}
    labels = [m for m in range(1, 200000) if val(m) <= vmax] if val(1) != 1.0 else None
    if labels is None:
        labels = [m for m in range(1, int(vmax*1.2)+2) if val(m) <= vmax]
    cf = {m: complex(coef(m)) for m in labels}
    labels = [m for m in labels if cf[m] != 0]
    kap = sum(cf[m]*svec(seedname, val(m), cache) for m in labels)
    out = {}
    for p in PR:
        t = trans(p); L = math.log(t); q = part(p)
        A = sum((cf[m]*svec(seedname, val(m), cache) for m in labels if m % q == 0), np.zeros(NG, complex))
        B1 = sum((cf[m]*svec(seedname, val(m)*t, cache) for m in labels if val(m)*t <= vmax), np.zeros(NG, complex))
        B2 = sum((cf[m]*svec(seedname, val(m)*t*t, cache) for m in labels if val(m)*t*t <= vmax), np.zeros(NG, complex))
        row = {}
        for tau in TAUS:
            tt = tau0 + tau
            G = np.exp(tt*unp**2/16)
            nk = np.linalg.norm(G*A) if np.linalg.norm(A) > 0 else np.linalg.norm(G*B1)
            b1 = G*np.exp(tt*L*(unp+L)/4)*B1
            b2 = G*np.exp(tt*2*L*(unp+2*L)/4)*B2
            a = G*A
            lam = np.vdot(b1, a)/np.vdot(b1, b1) if np.vdot(b1, b1) != 0 else 0
            d1 = np.linalg.norm(a - lam*b1)/nk
            M = np.stack([b1, b2], axis=1)
            sol = np.linalg.lstsq(M, a, rcond=None)[0]
            d2 = np.linalg.norm(a - M@sol)/nk
            # raw commutator ||[V_p,G]kappa||/||G kappa|| (kernel-blind quantity)
            com = np.linalg.norm(G*(np.exp(tt*L*(unp+L)/4)-1)*B1)/nk
            row[str(tau)] = {'d1': d1, 'd2': d2, 'com': com, 'lam': [lam.real, lam.imag] if lam != 0 else [0, 0]}
        out[p] = row
    return out

def order(row, key):
    xs = [t for t in TAUS if t > 0]; ys = [row[str(t)][key] for t in xs]
    if min(ys) < 1e-13: return None
    return float(np.polyfit(np.log(xs), np.log(ys), 1)[0])

# coefficient systems
k = float((mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1))
dh = lambda n: [0, 1, k, -k, -1][n % 5]
NREP = 9000
def reptab(a, b, c):
    t = [0]*(NREP+1); X = 200
    for x in range(-X, X+1):
        for y in range(-X, X+1):
            v = a*x*x+b*x*y+c*y*y
            if 0 < v <= NREP: t[v] += 1
    return t
_r1 = reptab(1, 0, 5); _r2 = reptab(2, 2, 3)
r1 = lambda n: _r1[n]/2
r2 = lambda n: _r2[n]/2
def sig(n, w=0.3):
    return n**(-w)*sum(d**(2*w) for d in range(1, n+1) if n % d == 0)
random.seed(1); eps = {p: random.choice([-1, 1]) for p in PR + [53, 59]}
def cm(n, f):
    r = 1.0
    for p in PR + [53, 59]:
        while n % p == 0: n //= p; r *= f(p)
    return r
def bval(m):   # Beurling: generalised prime 5.5 in place of 5
    return float(m)*(5.5/5.0)**vp(m, 5)
qNR, cNR = 2, 2.1
def nrcoef(m):  # labels m = nu*q ; kappa(u+2lq)+kappa(u-2lq)+c kappa(u)
    c = qNR**-0.5
    if m % qNR == 0: c += cNR
    if m % (qNR*qNR) == 0: c += qNR**0.5
    return c

CASES = [
 ('zeta', 'zeta', lambda n: 1, {}),
 ('DH (mod 5)', 'dh', dh, {}),
 ('Epstein single class [1,0,5], h=2', 'ep', r1, {}),
 ('Epstein class sum [1,0,5]+[2,2,3] (Euler, degree 2)', 'ep', lambda n: r1(n)+r2(n), {}),
 ('real-shear torus E_w, w=0.3', 'bes', sig, {}),
 ('TW-: completely multiplicative random signs', 'zeta', lambda n: cm(n, lambda p: eps[p]), {}),
 ('TW-: Liouville', 'zeta', lambda n: cm(n, lambda p: -1), {}),
 ('real shift zeta(s+0.3)', 'zeta', lambda n: n**-0.3, {}),
 ('unimodular twist n^(-0.7i)', 'zeta', lambda n: complex(mp.mpf(n)**(-0.7j)), {}),
 ('T-NR q=2 c=2.1', 'zeta', nrcoef, {'val': lambda m: m/qNR, 'trans': lambda p: float(p)}),
 ('Beurling (5 -> 5.5), own primes', 'zeta', lambda n: 1, {'val': bval, 'trans': lambda p: bval(p)}),
 ('Beurling (5 -> 5.5), rational translations', 'zeta', lambda n: 1, {'val': bval, 'trans': lambda p: float(p)}),
 ('HEAT: zeta at tau0=-0.5 (defect measured from tau0)', 'zeta', lambda n: 1, {'tau0': -0.5}),
]
res = {}
for name, sd, cf, kw in CASES:
    r = run(name, sd, cf, **kw)
    res[name] = {}
    print('==', name)
    print('  p   d1(tau=0)   d1(.3)    d1(.1)    d1(.03)   d1(.01)  ord1 | d2(tau=0)  d2(.01)  ord2 | com(.01) ordc')
    for p in PR:
        row = r[p]; o1 = order(row, 'd1'); o2 = order(row, 'd2'); oc = order(row, 'com')
        res[name][p] = {'row': row, 'ord1': o1, 'ord2': o2, 'ordc': oc}
        f = lambda x: '%9.2e' % x
        print('%3d' % p, f(row['0.0']['d1']), f(row['0.3']['d1']), f(row['0.1']['d1']), f(row['0.03']['d1']), f(row['0.01']['d1']),
              ' %5s' % ('--' if o1 is None else '%.2f' % o1), '|', f(row['0.0']['d2']), f(row['0.01']['d2']), ' %5s' % ('--' if o2 is None else '%.2f' % o2),
              '|', f(row['0.01']['com']), ' %5s' % ('--' if oc is None else '%.2f' % oc))
    sys.stdout.flush()
json.dump(res, open(__file__.rsplit('/',1)[0] + '/defect.json', 'w'), indent=0)
