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
mins=[]
for i in range(N):
 u=arb(2*i+1)/(2*N)+arb(0,arb(1)/(2*N));z=pi*(2*u).exp()
 ds=[]
 for j in range(5):
  main=sum((u/2).exp()*poly(ps[j],n*n*z)*(-n*n*z).exp() for n in range(1,9))
  # psi_n=n^-1/2 f(u+log n); e^(u/2) factor remains.
  tail=T(j)*(u/2).exp()*(-81*z/2).exp()/(1-(-19*z/2).exp())
  ds.append(main+arb(0,tail.upper()))
 assert ds[0].lower()>0
 r=[d/ds[0] for d in ds]
 k=r[2]-r[1]**2
 k2=r[4]-4*r[3]*r[1]-3*r[2]**2+12*r[2]*r[1]**2-6*r[1]**4
 value=4*k*k+k2
 if not value.lower()>0:raise RuntimeError((i,str(value),str(k)))
 mins.append(value.lower())
z=arb(20);eps=201326592*z**4*(-3*z).exp()
assert eps<arb('3e-13')
assert eps+7*eps**2+12*eps**3+6*eps**4<arb('1e-12')
# Single-orbit remainder |k1''+16z|<=3 for z>=20.
assert arb(96)*(4+arb(24)/20+arb(9)/400)/(20*(2-arb(3)/20)**4)<3
print(json.dumps({'N':N,'bits':ctx.prec,'compact_interval':[0,1],'minimum_directed_lower':str(min(mins)), 'tail_log_derivative_error_upper':str((eps+7*eps**2+12*eps**3+6*eps**4).upper()),'claim':'4*((log psi) second derivative)^2+(log psi) fourth derivative>0; compact cells plus separate analytic tail z>=20.'},indent=2))
