"""DH on [1000, 2000] from its own coefficients (no zero used), against the table of all its zeros below 2000:
which off-line pairs produce an eigenvalue of G below 0 (or below theta), as a function of beta * L."""
import math, json, numpy as np, gw, w3
PI = math.pi
tab = json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))
on = np.array([float(x) for x in tab['online']]); off = np.array([(float(b) - 0.5, float(t)) for b, t, _ in tab['offline']])
res = []
for lam in (0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0):
    T0 = 1000.0; L = lam * math.log(5 * 1500 / (2 * PI)); X = math.exp(L); delta = 2 * PI / L
    n = int(1000 / delta)
    fam = gw.family('DH', X)
    G, parts = gw.build_G(fam, T0, n, X, log=lambda *a: None)
    ev, V = np.linalg.eigh(G)
    lo, hi = T0, T0 + n * delta
    pin = off[(off[:, 1] > lo) & (off[:, 1] < hi)]
    non = int(((on > lo) & (on < hi)).sum())
    # zero-side with all zeros (check) and with on-line zeros only
    y_on = (np.concatenate([on, -on]) - T0) * L / (2 * PI)
    Gon = gw.zero_side_G(y_on, n); evon = np.linalg.eigvalsh(Gon)
    # centre of each eigenvector with eigenvalue below the smallest on-line eigenvalue
    thr = evon[0]
    low = np.nonzero(ev < thr - 1e-9)[0]
    nodes = T0 + delta * np.arange(n)
    cen = [(float(ev[i]), float((V[:, i] ** 2 * nodes).sum())) for i in low]
    match = []
    for e, c in cen:
        j = int(np.argmin(np.abs(pin[:, 1] - c)))
        match.append((round(e, 4), round(c, 2), round(float(pin[j, 1]), 2), round(float(pin[j, 0]), 4), round(float(pin[j, 0] * L), 3)))
    bl = pin[:, 0] * L
    S = np.sinh(bl) / bl
    rec = dict(lam=lam, L=L, X=X, nterms=len(fam['n']), n=n, online=non, pairs=len(pin), n_neg=int((ev < 0).sum()), lam_min=float(ev[0]), lam_min_online_only=float(evon[0]),
               n_below_online_min=len(low), pairs_betaL_gt={str(c): int((bl > c).sum()) for c in (1.0, 1.5, 2.0, 2.5, 3.0)},
               pairs_S_gt_1_plus_1_over_lam=int((S - 1 > 1 / lam).sum()),
               m_prime=[float((ev ** k).mean()) for k in (1, 2)], m_online=[float((evon ** k).mean()) for k in (1, 2)], R_box=1 / lam + lam / 3,
               matches=sorted(match, key=lambda m: m[0])[:12])
    res.append(rec)
    print(json.dumps({k: v for k, v in rec.items() if k != 'matches'}))
    for m in rec['matches'][:8]: print('   eig %.4f centre %.2f | nearest pair height %.2f depth %.4f beta*L %.3f' % m)
json.dump(res, open('out/local_dh.json', 'w'), indent=1)
