"""Zero-side formula for the Fejer statistic (validation, and the mechanism of combination (1)).
D_F(s) := Re G(s) - Re sum_{n<=P} Lambda(n)(1 - log n/L) n^-s + Re P^(1-s)/((1-s)^2 L),  L = log P,  s = 1/2 + x + i t.
Claim (contour shift; CLASSICAL):  D_F(s) = Re xi'/xi(s) + Re (zeta'/zeta)'(s)/L + sum_rho Re P^(rho-s)/((rho-s)^2 L) + O(P^(-2-x)/(t^2 L)).
Per zero, with u = (rho - s) L:  1/(s-rho) - 1/((s-rho)^2 L) + P^(rho-s)/((rho-s)^2 L) = L k(u),  k(u) = (e^u - 1 - u)/u^2 = int_0^1 (1-v) e^(uv) dv,
and Re k(u) >= 0 for Re u <= 0 (cosine transform of a convex decreasing function).
usage: val_fejer.py [P=1e5] [t=1500.3]"""
import sys, json, math, numpy as np
from flint import acb, arb, ctx, acb_series
import echo, lib
P = float(sys.argv[1]) if len(sys.argv) > 1 else 1e5
t0 = float(sys.argv[2]) if len(sys.argv) > 2 else 1500.3
T = echo.terms(P); t = np.array([t0, t0 + 0.37])
Sc, Ss = echo.accumulate(t, T, [P], 65536, echo.xp)[-1]
D = echo.tests(t, Sc, Ss, P)['ZETA:fejer+pole']
g = np.array([float(v) for v in json.load(open('../c12-control-battery-harness/tables/zeros_ZETA_2H.json'))['gamma']])
g = np.concatenate([g, -g]); L = math.log(P); ctx.prec = 100
print('P = %g, zeros with |gamma| < 4000 used: %d' % (P, len(g)))
print('   t        x     D_F (primes)   zero-side formula   difference    min over zeros of L Re k(u)')
for i, tt in enumerate(t):
    for j, x in enumerate(echo.X):
        s = acb(0.5 + x, tt)
        a = float(lib.logder(lib.Zeta(), acb(x, tt)).real.mid())
        y = acb_series([s, 1], prec=3).zeta()
        zl1 = y[1] / y[0]; zl2 = 2 * y[2] / y[0] - zl1 * zl1          # (zeta'/zeta)' = zeta''/zeta - (zeta'/zeta)^2
        z = (0.5 + 1j * g) - complex(0.5 + x, tt)
        zs = (np.exp(z * L) / (z * z * L)).real.sum()
        u = z * L; k = ((np.exp(u) - 1 - u) / (u * u)).real * L
        f = a + float(zl2.real.mid()) / L + zs
        if j in (0, 3, 8, 11, 14): print('%8.2f %6.3f %14.8f %14.8f %12.2e %14.3e' % (tt, x, D[i, j], f, D[i, j] - f, k.min()))
