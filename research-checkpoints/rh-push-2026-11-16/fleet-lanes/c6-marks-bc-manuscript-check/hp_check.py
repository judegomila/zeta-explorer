"""Local factor H_p of manuscript Lemma 7.1, principal row u = 1 (j = 0, rho = 1), at (w, z) = (1, 1/6).
q = 1/Q, D = eta(p) Q^-x, R = a_p^2 Q^(4-6x-6z) (= a_p^2 Q^(3-6x) at z = 1/6), V = Q^-6z, W = Q^-w.
Exact rational arithmetic at random rational points (stdlib only). Each identity is between rational functions of
degree <= 4 in each of q, D, R; agreement at 400 random points with independent coordinates proves it."""
from fractions import Fraction as F
import random
random.seed(11)
def rnd(): return F(random.randint(-97, 97), random.randint(101, 199))
def P_711(q, D, R, V, W):
    Q = 1/q                                  # eta(p)(Q-1)Q^(-x-w) = D (Q-1) W ; J_0 = -D + W R
    Pstar = (1/(1-R))*((R*(1-q) - D*(Q-1)*W*V)/(1-V) + (-D + W*R))
    return 1/(1-V) + W/(1-W) + Pstar, Pstar
ok1 = ok2 = ok3 = True
for _ in range(400):
    q, D, R = rnd(), rnd(), rnd()
    if q == 0: continue
    P, Ps = P_711(q, D, R, q, q)
    H = P*(1-q)*(1-q)/(1-D)                                   # (7.12)
    closed = (1-q*q)*(1 - D*(1-q) - R*q)/((1-R)*(1-D))
    ok1 &= (H == closed)
    V, W = rnd(), rnd()                                       # (7.17) at general V, W
    P, Ps = P_711(q, D, R, V, W)
    E = Ps + D
    ok2 &= (P*(1-V)*(1-W)/(1-D) == 1 + (D*(V+W-V*W) - V*W + (1-V)*(1-W)*E)/(1-D))
    ok3 &= ((1 - D*(1-q) - R*q) == (1-D)*(1-R*q) + D*q*(1-R))
print("H_p(u=1; w=1, z=1/6) == (1-q^2)(1 - D(1-q) - Rq)/((1-R)(1-D)) :", ok1)
print("(7.17) agrees with (7.11),(7.12) at j = 0                      :", ok2)
print("1 - D(1-q) - Rq == (1-D)(1-Rq) + Dq(1-R)                      :", ok3)
print("local nonvanishing on Re s >= 1/2:  |D|(1-q) + |R| q <= Q^-1/2 (1 - 1/Q) + 1/Q")
for Qn in (4, 7, 13, 19): print("   Q =", Qn, " bound =", round(Qn**-0.5*(1-1/Qn) + 1/Qn, 4))
print("second factor: |Dq(1-R)/((1-D)(1-Rq))| at Re s = 3/7+: Q^(-1-s), Q^(2-7s): convergent for Re s > 3/7")
# --- principal slot multiplier (16.1) at u = 1, (w, z) = (1, 1/6), slot prime in the identity ray class (eta(p) = 1):
# B_p = Q^x P*/P - Q^-w = (1/D) P*/P - q.   Claim: B_p = [ (R/D - 1)(1-q) - q(1 - D(1-q) - Rq) ] / (1 - D(1-q) - Rq),
# and R/D = a_p^2 Q^(3-5x).
ok4 = True
for _ in range(400):
    q, D, R = rnd(), rnd(), rnd()
    if q == 0 or D == 0: continue
    P, Ps = P_711(q, D, R, q, q)
    B = (1/D)*Ps/P - q
    den = 1 - D*(1-q) - R*q
    ok4 &= (B == ((R/D - 1)*(1-q) - q*den)/den)
print("B_p(u=1; 1, 1/6; eta(p)=1) == [(R/D - 1)(1-q) - q(1 - D(1-q) - Rq)]/(1 - D(1-q) - Rq):", ok4)
print("   leading terms: B_p = -1 + R/D + O(q, D), R/D = a_p^2 Q^(3-5x): not small for Re x <= 3/5")
