# T-NR at large q: check that the three moments of Phi_NR^2 are the explicit combination of zeta's half-line moments
#   I_NR = c^2 I_h + 2 I_h,  E+-_NR(a) = c^2 E+-_h(a) + e^{+-a l}(E+_h(a) + E-_h(a)),  l = log q   (bumps disjoint: cross terms < e^{-1000})
import sys
from flint import arb
import slib
slib.setprec(256)
T, W, K = slib.table('zeta')
for key in ('NR(1000003,2.2)', 'NR(1000003,1.9)'):
    q, c = key[3:-1].split(','); l = arb(int(q)).log(); c = arb(float(c))
    Tn, Wn, Kn = slib.table(key)
    for a in ('0.3', '0.5069146546', '5', '30'):
        a_ = arb(a)
        I, Ep, Em = slib.exp_moments(T, W, K, a_)
        In, Epn, Emn = slib.exp_moments(Tn, Wn, Kn, a_)
        Ipred = (c*c + 2)*I; Eppred = c*c*Ep + (a_*l).exp()*(Ep + Em); Empred = c*c*Em + (-a_*l).exp()*(Ep + Em)
        Gn = ((Epn*Emn - In*In)/4).sqrt(); Gp = ((Eppred*Empred - Ipred*Ipred)/4).sqrt()
        print(key, 'a =', a, ' G direct', Gn.str(20), ' G from zeta moments', Gp.str(20), ' rel diff', float(abs(Gn/Gp - 1)))
