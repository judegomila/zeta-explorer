# (1) check of the congruence w^T T_N w = a*sum_rho H(rho) on a low-order vector (zeta, a=1, W=(1-x)^3, V=8/(z+1)^4)
# (2) T* = top of the highest negative lens at beta=1/2 ; (3) dual witnesses d = q(rho)+q(i tau1)
import json, mpmath as mp
from flint import arb, acb, ctx
D=json.load(open('w149.json'))
mp.mp.dps=40
c=[mp.mpf(x) for x in D['zeta_c'][:4]]; wv=[1,-3,3,-1]
lhs=sum(wv[i]*wv[j]*c[abs(i-j)] for i in range(4) for j in range(4))
gz=[mp.im(mp.zetazero(k)) for k in range(1,41)]
rhs=sum(2*64/(1+g*g)**4 for g in gz)
print("(1) zeta, W=(1-x)^3: w^T T_4 w =",mp.nstr(lhs,15)," sum over 40 zeros of 64/(1-rho^2)^4 =",mp.nstr(rhs,15))
ctx.prec=2600
w=[arb(x) for x in D['w']]
def H(b,g):
    z=acb(arb(b),arb(g)); ze=(z-1)/(z+1); zi=1/ze
    A=acb(0); B=acb(0)
    for cc in reversed(w):
        A=A*ze+cc; B=B*zi+cc
    return A*B/(1-z*z)
# (2)
lo,hi=arb('937.5'),arb('945')
for _ in range(40):
    mid=(lo+hi)/2
    if H('0.5',mid).real<0: lo=mid
    else: hi=mid
print("(2) sup of gamma with Re H(1/2+i gamma)<0 :",lo.str(10))
for g in ('945','1000','2000','1e4','1e6'):
    mn=min(float((H(b,g).real/abs(H(b,g))).mid()) for b in ('0.5','0.4','0.3','0.2','0.1','0.03'))
    print("   gamma=%s min over beta grid of cos(arg H) = %.6f"%(g,mn))
# (3) minimum of H(i tau) near the first DH zero
def Hr(t): return H('0',t).real
best=None
a_,b_=arb('5.0941598'),arb('5.0941599')
# golden-section on log H
import math
pts=[arb('5.09415984457109492569879')+arb(k)*arb(10)**-22 for k in range(-50,51)]
vals=[(Hr(t),t) for t in pts]
m=min(vals,key=lambda x: float(x[0].mid().str(5,radius=False)) if False else x[0].mid())
print("(3) H(i tau) at tau=gamma_1(DH) (25 digits):",Hr(arb('5.09415984457109492569879')).str(8)," min on a 1e-22 grid around it:",m[0].str(8))
# scan wider for a tiny on-axis value: values of H(i tau) on a few points
for t in ('5.0','5.09','5.094','5.0942','5.1','6','14.404','85.7','100','300','937.5','2000'):
    print("   H(i*%s) = %s"%(t,Hr(arb(t)).str(6)))
for b,g in (('0.3085','85.699348'),('0.5','937.5'),('0.5','667.3'),('0.5','518.3'),('0.5','424.0'),('0.5','204.4'),('0.5','101.9')):
    h=H(b,g); print("   quartet at %s+%si: 4 Re H = %s"%(b,g,(4*h.real).str(8)))
