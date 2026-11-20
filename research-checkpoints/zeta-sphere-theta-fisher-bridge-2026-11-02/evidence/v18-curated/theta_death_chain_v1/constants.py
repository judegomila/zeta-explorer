import sys,json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=128
out={}
for den,bound in [(16,arb(508)/1000),(4,arb(9955)/10000)]:
 t=arb(1)/den
 r=(-(1200*arb.pi()/401)*((2*t).exp()-1)).exp()
 paid=(1-r)**2
 assert paid>bound
 out['0_to_1/'+str(den)]={'r':str(r),'pair_innovation_fraction':str(paid),'safe_fraction':str(bound)}
print(json.dumps(out,indent=2))
