"""Real zeros (refined) of the backward heat function F_tau(i t), tau=-0.5, t in [1,230]; off-line zeros are copied from
c1-missing-controls/partB_heat_zeros.json.  MEASURED (arb used as multiprecision float)."""
import sys, json, os, re
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'c1-missing-controls'))
from heatlib import *
tau = float(sys.argv[1]); a, b = 1.0, 230.0
H = Heat(500, 240.0)
step = 0.02; n = int(round((b - a) / step)); zs = []; prev = None; pt = None
for i in range(n + 1):
    t = a + i * step; v = H.Freal_axis(tau, t); s = 1 if v.mid() > 0 else -1
    if prev is not None and s != prev:
        lo, hi, slo = pt, t, prev
        for _ in range(40):
            m = 0.5 * (lo + hi); sm = 1 if H.Freal_axis(tau, m).mid() > 0 else -1
            if sm == slo: lo = m
            else: hi = m
        zs.append(0.5 * (lo + hi))
    prev = s; pt = t
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'c1-missing-controls', 'partB_heat_zeros.log')).read()
off = []
for line in src.splitlines():
    if line.startswith('{"tau": %s, "window": [1.0, 230.0]' % tau):
        d = json.loads(line.split(' elapsed')[0])
        for o in d['offline_upper_right']:
            f = lambda s: float(re.match(r'\[([0-9.]+)', s).group(1))
            off.append([f(o['delta']), f(o['gamma'])])
json.dump(dict(tau=tau, window=[a, b], real=zs, offline=off), open('heat_zeros_tau%s.json' % tau, 'w'))
print('real', len(zs), 'offline pairs', len(off), 'total', len(zs) + 2 * len(off))
