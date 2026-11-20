# Riemann-Siegel Z(t) on a window via type-1 NUFFT + band-limited (Kaiser-sinc) interpolation; all zeros in the window.
# t = T0 + kappa*h, h = 2pi/(OSF*theta'(T0)); mean zero spacing = OSF/2 grid units.
import numpy as np, math, mpmath as mp, finufft, time
from scipy.special import i0 as bi0, i1 as bi1
from numba import njit
mp.mp.dps=60
OSF=8; W=10; NT=4096; BETA=math.pi*W*(1-1.0/OSF)
TWOPI=2*math.pi
TWOPI_MP=2*mp.pi
import os
CHUNK=int(os.environ.get('RS_CHUNK','50000000'))

def make_tabs():
    f=(np.arange(NT+3)-1)/NT
    m=np.arange(2*W)-W+1
    d=f[:,None]-m[None,:]
    arg=1-(d/W)**2; arg[arg<0]=0; s=np.sqrt(arg)
    kb=bi0(BETA*s)/bi0(BETA)
    with np.errstate(divide='ignore',invalid='ignore'):
        kbd=np.where(s>1e-8, bi1(BETA*s)*BETA*(-d/W**2)/np.where(s>1e-8,s,1)/bi0(BETA), BETA**2/2*(-d/W**2)/bi0(BETA))
        sd=np.where(np.abs(d)>1e-9,(np.cos(np.pi*d)*np.pi*d-np.sin(np.pi*d))/(np.pi*d*d),0.0)
    sc=np.sinc(d)
    w=sc*kb; wd=sd*kb+sc*kbd
    w[np.abs(d)>W]=0; wd[np.abs(d)>W]=0
    return np.ascontiguousarray(w),np.ascontiguousarray(wd)
WTAB,WDTAB=make_tabs()

@njit(cache=True)
def mulhi64(a,b):
    M32=np.uint64(0xFFFFFFFF); s=np.uint64(32)
    a0=a&M32; a1=a>>s; b0=b&M32; b1=b>>s
    t=a0*b0; k=t>>s
    t=a1*b0+k; w1=t&M32; w2=t>>s
    t=a0*b1+w1; k=t>>s
    return a1*b1+w2+k

@njit(cache=True)
def coeffs(T0,uhi,ulo,h,th1,n0,n1,c,x):
    # terms n0..n1-1 : c = n^-1/2 e^{-i T0 log n} (exact integer phase), x = h(log n - th1/2)
    sc=TWOPI/18446744073709551616.0
    for n in range(n0,n1):
        f=T0*uhi[n]+mulhi64(T0,ulo[n])
        ph=np.float64(f)*sc
        a=1.0/math.sqrt(n)
        x[n-n0]=h*(math.log(n)-0.5*th1)
        c[n-n0]=complex(a*math.cos(ph),-a*math.sin(ph))

@njit(cache=True)
def psi(p):
    c=math.cos(TWOPI*p)
    if abs(c)<1e-5:
        e=1e-4
        return 0.5*(math.cos(TWOPI*((p+e)*(p+e)-(p+e)-0.0625))/math.cos(TWOPI*(p+e))+math.cos(TWOPI*((p-e)*(p-e)-(p-e)-0.0625))/math.cos(TWOPI*(p-e)))
    return math.cos(TWOPI*(p*p-p-0.0625))/c

@njit(cache=True)
def tail(kap,ph,dph,par,xphi,want_d):
    # extra main-sum terms n in (Kc, K(t)] and the C0 remainder
    t=par[5]+kap*par[1]
    sq=math.sqrt(t/TWOPI)
    K=math.floor(sq); Kc=par[6]
    ne=int(K-Kc)
    Z=0.0; dZ=0.0
    for e in range(ne):
        n=Kc+1+e
        a=2.0/math.sqrt(n)
        phase=ph-(xphi[0,e]+kap*xphi[1,e])
        Z+=a*math.cos(phase)
        if want_d: dZ-=a*math.sin(phase)*(dph-xphi[1,e])
    R=math.sqrt(math.sqrt(TWOPI/t))*psi(sq-K)
    if int(K)%2==0: R=-R
    return Z+R,dZ

@njit(cache=True)
def evalZ(kap,G,wtab,wdtab,par,xphi):
    Mh=par[0]; h=par[1]
    y=kap+Mh
    j=int(math.floor(y)); f=y-j
    r=f*NT; i0=int(math.floor(r+0.5)); u=r-i0
    l0=0.5*u*(u-1); l1=1-u*u; l2=0.5*u*(u+1)
    gr=0.0; gi=0.0; pr=0.0; pi_=0.0
    base=j-W+1
    for m in range(2*W):
        w=l0*wtab[i0,m]+l1*wtab[i0+1,m]+l2*wtab[i0+2,m]
        wd=l0*wdtab[i0,m]+l1*wdtab[i0+1,m]+l2*wdtab[i0+2,m]
        z=G[base+m]; gr+=w*z.real; gi+=w*z.imag; pr+=wd*z.real; pi_+=wd*z.imag
    tau=kap*h
    kint=math.floor(kap)
    lin=((kint%(2*OSF))+(kap-kint))*(math.pi/OSF)
    ph=par[2]+lin+0.5*par[3]*tau*tau+par[4]*tau*tau*tau/6.0
    dph=math.pi/OSF+(par[3]*tau+0.5*par[4]*tau*tau)*h
    c=math.cos(ph); s=math.sin(ph)
    Z=2*(c*gr-s*gi)
    dZ=2*(c*(pr-dph*gi)-s*(pi_+dph*gr))
    tz,td=tail(kap,ph,dph,par,xphi,True)
    return Z+tz,dZ+td

@njit(cache=True)
def evalZ0(kap,G,wtab,par,xphi):
    Mh=par[0]; h=par[1]
    y=kap+Mh
    j=int(math.floor(y)); f=y-j
    r=f*NT; i0=int(math.floor(r+0.5)); u=r-i0
    l0=0.5*u*(u-1); l1=1-u*u; l2=0.5*u*(u+1)
    gr=0.0; gi=0.0
    base=j-W+1
    for m in range(2*W):
        w=l0*wtab[i0,m]+l1*wtab[i0+1,m]+l2*wtab[i0+2,m]
        z=G[base+m]; gr+=w*z.real; gi+=w*z.imag
    tau=kap*h
    kint=math.floor(kap)
    lin=((kint%(2*OSF))+(kap-kint))*(math.pi/OSF)
    ph=par[2]+lin+0.5*par[3]*tau*tau+par[4]*tau*tau*tau/6.0
    Z=2*(math.cos(ph)*gr-math.sin(ph)*gi)
    tz,td=tail(kap,ph,0.0,par,xphi,False)
    return Z+tz

@njit(cache=True)
def evalZg(j,G,wd0,par,xphi):
    Mh=par[0]; h=par[1]
    kap=j-Mh
    g=G[j]
    pr=0.0; pi_=0.0
    base=j-W+1
    for m in range(2*W):
        z=G[base+m]; pr+=wd0[m]*z.real; pi_+=wd0[m]*z.imag
    tau=kap*h
    lin=(int(kap)%(2*OSF))*(math.pi/OSF)
    ph=par[2]+lin+0.5*par[3]*tau*tau+par[4]*tau*tau*tau/6.0
    dph=math.pi/OSF+(par[3]*tau+0.5*par[4]*tau*tau)*h
    c=math.cos(ph); s=math.sin(ph)
    Z=2*(c*g.real-s*g.imag)
    dZ=2*(c*(pr-dph*g.imag)-s*(pi_+dph*g.real))
    tz,td=tail(kap,ph,dph,par,xphi,True)
    return Z+tz,dZ+td

@njit(cache=True)
def root(a,b,fa,fb,which,G,wtab,wdtab,par,xphi):
    # Illinois on Z (which=0) or dZ (which=1), bracket [a,b]
    side=0
    for it in range(80):
        if abs(b-a)<2e-10: break
        c=(a*fb-b*fa)/(fb-fa)
        if not (c>min(a,b) and c<max(a,b)): c=0.5*(a+b)
        if which==1:
            z,fc=evalZ(c,G,wtab,wdtab,par,xphi)
        else:
            fc=evalZ0(c,G,wtab,par,xphi)
        if fc==0.0: return c
        if (fc>0)==(fb>0):
            b=c; fb=fc
            if side==-1: fa*=0.5
            side=-1
        else:
            a=c; fa=fc
            if side==1: fb*=0.5
            side=1
    return 0.5*(a+b) if abs(fb-fa)==0 else (a*fb-b*fa)/(fb-fa)

@njit(cache=True)
def root_fast(ka,za,zb,da,db,G,wtab,wdtab,par,xphi):
    # single simple root in [ka,ka+1]: Hermite-cubic guess, then secant; falls back to Illinois
    c0=za; c1=da; c2=3*(zb-za)-2*da-db; c3=2*(za-zb)+da+db
    x=za/(za-zb)
    for it in range(4):
        p=c0+x*(c1+x*(c2+x*c3)); dp=c1+x*(2*c2+3*x*c3)
        if dp==0: break
        x-=p/dp
    if not (x>0 and x<1): return root(ka,ka+1.0,za,zb,0,G,wtab,wdtab,par,xphi)
    dp=c1+x*(2*c2+3*x*c3)
    f0=evalZ0(ka+x,G,wtab,par,xphi)
    if dp==0: return root(ka,ka+1.0,za,zb,0,G,wtab,wdtab,par,xphi)
    x1=x-f0/dp
    if not (x1>0 and x1<1) or abs(x1-x)>0.05: return root(ka,ka+1.0,za,zb,0,G,wtab,wdtab,par,xphi)
    f1=evalZ0(ka+x1,G,wtab,par,xphi)
    if f1==f0: return ka+x1
    x2=x1-f1*(x1-x)/(f1-f0)
    if abs(x2-x1)<1e-7: return ka+x2
    f2=evalZ0(ka+x2,G,wtab,par,xphi)
    if f2==f1: return ka+x2
    x3=x2-f2*(x2-x1)/(f2-f1)
    if abs(x3-x2)>1e-6 or not (x3>0 and x3<1): return root(ka,ka+1.0,za,zb,0,G,wtab,wdtab,par,xphi)
    return ka+x3

@njit(cache=True)
def simple_iv(ka,kb,za,zb,da,db,G,wtab,wdtab,par,xphi,zs,fl,nz,unres,nu):
    if za*zb<0:
        zs[nz]=root(ka,kb,za,zb,0,G,wtab,wdtab,par,xphi); fl[nz]=0; nz+=1
    elif (za>0 and da<0 and db>0) or (za<0 and da>0 and db<0):
        ks=root(ka,kb,da,db,1,G,wtab,wdtab,par,xphi)
        zsv=evalZ0(ks,G,wtab,par,xphi)
        if zsv*za<0:
            zs[nz]=root(ka,ks,za,zsv,0,G,wtab,wdtab,par,xphi); fl[nz]=0; nz+=1
            zs[nz]=root(ks,kb,zsv,zb,0,G,wtab,wdtab,par,xphi); fl[nz]=0; nz+=1
        else:
            zs[nz]=ks; fl[nz]=1; nz+=1
            zs[nz]=ks; fl[nz]=1; nz+=1
            if nu<unres.shape[0]-2:
                unres[nu,0]=ks; unres[nu,1]=zsv; nu+=1
    return nz,nu

@njit(cache=True)
def cubic_minabs_monotone(za,zb,da,db):
    c0=za; c1=da; c2=3*(zb-za)-2*da-db; c3=2*(za-zb)+da+db
    lo=min(za,zb); hi=max(za,zb); mono=True
    A=3*c3; B=2*c2; C=c1
    if abs(A)<1e-300:
        if abs(B)>1e-300:
            x=-C/B
            if x>0 and x<1:
                v=c0+x*(c1+x*(c2+x*c3)); lo=min(lo,v); hi=max(hi,v); mono=False
    else:
        D=B*B-4*A*C
        if D>0:
            sq=math.sqrt(D)
            for sgn in (-1.0,1.0):
                x=(-B+sgn*sq)/(2*A)
                if x>0 and x<1:
                    v=c0+x*(c1+x*(c2+x*c3)); lo=min(lo,v); hi=max(hi,v); mono=False
    if lo<=0 and hi>=0: return 0.0,mono
    return min(abs(lo),abs(hi)),mono

@njit(cache=True)
def find_zeros(G,wtab,wdtab,par,xphi,jlo,jhi,zs,fl,unres):
    Mh=par[0]
    wd0=wdtab[1].copy()
    nz=0; nu=0; nsub=0; nsub2=0
    za,da=evalZg(jlo,G,wd0,par,xphi)
    zmax=0.0; kmax=0.0
    NS=8
    for j in range(jlo,jhi):
        ka=j-Mh; kb=ka+1.0
        zb,db=evalZg(j+1,G,wd0,par,xphi)
        eps=0.02*(abs(za)+abs(zb)+abs(da)+abs(db))+0.03
        mn,mono=cubic_minabs_monotone(za,zb,da,db)
        if za*zb>0 and mn>eps:
            pass
        elif za*zb<0 and abs(za)>eps and abs(zb)>eps and mono:
            zs[nz]=root_fast(ka,za,zb,da,db,G,wtab,wdtab,par,xphi); fl[nz]=0; nz+=1
        else:
            nsub+=1
            km=ka+0.5
            zm,dm=evalZ(km,G,wtab,wdtab,par,xphi)
            for half in range(2):
                if half==0:
                    pa=ka; pz=za; pd=da; qa=km; qz=zm; qd=dm
                else:
                    pa=km; pz=zm; pd=dm; qa=kb; qz=zb; qd=db
                e1=eps/16.0
                mn,mono=cubic_minabs_monotone(pz,qz,0.5*pd,0.5*qd)
                if pz*qz>0 and mn>e1:
                    pass
                elif pz*qz<0 and abs(pz)>e1 and abs(qz)>e1 and mono:
                    zs[nz]=root(pa,qa,pz,qz,0,G,wtab,wdtab,par,xphi); fl[nz]=0; nz+=1
                else:
                    nsub2+=1
                    ra=pa; rz=pz; rd=pd
                    for s in range(1,NS+1):
                        if s==NS:
                            sa=qa; sz=qz; sd=qd
                        else:
                            sa=pa+0.5*s/NS; sz,sd=evalZ(sa,G,wtab,wdtab,par,xphi)
                        nz,nu=simple_iv(ra,sa,rz,sz,rd,sd,G,wtab,wdtab,par,xphi,zs,fl,nz,unres,nu)
                        ra=sa; rz=sz; rd=sd
        if abs(zb)>zmax:
            zmax=abs(zb); kmax=kb
        za=zb; da=db
    unres[unres.shape[0]-1,0]=kmax; unres[unres.shape[0]-1,1]=zmax
    unres[unres.shape[0]-2,0]=nsub; unres[unres.shape[0]-2,1]=nsub2
    return nz,nu

class Window:
    def __init__(self,T0,M,uhi,ulo,logn,eps=1e-11,nthreads=1):
        self.T0=int(T0); self.M=M
        T=mp.mpf(self.T0)
        th0=mp.siegeltheta(T); self.th0=float(th0-TWOPI_MP*mp.floor(th0/TWOPI_MP))
        self.th1=float(mp.siegeltheta(T,derivative=1))
        self.th2=float(mp.siegeltheta(T,derivative=2)); self.th3=float(mp.siegeltheta(T,derivative=3))
        self.h=TWOPI/(OSF*self.th1)
        tmin=self.T0-(M/2)*self.h; tmax=self.T0+(M/2)*self.h
        self.Kc=int(math.floor(math.sqrt(tmin/TWOPI))); Kmax=int(math.floor(math.sqrt(tmax/TWOPI)))+1
        K=self.Kc
        t0=time.time()
        self.G=None
        for n0 in range(1,K+1,CHUNK):
            n1=min(n0+CHUNK,K+1)
            c=np.empty(n1-n0,np.complex128); x=np.empty(n1-n0,np.float64)
            coeffs(np.uint64(self.T0),uhi,ulo,self.h,self.th1,n0,n1,c,x)
            g=finufft.nufft1d1(x,c,n_modes=M,isign=-1,eps=eps,nthreads=nthreads)
            if self.G is None: self.G=g
            else: self.G+=g
            del c,x,g
        self.t_nufft=time.time()-t0
        ne=max(Kmax-K,1)+1
        xphi=np.zeros((2,ne))
        sc=TWOPI/2.0**64
        for e in range(ne):
            n=K+1+e
            f=((self.T0*((int(uhi[n])<<64)+int(ulo[n])))>>64) & ((1<<64)-1)
            xphi[0,e]=f*sc; xphi[1,e]=self.h*(math.log(n)-0.5*self.th1)
        self.xphi=xphi
        self.par=np.array([M/2,self.h,self.th0,self.th2,self.th3,float(self.T0),float(K)])
    def Z(self,kap):
        return evalZ(kap,self.G,WTAB,WDTAB,self.par,self.xphi)
    def droot(self,a,b,da,db):
        return root(a,b,da,db,1,self.G,WTAB,WDTAB,self.par,self.xphi)
    def zeros(self,klo,khi):
        Mh=self.M//2
        jlo=int(math.floor(klo))+Mh; jhi=int(math.ceil(khi))+Mh
        n=(jhi-jlo)//2+1000
        zs=np.empty(n); fl=np.empty(n,np.int8); unres=np.zeros((1002,2))
        nz,nu=find_zeros(self.G,WTAB,WDTAB,self.par,self.xphi,jlo,jhi,zs,fl,unres)
        self.zmax=(unres[-1,0],unres[-1,1]); self.nsub=(unres[-2,0],unres[-2,1])
        return zs[:nz],fl[:nz],unres[:nu]
def load_u(d,K=None,copy=True):
    uhi=np.load(d+"/uhi.npy",mmap_mode="r"); ulo=np.load(d+"/ulo.npy",mmap_mode="r")
    n=len(uhi) if K is None else K+1
    if copy:
        uhi=np.ascontiguousarray(uhi[:n]); ulo=np.ascontiguousarray(ulo[:n])
    else:
        uhi=np.asarray(uhi); ulo=np.asarray(ulo)
    return uhi,ulo,None
