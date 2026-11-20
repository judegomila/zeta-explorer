"""Combination 3, maximum-gap corollary: R(x) = half of the largest gap between consecutive real zeros (z units) above x, and the collapse time
S_R = u0/6 + (R^2/9) log(1 + 3 u0/R^2) for u0 = Delta^2 = 1.  Usage: gaps.py <ordinates.npy> <label> <q> <out.json>"""
import sys, json, math
import numpy as np
f, label, q, outp = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
g = np.array(np.load(f, mmap_mode='r'), dtype=np.float64).ravel(); g = g[g > 0]; g.sort()
r = 2*g; d = np.diff(r); mid = 0.5*(r[1:] + r[:-1])
mean = 4*math.pi/np.log(np.maximum(q*mid/(4*math.pi), 1.5))
out = dict(label=label, n=len(r), decades=[], top_norm=[])
S = lambda R, u0=1.0: u0/6 + (R*R/9)*math.log(1 + 3*u0/(R*R))
for e in range(1, 9):
    s = (mid >= 10.0**e) & (mid < 10.0**(e+1))
    if not s.any(): continue
    i = np.argmax(d[s]); j = np.argmax((d/mean)[s])
    Rab = float(d[mid >= 10.0**e].max()/2)
    out['decades'].append(dict(x_lo=10.0**e, n=int(s.sum()), max_gap_z=float(d[s][i]), at=float(mid[s][i]), max_norm_gap=float((d/mean)[s][j]), at_norm=float(mid[s][j]),
                               R_above=Rab, S_R_above=S(Rab), S_over_u0half=S(Rab)/0.5))
o = np.argsort(-(d/mean))[:40]
out['top_norm'] = [(float(mid[i]), float(d[i]), float(d[i]/mean[i])) for i in o]
o = np.argsort(-(d/mean)*(mid < 4000))[:40]
out['top_norm_below_4000'] = [(float(mid[i]), float(d[i]), float(d[i]/mean[i])) for i in o]
json.dump(out, open(outp, 'w'), indent=1); print(json.dumps(out['decades']))
