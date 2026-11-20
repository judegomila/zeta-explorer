"""w_window.py (c9-mv6-window-statement; t2_moment.py of c8 with a window grid, vectors MUG/MUGc, fewer vectors) -- decisive screen for (E-K): mean square of the theta row over complete rows m, Gaussian row weight.
 B_m = sum_{c sf} sum_n vec_c conj(alpha(n))^3 chi_c(m) chi_n(m)^3 q_c^{-1/2} q_n^{-1} V(q_c q_n^3 / Z)   (c7 transcription,
 nu = 1), V(y) = exp(-(log y)^2 / (4 s^2)).  Marked variant: column weight sum_{pi | c, slot} W1(q_pi / P) V(q_c/(Z q_pi) ...).
 ratio(X) = sum_m g_X(m) |B_m|^2 / sum_m g_X(m) DIAG_m, DIAG_m = exact mean over independent random column phases.
 float64/complex64 screen.  Usage: python t2_moment.py Z [P] [--s 0.5] [--xmax 16] [--ycut 12]"""
import sys, time, math, os
print('threads env', os.environ.get('OMP_NUM_THREADS'), os.environ.get('RH_WORKERS'), flush=True)
import numpy as np
from ek_common import *
args = sys.argv[1:]
def opt(name, default):
    if name in args:
        i = args.index(name); v = float(args[i + 1]); del args[i:i + 2]; return v
    return default
s_V = opt('--s', 0.5); xmax = opt('--xmax', 16); ycut = opt('--ycut', 12); bthin = opt('--b', 0.9); chunk = int(opt('--chunk', 3000)); jrow = int(opt('--j', 1))
Zs = float(args[0]); P = float(args[1]) if len(args) > 1 else 0.0
t0 = time.time()
Nscale = Zs * (P if P else 1.0)
Cmax = ycut * Zs * (2 * P if P else 1.0)
T = Tab(Cmax, pmax=(max(ycut * Zs, 2 * P) if P else None))
V = lambda y: np.exp(-np.log(y) ** 2 / (4 * s_V ** 2))
print(f"row symbol power j={jrow}; Z={Zs:g} P={P:g} s_V={s_V} Cmax={Cmax:g} columns={T.n} primes={len(T.pp)}  [{time.time()-t0:.1f}s]", flush=True)
# ---- cube part n: products of primes with repetition, q_n^3 <= ycut * Z (unmarked only)
nlist = [((1, 0), 1, [])]
if not P and jrow == 1:
    lim = (ycut * Zs) ** (1 / 3.0)
    def rec(start, el, q, fac):
        for j in range(start, len(T.pp)):
            qq = q * int(T.pq[j])
            if qq > lim: break
            e2 = Zm.mul(el, (int(T.pa[j]), int(T.pb[j])))
            nlist.append((e2, qq, fac + [j])); rec(j, e2, qq, fac + [j])
    order = np.argsort(T.pq, kind='stable'); assert (order == np.arange(len(order))).all()
    rec(0, (1, 0), 1, [])
nn = len(nlist)
print("cube parts n:", [(e, q) for e, q, f in nlist], flush=True)
# ---- column weights A0[c, n] >= 0
if P:
    W1 = lambda x: np.where((x > 1) & (x < 2), np.sin(np.pi * (x - 1)) ** 2, 0.0)
    A0 = np.zeros((T.n, 1))
    slot = np.flatnonzero((T.pq > P) & (T.pq < 2 * P))
    print("slot primes (norms):", T.pq[slot].tolist(), flush=True)
    # for each column c, sum over its slot prime factors
    isslot = np.zeros(len(T.pp), bool); isslot[slot] = True
    acc = np.zeros(T.n)                       # sum over slot primes pi | c of W1(q_pi/P) V(q_c/(Z q_pi))
    for lev in T.levels:
        pass
    # walk factor chains level by level: contribution list per node
    lp = T.lastpos
    cur = np.arange(T.n)
    while True:
        act = cur > 0
        if not act.any(): break
        j = np.where(act, lp[np.maximum(cur, 0)], 0)
        qpi = T.pq[j].astype(float)
        add = np.where(act & isslot[j], W1(qpi / P) * V(T.N / (Zs * qpi)), 0.0)
        acc += add
        cur = np.where(act, T.parent[np.maximum(cur, 0)], 0)
    A0[:, 0] = acc / np.sqrt(T.N)
else:
    A0 = np.stack([V(T.N * q ** 3 / Zs) / np.sqrt(T.N) for e, q, f in nlist], axis=1)
live = np.flatnonzero(A0.max(axis=1) > 1e-7 * A0.max())
print(f"live columns {len(live)}; sum A0^2 (n=1) = {np.sum(A0[:,0]**2):.4f}", flush=True)
# ---- vectors
rng = np.random.default_rng(11)
def cmult(vals_at_primes):
    out = np.ones(T.n, dtype=complex)
    for lev in T.levels:
        out[lev] = out[T.parent[lev]] * vals_at_primes[T.lastpos[lev]]
    return out
U = cmult(np.exp(2j * np.pi * rng.random(len(T.pp))))
# THIN: eps(pi) = -1 on a greedy thin set with count ~ (1/2) int_2^x t^(b-1) dt / log t
def thin_signs(b):
    eps = np.ones(len(T.pp)); cnt = 0; acc = 0.0; prev = 2.0
    for j in range(len(T.pp)):
        x = float(T.pq[j])
        if x > prev:
            ts = np.linspace(prev, x, 8); f = ts ** (b - 1) / np.log(ts)
            acc += 0.5 * np.sum((f[1:] + f[:-1]) / 2 * np.diff(ts)); prev = x
        if cnt + 1 <= acc:
            eps[j] = -1; cnt += 1
    return eps, cnt
eps_thin, nthin = thin_signs(bthin)
print(f"THIN b={bthin}: {nthin} of {len(T.pp)} primes flipped", flush=True)
vecs = {
    "THETA": T.tau,
    "LIOU": T.tau * T.mu,
    "ALIGNED": np.conj(T.g1),                 # = tau * mu * conj(G): tau*gamma_1 -> 1
    "THIN": T.tau * cmult(eps_thin),
    "U": T.tau * U,
    "MUG": T.mu * T.G,                         # the dual (Moebius) vector of THETA: tau*gamma_1 = mu*G; rows play the role of k
    "MUGc": T.mu * np.conj(T.G),
    "RAND1": np.exp(2j * np.pi * rng.random(T.n)),
}
# corrected row of manuscript section 6.1: extra factor G(c n^3) = conj(chi_{c n^3}(4)) Gamma(c n^3) (four-term formula (4.3))
E4 = T.node_exps(T.prime_exps(np.array([4]), np.array([0])))[:, 0]
def gamma4_arr(a, b):
    return (1 + 1j ** ((-b) % 4) + 1j ** (a % 4) + 1j ** ((b - a) % 4)) / 2
Gfull = np.empty((T.n, nn), dtype=complex)
for i, (e, q, f) in enumerate(nlist):
    n3 = Zm.power(e, 3)
    ca = T.na * n3[0] - T.nb * n3[1]; cb = T.na * n3[1] + T.nb * n3[0] - T.nb * n3[1]
    e4n = sum(int(T.tabs[j][(4 % int(T.pp[j])) if not T.pinert[j] else ((4 % int(T.pp[j])) * int(T.pp[j]))]) for j in f)
    Gfull[:, i] = np.conj(Z6[E4 % 6]) * np.conj(Z6[(3 * e4n) % 6]) * gamma4_arr(ca, cb)
print("check G(c) from (4.7) against conj(chi_c(4)) Gamma(c): max diff", float(np.abs(Gfull[:, 0] - T.G).max()), flush=True)
vecs["THETA*G"] = T.tau[:, None] * Gfull
vecs["LIOU*G"] = (T.tau * T.mu)[:, None] * Gfull
names = list(vecs); nv = len(names)
Amat = np.concatenate([((vecs[k][:, None] if vecs[k].ndim == 1 else vecs[k]) * A0) for k in names], axis=1).astype(np.complex64)[live]   # (live, nv*nn)
# pair columns for DIAG
iu = [(i, j) for i in range(nn) for j in range(i, nn)]
A2 = np.stack([A0[:, i] * A0[:, j] for i, j in iu], axis=1).astype(np.float32)[live]
# cube-part row factors
ncoef = np.array([np.conj(complex(e[0] - e[1] / 2.0, e[1] * SQ3 / 2.0) / math.sqrt(q)) ** 3 / q for e, q, f in nlist])
# ---- rows
jmin = int(math.ceil(2 * math.log2(P))) + 1 if P else 3
Xgrid = Nscale * np.array([x for x in [2.0 ** (-j) for j in range(jmin, 0, -1)] + [1, 2, 4, 8, 16, 32, 64] if x <= xmax])
if P: print(f"window Z/P < X < Z P: X/N in ({1/P**2:.5f}, 1); X in ({Zs/P:.1f}, {Zs*P:.1f})", flush=True)
Mmax = 2.5 * Xgrid.max()
ma, mb, mq = elements(Mmax)
nm = len(ma)
print(f"rows {nm} (q_m <= {Mmax:g}); planned: phases {len(live)*chunk*8/2**30:.2f} GB complex64 + exponents {T.n*chunk*2/2**30:.2f} GB int16 per chunk  [{time.time()-t0:.1f}s]", flush=True)
# ---- pruned tree: live columns and their ancestors only
need = np.zeros(T.n, bool); need[live] = True
cur = live.copy()
while True:
    cur = T.parent[cur]; cur = np.unique(cur[cur >= 0])
    cur = cur[~need[cur]]
    if len(cur) == 0: break
    need[cur] = True
need[np.flatnonzero(T.depth == 0)] = True
idx = np.flatnonzero(need); remap = -np.ones(T.n, dtype=np.int64); remap[idx] = np.arange(len(idx))
par_r = np.where(T.parent[idx] >= 0, remap[np.maximum(T.parent[idx], 0)], 0); lp_r = T.lastpos[idx]; dep_r = T.depth[idx]
levels_r = [np.flatnonzero(dep_r == L) for L in range(1, int(dep_r.max()) + 1)]
live_r = remap[live]
W = int(os.environ.get('RH_WORKERS', '1'))
print(f"pruned tree {len(idx)} of {T.n} nodes; workers {W}; planned per worker and chunk: exponents {len(idx)*chunk*2/2**30:.2f} GB int16 + phases {len(live)*chunk*8/2**30:.2f} GB complex64 + mask {len(live)*chunk*5/2**30:.2f} GB", flush=True)
Z6c = Z6.astype(np.complex64)
def work(st):
    sl = slice(st, min(nm, st + chunk)); a_ = ma[sl]; b_ = mb[sl]
    KP = T.prime_exps(a_, b_)
    E = np.zeros((len(idx), len(a_)), dtype=np.int16)
    for lev in levels_r:
        E[lev] = E[par_r[lev]] + KP[lp_r[lev]]
    E = E[live_r]; good = E < 64
    Ph = np.where(good, Z6c[(jrow * E) % 6], np.complex64(0))
    wn = np.empty((len(a_), nn), dtype=complex)
    for i, (e, q, f) in enumerate(nlist):
        if not f: wn[:, i] = ncoef[i]; continue
        ex = np.zeros(len(a_), dtype=np.int64)
        for j in f: ex = ex + KP[j]
        wn[:, i] = np.where(ex < 64, ncoef[i] * Z6[(3 * ex) % 6], 0)
    BB = (Ph.T @ Amat).reshape(len(a_), nv, nn)
    Bm = np.einsum('mvn,mn->mv', BB, wn)
    DD = good.T.astype(np.float32) @ A2
    dg = np.zeros(len(a_))
    for t, (i, j) in enumerate(iu):
        dg += (1 if i == j else 2) * (wn[:, i] * np.conj(wn[:, j])).real * DD[:, t]
    return st, (np.abs(Bm) ** 2).T, dg
B2 = np.zeros((nv, nm)); DG = np.zeros(nm)
starts = list(range(0, nm, chunk))
if W > 1:
    import multiprocessing as mp
    pool = mp.get_context('fork').Pool(W); it = pool.imap_unordered(work, starts)
else:
    it = map(work, starts)
for n_done, (st, b2, dg) in enumerate(it):
    B2[:, st:st + b2.shape[1]] = b2; DG[st:st + len(dg)] = dg
    if n_done % max(1, len(starts) // 25) == 0: print(f"  chunks {n_done + 1}/{len(starts)}  [{time.time()-t0:.1f}s]", flush=True)
print(f"done rows [{time.time()-t0:.1f}s]")
import json
out = {"Z": Zs, "P": P, "s_V": s_V, "columns": int(len(live)), "rows": int(nm), "names": names, "X": [], "ratio": [], "shell": []}
print("\nGaussian row weight g_X(m) = exp(-(2 pi/sqrt 3) q_m / X); ratio = sum g |B|^2 / sum g DIAG")
print(f"{'X/N':>7} {'X':>9} {'K=N^2/X':>9} {'DIAG/X':>8} " + " ".join(f"{k:>10}" for k in names))
dox = []
for X in Xgrid:
    g = np.exp(-KAP * mq / X); den = (g * DG).sum(); dox.append(float(den / X))
    r = [(g * B2[v]).sum() / den for v in range(nv)]
    out["X"].append(float(X)); out["ratio"].append([float(x) for x in r])
    print(f"{X/Nscale:7.3f} {X:9.0f} {Nscale**2/X:9.1f} {den/X:8.4f} " + " ".join(f"{x:10.4f}" for x in r))
print("\nsharp dyadic shells Q < q_m <= 2Q: ratio = sum |B|^2 / sum DIAG")
Q = Xgrid.min()
while 2 * Q <= Mmax:
    sh = (mq > Q) & (mq <= 2 * Q); den = DG[sh].sum()
    r = [B2[v][sh].sum() / den for v in range(nv)]
    out["shell"].append([float(Q)] + [float(x) for x in r])
    print(f"{Q/Nscale:7.3f} {Q:9.0f} {int(sh.sum()):9d} {den/sh.sum():8.4f} " + " ".join(f"{x:10.4f}" for x in r))
    Q *= 2
out["diag_over_X"] = dox
json.dump(out, open(f"w_Z{int(Zs)}_P{int(P)}.json", "w"))
print(f"total {time.time()-t0:.1f}s")
