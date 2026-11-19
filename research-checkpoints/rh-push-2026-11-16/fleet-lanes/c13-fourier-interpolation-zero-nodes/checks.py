#!/usr/bin/env python3
"""c13-fourier-interpolation-zero-nodes: numeric checks of the stage-A statements.
Run: scripts/memcap.sh 8 python3 <this file> <abs output json>
K1 Dirichlet inverse of Davenport-Heilbronn (step S1: absolute convergence at the edge c = 2+eps; |b| not bounded)
K2 T-NR multiplier M(w,s) = P(s)/P(w): symmetry, residue normalisation, inverse series, frequency push
K3 E_a inverse coefficients: abscissa 1+a
K4 theta^w radial Poisson relation (relation functional of the weight-w/2 pair)
"""
import sys, json, math, cmath
import numpy as np
out_path = sys.argv[1]
res = {}

# ---------------- K1: DH ----------------
N = 1_000_000
print("planned allocation: 3 float64 arrays of", N + 1, "entries =", 3 * 8 * (N + 1) / 1e6, "MB")
kappa = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
per = np.array([0.0, 1.0, kappa, -kappa, -1.0])
a = per[np.arange(N + 1) % 5]
a[0] = 0.0
b = np.zeros(N + 1)
b[1] = 1.0
for k in range(1, N // 2 + 1):
    bk = b[k]
    if bk != 0.0:
        m = N // k
        b[2 * k::k][: m - 1] -= a[2: m + 1] * bk
n = np.arange(1, N + 1, dtype=float)
ab = np.abs(b[1:])
# identity check F * F^{-1} = 1 at s = 3 (truncated sums)
F3 = float(np.sum(a[1:] * n ** -3.0)); B3 = float(np.sum(b[1:] * n ** -3.0))
blocks = []
for j in range(0, 20):
    lo, hi = 2 ** j, min(2 ** (j + 1), N + 1)
    if lo > N: break
    seg = ab[lo - 1: hi - 1]
    blocks.append({"block": [lo, hi - 1], "max_abs_b": float(seg.max()), "argmax": int(lo + seg.argmax())})
sig = {}
for s in (1.0, 1.05, 1.1204, 1.3, 2.0):
    w = ab * n ** (-s)
    cs = np.cumsum(w)
    sig[str(s)] = {"partial_1e3": float(cs[999]), "partial_1e4": float(cs[9999]), "partial_1e5": float(cs[99999]), "partial_1e6": float(cs[-1])}
# multiplicativity defect and first values
res["K1_DH"] = {"kappa": kappa, "N": N, "a6_minus_a2a3": float(a[6] - a[2] * a[3]),
                "F(3)*Finv(3)": F3 * B3, "b_first": [float(x) for x in b[1:13]],
                "max_abs_b_overall": float(ab.max()), "argmax": int(1 + ab.argmax()),
                "dyadic_blocks": blocks, "sum_abs_b_n^-sigma": sig}
print("K1 F(3)*Finv(3) =", F3 * B3, " max|b| =", ab.max(), "at", 1 + ab.argmax())
for s, v in sig.items(): print("  sigma", s, v)

# zeta reference: |mu| <= 1 (sieve), and the bound used in BRS Lemma 4.2
mu = np.ones(N + 1, dtype=np.int8); mu[0] = 0
isp = np.ones(N + 1, dtype=bool); isp[:2] = False
for p in range(2, N + 1):
    if isp[p]:
        isp[2 * p::p] = False
        mu[p::p] *= -1
        if p * p <= N: mu[p * p::p * p] = 0
res["K1_zeta_ref"] = {"max_abs_mu": int(np.abs(mu).max()), "sum_abs_mu_over_d_to_1e3": float(np.sum(np.abs(mu[1:1001]) / np.arange(1, 1001)))}

# ---------------- K2: T-NR ----------------
def tnr(q, c):
    L = math.log(q)
    P = lambda w: 2 * cmath.cosh((w - 0.5) * L) + c
    # P(w) = x^{-1} (1 + c x + x^2), x = q^{-(w-1/2)};  1/P = x / (1 + c x + x^2) = sum_{j>=0} g_j x^{j+1}
    J = 400
    g = [1.0, -c]
    for j in range(2, J): g.append(-c * g[-1] - g[-2])
    aa = math.acosh(abs(c) / 2) / L
    alpha_mod = (abs(c) + math.sqrt(c * c - 4)) / 2
    growth = abs(g[200]) ** (1 / 200)
    tests = []
    for (w, s) in [(1.05 + 3.3j, 0.5 + 1.7j), (1.2 - 7.1j, 0.3 + 0.4j), (1.01 + 40.0j, 0.5 + 14.134725j)]:
        x = q ** (-(w - 0.5))
        ser = sum(g[j] * x ** (j + 1) for j in range(J))
        M = P(s) / P(w)
        tests.append({"w": str(w), "s": str(s), "abs(series*P(w)-1)": abs(ser * P(w) - 1),
                      "abs(M(1-w,s)-M(w,s))": abs(P(s) / P(1 - w) - M), "abs(M(w,1-s)-M(w,s))": abs(P(1 - s) / P(w) - M),
                      "abs(M(s,s)-1)": abs(P(s) / P(s) - 1)})
    zs = np.linspace(0, 200, 400001)
    online = 2 * np.cos(zs * L) + c
    # zeros: Re = 1/2 +- aa, heights (2k+1) pi/L if c>2, 2k pi/L if c<-2
    h0 = (math.pi / L) if c > 2 else 0.0
    zero = 0.5 + aa + 1j * h0; assert aa < 0.5
    # good horizontal lines: height t with t L = 0 mod 2pi (c>2) or pi mod 2pi (c<-2): |P| >= |c| - 2 ... check min over 1/2<=u<=2
    tgood = (2 * math.pi / L) * 5 if c > 2 else (2 * 5 + 1) * math.pi / L
    us = np.linspace(-1, 2, 3001)
    minhor = min(abs(P(u + 1j * tgood)) for u in us)
    return {"q": q, "c": c, "a": aa, "abs_conv_abscissa_of_1/P": 0.5 + aa, "g_growth_rate": growth, "alpha_mod": alpha_mod,
            "abs(P(zero))": abs(P(zero)), "zero": str(zero), "min_P_on_line": float(online.min()), "max_P_on_line": float(online.max()),
            "good_height": tgood, "min_abs_P_on_horizontal_-1<=u<=2": minhor,
            "lowest_frequency_index_n_in_n^(-w/2)": q * q, "tests": tests}
res["K2_TNR"] = [tnr(2, 2.05), tnr(2, -2.05), tnr(3, 2.2), tnr(5, 2.2), tnr(5, -2.2)]
for r in res["K2_TNR"]:
    print("K2", r["q"], r["c"], "a=%.6f" % r["a"], "growth", r["g_growth_rate"], "minP line", r["min_P_on_line"], "min hor", r["min_abs_P_on_horizontal_-1<=u<=2"],
          "maxerr", max(max(t[k] for k in t if k.startswith("abs")) for t in r["tests"]))

# ---------------- K3: E_a ----------------
def ea(aa, NN=200000):
    # inverse of zeta(s+a)zeta(s-a): (mu n^{-a}) * (mu n^{a});  sum |b| n^-sigma
    mm = mu[: NN + 1].astype(float)
    nn = np.arange(NN + 1, dtype=float); nn[0] = 1
    f1 = mm * nn ** (-aa); f2 = mm * nn ** (aa)
    bb = np.zeros(NN + 1)
    for d in range(1, NN + 1):
        if f1[d] != 0.0:
            m = NN // d
            bb[d::d][:m] += f1[d] * f2[1: m + 1]
    absb = np.abs(bb[1:]); n1 = np.arange(1, NN + 1, dtype=float)
    outp = {}
    for s in (1.0 + aa - 0.05, 1.0 + aa + 0.05):
        cs = np.cumsum(absb * n1 ** (-s))
        outp["sigma=%.3f" % s] = [float(cs[999]), float(cs[19999]), float(cs[-1])]
    k = int(np.argmax(absb / n1 ** aa))
    return {"a": aa, "b(2)": float(bb[2]), "expected_b(2)": -(2 ** aa + 2 ** -aa), "max_abs_b_over_n^a": float((absb / n1 ** aa).max()), "sums": outp}
res["K3_Ea"] = [ea(0.1), ea(0.3)]
for r in res["K3_Ea"]: print("K3", r)

# ---------------- K4: theta^w radial Poisson ----------------
import mpmath as mp
mp.mp.dps = 30
def theta_pow_coeffs(w, M):
    # theta(q) = 1 + 2 sum q^{n^2};  c_w(m) coefficients of theta^w, by the J.C.P. Miller recurrence
    t = [mp.mpf(0)] * (M + 1); t[0] = mp.mpf(1)
    k = 1
    while k * k <= M: t[k * k] = mp.mpf(2); k += 1
    c = [mp.mpf(0)] * (M + 1); c[0] = mp.mpf(1)
    for m in range(1, M + 1):
        s_ = mp.mpf(0)
        for j in range(1, m + 1):
            if t[j] != 0: s_ += (w * j - (m - j)) * t[j] * c[m - j]
        c[m] = s_ / m
    return c
k4 = []
for w in (mp.mpf(1), mp.mpf("1.3"), mp.mpf(4), mp.mpf("0.8")):
    M = 400
    c = theta_pow_coeffs(w, M)
    for tt in (mp.mpf("0.7"), mp.mpf("1.6")):
        lhs = sum(c[m] * mp.e ** (-mp.pi * m * tt) for m in range(M + 1))
        rhs = tt ** (-w / 2) * sum(c[m] * mp.e ** (-mp.pi * m / tt) for m in range(M + 1))
        k4.append({"w": str(w), "t": str(tt), "c_w(1..4)": [mp.nstr(c[i], 12) for i in range(1, 5)], "abs(lhs-rhs)": mp.nstr(abs(lhs - rhs), 5), "lhs": mp.nstr(lhs, 15)})
        print("K4 w", w, "t", tt, "diff", mp.nstr(abs(lhs - rhs), 5))
# multiplicativity of c_w/c_w(1): check c(2)c(3) vs c(1) c(6)... for the Dirichlet series in m^{-s/2}
def defect(w):
    c = theta_pow_coeffs(mp.mpf(w), 12); return mp.nstr(c[6] / c[1] - (c[2] / c[1]) * (c[3] / c[1]), 10)
res["K4_theta_w"] = {"relation_checks": k4, "mult_defect_c6": {str(w): defect(w) for w in (1, "1.3", 2, 4, 8, 3)}}
print("K4 mult defect", res["K4_theta_w"]["mult_defect_c6"])
json.dump(res, open(out_path, "w"), indent=1)
print("written", out_path)
