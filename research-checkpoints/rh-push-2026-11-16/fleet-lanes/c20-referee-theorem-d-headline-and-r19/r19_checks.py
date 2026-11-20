# Second-referee checks for round-19 lanes. Small sizes only (largest array: 2.4e5 complex128 ~ 4 MB).
import math, cmath, json, random
from fractions import Fraction as Fr
import numpy as np, mpmath as mp, sympy as sp
mp.mp.dps = 30
out = {}
print("=== U4: Lambda_2 = Lambda*log + Lambda*Lambda from a(n) by recursion")
def lam_from_a(a, N):          # a[1..N], a[1]=1
    Lam=[0.0]*(N+1)
    for n in range(2,N+1):
        s=a[n]*math.log(n)
        for d in range(2,n):
            if n%d==0: s-=Lam[d]*a[n//d]
        Lam[n]=s
    return Lam
def lam2(Lam,N):
    L2=[0.0]*(N+1)
    for n in range(2,N+1):
        s=Lam[n]*math.log(n)
        for d in range(2,n):
            if n%d==0: s+=Lam[d]*Lam[n//d]
        L2[n]=s
    return L2
N=60
def liou(n):
    c=0; m=n; p=2
    while m>1:
        while m%p==0: m//=p; c+=1
        p+=1
    return (-1)**c
a=[0]+[liou(n) for n in range(1,N+1)]
L2=lam2(lam_from_a(a,N),N)
neg=[n for n in range(2,N+1) if L2[n]<-1e-12]
print("Liouville: n<=60 with Lambda_2(n)<0:",neg," Lambda_2(6)=%.4f Lambda_2(12)=%.4f (pure cross -2log2log3=%.4f)"%(L2[6],L2[12],-2*math.log(2)*math.log(3)))
out['liouville_neg_L2']=neg
# 1/zeta (Moebius): all cross atoms positive
def mob(n):
    m=n;p=2;r=1
    while m>1:
        if m%p==0:
            m//=p
            if m%p==0: return 0
            r=-r
        p+=1
    return r
a=[0]+[mob(n) for n in range(1,N+1)]
Lm=lam_from_a(a,N); L2m=lam2(Lm,N)
cross=[n for n in range(2,N+1) if len(sp.factorint(n))==2]
print("1/zeta: min over two-prime n<=60 of cross part (Lambda*Lambda)(n):",min(L2m[n]-Lm[n]*math.log(n) for n in cross))
# HQ2 q=3: nu(q^k)/v = 1 + q^(k/2) c_k, c_k = coefficients of u R'/R, R = 1+eps u^2/(1-u)^4
u=sp.symbols('u')
def first_neg(R,q,K=40):
    ser=sp.series(u*sp.diff(R,u)/R,u,0,K+1).removeO()
    for k in range(1,K+1):
        ck=ser.coeff(u,k)
        if 1+sp.sqrt(q)**k*ck<0: return k
    return None
res={}
for eps in (sp.Integer(1),sp.Rational(1,10),sp.Rational(1,100)):
    res[str(eps)]=first_neg(1+eps*u**2/(1-u)**4,3)
print("HQ2 q=3 first k with nu(q^k)<0 (lane: 8, 13, 22):",res); out['hq2_first_neg']=res
# T-NR q=3, c=2.2: Lambda(q^j)/log q = 1 - q^(j/2)(alpha^j+alpha'^j), alpha+alpha'=-c, alpha alpha'=1
c=2.2; p1=-c; p2=c*c-2; vals=[1-3**0.5*p1, 1-3*p2]; pk=[p1,p2]
for j in (3,4):
    pk.append(-c*pk[-1]-pk[-2]); vals.append(1-3**(j/2)*pk[-1])
print("T-NR q=3 c=2.2 Lambda(q^j)/log q, j=1..4 (lane: 4.81,-7.52,22.0,-53.6):",[round(v,2) for v in vals]); out['tnr_lam']=vals
print("=== HQ2 screen, Lemma N instances")
# (a) all poles on |u|=1, zero inside: nu must change sign.  HQ1 eps=5 (zeros real negative, off the circle)
print("HQ1 q=3 eps=5 first negative k:",first_neg(1+5*u/(1-u)**2,3)," eps=3 (zeros on circle), first negative k<=40:",first_neg(1+3*u/(1-u)**2,3))
# (b) real pole r=1/2 inside all zeros (|z|=0.6): nu>=0 for all k<=60 is allowed by the lemma
R=(1+u**2/sp.Rational(36,100))/(1-2*u)
print("R=(1+u^2/0.36)/(1-2u), q=3: first negative k<=60:",first_neg(R,3,60),"(None = non-negative; real pole at r=0.5 <= |zeros|=0.6)")
# (c) zero strictly inside the smallest pole: must fail
R=(1+u**2/sp.Rational(16,100))/(1-2*u)
print("R=(1+u^2/0.16)/(1-2u) (zeros at 0.4i inside pole 0.5): first negative k:",first_neg(R,3,60))
print("=== DP census: constant of D'/D for a_P != 1.  D = 1 + 2*2^-s - 4^-s + 0.25*5^-s (P=5, a_P=0.25)")
an={1:1.0,2:2.0,4:-1.0,5:0.25}; uu=math.log(5)
def D(s): return sum(c*np.exp(-s*math.log(n)) for n,c in an.items())
def Dp(s): return sum(-math.log(n)*c*np.exp(-s*math.log(n)) for n,c in an.items())
T=1500.0
sg=np.arange(-6,3.01,0.25); tt=np.arange(-T-1,T+1,0.05)
print("planned grid:",len(sg)*len(tt),"complex128 =",len(sg)*len(tt)*16/1e6,"MB")
S,TT=np.meshgrid(sg,tt); z=(S+1j*TT).ravel()
for _ in range(60):
    d=Dp(z); d[np.abs(d)<1e-300]=1e-300; z=z-D(z)/d
ok=(np.abs(D(z))<1e-10)&(np.abs(z.imag)<T)&(np.abs(z.real)<50); z=z[ok]
z=z[np.argsort(z.imag)]; keep=[z[0]]
zs=sorted(z,key=lambda w:(round(w.imag,6),round(w.real,6)))
uniq=[]
for w in zs:
    if not uniq or abs(w-uniq[-1])>1e-6:
        if all(abs(w-v)>1e-6 for v in uniq[-6:]): uniq.append(w)
uniq=np.array(uniq)
# winding number on the rectangle [-8,4] x [-T,T]
def wind(x0,x1,y0,y1,n=400000):
    pts=np.concatenate([x0+1j*y0+(x1-x0)*np.linspace(0,1,n//20),x1+1j*(y0+(y1-y0)*np.linspace(0,1,n)),x1+1j*y1-(x1-x0)*np.linspace(0,1,n//20),x0+1j*(y1-(y1-y0)*np.linspace(0,1,n))])
    v=D(pts); return float(np.sum(np.angle(v[1:]/v[:-1]))/(2*math.pi))
w=wind(-8,4,-T,T)
xbar=float(np.mean(uniq.real))
print("zeros found:",len(uniq),"winding:",round(w,3),"T u/pi:",T*uu/math.pi,"mean Re:",xbar,"log|a_P|/u:",math.log(0.25)/uu)
rows=[]
for s0 in (2.0+3.0j, 0.5+0.7j, -1.0+11.0j):
    for Tc in (375.0,750.0,1500.0):
        sel=uniq[np.abs(uniq.imag)<Tc]
        r=complex(Dp(np.array([s0]))[0]/D(np.array([s0]))[0])+uu/2-complex(np.sum(1/(s0-sel)))
        pred=(uu*s0.real-math.log(0.25))/(math.pi*Tc)
        rows.append((str(s0),Tc,r.real,pred,r.real/pred))
        print("  s0",s0,"T",Tc,"residual Re:",r.real,"predicted tail (u Re s0 - log|a_P|)/(pi T):",pred,"ratio",r.real/pred)
print("  with a constant shifted by log|a_P|/2 = %.4f or log|a_P| = %.4f the residual would not tend to 0"%(math.log(0.25)/2,math.log(0.25)))
out['dp_const']=dict(found=len(uniq),winding=w,rows=rows,meanRe=xbar)
print("=== D10: Lemma 1, crossing identity, symmetric null vectors, Theorem 3 (exact rationals)")
x,y=sp.symbols('x y')
def mk(broots_or_poly):
    return sp.Poly(broots_or_poly,x)
def Lpoly(bp):
    b=bp.as_expr(); num=sp.expand(b*b.subs(x,y)-b.subs(x,-x)*b.subs(x,-x).subs(x,y) if False else b*b.subs(x,y)-b.subs(x,-x)*(b.subs(x,-x)).subs(x,y))
    return None
def make(bexpr):
    bf=sp.lambdify(x,bexpr,'sympy')
    by=bexpr.subs(x,y); bmx=bexpr.subs(x,-x); bmy=bexpr.subs(x,-y)
    Lq,rem=sp.div(sp.expand(bexpr*by-bmx*bmy),x+y,x)
    assert sp.expand(rem)==0
    Lf=sp.lambdify((x,y),Lq,'sympy')
    return bf,Lf
W=[('e',1,lambda z:(z[0],z[1])),('s1',-1,lambda z:(-z[0],z[0]+z[1])),('s2',-1,lambda z:(z[0]+z[1],-z[1])),
   ('c1',1,lambda z:(z[1],-z[0]-z[1])),('c2',1,lambda z:(-z[0]-z[1],z[0])),('w0',-1,lambda z:(-z[1],-z[0]))]
def Spsi(bf,lam,mu,chi,chip):
    tot=sp.Integer(0)
    for _,s,w in W:
        X=w(lam)
        for _,sp_,wp in W:
            Y=wp(mu)
            tot+= (s if chi else 1)*(sp_ if chip else 1)*bf(X[0])*bf(X[1])*bf(X[0]+X[1])*bf(Y[0])*bf(Y[1])*bf(Y[0]+Y[1])/((X[0]+Y[0])*(X[1]+Y[1]))
    return tot
def SLL(bf,Lf,lam,mu,chi,chip,sign):
    tot=sp.Integer(0)
    for _,s,w in W:
        X=w(lam)
        for _,sp_,wp in W:
            Y=wp(mu)
            tot+= (s if chi else 1)*(sp_ if chip else 1)*Lf(X[0],Y[0])*Lf(X[1],Y[1])*bf(sign*(X[0]+X[1]))*bf(sign*(Y[0]+Y[1]))
    return tot
random.seed(20261120)
rr=lambda: sp.Rational(random.randint(-40,40),random.randint(7,23))
bad=0;cnt=0
for trial in range(6):
    deg=random.choice([2,3,4])
    bexpr=sum(sp.Rational(random.randint(-9,9),random.randint(1,5))*x**k for k in range(deg))+x**deg
    bf,Lf=make(bexpr)
    lam=(rr()+sp.Rational(1,97),rr()+sp.Rational(1,89)); mu=(rr()+sp.Rational(1,83),rr()+sp.Rational(1,79))
    for chi in (0,1):
        for chip in (0,1):
            base=Spsi(bf,lam,mu,chi,chip)
            f1=(1+(( -1 if chi else 1)*(-1 if chip else 1)))   # 1+chi chi'(reflection)
            l1=SLL(bf,Lf,lam,mu,chi,chip,-1); l2=SLL(bf,Lf,lam,mu,chi,chip,+1)
            cnt+=2; bad+= (sp.nsimplify(l1-f1*base)!=0)+(sp.nsimplify(l2-f1*base)!=0)
print("Lemma 1: exact identities checked:",cnt,"failures:",bad); out['d10_lemma1']=dict(checked=cnt,failures=bad)
def Nq(bf,Lf,lam,mu):   # N = Q(j^-_lam, j^-_mu)/2, pole-free
    return SLL(bf,Lf,lam,mu,1,1,-1)/2
def Nplus(bf,Lf,lam,mu): return SLL(bf,Lf,lam,mu,0,0,-1)/2
def inertia(M,tol=1e-9):
    ev=np.linalg.eigvalsh(np.array(M.tolist(),dtype=float)); sc=max(abs(ev).max(),1e-300)
    return int((ev>tol*sc).sum()),int((ev<-tol*sc).sum())
def pts(k): return [(rr()+sp.Rational(1,101),rr()+sp.Rational(1,103)) for _ in range(k)]
# Theorem 3: general position real sets
for aset in ([sp.Rational(1,3),sp.Rational(5,3)],[sp.Rational(1,5),sp.Rational(3,7),sp.Rational(5,2)],[sp.Rational(-0,1)+sp.Rational(2,7),sp.Rational(4,9)]):
    d=len(aset); g=sp.Integer(1)
    for a_ in aset: g*= (x+a_)
    bexpr=sp.expand((x-1)*g); bf,Lf=make(bexpr)
    P=pts(d*(d+1)//2+6)
    G=sp.Matrix(len(P),len(P),lambda i,j:Nq(bf,Lf,P[i],P[j]))
    r=[sp.Integer(1)]+[-a_ for a_ in aset]
    I=[(0,0)]+[(0,j) for j in range(1,d+1)]+[(j,0) for j in range(1,d+1)]
    C=[(r[i],r[j]) for i,j in I]
    Gc=sp.Matrix(len(C),len(C),lambda i,j:Nq(bf,Lf,C[i],C[j]))
    Gp=sp.Matrix(len(P),len(P),lambda i,j:Nplus(bf,Lf,P[i],P[j]))
    # crossing identity: N(p_0j, mu) via 36-term sum vs b(-r_i-r_j) Q(ev_p, j^-_mu)
    mu=P[0]; p=C[1]
    Qev=sum(s*bf(-(w(mu)[0]+w(mu)[1]))*Lf(p[0],w(mu)[0])*Lf(p[1],w(mu)[1]) for _,s,w in W)
    cid=sp.nsimplify(Nq(bf,Lf,p,mu)-bf(-p[0]-p[1])*Qev)
    print("a =",aset,"| inertia N on",len(P),"pts:",inertia(G),"rank",G.rank(),"| (2d+1) crossing matrix:",inertia(Gc),"| N+:",inertia(Gp),"rank",Gp.rank(),"| crossing identity defect:",cid,
          "| Thm 2: neg(N)+neg(N+) <= 2d:",inertia(G)[1]+inertia(Gp)[1],"<=",2*d)
# symmetric sets: N(p_0j, .) = 0, N >= 0 ?, neg(N+) >= d ?
for aset in ([sp.Rational(1,3),sp.Rational(2,3)],[sp.Rational(1,5),sp.Rational(4,5),sp.Rational(2,7),sp.Rational(5,7)],[sp.Rational(1,4),sp.Rational(3,4),sp.Rational(1,2)]):
    d=len(aset); g=sp.Integer(1)
    for a_ in aset: g*= (x+a_)
    bexpr=sp.expand((x-1)*g); bf,Lf=make(bexpr)
    P=pts(d*(d+1)//2+6)
    G=sp.Matrix(len(P),len(P),lambda i,j:Nq(bf,Lf,P[i],P[j]))
    Gp=sp.Matrix(len(P),len(P),lambda i,j:Nplus(bf,Lf,P[i],P[j]))
    nul=[sp.nsimplify(Nq(bf,Lf,(sp.Integer(1),-a_),P[0])) for a_ in aset]
    print("symmetric a =",aset,"| N(p_0j,mu):",nul,"| inertia N:",inertia(G),"rank",G.rank(),"| inertia N+:",inertia(Gp),"rank",Gp.rank(),"| neg(N) <= d - neg(N+):",inertia(G)[1],"<=",d-inertia(Gp)[1])
print("=== RS lane, Lemma P: sign of rho = theta'/pi")
rho=lambda t: (mp.re(mp.digamma(mp.mpf(1)/4+1j*mp.mpf(t)/2))-mp.log(mp.pi))/(2*mp.pi)
x0=mp.findroot(rho,6.3)
mass=2*mp.quad(rho,[0,x0])
print("rho(0)=",mp.nstr(rho(0),6),"sign change x0=",mp.nstr(x0,8),"negative mass=",mp.nstr(mass,7))
# concavity: largest x with rho''(x) >= 0
rpp=lambda t: mp.diff(rho,t,2)
xs=[mp.mpf(k)/10 for k in range(1,400)]; last=max([float(t) for t in xs if rpp(t)>=0] or [0])
print("largest grid x in (0,40) with rho''>=0:",last,"; rho'' at 1e3, 1e6:",mp.nstr(rpp(1000),5),mp.nstr(rpp(10**6),5))
# counterexample U=10, h=sin(pi s/10): int |g|^2 rho dx
U=10
def g2(t):
    f=lambda s: mp.sin(mp.pi*s/U)*mp.exp(-1j*s*t)
    v=mp.quad(f,[0,U]); return abs(v)**2
val=mp.quad(lambda t: g2(t)*rho(t),mp.linspace(-60,60,41))
print("U=10, h=sin(pi s/10): int_{-60}^{60} |g|^2 rho dx =",mp.nstr(val,6)," (2 pi)*that =",mp.nstr(2*mp.pi*val,6)," norm^2 = 5; sup_{|x|<=x0}|g|^2 =",mp.nstr(max(g2(t) for t in mp.linspace(0,x0,30)),6))
out['rs']=dict(rho0=float(rho(0)),x0=float(x0),negmass=float(mass),ce=float(val))
for (tw,m,u_) in ((1e6,384,0.75*math.log(1e6)),(1e9,384,0.75*math.log(1e9)),(1e12,384,0.75*math.log(1e12))):
    span=720+2*math.pi*m/u_
    print("  mode-space correction bound 2.2479*4m/(u (t_w-span-x0)^2): t_w=%g m=%d u=%.2f -> %.3e"%(tw,m,u_,2.2479*4*m/(u_*(tw-span-6.29)**2)))
json.dump(out,open('r19_checks.json','w'),indent=1,default=str)
