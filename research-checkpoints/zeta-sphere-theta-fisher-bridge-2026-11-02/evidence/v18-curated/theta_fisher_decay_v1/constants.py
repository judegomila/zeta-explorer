import sys,json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=128
rat6=(arb(3)/2)**6*(-arb(157)/10).exp()
rat8=(arb(3)/2)**8*(-arb(157)/10).exp()
assert rat6<arb(2)/10**6 and rat8<arb(4)/10**6
assert (arb(471)/50).exp()>12300
c=(arb(48)/25)*(arb(339)/50)*64/(12300*(1-arb(2)/10**6))
i=(arb(48)/25)*(arb(339)/50)**2*256/(12300*(1-arb(4)/10**6))
assert c<arb(68)/1000 and i<2
print(json.dumps({'ratio6':str(rat6),'ratio8':str(rat8),'score_deficit_upper':str(c),'fisher_upper':str(i),'decay_rate':'14'},indent=2))
