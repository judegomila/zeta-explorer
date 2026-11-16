# HEURISTIC: large-deviation estimate of sup_{gamma in [G,G e^{2 Delta}]} D(gamma), D = sum_p a_p cos(gamma log p) + (prime powers, trivially bounded)
# random-phase model: theta_p iid uniform.  P(sum a_p cos theta_p >= M) ~ exp(-I(M)); number of independent cells ~ Ncell.
import numpy as np, mpmath as mp, sys
from scipy.special import ive
from scipy.optimize import brentq
def primes(n):
    s = np.ones(n+1, bool); s[:2] = False
    for i in range(2, int(n**.5)+1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]
P = primes(2000000).astype(float); lp = np.log(P)
X = 6000000185827.0; L = np.log(X/(4*np.pi))/4
def logI0(z): return np.log(ive(0, z)) + z
def I1I0(z): return ive(1, z)/ive(0, z)
for h in [1.5, 1.5443, 1.6, 1.7, 1.88, 2.2]:
    sig = (1+h)/2
    a = lp*P**(-sig)
    tot = float(-mp.zeta(sig, derivative=1)/mp.zeta(sig))
    psum = a.sum() + P[-1]**(1-sig)/(sig-1)      # primes incl. tail estimate
    out = []
    for logN in [np.log(1e13), np.log(1e15), np.log(1e17)]:
        # solve K'(s)=M, s*M-K(s)=logN
        def rate(s):
            M = (a*I1I0(s*a)).sum(); return s*M - logI0(s*a).sum() - logN
        s = brentq(rate, 1e-3, 1e5); M = (a*I1I0(s*a)).sum()
        out.append((a.sum()-M))
    triv = L - tot/2
    print('h=%.4f sigma=%.4f  -zeta\'/zeta=%.4f  trivial floor=%.4f | LD deficit Delta (primes<=2e6) at Ncell=1e13,1e15,1e17: %.3f %.3f %.3f | floor gain Delta/2 ~ %.3f  rate-ceiling 4l/h: triv %.3f -> %.3f'
          % (h, sig, tot, triv, out[0], out[1], out[2], out[1]/2, 4*triv/h, 4*(triv+out[1]/2)/h))
