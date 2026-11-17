#!/usr/bin/env python3
"""Route 36: Platt-independent ("Route 2") certification of a local anomaly.

Trust base: FLINT's Riemann-Siegel Hardy Z (acb_dirichlet_hardy_z via ./zsign, ball
arithmetic), Trudgian 2011 Thm 2.2 (|int_{t1}^{t2} S| <= 2.067 + 0.059 log t2),
theta via Arb lgamma (python-flint), parity sign Z(t) = (-1)^{N(t)-1}.
The Platt window is used ONLY to propose evaluation points.

usage: cert_anomaly.py <window_id> <k_a> <k_b> [H=10] [eps=1e-9] [label]
  certifies N(T1) = k_a - 1 and N(T2) = k_b at points T1 < gamma_{k_a}, T2 > gamma_{k_b}
  and locates zeros k_a..k_b in RS-certified intervals of half-width eps (or wider when
  needed), then reports gaps, S(gamma^{+/-}) and Gram-interval counts on [T1, T2].
"""
import sys, os, json, subprocess, math, time
from fractions import Fraction as Fr
from flint import arb, acb, ctx

ctx.prec = 256
HERE = os.path.dirname(os.path.abspath(__file__))
RUNS = os.path.join(HERE, "runs")
E2 = 48  # dyadic resolution 2^-48 for evaluation points
LOGPI = arb.pi().log()


def A(q):
    return arb(q.numerator) / arb(q.denominator)


def theta(t):
    return acb(arb(1) / 4, t / 2).lgamma().imag - t / 2 * LOGPI


def int_theta(x, y, M):
    w = (y - x) / M
    lo = arb(0); hi = arb(0); prev = theta(x)
    for j in range(M):
        a = x + j * w; b = a + w
        lo += w * theta(a + w / 2); th_b = theta(b); hi += w * (prev + th_b) / 2; prev = th_b
    return lo, hi


def bound(t2):
    return arb("2.067") + arb("0.059") * t2.log()


def dy(q):
    """round rational q to a dyadic m*2^-E2"""
    m = round(q * (1 << E2))
    return Fr(m, 1 << E2)


def zsigns(points, prec=192):
    inp = "".join(f"p{i} {int(p * (1 << E2))} {-E2}\n" for i, p in enumerate(points))
    t0 = time.time()
    out = subprocess.run([os.path.join(HERE, "zsign"), str(prec)], input=inp, capture_output=True, text=True).stdout.split("\n")
    res = []
    for line in out:
        if not line.strip():
            continue
        f = line.split()
        res.append(int(f[1]))
    assert len(res) == len(points), (len(res), len(points))
    return res, time.time() - t0


def certify_N(iv, c, Tq, H, M=400):
    """direct-integral Turing at T: refute N(T) >= c+2 and N(T) <= c-2. iv: idx -> (a,b) rationals, each
    holding >= 1 zero (RS sign change); zeros idx >= c+1 lie above T, idx <= c below."""
    T = A(Tq); Hq = Fr(H); Ha = A(Hq)
    assert all(iv[i][0] >= Tq for i in iv if i >= c + 1)
    assert all(iv[i][1] <= Tq for i in iv if i <= c)
    stepU = sum((Tq + Hq - max(iv[i][1], Tq)) for i in iv if i >= c + 1 and iv[i][1] <= Tq + Hq)
    lo_th, hi_th = int_theta(T, T + Ha, M)
    U = arb(c + 1) * Ha + A(stepU) - hi_th / arb.pi()
    up = (U - bound(T + Ha)).lower()
    stepL = sum((min(iv[i][0], Tq) - (Tq - Hq)) for i in iv if i <= c and iv[i][0] > Tq - Hq)
    lo_th2, hi_th2 = int_theta(T - Ha, T, M)
    Wv = arb(c - 3) * Ha - A(stepL) - lo_th2 / arb.pi()
    low = (-bound(T) - Wv).lower()
    # coverage check: the listed zeros must actually reach T+H and T-H for the margins to be meaningful
    return float(up), float(low)


def load_zeros(id_):
    meta = json.load(open(os.path.join(RUNS, id_ + ".meta.json")))
    T = int(meta["T"])
    Z = {}
    for line in open(os.path.join(RUNS, id_ + ".zeros.tsv")):
        f = line.rstrip("\n").split("\t")
        Z[int(f[0])] = (Fr(f[3]) + T, float(f[4]))
    return T, Z


def main():
    id_, ka, kb = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    H = float(sys.argv[4]) if len(sys.argv) > 4 else 10.0
    eps = Fr(sys.argv[5]) if len(sys.argv) > 5 else Fr(1, 10 ** 9)
    label = sys.argv[6] if len(sys.argv) > 6 else f"{ka}-{kb}"
    T, Z = load_zeros(id_)
    lo_t = Z[ka][0] - Fr(int(H) + 2); hi_t = Z[kb][0] + Fr(int(H) + 2)
    ks = sorted(k for k in Z if lo_t <= Z[k][0] <= hi_t)
    assert ks[0] < ka and ks[-1] > kb and ks == list(range(ks[0], ks[-1] + 1))
    # separation points p_k between zero k and k+1 (k = ks[0]..ks[-1]-1)
    P = {k: dy((Z[k][0] + Z[k + 1][0]) / 2) for k in ks[:-1]}
    # tight points around anomaly zeros
    tight = {}
    for k in range(ka, kb + 1):
        e = max(eps, Fr(10 * Z[k][1]).limit_denominator(10 ** 30))
        e = min(e, (Z[k][0] - Z[k - 1][0]) / 4, (Z[k + 1][0] - Z[k][0]) / 4)
        tight[k] = (dy(Z[k][0] - e), dy(Z[k][0] + e))
    pts = [P[k] for k in ks[:-1]] + [x for k in tight for x in tight[k]]
    sg, wall = zsigns(pts)
    sP = {k: sg[i] for i, k in enumerate(ks[:-1])}
    off = len(ks) - 1
    sT = {}
    for j, k in enumerate(tight):
        sT[k] = (sg[off + 2 * j], sg[off + 2 * j + 1])
    rep = {"window": id_, "label": label, "T_window": str(T), "k_a": str(ka), "k_b": str(kb), "H": H, "rs_points": len(pts),
           "rs_wall_s": round(wall, 1), "rs_undetermined": int(sum(1 for s in sg if s == 0))}
    # parity labelling: sign Z(p_k) should be (-1)^(k-1) if N(p_k) = k
    par_ok = all(sP[k] == (1 if (k - 1) % 2 == 0 else -1) for k in sP)
    alt_ok = all(sP[k] * sP[k + 1] == -1 for k in ks[:-2])
    rep["separation_signs_alternate"] = alt_ok
    rep["parity_consistent_with_platt_indices"] = par_ok
    tight_ok = all(sT[k][0] * sT[k][1] == -1 and sT[k][0] == sP[k - 1] for k in sT)
    rep["tight_sign_changes"] = tight_ok
    if not (alt_ok and tight_ok and rep["rs_undetermined"] == 0):
        rep["status"] = "NOT_CERTIFIED"
        rep["bad_separation_points"] = [str(k) for k in sP if sP[k] != (1 if (k - 1) % 2 == 0 else -1)][:20]
        os.makedirs(os.path.join(HERE, "cert"), exist_ok=True)
        json.dump(rep, open(os.path.join(HERE, "cert", f"{id_}_{label}.json"), "w"), indent=1)
        print(json.dumps(rep, indent=1)); return rep
    # intervals each containing >= 1 zero (sign change), labelled by index
    iv = {}
    for k in ks[1:-1]:
        iv[k] = (P[k - 1], P[k])
    for k in tight:
        iv[k] = tight[k]
    T1 = P[ka - 1]; T2 = P[kb]
    m1 = certify_N(iv, ka - 1, T1, H); m2 = certify_N(iv, kb, T2, H)
    # coverage: the listed intervals reach H on each side
    cov = (P[ks[0]] <= T1 - Fr(H)) and (P[ks[-2]] >= T2 + Fr(H))
    rep["coverage_ok"] = cov
    rep["N_T1"] = {"T1": float(T1), "claim": str(ka - 1), "margin_refute_ge_c+2": m1[0], "margin_refute_le_c-2": m1[1],
                   "sign_Z": sP[ka - 1]}
    rep["N_T2"] = {"T2": float(T2), "claim": str(kb), "margin_refute_ge_c+2": m2[0], "margin_refute_le_c-2": m2[1],
                   "sign_Z": sP[kb]}
    ok = min(m1 + m2) > 0 and par_ok  # coverage is informational: unlisted zeros only weaken the margins
    rep["status"] = "CERTIFIED_ROUTE2" if ok else "NOT_CERTIFIED"
    # anomaly quantities from tight intervals
    zs = {k: (A(tight[k][0]), A(tight[k][1])) for k in tight}
    gaps = []
    for k in range(ka, kb):
        g_lo = zs[k + 1][0] - zs[k][1]; g_hi = zs[k + 1][1] - zs[k][0]
        L = (A(Fr(T)).__truediv__(2 * arb.pi())).log()
        gaps.append({"k": str(k), "gap_lo": float(g_lo.lower()), "gap_hi": float(g_hi.upper()),
                     "delta_hi": float((g_hi * L / (2 * arb.pi())).upper())})
    rep["gaps"] = gaps
    Sv = []
    for k in tight:
        th_lo = theta(zs[k][0]); th_hi = theta(zs[k][1])
        Splus_hi = arb(k - 1) - th_lo / arb.pi(); Splus_lo = arb(k - 1) - th_hi / arb.pi()
        Sv.append({"k": str(k), "S_plus": [float(Splus_lo.lower()), float(Splus_hi.upper())],
                   "S_minus": [float(Splus_lo.lower()) - 1, float(Splus_hi.upper()) - 1]})
    rep["S"] = Sv
    # Gram intervals inside [T1, T2]: all zeros there are k_a..k_b located in tight intervals
    gram = []
    m = int(arb((theta(A(T1)) / arb.pi()).mid()).floor().unique_fmpz()) - 2
    while True:
        g = arb.gram_point(m)
        if g < A(T1):
            m += 1; continue
        if not (g < A(T2)):
            break
        n_below = None
        if all((zs[k][1] < g) or (zs[k][0] > g) for k in zs):
            n_below = (ka - 1) + sum(1 for k in zs if zs[k][1] < g)
        gram.append({"m": str(m), "N_g": None if n_below is None else str(n_below),
                     "S_g": None if n_below is None else n_below - m - 1,
                     "good": None if n_below is None else ((n_below - m - 1) % 2 == 0)})
        m += 1
    rep["gram_in_T1_T2"] = gram
    print(json.dumps(rep, indent=1))
    os.makedirs(os.path.join(HERE, "cert"), exist_ok=True)
    json.dump(rep, open(os.path.join(HERE, "cert", f"{id_}_{label}.json"), "w"), indent=1)
    return rep


if __name__ == "__main__":
    main()
