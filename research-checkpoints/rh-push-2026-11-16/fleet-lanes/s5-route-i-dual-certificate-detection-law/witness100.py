"""Witness of the planted quadruple at gamma0 = 100 (whole low band): where the spectral mass |ghat|^2 sits."""
import math, numpy as np
from symlib import *
o = make_object('ZETA', math.exp(3.4) + 1)
for b, twoa, g0 in ((0.4, 2.95, 100.0), (0.1, 3.1, 100.0), (0.01, 3.75, 100.0), (0.4, 2.95, 101.1)):
    a = twoa / 2
    w, nu, vec, rank = lam_min(with_planted(o, g0, b), a, 140.0, 2.0, want_vec=True)
    c = vec[:, 0]
    t = np.linspace(-400, 400, 160001); dt = t[1] - t[0]
    d = t[:, None] - nu[None, :]
    with np.errstate(all='ignore'): S = np.where(np.abs(d) < 1e-12, 2 * a, 2 * np.sin(d * a) / d)
    g2 = (S @ c) ** 2; tot = g2.sum() * dt
    m = lambda lo, hi: g2[(t >= lo) & (t <= hi)].sum() * dt / tot
    print('b %.2f 2a %.2f gamma0 %.1f: lambda_min % .3e ; mass within 20 of +gamma0 %.3f, of -gamma0 %.3f ; |t| < 60: %.3f ; |t| > 140: %.3f' % (
        b, twoa, g0, w[0], m(g0 - 20, g0 + 20), m(-g0 - 20, -g0 + 20), m(-60, 60), m(140, 400) + m(-400, -140)))
