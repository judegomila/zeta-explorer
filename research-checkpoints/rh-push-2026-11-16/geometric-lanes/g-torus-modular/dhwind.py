# count DH zeros in Re s > 1 by winding of f along sigma=1 versus horizontal continuation from sigma=12
import numpy as np, sys, math
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import dhscan_np as d
T1=float(sys.argv[1]); dt=0.01; blk=100.0
acc=0.0; last=None; t=1.0
def harg(t,N):
    sg=np.linspace(12,1,400); v=d.f(sg+1j*t,N); return np.unwrap(np.angle(v))[-1]
while t<T1:
    tt=np.arange(t,t+blk+dt/2,dt); N=int(max(80,(t+blk)/3))
    v=d.f(1.0+1j*tt,N); a=np.unwrap(np.angle(v))
    acc0=acc if last is not None else harg(t,N)
    a=a-a[0]+acc0; acc=a[-1]
    last=1; t+=blk
    h=harg(t,N); n=(acc-h)/(2*math.pi)
    if abs(n)>0.5 and not getattr(sys,'_flag',0)==round(n):
        print("t<=",t," winding (A-H)/2pi =",round(n,3), " min|f| on line in block", float(np.abs(v).min()), flush=True); sys._flag=round(n)
print("final", t, (acc-harg(t,int(max(80,t/3))))/(2*math.pi))
