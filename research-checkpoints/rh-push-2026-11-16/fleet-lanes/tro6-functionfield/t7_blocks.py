"""Block correlations r(k,N;d) = |sum_{deg m=d} c_k(m) R_N(m)| / (|c_k| |R_N|), sextic Gauss-sum sums vs cubic rows."""
import numpy as np, pickle
from fflib import *
res = pickle.load(open('ck_n6.pkl', 'rb')); rows = pickle.load(open('rows.pkl', 'rb'))
def r(a, b):
    na, nb = np.linalg.norm(a), np.linalg.norm(b)
    return float('nan') if na < 1e-9 or nb < 1e-9 else abs(np.sum(a * b)) / (na * nb)
allr = {}
for d in (2, 3, 4):
    ks = [k for k in range(1, 8) if (d, k) in res]
    print(f'--- d={d}: null (#m)^(-1/2) = {q**(-d/2):.4f} ---')
    for nm in ('triv', 'T1', 'T2', 'Q1'):
        for e in (1, 5):
            if (d, nm, e, 6) not in rows: continue
            for conj in (0, 1):
                print(f' nu={nm} e={e} {"sesq " if conj else "bilin"}   N=1..6 (columns), k rows')
                for k in ks:
                    vals = []
                    for N in range(1, 7):
                        B = rows[(d, nm, e, N)]
                        v = r(res[(d, k)], np.conj(B) if conj else B)
                        vals.append(v); allr[(d, nm, e, conj, k, N)] = v
                    print(f'    k={k}: ' + ' '.join(('  *   ' if np.isnan(x) else f'{x:.4f}') + ('c' if k + N <= d else ' ') for N, x in zip(range(1, 7), vals)))
pickle.dump(allr, open('blocks.pkl', 'wb'))
print()
print('=== summary over incomplete blocks (k+N>d), excluding nan ===')
for d in (2, 3, 4):
    v = np.array([x for (dd, nm, e, cj, k, N), x in allr.items() if dd == d and k + N > d and not np.isnan(x)])
    if len(v) == 0: continue
    null = q ** (-d / 2)
    print(f' d={d}: {len(v)} blocks; median r/null = {np.median(v)/null:.2f}; 90% = {np.quantile(v,0.9)/null:.2f}; max = {v.max()/null:.2f} (r={v.max():.4f}); fraction with r>3 null: {np.mean(v>3*null):.3f}')
    big = sorted([(x, key) for key, x in allr.items() if key[0] == d and key[4] + key[5] > d and not np.isnan(x)], reverse=True)[:8]
    for x, key in big: print('     ', key, f'{x:.4f}')
