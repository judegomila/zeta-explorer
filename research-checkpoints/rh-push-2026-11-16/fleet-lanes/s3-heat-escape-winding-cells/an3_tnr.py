"""Combination 3 on T-NR: the collective certificate bound, local form, against the measured landing times of the T-NR pairs (track_tnr.json).
bound_k = log(1 + 2 kappa_k y0^2)/(4 kappa_k), kappa_k = min over |x - x_k| <= 0.5 of sum over zeta zeros r = +-2 gamma of 1/((x - r)^2 + y0^2)."""
import json, math, numpy as np
from flint import acb, ctx
ctx.prec = 64
g = np.array([float(q.imag.mid()) for q in acb.zeta_zeros(1, 66000)]); r = 2*g
d = json.load(open('out/track_tnr.json')); rows = []
for t in d['results']:
    if 't_star' not in t: continue
    x0, y0 = t['x0'], t['y0']
    if x0 > r[-1] - 300: continue
    xs = x0 + np.linspace(-0.5, 0.5, 41)
    near = r[(r > x0 - 3000) & (r < x0 + 3000)]
    k = (1/((xs[:, None] - near[None, :])**2 + y0*y0)).sum(1)
    # smooth tail beyond 3000 and mirror zeros: positive, omitted (the bound only weakens without them)
    kk = float(k.min()); b = math.log(1 + 2*kk*y0*y0)/(4*kk)
    rows.append(dict(label=t['label'], x0=x0, t_star=t['t_star'], iso=y0*y0/2, kappa_local=kk, bound=b, holds=bool(t['t_star'] <= b), reach=t['reach']))
    print('%-10s x0=%10.3f t*=%.5f  y0^2/2=%.5f  kappa=%.4f  certificate bound=%.5f  holds=%s  reach=%.3f' % (t['label'], x0, t['t_star'], y0*y0/2, kk, b, t['t_star'] <= b, t['reach']))
json.dump(rows, open('out/an3_tnr.json', 'w'), indent=1)
print('all hold:', all(q['holds'] for q in rows), ' max t*/bound', max(q['t_star']/q['bound'] for q in rows))
