#!/usr/bin/env python3
"""Mark Gram matrices at large Z (c4-kloss-marks-scaleup). Same definition as n2-kloss-sdp-certificate/gram.py:
x_p(m) = sum_{c sf primary, (c,2)=1, p | c} coef(c) chi6_c(m)^k q_c^{-1/2} W(q_c / X),  X = Z^(1+l),  G = sum_m x_p(m) conj x_p'(m),
rows m primary, (m,2)=1, Z^M/4 < q_m <= Z^M; marks p prime, Z^l <= N(p) <= cslot Z^l (cslot = 2: the n2 slot).
Characters are exact (integer residue arithmetic in klib.c); Gauss sums and weights are float64.
Variants (coefficient system, character power k):
  Ap  gamma_2 conj-alpha, chi6        manuscript row
  K   gamma_2, chi6^4                 Kubota row (pole control)
  R   random unimodular per column, chi6
  K4a gamma_2 conj-alpha, chi6^4      (referee n2 E1)
  A   gamma_2, chi6                   (referee n2 E1)
  Q   gamma_2 conj-alpha, chi6^3      quadratic character with the manuscript coefficients
  QR  random unimodular, chi6^3       quadratic character, random coefficients
  Q0  coefficient 1, chi6^3           quadratic character sum
  T6  coefficient 1, chi6
  Rc / QRc / Rc4   random unimodular per column c (one value per column, shared by all marks dividing it), chi6 / chi6^3 / chi6^4
Usage: scale.py Z M l cslot out.npz [seed] [systems: full|lean]
"""
import sys, math, time, os, ctypes
import numpy as np

Z = float(sys.argv[1]); M = float(sys.argv[2]); L = float(sys.argv[3]); CS = float(sys.argv[4]); OUT = sys.argv[5]
seed = int(sys.argv[6]) if len(sys.argv) > 6 else 1
MODE = sys.argv[7] if len(sys.argv) > 7 else "full"
ALLG = len(sys.argv) > 8 and sys.argv[8] == "allgauss"
rng = np.random.default_rng(seed)
t0 = time.time()
HERE = os.path.dirname(os.path.abspath(__file__))
lib = ctypes.CDLL(os.path.join(HERE, os.environ.get("KLIB", "klib.so")))
P64 = np.ctypeslib.ndpointer(np.int64, flags="C"); P8 = np.ctypeslib.ndpointer(np.int8, flags="C")
P32 = np.ctypeslib.ndpointer(np.int32, flags="C"); PD = np.ctypeslib.ndpointer(np.float64, flags="C")
I64 = ctypes.c_int64
lib.chi6_pairs.argtypes = [I64, P64, P64, P64, P64, P8]
lib.gauss_split.argtypes = [I64, P64, P64, P64, PD, PD]
lib.kern.argtypes = [I64, I64, I64, P64, P64, I64, P8, P64, P64, P64, P8, I64, P64, P32, I64, I64, PD, P8, I64, P64, P64, PD, ctypes.c_int]

X = Z ** (1 + L)
PLO, PHI = Z ** L, CS * Z ** L
NMAX = int(max(Z ** M, PHI, Z, 40 * PLO)) + 1
Z6 = np.exp(-1j * math.pi * np.arange(6) / 3)


def log(*a):
    print(f"[{time.time() - t0:7.1f}s]", *a, flush=True)


# primary elements a + b omega, a = 1, b = 0 mod 3, sorted by (norm, a, b)
r = int(math.isqrt(4 * NMAX // 3)) + 3
a0 = -r
while a0 % 3 != 1:
    a0 += 1
b0 = -r
while b0 % 3 != 0:
    b0 += 1
print(f"planned allocation: element grid {((r - a0) // 3 + 1) * ((r - b0) // 3 + 1) * 8 * 3 / 1e9:.2f} GB", flush=True)
A, Bm = np.meshgrid(np.arange(a0, r + 1, 3, dtype=np.int64), np.arange(b0, r + 1, 3, dtype=np.int64), indexing="ij")
A = A.ravel(); Bm = Bm.ravel(); Nn = A * A - A * Bm + Bm * Bm
ok = (Nn > 0) & (Nn <= NMAX)
A, Bm, Nn = A[ok], Bm[ok], Nn[ok]
o = np.lexsort((Bm, A, Nn)); EA, EB, EN = A[o], Bm[o], Nn[o]
del A, Bm, Nn, ok, o

# sieve
spf = np.arange(NMAX + 1, dtype=np.int32)
for i in range(2, int(NMAX ** 0.5) + 1):
    if spf[i] == i:
        seg = spf[i * i::i]
        seg[seg == np.arange(i * i, NMAX + 1, i, dtype=np.int32)] = i
isp = spf == np.arange(NMAX + 1); isp[:2] = False

# primes of Z[omega]
split = (EB != 0) & isp[EN]
ia = np.where((EB == 0) & (EA < 0))[0]
ia = ia[isp[-EA[ia]] & ((-EA[ia]) % 3 == 2) & (EA[ia] != -2)]
inert = np.zeros(len(EN), dtype=bool); inert[ia] = True
pidx = np.where(split | inert)[0]
Pa, Pb, PN = EA[pidx].copy(), EB[pidx].copy(), EN[pidx].copy()
Pkind = inert[pidx].astype(np.int8)            # 0 split, 1 inert
Pp = np.where(Pkind == 0, PN, -Pa)
Pr = np.zeros(len(pidx), dtype=np.int64)
for i in np.where(Pkind == 0)[0]:
    Pr[i] = (-int(Pa[i]) * pow(int(Pb[i]), -1, int(PN[i]))) % int(PN[i])
nP = len(pidx)
by_rat = {}
for i in range(nP):
    by_rat.setdefault(int(Pp[i]), []).append(i)
log(f"Z={Z:g} M={M} l={L} cslot={CS} X={X:.0f} NMAX={NMAX} elements={len(EN)} primes={nP}")

rowmask = (EN > Z ** M / 4) & (EN <= Z ** M) & ~((EA % 2 == 0) & (EB % 2 == 0))
U = np.ascontiguousarray(EA[rowmask]); V = np.ascontiguousarray(EB[rowmask]); R = len(U)
if CS < 0:                                       # first -CS primes of norm >= Z^l (conjugate pairs kept whole)
    cnd = np.where(PN >= PLO)[0]; k = int(-CS)
    while k < len(cnd) and PN[cnd[k]] == PN[cnd[k - 1]]:
        k += 1
    PHI = float(PN[cnd[k - 1]])
slot = np.where((PN >= PLO) & (PN <= PHI))[0]; n = len(slot)
small = np.where(PN <= Z)[0]; NS = len(small)
log(f"rows R={R}  marks n={n} (norms {PN[slot].min()}..{PN[slot].max()}; {int((PN[slot] <= 2 * PLO).sum())} in [Z^l, 2Z^l])  small primes={NS}")


# ---- inert-prime symbol (numpy, as in gram.py) ----
def powpair(u, v, e, q):
    ru, rv = np.ones_like(u), np.zeros_like(v)
    bu, bv = u % q, v % q
    while e:
        if e & 1:
            ru, rv = (ru * bu - rv * bv) % q, (ru * bv + rv * bu - rv * bv) % q
        bu, bv = (bu * bu - bv * bv) % q, (2 * bu * bv - bv * bv) % q
        e >>= 1
    return ru, rv


def chi6_inert(q, Uu, Vv):
    out = np.full(Uu.shape, -1, dtype=np.int8)
    tu, tv = powpair(Uu, Vv, (q * q - 1) // 6, q)
    vu, vv = 1, 0
    for j in range(6):
        out[(tu == vu) & (tv == vv)] = j
        vu, vv = (-(vu * 0 - vv * 1)) % q, (-(vu * 1 + vv * 0 - vv * 1)) % q
    out[((Uu % q) == 0) & ((Vv % q) == 0)] = -1
    return out


def chi6_split(ip, Uu, Vv):
    """classes of elements (Uu, Vv) modulo split primes with indices ip (arrays of equal length)."""
    out = np.empty(len(ip), dtype=np.int8)
    lib.chi6_pairs(len(ip), np.ascontiguousarray(Pp[ip]), np.ascontiguousarray(Pr[ip]),
                   np.ascontiguousarray(Uu, dtype=np.int64), np.ascontiguousarray(Vv, dtype=np.int64), out)
    assert out.min() >= -1, "inconsistent sextic class"
    return out


def chi6_any(ip, Uu, Vv):
    """classes of elements modulo primes ip (mixed kinds), elementwise."""
    ip = np.asarray(ip); out = np.empty(len(ip), dtype=np.int8)
    s = Pkind[ip] == 0
    if s.any():
        out[s] = chi6_split(ip[s], Uu[s], Vv[s])
    for q in np.unique(ip[~s]):
        mm = ip == q
        out[mm] = chi6_inert(int(Pp[q]), Uu[mm], Vv[mm])
    return out


# ---- Gauss sums ----
need = np.union1d(small, slot)
Gs = np.zeros(nP, dtype=complex)
ns_ = need[Pkind[need] == 0]
if ALLG:
    todo = ns_
else:
    todo = ns_[Pb[ns_] > 0]                     # conjugate primes: g(pbar) = conj g(p) (n2 Lemma 2)
gre = np.empty(len(todo)); gim = np.empty(len(todo))
lib.gauss_split(len(todo), np.ascontiguousarray(Pp[todo]), np.ascontiguousarray(Pr[todo]),
                np.ascontiguousarray((2 * Pa[todo] - Pb[todo]) % Pp[todo]), gre, gim)
Gs[todo] = gre + 1j * gim
if not ALLG:
    pos = {(int(Pa[i]), int(Pb[i])): i for i in ns_}
    for i in todo:
        Gs[pos[(int(Pa[i] - Pb[i]), int(-Pb[i]))]] = np.conj(Gs[i])
# inert primes: normalised sum is 1 (Stickelberger: order 3 divides q + 1); checked directly for q <= 200
for i in need[Pkind[need] == 1]:
    q = int(Pp[i])
    if q <= 200:
        uu, vv = np.meshgrid(np.arange(q, dtype=np.int64), np.arange(q, dtype=np.int64), indexing="ij")
        uu = uu.ravel(); vv = vv.ravel(); j = chi6_inert(q, uu, vv).astype(np.int64); okk = j >= 0
        g = complex((Z6[(2 * j[okk]) % 6] * np.exp(2j * math.pi * (-(2 * uu[okk] - vv[okk]) % q) / q)).sum()) / q
        assert abs(g - 1) < 1e-9, (q, g)
    Gs[i] = 1.0
gerr = float(np.abs(np.abs(Gs[need]) - 1).max())
log(f"gauss sums done: {len(todo)} split sums computed, max||g|-1|={gerr:.2e}")

# ---- cofactors ----
clo, chi_ = 0.2 * X / PHI, X / PLO
cand = np.where((EN > 1) & (EN <= chi_) & (EN >= clo))[0]
cptr = [0]; cidx = []; keep = []
EAl, EBl, ENl = EA.tolist(), EB.tolist(), EN.tolist(); Prl = Pr.tolist(); spfl = spf
for e in cand.tolist():
    nn = ENl[e]; a = EAl[e]; b = EBl[e]; idx = []; good = True
    while nn > 1:
        p = int(spfl[nn]); ex = 0
        while nn % p == 0:
            nn //= p; ex += 1
        if p == 2 or p == 3:
            good = False; break
        if p % 3 == 2:
            if ex != 2:
                good = False; break
            idx.append(by_rat[p][0])
        else:
            hit = [i for i in by_rat[p] if (a + b * Prl[i]) % p == 0]
            if len(hit) != ex:
                good = False; break
            idx.extend(hit)
    if good:
        keep.append(e); cidx.extend(idx); cptr.append(len(cidx))
keep = np.array(keep); Cn = len(keep)
cptr = np.array(cptr, dtype=np.int64); cidxP = np.array(cidx, dtype=np.int64)   # prime indices (global)
if MODE != "full":                               # order cofactors by their largest prime (sequential access to the symbol table)
    perm = np.argsort(np.maximum.reduceat(cidxP, cptr[:-1]), kind="stable")
    om0 = np.diff(cptr); newptr = np.concatenate([[0], np.cumsum(om0[perm])])
    newidx = np.empty_like(cidxP)
    src = cptr[:-1][perm]
    for w in range(1, int(om0.max()) + 1):
        selw = np.where(om0[perm] == w)[0]
        for t in range(w):
            newidx[newptr[selw] + t] = cidxP[src[selw] + t]
    keep = keep[perm]; cptr = newptr.astype(np.int64); cidxP = newidx
CU = np.ascontiguousarray(EA[keep]); CV = np.ascontiguousarray(EB[keep]); CN = EN[keep].astype(float)
om = np.diff(cptr)
log(f"cofactors c': {Cn} (mean omega {om.mean():.2f}, max {om.max()})")
if MODE == "full":
    SYS = ["Ap", "K", "R", "one"]
    VAR = [("Ap", 0, 1), ("K", 1, 4), ("R", 2, 1), ("K4a", 0, 4), ("A", 1, 1), ("Q", 0, 3), ("QR", 2, 3), ("Q0", 3, 3), ("T6", 3, 1)]
elif MODE == "lean":
    SYS = ["Ap", "Rc"]
    VAR = [("Ap", 0, 1), ("Rc", 1, 1), ("K4a", 0, 4), ("Q", 0, 3), ("QRc", 1, 3)]
else:                                            # "extra": random unimodular coefficient per COLUMN c (same for every mark dividing c)
    SYS = ["Rc"]
    VAR = [("Rc", 0, 1), ("QRc", 0, 3), ("Rc4", 0, 4)]
nsys = len(SYS)
plan = (Cn * nsys * n * 16 * 2 + n * R + n * Cn * (16 * 3 + 8 * 3) + NS * 32 * 16 + 16 * 32 * 6 * nsys * n * 16) / 1e9
print(f"planned allocation: W {Cn}x{nsys}x{n} c128 (x2 transient), EP {n}x{R} int8, per-pair work arrays {n}x{Cn}, "
      f"thread buffers: total {plan:.2f} GB", flush=True)
if plan > 24:
    sys.exit("planned allocation above 24 GB: reduce the problem")

# gamma_2(c') = prod g(q) * prod_{pairs} Z6[2 (chi_q1(q2) + chi_q2(q1))]
rowid = np.repeat(np.arange(Cn), om)
gC = np.ones(Cn, dtype=complex)
np.multiply.at(gC, rowid, Gs[cidxP])
pi_, pj_, pc_ = [], [], []
for w in range(2, int(om.max()) + 1):
    sel = np.where(om == w)[0]
    if len(sel) == 0:
        continue
    blk = cidxP[cptr[sel][:, None] + np.arange(w)[None, :]]
    for s in range(w):
        for t in range(s + 1, w):
            pi_.append(blk[:, s]); pj_.append(blk[:, t]); pc_.append(sel)
if pi_:
    pi_ = np.concatenate(pi_); pj_ = np.concatenate(pj_); pc_ = np.concatenate(pc_)
    j1 = chi6_any(pi_, Pa[pj_], Pb[pj_]).astype(np.int64); j2 = chi6_any(pj_, Pa[pi_], Pb[pi_]).astype(np.int64)
    assert j1.min() >= 0 and j2.min() >= 0
    np.multiply.at(gC, pc_, Z6[(2 * (j1 + j2)) % 6])
alC = (CU - CV / 2 + 1j * CV * math.sqrt(3) / 2) / np.sqrt(CN)
log("gamma_2(c') done")

# slot data
SU = np.ascontiguousarray(Pa[slot]); SV = np.ascontiguousarray(Pb[slot]); Np = PN[slot].astype(float)
gP = Gs[slot]; alP = (SU - SV / 2 + 1j * SV * math.sqrt(3) / 2) / np.sqrt(Np)
# E1[p, c'] = chi6_p(c');  E2[c', p] = chi6_{c'}(p) = sum over q | c' of chi6_q(p)
E1 = np.empty((n, Cn), dtype=np.int16)
for k, i in enumerate(slot):
    E1[k] = chi6_any(np.full(Cn, i), CU, CV)
E2 = np.zeros((Cn, n), dtype=np.int16); bad2 = np.zeros((Cn, n), dtype=bool)
for k in range(n):
    t2 = chi6_any(cidxP, np.full(len(cidxP), SU[k]), np.full(len(cidxP), SV[k])).astype(np.int16)
    np.add.at(E2[:, k], rowid, np.where(t2 < 0, 0, t2))
    np.logical_or.at(bad2[:, k], rowid, t2 < 0)
cop = (E1 >= 0) & (~bad2.T)


def bump(x):
    t = (x - 0.6) / 0.4
    return np.where(np.abs(t) < 1, np.exp(1 - 1 / np.maximum(1 - t * t, 1e-300)), 0.0)


Wt = bump(np.outer(Np, CN) / X) / np.sqrt(np.outer(Np, CN)) * cop
tw = Z6[(2 * (E1 + E2.T)) % 6]
Dp = (Wt ** 2).sum(axis=1)
# overlap matrix: Ov[p, p'] = sum over columns c divisible by p and p' of |b_c|^2 = sum_{c' : p' | c'} Wt[p, c']^2   (Ov[p, p] = Dp)
Ov = np.zeros((n, n))
for k2, i2 in enumerate(slot):
    hit = np.unique(rowid[cidxP == i2])
    Ov[:, k2] = (Wt[:, hit] ** 2).sum(axis=1)
Ov[np.arange(n), np.arange(n)] = Dp
Wabs1 = np.abs(Wt).sum(axis=1)
W = np.empty((Cn, nsys, n), dtype=complex)
for s, name in enumerate(SYS):
    if name == "Ap":
        W[:, s, :] = (Wt * tw * (gC / alC)[None, :] * (gP / alP)[:, None]).T
    elif name == "K":
        W[:, s, :] = (Wt * tw * gC[None, :] * gP[:, None]).T
    elif name == "R":
        W[:, s, :] = (Wt * np.exp(2j * math.pi * rng.random((n, Cn)))).T
    elif name == "Rc":
        key = rng.integers(0, 2 ** 63, size=nP, dtype=np.uint64)       # column id = sum of prime keys (order independent)
        hc = np.zeros(Cn, dtype=np.uint64); np.add.at(hc, rowid, key[cidxP])
        h = hc[None, :] + key[slot][:, None]
        h ^= h >> np.uint64(30); h *= np.uint64(0xBF58476D1CE4E5B9); h ^= h >> np.uint64(27); h *= np.uint64(0x94D049BB133111EB); h ^= h >> np.uint64(31)
        W[:, s, :] = (Wt * np.exp(2j * math.pi * (h >> np.uint64(11)).astype(np.float64) / 2.0 ** 53)).T
    else:
        W[:, s, :] = Wt.T
del tw, E1, E2, bad2, cop
Wf = np.ascontiguousarray(W).view(np.float64).reshape(-1)
log("weights done")

# row symbols for slot primes and for inert small primes
EP = np.empty((n, R), dtype=np.int8)
for k, i in enumerate(slot):
    EP[k] = chi6_any(np.full(R, i), U, V)
sm_pos = np.full(nP, -1, dtype=np.int64); sm_pos[small] = np.arange(NS)
kind = np.ascontiguousarray(Pkind[small]); spp = np.ascontiguousarray(Pp[small]); srr = np.ascontiguousarray(Pr[small])
inl = np.where(kind == 1)[0]; inrow = np.zeros(NS, dtype=np.int64); inrow[inl] = np.arange(len(inl))
print(f"planned allocation: inert table {len(inl)}x{R} int8 = {len(inl) * R / 1e9:.2f} GB", flush=True)
Tin = np.empty((max(len(inl), 1), R), dtype=np.int8)
for k, q in enumerate(inl):
    Tin[k] = chi6_inert(int(spp[q]), U, V)
cidxS = np.ascontiguousarray(sm_pos[cidxP].astype(np.int32)); assert cidxS.min() >= 0
log(f"row tables done; kernel: {R} rows x {Cn} cofactors x {nsys} systems x {n} marks = {R * Cn * nsys * n:.3e} complex adds")

nvar = len(VAR)
G = np.zeros(nvar * n * n * 2)
lib.kern(R, 0, R, U, V, NS, kind, spp, srr, inrow, Tin, Cn, cptr, cidxS, n, nsys, Wf, EP, nvar,
         np.array([v[1] for v in VAR], dtype=np.int64), np.array([v[2] for v in VAR], dtype=np.int64), G, 1)
G = G.view(np.complex128).reshape(nvar, n, n)
log("kernel done")
out = {}
for v, (name, s, k) in enumerate(VAR):
    g = (G[v] + G[v].conj().T) / 2
    asym = float(np.abs(G[v] - G[v].conj().T).max() / np.abs(G[v]).max())
    Gn = g / R / np.sqrt(np.outer(Dp, Dp))
    ev = np.linalg.eigvalsh(Gn)
    off = Gn - np.diag(np.diag(Gn))
    print(f"  {name:3s}: lane-normalised Gram: diag_mean={np.real(np.diag(Gn)).mean():.6f} off_rms={np.sqrt((np.abs(off) ** 2).mean()):.6f} "
          f"eig[min,max]=[{ev[0]:.6f},{ev[-1]:.6f}] herm_asym={asym:.1e}", flush=True)
    out["G_" + name] = g
np.savez(OUT, Np=Np, SU=SU, SV=SV, Dp=Dp, R=R, Cn=Cn, Z=Z, M=M, L=L, CS=CS, gerr=gerr, Wabs1=Wabs1, Ov=Ov,
         kind=(Pkind[slot] == 0), natural=(PN[slot] <= 2 * PLO), **out)
log("saved " + OUT)
