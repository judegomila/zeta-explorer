#!/usr/bin/env python3
"""Combination 1 (trace side): symbol Lhat_S(t) = 2 theta'(t) + 2 Re (L_p'/L_p)(1/2+it) + deltahat_S(t), S = {inf, p},
deltahat_S(t) = 2 int_0^inf delta_S(e^u) cos(t u) du  (graded Gauss-Legendre mesh at the spikes u = k log p).
zeta: Lhat(0) = +0.0650 (p=2), +0.0504 (p=3)  [tmp/route-i-scratch1.mjs].   usage: symbol.py p name [OUT]"""
import sys, math, json, os, time
import numpy as np
from scipy.special import digamma
import sisum, lf
p = int(sys.argv[1]); name = sys.argv[2]; OUT = sys.argv[3] if len(sys.argv) > 3 else 'out'
UMAX = float(sys.argv[4]) if len(sys.argv) > 4 else 32.0; J = int(sys.argv[5]) if len(sys.argv) > 5 else 44
os.makedirs(OUT, exist_ok=True); t0 = time.time()
GLN = int(os.environ.get('SYM_GL', '8')); RAT = float(os.environ.get('SYM_RATIO', '2.0'))
gx, gw = np.polynomial.legendre.leggauss(GLN)
LP = math.log(p)
pts = []; wts = []
def plain(lo, hi):
    h = (hi - lo) / 2; pts.extend(lo + h + h * gx); wts.extend(h * gw)
def graded(lo, hi, toward_lo):
    Ln = hi - lo; prev = 0.0
    for j in range(J, -1, -1):
        e = Ln * RAT ** (-j); d0, d1 = prev, e; prev = e
        c0, c1 = (lo + d0, lo + d1) if toward_lo else (hi - d1, hi - d0)
        plain(c0, c1)
spikes = [k * LP for k in range(0, int(UMAX / LP) + 1)]
for k, a in enumerate(spikes):
    b = spikes[k + 1] if k + 1 < len(spikes) else UMAX
    npan = max(1, math.ceil((b - a) / 0.25))
    for q in range(npan):
        c0 = a + (b - a) * q / npan; c1 = a + (b - a) * (q + 1) / npan; mid = (c0 + c1) / 2
        if q == 0: graded(c0, mid, True)
        else: plain(c0, mid)
        if q == npan - 1 and k + 1 < len(spikes): graded(mid, c1, False)
        else: plain(mid, c1)
pts = np.array(pts); wts = np.array(wts)
print(f'[{name}@{p}] mesh points {len(pts)}; planned work arrays {len(pts)*8*6/2**20:.1f} MB', flush=True)
vals = sisum.delta_grid(name, p, np.exp(pts))
print(f'delta tabulated [{time.time()-t0:.0f}s]; delta(e^UMAX) = {vals[-1]:.2e}', flush=True)
ts = np.arange(0, 60.0001, 0.02)
hat = np.array([2 * np.sum(wts * vals * np.cos(t * pts)) for t in ts])
tth = digamma(0.25 + 0.5j * ts).real - math.log(math.pi)
ld = lf.logderiv2re(name, p, ts)
Lh = tth + ld + hat
i = int(np.argmin(Lh))
print(f'RESULT {name}@{p}: Lhat(0) = {Lh[0]:+.6f}  (2theta\'(0) = {tth[0]:.6f}, 2Re L\'/L = {ld[0]:+.6f}, deltahat(0) = {hat[0]:.6f});  min over [0,60] = {Lh[i]:+.6f} at t = {ts[i]:.2f};  min over [0,30] = {Lh[:1501].min():+.6f}', flush=True)
json.dump(dict(name=name, p=p, L0=float(Lh[0]), minL=float(Lh[i]), argmin=float(ts[i]), min30=float(Lh[:1501].min()), tth0=float(tth[0]), ld0=float(ld[0]), hat0=float(hat[0]),
               samples=[[float(ts[k]), float(Lh[k])] for k in range(0, len(ts), 25)], npts=len(pts), UMAX=UMAX, J=J, seconds=time.time() - t0), open(f'{OUT}/symbol_{name}_p{p}.json', 'w'))
