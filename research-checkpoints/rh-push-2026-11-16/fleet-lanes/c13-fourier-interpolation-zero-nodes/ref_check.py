#!/usr/bin/env python3
"""Referee pass for c13-fourier-interpolation-zero-nodes: independent code (mpmath / pure python, no numpy).
R1 DH functional equation in the class of BRS Theorem 5.2 (r = 5, Gamma_R(s+1)); DH inverse by a different algorithm
R2 T-NR: transfer of biorthogonality (coefficient identity), zeros, strip condition, series by root formula
R3 source line checks (quotes present in the text extraction of the paper)
R4 growth exponent illustration: partial sums of inverse coefficients (zeta, T-NR, DH)
"""
import sys, json, math
import mpmath as mp
mp.mp.dps = 30
base = sys.argv[1]
out = {}
# R1
kappa = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
def F(s): return mp.power(5, -s) * (mp.zeta(s, mp.mpf(1) / 5) + kappa * mp.zeta(s, mp.mpf(2) / 5) - kappa * mp.zeta(s, mp.mpf(3) / 5) - mp.zeta(s, mp.mpf(4) / 5))
def Fstar(s): return mp.power(5, s / 2) * mp.power(mp.pi, -(s + 1) / 2) * mp.gamma((s + 1) / 2) * F(s)
fe = []
for s in (mp.mpc("0.3", "7.7"), mp.mpc("1.4", "-22.1"), mp.mpc("0.5", "85.7")):
    fe.append({"s": str(s), "abs(F*(s)-F*(1-s))/abs(F*(s))": mp.nstr(abs(Fstar(s) - Fstar(1 - s)) / abs(Fstar(s)), 5)})
z0 = mp.findroot(F, mp.mpc("0.8085171825", "85.6993484854"))
out["R1_DH_FE"] = fe; out["R1_DH_offline_zero"] = str(z0)
# inverse, pure python, definition b(n) = -sum_{d|n, d>1} a(d) b(n/d)
N = 30000
per = [0.0, 1.0, float(kappa), -float(kappa), -1.0]
a = [per[n % 5] for n in range(N + 1)]
b = [0.0] * (N + 1); b[1] = 1.0
divs = [[] for _ in range(N + 1)]
for d in range(2, N + 1):
    for m in range(d, N + 1, d): divs[m].append(d)
for n in range(2, N + 1):
    b[n] = -sum(a[d] * b[n // d] for d in divs[n])
chk = json.load(open(base + "/checks.json"))
out["R1_b_first_agree"] = max(abs(b[i + 1] - chk["K1_DH"]["b_first"][i]) for i in range(12))
for sg in ("1.3", "2.0"):
    mine = sum(abs(b[n]) * n ** (-float(sg)) for n in range(1, 10001))
    out["R1_partial_1e4_sigma_" + sg] = [mine, chk["K1_DH"]["sum_abs_b_n^-sigma"][sg]["partial_1e4"]]
out["R1_max_abs_b_to_3e4"] = max(abs(x) for x in b)
# R2
r2 = []
for (q, c) in [(2, 2.05), (3, 2.2), (5, -2.2), (2, 2.1213)]:
    L = mp.log(q); c_ = mp.mpf(c)
    aa = mp.acosh(abs(c_) / 2) / L
    # roots of 1 + c x + x^2
    x1 = (-c_ + mp.sqrt(c_ * c_ - 4)) / 2; x2 = 1 / x1
    g = lambda j: (x1 ** (-(j + 1)) - x2 ** (-(j + 1))) / (x2 - x1)  # partial fractions of x/((x-x1)(x-x2)) = sum g_j x^{j+1}
    grec = [mp.mpf(1), -c_]
    for j in range(2, 40): grec.append(-c_ * grec[-1] - grec[-2])
    gerr = max(abs(g(j) - grec[j]) for j in range(40))
    # transfer matrix T(e,e') = sum_{j>=0, j+1<=e} g_j [d(e-j-1 = e'-1) + c d(e-j-1 = e') + d(e-j-1 = e'+1)], e,e' >= 1
    E = 12; worst = mp.mpf(0)
    for e in range(1, E + 1):
        for e2 in range(1, E + 1):
            t = mp.mpf(0)
            for j in range(0, e):
                k = e - j - 1
                t += grec[j] * ((1 if k == e2 - 1 else 0) + c_ * (1 if k == e2 else 0) + (1 if k == e2 + 1 else 0))
            worst = max(worst, abs(t - (1 if e == e2 else 0)))
    P = lambda w: 2 * mp.cosh((w - mp.mpf(1) / 2) * L) + c_
    h0 = mp.pi / L if c > 2 else mp.mpf(0)
    r2.append({"q": q, "c": c, "a": mp.nstr(aa, 12), "a<1/2": bool(aa < 0.5), "g_root_vs_recursion": mp.nstr(gerr, 5),
               "biorthogonality_transfer_max_dev": mp.nstr(worst, 5), "abs P(1/2+a+i h0)": mp.nstr(abs(P(mp.mpf(1) / 2 + aa + 1j * h0)), 5),
               "abs P(1/2-a+i(h0+2pi/L))": mp.nstr(abs(P(mp.mpf(1) / 2 - aa + 1j * (h0 + 2 * mp.pi / L))), 5)})
out["R2_TNR"] = r2
# R3
txt = open(base + "/sources/brs.txt").read()
need = ["H(1−w, s) = −H(w, s) and H(w, 1−s) = H(w, s)", "Dirichlet series without Euler products", "the techniques from [26] must be abandoned",
        "any com-", "We may for instance take linear combinations of L-functions that satisfy the same", "Bochner’s Converse Theorem",
        "break down if one removes any single point", "n a square", "Ramachandra"]
out["R3_quotes_found"] = {k: (k in txt) for k in need}
# R4: partial sums M_F(x) = sum_{n<=x} b_F(n), exponent estimate log|M|/log x at x = 3e4 (illustration only)
mu = [1] * (N + 1); mu[0] = 0; comp = [False] * (N + 1)
for p in range(2, N + 1):
    if not comp[p]:
        for m in range(p, N + 1, p):
            if m > p: comp[m] = True
            mu[m] *= -1
        for m in range(p * p, N + 1, p * p): mu[m] = 0
def maxpartial(seq):
    s = 0.0; best = 0.0
    for n in range(1, N + 1):
        s += seq[n]; best = max(best, abs(s) / math.sqrt(n)) if n > 100 else best
    return best
out["R4_sup_abs_partial_over_sqrt_x"] = {"zeta(mu)": maxpartial(mu), "DH": maxpartial(b)}
json.dump(out, open(base + "/ref_check.json", "w"), indent=1)
print(json.dumps(out, indent=1))
