"""Own-source diagnostic, NOT interval-certified: full-theta even n2 Schur heat budget."""
import math,json
import numpy as np
from scipy.integrate import quad_vec,quad
from functools import lru_cache
# P_j from d[4 exp(h/2-z)P]/dh =4exp(h/2-z)[P/2+2z(P'-P)]
from numpy.polynomial import Polynomial as Poly
P=[Poly([0,-3,2])]
for j in range(2): P.append(.5*P[-1]+2*Poly([0,1])*(P[-1].deriv()-P[-1]))
def psi(h):
 x=abs(h); z=math.pi*np.arange(1,11,dtype=float)**2*math.exp(2*x)
 e=4*np.exp(x/2-z)
 out=np.array([np.dot(e,p(z)) for p in P]);out[1]*=1 if h>=0 else -1
 return out
@lru_cache(maxsize=1024)
def calc(lam,a=.25):
 def features(u):
  p,p1,p2=psi(u);r=a+2*lam*u;e=math.exp(a*u+lam*u*u)
  return e*p,e*(p1+r*p),e*(p2+2*r*p1+(r*r+2*lam)*p)
 def first(u):
  g,g1,g2=features(u)
  return u*np.array([g*g,-g*g2,g2*g2])
 vals,err=quad_vec(first,-3,3,epsabs=1e-10,epsrel=2e-11,points=[0])
 A,b,d=vals;alpha=b/A;S=(d-b*b/A)*math.pi/2
 def second(u):
  g,g1,g2=features(u)
  f=-g2-alpha*g
  f1=-(u*g2+2*g1)-alpha*u*g
  f2=-(u*u*g2+4*u*g1+2*g)-alpha*u*u*g
  # G1[p],G2[p],G0[p'],G1[p']; actual QF'[p],Q[p']
  return np.array([f1*f1,f2*f2,4*g1*g1,4*(g+u*g1)**2,u*f1*f1,4*u*g1*g1])
 v,e=quad_vec(second,-3,3,epsabs=1e-9,epsrel=2e-11,points=[0]);v*=math.pi/2
 B=math.sqrt(v[0]*v[1])+math.sqrt(v[2]*v[3]);D=v[4]-v[5]
 def paired(u):
  def one(x):
   g,g1,g2=features(x);f=-g2-alpha*g
   return x**3*f*f-4*x*x*f*g1
  return one(u)+one(-u)
 Bpaired=math.pi/2*quad(lambda u:max(paired(u),0),0,3,epsabs=1e-9,epsrel=1e-10,limit=300)[0]
 return dict(lam=lam,A=A*math.pi/2,alpha=alpha,S=S,B=B,D=D,Bpaired=Bpaired,QFprime=v[4],Qpprime=v[5],relative_quad_error=max(float(err),float(e))/S)
rows=[]
for L in [.01,.1,.5,1.0]:
 end=calc(L);integ,err=quad(lambda l:2*calc(l)['B'],0,L,epsabs=1e-7,epsrel=1e-9)
 paired,_=quad(lambda l:2*calc(l)['Bpaired'],0,L,epsabs=1e-7,epsrel=1e-8)
 signed,_=quad(lambda l:2*calc(l)['D'],0,L,epsabs=1e-7,epsrel=1e-9)
 rows.append(dict(Lambda=L,terminal=end,budget_over_terminal=integ/end['S'],paid_lower_bound=end['S']-integ,paired_budget_over_terminal=paired/end['S'],paired_paid_lower_bound=end['S']-paired,signed_identity_error=end['S']-signed-calc(0)['S']))
print(json.dumps(dict(initial=calc(0),rows=rows,scope='Floating diagnostic, ten theta orbits and |u|<=3; no rigorous truncation or quadrature certification.'),indent=2))
