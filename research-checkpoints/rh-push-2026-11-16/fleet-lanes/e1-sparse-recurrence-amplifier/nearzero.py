"""Small values on Re s = 0.6, t<=T: zeta vs DH."""
import numpy as np, json, sys
from lib import *
T=float(sys.argv[1]); dt=0.02; out={}
BL=2_000_000
for name,fn in (('zeta',ZETA),('dh',DH)):
    cnt={d:0 for d in (0.5,0.3,0.2,0.1,0.05,0.02)}; lm={d:0 for d in cnt}; mn=(9,0); n=0; t0=10.0
    while t0<T:
        M=int(min(BL,round((T-t0)/dt)+2)); M+=M%2
        a=np.abs(line(fn,0.6,t0,dt,M,tmax=t0+M*dt)); n+=M
        i=int(a.argmin()); 
        if a[i]<mn[0]: mn=(float(a[i]),t0+dt*i)
        loc=(a[1:-1]<a[:-2])&(a[1:-1]<=a[2:])
        for d in cnt: cnt[d]+=int((a<d).sum()); lm[d]+=int((loc&(a[1:-1]<d)).sum())
        t0+=dt*M
    out[name]={'fraction_below':{str(d):cnt[d]/n for d in cnt},'local_minima_below':{str(d):lm[d] for d in lm},'min':mn}
    print(name,out[name])
json.dump(out,open(f'nearzero_{int(T)}.json','w'),indent=1)
