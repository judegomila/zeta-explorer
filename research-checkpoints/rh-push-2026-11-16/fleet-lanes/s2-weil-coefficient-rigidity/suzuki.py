"""Combination 3: Suzuki screw function Psi_F and its dyadic-cell Toeplitz matrices, for zeta and controls.
Psi_F(W) = (W/2) q_W[e_0] (e_0 = normalised box of width W) for the Weil form of F:
  Psi_F(W) = (W/2) c0 + sum_j sum_{k>=0} (1 - e^{-alpha_jk W})/alpha_jk^2 + sum_poles 2(cosh(pW) - 1)/p^2
             - sum_n c(n) n^{-1/2} (W - log n)_+,
  c0 = 2 log Q + sum_j (psi(z_j) - log pi), alpha_jk = 2(k + z_j).
(zeta: z = 1/4, p = 1/2, Q = 1: equals a W + T(W) - D(W) of PR 21.)
Cell matrix H_{h,m} = Toeplitz(q), q_0 = 2 Re Psi(h)/h, q_d = (Psi((d+1)h) - 2 Psi(dh) + Psi((d-1)h))/h, h = log 2 / 2^k.
usage: python suzuki.py X kmax outfile   (X = bound on n, support up to log X)
"""
import sys, json, math, time, bisect, os
import numpy as np
import scipy.linalg as sla
import mpmath as mp
mp.mp.dps = 50
X = int(float(sys.argv[1])); KMAX = int(sys.argv[2]); OUT = sys.argv[3]
SETDIR = os.environ.get('SETDIR', '.')
t0 = time.time()
print('finest grid points per object: %d mp values;' % (int(math.log(X) / (math.log(2) / 2 ** KMAX)) + 2), end=' ')
print('planned allocations: spf int32[%d] = %.0f MB; coefficient arrays float64/complex128[%d] = %.0f MB each (at most 3 alive)' % (X + 1, 4 * X / 1e6, X + 1, 16 * X / 1e6), flush=True)

def spf_sieve(N):
    spf = np.zeros(N + 1, dtype=np.int32)
    for p in range(2, int(N ** 0.5) + 1):
        if spf[p] == 0:
            seg = spf[p * p::p]; seg[seg == 0] = p
    idx = np.nonzero(spf[2:] == 0)[0] + 2; spf[idx] = idx
    return spf
SPF = spf_sieve(X)
PRIMES = np.nonzero(SPF == np.arange(X + 1))[0]; PRIMES = PRIMES[PRIMES >= 2]
print('primes below X:', len(PRIMES), flush=True)

def events_mult(eps):
    """events (n, c(n)) for c(p^k) = eps_p^k log p; eps: array over PRIMES (float or complex), or scalar"""
    ev = []
    e = np.broadcast_to(np.asarray(eps), PRIMES.shape)
    for p, ep in zip(PRIMES.tolist(), e.tolist()):
        lp = math.log(p); q = p; w = ep
        while q <= X:
            if w != 0: ev.append((q, w * lp))
            q *= p; w *= ep
        if p * p > X and False: break
    return ev

def events_tnr(q, c):
    ev = dict(events_mult(1.0))
    s0, s1 = 2.0, -c * math.sqrt(q); n = q
    while n <= X:
        ev[n] = ev.get(n, 0.0) - s1 * math.log(q)
        s0, s1 = s1, (-c * math.sqrt(q)) * s1 - q * s0
        n *= q
    return sorted(ev.items())

def events_dh():
    kap = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
    ap = np.array([0, 1, kap, -kap, -1.0])
    n = np.arange(X + 1)
    a = ap[n % 5]
    c = a * np.log(np.maximum(n, 1))
    for d in range(2, X // 2 + 1):
        if c[d] != 0.0:
            m = np.arange(2, X // d + 1)
            c[d * m] -= c[d] * a[m]
    idx = np.nonzero(c[2:])[0] + 2
    return list(zip(idx.tolist(), c[idx].tolist()))

def events_ea(b):
    return [(n, c * (n ** b + n ** -b)) for n, c in events_mult(1.0)]

def events_chi(tab):
    q = len(tab)
    return events_mult(np.array([tab[p % q] for p in PRIMES.tolist()], dtype=float))

HF = mp.log(2) / 2 ** KMAX                      # finest mesh; every level-k grid is a sub-grid
MF = int(math.log(X) / float(HF))
class Obj:
    """stores Psi_F on the finest grid r = d * HF, d = 0..MF (50 digits); prefix sums are not kept"""
    def __init__(self, name, zs, logQ2, poles, events):
        self.name, self.zs, self.logQ2, self.poles = name, [mp.mpf(z) for z in zs], mp.mpf(logQ2), [mp.mpf(p) for p in poles]
        ev = sorted(events)
        self.cplx = any(isinstance(c, complex) and c.imag != 0 for n, c in ev)
        self.c0 = self.logQ2 + sum(mp.digamma(z) - mp.log(mp.pi) for z in self.zs)
        grid = [HF * d for d in range(MF + 1)]
        gridf = [float(g) for g in grid]
        S = mp.mpc(0); J = mp.mpc(0); P = []; e = 0; ne = len(ev)
        for d in range(MF + 1):
            lim = gridf[d]
            while e < ne and math.log(ev[e][0]) <= lim + 1e-12:
                n, c = ev[e]
                w = mp.mpc(c) / mp.sqrt(n)
                S += w; J += w * mp.log(n); e += 1
            P.append((self.base(grid[d]) if d > 0 else mp.mpf(0)) - (grid[d] * S - J))
        self.P = P
    def base(self, W):
        """archimedean + pole part"""
        W = mp.mpf(W)
        v = W / 2 * self.c0
        for z in self.zs:
            v += mp.polygamma(1, z) / 4
            kmax = int(mp.ceil(mp.mpf(125) / (2 * W))) + 2
            q = mp.exp(-2 * W); term = mp.exp(-2 * z * W); s = mp.mpf(0)
            for k in range(kmax):
                s += term / (4 * (k + z) ** 2); term *= q
            v -= s
        for p in self.poles:
            v += 2 * (mp.cosh(p * W) - 1) / p ** 2
        return v
    def psi_grid(self, d):
        return self.P[d]

def qvec(obj, k, m, cache):
    h = mp.log(2) / 2 ** k
    st = 2 ** (KMAX - k)
    P = [obj.P[d * st] for d in range(m + 1)]
    q = [2 * mp.re(P[1]) / h]
    for d in range(1, m):
        q.append((P[d + 1] - 2 * P[d] + P[d - 1]) / h)
    return q, P

def toep(q, cplx):
    if cplx:
        col = np.array([complex(x) for x in q])
        return sla.toeplitz(col.conj(), col)       # H[i,j] = q_{j-i} for j >= i ; Hermitian
    return sla.toeplitz(np.array([float(mp.re(x)) for x in q]))

def lam_min(H): return float(np.linalg.eigvalsh(H)[0])

def pf_restrict(H, k):
    """restriction of the cell matrix to step vectors orthogonal to e^{+x/2} and e^{-x/2} (pole-free step functions)"""
    m = H.shape[0]
    if m <= 2: return np.zeros((0, 0))
    h = math.log(2) / 2 ** k
    i = np.arange(m) - (m - 1) / 2
    P = np.stack([np.exp(i * h / 2), np.exp(-i * h / 2)], axis=1)
    Qm, _ = np.linalg.qr(P, mode='complete')
    Z = Qm[:, 2:]
    return Z.conj().T @ H @ Z

def hinge_q(ell, k, m):
    """Toeplitz column of the hinge (|r| - ell)_+ : second differences / h"""
    h = mp.log(2) / 2 ** k; ell = mp.mpf(ell)
    f = lambda r: max(r - ell, mp.mpf(0))
    return [2 * f(h) / h] + [(f((d + 1) * h) - 2 * f(d * h) + f((d - 1) * h)) / h for d in range(1, m)]

def mp_rayleigh(q, v):
    m = len(v); num = mp.mpf(0)
    vv = [mp.mpc(x) for x in v]
    for i in range(m):
        for j in range(m):
            d = j - i
            qq = q[d] if d >= 0 else mp.conj(q[-d])
            num += mp.re(mp.conj(vv[i]) * qq * vv[j])
    return num / sum(abs(x) ** 2 for x in vv)

# ------------------------------------------------------------------ objects
def load_set(name):
    f = os.path.join(SETDIR, 'set_%s.npy' % name)
    return set(np.load(f).tolist()) if os.path.exists(f) else None

objs = []
objs.append(Obj('ZETA', ['0.25'], 0, ['0.5'], events_mult(1.0)))
objs.append(Obj('ZETA/pf', ['0.25'], 0, [], events_mult(1.0)))
objs.append(Obj('CHI-3', ['0.75'], mp.log(3), [], events_chi([0, 1, -1])))
objs.append(Obj('CHI5', ['0.25'], mp.log(5), [], events_chi([0, 1, -1, -1, 1])))
objs.append(Obj('DH', ['0.75'], mp.log(5), [], events_dh()))
print('DH coefficients done %.0fs' % (time.time() - t0), flush=True)
for b in ('0.125', '0.25'):
    objs.append(Obj('EA-' + b, [mp.mpf('0.25') + mp.mpf(b) / 2, mp.mpf('0.25') - mp.mpf(b) / 2], 0, [mp.mpf('0.5') + mp.mpf(b), mp.mpf('0.5') - mp.mpf(b)], events_ea(float(b))))
for q in (2, 3, 5, 7, 101):
    objs.append(Obj('TNR-q%d-c2.2' % q, ['0.25'], 2 * mp.log(q), ['0.5'], events_tnr(q, 2.2)))
objs.append(Obj('TNR-q3-c1.0', ['0.25'], 2 * mp.log(3), ['0.5'], events_tnr(3, 1.0)))
objs.append(Obj('TNR-q101-c1.0', ['0.25'], 2 * mp.log(101), ['0.5'], events_tnr(101, 1.0)))
for pol, tag in ((['0.5'], 'zpole'), ([], 'pf')):
    objs.append(Obj('SGN-LIOU/' + tag, ['0.25'], 0, pol, events_mult(-1.0)))
    for j in (0, 1):
        eps = (1 - 2 * np.random.Generator(np.random.PCG64(121000 + j)).integers(0, 2, len(PRIMES))).astype(float)
        objs.append(Obj('SGN-%02d/%s' % (j, tag), ['0.25'], 0, pol, events_mult(eps)))
    u = np.random.Generator(np.random.PCG64(120000)).random(len(PRIMES))
    objs.append(Obj('U-00/' + tag, ['0.25'], 0, pol, events_mult(np.exp(2j * np.pi * u))))
    alpha = 1.2393168126993495
    objs.append(Obj('WT/' + tag, ['0.25'], 0, pol, [(n, c * n ** (-1j * alpha)) for n, c in events_mult(1.0)]))
    for nm, kind in (('THIN-0.9', 'flip'), ('DEL-0.75', 'del'), ('DEL-0.9', 'del')):
        st = load_set(nm)
        if st is None: print('set file missing for', nm); continue
        eps = np.array([(-1.0 if kind == 'flip' else 0.0) if p in st else 1.0 for p in PRIMES.tolist()])
        objs.append(Obj('%s/%s' % (nm, tag), ['0.25'], 0, pol, events_mult(eps)))
print('objects built: %d  %.0fs' % (len(objs), time.time() - t0), flush=True)

LOGX = math.log(X)
res = {'X': X, 'objects': {}, 'zeta_eps': [], 'dps': mp.mp.dps}
cache = {}
# validation: closed form of PR 21 for zeta at a few points
zo = objs[0]
for d in (1, 2 ** KMAX, 5 * 2 ** KMAX):
    Wm = HF * d; W = float(Wm)
    aa = (mp.digamma(mp.mpf(5) / 4) - mp.log(mp.pi)) / 2
    T = mp.nsum(lambda kk: (1 - mp.exp(-(2 * kk + mp.mpf(1) / 2) * Wm)) / (2 * kk + mp.mpf(1) / 2) ** 2, [1, mp.inf])
    D = sum(mp.mangoldt(n) / mp.sqrt(n) * (Wm - mp.log(n)) for n in range(2, int(math.exp(W) + 1e-9) + 1)) - 4 * (mp.exp(Wm / 2) - 1) + 2 * Wm
    print('check Psi(%.4f): this code %s   PR21 formula %s' % (W, mp.nstr(mp.re(zo.P[d]), 25), mp.nstr(aa * Wm + T - D, 25)), flush=True)

for obj in objs:
    rec = {'levels': {}}
    for k in range(0, KMAX + 1):
        h = math.log(2) / 2 ** k
        mmax = MF // 2 ** (KMAX - k)
        q, P = qvec(obj, k, mmax, cache)
        H = toep(q, obj.cplx)
        pf = obj.name.endswith('/pf')
        LM = (lambda A: (lam_min(pf_restrict(A, k)) if A.shape[0] > 2 else 1.0)) if pf else lam_min
        lfull = LM(H)
        lv = {'h': h, 'mmax': mmax, 'support_max': mmax * h, 'lam_min_at_mmax': lfull}
        if lfull < -1e-9:
            lo, hi = 0, mmax           # H_lo >= 0 (empty), H_hi negative
            while hi - lo > 1:
                mid = (lo + hi) // 2
                if LM(H[:mid, :mid]) < -1e-9: hi = mid
                else: lo = mid
            rq = None
            if not pf:
                w, V = np.linalg.eigh(H[:hi, :hi])
                rq = mp_rayleigh(q, V[:, 0]) if hi <= 400 else None
            lv.update({'first_negative_m': hi, 'first_negative_support': hi * h, 'lam_min_there': LM(H[:hi, :hi]),
                       'rayleigh_50digit': (float(rq) if rq is not None else None)})
        else:
            for mm in (16, 64, 256, 1024):
                if mm <= mmax: lv['lam_min_m%d' % mm] = LM(H[:mm, :mm])
        rec['levels'][k] = lv
        print(obj.name, 'k=%d' % k, json.dumps(lv), '%.0fs' % (time.time() - t0), flush=True)
    res['objects'][obj.name] = rec

# zeta: eps*(support, prime) on the cell matrices
for k in (4, 6):
    h = math.log(2) / 2 ** k
    if k > KMAX: continue
    mmax = MF // 2 ** (KMAX - k)
    q, P = qvec(zo, k, mmax, cache)
    Hfull = toep(q, False)
    ms = sorted(set([mm for mm in (2 ** k * 2, 2 ** k * 4, 2 ** k * 8, 2 ** k * 12, 2 ** k * 16, 2 ** k * 20, mmax) if mm <= mmax]))
    for mm in ms:
        H = Hfull[:mm, :mm]
        row = {'k': k, 'm': mm, 'support': mm * h, 'support_over_log2': mm * h / math.log(2), 'lam_min_zeta': lam_min(H), 'eps': {}}
        for p in (2, 3, 5, 7, 101):
            if math.log(p) >= mm * h: continue
            Tp = toep(hinge_q(mp.log(p), k, mm), False)
            mu = sla.eigh(Tp, H, eigvals_only=True)
            row['eps'][p] = {'eps_plus': (1 / mu[-1] if mu[-1] > 0 else None), 'eps_minus': (-1 / mu[0] if mu[0] < 0 else None)}
        res['zeta_eps'].append(row)
        print('eps*', json.dumps(row), flush=True)
json.dump(res, open(OUT, 'w'), indent=1)
print('written', OUT, '%.0fs' % (time.time() - t0))
