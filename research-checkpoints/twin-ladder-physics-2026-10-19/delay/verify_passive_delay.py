#!/usr/bin/env python3
"""Reproducible bounded checks for PASSIVE_DELAY_REALIZATION_v1.md.
Standard library only. No network, hardware, zeta-zero inference, or interval claim.
"""
from fractions import Fraction as F
import cmath
import json
import math
from pathlib import Path


def primes_up_to(n):
    sieve = bytearray(b'\x01') * (n+1)
    sieve[:2] = b'\x00\x00'
    for p in range(2, math.isqrt(n)+1):
        if sieve[p]:
            sieve[p*p:n+1:p] = b'\x00' * (((n-p*p)//p)+1)
    return [p for p in range(2,n+1) if sieve[p]]


def exact_checks():
    count=0
    for q0,q1 in [(F(3,4),F(1,2)),(F(2,3),F(1,7)),(F(99,100),F(98,100))]:
        c=(1+q1)/(1+q0)
        A=(1-q0*q1)/((1+q0)*(1-q1))
        B=(q0-q1)/((1+q0)*(1-q1))
        assert A>0 and B>0 and A+B==1; count+=1
        assert A+B*q1==c; count+=1
        assert A*q1+B==c*q0; count+=1
        # |den|^2 - |numerator|^2 = AB(1-q1)^2 |1+z|^2 on |z|=1.
        d2=A*B*(1-q1)**2
        assert 1+q1*q1-c*c*(1+q0*q0)==2*d2; count+=1
        assert -2*q1+2*c*c*q0==2*d2; count+=1
        assert c*(1+q0)/(1+q1)==1; count+=1
        # Constant and first two impulse coefficients, multiplying by 1-q1 z.
        tap0=c; tap1=c*(q1-q0); tap2=tap1*q1
        assert tap1-q1*tap0==-c*q0; count+=1
        assert tap2-q1*tap1==0; count+=1
    return count


def main():
    sigma,h=.834,.125
    maxerr=maxenergy=maxrate=0.
    examples=[]
    for p in [2,3,5,7,11]:
        q0=p**(-sigma); q1=p**(-(sigma+h)); tau=math.log(p)
        c=(1+q1)/(1+q0)
        A=(1-q0*q1)/((1+q0)*(1-q1))
        B=(q0-q1)/((1+q0)*(1-q1))
        for k in range(1001):
            z=cmath.exp(-2j*math.pi*k/1000)
            J=(q1-z)/(1-q1*z)
            H=A+B*J; G=math.sqrt(A*B)*(J-1)
            exact=c*(1-q0*z)/(1-q1*z)
            maxerr=max(maxerr,abs(H-exact))
            maxenergy=max(maxenergy,abs(abs(H)**2+abs(G)**2-1))
        rate=-math.log(q1)/tau
        maxrate=max(maxrate,abs(rate-(sigma+h)))
        b1=q0-q1; b2=(q0*q0-q1*q1)/2
        ratio=b2/b1
        assert abs(ratio-q0*(1+p**(-h))/2)<1e-14
        examples.append(dict(p=p,tau_over_tau0=tau,q0=q0,q1=q1,c=c,A=A,B=B,
                             field_decay_per_tau0=rate,square_to_prime_log_harmonic=ratio))
    normalizations=[]
    for Q in [3,10,100,1000,10000]:
        primes=primes_up_to(Q)
        log_cring=-h*sum(map(math.log,primes))/2
        log_copt=sum(math.log1p(p**(-sigma-h))-math.log1p(p**(-sigma)) for p in primes)
        normalizations.append(dict(Q=Q,prime_count=len(primes),ring_normalization_db=-20*log_cring/math.log(10),
                                   optimal_normalization_db=-20*log_copt/math.log(10)))
    # Direct 3-module cascade: monitor every auxiliary output, not just through.
    cascade_error=0.
    for k in range(1001):
        omega=k/13
        field=1+0j; dumped=0.
        for p in [2,3,5]:
            q0=p**(-sigma);q1=p**(-sigma-h);z=cmath.exp(-1j*omega*math.log(p))
            A=(1-q0*q1)/((1+q0)*(1-q1));B=1-A
            J=(q1-z)/(1-q1*z)
            G=math.sqrt(A*B)*(J-1);H=A+B*J
            dumped+=abs(field*G)**2
            field*=H
        cascade_error=max(cascade_error,abs(abs(field)**2+dumped-1))
    assert maxerr<2e-14 and maxenergy<2e-14 and maxrate<2e-14 and cascade_error<2e-14
    receipt=dict(status='PASS: exact identities and finite diagnostic checks',
                 exact_rational_checks=exact_checks(),max_transfer_error=maxerr,
                 max_two_port_power_error=maxenergy,max_three_stage_power_error=cascade_error,
                 max_decay_rate_error=maxrate,parameters=dict(sigma=sigma,h=h),
                 examples=examples,normalizations=normalizations,
                 limitations=['No hardware test','No independent review','No interval certification',
                              'No completed-xi realization','No RH or global positivity result'])
    print(json.dumps(receipt,indent=2))
    Path(__file__).with_name('verification_receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')

if __name__=='__main__':
    main()
