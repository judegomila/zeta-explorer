"""Interval certificate for every sufficiently small two-node odd theta Gram.

Certifies an explicit radius via Newton divided differences and real derivative
enclosures. All theta truncations, quadrature remainders and infinite tails are
bounded. No minimum separation of the two nodes is required.
"""
from pathlib import Path
from fractions import Fraction
from math import factorial
import argparse
import json
import math
import time
import mpmath as mp

parser=argparse.ArgumentParser()
parser.add_argument('--delta',default='1/200')
parser.add_argument('--steps',type=int,default=512)
args=parser.parse_args()
HERE=Path(__file__).resolve().parent
iv=mp.iv
iv.dps=40
TERMS=4
STEPS=args.steps
R=3
PM=iv.mpf([-1,1])
UNIT=iv.mpf([0,1])

def exact(q):
    q=Fraction(q)
    return iv.mpf(q.numerator)/q.denominator

delta_q=Fraction(args.delta)
assert 0<delta_q<Fraction(1,4)
delta=exact(delta_q)
d=delta**2
polynomials=[{1:Fraction(-3),2:Fraction(2)}]
for j in range(5):
    nxt={}
    for degree,c in polynomials[-1].items():
        nxt[degree]=nxt.get(degree,Fraction(0))+(Fraction(1,4)+degree)*c
        nxt[degree+1]=nxt.get(degree+1,Fraction(0))-c
    polynomials.append(nxt)
coeffs=[[exact(p.get(i,Fraction(0))) for i in range(max(p)+1)] for p in polynomials]
C=[sum((abs(c) for c in p.values()),Fraction(0)) for p in polynomials]

def polynomial(co,v):
    out=iv.mpf(0)
    for c in reversed(co):out=out*v+c
    return out

# Uniform derivative-series tails on u>=-delta. The n>=5 envelope
# decreases with u because pi*25*exp(-delta)>j+9/4.
series_tails=[]
for j in range(6):
    n0=TERMS+1
    p=iv.mpf(j)+exact(Fraction(9,4))
    assert iv.pi*n0*n0*iv.exp(-delta)>p
    ratio=(iv.mpf(n0+1)/n0)**(2*j+4)*iv.exp(-iv.pi*(2*n0+1)*iv.exp(-delta))
    assert ratio<1
    series_tails.append(exact(C[j])*iv.pi**(j+2)*n0**(2*j+4)*iv.exp(-p*delta-iv.pi*n0*n0*iv.exp(-delta))/(1-ratio))

def derivatives(u):
    eu=iv.exp(u)
    pref=iv.exp(u/4)
    out=[iv.mpf(0) for _ in range(6)]
    for n in range(1,TERMS+1):
        v=iv.pi*n*n*eu
        weight=pref*iv.exp(-v)
        for j in range(6):out[j]+=weight*polynomial(coeffs[j],v)
    return [value+PM*series_tails[j] for j,value in enumerate(out)]

# For u>=R-delta, each entire derivative series is bounded by E_j(u).
# E_j(u)=2*C_j*pi^(j+2)*exp((j+9/4)*u-pi*exp(u)).
# Its envelope decreases there; this controls every shifted r-x, |x|<=delta.
const=[]
for j in range(6):
    ratio=iv.mpf(2)**(2*j+4)*iv.exp(-3*iv.pi*iv.exp(iv.mpf(R)-delta))
    assert ratio<iv.mpf(1)/2
    assert iv.pi*iv.exp(iv.mpf(R)-delta)>iv.mpf(j)+exact(Fraction(9,4))
    const.append(2*exact(C[j])*iv.pi**(j+2))

def shifted_product_tail(m,n,linear=False):
    """Bound integral_R^inf E_m(r-delta) E_n(r-delta),
    with an additional factor 2r+2delta if linear=True."""
    p=iv.mpf(m+n)+exact(Fraction(9,2))
    a=iv.mpf(R)-delta
    rate=2*iv.pi*iv.exp(a)-p
    assert rate>0
    pref=const[m]*const[n]*iv.exp(p*a-2*iv.pi*iv.exp(a))
    return pref*((2*R+2*delta)/rate+2/rate**2 if linear else 1/rate)

started=time.time()
moments=[iv.mpf(0) for _ in range(3)]
moment_errors=[iv.mpf(0) for _ in range(3)]
orders=[(1,0),(1,1),(0,2),(2,1)]
mixed_bounds={ab:iv.mpf(0) for ab in orders}
h=iv.mpf(R)/STEPS
for i in range(STEPS):
    u=iv.mpf([i,i+1])*R/STEPS
    midpoint=iv.mpf(2*i+1)*R/(2*STEPS)
    vals=derivatives(u)
    midvals=derivatives(midpoint)
    shifted=[abs(z) for z in derivatives(u+PM*delta)]
    for j in range(1,4):
        f_second=4*vals[j]*vals[j+1]+2*u*(vals[j+1]**2+vals[j]*vals[j+2])
        error=abs(f_second)*h**3/24
        moments[j-1]+=h*midpoint*midvals[j]**2+PM*error
        moment_errors[j-1]+=error
    for ab in orders:
        a,b=ab;m,n=2*a+1,2*b+1
        # The two reflected derivatives of H0 give the factor 2.
        bound=2*((2*u+2*delta)*shifted[m]*shifted[n]
                 +m*shifted[m-1]*shifted[n]+n*shifted[m]*shifted[n-1])
        mixed_bounds[ab]+=h*bound

# Unshifted moment tails: same explicit formula, evaluated at u>=R.
moment_tails=[]
for j in range(1,4):
    p=iv.mpf(2*j)+exact(Fraction(9,2))
    rate=2*iv.pi*iv.exp(iv.mpf(R))-p
    tail=const[j]**2*iv.exp(p*R-2*iv.pi*iv.exp(iv.mpf(R)))*(iv.mpf(R)/rate+1/rate**2)
    assert rate>0
    moment_tails.append(tail)
    moments[j-1]+=UNIT*tail

# The positive-weight odd-to-squared-variable identity bounds G_ab by
# a! b! / ((2a+1)! (2b+1)!) times the mixed H derivative bound.
derivative_tail_bounds={}
for ab in orders:
    a,b=ab;m,n=2*a+1,2*b+1
    tail=2*(shifted_product_tail(m,n,True)
            +m*shifted_product_tail(m-1,n)
            +n*shifted_product_tail(m,n-1))
    scale=exact(Fraction(factorial(a)*factorial(b),factorial(m)*factorial(n)))
    derivative_tail_bounds[ab]=scale*tail
    mixed_bounds[ab]=scale*(mixed_bounds[ab]+tail)

origin=derivatives(iv.mpf(0))
k0,k2=origin[0],origin[2]
i1,i2,i3=moments
j00=4*i1-2*k0*k0
j01=-(2*i2+k0*k2)/3
j11=i3/9-k2*k2/6
jetdet=j00*j11-j01*j01
assert j00>0 and jetdet>0

# Each Newton entry is an average of G, G_Y or G_XY over [0,d]^2.
# The following are uniform absolute errors from the corresponding jet entry.
e00=2*d*mixed_bounds[(1,0)]
e01=d*(mixed_bounds[(1,1)]+mixed_bounds[(0,2)])
e11=2*d*mixed_bounds[(2,1)]
b00=j00+PM*e00
b01=j01+PM*e01
b11=j11+PM*e11
det=b00*b11-b01**2
mu=exact(Fraction(1,10000))
shifted_det=(b00-mu)*(b11-mu)-b01**2
passed=bool(b00-mu>0 and shifted_det>0)

def display(z):
    return [math.nextafter(float(z.a),-math.inf),math.nextafter(float(z.b),math.inf)]

result={
 'status':'PASS' if passed else 'INCONCLUSIVE',
 'theorem':'Every two-node odd theta Gram is positive definite for distinct 0<x,y<=delta; alpha=1, and hence every alpha>0',
 'parameters':{'delta_exact':str(delta_q),'delta_squared_exact':str(delta_q**2),'theta_terms':TERMS,'midpoint_subintervals':STEPS,'integral_cutoff':R},
 'runtime':{'mpmath':mp.__version__,'interval_decimal_precision':iv.dps},
 'jet_matrix':[[display(j00),display(j01)],[display(j01),display(j11)]],
 'jet_determinant':display(jetdet),
 'G_derivative_absolute_upper_bounds':{f'{a},{b}':display(v)[1] for (a,b),v in mixed_bounds.items()},
 'Newton_entry_error_upper_bounds':{'00':display(e00)[1],'01':display(e01)[1],'11':display(e11)[1]},
 'Newton_entry_enclosures':{'00':display(b00),'01':display(b01),'11':display(b11)},
 'Newton_determinant_enclosure':display(det),
 'exact_interval_Newton_determinant':str(det),
 'Newton_uniform_lower_bound_exact':'1/10000',
 'Newton_shifted_determinant_enclosure':display(shifted_det),
 'uniform_theta_derivative_tail_bounds':[display(v)[1] for v in series_tails],
 'infinite_moment_tail_bounds':[display(v)[1] for v in moment_tails],
 'infinite_G_derivative_tail_bounds':{f'{a},{b}':display(v)[1] for (a,b),v in derivative_tail_bounds.items()},
 'scope':'All distinct pairs in the stated real interval, with no minimum separation; arbitrary complex coefficients. No arbitrary-node-count or global positivity claim.',
 'trust_basis':'Outward-rounded mpmath elementary interval operations, exact rational polynomial coefficients, and the displayed analytic error bounds; not a formal proof-assistant verification',
 'elapsed_seconds':time.time()-started
}
filename='theta-odd-explicit-radius-'+str(delta_q).replace('/','-')+'.json'
(HERE/filename).write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
if not passed:raise SystemExit(2)
