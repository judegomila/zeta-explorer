import os; os.environ['RH_NOGPU']='1'
import numpy as np, s3lib as S, torus as T
b=T.sieve(40000)
print(len(S.seg_primes(0,10**6,b)), 78498-1)
a=S.seg_primes(10**6+1, 2*10**6, b); f=T.sieve(2*10**6); print(len(a), (f>10**6).sum(), np.array_equal(a,f[f>10**6]))
pr=T.sieve(6420); m=S.thin_set(pr,0.75); print('DEL set size',m.sum(),'of',len(pr), pr[m][:12])
rng=np.random.default_rng(1)
n=3000; om=rng.random(n)*2.5; c=rng.standard_normal(n)
M=4096; k=np.arange(-M//2,M//2)
D=(c[None,:]*np.exp(-1j*k[:,None]*om[None,:])).sum(1)
for w in (8,12,14):
    for sg in (2,4):
        F=S.nufft1(om,c,M,nf=sg*M,w=w); print(w,sg,abs(F-D).max()/abs(c).sum())
