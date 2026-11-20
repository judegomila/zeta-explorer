"""Second-referee check of Lemma H (push/c6-marks-bc-manuscript-check), independent code path.
Source: manuscript table (7.16) (paper.txt lines 3286-3297), rows with j = 0, rho = 1, NOT the closed form (7.11).
P*_p is summed row by row as truncated double series in (r, m) with exact rationals, then compared with the lane's
closed form at w = 1, z = 1/6 up to the exact truncation remainder. Planned memory: < 50 MB (scalars only)."""
from fractions import Fraction as F
import random, cmath
random.seed(2026)
def rnd(lo=3, hi=9): return F(random.randint(1, lo), random.randint(hi, 3*hi)) * random.choice((1, -1))
N = 40
worst = F(0)
for trial in range(60):
    q = abs(rnd()); D = rnd(); R = rnd()
    Q = 1/q; V = q; W = q            # w = 1, z = 1/6, rho = 1
    Ps = F(0)
    for r in range(N):
        Rr = R**r
        # (0,2r+2), k=0, m >= r+1 : R(1-1/Q) V^(m-r-1)
        Ps += Rr*sum(R*(1-q)*V**i for i in range(N))
        # (0,2r+2), k=1, j=0, m=r+1 : Wloc R
        Ps += Rr*W*R
        # (1,2r), k=0, j=0, m=r : -eta rho^-1 Q^-x = -D
        Ps += Rr*(-D)
        # (1,2r), k=1, m >= r+1 (j=0 <= 1): -eta (Q-1) Q^(-x-w) V^(m-r) = -D (Q-1) W V^i, i >= 1
        Ps += Rr*sum(-D*(Q-1)*W*V**i for i in range(1, N+1))
        # rows with j = 1..5 do not occur for u = 1
    # t = 0 part: k = 0, m >= 0 -> 1/(1-V); k > 0 -> W/(1-W)
    P = sum(V**i for i in range(N)) + sum(W**i for i in range(1, N+1)) + Ps
    H = P*(1-V)*(1-W)/(1-D)                                   # (7.12)
    closed = (1-q*q)*(1 - D*(1-q) - R*q)/((1-R)*(1-D))        # Lemma H
    worst = max(worst, abs(H-closed))
print("table (7.16) row sum vs Lemma H closed form, 60 random rational points, truncation N = %d:" % N)
print("   max abs difference = %.3e (truncation remainder is O(max(|q|,|R|)^N) <= (1/3)^40 ~ 8e-20)" % float(worst))
# factorisations
ok = True
for _ in range(500):
    q, D, R = rnd(), rnd(), rnd()
    num = 1 - D*(1-q) - R*q
    ok &= (num/(1-D) == 1 - q*(R-D)/(1-D))
    ok &= (num/((1-R)*(1-D)) == (1-R*q)/(1-R) * (1 + D*q*(1-R)/((1-D)*(1-R*q))))
print("E-form and E'-form factorisations exact:", ok)
# local non-vanishing on Re s >= 1/2: grid over phases, |D| = Q^-sig, |R| = Q^(3-6 sig), sig in [1/2, 1]
mn = 9.0
for Qn in (4, 7, 13, 16, 19, 25):
    for k in range(11):
        sig = 0.5 + 0.05*k
        for a in range(48):
            for b in range(48):
                Dc = Qn**(-sig)*cmath.exp(2j*cmath.pi*a/48); Rc = Qn**(3-6*sig)*cmath.exp(2j*cmath.pi*b/48)
                mn = min(mn, abs(1 - Dc*(1-1/Qn) - Rc/Qn))
print("min |1 - D(1-q) - Rq| on grid (Q in {4,...,25}, 1/2 <= sig <= 1, all phases): %.4f  (analytic bound 1 - 0.625 = 0.375 at Q = 4)" % mn)
# exponents
print("E-form terms: qR ~ Q^(2-6 sig): abs. conv. iff sig > 1/2;  qD ~ Q^(-1-sig)")
print("E'-form terms: Dq ~ Q^(-1-sig), DqR ~ Q^(2-7 sig): abs. conv. iff sig > 3/7")
print("zeros: s = (3 + rho')/6, 0 < Re rho' < 1  ->  1/2 < Re s < 2/3; Re rho' >= 1/2 -> Re s >= 7/12")
