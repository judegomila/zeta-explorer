"""Combination 2: number variance Sigma^2(L) of zeros in windows of L mean spacings, from zero lists, against GUE and the
Bogomolny-Keating / Conrey-Snaith two-point formula (prime side, products over primes <= P; rmt.BK):
  Sigma^2_BK(L; Lg) = L + 2 int_0^L (L - u)(r2(u; Lg) - 1) du,  Lg = log(q t/2 pi).
Windows [u, u + L) in the unfolded variable, u on a grid of step 1/4; 40 chunks, jackknife errors.
Also: T-NR union list (zeta zeros + the off-line pairs at ordinates (2k+1) pi/log q), windows of the same length in t.
Usage: c2.py OUT.json SPEC...   SPEC = name:kind:path[:key[:tmin]] (kinds odl, blk, heat, lz as in the s3 lane); 'PRED:<q>:<T>' gives the prediction only."""
import sys, json, math, numpy as np
import rmt
PI = math.pi
LS = [0.5, 1.0, 2.0, 3.0, 5.0, 10.0, 20.0, 50.0]
NCH = 40; QT = 1000003

def load(spec):
    p = spec.split(':'); name, kind, path = p[0], p[1], p[2]
    if kind == 'odl':
        t = np.loadtxt(path); x = (0.5 * t * np.log(t / (2 * PI)) - 0.5 * t - PI / 8 + 1 / (48 * t)) / PI + 1; q = 1; T0 = 0.0; d = t
    elif kind in ('blk', 'heat'):
        z = np.load(path); T0 = float(z['T0']); d = z['delta']; x = z['x']; q = 1
    elif kind == 'lz':
        z = np.load(path); d = z['t_' + p[3]]; x = z['x_' + p[3]]; q = 5; T0 = 0.0
    tmin = float(p[4]) if len(p) > 4 and p[4] else (2e5 if T0 == 0 else -1.0)
    m = (T0 + d) >= tmin
    return dict(name=name, kind=kind, q=q, T0=T0, d=d[m], x=x[m])

_BK = {}
def bk(q):
    if q not in _BK:
        _BK[q] = rmt.BK(q, P=10 ** 6, xmax=2 * PI * 50 / 9.0 * 1.01, nx=9000)
    return _BK[q]

def sig_bk(L, Lg, q):
    du = 0.001; u = (np.arange(int(round(L / du))) + 0.5) * du
    return float(L + 2 * np.sum((L - u) * (bk(q).r2(u, Lg) - 1)) * du)
def sig_gue_num(L):
    du = 0.001; u = (np.arange(int(round(L / du))) + 0.5) * du
    return float(L + 2 * np.sum((L - u) * (-np.sinc(u) ** 2)) * du)

def numvar(x, L, step=0.25):
    u = np.arange(x[0], x[-1] - L, step)
    c = np.searchsorted(x, u + L) - np.searchsorted(x, u)
    return c

def jack(v):
    v = np.asarray(v); n = len(v); m = v.mean()
    return float(m), float(np.std(v, ddof=1) / math.sqrt(n))

def one(spec):
    if spec.startswith('PRED:'):
        _, q, T = spec.split(':'); q = int(q); T = float(T); Lg = math.log(q * T / (2 * PI))
        return dict(name='PRED q=%d T=%g' % (q, T), q=q, T=T, Lg=Lg, L=LS, gue=[rmt.numvar_gue(L) for L in LS], bk=[sig_bk(L, Lg, q) for L in LS])
    lst = load(spec); x = lst['x']; t = lst['T0'] + lst['d']; q = lst['q']; n = len(x)
    e = np.linspace(0, n, NCH + 1).astype(int)
    Lgc = [math.log(q * float(np.median(t[e[i]:e[i + 1]])) / (2 * PI)) for i in range(NCH)]
    r = dict(name=lst['name'], q=q, n=int(n), T_med=float(np.median(t)), Lg=float(np.mean(Lgc)), L=LS, data=[], se=[], gue=[], bk=[], mean_minus_L=[])
    for L in LS:
        vs = []; ms = []
        for i in range(NCH):
            c = numvar(x[e[i]:e[i + 1]], L)
            vs.append(np.mean((c - L) ** 2)); ms.append(np.mean(c) - L)
        m, s = jack(vs)
        r['data'].append(m); r['se'].append(s); r['gue'].append(rmt.numvar_gue(L)); r['mean_minus_L'].append(float(np.mean(ms)))
        r['bk'].append(float(np.mean([sig_bk(L, g, q) for g in Lgc[::8]])))
    if lst['kind'] == 'blk':
        # T-NR union: off-line pairs at t = (2k+1) pi / log q, both members counted
        d = lst['d']; T0 = lst['T0']; lq = math.log(QT); sp = 2 * PI / lq
        import mpmath as mp
        mp.mp.dps = 40
        k0 = int(mp.floor((mp.mpf(T0) + d[0]) * lq / (2 * mp.pi) - mp.mpf(1) / 2)) + 1
        first = float((2 * mp.mpf(k0) + 1) * mp.pi / lq - mp.mpf(T0))
        lat = first + sp * np.arange(int((d[-1] - first) / sp))
        rho = r['Lg'] / (2 * PI); un = []
        for L in LS:
            w = L / rho; u = np.arange(d[0], d[-1] - w, w / 4)
            cz = np.searchsorted(d, u + w) - np.searchsorted(d, u)
            cl = 2 * (np.searchsorted(lat, u + w) - np.searchsorted(lat, u))
            un.append(dict(L=L, var_zeta=float(cz.var()), var_lattice=float(cl.var()), var_union=float((cz + cl).var()), cov=float(np.mean((cz - cz.mean()) * (cl - cl.mean()))),
                           offline_per_window=float(cl.mean()), online_per_window=float(cz.mean())))
        r['tnr_union'] = un
    return r

if __name__ == '__main__':
    print('GUE check: closed form', rmt.numvar_gue(2.0), 'numeric', sig_gue_num(2.0), flush=True)
    res = []
    for spec in sys.argv[2:]:
        r = one(spec); res.append(r)
        print(json.dumps(r), flush=True)
        json.dump(res, open(sys.argv[1], 'w'), indent=1)
