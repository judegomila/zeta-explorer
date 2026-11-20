import json, numpy as np, sys
from objects import *
T = json.load(open(sys.argv[1])); X = np.array(T['X'])
for Xc in (1000, 10000, 100000):
    i = int(np.nonzero(X == Xc)[0][0])
    for name, obj, kw, key in [('zeta', 'zeta', {}, 'zeta'), ('Ea', 'Ea', dict(a=0.02), 'Ea0.02'), ('chi5', 'chi5', {}, 'chi5'), ('liouville', 'liouville', {}, 'liouville')]:
        for k in (0, 1, 2):
            o = make(obj, Xc, k, **kw); tr = truth(o['lam'], Xc, k)
            print(Xc, name, k, 'direct', float(np.real(tr)), 'sieve', T['psi'][key][i][k], 'diff', abs(float(np.real(tr)) - T['psi'][key][i][k]))
