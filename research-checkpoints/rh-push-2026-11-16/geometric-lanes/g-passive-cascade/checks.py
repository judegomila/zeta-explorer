# g-passive-cascade numerics (mpmath, MEASURED, not interval-certified)
import mpmath as mp, math, cmath, sys
mp.mp.dps = 30
def primes(Q):
    s=[True]*(Q+1); out=[]
    for i in range(2,Q+1):
        if s[i]:
            out.append(i)
            for j in range(i*i,Q+1,i): s[j]=False
    return out
print("== 1. Foster identity: -zeta'/zeta(s) = sum_p (log p/2)(coth(s log p/2)-1)")
s=mp.mpc(2,3)
P=primes(200000)
lhs=-mp.zeta(s,derivative=1)/mp.zeta(s)
rhs=mp.fsum((mp.log(p)/2)*(mp.coth(s*mp.log(p)/2)-1) for p in P)
print(" |lhs-rhs| =",mp.nstr(abs(lhs-rhs),5)," (tail bound ~ Q^-1 =",1/200000.,")")
# each stub positive-real: sample
import random
random.seed(1)
mn=min(mp.re(mp.coth(mp.mpc(random.uniform(1e-3,3),random.uniform(-50,50))*mp.log(p)/2)) for p in P[:20] for _ in range(200))
print(" min Re coth over samples in Re s>0:",mp.nstr(mn,5))

print("== 2. truncated compensated one-port L_Q on the boundary Re s = 1/2")
def Gt(s): return 1/s - mp.log(mp.pi)/2 + mp.digamma(s/2)/2   # gamma part without 1/(s-1)
def vonM(Q):
    L=[]
    for p in primes(Q):
        q=p
        while q<=Q:
            L.append((q,math.log(p))); q*=p
    return L
for Q in (10,100,1000,10000):
    VM=vonM(Q); mnv=None; mxv=None; neg=0; tot=0
    lq=math.log(Q)
    for k in range(1,1201):
        t=k*0.05; s=complex(0.5,t)
        g=complex(Gt(mp.mpc(0.5,t)))
        ps=sum(l*cmath.exp(-s*math.log(n)) for n,l in VM)
        comp=(cmath.exp((1-s)*lq)-1)/(1-s)       # int_1^Q x^-s dx
        v=(g-ps+comp).real
        tot+=1; neg+= v<0
        mnv=v if mnv is None else min(mnv,v); mxv=v if mxv is None else max(mxv,v)
    print(f" Q={Q:6d}: Re L_Q(1/2+it), t in (0,60]: min={mnv:+.4f} max={mxv:+.4f} frac negative={neg/tot:.3f}")

print("== 3. reservoir vs worst-case finite cascade draw (local HB criterion)")
def ReG(sig,t):
    s=mp.mpc(sig,t); return mp.re(1/s+1/(s-1)-mp.log(mp.pi)/2+mp.digamma(s/2)/2)
PP=primes(2000000)
for t in (1e2,1e4,1e6,1e9,1e12,1e20):
    R=float(ReG(0.5,t)); acc=0; Qs=None
    for p in PP:
        acc+=math.log(p)/(math.sqrt(p)-1)
        if acc>=R: break
        Qs=p
    print(f" t={t:.0e}: Re G(1/2+it)={R:.4f}  largest Q with worst-case draw < reservoir: Q*={Qs}")

print("== 3b. symmetrized finite cascade xi_Q = A_Q(s)+A_Q(1-s): zeros in box vs on line")
mp.mp.dps=25
def A(s,P):
    v=s*(s-1)/2*mp.power(mp.pi,-s/2)*mp.gamma(s/2)
    for p in P: v/= (1-mp.power(p,-s))
    return v
def xiQ(s,P): return A(s,P)+A(1-s,P)
def count(P,T0,T1,h=0.02):
    # on-line sign changes of the real function 2 Re A(1/2+it) * e^{pi t/4}
    n=int((T1-T0)/h); prev=None; sc=0
    for k in range(n+1):
        t=T0+k*h; v=mp.re(A(mp.mpc(0.5,t),P))
        sg= v>0
        if prev is not None and sg!=prev: sc+=1
        prev=sg
    # winding number around rectangle [-1.5,2.5]x[T0,T1]
    pts=[]
    m=600
    for k in range(m): pts.append(mp.mpc(-1.5+4*k/m,T0))
    mv=int((T1-T0)/0.01)
    for k in range(mv): pts.append(mp.mpc(2.5,T0+(T1-T0)*k/mv))
    for k in range(m): pts.append(mp.mpc(2.5-4*k/m,T1))
    for k in range(mv): pts.append(mp.mpc(-1.5,T1-(T1-T0)*k/mv))
    tot=mp.mpf(0); pv=xiQ(pts[0],P); v0=pv
    for z in pts[1:]+[pts[0]]:
        v=xiQ(z,P); tot+=mp.arg(v/pv); pv=v
    return sc, int(mp.nint(tot/(2*mp.pi)))
T0,T1=100.3,130.3
for Q in (3,7,30,300):
    P=primes(Q)
    draw=sum(math.log(p)/(math.sqrt(p)-1) for p in P)
    sc,w=count(P,T0,T1)
    print(f" Q={Q:4d} primes={len(P):3d} worst-case draw={draw:7.3f} reservoir(t=100)={float(ReG(0.5,100)):.3f}: on-line sign changes={sc}, zeros in box (winding)={w}, off-line={w-sc}")
