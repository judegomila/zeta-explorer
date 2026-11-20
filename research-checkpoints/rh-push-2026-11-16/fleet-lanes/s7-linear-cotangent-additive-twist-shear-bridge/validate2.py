import numpy as np, math
from fractions import Fraction
from vlib import *
K=400
def load(name): return np.fromfile(f'loc/t_{name}_w.bin'), np.fromfile(f'loc/t_{name}_V.bin')
idx=lambda k,h:(k-1)*(k-2)//2+h-1
worst=0
for fn in ['zeta','chi4','chi5','dh']:
    W,V=load(fn)
    for k in [7,31,101,233,399,400]:
        if fn in PER and math.gcd(k,len(PER[fn]))>1: continue
        C=C_table(fn,k); v=V_all(k,C)
        for h in range(1,k):
            if math.gcd(h,k)==1: worst=max(worst,abs(v[h-1]-V[idx(k,h)])/(1+abs(v[h-1])))
print('C table vs numpy, worst rel',worst)
# T-NR identity: w_NR(x) = c w(x) + q^-1/2 w(qx) + q^1/2 w(x/q), w extended to all positive rationals
Wz,Vz=load('zeta')
def Vl(h,k):  # linear zeta V, any h, any k>=1
    h%=k
    if k==1 or h==0: return 0.0
    return V_direct('zeta',h,k)
def wz(fr):
    p,q=fr.numerator,fr.denominator; return (Vl(p,q)+Vl(q,p))/q
for q,c,name in [(101,2.2,'nr_101_2.2'),(1000003,2.2,'nr_1000003_2.2')]:
    W,_=load(name); worst=0
    for (h,k) in [(1,2),(2,7),(5,13),(30,101),(100,399),(150,399),(7,50),(111,400),(3,400)]:
        if k%q==0 or h%q==0 or math.gcd(h,k)>1: continue
        x=Fraction(h,k); pred=c*wz(x)+wz(x*q)/math.sqrt(q)+math.sqrt(q)*wz(x/q)
        worst=max(worst,abs(pred-W[idx(k,h)])/(1+abs(pred)))
    print('T-NR q',q,'identity worst rel',worst)
# leaf check
for fn,b in [('zeta',4001),('dh',4001),('chi5',4001)]:
    va=np.fromfile(f'loc/leaf_{fn}_{b}.bin'); worst=0
    for a in [2,3,17,400,1999,3999]:
        if fn in PER and math.gcd(a,len(PER[fn]))>1: continue
        worst=max(worst,abs(va[a]-V_direct(fn,b%a,a)))
    print('leaf',fn,worst)
