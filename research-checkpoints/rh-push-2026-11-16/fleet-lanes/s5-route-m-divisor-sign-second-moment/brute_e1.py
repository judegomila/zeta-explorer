# E1(b) from the definition L1(b) = sum_{a<b,(a,b)=1} a log a, 80-bit accumulation in blocks (check of the divisor identity at one large b)
import numpy as np, sys, math
b=int(sys.argv[1]); CH=1<<22; print('planned memory per block %.2f GB'%(CH*8*4/1e9))
tot=np.longdouble(0); phi=0
for lo in range(1,b,CH):
    a=np.arange(lo,min(lo+CH,b),dtype=np.int64); m=np.gcd(a,b)==1; a=a[m].astype(np.longdouble); phi+=len(a)
    tot+=np.sum(a*np.log(a))
E1=tot-np.longdouble(phi)*b*(np.log(np.longdouble(b))/2-np.longdouble(0.25))
print('b',b,'phi',phi,'E1/b from the definition = %.12f'%float(E1/b))
