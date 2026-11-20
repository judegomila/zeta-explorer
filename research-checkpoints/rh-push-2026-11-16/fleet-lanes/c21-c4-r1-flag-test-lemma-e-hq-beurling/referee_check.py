# Second derivation, different method: log coefficients by the series log(1+X) = sum (-1)^(k+1) X^k / k
# with Dirichlet-convolution powers, in exact rational arithmetic (Fractions) where coefficients are rational,
# and mpmath (30 digits) evaluation of H(s) = F F*/zeta^2 from closed forms at complex points against exp(-2A).
# Planned memory: < 20 MB.
from fractions import Fraction as Fr
from math import log2
from mpmath import mp, mpf, mpc, zeta, exp, log, nstr, sqrt
mp.dps = 30
N = 1296
def conv(f, g):
    h = [Fr(0)]*(N+1)
    for d in range(1, N+1):
        if g[d]:
            for m in range(1, N//d+1):
                if f[m]: h[d*m] += g[d]*f[m]
    return h
def dlog_series(f):
    X = f[:]; X[1] = Fr(0)
    out = [Fr(0)]*(N+1); P = X[:]; k = 1
    while any(P):
        for n in range(N+1): out[n] += Fr((-1)**(k+1), k)*P[n]
        P = conv(P, X); k += 1          # X supported on n>=2, so X^k supported on n >= 2^k: terminates
    return out
def ppk(n):
    for p in range(2, n+1):
        if n % p == 0:
            k = 0
            while n % p == 0: n //= p; k += 1
            return k if n == 1 else 0
kap = [Fr(0)]*(N+1)
for n in range(2, N+1):
    k = ppk(n)
    if k: kap[n] = Fr(1, k)
def v(g, n):
    k = 0
    while n % g == 0: n //= g; k += 1
    return k
def test(name, f, expect):
    ell = dlog_series(f)
    a = [kap[n]-ell[n] for n in range(N+1)]
    neg = [n for n in range(2, N+1) if a[n] < 0]
    nz = {n: str(a[n]) for n in range(2, N+1) if a[n] != 0 and len(str(a[n])) < 12}
    print(name, "| exact: negatives", neg[:6], "| nonzero a_n (first 8):", list(nz.items())[:8], "| passes:", not neg, "| expected:", expect)
    return a
# V6: f(n) = (-1)^{v_6(n)}; claim A = 2 sum_{k odd} 6^{-ks}/k
f = [Fr(0)]+[Fr((-1)**v(6, n)) for n in range(1, N+1)]
a = test("V6 f=(-1)^v6", f, True)
assert all(a[n] == (Fr(2, int(round(log2(n)/log2(6)))) if (v(6, n) % 2 == 1 and 6**v(6, n) == n) else 0) for n in range(2, N+1)), "V6 closed form"
print("   V6 closed form a_{6^k} = 2/k (k odd), else 0: exact on n <=", N)
S = 0; worst = Fr(0)
for n in range(1, N+1):
    S += f[n]; worst = max(worst, abs(S-Fr(5*n, 7)))
print("   V6 partial sums: max |S(n) - 5n/7| on n <=", N, "=", float(worst), " (f(6)-f(2)f(3) =", f[6]-f[2]*f[3], ")")
# V30
f = [Fr(0)]+[Fr((-1)**v(30, n)) for n in range(1, N+1)]
test("V30 f=(-1)^v30", f, True)
# Liouville
def Om(n):
    k = 0; p = 2
    while n > 1:
        while n % p == 0: n //= p; k += 1
        p += 1
    return k
test("Liouville", [Fr(0)]+[Fr((-1)**Om(n)) for n in range(1, N+1)], True)
# f = 1 except f(6) = -1 (zeta - 2*6^-s): unimodular, non-multiplicative, expected to FAIL at 12
f = [Fr(0)]+[Fr(1)]*N; f[6] = Fr(-1)
test("zeta-2*6^-s", f, False)
# 2*zeta-type: non-multiplicative with rational DH-like periodic coefficients mod 5: (1, 1/4, -1/4, -1, 0)
per = [Fr(0), Fr(1), Fr(1, 4), Fr(-1, 4), Fr(-1)]
f = [Fr(0)]+[per[n % 5] for n in range(1, N+1)]
a = test("DH-shape rational xi=1/4", f, False)
print("   a_6 =", a[6], " = -(f(6)-f(2)f(3)) =", -(f[6]-f[2]*f[3]))
# HQ2 with q=4?  not prime; use the rational member zeta(s)(1 + eps v^2/(1-v)^4), v = 4^(1/2-s) = 2*4^-s -> coefficients rational
# DEL-type: delete p = 3
test("delete p=3", [Fr(0)]+[Fr(0 if n % 3 == 0 else 1) for n in range(1, N+1)], True)
# sigma-type: zeta(s)^2 (degree 2): expected FAIL at every prime
def d(n): return sum(1 for k in range(1, n+1) if n % k == 0)
test("zeta^2 (divisor function)", [Fr(0)]+[Fr(d(n)) for n in range(1, N+1)], False)

# closed-form evaluation of H at complex points against exp(-2A)
print("--- closed forms, 30 digits ---")
for s in (mpc(1.5, 3.7), mpc(0.6, 14.2), mpc(2, 0)):
    # V6
    H = ((1-mpf(6)**(-s))/(1+mpf(6)**(-s)))**2
    A = 2*sum(mpf(6)**(-k*s)/k for k in range(1, 400, 2))
    print("V6   s=%s  |H-exp(-2A)|/|H| = %s" % (nstr(s, 4), nstr(abs(H-exp(-2*A))/abs(H), 5)))
    # P1: b=0.7, A = sum 6^{k(b-s)}/k  (needs Re s > b)
    b = mpf('0.7'); H = (1-mpf(6)**(b-s))**2
    if s.real > 0.75:
        A = sum(mpf(6)**(k*(b-s))/k for k in range(1, 3000))
        print("P1   s=%s  |H-exp(-2A)|/|H| = %s" % (nstr(s, 4), nstr(abs(H-exp(-2*A))/abs(H), 5)))
    # T-NR q=2, c=-2.5: 1+cu+u^2 = (1-2u)(1-u/2); A = sum (2^k+2^-k) u^k / k, converges for |u| < 1/2 i.e. Re s > 3/2
    u = mpf(2)**(mpf(1)/2-s)
    if abs(u) < 0.45:
        H = (1-mpf('2.5')*u+u*u)**2
        A = sum((mpf(2)**k+mpf(2)**(-k))*u**k/k for k in range(1, 3000))
        print("TNR- s=%s  |H-exp(-2A)|/|H| = %s" % (nstr(s, 4), nstr(abs(H-exp(-2*A))/abs(H), 5)))
print("T-NR c=-2.5, q=2: factor zeros u=1/2 -> s = 3/2 + 2 pi i k/log 2 ; u=2 -> s = -1/2 + ... ; value at s=3/2:", nstr(1-mpf('2.5')*mpf(2)**(-1)+mpf(2)**(-2), 5))
print("T-NR c=+2.5, q=2: factor zeros u=-1/2 -> s = 3/2 + (2k+1) pi i/log 2 (no real zero); value at 3/2 + i pi/log 2:",
      nstr(abs(1+mpf('2.5')*mpf(2)**(mpf(1)/2-mpc(1.5, mp.pi/log(2)))+mpf(2)**(1-2*mpc(1.5, mp.pi/log(2)))), 5))
# P3: zero and non-vanishing right of it
b = mpf('0.1')
from mpmath import findroot
w0 = findroot(lambda w: zeta(w)-2, mpf('1.7'))
print("P3: F(sigma*) factor value:", nstr(2-zeta(w0), 5), " sigma* =", nstr(w0-(1-b), 20), "; zeta(sigma*) =", nstr(zeta(w0-(1-b)), 12),
      "; for Re w > w0: |zeta(w)-1| <= zeta(Re w)-1 < 1 so 2-zeta(w) != 0")
