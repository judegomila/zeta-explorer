import numpy as np, math, json, sys
import predict as P
K, _ = P.kernel('psi_48.json')
L = 16.62
print('first-order model, cumulative in kappa at L=%.2f (measured dP: pi/2 0.01746, pi 0.02551, 3pi/2 0.0158; total 0.0301)' % L)
for kap in [math.pi / 2, math.pi, 1.5 * math.pi, 2 * math.pi]:
    print('  kappa=%.4f  sum_{k_n<kappa} c_n K - int_0^kappa K k/2pi = %.5f' % (kap, P.predict(L, K, kap)))
lam = lambda k: k * (2 * math.pi - k)
def flowdef(L, tau):
    Kt = lambda k: K(k) * np.exp(-2 * lam(np.minimum(k, 2 * math.pi)) * tau)
    return P.predict(L, Kt)
print('flow: first-order arithmetic defect D(tau) = sum c_n e^{-2 lam tau} K - int e^{-2 lam tau} K S0, L=16.59')
for tau in [0, 0.0025, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.4]:
    print('  tau=%.4f  D=%.5f' % (tau, flowdef(16.59, tau)))
