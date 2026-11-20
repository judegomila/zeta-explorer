"""Combination (1), zero-side model of an off-line quadruple in the Fejer statistic.
D_F^planted(x, t) = D_F^zeta(x, t) + sum over the 4 planted zeros rho of L Re k((rho - s) L),  k(u) = (e^u - 1 - u)/u^2   (val_fejer.py).
For each height window (raw points of echo.py) and each checkpoint P, the pair (delta, gamma) is planted at gamma = t_max + d and the
largest distance d ("lead") at which some sampled (x, t) has D_F^planted <= 0 is found on a geometric grid of d.
Prediction: negative iff e^((delta - x) L)/(L ((delta - x)^2 + d^2)) exceeds the positive part, i.e. lead ~ P^((delta - x)/2)/sqrt(L D_F).
usage: c1_planted.py <echo_raw.npz> <out.json>"""
import sys, json, math, numpy as np
import echo
z = np.load(sys.argv[1]); X = echo.X; out = []
def kq(x, t, de, ga, L):
    tot = 0.0
    for sr in (de, -de):
        for sg in (ga, -ga):
            u = ((sr - x[None, :]) + 1j * (sg - t[:, None])) * L
            with np.errstate(over='ignore', invalid='ignore'):
                tot = tot + (L * (np.exp(u) - 1 - u) / (u * u)).real
    return tot
Hs = sorted({k[2:] for k in z.files if k.startswith('t_')}, key=float)
cks = sorted({float(k.split('|')[2]) for k in z.files if '|ZETA:fejer+pole|' in k})
ds = np.geomspace(0.05, 1e5, 127)
for H in Hs:
    t = z['t_' + H]
    for c in cks:
        D = z['%s|ZETA:fejer+pole|%g' % (H, c)]; L = math.log(c)
        for de in (0.3085, 0.1, 0.03):
            lead = 0.0
            for d in ds:
                v = D + kq(X, t, de, t[-1] + d, L)
                if (v <= 0).any(): lead = d
            pred = math.exp((de - X[0]) * L / 2) / math.sqrt(L * np.median(D[:, 0]))
            out.append(dict(H=float(H), P=c, delta=de, lead=float(lead), predicted_scale=pred, median_DF_at_xmin=float(np.median(D[:, 0])), min_DF=float(D.min())))
json.dump(out, open(sys.argv[2], 'w'), indent=1)
print('lead d (distance from the window to the planted ordinate at which the Fejer statistic is still negative somewhere); rows: height, columns: P')
for de in (0.3085, 0.1, 0.03):
    print('delta = %g' % de); print('height    ' + ''.join('%22s' % ('%g' % c) for c in cks))
    for H in Hs:
        print('%-10s' % H + ''.join('%22s' % ('%.3g (pred %.3g)' % (r['lead'], r['predicted_scale'])) for r in out if r['H'] == float(H) and r['delta'] == de))
