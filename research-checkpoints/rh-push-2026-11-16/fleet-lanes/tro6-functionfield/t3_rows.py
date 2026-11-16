"""Rows: R_n(m) = sum_{A sf monic, deg n} g_3(1,A) chi_6(Res(A,m))^e nu(A)   (cubic Gauss sum, sextic symbol in m)
and completed rows t_N(m) = sum_j R_{N-3j}(m) q^{2j} L_j(m),  L_j(m)=sum_{deg n=j} chi_2(Res(n,m)) nu(n)^3."""
import sys, numpy as np, time, pickle, os
from fflib import *
dmax = int(sys.argv[1]); nmax = int(sys.argv[2])
fn = 'rows.pkl'
rows = pickle.load(open(fn, 'rb')) if os.path.exists(fn) else {}
NUS = {'triv': None, 'T1': ((0, 1), 1), 'T2': ((0, 1), 2), 'Q1': ((3, 0, 1), 1)}   # T^2+3 irreducible mod 7
for d in range(1, dmax + 1):
    Ms = monics(d)
    for nm, nu in NUS.items():
        for e in (1, 5):
            for n in range(0, nmax + 1):
                key = (d, nm, e, n)
                if key in rows: continue
                t = time.time()
                rows[key] = sf_sum(n, Ms, 2, e, nu=nu)
                if time.time() - t > 5: print(key, f'{time.time()-t:.1f}s', flush=True)
        pickle.dump(rows, open(fn, 'wb'))
    # quadratic L coefficients
    for nm, nu in NUS.items():
        for j in range(0, 3):
            key = (d, nm, 'L', j)
            if key in rows: continue
            v = np.zeros(len(Ms), dtype=complex)
            for im, m in enumerate(Ms):
                tot = 0
                for nn in monics(j):
                    r = pres(nn, m)
                    if r == 0: continue
                    w = Z6[(3 * int(LOG[r])) % 6]
                    if nu is not None:
                        rl = pres(nn, nu[0])
                        if rl == 0: continue
                        w *= Z6[(3 * nu[1] * int(LOG[rl])) % 6]
                    tot += w
                v[im] = tot
            rows[key] = v
    pickle.dump(rows, open(fn, 'wb'))
    print('rows done d =', d, flush=True)
