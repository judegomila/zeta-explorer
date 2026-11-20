"""sigma_1(tau): root of sum_{n>=2} exp(-(tau/4) log^2 n) n^{-sigma} = 1.  D_tau has no zeros for Re s > sigma_1 (triangle inequality),
so sigma_plus(tau) <= sigma_1(tau).  Tail n > N bounded by the integral (added)."""
import numpy as np, json, math
from scipy import integrate
N = 2*10**6
n = np.arange(2, N+1, dtype=float); l = np.log(n)
def S(sig, tau):
    head = np.sum(np.exp(np.minimum(700.0, -(tau/4)*l*l - sig*l)))
    tail = integrate.quad(lambda u: math.exp(min(700.0, u - (tau/4)*u*u - sig*u)), math.log(N+0.5), 400)[0]
    return head + tail
out = []
for tau in [0.02, 0.05, 0.1, 0.15, 0.2, 0.25, 9/32, 0.5, 1, 2, 4, 8]:
    lo, hi = -40.0, 3.0
    for _ in range(80):
        mid = (lo+hi)/2
        if S(mid, tau) > 1: lo = mid
        else: hi = mid
    out.append(dict(tau=tau, sigma1=hi, offset_2sigma1_minus_1=2*hi-1)); print(out[-1])
json.dump(out, open('sig1.json', 'w'), indent=1)
