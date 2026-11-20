"""Pair-ODE prediction for a backward-heat list: a pair of gap s0 at tau = 0 has gap sqrt(s0^2 - 8|tau|) at tau < 0 and is off the line when s0^2 < 8|tau|.
With P0(s) = P(gap < s) of the tau = 0 list (measured empirically from the tau = 0 window):
  off-line fraction of zeros = 2 P0(sqrt(8|tau|)) / (1 - ...) ~ 2 P0(sqrt(8|tau|)),   P_tau(gap < d) = P0(sqrt(d^2 + 8|tau|)) - P0(sqrt(8|tau|)).
Usage: heat_gap_law.py PREFIX_OF_LISTS (data/heatL)"""
import sys, math, numpy as np, zl
pre = sys.argv[1]
def gaps(f):
    g = np.load(f); x = zl.theta(g) / math.pi; return np.diff(x), len(g)
s0, n0 = gaps(pre + '_0.npy'); s0s = np.sort(s0)
P0 = lambda s: np.searchsorted(s0s, s) / len(s0s)
print('tau | off-line fraction measured, predicted 2 P0(sqrt(8|tau|)) | P(s<0.02): measured, predicted | P(s<0.05): measured, predicted | P(s<0.1): measured, predicted | GUE cubic 0.02/0.05/0.1: %.2e %.2e %.2e' % tuple(math.pi ** 2 * d ** 3 / 9 for d in (.02, .05, .1)))
for t in ('-1e-4', '-5e-4', '-2e-3', '-1e-2'):
    s, n = gaps('%s_%s.npy' % (pre, t)); a = 8 * abs(float(t)); s = s * (n / n0)   # same unfolding (full-count density) as tau = 0
    s = np.diff(zl.theta(np.load('%s_%s.npy' % (pre, t))) / math.pi)
    row = ' | '.join('%.2e, %.2e' % ((s < d).mean(), (P0(math.sqrt(d * d + a)) - P0(math.sqrt(a)))) for d in (.02, .05, .1))
    print('%s | %.5f, %.5f | %s' % (t, 1 - n / n0, 2 * P0(math.sqrt(a)), row))
