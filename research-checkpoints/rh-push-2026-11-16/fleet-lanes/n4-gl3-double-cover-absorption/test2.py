# n = 2 row-norm measurement for rows m -> (d/c) with an inserted coefficient x_c (Moebius, |Moebius|, random signs,
# random multiplicative signs).  N(x) = sum_{d in rows} |sum_c x_c (d/c)|^2,  diagonal = #rows * sum |x_c|^2.
import numpy as np, json, math
def sieve(n):
    spf = np.zeros(n + 1, dtype=np.int64)
    for i in range(2, n + 1):
        if spf[i] == 0: spf[i::i] = np.where(spf[i::i] == 0, i, spf[i::i])
    return spf
ZMAX = 8000; spf = sieve(ZMAX)
def factor(n):
    f = []
    while n > 1:
        q = int(spf[n]); e = 0
        while n % q == 0: n //= q; e += 1
        f.append((q, e))
    return f
def legendre_table(q):
    t = -np.ones(q, dtype=np.int8); t[0] = 0; t[(np.arange(1, q, dtype=np.int64)**2) % q] = 1; return t
rng = np.random.default_rng(20261117); res = []
for Z in (1000, 2000, 4000, 8000):
    D = Z
    ds = np.arange(1, D + 1, 2, dtype=np.int64)
    cs = [c for c in range(1, Z + 1, 2) if all(e == 1 for _, e in factor(c))]
    print("Z = D = %d: rows %d, columns %d, planned allocation %.1f MB (float32 matrix)" % (Z, len(ds), len(cs), len(ds)*len(cs)*4/1e6), flush=True)
    M = np.ones((len(ds), len(cs)), dtype=np.float32)
    tabs = {}
    for j, c in enumerate(cs):
        for q, _ in factor(c):
            if q not in tabs: tabs[q] = legendre_table(q)
            M[:, j] *= tabs[q][ds % q]
    mu = np.array([(-1)**len(factor(c)) for c in cs], dtype=np.float32)
    is_sq = np.array([math.isqrt(int(d))**2 == d for d in ds])
    is_sf = np.array([all(e == 1 for _, e in factor(int(d))) for d in ds]) & ~is_sq
    other = ~is_sq & ~is_sf
    def ratios(xv):
        S = M @ xv; n2 = float(xv @ xv)
        return [float((S[m]**2).sum()/(m.sum()*n2)) for m in (is_sf, is_sq, other)]
    rand = np.array([ratios(rng.choice([-1.0, 1.0], size=len(cs)).astype(np.float32)) for _ in range(40)])
    primes = sorted(tabs); 
    def randmult():
        e = {q: rng.choice([-1.0, 1.0]) for q in primes}
        return np.array([np.prod([-e[q] for q, _ in factor(c)]) for c in cs], dtype=np.float32)
    rm = np.array([ratios(randmult()) for _ in range(40)])
    row = dict(Z=Z, rows_sqfree=int(is_sf.sum()), rows_square=int(is_sq.sum()), rows_other=int(other.sum()), cols=len(cs),
               mu=ratios(mu), absmu=ratios(np.abs(mu)),
               random_mean=rand.mean(0).tolist(), random_sd=rand.std(0).tolist(),
               randmult_mean=rm.mean(0).tolist(), randmult_sd=rm.std(0).tolist(),
               M_Z=float(mu.sum()))
    res.append(row)
    f3 = lambda v: "[" + ", ".join("%.3f" % t for t in v) + "]"
    print("   ratio N/diagonal on rows [squarefree d>1, d = square, other]")
    print("   mu        ", f3(row['mu']), "  sum mu(c) =", row['M_Z'])
    print("   |mu|      ", f3(row['absmu']))
    print("   random +-1", f3(row['random_mean']), "sd", f3(row['random_sd']))
    print("   rand. mult", f3(row['randmult_mean']), "sd", f3(row['randmult_sd']), flush=True)
    del M
json.dump(res, open(__file__.replace('.py', '.json'), 'w'), indent=1)
