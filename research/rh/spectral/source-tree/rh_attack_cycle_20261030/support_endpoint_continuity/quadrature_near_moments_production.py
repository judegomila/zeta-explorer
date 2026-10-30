#!/usr/bin/env python3
"""Production Gamma-density integral with fixed tighter950-bit quadrature goal for signed near-phase inverse-power tails.

Finite integration is Arb-validated; the omitted positive-axis tail has an
explicit absolute incomplete-gamma bound. No logarithm branch is evaluated
inside the meromorphic integer-power integrand.
"""
from pathlib import Path
import json,time,math
from flint import arb,acb,ctx
ctx.prec=1000
HERE=Path(__file__).resolve().parent
W=(arb(16001)/1000).log();J=16384;U=1600

def moment(ratio,p,A):
    a=A+1;theta=2*arb.pi()*arb(ratio).log()/W;z=acb(0,theta).exp()
    fac=arb(math.factorial(p-1));scale=arb(J)**(p-2)/arb(a)**p
    def f(u,analytic):return u**(p-1)*(-u).exp()/(1-z*(-u/a).exp())/fac
    raw=acb.integral(f,0,U,rel_tol=arb(2)**-950,abs_tol=arb(2)**-950,eval_limit=200000)
    tail1=sum((arb(U)**k/math.factorial(k) for k in range(p)),arb(0))
    tail2=sum((arb(U)**k/math.factorial(k) for k in range(p-1)),arb(0))
    error=scale*arb(-U).exp()*(tail1+arb(a)/(p-1)*tail2)
    answer=z**a*scale*raw
    answer=acb(answer.real+arb(0,error.upper()),answer.imag+arb(0,error.upper()))
    return answer,error

if __name__=='__main__':
    rows=[]
    for ratio,p,A in [(16,142,J),(256,142,64*J),(16,2,J)]:
        start=time.time();value,tail=moment(ratio,p,A);elapsed=time.time()-start
        assert value.is_finite()
        row={'ratio':ratio,'power':p,'tail_start':A+1,'scaled_moment':value.str(90),'real_accuracy_bits':value.real.rel_accuracy_bits(),'imag_accuracy_bits':value.imag.rel_accuracy_bits(),'infinite_quadrature_tail_error':tail.str(50),'seconds':elapsed}
        rows.append(row);print(json.dumps(row),flush=True)
        (HERE/'NEAR_MOMENT_QUADRATURE_PRODUCTION_SELFTEST.json').write_text(json.dumps({'status':'FIXED_VALIDATED_MOMENT_PILOT_NOT_FULL_MATRIX','precision_bits':ctx.prec,'rows':rows,'scope':'Representative signed scalar moments only. No whole head, majorant matrix, positivity or generic support certificate.'},indent=2)+'\n')
