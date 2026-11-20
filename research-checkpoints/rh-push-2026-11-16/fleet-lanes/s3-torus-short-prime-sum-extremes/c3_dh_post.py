"""DH: sawtooth statistics of the true S (steps of 2 restored at the located gap midpoints), mean removed; per-event detector lag."""
import os, sys, json, math
os.environ['RH_NOGPU'] = '1'
import numpy as np
import c3
zd = np.load('c3_main_dhzeros.npy'); R = json.load(open('c3_main.json'))
t1 = 1.0; span = R['meta']['Tmax'] - t1
rho = lambda t: np.log(5 * (t1 + np.asarray(t, dtype=float)) / (2 * math.pi)) / (2 * math.pi)
Rd = lambda t: (c3.theta5_np(t1 + np.asarray(t, dtype=float), 0.0) - c3.theta5_np(t1, 0.0)) / math.pi
d = c3.dh_analysis(zd, t1, span, rho, Rd)
z = zd - t1
# all step locations again (same algorithm) to restore the true S
from scipy.ndimage import median_filter
cnt = np.arange(1, len(z) + 1)
S0 = cnt - Rd(z) + d['c'] - 0.5
medf = median_filter(S0, size=21, mode='nearest', origin=-10)
gz = np.diff(z) * rho(z[:-1]); used = np.zeros(len(z), bool); gam = []; trig = []
L = 0; i = 0; n = len(z)
while i < n:
    if medf[i] + 2 * L < -1.0:
        lo = max(0, i - 2); hi = min(n - 1, i + 21)
        g = np.where(used[lo:hi], -1.0, gz[lo:hi]); jx = lo + int(np.argmax(g)); used[jx] = True
        gam.append(0.5 * (z[jx] + z[jx + 1])); trig.append(z[min(n - 1, i + 20)]); L += 1
    else:
        i += 1
gam = np.array(gam); trig = np.array(trig)
o = np.argsort(gam)
zz = np.concatenate([z, gam]); ww = np.concatenate([np.ones(len(z)), 2 * np.ones(len(gam))]); oo = np.argsort(zz)
st, _ = c3.sawtooth(zz[oo], ww[oo], Rd, rho, 0.0, span, 'DH true S (steps restored, mean removed)')
st2, _ = c3.sawtooth(zz[oo], ww[oo], Rd, rho, 0.0, span, 'DH true S (steps restored, mean removed)', c_fixed=st['c'] - st['mean_S'])
# detector: running median of the line count over the next 21 zeros falls below level - 1; the data it uses end at trig
lag = (trig - gam) * rho(gam)
out = dict(true=st2, detector_lag_mean_spacings=dict(min=float(lag.min()), q05=float(np.quantile(lag, 0.05)), median=float(np.median(lag)), q95=float(np.quantile(lag, 0.95)), frac_negative=float((lag < 0).mean())),
           pairs=len(gam), zeros_on_line=len(z), fraction_off_line=2 * len(gam) / (len(z) + 2 * len(gam)))
json.dump(out, open('c3_dh_post.json', 'w'), indent=1)
b = {r['delta_mean_spacings']: r for r in st2['by_delta']}
print({k: st2[k] for k in ('supS', 'infS', 'A_global', 'sqrt2Arho', 'ratio_global', 'mean_S')}, 'ratio at 1 spacing', b[1]['ratio_lo'], b[1]['ratio_hi'])
print(out['detector_lag_mean_spacings'], out['pairs'], out['fraction_off_line'])
