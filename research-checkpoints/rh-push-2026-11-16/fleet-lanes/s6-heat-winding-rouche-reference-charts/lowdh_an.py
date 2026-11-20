"""Analysis of lowdh.py output: per box [x, x+1] (x integer, 200 <= x < 3991), margin 1 - max |f Qinv - 1| over the levels >= y0 and the
9 box points; boxes classified by distance to twice the ordinate of the nearest off-line Davenport-Heilbronn zero (table to gamma = 2000)."""
import sys, json, glob
import numpy as np
Z = json.load(open('../s3-heat-escape-winding-cells/zeros_DH.json'))['offline']
zx = np.array([2 * float(z[1]) for z in Z]); zy = np.array([2 * float(z[0]) - 1 for z in Z])
LV = [0.03, 0.1809, 0.36, 0.6, 1.0]
out = {}
tags = sorted(set(f.split('/')[-1].rsplit('_', 1)[0] for f in glob.glob('out_lowdh/*.npz')))
for tag in tags:
    parts = [np.load(f) for f in sorted(glob.glob('out_lowdh/%s_*.npz' % tag), key=lambda f: int(f[:-4].rsplit('_', 1)[1]))]
    d = {k: np.concatenate([p[k][:-1] if i < len(parts) - 1 else p[k] for i, p in enumerate(parts)]) for k in parts[0].files}
    class _D(dict):
        files = property(lambda self: list(self.keys()))
    d = _D(d)
    LVs = sorted(float(k[2:]) for k in d if k.startswith('f_'))
    x = d['x']; nb = (len(x) - 1) // 8
    refs = sorted(set(k.rsplit('_', 1)[0] for k in d.files if k not in ('x',) and not k.startswith('f_')))
    bx = x[0] + np.arange(nb)
    dist = np.array([np.min(np.maximum(0, np.maximum(b - zx, zx - (b + 1)))) for b in bx])     # distance from the box to the nearest 2 gamma_off
    res = {}
    for r in ['B0'] + refs:
        for i0, y0 in ((0, 0.03), (1, 0.1809)):
            sup = np.zeros(nb)
            for y in [v for v in LVs if v >= y0 - 1e-9]:
                f = d['f_%g' % y]; g = f * (d['%s_%g' % (r, y)] if r != 'B0' else 1.0)
                a = np.abs(g - 1)
                sup = np.maximum(sup, np.maximum(a[:nb * 8].reshape(nb, 8).max(1), a[8:8 * nb + 8:8]))
            mar = 1 - sup; far = dist > 5; near = dist == 0
            res['%s|y0=%g' % (r, y0)] = dict(boxes=int(nb), cert=float((mar > 0).mean()), n_far=int(far.sum()), cert_far=float((mar[far] > 0).mean()),
                                             n_zero_box=int(near.sum()), cert_zero_box=float((mar[near] > 0).mean()) if near.any() else None,
                                             cert_by_third=[float((mar[k * nb // 3:(k + 1) * nb // 3] > 0).mean()) for k in range(3)],
                                             cert_far_by_third=[float((mar[k * nb // 3:(k + 1) * nb // 3][far[k * nb // 3:(k + 1) * nb // 3]] > 0).mean()) for k in range(3)])
    out[tag] = res
    for k, v in res.items(): print(tag, k, json.dumps(v))
json.dump(out, open('lowdh_summary.json', 'w'), indent=0)
