import json, math, subprocess, sys
import numpy as np
from flint import acb, arb, ctx
import hk
ctx.prec = 64
per = 4*math.pi/math.log(hk.TNR_Q); k = 175
pL, pR = (k + 0.5)*per, (k + 1.5)*per
n0 = int(arb(pL/2 - 6).zeta_nzeros().unique_fmpz())
z = 2*np.array([float(q.imag.mid()) for q in acb.zeta_zeros(n0 + 1, 40)])
mid = 0.5*(z[:-1] + z[1:]); gap = np.diff(z)
c = [(m, g) for m, g in zip(mid, gap) if pL + 1.2 < m < pR - 1.2]
wl = c[0][0]; wr = c[-1][0]
cnt = int(((z > wl) & (z < wr)).sum())
res = dict(kind='tnr', pairs_z=[pL, pR], y0=2*math.acosh(hk.TNR_C/2)/math.log(hk.TNR_Q), window_z=[wl, wr], zeta_zeros_in_window=cnt, walls=[])
for xw, tag in ((wl, 'tnr_L'), (wr, 'tnr_R'), (pL, 'tnr_through_pair')):
    out = 'out/c4wall_%s.json' % tag
    subprocess.run([sys.executable, 'window.py', 'wall', 'tnr', repr(float(xw)), out, 'fine'], check=True, stdout=subprocess.DEVNULL)
    d = json.load(open(out)); res['walls'].append(dict(tag=tag, xw=float(xw), R_min=d['R_min'], at=d['at'], real_axis_sign_constant=d['real_axis_sign_constant']))
json.dump(res, open('out/c4_tnr.json', 'w'), indent=1); print(json.dumps(res))
