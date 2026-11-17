#!/usr/bin/env python3
"""SDP(G) = max{tr(GX): X >= 0, X_pp <= 1} = min{tr D: D diagonal, D - G >= 0} for the mark Gram matrices of gram.py.
Primal: Burer-Monteiro X = V V^*, rows of V unit vectors in C^k (generalised power method + row sweeps; monotone, G >= 0).
Dual candidate: D_p = Re (G V V^*)_pp. Certificate: delta = max(0, -lambda_min(D - G)); D + delta I is dual feasible, so
    tr(G V V^*)  <=  SDP(G)  <=  tr D + n delta.
Lower bound for the actual maximum over |a_p| <= 1: rank-one rounding + phase power iteration.
Usage: sdp.py gram_*.npz [seed]
"""
import sys, math, json, time, os
import numpy as np

f = sys.argv[1]; seed = int(sys.argv[2]) if len(sys.argv) > 2 else 1
rng = np.random.default_rng(seed)
d = np.load(f)
Np = d["Np"]; n = len(Np); R = int(d["R"]); Dp = d["Dp"]
print(f"{os.path.basename(f)}: n={n} R={R}; planned allocation: G {n}x{n} c128 x4 = {4 * n * n * 16 / 1e9:.3f} GB", flush=True)
res = dict(file=os.path.basename(f), n=n, R=R, variants={})


def rownorm(Vm):
    return Vm / np.maximum(np.linalg.norm(Vm, axis=1, keepdims=True), 1e-300)


def solve(G, k):
    V = rownorm(rng.standard_normal((n, k)) + 1j * rng.standard_normal((n, k)))
    val = -1.0
    Gd = np.real(np.diag(G))
    for it in range(20000):
        # conditional-gradient step on the off-diagonal part (exact block maximiser direction)
        GV = G @ V
        new = float(np.real(np.vdot(V, GV)))
        Dd = np.real(np.einsum("ij,ij->i", V.conj(), GV))
        if it % 50 == 0:
            ev0 = np.linalg.eigvalsh(np.diag(Dd) - G)[0]
            if -ev0 * n < 1e-9 * new:
                break
        val = new
        V = rownorm(GV - 0.5 * Gd[:, None] * V)
    GV = G @ V
    Dd = np.real(np.einsum("ij,ij->i", V.conj(), GV))
    return V, float(np.real(np.vdot(V, GV))), Dd, it


def maxlb(G, V, tries=40):
    best = 0.0; ba = None
    for t in range(tries):
        g = rng.standard_normal(V.shape[1]) + 1j * rng.standard_normal(V.shape[1])
        a = V @ g if t < tries - 5 else rng.standard_normal(n) + 1j * rng.standard_normal(n)
        a = a / np.maximum(np.abs(a), 1e-300)
        prev = -1.0
        for it in range(3000):
            Ga = G @ a
            cur = float(np.real(np.vdot(a, Ga)))
            if cur - prev <= 1e-13 * cur:
                break
            prev = cur
            b = Ga - 0.5 * np.real(np.diag(G)) * a
            a = b / np.maximum(np.abs(b), 1e-300)
        if cur > best:
            best, ba = cur, a
    return best, ba


for name in ["Ap", "K", "R"]:
    G = d["G_" + name]
    t0 = time.time()
    tr = float(np.real(np.trace(G)))
    k = min(n, int(math.ceil(math.sqrt(n))) + 3)
    V, primal, Dd, its = solve(G, k)
    ev = np.linalg.eigvalsh(np.diag(Dd) - G)
    delta = max(0.0, -float(ev[0]))
    upper = float(Dd.sum()) + n * delta
    lam = float(np.linalg.eigvalsh(G)[-1])
    mlb, a = maxlb(G, V)
    ones = float(np.real(np.ones(n) @ G @ np.ones(n)))
    gersh = float(np.abs(G).sum())
    Gn = G / np.sqrt(np.outer(np.real(np.diag(G)), np.real(np.diag(G))))
    off = np.abs(Gn - np.diag(np.diag(Gn)))
    iu = np.triu_indices(n, 1)
    o = off[iu]
    # conjugate pairs (p, pbar)
    SU, SV = d["SU"], d["SV"]
    pos = {(int(a_), int(b_)): i for i, (a_, b_) in enumerate(zip(SU, SV))}
    cj = [(i, pos[(int(a_ - b_), int(-b_))]) for i, (a_, b_) in enumerate(zip(SU, SV)) if (int(a_ - b_), int(-b_)) in pos and b_ > 0]
    ocj = np.array([off[i, j] for i, j in cj]) if cj else np.array([0.0])
    r = dict(tr=tr, primal=primal, dual=upper, gap_rel=(upper - primal) / primal, delta=delta, iters=its, rank_k=k,
             sdp_over_tr=upper / tr, primal_over_tr=primal / tr, maxlb_over_tr=mlb / tr, lam_n_over_tr=lam * n / tr,
             ones_over_tr=ones / tr, gersh_over_tr=gersh / tr, tr_over_RDp=tr / (R * float(Dp.sum())),
             off_rms_sqrtR=float(np.sqrt((o ** 2).mean()) * math.sqrt(R)) if len(o) else 0.0,
             off_max_sqrtR=float(o.max() * math.sqrt(R)) if len(o) else 0.0,
             gauss_max_pred=float(math.sqrt(math.log(max(len(o), 2)))),
             conj_pairs=len(cj), conj_off_rms_sqrtR=float(np.sqrt((ocj ** 2).mean()) * math.sqrt(R)),
             D=Dd.tolist(), Gdiag=np.real(np.diag(G)).tolist())
    res["variants"][name] = r
    print(f"  {name:2s} tr={tr:.6e} primal={primal:.8e} dual={upper:.8e} gap={r['gap_rel']:.1e} its={its} | SDP/tr={r['sdp_over_tr']:.4f} "
          f"max_lb/tr={r['maxlb_over_tr']:.4f} n*lam/tr={r['lam_n_over_tr']:.4f} ones/tr={r['ones_over_tr']:.4f} Gersh/tr={r['gersh_over_tr']:.3f} | "
          f"off rms*sqrtR={r['off_rms_sqrtR']:.3f} max*sqrtR={r['off_max_sqrtR']:.2f} (sqrt log pairs {r['gauss_max_pred']:.2f}) "
          f"conj pairs {len(cj)} rms*sqrtR={r['conj_off_rms_sqrtR']:.3f} | tr/(R sum Dp)={r['tr_over_RDp']:.4f} [{time.time() - t0:.1f}s]", flush=True)
res["Np"] = Np.tolist(); res["split"] = d["kind"].tolist(); res["SU"] = d["SU"].tolist(); res["SV"] = d["SV"].tolist()
json.dump(res, open(f.replace("gram_", "sdp_").replace(".npz", ".json"), "w"))
