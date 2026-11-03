"""UNVALIDATED floating witness search; not used as proof. Final fixed witnesses are independently interval-certified."""
import numpy as np,sympy as s
from scipy.integrate import quad_vec
from scipy.linalg import eigh
z=s.symbols('z');P=2*z*z-3*z;pp=[]
for k in range(10):
 pp.append(s.lambdify(z,P,'numpy'));P=s.expand((s.Rational(1,2)-2*z)*P+2*z*s.diff(P,z))
def ds(h):
 zz=np.pi*np.arange(1,9)**2*np.exp(2*h);fac=4*np.exp(h/2-zz);return np.array([np.sum(fac*p(zz)) for p in pp])
def ff(h):
 d=ds(h);X=np.array([2*h*d[j]+(j*d[j-1] if j else 0) for j in range(10)]);Y=np.array([(j*d[j-1] if j else 0) for j in range(10)]);return np.stack((np.outer(X,X),np.outer(Y,Y)))
M,err=quad_vec(ff,0,2.5,epsabs=1e-5,epsrel=1e-13);GX,GY=M
for n in (6,7,8,9):
 ids=np.arange(n%2,n+1,2,dtype=int);G=GX[np.ix_(ids,ids)];Q=(GX-GY)[np.ix_(ids,ids)];ev,vec=eigh(Q,G);v=vec[:,0];v/=v[-1];print('degree',n,'rho',ev[0],'polynomial',v);print('scaleX',np.sqrt(v@G@v));
