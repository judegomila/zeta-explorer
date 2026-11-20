import numpy as np
from cm2 import *
print("refutation family {-d,0,1,1+d}: R = 8 eta0 tc/m0^2 and excursion")
for d in (1.0005,1.01,1.03,1.05,1.0735,1.2):
    rec=run(np.array([-d,0,1,1+d]),floor=1e-2,c=2e-3)
    eta0=1-rec[0,2]; R=8*eta0*tc_est(rec)/rec[0,3]**2
    print(" d",d,"Theta0",round(rec[0,2],5),"sup",round(rec[:,2].max(),5),"R",round(R,5))
print("stretched lattices C(K,K), env scaled by (1+eps): strict minimal pair, rise of Theta while still minimal")
for K,eps in ((2,1e-3),(3,1e-3),(5,2e-4),(8,1e-4),(12,3e-5)):
    L=[-(1+eps)*r for r in range(K,0,-1)]; Rr=[1+(1+eps)*r for r in range(1,K+1)]
    rec=run(np.array(L+[0,1]+Rr),floor=0.5,c=1e-4)
    i0=int(rec[0,1]); n=0
    while n<len(rec) and int(rec[n,1])==i0: n+=1
    print(" K",K,"eps",eps,"Theta0 %.8f"%rec[0,2],"peak while minimal %.8f"%rec[:n,2].max(),"rise %.2e"%(rec[:n,2].max()-rec[0,2]),"tenure s=%.2e"%rec[n-1,0],"Theta after transfer %.4f"%(rec[n,2] if n<len(rec) else float('nan')))
