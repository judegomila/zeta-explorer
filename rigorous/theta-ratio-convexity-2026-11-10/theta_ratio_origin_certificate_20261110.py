"""Rigorous origin certificate for the anchor-free theta criteria.

Requires python-flint. The sole supplied mathematical input is an Arb
enclosure of C0=(1/4)*integral_0^infinity t*kappa(t) dt. The caller must
obtain that enclosure rigorously. This file proves the three local signs
conditional on that input, using finite theta sums and explicit Cauchy
remainders. No floating-point samples enter the certificate.

Write u=t^2 and K(u)=kappa(t). Evenness is the classical theta modular
identity. On the complex disk |t|<=1/2,

  Re(e^t)>=e^(-1/2)cos(1/2), pi*Re(e^t)>3/2,
  |kappa(t)| <= 240*sum(n^4*exp(-3n^2/2)) < 40000.

Here exp(1/8)<2, pi<4, exp(1)<3, exp(1/2)<2 give the prefactor
240; exp(-3/2)<1/2 and sum(n^4/2^n)=150 give 36000<40000.
Consequently |[u^k]K|<=40000*4^k by Cauchy's inequality.

The theta tail n>N on that disk is bounded by
480*(N+1)^4*exp(-3*(N+1)^2/2): the ratio of successive n^4 Gaussian
terms is below 1/2, checked at N+1 and decreasing thereafter. Cauchy
therefore encloses the k-th coefficient error by this tail times4^k.

Degree20 and 16 theta terms suffice on 0<=u<=1/64 (0<=t<=1/8).
Derivatives through order4 use a geometric tail bound, not a truncated
polynomial treated as exact. All interval endpoints are exact dyadics.
"""

import argparse
from fractions import Fraction as Q
from math import factorial
import json

from flint import arb,ctx


def rational(value):
    value=Q(value)
    return arb(value.numerator)/value.denominator


def polynomial_derivative(poly,order):
    result=list(poly)
    for _ in range(order):
        result=[j*result[j] for j in range(1,len(result))]
    return result


def evaluate(poly,x):
    total=arb(0)
    for coefficient in reversed(poly):
        total=total*x+coefficient
    return total


def error_ball(bound):
    if not bound>=0:
        raise AssertionError('error bound is not nonnegative')
    return arb(0,1)*bound


def coefficients(degree=20,terms=16):
    # P_m is defined by kappa^(m)(t)=sum exp(t/4-z_n)P_m(z_n).
    polys=[[Q(0),Q(-3),Q(2)]]
    for _ in range(2*degree):
        old=polys[-1]
        polys.append([
            (Q(j)+Q(1,4))*(old[j] if j<len(old) else 0)
            -(old[j-1] if j>0 else 0)
            for j in range(len(old)+1)
        ])
    pi=arb.pi()
    if not pi*(-arb(1)/2).exp()*(arb(1)/2).cos()>arb(3)/2:
        raise AssertionError('complex-disk Gaussian exponent bound failed')
    if not (arb(1)/8).exp()<2 or not pi<4 or not arb(1).exp()<3 or not (arb(1)/2).exp()<2:
        raise AssertionError('complex-disk prefactor bounds failed')
    if not (-arb(3)/2).exp()<arb(1)/2:
        raise AssertionError('geometric majorant failed')
    m=terms+1
    tail_ratio=(arb(m+1)/m)**4*(-arb(3)*(2*m+1)/2).exp()
    if not tail_ratio<arb(1)/2:
        raise AssertionError('theta-tail ratio bound failed')
    disk_tail=480*m**4*(-arb(3)*m*m/2).exp()
    result=[]
    for k in range(degree+1):
        poly=[rational(v) for v in polys[2*k]]
        coefficient=arb(0)
        for n in range(1,terms+1):
            z=pi*n*n
            coefficient+=(-z).exp()*evaluate(poly,z)
        coefficient/=factorial(2*k)
        coefficient+=error_ball(disk_tail*4**k)
        result.append(coefficient)
    return result,disk_tail


def kappa_remainder(order,degree,upper_u):
    # Successive derivative terms have ratio <=q*(K+2)/(K+2-order).
    k=degree+1
    q=4*upper_u
    ratio=q*(k+1)/(k+1-order)
    if not ratio<1:
        raise AssertionError('Taylor derivative tail is not geometrically bounded')
    falling=factorial(k)//factorial(k-order)
    first=40000*4**k*falling*upper_u**(k-order)
    return first/(1-ratio)


def certify_origin(C0,degree=20,terms=16,subdivisions=32):
    """Certify given a rigorous C0 ball; returns reproducible interval data."""
    if not isinstance(C0,arb):
        C0=arb(C0)
    if not subdivisions>0 or subdivisions & (subdivisions-1):
        raise ValueError('Use a power-of-two subdivision count')
    upper_u=arb(1)/64
    b,theta_tail=coefficients(degree,terms)
    derivatives=[polynomial_derivative(b,j) for j in range(5)]
    errors=[kappa_remainder(j,degree,upper_u) for j in range(5)]
    integral_poly=[arb(0)]+[b[k]/(k+1) for k in range(degree+1)]
    integral_error=40000*4**(degree+1)*upper_u**(degree+2)/(degree+2)/(1-4*upper_u)
    names=['K','f_u','W_u','D_W_u','D_h_u']
    minima={name:None for name in names}
    for cell in range(subdivisions):
        # [cell/(64s),(cell+1)/(64s)] exactly, including zero.
        midpoint=arb(2*cell+1)/(128*subdivisions)
        radius=arb(1)/(128*subdivisions)
        u=midpoint+arb(0,1)*radius
        K=[evaluate(derivatives[j],u)+error_ball(errors[j]) for j in range(5)]
        C=C0-(evaluate(integral_poly,u)+error_ball(integral_error))/8
        h=C/K[0]
        hu=-arb(1)/8-K[1]*h/K[0]
        huu=(-K[1]/8-K[2]*h-2*K[1]*hu)/K[0]
        g=K[1]/K[0]
        gu=K[2]/K[0]-g*g
        guu=K[3]/K[0]-3*K[2]*K[1]/K[0]**2+2*g**3
        fu=-2*g-2*u*gu
        fuu=-4*gu-2*u*guu
        W=8*(K[1]+2*u*K[2])/K[0]
        Wu=(8*(3*K[2]+2*u*K[3])-K[1]*W)/K[0]
        Wuu=(8*(5*K[3]+2*u*K[4])-K[2]*W-2*K[1]*Wu)/K[0]
        DW=Wuu*fu-Wu*fuu
        Dh=huu*fu-hu*fuu
        values=dict(zip(names,[K[0],fu,Wu,DW,Dh]))
        for name,value in values.items():
            if not value>0:
                raise AssertionError(f'{name} not positive on cell {cell}: {value}')
            lower=value.lower()
            if minima[name] is None or lower<minima[name]:
                minima[name]=lower
    return {
        'status':'passed_given_rigorous_C0_enclosure',
        'C0_input':str(C0),'precision_bits':ctx.prec,
        'domain':'0<t<=1/8; equivalently 0<u<=1/64',
        'degree':degree,'theta_terms':terms,'subdivisions':subdivisions,
        'theta_tail_disk_bound':str(theta_tail),
        'K_derivative_remainder_bounds':[str(e) for e in errors],
        'C_integral_remainder_bound':str(integral_error/8),
        'strict_lower_bounds':{name:str(value) for name,value in minima.items()},
        'conversion':"W_t'=2t W_u; D_W(t)=8t^3 D_W_u; D_h(t)=8t^3 D_h_u",
        'scope':'Rigorous interval certificate conditional on the supplied C0 enclosure; caller must certify that enclosure.',
    }


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--c0',help='Optional rigorous Arb enclosure; by default obtain it from the companion integral certificate')
    parser.add_argument('--bits',type=int,default=256)
    args=parser.parse_args()
    if args.c0 is None:
        from theta_ratio_c_integral_20261110 import C_point
        ctx.prec=args.bits
        result=certify_origin(C_point(0))
        result['status']='passed'
        result['C0_source']='C_point(0) from theta_ratio_c_integral_20261110.py: rigorous Arb integration plus explicit theta and spatial tails'
        result['scope']='Rigorous origin certificate, including a rigorously computed C0 from the named companion module.'
    else:
        ctx.prec=args.bits
        result=certify_origin(arb(args.c0))
    print(json.dumps(result,indent=2))
