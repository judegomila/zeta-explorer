# Validation of hankel_sequence against direct time-domain quadrature with the closed-form archimedean kernel g_a.
import math, numpy as np, mpmath as mp
import hlib
mp.mp.dps = 18
a = mp.mpf(1)/4; h = 0.004
def g(y):
    y = mp.mpf(y)
    return 2*mp.pi**a/mp.gamma(a)*(y**(2 - a)*(1 - y*y)**(a - 1) - a*y**(a - 1)*mp.betainc(mp.mpf(3)/2 - a, a, y*y, 1))
c2 = 2**a*(1 - 2**(-2*a))
def K(u):
    s = g(mp.exp(-u))
    if u > mp.log(2): s += c2*g(2*mp.exp(-u))
    return mp.exp(-u/2)*s
def N7(y):
    return sum((-1)**k*mp.binomial(8, k)*max(y - k, 0)**7 for k in range(9))/mp.factorial(7)
def m_direct(u0):
    pts = [max(u0, 0)] + [u0 + j*h for j in range(1, 9) if u0 + j*h > 0]
    if u0 < mp.log(2) < u0 + 8*h: pts = sorted(pts + [mp.log(2)])
    return mp.quad(lambda u: K(u)*N7((u - u0)/h)/h, pts)
Afun, c, real = hlib.make_object('zeta', 0.25, 8)
u, m, info = hlib.hankel_sequence(Afun, c, 0.25, 0.42, h)
for k in (3, 9, 33, 100, 175, 190):
    md = m_direct(mp.mpf(float(u[k])))
    print('u0=%.4f  fft %.12f  direct %s  diff %.2e' % (u[k], m[k].real, mp.nstr(md, 13), abs(m[k].real - float(md))))
