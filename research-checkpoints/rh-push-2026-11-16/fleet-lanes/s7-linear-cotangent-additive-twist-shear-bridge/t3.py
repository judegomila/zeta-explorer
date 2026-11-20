# t3.py <fn> <T> [nblocks_limit]   twisted reflection-odd moments on [T,2T] (test 3)
# F(sigma+it) on a uniform t-grid by a smoothed Dirichlet sum (length >> q t/2pi) evaluated with a type-1 NUFFT.
import sys, json, math, time, os
import numpy as np
try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=int(os.environ.get('RH_GPU_GB','22'))*1024**3); xp=cp; GPU=True
    cp.zeros(4).sum()
except Exception as e:
    xp=np; GPU=False
import mpmath as mp
TT0=time.time()
XI=0.28407904384024578
PER={'zeta':[1.0],'chi4':[0,1,0,-1],'chi5':[0,1,-1,-1,1],'dh':[0,1,XI,-XI,-1]}
fn=sys.argv[1]; T=float(sys.argv[2]); blim=int(sys.argv[3]) if len(sys.argv)>3 else 10**9
cper=np.array(PER[fn]); q=len(cper)
XS=[0.02,0.1,0.25]
W0=0.15; RHO=2.2; WK=14; BETA=2.30*WK
def kernel(z):   # ES kernel on |z|<=WK/2
    u=1-(2*z/WK)**2; return xp.where(u>0,xp.exp(BETA*(xp.sqrt(xp.maximum(u,0))-1)),0.0)
def kernel_hat(M,G):
    # int phi(z) e^{-2 pi i j z/G} dz for j=-M/2..M/2-1 ; smooth in j: evaluate on 2049 nodes, interpolate
    xg,wg=np.polynomial.legendre.leggauss(80); z=xg*WK/2; wz=wg*WK/2
    u=1-(2*z/WK)**2; ph=np.exp(BETA*(np.sqrt(np.maximum(u,0))-1))
    jc=np.linspace(-M/2,M/2,65537); val=(np.cos(2*np.pi*np.outer(jc,z)/G)*ph*wz).sum(1)
    j=np.arange(-M//2,M//2); return np.interp(j,jc,val)
def setup(T0,R,M):
    """returns closure computing F-type sums on t = T0 + j*delta, j=0..M-1"""
    delta=R/M; G=2*M; Tmax=T0+R
    N0=RHO*q*Tmax/(2*math.pi); nmax=int(N0*math.exp(4.6*W0))+10
    if delta*math.log(nmax)>=2*math.pi*0.98: raise ValueError('delta too coarse')
    return delta,G,nmax,N0
def block(T0,R,M):
    delta,G,nmax,N0=setup(T0,R,M)
    sig=[0.5+x for x in XS]+[0.5-x for x in XS]
    nsets=len(sig)+len(XS)
    print(f'block T0={T0:.4g} R={R:.4g} M={M} G={G} nmax={nmax} delta={delta:.4f}; planned allocation: grids {nsets}x{G} complex = {nsets*G*16/1e9:.2f} GB, outputs {nsets}x{M} real',file=sys.stderr,flush=True)
    grids=[xp.zeros(G,dtype=xp.complex128) for _ in range(nsets)]
    CH=20_000_000; tc=T0+ (M//2)*delta
    for n0 in range(1,nmax+1,CH):
        n=xp.arange(n0,min(n0+CH,nmax+1),dtype=xp.float64)
        a=xp.asarray(cper)[(n.astype(xp.int64))%q]
        keep=a!=0
        if not bool(keep.any()): continue
        n=n[keep]; a=a[keep]; om=xp.log(n)
        v=0.5*(1-xp.asarray(_erf(xp.log(n/N0)/W0)))
        base=a*v*xp.exp(-1j*tc*om)
        pos=om*delta*G/(2*math.pi); i0=xp.ceil(pos-WK/2).astype(xp.int64)
        wts=[]
        for si,s in enumerate(sig): wts.append(n**(-s))
        for xi_,x in enumerate(XS): wts.append(-om*n**(-(0.5+x)))
        for l in range(WK):
            g=i0+l; kv=kernel(g-pos); gi=g%G; bk=base*kv
            for si in range(nsets):
                val=bk*wts[si]
                grids[si]+=xp.bincount(gi,weights=val.real,minlength=G)+1j*xp.bincount(gi,weights=val.imag,minlength=G)
        del n,a,om,v,base,pos,i0,wts
        print(f'  chunk {n0} {time.time()-TT0:.0f}s',file=sys.stderr,flush=True)
    kh=xp.asarray(kernel_hat(M,G)); outs=[]
    jj=xp.arange(-M//2,M//2)
    for si in range(nsets):
        f=xp.fft.fft(grids[si]); grids[si]=None
        # centred index j' = j - M/2 : f_{j'} = sum_g b_g e^{-2 pi i j' g/G}
        fc=xp.concatenate([f[G-M//2:],f[:M//2]])/kh
        outs.append(fc); del f
    t=T0+xp.arange(M)*delta
    return t,delta,sig,outs
def _erf(z):
    if GPU:
        from cupyx.scipy.special import erf; return erf(z)
    try:
        from scipy.special import erf; return erf(z)
    except Exception:
        return np.vectorize(math.erf)(z)
def csig(s2,h,k):
    """(hk)^-sigma sum_j a(hj)a(kj) j^-2sigma with analytic continuation; s2 = 2 sigma"""
    hk=mp.mpf(h*k)**(-mp.mpf(s2)/2)
    if fn=='zeta': return float(mp.zeta(s2)*hk)
    if fn in ('chi4','chi5','dh'):
        tot=mp.mpf(0)
        for r in range(1,q+1):
            cc=cper[(h*r)%q]*cper[(k*r)%q]
            if cc!=0: tot+=cc*mp.zeta(s2,mp.mpf(r)/q)
        return float(tot*mp.mpf(q)**(-mp.mpf(s2))*hk)
def dualint(sig,T,T1=None):   # int_T^T1 (q t/2pi)^{1-2 sigma} dt
    T1=T1 or 2*T; e=1-2*sig; return (q/(2*math.pi))**e*(T1**(e+1)-T**(e+1))/(e+1)
T1G=None
def DM(sig,h,k,T): return csig(2*sig,h,k)*((T1G or 2*T)-T)+csig(2-2*sig,h,k)*dualint(sig,T,T1G)
def fracs(T):
    def nextprime(n):
        n=int(n)|1
        while any(n%p==0 for p in range(3,int(n**0.5)+1,2)) or n%5==0 or n%2==0 or n%101==0: n+=2
        return n
    L=[(1,1),(1,2),(1,3),(2,3),(1,6),(5,6),(1,7),(3,7),(1,11),(1,13)]
    if fn not in ('chi5','dh'): L+=[(1,5),(2,5)]
    for th in (0.25,0.5,1.0):
        k=nextprime(T**th)
        for h in (1,2,nextprime(k/6.0),nextprime(k/5.0),nextprime(0.618*k)):
            if h<k and math.gcd(h,k)==1: L.append((h,k))
        hh=nextprime(T**(th/2)); kk=nextprime(1.3*T**(th/2))
        if math.gcd(hh,kk)==1: L.append((hh,kk))
    out=[]
    for h,k in L:
        if math.gcd(h*k,q)==1 or q==1: out.append((h,k))
    return sorted(set(out),key=lambda p:(p[1],p[0]))
def main():
    R=T
    if T<=1.01e5: M=2**20; nb=1
    elif T<=1.01e6: M=2**23; nb=1
    else:
        nb=int(round(T/2.5e6)); M=2**24
    Rb=R/nb; FR=fracs(T)
    NRQ=101; NRC=2.2
    extra=[]
    if fn=='zeta':
        base=[(1,1),(1,2),(2,3),(1,7)]+[f for f in FR if f[1]>50][:6]
        for h,k in base:
            for d in range(-2,3):
                hh=h*NRQ**max(d,0); kk=k*NRQ**max(-d,0); g=math.gcd(hh,kk); extra.append((hh//g,kk//g))
    ALL=sorted(set(FR+extra),key=lambda p:(p[1],p[0]))
    acc={f:np.zeros(9,dtype=complex) for f in ALL}; fe_num=np.zeros(3); fe_den=np.zeros(3); val=None
    mean_abs2=np.zeros(6)
    t00=time.time(); done=0
    for b in range(min(nb,blim)):
        t,delta,sig,outs=block(T+b*Rb,Rb,M)
        Fp=outs[0:3]; Fm=outs[3:6]; dF=outs[6:9]
        A=[xp.abs(f)**2 for f in Fp]+[xp.abs(f)**2 for f in Fm]+[(dF[i]*xp.conj(Fp[i])).real for i in range(3)]
        if val is None:
            js=[0,1,M//3,M//2,M-1]; val=[[float(t[j]),[[complex(outs[si][j]).real,complex(outs[si][j]).imag] for si in range(9)]] for j in js]
        for i,x in enumerate(XS):
            Xf=(q*t/(2*math.pi))**(-2*x)
            fe_num[i]+=float(xp.sum((A[i]-Xf*A[3+i])**2)); fe_den[i]+=float(xp.sum(A[i]**2))
        for i in range(6): mean_abs2[i]+=float(xp.sum(A[i]))*delta
        for (h,k) in ALL:
            ph=xp.exp(1j*t*math.log(h/k))
            for i in range(9): acc[(h,k)][i]+=complex(xp.sum(A[i]*ph))*delta
        done+=1
        print(f'block {b} done {time.time()-t00:.0f}s',file=sys.stderr,flush=True)
        del outs,A,Fp,Fm,dF,t
    Teff=done*Rb; res={'fn':fn,'T':T,'range':[T,T+Teff],'blocks':done,'gpu':GPU,'delta':Rb/M,'validation_points':val,
         'fe_rel_l2':[math.sqrt(fe_num[i]/fe_den[i]) for i in range(3)],'mean_abs2_over_T':[float(m/Teff) for m in mean_abs2],'xs':XS,'rows':[]}
    full=True
    global T1G
    T1G=T+Teff
    mp.mp.dps=20
    for (h,k) in ALL:
        row={'h':h,'k':k,'theta':math.log(max(k,2))/math.log(T),'I':[[v.real,v.imag] for v in acc[(h,k)]]}
        if full and (fn!='zeta' or True) and (q==1 or math.gcd(h*k,q)==1):
            pm=[]; 
            for i,x in enumerate(XS):
                dp=DM(0.5+x,h,k,T); dm=DM(0.5-x,h,k,T); e=1e-4; dO=0.5*(DM(0.5+x+e,h,k,T)-DM(0.5+x-e,h,k,T))/(2*e)
                Ip=acc[(h,k)][i]; Im=acc[(h,k)][3+i]; IO=acc[(h,k)][6+i]; nrm=Teff/math.sqrt(h*k)
                pm.append({'x':x,'D_plus':dp,'D_minus':dm,'D_O':dO,'rem_plus':abs(Ip-dp)/nrm,'rem_minus':abs(Im-dm)/nrm,'rem_O':abs(IO-dO)/nrm,'I_O':[IO.real,IO.imag],'relrem_plus':abs(Ip-dp)/abs(dp) if dp else None,'relrem_O':abs(IO-dO)/abs(dO) if dO else None})
            row['pred']=pm
        res['rows'].append(row)
    json.dump(res,open(f'out/t3_{fn}_{T:.0e}.json','w'))
    print('saved',file=sys.stderr)
if __name__=='__main__': main()
