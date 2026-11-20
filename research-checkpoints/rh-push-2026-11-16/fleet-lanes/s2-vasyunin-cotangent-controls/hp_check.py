# hp_check.py: 30-digit re-computation of d_N^2 (N=48) for zeta and DH, independent of the C code and of float64 linear algebra.
import mpmath as mp, math, numpy as np
mp.mp.dps = 30
N = 48
XI = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
def chol_d2(G, b):
    L = mp.cholesky(G); y = mp.lu_solve(L, b) if False else None
    y = mp.matrix(N, 1)
    for i in range(N):
        y[i] = (b[i]-sum(L[i, j]*y[j] for j in range(i)))/L[i, i]
    return [1-sum(y[j]**2 for j in range(n)) for n in range(1, N+1)]
# zeta (Vasyunin)
Cc = (mp.log(2*mp.pi)-mp.euler)/2
def V(a, q): return sum((mp.mpf((m*a) % q)/q)*mp.cot(mp.pi*m/q) for m in range(1, q))
def Iz(a, b): return Cc*(a+b)+mp.mpf(a-b)/2*mp.log(mp.mpf(b)/a)-mp.pi/2*(V(a, b)+V(b, a))
# DH (digamma jump formula)
c = [mp.mpf(1), XI, -XI, mp.mpf(-1), mp.mpf(0)]; q = 5
cc = lambda n: c[(n-1) % q]
Sc = [mp.mpf(0)]
for n in range(1, q): Sc.append(Sc[-1]+cc(n))
def T(x, y): return sum(cc(r)*Sc[((x*r)//y) % q]*mp.digamma(mp.mpf(r)/(q*y)) for r in range(1, q*y+1) if cc(r) != 0)
def Ip(a, b): return -(T(a, b)+T(b, a)-sum(cc(b*r)*cc(a*r)*mp.digamma(mp.mpf(r)/q) for r in range(1, q+1)))/q
L1 = -sum(c[r-1]*mp.digamma(mp.mpf(r)/q) for r in range(1, q+1))/q
for name, I, bv, path in [('zeta', Iz, lambda n: (mp.log(n)+1-mp.euler)/n, 'out/d2_zeta.npy'), ('DH', Ip, lambda n: L1/n, 'outl/d2_DH.npy')]:
    cache = {}
    G = mp.matrix(N, N)
    for m in range(1, N+1):
        for n in range(m, N+1):
            g = math.gcd(m, n); key = (m//g, n//g)
            if key not in cache: cache[key] = I(*key)
            G[m-1, n-1] = G[n-1, m-1] = cache[key]*g/(mp.mpf(m)*n)
    d2 = chol_d2(G, mp.matrix([bv(n) for n in range(1, N+1)]))
    ref = np.load(path)[:N]
    print(name, 'd2_48 (30 digits) =', mp.nstr(d2[-1], 18), ' float64 pipeline =', repr(float(ref[-1])), ' max |diff| over n<=48 =', max(abs(float(d2[i])-float(ref[i])) for i in range(N)))
