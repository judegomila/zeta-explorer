"""Combination 4: character-averaged Weil form on step functions (Suzuki cell matrices), fixed support.
For an object G with coefficients c(n) of -G'/G, gamma parameter z_G (1/4 even, 3/4 odd), 2 log Q_G = lq_G, the twist by a
nonprincipal character chi mod q (q prime) has coefficients c(n) chi(n), conductor term lq_G + log q and gamma parameter of parity
par(G) + par(chi). Average over the q-2 nonprincipal characters:
   beta(n) = c(n) ((q-1)[n = 1 mod q] - 1)/(q-2)  (q not dividing n),  even chi: (q-3)/2, odd chi: (q-1)/2.
Cell matrix (mesh h, m cells, support W = m h): Toeplitz(q_d), q_d = second difference of Psi / h:
   prime part  -sum_n beta(n) n^{-1/2} hat(log n / h - d);   arch part from E_z(j) = sum_k exp(-2 (k+z) j h) / (4 (k+z)^2).
lambda_min(m) decreases with m (interlacing); 'onset' = least support with lambda_min < -TOL (bisection over m).
float64 (GPU if available); every sign reported is re-evaluated as a Rayleigh quotient in extended precision (np.longdouble).
usage: family.py X kmesh out.json mode   (mode: validate | small | big)"""
import sys, math, json, time, os
import numpy as np
from scipy.special import digamma, polygamma
X = int(float(sys.argv[1])); KM = int(sys.argv[2]); OUT = sys.argv[3]; MODE = sys.argv[4]
h = math.log(2) / 2 ** KM
TOL = 1e-8
try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=24 * 1024 ** 3)
    cp.zeros(1); GPU = True
except Exception as ex:
    cp = None; GPU = False
print('X = %g, mesh h = log2/2^%d = %.6f, GPU = %s' % (X, KM, h, GPU), flush=True)
t0 = time.time()
# ---------------- prime powers ----------------
print('planned: sieve %d bytes; prime-power arrays about %d MB' % (X + 1, int(1.3 * X / math.log(X)) * 40 // 2 ** 20), flush=True)
sv = np.ones(X + 1, dtype=bool); sv[:2] = False
for i in range(2, int(X ** 0.5) + 1):
    if sv[i]: sv[i * i::i] = False
primes = np.nonzero(sv)[0].astype(np.int64); del sv
ns = [primes]; ps = [primes]; ks = [np.ones(len(primes), dtype=np.int8)]
for p in primes[primes <= int(X ** 0.5) + 1]:
    v = p * p; k = 2
    while v <= X:
        ns.append(np.array([v])); ps.append(np.array([p])); ks.append(np.array([k], dtype=np.int8)); v *= p; k += 1
PN = np.concatenate(ns); PP = np.concatenate(ps); PK = np.concatenate(ks)
o = np.argsort(PN); PN = PN[o]; PP = PP[o]; PK = PK[o]
ELL = np.log(PN.astype(float)); BASE = np.log(PP.astype(float)) / np.sqrt(PN.astype(float))
M = int(ELL[-1] / h) + 1                       # cells: support up to M h >= log X
IDX = np.floor(ELL / h).astype(np.int64); FR = ELL / h - IDX
print('%d prime powers <= X, M = %d cells, %.0fs' % (len(PN), M, time.time() - t0), flush=True)

def bins(w, sel=None):
    """P_d = sum w(n) hat(log n / h - d), d = 0..M+1 (w real or complex)"""
    if sel is None: i, f = IDX, FR
    else: i, f, w = IDX[sel], FR[sel], w[sel]
    if np.iscomplexobj(w):
        return bins(w.real, None if sel is None else slice(None)) * 0 if False else (
            np.bincount(i, w.real * (1 - f), M + 2) + np.bincount(i + 1, w.real * f, M + 2)
            + 1j * (np.bincount(i, w.imag * (1 - f), M + 2) + np.bincount(i + 1, w.imag * f, M + 2)))
    return np.bincount(i, w * (1 - f), M + 2) + np.bincount(i + 1, w * f, M + 2)

# ---------------- coefficient objects (supported on prime powers): c(n) = log p * f(n) ----------------
rng = np.random.Generator(np.random.PCG64(120000))
SGN_P = np.where(rng.random(len(primes)) < 0.5, -1.0, 1.0)                   # random sign per prime
UNI_P = np.exp(2j * np.pi * np.random.Generator(np.random.PCG64(120001)).random(len(primes)))
PIDX = np.searchsorted(primes, PP)
def f_obj(name):
    if name == 'ZETA': return np.ones(len(PN))
    if name == 'LIOU': return np.where(PK % 2 == 0, 1.0, -1.0)
    if name == 'SGNR': return SGN_P[PIDX] ** PK
    if name == 'UNIR': return UNI_P[PIDX] ** PK
    if name.startswith('TNR'):                      # TNR-r-c: zeta(s)(1 + c r^{1/2-s} + r^{1-2s})
        _, r, c = name.split('-'); r = int(r); c = float(c)
        f = np.ones(len(PN)); sel = np.nonzero(PP == r)[0]
        s0, s1 = 2.0, -c * math.sqrt(r)
        for j in sel:                                # ascending n = r^k
            f[j] = 1 - s1
            s0, s1 = s1, (-c * math.sqrt(r)) * s1 - r * s0
        return f
    raise ValueError(name)
def lq_obj(name):                                    # 2 log Q of the object
    return 2 * math.log(int(name.split('-')[1])) if name.startswith('TNR') else 0.0

# ---------------- archimedean part ----------------
def E_z(z, m):
    """E(j) = sum_k exp(-2 (k+z) j h)/(4 (k+z)^2), j = 0..m+1"""
    K = int(45 / (2 * h)) + 10
    c = np.arange(K) + z
    out = np.empty(m + 2); out[0] = float(polygamma(1, z)) / 4
    j = np.arange(1, m + 2)
    blk = 256
    for s in range(0, len(j), blk):
        jj = j[s:s + blk]
        out[1 + s:1 + s + len(jj)] = np.sum(np.exp(-2 * np.outer(jj, c) * h) / (4 * c * c), axis=1)
    return out
_E = {}
def arch_q(m, zw, const, pole=None):
    """Toeplitz entries of the archimedean (+ conductor, + pole) part, d = 0..m-1. zw: list of (z, weight)."""
    a = np.zeros(m)
    for z, w in zw:
        if z not in _E or len(_E[z]) < m + 2: _E[z] = E_z(z, M)
        E = _E[z]
        a[0] += w * (float(digamma(z)) - math.log(math.pi) + (2 / h) * (E[0] - E[1]))
        a[1:] += -w * (E[0:m - 1] - 2 * E[1:m] + E[2:m + 1]) / h
    a[0] += const
    if pole:
        d = np.arange(m)
        pq = 2 * np.cosh(pole * d * h) * (2 * np.cosh(pole * h) - 2) / (pole ** 2 * h)
        pq[0] = 4 * (math.cosh(pole * h) - 1) / (pole ** 2 * h)
        a += pq
    return a

def toep(q, m, xp):
    q = xp.asarray(q[:m]); i = xp.arange(m)
    d = i[:, None] - i[None, :]
    T = q[xp.abs(d)]
    if xp.iscomplexobj(T): T = xp.where(d < 0, xp.conj(T), T)
    return T
def lam_min(q, m, vec=False):
    xp = cp if GPU else np
    T = toep(q, m, xp)
    if vec:
        w, V = xp.linalg.eigh(T); v = V[:, 0]
        return float(w[0]), (cp.asnumpy(v) if GPU else v)
    w = xp.linalg.eigvalsh(T)
    return float(w[0])
def rayleigh_ld(q, v):
    """Rayleigh quotient of the Toeplitz form in extended precision (direct O(m^2) sum over lags)"""
    m = len(v); v = v.astype(np.clongdouble if np.iscomplexobj(v) or np.iscomplexobj(q) else np.longdouble)
    ql = q[:m].astype(v.dtype)
    num = ql[0].real * np.sum(np.abs(v) ** 2)
    for d in range(1, m):
        num += 2 * (ql[d] * np.sum(np.conj(v[d:]) * v[:m - d])).real
    return float(num / np.sum(np.abs(v) ** 2))
def onset(q, mmax, mmin=1):
    """least m with lambda_min(leading m x m) < -TOL, by bisection (lambda_min is nonincreasing in m); None if none up to mmax"""
    lm = lam_min(q, mmax)
    if lm >= -TOL: return None, lm
    lo, hi = mmin, mmax
    if lam_min(q, lo) < -TOL: return lo, None
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if lam_min(q, mid) < -TOL: hi = mid
        else: lo = mid
    l, v = lam_min(q, hi, vec=True)
    return hi, rayleigh_ld(q, v)

res = {'X': X, 'h': h, 'M': M, 'mode': MODE}
# ---------------- validation against lane s2 (zeta with pole, L(chi_-3), L(chi_5); k = 4, m = 256 or the largest m) ----------------
B_all = bins(BASE)
def own(name_bins, zw, const, pole=None, m=None):
    m = m or M
    return arch_q(m, zw, const, pole) - name_bins[:m]
if MODE == 'validate':
    mv = min(M, 256 * 2 ** (KM - 4) if KM >= 4 else M)
    qz = own(B_all, [(0.25, 1.0)], 0.0, pole=0.5)
    chi3 = np.array([0, 1, -1])[PN % 3]; chi5 = np.array([0, 1, -1, -1, 1])[PN % 5]
    q3 = own(bins(BASE * chi3), [(0.75, 1.0)], math.log(3)); q5 = own(bins(BASE * chi5), [(0.25, 1.0)], math.log(5))
    for nm, qq in (('ZETA', qz), ('CHI-3', q3), ('CHI5', q5)):
        for m in sorted({32 * 2 ** (KM - 4), 64 * 2 ** (KM - 4), mv}):
            if m <= M:
                l, v = lam_min(qq, m, vec=True)
                print('validate %-6s k=%d m=%d support/log2 = %.2f lambda_min = %.6e  (extended Rayleigh %.6e)' % (nm, KM, m, m * h / math.log(2), l, rayleigh_ld(qq, v)), flush=True)
    # family identity at q = 5, 7: average of the member matrices equals the family matrix
    for q in (5, 7):
        g = next(g for g in range(2, q) if len({pow(g, e, q) for e in range(q - 1)}) == q - 1)
        dl = {pow(g, e, q): e for e in range(q - 1)}
        cls = np.array([dl.get(a, -1) for a in range(q)])[PN % q]
        avg = np.zeros(M, dtype=complex)
        for j in range(1, q - 1):
            chi = np.where(cls >= 0, np.exp(2j * np.pi * j * cls / (q - 1)), 0)
            z = 0.25 if j % 2 == 0 else 0.75
            avg += (arch_q(M, [(z, 1.0)], math.log(q)) - bins(BASE * chi)[:M]) / (q - 2)
        w = np.where(PN % q == 0, 0.0, ((q - 1) * (PN % q == 1) - 1.0) / (q - 2))
        fam = arch_q(M, [(0.25, (q - 3) / (2 * (q - 2))), (0.75, (q - 1) / (2 * (q - 2)))], math.log(q)) - bins(BASE * w)[:M]
        print('validate family identity q=%d: max |average of members - family| = %.2e (max |entry| %.2f)' % (q, np.max(np.abs(avg - fam)), np.max(np.abs(fam))), flush=True)
    json.dump(res, open(OUT, 'w')); sys.exit()

# ---------------- family runs ----------------
OBJ = os.environ.get('OBJS', 'ZETA,LIOU,SGNR,UNIR,TNR-2-2.2,TNR-3-2.2,TNR-3-1.0').split(',') + ['DH']
def bins_g(n_idx, n_fr, w):
    if np.iscomplexobj(w):
        return bins_g(n_idx, n_fr, w.real) + 1j * bins_g(n_idx, n_fr, w.imag)
    return np.bincount(n_idx, w * (1 - n_fr), M + 2) + np.bincount(n_idx + 1, w * n_fr, M + 2)
# object data: (n array, weights c(n) n^{-1/2}, cell index, fraction, parity (0 even / 1 odd), 2 log Q, cells available)
DATA = {}
for nm in OBJ[:-1]:
    DATA[nm] = (PN, BASE * f_obj(nm), IDX, FR, 0, lq_obj(nm), M)
# Davenport-Heilbronn: coefficients of -F'/F by the Dirichlet recursion c(n) = a(n) log n - sum_{d | n, 1 < d < n} c(d) a(n/d), n <= XD
XD = min(X, int(float(os.environ.get('XDH', '1e7'))))
KAP = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
print('DH: planned arrays %d MB' % (5 * 8 * XD // 2 ** 20), flush=True)
a5 = np.array([0.0, 1.0, KAP, -KAP, -1.0])[np.arange(XD + 1) % 5]
cd = a5 * np.log(np.maximum(np.arange(XD + 1), 1).astype(float))
for d in range(2, XD // 2 + 1):
    v = cd[d]
    if v != 0.0: cd[2 * d::d] -= v * a5[2:XD // d + 1]
nd = np.nonzero(cd)[0]; nd = nd[nd >= 2]
elld = np.log(nd.astype(float)); idd = np.floor(elld / h).astype(np.int64)
DATA['DH'] = (nd, cd[nd] / np.sqrt(nd.astype(float)), idd, elld / h - idd, 1, math.log(5), min(M, int(math.log(XD) / h)))
print('DH coefficients to %g: c(2), c(4), c(6) = %.11f %.11f %.11f; max |c(n)| n^-1/2 = %.3g; %.0fs' % (XD, cd[2], cd[4], cd[6], np.max(np.abs(DATA['DH'][1])), time.time() - t0), flush=True)
del cd, a5
BALL = {nm: bins_g(D[2], D[3], D[1]) for nm, D in DATA.items()}
def zw_family(q, par):
    we, wo = (q - 3) / (2 * (q - 2)), (q - 1) / (2 * (q - 2))          # even / odd nonprincipal characters
    return [(0.25, we), (0.75, wo)] if par == 0 else [(0.75, we), (0.25, wo)]
def family_q(nm, q):
    """Toeplitz entries of the family form of object nm at prime q"""
    n, w, idx, fr, par, lq, mlim = DATA[nm]
    r = n % q
    s1 = np.nonzero(r == 1)[0]
    b1 = bins_g(idx[s1], fr[s1], w[s1])
    sq = np.nonzero(r == 0)[0]
    bq = bins_g(idx[sq], fr[sq], w[sq]) if len(sq) else 0
    prime = ((q - 1) * b1 - (BALL[nm] - bq)) / (q - 2)
    return (arch_q(M, zw_family(q, par), math.log(q) + lq) - prime[:M])[:mlim]
def members_q(nm, q):
    """list of (j, Toeplitz entries) for the q-2 nonprincipal characters"""
    n, w, idx, fr, par, lq, mlim = DATA[nm]
    g = next(g for g in range(2, q) if len({pow(g, e, q) for e in range(q - 1)}) == q - 1)
    dl = {pow(g, e, q): e for e in range(q - 1)}
    cls = np.array([dl.get(a, -1) for a in range(q)])[n % q]
    cb = []
    for e in range(q - 1):
        s_ = np.nonzero(cls == e)[0]; cb.append(bins_g(idx[s_], fr[s_], w[s_]))
    out = []
    for j in range(1, q - 1):
        pr = sum(np.exp(2j * np.pi * j * e / (q - 1)) * cb[e] for e in range(q - 1))
        z = 0.25 if (j + par) % 2 == 0 else 0.75
        out.append((j, (arch_q(M, [(z, 1.0)], math.log(q) + lq) - pr[:M])[:mlim]))
    return out
if MODE == 'small':
    QS = [5, 7, 11, 13, 17, 29, 53, 101]
    MEMQ = [5, 7, 11, 13, 17, 29]
else:
    allp = [int(p) for p in primes[(primes >= 5) & (primes <= 10007)]]
    QS = sorted(set(allp[:int(os.environ.get('QHEAD', '40'))] + allp[40::int(os.environ.get('QSTEP', '12'))] + [10007]))
    MEMQ = [5, 7, 11, 13, 19, 29]
if os.environ.get('NOMEM') == '1': MEMQ = []
if os.environ.get('QRANGE'):
    lo_, hi_ = [int(x) for x in os.environ['QRANGE'].split(',')]
    QS = [q for q in QS if lo_ <= q < hi_]
res['rows'] = []
for q in QS:
    row = {'q': q}
    for nm in OBJ:
        qq = family_q(nm, q)
        m_on, val = onset(qq, len(qq))
        if m_on is None:
            l, v = lam_min(qq, len(qq), vec=True)
            row[nm] = {'family_onset': None, 'support': len(qq) * h, 'lam_full': l, 'lam_full_ld': rayleigh_ld(qq, v)}
        else:
            row[nm] = {'family_onset': m_on * h, 'rayleigh_ld_at_onset': val}
        if q in MEMQ:
            ons = []
            for j, qm in members_q(nm, q):
                mo, vv = onset(qm, len(qm))
                ons.append(None if mo is None else mo * h)
            fin = [x for x in ons if x is not None]
            row[nm]['member_onsets_min_max'] = [min(fin), max(fin)] if fin else None
            row[nm]['members_negative'] = len(fin); row[nm]['members'] = len(ons)
    res['rows'].append(row)
    print(q, json.dumps(row), '%.0fs' % (time.time() - t0), flush=True)
    json.dump(res, open(OUT, 'w'))
