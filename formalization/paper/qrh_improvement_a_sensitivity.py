#!/usr/bin/env python3
"""Numerical sensitivity study for formalization/paper/qrh-improvement-attempt-a.md (floating point, NOT a certificate).

For the closing argument of OpenAI's 7/8 manuscript (Part II, Sections 12-20) this script asks: if the free geometry
(ell, M, b) is re-optimised, and if one input estimate is replaced by a stronger hypothetical one, what is the smallest
boundary theta for which every closing inequality of Section 20 still holds?

Inputs that can be varied (paper values in brackets):
  alpha  slope of the sixth-power amplified inverse moment, Lemma 17.6 / Eq. (19.3)          [5/6]
  k      plain capacity coefficient 1/(6 kappa) of Lemma 18.1 at the baseline kappa = 3/4    [2/9]
  cM     inverse capacity coefficient, z <= cM (1 - r), from Lemma 17.1 (r + 2z < 1)          [1/2]
  tau    relaxation of the dual-length condition M + ell <= 1 of Lemma 15.1                    [0]
  perfect  density-hypothesis counts R = 1 - delta in every adaptive bin                       [False]
  d0     floor bin width delta0 (floor real part 1/2 + delta0/2)                                [1/50]
  cp     exponent of the additive Gram loss P_a^cp in Prop. 15.2 (low exponent l_x/2 + cp b/2)  [1/6]
The exact model is documented in verify_qrh_improvement_a.py. Run time a few minutes; prints one line per case.
"""
import sys
import numpy as np

Z0 = 17 / 50
DMAX = 5 / 6  # bin ceiling kappa <= 5/6 from the 11/12 theorem

DS = np.linspace(1 / 50, DMAX, 241)
XS = np.linspace(0, 0.5, 26)
D, X = np.meshgrid(DS, XS)


def rstar_closed(delta, x, alpha, k, cM):
    Dx = 3 - 2 * x * cM - 4 * x * k
    Px = (1 - 2 * x * cM) * (2 - 4 * x * k)
    J = (alpha - delta) * Dx + delta * Px
    with np.errstate(divide="ignore", invalid="ignore"):
        R = 1 - delta + (alpha - delta) * delta * Px / (2 * J)
    return np.where(delta >= alpha, 1 - delta, R)


def rstar_capped(delta, x, alpha, k, cM, supply, nt=61, nr=61):
    """Prop. 19.2 optimisation done numerically, with every prime capacity capped by the available length."""
    best = np.full(np.shape(delta), 9.0)
    for t in np.linspace(1.0, 1.5, nt):
        L = np.where(alpha >= delta, 1 - alpha + (alpha - delta) * t, 1 - delta)
        worst = np.full(np.shape(delta), -9.0)
        for r in np.linspace(t - 0.5, min(t, 1.0), nr):
            if r >= 1.0 and t > 1.0:
                continue
            m = min(max(t - r, 0.0), 0.5)
            AI = 1 - delta * r - 2 * x * delta * min(cM * (1 - r), supply)
            St = 1 - 2 * delta * m - 2 * x * delta * min(k * max(1 - 2 * m, 0.0), supply)
            worst = np.maximum(worst, np.minimum(AI, St))
        best = np.minimum(best, np.maximum(L, worst))
    return best


def max_constraint(ell, b, S):
    M = 1 + S["tau"] - ell
    lx, ly = (M - b) / 2, (M + b) / 2
    h = 1 + ell - lx
    sigma0 = 1 - h / 6 + S["cp"] * b / 2

    def E(d, delta, R, q):
        a = (1 + delta) / 2
        return a - sigma0 + h * (Z0 - 1 / 6) - a * ly - ell / 2 + q * ell + d * (R + delta / 2 - Z0)

    c = []
    if S["perfect"]:
        c.append(E(h, DS, 1 - DS, DS / 2).max())
    else:
        if S["capped"]:
            Dc, Xc = np.meshgrid(DS[::5], np.array([0.0, 0.2, 0.35, 0.45, 0.5]))
            R = rstar_capped(Dc, Xc, S["alpha"], S["k"], S["cM"], ell / h - 1e-3)
            c.append(E(h, Dc, R, Xc * Dc).max())
        else:
            c.append(E(h, D, rstar_closed(D, X, S["alpha"], S["k"], S["cM"]), X * D).max())
            # supply must cover the largest capacity used (closed form assumes uncapped capacities)
            xx = np.linspace(0, 0.5, 201)
            Dx = 3 - 2 * xx * S["cM"] - 4 * xx * S["k"]
            r1 = ((2 - 4 * xx * S["k"]) + 2 * xx * (S["k"] - S["cM"])) / Dx
            cap = max((S["cM"] * (1 - r1)).max(), S["k"] / 3)
            c.append(cap - ell / h + 1e-3)
        c.append(E(0.5, DS, 76 / 75 - 2 * DS / 3, DS / 2).max())  # Eq. (20.11): d <= 1/2 without primes
    d0 = S["d0"]
    c.append(E(h, d0, 1.0, d0 / 2))                                # floor bin, Eq. (20.5)
    c.append(h * (Z0 - 1 / 6) - ly / 2 + 63 / 50 / 100)             # small rows, Eq. (20.6)
    c.append(-(lx - ell) + 1e-3)                                   # Prop. 15.3 length conditions
    c.append(-(ly - ell - (2 - S["cp"]) * b) + 1e-3)
    c.append(-(M - 2 * ell) + 1e-3)
    c.append(1 + 3 * ell - 2 * M)                                  # Lemma 15.1 energy at d = 0
    return max(c)


def best_b(ell, S):
    grid = np.linspace(0.0, 0.3, 31)
    vals = [max_constraint(ell, b, S) for b in grid]
    b0 = grid[int(np.argmin(vals))]
    for w in [0.01, 0.002]:
        g = np.linspace(max(0.0, b0 - 5 * w), b0 + 5 * w, 11)
        vals = [max_constraint(ell, b, S) for b in g]
        b0 = g[int(np.argmin(vals))]
    return min(vals), b0


def solve_2d(S):
    """General cp: sigma0 depends on b too; refine a 2-D grid on M + ell = 1 + tau."""
    best = None
    L, B = np.linspace(0.10, 0.22, 49), np.linspace(0.0, 0.3, 61)
    for _ in range(4):
        for ell in L:
            for b in B:
                if max_constraint(ell, b, S) <= 0:
                    M = 1 + S["tau"] - ell
                    h = 1 + ell - (M - b) / 2
                    s0 = 1 - h / 6 + S["cp"] * b / 2
                    if best is None or s0 < best[0]:
                        best = (s0, ell, b)
        if best is None:
            return None
        wl, wb = (L[-1] - L[0]) / 8, (B[-1] - B[0]) / 8
        L = np.linspace(best[1] - wl, best[1] + wl, 33)
        B = np.linspace(max(0.0, best[2] - wb), best[2] + wb, 33)
    return best


def solve(S):
    if abs(S["cp"] - 1 / 6) > 1e-12:
        return solve_2d(S)
    lo, hi = 1 / 6 - 0.02, 0.26
    f, b = best_b(lo, S)
    if f > 0:
        return None
    bb = b
    for _ in range(22):
        mid = (lo + hi) / 2
        f, b = best_b(mid, S)
        if f <= 0:
            lo, bb = mid, b
        else:
            hi = mid
    return 11 / 12 - lo / 4 + S["tau"] / 12, lo, bb


BASE = dict(alpha=5 / 6, k=2 / 9, cM=0.5, tau=0.0, perfect=False, capped=False, d0=1 / 50, cp=1 / 6)
CASES = [
    ("paper inputs, geometry re-tuned", {}),
    ("alpha = 4/5", dict(alpha=4 / 5)),
    ("alpha = 2/3", dict(alpha=2 / 3)),
    ("k = 1/4", dict(k=1 / 4)),
    ("k = 1/3", dict(k=1 / 3)),
    ("cM = 3/4 (capacity capped by supply)", dict(cM=0.75, capped=True)),
    ("cM = 1 (capacity capped by supply)", dict(cM=1.0, capped=True)),
    ("alpha=2/3, k=1/3, cM=1 combined (capped)", dict(alpha=2 / 3, k=1 / 3, cM=1.0, capped=True)),
    ("tau = 0.01", dict(tau=0.01)),
    ("tau = 0.05", dict(tau=0.05)),
    ("density-hypothesis counts, floor 51/100", dict(perfect=True)),
    ("density-hypothesis counts, floor 0.501", dict(perfect=True, d0=0.002)),
    ("additive Gram loss P_a^(1/12)", dict(cp=1 / 12)),
    ("additive Gram loss none (cp = 0)", dict(cp=0.0)),
    ("cp = 0 and density-hypothesis counts", dict(cp=0.0, perfect=True)),
]

if __name__ == "__main__":
    which = sys.argv[1:]
    for name, mod in CASES:
        if which and not any(w in name for w in which):
            continue
        S = dict(BASE)
        S.update(mod)
        r = solve(S)
        if r is None:
            print(f"{name:44s} infeasible at ell = 1/6 - 0.02", flush=True)
            continue
        th, ell, b = r
        print(f"{name:44s} theta* ~ {th:.6f}   (ell ~ {ell:.5f}, b ~ {b:.4f}, M = 1 + tau - ell)", flush=True)
