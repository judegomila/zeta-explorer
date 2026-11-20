import numpy as np
def lam_from(a):
    P=len(a); lam={1:0.0}
    for n in range(2,P+1):
        acc=a[n-1]*np.log(n)
        for d in range(2,n):
            if n%d==0: acc-=lam[d]*a[n//d-1]
        lam[n]=acc
    return lam
def zeros(a,T):
    P=len(a); ln=np.log(np.arange(1,P+1)); a=np.asarray(a,float)
    D=lambda s:(a*np.exp(-np.outer(s,ln))).sum(1)
    dD=lambda s:(-ln*a*np.exp(-np.outer(s,ln))).sum(1)
    sig=np.arange(-10,5.01,0.2); tt=np.arange(-T-1,T+1,0.02)
    out=[]
    for chunk in np.array_split(tt,40):
        S=(sig[:,None]+1j*chunk[None,:]).ravel()
        for _ in range(80):
            S=S-D(S)/dD(S); S=S[np.isfinite(S)&(np.abs(S.real)<40)]
        S=S[np.abs(D(S))<1e-9]; out.append(S)
    S=np.concatenate(out); S=S[np.abs(S.imag)<=T]
    S=S[np.argsort(S.imag)]
    keep=[]
    for z in S:
        if all(abs(z-w)>1e-6 for w in keep[-12:]): keep.append(z)
    Z=np.array(keep)
    # argument principle count on rectangle [-40,40]x[-T,T]
    def seg(z0,z1,n=400000):
        z=z0+(z1-z0)*np.linspace(0,1,n); v=np.concatenate([D(c) for c in np.array_split(z,40)])
        return np.unwrap(np.angle(v))[-1]-np.unwrap(np.angle(v))[0]
    c=[-40-1j*T,40-1j*T,40+1j*T,-40+1j*T]
    wind=sum(seg(c[i],c[(i+1)%4]) for i in range(4))/(2*np.pi)
    return Z,wind
def run(a,tau,T,hk=3,ns=1500):
    P=len(a); u=np.log(P); s=(np.arange(ns)+0.5)*u/ns; ds=u/ns
    h=(s*(u-s))**hk*np.exp(-s)*np.exp(1j*tau*s)   # different test vector from the lane
    nrm=(abs(h)**2).sum()*ds; lam=lam_from(a)
    lhs=0.0
    for n in range(2,P):
        L=lam[n]
        if L==0: continue
        hs=np.interp(s-np.log(n),s,h.real,left=0,right=0)+1j*np.interp(s-np.log(n),s,h.imag,left=0,right=0)
        lhs+=-2*(L*n**-0.5*(np.conj(h)*hs).sum()*ds).real
    Z,wind=zeros(a,T)
    xi=np.abs(s[:,None]-s[None,:]); HH=np.conj(h)[:,None]*h[None,:]
    zs=sum((HH*np.exp((b-0.5)*xi)).sum().real for b in Z)*ds*ds
    aP=abs(a[-1])
    d_noA=(lhs-(-u*nrm+zs))/nrm            # residual with constant -u only
    d_A=(lhs-((-u+np.log(aP))*nrm+zs))/nrm # residual with the lane's (-u+log|a_P|)
    tail=(u-2*np.log(aP))/(np.pi*T)
    print(f"a={a} tau={tau} T={T} found={len(Z)} winding={wind:.3f} right={int((Z.real>0.5).sum())} lhs/n={lhs/nrm:.6f} "
          f"resid(-u)={d_noA:.6f} resid(-u+log aP)={d_A:.6f} predicted tail={tail:.6f}",flush=True)
for a,tau in [([1,1,1,1],3.0),([1,1,1,1,1,1],5.5),([1,1,1,1,1,1,1],2.0)]:
    for T in (150.0,300.0): run(a,tau,T)
for a,tau in [([1,1,3.0],2.0),([1,0.5,1,0.25],4.0),([1,1,-1,2,0.5],6.0),([1,1,0,-1,2.0],1.0)]:
    for T in (150.0,300.0): run(a,tau,T)
