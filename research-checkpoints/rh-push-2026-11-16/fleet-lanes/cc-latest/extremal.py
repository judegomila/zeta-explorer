# One-sided analogue of Connes-van Suijlekom / CCM Thm 5.10 on the exponential cone.
# P_ij=(l_i+l_j)/(x_i+x_j), S_ij=1/(x_i+x_j) (Gram of e^{-x t} in L^2(0,inf)).
# eps = min generalized eigenvalue of (P,S); c eigenvector; V(z)=sum c_j/(z+x_j).
# Claim: zeros of V lie on iR (if eps simple, sum c != 0), eps = 2<l,c>/<1,c>.
import mpmath as mp, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "euler"))
def L_zeta(x):
    s = mp.mpf(1)/2 + x
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s,1,1)/mp.zeta(s)
def L_dh(x):
    from dh import f
    s = mp.mpf(1)/2 + x
    return mp.log(5/mp.pi)/2 + mp.digamma((s+1)/2)/2 + mp.re(f(s,1)/f(s))
def L_rand(x):  # arbitrary real data: structural control
    return mp.sin(3*x) + x**2/7 - 1/(1+x)
def cheb(N,a,b):
    return [ (a+b)/2 + (b-a)/2*mp.cos(mp.pi*(2*k+1)/(2*N)) for k in range(N)]
def run(L, xs):
    N = len(xs); l = [L(x) for x in xs]
    P = mp.matrix(N,N); S = mp.matrix(N,N)
    for i in range(N):
        for j in range(N):
            S[i,j] = 1/(xs[i]+xs[j]); P[i,j] = (l[i]+l[j])*S[i,j]
    C = mp.cholesky(S); Ci = mp.inverse(C)
    A = Ci*P*Ci.T
    A = (A + A.T)/2
    E, Q = mp.eigsy(A)
    idx = sorted(range(N), key=lambda k: E[k])
    eps = E[idx[0]]; gap = E[idx[1]] - eps
    y = Q[:,idx[0]]; c = Ci.T*y
    s = sum(c); lc = sum(l[j]*c[j] for j in range(N))
    # numerator polynomial of V
    z = mp.mpf(0)
    coeffs = [mp.mpf(0)]*N   # degree N-1, highest first
    for j in range(N):
        p = [mp.mpf(1)]
        for k in range(N):
            if k == j: continue
            p = [a + b for a, b in zip(p + [mp.mpf(0)], [mp.mpf(0)] + [xs[k]*t for t in p])]
        for d in range(N): coeffs[d] += c[j]*p[d]
    big = max(abs(t) for t in coeffs)
    while abs(coeffs[0]) < big*mp.mpf(10)**(-mp.mp.dps//2): coeffs = coeffs[1:]
    roots = mp.polyroots(coeffs, maxsteps=4000, extraprec=mp.mp.prec*2)
    return eps, gap, s/mp.sqrt(sum(c[i]*c[j]*S[i,j] for i in range(N) for j in range(N))), eps - 2*lc/s, roots, E[idx[-1]]
if __name__ == "__main__":
    which, a, b = sys.argv[1], mp.mpf(sys.argv[2]), mp.mpf(sys.argv[3])
    L = {"zeta":L_zeta, "dh":L_dh, "rand":L_rand}[which]
    for N in [int(t) for t in sys.argv[4:]]:
        mp.mp.dps = 60 + 10*N
        eps, gap, s, chk, roots, emax = run(L, cheb(N,a,b))
        up = sorted([r for r in roots if mp.im(r) > 0], key=lambda r: mp.im(r))
        print(which, "N=%d nodes[%s,%s]"%(N,a,b), "eps=%s gap=%s emax=%s v(0)/|v|=%s eps-2<l,c>/s=%s"%(mp.nstr(eps,8), mp.nstr(gap,5), mp.nstr(emax,5), mp.nstr(s,5), mp.nstr(chk,3)))
        print("   max|Re root|/|root| =", mp.nstr(max(abs(mp.re(r))/abs(r) for r in roots),3), " #roots", len(roots))
        print("   Im roots>0:", [mp.nstr(mp.im(r),16) for r in up[:10]], flush=True)
        if which == "zeta":
            print("   err vs gamma_k:", [mp.nstr(mp.im(up[k]) - mp.im(mp.zetazero(k+1)),3) for k in range(min(len(up),8))], flush=True)
