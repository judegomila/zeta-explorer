import numpy as np, json, math
import combo1
g = np.load('../../s1-zero-flow-dynamics/data/zeta_1e7.npy')
from flint import acb, arb, ctx, acb_series
import core
ctx.prec = 160
z = json.load(open('../../c12-control-battery-harness/tables/zeros_ZETA.json'))['gamma']; obj = core.by_code('ZETA')
Vex = []
for gs in z[:1500:50]:
    s = acb_series([acb(arb(1) / 2, arb(gs)), 1], prec=3); F = obj.completed(s); Vex.append(float((acb(0, 1) * F[2] / F[1]).real.mid()))
for M in (2000, 20000):
    V = combo1.V_list(g, 0, 1500, M)[::50]
    print('M', M, 'max |V_list - V_exact| over zeros 1,51,...,1451: %.2e' % np.abs(V - np.array(Vex)).max(), 'first', V[:3], Vex[:3])
