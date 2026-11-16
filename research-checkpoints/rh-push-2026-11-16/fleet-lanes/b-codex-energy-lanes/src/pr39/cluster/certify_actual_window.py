"""Outward Decimal Euler--Maclaurin enclosure of an actual zeta contour.

Standard library only. No numerical zeta library or known-zero list is used.
See CLUSTER_RESIDUAL.md for the remainder bounds and scope of the certificate.
"""
from decimal import Decimal as D, localcontext, ROUND_FLOOR, ROUND_CEILING
from fractions import Fraction
import json
import math
import os
import sys

PREC = int(os.environ.get('CLUSTER_DECIMAL_PREC', '70'))
if PREC < 50:
    raise ValueError('at least 50 decimal digits required')

def rounded(fn, mode):
    with localcontext() as ctx:
        ctx.prec = PREC
        ctx.rounding = mode
        return fn()

class I:
    def __init__(self, lo, hi=None):
        self.lo, self.hi = D(lo), D(lo if hi is None else hi)
        if not self.lo.is_finite() or not self.hi.is_finite() or self.lo > self.hi:
            raise ValueError('invalid interval')
    def __add__(self, b):
        b = as_i(b)
        return I(rounded(lambda: self.lo+b.lo, ROUND_FLOOR), rounded(lambda: self.hi+b.hi, ROUND_CEILING))
    __radd__ = __add__
    def __neg__(self):
        return I(self.hi.copy_negate(), self.lo.copy_negate())
    def __sub__(self,b): return self + (-as_i(b))
    def __rsub__(self,b): return as_i(b) + (-self)
    def __mul__(self,b):
        b=as_i(b)
        pairs=[(a,c) for a in (self.lo,self.hi) for c in (b.lo,b.hi)]
        return I(min(rounded(lambda:a*c,ROUND_FLOOR) for a,c in pairs),
                 max(rounded(lambda:a*c,ROUND_CEILING) for a,c in pairs))
    __rmul__=__mul__
    def inv(self):
        if self.lo <= 0 <= self.hi: raise ValueError('division interval contains zero')
        return I(rounded(lambda:D(1)/self.hi,ROUND_FLOOR),rounded(lambda:D(1)/self.lo,ROUND_CEILING))
    def __truediv__(self,b): return self * as_i(b).inv()
    def __rtruediv__(self,b): return as_i(b) * self.inv()
    def absup(self): return max(self.lo.copy_abs(),self.hi.copy_abs())
    def abslow(self):
        return D(0) if self.lo <= 0 <= self.hi else min(self.lo.copy_abs(),self.hi.copy_abs())
    def square(self):
        lo=self.abslow();hi=self.absup()
        return I(rounded(lambda:lo*lo,ROUND_FLOOR),rounded(lambda:hi*hi,ROUND_CEILING))
    def exp(self):
        # Decimal exp/ln are correctly rounded to nearest. One adjacent number
        # on each side gives outward bounds, independent of the active mode.
        with localcontext() as ctx:
            ctx.prec=PREC
            return I(self.lo.exp().next_minus(),self.hi.exp().next_plus())
    def log(self):
        if self.lo<=0: raise ValueError('log domain')
        with localcontext() as ctx:
            ctx.prec=PREC
            return I(self.lo.ln().next_minus(),self.hi.ln().next_plus())
    def contains_zero(self): return self.lo<=0<=self.hi
    def pair(self): return [str(self.lo),str(self.hi)]

def as_i(x): return x if isinstance(x,I) else I(x)

class C:
    def __init__(self,re,im=0): self.re,self.im=as_i(re),as_i(im)
    def __add__(self,b):
        b=as_c(b);return C(self.re+b.re,self.im+b.im)
    __radd__=__add__
    def __neg__(self): return C(-self.re,-self.im)
    def __sub__(self,b): return self+-as_c(b)
    def __rsub__(self,b): return as_c(b)+-self
    def __mul__(self,b):
        b=as_c(b);return C(self.re*b.re-self.im*b.im,self.re*b.im+self.im*b.re)
    __rmul__=__mul__
    def __truediv__(self,b):
        b=as_c(b);den=b.re.square()+b.im.square()
        return self*C(b.re/den,-b.im/den)
    def absup(self): return (I(self.re.absup())+I(self.im.absup())).hi
    def abslow(self): return max(self.re.abslow(),self.im.abslow())

def as_c(x): return x if isinstance(x,C) else C(x)

def trig(x, sine):
    # Taylor at an exact Decimal center; interval radius is paid using |f'|<=1.
    with localcontext() as ctx:
        ctx.prec=PREC
        center=(x.lo+x.hi)/2
    radius=max((I(center)-I(x.lo)).hi,(I(x.hi)-I(center)).hi)
    v=I(center);v2=v*v
    term=v if sine else I(1); total=term
    for k in range(1,121):
        den=(2*k)*(2*k+1) if sine else (2*k-1)*(2*k)
        term= -term*v2/den; total=total+term
    den=242*243 if sine else 241*242
    if v2.absup()>=den: raise ValueError('Taylor tail not decreasing')
    tail=(term*v2/den).absup()
    err=(I(tail)+I(radius)).hi
    return total+I(err.copy_negate(),err)

LOGS={n:I(n).log() for n in range(1,17)}
COEFF=[Fraction(1,12),Fraction(-1,720),Fraction(1,30240),Fraction(-1,1209600),
       Fraction(1,47900160),Fraction(-691,1307674368000),Fraction(1,74724249600),
       Fraction(-3617,10670622842880000)]
PUP=math.prod(range(16,32))
R0=I(4*PUP)/(6**16*15*16**15)
R1=R0*(I(16)/13+3+I(1)/15)

def n_power(s,n):
    arg= -s.im*LOGS[n]
    amp=(-s.re*LOGS[n]).exp()
    return C(amp*trig(arg,False),amp*trig(arg,True))

def zeta_and_derivative(s):
    if not (0<=s.re.lo<=s.re.hi<=1 and D('13.5')<=s.im.lo<=s.im.hi<=D('14.5')):
        raise ValueError('outside proved Euler--Maclaurin remainder domain')
    value=C(0);deriv=C(0)
    for n in range(1,16):
        v=n_power(s,n);value=value+v;deriv=deriv-v*C(LOGS[n])
    base=n_power(s,16);logn=C(LOGS[16]);sm1=s-1
    integ=base*16/sm1
    value=value+integ+base/2
    deriv=deriv+integ*(-logn-C(1)/sm1)-base*logn/2
    poch=C(1);dpoch=C(0);j=0
    for k,coef in enumerate(COEFF,1):
        while j<2*k-1:
            dpoch=dpoch*(s+j)+poch;poch=poch*(s+j);j+=1
        factor=base*C(I(coef.numerator)/coef.denominator/(16**(2*k-1)))
        value=value+factor*poch
        deriv=deriv+factor*(dpoch-poch*logn)
    return value+C(I(R0.hi.copy_negate(),R0.hi),I(R0.hi.copy_negate(),R0.hi)),deriv+C(I(R1.hi.copy_negate(),R1.hi),I(R1.hi.copy_negate(),R1.hi))

def segment(side,k,n):
    # Counterclockwise boundary of [0,1]+i[13.5,14.5]. Dyadic n required.
    if not 1<=n<=65536 or n & (n-1): raise ValueError('bounded dyadic partition required')
    with localcontext() as ctx:
        ctx.prec=PREC
        a=D(k)/n;b=D(k+1)/n;d=D(1)/n
        if side==0: return C(I(a,b),D('13.5')),C(d)
        if side==1: return C(1,I(D('13.5')+a,D('13.5')+b)),C(0,d)
        if side==2: return C(I(1-b,1-a),D('14.5')),C(-d)
        return C(0,I(D('14.5')-b,D('14.5')-a)),C(0,-d)

def certify(n):
    integral=C(0);delta=None;max_ratio=D(0)
    for side in range(4):
        for k in range(n):
            s,dz=segment(side,k,n);v,dv=zeta_and_derivative(s)
            low=v.abslow()
            if low<=0: raise ValueError(f'unresolved boundary segment {side}:{k}')
            delta=low if delta is None else min(delta,low)
            ratio=dv/v
            max_ratio=max(max_ratio,ratio.absup())
            integral=integral+ratio*dz
    # Integral = 2*pi*i*N. Bounds 0<Im<12 and pi>3 force N=1.
    if not (integral.re.contains_zero() and 0<integral.im.lo and integral.im.hi<12):
        raise ValueError('argument-principle enclosure does not isolate count one: '+str((integral.re.pair(),integral.im.pair())))
    B=int(max_ratio.to_integral_value(rounding=ROUND_CEILING))+7
    M=(8*B+2)//3  # perimeter/(2*pi*distance) <= 8/3
    return {
        'status':'rigorous finite contour certificate; no global RH conclusion',
        'precision_decimal_digits':PREC,'segments':4*n,'em_N':16,'em_order':16,
        'zeta_remainder_upper':str(R0.hi),'zeta_derivative_remainder_upper':str(R1.hi),
        'boundary_zeta_modulus_lower':str(delta),'boundary_xi_log_derivative_upper_integer':B,
        'contour_integral_real':integral.re.pair(),'contour_integral_imag':integral.im.pair(),
        'zero_count_with_multiplicity':1,
        'inner_cluster_residual_upper_integer':M,
        'outer_rectangle':{'sigma':[0,1],'height':['13.5','14.5']},
        'inner_rectangle':{'sigma':['0.25','0.75'],'height':['13.75','14.25']},
        'consequence':'The unique zero is simple and on sigma=1/2 by reflection. For 0<x<=1/4 and 13.75<=t<=14.25, negative phase density <= M; hence mass on J <= M*length(J).',
    }

if __name__=='__main__':
    n=int(sys.argv[1]) if len(sys.argv)>1 else 256
    print(json.dumps(certify(n),indent=2))
