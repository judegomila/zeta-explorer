# MEASURED check of the velocity identity on certified transit intervals.
import math
from lib import *
from scipy.optimize import brentq
ctx.prec = 100
def Rt(t):
    ZA, ZB, _ = hardy(arb(t), 1); return float(ZB[0] / ZA[0])
def omega(t):
    ZA, ZB, _ = hardy(arb(t), 2); return float(ZB[1] / ZB[0] - ZA[1] / ZA[0])
def omega_euler(t):
    s = acb_series([acb(0.5, t), acb(1)], prec=2)
    z = s.zeta(); l20 = acb_series.dirichlet_l(s, CHI_M20); l5 = acb_series.dirichlet_l(s, CHI_5); l4 = acb_series.dirichlet_l(s, CHI_M4)
    A = (z * l20).coeffs(); B = (l5 * l4).coeffs()
    return float((A[1] / A[0] - B[1] / B[0]).imag)
def zero_at(phi, lo, hi): return brentq(lambda t: Rt(t) + 1 / math.tan(phi), lo, hi, xtol=1e-15, rtol=1e-15)
for phi, lo, hi in ((0.4, 4.6756, 6.0209), (0.9, 4.6756, 6.0209), (1.3, 17.567, 17.6007), (math.pi - 0.7, 10.6634, 11.9588), (math.pi - 1.2, 12.8025, 12.9880), (2.0, 19.1203, 19.5407)):
    g = zero_at(phi, lo + 1e-6, hi - 1e-6); h = 1e-5
    fd = (zero_at(phi + h, lo + 1e-6, hi - 1e-6) - zero_at(phi - h, lo + 1e-6, hi - 1e-6)) / (2 * h)
    print('phi=%.4f gamma=%.10f  finite difference=%.9f  -2/(sin(2phi) omega)=%.9f  omega=%.9f  Im(A\'/A-B\'/B)=%.9f' % (phi, g, fd, -2 / (math.sin(2 * phi) * omega(g)), omega(g), omega_euler(g)))
