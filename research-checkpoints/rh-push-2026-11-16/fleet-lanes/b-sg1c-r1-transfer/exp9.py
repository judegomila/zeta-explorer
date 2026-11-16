import numpy as np
from cm2 import *
def R_of(x,c=1e-3,floor=1e-3):
    rec=run(np.array(x),floor=floor,c=c)
    return 8*(1-rec[0,2])*tc_est(rec)/rec[0,3]**2, rec[0,2], rec[:,2].max()
print("triplet check",R_of([-1,0,1]))
for d in (1.06,1.068,1.071,1.0725,1.0731,1.0735,1.075,1.08,1.09):
    print(d,R_of([-d,0,1,1+d]))
print("convergence d=1.0731:",R_of([-1.0731,0,1,2.0731],c=4e-3,floor=1e-2)[0],R_of([-1.0731,0,1,2.0731],c=5e-4,floor=1e-4)[0])
