"""Scalar comparison systems for the cubic-theta zero-free argument.

Exponent formulas transcribed from Liu, arXiv:2610.26835v2:
  counts (14.3); full class exponent (14.7) (averaged numerator);
  pointwise numerator (15.2)-(15.3); direct majorant B_low (Section 15.1).
General (unequal) lengths: lx, ly, l;  M = lx+ly, b = ly-lx, h = 1-lx+l,
  C(s) = s - 5/6 + lx/3 + l/6.

Everything here is a statement about an inequality system (MODEL when the
geometry is outside the range in which the source proves its lemmas).
Float LP (HiGHS) + bisection; not a certificate.
"""
import sys
import numpy as np
from scipy.optimize import linprog

Z0 = 17.0 / 50.0
THETA_SCALE = 1.0   # 1 = source capacity theta <= g/(6 kappa); >1 is a hypothetical input (price list only)


def count_R(delta, x, kappa, alpha=5.0 / 6.0):
    c = 1.0 / (3.0 * kappa)
    D = 3.0 - (1.0 + 2.0 * c) * x
    P = (2.0 - 2.0 * c * x) * (1.0 - x)
    J = (alpha - delta) * D + delta * P
    return 1.0 - delta + (alpha - delta) * delta * P / (2.0 * J)


def low_rows(B):
    """Rows (coef on lx,ly,l ; rhs) for B_low <= B, i.e. each branch <= B.
    B_low = 5/6 + lx/6 - l/6 + G + k/2,
    G in {0, b/12, b - ly/2},  k in {0,(1+3l-2M)/4, M+l-1, (3l-1)/2}."""
    rows = []
    Gs = [(np.zeros(3), 0.0),
          (np.array([-1 / 12, 1 / 12, 0.0]), 0.0),
          (np.array([-1.0, 0.5, 0.0]), 0.0)]
    ks = [(np.zeros(3), 0.0),
          (np.array([-0.5, -0.5, 0.75]), 0.25),
          (np.array([1.0, 1.0, 1.0]), -1.0),
          (np.array([0.0, 0.0, 1.5]), -0.5)]
    base = np.array([1 / 6, 0.0, -1 / 6])
    for gc, g0 in Gs:
        for kc, k0 in ks:
            coef = base + gc + 0.5 * kc
            const = 5 / 6 + g0 + 0.5 * k0
            rows.append((coef, B - const))
    return rows


def class_row(kind, delta, x, B, kappa, Rfun=count_R, Kmode="fourth"):
    """Affine form of E in (lx, ly, l): returns (coef, const) with E = coef.v + const.
    kind: 'pt_left' (w=1-a), 'pt_right' (w=a), 'av_max' (theta=g/(6k)), 'av_0'."""
    a = 0.5 * (1.0 + delta)
    g = delta * x
    R = Rfun(delta, x, kappa)
    # h = 1 - lx + l
    hc = np.array([-1.0, 0.0, 1.0]); h0 = 1.0
    lyc = np.array([0.0, 1.0, 0.0])
    lc = np.array([0.0, 0.0, 1.0])
    if kind in ("pt_left", "pt_right"):
        if kind == "pt_left":
            w, p = 1.0 - a, delta / 2.0
        else:
            w, p = a, 0.0
        hk = R - 1.0 / 6.0 + p
        coef = hk * hc + (w - 1.0) * lyc + (g - 0.5) * lc
        const = a - B + hk * h0
    else:
        theta = min(THETA_SCALE * g / (6.0 * kappa), delta / 2.0) if kind == "av_max" else 0.0
        if Kmode == "fourth":
            K = (3.0 * R + 1.0) / 4.0
        elif Kmode == "lindelof":
            K = R
        else:
            raise ValueError
        hk = K + theta / 2.0 - 1.0 / 6.0
        coef = hk * hc - (0.5 + theta) * lyc + (g - 0.5) * lc
        const = a - B + hk * h0
    return coef, const


def solve(B, kinds, region, balanced=False, nd=121, nx=41, kappa=None,
          dmin=0.125, Rfun=count_R, Kmode="fourth", extra_rows=(), lmax=0.5,
          lowfun=low_rows):
    """min t s.t. E_class <= t (for the listed kinds: ALL listed kinds are imposed
    only if len(kinds)==1; otherwise use solve_mixed), B_low <= B, region.
    region 'A': ly >= h/2 ; 'B': ly <= h/2 ; None: no constraint."""
    if kappa is None:
        kappa = min(1.0, max(13.0 / 18.0, 2.0 * B - 1.0))
    A = []; ub = []
    for coef, rhs in lowfun(B):
        A.append(np.append(coef, 0.0)); ub.append(rhs)
    dmax = min(5.0 / 6.0, 2.0 * B - 1.0)
    for delta in np.linspace(dmin, dmax, nd):
        for x in np.linspace(0.0, 0.5, nx):
            coef, const = class_row(kinds[0], delta, x, B, kappa, Rfun, Kmode)
            A.append(np.append(coef, -1.0)); ub.append(-const)
    # region: ly - h/2 >= 0  <=>  -ly + (1 - lx + l)/2 <= 0
    if region == "A":
        A.append(np.array([-0.5, -1.0, 0.5, 0.0])); ub.append(-0.5)
    elif region == "B":
        A.append(np.array([0.5, 1.0, -0.5, 0.0])); ub.append(0.5)
    for r, rhs in extra_rows:
        A.append(np.append(r, 0.0)); ub.append(rhs)
    Aeq = None; beq = None
    if balanced:  # M + l = 1
        Aeq = np.array([[1.0, 1.0, 1.0, 0.0]]); beq = np.array([1.0])
    res = linprog(c=[0, 0, 0, 1.0], A_ub=np.array(A), b_ub=np.array(ub),
                  A_eq=Aeq, b_eq=beq,
                  bounds=[(0, 1), (0, 1), (0, lmax), (None, None)], method="highs")
    if res.status != 0:
        return None, None
    return res.x[3], res.x[:3]


def bisect(f, lo, hi, it=60):
    """f(B) = t*(B) (None = infeasible low side -> treat as +1). Find smallest B with t<=0."""
    def val(B):
        t, v = f(B)
        return 1.0 if t is None else t
    assert val(hi) <= 0, "upper end infeasible"
    for _ in range(it):
        mid = 0.5 * (lo + hi)
        if val(mid) <= 0:
            hi = mid
        else:
            lo = mid
    return hi


def worst_class(v, B, kinds, kappa=None, n=400, dmin=0.125, Rfun=count_R, Kmode="fourth"):
    if kappa is None:
        kappa = min(1.0, max(13.0 / 18.0, 2.0 * B - 1.0))
    best = (-9, None)
    dmax = min(5.0 / 6.0, 2.0 * B - 1.0)
    for delta in np.linspace(dmin, dmax, n):
        for x in np.linspace(0.0, 0.5, n // 4 + 1):
            e = min(np.dot(class_row(k, delta, x, B, kappa, Rfun, Kmode)[0], v)
                    + class_row(k, delta, x, B, kappa, Rfun, Kmode)[1] for k in kinds)
            if e > best[0]:
                best = (e, (delta, x))
    return best


if __name__ == "__main__":
    np.set_printoptions(precision=9, suppress=True)
    print("check: R_kappa(xi,1/2) with kappa=2B_inf-1, xi=0.388584:",
          count_R(0.3885848, 0.5, 2 * 0.874957019420099 - 1))
    runs = [
        ("S0  pointwise, free geometry, region A (w=1-a)", ["pt_left"], "A", False),
        ("S0' pointwise, free geometry, region B (w=a)", ["pt_right"], "B", False),
        ("S1  averaged theta=max, balanced M+l=1, region A", ["av_max"], "A", True),
        ("S3  averaged theta=max, FREE geometry, region A", ["av_max"], "A", False),
        ("S3' averaged theta=0,   FREE geometry, region B", ["av_0"], "B", False),
    ]
    for name, kinds, region, bal in runs:
        f = lambda B: solve(B, kinds, region, balanced=bal)
        try:
            Bs = bisect(f, 0.80, 0.95)
        except AssertionError as e:
            print(name, "->", e); continue
        t, v = f(Bs)
        lx, ly, l = v
        wc = worst_class(v, Bs, kinds)
        print(f"{name}\n   B* = {Bs:.12f}  lx={lx:.6f} ly={ly:.6f} l={l:.6f}  M+l={lx+ly+l:.6f} b={ly-lx:.6f} h={1-lx+l:.6f}"
              f"  worst class (delta,x)={wc[1]} E={wc[0]:.2e}")
