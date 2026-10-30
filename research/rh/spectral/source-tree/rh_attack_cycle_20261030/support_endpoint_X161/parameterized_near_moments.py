#!/usr/bin/env python3
"""Exact-X parameterized scalar prototype; not a full generic certificate.

No module-global W and no cache key aliases across supports. Uses the admitted
Gamma-density formula; each call includes all analytic/precision parameters.
"""
from pathlib import Path
from fractions import Fraction as Q
import hashlib,math
from flint import arb,acb,ctx
HERE=Path(__file__).resolve().parent

def exact_ball(q):
    assert isinstance(q,Q)
    return arb(q.numerator)/q.denominator

def moment(X,ratio,p,A,J=16384,bits=1000,tolerance_bits=950,U=1600):
    assert isinstance(X,Q) and isinstance(ratio,Q)
    assert X>1 and ratio>0 and 2<=p<=144 and A>=J>=1 and bits>=tolerance_bits+40 and U>=1600
    ctx.prec=bits;W=exact_ball(X).log();a=A+1
    theta=2*arb.pi()*exact_ball(ratio).log()/W;z=acb(0,theta).exp()
    # Zero-phase moments belong to the independent Hurwitz branch. This pilot
    # intentionally does not hide a removable endpoint singularity.
    assert abs(1-z)>0
    fac=arb(math.factorial(p-1));scale=arb(J)**(p-2)/arb(a)**p
    def f(u,analytic):return u**(p-1)*(-u).exp()/(1-z*(-u/a).exp())/fac
    raw=acb.integral(f,0,U,rel_tol=arb(2)**-tolerance_bits,abs_tol=arb(2)**-tolerance_bits,eval_limit=200000)
    tail1=sum((arb(U)**k/math.factorial(k) for k in range(p)),arb(0))
    tail2=sum((arb(U)**k/math.factorial(k) for k in range(p-1)),arb(0))
    error=scale*arb(-U).exp()*(tail1+arb(a)/(p-1)*tail2)
    answer=z**a*scale*raw
    answer=acb(answer.real+arb(0,error.upper()),answer.imag+arb(0,error.upper()))
    assert answer.is_finite()
    key={'X':str(X),'ratio':str(ratio),'power':p,'A':A,'J':J,'precision_bits':bits,'quadrature_U':U,'abs_rel_tolerance_bits':tolerance_bits,'primitive_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
    return answer,error,key
