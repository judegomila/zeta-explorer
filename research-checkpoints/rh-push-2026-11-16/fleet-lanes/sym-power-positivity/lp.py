"""LP checks for RESULT.md.
E1: classical extremal problem on the circle T.
    P(th) = 1 + sum_{k=1..K} a_k cos(k th) >= 0, a_k >= 0, a_1 = r fixed; minimise A = sum_{k>=1} a_k.
    R(K) = min_r A / (2 (sqrt r - 1)^2)   (de la Vallee Poussin constant: 1-beta >= 1/(R log t)).
E2: same on T x SU(2): phi(al,th) = sum_{m<=M,k<=K} w_{m,k} U_m(cos al) cos(k th) >= 0, w>=0,
    w_{0,0}=1, w_{0,1}=r; companion cost per unit weight = c_m (three cost models).
    Theorem A predicts min cost == E1 for every cost model with c_m >= 0.
"""
import numpy as np, json, sys
from scipy.optimize import linprog, minimize_scalar

def e1(K, r, n=6001):
    th = np.linspace(0, np.pi, n)
    ks = np.arange(2, K + 1)
    # variables a_2..a_K
    Aub = -np.cos(np.outer(th, ks)); bub = 1 + r * np.cos(th)
    res = linprog(np.ones(len(ks)), A_ub=Aub, b_ub=bub, bounds=(0, None), method="highs")
    if res.status != 0: return np.inf, None
    return r + res.fun, res.x

def R1(K):
    f = lambda r: e1(K, r)[0] / (2 * (np.sqrt(r) - 1) ** 2)
    o = minimize_scalar(f, bounds=(1.2, 1.99), method="bounded", options={"xatol": 1e-7})
    return o.fun, o.x

def e2(K, M, r, cost, nth=241, nal=121):
    th = np.linspace(0, np.pi, nth); al = np.linspace(0, np.pi, nal)
    TH, AL = np.meshgrid(th, al, indexing="ij"); TH = TH.ravel(); AL = AL.ravel()
    s = np.sin(AL); 
    def U(m):
        with np.errstate(divide="ignore", invalid="ignore"):
            u = np.sin((m + 1) * AL) / s
        u[s < 1e-12] = (m + 1) * np.where(np.cos(AL[s < 1e-12]) > 0, 1, (-1) ** m)
        return u
    idx = [(m, k) for m in range(M + 1) for k in range(K + 1) if (m, k) not in ((0, 0), (0, 1))]
    cols = [U(m) * np.cos(k * TH) for (m, k) in idx]
    Aub = -np.array(cols).T; bub = 1 + r * np.cos(TH)
    c = np.array([(1.0 if m == 0 else cost(m)) if k >= 1 else 0.0 for (m, k) in idx])
    res = linprog(c, A_ub=Aub, b_ub=bub, bounds=(0, None), method="highs")
    if res.status != 0: return np.inf, None
    w = dict(zip(idx, res.x))
    comp = sum(v for (m, k), v in w.items() if m >= 1)
    return r + res.fun, comp

out = {"E1": [], "E2": []}
for K in (2, 3, 4, 8, 16, 24, 32, 40):
    Rv, r = R1(K); out["E1"].append({"K": K, "R": Rv, "r": r}); print("E1", K, Rv, r, flush=True)
costs = {"degree (m+1)": lambda m: m + 1.0, "unit": lambda m: 1.0, "free": lambda m: 0.0}
for (K, M) in ((4, 4), (8, 6), (12, 8)):
    for r in (1.5, 1.74, 1.9):
        base = e1(K, r, n=241)[0]   # same theta grid as E2
        row = {"K": K, "M": M, "r": r, "circle_only": base}
        for name, c in costs.items():
            v, comp = e2(K, M, r, c); row[name] = v; row[name + " companion mass"] = comp
        out["E2"].append(row); print("E2", row, flush=True)
json.dump(out, open("lp-results.json", "w"), indent=1)
