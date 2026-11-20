#!/usr/bin/env python3
"""ms5.py -- order 5 over Q(zeta_5): mean square of Moebius sums twisted by quintic residue symbols, rows ~ length.

By Theorem B of RESULT.md the absorbed dual of the order-5 Moebius rows (order-10 Gauss sums, index h^6) has the same
mean square as this family up to the Poisson factor, so this is the generator-free test of the order-5 mean square.

Columns a: squarefree ideals of Z[zeta_5] all of whose prime factors have degree 1 (p = 1 mod 5; ideal (p, zeta - r),
r a primitive 5th root of unity mod p), N(a) <= XMAX; weight w(N a/Z), w(x) = x exp(-x^2).
Rows m: elements m0 + m1 z + m2 z^2 + m3 z^3 with |m_j| <= BOX (random sample), binned by |N(m)|.
chi_a(m) = prod_{P | a} (m/P)_5,  (m/P)_5 = zeta^k  with  m(r)^((p-1)/5) = r^k mod p.
Variants: MU c = mu(a);  L c = 1;  RND random unit phases.
usage: ms5.py ZMAX [NROWS] [BOX]
"""
import sys, math, time
import numpy as np
ZMAX = int(float(sys.argv[1])); NROWS = int(sys.argv[2]) if len(sys.argv) > 2 else 20000; BOX = int(sys.argv[3]) if len(sys.argv) > 3 else 16
XMAX = int(3.5 * ZMAX); ZERO = 64

def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** .5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0].tolist()

t0 = time.time()
ideals = []                                   # (p, r)
for p in primes_upto(XMAX):
    if p % 5 != 1: continue
    g = next(pow(x, (p - 1) // 5, p) for x in range(2, p) if pow(x, (p - 1) // 5, p) != 1)
    for j in range(1, 5): ideals.append((p, pow(g, j, p)))
ideals.sort()
norms = []; MU = []; FAC = []
stack = [(-1, 1, 1, ())]
while stack:
    last, N, mu, fac = stack.pop()
    norms.append(N); MU.append(mu); FAC.append(fac)
    for idx in range(last + 1, len(ideals)):
        if N * ideals[idx][0] > XMAX: break
        stack.append((idx, N * ideals[idx][0], -mu, fac + (idx,)))
norms = np.array(norms, dtype=np.float64); MU = np.array(MU, dtype=np.float64); ncol = len(norms)
print('degree-1 prime ideals with norm <= %d: %d; squarefree columns: %d (%.0fs)' % (XMAX, len(ideals), ncol, time.time() - t0), flush=True)

rng = np.random.default_rng(2026)
m = rng.integers(-BOX, BOX + 1, size=(NROWS * 3, 4))
z = np.exp(2j * np.pi * np.arange(1, 5) / 5)
emb = m[:, 0, None] + m[:, 1, None] * z[None, :] + m[:, 2, None] * z[None, :] ** 2 + m[:, 3, None] * z[None, :] ** 3
nm = np.rint(np.abs(np.prod(emb, axis=1))).astype(np.int64)
keep = (nm > 1) & (nm % 5 != 0)
m = np.unique(m[keep], axis=0)[:]; rng.shuffle(m); m = m[:NROWS]
emb = m[:, 0, None] + m[:, 1, None] * z[None, :] + m[:, 2, None] * z[None, :] ** 2 + m[:, 3, None] * z[None, :] ** 3
rnorm = np.rint(np.abs(np.prod(emb, axis=1))); nrow = len(m)
print('rows: %d elements in the box |m_j| <= %d, norms %d .. %d (median %d)' % (nrow, BOX, rnorm.min(), rnorm.max(), np.median(rnorm)), flush=True)

m64 = m.astype(np.int64)
TAB = np.empty((len(ideals), nrow), dtype=np.int8)
for i, (p, r) in enumerate(ideals):
    t = (m64[:, 0] + m64[:, 1] * r + m64[:, 2] * (r * r % p) + m64[:, 3] * (r * r % p * r % p)) % p
    e = (p - 1) // 5; res = np.ones_like(t); base = t.copy()
    while e:
        if e & 1: res = res * base % p
        base = base * base % p; e >>= 1
    out = np.zeros(nrow, dtype=np.int8); rk = 1
    for k in range(5):
        out[res == rk] = k; rk = rk * r % p
    out[t == 0] = ZERO
    TAB[i] = out
print('symbol table %s (%.0fs)' % (TAB.shape, time.time() - t0), flush=True)

Z5 = np.concatenate([np.exp(2j * np.pi * np.arange(5) / 5), [0]]).astype(np.complex64)
Zs = [ZMAX / 16, ZMAX / 4, ZMAX]
W = np.array([(norms / Z) * np.exp(-(norms / Z) ** 2) for Z in Zs])
rnd = np.exp(2j * np.pi * rng.random(ncol))
names = ['MU', 'L', 'RND']; base = [MU.astype(complex), np.ones(ncol, complex), rnd]
C = np.array([[b * w for w in W] for b in base]).astype(np.complex64)
B = np.zeros((3, len(Zs), nrow), dtype=np.complex128)
CH = 128
for lo in range(0, ncol, CH):
    hi = min(lo + CH, ncol)
    E = np.zeros((hi - lo, nrow), dtype=np.int16)
    for k in range(lo, hi):
        for f in FAC[k]: E[k - lo] += TAB[f]
    E = np.where(E >= ZERO, 5, E % 5)
    B += np.tensordot(C[:, :, lo:hi], Z5[E], axes=([2], [0]))
den = (W ** 2).sum(axis=1)
print('done (%.0fs)' % (time.time() - t0))
edges = [1.5]
while edges[-1] < rnorm.max(): edges.append(edges[-1] * 4)
for zi, Z in enumerate(Zs):
    print('\nZ = %.0f (sum w^2 = %.1f).  R = mean_m |B_m|^2 / sum w^2 per bin of |N(m)|; s.e. = R/sqrt(rows)' % (Z, den[zi]))
    print('  %-24s %6s  ' % ('|N(m)| bin', 'rows') + ' '.join('%8s' % n for n in names))
    for lo, hi in zip(edges[:-1], edges[1:]):
        sel = (rnorm > lo) & (rnorm <= hi)
        if sel.sum() < 5: continue
        print('  (%10.0f,%10.0f] %6d  ' % (lo, hi, sel.sum()) + ' '.join('%8.3f' % ((np.abs(B[v, zi, sel]) ** 2).mean() / den[zi]) for v in range(3)))
