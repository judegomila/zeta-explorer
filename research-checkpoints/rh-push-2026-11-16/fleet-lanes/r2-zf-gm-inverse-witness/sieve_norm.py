#!/usr/bin/env python3
"""sieve_norm.py -- operator norm of the sextic / cubic / quadratic residue-symbol matrix over Z[omega]
with squarefree primary indices prime to 6, and its overlap with Gauss-sum vectors.

Matrix: B[n, k] = (k/n)_6^{mult}  (0 if gcd(n,k) != 1), n, k primary (== 1 mod 3) generators of squarefree ideals
prime to 6, N(k) <= K (rows), N(n) <= D = K^r (columns).  Quantity: lam = sup_c sum_k |sum_n c_n B[n,k]|^2 / |c|^2.
Compared against: K-type mean value (#rows), random-matrix baseline, (KD)^{2/3}, K^{5/6} D^{1/3}.
Usage: sieve_norm.py XMAX DMAX out.json
"""
import sys, json, time
import numpy as np
from scipy.sparse.linalg import LinearOperator, eigsh

XMAX = int(sys.argv[1]); DMAX = int(sys.argv[2]); OUT = sys.argv[3]
ZETA = np.exp(-1j * np.pi / 3)          # -omega
t0 = time.time()
def log(*a):
    print(f"[{time.time()-t0:8.1f}s]", *a, flush=True)

def vpow(base, e, p):
    base = base % p
    res = np.ones_like(base)
    while e:
        if e & 1:
            res = res * base % p
        base = base * base % p
        e >>= 1
    return res

def pairmul(x, y, q):
    a, b = x; c, d = y
    bd = b * d
    return ((a * c - bd) % q, (a * d + b * c - bd) % q)

def pairpow(x, e, q):
    res = (np.ones_like(x[0]), np.zeros_like(x[0]))
    base = (x[0] % q, x[1] % q)
    while e:
        if e & 1:
            res = pairmul(res, base, q)
        base = pairmul(base, base, q)
        e >>= 1
    return res

# ---------- enumerate primary elements prime to 6
R = int((4 * XMAX / 3) ** 0.5) + 2
av = np.arange(-R, R + 1, dtype=np.int64); av = av[(av % 3) == 1]
bv = np.arange(-R, R + 1, dtype=np.int64); bv = bv[(bv % 3) == 0]
A, Bm = np.meshgrid(av, bv, indexing='ij')
A = A.ravel(); Bm = Bm.ravel()
N = A * A - A * Bm + Bm * Bm
m = (N <= XMAX) & (N % 2 == 1)
A, Bm, N = A[m], Bm[m], N[m]
o = np.argsort(N, kind='stable'); A, Bm, N = A[o], Bm[o], N[o]
log("elements prime to 6:", len(N))

# ---------- primes
sv = np.ones(XMAX + 1, dtype=bool); sv[:2] = False
for i in range(2, int(XMAX ** 0.5) + 1):
    if sv[i]: sv[i * i::i] = False
primes = np.nonzero(sv)[0]
pideals = []   # (norm, kind, p, w)
for p in primes:
    p = int(p)
    if p in (2, 3): continue
    if p % 3 == 1:
        h = 2
        while True:
            w = pow(h, (p - 1) // 3, p)
            if w != 1: break
            h += 1
        pideals.append((p, 's', p, w)); pideals.append((p, 's', p, w * w % p))
    elif p * p <= XMAX:
        pideals.append((p * p, 'i', p, 0))
pideals.sort()
log("prime ideals:", len(pideals))

def divmask(pi, a, b):
    nm, kind, p, w = pi
    if kind == 's': return ((a + b * w) % p) == 0
    return ((a % p) == 0) & ((b % p) == 0)

prod = np.ones_like(N)
for pi in pideals:
    mk = divmask(pi, A, Bm)
    prod[mk] *= pi[0]
sf = prod == N
A, Bm, N = A[sf], Bm[sf], N[sf]
NR = len(N)
NCMAX = int(np.searchsorted(N, DMAX, side='right'))
log("squarefree elements:", NR, "columns up to DMAX:", NCMAX)
cls = ((A % 36) * 36 + (Bm % 36)).astype(np.int64)
row_of = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(A[:NCMAX], Bm[:NCMAX]))}

# ---------- symbols for column primes
colp = [pi for pi in pideals if pi[0] <= DMAX]
NP = len(colp)
ET = np.zeros((NCMAX, NR), dtype=np.uint16)       # exponent sums, >=100 flags a zero
gen_row = np.zeros(NP, dtype=np.int64)
gauss = {6: np.zeros(NP, complex), 3: np.zeros(NP, complex), 2: np.zeros(NP, complex)}
EPgen = np.zeros((NP, NP), dtype=np.uint8)        # EPgen[j, i] = exponent of (nu_i / pi_j)
evecs_at_cols = []                                # e_pi restricted to columns (for EPgen)
collists = []
An, Bn = A[:NCMAX], Bm[:NCMAX]
PAIRS6 = [(1, 0), (0, -1), (-1, -1), (-1, 0), (0, 1), (1, 1)]
for j, pi in enumerate(colp):
    nm, kind, p, w = pi
    e = np.full(NR, 100, dtype=np.uint16)
    if kind == 's':
        t = (A + Bm * w) % p
        z = vpow(t, (p - 1) // 6, p)
        lut = np.full(p, 100, dtype=np.uint16)
        for jj in range(6): lut[pow((-w) % p, jj, p)] = jj
        lut[0] = 100
        e = lut[z]; e[t == 0] = 100
        # generator and Gauss sum
        cand = np.nonzero((N[:NCMAX] == p))[0]
        g = [c for c in cand if (An[c] + Bn[c] * w) % p == 0]
        assert len(g) == 1, (pi, cand)
        gen_row[j] = g[0]
        bgen = int(Bn[g[0]])
        x = np.arange(1, p, dtype=np.int64)
        jx = lut[vpow(x, (p - 1) // 6, p)].astype(np.int64)
        ph = np.exp(-2j * np.pi * ((bgen * x) % p) / p)
        for od, mult in ((6, 1), (3, 2), (2, 3)):
            gauss[od][j] = np.sum(ZETA ** (mult * jx % 6) * ph)
    else:
        q = p
        zz = pairpow((A.copy(), Bm.copy()), (q * q - 1) // 6, q)
        zero = ((A % q) == 0) & ((Bm % q) == 0)
        for jj, (c, d) in enumerate(PAIRS6):
            e[(zz[0] == c % q) & (zz[1] == d % q)] = jj
        e[zero] = 100
        gen_row[j] = row_of[(-q, 0)] if (-q) % 3 == 1 else row_of[(q, 0)]
        assert (-q) % 3 == 1
        c, d = np.meshgrid(np.arange(q, dtype=np.int64), np.arange(q, dtype=np.int64), indexing='ij')
        c = c.ravel(); d = d.ravel(); keep = (c != 0) | (d != 0); c = c[keep]; d = d[keep]
        zz = pairpow((c, d), (q * q - 1) // 6, q)
        jx = np.full(len(c), -1, dtype=np.int64)
        for jj, (cc, dd) in enumerate(PAIRS6):
            jx[(zz[0] == cc % q) & (zz[1] == dd % q)] = jj
        assert (jx >= 0).all()
        ph = np.exp(-2j * np.pi * d / q)
        for od, mult in ((6, 1), (3, 2), (2, 3)):
            gauss[od][j] = np.sum(ZETA ** (mult * jx % 6) * ph)
    cols = np.nonzero(divmask(pi, An, Bn))[0]
    collists.append(cols)
    ET[cols, :] += e[None, :]
    evecs_at_cols.append(e[:NCMAX].astype(np.uint8))
    if j % 1000 == 0: log("prime", j, "/", NP)
for j in range(NP):
    EPgen[j, :] = evecs_at_cols[j][gen_row]
del evecs_at_cols
log("symbols done; |g|^2/N check:", float(np.max(np.abs(np.abs(gauss[6]) ** 2 / np.array([pi[0] for pi in colp]) - 1))))

# ---------- Gauss sums of composite columns by twisted multiplicativity
facs = [[] for _ in range(NCMAX)]
for j, cols in enumerate(collists):
    for c in cols: facs[c].append(j)
gt = {od: np.ones(NCMAX, complex) for od in (6, 3, 2)}
for c in range(NCMAX):
    f = facs[c]
    for od, mult in ((6, 1), (3, 2), (2, 3)):
        v = 1.0 + 0j
        for j in f: v *= gauss[od][j]
        ex = 0
        for ii in range(len(f)):
            for jj in range(ii + 1, len(f)):
                ex += int(EPgen[f[jj], f[ii]]) + int(EPgen[f[ii], f[jj]])
        gt[od][c] = v * ZETA ** ((mult * ex) % 6) / np.sqrt(N[c])
log("composite Gauss sums done; max ||g~|-1| =", float(np.max(np.abs(np.abs(gt[6]) - 1))))

# brute-force check of twisted multiplicativity on a few small composite columns
def brute(c, mult):
    a, b, n = int(An[c]), int(Bn[c]), int(N[c])
    cc, dd = np.meshgrid(np.arange(n, dtype=np.int64), np.arange(n, dtype=np.int64), indexing='ij')
    cc = cc.ravel(); dd = dd.ravel()
    ex = np.zeros(len(cc), dtype=np.int64); zero = np.zeros(len(cc), dtype=bool)
    for j in facs[c]:
        nm, kind, p, w = colp[j]
        if kind == 's':
            t = (cc + dd * w) % p; z = vpow(t, (p - 1) // 6, p)
            lut = np.full(p, 0, dtype=np.int64)
            for jj in range(6): lut[pow((-w) % p, jj, p)] = jj
            ex += lut[z]; zero |= (t == 0)
        else:
            zz = pairpow((cc.copy(), dd.copy()), (p * p - 1) // 6, p)
            for jj, (c2, d2) in enumerate(PAIRS6):
                ex[(zz[0] == c2 % p) & (zz[1] == d2 % p)] += jj
            zero |= ((cc % p) == 0) & ((dd % p) == 0)
    # y = x * conj(nu), conj(nu) = (a-b) - b w ; y1 = c*(-b) + d*(a-b) - d*(-b)*... compute directly
    ca, cb = a - b, -b
    y1 = (cc * cb + dd * ca - dd * cb) % n
    val = np.where(zero, 0, ZETA ** ((mult * ex) % 6)) * np.exp(2j * np.pi * y1 / n)
    return val.sum() / n / np.sqrt(n)
chk = []
for c in range(NCMAX):
    if len(facs[c]) >= 2 and N[c] <= 700:
        chk.append(max(abs(brute(c, mult) - gt[od][c]) for od, mult in ((6, 1), (3, 2))))
    if len(chk) >= 12: break
log("brute-force Gauss check (12 composite n), max err:", max(chk) if chk else None)

LUTS = {}
for od, mult in ((6, 1), (3, 2), (2, 3)):
    l = np.zeros(65536, dtype=np.complex64)
    v = np.arange(100)
    l[:100] = ZETA ** ((mult * v) % 6)
    LUTS[od] = l

def analyse(K, r, od):
    D = K ** r
    nr = int(np.searchsorted(N, K, side='right')); nc = int(np.searchsorted(N, D, side='right'))
    B = LUTS[od][ET[:nc, :nr]]                    # nc x nr
    def mv(c):
        c = c.astype(np.complex64)
        y = B.T @ c
        return np.conj(B) @ y
    op = LinearOperator((nc, nc), matvec=mv, dtype=np.complex64)
    k = min(3, nc - 2)
    vals, vecs = eigsh(op, k=k, which='LA', tol=1e-5)
    idx = np.argsort(vals)[::-1]; vals = vals[idx]; vecs = vecs[:, idx]
    v1 = vecs[:, 0]
    res = dict(K=K, r=r, order=od, D=D, nrows=nr, ncols=nc, lam=[float(x) for x in vals],
               rand=float((nr ** 0.5 + nc ** 0.5) ** 2))
    cl = cls[:nc]; ucl = np.unique(cl)
    fams = {'conj_g%d' % od: np.conj(gt[od][:nc]), 'g%d' % od: gt[od][:nc], 'one': np.ones(nc, complex)}
    if od == 6:
        fams['conj_g3'] = np.conj(gt[3][:nc]); fams['g3'] = gt[3][:nc]
    for name, f in fams.items():
        f = f.astype(np.complex64)
        y = B.T @ f
        res['rq_' + name] = float(np.vdot(y, y).real / np.vdot(f, f).real)
        # class-restricted span
        F = np.zeros((nc, len(ucl)), dtype=np.complex64)
        for i, u in enumerate(ucl):
            mk = cl == u
            if mk.sum() == 0: continue
            F[mk, i] = f[mk] / np.sqrt(mk.sum())
        Y = B.T @ F
        G = Y.conj().T @ Y
        ev = np.linalg.eigvalsh(G)
        res['rqspan_' + name] = float(ev[-1])
        pr = F.conj().T @ v1
        res['proj_' + name] = float(np.sqrt(np.vdot(pr, pr).real))
    res['nclasses'] = int(len(ucl))
    del B
    return res

results = []
Ks = [int(x) for x in sys.argv[4].split(',')]
rs = [float(x) for x in sys.argv[5].split(',')]
for K in Ks:
    for r in rs:
        if K ** r > DMAX + 1e-9 or K > XMAX: continue
        for od in (6, 3, 2):
            res = analyse(K, r, od)
            results.append(res)
            log(json.dumps(res))
            json.dump(results, open(OUT, 'w'), indent=1)
log("done")
