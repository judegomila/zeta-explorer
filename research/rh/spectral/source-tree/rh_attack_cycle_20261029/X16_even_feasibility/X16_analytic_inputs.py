#!/usr/bin/env python3
"""Exact X=16 EVEN analytic inputs; no head matrix or inertia calculation.

Separate X16 extension: exact2/8 quarter-phase pairing and prime4 halfshift;
fresh fourth-power whole-prime norm, even-only H_K trace, Cbeta13/10,
and finite/all-sequence B2 proof. No accepted source is changed.
"""
from fractions import Fraction
import hashlib
from flint import arb,acb,arb_mat,ctx


def canonical(r):
    while r>=16:r/=16
    while r<1:r*=16
    return r


def grouped(coefficients):
    out={}
    for r,c in coefficients.items():
        r=canonical(r);out[r]=out.get(r,acb(0))+c
    # Retain every key: Acb ``!= 0`` is not the negation of exact zero.
    # In particular an interval containing zero must never be discarded.
    return out


def fresh_power_norm(weights):
    X=16;W=arb(X).log();gamma_weight=arb(2)/3
    states={(Fraction(1),Fraction(1),Fraction(X)):arb(1)}
    moves=[(q,w) for n,w in weights.items() for q in (Fraction(n),Fraction(1,n))]
    counts=[]
    for depth in range(1,5):
        following={}
        for (q,lo,hi),c in states.items():
            for shift,w in moves:
                z=q*shift;l=max(lo,1/z);u=min(hi,Fraction(X)/z)
                if l>=u:continue
                key=(z,l,u);following[key]=following.get(key,arb(0))+c*w
        states=following;counts.append(len(states))
    assert counts==[18,178,1208,6676]
    events={}
    for (q,lo,hi),c in states.items():
        arg=gamma_weight*(arb(q.numerator)/q.denominator).log()
        A=c*arg.cosh();B=c*arg.sinh()
        for endpoint,sign in [(lo,1),(hi,-1)]:
            a,b=events.get(endpoint,(arb(0),arb(0)))
            events[endpoint]=(a+sign*A,b+sign*B)
    endpoints=sorted(events);assert endpoints[0]==1 and endpoints[-1]==X
    A=arb(0);B=arb(0);values=[]
    for lo,hi in zip(endpoints,endpoints[1:]):
        da,db=events[lo];A+=da;B+=db
        for t in (lo,hi):
            T=(gamma_weight*((arb(t.numerator)/t.denominator).log()-W/2)).tanh()
            values.append(A+T*B)
    da,db=events[endpoints[-1]]
    assert (A+da).contains(0) and (B+db).contains(0)
    fourth_power_upper=max(v.upper() for v in values)
    norm_upper=fourth_power_upper.sqrt().sqrt().upper()
    keys='\n'.join(f'{q},{lo},{hi}' for q,lo,hi in sorted(states)).encode()
    return norm_upper,dict(power=4,gamma='2/3',state_counts=counts,
        endpoint_count=len(endpoints),endpoint_values_evaluated=len(values),
        rational_state_key_sha256=hashlib.sha256(keys).hexdigest(),
        fourth_power_row_upper=fourth_power_upper,norm_upper=norm_upper)


def build_inputs(bits=1000,order=36):
    ctx.prec=bits
    X=16;N=2048;J=8192;L=order;Kseries=150
    assert L==36
    alpha=arb(0);eps=arb('.1');epsb=arb('.1');B=arb(2);Cbeta=arb(13)/10
    W=arb(X).log();pi=arb.pi();sq2=arb(2).sqrt();sh=(W/4).sinh()**2
    terms=[(n,arb(p).log()/arb(n).sqrt()) for n,p in
        [(2,2),(3,3),(4,2),(5,5),(7,7),(8,2),(9,3),(11,11),(13,13)]]
    weights=dict(terms);w2,w4,w8=weights[2],weights[4],weights[8]
    assert w2>w8
    nu={}
    for n,w in terms:
        m=1
        while n**m<X:m+=1
        nu[n]=2*(pi/(m+1)).cos()
    Pschur=arb(382507)/100000 # exactly3.82507
    schur_upper,power_norm_evidence=fresh_power_norm(weights)
    assert schur_upper<Pschur
    gamma=arb('1.853')+arb(3)/(5*W)+arb(4)/5*(-5*W/2).exp()/(1-(-2*W).exp())
    HK=W*(W+2*(1-(-W/2).exp()))/(2*pi*pi)
    beta_absolute_bound=arb(1)/4+(sum((w for n,w in terms),arb(0))-2*w8-w4)/pi
    Cformula=(2*W*sh+arb(1)/2+arb(55)*W*W/48)/(pi*pi)
    assert Cformula<Cbeta and beta_absolute_bound+Cformula/3<B
    # Full positive entire-tail floor, not a finite-row minimum.
    arch=lambda j:acb(arb(5)/4,pi*j/W).digamma().real-pi.log()
    uniform_tail_floor=arch(N+1)-gamma-Pschur-HK/N-alpha
    dfar=arch(J+1)-gamma-Pschur-HK/N-alpha
    assert uniform_tail_floor>0 and dfar>0
    y=(W/2).exp()
    Jarch=-(y+1).log()+(y*y+1).log()/2+y.atan()+arb(2).log()/2-pi/4
    base=arb.const_euler()+(4*pi*(W/2).tanh()).log()+2*Jarch
    psi0=acb(arb(1)/4).digamma()
    exps=[]
    for k in range(Kseries):
        a=arb(1)/2+2*k;exps.append((a,(-a*W).exp()))
    aend=arb(1)/2+2*Kseries
    ee=(-aend*W).exp()/(1-(-2*W).exp())
    b=[arb(0)];ed=[];ds={}
    for j in range(J+2):
        freq=2*pi*j/W;z=acb(arb(1)/4,freq/2);psi=z.digamma();ss=psi.imag/2
        sin2=arb([0,1,0,-1][j%4]);cos2=arb([1,0,-1,0][j%4])
        if j>N:
            ds[j]=(psi+1/z).real-pi.log()-gamma-Pschur-HK/N-alpha
            assert ds[j]>0
        if j<=N:
            cc=-(psi-psi0).real/2;xx=z.polygamma(1).real/4
        for a,e in exps:
            den=a*a+freq*freq;ss-=e*freq/den
            if j<=N:
                cc+=e*freq*freq/(a*den)
                xx-=e*((a*a-freq*freq)/(den*den)+W*a/den)
        ss+=arb(0,(ee*freq/(aend*aend)).upper())
        if j<=N:
            cc+=arb(0,(ee*freq*freq/(aend**3)).upper())
            xx+=arb(0,(ee*(1/(aend*aend)+W/aend)).upper())
            ad=base+2*cc-2*xx/W
            # Exact quarter2/three-quarter8 and halfshift4 phases.
            prime_diag=2*(3*w2/4+w8/4)*cos2+w4*(-1)**j+sum(
                (2*w*(1-arb(n).log()/W)*(2*pi*j*arb(n).log()/W).cos()
                 for n,w in terms if n not in (2,4,8)),arb(0))
        if j==0:
            ed.append(32*sh/W-ad-prime_diag);continue
        den=W*W+16*pi*pi*j*j
        # Exact sine pairing; prime4 sine vanishes but its diagonal remains.
        prime_sine=(w2-w8)*sin2+sum(
            (w*(2*pi*j*arb(n).log()/W).sin()
             for n,w in terms if n not in (2,4,8)),arb(0))
        bj=32*W*j*sh/den+ss/pi+prime_sine/pi;b.append(bj)
        if j<=N:
            mjj=32*W*sh*(W*W-16*pi*pi*j*j)/(den*den)-ad-prime_diag
            ed.append(mjj+bj/j)
    assert abs(b[1])<B and abs(b[2])<B
    Bformula=max((beta_absolute_bound+Cformula/3).upper(),abs(b[1]).upper(),abs(b[2]).upper())
    assert Bformula<B
    # Symbolic multiplicative aliases must be grouped before convolution.
    raw={Fraction(1):acb(arb(1)/4)}
    for n,w in terms:
        if n==4:continue # exact sin(pi*j)=0, no operator deletion
        raw[Fraction(n)]=raw.get(Fraction(n),acb(0))+acb(0,-w/(2*pi))
        raw[Fraction(1,n)]=raw.get(Fraction(1,n),acb(0))+acb(0,w/(2*pi))
    four=grouped(raw);squared={}
    for r,cr in four.items():
        for q,cq in four.items():squared[r*q]=squared.get(r*q,acb(0))+cr*cq
    squared=grouped(squared)
    mean_convolution=squared.pop(Fraction(1));assert mean_convolution.imag==0
    mean=mean_convolution.real
    mean_formula=arb(1)/16+(w2-w8)**2/(2*pi*pi)+sum((w*w/(2*pi*pi) for n,w in terms if n not in (2,4,8)),arb(0))
    assert mean.overlaps(mean_formula) and mean>0
    Cosc=arb(0)
    for r,c in squared.items():
        assert Fraction(1)<r<Fraction(16)
        theta=2*pi*(arb(r.numerator)/r.denominator).log()/W
        den=abs(1-acb(0,theta).exp());assert den>0
        Cosc+=2*abs(c)/den
    deltaosc=L*Cosc/arb(J+1)**2
    HA=arb_mat(L,L);HC=arb_mat(L,L);HD=arb_mat(L,L)
    for p in range(L):
        for q in range(L):
            z=2*(p+q)
            HA[p,q]=arb(J)**z*arb(z+2).zeta(J+1)
            HC[p,q]=arb(J)**(z+2)*arb(z+4).zeta(J+1)
            HD[p,q]=arb(J)**(z+4)*arb(z+6).zeta(J+1)
    rem=4*B*B*sum(k**(4*L) for k in range(1,N+1))/(
        arb(J)**(4*L+1)*(4*L+1)*(1-arb(N)/(J+1))**2)*(1+1/eps)/dfar

    def elem(j,k,parity):
        assert parity=='even', 'X16 input certificate is EVEN only'
        if j==k:return ed[j]
        if k==0:return (-1)**j*sq2*b[j]/j
        if j==0:return (-1)**k*sq2*b[k]/k
        return 2*(-1)**(j+k)*(j*b[j]-k*b[k])/(j*j-k*k)

    return locals()
