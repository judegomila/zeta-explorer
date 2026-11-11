"""Rigorous counterexample to the proposed stronger-class preservation.

v(t)=exp(-t*t), u(t)=v(t)/sqrt(t*t+5), anchor a=10.
All input class signs are certified by exact polynomial coefficients.
Two Gaussian-weighted integrals are enclosed by FLINT ball arithmetic
with branch-aware sqrt callbacks and explicit improper-integral tails.
The resulting origin coefficient of the output convexity is negative.
"""

import json
import math
import platform

import flint
from flint import arb, acb, ctx
import sympy as sp


def exact_checks():
    q=sp.symbols('q', nonnegative=True)
    H=(q+5)**(-sp.Rational(1,2))
    B=16*q*sp.diff(H,q,2)+(8-32*q)*sp.diff(H,q)+(16*q-8)*H
    J=16*q-8
    targets={
        'B':4*(4*q**3+42*q*q+102*q-55)/(q+5)**sp.Rational(5,2),
        'B_q':2*(4*q**3+78*q*q+534*q+1295)/(q+5)**sp.Rational(7,2),
        'B_qq':-(4*q**3+114*q*q+1110*q+3725)/(q+5)**sp.Rational(9,2),
        'H_convexity_numerator':2*(2*q**3+30*q*q+123*q+40)/(q+5)**6,
        'J_convexity_numerator':16*(4*q**3+114*q*q+1110*q+3725)/(q+5)**sp.Rational(9,2),
    }
    actual={
        'B':B,
        'B_q':sp.diff(B,q),
        'B_qq':sp.diff(B,q,2),
        'H_convexity_numerator':sp.diff(H,q,2)*sp.diff(B,q)-sp.diff(H,q)*sp.diff(B,q,2),
        'J_convexity_numerator':sp.diff(J,q,2)*sp.diff(B,q)-sp.diff(J,q)*sp.diff(B,q,2),
    }
    checks={name:sp.simplify(actual[name]-target)==0 for name,target in targets.items()}
    for name,poly in {
        'B_q_polynomial':4*q**3+78*q*q+534*q+1295,
        'minus_B_qq_polynomial':4*q**3+114*q*q+1110*q+3725,
        'H_convexity_polynomial':2*q**3+30*q*q+123*q+40,
    }.items():
        checks[name]=all(co>0 for co in sp.Poly(poly,q).all_coeffs())
    M,N=sp.symbols('M N')
    h1=-1/(10*sp.sqrt(5));h2=3/(100*sp.sqrt(5))
    b0=-44/(5*sp.sqrt(5));b1=518/(25*sp.sqrt(5))
    n1=(b0-100*M+108*N)/8
    n2=(b1+140*n1-16*N)/24
    checks['origin_coefficient_formula']=sp.simplify(
        h1*n2-h2*n1-sp.sqrt(5)*(23000*M-24640*N+353*sp.sqrt(5))/15000
    )==0
    if not all(checks.values()):
        raise AssertionError(checks)
    return {'status':'passed','check_count':len(checks),'checks':checks}


def finite_integral(callback,left,right,step=arb(1)/2):
    """All endpoints below are exact half-integers."""
    total=acb(0)
    left,right=arb(left),arb(right)
    count=int(float((right-left)/step))
    if left+count*step!=right:
        raise AssertionError('subdivision endpoints are not exact')
    for j in range(count):
        total+=acb.integral(callback,left+j*step,left+(j+1)*step,
                           rel_tol=arb(2)**-180,abs_tol=arb(2)**-180,
                           deg_limit=100,eval_limit=100000,depth_limit=40)
    if not total.imag.contains(0):
        raise AssertionError('real integral has nonzero imaginary enclosure')
    return total.real


def run():
    ctx.prec=256
    algebra=exact_checks()
    a=arb(10);m=a/4;T=arb(20);sqrt5=arb(5).sqrt();sqrtpi=arb.pi().sqrt()

    # mu=U(a)/V(a); V(a)=sqrt(pi)*exp(a*a/16).
    mu_finite=finite_integral(
        lambda s,analytic: (-(s-m)**2).exp()/(s*s+5).sqrt(analytic=analytic),-T,T
    )/sqrtpi
    left=T+m;right=T-m
    mu_tail=((-(left*left)).exp()/(2*left)+(-(right*right)).exp()/(2*right))/(sqrt5*sqrtpi)
    mu=mu_finite+arb(0,mu_tail.abs_upper())
    if not (mu>0 and mu<1/sqrt5):
        raise AssertionError('invalid tilted mean enclosure')

    # I_u=int_0^infinity exp(-s*s-5*s)/sqrt(s*s+5) ds.
    Iu_finite=finite_integral(
        lambda s,analytic: (-(s*s)-a*s/2).exp()/(s*s+5).sqrt(analytic=analytic),0,T
    )
    Iu_tail=(-(T*T)-a*T/2).exp()/((2*T+a/2)*sqrt5)
    Iu=Iu_finite+arb(0,Iu_tail.abs_upper())
    Iv=sqrtpi/2*(a*a/16).exp()*(a/4).erfc()
    N0=1/sqrt5-a/2*(Iu-mu*Iv)

    Hq=-1/(10*sqrt5);Hqq=3/(100*sqrt5)
    B0=-44/(5*sqrt5);Bq=518/(25*sqrt5)
    Nq=(B0-a*a*mu+(8+a*a)*N0)/8
    Nqq=(Bq+(40+a*a)*Nq-16*N0)/24
    delta=Hq*Nqq-Hqq*Nq
    if not (N0>0 and Nq<0 and delta<arb('-0.0000178')):
        raise AssertionError({'N0':str(N0),'Nq':str(Nq),'delta':str(delta)})
    return {
        'status':'passed',
        'environment':{'python':platform.python_version(),'python_flint':flint.__version__,'precision_bits':ctx.prec},
        'example':{'u':'exp(-t^2)/sqrt(t^2+5)','v':'exp(-t^2)','anchor':10},
        'exact_algebra':algebra,
        'enclosures':{name:str(value) for name,value in {
            'mu':mu,'Iu':Iu,'Iv':Iv,'mu_tail_bound':mu_tail,'Iu_tail_bound':Iu_tail,
            'N0':N0,'N_q_at_zero':Nq,'N_qq_at_zero':Nqq,
            'H_q_N_qq_minus_H_qq_N_q_at_zero':delta,
        }.items()},
        'certified_upper_bound':'H_q*N_qq-H_qq*N_q < -0.0000178 at q=0',
        'conclusion':'The proposed stronger input class is not preserved: new H is strictly concave as a function of new B for all sufficiently small positive t at anchor 10.',
        'scope':'A rigorous auxiliary-pair counterexample. It is not a counterexample to actual theta, RH, or the PR51 ratio theorem.',
    }


if __name__=='__main__':
    print(json.dumps(run(),indent=2,sort_keys=True))
