import sys,numpy as np
from h5lib import *
d=load_multi(sys.argv[1].split(',')); X=d['X']; p=primes_upto(X); f=families(p); L=np.log(p.astype(np.float64))
print('count',int(d['C'].sum()),len(p))
worst=0
for Y in [1e3,1e5,X]:
    j=int(np.searchsorted(d['B'],Y,side='right'))-1  # blocks 0..j-1 complete: primes < B[j]
    Yc=int(d['B'][j]); sel=p<Yc
    for si,s in enumerate(RS):
        for fi,fn in enumerate(FAM):
            a=float(real_col(d,si,fi)[:j].sum()); b=float(np.sum(f[fn][sel]*np.exp(-s*L[sel])))
            worst=max(worst,abs(a-b)/(1+abs(b)))
print('real columns worst rel diff',worst)
t=np.array([0,0.25,7.3,14.134725,50.0,100.0]); worst=0
for ksi,s in enumerate(KS):
    for kfi,fn in enumerate(KF):
        bs=block_sums(d,ksi,kfi,t).sum(axis=0)
        for i,tt in enumerate(t):
            ref=np.sum(f[fn]*np.exp(-(s+1j*tt)*L)); worst=max(worst,abs(bs[i]-ref)/(1+abs(ref)))
print('moment reconstruction worst rel diff',worst)
