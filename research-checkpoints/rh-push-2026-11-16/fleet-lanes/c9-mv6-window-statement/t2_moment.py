"""t2_moment.py -- decisive screen for (E-K): mean square of the theta row over complete rows m, Gaussian row weight.
 B_m = sum_{c sf} sum_n vec_c conj(alpha(n))^3 chi_c(m) chi_n(m)^3 q_c^{-1/2} q_n^{-1} V(q_c q_n^3 / Z)   (c7 transcription,
 nu = 1), V(y) = exp(-(log y)^2 / (4 s^2)).  Marked variant: column weight sum_{pi | c, slot} W1(q_pi / P) V(q_c/(Z q_pi) ...).
 ratio(X) = sum_m g_X(m) |B_m|^2 / sum_m g_X(m) DIAG_m, DIAG_m = exact mean over independent random column phases.
 float64/complex64 screen.  Usage: python t2_moment.py Z [P] [--s 0.5] [--xmax 16] [--ycut 12]"""
import sys, time, math
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
    "THIN*ALIGN": np.conj(T.g1) * T.mu * cmult(eps_thin),   # column vector whose dual coefficient is mu*eps (pole-free part removed: G)
    "U": T.tau * U,
    "GAMMA2": T.g2,                            # Dunn-Radziwill vector: cubic Gauss sums without conj(alpha)
    "RAND1": np.exp(2j * np.pi * rng.random(T.n)),
    "RAND2": np.exp(2j * np.pi * rng.random(T.n)),
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
Xgrid = Nscale * np.array([x for x in ((0.03125, 0.0625) if P else ()) + (0.125, 0.25, 0.5, 1, 2, 4, 8, 16, 32) if x <= xmax])
Mmax = 2.5 * Xgrid.max()
ma, mb, mq = elements(Mmax)
nm = len(ma)
print(f"rows {nm} (q_m <= {Mmax:g}); planned: phases {len(live)*chunk*8/2**30:.2f} GB complex64 + exponents {T.n*chunk*2/2**30:.2f} GB int16 per chunk  [{time.time()-t0:.1f}s]", flush=True)
B2 = np.zeros((nv, nm)); DG = np.zeros(nm)
for st in range(0, nm, chunk):
    sl = slice(st, min(nm, st + chunk)); a_ = ma[sl]; b_ = mb[sl]
    KP = T.prime_exps(a_, b_); E = T.node_exps(KP)
    E = E[live]; good = E < 64
    Ph = np.where(good, Z6.astype(np.complex64)[(jrow * E) % 6], np.complex64(0))
    # cube-part row factors wn(m)
    wn = np.empty((len(a_), nn), dtype=complex)
    for i, (e, q, f) in enumerate(nlist):
        if not f: wn[:, i] = ncoef[i]; continue
        ex = np.zeros(len(a_), dtype=np.int64)
        for j in f: ex = ex + KP[j]
        wn[:, i] = np.where(ex < 64, ncoef[i] * Z6[(3 * ex) % 6], 0)
    BB = (Ph.T @ Amat).reshape(len(a_), nv, nn)                 # (ch, nv, nn)
    Bm = np.einsum('mvn,mn->mv', BB, wn)
    B2[:, sl] = (np.abs(Bm) ** 2).T
    DD = good.T.astype(np.float32) @ A2                          # (ch, pairs)
    dg = np.zeros(len(a_))
    for t, (i, j) in enumerate(iu):
        dg += (1 if i == j else 2) * (wn[:, i] * np.conj(wn[:, j])).real * DD[:, t]
    DG[sl] = dg
    if (st // chunk) % 20 == 0: print(f"  rows {sl.stop}/{nm}  [{time.time()-t0:.1f}s]", flush=True)
print(f"done rows [{time.time()-t0:.1f}s]")
import json
out = {"Z": Zs, "P": P, "s_V": s_V, "columns": int(len(live)), "rows": int(nm), "names": names, "X": [], "ratio": [], "shell": []}
print("\nGaussian row weight g_X(m) = exp(-(2 pi/sqrt 3) q_m / X); ratio = sum g |B|^2 / sum g DIAG")
print(f"{'X/N':>7} {'X':>9} {'K=N^2/X':>9} {'DIAG/X':>8} " + " ".join(f"{k:>10}" for k in names))
for X in Xgrid:
    g = np.exp(-KAP * mq / X); den = (g * DG).sum()
    r = [(g * B2[v]).sum() / den for v in range(nv)]
    out["X"].append(float(X)); out["ratio"].append([float(x) for x in r])
    print(f"{X/Nscale:7.3f} {X:9.0f} {Nscale**2/X:9.1f} {den/X:8.4f} " + " ".join(f"{x:10.4f}" for x in r))
print("\nsharp dyadic shells Q < q_m <= 2Q: ratio = sum |B|^2 / sum DIAG")
Q = Nscale / (32 if P else 8)
while 2 * Q <= Mmax:
    sh = (mq > Q) & (mq <= 2 * Q); den = DG[sh].sum()
    r = [B2[v][sh].sum() / den for v in range(nv)]
    out["shell"].append([float(Q)] + [float(x) for x in r])
    print(f"{Q/Nscale:7.3f} {Q:9.0f} {int(sh.sum()):9d} {den/sh.sum():8.4f} " + " ".join(f"{x:10.4f}" for x in r))
    Q *= 2
json.dump(out, open(f"t2_Z{int(Zs)}_P{int(P)}_j{jrow}.json", "w"))
print(f"total {time.time()-t0:.1f}s")
