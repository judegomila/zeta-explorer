import numpy as np, sympy as s
from scipy.integrate import quad_vec
z=s.symbols('z');P=2*z*z-3*z;pp=[]
for k in range(10):
 pp.append(s.lambdify(z,P,'numpy'));P=s.expand((s.Rational(1,2)-2*z)*P+2*z*s.diff(P,z))
def derivs(h,n=8):
 zz=np.pi*np.arange(1,9)**2*np.exp(2*h);fac=4*np.exp(h/2-zz);return np.array([np.sum(fac*pp[k](zz)) for k in range(n+1)])
def integrand(h):
 d=derivs(h);X=np.array([2*h*d[j]+(j*d[j-1] if j else 0) for j in range(8)]);Y=np.array([(j*d[j-1] if j else 0) for j in range(8)]);return np.stack((np.outer(X,X),np.outer(Y,Y)))
M,err=quad_vec(integrand,0,2.5,epsabs=1e-8,epsrel=1e-13);GX,GY=M
for n in range(1,8):
 inds=np.arange(n%2,n,2,dtype=int); G=GX[np.ix_(inds,inds)];Q=(GX-GY)[np.ix_(inds,inds)];bx=GX[inds,n];by=GY[inds,n]; top=(GX-GY)[n,n]
 A=GX[n,n]-(bx@np.linalg.solve(G,bx) if len(inds) else 0); q=top-((bx-by)@np.linalg.solve(Q,bx-by) if len(inds) else 0)
 print(n,'delta=',(n+1)*q/A,'q=',q,'A=',A,'oldQeig=',np.linalg.eigvalsh(Q)[0] if len(inds) else None)
print('quad absolute scalar bound',err)
