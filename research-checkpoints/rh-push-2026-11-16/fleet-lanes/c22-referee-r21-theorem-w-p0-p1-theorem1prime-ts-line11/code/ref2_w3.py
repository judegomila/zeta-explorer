# Diagnostic for the scan: dependence on k0 at fixed K0, and the pair count against its expectation. float64 screen.
import json, os, math, numpy as np
from multiprocessing import Pool
from ref2_w import lam_model, bhat_np
WD = 19.0   # main lobe of bhat ends at 6 pi
def one(args):
    name, K0, k0, n0, n1 = args
    lk0 = float(lam_model(name, k0)); out = []
    for n in range(n0, n1):
        om = n*lk0
        kmax = int((om + 400.0)**(2/3)) + 3
        k = np.arange(K0+1, kmax+1); lam = lam_model(name, k)
        m0 = np.maximum(np.rint(om/lam), 1.0)
        E = 0.0; cnt = 0; big = 0.0; rho = 0.0
        for dm in (-2, -1, 0, 1, 2):
            m = m0 + dm; ok = (m >= 1) & ~((k == k0) & (m == n))
            d = om - m*lam
            t = np.where(ok, lam*bhat_np(d), 0.0)
            E += float(t.sum()); cnt += int(np.sum(ok & (np.abs(d) < WD)))
            j = int(np.argmax(t))
            if t[j] > big: big = float(t[j]); rho = float(lam[j]/lk0)
        exp = float(np.sum(2*WD/lam[lam <= om]))
        out.append((E/lk0, cnt, exp, big/lk0, rho))
    return out
def run(name, K0, k0, N, workers):
    ch = [(name, K0, k0, a, min(a+20, N+1)) for a in range(1, N+1, 20)]
    with Pool(workers) as p: res = [v for c in p.map(one, ch) for v in c]
    a = np.array(res); bad = a[:, 0] > 0.25
    return dict(model=name, K0=K0, k0=k0, N=N, good_quarter=float(np.mean(~bad)), frac_with_pair_within_19=float(np.mean(a[:, 1] > 0)),
                mean_pairs_within_19=float(a[:, 1].mean()), expected_pairs=float(a[:, 2].mean()),
                bad_and_no_pair=float(np.mean(bad & (a[:, 1] == 0))),
                median_rho_of_largest_term_among_bad=float(np.median(a[bad, 4])) if bad.any() else None,
                frac_bad_with_rho_lt_2=float(np.mean(a[bad, 4] < 2)) if bad.any() else None)
if __name__ == '__main__':
    w = int(os.environ.get('RH_WORKERS', '4')); rows = []
    for (K0, k0, N) in [(10000, 10001, 1000), (10000, 10007, 1000), (10000, 10103, 1000), (10000, 12007, 1000), (2500, 2503, 1000), (40000, 40001, 400), (40000, 40127, 400)]:
        r = run('k15g', K0, k0, N, w); rows.append(r); print(r, flush=True)
    json.dump(rows, open('w3.json', 'w'), indent=1); print('DONE')
