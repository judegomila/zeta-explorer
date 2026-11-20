"""Combination (4), DH: excess of the prime-side remainder (on-line frozen block only) over the Lorentzian field of the off-line
pairs, as a function of the distance d below the first off-line pair (b = 0.3085, gamma = 85.699) and of X.
Prediction (one pair, zero to the right of the line): 2 Re[-Phi(rho - s)/(s - rho)] with |.| = X^(b-x) e^(-eta(b-x)) |betahat(eta(b-x+id))| / |b-x+id|."""
import json, math, os, sys
import numpy as np
import explib, explicit_an as ea
HERE = os.path.dirname(os.path.abspath(__file__))
Z = json.load(open(os.path.join(HERE, 'zeros_DH.json')))
on = np.array([float(v) for v in Z['online']]); off = np.array([[float(r[0]) - 0.5, float(r[1])] for r in Z['offline']])
g_on = np.concatenate([on, -on]); b_on = np.zeros(len(g_on))
g_off = np.concatenate([off[:, 1], off[:, 1], -off[:, 1], -off[:, 1]]); b_off = np.concatenate([off[:, 0], -off[:, 0], off[:, 0], -off[:, 0]])
b1, g1 = off[0]
out = []
for Xs in ('1e4', '1e5', '1e6', '1e7'):
    S, xs, t, m = ea.load('ex_DH_X' + Xs); X = m['X']; eta = m['eta']
    for i, x in enumerate(xs):
        sel = np.nonzero((t >= 5) & (t <= 84.5))[0]; ts = t[sel]; s = 0.5 + x + 1j * ts
        AX = (-S[i][sel] + explib.gamma_part('DH', s, X, eta)).real
        tail = x * 2 * (math.log(5 * 2000 / (2 * math.pi)) + 1) / (2 * math.pi * 2000)
        rem = AX - explib.zero_kernel(x, ts, b_on, g_on, X, eta).real - tail
        exc = rem - explib.lorentz(x, ts, b_off, g_off).real
        row = dict(X=X, x=float(x), b_minus_x=float(b1 - x))
        for lo, hi in ((1.5, 3), (4, 6), (8, 12), (16, 24), (32, 48), (60, 80)):
            k = (g1 - ts >= lo) & (g1 - ts <= hi)
            d = 0.5 * (lo + hi); z = eta * ((b1 - x) + 1j * d)
            pred = math.exp((math.log(X) - eta) * (b1 - x)) * abs(explib.betahat(np.array([z]))[0]) / abs((b1 - x) + 1j * d)
            row['d_%g_%g' % (lo, hi)] = dict(max_abs_excess=float(np.abs(exc[k]).max()), predicted_envelope=float(pred), lorentz_field=float(np.abs(explib.lorentz(x, ts[k], b_off, g_off).real).max()))
        for thr in (1e-2, 1e-3, 1e-4):
            big = np.abs(exc) > thr
            row['reach_%g' % thr] = float((g1 - ts[big]).max()) if big.any() else 0.0
        out.append(row)
        print('X=%s x=%.2f' % (Xs, x), ' '.join('%s: %.2e (pred %.2e)' % (k, v['max_abs_excess'], v['predicted_envelope']) for k, v in row.items() if k.startswith('d_')),
              '| reach(1e-2,1e-3,1e-4) = %.1f %.1f %.1f' % (row['reach_0.01'], row['reach_0.001'], row['reach_0.0001']))
json.dump(out, open(os.path.join(HERE, 'out', 'dh_reach.json'), 'w'), indent=1)
