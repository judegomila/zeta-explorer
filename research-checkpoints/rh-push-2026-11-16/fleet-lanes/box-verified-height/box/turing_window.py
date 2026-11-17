#!/usr/bin/env python3
"""Route 36: direct-integral Turing check for a whole Platt window (no Gram-block criterion).

Uses the window's isolating intervals (each holds >= 1 zero: certified endpoint signs of the
patched Platt grid) + Trudgian 2011 Thm 2.2 + theta (Arb) WITHOUT parity, i.e. refutes
N(T) >= c+1 and N(T) <= c-1 at two interior points T1 < T2. Then N(T2) - N(T1) equals the
number of isolating intervals in between, so every zero of zeta in (T1, T2] is simple, on the
critical line, and in its interval. Trust base: Platt grid lemmas (patched, FLINT_AUDIT_2) +
Trudgian Thm 2.2 + Arb. Removes the dependence on FLINT's Gram-block anchor criterion.
usage: turing_window.py <id> [H=20]"""
import sys, os, json
from fractions import Fraction as Fr
from flint import arb, ctx
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cert_anomaly import A, int_theta, bound, HERE

ctx.prec = 256


def certify_noparity(iv, c, Tq, H, M=600):
    T = A(Tq); Hq = Fr(H); Ha = A(Hq)
    assert all(iv[i][0] >= Tq for i in iv if i >= c + 1)
    assert all(iv[i][1] <= Tq for i in iv if i <= c)
    stepU = sum((Tq + Hq - max(iv[i][1], Tq)) for i in iv if i >= c + 1 and iv[i][1] <= Tq + Hq)
    lo_th, hi_th = int_theta(T, T + Ha, M)
    U = arb(c) * Ha + A(stepU) - hi_th / arb.pi()          # hypothesis N(T) >= c+1
    up = (U - bound(T + Ha)).lower()
    stepL = sum((min(iv[i][0], Tq) - (Tq - Hq)) for i in iv if i <= c and iv[i][0] > Tq - Hq)
    lo_th2, hi_th2 = int_theta(T - Ha, T, M)
    Wv = arb(c - 2) * Ha - A(stepL) - lo_th2 / arb.pi()     # hypothesis N(T) <= c-1
    low = (-bound(T) - Wv).lower()
    return float(up), float(low)


def main():
    id_ = sys.argv[1]; H = int(sys.argv[2]) if len(sys.argv) > 2 else 20
    meta = json.load(open(os.path.join(HERE, "runs", id_ + ".meta.json")))
    T0 = int(meta["T"])
    tiny = Fr(1, 10 ** 20)
    iv = {}
    for line in open(os.path.join(HERE, "runs", id_ + ".zeros.tsv")):
        f = line.split("\t")
        # 25-significant-digit renderings of exact dyadics; widen outward by 1e-20 (keeps >= 1 zero inside)
        iv[int(f[0])] = (Fr(f[1]) + T0 - tiny, Fr(f[2]) + T0 + tiny)
    ks = sorted(iv)
    tmin, tmax = iv[ks[0]][0], iv[ks[-1]][1]
    # T1: right end of the first interval lying beyond tmin + H + 1; T2: left end of the last one before tmax - H - 1
    sep = Fr(1, 10 ** 12)
    # T1 / T2: midpoints of genuine gaps between consecutive isolating intervals (no shared endpoints)
    k1 = next(k for k in ks[:-1] if iv[k][1] >= tmin + H + 1 and iv[k + 1][0] - iv[k][1] > sep)
    k2 = max(k for k in ks[:-1] if iv[k + 1][0] <= tmax - H - 1 and iv[k + 1][0] - iv[k][1] > sep)
    T1 = (iv[k1][1] + iv[k1 + 1][0]) / 2
    T2 = (iv[k2][1] + iv[k2 + 1][0]) / 2
    m1 = certify_noparity(iv, k1, T1, H); m2 = certify_noparity(iv, k2, T2, H)
    ok = min(m1 + m2) > 0
    rep = {"window": id_, "H": H, "T1_offset": float(T1 - T0), "N_T1": str(k1), "T2_offset": float(T2 - T0), "N_T2": str(k2),
           "margins_T1": m1, "margins_T2": m2, "zeros_between": k2 - k1,
           "status": "CERTIFIED_DIRECT_TURING_ON_PLATT_INTERVALS" if ok else "NOT_CERTIFIED"}
    print(json.dumps(rep))
    os.makedirs(os.path.join(HERE, "cert"), exist_ok=True)
    json.dump(rep, open(os.path.join(HERE, "cert", f"{id_}_turingwindow.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
