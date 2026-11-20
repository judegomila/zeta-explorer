# polish.py udir agg.npz ntop out.npy : direct Riemann-Siegel summation (double, exact integer phase) refinement of the closest pairs
import sys, numpy as np, math, mpmath as mp, time
from numba import njit
import engine as E
mp.mp.dps=60
TWOPI=2*math.pi
@njit(cache=True)
def phis(T0,uhi,ulo,K,ph):
    sc=TWOPI/18446744073709551616.0
    for n in range(1,K+1):
        f=T0*uhi[n]+E.mulhi64(T0,ulo[n])
        ph[n-1]=np.float64(f)*sc
@njit(cache=True,fastmath=False)
def Zdir(tau,T0f,th0,th1,th2,ph,logn):
    t=T0f+tau
    sq=math.sqrt(t/TWOPI); K=int(math.floor(sq))
    th=th0+th1*tau+0.5*th2*tau*tau
    s=0.0; c=0.0; ds=0.0; dc=0.0
    for n in range(1,K+1):
        a=2.0/math.sqrt(n)
        x=th-ph[n-1]-tau*logn[n]
        y=a*math.cos(x)-c; tt=s+y; c=(tt-s)-y; s=tt
        y=-a*math.sin(x)*(th1+th2*tau-logn[n])-dc; tt=ds+y; dc=(tt-ds)-y; ds=tt
    p=sq-K
    R=math.sqrt(math.sqrt(TWOPI/t))*E.psi(p)
    if K%2==0: R=-R
    return s+R,ds
def illinois(f,a,b,fa,fb,tol=1e-13):
    side=0
    for it in range(60):
        if abs(b-a)<tol: break
        c=(a*fb-b*fa)/(fb-fa)
        if not (min(a,b)<c<max(a,b)): c=0.5*(a+b)
        fc=f(c)
        if fc==0: return c
        if (fc>0)==(fb>0):
            b,fb=c,fc
            if side==-1: fa*=0.5
            side=-1
        else:
            a,fa=c,fc
            if side==1: fb*=0.5
            side=1
    return (a*fb-b*fa)/(fb-fa)
if __name__=="__main__":
    udir,agg,ntop,out=sys.argv[1],sys.argv[2],int(sys.argv[3]),sys.argv[4]
    uhi,ulo,_=E.load_u(udir)
    logn=np.log(np.maximum(np.arange(len(uhi),dtype=np.float64),1.0))
    z=np.load(agg); recs=z["recs"]
    JT={int(j):int(t) for j,t in zip(z['j'],z['T0'])}
    start=int(sys.argv[5]) if len(sys.argv)>5 else 0
    order=np.argsort(recs[:,4])[start:ntop]
    res=[]; T1s={}
    for i in order:
        r=recs[i]; T0=JT[int(r[0])]; h=r[10]; a,b=r[2]*h,r[3]*h; mid=0.5*(a+b)
        sh=int(round(mid)); T1=T0+sh; ta,tb=a-sh,b-sh; T1s[int(i)]=T1
        T=mp.mpf(T1); th0=mp.siegeltheta(T); th0=float(th0-2*mp.pi*mp.floor(th0/(2*mp.pi)))
        th1=float(mp.siegeltheta(T,derivative=1)); th2=float(mp.siegeltheta(T,derivative=2))
        K=int(math.floor(math.sqrt((T1+2)/TWOPI)))+1
        ph=np.empty(K); phis(np.uint64(T1),uhi,ulo,K,ph)
        fZ=lambda x: Zdir(x,float(T1),th0,th1,th2,ph,logn)[0]
        fD=lambda x: Zdir(x,float(T1),th0,th1,th2,ph,logn)[1]
        gap=tb-ta; w=max(gap,2e-5)
        # extremum between: root of Z' in [ta-w, tb+w]
        lo,hi=ta-0.5*w,tb+0.5*w
        dlo,dhi=fD(lo),fD(hi)
        if dlo*dhi>0:
            res.append([i,T1,ta,tb,gap,np.nan,np.nan,np.nan,np.nan,np.nan,0]); continue
        tm=illinois(fD,lo,hi,dlo,dhi); zm=fZ(tm)
        zlo,zhi=fZ(lo),fZ(hi)
        k=0
        while (zlo*zm>0 or zhi*zm>0) and k<6:
            lo-=w; hi+=w; zlo,zhi=fZ(lo),fZ(hi); k+=1
        if zlo*zm>0 or zhi*zm>0:
            res.append([i,T1,ta,tb,gap,np.nan,np.nan,tm,zm,np.nan,-1]); continue
        ra=illinois(fZ,lo,tm,zlo,zm); rb=illinois(fZ,tm,hi,zm,zhi)
        da=fD(ra); db=fD(rb)
        res.append([i,T1,ra,rb,rb-ra,da,db,tm,zm,r[4],1])
        print(len(res),T1,"gap",rb-ra,"norm",(rb-ra)*th1/math.pi,"nufft-norm",r[4],"Z*",zm,"Z'",da,db,flush=True)
    np.save(out,np.array(res,dtype=np.float64))
    import json; json.dump(T1s,open(out+'.T1.json','w'))
