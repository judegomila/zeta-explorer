"""High-precision recheck of a landing time of test 1, independent of the ODE integrator.
The flow of the first N zeros and their mirrors is the heat flow of the polynomial P_0(z) = prod (z^2 - z_j^2):
P_t = exp(-t d^2/dz^2) P_0 = sum_j z^(2j) sum_k a_(j+k) (-t)^k (2j+2k)! / ((2j)! k!).  A pair lands at (x, t) where P_t(x) = P_t'(x) = 0.
Newton in (x, t) from the float64 values of t1.py, mpmath with DPS digits (the float64 zero list is taken as exact input).
Usage: t1_exact.py OBJ N [DPS]   reads out/t1_<OBJ>_bare.json for the starting point"""
import sys, json, math, numpy as np, bl
from mpmath import mp, mpf, mpc, matrix, lu_solve, factorial, nstr
obj, N = sys.argv[1], int(sys.argv[2]); mp.dps = int(sys.argv[3]) if len(sys.argv) > 3 else 700
row = [r for r in json.load(open('out/t1_%s_bare.json' % obj))['rows'] if r['N'] == N][0]
on, og, ox, tail = bl.control(obj, 2000.0); on_, og_, ox_, hc, Nact = bl.first_N(on, og, ox, N)
w = [mpf(float(2 * v)) ** 2 for v in on_] + [mpc(float(2 * a), float(2 * b)) ** 2 for a, b in zip(og_, ox_)] + [mpc(float(2 * a), -float(2 * b)) ** 2 for a, b in zip(og_, ox_)]
deg = len(w); a = [mpf(1)]                       # Q(w) = prod (w - w_j), coefficients a[m] of w^m (ascending), real up to rounding
for wj in w:
    a = [(a[m - 1] if m > 0 else 0) - wj * (a[m] if m < len(a) else 0) for m in range(len(a) + 1)]
a = [mp.re(v) for v in a]
fac = [factorial(m) for m in range(2 * deg + 1)]
def coeffs(t):
    c = []
    for j in range(deg + 1):
        s = mpf(0); p = mpf(1)
        for k in range(deg - j + 1):
            s += a[j + k] * p * fac[2 * j + 2 * k] / (fac[2 * j] * fac[k]); p *= -t
        c.append(s)
    return c                                     # P_t(z) = sum c[j] z^(2j)
def derivs(c, x, nd=4):
    out = []
    for d in range(nd):
        s = mpf(0)
        for j in range(deg + 1):
            e = 2 * j
            if e >= d: s += c[j] * fac[e] / fac[e - d] * x ** (e - d)
        out.append(s)
    return out
x = mpf(row['land_x']); t = mpf(row['T_N'])
for it in range(12):
    P, P1, P2, P3 = derivs(coeffs(t), x)
    # F = (P, P1); dF/dx = (P1, P2); dF/dt = (-P2, -P3)
    det = P1 * (-P3) - (-P2) * P2
    dx = (-P * (-P3) + P1 * (-P2)) / det; dt = (-P1 * P1 + P2 * P) / det
    x += dx; t += dt
    print('iter %d: dx %s dt %s' % (it, nstr(dx, 5), nstr(dt, 5)), flush=True)
    if abs(dt) < mpf(10) ** (-45) and abs(dx) < mpf(10) ** (-40): break
print('OBJ %s N=%d: landing time (Newton, %d digits) %s at x = %s' % (obj, N, mp.dps, nstr(t, 42), nstr(x, 30)))
print('float64 flow value %.12f ; difference %s' % (row['T_N'], nstr(t - mpf(row['T_N']), 5)))
json.dump(dict(obj=obj, N=N, dps=mp.dps, T_exact=nstr(t, 45), x=nstr(x, 40), T_flow=row['T_N'], diff=float(t - mpf(row['T_N']))), open('out/t1_exact_%s_%d.json' % (obj, N), 'w'))
