import sys, time
sys.path.insert(0, sys.argv[0].rsplit('/',1)[0])
from common import *
from mpmath import quad, exp, inf, mpmathify, log, fabs
mp.dps = 50
N = 40
print("planned allocation: 3 mp matrices %dx%d"%(N,N))
for k in (1, 2, 5):
    t0=time.time()
    rho = zetazero(k); b = rho/2; s = rho; nu = rho-1
    L, xs = mayer(b, N)
    A = tonp(L)
    ev, evec = np.linalg.eig(A)
    i = np.argmin(abs(ev-1)); 
    # explicit eigenfunction f(x)=psi(x+1)
    f = [psi(x+1, s) for x in xs]
    fv = matrix(f)
    res = L*fv - fv
    rn = max(fabs(r) for r in res)/max(fabs(r) for r in fv)
    v = evec[:, i]; fn = np.array([complex(x) for x in f]); c = np.vdot(v, fn)/np.vdot(v, v)
    print("k=%d rho=%s"%(k, mp.nstr(rho, 12)))
    print("  nearest eigenvalue to 1: |lam-1|=%.3e ; second nearest |lam-1|=%.3e"%(abs(ev[i]-1), np.sort(abs(ev-1))[1]))
    print("  explicit f: sup|L f - f|/sup|f| = %s ; eigvec match rel err = %.3e"%(mp.nstr(rn,5), np.linalg.norm(fn-c*v)/np.linalg.norm(fn)))
    # three-term check psi(z)-psi(z+1) = z^-s psi(1+1/z) at z=0.7
    z = mpf('0.7'); print("  three-term defect at z=0.7:", mp.nstr(fabs(psi(z,s)-psi(z+1,s)-z**(-s)*psi(1+1/z,s)),5))
    # cusp-flux coefficient: psi(z) ~ C z^(1-s), C=zeta(s-1)/(s-1)
    C = zeta(s-1)/(s-1)
    for zz in (50, 400):
        print("  z=%d: psi(z) z^(s-1) = %s   C=zeta(rho-1)/(rho-1) = %s"%(zz, mp.nstr(psi(zz,s)*mpf(zz)**(s-1),10), mp.nstr(C,10)))
    # Laplace check: int e^{-xu} u^{nu/2} (Wg)(u) du = psi(x)-psi(x+1)
    x = mpf(2)
    I = quad(lambda u: exp(-x*u)*u**nu*Wg_over(u, nu)/gamma(nu+1), [0, 1, 5, 20, 45])
    print("  Laplace check x=2: |int - (psi(x)-psi(x+1))| =", mp.nstr(fabs(I-(psi(x,s)-psi(x+1,s))),5))
    # boundary quantity Q(u)=u^{1/2}|Phi1|^2, Phi1=Wg = u^{nu/2} Wg_over/Gamma(nu+1)
    def Phi1(u): return mpf(u)**(nu/2)*Wg_over(u, nu)/gamma(nu+1)
    c0 = fabs(zeta(nu)/gamma(nu+1))**2; cinf = fabs(zeta(nu)/nu)**2
    print("  u->0 : Q(1e-4)=%s Q(1e-2)=%s  predicted |zeta(nu)/Gamma(nu+1)|^2=%s"%(mp.nstr(mpf('1e-4')**0.5*fabs(Phi1('1e-4'))**2,8), mp.nstr(mpf('1e-2')**0.5*fabs(Phi1('1e-2'))**2,8), mp.nstr(c0,8)))
    print("  u->inf: Q(u)/u for u=50,200: %s %s  predicted |zeta(nu)/nu|^2=%s"%(mp.nstr(mpf(50)**0.5*fabs(Phi1(50))**2/50,8), mp.nstr(mpf(200)**0.5*fabs(Phi1(200))**2/200,8), mp.nstr(cinf,8)))
    # Phi1 part of N on [eps,R]
    mp.dps = 20
    N1 = lambda e, R: quad(lambda u: fabs(Phi1(u))**2/mp.sqrt(u), mp.linspace(mpf(e), mpf(R), 2) if R<=1 else [e, 1, R/4, R/2, R])
    a1 = quad(lambda u: fabs(Phi1(u))**2/mp.sqrt(u), [mpf('1e-4'), mpf('1e-3'), mpf('1e-2'), mpf('0.1'), 1])
    a2 = quad(lambda u: fabs(Phi1(u))**2/mp.sqrt(u), [mpf('1e-2'), mpf('0.1'), 1])
    a3 = quad(lambda u: fabs(Phi1(u))**2/mp.sqrt(u), [1, 5, 10, 20])
    a4 = quad(lambda u: fabs(Phi1(u))**2/mp.sqrt(u), [20, 30, 40])
    print("  N1[1e-4,1]=%s N1[1e-2,1]=%s  diff/log(100)=%s (pred %s)"%(mp.nstr(a1,8), mp.nstr(a2,8), mp.nstr((a1-a2)/log(100),8), mp.nstr(c0,8)))
    print("  N1[1,20]=%s N1[20,40]=%s  N1[20,40]/(40-20)=%s (pred %s)"%(mp.nstr(a3,8), mp.nstr(a4,8), mp.nstr(a4/20,8), mp.nstr(cinf,8)))
    # asymptotic coefficient of the N integrand including Phi2 (Mellin multiplier)
    cN = fabs(gamma(nu))**2 - fabs(gamma(nu+mpf(1)/2)/gamma(mpf(3)/2))**2
    cB = fabs(gamma(nu))**2 + fabs(gamma(nu+mpf(1)/2)/gamma(mpf(3)/2))**2
    print("  |zeta(nu)/Gamma(nu+1)|^2 * (|G(nu)|^2 -+ |G(nu+1/2)/G(3/2)|^2): N-coef=%s  boundary-coef=%s"%(mp.nstr(c0*cN,8), mp.nstr(c0*cB,8)))
    mp.dps = 50
    print("  time %.0fs"%(time.time()-t0), flush=True)
