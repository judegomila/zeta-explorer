#!/usr/bin/env python3
"""price_levers.py -- copy of tmp/zf-high-side-xs-levers.py (prior note, MODEL / HEURISTIC pricing) with two extra count models:
  gm1  H-GM_fam applied only to inverse witness x selected slots (C1), paper capacities
  gm0  H-GM_fam applied only to the bare inverse witness M_r (no slots)
Nothing here is a proof.  Original docstring follows.
zf-high-side-xs-levers.py -- row-count levers inside the Xu--Sang (PR #14) endpoint system and, for comparison,
inside the 7/8 paper system (M + l = 1, range 2M >= 1 + 3l).  MODEL / HEURISTIC pricing; nothing here is a proof.

Both endpoints are affine in (b, l) bin by bin once the count R(delta, x) is fixed, so the re-tune ceiling for a
given count model is a linear programme:  maximise l  s.t.  E_i(b, l) <= -margin for every bin i on a fine
(delta, x) grid, plus the linear scalar gates; nonlinear gates are checked at the optimum.

Count models (R(delta, x)):
  xs        closed form R_kappa (Prop 19.2 / (20.8) with general kappa)          [imported, proved in source]
  del:dc    adaptive bins with delta >= dc deleted (count -> -inf)               [envelope: any improvement confined to delta >= dc]
  dh:dc     R -> 1 - delta for delta >= dc                                         [density-hypothesis counts there]
  eps:e     R -> R - e at every adaptive bin with delta >= 1/8                      [uniform count saving]
  epsge:e:dc  R -> R - e only for delta >= dc
  gma       family Guth--Maynard-type large-values count (hypothesis H-GM_fam), paper capacities
  gmb       same, natural capacities (polynomial length <= U), capped by the supply
H-GM_fam (UNPROVED, family analogue of Guth--Maynard 2024 [RECALLED]): for a witness polynomial of length N = U^n with
|W(u)|^2 >= U^S on a set of rows of a family of size U, #rows << U^(max(n - S, 8n/5 - 2S, 1 + 2n/5 - 2S) + eps).
It improves the mean-value count 1 - S only when S > 2n/5 (sigma_eff > 7/10), 8n/5 - 1 < S and n < 1.

Usage: zf-high-side-xs-levers.py <system> <model> [<model> ...]      system in {xs, xs75, paper}
"""
import sys, os, math, json, time, importlib.util
import numpy as np
from scipy.optimize import linprog

HERE = os.path.dirname(os.path.abspath(__file__))
ALPHA = 5 / 6
KMIN = 29991 / 40000

# ----------------------------------------------------------------------------- counts
def R_kappa(D, X, kappa):
    c = 1 / (3 * kappa)
    Dx = 3 - (1 + 2 * c) * X; Px = (2 - 2 * c * X) * (1 - X)
    J = (ALPHA - D) * Dx + D * Px
    return 1 - D + (ALPHA - D) * D * Px / (2 * J)

def gm_count(n0, S0, qq, zmax):
    """min over z in [0, zmax] of the H-GM_fam count for length n0 + z and spike S0 + qq z (all arrays)."""
    best = np.full(np.broadcast(n0, S0, zmax).shape, np.inf)
    def val(z):
        n = n0 + z; S = S0 + qq * z
        return np.maximum(np.maximum(n - S, 1.6 * n - 2 * S), 1 + 0.4 * n - 2 * S)
    with np.errstate(divide='ignore', invalid='ignore'):
        cands = [np.zeros_like(best), zmax,
                 (S0 - 0.6 * n0) / (0.6 - qq),
                 (1 - 0.6 * n0 - S0) / (0.6 + qq),
                 5 / 6 - n0 + 0 * S0]
    for z in cands:
        z = np.where(np.isfinite(z), z, 0.0)
        z = np.clip(z, 0.0, np.maximum(zmax, 0.0))
        best = np.minimum(best, val(z))
    return best

def best_cert(delta, x, r, m, Ssup, kappa, gm=None):
    """Best (smallest) count certificate for witness lengths (r, m) at bin (delta, x).  r, m arrays."""
    qq = 2 * x * delta
    c = 1 / (3 * kappa)
    zM = np.minimum((1 - r) / 2, (3 - 2 * r) / 8)
    zM_nat = 1 - r
    zP = (1 - 2 * m) * c / 2           # = (1 - 2m)/(6 kappa)
    zP1 = (1 - m) * c / 2
    zP_nat = 1 - 2 * m
    zP1_nat = 1 - m
    inf = np.inf
    c1 = np.where(r < 1, 1 - delta * r - qq * np.clip(zM, 0, Ssup), inf)
    c2 = np.maximum(1.0, 1 - ALPHA + ALPHA * r) - delta * r
    c3 = np.where(m < 0.5, 1 - 2 * delta * m - qq * np.clip(zP, 0, Ssup), 1 - 2 * delta * m)
    c3b = np.where(m < 0.5, 1 - delta * m - qq * np.clip(zP1, 0, Ssup), inf)
    best = np.minimum(np.minimum(c1, c2), np.minimum(c3, c3b))
    for k in range(1, 12):
        best = np.minimum(best, np.where(k * r <= 0.5, 1 - k * delta * r, inf))
        best = np.minimum(best, np.where(k * m <= 0.5, 1 - k * delta * m, inf))
    if gm in ('1', '0'):
        zm1 = np.clip(zM, 0, Ssup) if gm == '1' else 0.0 * np.clip(zM, 0, Ssup)
        g1 = np.where(r < 1, gm_count(r, delta * r, qq, zm1), inf)
        return np.minimum(best, g1)
    if gm is not None:
        if gm == 'a':
            zm1, zm3, zm3b = np.clip(zM, 0, Ssup), np.clip(zP, 0, Ssup), np.clip(zP1, 0, Ssup)
        else:
            zm1, zm3, zm3b = np.clip(zM_nat, 0, Ssup), np.clip(zP_nat, 0, Ssup), np.clip(zP1_nat, 0, Ssup)
        g1 = np.where(r < 1, gm_count(r, delta * r, qq, zm1), inf)
        g3 = gm_count(2 * m, 2 * delta * m, qq, zm3)
        g3b = gm_count(m, delta * m, qq, zm3b)
        best = np.minimum(best, np.minimum(g1, np.minimum(g3, g3b)))
    return best

def minimax_count(delta, x, Ssup, kappa, gm=None, nt=31, nr=121, nm=41, refine=3):
    """R = min_t max_{r <= t, r + m >= t, 0 <= m <= 1/2} best_cert.  m sampled on [t - r, 1/2] (GM certificates are
    not monotone in m, so the adversary may take m > t - r).  The inner max is refined locally around the coarse
    argmax (the worst configuration sits on a kink, e.g. the C1/C3 crossing), so the grid error is ~1e-6."""
    def F(t):
        rlo = max(t - 0.5, 0.0)
        r = np.linspace(rlo, t, nr).reshape(-1, 1)
        u = np.linspace(0.0, 1.0, nm).reshape(1, -1)
        mlo = np.clip(t - r, 0.0, 0.5)
        m = mlo + (0.5 - mlo) * u
        v = best_cert(delta, x, r, m, Ssup, kappa, gm)
        best = float(v.max())
        dr, du = (t - rlo) / (nr - 1), 1.0 / (nm - 1)
        # refine around the top few coarse maxima
        prof = v.max(axis=1)
        jarg = v.argmax(axis=1)
        locs = [i for i in range(len(prof)) if (i == 0 or prof[i] >= prof[i - 1]) and (i == len(prof) - 1 or prof[i] >= prof[i + 1])]
        locs = sorted(locs, key=lambda i: -prof[i])[:6]
        for i in locs:
            j = int(jarg[i])
            rc, uc = float(r[i, 0]), float(u[0, j])
            sr, su = dr, du
            for _ in range(3):
                rr = np.clip(np.linspace(rc - 2 * sr, rc + 2 * sr, 41), rlo, t).reshape(-1, 1)
                uu = np.clip(np.linspace(uc - 2 * su, uc + 2 * su, 41), 0.0, 1.0).reshape(1, -1)
                ml = np.clip(t - rr, 0.0, 0.5)
                mm = ml + (0.5 - ml) * uu
                vv = best_cert(delta, x, rr, mm, Ssup, kappa, gm)
                k = np.unravel_index(int(vv.argmax()), vv.shape)
                best = max(best, float(vv[k]))
                rc, uc = float(rr[k[0], 0]), float(uu[0, k[1]])
                sr, su = sr / 10, su / 10
        return best
    ts = np.linspace(1.0, 1.5, nt)
    vals = np.array([F(t) for t in ts])
    j = int(vals.argmin()); best = vals[j]
    lo, hi = ts[max(j - 1, 0)], ts[min(j + 1, nt - 1)]
    for _ in range(refine):
        ts2 = np.linspace(lo, hi, 21)
        v2 = np.array([F(t) for t in ts2])
        j2 = int(v2.argmin()); best = min(best, v2[j2])
        lo, hi = ts2[max(j2 - 1, 0)], ts2[min(j2 + 1, 20)]
    return min(best, 1.0)

# ----------------------------------------------------------------------------- endpoints as affine forms in (b, l)
def xs_affine(D, X, R, kappa):
    """E_XS = e0 + eb b + el l (exact expansion of the PR #14 endpoint)."""
    c = 1 / (3 * kappa)
    # C0 = -1/4 + b/6 + 5l/4 ; h = (1+b+3l)/2 ; ly = (1+b-l)/2 ; h/4 - ly/2 = (-1 - b + 5l)/8
    e0 = -0.25 + D / 2 + D * X * c * (-1 / 8) - 0.375 * (1 - R)
    eb = 1 / 6 + D * X * c * (-1 / 8) - 0.375 * (1 - R)
    el = 1.25 + D * X * (1 + c * 5 / 8) - 1.125 * (1 - R)
    return e0, eb, el

def paper_affine(D, X, R):
    """E_paper (7/8 paper (20.4) at d = h, M + l = 1, sigma0 = 11/12 - l/4) = C0 + delta/2 + delta l + delta x l - h(1-R)."""
    e0 = -0.25 + D / 2 - 0.5 * (1 - R)
    eb = 1 / 6 - 0.5 * (1 - R)
    el = 1.25 + D + D * X - 1.5 * (1 - R)
    return e0, eb, el

def lp_ceiling(rows, gates_lin, l_bounds=(1 / 6, 0.2), b_bounds=(0.0, 0.25)):
    """maximise l s.t. eb b + el l <= -e0 (rows) and linear gates (list of (gb, gl, rhs) meaning gb b + gl l <= rhs)."""
    A = [[eb, el] for (e0, eb, el) in rows] + [[gb, gl] for (gb, gl, rhs) in gates_lin]
    ub = [-e0 for (e0, eb, el) in rows] + [rhs for (gb, gl, rhs) in gates_lin]
    res = linprog(c=[0, -1], A_ub=np.array(A), b_ub=np.array(ub), bounds=[b_bounds, l_bounds], method='highs')
    if not res.success:
        return None
    b, l = res.x
    return b, l

def xs_linear_gates(kappa, margin=1e-9):
    """Linear PR #14 gates written as gb b + gl l <= rhs (strictness via margin).  Non-linear: small_delta (Asm)."""
    G = []
    G.append((-1, 0, -margin))                                   # b > 0
    G.append((0, -1, -1 / 6 - margin))                           # l > 1/6
    G.append((0, 1, 0.2 - margin))                               # l < 1/5
    # lx - l = (1 - b - l)/2 - l > 0  ->  b + 3l < 1
    G.append((1, 3, 1 - margin))
    # ly - l - 11b/6 > 0 -> (1 + b - l)/2 - l - 11b/6 > 0 -> (4/3) b + (3/2) l < 1/2
    G.append((4 / 3, 1.5, 0.5 - margin))
    # 6 kappa l > 3/4
    G.append((0, -6 * kappa, -0.75 - margin))
    # 1/(6 kappa) - l/h > 0 -> l (12 kappa - 3) < 1 + b
    G.append((-1, 12 * kappa - 3, 1 - margin))
    # l/(h + zeta) > 21/100, zeta ~ 0 -> 2l > 0.21 (1 + b + 3l) -> 0.21 b + (0.63 - 2) l < -0.21
    G.append((0.21, 0.63 - 2, -0.21 - margin))
    # ly - h/2 > 0 -> 1 + b - 5l > 0
    G.append((-1, 5, 1 - margin))
    # 1/2 - ly > 0 -> l - b > 0
    G.append((1, -1, -margin))
    # floor: C0 + (1 + 3l)/100 < -1/100 -> b/6 + (5/4 + 3/100) l < 1/4 - 2/100
    G.append((1 / 6, 1.25 + 0.03, 0.25 - 0.02 - margin))
    # small rows: h(17/50 - 1/6) - ly/2 + 1/50 < -1/20 ; h(26/150) - ly/2 = (1+b+3l)(13/150) - (1+b-l)/4
    k = 13 / 150
    G.append((k - 0.25, 3 * k + 0.25, -0.05 - 0.02 - k + 0.25 - margin))
    return G

def xs_small_delta_ok(b, l):
    h = (1 + b + 3 * l) / 2
    C0 = -0.25 + b / 6 + 5 * l / 4
    Asm = 0.5 + (l / 2) * (0.5 + 2 * l / h) - h / 2
    return -1 / 250 - max(C0, C0 + Asm / 8) > 0

def paper_linear_gates(margin=1e-9):
    """7/8 paper side conditions on M + l = 1 with range 2M >= 1 + 3l (prior note Sec. 2, 3.1)."""
    G = []
    G.append((-1, 0, -margin))                       # b > 0
    G.append((0, 1, 0.2 - margin))                   # 2M >= 1 + 3l  <=> l <= 1/5
    G.append((4 / 3, 1.5, 0.5 - margin))             # ly - l - 11b/6 > 0
    G.append((1, 3, 1 - margin))                     # lx - l > 0
    # supply l/h > 7/37: 2l > (7/37)(1 + b + 3l)
    s = 7 / 37
    G.append((s, 3 * s - 2, -s - margin))
    # floor (20.5): C0 + delta0 (1/2 + 3l/2) < 0 with delta0 = 1/50  -> b/6 + (5/4 + 3/100) l < 1/4 - 1/100
    G.append((1 / 6, 1.25 + 0.03, 0.25 - 0.01 - margin))
    # (20.7): delta = alpha, R = 1 - alpha, x = 1/2: E = C0 + alpha/2 + alpha l + alpha l/2 - h alpha
    a = ALPHA
    # = -1/4 + b/6 + 5l/4 + a/2 + 3 a l /2 - a (1 + b + 3l)/2
    G.append((1 / 6 - a / 2, 1.25 + 1.5 * a - 1.5 * a, 0.25 - a / 2 + a / 2 - margin))
    # small rows (20.6): h(17/50 - 1/6) - ly/2 < 0
    k = 13 / 150
    G.append((k - 0.25, 3 * k + 0.25, -k + 0.25 - margin))
    return G

def paper_d_half_ok(b, l):
    """(20.11) with the paper's t = 1 count at d = 1/2 (adaptive count is used for d <= 1/2 in '+ah' mode; this
    check uses the paper's count, conservative)."""
    h = (1 + b + 3 * l) / 2; ly = (1 + b - l) / 2; s0 = 11 / 12 - l / 4
    worst = -1e9
    for dl in np.linspace(1 / 50, ALPHA, 201):
        a = (1 + dl) / 2
        R = 76 / 75 - 2 * dl / 3
        E = a - s0 + h * (17 / 50 - 1 / 6) - a * ly - l / 2 + 0.5 * dl * l + 0.5 * (R + dl / 2 - 17 / 50)
        worst = max(worst, E)
    return worst < 0, worst

# ----------------------------------------------------------------------------- scenario driver
def count_table(model, kappa, D, X, Ssup):
    R = R_kappa(D, X, kappa)
    name = model.split(':')
    if name[0] == 'xs':
        return R
    if name[0] == 'del':
        dc = float(name[1]); return np.where(D >= dc, -np.inf, R)
    if name[0] == 'dh':
        dc = float(name[1]); return np.where(D >= dc, 1 - D, R)
    if name[0] == 'eps':
        e = float(name[1]); return np.where(D >= 1 / 8, R - e, R)
    if name[0] == 'epsge':
        e, dc = float(name[1]), float(name[2]); return np.where(D >= dc, R - e, R)
    if name[0] in ('gma', 'gmb', 'gm1', 'gm0'):
        gm = {'gma': 'a', 'gmb': 'b', 'gm1': '1', 'gm0': '0'}[name[0]]
        out = R.copy()
        it = np.nditer([D, X], flags=['multi_index'])
        for dl, x in it:
            dl, x = float(dl), float(x)
            if dl > 0.4 and 2 * x * dl > 0:   # sigma_eff > 7/10 needs delta > 2/5
                out[it.multi_index] = min(R[it.multi_index], minimax_count(dl, x, Ssup, kappa, gm))
        return out
    raise ValueError(model)

def run(system, model, kappa=KMIN, Ssup=0.21):
    t0 = time.time()
    fine = model.split(':')[0] not in ('gma', 'gmb', 'gm1', 'gm0')
    if fine:
        dgrid = np.linspace(0.0, ALPHA, 3334); xgrid = np.linspace(0.0, 0.5, 26)
    else:
        dgrid = np.concatenate([np.linspace(0.0, 0.4, 801), np.linspace(0.4005, 0.62, 89), np.linspace(0.625, ALPHA, 21)])
        xgrid = np.array([0.0, 0.25, 0.35, 0.42, 0.46, 0.5])
    D, X = np.meshgrid(dgrid, xgrid, indexing='ij')
    if system == 'paper':
        kappa = 0.75
        Ssup = 7 / 37 + 0.01
    R = count_table(model, kappa, D, X, Ssup)
    keep = np.isfinite(R)
    Dk, Xk, Rk = D[keep], X[keep], R[keep]
    if system.startswith('xs'):
        e0, eb, el = xs_affine(Dk, Xk, Rk, kappa)
        gates = xs_linear_gates(kappa)
    else:
        e0, eb, el = paper_affine(Dk, Xk, Rk)
        gates = paper_linear_gates()
    rows = list(zip(e0.ravel(), eb.ravel(), el.ravel()))
    if system.startswith('xs'):
        gates = gates + [(1 / 6, 1.25, 0.25 - 1 / 250 - 1e-9)]          # small-delta gate, first branch C0 < -1/250
    sol = lp_ceiling(rows, gates)
    if sol is None:
        return dict(system=system, model=model, status='infeasible')
    b, l = sol
    ncuts = 0
    while system.startswith('xs') and not xs_small_delta_ok(b, l) and ncuts < 60:
        # convex second branch g = C0 + Asm/8 <= -1/250: add the tangent cut at the current point (outer approx.)
        H = 1 + b + 3 * l
        g = -0.25 + b / 6 + 1.25 * l + (0.5 + l / 4 + 2 * l * l / H - H / 4) / 8
        gb = 1 / 6 + (-2 * l * l / H ** 2 - 0.25) / 8
        gl = 1.25 + (0.25 + 4 * l / H - 6 * l * l / H ** 2 - 0.75) / 8
        gates = gates + [(gb, gl, -1 / 250 - 1e-9 - g + gb * b + gl * l)]
        sol = lp_ceiling(rows, gates)
        if sol is None:
            return dict(system=system, model=model, status='infeasible')
        b, l = sol; ncuts += 1
    B = 11 / 12 - l / 4
    # binding bins
    Ev = e0 + eb * b + el * l
    idx = np.argsort(-Ev)[:3]
    binding = [(round(float(Dk[i]), 5), round(float(Xk[i]), 3), round(float(Ev[i]), 9), round(float(Rk[i]), 5)) for i in idx]
    extra = {}
    if system.startswith('xs'):
        extra['small_delta_gate_ok'] = bool(xs_small_delta_ok(b, l))
    else:
        extra['d_half_ok_paper_count'] = bool(paper_d_half_ok(b, l)[0])
    # which linear gates are tight
    tight = [i for i, (gb, gl, rhs) in enumerate(gates) if abs(gb * b + gl * l - rhs) < 1e-7]
    return dict(system=system, model=model, kappa=kappa, b=round(b, 7), l=round(l, 9), B=round(B, 10),
                gain_vs_7_8=round(0.875 - B, 7), binding=binding, tight_gates=tight, secs=round(time.time() - t0, 1), **extra)

if __name__ == '__main__' and sys.argv[1] != 'bin':
    system = sys.argv[1]
    kap = 0.75 if system == 'xs75' else KMIN
    for model in sys.argv[2:]:
        out = run(system, model, kappa=kap)
        print(json.dumps(out)); sys.stdout.flush()

def single_bin():
    k = KMIN; dstar = 0.469344941; S = 0.210493
    for gm in (None, 'a', '1', '0'):
        print('single bin (delta*, 1/2), supply 0.210493, model', gm, ':', round(minimax_count(dstar, 0.5, S, k, gm), 6))
if len(sys.argv) > 1 and sys.argv[1] == 'bin':
    single_bin()
