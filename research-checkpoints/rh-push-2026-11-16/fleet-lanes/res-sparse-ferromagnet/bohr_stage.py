"""Bohr-side pair ferromagnets on prime spins (depth 1, squarefree divisors of M).
Z_K(s) = sum_{n|M} w(n) n^{-s},  w(n) = exp(sum_{p<q, pq|n} K_pq + sum_{p|n} kappa_p) * chi(n).
Float64. Largest planned allocation: 2^12 terms x 4000 grid points complex128 = 262 MB.
"""
import numpy as np, json, itertools, sys
from scipy.optimize import linprog
rng = np.random.default_rng(20261117)
OUT = {}

def subsets(primes, K, kappa, chi=None):
    k = len(primes); lp = np.log(np.array(primes, float))
    logn = []; logw = []; ph = []
    for mask in range(1 << k):
        idx = [i for i in range(k) if mask >> i & 1]
        logn.append(lp[idx].sum())
        e = sum(kappa[i] for i in idx)
        for a in range(len(idx)):
            for b in range(a + 1, len(idx)):
                e += K[idx[a], idx[b]]
        logw.append(e)
        ph.append(np.prod([chi[i] for i in idx]) if chi is not None else 1.0)
    return np.array(logn), np.exp(np.array(logw)) * np.array(ph)

def evalZ(logn, w, s):
    s = np.atleast_1d(s)
    out = np.empty(s.shape, complex)
    CH = max(1, int(2.5e8 // (16 * len(logn))))
    print_once(f"planned chunk allocation: {len(logn)} terms x {CH} pts x 16 B = {len(logn)*CH*16/1e6:.0f} MB")
    for i in range(0, len(s), CH):
        out[i:i + CH] = np.exp(-np.outer(s[i:i + CH], logn)) @ w
    return out
_seen = set()
def print_once(m):
    if m not in _seen:
        _seen.add(m); print(m, flush=True)

def winding(f, s1, s2, t1, t2, n_vert=200000, n_hor=20000):
    """zeros of f in the box (analytic f), by phase unwrapping along the boundary"""
    def edge(a, b, n):
        z = a + (b - a) * np.linspace(0, 1, n)
        return f(z)
    tot = 0.0; mx = 0.0; mn = np.inf
    for a, b, n in [(s1 + 1j * t1, s2 + 1j * t1, n_hor), (s2 + 1j * t1, s2 + 1j * t2, n_vert),
                    (s2 + 1j * t2, s1 + 1j * t2, n_hor), (s1 + 1j * t2, s1 + 1j * t1, n_vert)]:
        v = edge(a, b, n)
        d = np.angle(v[1:] / v[:-1])
        tot += d.sum(); mx = max(mx, np.abs(d).max()); mn = min(mn, np.abs(v).min())
    return tot / (2 * np.pi), mx, mn

def line_sign_changes(logn, w, L, unit, t1, t2, n=400000):
    t = np.linspace(t1, t2, n)
    v = evalZ(logn, w, 0.5 + 1j * t) * np.exp(1j * t * L / 2) * unit
    im = np.abs(v.imag).max() / np.abs(v).max()
    r = v.real
    return int((np.sign(r[1:]) != np.sign(r[:-1])).sum()), im

def duality_defect(logn, w, L, chiM):
    s = np.array([0.3 + 2.7j, 0.8 + 11.3j, 1.4 + 40.1j, -0.2 + 77.7j])
    lhs = np.conj(evalZ(logn, w, 1 - np.conj(s)))
    rhs = np.conj(chiM) * np.exp((s - 0.5) * L) * evalZ(logn, w, s)
    return float(np.abs(lhs / rhs - 1).max())

def cw(primes):
    lp = np.log(np.array(primes, float)); L = lp.sum()
    K = np.outer(lp, lp) / L; np.fill_diagonal(K, 0)
    return K, lp ** 2 / (2 * L)

def sparse_lp(primes, edges):
    """nonneg edge weights with row sums log p, kappa = 0 (feasibility LP, random objective)"""
    lp = np.log(np.array(primes, float)); k = len(primes)
    A = np.zeros((k, len(edges)))
    for j, (a, b) in enumerate(edges):
        A[a, j] = 1; A[b, j] = 1
    r = linprog(rng.random(len(edges)), A_eq=A, b_eq=lp, bounds=(0, None), method="highs")
    if not r.success: return None
    K = np.zeros((k, k))
    for j, (a, b) in enumerate(edges):
        K[a, b] = K[b, a] = r.x[j]
    return K

def run_case(name, primes, K, kappa, chi=None, T=None, box=(-1.5, 2.5)):
    lp = np.log(np.array(primes, float)); L = lp.sum(); k = len(primes)
    a = (kappa + K.sum(1) / 2) / lp
    logn, w = subsets(primes, K, kappa, chi)
    if T is None: T = 2 * np.pi * 300 / L
    t1 = 0.0371; T = T + 0.0137
    f = lambda z: evalZ(logn, w, z)
    chiM = np.prod(chi) if chi is not None else 1.0
    unit = np.sqrt(np.conj(chiM) + 0j)
    res = dict(primes=list(map(int, primes)), logM=float(L), edges=int((K > 1e-14).sum() // 2),
               a_min=float(a.min()), a_max=float(a.max()), T=float(T))
    wn, mx, mn = winding(f, box[0], box[1], t1, T)
    res.update(zeros_in_box=round(wn), winding_raw=float(wn), max_phase_step=float(mx), min_abs_on_contour=float(mn))
    if a.max() - a.min() < 1e-12 and abs(a.mean() - 0.5) < 1e-12:
        sc, im = line_sign_changes(logn, w, L, unit, t1, T)
        res.update(sign_changes_on_line=sc, rel_imag_on_line=float(im), duality_defect=duality_defect(logn, w, L, chiM),
                   off_line=round(wn) - sc)
    else:
        d = 1e-3
        wr, mxr, _ = winding(f, a.max() + d, box[1], t1, T)
        wl, mxl, _ = winding(f, box[0], a.min() - d, t1, T)
        res.update(zeros_right_of_amax=round(wr), zeros_left_of_amin=round(wl), max_phase_step_lr=float(max(mxr, mxl)))
    # weights
    res["max_weight"] = float(np.abs(w).max()); res["weight_at_small_n"] = [float(abs(x)) for x in w[np.argsort(logn)][:8]]
    OUT[name] = res
    print(name, json.dumps(res), flush=True)

if __name__ == "__main__":
    P8 = [2, 3, 5, 7, 11, 13, 17, 19]
    P10 = P8 + [23, 29]
    # (a) Curie-Weiss, critical coupling c* = 1/(2 log M)
    K, kap = cw(P8); run_case("cw_P19", P8, K, kap)
    K, kap = cw(P10); run_case("cw_P29", P10, K, kap, T=60.0)
    # (b) sparse graph: cycle + a few chords, kappa = 0
    k = len(P10)
    Ks = None
    for trial in range(200):
        edges = [(i, j) for i in range(k) for j in range(i + 1, k) if rng.random() < 0.33]
        Ks = sparse_lp(P10, edges)
        if Ks is not None: break
    assert Ks is not None
    print("sparse graph trial", trial, "edges offered", len(edges), "edges used", int((Ks > 1e-14).sum() // 2), flush=True)
    run_case("sparse_cycle_P29", P10, Ks, np.zeros(k), T=60.0)
    # (c) far-coupled: small primes A = {2,3,5,7} coupled only to large primes; no A-A edge
    A = [0, 1, 2, 3]; B = [4, 5, 6, 7, 8, 9]
    edges = [(a, b) for a in A for b in B] + [(B[i], B[j]) for i in range(len(B)) for j in range(i + 1, len(B))]
    Kf = sparse_lp(P10, edges); assert Kf is not None
    run_case("far_coupled_P29", P10, Kf, np.zeros(k), T=60.0)
    # (d) unimodular twists (the hypotheses of control U at stage level)
    for nm, KK, kk in [("cw", cw(P10)[0], cw(P10)[1]), ("sparse", Ks, np.zeros(k))]:
        chi = np.exp(2j * np.pi * rng.random(k))
        run_case(f"twist_unimodular_{nm}_P29", P10, KK, kk, chi=chi, T=60.0)
    chi = np.array([1, -1, -1, 1, -1, 1, 1, -1, -1, 1], float)
    run_case("twist_sign_cw_P29", P10, cw(P10)[0], cw(P10)[1], chi=chi, T=60.0)
    # (e) arbitrary ferromagnetic K (no row-sum condition): zeros confined to [a_min, a_max]
    Kr = np.triu(rng.random((8, 8)) * (rng.random((8, 8)) < 0.4), 1); Kr = Kr + Kr.T
    run_case("random_K_P19", P8, Kr, np.zeros(8))
    # (f) HEAT below critical: c = c*/2 -> line Re s = 1/4 ; and antiferromagnetic c = -c*
    K, kap = cw(P8); run_case("cw_half_coupling_P19", P8, K / 2, kap / 2)
    run_case("cw_antiferro_P19", P8, -K, -kap, box=(-3.5, 2.5))
    # (g) TW: |eps_p| < 1 real
    eps = np.array([0.9, -0.8, 0.7, 1.0, -0.6, 0.95, 0.5, -1.0])
    K, kap = cw(P8); run_case("tw_nonunimodular_P19", P8, K, kap + np.log(np.abs(eps)), chi=np.sign(eps))
    json.dump(OUT, open("bohr_stage.json", "w"), indent=1)
