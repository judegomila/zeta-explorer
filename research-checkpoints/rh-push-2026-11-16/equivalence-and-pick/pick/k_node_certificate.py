"""Certificate for K-node real xi Pick positivity via local Loewner (Hankel)
positivity of j=u*h and of f=-h+(1/2)h_7.  See NEXT_STAGE.md for the proof.

All comparisons are made with Arb balls (python-flint), outward rounded.
Inputs:
  * zeros_20000.json : Arb enclosures of the first 20000 zeta ordinates
    (acb.zeta_zeros); only used as "these are real zeros with these
    ordinates" -- indexing is not needed by the proof.
  * T = 3e12 (Platt--Trudgian), Trudgian's S(t) bound, theta'(t) bounds
    from Binet's formula (derived in NEXT_STAGE.md).
Usage: python -I k_node_certificate.py K
"""
import sys, json, math, time
from flint import arb, ctx

ctx.prec = 128
K = int(sys.argv[1]) if len(sys.argv) > 1 else 7
n_deg = 2 * K                       # degree of P^2 and of w*Q^2
T = arb(3) * arb(10) ** 12
pi = arb.pi()

# ---------- tail constant S' = sum_{gamma>T} phi_gamma^2 ----------------
def E(t):                           # Trudgian (2014): |S(t)| <= E(t), t >= e
    return arb("0.112") * t.log() + arb("0.278") * t.log().log() + arb("2.510")
# Sum_{gamma>T} gamma^-2 <= int_T^oo theta'(t)/(pi t^2) dt + (E(T)-1)/T^2
#                           + 2 int_T^oo (1+E(t)) t^-3 dt
# theta'(t) <= (1/2)log(t/2pi) + 1/(6t) + 1/(16t^2)
I1 = ((T / (2 * pi)).log() + 1) / (2 * pi * T) + 1 / (12 * pi * T**2) + 1 / (48 * pi * T**3)
# E(t) <= 0.39 log t + 2.51 for t >= T (loglog t <= log t)
I3 = 2 * (arb("3.51") / (2 * T**2) + arb("0.39") * (2 * T.log() + 1) / (4 * T**2))
S_T = I1 + (E(T) - 1) / T**2 + I3
S_prime = S_T * (1 + arb(10) ** -20)       # phi^2 <= gamma^-2 (1+1e-24)
# Markov constant for |Re G(zeta)-G(|zeta|)| <= C_n ||G|| phi^2
C_n = arb(n_deg**2) + arb(2) * n_deg**2 * (n_deg**2 - 1) / 3 + 1
TAIL = C_n * S_prime
print(f"K={K}  S_T<= {S_T.upper().str(6, radius=False)}  C_n={C_n.str(8, radius=False)}  "
      f"tail factor C_n*S' <= {TAIL.upper().str(6, radius=False)}")

# ---------- Lebesgue constants with interval nodes ----------------------
def lebesgue_upper(nodes, with_zero, M=1500):
    """Upper bound of sup_{t in [0,1]} sum_m |l_m(t)| where l_m is the
    Lagrange basis on {0}+nodes (with_zero) or on nodes; the 0-node basis
    function is omitted (P(0)=0).  nodes: list of arb (disjoint balls)."""
    pts = ([arb(0)] if with_zero else []) + list(nodes)
    idx = range(1, len(pts)) if with_zero else range(len(pts))
    den = {}
    for m in idx:
        d = arb(1)
        for k in range(len(pts)):
            if k != m:
                diff = pts[m] - pts[k]
                assert not diff.contains(0), "overlapping nodes"
                d *= diff
        den[m] = d
    best = arb(0)
    for p in range(M):
        tt = arb((arb(p) + arb(p + 1)) / (2 * M), arb(1) / (2 * M))  # ball = [p/M,(p+1)/M]
        s = arb(0)
        for m in idx:
            num = arb(1)
            for k in range(len(pts)):
                if k != m:
                    num *= tt - pts[k]
            s += abs(num / den[m])
        if not s.is_finite():
            return None                     # unbounded enclosure: treat as failure
        if float(s.upper()) > float(best.upper()):
            best = arb(s.upper())
    assert float(best.upper()) >= 1.0
    return best

def hull(lo, hi):
    return arb((lo + hi) / 2, (hi - lo) / 2 + arb(10) ** -30)

# ---------- zeros ------------------------------------------------------
Z = json.load(open("zeros_20000.json"))["enclosures"]
gam = [hull(arb(a), arb(b)) for a, b in Z]
g = [x * x for x in gam]
g1 = g[0]
gmid = [float(x.mid()) for x in g]

H_targets = [(1 - math.cos(k * math.pi / K)) / 2 for k in range(1, K + 1)]
J_targets = [0.03 + 0.94 * (1 - math.cos((2 * k - 1) * math.pi / (2 * K))) / 2 for k in range(1, K + 1)]

def pick(uc, targets, used_ok=None):
    tv = [(uc + gmid[0]) / (uc + gm) for gm in gmid]
    chosen = []
    for tau in sorted(targets, reverse=True):
        cand = [i for i in range(len(tv)) if i not in chosen and all(abs(tv[i] - tv[c]) > 0.03 for c in chosen)]
        if not cand:
            cand = [i for i in range(len(tv)) if i not in chosen]
        best = min(cand, key=lambda i: abs(tv[i] - tau))
        chosen.append(best)
    return sorted(chosen)

def node_interval(i, ulo, uhi):
    # t_i(u) = (u+g1)/(u+g_i) is increasing in u (g_i >= g1)
    lo = (ulo + g1) / (ulo + g[i]); hi = (uhi + g1) / (uhi + g[i])
    return hull(lo.lower() if hasattr(lo, 'lower') else lo, hi.upper())

def region_L(U1, ratio):
    cells = [(arb(0), arb(1))]
    u = 1.0
    while u < U1:
        cells.append((arb(u), arb(min(u * ratio, U1))))
        u *= ratio
    worst_H = arb(0); worst_J = arb(0); ok = True
    for (ulo, uhi) in cells:
        uc = float(((ulo + uhi) / 2).mid())
        # ---- H form ----
        ih = pick(uc, H_targets)
        nh = [hull(((ulo + g1) / (ulo + g[i])).lower(), ((uhi + g1) / (uhi + g[i])).upper()) for i in ih]
        LH = lebesgue_upper(nh, True)
        condH = 1 / (2 * LH**2)               # positive part per unit ||P||^2 (c >= 1/2)
        # ---- J form ----  w(t)=a t (1-a t), a=u/(u+g1) in [a_lo,a_hi]
        ij = pick(uc, J_targets)
        nj = [hull(((ulo + g1) / (ulo + g[i])).lower(), ((uhi + g1) / (uhi + g[i])).upper()) for i in ij]
        LJ = lebesgue_upper(nj, False)
        if LH is None or LJ is None:
            ok = False; print("FAIL (unbounded Lebesgue enclosure) cell", ulo, uhi); continue
        # w(t)/a = t(1-a t);  sup_{[0,1]} t(1-at) <= 1 ;  a in [a_lo,a_hi] subset [0,1)
        a = hull((ulo / (ulo + g1)).lower(), (uhi / (uhi + g1)).upper())
        sup_w = arb(1)
        min_w = arb(min((s_ * (1 - a * s_)).lower() for s_ in nj))
        if not min_w > 0:
            ok = False; print("FAIL min_w", ulo, uhi); continue
        # tail nodes satisfy |t| <= rmax; error bound carries a factor |t| (Lemma T)
        rmax = (uhi + g1) / (uhi + T**2 - arb(1) / 4)
        rH = TAIL * rmax * 2 * LH**2           # must be < 1
        rJ = TAIL * rmax * sup_w * LJ**2 / min_w   # must be < 1
        print(f"  cell [{float(ulo.mid()):.4g},{float(uhi.mid()):.4g}] LH<={LH.str(4, radius=False)} LJ<={LJ.str(4, radius=False)} rH={rH.upper().str(3, radius=False)} rJ={rJ.upper().str(3, radius=False)}")
        if not (rH.upper() < 1 and min_w > 0 and rJ.upper() < 1):
            ok = False
            print("FAIL cell", ulo, uhi, rH, rJ)
        if rH.upper() > worst_H.upper(): worst_H = arb(rH.upper())
        if rJ.upper() > worst_J.upper(): worst_J = arb(rJ.upper())
    return ok, len(cells), worst_H, worst_J

def theta_prime_lower(t):           # theta'(t) >= (1/2)log(t/2pi) - 2/(3t)
    return (t / (2 * pi)).log() / 2 - arb(2) / (3 * t)

def region_H(U1, delta, zstars):
    """u >= U1, a = 1.  Node k from a zero with ordinate in
    (gs_k, gs_k(1+delta)], gs_k = sqrt(u s_k), s_k = 1/z_k - 1."""
    U1 = arb(U1); d = arb(delta)
    s = [1 / arb(z) - 1 for z in zstars]
    tmin = (U1 * min(s, key=lambda x: float(x.mid()))).sqrt()
    # RvM window check at tmin; increasing in t (see NEXT_STAGE.md, Lemma W)
    lhs = tmin * d * theta_prime_lower(tmin) / pi
    rhs = E(tmin) + E(tmin * (1 + d))
    win_ok = lhs > rhs
    # disjoint windows
    ss = sorted(s, key=lambda x: float(x.mid()))
    disj = all(((ss[i] * (1 + d) ** 2) < ss[i + 1]) for i in range(len(ss) - 1))
    nodes = []
    for sk in s:
        lo = 1 / (1 + sk * (1 + d) ** 2 + 1 / (2 * U1))
        hi = 1 / (1 + sk - 1 / (4 * U1))
        nodes.append(hull(lo.lower(), hi.upper()))
    return win_ok, disj, tmin, lhs, rhs, nodes

if __name__ == "__main__":
    t0 = time.time()
    U1 = 1.0e7
    okL, ncell, wH, wJ = region_L(U1, float(sys.argv[2]) if len(sys.argv) > 2 else 1.02)
    print(f"Region L (0,{U1:g}]: cells={ncell} pass={okL} worst rH={wH.str(4, radius=False)} worst rJ={wJ.str(4, radius=False)}  ({time.time()-t0:.0f}s)")
    # Region H: one node set for H (targets in (0,1)) and one for J
    zH = [0.035 + 0.93 * (1 - math.cos(k * math.pi / K)) / 2 for k in range(1, K + 1)]
    zJ = J_targets
    allok = okL
    for name, zs in (("H", zH), ("J", zJ)):
        win_ok, disj, tmin, lhs, rhs, nodes = region_H(U1, 0.03, zs)
        if name == "H":
            LH = lebesgue_upper(nodes, True); assert LH is not None
            r = TAIL * 2 * LH**2
        else:
            LJ = lebesgue_upper(nodes, False); assert LJ is not None
            min_w = arb(min((s * (1 - s)).lower() for s in nodes))
            r = TAIL * (arb(1) / 4) * LJ**2 / min_w
        ok = bool(win_ok) and disj and r.upper() < 1
        allok = allok and ok
        print(f"Region H u>={U1:g} [{name}]: tmin={tmin.str(5, radius=False)} window lhs={lhs.str(4, radius=False)} > rhs={rhs.str(4, radius=False)}: {bool(win_ok)}; "
              f"disjoint={disj}; ratio={r.upper().str(4, radius=False)} pass={ok}")
    print("ALL PASS" if allok else "SOME FAIL", f"K={K}", f"{time.time()-t0:.0f}s")
