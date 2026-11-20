import sys, numpy as np, itertools, time
from fflib import *
for n in (6, 3):
    sym = Sym(n)
    bad = 0; cnt = 0; mx = 0
    rng = np.random.default_rng(1)
    for k in (1, 2, 3):
        cs = monics(k)
        if k == 3:
            cs = [cs[i] for i in rng.choice(len(cs), 60, replace=False)] + [(0,0,0,1),(1,3,3,1),(0,0,1,1),(6,1,6,1)]
        for c in cs:
            for d in (0, 1, 2, 3):
                ms = monics(d)
                if len(ms) > 12:
                    ms = [ms[i] for i in rng.choice(len(ms), 10, replace=False)]
                    # add multiples of repeated factors
                    for P, a in factor(c):
                        if len(P) - 1 <= d:
                            ms.append(pmul(P, monics(d - len(P) + 1)[3 % q ** (d - len(P) + 1)]))
                        if 2 * (len(P) - 1) <= d:
                            ms.append(pmul(pmul(P, P), monics(d - 2 * len(P) + 2)[0]))
                for m in ms:
                    a_ = sym.g(m, c); b_ = sym.g_brute(m, c); cnt += 1
                    e = abs(a_ - b_); mx = max(mx, e)
                    if e > 1e-9:
                        bad += 1
                        if bad < 5: print('MISMATCH', n, m, c, a_, b_)
    print(f'n={n}: g formula vs brute force: {cnt} cases, {bad} mismatches, max err {mx:.2e}')
    # c_k table vs direct sum
    for k in (1, 2, 3):
        for d in (0, 1, 2):
            Ms = monics(d)
            t = ck_table(sym, k, Ms)
            ref = np.array([sum(sym.g(m, c) for c in monics(k)) for m in Ms])
            print(f'   ck_table k={k} d={d}: max diff {abs(t-ref).max():.2e}')
