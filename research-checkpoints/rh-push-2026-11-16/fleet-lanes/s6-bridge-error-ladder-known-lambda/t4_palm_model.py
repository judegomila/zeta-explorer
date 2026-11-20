"""Finite-gap GUE model for the Palm density of test 4: density of a third point at u given a pair at -s/2, +s/2 of the sine process,
rho(u | s) = det[K(x_i - x_j)]_{3x3} / det[K]_{2x2}, K = sinc, averaged over the gap law p(s) ~ s^2 on (0, smax) and over each bin.
Compares the empirical densities stored by t4_zero.py with this model and with the s -> 0 limit 1 - S^2 - 3 S'^2 / pi^2."""
import json, sys, math, numpy as np
K = np.sinc
def rho(u, s):
    a = K(s); b = K(u + s / 2); c = K(u - s / 2)
    det3 = 1 + 2 * a * b * c - a * a - b * b - c * c
    return det3 / (1 - a * a)
def model(smax, nb=120, lo=-6.0, hi=6.0):
    edges = np.linspace(lo, hi, nb + 1); sub = (np.arange(20) + 0.5) / 20
    u = (edges[:-1, None] + (edges[1] - edges[0]) * sub[None, :])
    sg = (np.arange(200) + 0.5) / 200 * smax; w = sg ** 2; w /= w.sum()
    return sum(wi * rho(u, si).mean(1) for wi, si in zip(w, sg))
m02 = model(0.2); m01 = model(0.1)
bc = np.linspace(-6, 6, 121); bc = 0.5 * (bc[1:] + bc[:-1]); core = np.abs(bc) < 3
print('model deficits on [-6, 6]: s < 0.2: %.4f ; s < 0.1: %.4f ; limit s -> 0: 1.9325' % ((1 - m02).sum() * 0.1, (1 - m01).sum() * 0.1))
out = {}
for fn in sys.argv[1:]:
    d = json.load(open(fn)); 
    for p in d['palm']:
        if not p.get('pairs'): continue
        emp = np.array(p['density']); m = m01 if p['label'] == 's < 0.1' else m02
        r = dict(pairs=p['pairs'], rms_to_finite_gap_model=float(np.sqrt(((emp - m)[core] ** 2).mean())), rms_to_limit=p['l2_to_palm2'], noise=p['stat_err'],
                 deficit=p['deficit_6'], deficit_model=float((1 - m).sum() * 0.1), chi2_per_bin=float((((emp - m)[core]) ** 2 / (np.maximum(m[core], 1e-3) / (p['pairs'] * 0.1))).mean()))
        out['%s | %s' % (d['name'], p['label'])] = r
        print('%-12s %-62s pairs %7d: rms distance to the finite-gap model %.4f (to the limit %.4f; noise %.4f); deficit %.3f (model %.3f)' % (d['name'], p['label'][:62], p['pairs'], r['rms_to_finite_gap_model'], r['rms_to_limit'], r['noise'], r['deficit'], r['deficit_model']))
json.dump(out, open('out/t4_palm_model.json', 'w'), indent=1)
