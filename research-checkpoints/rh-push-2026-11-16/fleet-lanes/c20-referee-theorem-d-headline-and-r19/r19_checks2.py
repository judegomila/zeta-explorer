# Corrected checks (exact Fractions for D10; complete zero list for the D'/D constant). First version in
# r19_checks.py had two faults of this referee's own code: sympy.lambdify turned rational coefficients into floats
# (D10 block), and the Newton grid missed 56 of 768 zeros (DP block). Both blocks are superseded by this file.
import math, json, random
from fractions import Fraction as Fr
import numpy as np
out={}
print("=== DP census: constant of D'/D, D = 1 + 2*2^-s - 4^-s + 0.25*5^-s (P=5, a_P=0.25)")
an={1:1.0,2:2.0,4:-1.0,5:0.25}; uu=math.log(5); lg={n:math.log(n) for n in an}
def D(s): return sum(c*np.exp(-s*lg[n]) for n,c in an.items())
def Dp(s): return sum(-lg[n]*c*np.exp(-s*lg[n]) for n,c in an.items())
T=1500.0
# strip: right: 2*2^-x+4^-x+0.25*5^-x<1 for x>=1.4 ; left: 4*5^x+8*(5/2)^x+4*(5/4)^x<1 for x<=-6.5
xr=1.4; xl=-6.5
assert 2*2**-xr+4**-xr+0.25*5**-xr<1 and 4*5**xl+8*2.5**xl+4*1.25**xl<1
def wind(y0,y1,n=40000):
    xs=np.linspace(xl,xr,2000); ys=np.linspace(y0,y1,n)
    pts=np.concatenate([xs+1j*y0,xr+1j*ys,xs[::-1]+1j*y1,xl+1j*ys[::-1]])
    v=D(pts); return float(np.sum(np.angle(v[1:]/v[:-1]))/(2*math.pi))
zeros=[]; slab=50.0; bad=0
sg=np.arange(xl,xr+0.01,0.1)
for k in range(int(T/slab)):
    y0=k*slab+0.123; y1=y0+slab            # cuts shifted off the real axis
    tt=np.arange(y0-0.5,y1+0.5,0.02)
    S,TT=np.meshgrid(sg,tt); z=(S+1j*TT).ravel()
    for _ in range(50):
        with np.errstate(all='ignore'):
            st=D(z)/Dp(z); st=np.where(np.isfinite(st),st,0); st=np.where(np.abs(st)>1,st/np.abs(st),st); z=z-st
    with np.errstate(all='ignore'):
        ok=np.isfinite(z)&(np.abs(D(z))<1e-9*(1+np.abs(Dp(z))))&(z.imag>y0)&(z.imag<y1)&(z.real>xl)&(z.real<xr)
    z=z[ok]; z=z[np.argsort(z.imag)]
    u_=[]
    for w in z:
        if all(abs(w-v)>1e-7 for v in u_[-8:]): u_.append(w)
    wn=round(wind(y0,y1))
    if wn!=len(u_): bad+=1
    zeros+=u_
# slab [-0.123,0.123] around the real axis
tt=np.arange(-0.6,0.6,0.01); S,TT=np.meshgrid(sg,tt); z=(S+1j*TT).ravel()
for _ in range(60):
    with np.errstate(all='ignore'):
        st=D(z)/Dp(z); st=np.where(np.isfinite(st),st,0); st=np.where(np.abs(st)>1,st/np.abs(st),st); z=z-st
ok=(np.abs(D(z))<1e-9)&(np.abs(z.imag)<0.123); z0=[]
for w in z[ok]:
    if all(abs(w-v)>1e-7 for v in z0): z0.append(w)
print("slabs with count != winding:",bad,"; zeros in 0.123<Im<%.3f:"%(T+0.123),len(zeros),"; near real axis:",len(z0),"winding there:",round(wind(-0.123,0.123,4000)))
up=np.array(zeros); allz=np.concatenate([up,np.conj(up),np.array(z0)])
print("mean Re of zeros:",float(np.mean(allz.real)),"log|a_P|/u:",math.log(0.25)/uu,"count/(2T u/pi):",len(allz)/(2*T*uu/math.pi))
rows=[]
for s0 in (2.0+3.0j, 0.5+0.7j, -1.0+11.0j):
    for Tc in (375.0,750.0,1500.0):
        sel=allz[np.abs(allz.imag)<Tc]
        r=complex(Dp(np.array([s0]))[0]/D(np.array([s0]))[0])+uu/2-complex(np.sum(1/(s0-sel)))
        pred=(uu*s0.real-math.log(0.25))/(math.pi*Tc)
        rows.append((str(s0),Tc,r.real,r.imag,pred)); print("  s0",s0,"T",Tc,"residual:",r,"predicted tail:",pred,"ratio",r.real/pred)
out['dp']=dict(bad_slabs=bad,n=len(allz),rows=rows)
print("=== D10 (exact Fractions)")
W=[(1,lambda z:(z[0],z[1])),(-1,lambda z:(-z[0],z[0]+z[1])),(-1,lambda z:(z[0]+z[1],-z[1])),
   (1,lambda z:(z[1],-z[0]-z[1])),(1,lambda z:(-z[0]-z[1],z[0])),(-1,lambda z:(-z[1],-z[0]))]
def mkb(coef):                      # coef[k] of x^k, Fractions
    def b(t):
        r=Fr(0)
        for c in reversed(coef): r=r*t+c
        return r
    def L(s,t):                     # [b(s)b(t)-b(-s)b(-t)]/(s+t), with the diagonal case s+t=0 by the polynomial formula
        # polynomial form: sum_{i,j} c_i c_j (1-(-1)^(i+j)) s^i t^j /(s+t); for i+j odd, (s^i t^j + s^j t^i)/(s+t) is a polynomial
        tot=Fr(0); n=len(coef)
        for i in range(n):
            for j in range(i+1,n):
                if (i+j)%2==1 and coef[i]!=0 and coef[j]!=0:
                    # 2 c_i c_j (s^i t^j + s^j t^i)/(s+t) = 2 c_i c_j (st)^i (t^m + s^m)/(s+t), m=j-i odd
                    m=j-i; q=sum(((-1)**k)*s**k*t**(m-1-k) for k in range(m))
                    tot+=2*coef[i]*coef[j]*(s*t)**i*q
        return tot
    return b,L
def Spsi(b,lam,mu,chi,chip):
    tot=Fr(0)
    for s,w in W:
        X=w(lam)
        for s2,w2 in W:
            Y=w2(mu)
            tot+=(s if chi else 1)*(s2 if chip else 1)*b(X[0])*b(X[1])*b(X[0]+X[1])*b(Y[0])*b(Y[1])*b(Y[0]+Y[1])/((X[0]+Y[0])*(X[1]+Y[1]))
    return tot
def SLL(b,L,lam,mu,chi,chip,sign):
    tot=Fr(0)
    for s,w in W:
        X=w(lam)
        for s2,w2 in W:
            Y=w2(mu)
            tot+=(s if chi else 1)*(s2 if chip else 1)*L(X[0],Y[0])*L(X[1],Y[1])*b(sign*(X[0]+X[1]))*b(sign*(Y[0]+Y[1]))
    return tot
random.seed(20261120)
rr=lambda: Fr(random.randint(-40,40),random.randint(7,23))+Fr(1,random.choice([97,89,83,79,101,103]))
# self-test of L against the quotient definition
b,L=mkb([Fr(3,2),Fr(-1,3),Fr(2),Fr(1)]); s,t=rr(),rr(); assert L(s,t)==(b(s)*b(t)-b(-s)*b(-t))/(s+t)
cnt=bad=0
for trial in range(8):
    deg=random.choice([2,3,4,5]); coef=[Fr(random.randint(-9,9),random.randint(1,5)) for _ in range(deg)]+[Fr(1)]
    b,L=mkb(coef); lam=(rr(),rr()); mu=(rr(),rr())
    for chi in (0,1):
        for chip in (0,1):
            base=Spsi(b,lam,mu,chi,chip); f=1+(-1 if chi else 1)*(-1 if chip else 1)
            cnt+=2; bad+=(SLL(b,L,lam,mu,chi,chip,-1)!=f*base)+(SLL(b,L,lam,mu,chi,chip,+1)!=f*base)
print("Lemma 1: exact identities checked:",cnt,"failures:",bad); out['lemma1']=dict(checked=cnt,failures=bad)
def inertia(M):      # exact inertia of a symmetric Fraction matrix by congruence with 1x1 / 2x2 pivots
    A=[r[:] for r in M]; n=len(A); idx=list(range(n)); pos=neg=0
    while idx:
        p=next((i for i in idx if A[i][i]!=0),None)
        if p is not None:
            d=A[p][p]; pos+=d>0; neg+=d<0; rest=[i for i in idx if i!=p]
            for i in rest:
                f=A[i][p]/d
                if f!=0:
                    for j in rest: A[i][j]-=f*A[p][j]
            idx=rest; continue
        pq=next(((i,j) for i in idx for j in idx if i<j and A[i][j]!=0),None)
        if pq is None: break
        i0,j0=pq                     # zero diagonal, non-zero off-diagonal: hyperbolic plane
        for k in idx: A[i0][k]+=A[j0][k]
        for k in idx: A[k][i0]+=A[k][j0]
    return int(pos),int(neg)
def gram(f,P): return [[f(P[i],P[j]) for j in range(len(P))] for i in range(len(P))]
def setup(aset):
    coef=[Fr(1)]
    for a_ in aset: coef=[ (coef[k-1] if k>0 else 0)+a_*(coef[k] if k<len(coef) else 0) for k in range(len(coef)+1)]
    coef=[ (coef[k-1] if k>0 else 0)-(coef[k] if k<len(coef) else 0) for k in range(len(coef)+1)]   # times (x-1)
    return mkb(coef)
F=lambda *v:[Fr(*t) for t in v]
rec=[]
print("Theorem 2/3 (general position, real zeros): neg(N) on random points vs the (2d+1) crossing matrix")
for aset in (F((1,3),(5,3)),F((2,7),(4,9)),F((1,5),(3,7),(5,2)),F((3,2),(7,3),(5,4)),F((1,6),(2,9),(3,11),(9,2))):
    d=len(aset); b,L=setup(aset); assert b(Fr(1))==0 and all(b(-a_)==0 for a_ in aset)
    n=d+1; P=[(rr(),rr()) for _ in range(n*n//2+4)]
    Nf=lambda l,m: SLL(b,L,l,m,1,1,-1)/2; Np=lambda l,m: SLL(b,L,l,m,0,0,-1)/2
    iN=inertia(gram(Nf,P)); iP=inertia(gram(Np,P))
    r=[Fr(1)]+[-a_ for a_ in aset]; C=[(r[0],r[0])]+[(r[0],r[j]) for j in range(1,d+1)]+[(r[j],r[0]) for j in range(1,d+1)]
    iC=inertia(gram(Nf,C))
    mu=P[0]; cid=0
    for p in C:
        Qev=sum(s*b(-(w(mu)[0]+w(mu)[1]))*L(p[0],w(mu)[0])*L(p[1],w(mu)[1]) for s,w in W)
        cid+= Nf(p,mu)!=b(-p[0]-p[1])*Qev
    rec.append((str(aset),iN,iP,iC,cid))
    print(" a=",[str(a_) for a_ in aset],"N:",iN,"(rank",sum(iN),"; n(n-1)/2 =",n*(n-1)//2,") N+:",iP,"(n(n+1)/2 =",n*(n+1)//2,") crossing:",iC,"crossing-identity failures:",cid,"| neg(N)+neg(N+) =",iN[1]+iP[1],"<= 2d =",2*d)
print("Symmetric sets: null vectors, X(d), Theorem 4")
for aset in (F((1,3),(2,3)),F((1,5),(4,5),(2,7),(5,7)),F((1,4),(3,4),(1,2)),F((1,2),),F((1,6),(5,6),(1,3),(2,3),(1,2))):
    d=len(aset); b,L=setup(aset); n=d+1; P=[(rr(),rr()) for _ in range(n*n//2+4)]
    Nf=lambda l,m: SLL(b,L,l,m,1,1,-1)/2; Np=lambda l,m: SLL(b,L,l,m,0,0,-1)/2
    iN=inertia(gram(Nf,P)); iP=inertia(gram(Np,P))
    nul=sum(Nf((Fr(1),-a_),m)!=0 for a_ in aset for m in P[:3])
    line=[(Fr(1),Fr(k,3)+Fr(1,7)) for k in range(-n-4,n+5)]; iPl=inertia(gram(Np,line))
    rec.append((str(aset),iN,iP,iPl,nul))
    print(" a=",[str(a_) for a_ in aset],"N(p_0j,.) non-zero entries:",nul,"| N:",iN,"| N+:",iP,"| N+ on pole line:",iPl,"| Theorem 4: neg(N)=%d <= d - neg(N+) = %d"%(iN[1],d-iP[1]))
out['d10']=rec
json.dump(out,open('r19_checks2.json','w'),indent=1,default=str)
