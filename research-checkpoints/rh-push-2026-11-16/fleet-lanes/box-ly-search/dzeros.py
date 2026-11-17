#!/usr/bin/env python3
"""Float64 screen: zeros of the truncated Dirichlet factor D_N(s) itself to the right of the critical line
(0.52 < Re s < 0.99, 0 < Im s < T), next to the off-axis zeros of the symmetrised object F in the same height
range.  Tests the reading 'F has only real zeros in the strip when |G(s) D_N(s)| > |G(1-s) D_N(1-s)| for
Re s > 1/2' (de Bruijn / Hermite-Biehler dominance).  Also reports the minimum over the grid lines
Re s in {0.52, 0.6, 0.75, 0.99} of log|G(s)D(s)| - log|G(1-s)D(1-s)|.   python dzeros.py <out.jsonl>"""
import json, sys, math
import numpy as np
import fscreen as S
xp = S.xp


class DObj(S.Obj):
    def F(self, z):
        return self.D(0.5 - 1j * z)


CASES = []
import os
for N in (5, 10, 20, 30, 40, 50, 100, 200, 500, 1000, 2000):
    for w in ('riesz1', 'riesz2'):
        CASES += [('afep', 'zeta', N, w), ('afe', 'dh', N, w), ('afe', 'chi4', N, w), ('afep', 'ea:0.25', N, w),
                  ('afep', 'tw2m', N, w)]
    CASES += [('afe', 'zeta', N, 'sharp'), ('afe', 'dh', N, 'sharp'), ('afe', 'chi4', N, 'sharp')]
T = int(sys.argv[2]) if len(sys.argv) > 2 else 2000
if os.environ.get('DZ_SMOKE'):
    CASES = [c for c in CASES if c[2] in (5, 40)]
out = open(sys.argv[1], 'a')
for sch, inp, N, w in CASES:
    try:
        Y = min(0.49, S.ymax(sch, inp))
        d = DObj(sch, inp, N, w)
        rd = S.screen(d, 0.63, T + 0.63, eta=0.02, Y=Y, refine=False)
        o = S.Obj(sch, inp, N, w)
        rf = S.screen(o, 0.63, T + 0.63, eta=0.02, Y=Y)
        mins = {}
        x = 0.63 + xp.arange(int(T / 0.01)) * 0.01
        for sg in (0.52, 0.6, 0.75, 0.5 + Y):
            s = sg + 1j * x
            lr = (S.logG(inp, s).real + xp.log(xp.abs(o.D(s))) - S.logG(inp, 1 - s).real - xp.log(xp.abs(o.D(1 - s))))
            i = int(xp.argmin(lr))
            mins['%.2f' % sg] = [round(float(lr[i]), 4), round(float(x[i]), 2)]
        dz = [b[0] for b in rd['bad'] if b[1] != 0][:6]
        rec = dict(scheme=sch, input=inp, size=N, weight=w, T=T, sigma_window=[0.52, round(0.5 + Y, 2)],
                   D_zeros_right=rd['n_up'], D_zero_heights=dz, F_offaxis=rf['n_up'],
                   F_first_bad=rf['first_bad'], min_log_dominance=mins)
    except Exception as e:                                   # noqa
        rec = dict(scheme=sch, input=inp, size=N, weight=w, error=repr(e))
    out.write(json.dumps(rec, default=float) + '\n')
    out.flush()
    print(json.dumps(rec, default=float), flush=True)
