import numpy as np, math
from cm import *
def lattice(KL,KR,eps,extraL=None):
    # pair (0,1); environment stretched by (1+eps)
    L=[-(1+eps)*r for r in range(1,KL+1)]; R=[1+(1+eps)*r for r in range(1,KR+1)]
    if extraL: L.append(-(1+eps)*extraL)
    return np.array(sorted(L)+[0,1]+R)
print("(B) upward crossings by a strictly minimal pair (stretched lattice C(K,K), eps=0.01)")
for K in (1,2,3,5,8,12):
    x=lattice(K,K,0.01)
    rec=run(x,floor=1e-2)
    i0=rec[0][1]; th0=rec[0][2]
    # max Theta while the initial pair is still minimal
    seg=[r for r in rec if r[1]==i0]
    # contiguous initial segment
    n=0
    while n<len(rec) and rec[n][1]==i0: n+=1
    seg=rec[:n]
    pk=max(r[2] for r in seg)
    jump=(rec[n-1][2],rec[n][2]) if n<len(rec) else None
    print("K",K,"Theta(0)",round(th0,6),"peak while minimal",round(pk,6),"K/(K+1)",round(K/(K+1),6),"first transfer Theta before/after",jump,"overall sup",round(max(r[2] for r in rec),6))
print("(C) transfer lemma: random configs, all jumps of Theta_min at index switches")
rng=np.random.default_rng(7)
worst=-1; njump=0
for t in range(300):
    N=rng.integers(4,12)
    gaps=1+rng.exponential(0.3,size=N-1)*(rng.random(N-1)<0.7)
    x=np.concatenate([[0],np.cumsum(gaps)])
    rec=run(x,floor=3e-2)
    for a,b in zip(rec[:-1],rec[1:]):
        if a[1]!=b[1]:
            njump+=1; worst=max(worst,b[2]-a[2])
print("index switches:",njump,"max (Theta_after-Theta_before):",worst,"(step-size noise ~1e-4 expected)")
