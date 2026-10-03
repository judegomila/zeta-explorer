#!/usr/bin/env python3
"""Exact algebraic checks for the heat/twistor compatibility note.
These checks verify identities, not the missing global zero-free estimate.
"""
import json
from pathlib import Path
import sympy as s
w,t,a,q,r=s.symbols('w t a q r', nonzero=True)
f=s.Function('f')(w)
N=s.Function('N')(w)
D=s.Function('D')(w)
results=[]
def check(name, expr):
    value=s.simplify(expr)
    assert value == 0, (name,value)
    results.append({'name':name,'exact_pass':True})
L=lambda h:s.diff(h,w,2)/4
for m in range(9):
    b=s.prod((w-2*j)/(w+2*j) for j in range(1,m+1))
    check(f'commutator_m{m}',L(b*f)-b*L(f)-s.diff(b,w)*s.diff(f,w)/2-s.diff(b,w,2)*f/4)
    C=s.diff(b,w)/b
    check(f'conjugated_generator_m{m}',b*L(f/b)-(L(f)-C*s.diff(f,w)/2+(C*C-s.diff(C,w))*f/4))
R=N/D
Rt=(L(N)*D-N*L(D))/(D*D)
check('ratio_drift',Rt-L(R)-s.diff(D,w)*s.diff(R,w)/(2*D))
b=(w-2)/(w+2)
check('m1_residual', -s.diff(b,w)*s.diff(f,w)/2-s.diff(b,w,2)*f/4 -(-2*s.diff(f,w)/(w+2)**2+2*f/(w+2)**3))
P=lambda z:(z*z-a*a)*(z*z-9*a*a)
check('fixed_width_cancellation_counterexample', P(w-a)/P(w+a)-(w-4*a)/(w+4*a))
# A heat mode exp(q*w) acquires exp(t*q*q/4).
mode=s.exp(q*w+t*q*q/4)
check('mellin_mode_heat',s.diff(mode,t)-L(mode))
# A product of two modes differs by the correlated heat factor.
check('prime_cross_exponent',t*(q+r)**2/4-t*q*q/4-t*r*r/4-t*q*r/2)
# Schur complement factorization, with scalar symbolic blocks: noncommuting
# version follows directly from the displayed triangular block multiplication.
A,B,C,E=s.symbols('A B C E', nonzero=True)
M=s.Matrix([[A,B],[C,E]])
F=A-B*C/E
left=s.Matrix([[1,B/E],[0,1]])
mid=s.diag(F,E)
right=s.Matrix([[1,0],[C/E,1]])
assert left*mid*right == M
results.append({'name':'schur_factorization','exact_pass':True})
# Exact target arithmetic.
t0=s.Rational(123637595,10**9)
a0=s.Rational(1,10)
bound=t0+2*a0*a0
assert bound == s.Rational(143637595,10**9)
assert bound < s.Rational(145,1000)
results.append({'name':'target_bound_arithmetic','exact_pass':True,'bound':str(bound),'decimal':str(float(bound))})
result={'scope':'Exact symbolic identities only; no Lambda bound certified.','checks':len(results),'results':results}
with Path(__file__).with_name('verification.json').open('w') as fp:json.dump(result,fp,indent=2)
print(json.dumps({'checks':len(results),'all_pass':True,'scope':result['scope']}))
