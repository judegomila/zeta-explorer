# Exact reciprocity for the n4 off-diagonal (first moment), small size.
# LHS  = sum_{c>=1} w(c) sum_{n in Z} S(n,l;c) f(n)                         (Kloosterman side, moduli c)
# MID  = fhat(0) w(1) + sum_{c>=1} w(c) sum_{m!=0,(m,c)=1} e(l mbar/c) fhat(m/c)   (K2, lattice side)
# RHS  = fhat(0) w(1) + sum_{m'>=1} (1/m') sum_{+-} sum_k S(l, +-k; m') Ghat^{+-}_{m'}(k/m')   (moduli m')
# G^{+-}_{m'}(c) = e(+-l/(m'c)) fhat(+-m'/c) w(c) for c>0, 0 otherwise; Ghat(xi) = int G(c) e(c xi) dc.
import sys, math, cmath
import numpy as np
import mpmath as mp
l=int(sys.argv[1]) if len(sys.argv)>1 else 3
u0,s,c0,sig=4.3,6.0,14.0,(float(sys.argv[2]) if len(sys.argv)>2 else 5.0)
e=lambda x: cmath.exp(2j*math.pi*x)
f=lambda u: math.exp(-math.pi*((u-u0)/s)**2)
fhat=lambda y: s*math.exp(-math.pi*(s*y)**2)*e(u0*y)
w=lambda c: math.exp(-math.pi*((c-c0)/sig)**2)
def kloos(a,b,c):
    if c==1: return 1.0+0j
    t=0j
    for r in range(1,c):
        if math.gcd(r,c)==1: t+=e((a*pow(r,-1,c)+b*r)/c)
    return t
CMAX=45; NR=80
lhs=0j
for c in range(1,CMAX+1):
    for n in range(-NR,NR+1):
        fn=f(n)
        if fn<1e-22: continue
        lhs+=w(c)*kloos(n,l,c)*fn
mid=fhat(0)*w(1)
npairs=0
for c in range(1,CMAX+1):
    for m in range(-c,c+1):          # fhat(m/c) < 1e-45 beyond |m|>c
        if m==0 or math.gcd(abs(m),c)!=1: continue
        mb=pow(m%c,-1,c) if c>1 else 0
        mid+=w(c)*e(l*mb/c)*fhat(m/c); npairs+=1
# RHS: quadrature on a grid; planned allocation printed
h=1/512; cg=np.arange(h,70,h)
print("planned grid: %d points, complex128 work arrays ~ %.1f MB"%(cg.size, 5*cg.size*16/1e6))
wc=np.exp(-np.pi*((cg-c0)/sig)**2)
rhs=fhat(0)*w(1); MMAX=45; nk=0; tailmax=0.0; knz=0j
for mp_ in range(1,MMAX+1):
    for sg in (+1,-1):
        G=np.exp(2j*np.pi*(sg*l/(mp_*cg)))*s*np.exp(-np.pi*(s*mp_/cg)**2)*np.exp(2j*np.pi*u0*sg*mp_/cg)*wc
        if np.max(np.abs(G))<1e-20: continue
        K=4*mp_+8
        for k in range(-K,K+1):
            Gh=h*np.sum(G*np.exp(2j*np.pi*cg*k/mp_))
            if abs(k)>=K-1: tailmax=max(tailmax,abs(Gh))
            if abs(Gh)<1e-18: continue
            rhs+=Gh*kloos(l,sg*k,mp_)/mp_; nk+=1
            if k!=0: knz+=Gh*kloos(l,sg*k,mp_)/mp_
print("l =",l)
print("LHS (Kloosterman, moduli c)   =",lhs)
print("MID (coprime lattice (m,c))   =",mid,"   pairs:",npairs)
print("RHS (Kloosterman, moduli m')  =",rhs,"   (k,m') terms used:",nk," tail |Ghat| at k edge:",tailmax)
print("sigma =",sig," part of RHS from k != 0 (Kloosterman, not Ramanujan):",knz)
print("|LHS-MID| = %.3e   |MID-RHS| = %.3e   |LHS-RHS| = %.3e   |LHS| = %.6f"%(abs(lhs-mid),abs(mid-rhs),abs(lhs-rhs),abs(lhs)))
# mpmath cross-check of one Ghat
mp.mp.dps=25
mq,kq,sg=3,2,1
Gm=lambda c: mp.exp(2j*mp.pi*(sg*l/(mq*c)))*s*mp.exp(-mp.pi*(s*mq/c)**2)*mp.exp(2j*mp.pi*u0*sg*mq/c)*mp.exp(-mp.pi*((c-c0)/sig)**2)*mp.exp(2j*mp.pi*c*kq/mq)
val=mp.quad(Gm,mp.linspace(0,70,281))
G=np.exp(2j*np.pi*(sg*l/(mq*cg)))*s*np.exp(-np.pi*(s*mq/cg)**2)*np.exp(2j*np.pi*u0*sg*mq/cg)*wc
print("Ghat(m'=3,k=2,+): grid",h*np.sum(G*np.exp(2j*np.pi*cg*kq/mq))," mpmath",complex(val))
