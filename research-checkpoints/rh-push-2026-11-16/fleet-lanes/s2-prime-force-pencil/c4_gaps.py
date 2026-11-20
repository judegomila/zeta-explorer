"""Combination 4, angular-gap law: phases t log p mod 2 pi (primes p <= PMAX) sorted on the circle, gaps normalised to mean 1,
pooled over 1500 heights t; t = zeta ordinates near T against uniform random heights in the same range. Statistics: Kolmogorov distance
of the pooled gap law to 1 - exp(-s); two-sample distance zeros against random; first circular moment of the phases with weight log p/sqrt p."""
import sys, json, math, numpy as np
import lib, primes
from lib import log
res = []
g, _, _ = lib.load_list('zeta')
rng = np.random.default_rng(5)
for T, pmax in ((1e3, 1e3), (1e5, 1e4), (1e5, 1e6), (4e6, 1e4), (4e6, 1e6)):
    i0 = int(np.searchsorted(g, T)); zs = g[i0:i0 + 1500]; rs = np.sort(rng.uniform(zs[0], zs[-1], 1500))
    pr = np.concatenate(list(primes.prime_segments(int(pmax)))).astype(np.float64); u = np.log(pr); w = u / np.sqrt(pr)
    def gaps(ts):
        out = []; m1 = []
        for t in ts:
            ph = np.sort(np.mod(t * u, 2 * math.pi)); d = np.diff(np.concatenate([ph, [ph[0] + 2 * math.pi]])); out.append(d * len(ph) / (2 * math.pi))
            m1.append(float((w * np.cos(t * u)).sum()))
        return np.sort(np.concatenate(out)), np.array(m1)
    gz, mz = gaps(zs); gr, mr = gaps(rs)
    def ks_exp(x): F = 1 - np.exp(-x); n = len(x); return float(np.max(np.abs(F - (np.arange(1, n + 1) - 0.5) / n)))
    grid = np.linspace(0, 8, 801); cz = np.searchsorted(gz, grid) / len(gz); cr = np.searchsorted(gr, grid) / len(gr)
    r = dict(T=T, pmax=pmax, nprimes=len(pr), ks_zeros_vs_exp=ks_exp(gz), ks_random_vs_exp=ks_exp(gr), ks_zeros_vs_random=float(np.max(np.abs(cz - cr))),
             noise_scale=float(1 / math.sqrt(len(gz))), frac_gaps_below_0p1=[float((gz < 0.1).mean()), float((gr < 0.1).mean()), 1 - math.exp(-0.1)],
             C_mean_zeros=float(mz.mean()), C_mean_random=float(mr.mean()), C_std=float(mr.std()))
    res.append(r); log(r)
json.dump(res, open(sys.argv[1], 'w'))
