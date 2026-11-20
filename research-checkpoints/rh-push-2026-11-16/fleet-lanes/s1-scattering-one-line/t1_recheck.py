"""Precision re-check of the float64 one-line sums at the top block: the same sums with 80-bit phases on CPU, and mpmath zeta."""
import sys, math, json, numpy as np, mpmath as mp
import lib
from lib import *
k = int(sys.argv[1]); npts = int(sys.argv[2])
rng = np.random.default_rng(5); t = np.sort(2 * rng.uniform(10.0**k, 2 * 10.0**k, npts))
o = oneline_batch(t, sigmas=(0.75, 1.0, 1.25))
LD = np.longdouble; print('longdouble mantissa bits:', np.finfo(LD).nmant)
N5 = np.floor(np.sqrt(5 * t / (2 * math.pi))).astype(np.int64); Nz = np.floor(np.sqrt(t / (2 * math.pi))).astype(np.int64)
n = np.arange(1, int(N5.max()) + 1); ln = np.log(n.astype(LD)); twopi = 2 * np.pi * LD(1)
twopi = LD(mp.nstr(2 * mp.pi, 25)) if np.finfo(LD).nmant > 52 else twopi
worst = {'Sz': 0.0, 'S5': 0.0, 'zeta1': 0.0, 'Lchi': 0.0}
for i, tt in enumerate(t):
    ph = LD(tt) * ln; ph = ph - np.floor(ph / twopi) * twopi; E = np.exp(-1j * ph.astype(np.float64))
    mz = n <= Nz[i]; m5 = n <= N5[i]
    Sz = [(E[mz] * n[mz] ** (-sg)).sum() for sg in (0.75, 1.0, 1.25)] + [(E[mz] * n[mz] ** (sg - 1)).sum() for sg in (0.75, 1.0, 1.25)] + [(E[mz] ** 2 / n[mz] ** 2.0).sum()]
    S5 = [(E[m5 & (n % 5 == a)] / n[m5 & (n % 5 == a)]).sum() for a in range(1, 5)] + [E[m5 & (n % 5 == a)].sum() for a in range(1, 5)]
    worst['Sz'] = max(worst['Sz'], float(np.abs(np.array(Sz) - o['Sz'][i]).max())); worst['S5'] = max(worst['S5'], float(np.abs(np.array(S5) - o['S5'][i]).max()))
    if i < 3:
        mp.mp.dps = 30; s = mp.mpc(1, tt)
        z = complex(mp.zeta(s)); worst['zeta1'] = max(worst['zeta1'], abs(z - o['zeta'][1.0][i]))
        # chi-factor of L(chi) against mpmath loggamma
        Xm = complex(mp.mpc(EPS5) * mp.exp((mp.mpf(1) / 2 - s) * mp.log(5 / mp.pi) + mp.loggamma((2 - s) / 2) - mp.loggamma((s + 1) / 2)))
        A = np.array(S5[:4]); D = np.array(S5[4:]); chi = CHI5[1:5]
        Lref = A @ chi + Xm * np.conj(D @ chi)
        worst['Lchi'] = max(worst['Lchi'], abs(Lref - o['Lchi'][i]))
        print('t = %.3f  zeta(1+it) mpmath %s  float64 screen %s' % (tt, z, o['zeta'][1.0][i]), flush=True)
print('worst deviations (float64 GPU screen vs 80-bit phases / mpmath):', json.dumps(worst))
json.dump({'k': k, 'npts': npts, 'worst': worst, 'scale_AFE_error': float((5 * t[0] / 2 / math.pi) ** -0.5)}, open('t1_recheck_k%d.json' % k, 'w'))
