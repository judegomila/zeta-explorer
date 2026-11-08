"""Exact algebra, independent normalizations, and an auxiliary obstruction.

The interval certificate uses only Fraction arithmetic and a proved exp tail.
mpmath values are separate diagnostics. No all-order xi sign is certified.
"""
from fractions import Fraction as F
from decimal import Decimal, localcontext, ROUND_FLOOR, ROUND_CEILING
import json
import sympy as s
import mpmath as mp

# Symbolic identities in the proof notes.
x,y,A,B,a,p,q,Lp,Lq=s.symbols('x y A B a p q Lp Lq', positive=True)
det=A*B/(x*y)-(A+B)**2/(x+y)**2
assert s.factor(det-(x*A-y*B)*(x*B-y*A)/(x*y*(x+y)**2))==0
tau2=x*y*(x*A-y*B)/(x*B-y*A)
C=A*B*(x*x-y*y)/(x*B-y*A)
assert s.factor(C*x/(x*x+tau2)-A)==0
assert s.factor(C*y/(y*y+tau2)-B)==0
double=Lp/(p*p*q)+Lq/(q*q*p)-(Lp/p**2+Lq/q**2)/(p+q)
assert s.factor(double-(Lp+Lq)/(p*q*(p+q)))==0
shift=x*y/((x+a)*(y+a))-(x+y)**2/(x+y+2*a)**2
assert s.factor(shift+a*(x-y)**2*(a+x+y)/((a+x)*(a+y)*(2*a+x+y)**2))==0
zr,zi,rr,ri=s.symbols('zr zi rr ri', real=True)
z=zr+s.I*zi;R=rr+s.I*ri
numerator=s.expand(s.re((z*R+a)*s.conjugate(z+a*R)))
assert s.expand(numerator-((zr*zr+zi*zi+a*a)*rr+a*(1+rr*rr+ri*ri)*zr))==0

# Exact rational interval arithmetic: no floating rounding in the certificate.
def iv(v):
    return (F(v),F(v))
def add(u,v):
    return (u[0]+v[0],u[1]+v[1])
def neg(u):
    return (-u[1],-u[0])
def sub(u,v):
    return add(u,neg(v))
def mul(u,v):
    products=[u[i]*v[j] for i in (0,1) for j in (0,1)]
    return min(products),max(products)
def div(u,v):
    assert v[0]>0 or v[1]<0, 'division interval contains zero'
    return mul(u,(1/v[1],1/v[0]))
def power(u,n):
    ans=iv(1)
    for _ in range(n):
        ans=mul(ans,u)
    return ans
def dec_interval(u):
    result=[]
    for val,rounding in zip(u,(ROUND_FLOOR,ROUND_CEILING)):
        with localcontext() as ctx:
            ctx.prec=24;ctx.rounding=rounding
            result.append(str(Decimal(val.numerator)/Decimal(val.denominator)))
    return result

# For exp(1/4), terms after degree 24 have successive ratio <= 1/(4*26).
term=F(1);partial=term
for k in range(1,25):
    term/=4*k;partial+=term
first_omitted=term/(4*25)
exp_bound=(partial,partial+first_omitted/(1-F(1,4*26)))

# Auxiliary kappa=e^-u²(3/2+cosh u); its L at integer nodes is rational in r=e^1/4.
def aux_L(k):
    high=power(exp_bound,2*k+1)
    denominator=mul(iv(4),add(add(mul(iv(3),power(exp_bound,k)),high),exp_bound))
    return add(iv(F(k,8)),div(sub(high,exp_bound),denominator))
values=[aux_L(k) for k in range(1,5)]
matrix=[[div(add(values[i],values[j]),iv(i+j+2)) for j in range(4)] for i in range(4)]
pivots=[]
for k in range(4):
    pivot=matrix[k][k];pivots.append(pivot)
    assert (pivot[0]>0 if k<3 else pivot[1]<0)
    for i in range(k+1,4):
        for j in range(i,4):
            value=sub(matrix[i][j],div(mul(matrix[i][k],matrix[k][j]),pivot))
            matrix[i][j]=value;matrix[j][i]=value
det_bound=iv(1)
for pivot in pivots:
    det_bound=mul(det_bound,pivot)
assert det_bound[1]<0

# Independent high-precision checks against the completed xi definition.
mp.mp.dps=70
def xi(sigma):
    return sigma*(sigma-1)*mp.pi**(-sigma/2)*mp.gamma(sigma/2)*mp.zeta(sigma)/2
def xi_L(w):
    sigma=w+mp.mpf('0.5')
    return mp.diff(xi,sigma)/xi(sigma)
def gamma_A(w):
    return (mp.digamma(mp.mpf('1.25')+w/2)-mp.digamma(mp.mpf('1.25')))/2
c0=(mp.log(mp.pi)-mp.digamma(mp.mpf('1.25')))/2
errors=[];oscillators=[]
for x0,y0 in [('2','1'),('0.75','0.25'),('7','3')]:
    xx,yy=mp.mpf(x0),mp.mpf(y0);aa,bb=xi_L(xx),xi_L(yy)
    tau=xx*yy*(xx*aa-yy*bb)/(xx*bb-yy*aa)
    cc=aa*bb*(xx*xx-yy*yy)/(xx*bb-yy*aa)
    assert tau>0 and cc>0
    errors.extend([abs(cc*xx/(xx*xx+tau)-aa),abs(cc*yy/(yy*yy+tau)-bb)])
    oscillators.append({'nodes':[x0,y0],'tau':mp.nstr(mp.sqrt(tau),20),'C':mp.nstr(cc,20)})
for w in [mp.mpf('0.2'),mp.mpf('0.7'),mp.mpc(2,3)]:
    sigma=w+mp.mpf('0.5')
    b=lambda zz:(zz-1)*mp.zeta(zz)
    remainder=mp.diff(b,sigma)/b(sigma)-c0
    errors.append(abs(xi_L(w)-gamma_A(w)-remainder))
# At s=1 the combined B'/B is Euler's constant; no separate pole evaluation.
limit=gamma_A(mp.mpf('0.5'))+mp.euler-c0
independent_limit=1+mp.euler/2-mp.log(4*mp.pi)/2
errors.append(abs(limit-independent_limit))
assert max(errors)<mp.mpf('1e-60')

print(json.dumps({
    'exact_symbolic_identities':'passed',
    'auxiliary_certificate':{
        'arithmetic':'exact Fraction intervals; directed Decimal display only',
        'kernel':'exp(-u^2)*(3/2+cosh(u))',
        'nodes':[1,2,3,4],
        'exp_degree':24,
        'ldl_pivots':[dec_interval(v) for v in pivots],
        'determinant':dec_interval(det_bound),
        'conclusion':'First three LDL pivots positive; fourth negative. This is not the actual theta kernel.'
    },
    'normalization_diagnostics':{'checks':len(errors),'max_absolute_error':mp.nstr(max(errors),8),'oscillators':oscillators},
    'scope':'No later actual-xi pivot is certified; all-orders positivity remains open.'
},indent=2))
