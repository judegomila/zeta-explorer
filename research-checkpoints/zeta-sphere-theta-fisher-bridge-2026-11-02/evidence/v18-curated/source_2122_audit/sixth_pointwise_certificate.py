"""Exact rational interval certificate for the complete bridge H3 determinant.

Standard library only.  Covers EVERY real z in [3,10], not sampled z values.
Section 8 of relative_modular_bridge_bounds.pdf proves the analytic z>=10 bound.
The complete n>=3 theta tail is enclosed analytically in every interval.
This is a finite-order theorem; no unrestricted positivity/RH is claimed.
"""
from fractions import Fraction as F
from math import comb, factorial
from pathlib import Path
import json
import time


class I:
    __slots__ = ('lo', 'hi')
    def __init__(self, lo, hi=None):
        self.lo = F(lo)
        self.hi = F(lo if hi is None else hi)
        assert self.lo <= self.hi
    @staticmethod
    def as_i(x): return x if isinstance(x, I) else I(x)
    def __add__(self, other):
        other = I.as_i(other)
        return I(self.lo+other.lo, self.hi+other.hi)
    __radd__ = __add__
    def __neg__(self): return I(-self.hi, -self.lo)
    def __sub__(self, other): return self + (-I.as_i(other))
    def __rsub__(self, other): return I.as_i(other) + (-self)
    def __mul__(self, other):
        other = I.as_i(other)
        ends = [self.lo*other.lo, self.lo*other.hi,
                self.hi*other.lo, self.hi*other.hi]
        return I(min(ends), max(ends))
    __rmul__ = __mul__
    def reciprocal(self):
        assert self.lo*self.hi > 0
        return I(1/self.hi, 1/self.lo)
    def __truediv__(self, other): return self*I.as_i(other).reciprocal()
    def __rtruediv__(self, other): return I.as_i(other)*self.reciprocal()
    def __pow__(self, n):
        assert isinstance(n, int)
        if n < 0: return self.reciprocal()**(-n)
        if n == 0: return I(1)
        if n % 2: return I(self.lo**n, self.hi**n)
        lower = 0 if self.lo <= 0 <= self.hi else min(self.lo**n, self.hi**n)
        return I(lower, max(self.lo**n, self.hi**n))


def dyadic_outward(x, bits=96):
    scale = 2**bits
    low_num = (x.lo.numerator*scale)//x.lo.denominator
    high_num = -((-x.hi.numerator*scale)//x.hi.denominator)
    return I(F(low_num,scale), F(high_num,scale))


def exp_neg(t):
    """Enclose exp(-t) for rational 0<=t<=30 via Taylor and exact squaring."""
    t = F(t)
    assert 0 <= t <= 30
    x = t/32
    term = F(1)
    total = term
    for n in range(1,21):
        term *= x/n
        total += term
    next_term = term*x/21
    upper = total + next_term/(1-x/22)
    out = dyadic_outward(I(total,upper))
    for _ in range(5): out = dyadic_outward(out**2)
    return dyadic_outward(out.reciprocal())


def poly_shift(coeffs, offset):
    out = [F(0)]*len(coeffs)
    for n,c in enumerate(coeffs):
        for j in range(n+1): out[j] += c*comb(n,j)*offset**(n-j)
    return out


def p_derivative_polynomials():
    # D^j exp(-t)=(-2)^j P_j(t) exp(-t), P_(j+1)=t(P_j-P_j').
    polynomials = [[F(1)]]
    for j in range(6):
        p=polynomials[-1]
        derivative=[(k+1)*p[k+1] for k in range(len(p)-1)]
        difference=[p[k]-(derivative[k] if k<len(derivative) else 0)
                    for k in range(len(p))]
        polynomials.append([F(0)]+difference)
    for j,p in enumerate(polynomials):
        # Both P_j and t^j-P_j have nonnegative coefficients after t=9+x.
        assert all(v>=0 for v in poly_shift(p,F(9)))
        difference=[-v for v in p]
        difference[j]+=1
        assert all(v>=0 for v in poly_shift(difference,F(9)))
    return polynomials


def n2_numerators():
    # r_2=e^-3z A_0(t), t=z-3/2, A_0=16+18/t.
    # A_(j+1)=2(t+3/2)(A_j'-3A_j).
    # |r_2^(j)|=e^-3z N_j(z-3)/(z-3/2)^(j+1).
    laurent={0:F(16),-1:F(18)}
    result=[]
    for j in range(7):
        numerator=[F(0)]*(max(laurent)+j+2)
        for exponent,c in laurent.items():
            numerator[exponent+j+1]=(-1)**j*c
        shifted=poly_shift(numerator,F(3,2))
        assert all(c>=0 for c in shifted)
        result.append(shifted)
        middle={e-1:e*c for e,c in laurent.items() if e}
        for e,c in laurent.items(): middle[e]=middle.get(e,F(0))-3*c
        following={}
        for e,c in middle.items():
            following[e+1]=following.get(e+1,F(0))+2*c
            following[e]=following.get(e,F(0))+3*c
        laurent=following
    return result


def positive_poly(coeffs, x):
    assert x.lo >= 0 and all(c>=0 for c in coeffs)
    lo=hi=F(0)
    for c in reversed(coeffs):
        lo=lo*x.lo+c
        hi=hi*x.hi+c
    return I(lo,hi)


def tail_majorant(j, first_n, min_z, ratio):
    s=F((first_n**2-1)*min_z)
    # Here min_z is 3 or 10, and s is a multiple of 3.
    assert s.denominator==1 and s.numerator%3==0
    polynomial=s**j+sum(F(comb(j,l)*factorial(l)*2**l)*s**(j-l)
                        for l in range(j+1))
    first=F(2**j*first_n**4)*polynomial/F(20**(s.numerator//3))
    return first/(1-ratio)


def log_corrections(r):
    T=1+r[0]
    r1,r2,r3,r4,r5,r6=r[1:]
    g2=r2/T-r1**2/T**2
    g4=r4/T-(4*r1*r3+3*r2**2)/T**2+12*r1**2*r2/T**3-6*r1**4/T**4
    g6=(r6/T-(6*r1*r5+15*r2*r4+10*r3**2)/T**2
        +(30*r1**2*r4+120*r1*r2*r3+30*r2**3)/T**3
        -(120*r1**3*r3+270*r1**2*r2**2)/T**4
        +360*r1**4*r2/T**5-120*r1**6/T**6)
    return g2,g4,g6


def whole_slice(cell,numerators,tails):
    exponential=I(exp_neg(3*cell.hi).lo,exp_neg(3*cell.lo).hi)
    r=[]
    for j in range(7):
        magnitude=exponential*positive_poly(numerators[j],cell-3)/(cell-F(3,2))**(j+1)
        magnitude=magnitude+I(0,tails[j])
        r.append(magnitude if j%2==0 else -magnitude)
    g2,g4,g6=log_corrections(r)
    w=F(3,2)/cell
    L2=-4*cell-4*w/(1-w)**2
    L4=-16*cell-16*w*(1+4*w+w**2)/(1-w)**4
    L6=-64*cell-64*w*(1+26*w+66*w**2+26*w**3+w**4)/(1-w)**6
    X=-L2-g2
    Y=L4+g4
    S=L6+g6
    P=24*X**4+18*X**2*Y-Y**2-X*S
    return X,P


def asymptotic_certificate():
    # For n>=2 at z>=10, use the same degree-six tail bound and a loose ratio1/1000.
    ratio=F(1,1000)
    prefactor=F(3,2)**4*F(8,3)**6
    assert prefactor < 2048
    assert F(2048,20**16)<ratio  # e^-50<e^-48<20^-16.
    b=[tail_majorant(j,2,10,ratio) for j in range(7)]
    b1,b2,b3,b4,b5,b6=b[1:]
    g2=b2+b1*b1
    g4=b4+4*b1*b3+3*b2*b2+12*b1*b1*b2+6*b1**4
    g6=(b6+6*b1*b5+15*b2*b4+10*b3*b3
        +30*b1*b1*b4+120*b1*b2*b3+30*b2**3
        +120*b1**3*b3+270*b1*b1*b2*b2+360*b1**4*b2+120*b1**6)
    assert max(g2,g4,g6)<1
    # Thus X>=39, Y<0, S<0; prior analytic lower bound Y>=-4X-421.
    poly=[F(-177241),F(-3368),F(-7594),F(-72),F(24)]
    shifted=poly_shift(poly,F(39))
    assert shifted==list(map(F,[39392549,4770388,203006,3672,24]))
    assert all(v>0 for v in shifted)
    return {'absolute_g2_bound':str(g2),'absolute_g4_bound':str(g4),
            'absolute_g6_bound':str(g6),'pointwise_P_lower':39392549}


def main():
    start=time.monotonic()
    p_derivative_polynomials()
    numerators=n2_numerators()
    # e^3>20 is an exact rational Taylor comparison.
    assert sum((F(3)**j/F(factorial(j)) for j in range(9)),F(0))>20
    prefactor=F(4,3)**4*F(15,8)**6
    assert prefactor<200
    assert F(200,20**7)<F(1,1000000)
    tails=[tail_majorant(j,3,3,F(1,1000000)) for j in range(7)]
    min_P=None
    min_cell=None
    count=700
    target=F(1000000)
    for j in range(count):
        cell=I(F(3)+F(j,100),F(3)+F(j+1,100))
        X,P=whole_slice(cell,numerators,tails)
        if min_P is None or P.lo<min_P:
            min_P,min_cell=P.lo,[str(cell.lo),str(cell.hi)]
        if not (X.lo>17 and P.lo>=target):
            print('FAILED',j,str(cell.lo),str(cell.hi),float(X.lo),float(P.lo))
            raise AssertionError('Rational interval did not establish target')
    asymptotic=asymptotic_certificate()
    report={
        'status':'passed','arithmetic':'exact rational intervals, stdlib fractions.Fraction',
        'compact_z_domain':['3','10'],'closed_interval_count':count,'interval_width':'1/100',
        'verified_pointwise_target':int(target),'minimum_interval_lower_bound_decimal':float(min_P),
        'minimum_interval_location':min_cell,
        'tail_start_n':3,'complete_tail_bounds':[str(x) for x in tails],
        'asymptotic_z_domain':'z>=10','asymptotic_certificate':asymptotic,
        'integrated_determinant_lower':4*int(target),
        'scope':'Fourth confluent channel H3 only; not all-order positivity or RH.',
        'elapsed_seconds':round(time.monotonic()-start,3),
    }
    Path(__file__).with_suffix('.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({k:v for k,v in report.items() if k not in ['complete_tail_bounds','asymptotic_certificate']},indent=2))


if __name__=='__main__':main()
