"""Small exact-rational certificates, no external numerical library required.
Every printed containing decimal is rounded outwards using integer arithmetic.
Transcendentals use rational series remainder bounds. Gamma uses elementary
H_N - log(N) - 1/N < gamma < H_N - log(N), N=10000.
"""
from fractions import Fraction as F
from dataclasses import dataclass

S=10**40

def rnd(lo,hi):
    return I(F((lo.numerator*S)//lo.denominator,S),F(-((-hi.numerator*S)//hi.denominator),S))

@dataclass(frozen=True)
class I:
    lo:F
    hi:F
    def __add__(self,o):
        o=iv(o);return rnd(self.lo+o.lo,self.hi+o.hi)
    __radd__=__add__
    def __neg__(self):return I(-self.hi,-self.lo)
    def __sub__(self,o):return self+-iv(o)
    def __rsub__(self,o):return iv(o)+-self
    def __mul__(self,o):
        o=iv(o);p=[self.lo*o.lo,self.lo*o.hi,self.hi*o.lo,self.hi*o.hi];return rnd(min(p),max(p))
    __rmul__=__mul__
    def inv(self):
        assert self.lo*self.hi>0
        return rnd(1/self.hi,1/self.lo)
    def __truediv__(self,o):return self*iv(o).inv()
    def __rtruediv__(self,o):return iv(o)*self.inv()
    def show(self,d=12):
        s=10**d; l=(self.lo.numerator*s)//self.lo.denominator; h=-((-self.hi.numerator*s)//self.hi.denominator)
        def dec(n):return ('-' if n<0 else '')+str(abs(n)//s)+'.'+str(abs(n)%s).zfill(d)
        return '['+dec(l)+', '+dec(h)+']'

def iv(x):
    if isinstance(x,I):return x
    x=F(x);return I(x,x)

def expq(x):
    if x<0:return expq(-x).inv()
    n=80; term=F(1); total=term
    for j in range(1,n+1):term*=x/j;total+=term
    nxt=term*x/(n+1); ratio=x/(n+2)
    assert ratio<1
    return rnd(total,total+nxt/(1-ratio))

def exp(x):
    x=iv(x);return I(expq(x.lo).lo,expq(x.hi).hi)

def logsmall(x):
    assert 1<=x<=2
    z=(x-1)/(x+1);n=80
    total=2*sum((z**(2*j+1)/F(2*j+1) for j in range(n)),F(0))
    err=2*z**(2*n+1)/(F(2*n+1)*(1-z*z))
    return rnd(total,total+err)

LN2=logsmall(F(2))
def logq(x):
    assert x>0
    if x<1:return -logq(1/x)
    m=0
    while x>2:x/=2;m+=1
    return logsmall(x)+m*LN2

def log(x):
    x=iv(x);return I(logq(x.lo).lo,logq(x.hi).hi)

def atan_small(x):
    if x<0:return -atan_small(-x)
    assert 0<=x<=F(1,3)
    n=50;v=sum(((-1)**j*x**(2*j+1)/F(2*j+1) for j in range(n)),F(0))
    nxt=x**(2*n+1)/F(2*n+1)
    return rnd(v,v+nxt) # even n: partial sum below atan

PI=16*atan_small(F(1,5))-4*atan_small(F(1,239))

def atanq(x):
    assert x>0
    return PI/4+atan_small((x-1)/(x+1))

def atan(x):
    x=iv(x);return I(atanq(x.lo).lo,atanq(x.hi).hi)

N=10000
HN=sum((F(1,n) for n in range(1,N+1)),F(0))
GN=iv(HN)-log(N)
GAMMA=I(GN.lo-F(1,N),GN.hi)
C0=GAMMA+log(2*PI)

def prime_rows(L):
    X=exp(L)
    # The two test radii lie strictly between 1,2 and 3,4.
    if X.hi<2:return iv(0),iv(0)
    assert X.lo>3 and X.hi<4
    cosh=F(3,2)*log(2)+F(4,3)*log(3)
    # exp(-log(n)/2) supplies rigorous inverse square roots.
    one=2*log(2)*exp(-log(2)/2)+2*log(3)*exp(-log(3)/2)
    return one,cosh

print('Method: exact Fraction arithmetic plus explicit convergent-series bounds.')
print('gamma enclosure',GAMMA.show())
for L in [F(1,5),F(6,5)]:
    X=exp(L); oneprime,coshprime=prime_rows(L)
    arch_cosh=-C0-log(X-1)
    pole_cosh=2*L+X-1/X
    q0_cosh=arch_cosh-coshprime
    q_cosh=q0_cosh+pole_cosh
    t=exp(-L/2)
    arch_one=-C0-2*LN2-PI/2+log((1+t)/(1-t))+2*atan(t)
    q0_one=arch_one-oneprime
    q_one=q0_one+4*(exp(L/2)-exp(-L/2))
    print('L =',L,'X =',X.show())
    for name,v in [('arch_cosh',arch_cosh),('Q0_cosh_center',q0_cosh),('Q_cosh_center',q_cosh),('Q0_one_center',q0_one),('Q_one_center',q_one)]:
        print(name,v.show())
    assert q0_cosh.hi<0 and q0_one.hi<0 and q_cosh.hi<0 and q_one.hi<0
print('PASS: both Q0 row defects and even full-Q positive-weight rows are negative at both radii.')
