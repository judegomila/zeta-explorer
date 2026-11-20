"""Original interval midpoint enclosure. No downloaded code. Provisional until reviewed."""
import mpmath as mp
from mpmath import iv
import json,time
mp.mp.dps=45;iv.dps=40
C=[91,-308,347,39,-445,277,277,-445,39,347,-308,91]
from math import comb, factorial
COEFF=[[2,-3,0],[-4,15,'-15/2',0],[8,-56,'165/2','-75/4',0],[-16,180,-529,'1635/4','-375/8',0],[32,-528,2588,-4256,'15465/8','-1875/16',0]]
COEFF=[[iv.mpf(c) for c in row] for row in COEFF]
def psi(x,derivs=5):
    sign=1
    if x.b<=0:x=-x;sign=-1
    elif x.a<0: x=abs(x);sign=iv.mpf([-1,1])
    r0=iv.pi*iv.exp(2*x);e=4*iv.exp(x/2)
    S=[iv.mpf(0) for _ in range(derivs)]
    for k in range(1,7):
        r=r0*k*k;ex=iv.exp(-r)
        for j in range(derivs):
            pol=COEFF[j][0]
            for c in COEFF[j][1:]:pol=pol*r+c
            S[j]+=e*pol*ex
    tail=iv.mpf('1e-45')*iv.exp(x/2-r0)*(1+r0)**6
    err=iv.mpf([-1,1])*tail
    return [(S[j]+err)*(sign if j%2 else 1) for j in range(derivs)]
def vals(x,v):
    P=psi(x-v,1)[0]*psi(x+v,1)[0]
    return [x**k*P for k in [8,10]]
def fourths(x,v):
    A=psi(x-v);B=psi(x+v)
    P=[sum((comb(m,l)*A[l]*B[m-l] for l in range(m+1)),iv.mpf(0)) for m in range(5)]
    return [sum((comb(4,j)*(factorial(k)//factorial(k-j))*x**(k-j)*P[4-j] for j in range(5)),iv.mpf(0)) for k in [8,10]]

def enclosed(v,tolrel='1e-7'):
    # Crude numerical magnitude determines requested tolerance, not correctness.
    def ps(x):
        x=abs(x);r=mp.pi*mp.exp(2*x)
        return 4*mp.exp(x/2)*sum((r*k*k)*(2*r*k*k-3)*mp.exp(-r*k*k) for k in range(1,7))
    est=[mp.quad(lambda h:h**k*ps(h-v)*ps(h+v),[0,v,2,4]) for k in [8,10]]
    tol=[x*mp.mpf(tolrel) for x in est]
    vi=iv.mpf(v);total=[iv.mpf(0),iv.mpf(0)];stack=[(mp.mpf(0),v),(v,mp.mpf(4))] if v else [(mp.mpf(0),mp.mpf(4))]
    count=0
    while stack:
        lo,hi=stack.pop();d=hi-lo
        if d==0:continue
        mid=(lo+hi)/2
        left=vals(iv.mpf(lo),vi);center=vals(iv.mpf(mid),vi);right=vals(iv.mpf(hi),vi)
        dd=fourths(iv.mpf([lo,hi]),vi)
        err=[abs(x)*iv.mpf(d)**5/2880 for x in dd]
        if any(e.b>tol[j]*d/4 for j,e in enumerate(err)):
            stack.extend([(lo,mid),(mid,hi)]);continue
        for j in range(2):total[j]+=(left[j]+4*center[j]+right[j])*iv.mpf(d)/6+iv.mpf([-1,1])*err[j]
        count+=1
    # h>=4 tail <1e-400 for v in [0,1.375], k=8,10 (see note).
    total=[t+iv.mpf([0,mp.mpf('1e-400')]) for t in total]
    return total[1]/total[0],count
if __name__=='__main__':
    out=[];t=time.time()
    for j in range(12):
        r,n=enclosed(mp.mpf(j)/8)
        print(j,str(r),'leaves',n,'secs',time.time()-t,flush=True)
        out.append([str(mp.mpf(r.a)),str(mp.mpf(r.b))])
        with open('/workspace/shared/zeta_sphere_campaign/hierarchy/ratio_intervals.json','w') as f:json.dump(out,f,indent=2)
    Q=iv.mpf(0)
    for j in range(12):
        for k in range(12):Q+=C[j]*C[k]*(iv.mpf(out[abs(j-k)])+iv.mpf([-1,1])*iv.mpf("1e-30"))
    print('Q enclosure',Q,flush=True)
