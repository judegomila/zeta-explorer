"""Pin threshold: smallest D with LP-E value = psi_k(X)/X^k (relative gap < 1e-9), by bisection on D."""
import sys, math, json, numpy as np
from lrlib import *
out = []
KS = [int(a) for a in sys.argv[1].split(',')]; XS = [int(float(a)) for a in sys.argv[2].split(',')]
for k in KS:
    for X in XS:
        lam = sieve_lambda(X); n = np.arange(X + 1, dtype=np.float64)
        truth = float(np.sum(lam * (1 - n / X) ** k) / FACT[k]); sysm = Sys(X, k)
        r = int(math.isqrt(X)); lo, hi = r // 2, 3 * r
        def pinned(D):
            for DD in (D, D + 1, D - 1):          # HiGHS occasionally returns a numerical failure; try a neighbour
                r_ = solve(sysm, DD)
                if r_['status'] == 0: return (r_['val'] - truth) < 1e-7 * math.sqrt(X)
            return False
        assert pinned(hi) and not pinned(lo)
        while hi - lo > 1:
            mid = (lo + hi) // 2
            if pinned(mid): hi = mid
            else: lo = mid
        # number of prime powers <= sqrt X
        pp = int(np.sum(lam[: r + 1] > 0))
        rec = dict(k=k, X=X, Dstar=hi, sqrtX=r, ratio=hi / math.sqrt(X), primepowers_le_sqrtX=pp, pred=r + pp)
        out.append(rec); print(rec, flush=True)
json.dump(out, open(f'out/pin_{sys.argv[1]}_{XS[0]}.json', 'w'), indent=0)
