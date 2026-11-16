"""Rigorous Taylor-model certificate on 1/8 <= t <= 4.

The numerator formulas are polynomial, so interval Taylor models can be
multiplied without dropping any terms. Each kappa-jet model has a full
Lagrange remainder on its cell. C is propagated backwards with explicit
absolute integration errors, never by subtracting a large integral.
"""

from fractions import Fraction as Q
from math import factorial
import json

from flint import arb, arb_poly, ctx
from theta_ratio_c_integral_20261110 import C_point


def rat(q):
    q = Q(q)
    return arb(q.numerator) / q.denominator


def ball(radius):
    return arb(0, 1) * radius


def theta_polynomials(max_order):
    coefficients = [[Q(0), Q(-3), Q(2)]]
    for j in range(max_order):
        old = coefficients[-1]
        new = [Q(0)] * (len(old) + 1)
        for k, value in enumerate(old):
            new[k] += (Q(k) + Q(1, 4)) * value
            new[k + 1] -= value
        coefficients.append(new)
    return (
        [arb_poly([rat(c) for c in row]) for row in coefficients],
        [rat(sum(abs(c) for c in row)) for row in coefficients],
    )


class ThetaJets:
    def __init__(self, max_order, terms=16):
        self.max_order = max_order
        self.terms = terms
        self.polys, self.norms = theta_polynomials(max_order)
        m = terms + 1
        # For each n>=m and t>=0, the n-tail majorant ratio is bounded
        # by 2^(2d)*exp[-3(2m+1)] < 1/2, d<=max_order+2.
        if not arb(2)**(2*(max_order+2)) * (-arb(3)*(2*m+1)).exp() < arb(1)/2:
            raise AssertionError('theta-tail ratio bound failed')

    def __call__(self, t, order=None):
        t = arb(t)
        if not t >= 0:
            raise AssertionError('theta real-jet domain requires t>=0')
        if order is None:
            order = self.max_order
        e = t.exp()
        base = arb.pi() * e
        values = [arb(0) for _ in range(order+1)]
        for n in range(1, self.terms+1):
            r = base*n*n
            weight = (t/4-r).exp()
            for j in range(order+1):
                values[j] += weight*self.polys[j](r)
        m = self.terms+1
        # |P_j(r)| <= norm_j*r^(j+2) for r>=1, pi in (3,4).
        common = 2*(t/4-3*e*m*m).exp()
        r_upper = 4*e*m*m
        for j in range(order+1):
            tail = common*self.norms[j]*r_upper**(j+2)
            values[j] += ball(tail)
        return values


def polynomial_numerators(t, k, C):
    k0,k1,k2,k3,k4 = k
    F1 = -k0*k1+t*(k1*k1-k0*k2)
    F2 = 2*k0*(k1*k1-k0*k2)+t*(-k0*k0*k3+3*k0*k1*k2-2*k1**3)
    B3 = k0*k3-k1*k2
    B4 = k0*k0*k4-k0*k2*k2-2*k0*k1*k3+2*k1*k1*k2
    H1 = -t*k0*k0-4*C*k1
    H2 = -k0**3+t*k0*k0*k1+4*C*(2*k1*k1-k0*k2)
    return F1,B3,B4*F1-B3*F2,H2*F1-H1*F2


def audit_numerators():
    import sympy as s
    t=s.symbols('t')
    k=s.Function('k')(t)
    c=s.Function('C')(t)
    r=-s.diff(k,t)/k
    f=t*r
    W=4*s.diff(k,t,2)/k
    h=c/k
    expressions=[s.diff(f,t),s.diff(W,t),
                 s.diff(W,t,2)*s.diff(f,t)-s.diff(W,t)*s.diff(f,t,2),
                 s.diff(h,t,2)*s.diff(f,t)-s.diff(h,t)*s.diff(f,t,2)]
    values=polynomial_numerators(t,[s.diff(k,t,j) for j in range(5)],c)
    normalized=[values[0]/k**2,4*values[1]/k**2,
                4*values[2]/k**5,values[3]/(4*k**5)]
    substitutions={s.diff(c,t,2):-(k+t*s.diff(k,t))/4,s.diff(c,t):-t*k/4}
    for i,(actual,expected) in enumerate(zip(expressions,normalized)):
        if s.cancel(actual.subs(substitutions)-expected)!=0:
            raise AssertionError(f'cleared numerator identity {i} failed')
    return 4


def certify_core(order=12, terms=16):
    if order<4:
        raise ValueError('Taylor order too small')
    algebra_checks=audit_numerators()
    jet=ThetaJets(order+4,terms)
    right=Q(4)
    stop=Q(1,8)
    Cright=C_point(4)
    initial_C=Cright
    names=['f_prime','W_prime','D_W','D_h']
    minima={name:None for name in names}
    cell_count=0
    widths={}
    while right>stop:
        step=Q(1,64)
        while not rat(step)*arb.pi()*rat(right).exp()<=arb(1)/8:
            step/=2
        step=min(step,right-stop)
        left=right-step
        midpoint=(right+left)/2
        half=rat(step/2)
        center=rat(midpoint)
        delta=ball(half)
        interval=center+delta
        jm=jet(center)
        jb=jet(interval)

        # Polynomial part of kappa at the midpoint, with the order-M
        # derivative bound reserved for an explicit remainder.
        k0_truncated=arb_poly([jm[m]/factorial(m) for m in range(order)])
        tpoly=arb_poly([center,arb(1)])
        integral=(tpoly*k0_truncated*(arb(1)/4)).integral()
        remainder_coefficient=rat(right)*abs(jb[order]).upper()/(4*factorial(order)*(order+1))
        half_error=remainder_coefficient*half**(order+1)
        Cmid=Cright+integral(half)+ball(half_error)
        Cleft=Cright+integral(half)-integral(-half)+ball(2*half_error)
        if not Cmid>0 or not Cleft>0:
            raise AssertionError(f'positive C enclosure failed on cell {cell_count}')

        Cpoly=arb_poly([Cmid])-integral
        error_coefficients=[arb(0)]*(order+2)
        error_coefficients[-1]=ball(remainder_coefficient)
        Cpoly+=arb_poly(error_coefficients)

        kmodels=[]
        for j in range(5):
            coefficients=[jm[j+m]/factorial(m) for m in range(order)]
            coefficients.append(jb[j+order]/factorial(order))
            kmodels.append(arb_poly(coefficients))
        numerators=polynomial_numerators(tpoly,kmodels,Cpoly)
        enclosures=[p(delta) for p in numerators]
        for name,value in zip(names,enclosures):
            if not value>0:
                raise AssertionError(f'{name} numerator failed on [{left},{right}]: {value}')

        # kappa is decreasing on the positive axis, an established input.
        # Its value at the left endpoint bounds each positive denominator.
        kappa_max=jet(rat(left),0)[0].upper()
        bounds=[enclosures[0]/kappa_max**2,
                4*enclosures[1]/kappa_max**2,
                4*enclosures[2]/kappa_max**5,
                enclosures[3]/(4*kappa_max**5)]
        for name,value in zip(names,bounds):
            lower=value.lower()
            if minima[name] is None or lower<minima[name]:
                minima[name]=lower
        widths[str(step)]=widths.get(str(step),0)+1
        Cright=Cleft
        right=left
        cell_count+=1
    direct_C=C_point(rat(stop))
    if not Cright.overlaps(direct_C):
        raise AssertionError('backward C propagation disagrees with direct rigorous integral')
    return {
        'status':'passed','domain':'1/8 <= t <= 4',
        'precision_bits':ctx.prec,'theta_terms':terms,'Taylor_order':order,
        'cells':cell_count,'cell_width_counts':widths,
        'exact_numerator_checks':algebra_checks,
        'strict_lower_bounds':{name:str(value) for name,value in minima.items()},
        'C4_input':str(initial_C),'C_at_1_over_8_propagated':str(Cright),
        'C_at_1_over_8_direct':str(direct_C),
        'method':'Full interval Taylor polynomials with Lagrange remainders; all polynomial products retained; rigorous backward C integration with absolute remainder bounds.',
        'scope':'Covers every point of the stated interval; no sampled-point sign inference.',
    }


if __name__=='__main__':
    ctx.prec=224
    print(json.dumps(certify_core(),indent=2))
