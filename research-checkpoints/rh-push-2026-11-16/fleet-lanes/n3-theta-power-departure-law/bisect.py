import numpy as np, pickle, sys, json
from tlib import *
P=pickle.load(open(sys.argv[1],'rb')); rows=P['rows']; z=np.concatenate([rows[:,1],[rows[-1,2]]])
tmax=2000; eps=0.009
U2=40/(np.pi*np.sin(2*eps)); ppu=int(np.ceil((U2+tmax/(2*np.pi))/2.1))
delta,u,W=nodes(eps,ppu=ppu); L=logtheta(u,delta)
print('nodes',len(u),'E MB',2001*len(u)*16/1e6)
def nsc(w,a,b):
    tau=np.linspace(a,b,2001)
    f=evalZ([w],0.0,tau,u,W,L,delta,chunk=2001).real[:,0]
    return int((np.sign(f[1:])*np.sign(f[:-1])<0).sum()), tau[np.argmin(np.abs(f[5:-5]))+5]
out=[]
for k in [int(v) for v in sys.argv[2].split(',')]:
    a=(z[k-1]+z[k])/2; b=(z[k+1]+z[k+2])/2; d1=rows[k,3]
    sg=np.sign(d1); lo=0.0; hi=None
    for trial in (1.3,1.8,2.5,4.0):
        if nsc(1+trial*d1,a,b)[0]==0: hi=abs(trial*d1); break
    if hi is None: print(k,'no bracket',d1); continue
    for _ in range(26):
        m=(lo+hi)/2
        if nsc(1+sg*m,a,b)[0]>=2: lo=m
        else: hi=m
    n,tm=nsc(1+sg*hi,a,b)
    print(f'gap {k}: zeros {z[k]:.4f},{z[k+1]:.4f}  first-order delta={d1:+.6f}  exact critical w-1 = {sg*hi:+.7f}  (w_c={1+sg*hi:.7f}), double zero at tau~{tm:.3f}',flush=True)
    out.append(dict(gap=k,g0=z[k],g1=z[k+1],d1=d1,dc=sg*hi,tau=tm))
json.dump(out,open(sys.argv[3],'w'))
