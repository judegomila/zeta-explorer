"""heat_zero.py -- zero-side Poisson strength for the backward heat controls (no Dirichlet series) from the battery zero tables
(height 2000): P(T; a) = sum over on-line zeros a/((T-g)^2+a^2) + sum over off-line pairs b + ig, -b + ig of
(a-b)/((T-g)^2+(a-b)^2) + (a+b)/((T-g)^2+(a+b)^2), a = sqrt(q)/2, T in [20, 1900] step 0.01. Zeros above 2000 omitted."""
import json, math, numpy as np, os
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
F = {'ZETA': P + '/c12-control-battery-harness/tables/zeros_ZETA.json', 'HEAT--0.1': P + '/c12-control-battery-harness/tables/zeros_HEAT--0.1.json',
     'HEAT--0.5': P + '/c13-repair-map-engine-battery-records/records_corrected/zeros_HEAT--0.5.corrected.json'}
QS = [0.5625, 0.36, 0.25, 0.16, 0.09, 0.04, 0.0225, 0.01]
T = np.arange(20, 1900, 0.01); out = {}
for code, fn in F.items():
    d = json.load(open(fn)); on = np.array([float(g) for g in (d['gamma'] if code == 'ZETA' else d['online'])])
    off = np.array([[float(o[0]), float(o[1])] for o in d.get('offline', [])]).reshape(-1, 2)
    for q in QS:
        a = math.sqrt(q) / 2; Pv = np.zeros(len(T))
        for g in on: Pv += a / ((T - g) ** 2 + a * a)
        for b, g in off: Pv += (a - b) / ((T - g) ** 2 + (a - b) ** 2) + (a + b) / ((T - g) ** 2 + (a + b) ** 2)
        neg = np.flatnonzero(Pv < 0); right = off[off[:, 0] > a] if len(off) else off
        out[f"{code}|{q}"] = dict(minP=float(Pv.min()), T_minP=float(T[int(np.argmin(Pv))]), frac_neg=float(len(neg) / len(T)), first_T_neg=float(T[neg[0]]) if len(neg) else None,
                                  first_pair_right_of_sigma=[float(right[:, 1].min()), float(right[np.argmin(right[:, 1]), 0])] if len(right) else None, pairs_right=int(len(right)))
        r = out[f"{code}|{q}"]; print(code, q, f"minP {r['minP']:.2f} at {r['T_minP']:.2f}; first T with P<0: {r['first_T_neg']}; first pair with Re z > a: {r['first_pair_right_of_sigma']}; pairs right {r['pairs_right']}")
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'heat_zero.json'), 'w'), indent=0)
