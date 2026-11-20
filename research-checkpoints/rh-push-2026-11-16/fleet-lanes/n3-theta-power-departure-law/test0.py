import numpy as np, mpmath as mp, time, sys
from tlib import *
eps=float(sys.argv[1]) if len(sys.argv)>1 else 0.03
t0=time.time()
delta,u,W=nodes(eps); L=logtheta(u,delta)
print('nodes',len(u),'U',u.max(),'planned E chunk MB',1500*len(u)*16/1e6, time.time()-t0)
ws=[1.0,2.0,0.9,1.1]
tau=np.array([5.0,14.134725141734693,20.0,50.3,100.7,200.2,300.9,399.5])
F=evalZ(ws,0.0,tau,u,W,L,delta).real
mp.mp.dps=40
for k,t in enumerate(tau):
    s=mp.mpf(1)/2+1j*mp.mpf(t)
    ex1=(mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)*mp.exp((mp.pi/4-eps)*t)).real
    s=1+1j*mp.mpf(t)
    Lc=lambda z: (mp.zeta(z,0.25)-mp.zeta(z,0.75))/4**z
    ex2=(4*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s/2)*Lc(s/2)*mp.exp((mp.pi/4-eps)*t)).real
    print(t, F[k,0], float(ex1), F[k,0]-float(ex1), '|', F[k,1], float(ex2), F[k,1]-float(ex2))
# off-line test for w=1
x=np.array([0.3,2.0,4.0,0.3]); tt=np.array([30.0,77.7,250.0,399.0])
G=evalZ(ws,x,tt,u,W,L,delta)
for k in range(4):
    s=mp.mpf(1)/2+x[k]+1j*mp.mpf(tt[k])
    ex=mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)*mp.exp((mp.pi/4-eps)*tt[k])
    print(x[k],tt[k],G[k,0],complex(ex),abs(G[k,0]-complex(ex)))
