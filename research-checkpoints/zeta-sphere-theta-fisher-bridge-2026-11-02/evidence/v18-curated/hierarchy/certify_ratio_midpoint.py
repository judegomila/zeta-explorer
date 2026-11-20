"""Original interval midpoint enclosure. No downloaded code. Provisional until reviewed."""
import mpmath as mp
from mpmath import iv
import json,time
mp.mp.dps=45;iv.dps=40
C=[91,-308,347,39,-445,277,277,-445,39,347,-308,91]
def psi012(x):
    sign=1
    if x.b<=0: x=-x;sign=-1
    elif x.a<0: raise ValueError('crosses origin')
    r0=iv.pi*iv.exp(2*x); e=4*iv.exp(x/2)
    S=[iv.mpf(0),iv.mpf(0),iv.mpf(0)]
    for k in range(1,7):
        r=r0*k*k;ex=iv.exp(-r)
        p0=2*r*r-3*r
        p1=-4*r**3+15*r*r-iv.mpf(15)*r/2
        p2=8*r**4-56*r**3+iv.mpf(165)*r*r/2-iv.mpf(75)*r/4
        for j,p in enumerate([p0,p1,p2]):S[j]+=e*p*ex
    # Uniform j<=2 omitted-index bound is proven in companion note.
    tail=iv.mpf('1e-45')*iv.exp(x/2-r0)*(1+r0)**4
    err=iv.mpf([-1,1])*tail
    return S[0]+err,sign*(S[1]+err),S[2]+err

def integrands(x,v):
    A=psi012(x-v);B=psi012(x+v)
    P=A[0]*B[0];Q=A[1]*B[0]+A[0]*B[1]
    R=A[2]*B[0]+2*A[1]*B[1]+A[0]*B[2]
    return [x**k*P for k in [8,10]], [k*(k-1)*x**(k-2)*P+2*k*x**(k-1)*Q+x**k*R for k in [8,10]]

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
        center,_=integrands(iv.mpf(mid),vi)
        _,dd=integrands(iv.mpf([lo,hi]),vi)
        err=[abs(x)*iv.mpf(d)**3/24 for x in dd]
        if any(e.b>tol[j]*d/4 for j,e in enumerate(err)):
            stack.extend([(lo,mid),(mid,hi)]);continue
        for j in range(2):total[j]+=center[j]*iv.mpf(d)+iv.mpf([-1,1])*err[j]
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
        for k in range(12):Q+=C[j]*C[k]*iv.mpf(out[abs(j-k)])
    print('Q enclosure',Q,flush=True)
