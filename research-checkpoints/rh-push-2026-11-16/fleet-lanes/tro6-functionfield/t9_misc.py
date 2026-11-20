import numpy as np, pickle
from fflib import *
from t4_analyse import pstar
res = pickle.load(open('ck_n6.pkl', 'rb')); allr = pickle.load(open('blocks.pkl', 'rb'))
print('=== FE proportionality p*_(d+1-k)(m) = lambda(d,k) * p*_k(m) or conj:  1 - |<a,b>|/(|a||b|) ===')
for d in (2, 3, 4):
    for k in range(0, (d + 1) // 2 + 1):
        a = pstar(res, 6, d, k); b = pstar(res, 6, d, d + 1 - k)
        na, nb = np.linalg.norm(a), np.linalg.norm(b)
        if na < 1e-9 or nb < 1e-9:
            print(f' d={d} k={k}<->{d+1-k}: norms {na:.2e},{nb:.2e}'); continue
        lin = abs(np.vdot(a, b)) / (na * nb); con = abs(np.sum(a * b)) / (na * nb)
        print(f' d={d} k={k}<->{d+1-k}: 1-lin={1-lin:.2e} 1-conj={1-con:.2e}  |lambda|={nb/na:.6f} = q^{np.log(nb/na)/np.log(q):.4f}')
print('=== TRO pairing (e=1, bilinear), d=4, independent classes k=1,2: incomplete blocks k+N>d ===')
null = q ** -2.0
for nm in ('triv', 'T1', 'T2', 'Q1'):
    for k in (1, 2):
        print(f' nu={nm} k={k}: ' + ' '.join(f'N={N}:{allr[(4,nm,1,0,k,N)]/null:.2f}x' for N in range(d - k + 1, 7)))
