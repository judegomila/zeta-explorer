"""Owned interval evaluation of exact base-only eta bounds."""
import sys,json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=160
L=arb(2).log();q=1/arb(2).sqrt();r=q*(-17*L*L/4).exp()
lo=3*L*L;hi=L*L*(3+5*r/(1-r));worst=L*L*(8+5*arb(2).sqrt())
assert lo>arb(144)/100 and hi<arb(1685)/1000 and worst>arb(724)/100
print(json.dumps({'base_lower':str(lo),'base_upper':str(hi),'general_upper':str(worst),'certified_base_between_1_44_and_1_685':True,'scope':'p=1 only; no derivative-residual or signed-pivot inference'},indent=2))
