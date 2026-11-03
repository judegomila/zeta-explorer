"""Owned full-theta compact curvature certificate, with explicit orbit tails."""
import sys,json,math
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=160
N=int(sys.argv[1]) if len(sys.argv)>1 else 4000
pi=arb.pi()
def polys(j):
 c=[0,-12,8]
 for _ in range(j):
  d=[arb(0)]*(len(c)+1)
  for k,v in enumerate(c):d[k]+=(arb(1)/2+2*k)*v;d[k+1]-=2*v
  c=d
 return c
def poly(c,z):
 y=arb(0)
 for v in reversed(c):y=y*z+v
 return y
ps=[polys(j) for j in range(5)]
def T(j):return 40*(2*j+7)**j*(2*(j+2))**(j+2)
assert (arb(1)/2)*(1-arb(3)/(2*pi))**(-5)<14
assert (arb(10)/9)**12*(-19*pi).exp()<arb(1)/2
mins=[]
for i in range(N):
 u=arb(2*i+1)/(2*N)+arb(0,arb(1)/(2*N));z=pi*(2*u).exp()
 def score(z):
  return [6/(2*z-3)-2*z,-24*z/(2*z-3)**2-4*z,48*z*(2*z+3)/(2*z-3)**3-8*z,-96*z*(4*z*z+24*z+9)/(2*z-3)**4-16*z]
 r=[arb(0) for j in range(5)];s1=score(z)
 for n in range(2,9):
  rn=n*n*(2*n*n*z-3)/(2*z-3)*(-(n*n-1)*z).exp()
  dn=[a-b for a,b in zip(score(n*n*z),s1)]
  v,x,y,w=dn
  bell=[arb(1),v,v*v+x,v**3+3*v*x+y,v**4+6*v*v*x+3*x*x+4*v*y+w]
  for j in range(5):r[j]+=rn*bell[j]
 tail=393216*9**12*z**4*(-80*z).exp()
 r=[v+arb(0,tail.upper()) for v in r]
 den=1+r[0];assert den.lower()>0
 delta2=r[2]/den-r[1]**2/den**2
 delta4=r[4]/den-4*r[3]*r[1]/den**2-3*r[2]**2/den**2+12*r[2]*r[1]**2/den**3-6*r[1]**4/den**4
 k=-4*z-24*z/(2*z-3)**2+delta2
 k2=-16*z-96*z*(4*z*z+24*z+9)/(2*z-3)**4+delta4
 value=4*k*k+k2
 if not value.lower()>0:raise RuntimeError((i,str(value),str(k)))
 mins.append(value.lower())
z=arb(20);eps=201326592*z**4*(-3*z).exp()
assert eps<arb('3e-13')
assert eps+7*eps**2+12*eps**3+6*eps**4<arb('1e-12')
# Single-orbit remainder |k1''+16z|<=3 for z>=20.
assert arb(96)*(4+arb(24)/20+arb(9)/400)/(20*(2-arb(3)/20)**4)<3
print(json.dumps({'N':N,'bits':ctx.prec,'compact_interval':[0,1],'minimum_directed_lower':str(min(mins)), 'tail_log_derivative_error_upper':str((eps+7*eps**2+12*eps**3+6*eps**4).upper()),'claim':'4*((log psi) second derivative)^2+(log psi) fourth derivative>0; compact cells plus separate analytic tail z>=20.'},indent=2))
