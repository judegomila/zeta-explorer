#!/usr/bin/env python3
"""Exact algebra and rigorous scalar onset checks, not a prime/RH scan."""
import argparse, json, hashlib
from pathlib import Path
import sympy as sp
from flint import arb, ctx

p=argparse.ArgumentParser();p.add_argument('--bits',type=int,default=192);p.add_argument('--output',default='PRIME_ONLY_ALGEBRA_192BIT.json');args=p.parse_args()
ctx.prec=args.bits
z,c,r=sp.symbols('z c r', positive=True)
checks={}
def exact(name,expr):
    val=sp.simplify(expr)
    assert val==0,(name,val)
    checks[name]='exact symbolic zero'
exact('even_plus_odd_power_series', z**2/(1-z**2)+z**3/(1-z**2)-z**2/(1-z))
P4=z**4/c+4*z**3/c**2+12*z**2/c**3+24*z/c**4+24/c**5
exact('square_tail_integral_derivative',sp.diff(2*sp.exp(-c*z)*P4,z)+2*z**4*sp.exp(-c*z))
I3=sp.exp(-r/6)*(6*r**3+108*r**2+1296*r+7776)
I2=sp.exp(-r/6)*(6*r**2+72*r+432)
exact('higher_credit_tail_integral',sp.diff(I3,r)+r**3*sp.exp(-r/6))
exact('odd_memory_tail_integral',sp.diff(I2,r)+r**2*sp.exp(-r/6))
exact('odd_memory_envelope_monotone',sp.diff(sp.exp(-r/6)*(r**2+12*r+72),r)+r**2*sp.exp(-r/6)/6)
kappa=sp.symbols('kappa')
exact('naive_drift_coefficient',sp.diff(r**2/4+kappa*r,r)-(r/2+kappa))
exact('half_power_constant_simplification', z**3/(1-z)-z**4/(1-z**2)-z**3/(1-z**2))
R=arb(512);a=arb(59)/100;C=arb('0.8476836');A=arb('9.22022')
f=R*R.sqrt()*(-a*R.sqrt()).exp()
delta=10*f+2*(-R/4).exp()
b=-(arb.const_euler()+arb.pi()/2+3*arb(2).log()+arb.pi().log())/2
b_alt=(arb(5)/4).digamma()/2-arb.pi().log()/2-2
assert (b-b_alt).contains(0)
assert b>-3 and b<-2
assert C/arb(2).sqrt()>a
assert delta<arb(185)/1000 and delta<arb(1)/4
assert 2*(-R/4).exp()<f
assert (R/2).exp()>4*R**3
assert R.sqrt()>3/a
assert (R/2).sqrt()>3/C
assert arb.const_euler()>0 and arb.const_euler()<1
# The globally decreasing ratios are justified by their analytic derivatives
# in the accompanying note. These checks certify only their initial values.
scalars={
'b':str(b),'c_over_sqrt2_minus_a':str(C/arb(2).sqrt()-a),
'delta_at_512':str(delta),'extra_exponential_over_f':str(2*(-R/4).exp()/f),
'e_half_r_over_4r_cubed':str((R/2).exp()/(4*R**3)),
'gamma':str(arb.const_euler())}
def jf(v):
    zz=v.sqrt()
    P=zz**4/C+4*zz**3/C**2+12*zz**2/C**3+24*zz/C**4+24/C**5
    return (-C*zz).exp()*(zz**3+2*P)
def b0(L):
    return A*jf(L/2)+3/arb(2).log()*(-L/6).exp()*(L**2+12*L+72)
def t2(L):
    ss=L.sqrt()
    return 90*(-a*ss).exp()*(ss**3+ss**4/a+4*ss**3/a**2+12*ss**2/a**3+24*ss/a**4+24/a**5)
def t3(L):
    return 3/arb(2).log()*(-L/6).exp()*(L**3+18*L**2+216*L+1296)
samples={str(L):{'T2':str(t2(arb(L))),'T3':str(t3(arb(L))),'B0':str(b0(arb(L)))} for L in [512,1024,4096]}
report={'scope':'Exact algebra and outward-rounded onset inequalities only. No prime enumeration, positivity-range extension, all-scale signed bound, or RH result.','bits':args.bits,'exact_checks':checks,'onset_scalars':scalars,'illustrative_bound_values':samples,'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
Path(args.output).write_text(json.dumps(report,indent=2,sort_keys=True)+'\n')
print(json.dumps({'status':'PASS','bits':args.bits,'exact_checks':len(checks),'output':args.output,'delta_at_512':str(delta)},indent=2))
