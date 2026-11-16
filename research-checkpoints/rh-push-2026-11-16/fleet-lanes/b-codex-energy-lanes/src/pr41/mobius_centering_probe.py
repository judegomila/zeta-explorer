#!/usr/bin/env python3
"""Floating diagnostics for exact identities; not interval certification."""
import math,json
from pathlib import Path

def run():
    xs=[256,1024,4096,16384,65536]
    N=2*max(xs); mu=[1]*(N+1); mu[0]=0; prime=[True]*(N+1)
    lam=[0.]*(N+1)
    for p in range(2,N+1):
        if prime[p]:
            for n in range(p,N+1,p):prime[n]=False;mu[n]*=-1
            for n in range(p*p,N+1,p*p):mu[n]=0
            n=p
            while n<=N:lam[n]=math.log(p);n*=p
    h=math.log(2); c=8*(math.cosh(h/2)-1)
    c1=8*h*math.sinh(h/2)-32*(math.cosh(h/2)-1)
    cw=4*math.sqrt(2)+2+h; cl=8*h+2*math.sqrt(2)*h*h
    def M(k):return math.fsum(mu[a]/a for a in range(1,k+1))
    def L(k):return math.fsum(mu[a]*math.log(a)/a for a in range(1,k+1))
    output=[]
    for x in xs:
        U=V=math.floor(x**.375+1e-10); rt=math.sqrt(x)
        av=math.fsum(lam[n]/n for n in range(1,V+1))
        def w(n):return max(0.,h-abs(math.log(n/x)))/math.sqrt(n)
        def B(k):return (c*math.log(x)+c1-c*av)*M(k)-c*L(k)-c
        beta=[0.]*(2*x//(U+1)+1)
        for n in range(V+1,len(beta)):
            if lam[n]:
                for d in range(n,len(beta),n):beta[d]+=lam[n]
        K=math.ceil(2*x/V)
        rows={a:math.fsum(beta[d]*w(a*d) for d in range(V+1,2*x//a+1))
              for a in range(U+1,K+1)}
        i4=math.fsum(mu[a]*r for a,r in rows.items())
        J=i4+rt*B(U)
        shell=math.fsum(lam[n]*w(n) for n in range(max(2,x//2),2*x+1))-c*rt
        rb=U*(U+1)*(cw*math.log(2*x)+cl)/(32*x**1.5)+cw*U*(U+1)*V*(V+1)*math.log(V)/(64*x**1.5)
        assert abs(shell-J)<=rb+1e-9
        tails=[]
        for cutoff in (K,2*K,4*K):
            centered=[mu[a]*(rows.get(a,0.)-rt/a*(c*math.log(x/a)+c1-c*av))
                      for a in range(U+1,cutoff+1)]
            partial=math.fsum(centered); correction=rt*B(cutoff)
            residual=partial+correction-J
            assert abs(residual)<1e-9
            tails.append({'K':cutoff,'centered_partial':partial,'required_tail_correction':correction,
                          'identity_residual':residual,'sum_absolute_centered_terms':math.fsum(map(abs,centered))})
        output.append({'x':x,'U':U,'V':V,'shell':shell,'I4':i4,'centering':rt*B(U),
                       'J':J,'quadrature_error':shell-J,'quadrature_error_upper':rb,'tails':tails})
    from fractions import Fraction as F
    exponents=[]
    for theta in (F(1,2),F(2,3),F(7,8)):
        alpha=(3*theta-1)/(2*(3-theta))
        direct=theta-F(1,2)
        assert alpha-direct==(1-theta)**2/(3-theta)
        exponents.append({'theta':str(theta),'balanced_row_exponent':str(F(1,2)-F(3,8)*(1-theta)),
                          'optimized_infimum':str(alpha),'direct_exponent':str(direct),
                          'loss':str(alpha-direct)})
    result={'status':'floating diagnostics only; exponent identities use exact rational arithmetic',
            'samples':output,'exponents':exponents}
    Path(__file__).with_name('mobius_centering_probe.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result,indent=2))

if __name__=='__main__':run()
