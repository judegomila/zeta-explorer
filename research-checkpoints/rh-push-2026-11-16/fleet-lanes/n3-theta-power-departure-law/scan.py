# usage: scan.py eps tmax dtau out.npz w1,w2,... | lo:hi:step
import numpy as np, sys, time
from tlib import *
eps=float(sys.argv[1]); tmax=float(sys.argv[2]); dt=float(sys.argv[3]); out=sys.argv[4]
a=sys.argv[5]
if ':' in a:
    lo,hi,st=map(float,a.split(':')); ws=np.round(np.arange(lo,hi+st/2,st),6)
else: ws=np.array([float(v) for v in a.split(',')])
extra=sys.argv[6] if len(sys.argv)>6 else ''
if extra: ws=np.concatenate([ws,[float(v) for v in extra.split(',')]])
t0=time.time()
import os
U2=40/(np.pi*np.sin(2*eps)); ppu=int(np.ceil((U2+tmax/(2*np.pi))/2.1)); ppu=max(ppu,130)
Tstep=float(os.environ.get('TSTEP','2'))
delta,u,W=nodes(eps,ppu=ppu); L=logtheta(u,delta); G=gmat(ws,u,W,L)
print('args',sys.argv[1:],'nodes',len(u),'nw',len(ws),'chunk MB',1500*len(u)*16/1e6,'ppu',ppu,flush=True)
tau0=0.5
tau=np.arange(tau0,tmax+dt/2,dt)
F=evalZ(ws,0.0,tau,u,W,L,delta,G=G).real
print('line done',time.time()-t0,flush=True)
B=4.0
# right edge
tr=np.arange(tau0,tmax+0.01,0.02)
R=evalZ(ws,B,tr,u,W,L,delta,G=G)
# horizontal edges: x grid from 0 to B
xg=np.concatenate([np.arange(0,1.5,0.005),np.arange(1.5,B+1e-9,0.05)])
Ts=np.concatenate([[tau0],np.arange(Tstep,tmax+1e-9,Tstep)])
Ts=Ts+0.0  # heights
XX=np.tile(xg,len(Ts)); TT=np.repeat(Ts,len(xg))
H=evalZ(ws,XX,TT,u,W,L,delta,G=G).reshape(len(Ts),len(xg),len(ws))
print('rect done',time.time()-t0,flush=True)
np.savez(out,ws=ws,tau=tau,F=F,tr=tr,R=R,xg=xg,Ts=Ts,H=H,eps=eps,B=B)
