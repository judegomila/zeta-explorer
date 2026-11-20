# LP screen for POS-FE (float64; a screen, not a verdict).
# G = zeta m, m rational in s(1-s). Poles of m: at zeta zeros 1/2 +- i g_j (weight a_j in [0,1], relaxed).
# Zeros of m: on-line pairs 1/2 +- i t_i (weight b_i >= 0), quartets 1/2 +- eta +- i g (weight c_k >= 0).
# Density of the defect: D(x) = x^(-1/2) S(L), L = log x,
#   S(L) = sum a_j 2 cos(g_j L) - sum b_i 2 cos(t_i L) - sum c_k 4 cosh(eta L) cos(gq_k L) [+ p 4 cosh(b L)]
# nu = Lambda + D dx.  Minimise delta subject to D(x) >= -delta on a grid of x in [1, 1e6].
# Problems: A  (a_1 = 1: first zero removed; everything else free)
#           B  (sum c_k = 1 at a given eta: one quartet forced, location free among gap midpoints)
#           C  (B plus one allowed double real pole pair at 1/2 +- 0.2: reproduces the referee's m_+)
import os, sys, json, time
os.environ.setdefault("OMP_NUM_THREADS", "1"); os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
import numpy as np
from scipy.optimize import linprog
from multiprocessing import Pool

LMAX = np.log(1e6)
G = np.array([float(x) for x in open("zeros.txt").read().split()])

def columns(K, eta, prob):
    g = G[:K]
    gaps = np.diff(g)
    mids = g[:-1] + gaps / 2
    on = np.concatenate([g[:-1] + gaps * q for q in (0.25, 0.5, 0.75)])
    return g, mids, on

def block(L, g, mids, on, eta, prob):
    e = np.exp(-L / 2)[:, None]
    cols = [2 * np.cos(np.outer(L, g)) * e, -2 * np.cos(np.outer(L, on)) * e,
            -4 * np.cosh(eta * L)[:, None] * np.cos(np.outer(L, mids)) * e]
    if prob == "C":
        cols.append(4 * np.cosh(0.2 * L)[:, None] * e)
    return np.hstack(cols)

def solve(task):
    K, eta, prob, tlim = task
    t0 = time.time()
    g, mids, on = columns(K, eta, prob)
    nK, nOn, nQ = len(g), len(on), len(mids)
    n = nK + nOn + nQ + (1 if prob == "C" else 0)
    hL = min(0.004, 2 * np.pi / (6 * g[-1]))
    Lf = np.arange(0.0, LMAX + hL, hL)
    print(f"[{prob} K={K} eta={eta}] cols={n} fine rows={len(Lf)}; LP matrix planned <= {min(len(Lf), 3*n)*n*8/1e9:.2f} GB", flush=True)
    idx = set(np.linspace(0, len(Lf) - 1, min(len(Lf), max(400, n // 2))).astype(int).tolist())
    bounds = [(0, 1)] * nK + [(0, 4)] * nOn + [(0, 4)] * nQ + ([(0, 1)] if prob == "C" else []) + [(0, None)]
    if prob == "A":
        bounds[0] = (1, 1)
        Aeq = None; beq = None
    else:
        Aeq = np.zeros((1, n + 1)); Aeq[0, nK + nOn:nK + nOn + nQ] = 1; beq = [1.0]
    c = np.zeros(n + 1); c[-1] = 1
    hist = []; x = None; status = "?"
    for rnd in range(40):
        I = np.array(sorted(idx))
        A = block(Lf[I], g, mids, on, eta, prob)
        Aub = np.hstack([-A, -np.ones((len(I), 1))])
        r = linprog(c, A_ub=Aub, b_ub=np.zeros(len(I)), A_eq=Aeq, b_eq=beq, bounds=bounds, method="highs",
                    options={"time_limit": max(60.0, tlim - (time.time() - t0)), "primal_feasibility_tolerance": 1e-9, "dual_feasibility_tolerance": 1e-9})
        if r.x is None:
            status = "lp-fail:" + str(r.status); break
        x = r.x; delta = x[-1]
        # violation on the full fine grid, chunked
        worst = -np.inf; viol = np.empty(len(Lf))
        for s in range(0, len(Lf), 2000):
            viol[s:s + 2000] = -(block(Lf[s:s + 2000], g, mids, on, eta, prob) @ x[:-1]) - delta
        worst = viol.max()
        hist.append([rnd, len(I), float(delta), float(worst), round(time.time() - t0, 1)])
        print(f"[{prob} K={K} eta={eta}] round {rnd} rows {len(I)} delta {delta:.6e} worst viol {worst:.2e} t {time.time()-t0:.0f}s", flush=True)
        if worst <= 1e-9 + 1e-6 * delta:
            status = "converged"; break
        if time.time() - t0 > tlim:
            status = "time-limit (delta is a lower bound for the fine-grid optimum)"; break
        loc = np.where((viol > 1e-10) & (viol >= np.roll(viol, 1)) & (viol >= np.roll(viol, -1)))[0]
        loc = loc[np.argsort(-viol[loc])][:max(300, n // 4)]
        idx.update(loc.tolist())
    out = {"prob": prob, "K": K, "eta": eta, "status": status, "cols": n, "fine_rows": len(Lf), "hL": hL, "hist": hist, "seconds": round(time.time() - t0, 1)}
    if x is not None:
        a = x[:nK]; b = x[nK:nK + nOn]; cq = x[nK + nOn:nK + nOn + nQ]
        # continuous check on a 4x finer grid
        L4 = np.arange(0.0, LMAX, hL / 4); m4 = np.inf
        for s in range(0, len(L4), 2000):
            m4 = min(m4, float((block(L4[s:s + 2000], g, mids, on, eta, prob) @ x[:-1]).min()))
        top = np.argsort(-cq)[:5]
        out.update({"delta": float(x[-1]), "minD_fine4": m4, "sum_a": float(a.sum()), "n_a_pos": int((a > 1e-7).sum()),
                    "n_a_frac": int(((a > 1e-7) & (a < 1 - 1e-7)).sum()), "sum_b": float(b.sum()), "n_b_pos": int((b > 1e-7).sum()),
                    "sum_c": float(cq.sum()), "top_quartets": [[float(mids[i]), float(cq[i]), float((g[i + 1] - g[i]) / 2)] for i in top if cq[i] > 1e-7],
                    "p_realpole": float(x[n - 1]) if prob == "C" else None,
                    "a_support_range": [float(g[a > 1e-7].min()), float(g[a > 1e-7].max())] if (a > 1e-7).any() else None})
        # ZQ reference (integer member): best consecutive pair, envelope maximum of 4 x^-1/2 (cosh(eta L) - cos(d L))
        if prob != "A":
            Lc = np.arange(0, LMAX, 0.002); d = np.diff(g) / 2
            env = 4 * np.exp(-Lc / 2)[:, None] * (np.cosh(eta * Lc)[:, None] - np.cos(np.outer(Lc, d)))
            e = env.max(axis=0); j = int(e.argmin())
            out["zq_best"] = {"pair": [j + 1, j + 2], "d": float(d[j]), "envelope_sup": float(e[j]), "proved_bound": float(8 * np.exp(-2) * (eta**2 + d[j]**2) / (0.5 - eta)**2)}
    print("RESULT " + json.dumps(out), flush=True)
    return out

if __name__ == "__main__":
    Ks = [int(k) for k in sys.argv[1].split(",")]
    etas = [float(e) for e in sys.argv[2].split(",")]
    tlim = float(sys.argv[3]); tag = sys.argv[4]
    tasks = []
    for K in sorted(Ks, reverse=True):
        tasks.append((K, 0.1, "A", tlim))
        for eta in etas:
            if K >= 1600 and eta not in (0.1,):
                continue
            tasks.append((K, eta, "B", tlim))
        if K <= 400:
            tasks.append((K, 0.1, "C", tlim)); tasks.append((K, 0.3, "C", tlim))
    W = int(os.environ.get("RH_WORKERS", "4"))
    with Pool(W, maxtasksperchild=1) as p:
        res = list(p.imap_unordered(solve, tasks, chunksize=1))
    json.dump(res, open(f"lp_{tag}.json", "w"), indent=1)
    print("done", len(res))
