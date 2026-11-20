"""Validation of t4_prime: (i) rot_sum against direct numpy sums; (ii) S_X(t) against S(t) = N(t) - smooth count from the zero table."""
import json, math, sys, numpy as np, bl
n, lp, k = bl.prime_powers(1e5); T = 3000.0; M = 4000; d = 0.05
phi, lg = bl.phase_big(n, T)
s_, c_ = bl.rot_sum(phi, d * lg, 1 / (k * np.sqrt(n)), M)
tt = T + d * np.arange(M)
direct = np.array([(np.sin(t * np.log(n)) / (k * np.sqrt(n))).sum() for t in tt[::97]])
print('rot_sum against direct: max abs diff %.2e' % np.abs(s_[0][::97] - direct).max())
g = np.array(json.load(open(sys.argv[1]))['gamma'], dtype=float)
from mpmath import mp, siegeltheta
def S_true(t): return float(np.searchsorted(g, t)) - (float(siegeltheta(t)) / math.pi + 1)
St = np.array([S_true(t) for t in tt[::20]])
for X in (1e2, 1e3, 1e5):
    m = n <= X; s2, _ = bl.rot_sum(phi[m], d * lg[m], 1 / (k[m] * np.sqrt(n[m])), M); Sx = -s2[0][::20] / math.pi
    print('X=%g: rms S_true %.4f rms S_X %.4f rms difference %.4f correlation %.4f' % (X, St.std(), Sx.std(), (St - Sx).std(), np.corrcoef(St, Sx)[0, 1]))
