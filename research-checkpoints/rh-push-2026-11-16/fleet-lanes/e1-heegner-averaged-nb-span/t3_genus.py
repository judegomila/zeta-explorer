# Control: one genus = one class (D = -15, -20, -24; h = 2, two genera).  Genus bracket for the principal genus:
#   G_D(s) = zeta(s) L(s,chi_D) + L(s,chi_d1) L(s,chi_d2)   (= Epstein zeta of the principal form, up to w)
# versus the class-group average zeta(s) L(s,chi_D).  Zeros with Re s > 1/2 by cell winding + Newton.
import numpy as np, flint, math, json
from hlib import *
import hlib
def Lgen(D, s):
    if D == 1: return s.zeta()
    return chi(D).l(s)
cases = {-15: (-3, 5), -20: (-4, 5), -24: (-3, 8), -40: (-8, 5)}
sig = np.arange(0.5, 2.5001, 0.05); ts = np.arange(0.05, 60.0001, 0.05)
out = {}
for D, (d1, d2) in cases.items():
    def f(s): return s.zeta() * chi(D).l(s) + chi(d1).l(s) * chi(d2).l(s)
    B = np.array([[complex(f(flint.acb(float(a), float(t)))) for t in ts] for a in sig])
    ph = np.angle(B)
    d = lambda a, b: ((b - a) + np.pi) % (2 * np.pi) - np.pi
    e = d(ph[:-1, :-1], ph[1:, :-1]) + d(ph[1:, :-1], ph[1:, 1:]) + d(ph[1:, 1:], ph[:-1, 1:]) + d(ph[:-1, 1:], ph[:-1, :-1])
    W = np.rint(e / (2 * np.pi)).astype(int)
    zs = []
    for i, j in zip(*np.nonzero(W)):
        s = flint.acb(float(sig[i] + .025), float(ts[j] + .025))
        for it in range(60):
            hh = 1e-7; fv = f(s); fp = (f(s + hh) - f(s - hh)) / (2 * hh); ds = complex(fv / fp); s = flint.acb(complex(s) - ds)
            if abs(ds) < 1e-13: break
        z = complex(s); zs.append([z.real, z.imag, abs(complex(f(s)))])
    zs = [z for z in zs if z[0] > 0.5 + 1e-6]
    out[D] = zs
    print(D, (d1, d2), 'zeros with Re s > 1/2, 0 < Im s <= 60 (off the line):', len(zs))
    for z in zs: print('   %.9f + %.9f i   |f| = %.1e   Blaschke |rho/(1-rho)|^2 = %.5f' % (z[0], z[1], z[2], (z[0]**2 + z[1]**2) / ((1 - z[0])**2 + z[1]**2)), flush=True)
json.dump({str(k): v for k, v in out.items()}, open('t3_genus.json', 'w'), indent=1)
