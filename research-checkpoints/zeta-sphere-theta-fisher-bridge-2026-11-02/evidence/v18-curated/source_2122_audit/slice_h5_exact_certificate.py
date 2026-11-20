"""Exact rational interval certificate of a negative H5 theta SLICE witness.

This concerns F(v)=psi(v)^2/psi(0)^2, the h=0 midpoint slice. It does
NOT assert a negative direction for the integrated bridge C_a, nor disprove RH.

Analytic inputs, proved in Section 9 of the accompanying research paper:
* the full modular profile psi is smooth and even;
* its derivatives are obtained by termwise differentiation of its theta sum;
* a stated geometric majorant bounds the entire n>=5 derivative tail.

All transcendental bounds here use finite rational series with remainders.
All interval operations round outward to a fixed rational grid. The script
uses only Python's standard library; its sign conclusion is not floating point.
"""
from fractions import Fraction as F
from math import factorial,comb
from pathlib import Path
import json

SCALE=10**60

def floor_fraction(x):return x.numerator//x.denominator
def ceil_fraction(x):return -((-x.numerator)//x.denominator)

class Interval:
    def __init__(self,low,high=None,raw=False):
        if raw:self.low,self.high=low,high
        else:
            if high is None:high=low
            self.low=floor_fraction(F(low)*SCALE)
            self.high=ceil_fraction(F(high)*SCALE)
        assert self.low<=self.high
    @classmethod
    def raw(cls,lo,hi):return cls(lo,hi,raw=True)
    @staticmethod
    def cast(x):return x if isinstance(x,Interval) else Interval(x)
    def __add__(self,other):
        other=self.cast(other)
        return self.raw(self.low+other.low,self.high+other.high)
    __radd__=__add__
    def __neg__(self):return self.raw(-self.high,-self.low)
    def __sub__(self,other):return self+(-self.cast(other))
    def __rsub__(self,other):return self.cast(other)-self
    def __mul__(self,other):
        other=self.cast(other)
        terms=[self.low*other.low,self.low*other.high,
               self.high*other.low,self.high*other.high]
        return self.raw(min(terms)//SCALE,-((-max(terms))//SCALE))
    __rmul__=__mul__
    def __truediv__(self,other):
        other=self.cast(other)
        assert not other.low<=0<=other.high
        terms=[F(a*SCALE,b) for a in [self.low,self.high]
               for b in [other.low,other.high]]
        return self.raw(floor_fraction(min(terms)),ceil_fraction(max(terms)))
    def __rtruediv__(self,other):return self.cast(other)/self
    def __pow__(self,power):
        assert isinstance(power,int) and power>=0
        result=Interval(1);base=self
        while power:
            if power%2:result=result*base
            power//=2
            if power:base=base*base
        return result
    def bounds(self):return F(self.low,SCALE),F(self.high,SCALE)
    def record(self):
        return {'lower_numerator':str(self.low),'upper_numerator':str(self.high),
                'denominator':str(SCALE),'decimal_preview':[float(x) for x in self.bounds()]}

def atan_reciprocal(q,n):
    # Alternating series: the true value lies between successive partial sums.
    value=sum((F((-1)**j,(2*j+1)*q**(2*j+1)) for j in range(n)),F(0))
    next_value=value+F((-1)**n,(2*n+1)*q**(2*n+1))
    return Interval(min(value,next_value),max(value,next_value))

def exp_positive(x,n=100):
    assert x.low>=0
    term=Interval(1);total=Interval(1)
    for j in range(1,n+1):
        term=term*x/j
        total=total+term
    xhi=F(x.high,SCALE)
    assert xhi<n+2
    next_hi=F(term.high,SCALE)*xhi/(n+1)
    remainder_hi=next_hi/(1-xhi/(n+2))
    return Interval(F(total.low,SCALE),F(total.high,SCALE)+remainder_hi)

def derivative_polynomials(alpha,max_order=10):
    result=[[F(1)]]
    for j in range(max_order):
        p=result[-1];q=[F(0)]*(len(p)+1)
        for k,c in enumerate(p):
            q[k]+=(alpha+2*k)*c
            q[k+1]-=2*c
        result.append(q)
    return result

def polyval(p,x):
    result=Interval(0)
    for c in reversed(p):result=result*x+c
    return result

def certify():
    # Machin identity follows from tan(4 atan(1/5)-atan(1/239))=1
    # and 0<4 atan(1/5)-atan(1/239)<pi/2.
    pi=16*atan_reciprocal(5,48)-4*atan_reciprocal(239,16)
    assert pi.low>3*SCALE and pi.high<4*SCALE
    exp_pi=exp_positive(pi)
    exp_minus_pi=1/exp_pi
    e3_lower=sum((F(3)**j/factorial(j) for j in range(9)),F(0))
    assert e3_lower>20
    # Uniform ratio bound for n>=5 and derivative orders 0<=j<=10.
    tail_ratio=F(6,5)**24/F(20**11)
    assert tail_ratio<F(1,10**10)
    PA=derivative_polynomials(F(9,2))
    PB=derivative_polynomials(F(5,2))
    derivatives={}
    tails={}
    for j in range(0,11,2):
        value=Interval(0)
        for n in range(1,5):
            x=pi*(n*n)
            summand=(8*pi*pi*n**4*polyval(PA[j],x)
                     -12*pi*n*n*polyval(PB[j],x))*exp_minus_pi**(n*n)
            value=value+summand
        A=sum(map(abs,PA[j]),F(0));B=sum(map(abs,PB[j]),F(0))
        first_bound=(128*A+48*B)*4**j*F(5**(2*j+4),20**25)
        tail=first_bound/(1-tail_ratio)
        tails[j]=tail
        derivatives[j]=value+Interval(-tail,tail)
    assert derivatives[0].low>0
    moments={}
    for r in range(1,6):
        j=2*r
        total=sum((comb(j,k)*derivatives[k]*derivatives[j-k]
                   for k in range(0,j+1,2)),Interval(0))
        moments[j]=((-1)**r)*total/(derivatives[0]**2)
    # p(k)=k(k^2-50)(k^2-200)=k^5-250 k^3+10000 k.
    Q=(10**8*moments[2]-5*10**6*moments[4]+82500*moments[6]
       -500*moments[8]+moments[10])
    assert Q.high < -1400000000*SCALE
    return {
        'status':'exact rational interval sign certificate passed',
        'scope':'h=0 midpoint slice F(v)=psi(v)^2/psi(0)^2, not integrated bridge C_a',
        'witness':'p(k)=k(k^2-50)(k^2-200)',
        'quadratic_form_coefficients':{'mu2':100000000,'mu4':-5000000,
                                       'mu6':82500,'mu8':-500,'mu10':1},
        'certified_quadratic_form_upper_bound':-1400000000,
        'quadratic_form_interval':Q.record(),
        'pi_interval':pi.record(),
        'exp_minus_pi_interval':exp_minus_pi.record(),
        'tail_ratio_bound':str(tail_ratio),
        'theta_derivative_tail_bounds':{str(j):str(x) for j,x in tails.items()},
        'theta_derivative_intervals':{str(j):x.record() for j,x in derivatives.items()},
        'slice_moment_intervals':{str(j):x.record() for j,x in moments.items()},
        'analytic_inputs':['smooth modular evenness of complete psi',
                           'termwise derivative formula for entire theta sum on real axis',
                           'explicit n>=5 geometric derivative-tail bound in companion paper Section 9'],
    }

if __name__=='__main__':
    result=certify()
    Path(__file__).with_suffix('.json').write_text(json.dumps(result,indent=2)+'\n')
    print(result['status'])
    print(result['scope'])
    print(result['witness'])
    print('Certified Q <',result['certified_quadratic_form_upper_bound'])
    print('Q interval preview:',result['quadratic_form_interval']['decimal_preview'])
    print('Max-order theta-tail bound:',float(F(result['theta_derivative_tail_bounds']['10'])))
