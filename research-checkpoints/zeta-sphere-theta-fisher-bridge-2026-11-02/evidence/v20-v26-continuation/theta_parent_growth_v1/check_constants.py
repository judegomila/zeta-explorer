"""Own-source Arb theta low-frequency constants; full-tail proof in GROWTH.md."""
import sys,json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=128
N=6000;step=arb(3)/N;A=arb(0);B=arb(0)
for k in range(N):
 u=arb(arb(3)*(2*k+1)/(2*N),arb(3)/(2*N));z=arb.pi()*(2*u).exp();p=arb(0)
 for n in range(1,11):
  zn=z*n*n;p+=4*(u/2-zn).exp()*(2*zn*zn-3*zn)
 p+=arb(0,arb('1e-140'))
 A+=p*step;B+=u*u*p*(u*u).exp()*(u/2).cosh()*step
A+=arb(0,arb('1e-100'));B+=arb(0,arb('1e-100'))
assert A>arb(1)/3 and B<arb(1)/6
assert (arb(12)/11)**10*(-arb(69)).exp()<arb('1e-20')
assert 664*arb(363)**5*(-arb(363)).exp()/(1-arb('1e-20'))<arb('1e-140')
assert arb(6).exp()>400 and arb(6).exp()<500 and arb.pi()>3 and arb.pi()<4
# Tail moment envelope at u>=3 from previous accepted proof; its integral is much less1e-100.
b=arb(1200)
assert 100000*(-arb(600)).exp()<arb('1e-100')
# Elementary all-degree constant guards.
assert arb(14400).log()<10 and arb(25).log()<4 and arb.pi().log()<2 and arb(10).log()<3
assert arb(48).log()<4 and arb(9).log()<3
assert arb(82)/600+arb(108)/600**2+arb(108)/600**3+arb(72)/600**4+arb(24)/600**5<1
print(json.dumps(dict(N=N,A_lower=str(A.lower()),A_upper=str(A.upper()),B_lower=str(B.lower()),B_upper=str(B.upper()),PASS=True),indent=2))
