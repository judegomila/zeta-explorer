"""c11-frontier-nth-order-sieve: exact rational exponent ledger.

Input under test (unrefereed): de Faveri, arXiv 2610.04045, Theorem 1.1
   Theta_n(A, B) << (AB)^eps (A + B + A^(1-1/n) B^(2/n) + A^(2/n) B^(1-1/n)),
and Corollary 1.5 (family zero density, exponent 1 - delta_n(sigma)).
Everything here is exponent arithmetic with fractions.Fraction. Nothing is a statement about zeros.
Planned memory: a few thousand Fractions; no arrays.  Run: scripts/memcap.sh 8 python3 ledger.py
"""
from fractions import Fraction as F
from itertools import combinations
import json

OK = True
OUT = {}


def check(cond, msg):
    global OK
    print(("  ok   " if cond else "  FAIL ") + msg)
    OK &= bool(cond)


def old(a, b):                      # exponent of K + D + (KD)^(2/3) at K = U^a, D = U^b
    return max(a, b, F(2, 3) * (a + b))


def new(a, b, n=6):                 # exponent of the n-th order bound
    return max(a, b, (1 - F(1, n)) * a + F(2, n) * b, F(2, n) * a + (1 - F(1, n)) * b)


def piecewise_min(lines, lo, hi):
    """min over x in [lo,hi] of max of affine (slope, intercept); exact (breakpoint enumeration)."""
    pts = {lo, hi}
    for (a1, b1), (a2, b2) in combinations(lines, 2):
        if a1 != a2:
            x = (b2 - b1) / (a1 - a2)
            if lo <= x <= hi:
                pts.add(x)
    return min((max(a * x + b for a, b in lines), x) for x in sorted(pts))


# ------------------------------------------------------------------ 1. first lemma
print("1. First lemma (n = 6): (KD)^(2/3) -> K^(5/6) D^(1/3) + K^(1/3) D^(5/6)")
check(new(1, 1) == F(7, 6) and old(1, 1) == F(4, 3), "balanced point K = D: new exponent 7/6, old 4/3 (per unit of log K)")
bad = 0
worse = 0
for i in range(0, 121):
    for j in range(0, 121):
        a, b = F(i, 40), F(j, 40)
        if new(a, b) > old(a, b):
            worse += 1
        offd = max(F(5, 6) * a + F(1, 3) * b, F(1, 3) * a + F(5, 6) * b)
        inside = (b / 2 < a < 2 * b)
        if (offd > max(a, b)) != inside:
            bad += 1
check(worse == 0, "new <= old at all 14641 rational grid points (a, b) in [0,3]^2, step 1/40")
check(bad == 0, "off-diagonal terms exceed max(K, D) exactly for D^(1/2) < K < D^2 (same grid): the window is the old one")
t1 = sum(1 for i in range(0, 121) for j in range(1, 121)
         if (F(5, 6) * F(i, 40) + F(1, 3) * F(j, 40) > max(F(i, 40), F(j, 40))) != (F(4, 5) * F(j, 40) < F(i, 40) < 2 * F(j, 40)))
check(t1 == 0, "single term K^(5/6) D^(1/3) exceeds max(K, D) exactly for D^(4/5) < K < D^2 (c10 item 1 stated D^(4/5) < K < D^(5/4): corrected)")
# old term exceeds K + D for D^(1/2) < K < D^2; new only for D^(4/5) < K < D^(5/4)
check(all(old(F(i, 40), 1) > max(F(i, 40), 1) for i in range(21, 80)) and old(F(1, 2), 1) == 1 and old(2, 1) == 2,
      "old term exceeds max(K, D) exactly for D^(1/2) < K < D^2")
for n in (3, 4, 5, 6):
    print("     n = %d: balanced exponent %s; term A^(1-1/n) B^(2/n) exceeds A + B for B^(%s) < A < B^2" % (n, new(1, 1, n), F(n - 2, n - 1)))
check(new(1, 1, 3) == F(4, 3), "n = 3: the new bound equals Heath-Brown's (KD)^(2/3) (no change for cubic rows)")
check(new(1, 1, 4) == F(5, 4), "n = 4: balanced exponent 5/4, i.e. (MN)^c with c = 5/8")

# ------------------------------------------------------------------ 2. Z12
print("2. Row Z12: general-coefficient large sieve as a count option at class (delta, x)")
DC = F(46934485869814, 10 ** 14)       # delta_c of r2-zf-critical-density (14 digits, rational stand-in)
RC = F(590332354, 10 ** 9)


def count_R(d, x, k, alpha=F(5, 6)):
    c = 1 / (3 * k)
    D = 3 - (1 + 2 * c) * x
    P = (2 - 2 * c * x) * (1 - x)
    J = (alpha - d) * D + d * P
    return 1 - d + (alpha - d) * d * P / (2 * J)


def inf_option(d, n=6, hi=F(3)):
    """inf over total length Y in [0,hi] of [sieve exponent at (K, D) = (U, U^Y)] - d * Y."""
    lines = [(-d, F(1)), (1 - d, F(0)), (F(2, n) - d, 1 - F(1, n)), (1 - F(1, n) - d, F(2, n))]
    return piecewise_min(lines, F(0), hi)


def inf_option_old(d, hi=F(3)):
    lines = [(-d, F(1)), (1 - d, F(0)), (F(2, 3) - d, F(2, 3))]
    return piecewise_min(lines, F(0), hi)


v_old, y_old = inf_option_old(DC)
v_new, y_new = inf_option(DC)
print("     critical class delta_c = %.9f: old option %.6f at Y = %s; new option %.6f at Y = %s; R_c = %.6f"
      % (float(DC), float(v_old), y_old, float(v_new), y_new, float(RC)))
check(v_old == 1 - DC / 2 and y_old == F(1, 2), "old: inf = 1 - delta/2 at Y = 1/2 (0.765328, as on file)")
check(v_new == F(7, 6) - DC and y_new == 1, "new: inf = 7/6 - delta at Y = 1 (exact)")
check(v_new > RC, "new option 7/6 - delta_c = %.6f > R_c = 0.590332: not selected at the critical class" % float(v_new))
OUT["z12_old_option"] = float(v_old)
OUT["z12_new_option"] = float(v_new)
OUT["z12_new_option_exact"] = "7/6 - delta_c"
# closed form on the class range
okc = True
for i in range(0, 201):
    d = F(1, 8) + (F(5, 6) - F(1, 8)) * F(i, 200)
    v, y = inf_option(d)
    want = 1 - d / 2 if d <= F(1, 3) else F(7, 6) - d
    okc &= (v == want)
check(okc, "closed form: inf = 1 - delta/2 for delta <= 1/3, 7/6 - delta for 1/3 <= delta <= 5/6 (201 rational classes)")
# never selected: compare with R(delta, x, kappa) on a rational grid, four kappa values
minmargin = None
for k in (F(13, 18), F(3, 4), F(29991, 40000), F(1)):
    for i in range(0, 171):
        d = F(1, 8) + (F(5, 6) - F(1, 8)) * F(i, 170)
        opt = inf_option(d)[0]
        for j in range(0, 51):
            x = F(j, 100)
            m = opt - count_R(d, x, k)
            if minmargin is None or m < minmargin[0]:
                minmargin = (m, d, x, k)
check(minmargin[0] > 0, "new option > R(delta, x, kappa) at all 4 x 171 x 51 classes; least margin %.6f at delta = %.4f, x = %.2f, kappa = %s"
      % (float(minmargin[0]), float(minmargin[1]), float(minmargin[2]), minmargin[3]))
OUT["z12_min_margin_new_option_minus_R"] = float(minmargin[0])
# analytic statement behind it: (R - (1 - delta)) <= (3/5) delta (5/6 - delta) <= 5/48 < 1/6 because J >= (5/6) P (D >= P)
mx = max(F(3, 5) * F(i, 1000) * (F(5, 6) - F(i, 1000)) for i in range(0, 834))
check(mx <= F(5, 48) < F(1, 6), "analytic bound: R - (1 - delta) <= (3/5) delta (5/6 - delta) <= 5/48 < 1/6, so 7/6 - delta > R for all delta, x")
dp_ok = all((3 - (1 + 2 * c) * x) - (2 - 2 * c * x) * (1 - x) >= 1
            for c in (1 / (3 * F(13, 18)), F(1, 3)) for x in [F(j, 100) for j in range(0, 51)])
check(dp_ok, "D - P = 1 + x - 2 c x^2 >= 1 on 0 <= x <= 1/2 for c = 1/(3 kappa), kappa in [13/18, 1] (endpoints checked; monotone in c)")

print("   2b. table (E5) of r2-zf-gm-inverse-witness with the new norm (K = U, D = U^r)")
rows = []
for r in (F(7605, 10000), F(4, 5), F(5, 6), F(87, 100), F(1)):
    rho0 = 1 - DC * r
    allowed = 1 + 2 * DC * r - 2 * r
    po, pn = old(1, r) - rho0, new(1, r) - rho0
    co, cn = old(1, r) - DC * r, new(1, r) - DC * r
    rows.append((float(r), float(rho0), float(allowed), float(po), float(pn), float(pn - allowed), float(co), float(cn)))
    print("     r = %.4f rho0 = %.4f allowed U^%.3f | proved old U^%.3f new U^%.3f | excess new U^%.3f | count (2.1): old %.4f new %.4f"
          % rows[-1])
    check(pn > allowed and cn > rho0, "r = %.4f: S2 still exceeds the budget and the (2.1) count stays above 1 - delta r" % float(r))
OUT["z12_E5_rows"] = rows
check(all(new(1, F(i, 100)) == 1 for i in range(0, 51)) and new(1, F(51, 100)) > 1,
      "mean-value-optimal range of the norm at K = U, D = U^n is n <= 1/2 for the new bound too (threshold unchanged)")

print("   2c. Ingham/Montgomery two-class scheme (density.py part C) as an exact LP in (x1, y, R)")


def ingham(pieces, d, lo=F(1, 50), hi=F(4)):
    # minimise R s.t. R >= a + (b - d) x1, R >= a + (b - d) y, R >= 1/3 + (2/3)(a + b x1) - (2/3) d y, lo <= x1 <= y <= hi, x1 <= 2
    cons = []          # (cx, cy, cR, rhs) meaning cx*x1 + cy*y + cR*R >= rhs
    for b, a in pieces:
        cons.append((-(b - d), F(0), F(1), a))
        cons.append((F(0), -(b - d), F(1), a))
        cons.append((-F(2, 3) * b, F(2, 3) * d, F(1), F(1, 3) + F(2, 3) * a))
    cons += [(F(1), F(0), F(0), lo), (F(-1), F(1), F(0), F(0)), (F(0), F(-1), F(0), -hi), (F(-1), F(0), F(0), F(-2))]
    best = None
    for c1, c2, c3 in combinations(cons, 3):
        M = [list(c1[:3]), list(c2[:3]), list(c3[:3])]
        rhs = [c1[3], c2[3], c3[3]]
        det = (M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0])
               + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]))
        if det == 0:
            continue
        sol = []
        for col in range(3):
            Mc = [row[:] for row in M]
            for r_ in range(3):
                Mc[r_][col] = rhs[r_]
            dc = (Mc[0][0] * (Mc[1][1] * Mc[2][2] - Mc[1][2] * Mc[2][1]) - Mc[0][1] * (Mc[1][0] * Mc[2][2] - Mc[1][2] * Mc[2][0])
                  + Mc[0][2] * (Mc[1][0] * Mc[2][1] - Mc[1][1] * Mc[2][0]))
            sol.append(dc / det)
        if all(c[0] * sol[0] + c[1] * sol[1] + c[2] * sol[2] >= c[3] for c in cons):
            if best is None or sol[2] < best[2]:
                best = sol
    return best


# pieces: (slope in K-exponent, intercept) of the norm exponent De(K) at D = U
P_old = [(F(0), F(1)), (F(1), F(0)), (F(2, 3), F(2, 3))]
P_new = [(F(0), F(1)), (F(1), F(0)), (F(1, 3), F(5, 6)), (F(5, 6), F(1, 3))]
P_perf = [(F(0), F(1)), (F(1), F(0))]
res = {}
for name, P in (("old (KD)^(2/3)", P_old), ("new n = 6", P_new), ("perfect K + D", P_perf)):
    x1, y, R = ingham(P, DC)
    res[name] = (float(R), float(x1), float(y))
    print("     %-16s exponent %.6f (mollifier %.4f, Y %.4f)" % (name, float(R), float(x1), float(y)))
check(abs(res["old (KD)^(2/3)"][0] - 0.795641) < 2e-4, "old value reproduces the file's grid optimum 0.795641")
check(abs(res["perfect K + D"][0] - float(3 * (1 - DC) / (3 - DC))) < 1e-12, "perfect sieve reproduces 3(1-s)/(2-s) form = 0.629072")
check(res["new n = 6"][0] > float(RC), "new two-class exponent %.6f > R_c = 0.590332" % res["new n = 6"][0])
OUT["z12_two_class"] = res

print("   2d. Corollary 1.5 at n = 6 as a count option (zeros with real part >= (1 + delta)/2, conductor aspect)")


def one_minus_delta_sigma(n, s):
    q = 2 * s - 1
    if s <= F(1, 2) + F(1, n):
        return 1 - q / (4 - n * q)
    if s <= 1 - F(1, 2 * n):
        num = q * (q * n * n - (6 * s - 2) * n + 3)
        den = q * (3 - 2 * s) * n * n - 4 * s * n + 2
        return 1 - num / den
    return 1 - (8 * s * s - 10 * s + 3) / (1 - 4 * (1 - s) ** 2 * n)


for n in (3, 4, 6):
    s1, s2 = F(1, 2) + F(1, n), 1 - F(1, 2 * n)
    q1, q2 = 2 * s1 - 1, 2 * s2 - 1
    left = 1 - q1 / (4 - n * q1)
    mid1 = 1 - (q1 * (q1 * n * n - (6 * s1 - 2) * n + 3)) / (q1 * (3 - 2 * s1) * n * n - 4 * s1 * n + 2) if n != 3 else left
    right = 1 - (8 * s2 * s2 - 10 * s2 + 3) / (1 - 4 * (1 - s2) ** 2 * n)
    mid2 = right if n == 3 else 1 - (q2 * (q2 * n * n - (6 * s2 - 2) * n + 3)) / (q2 * (3 - 2 * s2) * n * n - 4 * s2 * n + 2)
    check(left == mid1 and mid2 == right and one_minus_delta_sigma(n, F(1)) == 0,
          "n = %d: transcribed exponent continuous at both breakpoints (%s, %s) and 0 at sigma = 1" % (n, left, right))
check(one_minus_delta_sigma(6, F(3, 4)) == F(8, 11) and one_minus_delta_sigma(4, F(7, 8)) == F(1, 2),
      "values 8/11 (n = 6, sigma = 3/4) and 1/2 (n = 4, sigma = 7/8) agree with the c10 table")
# proof-side form of the middle range: g = ((2n-3) q (n+1-nq) - 2(n-1)) / D
sig = (1 + DC) / 2
dens_c = one_minus_delta_sigma(6, sig)
print("     n = 6 at the critical class: 1 - delta_6((1 + delta_c)/2) = %.6f; R_c = %.6f; R(delta_c, x = 0) = %.6f"
      % (float(dens_c), float(RC), float(count_R(DC, F(0), F(29991, 40000)))))
mm = None
lowok = True
for k in (F(13, 18), F(3, 4), F(29991, 40000), F(1)):
    for i in range(0, 171):
        d = F(1, 8) + (F(5, 6) - F(1, 8)) * F(i, 170)
        g = one_minus_delta_sigma(6, (1 + d) / 2)
        lowok &= (g >= inf_option(d)[0])
        for j in range(0, 51):
            m = g - count_R(d, F(j, 100), k)
            if mm is None or m < mm[0]:
                mm = (m, d, F(j, 100), k)
check(lowok, "Cor 1.5 exponent >= the product-polynomial infimum of section 2 at every class (it is one such application)")
check(mm[0] > 0, "Cor 1.5 (n = 6) exponent > R(delta, x, kappa) at all classes; least margin %.6f at delta = %.4f, x = %.2f"
      % (float(mm[0]), float(mm[1]), float(mm[2])))
OUT["z12_density6_at_critical"] = float(dens_c)
OUT["z12_density6_min_margin"] = float(mm[0])

# ------------------------------------------------------------------ 3. Z6 / Z5
print("3. Rows Z6 and Z5 (toy geometry of the file: D = Q^(7/5); paper geometry X = s-length, P = X^2/Q)")
q, D = F(1), F(7, 5)
eo, en = old(q, D) / 2, new(q, D) / 2
check(eo == F(4, 5), "Z6 old: (Q + D + (QD)^(2/3))^(1/2) = Q^(4/5) (as on file)")
check(en == F(3, 4), "Z6 new: (Q + D + Q^(5/6) D^(1/3) + Q^(1/3) D^(5/6))^(1/2) = Q^(3/4); binding term Q^(1/3) D^(5/6) = Q^(3/2)")
check(max(q, D) / 2 == F(7, 10) and F(7, 10) > F(1, 2), "Z6 floor of any (m | c) operator-norm bound: D^(1/2) = Q^(7/10) > Q^(1/2) (the diagonal term alone misses)")
print("     Z6: needed Q^(1/2 - eta); shortfall old Q^(3/10 + eta), new Q^(1/4 + eta), floor of the grouping Q^(1/5 + eta)")
OUT["z6"] = {"old": "4/5", "new": "3/4", "needed": "1/2 - eta", "grouping_floor": "7/10"}
# Z5: Gram exponent e in sum_m |A_m(X)|^2 << (Q/X)(1 + P^e), coefficients of size X^-1 on s ~ X (||a||^2 = 1/X)
okz5 = True
for i in range(50, 101):            # X = Q^x, 1/2 <= x <= 1
    x = F(i, 100)
    P = 2 * x - 1                   # log_Q of P = X^2/Q
    base = 1 - x                    # log_Q of Q/X
    g_new = new(F(1), x) - x - base  # excess over Q/X
    g_old = old(F(1), x) - x - base
    okz5 &= (g_new == P / 6) and (g_old == P / 3)
check(okz5, "Z5: Gram exponent e = 1/3 (old sieve) -> e = 1/6 (new sieve) for Q^(1/2) <= X <= Q; equals Prop 15.2 and the file's lower bound")
print("     Z5: loss in T_X is P^(e/2): old P^(1/6), new P^(1/12) = the cap for inequalities valid for all c; needed P^0. eta stays 0.")
OUT["z5"] = {"gram_e_old": "1/3", "gram_e_new": "1/6", "T_loss_new": "P^(1/12)", "cap": "P^(1/12)", "needed": "P^0"}

# ------------------------------------------------------------------ 4. Z14 quartic line
print("4. Row Z14, quartic line: Framework A (zf-quartic-gl2-exponents.py (B2)) with the n-th order shape on the Poisson dual")


def frameworkA_new(k, n, lo=F(0), hi=F(2)):
    # amplified exponent of |A_1|^2 as max of affine functions of lam (H = D^lam, H* = D^(2-lam), X = D)
    L = [(1 - F(1, k), F(1)),                 # diagonal D^(1+lam)
         (-F(1, k), F(2)),                    # H H* = D^2
         (-F(2, k), F(2)),                    # amplifier error
         # H * H*^(1-1/n) X^(2/n):  lam + (1-1/n)(2-lam) + 2/n = 2 + lam/n
         (F(1, n) - F(1, k), F(2)),
         # H * H*^(2/n) X^(1-1/n):  lam + (2/n)(2-lam) + 1 - 1/n
         (1 - F(2, n) - F(1, k), 1 + F(3, n))]
    E, lam = piecewise_min(L, lo, hi)
    return min(E / 2, F(1)), lam, E


for k in (4, 6, 3, 5):
    th, lam, E = frameworkA_new(k, k)
    check(th == 1 and E >= 2, "order %d: Framework A with the order-%d bound on the dual: exponent of |A_1|^2 is %s >= 2 at every lam; theta = 1 (trivial)" % (k, k, E))
check(all(F(1, n) - F(1, n) == 0 for n in (3, 4, 5, 6)),
      "identity: H * H*^(1-1/n) X^(2/n) / J = D^(2 + lam/n - lam/n) = D^2 for every lam and n (the new term is amplifier-neutral)")
check(new(1, 1, 4) / 2 == F(5, 8) and min(F(1), F(3, 8) + F(5, 8)) == 1,
      "balanced point: c = 5/8 is the value at which the file's formula 3/8 + c reaches 1")
OUT["z14_quartic_frameworkA_theta"] = "1 (trivial)"

# ------------------------------------------------------------------ 5. abscissa
print("5. Abscissa of the comparison system (Liu 2610.26835 v2 polynomial, as recorded in c10 item 3)")
pol = lambda B: 133488 * B ** 4 - 376596 * B ** 3 + 384534 * B ** 2 - 167541 * B + 26231
lo_, hi_ = F(5, 6), F(7, 8)
slo, shi = pol(lo_), pol(hi_)
print("     sign at 5/6: %s, at 7/8: %s" % ("+" if slo > 0 else "-", "+" if shi > 0 else "-"))
a_, b_ = lo_, hi_
roots = []
# scan for sign changes on a fine rational grid, then bisect
N = 4000
prev = a_
for i in range(1, N + 1):
    cur = a_ + (b_ - a_) * F(i, N)
    if pol(prev) * pol(cur) <= 0:
        l_, h_ = prev, cur
        for _ in range(60):
            m_ = (l_ + h_) / 2
            if pol(l_) * pol(m_) <= 0:
                h_ = m_
            else:
                l_ = m_
        roots.append(h_)
    prev = cur
print("     roots in [5/6, 7/8]:", ["%.10f" % float(r) for r in roots])
Bflat = [r for r in roots if abs(float(r) - 0.874886647) < 1e-6]
check(len(Bflat) == 1, "B_flat = %.10f is a root in [5/6, 7/8]" % (float(Bflat[0]) if Bflat else float("nan")))
check(F(5, 6) <= Bflat[0] <= F(7, 8), "figure inside the pre-registered interval [5/6, 7/8]")
check(not (Bflat[0] < F(874886647, 10 ** 9) - F(1, 10 ** 9)), "figure is not below 0.874886647: no changed part-B number")
OUT["abscissa"] = float(Bflat[0])
OUT["abscissa_changed"] = False

# ------------------------------------------------------------------ 6. Ji 2611.16665 replay
print("6. Ji 2611.16665: exponent replay of Propositions 2.1-2.3 (H = X^(65/144), Y = X^(1/288))")
h, y = F(65, 144), F(1, 288)
up = 2 + 5 * y - 2 * h - (y + h / 4)        # Prop 2.1 divided by the signal normalisation Y H^(1/4)
check(up == F(575, 576) and up < F(599, 600), "Prop 2.1 / (Y H^(1/4)) = X^(575/576) < X^(599/600)")
check(1 + (F(13, 25) - 1) * y == F(599, 600), "Prop 2.3 error X Y^(13/25) H^(1/4) / (Y H^(1/4)) = X^(599/600): this term sets the figure")
check(1 - h / 8 == F(1087, 1152) and 1 - h / 8 < F(599, 600), "Prop 2.3 error X Y H^(1/8) / (Y H^(1/4)) = X^(1087/1152)")


def E4(s):
    return one_minus_delta_sigma(4, s)


check(E4(F(599, 600)) == F(3, 302), "E(599/600) = 3/302 (n = 4 exponent of Cor 1.5)")
check(F(3, 302) + F(6, 25) - F(1, 4) == -F(1, 15100), "top group: E + 6/25 - 1/4 = -1/15100 < 0 (Q-sum converges)")


def Lam(s):
    return max(F(0), 1 - F(3, 2) * s)


worst = None
for i in range(0, 4001):
    s = F(5, 8) + (F(599, 600) - F(5, 8)) * F(i, 4000)
    v = s + h * (max(E4(s) - F(1, 4), 0) + Lam(s))
    if worst is None or v > worst[0]:
        worst = (v, s)
v58 = F(5, 8) + h * (F(3, 4) + Lam(F(5, 8)))
check(worst[0] <= F(599, 600) and v58 == F(2285, 2304), "Lemma 4.3 on 4001 rational points: max of sigma + (65/144) A(sigma) = %.6f at sigma = %.4f <= 599/600; sigma = 5/8, E = 1 gives 2285/2304"
      % (float(worst[0]), float(worst[1])))
OUT["ji_replay"] = {"upper": "575/576", "setting_term": "X Y^(13/25): 599/600", "lemma43_max": float(worst[0]), "lemma43_argmax": float(worst[1])}

print("   6b. general order r in the same format (MODEL: only the row density H^(1/r) and E_r are changed; Prop 2.1 for r = 6 is not available)")
for r in (4, 6):
    # density-side requirement alone: sigma + h (E_r(sigma) - 1/r)_+ <= theta for sigma in [5/8, theta]; top group E_r(theta) < 1/r
    # smallest theta with E_r(theta) <= 1/r:
    l_, h_ = F(1, 2), F(1)
    for _ in range(50):
        m_ = (l_ + h_) / 2
        if one_minus_delta_sigma(r, m_) <= F(1, r):
            h_ = m_
        else:
            l_ = m_
    print("     r = %d: E_r(sigma) <= 1/r iff sigma >= %.6f (zero-count below the row multiplicity H^(1/r))" % (r, float(h_)))
    OUT["ji_E_r_threshold_r%d" % r] = float(h_)


# ------------------------------------------------------------------ 7. Xu-Sang 2610.17675 v2 cross-checks
print("7. Xu-Sang 2610.17675 v2 (read in full text): Theorem 1.2 count R(sigma) = (31 - 32 sigma)/(21 - 12 sigma) and its table")
okx = True
for i in range(0, 171):
    d = F(1, 50) + (F(3, 4) - F(1, 50)) * F(i, 170)
    s = (1 + d) / 2
    for k in (F(13, 18), F(3, 4), F(1)):
        okx &= ((31 - 32 * s) / (21 - 12 * s) == count_R(d, F(0), k))
check(okx, "identity: Xu-Sang R(sigma) equals the system's count R(delta, x = 0, kappa) (kappa drops out at x = 0): not a new count")
tab = {F(2, 3): (F(5, 6), F(29, 39)), F(3, 4): (F(8, 11), F(7, 12)), F(5, 6): (F(4, 7), F(13, 33))}
check(all(one_minus_delta_sigma(6, s) == a and (31 - 32 * s) / (21 - 12 * s) == b and a > b for s, (a, b) in tab.items()),
      "their comparison table (sieve density 5/6, 8/11, 4/7 against 29/39, 7/12, 13/33) reproduced; Cor 1.5 is the larger exponent in each row")
check(F(13, 6) - F(7, 6) == 1, "direct sieve comparison for the prime second moment: Q^(7/6) x Q = Q^(13/6) (their kappa_6 = (37 - 10 sqrt 6)/6 = 2.08418 is below it)")


# ------------------------------------------------------------------ 8. manuscript Part I (the only place Lemma 9.1 is used)
print("8. 7/8 manuscript Prop 9.2 row envelope (9.16)/(9.24) and the Part I central estimate, old and new sieve")


def env(d, kind, steps=120):
    """max over o in [0,1], r in [1/2,1] of min(1 - o/2, e_o(r) - d r), exact on a rational grid containing all breakpoints used."""
    best = None
    for i in range(steps + 1):
        o = F(i, steps)
        for j in range(steps // 2, steps + 1):
            r = F(j, steps)
            if kind == "old":
                e = o / 2 + max(1 - o, r, F(2, 3) * (1 - o + r))
            else:
                e = o / 2 + max(1 - o, r, F(5, 6) * (1 - o) + r / 3, (1 - o) / 3 + F(5, 6) * r)
            v = min(1 - o / 2, e - d * r)
            if best is None or v > best:
                best = v
    return best


R_old = lambda d: min(F(1), max(1 - d / 2, F(4, 3) - d))
R_dir = lambda d: min(F(1), max(1 - d / 2, F(7, 6) - d))          # Theta_6 on sixth-power-free rows directly (o = 0)
tests = [F(1, 50), F(1, 6), F(1, 4), F(1, 3), F(5, 12), F(1, 2), F(7, 12), F(2, 3), F(3, 4), F(5, 6), F(1)]
check(all(env(d, "old") == R_old(d) for d in tests), "old sieve: grid max-min reproduces the manuscript's closed form min(1, max(1 - d/2, 4/3 - d)) at 11 classes")
vals = [(d, env(d, "new"), R_dir(d)) for d in tests]
print("     delta: new envelope with the split u = s w k kept / new envelope direct:",
      ", ".join("%s: %s / %s" % v for v in vals))
check(all(a >= b for _, a, b in vals) and all(env(d, "new") <= R_old(d) for d in tests), "direct <= split-kept <= old at all 11 classes")
check(all(env(d, "new") == R_old(d) == R_dir(d) for d in tests if d >= F(2, 3)), "for delta >= 2/3 all three envelopes equal 1 - delta/2")
EI = lambda R, d: -F(3, 4) + (d + R(d)) / 2                           # manuscript E_I(h) at d = h = 1/2
check(EI(R_old, F(5, 6)) == -F(1, 24) and EI(R_dir, F(5, 6)) == -F(1, 24),
      "Part I: E_I(h) at the bin ceiling delta = 5/6 is -1/24 with either envelope (the piece that sets the margin m_c is unchanged)")
check(max(EI(R_dir, F(i, 600)) for i in range(12, 501)) == -F(1, 24) and max(EI(R_old, F(i, 600)) for i in range(12, 501)) == -F(1, 24),
      "Part I: max over 1/50 <= delta <= 5/6 of E_I(h) is -1/24 with either envelope; 11/12 is set by the low side (5/6 + lx/6 at lx = 1/2)")

print("ALL CHECKS PASS" if OK else "SOME CHECK FAILED")
OUT["all_ok"] = OK
json.dump(OUT, open(__file__.replace("ledger.py", "ledger.json"), "w"), indent=1)
