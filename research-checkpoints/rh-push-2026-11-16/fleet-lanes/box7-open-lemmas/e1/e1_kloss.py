#!/usr/bin/env python3
"""E1: numerator-averaging loss (K-loss) of the 7/8 method. Mark Gram matrix over Z[omega] at growing scale.

Object (identical to n2-kloss-sdp-certificate/gram.py, whose stored matrices this code reproduces entrywise):
  rows    m primary (= 1 mod 3), not divisible by 2, Z^M/4 < N(m) <= Z^M                               (R rows, ALL of them)
  columns c = p c', p a mark, c' squarefree primary prime to 2 with 0.1 Z < N(c') <= Z, (p, c') = 1
  marks   primes p with Z^l <= N(p) <= 2 Z^l                                                           (n marks)
  x_p(m) = sum_{c'} b_{p c'} chi_{p c'}(m)^k,  b_c = coef(c) N(c)^(-1/2) W(N(c)/Z^(1+l)),  W = bump on [0.2, 1]
  variants: Ap coef = gamma_2 conj-alpha, k = 1 (manuscript row); K coef = gamma_2, k = 4 (Kubota row with theta pole:
            positive control); R coef = independent random phase per column, k = 1 (generic control).
  G = (x_p . conj x_p')  (n x n).   K-loss removal <=> sup_{|a_p|<=1} a*Ga << Z^eps tr G (infinity-to-one norm).
Per (Z, l): SDP(G)/tr G (primal-dual certificate), n lambda_max/tr, lambda_max of the unit-diagonal Gram (WLS constant),
Gershgorin sum/tr, pair statistic max_{p != p'} |G_pp'|/sqrt(G_pp G_p'p') (PAIR(l) asks <= C Z^(eps-l)), each with a
delete-one-group jackknife standard error over J = 10 random row groups.

Scaling devices (all exact reformulations of gram.py): vectorised sextic symbols (GPU kernel), cubic Gauss sums of
primes from two cubic exponential sums S(t) = sum_y e(t y^3/p) = -1 + 2 Re(conj chi(t) g), cubic reciprocity for the
pair factors (tw = chi_p(c')^4), row blocks, column chunks. float32 complex is used for the column sums above
--c64-above and re-checked in complex128 on a row sample (reported as recheck_rel).
Checkpoint: ck_Z<Z>.npz after every --ck-sec seconds; results appended to results.jsonl; rerun = resume.
"""
import os, sys, math, time, json, argparse
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "common")); sys.path.insert(0, HERE)
import kstats

cp = None
if os.environ.get("E_NOGPU", "0") != "1":
    try:
        import cupy as cp
        cp.cuda.Device(0).use()
        cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get("E_GPU_GB", "20")) * 1024 ** 3))
    except Exception as ex:                                           # no GPU: numpy path
        print(f"cupy unavailable ({type(ex).__name__}: {ex}); numpy path", flush=True); cp = None
xp = cp if cp is not None else np
T0 = time.time()


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


Z6 = np.exp(-1j * math.pi * np.arange(6) / 3)                          # gram.py convention
W3 = np.exp(2j * math.pi / 3)

# ----------------------------------------------------------------------------------------------- arithmetic


def vpow(b, e, m, X=np):
    """b^e mod m, elementwise with broadcasting; int64; moduli < 2^31.5."""
    e = X.asarray(e, dtype=np.int64); m = X.asarray(m, dtype=np.int64)
    b = X.asarray(b, dtype=np.int64) % m
    res = X.ones(np.broadcast_shapes(b.shape, e.shape, m.shape), dtype=np.int64)
    for i in range(int(e.max()).bit_length()):
        bit = ((e >> i) & 1).astype(bool)
        res = X.where(bit, res * b % m, res); b = b * b % m
    return res


if cp is not None:
    KERN_SPLIT = cp.ElementwiseKernel(
        "int64 u, int64 v, int64 p, int64 r", "int8 j",
        """long long uu = u % p; if (uu < 0) uu += p; long long vv = v % p; if (vv < 0) vv += p;
           unsigned long long Pm = p, x = ((unsigned long long)uu + (unsigned long long)vv * (unsigned long long)r) % Pm;
           if (x == 0) { j = -1; } else {
             unsigned long long e = (Pm - 1) / 6, res = 1, b = x;
             while (e) { if (e & 1) res = res * b % Pm; b = b * b % Pm; e >>= 1; }
             unsigned long long z = (Pm - (unsigned long long)r) % Pm, val = 1; int t; j = -1;
             for (t = 0; t < 6; t++) { if (res == val) { j = t; break; } val = val * z % Pm; }
           }""", "chi6_split")
    KERN_CUBE = cp.ElementwiseKernel(
        "int64 y, int64 p, int64 t", "float64 c1, float64 c2",
        """unsigned long long Pm = p, yy = y, y3 = (yy * yy % Pm) * yy % Pm, a2 = y3 * (unsigned long long)t % Pm;
           c1 = cos(6.283185307179586476925 * (double)y3 / (double)Pm);
           c2 = cos(6.283185307179586476925 * (double)a2 / (double)Pm);""", "cube_cos")


if cp is not None:
    KERN_E6 = cp.ElementwiseKernel(
        "raw int8 Tm, raw int64 fac, int32 D, int32 nR", "int8 code",
        """long long c = i / nR; long long m = i - c * nR; int e = 0;
           for (int d = 0; d < D; d++) e += Tm[fac[c * D + d] * (long long)nR + m];
           code = (e >= 64) ? 6 : (e % 6);""", "e6_fused")


def chi6_split(U, V, p, r, X=np):
    """exponent j of chi6_pi(U + V omega) = (-r)^j for the split prime (p, r); -1 if not coprime. Broadcasts."""
    if cp is not None and X is cp:
        return KERN_SPLIT(U, V, p, r)
    x = ((U % p) + (V % p) * r) % p
    t = vpow(x, (p - 1) // 6, p, X)
    z = (p - r) % p
    out = X.full(t.shape, -1, dtype=np.int8); val = X.ones_like(p)
    for j in range(6):
        out = X.where(t == val, np.int8(j), out); val = val * z % p
    return X.where(x == 0, np.int8(-1), out)


def chi6_inert(U, V, q, X=np):
    """sextic symbol modulo the inert prime q (norm q^2), value (-omega)^j; -1 if not coprime. Broadcasts."""
    q = X.asarray(q, dtype=np.int64)
    U = U % q; V = V % q
    e = (q * q - 1) // 6
    shp = np.broadcast_shapes(U.shape, V.shape, q.shape)
    ru = X.ones(shp, dtype=np.int64); rv = X.zeros(shp, dtype=np.int64); bu, bv = U, V
    for i in range(int(e.max()).bit_length()):
        bit = ((e >> i) & 1).astype(bool)
        nu = (ru * bu - rv * bv) % q; nv = (ru * bv + rv * bu - rv * bv) % q
        ru = X.where(bit, nu, ru); rv = X.where(bit, nv, rv)
        bu, bv = (bu * bu - bv * bv) % q, (2 * bu * bv - bv * bv) % q
    out = X.full(shp, -1, dtype=np.int8)
    vu = X.ones_like(q); vv = X.zeros_like(q)
    for j in range(6):
        out = X.where((ru == vu) & (rv == vv), np.int8(j), out)
        vu, vv = vv % q, (vv - vu) % q
    return X.where((U == 0) & (V == 0), np.int8(-1), out)


def sieve(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]:
            s[i * i::i] = False
    return s


def primary_elements(nmax):
    """all primary a + b omega (a = 1, b = 0 mod 3) with 0 < norm <= nmax, sorted by (norm, a, b)."""
    r = int(math.isqrt(4 * nmax // 3)) + 3
    a = np.arange(-r, r + 1, dtype=np.int64); a = a[a % 3 == 1]
    b = np.arange(-r, r + 1, dtype=np.int64); b = b[b % 3 == 0]
    out = []
    for ch in np.array_split(a, max(1, len(a) * len(b) // 8_000_000 + 1)):
        A, B = np.meshgrid(ch, b, indexing="ij"); N = A * A - A * B + B * B
        k = (N > 0) & (N <= nmax)
        out.append(np.stack([N[k], A[k], B[k]], 1))
    els = np.concatenate(out)
    return els[np.lexsort((els[:, 2], els[:, 1], els[:, 0]))]


def prime_table(els, isp):
    """prime elements among els: split (norm p = 1 mod 3) and inert (-q, q = 2 mod 3, q != 2), in els order."""
    N, a, b = els[:, 0], els[:, 1], els[:, 2]
    split = (b != 0) & isp[N]
    na = -a
    inert = (b == 0) & (a < 0) & (a != -2)
    inert[inert] &= isp[na[inert]] & (na[inert] % 3 == 2)
    sel = split | inert
    pN, pa, pb, ps = N[sel], a[sel], b[sel], split[sel]
    pp = np.where(ps, pN, -pa)
    pr = np.zeros(len(pN), dtype=np.int64)
    binv = vpow(pb[ps] % pp[ps], pp[ps] - 2, pp[ps])
    pr[ps] = (-pa[ps] % pp[ps]) * binv % pp[ps]
    return dict(N=pN, a=pa, b=pb, split=ps, p=pp, r=pr)


def chi6_elem(pt, k, U, V, X=np):
    """elementwise chi6_{P_k}(U + V omega) for arrays of prime indices k and elements (U, V) (host)."""
    out = np.empty(len(k), dtype=np.int8)
    s = pt["split"][k]
    if s.any():
        out[s] = tonp(chi6_split(X.asarray(U[s]), X.asarray(V[s]), X.asarray(pt["p"][k[s]]), X.asarray(pt["r"][k[s]]), X))
    if (~s).any():
        out[~s] = tonp(chi6_inert(X.asarray(U[~s]), X.asarray(V[~s]), X.asarray(pt["p"][k[~s]]), X))
    return out


def gauss_split(pt, idx, chunk):
    """normalised cubic Gauss sums (gram.py convention) of the split primes idx, from two cubic exponential sums."""
    p = pt["p"][idx]; r = pt["r"][idx]; a = pt["a"][idx]; b = pt["b"][idx]
    e3 = (p - 1) // 3
    t1 = np.zeros(len(p), dtype=np.int64); s1 = np.zeros(len(p), dtype=np.int64)
    pend = np.ones(len(p), dtype=bool); t = 2
    while pend.any():
        c = vpow(np.full(int(pend.sum()), t), e3[pend], p[pend])
        non = c != 1
        ii = np.flatnonzero(pend)[non]
        t1[ii] = t; s1[ii] = np.where(c[non] == r[ii], 1, 2)
        pend[ii] = False; t += 1
    S1 = np.empty(len(p)); S2 = np.empty(len(p))
    lens = (p - 1) // 2
    i = 0
    while i < len(p):
        j = i + 1; tot = int(lens[i])
        while j < len(p) and tot + int(lens[j]) <= chunk:
            tot += int(lens[j]); j += 1
        L = xp.asarray(lens[i:j]); st = xp.concatenate([xp.zeros(1, dtype=np.int64), xp.cumsum(L)])
        rep = xp.searchsorted(st[1:], xp.arange(tot, dtype=np.int64), side="right")
        y = xp.arange(tot, dtype=np.int64) - st[rep] + 1
        pe = xp.asarray(p[i:j])[rep]; te = xp.asarray(t1[i:j])[rep]
        if cp is not None:
            c1, c2 = KERN_CUBE(y, pe, te)
        else:
            y3 = (y * y % pe) * y % pe
            c1 = np.cos(2 * math.pi * y3 / pe); c2 = np.cos(2 * math.pi * (y3 * te % pe) / pe)
        for cc, S in ((c1, S1), (c2, S2)):
            cs = xp.concatenate([xp.zeros(1), xp.cumsum(cc)])
            S[i:j] = tonp(2 * (cs[st[1:]] - cs[st[:-1]]))
        del y, pe, te, c1, c2, rep
        i = j
    x = (S1 + 1) / 2
    ang = 2 * math.pi * s1 / 3
    yv = ((S2 + 1) / 2 - x * np.cos(ang)) / np.sin(ang)
    g1 = x + 1j * yv                                                   # sum_x chi(x) e(x/p)
    tau = (2 * a - b) % p
    c = vpow(tau, e3, p)
    ph = np.where(c == 1, 0, np.where(c == r, 1, 2))
    return np.conj(W3 ** ph) * g1 / np.sqrt(p)


def gauss_inert(q):
    """gram.py gauss_prime for the inert prime -q (direct sum over (O/q)^2)."""
    X = xp
    u, v = X.meshgrid(X.arange(q, dtype=np.int64), X.arange(q, dtype=np.int64), indexing="ij")
    u = u.ravel(); v = v.ravel()
    j = chi6_inert(u, v, X.asarray([q], dtype=np.int64), X).astype(np.int64)
    ok = j >= 0
    val = X.asarray(Z6)[(2 * j[ok]) % 6]
    ang = 2 * math.pi * ((-(2 * u[ok] - v[ok])) % q) / q
    return complex((val * X.exp(1j * ang)).sum()) / q


def gauss_direct_split(pt, k):
    """gram.py gauss_prime (direct O(p log p) sum) for a split prime: validation only."""
    p = int(pt["p"][k]); r = int(pt["r"][k]); a = int(pt["a"][k]); b = int(pt["b"][k])
    x = np.arange(1, p, dtype=np.int64)
    t = vpow(x, (p - 1) // 3, np.int64(p))
    ph = np.zeros(p - 1); ph[t == r] = 1.0; ph[t == (r * r) % p] = 2.0
    ang = 2 * math.pi * (ph / 3.0 + ((x * ((2 * a - b) % p)) % p) / p)
    return complex(np.exp(1j * ang).sum()) / math.sqrt(p)


def prime_gauss(pt, cache_path, chunk):
    """gamma_2 of all primes of the table; disk cache keyed by (N, a, b)."""
    n = len(pt["N"]); g = np.full(n, np.nan + 0j)
    if os.path.exists(cache_path):
        d = np.load(cache_path)
        key = {(int(N), int(a), int(b)): i for i, (N, a, b) in enumerate(zip(d["N"], d["a"], d["b"]))} if len(d["N"]) < 200000 else None
        if key is None:                                               # large cache: merge by sorted structured compare
            m = min(n, len(d["N"]))
            same = (d["N"][:m] == pt["N"][:m]) & (d["a"][:m] == pt["a"][:m]) & (d["b"][:m] == pt["b"][:m])
            g[:m][same] = d["g"][:m][same]
        else:
            for i in range(n):
                j = key.get((int(pt["N"][i]), int(pt["a"][i]), int(pt["b"][i])))
                if j is not None:
                    g[i] = d["g"][j]
    todo = np.flatnonzero(np.isnan(g.real))
    if len(todo):
        t0 = time.time()
        sp = todo[pt["split"][todo]]; ine = todo[~pt["split"][todo]]
        if len(sp):
            g[sp] = gauss_split(pt, sp, chunk)
        for k in ine:
            g[k] = gauss_inert(int(pt["p"][k]))
        dev = float(np.abs(np.abs(g[todo]) - 1).max())
        P(f"prime Gauss sums: {len(todo)} new ({len(sp)} split, {len(ine)} inert) in {time.time() - t0:.1f}s; max ||g|-1| = {dev:.2e}")
        assert dev < 1e-6, "Gauss sum modulus check failed"
        prev = np.load(cache_path)["N"] if os.path.exists(cache_path) else np.zeros(0)
        if n >= len(prev):
            np.savez(cache_path + ".tmp.npz", N=pt["N"], a=pt["a"], b=pt["b"], g=g); os.replace(cache_path + ".tmp.npz", cache_path)
    return g


def squarefree_nodes(pt, gp, Zmax):
    """all squarefree products (primary) of distinct primes of the table with norm <= Zmax, by breadth-first levels.
    Returns a, b, N, gamma_2, fac (n x D prime indices, -1 padded). gamma_2 by twisted multiplicativity with the
    pair factor chi_pi(parent)^4 (cubic reciprocity; validated against gram.py)."""
    pN = pt["N"]; npz = int(np.searchsorted(pN, Zmax, "right"))
    la = [pt["a"][:npz].copy()]; lb = [pt["b"][:npz].copy()]; lN = [pN[:npz].copy()]; lg = [gp[:npz].copy()]
    llast = [np.arange(npz, dtype=np.int64)]; lfac = [np.arange(npz, dtype=np.int32)[:, None]]
    while True:
        a, b, N, g, last, fac = la[-1], lb[-1], lN[-1], lg[-1], llast[-1], lfac[-1]
        hi = np.searchsorted(pN[:npz], Zmax // np.maximum(N, 1), "right")
        cnt = np.maximum(hi - (last + 1), 0)
        tot = int(cnt.sum())
        if tot == 0:
            break
        par = np.repeat(np.arange(len(N)), cnt)
        st = np.concatenate([[0], np.cumsum(cnt)])[:-1]
        k = (last + 1)[par] + (np.arange(tot) - st[par])
        ka, kb = pt["a"][k], pt["b"][k]
        j = chi6_elem(pt, k, a[par], b[par], xp).astype(np.int64)
        assert (j >= 0).all()
        la.append(a[par] * ka - b[par] * kb); lb.append(a[par] * kb + b[par] * ka - b[par] * kb); lN.append(N[par] * pN[k])
        lg.append(g[par] * gp[k] * Z6[(4 * j) % 6]); llast.append(k)
        lfac.append(np.concatenate([fac[par], k[:, None].astype(np.int32)], axis=1))
    D = len(lfac)
    fac = np.full((sum(len(x) for x in la), D), -1, dtype=np.int32); o = 0
    for f in lfac:
        fac[o:o + len(f), :f.shape[1]] = f; o += len(f)
    return np.concatenate(la), np.concatenate(lb), np.concatenate(lN), np.concatenate(lg), fac


def bump(x, X=np):
    t = (x - 0.6) / 0.4
    return X.where(X.abs(t) < 1, X.exp(1 - 1 / X.maximum(1 - t * t, 1e-300)), 0.0)

# ----------------------------------------------------------------------------------------------- one size


class Size:
    def __init__(self, Z, M, ls, args):
        self.Z, self.M, self.args = Z, M, args
        t0 = time.time()
        NMAX = int(max(Z ** M, Z, max(2 * Z ** l for l in ls))) + 1
        hostpeak = 70.0 * NMAX / 1e9
        P(f"Z={Z:g}: planned host allocation for the element, prime and cofactor tables: about {hostpeak:.2f} GB (peak)")
        if hostpeak > args.host_gb:
            raise SystemExit(f"planned host allocation {hostpeak:.1f} GB above --host-gb {args.host_gb}: size not run")
        els = primary_elements(NMAX)
        isp = sieve(NMAX)
        self.pt = pt = prime_table(els, isp)
        npz = int(np.searchsorted(pt["N"], Z, "right"))                 # cofactor primes: norm <= Z
        self.npz = npz
        RLO, RHI = Z ** M / 4, Z ** M
        rw = (els[:, 0] > RLO) & (els[:, 0] <= RHI) & ~((els[:, 1] % 2 == 0) & (els[:, 2] % 2 == 0))
        self.U = els[rw, 1].copy(); self.V = els[rw, 2].copy(); self.R = int(rw.sum())
        self.Rfull = self.R; self.rowfrac = 1.0
        if args.rowfrac:
            zmin, fr = args.rowfrac.split(":")
            if Z >= float(zmin) and float(fr) < 1:
                keep = np.sort(np.random.default_rng(args.seed + 17 + int(Z)).choice(self.R, size=int(self.R * float(fr)), replace=False))
                self.U = self.U[keep]; self.V = self.V[keep]; self.R = len(keep); self.rowfrac = float(fr)
                P(f"  row sample: {self.R} of {self.Rfull} rows (fraction {self.rowfrac})")
        del els
        P(f"Z={Z:g} M={M}: rows R={self.R}, primes(norm<=Z)={npz}, elements setup {time.time() - t0:.1f}s")
        P(f"  planned allocation for the prime Gauss sums: {max(args.gs_chunk, int(Z) // 2) * 8 * (8 if cp is not None else 12) / 1e9:.2f} GB ({'GPU' if cp is not None else 'host'})")
        self.gp = prime_gauss(pt, os.path.join(args.out, "gauss_cache.npz"), args.gs_chunk)
        a, b, N, g, fac = squarefree_nodes(pt, self.gp, int(Z))
        w = (N > 0.1 * Z) & (N <= Z)
        dep = (fac[w] >= 0).sum(1)
        o = np.argsort(dep, kind="stable")
        self.CU = a[w][o]; self.CV = b[w][o]; self.CN = N[w][o].astype(float); self.gC = g[w][o]; self.fac = fac[w][o]; self.dep = dep[o]
        self.Cn = len(self.CN)
        self.alC = (self.CU - self.CV / 2 + 1j * self.CV * math.sqrt(3) / 2) / np.sqrt(self.CN)
        del a, b, N, g, fac
        # marks, family by family
        self.fams = []
        mk = []
        for l in ls:
            PLO, PHI = Z ** l, 2 * Z ** l
            idx = np.flatnonzero((pt["N"] >= PLO) & (pt["N"] <= PHI))
            if len(idx) == 0 or len(idx) > args.nmax:
                P(f"  family l={l:.4f}: n={len(idx)} marks: skipped (0 or above --nmax {args.nmax})"); continue
            assert idx.max() < npz, "marks must lie among the cofactor primes"
            self.fams.append(dict(l=l, idx=idx, n=len(idx), sl=slice(sum(len(x) for x in mk), sum(len(x) for x in mk) + len(idx)), X=Z ** (1 + l)))
            mk.append(idx)
        self.mk = np.concatenate(mk) if mk else np.zeros(0, dtype=np.int64)
        self.n = len(self.mk)
        self.Xk = np.concatenate([np.full(f["n"], f["X"]) for f in self.fams]) if self.fams else np.zeros(0)
        self.Np = pt["N"][self.mk].astype(float)
        self.SU = pt["a"][self.mk]; self.SV = pt["b"][self.mk]
        self.gP = self.gp[self.mk]
        self.alP = (self.SU - self.SV / 2 + 1j * self.SV * math.sqrt(3) / 2) / np.sqrt(self.Np)
        self.variants = ["Ap", "R"] + (["K"] if Z <= args.k_below else [])
        self.cdt = np.complex64 if Z > args.c64_above else np.complex128
        self.J = args.groups
        rng = np.random.default_rng(args.seed + int(Z))
        self.grp = (rng.permutation(self.R) % self.J).astype(np.int8)
        # block sizes
        self.Rb = int(min(self.R, max(64, args.t_bytes // max(npz + 1, 1))))
        cb = 16 if self.cdt == np.complex128 else 8
        self.Cb = int(max(256, min(self.Cn, args.b_bytes // (self.Rb * (cb * 2 + 3)), args.w_bytes // max(self.n * 64, 1))))
        nv = len(self.variants)
        self.plan = dict(
            T_int8=(npz + 1) * self.Rb, TW_int8=self.n * self.Cn, E_B_chunk=self.Cb * self.Rb * (cb * 2 + 3), W_chunk=self.n * self.Cb * 64,
            Xacc=self.n * self.Rb * (cb * nv + 16 * (nv + 2)), sym_tmp=int(args.sym_elems) * (2 if cp is not None else 72), G=sum(f["n"] ** 2 for f in self.fams) * 16 * nv * self.J, host_tables=self.Cn * (8 * 5 + 16 * 2 + 4 * self.fac.shape[1]) + self.R * 17)
        tot_dev = sum(v for k, v in self.plan.items() if k != "host_tables" and k != "G")
        P(f"  cofactors Cn={self.Cn} (max depth {self.fac.shape[1]}), marks n={self.n} ({', '.join(str(f['n']) for f in self.fams)}), variants {self.variants}, "
          f"dtype {np.dtype(self.cdt).name}, row block {self.Rb}, column chunk {self.Cb}")
        P("  planned allocation (GB): " + ", ".join(f"{k} {v / 1e9:.3f}" for k, v in self.plan.items()) +
          f"; device total {tot_dev / 1e9:.2f} GB ({'GPU' if cp is not None else 'host'}), host tables {self.plan['host_tables'] / 1e9:.2f} GB, G accumulators {self.plan['G'] / 1e9:.3f} GB")
        lim = float(os.environ.get("E_GPU_GB", "20")) if cp is not None else args.host_gb
        if tot_dev / 1e9 > lim:
            raise SystemExit(f"planned device allocation {tot_dev / 1e9:.1f} GB above the limit {lim} GB: reduce Z, --nmax, --t-bytes or --b-bytes")
        # device constants
        X = xp
        self.d_pp = X.asarray(pt["p"][:npz]); self.d_pr = X.asarray(pt["r"][:npz]); self.d_split = pt["split"][:npz]
        self.i_split = np.flatnonzero(self.d_split); self.i_inert = np.flatnonzero(~self.d_split)
        # TW[k, c] = 4 chi_p(c') mod 6, -1 if p | c'
        t0 = time.time()
        TW = X.empty((self.n, self.Cn), dtype=np.int8)
        cu = X.asarray(self.CU); cv = X.asarray(self.CV)
        for s in range(0, self.n, 64):
            kk = self.mk[s:s + 64]
            j = X.empty((len(kk), self.Cn), dtype=np.int8)
            sp = pt["split"][kk]
            if sp.any():
                j[np.flatnonzero(sp)] = chi6_split(cu[None, :], cv[None, :], X.asarray(pt["p"][kk[sp]])[:, None], X.asarray(pt["r"][kk[sp]])[:, None], X)
            if (~sp).any():
                j[np.flatnonzero(~sp)] = chi6_inert(cu[None, :], cv[None, :], X.asarray(pt["p"][kk[~sp]])[:, None], X)
            TW[s:s + len(kk)] = X.where(j < 0, np.int8(-1), ((4 * j.astype(np.int16)) % 6).astype(np.int8))
        self.TW = TW
        P(f"  mark-cofactor symbol table {self.n} x {self.Cn} in {time.time() - t0:.1f}s")
        self.LUT1 = {dt: X.asarray(np.concatenate([Z6, [0]]).astype(dt)) for dt in (np.complex64, np.complex128)}
        self.LUT4 = {dt: X.asarray(np.concatenate([Z6[(4 * np.arange(6)) % 6], [0]]).astype(dt)) for dt in (np.complex64, np.complex128)}

    # symbols of all cofactor primes at a block of rows: (npz + 1) x Rb, value 64 where not coprime, last row 0
    def table(self, U, V):
        X = xp
        T = X.zeros((self.npz + 1, len(U)), dtype=np.int8)
        u = X.asarray(U)[None, :]; v = X.asarray(V)[None, :]
        step = max(1, int(self.args.sym_elems // max(len(U), 1)))
        for s in range(0, len(self.i_split), step):
            ii = self.i_split[s:s + step]
            T[ii] = chi6_split(u, v, self.d_pp[ii][:, None], self.d_pr[ii][:, None], X)
        for s in range(0, len(self.i_inert), step):
            ii = self.i_inert[s:s + step]
            T[ii] = chi6_inert(u, v, self.d_pp[ii][:, None], X)
        return T

    def block(self, U, V, dt, chunk_ids=None):
        """x_p(m) for the rows (U, V): dict variant -> (n x len(U)) array of dtype dt (device)."""
        X = xp; nR = len(U)
        tick("other")
        T = self.table(U, V)
        tick("symbol table")
        EP = T[X.asarray(self.mk)].astype(np.int64)                      # chi6_p(m) for the marks
        goodP = (EP >= 0)
        Tm = X.where(T < 0, np.int8(64), T); Tm[self.npz] = 0
        del T
        acc = {v: X.zeros((self.n, nR), dtype=dt) for v in self.variants}
        Np = X.asarray(self.Np)[:, None]; Xk = X.asarray(self.Xk)[:, None]
        rdt = np.float32 if dt == np.complex64 else np.float64
        for ci, s in enumerate(range(0, self.Cn, self.Cb)):
            e = min(self.Cn, s + self.Cb)
            D = int(self.dep[e - 1])
            fc = X.asarray(np.where(self.fac[s:e, :D] < 0, self.npz, self.fac[s:e, :D]).astype(np.int64))
            if cp is not None:
                e6 = X.empty((e - s, nR), dtype=np.int8)
                KERN_E6(Tm, fc.ravel(), np.int32(D), np.int32(nR), e6)
            else:
                E = X.zeros((e - s, nR), dtype=np.int16)
                for d in range(D):
                    E += Tm[fc[:, d]]
                e6 = X.where(E >= 64, np.int16(6), E % 6)
                del E
            tick("e6 chunk")
            CN = X.asarray(self.CN[s:e])[None, :]
            tw = self.TW[:, s:e]
            Wt = (bump(Np * CN / Xk, X) / X.sqrt(Np * CN)).astype(rdt) * (tw >= 0)
            ph = self.LUT1[dt][X.where(tw < 0, np.int8(6), tw).astype(np.int64)]
            gC = X.asarray(self.gC[s:e]); alC = X.asarray(self.alC[s:e])
            B1 = self.LUT1[dt][e6]
            # deterministic hash of (seed, mark, cofactor): the same random phase for every row block
            hh = (X.arange(s, e, dtype=np.uint64)[None, :] * np.uint64(0x9E3779B97F4A7C15)
                  + X.arange(self.n, dtype=np.uint64)[:, None] * np.uint64(0xC2B2AE3D27D4EB4F) + np.uint64(self.args.seed * 0x165667B19E3779F9 % 2 ** 64))
            hh ^= hh >> np.uint64(29); hh *= np.uint64(0xBF58476D1CE4E5B9); hh ^= hh >> np.uint64(32)
            rp = X.exp((2j * math.pi / 2 ** 24) * (hh >> np.uint64(40)).astype(np.float64)).astype(dt)
            Wst = X.concatenate([Wt * ph * (gC * X.conj(alC)).astype(dt)[None, :], Wt * rp])      # Ap and R share B1: one product
            del rp, hh
            tick("W and B chunk")
            Pst = Wst @ B1
            acc["Ap"] += Pst[:self.n]; acc["R"] += Pst[self.n:]
            del Wst, Pst
            tick("gemm")
            if "K" in acc:
                B4 = self.LUT4[dt][e6]
                tick("W and B chunk")
                acc["K"] += (Wt * ph * gC.astype(dt)[None, :]) @ B4
                del B4
                tick("gemm")
            del B1, Wt, ph, e6, fc
        gP = X.asarray(self.gP); alP = X.asarray(self.alP)
        z1 = self.LUT1[np.complex128][X.where(goodP, EP, 6)]
        out = {}
        if "Ap" in acc:
            out["Ap"] = acc["Ap"].astype(np.complex128) * ((gP * X.conj(alP))[:, None] * z1)
        if "R" in acc:
            out["R"] = acc["R"].astype(np.complex128) * z1
        if "K" in acc:
            out["K"] = acc["K"].astype(np.complex128) * (gP[:, None] * self.LUT4[np.complex128][X.where(goodP, EP, 6)])
        tick("row factors")
        return out

    def run(self):
        a = self.args; X = xp
        ck = os.path.join(a.out, f"ck_Z{int(self.Z)}.npz")
        G = {(fi, v, g): np.zeros((f["n"], f["n"]), dtype=np.complex128) for fi, f in enumerate(self.fams) for v in self.variants for g in range(self.J)}
        start = 0; spent = 0.0; rk = 0.0
        if os.path.exists(ck):
            d = np.load(ck)
            if int(d["R"]) == self.R and int(d["n"]) == self.n and int(d["Rb"]) == self.Rb and list(d["variants"]) == self.variants:
                start = int(d["next"]); spent = float(d["spent"]); rk = float(d["recheck"])
                for (fi, v, g) in G:
                    G[(fi, v, g)] = d[f"G_{fi}_{v}_{g}"]
                P(f"  resumed from checkpoint: row {start} of {self.R}, {spent:.0f}s already spent")
            else:
                P("  checkpoint does not match this configuration: ignored")
        t_run = time.time(); t_ck = time.time(); done_here = 0
        s = start
        while s < self.R:
            e = min(self.R, s + self.Rb)
            xb = self.block(self.U[s:e], self.V[s:e], self.cdt)
            if self.cdt == np.complex64 and s == start:                  # complex128 re-check on a row sample
                m = min(a.recheck_rows, e - s)
                x2 = self.block(self.U[s:s + m], self.V[s:s + m], np.complex128)
                rk = max(rk, max(float(X.abs(xb[v][:, :m] - x2[v]).max() / X.abs(x2[v]).max()) for v in self.variants))
                P(f"  complex128 re-check on {m} rows: max relative deviation {rk:.2e}")
                del x2
            gb = self.grp[s:e]
            for g in range(self.J):
                cols = X.asarray(np.flatnonzero(gb == g))
                if len(cols) == 0:
                    continue
                for v in self.variants:
                    xg = xb[v][:, cols]
                    for fi, f in enumerate(self.fams):
                        y = xg[f["sl"]]
                        G[(fi, v, g)] += tonp(y @ y.conj().T)
            del xb
            tick("gram")
            done_here += e - s; s = e
            el = time.time() - t_run
            if s == self.R or time.time() - t_ck > a.ck_sec:
                np.savez(ck + ".tmp.npz", next=s, R=self.R, n=self.n, Rb=self.Rb, variants=np.array(self.variants), spent=spent + el, recheck=rk,
                         **{f"G_{fi}_{v}_{g}": G[(fi, v, g)] for (fi, v, g) in G})
                os.replace(ck + ".tmp.npz", ck); t_ck = time.time()
                rate = done_here / max(el, 1e-9)
                P(f"  rows {s}/{self.R} ({100 * s / self.R:.1f}%), {rate:.1f} rows/s, ETA {(self.R - s) / max(rate, 1e-9) / 3600:.2f} h [checkpoint]")
        total = spent + time.time() - t_run
        if PROF:
            P("  profile (s): " + ", ".join(f"{k} {v:.1f}" for k, v in sorted(PROF.items(), key=lambda kv: -kv[1]))); PROF.clear()
        self.finish(G, total, rk)
        if os.path.exists(ck):
            os.remove(ck)

    def finish(self, G, total, rk):
        a = self.args
        pos = {(int(x), int(y)): i for i, (x, y) in enumerate(zip(self.SU, self.SV))}
        for fi, f in enumerate(self.fams):
            n = f["n"]; sl = f["sl"]
            if (float(self.Z), round(f["l"], 6)) in a.done:             # family already written before a stop: not repeated
                P(f"  family l={f['l']:.4f} at Z={self.Z:g}: already in results.jsonl"); continue
            cj = np.array([pos.get((int(x - y), int(-y)), -10 ** 9) - sl.start for x, y in zip(self.SU[sl], self.SV[sl])])
            cj = np.where((cj >= 0) & (cj < n), cj, -1)
            rec = dict(exp="E1", Z=self.Z, M=self.M, l=f["l"], n=n, R=self.R, Rfull=self.Rfull, rowfrac=self.rowfrac, Cn=self.Cn, kfac=self.Z ** (self.M + f["l"] - 1),
                       mp=(1 + math.sqrt(n / self.R)) ** 2, mp_jk=(1 + math.sqrt(n / (self.R * (self.J - 1) / self.J))) ** 2,
                       seconds=total, gpu=cp is not None, dtype=np.dtype(self.cdt).name, recheck_rel=rk, groups=self.J, variants={})
            for v in self.variants:
                Gt = sum(G[(fi, v, g)] for g in range(self.J))
                st = kstats.gram_stats(Gt, self.R, do_sdp=(n <= a.sdp_nmax), conj_perm=cj)
                keys = ["nlam_tr", "lam_unit", "gersh_tr", "ones_tr", "pair_max", "pair_rms", "pair_max_nc"] + (["sdp_tr"] if n <= a.sdp_jk_nmax else [])
                jk = {k: [] for k in keys}
                for g in range(self.J):
                    sj = kstats.gram_stats(Gt - G[(fi, v, g)], self.R * (self.J - 1) / self.J, do_sdp=(n <= a.sdp_jk_nmax), conj_perm=cj)
                    for k in keys:
                        jk[k].append(sj[k])
                se = {k: float(math.sqrt((self.J - 1) / self.J * ((np.array(x) - np.mean(x)) ** 2).sum())) for k, x in jk.items()}
                if st["sdp_tr"] is not None and "sdp_tr" not in se:       # large n: scale the jackknife error of n lambda_max / tr
                    se["sdp_tr"] = se["nlam_tr"] * st["sdp_tr"] / st["nlam_tr"]
                st["se"] = se
                rec["variants"][v] = st
                sd = st["sdp_tr"]
                P(f"  RESULT Z={self.Z:g} l={f['l']:.4f} n={n} {v:2s}: SDP/tr={'%.4f' % sd if sd is not None else 'n/a'} (+-{se.get('sdp_tr', float('nan')):.4f}) "
                  f"n*lam/tr={st['nlam_tr']:.4f} (+-{se['nlam_tr']:.4f}) lam_unit={st['lam_unit']:.4f} Gersh/tr={st['gersh_tr']:.3f} "
                  f"pair max={st['pair_max']:.3e} rms*sqrtR={st['pair_rms_sqrtR']:.3f} | MP={rec['mp']:.4f} Kfac={rec['kfac']:.1f}")
            with open(os.path.join(a.out, "results.jsonl"), "a") as fh:
                fh.write(json.dumps(rec) + "\n")
            if a.save_gram and n <= 2500:
                np.savez(os.path.join(a.out, f"gram_Z{int(self.Z)}_l{f['l']:.4f}.npz"), SU=self.SU[sl], SV=self.SV[sl], Np=self.Np[sl], R=self.R,
                         **{f"G_{v}": sum(G[(fi, v, g)] for g in range(self.J)) for v in self.variants})
        with open(os.path.join(a.out, "results.jsonl"), "a") as fh:      # marker: all families of this size are written
            fh.write(json.dumps(dict(exp="E1", Z=self.Z, complete=True)) + "\n")
        P(f"  size Z={self.Z:g} finished: {total:.0f}s")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--Z", type=str, required=True, help="comma list of Z, processed in the given order")
    ap.add_argument("--M", type=float, default=1.0)
    ap.add_argument("--ls", type=str, default="0.3333333333333333,0.5,0.6666666666666666")
    ap.add_argument("--out", type=str, default=os.path.join(HERE, "out"))
    ap.add_argument("--nmax", type=int, default=3000)
    ap.add_argument("--rowfrac", type=str, default="", help="Zmin:fraction : for Z >= Zmin use a random sample of the rows (recorded as rowfrac)")
    ap.add_argument("--sdp-nmax", type=int, default=3000)
    ap.add_argument("--sdp-jk-nmax", type=int, default=400)
    ap.add_argument("--k-below", type=float, default=5e6, help="variant K (pole control) only for Z <= this")
    ap.add_argument("--c64-above", type=float, default=1.3e5, help="complex64 column sums for Z above this")
    ap.add_argument("--groups", type=int, default=10)
    ap.add_argument("--seed", type=int, default=1)
    ap.add_argument("--w-bytes", type=float, default=(3e9 if cp is not None else 5e8), help="bytes of one mark-by-column weight chunk")
    ap.add_argument("--t-bytes", type=float, default=(6e9 if cp is not None else 4e8), help="bytes of the prime-by-row symbol table per row block")
    ap.add_argument("--b-bytes", type=float, default=(4e9 if cp is not None else 1.5e9), help="bytes of one column chunk (E, B)")
    ap.add_argument("--sym-elems", type=float, default=(4e8 if cp is not None else 1.2e7), help="symbol evaluations per call")
    ap.add_argument("--gs-chunk", type=float, default=(4e7 if cp is not None else 2e6), help="elements per batch of the cubic exponential sums")
    ap.add_argument("--host-gb", type=float, default=7.0)
    ap.add_argument("--ck-sec", type=float, default=600)
    ap.add_argument("--recheck-rows", type=int, default=24)
    ap.add_argument("--save-gram", action="store_true")
    a = ap.parse_args()
    a.t_bytes = int(a.t_bytes); a.b_bytes = int(a.b_bytes); a.gs_chunk = int(a.gs_chunk); a.w_bytes = int(a.w_bytes)
    os.makedirs(a.out, exist_ok=True)
    ls = [float(x) for x in a.ls.split(",")]
    done = set(); complete = set()
    rp = os.path.join(a.out, "results.jsonl")
    if os.path.exists(rp):
        for line in open(rp):
            try:
                d = json.loads(line)
                if d.get("complete"):
                    complete.add(float(d["Z"]))
                else:
                    done.add((float(d["Z"]), round(float(d["l"]), 6)))
            except Exception:
                pass
    a.done = done
    P(f"E1 start: device {'GPU (cupy)' if cp is not None else 'numpy'}; sizes {a.Z}; M={a.M}; l={ls}; out={a.out}")
    for zs in a.Z.split(","):
        Z = float(zs)
        if Z in complete:
            P(f"Z={Z:g}: already in results.jsonl, skipped"); continue
        try:
            S = Size(Z, a.M, ls, a)
            if S.n == 0:
                continue
            S.run()
            del S
        except SystemExit as ex:                                        # a size refused by its memory plan does not end the queue
            P(f"Z={Z:g}: size not run: {ex}")
        if cp is not None:
            cp.get_default_memory_pool().free_all_blocks()
    P("E1 ALLDONE")


if __name__ == "__main__":
    main()
