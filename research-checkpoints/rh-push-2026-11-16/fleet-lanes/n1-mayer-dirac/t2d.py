import sys
sys.path.insert(0, sys.argv[0].rsplit('/',1)[0])
from common import *
from mpmath import quad, exp, sqrt, fabs, log
mp.dps = 60
print("hz vs mpmath zeta at a=40:", mp.nstr(fabs(hz(mpc(1.5,14), 40)-zeta(mpc(1.5,14), 40)), 5))
for k in (2, 5):
    rho = zetazero(k); s = rho; nu = rho - 1
    mp.dps = 60
    c0 = fabs(zeta(nu)/gamma(nu+1))**2; cinf = fabs(zeta(nu)/nu)**2
    Phi1 = lambda u: mpf(u)**(nu/2)*Wg_over(u, nu)/gamma(nu+1)
    Q = lambda u: sqrt(mpf(u))*fabs(Phi1(u))**2
    print("   Q(u) at u=1e-6,1e-3: %s %s  pred c0=%s"%(mp.nstr(Q('1e-6'),8), mp.nstr(Q('1e-3'),8), mp.nstr(c0,8)))
    for U in (100, 300, 1000, 3000, 10000):
        print("   u=%d: Q(u)/u = %s (pred cinf=|zeta(rho-1)/(rho-1)|^2=%s)"%(U, mp.nstr(Q(U)/U, 10), mp.nstr(cinf, 10)), flush=True)
