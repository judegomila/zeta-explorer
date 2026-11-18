"""High-precision (mpmath, 50 digits) check of sign witnesses for Part B, and search for small counterexamples.
Derivative along F_t = F_zz/4 by central difference with h = 1e-12 on the exactly flowed polynomial."""
import sys, json, random, itertools
from fractions import Fraction as Fr
import mpmath as mp
mp.mp.dps=50

def poly_from_zeros(zs):   # zs list of (Fr re, Fr im); returns coefficient list highest first, entries (Fr,Fr)
    c=[(Fr(1),Fr(0))]
    for a,b in zs:
        new=[(Fr(0),Fr(0))]*(len(c)+1); new=list(new)
        for i,(x,y) in enumerate(c):
            new[i]=(new[i][0]+x,new[i][1]+y)
            new[i+1]=(new[i+1][0]-(x*a-y*b), new[i+1][1]-(x*b+y*a))
        c=new
    return c
def deriv(c):
    n=len(c)-1; return [ (c[i][0]*(n-i), c[i][1]*(n-i)) for i in range(n)] if n>0 else [(Fr(0),Fr(0))]
def add(c,d):
    L=max(len(c),len(d)); c=[(Fr(0),Fr(0))]*(L-len(c))+list(c); d=[(Fr(0),Fr(0))]*(L-len(d))+list(d)
    return [(x[0]+y[0],x[1]+y[1]) for x,y in zip(c,d)]
def scal(c,s): return [(x*s,y*s) for x,y in c]
def flow(c,t):   # exact: sum_k (t/4)^k/k! F^(2k)
    out=c; term=c; k=0
    while len(term)>2:
        k+=1; term=scal(deriv(deriv(term)),Fr(t)/4/k); out=add(out,term)
    return out
def tomp(c): return [mp.mpc(mp.mpf(x.numerator)/x.denominator, mp.mpf(y.numerator)/y.denominator) for x,y in c]
def inv(c,alpha):
    D=add(c,scal(deriv(c),alpha)); Dm=tomp(D); Fm=tomp(c); D1=tomp(deriv(D))
    roots=mp.polyroots(Dm,maxsteps=500,extraprec=200)
    P=[r for r in roots if mp.re(r)>0]
    k=len(P)
    if k==0: return dict(kappa=0,HS=mp.mpf(0),op=mp.mpf(0),sumRe=mp.mpf(0))
    r=[2*mp.polyval(Fm,p)/mp.polyval(D1,p) for p in P]
    A=mp.matrix(k,k); 
    for j in range(k):
        for l in range(k): A[j,l]=1/(mp.conj(P[j])+P[l])
    R=mp.diag(r); T=R.H*A*R*A.conjugate()
    E_=mp.eig(T,left=False,right=False); E_=E_[0] if isinstance(E_,tuple) else E_
    ev=sorted([mp.re(e) for e in E_],reverse=True)
    return dict(kappa=k,HS=sum(ev),op=ev[0],sumRe=sum(mp.re(p) for p in P),sv=[mp.sqrt(e) for e in ev])
def dd(zs,alpha,h=Fr(1,10**12)):
    c=poly_from_zeros(zs)
    f0=inv(c,alpha); fp=inv(flow(c,h),alpha); fm=inv(flow(c,-h),alpha)
    return f0,{k:(fp[k]-fm[k])/(2*mp.mpf(h.numerator)/h.denominator) for k in ("HS","op","sumRe")}

def show(name,zs,alphas):
    print("==",name,"zeros",[(str(a),str(b)) for a,b in zs])
    for al in alphas:
        f0,d=dd(zs,Fr(al))
        print(f"  alpha={str(al):5s} kappa={f0['kappa']} sv={[mp.nstr(s,12) for s in f0['sv']]} dHS/dt={mp.nstr(d['HS'],15)} dop/dt={mp.nstr(d['op'],15)} dSumRe p/dt={mp.nstr(d['sumRe'],15)}")

if __name__=="__main__":
    al=[Fr(3,10),Fr(1),Fr(10)]
    # 1. isolated pair: HS = alpha^2/(alpha^2+sigma^2), d/dt = alpha^2/(2(alpha^2+sigma^2)^2)
    zs=[(Fr(7,10),Fr(0)),(Fr(-7,10),Fr(0))]; show("pair",zs,al)
    print("   closed form d/dt at alpha=1:", 1/(2*(1+0.49)**2))
    # 2. small search: one pair +- s + i b plus one or two axis zeros (class H, kappa=1) with dHS/dt<0
    random.seed(3); found=0
    for it in range(4000):
        s=Fr(random.randint(1,40),20); b=Fr(random.randint(-40,40),20)
        ax=[(Fr(0),Fr(random.randint(-60,60),20)) for _ in range(random.randint(1,2))]
        if len(set(ax))<len(ax): continue
        zs=[(s,b),(-s,b)]+ax
        f0,d=dd(zs,Fr(1))
        if d["HS"]<0:
            show("kappa=1 class-H witness",zs,al); found+=1
            if found>=2: break
    print("kappa=1 class H witnesses found:",found,"in",it+1)
    # 3. even: one real pair +-s plus axis pairs +-i g (kappa=1, even)
    found=0
    for it in range(4000):
        s=Fr(random.randint(1,40),20)
        ax=[]
        for _ in range(random.randint(1,3)):
            g=Fr(random.randint(1,60),20); ax+=[(Fr(0),g),(Fr(0),-g)]
        if len(set(ax))<len(ax): continue
        zs=[(s,Fr(0)),(-s,Fr(0))]+ax
        f0,d=dd(zs,Fr(1))
        if d["HS"]<0:
            show("kappa=1 even witness",zs,al); found+=1
            if found>=2: break
    print("kappa=1 even witnesses found:",found,"in",it+1)
    # 4. one quartet alone and with axis pairs (even, kappa=2)
    found=0; tot=0
    for it in range(3000):
        s=Fr(random.randint(1,40),20); b=Fr(random.randint(1,60),20)
        ax=[]
        for _ in range(random.randint(0,2)):
            g=Fr(random.randint(1,60),20); ax+=[(Fr(0),g),(Fr(0),-g)]
        if len(set(ax))<len(ax): continue
        zs=[(s,b),(-s,b),(s,-b),(-s,-b)]+ax; tot+=1
        f0,d=dd(zs,Fr(1))
        if d["HS"]<0 or d["op"]<0:
            if found<3: show("one-quartet witness (n axis zeros=%d)"%len(ax),zs,al)
            found+=1
    print("one-quartet configurations with dHS/dt<0 or dop/dt<0 at alpha=1:",found,"of",tot)
