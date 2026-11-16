"""Formal lab II (no FE): DH-pattern two-term twin whose Euler factors agree at every prime <= P.
Right edge sigma*(P): 2 * sum_{p>P, p=+-2 mod 5} arctan(p^-sigma) = T.   Run: python -I formal_tail.py"""
import math, json
import numpy as np
from mpmath import e1, mpf
X=10**7
s=np.ones(X+1,bool); s[:2]=False
for i in range(2,int(X**0.5)+1):
    if s[i]: s[i*i::i]=False
PR=np.nonzero(s)[0]; PR=PR[(PR%5==2)|(PR%5==3)].astype(float); LP=np.log(PR)
kappa=(math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
def G(sig,P):
    m=PR>P
    return 2*np.arctan(np.exp(-sig*LP[m])).sum()+2*0.5*float(e1(mpf(sig-1)*math.log(X)))
rows=[]
for T,name in ((math.pi-2*math.atan(kappa),'DH target 2.588'),(2*math.atan(kappa),'easy target 0.5536 (omega=-1)')):
    for P in (0,2,3,7,13,23,47,97,997,9973,99991,999983):
        lo,hi=-40.0,math.log(3.0)      # log(sigma-1)
        for _ in range(80):
            mid=(lo+hi)/2
            if G(1+math.exp(mid),P)>=T: lo=mid
            else: hi=mid
        st=1+math.exp(lo)
        rows.append({'target':name,'P':P,'sigma_star':st,'sigma_star_minus_1':st-1,'(sigma*-1)*log P':(st-1)*math.log(P) if P>1 else None})
        print(rows[-1])
json.dump(rows,open('formal_tail.json','w'),indent=1)
