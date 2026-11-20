"""High-precision recheck (mpmath siegelz, 30 digits) of the one positive sample minimum of Z flagged for zeta at T0 = 1e8."""
import mpmath as mp
mp.mp.dps = 30
t0 = mp.mpf(100000000) + mp.mpf('387090.33092336124'); h = mp.mpf('0.0378809394130797')
vals = [(float(k) / 20, mp.siegelz(t0 + h * k / 20)) for k in range(-60, 41)]
mn = min(vals, key=lambda v: v[1] if v[0] > -1.9 else 10)
print('samples at the grid points (steps -3..3):', [float(mp.siegelz(t0 + h * k)) for k in range(-3, 4)])
print('minimum of Z on the fine grid (step/20) for offsets > -1.9 steps: Z = %.3e at offset %.2f steps' % (float(mn[1]), mn[0]))
sc = [(vals[i][0], vals[i + 1][0]) for i in range(len(vals) - 1) if vals[i][1] * vals[i + 1][1] < 0]
print('sign changes of Z on the fine grid between offsets:', sc)
