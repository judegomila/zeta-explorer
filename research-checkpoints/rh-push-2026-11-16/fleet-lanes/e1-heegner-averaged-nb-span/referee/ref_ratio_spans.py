# Independent ratio checks.
# (1) pair by exact step sums (counting variable) and by line integral (mpmath): (-7,-8) [reproduce], (-3,-4) [different case]
# (2) span |D|<=X by counting Gram with numerically computed value functional (no L'(1)): X=100 (reproduce), X=150 (new)
# (3) control: same span with coefficients a_D(n) permuted inside dyadic blocks (no multiplicativity, same density)
import numpy as np, math, mpmath as mp, sys
from ref_common import *
def acoef(D,N):
    a=np.ones(N+1,dtype=np.int64); a[0]=0
    sv=np.ones(N+1,dtype=bool)
    for p in range(2,N+1):
        if not sv[p]: continue
        sv[p*p::p]=False
        k=kron(D,p)
        if k==1: a[p::p]*=2
        elif k==-1:
            a[p::p]=0
            # inert: local factor 1 -> a(p^k m)=0 for all k>=1
        else: a[p*p::p*p]=0
    return a
# sanity of acoef against Dirichlet convolution definition for D=-23, n<=2000:  a = 1 * chi * (mu on squares)
def a_def(D,N):
    chi=[kron(D,n) for n in range(N+1)]
    r=[0]*(N+1)
    for d in range(1,N+1):
        for m in range(d,N+1,d): r[m]+=chi[d]            # 1*chi
    mu=[1]*(N+1)
    out=[0]*(N+1)
    import sympy
    for d in range(1,int(N**.5)+1):
        m_=sympy.mobius(d)
        if m_==0: continue
        for k in range(1,N//(d*d)+1): out[k*d*d]+=m_*r[k]
    return out
try:
    A=a_def(-23,2000); print('acoef vs convolution definition, D=-23, n<=2000: max diff',int(np.abs(acoef(-23,2000)-np.array(A)).max()))
except ImportError: print('sympy missing; convolution check skipped')
mp.mp.dps=20
def pv(D):
    ch=chilist(D); r=math.sqrt(-D)/2
    q=abs(D)
    L1=-sum(ch[a]*float(mp.digamma(mp.mpf(a)/q)) for a in range(1,q) if ch[a])/q
    dL=-math.log(q)*L1-sum(ch[a]*float(mp.stieltjes(1,mp.mpf(a)/q)) for a in range(1,q) if ch[a])/q
    return r*L1,(r*math.log(r)*L1+r*dL)/(math.pi**2/6)
def pair_counting(D1,D2,N):
    (p1,v1),(p2,v2)=pv(D1),pv(D2)
    det=p1*v2-p2*v1; c={D1:-p2/det*(-1)*(-1) if False else  -p2/det*(-1), D2:0}
    # solve p.c=0, v.c=1
    c1=-p2/(p1*v2-p2*v1)*(-1); c1=p2/(p2*v1-p1*v2); c2=-p1/(p2*v1-p1*v2)
    assert abs(p1*c1+p2*c2)<1e-9 and abs(v1*c1+v2*c2-1)<1e-9
    Dm=max(-D1,-D2); ea=math.sqrt(Dm)/2
    ys=[];js=[]
    for D,c in ((D1,c1),(D2,c2)):
        a=acoef(D,N); n=np.nonzero(a)[0]; th=math.sqrt(-D/Dm)
        ys.append(n/th); js.append(ea*c*a[n])
    ys=np.concatenate(ys); js=np.concatenate(js); o=np.argsort(ys); ys=ys[o]; js=js[o]
    k=ys<=N; ys=ys[k]; f=np.cumsum(js[k])
    seg=1/ys[:-1]-1/ys[1:]
    return (c1,c2),float((f[:-1]**2*seg).sum()),float(((f[:-1]-1)**2*seg).sum()),float(ys[0])
def pair_line(D1,D2,c,T,h=0.05):
    Dm=max(-D1,-D2); ea=math.sqrt(Dm)/2
    ch1,ch2=chilist(D1),chilist(D2); mp.mp.dps=15
    n=int(round(T/h)); n-=n%2; ts=np.arange(n+1)*h; F=np.zeros(n+1)
    for i,t in enumerate(ts):
        if i==0: continue    # A_x(1/2) = 0? value finite; set by continuity below
        s=mp.mpc(0.5,t)
        A=mp.zeta(s)/mp.zeta(2*s)*(c[0]*(mp.sqrt(-D1)/2)**s*mp.dirichlet(s,ch1)+c[1]*(mp.sqrt(-D2)/2)**s*mp.dirichlet(s,ch2))
        F[i]=abs(A)**2/(math.pi*(0.25+t*t))
    F[0]=0.0  # 1/zeta(2s) -> 0 at s=1/2
    w=np.ones(n+1); w[1:-1:2]=4; w[2:-1:2]=2
    return ea*float((w*F).sum()*h/3)
print('pv check D=-7:',pv(-7),' class-number formula p=',math.pi*1/2.0, flush=True)
for (D1,D2) in ():
    c,I2,I1,y0=pair_counting(D1,D2,400000)
    print(f'pair {D1},{D2}: c={c[0]:.6f},{c[1]:.6f} first jump y={y0:.6f}  counting Y=4e5: int f^2={I2:.4f}  int|f-1|^2={I1:.4f}  diff={I2-I1:.5f}',flush=True)
    for T in (50,100): print(f'     line integral T={T}: {pair_line(D1,D2,c,T):.4f}',flush=True)
# (2),(3) span Gram in counting variable
def span(X,Y,M,shuffle=False,seed=1):
    Ds=neg_fund(X); N=int(math.sqrt(X)*Y/2)+2
    print(f'span X={X} n_D={len(Ds)} N={N} planned alloc MB {len(Ds)*M*8/1e6:.0f}',flush=True)
    y0=2/math.sqrt(X)*0.999
    ed=np.exp(np.linspace(math.log(y0),math.log(Y),M+1)); ym=np.sqrt(ed[:-1]*ed[1:]); wq=1/ed[:-1]-1/ed[1:]
    F=np.zeros((len(Ds),M)); rng=np.random.default_rng(seed)
    for k,D in enumerate(Ds):
        a=acoef(D,N)
        if shuffle:
            lo=1
            while lo<=N:
                hi=min(2*lo,N+1); a[lo:hi]=rng.permutation(a[lo:hi]); lo=hi
        cum=np.cumsum(a)
        F[k]=cum[np.minimum(np.floor(math.sqrt(-D)*ym/2).astype(np.int64),N)]
    G=(F*wq)@F.T
    vnum=F@wq                                # int F_D dy/y^2 on [y0,Y]; on p.c=0 this is A_x(1) up to the tail beyond Y
    p=np.array([pv(D)[0] for D in Ds]); vL=np.array([pv(D)[1] for D in Ds])
    def solve(v):
        U,S,Vt=np.linalg.svd(p[None,:]); Nn=Vt[1:].T
        Gn=Nn.T@G@Nn; vn=Nn.T@v; ev,V=np.linalg.eigh(Gn); keep=ev>1e-6*ev.max()
        y=V[:,keep]@((V[:,keep].T@vn)/ev[keep]); c=Nn@y/(vn@y)
        return math.exp(math.log(math.sqrt(max(-d for d in Ds))/2))*float(c@G@c), c
    Rn,cn=solve(vnum); RL,cL=solve(vL)
    print(f'   shuffle={shuffle}: R with numeric value functional = {Rn:.4f} ; with L-prime value functional = {RL:.4f} ; |v_num.c_L - 1| = {abs(vnum@cL-1):.2e}',flush=True)
for X in (100,150):
    span(X,1e4,400000)
    span(X,1e4,400000,shuffle=True)
    span(X,1e4,400000,shuffle=True,seed=7)
