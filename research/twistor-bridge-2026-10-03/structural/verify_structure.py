"""Exact algebra and rational bounds for the structural continuation.

This verifies identities and the arithmetic of proved analytical estimates.
It does not prove the missing all-window bound or RH.
"""
from pathlib import Path
import json
import sympy as s
ROOT=Path(__file__).resolve().parent
w,a,b,beta,tau=s.symbols('w a b beta tau',real=True)
Y=lambda z:((z-beta)**2+tau**2)*((z+beta)**2+tau**2)
R=lambda aa,z:Y(z-aa)/Y(z+aa)
checks=[]
def check(name,test,value=None):
 assert bool(test),name
 checks.append({'name':name,'passed':True,'value':str(value) if value is not None else None})
check('even_polynomial',s.expand(Y(w)-Y(-w))==0)
check('exact_width_cocycle',s.cancel(R(a+b,w)-R(a,w-b)*R(b,w+a))==0)
prod=s.prod((w-(a-e*beta)-s.I*h*tau)/(w+(a-e*beta)-s.I*h*tau) for e in [-1,1] for h in [-1,1])
check('blaschke_factorization',s.cancel(R(a,w)-prod)==0)
r=s.factor(R(s.Rational(1,8),w).subs({beta:s.Rational(1,4),tau:1}))
p=s.Rational(1,8)+s.I
res=s.simplify(s.limit((w-p)*r,w,p))
check('uncancelled_thin_pole',res!=0,res)
C=s.Integer(2);dC=s.Integer(8);Ai=s.Rational(15,2);dAi=s.Rational(85,2);Pi=s.Rational(9,4);dPi=s.Rational(51,2)
fL1=C*(Ai+Pi);dfL1=C*(dC*(Ai+Pi)+dAi+dPi)
dKL1=s.Rational(3,2)*(fL1+dfL1)
check('kernel_L1_bound',fL1==s.Rational(39,2),fL1)
check('width_derivative_bound',dfL1==292,dfL1)
check('arithmetic_kernel_derivative_bound',dKL1==s.Rational(1869,4) and dKL1<500,dKL1)
base=s.Rational(49999,50000);radius=s.Rational(1,50000000)
check('uniform_width_interval_bound',base+500*radius==s.Rational(99999,100000),base+500*radius)
check('width_interval_inside_comparison_range',s.Rational(1,4)-radius>s.Rational(1,5) and s.Rational(1,4)+radius<s.Rational(3,10))
Fw,Fz,Gw,Gz,Rw,Rz,d=s.symbols('Fw Fz Gw Gz Rw Rz d')
check('defect_kernel_identity',s.expand((1-Rw*Gw*Rz*Gz)/d-(1-Gw*Gz)/d-Gw*Gz*(1-Rw*Rz)/d)==0)
# An independent finite-width cancellation warning from the audit.
aa=s.symbols('aa',positive=True);P=lambda z:(z**2-aa**2)*(z**2-9*aa**2)
check('single_width_zero_cancellation',s.cancel(P(w-aa)/P(w+aa)-(w-4*aa)/(w+4*aa))==0)
result={'scope':'Exact identities and arithmetic of analytical bounds; no all-window estimate or RH proof.','passed':len(checks),'checks':checks}
(ROOT/'structure_verification.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'passed':len(checks),'pole_residue':str(res),'width_derivative_upper':str(dKL1),'norm_upper_on_width_interval':'99999/100000'},indent=2))
