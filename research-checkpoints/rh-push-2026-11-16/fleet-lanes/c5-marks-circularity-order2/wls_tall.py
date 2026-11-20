#!/usr/bin/env python3
"""c5-marks-circularity-order2: two-scale test of Conjecture WLS-tall (RESULT.md section 5).
Code copied and adapted from push/n2-kloss-sdp-certificate/gram.py (definitions of rows, columns, coefficients
unchanged); the change is that rows are processed in chunks and nothing of size cofactors x rows is kept.

x_p(m) = sum_{c = p c', c' sf primary, (c',2)=1} coef(c) chi6_c(m)^k q_c^{-1/2} W(q_c/X),  X = Z^(1+l)
G = sum_m x(m) x(m)^*  (n x n; n = slot primes of norm in [Z^l, 2 Z^l]); rows m primary, (m,2)=1, Z^M/4 < q_m <= Z^M.
Tall geometry: M > 1 + l (more rows than columns).
Reported:  one = 1^T G 1 / tr G   (the mark sum with coefficients a_p = 1: the quantity k measures)
           lam = n lambda_max(G) / tr G   (upper bound for sup over |a_p| <= 1 of a^* G a / tr G)
           dia = tr G / (R sum_p D_p)     (diagonal check; D_p = sum_{c: p|c} |b_c|^2)
Variants: Ap (manuscript row: gamma_2 conj-alpha chi6), K (gamma_2 chi6^4: Kubota row, pole control),
          R (random unimodular coefficient per column).
Usage: wls_tall.py Z M l [seed]
"""
import sys, math, time, os, json
import numpy as np

Z = float(sys.argv[1]); M = float(sys.argv[2]); L = float(sys.argv[3])
seed = int(sys.argv[4]) if len(sys.argv) > 4 else 1
rng = np.random.default_rng(seed)
t0 = time.time()
HERE = os.path.dirname(os.path.abspath(__file__))
X = Z ** (1 + L)
PLO, PHI = Z ** L, 2 * Z ** L
NMAX = int(max(Z ** M, PHI, Z)) + 1
PMAX = int(max(PHI, Z)) + 1
Z6 = np.exp(-1j * math.pi * np.arange(6) / 3)
CH = 16384

def primary_elements(nmax):
    r = int(math.isqrt(4 * nmax // 3)) + 3
    a0 = -r
    while a0 % 3 != 1: a0 += 1
    b0 = -r
    while b0 % 3 != 0: b0 += 1
    A = np.arange(a0, r + 1, 3, dtype=np.int64); Bv = np.arange(b0, r + 1, 3, dtype=np.int64)
    print(f"planned allocation: element grid {len(A)}x{len(Bv)} int64 x3 = {len(A)*len(Bv)*24/1e9:.2f} GB", flush=True)
    AA, BB = np.meshgrid(A, Bv, indexing="ij")
    NN = AA * AA - AA * BB + BB * BB
    ok = (NN > 0) & (NN <= nmax)
    n = NN[ok]; a = AA[ok]; b = BB[ok]
    o = np.lexsort((b, a, n))
    return n[o], a[o], b[o]

def is_prime(n):
    if n < 2: return False
    i = 2
    while i * i <= n:
        if n % i == 0: return False
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
        if e & 1: r = (r * b) % p
        b = (b * b) % p
        e >>= 1
    return r

_tab = {}
def chi6_table(P, U, V):
    """class j with chi6_P(u + v omega) = zeta6^j ; -1 if not coprime. Split primes: lookup table of size p."""
    if P["kind"] == "s":
        p, r = P["p"], P["r"]
        key = (p, r)
        if key not in _tab:
            x = np.arange(p, dtype=np.int64)
            t = powmod_arr(x, (p - 1) // 6, p)
            tb = np.full(p, -1, dtype=np.int8)
            val = 1
            for j in range(6):
                tb[t == val] = j
                val = (val * (-r)) % p
            tb[0] = -1
            if len(_tab) > 4000: _tab.clear()
            _tab[key] = tb
        return _tab[key][(U + V * r) % p]
    out = np.full(U.shape, -1, dtype=np.int8)
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

eN, eA, eB = primary_elements(NMAX)
primes = []; by_rat = {}
for n, a, b in zip(eN.tolist(), eA.tolist(), eB.tolist()):
    if n > PMAX: break
    if b != 0 and is_prime(n):
        r = (-a * pow(b, -1, n)) % n
        primes.append(dict(el=(a, b), N=n, kind="s", p=n, r=r)); by_rat.setdefault(n, []).append(len(primes) - 1)
    elif b == 0 and a < 0 and is_prime(-a) and (-a) % 3 == 2 and a != -2:
        primes.append(dict(el=(a, b), N=n, kind="i", p=-a, r=None)); by_rat.setdefault(-a, []).append(len(primes) - 1)
RLO, RHI = Z ** M / 4, Z ** M
rsel = (eN > RLO) & (eN <= RHI) & ~((eA % 2 == 0) & (eB % 2 == 0))
U = eA[rsel].copy(); V = eB[rsel].copy(); R = len(U)
slot = [i for i, P in enumerate(primes) if PLO <= P["N"] <= PHI]
n = len(slot)
small = [i for i, P in enumerate(primes) if P["N"] <= Z]
print(f"Z={Z:g} M={M} l={L} X={X:.0f} rows R={R} marks n={n} small primes={len(small)} "
      f"columns/rows ~ {n}*cof/R", flush=True)
Gs = {i: gauss_prime(primes[i]) for i in sorted(set(small) | set(slot))}
print(f"gauss sums done {time.time() - t0:.1f}s max||g|-1|={max(abs(abs(v) - 1) for v in Gs.values()):.2e}", flush=True)

def factor(c, nn):
    idx = []
    for p in sorted(by_rat):
        if p > nn: break
        e = 0
        q = p if primes[by_rat[p][0]]["kind"] == "s" else p
        while nn % p == 0:
            nn //= p; e += 1
        if e == 0: continue
        if p % 3 == 2:
            if e != 2: return None
            idx.append(by_rat[p][0])
        else:
            hit = [i for i in by_rat[p] if (c[0] + c[1] * primes[i]["r"]) % p == 0]
            if len(hit) != e: return None
            idx.extend(hit)
    if nn != 1: return None        # divisible by 2, 3 or a prime outside the table
    return idx

def bump(x):
    t = (x - 0.6) / 0.4
    return np.where(np.abs(t) < 1, np.exp(1 - 1 / np.maximum(1 - t * t, 1e-300)), 0.0)

cof = []
for nn, a, b in zip(eN.tolist(), eA.tolist(), eB.tolist()):
    if nn > X / PLO: break
    if nn == 1 or nn < 0.2 * X / PHI: continue
    idx = factor((a, b), nn)
    if idx is None: continue
    cof.append((nn, a, b, idx))
Cn = len(cof)
plan = (Cn * CH * 16 * 2 + n * CH * 16 * 3 + n * Cn * 16 * 3 + n * n * 16 * 4 + (len(small) + n) * CH) / 1e9
print(f"cofactors c': {Cn}; columns {n*Cn}; planned allocation per chunk of {CH} rows: {plan:.2f} GB", flush=True)
if plan > 4.0: sys.exit("planned allocation above 4 GB")

SU = np.array([primes[i]["el"][0] for i in slot], dtype=np.int64); SV = np.array([primes[i]["el"][1] for i in slot], dtype=np.int64)
T2 = np.empty((len(small), n), dtype=np.int8)
for k, i in enumerate(small): T2[k] = chi6_table(primes[i], SU, SV)
sm_pos = {i: k for k, i in enumerate(small)}
CU = np.array([c[1] for c in cof], dtype=np.int64); CV = np.array([c[2] for c in cof], dtype=np.int64)
CN = np.array([c[0] for c in cof], dtype=float)
gC = np.empty(Cn, dtype=complex)
E2 = np.zeros((Cn, n), dtype=np.int16); bad2 = np.zeros((Cn, n), dtype=bool)
pair_cache = {}
for ci, (nn, a, b, idx) in enumerate(cof):
    g = 1 + 0j
    for i in idx: g *= Gs[i]
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
    for i in idx:
        t2 = T2[sm_pos[i]]; bad2[ci] |= t2 < 0; E2[ci] += t2
alC = (CU - CV / 2 + 1j * CV * math.sqrt(3) / 2) / np.sqrt(CN)
Np = np.array([primes[i]["N"] for i in slot], dtype=float)
gP = np.array([Gs[i] for i in slot]); alP = (SU - SV / 2 + 1j * SV * math.sqrt(3) / 2) / np.sqrt(Np)
E1 = np.empty((n, Cn), dtype=np.int16)
for k, i in enumerate(slot): E1[k] = chi6_table(primes[i], CU, CV)
cop = (E1 >= 0) & (~bad2.T)
Wt = bump(np.outer(Np, CN) / X) / np.sqrt(np.outer(Np, CN)) * cop
tw = Z6[(2 * (E1 + E2.T)) % 6]
Dp = (Wt ** 2).sum(axis=1)
Wv = {"Ap": (Wt * tw * (gC * alC ** -1)[None, :], gP * alP ** -1, 1),
      "K": (Wt * tw * gC[None, :], gP, 4),
      "R": (Wt * np.exp(2j * math.pi * rng.random((n, Cn))), np.ones(n, dtype=complex), 1)}
G = {k: np.zeros((n, n), dtype=complex) for k in Wv}
rowmax = {k: 0.0 for k in Wv}
print(f"setup done {time.time() - t0:.1f}s", flush=True)
for s in range(0, R, CH):
    u = U[s:s + CH]; v = V[s:s + CH]; r = len(u)
    E = np.zeros((Cn, r), dtype=np.int16); bad = np.zeros((Cn, r), dtype=bool)
    Tm = {}
    for i in small: Tm[i] = chi6_table(primes[i], u, v)
    for ci, c in enumerate(cof):
        for i in c[3]:
            t = Tm[i]; bad[ci] |= t < 0; E[ci] += t
    E %= 6
    good = (~bad).astype(float)
    EP = np.empty((n, r), dtype=np.int8)
    for k, i in enumerate(slot): EP[k] = chi6_table(primes[i], u, v)
    goodP = (EP >= 0).astype(float)
    for name, (W, pc, kk) in Wv.items():
        Bm = Z6[(kk * E.astype(np.int64)) % 6] * good
        Xm = (W @ Bm) * (pc[:, None] * Z6[(kk * EP.astype(np.int64)) % 6] * goodP)
        G[name] += Xm @ Xm.conj().T
        rowmax[name] = max(rowmax[name], float((np.abs(Xm.sum(axis=0)) ** 2).max()))
    if (s // CH) % 20 == 0: print(f"  rows {s + r}/{R}  {time.time() - t0:.1f}s", flush=True)
res = dict(Z=Z, M=M, l=L, R=R, n=n, Cn=Cn, columns=n * Cn, sumD=float(Dp.sum()))
for name in Wv:
    g = (G[name] + G[name].conj().T) / 2
    tr = float(np.real(np.trace(g)))
    one = float(np.real(g.sum())) / tr
    lam = float(np.linalg.eigvalsh(g)[-1]) * n / tr
    dia = tr / (R * float(Dp.sum()))
    res[name] = dict(one=one, lam=lam, dia=dia, rowmax_over_mean=rowmax[name] * R / float(np.real(g.sum())))
    print(f"  {name:2s}: one={one:.5f}  lam={lam:.5f}  dia={dia:.5f}  max_m|x(m)|^2/mean={res[name]['rowmax_over_mean']:.2f}", flush=True)
res["generic"] = (1 + math.sqrt(n / R)) ** 2
json.dump(res, open(os.path.join(HERE, f"wls_Z{int(Z)}_M{M}_l{L}.json"), "w"), indent=1)
print(f"total {time.time() - t0:.1f}s", flush=True)
