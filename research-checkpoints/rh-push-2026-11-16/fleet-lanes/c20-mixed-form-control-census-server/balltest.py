# control (ii): float stage against ball stage at a small cell, all classes with a ball implementation
import json, math, numpy as np, mixed, mixed_ball
t, th, w = 1e4, 0.95, 1
objs = [('zeta',), ('EA',), ('DEL',), ('HQ2',), ('HQ3',), ('HQ4',), ('LIOU',), ('TNR',), ('DH',), ('chain', 3), ('haar', 2)]
recs, sec = mixed.job((t, th, w, None, objs, None))
pts = []
for r in recs:
    pts.append({'t': t, 'theta': th, 'w': w, 'obj': r['obj'], 'tau': r['tau_min'], 'float_T2n': r['m'], 'float_T1n': r['T1n_at_min']})
for p in pts:
    for prec in (128, 256):
        p['prec'] = prec
        o = mixed_ball.work(p)
        print(o['obj'], prec, 'T2n ball %.15g rad %.2e float-ball %.2e | T1n float-ball %.2e' % (o['T2n'], o['T2n_rad'], o['float_T2n'] - o['T2n'], o['float_T1n'] - o['T1n']), o['sign2'], 'sec %.1f' % o['sec'], flush=True)
