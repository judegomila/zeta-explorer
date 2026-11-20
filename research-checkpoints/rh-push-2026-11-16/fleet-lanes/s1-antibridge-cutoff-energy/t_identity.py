"""known-answer check of the even/odd boundary-energy identity (zeta-view BRIDGE-RESEARCH sec 3):
E_+ - E_- = int_0^inf omega_{a,h}(r) P_a(t-r, t+r) dr = W(1/2+h+it)/h,  W = Re(F' conj F),
P_a(r1,r2) = Im(conj U_a(r1) U_a(r2))/(a (r2-r1)), U_a(t) = F(a + it) (z = s - 1/2).  Gauss-Legendre in r, python-flint values."""
import math, json
import numpy as np
from flint import acb, arb, ctx
import flib
ctx.prec = 200
def omega(a, h, r):
    return math.pi * r * math.sin(math.pi * h / a) * math.sinh(math.pi * r / a) / (a * h * (math.cosh(math.pi * r / a) + math.cos(math.pi * h / a)) ** 2)
out = []
for obj, t in [('ZETA', 20.0), ('ZETA', 14.3), ('CHI4', 9.7), ('DH', 85.7), ('DH', 86.4)]:
    o = flib.OBJ[obj]
    for a, h in [(0.25, 0.125), (0.1, 0.05), (0.02, 0.01)]:
        x, w = np.polynomial.legendre.leggauss(60)
        tot = arb(0); mass = 0.0
        R = 40 * a / math.pi * 3; npan = 24
        for p in range(npan):
            lo = R * p / npan; hi = R * (p + 1) / npan
            for xi, wi in zip(x, w):
                r = 0.5 * (lo + hi) + 0.5 * (hi - lo) * xi; ww = 0.5 * (hi - lo) * wi
                U1 = o.taylor(acb(a, t - r), 1)[0]; U2 = o.taylor(acb(a, t + r), 1)[0]
                P = (U1.conjugate() * U2).imag / (a * 2 * r)
                om = omega(a, h, r); mass += om * ww
                tot += P * om * ww
        c = o.taylor(acb(h, t), 2); W = (c[1] * c[0].conjugate()).real
        rhs = W / h
        out.append(dict(obj=obj, t=t, a=a, h=h, omega_mass=mass, lhs=float(tot), rhs=float(rhs), rel=float(abs(tot / rhs - 1).mid()), sign=('+' if rhs > 0 else '-')))
        print(out[-1])
json.dump(out, open('out/identity_check_boundary_energy.json', 'w'), indent=1)
