#!/usr/bin/env python3
"""Mark Gram matrix G of n1-maass-selberg-norm (rownorm.py), built from the marked columns only.

x_p(m) = sum_{c sf primary, (c,2)=1, p | c} coef(c) chi6_c(m)^k q_c^{-1/2} W(q_c / X),  X = Z^(1+l),
G = X X^* (n x n, n = number of slot primes of norm in [Z^l, 2 Z^l]),  rows m primary, (m,2)=1, Z^M/4 < q_m <= Z^M.
Columns are enumerated as c = p c' (twisted multiplicativity), c' squarefree primary of norm <= Z.
Variants: Ap (manuscript row: gamma_2 conj-alpha chi6), K (gamma_2 chi6^4: Kubota row, pole control),
          R (random unimodular coefficient per column: generic control).
Usage: gram.py Z M l [seed]   -> gram_Z{Z}_M{M}_l{l}.npz
"""
import sys, math, cmath, time, os
import numpy as np

Z = float(sys.argv[1]); M = float(sys.argv[2]); L = float(sys.argv[3])
seed = int(sys.argv[4]) if len(sys.argv) > 4 else 1
rng = np.random.default_rng(seed)
t0 = time.time()
HERE = os.path.dirname(os.path.abspath(__file__))
X = Z ** (1 + L)
PLO, PHI = Z ** L, 2 * Z ** L
NMAX = int(max(Z ** M, PHI, Z)) + 1
Z6 = np.exp(-1j * math.pi * np.arange(6) / 3)


def norm(x):
    a, b = x
    return a * a - a * b + b * b


def primary_elements(nmax):
    out = []
    r = int(math.isqrt(4 * nmax // 3)) + 3
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


def powpair(u, v, e, q):
    ru, rv = np.ones_like(u), np.zeros_like(v)
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
            vu, vv = (-(vu * 0 - vv * 1)) % q, (-(vu * 1 + vv * 0 - vv * 1)) % q
        out[((U % q) == 0) & ((V % q) == 0)] = -1
    return out


def gauss_prime(P):
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


els = primary_elements(NMAX)
primes = []; by_rat = {}
for n, a, b in els:
    if b != 0 and is_prime(n):
        r = (-a * pow(b, -1, n)) % n
        primes.append(dict(el=(a, b), N=n, kind="s", p=n, r=r)); by_rat.setdefault(n, []).append(len(primes) - 1)
    elif b == 0 and a < 0 and is_prime(-a) and (-a) % 3 == 2 and a != -2:
        primes.append(dict(el=(a, b), N=n, kind="i", p=-a, r=None)); by_rat.setdefault(-a, []).append(len(primes) - 1)
print(f"Z={Z:g} M={M} l={L} X={X:.0f} NMAX={NMAX} elements={len(els)} primes={len(primes)}", flush=True)

RLO, RHI = Z ** M / 4, Z ** M
rows = [(a, b) for n, a, b in els if RLO < n <= RHI and not (a % 2 == 0 and b % 2 == 0)]
U = np.array([x[0] for x in rows], dtype=np.int64); V = np.array([x[1] for x in rows], dtype=np.int64)
R = len(rows)
slot = [i for i, P in enumerate(primes) if PLO <= P["N"] <= PHI]
n = len(slot)
small = [i for i, P in enumerate(primes) if P["N"] <= Z]
print(f"rows R={R}  marks n={n}  small primes={len(small)}", flush=True)

# Gauss sums for small and slot primes
Gs = {}
for i in sorted(set(small) | set(slot)):
    Gs[i] = gauss_prime(primes[i])
print(f"gauss sums done {time.time() - t0:.1f}s max||g|-1|={max(abs(abs(v) - 1) for v in Gs.values()):.2e}", flush=True)

spf = list(range(NMAX + 1))
for i in range(2, int(NMAX ** 0.5) + 1):
    if spf[i] == i:
        for k in range(i * i, NMAX + 1, i):
            if spf[k] == k:
                spf[k] = i


def factor(c, nn):
    idx = []
    while nn > 1:
        p = spf[nn]; e = 0
        while nn % p == 0:
            nn //= p; e += 1
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


def bump(x):
    t = (x - 0.6) / 0.4
    return np.where(np.abs(t) < 1, np.exp(1 - 1 / np.maximum(1 - t * t, 1e-300)), 0.0)


# cofactors c'
cof = []
for nn, a, b in els:
    if nn == 1 or nn > X / PLO or nn < 0.2 * X / PHI:
        continue
    idx = factor((a, b), nn)
    if idx is None:
        continue
    cof.append((nn, a, b, idx))
Cn = len(cof)
plan = (Cn * R * 16 * 2 + n * R * 16 * 3 + n * Cn * 16 * 2 + n * n * 16 * 3 + (len(small) + n) * R) / 1e9
print(f"cofactors c': {Cn}; planned allocation: B {Cn}x{R} c128 x2 (two characters), X {n}x{R} c128 x3, "
      f"W {n}x{Cn} c128 x2, G {n}x{n} c128 x3, int8 tables: total {plan:.2f} GB", flush=True)
if plan > 4.0:
    sys.exit("planned allocation above 4 GB: reduce Z")

sm_pos = {i: k for k, i in enumerate(small)}
T = np.empty((len(small), R), dtype=np.int8)
for k, i in enumerate(small):
    T[k] = chi6_table(primes[i], U, V)
SU = np.array([primes[i]["el"][0] for i in slot], dtype=np.int64); SV = np.array([primes[i]["el"][1] for i in slot], dtype=np.int64)
T2 = np.empty((len(small), n), dtype=np.int8)        # chi6_q(p), q small prime, p slot prime
for k, i in enumerate(small):
    T2[k] = chi6_table(primes[i], SU, SV)
print(f"symbol tables done {time.time() - t0:.1f}s", flush=True)

CU = np.array([c[1] for c in cof], dtype=np.int64); CV = np.array([c[2] for c in cof], dtype=np.int64)
CN = np.array([c[0] for c in cof], dtype=float)
gC = np.empty(Cn, dtype=complex)                    # gamma_2(c')
E = np.empty((Cn, R), dtype=np.int8); bad = np.zeros((Cn, R), dtype=bool)
E2 = np.zeros((Cn, n), dtype=np.int16); bad2 = np.zeros((Cn, n), dtype=bool)   # chi6_{c'}(p)
pair_cache = {}
for ci, (nn, a, b, idx) in enumerate(cof):
    g = 1 + 0j
    for i in idx:
        g *= Gs[i]
    for s in range(len(idx)):
        for t in range(s + 1, len(idx)):
            key = (idx[s], idx[t])
            if key not in pair_cache:
                P1, P2 = primes[idx[s]], primes[idx[t]]
                j1 = int(chi6_table(P1, np.array([P2["el"][0]]), np.array([P2["el"][1]]))[0])
                j2 = int(chi6_table(P2, np.array([P1["el"][0]]), np.array([P1["el"][1]]))[0])
                pair_cache[key] = Z6[(2 * (j1 + j2)) % 6]
            g *= pair_cache[key]
    gC[ci] = g
    e = np.zeros(R, dtype=np.int16)
    for i in idx:
        t = T[sm_pos[i]]; bad[ci] |= t < 0; e += t
        t2 = T2[sm_pos[i]]; bad2[ci] |= t2 < 0; E2[ci] += t2
    E[ci] = e % 6
alC = (CU - CV / 2 + 1j * CV * math.sqrt(3) / 2) / np.sqrt(CN)
good = (~bad).astype(float)
print(f"cofactor data done {time.time() - t0:.1f}s", flush=True)

# slot-prime data
Np = np.array([primes[i]["N"] for i in slot], dtype=float)
gP = np.array([Gs[i] for i in slot]); alP = (SU - SV / 2 + 1j * SV * math.sqrt(3) / 2) / np.sqrt(Np)
EP = np.empty((n, R), dtype=np.int8); E1 = np.empty((n, Cn), dtype=np.int16)      # chi6_p(m), chi6_p(c')
for k, i in enumerate(slot):
    EP[k] = chi6_table(primes[i], U, V)
    E1[k] = chi6_table(primes[i], CU, CV)
cop = (E1 >= 0) & (~bad2.T)                                   # p coprime to c'
Wt = bump(np.outer(Np, CN) / X) / np.sqrt(np.outer(Np, CN)) * cop
tw = Z6[(2 * (E1 + E2.T)) % 6]
Dp = (Wt ** 2).sum(axis=1)                                    # sum_c 1_{p|c} |b_c|^2  (lane's Dp diagonal)
goodP = (EP >= 0).astype(float)

out = {}
for name, k, e in [("Ap", 1, -1), ("K", 4, 0), ("R", 1, 0)]:
    B = Z6[(k * E.astype(np.int64)) % 6] * good
    if name == "R":
        W = Wt * np.exp(2j * math.pi * rng.random((n, Cn)))
        Xm = (W @ B) * (Z6[(k * EP.astype(np.int64)) % 6] * goodP)
    else:
        W = Wt * tw * (gC * alC ** e)[None, :]
        Xm = (W @ B) * ((gP * alP ** e)[:, None] * Z6[(k * EP.astype(np.int64)) % 6] * goodP)
    G = Xm @ Xm.conj().T
    G = (G + G.conj().T) / 2
    Gn = G / R / np.sqrt(np.outer(Dp, Dp))
    ev = np.linalg.eigvalsh(Gn)
    off = Gn - np.diag(np.diag(Gn))
    print(f"  {name:2s}: lane-normalised Gram: diag_mean={np.real(np.diag(Gn)).mean():.6f} off_rms={np.sqrt((np.abs(off) ** 2).mean()):.6f} "
          f"eig[min,max]=[{ev[0]:.6f},{ev[-1]:.6f}]", flush=True)
    out["G_" + name] = G
np.savez(os.path.join(HERE, f"gram_Z{int(Z)}_M{M}_l{L:.3f}.npz"), Np=Np, SU=SU, SV=SV, Dp=Dp, R=R, Cn=Cn,
         kind=np.array([primes[i]["kind"] == "s" for i in slot]), **out)
print(f"total {time.time() - t0:.1f}s", flush=True)
