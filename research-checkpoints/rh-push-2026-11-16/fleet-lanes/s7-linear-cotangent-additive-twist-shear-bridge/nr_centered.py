# centred T-NR, F = zeta(s)(q^{s-1/2} + c + q^{1/2-s}) (frequencies n/q, n, nq):
# w_F(x) = c w(x) + q^{-1/2} w(qx) + q^{1/2} w(x/q), w = zeta's symmetric sum extended to all positive rationals.
import numpy as np, math, json
from fractions import Fraction
PI=math.pi; EG=0.5772156649015329
def Vl(h,k):
    assert k<60_000_000, "planned allocation %d x 24 bytes exceeds the local budget"%k
    h%=k
    if k==1 or h==0: return 0.0
    m=np.arange(1,k,dtype=np.int64); t=(m*h)%k
    return float(((0.5-t/k)/np.tan(PI*m/k)).sum())
def w(fr):
    p,q=fr.numerator,fr.denominator; return (Vl(p,q)+Vl(q,p))/q
def E(x): return (1+x)*(-EG/2+0.5*math.log(2*PI))+0.5*(1-x)*math.log(x)
def psi(fr): return w(fr)+(2/PI)*E(float(fr))
def psiNR(fr,q,c): return c*psi(fr)+psi(fr*q)/math.sqrt(q)+math.sqrt(q)*psi(fr/q)
out=[]
for q,c,ns in [(101,2.2,[25,50,100,200,400,800]),(1000003,2.2,[3,6])]:
    for (p,r) in [(1,2),(1,3),(2,5),(3,7)]:
        for n in ns:
            # Farey-type neighbours of p/r: (n p + a)/(n r + b) with p b - r a = +-1
            a,b=next((a,b) for a in range(0,r+1) for b in range(1,r+1) if p*b-r*a==1)
            lo=Fraction(n*p+a,n*r+b); hi=Fraction(n*p+(p-a),n*r+(r-b))
            if not (lo<Fraction(p,r)<hi): lo,hi=min(lo,hi),max(lo,hi)
            dz=psi(hi)-psi(lo); dn=psiNR(hi,q,c)-psiNR(lo,q,c)
            out.append({'q':q,'p/r':f'{p}/{r}','n':n,'gap':float(hi-lo),'d_psi_zeta':dz,'d_psi_NR_centred':dn})
            print(q,f'{p}/{r}',n,'gap %.2e'%float(hi-lo),'zeta % .3e'%dz,'NR centred % .3e'%dn,flush=True)
json.dump(out,open('out/nr_centered.json','w'),indent=1)
