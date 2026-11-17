#!/usr/bin/env python3
"""Marked / unmarked row norms of twisted cubic-theta sums over Z[omega].

Model of manuscript (5.30) and (14.2) without the cube completion (n = b = 1):
  C(X; m)   = sum_{c sf primary, (c,2)=1} coef(c) chi6_c(m)^k q_c^{-1/2} W(q_c/X)
  x_p(X; m) = same sum restricted to p | c           (one slot prime p)
  B_m       = sum_p a_p x_p(X; m)                    (marked row, X = Z^{1+l})
coef(c) = gt3(c) alpha(c)^e, gt3 = normalised cubic Gauss sum (manuscript gamma_2), alpha(c) = c/|c|.
Rows m: primary elements with Z^M/4 < q_m <= Z^M.
Usage: rownorm.py Z M l [seed]
Planned allocations are printed before they are made.
"""
import sys, math, cmath, json, time
import numpy as np

Z = float(sys.argv[1]); M = float(sys.argv[2]); L = float(sys.argv[3])
seed = int(sys.argv[4]) if len(sys.argv) > 4 else 1
rng = np.random.default_rng(seed)
t0 = time.time()

XM = Z ** (1 + L)                 # marked completed length
XS = [("N=M/2", Z ** (M / 2)), ("N=3M/4", Z ** (0.75 * M)), ("N=M", Z ** M), ("N=1+l", XM)]
NMAX = int(max(XM, Z ** M)) + 1
PLO, PHI = Z ** L, 2 * Z ** L     # slot

Z6 = np.exp(-1j * math.pi * np.arange(6) / 3)   # (-omega)^j


def mul(x, y):
    a, b = x; c, d = y
    return (a * c - b * d, a * d + b * c - b * d)


def norm(x):
    a, b = x
    return a * a - a * b + b * b


def primary_elements(nmax):
    out = []
    r = int(math.isqrt(4 * nmax // 3)) + 3
    for b in range(-(r // 3) * 3, r + 1, 3):
        for a in range(-r - (-r - 1) % 3, r + 1, 3):   # a = 1 mod 3
            pass
    # explicit loops (a = 1 mod 3, b = 0 mod 3)
    a0 = -r
    while a0 % 3 != 1:
        a0 += 1
    b0 = -r
    while b0 % 3 != 0:
        b0 += 1
    for a in range(a0, r + 1, 3):
        for b in range(b0, r + 1, 3):
            n = a * a - a * b + b * b
            if 0 < n <= nmax:
                out.append((n, a, b))
    out.sort()
    return out


def is_prime(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True


els = primary_elements(NMAX)
print(f"Z={Z:g} M={M} l={L} NMAX={NMAX} primary elements={len(els)}", flush=True)

# ---- primes (primary generators), excluding 2 and lambda
primes = []          # dicts: el, N, kind, p, r
by_rat = {}
for n, a, b in els:
    if b != 0 and is_prime(n):                      # split, n = 1 mod 3
        r = (-a * pow(b, -1, n)) % n
        primes.append(dict(el=(a, b), N=n, kind="s", p=n, r=r))
        by_rat.setdefault(n, []).append(len(primes) - 1)
    elif b == 0 and a < 0 and is_prime(-a) and (-a) % 3 == 2 and a != -2:
        primes.append(dict(el=(a, b), N=n, kind="i", p=-a, r=None))
        by_rat.setdefault(-a, []).append(len(primes) - 1)
print(f"primes: {len(primes)}", flush=True)


def powpair(u, v, e, q):
    """(u + v omega)^e in F_q[omega], arrays or ints."""
    ru, rv = (np.ones_like(u), np.zeros_like(v)) if isinstance(u, np.ndarray) else (1, 0)
    bu, bv = u % q, v % q
    while e:
        if e & 1:
            ru, rv = (ru * bu - rv * bv) % q, (ru * bv + rv * bu - rv * bv) % q
        bu, bv = (bu * bu - bv * bv) % q, (2 * bu * bv - bv * bv) % q
        e >>= 1
    return ru, rv


def powmod_arr(x, e, p):
    r = np.ones_like(x); b = x % p
    while e:
        if e & 1:
            r = (r * b) % p
        b = (b * b) % p
        e >>= 1
    return r


def chi6_table(P, U, V):
    """sextic symbol exponent j (value (-omega)^j) of rows (U,V) at prime P; -1 if not coprime."""
    out = np.full(U.shape, -1, dtype=np.int8)
    if P["kind"] == "s":
        p, r = P["p"], P["r"]
        x = (U + V * r) % p
        t = powmod_arr(x, (p - 1) // 6, p)
        val = 1
        for j in range(6):
            out[t == val] = j
            val = (val * (-r)) % p
        out[x == 0] = -1
    else:
        q = P["p"]
        tu, tv = powpair(U, V, (q * q - 1) // 6, q)
        vu, vv = 1, 0
        for j in range(6):
            out[(tu == vu) & (tv == vv)] = j
            vu, vv = (-(vu * 0 - vv * 1)) % q, (-(vu * 1 + vv * 0 - vv * 1)) % q   # times -omega
        out[((U % q) == 0) & ((V % q) == 0)] = -1
    return out


def chi6_scalar(P, x):
    u = np.array([x[0]], dtype=np.int64); v = np.array([x[1]], dtype=np.int64)
    return int(chi6_table(P, u, v)[0])


def gauss_prime(P):
    """normalised cubic Gauss sum sum_x chi3_P(x) e(Tr(x/P)) / sqrt(N)."""
    a, b = P["el"]
    if P["kind"] == "s":
        p = P["p"]
        x = np.arange(1, p, dtype=np.int64)
        t = powmod_arr(x, (p - 1) // 3, p)
        r = P["r"]
        ph = np.zeros(p - 1)
        ph[t == r] = 1.0
        ph[t == (r * r) % p] = 2.0
        ang = 2 * math.pi * (ph / 3.0 + ((x * ((2 * a - b) % p)) % p) / p)
        return complex(np.exp(1j * ang).sum()) / math.sqrt(p)
    q = P["p"]
    u, v = np.meshgrid(np.arange(q, dtype=np.int64), np.arange(q, dtype=np.int64), indexing="ij")
    u = u.ravel(); v = v.ravel()
    j = chi6_table(P, u, v).astype(np.int64)
    ok = j >= 0
    val = Z6[(2 * j[ok]) % 6]
    ang = 2 * math.pi * (-(2 * u[ok] - v[ok]) % q) / q
    return complex((val * np.exp(1j * ang)).sum()) / q


# ---- rows
RLO, RHI = Z ** M / 4, Z ** M
rows = [(a, b) for n, a, b in els if RLO < n <= RHI and not (a % 2 == 0 and b % 2 == 0)]   # rows coprime to 2
U = np.array([x[0] for x in rows], dtype=np.int64); V = np.array([x[1] for x in rows], dtype=np.int64)
R = len(rows)
print(f"rows: {R} (norm in ({RLO:.0f},{RHI:.0f}])", flush=True)
print(f"planned: symbol table {len(primes)} x {R} int8 = {len(primes) * R / 1e6:.1f} MB", flush=True)
T = np.empty((len(primes), R), dtype=np.int8)
for i, P in enumerate(primes):
    T[i] = chi6_table(P, U, V)
print(f"symbol table done {time.time() - t0:.1f}s", flush=True)

# ---- prime Gauss sums (conjugate pairs share work)
G = np.zeros(len(primes), dtype=complex)
done = {}
for i, P in enumerate(primes):
    a, b = P["el"]
    cj = (a - b, -b)                       # conjugate of a + b omega
    if P["kind"] == "s" and cj in done and P["N"] > 400:
        G[i] = G[done[cj]].conjugate()
    else:
        G[i] = gauss_prime(P)
    done[(a, b)] = i
print(f"gauss sums done {time.time() - t0:.1f}s  max||g|-1|={np.abs(np.abs(G) - 1).max():.2e}", flush=True)
# identify alpha: g^3 = mu(p) alpha(p)?
al = np.array([complex(P["el"][0] - P["el"][1] / 2, P["el"][1] * math.sqrt(3) / 2) for P in primes])
al = al / np.abs(al)
d1 = np.abs(G ** 3 + al).max(); d2 = np.abs(G ** 3 + al.conjugate()).max()
print(f"check g^3 = -alpha: max dev with alpha=c/|c|: {d1:.2e}; with conj: {d2:.2e}", flush=True)

# ---- self-test of twisted multiplicativity on a composite c = p1 p2 (brute force)
def selftest():
    sp = [P for P in primes if P["kind"] == "s" and P["N"] < 80]
    worst = 0.0
    for (i, j) in [(0, 2), (1, 4), (0, 5), (3, 6)]:
        if j >= len(sp) or sp[i]["p"] == sp[j]["p"]:
            continue
        P1, P2 = sp[i], sp[j]
        c = mul(P1["el"], P2["el"]); n = norm(c)
        tot = 0j
        for x in range(1, n):
            j1 = chi6_scalar(P1, (x, 0)); j2 = chi6_scalar(P2, (x, 0))
            if j1 < 0 or j2 < 0:
                continue
            tot += Z6[(2 * (j1 + j2)) % 6] * cmath.exp(2j * math.pi * x * (2 * c[0] - c[1]) / n)
        tot /= math.sqrt(n)
        g1 = G[primes.index(P1)]; g2 = G[primes.index(P2)]
        tw = Z6[(2 * (chi6_scalar(P1, P2["el"]) + chi6_scalar(P2, P1["el"]))) % 6]
        worst = max(worst, abs(tot - g1 * g2 * tw))
    return worst
print(f"selftest composite Gauss sum (brute force vs twisted multiplicativity): max dev {selftest():.2e}", flush=True)

# ---- columns: factor, Gauss sum, accumulate
spf = list(range(NMAX + 1))
for i in range(2, int(NMAX ** 0.5) + 1):
    if spf[i] == i:
        for k in range(i * i, NMAX + 1, i):
            if spf[k] == k:
                spf[k] = i


def bump(x):
    t = (x - 0.6) / 0.4
    return math.exp(1 - 1 / (1 - t * t)) if abs(t) < 1 else 0.0


def factor(c, n):
    """prime indices of squarefree primary c coprime to 2, or None."""
    idx = []
    while n > 1:
        p = spf[n]; e = 0
        while n % p == 0:
            n //= p; e += 1
        if p == 2 or p == 3:
            return None
        if p % 3 == 2:
            if e != 2:
                return None
            idx.append(by_rat[p][0])
        else:
            hit = [i for i in by_rat[p] if (c[0] + c[1] * primes[i]["r"]) % p == 0]
            if len(hit) != e:
                return None
            idx.extend(hit)
    return idx


slot = [i for i, P in enumerate(primes) if PLO <= P["N"] <= PHI]
slotpos = {i: k for k, i in enumerate(slot)}
print(f"slot primes: {len(slot)} norms {[primes[i]['N'] for i in slot]}", flush=True)

VAR = [("A  gamma2*chi6      ", 1, 0, False),
       ("A' gamma2*abar*chi6 ", 1, -1, False),
       ("A+ gamma2*alpha*chi6", 1, 1, False),
       ("B  gamma2*chi6^5    ", 5, 0, False),
       ("K  gamma2*chi6^4 (Kubota index m: pole control)", 4, 0, False),
       ("R  random phase*chi6 (generic control)", 1, 0, True)]
nv = len(VAR)
Cun = np.zeros((nv, len(XS), R), dtype=complex)
Dun = np.zeros((nv, len(XS), R))
MV = [0, 1, 2, 5]                                  # variants carried for marks
Xp = np.zeros((len(MV), len(slot), R), dtype=complex)
Dp = np.zeros((len(slot), len(slot)))           # sum_c 1_{p|c} 1_{p'|c} |b_c|^2
ncol = 0
pair_cache = {}
for n, a, b in els:
    if n == 1 or n > NMAX:
        continue
    ws = [bump(n / X) for _, X in XS]
    if max(ws) == 0.0:
        continue
    idx = factor((a, b), n)
    if idx is None:
        continue
    ncol += 1
    g = 1 + 0j
    for i in idx:
        g *= G[i]
    for s in range(len(idx)):
        for t in range(s + 1, len(idx)):
            key = (idx[s], idx[t])
            if key not in pair_cache:
                pair_cache[key] = Z6[(2 * (chi6_scalar(primes[idx[s]], primes[idx[t]]["el"])
                                           + chi6_scalar(primes[idx[t]], primes[idx[s]]["el"]))) % 6]
            g *= pair_cache[key]
    E = T[idx[0]].astype(np.int16)
    bad = E < 0
    for i in idx[1:]:
        e2 = T[i]; bad |= e2 < 0; E = E + e2
    E = E % 6
    good = (~bad).astype(float)
    alpha = complex(a - b / 2, b * math.sqrt(3) / 2) / math.sqrt(n)
    rph = cmath.exp(2j * math.pi * rng.random())
    isn = 1 / math.sqrt(n)
    vecs = []
    for vi, (_, k, e, rnd) in enumerate(VAR):
        coef = rph if rnd else g * (alpha ** e)
        vec = coef * Z6[(k * E) % 6] * good
        vecs.append(vec)
        for xi, w in enumerate(ws):
            if w:
                Cun[vi, xi] += (w * isn) * vec
                Dun[vi, xi] += (w * w / n) * good
    wm = ws[-1]
    if wm:
        sl = [slotpos[i] for i in idx if i in slotpos]
        for s in sl:
            for mi, vi in enumerate(MV):
                Xp[mi, s] += (wm * isn) * vecs[vi]
            for s2 in sl:
                Dp[s, s2] += wm * wm / n
print(f"columns used: {ncol}  ({time.time() - t0:.1f}s)", flush=True)

sfrow = np.array([factor(x, norm(x)) is not None for x in rows])
print(f"squarefree rows: {int(sfrow.sum())} of {R}")
res = dict(Z=Z, M=M, l=L, rows=R, cols=ncol, slot=len(slot), unmarked=[], marked=[])
print("\nUNMARKED  ratio = mean_m |C|^2 / mean_m diag ; lemma 5.8 factor Z^(M-N)_+ ; classical factor Z^(2N-M)_+")
for vi, (name, *_r) in enumerate(VAR):
    for xi, (lab, X) in enumerate(XS):
        Nexp = math.log(X) / math.log(Z)
        ratio = float((np.abs(Cun[vi, xi]) ** 2).mean() / Dun[vi, xi].mean())
        mx = float((np.abs(Cun[vi, xi]) ** 2).max() / Dun[vi, xi].mean())
        rsf = float((np.abs(Cun[vi, xi][sfrow]) ** 2).mean() / Dun[vi, xi][sfrow].mean())
        print(f"  {name[:22]:22s} {lab:7s} X={X:9.0f} ratio={ratio:7.3f}  sf-rows={rsf:6.3f}  max-row={mx:8.2f}  "
              f"lemma={Z ** max(M - Nexp, 0):7.2f}  classical={Z ** max(2 * Nexp - M, 0):9.1f}")
        res["unmarked"].append(dict(var=name.strip(), N=Nexp, ratio=ratio, ratio_sf=rsf, maxrow=mx))

print(f"\nMARKED  X=Z^(1+l)={XM:.0f}  K-loss factor Z^(M+l-1)_+ = {Z ** max(M + L - 1, 0):.2f}  marks={len(slot)}  "
      f"MP edge (1+sqrt(P/R))^2 = {(1 + math.sqrt(len(slot) / R)) ** 2:.3f}")
dn = np.sqrt(np.outer(np.diag(Dp), np.diag(Dp)))
for mi, vi in enumerate(MV):
    X_ = Xp[mi]
    Gm = (X_ @ X_.conj().T) / R
    Gn = Gm / dn
    ev = np.linalg.eigvalsh(Gn)
    off = Gn - np.diag(np.diag(Gn))
    out = dict(var=VAR[vi][0].strip(), eig_min=float(ev[0]), eig_max=float(ev[-1]),
               diag_mean=float(np.real(np.diag(Gn)).mean()), off_rms=float(np.sqrt((np.abs(off) ** 2).mean())))
    line = (f"  {VAR[vi][0][:22]:22s} diag={out['diag_mean']:.3f} off_rms={out['off_rms']:.4f} "
            f"eig[min,max]=[{ev[0]:.3f},{ev[-1]:.3f}]")
    for lab, avec in [("ones", np.ones(len(slot))), ("signs", rng.choice([-1.0, 1.0], len(slot))),
                      ("worst", None)]:
        if avec is None:
            w, v = np.linalg.eigh(Gm)
            avec = v[:, -1].conj() * math.sqrt(len(slot))
        Bm = avec @ X_
        dg = float(np.real(avec.conj() @ Dp @ avec))
        rr = float((np.abs(Bm) ** 2).mean() / dg)
        out["R_" + lab] = rr
        out["abs_" + lab] = float((np.abs(Bm) ** 2).mean())
        line += f"  R_{lab}={rr:.3f}"
    print(line)
    res["marked"].append(out)
print(f"total {time.time() - t0:.1f}s")
json.dump(res, open(f"{sys.argv[0].rsplit('/', 1)[0]}/rownorm_Z{int(Z)}_M{M}_l{L:.3f}.json", "w"), indent=1)
