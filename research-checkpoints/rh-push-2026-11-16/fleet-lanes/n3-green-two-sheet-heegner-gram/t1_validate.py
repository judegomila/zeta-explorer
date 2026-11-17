import numpy as np, mpmath as mp, time
from glib import *
# (a) g_s small-u constant
s = 0.7+14.1j; C, reg0 = consts(s)
u = 1e-9
print("reg0 check", gs_small(u, s, C) + np.log(u)/(4*np.pi), reg0)
print("continuity u=0.5", gs_arr(np.array([0.5, 0.4999999]), s, C, reg0))
# (b) P_s vs direct sum at Re s > 1
s = 1.8+3j; C, reg0 = consts(s)
z = 0.13+0.9j; w = -0.2+1.4j
direct = sum(gs_arr(np.array([abs(z-w-n)**2/(4*z.imag*w.imag)]), s, C, reg0)[0] for n in range(-200000, 200001))
print("P direct", direct, "P_arr", P_arr([z.real], [z.imag], w.real, w.imag, s, C, reg0)[0])
# (c) P_s continuation vs Fourier form at Re s = 0.55 and 0.5
for s in [0.55+14.1j, 0.5+14.1j, 0.3-14.1j]:
    C, reg0 = consts(s); nu = mp.mpmathify(s)-0.5
    yl, yg = min(z.imag, w.imag), max(z.imag, w.imag)
    f = yl**mp.mpmathify(s)*yg**(1-mp.mpmathify(s))/(2*mp.mpmathify(s)-1)
    for m in range(1, 60):
        f += 2*mp.sqrt(yl*yg)*mp.besseli(nu, 2*mp.pi*m*yl)*mp.besselk(nu, 2*mp.pi*m*yg)*mp.cos(2*mp.pi*m*(z.real-w.real))
    print(s, "Fourier", complex(f), "P_arr", P_arr([z.real], [z.imag], w.real, w.imag, s, C, reg0)[0])
# (d) full G vs Poincare series at Re s > 1
s = 2.2+2j; C, reg0 = consts(s)
z = pullback(0.21+1.1j); w = 1j
t0 = time.time(); so = Solver(s); coef, res = so.solve(w)
print("solver sv min/max", so.sv[-1], so.sv[0], "res", res, "time", time.time()-t0)
Gh = so.G([z], w, coef)[0]
# direct: sum over (c,d) coprime, c>=0, of P_s(z, gamma w)
from math import gcd
tot = 0; R = 400
for c in range(0, R):
    ds = [1] if c == 0 else [d for d in range(-R, R+1) if gcd(c, abs(d)) == 1 and c*c+d*d <= R*R]
    if not ds: continue
    ims = []
    for d in ds:
        if c == 0: ims.append(w); continue
        a = pow(d, -1, c) if c > 1 else 0; bb = (a*d-1)//c
        ims.append((a*w+bb)/(c*w+d))
    for im in ims:
        tot += P_arr([z.real], [z.imag], im.real, im.imag, s, C, reg0, N=60)[0]
print("G Hejhal", Gh, "G direct (R=400)", tot)
