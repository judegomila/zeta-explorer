import numpy as np, sympy as s
from scipy.integrate import quad_vec
z=s.symbols('z');P=2*z*z-3*z;pp=[]
for k in range(10):
 pp.append(s.lambdify(z,P,'numpy'));P=s.expand((s.Rational(1,2)-2*z)*P+2*z*s.diff(P,z))
def derivs(h,n=8):
 zz=np.pi*np.arange(1,9)**2*np.exp(2*h);fac=4*np.exp(h/2-zz);return np.array([np.sum(fac*pp[k](zz)) for k in range(n+1)])
c=-derivs(0)[2]/derivs(0)[0];print('c=',c)
def integ(h):
 d=derivs(h);n=8; X=np.array([2*h*d[j]+(j*d[j-1] if j else 0) for j in range(n)]);Y=np.array([(j*d[j-1] if j else 0) for j in range(n)]);X0=np.array([-2/c*d[j+1]-(j*d[j-1] if j else 0) for j in range(n)]);E=X-X0;return np.stack([np.outer(v,v) for v in [X,Y,X0,E]])
M,err=quad_vec(integ,0,2.5,epsabs=1e-8,epsrel=1e-13);GX,GY,G0,GE=M;Q=GX-GY
for n in range(1,8):
 old=np.arange(n%2,n,2,dtype=int); p=np.zeros(8);p[n]=1
 if len(old):p[old]=-np.linalg.solve(Q[np.ix_(old,old)],Q[old,n])
 a=p@G0@p;b=p@GY@p;e=p@GE@p
 print(n,'Y/X0=',np.sqrt(b/a),'E/X0=',np.sqrt(e/a),'Y limit=',1-1/(4*(n+1)),'E limit=',1/(8*(n+1)),'cross=',(p@(GX-G0-GE)@p)/(2*a))
