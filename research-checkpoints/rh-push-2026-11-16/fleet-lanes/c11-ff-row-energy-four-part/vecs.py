"""vecs.py : the coefficient vectors of lane c11-ff-row-energy-four-part as functions on monic polynomials (pure python; q = 7).
uphase(name, k) -> list over the q^k monic polynomials of degree k (index order of ffx.c) of the phase e (u = zeta_6^e) or 100 (u = 0).
  one          u = 1                                                   (trivial target)
  a, b         u = chi_0(Res(F, .))^3, F = T^3 + 2 / index 8 of degree 3     (quadratic targets; mode 0 of ffx.c)
  mu           u = mu                                                  (mode 4; Liouville-twisted control)
  cm<seed>     completely multiplicative random signs = thin_sign of ffx.c with that seed (mode 6; class U of round 10)
  ru<seed>     independent random sixth roots of unity, random.Random(20261119000 + seed), degrees 1, 2, .. in this order (not multiplicative)
  al           aligned vector (mode 5): handled separately; its cube coefficients are c(n) = chi_n(m0)^3
The kernel sums over squarefree cofactors only; the cube coefficients c(n) = u(n)^3 use u at every n of degree 1, 2 (n = l^2 included)."""
import random
from ffpy import FF
q = 7; F = FF(q); M64 = (1 << 64) - 1
def hash64(x):
    x = (x + 0x9e3779b97f4a7c15) & M64; x = ((x ^ (x >> 30)) * 0xbf58476d1ce4e5b9) & M64; x = ((x ^ (x >> 27)) * 0x94d049bb133111eb) & M64; return x ^ (x >> 31)
_fs = {}
def factor_sieve(K):
    """sd[k][i] = degree of the smallest prime factor of the i-th monic polynomial of degree k (= k for primes), si = its index, co = index of the cofactor."""
    if K in _fs: return _fs[K]
    sd = {k: [-1]*q**k for k in range(1, K+1)}; si = {k: [0]*q**k for k in range(1, K+1)}; co = {k: [0]*q**k for k in range(1, K+1)}
    for e in range(1, K+1):
        for i in range(q**e):
            if sd[e][i] >= 0: continue
            sd[e][i] = e; si[e][i] = i; P = F.idx2poly(i, e)
            for f in range(1, K - e + 1):
                tgt = sd[e+f]
                for bi in range(q**f):
                    pr = F.pmul(P, F.idx2poly(bi, f)); idx = 0
                    for a in range(e + f - 1, -1, -1): idx = idx*q + pr[a]
                    if tgt[idx] < 0: tgt[idx] = e; si[e+f][idx] = i; co[e+f][idx] = bi
    _fs[K] = (sd, si, co); return _fs[K]
_dl = {}
def disc_log(k):
    if k not in _dl:
        o = []
        for i in range(q**k):
            if k == 0: o.append(0); continue
            c = F.idx2poly(i, k); dc = [(j % q)*c[j] % q for j in range(1, k + 1)]; D = F.res(c, dc); o.append(F.L6[D] if D else -1)
        _dl[k] = o
    return _dl[k]
TARGETS = {'a': (3, 2), 'b': (3, 8)}
_u = {}
def uphase(name, k, K=None):
    key = (name, k)
    if key in _u: return _u[key]
    n = q**k
    if name == 'one': u = [0]*n
    elif name in TARGETS:
        f, i = TARGETS[name]; Fp = F.idx2poly(i, f); u = []
        for j in range(n):
            R = F.res(Fp, F.idx2poly(j, k)); u.append((3*F.L6[R]) % 6 if R else 100)
    elif name == 'mu':
        l = disc_log(k); sg = F.LM1 if (k*(k - 1)//2) & 1 else 0; u = [((3*k + 3*(x + sg)) % 6 if x >= 0 else 100) for x in l]
    elif name.startswith('cm'):
        seed = int(name[2:])
        if k == 0: u = [0]
        else:
            sd, si, co = factor_sieve(max(k, K or k)); u = []
            for j in range(n):
                e = sd[k][j]
                if e == k: u.append(3 if (hash64((j*1000003 + k*7919 + seed) & M64) >> 20) & 1 else 0)
                else: u.append((uphase(name, e, K)[si[k][j]] + uphase(name, k - e, K)[co[k][j]]) % 6)
    elif name.startswith('ru'):
        rnd = random.Random(20261119000 + int(name[2:])); allk = {0: [0]}
        for kk in range(1, 7): allk[kk] = [rnd.randrange(6) for _ in range(q**kk)]
        for kk in allk: _u[(name, kk)] = allk[kk]
        return _u[key]
    else: raise KeyError(name)
    _u[key] = u; return u
