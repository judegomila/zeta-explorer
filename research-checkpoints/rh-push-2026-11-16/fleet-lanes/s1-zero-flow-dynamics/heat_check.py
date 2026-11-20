"""Validation of the heat lists for tau < 0: real zeros of the amplified Riemann-Siegel sum against the exact Dyson ODE
dx_k/dtau = 2 sum' 1/(x_k - x_j) (unfolded) run backward from the true zeros. Usage: heat_check.py T0 NZ TAU..."""
import sys, math, numpy as np
import zl
xp = zl.xp
T0 = int(float(sys.argv[1])); nz = int(float(sys.argv[2])); taus = [float(v) for v in sys.argv[3:]]
L = math.log(T0 / (2 * math.pi)); Tb = int(T0 + nz * 2 * math.pi / L)
g0, _, _, _ = zl.zeta_block(T0, Tb)
x0 = zl.theta(g0) / math.pi
def drift(x):
    v = 2 * zl.forces(x)
    a = x[0] - 0.5; b = x[-1] + 0.5
    return v + 2 * xp.log((b - x) / (x - a))
for tau in taus:
    gt, nh, bad, ex = zl.zeta_block(T0, Tb, tau)
    xt = zl.theta(gt) / math.pi
    x = xp.asarray(x0); nst = 200; dt = tau / nst
    for _ in range(nst):
        k1 = drift(x); k2 = drift(x + 0.5 * dt * k1); k3 = drift(x + 0.5 * dt * k2); k4 = drift(x + dt * k3)
        x = x + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
    xf = zl.asnp(x)
    s = np.diff(x0); pred = int((s * s / 8 < -tau).sum())
    print('tau=%g zeros at 0: %d ; real zeros of the amplified sum: %d ; pairs with s^2/8 < |tau| at tau=0: %d ; ODE order violations %d' % (tau, len(x0), len(xt), pred, int((np.diff(xf) <= 0).sum())))
    if len(xt) == len(x0):
        c = len(x0) // 2; sl = slice(c - 500, c + 500)
        dif = xt[sl] - xf[sl]; dif -= np.median(dif)
        print('   central 1000: rms position difference %.2e max %.2e ; rms gap difference %.2e ; V start %.4f ODE %.4f sum %.4f' % (dif.std(), np.abs(dif).max(), (np.diff(xt[sl]) - np.diff(xf[sl])).std(), np.diff(x0[sl]).var(), np.diff(xf[sl]).var(), np.diff(xt[sl]).var()))
