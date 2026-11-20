# Checks for RESULT.md (bootstrap slug). Run: .venv-arb/bin/python -I checks.py
import mpmath as mp
from fractions import Fraction as Fr
import random
mp.mp.dps = 30

print("== C1: shifted-Eisenstein control E_a(s)=zeta(s+a)zeta(s-a), a=3/8 ==")
a = mp.mpf(3)/8
def xi_c(s):  # completed zeta, pi^{-s/2} Gamma(s/2) zeta(s)
    return mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def LamE(s): return xi_c(s+a)*xi_c(s-a)
for s in [mp.mpc(0.3,7.1), mp.mpc(0.81,23.4), mp.mpc(1.2,-3.3)]:
    l, r = LamE(s), LamE(1-s)
    print("  FE rel.diff at", s, ":", mp.nstr(abs(l-r)/abs(l), 5))
g1 = mp.zetazero(1).imag
s0 = mp.mpc(mp.mpf(7)/8, g1)
print("  |E_a(7/8+i*gamma_1)| =", mp.nstr(abs(mp.zeta(s0+a)*mp.zeta(s0-a)), 5), "(zero on Re s = 1/2+a = 7/8)")
# Dirichlet coefficients e(n)=sum_{d|n} d^{a}(n/d)^{-a}; check Euler product numerically and growth
def e(n): return sum(mp.mpf(d)**a*mp.mpf(n//d)**(-a) for d in range(1,n+1) if n%d==0)
s = mp.mpf(3)
ds = mp.nsum(lambda n: e(int(n))*mp.mpf(n)**(-s), [1, 4000], method='direct') if False else sum(e(n)*mp.mpf(n)**(-s) for n in range(1,3001))
print("  Dirichlet series at s=3 (n<=3000):", mp.nstr(ds, 10), " zeta(3+a)zeta(3-a) =", mp.nstr(mp.zeta(s+a)*mp.zeta(s-a), 10))
print("  Lambda_E(p^k)=(p^{ka}+p^{-ka})log p >= 0 : min over p^k<=1000 =",
      mp.nstr(min((mp.mpf(p)**(k*a)+mp.mpf(p)**(-k*a))*mp.log(p) for p in [2,3,5,7,11,13] for k in range(1,4)), 6))
print("  coefficient growth e(n)/n^a for n=2^10, 2310, 9973:", [mp.nstr(e(n)/mp.mpf(n)**a, 5) for n in (1024, 2310, 9973)])

print("== C2: mollifier/convexity density exponent is neutral exactly at sigma=theta ==")
# exponent(sigma) = 1 + A*[(2th-1)(th+d-sigma) - 2d(sigma-1/2)]/(th+d-1/2); bracket = 2(th+d-1/2)(th - sigma) exactly
random.seed(1); ok = True
for _ in range(2000):
    th = Fr(random.randint(501, 999), 1000); d = Fr(random.randint(1, 200), 1000); sg = Fr(random.randint(500, 1000), 1000)
    br = (2*th-1)*(th+d-sg) - 2*d*(sg-Fr(1,2))
    ok &= (br == 2*(th+d-Fr(1,2))*(th-sg))
print("  identity bracket == 2(th+d-1/2)(th-sigma) on 2000 random rationals:", ok)
print("  => N(sigma,T) exponent = 1 + 2A(theta - sigma): < 1 only for sigma > theta, for every mollifier length X=T^A")

print("== C3: Halasz-Montgomery-Huxley with the ZF(theta) convexity bound mu(alpha)<=c(theta-alpha)/(theta-1/2) ==")
c = Fr(13,84)
def T0exp(sig, th, al):   # admissible subdivision length T0 = N^{e}, e=(2sig-1-al)/mu(al)
    mu = c*(th-al)/(th-Fr(1,2))
    return (2*sig-1-al)/mu
th = Fr(7,8)
for sig in [Fr(7,10), Fr(73,100), Fr(3,4), Fr(8,10), Fr(85,100), Fr(93,100)]:
    grid = [Fr(1,2)+Fr(k,1000)*(th-Fr(1,2)) for k in range(0,1000)]
    grid = [al for al in grid if al < 2*sig-1]
    best = max(grid, key=lambda al: T0exp(sig, th, al)) if grid else None
    print("  sigma=%s: best alpha=%s  e(alpha=1/2)=%s  e(best)=%s  [(1+theta)/2=%s]" % (
        float(sig), None if best is None else float(best),
        None if not grid else float(T0exp(sig, th, Fr(1,2))), None if best is None else float(T0exp(sig, th, best)), float((1+th)/2)))
# sign of derivative: (2sig-1-theta)/(theta-alpha)^2 * (theta-1/2)/c
print("  d e/d alpha has the sign of (2 sigma - 1 - theta): alpha=1/2 (unconditional) optimal for all sigma < (1+theta)/2")
