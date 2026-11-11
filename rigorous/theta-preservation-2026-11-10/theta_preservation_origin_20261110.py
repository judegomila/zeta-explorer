"""Rigorous constants for all-anchor positivity of J_new''(0).

The proof is in the companion note. Finite theta sums have explicit tails;
bounded t intervals use Arb balls; all finite integrals use acb.integral.
"""
from fractions import Fraction
from math import factorial
import json

from flint import arb, acb, arb_poly, ctx


def rat(q):
    q=Fraction(q)
    return arb(q.numerator)/q.denominator


class Theta:
    def __init__(self,order=6,terms=16):
        self.terms=terms
        self.order=order
        rows=[[Fraction(0),Fraction(-3),Fraction(2)]]
        for j in range(order):
            old=rows[-1];new=[Fraction(0)]*(len(old)+1)
            for k,v in enumerate(old):
                new[k]+=(Fraction(k)+Fraction(1,4))*v
                new[k+1]-=v
            rows.append(new)
        self.polys=[arb_poly([rat(v) for v in row]) for row in rows]
        self.norms=[rat(sum(abs(v) for v in row)) for row in rows]
        m=terms+1
        assert arb.pi()*(-arb(1)/2).exp()>1
        assert arb(2)**(2*(order+2))*(-3*(-arb(1)/2).exp()*(2*m+1)).exp()<arb(1)/2

    def jets(self,t):
        t=arb(t)
        # A small extension below zero contains the outward-rounded first
        # cell. The theta series and the geometric bound are valid there.
        assert t>=-arb(1)/2
        e=t.exp();base=arb.pi()*e
        values=[arb(0)]*(self.order+1)
        for n in range(1,self.terms+1):
            x=base*n*n;weight=(t/4-x).exp()
            for j in range(self.order+1):
                values[j]+=weight*self.polys[j](x)
        m=self.terms+1
        for j in range(self.order+1):
            tail=2*self.norms[j]*(4*e*m*m)**(j+2)*(t/4-3*e*m*m).exp()
            values[j]+=arb(0,tail)
        return values

    def finite(self,z):
        z=acb(z);base=acb.pi()*z.exp();value=acb(0)
        for n in range(1,self.terms+1):
            x=base*n*n
            value+=(z/4-x).exp()*(2*x*x-3*x)
        return value

    def tail0(self):
        m=self.terms+1
        return 2*self.norms[0]*(4*m*m)**2*(-arb(3)*m*m).exp()


def symmetric_error(value):
    return arb(0,value)


def positive_error(value):
    return arb(value/2,value/2)


def finite_integral(theta,weight):
    result=acb(0)
    for j in range(4):
        result+=acb.integral(lambda z,analytic:theta.finite(z)*weight(z),j,j+1,
                            rel_tol=arb(2)**-150,abs_tol=arb(2)**-150,
                            deg_limit=100,eval_limit=100000,depth_limit=30)
    assert result.imag.contains(0)
    return result.real


def anchor_p(theta,a):
    a=arb(a);lam=a/2;T=arb(4)
    D=finite_integral(theta,lambda z:(lam*z).cosh())
    U=finite_integral(theta,lambda z:z*(lam*z).sinh()/2)
    E=theta.tail0()*(4*lam).exp()
    D+=symmetric_error(4*E)
    U+=symmetric_error(8*E)
    jet=theta.jets(T);v=-jet[1]/jet[0]
    rate=v-lam
    assert rate>0
    # Q'>0 implies V' increases, hence the tilted tail has this
    # exponentially decreasing majorant from T onward.
    K=jet[0]*(lam*T).exp()
    D+=positive_error(K/rate)
    U+=positive_error(K*(T/rate+1/rate**2)/2)
    assert D>0
    return U/D


def certify():
    ctx.prec=224
    th=Theta()
    zero=th.jets(0)
    k0=zero[0];c=-zero[2]/k0;k4=zero[4]/k0
    assert k0>arb('0.44')
    assert c>arb('4.68') and c<arb('4.7')
    assert k4>arb('56.8')
    C0=finite_integral(th,lambda z:z/4)+symmetric_error(2*th.tail0())
    j4=th.jets(4);Q4=-j4[1]/(4*j4[0])
    assert Q4>0
    C0+=positive_error(j4[0]/(4*Q4))
    cC=k0/(4*C0)
    assert cC<arb('5.19')
    p1=anchor_p(th,1);p20=anchor_p(th,20)
    assert p1>arb('0.04') and p20<arb('0.7')
    max6=arb(0)
    for i in range(4096):
        # Closed dyadic cells [i/1024,(i+1)/1024].
        t=arb(2*i+1)/2048+arb(0,1)/2048
        bound=(th.jets(t)[6]/k0).abs_upper()
        assert bound<1500
        if bound>max6:max6=bound
    e4=arb(4).exp()
    assert 3*e4>arb(33)/4  # t derivative of the majorant is negative.
    assert arb(2)**16*(-9*e4).exp()<arb(1)/2
    tail6=2*th.norms[6]*(4*e4)**8*(1-3*e4).exp()/k0
    assert tail6<1500
    # Shifted rational-polynomial proof for the large-anchor region.
    import sympy as s
    x,y=s.symbols('x y',nonnegative=True)
    d=s.Rational(9,5)+x;r=s.Integer(100)+y
    cu=s.Rational(47,10);kl=s.Rational(284,5);M=s.Integer(1500)
    poly=s.Poly(s.expand(r**2*(kl*d*(d+4)-cu**2*(d+2)**2)
                        -r*M*d*(d+6)-cu*M*(d+2)*(d+6)),x,y)
    assert all(v>0 for v in poly.coeffs())
    small_margin=s.Rational(468,100)*(1+s.Rational(2,15))-s.Rational(519,100)
    assert small_margin>0
    return {'status':'passed','precision_bits':ctx.prec,
            'constants':{'kappa0':str(k0),'c':str(c),'kappa4_over_kappa0':str(k4),
                         'C0':str(C0),'c_C':str(cC),'p1':str(p1),'p20':str(p20)},
            'sixth_derivative_cells':4096,'sixth_derivative_bound_core':str(max6),
            'sixth_derivative_bound_tail':str(tail6),'proved_M6':1500,
            'large_anchor_polynomial_coefficients':[str(v) for v in poly.coeffs()],
            'small_anchor_rational_margin':str(small_margin),
            'conclusion':"J_new''(0)>0 for every a>0, by the analytic comparison in the note.",
            'scope':'All-anchor origin derivative theorem only; spatial and arbitrary-depth preservation require separate arguments.'}


if __name__=='__main__':
    print(json.dumps(certify(),indent=2))
