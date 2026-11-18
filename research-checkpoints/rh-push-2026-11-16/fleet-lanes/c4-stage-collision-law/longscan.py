# prime-only event phi'(t) < 0 for the stage: measured fraction at height T (random t in [T, T+1e6]) against the torus model
# (independent uniform phases; exactly the statistic of every unimodular twist) and the Gaussian tail Q(theta'/sigma_X).
# float64 screen; phases T log p mod 2 pi from mpmath at 60 digits.
import sys, os, json, math, numpy as np, mpmath
from multiprocessing import Pool
from stage import primes_upto
NW = int(os.environ.get('RH_WORKERS', '4'))
def work(a):
    lp, a0, thr, n, seed, torus = a; rng = np.random.default_rng(seed); cnt = 0; mn = 1e9; ch = max(8, int(2e6 / len(lp))); sq = np.exp(-0.5 * lp); done = 0
    while done < n:
        k = min(ch, n - done); done += k
        ph = rng.random((k, len(lp))) * 2 * math.pi if torus else a0[None, :] + (rng.random(k) * 1e6)[:, None] * lp[None, :]
        z = sq[None, :] * np.exp(-1j * ph); d = (lp[None, :] * z / (1 - z)).real.sum(axis=1)
        cnt += int((d > thr).sum()); mn = min(mn, float((thr - d).min()))
    return cnt, mn
if __name__ == '__main__':
    res = []; pool = Pool(NW)
    for T in [1e5, 1e6, 1e7, 1e8, 1e10, 1e12, 1e16, 1e20]:
        for a in [0.2, 0.25, 0.3, 0.4, 0.5]:
            X = T ** a
            if X > 1.5e5: continue
            pr = primes_upto(X); lp = np.log(pr.astype(float)); mpmath.mp.dps = 60; tw = 2 * mpmath.pi
            a0 = np.array([float(mpmath.fmod(mpmath.mpf(T) * mpmath.log(int(p)), tw)) for p in pr])
            thr = 0.5 * math.log(T / (2 * math.pi)); n = 4000000 if len(pr) <= 1500 else 400000
            sig = math.sqrt(0.5 * float(np.sum(lp ** 2 / (pr - 1)))); u = thr / sig; Q = 0.5 * math.erfc(u / math.sqrt(2))
            print('planned memory per worker: %d x %d complex x ~4 arrays = %.0f MB' % (max(8, int(2e6 / len(pr))), len(pr), 4 * 16e-6 * max(8, int(2e6 / len(pr))) * len(pr)), flush=True)
            out = {}
            for torus in (0, 1):
                r = pool.map(work, [(lp, a0, thr, n // 16, 1000 * torus + i + int(a * 100), torus) for i in range(16)])
                out[torus] = (sum(x[0] for x in r) / (16 * (n // 16)), min(x[1] for x in r))
            row = {'T': T, 'a': a, 'X': X, 'nprimes': len(pr), 'n': n, 'theta_prime': thr, 'sigma_X': sig, 'u': u, 'gauss_Q': Q, 'trivial_max': float(np.sum(lp / (np.sqrt(pr) - 1))),
                   'frac_zeta': out[0][0], 'frac_torus': out[1][0], 'min_phi_prime_zeta': out[0][1], 'min_phi_prime_torus': out[1][1]}
            res.append(row); print(json.dumps(row), flush=True)
    json.dump(res, open('longscan.json', 'w'), indent=1)
