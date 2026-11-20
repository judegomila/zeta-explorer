# Quantitative screen (float64): ONE quartet 1/2 +- eta +- i g* forced with multiplicity 1 (g* = midpoint of the
# consecutive pair with the smallest ZQ envelope among the first K zeros). Free: removal of zeta zeros within W
# indices of the pair, added on-line pairs at eighth points of the gaps, further quartets at gap midpoints.
#   stage 1: fractional weights (LP; a lower bound for every integer configuration on these columns)
#   stage 2: integer weights (MILP; incumbent = a genuine member G = zeta m; evaluated on the fine grid)
# Objective: delta = sup over x in [1,1e6] of the negative part of D(x), nu = Lambda + D dx.
import os, sys, json, time
os.environ["OMP_NUM_THREADS"] = "1"; os.environ["OPENBLAS_NUM_THREADS"] = "1"
import numpy as np
from scipy.optimize import milp, LinearConstraint, Bounds
from multiprocessing import Pool
LMAX = np.log(1e6)
G = np.array([float(x) for x in open("zeros.txt").read().split()])
W = int(os.environ.get("C16_W", "40"))

def zq_env(g, eta):
    Lc = np.arange(0, LMAX, 0.002); d = np.diff(g) / 2
    env = 4 * np.exp(-Lc / 2)[:, None] * (np.cosh(eta * Lc)[:, None] - np.cos(np.outer(Lc, d)))
    return env.max(axis=0)

def run(task):
    K, eta, tl = task
    t0 = time.time()
    g = G[:K]; e = zq_env(g, eta); j = int(e.argmin()); gs = (g[j] + g[j + 1]) / 2
    lo, hi = max(0, j - W), min(K, j + 2 + W)
    gz = g[lo:hi]; gaps = np.diff(gz)
    on = np.concatenate([gz[:-1] + gaps * q / 8 for q in range(1, 8)])
    mids = np.array([m for m in gz[:-1] + gaps / 2 if abs(m - gs) > 1e-9])
    nK, nOn, nQ = len(gz), len(on), len(mids); n = nK + nOn + nQ
    hL = min(0.004, 2 * np.pi / (6 * gz[-1])); Lf = np.arange(0.0, LMAX + hL, hL)
    def blk(L):
        ee = np.exp(-L / 2)[:, None]
        return np.hstack([2 * np.cos(np.outer(L, gz)) * ee, -2 * np.cos(np.outer(L, on)) * ee,
                          -4 * np.cosh(eta * L)[:, None] * np.cos(np.outer(L, mids)) * ee])
    def forced(L):
        return -4 * np.cosh(eta * L) * np.cos(gs * L) * np.exp(-L / 2)
    def Dfull(x, L):
        out = np.empty(len(L))
        for s in range(0, len(L), 4000):
            out[s:s + 4000] = blk(L[s:s + 4000]) @ x + forced(L[s:s + 4000])
        return out
    print(f"[K={K} eta={eta}] pair {j+1},{j+2} g*={gs:.4f} d={(g[j+1]-g[j])/2:.4f} cols={n} fine rows={len(Lf)} LP matrix <= {3000*n*8/1e9:.3f} GB", flush=True)
    c = np.zeros(n + 1); c[-1] = 1
    lb = np.zeros(n + 1); ub = np.concatenate([np.ones(nK), np.ones(nOn), np.ones(nQ), [np.inf]])
    idx = set(np.linspace(0, len(Lf) - 1, min(len(Lf), 800)).astype(int).tolist())
    def cp(integ, tlim, rounds):
        x = None; hist = []; bound = None
        for rnd in range(rounds):
            I = np.array(sorted(idx))
            A = np.hstack([blk(Lf[I]), np.ones((len(I), 1))])
            res = milp(c, constraints=LinearConstraint(A, lb=-forced(Lf[I]), ub=np.inf), bounds=Bounds(lb, ub),
                       integrality=np.concatenate([np.full(n, 1 if integ else 0), [0]]),
                       options={"time_limit": tlim, "mip_rel_gap": 1e-3})
            if res.x is None: hist.append([rnd, len(I), None, None, str(res.status)]); break
            x = res.x.copy()
            if integ: x[:-1] = np.round(x[:-1])
            D = Dfull(x[:-1], Lf); viol = -D - x[-1]
            bound = float(getattr(res, "mip_dual_bound", x[-1]) if integ else x[-1])
            hist.append([rnd, len(I), float(x[-1]), float(viol.max()), bound, round(time.time() - t0, 1)])
            print(f"[K={K} eta={eta}] {'MILP' if integ else 'LP'} round {rnd} rows {len(I)} delta {x[-1]:.5e} bound {bound:.5e} worst {viol.max():.2e} t {time.time()-t0:.0f}s", flush=True)
            if viol.max() <= 2e-7 + 1e-5 * abs(x[-1]): break
            loc = np.where((viol > 1e-10) & (viol >= np.roll(viol, 1)) & (viol >= np.roll(viol, -1)))[0]
            n0 = len(idx); idx.update(loc[np.argsort(-viol[loc])][:400].tolist())
            if len(idx) == n0: break
        return x, hist, bound
    xl, hl, bl = cp(False, 600, 40)
    L4 = np.arange(0.0, LMAX, hL / 4)
    out = {"K": K, "eta": eta, "pair": [j + 1, j + 2], "gstar": float(gs), "d": float((g[j + 1] - g[j]) / 2),
           "zq_envelope_sup": float(e[j]), "zq_true_sup_neg": float(-min(0.0, (2*np.cos(g[j]*L4)*np.exp(-L4/2) + 2*np.cos(g[j+1]*L4)*np.exp(-L4/2) + forced(L4)).min())),
           "zq_proved_bound": float(8 * np.exp(-2) * (eta**2 + ((g[j+1]-g[j])/2)**2) / (0.5 - eta)**2),
           "cols": n, "lp_delta_lower_bound": bl, "lp_hist_last": hl[-1] if hl else None}
    if xl is not None:
        out["lp_true_sup_neg_fine4"] = float(-min(0.0, Dfull(xl[:-1], L4).min()))
        out["lp_sum_a"] = float(xl[:nK].sum()); out["lp_sum_b"] = float(xl[nK:nK+nOn].sum()); out["lp_sum_c_extra"] = float(xl[nK+nOn:n].sum())
    xi, hi_, bi = cp(True, tl, 4)
    if xi is not None:
        a = xi[:nK]; b = xi[nK:nK + nOn]; cq = xi[nK + nOn:n]
        out.update({"int_true_sup_neg_fine4": float(-min(0.0, Dfull(xi[:-1], L4).min())), "int_dual_bound_last_round": bi,
                    "int_removed": [float(v) for v in gz[a > 0.5]], "int_added_online": [float(v) for v in on[b > 0.5]],
                    "int_extra_quartets": [float(v) for v in mids[cq > 0.5]], "int_hist": hi_,
                    "int_is_ZQ": bool(a.sum() == 2 and b.sum() == 0 and cq.sum() == 0 and a[j - lo] > 0.5 and a[j + 1 - lo] > 0.5)})
    out["seconds"] = round(time.time() - t0, 1)
    print("RESULT " + json.dumps(out), flush=True)
    return out

if __name__ == "__main__":
    Ks = [int(k) for k in sys.argv[1].split(",")]; etas = [float(e) for e in sys.argv[2].split(",")]
    tl = float(sys.argv[3]); tag = sys.argv[4]
    tasks = [(K, eta, tl) for K in sorted(Ks, reverse=True) for eta in etas]
    with Pool(int(os.environ.get("RH_WORKERS", "4")), maxtasksperchild=1) as p:
        res = list(p.imap_unordered(run, tasks, chunksize=1))
    json.dump(res, open(f"lp2_{tag}.json", "w"), indent=1); print("done", len(res))
