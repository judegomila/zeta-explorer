#!/usr/bin/env python3
"""Exact algebra and high-precision diagnostics for the subdivision report.

This script does not prove RH and does not use a list of zeta zeros.
The analytic no-root theorem is proved in the accompanying report.
"""
import json
import math
from pathlib import Path
from fractions import Fraction
import mpmath as mp
import sympy as sp

mp.mp.dps = 70
w = sp.Symbol('w')
checks = []

def check(name, condition, detail=None, kind='exact'):
    checks.append({'name': name, 'passed': bool(condition), 'kind': kind,
                   'detail': detail})
    if not condition:
        raise AssertionError(name)

def b(m, z):
    return mp.fprod((z-2*j)/(z+2*j) for j in range(1,m+1))

def xi(z):
    if z == 0 or z == 1:
        return mp.mpf('0.5')
    return z*(z-1)*mp.power(mp.pi,-z/2)*mp.gamma(z/2)*mp.zeta(z)/2

def X(z):
    return xi(mp.mpf('0.5')+z)

def R(a,z):
    return X(z-a)/X(z+a)

for m in range(1,41):
    slope = Fraction(1,4)
    for j in range(2,m+1):
        slope *= Fraction(1-j,1+j)
    expected = Fraction((-1)**(m-1),2*m*(m+1))
    check(f'slope_m{m}', slope == expected, str(slope))
    degree = 2*m
    dim = math.comb(degree+3,3)-math.comb(degree+1,3)
    check(f'dimension_m{m}', dim == (2*m+1)**2, dim)

check('coprime_first_two_dimensions', math.gcd(9,25)==1)
for q in range(2,65):
    check(f'no_root_divisibility_q{q}', not (9%q==0 and 25%q==0))
    for r in range(1,17):
        check(f'amplification_q{q}_r{r}',
              ((9*r)%q==0 and (25*r)%q==0) == (r%q==0))

# Symbolic cyclic block root with a generic scalar nonzero multiplier.
z = sp.Symbol('z')
for q in range(2,9):
    C = sp.zeros(q)
    C[0,q-1]=z
    for j in range(1,q):
        C[j,j-1]=1
    check(f'cyclic_root_q{q}', C**q == z*sp.eye(q))

xs = [mp.mpf('0.2'),mp.mpf('1.8'),mp.mpf('2.2'),mp.mpf('3.1')]
ys = [mp.mpf('0.3'),mp.mpf('2.1'),mp.mpf('11.7')]
for x in xs:
    for y in ys:
        point = x+1j*y
        vals=[abs(b(m,point)) for m in range(31)]
        check(f'strict_angular_moduli_{x}_{y}',
              all(vals[m+1]<vals[m] for m in range(30)),
              kind='numerical diagnostic')

target=15/(2*mp.pi**2)
value=R(mp.mpf('1.5'),mp.mpf('2'))
check('completion_at_2',abs(value-target)<mp.mpf('1e-65'),
      mp.nstr(value,55),kind='numerical diagnostic')
for m in (1,2,3,9):
    slope=mp.diff(lambda u:R(mp.mpf('1.5'),u)*b(m,u),mp.mpf('2'))
    expected=target*(-1)**(m-1)/(2*m*(m+1))
    check(f'completed_slope_m{m}',abs(slope-expected)<mp.mpf('1e-65'),
          mp.nstr(slope,45),kind='numerical diagnostic')

for a,bb,point in [
    (mp.mpf('0.17'),mp.mpf('0.41'),mp.mpc('0.7','2.3')),
    (mp.mpf('0.5'),mp.mpf('1'),mp.mpc('0.2','0.7')),
    (mp.mpf('0.1'),mp.mpf('0.2'),mp.mpc('1.7','14.5')),
]:
    lhs=R(a+bb,point)
    rhs=R(a,point-bb)*R(bb,point+a)
    check(f'shift_cocycle_{a}_{bb}',abs(lhs-rhs)<mp.mpf('1e-65'),
          mp.nstr(abs(lhs-rhs),8),kind='numerical diagnostic')

# Exact combinatorial identity behind the continuous delay construction.
for s in [Fraction(k,17) for k in range(17)]:
    for t in [Fraction(k,7) for k in range(10)]:
        for u in [Fraction(k,11) for k in range(10)]:
            n1=math.floor(s+t)
            n2=math.floor(s+t-n1+u)
            check(f'delay_wrap_{s}_{t}_{u}',n1+n2==math.floor(s+t+u))

def g(a,y):
    M=(1-y*y)/(y*y)
    return (2*mp.pi**a/mp.gamma(a))*y**(a-1)*M**(a-1)*(y-M*mp.hyp2f1(a,mp.mpf('1.5'),a+1,-M))

ell0=mp.exp(-mp.euler)/(8*mp.pi)
L0=mp.exp(ell0)
check('local_window_before_prime2',mp.exp(2*ell0)<2,mp.nstr(L0,50),kind='numerical diagnostic')
check('local_window_exact_auxiliary_bound',2*ell0<mp.mpf(1)/12,kind='numerical diagnostic')
for aa in ['0.001','0.01','0.05','0.1','0.25','0.5','1']:
    a=mp.mpf(aa)
    for yy in ['0.51','0.6','0.66']:
        y=mp.mpf(yy)
        check(f'negative_prime_free_kernel_a{aa}_y{yy}',g(a,y)<0,mp.nstr(g(a,y),25),kind='numerical diagnostic')
    for uu in [mp.mpf('1e-6'),mp.mpf('0.01'),2*ell0]:
        y=mp.exp(-uu)
        val=mp.exp(-uu/2)*g(a,y)
        upper=(2*mp.pi)**a/mp.gamma(a)*uu**(a-1)
        check(f'local_kernel_bounds_a{aa}_u{mp.nstr(uu,10)}',0<val<upper,kind='numerical diagnostic')
    schur=(4*mp.pi*ell0)**a/mp.gamma(1+a)
    check(f'local_schur_bound_a{aa}',schur<=2**(-a),mp.nstr(schur,25),kind='numerical diagnostic')
for yy in ['0.2','0.6','0.9']:
    y=mp.mpf(yy)
    check(f'elementary_width1_kernel_y{yy}',abs(g(mp.mpf(1),y)-2*mp.pi*(3*y-2))<mp.mpf('1e-65'),kind='numerical diagnostic')

report={'precision_decimal_digits':mp.mp.dps,
        'passed':sum(c['passed'] for c in checks),'total':len(checks),
        'claims':'Exact identities and numerical diagnostics only; no RH proof.',
        'checks':checks}
Path(__file__).with_name('verification.json').write_text(json.dumps(report,indent=2))
print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
