# Independent zero-side check of the Ritz minimizer: sum over the first K zeros of |fhat(gamma)|^2 vs prime-side lam1.
import sys, mpmath as mp
from flint import ctx
from screw import run
T = float(sys.argv[1]); N = int(sys.argv[2]); K = int(sys.argv[3])
r = run('zeta', T, N)
mp.mp.dps = 50
A = mp.matrix(N, N)
for i in range(N):
    for j in range(N):
        A[i, j] = mp.mpf(r['Q'][i, j].mid().str(60, radius=False))
E, V = mp.eigsy(A)
lam = E[0]; v = V[:, 0]
print('prime-side lam1 =', mp.nstr(lam, 8))
# f(x) = T^{-1/2} sum_n v_n sqrt(2n+1) P_n(2x/T-1); fhat(g) = int_0^T f e^{-igx}dx = sqrt(T) e^{-igT/2} sum v_n sqrt(2n+1) (-i)^n j_n(gT/2)
def fhat2(g):
    z = g*T/2
    s = mp.mpc(0)
    for n in range(N):
        jn = mp.sqrt(mp.pi/(2*z))*mp.besselj(n+mp.mpf(1)/2, z)
        s += v[n]*mp.sqrt(2*n+1)*(-1j)**n*jn
    return T*abs(s)**2
S = mp.mpf(0)
for k in range(1, K+1):
    g = mp.zetazero(k).imag
    t = 2*fhat2(g); S += t
    if k in (1, 2, 3, 5, 10, 20, 50, 100, 200, 400, K): print(k, mp.nstr(g, 8), 'term', mp.nstr(t, 5), 'partial', mp.nstr(S, 8), flush=True)
