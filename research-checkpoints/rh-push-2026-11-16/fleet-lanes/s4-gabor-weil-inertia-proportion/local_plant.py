"""Planted pair in zeta's prime-side G (T = 1e4 and 1e6, n = 700): smallest beta*L at which the matrix gets an eigenvalue below 0,
and below half of zeta's smallest eigenvalue, for 24 positions of the pair. Zero-side term of the pair: 2 Re(w w^T), w(a) = sinc(pi (y0 - i b - a)), b = beta L / 2 pi."""
import math, json, numpy as np, gw
PI = math.pi
rng = np.random.default_rng(3); res = []
for T in (1e4, 1e6):
    for lam in (0.3, 0.5, 0.65, 0.8, 0.9):
        L = lam * math.log(T / (2 * PI)); X = math.exp(L); n = 700
        G, _ = gw.build_G(gw.family('ZETA', X), T, n, X, log=lambda *a: None)
        ev0 = np.linalg.eigvalsh(G); a = np.arange(n)
        def lmin(y0, bL):
            w = gw.sinc_c(y0 - 1j * bL / (2 * PI) - a)
            return np.linalg.eigvalsh(G + 2 * (np.outer(w, w)).real)[0]
        out = {0.0: [], 0.5 * ev0[0]: []}
        for y0 in rng.uniform(150, 550, size=24):
            for th in out:
                lo, hi = 0.0, 12.0
                for _ in range(14):
                    mid = (lo + hi) / 2
                    if lmin(y0, mid) < th: hi = mid
                    else: lo = mid
                out[th].append(hi)
        ks = list(out)
        S = lambda x: math.sinh(x) / x
        rec = dict(T=T, lam=lam, L=L, X=X, zeta_lam_min=float(ev0[0]), zeta_lam_max=float(ev0[-1]),
                   betaL_neg=[float(np.min(out[ks[0]])), float(np.median(out[ks[0]])), float(np.max(out[ks[0]]))],
                   betaL_half=[float(np.min(out[ks[1]])), float(np.median(out[ks[1]])), float(np.max(out[ks[1]]))])
        rec['beta_neg_median'] = rec['betaL_neg'][1] / L; rec['S_minus_1_at_median'] = S(rec['betaL_neg'][1]) - 1
        res.append(rec); print(json.dumps(rec), flush=True)
json.dump(res, open('out/local_plant.json', 'w'), indent=1)
