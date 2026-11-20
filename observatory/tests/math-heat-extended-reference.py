"""90-digit, 80-node independent Gaussian-convolution references.
The exact convolution identity follows from the theta transform and
pi^(-1/2) integral exp(-v^2+2av) dv=exp(a^2).
App uses double precision 32-node quadrature (not these nodes/weights).
"""
import json,mpmath as mp
from pathlib import Path
mp.mp.dps=90
X,W=mp.gauss_quadrature(80,'hermite')
SQ=mp.sqrt(mp.pi)
points=[(.5,121,1),(.5,200,1),(.5,500,-1),(.5,2000,-1),(.5,2000,1),(.3,1500,.25),(-128,500,-1),(129,2000,1),(129,0,-1),(-12.1,120.1,.25)]
def xi_pair(s,want):
 flip=mp.re(s)<.5
 if flip:s=1-s
 z=mp.zeta(s);g=mp.exp(mp.loggamma(1+s/2)-s*mp.log(mp.pi)/2);v=g*(s-1)*z
 if not want:return v,0
 dv=g*(z+(s-1)*mp.diff(mp.zeta,s)+(s-1)*z*(mp.digamma(1+s/2)-mp.log(mp.pi))/2)
 return v,-dv if flip else dv
rows=[]
for j,(sigma,t,tau) in enumerate(points):
 s=mp.mpc(sigma,t);a=mp.sqrt(mp.mpc(tau));want=j in (3,4,7)
 vals=[];ds=[]
 for k in range(len(X)):
  v,d=xi_pair(s+a*X[k],want);vals.append(W[k]*v/SQ)
  if want:ds.append(W[k]*d/SQ)
 v=mp.fsum(vals);q=mp.fsum(ds)/v if want else None
 row={'sigma':sigma,'t':t,'tau':tau,'logAbs':float(mp.log(abs(v))),'arg':float(mp.arg(v)),'q':None if q is None else {'re':float(mp.re(q)),'im':float(mp.im(q))}}
 rows.append(row);print('reference',sigma,t,tau,flush=True)
Path(__file__).with_suffix('.json').write_text(json.dumps({'generator':'mpmath 1.3.0, 90 decimal digits, independently computed 80-node Gauss-Hermite quadrature, exact Gaussian-convolution identity','points':rows},indent=2)+'\n')
