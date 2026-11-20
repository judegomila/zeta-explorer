"""Combination 2, extra controls at 1e8 (numpy float64, primes only): credit variation for coefficient sequences eps_p log p.
state H(r-) = sum_{l<p} eps_l log l/sqrt l + (1/2) log p + kappa - b (zeta's memory term), credit c_p = eps_p (log p/sqrt p)(log p - 2 log(H/2))."""
import json, math, numpy as np
import lib
N = 10**8; ps = lib.primes_upto(N).astype(np.float64); lp = np.log(ps); w = lp/np.sqrt(ps)
b = float(lib.consts()['b']); kappa = 1.1442544139805
rng = np.random.default_rng(7)
def run(eps, name):
    we = eps*w; P = np.concatenate([[0.0], np.cumsum(we)[:-1]]); H = P + lp/2 + kappa - b
    ok = H > 0; first_bad = None if ok.all() else float(ps[np.argmin(ok)])
    c = np.where(ok, we*(lp - 2*np.log(np.where(ok, H, 1.0)/2)), np.nan)
    keep = eps != 0; cc = c[keep]; pk = ps[keep]; d = np.abs(np.diff(cc)); tail = np.nancumsum(d[::-1])[::-1]
    out = dict(name=name, first_p_with_H_le_0=first_bad, table=[])
    for L in (8, 10, 12, 14, 16):
        i = np.searchsorted(pk[:-1], math.exp(L)); V = float(tail[i]) if i < len(tail) else 0.0
        out['table'].append(dict(L=L, V=V, V_over_bound=V/((23*L + 34)/math.exp(L/2))))
    print(name, 'first p with H <= 0:', first_bad, ' V/bound at L=8..16:', ['%.4g' % t['V_over_bound'] for t in out['table']], ' sum|c| = %.4g' % np.nansum(np.abs(cc)))
    return out
res = [run(np.ones(len(ps)), 'zeta (primes only)'),
       run((rng.random(len(ps)) < 0.5).astype(float), 'thinned primes, density 1/2 (0 <= eps <= 1)'),
       run(np.where(rng.random(len(ps)) < 0.1, -1.0, 1.0), 'sign flips, density 0.1'),
       run(np.where(rng.random(len(ps)) < 0.5, -1.0, 1.0), 'random signs, density 1/2'),
       run(-np.ones(len(ps)), 'Liouville on primes (eps = -1)'),
       run(np.where((ps > 1e3) & (np.floor(np.log2(ps)) % 2 == 0), 1.0, 1.0)*np.where(np.isin(ps, [101.0, 1009.0, 10007.0]), -1.0, 1.0), 'three flipped primes 101, 1009, 10007'),
       run(1 + 0.5*np.sin(lp), 'smooth amplitude 1 + 0.5 sin(log p)')]
json.dump(res, open('out/c2_twplus.json', 'w'), indent=1)
