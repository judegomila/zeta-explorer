#!/usr/bin/env python3
"""E2: the K-loss question (L*) over F_q[T], in exact arithmetic.

Function-field model of the mark Gram matrix of E1 (q = 1 mod 6 prime, monic polynomials, chi_c the sextic residue
symbol chi_c(m) = chi0(Res(c, m)), chi0 the sextic character of F_q^* with chi0(g0) = zeta_6, g0 the least primitive
root; additive character e(y/c) = exp(2 pi i t/q), t = coefficient of T^(deg c - 1) of y mod c):
  rows     all monic m of degree n                                                           (R = q^n rows, complete sum)
  columns  c = p c', c' squarefree monic of degree b, (p, c') = 1                             (Cn = q^b - q^(b-1))
  marks    all monic primes p of degree a                                                    (N = number of marks)
  x_p(m) = sum_{c'} gamma_2(p c') chi_{p c'}(m)^k,  gamma_2 = normalised cubic Gauss sum (character chi_c^2)
  variants A: k = 1 (quadratic twist present; the manuscript row without the angular factor),
           Asf: A with the rows restricted to squarefree m (diagnostic),
           Ap: A with the coefficient multiplied by conj lambda(c), lambda(c) = e_q(c_1) for c = T^D + c_1 T^(D-1) + ...
               (Hecke character at infinity; function-field counterpart of the angular factor conj alpha(c) = conj(c/|c|)),
           K: k = 4 (Kubota row, theta pole: positive control), R<s>: gamma_2 replaced by an independent random sixth
           root of unity per column (generic control, seed s).
  A, Asf, K, R<s> are exact (Z[omega]); Ap has values in Z[zeta_3q] and is computed in complex128 (not exact).
Dictionary with E1: Z = q^b, l = a/b, M = n/b, K-loss factor Z^(M+l-1) = q^(n+a-b).
Exactness. gamma_2(c) = (-u)^(deg c) mu(c) zeta_6^(g(c)), u = G_1(chi0^2)/sqrt q (Hasse-Davenport for the prime factors,
twisted multiplicativity and cubic reciprocity for the cross terms; checked against brute-force Gauss sums in
e2_test.py). All columns have the same degree, so the constant drops out of G/tr G and G has entries in Z[omega]:
it is computed in integer arithmetic (integer matrices stored in floating point with every partial sum below 2^24
(float32) or 2^53 (float64), so every product is exact; accumulators are int64) and stored as integer pairs.
The exact identity of n3-ff-cubic-sieve-rational-deflation (Lemma A, sextic form) is verified on the column Gram
H[c, c'] = sum_m chi_c(m) conj chi_c'(m) by e2_test.py (brute-force symbols and Gauss sums).
Statistics (float64, from the exact G): SDP(G)/tr G with primal-dual certificate, n lambda_max/tr, lambda_max of
the unit-diagonal Gram, Gershgorin sum/tr, pair maximum.  Checkpoint per size; results appended to results.jsonl.
"""
import os, sys, math, time, json, argparse, random
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "common")); sys.path.insert(0, HERE)
import kstats

cp = None
if os.environ.get("E_NOGPU", "0") != "1":
    try:
        import cupy as cp
        cp.cuda.Device(0).use()
        cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get("E_GPU_GB", "14")) * 1024 ** 3))
    except Exception as ex:
        print(f"cupy unavailable ({type(ex).__name__}: {ex}); numpy path", flush=True); cp = None
xp = cp if cp is not None else np
T0 = time.time()
BAD = 64
OMEGA = np.exp(2j * math.pi / 3)
ZETA6 = np.exp(1j * math.pi / 3)
# zeta_6^j = u + v omega
LU = np.array([1, 1, 0, -1, -1, 0, 0], dtype=np.float32); LV = np.array([0, 1, 1, 0, -1, -1, 0], dtype=np.float32)
RA = np.array([1, 1, 0, -1, -1, 0, 0], dtype=np.float64); RB = np.array([0, -1, -1, 0, 1, 1, 0], dtype=np.float64)
RC = np.array([0, 1, 1, 0, -1, -1, 0], dtype=np.float64); RD = np.array([1, 0, -1, -1, 0, 1, 0], dtype=np.float64)


if cp is not None:
    KERN_B = cp.ElementwiseKernel(
        "raw int8 Tm, raw int64 fac, int32 D, int32 nR, int32 k", "float32 bu, float32 bv",
        """long long c = i / nR; long long m = i - c * nR; int e = 0;
           for (int d = 0; d < D; d++) e += Tm[fac[c * D + d] * (long long)nR + m];
           if (e >= 64) { bu = 0; bv = 0; } else { e = (k * e) % 6; bu = LUc[e]; bv = LVc[e]; }""", "b_fused",
        preamble="static const float LUc[6] = {1, 1, 0, -1, -1, 0}; static const float LVc[6] = {0, 1, 1, 0, -1, -1};")


if cp is not None:
    KERN_SYM = cp.ElementwiseKernel(
        "raw uint8 A, raw uint8 TH, raw int8 L6, int32 nR, int32 D1, int32 d, int32 q", "int8 out",
        """long long pi = i / nR; long long m = i - pi * nR; long long idx = 0, qp = 1;
           for (int j = 0; j < d; j++) {
               int c = 0;
               for (int t = 0; t < D1; t++) c += (int)A[m * D1 + t] * (int)TH[(pi * D1 + t) * d + j];
               idx += (long long)(c % q) * qp; qp *= q;
           }
           out = L6[idx];""", "sym_fused")


def P(*a):
    print(f"[{time.time() - T0:8.0f}s]", *a, flush=True)


PROF = {}
_pt = [time.time()]


def tick(name):
    """profiling (E_PROF=1): accumulate device-synchronised wall time per section."""
    if os.environ.get("E_PROF", "0") != "1":
        return
    if cp is not None:
        cp.cuda.Stream.null.synchronize()
    t = time.time(); PROF[name] = PROF.get(name, 0.0) + t - _pt[0]; _pt[0] = t


def tonp(a):
    return cp.asnumpy(a) if (cp is not None and isinstance(a, cp.ndarray)) else np.asarray(a)

# ------------------------------------------------------------------------- single polynomials (lists, low -> high)


def ptrim(a):
    while a and a[-1] == 0:
        a.pop()
    return a


def pmul(a, b, q):
    if not a or not b:
        return []
    r = [0] * (len(a) + len(b) - 1)
    for i, x in enumerate(a):
        if x:
            for j, y in enumerate(b):
                r[i + j] = (r[i + j] + x * y) % q
    return ptrim(r)


def pmod(a, f, q):
    a = a[:]; d = len(f) - 1; inv = pow(f[-1], q - 2, q)
    while len(a) - 1 >= d and a:
        c = a[-1] * inv % q; s = len(a) - 1 - d
        if c:
            for i in range(d + 1):
                a[s + i] = (a[s + i] - c * f[i]) % q
        a.pop(); ptrim(a)
    return a


def pgcd(a, b, q):
    a, b = ptrim(a[:]), ptrim(b[:])
    while b:
        a, b = b, pmod(a, b, q)
    return a


def ppow(a, e, f, q):
    r = [1]; a = pmod(a, f, q)
    while e:
        if e & 1:
            r = pmod(pmul(r, a, q), f, q)
        a = pmod(pmul(a, a, q), f, q); e >>= 1
    return r


def psub(a, b, q):
    n = max(len(a), len(b)); r = [((a[i] if i < len(a) else 0) - (b[i] if i < len(b) else 0)) % q for i in range(n)]
    return ptrim(r)


def prime_factors(n):
    out = []; p = 2
    while p * p <= n:
        if n % p == 0:
            out.append(p)
            while n % p == 0:
                n //= p
        p += 1
    if n > 1:
        out.append(n)
    return out


def is_irreducible(f, q):
    d = len(f) - 1
    if ppow([0, 1], q ** d, f, q) != [0, 1]:
        return False
    for l in prime_factors(d):
        h = psub(ppow([0, 1], q ** (d // l), f, q), [0, 1], q)
        if len(pgcd(f, h, q)) != 1:
            return False
    return True


def primitive_root(q):
    for g in range(2, q):
        if all(pow(g, (q - 1) // l, q) != 1 for l in prime_factors(q - 1)):
            return g
    raise ValueError

# ------------------------------------------------------------------------- finite fields F_{q^d}


class Field:
    """F_{q^d} = F_q[x]/f with a primitive element g. PW[k] = coordinates of g^k (uint8), LOG[index] = k (-1 for 0),
    L6[index] = log_{g0}(Norm(element)) mod 6 (BAD for 0). index = sum_i coord_i q^i."""

    def __init__(self, q, d, g0, seed=1):
        self.q, self.d = q, d; self.size = q ** d; self.ord = self.size - 1
        self.qpow = (q ** np.arange(d)).astype(np.int64)
        rnd = random.Random(1000 * q + d + seed)
        if d == 1:
            self.f = [0, 1]; g = [g0]
        else:
            while True:
                f = [rnd.randrange(q) for _ in range(d)] + [1]
                if f[0] and is_irreducible(f, q):
                    break
            self.f = f
            pf = prime_factors(self.ord)
            while True:
                g = ptrim([rnd.randrange(q) for _ in range(d)])
                if g and all(ppow(g, self.ord // l, f, q) != [1] for l in pf):
                    break
        self.g = g
        pw = np.zeros((self.ord, d), dtype=np.uint8); pw[0, 0] = 1
        have = 1; c = g[:]
        while have < self.ord:
            M = np.zeros((d, d), dtype=np.float32)
            for i in range(d):
                e = pmod(pmul([0] * i + [1], c, q), self.f, q) if d > 1 else [c[0] % q]
                M[i, :len(e)] = e
            take = min(have, self.ord - have)
            for s in range(0, take, 1 << 20):
                e_ = min(take, s + (1 << 20))
                pw[have + s:have + e_] = np.rint(np.mod(pw[s:e_].astype(np.float32) @ M, q)).astype(np.uint8)
            have += take
            c = pmod(pmul(c, c, q), self.f, q) if d > 1 else [c[0] * c[0] % q]
        self.PW = pw
        idx = np.zeros(self.ord, dtype=np.int64)
        for i in range(d):
            idx += pw[:, i].astype(np.int64) * int(self.qpow[i])
        assert len(np.unique(idx)) == self.ord and idx.min() >= 1, "g is not primitive"
        self.LOG = np.full(self.size, -1, dtype=np.int32); self.LOG[idx] = np.arange(self.ord, dtype=np.int32)
        ng = pw[(self.ord // (q - 1)) % self.ord]                        # Norm(g) = g^((q^d-1)/(q-1)) in F_q
        assert (ng[1:] == 0).all() and ng[0] != 0
        lam = next(k for k in range(q - 1) if pow(g0, k, q) == int(ng[0]))
        self.lam = lam
        L6 = np.full(self.size, BAD, dtype=np.int8)
        L6[idx] = ((np.arange(self.ord, dtype=np.int64) * lam) % 6).astype(np.int8)
        self.L6 = L6
        self._dev = None

    def dev_L6(self):
        if self._dev is None:
            self._dev = xp.asarray(self.L6)
        return self._dev

    def prime_exponents(self):
        """one exponent k per monic prime of degree d: least element of each Frobenius orbit of full length."""
        q, d, o = self.q, self.d, self.ord
        if d == 1:
            return None
        out = []
        for s in range(0, o, 1 << 22):
            k = np.arange(s, min(o, s + (1 << 22)), dtype=np.int64)
            kk = k.copy(); ok = np.ones(len(k), dtype=bool)
            for i in range(1, d):
                kk = kk * q % o
                ok &= kk > k
            out.append(k[ok])
        return np.concatenate(out)


class Model:
    """primes of degree <= b over F_q with roots in the canonical fields, minimal polynomials, Gauss-sum exponents."""

    def __init__(self, q, b):
        assert q % 6 == 1 and all(q % p for p in range(2, int(q ** 0.5) + 1)), "q must be a prime = 1 mod 6"
        self.q, self.b = q, b
        self.g0 = primitive_root(q)
        self.dlog = np.zeros(q, dtype=np.int64)
        for k in range(q - 1):
            self.dlog[pow(self.g0, k, q)] = k
        self.F = {d: Field(q, d, self.g0) for d in range(1, b + 1)}
        deg, kv, coef = [], [], []
        for d in range(1, b + 1):
            F = self.F[d]
            if d == 1:
                K = np.arange(q, dtype=np.int64)                          # root value c of T - c
                C = np.zeros((q, b + 1), dtype=np.uint8); C[:, 0] = (-K) % q; C[:, 1] = 1
            else:
                K = F.prime_exponents()
                assert len(K) == self.count_primes(d), (len(K), self.count_primes(d))
                C = np.zeros((len(K), b + 1), dtype=np.uint8)
                for s in range(0, len(K), 200000):
                    C[s:s + 200000, :d + 1] = self.minpoly(F, K[s:s + 200000])
            deg.append(np.full(len(K), d, dtype=np.int64)); kv.append(K); coef.append(C)
        self.pdeg = np.concatenate(deg); self.pk = np.concatenate(kv); self.pcoef = np.concatenate(coef)
        self.np_ = len(self.pdeg)
        self.off = np.searchsorted(self.pdeg, np.arange(1, b + 3), "left")   # off[d-1] = first prime of degree d
        # exponent of the prime Gauss sum: gamma_2(pi) = (-u)^d * (-1) * zeta_6^(2 log chi0(Res(pi, pi')))
        der = np.zeros_like(self.pcoef)
        for t in range(1, b + 1):
            der[:, t - 1] = (t * self.pcoef[:, t].astype(np.int64)) % q
        j = self.sym_elem(np.arange(self.np_), der)
        assert (j < BAD).all()
        self.sP = ((2 * j.astype(np.int64) + 3) % 6).astype(np.int8)        # includes the sign mu = -1

    def count_primes(self, d):
        q = self.q
        mu = lambda n: 0 if any(n % (p * p) == 0 for p in prime_factors(n)) else (-1) ** len(prime_factors(n))
        return sum(mu(d // e) * q ** e for e in range(1, d + 1) if d % e == 0) // d

    def minpoly(self, F, K):
        q, d, o = self.q, F.d, F.ord
        n = len(K)
        c = np.zeros((n, d + 1, d), dtype=np.int64); c[:, 0, 0] = 1
        kk = K.copy()
        for i in range(d):
            new = np.zeros_like(c)
            new[:, 1:] = c[:, :-1]
            idx = (c * F.qpow[None, None, :]).sum(2)
            lg = F.LOG[idx].astype(np.int64)
            prod = np.where((lg >= 0)[:, :, None], F.PW[(lg + kk[:, None]) % o].astype(np.int64), 0)
            c = (new - prod) % q
            kk = kk * q % o
        assert (c[:, :, 1:] == 0).all() and (c[:, d, 0] == 1).all()
        return c[:, :, 0].astype(np.uint8)

    def theta(self, d, K, D):
        """coordinates of theta^i, i = 0..D, for the roots given by K: (len(K), D+1, d) uint8."""
        if d == 1:
            out = np.ones((len(K), D + 1, 1), dtype=np.uint8)
            for i in range(1, D + 1):
                out[:, i, 0] = (out[:, i - 1, 0].astype(np.int64) * K) % self.q
            return out
        F = self.F[d]
        e = (K[:, None] * np.arange(D + 1, dtype=np.int64)[None, :]) % F.ord
        return F.PW[e]

    def sym_elem(self, k, coefs):
        """log_6 chi_{pi_k}(poly) = L6(poly(theta_k)), elementwise; coefs (N, D+1) low -> high; BAD if pi | poly."""
        out = np.empty(len(k), dtype=np.int8); D = coefs.shape[1] - 1
        for d in range(1, self.b + 1):
            sel = np.flatnonzero(self.pdeg[k] == d)
            F = self.F[d]
            for s in range(0, len(sel), 400000):
                ii = sel[s:s + 400000]
                th = self.theta(d, self.pk[k[ii]], D).astype(np.int64)
                co = (coefs[ii].astype(np.int64)[:, :, None] * th).sum(1) % self.q
                out[ii] = F.L6[(co * F.qpow[None, :]).sum(1)]
        return out

    def sym_outer(self, k, A):
        """(len(k), rows) int8 on the device: log_6 chi_{pi_k}(poly_r) for the device float32 coefficient matrix A
        (rows, D+1); all primes k must have the same degree."""
        d = int(self.pdeg[k[0]]); F = self.F[d]; D = A.shape[1] - 1
        th = self.theta(d, self.pk[k], D)                                    # (P, D+1, d)
        if cp is not None:
            out = cp.empty((len(k), A.shape[0]), dtype=np.int8)
            KERN_SYM(cp.ascontiguousarray(A.astype(np.uint8)), cp.asarray(np.ascontiguousarray(th)), F.dev_L6(), np.int32(A.shape[0]), np.int32(D + 1),
                     np.int32(d), np.int32(self.q), out)
            return out
        Th = xp.asarray(np.ascontiguousarray(th.transpose(1, 0, 2).reshape(D + 1, len(k) * d)).astype(np.float32))
        C = xp.rint(xp.fmod(A @ Th, self.q)).astype(np.int32).reshape(A.shape[0], len(k), d)
        idx = C[:, :, 0].astype(np.int64)
        for i in range(1, d):
            idx += C[:, :, i].astype(np.int64) * int(F.qpow[i])
        return F.dev_L6()[idx].T

    def nodes(self, b):
        """squarefree monic polynomials of degree exactly b as products of primes in increasing table order.
        Returns coef (Cn, b+1) uint8, s (exponent of gamma_2 up to the constant, mod 6), fac (Cn, D) int32 (-1 pad)."""
        q = self.q; off = self.off
        hiA = lambda r: off[np.minimum(r // 2, self.b)]                    # primes of degree <= r/2: indices < off[r//2]
        k0 = np.arange(int(off[b]), dtype=np.int64)                        # primes of degree <= b
        rem = b - self.pdeg[k0]
        al = (rem == 0) | (rem >= self.pdeg[k0])
        k0 = k0[al]; rem = rem[al]
        lev = [dict(last=k0, rem=rem, coef=self.pcoef[k0].copy(), s=self.sP[k0].astype(np.int64), fac=k0[:, None].astype(np.int32))]
        fin = []
        while True:
            L = lev[-1]
            done = L["rem"] == 0
            fin.append((L["coef"][done], L["s"][done], L["fac"][done]))
            last = L["last"][~done]; rem = L["rem"][~done]; coef = L["coef"][~done]; s = L["s"][~done]; fac = L["fac"][~done]
            if len(last) == 0:
                break
            loA = last + 1; cA = np.maximum(hiA(rem) - loA, 0)
            loB = np.maximum(last + 1, off[rem - 1]); cB = np.maximum(off[rem] - loB, 0)
            par = np.concatenate([np.repeat(np.arange(len(last)), cA), np.repeat(np.arange(len(last)), cB)])
            if len(par) == 0:
                break
            stA = np.concatenate([[0], np.cumsum(cA)])[:-1]; stB = np.concatenate([[0], np.cumsum(cB)])[:-1]
            k = np.concatenate([loA[np.repeat(np.arange(len(last)), cA)] + (np.arange(int(cA.sum())) - np.repeat(stA, cA)),
                                loB[np.repeat(np.arange(len(last)), cB)] + (np.arange(int(cB.sum())) - np.repeat(stB, cB))])
            nrem = rem[par] - self.pdeg[k]
            al = (nrem == 0) | (nrem >= self.pdeg[k])
            par, k, nrem = par[al], k[al], nrem[al]
            Wd = self.pcoef.shape[1]
            ncoef = np.empty((len(k), Wd), dtype=np.uint8); ns = np.empty(len(k), dtype=np.int64)
            for c0 in range(0, len(k), 1 << 21):                            # chunks: bounded temporaries
                kc = k[c0:c0 + (1 << 21)]; pr = par[c0:c0 + (1 << 21)]
                cpar = coef[pr]
                j = self.sym_elem(kc, cpar).astype(np.int64)
                assert (j < BAD).all()
                pc = self.pcoef[kc].astype(np.int32); cc = cpar.astype(np.int32)
                new = np.zeros((len(kc), Wd), dtype=np.int32)
                for t in range(Wd):
                    nz = pc[:, t]
                    if nz.any():
                        new[:, t:] += cc[:, :Wd - t] * nz[:, None]
                ncoef[c0:c0 + len(kc)] = (new % q).astype(np.uint8)
                ns[c0:c0 + len(kc)] = (s[pr] + self.sP[kc] + 4 * j) % 6
            lev.append(dict(last=k, rem=nrem, coef=ncoef, s=ns,
                            fac=np.concatenate([fac[par], k[:, None].astype(np.int32)], axis=1)))
            lev[-2] = None
        D = max(f[2].shape[1] for f in fin if len(f[0])) if any(len(f[0]) for f in fin) else 1
        n = sum(len(f[0]) for f in fin)
        coef = np.concatenate([f[0] for f in fin]); s = np.concatenate([f[1] for f in fin]).astype(np.int8)
        fac = np.full((n, D), -1, dtype=np.int32); o = 0
        for f in fin:
            fac[o:o + len(f[0]), :f[2].shape[1]] = f[2]; o += len(f[0])
        expect = q ** b - q ** (b - 1) if b >= 2 else q
        assert n == expect, (n, expect)
        return coef, s, fac

# ------------------------------------------------------------------------- one size


def row_coefs(q, n, r0, r1):
    idx = np.arange(r0, r1, dtype=np.int64)
    A = np.ones((r1 - r0, n + 1), dtype=np.float32)
    for i in range(n):
        A[:, i] = (idx // q ** i) % q
    return A


class Size:
    def __init__(self, q, a, b, n, args, model=None):
        self.q, self.a, self.b, self.n, self.args = q, a, b, n, args
        t0 = time.time()
        self.Mod = Mo = model if model is not None else Model(q, max(a, b))
        self.R = q ** n
        coef, s, fac = Mo.nodes(b)
        dep = (fac >= 0).sum(1); o = np.argsort(dep, kind="stable")
        self.ccoef = coef[o]; self.cs = s[o]; self.fac = fac[o]; self.dep = dep[o]; self.Cn = len(o)
        self.mk = np.arange(int(Mo.off[a - 1]), int(Mo.off[a]), dtype=np.int64)
        self.N = len(self.mk)
        self.npz = int(Mo.off[b])                                           # primes of degree <= b
        kc = args.kcontrol and cost(q, a, b, n, 5) <= args.k_max_cost
        self.variants = ["A", "Asf", "Ap"] + (["K"] if kc else []) + [f"R{i + 1}" for i in range(args.rseeds)]
        self.exactv = [v for v in self.variants if v != "Ap"]
        self.lamC = np.exp(-2j * math.pi * self.ccoef[:, b - 1].astype(np.float64) / q)       # conj lambda(c')
        self.lamP = np.exp(-2j * math.pi * Mo.pcoef[self.mk, a - 1].astype(np.float64) / q)     # conj lambda(p)
        nv = len(self.variants)
        self.Rb = int(min(self.R, max(16, args.t_bytes // (self.npz + 1))))
        self.Cb = int(max(64, min(self.Cn, args.b_bytes // (self.Rb * 12), 2 ** 22)))
        self.plan = dict(T_int8=(self.npz + 1) * self.Rb, TW_int8=self.N * self.Cn, E_B_chunk=self.Cb * self.Rb * 12, W_chunk=self.N * self.Cb * (8 * nv + 48),
                         X=self.N * self.Rb * 8 * (5 * nv + 10), sym_tmp=int(args.sym_elems) * (3 if cp is not None else b * 16),
                         host_tables=self.Cn * (b + 1 + 1 + 4 * self.fac.shape[1]) * 2 + sum(F.size * (F.d + 5) for F in Mo.F.values()) + Mo.np_ * (b + 20))
        dev = sum(v for k, v in self.plan.items() if k != "host_tables")
        P(f"q={q} (a,b,n)=({a},{b},{n}): rows R={self.R}, cofactors Cn={self.Cn} (max depth {self.fac.shape[1]}), marks N={self.N}, primes(deg<={b})={self.npz}, "
          f"variants {self.variants}, row block {self.Rb}, column chunk {self.Cb}; setup {time.time() - t0:.1f}s")
        P("  planned allocation (GB): " + ", ".join(f"{k} {v / 1e9:.3f}" for k, v in self.plan.items()) +
          f"; device total {dev / 1e9:.2f} GB ({'GPU' if cp is not None else 'host'}), G accumulators {self.N ** 2 * 16 * nv / 1e9:.3f} GB")
        lim = float(os.environ.get("E_GPU_GB", "14")) if cp is not None else args.host_gb
        if dev / 1e9 > lim or self.plan["host_tables"] / 1e9 > args.host_gb:
            raise SystemExit(f"planned allocation above the limit (device {dev / 1e9:.1f} GB / {lim} GB, host {self.plan['host_tables'] / 1e9:.1f} GB / {args.host_gb} GB)")
        # TW[p, c'] = 4 chi_p(c') mod 6 (cubic cross factor chi3_p(c') chi3_c'(p) by reciprocity), 6 if p | c'
        t0 = time.time()
        TW = xp.empty((self.N, self.Cn), dtype=np.int8)
        step = max(1, int(args.sym_elems // max(self.N, 1)))
        for s0 in range(0, self.Cn, step):
            A = xp.asarray(self.ccoef[s0:s0 + step].astype(np.float32))
            j = self.Mod.sym_outer(self.mk, A)
            TW[:, s0:s0 + step] = xp.where(j >= BAD, np.int8(6), ((4 * j.astype(np.int16)) % 6).astype(np.int8))
        self.TW = TW
        self.sPm = self.Mod.sP[self.mk].astype(np.int64)
        self.dLU = xp.asarray(LU); self.dLV = xp.asarray(LV)
        P(f"  mark-cofactor symbol table {self.N} x {self.Cn} in {time.time() - t0:.1f}s")

    def table(self, A):
        Mo = self.Mod
        T = xp.zeros((self.npz + 1, A.shape[0]), dtype=np.int8)
        for d in range(1, self.b + 1):
            lo, hi = int(Mo.off[d - 1]), int(Mo.off[d])
            step = max(1, int(self.args.sym_elems // max(A.shape[0], 1)))
            for s in range(lo, hi, step):
                kk = np.arange(s, min(hi, s + step))
                T[s:s + len(kk)] = Mo.sym_outer(kk, A)
        return T

    def block(self, r0, r1, ap64=False):
        """exact (U, V) with x_p(m) = U + V omega for rows r0..r1: dict variant -> (U, V) float64 integer-valued (device).
        Variant Ap (not exact): float32 products accumulated in complex128; ap64 = True uses float64 products (re-check)."""
        X = xp; nR = r1 - r0
        tick("other")
        A = X.asarray(row_coefs(self.q, self.n, r0, r1))
        T = self.table(A)
        tick("symbol table")
        EP = T[X.asarray(self.mk)].astype(np.int64)
        good = EP < BAD
        # squarefree rows: no prime pi of degree <= n/2 divides both m and m'
        hi = int(self.Mod.off[self.n // 2]) if self.n >= 2 else 0
        sqf = X.ones(nR, dtype=bool)
        if hi > 0:
            Ad = X.zeros_like(A)
            for t in range(1, self.n + 1):
                Ad[:, t - 1] = X.fmod(t * A[:, t], self.q)
            for d in range(1, self.n // 2 + 1):
                lo_, hi_ = int(self.Mod.off[d - 1]), int(self.Mod.off[d])
                step = max(1, int(self.args.sym_elems // max(nR, 1)))
                for s_ in range(lo_, hi_, step):
                    kk = np.arange(s_, min(hi_, s_ + step))
                    sqf &= ~((T[s_:s_ + len(kk)] >= BAD) & (self.Mod.sym_outer(kk, Ad) >= BAD)).any(0)
        tick("squarefree mask")
        acc = {v: [X.zeros((self.N, nR), dtype=np.float64), X.zeros((self.N, nR), dtype=np.float64)] for v in self.variants if v not in ("Asf", "Ap")}
        accP = X.zeros((self.N, nR), dtype=np.complex128)
        lamC = X.asarray(self.lamC)
        cs = X.asarray(self.cs.astype(np.int16))
        for ci, s in enumerate(range(0, self.Cn, self.Cb)):
            e = min(self.Cn, s + self.Cb)
            D = int(self.dep[e - 1])
            fc = X.asarray(np.where(self.fac[s:e, :D] < 0, self.npz, self.fac[s:e, :D]).astype(np.int64))
            if cp is None:
                E = X.zeros((e - s, nR), dtype=np.int16)
                for d in range(D):
                    E += T[fc[:, d]]
                bad = E >= BAD
            tw = self.TW[:, s:e].astype(np.int16)
            cop = tw < 6
            for k, vs in ((1, [v for v in acc if v != "K"]), (4, [v for v in acc if v == "K"])):
                if not vs:
                    continue
                if cp is not None:
                    Bu = X.empty((e - s, nR), dtype=np.float32); Bv = X.empty((e - s, nR), dtype=np.float32)
                    KERN_B(T, fc.ravel(), np.int32(D), np.int32(nR), np.int32(k), Bu, Bv)
                else:
                    e6 = X.where(bad, np.int16(6), (k * E) % 6)
                    Bu = self.dLU[e6]; Bv = self.dLV[e6]; del e6
                tick("B chunk")
                ws = []
                for v in vs:
                    if v[0] == "R":
                        # deterministic hash of (seed, mark, cofactor): the same random sixth root for every row block
                        hh = (X.arange(s, e, dtype=np.uint64)[None, :] * np.uint64(0x9E3779B97F4A7C15)
                              + X.arange(self.N, dtype=np.uint64)[:, None] * np.uint64(0xC2B2AE3D27D4EB4F) + np.uint64(int(v[1:]) * 0x165667B19E3779F9 % 2 ** 64))
                        hh ^= hh >> np.uint64(29); hh *= np.uint64(0xBF58476D1CE4E5B9); hh ^= hh >> np.uint64(32)
                        rnd = ((hh >> np.uint64(11)) % np.uint64(6)).astype(np.int16)
                        we = X.where(cop, rnd, np.int16(6))
                    else:
                        we = X.where(cop, (tw + cs[None, s:e]) % 6, np.int16(6))
                    ws += [self.dLU[we], self.dLV[we]]
                nex = len(ws)
                if k == 1:                                                  # Ap: columns of A times conj lambda(c')
                    Wc = (ws[0].astype(np.complex128) + OMEGA * ws[1]) * lamC[None, s:e]
                    ws += [Wc.real, Wc.imag]
                tick("W chunk")
                if k == 1 and ap64:
                    Wr = X.ascontiguousarray(ws[nex]); Wi = X.ascontiguousarray(ws[nex + 1])
                    B64 = Bu.astype(np.float64); accP += (Wr @ B64) + 1j * (Wi @ B64)
                    B64 = Bv.astype(np.float64); accP += OMEGA * ((Wr @ B64) + 1j * (Wi @ B64))
                    del B64
                # two stacked products; the integer rows are exact in float32 (every partial sum is below 2^24)
                Wst = X.concatenate([w.astype(np.float32) for w in ws])
                PU = Wst @ Bu; PV = Wst @ Bv
                for i, v in enumerate(vs):
                    o = 2 * i * self.N
                    acc[v][0] += PU[o:o + self.N]; acc[v][0] -= PV[o + self.N:o + 2 * self.N]
                    acc[v][1] += PV[o:o + self.N]; acc[v][1] += PU[o + self.N:o + 2 * self.N]; acc[v][1] -= PV[o + self.N:o + 2 * self.N]
                if k == 1 and not ap64:
                    o = nex * self.N
                    accP += (PU[o:o + self.N] + 1j * PU[o + self.N:o + 2 * self.N]) + OMEGA * (PV[o:o + self.N] + 1j * PV[o + self.N:o + 2 * self.N])
                del Bu, Bv, Wst, PU, PV, ws
                tick("gemm")
            del fc
        out = {}
        dA, dB, dC, dD = (X.asarray(z) for z in (RA, RB, RC, RD))
        for v in acc:
            k = 4 if v == "K" else 1
            rot = (k * EP + (0 if v[0] == "R" else X.asarray(self.sPm)[:, None])) % 6
            rot = X.where(good, rot, 6)
            u, w = acc[v]
            out[v] = (dA[rot] * u + dB[rot] * w, dC[rot] * u + dD[rot] * w)
            if v == "A":
                out["Asf"] = (out["A"][0][:, sqf], out["A"][1][:, sqf])
                z = X.asarray(np.concatenate([ZETA6 ** np.arange(6), [0]]))[rot]
                out["Ap"] = accP * z * X.asarray(self.lamP)[:, None]
        if not ap64:
            self.nsqf = getattr(self, "nsqf", 0) + int(sqf.sum())
        tick("rotation")
        return out

    def gram_add(self, G, v, U, V):
        X = xp
        mx = float(max(X.abs(U).max(), X.abs(V).max(), 1.0))
        sub = int(max(1, min(U.shape[1], (2 ** 52) // int(3 * mx * mx + 1))))
        for s in range(0, U.shape[1], sub):
            u = U[:, s:s + sub]; w = V[:, s:s + sub]
            uu = u @ u.T; uw = u @ w.T; ww = w @ w.T
            gu = tonp(uu - uw + ww); gv = tonp(uw.T - uw)
            assert max(np.abs(gu).max(), np.abs(gv).max()) < 2 ** 53
            G[v][0] += np.rint(gu).astype(np.int64); G[v][1] += np.rint(gv).astype(np.int64)
        assert max(np.abs(G[v][0]).max(), np.abs(G[v][1]).max()) < 2 ** 62, "int64 accumulator near overflow"

    def run(self):
        a = self.args
        tag = f"q{self.q}_a{self.a}_b{self.b}_n{self.n}"
        ck = os.path.join(a.out, f"ck_{tag}.npz")
        G = {v: [np.zeros((self.N, self.N), dtype=np.int64), np.zeros((self.N, self.N), dtype=np.int64)] for v in self.exactv}
        G["Ap"] = np.zeros((self.N, self.N), dtype=np.complex128)
        start = 0; spent = 0.0; self.nsqf = 0
        if os.path.exists(ck):
            d = np.load(ck)
            if int(d["R"]) == self.R and int(d["N"]) == self.N and int(d["Rb"]) == self.Rb and list(d["variants"]) == self.variants:
                start = int(d["next"]); spent = float(d["spent"]); self.nsqf = int(d["nsqf"]); G["Ap"] = d["G_Ap"]
                for v in self.exactv:
                    G[v] = [d[f"Gu_{v}"], d[f"Gv_{v}"]]
                P(f"  resumed from checkpoint: row {start} of {self.R}, {spent:.0f}s already spent")
        t_run = time.time(); t_ck = time.time(); s = start
        while s < self.R:
            e = min(self.R, s + self.Rb)
            xb = self.block(s, e)
            if s == start:                                               # float64 re-check of the float32 products of Ap on a row sample
                m = min(a.recheck_rows, e - s)
                x2 = self.block(s, s + m, ap64=True)["Ap"]
                self.rk = max(getattr(self, "rk", 0.0), float(xp.abs(xb["Ap"][:, :m] - x2).max() / xp.abs(x2).max()))
                P(f"  Ap: float64 re-check on {m} rows: max relative deviation {self.rk:.2e}")
                del x2
            for v in self.exactv:
                self.gram_add(G, v, *xb[v])
            G["Ap"] += tonp(xb["Ap"] @ xb["Ap"].conj().T)
            del xb
            tick("gram")
            s = e
            el = time.time() - t_run
            if s == self.R or time.time() - t_ck > a.ck_sec:
                np.savez(ck + ".tmp.npz", next=s, R=self.R, N=self.N, Rb=self.Rb, variants=np.array(self.variants), spent=spent + el,
                         nsqf=self.nsqf, G_Ap=G["Ap"], **{f"Gu_{v}": G[v][0] for v in self.exactv}, **{f"Gv_{v}": G[v][1] for v in self.exactv})
                os.replace(ck + ".tmp.npz", ck); t_ck = time.time()
                rate = (s - start) / max(el, 1e-9)
                P(f"  rows {s}/{self.R} ({100 * s / self.R:.1f}%), {rate:.1f} rows/s, ETA {(self.R - s) / max(rate, 1e-9) / 3600:.2f} h [checkpoint]")
        total = spent + time.time() - t_run
        if PROF:
            P("  profile (s): " + ", ".join(f"{k} {v:.1f}" for k, v in sorted(PROF.items(), key=lambda kv: -kv[1]))); PROF.clear()
        rec = self.finish(G, total)
        if os.path.exists(ck):
            os.remove(ck)
        return rec, G

    def finish(self, G, total):
        a = self.args; q = self.q
        rec = dict(exp="E2", q=q, a=self.a, b=self.b, n=self.n, N=self.N, R=self.R, Cn=self.Cn, kfac=float(q) ** (self.n + self.a - self.b),
                   l=self.a / self.b, M=self.n / self.b, logZ=self.b * math.log(q), mp=(1 + math.sqrt(self.N / self.R)) ** 2,
                   seconds=total, gpu=cp is not None, exact=True, variants={})
        rec["sqfree_rows"] = self.nsqf
        for v in self.variants:
            if v == "Ap":
                Gc = G[v]; Reff = self.R
                st = kstats.gram_stats(Gc, Reff, do_sdp=(self.N <= a.sdp_nmax) and self.N > 1)
                st["tr_exact"] = "%.6f" % float(np.real(np.trace(Gc))); st["exact"] = False; st["recheck_rel"] = getattr(self, "rk", None)
            else:
                Gu, Gv = G[v]
                assert (Gu == (Gu - Gv).T).all() and (Gv == -Gv.T).all(), "exact Gram is not Hermitian in Z[omega]"
                Gc = Gu.astype(np.float64) + OMEGA * Gv.astype(np.float64)
                Reff = self.nsqf if v == "Asf" else self.R
                st = kstats.gram_stats(Gc, max(Reff, 1), do_sdp=(self.N <= a.sdp_nmax) and self.N > 1)
                st["tr_exact"] = str(int(np.trace(Gu).item())); st["exact"] = True
                if self.N <= a.store_nmax:
                    st["Gu"] = Gu.tolist(); st["Gv"] = Gv.tolist()
            st["mp"] = (1 + math.sqrt(self.N / max(Reff, 1))) ** 2
            rec["variants"][v] = st
            sd = st.get("sdp_tr")
            P(f"  RESULT q={q} (a,b,n)=({self.a},{self.b},{self.n}) N={self.N} {v:3s}: tr={st['tr_exact']} SDP/tr={'%.4f' % sd if sd else 'n/a'} n*lam/tr={st['nlam_tr']:.4f} "
              f"lam_unit={st['lam_unit']:.4f} Gersh/tr={st['gersh_tr']:.3f} pair max={st['pair_max']:.3e} rms*sqrtR={st['pair_rms_sqrtR']:.3f} | MP={rec['mp']:.4f} Kfac={rec['kfac']:.0f}")
        with open(os.path.join(a.out, "results.jsonl"), "a") as fh:
            fh.write(json.dumps(rec) + "\n")
        P(f"  size finished: {total:.0f}s")
        return rec


def cost(q, a, b, n, nv):
    R = q ** n; Cn = q ** b; N = q ** a / a; Pn = sum(q ** d / d for d in range(1, b + 1))
    return 3 * nv * N * Cn * R + Pn * R * (n + 1) * b * 2 + 4 * Cn * R * 3


def hostneed(q, a, b, n):
    """planned host peak (GB) for the fields, the prime table and the cofactor tables of a size."""
    bm = max(a, b)
    return (q ** b * (bm + 2 + 4 * b) * 2.5 + sum(q ** d * (d + 6) for d in range(1, bm + 1)) + (q ** bm / bm) * (bm + 30)) / 1e9


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sizes", type=str, required=True, help="semicolon list of q,a,b[,n] (n defaults to b); sorted by estimated cost")
    ap.add_argument("--out", type=str, default=os.path.join(HERE, "out"))
    ap.add_argument("--rseeds", type=int, default=2)
    ap.add_argument("--kcontrol", action="store_true", default=True)
    ap.add_argument("--no-kcontrol", dest="kcontrol", action="store_false")
    ap.add_argument("--sdp-nmax", type=int, default=3000)
    ap.add_argument("--store-nmax", type=int, default=40)
    ap.add_argument("--nmarks-max", type=int, default=3500)
    ap.add_argument("--k-max-cost", type=float, default=3e15, help="pole control K only for sizes with estimated cost below this")
    ap.add_argument("--t-bytes", type=float, default=(1.5e9 if cp is not None else 2e8))
    ap.add_argument("--b-bytes", type=float, default=(3e9 if cp is not None else 4e8))
    ap.add_argument("--recheck-rows", type=int, default=32)
    ap.add_argument("--sym-elems", type=float, default=(3e8 if cp is not None else 1.5e6))
    ap.add_argument("--host-gb", type=float, default=6.0)
    ap.add_argument("--ck-sec", type=float, default=600)
    ap.add_argument("--max-cost", type=float, default=1e30)
    ap.add_argument("--keep-order", action="store_true")
    a = ap.parse_args()
    a.t_bytes = int(a.t_bytes); a.b_bytes = int(a.b_bytes)
    os.makedirs(a.out, exist_ok=True)
    sizes = []
    for t in a.sizes.split(";"):
        v = [int(x) for x in t.split(",")]
        sizes.append((v[0], v[1], v[2], v[3] if len(v) > 3 else v[2]))
    nv = 2.5 + int(a.kcontrol) + a.rseeds
    if not a.keep_order:                                               # by cost; sizes with a large host plan go last (smallest plan first)
        sizes.sort(key=lambda s: (1, hostneed(*s)) if hostneed(*s) > 4.0 else (0, cost(*s, nv)))
    done = set()
    rp = os.path.join(a.out, "results.jsonl")
    if os.path.exists(rp):
        for line in open(rp):
            try:
                d = json.loads(line); done.add((d["q"], d["a"], d["b"], d["n"]))
            except Exception:
                pass
    P(f"E2 start: device {'GPU (cupy)' if cp is not None else 'numpy'}; {len(sizes)} sizes; out={a.out}")
    models = {}
    for (q, aa, b, n) in sizes:
        if (q, aa, b, n) in done:
            P(f"q={q} ({aa},{b},{n}): already in results.jsonl, skipped"); continue
        c = cost(q, aa, b, n, nv)
        if c > a.max_cost or q ** aa / aa > a.nmarks_max:
            P(f"q={q} ({aa},{b},{n}): estimated cost {c:.2e} or mark count above the limits, skipped"); continue
        bm = max(aa, b)
        hn = hostneed(q, aa, b, n)
        P(f"q={q} ({aa},{b},{n}): planned host allocation for fields, primes and cofactor tables: about {hn:.2f} GB (peak)")
        if hn > a.host_gb:
            P(f"q={q} ({aa},{b},{n}): planned host allocation above --host-gb {a.host_gb}: size not run"); continue
        key = (q, bm)
        try:
            if key not in models:
                models.clear(); models[key] = Model(q, bm)
            S = Size(q, aa, b, n, a, models[key])
            S.run()
            del S
        except SystemExit as ex:                                        # a size refused by its memory plan does not end the queue
            P(f"q={q} ({aa},{b},{n}): size not run: {ex}")
        if cp is not None:
            cp.get_default_memory_pool().free_all_blocks()
    P("E2 ALLDONE")


if __name__ == "__main__":
    main()
