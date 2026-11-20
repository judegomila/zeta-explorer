#!/usr/bin/env python3
"""e2-ms-slot-capacity: reduced model of manuscript Lemma 17.1 (Z[omega], sextic symbol, one prime slot).

Rows: primary u (u = 1 mod 3), 0 < N(u) <= U.   m = 1 (Z = U).
M_u = c_r * sum_{n sf primary, (n,2)=1} mu(n) chi_n(u) W(N(n)/U^r)        (c_r: coefficient l2 norm 1)
Q_u(a) = n^{-1/2} sum_{p split prime, U^z/4 < N(p) <= U^z} a_p chi_p(u)^k   (k = 1 sextic, 2 cubic, 3 quadratic)
I_w(a) = (1/R) sum_u w_u |Q_u(a)|^2 = a^* G_w a,   w_u = |M_u|^2 (mu), |R_u|^2 (random column coefficients), or 1.
Reports tr G_w (= average over random phases a), I(1), I(Gauss vectors), sup over unimodular a (monotone power
iteration: lower bound), n*lambda_max (upper bound).
Usage: slot.py U  "r,z,k;r,z,k;..."  [seed]
"""
import sys, math, json, time, os
import numpy as np

U = float(sys.argv[1]); CFG = [tuple(float(x) for x in c.split(",")) for c in sys.argv[2].split(";")]
seed = int(sys.argv[3]) if len(sys.argv) > 3 else 1
SF = len(sys.argv) > 4 and sys.argv[4] == "sf"      # rows restricted to squarefree u coprime to 6
rng = np.random.default_rng(seed)
t0 = time.time()
HERE = os.path.dirname(os.path.abspath(__file__))
Z6 = np.exp(-1j * math.pi * np.arange(6) / 3).astype(np.complex64)
NMAX = int(U) + 1


def primary_elements(nmax):
    out = []
    r = int(math.isqrt(4 * nmax // 3)) + 3
    a0 = -r
    while a0 % 3 != 1: a0 += 1
    b0 = -r
    while b0 % 3 != 0: b0 += 1
    a = np.arange(a0, r + 1, 3, dtype=np.int64)[:, None]; b = np.arange(b0, r + 1, 3, dtype=np.int64)[None, :]
    n = a * a - a * b + b * b
    ok = (n > 0) & (n <= nmax)
    A = np.broadcast_to(a, n.shape)[ok]; B = np.broadcast_to(b, n.shape)[ok]; N = n[ok]
    o = np.argsort(N, kind="stable")
    return N[o], A[o], B[o]


def powmod_arr(x, e, p):
    r = np.ones_like(x); b = x % p
    while e:
        if e & 1: r = (r * b) % p
        b = (b * b) % p
        e >>= 1
    return r


def powpair(u, v, e, q):
    ru, rv = np.ones_like(u), np.zeros_like(v)
    bu, bv = u % q, v % q
    while e:
        if e & 1: ru, rv = (ru * bu - rv * bv) % q, (ru * bv + rv * bu - rv * bv) % q
        bu, bv = (bu * bu - bv * bv) % q, (2 * bu * bv - bv * bv) % q
        e >>= 1
    return ru, rv


def chi6_table(P, Uu, Vv):
    """index j of the sextic symbol chi_P(u + v omega) (value Z6[j]); -1 if not coprime.  Same routine as
    n2-kloss-sdp-certificate/gram.py."""
    out = np.full(Uu.shape, -1, dtype=np.int8)
    if P["kind"] == "s":
        p, r = P["p"], P["r"]
        x = (Uu + Vv * r) % p
        t = powmod_arr(x, (p - 1) // 6, p)
        val = 1
        for j in range(6):
            out[t == val] = j
            val = (val * (-r)) % p
        out[x == 0] = -1
    else:
        q = P["p"]
        tu, tv = powpair(Uu, Vv, (q * q - 1) // 6, q)
        vu, vv = 1, 0
        for j in range(6):
            out[(tu == vu) & (tv == vv)] = j
            vu, vv = (-(vu * 0 - vv * 1)) % q, (-(vu * 1 + vv * 0 - vv * 1)) % q
        out[((Uu % q) == 0) & ((Vv % q) == 0)] = -1
    return out


def gauss_powers(P):
    """normalised Gauss sums g_j(p) = p^{-1/2} sum_x chi_p(x)^j e(x Tr(1/pi)), j = 1..5, split prime."""
    a, b = P["el"]; p = P["p"]
    x = np.arange(1, p, dtype=np.int64)
    idx = chi6_table(P, x, np.zeros_like(x)).astype(np.int64)
    add = np.exp(2j * math.pi * ((x * ((2 * a - b) % p)) % p) / p)
    return [complex((np.exp(-1j * math.pi * ((j * idx) % 6) / 3) * add).sum()) / math.sqrt(p) for j in range(1, 6)]


def bump(x):
    t = (x - 0.6) / 0.4
    return np.where(np.abs(t) < 1, np.exp(1 - 1 / np.maximum(1 - t * t, 1e-300)), 0.0)


EN, EA, EB = primary_elements(NMAX)
spf = np.arange(NMAX + 1)
for i in range(2, int(NMAX ** 0.5) + 1):
    if spf[i] == i:
        s = spf[i * i::i]; s[s == np.arange(i * i, NMAX + 1, i)] = i
RU, RV = EA, EB; R = len(EN)


def isprime(n): return n > 1 and spf[n] == n


# primes of Z[omega] (primary generators) of norm <= pmax, built lazily
def build_primes(pmax):
    pr = []; by_rat = {}
    k = np.searchsorted(EN, pmax, side="right")
    for n, a, b in zip(EN[:k].tolist(), EA[:k].tolist(), EB[:k].tolist()):
        if b != 0 and isprime(n):
            r = (-a * pow(b, -1, n)) % n
            pr.append(dict(el=(a, b), N=n, kind="s", p=n, r=r)); by_rat.setdefault(n, []).append(len(pr) - 1)
        elif b == 0 and a < 0 and isprime(-a) and (-a) % 3 == 2 and a != -2:
            pr.append(dict(el=(a, b), N=n, kind="i", p=-a, r=None)); by_rat.setdefault(-a, []).append(len(pr) - 1)
    return pr, by_rat


def factor(a, b, nn, primes, by_rat):
    idx = []
    while nn > 1:
        p = int(spf[nn]); e = 0
        while nn % p == 0: nn //= p; e += 1
        if p == 2 or p == 3: return None
        if p % 3 == 2:
            if e != 2: return None
            idx.append(by_rat[p][0])
        else:
            hit = [i for i in by_rat[p] if (a + b * primes[i]["r"]) % p == 0]
            if len(hit) != e: return None
            idx.extend(hit)
    return idx


if SF:
    _pr, _br = build_primes(NMAX)
    keep = np.array([(n == 1) or (factor(a, b, n, _pr, _br) is not None) for n, a, b in zip(EN.tolist(), EA.tolist(), EB.tolist())])
    RN, RU, RV = EN[keep], EA[keep], EB[keep]
else:
    RN = EN
R = len(RN)
print(f"U={U:g} rows R={R} ({'squarefree primary u coprime to 6' if SF else 'all primary u'}, N(u)<=U) t={time.time()-t0:.1f}s", flush=True)


def inverse_poly(r):
    """M_u (Moebius) and R_u (random unimodular column coefficients), both with coefficient l2 norm 1."""
    X = U ** r
    primes, by_rat = build_primes(int(X) + 1)
    print(f"  inverse r={r}: X={X:.1f} primes<=X: {len(primes)}; table {len(primes)}x{R} int8 = {len(primes)*R/1e9:.2f} GB", flush=True)
    T = np.empty((len(primes), R), dtype=np.int8)
    for k, P in enumerate(primes): T[k] = chi6_table(P, RU, RV)
    Mu = np.zeros(R, dtype=np.complex128); Ru = np.zeros(R, dtype=np.complex128); nrm = 0.0; ncol = 0
    k = np.searchsorted(EN, X, side="right")
    for n, a, b in zip(EN[:k].tolist(), EA[:k].tolist(), EB[:k].tolist()):
        w = float(bump(np.array(n / X)))
        if w == 0.0: continue
        if n == 1: idx = []
        else:
            idx = factor(a, b, n, primes, by_rat)
            if idx is None: continue
        e = np.zeros(R, dtype=np.int16); bad = np.zeros(R, dtype=bool)
        for i in idx: bad |= T[i] < 0; e += T[i]
        v = Z6[e % 6].astype(np.complex128); v[bad] = 0
        Mu += ((-1) ** len(idx)) * w * v
        Ru += np.exp(2j * math.pi * rng.random()) * w * v
        nrm += w * w; ncol += 1
    if ncol < 3: return None
    return Mu / math.sqrt(nrm), Ru / math.sqrt(nrm), ncol


def sup_unimodular(G, starts, iters=400):
    best = (-1.0, None, None)
    for name, a in starts:
        a = a / np.maximum(np.abs(a), 1e-300)
        val = float(np.real(np.vdot(a, G @ a)))
        for _ in range(iters):
            b = G @ a; b = b / np.maximum(np.abs(b), 1e-300)
            v2 = float(np.real(np.vdot(b, G @ b)))
            if v2 <= val * (1 + 1e-10): a = b; val = max(val, v2); break
            a, val = b, v2
        if val > best[0]: best = (val, name, a)
    return best


res = []
inv_cache = {}
for (r, z, k) in CFG:
    k = int(k)
    X = U ** z
    primes, _ = build_primes(int(X) + 1)
    marks = [P for P in primes if P["kind"] == "s" and X / 4 < P["N"] <= X]
    n = len(marks)
    mem = n * R * 8 * 2 / 1e9 + n * n * 16 * 4 / 1e9
    print(f"config r={r} z={z} k={k}: marks n={n} (split primes, {X/4:.1f} < N <= {X:.1f}); planned A {n}x{R} c64 x2 + G: {mem:.2f} GB", flush=True)
    if n < 2 or mem > 5.5:
        print("  skipped (too few marks or planned allocation above 5.5 GB)", flush=True); continue
    A = np.empty((n, R), dtype=np.complex64)
    for i, P in enumerate(marks):
        j = chi6_table(P, RU, RV).astype(np.int64)
        row = Z6[(k * j) % 6].copy(); row[j < 0] = 0
        A[i] = row
    gs = np.array([gauss_powers(P) for P in marks])            # n x 5
    weights = {"one": np.ones(R)}
    if r > 0:
        if r not in inv_cache: inv_cache[r] = inverse_poly(r)
        if inv_cache[r] is None:
            print("  skipped (fewer than 3 inverse columns)", flush=True); del A; continue
        Mu, Ru, ncol = inv_cache[r]
        print(f"  inverse columns: {ncol}", flush=True)
        weights = {"mu": np.abs(Mu) ** 2, "rand": np.abs(Ru) ** 2, "one": np.ones(R)}
    for wname, w in weights.items():
        Aw = A * w.astype(np.float32)[None, :]
        G = (Aw @ A.conj().T).astype(np.complex128) / (R * n)
        G = (G + G.conj().T) / 2
        tr = float(np.real(np.trace(G)))
        ev = np.linalg.eigvalsh(G)
        ones = np.ones(n, dtype=complex)
        starts = [("ones", ones)]
        gv = {}
        for j in range(5):
            g = gs[:, j] / np.abs(gs[:, j])
            for nm, vec in ((f"g{j+1}", g), (f"conj_g{j+1}", g.conj())):
                gv[nm] = float(np.real(np.vdot(vec, G @ vec))); starts.append((nm, vec))
        for s in range(6): starts.append((f"rand{s}", np.exp(2j * math.pi * rng.random(n))))
        sup, sname, amax = sup_unimodular(G, starts)
        I1 = float(np.real(np.vdot(ones, G @ ones)))
        bestg = max(gv, key=gv.get)
        ov = {nm: float(abs(np.vdot(vec / np.abs(vec), amax)) / n) for nm, vec in starts[:11]}
        # contribution of the heaviest rows to the maximiser
        q = np.abs(amax.astype(np.complex64) @ A) ** 2 * w / (R * n)
        top = np.argsort(q)[::-1][:5]
        toprows = [(int(RN[t]), int(RU[t]), int(RV[t]), float(q[t] / sup)) for t in top]
        # --- lane s6: coefficients a_p = a_F(N(p)) of the control battery on the mark primes
        pn = np.array([P["N"] for P in marks], dtype=np.int64)
        KAP = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
        def hb(x):
            x = (int(x) + 0x9E3779B97F4A7C15) & (2 ** 64 - 1); x = ((x ^ (x >> 30)) * 0xBF58476D1CE4E5B9) & (2 ** 64 - 1)
            x = ((x ^ (x >> 27)) * 0x94D049BB133111EB) & (2 ** 64 - 1); x ^= x >> 31; return (x >> 17) & 1
        ov_ = {"zeta": np.ones(n, complex), "chi4": np.array([0, 1, 0, -1])[pn % 4].astype(complex),
               "chi5": np.array([0, 1, -1, -1, 1])[pn % 5].astype(complex), "DH": np.array([0, 1, KAP, -KAP, -1])[pn % 5].astype(complex),
               "hash": np.array([1 - 2 * hb(q) for q in pn], dtype=complex), "liou": -np.ones(n, complex),
               "unimod": np.exp(-1j * 1.2393168126993495 * np.log(pn.astype(float))),
               "Ea25": (pn.astype(float) ** 0.25 + pn.astype(float) ** -0.25).astype(complex),
               "randphase": np.exp(2j * math.pi * np.random.default_rng(77).random(n))}
        Iobj = {}
        for nm_, vec in ov_.items():
            m2 = float(np.mean(np.abs(vec) ** 2)); Iv = float(np.real(np.vdot(vec, G @ vec)))
            Iobj[nm_] = dict(I=Iv, mean_abs2=m2, ratio_to_zeta=Iv / I1, pred=m2, norm=Iv / (m2 * tr) if m2 > 0 else None, mean_a=abs(complex(vec.mean())))
        print("    objects I(a_F)/(mean|a|^2 tr): " + " ".join(f"{k_}={v_['norm']:.3f}" for k_, v_ in Iobj.items()), flush=True)
        d = dict(U=U, r=r, z=z, k=k, w=wname, Iobj=Iobj, R=R, n=n, wmean=float(w.mean()), tr=tr, I_ones=I1, I_gauss=gv, best_gauss=bestg,
                 sup_lb=sup, sup_start=sname, sup_ub=float(n * ev[-1]), lam_max_n=float(n * ev[-1]), overlap=ov, toprows=toprows)
        res.append(d)
        print(f"  w={wname:4s} mean w={w.mean():.4f} tr={tr:.4f} | I(1)/tr={I1/tr:.3f} | best Gauss {bestg} I/tr={gv[bestg]/tr:.3f} | "
              f"sup/tr >= {sup/tr:.3f} (start {sname}) <= {n*ev[-1]/tr:.3f} | n/R={n/R:.4f} (1+sqrt(n/R))^2={(1+math.sqrt(n/R))**2:.3f} | "
              f"top row N={toprows[0][0]} share {toprows[0][3]:.3f} | max overlap {max(ov, key=ov.get)} {max(ov.values()):.3f} t={time.time()-t0:.0f}s", flush=True)
    del A
json.dump(res, open(os.path.join(HERE, f"slotobj_{'sf' if SF else 'all'}_U{int(U)}.json"), "w"))
print(f"total {time.time()-t0:.1f}s", flush=True)
