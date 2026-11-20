"""Certify explicit parameter bands for the analytic finite-anchor tail theorem.
The continuum implication is proved in THETA_FINITE_ANCHOR_TAIL.md.
"""
import json
import flint
from flint import arb, arb_series, ctx
import sympy as sp


def symbolic_controls():
    t,a,c,p,r=sp.symbols('t a c p r',positive=True)
    u=sp.Function('u')(t);h=sp.Function('h')(t)
    d=t*u-1;E=4*(u*u-sp.diff(u,t))-a*a
    gb=(c-h)/(d-a*a*h)
    gn=(d-a*p)/E
    assert sp.simplify(sp.diff(gb,t)-(-sp.diff(h,t)*(d-a*a*c)-(c-h)*sp.diff(d,t))/(d-a*a*h)**2)==0
    assert sp.simplify(sp.diff(gn,t)-(sp.diff(d,t)*E-(d-a*p)*sp.diff(E,t))/E**2)==0
    v,lam=sp.symbols('v lam',positive=True)
    assert sp.simplify(sp.diff(-lam*sp.coth(lam*(v-t)),v)-lam**2/sp.sinh(lam*(v-t))**2)==0
    # Exponential test of the exact right-tail Green normalization.
    assert sp.cancel((4*r*r-a*a)/(2*a)*(a/2)/(r*r-a*a/4)-1)==0
    x=sp.Function('x')(t)
    assert sp.simplify(sp.diff((x-3)/t,t).subs(sp.diff(x,t),x)-((t-1)*x+3)/t**2)==0
    J,b,k,bpp,Jpp=sp.symbols('J b k bpp Jpp')
    ln=4*Jpp-4*a*bpp-a*a*J+a**3*b
    assert sp.expand(ln.subs(bpp,(p*k-a*J+a*a*b)/4)-(4*Jpp-a*p*k))==0
    # Rational margins used for all t>=3 and x>=60.
    assert sp.Rational(7,8)-sp.Rational(3,60)-sp.Rational(1,180)>sp.Rational(4,5)
    assert 1+sp.Rational(1,3)+sp.Rational(1,60)==sp.Rational(27,20)
    assert sp.Rational(27,20)*4-sp.Rational(4,5)*7==-sp.Rational(1,5)
    assert 3*60**2-28*60+32>0 and 6*60-28>0
    assert 60**2-36*60+20>0 and 2*60-36>0
    return dict(source_ratio_derivatives='passed',green_score='passed',
                green_normalization='passed',tail_threshold_monotonicity='passed',
                numerator_source_identity='passed',rational_tail_margins='passed')


def logarithmic_response(A):
    z=arb_series([A,1],prec=3)
    s=z+arb(1)/2
    F=s*(s-1)*(-s*arb.pi().log()/2).exp()*(s/2).gamma()*s.zeta()/2
    assert F[0]>0
    p=F[1]/F[0]
    assert p>0
    return p


def main():
    ctx.prec=192;ctx.cap=3
    assert arb.pi()*arb(3).exp()>60
    rows=[]
    for A,T in [(1,3),(8,3),(32,4),(64,4),(256,6),(1024,7)]:
        p=logarithmic_response(A)
        x=arb.pi()*arb(T).exp()
        margins=dict(x_minus_A_minus_3=x-A-3,
                     T_x_minus_8_A_p=T*x-8*A*p,
                     Q_lower_minus_A_over_2p=(x-3)/T-A/(2*p))
        assert T>=3 and all(m>0 for m in margins.values())
        rows.append(dict(A=A,T=T,p_A=str(p),
                         threshold_margins={name:str(value) for name,value in margins.items()},
                         domain=f'0<a<={A}, t>={T}',status='all threshold inequalities certified'))
    print(json.dumps(dict(status='passed',bits=ctx.prec,python_flint=flint.__version__,
        scope='threshold certificates for the displayed analytic continuum theorem; no pointwise grid inference',
        controls=symbolic_controls(),bands=rows,
        global_small_anchor_corollary='existence of one delta>0 for all t>0; no numerical delta claimed'),indent=2))

if __name__=='__main__':main()
