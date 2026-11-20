"""Euler-aware (class-uniform) Weil positivity radius: route 30 'nextStep'.
Weil form of zeta's bridge (pole + archimedean, conductor 1) with prime side taken from the FORMAL unitary degree-1 rung class
  c(p^k) = alpha_p^k log p, |alpha_p| = 1 (extreme points of the Toeplitz-PSD rung class),
on test functions g supported in [-a,a], discretised as piecewise constants on n cells (an exact subspace of the form domain:
Rayleigh-Ritz, so a negative eigenvalue here is a negative direction of the true form, up to float rounding).
  W_alpha(g) = 2 Re(u conj v) + (C(a) - log pi)||g||^2 + int_0^{2a} k(x) [2F(0)-F(x)-F(-x)] dx - sum_{p^k} log p p^{-k/2} [alpha^k F(k log p) + conj]
  F(x) = int g(y+x) conj g(y) dy, u = int g e^{x/2}, v = int g e^{-x/2}, k(x) = e^{-x/2}/(1-e^{-2x}),
  C(a) = int_0^inf ( e^{-2x}/x - 1_{x<2a} 2k(x) ) dx.
Run: python -I weil_class.py"""
import math, json, sys
import numpy as np
import mpmath as mp
mp.mp.dps=30
LOGPI=math.log(math.pi)

def build(a,n):
    h=2*a/n
    k=lambda x: mp.exp(-x/2)/(1-mp.exp(-2*x))
    C=mp.quad(lambda x: mp.exp(-2*x)/x-2*k(x),[0,2*a])+mp.e1(4*a)
    # weights v_m, m=1..n :  2*sum_m v_m (F_0 - F_m),  v_m = W0_m + W1_{m-1}
    W0=[mp.mpf(0)]*(n+1); W1=[mp.mpf(0)]*(n+1)
    xs,ws=np.polynomial.legendre.leggauss(12)
    def gl(f,lo,hi):
        return sum(w*f(lo+(hi-lo)*(x+1)/2) for x,w in zip(xs,ws))*(hi-lo)/2
    kf=lambda x: math.exp(-x/2)/(1-math.exp(-2*x))
    W0=np.zeros(n+1); W1=np.zeros(n+1)
    for m in range(n):
        lo,hi=m*h,(m+1)*h
        if m==0:
            W1[0]=gl(lambda x: (kf(x)*x)/h,lo,hi)       # x k(x) smooth at 0
        else:
            W0[m]=gl(lambda x: kf(x)*(1-(x-lo)/h),lo,hi); W1[m]=gl(lambda x: kf(x)*(x-lo)/h,lo,hi)
    v=np.zeros(n+1)
    for m in range(1,n+1): v[m]=(W0[m] if m<n else 0)+W1[m-1]
    idx=np.arange(n)
    D=np.abs(idx[:,None]-idx[None,:])
    A=-v[D]; np.fill_diagonal(A,0.0)        # -v_m on the m-th off-diagonals (F_m = v^* E_m v ; F_m + conj = v^*(E_m+E_m^T)v)
    A=A+np.eye(n)*(float(C)-LOGPI+2*v[1:].sum())
    x=-a+h*idx
    p=(np.exp((x+h)/2)-np.exp(x/2))*2/math.sqrt(h); mm=(np.exp(-x/2)-np.exp(-(x+h)/2))*2/math.sqrt(h)
    Pole=np.outer(mm,p)+np.outer(p,mm)
    def shift(xv):
        m=int(math.floor(xv/h)); s=xv/h-m
        S=np.zeros((n,n))
        if m<n: S+= (1-s)*np.eye(n,k=m)
        if m+1<n: S+= s*np.eye(n,k=m+1)
        return S
    return A,Pole,shift,h

def primes_upto(N):
    return [p for p in range(2,N+1) if all(p%d for d in range(2,int(p**0.5)+1))]

def lam_min(a,n,alpha=None,pole=True,primes=True,return_vec=False):
    """alpha: dict p -> complex unit (default 1 = zeta)."""
    A,Pole,shift,h=build(a,n)
    M=A.astype(complex)
    if pole: M=M+Pole
    if primes:
        for p in primes_upto(int(math.exp(2*a))+1):
            al=(alpha or {}).get(p,1.0)
            kk=1
            while kk*math.log(p)<2*a:
                S=shift(kk*math.log(p)); w=math.log(p)*p**(-kk/2)
                M-= w*(al**kk*S+np.conj(al)**kk*S.T)
                kk+=1
    M=(M+M.conj().T)/2
    if return_vec:
        w,V=np.linalg.eigh(M); return w[0],V[:,0],M
    return np.linalg.eigvalsh(M)[0]

if __name__=='__main__':
    out={}
    # --- validation 1: explicit formula on g = 1_[-a,a] (exactly representable) against the zero sum
    a=0.5; n=400
    A,Pole,shift,h=build(a,n); g=np.ones(n)*math.sqrt(h)
    M=A+Pole
    for p in (2,):
        if math.log(p)<2*a: S=shift(math.log(p)); M=M-math.log(p)/math.sqrt(p)*(S+S.T)
    W=float(g@M@g)
    NZ=400; zs=[mp.zetazero(j).imag for j in range(1,NZ+1)]
    zsum=sum(8*mp.sin(a*t)**2/t**2 for t in zs); Tz=float(zs[-1]); tail=(4/(2*math.pi))*(math.log(Tz/(2*math.pi))+1)/Tz
    out['validation_explicit_formula']={'a':a,'W_form':W,'zero_sum_400':float(zsum),'tail_estimate':tail,'zero_sum_total':float(zsum)+tail}
    print(out['validation_explicit_formula'],flush=True)
    # --- validation 2: archimedean+pole only radius (route 30 quotes a = 0.9385)
    def bis(f,lo,hi,it=30):
        for _ in range(it):
            mid=(lo+hi)/2
            if f(mid)>0: lo=mid
            else: hi=mid
        return (lo+hi)/2
    n=300
    try:
        r=bis(lambda a: lam_min(a,n,primes=False),0.3,1.6,22); out['arch_plus_pole_only_radius_a']=r; print('arch+pole only radius a =',r,flush=True)
    except Exception as e: print('arch-only failed',e)
    # --- zeta's own form (alpha=1) : lambda_min vs a
    rows=[]
    for a in (0.30,0.3466,0.40,0.45,0.50,0.5493,0.60,0.6931,0.80):
        rows.append({'a':a,'2a':2*a,'lam_min_zeta':lam_min(a,n),'lam_min_no_primes':lam_min(a,n,primes=False)}); print(rows[-1],flush=True)
    out['zeta_form']=rows
    # --- class-uniform: min over alpha on the torus
    def class_min(a,n,nphi=24):
        P=[p for p in primes_upto(int(math.exp(2*a))+1) if math.log(p)<2*a]
        best=(1e9,None)
        if len(P)==0: return lam_min(a,n),{}
        grids=[np.linspace(0,math.pi,nphi+1)]+[np.linspace(-math.pi,math.pi,2*nphi,endpoint=False) for _ in P[1:]]   # conj symmetry: phi_2 in [0,pi]
        import itertools
        for ph in itertools.product(*grids):
            al={p:complex(math.cos(t),math.sin(t)) for p,t in zip(P,ph)}
            l=lam_min(a,n,al)
            if l<best[0]: best=(l,dict(zip(P,ph)))
        return best
    rows=[]
    for a in (0.3466,0.36,0.38,0.40,0.42,0.45,0.50,0.5493):
        l,ph=class_min(a,200)
        lr=min(lam_min(a,200,{2:s}) for s in (1,-1))
        rows.append({'a':a,'2a':2*a,'class_min_lam':l,'argmin_phase':ph,'real_class_min':lr,'zeta':lam_min(a,200)}); print(rows[-1],flush=True)
    out['class_uniform']=rows
    # radius: smallest a with class min < 0 (only p=2 active below a = ln3/2)
    def cm(a):
        return min(lam_min(a,300,{2:complex(math.cos(t),math.sin(t))}) for t in np.linspace(0,math.pi,25))
    try:
        r=bis(cm,0.3466,0.549,18); out['class_uniform_radius_a']=r; out['class_uniform_radius_2a']=2*r; print('class-uniform radius a=',r,'2a=',2*r,' ln2=',math.log(2))
    except Exception as e: print(e)
    json.dump(out,open('weil_class.json','w'),indent=1)
