# HEURISTIC Lambda estimate: float replay of the F2 rate sequence with each rate multiplied by the interpolated per-cell gain.
import json, math, numpy as np
path = json.load(open('f2_path.json')); G = json.load(open('gain_ratios.json')); rows = json.load(open('lp50.json'))
ks = np.array(G['k'], float); dl = 1/512000
def replay(fac):
    q = 0.5625001
    for k, (_, c) in enumerate(path):
        c = c*fac(k); nq = (q + 2/c)*math.exp(-c*dl) - 2/c
        if nq <= 1e-8: return k*dl + math.log(1 + c*(q-1e-8)/(2+c*1e-8))/c + 5e-9
        q = nq
    # ran out of recorded substeps: continue with the last rate
    while True:
        k += 1; nq = (q + 2/c)*math.exp(-c*dl) - 2/c
        if nq <= 1e-8: return k*dl + math.log(1 + c*(q-1e-8)/(2+c*1e-8))/c + 5e-9
        q = nq
print('control (factor 1): %.9f' % replay(lambda k: 1.0))
out = {}
for name in ['m', 'hge_pos', 'free_pos', 'free_signed3', 'free_signed']:
    g = np.array(G[name]); out[name] = replay(lambda k: float(np.interp(k, ks, g)))
    print('%-13s per-cell factors %.3f..%.3f  -> Lambda model %.6f' % (name, g.min(), g.max(), out[name]))
ce = np.array([r['ceiling']/r['E_F2'] for r in rows]); out['ceiling'] = replay(lambda k: float(np.interp(k, ks, ce)))
print('ceiling ratio %.3f..%.3f -> %.6f' % (ce.min(), ce.max(), out['ceiling']))
# ODE at the class ceiling: y' = -L coth(yL)  => T = log cosh(y0 L)/L^2
L = math.log(6000000185827/(4*math.pi))/4; print('closed form ceiling time log cosh(0.75 L)/L^2 = %.6f' % (math.log(math.cosh(0.75*L))/L**2))
# with alignment bonus at small t only (t=0 proved part has no effect on Lambda by itself)
json.dump(out, open('lambda_est.json', 'w'))
# conservative variant: gain measured against the model value of the F2 configuration (same model on both sides), applied to the certified F2 rates
m = np.array(G['m'])
for name in ['free_pos', 'free_signed3']:
    g = np.array(G[name])/m; out[name + '_vs_model'] = replay(lambda k: float(np.interp(k, ks, g)))
    print('%-13s / model-F2  factors %.3f..%.3f median %.3f -> Lambda model %.6f' % (name, g.min(), g.max(), np.median(g), out[name + '_vs_model']))
json.dump(out, open('lambda_est.json', 'w'))
