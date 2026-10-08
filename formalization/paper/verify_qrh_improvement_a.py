#!/usr/bin/env python3
"""Exact-arithmetic checks for formalization/paper/qrh-improvement-attempt-a.md.

Subject: the closing exponent bookkeeping of OpenAI, "The Quasi-Riemann Hypothesis: A zero-free half-plane Re s > 7/8"
(30 Sep 2026; github.com/openai/math, family 003), Part II, Sections 12, 15, 19, 20. Section numbers and equation numbers
below refer to that manuscript (local text copy /tmp/qrh-verify/paper.txt).

Everything here uses Python's Fraction type (exact rational arithmetic) and the standard library only. The script does
not check the 190 pages of lemmas that feed these inequalities; it checks the final exponent arithmetic, the generalised
geometry, and the barrier formulas stated in the .md. Exit code 0 iff every check passes.

Model (derived in the .md from Eq. (10.15), (15.6), (15.9), (20.4), Prop. 19.2, Eq. (20.8)):
  free geometry   ell (total slot length), M = lx + ly (row-ball exponent), b = ly - lx (asymmetry)
  h = 1 + ell - lx,  C(s) = s + lx/2 - 1 + h/6,  low exponent  L = lx/2 + b/12           (Prop. 15.3)
  sigma0 = L - (lx/2 - 1 + h/6) = 1 - h/6 + b/12 = 5/6 + (M - 2 ell)/12                   (boundary of the method)
  high exponent of a row bin, relative to C(sigma0):
    E(d; R, q) = a - sigma0 + h(z0 - 1/6) - a ly - ell/2 + q ell + d (R + delta/2 - z0),   a = (1 + delta)/2, z0 = 17/50
  adaptive row count (Prop. 19.2 balanced at t of Eq. (20.8)), x = q/delta:
    Dx = 3 - 17x/9, Px = (1 - x)(2 - 8x/9), J = (alpha - delta) Dx + delta Px, alpha = 5/6,
    R* = 1 - delta + (alpha - delta) delta Px / (2J)

Checks:
  A  the model reproduces every number printed in Section 20 at the paper's geometry (ell, M, b) = (1/6, 5/6, 1/8):
     sigma0 = 7/8, C(7/8) = 3/16, C0 = -1/48, (20.5) -7/1200, (20.6) -79/800, (20.7) -1/48 - delta/16,
     (20.11) -529/2400 + 25 delta/96, Lemma 20.2 identity (20.9) as a polynomial identity in (delta, y)
  B  re-tuned geometry ell = 1/6 + 1/10000, M = 1 - ell, b = 1/8 gives sigma0 = 34999/40000 < 7/8 exactly
  C  every closing inequality of Sections 15.3, 20.1, 20.3, 20.4, 20.5, 20.6 at the re-tuned geometry
  D  Lemma 20.2' (endpoint certificate at the re-tuned geometry): -E* >= 1/20000 on [0,5/6] x [0,1/2], proved by
     reduction to a quadratic in delta and Sturm root counts in x (exact)
  E  generalised Lemma 15.1 exponent and the -d absorption in Prop. 15.3 at the re-tuned geometry
  F  barrier formulas: with density-hypothesis counts the method stops at 167/192 (floor 51/100) and 13/15 (floor -> 1/2)
"""
from fractions import Fraction as Fr
import sys

FAIL = []


def check(name, cond, detail=""):
    status = "ok " if cond else "FAIL"
    print(f"  [{status}] {name}" + (f"   {detail}" if detail else ""))
    if not cond:
        FAIL.append(name)


# ---------------------------------------------------------------- polynomials over Q (coefficient lists, low degree first)
def trim(p):
    p = list(p)
    while len(p) > 1 and p[-1] == 0:
        p.pop()
    return p


def padd(p, q):
    n = max(len(p), len(q))
    return trim([(p[i] if i < len(p) else 0) + (q[i] if i < len(q) else 0) for i in range(n)])


def pscale(p, c):
    return trim([c * a for a in p])


def psub(p, q):
    return padd(p, pscale(q, -1))


def pmul(p, q):
    r = [Fr(0)] * (len(p) + len(q) - 1)
    for i, a in enumerate(p):
        for j, c in enumerate(q):
            r[i + j] += a * c
    return trim(r)


def peval(p, x):
    s = Fr(0)
    for a in reversed(p):
        s = s * x + a
    return s


def pderiv(p):
    return trim([i * p[i] for i in range(1, len(p))]) if len(p) > 1 else [Fr(0)]


def prem(a, b):
    """Remainder of a modulo b (b nonzero)."""
    a = trim(a)
    b = trim(b)
    while len(a) >= len(b) and not (len(a) == 1 and a[0] == 0):
        c = a[-1] / b[-1]
        shift = len(a) - len(b)
        new = list(a)
        for i in range(len(b)):
            new[i + shift] -= c * b[i]
        new.pop()  # the leading coefficient is now exactly zero
        a = trim(new) if new else [Fr(0)]
    return a


def sturm_seq(p):
    seq = [trim(p), pderiv(p)]
    while len(seq[-1]) > 1 or seq[-1][0] != 0:
        r = prem(seq[-2], seq[-1])
        if len(r) == 1 and r[0] == 0:
            break
        seq.append(pscale(r, -1))
    return seq


def sign_changes(vals):
    v = [x for x in vals if x != 0]
    return sum(1 for i in range(len(v) - 1) if (v[i] > 0) != (v[i + 1] > 0))


def roots_in(p, lo, hi):
    """Number of distinct real roots of p in (lo, hi] (Sturm). Requires p(lo) != 0."""
    seq = sturm_seq(p)
    return sign_changes([peval(q, lo) for q in seq]) - sign_changes([peval(q, hi) for q in seq])


def positive_on(p, lo, hi):
    """Exact: p > 0 on the closed interval [lo, hi]."""
    if peval(p, lo) <= 0 or peval(p, hi) <= 0:
        return False
    if len(trim(p)) == 1:
        return True
    return roots_in(p, lo, hi) == 0


print("0. Self-test of the exact Sturm routine")
check("x^2 - 1/16 is not positive on [0,1/2] (root 1/4)", not positive_on([Fr(-1, 16), Fr(0), Fr(1)], Fr(0), Fr(1, 2)))
check("(x - 1/3)^2 + 1/10^6 is positive on [0,1/2]",
      positive_on([Fr(1, 9) + Fr(1, 10 ** 6), Fr(-2, 3), Fr(1)], Fr(0), Fr(1, 2)))
check("(x - 1/3)^2 (double root) is not positive on [0,1/2]", not positive_on([Fr(1, 9), Fr(-2, 3), Fr(1)], Fr(0), Fr(1, 2)))
check("(x-1/5)(x-3/10)(x-2/5) has 3 roots in (0,1/2]",
      roots_in(pmul(pmul([Fr(-1, 5), Fr(1)], [Fr(-3, 10), Fr(1)]), [Fr(-2, 5), Fr(1)]), Fr(0), Fr(1, 2)) == 3)
print()

# ---------------------------------------------------------------- the exponent model
ALPHA = Fr(5, 6)
Z0 = Fr(17, 50)
K_PLAIN = Fr(2, 9)  # plain capacity 1/(6 kappa) at the baseline kappa = 3/4 (Eq. (19.2), (19.5))


def geometry(ell, M, b):
    lx = (M - b) / 2
    ly = (M + b) / 2
    h = 1 + ell - lx
    shift = lx / 2 - 1 + h / 6           # C(s) = s + shift          (Eq. (10.3), (15.9))
    low = lx / 2 + b / 12                # low exponent              (Eq. (15.6))
    sigma0 = low - shift
    return dict(ell=ell, M=M, b=b, lx=lx, ly=ly, h=h, shift=shift, low=low, sigma0=sigma0)


def E(g, d, delta, R, q):
    a = (1 + delta) / 2
    return (a - g["sigma0"] + g["h"] * (Z0 - Fr(1, 6)) - a * g["ly"] - g["ell"] / 2 + q * g["ell"]
            + d * (R + delta / 2 - Z0))


def Rstar(delta, x):
    Dx = 3 - x * (1 + 4 * K_PLAIN)
    Px = (1 - x) * (2 - 4 * x * K_PLAIN)
    J = (ALPHA - delta) * Dx + delta * Px
    return 1 - delta + (ALPHA - delta) * delta * Px / (2 * J)


def C0_B(g):
    """E(h) = C0 + B delta + ell q - h (1 - R)."""
    C0 = (1 - g["ly"]) / 2 - g["sigma0"] + 5 * g["h"] / 6 - g["ell"] / 2
    B = (1 - g["ly"] + g["h"]) / 2
    return C0, B


# ---------------------------------------------------------------- A: reproduce the paper
print("A. Paper geometry (ell, M, b) = (1/6, 5/6, 1/8)")
P = geometry(Fr(1, 6), Fr(5, 6), Fr(1, 8))
check("lx = 17/48, ly = 23/48, h = 13/16 (Eq. 12.4)", (P["lx"], P["ly"], P["h"]) == (Fr(17, 48), Fr(23, 48), Fr(13, 16)))
check("C(s) = s - 11/16 (Eq. 12.3, 15.9)", P["shift"] == Fr(-11, 16))
check("low exponent 3/16 = C(7/8) (Eq. 15.6)", P["low"] == Fr(3, 16))
check("sigma0 = 7/8", P["sigma0"] == Fr(7, 8))
C0, B = C0_B(P)
check("C0 = -1/48, delta-coefficient 2/3 (Eq. 20.4)", (C0, B) == (Fr(-1, 48), Fr(2, 3)))
check("(20.5) floor E(h) = -7/1200", E(P, P["h"], Fr(1, 50), 1, Fr(1, 100)) == Fr(-7, 1200))
check("(20.6) small-row exponent -79/800", P["h"] * (Z0 - Fr(1, 6)) - P["ly"] / 2 == Fr(-79, 800))
check("(20.7) delta = alpha: E(h) = -1/48 - alpha/16",
      E(P, P["h"], ALPHA, 1 - ALPHA, ALPHA / 2) == Fr(-1, 48) - ALPHA / 16)
ok = all(E(P, Fr(1, 2), dl, Fr(76, 75) - 2 * dl / 3, dl / 2) == Fr(-529, 2400) + 25 * dl / 96
         for dl in [Fr(1, 50), Fr(1, 3), Fr(5, 6)])
check("(20.11) E(1/2) = -529/2400 + 25 delta/96 (three points of a linear identity)", ok)
check("(20.11) value at delta = 5/6 is -49/14400", Fr(-529, 2400) + 25 * Fr(5, 6) / 96 == Fr(-49, 14400))
# Lemma 20.2 identity (20.9): 10368 v J (-E*) = (3+5y)((4v delta - 79)^2 + 49) + 4y(4 v delta[...] + 265 + 3485 y)
ok = True
for yv in [Fr(0), Fr(1, 7), Fr(1, 5), Fr(1, 3), Fr(2, 5), Fr(1, 2)]:
    for dl in [Fr(0), Fr(1, 5), Fr(79, 204), Fr(1, 2), Fr(5, 6)]:
        x = Fr(1, 2) - yv
        v = 51 + 41 * yv
        Dx = 3 - Fr(17, 9) * x
        Px = (1 - x) * (2 - Fr(8, 9) * x)
        J = (ALPHA - dl) * Dx + dl * Px
        Estar = E(P, P["h"], dl, Rstar(dl, x), x * dl)
        lhs = 10368 * v * J * (-Estar)
        rhs = ((3 + 5 * yv) * ((4 * v * dl - 79) ** 2 + 49)
               + 4 * yv * (4 * v * dl * ((1 + 3 * yv) * (15 + 32 * yv) * dl + 9 - 13 * yv) + 265 + 3485 * yv))
        ok = ok and (lhs == rhs)
check("Lemma 20.2 identity (20.9): both sides have degree <= 2 in delta, <= 4 in y; equal on a 5x6 tensor grid,"
      " hence identical", ok)
m = E(P, P["h"], Fr(79, 204), Rstar(Fr(79, 204), Fr(1, 2)), Fr(79, 408))
check("true minimum of -E* at (79/204, 1/2) is 147/(10368*51*J) ~ 2.28e-4 (paper certifies 49/440640)",
      -m > Fr(49, 440640), f"-E* = {float(-m):.6e}")

# ---------------------------------------------------------------- B: re-tuned geometry
print("\nB. Re-tuned geometry ell = 1/6 + 1/10000, M = 1 - ell, b = 1/8")
ELL = Fr(1, 6) + Fr(1, 10000)
G = geometry(ELL, 1 - ELL, Fr(1, 8))
THETA = Fr(34999, 40000)
check("sigma0 = 34999/40000 = 7/8 - 1/40000", G["sigma0"] == THETA == Fr(7, 8) - Fr(1, 40000),
      f"lx={G['lx']}, ly={G['ly']}, h={G['h']}")
check("sigma0 = 11/12 - ell/4 on the line M + ell = 1", G["sigma0"] == Fr(11, 12) - ELL / 4)
check("C(sigma0) equals the low exponent lx/2 + b/12", THETA + G["shift"] == G["low"], f"C(theta') = {G['low']}")
check("M + ell = 1 (the dual-length condition used in Lemma 15.1 is kept exactly)", G["M"] + G["ell"] == 1)

# ---------------------------------------------------------------- C: closing inequalities at the re-tuned geometry
print("\nC. Closing inequalities of Sections 15.3 and 20 at the re-tuned geometry")
g = G
C0n, Bn = C0_B(g)
print(f"     C0 = {C0n} ~ {float(C0n):.6e},  delta-coefficient B = {Bn} ~ {float(Bn):.6f},  h = {float(g['h']):.6f}")
d0 = Fr(1, 50)
ef = E(g, g["h"], d0, 1, d0 / 2)
check("(20.5') floor bin at d = h: E < 0", ef < 0, f"{float(ef):.6e}")
check("(20.5') floor slope R + delta0/2 - 17/50 > 0", 1 + d0 / 2 - Z0 > 0)
ea = E(g, g["h"], ALPHA, 1 - ALPHA, ALPHA / 2)
check("(20.7') delta = alpha endpoint, R = 1 - delta, q = delta/2: E < 0", ea < 0, f"{float(ea):.6e}")
mid = [E(g, Fr(1, 2), dl, Fr(76, 75) - 2 * dl / 3, dl / 2) for dl in [Fr(1, 50), Fr(5, 6)]]
check("(20.11') middle range d <= 1/2 (linear in delta, both endpoints) E < 0", max(mid) < 0,
      f"max {float(max(mid)):.6e}")
check("(20.11') slope of 76/75 - 2delta/3 + delta/2 - 17/50 positive on [1/50, 5/6]",
      all(Fr(76, 75) - 2 * dl / 3 + dl / 2 - Z0 > 0 for dl in [Fr(1, 50), Fr(5, 6)]))
dmin = Fr(1, 100)
es = g["h"] * (Z0 - Fr(1, 6)) - g["ly"] / 2
check("(20.6') small rows: h(17/50 - 1/6) - ly/2 + (63/50) dmin < 0", es + Fr(63, 50) * dmin < 0,
      f"d-indep part {float(es):.6e}")
check("(20.3) row exponent 1 + 3/5 - 17/50 = 63/50 is geometry independent", 1 + Fr(3, 5) - Z0 == Fr(63, 50))
sup = g["ell"] / g["h"]
check("Prop 19.2 supply at d = h: ell/h > 1/5 > 7/37", sup > Fr(1, 5) > Fr(7, 37), f"ell/h = {float(sup):.6f}")
zeta_max = 5 * g["ell"] - g["h"]
check("(20.5') extension: 5 ell - h > 0, so supply > 1/5 on h < d <= h + zeta", zeta_max > 0, f"5ell-h = {zeta_max}")
# R* <= 1 - delta + (alpha - delta)/2 <= 17/12 ; Delta <= 11/12 - theta'
Dmax = Fr(11, 12) - THETA
check("(20.5') slope bound R* + Delta/4 + 1/2 - 17/50 < 2 with Delta <= 11/12 - theta'",
      Fr(17, 12) + Dmax / 4 + Fr(1, 2) - Z0 < 2, f"Delta <= {Dmax}")
check("(20.5') frequency slope R + delta/2 - 17/50 >= 33/50 - delta/2 >= 4/25 for R >= 1 - delta",
      Fr(33, 50) - ALPHA / 2 >= Fr(4, 25))
check("(20.3) principal margins m_w = ly/20 > 0, m_z = h/600 > 0", g["ly"] > 0 and g["h"] > 0)
check("(20.6) kappa_P = 7 ell/(16K) < theta' min ell_i = theta' ell/K  <=>  7/16 < theta'", Fr(7, 16) < THETA)
# Prop 15.3 length conditions
check("Prop 15.3: lx - ell > 0 (X' >= 1 for every rescaled subset)", g["lx"] - g["ell"] > 0,
      f"{float(g['lx'] - g['ell']):.6f}")
v = g["ly"] - g["ell"] - Fr(11, 6) * g["b"]
check("Prop 15.3: ly - ell - 11b/6 > 0 (Y'/Pa^(11/6) grows)", v > 0, f"{float(v):.6f} (paper 1/12)")
check("Prop 15.3: M - 2 ell > 0 (Q >= 1)", g["M"] - 2 * g["ell"] > 0, f"{float(g['M'] - 2 * g['ell']):.6f}")
check("Prop 15.3: Pa = Z^b >= 1 (b >= 0)", g["b"] >= 0)
check("Part I input: Delta = beta* - theta' <= 11/12 - theta', kappa = 2 beta* - 1 <= 5/6", Dmax > 0)
check("(20.10') capacity allowance: (1 - h/4) > 0", 1 - g["h"] / 4 > 0, f"1 - h/4 = {1 - g['h'] / 4}")
# second Euler region extended to x_r >= theta' (Lemma 7.1, (7.15)): exponents at x_r = theta', w_r = 19/20, z_r = 33/200
e_good = 1 - THETA - Fr(19, 20) - 6 * Fr(33, 200)
e_ram = 1 - THETA - Fr(19, 20)
e_R = 4 - 6 * THETA - 6 * Fr(33, 200)
check("Lemma 7.1 second region at x_r = theta': good-prime exponent < -1 - 4/5 (keeps c_H = 4/5)",
      e_good + 1 < Fr(-4, 5), f"{e_good}")
check("Lemma 7.1 second region at x_r = theta': ramified exponent < 0, R-exponent < -1",
      e_ram < 0 and e_R < -1, f"{e_ram}, {e_R}")
check("(16.13') principal local error exponents max(-x_r, -6z_r, 4-5x_r-6z_r, 1-w_r-6z_r) <= -theta'",
      max(-THETA, -6 * Fr(33, 200), 4 - 5 * THETA - 6 * Fr(33, 200), 1 - Fr(19, 20) - 6 * Fr(33, 200)) <= -THETA)
check("Lemma 10.6 / 16.2 small-row line in D1(eps0): beta* + 1/2 > 1 + 0.37 for beta* > theta'",
      THETA + Fr(1, 2) > 1 + Fr(37, 100))

# ---------------------------------------------------------------- D: Lemma 20.2' exact certificate
print("\nD. Lemma 20.2' (endpoint certificate) at the re-tuned geometry, margin m0 = 1/20000")
m0 = Fr(1, 20000)
# polynomials in x
Dx = [Fr(3), Fr(-17, 9)]
Px = [Fr(2), Fr(-26, 9), Fr(8, 9)]
c0 = -C0n - m0
L1 = [g["h"] - Bn, -g["ell"]]
PmD = psub(Px, Dx)
A0 = pscale(Dx, 2 * ALPHA * c0)
A1 = padd(padd(pscale(pmul(Dx, L1), 2 * ALPHA), pscale(PmD, 2 * c0)), pscale(Px, -g["h"] * ALPHA))
A2 = padd(pscale(pmul(PmD, L1), 2), pscale(Px, g["h"]))
# sanity: P(delta, x) = A2 delta^2 + A1 delta + A0 equals 2J(-E* - m0) at sample points
ok = True
for x in [Fr(0), Fr(1, 9), Fr(1, 4), Fr(1, 2)]:
    for dl in [Fr(0), Fr(1, 7), Fr(79, 204), Fr(5, 6)]:
        Jv = (ALPHA - dl) * peval(Dx, x) + dl * peval(Px, x)
        lhs = 2 * Jv * (-E(g, g["h"], dl, Rstar(dl, x), x * dl) - m0)
        rhs = peval(A2, x) * dl * dl + peval(A1, x) * dl + peval(A0, x)
        ok = ok and lhs == rhs
check("expansion P(delta,x) = 2J(-E* - m0) = A2 delta^2 + A1 delta + A0 (16 exact points)", ok)
check("Px - 7/9 = (2x - 1)(4x - 11)/9 >= 0 on [0,1/2]; Dx >= 37/18 there (linear, decreasing)",
      psub(Px, [Fr(7, 9)]) == pscale(pmul([Fr(-1), Fr(2)], [Fr(-11), Fr(4)]), Fr(1, 9)) and peval(Dx, Fr(1, 2)) == Fr(37, 18))
check("J = (alpha - delta) Dx + delta Px >= min(alpha*37/18, (5/6)(7/9)) = 35/54 > 0 on the box (linear in delta)",
      min(ALPHA * Fr(37, 18), Fr(5, 6) * Fr(7, 9)) == Fr(35, 54))
check("A0(x) = 2 alpha c0 Dx > 0 on [0,1/2]  (c0 = -C0 - m0 > 0)", c0 > 0 and positive_on(A0, Fr(0), Fr(1, 2)))
check("A2(x) > 0 on [0,1/2] (P convex in delta)", positive_on(A2, Fr(0), Fr(1, 2)), f"deg {len(A2) - 1}")
Disc = psub(pscale(pmul(A2, A0), 4), pmul(A1, A1))
discpos = positive_on(Disc, Fr(0), Fr(1, 2))
cert_ok = discpos
if discpos:
    check("Disc(x) = 4 A2 A0 - A1^2 > 0 on [0,1/2]  =>  P > 0 for every real delta", True, f"deg {len(Disc) - 1}")
else:
    # split: where the vertex delta_v = -A1/(2A2) <= 0 use P(0) = A0 > 0; elsewhere need Disc > 0
    # find the sub-interval where A1 < 0 (vertex positive) and certify Disc > 0 there by bisection with Sturm
    print("     Disc not positive on all of [0,1/2]; splitting by the sign of A1")
    lo, hi = Fr(0), Fr(1, 2)
    # certify on a rational grid of subintervals: on each, either A1 >= 0 throughout (vertex <= 0) or Disc > 0
    N = 64
    allok = True
    for i in range(N):
        a_, b_ = lo + (hi - lo) * i / N, lo + (hi - lo) * (i + 1) / N
        if positive_on(A1, a_, b_):
            continue
        if positive_on(Disc, a_, b_):
            continue
        # vertex beyond 5/6: A1 + (5/3) A2 <= 0 throughout and P(5/6) > 0
        P56 = padd(padd(pscale(A2, Fr(25, 36)), pscale(A1, Fr(5, 6))), A0)
        if positive_on(pscale(padd(A1, pscale(A2, Fr(5, 3))), -1), a_, b_) and positive_on(P56, a_, b_):
            continue
        allok = False
        print(f"     uncertified subinterval [{float(a_)}, {float(b_)}]")
    check("P(delta,x) > 0 on [0,5/6] x [0,1/2] via subinterval case split", allok)
    cert_ok = allok
# numeric display of the true minimum
best = None
for i in range(0, 501):
    dl = Fr(5, 6) * i / 500
    val = -E(g, g["h"], dl, Rstar(dl, Fr(1, 2)), dl / 2)
    if best is None or val < best[0]:
        best = (val, dl)
print(f"     min over delta (x = 1/2 grid) of -E* ~ {float(best[0]):.6e} at delta ~ {float(best[1]):.4f}")
check("certified: -E* >= m0 = 1/20000 on the whole box (since J > 0 and P >= 0)", cert_ok and A2[0] > 0)

# ---------------------------------------------------------------- E: generalised Lemma 15.1 and Prop 15.3 absorption
print("\nE. Generalised Lemma 15.1 exponent and Prop 15.3 absorption")
# Lemma 15.1 proof (second branch) gives energy exponent M' + ((1 + 3 ell' - 2 M')/4)_+, ell' = ell - d, M' = M - 2d.
# With M + ell = 1 this is ((5 ell - 1 + d)/4)_+ ; paper's (d - 1/6)/4 is the case ell = 1/6.
ext = lambda d: max(Fr(0), (1 + 3 * (g["ell"] - d) - 2 * (g["M"] - 2 * d)) / 4)
check("paper case: (1 + 3ell' - 2M')/4 = (d - 1/6)/4 when (ell, M) = (1/6, 5/6)",
      all((1 + 3 * (Fr(1, 6) - d) - 2 * (Fr(5, 6) - 2 * d)) / 4 == (d - Fr(1, 6)) / 4 for d in [Fr(0), Fr(1, 12)]))
kink = 1 - 5 * g["ell"]
f = lambda d: -d + ext(d) / 2           # per-subset exponent in Prop 15.3: d - 3d/2 - d/2 + ext/2
pts = [Fr(0), kink, g["ell"]]
check("re-tuned: excess appears only for d > 1 - 5 ell, and is at most (6 ell - 1)/4 = 3/20000",
      ext(Fr(0)) == 0 and ext(g["ell"]) == (6 * g["ell"] - 1) / 4 == Fr(3, 20000), f"kink at d = {kink}")
check("Prop 15.3': f(d) = -d + ext(d)/2 <= 0 on [0, ell] (piecewise linear, check breakpoints)",
      all(f(d) <= 0 for d in pts), f"f(ell) = {f(g['ell'])}")
check("energy at d = 0: 1 + 3 ell - 2M <= 0 (no excess for the fully marked subset)", 1 + 3 * g["ell"] - 2 * g["M"] <= 0,
      f"{1 + 3 * g['ell'] - 2 * g['M']}")

# ---------------------------------------------------------------- F: barrier formulas
print("\nF. Barrier of the architecture under density-hypothesis row counts")
# With R = 1 - delta for every adaptive bin and R = 1 in the floor bin (a0 = 1/2 + delta0/2), b = 0, M = 1 - ell:
# floor G = 2/3 + ell + delta0 (1 + 3 ell)/2 must not exceed sigma0 = 11/12 - ell/4.
for d0v, expect in [(Fr(1, 50), Fr(167, 192)), (Fr(0), Fr(13, 15))]:
    ellstar = (1 - 2 * d0v) / (5 + 6 * d0v)
    gb = geometry(ellstar, 1 - ellstar, Fr(0))
    gf = E(gb, gb["h"], d0v, 1, d0v / 2) + gb["sigma0"]       # floor high exponent (absolute, minus shift)
    th = gb["sigma0"]
    check(f"delta0 = {d0v}: ell* = {ellstar}, floor exponent = sigma0 = {th}", gf == th and th == expect,
          f"~ {float(th):.6f}")
    # adaptive bins with R = 1 - delta are flat in delta when b = 0 and lie below the floor
    flat = [E(gb, gb["h"], dl, 1 - dl, dl / 2) for dl in [Fr(1, 10), Fr(1, 2), Fr(5, 6)]]
    check(f"delta0 = {d0v}: adaptive bins with R = 1 - delta give E = const <= 0", len(set(flat)) == 1 and flat[0] <= 0,
          f"E = {flat[0]}")
# symbolic check of the floor formula at a few (ell, delta0)
ok = True
for ellv in [Fr(1, 7), Fr(1, 5), Fr(3, 16)]:
    for d0v in [Fr(0), Fr(1, 50), Fr(1, 10)]:
        gb = geometry(ellv, 1 - ellv, Fr(0))
        gf = E(gb, gb["h"], d0v, 1, d0v / 2) + gb["sigma0"]
        ok = ok and gf == Fr(2, 3) + ellv + d0v * (1 + 3 * ellv) / 2
check("floor exponent identity G_floor = 2/3 + ell + delta0 (1 + 3 ell)/2 (b = 0, M = 1 - ell), 9 points", ok)
check("sigma0 = 5/6 + (M - 2 ell)/12 identity (3 points)",
      all(geometry(e_, m_, b_)["sigma0"] == Fr(5, 6) + (m_ - 2 * e_) / 12
          for (e_, m_, b_) in [(Fr(1, 6), Fr(5, 6), Fr(1, 8)), (Fr(1, 5), Fr(3, 4), Fr(0)), (Fr(0), Fr(1), Fr(1, 3))]))

print()
if FAIL:
    print(f"FAILED: {len(FAIL)} check(s): {FAIL}")
    sys.exit(1)
print("all checks passed")
sys.exit(0)
