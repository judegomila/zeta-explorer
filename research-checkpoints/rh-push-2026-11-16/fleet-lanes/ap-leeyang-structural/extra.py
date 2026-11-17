# (b) Mellin zeros of a PF_infinity density (three-exponential control);
# (c) exact threshold for complete-graph Ising ferromagnets, compared with the bound of Prop. 1;
# (a) off-line zeros of g_2.
# Memory: scalars only. Newton iterations are confined to a box (bail out when they leave it).
from mpmath import mp, mpf, mpc, pi, loggamma, exp, log, polyroots, diff
from math import comb
mp.dps = 20
def newton(f, df, z, box, steps=40, tol=mpf(10)**(-15)):
    x0, x1, t0, t1 = box
    for _ in range(steps):
        fz = f(z)
        if abs(fz) < tol: return z
        d = df(z)
        if d == 0: return None
        z = z - fz/d
        if not (x0 <= z.real <= x1 and t0 <= z.imag <= t1): return None
    return z if abs(f(z)) < 1e-10 else None

print("(b) density 3 e^{-y}(1-e^{-y})^2 of e1 + e2/2 + e3/3 (Laplace transform 1/((1+L)(1+L/2)(1+L/3)), so PF_infinity);")
print("    Mellin transform = 3 Gamma(s) (1 - 2^{1-s} + 3^{-s}); zeros of D(s) = 1 - 2^{1-s} + 3^{-s}:")
l2, l3 = log(2), log(3)
D = lambda s: 1 - 2*exp(-s*l2) + exp(-s*l3)
dD = lambda s: 2*l2*exp(-s*l2) - l3*exp(-s*l3)
zs = []
for k in range(1, 160):
    for x0 in [-0.5, 0.0, 0.5, 1.0]:
        r = newton(D, dD, mpc(x0, 0.5*k), (-3, 3, 0.5, 80))
        if r is not None and all(abs(r - q) > 1e-6 for q in zs): zs.append(r)
zs.sort(key=lambda q: q.imag)
res = [q.real for q in zs]
print("    zeros found with 0.5 < t < 80:", len(zs), " min Re =", mp.nstr(min(res), 10), " max Re =", mp.nstr(max(res), 10))
for q in zs[:6]: print("     ", mp.nstr(q, 12))

print("(c) complete-graph Ising ferromagnet, S = sum of N spins, weight exp(J sum_{i<j} x_i x_j - b S^2) = const * exp((J/2 - b) S^2):")
def allreal(N, c):
    # polynomial in w = e^{2iz}: sum_k comb(N,k) exp(c (N-2k)^2) w^k ; real zeros in z <=> all roots on |w| = 1
    co = [comb(N, k)*exp(c*(N-2*k)**2) for k in range(N+1)]
    rts = polyroots(co[::-1], maxsteps=200, extraprec=80)
    return max(abs(abs(r) - 1) for r in rts)
for N in [2, 3, 4, 6, 8]:
    row = []
    for c in [mpf('0.2'), mpf('0.02'), mpf('0.002'), mpf('-0.002'), mpf('-0.02'), mpf('-0.2')]:
        row.append("c=%s: %s" % (mp.nstr(c, 3), mp.nstr(allreal(N, c), 3)))
    print("    N=%d  max | |w|-1 | over roots, c = J/2 - b:  %s" % (N, ";  ".join(row)))

def gN(s, N, shift):
    a = exp(-(s/2)*log(pi) + loggamma(s/2) - shift)*sum(mpf(n)**(-s) for n in range(1, N+1))
    r = 1 - s
    b = exp(-(r/2)*log(pi) + loggamma(r/2) - shift)*sum(mpf(n)**(-r) for n in range(1, N+1))
    return a + b
for N in [2, 3]:
    print("(a) off-line zeros of g_%d with 1 < t < 200, 1/2 < Re s < 4.5" % N)
    found = []
    for k in range(2, 400):
        t0 = 0.5*k
        shift = (loggamma(mpc(0.25, t0/2))).real
        f = lambda s: gN(s, N, shift)
        df = lambda s: (f(s + mpf(10)**(-8)) - f(s - mpf(10)**(-8)))/(2*mpf(10)**(-8))
        for x0 in [0.7, 1.2, 2.0, 3.0]:
            r = newton(f, df, mpc(x0, t0), (0.5, 4.5, max(1, t0-3), min(200, t0+3)), steps=25, tol=mpf(10)**(-13))
            if r is not None and r.real > 0.5 + 1e-5 and all(abs(r - q) > 1e-5 for q in found):
                found.append(r)
    for q in sorted(found, key=lambda q: q.imag): print("    ", mp.nstr(q, 12))
    print("     count:", len(found))
