"""Combination 1, prime side.  g_F(t) = (psi_F(e^t) - M_F(e^t)) e^{-(1/2+c) t},  R_F(d) = int_d^T |g|^2 / int_0^T |g|^2,  T = log X.
int |g|^2 dt = int |psi_F(x) - M_F(x)|^2 x^{-2-2c} dx.
Exact part 1 <= x < N0: psi_F constant on [n, n+1), 5-point Gauss-Legendre per unit interval.
Binned part N0 <= x < X: psi_F at the bin edges from psi.c (primes) plus prime powers; trapezoid in t.
usage: t1_prime.py N0 binfile|none out.json"""
import sys, json, math, time, struct, numpy as np
N0 = int(float(sys.argv[1])); binfile = sys.argv[2]; outp = sys.argv[3]
ALPHA = 1.2393168126993495
Q, CQ = 1000003, 2.2
def mix(p):
    z = p.astype(np.uint64) + np.uint64(0x9e3779b97f4a7c15)
    z = (z ^ (z >> np.uint64(30))) * np.uint64(0xbf58476d1ce4e5b9)
    z = (z ^ (z >> np.uint64(27))) * np.uint64(0x94d049bb133111eb)
    return z ^ (z >> np.uint64(31))
def w_chi4(p): return np.where(p % 2 == 0, 0.0, np.where(p % 4 == 1, 1.0, -1.0))
def w_chi5(p): r = p % 5; return np.where(r == 0, 0.0, np.where((r == 1) | (r == 4), 1.0, -1.0))
def w_sgn(p): return np.where(mix(p) & np.uint64(1), -1.0, 1.0)
def w_uni(p): return np.exp(2j * np.pi * ((mix(p) >> np.uint64(20)) & np.uint64(4095)).astype(np.float64) / 4096.0)
t00 = time.time()
# ---- primes below max(N0, sqrt X)
if binfile != 'none':
    f = open(binfile, 'rb'); nb, NW, X, x0 = struct.unpack('4q', f.read(32)); dt = struct.unpack('d', f.read(8))[0]
    B = np.frombuffer(f.read(8 * (nb + 1)), dtype=np.uint64); cnt = np.frombuffer(f.read(8 * nb), dtype=np.uint64); S = np.frombuffer(f.read(8 * nb * NW), dtype=np.float64).reshape(nb, NW); f.close()
    assert x0 == N0
else:
    X = N0; nb = 0
PL = max(N0, int(math.isqrt(X)) + 2)
print('planned memory: sieve %.2f GB, per-object arrays %.2f GB' % (PL / 1e9, 5 * N0 * 16 / 1e9), flush=True)
sv = np.ones(PL + 1, dtype=bool); sv[:2] = False
for i in range(2, int(PL ** 0.5) + 1):
    if sv[i]: sv[i * i::i] = False
primes = np.nonzero(sv)[0].astype(np.int64); del sv
print('pi(%d) = %d' % (PL, len(primes)), flush=True)
# ---- per-object von Mangoldt-type coefficient on prime powers: (weight function on primes, power rule), main term [(m_j, e_j)], smooth multiplier
def lam_exact(wfun):
    """array a[n], n < N0: sum over p^k = n of w(p)^k log p"""
    p = primes[primes < N0]; w = wfun(p); iscomplex = np.iscomplexobj(w)
    a = np.zeros(N0, dtype=np.complex128 if iscomplex else np.float64)
    lp = np.log(p); pk = p.copy(); wk = w.copy(); alive = np.ones(len(p), bool)
    while True:
        idx = pk < N0
        if not idx.any(): break
        np.add.at(a, pk[idx], wk[idx] * lp[idx])
        pk = np.where(idx, pk * p, N0); wk = wk * w
    return a
one = lambda p: np.ones(len(p))
OBJ = {}
import os
ONLY_DH = os.environ.get('ONLY') == 'DH'
lz = lam_exact(one) if not ONLY_DH else None
n_ar = np.arange(N0, dtype=np.float64); n_ar[0] = 1.0
if not ONLY_DH:
    OBJ['ZETA'] = dict(a=lz, main=[(1.0, 1.0)])
    OBJ['LCHI4'] = dict(a=lam_exact(w_chi4), main=[])
    OBJ['LCHI5'] = dict(a=lam_exact(w_chi5), main=[])
    OBJ['SGN'] = dict(a=lam_exact(w_sgn), main=[])
    OBJ['UNI'] = dict(a=lam_exact(w_uni), main=[])
    OBJ['LIOU'] = dict(a=lam_exact(lambda p: -np.ones(len(p))), main=[(-1.0, 1.0), (2.0, 0.5)])
    n_ar = np.arange(N0, dtype=np.float64); n_ar[0] = 1.0
    OBJ['WT'] = dict(a=lz * np.exp(-1j * ALPHA * np.log(n_ar)), main=[(1 / (1 - 1j * ALPHA), 1 - 1j * ALPHA)])
    for a_, nm in [(0.25, 'EA-1/4'), (0.125, 'EA-1/8')]:
        OBJ[nm] = dict(a=lz * (n_ar ** a_ + n_ar ** -a_), main=[(1 / (1 + a_), 1 + a_), (1 / (1 - a_), 1 - a_)])
    def tnr(q, c):
        a = lz.copy(); r1 = (-c + math.sqrt(c * c - 4)) / 2; r2 = (-c - math.sqrt(c * c - 4)) / 2; k = 1; jumps = []
        while q ** k < X:
            v = -(r1 ** k + r2 ** k) * q ** (k / 2) * math.log(q)
            if q ** k < N0: a[q ** k] += v
            else: jumps.append((q ** k, v))
            k += 1
        return a, jumps
    a, j = tnr(Q, CQ); OBJ['TNR-q1000003'] = dict(a=a, main=[(1.0, 1.0)], jumps=j)
    a, j = tnr(3, CQ); OBJ['TNR-q3'] = dict(a=a, main=[(1.0, 1.0)], jumps=j)
# DH: f periodic mod 5 (1, kappa, -kappa, -1, 0); Lambda_DH = (f log) * f^{-1}
def dh_lambda():
    kap = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
    f = np.tile(np.array([0.0, 1.0, kap, -kap, -1.0]), N0 // 5 + 1)[:N0]; f[0] = 0
    g = np.zeros(N0); g[1] = 1.0                       # Dirichlet inverse
    for d in range(1, N0 // 2 + 1):
        if d > 1 and g[d] == 0: continue
        if d == 1:
            g[2:] -= f[2:]                              # contribution of g[1] f[k] to g[k]
        else:
            m = (N0 - 1) // d
            if m >= 2: g[2 * d:(m + 1) * d:d] -= g[d] * f[2:m + 1]
    fl = f * np.log(n_ar); L = np.zeros(N0)
    for d in range(1, N0):
        if g[d] == 0: continue
        m = (N0 - 1) // d
        L[d:(m + 1) * d:d] += g[d] * fl[1:m + 1]
    return L
t1 = time.time(); OBJ['DH'] = dict(a=dh_lambda(), main=[], exact_only=True); print('DH coefficients %.0f s; Lambda_DH(2..12) =' % (time.time() - t1), OBJ['DH']['a'][2:13], flush=True)
# ---- integrals
CS = [0.5, 0.25]
gx, gw = np.polynomial.legendre.leggauss(5); gx = (gx + 1) / 2; gw = gw / 2
def Mval(main, x):
    m = 0
    for mj, ej in main: m = m + mj * x ** ej
    return m
def exact_part(o, c):
    """cumulative J[n] = int_1^n |psi - M|^2 x^{-2-2c} dx for n = 1..N0"""
    P = np.cumsum(o['a']); J = np.zeros(N0 + 1); CH = 1 << 20
    for s in range(1, N0, CH):
        e = min(N0, s + CH); n = np.arange(s, e, dtype=np.float64); acc = np.zeros(e - s)
        for u, w in zip(gx, gw):
            x = n + u; acc += w * np.abs(P[s:e] - Mval(o['main'], x)) ** 2 * x ** (-2 - 2 * c)
        J[s + 1:e + 1] = acc
    return np.cumsum(J), P[N0 - 1]
dgrid = [0.25 * k for k in range(1, 121)]
res = dict(N0=N0, X=X, alpha=ALPHA, objects={})
if nb:
    pi_check = int(cnt.sum()) + int((primes < N0).sum()); print('pi(X) =', pi_check, flush=True); res['pi_X'] = pi_check
    Bf = B.astype(np.float64); tB = np.log(B.astype(np.longdouble)).astype(np.float64); mid = np.sqrt(Bf[:-1] * Bf[1:])
    # prime powers k >= 2 with N0 <= p^k < X
    pp = primes[primes.astype(np.float64) ** 2 < X]
    def binned(wcol, wfun, mult=None, jumps=()):
        inc = (S[:, wcol[0]] + (1j * S[:, wcol[1]] if len(wcol) > 1 else 0)).astype(np.clongdouble if len(wcol) > 1 else np.longdouble)
        if mult is not None: inc = inc * mult(mid)
        inc = inc.copy()
        w = wfun(pp); pk = pp.astype(np.float64) * pp; wk = w * w; lp = np.log(pp); k = 2
        while True:
            idx = (pk >= N0) & (pk < X)
            if not (pk < X).any(): break
            if idx.any():
                b = np.searchsorted(Bf, pk[idx], side='right') - 1; v = wk[idx] * lp[idx]
                if mult is not None: v = v * mult(pk[idx])
                np.add.at(inc, b, v)
            pk = pk * pp; wk = wk * w; k += 1
        for xq, v in jumps:
            b = int(np.searchsorted(Bf, float(xq), side='right') - 1); inc[b] += v
        return inc
    BIN = {'ZETA': dict(col=[0], w=one), 'LCHI4': dict(col=[1], w=w_chi4), 'LCHI5': dict(col=[2], w=w_chi5), 'SGN': dict(col=[3], w=w_sgn), 'UNI': dict(col=[4, 5], w=w_uni),
           'LIOU': dict(col=[0], w=lambda p: -np.ones(len(p)), sign=-1), 'WT': dict(col=[0], w=one, mult=lambda x: np.exp(-1j * ALPHA * np.log(x))),
           'EA-1/4': dict(col=[0], w=one, mult=lambda x: x ** 0.25 + x ** -0.25), 'EA-1/8': dict(col=[0], w=one, mult=lambda x: x ** 0.125 + x ** -0.125),
           'TNR-q1000003': dict(col=[0], w=one), 'TNR-q3': dict(col=[0], w=one)}
for name, o in OBJ.items():
    r = dict(main=[[str(m), str(e)] for m, e in o['main']]); t1 = time.time()
    for c in CS:
        J, Pend = exact_part(o, c)
        tt = [math.log(max(1, min(N0, round(math.exp(d))))) for d in dgrid if d <= math.log(N0) + 1e-9]
        Jd = [float(J[max(1, min(N0, round(math.exp(d))))]) for d in dgrid if d <= math.log(N0) + 1e-9]
        entry = dict(t_exact=tt, J_exact=Jd, J_N0=float(J[N0]), psi_N0=str(Pend))
        if nb and not o.get('exact_only'):
            bi = BIN[name]; inc = binned(bi['col'], bi['w'], bi.get('mult'), o.get('jumps', ()))
            if name == 'LIOU':   # primes carry -1: flip the prime part only (prime powers were added with their own signs)
                inc = binned([0], bi['w']) - 2 * (S[:, 0]).astype(np.longdouble)
            P = np.concatenate([[0], np.cumsum(inc)]) + Pend          # psi just below B_k
            gB = (P - Mval(o['main'], Bf.astype(np.longdouble))).astype(np.complex128)
            fB = np.abs(gB) ** 2 * np.exp(-(1 + 2 * c) * tB)
            seg = 0.5 * (fB[1:] + fB[:-1]) * np.diff(tB); Jb = np.concatenate([[0], np.cumsum(seg)]) + J[N0]
            entry['t_bin'] = [float(tB[np.searchsorted(tB, d)]) for d in dgrid if math.log(N0) + 1e-9 < d <= tB[-1]]
            entry['J_bin'] = [float(Jb[np.searchsorted(tB, d)]) for d in dgrid if math.log(N0) + 1e-9 < d <= tB[-1]]
            entry['J_X'] = float(Jb[-1]); entry['psi_X'] = str(P[-1]); entry['err_over_sqrt_X_at_X'] = float(abs(gB[-1]) / math.sqrt(X))
            # normalised error at decade points
            entry['err_over_sqrt'] = [[float(Bf[i]), float(abs(gB[i]) / math.sqrt(Bf[i]))] for i in np.linspace(0, nb, 13).astype(int)]
        r['c=%g' % c] = entry
    res['objects'][name] = r; print(name, '%.0f s' % (time.time() - t1), json.dumps({k: (v.get('J_N0'), v.get('J_X'), v.get('psi_X')) for k, v in r.items() if k.startswith('c=')}), flush=True)
json.dump(res, open(outp, 'w')); print('done %.0f s' % (time.time() - t00))
