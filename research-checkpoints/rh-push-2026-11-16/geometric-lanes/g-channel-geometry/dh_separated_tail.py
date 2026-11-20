# DH control for the PR 44 separated-tail theorem.
# kappa_f(u) = e^{3u/4} sum_n n a_n exp(-pi n^2 e^u/5)  (Xi_DH(z) = int kappa_f(u) e^{zu/2} du up to a constant)
import mpmath as mp, random
mp.mp.dps = 25
kap = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
A = [0, 1, kap, -kap, -1]  # a_n by n mod 5
def a(n): return A[n % 5]
lam = mp.pi/5
def kappa(u):
    q = mp.e**u; s = mp.mpf(0); n = 1
    while True:
        term = n*a(n)*mp.exp(-lam*n*n*q)
        s += term
        if n > 5 and mp.exp(-lam*n*n*q) < mp.mpf(10)**(-60): break
        n += 1
    return mp.e**(3*u/4)*s
# 1. evenness check (functional equation)
print("evenness check kappa(u)/kappa(-u):")
for u in [0.3, 1.0, 2.0]:
    print("  u=%.1f ratio=%s" % (u, mp.nstr(kappa(u)/kappa(-u), 20)))
# 2. L(t) = kappa(t) / (e^{3t/4 - lam e^t}), deviation from 1
def L(t):
    q = mp.e**t; s = mp.mpf(1); n = 2
    while n < 8:
        s += n*a(n)*mp.exp(-lam*(n*n-1)*q); n += 1
    return s
for R in [1, 2, 4]:
    print("  R=%d  L(R)-1=%s  bound 0.012*exp(-(3pi/5)(e^R-e))=%s" % (R, mp.nstr(L(R)-1, 6), mp.nstr(0.012*mp.exp(-(3*mp.pi/5)*(mp.e**R-mp.e)), 6)))
# 3. normalized kernel C(U,V) via J formula with p = 2a-1 = 1/2
def J(U, V):
    Lam = lam*(mp.e**U+mp.e**V)
    f = lambda q: mp.exp(-q)*(1+q/Lam)**mp.mpf('0.5')*(1+2*mp.log1p(q/Lam)/(U+V))*L(U+mp.log1p(q/Lam))*L(V+mp.log1p(q/Lam))/(L(U)*L(V))
    return mp.quad(f, [0, 10, 60])
def C(U, V):
    return (U+V)/(2*mp.sqrt(U*V))/mp.cosh((U-V)/2)*J(U, V)/mp.sqrt(J(U, U)*J(V, V))
random.seed(1)
for (R, d, N) in [(8, 8, 8), (20, 4, 8), (100, 2, 8), (2, 1, 10), (1, 0.5, 10)]:
    worst = None
    for trial in range(2):
        U = [mp.mpf(R)]
        for k in range(N-1): U.append(U[-1]+d*(1+ (random.random() if trial else 0)))
        M = mp.matrix(N, N)
        S = mp.matrix(N, N)
        for i in range(N):
            for j in range(i, N):
                M[i, j] = M[j, i] = C(U[i], U[j]) if i != j else 1
                S[i, j] = S[j, i] = 1/mp.cosh((U[i]-U[j])/2)
        ev = mp.eigsy(M, eigvals_only=True); es = mp.eigsy(S, eigvals_only=True)
        lo = min(ev); worst = lo if worst is None else min(worst, lo)
        errn = mp.norm(M-S, 2) if False else max(sum(abs(M[i,j]-S[i,j]) for j in range(N)) for i in range(N))
    ell = (4-mp.pi**2/3)/d/mp.cosh(4*mp.pi/d)
    print("R=%s delta=%s N=%d  min eig normalized DH kernel=%s  (sech Gram min eig %s, last row-sum dev %s, PR44 ell_delta=%s)" % (R, d, N, mp.nstr(worst, 8), mp.nstr(min(es), 8), mp.nstr(errn, 3), mp.nstr(ell, 3)))
