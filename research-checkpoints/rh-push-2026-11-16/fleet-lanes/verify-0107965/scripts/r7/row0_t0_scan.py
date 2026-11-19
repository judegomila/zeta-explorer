#!/usr/bin/env python3
"""Scan of J_0(0,x) - certified floor for row 0 at t=0 over x in [X0, X0 + npts*step] (float64 test, not a proof).
Gamma-factor part replaced by its leading term L/4 per unit weight (error O(1/x) ~ 1e-12)."""
import json, sys, math
from fractions import Fraction as F
import numpy as np
from flint import arb, ctx
ctx.prec = 160
I = sys.argv[1]; NP = int(float(sys.argv[2])); X0 = int(sys.argv[3]); step = float(sys.argv[4]); npts = int(sys.argv[5])
def L(p): return json.load(open(I + '/' + p))
plan = L('lambda_round14/material/m8_late/M8_LATE_PLAN.json')['rows'][0]
fin = L('lambda_round15/flow_main_v2/MAIN_CLOCK_SOURCE.json')['records'][0]
ov = plan['joint_jet_overlay']; alpha = float(F(ov['alpha'])); pc = float(F(ov['centres'][0]['p'])); b = [float(F(v)) for v in ov['centres'][0]['b']]
nodes = [(float(F(n['height'])), float(F(n['shift'])), float(F(n['weight']))) for n in plan['nodes']]
floor0 = float(F(fin['main_lo']) - F(fin['native_debit']) - F(fin['first_hi']))
print('planned allocation: sieve %d bytes, prime-power arrays ~%d float64 x 6' % (NP + 1, int(1.2 * NP / math.log(NP))))
sieve = np.ones(NP + 1, dtype=bool); sieve[:2] = False
for q in range(2, int(NP ** 0.5) + 1):
    if sieve[q]: sieve[q * q::q] = False
primes = np.nonzero(sieve)[0]; del sieve
# prime powers n = p^k <= NP : Lambda = log p, log n = k log p, phase = k*theta_p
twopi = 2 * arb.pi(); xh = arb(X0) / 2
th = np.empty(len(primes)); lp = np.log(primes.astype(float))
for k in range(len(primes)):
    v = xh * arb(int(primes[k])).log() / twopi; v = v - v.floor(); th[k] = float(v.mid())
th *= 2 * math.pi
LAM = [lp]; LN = [lp]; TH = [th]
k = 2
while 2 ** k <= NP:
    sel = primes.astype(float) ** k <= NP
    LAM.append(lp[sel]); LN.append(k * lp[sel]); TH.append(k * th[sel]); k += 1
LAM = np.concatenate(LAM); LN = np.concatenate(LN); TH = np.concatenate(TH)
print('prime powers:', len(LAM))
# scalar: S(x,h) = L/4 - (1/2) sum Lambda n^{-(1+h)/2} cos(x log n /2); symmetric shift a multiplies term by cos(a log n/2)
filt = np.zeros_like(LN)
for (h, a, w) in nodes: filt += w * np.exp(-(1 + h) / 2 * LN) * np.cos(a * LN / 2)
z = -pc * LN / 2
Pb = sum(br * z ** r / math.factorial(r) for r, br in enumerate(b))
amp = LAM * (alpha * filt / 2 + 2 * Pb * np.exp(-(1 + pc) / 2 * LN) / (2 * pc))   # J = main - sum amp cos(theta_n(x))
mass = sum(w for _, _, w in nodes)
best = (1e9, None); worst_head = 0.0
for i in range(npts):
    dx = i * step; x = X0 + dx
    Lq = math.log(x / (4 * math.pi)) / 4
    J = (alpha * mass + 2 * b[0] / pc) * Lq - float(np.dot(amp, np.cos(TH + (dx / 2) * LN)))
    if J - floor0 < best[0]: best = (J - floor0, x, J)
print('scan x in [%d, %.2f], step %g, %d points: min margin J - floor = %.6f at x = %.4f (J = %.6f, floor = %.6f)' % (X0, X0 + npts * step, step, npts, best[0], best[1], best[2], floor0))
print('absolute-phase lower bound (all cos = 1) on this truncation: main(X0) - sum|amp| = %.6f' % ((alpha * mass + 2 * b[0] / pc) * math.log(X0 / (4 * math.pi)) / 4 - float(np.sum(np.abs(amp)))))
assert best[0] > 0
