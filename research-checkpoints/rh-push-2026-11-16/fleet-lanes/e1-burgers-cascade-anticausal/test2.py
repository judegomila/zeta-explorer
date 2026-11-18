"""(a) float64 sign count of d/dt Phi_alpha, Phi_alpha = sum of Re p over zeros p of D = F + alpha F' in Re z > 0,
       via the exact formula p' = -D''(p)/(4 D'(p)); same 1e4 configurations as test1 (seed 1).
   (b) exact Q(i) count of the lower bound  -d/dt sum_{RHP} Re rho >= (1/4) sum_{RHP} 1/Re rho  (pair-partner term).
   (c) mpmath check of the flux identity  sum_{p in R} p' = -(1/4)(1/(2 pi i)) oint_{dR} M^2 dz, M = D'/D."""
import random, json
import numpy as np, mpmath as mp
from fractions import Fraction as Fr
import test1 as T
random.seed(1)
alphas=[0.3,1.0,10.0]; cnt={a:[0,0] for a in alphas}; worst={a:-1e9 for a in alphas}; lb_fail=0; kap_mismatch=0
for it in range(10000):
    mode="H" if it%2==0 else "even"
    zs=T.config(mode)
    v=T.vel(zs); R=[j for j,z in enumerate(zs) if z.a>0]
    lhs=-sum(v[j].a for j in R); rhs=sum(Fr(1,4)/zs[j].a for j in R)
    if not lhs>=rhs: lb_fail+=1
    A,kap=T.exactA(zs); T.partB(zs,alphas)   # keep the random stream identical to test1 (no randomness inside)
    c=np.poly(np.array([z.c() for z in zs])); F=np.poly1d(c)
    for al in alphas:
        D=F+al*F.deriv(); r=D.roots; P=r[r.real>1e-9]
        if len(P)!=kap: kap_mismatch+=1
        d=float((-D.deriv(2)(P)/(4*D.deriv()(P))).real.sum())
        cnt[al][0 if d<0 else 1]+=1; worst[al]=max(worst[al],d)
print("d/dt Phi_alpha: [neg,nonneg] per alpha",cnt,"largest value",worst)
print("exact lower bound -dPhi_0/dt >= (1/4) sum 1/Re rho: failures",lb_fail,"of 10000; kappa(D) != kappa(F) cases",kap_mismatch)
# (c)
mp.mp.dps=30
zs=[mp.mpc(0.6,0.7),mp.mpc(-0.6,0.7),mp.mpc(0.6,-0.7),mp.mpc(-0.6,-0.7),mp.mpc(0,2),mp.mpc(0,-2),mp.mpc(0,0.65),mp.mpc(0,-0.65),mp.mpc(1.1,0),mp.mpc(-1.1,0)]
al=mp.mpf(1)
def F(z): return mp.fprod([z-w for w in zs])
def Dfun(z,k=0): return mp.diff(F,z,k)+al*mp.diff(F,z,k+1)
coef=mp.taylor(lambda z: F(z)+al*mp.diff(F,z),0,len(zs)); roots=mp.polyroots(coef[::-1],maxsteps=300,extraprec=100)
x0,x1,y0,y1=mp.mpf('0.05'),mp.mpf(3),mp.mpf('-1.5'),mp.mpf('1.7')
inside=[p for p in roots if x0<mp.re(p)<x1 and y0<mp.im(p)<y1]
lhs=sum(-Dfun(p,2)/(4*Dfun(p,1)) for p in inside)
M2=lambda z:(Dfun(z,1)/Dfun(z,0))**2
corners=[mp.mpc(x0,y0),mp.mpc(x1,y0),mp.mpc(x1,y1),mp.mpc(x0,y1),mp.mpc(x0,y0)]
integ=sum(mp.quad(lambda s:M2(a+(b-a)*s)*(b-a),[0,0.25,0.5,0.75,1]) for a,b in zip(corners,corners[1:]))
rhs=-integ/(8j*mp.pi)
print("flux identity: zeros in box",len(inside),"sum p' =",mp.nstr(lhs,15)," -(1/4)(1/2 pi i) oint M^2 =",mp.nstr(rhs,15)," |diff| =",mp.nstr(abs(lhs-rhs),3))
