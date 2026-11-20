import mpmath as mp, math, cmath
mp.mp.dps=25
def primes(Q):
    s=[True]*(Q+1); out=[]
    for i in range(2,Q+1):
        if s[i]:
            out.append(i)
            for j in range(i*i,Q+1,i): s[j]=False
    return out
def A(s,P):
    v=s*(s-1)/2*mp.power(mp.pi,-s/2)*mp.gamma(s/2)
    for p in P: v/= (1-mp.power(p,-s))
    return v
def dlogA(s,P):
    return 1/s+1/(s-1)-mp.log(mp.pi)/2+mp.digamma(s/2)/2-mp.fsum(mp.log(p)/(mp.power(p,s)-1) for p in P)
print("== 3c. Q=30 symmetrized cascade: locate off-line zeros in t in [100.3,130.3]")
P=primes(30)
best=[]
for i in range(1,16):
    for k in range(0,301):
        s=mp.mpc(0.5+0.1*i,100.3+0.1*k)
        v=abs(1+A(1-s,P)/A(s,P))
        best.append((v,s))
best.sort(key=lambda x:x[0])
found=[]
for v,s in best[:12]:
    try:
        r=mp.findroot(lambda z:1+A(1-z,P)/A(z,P),s)
        if mp.re(r)>0.5+1e-6 and 100<mp.im(r)<131 and all(abs(r-f)>1e-6 for f in found): found.append(r)
    except Exception as e: pass
for r in found:
    # check criterion along the horizontal ray at this height
    t=mp.im(r); mn=min(mp.re(dlogA(mp.mpc(0.5+0.01*j,t),P)) for j in range(0,300))
    print(" off-line zero of xi_30 at",mp.nstr(r,12)," |xi_30|/|A| =",mp.nstr(abs(1+A(1-r,P)/A(r,P)),3)," min_{sigma>=1/2} Re A'/A at this height =",mp.nstr(mn,6))
print("== 4. Davenport-Heilbronn: parallel junction")
kap=(mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
c1=(1-1j*kap)/2; c2=(1+1j*kap)/2
chi=[0,1,1j,-1j,-1]     # chi(2)=i mod 5
chib=[0,1,-1j,1j,-1]
def Lf(s,ch,d=0):
    # L(s,chi)=5^-s sum_a chi(a) hurwitz(s,a/5)
    if d==0: return mp.power(5,-s)*mp.fsum(ch[a]*mp.zeta(s,mp.mpf(a)/5) for a in range(1,5))
    return mp.diff(lambda z:Lf(z,ch),s)
def f(s): return c1*Lf(s,chi)+c2*Lf(s,chib)
print(" |c1|=|c2|:",mp.nstr(abs(c1),8),mp.nstr(abs(c2),8))
s0=mp.findroot(f,mp.mpc(0.808517,85.699348))
print(" DH off-line zero:",mp.nstr(s0,12)," |f|=",mp.nstr(abs(f(s0)),3))
L1=Lf(s0,chi);L2=Lf(s0,chib)
print(" at the zero: L1/L2 =",mp.nstr(L1/L2,10)," -c2/c1 =",mp.nstr(-c2/c1,10)," |L1/L2|=",mp.nstr(abs(L1/L2),10))
for eps in (0.05,0.01):
  for ang in (0,mp.pi/2,mp.pi,3*mp.pi/2):
    s=s0+eps*mp.expj(ang)
    lam=c1*Lf(s,chi)/f(s)
    d1=Lf(s,chi,1)/Lf(s,chi); d2=Lf(s,chib,1)/Lf(s,chib)
    tot=lam*d1+(1-lam)*d2
    print(f"  eps={eps} ang={float(ang):.2f}: lambda={mp.nstr(lam,5)}  Re L1'/L1={mp.nstr(mp.re(d1),5)} Re L2'/L2={mp.nstr(mp.re(d2),5)}  Re f'/f={mp.nstr(mp.re(tot),6)}")
# zero in Re s>1 of the DH function: scan with truncated Euler products as locator, refine on f
print(" search for a DH zero with Re s > 1 (scan |L1/L2 + c2/c1| on sigma in [1.01,1.3])")
target=-c2/c1
import numpy as np
def chiv(n,ch): return ch[n%5]
N=1500
ns=np.arange(1,N+1); a1=np.array([complex(chi[n%5]) for n in ns]); a2=np.conj(a1); ln=np.log(ns)
cc1=complex(c1); cc2=complex(c2)
cands=[]
for sig in (1.02,1.05,1.1):
    w=ns**(-sig)
    ts=np.arange(0,6000,0.05)
    for blk in range(0,len(ts),4000):
        tb=ts[blk:blk+4000]
        E=np.exp(-1j*np.outer(tb,ln))
        v=np.abs(E@(w*(cc1*a1+cc2*a2)))
        i=np.argmin(v); cands.append((v[i],sig,tb[i]))
cands.sort()
res=[]
for v,sig,t in cands[:25]:
    try:
        r=mp.findroot(f,mp.mpc(sig,t))
        if mp.re(r)>1 and all(abs(r-x)>1e-6 for x in res): res.append(r)
    except Exception: pass
for r in res[:5]: print("  DH zero with Re s>1:",mp.nstr(r,12)," |f|=",mp.nstr(abs(f(r)),3))
if not res: print("  none found in t<6000 by this scan; smallest |f| candidates:",[(round(float(v),4),s,round(float(t),2)) for v,s,t in cands[:3]])
