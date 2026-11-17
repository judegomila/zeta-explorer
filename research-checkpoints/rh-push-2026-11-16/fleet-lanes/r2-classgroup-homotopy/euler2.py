# Euler-side checks (floating point: MEASURED checks of PROVED identities) and abscissa constants.
import numpy as np, math, cmath
from lib import *
from scipy.optimize import brentq
ctx.prec = 100
def primes(N):
    sv = np.ones(N + 1, dtype=bool); sv[:2] = False
    for i in range(2, int(N ** .5) + 1):
        if sv[i]: sv[i * i::i] = False
    return np.nonzero(sv)[0]
PR = primes(10 ** 8); P = PR[(PR % 20 == 3) | (PR % 20 == 7)].astype(np.float64); LP = np.log(P)
X = float(PR[-1])
def Rc(s):
    A, B = AB(acb(s.real, s.imag)); return complex(B / A)
print('== (E1) R(s) = tanh(s log2/2) * prod_{p = 3,7 mod 20} tanh(s log p/2)^2   [product truncated at 1e8]')
for s in (complex(2, 3), complex(1.5, 40), complex(3, -7.7), complex(1.2, 100.5)):
    pr = cmath.tanh(s * math.log(2) / 2) * np.exp(2 * np.sum(np.log(np.tanh(s * LP / 2))))
    print('  s=%s  B/A=%s  product=%s' % (s, Rc(s), pr))
print('== (E2) velocity identity  dgamma/dphi = -2/(sin(2 phi) omega(gamma)),  omega = d/dt log|R(1/2+it)| = Im(A\'/A - B\'/B)(1/2+i gamma)')
def Rt(t):
    ZA, ZB, _ = hardy(arb(t), 1); return float(ZB[0] / ZA[0])
def omega(t):
    ZA, ZB, _ = hardy(arb(t), 2); return float(ZB[1] / ZB[0] - ZA[1] / ZA[0])
def omega_euler(t):
    s = acb_series([acb(0.5, t), acb(1)], prec=2)
    z = s.zeta(); l20 = acb_series.dirichlet_l(s, CHI_M20); l5 = acb_series.dirichlet_l(s, CHI_5); l4 = acb_series.dirichlet_l(s, CHI_M4)
    A = (z * l20).coeffs(); B = (l5 * l4).coeffs()
    return float((A[1] / A[0] - B[1] / B[0]).imag)
def zero_at(phi, lo, hi): return brentq(lambda t: Rt(t) + 1 / math.tan(phi), lo, hi, xtol=1e-14)
for phi, lo, hi in ((0.3, 2.37, 4.6), (0.9, 4.7, 6.0), (1.2, 20.0, 20.6), (2.0, 8.82, 9.8), (2.9, 6.03, 6.3)):
    try:
        g = zero_at(phi, lo, hi); h = 1e-5
        fd = (zero_at(phi + h, g - 1e-3, g + 1e-3) - zero_at(phi - h, g - 1e-3, g + 1e-3)) / (2 * h)
        print('  phi=%.2f gamma=%.10f  finite difference=%.8f  formula=%.8f  omega=%.8f  Im(A\'/A-B\'/B)=%.8f' % (phi, g, fd, -2 / (math.sin(2 * phi) * omega(g)), omega(g), omega_euler(g)))
    except Exception as e: print('  phi', phi, 'no bracket', e)
print('== (E3) sigma>1.  H(sigma) = -log R(sigma) = log(A(sigma)/B(sigma));  G(sigma) = 2 arctan 2^-sigma + 4 sum_P arctan p^-sigma')
kap = float(CHI_5.l(acb(1)).real * CHI_M4.l(acb(1)).real / CHI_M20.l(acb(1)).real)
print('  kappa = L(1,chi5) L(1,chi-4)/L(1,chi-20) = %.12f ; closed form (sqrt5/2... ) 2 log((1+sqrt5)/2)/sqrt5 * (pi/4) / (pi/sqrt5) = %.12f' % (kap, 0.5 * math.log((1 + 5 ** .5) / 2)))
Rs = lambda sig: float(Rc(complex(sig, 0)).real)
for sig in (1.0001, 1.001, 1.01, 1.05, 1.1, 1.5, 2.0, 3.0):
    print('  sigma=%-7s R(sigma)=%.8f  R/(kappa (sigma-1))=%.6f   F_phi zero-free on Re s>=sigma when |phi| or |phi-pi/2| < %.6f' % (sig, Rs(sig), Rs(sig) / (kap * (sig - 1)), math.atan(Rs(sig))))
from scipy.integrate import quad
def tail(sig):   # sum over p in P, p > X of 4 arctan(p^-sigma) ~ int_X^inf x^-sigma/log x dx  (density 1/4; estimate, not a bound)
    return quad(lambda u: math.exp((1 - sig) * u) / u, math.log(X), np.inf)[0]
def G(sig): return 2 * math.atan(2 ** -sig) + 4 * float(np.sum(np.arctan(P ** -sig)))
for sig in (1.01, 1.02, 1.03, 1.04, 1.06, 1.1):
    print('  G(%s) = %.6f + tail estimate %.6f = %.6f' % (sig, G(sig), tail(sig), G(sig) + tail(sig)))
sp_lo = brentq(lambda x: G(x) - math.pi, 1.0005, 1.5); sp = brentq(lambda x: G(x) + tail(x) - math.pi, 1.0005, 1.5)
print('  sigma_pi: G = pi at sigma = %.6f (with tail estimate); truncated sum alone gives %.6f (rigorous lower value for the root)' % (sp, sp_lo))
U = lambda sig: 2 * float(np.sum(np.arctanh(P ** -sig)))
s_real = brentq(lambda x: math.tanh(U(x)) - 2 ** -x, 1.5, 3); s_tan = brentq(lambda x: math.tan(U(x)) - 2 ** -x, 1.7, 3)
print('  Z_2: sigma*_real (tanh U = 2^-sigma) = %.8f    sigma_tan (tan U = 2^-sigma) = %.8f   [tails beyond 1e8 < 1e-9]' % (s_real, s_tan))
