"""Own-source exact pivot-normalized CD and local Green checks."""
import sympy as s
for N in range(6):
 f=s.symbols('f:'+str(N+2));g=s.symbols('g:'+str(N+2));a=s.symbols('a:'+str(N+1));p=s.symbols('p:'+str(N+1),nonzero=True)
 total=0
 for j in range(N+1):
  df=f[j+1]-a[j]*f[j]+(p[j]/p[j-1]*f[j-1] if j else 0)
  dg=g[j+1]-a[j]*g[j]+(p[j]/p[j-1]*g[j-1] if j else 0)
  total+=(df*g[j]-f[j]*dg)/p[j]
 assert s.simplify(total-(f[N+1]*g[N]-f[N]*g[N+1])/p[N])==0
u,a,b=s.symbols('u a b');F=s.Function('F')(u);P=s.Function('P')(u)
next=s.diff(F,u,2)+a*F-b*P
rhs=a*u*F**2-b*u*P*F-u*next*F+s.diff(u*F*s.diff(F,u)-F**2/2,u)
assert s.simplify(rhs-u*s.diff(F,u)**2)==0
print('PASS: six pivot-normalized CD identities and regional Green identity.')
