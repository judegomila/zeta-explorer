"""r3-lemma181-a: the numerator first moment in the Xu-Sang / Liu II comparison system.

Self-contained re-implementation of the scalar system (formulas: Liu 2610.26835v2 (14.3), (14.5), (14.7),
Section 15.1; Xu-Sang 2610.15291v2 Prop 4.1, Prop 5.1), free lengths, region ly >= h/2.
Everything except run "M0" is a MODEL value (hypothetical numerator input), not a bound.

Blockwise numerator exponent.  For a class (delta, x), q = delta*x, count exponent R, the first moment
  Sum_{u in B} |L(1/2+theta+it, psi_u)|  <<  U^{N(theta)},
  N(theta) = max_{0<=m<=1/2} min( P(m), F4(m), [F6(m)] ) ,
  P(m)  = R + (delta/2 - theta) m                      class pointwise bound |S_m|^2 <= U^{delta m}
  F4(m) = (3R+1)/4 - d4 - theta m - q(1-2m)/(12 kappa)  Lemma 18.1, two copies, prime length (1-2m)/(6 kappa)
  F6(m) = (5R+1+omega)/6 - theta m                      HYPOTHETICAL zero-slot sixth moment U^{1+omega}
Endpoint (d = h):  E = a - B - ly(1/2+theta) - h/6 - l/2 + l q + h (N(theta) + theta) <= 0.
"""
import sys
import numpy as np
from scipy.optimize import linprog


def count_R(delta, x, kappa, alpha=5.0 / 6.0):
    c = 1.0 / (3.0 * kappa)
    D = 3.0 - (1.0 + 2.0 * c) * x
    P = (2.0 - 2.0 * c * x) * (1.0 - x)
    J = (alpha - delta) * D + delta * P
    return 1.0 - delta + (alpha - delta) * delta * P / (2.0 * J)


def N_block(theta, delta, x, kappa, R, d4=0.0, omega=None, use_P=True):
    """max over m in [0,1/2] of the min of affine functions of m: attained at an endpoint or a pairwise crossing."""
    q = delta * x
    lines = [((3 * R + 1) / 4 - d4 - q / (12 * kappa), -theta + q / (6 * kappa))]       # F4: (const, slope in m)
    lines.append((R, (delta / 2 if use_P else 0.5) - theta))                              # P or absolute counting
    if omega is not None:
        lines.append(((5 * R + 1 + omega) / 6, -theta))                                  # F6
    cand = [0.0, 0.5]
    for i in range(len(lines)):
        for j in range(i + 1, len(lines)):
            ds = lines[i][1] - lines[j][1]
            if abs(ds) > 1e-15:
                m = (lines[j][0] - lines[i][0]) / ds
                if 0.0 < m < 0.5:
                    cand.append(m)
    return max(min(c + s_ * m for c, s_ in lines) for m in cand)


def class_options(delta, x, kappa, model):
    """list of (theta, N) options for the class."""
    R = count_R(delta, x, kappa) - model.get("dR", 0.0)
    q = delta * x
    cap = q / (6 * kappa)
    K = (3 * R + 1) / 4
    kind = model["kind"]
    if kind == "source":            # Xu-Sang Prop 5.1 / Liu II Prop 14.3
        return [(cap, K - cap / 2), (0.0, K)]
    if kind == "source+pt":         # plus manuscript pointwise numerator (theta = delta/2, N = R)
        return [(cap, K - cap / 2), (0.0, K), (delta / 2, R)]
    if kind == "uniform":           # K -> K - d4 (uniform hypothetical saving at every block)
        d4 = model["d4"]
        return [(cap, max(R, K - d4) - cap / 2 if K - d4 >= R else R - cap / 2), (0.0, max(R, K - d4))]
    if kind == "lindelof":          # Sum_B |L(1/2+theta)| << U^R, every theta >= 0
        return [(0.0, R)]
    if kind == "block":             # blockwise max-min on a theta grid
        out = []
        for th in np.unique(np.concatenate([np.linspace(0, delta / 2, model.get("nth", 13)), [cap]])):
            out.append((th, N_block(th, delta, x, kappa, R, model.get("d4", 0.0), model.get("omega"),
                                    model.get("use_P", True))))
        return out
    raise ValueError(kind)


def low_rows(B):
    rows = []
    Gs = [(np.zeros(3), 0.0), (np.array([-1 / 12, 1 / 12, 0.0]), 0.0), (np.array([-1.0, 0.5, 0.0]), 0.0)]
    ks = [(np.zeros(3), 0.0), (np.array([-0.5, -0.5, 0.75]), 0.25), (np.array([1.0, 1.0, 1.0]), -1.0),
          (np.array([0.0, 0.0, 1.5]), -0.5)]
    base = np.array([1 / 6, 0.0, -1 / 6])
    for gc, g0 in Gs:
        for kc, k0 in ks:
            rows.append((base + gc + 0.5 * kc, B - (5 / 6 + g0 + 0.5 * k0)))
    return rows


_OPT_CACHE = {}


def options_table(B, model, nd, nx, kappa=None):
    key = (round(B, 14), repr(sorted(model.items())), nd, nx, kappa)
    if key in _OPT_CACHE:
        return _OPT_CACHE[key]
    kap = kappa if kappa is not None else min(1.0, max(13.0 / 18.0, 2.0 * B - 1.0))
    dmax = min(5.0 / 6.0, 2.0 * B - 1.0)
    tab = []
    for delta in np.linspace(0.125, dmax, nd):
        for x in np.linspace(0.0, 0.5, nx):
            tab.append((delta, x, class_options(delta, x, kap, model)))
    _OPT_CACHE.clear()
    _OPT_CACHE[key] = tab
    return tab


def solve_rho(B, rho, model, nd=81, nx=17, kappa=None):
    """LP in (lx, ly, l, t): min t, E_class <= t, low rows, ly = rho*h, l <= lx, l <= ly.
    For each class the option minimising E/h at this rho is used (the choice depends on rho only)."""
    A, ub = [], []
    for coef, rhs in low_rows(B):
        A.append(np.append(coef, 0.0)); ub.append(rhs)
    hc = np.array([-1.0, 0.0, 1.0]); lyc = np.array([0.0, 1.0, 0.0]); lc = np.array([0.0, 0.0, 1.0])
    for delta, x, opts in options_table(B, model, nd, nx, kappa):
        a = 0.5 * (1 + delta); q = delta * x
        th, N = min(opts, key=lambda o: -rho * (0.5 + o[0]) + o[1] + o[0])
        hk = N + th - 1.0 / 6.0
        coef = hk * hc - (0.5 + th) * lyc + (q - 0.5) * lc
        const = a - B + hk
        A.append(np.append(coef, -1.0)); ub.append(-const)
    A.append(np.array([-1.0, 0.0, 1.0, 0.0])); ub.append(0.0)   # l <= lx
    A.append(np.array([0.0, -1.0, 1.0, 0.0])); ub.append(0.0)   # l <= ly
    Aeq = np.array([[rho, 1.0, -rho, 0.0]]); beq = np.array([rho])   # ly = rho (1 - lx + l)
    res = linprog(c=[0, 0, 0, 1.0], A_ub=np.array(A), b_ub=np.array(ub), A_eq=Aeq, b_eq=beq,
                  bounds=[(0, 1), (0, 1), (0, 0.5), (None, None)], method="highs")
    if res.status != 0:
        return 1.0, None
    return res.x[3], res.x[:3]


RHOS = np.concatenate([np.linspace(0.50, 0.56, 4), np.linspace(0.565, 0.60, 36), np.linspace(0.61, 0.70, 10)])


def best_t(B, model, **kw):
    best = (9.0, None, None)
    for r in RHOS:
        t, v = solve_rho(B, r, model, **kw)
        if t < best[0]:
            best = (t, r, v)
    return best


def abscissa(model, lo=0.84, hi=0.90, it=26, **kw):
    assert best_t(hi, model, **kw)[0] <= 0
    for _ in range(it):
        mid = 0.5 * (lo + hi)
        if best_t(mid, model, **kw)[0] <= 0:
            hi = mid
        else:
            lo = mid
    t, r, v = best_t(hi, model, **kw)
    return hi, r, v


def report(name, model, **kw):
    b, r, v = abscissa(model, **kw)
    print(f"{name:66s} B={b:.7f} rho={r:.4f} lx={v[0]:.4f} ly={v[1]:.4f} l={v[2]:.4f} M+l={v.sum():.4f}", flush=True)
    return b


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    if which in ("all", "base"):
        report("M0  source system (expect 0.8748866)", {"kind": "source"})
        report("M0p source + pointwise numerator per class", {"kind": "source+pt"})
        report("M0a blockwise, absolute counting on short blocks (source tools)", {"kind": "block", "use_P": False})
        report("M0b blockwise, class pointwise bound on blocks (chord test)", {"kind": "block"})
    if which in ("all", "uniform"):
        for d4 in (1e-4, 1e-3, 2e-3, 5e-3, 1e-2, 2e-2, 3e-2, 5e-2):
            report(f"M1  uniform numerator saving d = {d4:g}  [MODEL]", {"kind": "uniform", "d4": d4})
        report("M3  Lindelof on the class, N = R  [MODEL]", {"kind": "lindelof"})
    if which in ("all", "sixth"):
        for om in (0.30, 0.25, 0.22, 0.20, 0.18, 0.15, 0.10, 0.05, 0.0):
            report(f"M2  zero-slot sixth moment U^(1+omega), omega = {om:g}  [MODEL]", {"kind": "block", "omega": om})
    if which in ("all", "central"):
        # saving only on the 4th-moment branch, all blocks (d4), with blockwise theta re-optimisation
        for d4 in (1e-3, 5e-3, 1e-2):
            report(f"M4  blockwise, F4 lowered by d = {d4:g}, theta free  [MODEL]", {"kind": "block", "d4": d4})
