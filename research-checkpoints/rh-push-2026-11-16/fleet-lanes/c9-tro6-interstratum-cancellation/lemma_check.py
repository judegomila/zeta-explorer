"""lemma_check.py -- exact check of Lemma I (signed inclusion-exclusion of strata by sublattice sums) on the rows of
the 1e6 run with random integer row values r(m).  B_kappa = sum_{d squarefree} sum_{e | rad kappa} mu(d) mu(e) Phi(kappa lcm(d^2, e)).
Also counts c(j) = #{(kappa, d, e)} and checks sum_kappa B_kappa = Phi(1), and the coefficient of Phi(j) in sum_kappa B_kappa."""
import sys, itertools, numpy as np
import istrat_ana as IA
d = np.load('data/acc_1e6.npz'); tab = np.load('data/sf_1e6.npz')
rows = d['rows']; fac, keep = IA.factor_rows(rows, tab)
rng = np.random.default_rng(5); r = rng.integers(-1000, 1000, len(rows))
# exponent vectors as dicts; Phi(j) for j given as dict prime->exp
def Phi(j):
    return int(sum(int(r[i]) for i, f in enumerate(fac) if all(f.get(p, 0) >= e for p, e in j.items())))
strata = {}
for i, f in enumerate(fac):
    key = tuple(sorted((p, e) for p, e in f.items() if e >= 2)); strata.setdefault(key, 0); strata[key] += int(r[i])
primes = sorted({p for f in fac for p in f})
Qmax = int(rows[:, 0].max()); pq = tab['pq']
# squarefree d with N(d)^2 <= Qmax
small = [p for p in primes if int(pq[p]) ** 2 <= Qmax]
def sqfree_ds(lim):
    out = [({}, 1)]
    for p in small:
        out += [({**dd, p: 1}, n * int(pq[p])) for dd, n in out if n * int(pq[p]) <= lim]
    return out
bad = 0; nterms = 0; coef = {}
for key, Bk in strata.items():
    kap = dict(key); Nk = int(np.prod([float(pq[p]) ** e for p, e in key])) if key else 1
    tot = 0
    for dd, nd in sqfree_ds(int((Qmax / Nk) ** 0.5) + 1):
        for s in range(len(key) + 1):
            for es in itertools.combinations([p for p, _ in key], s):
                j = dict(kap)
                for p in dd: j[p] = max(j.get(p, 0), kap.get(p, 0) + 2)
                for p in es: j[p] = max(j.get(p, 0), kap[p] + 1)
                sg = (-1) ** (len(dd) + len(es))
                tot += sg * Phi(j); nterms += 1
                jk = tuple(sorted(j.items())); coef[jk] = coef.get(jk, 0) + sg
    bad += (tot != Bk)
print(f"strata {len(strata)}, rows {len(rows)}, terms {nterms}, mismatches {bad}")
print(f"sum of strata = Phi(1): {sum(strata.values()) == Phi({})}")
nz = {k: v for k, v in coef.items() if v != 0 and Phi(dict(k)) != 0 or (k == () )}
print("net coefficient of Phi(j) in the sum over strata, j with at least one row:", {str([(int(pq[p]), e) for p, e in k]): v for k, v in coef.items() if v != 0 and any(all(f.get(p, 0) >= e for p, e in k) for f in fac)})
