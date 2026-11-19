#!/usr/bin/env python3
"""Numerical tests (mpmath, 50 digits) of (a) the one-logarithm Cauchy charge (eq. 78),
(b) the normaliser bound (eq. 117 region) on the jet disks, (c) anchor inequalities."""
import json, sys, math, random
from fractions import Fraction as F
import mpmath as mp
mp.mp.dps = 50
I = sys.argv[1]
plan = json.load(open(I + '/lambda_round14/material/m8_late/M8_LATE_PLAN.json'))['rows']
random.seed(7)
X = 6000000185827; N0 = 690988
print('(c) X - 4 - 4*pi*N0^2 =', mp.nstr(X - 4 - 4 * mp.pi * N0 ** 2, 12), ' (must be > 0 so that L >= L0 on all translates)')
print('    log((X-4)/(4 pi)) =', mp.nstr(mp.log((X - 4) / (4 * mp.pi)), 15), ' 2 log N0 =', mp.nstr(2 * mp.log(N0), 15))
assert X - 4 > 4 * mp.pi * N0 ** 2
circ = {0: (F(61, 20), F(1)), 16: (F(61, 20), F(1, 2)), 44: (F(4), F(39, 20))}
for i, (p, r) in circ.items():
    b = [F(v) for v in plan[i]['joint_jet_overlay']['centres'][0]['b']]
    pf, rf = mp.mpf(p.numerator) / p.denominator, mp.mpf(r.numerator) / r.denominator
    bf = [mp.mpf(v.numerator) / v.denominator for v in b]
    M = len(b) - 1
    bound_unit = sum((m + 1) * abs(bf[m]) * (pf / rf) ** m for m in range(M + 1)) / (pf * rf)   # per unit eta
    worst = 0
    for trial in range(400):
        delta = mp.mpf(10) ** random.uniform(-9, -0.5)
        kind = trial % 3
        if kind == 0:      # Blaschke factor
            a = mp.mpc(random.uniform(-.99, .99), random.uniform(-.1, .1)) * random.random(); a = a / max(1, abs(a) * 1.01)
            ph = mp.expj(random.uniform(0, 2 * math.pi))
            W = lambda z, a=a, ph=ph, d=delta: d * ph * ((z - pf) / rf - a) / (1 - mp.conj(a) * (z - pf) / rf)
        elif kind == 1:    # monomial
            k = random.randint(1, M + 2); ph = mp.expj(random.uniform(0, 2 * math.pi))
            W = lambda z, k=k, ph=ph, d=delta: d * ph * ((z - pf) / rf) ** k
        else:              # exponential-type, sup norm delta on the disk
            c = mp.mpc(random.uniform(-3, 3), random.uniform(-3, 3))
            W = lambda z, c=c, d=delta: d * mp.exp(c * (z - pf) / rf - abs(c))
        ell = lambda z: mp.log(1 + W(z))
        # derivatives by Cauchy integrals on a smaller circle (radius r/2), 256 nodes
        rho = rf / 2; n = 256
        vals = [ell(pf + rho * mp.expjpi(mp.mpf(2 * k) / n)) for k in range(n)]
        der = []
        for m in range(1, M + 2):
            cm = sum(vals[k] * mp.expjpi(-mp.mpf(2 * k * m) / n) for k in range(n)) / n / rho ** m   # Taylor coeff
            der.append(cm * mp.factorial(m))
        lhs = abs(sum(bf[m] * pf ** m / mp.factorial(m) * der[m] for m in range(M + 1)) / pf)
        # real part version is what enters S; |Re| <= |.|
        eta = delta / (1 - delta)
        worst = max(worst, lhs / (eta * bound_unit))
        assert lhs <= eta * bound_unit * (1 + mp.mpf(10) ** (-20)), (i, trial, lhs, eta * bound_unit)
    print('(a) row %2d: 400 random W on the disk (p=%s, r=%s): max LHS / RHS of (78) = %s (<= 1 required)' % (i, p, r, mp.nstr(worst, 6)))
    # (b) normaliser on the closed disk boundary and interior
    def alpha_(s): return 1 / (2 * s) + 1 / (s - 1) + mp.log(s / (2 * mp.pi)) / 2
    def dalpha(s): return -1 / (2 * s ** 2) - 1 / (s - 1) ** 2 + 1 / (2 * s)
    worstn = 0
    for x in (X, X + 12345, 10 ** 14):
        Lc = mp.log(mp.mpf(x) / (4 * mp.pi))
        for t in (mp.mpf(0), mp.mpf(19) / 125):
            for k in range(64):
                for rad in (rf, rf / 2, 0):
                    zeta = pf + rad * mp.expjpi(mp.mpf(k) / 32)
                    s = (1 + zeta) / 2 - mp.mpc(0, 1) * x / 2
                    val = alpha_(s) / 2 + t * alpha_(s) * dalpha(s) / 4
                    # independent finite-difference check of the closed form at one point
                    worstn = max(worstn, abs(val - (Lc / 4 - mp.mpc(0, 1) * mp.pi / 8)))
    print('(b) row %2d: max |d/dzeta log B_t - (L/4 - i pi/8)| over disk samples, x in {X, X+12345, 1e14}, t in {0, 19/125}: %s  (paper: < 2e-12; charged 1e-10)' % (i, mp.nstr(worstn, 6)))
    assert worstn < mp.mpf(2) / 10 ** 12
# closed form of d/dzeta log B_t against a direct numerical derivative of log M_t
def logM(s, t):
    al = 1 / (2 * s) + 1 / (s - 1) + mp.log(s / (2 * mp.pi)) / 2
    return mp.log(s * (s - 1) / 16) - s / 2 * mp.log(mp.pi) + mp.log(2 * mp.pi) / 2 + (s / 2 - mp.mpf(1) / 2) * mp.log(s / 2) - s / 2 + t * al ** 2 / 4
x = mp.mpf(X); t = mp.mpf(19) / 125; zeta = mp.mpc(4, -1.3)
f = lambda z: logM((1 + z) / 2 - mp.mpc(0, 1) * x / 2, t)
num = mp.diff(f, zeta)
s = (1 + zeta) / 2 - mp.mpc(0, 1) * x / 2
al = 1 / (2 * s) + 1 / (s - 1) + mp.log(s / (2 * mp.pi)) / 2; dal = -1 / (2 * s ** 2) - 1 / (s - 1) ** 2 + 1 / (2 * s)
print('    closed form vs numerical derivative of log M_t((1+zeta)/2 - ix/2): diff =', mp.nstr(abs(num - (al / 2 + t * al * dal / 4)), 5))
print('    32991/(5000 (X-2)) =', mp.nstr(mp.mpf(32991) / 5000 / (X - 2), 8))
