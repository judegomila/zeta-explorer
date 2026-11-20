import numpy as np, pickle
from tlib import *
P=pickle.load(open('s2000_gaps.pkl','rb')); rows=P['rows']; z=np.concatenate([rows[:,1],[rows[-1,2]]])
delta,u,W=nodes(0.03); L=logtheta(u,delta)
k=int(np.searchsorted(z,368.43))-1; a=(z[k-1]+z[k])/2; b=(z[k+1]+z[k+2])/2
print('gap',k,'zeta zeros',z[k-1:k+3],'window',a,b,'first-order d1',rows[k,3])
def nsc(w):
    tau=np.linspace(a,b,4001); f=evalZ([w],0.0,tau,u,W,L,delta,chunk=4001).real[:,0]
    return int((np.sign(f[1:])*np.sign(f[:-1])<0).sum())
for w in (1.0,0.95,0.94,0.93,0.92): print(w,nsc(w))
lo,hi=0.94,0.93
n0=nsc(lo)
for _ in range(26):
    m=(lo+hi)/2
    if nsc(m)==n0: lo=m
    else: hi=m
print('critical w for the pair departing near 368.4: %.7f (w-1 = %.7f)'%(hi,hi-1))
