from decimal import Decimal, Context, ROUND_FLOOR, ROUND_CEILING, ROUND_HALF_EVEN
D=Decimal; lo=Context(prec=44,rounding=ROUND_FLOOR); hi=Context(prec=44,rounding=ROUND_CEILING); mid=Context(prec=44,rounding=ROUND_HALF_EVEN)
class IV:
 def __init__(self,a,b=None): self.a=D(a) if not isinstance(a,Decimal) else a; self.b=self.a if b is None else (D(b) if not isinstance(b,Decimal) else b)
 def __add__(self,o):
  o=conv(o); return IV(lo.add(self.a,o.a),hi.add(self.b,o.b))
 __radd__=__add__
 def __neg__(self): return IV(self.b.copy_negate(),self.a.copy_negate())
 def __sub__(self,o): return self+-conv(o)
 def __rsub__(self,o): return conv(o)+-self
 def __mul__(self,o):
  o=conv(o); return IV(min(lo.multiply(x,y) for x in (self.a,self.b) for y in (o.a,o.b)),max(hi.multiply(x,y) for x in (self.a,self.b) for y in (o.a,o.b)))
 __rmul__=__mul__
 def __truediv__(self,o):
  o=conv(o); assert o.a>0; return self*IV(lo.divide(D(1),o.b),hi.divide(D(1),o.a))
 def exp(self): return IV(mid.next_minus(mid.exp(self.a)),mid.next_plus(mid.exp(self.b)))
 def abs(self):
  if self.a>=0:return self
  if self.b<=0:return -self
  return IV(0,max(self.a.copy_negate(),self.b))
def conv(x): return x if isinstance(x,IV) else IV(x)
# Certify the decimal pi bracket by Machin's identity and alternating series.
from fractions import Fraction

def atan_bounds(inv, terms):
 assert terms % 2 == 0
 total=sum((Fraction((-1)**k,(2*k+1)*inv**(2*k+1)) for k in range(terms)), Fraction())
 return total, total+Fraction(1,(2*terms+1)*inv**(2*terms+1))
a,b=atan_bounds(5,70); c,d=atan_bounds(239,30)
pi=IV('3.14159265358979323846264338327950288419716939937510','3.14159265358979323846264338327950288419716939937511')
assert Fraction(pi.a)<16*a-4*d and 16*b-4*c<Fraction(pi.b)

ln2=mid.ln(D(2)); L=IV(mid.next_minus(ln2),mid.next_plus(ln2)); sqrt2=mid.sqrt(D(2)); R=IV(mid.next_minus(sqrt2),mid.next_plus(sqrt2))
def f(x):
 z=pi*(2*x).exp()
 return 4*(x/2).exp()*z*(2*z-3)*(-z).exp()
I=IV(0); C=IV(0); N=20000; step=IV('0.0001')
for j in range(N):
 x=IV(D(j)/D(10000),D(j+1)/D(10000)); fx=f(x)
 I=I+x*x*fx*fx*step
 C=C+f(x+L/2)*f((x-L/2).abs())*step
I=2*IV('1.0041')*IV('1.0041')*I+IV('1e-100'); C=2*C
first=L*L*C/R; gap=first-I
print('I upper',I.b);print('harmonic lower',first.a); print('gap lower',gap.a)
assert I.b<D('0.03176') and first.a>D('0.03276') and gap.a>D('0.001')
print('PASS decimal directed certificate')
