"""Own-source Gaussian benchmark: analytic formulas, diagnostic floating quadrature."""
import math, json
from scipy.integrate import quad
from scipy.optimize import brentq

def S(n,a,b):
 return a*math.pi*math.sqrt(2*math.pi)/8*math.factorial(n)*b**(n-1.5)*math.exp(a*a/(2*b))
def ratio(n,a,b):
 A=(2*n+1)*b+a*a
 C=(6*n*n-2*n+3)*b*b+(4*n+6)*a*a*b+a**4
 return math.sqrt(A*C)/(4*a*b*b)+(n*math.sqrt((2*n-1)*b+a*a)/(a*b) if n else 0)
def paid_ratio(n,a,L):
 return 2*quad(lambda l:S(n,a,1-l)*ratio(n,a,1-l),0,L,epsabs=1e-10,epsrel=1e-12)[0]/S(n,a,1-L)
rows=[]
for n in (0,1,2,5,19):
 a=.25; L=.1
 cross=brentq(lambda x:paid_ratio(n,a,x)-1,1e-10,.5)
 rows.append(dict(n=n,a=a,beta=1,Lambda=L,cauchy_budget_over_terminal=paid_ratio(n,a,L),terminal_over_initial=S(n,a,1-L)/S(n,a,1),max_certified_Lambda_by_budget=cross,exact_D_over_S_at_zero=(3-2*n)/4+a*a/4))
print(json.dumps(rows,indent=2))
