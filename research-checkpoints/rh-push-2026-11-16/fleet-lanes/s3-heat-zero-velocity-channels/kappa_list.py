"""Combination 3, list form: kappa_k = S1^2 + 3 S2 at every on-line zero from the ordinate list alone
(S1 = sum_{j != k} 1/(g_k - g_j), S2 = sum 1/(g_k - g_j)^2; J neighbours each side + density tails).  PROVED identity for a
function whose zeros are all on the line; a list of real ordinates gives kappa > 0 by construction, so this run measures the
size of kappa in units of the squared density, not its sign.  float64.
Usage: kappa_list.py LIST.npy NMAX OUT.json"""
import sys, os, json, math, numpy as np
from multiprocessing import Pool
path = sys.argv[1]; NMAX = int(float(sys.argv[2])); J = 200; NW = int(os.environ.get('RH_WORKERS', '4'))
def job(ab):
    a, b = ab
    g = np.load(path, mmap_mode='r'); x = np.asarray(g[a - J:b + J], dtype=np.float64); c = x[J:-J]
    S1 = np.zeros(b - a); S2 = np.zeros(b - a)
    for j in range(1, J + 1):
        dm = c - x[J - j:len(x) - J - j]; dp = x[J + j:len(x) - J + j] - c
        S1 += 1 / dm - 1 / dp; S2 += 1 / (dm * dm) + 1 / (dp * dp)
    rho = np.log(c / (2 * math.pi)) / (2 * math.pi)
    dM = dm + 0.5 / rho; dP = dp + 0.5 / rho
    S2 += rho * (1 / dM + 1 / dP); S1 += rho * np.log(dP / dM) - math.pi / 4      # -pi/4: smooth part (Gamma factor and far zeros)
    kap = S1 * S1 + 3 * S2; u = kap / rho ** 2
    i = int(np.argmin(u))
    return {'a': a, 'b': b, 'min_u': float(u[i]), 'argmin': a + i, 'gamma_at_min': float(c[i]), 'kap_at_min': float(kap[i]),
            'neg': int((kap <= 0).sum()), 'hist': np.histogram(u, bins=np.linspace(0, 400, 401))[0].tolist(), 'over': int((u >= 400).sum()),
            'mean_u': float(u.mean()), 'mean_S1sq_share': float((S1 * S1 / kap).mean()),
            'head': [c[:12000].tolist(), kap[:12000].tolist(), S1[:12000].tolist()] if a == J else None}
if __name__ == '__main__':
    g = np.load(path, mmap_mode='r'); N = min(len(g) - J, NMAX)
    CH = 1000000; print('zeros %d ; chunk %d ; planned memory per worker %.2f GB' % (N - J, CH, CH * 8 * 10 / 1e9), flush=True)
    with Pool(NW) as p: res = p.map(job, [(a, min(a + CH, N)) for a in range(J, N, CH)], chunksize=1)
    hist = np.sum([r['hist'] for r in res], axis=0); tot = hist.sum() + sum(r['over'] for r in res)
    cum = np.cumsum(hist) / tot
    best = min(res, key=lambda r: r['min_u'])
    out = {'zeros': int(tot), 'J': J, 'negative': int(sum(r['neg'] for r in res)), 'min_kappa_over_rho2': best['min_u'], 'argmin_index': best['argmin'],
           'gamma_at_min': best['gamma_at_min'], 'kappa_at_min': best['kap_at_min'],
           'quantiles_kappa_over_rho2': {str(q): float(np.searchsorted(cum, q)) for q in (0.001, 0.01, 0.1, 0.5, 0.9, 0.99)},
           'mean_kappa_over_rho2': float(np.sum([r['mean_u'] * (r['b'] - r['a']) for r in res]) / tot),
           'mean_S1sq_share': float(np.mean([r['mean_S1sq_share'] for r in res])),
           'per_decade_min': [[r['a'], r['min_u'], r['gamma_at_min']] for r in res[::max(1, len(res) // 20)]], 'head': res[0]['head']}
    json.dump(out, open(sys.argv[3], 'w'))
    print({k: v for k, v in out.items() if k not in ('head', 'per_decade_min')}, flush=True)
