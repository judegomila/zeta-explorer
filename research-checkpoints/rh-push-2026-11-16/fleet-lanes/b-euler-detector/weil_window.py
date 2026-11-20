"""Admissible window for the prime-2 coefficient under Weil positivity with zeta's bridge, support ln2 < 2a < ln3:
 { t in C : form with c(2) = t ln 2 is >= 0 on tests supported in [-a,a] } (convex). Also convergence of the class-uniform radius in n.
Run: python -I weil_window.py"""
import math, json
import numpy as np
import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from weil_class import build, lam_min
def lam_t(a,n,t,cache={}):
    key=(a,n)
    if key not in cache:
        A,Pole,shift,h=build(a,n); S=shift(math.log(2)); cache[key]=(A+Pole,S)
    M0,S=cache[key]; w=math.log(2)/math.sqrt(2)
    M=M0.astype(complex)-w*(t*S+np.conj(t)*S.T)
    return np.linalg.eigvalsh((M+M.conj().T)/2)[0]
def edge(a,n,direction,tmax=3.0):
    # largest r>=0 with lam(1 + r*direction) >= 0
    if lam_t(a,n,1.0)<=0: return 0.0
    lo,hi=0.0,tmax
    if lam_t(a,n,1+hi*direction)>0: return float('inf')
    for _ in range(40):
        mid=(lo+hi)/2
        if lam_t(a,n,1+mid*direction)>0: lo=mid
        else: hi=mid
    return lo
out=[]
for a in (0.36,0.40,0.45,0.50,0.5493):
    for n in (200,400):
        r={'a':a,'2a':2*a,'n':n,'lam_zeta':float(lam_t(a,n,1.0)),'t_minus':1-edge(a,n,-1),'t_plus':1+edge(a,n,1),'imag_halfwidth':edge(a,n,1j)}
        out.append(r); print(r,flush=True)
def cu_radius(n):
    f=lambda a: lam_min(a,n,{2:-1.0})
    lo,hi=0.3466,0.40
    for _ in range(22):
        mid=(lo+hi)/2
        if f(mid)>0: lo=mid
        else: hi=mid
    return 2*lo
rad={n:cu_radius(n) for n in (150,300,600)}
print('class-uniform radius 2a vs n',rad)
json.dump({'window':out,'class_uniform_radius_2a_vs_n':rad},open('weil_window.json','w'),indent=1)
