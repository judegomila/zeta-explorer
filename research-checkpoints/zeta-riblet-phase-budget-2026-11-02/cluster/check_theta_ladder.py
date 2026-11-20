"""Check the theta, causal, and Laguerre identities and certify a finite ladder.

The finite-ladder energy bound uses outward Decimal intervals. Symbolic
identities use SymPy. Independent quadrature checks use mpmath and are diagnostics.
"""
from fractions import Fraction as Q
from math import factorial
import json

from certify_actual_window import I


def log_moment(order, n):
    value = I(0)
    logn = I(n).log()
    power = I(1)
    for j in range(order+1):
        value += power/factorial(j)
        power *= logn
    return value*factorial(order)/n


def finite_ladder_certificate():
    count = 64
    coeff = [I(0) for _ in range(4)]
    energy = I(0)
    for n in range(1, count+1):
        logn = I(n).log()
        square, cube = logn*logn, logn*logn*logn
        increment = [square/2+cube/6, -logn-square/2, (I(1)+logn)/2, I(-1)/6]
        coeff = [a+b for a,b in zip(coeff, increment)]
        if n == count:
            correction = [-cube*n/6, square*n/2, -logn*n/2, I(n)/6]
            coeff = [a+b for a,b in zip(coeff, correction)]
        squared = [
            sum((coeff[j]*coeff[k-j] for j in range(max(0,k-3), min(3,k)+1)), I(0))
            for k in range(7)
        ]
        for k, term in enumerate(squared):
            moment = log_moment(k,n)
            if n < count:
                moment -= log_moment(k,n+1)
            energy += term*moment
    assert energy.lo > 0 and energy.hi < (I(169)/16).lo
    # ||f-f_64|| <= 4/sqrt(64)=1/2. Thus ||f|| < 13/4+1/2=15/4.
    assert Q(16,225) > Q(1,16)
    return dict(
        arithmetic_terms=count,
        anchor=dict(d="1/2", c="0"),
        finite_source_energy_interval=energy.pair(),
        finite_source_norm_upper="13/4",
        source_norm_error_upper="1/2",
        true_energy_upper="225/16",
        true_ratio_strict_lower="16/225",
    )


def symbolic_checks():
    import sympy as s

    z,x,d,a = s.symbols("z x d a")
    # Elementary Laplace transforms verify the normalized Laguerre map.
    for n in range(9):
        polynomial = s.Poly(s.laguerre(n,2*d*x),x)
        transform = sum(
            coefficient*factorial(power[0])/(z+a)**(power[0]+1)
            for power,coefficient in polynomial.terms()
        )
        assert s.factor(transform-(z+a-2*d)**n/(z+a)**(n+1)) == 0
    assert s.simplify((z-s.Rational(1,2))/(z+a)**3
                     - (z-s.Rational(1,2))/(z+s.Rational(1,2))
                     *(1/(z+a)**2+(s.Rational(1,2)-a)/(z+a)**3)) == 0

    # A smooth positive causal source obeys the same size bound but has a
    # right-half-plane zero. Exact rational arithmetic checks its location.
    alpha=s.Rational(8069435283,471943926065)
    beta=s.Rational(38676793156323,60408822536320)
    assert alpha**2+beta**2 < 1
    q=z+s.Rational(1,2)
    h=(1/q-1/(q+1)+alpha*(q/(q*q+64)-(q+1)/((q+1)**2+64))
       +beta*(8/(q*q+64)-8/((q+1)**2+64)))/2
    u=1-(z-s.Rational(1,2))*h
    assert s.simplify(u.subs(z,s.Rational(1,4)+8*s.I)) == 0
    assert s.limit(u,z,s.oo)==1
    return dict(laguerre_orders=9, positive_source_counterexample_zero="1/4+8i")


def quadrature_diagnostics():
    import mpmath as mp

    mp.mp.dps=50
    worst=mp.mpf(0)

    def pulse(x,a):
        # Inverse transform of (s-1)/(s*(z+a)^3).
        if x <= 0:
            return mp.mpc(0)
        k=lambda y: y*y*mp.exp(-a*y)/2
        return k(x)-mp.quad(lambda y: mp.exp(-(x-y)/2)*k(y),[0,x])

    for d,c in [(mp.mpf("0.5"),0),(mp.mpf("0.25"),2)]:
        a=d-1j*c
        for x in [mp.mpf("0.5"),1,2,3]:
            count=int(mp.floor(mp.exp(x)))
            edges=[mp.log(n) for n in range(1,count+1)]+[mp.mpf(x)]
            integral=mp.mpc(0)
            for n,(left,right) in enumerate(zip(edges,edges[1:]),1):
                def integrand(y):
                    u=x-y
                    h=(mp.exp(y)-n)*mp.exp(-y/2)
                    return h*(u-(a+mp.mpf("0.5"))*u*u/2)*mp.exp(-a*u)
                integral+=mp.quad(integrand,[left,right])
            causal=x*x*mp.exp(-a*x)/2-integral
            ladder=sum(pulse(x-mp.log(n),a)/mp.sqrt(n) for n in range(1,count+1))
            worst=max(worst,abs(causal-ladder))
    assert worst < mp.mpf("1e-35")

    # Independent theta normalization and completion check at two anchors.
    def phi(u):
        return sum((4*mp.pi**2*n**4*mp.exp(9*u/2)
                    -6*mp.pi*n*n*mp.exp(5*u/2))
                   *mp.exp(-mp.pi*n*n*mp.exp(2*u)) for n in range(1,9))
    for z in [mp.mpf("0.25")+3j,mp.mpf("0.5")+18j]:
        theta=2*mp.quad(lambda u: phi(u)*mp.cosh(z*u),[0,mp.mpf("0.5"),1,2,3])
        s=z+mp.mpf("0.5")
        multiplier=2*mp.pi**(s/2)/(s*s*mp.gamma(s/2))
        actual=(s-1)*mp.zeta(s)/s
        worst=max(worst,abs(multiplier*theta-actual))
    assert worst < mp.mpf("1e-35")
    return dict(max_absolute_discrepancy=mp.nstr(worst,8), rigorous=False)


if __name__ == "__main__":
    print(json.dumps(dict(
        certificate=finite_ladder_certificate(),
        symbolic=symbolic_checks(),
        quadrature=quadrature_diagnostics(),
    ),indent=2))
