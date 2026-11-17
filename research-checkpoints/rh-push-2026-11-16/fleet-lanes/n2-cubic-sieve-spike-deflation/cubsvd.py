#!/usr/bin/env python3
"""Full SVD of the cubic-symbol matrix C[c,d] = (c/d)_3 over squarefree primary c, d in Z[omega],
N(c) <= K, N(d) <= D (0 when gcd != 1).  Usage: cubsvd.py K D [tag]
Prints planned allocations before making them.  Saves npz with singular values, top vectors, Gauss sums.
"""
import sys, math, json, time
import numpy as np

K = int(sys.argv[1]); D = int(sys.argv[2])
tag = sys.argv[3] if len(sys.argv) > 3 else f"K{K}_D{D}"
OUT = sys.argv[0].rsplit("/", 1)[0]
NTOP = 40
t0 = time.time()
W3 = np.exp(2j * math.pi * np.arange(3) / 3)
NMAX = max(K, D)


def is_prime(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True


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


els = primary_elements(NMAX)
EN = np.array([e[0] for e in els], dtype=np.int64)
EU = np.array([e[1] for e in els], dtype=np.int64)
EV = np.array([e[2] for e in els], dtype=np.int64)
ne = len(els)

primes = []
for i, (n, a, b) in enumerate(els):
    if b != 0 and is_prime(n):
        primes.append(dict(i=i, el=(a, b), N=n, kind="s", p=n, r=(-a * pow(b, -1, n)) % n))
    elif b == 0 and a < 0 and is_prime(-a) and (-a) % 3 == 2:
        primes.append(dict(i=i, el=(a, b), N=n, kind="i", p=-a, r=None))
npr = len(primes)
print(f"K={K} D={D} primary elements={ne} primes={npr}", flush=True)
print(f"planned: symbol table int8 {ne}x{npr} = {ne*npr/1e6:.1f} MB", flush=True)


def powmod_arr(x, e, p):
    r = np.ones_like(x); b = x % p
    while e:
        if e & 1:
            r = (r * b) % p
        b = (b * b) % p
        e >>= 1
    return r


def powpair(u, v, e, q):
    ru, rv = np.ones_like(u), np.zeros_like(v)
    bu, bv = u % q, v % q
    while e:
        if e & 1:
            ru, rv = (ru * bu - rv * bv) % q, (ru * bv + rv * bu - rv * bv) % q
        bu, bv = (bu * bu - bv * bv) % q, (2 * bu * bv - bv * bv) % q
        e >>= 1
    return ru, rv


def cub_table(P, U, V):
    """exponent j with (x/P)_3 = omega^j, x = U + V omega; -1 if P | x."""
    out = np.full(U.shape, -1, dtype=np.int8)
    if P["kind"] == "s":
        p, r = P["p"], P["r"]
        x = (U + V * r) % p
        t = powmod_arr(x, (p - 1) // 3, p)
        out[t == 1] = 0; out[t == r] = 1; out[t == (r * r) % p] = 2
        out[x == 0] = -1
    else:
        q = P["p"]
        tu, tv = powpair(U, V, (q * q - 1) // 3, q)
        out[(tu == 1) & (tv == 0)] = 0
        out[(tu == 0) & (tv == 1)] = 1
        out[(tu == q - 1) & (tv == q - 1)] = 2
        out[((U % q) == 0) & ((V % q) == 0)] = -1
    return out


T = np.empty((ne, npr), dtype=np.int8)       # T[x, pi] = exponent of (x/pi)_3
for j, P in enumerate(primes):
    T[:, j] = cub_table(P, EU, EV)
assert (T >= -1).all()
DIV = (T == -1)
# squarefree: product of norms of dividing primes equals the norm
PN = np.array([P["N"] for P in primes], dtype=np.float64)
lognorm = DIV.astype(np.float64) @ np.log(PN)
sf = np.abs(lognorm - np.log(EN)) < 1e-9
sf[0] = (EN[0] == 1)
idx_sf = np.flatnonzero(sf)
rows = idx_sf[EN[idx_sf] <= K]; cols = idx_sf[EN[idx_sf] <= D]
nr, nc = len(rows), len(cols)
print(f"MATRIX SIZE rows={nr} cols={nc}; planned complex128 matrix {nr*nc*16/1e9:.3f} GB, "
      f"SVD peak about 7x = {7*nr*nc*16/1e9:.3f} GB (measured: 4x was too low, K=D=24000 killed by the cap)", flush=True)
if 7 * nr * nc * 16 / 1e9 > 6.5:
    print("too large for the 8 GB cap; abort"); sys.exit(2)

# exponent matrix E[c, d] = sum_{pi | d} T[c, pi]
F = DIV[cols].astype(np.float32)              # nc x npr incidence
Tr = T[rows].astype(np.float32)
Zr = (Tr < 0).astype(np.float32)
Tr0 = np.where(Tr < 0, 0, Tr)
E = np.rint(Tr0 @ F.T).astype(np.int64) % 3
NZ = (Zr @ F.T) < 0.5
C = W3[E] * NZ
del E
print(f"built C  t={time.time()-t0:.1f}s  density of nonzeros={NZ.mean():.4f}", flush=True)

# ---- symmetry check (cubic reciprocity for primary elements): C[c,d] == C[d,c]
m = min(nr, nc)
print("reciprocity max |C - C^T| on common block:", float(np.abs(C[:m, :m] - C[:m, :m].T).max()), flush=True)


# ---- Gauss sums
def gauss_prime(P):
    a, b = P["el"]
    if P["kind"] == "s":
        p, r = P["p"], P["r"]
        x = np.arange(1, p, dtype=np.int64)
        t = powmod_arr(x, (p - 1) // 3, p)
        ph = np.zeros(p - 1); ph[t == r] = 1.0; ph[t == (r * r) % p] = 2.0
        ang = 2 * math.pi * (ph / 3.0 + ((x * ((2 * a - b) % p)) % p) / p)   # Tr(x/pi) = x(2a-b)/p
        return np.exp(1j * ang).sum() / math.sqrt(p)
    q = P["p"]
    u, v = np.meshgrid(np.arange(q, dtype=np.int64), np.arange(q, dtype=np.int64), indexing="ij")
    u = u.ravel(); v = v.ravel()
    e = cub_table(P, u, v)
    ok = e >= 0
    # x/pi with pi = -q:  Tr(x/(-q)) = -(2u - v)/q
    ang = 2 * math.pi * (e[ok] / 3.0 - ((2 * u[ok] - v[ok]) % q) / q)
    return np.exp(1j * ang).sum() / q


gp = np.array([gauss_prime(P) for P in primes])
print("prime Gauss sums: max ||g|-1| =", float(np.abs(np.abs(gp) - 1).max()), flush=True)
pidx = {P["i"]: j for j, P in enumerate(primes)}
# T restricted to primes x primes
TP = T[[P["i"] for P in primes], :].astype(np.int64)


def gauss_el(i):
    """normalised cubic Gauss sum of squarefree element index i, by twisted multiplicativity
    g(ab) = (a/b)_3 (b/a)_3 g(a) g(b)."""
    fs = np.flatnonzero(DIV[i])
    g = 1.0 + 0j; ex = 0
    for a in range(len(fs)):
        g *= gp[fs[a]]
        for b in range(a + 1, len(fs)):
            ex += TP[fs[a], fs[b]] + TP[fs[b], fs[a]]
    return g * W3[ex % 3]


gcol = np.array([gauss_el(i) for i in cols]); grow = np.array([gauss_el(i) for i in rows])
Ncol = EN[cols].astype(float); Nrow = EN[rows].astype(float)

# ---- SVD
print(f"SVD start t={time.time()-t0:.1f}s", flush=True)
Um, S, Vh = np.linalg.svd(C, full_matrices=False)
print(f"SVD done t={time.time()-t0:.1f}s", flush=True)
fro = float((np.abs(C) ** 2).sum())
ntop = min(NTOP, len(S))
np.savez_compressed(f"{OUT}/svd_{tag}.npz", S=S, U=Um[:, :ntop], V=Vh[:ntop].conj().T, gcol=gcol, grow=grow,
                    Ncol=Ncol, Nrow=Nrow, rows_ab=np.stack([EU[rows], EV[rows]], 1),
                    cols_ab=np.stack([EU[cols], EV[cols]], 1), K=K, D=D, fro=fro)

s2 = S ** 2
edge_mp = (math.sqrt(nr) + math.sqrt(nc)) ** 2 * NZ.mean()
thr = 4.0 * (K + D)                      # singular value 2 sqrt(K+D)
print(f"s1^2={s2[0]:.1f} s2^2={s2[1]:.1f} s3^2={s2[2]:.1f}   (KD)^(2/3)={(K*D)**(2/3):.1f}  K+D={K+D}  "
      f"MP edge (dims)={edge_mp:.1f}  Frobenius={fro:.0f}")
print("count s^2 > 4(K+D):", int((s2 > thr).sum()), "  count s^2 > 1.1*MP edge:", int((s2 > 1.1 * edge_mp).sum()),
      "  count s^2 > 1.5*MP edge:", int((s2 > 1.5 * edge_mp).sum()))
for th in (1.0, 1.1, 1.25, 1.5, 2.0):
    res_cnt = int((s2 > th * edge_mp).sum()); print(f'   count s^2 > {th} * MP edge: {res_cnt}')
print('s_J^2 / MP edge for J = 1,2,5,10,20,40:', ' '.join(f'{s2[J-1]/edge_mp:.3f}' for J in (1,2,5,10,20,40) if J <= len(s2)))
print("top 30 s^2:", " ".join(f"{x:.0f}" for x in s2[:30]))

# ---- overlaps with Gauss-sum vectors
def nrm(x):
    return x / np.linalg.norm(x)


def ov(a, b):
    return abs(np.vdot(nrm(a), nrm(b)))


res = dict(K=K, D=D, nr=nr, nc=nc, s2=[float(x) for x in s2[:200]], fro=fro, edge_mp=edge_mp,
           n_above_4KD=int((s2 > thr).sum()), n_above_1p1=int((s2 > 1.1 * edge_mp).sum()),
           n_above_1p5=int((s2 > 1.5 * edge_mp).sum()), dens=float(NZ.mean()))
V = Vh.conj().T
for name, vec, g, Nn in (("v1", V[:, 0], gcol, Ncol), ("u1", Um[:, 0], grow, Nrow)):
    line = []
    for w in (0.0, 1 / 6, 1 / 3):
        for cj, gg in (("g", g), ("conj g", g.conj())):
            o = ov(vec, gg * Nn ** (-w)); line.append(f"{cj} N^-{w:.3f}: {o:.4f}")
            res[f"ov_{name}_{cj}_{w:.3f}"] = o
    # amplitude profile: fit |vec|^2 ~ N^{-2w}
    msk = Nn > 3
    sl = np.polyfit(np.log(Nn[msk]), np.log(np.abs(vec[msk]) ** 2 + 1e-300), 1)[0]
    res[f"amp_slope_{name}"] = float(sl)
    print(f"overlap {name}: " + "; ".join(line) + f"; log-log slope of |{name}|^2 vs N = {sl:.3f}")

# ---- spike identification: overlap of top right singular vectors with twisted Gauss vectors
#      w_{r,a,b,sg}(d) = conj(g(d)) N(d)^{-1/6} * ((omega^a lambda^b / d)_3 * (r/d)_3)^{sg},  r = small squarefree row
def unit_exp(x):
    """exponent vector over primes of (x/pi)_3 for a fixed element x = (u, v) (may be non-primary)."""
    u = np.array([x[0]], dtype=np.int64); v = np.array([x[1]], dtype=np.int64)
    return np.array([int(cub_table(P, u, v)[0]) for P in primes])
ew = unit_exp((0, 1)); el = unit_exp((1, 2))
Fi = DIV[cols].astype(np.int64)
ew_d = (Fi @ ew) % 3
el_raw = np.where(el < 0, 0, el); el_d = (Fi @ el_raw) % 3      # lambda is coprime to every primary d
NR = min(60, nr)
base = gcol.conj() * Ncol ** (-1 / 6)
Erow = np.rint(np.angle(C[:NR]) / (2 * math.pi / 3)).astype(np.int64) % 3
maskrow = np.abs(C[:NR]) > 0.5
cands = []; labels = []
for r in range(NR):
    for a in range(3):
        for b in range(3):
            for sg in (1, -1):
                ex = (sg * (Erow[r] + a * ew_d + b * el_d)) % 3
                w = base * W3[ex] * maskrow[r]
                cands.append(w / np.linalg.norm(w)); labels.append((int(Nrow[r]), int(EU[rows[r]]), int(EV[rows[r]]), a, b, sg))
Wc = np.array(cands)                                   # (#cands, nc)
print(f"twist candidates: {Wc.shape[0]}  (planned {Wc.size*16/1e9:.3f} GB)")
OV = np.abs(Wc.conj() @ V[:, :ntop])                   # (#cands, ntop)
ident = []
print(" j   s_j^2   best |<v_j, w>|   label (N(r), r=(a,b), omega^a, lambda^b, sign)   proj energy on all candidates")
# projection of v_j onto span of candidates
Q, _ = np.linalg.qr(np.array([w for w, l in zip(cands, labels) if l[5] == 1 and l[0] <= 40]).T)
print('projection space: sg=+1, N(r)<=40, all 9 unit twists, dim', Q.shape[1], 'of', nc)
for j in range(ntop):
    k = int(OV[:, j].argmax())
    pe = float(np.linalg.norm(Q.conj().T @ V[:, j]) ** 2)
    ident.append(dict(j=j, s2=float(s2[j]), best=float(OV[k, j]), label=labels[k], proj=pe))
    if j < 25:
        print(f"{j:3d} {s2[j]:9.0f}   {OV[k, j]:.3f}   {labels[k]}   {pe:.3f}")
res["ident"] = ident
# Rayleigh quotients of the candidates themselves: |C w|^2
rq = (np.abs(C @ Wc.T) ** 2).sum(axis=0)
best = {}
for lab, q in zip(labels, rq):
    key = (lab[0], lab[1], lab[2])
    if key not in best or q > best[key][0]:
        best[key] = (float(q), lab)
rqt = sorted([(k[0], v[0], v[1]) for k, v in best.items()])
res["rayleigh"] = [(n, q, list(l)) for n, q, l in rqt]
print("Rayleigh quotient |C w_r|^2 (best unit twist) by N(r):")
print("  " + "  ".join(f"N={n}:{q:.0f}" for n, q, l in rqt[:24]))
nn = np.array([n for n, q, l in rqt], float); qq = np.array([q for n, q, l in rqt])
res["rayleigh_slope"] = float(np.polyfit(np.log(nn[1:]), np.log(qq[1:]), 1)[0])
print(f"  log-log slope of Rayleigh quotient vs N(r) (r != 1): {res['rayleigh_slope']:.3f}   (prediction -1/3)")

# ---- explicit deflation: remove span{ w_{r,a,b,+1} : N(r) <= rho } (9 unit twists each) on the right, then top s^2
import scipy.sparse.linalg as sla
def top_s2(Q):
    def mv(x):
        x = x - Q @ (Q.conj().T @ x)
        y = C.conj().T @ (C @ x)
        return y - Q @ (Q.conj().T @ y)
    A = sla.LinearOperator((nc, nc), matvec=mv, dtype=np.complex128)
    return float(sla.eigsh(A, k=1, which="LA", tol=1e-4, return_eigenvectors=False)[0])
NRX = min(nr, 400)
ErowX = np.rint(np.angle(C[:NRX]) / (2 * math.pi / 3)).astype(np.int64) % 3
maskX = np.abs(C[:NRX]) > 0.5
defl = []
print("explicit deflation (right side): rho, #r, dim, top s^2 after removal, optimal rank-dim value s_{dim+1}^2, bulk MP edge")
for rho in ((0, 1, 4, 13, 31, 61, 127, 250, 500, 1000) if nc <= 2500 else (0, 1, 13, 61)):
    if rho > 0 and rho > Nrow[NRX - 1]:
        break
    sel = np.flatnonzero(Nrow[:NRX] <= rho)
    for mode in (("9tw", "1tw") if nc <= 2500 else ("9tw",)):
        ws = []
        for r in sel:
            for a in range(3):
                for b in range(3):
                    if mode == "1tw" and (a or b):
                        continue
                    ws.append(base * W3[(ErowX[r] + a * ew_d + b * el_d) % 3] * maskX[r])
        if len(ws) == 0:
            Qd = np.zeros((nc, 0), dtype=np.complex128)
        else:
            if len(ws) * nc * 16 / 1e9 > 1.0:
                print("  candidate block too large, skip"); continue
            Qd, _ = np.linalg.qr(np.array(ws).T)
        if Qd.shape[1] >= nc - 2:
            continue
        t2 = top_s2(Qd)
        opt = float(s2[Qd.shape[1]]) if Qd.shape[1] < len(s2) else 0.0
        defl.append(dict(rho=rho, mode=mode, nr=len(sel), dim=Qd.shape[1], top=t2, opt=opt))
        print(f"  rho={rho:5d} {mode} #r={len(sel):4d} dim={Qd.shape[1]:5d} top={t2:10.0f} opt={opt:10.0f} edge={edge_mp:.0f}", flush=True)
        if rho == 0:
            break
res["deflation"] = defl

# ---- rows with the pole-killing quadratic twist: x_m(d) = w_m(d) (m/d)_2  on d coprime to 2
def quad_table(P, U, V):
    out = np.zeros(U.shape, dtype=np.int8)
    if P["N"] == 4:
        return out
    if P["kind"] == "s":
        p, r = P["p"], P["r"]
        x = (U + V * r) % p
        t = powmod_arr(x, (p - 1) // 2, p)
        out[t == 1] = 1; out[t == p - 1] = -1
    else:
        q = P["p"]
        tu, tv = powpair(U, V, (q * q - 1) // 2, q)
        out[(tu == 1) & (tv == 0)] = 1; out[(tu == q - 1) & (tv == 0)] = -1
    return out
NQ = min(nr, 200)
ru, rv = EU[rows[:NQ]], EV[rows[:NQ]]
QT = np.stack([quad_table(P, ru, rv) for P in primes], 1).astype(np.float64)     # NQ x npr, entries 0, +-1
neg = (QT < 0).astype(np.float64) @ Fi.T.astype(np.float64)
zer = ((QT == 0).astype(np.float64) @ Fi.T.astype(np.float64)) > 0.5
i2 = [j for j, P in enumerate(primes) if P["N"] == 4]
odd = (Fi[:, i2[0]] == 0) if i2 else np.ones(nc, bool)
quad = np.where(zer, 0.0, (-1.0) ** neg) * odd[None, :]                           # (m/d)_2, 0 if d even or gcd > 1
ErowQ = np.rint(np.angle(C[:NQ]) / (2 * math.pi / 3)).astype(np.int64) % 3
maskQ = np.abs(C[:NQ]) > 0.5
bulk = fro / nc
out = []
Vt = V[:, :ntop]
for flat in (False, True):
    b0 = gcol.conj() * (1.0 if flat else Ncol ** (-1 / 6))
    rq_c, rq_q, en_c, en_q, rq_odd = [], [], [], [], []
    for r in range(1, NQ):
        w = b0 * W3[ErowQ[r]] * maskQ[r]
        wo = w * odd
        x = w * quad[r]
        for vec, rl, el_ in ((w, rq_c, en_c), (x, rq_q, en_q)):
            nn2 = np.linalg.norm(vec) ** 2
            rl.append(float(np.linalg.norm(C @ vec) ** 2 / nn2)); el_.append(float(np.linalg.norm(Vt.conj().T @ vec) ** 2 / nn2))
        rq_odd.append(float(np.linalg.norm(C @ wo) ** 2 / np.linalg.norm(wo) ** 2))
    Nm = Nrow[1:NQ]
    d = dict(flat=flat, bulk=bulk, base=ntop / nc,
             rq_cubic_mean=float(np.mean(rq_c)), rq_cubic_odd_mean=float(np.mean(rq_odd)), rq_quad_mean=float(np.mean(rq_q)), rq_quad_max=float(np.max(rq_q)),
             en_cubic_mean=float(np.mean(en_c)), en_quad_mean=float(np.mean(en_q)), en_quad_max=float(np.max(en_q)))
    out.append(d)
    print(f"quadratic-twist test (weight {'1' if flat else 'N^-1/6'}), m = rows 2..{NQ} (N(m) <= {int(Nm[-1])}): bulk level Frobenius/cols = {bulk:.0f}")
    print(f"   Rayleigh |C x|^2/|x|^2: cubic twist only mean {d['rq_cubic_mean']:.0f} (restricted to odd d: {d['rq_cubic_odd_mean']:.0f});  with quadratic twist mean {d['rq_quad_mean']:.0f} max {d['rq_quad_max']:.0f}")
    print(f"   energy in top-{ntop} right singular space: cubic only {d['en_cubic_mean']:.4f}; with quadratic twist mean {d['en_quad_mean']:.4f} max {d['en_quad_max']:.4f}; random baseline {ntop/nc:.4f}")
res["quadtwist"] = out
# the worst vector in the span of the quadratic-twisted rows: top s^2 of C restricted to that span
Xq = np.array([gcol.conj() * Ncol ** (-1 / 6) * W3[ErowQ[r]] * maskQ[r] * quad[r] for r in range(1, NQ)]).T
Xc = np.array([gcol.conj() * Ncol ** (-1 / 6) * W3[ErowQ[r]] * maskQ[r] * odd for r in range(1, NQ)]).T
for nm, X in (("quadratic-twisted rows", Xq), ("cubic-only rows (odd d)", Xc)):
    Qx, _ = np.linalg.qr(X)
    sv = np.linalg.svd(C @ Qx, compute_uv=False)
    mpx = (math.sqrt(nr) + math.sqrt(Qx.shape[1])) ** 2 * NZ.mean()
    res["span_" + nm[:5]] = dict(dim=Qx.shape[1], top=float(sv[0] ** 2), mp=mpx)
    print(f"span of {Qx.shape[1]} {nm}: top s^2 of C restricted = {sv[0]**2:.0f};  MP edge for {nr} x {Qx.shape[1]} = {mpx:.0f}; ratio {sv[0]**2/mpx:.2f}")
json.dump(res, open(f"{OUT}/svd_{tag}.json", "w"))
print(f"total t={time.time()-t0:.1f}s")
