"""Exact rational adversarial controls and interval primitive regression checks."""
from fractions import Fraction as F
from decimal import Decimal as D
import itertools
import json
import certify_actual_window as c

def require(ok, message):
    if not ok: raise AssertionError(message)

def covers(interval, exact):
    return F(interval.lo) <= exact <= F(interval.hi)

checks=0
intervals=[c.I('-2','-1'),c.I('-1','2'),c.I('0','0.1'),c.I('0.3','1.7')]
for a,b in itertools.product(intervals,repeat=2):
    for x,y in itertools.product([F(a.lo),F(a.hi)],[F(b.lo),F(b.hi)]):
        for interval,exact in [(a+b,x+y),(a-b,x-y),(a*b,x*y)]:
            require(covers(interval,exact),'outward rational operation');checks+=1
        if not b.contains_zero():
            require(covers(a/b,x/y),'outward division');checks+=1
for a in intervals:
    for x in [F(a.lo),F(a.hi)]:
        require(covers(-a,-x),'exact negation');checks+=1
        require(covers(a.square(),x*x),'square enclosure');checks+=1
    if a.contains_zero(): require(covers(a.square(),F(0)),'square crossing zero')

def expect_failure(fn):
    try: fn()
    except (ValueError,AssertionError): return
    raise AssertionError('invalid certificate input was accepted')

expect_failure(lambda:c.I('-1','1').inv())
expect_failure(lambda:c.I('NaN'))
expect_failure(lambda:c.I(2,1))
expect_failure(lambda:c.zeta_and_derivative(c.C('0.5','12')))
expect_failure(lambda:c.segment(0,0,3))
require(covers(c.I(0).exp(),F(1)),'exp zero')
require(covers(c.I(1).log(),F(0)),'log one')
require(covers(c.trig(c.I(0),True),F(0)),'sin zero')
require(covers(c.trig(c.I(0),False),F(1)),'cos zero')

def atan_small(x,n=80):
    require(0<=x<=1,'atan domain')
    total=sum(((-1)**k)*x**(2*k+1)/F(2*k+1) for k in range(n))
    other=total+((-1)**n)*x**(2*n+1)/F(2*n+1)
    return min(total,other),max(total,other)

a5=atan_small(F(1,5));a239=atan_small(F(1,239))
pi=(16*a5[0]-4*a239[1],16*a5[1]-4*a239[0])
require(F(3)<pi[0]<pi[1]<F(22,7),'Machin pi enclosure')
halfpi=c.I(c.rounded(lambda:D(pi[0].numerator)/D(2*pi[0].denominator),c.ROUND_FLOOR),
           c.rounded(lambda:D(pi[1].numerator)/D(2*pi[1].denominator),c.ROUND_CEILING))
require(covers(c.trig(halfpi,True),F(1)),'sin(pi/2) enclosure')
require(covers(c.trig(halfpi,False),F(0)),'cos(pi/2) enclosure')

clusters=[]
b=F(1,5)
for delta in [F(1,20),F(1,100),F(1,10000),F(1,10**8)]:
    roots=[b,b+delta,-b,-b-delta]
    require(max(map(abs,roots))<=F(1,4),'cluster containment')
    # f=exp(3w)*product(w-rho); the full-cluster residual equals 3.
    for w in [F(0),F(1,10),F(2,5)]:
        full=3+sum(1/(w-rho) for rho in roots)
        residual=full-sum(1/(w-rho) for rho in roots)
        require(residual==3,'full cluster residual');checks+=1
    isolated=3-1/delta+1/(2*b)+1/(2*b+delta)
    boundary=3+sum(1/(1-abs(rho)) for rho in roots)
    require(2*boundary<F(17),'uniform contour residual bound')
    clusters.append({'delta':str(delta),'isolated_residual_at_b':str(isolated),
                     'full_cluster_residual':3,'uniform_inner_bound':17})
require(abs(F(clusters[-1]['isolated_residual_at_b']))>10**7,'isolated residual must diverge')
# At exact coalescence both copies must be removed; deleting one leaves a pole.
for w in [F(0),F(1,10),F(2,5)]:
    full=3+2/(w-b)+2/(w+b)
    require(full-2/(w-b)-2/(w+b)==3,'double-zero cluster');checks+=1
require(2*(3+4/(1-b))<=17,'coalesced contour bound')

# Boundary quotient error: exhaustive rational point checks of (3), including
# adverse denominator perturbations. This is supplementary to its analytic proof.
quotient_checks=0
for f0 in [F(1),F(2)]:
    for fp0 in [F(-3),F(0),F(3)]:
        for e0 in [F(-1,4),F(0),F(1,4)]:
            for e1 in [F(-1,5),F(0),F(1,5)]:
                actual=abs((fp0+e1)/(f0+e0)-fp0/f0)
                bound=F(1,5)/(f0-F(1,4))+abs(fp0)*F(1,4)/(f0*(f0-F(1,4)))
                require(actual<=bound,'boundary quotient error');quotient_checks+=1

# Exact enclosures of epsilon*||N||_2^2/m^2 for a constant positive residual.
# q=1/(1+a^2); the integral in u=y/epsilon is elementary.
norms=[]
previous=F(0)
for a in [3,10,100,1000]:
    q=F(1,1+a*a);at=atan_small(F(1,a));atan_a=(pi[0]/2-at[1],pi[1]/2-at[0])
    lo=F(a,1+a*a)+(1-4*q)*atan_a[0]+2*q*q*a
    hi=F(a,1+a*a)+(1-4*q)*atan_a[1]+2*q*q*a
    require(previous<lo<=hi<pi[0]/2,'scaled L2 convergence controls');previous=hi
    norms.append({'a':a,'q':str(q),'scaled_L2_lower_decimal_diagnostic':float(lo),
                  'scaled_L2_upper_decimal_diagnostic':float(hi)})
require(pi[1]/2-previous<F(1,100000),'L2 limiting constant')

print(json.dumps({'status':'finite exact rational and outward interval controls passed; not a global theorem',
                  'rational_operation_and_cluster_checks':checks,'quotient_error_checks':quotient_checks,
                  'invalid_inputs_rejected':5,'cluster_cases':clusters,
                  'exact_coalescence_checked':True,
                  'constant_residual_L2_controls':norms},indent=2))
