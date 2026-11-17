# T-NR control realised on the isogeny tree: G_c(s) = 2 E*(2i,s) + c E*(i,s) = (2^s + 2^(1-s) + c - 1) E*(i,s)
from mpmath import *
from hecke_checks import Estar
mp.dps = 25
for c in (0, 5):
    s = mpc(0.83, 4.4)
    lhs = 2*Estar(mpc(0, 2), s) + c*Estar(mpc(0, 1), s); rhs = (2**s + 2**(1-s) + c - 1)*Estar(mpc(0, 1), s)
    print("c =", c, "identity rel.err", nstr(abs(lhs-rhs)/abs(rhs), 3))
c = 5   # |c-1| = 4 > 2 sqrt 2: zeros of 2 sqrt2 cosh(z log 2) + 4 at z = +-acosh(sqrt 2)/log 2 + i pi(2k+1)/log 2
beta = acosh(sqrt(2))/log(2); t = pi/log(2)
rho = mpc(0.5 + beta, t)
print("predicted off-line zero", nstr(rho, 12), " |G_5(rho)| =", nstr(abs(2*Estar(mpc(0, 2), rho) + 5*Estar(mpc(0, 1), rho)), 3),
      " |E*(i,rho)| =", nstr(abs(Estar(mpc(0, 1), rho)), 3))
