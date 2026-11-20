import numpy as np
from cm2 import *
def report(x,name):
    rec=run(x,floor=5e-2,c=4e-3)
    idx=rec[:,1].astype(int)
    sw=np.nonzero(np.diff(idx)!=0)[0]
    print(name,"N",len(x),"initial min idx",idx[0],"Theta",round(rec[0,2],4),"rho",round(rec[0,4],4))
    for k in sw[:4]:
        print("   transfer at s=%.5f idx %d->%d  Theta %.4f->%.4f  rho %.4f->%.4f"%(rec[k+1,0],idx[k],idx[k+1],rec[k,2],rec[k+1,2],rec[k,4],rec[k+1,4]))
    print("   eta/m monotone:",bool(np.all(np.diff((1-rec[:,2])/rec[:,3])>-1e-9)),"sup Theta_min",round(rec[:,2].max(),4), "final idx",idx[-1],"final rho",round(rec[-1,4],4))
# A: symmetric shells, rho_A = 0.6 < c_half ; B: pair + lone neighbour, rho_B = 0.953 > c_half, lower Theta
A=[-5.2,-3.2,-1.667,0,1,2.667,4.2,6.2]
gB=1.004; B0=60.0
B=[B0,B0+gB,B0+gB+1.004/0.953]
report(np.array(A+B),"Ex1 (rho-basin not closed under transfer)")
