"""Validation of the winding code of t1_zeta_gpu.py on a case with a known answer: zeros of zeta' to the RIGHT of the line.
Berndt: N_1(T) = (T/2 pi) log(T/4 pi e) + O(log T); so a strip [T0, T0+D] holds about (D/2 pi) log(T0/4 pi) zeros of zeta'
in 1/2 < Re s < 3, against (D/2 pi) log(T0/2 pi) zeros of zeta.  Second check: the same loop with Arb values on one window."""
import sys, math, numpy as np
import zgpu
PI = math.pi
def loop(w, d0, d1, nt, nx, xa, xb):
    dv = np.linspace(d0, d1, nt); xh = np.linspace(xa, xb, nx)
    _, zv, _ = w.zeta(dv, [xb, xa], order=1)
    _, zh, _ = w.zeta(np.array([d0, d1]), list(xh), order=1)
    path = np.concatenate([zh[:, 0], zv[0], zh[::-1, 1], zv[1][::-1]])
    da = np.angle(path[1:] / path[:-1])
    return da.sum() / (2 * PI), float(np.abs(da).max()), path
for T0, D in [(1e5, 300.0), (1e7, 200.0)]:
    w = zgpu.Win(T0)
    wn, ms, _ = loop(w, 0.0, D, 60001, 4001, 0.0, 2.5)
    wl, ml, _ = loop(w, 0.0, D, 60001, 4001, -0.49, 0.0)
    print('T0 %g D %g: zeta\' zeros in 1/2 < Re s < 3: winding %.6f (max step %.2f); Berndt main term %.2f; left rectangle %.6f (max step %.2f)'
          % (T0, D, wn, ms, D / (2 * PI) * math.log(T0 / (4 * PI)), wl, ml), flush=True)
# Arb loop on one window, compared point by point
T0 = 1e7; w = zgpu.Win(T0)
wn, ms, path = loop(w, 3.0, 5.0, 801, 201, -0.49, 0.0)
dv = np.linspace(3.0, 5.0, 801); xh = np.linspace(-0.49, 0.0, 201)
pts = [(x, 3.0) for x in xh] + [(0.0, d) for d in dv] + [(x, 5.0) for x in xh[::-1]] + [(-0.49, d) for d in dv[::-1]]
ref = np.array([zgpu.arb_zeta_jet(0.5 + x, T0, d, n=2)[1] for x, d in pts[::10]])
err = np.abs(path[::10] - ref) / np.abs(ref)
da = np.angle(ref[1:] / ref[:-1])
print('Arb loop at T0 = 1e7, window [3, 5]: float64 winding %.6f, Arb (every 10th point) winding %.6f, max relative difference of zeta\' %.2e' % (wn, da.sum() / (2 * PI), err.max()))
