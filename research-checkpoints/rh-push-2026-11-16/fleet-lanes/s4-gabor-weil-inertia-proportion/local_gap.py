"""DH: windows that contain no off-line zero (the five largest gaps between consecutive off-line pairs below 2000), bandwidth < 1 and = 1:
smallest eigenvalue of the prime-side G on the window placed inside the gap with a margin to the neighbouring pairs."""
import math, json, numpy as np, gw
PI = math.pi
tab = json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))
off = np.array(sorted((float(t), float(b) - 0.5) for b, t, _ in tab['offline']))
on = np.array([float(x) for x in tab['online']])
g = np.diff(off[:, 0]); idx = np.argsort(-g)[:5]
res = []
for i in idx:
    lo, hi = off[i, 0], off[i + 1, 0]
    for lam in (0.6, 0.8, 0.9, 1.0):
        for margin in (0.0, 3.0, 8.0):
            T = 0.5 * (lo + hi); L = lam * math.log(5 * T / (2 * PI)); X = math.exp(L); delta = 2 * PI / L
            a0 = lo + margin; n = int((hi - margin - a0) / delta)
            if n < 4: continue
            G, _ = gw.build_G(gw.family('DH', X), a0, n, X, log=lambda *a: None)
            ev = np.linalg.eigvalsh(G)
            # comparison: CHI5R on the same nodes
            Gc, _ = gw.build_G(gw.family('CHI5R', X), a0, n, X, log=lambda *a: None)
            rec = dict(gap=[lo, hi], depth_neighbours=[off[i, 1], off[i + 1, 1]], lam=lam, margin=margin, n=n, X=X, online_in_window=int(((on > a0) & (on < a0 + n * delta)).sum()),
                       lam_min=float(ev[0]), n_neg=int((ev < 0).sum()), chi5r_lam_min=float(np.linalg.eigvalsh(Gc)[0]))
            res.append(rec); print(json.dumps(rec))
json.dump(res, open('out/local_gap.json', 'w'), indent=1)
