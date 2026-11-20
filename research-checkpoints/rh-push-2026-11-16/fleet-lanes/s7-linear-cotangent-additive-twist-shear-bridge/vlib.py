# vlib.py  reference implementations (numpy) of the linear Vasyunin sums and coefficient tables
import numpy as np, math
PI=math.pi
def hurwitz(s, x, M=40, J=8):
    """Hurwitz zeta(s,x), complex s != 1, x in (0,1], Euler-Maclaurin (analytic continuation)."""
    x=np.asarray(x,dtype=float); s=complex(s)
    n=np.arange(M)[:,None]; tot=((n+x[None,:])**(-s)).sum(0)
    y=M+x; tot=tot+y**(1-s)/(s-1)+0.5*y**(-s)
    B=[1/6,-1/30,1/42,-1/30,5/66,-691/2730,7/6,-3617/510]
    poch=s; fact=2.0; term_pow=y**(-s-1)
    for j in range(1,J+1):
        tot=tot+B[j-1]/fact*poch*term_pow
        poch=poch*(s+2*j-1)*(s+2*j); fact=fact*(2*j+1)*(2*j+2); term_pow=term_pow/(y*y)
    return tot
def digamma(x):
    x=np.asarray(x,dtype=float).copy(); s=np.zeros_like(x)
    for _ in range(12):
        s-=1.0/x; x+=1.0
    i=1/x; i2=i*i
    return s+np.log(x)-0.5*i-i2*(1/12-i2*(1/120-i2*(1/252-i2*(1/240-i2*(1/132)))))
PER={'chi4':[0,1,0,-1],'chi5':[0,1,-1,-1,1],'chi3':[0,1,-1],'dh':[0,1,0.28407904384024578,-0.28407904384024578,-1]}
def A_table(fn,k,**kw):
    """A_k(r) = regularised sum_{n = r mod k} a(n)/n, r = 0..k-1 (index 0 unused). complex or real."""
    r=np.arange(1,k)
    if fn=='zeta':
        A=-digamma(r/k)/k
    elif fn in PER:
        c=np.array(PER[fn],dtype=float); q=len(c); L=k*q//math.gcd(k,q); A=np.zeros(k-1)
        for j in range(L//k):
            t=r+j*k; A+=-c[t%q]*digamma(t/L)/L
    elif fn=='U':   # zeta(s+i tau): a(n)=n^{-i tau}
        tau=kw.get('tau',1.0); s=1+1j*tau; A=k**(-s)*hurwitz(s,r/k)
    elif fn=='Ea':  # zeta(s+a)zeta(s-a): a(n)=sum_{de=n} d^a e^-a
        a=kw.get('a',0.25); i=np.arange(1,k+1); Z1=hurwitz(1-a,i/k).real; Z2=hurwitz(1+a,i/k).real
        prod=np.outer(Z1,Z2).ravel(); idx=(np.outer(i,i)%k).ravel()
        A=np.bincount(idx,weights=prod,minlength=k)[1:]/k**2
    else: raise ValueError(fn)
    return np.concatenate([[0],A])
def C_table(fn,k,**kw):
    A=A_table(fn,k,**kw); r=np.arange(1,k); C=np.zeros(k,dtype=A.dtype); C[1:]=(k/PI)*(A[r]-A[k-r]); return C
def V_all(k,C,hs=None):
    """V_F(h,k) = -sum_r ((r h/k)) C[r] for h in hs (default all 1..k-1)."""
    if hs is None: hs=np.arange(1,k)
    hs=np.asarray(hs); r=np.arange(1,k)
    out=np.zeros(len(hs),dtype=C.dtype)
    step=max(1,int(4e6//k))
    for i in range(0,len(hs),step):
        t=(np.outer(hs[i:i+step],r)%k).astype(float); saw=np.where(t==0,0.0,t/k-0.5)
        out[i:i+step]=-(saw@C[1:])
    return out
def S_closed(fn,x):
    """S_F(x) closed forms (zeta, periodic) for scalar/array x (float)."""
    x=np.asarray(x,dtype=float)
    B=lambda y: np.where(np.abs(y-np.round(y))<1e-12,0.0,0.5-(y-np.floor(y)))
    if fn=='zeta': return B(x)
    c=np.array(PER[fn],dtype=float); q=len(c); n=np.arange(q)
    out=np.zeros_like(x)
    for j in range(q):
        al=(c*np.cos(2*PI*j*n/q)).sum()/q; be=(c*np.sin(2*PI*j*n/q)).sum()/q   # c(n)=sum_j al_j cos + be_j sin
        if abs(al)>1e-14: out+=al*0.5*(B(x+j/q)+B(x-j/q))
        if abs(be)>1e-14:
            with np.errstate(divide='ignore'):
                out+=be/(2*PI)*(np.log(np.abs(2*np.sin(PI*(x+j/q))))-np.log(np.abs(2*np.sin(PI*(x-j/q)))))
    return out
def V_direct(fn,h,k):
    m=np.arange(1,k); return float((S_closed(fn,m*h/k)/np.tan(PI*m/k)).sum())
