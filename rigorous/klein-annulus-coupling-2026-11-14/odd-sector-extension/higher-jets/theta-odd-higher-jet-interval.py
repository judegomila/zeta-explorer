"""Validated leading 4x4 odd theta Taylor block.

Only outward-rounded interval arithmetic enters the certificate. Integrates
I_j=int_0^infinity u*(kappa^(j)(u))^2 du for j=1,...,7 with midpoint
Taylor polynomials of degree 9 and rigorous tenth-derivative remainders.
All omitted theta terms and the entire u>3 moment tail are enclosed.
"""
from pathlib import Path
from fractions import Fraction
from functools import lru_cache
import json,math,time
import mpmath as mp
HERE=Path(__file__).resolve().parent
iv=mp.iv
iv.dps=50
TERMS=6
STEPS=128
R=3
ORDER=10
MOMENTS=7
MAX_DERIVATIVE=MOMENTS+ORDER
PM=iv.mpf([-1,1])

# Exact recurrence P_(j+1)(v)=(1/4-v)P_j(v)+vP_j'(v).
polynomials=[{1:Fraction(-3),2:Fraction(2)}]
for j in range(MAX_DERIVATIVE):
    nxt={}
    for degree,c in polynomials[-1].items():
        nxt[degree]=nxt.get(degree,Fraction(0))+(Fraction(1,4)+degree)*c
        nxt[degree+1]=nxt.get(degree+1,Fraction(0))-c
    polynomials.append(nxt)

def exact(q):
    q=Fraction(q)
    return iv.mpf(q.numerator)/q.denominator

coeffs=[[exact(p.get(i,Fraction(0))) for i in range(max(p)+1)] for p in polynomials]
C=[sum((abs(c) for c in p.values()),Fraction(0)) for p in polynomials]

def polynomial(co,v):
    out=iv.mpf(0)
    for c in reversed(co):out=out*v+c
    return out

# Valid uniformly for u>=0. For n>=TERMS+1 the envelope is decreasing
# in u, and the ratio of successive n envelopes is decreasing in n.
series_tails=[]
for j in range(MAX_DERIVATIVE+1):
    n0=TERMS+1
    assert iv.pi*n0*n0 > iv.mpf(j)+iv.mpf(9)/4
    ratio=(iv.mpf(n0+1)/n0)**(2*j+4)*iv.exp(-iv.pi*(2*n0+1))
    assert ratio < 1
    bound=exact(C[j])*iv.pi**(j+2)*n0**(2*j+4)*iv.exp(-iv.pi*n0*n0)/(1-ratio)
    series_tails.append(bound)

def derivatives(u):
    eu=iv.exp(u)
    pref=iv.exp(u/4)
    out=[iv.mpf(0) for _ in range(MAX_DERIVATIVE+1)]
    for n in range(1,TERMS+1):
        v=iv.pi*n*n*eu
        weight=pref*iv.exp(-v)
        for j in range(MAX_DERIVATIVE+1):
            out[j]+=weight*polynomial(coeffs[j],v)
    return [x+PM*series_tails[j] for j,x in enumerate(out)]

def product_derivative(d,j,k):
    """k-th derivative of (kappa^(j))^2 by Leibniz's rule."""
    return sum((math.comb(k,a)*d[j+a]*d[j+k-a] for a in range(k+1)),iv.mpf(0))

def moment_integrand_derivative(u,d,j,k):
    """k-th derivative of u*(kappa^(j))^2, including k=0."""
    return u*product_derivative(d,j,k)+(k*product_derivative(d,j,k-1) if k else 0)

start=time.time()
I=[iv.mpf(0) for _ in range(MOMENTS+1)]
errors=[iv.mpf(0) for _ in range(MOMENTS+1)]
h=iv.mpf(R)/STEPS
weights={k:h**(k+1)/(2**k*math.factorial(k+1)) for k in range(0,ORDER,2)}
remainder_weight=h**(ORDER+1)/(2**ORDER*math.factorial(ORDER+1))
for panel in range(STEPS):
    u_box=iv.mpf([panel,panel+1])*R/STEPS
    u_mid=iv.mpf(2*panel+1)*R/(2*STEPS)
    d_mid=derivatives(u_mid)
    d_box=derivatives(u_box)
    for j in range(1,MOMENTS+1):
        approx=sum((weights[k]*moment_integrand_derivative(u_mid,d_mid,j,k) for k in range(0,ORDER,2)),iv.mpf(0))
        error=abs(moment_integrand_derivative(u_box,d_box,j,ORDER))*remainder_weight
        I[j]+=approx+PM*error
        errors[j]+=error

# Whole u>=R tail. Summing derivative envelopes over all n costs <=2.
# Linearize e^(u-R)>=1+(u-R) and integrate (R+v)*exp(-rate*v).
tails=[iv.mpf(0)]
for j in range(1,MOMENTS+1):
    ratio=iv.mpf(2)**(2*j+4)*iv.exp(-3*iv.pi*iv.exp(iv.mpf(R)))
    assert ratio < iv.mpf(1)/2
    const=2*exact(C[j])*iv.pi**(j+2)
    power=iv.mpf(2*j)+iv.mpf(9)/2
    rate=2*iv.pi*iv.exp(iv.mpf(R))-power
    assert rate > 0
    tail=const**2*iv.exp(power*R-2*iv.pi*iv.exp(iv.mpf(R)))*(iv.mpf(R)/rate+1/rate**2)
    tails.append(tail)
    I[j]+=iv.mpf([0,1])*tail

at0=derivatives(iv.mpf(0))
# Evenness makes the odd origin derivatives exactly zero.
k=[at0[j] if j%2==0 else iv.mpf(0) for j in range(MOMENTS+1)]

@lru_cache(None)
def U(a,b):
    """Integral kappa^(a)*kappa^(b); only odd a+b used."""
    if a>b:return U(b,a)
    assert (a+b)%2==1
    if b==a+1:return -k[a]**2/2
    return -k[a]*k[b-1]-U(a+1,b-1)

@lru_cache(None)
def T(a,b):
    """Integral u*kappa^(a)*kappa^(b); only even a+b used."""
    if a>b:return T(b,a)
    if a==b:return I[a]
    return -U(a,b-1)-T(a+1,b-1)

odd=[1,3,5,7]
J=[[2*(2*T(m,n)+m*U(m-1,n)+n*U(m,n-1))/(math.factorial(m)*math.factorial(n)) for n in odd] for m in odd]

# Interval LDL^T. Each exact symmetric matrix entry lies inside J.
# Induction encloses each exact pivot; strictly positive lower endpoints
# certify positive definiteness without a floating eigensolver.
L=[[iv.mpf(int(i==j)) for j in range(4)] for i in range(4)]
pivots=[]
for j in range(4):
    pivot=J[j][j]-sum((L[j][k]**2*pivots[k] for k in range(j)),iv.mpf(0))
    assert pivot > 0, (j,str(pivot))
    pivots.append(pivot)
    for i in range(j+1,4):
        L[i][j]=(J[i][j]-sum((L[i][k]*L[j][k]*pivots[k] for k in range(j)),iv.mpf(0)))/pivot

determinants=[]
prod=iv.mpf(1)
for p in pivots:
    prod*=p
    determinants.append(prod)

def display(z):
    return [math.nextafter(float(z.a),-math.inf),math.nextafter(float(z.b),math.inf)]

out={
 'status':'PASS: all four interval LDL pivots are strictly positive',
 'scope':'Leading 4x4 odd Taylor coefficient block for actual theta; no all-orders or global PSD claim',
 'alpha':1,
 'runtime':{'mpmath':mp.__version__,'interval_decimal_precision':iv.dps},
 'parameters':{'theta_terms':TERMS,'midpoint_subintervals':STEPS,'integral_cutoff':R,'taylor_remainder_order':ORDER,'maximum_kappa_derivative':MAX_DERIVATIVE},
 'moment_enclosures':{str(j):display(I[j]) for j in range(1,MOMENTS+1)},
 'origin_enclosures':{str(j):display(k[j]) for j in range(0,MOMENTS,2)},
 'jet_matrix':[[display(x) for x in row] for row in J],
 'ldl_pivots':[display(x) for x in pivots],
 'leading_determinants':[display(x) for x in determinants],
 'exact_interval_pivots':[str(x) for x in pivots],
 'exact_interval_determinants':[str(x) for x in determinants],
 'taylor_error_upper_bounds':{str(j):display(errors[j])[1] for j in range(1,MOMENTS+1)},
 'whole_moment_tail_upper_bounds':{str(j):display(tails[j])[1] for j in range(1,MOMENTS+1)},
 'uniform_derivative_series_tail_upper_bounds':[display(x)[1] for x in series_tails],
 'derivative_polynomials':[{str(d):str(c) for d,c in p.items()} for p in polynomials],
 'elapsed_seconds':time.time()-start,
 'trust_basis':'mpmath 1.3.0 elementary outward-rounded interval arithmetic, exact rational recurrences, Taylor remainder and explicit infinite-tail estimates; not proof-assistant verification'
}
(HERE/'theta-odd-higher-jet-interval.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({k:out[k] for k in ['status','ldl_pivots','leading_determinants','elapsed_seconds']},indent=2))
