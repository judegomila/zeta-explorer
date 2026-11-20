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
# Local failure includes an interval, not just a floating sample.
g,_=calc(arb(1)/200000000+arb(0,arb(1)/200000000))
local=pivots(g)
print([str(v) for v in local],file=sys.stderr)
assert local[0].lower()>0 and local[1].lower()>0 and local[2].upper()<0
sums=[[arb(0) for _ in range(6)] for _ in range(2)]
width=arb(2)/N
for i in range(N):
 u=arb(2*i+1)/N+arb(0,arb(1)/N);g,w=calc(u)
 reg=0 if i<N//4 else 1
 for j in range(1,6):sums[reg][j]+=width*w*g[j]
z=arb(100);e=8*math.factorial(10)*4**10*2**24*z**10*(-3*z).exp()
assert e<arb('1e-10')
for j in range(2,11):
 rr=arb(3)/(2*z)
 assert 2**j*z+2**j*math.factorial(j-1)*rr/(1-rr)**j+1<2**(j+2)*math.factorial(j)*z
Z=pi*arb(4).exp();tails=[]
for j in range(1,6):
 tail=256/pi.sqrt()*math.factorial(2*j)*9**j*Z**(arb(9)/2+j)*(-2*Z).exp()
 tails.append(tail);sums[1][j]+=arb(0,tail.upper())
out={'N':N,'bits':ctx.prec,'local_interval':[0,'1/100000000'],'local_pivots':[{ 'lo':str(v.lower()),'hi':str(v.upper())} for v in local], 'regions':{name:{'moments':{j:{'lo':str(sums[k][j].lower()),'hi':str(sums[k][j].upper())} for j in range(1,6)},'pivots':[{ 'lo':str(v.lower()),'hi':str(v.upper())} for v in pivots(sums[k])], 'positive':all(v.lower()>0 for v in pivots(sums[k]))} for k,name in enumerate(['core_0_to_half','tail_half_to_infinity'])}, 'tail_bounds':[str(v.upper()) for v in tails], 'scope':'Actual odd old block degrees1,3,5 only. No degree7 target moments or next reserve used.'}
print(json.dumps(out,indent=2))
