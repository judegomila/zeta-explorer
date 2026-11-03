import sys
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=128
assert (arb(12)/11)**10*(-arb(69)).exp()<arb('1e-20')
assert 664*arb(363)**5*(-arb(363)).exp()/(1-arb('1e-20'))<arb('1e-140')
assert arb(6).exp()>400 and arb(6).exp()<500
assert arb.pi()>3 and arb.pi()<4
assert arb(28000).log()<11 and arb(3).log()<arb(3)/2 and arb(2000).log()<8
assert 2**10*(-arb(3600)).exp()<arb(1)/2
# Upper bound for int_0^infty (3+r)^3 exp(-2400r)dr.
b=arb(2400)
integ=27/b+27/b**2+18/b**3+6/b**4
assert 30000*integ*(-arb(1200)).exp()<arb('1e-100')
print('PASS: orbit-tail ratios, uniform omitted-derivative bound, spatial-tail constants.')
