"""Targeted interval enclosure of the first 2x2 theta odd jet.

Uses mpmath's outward-rounded interval operations; no floating quadrature.
Composite midpoint integration has a rigorous interval second-derivative bound.
Explicit bounds cover the omitted theta terms and the whole u>3 tail.
"""
from pathlib import Path
from fractions import Fraction
import json
import math
import time
import mpmath as mp

HERE=Path(__file__).resolve().parent
iv=mp.iv
iv.dps=40
TERMS=4
STEPS=512
R=3
PM=iv.mpf([-1,1])

# Exact polynomial recurrence P_(j+1)=(1/4-v)P_j+v P_j'.
polynomials=[{1:Fraction(-3),2:Fraction(2)}]
for j in range(5):
    nxt={}
    for degree,c in polynomials[-1].items():
        nxt[degree]=nxt.get(degree,Fraction(0))+(Fraction(1,4)+degree)*c
        nxt[degree+1]=nxt.get(degree+1,Fraction(0))-c
    polynomials.append(nxt)


def exact(q):
    return iv.mpf(q.numerator)/q.denominator


coeffs=[[exact(p.get(i,Fraction(0))) for i in range(max(p)+1)] for p in polynomials]
C=[sum((abs(c) for c in p.values()),Fraction(0)) for p in polynomials]


def evaluate_polynomial(co,v):
    out=iv.mpf(0)
    for c in reversed(co):out=out*v+c
    return out


# Uniform derivative-series tail: |P_j(v)|<=C_j v^(j+2), v>=1.
# Each omitted term decreases with u>=0, because pi*(N+1)^2>j+9/4.
series_tails=[]
for j in range(6):
    n0=TERMS+1
    assert iv.pi*n0*n0 > iv.mpf(j)+iv.mpf(9)/4
    ratio=(iv.mpf(n0+1)/n0)**(2*j+4)*iv.exp(-iv.pi*(2*n0+1))
    assert ratio < 1
    series_tails.append(exact(C[j])*iv.pi**(j+2)*n0**(2*j+4)*iv.exp(-iv.pi*n0*n0)/(1-ratio))


def derivatives(u):
    eu=iv.exp(u)
    pref=iv.exp(u/4)
    out=[iv.mpf(0) for _ in range(6)]
    for n in range(1,TERMS+1):
        v=iv.pi*n*n*eu
        weight=pref*iv.exp(-v)
        for j in range(6):out[j]+=weight*evaluate_polynomial(coeffs[j],v)
    return [v+PM*series_tails[j] for j,v in enumerate(out)]


started=time.time()
integrals=[iv.mpf(0) for _ in range(3)]
error_sums=[iv.mpf(0) for _ in range(3)]
h=iv.mpf(R)/STEPS
for i in range(STEPS):
    interval=iv.mpf([i,i+1])*R/STEPS
    midpoint=iv.mpf(2*i+1)*R/(2*STEPS)
    d_interval=derivatives(interval)
    d_midpoint=derivatives(midpoint)
    for j in range(1,4):
        f_mid=midpoint*d_midpoint[j]**2
        f_second=4*d_interval[j]*d_interval[j+1]+2*interval*(d_interval[j+1]**2+d_interval[j]*d_interval[j+2])
        error=abs(f_second)*h**3/24
        integrals[j-1]+=h*f_mid+PM*error
        error_sums[j-1]+=error

# For u>=R, successive n-term envelopes have ratio <=q_j<1/2.
# Hence |kappa^(j)(u)| <= 2*C_j*pi^(j+2)*exp((j+9/4)u-pi*exp(u)).
moment_tails=[]
for j in range(1,4):
    ratio=iv.mpf(2)**(2*j+4)*iv.exp(-3*iv.pi*iv.exp(iv.mpf(R)))
    assert ratio < iv.mpf(1)/2
    const=2*exact(C[j])*iv.pi**(j+2)
    power=iv.mpf(2*j)+iv.mpf(9)/2
    rate=2*iv.pi*iv.exp(iv.mpf(R))-power
    assert rate > 0
    tail=const**2*iv.exp(power*R-2*iv.pi*iv.exp(iv.mpf(R)))*(iv.mpf(R)/rate+1/rate**2)
    moment_tails.append(tail)
    integrals[j-1]+=iv.mpf([0,1])*tail

origin=derivatives(iv.mpf(0))
k0,k2=origin[0],origin[2]
i1,i2,i3=integrals
j00=4*i1-2*k0*k0
j01=-(2*i2+k0*k2)/3
j11=i3/9-k2*k2/6
det=j00*j11-j01*j01
assert j00 > 0
assert j11 > 0
assert det > 0


def outward_double(z):
    """Displayed IEEE bounds widened by one ulp after endpoint conversion."""
    lo=math.nextafter(float(z.a),-math.inf)
    hi=math.nextafter(float(z.b),math.inf)
    return [lo,hi]


result={
    'status':'PASS: outward-rounded interval determinant is strictly positive',
    'scope':'First 2x2 odd Taylor coefficient matrix only; no global odd PSD claim',
    'runtime':{'mpmath':mp.__version__,'interval_decimal_precision':iv.dps},
    'parameters':{'theta_terms':TERMS,'midpoint_subintervals':STEPS,'integral_cutoff':R,'alpha':1},
    'I1_I2_I3':[outward_double(x) for x in integrals],
    'kappa0':outward_double(k0),'kappa_second0':outward_double(k2),
    'jet_matrix':[[outward_double(j00),outward_double(j01)],[outward_double(j01),outward_double(j11)]],
    'determinant':outward_double(det),
    'midpoint_error_upper_bounds':[outward_double(x)[1] for x in error_sums],
    'uniform_derivative_series_error_upper_bounds':[outward_double(x)[1] for x in series_tails],
    'infinite_moment_tail_upper_bounds':[outward_double(x)[1] for x in moment_tails],
    'exact_interval_determinant':str(det),
    'polynomial_coefficients':[{str(d):str(c) for d,c in p.items()} for p in polynomials],
    'elapsed_seconds':time.time()-started,
    'trust_basis':'mpmath 1.3.0 interval arithmetic and elementary midpoint/tail estimates; no formal proof-assistant verification'
}
(HERE/'theta-odd-jet-interval.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
