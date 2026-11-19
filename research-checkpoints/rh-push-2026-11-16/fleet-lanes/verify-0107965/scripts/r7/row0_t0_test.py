#!/usr/bin/env python3
"""End-to-end numerical test of the row-0 source inequality at t = 0 (H_0 = xi/8), several x >= X.
J_0(0,x) = alpha * sum_j w_j A_{h_j,a_j} S_0(x) + 2 T_b S_0(x,p), S_0(x,h) = d/dh log|xi((1+h)/2 + i x/2)|.
zeta'/zeta and its derivatives from the prime sum (primes <= NP, phases reduced with 160-bit Arb logs).
Floating point (float64 sums); a test, not a proof."""
import json, sys, math
from fractions import Fraction as F
import numpy as np
import mpmath as mp
from flint import arb, ctx
ctx.prec = 160; mp.mp.dps = 40
I = sys.argv[1]; NP = int(float(sys.argv[2])) if len(sys.argv) > 2 else 20_000_000
def L(p): return json.load(open(I + '/' + p))
plan = L('lambda_round14/material/m8_late/M8_LATE_PLAN.json')['rows'][0]
fin = L('lambda_round15/flow_main_v2/MAIN_CLOCK_SOURCE.json')['records'][0]
cert = L('lambda_round13/flow/MIXED_ROW000_M4_SOURCE_CERTIFICATE.json')['jet_source']
assert F(plan['time'][0]) == 0
ov = plan['joint_jet_overlay']; alpha = float(F(ov['alpha'])); pc = float(F(ov['centres'][0]['p'])); b = [F(v) for v in ov['centres'][0]['b']]
nodes = [(float(F(n['height'])), float(F(n['shift'])), float(F(n['weight']))) for n in plan['nodes']]
floor0 = float(F(fin['main_lo']) - F(fin['native_debit']) - F(fin['first_hi']))
jet_floor = float(F(cert['main_lo']) - F(cert['native_debit']) - F(cert['first_hi']))
print('planned allocation: sieve %d bytes + ~8 float64 arrays of %d primes' % (NP + 1, int(1.1 * NP / math.log(NP))))
sieve = np.ones(NP + 1, dtype=bool); sieve[:2] = False
for q in range(2, int(NP ** 0.5) + 1):
    if sieve[q]: sieve[q * q::q] = False
primes = np.nonzero(sieve)[0]; del sieve
logp = np.log(primes.astype(np.float64)); npr = len(primes)
print('primes:', npr)
small = primes <= 20000
X = 6000000185827
xs = [arb(X), arb(X) + arb(37) / 100, arb(X) + arb(1000123) / 1000, arb(7) * 10**12 + arb(1) / 3, arb(10)**13 + arb.pi(), arb(3) * 10**14 + arb(1) / 7]
twopi = 2 * arb.pi()
def base_phase(x):
    out = np.empty(npr)
    xh = x / 2
    for k in range(npr):
        v = xh * arb(int(primes[k])).log() / twopi
        v = v - v.floor()
        out[k] = float(v.mid())
    return out * (2 * math.pi)
def zsum(theta, sigma, m):
    """sum_n Lambda(n) (-log n)^m n^{-sigma} e^{-i theta_n}  (complex), prime powers of primes <= NP."""
    tot = np.sum(logp * (-logp) ** m * np.exp(-sigma * logp) * np.exp(-1j * theta))
    ls = logp[small]; ts = theta[small]
    for k in range(2, 60):
        term = ls * (-k * ls) ** m * np.exp(-k * sigma * ls) * np.exp(-1j * k * ts)
        tot += np.sum(term)
    return tot
def Dk(k, w, theta, sigma):
    """k-th derivative of log xi at w (k>=1)."""
    w = mp.mpc(w)
    v = (-1) ** (k - 1) * mp.factorial(k - 1) * (w ** (-k) + (w - 1) ** (-k)) + mp.mpf(1) / 2 ** k * mp.psi(k - 1, w / 2)
    if k == 1: v -= mp.log(mp.pi) / 2
    return complex(v) - zsum(theta, sigma, k - 1)
def S_deriv(xf, h, theta, r):
    """d^r/dh^r S_0(x,h); xf = mp value of x, theta = phases for that x."""
    w = mp.mpc((1 + h) / 2, xf / 2)
    return (0.5 ** (r + 1) * Dk(r + 1, w, theta, (1 + h) / 2)).real
for x in xs:
    th0 = base_phase(x); xf = mp.mpf(x.mid().str(40, radius=False)) if hasattr(x.mid(), 'str') else mp.mpf(float(x.mid()))
    Lx = float(mp.log(xf / (4 * mp.pi)))
    scal = 0.0
    for (h, a, w) in nodes:
        if a == 0:
            scal += w * S_deriv(xf, h, th0, 0)
        else:
            scal += w / 2 * (S_deriv(xf + a, h, th0 + (a / 2) * logp, 0) + S_deriv(xf - a, h, th0 - (a / 2) * logp, 0))
    jet = sum(float(br) * pc ** r / math.factorial(r) * S_deriv(xf, pc, th0, r) for r, br in enumerate(b)) / pc
    J = alpha * scal + 2 * jet
    mass = sum(w for _, _, w in nodes)
    # jet decomposition: main, head n<=4096 with actual phases, remainder
    sig = (1 + pc) / 2
    def Pb(z): return sum(float(br) * z ** r / math.factorial(r) for r, br in enumerate(b))
    head = 0.0; rest_abs = 0.0
    for k in range(1, 13):
        n = primes.astype(np.float64) ** k
        sel = n <= 4096
        if not sel.any(): break
        ln = k * logp[sel]
        head += np.sum(logp[sel] * np.exp(-sig * ln) * Pb(-pc * ln / 2) * np.cos(k * th0[sel]))
    head = -head / (2 * pc)
    main_j = float(b[0]) * Lx / (4 * pc)
    rem = jet - main_j - head
    tail_scal = sum(abs(w) for _, _, w in nodes) * NP ** (1 - 1.75) / 0.75 / 2
    print('x=%s  L/4=%.6f  mass*L/4=%.6f' % (mp.nstr(xf, 20), Lx / 4, mass * Lx / 4))
    print('   scalar part = %.6f   2*jet = %.6e   J_0(0,x) = %.6f   certified floor(theta=0) = %.6f   margin = %.6f  (crude worst-case prime-tail error %.1e)' % (scal, 2 * jet, J, floor0, J - floor0, tail_scal))
    print('   jet: T_b S = %.9e  main b0 L/(4p) = %.9e  head(n<=4096, actual phases) = %+.4e  remainder = %+.4e   [certified: |head| <= %.4e, |remainder| <= %.4e, floor %.6e]' % (
        jet, main_j, head, rem, float(F(cert['first_hi'])), float(F(cert['native_debit'])), jet_floor))
    assert J > floor0 and jet > jet_floor and abs(head) <= float(F(cert['first_hi'])) and abs(rem) <= float(F(cert['native_debit']))
print('row-0 t=0 test passed at all sampled x')
