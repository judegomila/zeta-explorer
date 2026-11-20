# s0_F = (1/(4 pi)) int |F(1/2+it)|^4/(1/4+t^2)^2 dt  (limit of Q_F(b)/phi(b); Theorem 2 of b-route-m-first-moment for zeta)
# kappa2_F = same with |F|^2: A_F(1) = (1/(2 pi)) int |F|^2/(1/4+t^2) dt  (check value: zeta gives log(2 pi) - gamma)
import json, sys
from mpmath import mp, mpf, zeta, quad, pi, cos, log, linspace, euler
mp.dps=18
def hur(c,q):
    return lambda s: sum(c[r-1]*zeta(s,mpf(r)/q) for r in range(1,q) if c[r-1]!=0)/mpf(q)**s
xi=mpf('0.28407904384041227')
objs={'zeta':zeta,'chi_-4':hur([1,0,-1],4),'chi_5':hur([1,-1,-1,1],5),'DH':hur([1,xi,-xi,-1],5)}
T=float(sys.argv[1]) if len(sys.argv)>1 else 400
out={}
for name,F in objs.items():
    f4=lambda t: abs(F(mpf(1)/2+1j*t))**4/(mpf(1)/4+t*t)**2
    f2=lambda t: abs(F(mpf(1)/2+1j*t))**2/(mpf(1)/4+t*t)
    pts=[mpf(k) for k in range(0,int(T)+1,2)]
    s4=2*quad(f4,pts,maxdegree=5)/(4*pi)
    s2=2*quad(f2,pts,maxdegree=5)/(2*pi)
    out[name]={'s0':float(s4),'A1_partial':float(s2),'T':T}; print(name,out[name],flush=True)
    if name=='zeta':
        for q,c in ((2,2.1),(3,2.2),(101,2.2)):
            lq=log(q); g4=lambda t: f4(t)*(2*cos(t*lq)+c)**4
            pts2=[mpf(k)/4 for k in range(0,4*int(min(T,200))+1)] if q==101 else pts
            v=2*quad(g4,pts2,maxdegree=5)/(4*pi); out['tnr%d'%q]={'s0':float(v),'mean_factor':c**4+12*c*c+6,'factor_small_b':(c*c+2)**2}; print('tnr',q,out['tnr%d'%q],flush=True)
print('log(2pi)-gamma =',float(log(2*pi)-euler))
json.dump(out,open('consts2.json','w'),indent=1)
