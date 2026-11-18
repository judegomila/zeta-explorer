"""Supplementary checks. (A) exact integer separators for n = 6, 7 (FK cone). (B) F_5 boundary: constrained maximisation (float screen)
of c2 - c1 - 1 on {c1 <= 1} and of c1 - 1 - c2. (C) GHS sanity on random ferromagnets. (D) diagonal specialisation z_p = w of the
zeta stage (primes <= 23, Curie-Weiss and sparse members): Lee-Yang roots, FK cone membership (LP), chain-form membership (least squares).
(E) sparse sum-rule stage zero count. All arrays < 50 MB."""
import numpy as np, itertools, json, sys
from fractions import Fraction as Fr
from scipy.optimize import linprog, least_squares, minimize
sys.path.insert(0, ".")
rng = np.random.default_rng(21)
out = {}
def partitions(n, m=None):
    m = n if m is None else m
    if n == 0: yield (); return
    for k in range(min(n, m), 0, -1):
        for rest in partitions(n - k, k): yield (k,) + rest
def pmul(p, q):
    r = [0] * (len(p) + len(q) - 1)
    for i, x in enumerate(p):
        for j, y in enumerate(q): r[i + j] += x * y
    return r
def gen(part):
    p = [1]
    for k in part: p = pmul(p, [1] + [0] * (k - 1) + [1])
    return p
# (A)
cands = {6: [Fr(1), Fr(8, 3), Fr(5, 3), Fr(0)], 7: [Fr(1), Fr(7, 2), Fr(7, 2), Fr(0)]}
for n, P in cands.items():
    Gi = [gen(p)[:n // 2 + 1] for p in partitions(n)]; best = None
    for y in itertools.product(range(-4, 5), repeat=n // 2 + 1):
        if all(sum(a * b for a, b in zip(y, g)) <= 0 for g in Gi):
            v = sum(a * b for a, b in zip(y, P))
            if v > 0 and (best is None or v / sum(abs(t) for t in y) > best[0]): best = (v / sum(abs(t) for t in y), y, v)
    print(f"(A) n={n}: P half-coefficients {[str(x) for x in P]}: exact integer separator y={best[1] if best else None}, y.P={best[2] if best else None} (y.g<=0 on all {len(Gi)} generators)")
    out[f"A_n{n}"] = dict(P=[str(x) for x in P], y=list(best[1]) if best else None, yP=str(best[2]) if best else None)
# (B)
pairs = list(itertools.combinations(range(5), 2)); idx = {p: k for k, p in enumerate(pairs)}
subs1 = [(i,) for i in range(5)]; subs2 = pairs
def cut(a, S):
    v = 1.0
    for i in S:
        for j in range(5):
            if j not in S: v *= a[idx[(min(i, j), max(i, j))]]
    return v
c1f = lambda a: sum(cut(a, S) for S in subs1); c2f = lambda a: sum(cut(a, S) for S in subs2)
best_up = -9; best_lo = -9
for st in range(400):
    a0 = rng.random(10) ** rng.choice([0.3, 1, 3]); a0[rng.random(10) < 0.25] = rng.choice([0.0, 1.0])
    r = minimize(lambda a: -(c2f(a) - c1f(a) - 1), a0, bounds=[(0, 1)] * 10, constraints=[dict(type="ineq", fun=lambda a: 1 - c1f(a))], method="SLSQP", options=dict(maxiter=300))
    if r.success and c1f(r.x) <= 1 + 1e-9: best_up = max(best_up, c2f(r.x) - c1f(r.x) - 1)
    r = minimize(lambda a: -(c1f(a) - 1 - c2f(a)), a0, bounds=[(0, 1)] * 10, method="SLSQP", options=dict(maxiter=300))
    if r.success: best_lo = max(best_lo, c1f(r.x) - 1 - c2f(r.x))
print("(B) n=5, 400 SLSQP starts: sup of c2 - c1 - 1 on {c1<=1} =", best_up, " (measured boundary c2 = 1 + c1);  sup of c1 - 1 - c2 =", best_lo, "(proved <= 0)")
out["B"] = dict(sup_upper=float(best_up), sup_lower=float(best_lo))
# (C) GHS sanity
def third(P, h):
    k = np.arange(len(P)); lw = np.outer(h, k) + np.log(np.maximum(P, 1e-300))[None, :]; lw -= lw.max(axis=1, keepdims=True)
    pr = np.exp(lw); pr /= pr.sum(axis=1, keepdims=True); m1 = pr @ k
    return (pr * (k[None, :] - m1[:, None]) ** 3).sum(axis=1)
hh = np.linspace(0.01, 6, 300); mx = -9
for _ in range(3000):
    a = rng.random(10) ** rng.choice([0.3, 1, 3]); c1, c2 = c1f(a), c2f(a)
    mx = max(mx, third(np.array([1, c1, c2, c2, c1, 1.0]), hh).max())
print("(C) max third cumulant over 3000 random 5-spin ferromagnets (GHS predicts <= 0):", mx); out["C"] = float(mx)
# (D),(E)
P23 = [2, 3, 5, 7, 11, 13, 17, 19, 23]; l = np.log(np.array(P23, float)); L = l.sum(); n = 9
sig = np.array(list(itertools.product([-1, 1], repeat=n)), float); nup = ((sig + 1) / 2).sum(1).astype(int)
def diag_poly(J):
    en = np.einsum('ki,ij,kj->k', sig, np.triu(J, 1), sig); wts = np.exp(en - en.max())
    c = np.bincount(nup, weights=wts, minlength=n + 1); return c / c[0]
def szego(al):
    phi = np.array([1.0])
    for a in al: phi = np.concatenate([[0.0], phi]) + a * np.concatenate([phi[::-1], [0.0]])
    Q = phi; return np.concatenate([[0.0], Q]) + np.concatenate([Q[::-1], [0.0]])
def analyse(J, name):
    c = diag_poly(J); roots = np.roots(c[::-1]); G = np.array([gen(p)[:n // 2 + 1] for p in partitions(n)], float).T
    lp = linprog(np.zeros(G.shape[1]), A_eq=G, b_eq=c[:n // 2 + 1], bounds=(0, None))
    bestr = np.inf; bx = None
    for st in range(60):
        x0 = rng.normal(0, 2, n - 1)
        r = least_squares(lambda x: (szego(1 / (1 + np.exp(-x)))[1:n // 2 + 1] - c[1:n // 2 + 1]) / c[1:n // 2 + 1], x0, max_nfev=2000)
        if np.abs(r.fun).max() < bestr: bestr = np.abs(r.fun).max(); bx = 1 / (1 + np.exp(-r.x))
    t3 = third(c, hh).max()
    rec = dict(coeffs=c.tolist(), max_abs_root_minus_1=float(np.abs(np.abs(roots) - 1).max()), fk_cone_lp_feasible=bool(lp.status == 0),
               chain_fit_max_rel_residual=float(bestr), chain_parameters=np.round(bx, 6).tolist(), ghs_max_third_cumulant=float(t3))
    print(f"(D) {name}: coefficients c0..c4 = {np.round(c[:5], 6)}; max ||root|-1| = {rec['max_abs_root_minus_1']:.2e}; FK cone LP feasible: {rec['fk_cone_lp_feasible']}; "
          f"chain fit max relative residual = {bestr:.2e} with Schur-Cohn parameters {np.round(bx, 4)}; GHS max third cumulant = {t3:.3e}")
    out["D_" + name] = rec
Jcw = np.outer(l, l) / (4 * L); np.fill_diagonal(Jcw, 0); analyse(Jcw, "Curie-Weiss")
Ks = None
for attempt in range(200):
    edges = [(i, j) for i in range(9) for j in range(i + 1, 9) if rng.random() < 0.5]
    Aeq = np.zeros((9, len(edges)))
    for e, (i, j) in enumerate(edges): Aeq[i, e] = 1; Aeq[j, e] = 1
    lp = linprog(rng.random(len(edges)), A_eq=Aeq, b_eq=l, bounds=(0, None))
    if lp.status == 0:
        Ks = np.zeros((9, 9))
        for e, (i, j) in enumerate(edges): Ks[i, j] = Ks[j, i] = lp.x[e]
        break
print("(E) sparse sum-rule member found at attempt", attempt, ": edges with K>0:", int((np.triu(Ks) > 1e-12).sum()), " row-sum defect", np.abs(Ks.sum(1) - l).max())
analyse(Ks / 4, "sparse")
import importlib.util
spec = importlib.util.spec_from_file_location("sc", "stage_lib.py"); sc = importlib.util.module_from_spec(spec); spec.loader.exec_module(sc)
A2, om2 = sc.spin_stage(P23, Ks / 4); out["E_sparse"], _ = sc.zeros_box(A2, om2, label="zeta sparse sum-rule stage (kappa=0), primes<=23")
chi = np.exp(2j * np.pi * rng.random(9))
A3, om3 = sc.spin_stage(P23, Ks / 4, chi=chi); out["E_sparse_U"], _ = sc.zeros_box(A3, om3, label="sparse stage with unimodular twist U")
json.dump(out, open("supplement.json", "w"), indent=1)
