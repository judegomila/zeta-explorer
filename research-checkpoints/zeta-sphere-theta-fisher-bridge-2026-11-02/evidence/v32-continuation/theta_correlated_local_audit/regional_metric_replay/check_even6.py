"""Owned full-theta degree6 regional signed remainder and exact correction test."""
import sys,math,json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,arb_series,ctx
ctx.prec=192;ctx.cap=17
N=int(sys.argv[1]) if len(sys.argv)>1 else 4000
assert N%16==0
pi=arb.pi();h=arb_series([0,1],17);C=2**21*math.factorial(16)*4**16
assert (arb(1)/2)*(1-arb(3)/(2*pi))**-17<2**19
assert 3*2**19/pi<2**20
assert (arb(10)/9)**36*(-19*pi).exp()<arb(1)/2
fac=[(-1)**j*math.factorial(2*j)/arb(4)**j for j in range(8)]
def calc(u,derivative):
 z=pi*(2*u).exp();Z=z*(2*h).exp();r=arb_series([0],17)
 for n in range(2,9):r+=n*n*(2*n*n*Z-3)/(2*Z-3)*(-(n*n-1)*Z).exp()
 eps=2*C*9**36*z**16*(-80*z).exp()
 r=arb_series([r[j]+arb(0,(eps/math.factorial(j)).upper()) for j in range(17)],17)
 ell=h/2+(2*Z-3).log()+Z.log()-Z+(1+r).log()
 Q0=arb_series([2*ell[j] if j>0 and j%2==0 else arb(0) for j in range(15)],15)
 ex=Q0.exp()
 g=[fac[j]*ex[2*j] for j in range(8)]
 psi=4*(u/2).exp()*(2*z*z-3*z)*(-z).exp()*(1+r[0]);psi2=psi*psi
 weight=2*u*u*psi2
 if not derivative:return [weight*v for v in g]
 Q1=arb_series([2*(j+1)*ell[j+1] if j>0 and j%2==0 else arb(0) for j in range(15)],15)
 Q2=arb_series([2*(j+1)*(j+2)*ell[j+2] if j>0 and j%2==0 else arb(0) for j in range(15)],15)
 ex1=ex*Q1;ex2=ex*(Q2+Q1*Q1)
 l=ell[1];k=2*ell[2]
 w1=(4*u+4*u*u*l)*psi2
 w2=(4+16*u*l+4*u*u*(k+2*l*l))*psi2
 return [w2*g[j]+2*w1*fac[j]*ex1[2*j]+weight*fac[j]*ex2[2*j] for j in range(8)]
sums=[[arb(0) for _ in range(8)] for _ in range(2)]
width=arb(2)/N
for i in range(N):
 mid=arb(2*i+1)/N;u=mid+arb(0,arb(1)/N)
 vals=calc(mid,False);second=calc(u,True)
 reg=0 if i<N//16 else 1
 for j in range(7):sums[reg][j]+=width*vals[j]+arb(0,(abs(second[j]).upper()*width**3/24).upper())
z=arb(100);e=8*math.factorial(16)*4**16*2**36*z**16*(-3*z).exp()
assert e<arb('1e-10')
# For derivatives through16 the composition bound must be checked explicitly.
assert math.factorial(16)*e*(1+e)**15<1
for j in range(2,17):
 rr=arb(3)/(2*z)
 assert (arb(1)/2)*(1-rr)**-17<1
 assert 2**j*z+2**j*math.factorial(j-1)*rr/(1-rr)**j+1<2**(j+2)*math.factorial(j)*z
Z=pi*arb(4).exp();tails=[]
for j in range(7):
 tail=256/pi.sqrt()*math.factorial(2*j)*9**j*Z**(arb(9)/2+j)*(-2*Z).exp()
 tails.append(tail);sums[1][j]+=arb(0,tail.upper())
def solve(m):
 m=[arb(0)]+m[:7]
 d1=m[1];l21=m[2]/d1;l31=m[3]/d1;d2=m[3]-m[2]*l21;l32=(m[4]-m[2]*l31)/d2;d3=m[5]-m[3]*l31-d2*l32*l32
 assert all(x.lower()>0 for x in [d1,d2,d3])
 y1=m[4];y2=m[5]-l21*y1;y3=m[6]-l31*y1-l32*y2
 cost=y1*y1/d1+y2*y2/d2+y3*y3/d3
 x3=y3/d3;x2=y2/d2-l32*x3;x1=y1/d1-l21*x2-l31*x3
 return m[7]-cost,[-x1,-x2,-x3],[d1,d2,d3,l21,l31,l32]
def quad(d,v):
 d1,d2,d3,l21,l31,l32=d
 return d1*(v[0]+l21*v[1]+l31*v[2])**2+d2*(v[1]+l32*v[2])**2+d3*v[2]**2
sc,zc,dc=solve(sums[0]);st,zt,dt=solve(sums[1]);sg,zg,dg=solve([a+b for a,b in zip(*sums)])
vc=quad(dc,[a-b for a,b in zip(zc,zg)]);vt=quad(dt,[a-b for a,b in zip(zt,zg)]);v=vc+vt;combined=sc+st+v
out={'N':N,'bits':ctx.prec,'split':'|u|=1/8','regions':{name:{'moments':{j:{'lo':str(sums[k][j].lower()),'hi':str(sums[k][j].upper())} for j in range(7)},'old_pivots':[str(x) for x in ds[:3]],'coefficients':[str(x) for x in zz]} for k,(name,zz,ds) in enumerate([('core',zc,dc),('tail',zt,dt)])},'directed':{name:{'lo':str(x.lower()),'hi':str(x.upper())} for name,x in [('s_core',sc),('s_tail',st),('variation_core',vc),('variation_tail',vt),('variation_total',v),('combined',combined),('direct_global_schur',sg)]},'tail_bounds':[str(t.upper()) for t in tails],'combined_positive':bool(combined.lower()>0),'scope':'Independent complete-theta normalized degree6 calculation, using old regional inverses only. Target moments computed, never used as assumptions. No all-shift or all-degree conclusion.'}
print(json.dumps(out,indent=2))
