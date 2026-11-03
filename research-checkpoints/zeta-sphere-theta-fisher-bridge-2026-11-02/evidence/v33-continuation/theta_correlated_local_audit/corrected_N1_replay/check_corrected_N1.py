import sys,json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=160
v=arb(3)/8*(arb(1)/4).gamma()/arb.pi()**(arb(1)/4)
assert v>arb(1021)/1000
print(json.dumps({'value':str(v),'certified_lower':'1.021','passed':bool(v>arb(1021)/1000)}))
