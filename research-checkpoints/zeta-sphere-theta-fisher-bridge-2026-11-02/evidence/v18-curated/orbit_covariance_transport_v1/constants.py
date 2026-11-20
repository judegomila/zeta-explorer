import sys,json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=128
r=arb(81)/16*(-arb(157)/10).exp()
e=(arb(471)/50).exp()
b=(arb(48)/25)*16/(12300*(1-arb(1)/10**6))
assert r<arb(1)/10**6
assert e>12300
assert b<arb(1)/400
print(json.dumps({'geometric_ratio':str(r),'exponential_lower':str(e),'mass_ratio_upper':str(b),'pair_chi_square_bound':'801/160000'},indent=2))
