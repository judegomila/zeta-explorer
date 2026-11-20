# DH control for the detector: the twisted-copy family inverts only completely multiplicative targets.
# a(n): Davenport-Heilbronn coefficients (period 5): 1, xi, -xi, -1, 0.
# (i) Moebius twist  sum mu(n) a(n) w  = linear combination of 1/L(s,chi), 1/L(s,chibar)  (what a linear detector returns)
# (ii) Dirichlet inverse b = a^{-1}: sum b(n) n^{-s} = 1/f(s)  (what trapping the zeros of f needs)
import numpy as np, math
N = 4_000_000
xi = (math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
per = np.array([0.0, 1.0, xi, -xi, -1.0])
n = np.arange(N+1)
a = per[n % 5]
# Moebius
mu = np.ones(N+1, np.int8); mu[0] = 0
isp = np.ones(N+1, bool); isp[:2] = False
for p in range(2, N+1):
    if isp[p]:
        isp[2*p::p] = False
        mu[p::p] *= -1
        if p*p <= N: mu[p*p::p*p] = 0
# Dirichlet inverse
b = np.zeros(N+1); b[1] = 1.0
for d in range(1, N//2+1):
    bd = b[d]
    if bd != 0.0:
        m = np.arange(2*d, N+1, d)
        b[m] -= bd*a[m//d]
# complete multiplicativity defect
print("a(4) - a(2)^2 =", per[4]-per[2]**2, "  a(6) - a(2)a(3) =", per[1]-per[2]*per[3])
print("max |b - mu*a| over n <= 100:", np.max(np.abs(b[:101]-mu[:101]*a[:101])))
S_mu = np.cumsum(mu*a); S_inv = np.cumsum(b)
print("   N        max|S_mu|/sqrt(N)   max|S_inv|/N    max|S_inv|/sqrt N")
prev = None
for X in [10**3, 10**4, 10**5, 10**6, 2*10**6, 4*10**6]:
    m1 = np.max(np.abs(S_mu[X//2:X+1])); m2 = np.max(np.abs(S_inv[X//2:X+1]))
    print(f"{X:9d}  {m1/math.sqrt(X):12.4f}  {m2/X:14.5f}  {m2/math.sqrt(X):14.3f}")
def slope(S, lo, hi):
    xs, ys = [], []
    X = lo
    while X <= hi:
        xs.append(math.log(X)); ys.append(math.log(np.max(np.abs(S[X//2:X+1])))); X *= 2
    return np.polyfit(xs, ys, 1)[0]
print("growth exponent of dyadic max, 2^10..N:  Moebius twist %.3f   Dirichlet inverse %.3f" % (slope(S_mu, 1024, N), slope(S_inv, 1024, N)))
print("sum |b(n)| n^-1.2 partial:", np.sum(np.abs(b[1:])/n[1:]**1.2), "  sum |b(n)|/n partial:", np.sum(np.abs(b[1:])/n[1:]))
