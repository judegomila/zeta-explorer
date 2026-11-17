"""At zeta zeros rho (on the line): values and derivatives of F at the nine class-number-one anchors."""
import math, cmath, json
import mpmath as mp
from elib import *
mp.mp.dps = 25
Ds = (-3, -4, -7, -8, -11, -19, -43, -67, -163)
def anchor(D):
    return (0.0, math.sqrt(-D) / 2) if D % 4 == 0 else (0.5, math.sqrt(-D) / 2)
res = []
for k in (1, 2):
    g = float(mp.zetazero(k).imag)
    E = Eis(0.5, g); h = 1e-4
    Ep, Em = Eis(0.5, g + h), Eis(0.5, g - h)          # t-derivative on the line
    Esp, Esm = Eis(0.5 + h, g), Eis(0.5 - h, g)        # sigma derivative
    print("zeta zero", k, "gamma =", g)
    print("   D      F(z_D,rho)            F_y (tangent)           F_yy                    F_xx                  G=dF/dt             dF/dsigma")
    for D in Ds:
        x, y = anchor(D); hy = 1e-3
        F0 = E.F(x, y)
        Fy = (E.F(x, y + hy) - E.F(x, y - hy)) / (2 * hy)
        Fyy = (E.F(x, y + hy) - 2 * F0 + E.F(x, y - hy)) / hy ** 2
        Fxx = (E.F(x + hy, y) - 2 * F0 + E.F(x - hy, y)) / hy ** 2
        G = (Ep.F(x, y) * math.exp(-PI * h / 2) - Em.F(x, y) * math.exp(PI * h / 2)) / (2 * h)   # undo scale drift
        Fs = (Esp.F(x, y) - Esm.F(x, y)) / (2 * h)
        f = lambda c: "%+.4e%+.1ei" % (c.real, c.imag)
        print("%5d  %s  %s  %s  %s  %s  %s" % (D, f(F0), f(Fy), f(Fyy), f(Fxx), f(G), f(Fs)))
        res.append({"zero": k, "D": D, "F": [F0.real, F0.imag], "Fy": [Fy.real, Fy.imag], "Fyy": [Fyy.real, Fyy.imag],
                    "Fxx": [Fxx.real, Fxx.imag], "G": [G.real, G.imag], "Fs": [Fs.real, Fs.imag]})
json.dump(res, open("anchors.json", "w"))
# identity check: d/dz of the lattice sum = -(i s/2) y^(s-1) sum (m zbar+n)^2/|mz+n|^(2s+2), at a CM anchor, absolutely convergent range
sg, t = 2.6, 1.3; s = complex(sg, t); E = Eis(sg, t)
for D in (-7, -4, -3, -163):
    x, y = anchor(D); h = 1e-5
    Fx = (E.F(x + h, y) - E.F(x - h, y)) / (2 * h); Fy = (E.F(x, y + h) - E.F(x, y - h)) / (2 * h)
    Fz = 0.5 * (Fx - 1j * Fy)
    z = complex(x, y); tot = 0j; M = 250
    for m in range(-M, M + 1):
        for n in range(-M, M + 1):
            if m or n:
                a = m * z.conjugate() + n
                tot += a * a / abs(a) ** (2 * s + 2)
    pref = cmath.exp(-s * math.log(PI)) * complex(mp.gamma(mp.mpc(sg, t))) * 0.5 * math.exp(PI * abs(t) / 2)
    rhs = -(1j * s / 2) * y ** (s - 1) * pref * tot
    print("weight-2 identity D=%d: dF/dz = %s ; -(is/2) y^(s-1) pi^-s Gamma(s)/2 * sum abar^2/N^(s+1) = %s ; sum = %s" % (D, Fz, rhs, tot))
