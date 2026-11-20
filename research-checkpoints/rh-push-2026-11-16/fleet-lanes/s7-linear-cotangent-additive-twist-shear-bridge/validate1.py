import numpy as np, math, subprocess, sys
from vlib import *
# 1. C_table route against the direct definition with closed-form S_F
worst=0
for fn in ['zeta','chi4','chi5','chi3','dh']:
    for (h,k) in [(1,3),(2,7),(5,13),(7,31),(30,101),(17,96),(3,35),(11,60)]:
        if fn in PER and math.gcd(k,len(PER[fn]))>1: continue
        a=V_all(k,C_table(fn,k),[h])[0]; b=V_direct(fn,h,k); worst=max(worst,abs(a-b)); 
print('table vs direct closed form, worst abs diff',worst)
# 2. brute force truncated sum, smooth cutoff, for U and Ea and dh
def brute(fn,h,k,N=2000000,**kw):
    n=np.arange(1,3*N+1,dtype=float); w=0.5*np.vectorize(math.erfc)(np.log(n/N)/0.3) if False else None
    from math import erfc
    w=0.5*(1-np.tanh(4*np.log(n/N)))  # smooth cutoff
    if fn=='U': a=n**(-1j*kw.get('tau',1.0))
    elif fn=='Ea':
        al=kw.get('a',0.25); M=len(n); a=np.zeros(M)
        for d in range(1,M+1):
            e=np.arange(1,M//d+1); a[d*e-1]+=d**al*e**(-al)
            if d>3000 and d%50000==0: pass
    elif fn=='zeta': a=np.ones_like(n)
    else: c=np.array(PER[fn]); a=c[(n.astype(np.int64))%len(c)]
    t=(n.astype(np.int64)*h)%k; saw=np.where(t==0,0.0,t/k-0.5)
    return -(2*k/PI)*(a*w*saw/n).sum()
for fn,kw in [('zeta',{}),('dh',{}),('U',{'tau':1.0})]:
    for (h,k) in [(2,7),(5,13),(30,101)]:
        a=V_all(k,C_table(fn,k,**kw),[h])[0]; b=brute(fn,h,k,N=1000000,**kw); print(fn,h,k,a,b,abs(a-b))
