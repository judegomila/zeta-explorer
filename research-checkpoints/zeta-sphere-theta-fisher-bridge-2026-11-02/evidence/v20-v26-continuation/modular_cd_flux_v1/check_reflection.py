"""Own-source exact finite modular-reflection matrix identities."""
import sympy as s
x=s.symbols('x');a=s.Rational(1,4)
for N in range(7):
 T=[s.Integer(1),x];d=[s.Integer(1),s.Integer(2)]
 for j in range(1,N+1):
  T.append(s.expand(x*T[-1]+(j+1)**2*T[-2]));d.append(d[-1]*(j+2))
 basis=[T[j]/d[j] for j in range(N+1)]
 def coords(p):
  out=[0]*(N+1)
  for j in range(N,-1,-1):
   out[j]=s.expand(p).coeff(x,j)*d[j];p=s.expand(p-out[j]*basis[j])
  assert p==0
  return out
 R=s.Matrix([coords(T[j].subs(x,2*a-x)/d[j]) for j in range(N+1)])
 X=s.zeros(N+1)
 for j in range(N):X[j,j+1]=d[j+1]/d[j];X[j+1,j]=-d[j+1]/d[j]
 Z=T[N+1]/d[N]
 r=s.Matrix([coords(s.expand(Z.subs(x,2*a-x)-(-1)**(N+1)*Z))])
 en=s.zeros(N+1,1);en[N]=1
 assert R*R==s.eye(N+1)
 assert X*R+R*X-2*a*R==-en*r
 assert r[N]==2*a*(N+1)*(-1)**N
 G=s.eye(N+1)+R.T*R
 assert R.T*G*R==G
 v=R.T*en;rr=r.T;ww=R.T*rr
 C=G*X-X*G
 assert C==4*a*R.T*R-v*r-rr*v.T
 assert R.T*C*R==4*a*s.eye(N+1)-en*ww.T-ww*en.T
 assert ww[N]==2*a*(N+1)
 assert ww==(-1)**N*rr
 zz=s.Matrix(s.symbols('z:'+str(N+1)))
 square=4*a*sum((zz[j]-zz[N]*ww[j]/(4*a))**2 for j in range(N))-(4*a*N+sum(ww[j]**2 for j in range(N))/(4*a))*zz[N]**2
 assert s.expand((zz.T*(4*a*s.eye(N+1)-en*ww.T-ww*en.T)*zz)[0]-square)==0
print('PASS: R²=I, rank-one boundary defect, top coefficient, positive invariant metric, rank-two commutator and one-defect square for N=0..6.')
