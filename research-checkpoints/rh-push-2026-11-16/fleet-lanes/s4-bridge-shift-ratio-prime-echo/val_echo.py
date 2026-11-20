"""validation of echo.py: (a) float sums against mpmath direct sums at a few points; (b) D_P against exact Re xi'/xi (Arb)."""
import sys, json, math, numpy as np, mpmath as mp
from flint import acb, arb, ctx
import echo, lib
P = float(sys.argv[1]) if len(sys.argv) > 1 else 1e5
T = echo.terms(P)
t = np.array([1000.3, 1010.7, 5000.123, 20000.5])
acc = echo.accumulate(t, T, [1e3, P], 65536, echo.xp)
Sc, Ss = acc[-1]
D = echo.tests(t, Sc, Ss, P)
# (a) direct sums in mpmath (30 digits) for ZETA sharp, x = X[3] and SGN sharp, U sharp at t[0]
mp.mp.dps = 30
x = echo.X[3]; s = mp.mpc(0.5 + x, t[0])
tz = mp.mpf(0); ts = mp.mpf(0); tu = mp.mpf(0)
for i in range(len(T['n'])):
    p = int(T['p'][i]); m = int(T['m'][i]); lp = mp.log(p)
    v = lp * mp.exp(-s * m * lp)
    tz += v.real; ts += (T['eps'][i] ** m) * v.real; tu += (mp.exp(2j * mp.pi * m * mp.mpf(float(T['u'][i]))) * v).real
G = float(echo.drift('ZETA', np.array([complex(s)]))[0])
Gex = (1 / s + 1 / (s - 1) - mp.log(mp.pi) / 2 + mp.digamma(s / 2) / 2).real
print('drift asym - exact', G - float(Gex))
print('ZETA sharp  float - mp', D['ZETA:sharp'][0, 3] - float(Gex - tz))
print('SGN sharp   float - mp', D['SGN:sharp'][0, 3] - float(Gex - ts))
print('U sharp     float - mp', D['U:sharp'][0, 3] - float(Gex - tu))
# (b) exact Re xi'/xi
ctx.prec = 100
Z = lib.Zeta(); L4 = lib.LCHI4()
print('x, exact Re xi\'/xi, sharp+pole, fejer+pole | chi4 exact, sharp, fejer   (t = %g, P = %g)' % (t[2], P))
for j, x in enumerate(echo.X):
    e = float(lib.logder(Z, acb(x, t[2])).real.mid()); e4 = float(lib.logder(L4, acb(x, t[2])).real.mid())
    print('%.3f  %10.4f %10.4f %10.4f | %10.4f %10.4f %10.4f' % (x, e, D['ZETA:sharp+pole'][2, j], D['ZETA:fejer+pole'][2, j], e4, D['CHI4:sharp'][2, j], D['CHI4:fejer'][2, j]))
# Liouville limit: G - (zeta'/zeta(s) - 2 zeta'/zeta(2s)); EA limit; TNR limit
def zlog(s):
    from flint import acb_series
    y = acb_series([s, 1], prec=2).zeta(); return y[1] / y[0]
print('x, LIOU exact limit, sharp+pole, fejer+pole | EA exact, sharp+pole | TNR3 exact, sharp+pole')
EA = lib.EA(1, 4); TN = lib.TNR()
for j, x in enumerate(echo.X):
    s = acb(0.5 + x, t[2])
    Gz = float(echo.drift('ZETA', np.array([complex(0.5 + x, t[2])]))[0])
    el = Gz - float((zlog(s) - 2 * zlog(2 * s)).real.mid())
    ee = float(lib.logder(EA, acb(x, t[2])).real.mid()); et = float(lib.logder(TN, acb(x, t[2])).real.mid())
    print('%.3f  %10.4f %10.4f %10.4f | %10.4f %10.4f | %10.4f %10.4f' % (x, el, D['LIOU:sharp+pole'][2, j], D['LIOU:fejer+pole'][2, j], ee, D['EA:sharp+pole'][2, j], et, D['TNR3:sharp+pole'][2, j]))
