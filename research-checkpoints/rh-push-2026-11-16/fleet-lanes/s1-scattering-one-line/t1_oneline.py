"""Combination 1: arg F(1 + 2iT) against the random Euler-product (torus) model built from F's own coefficients.
Usage: t1_oneline.py M k1,k2,... [nwin]     (T uniform in [10^k, 2 10^k], t = 2T)"""
import sys, json, math, time, numpy as np
import lib
from lib import *
M = int(float(sys.argv[1])); KS = [int(k) for k in sys.argv[2].split(',')]; NWIN = int(sys.argv[3]) if len(sys.argv) > 3 else 20
PMODEL = 200000; QN, CN = 3, 2.2
SEED = int(__import__('os').environ.get('S1_SEED', '20261119')); rng = np.random.default_rng(SEED)
primes = primes_upto(PMODEL).astype(np.float64)
sgn = (1 - 2 * np.random.default_rng(121000).integers(0, 2, len(primes))).astype(np.float64)
uph = np.exp(2j * np.pi * np.random.default_rng(120000).random(len(primes)))
chi_p = CHI5[primes.astype(np.int64) % 5]
out = {'M': M, 'PMODEL': PMODEL, 'gpu': lib.GPU, 'blocks': {}}

def logprod_from_E(Efun, coefs, sigmas):
    """log prod_p (1 - c_p p^{-sigma} X_p)^{-1}; Efun(lo, hi) returns the (B, hi-lo) matrix X_p; coefs: dict name -> complex c_p.
    returns dict (name, sigma) -> (B,) complex numpy"""
    res = {}
    npr = len(primes); nsmall = int(np.searchsorted(primes, 100))
    C = 4000
    for lo in range(0, npr, C):
        hi = min(lo + C, npr)
        E = Efun(lo, hi); p = xp.asarray(primes[lo:hi])
        E2 = E * E; E3 = E2 * E
        for name, c in coefs.items():
            cg = xp.asarray(c[lo:hi])
            for sg in sigmas:
                w = cg * p ** (-sg)
                if lo == 0:
                    acc = -xp.log(1 - E[:, :nsmall] * w[None, :nsmall]).sum(axis=1)
                    wl = w.copy(); wl[:nsmall] = 0
                else:
                    acc = 0; wl = w
                acc = acc + E @ wl + E2 @ (wl * wl / 2) + E3 @ (wl * wl * wl / 3)
                res[(name, sg)] = res.get((name, sg), 0) + acc
        del E, E2, E3
    return {k: asnp(v) for k, v in res.items()}

def E_real(tg):
    def f(lo, hi):
        ph = xp.outer(tg, xp.log(xp.asarray(primes[lo:hi])))
        return xp.cos(ph) - 1j * xp.sin(ph)
    return f

def E_rand(B, seed):
    r = (cp.random.RandomState(seed) if lib.GPU else np.random.RandomState(seed))
    def f(lo, hi):
        th = r.random_sample((B, hi - lo)) * (2 * math.pi)
        return xp.cos(th) - 1j * xp.sin(th)
    return f

def tnr_m(X3):
    """m~(1 + it) = q^{-(s-1/2)} m(s) at s = 1 + it, X3 = q^{-it}: 1 + (c/sqrt q) X + X^2/q  (Dirichlet polynomial, leading coefficient 1)"""
    return 1 + (CN / math.sqrt(QN)) * X3 + X3 * X3 / QN

def stats(a):
    a = np.asarray(a, dtype=np.float64); n = len(a); mu = a.mean(); d = a - mu
    m2 = (d**2).mean(); m4 = (d**4).mean(); m8 = (d**8).mean()
    return {'n': n, 'mean': mu, 'se_mean': math.sqrt(m2 / n), 'var': m2, 'se_var': math.sqrt(max(m4 - m2**2, 0) / n),
            'm4': m4, 'se_m4': math.sqrt(max(m8 - m4**2, 0) / n), 'kurt': m4 / m2**2, 'max_abs': float(np.abs(a).max()),
            'q999': float(np.quantile(np.abs(a), 0.999)), 'q99999': float(np.quantile(np.abs(a), 0.99999))}

def summarise(vals):
    """vals: dict name -> dict of complex arrays; returns dict of statistics"""
    S = {}
    for name, F in vals.items():
        if isinstance(F, tuple):          # product of factors: sum of principal args
            arg = sum(np.angle(f) for f in F); Fv = np.prod(np.array(F), axis=0)
        else:
            arg = np.angle(F); Fv = F
        S[name] = {'arg': stats(arg), 'logabs': stats(np.log(np.abs(Fv))), 'frac_Re_neg': float((Fv.real < 0).mean()), 'min_abs': float(np.abs(Fv).min())}
    return S

def functions_from(z, zq, z2, Lc, Lcb, sg, un, X3):
    return {'ZETA': z[1.0], 'LCHI': Lc, 'DH': C1 * Lc + C2 * Lcb, 'EA_1_4': (z[1.25], z[0.75]), 'LIOU': (z2, 1 / z[1.0]),
            'SGN': sg, 'U': un, 'TNR': (z[1.0], tnr_m(X3))}

# ---------- model (torus) Monte Carlo: sigma = 1 and 1 +- 0.01 for the Jessen derivative ----------
t0 = time.time()
BM = 2000; modelvals = {}
acc = {}
SIGS = (0.99, 1.0, 1.01)
for b in range(0, M, BM):
    B = min(BM, M - b)
    coefs = {'one': np.ones(len(primes), dtype=complex), 'chi': chi_p, 'chib': np.conj(chi_p)}
    seed = 777000 + b
    r = logprod_from_E(E_rand(B, seed), coefs, SIGS + (0.75, 1.25, 2.0))
    r2 = logprod_from_E(lambda lo, hi, f=E_rand(B, seed): f(lo, hi) ** 2, {'one': np.ones(len(primes), dtype=complex)}, (2.0,))
    # X_3 for the T-NR local factor: regenerate the first chunk with the same seed
    X3 = asnp(E_rand(B, seed)(0, min(4000, len(primes)))[:, 1])
    z = {1.0: np.exp(r[('one', 1.0)]), 0.75: np.exp(r[('one', 0.75)]), 1.25: np.exp(r[('one', 1.25)])}
    Lc = np.exp(r[('chi', 1.0)]); Lcb = np.exp(r[('chib', 1.0)])
    f = functions_from(z, None, np.exp(r2[('one', 2.0)]), Lc, Lcb, z[1.0], z[1.0], X3)
    for sgm in SIGS:
        f['DHsig%.2f' % sgm] = C1 * np.exp(r[('chi', sgm)]) + C2 * np.exp(r[('chib', sgm)])
    for k, v in f.items():
        acc.setdefault(k, []).append(v)
model = {k: (tuple(np.concatenate([x[i] for x in v]) for i in range(len(v[0]))) if isinstance(v[0], tuple) else np.concatenate(v)) for k, v in acc.items()}
out['model'] = summarise(model)
phi = {s: np.log(np.abs(model['DHsig%.2f' % s])) for s in SIGS}
d = (phi[1.01] - phi[0.99]) / 0.02
out['model']['DH_jessen'] = {'dphi_dsigma_at_1': float(d.mean()), 'se': float(d.std() / math.sqrt(len(d))),
                             'zero_density_right_of_1_per_unit_t': float(-d.mean() / (2 * math.pi)), 'se_density': float(d.std() / math.sqrt(len(d)) / (2 * math.pi))}
print('model done %.0fs' % (time.time() - t0), json.dumps(out['model']['DH_jessen']), flush=True)

# exact cumulants of the zeta model (per-prime quadrature)
def local_moments(fun, n=4096):
    th = (np.arange(n) + 0.5) * 2 * np.pi / n; a = fun(np.exp(-1j * th)); a = a - a.mean()
    return (a**2).mean(), (a**4).mean() - 3 * (a**2).mean() ** 2
pe = primes_upto(10**6).astype(np.float64)
v = k4 = 0.0
for p in pe[pe < 20000]:
    a, b = local_moments(lambda X: np.angle(1 / (1 - X / p))); v += a; k4 += b
big = pe[pe >= 20000]; v += (0.5 / big**2).sum() + 1 / (2 * 1e6 * math.log(1e6)); k4 += (-3 / (8 * big**4)).sum()
v5, k45 = local_moments(lambda X: np.angle(1 / (1 - X / 5)))
v3, k43 = local_moments(lambda X: np.angle(1 / (1 - X / 3)))
v3n, k43n = local_moments(lambda X: np.angle(1 / (1 - X / 3)) + np.angle(tnr_m(X)))
out['exact_model'] = {'ZETA': {'var': v, 'm4': k4 + 3 * v * v}, 'LCHI': {'var': v - v5, 'm4': (k4 - k45) + 3 * (v - v5) ** 2},
                      'TNR': {'var': v - v3 + v3n, 'm4': (k4 - k43 + k43n) + 3 * (v - v3 + v3n) ** 2}}
print('exact model', json.dumps(out['exact_model']), flush=True)

# ---------- data ----------
BD = 4000
for k in KS:
    t0 = time.time(); T0 = 10.0 ** k
    T = np.sort(rng.uniform(T0, 2 * T0, M)); t = 2 * T
    acc = {}
    for b in range(0, M, BD):
        tb = t[b:b + BD]
        o = oneline_batch(tb, sigmas=(0.75, 1.0, 1.25))
        r = logprod_from_E(E_real(xp.asarray(tb)), {'sgn': sgn.astype(complex), 'u': uph}, (1.0,))
        X3 = np.exp(-1j * tb * math.log(3.0))
        f = functions_from(o['zeta'], None, o['zeta2'], o['Lchi'], o['Lchibar'], np.exp(r[('sgn', 1.0)]), np.exp(r[('u', 1.0)]), X3)
        for kk, vv in f.items(): acc.setdefault(kk, []).append(vv)
        if b == 0: print('block k=%d first batch %.1fs' % (k, time.time() - t0), flush=True)
    data = {kk: (tuple(np.concatenate([x[i] for x in vv]) for i in range(len(vv[0]))) if isinstance(vv[0], tuple) else np.concatenate(vv)) for kk, vv in acc.items()}
    S = summarise(data)
    # winding of DH (and zeta) along the 1-line in windows: unwrapped phase, step h
    h = 0.02; LW = 200.0; npts = int(LW / h) + 1; wins = []
    for w in range(NWIN):
        a = rng.uniform(2 * T0, 4 * T0 - LW); tw = a + h * np.arange(npts)
        dh = []; ze = []
        for b in range(0, npts, BD):
            o = oneline_batch(tw[b:b + BD], sigmas=(1.0,))
            dh.append(C1 * o['Lchi'] + C2 * o['Lchibar']); ze.append(o['zeta'][1.0])
        dh = np.concatenate(dh); ze = np.concatenate(ze)
        st = np.angle(dh[1:] / dh[:-1]); sz = np.angle(ze[1:] / ze[:-1])
        wins.append({'t_start': a, 'DH_dphase_over_2pi': float(st.sum() / (2 * math.pi)), 'DH_max_step': float(np.abs(st).max()), 'DH_min_abs': float(np.abs(dh).min()),
                     'ZETA_dphase_over_2pi': float(sz.sum() / (2 * math.pi)), 'ZETA_max_step': float(np.abs(sz).max())})
    dens = np.array([-wn['DH_dphase_over_2pi'] / LW for wn in wins])
    S['winding'] = {'h': h, 'LW': LW, 'windows': wins, 'DH_zero_density_right_of_1': float(dens.mean()) if NWIN else None,
                    'se': float(dens.std() / math.sqrt(max(NWIN, 1))) if NWIN else None,
                    'ZETA_net_over_2pi_max': float(max(abs(wn['ZETA_dphase_over_2pi']) for wn in wins)) if NWIN else None}
    out['blocks'][str(k)] = S
    print('block k=%d done %.0fs' % (k, time.time() - t0), flush=True)
    json.dump(out, open('t1_result_M%d_seed%d.json' % (M, SEED), 'w'), indent=1)
# comparison table
print('\nfunction | block | var(arg) data | model | z | m4 data | model | z | max|arg| data | model sample max')
for k in KS:
    for name in ['ZETA', 'LCHI', 'DH', 'EA_1_4', 'LIOU', 'SGN', 'U', 'TNR']:
        dd = out['blocks'][str(k)][name]['arg']; mname = name; mm = out['model'][mname]['arg']
        zv = (dd['var'] - mm['var']) / math.hypot(dd['se_var'], mm['se_var']); z4 = (dd['m4'] - mm['m4']) / math.hypot(dd['se_m4'], mm['se_m4'])
        print('%s | 1e%d | %.5f | %.5f | %+.2f | %.5f | %.5f | %+.2f | %.4f | %.4f' % (name, k, dd['var'], mm['var'], zv, dd['m4'], mm['m4'], z4, dd['max_abs'], mm['max_abs']))
