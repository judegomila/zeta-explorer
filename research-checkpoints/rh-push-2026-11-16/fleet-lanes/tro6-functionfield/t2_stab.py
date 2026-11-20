import sys, numpy as np, time, pickle, os
from fflib import *
n = int(sys.argv[1]); dmax = int(sys.argv[2]); kmax = int(sys.argv[3])
sym = Sym(n); fn = f'ck_n{n}.pkl'
res = pickle.load(open(fn, 'rb')) if os.path.exists(fn) else {}
# cross-check v2 against v1
for (d, k) in [(2, 3), (1, 4), (3, 3)]:
    Ms = monics(d)
    print('v1 vs v2', d, k, abs(ck_table(sym, k, Ms) - ck_table2(sym, k, Ms)).max(), flush=True)
for k in range(kmax + 1):
    for d in range(dmax + 1):
        if (d, k) in res or k > int(sys.argv[4 + d]) :
            continue
        t = time.time()
        res[(d, k)] = ck_table2(sym, k, monics(d))
        print(f'n={n} d={d} k={k} done {time.time()-t:.1f}s', flush=True)
        pickle.dump(res, open(fn, 'wb'))
print(f'--- stabilisation test c_k = q^(n+1) c_(k-n), n={n} ---')
for d in range(dmax + 1):
    for k in range(n, kmax + 1):
        if (d, k) not in res: continue
        a = res[(d, k)]; b = q ** (n + 1) * res[(d, k - n)]
        rel = abs(a - b).max() / max(abs(a).max(), abs(b).max(), 1e-300)
        print(f'd={d} k={k}: max|c_k - q^{n+1} c_(k-{n})| / max = {rel:.3e}')
print('--- normalised rms: sqrt(mean |c_k(m)|^2) * q^(-k(1+1/n)) ---')
for d in range(dmax + 1):
    print(d, [f'{np.sqrt((abs(res[(d,k)])**2).mean())*q**(-k*(1+1/n)):.4f}' for k in range(kmax+1) if (d,k) in res])
