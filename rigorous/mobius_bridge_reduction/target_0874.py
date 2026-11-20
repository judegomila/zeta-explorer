"""Exact arithmetic for an OPEN mixed-moment route to B=0.874.

Passing this script proves only the numerical implication. The additional
restricted fourth-moment estimate U**(39/40+epsilon) is NOT proved here.
Run: python3 -E target_0874.py [--json]
"""
from fractions import Fraction as Q
from functools import reduce
from math import gcd, lcm
import json
import sys

if not __debug__:
    raise RuntimeError('Assertions must be enabled; do not use -O or -OO.')

def add(a, b):
    c = [Q(0)] * max(len(a), len(b))
    for i, v in enumerate(a): c[i] += v
    for i, v in enumerate(b): c[i] += v
    return c

def scale(a, c):
    return [v*c for v in a]

def mul(a, b):
    c = [Q(0)] * (len(a)+len(b)-1)
    for i, v in enumerate(a):
        for j, w in enumerate(b): c[i+j] += v*w
    return c

def ev(a, t):
    return sum(v*t**i for i, v in enumerate(a))

def check():
    b, ell, kappa = Q(1,25), Q(64,375), Q(29991,40000)
    eta, g, zeta, gstar = Q(1,160), Q(1,10000), Q(1,1000000), Q(1,20000)
    alpha = Q(5,6)
    c = 1/(3*kappa)
    lx, ly, h = (1-b-ell)/2, (1+b-ell)/2, (1+b+3*ell)/2
    boundary = Q(11,12)-ell/4
    c0 = -Q(1,4)+b/6+5*ell/4
    asm = Q(1,2)+ell/2*(Q(1,2)+2*ell/h)-h/2
    supply = ell/(h+zeta)
    margins = {
        'b': b,
        'ell_above_1_6': ell-Q(1,6),
        'ell_below_1_5': Q(1,5)-ell,
        'boundary_above_87_100': boundary-Q(87,100),
        'lx_above_ell': lx-ell,
        'geometry': ly-ell-11*b/6,
        'six_kappa_ell': 6*kappa*ell-Q(3,4),
        'full_capacity': 1/(6*kappa)-ell/h,
        'supply': supply-Q(21,100),
        'ly_above_half_h': ly-h/2,
        'ly_below_half': Q(1,2)-ly,
        'small_delta': -Q(1,250)-max(c0,c0+asm/8),
        'floor': -Q(1,100)-(c0+(Q(1,2)+3*ell/2)/50),
        'small_rows': -Q(1,20)-(h*(Q(17,50)-Q(1,6))-ly/2+Q(2,100)),
        'extension': g-2*zeta-gstar,
        'gstar_positive': gstar,
        'gstar_small': Q(1,1000)-gstar,
        'zeta_positive': 2*zeta,
        'zeta_small': Q(1,1000)-2*zeta,
        'modified_scale_slope': Q(7,200)-eta,
        # R <= 1-2*delta/3, 2*q <= delta; minimum is at delta=1/8.
        'short_block_supply_with_extra_saving':
            (6*kappa-Q(1,8))*supply-1+Q(1,12)-4*eta,
        'supply_comparison_slope': Q(2,3)-supply,
    }
    assert all(v > 0 for v in margins.values()), margins
    assert Q(29991,40000) <= kappa <= Q(3,4)
    assert (1+kappa)/2 == Q(69991,80000)
    assert boundary == Q(437,500) and h == Q(97,125)

    # The only changed main-row exponent is E_new = E - eta*h.
    # Build 2*J*(-E_new-g) as a polynomial in delta and y=1/2-x.
    D = [Q(5,2)-c, 1+2*c]
    P = [1-c/2, Q(2), 2*c]
    assert D[0] > 0 and P[0] > 0
    assert all(v >= 0 for v in D+P)
    t = ell+c*(h/4-ly/2)
    U = [Q(1,2)+t/2-3*h/4, -t]
    PD = add(P, scale(D, -1))
    constant = c0+g-eta*h
    A = add(scale(mul(PD,U),-2), scale(P,3*h/4))
    B = add(add(scale(PD,-2*constant), scale(mul(D,U),-2*alpha)), scale(P,-3*h*alpha/4))
    C = scale(D,-2*alpha*constant)
    common = lcm(*(v.denominator for poly in [A,B,C] for v in poly))
    ints = [[int(v*common) for v in poly] for poly in [A,B,C]]
    divisor = reduce(gcd, (abs(v) for poly in ints for v in poly))
    A,B,C = [[v//divisor for v in poly] for poly in ints]
    multiplier = Q(common,divisor)
    disc = add(scale(mul(A,C),4), scale(mul(B,B),-1))
    assert all(v > 0 for v in A+disc)
    assert multiplier > 0

    def direct(delta, x):
        d = 3-(1+2*c)*x
        p = (2-2*c*x)*(1-x)
        j = (alpha-delta)*d+delta*p
        r = 1-delta+(alpha-delta)*delta*p/(2*j)
        e = c0+delta/2+delta*x*(ell+c*(h/4-ly/2))-3*h*(1-r)/4
        return e,j

    # Degree <= (2,3): a 5x5 rational grid identifies the cleared identity.
    for i in range(5):
        delta = Q(5*i,24)
        for j in range(5):
            y = Q(j,8)
            e, denominator = direct(delta,Q(1,2)-y)
            assert denominator > 0
            assert 2*multiplier*denominator*(-e+eta*h-g) == ev(A,y)*delta**2+ev(B,y)*delta+ev(C,y)

    # Negative control: the original endpoint fails at this exact point.
    old_e, _ = direct(Q(1,2),Q(1,2))
    assert old_e > Q(4,1000)
    gain = Q(17497733,20000000)-boundary
    assert gain == Q(17733,20000000)
    return {
        'status': 'EXACT_NUMERICAL_IMPLICATION_ONLY',
        'new_analytic_input': 'UNPROVED: restricted numerator fourth moment <= U^(39/40+epsilon), with the source coefficient, slot, mask, and uniformity conditions',
        'source_analytic_inputs': 'IMPORTED, NOT INDEPENDENTLY VERIFIED',
        'target_boundary': str(boundary),
        'parameters': {n:str(v) for n,v in dict(b=b,ell=ell,kappa=kappa,eta=eta,g=g,zeta=zeta,gstar=gstar,h=h).items()},
        'conditional_gain': str(gain),
        'positive_scalar_margins': {n:str(v) for n,v in margins.items()},
        'multiplier': str(multiplier),
        'A': A, 'Bpoly': B, 'C': C,
        'four_AC_minus_B_squared': [int(v) for v in disc],
        'identity': '2*M*J*(-E + eta*h - g) = A(y)*delta^2 + Bpoly(y)*delta + C(y)',
        'proved_modified_endpoint': 'E - eta*h < -1/10000 on 0<=delta<=5/6, 0<=x<=1/2',
        'original_endpoint_positive_at_half_half': str(old_e),
    }

if __name__ == '__main__':
    result = check()
    if '--json' in sys.argv:
        print(json.dumps(result,indent=2))
    else:
        print('PASS: exact arithmetic for the implication to B=437/500=0.874.')
        print('PASS: scalar gates, short-block supply, scale monotonicity, full-rectangle modified endpoint.')
        print('UNPROVED: the new restricted fourth-moment estimate. No new zero-free bound established.')
