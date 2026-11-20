"""Zero census of F in sig_lo<=Re s<=sig_hi, 1<=Im s<=T by cell winding numbers + Newton refinement."""
import numpy as np, json, sys, time
from lib import *
name=sys.argv[1]; T=float(sys.argv[2]); fn={'dh':DH,'zeta':ZETA}[name]
dt=0.05; ds=0.01; sig=np.round(np.arange(0.52,1.2001,ds),4)
BL=2_000_000
print('planned alloc per line: %.0f MB complex, two lines held'%(BL*16/1e6))
cells=[]
t0=1.0
while t0<T:
    M=int(min(BL, round((T-t0)/dt)+2)); M+=M%2
    prev=None
    for sg in sig:
        f=line(fn,float(sg),t0,dt,M,tmax=t0+M*dt)
        if prev is not None:
            a=prev[:-1]; b=f[:-1]; c=f[1:]; d=prev[1:]
            w=np.angle(b/a)+np.angle(c/b)+np.angle(d/c)+np.angle(a/d)
            idx=np.nonzero(np.abs(w)>3)[0]
            for i in idx: cells.append((float(sg-ds/2), t0+dt*(i+0.5), int(round(w[i]/(2*np.pi)))))
        prev=f
    t0+=dt*(M-1)
    print('t0',t0,'cells',len(cells),flush=True)
zs=[]
bad=0
for (s0,tt,w) in cells:
    z=complex(s0,tt); ok=False
    N=int(tt*0.5+20)
    for it in range(30):
        h=1e-5
        v=point(fn,[z,z+h],N=N); d=(v[1]-v[0])/h
        st=v[0]/d
        if abs(st)>0.03: st*=0.03/abs(st)
        z-=st
        if abs(st)<1e-9: ok=True;break
    if ok and abs(z.real-s0)<=ds and abs(z.imag-tt)<=dt: zs.append((z.real,z.imag,w))
    else: bad+=1; zs.append((s0,tt,w))
zs.sort(key=lambda u:u[1])
json.dump({'name':name,'T':T,'dt':dt,'ds':ds,'sig_lo':float(sig[0]),'sig_hi':float(sig[-1]),'n':len(zs),'unrefined':bad,'zeros':zs},open(f'census_{name}_{int(T)}.json','w'))
print('zeros',len(zs),'unrefined',bad,'net winding',sum(c[2] for c in cells))
