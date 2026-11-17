import sys, itertools, numpy as np
from lylib import *
q = int(sys.argv[1]); n = int(sys.argv[2])
chi = chi_table(q); vals = value_tables(q, n-1)
rng = np.random.default_rng(1)
subs = list(itertools.combinations(range(q), n))
# affine normal form: keep those containing 0 and 1 as two smallest
subs = [s for s in subs if s[0]==0 and s[1]==1][:int(sys.argv[3]) if len(sys.argv)>3 else 6]
for es in subs:
    cnt = counts(q, list(es), vals, chi)
    cf = np.array(cnt, dtype=float)
    def roots(z):
        co = Ncoeffs(q, n, cnt, list(z), one=1+0j)
        return np.roots(co[::-1])
    r1 = roots([1]*n); rm = roots([-1]*n)
    print(es, "z=1 roots", np.round(r1,4), "| z=-1 |u|sqrt q", np.round(np.sort(abs(rm))*q**.5,6))
    # random torus + interior scan
    best = (9,None); best1=(9,None)
    for t in range(4000):
        if t%2: z = np.exp(2j*np.pi*rng.random(n))
        else: z = np.sqrt(rng.random(n))*np.exp(2j*np.pi*rng.random(n))
        a = np.sort(abs(roots(z)))*q**.5
        if a[1] < best[0]: best=(a[1], z, a)
        if a[0] < best1[0]: best1=(a[0], z, a)
    print("   min 2nd-smallest |u|sqrt q:", best[0], "at z", np.round(best[1],3), "all", np.round(best[2],4))
    print("   min smallest:", best1[0], "(1/sqrt q =", q**-.5, ")")
