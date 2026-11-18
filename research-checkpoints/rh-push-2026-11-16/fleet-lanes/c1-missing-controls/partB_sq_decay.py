"""Decay of Theta_{tau,omega}(x + i t) = F_tau(x+it-omega)/F_tau(x+it+omega) to the right (causality of the kernel). MEASURED."""
import json
from heatlib import *
H = Heat(700, 80.0); out = {}
for tau in (0.0, -0.1, -0.5, -2.0):
    for om in (0.1, 0.25):
        row = []
        for x in (5.0, 10.0, 20.0, 40.0, 80.0):
            for t in (0.0, 30.0):
                v = float(abs(H.F(tau, acb(x - om, t)) / H.F(tau, acb(x + om, t))).mid()); row.append(round(v, 6))
        out['tau=%g,omega=%g' % (tau, om)] = row; print(tau, om, row, flush=True)
json.dump(dict(points='x in (5,10,20,40,80) x t in (0,30)', values=out), open('partB_sq_decay.json', 'w'), indent=1)
