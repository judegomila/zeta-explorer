# Check: L(x_j) - eps/2 = m_inf*x_j + sum_k m_k*2x_j/(x_j^2+tau_k^2), m>0 (degenerate Nevanlinna-Pick interpolant)
import mpmath as mp, sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import extremal as E
which, a, b, N = sys.argv[1], mp.mpf(sys.argv[2]), mp.mpf(sys.argv[3]), int(sys.argv[4])
mp.mp.dps = 60 + 10*N
L = {"zeta":E.L_zeta, "dh":E.L_dh, "rand":E.L_rand}[which]
xs = E.cheb(N,a,b)
eps, gap, s, chk, roots, emax = E.run(L, xs)
taus = sorted([mp.im(r) for r in roots if mp.im(r) > 0])
K = len(taus)
A = mp.matrix(K+1, K+1); rhs = mp.matrix(K+1,1)
for j in range(K+1):          # use first K+1 nodes to solve, remaining nodes to test
    A[j,0] = xs[j]
    for k in range(K): A[j,k+1] = 2*xs[j]/(xs[j]**2 + taus[k]**2)
    rhs[j] = L(xs[j]) - eps/2
m = mp.lu_solve(A, rhs)
res = max(abs(L(x) - eps/2 - (m[0]*x + sum(m[k+1]*2*x/(x*x+taus[k]**2) for k in range(K)))) for x in xs)
print(which, "N", N, "pairs", K, "unknowns", K+1, "max residual over all N nodes", mp.nstr(res,3))
print("  m_inf", mp.nstr(m[0],8), " masses", [mp.nstr(m[k+1],8) for k in range(K)])
