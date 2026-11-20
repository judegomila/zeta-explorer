"""Self-authored Arb enclosure; tail inequalities documented in CERTIFICATE.md."""
import sys,json,time
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=128
N=int(sys.argv[1]) if len(sys.argv)>1 else 2400
L=int(sys.argv[2]) if len(sys.argv)>2 else 40
pi=arb.pi();a=arb(1)/4;dh=arb(3)/N;dl=arb(1)/L
err=arb(0,arb('1e-140'));tail=arb(0,arb('1e-100'))
assert 664*arb(363)**5*(-arb(363)).exp()/(1-arb('1e-20')) < arb('1e-140')
assert 100000*arb(3)**3*(-arb(1200)).exp()<arb('1e-100')
base=[]
for k in range(N):
 u=arb((arb(3)*(2*k+1)/(2*N)),arb(3)/(2*N))
 vals=[arb(0),arb(0),arb(0)]
 for n in range(1,11):
  z=pi*n*n*(2*u).exp();e=4*(u/2-z).exp()
  vals[0]+=e*(-3*z+2*z*z)
  vals[1]+=e*(-arb(15)/2*z+15*z*z-4*z**3)
  vals[2]+=e*(-arb(75)/4*z+arb(165)/2*z*z-56*z**3+8*z**4)
 base.append((u,*[x+err for x in vals]))
def feats(lam):
 out=[]
 for u,p,p1,p2 in base:
  e=(lam*u*u).exp();w=e*p;v=e*(p1+2*lam*u*p);q=e*(p2+4*lam*u*p1+(4*lam*lam*u*u+2*lam)*p)
  ep=(a*u).exp();em=(-a*u).exp()
  out.append((u,ep*w,ep*(v+a*w),ep*(q+2*a*v+a*a*w),em*w,em*(-v+a*w),em*(q-2*a*v+a*a*w)))
 return out
def moments(data):
 A=b=d=arb(0)
 for u,g,g1,g2,h,h1,h2 in data:
  A+=u*(g*g-h*h)*dh;b+=u*(g1*g1-h1*h1)*dh;d+=u*(g2*g2-h2*h2)*dh
 return A+tail,b+tail,d+tail
A,b,d=moments(feats(arb(1)));S=d-b*b/A
budget=arb(json.load(open('/workspace/shared/zeta_sphere_campaign/paid_relaxation_audit/certificate.json'))['budget_unscaled'])
paid=S-budget
assert paid>0
print(json.dumps({'terminal_lower':str(S.lower()),'terminal_upper':str(S.upper()),'budget_upper':str(budget.upper()),'paid_lower':str(paid.lower()),'PASS':True},indent=2))
