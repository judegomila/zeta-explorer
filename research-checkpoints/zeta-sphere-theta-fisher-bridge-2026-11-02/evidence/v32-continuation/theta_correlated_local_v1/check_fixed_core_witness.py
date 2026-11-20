"""Owned full-theta local failure and regional old-prefix test, degree five only."""
import sys,math,json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,arb_series,ctx
ctx.prec=160;ctx.cap=11
N=int(sys.argv[1]) if len(sys.argv)>1 else 64000
assert N%4==0
pi=arb.pi();h=arb_series([0,1],11);C=2048*math.factorial(10)*4**10
assert (arb(1)/2)*(1-arb(3)/(2*pi))**-11<1024
assert 3*1024/pi<1024
assert (arb(10)/9)**24*(-19*pi).exp()<arb(1)/2
def calc(u):
 z=pi*(2*u).exp();Z=z*(2*h).exp();r=arb_series([0],11)
 for n in range(2,9):r+=n*n*(2*n*n*Z-3)/(2*Z-3)*(-(n*n-1)*Z).exp()
 eps=2*C*9**24*z**10*(-80*z).exp()
 r=arb_series([r[j]+arb(0,(eps/math.factorial(j)).upper()) for j in range(11)],11)
 ell=(2*Z-3).log()+Z.log()-Z+(1+r).log()
 ex=arb_series([2*ell[j] if j>0 and j%2==0 else arb(0) for j in range(11)],11).exp()
 g=[(-1)**j*math.factorial(2*j)*ex[2*j]/4**j for j in range(6)]
 psi=4*(u/2).exp()*(2*z*z-3*z)*(-z).exp()*(1+r[0])
 return g,2*u*u*psi*psi
def pivots(g):
 p1=g[1];p2=g[3]-g[2]**2/p1;p3=g[5]-g[3]**2/p1-(g[4]-g[2]*g[3]/p1)**2/p2
 return [p1,p2,p3]
# Fixed exact witness; floating candidate selection is not a proof dependency.
z=[678,-66,1]
u=arb(1)/200000000+arb(0,arb(1)/200000000)
g,_=calc(u)
value=sum(arb(z[i])*z[j]*g[i+j+1] for i in range(3) for j in range(3))
assert value.upper()<0
print(json.dumps({'witness':z,'interval':[0,'1e-8'],'quadratic_form_lower':str(value.lower()),'quadratic_form_upper':str(value.upper()),'scope':'Fixed integer witness for actual local old block. Every nondegenerate positive-u subinterval in this neighborhood has an indefinite integrated old block.'},indent=2))
