"""Higher-moment packet: normalized Q^2 (24 1[-1/48,1/48])^*12.

Exact rational spline algebra and rigorous Arb evaluation.
"""
import math
from fractions import Fraction as F
from functools import lru_cache
from flint import arb, acb


def ball(x):
    return arb(x.numerator)/x.denominator if isinstance(x,F) else arb(x)


@lru_cache(None)
def spline(n,d,x):
    if d>=n or abs(x)>=F(n,48): return F(0)
    total=sum((-1)**j*math.comb(n,j)*(x+F(n,48)-F(j,24))**(n-1-d)
              for j in range(n+1) if x+F(n,48)-F(j,24)>0)
    return total*F(24)**n/math.factorial(n-1-d)


def qpower(n,p,d,x):
    return sum((-1)**j*math.comb(p,j)*F(1,4)**(p-j)*spline(n,d+2*j,x)
               for j in range(p+1))


KAPPA=qpower(24,4,0,F(0))
assert KAPPA>0


def raw_g(d,x): return qpower(12,2,d,x)
def dk(d,x): return qpower(24,4,d,x)/KAPPA


@lru_cache(None)
def kernel_coefficients(cell):
    center=F(-1,2)+F(2*cell+1,48)
    return tuple(dk(j,center)/math.factorial(j) for j in range(24))


def kernel(x):
    if abs(x)>=arb(1)/2: return arb(0)
    # A local Taylor polynomial avoids cancellation in the truncated powers.
    cell=min(23,max(0,math.floor((float(x)+.5)*24)))
    left=arb(cell)/24-arb(1)/2
    right=arb(cell+1)/24-arb(1)/2
    if x>=left and x<=right:
        h=x-(left+right)/2
        out=arb(0)
        for c in reversed(kernel_coefficients(cell)):out=out*h+ball(c)
        return out
    # A ball crossing a knot is enclosed by the union of adjacent polynomials.
    # Each is evaluated on the whole ball, a superset of its relevant part.
    values=[]
    if not abs(x)<arb(1)/2:values.append(arb(0))
    for cell in range(24):
        left=arb(cell)/24-arb(1)/2;right=arb(cell+1)/24-arb(1)/2
        if x<left or x>right:continue
        h=x-(left+right)/2;out=arb(0)
        for c in reversed(kernel_coefficients(cell)):out=out*h+ball(c)
        values.append(out)
    assert values
    out=values[0]
    for v in values[1:]:out=out.union(v)
    return out


def transfer(z):
    if z==0:return (z+1)/256/ball(KAPPA)
    return (arb(1)/4-z*z)**4*((z/48).sinh()/(z/48))**24/ball(KAPPA)


def norm_g_exact():
    total=F(0);half=F(1,48)
    for cell in range(12):
        center=F(-1,4)+F(2*cell+1,48)
        cs=[raw_g(j,center)/math.factorial(j) for j in range(12)]
        total+=sum(a*b*2*half**(i+j+1)/(i+j+1)
                   for i,a in enumerate(cs) for j,b in enumerate(cs) if (i+j)%2==0)
    return total


def contour_constants():
    rows=[]
    for j,r in [(1,6),(2,3),(3,2)]:
        q=arb(2*r)+arb(1)/2
        beta=8-j*q/2
        A=arb(48)**24/ball(KAPPA)*(q/48).cosh()**24*(1+1/(2*q))**8
        D=4/(q-arb(1)/2)+4/(q+arb(1)/2)+(q/48).coth()/2+24/q
        Z=arb(1+2*r).zeta()/(2*arb.pi())**q
        integral=q**(1-2*beta)*arb.pi().sqrt()*(beta-arb(1)/2).gamma()/beta.gamma()
        assert D>1 and beta>arb(1)/2
        C=A*Z**j*D*integral/(2*arb.pi()*j)
        rows.append({'j':j,'r':r,'q':q,'beta':beta,'A':A,'D':D,'Z':Z,'I':integral,'C':C})
    return rows


def archimedean(L,terms=128):
    assert L>arb(1)/2
    total=sum(transfer(arb(2*m)+arb(1)/2)*(-(arb(2*m)+arb(1)/2)*L).exp()
              for m in range(1,terms+1))
    q=arb(2*(terms+1))+arb(1)/2
    tail=arb(24)**24/ball(KAPPA)*(-q*(L-arb(1)/2)).exp()/q**16/(1-(-2*(L-arb(1)/2)).exp())
    return total+arb(0,tail),tail
