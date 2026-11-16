"""sigma*(DH): 2*sum_{p = +-2 mod 5} arctan(p^-sigma) = pi - 2 arctan(kappa). Primes <= X exactly (float64), tail p>X by PNT in APs:
 2 * (1/2) * E1((sigma-1) log X).  Run: python -I dh_sigma_star.py"""
import math, json
import numpy as np
from mpmath import e1
kappa=(math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1); T=math.pi-2*math.atan(kappa)
X=10**8
s=np.ones(X+1,bool); s[:2]=False
for i in range(2,int(X**0.5)+1):
    if s[i]: s[i*i::i]=False
P=np.nonzero(s)[0]; del s
P=P[(P%5==2)|(P%5==3)].astype(float); LP=np.log(P)
res={}
for XX in (10**5,10**6,10**7,10**8):
    lp=LP[P<=XX]
    f=lambda sg: 2*math.fsum(np.arctan(np.exp(-sg*lp)))+float(e1((sg-1)*math.log(XX)))-T
    lo,hi=1.01,2.0
    for _ in range(60):
        mid=(lo+hi)/2
        if f(mid)>0: lo=mid
        else: hi=mid
    res[XX]=lo; print(XX,repr(lo),flush=True)
json.dump({'target':T,'kappa':kappa,'sigma_star_by_X':res},open('dh_sigma_star.json','w'),indent=1)
