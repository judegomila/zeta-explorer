import sys, math, numpy as np
sys.argv=['t3.py','zeta','1e4']
import t3, mpmath as mp
for fn in ['zeta','chi4','dh']:
    t3.fn=fn; t3.cper=np.array(t3.PER[fn]); t3.q=len(t3.cper)
    t,delta,sig,outs=t3.block(1e4,1e4,2**17)
    mp.mp.dps=20
    for j in [0,1,5000,2**17-1]:
        tt=float(t[j]); 
        def F(s):
            if fn=='zeta': return mp.zeta(s)
            if fn=='chi4': return mp.dirichlet(s,[0,1,0,-1])
            return sum(t3.cper[r]*mp.zeta(s,mp.mpf(r)/5) for r in range(1,5))*mp.mpf(5)**(-s)
        for si in [0,2,5,8]:
            s=mp.mpc(sig[si] if si<6 else 0.5+t3.XS[si-6],tt)
            ref=F(s) if si<6 else mp.diff(F,s)
            print(fn,j,si,abs(complex(outs[si][j])-complex(ref)),abs(complex(ref)),flush=True)
