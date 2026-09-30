"""Interval witness: the crude prime-5 collar bound fails; full form is not refuted."""
import argparse
from fractions import Fraction as Q
from hashlib import sha256
import json
from math import factorial
from pathlib import Path
from flint import arb, acb, ctx


def add(a,b):
    c=[0]*max(len(a),len(b))
    for i,x in enumerate(a): c[i]+=x
    for i,x in enumerate(b): c[i]+=x
    return c


def mul(a,b):
    c=[0]*(len(a)+len(b)-1)
    for i,x in enumerate(a):
        for j,y in enumerate(b): c[i+j]+=x*y
    return c


def deriv(a): return [i*a[i] for i in range(1,len(a))]
def scale(a,c): return [x*c for x in a]
def ev(a,x):
    z=x*0
    for c in reversed(a): z=z*x+c
    return z


def integrate(a,lo,hi):
    ant=[0]+[c/(i+1) for i,c in enumerate(a)]
    return ev(ant,hi)-ev(ant,lo)


def ball(x):
    x=Q(x)
    return arb(x.numerator)/x.denominator


def shifted(a,d):
    # Horner composition a(z+d), coefficients enclosed in Arb.
    c=[arb(0)]
    for v in reversed(a):
        c=mul(c,[d,arb(1)])
        c[0]+=ball(v)
    return c


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output')
    args=parser.parse_args()
    ctx.prec=384
    B=Q(33,20); a=B/2
    integers=[-6458,-245693,1846367,-11318672,42196348,-91489040,100000000,-43690323]
    odd=[Q(0)]*16
    for j,c in enumerate(integers): odd[2*j+1]=Q(c,10**8)
    g=odd
    for _ in range(4): g=mul(g,[Q(1),Q(0),Q(-1)])
    dg=g
    for order in range(4):
        assert ev(dg,Q(-1))==ev(dg,Q(1))==0
        dg=deriv(dg)
    h=add(scale(deriv(deriv(g)),-1/a**2),scale(g,Q(1,4)))
    norm=a*integrate(mul(h,h),Q(-1),Q(1))
    assert norm>0
    hzz=deriv(deriv(h))
    second_norm=integrate(mul(hzz,hzz),Q(-1),Q(1))/a**3
    # Exact Legendre coefficients of the polynomial h(a*z).
    coeff=[]
    for n in range(len(h)):
        P=[Q(0)]*(n+1)
        for k in range(n//2+1):
            P[n-2*k]=Q((-1)**k*factorial(2*n-2*k),2**n*factorial(k)*factorial(n-k)*factorial(n-2*k))
        coeff.append(Q(2*n+1,2)*integrate(mul(h,P),Q(-1),Q(1)))
    assert all(coeff[n]==0 for n in range(0,len(coeff),2))
    BB,aa=ball(B),ball(a)
    correlations={}
    for n,p in [(2,2),(3,3),(4,2),(5,5)]:
        shift=arb(n).log()/aa
        c=aa*integrate(mul([ball(v) for v in h],shifted(h,shift)),arb(-1),1-shift)
        correlations[n]=c
    width=BB-arb(5).log()
    edge=2*aa*integrate([ball(v) for v in mul(h,h)],arb(-1),-1+width/aa)
    coupling=arb(5).log()/arb(5).sqrt()
    prime_old=sum(2*arb(p).log()/arb(n).sqrt()*correlations[n] for n,p in [(2,2),(3,3),(4,2)])
    prime5=2*coupling*correlations[5]
    # Analytic tail bound; no numerical extrapolation.
    T=400; order=48
    tail=BB*ball(second_norm)/(arb.pi()*T**3)*((arb(T).log()+1)/3+arb(1)/9)
    phi=1+arb(32)/5+(arb(T)/2+1)*arb.pi()**2/6+arb.pi().log()
    quad=4*T*phi*BB*ball(norm)*(3*BB/16).exp()/arb.pi()*arb(2)**(1-2*order)
    nodes=[arb.legendre_p_root(order,k,weight=True) for k in range(order)]
    df=[1]
    for n in range(1,len(coeff)): df.append(df[-1]*(2*n+1))
    arch=arb(0)
    for panel in range(2*T):
        for root,weight in nodes:
            t=arb(panel)/2+(root+1)/4
            z=aa*t
            fourier=arb(0)
            for n in range(1,len(coeff),2):
                if arb(n)<z:
                    jn=(arb.pi()/(2*z)).sqrt()*z.bessel_j(arb(n)+arb(1)/2)
                else:
                    jn=z**n/df[n]*(-z*z/4).hypgeom_0f1(arb(n)+arb(3)/2)
                fourier+=BB*ball(coeff[n])*(-1)**((n-1)//2)*jn
            symbol=acb(arb(1)/4,t/2).digamma().real-arb.pi().log()
            arch+=weight*symbol*fourier**2/(4*arb.pi())
    collar_upper=arch+quad+tail-prime_old-coupling*edge
    assert collar_upper < 0
    # Re psi is increasing in |t|, so the omitted archimedean tail is >=0.
    assert acb(arb(1)/4,arb(T)/2).digamma().real-arb.pi().log()>0
    full_lower=arch-quad-prime_old-prime5
    assert full_lower>0
    # Exact nonnegative mismatch contribution c*int |left-right|².
    mismatch=coupling*(edge-2*correlations[5])
    assert mismatch>0
    result={'status':'certified','scope':'counterexample to crude collar domination, not to Weil positivity or RH',
            'precision_bits':ctx.prec,'width':'33/20','g_definition':'(1-z^2)^4 sum_j integers[j]*z^(2j+1)/10^8; z=x/(33/40)',
            'integers':integers,'norm_squared_exact':str(norm),'cutoff':T,'gauss_order':order,
            'collar_form_upper_per_norm':str(collar_upper/ball(norm)),
            'full_weil_form_lower_per_norm':str(full_lower/ball(norm)),
            'retained_mismatch_per_norm':str(mismatch/ball(norm)),
            'tail_upper_per_norm':str(tail/ball(norm)),'quadrature_error_per_norm':str(quad/ball(norm)),
            'smooth_approximation':'g has four vanishing endpoint traces; approximate in H^4 and apply Q to obtain smooth pole-free witnesses',
            'script_sha256':sha256(Path(__file__).read_bytes()).hexdigest()}
    payload=json.dumps(result,indent=2)+'\n'
    if args.output: Path(args.output).write_text(payload)
    print(payload)


if __name__=='__main__': main()
